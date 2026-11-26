"""WCL-E01 act 2 rework to the energy rules (library/rules/ENERGY.md, Sam 25 Nov 2026: "one act at a time") and the
colour harmony rules (STYLE_GUIDE "Colour harmony", Sam 26 Nov 2026). Sam, 26 Nov 2026: "Start with Act 2 rework."
Takes the act 2 file make_act2.py writes (src/episodes/ep01-act02.json, the locked v10 picture, on-screen credits
already removed) and lays the energy pass over it on LOK-033 Studio Cream.
Run from library/: python3 ../episodes_src/WCL-E01/rework_act2/rework_act2.py [OUT.json]

Energy curve (rule 1; times are act seconds, word times from NAR-002 + the 2.4 s slate):
  0-27      quiet: slate, Eaglesfield, the Quaker page ("plain clothes" / "plain words"), the weather diary
            ("more than 50 years" / "every single day"), whip into the diary
  27-44     the walk to Kendal, the geranium again, p.30 opens: everyone sees the same change
  BURST 1   44-53   "all agreed" -> punch "except his brother" (thump), on the page's right side
  53-72     calmer: the biography, may have grown in the telling; page turn to p.99, the shop window
  BURST 2   72-96   "a sensible dark colour" -> the music breaks -> "red as a cherry" lands in cherry red with the
                    act's one sub impact; "John" / "Jonathan" can't see it; two grown men / one pair of stockings /
                    a mother quite sure slam in one after another with ticks
  96-115    what stays the same (the three panels, SAME stamps): a held, calm beat
  BURST 3   115-141 colour blindness: 8 in 100 / 4 in 1,000 / 4 in 50 slam in over the dot fields with ticks
  141-160   intimate: iris into "picture it from the inside"; grass, blood, cherries, sky, each in its own colour,
            one replacing the last (harmony: one story colour at a time)
  160-176   a warm light leak into "one evening, a flower changes colour"; "a scientist"; why?
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(HERE, "..", "..", "..", "library")
SRC = os.path.join(LIB, "src", "episodes", "ep01-act02.json")
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(LIB, "src", "episodes", "ep01-act02-v2.json")
a = json.load(open(SRC))
B = {b["id"]: b for b in a["beats"]}
K = "public/sfx/kit/"
ACCENT, INK, CREAM = "#FF4F2E", "#1E1A17", "#FFF8EC"
CHERRY, GRASS, BLOOD, SKY, DRAB = "#B3262E", "#4C9A3B", "#7A1A1A", "#86B5E8", "#3B4250"
THEME = "LOK-033"
a["themeId"] = THEME
a["episodeId"] = "WCL-E01-act02"
a["note"] = a.get("note", "") + " Energy + colour-harmony rework (ENERGY.md, STYLE_GUIDE harmony; Sam 26 Nov 2026) on LOK-033 Studio Cream: rework_act2.py."
for b in a["beats"]:
    b["assets"] = [x for x in b["assets"] if x != "LOK-009"]
    if "LOK-033" not in b["assets"]:
        b["assets"].append("LOK-033")
pops, ticks = [], []

# the old graphite accent and dark-ground outlines, hard-coded in a few props, move to the cream theme's roles
txt = json.dumps(a)
txt = txt.replace('"color": "#00E0BE", "style": "mark", "onMark": "#2F2D2C"', f'"color": "{ACCENT}", "style": "mark", "onMark": "{INK}"')
txt = txt.replace('"#00E0BE"', f'"{ACCENT}"').replace(', "outline": "#D9D2C5"', "")
a = json.loads(txt)
B = {b["id"]: b for b in a["beats"]}


def add(b, *ids):
    for x in ids:
        if x not in b["assets"]:
            b["assets"].append(x)


def chips(sid, size, cs, until=None, tick=False):
    """cs: [(text, act_sec, x, y, extra)]; times in act seconds; until: act sec the panel un-wipes."""
    b = B[sid]
    ov = b.setdefault("overlay", {})
    panel = {"size": size, "chips": [{"text": t, "atSec": round(at - b["start"], 2), "x": x, "y": y, **ex} for t, at, x, y, ex in cs]}
    for c in panel["chips"]:
        if "dimSec" in c:
            c["dimSec"] = round(c["dimSec"] - b["start"], 2)
    if until is not None:
        panel["untilSec"] = round(until - b["start"], 2)
    ov.setdefault("chips", []).append(panel)
    (ticks if tick else pops).extend(at for _, at, _, _, _ in cs)
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


ACC = {"accent": True}

# --- quiet open
q = B["06+07"]["props"]
q["notes"] = []  # PLAIN CLOTHES, PLAIN WORDS becomes the stack
chips("06+07", 96, [("plain clothes", 14.69, 1110, 740, {}), ("plain words", 15.71, 1110, 860, ACC)])
trn("08+09", "tear", "TRN-026", {"seed": 3}, drop=("TRN-013",))  # one book to another, torn paper (archive)
trn("10+11", "slide", "TRN-007")  # into the weather diary (a document; the whip is for one scene)
chips("10+11", 96, [("more than 50 years", 21.76, 140, 700, {}), ("every single day", 24.98, 140, 820, ACC)])

# --- BURST 1: they all agreed ... except his brother
chips("16+17+18+19+20+21", 72, [("they all agreed", 44.70, 1130, 760, {"dimSec": 50.1, "dimTo": 0.3})])
chips("16+17+18+19+20+21", 96, [("except his brother", 50.19, 920, 870, ACC)])

# --- calmer: the biography; the same book's title page turns to p.99
trn("25+26+27+28+29+30+31+32+33+34+35+36+37+38", "pageturn", "TRN-020", drop=("TRN-007",))

# --- BURST 2: a sensible dark colour -> red as a cherry (the act's one impact, in the cherry's own colour)
S = "25+26+27+28+29+30+31+32+33+34+35+36+37+38"
# chips sit in the free band above the stockings card (the page fills the left; the JOHN / JONATHAN DARK tags already
# carry "John can't see it" / "Neither can Jonathan", so no chips there)
chips(S, 60, [("a sensible dark colour", 73.50, 1230, 270, {})], until=81.6)
chips(S, 88, [("red as a cherry", 82.10, 1230, 290, {"color": CHERRY})], until=86.4)
for i, (t, at, nxt) in enumerate([("two grown men", 92.50, 93.65), ("one pair of stockings", 93.70, 94.90), ("a mother quite sure", 94.96, 98.4)]):
    chips(S, 64, [(t, at, 1230, 280, ACC if i == 2 else {})], until=nxt)

# SAME stamps on the photos go cream on a dark wash: tomato on the pink petals clashes (harmony 5)
for p in B["39+40+41+42+43+44"]["props"]["panels"]:
    if p.get("stamp"):
        p["stamp"]["tone"] = "paper"

# --- held beat: what stays the same (panels and stamps as locked); a calmer change in
trn("39+40+41+42+43+44", "slide", "TRN-007", drop=("TRN-012",))

# --- BURST 3: the numbers slam in over the dot fields
N = "45+46+47+48+49+50+51+52+53+54"
trn(N, "sweep", "TRN-025", {"dir": "right"}, drop=("TRN-007",))
for t, at, nxt in [("8 in 100", 121.48, 127.4), ("4 in 1,000", 129.45, 131.6), ("4 in 50", 133.79, 140.4)]:
    chips(N, 96, [(t, at, 1800 - 51 * len(t), 190, ACC)], until=nxt, tick=True)  # top right, clear of the dot field

# --- intimate: from the inside
trn("55+56", "iris", "TRN-023", drop=("TRN-011",))
g = B["57+58"]["props"]
g["lines"] = [l for l in g["lines"] if l.get("style") == "mono"]  # YOUR WHOLE LIFE stays; the four words become chips
for t, at, nxt, col in [("grass", 147.08, 147.86, GRASS), ("blood", 147.88, 148.62, BLOOD), ("cherries", 148.64, 149.54, CHERRY), ("sky", 149.56, 150.4, SKY)]:
    chips("57+58", 150, [(t, at, 760, 470, {"color": col})], until=nxt)
trn("57+58", "slide", "TRN-007")
trn("59+60+61+62", "slide", "TRN-007")
trn("63+64+65", "leak", "TRN-024", {"side": "left", "warm": True}, drop=("TRN-006",))

# --- sound (rule 6): pops under chips, ticks under named items, the act's one sub + thump on "red", a riser into it
seen = sorted(set(round(t, 2) for t in pops))
a["audio"] += [{"id": "SFX-026", "file": f"{K}tactile/soft_pop_v{1 + i % 3}.wav", "atSec": t, "volumeDb": -20.0} for i, t in enumerate(seen)]
tk = sorted(set(round(t, 2) for t in ticks))
a["audio"] += [{"id": "SFX-018", "file": f"{K}mechanical/stopwatch_tick_v{1 + i % 2}.wav", "atSec": t, "volumeDb": -19.0} for i, t in enumerate(tk)]
RED_AT = 82.10
# one sub per act (SFX-025: never two in one act): v1's sub after "brothers." (114.87) becomes the phone thump alone
for c in a["audio"]:
    if c["id"] == "SFX-025":
        c.update({"id": "SFX-005", "file": "public/sfx/muted-thump.wav", "volumeDb": -13.0})
        for b in a["beats"]:
            if b["start"] <= c["atSec"] < b["end"]:
                b["assets"] = [x for x in b["assets"] if x != "SFX-025"]; add(b, "SFX-005")
a["audio"] += [
    {"id": "SFX-025", "file": K + "mechanical/sub_impact_v1.wav", "atSec": RED_AT, "volumeDb": -12.0},
    {"id": "SFX-005", "file": "public/sfx/muted-thump.wav", "atSec": RED_AT, "volumeDb": -14.0},
    {"id": "MUS-015", "atSec": round(RED_AT - 2.5, 2), "volumeDb": -12.0},  # riser ending on the hit
    {"id": "SFX-005", "file": "public/sfx/muted-thump.wav", "atSec": 50.19, "volumeDb": -16.0},  # except his brother
    {"id": "SFX-028", "file": K + "pixabay/page_turn_book_v2.wav", "atSec": round(B[S]["start"] - 0.44, 2), "volumeDb": -14.0},  # page turn (peak 0.52 s in)
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(B["10+11"]["start"] - 0.05, 2), "volumeDb": -19.0},  # slide into the diary
    {"id": "SFX-016", "file": K + "tactile/paper_move.wav", "atSec": round(B["08+09"]["start"], 2), "volumeDb": -19.0},  # tear
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(B[N]["start"] - 0.05, 2), "volumeDb": -19.0},  # sweep
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(B["55+56"]["start"] - 0.05, 2), "volumeDb": -20.0},  # iris
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(B["59+60+61+62"]["start"] - 0.08, 2), "volumeDb": -22.0},  # slide into the rows, texture under 'colour' (sound pass M)
]
# Sound review, Gate 3 (gate3_act2v2/SOUND_act2v2_v1.md, 26 Nov 2026): the thump file peaks 0.16 s in, so a thump
# starts 0.16 s before its word; hits kept clear of the voice's 1-4 kHz; no kit sound three times running.
def fix(cid, at, **ch):
    for c in a["audio"]:
        if c["id"] == cid and abs(c["atSec"] - at) < 0.006:
            if ch.get("drop"):
                a["audio"].remove(c)
            else:
                c.update(ch)
            return
    raise SystemExit(f"sound fix: no {cid} at {at}")
fix("SFX-005", 82.10, atSec=81.94, volumeDb=-22.0); fix("SFX-026", 82.10, volumeDb=-26.0)
fix("SFX-016", 104.03, drop=True)
fix("MUS-015", 79.6, volumeDb=-6.0)
fix("SFX-005", 114.87, atSec=114.71); fix("SFX-024", 115.01, drop=True)
fix("SFX-018", 129.45, volumeDb=-26.0); fix("SFX-018", 133.79, volumeDb=-27.0)
fix("SFX-005", 50.19, volumeDb=-22.0)
fix("SFX-026", 94.79, drop=True)
a["audio"].sort(key=lambda c: c["atSec"])
for c in a["audio"]:
    for b in a["beats"]:
        if b["start"] <= c["atSec"] < b["end"] and c["id"] in ("SFX-026", "SFX-018", "SFX-025", "SFX-005", "MUS-015", "SFX-028"):
            add(b, c["id"])
# the YearCounter-style picture hit: the cherry chip lands on the sub's own frame (ENERGY 6)
json.dump(a, open(OUT, "w"), indent=1, ensure_ascii=False)
print("ok", OUT, len(a["beats"]), "shots;", len(seen), "pops;", len(tk), "ticks")
