"""WCL-E01 act 1 act file (src/episodes/ep01-act01.json) from the approved Gate 1 beat sheet.
Shots join beat-sheet beats whose picture carries on; every cue is a word time from Sam's paced take
(01_flower_paced_words.json) plus the 0.8 s lead-in. Run from anywhere; writes into the library."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.join(HERE, "..", "..", "..", "library")
WORDS = os.environ.get("WORDS", "/home/claude/wcl/ep01/voice/eleven/01_flower_paced_words.json")
LEAD = 0.8
W = [(t.strip(".,;?").lower(), a + LEAD, b + LEAD) for t, a, b in json.load(open(WORDS))]
ad = json.load(open(os.path.join(HERE, "..", "gate1", "AD.json")))
hv = json.load(open(os.path.join(HERE, "..", "gate1", "HV.json")))
BEAT = {r[0]: (r[2], r[3]) for r in ad}

def word(w, after=0.0, end=False):
    for t, a, b in W:
        if t == w and a >= after - 1e-6:
            return round(b if end else a, 2)
    raise KeyError(f"{w} after {after}")

def ids(beats):
    out = []
    for b in beats:
        i = int(b.split("-")[-1]) - 1
        row = hv[i]
        for col in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11):
            for x in row[col].split(","):
                x = x.strip()
                if x and x not in out:
                    out.append(x)
    return out

SKY, RED, PINK = "#86B5E8", "#C8402F", "#E79AB9"  # what each person reported (data, not theme colours)
P29 = ([1920, 2813], [380, 1220, 1100, 1050])
P30 = ([1920, 2934], [500, 400, 1080, 1030])
GER = [1920, 1280]
CANDLE = "public/assets/sources/candle_lighting_mixkit3458.mp4"
CANDLE_REV = "public/assets/sources/candle_lighting_mixkit3458_rev.mp4"
shots = []

def shot(beats, component, props, **kw):
    s, e = BEAT[beats[0]][0], BEAT[beats[-1]][1]
    rel = lambda x: round(x - s, 2)
    p = props(rel) if callable(props) else props
    d = {"id": "+".join(b.split("-")[-1] for b in beats), "beats": beats, "start": s, "end": e,
         "component": component, "assets": ids(beats), "props": p,
         "beatTimes": [[b, BEAT[b][0], BEAT[b][1]] for b in beats]}
    d.update(kw)
    # Guard (independent review, 22 Nov 2026: word("own") matched "his own words" 44 s earlier, so a line
    # showed before it was spoken): any cue before the shot's own start is a wrong word match.
    def walk(o, path=""):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ("atSec", "untilSec", "fillSec", "nameAtSec", "dimAtSec", "brightAtSec", "countFromSec", "lockSec", "openAtSec") and isinstance(v, (int, float)) and v < -0.05 and v != -1:  # -1 = already in place on the cut
                    raise SystemExit(f"shot {d['id']}: {path}.{k} = {v} (before the shot starts: wrong word match?)")
                walk(v, f"{path}.{k}")
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, f"{path}[{i}]")
    walk(p)
    shots.append(d)

B = lambda *n: [f"E01-A1-{k:02d}" for k in n]

# 1-4 Kendal: the candle is lit (the clip reversed, so the flame catches), dateline, Dalton's label.
shot(B(1, 2, 3, 4), "FootagePlate", lambda r: {
    "srcId": "SRC-011", "file": CANDLE_REV, "kind": "video", "size": [1080, 1920], "focus": 0.56, "warmth": [1, 1],
    "tag": {"at": "low-centre", "toCornerAtSec": r(BEAT["E01-A1-03"][0] + 0.3), "parts": [
        {"text": "KENDAL", "atSec": r(word("kendall"))},
        {"text": "NORTH OF ENGLAND", "atSec": r(word("north")), "untilSec": r(word("autumn"))},
        {"text": "AUTUMN 1792", "atSec": r(word("1792"))}]},
    "labels": [{"text": "JOHN DALTON · TEACHER", "atSec": r(word("john")), "x": 960, "y": 820, "align": "center"}]})
# 5-7 the geranium (push-through from the flame), warm candle grade drifting to neutral on beat 7.
shot(B(5, 6, 7), "FootagePlate", lambda r: {
    "srcId": "SRC-013", "kind": "image", "size": GER, "crop": [380, 330, 1000, 562], "warmth": [1, 0],
    "warmthSec": [r(BEAT["E01-A1-07"][0]), r(BEAT["E01-A1-07"][1])],
    "labels": [{"text": "DALTON'S 'GERANIUM ZONALE'", "atSec": r(word("geranium")), "x": 1240, "y": 820,
                "moveTo": {"atSec": r(BEAT["E01-A1-07"][0]), "x": 1380, "y": 960, "scale": 1}}]},
    transitionIn="push", focus=[960, 560])
# 8-10 p.29 held for three beats (Sam, 22 Nov 2026: the pages moved too fast to read; the p.30 card that
# followed is gone). Highlights in reading order, the last one on "almost".
shot(B(8, 9, 10), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-001", "imgSize": P29[0], "crop": P29[1], "side": "left",
    "highlights": [{"box": [1015, 2040, 375, 46], "atSec": 0.6},
                   {"box": [440, 2100, 700, 54], "atSec": 1.5},
                   {"box": [1090, 2158, 300, 46], "atSec": r(word("almost"))}],
    "quote": "the Geranium zonale by candle-light, in the Autumn of 1792",
    "source": "JOHN DALTON · 1798 · P. 29"},
    transitionIn="slide")
# 12-13 p.30: "astonishingly changed"
# 11-13 p.30 held from "Tonight" (independent review, 22 Nov 2026: the 2.7 s swatch shot between the pages
# made a page-swatch-page-swatch ping-pong): "sky-blue by day; in candle-light" on "candle", then
# "astonishingly changed". Slides in from p.29 like the next page of the paper.
shot(B(11, 12, 13), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-029", "imgSize": P30[0], "crop": P30[1], "side": "left",
    "highlights": [{"box": [570, 588, 640, 56], "atSec": r(word("candle", 27))},
                   {"box": [570, 645, 430, 56], "atSec": r(word("it", 30))}],  # lands on "astonishingly"
    "quote": "in candle-light, however, it was astonishingly changed",
    "source": "JOHN DALTON · 1798 · P. 30"},
    transitionIn="slide")
# 14-19 the rows: John blue/red, friends pink/pink, his brother blue/red.
shot(B(14, 15, 16, 17, 18, 19), "SwatchRows", lambda r: {
    "columns": ["BY DAY", "BY CANDLE"],
    "rows": [
        {"name": "JOHN", "nameAtSec": r(word("friends")), "atSec": 0,
         "cells": [{"color": SKY, "name": "SKY-BLUE", "atSec": 0, "fillSec": 0},
                   {"color": RED, "name": "RED", "atSec": 0, "fillSec": r(word("red"))}]},
        {"name": "FRIENDS", "atSec": r(word("friends")), "dimAtSec": r(word("of", 42)),
         "cells": [{"color": PINK, "name": "PINK", "atSec": r(word("friends")), "fillSec": r(word("day", 39))},
                   {"color": PINK, "name": "PINK", "atSec": r(word("friends")), "fillSec": r(word("candle", 40))}],
         "tag": {"text": "NO REAL CHANGE", "atSec": r(word("candle", 40))}},
        {"name": "HIS BROTHER", "nameAtSec": r(word("brother")), "atSec": r(BEAT["E01-A1-18"][0]),
         "cells": [{"color": SKY, "name": "SKY-BLUE", "atSec": r(BEAT["E01-A1-18"][0]), "fillSec": r(word("brother"))},
                   {"color": RED, "name": "RED", "atSec": r(BEAT["E01-A1-18"][0]), "fillSec": r(word("brother"))}],
         "sub": {"text": "JONATHAN", "atSec": r(word("jonathan"))}}],
    "caption": {"text": "What he called red", "atSec": r(word("red")), "untilSec": r(word("friends"))}},
    transitionIn="slide")
# 20 the geranium alone; 21 push into one petal; 22 WHERE IS THE PINK?
# 20 the friends' pink swatch grows into the flower (push-through); label on the question (Vox rule: visualise every line).
shot(B(20), "FootagePlate", lambda r: {"srcId": "SRC-013", "kind": "image", "size": GER, "crop": [380, 330, 1000, 562], "warmth": [0, 0],
                                       "labels": [{"text": "WHO'S RIGHT?", "atSec": r(word("who's")), "x": 960, "y": 860, "align": "center", "accent": True}]},
     transitionIn="push", focus=[1033, 552])
shot(B(21), "FootagePlate", {"srcId": "SRC-013", "kind": "image", "size": GER, "crop": [640, 560, 520, 292], "warmth": [0, 0]})
# 22 (Sam, 22 Nov 2026: "I like the Moire pattern. Let's use it where it fits best"): the friends' pink as a
# big swatch; a loupe glides across it and inside it the "flat" pink is only dots of ink on paper, with a
# slow moire. LOK-017 (own build; the geranium photo SRC-013 stays unaltered, its licence says so).
shot(B(22), "HalftoneMoire", lambda r: {
    "color": PINK, "name": "PINK", "loupe": {"atSec": 0.15, "from": [1130, 470], "to": [1480, 600], "moveSec": 2.6, "r": 230, "cell": 22},
    "moire": {"opacity": 0.22, "turnDeg": 4},
    "lines": [{"text": "Where is the pink?", "atSec": r(word("where")),
               "fill": {"word": "pink", "atSec": r(word("pink", 54)), "color": PINK}}]})  # TXT-015 FillSweep
# 23 back to the candle, wide (the clip forward, from 3 s in).
shot(B(23), "FootagePlate", lambda r: {"srcId": "SRC-011", "file": CANDLE, "kind": "video", "size": [1080, 1920], "focus": 0.56,
                              "clipStartSec": 3, "warmth": [1, 1],
                              "labels": [{"text": "A SILLY QUESTION?", "atSec": r(word("it", 58)) - 0.3, "x": 960, "y": 860, "align": "center"}]})
# 24 Dalton's first face: Charles Turner's mezzotint, 1834.
shot(B(24), "ParallaxCutout", lambda r: {
    "bg": {"srcId": "SRC-004", "imgSize": [996, 1230], "crop": [0, 300, 996, 560]},
    "fg": {"srcId": "SRC-004", "imgSize": [996, 1230], "crop": [110, 60, 790, 1010]},
    "kicker": "PORTRAIT · 1834", "headline": "John Dalton", "startSec": max(0, r(word("dalton", 60)) - 0.3),
    # TRN-008: his first face is drawn first, then becomes the real portrait.
    "trace": {"file": "public/assets/sources/dalton_turner1834_trace.png", "atSec": 0.0, "drawSec": 0.9, "fillSec": 0.6}})
# 25-26 beside the portrait: a pioneer of atomic theory; later, 1808.
shot(B(25, 26), "DuotoneCollage", lambda r: {
    "pieces": [
        {"color": SKY, "x": 1660, "y": 230, "w": 320, "h": 210, "rot": 6, "atSec": -1, "seed": 7},
        {"srcId": "SRC-004", "file": "public/assets/sources/dalton_turner1834_halftone.png", "imgSize": [760, 972],
         "x": 1420, "y": 450, "w": 600, "rot": -2.5, "atSec": -1, "caption": "JOHN DALTON · 1834", "captionAt": "top", "seed": 3},
        {"srcId": "SRC-031", "file": "public/assets/sources/dalton1808_symbols_line.png", "imgSize": [1000, 705],
         "x": 1240, "y": 735, "w": 620, "rot": 2.5, "atSec": max(0.6, r(word("pioneer")) - 0.2), "caption": "HIS ATOMS · PLATE 4, 1808", "seed": 5}],
    "lines": [{"text": "A pioneer of atomic theory", "atSec": r(word("pioneer"))},
              {"text": "LATER · 1808, A NEW SYSTEM OF CHEMICAL PHILOSOPHY", "atSec": r(word("pioneer")) + 0.6, "style": "mono"}]})
# 27-28 about two years later: an answer. VIS-028 collage: his own words on the geranium, between the two
# colours he saw (sky-blue by day, red by candle).
shot(B(27, 28), "DuotoneCollage", lambda r: {
    "pieces": [
        {"srcId": "SRC-001", "file": "public/assets/sources/dalton1798_p29_line.png", "imgSize": [1100, 240],
         "x": 1340, "y": 420, "w": 980, "rot": -1.5, "atSec": -1, "caption": "HIS OWN WORDS · P. 29", "seed": 11},
        {"color": SKY, "x": 1150, "y": 740, "w": 340, "h": 240, "rot": 4, "atSec": 0.7, "seed": 13},
        {"color": RED, "x": 1540, "y": 760, "w": 340, "h": 240, "rot": -3, "atSec": 1.1, "seed": 17}],
    "lines": [{"text": "An answer.", "atSec": r(word("answer"))}],
    "tag": {"at": "corner", "parts": [{"text": "ABOUT TWO YEARS LATER", "atSec": r(word("about", 67))}]}})
# 29-31 (Sam, 22 Nov 2026: "an eye which has been cut", the words on screen): the whole eye as a line drawing;
# the cut line traces round it on "examined"; the words beside it; THE TEST · 1844.
shot(B(29, 30, 31), "EyeDissection", lambda r: {
    "cutAtSec": r(word("examined")),
    # The first group leaves in the pause after "dies." so the next line arrives alone, in the same place.
    "words": [{"text": "Tested", "atSec": r(word("tested")), "untilSec": r(word("dies", end=True) + 0.7)},
              {"text": "His own eyes", "atSec": r(word("own", 74)), "untilSec": r(word("dies", end=True) + 0.7)},
              {"text": "EXAMINED AFTER HE DIES", "atSec": r(word("examined")), "style": "mono", "untilSec": r(word("dies", end=True) + 0.7)},
              {"text": "His idea will fail the test.", "atSec": r(word("idea")), "group": 1}],
    "tag": {"at": "corner", "parts": [{"text": "THE TEST · 1844", "atSec": r(word("his", 78))}]}})
# 32-33 the counter: 0 -> 151 YEARS, locks on "years".
shot(B(32, 33), "YearCounter", lambda r: {
    "to": 151, "unit": "YEARS", "countFromSec": r(word("wait")), "lockSec": r(word("years", 85))})
# 34 back to the candle, which gutters out (the clip's own ending) into the dark room.
shot(B(34), "FootagePlate", lambda r: {"srcId": "SRC-011", "file": CANDLE, "kind": "video", "size": [1080, 1920], "focus": 0.56,
                                       "clipStartSec": 10.55, "warmth": [1, 1], "fadeOutSec": r(BEAT["E01-A1-34"][1]) - 0.5})
# 35-36 the grid: Newton's dark room, the shutter hole lights on "hole", the beam starts after "shutter."
shot(B(35, 36), "PerspectiveGrid", lambda r: {
    "variant": "room", "depth": 2000, "dark": 0.7, "dolly": 0.02, "startSec": r(word("dark")) - 0.2,
    "objects": [
        {"kind": "shutter", "at": [-1050, -150, 600], "w": 260, "h": 360, "atSec": r(word("dark")) + 0.4},
        {"kind": "hole", "at": [-1050, -150, 600], "r": 22, "atSec": r(word("hole"))},
        {"kind": "label", "at": [-1050, -380, 600], "text": "A HOLE IN THE SHUTTER", "atSec": r(word("hole"))},
        {"kind": "beam", "from": [-1050, -150, 600], "to": [-300, 120, 1400], "width": 14,
         "atSec": r(word("shutter")), "drawSec": 0.7}],
    "tag": {"at": "corner", "parts": [{"text": "ISAAC NEWTON", "atSec": r(word("newton"))}]}})
# 37 the same cut eye: the front lifts away on "open".
shot(B(37), "EyeDissection", lambda r: {
    "cutAtSec": -2, "openAtSec": r(word("open")),
    "words": [{"text": "Open Dalton's eyes", "atSec": r(word("open"))},
              {"text": "AS HE ASKED", "atSec": r(word("open")) + 0.5, "style": "mono"}]})
# 38-39 the title cards; the season sting (MUS-006) plays under the first.
shot(B(38), "SeriesTitleCard", {})
shot(B(39), "EpisodeCard", {"number": 1, "title": "The Man Who Saw Pink"})

audio = [
    {"id": "SFX-013", "atSec": 0.0, "volumeDb": 2},
    {"id": "SFX-014", "atSec": 0.0, "volumeDb": 0, "fadeInSec": 1.0, "fadeOutSec": 1.0, "endSec": 19.4},
    {"id": "SFX-006", "atSec": 19.5, "volumeDb": -12},
    {"id": "SFX-005", "atSec": 86.85, "volumeDb": -18},
    {"id": "SFX-015", "atSec": round(word("years", 85), 2), "volumeDb": -16},  # count lock tick (own)
    {"id": "SFX-001", "atSec": 94.6, "volumeDb": -14},
    {"id": "MUS-006", "atSec": BEAT["E01-A1-38"][0] + 0.15, "volumeDb": -6},  # Sam's pick, option C 'prism'
]
act = {"episodeId": "WCL-E01-act01", "themeId": "LOK-009",
       "note": "Act 1 of WCL-E01 'The Man Who Saw Pink'. Gate 1 approved by Sam 22 Nov 2026. Shots join beat-sheet beats (see 'beats'). Cues from 01_flower_paced_148wpm + 0.8 s lead-in.",
       "voice": {"id": "SRC-030", "atSec": LEAD},
       "audio": audio, "beats": shots}
json.dump(act, open(os.path.join(LIB, "src", "episodes", "ep01-act01.json"), "w"), indent=1, ensure_ascii=False)
print(len(shots), "shots,", shots[-1]["end"], "s")
