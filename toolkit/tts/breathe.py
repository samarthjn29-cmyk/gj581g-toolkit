#!/usr/bin/env python3
"""Give the narration room to breathe without touching the speech (7 Nov 2026, vector-world pilot: the clone read Plato's Cave
at about 200 words a minute; Emergence runs 152-171, with a music bed filling the pauses).
Inserts silence at sentence ends, a short breath at commas (0.12 s, 7 Nov 2026: reads as thinking, not reading) (after . ? ! :) and longer silence at scene changes, cutting only inside the existing
gap between two words, then shifts every word time in timing.json to match. Nothing is stretched or sped up.
Usage: breathe.py vo.wav timing.json out.wav out_timing.json [--sentence 0.35] [--comma 0.12] [--scene 0.8]"""
import sys, json, re, wave, numpy as np
a = sys.argv; vo, tj, out, otj = a[1:5]
opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
SENT, COMMA, SCENE = opt('--sentence', 0.35), opt('--comma', 0.12), opt('--scene', 0.8)
w = wave.open(vo); sr = w.getframerate(); ch = w.getnchannels(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, ch); w.close()
T = json.load(open(tj)); cuts = []   # (time, seconds to insert)
prev_scene = None
for li, l in enumerate(T['lines']):
    toks = re.findall(r"[A-Za-z0-9']+[.,?!:;]?", l['text']); W = l['words']
    if len(toks) != len(W): print('word count differs, skipping pauses in', l['id']); toks = [''] * len(W)
    if prev_scene is not None and l.get('scene') != prev_scene: cuts.append(((T['lines'][li - 1]['end'] + l['start']) / 2, SCENE))
    elif li: cuts.append(((T['lines'][li - 1]['end'] + l['start']) / 2, SENT))
    for i in range(len(W) - 1):
        p = toks[i][-1:] if toks[i] else ''
        add = SENT if p in '.?!:' and p else COMMA if p in ',;' and p else 0
        if add: cuts.append(((W[i][2] + W[i + 1][1]) / 2, add))
    prev_scene = l.get('scene')
cuts.sort(); parts = []; last = 0
# room tone, not digital silence (7 Nov 2026, Sam heard "background disturbances": the faint noise under the voice
# switched off and on at every inserted pause). Take the quietest 0.25 s between words and loop it, with 12 ms fades.
xf = x.astype(np.float64); F = int(sr * 0.25); best = None
for l in T['lines']:
    for a_, b_ in zip(l['words'], l['words'][1:]):
        i0, i1 = int((a_[2] + 0.02) * sr), int((b_[1] - 0.02) * sr)
        for j in range(i0, i1 - F, F // 2):
            r = np.sqrt(np.mean(xf[j:j + F] ** 2))
            if r > 0 and (best is None or r < best[0]): best = (r, xf[j:j + F])
tone = best[1] if best else np.zeros((F, ch))
FD = int(sr * 0.012); ramp = np.linspace(0, 1, FD)[:, None]
def pad(n):
    reps = -(-n // len(tone)); t = np.concatenate([tone[::1 if k % 2 == 0 else -1] for k in range(reps)])[:n]  # mirrored loop: no seam
    return t
def zc(i):  # nudge a cut to the quietest sample within 5 ms, so it never lands mid-wave
    w = int(sr * 0.005); seg = np.abs(xf[max(0, i - w):i + w].sum(1)); return max(0, i - w) + int(np.argmin(seg)) if len(seg) else i
for tc, add in cuts:
    i = zc(int(tc * sr)); n = int(add * sr); a_ = xf[last:i].copy(); g = pad(n).copy()
    if len(a_) > FD: a_[-FD:] = a_[-FD:] * (1 - ramp) + (tone[:FD] if len(tone) >= FD else 0) * ramp  # cross-fade voice -> room tone
    parts += [a_, g]; last = i
parts.append(xf[last:]); y = np.clip(np.concatenate(parts), -32768, 32767).astype(np.int16)
o = wave.open(out, 'wb'); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr); o.writeframes(y.tobytes()); o.close()
shift = lambda t: t + sum(add for tc, add in cuts if tc < t)
for l in T['lines']:
    l['start'], l['end'] = round(shift(l['start']), 3), round(shift(l['end']), 3)
    l['words'] = [[ww, round(shift(s), 3), round(shift(e), 3)] for ww, s, e in l['words']]
T['total'] = round(len(y) / sr, 3); T['breathe'] = {'sentence': SENT, 'comma': COMMA, 'scene': SCENE}
json.dump(T, open(otj, 'w'), indent=1)
n = sum(len(l['words']) for l in T['lines'])
print(f"{len(cuts)} pauses added, {len(x) / sr:.1f} s -> {len(y) / sr:.1f} s; {n / (T['lines'][-1]['end'] - T['lines'][0]['start']) * 60:.0f} words a minute")
