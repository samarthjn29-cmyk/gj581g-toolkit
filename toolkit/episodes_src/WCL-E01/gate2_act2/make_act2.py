"""WCL-E01 act 2 act file (src/episodes/ep01-act02.json) from the approved Gate 1 beat sheet (Sam, 22 Nov 2026 21:18:
"Act2 gate 1 approved"). Shots join beat-sheet beats whose picture carries on; every cue is a word time from Sam's
final take (02_brothers_paced_149wpm_even, NAR-002) plus the 2.4 s chapter slate. Writes into the library."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
G1 = os.path.join(HERE, "..", "gate1_act2")
LIB = os.path.join(HERE, "..", "..", "..", "library")
LEAD = 2.4
VOICE_SEC = 172.533  # ffprobe of public/episodes/wcl-e01/02_brothers_paced_149wpm_even.wav (NAR-002)
W = [(t.strip(".,;?!\"'").lower(), a + LEAD, b + LEAD) for t, a, b in json.load(open(os.path.join(G1, "02_brothers_final_words.json")))]
dump = json.load(open(os.path.join(G1, "beatsheet_dump.json")))
vals = dump["values"] if isinstance(dump, dict) else dump
ROWS = {r[0]: r for r in vals if r and r[0].startswith("E01-A2-")}
BEAT = {k: (float(r[2]), float(r[3])) for k, r in ROWS.items()}

def word(w, after=0.0, end=False):
    for t, a, b in W:
        if t == w and a >= after - 1e-6:
            return round(b if end else a, 2)
    raise KeyError(f"{w} after {after}")

def ids(beats):
    out = []
    for b in beats:
        for col in range(8, 19):  # Visual .. Source columns of the beat sheet
            cell = ROWS[b][col] if col < len(ROWS[b]) else ""
            for x in cell.split(","):
                x = x.strip()
                if x and x not in out:
                    out.append(x)
    return out

# Data colours (what people reported or the things named), never theme colours.
SKY, RED, CHERRY, DARK = "#86B5E8", "#C8402F", "#B3262E", "#3B4250"
GRASS, BLOOD = "#4C9A3B", "#7A1A1A"
GER = [1920, 1280]
MAP = [4000, 5313]
EAG, KEN = (858, 2795), (1985, 3825)  # Eaglesfield and Kendal on Bowen's 1760 map (SRC-033)
MAPSRC = "MAP · EMANUEL BOWEN · 1760 · YALE UNIVERSITY LIBRARY"
P30 = [1920, 2934]
CANDLE = "public/assets/sources/candle_lighting_mixkit3458.mp4"
CANDLE_REV = "public/assets/sources/candle_lighting_mixkit3458_rev.mp4"
FLAT = "public/assets/sources/period_stockings_flat.jpg"
MASK = "public/assets/sources/period_stockings_flat_mask.png"
shots = []

def shot(beats, component, props, **kw):
    s, e = BEAT[beats[0]][0], BEAT[beats[-1]][1]
    rel = lambda x: round(x - s, 2)
    p = props(rel) if callable(props) else props
    d = {"id": "+".join(b.split("-")[-1] for b in beats), "beats": beats, "start": s, "end": e,
         "component": component, "assets": ids(beats), "props": p,
         "beatTimes": [[b, BEAT[b][0], BEAT[b][1]] for b in beats]}
    d.update(kw)
    trn = {"push": "TRN-006", "slide": "TRN-007", "match": "TRN-015", "band": "TRN-011", "block": "TRN-012", "flash": "TRN-013", "lens": "TRN-017"}.get(d.get("transitionIn", ""))
    if trn and trn not in d["assets"]:
        d["assets"].append(trn)
    def walk(o, path=""):  # any cue before the shot starts is a wrong word match (act 1 review lesson)
        if isinstance(o, dict):
            for k, v in o.items():
                if k.endswith("Sec") and k not in ("moveSec", "drawSec", "sec") and isinstance(v, (int, float)) and v < -0.05 and v != -1:
                    raise SystemExit(f"shot {d['id']}: {path}.{k} = {v} (before the shot starts: wrong word match?)")
                walk(v, f"{path}.{k}")
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, f"{path}[{i}]")
    walk(p)
    shots.append(d)

B = lambda *n: [f"E01-A2-{k:02d}" for k in n]
S = lambda n: BEAT[f"E01-A2-{n:02d}"][0]

# 1 the chapter slate (no narration; the bed carries on from act 1).
shot(B(1), "ChapterSlate", {"index": "02", "title": "The odd one out"})
# 2-5 Bowen's 1760 map: close on Eaglesfield, pin and rings on its name, then out to the north-west of England.
shot(B(2, 3, 4, 5), "PeriodMapPlate", lambda r: {
    "srcId": "SRC-033", "size": MAP, "source": MAPSRC,
    "views": [{"atSec": 0, "crop": [380, 2420, 1400, 788]},
              {"atSec": r(word("northwest")), "crop": [0, 1700, 3800, 2138], "moveSec": 1.8}],
    "pins": [{"id": "eag", "x": EAG[0], "y": EAG[1], "atSec": r(word("eaglesfield"))}],
    "rings": [{"pin": "eag", "atSec": r(word("eaglesfield")), "pulses": 2}],
    "labels": [{"text": "BORN 1766", "atSec": r(word("1766")), "untilSec": 4.9, "x": 960, "y": 860, "align": "center"},
               {"text": "NORTH-WEST ENGLAND", "atSec": 5.5, "untilSec": 6.9, "x": 960, "y": 860, "align": "center"},
               {"text": "A QUAKER FAMILY", "atSec": 7.5, "x": 960, "y": 860, "align": "center", "accent": True}],
    "tag": {"at": "corner", "parts": [{"text": "EAGLESFIELD", "atSec": r(word("eaglesfield"))}, {"text": "CUMBERLAND", "atSec": r(word("cumberland"))}]}},
    transitionIn="band", transition={"dir": "down", "tone": "paper"})
# 6-7 the Quaker advice on plainness (1691, printed 1783).
shot(B(6, 7), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-034", "imgSize": [1814, 2600], "crop": [185, 370, 1395, 1330], "side": "left",
    "highlights": [{"box": [200, 425, 1150, 95], "atSec": 0.6},
                   {"box": [945, 640, 615, 55], "atSec": r(word("plain"))},
                   {"box": [190, 695, 1025, 55], "atSec": r(word("plain")) + 0.8}],
    "quote": "keep to truth and plainness, in language, habit, deportment, and behaviour",
    "source": "QUAKER ADVICE OF 1691 · PRINTED LONDON 1783 · P. 185",
    "notes": [{"text": "PLAIN CLOTHES, PLAIN WORDS", "atSec": r(word("plain", 14))}]},
    transitionIn="slide")
# 8-9 Dalton's first book, 1793 (first edition, e-rara): his habit of writing everything down.
shot(B(8, 9), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-035", "imgSize": [1575, 2588], "crop": [250, 280, 1080, 1980], "side": "left",
    "highlights": [{"box": [340, 560, 770, 85], "atSec": 0.3},
                   {"box": [480, 1290, 520, 80], "atSec": 0.9}],  # his name as he is named (QA: 2 s to read before the cut)
    "quote": "Meteorological Observations and Essays", "quoteMarks": False,
    "source": "JOHN DALTON · LONDON, 1793 · FIRST EDITION · ETH-BIBLIOTHEK ZÜRICH",
    "notes": [{"text": "HIS FIRST BOOK · 1793", "atSec": 1.0},
              {"text": "BUILT ON HIS WEATHER RECORDS", "atSec": 2.6}]},
    transitionIn="flash")
# 10-11 the diary: a plain card with our own hatched notebook (illustrative; no writing), rows filling day by day.
shot(B(10, 11), "KineticLine", lambda r: {
    "ink": True,  # TXT-016 InkSpreadType: the period headline presses into the paper
    "lines": [{"text": "A diary of the weather", "atSec": r(word("diary"))},
              {"text": "THE DIARY · FROM 24 MARCH 1787", "atSec": r(word("50")), "style": "mono"},
              {"text": "TO THE EVENING BEFORE HE DIED · 1844", "atSec": r(word("every")), "style": "mono"}],
    "notebook": {"atSec": 0.1, "rowsFromSec": 0.6, "rowsToSec": r(word("day", 24, end=True))},
    "tag": {"at": "corner", "parts": [{"text": "ILLUSTRATION", "atSec": 0.1}]}})
# 12-13 back to the map (v7, 23 Nov 2026, MAP-012 TravellingMap v2 from the maps study): the camera leaves
# Eaglesfield as he is named teaching, follows the route as it draws and tilts the map back towards Kendal, the
# turn trailing the move (an orbit); Kendal's pin lands on its word (MOT-012) and only a band round it stays sharp
# (LOK-032). Same corner tag and line as before.
shot(B(12, 13), "TravellingMap", lambda r: {
    "srcId": "SRC-033", "size": MAP, "caption": MAPSRC,
    "cams": [{"atSec": 0, "center": [1360, 2920], "zoom": 0.86},  # gate 3 review of v8: the map's left edge showed at [1050, ...]
             {"atSec": r(word("teaching")), "center": [1480, 3330], "zoom": 0.8, "tilt": 24, "turn": -4, "sec": 1.8},  # 0.7 showed a dark wedge top-left
             {"atSec": r(word("district")), "center": [1860, 3500], "zoom": 0.76, "tilt": 32, "turn": -6, "sec": 1.6}],  # the route's start clear of the tag
    "lag": 0.25, "holdTilt": 2, "dof": {"focusY": 610, "band": 230},
    "pins": [{"at": list(EAG), "atSec": 0.1},
             {"at": list(KEN), "atSec": r(word("kendal", 26, end=True)) - 0.56, "drop": True, "accent": True}],  # lands ~0.04 s after "Kendal," (SFX-026 pop)
    "routes": [{"points": [list(EAG), [1380, 3330], list(KEN)], "atSec": r(word("teaching")), "sec": 1.3}],
    "labels": [{"text": "IN KENDAL FROM AGE 15", "atSec": r(word("15")) - 0.9, "x": 960, "y": 860, "align": "center", "accent": True}],
    "tag": {"at": "corner", "parts": [{"text": "KENDAL", "atSec": r(word("kendal", 26))}, {"text": "WESTMORLAND", "atSec": r(word("market"))}]}},
    transitionIn="band", transition={"dir": "up", "tone": "paper"})
# 14-15 the geranium by candle (push-through from the Kendal pin).
shot(B(14, 15), "FootagePlate", lambda r: {
    "srcId": "SRC-013", "kind": "image", "size": GER, "crop": [380, 330, 1000, 562], "warmth": [1, 1], "flicker": {}, "analogue": {},  # LOK-016, LOK-015: lit by the candle
    "labels": [{"text": "THE GERANIUM, 1792", "atSec": max(0.2, r(word("geranium"))), "untilSec": r(word("takes")), "x": 1240, "y": 820},
               {"text": "WHAT DO YOU SEE?", "atSec": r(word("takes")) + 0.2, "x": 960, "y": 860, "align": "center", "accent": True}]},
    transitionIn="push", focus=[1090, 766])  # Director 23 Nov: the push opens from the Kendal pin (its frame position after the map fix)
# 16-21 p.30: his friends, his surprise, they all agreed, except his brother.
shot(B(16, 17, 18, 19, 20, 21), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-029", "imgSize": P30, "crop": [500, 510, 1080, 1030], "side": "left",
    "highlights": [{"box": [570, 882, 970, 56], "atSec": r(word("asks"))},
                   {"box": [1035, 940, 175, 56], "atSec": r(word("surprised"))},
                   {"box": [1405, 940, 135, 56], "atSec": r(word("they", 41))},
                   {"box": [570, 1000, 140, 56], "atSec": r(word("they", 41)) + 0.25},
                   {"box": [1085, 1000, 455, 56], "atSec": r(word("not", 44))},
                   {"box": [1180, 1060, 360, 56], "atSec": r(word("except"))},
                   {"box": [570, 1118, 765, 56], "atSec": r(word("brother"))}],
    "callout": {"atSec": r(word("except")), "dim": 0.7},
    "quote": "except my brother who saw it in the same light as myself",
    "source": "JOHN DALTON · 1798 · P. 30"},
    transitionIn="match")
# 22-24 Lonsdale's 1874 life: the source of the stockings story, and how far after the fact it was written.
shot(B(22, 23, 24), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-036", "imgSize": [785, 1158], "crop": [60, 100, 690, 1000], "side": "left",
    "highlights": [{"box": [185, 455, 430, 50], "atSec": 0.5},
                   {"box": [336, 1002, 84, 40], "atSec": r(word("30"))}],
    "quote": "The Worthies of Cumberland: John Dalton", "quoteMarks": False,
    "source": "HENRY LONSDALE · LONDON, 1874",
    "strokes": {},  # TEX-008 'shadow' strokes drift over the held title page (the story told and retold), off the highlights
    "notes": [{"text": "AS THE STORY GOES", "atSec": r(word("another"))},
              {"text": "A BIOGRAPHY", "atSec": r(word("biography"))},  # Gate 3 stillness: a change inside 56-60 s
              {"text": "1874 · 30 YEARS AFTER HE DIED", "atSec": r(word("30"))},
              {"text": "MAY HAVE GROWN IN THE TELLING", "atSec": 6.9, "accent": True}]},
    transitionIn="push", focus=[700, 640])
# 25-38 the stockings, told on Lonsdale's own page (Sam, 23 Nov: "Let's think of something else to do the stockings
# scene ... get the help of an independent animator and graphic designer"; their pick, concept A "The page tells it",
# gate3_act2/STOCKINGS_DESIGN_REVIEW.md). VIS-051 SourcePageStory on the dark desk; p.99 = SRC-038 (crop coords).
P99 = "public/assets/sources/lonsdale1874_p99.jpg"
shot(B(*range(25, 39)), "SourcePageStory", lambda r: {
    "page": {"srcId": "SRC-038", "file": P99, "size": [2450, 3025], "scale": 0.48, "lineH": 84},
    "frames": [{"atSec": 0, "y": 1350}, {"atSec": r(word("mother", 70, end=True)) + 0.02, "y": 2580}],
    "marks": [
        {"boxes": [[555, 810, 1080]], "atSec": r(word("kendal", 65)), "sec": 0.45},
        {"boxes": [[1169, 2143, 975]], "atSec": r(word("passes", 66)), "sec": 0.9},
        {"boxes": [[815, 1666, 1080]], "atSec": r(word("sees", 68)), "sec": 1.0},
        {"boxes": [[975, 1976, 1180]], "atSec": r(word("stockings", 68, end=True)) + 0.15, "sec": 0.8},
        {"boxes": [[1885, 2145, 1287], [148, 1585, 1394]], "atSec": r(word("buys", 70)), "sec": 1.0},
        {"boxes": [[1330, 2142, 2323]], "atSec": r(word("to", 72)), "sec": 0.9, "kind": "line"},
        {"boxes": [[977, 1620, 2427]], "atSec": r(word("sensible", 73)), "sec": 0.5, "kind": "line"},
        {"boxes": [[150, 782, 2427]], "atSec": r(word("bluish", 75)), "sec": 1.2, "kind": "line", "color": DARK},
        {"boxes": [[154, 1658, 2530]], "atSec": r(word("they're", 81.5)), "sec": 1.1, "kind": "line", "color": CHERRY},
        {"boxes": [[1773, 2144, 2530], [153, 860, 2633]], "atSec": r(word("john", 84)), "sec": 1.1, "kind": "line"},
        {"boxes": [[893, 1965, 2633]], "atSec": r(word("neither", 86)), "sec": 0.8, "kind": "line"},
        {"boxes": [[1445, 2144, 2737], [154, 443, 2841]], "atSec": r(word("two", 92)), "sec": 1.6},
        {"boxes": [[156, 1094, 2945]], "atSec": r(word("quite", 95)), "sec": 1.2, "kind": "line"},
        {"boxes": [[1305, 1730, 1599]], "atSec": r(word("his", 79.5)), "sec": 0.7}],  # Eaglesfield, where she opens it (fact-check row 36)
    "dims": [{"y0": 1850, "y1": 2265, "atSec": r(word("mother", 70, end=True))}],
    "swatches": [{"x": 40, "y": 2427, "color": DARK, "atSec": r(word("bluish", 75)) + 0.6}],
    "object": {"srcId": "SRC-037", "file": FLAT, "mask": MASK, "size": [2600, 1622], "bbox": [176, 236, 2274, 1037], "atSec": r(word("pair", 68)) - 0.1, "width": 620},
    "states": [{"atSec": r(word("dark", 73)) - 0.06, "color": DARK, "sec": 0.9},
               {"atSec": r(word("cherry", 82)) - 0.16, "color": CHERRY, "snap": True},
               {"atSec": r(word("john", 84)), "color": DARK, "sec": 0.8}],
    "wrap": {"atSec": r(word("words", 77, end=True)) + 0.05, "openAtSec": r(word("opens", 79))},
    "quotes": [{"atSec": r(word("to", 72)) + 0.6, "untilSec": r(word("bluish", 75)) - 0.6, "kicker": "TO JOHN · AS THE STORY TELLS IT", "text": "A sensible dark colour."},
               {"atSec": r(word("bluish", 75)), "untilSec": r(word("words", 77, end=True)) + 0.05, "kicker": "IN THE BIOGRAPHER'S WORDS", "text": "'a bluish dark drab'", "by": "LONSDALE, 1874 · P. 99", "byAtSec": r(word("biographer's", 77))},
               {"atSec": r(word("opens", 79)) + 0.3, "untilSec": r(word("john", 84)) + 0.45, "kicker": "HIS MOTHER · AS THE STORY TELLS IT", "text": "'as red as a cherry'", "textAtSec": r(word("cherry", 82))}],
    "tags": [{"name": "JOHN", "color": DARK, "colorName": "DARK", "atSec": r(word("it", 85, end=True)) + 0.02, "x": 1140, "y": 800},
             {"name": "JONATHAN", "color": DARK, "colorName": "DARK", "atSec": r(word("jonathan", 86, end=True)) + 0.02, "x": 1190, "y": 842},  # gate 3 v8: was touching the caption
             {"name": "MOTHER", "color": CHERRY, "colorName": "RED", "atSec": r(word("stockings", 90, end=True)) + 0.05, "x": 1520, "y": 830, "hard": True}],  # gate 3 v8: lands in the pause, with a pop
    "tie": {"atSec": r(word("both", 88)), "names": ["JOHN", "JONATHAN"]},
    "pullBack": {"atSec": r(word("dark", 90, end=True)) + 0.05, "scale": 0.95},
    "caption": "LONSDALE, THE WORTHIES OF CUMBERLAND, 1874 · P. 99\nSTOCKINGS: SILK · NETHERLANDS · c. 1806-10\nRIJKSMUSEUM · A PERIOD PAIR, RECOLOURED"},
    transitionIn="slide")
# 39-44 what stays the same: the flower, the candle, the stockings; only the person looking changes.
shot(B(*range(39, 45)), "SplitComparisonCard", lambda r: {
    "panels": [{"srcId": "SRC-013", "kind": "image", "size": GER, "crop": [380, 230, 900, 900], "label": "THE FLOWER", "atSec": 0.3, "stamp": {"text": "SAME", "atSec": 4.97}},
               {"srcId": "SRC-011", "file": CANDLE, "kind": "video", "size": [1080, 1920], "focus": 0.56, "clipStartSec": 3, "pingPong": {"revFile": CANDLE_REV, "endSec": 10.5, "clipLenSec": 12.958}, "label": "THE CANDLE", "atSec": 0.45, "stamp": {"text": "SAME", "atSec": 5.40}},
               {"srcId": "SRC-037", "file": FLAT, "kind": "image", "size": [2600, 1622], "crop": [900, 180, 1300, 1300], "label": "THE STOCKINGS · A PERIOD PAIR", "atSec": 0.6, "stamp": {"text": "SAME", "atSec": 7.62}}],
    "lines": [{"text": "What stays the same?", "atSec": r(word("look")), "untilSec": 8.0},
              {"text": "Only the person looking changes.", "atSec": r(word("only")), "untilSec": 10.84},
              {"text": "The odd thing isn't the flower.", "atSec": r(word("the", 109)) + 0.1}],
    "dimAtSec": r(word("only")),
    "names": [{"text": "JOHN", "atSec": 14.7}, {"text": "JONATHAN", "atSec": 14.9}],
    "thread": {"atSec": r(word("brothers", 112)) + 0.1, "drawSec": 1.0}},
    transitionIn="block", transition={"color": CHERRY, "side": "right"})
# 45-54 they aren't rare: a unit dot grid (Birch 2012).
shot(B(*range(45, 55)), "ScaleField", lambda r: {
    "source": "BIRCH 2012 · J. OPT. SOC. AM. A",
    "lines": [{"text": "They aren't rare.", "atSec": r(word("rare")), "untilSec": 3.9},
              {"text": "Colour blindness", "atSec": r(word("colour", 118))},
              {"text": "RED-GREEN", "atSec": r(word("blindness")) + 0.2, "untilSec": 8.4, "size": "small"},
              {"text": "TROUBLE TELLING SOME REDS AND GREENS APART", "atSec": r(word("trouble")), "untilSec": r(word("women")), "size": "small"},
                            {"text": "STILL THERE", "atSec": r(word("still")), "size": "small", "row": 1, "accent": True}],
    "phases": [{"atSec": 0.2, "total": 100, "cols": 20, "lit": 8, "litAtSec": r(word("eight")), "label": {"text": "MEN OF EUROPEAN DESCENT · ABOUT 8 IN 100", "atSec": r(word("eight"))}},
               {"atSec": r(word("women")), "total": 1000, "cols": 50, "lit": 4, "litAtSec": 15.6, "seed": 2, "label": {"text": "WOMEN OF EUROPEAN DESCENT · ABOUT 4 IN 1,000", "atSec": r(word("four", 127))}},
               {"atSec": r(word("room")), "total": 50, "cols": 10, "lit": 4, "litAtSec": 20.36, "seed": 3, "label": {"text": "A ROOM OF 50 MEN OF EUROPEAN DESCENT · ABOUT 4", "atSec": r(word("four", 131))}},
               {"atSec": r(word("china")), "total": 100, "cols": 20, "lit": 5, "litAtSec": r(word("china")) + 0.2, "seed": 4, "label": {"text": "MEN OF CHINESE OR JAPANESE DESCENT · 4–6.5 IN 100", "atSec": r(word("china")) + 0.2}}]},
    transitionIn="slide")
# 55-56 picture it from the inside.
shot(B(55, 56), "KineticLine", lambda r: {
    "lines": [{"text": "Picture it from the inside.", "atSec": r(word("picture")),
               "fill": {"word": "inside", "atSec": r(word("inside")), "color": "#00E0BE", "style": "mark", "onMark": "#2F2D2C"}}]},  # TXT-017
    transitionIn="band", transition={"dir": "up", "tone": "paper"})
# 57-58 grass, blood, cherries, sky: each word fills in its colour (TXT-015).
shot(B(57, 58), "KineticLine", lambda r: {
    "lines": [{"text": "YOUR WHOLE LIFE", "atSec": 0, "style": "mono"},
              {"text": "Grass", "atSec": r(word("grass")), "fill": {"word": "Grass", "atSec": r(word("grass")), "color": GRASS}},
              {"text": "Blood", "atSec": r(word("blood")), "fill": {"word": "Blood", "atSec": r(word("blood")), "color": BLOOD, "outline": "#D9D2C5"}},
              {"text": "Cherries", "atSec": r(word("cherries")), "fill": {"word": "Cherries", "atSec": r(word("cherries")), "color": CHERRY, "outline": "#D9D2C5"}},
              {"text": "Sky", "atSec": r(word("sky")), "fill": {"word": "Sky", "atSec": r(word("sky")), "color": SKY}}]})
# 59-62 the same colour name, and nobody can show you the difference (illustrative).
shot(B(59, 60, 61, 62), "SwatchRows", lambda r: {
    "columns": ["WHAT IT IS CALLED"],
    # Gate 3 stillness (151.5-157.8 s): the narration's words under the swatches
    "labels": [{"text": "THE SAME COLOUR NAMES", "atSec": r(word("same", 150)), "untilSec": 3.12, "x": 960, "y": 920, "align": "center"},
               {"text": "NOBODY HAS EVER TOLD YOU", "atSec": r(word("nobody", 153)), "untilSec": 6.76, "x": 960, "y": 920, "align": "center", "accent": True},
               {"text": "NOBODY ELSE CAN SEE WHAT YOU SEE", "atSec": r(word("nobody", 155)), "x": 960, "y": 920, "align": "center"}],
    "rows": [{"name": "YOU", "atSec": 0, "brightAtSec": r(word("nobody", 155)), "cells": [{"color": "#C23A47", "name": "RED", "atSec": 0, "fillSec": 0.4}],
              "tag": {"text": "ILLUSTRATIVE", "atSec": 0}},
             {"name": "EVERYONE ELSE", "atSec": 0.3, "dimAtSec": r(word("nobody", 153)),  # Gate 3 stillness: dims on the first "nobody"
              "cells": [{"color": RED, "name": "RED", "atSec": 0.3, "fillSec": 0.8}]}]})
# 63-65 one evening, a flower changes colour (his colour names: what he called them, not what he saw).
shot(B(63, 64, 65), "FootagePlate", lambda r: {
    "srcId": "SRC-013", "kind": "image", "size": GER, "crop": [380, 330, 1000, 562], "warmth": [0, 1], "flicker": {"seed": 2}, "analogue": {"seed": 2},  # LOK-016, LOK-015: the evening, by the candle
    "warmthSec": [r(word("changes", 160)), r(word("changes", 160)) + 1.2],
    "labels": [{"text": "SKY-BLUE · HIS WORDS", "atSec": 0.4, "untilSec": 2.3, "x": 1240, "y": 820},
               {"text": "RED · HIS WORDS", "atSec": 2.75, "untilSec": 5.75, "x": 1240, "y": 760, "accent": True},  # gate 3 v8: leave before the match cut
               {"text": "ALMOST NOBODY ELSE SEES IT", "atSec": r(word("almost")), "untilSec": 5.9, "x": 960, "y": 860, "align": "center"}]},
    transitionIn="push", focus=[1180, 450])
# 66-67 Dalton is a scientist (act 3 starts on the next frame after 68).
shot(B(66, 67), "KineticLine", lambda r: {
    # SRC-004 Dalton's 1834 portrait (Turner mezzotint) beside the words: the act's one look at the man himself.
    "backdrop": {"srcId": "SRC-004", "imgSize": [996, 1230], "crop": [110, 60, 790, 1010], "layout": "card-right"},
    "tag": {"at": "corner", "parts": [{"text": "JOHN DALTON · 1834", "atSec": 0}]},
    "lines": [{"text": "A scientist.", "atSec": r(word("dalton", 164)),
               "fill": {"word": "scientist", "atSec": r(word("scientist")), "color": "#00E0BE", "style": "mark", "onMark": "#2F2D2C"}},
              {"text": "NOT ENOUGH TO KNOW HE'S DIFFERENT", "atSec": r(word("enough")), "style": "mono", "type": True}]},
    transitionIn="match")  # gate 3: was a hard cut from the full-bleed geranium (slide: the shot before is already a push)  # TXT-021, the act's one typed line
# 68 "He wants to know why.": the episode's BuildUpMap (VIS-048) for the first time. Acts 1 and 2 as pieces in their
# chapter colours (LOK-026), the act 2 piece lit; a third piece, WHY?, arrives on "why". Seven places for the
# seven acts, so later acts keep these positions. Words: act titles (on screen already) and the narration's own.
shot(B(68), "BuildUpMap", lambda r: {
    "title": "WHERE IS THE PINK?",
    "slots": 7,
    "nodes": [{"act": 1, "label": "The flower", "keywords": ["SKY-BLUE BY DAY", "RED BY CANDLE"], "icon": "flower", "atSec": 0},
              {"act": 2, "label": "The odd one out", "keywords": ["HIS BROTHER TOO", "NOT RARE"], "icon": "brothers", "atSec": 0.2},
              {"act": 3, "label": "Why?", "icon": "question", "atSec": r(word("why"))}],
    "focus": {"act": 2, "atSec": 0.5}},
    transitionIn="band", transition={"dir": "up", "tone": "paper"})

# The cherry snap (MOT-011) plays silent: a swish there peaked on "John!" (sound-pass W), and the shot keeps one hero
# (the band) and one texture (the cloth on "dark"). Sounds: levels against the voice as in act 1 (hero ~15-17 dB under in a pause, texture 21-23 dB under a word).
K = "public/sfx/kit/"
BREAK = (round(word("brothers", 112, end=True) + 0.05, 2), round(word("brothers", 112, end=True) + 0.45, 2))
SWEEPS = [S(12), S(45)]
DIPS = [(round(word("quite") - 0.1, 2), round(word("right", end=True) + 0.4, 2))]
audio = [
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 2.05, "volumeDb": -21.0},  # paper band down from the slate, under "John": texture
    {"id": "SFX-019", "file": K + "mechanical/dial_turn.wav", "atSec": round(word("eaglesfield") + 0.05, 2), "volumeDb": -22.6},  # the rings settle on Eaglesfield
    {"id": "SFX-006", "atSec": round(S(6) - 0.1, 2), "volumeDb": -14.0},  # the Quaker page slides in (pause after "Quakers.")
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(S(8) - 0.1, 2), "volumeDb": -17.6},  # flash to the 1793 title page, in the pause
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(S(12) + 0.1, 2), "volumeDb": -17.6},  # band back to the map
    {"id": "SFX-017", "file": K + "tactile/pencil_stroke.wav", "atSec": round(word("teaching"), 2), "volumeDb": -29.0},
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v1.wav", "atSec": round(word("kendal", 26, end=True) + 0.04, 2), "volumeDb": -24.0},  # Kendal's pin lands (MOT-012), in the pause  # the route drawn on: texture under the words
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v1.wav", "atSec": round(S(14) - 0.15, 2), "volumeDb": -16.6},  # push from Kendal into the geranium
    {"id": "SFX-014", "atSec": round(S(14), 2), "endSec": round(S(16), 2), "fadeInSec": 0.8, "fadeOutSec": 0.6, "volumeDb": -2.0},  # candle room under the geranium by candle (Kendal)
    {"id": "SFX-006", "atSec": 38.70, "volumeDb": -21.0},  # slide to p.30, over "change,": texture
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v2.wav", "atSec": round(S(22) - 0.15, 2), "volumeDb": -16.6},  # push from "my brother" into Lonsdale
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(S(25) + 0.1, 2), "volumeDb": -17.6},  # band into the stockings
    {"id": "SFX-021", "file": K + "whoosh/cloth_slide.wav", "atSec": 68.85, "endSec": 70.35, "fadeOutSec": 0.1, "volumeDb": -26.0},  # gate 3 v8: its body fills the pause after the slide  # the pair leaves the shop window (in the pause)
    {"id": "SFX-016", "file": K + "tactile/paper_move.wav", "atSec": round(word("words", 77, end=True) + 0.1, 2), "volumeDb": -24.0},  # wrapped in tissue (in the pause)
    {"id": "SFX-016", "file": K + "tactile/page_turn.wav", "atSec": round(word("it", 85, end=True) + 0.25, 2), "volumeDb": -28.0},  # JOHN's tag lands (pause)
    {"id": "SFX-016", "file": K + "tactile/pages_move.wav", "atSec": round(word("jonathan", 86, end=True) + 0.3, 2), "volumeDb": -28.0},
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v3.wav", "atSec": round(word("stockings", 90, end=True) + 0.27, 2), "volumeDb": -27.0},  # MOTHER's tag lands (pause before "and a mother"); recheck v9: the tag settles 0.23 s after it starts, so the pop sits on the landing  # JONATHAN's tag lands (pause)
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(S(39) - 0.08, 2), "volumeDb": -17.6},  # cherry block, after "So,"
    {"id": "SFX-016", "file": K + "tactile/page_turn.wav", "atSec": 103.60, "volumeDb": -12.5},  # SAME stamps (paper taps), rotated
    {"id": "SFX-016", "file": K + "tactile/pages_move.wav", "atSec": 104.03, "endSec": 104.48, "fadeOutSec": 0.1, "volumeDb": -18.0},
    {"id": "SFX-016", "file": K + "tactile/paper_move.wav", "atSec": 106.25, "volumeDb": -23.0},
    {"id": "SFX-025", "file": K + "mechanical/sub_impact_v2.wav", "atSec": BREAK[1], "volumeDb": -12.0},  # the act's one impact, as the bed returns after "brothers."
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(S(45) - 0.08, 2), "volumeDb": -17.6},  # slide to the dot grid
    {"id": "SFX-018", "file": K + "mechanical/ticker_run.wav", "atSec": round(word("eight"), 2), "endSec": round(word("eight") + 0.95, 2), "fadeOutSec": 0.1, "volumeDb": -23.0},  # 8 dots light (creative swap)
    {"id": "SFX-018", "file": K + "mechanical/stopwatch_tick_v1.wav", "atSec": 130.66, "volumeDb": -22.0},
    {"id": "SFX-018", "file": K + "mechanical/stopwatch_tick_v2.wav", "atSec": 135.42, "volumeDb": -22.0},
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(S(55) + 0.1, 2), "volumeDb": -17.6},  # band up into "Picture it from the inside"
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v3.wav", "atSec": round(S(63) - 0.15, 2), "volumeDb": -16.6},  # push from YOUR red into the geranium
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(S(66) - 0.08, 2), "volumeDb": -17.6},  # slide into the portrait (gate 3 v4 taste)
    {"id": "SFX-027", "file": K + "mechanical/typewriter_run_v1.wav", "atSec": round(word("enough"), 2), "volumeDb": -23.0},  # keys under the typed line (texture; the kit file sits at -27 LUFS, peak-capped)
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(S(68) + 0.1, 2), "volumeDb": -17.6},  # paper band up into the map
    {"id": "SFX-014", "atSec": round(S(63), 2), "endSec": round(S(64), 2), "fadeInSec": 0.6, "fadeOutSec": 0.6, "volumeDb": -2.0},  # the same candle room as the evening returns (beat 63 only: the episode's 10-beat limit)
]
# Grounds (23 Nov 2026 rule: no ground 3 shots running, 4+ grounds, graphite <= 40%; scripts/ground-check.mjs).
GROUNDS = {
    "06+07": {"kind": "paper"},
    "08+09": {"kind": "paper"},
    "10+11": {"kind": "inset", "act": 2},
    "16+17+18+19+20+21": {"kind": "paper"},
    "25+26+27+28+29+30+31+32+33+34+35+36+37+38": {"kind": "paper", "tone": "dark"},
    "22+23+24": {"kind": "collage", "items": [{"srcId": "SRC-035", "size": [1575, 2588]}, {"srcId": "SRC-034", "size": [1814, 2600]},
                                              {"srcId": "SRC-004", "size": [996, 1230]}, {"srcId": "SRC-029", "size": [1920, 2934]},
                                              {"srcId": "SRC-033", "size": [4000, 5313]}]},
    "39+40+41+42+43+44": {"kind": "paper"},
    "55+56": {"kind": "inset", "act": 2},
    "66+67": {"kind": "blur", "srcId": "SRC-004", "size": [996, 1230], "focus": [0.5, 0.35]},
}
GID = {"paper": "LOK-027", "map": "MAP-011", "blur": "LOK-028", "collage": "VIS-050", "inset": "LOK-029"}
for d in shots:
    g = GROUNDS.get(d["id"])
    if not g:
        continue
    d["ground"] = g
    for x in [GID[g["kind"]]] + [it["srcId"] for it in g.get("items", [])] + ([g["srcId"]] if "srcId" in g else []):
        if x not in d["assets"]:
            d["assets"].append(x)
act = {"finish": {}, "motionBlur": True, "episodeId": "WCL-E01-act02", "themeId": "LOK-009",
       "runningHead": {"text": "2 · THE ODD ONE OUT", "fromSec": round(S(2), 2)},  # TXT-013, on diagram and text shots only
       "note": "Act 2 of WCL-E01 'The Man Who Saw Pink'. Gate 1 approved by Sam 22 Nov 2026 21:18. Shots join beat-sheet beats. Cues from 02_brothers_paced_149wpm_even + 2.4 s slate.",
       "voice": {"id": "NAR-002", "atSec": LEAD, "tailSec": round(BEAT["E01-A2-68"][1] - LEAD - VOICE_SEC, 2)},
       "audio": audio, "beats": shots}
json.dump(act, open(os.path.join(LIB, "src", "episodes", "ep01-act02.json"), "w"), indent=1, ensure_ascii=False)
json.dump({"break": BREAK, "sweeps": SWEEPS, "dips": DIPS}, open(os.path.join(LIB, "src", "episodes", "ep01-act02.music.json"), "w"))
print("mix: --dip %s --break %.2f:%.2f --sweep %s" % (",".join(f"{a:.2f}:{b:.2f}" for a, b in DIPS), BREAK[0], BREAK[1], ",".join(f"{t:.2f}" for t in SWEEPS)))
print(len(shots), "shots,", shots[-1]["end"], "s")
