#!/usr/bin/env python3
"""Recolour a rendered illustration (PNG) into a series palette, pixel by pixel (5 Nov 2026).
Same rules as recolour_svg.py (hue family -> palette ramp, lightness kept), but it also reaches gradients and baked
raster pieces that the SVG route misses. Family weights are blended softly across hue so gradients don't band.
Usage: recolour_png.py in.png out.png [--sat 1.0] [--keep 0.15]
  --keep  how much of the original colour to mix back in (0 = pure palette)."""
import sys, numpy as np
from PIL import Image
sys.path.insert(0, __import__('os').path.dirname(__file__))
from recolour_svg import PAL, hx, lum
FAM = ['red', 'wood', 'gold', 'green', 'blue', 'grey']
CENT = {'red': 0, 'wood': 24, 'gold': 42, 'green': 90, 'blue': 215}   # hue centres (deg)
def ramp_lut(ramp):
    rs = sorted((hx(x) for x in ramp), key=lum); ls = np.array([lum(r) for r in rs]); rs = np.array(rs)
    return ls, rs
def apply_ramp(L, ramp):
    ls, rs = ramp_lut(ramp); return np.stack([np.interp(L, ls, rs[:, k]) for k in range(3)], -1)
def main():
    a = sys.argv; src, out = a[1], a[2]; keep = float(a[a.index('--keep') + 1]) if '--keep' in a else 0.15
    P = PAL['banknote']; im = Image.open(src).convert('RGBA'); A = np.asarray(im).astype(np.float32) / 255
    rgb, alpha = A[..., :3], A[..., 3:]
    mx, mn = rgb.max(-1), rgb.min(-1); l = (mx + mn) / 2; d = mx - mn
    s = np.where(d < 1e-6, 0, d / np.where(l < 0.5, mx + mn + 1e-6, 2 - mx - mn + 1e-6))
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h = np.where(mx == r, ((g - b) / (d + 1e-6)) % 6, np.where(mx == g, (b - r) / (d + 1e-6) + 2, (r - g) / (d + 1e-6) + 4)) * 60
    L = 0.2126 * r + 0.7152 * g + 0.0722 * b
    # soft weights by hue distance to each family centre; greys by low saturation
    W = {}
    for f, c in CENT.items():
        dist = np.minimum(np.abs(h - c), 360 - np.abs(h - c)); W[f] = np.exp(-(dist / {'gold': 9, 'wood': 14, 'red': 14}.get(f, 38)) ** 2)
    tot = sum(W.values()) + 1e-6
    greyw = np.clip(1 - (s - 0.08) / 0.14, 0, 1)
    outc = np.zeros_like(rgb)
    for f in CENT: outc += (W[f] / tot)[..., None] * apply_ramp(L, P[f])
    outc = (1 - greyw[..., None]) * outc + greyw[..., None] * apply_ramp(L, P['grey'])
    outc = (1 - keep) * outc + keep * rgb
    o = np.concatenate([np.clip(outc, 0, 1), alpha], -1)
    Image.fromarray((o * 255).astype(np.uint8), 'RGBA').save(out); print('recoloured ->', out)
if __name__ == '__main__': main()
