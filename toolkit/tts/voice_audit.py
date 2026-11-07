#!/usr/bin/env python3
"""Audit a finished narration before Sam listens (7 Nov 2026, Scrolls v1: Sam asked for "an audit on the overall quality of
voice and words spoken"). Run with the cbenv python (faster-whisper, librosa, soundfile).
Checks: 1 every spoken word against the script (medium.en, word times; spelling-only differences are ignored);
2 homographs the dictionary gets wrong unless picked (read, live, use...): lists each with its line so the voice notes can
set read#2 etc.; 3 loudness per line (outliers > 3 dB), peak, clipping, clicks, digital-silence runs; 4 pace per line
(flags > 3.35 words a second, i.e. about 200 wpm, and < 2.0); 5 pitch: median, range per line (flat < 4 st), rising
endings on statements, falling endings on questions; 6 pauses: histogram, chapter gaps, pauses over 0.7 s.
Usage: voice_audit.py vo_final.wav timing.json script.json out.md [--notes voice_notes.json] [--no-asr]"""
import sys, re, json, difflib, numpy as np, soundfile as sf
a = sys.argv; wav, tj, sj, outp = a[1:5]; x, sr = sf.read(wav); m = x.mean(1) if x.ndim > 1 else x
T = json.load(open(tj))['lines']; S = json.load(open(sj)); S = S['lines'] if isinstance(S, dict) else S
R = ['# Voice audit: ' + wav, '']
# 1 words
if '--no-asr' not in a:
    from faster_whisper import WhisperModel
    import scipy.signal as sg
    x16 = sg.resample_poly(m, 16000, sr).astype(np.float32) if sr != 16000 else m.astype(np.float32)
    segs, _ = WhisperModel('medium.en', device='cpu', compute_type='int8').transcribe(x16, language='en', word_timestamps=True, beam_size=5, condition_on_previous_text=False)
    W = [(w.word.strip(), w.start, w.probability) for g in segs for w in g.words]
    norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower())
    SP = {'colour': 'color', 'vapours': 'vapors', 'metres': 'meters', 'centre': 'center', 'catalogued': 'cataloged', 'grey': 'gray', 'defence': 'defense'}
    ref, rid = [], []
    for l in S:
        for w in re.findall(r"[A-Za-z0-9']+", l['text'].replace('-', ' ')): ref.append(SP.get(norm(w), norm(w))); rid.append(l['id'])
    hyp, ht = [], []
    for w, s, p in W:
        for k in w.replace('-', ' ').split():
            n = norm(k)
            if n: hyp.append(SP.get(n, n)); ht.append(s)
    try:
        from num2words import num2words
        hyp = [num2words(int(h)).replace('-', ' ').replace(' and ', ' ') if h.isdigit() else h for h in hyp]
        hyp = [t for h in hyp for t in h.split()]  # re-split spoken numbers; times approximate after this
    except Exception: pass
    sm = difflib.SequenceMatcher(a=ref, b=hyp, autojunk=False)
    R += ['## 1. Words (speech recognition vs script)', f'match ratio {sm.ratio():.3f}; script {len(ref)} words']
    for op, a0, a1, b0, b1 in sm.get_opcodes():
        if op != 'equal': R.append(f'- {op} ~{ht[min(b0, len(ht) - 1)]:.1f}s {rid[min(a0, len(rid) - 1)]}: script "{" ".join(ref[a0:a1])}" heard "{" ".join(hyp[b0:b1])}"')
    low = [f'{w}@{s:.1f}s' for w, s, p in W if p < 0.4]
    R.append('low-confidence words (listen): ' + (', '.join(low) if low else 'none'))
    R.append('')
# 2 homographs
HOMO = {'read': 'read#2 = reed (present tense); plain = red', 'live': 'live#2 = liv (verb); plain = LIVE', 'lives': 'plain = livz (verb); lives#2 = LIVES (noun)', 'use': 'use#2 = yooz (verb); plain = yoos', 'close': 'plain = close (adj); close#2 = cloze (verb)',
        'lead': 'plain = led (metal); lead#2 = leed', 'tear': 'plain = tare; tear#2 = teer', 'wound': 'plain = wownd; wound#2 = woond', 'minute': 'plain = minit; minute#2 = my-newt', 'record': 'plain = re-CORD (verb); record#2 = RE-cord', 'present': 'plain = PRE-sent; present#2 = pre-SENT', 'object': 'plain = OB-ject; object#2 = ob-JECT', 'content': 'plain = CON-tent; content#2 = con-TENT', 'bass': 'plain = base; bass#2 = bass (fish)', 'bow': 'plain = bow (arrow); bow#2 = bough', 'row': 'plain = roe; row#2 = rau', 'wind': 'plain = wind (air); wind#2 = wined', 'desert': 'plain = DEZ-ert; desert#2 = de-ZERT', 'produce': 'plain = pro-DUCE; produce#2 = PRO-duce', 'refuse': 'plain = re-FUSE; refuse#2 = REF-use', 'subject': 'plain = SUB-ject; subject#2 = sub-JECT', 'project': 'plain = PROJ-ect; project#2 = pro-JECT', 'excuse': 'plain = ex-CUSE (verb); excuse#2 = ex-CUSE (noun)'}
R.append('## 2. Homographs to pick in the voice notes (say_k with #2 where the second reading is meant)')
NOTES = json.load(open(a[a.index('--notes') + 1])) if '--notes' in a else {}
for l in S:
    sk = NOTES.get(l['id'], {}).get('say_k', l.get('say_k', ''))
    for mt in re.finditer(r"\b(" + '|'.join(HOMO) + r")\b", l['text'], re.I):
        w = mt.group(1).lower(); ctx = l['text'][max(0, mt.start() - 30):mt.end() + 25]
        R.append(f'- {l["id"]}: "{ctx}" ({HOMO[w]}){" [picked]" if w + "#2" in sk.lower() else ""}')
R.append('')
# 3 levels, 4 pace
rows = []
for l in T:
    seg = m[int(l['start'] * sr):int(l['end'] * sr)]; lv = 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9)
    nw = len(re.findall(r"[A-Za-z0-9']+", l['text'].replace('-', ' '))); rows.append((l['id'], l['start'], lv, nw / max(.1, l['end'] - l['start']), nw, l['text'][:60]))
L = np.array([r[2] for r in rows]); P = np.array([r[3] for r in rows])
R += ['## 3. Levels', f'peak {20 * np.log10(np.abs(x).max()):.1f} dBFS; clipped samples {int((np.abs(x) > 0.999).sum())}; line level median {np.median(L):.1f} dBFS (p5 {np.percentile(L, 5):.1f}, p95 {np.percentile(L, 95):.1f})']
R += [f'- level outlier {r[0]} {r[1]:.1f}s {r[2] - np.median(L):+.1f} dB: {r[5]}' for r in rows if abs(r[2] - np.median(L)) > 3]
d = np.abs(np.diff(m)); env = np.convolve(np.abs(m), np.ones(480) / 480, 'same'); cl = np.where((d > np.percentile(d, 99.99) * 1.5) & (d > 8 * env[1:] + 1e-3))[0]
R.append(f'click candidates: {len(cl)} ' + ', '.join(f'{c / sr:.2f}s' for c in cl[:10]))
R += ['', '## 4. Pace', f'median {np.median(P) * 60:.0f} wpm within lines (p5 {np.percentile(P, 5) * 60:.0f}, p95 {np.percentile(P, 95) * 60:.0f}); video {sum(r[4] for r in rows) / (T[-1]["end"] - T[0]["start"]) * 60:.0f} wpm overall']
R += [f'- {"fast" if r[3] > 3.35 else "slow"} {r[0]} {r[1]:.1f}s {r[3] * 60:.0f} wpm: {r[5]}' for r in rows if r[4] >= 4 and (r[3] > 3.35 or r[3] < 2.0)]
# 5 pitch
try:
    import librosa
    m16 = librosa.resample(m, orig_sr=sr, target_sr=16000); pr = []
    for l in T:
        seg = m16[int(l['start'] * 16000):int(l['end'] * 16000)]; f0, v, _ = librosa.pyin(seg, fmin=60, fmax=260, sr=16000, frame_length=1024, hop_length=160)
        f = f0[v]
        if len(f) < 10: continue
        st = 12 * np.log2(f / np.median(f)); rng = np.percentile(st, 95) - np.percentile(st, 5); n = len(f)
        pr.append((l['id'], float(np.median(f)), float(rng), float(12 * np.log2(np.median(f[int(n * .85):]) / np.median(f[:int(n * .7)]))), l['text'].rstrip().endswith('?'), l['text'][-40:]))
    med = np.median([p[1] for p in pr]); R += ['', '## 5. Pitch', f'median {med:.0f} Hz; range per line median {np.median([p[2] for p in pr]):.1f} semitones']
    R += [f'- flat {p[0]} (range {p[2]:.1f} st): {p[5]}' for p in pr if p[2] < 4]
    R += [f'- rising end on a statement {p[0]} ({p[3]:+.1f} st): {p[5]}' for p in pr if p[3] > 1 and not p[4]]
    R += [f'- pitch outlier {p[0]} ({p[1]:.0f} Hz): {p[5]}' for p in pr if abs(12 * np.log2(p[1] / med)) > 2.5]
except ImportError: R.append('(librosa missing: no pitch check)')
# 6 pauses
H = int(sr * .01); e = np.array([np.sqrt(np.mean(m[i:i + H] ** 2)) for i in range(0, len(m) - H, H)]); sil = 20 * np.log10(e + 1e-9) < -50
Pz = []; i = 0
while i < len(sil):
    if sil[i]:
        j = i
        while j < len(sil) and sil[j]: j += 1
        if j - i >= 12: Pz.append((i / 100, (j - i) / 100))
        i = j
    else: i += 1
dd = np.array([p[1] for p in Pz]); R += ['', '## 6. Pauses', 'histogram (s): ' + ', '.join(f'{a_}-{b_}: {int(((dd >= a_) & (dd < b_)).sum())}' for a_, b_ in [(.12, .25), (.25, .35), (.35, .5), (.5, .8), (.8, 1.2), (1.2, 9)])]
R.append('chapter gaps: ' + ', '.join(f'{T[k]["scene"]} {T[k]["start"] - T[k - 1]["end"]:.2f}' for k in range(1, len(T)) if T[k]['scene'] != T[k - 1]['scene']))
R.append('pauses over 0.7 s: ' + ', '.join(f'{a_:.1f}s ({b_:.2f})' for a_, b_ in Pz if b_ > 0.7 and a_ < T[-1]['end']))
open(outp, 'w').write('\n'.join(R) + '\n'); print('\n'.join(R))
