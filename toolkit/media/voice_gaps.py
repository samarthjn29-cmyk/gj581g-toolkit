#!/usr/bin/env python3
"""Let each gag sound play out, then bring the voice back (Sam, 12 Nov 2026: "allow the sounds to play until they deliver
their required effect and then we bring in my voice").

Sam's recording is never edited; the only change is SILENCE INSERTED IN A PAUSE BETWEEN WORDS. For every sound in the mix:
  - its gag moment is the time in the mix (`file.wav@T:LUFS[:DUR]`);
  - it is moved to the pause that follows the word ending nearest T (never more than --reach s away; a sound before the
    first word goes in front of it);
  - it plays for its effect length = min(DUR or its natural length, its natural length, --cap) starting 0.06 s after that
    word ends; several sounds in one pause play one after another (--overlap lets the next start before the last ends);
  - if the pause is shorter than the sound plus --after (0.15 s), silence is inserted in the middle of the pause so the next
    word starts only after the sound has finished.
Writes the lengthened voice, a shifted timing JSON (line start/end), and a new mix script with every sound at its new time
(same files, levels and effect lengths). Pictures follow automatically when the chapter is rebuilt from the new voice,
because shots and cards are cued on words.
Usage: voice_gaps.py VO.wav TIMING.json TIMELINE.json MIX.sh OUT_VO.wav OUT_TIMING.json OUT_MIX.sh [--cap 2.0] [--reach 1.2]
                     [--after 0.15] [--overlap 0.35] [--keep name1,name2]   (--keep: sounds that stay where they are, e.g. a
                     whoosh on a picture cut that is meant to sit under the voice)"""
import json, re, sys, subprocess
import numpy as np, soundfile as sf
a = sys.argv[1:]; vo, timing, tl, mix, ovo, otiming, omix = a[:7]
opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
CAP, REACH, AFTER, OVL = opt('--cap', 2.0), opt('--reach', 1.2), opt('--after', 0.15), opt('--overlap', 0.35)
KEEP = set(a[a.index('--keep') + 1].split(',')) if '--keep' in a else set()
T = json.load(open(tl)); W = T['words']; t0 = T.get('t0', 0)
src = open(mix).read()
pat = re.compile(r'([\w$./]+\.wav)@([\d.]+):(-?[\d.]+)(?::([\d.]+))?')
env = {'$S': 'sfx', '$R': 'sfx_real'}
def nat(f):
    p = f
    for k, v in env.items(): p = p.replace(k, v)
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout or 0.5)
snd = []
for m in pat.finditer(src):
    f, t, lufs, dur = m.group(1), float(m.group(2)), m.group(3), m.group(4)
    n = nat(f); eff = min(float(dur) if dur else n, n, CAP)
    snd.append(dict(f=f, t=t, lufs=lufs, eff=round(eff, 2), keep=any(k in f for k in KEEP)))
# gaps: (index, word end, next word start); index -1 = before the first word. Only real pauses (>= 0.12 s) count.
ends = [(-1, 0.0, W[0][1])] + [(i, W[i][2], W[i + 1][1] if i + 1 < len(W) else T['dur']) for i in range(len(W))]
ends = [g for g in ends if g[2] - g[1] >= 0.12 or g[0] == -1]
punct = lambda g: g[0] >= 0 and W[g[0]][0].rstrip()[-1:] in '.,?!;:'
plan = {}
for s in sorted(snd, key=lambda s: s['t']):
    if s['keep']: continue
    # the joke lands at the end of its phrase: first pause after the cue that ends a phrase (within 2.5 s),
    # else the nearest pause after it, else the nearest one before (within --reach)
    if s['t'] <= W[0][1] + 0.1: plan.setdefault(-1, []).append(s); continue   # a sound at the very start plays before the first word
    after = [g for g in ends if g[2] > s['t'] + 0.1]   # pauses not yet over at the cue (a cue inside a pause uses that pause)
    g = next((g for g in after if g[1] <= s['t'] <= g[2]), None) or next((g for g in after if punct(g) and g[1] - s['t'] <= 2.5), None) or next((g for g in after if g[1] - s['t'] <= REACH), None)
    if g is None:
        before = [g for g in ends if s['t'] - REACH <= g[1] < s['t']]
        if not before: s['keep'] = True; print('no pause near', s['f'], s['t'], '(left as is)'); continue
        g = before[-1]
    plan.setdefault(g[0], []).append(s)
# the sound starts inside the pause (40% in, where it is certainly silent) and silence is inserted right there, so the next
# word comes only after the sound has played out, however the transcription later places the word edges
# word edges from the transcription can be 0.3 s off, so the pause itself is found in the waveform: the longest quiet run
# (20 ms frames under -42 dB of the peak) between the two words; the silence goes in 30% into that run and the voice is
# taken to come back where the run ends. Never cuts into a word.
Y, SR = sf.read(vo, always_2d=True); mono = np.abs(Y).mean(axis=1); fr = int(0.02 * SR)
rms = np.sqrt(np.convolve(mono ** 2, np.ones(fr) / fr, 'same'))[::fr]; thr = rms.max() * 10 ** (-42 / 20)
def quiet(a, b):
    i0, i1 = max(0, int((a + t0) / 0.02)), min(len(rms), int((b + t0) / 0.02) + 1); best, cur = None, None
    for i in range(i0, i1):
        if rms[i] < thr: cur = (cur[0], i) if cur else (i, i)
        else:
            if cur and (not best or cur[1] - cur[0] > best[1] - best[0]): best = cur
            cur = None
    if cur and (not best or cur[1] - cur[0] > best[1] - best[0]): best = cur
    return (best[0] * 0.02 - t0, (best[1] + 1) * 0.02 - t0) if best else None
ins = []
for gi, ss in sorted(plan.items()):
    e, nxt = [g for g in ends if g[0] == gi][0][1:]
    q = quiet(e - 0.15, nxt + 0.25) if gi >= 0 else (0.0, max(0.0, nxt - 0.02))   # before the first word: the sound plays first, then the voice
    if gi >= 0 and (not q or q[1] - q[0] < 0.04): print('no clean pause for', [x['f'] for x in ss], 'at', round(e, 2), '(left as is)'); [x.update(keep=True) for x in ss]; continue
    nxt = q[1]; p = q[0] + 0.3 * (q[1] - q[0]) if gi >= 0 else 0.0
    cur = 0.0; end = 0.0
    for s in ss:
        s['at_p'] = (p, cur); end = max(end, cur + s['eff']); cur += max(0.12, s['eff'] - OVL)
    need = end + AFTER - (nxt - p)
    ins.append((p, round(max(0.0, need), 3)))
shift = lambda x: x + sum(d for (q, d) in ins if q < x - 1e-6)
# new voice: insert zeros (timeline time + t0 = time in the chapter voice file)
y, sr = Y, SR; out, last = [], 0
for p, d in sorted(ins):
    k = int(round((p + t0) * sr)); out += [y[last:k], np.zeros((int(round(d * sr)), y.shape[1]), y.dtype)]; last = k
out.append(y[last:]); sf.write(ovo, np.concatenate(out), sr)
J = json.load(open(timing))
for l in J['lines']:
    l['start'] = round(shift(l['start'] - t0) + t0, 3); l['end'] = round(shift(l['end'] - t0) + t0, 3)
J['total'] = round(J.get('total', 0) + sum(d for _, d in ins), 3); json.dump(J, open(otiming, 'w'), indent=1)
def newt(s):
    if 'at_p' not in s: return shift(s['t'])
    p, rel = s['at_p']; return shift(p) + rel
it = iter(sorted(snd, key=lambda s: s['t'])); lookup = {}
for s in snd: lookup.setdefault((s['f'], s['t']), []).append(s)
def rep(m):
    s = lookup[(m.group(1), float(m.group(2)))].pop(0); nt = newt(s)
    return f"{s['f']}@{nt:.2f}:{s['lufs']}:{s['eff']:.2f}"
new = pat.sub(rep, src).replace('clips/AL_', 'clips/AL_', 1)
open(omix, 'w').write(new)
tot = sum(d for _, d in ins)
print(f'{len(snd)} sounds, {len(ins)} pauses lengthened, +{tot:.1f} s in total (chapter {T["dur"]:.1f} -> {T["dur"] + tot:.1f} s)')
for p, d in sorted(ins): print(f'  pause at {p:6.2f}s  +{d:.2f}s')
