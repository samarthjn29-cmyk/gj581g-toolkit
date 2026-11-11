#!/usr/bin/env python3
"""In-house comedy sound effects (no credit needed), Aliens opening, 11 Nov 2026.
  trombone  sad "wah-wah-wah-waaah": four falling notes with a plunger-mute wah (Bb3 A3 Ab3 G3, last one long, wobbling)
  boo       a crowd booing: ~40 voices of a low "ooo" vowel (formants 300/870 Hz), each with its own pitch, drift, onset
  popper    two party-popper cracks with paper-confetti rustle
  register  cash register "ka-ching": drawer clunk + bright bell with partials
  kiss      a soft cartoon "mwah": lip smack + short pitched "ah"
Usage: gag_sfx.py OUTDIR [names...]  (48 kHz mono WAV, peak -3 dBFS)"""
import sys, os, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR = 48000
rng = np.random.default_rng(7)
t_ = lambda d: np.arange(int(d * SR)) / SR
def bp(x, lo, hi, o=2): b, a = butter(o, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def lp(x, f, o=2): b, a = butter(o, f / (SR / 2)); return lfilter(b, a, x)
def hp(x, f, o=2): b, a = butter(o, f / (SR / 2), 'high'); return lfilter(b, a, x)
def env(n, a=0.01, r=0.1):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, max(na, 1)); e[-nr:] *= np.linspace(1, 0, max(nr, 1)); return e
def saw(f, t, ph=0): p = np.cumsum(f / SR) + ph; return 2 * (p % 1) - 1
def norm(x, db=-3): return x / (np.max(np.abs(x)) + 1e-9) * 10 ** (db / 20)

def trombone():
    notes = [(233.1, 0.42), (220.0, 0.42), (207.7, 0.42), (196.0, 1.5)]
    out = []
    for i, (f, d) in enumerate(notes):
        t = t_(d); vib = 1 + (0.012 * np.sin(2 * np.pi * 5.5 * t) * (t > 0.3) if i == 3 else 0)
        bend = 1 - (0.03 * np.clip((t - 0.5) / 1.0, 0, 1) if i == 3 else 0)
        x = sum(saw(f * vib * bend * k, t) / k ** 1.1 for k in (1, 2, 3))
        wah = 0.5 + 0.5 * np.sin(2 * np.pi * (2.2 if i == 3 else 1 / d) * t - np.pi / 2)   # plunger opening
        cut = 500 + 1800 * wah
        y = np.zeros_like(x); blk = 480
        for s in range(0, len(x), blk): y[s:s + blk] = lp(x[s:s + blk], float(np.mean(cut[s:s + blk])))
        out.append(y * env(len(t), 0.03, 0.08 if i < 3 else 0.5))
        out.append(np.zeros(int(0.04 * SR)))
    return norm(np.concatenate(out))

def boo(d=2.6):
    t = t_(d); x = np.zeros_like(t)
    for v in range(40):
        f0 = rng.uniform(110, 230) * (1 + 0.04 * np.sin(2 * np.pi * rng.uniform(0.2, 0.7) * t + rng.uniform(0, 6)))
        on = rng.uniform(0, 0.35); amp = rng.uniform(0.4, 1.0)
        g = (t > on) * np.clip((t - on) / 0.15, 0, 1) * np.clip((d - t) / 0.5, 0, 1)
        src = saw(f0, t, rng.uniform())
        voice = 1.0 * bp(src, 250, 380) + 0.35 * bp(src, 780, 950) + 0.08 * bp(src, 2200, 2600)
        x += amp * g * voice
    x += 0.15 * bp(rng.standard_normal(len(t)), 200, 1500) * np.clip((d - t) / 0.5, 0, 1)   # breath of the room
    return norm(x * env(len(t), 0.1, 0.4))

def popper():
    out = np.zeros(int(1.6 * SR))
    for at in (0.0, 0.33):
        i = int(at * SR); n = int(0.03 * SR)
        crack = rng.standard_normal(n) * np.exp(-np.linspace(0, 9, n))
        out[i:i + n] += hp(crack, 900) * 1.0
        rn = int(1.1 * SR); rust = rng.standard_normal(rn) * (rng.random(rn) < 0.08)   # paper confetti flutter
        out[i + n:i + n + rn] += 0.25 * bp(rust, 2500, 9000) * np.exp(-np.linspace(0, 3, rn))[:len(out[i + n:i + n + rn])]
    return norm(out)

def register():
    out = np.zeros(int(1.6 * SR))
    n = int(0.12 * SR); clunk = lp(rng.standard_normal(n), 900) * np.exp(-np.linspace(0, 6, n))
    out[:n] += 0.8 * clunk
    i = int(0.12 * SR); t = t_(1.4)
    bell = sum(a * np.sin(2 * np.pi * 2093 * k * t) * np.exp(-t * (2.5 + k)) for k, a in ((1, 1), (2.76, .5), (5.4, .25), (8.9, .12)))
    out[i:i + len(t)] += bell
    j = int(0.05 * SR); m = int(0.2 * SR)   # drawer slide
    out[j:j + m] += 0.2 * bp(rng.standard_normal(m), 400, 2500) * np.linspace(1, 0, m)
    return norm(out)

def kiss():
    out = np.zeros(int(0.7 * SR))
    n = int(0.02 * SR); out[:n] += hp(rng.standard_normal(n), 1500) * np.exp(-np.linspace(0, 8, n))
    t = t_(0.35); f = 520 - 180 * t / 0.35
    ah = sum(np.sin(2 * np.pi * np.cumsum(f * k) / SR) / k for k in (1, 2, 3)) * env(len(t), 0.02, 0.2)
    i = int(0.05 * SR); out[i:i + len(t)] += 0.6 * bp(ah, 300, 3000)
    return norm(out, -6)

if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    names = sys.argv[2:] or ['trombone', 'boo', 'popper', 'register', 'kiss']
    for n in names:
        x = globals()[n](); wavfile.write(f'{od}/sfx_{n}.wav', SR, (x * 32767).astype(np.int16)); print(n, f'{len(x) / SR:.2f} s')
