"""2D vs 2.5D vs 3D comparison clip of the Monocle Egg."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np, math, glob, os
from scipy import ndimage

S = Image.open('/home/claude/gods/ai/H2_monocle.jpg').convert('RGB'); k = 2752 / 1376
boxes = [(70, 190, 330, 560), (360, 190, 730, 560), (730, 190, 1000, 560), (1030, 185, 1320, 560)]

def cut(b):
    im = S.crop(tuple(int(v * k) for v in b)); a = np.array(im).astype(int)
    bg = np.median(np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]), axis=0)
    near = np.sqrt(((a - bg) ** 2).sum(2)) < 30
    lab, _ = ndimage.label(near)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    back = np.isin(lab, list(edge))
    alpha = np.where(back, 0, 255).astype(np.uint8)
    alpha = ndimage.binary_opening(alpha > 0, iterations=1).astype(np.uint8) * 255
    o = im.convert('RGBA'); o.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1.2)))
    return o

P = [cut(b) for b in boxes]
W, H = 1280, 720
F = ImageFont.truetype('/home/claude/twice/remotion/public/fonts/Kalam-Bold.ttf', 54)
f2 = ImageFont.truetype('/home/claude/twice/remotion/public/fonts/Kalam-Bold.ttf', 30)

def label(im, t, sub):
    d = ImageDraw.Draw(im); d.rounded_rectangle((30, 26, 30 + len(t) * 34 + 40, 100), 18, fill=(229, 227, 210), outline=(25, 24, 30), width=4)
    d.text((50, 30), t, font=F, fill=(25, 24, 30)); d.text((34, H - 58), sub, font=f2, fill=(229, 227, 210), stroke_width=3, stroke_fill=(25, 24, 30))

os.makedirs('cmp', exist_ok=True)
for f in glob.glob('cmp/*.png'): os.remove(f)
n = 0
def save(im):
    global n; n += 1; im.save(f'cmp/c_{n:04d}.png')

cream = Image.new('RGB', (W, H), (236, 228, 206))
seq = [0, 0, 2, 2, 3, 3, 1, 1]
for i in range(96):                                   # 2D: drawings swapped, on twos
    pose = P[seq[min(i // 12, 7)]]
    im = cream.copy(); h = 520; w = int(pose.width * h / pose.height); pp = pose.resize((w, h))
    jit = (i // 2) % 2
    im.paste(pp, ((W - w) // 2 + jit, 110 - jit), pp)
    label(im, '2D', 'flat drawings, swapped like a flipbook'); save(im)

base = P[0]; bw, bh = base.size; arr = np.array(base)   # 2.5D: one painted cut-out in layers
rgb = arr[..., :3].astype(int)
dark = (rgb.sum(2) < 170) & (np.arange(bh)[:, None] < bh * 0.24) & (arr[..., 3] > 100)
dark = ndimage.binary_dilation(dark, iterations=2) & (arr[..., 3] > 100)
brow = np.zeros_like(arr); brow[dark] = arr[dark]; brow[dark, 3] = 255
body = arr.copy()
skin = np.median(rgb[(arr[..., 3] > 200) & (rgb.sum(2) > 600)], axis=0).astype(np.uint8)
body[dark, :3] = skin
browI = Image.fromarray(brow); bodyI = Image.fromarray(body)
bgimg = Image.open('/home/claude/gods/ai/G_coffee.jpg').convert('RGB').resize((int(W * 1.15), int(H * 1.15)))
for i in range(96):
    t = i / 24
    ox = int(40 * math.sin(t * 0.8)); im = bgimg.crop((60 + ox // 2, 40, 60 + ox // 2 + W, 40 + H))
    h = 470; sc = h / bh; w = int(bw * sc); sq = 1 + 0.025 * math.sin(t * 6); rot = 3 * math.sin(t * 2.2)
    b2 = bodyI.resize((int(w / sq), int(h * sq))).rotate(rot, resample=Image.BICUBIC)
    lift = max(0, min(1, (t - 1.3) * 6)) * (1 if t < 2.8 else max(0, 1 - (t - 2.8) * 6))
    br = browI.resize((int(w / sq), int(h * sq))).rotate(rot + 6 * lift, resample=Image.BICUBIC)
    x = (W - b2.width) // 2 + ox; y = H - 70 - b2.height
    im.paste(b2, (x, y), b2); im.paste(br, (x, y - int(26 * lift)), br)
    label(im, '2.5D', 'one painted cut-out in layers: brow, body and room move separately'); save(im)

fr = sorted(glob.glob('/home/claude/host3d/frames/f_*.png'))   # 3D: the Blender test
for i in range(96):
    im = Image.open(fr[i]).convert('RGB').resize((W, H)); label(im, '3D', 'a modelled character, rendered, mouth synced to your voice'); save(im)
print(n)
