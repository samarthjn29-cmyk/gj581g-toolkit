#!/usr/bin/env python3
"""Prepare a recorded or synthesised sound for the library (SFX kits, 22 Nov 2026; from the study of Chris Moran's
"The VOX Sound Design System", analysis only): every kit file is levelled the same way, so a cue's volumeDb means
the same thing for every sound.
  one   IN OUT                   trim the silence before the first sound (keep 8 ms) and after the last, 3 ms fade in,
                                 30 ms fade out, mono 48 kHz, level to --lufs (default -20 LUFS), true peak capped at -1.
  split IN OUTSTEM N [--min 0.12] cut a file of several hits (clicks, ticks, key presses) into N separate hits
                                 (OUTSTEM_v1.wav ...), the loudest N onsets at least --min s apart, each levelled as above.
                                 Variants are how one sound stays unrepeated (rule V in sound-pass.py).
  loop  IN OUT SEC               a seamless loop of SEC seconds from the steadiest part (ambience: projector hum,
                                 hiss), 0.5 s crossfade at the seam, levelled to --lufs.
  stats FILES...                 duration, LUFS, true peak, spectral centroid.
"""
import sys, json, subprocess, argparse, os
import numpy as np
from scipy.io import wavfile

SR = 48000


def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


def lufs_of(x):
    # Integrated loudness through ffmpeg's ebur128 on a temp file (short sounds: padded so the gate has blocks).
    tmp = "/tmp/_sfxprep_meas.wav"
    pad = np.zeros(int(0.4 * SR))
    wavfile.write(tmp, SR, np.concatenate([x, pad]).astype(np.float32))
    o = subprocess.run(["ffmpeg", "-nostats", "-i", tmp, "-af", "loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(o[o.rindex("{"): o.rindex("}") + 1])
    return float(j["input_i"]), float(j["input_tp"])


def level(x, target):
    L, tp = lufs_of(x)
    if not np.isfinite(L):
        L = 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
    g = target - L
    g = min(g, -1.0 - tp)  # never past -1 dBTP
    return x * 10 ** (g / 20), L + g


def trim(x, thr_db=-45):
    a = np.abs(x)
    thr = np.max(a) * 10 ** (thr_db / 20)
    idx = np.where(a > thr)[0]
    if len(idx) == 0:
        return x
    s = max(0, idx[0] - int(0.008 * SR))
    e = min(len(x), idx[-1] + int(0.02 * SR))
    return x[s:e]


def fades(x, fi=0.003, fo=0.03):
    x = x.copy()
    ni, no = min(len(x), int(fi * SR)), min(len(x), int(fo * SR))
    x[:ni] *= np.linspace(0, 1, ni)
    x[len(x) - no:] *= np.linspace(1, 0, no)
    return x


def save(p, x):
    os.makedirs(os.path.dirname(p) or ".", exist_ok=True)
    wavfile.write(p, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


def centroid(x):
    s = np.abs(np.fft.rfft(x * np.hanning(len(x))))
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return float(np.sum(f * s) / (np.sum(s) + 1e-12))


def onsets(x, min_gap):
    hop = int(0.005 * SR)
    e = np.array([np.sum(x[i:i + hop] ** 2) for i in range(0, len(x) - hop, hop)])
    d = np.maximum(0, np.diff(e, prepend=e[0]))
    order = np.argsort(d)[::-1]
    picks = []
    for i in order:
        t = i * hop / SR
        if d[i] < np.max(d) * 0.05:
            break
        if all(abs(t - p) >= min_gap for p in picks):
            picks.append(t)
    return sorted(picks)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode")
    ap.add_argument("args", nargs="+")
    ap.add_argument("--lufs", type=float, default=-20)
    ap.add_argument("--min", type=float, default=0.12)
    a = ap.parse_args()
    if a.mode == "one":
        x = fades(trim(load(a.args[0])))
        y, L = level(x, a.lufs)
        save(a.args[1], y)
        print(f"{a.args[1]}: {len(y) / SR:.2f} s, {L:.1f} LUFS")
    elif a.mode == "split":
        src, stem, n = a.args[0], a.args[1], int(a.args[2])
        x = load(src)
        ts = onsets(x, a.min)
        # the N loudest hits by peak in their window
        win = []
        for i, t in enumerate(ts):
            s = max(0, int(t * SR) - int(0.006 * SR))
            nxt = ts[i + 1] if i + 1 < len(ts) else len(x) / SR
            e = min(len(x), int(min(nxt - 0.004, t + 0.45) * SR))
            seg = x[s:e]
            if len(seg) > int(0.03 * SR):
                win.append((np.max(np.abs(seg)), s, seg))
        win.sort(key=lambda w: -w[0])
        chosen = sorted(win[:n], key=lambda w: w[1])
        for k, (_, s, seg) in enumerate(chosen, 1):
            y, L = level(fades(trim(seg)), a.lufs)
            p = f"{stem}_v{k}.wav"
            save(p, y)
            print(f"{p}: from {s / SR:.2f} s, {len(y) / SR:.2f} s, {L:.1f} LUFS")
    elif a.mode == "loop":
        src, out, dur = a.args[0], a.args[1], float(a.args[2])
        x = load(src)
        n, xf = int(dur * SR), int(0.5 * SR)
        hop = int(0.25 * SR)
        best, bs = None, 0
        for s in range(int(1.0 * SR), len(x) - n - xf, hop):  # steadiest stretch (lowest variation of short-term RMS)
            seg = x[s:s + n + xf]
            r = np.sqrt(np.convolve(seg ** 2, np.ones(4800) / 4800, "valid")[::2400])
            v = np.std(r) / (np.mean(r) + 1e-12)
            if best is None or v < best:
                best, bs = v, s
        seg = x[bs:bs + n + xf].copy()
        ramp = np.linspace(0, 1, xf)
        loop = seg[:n].copy()
        loop[:xf] = seg[n:n + xf] * (1 - ramp) + seg[:xf] * ramp  # the tail crossfades into the head: seamless
        y, L = level(loop, a.lufs)
        save(out, y)
        print(f"{out}: loop {dur:.1f} s from {bs / SR:.1f} s (variation {best:.3f}), {L:.1f} LUFS")
    elif a.mode == "stats":
        for p in a.args:
            x = load(p)
            L, tp = lufs_of(x)
            print(f"{os.path.basename(p):38s} {len(x) / SR:6.2f} s  {L:6.1f} LUFS  TP {tp:6.1f}  centroid {centroid(x):6.0f} Hz")
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
