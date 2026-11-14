#!/usr/bin/env python3
"""Repaint a Lottie animation in the painted palette (Sam, 14 Nov 2026: "Are all the gags in the library painted?").
Every solid fill and stroke colour (static or keyframed) moves to the nearest colour of the gouache palette, keeping its
lightness order; gradients are mapped stop by stop. Writes NAME_painted.json next to the input. gag_lint accepts a lottie card
only when its file ends in _painted.json (the painted finish then adds the brush-edge wobble and grain like any card).
Usage: lottie_paint.py FILE.json [...]"""
import sys, json, colorsys
PAL = ['#26302A', '#2E4A33', '#5AA866', '#9CC98A', '#A8432F', '#C97B84', '#E9B93A', '#E9C88A', '#F3EBDD', '#6B4E8C', '#3E2F8F']
PAL = [tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)) for h in PAL]
def near(rgb):
    r, g, b = rgb[:3]
    if max(r, g, b) - min(r, g, b) < 0.08:   # greys -> ink / cream by lightness
        l = (r + g + b) / 3; return (0.149, 0.188, 0.165) if l < 0.35 else ((0.353, 0.42, 0.38) if l < 0.6 else (0.953, 0.922, 0.867))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    def d(p):
        ph, pl, ps = colorsys.rgb_to_hls(*p); dh = min(abs(h - ph), 1 - abs(h - ph)); return (dh * 3) ** 2 + (l - pl) ** 2 + 0.3 * (s - ps) ** 2
    return min(PAL, key=d)
def fix(v):
    if isinstance(v, list) and len(v) in (3, 4) and all(isinstance(x, (int, float)) for x in v) and max(v[:3]) <= 1.0:
        p = near(v); return list(p) + ([v[3]] if len(v) == 4 else [])
    return v
def walk(o):
    if isinstance(o, dict):
        if o.get('ty') in ('fl', 'st') and isinstance(o.get('c'), dict):
            k = o['c'].get('k')
            if isinstance(k, list) and k and isinstance(k[0], dict):
                for kf in k:
                    for key in ('s', 'e'):
                        if key in kf: kf[key] = fix(kf[key])
            else: o['c']['k'] = fix(k)
        if o.get('ty') in ('gf', 'gs') and isinstance(o.get('g'), dict):
            g = o['g']; n = g.get('p', 0); kk = g.get('k', {}).get('k')
            if isinstance(kk, list) and kk and not isinstance(kk[0], dict):
                for i in range(n): kk[i * 4 + 1:i * 4 + 4] = near(kk[i * 4 + 1:i * 4 + 4])[:3]
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
for f in sys.argv[1:]:
    if f.endswith('_painted.json'): continue
    j = json.load(open(f)); walk(j); out = f[:-5] + '_painted.json'; json.dump(j, open(out, 'w')); print(out)
