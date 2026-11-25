"""WCL-E01 act 5 cue sheet (MUS-008, Harris style): 4 cues of tracks Sam has heard (the act 3/4 tracks), entering in
pauses on the turning lines; near-silence under Newton's and Dalton's quotes and the 'tidy' punchline; the music break
(MUS-010, the act's peak) in the pause before "Dalton's eyes don't."; no riser and no hit (SFX-025 is at its episode
limit; MUS-015 rests). Track start points ('from') are first picks: check with music-beats.py at Gate 2 when the files
are in the workspace. Act time = take time + 2.4 s."""
import json
L = 2.4
W = [[w, a + L, b + L] for w, a, b in json.load(open("05_rays_paced_words.json"))]
T = [w for w, a, b in W]
def at(seq, after=0):
    s = [x.lower().strip('.,?!"') for x in seq.split()]
    for i in range(after, len(T)):
        if [t.lower().strip('.,?!"') for t in T[i:i + len(s)]] == s:
            return i
    raise SystemExit(seq)
def gap_before(seq):
    i = at(seq); return round((W[i - 1][2] + W[i][1]) / 2, 2), round(W[i - 1][2], 2), round(W[i][1], 2)
END = round(W[-1][2] + 3.0, 2)
c2, _, _ = gap_before("That sounds like")
c3, _, _ = gap_before("Newton also gives")
c4, _, _ = gap_before("Here's why")
_, brk0, brk1 = gap_before("Dalton's eyes don't")
def span(first, last):
    i = at(first); j = at(last, i)
    return round(W[i][1] - 0.15, 2), round(W[j + len(last.split()) - 1][2] + 0.25, 2)
q1 = span("For the rays", "not coloured.")
q2 = span("a certain power", "that colour.")
q3 = span("It's tidy.", "too tidy.")
q4 = span("pretty well acquainted", "and colours.")
LAST = round(W[-1][2], 2)
cues = {"dur": END, "cues": [
  {"name": "1 the book", "file": "public/music/wholesome_kevin_macleod.mp3", "from": 30.0, "at": 0, "until": c2 + 0.4,
   "fadeIn": 0.6, "fadeOut": 1.0, "lufs": -34, "levels": [[0, -26], [2.0, -26], [2.9, -34], [c2 + 0.4, -34]]},
  {"name": "2 rays, things and candles", "file": "public/music/thinking_music_kevin_macleod.mp3", "from": 12.0, "at": c2, "until": brk0 + 0.05,
   "fadeIn": 0.6, "fadeOut": 0.3, "lufs": -35},
  {"name": "3 seven colours", "file": "public/music/long_note_two_kevin_macleod.mp3", "from": 30.0, "at": c3, "until": c4 + 0.3,
   "fadeIn": 0.6, "fadeOut": 0.6, "lufs": -41, "filter": "dynaudnorm=f=3000:g=31"},
  {"name": "4 Dalton's guess and the question", "file": "public/music/at_rest_kevin_macleod.mp3", "from": 40.0, "at": c4, "until": END,
   "fadeIn": 1.0, "fadeOut": 1.0, "lufs": -35, "levels": [[c4, -35], [LAST, -35], [round(LAST + 1.2, 2), -27], [END, -27]]}],
 "quiet": [[brk0 - 0.05, brk1 + 1.35, -60, 0.05], [q1[0], q1[1], -62, 0.3], [q2[0], q2[1], -62, 0.3], [q3[0], q3[1], -50, 0.2], [q4[0], q4[1], -62, 0.3]],
 "events": [],
 "note": "Gate 1 plan (25 Nov 2026). Cue 1 continues the series bed (Wholesome) under the book; cue 2 (Thinking Music) for the examples: rays, flower, leaf, candle; the break (MUS-010) before \"Dalton's eyes don't.\" lands the line dry; cue 3 (Long Note Two) under the seven colours; cue 4 (At Rest) from \"Here's why\", alone 3 s after \"it.\". Act join: act 4 ends on At Rest alone; cue 1 fades in under its tail at assembly."}
json.dump(cues, open("act5_cues_v1.json", "w"), indent=1)
print([(c["name"], c["at"], round(c["until"], 2)) for c in cues["cues"]]); print(cues["quiet"])
