#!/usr/bin/env python3
"""Narrate a script with a Kokoro voice or a blend of voices, the Emergence way (7 Nov 2026, Sam: "find a synthetic voice
which sounds as close to me as possible ... following the voice settings of Emergence"): steady pace (target words a minute
inside sentences, set with Kokoro's own speed, never by stretching audio), each sentence voiced on its own, even pauses
(sentence 0.35 s, line 0.40 s, scene 0.80 s; overall about 155-160 wpm like Emergence), clean silence (no breaths: the model makes none).
Usage: KOKORO_DIR=/home/claude/kokoro kokoro_narrate.py script.json "bm_fable:1,am_echo:1,hm_omega:1" out.wav timing.json [--wpm 168] [--notes voice_notes.json]"""
import sys, os, re, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); os.environ.setdefault('KOKORO_DIR', '/home/claude/kokoro')
import synth
from scipy.io import wavfile
a = sys.argv; S = json.load(open(a[1])); S = S['lines'] if isinstance(S, dict) else S
mix = {k: float(w) for k, w in (p.split(':') for p in a[2].split(','))}; tot = sum(mix.values())
synth.voices = dict(synth.voices); synth.voices['_mix'] = sum(synth.voices[k] * w / tot for k, w in mix.items())
WPM = float(a[a.index('--wpm') + 1]) if '--wpm' in a else 180.0
SENT, LINE, SCENE, LEAD, TAIL = 0.35, 0.40, 1.20, 0.5, 1.5  # scene 1.2 s (was 0.8): room for the chapter card
from num2words import num2words
def spoken(t):  # numbers as a narrator says them: years and catalogue numbers in pairs, decades, AD
    def dec(m):
        w = num2words(int(m.group(1)), to='year')
        if w.endswith('hundred'): return w + 's'          # 1800s -> eighteen hundreds
        if w.endswith('thousand'): return w + 's'         # 2000s -> two thousands
        return w[:-1] + 'ies' if w.endswith('y') else w + 's'   # 1980s -> nineteen eighties
    t = re.sub(r"\b(\d{4})s\b", dec, t)
    t = re.sub(r"\b(\d{4})\b", lambda m: num2words(int(m.group(1)), to='year'), t)
    t = re.sub(r"\b(\d+) AD\b", lambda m: num2words(int(m.group(1))) + ' A D', t)
    t = re.sub(r"(?<!#)\b\d+\b", lambda m: num2words(int(m.group())), t)  # not the read#2 pronunciation picks
    return t
def say(t, sp): x, m = synth.tts(spoken(t), '_mix', sp); return synth.trim(x).astype(np.float32), m
# calibrate speed on the whole script: words per second of pure speech at speed 1.0
allw = ' '.join(l['text'] for l in S); x1, _ = say(allw, 1.0); r1 = len(allw.split()) / (len(x1) / synth.SR) * 60
speed = WPM / r1; print(f'speed 1.0 reads {r1:.0f} wpm -> speed {speed:.3f} for {WPM:.0f}')
# Voice notes (7 Nov 2026 audit, Scrolls v1): --notes <file.json> {line id: {"say_k": "...", "after": s, "speed": x, "whole": true}}
#   say_k: spoken spelling (read#2 = 'reed'; numbers); after: pause after the line (beats, reveals, the guess);
#   speed: multiplier for that line (a new term said a little slower); whole: voice the line in one take (short fragments
#   voiced alone came out with rising, unfinished endings: 'Much harder.', 'Not peeled.').
# Defaults: chapter gap SCENE; a line ending in a question gets QPAUSE after it; a question inside a line gets 0.5 s.
# Speed guard: a sentence faster than MAXWPS words a second is voiced again slower (v1 had lines at 230 wpm, the first
# and last lines included, and swallowed endings: 'trained' -> 'train').
NOTES = json.load(open(a[a.index('--notes') + 1])) if '--notes' in a else {}
QPAUSE, MAXWPS = 0.75, 3.35
nwords = lambda p: len(re.findall(r"[A-Za-z0-9']+", spoken(p).replace('-', ' ')))
def say_paced(p, sp):
    x, m = say(p, sp); n = nwords(p); d = len(x) / synth.SR
    if n >= 4 and n / d > MAXWPS: x, m = say(p, sp * max(0.82, MAXWPS * 0.95 / (n / d)))
    return x, m
out = [np.zeros(int(LEAD * synth.SR), np.float32)]; t = LEAD; tim = []; prev = None; miss = set(); after = None
for L in S:
    N = NOTES.get(L['id'], {}); sp = speed * N.get('speed', 1.0)
    if prev is not None:
        g = after if after is not None else SCENE if L['scene'] != prev else LINE; out.append(np.zeros(int(g * synth.SR), np.float32)); t += g
    st = t; txt = N.get('say_k', L.get('say_k', L['text']))  # say_k: spelling for Kokoro only (numbers, names, homographs)
    parts = [txt] if N.get('whole') else [p for p in re.split(r'(?<=[.?!])\s+', txt) if p.strip()]
    for i, p in enumerate(parts):
        x, m = say_paced(p, sp); miss |= m; out.append(x); t += len(x) / synth.SR
        if i < len(parts) - 1: g = 0.5 if p.rstrip().endswith('?') else SENT; out.append(np.zeros(int(g * synth.SR), np.float32)); t += g
    tim.append(dict(id=L['id'], scene=L['scene'], text=L['text'], start=round(st, 3), end=round(t, 3))); prev = L['scene']
    nxt = S[S.index(L) + 1] if S.index(L) + 1 < len(S) else None
    after = N.get('after', QPAUSE if L['text'].rstrip().endswith('?') and nxt and nxt['scene'] == L['scene'] else None)
out.append(np.zeros(int(TAIL * synth.SR), np.float32)); t += TAIL
y = np.concatenate(out); y = y / np.abs(y).max() * 0.89
wavfile.write(a[3], synth.SR, (y * 32767).astype(np.int16))
nw = len(allw.split()); speech = sum(l['end'] - l['start'] for l in tim)
json.dump(dict(total=round(t, 3), lines=tim, voice='kokoro:' + a[2], speed=round(speed, 3)), open(a[4], 'w'), indent=1)
print(f'total {t:.1f} s; {nw / (tim[-1]["end"] - tim[0]["start"]) * 60:.0f} wpm overall; missing words {sorted(miss)}')
