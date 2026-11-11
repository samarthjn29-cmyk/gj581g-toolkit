#!/usr/bin/env python3
"""Re-render only the part of a chapter that changed and splice it into the existing clip (Sam, 11 Nov 2026:
workflow change 3). A one-shot fix takes a couple of minutes instead of a 25-35 min chapter render.

Usage: patch_render.py <scene> <what> [--final]
  <what> = shot ids (I2,I3), a card's text start ("card:Like pulling"), or seconds ("12.5-19")
  The range is widened to whole shots plus 0.5 s each side, so a dissolve in or out is re-rendered with it.
  Draft (default) patches clips/<PREFIX><scene>_720.mp4 at --scale=2/3; --final patches clips/<PREFIX><scene>.mp4.
env: PROJ, PREFIX, RM, PUB as in build_chapter.sh. Run build_chapter.sh <scene> --norender first, so timeline.json
     carries the change. Only the picture is replaced; the clip's own audio is kept frame-exact. Re-run the chapter
     mix (mix_bed.py) afterwards, because the _mix files are made from the clip.
Guards: the clip and the new timeline must have the same length (a timing change elsewhere means a full render);
        the spliced file must have exactly the original frame count."""
import json, os, sys, subprocess, re, shutil
a = sys.argv[1:]
if len(a) < 2: sys.exit(__doc__)
S, what, final = a[0], a[1], '--final' in a
PROJ = os.environ.get('PROJ') or sys.exit('set PROJ'); PREFIX = os.environ.get('PREFIX', 'Z_')
RM = os.environ.get('RM', '/home/claude/twice/remotion'); PUB = os.environ.get('PUB', os.path.basename(PROJ.rstrip('/')))
FPS = 30
T = json.load(open(f'{RM}/public/{PUB}/{S}/timeline.json'))
clip = f'{PROJ}/clips/{PREFIX}{S}.mp4' if final else f'{PROJ}/clips/{PREFIX}{S}_720.mp4'
probe = lambda f, e: subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_frames', '-show_entries', f'stream={e}', '-of', 'csv=p=0', f]).decode().strip().strip(',')
nfr = int(probe(clip, 'nb_read_frames')); want = max(30, round(T['dur'] * FPS))
if nfr != want: sys.exit(f'FAIL: clip has {nfr} frames, timeline wants {want}: timing changed, render the whole chapter')
if re.match(r'^[\d.]+-[\d.]+$', what): t0, t1 = map(float, what.split('-'))
elif what.startswith('card:'):
    c = next((c for c in T['cards'] if str(c.get('text', '')).startswith(what[5:])), None) or sys.exit('no such card')
    t0, t1 = c['t'], c['t'] + c.get('dur', 4.5)
else:
    ids = what.split(','); sh = [s for s in T['shots'] if s['id'] in ids]
    if len(sh) != len(ids): sys.exit(f'unknown shot id in {ids}')
    t0, t1 = min(s['t'] for s in sh), max(s['t'] + s['dur'] for s in sh)
f0 = max(0, int((t0 - 0.5) * FPS)); f1 = min(nfr - 1, int((t1 + 0.5) * FPS))
tmp = f'{PROJ}/clips/.patch_{S}.mp4'
cmd = ['npx', 'remotion', 'render', 'src/index_stills.jsx', 'Scene', tmp, f'--props=public/{PUB}/{S}/timeline.json', f'--frames={f0}-{f1}',
       '--concurrency=1', '--offthreadvideo-cache-size-in-bytes=400000000', '--offthreadvideo-video-threads=1', '--log=error']
if not final: cmd.append('--scale=0.66666666666666666')
print(f'rendering frames {f0}-{f1} ({(f1 - f0 + 1) / FPS:.1f} s of {nfr / FPS:.1f} s)', flush=True)
subprocess.run(cmd, cwd=RM, check=True)
pn = int(probe(tmp, 'nb_read_frames'))
if pn != f1 - f0 + 1: sys.exit(f'FAIL: patch has {pn} frames, expected {f1 - f0 + 1}')
out = clip + '.new.mp4'
fc = (f'[0:v]trim=end_frame={f0},setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];'
      f'[0:v]trim=start_frame={f1 + 1},setpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=1:a=0[v]') if f0 > 0 else \
     (f'[1:v]setpts=PTS-STARTPTS[b];[0:v]trim=start_frame={f1 + 1},setpts=PTS-STARTPTS[c];[b][c]concat=n=2:v=1:a=0[v]')
crf = '18' if final else '23'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', clip, '-i', tmp, '-filter_complex', fc, '-map', '[v]', '-map', '0:a', '-c:v', 'libx264',
                '-preset', 'veryfast', '-crf', crf, '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-r', str(FPS), out], check=True)
on = int(probe(out, 'nb_read_frames'))
if on != nfr: sys.exit(f'FAIL: spliced clip has {on} frames, original {nfr}; original kept')
shutil.move(out, clip); os.remove(tmp)
if final:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', clip, '-vf', 'scale=1280:720', '-c:v', 'libx264', '-crf', '26', '-preset', 'veryfast',
                    '-c:a', 'aac', '-b:a', '128k', f'{PROJ}/clips/{PREFIX}{S}_720.mp4'], check=True)
print(f'ok: {clip} patched ({on} frames). Now re-run the mix for {S}.')
