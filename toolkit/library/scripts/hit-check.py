#!/usr/bin/env python3
"""Picture-hit check: every big sound has a picture change on it.

usage: hit-check.py CLIP.mp4 ACT.json [--min 20] [--ratio 3] [--ids SFX-025,SFX-005]

Why (WCL-E01 act 1, 26 Nov 2026): the act's one big line ("151 years") had a sub and a thump, but the
picture did not move at all on them (the number had locked a second earlier), so the hit felt like a
sound effect laid on a still. Rule: a big impact sound lands on a visible picture event (a pop, a cut,
a flash, a bloom) within +-2 frames.

For each cue with a hit ID (default SFX-025 SubImpact, SFX-005 MutedThump), or any audio cue with
"hit": true, it measures the share of strong edges (outlines of text, objects, cut-outs) that move from
2 frames before the cue to 1-5 frames after it. Film grain and the slow colour fields of the ground have
no strong edges, so they do not count (a whole-frame difference could not tell them from a hit).
It FAILS below --min % or below --ratio x the shot's own edge change over the same gap half a second
earlier. Calibrated on WCL-E01 act 1 at 98.0 s: v4 (no hit) about 5%, v5 (6% pop + bloom) about 68%.
Exit 1 on any FAIL.
"""
import json
import subprocess
import sys

import numpy as np

a = sys.argv[1:]
if len(a) < 2:
    sys.exit(__doc__)
clip, act_file = a[0], a[1]
MIN = float(a[a.index("--min") + 1]) if "--min" in a else 20.0
IDS = set(a[a.index("--ids") + 1].split(",")) if "--ids" in a else {"SFX-025", "SFX-005"}
RATIO = float(a[a.index("--ratio") + 1]) if "--ratio" in a else 3.0
W, H, FPS = 480, 270, 30

act = json.load(open(act_file))
cues = [c for c in act.get("audio", []) if c.get("id") in IDS or c.get("hit")]
if not cues:
    print("hit-check: no hit cues in this act")
    sys.exit(0)


def frames(n0, n):
    """n frames from frame n0, frame-accurate (select by index)."""
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", clip, "-vf", f"select=between(n\\,{n0}\\,{n0 + n - 1}),scale={W}:{H},format=gray",
         "-vsync", "0", "-f", "rawvideo", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(out, np.uint8).reshape(-1, H, W).astype(np.float32)


def edges(x):
    gx = np.abs(np.diff(x, axis=1))[:-1, :]
    gy = np.abs(np.diff(x, axis=0))[:, :-1]
    return (gx + gy) > 40


def change(x, y):
    """% of strong edges that moved between two frames (grain and slow colour fields have no strong edges)."""
    ex, ey = edges(x), edges(y)
    return 100.0 * float((ex ^ ey).sum()) / max(1, int((ex | ey).sum()))


fails = 0
seen = set()
for c in sorted(cues, key=lambda c: c["atSec"]):
    t = round(c["atSec"], 2)
    if t in seen:  # a sub and a thump on the same frame are one hit
        continue
    seen.add(t)
    n = round(t * FPS)
    f = frames(n - 16, 22)  # frames -16 .. +5
    # the shot's own change over the same 3-7 frame gap (drift, settling moves), half a second before the hit
    base = max(change(f[0], f[i]) for i in range(3, 8))
    before = f[14]  # 2 frames before the cue
    score = max(change(before, x) for x in f[17:])  # +1 .. +5
    ok = score >= max(MIN, RATIO * base)
    fails += 0 if ok else 1
    ids = "+".join(sorted({x["id"] for x in cues if round(x["atSec"], 2) == t}))
    print(f"{'PASS' if ok else 'FAIL'}  {t:7.2f}s  {ids:<16} edges moved {score:5.1f}%, background {base:4.1f}% (needs {max(MIN, RATIO * base):.2f})")
print(f"hit-check: {fails} without a picture hit")
sys.exit(1 if fails else 0)
