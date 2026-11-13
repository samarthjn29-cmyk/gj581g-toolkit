#!/usr/bin/env python3
"""Style check for a video's painted stills (Sam, Moctar, 14 Nov 2026: "Put checks in place so that wrong type of
pictures are covered by your review", after a detailed dark digital painting slipped into the flat gouache set).
Compares every still with the video's STYLE MASTER(S) on four measures, at 690 px wide:
  palette  mean distance (CIE Lab) from each pixel to the master palette (k-means, 10 colours)  -> off-palette colour
  detail   high-frequency energy (mean |Laplacian|)                                           -> fine rendering, photo detail
  dark     share of pixels with L* < 22                                                       -> heavy dark rendering
  smooth   share of soft-gradient pixels (printed only: flat gouache scores high too)
Each measure is scored against the masters' own values; a still more than LIMIT x the master spread off on any measure
is flagged. Writes OUT.jpg: flagged stills next to the master, for the reviewer to judge by eye (the numbers only
shortlist: a night scene can be dark and still on-style).
Usage: style_lint.py MASTER.jpg[,MASTER2.jpg...] STILLS_DIR [--out sheet.jpg] [--limit 1.0] [--only a,b,c]
Exit 1 if anything is flagged. Run on every new batch of AI stills BEFORE they go into a plan, and again in review."""
import sys, os, glob, argparse, numpy as np
from PIL import Image, ImageDraw, ImageFilter
ap = argparse.ArgumentParser(); ap.add_argument('masters'); ap.add_argument('dir'); ap.add_argument('--out'); ap.add_argument('--limit', type=float, default=2.0)
ap.add_argument('--only', default=''); a = ap.parse_args()
def lab(rgb):
    c = rgb / 255.0; c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]); xyz = c @ M.T / np.array([0.9505, 1.0, 1.089])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)
def load(p): im = Image.open(p).convert('RGB'); im = im.resize((690, int(690 * im.size[1] / im.size[0]))); return im, np.asarray(im).astype(float)
def kmeans(X, k=10, it=12):
    rng = np.random.default_rng(0); C = X[rng.choice(len(X), k, replace=False)]
    for _ in range(it):
        d = ((X[:, None] - C[None]) ** 2).sum(-1); l = d.argmin(1)
        C = np.array([X[l == j].mean(0) if (l == j).any() else C[j] for j in range(k)])
    return C
masters = a.masters.split(','); MP = []; mfeat = []
for m in masters:
    _, x = load(m); MP.append(lab(x).reshape(-1, 3)[::7])
PAL = kmeans(np.concatenate(MP))
def feats(x):
    L = lab(x); P = L.reshape(-1, 3)[::5]
    pal = np.sqrt(((P[:, None] - PAL[None]) ** 2).sum(-1)).min(1).mean()
    g = L[..., 0]; lap = np.abs(4 * g[1:-1, 1:-1] - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]).mean()
    dark = (g < 22).mean()
    gx, gy = np.abs(np.diff(g, axis=1))[:-1], np.abs(np.diff(g, axis=0))[:, :-1]; gm = gx + gy
    smooth = ((gm > 0.6) & (gm < 2.5)).mean()
    return np.array([pal, lap, dark, smooth])
for m in masters: mfeat.append(feats(load(m)[1]))
mf = np.array(mfeat); base = mf.mean(0)
spread = np.maximum(np.array([6.0, 2.5, 0.10, 0.10]), (mf.max(0) - mf.min(0)))   # floors so one master still works
names = ['palette', 'detail', 'dark', 'smooth']
only = set(x for x in a.only.split(',') if x)
files = sorted(f for f in glob.glob(os.path.join(a.dir, '*.jpg')) + glob.glob(os.path.join(a.dir, '*.png')) if not only or os.path.splitext(os.path.basename(f))[0] in only)
flag = []
for f in files:
    v = feats(load(f)[1]); z = (v - base) / spread
    bad = [f'{names[i]} {v[i]:.2f} ({z[i]:+.1f})' for i in range(3) if z[i] > a.limit]   # smooth is printed, not judged (flat gouache is smooth too)   # only "more than the master" is off-style
    print(f"{'FLAG' if bad else 'ok  '} {os.path.basename(f):28s} " + '  '.join(f'{names[i]} {v[i]:.2f}' for i in range(4)) + ('   <- ' + ', '.join(bad) if bad else ''))
    if bad: flag.append((f, bad))
print(f'{len(flag)} of {len(files)} flagged (limit {a.limit}); masters: {", ".join(os.path.basename(m) for m in masters)}')
if a.out and flag:
    W, H = 460, 257; s = Image.new('RGB', (W * 2, (H + 40) * len(flag)), 'white'); d = ImageDraw.Draw(s); mim = Image.open(masters[0]).convert('RGB').resize((W, H))
    for i, (f, bad) in enumerate(flag):
        s.paste(Image.open(f).convert('RGB').resize((W, H)), (0, i * (H + 40))); s.paste(mim, (W, i * (H + 40)))
        d.text((4, i * (H + 40) + H + 4), os.path.basename(f) + ': ' + '; '.join(bad), fill='black'); d.text((W + 4, i * (H + 40) + H + 4), 'style master', fill='black')
    s.save(a.out, quality=85); print('sheet:', a.out)
sys.exit(1 if flag else 0)
