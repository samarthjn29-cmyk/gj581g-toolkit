#!/usr/bin/env python3
"""Make a one-ink halftone of a registered scan or photo (LOK-017 HalftoneMoire / VIS-028 DuotoneCollage).

The output is a PNG mask: dots opaque, paper transparent. The component colours it with theme tokens
(dots in one token, paper in another), so no colour lives in the file. Dot area follows the darkness of
each cell (amplitude-modulated screen, round dots, rotated grid), drawn at 3x and scaled down so edges
stay clean. Register the output as an extra path on the SAME source (it is that source, re-screened);
only use it on sources whose licence allows adaptation (public domain, CC BY, CC0, own) -- never on a
source whose limit says "shown unaltered" (e.g. SRC-013, CC BY-SA).

usage: halftone.py IN.jpg OUT.png [--cell 10] [--angle 45] [--crop x,y,w,h] [--width 1200]
                   [--black 0.08] [--white 0.92] [--gamma 1.0] [--line]
--cell: dot spacing in OUTPUT pixels (keep >= 8 at 1080p, or YouTube's encoder turns it to mush).
--black/--white: input levels (luminance 0..1) mapped to full dot / no dot.
"""
import argparse
import math

import numpy as np
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--cell", type=float, default=10)
ap.add_argument("--angle", type=float, default=45)
ap.add_argument("--crop", default="")
ap.add_argument("--width", type=int, default=0)
ap.add_argument("--black", type=float, default=0.08)
ap.add_argument("--white", type=float, default=0.92)
ap.add_argument("--gamma", type=float, default=1.0)
ap.add_argument("--line", action="store_true", help="line art (engraved plates): a clean one-ink mask, no dots")
a = ap.parse_args()

im = Image.open(a.src).convert("L")
if a.crop:
    x, y, w, h = map(int, a.crop.split(","))
    im = im.crop((x, y, x + w, y + h))
if a.width and a.width != im.width:
    im = im.resize((a.width, round(im.height * a.width / im.width)), Image.LANCZOS)
W, H = im.size
L = np.asarray(im, dtype=np.float32) / 255.0
L = np.clip((L - a.black) / max(1e-3, a.white - a.black), 0, 1) ** a.gamma
dark = 1.0 - L

if a.line:  # one ink, no screen: soft threshold keeps the engraver's line weight
    alpha = Image.fromarray((np.clip((dark - 0.35) / 0.3, 0, 1) * 255).astype(np.uint8))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.putalpha(alpha)
    out.save(a.out, optimize=True)
    print(f"{a.out}: {W}x{H}, line mask")
    raise SystemExit
SS = 3  # supersampling
c = a.cell
th = math.radians(a.angle)
ux, uy = math.cos(th), math.sin(th)  # grid axis u
vx, vy = -math.sin(th), math.cos(th)  # grid axis v
diag = math.hypot(W, H)
n = int(diag / c) + 2
cx0, cy0 = W / 2, H / 2
canvas = Image.new("L", (W * SS, H * SS), 0)
d = ImageDraw.Draw(canvas)
rmax = c * 0.72  # neighbouring dots just touch at full darkness
for i in range(-n, n + 1):
    for j in range(-n, n + 1):
        px = cx0 + (i * ux + j * vx) * c
        py = cy0 + (i * uy + j * vy) * c
        if px < -c or py < -c or px > W + c or py > H + c:
            continue
        # mean darkness over the cell (sampled 3x3 around the centre)
        xs = np.clip((px + np.array([-c / 3, 0, c / 3])).astype(int), 0, W - 1)
        ys = np.clip((py + np.array([-c / 3, 0, c / 3])).astype(int), 0, H - 1)
        k = float(dark[np.ix_(ys, xs)].mean())
        if k <= 0.01:
            continue
        r = min(rmax, c * math.sqrt(k / math.pi))  # dot area = darkness x cell area
        d.ellipse([(px - r) * SS, (py - r) * SS, (px + r) * SS, (py + r) * SS], fill=255)
alpha = canvas.resize((W, H), Image.LANCZOS)
out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
out.putalpha(alpha)
out.save(a.out, optimize=True)
cov = np.asarray(alpha, dtype=np.float32).mean() / 255
print(f"{a.out}: {W}x{H}, cell {c}px at {a.angle} deg, ink coverage {cov:.0%}")
