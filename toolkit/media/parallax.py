"""Split a still photo into two layers for a 2.5D parallax move (Remotion <Parallax>).
Usage: parallax.py photo.jpg out_prefix [width=2400]
Writes <prefix>_fg.png (subject cut out, soft edge) and <prefix>_bg.jpg (subject removed by inpainting, so the
background can slide without showing a hole). Uses rembg (isnet-general-use; model downloads from GitHub once)."""
import sys, numpy as np, cv2
from PIL import Image, ImageFilter
from rembg import remove, new_session
src, pre = sys.argv[1], sys.argv[2]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 2400
im = Image.open(src).convert('RGB'); im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
m = remove(im, session=new_session('isnet-general-use'), only_mask=True).convert('L')
m = m.point(lambda v: 255 if v > 110 else int(v * 255 / 110))
fg = im.copy(); fg.putalpha(m.filter(ImageFilter.GaussianBlur(1.2))); fg.save(pre + '_fg.png')
a = np.array(im)[:, :, ::-1]; mk = (np.array(m) > 40).astype(np.uint8) * 255
mk = cv2.dilate(mk, np.ones((25, 25), np.uint8))
small = cv2.resize(a, None, fx=0.25, fy=0.25); sm = cv2.resize(mk, None, fx=0.25, fy=0.25)
fill = cv2.inpaint(small, sm, 9, cv2.INPAINT_TELEA); fill = cv2.resize(fill, (a.shape[1], a.shape[0]))
bg = np.where(mk[:, :, None] > 0, fill, a); bg = cv2.GaussianBlur(bg, (0, 0), 2.0)
cv2.imwrite(pre + '_bg.jpg', bg, [cv2.IMWRITE_JPEG_QUALITY, 90])
print('layers', im.size, 'subject share', round((np.array(m) > 128).mean(), 3))
