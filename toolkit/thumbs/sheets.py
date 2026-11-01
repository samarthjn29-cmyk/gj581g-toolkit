"""Review and phone-feed sheets for thumbnails, plus size checks.
Usage: sheets.py <Prefix> thumb_A.png thumb_B.png ...
Writes <Prefix>_thumbs_review.png (2x2 at half size: look at it) and <Prefix>_thumbs_sheet.png (each ~170 px wide,
as in a phone feed: text and focal point must still read). Warns if an image isn't 1280x720 or is over 2 MB."""
import sys, os
from PIL import Image
prefix, files = sys.argv[1], sys.argv[2:]
out_dir = os.path.dirname(os.path.abspath(files[0]))
ims = []
for f in files:
    im = Image.open(f).convert('RGB'); ims.append(im)
    mb = os.path.getsize(f) / 1e6
    print(f"{os.path.basename(f)}: {im.size[0]}x{im.size[1]}, {mb:.2f} MB" + ('  <-- not 1280x720' if im.size != (1280, 720) else '') + ('  <-- over 2 MB' if mb > 2 else ''))
cols = 2; rows = (len(ims) + 1) // 2
R = Image.new('RGB', (cols * 650, rows * 370), 'white')
for i, im in enumerate(ims): R.paste(im.resize((640, 360)), ((i % cols) * 650, (i // cols) * 370))
R.save(os.path.join(out_dir, f'{prefix}_thumbs_review.png'))
P = Image.new('RGB', (len(ims) * 180 + 10, 110), 'white')
for i, im in enumerate(ims): P.paste(im.resize((170, 96), Image.LANCZOS), (10 + i * 180, 7))
P.save(os.path.join(out_dir, f'{prefix}_thumbs_sheet.png'))
print('wrote', f'{prefix}_thumbs_review.png', f'{prefix}_thumbs_sheet.png')
