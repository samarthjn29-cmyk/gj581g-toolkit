"""Style test (19 Nov 2026): three Kling illustration styles moved with our own depth camera, plus one Kling motion clip.
Each still: 2.5D camera move from its depth map (near pixels move more), stepped on twos, plus one small live detail:
the laser shimmers (its teal pixels pulse), the candle flickers (a warm light pool breathes around the flame).
Title cards in the hands card system (serif on paper, tiny mono source line). Watermarks are left as Kling made them (test only)."""
import cv2, numpy as np, subprocess, sys
W, H, FPS = 1920, 1080, 30
rng = np.random.default_rng(3)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

def depth(name):
    d = np.load(f'd_{name}.npy').astype(np.float32)
    d = cv2.GaussianBlur(cv2.dilate(d, np.ones((9, 9), np.uint8)), (0, 0), 3)
    return d

def flicker(t, seed):  # candle: two slow sines and a stepped jitter, 0.85..1.15
    return 1 + 0.06 * np.sin(t * 7.3 + seed) + 0.04 * np.sin(t * 13.1 + 2 * seed) + 0.04 * (((int(t * 12) * 2654435761) % 1000) / 1000 - 0.5)

def still_shot(name, secs, move, kind):
    im = cv2.imread(f'{name}.jpg').astype(np.float32); dep = depth(name)
    b, g, r = im[..., 0], im[..., 1], im[..., 2]
    if kind == 'laser':    # teal/cyan glowing pixels
        m = np.clip(((b - r) - 60) / 80, 0, 1) * np.clip((b - 150) / 80, 0, 1)
        m = cv2.GaussianBlur(m, (0, 0), 2)
    else:                  # the flame: warmest bright spot; a light pool around it
        warm = cv2.GaussianBlur((r - b) * 0.6 + (r + g) * 0.25, (0, 0), 25)
        warm[:, int(W * 0.75):] = 0 if move.get('flame_left') else warm[:, int(W * 0.75):]
        cy, cx = np.unravel_index(np.argmax(warm), warm.shape)
        m = np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * 260.0 ** 2))).astype(np.float32)
    n = int(secs * FPS); out = []
    for f in range(n):
        tq = (f - f % 2) / max(1, n - 1)                    # camera on twos, like the hands texture steps
        u = tq * tq * (3 - 2 * tq)
        a, tx, ty = move.get('dolly', 0.1) * u, move.get('truck', 0) * u, move.get('rise', 0) * u
        sc = 1.02 + a * (0.25 + dep)
        mx = W / 2 + (xx - W / 2) / sc - tx * dep; my = H / 2 + (yy - H / 2) / sc - ty * dep
        t = f / FPS
        if kind == 'laser':
            k = 1 + 0.35 * (0.5 + 0.5 * np.sin(t * 9)) + 0.15 * (((f // 2) * 7919 % 13) / 13)
            fr = im * (1 + (k - 1) * m[..., None])
        else:
            k = flicker(t, 1.3)
            fr = im * (1 + (k - 1) * 1.4 * m[..., None])
        fr = cv2.remap(fr, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        out.append(np.clip(fr, 0, 255).astype(np.uint8))
    return out

FONT_SERIF = '/home/claude/toolkit/toolkit/doodle/cards/fonts/fraunces-latin-400-normal.woff2'
def card(title, sub, secs):
    from PIL import Image, ImageDraw, ImageFont
    im = Image.new('RGB', (W, H), (231, 221, 198)); d = ImageDraw.Draw(im)
    try: f1 = ImageFont.truetype('/tmp/claude-0/fraunces.ttf', 92)
    except Exception: f1 = ImageFont.load_default(size=92)
    f2 = ImageFont.truetype('/home/claude/toolkit/toolkit/doodle/node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2', 26) if False else ImageFont.truetype('/home/claude/toolkit/toolkit/doodle/node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2'.replace('x','x'),36) if False else ImageFont.load_default(size=40)
    d.text((W / 2, 500), title, font=f1, fill=(38, 43, 56), anchor='mm')
    d.text((W / 2, 610), sub, font=f2, fill=(120, 116, 104), anchor='mm')
    fr = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    return [fr] * int(secs * FPS)

def kling_clip(path, secs):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-t', str(secs), '-vf', f'scale={W}:{H}:flags=lanczos,fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True)
    a = np.frombuffer(p.stdout, np.uint8); return list(a.reshape(-1, H, W, 3))

plan = [
    ('card', 'A · Detailed editorial', 'Kling Image 4.0 still · our depth camera · laser shimmer'),
    ('still', 'A_laser', {'dolly': 0.10, 'truck': 40}, 'laser'),
    ('still', 'A_study', {'dolly': 0.12, 'truck': -30}, 'candle'),
    ('card', 'B · Graphic-novel ink', 'Kling Image 4.0 still · our depth camera'),
    ('still', 'B_laser', {'dolly': 0.10, 'rise': 30}, 'laser'),
    ('still', 'B_study', {'dolly': 0.12, 'truck': 40}, 'candle'),
    ('card', 'C · Cinematic', 'Kling Image 4.0 still · our depth camera'),
    ('still', 'C_laser', {'dolly': 0.14, 'truck': -30}, 'laser'),
    ('still', 'C_study', {'dolly': 0.10, 'truck': 30}, 'candle'),
    ('card', 'C · with Kling motion', 'Kling 4.0 Flash · image to video · 5 s · 30 credits'),
    ('kling', '/mnt/user-data/uploads/Downloads/kling_20261119_VIDEO_A_slow__st_5194_0.mp4'),
]
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                       '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', 'vid.mp4'], stdin=subprocess.PIPE)
total = 0
for p in plan:
    if p[0] == 'card': frames = card(p[1], p[2], 1.8)
    elif p[0] == 'still': frames = still_shot(p[1], 5.5, p[2], p[3])
    else: frames = kling_clip(p[1], 5.0)
    for fr in frames: ff.stdin.write(fr.tobytes())
    total += len(frames); print(p[1], len(frames), flush=True)
ff.stdin.close(); ff.wait(); print('total', total / FPS)
