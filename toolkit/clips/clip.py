#!/usr/bin/env python3
"""GJ 581g clip workflow for any project (toolkit 2.3, generalised from LongChat, 2 Nov 2026).

Run from the project folder (or pass --project DIR first). Reads project.json:
  {"prefix": "LongChat", "version": "v1", "remotion": "LongChat_remotion", "slides": "story/slides.json",
   "voice_ref": "voice_sample/ref_take2.wav", "scenes": "LongChat_remotion/src/scenes_custom.jsx",
   "music": [[1, "media/music/Investigations.mp3", 0.0], [12, "media/music/Thinking Music.mp3", 0.0]]}
and tts/clips.json: {"A": [1, 5], "B": [6, 9], ...} (no gaps, no overlaps).

  clip.py voice N [N...]   clone scenes into tts/takes/<N>/ (never while a render runs: out of memory)
  clip.py check N [N...]   whisper transcript + word diff against the script (re-roll meaning-changing mishearings: SEED_OFFSET=<k>)
  clip.py accept N [N...]  copy takes into tts/vo, merge durations, align words into tts/words.json
  clip.py lint             cue lint + scene lint (both must be clean)
  clip.py data FIRST LAST  slides/words for Remotion + narration mixed with the music (one gain per track, ducked, continuous across clips)
  clip.py clip X           lint -> data -> render -> grain + audio -> laptop copy (<30 MB) -> outputs
  clip.py join             join all clips in clips.json order (video copied, audio re-joined) + laptop copy
  clip.py srt              YouTube captions for the whole video
"""
import json, os, re, subprocess, sys, shutil, difflib
TK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # toolkit/
PY = os.environ.get('CBX_PY', '/home/claude/cbx/bin/python3')            # Chatterbox venv
CHROME = os.environ.get('CHROME', '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome')
OUT = '/mnt/user-data/outputs'
args = sys.argv[1:]
if args[:1] == ['--project']: os.chdir(args[1]); args = args[2:]
P = json.load(open('project.json')); T = os.getcwd(); R = os.path.join(T, P['remotion'])
NAME = f"{P['prefix']}_{P.get('version', 'v1')}"
def sh(cmd): subprocess.run(cmd, shell=True, check=True)
def slides(): S = json.load(open(P['slides'])); return S if isinstance(S, list) else S['slides']
def clips(): return {k: v for k, v in json.load(open('tts/clips.json')).items() if not k.startswith('_')}
def mp3(n): return f'{T}/tts/vo/VO-{n:02d}.mp3'
def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)

# ---------------------------------------------------------------- voice
def voice(ns):
    if subprocess.run(['pgrep', '-f', 'remotion render'], capture_output=True).returncode == 0: sys.exit('A render is running: voice after it finishes (memory).')
    tmp = 'tts/takes/_batch'; shutil.rmtree(tmp, ignore_errors=True)
    sh(f'{PY} {TK}/tts/clone_all.py {P["slides"]} {P["voice_ref"]} {tmp} {" ".join(map(str, ns))}')
    D = json.load(open(f'{tmp}/durations.json'))
    for n in ns:
        d = f'tts/takes/{n}'; os.makedirs(d, exist_ok=True); shutil.copy(f'{tmp}/VO-{n:02d}.mp3', f'{d}/VO-{n:02d}.mp3')
        json.dump([r for r in D if r[0] == n], open(f'{d}/durations.json', 'w'))
    check(ns)
def norm(w): return re.sub(r"[^a-z0-9'\-]", '', w.lower().replace('’', "'"))
NUM = {'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
       'twelve': '12', 'fifteen': '15', 'twenty': '20', 'thirty': '30', 'forty': '40', 'fifty': '50', 'hundred': '100', 'thousand': '1000'}
def toks(s): return [NUM.get(x, x) for x in (norm(w) for w in re.sub(r'\{viewer:|\}', ' ', s).replace('...', ' ').replace('-', ' ').split()) if x]
def transcribe(path):
    code = ("import subprocess,numpy as np\nfrom faster_whisper import WhisperModel\nm=WhisperModel('small.en',device='cpu',compute_type='int8')\n"
            f"raw=subprocess.run(['ffmpeg','-loglevel','error','-i',{path!r},'-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout\n"
            "a=np.frombuffer(raw,np.int16).astype(np.float32)/32768\nsegs,_=m.transcribe(a,language='en')\nprint('TRANSCRIPT:'+' '.join(s.text.strip() for s in segs))")
    r = subprocess.run([PY, '-c', code], capture_output=True, text=True)
    return next((l[11:] for l in r.stdout.splitlines() if l.startswith('TRANSCRIPT:')), '')
def check(ns):
    S = {int(d['n']): d for d in slides()}
    for n in ns:
        got = transcribe(f'{T}/tts/takes/{n}/VO-{n:02d}.mp3'); a, b = toks(S[n]['vo_plain']), toks(got)
        diff = [f"  script: {' '.join(a[i1:i2]) or '-'} | heard: {' '.join(b[j1:j2]) or '-'}" for op, i1, i2, j1, j2 in
                difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if op != 'equal']
        print(f'VO-{n:02d}: ' + ('CLEAN' if not diff else f'{len(diff)} difference(s): re-roll any that change the meaning')); print(f'  heard: {got}'); [print(l) for l in diff]
def accept(ns):
    os.makedirs('tts/vo', exist_ok=True); fp = 'tts/vo/durations.json'; D = json.load(open(fp)) if os.path.exists(fp) else []
    for n in ns:
        d = f'tts/takes/{n}'; shutil.copy(f'{d}/VO-{n:02d}.mp3', mp3(n)); D = [r for r in D if r[0] != n] + json.load(open(f'{d}/durations.json'))
    D.sort(); json.dump(D, open(fp, 'w'))
    sh(f'{PY} {TK}/tts/align_whisper.py {P["slides"]} tts/vo tts/words.json {" ".join(map(str, ns))}')

# ---------------------------------------------------------------- lint
def lint():
    a = subprocess.run(['python3', f'{TK}/story/cue_lint.py', P['scenes'], P['slides']], capture_output=True, text=True).stdout
    b = subprocess.run(['python3', f'{TK}/story/scene_lint.py', P['scenes']], capture_output=True, text=True).stdout
    print(a + b, end='')
    if 'clean' not in a.splitlines()[-1] or 'clean' not in b.splitlines()[-1]: sys.exit('LINT FAILED: fix before rendering.')

# ---------------------------------------------------------------- data + music
def lufs(p):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[0-9.]+) LUFS', r)[-1])
def data(FIRST, LAST):
    S = slides(); out, t = [], 0.0
    for d in S[FIRST - 1:LAST]:
        d = dict(d); n = int(d['n']); d['n'] = n; d['dur'] = round(dur(mp3(n)) + 0.35 + float(d.get('hold') or 0), 2); d['start'] = round(t, 2); t += d['dur']; out.append(d)
        os.makedirs(f'{R}/public/vo', exist_ok=True); shutil.copy(mp3(n), f'{R}/public/vo/VO-{n:02d}.mp3')
    json.dump(out, open(f'{R}/src/data/slides.json', 'w')); shutil.copy('tts/words.json', f'{R}/src/data/words.json')
    ins = sum([['-i', mp3(d['n'])] for d in out], [])
    fl = ';'.join(f"[{i}:a]aresample=48000,adelay={int((d['start'] + 0.2) * 1000)}:all=1[a{i}]" for i, d in enumerate(out))
    fl += ';' + ''.join(f'[a{i}]' for i in range(len(out))) + f'amix=inputs={len(out)}:normalize=0,apad,atrim=0:{t:.3f},loudnorm=I=-16:TP=-1.5:LRA=11[o]'
    os.makedirs(f'{R}/out', exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', fl, '-map', '[o]', '-ac', '1', '-ar', '48000', f'{R}/out/voice.wav'], check=True)
    M = [(a, os.path.join(T, p), o) for a, p, o in P.get('music', [])]
    if not M: shutil.copy(f'{R}/out/voice.wav', f'{R}/out/narration.wav'); return t
    starts = {d['n']: d['start'] for d in out}; G, g = {}, 0.0
    for d in S[:LAST]: n = int(d['n']); G[n] = g; g += dur(mp3(n)) + 0.35 + float(d.get('hold') or 0)
    cues = [(a, p, o) for i, (a, p, o) in enumerate(M) if a <= LAST and (i + 1 == len(M) or M[i + 1][0] > FIRST)]
    segs = []
    for i, (a, p, o) in enumerate(cues):
        s0 = starts.get(a, 0.0) if a >= FIRST else 0.0; nxt = [starts[b] for b, _, _ in cues[i + 1:] if b in starts]; s1 = nxt[0] if nxt else t
        if s1 > s0: segs.append((s0, s1, p, o + (0 if a >= FIRST else G[FIRST] - G[a]), a >= FIRST, bool(nxt)))
    mins, mfl = [], []
    for i, (s0, s1, p, o, fin, fout) in enumerate(segs):
        L = s1 - s0 + (1.5 if fout else 0.0); mins += ['-stream_loop', '-1', '-i', p]
        fx = f"[{i}:a]aresample=48000,atrim={o:.3f}:{o + L:.3f},asetpts=PTS-STARTPTS,volume={-27.0 - lufs(p):.2f}dB"
        if fin: fx += ',afade=t=in:d=1.5'
        if fout: fx += f',afade=t=out:st={L - 1.5:.3f}:d=1.5'
        mfl.append(fx + f",adelay={int(s0 * 1000)}:all=1[m{i}]")
    mfl.append(''.join(f'[m{i}]' for i in range(len(segs))) + f'amix=inputs={len(segs)}:normalize=0,apad,atrim=0:{t:.3f}[bed]')
    mfl.append(f"[{len(segs)}:a]asplit=2[v1][v2];[bed][v1]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=500[duck];[v2][duck]amix=inputs=2:normalize=0,alimiter=limit=0.8:level=false[o]")
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *mins, '-i', f'{R}/out/voice.wav', '-filter_complex', ';'.join(mfl), '-map', '[o]', '-ac', '2', '-ar', '48000', f'{R}/out/narration.wav'], check=True)
    print('scenes', [(d['n'], d['start'], d['dur']) for d in out], 'total', round(t, 2)); return t

# ---------------------------------------------------------------- render, join, captions
def lap_copy(src, dst, limit=30e6):
    for crf in (24, 27, 30, 33):
        sh(f'ffmpeg -v error -y -i "{src}" -c:v libx264 -preset veryfast -crf {crf} -c:a aac -b:a 128k -movflags +faststart "{dst}"')
        if os.path.getsize(dst) < limit: return crf
def clip(k):
    lint(); a, b = clips()[k]; data(a, b)
    sh(f'cd {R} && rm -rf out/chunks && mkdir -p out/chunks && npx remotion render src/index.jsx Video out/chunks/c_0.mp4 --props=\'{{"grain":false}}\' --muted --concurrency=2 '
       f'--offthreadvideo-cache-size-in-bytes=400000000 --browser-executable={CHROME} --log=error > out/render.log 2>&1')
    f = f'{R}/out/{NAME}_clip{k}.mp4'; sh(f'cd {R} && bash assemble.sh "{f}" out/chunks/c_0.mp4')
    lap_copy(f, f.replace('.mp4', '_lap.mp4')); os.makedirs(OUT, exist_ok=True)
    for s in ('', '_lap'): shutil.copy(f.replace('.mp4', f'{s}.mp4'), OUT)
    print('DONE', k)
def join():
    ks = list(clips()); fs = [f'{R}/out/{NAME}_clip{k}.mp4' for k in ks]; o = f'{R}/out'
    open(f'{o}/join.txt', 'w').write(''.join(f"file '{x}'\n" for x in fs))
    sh(f'cd {o} && ffmpeg -v error -y -f concat -safe 0 -i join.txt -an -c:v copy v_all.mp4')
    ins = ' '.join(f'-i "{x}"' for x in fs); cc = ''.join(f'[{i}:a]' for i in range(len(fs)))
    sh(f'cd {o} && ffmpeg -v error -y {ins} -filter_complex "{cc}concat=n={len(fs)}:v=0:a=1[a]" -map "[a]" -c:a pcm_s16le a_all.wav')
    full = f'{o}/{NAME}_full.mp4'; sh(f'cd {o} && ffmpeg -v error -y -i v_all.mp4 -i a_all.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "{full}"')
    lap_copy(full, full.replace('_full', '_lap'))
    for x in (full, full.replace('_full', '_lap')): shutil.copy(x, OUT)
    print('JOINED', round(dur(full), 2), 's')
def srt():
    data(1, len(slides())); sh(f'cd {R} && python3 {TK}/remotion/make_srt.py out/{P["prefix"]}_captions.srt'); shutil.copy(f'{R}/out/{P["prefix"]}_captions.srt', OUT)

if __name__ == '__main__':
    cmd, rest = args[0], args[1:]
    if cmd == 'voice': voice([int(x) for x in rest])
    elif cmd == 'check': check([int(x) for x in rest])
    elif cmd == 'accept': accept([int(x) for x in rest])
    elif cmd == 'lint': lint()
    elif cmd == 'data': data(int(rest[0]), int(rest[1]))
    elif cmd == 'clip': clip(rest[0])
    elif cmd == 'join': join()
    elif cmd == 'srt': srt()
    else: sys.exit(__doc__)
