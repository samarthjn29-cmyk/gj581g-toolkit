"""WCL-E01 act 2 v2: the Harris cue sheet (MUS-008, scripts/mix-cue-bed.py). Run from library/:
python3 ../episodes_src/WCL-E01/gate3_act2v2/make_cues.py  -> src/episodes/ep01-act02-v2.music.json
Times are act seconds (NAR-002 word times + the 2.4 s slate). Each track carries on from where act 1 v2 left it.
Turns: the second story ("There's another story", 55.85); the break and riser into "red as a cherry" (sub 82.10,
no music 79.95-84.0); the lesson ("John can't see it" on; explanation level under the numbers); the inside view
("Picture it from the inside", 141.25) to the act's riddle. At Rest runs from 141 (not 167.7): its row asks 20 s or more."""
import json, os
M = "public/music/"
cues = [
    {"name": "1 Eaglesfield", "file": M + "wholesome_kevin_macleod.mp3", "from": 26.4, "at": 0.0, "until": 55.75,
     "fadeIn": 0.3, "fadeOut": 0.8, "lufs": -34,
     "levels": [[0, -26], [2.0, -26], [2.45, -34], [25.8, -34], [26.0, -27], [26.9, -27], [27.1, -34], [55.75, -34]]},
    {"name": "2 the stockings", "file": M + "thinking_music_kevin_macleod.mp3", "from": 22.95, "at": 55.45, "until": 79.95,
     "fadeIn": 0.5, "fadeOut": 0.45, "lufs": -37,
     "levels": [[55.45, -37], [78.6, -37], [78.8, -33], [79.6, -33], [79.95, -37]]},
    {"name": "3 what stays the same", "file": M + "long_note_two_kevin_macleod.mp3", "from": 43.25, "at": 84.0, "until": 141.0,
     "fadeIn": 0.5, "fadeOut": 0.6, "lufs": -41, "filter": "dynaudnorm=f=3000:g=31",
     "levels": [[84.0, -41], [96.95, -41], [97.15, -34], [98.3, -34], [98.55, -41], [111, -41], [115, -37], [141.0, -37]]},
    {"name": "4 from the inside", "file": M + "at_rest_kevin_macleod.mp3", "from": 24.35, "at": 140.7, "until": 175.57,
     "fadeIn": 0.5, "fadeOut": 0.05, "lufs": -35,
     "levels": [[140.7, -35], [166.3, -35], [166.5, -31], [167.5, -31], [167.75, -35], [174.6, -35], [174.8, -22], [175.57, -22]]},
]
spec = {"dur": 175.57, "cues": cues,
        "quiet": [[52.3, 54.75, -50, 0.3],    # "who saw it in the same light as myself" (Dalton's words)
                  [75.4, 78.6, -50, 0.3]],    # "a bluish-dark drab" (the biographer's words)
        "events": [], "break": [114.47, 114.87], "sweeps": [[26.37, 0.4], [115.06, 0.4]],
        "ids": {"cues": ["MUS-007", "MUS-012", "MUS-013", "MUS-014"], "events": []}}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "library", "src", "episodes", "ep01-act02-v2.music.json")
json.dump(spec, open(out, "w"), indent=1)
print("ok", out)
