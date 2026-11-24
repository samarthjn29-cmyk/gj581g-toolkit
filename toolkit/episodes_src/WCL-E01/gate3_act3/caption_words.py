"""Act 3 caption words: the recorded wording as on the beat sheet (punctuation, quote marks, hyphens) on Sam's word
times (whisper medium.en on the final take, 03_talk_final_words.json). Numbers are written as figures (1794, 28).
usage: caption_words.py BEATSHEET_DUMP WORDS.json OUT.json"""
import json, re, sys, difflib
dump, words, out = sys.argv[1:4]
v = json.load(open(dump))["values"]
ref = " ".join(r[7] for r in v if r and r[0].startswith("E01-A3-") and r[7].strip())
ref = ref.replace("seventeen ninety-four", "1794").replace("twenty-eight", "28")
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
json.dump(outw, open(out, "w"))
print(len(R), "tokens,", len(W), "heard words")
