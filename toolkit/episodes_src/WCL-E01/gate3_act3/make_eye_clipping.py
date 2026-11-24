#!/usr/bin/env python3
"""Act 3 v5 (Sam, Gate 3, 24 Nov 2026: "Can we do a newpaper cutting or a picture cut ... to display the eye"):
the two eyes from Mason Kimbarovsky's photo (Unsplash, SRC-048) printed as a newspaper halftone on newsprint,
cut out with a slightly uneven scissor edge. No words on the clipping (nothing invented).
usage: make_eye_clipping.py SRC.jpg OUT.png  (prints the left iris centre in clipping px)"""
import sys, math, random
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageDraw

src, out = sys.argv[1], sys.argv[2]
random.seed(7)
im = Image.open(src).convert("L")
box = (0, 280, 4096, 1420)  # brows to under the eyes, both eyes
im = im.crop(box)
W = 1800
im = im.resize((W, round(W * im.height / im.width)), Image.LANCZOS)
im = ImageOps.autocontrast(im, cutoff=1)
H = im.height
g = np.asarray(im, dtype=np.float32) / 255.0
g = 0.14 + 0.86 * np.power(g, 0.8)  # keep a little ink in the whites, paper in the blacks

# 45-degree halftone screen, cell 7 px
cell = 7.0
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
a = math.radians(45)
u = (xx * math.cos(a) + yy * math.sin(a)) / cell
v = (-xx * math.sin(a) + yy * math.cos(a)) / cell
du = u - np.round(u)
dv = v - np.round(v)
d = np.sqrt(du * du + dv * dv)  # 0 at a dot centre, up to ~0.707
r = np.sqrt(np.clip(1.0 - g, 0, 1) / math.pi) * 1.05  # dot radius so ink area ~ darkness
ink = np.clip((r - d) / 0.06 + 0.5, 0, 1)  # soft-edged dots

paper = np.array([233, 227, 211], np.float32)  # newsprint
inkc = np.array([38, 36, 34], np.float32)
noise = np.random.default_rng(3).normal(0, 4, (H, W, 1)).astype(np.float32)
rgb = paper * (1 - ink[..., None]) + inkc * ink[..., None] + noise
rgb = np.clip(rgb, 0, 255).astype(np.uint8)
img = Image.fromarray(rgb, "RGB")

# paper margin around the picture, then a hand-cut edge: straight-ish scissor runs with small wobbles
M = 26
canvas = Image.new("RGB", (W + 2 * M, H + 2 * M), tuple(int(c) for c in paper))
canvas.paste(img, (M, M))
CW, CH = canvas.size
pts = []
def run(p0, p1, n):
    for i in range(n):
        t = i / n
        x = p0[0] + (p1[0] - p0[0]) * t
        y = p0[1] + (p1[1] - p0[1]) * t
        pts.append((x + random.uniform(-1.6, 1.6), y + random.uniform(-1.6, 1.6)))
c = [(random.uniform(2, 10), random.uniform(2, 10)), (CW - random.uniform(2, 10), random.uniform(4, 14)),
     (CW - random.uniform(4, 12), CH - random.uniform(2, 10)), (random.uniform(4, 14), CH - random.uniform(4, 12))]
for i in range(4):
    run(c[i], c[(i + 1) % 4], 90)
mask = Image.new("L", (CW, CH), 0)
ImageDraw.Draw(mask).polygon(pts, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(0.7))
outim = canvas.convert("RGBA")
outim.putalpha(mask)
outim.save(out)
# left iris (viewer's left eye) in the source crop: measured on the 640 px preview at about (0.245, 0.36) of the photo
sx = (0.245 * 4096 - box[0]) / (box[2] - box[0]) * W + M
sy = (0.36 * 2730 - box[1]) / (box[3] - box[1]) * H + M
print(out, outim.size, "left iris ~", round(sx), round(sy))
