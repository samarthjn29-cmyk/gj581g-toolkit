#!/usr/bin/env python3
"""Lower everything between words by DB (default 10 dB) using the aligned word times: breaths, hiss and the clone's
faint background drop away, words are never touched (60 ms ramps, starting 60 ms after a word, ending 50 ms before the next).
7 Nov 2026, Sam: "just focus on my voice": the pauses sat at about -43 dBFS (24 dB under speech); after this about -59.
Usage: pause_duck.py in.wav timing.json out.wav [--db 10]"""
import sys, json, numpy as np, soundfile as sf
a = sys.argv; x, sr = sf.read(a[1]); T = json.load(open(a[2])); D = float(a[a.index('--db') + 1]) if '--db' in a else 10.0
ws = [w for l in T['lines'] for w in l['words']]; g = np.ones(len(x)); R = int(sr * 0.06); k = 10 ** (-D / 20)
for s, e in [(0, ws[0][1])] + [(p[2], q[1]) for p, q in zip(ws, ws[1:])] + [(ws[-1][2], len(x) / sr)]:
    i, j = int((s + 0.06) * sr), int((e - 0.05) * sr)
    if j - i < 2 * R: continue
    env = np.full(j - i, k); env[:R] = np.linspace(1, k, R); env[-R:] = np.linspace(k, 1, R); g[i:j] = np.minimum(g[i:j], env)
sf.write(a[3], x * (g[:, None] if x.ndim > 1 else g), sr); print('ducked pauses by', D, 'dB ->', a[3])
