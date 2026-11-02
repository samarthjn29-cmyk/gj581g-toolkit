#!/usr/bin/env python3
"""Animatic voice (2 Nov 2026): Kokoro reads the storyboard script line by line at natural speed (never sped up) and writes
vo.wav + timing.json in the same shape the clone's assemble step writes (lines with start/end; no per-word times, so cues and
captions fall back to estimated word times inside each line). Used by build.py when project.json has "voice_mode": "kokoro".
Usage: KOKORO_DIR=/home/claude/kokoro kokoro_lines.py script.json voice_id vo.wav timing.json
Reads each line's `text` (what the viewer sees), not the clone's `say` respelling."""
import sys, os, json, numpy as np
os.environ.setdefault('KOKORO_DIR', '/home/claude/kokoro')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from synth import tts, trim, SR
from scipy.io import wavfile

lines = json.load(open(sys.argv[1])); voice = sys.argv[2]
GAP_LINE, GAP_SCENE, LEAD, TAIL = 0.32, 0.55, 0.6, 1.6
out = [np.zeros(int(LEAD * SR), np.float32)]; t = LEAD; tim = []; prev = None; miss = set()
for L in lines:
    if prev and prev != L['scene']:
        out.append(np.zeros(int((GAP_SCENE - GAP_LINE) * SR), np.float32)); t += GAP_SCENE - GAP_LINE
    a, m = tts(L['text'], voice, 1.0); miss |= m; a = trim(a).astype(np.float32)
    tim.append(dict(L, start=round(t, 3), end=round(t + len(a) / SR, 3)))
    out.append(a); t += len(a) / SR
    out.append(np.zeros(int(GAP_LINE * SR), np.float32)); t += GAP_LINE; prev = L['scene']
out.append(np.zeros(int(TAIL * SR), np.float32)); t += TAIL
a = np.concatenate(out); a = a / np.max(np.abs(a)) * 0.89
os.makedirs(os.path.dirname(os.path.abspath(sys.argv[3])), exist_ok=True)
wavfile.write(sys.argv[3], SR, (a * 32767).astype(np.int16))
json.dump(dict(total=round(t, 3), lines=tim, voice='kokoro:' + voice), open(sys.argv[4], 'w'), indent=1)
print('total', round(t, 2), 'missing words', sorted(miss))
