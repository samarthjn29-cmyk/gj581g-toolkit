#!/usr/bin/env python3
"""Season sting candidates for Where Colour Lives (MUS-006), made in-house (no licence, no credit needed).
Each is 3.0 s, calm, for the series title card. usage: season_sting.py OUTDIR
  A glass  - three bell tones (FM), a slow spread major chord, long decay
  B pad    - a soft warm pad that swells in and settles (detuned saws, low-passed)
  C prism  - the three cone notes rising (long, medium, short: low, mid, high), a soft mallet each, then a held fifth"""
import sys, os, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 48000
def t(d): return np.arange(int(d * SR)) / SR
def env(d, a, r):
    x = t(d); e = np.minimum(1, x / a) * np.exp(-x / r); return e
def bell(f, d, r=1.6):
    x = t(d); m = np.sin(2 * np.pi * f * 1.4 * x) * 2.0 * np.exp(-x * 3)
    return np.sin(2 * np.pi * f * x + m) * env(d, 0.008, r)
def saw(f, d):
    x = t(d); return 2 * ((x * f) % 1) - 1
def lp(x, fc): b, a = butter(2, fc / (SR / 2)); return lfilter(b, a, x)
def place(buf, x, at): i = int(at * SR); buf[i:i + len(x)] += x[: len(buf) - i]; return buf
def norm(x, peak=0.6): return x / (np.abs(x).max() + 1e-9) * peak
def fade(x, s=0.4):
    n = int(s * SR); x[-n:] *= np.linspace(1, 0, n); return x
D = 3.0
def A():
    b = np.zeros(int(D * SR))
    for k, f in enumerate([293.66, 440.0, 554.37, 739.99]):  # D4 A4 C#5 F#5
        b = place(b, bell(f, D - k * 0.12, 1.5) * (0.9 - 0.12 * k), k * 0.12)
    return fade(norm(b))
def B():
    x = t(D); e = np.minimum(1, x / 1.1) * np.where(x > 2.1, np.exp(-(x - 2.1) * 3), 1)
    s = sum(saw(f * dt, D) for f in [146.83, 220.0, 277.18] for dt in (0.997, 1.003))
    return fade(norm(lp(s, 900) * e, 0.55))
def C():
    b = np.zeros(int(D * SR))
    for k, f in enumerate([220.0, 329.63, 493.88]):  # A3 E4 B4 rising
        b = place(b, bell(f, 1.8, 0.9) * 0.8, k * 0.35)
    hold = (np.sin(2 * np.pi * 220 * t(1.9)) + 0.6 * np.sin(2 * np.pi * 329.63 * t(1.9))) * env(1.9, 0.3, 1.2) * 0.35
    b = place(b, hold, 1.05)
    return fade(norm(b))
if __name__ == "__main__":
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    for name, fn in (("A_glass", A), ("B_pad", B), ("C_prism", C)):
        wavfile.write(os.path.join(out, f"sting_{name}.wav"), SR, (fn() * 32767).astype(np.int16)); print(name)
