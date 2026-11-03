#!/usr/bin/env python3
"""Final-file check (3 Nov 2026): run on the finished narration (the mix that becomes the MP3) before Sam hears it.
Every take is checked while it is voiced, but cutting, joining, the voice finish and the mix happen afterwards; "Last" came
out as "ast" in video 2's final file although its take had passed. This listens to the file Sam will actually hear.
  qa_final.py timing.json mix.wav out_dir [--title "Video 2"]   -> out_dir/<name>_qa.json + <name>_listening_checklist.md
Checks, per line (times from timing.json, words from Whisper on the whole finished file):
  1 words: the script vs what is heard (missing, extra, swapped words), numbers and names compared as spoken words
  2 edges: the first word heard clearly and on time (not clipped), the last word present before the next line
  3 confidence: words Whisper was unsure of (probability < 0.6), always listed for numbers, names and `must` phrases
  4 pace: narrator lines of 5+ words faster than 3.9 words/s
  5 gaps: silences over 1.6 s (dead air) or under 0.12 s (lines run together) between lines; every Heckler handover listed
  6 loudness: each line's level against its speaker's median (flag > 4 dB off); integrated loudness and true peak of the file
  7 voice finish: narrator and Heckler pitch medians (the finish lowers Sam's pitch about 4%; hers must stay untouched)
Exit code 1 only for hard faults (a line mostly missing, a clipped first word, a missing last word, peaks over -1 dBTP);
everything else is a flag for Sam's listen."""
import sys, os, re, json, difflib, subprocess, statistics as st, numpy as np, librosa
from faster_whisper import WhisperModel
from num2words import num2words
T = json.load(open(sys.argv[1])); mix = sys.argv[2]; out = sys.argv[3]; os.makedirs(out, exist_ok=True)
title = sys.argv[sys.argv.index('--title') + 1] if '--title' in sys.argv else 'Narration'
name = os.path.splitext(os.path.basename(mix))[0].replace('_mix', '')
CONTR = {"she's": 'she is', "he's": 'he is', "it's": 'it is', "that's": 'that is', "there's": 'there is', "what's": 'what is', "who's": 'who is',
         "isn't": 'is not', "aren't": 'are not', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "can't": 'cannot', "won't": 'will not',
         "you're": 'you are', "we're": 'we are', "they're": 'they are', "i'm": 'i am', "let's": 'let us', "you'd": 'you would', "i'd": 'i would'}
def toks(s):
    s = s.lower().replace('%', ' percent ').replace('’', "'").replace('pay slip', 'payslip').replace('take away', 'takeaway')
    s = re.sub(r'(?<=\d),(?=\d{3}\b)', '', s).replace('key-ring', 'keyring').replace('key ring', 'keyring')
    s = re.sub(r'(\d+)\.(\d+)', lambda x: num2words(int(x.group(1))) + ' point ' + ' '.join('oh' if d == '0' else num2words(int(d)) for d in x.group(2)), s)
    s = re.sub(r'\$(\d+)', r'\1 dollars', s)
    s = re.sub(r'\d+', lambda x: num2words(int(x.group()), to='year') if len(x.group()) == 4 and 1900 <= int(x.group()) <= 2099 else num2words(int(x.group())), s)
    s = re.sub(r'\bone (hundred|thousand)\b', r'a \1', s)
    w = re.sub(r"[^a-z' ]", ' ', s.replace('-', ' ')).split()
    return [x for t in w for x in CONTR.get(t, t).split()]  # "She is" spoken quickly is written "she's": compare both spelled out
def joinnum(ws):
    o = []
    for w in ws:
        if o and re.match(r'^[.,]\d', w[0].strip()) and re.search(r'\d$', o[-1][0].strip()): o[-1] = (o[-1][0].rstrip() + w[0].strip(), o[-1][1], w[2], min(o[-1][3], w[3]))
        else: o.append(w)
    return o
fmt = lambda t: f'{int(t // 60)}:{t % 60:04.1f}'
SR = 16000; a, _ = librosa.load(mix, sr=SR, mono=True)
cache = f'{out}/{name}_words.json'  # the transcription is the slow part (minutes): reuse it while the file is unchanged
if os.path.exists(cache) and json.load(open(cache)).get('mtime') == os.path.getmtime(mix): W_ = json.load(open(cache))['words']
else:
    wm = WhisperModel('small.en', device='cpu', compute_type='int8')
    segs, _ = wm.transcribe(a, language='en', word_timestamps=True, vad_filter=False)
    W_ = [(w.word, float(w.start), float(w.end), float(w.probability)) for s in segs for w in s.words]
    json.dump(dict(mtime=os.path.getmtime(mix), words=W_), open(cache, 'w'))
H = [(tk, t0, t1, p) for w, t0, t1, p in joinnum([tuple(x) for x in W_]) for tk in toks(w)]
ALIAS = {'reels': 'reals', 'babra': 'barbara', 'barbra': 'barbara'}  # same-sounding spellings Whisper picks
H = [(ALIAS.get(h[0], h[0]),) + tuple(h[1:]) for h in H]
for j in range(len(H) - 1, 0, -1):  # Whisper splits these into two words; the script writes one
    if (H[j - 1][0], H[j][0]) in (('take', 'away'), ('pay', 'slip'), ('key', 'ring')): H[j - 1:j + 1] = [(H[j - 1][0] + H[j][0], H[j - 1][1], H[j][2], min(H[j - 1][3], H[j][3]))]
L = T['lines']
E = [(li, tk) for li, l in enumerate(L) for tk in toks(l.get('say', l['text']))]
sm = difflib.SequenceMatcher(None, [e[1] for e in E], [h[0] for h in H], autojunk=False)
hit = {}
diffs = {i: [] for i in range(len(L))}
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op == 'equal':
        for k in range(i2 - i1): hit[i1 + k] = j1 + k
    else:
        li = E[i1][0] if i1 < len(E) else E[-1][0]
        heard = ' '.join(h[0] for h in H[j1:j2]); want = ' '.join(e[1] for e in E[i1:i2])
        if want or heard: diffs[li].append(f"script '{want}' | heard '{heard}'")
NAMES = {'sam', 'barbara', 'lira', 'yen', 'rupee', 'rupees', 'reals', 'egyptian', 'turkey', 'japan', 'brazil', 'china', 'payslip', 'ruler'}
PCONF = 0.4  # numbers and names: Whisper is often unsure of correct ones, so only below 0.4 is listed
NUMW = set('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million billion trillion point oh percent'.split())
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
def pitch(x):
    if len(x) < SR * 0.3: return None
    f0, vf, _ = librosa.pyin(x, fmin=70, fmax=400, sr=SR, frame_length=1024); f0 = f0[vf]
    return float(np.median(f0)) if len(f0) else None
rows, hard = [], []
pos = 0
for li, l in enumerate(L):
    n = len(toks(l.get('say', l['text']))); idx = [k for k in range(pos, pos + n)]; pos += n
    got = [hit[k] for k in idx if k in hit]; who = 'heckler' if l.get('who') == 'heckler' else 'narrator'
    r = dict(id=l['id'], who=who, start=l['start'], end=l['end'], text=l['text'], flags=[])
    frac = len(got) / max(n, 1)
    if frac < 0.6: r['flags'].append(f'MOSTLY MISSING: only {len(got)} of {n} words heard'); hard.append(l['id'])
    if diffs[li]: r['flags'].append('words: ' + '; '.join(diffs[li][:3]))
    fi = hit.get(idx[0]) if idx else None
    if fi is None: r['flags'].append('FIRST WORD not heard'); hard.append(l['id'])
    else:
        h = H[fi]
        cut_here = li == 0 or l.get('unit', l.get('scene')) != L[li - 1].get('unit', L[li - 1].get('scene'))  # a take starts here (join or splice point)
        if h[3] < 0.5 and cut_here: r['flags'].append(f"first word '{h[0]}' unclear (confidence {h[3]:.2f}) right at a join: clipped onset?")
        if h[1] < l['start'] - 1.0 or h[1] > l['start'] + 1.0: r['flags'].append(f"first word heard at {fmt(h[1])}, timing says {fmt(l['start'])}")
        x = a[max(0, int((h[1] - 0.25) * SR)):int(h[1] * SR)]
        if h[3] < 0.5 and cut_here and len(x) and rms_db(x) > rms_db(a[int(h[1] * SR):int((h[1] + 0.25) * SR)]) - 6 and li > 0 and L[li - 1]['end'] < h[1] - 0.25:
            r['flags'].append('sound right before the first word: a cut may sit mid-sound')
    la = hit.get(idx[-1]) if idx else None
    if la is None: r['flags'].append('LAST WORD not heard (truncated?)'); hard.append(l['id'])
    unsure = [(H[hit[k]][0], H[hit[k]][3]) for k in idx if k in hit and H[hit[k]][3] < 0.6]
    must = {t for m in (l.get('must') or []) for t in toks(m)}
    key = [(w, p) for w, p in unsure if (w in NAMES or w in NUMW or w in must) and p < PCONF]
    if key: r['flags'].append('unsure key words: ' + ', '.join(f'{w} ({p:.2f})' for w, p in key[:5]))
    elif len(unsure) >= 2: r['flags'].append('unsure words: ' + ', '.join(f'{w} ({p:.2f})' for w, p in unsure[:4]))
    dur = (H[la][2] - H[fi][1]) if (fi is not None and la is not None and la > fi) else (l['end'] - l['start'])
    r['wps'] = round(n / dur, 2) if dur > 0 else None
    if who == 'narrator' and n >= 5 and r['wps'] and r['wps'] > 3.9: r['flags'].append(f"fast: {r['wps']} words/s")
    seg = a[int(l['start'] * SR):int(l['end'] * SR)]; r['db'] = round(rms_db(seg), 1) if len(seg) else None
    if li + 1 < len(L):
        g = L[li + 1]['start'] - l['end']; r['gap_after'] = round(g, 2)
        if g > 1.6: r['flags'].append(f'long gap after ({g:.1f} s)')
        if g < 0.12: r['flags'].append(f'lines run together ({g:.2f} s gap)')
        if who != ('heckler' if L[li + 1].get('who') == 'heckler' else 'narrator'): r['handover'] = f'{g:.2f} s to the next speaker'
    rows.append(r)
# second opinion: a hard fault from the whole-file transcript is re-checked on the line alone (Whisper drops words at
# section starts like "Question three" when it reads 7 minutes in one go); it stays a fault only if the line alone fails too
wm2 = None
for r in rows:
    if not any(f.startswith(('MOSTLY', 'FIRST WORD', 'LAST WORD')) for f in r['flags']): continue
    wm2 = wm2 or WhisperModel('small.en', device='cpu', compute_type='int8')
    x = a[max(0, int((r['start'] - 0.3) * SR)):int((r['end'] + 0.3) * SR)]
    sg2, _ = wm2.transcribe(x, language='en', word_timestamps=True)
    h2 = [ALIAS.get(t, t) for s_ in sg2 for w in s_.words for t in toks(w.word)]
    h2 = ' '.join(h2).replace('take away', 'takeaway').replace('pay slip', 'payslip').replace('key ring', 'keyring').split()
    want = toks(next(l for l in L if l['id'] == r['id']).get('say', r['text']))
    ok_first = bool(h2) and h2[0] == want[0]; ok_last = bool(h2) and want[-1] in h2[-3:]
    ratio = difflib.SequenceMatcher(None, want, h2).ratio()
    if ok_first and ok_last and ratio >= 0.8:
        r['flags'] = [f for f in r['flags'] if not f.startswith(('MOSTLY', 'FIRST WORD', 'LAST WORD'))] + [f"line alone heard fine: '{' '.join(h2)[:80]}'"]
        hard[:] = [h for h in hard if h != r['id']]
    else: r['flags'].append(f"line alone heard: '{' '.join(h2)[:80]}'")
for who in ('narrator', 'heckler'):
    dbs = [r['db'] for r in rows if r['who'] == who and r['db'] is not None]
    if not dbs: continue
    med = st.median(dbs)
    for r in rows:
        if r['who'] == who and r['db'] is not None and abs(r['db'] - med) > 4: r['flags'].append(f"level {r['db'] - med:+.1f} dB vs other {who} lines")
lv = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', mix, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = re.findall(r'I:\s+(-?[\d.]+) LUFS', lv); TP = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', lv)
overall = dict(lufs=float(I[-1]) if I else None, true_peak=float(TP[-1]) if TP else None)
if overall['true_peak'] is not None and overall['true_peak'] > -1.0: hard.append(f"true peak {overall['true_peak']} dBTP")
pn = [p for p in (pitch(a[int(r['start'] * SR):int(r['end'] * SR)]) for r in [r for r in rows if r['who'] == 'narrator'][:20]) if p]
ph = [p for p in (pitch(a[int(r['start'] * SR):int(r['end'] * SR)]) for r in rows if r['who'] == 'heckler') if p]
overall['pitch_narrator_hz'] = round(st.median(pn), 1) if pn else None; overall['pitch_heckler_hz'] = round(st.median(ph), 1) if ph else None
overall['heard_ratio'] = round(sm.ratio(), 3); overall['hard_faults'] = hard
json.dump(dict(overall=overall, lines=rows), open(f'{out}/{name}_qa.json', 'w'), indent=1, default=float)
# ---------- the checklist Sam listens with
flag = [r for r in rows if r['flags']]; hk = [r for r in rows if r['who'] == 'heckler']
jokes = [l for l in L if l.get('energy') == 'dry' or l.get('humour')]
M = [f'# {title}: listening checklist', '',
     f"Made automatically from the finished file ({os.path.basename(mix)}, {fmt(T['total'])}). Machine check: {len(rows)} lines, words matched {overall['heard_ratio']:.0%}, "
     f"loudness {overall['lufs']} LUFS, true peak {overall['true_peak']} dBTP, pitch narrator {overall['pitch_narrator_hz']} Hz / Heckler {overall['pitch_heckler_hz']} Hz."
     + (f" **Hard faults (fixed before sending, or listed first): {', '.join(map(str, hard))}.**" if hard else ' No hard faults.'), '',
     'Reply with item numbers and "fine" or "redo" (e.g. "3 redo, rest fine"). Only the lines marked redo are re-voiced.', '',
     ]
n = 0
def kind(f):
    if f.startswith(('MOSTLY', 'FIRST WORD', 'LAST WORD')): return 0
    if f.startswith('words:'): return 1
    if f.startswith(("first word '", 'sound right before', 'first word heard at')): return 2
    if f.startswith(('unsure key words', 'level', 'long gap', 'lines run together')): return 3
    if f.startswith('unsure words'): return 4
    if f.startswith('fast'): return 5
    return 6
GROUPS = [(0, 'Hard faults (should have been fixed before sending)'), (1, 'Words heard differently from the script (check these first)'),
          (2, 'Starts that may be clipped or unclear'), (3, 'Numbers and names heard with low confidence, levels and gaps'), (4, 'Other unsure words')]
for g, head in GROUPS:
    rs = [(r, [f for f in r['flags'] if kind(f) == g]) for r in rows]; rs = [(r, fs) for r, fs in rs if fs]
    if not rs: continue
    M += ['', f'## {head}', '| # | Time | Line | Why |', '|---|---|---|---|']
    for r, fs in rs:
        n += 1; M.append(f"| {n} | {fmt(r['start'])} | {r['text'][:80]} | {'; '.join(fs)[:220]} |")
fast = [r for r in rows if any(kind(f) == 5 for f in r['flags'])]
if fast:  # group fast lines by scene so the list stays short
    M += ['', '## Passages flagged as fast (above 3.9 words a second): judge the overall feel, not each line', '| # | Time | Scene | Lines | Fastest |', '|---|---|---|---|---|']
    by = {}
    for r in fast: by.setdefault(next(l for l in L if l['id'] == r['id'])['scene'], []).append(r)
    for sc, rs in by.items():
        n += 1; M.append(f"| {n} | {fmt(rs[0]['start'])}-{fmt(rs[-1]['end'])} | {sc} | {len(rs)} | {max(r['wps'] for r in rs)} w/s |")
M += ['', '## B. The Heckler (tone, speed and every handover)', '| # | Time | Line | Handover |', '|---|---|---|---|']
for r in hk:
    n += 1; prev = next((x for x in rows if x['end'] <= r['start'] and x is not r and x.get('gap_after') is not None and abs(x['end'] + x['gap_after'] - r['start']) < 0.05), None)
    M.append(f"| {n} | {fmt(r['start'])} | {r['text']} | {('in ' + str(prev['gap_after']) + ' s') if prev else ''}{(', out ' + r['handover']) if r.get('handover') else ''} |")
M += ['', '## C. Only a human can judge these', '| # | Time | Line | Listen for |', '|---|---|---|---|']
for l in jokes:
    n += 1; M.append(f"| {n} | {fmt(l['start'])} | {l['text'][:80]} | does the joke land (dry, not flat)? |")
for what in ['Voice finish: still sounds like you, slightly deeper and warmer?', 'Overall pace: easy to follow in the number-heavy parts?', 'Gaps between scenes: natural throughout?']:
    n += 1; M.append(f'| {n} | all | | {what} |')
open(f'{out}/{name}_listening_checklist.md', 'w').write('\n'.join(M) + '\n')
print(f"QA: {len(flag)} flagged lines, {len(hard)} hard faults; LUFS {overall['lufs']}, peak {overall['true_peak']}; checklist {out}/{name}_listening_checklist.md")
sys.exit(1 if hard else 0)
