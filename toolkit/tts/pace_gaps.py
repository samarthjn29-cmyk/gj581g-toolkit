#!/usr/bin/env python3
"""Bring a narration under a words-a-minute ceiling by lengthening its pauses only (Sam, 20 Nov 2026: "Narration pace:
140-150 words a minute is fine; it should never cross 150"; his ElevenLabs audio is final, so the words are never touched).

Silence is inserted inside the existing pauses after sentence ends (and longer after paragraph ends), at the quietest
20 ms of each pause, with 8 ms fades so there is no click. Nothing else changes: no stretch, no pitch, no level.
Usage: pace_gaps.py IN.mp3|wav WORDS.json OUT.wav OUT_WORDS.json --words N --wpm 148 [--para "word|word|..."]
  WORDS.json: [[word, start, end], ...] from faster-whisper (word_timestamps) on IN.
  --words: the script's spoken word count (numbers as words); pace = N / (last word end - first word start).
  --para: words (with their full stop) that end a paragraph, in order, e.g. "1794.|Colours.|candlelight."; each gets
          2.5x the sentence share. Comma pauses are left alone.
Writes the new audio and the shifted word times, and prints the old and new pace."""
import sys, json, subprocess
import numpy as np, soundfile as sf
a = sys.argv[1:]; src, wj, out, owj = a[:4]
opt = lambda k, d: a[a.index(k) + 1] if k in a else d
N = int(opt('--words', 0)); WPM = float(opt('--wpm', 148)); PARA = [p for p in opt('--para', '').split('|') if p]
W = json.load(open(wj))
if src.endswith('.wav'): x, sr = sf.read(src, dtype='float32')
else:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '1', '-ar', '44100', '-'], capture_output=True).stdout
    x, sr = np.frombuffer(raw, dtype='float32').copy(), 44100
if x.ndim > 1: x = x.mean(1)
span = W[-1][2] - W[0][1]; need = N / WPM * 60 - span
print(f'before: {N} words over {span:.1f} s = {N / span * 60:.1f} wpm; need +{max(need, 0):.2f} s')
if need <= 0: sf.write(out, x, sr); json.dump(W, open(owj, 'w')); sys.exit(0)
# candidate pauses: after a sentence end, not after the last word
pi, gaps = 0, []
for i in range(len(W) - 1):
    w = W[i][0].strip()
    if not w.endswith(('.', '?', '!')): continue
    para = pi < len(PARA) and w == PARA[pi]
    if para: pi += 1
    gaps.append([i, 2.5 if para else 1.0])
if pi < len(PARA): sys.exit(f'paragraph word not found in order: {PARA[pi]}')
unit = need / sum(g[1] for g in gaps)
ins = []  # (sample position, seconds)
for i, wt in gaps:
    s, e = int(W[i][2] * sr), int(W[i + 1][1] * sr)
    seg = x[s:e]; win = int(0.02 * sr)
    if len(seg) > win:
        en = np.convolve(seg ** 2, np.ones(win), 'valid'); p = s + int(np.argmin(en)) + win // 2
    else: p = (s + e) // 2
    ins.append((p, wt * unit, i))
y, last, f = [], 0, int(0.008 * sr)
for p, d, i in ins:
    a_ = x[last:p].copy()
    if len(a_) > f: a_[-f:] *= np.linspace(1, 0, f)
    y += [a_, np.zeros(int(d * sr), dtype='float32')]
    last = p
    b = x[p:p + f]; x[p:p + f] = b * np.linspace(0, 1, len(b))
y.append(x[last:]); y = np.concatenate(y)
sf.write(out, y, sr, subtype='PCM_24')
shift, k, NW = 0.0, 0, []
for j, (w, s, e) in enumerate(W):
    while k < len(ins) and ins[k][2] < j: shift += ins[k][1]; k += 1
    NW.append([w, round(s + shift, 3), round(e + shift, 3)])
json.dump(NW, open(owj, 'w'))
span2 = NW[-1][2] - NW[0][1]
print(f'after: {len(ins)} pauses lengthened (sentence +{unit:.2f} s, paragraph +{2.5 * unit:.2f} s); {span2:.1f} s = {N / span2 * 60:.1f} wpm')
