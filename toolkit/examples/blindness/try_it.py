"""'Try it yourself' inattentional blindness test clip (original animation, after the Most et al. 2001 paradigm).
Renders 1920x1080 30fps frames with PIL, pipes to ffmpeg, mixes narration clips at fixed times."""
import subprocess, random, math, os, sys
from PIL import Image, ImageDraw, ImageFont

OUT = sys.argv[1]
VO = os.environ.get('VO_DIR', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vo'))   # VO-01..04 opener cue clips (synth.py)
W, H, FPS = 1920, 1080, 30
PLUM, SLATE, PANEL, RULE, VIOLET, CORAL, WHITE = (43, 27, 63), (110, 102, 128), (244, 241, 248), (220, 214, 229), (122, 79, 181), (224, 122, 95), (255, 255, 255)
RED = (215, 38, 61)
FB = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
FR = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
f = lambda p, s: ImageFont.truetype(p, s)

# timeline (seconds)
A0, B0, C0, D0, E0, END = 0.0, 9.0, 25.0, 30.5, 37.5, 47.0
CROSS_T0, CROSS_T1 = 14.0, 19.0
VO_AT = {1: 0.3, 2: 25.2, 3: 30.7, 4: 37.7}

# arena and movers
AX, AY, AW, AH, SQ = 260, 170, 1400, 740, 56
random.seed(7)
movers = []
for i in range(8):
    ang = random.uniform(0, 2 * math.pi)
    sp = random.uniform(180, 230)
    movers.append(dict(x=random.uniform(AX + 80, AX + AW - 80 - SQ), y=random.uniform(AY + 80, AY + AH - 80 - SQ),
                       vx=sp * math.cos(ang), vy=sp * math.sin(ang), white=i < 4))
bounces = 0
def step(dt):
    global bounces
    for m in movers:
        m['x'] += m['vx'] * dt; m['y'] += m['vy'] * dt
        hit = False
        if m['x'] < AX: m['x'] = AX; m['vx'] *= -1; hit = True
        if m['x'] > AX + AW - SQ: m['x'] = AX + AW - SQ; m['vx'] *= -1; hit = True
        if m['y'] < AY: m['y'] = AY; m['vy'] *= -1; hit = True
        if m['y'] > AY + AH - SQ: m['y'] = AY + AH - SQ; m['vy'] *= -1; hit = True
        if hit and m['white']: bounces += 1

def cross_x(t):
    p = (t - CROSS_T0) / (CROSS_T1 - CROSS_T0)
    return AX + AW + 60 - p * (AW + 120)

def draw_cross(d, cx, cy, s=74, w=20, col=RED):
    d.rectangle([cx - s / 2, cy - w / 2, cx + s / 2, cy + w / 2], fill=col)
    d.rectangle([cx - w / 2, cy - s / 2, cx + w / 2, cy + s / 2], fill=col)

def arena(d, t, show_cross=True, labels=True):
    d.rectangle([0, 0, W, H], fill=PLUM)
    d.rectangle([AX - 4, AY - 4, AX + AW + 4, AY + AH + 4], fill=RULE)
    d.rectangle([AX, AY, AX + AW, AY + AH], fill=(150, 145, 160))
    for m in movers:
        d.rectangle([m['x'], m['y'], m['x'] + SQ, m['y'] + SQ], fill=WHITE if m['white'] else (20, 16, 28))
    cx, cy = AX + AW / 2, AY + AH / 2
    d.rectangle([cx - 9, cy - 9, cx + 9, cy + 9], fill=VIOLET)
    if show_cross and CROSS_T0 <= t <= CROSS_T1:
        draw_cross(d, cross_x(t), cy)
    if labels:
        d.text((AX, 70), 'Count the bounces of the WHITE squares', font=f(FB, 46), fill=WHITE)
        d.text((AX, AY + AH + 40), 'Decked out Data  |  original demo after Most et al. (2001)', font=f(FR, 26), fill=RULE)

def card(d, lines, foot=None):
    d.rectangle([0, 0, W, H], fill=PLUM)
    y = 300
    for txt, font, col in lines:
        d.text((180, y), txt, font=font, fill=col); y += font.size + 40
    if foot: d.text((180, H - 120), foot, font=f(FR, 28), fill=RULE)

frames = int(END * FPS)
enc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', OUT + '.video.mp4'], stdin=subprocess.PIPE)
final_bounces = None
last_test_frame = None
for k in range(frames):
    t = k / FPS
    im = Image.new('RGB', (W, H)); d = ImageDraw.Draw(im)
    if t < B0:
        lines = [('Try it yourself', f(FB, 96), WHITE), ('Count how many times the WHITE squares', f(FB, 56), RULE),
                 ('bounce off the walls. Ignore the black ones.', f(FB, 56), RULE)]
        card(d, lines)
        if t >= B0 - 3:
            n = 3 - int(t - (B0 - 3))
            d.text((W - 360, 380), str(n), font=f(FB, 260), fill=CORAL)
    elif t < C0:
        step(1 / FPS) if t > B0 else None
        arena(d, t)
        last_test_frame = t
    elif t < D0:
        if final_bounces is None: final_bounces = bounces
        lines = [('How many bounces did you count?', f(FB, 80), WHITE)]
        if t >= C0 + 3.3:
            lines.append((f'The white squares bounced {final_bounces} times.', f(FB, 60), CORAL))
        card(d, lines)
    elif t < E0:
        # frozen arena with the cross's path revealed
        arena(d, CROSS_T0 - 1, show_cross=False, labels=False)
        cy = AY + AH / 2
        x = AX + AW
        while x > AX:
            d.line([x, cy, x - 30, cy], fill=CORAL, width=6); x -= 55
        draw_cross(d, AX + AW / 2 + 220, cy)
        d.text((AX + AW / 2 + 160, cy - 120), 'The red cross', font=f(FB, 48), fill=WHITE, stroke_width=3, stroke_fill=PLUM)
        d.text((AX, 70), 'Did you see the red cross?', font=f(FB, 46), fill=CORAL)
        d.text((AX, AY + AH + 40), 'It crossed the middle of the screen for five seconds.', font=f(FR, 30), fill=RULE)
    else:
        lines = [('~30%', f(FB, 200), VIOLET), ('failed to see a bright red cross crossing the screen', f(FB, 52), WHITE),
                 ('for five seconds, the only coloured item on screen.', f(FB, 52), WHITE)]
        card(d, lines, foot='Source: Most et al. (2001), as described in Simons, "Failures of Awareness", Noba Project. This clip is an original recreation.')
    enc.stdin.write(im.tobytes())
enc.stdin.close(); enc.wait()

# narration mix
ins, filt = [], []
for i, (n, at) in enumerate(sorted(VO_AT.items())):
    ins += ['-i', f'{VO}/VO-{n:02d}.mp3']
    filt.append(f'[{i + 1}:a]adelay={int(at * 1000)}|{int(at * 1000)}[a{i}]')
mix = ''.join(f'[a{i}]' for i in range(len(VO_AT))) + f'amix=inputs={len(VO_AT)}:normalize=0,apad[aout]'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', OUT + '.video.mp4', *ins, '-filter_complex', ';'.join(filt) + ';' + mix,
                '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', OUT], check=True)
os.remove(OUT + '.video.mp4')
print('white bounces:', final_bounces)
