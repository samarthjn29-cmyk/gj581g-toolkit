#!/usr/bin/env python3
"""One-command, unattended build (2 Nov 2026): script -> Sam's clone voice -> word check -> timing -> pace lint -> mix -> render
-> frame check -> laptop copy. Built from the Raise pilot, where three crashes cost an hour:
  * Chatterbox + Whisper in one long process grows until the kernel kills it (exit 137): every line runs in its own process,
    and a crashed line is retried (up to 2 times) instead of stopping the build.
  * Voicing and rendering together run out of memory: stages run strictly one after another; the build refuses to start
    if another voice or render process is running.
  * Never `pkill -f <pattern>` from a shell whose own command line contains the pattern (it kills itself, exit 144).
Resumable: lines already passing the word check are skipped; `--from STAGE` restarts later; `--lines a1 b2` re-voices lines.

Usage: build.py project.json [--from voice|align|lint|mix|render|check|deliver] [--only STAGE] [--lines ID ...]
project.json (paths relative to the file):
  {"name": "Raise_v1_pilot", "script": "story/pilot_script.json", "voice_ref": ".../ref_take2_opener.wav",
   "voice": {"exag": 0.48, "cfg": 0.46}, "takes": "voice/linesA", "vo": "tts/vo.wav", "timing": "tts/timing.json",
   "voice_mode": "scene" (default "line"), "remotion": "remotion", "composition": "Pilot", "mix": "mix.py", "music": "media/Hitman.mp3", "sfx": "sfx_cues.json",
   "mix_out": "pilot_mix.wav", "out": "outputs/Raise_v1_pilot.mp4", "laptop_mb": 30}
Writes build/status.json (stage, time, result) and build/build.log; prints one line per stage."""
import json, os, sys, subprocess, time, shutil
TK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PY = os.environ.get('CBX_PY', '/home/claude/cbx/bin/python3')
STAGES = ['voice', 'align', 'lint', 'mix', 'render', 'check', 'deliver']

def main():
    a = sys.argv[1:]; pj = os.path.abspath(a[0]); root = os.path.dirname(pj); P = json.load(open(pj))
    get = lambda k: os.path.join(root, P[k])
    start = a[a.index('--from') + 1] if '--from' in a else 'voice'
    only = a[a.index('--only') + 1] if '--only' in a else None
    lines = a[a.index('--lines') + 1:] if '--lines' in a else []
    os.makedirs(f'{root}/build', exist_ok=True); logf = open(f'{root}/build/build.log', 'a')
    stj = f'{root}/build/status.json'; status = json.load(open(stj)) if os.path.exists(stj) else {}
    def log(msg):
        line = f"{time.strftime('%H:%M:%S')} {msg}"; print(line, flush=True); logf.write(line + '\n'); logf.flush()
    def run(cmd, env=None, cwd=None):
        r = subprocess.run(cmd, cwd=cwd or root, env=dict(os.environ, **(env or {})), stdout=logf, stderr=subprocess.STDOUT)
        return r.returncode
    def mark(stage, ok, note=''):
        status[stage] = dict(ok=ok, at=time.strftime('%Y-%m-%d %H:%M:%S'), note=note); json.dump(status, open(stj, 'w'), indent=1)
        log(f"{'OK  ' if ok else 'FAIL'} {stage} {note}")
        if not ok: sys.exit(f'build stopped at {stage}: see build/build.log')
    busy = subprocess.run(['bash', '-c', "ps -eo args | grep -E '^[^ ]*python3 [^ ]*clone_(lines|all)\\.py|remotion render' | grep -v grep"], capture_output=True, text=True).stdout.strip()
    if busy: sys.exit(f'another voice or render job is running (memory):\n{busy}')
    S = json.load(open(get('script'))); ids = [l['id'] for l in S]
    todo = STAGES[STAGES.index(only):STAGES.index(only) + 1] if only else STAGES[STAGES.index(start):]
    takes = get('takes'); os.makedirs(takes, exist_ok=True)
    for st in todo:
        t0 = time.time(); log(f'---- {st}')
        if st == 'voice' and P.get('voice_mode') == 'scene':  # one passage per scene (more natural; Sam 2 Nov 2026)
            lj = f'{takes}/log.json'; scenes = list(dict.fromkeys(l['scene'] for l in S)); V = P.get('voice', {})
            if lines:
                L = json.load(open(lj)) if os.path.exists(lj) else {}
                for i in lines: L.pop(i, None)
                json.dump(L, open(lj, 'w'))
            for sc in scenes:
                L = json.load(open(lj)) if os.path.exists(lj) else {}
                if L.get(sc, {}).get('ok') and sc not in lines: continue
                for attempt in range(3):
                    rc = run([PY, f'{TK}/tts/clone_scenes.py', get('script'), P['voice_ref'] if os.path.isabs(P['voice_ref']) else get('voice_ref'), takes, sc],
                             env=dict(PYTHONUNBUFFERED='1', TQDM_DISABLE='1', EXAG=str(V.get('exag', 0.5)), CFG=str(V.get('cfg', 0.5)), TEMP=str(V.get('temp', 0.8)),
                                      SEED_OFFSET=str(attempt * 1000)))
                    if rc == 0: break
                    log(f'scene {sc}: voice process exited {rc}, retry {attempt + 1}')
                L = json.load(open(lj)) if os.path.exists(lj) else {}; r = L.get(sc, {})
                log(f"scene {sc}: {'pass' if r.get('ok') else 'CHECK'} words {r.get('words')} sim {r.get('sim')} | {r.get('heard')}")
            L = json.load(open(lj)); bad = [sc for sc in scenes if not L.get(sc, {}).get('ok')]
            missing = [sc for sc in scenes if not os.path.exists(f'{takes}/{sc}.wav')]
            mark(st, not missing, f"{len(scenes) - len(bad)}/{len(scenes)} scenes pass" + (f"; to listen to: {', '.join(bad)}" if bad else ''))
        elif st == 'voice':
            lj = f'{takes}/log.json'
            if lines:  # forced re-voice: drop their pass mark
                L = json.load(open(lj)) if os.path.exists(lj) else {}
                for i in lines: L.pop(i, None)
                json.dump(L, open(lj, 'w'))
            for i in ids:
                L = json.load(open(lj)) if os.path.exists(lj) else {}
                if L.get(i, {}).get('ok') and i not in lines: continue
                for attempt in range(3):
                    rc = run([PY, f'{TK}/tts/clone_lines.py', get('script'), P['voice_ref'] if os.path.isabs(P['voice_ref']) else get('voice_ref'), takes, i],
                             env=dict(PYTHONUNBUFFERED='1', TQDM_DISABLE='1', EXAG=str(P.get('voice', {}).get('exag', 0.48)), CFG=str(P.get('voice', {}).get('cfg', 0.46)),
                                      SEED_OFFSET=str(attempt * 1000)))
                    if rc == 0: break
                    log(f'line {i}: voice process exited {rc}, retry {attempt + 1}')
                L = json.load(open(lj)) if os.path.exists(lj) else {}; r = L.get(i, {})
                log(f"line {i}: {'pass' if r.get('ok') else 'CHECK'} words {r.get('words')} sim {r.get('sim')} | {r.get('heard')}")
            L = json.load(open(lj)); bad = [i for i in ids if not L.get(i, {}).get('ok')]
            missing = [i for i in ids if not os.path.exists(f'{takes}/{i}.wav')]
            mark(st, not missing, f"{len(ids) - len(bad)}/{len(ids)} lines pass the word check" + (f"; to listen to: {', '.join(bad)}" if bad else ''))
        elif st == 'align':
            rc = run([PY, f"{TK}/tts/{'assemble_scenes' if P.get('voice_mode') == 'scene' else 'assemble_lines'}.py", get('script'), takes, get('vo'), get('timing')])
            if rc == 0 and P.get('remotion'): shutil.copy(get('timing'), os.path.join(get('remotion'), 'src/data/timing.json'))
            mark(st, rc == 0, f"total {json.load(open(get('timing')))['total']:.1f} s" if rc == 0 else '')
        elif st == 'lint':
            args = [sys.executable, f'{TK}/story/pace_lint.py', get('script'), get('timing')] + ([get('sfx')] if P.get('sfx') and os.path.exists(get('sfx')) else [])
            r = subprocess.run(args, capture_output=True, text=True); logf.write(r.stdout); print(r.stdout.strip().splitlines()[-1])
            mark(st, r.returncode == 0 or P.get('lint_soft', False), 'pace lint ' + ('clean' if r.returncode == 0 else 'has failures (lint_soft)' if P.get('lint_soft') else 'FAILED'))
        elif st == 'mix':
            rc = run([sys.executable, get('mix')] + ([get('music')] if P.get('music') else []))
            mark(st, rc == 0, P.get('music', ''))
        elif st == 'render':
            silent = f'{root}/build/silent.mp4'
            rc = run(['npx', 'remotion', 'render', 'src/index.jsx', P['composition'], silent, '--codec=h264', '--crf=18', '--log=error'], cwd=get('remotion'))
            if rc == 0: rc = run(['ffmpeg', '-v', 'error', '-y', '-i', silent, '-i', get('mix_out'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', f'{root}/build/full.mp4'])
            mark(st, rc == 0)
        elif st == 'check':
            T = json.load(open(get('timing'))); full = f'{root}/build/full.mp4'; os.makedirs(f'{root}/build/frames', exist_ok=True)
            pts = sorted({l['end'] - 0.1 for l in T['lines'] if l['id'] in P.get('check_lines', ids[::max(1, len(ids) // 8)])})
            for k, t in enumerate(pts): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', full, '-frames:v', '1', '-vf', 'scale=640:-1', f'{root}/build/frames/f{k:02d}.png'])
            n = len(pts); cols = 4; rows = (n + cols - 1) // cols
            ins = sum([['-i', f'{root}/build/frames/f{k:02d}.png'] for k in range(n)], [])
            pad = ''.join(f'[{k}]' for k in range(n)) + ''.join('color=c=black:s=640x360:d=1[e%d];' % k for k in range(0))
            fc = ';'.join(f"{''.join(f'[{r * cols + c}]' for c in range(cols) if r * cols + c < n)}hstack=inputs={min(cols, n - r * cols)}[r{r}]" if min(cols, n - r * cols) > 1 else f'[{r * cols}]null[r{r}]' for r in range(rows))
            fc += ';' + ''.join(f'[r{r}]' for r in range(rows)) + (f'vstack=inputs={rows}[o]' if rows > 1 else 'null[o]')
            rc = subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', fc, '-map', '[o]', f'{root}/build/frames_sheet.png']).returncode if n else 0
            lu = subprocess.run(['ffmpeg', '-i', full, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
            I = next((x.split()[1] for x in reversed(lu.splitlines()) if x.strip().startswith('I:')), '?')
            mark(st, rc == 0, f'{n} frames in build/frames_sheet.png; loudness {I} LUFS (look at the sheet before sending)')
        elif st == 'deliver':
            out = get('out'); os.makedirs(os.path.dirname(out), exist_ok=True); lim = P.get('laptop_mb', 30)
            for crf in (27, 30, 33):
                run(['ffmpeg', '-v', 'error', '-y', '-i', f'{root}/build/full.mp4', '-vf', 'scale=1280:720,hqdn3d=2:2:3:3', '-c:v', 'libx264', '-preset', 'medium', '-crf', str(crf), '-c:a', 'aac', '-b:a', '160k', out])
                if os.path.getsize(out) < lim * 1e6: break
            mark(st, os.path.getsize(out) < lim * 1e6, f'{out} ({os.path.getsize(out) / 1e6:.1f} MB)')
        log(f'     {st} took {time.time() - t0:.0f} s')
    log('BUILD DONE')

if __name__ == '__main__': main()
