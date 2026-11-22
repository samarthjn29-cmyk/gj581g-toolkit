#!/usr/bin/env python3
"""Own (in-house) sounds for the SFX kits that synthesis does well, 22 Nov 2026 (study of Chris Moran's "The VOX
Sound Design System", analysis only; his folder list names them, the sounds are ours). Deterministic (fixed seeds).
  low_whoosh v1-v3   air moving past, low-centred (Moran: "something with a low frequency sounds best" for an
                     emerging object or a push-in); three lengths and bands, so a move is never sounded twice the same.
  ui_tick v1-v2      a soft, slightly digital tick (a pixel or a small screen element changing; "not too much").
  tape_hiss          analog ambience loop: cassette hiss, gently modulated (12 s, seamless).
  vinyl_crackle      analog ambience loop: sparse crackle and dust over a faint rumble (12 s, seamless).
  mains_hum          analog ambience loop: 50 Hz hum with soft harmonics and air (12 s, seamless).
Usage: sfx-synth.py OUTDIR   (writes the raw files; level them with sfx-prep.py one/loop)."""
import os, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter, sosfilt

SR = 48000
rng = np.random.default_rng(581)
t_ = lambda d: np.arange(int(d * SR)) / SR


def sos_bp(lo, hi, o=2):
    return butter(o, [lo / (SR / 2), hi / (SR / 2)], "band", output="sos")


def lp(x, f, o=2):
    b, a = butter(o, f / (SR / 2))
    return lfilter(b, a, x)


def hp(x, f, o=2):
    b, a = butter(o, f / (SR / 2), "high")
    return lfilter(b, a, x)


def norm(x, db=-3):
    return x / (np.max(np.abs(x)) + 1e-12) * 10 ** (db / 20)


def pink(n):
    w = rng.standard_normal(n)
    f = np.fft.rfft(w)
    k = np.arange(len(f))
    k[0] = 1
    return np.fft.irfft(f / np.sqrt(k), n)


def whoosh(d, f0, f1, peak=0.55, width=1.6):
    # band-passed noise whose centre sweeps f0 -> f1, swelling to `peak` of its length and falling away
    t = t_(d)
    n = pink(len(t)) * 3
    y = np.zeros_like(n)
    blk = 240
    for i in range(0, len(n), blk):
        u = i / len(n)
        fc = f0 * (f1 / f0) ** u
        y[i:i + blk] = sosfilt(sos_bp(max(40, fc / width), min(16000, fc * width)), n[max(0, i - 2400):i + blk])[-len(n[i:i + blk]):]
    u = t / d
    e = np.where(u < peak, (u / peak) ** 2.2, ((1 - u) / (1 - peak)) ** 1.6)
    return norm(lp(y * e, 6000))


def ui_tick(f, d=0.06):
    t = t_(d)
    body = np.sin(2 * np.pi * f * t) * np.exp(-t * 90)
    click = hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 900) * 0.5
    return norm(body * 0.7 + click)


def seamless(x, xf=0.5):
    n = int(xf * SR)
    r = np.linspace(0, 1, n)
    y = x[:-n].copy()
    y[:n] = x[-n:] * (1 - r) + x[:n] * r
    return y


def tape_hiss(d=12.5):
    t = t_(d)
    n = hp(pink(len(t)), 2500) + 0.4 * hp(rng.standard_normal(len(t)), 6000)
    mod = 1 + 0.06 * np.sin(2 * np.pi * 0.7 * t) + 0.03 * np.sin(2 * np.pi * 3.1 * t)  # wow and flutter in the level
    return norm(seamless(lp(n * mod, 12000)))


def vinyl_crackle(d=12.5):
    t = t_(d)
    x = 0.08 * lp(pink(len(t)), 120)  # rumble
    for _ in range(int(d * 26)):  # dust ticks
        i = rng.integers(0, len(t) - 400)
        L = int(rng.integers(20, 160))
        x[i:i + L] += rng.standard_normal(L) * np.hanning(L) * rng.uniform(0.05, 0.6)
    for _ in range(int(d * 2)):  # a few bigger pops
        i = rng.integers(0, len(t) - 600)
        L = int(rng.integers(150, 500))
        x[i:i + L] += lp(rng.standard_normal(L), 3000) * np.hanning(L) * rng.uniform(0.4, 1.0)
    x += 0.03 * hp(pink(len(t)), 3000)  # surface noise
    return norm(seamless(hp(x, 30)))


def mains_hum(d=12.5):
    t = t_(d)
    x = sum(a * np.sin(2 * np.pi * 50 * k * t + k) for k, a in ((1, 1.0), (2, 0.5), (3, 0.28), (4, 0.12), (6, 0.05)))
    x *= 1 + 0.04 * np.sin(2 * np.pi * 0.23 * t)
    x += 0.15 * lp(pink(len(t)), 900)  # room air
    return norm(seamless(x))


def main():
    od = sys.argv[1]
    os.makedirs(od, exist_ok=True)
    out = {
        "low_whoosh_v1": whoosh(0.70, 180, 900, 0.55),
        "low_whoosh_v2": whoosh(0.95, 140, 650, 0.62, 1.8),
        "low_whoosh_v3": whoosh(0.55, 240, 1300, 0.48, 1.5),
        "ui_tick_v1": ui_tick(1850),
        "ui_tick_v2": ui_tick(2350, 0.05),
        "tape_hiss": tape_hiss(),
        "vinyl_crackle": vinyl_crackle(),
        "mains_hum": mains_hum(),
    }
    for k, x in out.items():
        wavfile.write(os.path.join(od, k + ".wav"), SR, (x * 32767).astype(np.int16))
        print(k, f"{len(x) / SR:.2f} s")


if __name__ == "__main__":
    main()
