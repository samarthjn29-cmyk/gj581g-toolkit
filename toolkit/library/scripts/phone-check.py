#!/usr/bin/env python3
"""Mixer's check, phone speaker and masking (Sam, 24 Nov 2026: "Sure", to the Sound reviewer). Two measurements:
1. Masking: the mix minus the voice (fitted, time-aligned) is everything else (music, sounds); in the voice's band
   (1-4 kHz) its level against the voice's, per 0.5 s window where the voice speaks. Flag under +10 dB (music or a
   sound loud enough in the voice's band to blur words), WARN under +15 dB.
2. Phone speaker: both the mix and the dry voice are passed through a phone-speaker model (high-pass 350 Hz, low-pass
   7 kHz, mono, light compression) and transcribed (faster-whisper small.en). A word the voice-only version keeps but
   the mix loses is a word the music or a sound takes away on a phone.
Report lines are act times; the voice file itself is never changed (Sam's audio is final).
usage: phone-check.py CLIP.mp4 VOICE.wav --voice-at 2.4 [--out report.md]"""
import subprocess, sys
import numpy as np

a = sys.argv[1:]
def opt(k, d=None):
    if k in a:
        i = a.index(k); v = a[i + 1]; del a[i:i + 2]; return v
    return d
vat = float(opt("--voice-at", "0"))
out = opt("--out")
clip, voice = a
SR = 16000


def dec(path, af=None, delay=0.0):
    f = []
    if delay:
        f.append(f"adelay={int(round(delay * 1000))}:all=1")
    if af:
        f.append(af)
    cmd = ["ffmpeg", "-v", "error", "-i", path] + (["-af", ",".join(f)] if f else []) + ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).astype(np.float64)


BAND = "highpass=f=1000,highpass=f=1000,lowpass=f=4000,lowpass=f=4000"
mixb = dec(clip, BAND)
voxb = dec(voice, BAND, vat)
n = min(len(mixb), len(voxb))
mixb, voxb = mixb[:n], voxb[:n]
# align: the encoder can shift the mix by a few ms; find the lag (within +-60 ms) on a spoken stretch
seg = slice(int((vat + 5) * SR), int((vat + 35) * SR))
lags = range(-int(0.06 * SR), int(0.06 * SR) + 1)
x, y = mixb[seg], voxb[seg]
best = max(lags, key=lambda L: float(np.dot(x[max(0, L):len(x) + min(0, L)], y[max(0, -L):len(y) - max(0, L)])))
voxb = np.roll(voxb, best)
# magnitude domain (robust to small phase differences): rest = max(|mix| - g|voice|, 0) per bin, 32 ms frames
import scipy.signal as ss
f, t, M = ss.stft(mixb, SR, nperseg=512)
_, _, V = ss.stft(voxb, SR, nperseg=512)
M, V = np.abs(M), np.abs(V)
band = (f >= 1000) & (f <= 4000)
spoken = V[band].sum(0) > np.percentile(V[band].sum(0), 60)
vb = V[band][:, spoken].ravel(); mb = M[band][:, spoken].ravel()
top = vb > np.percentile(vb, 90)  # bins where the voice is strongest: there the mix is almost all voice
g = float(np.median(mb[top] / vb[top]))
R = np.maximum(M - g * V, 0)
rows = []
hop = t[1] - t[0]
per = int(round(0.5 / hop))
vth = 1e-3 * (g * V[band]).sum(0).max()
for k in range(0, len(t) - per, per):
    ev = ((g * V[band][:, k:k + per]) ** 2).sum()
    er = (R[band][:, k:k + per] ** 2).sum()
    if (g * V[band][:, k:k + per]).sum(0).mean() < vth:
        continue
    rows.append((t[k], 10 * np.log10(ev / max(er, 1e-12))))
bad = [(t, d) for t, d in rows if d < 10]
warn = [(t, d) for t, d in rows if 10 <= d < 15]
med = float(np.median([d for _, d in rows])) if rows else 0.0

PHONE = "highpass=f=350,highpass=f=350,lowpass=f=7000,acompressor=threshold=0.1:ratio=3:attack=5:release=80"
from faster_whisper import WhisperModel
m = WhisperModel("small.en", compute_type="int8")
def words(x):
    segs, _ = m.transcribe(x.astype(np.float32), word_timestamps=True, language="en")
    norm = lambda w: w.strip(".,!?;:\"' ").lower().replace("our", "or").replace("'", "")
    return [(norm(w.word), w.start) for s in segs for w in s.words]
wm = words(dec(clip, PHONE))
wv = words(dec(voice, PHONE, vat))
lost = []
for w, t in wv:
    if not w:
        continue
    if not any((x == w or (len(w) > 4 and x[:5] == w[:5])) and abs(tt - t) < 0.6 for x, tt in wm):
        lost.append((t, w))

L = [f"# Phone and masking check: {clip}", "",
     f"Voice in the 1-4 kHz band against everything else: median {med:+.1f} dB over {len(rows)} spoken half-seconds; "
     f"{len(bad)} under +10 dB, {len(warn)} between +10 and +15 dB.", ""]
if bad or warn:
    L.append("| act time | voice vs rest (1-4 kHz) | flag |")
    L.append("|---|---|---|")
    for t, d in sorted(bad + warn):
        L.append(f"| {t:.1f} s | {d:+.1f} dB | {'MASK' if d < 10 else 'warn'} |")
    L.append("")
L.append(f"Phone speaker: {len(wv)} words heard on the voice alone, {len(lost)} of them not heard in the mix.")
for t, w in lost:
    L.append(f"- {t:.2f} s  '{w}'")
txt = "\n".join(L)
if out:
    open(out, "w").write(txt + "\n")
print(txt)
