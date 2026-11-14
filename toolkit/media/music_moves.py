#!/home/claude/cbenv/bin/python3
"""Music moves (Sam, 14 Nov 2026: library categories -> "build ... music moves"). In-house, no credit.
  key BED.wav            -> BED.wav.key.json (Krumhansl key estimate from the chroma of the first 90 s)
  sting BED.wav OUT.wav  -> a chord stab in the bed's key (tonic triad, plucked + soft brass), for a punchline or reveal
  button BED.wav OUT.wav -> a "button" ending: the tonic chord with a low hit, 3 s ring-out; pair with mix_bed --button T
The mix side (mix_bed.py): --thin A:B (the bed thins to a narrow mid band, like one instrument left), --lift T (the bed lifts
a semitone from T, the key-change lift at a turn), --button T (the bed cuts on T with a 0.12 s tail so the button chord lands)."""
import sys, json, numpy as np, librosa
from scipy.io import wavfile
SR = 48000
N = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
MAJ = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]); MIN = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
def key(bed):
    y, sr = librosa.load(bed, sr=22050, duration=90); ch = librosa.feature.chroma_cqt(y=y, sr=sr).mean(1)
    best = max([(np.corrcoef(np.roll(MAJ, k), ch)[0, 1], k, 'major') for k in range(12)] + [(np.corrcoef(np.roll(MIN, k), ch)[0, 1], k, 'minor') for k in range(12)])
    k = {'tonic': N[best[1]], 'pc': int(best[1]), 'mode': best[2], 'fit': round(float(best[0]), 2)}; json.dump(k, open(bed + '.key.json', 'w')); return k
def chord(k, octave=3):
    root = 440 * 2 ** ((k['pc'] - 9) / 12 + (octave - 4)); third = 3 if k['mode'] == 'minor' else 4
    return [root, root * 2 ** (third / 12), root * 2 ** (7 / 12), root * 2]
def pluck(f, d):
    n = int(d * SR); P = int(SR / f); rng = np.random.default_rng(int(f)); buf = rng.uniform(-1, 1, P); out = np.zeros(n)
    for i in range(n): out[i] = buf[i % P]; buf[i % P] = 0.995 * 0.5 * (buf[i % P] + buf[(i + 1) % P])
    return out
def brass(f, d):
    t = np.arange(int(d * SR)) / SR; e = np.minimum(1, t / 0.05) * np.exp(-t * 1.6)
    return sum(np.sin(2 * np.pi * f * h * t) / h ** 1.3 for h in range(1, 7)) * e
def write(x, out): x = x / (np.abs(x).max() + 1e-9) * 0.7; wavfile.write(out, SR, (x * 32767).astype(np.int16))
if __name__ == '__main__':
    cmd, bed = sys.argv[1], sys.argv[2]
    try: k = json.load(open(bed + '.key.json'))
    except Exception: k = key(bed)
    if cmd == 'key': print(k)
    if cmd == 'sting':
        d = 1.6; x = sum(pluck(f, d) for f in chord(k, 3)) + 0.35 * sum(brass(f, d) for f in chord(k, 3)[:3]); write(x, sys.argv[3]); print(sys.argv[3], k)
    if cmd == 'button':
        d = 3.0; t = np.arange(int(d * SR)) / SR; low = np.sin(2 * np.pi * 45 * t) * np.exp(-t * 2.5)
        x = sum(pluck(f, d) for f in chord(k, 2) + chord(k, 3)) + 0.5 * sum(brass(f, d) for f in chord(k, 2)[:3]) + 1.2 * low; write(x, sys.argv[3]); print(sys.argv[3], k)
