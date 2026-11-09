#!/usr/bin/env python3
"""Sam's final ElevenLabs chapter MP3 -> levelled WAV + line timing for build_scene.py (9 Nov 2026: "Consider the audio
provided by me as final"). Nothing is re-timed or cut inside: trim the ends to 0.3 s, highpass 60 Hz, two-pass linear
loudnorm to -16 LUFS / TP -1.5. Line times come from whisper medium.en word times aligned to the script lines.
Usage: eleven_prep.py IN.mp3 SCRIPT.json SCENE OUT.wav OUT_timing.json"""
import sys, re, json, difflib, subprocess, tempfile, numpy as np, soundfile as sf
from num2words import num2words
mp3, sj, scene, out, otj = sys.argv[1:6]
def run(*a): return subprocess.run(a, capture_output=True, text=True, check=True)
with tempfile.TemporaryDirectory() as td:
    run('ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '48000', f'{td}/a.wav')
    x, sr = sf.read(f'{td}/a.wav', dtype='float32')
    fr = int(.02 * sr); e = 20 * np.log10(np.sqrt(np.mean(x[:len(x) // fr * fr].reshape(-1, fr) ** 2, 1)) + 1e-9)
    act = np.where(e > -50)[0]; i0 = max(0, act[0] * fr - int(.3 * sr)); i1 = min(len(x), (act[-1] + 1) * fr + int(.3 * sr))
    sf.write(f'{td}/t.wav', x[i0:i1], sr)
    af = 'highpass=f=60,loudnorm=I=-16:TP=-1.5:LRA=11'
    m = run('ffmpeg', '-hide_banner', '-i', f'{td}/t.wav', '-af', af + ':print_format=json', '-f', 'null', '-').stderr
    j = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
    run('ffmpeg', '-v', 'error', '-y', '-i', f'{td}/t.wav', '-af', af + f":measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true", '-ar', '48000', out)
y, sr = sf.read(out, dtype='float32')
import librosa
from faster_whisper import WhisperModel
wm = WhisperModel('medium.en', device='cpu', compute_type='int8', cpu_threads=2)
segs = list(wm.transcribe(librosa.resample(y, orig_sr=sr, target_sr=16000), beam_size=5, word_timestamps=True, condition_on_previous_text=False)[0])
def toks(s):
    s = re.sub(r'(?<=\d),(?=\d{3})', '', s.lower().replace('’', "'"))
    s = re.sub(r'(\d+)(s\b)?', lambda m: (lambda w: (w[:-1] + 'ies' if w.endswith('y') else w + 's') if m.group(2) else w)(num2words(int(m.group(1)), to='year') if len(m.group(1)) == 4 else num2words(int(m.group(1)))), s)
    return re.sub(r"[^a-z ]", ' ', s.replace('-', ' ').replace("'", '')).split()
W = [(t, w.start, w.end) for s_ in segs for w in s_.words for t in toks(w.word)]
S = json.load(open(sj)); L = [dict(l) for l in S['lines'] if l['scene'] == scene]
E = [(li, t) for li, l in enumerate(L) for t in toks(l['text'])]
sm = difflib.SequenceMatcher(None, [e[1] for e in E], [w[0] for w in W], autojunk=False)
own = {}
for tag, a0, a1, b0, b1 in sm.get_opcodes():
    for k in range(b1 - b0): own[b0 + k] = E[min(a0 + (k if tag == 'equal' else min(k, max(a1 - a0 - 1, 0))), len(E) - 1)][0]
for li, l in enumerate(L):
    ws = [W[j] for j in range(len(W)) if own.get(j) == li]
    l['start'], l['end'] = (round(ws[0][1], 3), round(ws[-1][2], 3)) if ws else (None, None)
    l['heard'] = ' '.join(w[0] for w in ws)
for li, l in enumerate(L):           # a line the model missed gets the gap between its neighbours
    if l['start'] is None:
        p = next((L[k]['end'] for k in range(li - 1, -1, -1) if L[k]['end'] is not None), 0)
        n = next((L[k]['start'] for k in range(li + 1, len(L)) if L[k]['start'] is not None), len(y) / sr)
        l['start'], l['end'], l['estimated'] = p, n, True
ratio = sm.ratio()
json.dump(dict(total=round(len(y) / sr, 3), source=mp3, match=round(ratio, 3), lines=L), open(otj, 'w'), indent=1, ensure_ascii=False)
n = sum(len(l['text'].split()) for l in L)
print(f"{scene}: {len(y)/sr:.1f} s, {n} words, {n/(len(y)/sr)*60:.0f} wpm, script match {ratio:.3f}, estimated lines {[l['id'] for l in L if l.get('estimated')]}")
