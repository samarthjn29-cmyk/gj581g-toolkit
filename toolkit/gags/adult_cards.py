#!/usr/bin/env python3
"""GJ 581g picture-gag cards + gag-reel builder (12 Nov 2026).
Picture versions (styles/ADULT_GAGS_TOOLKIT.md): mosaic blur, censor bar, viewer-advisory label (our own design, not the
record-label sticker), deadpan caption, hard cut-away, split comparison, colour grade.
Usage:  adult_cards.py REEL.json OUT.mp4 [--size 1280x720] [--fps 30]
REEL.json: {"title": "...", "gags": [{"id", "line", "narration", "spice", "kind", "img", "dur", "hit",
            "ops": [{"op": "mosaic"|"censor"|"advisory"|"caption"|"cut"|"split"|"grade", ...}],
            "sfx": [{"name", "t", "lufs"}]}]}
Times are seconds from the start of the gag; ops with "at" appear at that time (default: the gag's hit)."""
import json, os, sys, subprocess, argparse, tempfile, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sfx_synth

FONT = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
FONT_R = '/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf'
FONT_I = '/usr/share/fonts/opentype/inter/InterDisplay-MediumItalic.otf'
def F(path, px): return ImageFont.truetype(path, int(px))

def cover(img, W, H, zoom=1.0, cx=0.5, cy=0.5):
    iw, ih = img.size; s = max(W / iw, H / ih) * zoom
    w, h = W / s, H / s; x0 = min(max(cx * iw - w / 2, 0), iw - w); y0 = min(max(cy * ih - h / 2, 0), ih - h)
    return img.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + w, y0 + h))

def box_px(b, W, H): return tuple(int(v) for v in (b[0] * W, b[1] * H, b[2] * W, b[3] * H))

def mosaic(fr, b, block=0.03):
    x0, y0, x1, y1 = box_px(b, *fr.size); reg = fr.crop((x0, y0, x1, y1)); k = max(4, int(fr.size[0] * block))
    small = reg.resize((max(1, (x1 - x0) // k), max(1, (y1 - y0) // k)), Image.BILINEAR)
    fr.paste(small.resize(reg.size, Image.NEAREST), (x0, y0))

def text_center(d, xy, txt, font, fill):
    l, t, r, b = d.textbbox((0, 0), txt, font=font); d.text((xy[0] - (r - l) / 2 - l, xy[1] - (b - t) / 2 - t), txt, font=font, fill=fill)

def censor(fr, b, label=''):
    W, H = fr.size; x0, y0, x1, y1 = box_px(b, W, H); d = ImageDraw.Draw(fr)
    d.rectangle((x0, y0, x1, y1), fill='black')
    if label: text_center(d, ((x0 + x1) / 2, (y0 + y1) / 2), label, F(FONT, (y1 - y0) * 0.42), 'white')

def advisory(fr, top, main, pos=(0.73, 0.74), w=0.4):
    """Our own warning-label look: hazard stripes, a small kicker and a big main line."""
    W, H = fr.size; bw = int(W * w); bh = int(bw * 0.42); cx, cy = int(pos[0] * W), int(pos[1] * H)
    x0, y0 = cx - bw // 2, cy - bh // 2; lab = Image.new('RGBA', (bw, bh), (0, 0, 0, 0)); d = ImageDraw.Draw(lab)
    d.rectangle((0, 0, bw, bh), fill=(250, 204, 21))
    st = bh // 6
    for i in range(-bh, bw + bh, st * 2): d.polygon([(i, 0), (i + st, 0), (i + st - bh, bh), (i - bh, bh)], fill=(20, 20, 20))
    m = int(bh * 0.11); d.rectangle((m, m, bw - m, bh - m), fill=(12, 12, 12))
    text_center(d, (bw / 2, bh * 0.33), top, F(FONT, bh * 0.13), (250, 204, 21))
    size = bh * 0.27
    while d.textlength(main, font=F(FONT, size)) > bw - 4 * m: size *= 0.92
    text_center(d, (bw / 2, bh * 0.62), main, F(FONT, size), 'white')
    lab = lab.rotate(-4, expand=True, resample=Image.BICUBIC)
    fr.paste(lab, (x0 - (lab.size[0] - bw) // 2, y0 - (lab.size[1] - bh) // 2), lab)

def caption(fr, txt, y=0.70, size=0.045, sub=None):
    """Deadpan documentary caption: white on a solid black bar, left aligned."""
    W, H = fr.size; f = F(FONT, H * size); d = ImageDraw.Draw(fr)
    lines = [txt] + ([sub] if sub else []); fonts = [f] + ([F(FONT_I, H * size * 0.72)] if sub else [])
    pad = int(H * 0.022); widths = [d.textlength(l, font=ff) for l, ff in zip(lines, fonts)]
    hs = [ff.getbbox('Ag')[3] for ff in fonts]; bh = sum(hs) + pad * (len(lines) + 1)
    x0 = int(W * 0.06); y0 = int(H * y)
    d.rectangle((x0, y0, x0 + max(widths) + 2 * pad, y0 + bh), fill=(0, 0, 0))
    yy = y0 + pad
    for l, ff, hh in zip(lines, fonts, hs): d.text((x0 + pad, yy), l, font=ff, fill='white'); yy += hh + pad

def split(W, H, a, b, la, lb, scale_b=1.0):
    """Two pictures side by side with labels; scale_b < 1 shrinks the left one to show a size gap."""
    fr = Image.new('RGB', (W, H), (14, 14, 14)); d = ImageDraw.Draw(fr)
    lw = int(W * 0.5 * scale_b); left = cover(a, lw, int(H * 0.62 * scale_b) or 1)
    fr.paste(left, (int(W * 0.25 - lw / 2), int(H * 0.5 - left.size[1] / 2)))
    right = cover(b, int(W * 0.5), H); fr.paste(right, (W // 2, 0))
    f = F(FONT, H * 0.05)
    for txt, x in ((la, W * 0.25), (lb, W * 0.75)):
        tw = d.textlength(txt, font=f); d.rectangle((x - tw / 2 - 14, H * 0.84, x + tw / 2 + 14, H * 0.84 + H * 0.075), fill='black')
        text_center(d, (x, H * 0.84 + H * 0.0375), txt, f, 'white')
    return fr

def grade(fr, rgb, amt):
    tint = Image.new('RGB', fr.size, tuple(rgb)); return Image.blend(fr, tint, amt)

def narration_sub(fr, txt):
    W, H = fr.size; d = ImageDraw.Draw(fr); f = F(FONT_I, H * 0.028)
    words, lines, cur = txt.split(), [], ''
    for w in words:
        if d.textlength(cur + ' ' + w, font=f) > W * 0.84: lines.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    lines.append(cur); lh = f.getbbox('Ag')[3] + 6; y = H - 22 - lh * len(lines)
    d.rectangle((0, y - 10, W, H), fill=(0, 0, 0))
    for l in lines: text_center(d, (W / 2, y + lh / 2), l, f, (200, 200, 200)); y += lh

def slate(W, H, g, n, total):
    fr = Image.new('RGB', (W, H), (10, 10, 10)); d = ImageDraw.Draw(fr)
    text_center(d, (W / 2, H * 0.36), f"GAG {n} OF {total}", F(FONT, H * 0.06), 'white')
    text_center(d, (W / 2, H * 0.47), f"line {g['line']}  ·  spice {g['spice']}  ·  {g['kind']}", F(FONT_R, H * 0.035), (250, 204, 21))
    text_center(d, (W / 2, H * 0.60), 'Narration: "' + (g['narration'][:90] + ('…' if len(g['narration']) > 90 else '')) + '"', F(FONT_I, H * 0.026), (170, 170, 170))
    return fr

def render_gag(g, W, H, t, imgs):
    zoom = 1.0 + 0.06 * t / g['dur']                         # slow push on every shot
    base = imgs[g['img']]; fr = cover(base, W, H, zoom, *g.get('focus', (0.5, 0.5)))
    for op in g.get('ops', []):
        at = op.get('at', g['hit'])
        if op['op'] == 'grade': fr = grade(fr, op['rgb'], op['amt']); continue
        if t < at: continue
        k = op['op']
        if k == 'cut': fr = cover(imgs[op['img']], W, H, 1.0 + 0.04 * (t - at) / max(0.1, g['dur'] - at), *op.get('focus', (0.5, 0.5)))
        elif k == 'split': fr = split(W, H, imgs[op['a']], imgs[op['b']], op['la'], op['lb'], op.get('scale', 0.45))
        elif k == 'mosaic': mosaic(fr, op['box'])
        elif k == 'censor': censor(fr, op['box'], op.get('label', ''))
        elif k == 'advisory': advisory(fr, op['top'], op['main'], tuple(op.get('pos', (0.73, 0.74))))
        elif k == 'caption': caption(fr, op['text'], op.get('y', 0.70), sub=op.get('sub'))
    narration_sub(fr, g['narration']); return fr

def lufs_of(x):
    tmp = tempfile.mktemp(suffix='.wav'); sfx_synth.write(tmp, x)
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    os.remove(tmp); vals = [l.split('I:')[1].split('LUFS')[0] for l in out.splitlines() if l.strip().startswith('I:')]
    return float(vals[-1]) if vals else -20.0

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('out')
    ap.add_argument('--size', default='1280x720'); ap.add_argument('--fps', type=int, default=30); a = ap.parse_args()
    R = json.load(open(a.reel)); W, H = map(int, a.size.split('x')); fps = a.fps; base = os.path.dirname(os.path.abspath(a.reel))
    imgs = {}
    for g in R['gags']:
        for key in [g['img']] + [op.get(k) for op in g.get('ops', []) for k in ('img', 'a', 'b') if op.get(k)]:
            if key not in imgs: imgs[key] = Image.open(os.path.join(base, key)).convert('RGB')
    SLATE = 1.6; tl, audio_events = [], []; t0 = 0.0; n = len(R['gags'])
    for i, g in enumerate(R['gags'], 1):
        tl.append(('slate', g, i, t0, SLATE)); t0 += SLATE
        tl.append(('gag', g, i, t0, g['dur']))
        for s in g.get('sfx', []): audio_events.append((t0 + s['t'], s['name'], s.get('lufs', -20), s.get('dur')))
        t0 += g['dur']
    total = t0; tmp = tempfile.mkdtemp()
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', f'{tmp}/v.mp4'], stdin=subprocess.PIPE)
    for kind, g, i, start, dur in tl:
        cache = slate(W, H, g, i, n) if kind == 'slate' else None
        for f in range(int(round(dur * fps))):
            fr = cache if cache else render_gag(g, W, H, f / fps, imgs)
            p.stdin.write(fr.tobytes())
    p.stdin.close(); p.wait()
    mix = np.zeros(int(total * sfx_synth.SR) + sfx_synth.SR)
    for at, name, target, dur in audio_events:
        x = sfx_synth.make(name, dur); x = sfx_synth.norm(x); x *= 10 ** ((target - lufs_of(x)) / 20)
        s = int(at * sfx_synth.SR); mix[s:s + len(x)] += x[:len(mix) - s]
    peak = np.max(np.abs(mix)); mix = mix * (0.89 / peak) if peak > 0.89 else mix
    with wave.open(f'{tmp}/a.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sfx_synth.SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{tmp}/v.mp4', '-i', f'{tmp}/a.wav', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                    '-ac', '2', '-shortest', a.out], check=True)
    print(f'{a.out}: {total:.1f} s, {n} gags')

if __name__ == '__main__': main()
