#!/usr/bin/env python3
"""Quiet tongue/mouth clicks in the pauses of a narration (8 Nov 2026, Sam's own voice).
Only touches pauses between words (from timing.json word times, 60 ms clear of each word): any burst shorter than 30 ms
that jumps 12 dB above the pause's own level is turned down 24 dB with 3 ms fades. Breaths (longer) are kept.
Usage: mouth_clicks.py IN.wav TIMING.json OUT.wav"""
import sys, json, numpy as np, soundfile as sf
x, sr = sf.read(sys.argv[1]); mono = x if x.ndim == 1 else x.mean(1)
T = json.load(open(sys.argv[2])); W = sorted([w for l in T['lines'] for w in l.get('words', [])], key=lambda w: w[1])
gaps = [(0.0, W[0][1] - 0.06)] + [(e0 + 0.06, s1 - 0.06) for (_, _, e0), (_, s1, _) in zip(W, W[1:])] + [(W[-1][2] + 0.06, len(mono) / sr)]
gain = np.ones(len(mono)); n = int(0.005 * sr); fade = int(0.003 * sr); hits = 0
for a, b in gaps:
    i0, i1 = int(a * sr), int(b * sr)
    if i1 - i0 < 4 * n: continue
    seg = mono[i0:i1]; fr = seg[:len(seg) // n * n].reshape(-1, n); e = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
    base = np.median(e); hot = e > base + 12; k = 0
    while k < len(hot):
        if hot[k]:
            j = k
            while j < len(hot) and hot[j]: j += 1
            if (j - k) * n <= 0.03 * sr:                      # short burst = click, not a breath
                s0, s1 = i0 + k * n - fade, i0 + j * n + fade
                g = np.full(s1 - s0, 10 ** (-24 / 20)); g[:fade] = np.linspace(1, g[fade], fade); g[-fade:] = np.linspace(g[-fade - 1], 1, fade)
                gain[s0:s1] = np.minimum(gain[s0:s1], g); hits += 1
            k = j
        else: k += 1
y = x * (gain[:, None] if x.ndim > 1 else gain); sf.write(sys.argv[3], y, sr); print(f'{hits} clicks quietened')
