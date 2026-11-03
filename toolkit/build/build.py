#!/usr/bin/env python3
"""One-command, unattended build (2 Nov 2026): script -> Sam's clone voice -> word check -> timing -> pace lint -> mix -> render
-> frame check -> laptop copy. Built from the Raise pilot, where three crashes cost an hour:
  * Chatterbox + Whisper in one long process grows until the kernel kills it (exit 137): every line runs in its own process,
    and a crashed line is retried (up to 2 times) instead of stopping the build.
  * Voicing and rendering together run out of memory: stages run strictly one after another; the build refuses to start
    if another voice or render process is running.
  * Never `pkill -f <pattern>` from a shell whose own command line contains the pattern (it kills itself, exit 144).
Resumable: lines already passing the word check are skipped; `--from STAGE` restarts later; `--lines a1 b2` re-voices lines.

Usage: build.py project.json [--from voice|align|mix|listen|lint|render|check|deliver] [--to STAGE] [--only STAGE] [--lines ID ...]
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
STAGES = ['voice', 'align', 'mix', 'listen', 'lint', 'render', 'check', 'deliver']  # listen: the mixed narration as an MP3 for Sam's voice-only review (3 Nov 2026)  # mix before lint: the lint reads the fresh sfx cues

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
    if '--to' in a: todo = todo[:todo.index(a[a.index('--to') + 1]) + 1]  # e.g. --to listen: voice the whole script and stop at the MP3 for Sam
    takes = get('takes'); os.makedirs(takes, exist_ok=True)
    # Voice units (3 Nov 2026, Heckler from video 2): each scene is split at the Heckler's lines; her lines become units "H_<id>"
    # voiced in her own synthetic voice (tts/heckler_lines.py, played x1.3), the narrator's runs stay Sam's clone. Without heckler
    # lines every unit is just its scene, so older projects build exactly as before.
    def units(S):
        out, n, prev, cur = [], {}, None, None
        for l in S:
            if l.get('who') == 'heckler': u = 'H_' + l['id']
            else:
                if prev is None or prev['scene'] != l['scene'] or prev.get('who') == 'heckler':
                    n[l['scene']] = n.get(l['scene'], 0) + 1; cur = l['scene'] if n[l['scene']] == 1 else f"{l['scene']}_{n[l['scene']]}"
                u = cur
            out.append(dict(l, scene=u, scene0=l['scene'])); prev = l
        return out
    VS = units(S); vscript = f'{takes}/voice_script.json'; json.dump(VS, open(vscript, 'w'), indent=1)
    hecref = P.get('heckler_ref'); hecref = (hecref if os.path.isabs(hecref) else os.path.join(root, hecref)) if hecref else None
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
            ref = P['voice_ref'] if os.path.isabs(P['voice_ref']) else get('voice_ref')
            if os.path.isdir(ref):  # voice lint: phrasings the clone is known to garble (profile.json "hazards"); allow approved lines with "voice_lint_allow"
                r = subprocess.run([sys.executable, f'{TK}/story/voice_lint.py', get('script'), ref] + P.get('voice_lint_allow', []), capture_output=True, text=True); logf.write(r.stdout)
                for x in r.stdout.splitlines(): print(x)
                if r.returncode: mark(st, False, 'voice lint: rephrase the FAIL lines (see the log) or list approved ones in "voice_lint_allow"')
        if st == 'voice' and P.get('voice_mode') == 'kokoro':  # animatic: quick computer voice straight to vo + timing
            rc = run([sys.executable, f'{TK}/tts/kokoro_lines.py', get('script'), P.get('kokoro_voice', 'am_michael'), get('vo'), get('timing')],
                     env=dict(KOKORO_DIR=os.environ.get('KOKORO_DIR', '/home/claude/kokoro')))
            mark(st, rc == 0, 'kokoro animatic voice')
        elif st == 'voice' and P.get('voice_mode') == 'scene':  # one passage per scene (more natural; Sam 2 Nov 2026)
            lj = f'{takes}/log.json'; scenes = list(dict.fromkeys(l['scene'] for l in VS)); V = P.get('voice', {})
            if lines:  # a scene id re-voices all its units; a unit id (e.g. H_test2, shrink_2) just that one
                lines = [u for u in scenes if u in lines or next(l['scene0'] for l in VS if l['scene'] == u) in lines]
                L = json.load(open(lj)) if os.path.exists(lj) else {}
                for i in lines: L.pop(i, None)
                json.dump(L, open(lj, 'w'))
            for sc in scenes:
                L = json.load(open(lj)) if os.path.exists(lj) else {}
                if (lines and sc not in lines) or (not lines and L.get(sc, {}).get('ok')): continue  # --lines voices only those scenes (it re-voiced every CHECK scene too, 3 Nov)
                if sc.startswith('H_'):
                    if not hecref: mark(st, False, 'script has Heckler lines but project.json has no "heckler_ref"')
                    for attempt in range(3):
                        rc = run([PY, f'{TK}/tts/heckler_lines.py', vscript, hecref, takes, sc], env=dict(PYTHONUNBUFFERED='1', TQDM_DISABLE='1', SEED_OFFSET=str(attempt * 1000)))
                        if rc == 0: break
                    L = json.load(open(lj)) if os.path.exists(lj) else {}; r = L.get(sc, {})
                    log(f"heckler {sc}: {'pass' if r.get('ok') else 'CHECK'} words {r.get('words')} | {r.get('heard')}"); continue
                for attempt in range(6):  # parts resume after a memory kill, so more retries cost little
                    rc = run([PY, f'{TK}/tts/clone_scenes.py', vscript, P['voice_ref'] if os.path.isabs(P['voice_ref']) else get('voice_ref'), takes, sc],
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
            scn = P.get('voice_mode') == 'scene'
            hec = any(l.get('who') == 'heckler' for l in S); ref = P.get('voice_ref'); ref = (ref if os.path.isabs(ref) else get('voice_ref')) if ref else None
            nfx = json.load(open(f'{ref}/profile.json'))['settings'].get('post_fx', '') if hec and ref and os.path.exists(f'{ref}/profile.json') else ''
            rc = run([PY, f"{TK}/tts/{'assemble_scenes' if scn else 'assemble_lines'}.py", vscript if scn else get('script'), takes, get('vo'), get('timing')], env=dict(NARR_FX=nfx) if nfx else None)  # with a Heckler, the narrator's finish is applied per unit here, not in the mix
            if rc == 0 and scn:  # timing lines carry their real scene again (units were only for voicing)
                T = json.load(open(get('timing'))); T['lines'] = [dict(l, unit=l['scene'], scene=l.pop('scene0', l['scene'])) for l in T['lines']]; json.dump(T, open(get('timing'), 'w'), indent=1)
            if rc == 0 and P.get('remotion'): shutil.copy(get('timing'), os.path.join(get('remotion'), 'src/data/timing.json'))
            mark(st, rc == 0, f"total {json.load(open(get('timing')))['total']:.1f} s" if rc == 0 else '')
        elif st == 'lint':
            args = [sys.executable, f'{TK}/story/pace_lint.py', get('script'), get('timing')] + ([get('sfx')] if P.get('sfx') and os.path.exists(get('sfx')) else [])
            r = subprocess.run(args, capture_output=True, text=True); logf.write(r.stdout); print(r.stdout.strip().splitlines()[-1])
            mark(st, r.returncode == 0 or P.get('lint_soft', False), 'pace lint ' + ('clean' if r.returncode == 0 else 'has failures (lint_soft)' if P.get('lint_soft') else 'FAILED'))
        elif st == 'mix':
            ref = P.get('voice_ref'); ref = (ref if os.path.isabs(ref) else get('voice_ref')) if ref else None
            fx = json.load(open(f'{ref}/profile.json'))['settings'].get('post_fx', '') if ref and os.path.exists(f'{ref}/profile.json') and P.get('voice_mode') != 'kokoro' and not any(l.get('who') == 'heckler' for l in S) else ''  # with a Heckler the finish was applied to Sam's units in align
            rc = run([sys.executable, get('mix')] + ([get('music')] if P.get('music') else []), env=dict(VOICE_FX=fx) if fx else None)  # the profile's finishing filter (Sam picked option B, 3 Nov: a little deeper and warmer)
            mark(st, rc == 0, P.get('music', ''))
        elif st == 'listen':  # whole narration (voice finish applied) as an MP3: Sam approves the voice before any picture is rendered
            mp3 = os.path.splitext(get('out'))[0] + '_voice.mp3'; os.makedirs(os.path.dirname(mp3), exist_ok=True)
            rc = run(['ffmpeg', '-v', 'error', '-y', '-i', get('mix_out'), '-ac', '1', '-b:a', '128k', mp3])
            mark(st, rc == 0, mp3)
        elif st == 'render':
            silent = f'{root}/build/silent.mp4'
            rc = run(['npx', 'remotion', 'render', 'src/index.jsx', P['composition'], silent, '--codec=h264', '--crf=18', '--log=error'] + ([f"--scale={round(1080 * float(P['render_scale'])) / 1080!r}"] if P.get('render_scale') else []), cwd=get('remotion'))  # scale snapped so 1080*scale is a whole pixel (Remotion refuses 720.036)
            if rc == 0: rc = run(['ffmpeg', '-v', 'error', '-y', '-i', silent, '-i', get('mix_out'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', f'{root}/build/full.mp4'])  # no -shortest: the mix is padded to the timeline (a short mix cut the last line, clip A 2 Nov)
            mark(st, rc == 0)
        elif st == 'check':
            T = json.load(open(get('timing'))); full = f'{root}/build/full.mp4'; shutil.rmtree(f'{root}/build/frames', ignore_errors=True); os.makedirs(f'{root}/build/frames', exist_ok=True)  # no stale frames from an earlier build
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
            # every line's last word must be audible in the final file (loudnorm silently cut the last words of clips A-C, 3 Nov)
            import numpy as np
            pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', full, '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
            a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768; mute = []
            for l in T['lines']:
                w = (l.get('words') or [[None, l['end'] - 0.4, l['end']]])[-1]; seg = a[int(w[1] * 16000):int(max(w[2], w[1] + 0.1) * 16000)]
                if not len(seg) or 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9) < -45: mute.append(l['id'])
            if mute: rc = 1
            mark(st, rc == 0, (f'SILENT at the end of: {", ".join(mute)} (audio cut?); ' if mute else 'every line ends audibly; ') + f'{n} frames in build/frames_sheet.png; loudness {I} LUFS (look at the sheet before sending)')
        elif st == 'deliver':
            out = get('out'); os.makedirs(os.path.dirname(out), exist_ok=True); lim = P.get('laptop_mb', 30)
            for crf in (27, 30, 33):
                run(['ffmpeg', '-v', 'error', '-y', '-i', f'{root}/build/full.mp4', '-vf', 'scale=1280:720,hqdn3d=2:2:3:3', '-c:v', 'libx264', '-preset', 'medium', '-crf', str(crf), '-c:a', 'aac', '-b:a', '160k', out])
                if os.path.getsize(out) < lim * 1e6: break
            mark(st, os.path.getsize(out) < lim * 1e6, f'{out} ({os.path.getsize(out) / 1e6:.1f} MB)')
        log(f'     {st} took {time.time() - t0:.0f} s')
    log('BUILD DONE')

if __name__ == '__main__': main()
