#!/usr/bin/env python3
"""Dead-still scan of a finished video (Sam, Aliens v8 13 Nov 2026: "The video stopped playing at 3:51" - two motionless
full-screen cards for 5 s read as a stalled player). Reports every stretch >= MIN s where the picture does not change
at all (mean frame difference < 0.02 at 192x108, 10 fps). Since the kit's card 'breathe' (every full-screen card drifts
in 3%), a finished Aliens video had 3 stretches, all < 2.2 s. Fix anything over 2.5 s: a move on the shot, or the card
without `still: true`. Usage: freeze_scan.py VIDEO.mp4 [MIN=1.5]"""
import sys, subprocess, numpy as np
V = sys.argv[1]; MIN = float(sys.argv[2]) if len(sys.argv) > 2 else 1.5
r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', V, '-vf', 'fps=10,scale=192:108,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
f = np.frombuffer(r, np.uint8).reshape(-1, 108, 192).astype(float); d = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))
run = 0; n = 0; worst = 0
for i, x in enumerate(list(d) + [9]):
    if x < 0.02: run += 1
    else:
        if run >= MIN * 10: s = (i - run) / 10; n += 1; worst = max(worst, run / 10); print('dead-still %.1f s at %d:%04.1f' % (run / 10, s // 60, s % 60))
        run = 0
print(f'{n} stretches, longest {worst:.1f} s'); sys.exit(1 if worst > 2.5 else 0)
