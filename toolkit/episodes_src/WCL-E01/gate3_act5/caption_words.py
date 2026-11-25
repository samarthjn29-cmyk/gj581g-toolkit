"""Act 5 caption words: the recorded wording as on the beat sheet (punctuation, quote marks, hyphens) on Sam's word
times (whisper medium.en on the final take, 05_rays_paced_words.json). Numbers are written as figures (1794, 28).
usage: caption_words.py BEATSHEET_DUMP WORDS.json OUT.json"""
import json, re, sys, difflib
dump, words, out = sys.argv[1:4]
v = json.load(open(dump))["values"]
ref = " ".join(r[7] for r in v if r and r[0].startswith("E01-A5-") and r[7].strip())
ref = ref.replace("seventeen oh-four", "1704").replace("page ninety", "page 90").replace("thirty years", "30 years")
R = ref.split()
W = json.load(open(words))
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower().replace("’", "'"))
# split hyphenated reference tokens for matching, remember the token they came from
parts, owner = [], []
for i, t in enumerate(R):
    for p in re.split(r"-", t):
        if norm(p):
            parts.append(norm(p)); owner.append(i)
wn = [norm(w[0]) for w in W]
sm = difflib.SequenceMatcher(a=parts, b=wn, autojunk=False)
tok_time = {}
for tag, a0, a1, b0, b1 in sm.get_opcodes():
    if tag == "equal":
        for k in range(a1 - a0):
            o = owner[a0 + k]; s, e = W[b0 + k][1], W[b0 + k][2]
            tok_time.setdefault(o, [s, e]); tok_time[o][1] = e
    elif b1 > b0 and a1 > a0:
        s, e = W[b0][1], W[b1 - 1][2]
        for k in range(a0, a1):
            o = owner[k]; tok_time.setdefault(o, [s, e]); tok_time[o][1] = max(tok_time[o][1], e)
        print("aligned by span:", " ".join(R[o] for o in sorted(set(owner[a0:a1]))), "<-", " ".join(w[0] for w in W[b0:b1]))
    elif a1 > a0:
        print("no time for:", " ".join(R[o] for o in sorted(set(owner[a0:a1]))))
    else:
        print("heard, not in text:", " ".join(w[0] for w in W[b0:b1]))
outw = []
last = 0.0
for i, t in enumerate(R):
    s, e = tok_time.get(i, [last, last])
    outw.append([t, s, e]); last = e
# Gate 3 review M4: the aligner glues a word onto the end of the one before when a silence sits between them; snap
# such starts to the voice's real onset, and end each word at its last voiced 10 ms frame + 0.05 s (in take time)
import numpy as np, soundfile as sf
VOICE = sys.argv[4] if len(sys.argv) > 4 else "/tmp/act5_voice.wav"
x, sr = sf.read(VOICE)
x = x if x.ndim == 1 else x.mean(axis=1)
hop = int(sr * 0.01)
db = 20 * np.log10(np.maximum(1e-9, np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, "same")[::hop])))
voiced = lambda t: db[min(len(db) - 1, max(0, int(t * 100)))] > -50
for i in range(1, len(outw)):
    if abs(outw[i][1] - outw[i - 1][2]) >= 0.011:
        continue
    if sum(not voiced(outw[i][1] + k * 0.01) for k in range(30)) < 15:
        continue  # the word is sounding where whisper starts it (the word before may ring on ~0.15 s past its end)
    stop = outw[i + 1][1] if i + 1 < len(outw) else outw[i][2]
    t, run, onset = outw[i][1], 0, None
    while t < stop - 0.02:  # a silence of 0.25 s or more inside the word's span means it was really said after it
        if voiced(t):
            if run >= 25:
                onset = t; break
            run = 0
        else:
            run += 1
        t = round(t + 0.01, 2)
    if onset is not None and onset > outw[i][1] + 0.05:
        print(f"start snapped: {outw[i][0]} {outw[i][1] + 2.4:.2f} -> {onset + 2.4:.2f}")
        if onset > outw[i][2] - 0.05:
            outw[i][2] = round(min(stop, onset + 0.15), 2)
        outw[i][1] = round(onset, 2)
for i in range(len(outw)):
    lim = outw[i + 1][1] - 0.02 if i + 1 < len(outw) else outw[i][2] + 0.4
    t = outw[i][2]
    while t + 0.01 < lim and voiced(t + 0.01):
        t += 0.01
    outw[i][2] = round(min(lim, max(outw[i][2], t + 0.05)), 2)
# caption form (review S5): a sentence after a question mark starts with a capital
for i in range(1, len(outw)):
    if outw[i - 1][0].endswith("?") and outw[i][0][:1].islower():
        outw[i][0] = outw[i][0][:1].upper() + outw[i][0][1:]
json.dump(outw, open(out, "w"))
print(len(R), "tokens,", len(W), "heard words")
