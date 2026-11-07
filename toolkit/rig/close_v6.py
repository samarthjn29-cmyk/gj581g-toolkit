# Close-up plate for pilot v6: wall panels behind the stand, the plain ruled lines cleared, word-like marks in three
# slanted columns; the same writing copied into the room plate's small scroll.
import cv2, numpy as np, random
random.seed(5)
k = 3840 / 1344
close = cv2.imread('/home/claude/twice/remotion/public/scrolls/pilot3/close.jpg')
Hc, Wc = close.shape[:2]; s = Wc / 300.0
I = close.astype(int)
plaster = (np.abs(I - np.array((0x6e, 0x62, 0x6c))).max(-1) < 26)
def paste(img, x0, y0, x1, y1):
    p = cv2.imread(f'/home/claude/scrolls/blender/panels/{img}')
    X0, Y0, X1, Y1 = [int(round((v - o) * s)) for v, o in ((x0, 470), (y0, 178), (x1, 470), (y1, 178))]
    p = (cv2.resize(p, (X1 - X0, Y1 - Y0), interpolation=cv2.INTER_AREA).astype(float) * 0.78).astype(np.uint8)
    cx0, cy0, cx1, cy1 = max(0, X0), max(0, Y0), min(Wc, X1), min(Hc, Y1)
    sub = p[cy0 - Y0:cy1 - Y0, cx0 - X0:cx1 - X0]; m = plaster[cy0:cy1, cx0:cx1]
    reg = close[cy0:cy1, cx0:cx1]; reg[m] = sub[m]
paste('panel_bird.png', 428, 222, 540, 362); paste('panel_column.png', 600, 222, 668, 362)
sheet = np.array([[1418, 237], [2962, 242], [2504, 2027], [882, 2028]], np.float32)
sm = np.zeros((Hc, Wc), np.uint8); cv2.fillPoly(sm, [sheet.astype(np.int32)], 1); sm = cv2.erode(sm, np.ones((31, 31), np.uint8))
I = close.astype(int)
cream = np.median(close[(sm > 0) & (I.mean(-1) > 150)], axis=0)
diff = np.abs(I - cream).max(-1) > 22
close[(sm > 0) & diff] = cream
ink = (0x26, 0x2a, 0x3a)
def at(u, v):
    top = sheet[0] + (sheet[1] - sheet[0]) * u; bot = sheet[3] + (sheet[2] - sheet[3]) * u
    return top + (bot - top) * v
for c in range(3):
    for l in range(17):
        v = 0.08 + l * 0.05; u = 0.08 + c * 0.3; ue = u + random.uniform(0.21, 0.25)
        while u < ue:
            for q in range(random.randint(2, 6)):
                wl = random.uniform(0.008, 0.016)
                if u + wl > ue: break
                hh = random.uniform(0.012, 0.018)
                pts = np.array([at(u, v), at(u + wl, v), at(u + wl, v + hh), at(u, v + hh)], np.int32)
                cv2.fillPoly(close, [pts], ink, lineType=cv2.LINE_AA); u += wl + random.uniform(0.003, 0.006)
            u += random.uniform(0.014, 0.022)
cv2.imwrite('/home/claude/twice/remotion/public/scrolls/pilot6/close.jpg', close, [cv2.IMWRITE_JPEG_QUALITY, 93])
cv2.imwrite('/home/claude/scrolls/art/recraft/close_v6_view.jpg', cv2.resize(close, (960, 540), interpolation=cv2.INTER_AREA))
room = cv2.imread('/home/claude/scrolls/art/recraft/room_v6_3840.png')
f = k / s; off = np.array([470 * k, 178 * k])
small = cv2.resize(close, (int(Wc * f), int(Hc * f)), interpolation=cv2.INTER_AREA)
smk = cv2.resize(sm, (int(Wc * f), int(Hc * f)), interpolation=cv2.INTER_NEAREST) > 0
x0, y0 = int(off[0]), int(off[1]); reg = room[y0:y0 + small.shape[0], x0:x0 + small.shape[1]]
mm = smk[:reg.shape[0], :reg.shape[1]]; reg[mm] = small[:reg.shape[0], :reg.shape[1]][mm]
cv2.imwrite('/home/claude/scrolls/art/recraft/room_v6_3840.png', room)
print('ok')
