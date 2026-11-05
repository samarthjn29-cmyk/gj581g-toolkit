#!/usr/bin/env python3
"""Recolour a vector illustration (SVG) into a series palette (5 Nov 2026, Sam: options 2-3, stock/kit/vectorised art).
Every fill, stroke and gradient stop is mapped by hue family onto a ramp of palette tones, keeping its lightness, so
light and shade survive but the colours become ours. Embedded raster images (gradients that pdftocairo baked) are
toned with a matching SVG filter.
Usage: recolour_svg.py in.svg out.svg [--palette banknote] [--sat 1.0]
Licences: only for art we are licensed to modify (Adobe Stock standard licence, a bought kit, our own vectorised art)."""
import re, sys, colorsys
PAL = {'banknote': {
  'green': ['#14271F', '#24493A', '#3E6B52', '#7E9C82', '#A9BFA0', '#DCE6D8'],
  'wood':  ['#2E1C12', '#55361F', '#6B4430', '#8A5A3B', '#C9A27A', '#EAD9BC'],
  'red':   ['#3E121B', '#7A2333', '#9C3F4C', '#C98A8F', '#EBCFCB'],
  'gold':  ['#5E4313', '#9C7324', '#B98B2E', '#E2B54A', '#F1DDA0'],
  'blue':  ['#18292F', '#2E4A55', '#5E7C84', '#A9BDBE', '#DCE6E0'],
  'grey':  ['#1C2422', '#4A4A44', '#8A8070', '#CFC6B4', '#EFE9DA', '#F7F3E8']}}
def hx(h): h = h.lstrip('#'); h = ''.join(c * 2 for c in h) if len(h) == 3 else h; return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
def lum(c): return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def ramp_at(ramp, L):
    rs = sorted((hx(x) for x in ramp), key=lum); ls = [lum(r) for r in rs]
    if L <= ls[0]: return rs[0]
    if L >= ls[-1]: return rs[-1]
    for i in range(len(rs) - 1):
        if ls[i] <= L <= ls[i + 1]:
            t = (L - ls[i]) / (ls[i + 1] - ls[i] or 1); return tuple(rs[i][k] + (rs[i + 1][k] - rs[i][k]) * t for k in range(3))
def family(c):
    h, l, s = colorsys.rgb_to_hls(*c); h *= 360
    if s < 0.16 or l > 0.93 or l < 0.06: return 'grey'
    if h < 8 or h >= 330: return 'red'
    if h < 36: return 'wood'
    if h < 48: return 'gold' if s > 0.55 and l > 0.45 else 'wood'
    if h < 175: return 'green'
    if h < 265: return 'blue'
    return 'red'
def mapc(c, P):
    L = lum(c); return ramp_at(P[family(c)], L)
def fmt(c): return '#%02X%02X%02X' % tuple(max(0, min(255, round(v * 255))) for v in c)
def main():
    src, out = sys.argv[1], sys.argv[2]; P = PAL[sys.argv[sys.argv.index('--palette') + 1] if '--palette' in sys.argv else 'banknote']
    s = open(src, encoding='utf-8').read(); cache = {}
    def rgb_pct(m):
        c = tuple(float(m.group(i)) / 100 for i in (1, 2, 3)); k = fmt(c)
        if k not in cache: cache[k] = fmt(mapc(c, P))
        return cache[k]
    s = re.sub(r'rgb\(\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)', rgb_pct, s)
    def rgb_int(m):
        c = tuple(int(m.group(i)) / 255 for i in (1, 2, 3)); k = fmt(c)
        if k not in cache: cache[k] = fmt(mapc(c, P))
        return cache[k]
    s = re.sub(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', rgb_int, s)
    def hexc(m):
        k = m.group(2).upper()
        if len(k) == 3: k = ''.join(ch * 2 for ch in k)
        if k not in cache: cache[k] = fmt(mapc(hx(k), P))
        return m.group(1) + cache[k]
    s = re.sub(r'((?:fill|stroke|stop-color|flood-color)\s*[:=]\s*"?)#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', hexc, s)
    # named white/black in paint attributes (Fluent Emoji and Figma exports use stop-color="white")
    named = {'white': 'FFFFFF', 'black': '000000'}
    s = re.sub(r'((?:fill|stroke|stop-color|flood-color)\s*=\s*")(white|black)"',
               lambda m: m.group(1) + '#' + (cache.setdefault(named[m.group(2)], fmt(mapc(hx(named[m.group(2)]), P)))).lstrip('#') + '"', s)
    # colours hidden in filters (5 Nov 2026: Fluent Emoji inner glows): a feColorMatrix whose RGB rows ignore the input
    # paints a flat colour from its offset column; recolour that colour like any fill
    def fcm(m):
        v = m.group(2).split()
        if len(v) == 20 and all(float(v[r * 5 + k]) == 0 for r in range(3) for k in range(4)):
            c = tuple(float(v[r * 5 + 4]) for r in range(3)); k = fmt(c)
            if c == (0.0, 0.0, 0.0): return m.group(0)  # alpha-only helper (hardAlpha), leave it
            if k not in cache: cache[k] = fmt(mapc(c, P))
            n = hx(cache[k]); v[4], v[9], v[14] = (f'{n[0]:.4f}', f'{n[1]:.4f}', f'{n[2]:.4f}')
        return m.group(1) + ' '.join(v) + m.group(3)
    s = re.sub(r'(<feColorMatrix[^>]*type="matrix"[^>]*values=")([^"]+)(")', fcm, s)
    # baked raster pieces: tone them toward the palette (desaturate, warm, slight green cast)
    if '<image' in s:
        filt = ('<filter id="palTone" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0.55"/>'
                '<feColorMatrix type="matrix" values="0.96 0.04 0 0 0.03  0.02 0.94 0.02 0 0.02  0.02 0.06 0.84 0 0.02  0 0 0 1 0"/></filter>')
        s = re.sub(r'(<svg[^>]*>)', r'\1<defs>' + filt + '</defs>', s, count=1)
        s = re.sub(r'<image ', '<image filter="url(#palTone)" ', s)
    open(out, 'w', encoding='utf-8').write(s)
    print(f'{len(cache)} colours mapped -> {out}')
if __name__ == '__main__': main()
