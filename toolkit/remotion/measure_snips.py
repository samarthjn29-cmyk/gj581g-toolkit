"""Write src/data/snips.json for PaperSheet: size of every snip and title card in public/snips/, and the highlighter
rectangles per line, measured by comparing the highlighted crop (<key>.png in the project's snips folder) with the plain
one (<key>_plain.png). Rectangles are [x0, y0, x1, y1] as fractions of the image, top to bottom (the sweep order).
Usage: measure_snips.py public/snips <project snips dir> src/data/snips.json      (run by run.py assets)"""
import sys, os, json, glob
import numpy as np
from PIL import Image
pub, src, out = sys.argv[1:4]
D = {}
OLD = json.load(open(out)) if os.path.exists(out) else {}
for p in sorted(glob.glob(f'{pub}/*_plain.png') + glob.glob(f'{pub}/t_*.png')):
    b = os.path.basename(p); key = b[:-10] if b.endswith('_plain.png') else b[:-4]
    im = Image.open(p).convert('RGB'); w, h = im.size; e = dict(w=w, h=h)
    hl = os.path.join(src, key + '.png')
    if b.endswith('_plain.png') and os.path.exists(hl):
        a = np.asarray(im, np.int16); c = np.asarray(Image.open(hl).convert('RGB').resize((w, h)), np.int16)
        m = np.abs(a - c).sum(2) > 40
        gap = max(8, int(w * 0.02)); open_r, done = [], []
        for y in range(h):
            xs = np.where(m[y])[0]; runs = []
            if len(xs) > max(3, w * 0.004):
                st = xs[0]; pv = xs[0]
                for x in xs[1:]:
                    if x - pv > gap: runs.append([st, pv]); st = x
                    pv = x
                runs.append([st, pv]); runs = [r for r in runs if r[1] - r[0] > w * 0.01]
            nxt = []
            for r in runs:
                hit = next((o for o in open_r if not (r[1] < o[0] - gap or r[0] > o[2] + gap)), None)
                if hit: hit[0] = min(hit[0], r[0]); hit[2] = max(hit[2], r[1]); hit[3] = y; nxt.append(hit)
                else: o = [r[0], y, r[1], y]; nxt.append(o)
            done += [o for o in open_r if o not in nxt]; open_r = list({id(o): o for o in nxt}.values())
        done += open_r
        rects = [[round(o[0] / w, 4), round(o[1] / h, 4), round((o[2] + 1) / w, 4), round((o[3] + 1) / h, 4)] for o in done if o[3] - o[1] >= 3]
        rects.sort(key=lambda r: (r[1], r[0]))
        e['hl'] = rects
    elif b.endswith('_plain.png'):
        e['hl'] = OLD.get(key, {}).get('hl', [])
        print(f'  {key}: no highlighted version in {src}' + (' (kept the measured rectangles already in snips.json)' if e['hl'] else ' (no sweep)'))
    D[key] = e
json.dump(D, open(out, 'w'), indent=1); print(f'wrote {out}: {len(D)} snips')
