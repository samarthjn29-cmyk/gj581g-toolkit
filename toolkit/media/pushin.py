"""Smooth push-in (slow zoom) from a still photo, for photo panels and backgrounds (toolkit 1.7.2).

  pushin.py photo.jpg out.mp4 <seconds> [--size 1920x1080] [--zoom 1.15] [--center 0.5,0.45] [--fps 30]

ffmpeg's zoompan crops on whole pixels, so a slow zoom moves in visible steps (repeated frames, judder; seen on the
Blindness gorilla panel). This renders every frame with a sub-pixel bicubic crop instead, eased in and out, so the
motion is perfectly smooth. --center is the point to zoom towards (fractions of the photo: x, y); the first frame
shows the whole crop at zoom 1.0 (fit to the output aspect), which prep.py then uses as the cover. Treat the result
as an ordinary clip in media_specs.json (prep.py adds the tint, look and tail)."""
import sys, subprocess, math
from PIL import Image

a = sys.argv[1:]
if len(a) < 3: sys.exit(__doc__)
src, out, secs = a[0], a[1], float(a[2])
opt = lambda k, d: a[a.index(k) + 1] if k in a else d
W, H = [int(x) for x in opt('--size', '1920x1080').split('x')]
Z = float(opt('--zoom', '1.15')); cx, cy = [float(x) for x in opt('--center', '0.5,0.45').split(',')]; fps = int(opt('--fps', '30'))
im = Image.open(src).convert('RGB'); iw, ih = im.size
# largest crop with the output aspect that fits the photo, centred on (cx, cy) as far as the edges allow
cw = min(iw, ih * W / H); ch = cw * H / W
n = int(round(secs * fps))
p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
for i in range(n):
    t = i / max(1, n - 1); e = 0.5 - 0.5 * math.cos(math.pi * t)       # ease in and out
    z = 1 + (Z - 1) * e; w, h = cw / z, ch / z
    x0 = min(max(cx * iw - w / 2, 0), iw - w); y0 = min(max(cy * ih - h / 2, 0), ih - h)
    fr = im.transform((W, H), Image.Transform.EXTENT, (x0, y0, x0 + w, y0 + h), Image.Resampling.BICUBIC)
    p.stdin.write(fr.tobytes())
p.stdin.close(); p.wait()
print(out, f'{n} frames, zoom 1.0 -> {Z}, centre {cx},{cy}')
