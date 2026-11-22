#!/usr/bin/env python3
"""Stillness check for a rendered act (Gate 3), from the Vox rule "something is always changing" (Sam, 22 Nov 2026),
held to the calm version: a slow drift alone does not count as a change. Decodes the video at 10 fps, 160x90 grey,
and marks an EVENT wherever any 10x10 block of the picture changes noticeably between frames (a cut, a word or label arriving, a
highlight, a swatch filling). Fails when two events are more than --max seconds apart (default 4.0).
usage: stillness-check.py VIDEO.mp4 [--max 4.0] [--thr 0.9] [--skip A:B,...]   (skip: title cards etc.)"""
import sys, subprocess, numpy as np
args = sys.argv[1:]
vid = args[0]
opt = lambda k, d: float(args[args.index(k) + 1]) if k in args else d
mx, thr = opt("--max", 4.0), opt("--thr", 3.0)
skip = []
if "--skip" in args:
    for p in args[args.index("--skip") + 1].split(","):
        a, b = p.split(":"); skip.append((float(a), float(b)))
W, H, FPS = 160, 90, 10
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", vid, "-vf", f"fps={FPS},scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
# Change per 10x10-pixel block, so a small label or a swatch filling counts, not only whole-frame cuts.
ad = np.abs(np.diff(f, axis=0)).reshape(-1, H // 10, 10, W // 10, 10).mean(axis=(2, 4))
d = ad.reshape(len(ad), -1).max(axis=1)
ev = [0.0] + [(i + 1) / FPS for i, x in enumerate(d) if x > thr] + [len(f) / FPS]
gaps = []
for a, b in zip(ev, ev[1:]):
    if b - a > mx and not any(s <= a and b <= e for s, e in skip):
        gaps.append((a, b))
print(f"{vid}: {len(f)/FPS:.1f} s, {len(ev)-2} change events (threshold {thr}), longest gap {max(b-a for a,b in zip(ev, ev[1:])):.1f} s")
for a, b in gaps:
    print(f"  STILL {a:6.1f}-{b:6.1f} s ({b-a:.1f} s with no visible change)")
sys.exit(1 if gaps else 0)
