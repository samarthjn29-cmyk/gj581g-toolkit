"""Fit a real photo / scan / engraving into a 2752x1536 still for the stills scene kit (Sam, 8 Nov 2026: real pictures first).
mode cover: crop to 16:9 (optional crop box first, in 0-1 fractions l,t,r,b).
mode contain: whole picture on a blurred, darkened copy of itself (photos) or on a plain ground (scans: bg='#1a1714' or 'paper').
key_white: turn a white studio background transparent before placing (museum object shots).
Usage from Python: fit(src, dst, mode='cover', crop=None, bg=None, key_white=False, rotate=0, scale=0.86, tint=False)
The picture is scaled to fit (up or down); tint=True warms white scans to a paper tone."""
from PIL import Image, ImageFilter, ImageOps, ImageEnhance
import numpy as np
W, H = 2752, 1536
def fit(src, dst, mode='cover', crop=None, bg=None, key_white=False, rotate=0, scale=0.86, shadow=True, tint=False):
    im = Image.open(src).convert('RGB')
    if tint:  # old white scans and engravings -> warm paper tone (multiply)
        im = Image.fromarray((np.asarray(im).astype(float) * np.array([226, 214, 190]) / 255).astype('uint8'))
    if crop:
        l, t, r, b = crop; w, h = im.size; im = im.crop((int(l*w), int(t*h), int(r*w), int(b*h)))
    if rotate: im = im.rotate(rotate, expand=True, fillcolor=(255, 255, 255) if key_white else (0, 0, 0))
    if mode == 'cover':
        out = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.5))
    else:
        if bg in (None, 'blur'):
            out = ImageOps.fit(im, (W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(60))
            out = ImageEnhance.Brightness(out).enhance(0.38)
        elif bg == 'paper':
            out = Image.new('RGB', (W, H), (226, 216, 196))
        else:
            out = Image.new('RGB', (W, H), bg)
        r = min(W*scale/im.width, H*scale/im.height); fg = im.resize((max(1,int(im.width*r)), max(1,int(im.height*r))), Image.LANCZOS)  # upscales too
        if key_white:
            a = np.asarray(fg).astype(float); lum = a.mean(2); sat = a.max(2) - a.min(2)
            alpha = np.clip((242 - lum) / 22, 0, 1); alpha[sat > 40] = 1
            m = Image.fromarray((alpha * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
        else:
            m = Image.new('L', fg.size, 255)
        x, y = (W - fg.width) // 2, (H - fg.height) // 2
        if shadow:
            sh = Image.new('L', (W, H), 0); sh.paste(m, (x + 18, y + 24)); sh = sh.filter(ImageFilter.GaussianBlur(28))
            out = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), out, sh.point(lambda v: int(v * 0.6)))
        out.paste(fg, (x, y), m)
    out.save(dst, quality=93)
    return dst
