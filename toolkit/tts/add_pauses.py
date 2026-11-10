#!/usr/bin/env python3
"""Breathing room before reflective lines (Sam, 10 Nov 2026, from the exurb1a study: he slows down and pauses before the
sincere lines). Lengthens the natural gap before each chosen line by SEC seconds, filled with the take's own quietest
room tone (never digital silence), and shifts every later time in the timing file. Sam's words are never cut or moved
inside a line.
Usage: add_pauses.py VO.wav TIMING.json OUT.wav OUT_timing.json SEC id [id ...]"""
import sys, json, numpy as np, soundfile as sf
vo, tj, ow, otj, sec = sys.argv[1:6]; ids = set(sys.argv[6:]); sec = float(sec)
x, sr = sf.read(vo, dtype='float32'); T = json.load(open(tj)); L = T['lines']
# room tone: the quietest 0.4 s stretch inside a natural gap
fr = int(.02 * sr); e = np.sqrt(np.mean(x[:len(x) // fr * fr].reshape(-1, fr) ** 2, 1))
w = 20; k = int(np.argmin(np.convolve(e, np.ones(w), 'valid'))); tone = x[k * fr:(k + w) * fr]
def fill(n):
    reps = int(np.ceil(n / len(tone))) + 1; y = np.tile(tone, reps)[:n].copy()
    f = min(len(y) // 4, int(.03 * sr)); y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f); return y
cuts = []
for i, l in enumerate(L):
    if l['id'] in ids and i > 0:
        gap0, gap1 = L[i - 1]['end'], l['start']; cuts.append(((gap0 + gap1) / 2 if gap1 > gap0 else gap1, l['id']))
out, prev, shift = [], 0, 0.0; add = {}
for t, lid in sorted(cuts):
    s = int(t * sr); out += [x[prev:s], fill(int(sec * sr))]; prev = s; add[lid] = t
out.append(x[prev:]); sf.write(ow, np.concatenate(out), sr)
ins = sorted(add.values())
def sh(t): return round(t + sec * sum(1 for c in ins if c <= t + 1e-6), 3)
for l in L:
    for key in ('start', 'end'):
        if key in l: l[key] = sh(l[key])
    for wd in l.get('words', []) or []:
        for key in ('start', 'end', 's', 'e'):
            if key in wd: wd[key] = sh(wd[key])
if 'total' in T: T['total'] = round(T['total'] + sec * len(ins), 2)
json.dump(T, open(otj, 'w'), indent=1); print(f'{len(ins)} pauses of {sec} s added: {", ".join(sorted(add))}')
