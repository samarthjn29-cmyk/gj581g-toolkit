"""Typeset a verbatim quote or a paper's title card as a clean image, for papers whose licence doesn't allow showing
the page itself (no open licence, or CC BY-NC / ND on a monetised channel). Check the licence first (PubMed's
get_copyright_status for biomedical papers; the article page otherwise): CC BY / CC0 papers can use snip.py page crops.

  typeset.py quote <snips_dir> <key> "verbatim words" [--pre "… "] [--post " …"] [--width 1620] [--hl E07A5F]
      -> <key>.png (highlighted) and <key>_plain.png, same height, for deck/head.js snipPanel(); add [w, h] to
         deck_config.json "snip_px" (printed below)
  typeset.py title <snips_dir> <key> "Paper title" "Author One, Author Two and Author Three" [--width 1680]
      -> <key>.png and <key>.json for evidenceCard() / the paper-profile title card

The words must be copied character for character from the paper (two independent reads, as for any snippet); the slide
still carries the credit line. Serif face: Bitstream Charter (falls back to DejaVu Serif)."""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

FONTS = {'reg': ['/usr/share/fonts/X11/Type1/c0648bt_.pfb', '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'],
         'bold': ['/usr/share/fonts/type1/texlive-fonts-recommended/bchb8a.pfb', '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'],
         'it': ['/usr/share/fonts/X11/Type1/c0649bt_.pfb', '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf']}

def font(kind, size):
    for p in FONTS[kind]:
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def opt(a, k, d):
    return a[a.index(k) + 1] if k in a else d

def quote(d, key, q, pre='', post='', W=1620, hl='E07A5F'):
    f, fi = font('reg', 58), font('it', 58)
    parts = [(pre, fi), (q, f), (post, fi)]
    widths = [ff.getlength(t) for t, ff in parts]
    total = sum(widths)
    while total > W - 20:                       # shrink long quotes to fit one line
        f, fi = font('reg', f.size - 2), font('it', fi.size - 2)
        parts = [(pre, fi), (q, f), (post, fi)]; widths = [ff.getlength(t) for t, ff in parts]; total = sum(widths)
    H, x0 = 104, (W - total) / 2
    col = tuple(int(hl[i:i + 2], 16) for i in (0, 2, 4)) + (95,)
    for with_hl in (False, True):
        im = Image.new('RGBA', (W, H), (255, 255, 255, 255)); ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        do = ImageDraw.Draw(ov); x = x0
        for (t, ff), w in zip(parts, widths):
            if with_hl and ff is f and t.strip(): do.rectangle([x - 4, 18, x + w + 4, H - 14], fill=col)
            x += w
        im = Image.alpha_composite(im, ov); dr = ImageDraw.Draw(im); x = x0
        for (t, ff), w in zip(parts, widths):
            dr.text((x, 22), t, font=ff, fill=(30, 30, 30) if ff is f else (110, 110, 110)); x += w
        im.convert('RGB').save(os.path.join(d, f'{key}{"" if with_hl else "_plain"}.png'))
    print(f'{key}.png + {key}_plain.png  snip_px: [{W}, {H}]')

def title(d, key, t, authors, W=1680):
    fb, fr = font('bold', 54), font('reg', 34)
    lines, cur = [], ''
    for w in t.split():
        if fb.getlength((cur + ' ' + w).strip()) > W - 80: lines.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    lines.append(cur)
    H = 40 + len(lines) * 66 + 24 + 44 + 30
    im = Image.new('RGB', (W, H), 'white'); dr = ImageDraw.Draw(im); y = 36
    for ln in lines: dr.text((40, y), ln, font=fb, fill=(20, 20, 20)); y += 66
    dr.text((40, y + 22), authors, font=fr, fill=(70, 70, 70))
    im.save(os.path.join(d, f'{key}.png'))
    json.dump({'size': [W, H], 'hl': [0, 0, 1, 1], 'typeset': True}, open(os.path.join(d, f'{key}.json'), 'w'))
    print(f'{key}.png  size: [{W}, {H}]')

if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 4: sys.exit(__doc__)
    if a[0] == 'quote':
        quote(a[1], a[2], a[3], opt(a, '--pre', ''), opt(a, '--post', ''), int(opt(a, '--width', 1620)), opt(a, '--hl', 'E07A5F'))
    elif a[0] == 'title' and len(a) >= 5:
        title(a[1], a[2], a[3], a[4], int(opt(a, '--width', 1680)))
    else: sys.exit(__doc__)
