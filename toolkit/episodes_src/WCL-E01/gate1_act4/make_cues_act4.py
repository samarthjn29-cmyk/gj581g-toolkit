"""WCL-E01 act 4 cue sheet (MUS-008, Harris style): 4 cues of tracks Sam has heard, entering in pauses on the turning lines;
near-silence under Newton's quotes; a music break (MUS-010) in the pause before "It doesn't."; no riser (MUS-015 never two
acts in a row) and no hit (SFX-025 is at its episode limit). Act time = take time + 2.4 s."""
import json
L = 2.4
W = [[w, a + L, b + L] for w, a, b in json.load(open("04_shutter_paced_words.json"))]
T = [w for w, a, b in W]
def at(seq, after=0):
    s = [x.lower().strip('.,?!"') for x in seq.split()]
    for i in range(after, len(T)):
        if [t.lower().strip('.,?!"') for t in T[i:i + len(s)]] == s:
            return i
    raise SystemExit(seq)
def gap_before(seq):  # mid-pause before the phrase
    i = at(seq); return round((W[i - 1][2] + W[i][1]) / 2, 2), round(W[i - 1][2], 2), round(W[i][1], 2)
END = round(W[-1][2] + 3.0, 2)
c2, _, _ = gap_before("Newton wants to know")
c3, _, _ = gap_before("So the prism isn't")
c4, _, _ = gap_before("He sends all this")
_, brk0, brk1 = gap_before("It doesn't")
def span(first, last):
    i = at(first); j = at(last, i)
    return round(W[i][1] - 0.15, 2), round(W[j + len(last.split()) - 1][2] + 0.25, 2)
q1 = span("obstinately", "to it."); q2 = span("light, entirely", "white."); q3 = span("Colours are not", "natural bodies.")
cues = {"dur": END, "cues": [
  {"name": "1 back to Newton", "file": "/home/claude/wcl/ep01/cues/dl/Wholesome.mp3", "from": 0, "at": 0, "until": c2 + 0.4,
   "fadeIn": 0.6, "fadeOut": 1.0, "lufs": -34, "levels": [[0, -26], [2.0, -26], [2.9, -34], [c2 + 0.4, -34]]},
  {"name": "2 the room and the test", "file": "/home/claude/wcl/ep01/cues/dl/Thinking Music.mp3", "from": 49.1, "at": c2, "until": c3 + 0.3,
   "fadeIn": 0.6, "fadeOut": 0.8, "lufs": -35},
  {"name": "3 sorting", "file": "/home/claude/wcl/ep01/cues/dl/Long Note Two.mp3", "from": 116.4, "at": c3, "until": c4 + 0.3,
   "fadeIn": 0.4, "fadeOut": 0.6, "lufs": -41, "filter": "dynaudnorm=f=3000:g=31"},
  {"name": "4 the letter and the question", "file": "/home/claude/wcl/ep01/cues/dl/At Rest.mp3", "from": 0, "at": c4, "until": END,
   "fadeIn": 1.0, "fadeOut": 1.0, "lufs": -35, "levels": [[c4, -35], [round(W[-1][2], 2), -35], [round(W[-1][2] + 0.7, 2), -27], [END, -27]]}],
 "quiet": [[brk0 - 0.05, brk1 + 0.05, -60, 0.05], [q1[0], q1[1], -50, 0.3], [q2[0], q2[1], -50, 0.3], [q3[0], q3[1], -50, 0.4]],
 "events": [],
 "note": "Gate 1 plan (24 Nov 2026). Cue 1 continues the series bed (Wholesome); cues 2-4 are the act 3 tracks at new start points (Sam heard all four in the act 3 sampler). Break (MUS-010) = the quiet span before \"It doesn't.\". Act join: act 3 ends on At Rest; cue 1 fades in under act 3's tail at assembly."}
json.dump(cues, open("act4_cues_v1.json", "w"), indent=1)
print(json.dumps({k: v for k, v in cues.items() if k != "cues"}, indent=0)[:600]); print([(c["name"], c["at"], c["until"]) for c in cues["cues"]])
