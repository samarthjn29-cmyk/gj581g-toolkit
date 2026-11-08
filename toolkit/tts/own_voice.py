#!/usr/bin/env python3
"""Sam's own recorded narration -> paced vo.wav + timing.json in the clone pipeline's format (8 Nov 2026).
Sam reads the script and ad-libs; the script follows what he said (new words are reported for the fact-check).
Usage: own_voice.py RAW.wav SCRIPT.json SCENE OUT.wav OUT_timing.json [--channel 0] [--drop 59.9-67.9 ...]
                    [--maxgap 1.0] [--keepgap 0.85] [--lead 0.5]
  --drop A-B   cut a stretch of the raw take (a fluffed line, a repeated take); cut points should sit in silence
  --maxgap     any pause longer than this (s) is shortened to --keepgap by removing its middle (never stretched)
Writes OUT_timing.json {total, lines:[script line + start/end/words + heard], diff:[...]} and prints the diff:
  each line's script text vs what was heard, so ad-libs and slips can be checked (facts -> fact-check; slips -> retake).
Uses faster-whisper medium.en on the raw take (word times), then edits audio and times together."""
import sys, json, re, difflib, numpy as np, soundfile as sf, librosa
a = sys.argv; raw, sj, scene, out_wav, out_tj = a[1:6]
opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
CH = int(opt('--channel', 0)); MAXGAP = opt('--maxgap', 1.0); KEEP = opt('--keepgap', 0.85); LEAD = opt('--lead', 0.5)
drops = [tuple(float(v) for v in a[i + 1].split('-')) for i, x in enumerate(a) if x == '--drop']
x, sr = sf.read(raw, dtype='float32'); x = x[:, CH] if x.ndim > 1 else x
from faster_whisper import WhisperModel
wm = WhisperModel('medium.en', device='cpu', compute_type='int8')
segs, _ = wm.transcribe(librosa.resample(x, orig_sr=sr, target_sr=16000), beam_size=5, word_timestamps=True)
W = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
W = [w for w in W if not any(d0 <= w[1] < d1 for d0, d1 in drops)]          # words inside dropped stretches go
# keep-list of raw intervals: from (first word - LEAD) to (last word + 0.6), minus drops, minus long-gap middles
cuts = list(drops)
for (_, _, e0), (_, s1, _) in zip(W, W[1:]):
    if s1 - e0 > MAXGAP and not any(d0 <= e0 < d1 or d0 < s1 <= d1 for d0, d1 in drops):
        h = KEEP / 2; cuts.append((e0 + h, s1 - h))
t_beg, t_end = max(0, W[0][1] - LEAD), min(len(x) / sr, W[-1][2] + 0.6)
cuts = sorted(c for c in cuts if c[1] > c[0]); keep = []; cur = t_beg
for c0, c1 in cuts:
    if c0 > cur: keep.append((cur, min(c0, t_end)))
    cur = max(cur, c1)
if cur < t_end: keep.append((cur, t_end))
XF = int(0.015 * sr); parts = []; mapping = []; pos = 0.0
for k0, k1 in keep:
    seg = x[int(k0 * sr):int(k1 * sr)].copy()
    if parts and len(seg) > XF:                                               # 15 ms crossfade at each join
        prev = parts[-1]; r = np.linspace(0, 1, XF)
        prev[-XF:] = prev[-XF:] * (1 - r) + seg[:XF] * r; seg = seg[XF:]; pos -= XF / sr
    mapping.append((k0, k1, pos)); parts.append(seg); pos += len(seg) / sr + (XF / sr if len(parts) > 1 else 0)
y = np.concatenate(parts); sf.write(out_wav, y, sr)
def tmap(t):
    for k0, k1, p in mapping:
        if k0 - 1e-3 <= t <= k1 + 1e-3: return round(p + (t - k0), 3)
    return None
W = [(w, tmap(s), tmap(e)) for w, s, e in W]; W = [w for w in W if w[1] is not None and w[2] is not None]
# align heard words to the script lines of this scene
S = json.load(open(sj)); L = [dict(l) for l in (S['lines'] if isinstance(S, dict) else S) if l['scene'] == scene]
norm = lambda w: re.sub(r"[^a-z0-9']", '', w.lower().replace('’', "'"))
E = [(li, norm(w)) for li, l in enumerate(L) for w in l['text'].split()]; H = [norm(w[0]) for w in W]
sm = difflib.SequenceMatcher(None, [e[1] for e in E], H, autojunk=False); owner = [None] * len(H)
for tag, i0, i1, j0, j1 in sm.get_opcodes():
    for j in range(j0, j1):                       # heard word j belongs to the script line of the nearest matched script word
        i = min(i0 + (j - j0), i1 - 1) if i1 > i0 else max(i0 - 1, 0)
        owner[j] = E[min(i, len(E) - 1)][0]
diff = []
for li, l in enumerate(L):
    ws = [W[j] for j in range(len(W)) if owner[j] == li]
    l['words'] = [[norm(w), s, e] for w, s, e in ws]; l['heard'] = ' '.join(w for w, _, _ in ws)
    if ws: l['start'], l['end'] = ws[0][1], ws[-1][2]
    a_, b_ = [norm(w) for w in l['text'].split()], [norm(w) for w, _, _ in ws]
    if a_ != b_:
        ops = [(t, ' '.join(a_[i0:i1]), ' '.join(b_[j0:j1])) for t, i0, i1, j0, j1 in difflib.SequenceMatcher(None, a_, b_).get_opcodes() if t != 'equal']
        diff.append(dict(id=l['id'], script=l['text'], heard=l['heard'], changes=ops))
json.dump(dict(total=round(len(y) / sr, 3), lines=L, diff=diff, source=raw, drops=drops), open(out_tj, 'w'), indent=1)
print(f'{scene}: raw {len(x) / sr:.1f} s -> {len(y) / sr:.1f} s, {len(W)} words, {len(diff)} lines differ from the script')
for d in diff: print(f"  {d['id']}: " + '; '.join(f"{t}: '{s}' -> '{h}'" for t, s, h in d['changes']))
