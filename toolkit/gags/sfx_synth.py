#!/usr/bin/env python3
"""GJ 581g sound-gag synth (12 Nov 2026). Every sound is made from scratch in numpy, so it is ours: no licence, no credit.
Usage:  sfx_synth.py NAME OUT.wav [--dur S] [--seed N]      one sound
        sfx_synth.py all OUTDIR                              every sound, for auditioning
Sounds: bleep, fart, fart_long, sax_sting, clink, sigh, kaching, sad_horn, scratch, sting, boing, crickets
All are 48 kHz mono, peak-normalised to -1 dBFS; the mix sets the level."""
import sys, os, argparse, wave
import numpy as np

SR = 48000

def t_(d): return np.arange(int(SR * d)) / SR

def env(n, a=0.005, r=0.05):
    e = np.ones(n); na, nr = int(SR * a), int(SR * r)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def lp(x, cut):  # one-pole low-pass, run twice
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); s = 0.0
    for _ in range(2):
        for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
        x = y.copy()
    return y

def bp(x, lo, hi): return lp(x, hi) - lp(x, lo)

def saw(f):  # f: per-sample frequency array; band-limited enough for gags
    ph = np.cumsum(f) / SR; return 2 * (ph % 1) - 1

def norm(x, peak=0.89):
    m = np.max(np.abs(x)); return x * (peak / m) if m else x

def bleep(d=0.45, rng=None):
    t = t_(d); return np.sin(2 * np.pi * 1000 * t) * env(len(t), 0.004, 0.01)

def fart(d=0.6, rng=None):
    rng = rng or np.random.default_rng(1); t = t_(d); n = len(t)
    f0 = 95 + 25 * np.sin(2 * np.pi * 2.3 * t) - 30 * t / d          # sagging pitch with a wobble
    f0 *= 1 + 0.06 * rng.standard_normal(n).cumsum() / np.sqrt(n)     # slow random drift
    flutter = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * (22 + 8 * t / d) * t))  # lip flutter
    x = saw(f0) * flutter + 0.25 * rng.standard_normal(n)
    x = lp(x, 900) * env(n, 0.02, 0.12) * (1 - 0.5 * t / d)
    return x

def fart_long(d=1.6, rng=None): return fart(d, rng)

def sax_sting(d=None, rng=None):
    """An original sleazy lick: low slide up, a held note with heavy vibrato, a lazy fall."""
    notes = [(146.8, 0.18, 'slide'), (174.6, 0.16, ''), (220.0, 0.9, 'vib'), (196.0, 0.55, 'fall')]
    out = []
    for f, dur, k in notes:
        t = t_(dur); n = len(t)
        fr = np.full(n, f)
        if k == 'slide': fr = f * (0.94 + 0.06 * np.minimum(1, t / dur * 1.5))
        if k == 'vib': fr = f * (1 + 0.018 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.25))
        if k == 'fall': fr = f * (1 - 0.06 * (t / dur) ** 2)
        x = saw(fr) + 0.5 * saw(fr * 2.003)
        x = bp(x, 400, 2600) + 0.15 * np.sin(2 * np.pi * np.cumsum(fr) / SR)
        breath = 0.04 * np.random.default_rng(2).standard_normal(n)
        out.append((x + bp(breath, 1500, 5000)) * env(n, 0.03, 0.06))
    return np.concatenate(out)

def clink(d=0.9, rng=None):
    t = t_(d); x = np.zeros_like(t)
    for start in (0.0, 0.11):           # two glasses touch
        tt = np.clip(t - start, 0, None); on = t >= start
        for f, a, dec in [(2093, 1, 9), (3378, .6, 12), (5120, .4, 16), (6842, .25, 22)]:
            x += on * a * np.sin(2 * np.pi * f * tt) * np.exp(-dec * tt)
    return x

def sigh(d=1.4, rng=None):
    rng = rng or np.random.default_rng(3); t = t_(d); n = len(t)
    shape = np.sin(np.pi * np.minimum(1, t / d)) ** 1.5 * (1 - 0.4 * t / d)
    x = bp(rng.standard_normal(n), 250, 1800) * shape
    return x + 0.3 * bp(rng.standard_normal(n), 1800, 4500) * shape ** 2

def kaching(d=1.0, rng=None):
    rng = rng or np.random.default_rng(4); t = t_(d)
    drawer = bp(rng.standard_normal(len(t)), 300, 3000) * np.exp(-30 * t) * (t < 0.12)
    bell = sum(a * np.sin(2 * np.pi * f * np.clip(t - 0.1, 0, None)) for f, a in [(1568, 1), (3136, .5), (4704, .3), (2349, .4)])
    return drawer + bell * (t > 0.1) * np.exp(-4 * np.clip(t - 0.1, 0, None))

def sad_horn(d=None, rng=None):
    out = []
    for i, (f, dur) in enumerate([(233.1, .35), (220.0, .35), (207.7, .35), (196.0, 1.1)]):
        t = t_(dur); fr = np.full(len(t), f)
        if i == 3: fr = f * (1 + 0.025 * np.sin(2 * np.pi * 6 * t) * np.minimum(1, t / 0.3))
        x = bp(saw(fr) + 0.4 * saw(fr * 2), 200, 1400)
        out.append(x * env(len(t), 0.03, 0.08))
    return np.concatenate(out)

def scratch(d=0.5, rng=None):
    rng = rng or np.random.default_rng(5); t = t_(d); n = len(t)
    speed = np.where(t < d / 2, np.linspace(1, -1, n), np.linspace(-1, 1.5, n))
    tone = saw(np.abs(speed) * 220 + 30)
    return bp(tone + 0.6 * rng.standard_normal(n), 300, 3500) * env(n, 0.005, 0.05)

def sting(d=None, rng=None):  # dun, dun, DUN on a low brass-ish chord
    out = []
    for f, dur, amp in [(110, .32, .7), (103.8, .32, .7), (98, 1.3, 1.0)]:
        t = t_(dur); x = 0
        for m in (1, 1.189, 1.498, 2):  # minor chord + octave
            x = x + saw(np.full(len(t), f * m)) / m
        out.append(amp * lp(x, 1500) * env(len(t), 0.01, 0.12) * np.exp(-1.2 * t))
    return np.concatenate(out)

def boing(d=0.7, rng=None):
    t = t_(d); f = 180 + 260 * np.exp(-6 * t) * np.abs(np.sin(2 * np.pi * 9 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-3 * t)

def crickets(d=3.0, rng=None):
    t = t_(d); chirp = (np.sin(2 * np.pi * 4.2 * t) > 0.6) * (np.sin(2 * np.pi * 60 * t) > 0)
    return 0.6 * np.sin(2 * np.pi * 4400 * t) * chirp * env(len(t), 0.2, 0.5)

SOUNDS = {k: v for k, v in globals().items() if k in
          'bleep fart fart_long sax_sting clink sigh kaching sad_horn scratch sting boing crickets'.split()}

def write(path, x):
    x = np.clip(norm(x), -1, 1); os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes())

def make(name, dur=None, seed=None):
    rng = np.random.default_rng(seed) if seed is not None else None
    fn = SOUNDS[name]; return fn(dur, rng) if dur else fn(rng=rng) if fn.__code__.co_argcount > 1 else fn()

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('name'); ap.add_argument('out')
    ap.add_argument('--dur', type=float); ap.add_argument('--seed', type=int); a = ap.parse_args()
    if a.name == 'all':
        for k in SOUNDS: write(f'{a.out}/{k}.wav', make(k)); print(k)
    else:
        if a.name not in SOUNDS: sys.exit(f'unknown sound; choose from {", ".join(SOUNDS)}')
        write(a.out, make(a.name, a.dur, a.seed))
