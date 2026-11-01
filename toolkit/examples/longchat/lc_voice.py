#!/usr/bin/env python3
"""LongChat voice checks (same guard rails as Tokens v2.py, with project paths):
  lc_voice.py check N [N...]   transcribe tts/takes/N/VO-NN.mp3 with faster-whisper, word diff against the script
  lc_voice.py accept N [N...]  copy the take into tts/vo, merge durations, align words into tts/words.json"""
import json, os, re, subprocess, sys, shutil, difflib
T = '/home/claude/LongChat_v1'; PY = '/home/claude/cbx/bin/python3'
def slides(): S = json.load(open(f'{T}/story/slides.json')); return {int(d['n']): d for d in (S if isinstance(S, list) else S['slides'])}
def norm(w): return re.sub(r"[^a-z0-9'\-]", '', w.lower().replace('’', "'"))
NUM = {'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
       'fifteen': '15', 'twenty': '20', 'thirty': '30', 'forty': '40', 'fifty': '50', 'hundred': '100', 'thousand': '1000'}
def toks(s): return [NUM.get(x, x) for x in (norm(w) for w in s.replace('...', ' ').replace('-', ' ').split()) if x]
def transcribe(mp3):
    code = ("import subprocess,numpy as np\nfrom faster_whisper import WhisperModel\nm=WhisperModel('small.en',device='cpu',compute_type='int8')\n"
            f"raw=subprocess.run(['ffmpeg','-loglevel','error','-i','{mp3}','-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout\n"
            "a=np.frombuffer(raw,np.int16).astype(np.float32)/32768\nsegs,_=m.transcribe(a,language='en')\nprint('TRANSCRIPT:'+' '.join(s.text.strip() for s in segs))")
    r = subprocess.run([PY, '-c', code], capture_output=True, text=True)
    return next((l[11:] for l in r.stdout.splitlines() if l.startswith('TRANSCRIPT:')), '')
def check(ns):
    S = slides()
    for n in ns:
        got = transcribe(f'{T}/tts/takes/{n}/VO-{n:02d}.mp3'); a, b = toks(S[n]['vo_plain']), toks(got)
        diff = [f"  script: {' '.join(a[i1:i2]) or '-'} | heard: {' '.join(b[j1:j2]) or '-'}" for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if op != 'equal']
        print(f'VO-{n:02d}: ' + ('CLEAN' if not diff else f'{len(diff)} difference(s)')); print(f'  heard: {got}'); [print(l) for l in diff]
def accept(ns):
    os.makedirs(f'{T}/tts/vo', exist_ok=True); fp = f'{T}/tts/vo/durations.json'
    D = json.load(open(fp)) if os.path.exists(fp) else []
    for n in ns:
        d = f'{T}/tts/takes/{n}'; shutil.copy(f'{d}/VO-{n:02d}.mp3', f'{T}/tts/vo/VO-{n:02d}.mp3')
        D = [r for r in D if r[0] != n] + json.load(open(f'{d}/durations.json'))
    D.sort(); json.dump(D, open(fp, 'w'))
    subprocess.run([PY, f'{T}/tts_tools/align_whisper.py', f'{T}/story/slides.json', f'{T}/tts/vo', f'{T}/tts/words.json', *map(str, ns)], check=True)
if __name__ == '__main__':
    cmd, ns = sys.argv[1], [int(x) for x in sys.argv[2:]]
    {'check': check, 'accept': accept}[cmd](ns)
