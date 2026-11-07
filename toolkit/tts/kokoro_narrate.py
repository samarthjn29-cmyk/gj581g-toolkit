#!/usr/bin/env python3
"""Narrate a script with a Kokoro voice or a blend of voices, the Emergence way (7 Nov 2026, Sam: "find a synthetic voice
which sounds as close to me as possible ... following the voice settings of Emergence"): steady pace (target words a minute
inside sentences, set with Kokoro's own speed, never by stretching audio), each sentence voiced on its own, even pauses
(sentence 0.35 s, line 0.40 s, scene 0.80 s; overall about 155-160 wpm like Emergence), clean silence (no breaths: the model makes none).
Usage: KOKORO_DIR=/home/claude/kokoro kokoro_narrate.py script.json "bm_fable:1,am_echo:1,hm_omega:1" out.wav timing.json [--wpm 168]"""
import sys, os, re, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); os.environ.setdefault('KOKORO_DIR', '/home/claude/kokoro')
import synth
from scipy.io import wavfile
a = sys.argv; S = json.load(open(a[1])); S = S['lines'] if isinstance(S, dict) else S
mix = {k: float(w) for k, w in (p.split(':') for p in a[2].split(','))}; tot = sum(mix.values())
synth.voices = dict(synth.voices); synth.voices['_mix'] = sum(synth.voices[k] * w / tot for k, w in mix.items())
WPM = float(a[a.index('--wpm') + 1]) if '--wpm' in a else 180.0
SENT, LINE, SCENE, LEAD, TAIL = 0.35, 0.40, 0.80, 0.5, 1.5
def say(t, sp): x, m = synth.tts(t, '_mix', sp); return synth.trim(x).astype(np.float32), m
# calibrate speed on the whole script: words per second of pure speech at speed 1.0
allw = ' '.join(l['text'] for l in S); x1, _ = say(allw, 1.0); r1 = len(allw.split()) / (len(x1) / synth.SR) * 60
speed = WPM / r1; print(f'speed 1.0 reads {r1:.0f} wpm -> speed {speed:.3f} for {WPM:.0f}')
out = [np.zeros(int(LEAD * synth.SR), np.float32)]; t = LEAD; tim = []; prev = None; miss = set()
for L in S:
    if prev is not None:
        g = SCENE if L['scene'] != prev else LINE; out.append(np.zeros(int(g * synth.SR), np.float32)); t += g
    st = t; parts = [p for p in re.split(r'(?<=[.?!])\s+', L['text']) if p.strip()]
    for i, p in enumerate(parts):
        x, m = say(p, speed); miss |= m; out.append(x); t += len(x) / synth.SR
        if i < len(parts) - 1: out.append(np.zeros(int(SENT * synth.SR), np.float32)); t += SENT
    tim.append(dict(id=L['id'], scene=L['scene'], text=L['text'], start=round(st, 3), end=round(t, 3))); prev = L['scene']
out.append(np.zeros(int(TAIL * synth.SR), np.float32)); t += TAIL
y = np.concatenate(out); y = y / np.abs(y).max() * 0.89
wavfile.write(a[3], synth.SR, (y * 32767).astype(np.int16))
nw = len(allw.split()); speech = sum(l['end'] - l['start'] for l in tim)
json.dump(dict(total=round(t, 3), lines=tim, voice='kokoro:' + a[2], speed=round(speed, 3)), open(a[4], 'w'), indent=1)
print(f'total {t:.1f} s; {nw / (tim[-1]["end"] - tim[0]["start"]) * 60:.0f} wpm overall; missing words {sorted(miss)}')
