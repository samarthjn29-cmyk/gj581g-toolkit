"""Monocle Egg 2.5D rig (Mild Astonishment host, Sam 16 Nov 2026: "Let's go with 2.5D").

One painted master pose plus matched variants (made in Firefly by editing the master: only the mouth, the eyes
or the eyebrow changes). The rig cuts each variant's changed patch, keys the white ground out, and animates:
  - mouth patches switched from Rhubarb cues on Sam's own audio (X rest, A-F, G->B, H->C),
  - a blink every 2.5-5 s, an eyebrow raise on cue (crossfade to the raised-brow patch),
  - a gentle bob, a tiny tilt and a squash on loud syllables, over a painted background with slow parallax.

Usage:
  python3 rig25d.py --dir AVATAR_DIR --audio line.wav --cues mouth.json --bg BG.jpg --out out.mp4
         [--brow 1.2:2.4,5.0:6.0] [--side right|left|center] [--height 0.78] [--fps 30] [--w 1920 --h 1080]
AVATAR_DIR holds master.jpg and AV_A.jpg ... AV_F.jpg, AV_blink.jpg, AV_brow.jpg (all the same 2752x1536 framing).
"""
import argparse, json, math, os, random, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument('--dir', required=True); ap.add_argument('--audio', required=True); ap.add_argument('--cues', required=True)
ap.add_argument('--bg', required=True); ap.add_argument('--out', required=True)
ap.add_argument('--brow', default=''); ap.add_argument('--side', default='right'); ap.add_argument('--height', type=float, default=0.78)
ap.add_argument('--fps', type=int, default=30); ap.add_argument('--w', type=int, default=1920); ap.add_argument('--h', type=int, default=1080)
ap.add_argument('--frames', default='')   # debug: "a:b" render only these frame numbers
a = ap.parse_args()
D = a.dir
load = lambda n: np.array(Image.open(os.path.join(D, n)).convert('RGB')).astype(np.float32)
M = load('master.jpg'); H0, W0 = M.shape[:2]

def align(v):
    """shift a variant onto the master (Firefly edits can drift a few px): phase correlation on grey."""
    g1 = M.mean(2); g2 = v.mean(2)
    F = np.fft.fft2(g1) * np.conj(np.fft.fft2(g2)); r = np.fft.ifft2(F / (np.abs(F) + 1e-6)).real
    dy, dx = np.unravel_index(np.argmax(r), r.shape)
    if dy > H0 // 2: dy -= H0
    if dx > W0 // 2: dx -= W0
    return np.roll(np.roll(v, dy, 0), dx, 1), (dy, dx)

# alpha of the master: white ground flood-filled from the edges
def alpha_of(img):
    near = (img.min(2) > 232)
    lab, _ = ndimage.label(near); edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    al = ~np.isin(lab, list(edge)); al = ndimage.binary_fill_holes(al)
    return ndimage.binary_opening(al, iterations=2)
alpha = alpha_of(M)
ys, xs = np.where(alpha)
VB, _ = align(load('AV_brow.jpg')); ALB = alpha_of(VB)   # the raised brow reaches above the head: its own outline
uy, ux = np.where(alpha | ALB); BOX = (ux.min() - 8, uy.min() - 8, ux.max() + 8, uy.max() + 8)
AM = ndimage.gaussian_filter(alpha.astype(np.float32), 1.0); AB = ndimage.gaussian_filter(ALB.astype(np.float32), 1.0)
face_top, face_bot = ys.min(), ys.min() + int((ys.max() - ys.min()) * 0.55)   # the head region

# the waistcoat (brick red in the master) and the ink line around it, grown a little: never part of a face patch
VEST = ndimage.binary_dilation((M[..., 0] - M[..., 1] > 45) & (M[..., 0] > 90), iterations=14)
VEST = ndimage.binary_closing(VEST, iterations=6)
LIMIT = {}   # region -> (x0, y0, x1, y1): no patch pixel outside it (a Firefly edit can repaint other parts too)
def patch(name, region):
    """the changed pixels of a variant inside the head, as (rgb, soft mask), aligned to the master."""
    v, sh = align(load(name)); d = np.abs(v - M).max(2) > 34
    if region != 'brow': d[:face_top] = False
    d[face_bot:] = False
    if region in LIMIT:
        x0, y0, x1, y1 = LIMIT[region]; keep = np.zeros_like(d); keep[y0:y1, x0:x1] = True; d &= keep
    if region == 'mouth': d[:face_top + int((face_bot - face_top) * 0.45)] = False
    if region in ('eyes', 'brow'): d[face_top + int((face_bot - face_top) * 0.62):] = False
    lab, n = ndimage.label(ndimage.binary_dilation(d, iterations=3))
    if n:   # keep the biggest blobs only (noise elsewhere is AI re-painting)
        s = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); keep = [i + 1 for i, x in enumerate(s) if x > s.max() * 0.08]
        d = np.isin(lab, keep)
    d = ndimage.binary_fill_holes(ndimage.binary_dilation(d, iterations=10)) & ((alpha | ALB) if region == 'brow' else alpha)
    if region == 'mouth': d &= ~VEST   # the face only: an edit that recoloured the waistcoat must not leak through
    m = ndimage.gaussian_filter(d.astype(np.float32), 5)
    if region == 'mouth': m *= ~VEST
    print(f'{name}: shift {sh}, patch {int(d.sum())} px', file=sys.stderr)
    return v, m[..., None]

P = {}
# the mouth box: from the widest clean open mouth (D) and the rest smile, grown a little
dm = np.zeros(M.shape[:2], bool)
for k in ('A', 'D'):
    vv, _ = align(load(f'AV_{k}.jpg')); dd = np.abs(vv - M).max(2) > 34
    dd[:face_top + int((face_bot - face_top) * 0.45)] = False; dd[face_bot:] = False
    lab_, n_ = ndimage.label(ndimage.binary_dilation(dd, iterations=3))
    if n_: s_ = ndimage.sum(np.ones_like(lab_), lab_, range(1, n_ + 1)); dm |= lab_ == (1 + int(np.argmax(s_)))
my, mx = np.where(dm); mw, mh = mx.max() - mx.min(), my.max() - my.min()
LIMIT['mouth'] = (mx.min() - int(mw * 0.15), my.min() - int(mh * 0.25), mx.max() + int(mw * 0.15), my.max() + int(mh * 0.25))
print('mouth box', LIMIT['mouth'], file=sys.stderr)
for k in 'ABCDEF': P[k] = patch(f'AV_{k}.jpg', 'mouth')
P['blink'] = patch('AV_blink.jpg', 'eyes'); P['brow'] = patch('AV_brow.jpg', 'brow')
MAP = {'X': None, 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'B', 'H': 'C'}

cues = json.load(open(a.cues))['mouthCues']
def mouth_at(t):
    for c in cues:
        if c['start'] <= t < c['end']: return MAP.get(c['value'])
    return None
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.audio], capture_output=True, text=True).stdout)
N = int(math.ceil(dur * a.fps)) + int(0.5 * a.fps)
# loudness envelope for squash
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.audio, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
y = np.frombuffer(raw, np.float32); hop = 16000 // a.fps
env = np.array([np.sqrt((y[i * hop:(i + 1) * hop] ** 2).mean() + 1e-9) if len(y[i * hop:(i + 1) * hop]) else 0.0 for i in range(N)])
env = env / (env.max() + 1e-9)
random.seed(7); blinks = []; t = 1.2
while t < dur + 1: blinks.append(t); t += random.uniform(2.5, 5.0)
brows = [tuple(map(float, s.split(':'))) for s in a.brow.split(',') if s]

bg = Image.open(a.bg).convert('RGB'); bw, bh = int(a.w * 1.12), int(a.h * 1.12)
bg = bg.resize((bw, bh), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2.5))   # depth: the room sits behind him
bg = Image.blend(bg, Image.new('RGB', bg.size, (14, 12, 10)), 0.18)
ch = int(a.h * a.height); cw = int((BOX[2] - BOX[0]) * ch / (BOX[3] - BOX[1]))
cx = {'right': int(a.w * 0.74), 'left': int(a.w * 0.26), 'center': a.w // 2}[a.side]
os.makedirs('/tmp/rig_frames', exist_ok=True)
for f in os.listdir('/tmp/rig_frames'): os.remove(os.path.join('/tmp/rig_frames', f))
rng = range(N)
if a.frames: s0, s1 = map(int, a.frames.split(':')); rng = range(s0, s1)
for i in rng:
    t = i / a.fps; img = M.copy()
    k = mouth_at(t)
    if k: v, m = P[k]; img = img * (1 - m) + v * m
    for b in blinks:
        if b <= t < b + 0.13: v, m = P['blink']; img = img * (1 - m) + v * m
    al = AM
    for (b0, b1) in brows:
        u = min(1, max(0, (t - b0) / 0.15)) * min(1, max(0, (b1 - t) / 0.2))
        if u > 0:
            v, m = P['brow']; img = img * (1 - m * u) + v * m * u
            mb = m[..., 0] * u; al = al * (1 - mb) + AB * mb   # the outline follows the brow
    ci = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA'); ci.putalpha(Image.fromarray((np.clip(al, 0, 1) * 255).astype(np.uint8)))
    ci = ci.crop(BOX)
    sq = 1 + 0.035 * env[min(i, N - 1)] * (1 if k in ('C', 'D', 'E') else 0.4)     # squash on open vowels
    bob = 6 * math.sin(t * 2 * math.pi / 2.4); tilt = 1.6 * math.sin(t * 2 * math.pi / 3.7 + 0.6)
    c2 = ci.resize((int(cw / sq), int(ch * sq)), Image.LANCZOS).rotate(tilt, resample=Image.BICUBIC, expand=True)
    ox = int(18 * math.sin(t * 0.35)); frame = bg.crop(((bw - a.w) // 2 + ox, (bh - a.h) // 2, (bw - a.w) // 2 + ox + a.w, (bh - a.h) // 2 + a.h))
    sh = Image.new('L', (int(cw * 0.8), int(ch * 0.07)), 0); ImageDraw.Draw(sh).ellipse((0, 0, sh.width - 1, sh.height - 1), fill=120)
    sh = sh.filter(ImageFilter.GaussianBlur(14)); foot = a.h - int(a.h * 0.06)
    frame.paste((20, 16, 12), (cx - sh.width // 2, foot - sh.height // 2), sh)
    frame.paste(c2, (cx - c2.width // 2, foot - c2.height + int(bob) + 6), c2)
    frame.save(f'/tmp/rig_frames/f_{i:05d}.png')
if not a.frames:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(a.fps), '-i', '/tmp/rig_frames/f_%05d.png', '-i', a.audio,
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', a.out], check=True)
    print('wrote', a.out)
