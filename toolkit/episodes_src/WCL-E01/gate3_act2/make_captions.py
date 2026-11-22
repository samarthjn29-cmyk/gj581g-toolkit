"""English captions for WCL-E01 act 2 from Sam's word times (the final take, 02_brothers_paced_149wpm_even, NAR-002),
act-relative like act 1's: the voice starts at LEAD (the 2.4 s chapter slate). One cue per sentence; a sentence over
84 letters splits at a comma (or the middle word) into cues; each cue at most two lines of 42 letters."""
import json, re, textwrap, sys
LEAD = 2.4
W = json.load(open(sys.argv[1]))
out = sys.argv[2]
def ts(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}".replace(",1000", ",999")
sent, sents = [], []
for w in W:
    sent.append(w)
    if re.search(r"[.?!][\"'”’)]*$", w[0]):
        sents.append(sent); sent = []
if sent: sents.append(sent)
def jt(ws):
    """Words to text; a token that starts with a hyphen joins the word before it ("bluish" "-dark" -> "bluish-dark")."""
    return re.sub(r" (-\w)", r"\1", " ".join(x[0] for x in ws))
cues = []
def split(ws):
    txt = jt(ws)
    if len(txt) <= 84 or len(ws) < 6:
        return [ws]
    # prefer the comma nearest the middle
    mid = len(ws) // 2
    commas = [i for i, x in enumerate(ws[:-1]) if x[0].endswith(",") and 2 <= i < len(ws) - 3]
    k = min(commas, key=lambda i: abs(i - mid)) + 1 if commas else mid
    return split(ws[:k]) + split(ws[k:])
for s in sents:
    cues += split(s)
lines = []
for i, c in enumerate(cues, 1):
    a = c[0][1] + LEAD; b = c[-1][2] + LEAD
    nxt = cues[i][0][1] + LEAD if i < len(cues) else b + 1.5
    b = min(max(b + 0.25, a + 1.0), nxt - 0.05)  # hold a beat after the last word, never into the next cue
    txt = "\n".join(textwrap.wrap(jt(c), 42))
    lines.append(f"{i}\n{ts(a)} --> {ts(b)}\n{txt}\n")
# British spelling for the house style (the word file keeps whisper's "northwest" because cues key on it).
lines = [l.replace("northwest", "north-west") for l in lines]
open(out, "w").write("\n".join(lines))
print(len(cues), "cues")
