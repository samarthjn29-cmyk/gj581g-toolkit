#!/usr/bin/env python3
"""Find breaths and exhaled air in a narration and turn them down hard (default -30 dB, 25 ms ramps).
A breath here = a run of at least 90 ms that is aperiodic (no pitch), noise-like (flat spectrum) and quieter than
--max dBFS (default -26: S, SH and F sounds in words are louder and sit right against voiced sound, so they stay).
7 Nov 2026, Sam on the Cave voice v4: "weird breath or like air sounds". Our S sounds matched his real recording,
so it was the clone's copied breaths and phrase-end exhales.
Usage: breath_cut.py in.wav out.wav [--db 30] [--max -26] [--list]"""
import sys, numpy as np, soundfile as sf
a = sys.argv; x, sr = sf.read(a[1]); mono = x.mean(1) if x.ndim > 1 else x
D = float(a[a.index('--db') + 1]) if '--db' in a else 30.0; MAXL = float(a[a.index('--max') + 1]) if '--max' in a else -26.0
F, H = int(sr * 0.03), int(sr * 0.01)
def frame(i):
    s = mono[i:i + F]; l = 20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-12)
    w = s - s.mean(); ac = np.correlate(w, w, 'full')[F - 1:]; lo, hi = int(sr / 400), int(sr / 70)
    per = ac[lo:hi].max() / (ac[0] + 1e-12)                      # pitch strength: voiced speech > 0.4
    X = np.abs(np.fft.rfft(s * np.hanning(F))) + 1e-12; f = np.fft.rfftfreq(F, 1 / sr); b = (f > 300) & (f < 8000)
    flat = np.exp(np.mean(np.log(X[b]))) / np.mean(X[b])
    return l, per, flat
idx = list(range(0, len(mono) - F, H)); L, P, FL = map(np.array, zip(*[frame(i) for i in idx]))
voiced = (P > 0.45) & (L > -45)
airy = (~voiced) & (L > -60) & (L < MAXL) & (FL > 0.18)
# guard: a frame within 30 ms of a voiced frame is a consonant edge, not a breath
near_v = np.convolve(voiced.astype(float), np.ones(7), 'same') > 0
airy &= ~near_v
runs = []; i = 0
while i < len(airy):
    if airy[i]:
        j = i
        while j < len(airy) and airy[j]: j += 1
        if (j - i) * H / sr >= 0.09: runs.append((idx[i], idx[j - 1] + F, L[i:j].max()))
        i = j
    else: i += 1
g = np.ones(len(mono)); k = 10 ** (-D / 20); R = int(sr * 0.025)
for s, e, _ in runs:
    s = max(0, s - R // 2); e = min(len(g), e + R // 2); n = e - s
    env = np.full(n, k); r = min(R, n // 2); env[:r] = np.linspace(1, k, r); env[n - r:] = np.linspace(k, 1, r); g[s:e] = np.minimum(g[s:e], env)
sf.write(a[2], x * (g[:, None] if x.ndim > 1 else g), sr)
if '--list' in a:
    for s, e, l in runs: print(f'  {s / sr:6.2f}-{e / sr:6.2f}s  {(e - s) / sr:.2f}s  peak {l:.0f} dBFS')
print(f'{len(runs)} breaths/air turned down {D:.0f} dB -> {a[2]}')
