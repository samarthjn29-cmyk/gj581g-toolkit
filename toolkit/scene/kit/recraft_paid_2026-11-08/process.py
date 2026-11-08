# Paid-plan Recraft redraws (8 Nov 2026) -> the asset files the scenes use. White isolation backgrounds are flood-filled
# away from the image border; each asset is cropped to its drawing.
import subprocess, numpy as np, cv2, base64, os
def render(name, w):
    subprocess.run(['rsvg-convert', '-w', str(w), '-o', f'{name}.png', f'{name}.svg'], check=True)
    return cv2.imread(f'{name}.png', cv2.IMREAD_UNCHANGED)
def cutout(im, tol=22):
    if im.shape[2] == 3: im = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA)
    h, w = im.shape[:2]; near = (im[..., :3].astype(int).min(-1) > 255 - tol).astype(np.uint8)
    n, lab = cv2.connectedComponents(near, connectivity=4); border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border)); im[bg, 3] = 0; return im
def crop(im, pad=4):
    ys, xs = np.where(im[..., 3] > 0); return im[max(0, ys.min() - pad):ys.max() + pad, max(0, xs.min() - pad):xs.max() + pad]
OUT = {}
# head: skin recoloured to the kit body's skin so neck and face match
hd = crop(cutout(render('head', 1400)))
skin = hd[hd.shape[0] // 2, hd.shape[1] // 2, :3].astype(int); m = (np.abs(hd[..., :3].astype(int) - skin).max(-1) < 30) & (hd[..., 3] > 0)
hd[m, :3] = (106, 151, 200); cv2.imwrite('head_cut.png', hd); OUT['head'] = hd.shape
small = cv2.resize(hd, (int(hd.shape[1] * 300 / hd.shape[0]), 300), interpolation=cv2.INTER_AREA); cv2.imwrite('head_300.png', small)
src = base64.b64encode(open('head_300.png', 'rb').read()).decode()
open('/home/claude/twice/remotion/src/scrolls/kit/head_png.mjs', 'w').write("// the librarian's head, Recraft V4.1 vector on the paid plan (8 Nov 2026), inlined so it is ready on the first frame\nexport const HEAD_PNG = 'data:image/png;base64," + src + "';\n")
lamp = crop(cutout(render('lamp', 1400))); cv2.imwrite('../v7/lamp.png', lamp); OUT['lamp'] = lamp.shape
case = crop(cutout(render('case', 2600))); cv2.imwrite('../v7/case.png', case); OUT['case'] = case.shape
pb = render('panel_bird', 1600); cv2.imwrite('/home/claude/scrolls/blender/panels/panel_bird.png', pb); OUT['panel'] = pb.shape
fr = render('frieze', 1600); cv2.imwrite('/home/claude/scrolls/blender/panels/frieze.png', fr); OUT['frieze'] = fr.shape
nb = render('nile_back', 3840); nb = cv2.resize(nb[..., :3] if nb.shape[2] == 4 else nb, (3840, 2194)); cv2.imwrite('/home/claude/twice/remotion/public/scrolls/pilot8/nile_back.jpg', nb, [cv2.IMWRITE_JPEG_QUALITY, 92])
rd = cutout(render('nile_reeds', 2194)); rd[rd[..., :3].astype(int).min(-1) > 233, 3] = 0; x0 = (rd.shape[1] - 1902) // 2; rd = rd[:2194, x0:x0 + 1902]; cv2.imwrite('/home/claude/twice/remotion/public/scrolls/pilot6/nile_reeds.png', rd); OUT['reeds'] = rd.shape
print(OUT)
