#!/usr/bin/env python3
"""Even out the pauses in a narration without touching the speech (7 Nov 2026).
Every gap between two words is set to a TARGET length, not added to:
  sentence end (. ? ! :)  -> --sentence (0.50 s)      comma or ; -> --comma (0.22 s)
  no punctuation          -> left alone unless longer than --inword (0.16 s), then shortened to it
  between scenes          -> --scene (0.90 s)
A gap that is too short gets looped room tone (the quietest stretch between words, never digital silence);
a gap that is too long loses its middle. All joins are cross-faded (12 ms) at the quietest nearby sample.
Word times in timing.json are shifted to match. Nothing is stretched or sped up.
History: v1 ADDED silence on top of the clone's own gaps, so sentence breaks ran to 1.2 s and commas sounded like
breaks, and digital silence switched the noise floor on and off (Sam, 7 Nov: "weird pauses", "weird breaks").
Usage: breathe.py vo.wav timing.json out.wav out_timing.json [--sentence 0.5] [--comma 0.22] [--inword 0.16] [--scene 0.9]"""
import sys, json, re, wave, numpy as np
a = sys.argv; vo, tj, out, otj = a[1:5]
opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
SENT, COMMA, INW, SCENE = opt('--sentence', 0.50), opt('--comma', 0.22), opt('--inword', 0.16), opt('--scene', 0.90)
w = wave.open(vo); sr = w.getframerate(); ch = w.getnchannels(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, ch).astype(np.float64); w.close()
T = json.load(open(tj))
# gaps: (end of word A, start of word B, target)
G = []; prev = None
for li, l in enumerate(T['lines']):
    toks = re.findall(r"[A-Za-z0-9']+[.,?!:;]?", l['text']); W = l['words']
    if len(toks) != len(W): print('word count differs, only sentence/line gaps in', l['id']); toks = [''] * len(W)
    if prev is not None:
        pl = T['lines'][li - 1]; G.append((pl['words'][-1][2], W[0][1], SCENE if l.get('scene') != pl.get('scene') else SENT))
    for i in range(len(W) - 1):
        p = toks[i][-1:] if toks[i] else ''
        tgt = SENT if p and p in '.?!:' else COMMA if p and p in ',;' else None
        g = W[i + 1][1] - W[i][2]
        if tgt is None:
            if g > INW: tgt = INW
            else: continue
        G.append((W[i][2], W[i + 1][1], tgt) if W[i + 1][2] - W[i + 1][1] < 0.6 else (W[i][2], W[i][2] + 0.001, tgt, W[i + 1][2]))  # a word stretched over 0.6 s hides the real gap (Cave 'turns, and')
    prev = l
# room tone: the quietest 0.25 s between words
F = int(sr * 0.25); best = None; cands = []
for e0, s1, *_ in G:
    i0, i1 = int((e0 + 0.03) * sr), int((s1 - 0.03) * sr)
    for j in range(i0, i1 - F, F // 4):
        r = np.sqrt(np.mean(x[j:j + F] ** 2))
        if r > 0: cands.append((r, j))
# the tone: SYNTHESISED noise with the spectrum and level of the voice's own noise floor (the quietest fifth of the
# between-word stretches), random phase, so it never repeats. v2 looped a real 0.25 s snippet and Sam's file carried
# a faint blip every half second (7 Nov 2026).
cands = [c for c in cands if np.abs(x[c[1]:c[1] + F]).max(1).min() >= 1 or c[0] > 20]
rng = np.random.default_rng(3)
if cands:
    rs = sorted(c[0] for c in cands); quiet_set = [c for c in cands if c[0] <= rs[max(0, len(rs) // 5)]][:12]
    spec = np.mean([np.abs(np.fft.rfft(x[j:j + F, 0] * np.hanning(F))) for _, j in quiet_set], 0)
    level = np.median([r for r, _ in quiet_set])
    N = int(sr * 8); S = np.interp(np.fft.rfftfreq(N, 1 / sr), np.fft.rfftfreq(F, 1 / sr), spec)
    nz = np.fft.irfft(S * np.exp(2j * np.pi * rng.random(len(S))), N); nz *= level / (np.sqrt(np.mean(nz ** 2)) + 1e-12)
    tone = np.repeat(nz[:, None], ch, 1)
else: tone = np.zeros((F, ch))
print(f'room tone level {20 * np.log10(np.sqrt(np.mean(tone ** 2)) / 32768 + 1e-12):.0f} dBFS')
def pad(n):
    o = rng.integers(0, max(1, len(tone) - n)) if n < len(tone) else 0
    return tone[o:o + n] if n <= len(tone) else np.concatenate([tone] * (-(-n // len(tone))))[:n]
FD = int(sr * 0.012); ramp = np.linspace(0, 1, FD)[:, None]
def quiet(i, w=0.006):
    w = int(sr * w); s = np.abs(x[max(0, i - w):i + w].sum(1)); return max(0, i - w) + int(np.argmin(s)) if len(s) else i
ops = []  # (sample index, delta samples) : +n insert room tone, -n remove n samples starting there
for gg in G:
    e0, s1, tgt = gg[:3]; lim = gg[3] if len(gg) > 3 else None
    g = max(0.0, s1 - e0); d = tgt - g
    if abs(d) < 0.02: continue
    if s1 - e0 < 0.08:  # the aligner can butt two words together (cfg 0.2 take, 'daylight'/'first'): find the real gap by energy
        lo, hi = int((min(e0, s1) - 0.25) * sr), int(((lim - 0.1) if lim else (max(e0, s1) + 0.25)) * sr); Fq = int(sr * 0.03)
        rms = [(np.sqrt(np.mean(x[j:j + Fq] ** 2)), j + Fq // 2) for j in range(max(0, lo), max(lo + 1, hi - Fq), Fq // 3)]
        mid = min(rms)[1] if rms else quiet(int((e0 + s1) / 2 * sr))
        if rms:  # measure the real gap: the run of frames below -38 dB around the quietest one
            db = [(20 * np.log10(r_ / 32768 + 1e-12), c) for r_, c in rms]; k = min(range(len(db)), key=lambda q: db[q][0]); a_, b_ = k, k
            while a_ > 0 and db[a_ - 1][0] < -38: a_ -= 1
            while b_ < len(db) - 1 and db[b_ + 1][0] < -38: b_ += 1
            g = (db[b_][1] - db[a_][1]) / sr + 0.03; d = tgt - g
            if abs(d) < 0.02: continue
            if d < 0:  # too long: remove from the middle of the measured gap
                n = int(-d * sr); ops.append((mid - n // 2, -n)); continue
    else: mid = quiet(int((e0 + s1) / 2 * sr))
    if d > 0: ops.append((mid, int(d * sr)))
    else:
        n = int(-d * sr); st = max(int((e0 + 0.03) * sr), mid - n // 2); st = min(st, int((s1 - 0.03) * sr) - n)
        if st > int(e0 * sr): ops.append((st, -n))
ops.sort(); parts = []; last = 0; shifts = []
def xfade(tail, head):  # cross-fade the end of tail into the start of head
    if len(tail) > FD and len(head) > FD: tail = tail.copy(); tail[-FD:] = tail[-FD:] * (1 - ramp) + head[:FD] * ramp; head = head[FD:]
    return tail, head
for i, n in ops:
    if i < last: continue
    seg = x[last:i]
    if n > 0:
        g = pad(n); seg, g = xfade(seg, g); parts += [seg, g]; last = i
    else:
        nxt = x[i - n:]; seg, _ = xfade(seg, nxt[:FD * 2]); parts.append(seg); last = i - n + FD
    shifts.append((i / sr, n / sr if n > 0 else (n - FD) / sr))
parts.append(x[last:]); yf = np.concatenate(parts)
# any stretch of digital silence left by the clone's own joins (scene parts, squeezed gaps) also gets room tone
q = np.abs(yf).max(1) < 2; i = 0; MIN = int(sr * 0.03); filled = 0
while i < len(q):
    if q[i]:
        j = i
        while j < len(q) and q[j]: j += 1
        if j - i >= MIN:
            g = pad(j - i).copy(); f = min(FD, (j - i) // 2); r_ = np.linspace(0, 1, f)[:, None]
            g[:f] *= r_; g[len(g) - f:] *= r_[::-1]; yf[i:j] = g; filled += 1
        i = j
    else: i += 1
if filled: print(f'{filled} digital-silence stretches filled with room tone')
y = np.clip(yf, -32768, 32767).astype(np.int16)
o = wave.open(out, 'wb'); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr); o.writeframes(y.tobytes()); o.close()
shift = lambda t: t + sum(d for tc, d in shifts if tc < t)
for l in T['lines']:
    l['start'], l['end'] = round(shift(l['start']), 3), round(shift(l['end']), 3)
    l['words'] = [[ww, round(shift(s), 3), round(shift(e), 3)] for ww, s, e in l['words']]
T['total'] = round(len(y) / sr, 3); T['breathe'] = {'sentence': SENT, 'comma': COMMA, 'inword': INW, 'scene': SCENE, 'mode': 'target'}
json.dump(T, open(otj, 'w'), indent=1)
nw = sum(len(l['words']) for l in T['lines'])
print(f"{sum(1 for _, n in ops if n > 0)} gaps lengthened, {sum(1 for _, n in ops if n < 0)} shortened; {len(x) / sr:.1f} s -> {len(y) / sr:.1f} s; {nw / (T['lines'][-1]['end'] - T['lines'][0]['start']) * 60:.0f} words a minute")
