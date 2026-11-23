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
BLUE_HUMOUR = "#3D6BD6"  # Dalton's 1794 guess: a blue-tinted humour (data)
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
    trn = {"push": "TRN-006", "slide": "TRN-007", "match": "TRN-015", "band": "TRN-011", "block": "TRN-012", "flash": "TRN-013", "lens": "TRN-017"}.get(d.get("transitionIn", ""))
    if trn and trn not in d["assets"]:
        d["assets"].append(trn)
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
                "moveTo": {"atSec": r(BEAT["E01-A1-07"][0]), "x": 1200, "y": 900, "scale": 1}}]},  # Director 23 Nov: was off the right edge and under the safe line
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
    transitionIn="match")
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
               "fill": {"word": "pink", "atSec": r(word("pink", 54)), "color": PINK}}]},  # TXT-015 FillSweep
    # v11 (Sam, 22 Nov 2026: "more transitions and transition music"): TRN-012, the friends' pink floods in from the
    # right and the swatch rises out of it (the colour is the subject here).
    transitionIn="block", transition={"color": PINK, "side": "right"})
# 23 back to the candle, wide (the clip forward, from 3 s in).
shot(B(23), "FootagePlate", lambda r: {"srcId": "SRC-011", "file": CANDLE, "kind": "video", "size": [1080, 1920], "focus": 0.56,
                              "clipStartSec": 3, "warmth": [1, 1],
                              "labels": [{"text": "A SILLY QUESTION?", "atSec": r(word("it", 58)) - 0.3, "x": 960, "y": 860, "align": "center"}]},
     transitionIn="flash")  # v11: TRN-013 in the pause after "is.", one question card to the next
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
              {"text": "LATER · 1808, A NEW SYSTEM OF CHEMICAL PHILOSOPHY", "atSec": r(word("pioneer")) + 0.6, "style": "mono"}]},
    transitionIn="band", transition={"dir": "down", "tone": "paper"})  # v11: TRN-011 in the pause after "man.", into the collage
# 27-28 about two years later: an answer. VIS-028 collage: his own words on the geranium, between the two
# colours he saw (sky-blue by day, red by candle).
shot(B(27, 28), "DuotoneCollage", lambda r: {
    "pieces": [
        {"srcId": "SRC-001", "file": "public/assets/sources/dalton1798_p29_line.png", "imgSize": [1100, 240],
         "x": 1340, "y": 420, "w": 980, "rot": -1.5, "atSec": -1, "caption": "HIS OWN WORDS · P. 29", "seed": 11},
        {"color": SKY, "x": 1150, "y": 740, "w": 340, "h": 240, "rot": 4, "atSec": 0.7, "seed": 13},
        {"color": RED, "x": 1540, "y": 760, "w": 340, "h": 240, "rot": -3, "atSec": 1.1, "seed": 17}],
    "lines": [{"text": "An answer.", "atSec": r(word("answer"))}],
    "tag": {"at": "corner", "parts": [{"text": "ABOUT TWO YEARS LATER", "atSec": r(word("about", 67))}]}},
    transitionIn="match")  # v11: the next collage page slides in (TRN-007), in the pause after "atom."
# 29-31 (Sam, 22 Nov 2026: "This particular eye frame ... feel very boring"; his idea, a magnifying glass into
# the eyes, refined with the independent reviewer): VIS-032 LensDive. Dalton's real 1834 portrait; brackets
# lock onto his own spectacle lens on "his own eyes"; in the silence after "dies." the camera pushes through the
# lens (the act's one designed flashy moment); inside, his 1794 guess is SHOWN (a blue-tinted fluid in front of
# a red and a sky-blue scrap: the red goes dark); on "fail" the blue drains and red is red; the circle then
# shrinks into the "0" of the counter.
LENS = {"srcId": "SRC-004", "imgSize": [996, 1230], "crop": [24, 180, 700, 394], "lens": {"x": 420, "y": 377, "r": 33}}
SCRAPS = [{"color": RED, "x": -105, "y": 0, "w": 190, "h": 250, "rot": -4}, {"color": SKY, "x": 105, "y": 6, "w": 190, "h": 250, "rot": 3}]
shot(B(29, 30, 31), "LensDive", lambda r: {**LENS, "tag": {"at": "corner", "parts": [{"text": "JOHN DALTON · 1834", "atSec": 0}]},  # gate 3 v17: the portrait never alone
    "bracketsAtSec": r(word("own", 74)),
    "push": {"atSec": r(word("dies", 75, end=True)) + 0.05, "sec": 1.1, "to": [1330, 500], "r": 330},  # Director 23 Nov: 125 px clear of the line
    "inside": {"scraps": SCRAPS, "tint": {"color": BLUE_HUMOUR, "opacity": 0.75}, "clearAtSec": r(word("fail", 79)) + 0.04},
    "out": {"atSec": r(BEAT["E01-A1-31"][1]) - 0.55, "sec": 0.5, "to": [830, 525], "r": 70},
    "lines": [{"text": "Tested", "atSec": r(word("tested", 72)), "untilSec": r(word("dies", 75, end=True)), "row": 0},
              {"text": "His own eyes", "atSec": r(word("own", 74)), "untilSec": r(word("dies", 75, end=True)), "row": 1},
              {"text": "EXAMINED AFTER HE DIES · 1844", "atSec": r(word("examined", 75)), "untilSec": r(word("dies", 75, end=True)), "row": 2, "style": "mono"},
              {"text": "His idea will fail the test.", "atSec": r(word("idea", 78)), "row": 0}],
    # gate 3 review of v17: HIS GUESS leaves on "will", the fluid clears and 1844 arrives on "fail" (readable ~1 s)
    "labels": [{"text": "HIS GUESS · 1794 · A BLUE-TINTED FLUID", "atSec": r(word("dies", 75, end=True)) + 1.0, "untilSec": r(word("fail", 79)) - 0.56},
               {"text": "1844 · THE FLUID: CLEAR", "atSec": r(word("fail", 79)) + 0.04}]},
    transitionIn="lens")  # v17 (maps and cinematics study, 23 Nov 2026): TRN-017, the real portrait settles through a lens
# 32-33 the counter: 0 -> 151 YEARS, locks on "years".
shot(B(32, 33), "YearCounter", lambda r: {
    "to": 151, "unit": "YEARS", "countFromSec": r(word("wait")), "lockSec": r(word("years", 85))})
# 34 back to the candle, which gutters out (the clip's own ending) into the dark room.
shot(B(34), "FootagePlate", lambda r: {"srcId": "SRC-011", "file": CANDLE, "kind": "video", "size": [1080, 1920], "focus": 0.56,
                                       "clipStartSec": 10.0, "warmth": [1, 1]})  # v12: from 10.0 s so the flame is still dying as the dark band crosses (review v11: black from 89.97)
# 35-36 the grid: Newton's dark room, the shutter hole lights on "hole", the beam starts after "shutter."
shot(B(35, 36), "PerspectiveGrid", lambda r: {
    "variant": "room", "depth": 2000, "dark": 0.7, "dolly": 0.02, "startSec": r(word("dark")) - 0.2,
    "objects": [
        {"kind": "shutter", "at": [-1050, -150, 600], "w": 260, "h": 360, "atSec": r(word("dark")) + 0.4},
        {"kind": "hole", "at": [-1050, -150, 600], "r": 22, "atSec": r(word("hole"))},
        {"kind": "label", "at": [-1050, -380, 600], "text": "A HOLE IN THE SHUTTER", "atSec": r(word("hole"))},
        {"kind": "beam", "from": [-1050, -150, 600], "to": [-300, 120, 1400], "width": 14,
         "atSec": r(word("shutter")), "drawSec": 0.7}],
    "tag": {"at": "corner", "parts": [{"text": "ISAAC NEWTON", "atSec": r(word("newton"))}]}},
    transitionIn="band", transition={"dir": "up", "tone": "dark"})  # v11: TRN-011 dark, into Newton's dark room
# 37 the pay-off (VIS-032): the same lens of his, locked from the cut; on "open" the ring opens out to fill
# the frame (clear, red is red), into the title card.
shot(B(37), "LensDive", lambda r: {**LENS, "tag": {"at": "corner", "parts": [{"text": "JOHN DALTON · 1834", "atSec": 0}]},
    "bracketsAtSec": -1,
    "inside": {"scraps": SCRAPS},
    "open": {"atSec": r(word("open", 95)), "sec": 1.4},
    "lines": [{"text": "Open Dalton's eyes", "atSec": r(word("open", 95)), "row": 0},
              {"text": "AS HE ASKED", "atSec": r(word("open", 95)) + 0.5, "row": 1, "style": "mono"}]})
# 38-39 the title cards; the season sting (MUS-006) plays under the first.
shot(B(38), "SeriesTitleCard", {})
shot(B(39), "EpisodeCard", {"number": 1, "title": "The Man Who Saw Pink"})

audio = [
    {"id": "SFX-013", "atSec": 0.0, "volumeDb": 2},
    {"id": "SFX-014", "atSec": 0.0, "volumeDb": 0, "fadeInSec": 1.0, "fadeOutSec": 1.0, "endSec": 19.4},
    {"id": "SFX-006", "atSec": 19.5, "volumeDb": -12},
    {"id": "SFX-001", "atSec": round(word("dies", 75, end=True) + 0.05, 2), "volumeDb": -15},  # the push into his lens
    {"id": "SFX-015", "atSec": round(word("years", 85), 2), "volumeDb": -22},  # count lock tick (own); texture level since v12, the impact is the hero (review v11)
    {"id": "SFX-001", "atSec": 94.6, "volumeDb": -14},
    {"id": "MUS-006", "atSec": BEAT["E01-A1-38"][0] + 0.15, "volumeDb": -6},  # Sam's pick: option B 'pad' (v14, 22 Nov 2026; was C 'prism')
]
# The sound pass (22 Nov 2026; Sam: "Demo sound should go in act 1"; rules from the study of Chris Moran's "The VOX
# Sound Design System", scripts/sound-pass.py). Levels are dB against the voice (NAR-001 at -19.6 LUFS, kit files at
# their own measured LUFS): hero sounds ~15 dB under, textures 22-24 dB under, the projector hum 28 dB under. Times
# are tied to the shots' starts and props, so a re-timed act keeps them on their moves.
K = "public/sfx/kit/"
def S(t):  # shot start (act seconds) of the shot that begins with beat t
    return BEAT[f"E01-A1-{t:02d}"][0]
audio += [
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v1.wav", "atSec": round(S(5) - 0.15, 2), "volumeDb": -21.6},  # push into the geranium (on "at": played as a texture)
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v1.wav", "atSec": round(S(11) - 0.30, 2), "volumeDb": -14.6},  # slide to p.30: loud part 26.18-26.51, before "Tonight" (review v9)
    {"id": "SFX-016", "file": K + "tactile/paper_move.wav", "atSec": round(S(11) - 0.25, 2), "volumeDb": -21.4},  # the page under the whoosh (stack)
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v3.wav", "atSec": round(S(14) - 0.31, 2), "volumeDb": -14.6},  # slide to the swatches, J-cut in the pause
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v2.wav", "atSec": round(S(20) - 0.40, 2), "volumeDb": -21.6},  # recheck v18: 0.1 s earlier so its peak clears "So"; gate 3 v17: peak before "So" (was -0.15)  # push into the petal: texture, like the same move at 11.1 (its loud part meets "So"; review v9)
    {"id": "SFX-019", "file": K + "mechanical/dial_turn.wav", "atSec": round(S(22) + 0.52, 2), "volumeDb": -19.6},  # the loupe setting on the pink, once the block has gone (review v11)
    {"id": "SFX-017", "file": K + "tactile/pencil_stroke.wav", "atSec": round(S(24) - 0.1, 2), "volumeDb": -31.0},  # gate 3 v17: texture, ~20 dB under the voice (was -20.6)
    {"id": "SFX-003", "file": K + "mechanical/shutter_vintage.wav", "atSec": round(S(29) - 0.02, 2), "volumeDb": -24.0},  # TRN-017: the portrait lands under the lens (texture level)  # Dalton's face drawn on (TRN-008); runs under "but", so texture level
    {"id": "SFX-016", "file": K + "tactile/paper_move.wav", "atSec": round(S(25) + 2.15, 2), "volumeDb": -21.4},  # Plate 4 laid on the collage
    {"id": "SFX-016", "file": K + "tactile/pages_move.wav", "atSec": round(S(27) + 0.7, 2), "endSec": round(S(27) + 1.5, 2), "fadeOutSec": 0.15, "volumeDb": -18.5},  # the two colour scraps, stopped when they have landed (review v9)
    {"id": "SFX-022", "file": K + "ambience/projector_hum.wav", "atSec": round(S(35) - 0.35, 2), "endSec": round(S(37) + 0.3, 2),
     "volumeDb": -27.6, "fadeInSec": 0.4, "fadeOutSec": 0.6},  # Newton's dark room, J-cut in
    {"id": "SFX-019", "file": K + "mechanical/switch_click.wav", "atSec": round(word("open", 95), 2), "volumeDb": -21.0},
]
# v11 (Sam, 22 Nov 2026: "I would like more transitions and transition music in next clip"): every designed wipe gets
# its air swish (SFX-024, 0.08-0.1 s before the wipe; over a word it sits at texture level, about 21 dB under the voice),
# the collage slide its low whoosh, and the 151-years lock its one impact: the bed breaks to near-silence in the pause
# after "years." (MUS-010, mix-act-bed.py --break BREAK) and the sub hit lands as it returns (SFX-025).
BREAK = (round(word("years", 85, end=True) + 0.05, 2), round(word("years", 85, end=True) + 0.45, 2))
SWEEPS = [S(14), S(20)]  # MUS-011 bass drop-outs on the two busy cuts (mix-act-bed.py --sweep)
audio += [
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(S(22) - 0.08, 2), "volumeDb": -21.0},  # pink block, over "so": texture level
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": round(S(23) - 0.1, 2), "volumeDb": -17.6},  # the flash, in the pause
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": round(S(25) + 0.1, 2), "volumeDb": -17.6},  # paper band, in the pause; v12: on the band's first visible frames (it enters ~0.18 s after the cut)
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v1.wav", "atSec": round(S(27) - 0.45, 2), "volumeDb": -21.6},  # texture level (review v11: two hero whooshes in one shot)  # the collage page slides in; loud part before "About"
    {"id": "SFX-025", "file": K + "mechanical/sub_impact_v1.wav", "atSec": BREAK[1], "volumeDb": -12.0},  # the one impact, as the bed returns
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(S(35) + 0.12, 2), "volumeDb": -21.0},  # dark band, texture level over "dark"; v12: with the band, which enters ~0.2 s after the cut  # Dalton's eyes opened: on the first visible frame, texture level (it sits on "open"; review v9)
]
# Grounds (23 Nov 2026 rule: no ground 3 shots running, 4+ grounds, graphite <= 40%): paper for Dalton's page,
# his p.30 page blurred behind itself, the act's inset glow under the counter.
GROUNDS = {
    "08+09+10": {"kind": "paper"},
    "11+12+13": {"kind": "blur", "srcId": "SRC-029", "size": [1920, 2934], "focus": [0.5, 0.4]},
    "32+33": {"kind": "inset", "act": 1},
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
act = {"finish": {}, "motionBlur": True, "episodeId": "WCL-E01-act01", "themeId": "LOK-009",
       "note": "Act 1 of WCL-E01 'The Man Who Saw Pink'. Gate 1 approved by Sam 22 Nov 2026. Shots join beat-sheet beats (see 'beats'). Cues from 01_flower_paced_148wpm + 0.8 s lead-in.",
       "voice": {"id": "NAR-001", "atSec": LEAD},
       "audio": audio, "beats": shots}
json.dump(act, open(os.path.join(LIB, "src", "episodes", "ep01-act01.json"), "w"), indent=1, ensure_ascii=False)
# The mix's music moves, for scripts/mix-act-bed.py (printed so the render command uses the same times).
json.dump({"break": BREAK, "sweeps": SWEEPS}, open(os.path.join(LIB, "src", "episodes", "ep01-act01.music.json"), "w"))
print("mix: --break %.2f:%.2f --sweep %s" % (BREAK[0], BREAK[1], ",".join(f"{t:.2f}" for t in SWEEPS)))
print(len(shots), "shots,", shots[-1]["end"], "s")
