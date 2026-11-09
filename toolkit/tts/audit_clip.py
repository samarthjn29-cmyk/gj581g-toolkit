#!/usr/bin/env python3
"""Post-render voice audit (Sam, 9 Nov 2026: "recheck the voices and words once the video is rendered so we don't make these
errors" -- after "1752" was spoken as "one hundred and seventy-two" and a draggy "Hold that thought too").
Listens to the RENDERED clip (what the viewer hears), not the line takes, with faster-whisper medium.en, and checks:
  WORDS   script vs heard, per line (numbers compared as words; spelling variants ignored; names marked for a listen)
  PAUSES  silences inside a sentence over --midgap s (default 0.75) and between lines over --linegap s (default 1.6)
  NOISE   sound in the pauses (breaths, clicks, mumbles) louder than --noise dBFS (default -48)
  PACE    words per minute over the clip, and lines read much faster/slower than the clip's own pace
  LEVEL   loudness (LUFS) and true peak
Usage: audit_clip.py CLIP.mp4 SCRIPT.json LINE_FIRST-LINE_LAST [--names Seales,Farritor] [--out report.md]
Exit code 1 when any WORDS or PAUSES or NOISE problem is found, so a build can stop on it."""
import sys, re, json, difflib, subprocess, tempfile, argparse, numpy as np, soundfile as sf
from num2words import num2words
ap = argparse.ArgumentParser(); ap.add_argument('clip'); ap.add_argument('script'); ap.add_argument('lines')
ap.add_argument('--names', default='Seales,Handmer,Farritor,Youssef,Nader,Schilliger,Philodemus,Piaggio,Herculaneum,Porphyras,Gedi,Humphry,Leviticus,Vesuvius,Ercolano')
ap.add_argument('--midgap', type=float, default=0.75); ap.add_argument('--linegap', type=float, default=1.6)
ap.add_argument('--noise', type=float, default=-48); ap.add_argument('--out')
a = ap.parse_args()
SAME = {'meters': 'metres', 'gelatin': 'gelatine', 'center': 'centre', 'cataloged': 'catalogued', 'eightys': 'eighties', 'vapors': 'vapours', 'rosewater': 'rose water', 'color': 'colour', 'colors': 'colours', 'gray': 'grey'}
NAMES = {n.lower() for n in a.names.split(',')}
def toks(s):
    s = re.sub(r'(?<=\d),(?=\d{3})', '', s.lower().replace('%', ' percent ').replace('’', "'"))   # 2,000 -> 2000
    s = re.sub(r'(\d+)(s\b)?', lambda x: (lambda w: (w[:-1] + 'ies' if w.endswith('y') else w + 's') if x.group(2) else w)(
        num2words(int(x.group(1)), to='year') if len(x.group(1)) == 4 else num2words(int(x.group(1)))), s)
    return ' '.join(SAME.get(t, t) for t in re.sub(r"[^a-z ]", ' ', s.replace('-', ' ').replace("'", '')).split()).split()
S = json.load(open(a.script)); L = S['lines'] if isinstance(S, dict) else S
ids = [l['id'] for l in L]; i0, i1 = (ids.index(x) for x in a.lines.split('-')); L = L[i0:i1 + 1]
with tempfile.TemporaryDirectory() as td:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.clip, '-ac', '1', '-ar', '16000', f'{td}/a.wav'], check=True)
    x, sr = sf.read(f'{td}/a.wav', dtype='float32')
    lv = subprocess.run(['ffmpeg', '-hide_banner', '-i', a.clip, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    lv = json.loads(lv[lv.rindex('{'):lv.rindex('}') + 1])
from faster_whisper import WhisperModel
wm = WhisperModel('medium.en', device='cpu', compute_type='int8', cpu_threads=2)
segs = list(wm.transcribe(x, beam_size=5, word_timestamps=True, condition_on_previous_text=False)[0])
W = []                                             # heard words: (token, start, end)
for s in segs:
    for w in s.words:
        for t in toks(w.word): W.append((t, w.start, w.end))
E = [(li, wi, t) for li, l in enumerate(L) for wi, t in enumerate(toks(l['text']))]
sm = difflib.SequenceMatcher(None, [e[2] for e in E], [w[0] for w in W], autojunk=False)
own = [None] * len(W); probs = []; notes = []
for tag, p0, p1, q0, q1 in sm.get_opcodes():
    for j in range(q0, q1): own[j] = E[min(p0 + (j - q0), max(p1 - 1, p0), len(E) - 1)][0]
    if tag == 'equal': continue
    li = E[min(p0, len(E) - 1)][0]; exp = ' '.join(e[2] for e in E[p0:p1]); got = ' '.join(w[0] for w in W[q0:q1])
    t = W[q0][1] if q0 < len(W) else (W[-1][2] if W else 0)
    name = any(e[2] in NAMES for e in E[p0:p1])
    (notes if name else probs).append(f"{L[li]['id']} @{t:6.1f}s  {'NAME (listen)' if name else 'WORDS'}: '{exp}' -> '{got}'")
# measure the audio itself (whisper's word edges are loose): 20 ms frames, active = louder than -50 dBFS
fr = int(0.02 * sr); e = 20 * np.log10(np.sqrt(np.mean(x[:len(x) // fr * fr].reshape(-1, fr) ** 2, 1)) + 1e-9); act = e > -50
runs = []; k = 0                                    # active runs [t0, t1, peak dB]
while k < len(act):
    if act[k]:
        m_ = k
        while m_ < len(act) and (act[m_] or (m_ + 4 < len(act) and act[m_:m_ + 5].any())): m_ += 1   # bridge gaps < 100 ms
        runs.append((k * 0.02, m_ * 0.02, float(e[k:m_].max()))); k = m_
    else: k += 1
def line_of(t):                                     # script line of the heard word nearest to time t
    js = [j for j in range(len(W)) if own[j] is not None]
    return min(js, key=lambda j: min(abs(W[j][1] - t), abs(W[j][2] - t))) if js else None
for r0, r1, pk in runs:                             # NOISE: sound with no word in it (breath, click, mumble)
    if not any(w[1] < r1 + 0.05 and w[2] > r0 - 0.05 for w in W) and r1 - r0 >= 0.04 and pk > a.noise:
        j = line_of(r0); probs.append(f"{L[own[j]]['id'] if j is not None else '?'} @{r0:6.1f}s  NOISE: {r1 - r0:.2f}s sound with no words ({pk:.0f} dBFS peak)")
for (p0_, p1_, _), (q0_, _, _) in zip(runs, runs[1:]):   # PAUSES: real silences
    gap = q0_ - p1_
    before = [j for j in range(len(W)) if W[j][2] <= p1_ + 0.15 and own[j] is not None]
    after = [j for j in range(len(W)) if W[j][1] >= q0_ - 0.15 and own[j] is not None]
    if not before or not after: continue
    jb, ja = before[-1], after[0]; lid = L[own[jb]]['id']
    if own[jb] == own[ja] and gap > a.midgap:
        # the script word before the silence: does punctuation follow it?
        ei = [i for i, (tg, p0, p1, q0, q1) in enumerate(sm.get_opcodes()) if q0 <= jb < q1]
        txt = L[own[jb]]['text']; words_ = txt.split(); wtk = W[jb][0]
        punct = any(toks(w_) and toks(w_)[-1] == wtk and re.search(r"[.,;:!?—–-]$", w_) for w_ in words_)
        if not punct: probs.append(f"{lid} @{p1_:6.1f}s  PAUSE: {gap:.2f}s mid-sentence after '{wtk}'")
        elif gap > a.midgap * 1.6: notes.append(f"{lid} @{p1_:6.1f}s  long pause {gap:.2f}s after '{wtk}'")
    elif own[jb] != own[ja] and gap > a.linegap: notes.append(f"{lid} @{p1_:6.1f}s  long gap between lines: {gap:.2f}s")
span = (W[-1][2] - W[0][1]) if W else 1; wpm = len(E) / span * 60
for li, l in enumerate(L):
    ws = [W[j] for j in range(len(W)) if own[j] == li]
    if len(ws) > 3:
        r = len(toks(l['text'])) / max(ws[-1][2] - ws[0][1], 0.3) * 60
        if r > wpm * 1.3 or r < wpm * 0.7: notes.append(f"{l['id']}  pace {r:.0f} wpm vs clip {wpm:.0f}")
rep = [f"# Voice audit: {a.clip.split('/')[-1]}  ({L[0]['id']}-{L[-1]['id']}, {len(L)} lines)",
       f"Pace {wpm:.0f} wpm · loudness {lv['input_i']} LUFS · true peak {lv['input_tp']} dBTP",
       f"## Problems ({len(probs)})", *(probs or ['none']), f"## To listen ({len(notes)})", *(notes or ['none'])]
open(a.out or a.clip.rsplit('.', 1)[0] + '_voice_audit.md', 'w').write('\n'.join(rep) + '\n'); print('\n'.join(rep))
sys.exit(1 if probs else 0)
