"""Beat boundaries for WCL-E01 act 5 from Sam's final take (05_rays_paced_149wpm_even): every beat 2.0-3.5 s,
cut in the middle of a pause where one exists. Act time = take time + LEAD (the act opens on a 2.4 s chapter slate)."""
import json
LEAD = 2.4
W = json.load(open("05_rays_paced_words.json"))
W = [[w, round(a + LEAD, 3), round(b + LEAD, 3)] for w, a, b in W]
END = round(W[-1][2] + 3.0, 2)  # 3.0 s of music alone after the last word (Harris-style end, act 5 cue sheet)
# candidate cuts: mid-pause; a pause after a sentence end counts +1 s, after a comma +0.3 s, so shots change on
# sentence ends where the 2.0-3.5 s window allows (a shot change mid-sentence is the fallback)
bonus = lambda w: 1.0 if w.rstrip('"”').endswith((".", "?", "!")) else (0.3 if w.endswith((",", ";", ":")) else 0.0)
cands = [(round((W[i][2] + W[i + 1][1]) / 2, 2), W[i + 1][1] - W[i][2] + bonus(W[i][0])) for i in range(len(W) - 1)]
# Shot changes the act plan needs (transitions and cue entries) are forced cuts: the mid-pause just before each of
# these words (act 3 plan + Director brief + cue sheet). Between them, dynamic programming over the candidate cuts:
# every beat 2.0-3.5 s (the last up to 4.0, it ends in the music-alone tail), maximising the summed score.
FORCE = ["It's a sentence", "All they have", "That sounds", "What's in sunlight", "So, on Newton's", "Newton has", "A geranium sends", "That also explains", "And to most", "Newton also gives", "Seven notes", "Here's why", "Colour is what", "But a guess"]
toks = [w for w, a, b in W]
def first(seq, after=0):
    ws = seq.split()
    for i in range(after, len(toks) - len(ws) + 1):
        if [t.strip('.,?!"').lower() for t in toks[i:i + len(ws)]] == [x.strip('.,?!"').lower() for x in ws]:
            return i
    raise SystemExit("not found: " + seq)
req, pos = [], 0
for f in FORCE:
    i = first(f, pos); pos = i + 1
    req.append(round((W[i - 1][2] + W[i][1]) / 2, 2))
cmap = dict(cands)
def segment(t0, t1, last=False):
    pts = [(t0, 0.0)] + [c for c in cands if t0 + 1.9 < c[0] < t1 - 1.9] + [(t1, 0.0)]
    best = {0: (0.0, None)}
    for k in range(1, len(pts)):
        t, sc = pts[k]
        hi = 4.0 if (last and k == len(pts) - 1) else 3.5
        opts = [(best[j][0] + sc, j) for j in best if 2.0 <= t - pts[j][0] <= hi]
        if opts:
            best[k] = max(opts)
    k = len(pts) - 1
    if k not in best:
        raise SystemExit(f"no 2.0-3.5 s layout between {t0} and {t1}")
    out = []
    while k is not None:
        out.append(pts[k][0]); k = best[k][1]
    return out[::-1][1:]
bounds = [LEAD] + req + [END]
chain = [LEAD]
for i in range(len(bounds) - 1):
    chain += segment(bounds[i], bounds[i + 1], last=(i == len(bounds) - 2))
chain = chain[::-1]
cuts = [0.0] + chain[::-1]
beats = []
for i in range(len(cuts) - 1):
    s, e = cuts[i], cuts[i + 1]
    line = " ".join(w for w, a, b in W if s - 0.01 <= a < e - 0.01)
    beats.append([f"E01-A5-{i + 1:02d}", round(s, 2), round(e, 2), line])
json.dump(beats, open("act5_cuts.json", "w"), indent=1, ensure_ascii=False)
for b in beats: print(b[0], f"{b[1]:7.2f} {b[2]:7.2f} {b[2]-b[1]:4.2f}", b[3])
print(len(beats), "beats, act", END, "s")
