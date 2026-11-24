#!/usr/bin/env python3
"""Contact sheets of act-stills.mjs output, one sheet per shot (3 columns, 640 px each, time and shot id on each).
usage: review-sheets.py OUTDIR  (reads OUTDIR/index.json, writes OUTDIR/sheet_<nn>_<shot>.jpg)"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

d = sys.argv[1]
idx = json.load(open(os.path.join(d, "index.json")))
groups = {}
for t, frame, f, shot in idx:
    groups.setdefault(shot, []).append((t, frame, f))
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
except OSError:
    font = ImageFont.load_default()
W, H, C = 640, 360, 3
order = []
for t, _, _, shot in idx:
    if shot not in order:
        order.append(shot)
for n, shot in enumerate(order):
    items = groups[shot]
    rows = (len(items) + C - 1) // C
    sheet = Image.new("RGB", (W * C, H * rows), "black")
    for i, (t, frame, f) in enumerate(items):
        im = Image.open(f).convert("RGB").resize((W, H))
        dr = ImageDraw.Draw(im)
        label = f"{t:.2f}s  f{frame}  {shot}"
        dr.rectangle([0, 0, 12 * len(label), 28], fill=(0, 0, 0))
        dr.text((6, 3), label, fill=(255, 255, 255), font=font)
        sheet.paste(im, ((i % C) * W, (i // C) * H))
    name = os.path.join(d, f"sheet_{n:02d}_{shot.replace('+', '-')}.jpg")
    sheet.save(name, quality=85)
    print(name, len(items))
