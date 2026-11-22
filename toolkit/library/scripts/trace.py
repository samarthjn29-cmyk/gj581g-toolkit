#!/usr/bin/env python3
"""Line trace of a registered photo or mezzotint, for TRN-008 TraceToPicture (ParallaxCutout `trace`).
Output: a PNG mask (lines opaque, the rest transparent) at the source's own size, so it crops exactly like the
picture. Two edge scales (fine + broad) so faces keep their features and the figure keeps its outline; small
specks removed. Register the output as an extra path on the SAME source; only for sources whose licence
allows changes (PD, CC0, CC BY with changes credited, own).
usage: trace.py IN.jpg OUT.png [--fine 2.5] [--broad 5] [--lo 7] [--span 12]"""
import argparse
import numpy as np
from PIL import Image, ImageFilter, ImageOps

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--fine", type=float, default=2.5); ap.add_argument("--broad", type=float, default=5)
ap.add_argument("--lo", type=float, default=7); ap.add_argument("--span", type=float, default=12)
a = ap.parse_args()
im = Image.open(a.src).convert("L")
def edges(r):
    b = ImageOps.autocontrast(im.filter(ImageFilter.GaussianBlur(r)), cutoff=1)
    return np.asarray(b.filter(ImageFilter.FIND_EDGES), dtype=np.float32)
e = np.maximum(edges(a.fine), edges(a.broad) * 1.8)
m = np.clip((e - a.lo) / a.span, 0, 1)
mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
out = Image.new("RGBA", im.size, (0, 0, 0, 0)); out.putalpha(mi); out.save(a.out, optimize=True)
print(f"{a.out}: {im.size[0]}x{im.size[1]}, line coverage {np.asarray(mi).mean() / 255:.1%}")
