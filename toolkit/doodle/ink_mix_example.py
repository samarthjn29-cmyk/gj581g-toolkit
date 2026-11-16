#!/usr/bin/env python3
"""Stanford_v1: lay the doodle ink layers and doodle cards (toolkit/doodle/cards/stanford.html) over a chapter mix,
with soft pencil scratches under the voice. usage: ink_mix.py <scene> [--final]   (720 draft by default; --final = 1080)
Ink layers: transparent VP9 .webm over 'hold' shots. Cards: full-frame .mp4 on the video's cream paper, hard cut in and out."""
import sys, os, subprocess, json, numpy as np, soundfile as sf
scene = sys.argv[1]; FINAL = '--final' in sys.argv
DOODLE = '/home/claude/toolkit/toolkit/doodle'; PAL = 'paper=%23EDE6D6&ink=%232B2B2B&red=%23E0782A&pencil=%237b776c'
# name, start, end, ink (transparent) or card, scratch times (main strokes)
LAYERS = {
 'opening':  [('coinInk', 26.9, 31.94, 1, [26.95, 27.15, 28.04, 28.8, 29.22])],
 'basement': [('refInk', 27.32, 31.06, 1, [28.34, 28.6, 29.32, 29.55, 30.2]),
              ('calendar', 64.86, 68.34, 0, [64.86, 65.66, 65.9, 66.2, 66.6, 67.14]),
              ('crowd', 68.34, 76.34, 0, [70.16, 70.86, 73.14, 73.54, 73.94, 74.52, 75.36])],
 'prisoner': [('stomachInk', 19.04, 22.52, 1, [19.06, 19.3, 20.22, 20.46, 21.2]),
              ('formInk', 27.27, 32.98, 1, [27.3, 28.92, 29.9, 30.64, 32.1]),
              ('pagesInk', 49.75, 54.58, 1, [52.46, 52.7, 52.95, 53.2, 53.62])],
}[scene]
os.makedirs('ink', exist_ok=True)
src = f'clips/S_{scene}.mp4' if FINAL else f'clips/S_{scene}_720_mix.mp4'
W, H = (1920, 1080) if FINAL else (1280, 720)
files = []
for name, a, b, ink, _ in LAYERS:
    out = f'ink/{name}.webm' if ink else f'ink/{name}.mp4'
    if not os.path.exists(out) or '--redo' in sys.argv:
        subprocess.run(['node', f'{DOODLE}/render.js', 'cards/stanford.html', f'card={name}&{PAL}' + ('&bg=none' if ink else ''), str(a if ink else a - 0.1), str(b if ink else b + 0.1), os.path.abspath(out)], cwd=DOODLE, check=True)   # cards get 0.1 s of handles so no frame of the picture under them shows at a cut (Stanford basement 1:08)
    files.append(out)
# pencil scratches: band-passed noise bursts, about -26 dBFS peak
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout)
sr = 48000; y = np.zeros(int(dur * sr) + sr, 'float32'); rng = np.random.default_rng(5)
from scipy.signal import butter, sosfilt
sos = butter(4, [1800, 6500], 'bandpass', fs=sr, output='sos')
for *_, ts in LAYERS:
    for t in ts:
        n = int(rng.uniform(.28, .42) * sr); z = sosfilt(sos, rng.standard_normal(n)).astype('float32')
        env = np.minimum(1, np.linspace(0, 8, n)) * np.exp(-np.linspace(0, 3.2, n)) * (0.6 + 0.4 * np.abs(np.sin(np.linspace(0, 30, n))))
        z *= env; z *= 10 ** (-26 / 20) / (np.abs(z).max() + 1e-9); i = int(t * sr); y[i:i + n] += z[:len(y) - i]
sf.write('ink/scratch.wav', y, sr)
cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src]
for f in files: cmd += (['-c:v', 'libvpx-vp9'] if f.endswith('.webm') else []) + ['-i', f]
cmd += ['-i', 'ink/scratch.wav']
fc, last = [], '0:v'
for i, ((name, a, b, ink, _), f) in enumerate(zip(LAYERS, files), 1):
    fc.append(f'[{i}:v]scale={W}:{H},setpts=PTS-STARTPTS+{a if ink else a - 0.1}/TB,format=yuva420p[l{i}]')
    fc.append(f"[{last}][l{i}]overlay=0:0:eof_action=pass:enable='between(t,{a},{b - 0.01 if ink else b + 0.05})'[v{i}]"); last = f'v{i}'
n = len(files) + 1
fc.append(f'[0:a][{n}:a]amix=inputs=2:normalize=0:duration=first[a]')
out = f'clips/S_{scene}_ink.mp4' if FINAL else f'clips/S_{scene}_720_ink.mp4'
cmd += ['-filter_complex', ';'.join(fc), '-map', f'[{last}]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18' if FINAL else '20', '-c:a', 'aac', '-b:a', '192k', out]
subprocess.run(cmd, check=True); print(out)
