# Join scene takes (clone_all VO-NN.mp3), Whisper word timestamps -> per-line and per-word times for the script,
# plus a word-check report per scene. Numbers are compared as words on both sides ("71%" == "seventy-one percent").
# Usage: cbx/bin/python3 assemble_scenes.py script.json takesdir vo.wav timing.json   (takes: <scene>.wav from clone_scenes.py)
import sys, os, subprocess, re, json, difflib, numpy as np, soundfile as sf, librosa
from faster_whisper import WhisperModel
from num2words import num2words
S = json.load(open(sys.argv[1])); takes = sys.argv[2]; out_wav, out_json = sys.argv[3], sys.argv[4]
SC = [dict(scene=sc) for sc in dict.fromkeys(l['scene'] for l in S)]
SR = 24000; LEAD, GAP, TAIL = 0.5, 0.45, 1.6
def toks(s):
    s = s.lower().replace('%', ' percent ').replace('’', "'")
    s = re.sub(r"(\d+)s\b", lambda x: num2words(int(x.group(1))) + 's', s)
    s = re.sub(r'\d+', lambda x: num2words(int(x.group()), to='year') if len(x.group()) == 4 else num2words(int(x.group())), s)
    return [{'anne': 'ann', 'rays': 'raise', 'barbra': 'barbara', 'babra': 'barbara'}.get(w, w) for w in re.sub(r"[^a-z' ]", ' ', s.replace('-', ' ')).split()]
norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))
wm = WhisperModel('small.en', device='cpu', compute_type='int8')
pieces = [np.zeros(int(LEAD * SR), np.float32)]; t = LEAD; lines = []; report = {}
for d in SC:
    src = f"{takes}/{d['scene']}.wav"
    if os.environ.get('NARR_FX') and not d['scene'].startswith('H_'):  # the narrator's voice finish (profile post_fx) on Sam's units only, not the Heckler's (3 Nov 2026)
        fxw = f"{takes}/.fx_{d['scene']}.wav"; subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', os.environ['NARR_FX'], fxw], check=True); src = fxw
    a, _ = librosa.load(src, sr=SR)
    e = librosa.feature.rms(y=a, frame_length=1200, hop_length=600)[0]; on = int(np.argmax(e > 0.25 * e.max())) * 600
    # keep 0.2 s before the first loud frame: 0.08 s left a soft first consonant right at the cut ("Last" heard as "ast", 3 Nov 2026)
    a = a[max(0, on - int(0.2 * SR)):]; _, (i0, i1) = librosa.effects.trim(a, top_db=38); a = a[:i1 + int(0.1 * SR)]
    segs, _ = wm.transcribe(librosa.resample(a, orig_sr=SR, target_sr=16000), language='en', word_timestamps=True); segs = list(segs)
    H = [(tk, w.start, w.end) for s_ in segs for w in s_.words for tk in toks(w.word)]
    L = [l for l in S if l['scene'] == d['scene']]
    E = [(li, wi, tk) for li, l in enumerate(L) for wi, w in enumerate(l.get('say', l['text']).split()) for tk in toks(w)]
    sm = difflib.SequenceMatcher(None, [x[2] for x in E], [h[0] for h in H], autojunk=False); tm = [None] * len(E); diffs = []
    for op, i1_, i2_, j1, j2 in sm.get_opcodes():
        if op == 'equal':
            for k in range(i2_ - i1_): tm[i1_ + k] = H[j1 + k][1:]
        else:
            diffs.append(f"script '{' '.join(x[2] for x in E[i1_:i2_])}' | heard '{' '.join(h[0] for h in H[j1:j2])}'")
            if i2_ > i1_ and j2 > j1:
                s0, s1 = H[j1][1], H[j2 - 1][2]
                for k in range(i2_ - i1_): tm[i1_ + k] = (s0 + (s1 - s0) * k / (i2_ - i1_), s0 + (s1 - s0) * (k + 1) / (i2_ - i1_))
    for k in range(len(tm)):
        if tm[k] is None: p = next((tm[j] for j in range(k - 1, -1, -1) if tm[j]), (0, 0.1)); tm[k] = (p[1], p[1] + 0.15)
    report[d['scene']] = dict(heard=' '.join(s_.text.strip() for s_ in segs), ratio=round(sm.ratio(), 3), diffs=diffs)
    for li, l in enumerate(L):
        ws = []
        for wi, w in enumerate(l.get('say', l['text']).split()):
            ks = [k for k, x in enumerate(E) if x[0] == li and x[1] == wi]
            if ks and norm(w): ws.append((norm(w), round(t + tm[ks[0]][0], 3), round(t + tm[ks[-1]][1], 3)))
        lines.append(dict(l, start=ws[0][1], end=ws[-1][2], words=ws))
    pieces.append(a.astype(np.float32)); t += len(a) / SR
    pieces.append(np.zeros(int(GAP * SR), np.float32)); t += GAP
pieces.append(np.zeros(int((TAIL - GAP) * SR), np.float32)); t += TAIL - GAP
x = np.concatenate(pieces); sf.write(out_wav, x / np.max(np.abs(x)) * 0.89, SR)
json.dump(dict(total=round(t, 3), lines=lines), open(out_json, 'w'), indent=1)
json.dump(report, open(out_json.replace('.json', '_check.json'), 'w'), indent=1)
print('total', round(t, 2))
for k, v in report.items(): print(f"{k:9s} {v['ratio']:.2f} {'CLEAN' if not v['diffs'] else '; '.join(v['diffs'])}")
