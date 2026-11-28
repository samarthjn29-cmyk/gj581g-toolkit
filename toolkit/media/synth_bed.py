#!/usr/bin/env python3
"""In-house ambient and cinematic synth beds (28 Nov 2026; Sam: "I want to start using ambient and cinematic synth
kind of music"). Written in code, so there is nothing to license or credit ("Music: original synth bed (Mild
Astonishment)"). Two characters, one chord plan and one returning figure, so a bed can be laid under an act on the
act's own clock (file time = act time):
  aether - ambient: soft pad (sine + octave), slow breathing filter, a sub root, a high airy hush, sparse bells in a long
           reverb; no pulse at all.
  lumen  - cinematic synth: detuned saw pad whose filter opens on every section change, a sub swell, a slow soft pluck
           arpeggio (one note every 0.75 s, swelling in the last third), a riser into the turn and a soft low hit on it.
Both carry FIG, a four-note figure on a glass pluck, first heard at the start, then again at every section change in the
same instrument (the "returning figure" of the series-motif study, 28 Nov 2026, option B).
Usage: synth_bed.py <aether|lumen> <seconds> <out.wav> [--changes 55.45,84.45,97.15,115.06,140.7] [--fig 58.0,84.75,115.3,167.0]
                    [--riser 106.5:114.47] [--hit 115.06] [--seed 7]
The bed is written at about -28 LUFS, stereo, 48 kHz."""
import sys, subprocess, numpy as np
from scipy.signal import lfilter, fftconvolve

SR = 48000


def hz(m): return 440.0 * 2 ** ((np.asarray(m, dtype=float) - 69) / 12)


def lowpass(x, cut, order=1):
    """one-pole low-pass; cut may vary in time (applied in 50 ms blocks); order stages in series"""
    cut = np.asarray(cut, dtype=float) * np.ones_like(x)
    for _ in range(order):
        y = np.empty_like(x); zi = np.zeros(1); B = SR // 20
        for i in range(0, len(x), B):
            a = np.exp(-2 * np.pi * cut[i] / SR)
            y[i:i + B], zi = lfilter([1 - a], [1, -a], x[i:i + B], zi=zi)
        x = y
    return x


def highpass(x, f):
    return x - lowpass(x, f)


def glide(f, secs=2.0):
    k = int(secs * SR); c = np.cumsum(np.pad(f, (k, 0), mode='edge'))
    return ((c[k:] - c[:-k]) / k)[:len(f)]


def reverb(L, R, rt60=4.5, seed=3):
    rng = np.random.default_rng(seed); m = int(rt60 * 1.1 * SR); t = np.arange(m) / SR
    outs = []
    for x, s in ((L, 0), (R, 1)):
        ir = rng.standard_normal(m) * np.exp(-t * 6.9 / rt60)
        ir = lowpass(ir, 4500 * np.exp(-t / (rt60 * 0.8)) + 700, 2)   # darker as it decays
        ir[: int(0.03 * SR)] *= np.linspace(0, 1, int(0.03 * SR))      # 30 ms soft start
        ir /= np.sqrt(np.sum(ir ** 2))
        outs.append(fftconvolve(x, ir, mode='full')[: len(x)])
    return outs[0], outs[1]


# chords (MIDI), a D pedal under everything: Dm(add9) - Bb(maj7) - Gm7 - Dm9, six voices each; the plan per section is CH_FOR_SEC below
CHORDS = [
    [38, 45, 50, 53, 57, 64],   # Dm(add9)
    [38, 46, 53, 57, 62, 65],   # Bb maj7 over D
    [38, 55, 58, 62, 65, 69],   # Gm7 over D
    [38, 45, 53, 57, 60, 64],   # Dm9
]
CH_FOR_SEC = [0, 0, 1, 2, 3, 0]   # section 0 = before the first change; chord index per section
FIG = [69, 74, 76, 72]            # A4 D5 E5 C5
FIG_T = [0.0, 0.9, 1.9, 3.1]      # seconds after the figure's start


def pluck(f, dur, bright=1.0, decay=1.1):
    n = int(dur * SR); t = np.arange(n) / SR
    w = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3) + 0.12 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 6)
    e = np.minimum(1, t / 0.008) * np.exp(-t / decay)
    return w * e * bright


def bell(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    idx = 2.2 * np.exp(-t / 0.9)
    w = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * 2.0 * f * t)) + 0.4 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t * 2.5)
    return w * np.minimum(1, t / 0.01) * np.exp(-t / 2.6)


def put(buf, x, at, pan=0.5, gain=1.0):
    i = int(at * SR)
    if i >= buf[0].shape[0]: return
    m = min(len(x), buf[0].shape[0] - i)
    buf[0][i:i + m] += x[:m] * gain * (1 - pan) * 1.4
    buf[1][i:i + m] += x[:m] * gain * pan * 1.4


def lufs(path):
    o = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(o.split('Integrated loudness:')[1].split('I:')[1].split('LUFS')[0])


def main():
    a = sys.argv; kind, dur, out = a[1], float(a[2]), a[3]
    arg = lambda k, d: a[a.index(k) + 1] if k in a else d
    ch = [float(x) for x in arg('--changes', '55.45,84.45,97.15,115.06,140.7').split(',')]
    figs = [float(x) for x in arg('--fig', '58.0,84.75,115.3,167.0').split(',')]
    riser = [float(x) for x in arg('--riser', '106.5:114.47').split(':')] if kind == 'lumen' else None
    hit = float(arg('--hit', '115.06')) if kind == 'lumen' else None
    seed = int(arg('--seed', '7')); rng = np.random.default_rng(seed)
    n = int(dur * SR); t = np.arange(n) / SR
    sec = np.searchsorted(np.array(ch), t, side='right')            # 0 .. len(ch)
    L = np.zeros(n); R = np.zeros(n)
    # ---- pad -----------------------------------------------------------------------------------------------
    for v in range(6):
        f = glide(np.array([hz(CHORDS[CH_FOR_SEC[min(s, 5)]][v]) for s in range(len(ch) + 1)])[sec])
        for det, pan in ((-0.0035, 0.25), (0.004, 0.75)):
            if kind == 'aether':
                ph = np.cumsum(f * (1 + det)) / SR
                w = np.sin(2 * np.pi * ph) + 0.18 * np.sin(4 * np.pi * ph)
            else:
                ph = np.cumsum(f * (1 + det)) / SR + rng.random()
                w = 2 * (ph % 1) - 1
            g = (0.26 if v == 0 else 0.13) * (0.55 if kind == 'lumen' else 1.0)
            L += w * g * (1 - pan) * 2; R += w * g * pan * 2
    if kind == 'aether':
        cut = 1500 + 600 * np.sin(2 * np.pi * t / 21) + 0 * t
        L = lowpass(L, cut, 2); R = lowpass(R, cut, 2)
    else:
        env = np.zeros(n)                                            # filter opens on each section change, then closes
        for c in ch:
            m = t >= c; env += m * np.exp(-(t - c).clip(0) / 5.0)
        cut = 520 + 1700 * np.clip(env, 0, 1) + 150 * np.sin(2 * np.pi * t / 17)
        L = lowpass(L, cut, 3); R = lowpass(R, cut * 1.04, 3)
    # ---- sub root (D2 sine), swelling at the section changes for lumen -----------------------------------------
    sub = np.sin(2 * np.pi * hz(38) * t) * (0.20 if kind == 'aether' else 0.12)
    if kind == 'lumen':
        sw = np.zeros(n)
        for c in ch:
            sw += np.exp(-((t - c - 2.2) / 2.2) ** 2)
        sub = sub * (0.6 + 1.6 * np.clip(sw, 0, 1))
    L += sub; R += sub
    # ---- air (aether): high noise hush; (lumen): thinner ----------------------------------------------------------
    hush = highpass(lowpass(rng.standard_normal(n), 7000, 2), 2500) * (0.010 if kind == 'aether' else 0.004)
    hush *= 0.6 + 0.4 * np.sin(2 * np.pi * t / 13) ** 2
    L += hush; R += np.roll(hush, 1900)
    # ---- reverb for the pad: 35% wet -----------------------------------------------------------------------------
    wl, wr = reverb(L, R, rt60=5.0 if kind == 'aether' else 3.6)
    L = L * 0.7 + wl * 0.7; R = R * 0.7 + wr * 0.7
    # ---- events, dry; one more reverb on them -------------------------------------------------------------------
    EL = np.zeros(n); ER = np.zeros(n); E = (EL, ER)
    figgain = 0.55 if kind == 'aether' else 0.5
    for s0 in figs:                                                      # the returning figure, same instrument every time
        for m, dt in zip(FIG, FIG_T):
            put(E, pluck(hz(m), 4.0, 1.0, 1.5), s0 + dt, pan=0.5 + 0.1 * np.sin(m), gain=figgain)
    if kind == 'aether':                                                 # sparse bells on chord tones, about every 7-11 s
        tt = 6.0
        while tt < dur - 4:
            s = CH_FOR_SEC[min(int(np.searchsorted(ch, tt, side='right')), 5)]
            if not any(abs(tt - x) < 5.0 for x in figs):                 # keep clear of the figure
                put(E, bell(hz(CHORDS[s][int(rng.integers(3, 6))] + 12), 6.0), tt, pan=float(rng.uniform(0.25, 0.75)), gain=0.14)
            tt += float(rng.uniform(7, 11))
    else:                                                                # slow soft pluck arpeggio, 0.75 s a note
        pat = [0, 2, 3, 4, 3, 2]
        k = 0; tt = 4.0
        while tt < dur - 3:
            s = CH_FOR_SEC[min(int(np.searchsorted(ch, tt, side='right')), 5)]
            m = CHORDS[s][1:][pat[k % len(pat)]] + 12 * (1 if pat[k % len(pat)] >= 3 else 0)
            lift = 0.6 + 0.9 * np.clip((tt - 97.15) / 8, 0, 1) if tt > 97.15 else 0.6
            if not any(0 <= tt - x < 4.4 for x in figs):                 # let the figure speak alone
                put(E, pluck(hz(m), 1.6, 1.0, 0.45), tt, pan=0.5 + 0.18 * np.sin(k * 1.3), gain=0.11 * lift)
            tt += 0.75; k += 1
        # riser: filtered noise + rising saw, then the break; and a soft low hit on the turn
        r0, r1 = riser
        m = int((r1 - r0) * SR); rt = np.arange(m) / SR; frac = rt / (r1 - r0)
        nz = lowpass(rng.standard_normal(m), 300 + 5500 * frac ** 2, 2) * (frac ** 2) * 0.25
        sw = np.sin(2 * np.pi * np.cumsum(hz(50) * 2 ** (frac * 2.0)) / SR) * frac ** 2 * 0.18
        rz = (nz + sw) * np.minimum(1, (r1 - r0 - rt) / 0.06)   # 60 ms fade-out into the break
        i = int(r0 * SR); EL[i:i + m] += rz; ER[i:i + m] += np.roll(rz, 700)
        hm = int(4.0 * SR); ht = np.arange(hm) / SR
        hb = np.sin(2 * np.pi * hz(33) * ht * (1 + 0.5 * np.exp(-ht * 9))) * np.exp(-ht / 1.3) * (1 - np.exp(-ht * 120)) * 0.7
        put(E, hb, hit, pan=0.5, gain=0.5)
    el, er = reverb(EL, ER, rt60=4.0 if kind == 'aether' else 2.6, seed=5)
    L += EL * 0.55 + el * 0.9; R += ER * 0.55 + er * 0.9
    # ---- finish: a high-pass at 35 Hz, fade the ends, write at about -28 LUFS ---------------------------------------
    L = highpass(L, 35); R = highpass(R, 35)
    fi = int(2 * SR); L[:fi] *= np.linspace(0, 1, fi); R[:fi] *= np.linspace(0, 1, fi); L[-fi:] *= np.linspace(1, 0, fi); R[-fi:] *= np.linspace(1, 0, fi)
    x = np.stack([L, R], 1); x /= max(1e-9, np.abs(x).max()) * 1.2
    import soundfile as sf
    sf.write(out, x.astype(np.float32), SR, subtype='FLOAT')
    g = -28.0 - lufs(out); x = x * 10 ** (g / 20)
    sf.write(out, x.astype(np.float32), SR, subtype='FLOAT')
    print(f'{kind}: {dur:.0f} s -> {out}  (peak {20 * np.log10(np.abs(x).max()):.1f} dBFS, {lufs(out):.1f} LUFS)')


if __name__ == '__main__':
    main()
