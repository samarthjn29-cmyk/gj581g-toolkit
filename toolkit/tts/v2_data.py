"""Tokens v2: build Tokens_remotion/src/data/{slides,words}.json for a range of v2 scenes, copy their clips, mix narration.
Each v2 scene names its drawing (comp) and its word-timing key (wkey): reused drawings keep their v1 number, new ones are 'v<n>'.
Word timings: tts/words_v2_raw.json (aligned by v2 scene number, from align_whisper.py) override tts/words_all.json (v1).
Usage: v2_data.py FIRST LAST"""
import json, sys, shutil, subprocess, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
FIRST, LAST = int(sys.argv[1]), int(sys.argv[2])
R, T = '/home/claude/Tokens_v1/Tokens_remotion', '/home/claude/Tokens_v1'
from v2_data_lib import MAP, WKEY, words
S = json.load(open(f'{T}/story_v2/slides.json')); S = S if isinstance(S, list) else S['slides']
W = words()
dur = lambda n: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{T}/tts/vo2/VO-{n:02d}.mp3'], capture_output=True, text=True).stdout)
out, t = [], 0.0
for d in S[FIRST - 1:LAST]:
    d = dict(d); n = d['n']; d['comp'] = MAP[n]; d['wkey'] = WKEY[n]
    d['dur'] = round(dur(n) + 0.35 + float(d.get('hold') or 0), 2); d['start'] = round(t, 2); t += d['dur']; out.append(d)
    shutil.copy(f'{T}/tts/vo2/VO-{n:02d}.mp3', f'{R}/public/vo/VO-{n:02d}.mp3')
json.dump(out, open(f'{R}/src/data/slides.json', 'w')); json.dump(W, open(f'{R}/src/data/words.json', 'w'))
ins = sum([['-i', f"{T}/tts/vo2/VO-{d['n']:02d}.mp3"] for d in out], [])
fl = ';'.join(f"[{i}:a]aresample=48000,adelay={int((d['start'] + 0.2) * 1000)}:all=1[a{i}]" for i, d in enumerate(out))
fl += ';' + ''.join(f'[a{i}]' for i in range(len(out))) + f'amix=inputs={len(out)}:normalize=0,apad,atrim=0:{t:.3f}[o]'
subprocess.run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', fl, '-map', '[o]', '-ac', '1', f'{R}/out/narration.wav'], check=True)
print([(d['n'], d['comp'], d['start'], d['dur']) for d in out], 'total', round(t, 2))
