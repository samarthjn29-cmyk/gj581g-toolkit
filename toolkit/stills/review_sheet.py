#!/usr/bin/env python3
"""Contact sheets for the fresh reviewer agent (Sam, 11 Nov 2026: workflow change 4). One frame every STEP seconds
(default 1.0) from a chapter clip, 6 per row, each stamped with its time and the script line being spoken, written
as sheets of 60 frames: OUT_1.jpg, OUT_2.jpg, ... plus OUT_lines.txt (time -> line id -> text) for the checker.
Usage: review_sheet.py CLIP.mp4 TIMELINE.json SCRIPT.json OUT_PREFIX [--step 1.0]"""
import json, subprocess, sys, os, tempfile
from PIL import Image, ImageDraw
a = sys.argv[1:]
clip, tl, script, out = a[:4]; step = float(a[a.index('--step') + 1]) if '--step' in a else 1.0
T = json.load(open(tl)); S = json.load(open(script)); L = {l['id']: l['text'] for l in (S['lines'] if isinstance(S, dict) else S)}
words = T.get('words', [])
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip]).decode())
td = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-i', clip, '-vf', f'fps=1/{step},scale=320:-2', f'{td}/f_%05d.jpg'], check=True)
frames = sorted(os.listdir(td))
def line_at(t):
    sh = [s for s in T['shots'] if s['t'] <= t]
    return sh[-1]['at'] if sh else ''
rows, per = [], 60
for k in range(0, len(frames), per):
    chunk = frames[k:k + per]; W, H = 320, Image.open(f'{td}/{chunk[0]}').height + 18
    sheet = Image.new('RGB', (W * 6, H * ((len(chunk) + 5) // 6)), 'white'); d = ImageDraw.Draw(sheet)
    for i, f in enumerate(chunk):
        t = (k + i) * step; x, y = (i % 6) * W, (i // 6) * H
        sheet.paste(Image.open(f'{td}/{f}'), (x, y)); d.text((x + 4, y + H - 16), f'{t:6.1f}s  {line_at(t)}', fill='black')
    sheet.save(f'{out}_{k // per + 1}.jpg', quality=82)
seen = []
for s in T['shots']:
    if s['at'] not in seen: seen.append(s['at']); rows.append(f"{s['t']:7.1f}s  {s['at']:7}  {L.get(s['at'], '')}")
open(f'{out}_lines.txt', 'w').write('\n'.join(rows))
print(f'{len(frames)} frames, {(len(frames) + per - 1) // per} sheets, {dur:.1f} s')
