"""Build the review sheets the user approves before the full render: one frame per scene (from review.mjs) with the slide
number, time, layout and the narration line under it, 3 scenes per row, 12 per sheet.
Usage: review_sheet.py src/data/slides.json stills_dir out_prefix   -> <out_prefix>_1.png, _2.png ..."""
import sys, json, re, os, textwrap
from PIL import Image, ImageDraw, ImageFont
S = json.load(open(sys.argv[1])); D = sys.argv[2]; pre = sys.argv[3]
def font(sz, bold=False):
    for p in ([f'public/fonts/Inter-{"Bold" if bold else "Regular"}.otf'] + ['/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else '')]):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
F1, F2 = font(22, True), font(18)
W, TH, PAD = 640, 360, 18; TXT = 150; per_row, per_sheet = 3, 12
plain = lambda d: re.sub(r'\s+([.,?!;:])', r'\1', re.sub(r'\s+', ' ', re.sub(r'\[[^\]]*\]|\{viewer:|\}|\*', ' ', ' '.join(d['vo_marked'])))).strip()
pages = [S[i:i + per_sheet] for i in range(0, len(S), per_sheet)]
for k, page in enumerate(pages, 1):
    rows = (len(page) + per_row - 1) // per_row
    sheet = Image.new('RGB', (per_row * (W + PAD) + PAD, rows * (TH + TXT + PAD) + PAD), '#F4F1F8'); dr = ImageDraw.Draw(sheet)
    for i, d in enumerate(page):
        x = PAD + (i % per_row) * (W + PAD); y = PAD + (i // per_row) * (TH + TXT + PAD)
        p = f"{D}/scene_{d['n']:02d}.png"
        if os.path.exists(p): sheet.paste(Image.open(p).convert('RGB').resize((W, TH)), (x, y))
        m, s = divmod(int(d['start']), 60)
        dr.text((x, y + TH + 6), f"{d['n']:02d}  {m}:{s:02d}  {d['layout']}", fill='#2B1B3F', font=F1)
        dr.multiline_text((x, y + TH + 36), '\n'.join(textwrap.wrap(plain(d), 62)[:4]), fill='#4B3A66', font=F2, spacing=3)
    out = f'{pre}_{k}.png'; sheet.save(out, optimize=True); print('wrote', out)
