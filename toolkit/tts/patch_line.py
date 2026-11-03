# Re-voice ONE line inside an already voiced scene and splice it in (3 Nov 2026: a bad word used to mean re-voicing the
# whole scene, 8 tries x 4 lines). The neighbours stay exactly as they were; only the line between them is replaced.
# The line is found between the end of the previous line and the start of the next (both located by Whisper word times),
# so it works even when the line's wording changed. The new take goes through the same checks as clone_scenes.py.
# Usage: cbx/bin/python3 patch_line.py script.json voice_profile_dir takes_dir LINE_ID [LINE_ID ...]
# Then: build.py project.json --from align   (re-times the scene, re-mixes, renders)
import sys, os, json, shutil, subprocess, difflib, tempfile, numpy as np, soundfile as sf, librosa
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(sys.argv[1])); ref, takes = sys.argv[2], sys.argv[3]; ids = sys.argv[4:]
HERE = os.path.dirname(os.path.abspath(__file__)); PY = sys.executable
import re
from num2words import num2words
def toks(s):  # same normalisation as clone_scenes.py
    s = s.lower().replace('%', ' percent ').replace('’', "'").replace('pay slip', 'payslip').replace('take away', 'takeaway')
    s = re.sub(r'(\d+)\.(\d+)', lambda x: num2words(int(x.group(1))) + ' point ' + ' '.join('oh' if d == '0' else num2words(int(d)) for d in x.group(2)), s)
    s = re.sub(r'\d+', lambda x: num2words(int(x.group()), to='year') if len(x.group()) == 4 else num2words(int(x.group())), s)
    s = re.sub(r'\bone (hundred|thousand)\b', r'a \1', s)
    return re.sub(r"[^a-z' ]", ' ', s.replace('-', ' ')).split()
from faster_whisper import WhisperModel
wm = WhisperModel('small.en', device='cpu', compute_type='int8')

def quiet_point(a, sr, t, direction, span=0.45):
    """the quietest 20 ms inside [t, t+span] (direction +1) or [t-span, t] (-1): a clean place to cut"""
    F = int(sr * 0.02); lo, hi = (t, t + span) if direction > 0 else (t - span, t)
    i0, i1 = max(0, int(lo * sr)), min(len(a), int(hi * sr)); best, bt = 1e9, t
    for i in range(i0, max(i0 + 1, i1 - F), F // 2):
        e = float(np.sqrt(np.mean(a[i:i + F] ** 2)) + 1e-9)
        if e < best: best, bt = e, (i + F / 2) / sr
    return bt

for lid in ids:
    L = next(l for l in S if l['id'] == lid); sc = L['scene']; SL = [l for l in S if l['scene'] == sc]; k = SL.index(L)
    wav = f'{takes}/{sc}.wav'; a, sr = sf.read(wav)
    if not os.path.exists(wav + '.orig'): shutil.copy(wav, wav + '.orig')  # first patch keeps the original take
    segs, _ = wm.transcribe(librosa.resample(a.astype(np.float32), orig_sr=sr, target_sr=16000), language='en', word_timestamps=True)
    H = [(tk, w.start, w.end) for s_ in segs for w in s_.words for tk in toks(w.word)]
    def span(lines):  # heard time span of these script lines, matched by tokens
        exp = [t for l in lines for t in toks(l.get('say', l['text']))]
        sm = difflib.SequenceMatcher(None, [x[0] for x in H], exp, autojunk=False); hit = [i for b in sm.get_matching_blocks() for i in range(b.a, b.a + b.size)]
        return (H[hit[0]][1], H[hit[-1]][2]) if hit else None
    t0 = 0.0 if k == 0 else quiet_point(a, sr, span(SL[k - 1:k])[1], +1)
    t1 = len(a) / sr if k == len(SL) - 1 else quiet_point(a, sr, span(SL[k + 1:k + 2])[0], -1)
    # voice the line alone, with every check, as a one-line scene
    tmp = tempfile.mkdtemp(); one = dict(L, scene='patch'); json.dump([one], open(f'{tmp}/s.json', 'w'))
    rc = subprocess.run([PY, f'{HERE}/clone_scenes.py', f'{tmp}/s.json', ref, tmp, 'patch'], env=dict(os.environ, PYTHONUNBUFFERED='1')).returncode
    if rc or not os.path.exists(f'{tmp}/patch.wav'): sys.exit(f'{lid}: voicing failed')
    lg = json.load(open(f'{tmp}/log.json'))['patch']; b, sr2 = sf.read(f'{tmp}/patch.wav')
    if sr2 != sr: b = librosa.resample(b.astype(np.float32), orig_sr=sr2, target_sr=sr).astype(np.float64)
    old = a[int(t0 * sr):int(t1 * sr)]; rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-9)
    b = b * (rms(old) / rms(b))  # match the scene's loudness
    pad = lambda d: np.zeros(int(sr * d))
    lead = 0.0 if k == 0 else 0.12; tail = 0.0 if k == len(SL) - 1 else 0.12  # breathing room at the cut points
    new = np.concatenate([a[:int(t0 * sr)], pad(lead), b, pad(tail), a[int(t1 * sr):]])
    sf.write(wav, new, sr)
    print(f"{lid}: replaced {t0:.2f}-{t1:.2f} s of {sc}.wav with a {len(b) / sr:.2f} s take | words {lg['words']} sim {lg['sim']} ok {lg['ok']} | {lg['heard']}")
    shutil.rmtree(tmp, ignore_errors=True)
