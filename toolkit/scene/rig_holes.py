# Find places where the background shows through a rigged figure: magenta pixels enclosed by the figure (not reachable
# from the cell border). usage: python3 rig_holes.py sheet.png [cols rows]
import sys, cv2, numpy as np
im = cv2.imread(sys.argv[1]); C, Rr = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (6, 2)
H, W = im.shape[:2]; cw, ch = W // C, H // Rr
mag = (np.abs(im.astype(int) - [255, 0, 255]).max(-1) < 40).astype(np.uint8)
bad = 0
for r in range(Rr):
    for c in range(C):
        cell = mag[r * ch:(r + 1) * ch, c * cw:(c + 1) * cw].copy()
        if cell.min() == 1: continue
        ff = cell.copy(); h, w = ff.shape; m = np.zeros((h + 2, w + 2), np.uint8)
        for (x, y) in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
            if ff[y, x]: cv2.floodFill(ff, m, (x, y), 2)
        holes = (ff == 1).astype(np.uint8)
        n, lab, st, cen = cv2.connectedComponentsWithStats(holes)
        for i in range(1, n):
            if 6 <= st[i][4] <= 200 and 6 < c * cw + cen[i][0] < W - 6:
                bad += 1; print(f'HOLE cell {r * C + c} at ({c * cw + cen[i][0]:.0f},{r * ch + cen[i][1]:.0f}) area {st[i][4]} px')
                cv2.circle(im, (int(c * cw + cen[i][0]), int(r * ch + cen[i][1])), 14, (0, 255, 0), 3)
# notches: narrow gaps open to the outside that are NOT there in the rest pose (cell REF), i.e. seams a pose opens up
REF = int(sys.argv[4]) if len(sys.argv) > 4 else C * Rr - 2
import json
JOINTS = json.load(open(sys.argv[5])) if len(sys.argv) > 5 else None   # only gaps near a joint are seams
fig = 1 - mag; k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
def cellmask(i): r, c = divmod(i, C); f = fig[r * ch:(r + 1) * ch, c * cw:(c + 1) * cw]; return ((cv2.morphologyEx(f, cv2.MORPH_CLOSE, k) == 1) & (f == 0)).astype(np.uint8)
ref = cv2.dilate(cellmask(REF), np.ones((9, 9), np.uint8))
for i in range(C * Rr):
    if i == REF: continue
    new = cellmask(i) & (1 - ref); n, lab, st, cen = cv2.connectedComponentsWithStats(new); r, c = divmod(i, C)
    for j in range(1, n):
        x, y = c * cw + cen[j][0], r * ch + cen[j][1]
        nearj = JOINTS is None or any(abs(x - jx) < 22 and abs(y - jy) < 22 for _, jx, jy in JOINTS[i])
        if st[j][4] >= 15 and 6 < x < W - 6 and nearj: print(f'CHECK notch (may be the natural gap between two limbs) cell {i} at ({x:.0f},{y:.0f}) area {st[j][4]} px'); cv2.circle(im, (int(x), int(y)), 12, (255, 255, 0), 2)
cv2.imwrite(sys.argv[1].replace('.png', '_holes.png'), im)
print('holes:', bad); sys.exit(1 if bad else 0)
