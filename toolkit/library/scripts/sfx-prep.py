#!/usr/bin/env python3
"""Prepare a recorded or synthesised sound for the library (SFX kits, 22 Nov 2026; from the study of Chris Moran's
"The VOX Sound Design System", analysis only): every kit file is levelled the same way, so a cue's volumeDb means
the same thing for every sound.
  one   IN OUT                   trim the silence before the first sound (keep 8 ms) and after the last, 3 ms fade in,
                                 30 ms fade out, mono 48 kHz, level to --lufs (default -20 LUFS), true peak capped at -1.
  split IN OUTSTEM N [--min 0.12] cut a file of several hits (clicks, ticks, key presses) into N separate hits
                                 (OUTSTEM_v1.wav ...), the loudest N onsets at least --min s apart, each levelled as above.
                                 Variants are how one sound stays unrepeated (rule V in sound-pass.py).
  events IN OUTSTEM N [--max 1.5] [--gap 0.12] foley takes: N separate phrases cut at the silences between them
                                 (a page turned, a sheet handled, a quill stroke), spread over the take, each levelled.
  loop  IN OUT SEC              a seamless loop of SEC seconds from the steadiest part (ambience: projector hum,
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
    if LIMIT[0] > 0 and g > -1.0 - tp:  # peaky foley: up to LIMIT dB of limiting instead of leaving it quiet
        lim = min(LIMIT[0], g - (-1.0 - tp))
        y = limit(x * 10 ** ((-1.0 - tp + lim) / 20))
        L2, tp2 = lufs_of(y)
        g2 = min(target - L2, -1.0 - tp2)
        return y * 10 ** (g2 / 20), L2 + g2
    g = min(g, -1.0 - tp)  # never past -1 dBTP
    return x * 10 ** (g / 20), L + g


LIMIT = [0.0]


def limit(x):
    # ffmpeg's alimiter at -1 dBFS, 2 ms attack, 60 ms release (no make-up gain)
    tmp = "/tmp/_sfxprep_lim.wav"
    wavfile.write(tmp, SR, x.astype(np.float32))
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", tmp, "-af", "alimiter=limit=0.89:attack=2:release=60:level=disabled",
                          "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)


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
    ap.add_argument("--limit", type=float, default=0, help="allow up to this many dB of peak limiting to reach --lufs (foley: 6)")
    ap.add_argument("--max", type=float, default=1.5, help="events: longest phrase kept (s)")
    ap.add_argument("--minlen", type=float, default=0.3, help="events: shortest phrase kept (s)")
    ap.add_argument("--gap", type=float, default=0.12, help="events: silences shorter than this join phrases (s)")
    ap.add_argument("--lead", type=float, default=18, help="events: pre-roll quieter than this many dB under the phrase's peak is cut")
    ap.add_argument("--below", type=float, default=28, help="events: sound = within this many dB of the take's loud frames")
    a = ap.parse_args()
    LIMIT[0] = a.limit
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
    elif a.mode == "events":
        # Foley takes (paper handled, a page turned, a quill stroke, a shutter): each sound is a phrase, not a click,
        # so cut at the silences between phrases, not at onsets. Phrases closer than --gap merge; each is kept
        # --minlen..--max s long (longer ones end at the quietest 20 ms inside the limit, with a 60 ms fade);
        # the N with the most energy, spread over the take, are kept.
        src, stem, n = a.args[0], a.args[1], int(a.args[2])
        x = load(src)
        hop = int(0.02 * SR)
        r = np.sqrt(np.array([np.mean(x[i:i + hop] ** 2) for i in range(0, len(x) - hop, hop)]) + 1e-12)
        db = 20 * np.log10(r)
        thr = np.percentile(db, 97) - a.below
        on = db > thr
        ev, i = [], 0
        while i < len(on):
            if on[i]:
                j = i
                while j < len(on) and (on[j] or np.any(on[j:j + int(a.gap / 0.02)])):
                    j += 1
                ev.append((i, j))
                i = j
            else:
                i += 1
        mx = int(a.max / 0.02)
        pieces = []
        for s, e in ev:  # a long continuous take is cut into pieces, each ending at its quietest late frame
            while e - s > mx:
                lo = s + int(mx * 0.6)
                c = lo + int(np.argmin(db[lo:s + mx]))
                pieces.append((s, c))
                s = c
            pieces.append((s, e))
        cands = []
        for s, e in pieces:
            if (e - s) * 0.02 < a.minlen:
                continue
            seg = x[max(0, s * hop - int(0.01 * SR)): e * hop + int(0.02 * SR)]
            cands.append((float(np.sum(seg ** 2)), s * hop / SR, seg))
        # spread: split the take into N equal parts and take the strongest phrase of each; fill up by energy
        dur = len(x) / SR
        chosen = []
        for k in range(n):
            part = [c for c in cands if k * dur / n <= c[1] < (k + 1) * dur / n and c not in chosen]
            if part:
                chosen.append(max(part, key=lambda c: c[0]))
        for c in sorted(cands, key=lambda c: -c[0]):
            if len(chosen) >= n:
                break
            if all(c is not d for d in chosen):
                chosen.append(c)
        chosen.sort(key=lambda c: c[1])
        for k, (_, t, seg) in enumerate(chosen, 1):
            # start 30 ms before the first 20 ms frame within --lead dB of the phrase's loudest frame, so a cue placed
            # on the visual hit is not late behind faint pre-roll (handling noise before the sheet moves)
            fr = np.sqrt(np.array([np.mean(seg[i:i + hop] ** 2) for i in range(0, max(1, len(seg) - hop), hop)]) + 1e-12)
            fdb = 20 * np.log10(fr)
            first = int(np.argmax(fdb > fdb.max() - a.lead))
            seg = seg[max(0, first * hop - int(0.03 * SR)):]
            y, L = level(fades(trim(seg), fi=0.01, fo=0.06), a.lufs)
            p = f"{stem}_v{k}.wav"
            save(p, y)
            print(f"{p}: from {t:.2f} s, {len(y) / SR:.2f} s, {L:.1f} LUFS")
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
