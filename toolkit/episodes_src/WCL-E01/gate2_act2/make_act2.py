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
    trn = {"push": "TRN-006", "slide": "TRN-007", "band": "TRN-011", "block": "TRN-012", "flash": "TRN-013"}.get(d.get("transitionIn", ""))
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
    "labels": [{"text": "BORN 1766", "atSec": r(word("1766")), "untilSec": r(word("northwest")), "x": 960, "y": 860, "align": "center"},
               {"text": "NORTH-WEST ENGLAND", "atSec": r(word("northwest")) + 0.4, "untilSec": r(word("quakers")), "x": 960, "y": 860, "align": "center"},
               {"text": "A QUAKER FAMILY", "atSec": r(word("quakers")), "x": 960, "y": 860, "align": "center", "accent": True}],
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
# 12-13 back to the map: the route from Eaglesfield to Kendal draws on, rings on Kendal, the map tilts back.
shot(B(12, 13), "PeriodMapPlate", lambda r: {
    "srcId": "SRC-033", "size": MAP, "source": MAPSRC,
    "views": [{"atSec": 0, "crop": [100, 2450, 2900, 1631]}],
    "pins": [{"id": "eag", "x": EAG[0], "y": EAG[1], "atSec": 0.1},
             {"id": "ken", "x": KEN[0], "y": KEN[1], "atSec": r(word("teaching")) + 1.2}],
    "rings": [{"pin": "ken", "atSec": r(word("kendal", 26)), "pulses": 2}],
    "route": {"from": "eag", "to": "ken", "atSec": r(word("teaching")), "drawSec": 1.3, "tilt": {"atSec": r(word("district")), "deg": 6}},
    "labels": [{"text": "IN KENDAL FROM AGE 15", "atSec": r(word("15")) - 0.9, "x": 960, "y": 860, "align": "center", "accent": True}],
    "tag": {"at": "corner", "parts": [{"text": "KENDAL", "atSec": r(word("kendal", 26))}, {"text": "WESTMORLAND", "atSec": r(word("market"))}]}},
    transitionIn="band", transition={"dir": "up", "tone": "paper"})
# 14-15 the geranium by candle (push-through from the Kendal pin).
shot(B(14, 15), "FootagePlate", lambda r: {
    "srcId": "SRC-013", "kind": "image", "size": GER, "crop": [380, 330, 1000, 562], "warmth": [1, 1],
    "labels": [{"text": "THE GERANIUM, 1792", "atSec": max(0.2, r(word("geranium"))), "untilSec": r(word("takes")), "x": 1240, "y": 820},
               {"text": "WHAT DO YOU SEE?", "atSec": r(word("takes")) + 0.2, "x": 960, "y": 860, "align": "center", "accent": True}]},
    transitionIn="push", focus=[1248, 910])
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
    transitionIn="slide")
# 22-24 Lonsdale's 1874 life: the source of the stockings story, and how far after the fact it was written.
shot(B(22, 23, 24), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-036", "imgSize": [785, 1158], "crop": [60, 100, 690, 1000], "side": "left",
    "highlights": [{"box": [185, 455, 430, 50], "atSec": 0.5},
                   {"box": [336, 1002, 84, 40], "atSec": r(word("30"))}],
    "quote": "The Worthies of Cumberland: John Dalton", "quoteMarks": False,
    "source": "HENRY LONSDALE · LONDON, 1874",
    "notes": [{"text": "AS THE STORY GOES", "atSec": r(word("another"))},
              {"text": "1874 · 30 YEARS AFTER HE DIED", "atSec": r(word("30"))},
              {"text": "MAY HAVE GROWN IN THE TELLING", "atSec": r(word("grown")), "accent": True}]},
    transitionIn="push", focus=[700, 640])
# 25-38 the stockings, in each person's reported colour (REPORTED COLOURS on screen throughout).
shot(B(*range(25, 39)), "ReportedColour", lambda r: {
    "srcId": "SRC-037", "file": FLAT, "mask": MASK, "size": [2600, 1622], "crop": [60, 80, 2480, 1395],
    "caption": "SILK STOCKINGS · NETHERLANDS · c. 1806-10 · RIJKSMUSEUM",
    "printScreen": 0.08, "printScreenUntilSec": r(BEAT["E01-A2-30"][1]),
    "states": [{"atSec": 0, "color": None},
               {"atSec": r(word("dark", 70)), "color": DARK, "sec": 0.9},
               {"atSec": r(word("cherry")), "color": CHERRY, "snap": True, "sec": 0.6},
               {"atSec": r(word("john", 84)), "color": DARK, "sec": 0.9}],
    "people": [{"name": "MOTHER", "color": CHERRY, "colorName": "RED", "atSec": r(word("cherry")) + 0.4, "x": 1400, "y": 880},
               {"name": "JOHN", "color": DARK, "colorName": "DARK", "atSec": r(word("john", 84)), "x": 520, "y": 880},
               {"name": "JONATHAN", "color": DARK, "colorName": "DARK", "atSec": r(word("jonathan")), "x": 960, "y": 880}],
    "labels": [{"text": "A SHOP WINDOW", "atSec": r(word("shop")), "untilSec": r(word("buys")), "x": 960, "y": 860, "align": "center"},
               {"text": "FOR HIS MOTHER", "atSec": r(word("mother", 67)), "untilSec": r(word("him", 69)), "x": 960, "y": 860, "align": "center"},
               {"text": "TO JOHN · AS THE STORY TELLS IT", "atSec": r(word("him", 69)), "untilSec": r(word("mother", 76)) - 0.4, "x": 960, "y": 800, "align": "center"},
               {"text": "'A BLUISH DARK DRAB' · LONSDALE, 1874", "atSec": r(word("bluish")), "untilSec": r(word("mother", 76)) - 0.4, "x": 960, "y": 860, "align": "center", "accent": True},
               {"text": "HIS MOTHER", "atSec": r(word("mother", 76)), "untilSec": r(word("cherry")), "x": 960, "y": 860, "align": "center"},
               {"text": "'AS RED AS A CHERRY'", "atSec": r(word("cherry")), "untilSec": r(word("john", 84)), "x": 960, "y": 780, "align": "center", "accent": True}],
    "tag": {"at": "corner", "parts": [{"text": "KENDAL", "atSec": r(word("kendal", 63)), "untilSec": r(word("mother", 76))},
                                      {"text": "EAGLESFIELD", "atSec": r(word("mother", 76))}]}},
    transitionIn="band", transition={"dir": "down", "tone": "paper"})
# 39-44 what stays the same: the flower, the candle, the stockings; only the person looking changes.
shot(B(*range(39, 45)), "SplitComparisonCard", lambda r: {
    "panels": [{"srcId": "SRC-013", "kind": "image", "size": GER, "crop": [380, 230, 900, 900], "label": "THE FLOWER", "atSec": 0.3, "stamp": {"text": "SAME", "atSec": r(word("flower"))}},
               {"srcId": "SRC-011", "file": CANDLE, "kind": "video", "size": [1080, 1920], "focus": 0.56, "clipStartSec": 3, "label": "THE CANDLE", "atSec": 0.45, "stamp": {"text": "SAME", "atSec": r(word("candle", 100))}},
               {"srcId": "SRC-037", "file": FLAT, "kind": "image", "size": [2600, 1622], "crop": [900, 180, 1300, 1300], "label": "THE STOCKINGS · A PERIOD PAIR", "atSec": 0.6, "stamp": {"text": "SAME", "atSec": r(word("stockings", 104))}}],
    "lines": [{"text": "What stays the same?", "atSec": r(word("look")), "untilSec": r(word("only"))},
              {"text": "Only the person looking changes.", "atSec": r(word("only")), "untilSec": r(word("the", 109))},
              {"text": "The odd thing isn't the flower.", "atSec": r(word("the", 109)) + 0.1}],
    "dimAtSec": r(word("only")),
    "names": [{"text": "JOHN", "atSec": r(word("two", 112))}, {"text": "JONATHAN", "atSec": r(word("brothers", 112))}],
    "thread": {"atSec": r(word("brothers", 112)) + 0.1, "drawSec": 1.0}},
    transitionIn="block", transition={"color": CHERRY, "side": "right"})
# 45-54 they aren't rare: a unit dot grid (Birch 2012).
shot(B(*range(45, 55)), "ScaleField", lambda r: {
    "source": "BIRCH 2012 · J. OPT. SOC. AM. A",
    "lines": [{"text": "They aren't rare.", "atSec": r(word("rare")), "untilSec": r(word("colour", 118)) - 0.2},
              {"text": "Colour blindness", "atSec": r(word("colour", 118))},
              {"text": "RED-GREEN", "atSec": r(word("blindness")) + 0.2, "untilSec": r(word("trouble")), "size": "small"},
              {"text": "TROUBLE TELLING SOME REDS AND GREENS APART", "atSec": r(word("trouble")), "untilSec": r(word("women")), "size": "small"},
                            {"text": "STILL THERE", "atSec": r(word("still")), "size": "small", "row": 1, "accent": True}],
    "phases": [{"atSec": 0.2, "total": 100, "cols": 20, "lit": 8, "litAtSec": r(word("eight")), "label": {"text": "MEN OF EUROPEAN DESCENT · ABOUT 8 IN 100", "atSec": r(word("eight"))}},
               {"atSec": r(word("women")), "total": 1000, "cols": 50, "lit": 4, "litAtSec": r(word("four", 127)), "seed": 2, "label": {"text": "WOMEN OF EUROPEAN DESCENT · ABOUT 4 IN 1,000", "atSec": r(word("four", 127))}},
               {"atSec": r(word("room")), "total": 50, "cols": 10, "lit": 4, "litAtSec": r(word("four", 131)), "seed": 3, "label": {"text": "A ROOM OF 50 MEN OF EUROPEAN DESCENT · ABOUT 4", "atSec": r(word("four", 131))}},
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
    "rows": [{"name": "YOU", "atSec": 0, "cells": [{"color": "#C23A47", "name": "RED", "atSec": 0, "fillSec": 0.4}],
              "tag": {"text": "ILLUSTRATIVE", "atSec": 0}},
             {"name": "EVERYONE ELSE", "atSec": 0.3, "dimAtSec": r(word("nobody", 155)),
              "cells": [{"color": RED, "name": "RED", "atSec": 0.3, "fillSec": 0.8}]}]})
# 63-65 one evening, a flower changes colour (his colour names: what he called them, not what he saw).
shot(B(63, 64, 65), "FootagePlate", lambda r: {
    "srcId": "SRC-013", "kind": "image", "size": GER, "crop": [380, 330, 1000, 562], "warmth": [0, 1],
    "warmthSec": [r(word("changes", 160)), r(word("changes", 160)) + 1.2],
    "labels": [{"text": "SKY-BLUE · HIS WORDS", "atSec": 0.4, "untilSec": 2.3, "x": 1240, "y": 820},
               {"text": "RED · HIS WORDS", "atSec": 2.75, "x": 1240, "y": 760, "accent": True},
               {"text": "ALMOST NOBODY ELSE SEES IT", "atSec": r(word("almost")), "x": 960, "y": 860, "align": "center"}]},
    transitionIn="push", focus=[1180, 450])
# 66-68 Dalton is a scientist: he wants to know why (act 3 starts on the next frame).
shot(B(66, 67, 68), "KineticLine", lambda r: {
    # SRC-004 Dalton's 1834 portrait (Turner mezzotint) beside the words: the act's one look at the man himself.
    "backdrop": {"srcId": "SRC-004", "imgSize": [996, 1230], "crop": [110, 60, 790, 1010], "layout": "card-right"},
    "tag": {"at": "corner", "parts": [{"text": "JOHN DALTON · 1834", "atSec": 0.3}]},
    "lines": [{"text": "A scientist.", "atSec": r(word("dalton", 164)),
               "fill": {"word": "scientist", "atSec": r(word("scientist")), "color": "#00E0BE", "style": "mark", "onMark": "#2F2D2C"}},
              {"text": "NOT ENOUGH TO KNOW HE'S DIFFERENT", "atSec": r(word("enough")), "style": "mono"},
              {"text": "Why?", "atSec": r(word("why")), "fill": {"word": "Why?", "atSec": r(word("why")), "color": RED, "outline": "#D9D2C5"}}]})

# The cherry snap (MOT-011) plays silent: a swish there peaked on "John!" (sound-pass W), and the shot keeps one hero
# (the band) and one texture (the cloth on "dark"). Sounds: levels against the voice as in act 1 (hero ~15-17 dB under in a pause, texture 21-23 dB under a word).
K = "public/sfx/kit/"
BREAK = (round(word("brothers", 112, end=True) + 0.05, 2), round(word("brothers", 112, end=True) + 0.45, 2))
SWEEPS = [S(12), S(45)]
DIPS = [(round(word("quite") - 0.1, 2), round(word("right", end=True) + 0.4, 2))]
audio = [
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(S(2) + 0.1, 2), "volumeDb": -21.0},  # paper band down from the slate, under "John": texture
    {"id": "SFX-019", "file": K + "mechanical/dial_turn.wav", "atSec": round(word("eaglesfield") + 0.05, 2), "volumeDb": -22.6},  # the rings settle on Eaglesfield
    {"id": "SFX-006", "atSec": round(S(6) - 0.1, 2), "volumeDb": -14.0},  # the Quaker page slides in (pause after "Quakers.")
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(S(8) - 0.1, 2), "volumeDb": -17.6},  # flash to the 1793 title page, in the pause
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(S(12) + 0.1, 2), "volumeDb": -17.6},  # band back to the map
    {"id": "SFX-017", "file": K + "tactile/pencil_stroke.wav", "atSec": round(word("teaching"), 2), "volumeDb": -22.6},  # the route drawn on: texture under the words
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v1.wav", "atSec": round(S(14) - 0.15, 2), "volumeDb": -16.6},  # push from Kendal into the geranium
    {"id": "SFX-014", "atSec": round(S(14), 2), "endSec": round(S(16), 2), "fadeInSec": 0.8, "fadeOutSec": 0.6, "volumeDb": -2.0},  # candle room under the geranium by candle (Kendal)
    {"id": "SFX-006", "atSec": round(S(16) - 0.05, 2), "volumeDb": -21.0},  # slide to p.30, over "change,": texture
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v2.wav", "atSec": round(S(22) - 0.15, 2), "volumeDb": -16.6},  # push from "my brother" into Lonsdale
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(S(25) + 0.1, 2), "volumeDb": -17.6},  # band into the stockings
    {"id": "SFX-021", "file": K + "whoosh/cloth_slide.wav", "atSec": round(word("dark", 70) - 0.05, 2), "volumeDb": -22.0},  # the stockings go dark (in John's words)
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(S(39) - 0.08, 2), "volumeDb": -17.6},  # cherry block, after "So,"
    {"id": "SFX-016", "file": K + "tactile/page_turn.wav", "atSec": round(word("flower") + 0.05, 2), "volumeDb": -12.5},  # SAME stamps (paper taps), rotated
    {"id": "SFX-016", "file": K + "tactile/pages_move.wav", "atSec": round(word("candle", 100) + 0.05, 2), "endSec": round(word("candle", 100) + 0.5, 2), "fadeOutSec": 0.1, "volumeDb": -18.0},
    {"id": "SFX-016", "file": K + "tactile/paper_move.wav", "atSec": round(word("stockings", 104) + 0.05, 2), "volumeDb": -23.0},
    {"id": "SFX-025", "file": K + "mechanical/sub_impact_v2.wav", "atSec": BREAK[1], "volumeDb": -12.0},  # the act's one impact, as the bed returns after "brothers."
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(S(45) - 0.08, 2), "volumeDb": -17.6},  # slide to the dot grid
    {"id": "SFX-018", "file": K + "mechanical/ticker_run.wav", "atSec": round(word("eight"), 2), "endSec": round(word("eight") + 0.95, 2), "fadeOutSec": 0.1, "volumeDb": -23.0},  # 8 dots light (creative swap)
    {"id": "SFX-018", "file": K + "mechanical/stopwatch_tick_v1.wav", "atSec": round(word("four", 127), 2), "volumeDb": -22.0},
    {"id": "SFX-018", "file": K + "mechanical/stopwatch_tick_v2.wav", "atSec": round(word("four", 131), 2), "volumeDb": -22.0},
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(S(55) + 0.1, 2), "volumeDb": -17.6},  # band up into "Picture it from the inside"
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v3.wav", "atSec": round(S(63) - 0.15, 2), "volumeDb": -16.6},  # push from YOUR red into the geranium
    {"id": "SFX-014", "atSec": round(S(63), 2), "endSec": round(S(64), 2), "fadeInSec": 0.6, "fadeOutSec": 0.6, "volumeDb": -2.0},  # the same candle room as the evening returns (beat 63 only: the episode's 10-beat limit)
]
act = {"episodeId": "WCL-E01-act02", "themeId": "LOK-009",
       "note": "Act 2 of WCL-E01 'The Man Who Saw Pink'. Gate 1 approved by Sam 22 Nov 2026 21:18. Shots join beat-sheet beats. Cues from 02_brothers_paced_149wpm_even + 2.4 s slate.",
       "voice": {"id": "NAR-002", "atSec": LEAD, "tailSec": round(BEAT["E01-A2-68"][1] - LEAD - VOICE_SEC, 2)},
       "audio": audio, "beats": shots}
json.dump(act, open(os.path.join(LIB, "src", "episodes", "ep01-act02.json"), "w"), indent=1, ensure_ascii=False)
json.dump({"break": BREAK, "sweeps": SWEEPS, "dips": DIPS}, open(os.path.join(LIB, "src", "episodes", "ep01-act02.music.json"), "w"))
print("mix: --dip %s --break %.2f:%.2f --sweep %s" % (",".join(f"{a:.2f}:{b:.2f}" for a, b in DIPS), BREAK[0], BREAK[1], ",".join(f"{t:.2f}" for t in SWEEPS)))
print(len(shots), "shots,", shots[-1]["end"], "s")
