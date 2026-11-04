# Join per-line takes (lines/<id>.wav), transcribe with word timestamps, map to the script -> vo.wav + timing.json (lines + word times) + diff report.
import sys, os, json, re, subprocess, difflib, numpy as np, soundfile as sf, librosa
from faster_whisper import WhisperModel
S = json.load(open(sys.argv[1])); S = S["lines"] if isinstance(S, dict) else S; takes = sys.argv[2]; out_wav = sys.argv[3]; out_json = sys.argv[4]
SR = 24000; LEAD, GAP, TAIL = 0.5, 0.5, 1.6
NUMW = {'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'zero': '0'}
norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))
wm = WhisperModel('small.en', device='cpu', compute_type='int8')
pieces = [np.zeros(int(LEAD * SR), np.float32)]; t = LEAD; lines = []; report = []; prev = None
for l in S:
    if prev is not None:
        g = GAP if l['scene'] != prev else 0.22; pieces.append(np.zeros(int(g * SR), np.float32)); t += g
    a, _ = librosa.load(f'{takes}/{l["id"]}.wav', sr=SR)
    _, (i0, i1) = librosa.effects.trim(a, top_db=38); a = a[max(0, i0 - int(0.04 * SR)): i1 + int(0.08 * SR)]
    e = librosa.feature.rms(y=a, frame_length=1200, hop_length=600)[0]; on = int(np.argmax(e > 0.25 * e.max())) * 600  # skip clone murmur before the first word
    a = a[max(0, on - int(0.08 * SR)):]; a[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
    segs, _ = wm.transcribe(librosa.resample(a, orig_sr=SR, target_sr=16000), language='en', word_timestamps=True)
    hw = [(w.start, w.end) for s_ in segs for w in s_.words if norm(w.word)]
    exp = [norm(w) for w in l.get('say', l['text']).split() if norm(w)]
    # spread heard word times over script words in order (counts can differ when numbers are written as digits)
    if hw:
        s0, s1 = hw[0][0], hw[-1][1]
        idx = [min(len(hw) - 1, int(k * len(hw) / len(exp))) for k in range(len(exp))]
        ws = [(exp[k], round(t + hw[idx[k]][0], 3), round(t + hw[idx[k]][1], 3)) for k in range(len(exp))]
    else:
        ws = [(exp[k], round(t + k * len(a) / SR / len(exp), 3), round(t + (k + 1) * len(a) / SR / len(exp), 3)) for k in range(len(exp))]
    lines.append(dict(l, start=round(t + (hw[0][0] if hw else 0), 3), end=round(t + (hw[-1][1] if hw else len(a) / SR), 3), words=ws))
    pieces.append(a.astype(np.float32)); t += len(a) / SR; prev = l['scene']
pieces.append(np.zeros(int(GAP * SR), np.float32)); t += GAP
pieces.append(np.zeros(int(TAIL * SR), np.float32)); t += TAIL - GAP
x = np.concatenate(pieces); sf.write(out_wav, x / np.max(np.abs(x)) * 0.89, SR)
json.dump(dict(total=round(t, 3), lines=lines), open(out_json, 'w'), indent=1)
print('total', round(t, 2))
