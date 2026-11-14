#!/usr/bin/env python3
"""Find picture flashes in a finished clip: a hard cut to something that is gone again within MAXS seconds
(Sam, Moctar 14 Nov 2026: "At around 0:58 the screen shows a flash of mobile phone photo again"; a 0.14 s sliver of the old
picture after a full-screen card). The plan checks (visible_lint) work from timeline.json; this one reads the pixels, so it also
catches what the kit drew differently from the plan. Camera moves and dissolves change frames slowly and don't count as cuts.
Usage: flash_lint.py CLIP.mp4 [--max 0.5] [--cut 28]   Exits 1 on any flash; prints the time and saves a strip of the frames."""
import sys, subprocess, argparse, numpy as np, os
ap = argparse.ArgumentParser(); ap.add_argument('clip'); ap.add_argument('--max', type=float, default=0.5); ap.add_argument('--cut', type=float, default=28)
ap.add_argument('--out', default=None); a = ap.parse_args()
W, H, FPS = 96, 54, 30
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.clip, '-vf', f'fps={FPS},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))            # frame-to-frame change
# A transition = a run of changing frames (d > 4) lasting at most 6 frames whose total change is large: hard cuts and the kit's
# quick 0.15-0.3 s card fades. Slow dissolves and camera moves spread their change thinly and are ignored.
def corr(x, y):   # same picture before and after (a crash zoom, shake or whip on one still) is a move, not a cut
    x = x - x.mean(); y = y - y.mean(); return float((x * y).sum() / (np.sqrt((x * x).sum() * (y * y).sum()) + 1e-6))
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
for t, s, aba in bad: print(f"FLASH {t:7.2f} s  {s:.2f} s on screen{'  (old picture returns: A-B-A)' if aba else ''}")
if bad and a.out:
    os.makedirs(a.out, exist_ok=True)
    for t, s, _ in bad: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, t - 0.2):.2f}', '-i', a.clip, '-frames:v', '1', '-vf', 'fps=10,scale=320:-1,tile=6x1', f'{a.out}/flash_{t:.2f}.jpg'])
print(f"{len(cuts)} hard cuts, {len(bad)} flash(es) under {a.max} s"); sys.exit(1 if bad else 0)
