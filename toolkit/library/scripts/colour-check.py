#!/usr/bin/env python3
"""Colour check for a rendered act (the colourist's part, Sam 24 Nov 2026: "Yes" to the designer, editor and colour
check). Samples each shot at 25/50/75% of its length and measures, in CIELAB, its brightness (L*), its colourfulness
(chroma) and its cast (a* green-red, b* blue-yellow). Flags, for the Editor and the reviewer to judge:
  JUMP  brightness between neighbouring shots differs by more than 20 L* (a deliberate dark room may be fine; say so)
  CAST  a near-grey shot (chroma under 12) whose cast is more than 6 away from the act's own grey cast
        (a modern photo or a blur ground that has gone warm, green or blue next to the period prints)
  DRIFT brightness inside one shot moves by more than 25 L* between its samples (outside a deliberate fade)
It never fails a render; it reports. usage: colour-check.py CLIP.mp4 ACT.json [--out report.md]"""
import json, subprocess, sys
import numpy as np

a = sys.argv[1:]
out = None
if "--out" in a:
    i = a.index("--out")
    out = a[i + 1]
    del a[i:i + 2]
clip, act_path = a
act = json.load(open(act_path))
W, H = 320, 180


def frame(t):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", clip, "-frames:v", "1", "-vf", f"scale={W}:{H}",
                          "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(np.float64) / 255.0


def lab(rgb):
    c = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    L = 116 * f[..., 1] - 16
    return L, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])


rows = []
for n, b in enumerate(act["beats"], 1):
    s, e = b["start"], b["end"]
    ms = []
    for p in (0.25, 0.5, 0.75):
        L, A, B = lab(frame(s + p * (e - s)))
        ms.append((L.mean(), np.hypot(A, B).mean(), A.mean(), B.mean()))
    m = np.array(ms)
    rows.append({"n": n, "id": b["id"], "s": s, "e": e, "L": m[:, 0].mean(), "C": m[:, 1].mean(), "a": m[:, 2].mean(), "b": m[:, 3].mean(),
                 "Lr": m[:, 0].max() - m[:, 0].min()})
grey = [r for r in rows if r["C"] < 12]
ga = float(np.median([r["a"] for r in grey])) if grey else 0.0
gb = float(np.median([r["b"] for r in grey])) if grey else 0.0
lines = [f"# Colour check: {clip}", "", f"Act grey cast (median of near-grey shots): a* {ga:+.1f}, b* {gb:+.1f}. "
         f"Brightness median L* {np.median([r['L'] for r in rows]):.1f}.", "",
         "| # | shot | time | L* | chroma | a* | b* | flags |", "|---|---|---|---|---|---|---|---|"]
nflag = 0
for i, r in enumerate(rows):
    f = []
    if i and abs(r["L"] - rows[i - 1]["L"]) > 20:
        f.append(f"JUMP {r['L'] - rows[i - 1]['L']:+.0f} L* from shot {rows[i - 1]['n']}")
    if r["C"] < 12 and np.hypot(r["a"] - ga, r["b"] - gb) > 6:
        f.append(f"CAST a*{r['a'] - ga:+.1f} b*{r['b'] - gb:+.1f} against the act's grey")
    if r["Lr"] > 25:
        f.append(f"DRIFT {r['Lr']:.0f} L* inside the shot")
    nflag += bool(f)
    lines.append(f"| {r['n']} | {r['id']} | {r['s']:.1f}-{r['e']:.1f} | {r['L']:.1f} | {r['C']:.1f} | {r['a']:+.1f} | {r['b']:+.1f} | {'; '.join(f) or 'ok'} |")
lines += ["", f"{nflag} of {len(rows)} shots flagged (for the Editor and reviewer to judge; a flag is not a fail)."]
txt = "\n".join(lines)
if out:
    open(out, "w").write(txt + "\n")
print(txt)
