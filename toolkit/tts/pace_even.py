#!/usr/bin/env python3
"""Bring a narration under a words-a-minute ceiling with EVEN pauses (Sam, 22 Nov 2026, WCL-E01 act 2: "certain pauses
seem a bit long"). pace_gaps.py adds the same amount to every sentence pause (and 2.5x at paragraph ends), so pauses
that were already long in the take became 1.6-2.3 s. This version gives every pause a TARGET length instead:
  commas (, ; :)  lengthened up to a floor of --comma (default 0.32 s; never shortened);
  sentence ends   lengthened up to a common length Ts, solved so the pace lands on --wpm;
  paragraph ends  lengthened up to --para-len (default 1.3 s; Ts if that is larger).
Silence only, inserted at the quietest 20 ms inside each pause, 8 ms fades; no pause is ever shortened and nothing else
changes (no stretch, no pitch, no level). Sam's audio is final.
Usage: pace_even.py IN.mp3|wav WORDS.json OUT.wav OUT_WORDS.json --words N --wpm 149.5 --para "word.|word.|..."
       [--comma 0.32] [--para-len 1.3]"""
import sys, json, subprocess
import numpy as np, soundfile as sf

a = sys.argv[1:]
src, wj, out, owj = a[:4]
opt = lambda k, d: a[a.index(k) + 1] if k in a else d
N = int(opt("--words", 0)); WPM = float(opt("--wpm", 149.5)); TC = float(opt("--comma", 0.32)); TP = float(opt("--para-len", 1.3))
PARA = [p for p in opt("--para", "").split("|") if p]
W = json.load(open(wj))
if src.endswith(".wav"):
    x, sr = sf.read(src, dtype="float32")
else:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", "44100", "-"], capture_output=True).stdout
    x, sr = np.frombuffer(raw, dtype="float32").copy(), 44100
if x.ndim > 1:
    x = x.mean(1)
span = W[-1][2] - W[0][1]
need = N / WPM * 60 - span
print(f"before: {N} words over {span:.1f} s = {N / span * 60:.1f} wpm; need +{max(need, 0):.2f} s")
pi, gaps = 0, []  # (word index, kind, current gap)
for i in range(len(W) - 1):
    w = W[i][0].strip().rstrip('"”')
    g = W[i + 1][1] - W[i][2]
    if w.endswith((".", "?", "!")):
        para = pi < len(PARA) and W[i][0].strip() == PARA[pi]
        if para:
            pi += 1
        gaps.append((i, "p" if para else "s", g))
    elif w.endswith((",", ";", ":")):
        gaps.append((i, "c", g))
if pi < len(PARA):
    sys.exit(f"paragraph word not found in order: {PARA[pi]}")
comma_add = sum(max(0, TC - g) for _, k, g in gaps if k == "c")
lo, hi = 0.0, 4.0
for _ in range(80):
    Ts = (lo + hi) / 2
    add = comma_add + sum(max(0, (max(TP, Ts) if k == "p" else Ts) - g) for _, k, g in gaps if k != "c")
    lo, hi = (Ts, hi) if add < need else (lo, Ts)
if need <= 0:
    Ts = 0
plan = []
for i, k, g in gaps:
    tgt = TC if k == "c" else (max(TP, Ts) if k == "p" else Ts)
    d = max(0.0, tgt - g) if need > 0 else 0.0
    if d > 0.004:
        plan.append((i, d))
ins = []
win = int(0.02 * sr)
for i, d in plan:
    s, e = int(W[i][2] * sr), int(W[i + 1][1] * sr)
    if e - s < 3 * win:  # whisper's edges can touch: look for the quietest point just around the boundary
        s, e = max(0, (s + e) // 2 - int(0.06 * sr)), (s + e) // 2 + int(0.06 * sr)
    seg = x[s:e]
    en = np.convolve(seg ** 2, np.ones(win), "valid")
    p = s + int(np.argmin(en)) + win // 2
    ins.append((p, d, i))
ins.sort()
y, last, f = [], 0, int(0.008 * sr)
for p, d, i in ins:
    a_ = x[last:p].copy()
    if len(a_) > f:
        a_[-f:] *= np.linspace(1, 0, f)
    y += [a_, np.zeros(int(d * sr), dtype="float32")]
    last = p
    b = x[p:p + f]
    x[p:p + f] = b * np.linspace(0, 1, len(b))
y.append(x[last:])
y = np.concatenate(y)
sf.write(out, y, sr, subtype="PCM_24")
shift, k, NW = 0.0, 0, []
for j, (w, s, e) in enumerate(W):
    while k < len(ins) and ins[k][2] < j:
        shift += ins[k][1]
        k += 1
    NW.append([w, round(s + shift, 3), round(e + shift, 3)])
json.dump(NW, open(owj, "w"))
span2 = NW[-1][2] - NW[0][1]
print(f"after: {len(ins)} pauses lengthened; commas to >= {TC:.2f} s, sentences to {Ts:.2f} s, paragraphs to {max(TP, Ts):.2f} s; "
      f"{span2:.1f} s = {N / span2 * 60:.1f} wpm")
