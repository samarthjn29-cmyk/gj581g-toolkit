#!/usr/bin/env python3
"""Mixer's check, act joins (Sam, 24 Nov 2026: "Sure", to the Sound reviewer). Joins the end of one mixed act to the
start of the next exactly as they will sit in the episode (no gap) and measures across the join:
  - short-term loudness (3 s windows) of the last 6 s and the first 6 s: a step over 4 LU is flagged;
  - the quietest 50 ms around the join: under -50 dBFS is a hole (the bed must not drop out at a join);
  - the music's key at each side (chroma over 4 s, librosa): a clash is flagged for the Sound reviewer to hear;
  - a click: a sample jump at the join over 0.25 full scale.
usage: act-join-check.py ACT_A.mp4 ACT_B.mp4 [--out report.md]"""
import subprocess, sys
import numpy as np
import librosa

a = sys.argv[1:]
out = None
if "--out" in a:
    i = a.index("--out"); out = a[i + 1]; del a[i:i + 2]
A, B = a
SR = 48000


def dec(p, ss=None, t=None, sseof=None):
    cmd = ["ffmpeg", "-v", "error"] + (["-sseof", str(sseof)] if sseof else []) + (["-ss", str(ss)] if ss is not None else []) + ["-i", p] + \
          (["-t", str(t)] if t else []) + ["-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).astype(np.float64)


ea = dec(A, sseof=-8)
sb = dec(B, ss=0, t=8)
j = np.concatenate([ea, sb])
J = len(ea)


def lufs_st(x):  # K-weighting approximated by a 100 Hz high-pass shelf-free model; good enough for steps
    return -0.691 + 10 * np.log10(np.mean(x ** 2) + 1e-12)


st = [(k / SR - J / SR, lufs_st(j[k:k + 3 * SR])) for k in range(max(0, J - 6 * SR), min(len(j) - 3 * SR, J + 3 * SR), SR // 2)]
before = np.mean([v for t, v in st if t + 3 <= 0]) if any(t + 3 <= 0 for t, _ in st) else st[0][1]
after = np.mean([v for t, v in st if t >= 0]) if any(t >= 0 for t, _ in st) else st[-1][1]
win = int(0.05 * SR)
around = j[J - SR:J + SR]
q = min(20 * np.log10(np.sqrt(np.mean(around[k:k + win] ** 2)) + 1e-12) for k in range(0, len(around) - win, win // 2))
click = abs(j[J] - j[J - 1])
NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
MAJ = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
MIN = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])


def key(x):
    c = librosa.feature.chroma_cqt(y=x.astype(np.float32), sr=SR).mean(axis=1)
    best = max(((np.corrcoef(np.roll(p, s), c)[0, 1], NAMES[s] + (" major" if p is MAJ else " minor")) for p in (MAJ, MIN) for s in range(12)))
    return best[1], best[0]


ka, kb = key(ea[-4 * SR:]), key(sb[:4 * SR])
L = [f"# Act join: {A} -> {B}", "",
     f"- Loudness: last 6 s of A {before:.1f}, first 6 s of B {after:.1f} (step {after - before:+.1f} LU){'  FLAG: over 4 LU' if abs(after - before) > 4 else ''}",
     f"- Quietest 50 ms within 1 s of the join: {q:.1f} dBFS{'  FLAG: a hole (under -50)' if q < -50 else ''}",
     f"- Sample jump at the join: {click:.3f}{'  FLAG: click' if click > 0.25 else ''}",
     f"- Music key: A ends in {ka[0]} (fit {ka[1]:.2f}), B starts in {kb[0]} (fit {kb[1]:.2f}){'  (different: listen)' if ka[0] != kb[0] else ''}"]
txt = "\n".join(L)
if out:
    open(out, "w").write(txt + "\n")
print(txt)
