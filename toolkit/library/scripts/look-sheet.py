#!/usr/bin/env python3
"""Gate 2 look sheet for Sam (Sam, 24 Nov 2026: workflow idea 1, "Do 1,2,3 and 6"): one still per shot (two for a
shot over 8 s), taken when the shot has settled (60% in, or 35% and 80% for long shots), on one contact sheet with
each shot's number, id and time range, so taste notes ("the eye isn't looking good") come before the Gate 3 render
instead of after it. Sent with the Gate 2 sign-off question; it is not a review tool (strict stills and the Director's
frame review stay as they are).
usage: look-sheet.py ACT.json OUT.jpg [--shots ID,ID]   (--shots: only these shots, e.g. after changes)"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(HERE)
a = sys.argv[1:]
only = None
if "--shots" in a:
    i = a.index("--shots")
    only = set(a[i + 1].split(","))
    del a[i:i + 2]
act_path, out = a
act = json.load(open(act_path))
shots = [(n + 1, b) for n, b in enumerate(act["beats"]) if not only or b["id"] in only]
times, label = [], {}
for n, b in shots:
    s, e = b["start"], b["end"]
    fr = (0.35, 0.8) if e - s > 8 else (0.6,)
    for f in fr:
        t = round(s + f * (e - s), 2)
        times.append(t)
        label[t] = f"{n}. {b['id']}  ·  {s:.1f}-{e:.1f} s"
d = os.path.join(os.path.dirname(os.path.abspath(out)), os.path.splitext(os.path.basename(out))[0] + "_frames")
subprocess.run(["node", os.path.join(HERE, "act-stills.mjs"), act_path, d, ",".join(f"{t:.2f}" for t in times), "--scale", "1"], check=True, cwd=LIB,
               stdout=subprocess.DEVNULL)
idx = json.load(open(os.path.join(d, "index.json")))
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
except OSError:
    font = ImageFont.load_default()
W, H, C = 480, 270, 4
rows = (len(idx) + C - 1) // C
sheet = Image.new("RGB", (W * C, (H + 30) * rows), (20, 20, 20))
for k, (t, frame, f, shot) in enumerate(idx):
    im = Image.open(f).convert("RGB").resize((W, H))
    x, y = (k % C) * W, (k // C) * (H + 30)
    sheet.paste(im, (x, y))
    ImageDraw.Draw(sheet).text((x + 6, y + H + 5), label.get(round(t, 2), f"{shot} {t:.1f}"), fill=(235, 235, 235), font=font)
sheet.save(out, quality=85)
print(out, f"{len(idx)} stills, {len(shots)} shots")
