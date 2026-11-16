"""Monocle Egg pop-ups (Sam, 16 Nov 2026: "Instead of letting him speak, let the character just do expressions.
Reduce its size ... Allow him to pop up from anywhere on the screen. Make the character mischievous, naughty and fun.")

He never talks. He pops in from any edge or corner with a springy overshoot, pulls a face (or a run of faces, each
swap with a little squash-and-stretch "boing"), and ducks back out. Overlaid on a chapter clip (or a still).

Usage:
  python3 pop25d.py --dir PARTS --base clip.mp4|still.jpg --events pops.json --out out.mp4 [--w 1920 --h 1080 --fps 30]
pops.json: [{"t": 2.0, "dur": 2.4, "from": "br", "seq": [["smirk", 0], ["wink", 1.1]], "size": 0.26}, ...]
  from: bottom | top (hangs upside down) | left | right | tl | tr | bl | br (corner peeks)
  x (optional, 0-1): where along that edge he appears; size: his height as a share of the screen (default 0.26)
PARTS holds master.jpg plus EX_<name>.jpg poses (same 2752x1536 framing, plain white ground).
"""
import argparse, json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument('--dir', required=True); ap.add_argument('--base', required=True); ap.add_argument('--events', required=True)
ap.add_argument('--out', required=True); ap.add_argument('--w', type=int, default=1920); ap.add_argument('--h', type=int, default=1080)
ap.add_argument('--fps', type=int, default=30); ap.add_argument('--dur', type=float, default=0)
a = ap.parse_args()

def alpha_of(img):
    near = img.min(2) > 232
    lab, _ = ndimage.label(near); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    al = ndimage.binary_fill_holes(~np.isin(lab, list(edge)))
    al = ndimage.binary_opening(al, iterations=2)
    lab, n = ndimage.label(al)   # the character only: drop stray specks
    if n > 1: s = ndimage.sum(al, lab, range(1, n + 1)); al = lab == (1 + int(np.argmax(s)))
    return al

poses = {}
for f in sorted(os.listdir(a.dir)):
    if f == 'master.jpg' or f.startswith('EX_') or f in ('AV_brow.jpg', 'AV_blink.jpg'):
        rgb = np.array(Image.open(os.path.join(a.dir, f)).convert('RGB'))
        poses[f[:-4].replace('EX_', '').replace('AV_', '')] = (rgb, alpha_of(rgb.astype(np.float32)))
poses['neutral'] = poses.pop('master')
# one shared box so every pose keeps the same scale and foot line
U = np.zeros(next(iter(poses.values()))[1].shape, bool)
for _, al in poses.values(): U |= al
ys, xs = np.where(U); BOX = (xs.min() - 6, ys.min() - 6, xs.max() + 6, ys.max() + 6)
cut = {}
for k, (rgb, al) in poses.items():
    im = Image.fromarray(rgb).convert('RGBA'); im.putalpha(Image.fromarray((al * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0)))
    cut[k] = im.crop(BOX)
print('poses:', ', '.join(sorted(cut)), file=sys.stderr)

ev = json.load(open(a.events))
W, H, FPS = a.w, a.h, a.fps
is_vid = a.base.lower().endswith(('.mp4', '.mov', '.mkv', '.webm'))
if is_vid:
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.base], capture_output=True, text=True).stdout)
else:
    dur = a.dur or max(e['t'] + e['dur'] for e in ev) + 0.5
N = int(dur * FPS)

def back(u, s=1.9):   # ease-out with overshoot (the spring)
    u -= 1; return u * u * ((s + 1) * u + s) + 1
def ease_in(u): return u * u * u
cache = {}
def sized(k, h):
    key = (k, h)
    if key not in cache: im = cut[k]; cache[key] = im.resize((int(im.width * h / im.height), h), Image.LANCZOS)
    return cache[key]

def place(e, t):
    """the pose image, its centre and rotation for event e at time t (None when off screen)."""
    t0, d = e['t'], e['dur']
    if not (t0 <= t < t0 + d): return None
    u = t - t0; IN, OUT = 0.38, 0.30
    k = e['seq'][0][0]
    for name, at in e['seq']:
        if u >= at: k = name
    h = int(H * e.get('size', 0.26))
    # squash-and-stretch on each swap
    sq = 1.0
    for name, at in e['seq'][1:]:
        if 0 <= u - at < 0.16: v = (u - at) / 0.16; sq = 1 - 0.12 * math.sin(v * math.pi) + 0.06 * math.sin(v * 2 * math.pi)
    if u < IN: p = back(u / IN)
    elif u > d - OUT: p = 1 - ease_in((u - (d - OUT)) / OUT)
    else: p = 1.0
    bob = 4 * math.sin((t - t0) * 2 * math.pi / 1.3)
    side = e['from']; x = e.get('x', 0.5); img = sized(k, h); w = img.width
    # where he sits when fully in, and where he hides when out
    if side == 'bottom': cx, cy, rot = x * W, H - h * 0.38, 0; hx, hy = cx, H + h * 0.6
    elif side == 'top': cx, cy, rot = x * W, h * 0.38, 180; hx, hy = cx, -h * 0.6
    elif side == 'left': cx, cy, rot = w * 0.26, x * H, -38; hx, hy = -w * 0.9, cy
    elif side == 'right': cx, cy, rot = W - w * 0.26, x * H, 38; hx, hy = W + w * 0.9, cy
    elif side == 'bl': cx, cy, rot = w * 0.30, H - h * 0.30, -32; hx, hy = -w, H + h * 0.5
    elif side == 'br': cx, cy, rot = W - w * 0.30, H - h * 0.30, 32; hx, hy = W + w, H + h * 0.5
    elif side == 'tl': cx, cy, rot = w * 0.30, h * 0.30, -148; hx, hy = -w, -h * 0.5
    elif side == 'tr': cx, cy, rot = W - w * 0.30, h * 0.30, 148; hx, hy = W + w, -h * 0.5
    px, py = hx + (cx - hx) * p, hy + (cy - hy) * p
    if side in ('bottom', 'top'): py += bob * (1 if side == 'bottom' else -1)
    im = img.resize((int(w / sq), int(h * sq)), Image.LANCZOS) if sq != 1.0 else img
    im = im.rotate(-rot + 3 * math.sin((t - t0) * 2.3), resample=Image.BICUBIC, expand=True)
    return im, int(px), int(py)

if is_vid:
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', a.base, '-vf', f'scale={W}:{H},fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
else:
    still = Image.open(a.base).convert('RGB').resize((W, H), Image.LANCZOS)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-']
                       + (['-i', a.base, '-map', '0:v', '-map', '1:a?', '-c:a', 'aac', '-b:a', '192k'] if is_vid else [])
                       + ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-shortest', a.out], stdin=subprocess.PIPE)
for i in range(N):
    t = i / FPS
    if is_vid:
        raw = dec.stdout.read(W * H * 3)
        if len(raw) < W * H * 3: break
        fr = Image.frombytes('RGB', (W, H), raw)
    else: fr = still.copy()
    for e in ev:
        r = place(e, t)
        if r: im, px, py = r; fr.paste(im, (px - im.width // 2, py - im.height // 2), im)
    enc.stdin.write(fr.tobytes())
enc.stdin.close(); enc.wait()
if is_vid: dec.stdout.close(); dec.wait()
print('wrote', a.out)
