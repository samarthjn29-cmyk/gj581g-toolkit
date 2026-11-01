"""Original flat illustration of the 1999 gorilla experiment (not the study video). 1600x800, 30 fps, silent."""
import subprocess, math, sys
from PIL import Image, ImageDraw, ImageFont
OUT, DUR = sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 25.0
W, H, FPS, SS = 1600, 800, 30, 2          # SS: supersampling for smooth edges
PLUM, SLATE, PANEL, RULE, VIOLET, CORAL, WHITE = (43, 27, 63), (110, 102, 128), (244, 241, 248), (220, 214, 229), (122, 79, 181), (224, 122, 95), (255, 255, 255)
DARK = (28, 22, 36)
FB = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
FR = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
font = lambda p, s: ImageFont.truetype(p, s * SS)
T_PASS, T_G_IN, T_G_MID, T_G_OUT, T_Q = 7.0, 11.2, 13.2, 18.0, 15.0
CAPS = [(0, 'The 1999 experiment, drawn as a diagram'), (T_PASS, '1   Count passes by the team in white'),
        (T_G_IN, '2   A person in a gorilla suit walks through'), (T_Q, '3   Asked: did you notice anything unusual?')]

def player_pos(i, t):
    cx, cy = W / 2, 330
    ax, ay = 520 - (i % 3) * 60, 150 - (i % 2) * 30
    ph = i * 1.05
    return cx + ax * math.sin(0.35 * t + ph), cy + ay * math.sin(0.5 * t + ph * 1.7)

def draw_player(d, x, y, white):
    s = SS; fill = WHITE if white else DARK
    d.ellipse([(x - 22) * s, (y - 95) * s, (x + 22) * s, (y - 51) * s], fill=(205, 170, 140), outline=PLUM, width=3 * s)
    d.rounded_rectangle([(x - 34) * s, (y - 50) * s, (x + 34) * s, (y + 30) * s], radius=14 * s, fill=fill, outline=PLUM, width=3 * s)
    d.rectangle([(x - 26) * s, (y + 30) * s, (x - 8) * s, (y + 80) * s], fill=PLUM)
    d.rectangle([(x + 8) * s, (y + 30) * s, (x + 26) * s, (y + 80) * s], fill=PLUM)

def draw_gorilla(d, x, y, t):
    s = SS; g = (40, 34, 38)
    thump = T_G_MID <= t <= T_G_MID + 2.0
    d.ellipse([(x - 70) * s, (y - 80) * s, (x + 70) * s, (y + 60) * s], fill=g)                       # torso
    d.ellipse([(x - 34) * s, (y - 140) * s, (x + 34) * s, (y - 72) * s], fill=g)                      # head
    d.ellipse([(x - 20) * s, (y - 118) * s, (x + 20) * s, (y - 88) * s], fill=(90, 80, 84))            # face
    sw = math.sin(t * 9) if thump else math.sin(t * 5) * 0.4
    for side in (-1, 1):
        if thump:
            hx, hy = x + side * 22, y - 40 + sw * 12                                                     # fists to chest
        else:
            hx, hy = x + side * 95, y + 60 + side * sw * 25
        d.line([(x + side * 55) * s, (y - 50) * s, hx * s, hy * s], fill=g, width=34 * s)
        d.ellipse([(hx - 20) * s, (hy - 20) * s, (hx + 20) * s, (hy + 20) * s], fill=g)
    step = math.sin(t * 6) * 18 if not thump else 0
    for side, off in ((-1, step), (1, -step)):
        d.line([(x + side * 35) * s, (y + 40) * s, (x + side * 40 + off) * s, (y + 120) * s], fill=g, width=36 * s)

def gorilla_x(t):
    if t < T_G_IN or t > T_G_OUT: return None
    if t < T_G_MID: return W + 120 - (W + 120 - W / 2) * (t - T_G_IN) / (T_G_MID - T_G_IN)
    if t < T_G_MID + 2.0: return W / 2
    return W / 2 - (W / 2 + 160) * (t - T_G_MID - 2.0) / (T_G_OUT - T_G_MID - 2.0)

WHITE_IDS = [0, 2, 4]
enc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-an', OUT], stdin=subprocess.PIPE)
for k in range(int(DUR * FPS)):
    t = k / FPS
    im = Image.new('RGB', (W * SS, H * SS), PANEL); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W * SS, 40 * SS], fill=PANEL)
    pos = {i: player_pos(i, t) for i in range(6)}
    gx = gorilla_x(t)
    order = sorted(range(6), key=lambda i: pos[i][1])
    for i in order:
        draw_player(d, *pos[i], i in WHITE_IDS)
    # ball passed among the white team
    passes = 0
    if t >= T_PASS:
        pidx, frac = divmod((t - T_PASS) / 1.6, 1)
        passes = int(pidx)
        a, b = WHITE_IDS[passes % 3], WHITE_IDS[(passes + 1) % 3]
        f = min(1, frac / 0.45)
        (x0, y0), (x1, y1) = pos[a], pos[b]
        bx, by = x0 + (x1 - x0) * f, y0 - 10 + (y1 - y0) * f - 120 * math.sin(math.pi * f)
        d.ellipse([(bx - 16) * SS, (by - 16) * SS, (bx + 16) * SS, (by + 16) * SS], fill=CORAL, outline=PLUM, width=2 * SS)
        d.text((40 * SS, 30 * SS), f'Passes by the team in white: {passes}', font=font(FB, 34), fill=PLUM)
    if gx is not None:
        draw_gorilla(d, gx, 360, t)
    # caption band
    cap = [c for tt, c in CAPS if t >= tt][-1]
    d.rectangle([0, (H - 110) * SS, W * SS, H * SS], fill=PLUM)
    d.text((40 * SS, (H - 82) * SS), cap, font=font(FB, 44), fill=WHITE)
    d.text(((W - 520) * SS, (H - 150) * SS), 'Original illustration, not the study video', font=font(FR, 24), fill=SLATE)
    enc.stdin.write(im.resize((W, H), Image.LANCZOS).tobytes())
enc.stdin.close(); enc.wait(); print('ok', OUT)
