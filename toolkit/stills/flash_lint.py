#!/usr/bin/env python3
"""Find picture flashes in a finished clip: a hard cut to something that is gone again within MAXS seconds
(Sam, Moctar 14 Nov 2026: "At around 0:58 the screen shows a flash of mobile phone photo again"; a 0.14 s sliver of the old
picture after a full-screen card). The plan checks (visible_lint) work from timeline.json; this one reads the pixels, so it also
catches what the kit drew differently from the plan. Camera moves and dissolves change frames slowly and don't count as cuts.
Usage: flash_lint.py CLIP.mp4 [--max 0.5] [--cut 28]   Exits 1 on any flash; prints the time and saves a strip of the frames."""
import sys, subprocess, argparse, numpy as np, os
ap = argparse.ArgumentParser(); ap.add_argument('clip'); ap.add_argument('--max', type=float, default=0.5); ap.add_argument('--cut', type=float, default=28)
ap.add_argument('--out', default=None); ap.add_argument('--timeline', default=None); a = ap.parse_args()
W, H, FPS = 96, 54, 30
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.clip, '-vf', f'fps={FPS},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))            # frame-to-frame change
# A transition = a run of changing frames (d > 4) lasting at most 6 frames whose total change is large: hard cuts and the kit's
# quick 0.15-0.3 s card fades. Slow dissolves and camera moves spread their change thinly and are ignored.
def _c(x, y):
    x = x - x.mean(); y = y - y.mean(); return float((x * y).sum() / (np.sqrt((x * x).sum() * (y * y).sum()) + 1e-6))
from PIL import Image as _I
def corr(x, y):   # same picture before and after (a crash zoom, bounce, shake or whip on one still) is a move, not a cut:
    best = _c(x, y)  # also try the after-frame zoomed in or out against the before-frame (Moctar bet 'bounce', 14 Nov 2026)
    for z in (0.7, 0.8, 0.9, 1.12, 1.25, 1.43):
        a, b = (x, y) if z > 1 else (y, x); zz = z if z > 1 else 1 / z
        w, h = int(W / zz), int(H / zz); x0, y0 = (W - w) // 2, (H - h) // 2
        crop = np.asarray(_I.fromarray(a[y0:y0 + h, x0:x0 + w].astype(np.uint8)).resize((W, H)), np.float32)
        best = max(best, _c(crop, b))
    return best
ev, i = [], 0
while i < len(d):
    if d[i] > 4:
        j = i
        while j + 1 < len(d) and d[j + 1] > 4: j += 1
        if j - i < 6 and d[i:j + 1].sum() > a.cut and corr(F[i], F[min(j + 1, len(F) - 1)]) < 0.6: ev.append((i + 1, j + 1))   # frames i+1 .. j+1 are the new picture's first
        i = j + 1
    else: i += 1
cuts = [e[0] for e in ev]; bad = []
for (s0, e0), (s1, e1) in zip(ev, ev[1:]):
    n = s1 - e0   # frames fully showing the in-between picture
    if n / FPS < a.max:
        before, mid, after = F[max(0, s0 - 2)], F[e0:max(e0 + 1, s1)].mean(0), F[min(e1 + 1, len(F) - 1)]
        aba = np.abs(before - after).mean() < 0.6 * min(np.abs(before - mid).mean(), np.abs(after - mid).mean())
        bad.append((e0 / FPS, n / FPS, aba))
# Ghost overlay (Sam, Moctar 14 Nov 2026: "Not a single dollar flashes for a millisecond ... once it's already gone"): a small part
# of the frame shows something for under 0.25 s while the frames either side of it agree. Checked on a finer copy (192x108), per
# 8x8 block. Quick gag motion (a sticker flying off, words landing) can match too, so these are WARN lines for a person to look at.
GW, GH = 192, 108
g = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.clip, '-vf', f'fps={FPS},scale={GW}:{GH}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
G = np.frombuffer(g, np.uint8).reshape(-1, GH, GW).astype(np.float32); KK = 4; gh = []
blk = lambda x: x.reshape(GH // 8, 8, GW // 8, 8).mean(axis=(1, 3)) if GH % 8 == 0 else x[:GH // 8 * 8].reshape(GH // 8, 8, GW // 8, 8).mean(axis=(1, 3))
for i2 in range(KK, len(G) - KK):
    d1 = blk(np.abs(G[i2] - G[i2 - KK])); d2 = blk(np.abs(G[i2] - G[i2 + KK])); d3 = blk(np.abs(G[i2 - KK] - G[i2 + KK]))
    if ((np.minimum(d1, d2) > 9) & (d3 < 3)).sum() >= 1: gh.append(i2)
runs = []
for i2 in gh:
    if runs and i2 - runs[-1][1] <= 1: runs[-1][1] = i2
    else: runs.append([i2, i2])
ghosts = [(r0 / FPS, (r1 - r0 + 1) / FPS) for r0, r1 in runs if r1 - r0 + 1 <= 2 * KK]
if a.timeline:   # gag motion inside a running card (a sticker flying off, words landing) is expected; only its first 0.3 s is checked
    import json as _j; _cards = _j.load(open(a.timeline)).get('cards', [])
    ghosts = [(t, s_) for t, s_ in ghosts if not any(c['t'] + 0.3 < t < c['t'] + c.get('dur', 2) - 0.05 for c in _cards)]
for t, s_ in ghosts: print(f"WARN  {t:7.2f} s  something shows in part of the frame for {s_:.2f} s and is gone again: look (a ghost, or quick gag motion)")
for t, s, aba in bad: print(f"FLASH {t:7.2f} s  {s:.2f} s on screen{'  (old picture returns: A-B-A)' if aba else ''}")
if bad and a.out:
    os.makedirs(a.out, exist_ok=True)
    for t, s, _ in bad: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, t - 0.2):.2f}', '-i', a.clip, '-frames:v', '1', '-vf', 'fps=10,scale=320:-1,tile=6x1', f'{a.out}/flash_{t:.2f}.jpg'])
print(f"{len(cuts)} hard cuts, {len(bad)} flash(es) under {a.max} s"); sys.exit(1 if bad else 0)
