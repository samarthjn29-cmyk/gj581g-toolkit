"""Beat boundaries for WCL-E01 act 2 from Sam's final take (02_brothers_paced_149wpm_even): every beat 2.0-3.5 s,
cut in the middle of a pause where one exists. Act time = take time + LEAD (the act opens on a 2.4 s chapter slate)."""
import json
LEAD = 2.4
W = json.load(open("/home/claude/wcl/ep01/voice/eleven/02_brothers_final_words.json"))
W = [[w, round(a + LEAD, 3), round(b + LEAD, 3)] for w, a, b in W]
END = round(W[-1][2] + 1.0, 2)  # 1.0 s tail after the last word
# candidate cuts: mid-pause; a pause after a sentence end counts +1 s, after a comma +0.3 s, so shots change on
# sentence ends where the 2.0-3.5 s window allows (a shot change mid-sentence is the fallback)
bonus = lambda w: 1.0 if w.rstrip('"”').endswith((".", "?", "!")) else (0.3 if w.endswith((",", ";", ":")) else 0.0)
cands = [(round((W[i][2] + W[i + 1][1]) / 2, 2), W[i + 1][1] - W[i][2] + bonus(W[i][0])) for i in range(len(W) - 1)]
# Dynamic programming over the candidate cuts: every beat 2.0-3.5 s (the last up to 4.0, it ends in the tail),
# maximising the summed score, so beats end on sentence ends wherever the lengths allow.
pts = [(LEAD, 0.0)] + [c for c in cands if c[0] > LEAD + 1.9] + [(END, 0.0)]
best = {0: (0.0, None)}
for k in range(1, len(pts)):
    t, sc = pts[k]
    hi = 4.0 if k == len(pts) - 1 else 3.5
    opts = [(best[j][0] + sc, j) for j in best if 2.0 <= t - pts[j][0] <= hi]
    if opts:
        best[k] = max(opts)
k = len(pts) - 1
if k not in best:
    raise SystemExit("no beat layout with 2.0-3.5 s beats")
chain = []
while k is not None:
    chain.append(pts[k][0]); k = best[k][1]
cuts = [0.0] + chain[::-1]
beats = []
for i in range(len(cuts) - 1):
    s, e = cuts[i], cuts[i + 1]
    line = " ".join(w for w, a, b in W if s - 0.01 <= a < e - 0.01)
    beats.append([f"E01-A2-{i + 1:02d}", round(s, 2), round(e, 2), line])
json.dump(beats, open("act2_cuts.json", "w"), indent=1, ensure_ascii=False)
for b in beats: print(b[0], f"{b[1]:7.2f} {b[2]:7.2f} {b[2]-b[1]:4.2f}", b[3])
print(len(beats), "beats, act", END, "s")
