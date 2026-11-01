"""Composite a motion preview: each slide's graphics layer (extracted by difference matting from black/white matte renders)
over its playing clips, slide by slide, then concat with the narration.
Usage: preview.py <deck_dir> <timing.json> <media_slots.json> <narration.mp3> <out.mp4>"""
import sys, json, os, glob, subprocess
import numpy as np
from PIL import Image
D, TIM, SLOTS, AUD, OUT = sys.argv[1:6]
PX = 1920 / 13.333
t = json.load(open(TIM))['slides']; slots = json.load(open(SLOTS))
B = sorted(glob.glob(f'{D}/rb/s-*.png')); Wt = sorted(glob.glob(f'{D}/rw/s-*.png'))
tmp = os.path.abspath(f'{D}/pv'); os.makedirs(tmp, exist_ok=True)
segs = []
for i, (bp, wp) in enumerate(zip(B, Wt), 1):
    dur = float(t[str(i)]['advance_s'])
    mine = [s for s in slots if s['slide'] == i]
    seg = f'{tmp}/seg{i:02d}.mp4'
    if not mine:
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-i', bp, '-t', str(dur), '-r', '30', '-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', seg]
    else:
        b = np.asarray(Image.open(bp).convert('RGB'), dtype=np.float32); w = np.asarray(Image.open(wp).convert('RGB'), dtype=np.float32)
        a = 1.0 - np.clip((w - b).mean(axis=2) / 255.0, 0, 1)
        col = np.where(a[..., None] > 0.003, b / np.maximum(a[..., None], 0.003), 0)
        rgba = np.dstack([np.clip(col, 0, 255), a * 255]).astype(np.uint8)
        layer = f'{tmp}/layer{i:02d}.png'; Image.fromarray(rgba, 'RGBA').save(layer)
        ins = ['-f', 'lavfi', '-i', f'color=black:s=1920x1080:r=30:d={dur}']
        filt, last = [], '[0:v]'
        for k, m in enumerate(mine, 1):
            ins += ['-i', m['path']]
            x, y, ww, hh = [int(round(v * PX)) for v in (m['x'], m['y'], m['w'], m['h'])]
            filt.append(f'[{k}:v]scale={ww}:{hh},setpts=PTS-STARTPTS[v{k}]')
            filt.append(f'{last}[v{k}]overlay={x}:{y}:eof_action=repeat[o{k}]'); last = f'[o{k}]'
        n = len(mine) + 1
        ins += ['-loop', '1', '-i', layer]
        filt.append(f'{last}[{n}:v]overlay=0:0,format=yuv420p[out]')
        cmd = ['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex', ';'.join(filt), '-map', '[out]', '-t', str(dur), '-r', '30',
               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', seg]
    subprocess.run(cmd, check=True); segs.append(seg)
    print('slide', i, 'media' if mine else '', dur)
open(f'{tmp}/list.txt', 'w').write(''.join(f"file '{s}'\n" for s in segs))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/list.txt', '-i', AUD, '-map', '0:v', '-map', '1:a',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', OUT], check=True)
print('wrote', OUT)
