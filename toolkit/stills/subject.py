#!/usr/bin/env python3
"""Cut the main subject out of a still for the drama moves (DRAMA_MOVES.md: vertigo, rack focus, colour drain).
Writes OUTDIR/near.png (the subject, RGBA, full frame), OUTDIR/cut.png (the same, trimmed to the subject), OUTDIR/far.png and mid.png (the picture with the subject painted out by
inpainting, so a background that grows behind the subject never shows a ghost of it). rembg isnet-general-use, CPU.
Usage: subject.py STILL.jpg OUTDIR [--grow 18]   Set the shot's layers to OUTDIR, or isolate to OUTDIR/near.png."""
import sys, os, argparse, numpy as np, cv2
from PIL import Image
from rembg import remove, new_session
ap = argparse.ArgumentParser(); ap.add_argument('img'); ap.add_argument('out'); ap.add_argument('--grow', type=int, default=18); a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
im = Image.open(a.img).convert('RGB'); cut = remove(im, session=new_session('isnet-general-use'))
cut.save(f'{a.out}/near.png'); bb = cut.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
if bb: cut.crop(bb).save(f'{a.out}/cut.png')   # trimmed cut-out for actor / sizecompare / object wipes
m = (np.asarray(cut)[:, :, 3] > 40).astype(np.uint8) * 255
m = cv2.dilate(m, np.ones((a.grow, a.grow), np.uint8))
small = 4; bgr = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2BGR)
s = cv2.resize(bgr, (bgr.shape[1] // small, bgr.shape[0] // small)); ms = cv2.resize(m, (s.shape[1], s.shape[0]))
fill = cv2.resize(cv2.inpaint(s, ms, 9, cv2.INPAINT_TELEA), (bgr.shape[1], bgr.shape[0]), interpolation=cv2.INTER_CUBIC)
mf = cv2.GaussianBlur(m, (31, 31), 0)[..., None] / 255.0
bg = (bgr * (1 - mf) + fill * mf).astype(np.uint8)
out = Image.fromarray(cv2.cvtColor(bg, cv2.COLOR_BGR2RGB)); out.save(f'{a.out}/far.png'); out.save(f'{a.out}/mid.png')
print(f'subject share {float((m > 0).mean()):.2f} -> {a.out}')
