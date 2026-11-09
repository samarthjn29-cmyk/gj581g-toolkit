#!/usr/bin/env python3
"""Clean up a cloned narration so it plays like a studio read (Sam, 9 Nov 2026: "it has to come out clean ... 155 wpm").
1. Everything between words (clone breaths, clicks, mumbles after the last word) becomes clean silence: audio is kept only
   from 0.08 s before each word to 0.12 s after it, joined with 12 ms fades. The clone has no room noise, so silence is natural.
2. Every pause is set by punctuation, never left to the clone: sentence end -> SENT, comma/semicolon/colon/dash -> COMMA,
   no punctuation -> at most INWORD (the clone's own mid-sentence hesitations were the "weird pauses"), between lines -> SENT.
3. The result is slowed with rubberband (formants kept, high quality; not ffmpeg atempo) to reach the target pace.
Word times in the timing file are moved to match. Usage:
  clean_clone.py VO.wav TIMING.json OUT.wav OUT_timing.json [--wpm 155] [--sent 0.62] [--comma 0.28] [--inword 0.08]"""
import sys, json, subprocess, tempfile, os, numpy as np, soundfile as sf
a = sys.argv; vo, tj, out, otj = a[1:5]
opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
WPM, SENT, COMMA, INW = opt('--wpm', 155), opt('--sent', 0.62), opt('--comma', 0.28), opt('--inword', 0.08)
PRE, POST, FADE = 0.08, 0.12, 0.012
x, sr = sf.read(vo); x = x if x.ndim == 1 else x.mean(1)
T = json.load(open(tj)); L = T['lines']
W = []                                     # (line index, word index, start, end, trailing punctuation)
for li, l in enumerate(L):
    toks = l['text'].split()
    for wi, (w, s, e) in enumerate(l.get('words', [])):
        p = toks[wi][-1] if wi < len(toks) else ''
        if wi == len(l['words']) - 1: p = p if p in '.?!' else '.'   # a line end is a sentence end
        W.append([li, wi, s, e, p])
W.sort(key=lambda r: r[2])
f = int(FADE * sr); pieces = []; newt = []; pos = 0.0
def take(s0, s1):
    seg = x[max(0, int(s0 * sr)):int(s1 * sr)].copy()
    if len(seg) > 2 * f: seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    return seg
# group words into runs that are spoken continuously (gap < 0.2 s and no punctuation) so we never cut inside a word pair
i = 0
while i < len(W):
    j = i
    while j + 1 < len(W) and W[j + 1][2] - W[j][3] < 0.20 and W[j][4] not in '.?!,;:-—': j += 1
    s0 = W[i][2] - PRE; s1 = W[j][3] + POST
    if j + 1 < len(W): s1 = min(s1, (W[j][3] + W[j + 1][2]) / 2)            # never reach into the next word
    if i > 0: s0 = max(s0, (W[i - 1][3] + W[i][2]) / 2)
    seg = take(s0, s1)
    for k in range(i, j + 1): newt.append((W[k][0], W[k][1], pos + (W[k][2] - s0), pos + (W[k][3] - s0)))
    pieces.append(seg); pos += len(seg) / sr
    if j + 1 < len(W):
        p = W[j][4]; gap_now = W[j + 1][2] - W[j][3]
        target = SENT if p in '.?!' else COMMA if p in ',;:-—' else min(INW, gap_now)
        sil = max(0.0, target - (PRE + POST))                               # the kept margins already count as pause
        pieces.append(np.zeros(int(sil * sr))); pos += sil
    i = j + 1
y = np.concatenate([np.zeros(int(0.3 * sr)), *pieces, np.zeros(int(0.5 * sr))]); lead = 0.3
nwords = sum(len(l['text'].split()) for l in L)
dur = len(y) / sr; tempo = min(1.0, dur / (nwords / (WPM / 60))) if WPM > 0 else 1.0   # <1 = slower
ratio = 1 / tempo                                                            # time stretch factor (>1 = slower)
if ratio > 1.001:
    with tempfile.TemporaryDirectory() as d:
        sf.write(f'{d}/i.wav', y, sr)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{d}/i.wav', '-af', f'rubberband=tempo={tempo:.4f}:pitch=1:transients=crisp:detector=compound:window=standard:phase=laminar', f'{d}/o.wav'], check=True)
        y, _ = sf.read(f'{d}/o.wav')
sf.write(out, y, sr)
by = {}
for li, wi, s, e in newt: by[(li, wi)] = (round((s + lead) * ratio, 3), round((e + lead) * ratio, 3))
for li, l in enumerate(L):
    ws = l.get('words', [])
    l['words'] = [[w, *by[(li, wi)]] for wi, (w, _, _) in enumerate(ws) if (li, wi) in by]
    if l['words']: l['start'], l['end'] = l['words'][0][1], l['words'][-1][2]
T['total'] = round(len(y) / sr, 3); T['clean_clone'] = dict(wpm=WPM, tempo=round(tempo, 4), sent=SENT, comma=COMMA, inword=INW)
json.dump(T, open(otj, 'w'), indent=1)
print(f'{len(L)} lines, {nwords} words: {len(x) / sr:.1f} s -> {len(y) / sr:.1f} s, {nwords / (len(y) / sr) * 60:.0f} wpm (tempo {tempo:.3f})')
