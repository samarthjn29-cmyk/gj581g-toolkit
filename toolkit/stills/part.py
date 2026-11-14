#!/usr/bin/env python3
"""Cut one moving part out of a painted still, for shot `parts` (Sam, 14 Nov 2026: "Can we make the characters or things in the
pictures to move?" -> cut-out moves, puppet parts, cinemagraphs).
Writes OUTDIR/<name>.png (the part, RGBA, full frame, so it lines up with the still) and OUTDIR/base.png (the still with every part
cut so far painted out by inpainting, so the gap a moving part leaves never shows the old part). Run once per part; base.png builds up.
  --box x0 y0 x1 y1   fractions of the frame: rembg finds the object inside the box (a brick, a lever, a frog)
  --poly "x,y x,y ..." fractions: cut exactly this shape (an arm, a tail, a band of strings); with --box too, the two are intersected
  --keep              don't paint the part out of base.png (for parts that only move a pixel or two: strings, flags)
  --plate PLATE.png   a clean plate: the same painting regenerated in Firefly WITHOUT the part (reference = the still, prompt "same
                      image ... remove the hand ... continue what is underneath"). It is aligned to the still (ECC affine) and blended
                      in only around the part, so the gap a moving part leaves shows real painting. Sam, 14 Nov 2026: the motion-test
                      moves with inpainted gaps "were not clean": every cut-out or puppet move that travels more than a few pixels
                      needs a plate.
  --bend AX,AY TX,TY a bend map (OUTDIR/<name>_bend.png): weight 0 at the anchor (where the part joins the body: a cuff, a
                      shoulder) rising to 1 at the tip (the pen, the hand). The part then bends like a limb instead of sliding as a
                      rigid cut-out, so the joint never opens a seam (Sam, 14 Nov 2026: "It's cut out from the remaining hand").
Usage: part.py STILL.jpg OUTDIR NAME [--box ...] [--poly ...] [--grow 14] [--keep]
Then on the shot: "parts_base": "parts/<X>/base.png", "parts": [{"img": "parts/<X>/<name>.png", "act": ..., "pivot": [x, y], ...}]."""
import sys, os, argparse, numpy as np, cv2
from PIL import Image
ap = argparse.ArgumentParser(); ap.add_argument('img'); ap.add_argument('out'); ap.add_argument('name')
ap.add_argument('--box', type=float, nargs=4); ap.add_argument('--poly'); ap.add_argument('--grow', type=int, default=14); ap.add_argument('--keep', action='store_true'); ap.add_argument('--plate'); ap.add_argument('--bend', nargs=2)
a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
im = Image.open(a.img).convert('RGB'); W, H = im.size; m = np.zeros((H, W), np.uint8)
if a.box:
    from rembg import remove, new_session
    x0, y0, x1, y1 = int(a.box[0] * W), int(a.box[1] * H), int(a.box[2] * W), int(a.box[3] * H)
    cut = remove(im.crop((x0, y0, x1, y1)), session=new_session('isnet-general-use'))
    m[y0:y1, x0:x1] = (np.asarray(cut)[:, :, 3] > 60).astype(np.uint8) * 255
if a.poly:
    pm = np.zeros((H, W), np.uint8); pts = np.array([[float(v) for v in p.split(',')] for p in a.poly.split()]) * [W, H]
    cv2.fillPoly(pm, [pts.astype(np.int32)], 255); m = (m & pm) if a.box else pm
# keep the largest piece only (rembg sometimes picks up specks), soften the edge by a pixel
n, lab, st, _ = cv2.connectedComponentsWithStats((m > 0).astype(np.uint8))
if n > 2: big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])); m = np.where(lab == big, 255, 0).astype(np.uint8)
alpha = cv2.GaussianBlur(m, (3, 3), 0)
part = np.dstack([np.asarray(im), alpha]); Image.fromarray(part, 'RGBA').save(f'{a.out}/{a.name}.png')
bp = f'{a.out}/base.png'; base = np.asarray(Image.open(bp).convert('RGB')) if os.path.exists(bp) else np.asarray(im)
if a.plate:
    A = base.astype(np.float32); B = np.asarray(Image.open(a.plate).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)
    ga, gb = [cv2.resize(cv2.cvtColor(x, cv2.COLOR_RGB2GRAY), None, fx=0.25, fy=0.25) for x in (A, B)]; wp = np.eye(2, 3, dtype=np.float32)
    try: _, wp = cv2.findTransformECC(ga, gb, wp, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), None, 5); wp[:, 2] /= 0.25
    except cv2.error: print('plate: alignment failed, using it unaligned')
    Bw = cv2.warpAffine(B, wp, (W, H), flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REFLECT)
    g = cv2.dilate(m, np.ones((45, 45), np.uint8)); f = cv2.GaussianBlur(g, (61, 61), 0)[..., None] / 255.0
    base = (A * (1 - f) + Bw * f).clip(0, 255).astype(np.uint8)
elif not a.keep:
    g = cv2.dilate(m, np.ones((a.grow, a.grow), np.uint8)); small = 4; bgr = cv2.cvtColor(base, cv2.COLOR_RGB2BGR)
    s = cv2.resize(bgr, (W // small, H // small)); ms = cv2.resize(g, (s.shape[1], s.shape[0]))
    fill = cv2.resize(cv2.inpaint(s, ms, 9, cv2.INPAINT_TELEA), (W, H), interpolation=cv2.INTER_CUBIC)
    mf = cv2.GaussianBlur(g, (21, 21), 0)[..., None] / 255.0
    base = cv2.cvtColor((bgr * (1 - mf) + fill * mf).astype(np.uint8), cv2.COLOR_BGR2RGB)
Image.fromarray(base).save(bp)
if a.bend:
    (ax, ay), (tx, ty) = [[float(v) for v in p.split(',')] for p in a.bend]; w0, h0 = 480, 270
    X, Y = np.meshgrid((np.arange(w0) + 0.5) / w0, (np.arange(h0) + 0.5) / h0); vx, vy = (tx - ax) * 16 / 9, ty - ay
    u = (((X - ax) * 16 / 9) * vx + (Y - ay) * vy) / (vx * vx + vy * vy); u = np.clip(u, 0, 1); u = u * u * (3 - 2 * u)
    v = (128 + 127 * u).astype(np.uint8); Image.fromarray(np.dstack([v, v, np.full_like(v, 128)]), 'RGB').save(f'{a.out}/{a.name}_bend.png')
print(f'{a.name}: {float((m > 0).mean()):.3f} of the frame -> {a.out}')
