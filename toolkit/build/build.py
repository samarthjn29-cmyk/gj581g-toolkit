#!/usr/bin/env python3
"""One-command, unattended build (2 Nov 2026): script -> Sam's clone voice -> word check -> timing -> pace lint -> mix -> render
-> frame check -> laptop copy. Built from the Raise pilot, where three crashes cost an hour:
  * Chatterbox + Whisper in one long process grows until the kernel kills it (exit 137): every line runs in its own process,
    and a crashed line is retried (up to 2 times) instead of stopping the build.
  * Voicing and rendering together run out of memory: stages run strictly one after another; the build refuses to start
    if another voice or render process is running.
  * Never `pkill -f <pattern>` from a shell whose own command line contains the pattern (it kills itself, exit 144).
Resumable: lines already passing the word check are skipped; `--from STAGE` restarts later; `--lines a1 b2` re-voices lines.

Usage: build.py project.json [--from voice|align|mix|lint|render|check|deliver] [--only STAGE] [--lines ID ...]
  --lines takes SCENE ids in scene mode and LINE ids in line mode (re-voices only those).
Modes (project.json "voice_mode"): "kokoro" = animatic (Kokoro at natural speed, no fact-check needed; set "render_scale": 0.6667
for a 720p draft); "scene" = Sam's clone, one passage per scene (default for final clips); "line" = clone line by line (fixes only).
Fact-check gate (clone modes): "factcheck": "<csv>" whose every `verdict` is OK, or "factcheck_waiver": "<reason>" for a pilot whose
figures are labelled pending or already checked. Without either, the voice stage refuses to run the clone.
project.json (paths relative to the file):
  {"name": "Raise_v1_pilot", "script": "story/pilot_script.json", "voice_ref": ".../ref_take2_opener.wav",
   "voice": {"exag": 0.48, "cfg": 0.46}, "takes": "voice/linesA", "vo": "tts/vo.wav", "timing": "tts/timing.json",
   "voice_mode": "scene" (default "line"), "remotion": "remotion", "composition": "Pilot", "mix": "mix.py", "music": "media/Hitman.mp3", "sfx": "sfx_cues.json",
   "mix_out": "pilot_mix.wav", "out": "outputs/Raise_v1_pilot.mp4", "laptop_mb": 30}
Writes build/status.json (stage, time, result) and build/build.log; prints one line per stage."""
import json, os, sys, subprocess, time, shutil
TK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PY = os.environ.get('CBX_PY', '/home/claude/cbx/bin/python3')
STAGES = ['voice', 'align', 'mix', 'lint', 'render', 'check', 'deliver']  # mix before lint: the lint reads the fresh sfx cues

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
    busy = subprocess.run(['bash', '-c', "ps -eo args | grep -E '^[^ ]*python3 [^ ]*clone_(lines|scenes|all)\\.py|remotion render' | grep -v grep"], capture_output=True, text=True).stdout.strip()
    if busy: sys.exit(f'another voice or render job is running (memory):\n{busy}')
    S = json.load(open(get('script'))); ids = [l['id'] for l in S]
    todo = STAGES[STAGES.index(only):STAGES.index(only) + 1] if only else STAGES[STAGES.index(start):]
    takes = get('takes'); os.makedirs(takes, exist_ok=True)
    for st in todo:
        t0 = time.time(); log(f'---- {st}')
        if st == 'voice' and P.get('voice_mode', 'line') in ('scene', 'line'):  # fact-check gate before any clone voicing
            fc = P.get('factcheck'); waiver = P.get('factcheck_waiver')
            if fc:
                import csv
                rows = list(csv.DictReader(open(os.path.join(root, fc), newline='', encoding='utf-8')))
                bad = [r for r in rows if (r.get('verdict') or '').strip().upper() != 'OK']
                if bad: mark(st, False, f"fact-check: {len(bad)} of {len(rows)} rows not OK (e.g. row {bad[0].get('row', '?')}): no clone voicing")
                log(f'fact-check: all {len(rows)} rows OK')
            elif waiver: log(f'fact-check waived: {waiver}')
            else: mark(st, False, 'no "factcheck" csv and no "factcheck_waiver" in project.json: clone voicing refused (use voice_mode "kokoro" for the animatic)')
        if st == 'voice' and P.get('voice_mode') == 'kokoro':  # animatic: quick computer voice straight to vo + timing
            rc = run([sys.executable, f'{TK}/tts/kokoro_lines.py', get('script'), P.get('kokoro_voice', 'am_michael'), get('vo'), get('timing')],
                     env=dict(KOKORO_DIR=os.environ.get('KOKORO_DIR', '/home/claude/kokoro')))
            mark(st, rc == 0, 'kokoro animatic voice')
        elif st == 'voice' and P.get('voice_mode') == 'scene':  # one passage per scene (more natural; Sam 2 Nov 2026)
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
                             env=dict(PYTHONUNBUFFERED='1', TQDM_DISABLE='1', SEED_OFFSET=str(attempt * 1000 + int(os.environ.get('SEED_OFFSET', '0'))),
                                      **{k: str(V[v]) for k, v in (('EXAG', 'exag'), ('CFG', 'cfg'), ('TEMP', 'temp')) if v in V}))
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
        elif st == 'align' and P.get('voice_mode') == 'kokoro':  # timing already written by kokoro_lines.py
            if P.get('remotion'): shutil.copy(get('timing'), os.path.join(get('remotion'), 'src/data/timing.json'))
            mark(st, True, f"total {json.load(open(get('timing')))['total']:.1f} s (kokoro)")
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
            rc = run(['npx', 'remotion', 'render', 'src/index.jsx', P['composition'], silent, '--codec=h264', '--crf=18', '--log=error'] + ([f"--scale={round(1080 * float(P['render_scale'])) / 1080!r}"] if P.get('render_scale') else []), cwd=get('remotion'))  # scale snapped so 1080*scale is a whole pixel (Remotion refuses 720.036)
            if rc == 0: rc = run(['ffmpeg', '-v', 'error', '-y', '-i', silent, '-i', get('mix_out'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', f'{root}/build/full.mp4'])
            mark(st, rc == 0)
        elif st == 'check':
            T = json.load(open(get('timing'))); full = f'{root}/build/full.mp4'; os.makedirs(f'{root}/build/frames', exist_ok=True)
            pts = sorted({l['end'] - 0.1 for l in T['lines'] if l['id'] in P.get('check_lines', ids[::max(1, len(ids) // 8)])})
            for k, t in enumerate(pts): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', full, '-frames:v', '1', '-vf', 'scale=640:-1', f'{root}/build/frames/f{k:02d}.png'])
            n = len(pts); rc = 0
            if n:  # tile with Pillow (the ffmpeg hstack graph broke on a short last row)
                from PIL import Image
                ims = [Image.open(f'{root}/build/frames/f{k:02d}.png') for k in range(n)]; w, h = ims[0].size; cols = 4; rows = (n + cols - 1) // cols
                sheet = Image.new('RGB', (w * cols, h * rows), 'white')
                for k, im in enumerate(ims): sheet.paste(im, ((k % cols) * w, (k // cols) * h))
                sheet.save(f'{root}/build/frames_sheet.png')
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
