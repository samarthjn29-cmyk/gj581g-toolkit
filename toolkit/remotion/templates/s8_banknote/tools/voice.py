# Placeholder VO (Kokoro) per line; writes vo.wav + timing.json. Natural speed (no speed-up).
import sys, os, json, numpy as np
os.environ.setdefault('KOKORO_DIR', '/home/claude/kokoro')
sys.path.insert(0, '/home/claude/gj581g-toolkit/toolkit/tts')
from synth import tts, trim, SR
from scipy.io import wavfile
lines = json.load(open(sys.argv[1])); voice = sys.argv[2]
GAP_LINE, GAP_SCENE, LEAD = 0.32, 0.55, 0.6
out = [np.zeros(int(LEAD*SR), np.float32)]; t = LEAD; tim = []; prev = None; miss = set()
for L in lines:
    if prev and prev != L['scene']:
        out.append(np.zeros(int((GAP_SCENE-GAP_LINE)*SR), np.float32)); t += GAP_SCENE-GAP_LINE
    a, m = tts(L['text'], voice, 1.0); miss |= m; a = trim(a).astype(np.float32)
    tim.append(dict(L, start=round(t,3), end=round(t+len(a)/SR,3)))
    out.append(a); t += len(a)/SR
    out.append(np.zeros(int(GAP_LINE*SR), np.float32)); t += GAP_LINE; prev = L['scene']
out.append(np.zeros(int(1.6*SR), np.float32)); t += 1.6
a = np.concatenate(out); a = a/np.max(np.abs(a))*0.89
wavfile.write(sys.argv[3], SR, (a*32767).astype(np.int16))
json.dump(dict(total=round(t,3), lines=tim), open(sys.argv[4],'w'), indent=1)
print('total', round(t,2), 'missing', miss)
