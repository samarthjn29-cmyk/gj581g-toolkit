#!/usr/bin/env python3
"""In-house ambient music beds (7 Nov 2026, Emergence study: a bed under the whole video fills every pause).
Synthesised here, so there is nothing to license or credit. Three characters, each with chord changes at given times:
  ember  - warm low drone (detuned saws through a slow low-pass), soft fire crackle
  glass  - airy pad with a high shimmer, slow swells
  pulse  - pad plus a soft low heartbeat pulse at 60 bpm
  keys   - soft felt-piano notes picking out the chord over a quiet sine pad, long room tail (7 Nov 2026)
  drift  - warm string-like pad with slow vibrato, airy wind and a rare soft bell (7 Nov 2026)
Usage: ambient_bed.py <ember|glass|pulse|keys|drift> <seconds> <out.wav> [--changes 0,18.5,40.2] [--key D]
The bed is written at about -28 LUFS; mix.py lays it under the narration (about 12-14 dB below the voice)."""
import sys, numpy as np, subprocess, os
SR = 48000
NOTE = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lowpass(x, cut):  # one-pole low-pass; a time-varying cut is applied in 50 ms blocks
    from scipy.signal import lfilter
    cut = np.asarray(cut) * np.ones_like(x); y = np.empty_like(x); zi = np.zeros(1); B = SR // 20
    for i in range(0, len(x), B):
        a = np.exp(-2 * np.pi * cut[i] / SR); y[i:i + B], zi = lfilter([1 - a], [1, -a], x[i:i + B], zi=zi)
    return y
def saw(f, n, ph=0.0): t = np.arange(n) / SR; return 2 * ((f * t + ph) % 1) - 1
def main():
    a = sys.argv; kind, dur, out = a[1], float(a[2]), a[3]
    ch = [float(x) for x in a[a.index('--changes') + 1].split(',')] if '--changes' in a else [0.0]
    root = 38 + NOTE[a[a.index('--key') + 1]] - 2 if '--key' in a else 38   # D2
    rng = np.random.default_rng(7); n = int(dur * SR); t = np.arange(n) / SR
    # chord progression per section (semitones over the root): i - VI - iv - i(sus)
    prog = [[0, 7, 12, 15], [-4, 3, 8, 12], [5, 12, 17, 20], [0, 7, 14, 19]]
    sec = np.searchsorted(ch, t, side='right') - 1
    L = np.zeros(n); R = np.zeros(n)
    for v in range(4):
        f_sec = np.array([hz(root + prog[s % 4][v]) for s in range(len(ch))])
        f = f_sec[sec]
        # glide 2 s between chords
        k = int(2 * SR); c = np.cumsum(np.pad(f, (k, 0), mode='edge')); f = ((c[k:] - c[:-k]) / k)[:n]  # moving average (np.convolve with a 2 s kernel took minutes)
        phase = np.cumsum(f) / SR
        for det, pan in ((-0.004, 0.2), (0.005, 0.8)):
            if kind in ('glass', 'keys'): w = np.sin(2 * np.pi * phase * (1 + det))
            elif kind == 'drift': vib = 0.003 * np.sin(2 * np.pi * t * (4.8 + v * 0.3)); w = 2 * ((np.cumsum(f * (1 + det + vib)) / SR + rng.random()) % 1) - 1
            else: w = 2 * ((phase * (1 + det) + rng.random()) % 1) - 1
            g = (0.22 if v == 0 else 0.15) * (0.45 if kind == 'keys' else 1)
            L += w * g * (1 - pan); R += w * g * pan
    cut = {'glass': 2400 + 900 * np.sin(2 * np.pi * t / 17), 'keys': 900 + 0 * t, 'drift': 1100 + 500 * np.sin(2 * np.pi * t / 19) ** 2}.get(kind, 380 + 260 * np.sin(2 * np.pi * t / 23) ** 2)
    L = lowpass(L, cut); R = lowpass(R, cut)
    if kind == 'drift': L = lowpass(lowpass(L, cut), cut * 1.3); R = lowpass(lowpass(R, cut), cut * 1.3)  # 18 dB/oct: string-soft, not buzzy
    if kind == 'glass':  # shimmer: two octaves up, slow tremolo
        sh = np.sin(2 * np.pi * hz(root + 36 + 7) * t) * 0.03 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 7)); L += sh; R += np.roll(sh, 2400)
    if kind == 'ember':  # crackle: sparse filtered clicks
        cr = (rng.random(n) > 0.99975) * rng.random(n) * 0.5; cr = lowpass(cr, 3000) * 3; L += cr; R += np.roll(cr, 300)
    if kind == 'pulse':  # soft heartbeat at 60 bpm, lub-dub
        p = np.zeros(n)
        for b in np.arange(0.5, dur, 1.0):
            for off, amp in ((0, 1.0), (0.22, 0.6)):
                i = int((b + off) * SR); m = min(n - i, int(0.25 * SR))
                if m > 0: tt = np.arange(m) / SR; p[i:i + m] += amp * np.sin(2 * np.pi * 48 * tt) * np.exp(-tt * 18)
        L += p * 0.35; R += p * 0.35
    if kind == 'keys':  # felt-piano notes: chord tones an octave or two up, every ~1.6 s, soft attack, long decay, room tail
        pk = np.zeros(n); tt = np.arange(int(4 * SR)) / SR
        for j, b in enumerate(np.arange(1.0, dur - 1, 1.6)):
            s_ = int(np.searchsorted(ch, b, side='right') - 1); mm = root + 24 + prog[s_ % 4][[1, 2, 3, 2][j % 4]] - 12 * (j % 5 == 4)
            i = int((b + rng.normal(0, 0.04)) * SR); m = min(n - i, len(tt))
            note = (np.sin(2 * np.pi * hz(mm) * tt[:m]) + 0.3 * np.sin(4 * np.pi * hz(mm) * tt[:m]) * np.exp(-tt[:m] * 3)) * (1 - np.exp(-tt[:m] * 120)) * np.exp(-tt[:m] * 1.1)
            pk[i:i + m] += note * (0.5 + 0.2 * rng.random())
        pk = lowpass(pk, 2600); ir = rng.normal(0, 1, int(2.2 * SR)) * np.exp(-np.arange(int(2.2 * SR)) / SR * 2.6)
        from scipy.signal import fftconvolve
        wet = fftconvolve(pk, ir)[:n]; wet /= np.abs(wet).max() + 1e-9; pk /= np.abs(pk).max() + 1e-9
        L += 0.30 * pk + 0.16 * wet; R += 0.30 * np.roll(pk, 180) + 0.16 * np.roll(wet, 900)
    if kind == 'drift':  # wind: slow-swelling filtered noise; a soft bell every 7-11 s
        wn = lowpass(rng.normal(0, 1, n), 700) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 13) ** 2) * 0.08; L += wn; R += np.roll(wn, 2000)
        b = 2.0
        while b < dur - 2:
            s_ = int(np.searchsorted(ch, b, side='right') - 1); mm = root + 36 + prog[s_ % 4][2]
            i = int(b * SR); m = min(n - i, int(3.5 * SR)); tt = np.arange(m) / SR
            bell = (np.sin(2 * np.pi * hz(mm) * tt) + 0.4 * np.sin(2 * np.pi * hz(mm) * 2.76 * tt) * np.exp(-tt * 4)) * np.exp(-tt * 1.4) * 0.06
            L[i:i + m] += bell; R[i:i + m] += bell * 0.8; b += 7 + 4 * rng.random()
    # swell envelope: fade in 3 s, out 3 s, breathe a little at each change
    env = np.clip(t / 3, 0, 1) * np.clip((dur - t) / 3, 0, 1)
    for c in ch[1:]: env *= 1 - 0.25 * np.exp(-((t - c) / 0.9) ** 2)
    L *= env; R *= env
    x = np.stack([L, R], 1); x /= max(1e-9, np.abs(x).max()) / 0.7
    tmp = out + '.raw.wav'
    import wave
    with wave.open(tmp, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-28:TP=-6:LRA=7', '-ar', str(SR), out], check=True); os.remove(tmp)
    print(kind, '->', out)
if __name__ == '__main__': main()
