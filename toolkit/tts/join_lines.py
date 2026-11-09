#!/usr/bin/env python3
"""Join line takes from voice_lines.py into one narration with clean silent pauses; no stretching, no pitch change.
Pause after a line: PAUSE (0.75 s); after a chapter's last line: 1.2 s. Depth/warmth from EQ only (low shelf +2 dB at 140 Hz,
-2 dB high shelf at 5 kHz), then loudness to -16 LUFS. Writes OUT.wav and OUT_timing.json (lines with start/end).
Usage: join_lines.py SCRIPT.json LINEDIR OUT.wav OUT_timing.json SCENE [SCENE ...]  env: PAUSE (0.75) LEAD (0.4)"""
import sys, os, json, subprocess, tempfile, numpy as np, soundfile as sf
sj, d, out, otj = sys.argv[1:5]; scenes = sys.argv[5:]
PAUSE = float(os.environ.get('PAUSE', '0.75')); LEAD = float(os.environ.get('LEAD', '0.4'))
S = json.load(open(sj)); L = [dict(l) for l in (S['lines'] if isinstance(S, dict) else S) if l['scene'] in scenes]
parts = []; t = LEAD; sr = None; sil = lambda s: np.zeros(int(s * sr), dtype=np.float32)
for i, l in enumerate(L):
    a, sr = sf.read(f"{d}/{l['id']}.wav", dtype='float32')
    if not parts: parts.append(sil(LEAD))
    l['start'] = round(t, 3); t += len(a) / sr; l['end'] = round(t, 3); l['words'] = []
    last = i == len(L) - 1 or L[i + 1]['scene'] != l['scene']
    p = 1.2 if last else PAUSE
    parts += [a, sil(p)]; t += p
y = np.concatenate(parts)
with tempfile.TemporaryDirectory() as td:
    sf.write(f'{td}/i.wav', y, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{td}/i.wav', '-af',
                    'highpass=f=60,lowshelf=f=140:g=2,highshelf=f=5000:g=-2,loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', out], check=True)
n = sum(len(l['text'].split()) for l in L)
json.dump(dict(total=round(t, 3), lines=L), open(otj, 'w'), indent=1)
print(f'{len(L)} lines, {n} words, {t:.1f} s, {n / t * 60:.0f} wpm')
