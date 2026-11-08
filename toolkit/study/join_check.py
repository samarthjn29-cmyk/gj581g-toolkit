# Join check (8 Nov 2026): finds pops and jumps a viewer would see.
#  within a clip:   python3 join_check.py clip.mp4 [--spec scene.json] [--cuts 7.6,21.3]
#     flags every frame-to-frame change that spikes far above its neighbours and is not at a planned cut
#     (planned cuts = camera shots shorter than 0.05 s in the spec, plus --cuts)
#  between clips:   python3 join_check.py --pair a.mp4 b.mp4
#     compares a's last frame with b's first frame (a continuous join should differ only a little)
import sys, json, subprocess, numpy as np
W, H = 192, 108
def frames(path, last=False):
    args = ['ffmpeg', '-v', 'error'] + (['-sseof', '-0.2'] if last else []) + ['-i', path, '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-']
    raw = subprocess.run(args, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
def fps(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip()
    a, b = r.split(',')[0].split('/'); return float(a) / float(b)
a = sys.argv[1:]
if a[0] == '--pair':
    x, y = frames(a[1], last=True)[-1], frames(a[2])[0]; d = float(np.abs(x - y).mean())
    print(f'join {a[1]} -> {a[2]}: mean change {d:.1f} (continuous join < 12; a deliberate cut is fine if planned)'); sys.exit(0)
path, F = a[0], frames(a[0]); r = fps(path); cuts = []
if '--spec' in a:
    S = json.load(open(a[a.index('--spec') + 1])); cuts += [s['t0'] for s in S.get('camera', {}).get('shots', []) if isinstance(s.get('t0'), (int, float)) and s['t1'] - s['t0'] < 0.05]
if '--cuts' in a: cuts += [float(v) for v in a[a.index('--cuts') + 1].split(',')]
d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2)); bad = []
for i in range(len(d)):
    nb = np.concatenate([d[max(0, i - 6):i], d[i + 1:i + 7]]); base = float(np.median(nb)) if len(nb) else 0
    if d[i] > max(8.0, 5 * base + 3):
        t = (i + 1) / r
        if not any(abs(t - c) < 1.5 / r + 0.04 for c in cuts): bad.append((t, float(d[i]), base))
print(f'{path}: {len(d)} frame steps, planned cuts at {", ".join(f"{c:.2f}" for c in sorted(cuts)) or "none"}')
for t, v, b in bad: print(f'  POP  {t:6.2f} s  change {v:5.1f} (around it {b:4.1f})')
print(f'  {len(bad)} unplanned jumps'); sys.exit(1 if bad else 0)
