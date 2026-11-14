#!/usr/bin/env python3
"""Find the small figures (animals, people) in a painted still by comparing it with a Firefly clean plate of the same
painting without them (Sam, 14 Nov 2026: "make the goats, camels and people move in 2.5D").
Writes OUTDIR/fig_NN.png (each figure cut out, RGBA, trimmed), OUTDIR/plate_aligned.png (the plate aligned to the still,
used as the background) and OUTDIR/figures.json ([{file, x, y, w, h, foot}] in fractions of the frame; foot = the
figure's ground point, which sets its depth in the scene).
Usage: figures.py STILL.jpg PLATE.png OUTDIR [--thresh 38] [--min 120] [--max 0.01]"""
import sys, os, json, argparse, numpy as np, cv2
from PIL import Image
ap = argparse.ArgumentParser(); ap.add_argument('still'); ap.add_argument('plate'); ap.add_argument('out')
ap.add_argument('--thresh', type=float, default=38); ap.add_argument('--min', type=int, default=120); ap.add_argument('--max', type=float, default=0.01)
a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
A = np.asarray(Image.open(a.still).convert('RGB')).astype(np.float32); H, W, _ = A.shape
B = np.asarray(Image.open(a.plate).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)
ga, gb = [cv2.resize(cv2.cvtColor(x, cv2.COLOR_RGB2GRAY), None, fx=0.25, fy=0.25) for x in (A, B)]; wp = np.eye(2, 3, dtype=np.float32)
_, wp = cv2.findTransformECC(ga, gb, wp, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), None, 5); wp[:, 2] /= 0.25
Bw = cv2.warpAffine(B, wp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REFLECT)
Image.fromarray(Bw.clip(0, 255).astype(np.uint8)).save(f'{a.out}/plate_aligned.png')
d = np.abs(cv2.GaussianBlur(A, (5, 5), 0) - cv2.GaussianBlur(Bw, (5, 5), 0)).max(axis=2)
m = (d > a.thresh).astype(np.uint8) * 255
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)); m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
n, lab, st, cen = cv2.connectedComponentsWithStats(m); figs = []
for i in range(1, n):
    x, y, w, h, area = st[i]
    if area < a.min or area > a.max * W * H: continue
    pad = 6; x0, y0, x1, y1 = max(0, x - pad), max(0, y - pad), min(W, x + w + pad), min(H, y + h + pad)
    mk = cv2.dilate((lab[y0:y1, x0:x1] == i).astype(np.uint8) * 255, np.ones((5, 5), np.uint8)); mk = cv2.GaussianBlur(mk, (3, 3), 0)
    rgba = np.dstack([A[y0:y1, x0:x1].astype(np.uint8), mk]); f = f'fig_{len(figs):02d}.png'
    Image.fromarray(rgba, 'RGBA').save(f'{a.out}/{f}')
    figs.append({'file': f, 'x': (x0 + x1) / 2 / W, 'y': (y0 + y1) / 2 / H, 'w': (x1 - x0) / W, 'h': (y1 - y0) / H, 'foot': y1 / H, 'area': int(area)})
json.dump(figs, open(f'{a.out}/figures.json', 'w'), indent=1); print(len(figs), 'figures ->', a.out)
