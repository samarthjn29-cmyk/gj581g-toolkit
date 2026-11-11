"""Closed captions for a JOINED video: the script's `text` (as written: swears, digits) timed by faster-whisper
word times heard in the final mix. Cues <= 42 characters, split at sentence and clause ends, never across script
lines; a lone one-word tail joins the cue before it. Also writes <out>.json (cues with their line id) for
translate_srt.py. Written for Zeigarnik (11 Nov 2026): timing_srt.py needs per-word times from the build, which the
stills format's per-chapter timing files don't carry.
Usage: align_srt.py VIDEO.mp4 SCRIPT.json TIMING_DIR CH1,CH2,... OUT.srt   (TIMING_DIR holds timing_<ch>.json;
chapters in video order; lines of other scenes, e.g. a dropped opening, are skipped). Whisper words are cached
next to OUT as <out>_heard.json."""
import json, re, subprocess, difflib, numpy as np
from faster_whisper import WhisperModel
import sys, os
VID, SCRIPT, TDIR, CHS, OUT = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(','), sys.argv[5]
BASE = os.path.splitext(OUT)[0]
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', VID, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
y = np.frombuffer(raw, np.float32)
import os
if os.path.exists(BASE + '_heard.json'): H = [tuple(x) for x in json.load(open(BASE + '_heard.json'))]
else:
    m = WhisperModel('medium.en', device='cpu', compute_type='int8'); H = []
    for s in m.transcribe(y, language='en', word_timestamps=True, beam_size=5, vad_filter=False)[0]:
        for w in s.words: H.append((w.word.strip(), w.start, w.end))
    json.dump(H, open(BASE + '_heard.json', 'w'))
n = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
order = {}
for ci, s in enumerate(CHS):
    for k, l in enumerate(json.load(open(os.path.join(TDIR, f'timing_{s}.json')))['lines']): order[l['id']] = ci * 1000 + k
L = [l for l in json.load(open(SCRIPT))['lines'] if l['id'] in order]
L.sort(key=lambda l: order[l['id']])
S = []  # script tokens: (word as written, line index)
for i, l in enumerate(L):
    for w in l['text'].split(): S.append((w, i))
a = [n(w) for w, _ in S]; b = [n(w) for w, _, _ in H]
t = [None] * len(S)
for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
    for j in range(blk.size): t[blk.a + j] = (H[blk.b + j][1], H[blk.b + j][2])
# fill gaps by interpolation between known neighbours
known = [i for i, x in enumerate(t) if x]
print(f'matched {len(known)}/{len(S)} script words')
for i in range(len(S)):
    if t[i] is None:
        p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
        ta = t[p][1] if p is not None else 0; tb = t[q][0] if q is not None else ta + 0.4
        gp = (i - (p if p is not None else i - 1)); tot = ((q if q is not None else i + 1) - (p if p is not None else i - 1))
        st = ta + (tb - ta) * (gp - 0.5) / tot; t[i] = (st, st + 0.25)
caps = []
MAX = 42
def balanced(ix):  # split a long phrase into near-equal parts under MAX chars
    words = [S[k][0] for k in ix]; total = len(' '.join(words)); parts = -(-total // MAX)
    out, cur = [], []
    for k in ix:
        cur.append(k)
        if len(' '.join(S[j][0] for j in cur)) >= total / parts - 3 and len(out) < parts - 1: out.append(cur); cur = []
    if cur: out.append(cur)
    return out
for li in sorted(set(x[1] for x in S)):
    ix = [i for i, x in enumerate(S) if x[1] == li]
    phrases, cur = [], []
    for i in ix:
        cur.append(i)
        end_p = re.search(r'[.?!:;]["\']?$', S[i][0]) or (re.search(r',$', S[i][0]) and len(cur) >= 3)
        if end_p or i == ix[-1]: phrases.append(cur); cur = []
    chunks = []
    for p in phrases:
        ptxt = ' '.join(S[k][0] for k in p)
        if chunks and len(' '.join(S[k][0] for k in chunks[-1] + p)) <= MAX and not re.search(r'[.?!]["\']?$', S[chunks[-1][-1]][0]): chunks[-1] += p
        elif len(ptxt) <= MAX: chunks.append(list(p))
        else: chunks += balanced(p)
    # a lone short tail joins the chunk before it
    if len(chunks) > 1 and len(chunks[-1]) == 1 and len(' '.join(S[k][0] for k in chunks[-2] + chunks[-1])) <= 50: chunks[-2] += chunks.pop()
    for c in chunks: caps.append([t[c[0]][0], t[c[-1]][1], ' '.join(S[k][0] for k in c), L[li]['id']])
for i in range(len(caps)):
    nxt = caps[i + 1][0] - 0.03 if i + 1 < len(caps) else caps[i][1] + 1.0
    caps[i][1] = max(caps[i][0] + 0.6, min(caps[i][1] + 0.35, nxt))
    if i + 1 < len(caps) and caps[i][1] > nxt: caps[i][1] = nxt
def ts(x): x = max(0, x); return f"{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{int(x % 60):02d},{int(round((x % 1) * 1000)) % 1000:03d}"
open(OUT, 'w').write('\n'.join(f"{i + 1}\n{ts(a)} --> {ts(b)}\n{c}\n" for i, (a, b, c, _) in enumerate(caps)))
json.dump(caps, open(BASE + '.json', 'w'), ensure_ascii=False, indent=0)
print(len(caps), 'captions')
