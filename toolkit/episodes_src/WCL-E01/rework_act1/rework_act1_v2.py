"""WCL-E01 act 1 v2 (Sam, 25 Nov 2026 19:23: "I would also suggest utilising new transitions, audios, visuals, layers,
etc. now that we are starting again from Act 1"; he picked all four: layers, Harris cue sheet, stickers/props/textures,
Earth fly-in + TODAY footage). Built on the v1 energy pass (rework_act1.py, Gate 2 approved 19:15), following the
Director's brief director/ep01-act01_v2_brief.md:
  - 01+02+03+04 split at 3.70 (pause after "England."): 01 EarthFlyIn (MAP-013 on SRC-050, TODAY tag) and
    02+03+04 LayerStage (Kitchin 1794 scrap with Kendal circled over the candle, then the candle and the dateline);
  - 05+06+07 LayerStage: the geranium cut-out by candlelight, then today's daylight on "walked past this week";
  - TEX-009 Paper_363M inside the paper desk of the two page shots;
  - the Harris cue sheet (ep01-act01-v2.music.json: Wholesome / Thinking Music / Long Note Two / At Rest);
  - SFX-028 Pixabay foley on the page turn and Newton's shutter; the match strike as a J-cut at 3.35.
Run from library/: python3 ../episodes_src/WCL-E01/rework_act1/rework_act1_v2.py
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.normpath(os.path.join(HERE, "..", "..", "..", "library"))
OUT = os.path.join(LIB, "src", "episodes", "ep01-act01-v2.json")
MUSIC = os.path.join(LIB, "src", "episodes", "ep01-act01-v2.music.json")
TMP = "/tmp/ep01-act01-energy-v1.json"
subprocess.run([sys.executable, os.path.join(HERE, "rework_act1.py"), TMP], check=True, cwd=LIB, stdout=subprocess.DEVNULL)
a = json.load(open(TMP))
a["episodeId"] = "WCL-E01-act01"
a["note"] += " v2 (Sam 25 Nov 2026, all four picks): rework_act1_v2.py per director/ep01-act01_v2_brief.md."
B = {b["id"]: b for b in a["beats"]}
CANDLE = "public/assets/sources/candle_lighting_mixkit3458.mp4"
CANDLE_REV = "public/assets/sources/candle_lighting_mixkit3458_rev.mp4"
PAPER_TEX = "public/assets/textures/texturelabs/Texturelabs_Paper_363M.jpg"


def assets(b, add=(), drop=()):
    b["assets"] = [x for x in b["assets"] if x not in drop]
    for x in add:
        if x not in b["assets"]:
            b["assets"].append(x)


# --- 01 fly-in + 02+03+04 scrap and candle (split of v1 01+02+03+04 at 3.70) ---
old = B["01+02+03+04"]
SPLIT = 3.70
fly = {
    "id": "01", "beats": ["E01-A1-01"], "start": 0.0, "end": SPLIT, "component": "EarthFlyIn",
    "assets": ["MAP-013", "SRC-050", "SFX-001", "TXT-010", "MOT-002", "MOT-013", "LOK-010", "MUS-007"],
    "props": {
        "globe": {"srcId": "SRC-050", "file": "public/assets/sources/bm_global_8192.jpg", "size": [8192, 4096]},
        "inset": {"srcId": "SRC-050", "file": "public/assets/sources/bm_britain_240ppd.jpg", "size": [3840, 3120],
                  "lon0": -12, "lon1": 4, "lat0": 61, "lat1": 48},
        "keys": [{"atSec": 0, "lon": -24, "lat": 44, "radius": 420},
                 {"atSec": 1.9, "lon": -5, "lat": 52.5, "radius": 2200, "sec": 1.9},
                 {"atSec": 3.55, "lon": -2.746, "lat": 54.093, "radius": 29300, "sec": 1.65}],
        "pins": [{"lon": -2.746, "lat": 54.328, "text": "KENDAL", "atSec": 0.80, "accent": True, "side": "left"}],
        "labels": [{"text": "NORTH OF ENGLAND", "atSec": 1.90, "untilSec": 2.70, "x": 960, "y": 860, "align": "center"}],
        "tag": {"text": "SATELLITE COMPOSITE TODAY · NASA BLUE MARBLE", "atSec": 0.20, "untilSec": 2.85},
    },
    "beatTimes": [["E01-A1-01", 0.0, SPLIT]],
}
L = SPLIT  # shot-local offset of 02+03+04
scrap = {
    "id": "02+03+04", "beats": ["E01-A1-02", "E01-A1-03", "E01-A1-04"], "start": SPLIT, "end": old["end"],
    "component": "LayerStage", "transitionIn": "match", "focus": [960, 420],
    "assets": ["VIS-059", "MOT-016", "MAP-017", "SRC-045", "TRN-015", "TXT-011", "MOT-013", "SRC-011", "SFX-013",
               "SFX-014", "TXT-010", "LOK-010", "MOT-002", "MUS-007"],
    "props": {
        "worlds": [{"atSec": 0, "srcId": "SRC-011", "file": CANDLE_REV, "kind": "video", "size": [1080, 1920],
                    "focus": [0.5, 0.56], "clipStartSec": 1.8, "light": "warm", "lightFrom": "top", "haze": 0.06,
                    "dim": 0.5, "rackDim": 0, "rackSec": round(4.65 - L, 2),
                    "why": "Same place, same time: the candle-lit evening in Kendal, autumn 1792, that the dateline names; the 1794 map scrap in front shows where that room is."}],
        "carry": [{"srcId": "SRC-045", "size": [960, 1015], "at": [1015, 548], "w": 760, "atSec": -1, "tilt": 0,
                   "torn": True, "untilSec": round(4.85 - L, 2), "exit": "sink",
                   "route": {"from": [411, 346], "to": [411, 346], "atSec": 0.05, "drawSec": 0.1,
                             "circleSec": round(4.15 - L, 2), "chips": [{"text": "KENDAL", "at": [190, 300]}],
                             "source": "KITCHIN · LAURIE & WHITTLE · 1794"}}],
        "tag": {"at": "low-centre", "toCornerAtSec": round(6.70 - L, 2),
                "parts": [{"text": "KENDAL", "atSec": round(5.30 - L, 2)}, {"text": "AUTUMN 1792", "atSec": round(5.47 - L, 2)}]},
        "labels": [{"text": "JOHN DALTON · TEACHER", "atSec": round(9.53 - L, 2), "x": 960, "y": 820, "align": "center"}],
        "camera": {"pan": 0, "push": 0.04},
    },
    "beatTimes": [["E01-A1-02", SPLIT, 6.4], ["E01-A1-03", 6.4, 8.6], ["E01-A1-04", 8.6, 11.1]],
}
i = a["beats"].index(old)
a["beats"][i:i + 1] = [fly, scrap]

# --- 05+06+07 the geranium by candle, then today ---
g = B["05+06+07"]
S = g["start"]
g["component"] = "LayerStage"
g["props"] = {
    "worlds": [
        {"atSec": 0, "srcId": "SRC-011", "file": CANDLE, "kind": "video", "size": [1080, 1920], "focus": [0.58, 0.56],
         "zoom": 1.2, "clipStartSec": 1.0, "light": "warm", "lightFrom": "left", "haze": 0.1,
         "why": "Same place, same time: the candle Dalton looks at the flower by, in Kendal in 1792; the flower takes its light."},
        {"atSec": round(16.70 - S, 2), "srcId": "SRC-040", "file": "public/assets/sources/sky_clouds_mixkit51102.mp4",
         "revFile": "public/assets/sources/sky_clouds_mixkit51102_rev.mp4", "clipSec": 8.5, "kind": "video",
         "size": [1920, 1080], "change": "wipe", "sec": 1.2, "light": "day", "lightFrom": "top-left", "haze": 0.12,
         "blur": 1.5, "rackSec": round(16.70 - S, 2), "label": "DAYLIGHT", "today": True,
         "why": "The change itself: the line turns to today ('walked past this week'), so the same flower in today's daylight, tagged TODAY."},
    ],
    "carry": [{"srcId": "SRC-013", "file": "public/assets/sources/geranium_stang_flowerhead_cutout.png",
               "size": [1185, 769], "at": [1340, 640], "w": 680, "atSec": round(11.25 - S, 2), "enter": "rise",
               "moves": [{"atSec": round(16.75 - S, 2), "to": [960, 540], "w": 760, "sec": 1.4,
                          "why": "Comes to the centre as the line turns to the viewer: in today's daylight it is just a flower you walk past."}]}],
    "labels": [{"text": "DALTON'S 'GERANIUM ZONALE'", "atSec": round(13.89 - S, 2), "untilSec": round(16.60 - S, 2),
                "x": 1340, "y": 890, "align": "center"}],
    "caption": "PHOTO D. J. STANG, CC BY-SA 4.0 (CUT OUT)",
    "camera": {"pan": -60, "push": 0.03},
}
panel = g["overlay"]["chips"][0]
panel["untilSec"] = round(16.60 - S, 2)
for c, y in zip(panel["chips"], (640, 760)):  # bottom-left on the dark wax, clear of the flame (frame check, v2 stills)
    c["x"], c["y"] = 140, y
assets(g, add=("VIS-059", "MOT-016", "TRN-018", "SRC-011", "SRC-040", "MOT-013", "SFX-014"),
       drop=("VIS-016", "MOT-001", "TRN-001"))

# --- the paper desk of the two page shots carries TEX-009 Paper_363M (ground placement) ---
for sid in ("08+09+10", "11+12+13"):
    B[sid]["ground"] = {"kind": "paper", "tex": {"file": PAPER_TEX, "strength": 0.2}}
    assets(B[sid], add=("TEX-009",))

# --- sound ---
au = a["audio"]


def drop(id_, t0, t1):
    global au
    au = [c for c in au if not (c["id"] == id_ and t0 <= c["atSec"] <= t1)]


drop("SFX-013", 0, 0.01)
drop("SFX-014", 0, 0.01)
drop("SFX-020", 25.95, 26.05)
drop("SFX-016", 26.0, 26.4)
drop("SFX-001", 94.5, 94.7)
au += [
    {"id": "SFX-001", "atSec": 2.70, "volumeDb": -20},  # the globe's plunge onto Kendal
    {"id": "SFX-013", "atSec": 3.35, "volumeDb": 2},  # the match struck in the pause (J-cut into the candle)
    {"id": "SFX-014", "atSec": 3.45, "volumeDb": 0, "fadeInSec": 0.6, "fadeOutSec": 1.0, "endSec": 17.6},
    {"id": "SFX-028", "file": "public/sfx/kit/pixabay/page_turn_book_v2.wav", "atSec": 26.22, "volumeDb": -18},
    {"id": "SFX-028", "file": "public/sfx/kit/pixabay/shutter_lock_v2.wav", "atSec": 94.64, "volumeDb": -24},
]
au.sort(key=lambda c: c["atSec"])
a["audio"] = au
assets(B["11+12+13"], add=("SFX-028",))
assets(B["35+36"], add=("SFX-028",))

# --- music: the Harris cue sheet; each shot names the cue(s) it covers in place of MUS-007 ---
cues = [
    {"id": "MUS-007", "name": "1 the evening", "file": "public/music/wholesome_kevin_macleod.mp3", "from": 0.0,
     "at": 0.0, "until": 26.40, "fadeIn": 0.03, "fadeOut": 1.0, "lufs": -34,
     "levels": [[0, -26], [0.55, -26], [1.0, -34], [6.3, -34], [6.7, -30], [8.2, -30], [8.6, -34], [26.4, -34]]},
    {"id": "MUS-012", "name": "2 the evidence", "file": "public/music/thinking_music_kevin_macleod.mp3", "from": 0.0,
     "at": 26.15, "until": 49.10, "fadeIn": 0.6, "fadeOut": 0.6, "lufs": -35,
     "levels": [[26.15, -35], [35.75, -35], [35.95, -31.5], [37.2, -31.5], [37.55, -35], [49.1, -35]]},
    {"id": "MUS-013", "name": "3 the question", "file": "public/music/long_note_two_kevin_macleod.mp3", "from": 0.0,
     "at": 48.70, "until": 78.75, "fadeIn": 0.4, "fadeOut": 0.4, "lufs": -41, "filter": "dynaudnorm=f=3000:g=31",
     "levels": [[48.7, -41], [56.8, -41], [57.0, -37.5], [58.0, -37.5], [58.25, -41], [77.1, -41], [77.3, -37.5],
                [78.3, -37.5], [78.35, -41]]},
    {"id": "MUS-014", "name": "4 the wait", "file": "public/music/at_rest_kevin_macleod.mp3", "from": 0.0,
     "at": 80.80, "until": 104.60, "fadeIn": 0.5, "fadeOut": 0.03, "lufs": -35,
     "levels": [[80.8, -35], [87.15, -35], [87.2, -31], [88.2, -31], [88.45, -35], [101.5, -35], [101.7, -27],
                [104.6, -27]]},
]
for b in a["beats"]:
    b["assets"] = [x for x in b["assets"] if x != "MUS-007"]
    for c in cues:
        if c["at"] < b["end"] and c["until"] > b["start"]:
            assets(b, add=(c["id"],))
music = {
    "dur": 104.6,
    "cues": [{k: v for k, v in c.items() if k != "id"} for c in cues],
    "quiet": [[29.90, 33.00, -50, 0.3], [86.80, 87.20, -60, 0.05], [98.45, 101.55, -62, 0.3]],
    "events": [],
    "sweeps": [[33.86, 0.8]],
    "ids": {"cues": [c["id"] for c in cues], "events": []},
}
json.dump(a, open(OUT, "w"), indent=1, ensure_ascii=False)
json.dump(music, open(MUSIC, "w"), indent=1)
print("ok", OUT, len(a["beats"]), "shots,", len(a["audio"]), "sound cues; music", MUSIC)
