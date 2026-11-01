"""Risograph look for photos and short clips (toolkit 1.9.1): 2-3 spot-colour inks, each printed as its own rotated
halftone screen, with ink grain, white flecks, slight misregistration and a warm paper base, layered like real riso inks
(multiply). Made for Decked out Data videos: an image or clip reads as a printed zine illustration in the project's palette.

Usage:
  riso.py image in.jpg out.png [--inks 2B1B3F,E07A5F[,C9B6EE]] [--width 1920] [--cell 7] [--shift 3] [--paper F3EEE4] [--seed 1]
  riso.py video in.mp4 out.mp4 [same options] [--start S --len L]     (frame by frame; the screens stay fixed, the grain moves)
  riso.py inks                                                          (prints the classic riso ink colours)
Ink 1 prints the shadows and shapes (use a dark ink: the palette's Primary or Accent); ink 2 prints the midtones and warm
areas (the Callout); an optional ink 3 prints the highlights' tint (a light accent or yellow). Data, text and snips are never
riso'd: it is for photos, footage, archive images and illustrations only.
"""
import sys, argparse, subprocess, json
import numpy as np
from PIL import Image, ImageFilter

INKS = {'black': '000000', 'medium_blue': '3255A4', 'blue': '0078BF', 'teal': '00838A', 'green': '00A95C', 'yellow': 'FFE800',
        'orange': 'FF6C2F', 'fluorescent_pink': 'FF48B0', 'bright_red': 'F15060', 'burgundy': '914E72', 'purple': '765BA7',
        'violet': '9D7AD2', 'mint': '82D8D5', 'sunflower': 'FFB511', 'coral': 'FF8E91', 'cornflower': '62A8E5'}

def hexrgb(h): h = h.strip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255

def screen(h, w, cell, angle):
    """Amplitude-modulated round-dot halftone screen in 0..1 (a pixel inks where density > screen)."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32); a = np.deg2rad(angle)
    u = (x * np.cos(a) + y * np.sin(a)) * 2 * np.pi / cell; v = (-x * np.sin(a) + y * np.cos(a)) * 2 * np.pi / cell
    return (np.cos(u) * np.cos(v)) * -0.5 + 0.5

class Riso:
    def __init__(self, h, w, inks, cell=7.0, shift=3, paper='F3EEE4', seed=1):
        self.h, self.w, self.inks = h, w, [hexrgb(i) for i in inks]; rng = np.random.default_rng(seed); self.rng = rng
        angles = [15, 75, 45][:len(inks)]; self.screens = [screen(h, w, cell * (1 + 0.08 * i), angles[i]) for i in range(len(inks))]
        self.shifts = [(0, 0)] + [tuple(int(v) for v in rng.integers(-shift, shift + 1, 2)) for _ in inks[1:]]
        fib = np.asarray(Image.fromarray((rng.random((h // 4, w // 4)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2)), np.float32) / 255
        self.paper = hexrgb(paper)[None, None, :] * (0.985 + 0.03 * fib[..., None])
        self.uneven = [np.asarray(Image.fromarray((rng.random((h // 24 + 1, w // 24 + 1)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255 for _ in inks]

    def separate(self, rgb):
        L = rgb @ np.array([0.299, 0.587, 0.114], np.float32)
        L = (L - np.percentile(L, 2)) / max(1e-3, np.percentile(L, 98) - np.percentile(L, 2)); L = np.clip(L, 0, 1)
        warm = np.clip((rgb[..., 0] - rgb[..., 2]) * 1.6 + 0.15, 0, 1)
        d1 = np.clip((1 - L) ** 1.35 * 1.05, 0, 1)                                  # shadows and shapes
        d2 = np.clip(np.exp(-((L - 0.55) / 0.28) ** 2) * (0.45 + 0.55 * warm), 0, 1)  # midtones, warmer areas stronger
        d3 = np.clip((L - 0.55) * 1.2, 0, 1) * 0.55                                 # tint in the highlights
        return [d1, d2, d3][:len(self.inks)]

    def frame(self, rgb, t=0):
        out = self.paper.copy(); rng = np.random.default_rng(1000 + t)
        for i, d in enumerate(self.separate(rgb)):
            dy, dx = self.shifts[i]; d = np.roll(np.roll(d, dy, 0), dx, 1)
            ink = (d > self.screens[i]).astype(np.float32)
            ink = np.asarray(Image.fromarray((ink * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), np.float32) / 255
            cover = 0.80 + 0.2 * self.uneven[i]                                     # uneven ink laydown
            flecks = (rng.random((self.h, self.w)) > 0.012).astype(np.float32)      # white specks where ink skipped
            a = (ink * cover * flecks)[..., None]
            out = out * (1 - a * (1 - self.inks[i][None, None, :]))                  # multiply, like overprinted inks
        grain = rng.normal(0, 0.018, (self.h, self.w, 1)).astype(np.float32)
        return np.clip(out + grain, 0, 1)

def load(path, width):
    im = Image.open(path).convert('RGB'); im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    return np.asarray(im, np.float32) / 255

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('mode'); ap.add_argument('inp', nargs='?'); ap.add_argument('out', nargs='?')
    ap.add_argument('--inks', default='2B1B3F,E07A5F'); ap.add_argument('--width', type=int, default=1920); ap.add_argument('--cell', type=float, default=7)
    ap.add_argument('--shift', type=int, default=3); ap.add_argument('--paper', default='F3EEE4'); ap.add_argument('--seed', type=int, default=1)
    ap.add_argument('--start', type=float, default=0); ap.add_argument('--len', type=float, default=None)
    a = ap.parse_args(); inks = [INKS.get(i, i) for i in a.inks.split(',')]
    if a.mode == 'inks': print(json.dumps(INKS, indent=1)); sys.exit()
    if a.mode == 'image':
        rgb = load(a.inp, a.width); R = Riso(rgb.shape[0], rgb.shape[1], inks, a.cell, a.shift, a.paper, a.seed)
        Image.fromarray((R.frame(rgb) * 255).astype(np.uint8)).save(a.out); print('wrote', a.out, rgb.shape[1], 'x', rgb.shape[0])
    elif a.mode == 'video':
        pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'json', a.inp], capture_output=True, text=True).stdout)['streams'][0]
        w = a.width; h = round(pr['height'] * w / pr['width'] / 2) * 2; fps = pr['r_frame_rate']
        cut = ['-ss', str(a.start)] + (['-t', str(a.len)] if a.len else [])
        dec = subprocess.Popen(['ffmpeg', '-v', 'error', *cut, '-i', a.inp, '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
        enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', fps, '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast',
                                '-crf', '20', '-pix_fmt', 'yuv420p', '-g', '48', '-movflags', '+faststart', a.out], stdin=subprocess.PIPE)
        R = Riso(h, w, inks, a.cell, a.shift, a.paper, a.seed); t = 0
        while True:
            buf = dec.stdout.read(w * h * 3)
            if len(buf) < w * h * 3: break
            enc.stdin.write((R.frame(np.frombuffer(buf, np.uint8).reshape(h, w, 3).astype(np.float32) / 255, t) * 255).astype(np.uint8).tobytes()); t += 1
        enc.stdin.close(); enc.wait(); print('wrote', a.out, t, 'frames')
