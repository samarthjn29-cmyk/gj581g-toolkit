"""WCL-E01 act 1 rework to the energy rules (Sam, 25 Nov 2026: "Do the more burst version ... applied from Act 1 itself
... one act at a time"; library/rules/ENERGY.md). Takes the locked act 1 file that make_act1.py writes
(src/episodes/ep01-act01.json, v18) and lays the energy pass over it: LOK-033 Studio Cream, three bursts at the act's
turns, big key-word chips on their words (word-by-word stacks, set-up then punch, named items slammed in), moving
transitions in place of the hard cuts between scenes (TRN-019..022), pops/ticks on the chips, a riser into 151 years.
Run from library/: python3 ../episodes_src/WCL-E01/rework_act1/rework_act1.py [OUT.json]

Energy curve (rule 1):
  0-19.5   quiet: candle, geranium; one soft stack ("a geranium" / "nothing rare") so the open is not 20 s flat
  19.5-26  page p.29, "by day" -> "sky blue" (the colour he reported, big)
  BURST 1  26.3-37  page turn to p.30: "tonight" / "by the candle" -> punch "astonishingly changed";
                    the red floods the frame into the rows, "red." slams in
  37-49    rows: "much the same" (dims) -> "only one" -> "Jonathan"
  BURST 2  49-57    "who's right?" huge on the geranium, dive into the petal, "not so sure", pink floods into the moire
  57-72    calmer: "silly question?" / "not a silly man", pioneer, an answer
  BURST 3  72-88    lens: "fail." punch; riser into the counter, sub impact on 151 years (the act's one big line)
  88-104   dark room, Dalton's eyes opened, the prism into the series title
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(HERE, "..", "..", "..", "library")
SRC = os.path.join(LIB, "src", "episodes", "ep01-act01.json")
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(LIB, "src", "episodes", "ep01-act01-energy.json")
a = json.load(open(SRC))
B = {b["id"]: b for b in a["beats"]}
SKY, RED, PINK = "#86B5E8", "#C8402F", "#E79AB9"
K = "public/sfx/kit/"
THEME = "LOK-033"
a["themeId"] = THEME
a["episodeId"] = "WCL-E01-act01"
a["note"] = a["note"] + " Energy rework (ENERGY.md, Sam 25 Nov 2026) on LOK-033 Studio Cream: rework_act1.py."
for b in a["beats"]:
    b["assets"] = [x for x in b["assets"] if x != "LOK-009"]
pops = []  # (act sec) soft pops under chips


def add(b, *ids):
    for x in ids:
        if x not in b["assets"]:
            b["assets"].append(x)


def chips(sid, panels):
    """panels: list of (size, [(text, act_sec, x, y, extra dict)]); times in act seconds."""
    b = B[sid]
    ov = b.setdefault("overlay", {})
    for size, cs in panels:
        ov.setdefault("chips", []).append({"size": size, "chips": [
            {"text": t, "atSec": round(at - b["start"], 2), "x": x, "y": y, **ex} for t, at, x, y, ex in cs]})
        pops.extend(at for _, at, _, _, ex in cs if not ex.get("silent"))
        for c in ov["chips"][-1]["chips"]:
            c.pop("silent", None)
            for k in ("dimSec",):
                if k in c:
                    c[k] = round(c[k] - b["start"], 2)
    add(b, "TXT-024")


def trn(sid, kind, tid, spec=None, drop=()):
    b = B[sid]
    b["transitionIn"] = kind
    if spec is not None:
        b["transition"] = spec
    else:
        b.pop("transition", None)
    b["assets"] = [x for x in b["assets"] if x not in drop]
    add(b, tid)


A = {}  # accent flag shorthand
ACC = {"accent": True}

# --- quiet open: one soft stack on the geranium
chips("05+06+07", [(96, [("a geranium", 13.89, 140, 300, {}), ("nothing rare", 14.99, 140, 420, {})])])
# --- p.29: by day -> sky blue (rule 3: the colour he reported lands big)
chips("08+09+10", [(110, [("by day", 21.16, 1100, 690, {}), ("sky blue", 24.66, 1100, 830, ACC)])])
# --- BURST 1: page turn to p.30 (same paper, TRN-020), set-up then punch
trn("11+12+13", "pageturn", "TRN-020", drop=("TRN-015",))
B["11+12+13"]["ground"] = {"kind": "paper"}  # rule 7: pages keep the paper desk (was the blur plate)
B["11+12+13"]["assets"] = [x for x in B["11+12+13"]["assets"] if x != "LOK-028"] + ["LOK-027"]
chips("11+12+13", [(84, [("tonight", 26.47, 1100, 660, {"dimSec": 31.3, "dimTo": 0.3}),
                          ("by the candle", 27.25, 1100, 770, {"dimSec": 31.3, "dimTo": 0.3})]),
                    (110, [("astonishingly changed", 31.45, 360, 900, ACC)])])
# the red floods the frame from the changed line, and the rows open out of it (TRN-021, data colour)
trn("14+15+16+17+18+19", "flood", "TRN-021", {"color": RED, "at": [1240, 860], "r0": 60}, drop=("TRN-007",))
chips("14+15+16+17+18+19", [(150, [("red.", 35.18, 140, 220, ACC)])])
chips("14+15+16+17+18+19", [(62, [("much the same", 39.20, 120, 560, {"dimSec": 42.4, "dimTo": 0.3}),
                                   ("only one", 43.39, 120, 660, ACC),
                                   ("Jonathan", 47.12, 120, 760, {})])])
# --- BURST 2: who's right? -> dive into the petal -> not so sure -> pink floods into the moire
g = B["20"]["props"]
g["labels"] = []  # the small WHO'S RIGHT? label becomes the big chip
chips("20", [(150, [("who's right?", 49.54, 560, 760, ACC)])])
trn("21", "dive", "TRN-022", {"focus": [1033, 552], "r0": 40})
chips("21", [(110, [("not so sure", 53.94, 140, 780, {})])])
trn("22", "flood", "TRN-021", {"color": PINK, "at": [1000, 540], "r0": 80}, drop=("TRN-012",))
# --- calmer middle
B["23"]["props"]["labels"] = []
chips("23", [(110, [("a silly question?", 59.13, 120, 800, {})])])
trn("24", "push", "TRN-006", None)
B["24"]["focus"] = [700, 540]
chips("24", [(110, [("not a silly man", 61.13, 1020, 820, ACC)])])
# --- BURST 3: "fail." lands huge in the lens; a riser carries into the counter
chips("29+30+31", [(150, [("fail.", 79.71, 140, 640, ACC)])])
# --- the dark room and the open eye (on cream the room needs more dark to read as a dark room)
B["35+36"]["props"]["dark"] = 1.4
trn("34", "push", "TRN-006", None)
B["34"]["focus"] = [960, 600]
chips("35+36", [(96, [("a dark room", 90.28, 1180, 720, {}), ("a small hole", 92.98, 1180, 840, ACC)])])
trn("37", "dive", "TRN-022", {"focus": [600, 640], "r0": 30})
# the series title opens out of a beam split into the spectrum (TRN-019, the act's one turn about light)
trn("38", "prism", "TRN-019", {"y": 540, "splitX": 700})

# --- sound (rule 6)
a["audio"] = [c for c in a["audio"] if not (c["id"] == "SFX-024" and 54.0 <= c["atSec"] <= 54.3)]  # the old block's swish
seen = sorted(set(round(t, 2) for t in pops))
a["audio"] += [{"id": "SFX-026", "file": f"{K}tactile/soft_pop_v{1 + i % 3}.wav", "atSec": t, "volumeDb": -20.0}
               for i, t in enumerate(seen)]
lock = 85.87
a["audio"] += [
    {"id": "MUS-015", "atSec": round(lock - 2.5, 2), "volumeDb": -18.0},  # riser into 151 years (2.5 s)
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v2.wav", "atSec": round(B["14+15+16+17+18+19"]["start"] - 0.05, 2), "volumeDb": -18.0},  # the red flood
    {"id": "SFX-001", "atSec": round(B["22"]["start"], 2), "volumeDb": -20.0},  # the pink flood
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(B["21"]["start"] - 0.05, 2), "volumeDb": -19.0},  # dive into the petal
    {"id": "SFX-016", "file": K + "tactile/paper_move.wav", "atSec": round(B["11+12+13"]["start"] + 0.05, 2), "volumeDb": -19.0},  # page turn
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(B["24"]["start"] - 0.05, 2), "volumeDb": -20.0},  # push to the portrait
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(B["34"]["start"] - 0.05, 2), "volumeDb": -20.0},  # push to the candle
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(B["37"]["start"] - 0.05, 2), "volumeDb": -19.0},  # dive into the lens
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(B["38"]["start"] + 0.05, 2), "volumeDb": -18.0},  # the beam
]
a["audio"].sort(key=lambda c: c["atSec"])
for b in a["beats"]:
    for c in a["audio"]:
        pass
# beat assets for the sound cues that land inside each shot
for c in a["audio"]:
    for b in a["beats"]:
        if b["start"] <= c["atSec"] < b["end"] and c["id"] in ("SFX-026", "MUS-015"):
            add(b, c["id"])
a["themeId"] = THEME
json.dump(a, open(OUT, "w"), indent=1, ensure_ascii=False)
print("ok", OUT, len(a["beats"]), "shots;", len(seen), "pops")
