"""Snap ArchivalScanCard highlight boxes to the words they mark (Sam, 26 Nov 2026: "the highlighter is overshooting and
going beyond the text"). For each box: take the scan inside the box's rows, find ink columns, group them into words
(gaps over 0.35 x the box height split words), keep the words lying mostly inside the box, and set the box's left/right
to the kept words' outer ink. The component adds 6 px a side, so the drawn mark ends just past the word.
usage (from library/): python3 ../episodes_src/WCL-E01/fix_highlights/snap_highlights.py ACT.json [--sheet DIR]
prints, per shot, the old and snapped boxes as JSON; --sheet draws old (red) and new (green) boxes on each scan."""
import json, sys, os
import numpy as np
from PIL import Image, ImageDraw
reg = json.load(open("src/registry/registry.json"))["assets"]
reg = reg if isinstance(reg, dict) else {x["id"]: x for x in reg}
def path(src):
    ps = reg[src].get("paths") or []
    return next(p for p in ps if p.lower().endswith((".jpg", ".png", ".jpeg")))
def snap(g, box):
    x, y, w, h = box
    band = g[y + int(h * 0.2): y + int(h * 0.85), :]
    thr = np.percentile(g[y:y + h, x:x + w], 50) - 45   # ink = clearly darker than the paper around it
    ink = (band < thr).sum(0) >= 2
    lo, hi = max(0, x - 60), min(g.shape[1], x + w + 60)
    cols = np.where(ink[lo:hi])[0] + lo
    if len(cols) == 0:
        return box
    gap = max(6, int(h * float(os.environ.get("GAP", "0.2"))))
    words, s, p = [], cols[0], cols[0]
    for c in cols[1:]:
        if c - p > gap:
            words.append((s, p)); s = c
        p = c
    words.append((s, p))
    keep = [(a, b) for a, b in words if min(b, x + w) - max(a, x) > 0.6 * (b - a + 1)]
    if not keep:
        return box
    nx, nr = keep[0][0], keep[-1][1]
    return [int(nx - 2), y, int(nr - nx + 5), h]
act = json.load(open(sys.argv[1]))
sheet = sys.argv[sys.argv.index("--sheet") + 1] if "--sheet" in sys.argv else None
out = {}
for b in act["beats"]:
    if b["component"] != "ArchivalScanCard" or not b["props"].get("highlights"):
        continue
    img = Image.open(path(b["props"]["srcId"])).convert("L")
    g = np.asarray(img).astype(float)
    new = [snap(g, h["box"]) for h in b["props"]["highlights"]]
    out[b["id"]] = new
    print(b["id"], b["props"]["srcId"], [h["box"] for h in b["props"]["highlights"]], "->", new)
    if sheet:
        os.makedirs(sheet, exist_ok=True)
        im = img.convert("RGB"); d = ImageDraw.Draw(im)
        for h, n in zip(b["props"]["highlights"], new):
            x, y, w, hh = h["box"]; d.rectangle([x - 6, y - 4, x + w + 6, y + hh + 4], outline=(220, 40, 40), width=3)
            x, y, w, hh = n; d.rectangle([x - 6, y - 4, x + w + 6, y + hh + 4], outline=(20, 170, 60), width=3)
        cx, cy, cw, ch = b["props"]["crop"]
        im.crop((cx, cy, cx + cw, cy + ch)).save(os.path.join(sheet, b["id"].split("+")[0] + ".jpg"), quality=85)
json.dump(out, open("/tmp/snapped_boxes.json", "w"))
