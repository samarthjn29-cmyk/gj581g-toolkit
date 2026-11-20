# Cone centres and types from Fong et al. 2025 Fig. 1B(iv) (2.5x panel, CC BY 4.0), which shows the same patch as Fig. 1A(iii).
import json, numpy as np
from PIL import Image
from scipy import ndimage as nd
f = Image.open('/home/claude/colour/real_dl/f1.jpg').convert('RGB')
S = 8
iv = f.crop((525, 64, 593, 132)).resize((68 * S, 68 * S), Image.BICUBIC)
a = np.asarray(iv).astype(float) / 255
ch = np.stack([np.sqrt(a[..., i] / np.percentile(a[..., i], 99.5)).clip(0, 1) for i in range(3)], -1)   # gamma-lift dim cones, per channel
lum = ch.max(2)
sm = nd.gaussian_filter(lum, 0.9 * S)
bg = nd.gaussian_filter(lum, 4 * S)
sm2 = sm - 0.6 * bg
mx = nd.maximum_filter(sm2, size=int(2.9 * S))
pk = (sm2 == mx) & (sm > 0.22)
ys, xs = np.nonzero(pk)
cones = []
for y, x in zip(ys, xs):
    r, g, b = ch[max(0, y - 6):y + 7, max(0, x - 6):x + 7].reshape(-1, 3).mean(0)
    t = 'L' if r >= g and r >= b else ('M' if g >= b else 'S')
    cones.append({'x': round(x / S, 2), 'y': round(y / S, 2), 't': t, 'v': round(float(max(r, g, b)), 3)})
json.dump(cones, open('cones.json', 'w'))
from collections import Counter
print(len(cones), Counter(c['t'] for c in cones))
# check overlay
ov = iv.copy(); from PIL import ImageDraw; d = ImageDraw.Draw(ov)
for c in cones: d.ellipse((c['x'] * S - 8, c['y'] * S - 8, c['x'] * S + 8, c['y'] * S + 8), outline='white', width=2)
ov.save('/tmp/claude-0/-home-claude/4f679353-75c2-5592-944f-4863c7efe9b2/scratchpad/c3/detect.png')
