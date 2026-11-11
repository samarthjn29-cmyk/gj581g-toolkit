#!/usr/bin/env python3
"""Move every gag sound in a mix script into the nearest gap between spoken words (Sam's rule: gag sounds never sit on a
word). For each `file.wav@T:LUFS:DUR` in MIX, it finds the gap nearest T (within 1.5 s) that holds the sound, starting
0.04 s after a word ends; if the gap is shorter than the sound, the sound is shortened to fit (never below 0.22 s).
Sounds that find no gap are listed and left alone. Rewrites MIX in place (keeps MIX.bak).
Use it while placing sounds for a NEW mix; on a dense mix Sam already approved it moves sounds away from their gags (ch1/ch2 test, 12 Nov 2026), so do not run it there.
Usage: sfx_snap.py MIX.sh TIMELINE.json [--max 0.8] [--drop]   (--max: furthest a sound may move from its gag; --drop: remove sounds with no gap that near, and repeats of one sound in the same gap)"""
import json, re, sys, shutil, os
a = sys.argv[1:]; mix, tl = a[:2]; MAX = float(a[a.index('--max') + 1]) if '--max' in a else 1.5; DROP = '--drop' in a
T = json.load(open(tl)); W = T['words']; D = T['dur']; used = {}
gaps = [(0.0, W[0][1])] + [(a[2], b[1]) for a, b in zip(W, W[1:])] + [(W[-1][2], D)]
gaps = [(a + 0.04, b - 0.04) for a, b in gaps if b - a > 0.3]
src = open(mix).read(); out = []
def fix(m):
    f, t, lufs, dur = m.group(1), float(m.group(2)), m.group(3), m.group(4)
    d = float(dur) if dur else 0.4
    best = None
    for a, b in gaps:
        if b - a < 0.22: continue
        s = min(max(t, a), b - min(d, b - a))
        if abs(s - t) <= MAX and (best is None or abs(s - t) < abs(best[0] - t)): best = (s, min(d, b - s))
    if not best:
        out.append(f"{'DROPPED' if DROP else 'NO GAP'} {os.path.basename(f)} @{t}"); return '' if DROP else m.group(0)
    s, nd = best
    key = (os.path.basename(f), round(s, 1))
    if DROP and key in used: out.append(f'DROPPED duplicate {key[0]} @{t} (same gap as @{used[key]})'); return ''
    used[key] = t
    if abs(s - t) > 0.01 or nd < d - 0.01: out.append(f'{os.path.basename(f)}: {t:.2f} -> {s:.2f}' + (f' (cut to {nd:.2f} s)' if nd < d - 0.01 else ''))
    return f'{f}@{s:.2f}:{lufs}' + (f':{nd:.2f}' if dur or nd < d - 0.01 else '')
new = re.sub(r'([\w$./]+\.wav)@([\d.]+):(-?[\d.]+)(?::([\d.]+))?', fix, src)
shutil.copy(mix, mix + '.bak'); open(mix, 'w').write(new); print('\n'.join(out) or 'all sounds already in gaps')
