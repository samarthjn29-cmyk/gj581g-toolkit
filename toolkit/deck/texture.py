"""House texture for white content slides, made from the palette. Usage: python3 deck/texture.py <deck_config.json>
(build.sh runs it when the config has "texture"). Writes <out_dir>/texture_<kind>.png (1920x1080).
  grid   faint graph paper in the Rule colour (modern explainer, the Money & Macro look)
  dots   a dot grid (modern / minimal)
  paper  warm paper with soft fibres and noise (vintage, retro, editorial)
Strength: "texture_alpha" (default 0.35); background: "texture_bg" (default FBFAF7; paper F4EDE0)."""
import json, os, sys
from PIL import Image, ImageDraw
cfg_path = sys.argv[1]; C = json.load(open(cfg_path)); P = C['palette']
out = os.path.join(os.path.dirname(os.path.abspath(cfg_path)), C['out_dir']); os.makedirs(out, exist_ok=True)
hexrgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
KIND = C['texture']
bg = hexrgb(C.get('texture_bg', 'F4EDE0' if KIND == 'paper' else 'FBFAF7')); rule = hexrgb(P['rule']); a = float(C.get('texture_alpha', 0.35))
mix = lambda k: tuple(round(bg[i] * (1 - k) + rule[i] * k) for i in range(3))
W, H, step = 1920, 1080, 48
im = Image.new('RGB', (W, H), bg); d = ImageDraw.Draw(im)
if KIND == 'grid':
    for i, x in enumerate(range(0, W + 1, step)): d.line([(x, 0), (x, H)], fill=mix(a if i % 4 == 0 else a * 0.5), width=1)
    for i, y in enumerate(range(0, H + 1, step)): d.line([(0, y), (W, y)], fill=mix(a if i % 4 == 0 else a * 0.5), width=1)
elif KIND == 'dots':
    for x in range(step // 2, W, step):
        for y in range(step // 2, H, step): d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=mix(a * 1.4))
elif KIND == 'paper':
    import random, numpy as np
    from PIL import ImageFilter
    random.seed(7)
    for _ in range(1400):                                   # soft fibres
        x, y = random.uniform(0, W), random.uniform(0, H); L = random.uniform(8, 40); t = random.uniform(0, 3.1416)
        import math; d.line([(x, y), (x + L * math.cos(t), y + L * math.sin(t))], fill=mix(a * random.uniform(0.3, 0.8)), width=1)
    arr = np.asarray(im.filter(ImageFilter.GaussianBlur(0.6))).astype(np.int16)
    arr = arr + np.random.default_rng(3).normal(0, 4, arr.shape[:2])[..., None].astype(np.int16)
    yy, xx = np.mgrid[0:H, 0:W]; v = 1 - 0.07 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)   # gentle vignette
    im = Image.fromarray(np.clip(arr * v[..., None], 0, 255).astype('uint8'))
else: sys.exit('texture: grid, dots or paper')
p = os.path.join(out, f'texture_{KIND}.png'); im.save(p); print(p)
