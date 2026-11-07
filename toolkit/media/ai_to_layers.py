"""AI picture -> vector -> depth layers (7 Nov 2026, Firefly test, version C).
Usage: ai_to_layers.py in.jpg outdir [--width 5760]
1. vtracer turns the picture into a stacked colour SVG (outdir/art.svg, the editable vector master).
2. rsvg renders it back at --width (sharp at camera zoom).
3. near layer = dark silhouettes (trees, banks) touching the frame edge, with soft alpha so hatching keeps its gaps;
   back layer = everything else, the area behind the near layer inpainted so parallax never shows a hole.
Tune DARK/BANK for other palettes. Credit: 'AI-generated illustration (Adobe Firefly)'."""
import sys, os, subprocess, numpy as np, cv2, vtracer
from PIL import Image
src, out = sys.argv[1], sys.argv[2]; W = int(sys.argv[sys.argv.index('--width') + 1]) if '--width' in sys.argv else 5760
os.makedirs(out, exist_ok=True); svg = f'{out}/art.svg'
vtracer.convert_image_to_svg_py(src, svg, colormode='color', hierarchical='stacked', mode='spline', filter_speckle=6, color_precision=6,
  layer_difference=12, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=2)
subprocess.run(['rsvg-convert', '-w', str(W), svg, '-o', f'{out}/art.png'], check=True)
im = np.asarray(Image.open(f'{out}/art.png').convert('RGB')); H = im.shape[0]
f = im.astype(np.int32); r, g, b = f[..., 0], f[..., 1], f[..., 2]; lum = 0.3 * r + 0.59 * g + 0.11 * b; yy, xx = np.mgrid[0:H, 0:W]
DARK = (lum < 90) & (b >= r - 5); BANK = (b > r + 12) & (lum < 150) & (yy > 0.62 * H) & ((xx < 0.42 * W) | (xx > 0.58 * W))
n, lab, st, _ = cv2.connectedComponentsWithStats((DARK | BANK).astype(np.uint8), 8)
keep = np.array([i > 0 and st[i][4] > 4000 and (st[i][0] <= 3 or st[i][0] + st[i][2] >= W - 3 or st[i][1] + st[i][3] >= H - 3) for i in range(n)])
core = keep[lab].astype(np.uint8); zone = cv2.dilate(core, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))
alpha = cv2.GaussianBlur(np.maximum(core.astype(float), np.clip((150 - lum) / 60, 0, 1) * (b >= r - 15) * zone).astype(np.float32), (3, 3), 0)
Image.fromarray(np.dstack([im, (alpha * 255).astype(np.uint8)])).save(f'{out}/near.png')
s = 4; sm = cv2.resize(im, (W // s, H // s), interpolation=cv2.INTER_AREA); mk = cv2.dilate(cv2.resize(zone, (W // s, H // s), interpolation=cv2.INTER_NEAREST), np.ones((5, 5), np.uint8))
fill = cv2.GaussianBlur(cv2.inpaint(cv2.cvtColor(sm, cv2.COLOR_RGB2BGR), mk * 255, 20, cv2.INPAINT_TELEA), (9, 9), 0)
fill = cv2.cvtColor(cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB)
Image.fromarray(np.where(cv2.resize(mk, (W, H), interpolation=cv2.INTER_NEAREST)[..., None].astype(bool), fill, im)).save(f'{out}/back.png')
print('ok', W, H)
