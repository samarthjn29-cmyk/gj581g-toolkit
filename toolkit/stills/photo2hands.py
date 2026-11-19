"""Turn a real photo (a place or an object, never a person) into a hands-style drawing (19 Nov 2026).
Sam: "I don't want such AI generated images but rather I want graphics like hands video". The photo gives the composition,
perspective, light and clutter; this pass gives the look: flat print colours from a small palette, confident black brush lines,
the colour plate set a few pixels off its lines, ink hatching in the deepest shadows, paper grain.
usage: photo2hands.py IN.jpg OUT.png PALETTE [--mask x0,y0,x1,y1:#hex ...]
  PALETTE: lab | study | cream   (each a dark-to-light ramp plus accents)
  --mask paints a rectangle flat before drawing (e.g. to hide a brand name on equipment)."""
import sys, cv2, numpy as np
W, H = 1920, 1080
KCL, MINA, LONG = 6, 2600, 320
PAL = {   # dark -> light, then accents (hue-matched)
    'lab':   ['#141A2E', '#1F2A47', '#2E3F63', '#3F6E80', '#7FA6A8', '#D9D2BE', '#EFE6D2', '#E2A33B', '#E06B4E'],
    'study': ['#1E1418', '#3A1F1F', '#5E2E22', '#8A4A2A', '#B9773A', '#E2A33B', '#EFE0C2', '#2E3F63', '#3F6E80'],
    'cream': ['#1B1A21', '#3A3F55', '#6E6C66', '#9C9A93', '#C9BFAE', '#E9DEC6', '#EFE6D2', '#3B8A8C', '#E06B4E'],
}
hexc = lambda h: np.array([int(h[5:7], 16), int(h[3:5], 16), int(h[1:3], 16)], np.float32)   # BGR

def cover(im):
    h, w = im.shape[:2]; s = max(W / w, H / h); im = cv2.resize(im, (int(w * s + .5), int(h * s + .5)), interpolation=cv2.INTER_AREA)
    y, x = (im.shape[0] - H) // 2, (im.shape[1] - W) // 2; return im[y:y + H, x:x + W]

def run(inp, out, pal, masks):
    im = cover(cv2.imread(inp))
    if CROP: x0, y0, x1, y1 = CROP; im = cv2.resize(im[y0:y1, x0:x1], (W, H), interpolation=cv2.INTER_CUBIC)
    for (x0, y0, x1, y1, col) in masks: im[y0:y1, x0:x1] = hexc(col)
    rng = np.random.default_rng(5)
    # 1 simplify into shapes
    small = cv2.resize(im, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
    for _ in range(4): small = cv2.bilateralFilter(small, 9, 60, 9)
    small = cv2.edgePreservingFilter(small, flags=1, sigma_s=80, sigma_r=0.35)
    small = cv2.pyrMeanShiftFiltering(small, 18, 34, maxLevel=2)
    lab = cv2.cvtColor(small, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    K = KCL; _, lid, cen = cv2.kmeans(lab, K, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, 0.5), 3, cv2.KMEANS_PP_CENTERS)
    lid = lid.reshape(H // 2, W // 2).astype(np.uint8)
    lid = cv2.resize(lid, (W, H), interpolation=cv2.INTER_NEAREST)
    for k in (15, 11, 7): lid = (cv2.medianBlur(lid * 25, k) // 25).astype(np.uint8)
    # merge small islands into their surroundings so the picture reads as a few big shapes
    for _ in range(2):
        for c in range(K):
            n, cc, st, _ = cv2.connectedComponentsWithStats((lid == c).astype(np.uint8), 8)
            for j in range(1, n):
                if st[j, 4] < MINA:
                    m = cc == j; ring = cv2.dilate(m.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & ~m
                    if ring.any(): lid[m] = np.bincount(lid[ring], minlength=K).argmax()
    # 2 each cluster -> a palette colour: ramp by lightness, the most saturated warm/cool clusters take the accents
    P = [hexc(c) for c in PAL[pal]]; ramp, acc = P[:7], P[7:]
    L, A, B = cen[:, 0], cen[:, 1] - 128, cen[:, 2] - 128; chroma = np.hypot(A, B)
    order = np.argsort(L); cmap = {}
    for r, c in enumerate(order): cmap[int(c)] = ramp[min(6, int(round(r * 6 / (K - 1))))]
    for c in np.argsort(-chroma)[:1]:
        if chroma[c] > 22: cmap[int(c)] = acc[0] if B[c] > 0 else acc[1]
    fill = np.zeros((H, W, 3), np.float32)
    for c, col in cmap.items(): fill[lid == c] = col
    # 3 ink: region boundaries plus the photo's long structural edges, thickened into a brush line with a living width
    edge = (cv2.Canny(lid * 25, 1, 1) > 0).astype(np.uint8)
    gs = cv2.GaussianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), (0, 0), 1.6)
    det = cv2.Canny(gs, 40, 110); cnts, _ = cv2.findContours(det, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    long = np.zeros((H, W), np.uint8)
    for c in cnts:
        if cv2.arcLength(c, False) > LONG: cv2.polylines(long, [cv2.approxPolyDP(c, 1.5, False)], False, 1, 2, cv2.LINE_AA)
    ink = np.maximum(edge, long).astype(np.float32)
    wid = cv2.resize(rng.random((H // 40, W // 40)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)   # slow width variation
    thick = cv2.dilate(ink, np.ones((3, 3), np.uint8)); thicker = cv2.dilate(ink, np.ones((5, 5), np.uint8))
    ink = np.where(wid > 0.55, thicker, thick)
    ink = cv2.GaussianBlur(ink, (0, 0), 0.9); ink = np.clip((ink - 0.25) * 2.2, 0, 1)
    # 4 hatching in the deepest shadows (ink lines at 45 degrees, broken up)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dark = (cv2.GaussianBlur(gs.astype(np.float32), (0, 0), 6) < 45).astype(np.float32)
    hatch = ((np.sin((xx + yy) * 0.42) > 0.86) & (rng.random((H, W)) > 0.08)).astype(np.float32) * dark * 0.85
    # 5 the colour plate prints a little off its lines; paper shows in the gap
    paper = hexc('#EFE6D2')
    off = np.roll(np.roll(fill, -5, axis=1), 4, axis=0)
    gap = (np.abs(off - fill).sum(2) > 30)[..., None] & (rng.random((H, W, 1)) > 0.55)
    col = np.where(gap, paper * 0.95 + off * 0.05, off)
    # 6 print texture: mottled ink density and speckle
    mott = cv2.resize(rng.random((H // 60, W // 60)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)[..., None]
    col = col * (0.93 + 0.12 * mott) + (rng.standard_normal((H, W, 1)) * 5)
    INK = hexc('#16151B'); a = np.clip(ink + hatch, 0, 1)[..., None]
    out_im = col * (1 - a) + INK * a
    cv2.imwrite(out, np.clip(out_im, 0, 255).astype(np.uint8)); print(out)

if __name__ == '__main__':
    a = sys.argv[1:]; masks = []; CROP = None
    if '--crop' in a: i = a.index('--crop'); CROP = tuple(map(int, a[i + 1].split(','))); a = a[:i] + a[i + 2:]
    if '--mask' in a:
        i = a.index('--mask'); for_m = a[i + 1:]; a = a[:i]
        for m in for_m: xy, c = m.split(':'); x0, y0, x1, y1 = map(int, xy.split(',')); masks.append((x0, y0, x1, y1, c))
    run(a[0], a[1], a[2], masks)
