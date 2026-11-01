#!/usr/bin/env python3
"""Tokens v2 pipeline with guard rails (written after the 1 Nov 2026 audit).

  v2.py voice N [N...]      hand-off -> clone scene N into tts/takes/<N>/ -> whisper transcript -> word diff vs the script
  v2.py accept N [N...]     copy the take into tts/vo2, merge durations, align words (never skipped again)
  v2.py lint [A|B|...]      every scene has word timings, every cue() word exists, fact-check rows match the script,
                            clips.json covers scenes 1..LAST exactly once
  v2.py clip X              lint -> timeline -> render -> assemble -> laptop copy (<30 MB) -> stage in outputs
  v2.py join                join the clips in clips.json order (per-clip trim), laptop copy, stage
  v2.py status              which clips are stale (a scene re-voiced after the clip was rendered)

Clips are defined ONCE in tts/clips.json: {"A": [1, 6], "B": [7, 14], ...}. Ranges must not overlap or leave gaps.
Chatterbox runs in the cbx venv (/home/claude/cbx/bin/python3); this script is plain python3.
"""
import json, os, re, subprocess, sys, shutil, difflib
T = '/home/claude/Tokens_v1'; R = f'{T}/Tokens_remotion'; PY = '/home/claude/cbx/bin/python3'
OUT = '/mnt/user-data/outputs'
sys.path.insert(0, f'{T}/tts_test')
CLIPS = json.load(open(f'{T}/tts/clips.json'))

def sh(cmd, **kw): return subprocess.run(cmd, shell=isinstance(cmd, str), check=True, **kw)
def slides(): S = json.load(open(f'{T}/story_v2/slides.json')); return S if isinstance(S, list) else S['slides']
def handoff(): sh(f'cd {T} && python3 /home/claude/toolkit/story/handoff.py project_v2.py story_v2 > /dev/null 2>&1')
def norm(w): return re.sub(r"[^a-z0-9'\-]", '', w.lower().replace('’', "'"))
NUM = {'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
       'twelve': '12', 'fourteen': '14', 'fifteen': '15', 'twenty': '20', 'thirty': '30', 'forty': '40', 'fifty': '50', 'hundred': '100', 'thousand': '1000'}
def toks(s): return [NUM.get(x, x) for x in (norm(w) for w in s.replace('...', ' ').split()) if x]

def transcribe(mp3):
    code = ("import subprocess,numpy as np,sys\nfrom faster_whisper import WhisperModel\nm=WhisperModel('small.en',device='cpu',compute_type='int8')\n"
            f"raw=subprocess.run(['ffmpeg','-loglevel','error','-i','{mp3}','-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout\n"
            "a=np.frombuffer(raw,np.int16).astype(np.float32)/32768\nsegs,_=m.transcribe(a,language='en')\nprint('TRANSCRIPT:'+' '.join(s.text.strip() for s in segs))")
    r = subprocess.run([PY, '-c', code], capture_output=True, text=True)
    return next((l[11:] for l in r.stdout.splitlines() if l.startswith('TRANSCRIPT:')), '')

def word_diff(expect, got):
    a, b = toks(expect), toks(got); out = []
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op != 'equal': out.append(f"  script: {' '.join(a[i1:i2]) or '-'}  |  heard: {' '.join(b[j1:j2]) or '-'}")
    return out

def voice(ns, seed=None):
    handoff(); S = {d['n']: d for d in slides()}
    for n in ns:
        d = f'{T}/tts/takes/{n}'; os.makedirs(d, exist_ok=True); env = dict(os.environ, SEED_OFFSET=str(seed or 0))
        subprocess.run([PY, f'{T}/tts_test/clone_all.py', f'{T}/story_v2/slides.json', f'{T}/voice_sample/ref_take2.wav', d, str(n)],
                       stdout=open(f'{d}/log.txt', 'w'), stderr=subprocess.STDOUT, env=env, check=True)
        line = [l for l in open(f'{d}/log.txt') if l.startswith(f'VO-{n:02d}')]; print(line[-1].strip() if line else f'VO-{n:02d}: no log line')
        got = transcribe(f'{d}/VO-{n:02d}.mp3'); diff = word_diff(S[n]['vo_plain'], got)
        print(f'VO-{n:02d} transcript: {got}')
        print(f'VO-{n:02d} diff vs script: ' + ('CLEAN' if not diff else f'{len(diff)} difference(s) - listen before accepting'))
        for l in diff: print(l)

def accept(ns):
    D = json.load(open(f'{T}/tts/vo2/durations.json'))
    for n in ns:
        d = f'{T}/tts/takes/{n}'; shutil.copy(f'{d}/VO-{n:02d}.mp3', f'{T}/tts/vo2/VO-{n:02d}.mp3')
        D = [r for r in D if r[0] != n] + json.load(open(f'{d}/durations.json'))
    D.sort(); json.dump(D, open(f'{T}/tts/vo2/durations.json', 'w'))
    sh([PY, f'{T}/tts_test/align_whisper.py', f'{T}/story_v2/slides.json', f'{T}/tts/vo2', f'{T}/tts/words_v2_raw.json', *map(str, ns)])
    plan = json.load(open(f'{T}/tts/vo2/plan.json')); plan['to_voice'] = sorted(set(plan['to_voice']) | set(ns)); json.dump(plan, open(f'{T}/tts/vo2/plan.json', 'w'), indent=1)
    print('accepted', ns, '-> stale clips:', stale())

def words_for_range(first, last):
    import v2_data_lib as L; return L.words(first, last)

def lint(clip=None):
    errs = []; S = slides(); N = len(S)
    ranges = {k: v for k, v in CLIPS.items() if not k.startswith('_')}
    cov = [n for a, b in ranges.values() for n in range(a, b + 1)]
    dup = sorted({n for n in cov if cov.count(n) > 1}); gap = sorted(set(range(1, N + 1)) - set(cov))
    if dup: errs.append(f'clips.json: scenes {dup} appear in two clips (they would play twice)')
    if gap: errs.append(f'clips.json: scenes {gap} are in no clip')
    import v2_data_lib as L
    first, last = ranges[clip] if clip else (1, N); W = L.words(first, last)
    plan = json.load(open(f'{T}/tts/vo2/plan.json')); raw = json.load(open(f'{T}/tts/words_v2_raw.json'))
    for n in range(first, last + 1):
        if str(n) not in plan['reused_from_v1'] and str(n) not in raw: errs.append(f'scene {n}: voiced for v2 but its words were never aligned - run v2.py accept {n}')
    src = open(f'{R}/src/scenes_custom.jsx').read() + open(f'{R}/src/scenes.jsx').read() if os.path.exists(f'{R}/src/scenes.jsx') else open(f'{R}/src/scenes_custom.jsx').read()
    cues = re.findall(r"cue(?:End)?\(\s*('?[0-9v]+'?)\s*,\s*'([^']+)'(?:\s*,\s*(\d+))?", src)
    for d in S[first - 1:last]:
        n = d['n']; key = L.WKEY[n]; ws = W.get(key)
        if not ws: errs.append(f'scene {n} ({d["name"]}): no word timings for key {key} - run v2.py accept {n}'); continue
        exp = toks(d['vo_plain']); got = [NUM.get(norm(w['w']), norm(w['w'])) for w in ws]
        if abs(len(exp) - len(got)) > max(3, len(exp) // 8): errs.append(f'scene {n}: word timings ({len(got)} words) do not match the script ({len(exp)} words) - re-voice or re-align')
        for ck, word, k in cues:
            if ck.strip("'") != key: continue
            k = int(k or 0); t = norm(word); hits = [w for w in ws if norm(w['w']) == t] or [w for w in ws if norm(w['w']).startswith(t)]
            if len(hits) <= k: errs.append(f'scene {n}: cue("{word}" #{k}) not in the spoken words of key {key} - the drawing cues a word the script no longer says')
    # fact-check rows must still match the script
    import csv
    rows = list(csv.DictReader(open(f'{T}/story_v2/Tokens_factcheck.csv')))
    text = ' '.join(d['vo_plain'] for d in S)
    for r in rows:
        if r.get('where') == 'narration' and r['text'] and r['text'] not in text:
            errs.append(f'fact-check row for scene {r.get("slide")} no longer matches the script: "{r["text"][:60]}" - update the CSV or re-check')
    print('LINT ' + ('OK' if not errs else f'{len(errs)} problem(s)')); [print('  -', e) for e in errs]
    return not errs

def stale():
    out = []
    for k, v in CLIPS.items():
        if k.startswith('_'): continue
        a, b = v
        f = f'{R}/out/Tokens_v2_clip{k}.mp4'
        if not os.path.exists(f): out.append(f'{k} (not rendered)'); continue
        if any(os.path.getmtime(f'{T}/tts/vo2/VO-{n:02d}.mp3') > os.path.getmtime(f) for n in range(a, b + 1)): out.append(f'{k} (voice changed since render)')
    return out

def lap_copy(src, dst):
    for crf in (22, 24, 26, 28, 30):
        sh(['ffmpeg', '-y', '-v', 'error', '-i', src, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', str(crf), '-c:a', 'aac', '-b:a', '128k', dst])
        if os.path.getsize(dst) < 30_000_000: return crf
    return None

def clip(k):
    a, b = CLIPS[k]
    if not lint(k): sys.exit('lint failed; nothing rendered')
    sh(f'cd {T} && python3 tts_test/v2_data.py {a} {b}')
    n = json.load(open(f'{R}/src/data/slides.json'))[-1]; frames = round((n['start'] + n['dur']) * 30) - 1
    sh(f'cd {R} && rm -f out/chunks/*.mp4 && npx remotion render src/index.jsx Video out/chunks/c_0-{frames}.mp4 --muted --props=\'{{"grain":false}}\' --codec=h264 --crf=17 --concurrency=2 --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome > out/render{k}.log 2>&1')
    sh(f'cd {R} && bash assemble.sh out/Tokens_v2_clip{k}.mp4 out/chunks/c_0-{frames}.mp4 | tail -1')
    crf = lap_copy(f'{R}/out/Tokens_v2_clip{k}.mp4', f'{R}/out/Tokens_v2_clip{k}_lap.mp4')
    for s in ('', '_lap'): shutil.copy(f'{R}/out/Tokens_v2_clip{k}{s}.mp4', f'{OUT}/Tokens_v2_clip{k}{s}.mp4')
    print(f'clip {k}: scenes {a}-{b}, laptop copy crf {crf}; staged in {OUT}')

def join():
    if not lint(): sys.exit('lint failed; nothing joined')
    st = stale()
    if st: sys.exit(f'stale clips, re-render first: {st}')
    trim = CLIPS.get('_trim_end', {}); lines = []
    for k in [k for k in CLIPS if not k.startswith('_')]:
        f = f'{R}/out/Tokens_v2_clip{k}.mp4'; lines.append(f"file '{f}'")
        if k in trim:
            dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
            lines.append(f'outpoint {dur - trim[k]:.3f}')
    open(f'{R}/out/full.txt', 'w').write('\n'.join(lines) + '\n')
    sh(f"cd {R}/out && ffmpeg -y -v error -f concat -safe 0 -i full.txt -c:v libx264 -preset medium -crf 19 -profile:v high -pix_fmt yuv420p -g 60 -c:a aac -b:a 192k -ar 48000 -movflags +faststart Tokens_v2_full.mp4")
    crf = lap_copy(f'{R}/out/Tokens_v2_full.mp4', f'{R}/out/Tokens_v2_full_lap.mp4')
    for s in ('', '_lap'): shutil.copy(f'{R}/out/Tokens_v2_full{s}.mp4', f'{OUT}/Tokens_v2_full{s}.mp4')
    print('joined', subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{R}/out/Tokens_v2_full.mp4'], capture_output=True, text=True).stdout.strip(), 's; laptop copy crf', crf)

if __name__ == '__main__':
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == 'voice':
        seed = int(args[args.index('--seed') + 1]) if '--seed' in args else None
        voice([int(a) for a in args if a.isdigit()], seed)
    elif cmd == 'accept': accept([int(a) for a in args])
    elif cmd == 'lint': lint(args[0] if args else None)
    elif cmd == 'clip': clip(args[0])
    elif cmd == 'join': join()
    elif cmd == 'status': print('stale:', stale() or 'none')
