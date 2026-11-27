#!/usr/bin/env python3
"""Series-motif study (28 Nov 2026). Where does a musical figure come back inside one video?
Per capture: demucs (voice / rest) -> chroma of the rest stem -> self-similarity -> repeats.
A repeat = a stretch of >= MINLEN s whose chroma matches an earlier stretch >= MINGAP s before it (cosine >= THR, 1 s median),
on the same pitch classes (no transposition: a motif that returns in another key shows as a miss; stated in the study).
Also: tempo, key guess, the main sections (novelty peaks), and the stretches of the rest stem with a clear melody line
(pitch track on the rest stem: how much of the time a single dominant pitch is stable for >= 0.3 s).
Usage: motif.py FILE START_SEC RATE OUT_DIR     (RATE 2 for browser captures, 1 for wav)
Writes OUT_DIR/motif/<name>.json and prints one summary line."""
import sys, os, json, subprocess
import numpy as np, librosa

path, start, rate, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
name = os.path.basename(path).rsplit(".", 1)[0]
os.makedirs(f"{out}/sep", exist_ok=True); os.makedirs(f"{out}/motif", exist_ok=True)
wav = f"{out}/sep/{name}.wav"
if not os.path.exists(wav):
    af = f"asetrate={int(48000 / rate)},aresample=44100" if rate != 1 else "aresample=44100"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", path, "-af", af, "-ac", "2", wav], check=True)
dd = f"{out}/sep/out/htdemucs/{name}"
if not os.path.exists(f"{dd}/no_vocals.wav"):
    subprocess.run(["python3", "-m", "demucs", "--two-stems", "vocals", "-n", "htdemucs", "-j", "1", "--segment", "7", "-o", f"{out}/sep/out", wav],
                   check=True, capture_output=True)
SR = 22050; HOP = 2048
y, _ = librosa.load(f"{dd}/no_vocals.wav", sr=SR, mono=True)
dur = len(y) / SR
fps = SR / HOP
chroma = librosa.feature.chroma_cqt(y=y, sr=SR, hop_length=HOP, n_chroma=12)
chroma = chroma / (np.linalg.norm(chroma, axis=0, keepdims=True) + 1e-9)
# 1 s windows of chroma, stacked (so a figure, not a chord, has to match)
W = max(1, int(round(1.0 * fps)))
def stack(c, w):
    n = c.shape[1] - w + 1
    return np.concatenate([c[:, i:i + n] for i in range(w)], axis=0)
S = stack(chroma, W)
S = S / (np.linalg.norm(S, axis=0, keepdims=True) + 1e-9)
sim = S.T @ S                                     # cosine
n = sim.shape[0]
MINGAP, MINLEN, THR = 20.0, 4.0, 0.92
gap = int(MINGAP * fps); minlen = int(MINLEN * fps)
# energy gate: ignore near-silent frames
rms = librosa.feature.rms(y=y, frame_length=4096, hop_length=HOP)[0][:n]
live = rms > 0.15 * np.median(rms[rms > 0]) if np.any(rms > 0) else np.ones(n, bool)
repeats = []
for lag in range(gap, n - minlen):
    d = np.diag(sim, k=lag)                      # d[i] = sim(i, i+lag)
    ok = (d >= THR) & live[:len(d)] & live[lag:lag + len(d)]
    i = 0
    while i < len(ok):
        if ok[i]:
            j = i
            while j < len(ok) and ok[j]:
                j += 1
            if j - i >= minlen:
                repeats.append((i / fps, (i + lag) / fps, (j - i) / fps, float(d[i:j].mean())))
            i = j
        else:
            i += 1
# merge near-duplicates (same first start within 1.5 s and same second start within 1.5 s)
repeats.sort(key=lambda r: -r[2])
kept = []
for r in repeats:
    if not any(abs(r[0] - k[0]) < 1.5 and abs(r[1] - k[1]) < 1.5 for k in kept):
        kept.append(r)
kept.sort(key=lambda r: r[0])
# group repeats into figures: occurrences of the same stretch (starts within 2 s of each other)
occ = []
for a, b, L, s in kept:
    for t in (a, b):
        for g in occ:
            if abs(g["t"][0] - t) < 2.0:
                if all(abs(x - t) > 1.0 for x in g["t"]):
                    g["t"].append(t)
                g["L"] = max(g["L"], L)
                break
        else:
            occ.append({"t": [t], "L": L})
figs = [g for g in occ if len(g["t"]) >= 2]
for g in figs:
    g["t"] = sorted(round(x + start, 1) for x in g["t"])
    g["L"] = round(g["L"], 1)
tempo = float(np.atleast_1d(librosa.beat.beat_track(y=y, sr=SR)[0])[0])
ch = chroma.mean(axis=1)
keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
top = [keys[i] for i in np.argsort(-ch)[:3]]
# melody-ness: a stable dominant pitch >= 0.3 s
f0, vf, _ = librosa.pyin(y[: int(SR * min(dur, 240))], fmin=130, fmax=1000, sr=SR, frame_length=2048, hop_length=512)
stable = 0
run = 0
for v in vf:
    run = run + 1 if v else 0
    if run == int(0.3 * SR / 512):
        stable += 1
melody_per_min = stable / (min(dur, 240) / 60)
res = {"name": name, "start": start, "dur": round(dur, 1), "tempo": round(tempo, 1), "top_pitch_classes": top,
       "n_repeats": len(kept), "figures": figs, "melody_notes_per_min": round(melody_per_min, 1),
       "repeats": [(round(a + start, 1), round(b + start, 1), round(L, 1), round(s, 2)) for a, b, L, s in kept]}
json.dump(res, open(f"{out}/motif/{name}.json", "w"), indent=1)
cov = sum(g["L"] * len(g["t"]) for g in figs)
print(f"{name}: {dur:.0f}s tempo {tempo:.0f} pcs {','.join(top)} | repeats {len(kept)} figures {len(figs)} "
      f"(longest {max([g['L'] for g in figs] or [0])}s, most returns {max([len(g['t']) for g in figs] or [0])}) "
      f"covered {cov:.0f}s | melody {melody_per_min:.0f} notes/min")
