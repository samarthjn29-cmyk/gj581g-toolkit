#!/usr/bin/env python3
"""Add NEW painted figures to a 2.5D shot instead of cutting the painting up (Sam, 14 Nov 2026: "Instead of cutting things
out, how about we add things to the clip? Because cutting things out is making the video bad.").
Firefly paints the figures as flat silhouettes on plain white in the video's style; this splits each sheet into figures
(connected dark shapes), trims them, and adds a soft painted ground shadow under the feet, so the painting itself is never
touched. Then it writes figures.json for depth_shot.py --figures: each figure walks in along a path at a chosen ground point.
Usage: add_figures.py OUTDIR SPEC.json
SPEC: [{"sheet": "caravan.png", "pick": [0] (indices left to right, default all), "x": 0.2, "foot": 0.62, "height": 0.045,
        "act": "walk", "dx": 0.02, "step": 1.3, "flip": false, "shadow": [-0.9, 0.25], "air": false}, ...]
height = figure height as a fraction of the frame; x/foot = where its feet are at the start (fractions); shadow = [shear, squash]
(the painting's shadows fall to the left); air = no shadow (birds)."""
import sys, os, json, numpy as np, cv2
from PIL import Image
OUT, SPEC = sys.argv[1], json.load(open(sys.argv[2])); os.makedirs(OUT, exist_ok=True); FW, FH = 2752, 1536; figs = []
for k, sp in enumerate(SPEC):
    im = np.asarray(Image.open(sp['sheet']).convert('RGB')).astype(np.float32); g = im.mean(axis=2)
    m = (g < 170).astype(np.uint8) * 255; m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m); big = st[1:, cv2.CC_STAT_AREA].max()
    comps = sorted([i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.05 * big], key=lambda i: st[i, 0])
    for j in sp.get('pick', range(len(comps))):
        i = comps[j]; x, y, w, h, _ = st[i]
        # include small specks near the shape (rope, stick, ears) within its box
        sub = (m[y:y + h, x:x + w] > 0).astype(np.uint8)
        alpha = np.clip((200 - g[y:y + h, x:x + w]) / 60, 0, 1) * sub
        rgb = im[y:y + h, x:x + w]
        # keep the dark painted colour, matched to the still's silhouettes
        rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
        if not sp.get('air'):
            sh, sq = sp.get('shadow', [-0.9, 0.25]); sh_h = max(4, int(h * sq)); pad = int(abs(sh) * sh_h) + 6
            S = cv2.resize(alpha[::-1], (w, sh_h)); M = np.float32([[1, -sh, 0], [0, 1, 0]])
            canvas = np.zeros((h + sh_h, w + 2 * pad, 4), np.float32); canvas[:h, pad:pad + w] = rgba
            Sh = np.zeros((sh_h, w + 2 * pad), np.float32); Sh[:, pad:pad + w] = S
            Sh = cv2.warpAffine(Sh, M, (w + 2 * pad, sh_h)); Sh = cv2.GaussianBlur(Sh, (0, 0), 2.5) * 0.35
            shadow = np.zeros((sh_h, w + 2 * pad, 4), np.float32); shadow[..., :3] = (60, 52, 40); shadow[..., 3] = Sh * 255
            canvas[h - 1:h - 1 + sh_h] = np.where(canvas[h - 1:h - 1 + sh_h, :, 3:4] > 0, canvas[h - 1:h - 1 + sh_h], shadow)
            rgba = canvas.astype(np.uint8); foot_frac = h / (h + sh_h)   # the feet sit at this height of the image
        else: foot_frac = 1.0
        f = f'add_{k:02d}_{j:02d}.png'; Image.fromarray(rgba, 'RGBA').save(f'{OUT}/{f}')
        tall = max(st[c, 3] for c in comps); Hh = sp['height'] * (h / tall) / foot_frac;   # height = the tallest shape on the sheet; a child stays child-sized
        Ww = Hh * rgba.shape[1] / rgba.shape[0] * FH / FW
        x0 = sp['x'] + sum(st[c, 2] for c in comps[:j]) * 0  # all picked shapes start at x, spread by 'gap'
        x0 = sp['x'] + j * sp.get('gap', 0.0)
        foot = sp['foot'] + (1 - foot_frac) * Hh   # depth_shot puts the image bottom at foot: lift it so the feet, not the shadow, stand there
        figs.append({'file': f, 'x': x0, 'foot': foot, 'w': Ww, 'h': Hh, 'act': sp.get('act', 'walk'), 'dx': sp.get('dx', 0.02),
                     'dy': sp.get('dy', 0), 'step': sp.get('step', 2.0), 'bob': sp.get('bob', 0.002), 'rock': sp.get('rock', 1.5),
                     'flip': sp.get('flip', False), 'phase': 0.7 * (k * 3 + j)})
json.dump(figs, open(f'{OUT}/figures.json', 'w'), indent=1); print(len(figs), 'added figures ->', OUT)
