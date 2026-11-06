#!/usr/bin/env python3
"""Give the narration room to breathe without touching the speech (7 Nov 2026, vector-world pilot: the clone read Plato's Cave
at about 200 words a minute; Emergence runs 152-171, with a music bed filling the pauses).
Inserts silence at sentence ends (after . ? ! :) and longer silence at scene changes, cutting only inside the existing
gap between two words, then shifts every word time in timing.json to match. Nothing is stretched or sped up.
Usage: breathe.py vo.wav timing.json out.wav out_timing.json [--sentence 0.35] [--comma 0.0] [--scene 0.8]"""
import sys, json, re, wave, numpy as np
a = sys.argv; vo, tj, out, otj = a[1:5]
opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
SENT, COMMA, SCENE = opt('--sentence', 0.35), opt('--comma', 0.0), opt('--scene', 0.8)
w = wave.open(vo); sr = w.getframerate(); ch = w.getnchannels(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, ch); w.close()
T = json.load(open(tj)); cuts = []   # (time, seconds to insert)
prev_scene = None
for li, l in enumerate(T['lines']):
    toks = re.findall(r"[A-Za-z0-9']+[.,?!:;]?", l['text']); W = l['words']
    if len(toks) != len(W): print('word count differs, skipping pauses in', l['id']); toks = [''] * len(W)
    if prev_scene is not None and l.get('scene') != prev_scene: cuts.append(((T['lines'][li - 1]['end'] + l['start']) / 2, SCENE))
    elif li: cuts.append(((T['lines'][li - 1]['end'] + l['start']) / 2, SENT))
    for i in range(len(W) - 1):
        p = toks[i][-1:] if toks[i] else ''
        add = SENT if p in '.?!:' and p else COMMA if p in ',;' and p else 0
        if add: cuts.append(((W[i][2] + W[i + 1][1]) / 2, add))
    prev_scene = l.get('scene')
cuts.sort(); parts = []; last = 0
for tc, add in cuts:
    i = int(tc * sr); parts += [x[last:i], np.zeros((int(add * sr), ch), np.int16)]; last = i
parts.append(x[last:]); y = np.concatenate(parts)
o = wave.open(out, 'wb'); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr); o.writeframes(y.tobytes()); o.close()
shift = lambda t: t + sum(add for tc, add in cuts if tc < t)
for l in T['lines']:
    l['start'], l['end'] = round(shift(l['start']), 3), round(shift(l['end']), 3)
    l['words'] = [[ww, round(shift(s), 3), round(shift(e), 3)] for ww, s, e in l['words']]
T['total'] = round(len(y) / sr, 3); T['breathe'] = {'sentence': SENT, 'comma': COMMA, 'scene': SCENE}
json.dump(T, open(otj, 'w'), indent=1)
n = sum(len(l['words']) for l in T['lines'])
print(f"{len(cuts)} pauses added, {len(x) / sr:.1f} s -> {len(y) / sr:.1f} s; {n / (T['lines'][-1]['end'] - T['lines'][0]['start']) * 60:.0f} words a minute")
