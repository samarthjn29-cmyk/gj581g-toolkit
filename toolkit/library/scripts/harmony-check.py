#!/usr/bin/env python3
"""Colour harmony check: how many colour families a frame shows, and how much of it is loud.

usage: harmony-check.py CLIP.mp4 [ACT.json] [--every 1.0] [--out report.md]

Why (Sam, 26 Nov 2026: "colors on our videos should not feel too much"): a frame reads as calm when it has
one ground family, ink, one accent and at most one or two story colours. This measures every --every
seconds on a 160x90 copy:
  - families: hue families (12 x 30 degrees) with saturation >= 0.35 and value >= 0.25 covering >= 1.5 %
    of the frame; near-greys, cream and ink do not count
  - loud: % of the frame that is strongly saturated (saturation >= 0.6)
Limits (STYLE_GUIDE "Colour harmony"): families <= 3 on a frame (4 only on a shot whose subject is the
colours themselves: a spectrum, swatch rows, a flood, marked "colourSubject": true in the act), loud <= 25 %.
With ACT.json, frames are labelled by shot and colour-subject shots get the higher family limit.
Reports, never fails (exit 0); the Designer reads it at Gate 2/3.
"""
import colorsys
import json
import subprocess
import sys

import numpy as np

a = sys.argv[1:]
if not a:
    sys.exit(__doc__)
clip = a[0]
act = json.load(open(a[1])) if len(a) > 1 and a[1].endswith(".json") else None
EVERY = float(a[a.index("--every") + 1]) if "--every" in a else 1.0
OUT = a[a.index("--out") + 1] if "--out" in a else None
W, H = 160, 90

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", clip, "-vf", f"fps=1/{EVERY},scale={W}:{H}", "-f", "rawvideo",
                      "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.float32) / 255.0

COLOUR_SUBJECT = {"SpectrumStrip", "SpectrumParts", "SwatchRows", "SpectrumRows", "ColourFlood"}


def shot_at(t):
    if not act:
        return None, False
    for b in act["beats"]:
        if b["start"] <= t < b["end"]:
            subj = b.get("colourSubject", b.get("component") in COLOUR_SUBJECT)
            return b["id"], bool(subj)
    return None, False


rows = []
for i, f in enumerate(frames):
    px = f.reshape(-1, 3)
    mx, mn = px.max(1), px.min(1)
    v = mx
    s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    rgb = px
    # hue in degrees
    r, g, b = rgb[:, 0], rgb[:, 1], rgb[:, 2]
    d = np.maximum(mx - mn, 1e-6)
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    col = (s >= 0.35) & (v >= 0.25)
    fam = np.bincount((h[col] // 30).astype(int) % 12, minlength=12) / len(px)
    n = int((fam >= 0.015).sum())
    loud = float(((s >= 0.6) & (v >= 0.25)).mean() * 100)
    t = i * EVERY
    sid, subj = shot_at(t)
    lim = 4 if subj else 3
    flag = (n > lim) or (loud > 25)
    rows.append((t, sid, n, loud, lim, flag))

lines = [f"# Harmony check: {clip}", "", "| t (s) | shot | families | loud % | limit | flag |", "|---|---|---|---|---|---|"]
for t, sid, n, loud, lim, flag in rows:
    if flag:
        lines.append(f"| {t:.0f} | {sid or ''} | {n} | {loud:.0f} | {lim} | over |")
fl = sum(r[5] for r in rows)
fams = [r[2] for r in rows]
louds = [r[3] for r in rows]
summary = (f"frames {len(rows)}, over the limit {fl} ({100 * fl / max(1, len(rows)):.0f}%); families median {np.median(fams):.0f}, "
           f"max {max(fams)}; loud median {np.median(louds):.0f}%, max {max(louds):.0f}%")
lines += ["", "**Summary:** " + summary]
text = "\n".join(lines)
if OUT:
    open(OUT, "w").write(text + "\n")
print(text if fl < 40 else "\n".join(lines[:4] + lines[4:44] + ["| ... | | | | | |", "", "**Summary:** " + summary]))
