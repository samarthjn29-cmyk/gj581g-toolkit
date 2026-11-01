"""Crop a verbatim passage from a PDF page as a PNG, with a semi-transparent highlight over it (one box per line).
Usage: HL=<Callout hex> snip.py paper.pdf <page> "exact text" out.png      (NOHL=1 for the plain copy)
Lines other than the matched ones are whitened so neighbours do not bleed into the crop. Check the crop word for word.
CONTEXT=<points>: evidence-card mode. Keeps the page as it is (no whitening) and widens the crop by that many points
above and below (e.g. CONTEXT=60 shows a chart's headline above the highlighted row, or a paper's authors under its
title). Always writes out.json beside the PNG: {"size": [w, h], "hl": [x0, y0, x1, y1]} (highlight box as fractions
of the crop), which deck/head.js evidenceCard() uses to point its arrow."""
import sys, subprocess, re
from xml.etree import ElementTree as ET
from PIL import Image, ImageDraw
import os
pdf, page, text, out = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
xml = subprocess.run(['pdftotext', '-bbox', '-f', str(page), '-l', str(page), pdf, '-'], capture_output=True, text=True).stdout
xml = re.sub(r'<!DOCTYPE[^>]*>', '', xml)
import html as _h
words = [(_h.unescape(m.group(5)), float(m.group(1)), float(m.group(2)), float(m.group(3)), float(m.group(4))) for m in re.finditer(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', xml)]
norm = lambda s: re.sub(r'[^\w%]', '', s.lower())
target = [norm(t) for t in text.replace('-', ' - ').split() if norm(t)]
toks = [(norm(w[0]), w) for w in words]
seq = [t for t in toks if t[0]]
def match():
    for i in range(len(seq)):
        j, k, buf = i, 0, ''
        hit = []
        w0 = seq[i][1]
        if seq[i][0] != target[0] and seq[i][0].endswith(target[0]) and len(target[0]) > 3:
            raw = w0[0]; pos = raw.lower().rfind(target[0][:4])
            frac = (pos + 0.6) / max(1, len(raw))
            trimmed = (raw[pos:], w0[1] + (w0[3] - w0[1]) * frac, w0[2], w0[3], w0[4])
            hit = [trimmed]; j = i + 1
            if norm(trimmed[0]) == ''.join(target): return hit
        elif not target[0].startswith(seq[i][0]) and seq[i][0] != target[0]:
            continue
        while j < len(seq) and k < len(target):
            buf += seq[j][0]; hit.append(seq[j][1])
            tgt = ''.join(target[k: k + 1])
            # allow hyphenated line breaks: concatenate tokens until equal
            joined = ''.join(target)
            if not joined.startswith(''.join(norm(h[0]) for h in hit)): break
            if ''.join(norm(h[0]) for h in hit) == joined: return hit
            j += 1
    return None
hit = match()
if not hit: sys.exit('text not found on page')
dpi = 300; sc = dpi / 72
subprocess.run(['pdftoppm', '-png', '-r', str(dpi), '-f', str(page), '-l', str(page), '-singlefile', pdf, 'page_tmp'], check=True)
im = Image.open('page_tmp.png').convert('RGB')
# lines touched by the hit (group by baseline)
lines = {}
for w in words:
    for h in hit:
        if abs(w[4] - h[4]) < 2.5: lines.setdefault(round(h[4], 0), []).append(w); break
lw = [w for ws in lines.values() for w in ws]
x0 = min(w[1] for w in lw); x1 = max(w[3] for w in lw)
y0 = min(w[2] for w in lw); y1 = max(w[4] for w in lw)
pad = 8
# whiten everything except the matched lines
mask = Image.new('L', im.size, 255); md = ImageDraw.Draw(mask)
for ws in lines.values():
    md.rectangle([min(w[1] for w in ws) * sc - 4, min(w[2] for w in ws) * sc - 3, max(w[3] for w in ws) * sc + 4, max(w[4] for w in ws) * sc + 4], fill=0)
CTX = float(os.environ.get('CONTEXT', 0))
if not CTX: im = Image.composite(Image.new('RGB', im.size, 'white'), im, mask)
else:   # widen to the full width of every text line inside the context band
    band = [w for w in words if w[4] >= y0 - CTX and w[2] <= y1 + CTX and not (len(w[0]) > 2 and w[4] - w[2] > w[3] - w[1])]    # whole lines touching the band; skip vertical sidebar text
    x0 = min([x0] + [w[1] for w in band]); x1 = max([x1] + [w[3] for w in band])
    y0 = min([y0] + [w[2] for w in band]); y1 = max([y1] + [w[4] for w in band])
ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
byline = {}
for h in hit: byline.setdefault(round(h[4], 0), []).append(h)
for hs in byline.values():
    d.rectangle([min(h[1] for h in hs) * sc - 3, min(h[2] for h in hs) * sc - 2, max(h[3] for h in hs) * sc + 3, max(h[4] for h in hs) * sc + 3], fill=tuple(int(os.environ.get('HL', 'D98E04')[i:i+2], 16) for i in (0, 2, 4)) + (85,))
import os
if not os.environ.get('NOHL'): im = Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB')
crop = im.crop((int((x0 - pad) * sc), int((y0 - pad) * sc), int((x1 + pad) * sc), int((y1 + pad) * sc)))
crop.save(out); print(out, crop.size, len(hit), 'words')
cx, cy = (x0 - pad) * sc, (y0 - pad) * sc; cw, ch = crop.size
hx0 = min(h[1] for h in hit) * sc; hx1 = max(h[3] for h in hit) * sc; hy0 = min(h[2] for h in hit) * sc; hy1 = max(h[4] for h in hit) * sc
import json
json.dump({'size': [cw, ch], 'hl': [round((hx0 - cx) / cw, 4), round((hy0 - cy) / ch, 4), round((hx1 - cx) / cw, 4), round((hy1 - cy) / ch, 4)]}, open(os.path.splitext(out)[0] + '.json', 'w'))
