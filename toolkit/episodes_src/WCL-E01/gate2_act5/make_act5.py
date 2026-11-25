"""WCL-E01 act 5 'The rays' act file (src/episodes/ep01-act05.json + .music.json) from the approved Gate 1 beat sheet
(Sam, 25 Nov 2026: "Approve"; limits "Raise all"; the dashed 'open it' line kept), the Director's brief
(director/ep01-act05_brief.md, with its section "Applied after fact-check 2 and the Expert") and Sam's final take
(05_rays_paced_149wpm_even, NAR-005) after the 2.4 s slate. Every cue is a word time of the take in act seconds (the
brief's times); r() turns it into shot seconds. Directed shots carry the brief's shot names as their ids."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
G1 = os.path.join(HERE, "..", "gate1_act5")
LIB = os.path.join(HERE, "..", "..", "..", "library")
LEAD = 2.4
VOICE_SEC = 161.302  # ffprobe of public/episodes/wcl-e01/05_rays_paced_149wpm_even.mp3 (NAR-005)
ROWS = {r[0]: r for r in json.load(open(os.path.join(G1, "act5_rows.json")))}
BEAT = {k: (float(r[2]), float(r[3])) for k, r in ROWS.items()}
ACT_END = BEAT["E01-A5-64"][1]
assert len(ROWS) == 64 and abs(ACT_END - 166.34) < 0.01
# act5_rows.json: [Beat, Act, Start, End, Spoken, Visual .. Notes]; ID columns are 5..15 (Visual .. Source)


def ids(beats):
    out = []
    for b in beats:
        for col in range(5, 16):
            for x in str(ROWS[b][col]).split(","):
                x = x.strip()
                if x and x not in out:
                    out.append(x)
    return out


shots = []
TRN = {"push": "TRN-006", "slide": "TRN-007", "match": "TRN-015", "band": "TRN-011", "block": "TRN-012", "lens": "TRN-017",
       "draft": "TRN-002", "canvas": "TRN-004", "morph": "TRN-009"}


def shot(beats, component, props, sid=None, extra=(), **kw):
    s, e = BEAT[beats[0]][0], BEAT[beats[-1]][1]
    rel = lambda x: round(x - s, 2)
    p = props(rel) if callable(props) else props
    d = {"id": sid or "+".join(b.split("-")[-1] for b in beats), "beats": beats, "start": s, "end": e,
         "component": component, "assets": ids(beats) + [x for x in extra if x not in ids(beats)], "props": p,
         "beatTimes": [[b, BEAT[b][0], BEAT[b][1]] for b in beats]}
    ov = kw.pop("overlay", None)
    if callable(ov):
        ov = ov(rel)
    if ov:
        d["overlay"] = ov
    d.update(kw)
    trn = TRN.get(d.get("transitionIn", ""))
    if trn and trn not in d["assets"]:
        d["assets"].append(trn)

    def walk(o, path=""):  # any cue before the shot starts is a wrong time (act 1 review lesson)
        if isinstance(o, dict):
            for k, v in o.items():
                if k.endswith("Sec") and k not in ("moveSec", "drawSec", "sec", "durSec", "leadSec", "settleSec", "floodSec", "holdSec", "revealSec", "brushSec") and isinstance(v, (int, float)) and v < -0.05 and v not in (-1, -1.2):
                    raise SystemExit(f"shot {d['id']}: {path}.{k} = {v} (before the shot starts)")
                walk(v, f"{path}.{k}")
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, f"{path}[{i}]")
    walk(p)
    walk(d.get("overlay", {}))
    shots.append(d)


B = lambda *n: [f"E01-A5-{k:02d}" for k in n]
SRC = "public/assets/sources/"
PAPER = {"kind": "paper", "tone": "dark"}
INSET = {"kind": "inset", "act": 5}
GER = {"srcId": "SRC-013", "file": SRC + "geranium_stang_flowerhead_cutout.png", "size": [1185, 769]}
LEAF = {"srcId": "SRC-014", "file": SRC + "laurel_runicearth_leaf_cutout.png", "size": [800, 700]}
GERTAG = "PHOTO TODAY · D. J. STANG, CC BY-SA 4.0 · CUT OUT"  # fact-check FIX 16
WHITE = "#FFF6DD"
KINDS = [{"size": 10, "speed": 560, "count": 6}, {"size": 13, "speed": 620, "count": 6}, {"size": 16, "speed": 680, "count": 6}]  # Designer M1: read above the dust
# the light leaving the geranium is a different mix (fewer of the middle kind; fact-check FIX 15, Expert S1)
KINDS_OUT = [{"size": 10, "speed": 560, "count": 6}, {"size": 13, "speed": 620, "count": 2}, {"size": 16, "speed": 680, "count": 6}]
# illustrative reflectance and source shapes, [nm, weight in linear light] (tagged NOT MEASURED)
PETAL = [[400, 0.45], [440, 0.5], [480, 0.3], [520, 0.12], [560, 0.1], [600, 0.55], [650, 0.85], [700, 0.9]]
LEAFP = [[400, 0.05], [450, 0.06], [500, 0.12], [550, 0.3], [580, 0.2], [620, 0.08], [680, 0.12], [700, 0.3]]
CANDLE = [[400, 0.01], [450, 0.025], [500, 0.07], [550, 0.17], [600, 0.36], [650, 0.63], [700, 1.0]]  # ~1,900 K (Expert S3)
PETAL_BY_CANDLE = [[nm, round(w * dict(CANDLE)[nm], 4) if nm in dict(CANDLE) else None] for nm, w in PETAL]


def interp(prof, nm):
    p = sorted(prof)
    if nm <= p[0][0]:
        return p[0][1]
    for i in range(1, len(p)):
        if nm <= p[i][0]:
            return p[i - 1][1] + (p[i][1] - p[i - 1][1]) * (nm - p[i - 1][0]) / (p[i][0] - p[i - 1][0])
    return p[-1][1]


PETAL_BY_CANDLE = [[nm, round(interp(PETAL, nm) * interp(CANDLE, nm), 4)] for nm in range(400, 701, 25)]
SEVEN = [1 / 8, 3 / 40, 2 / 15, 1 / 6, 1 / 6, 1 / 9, 2 / 9]  # Opticks 1704 p.92, red first (M) to violet (G)
SEVEN_NM = [650, 605, 580, 530, 470, 445, 410]
PLATE = {"x": 680, "y": 130, "w": 1060, "h": 830, "tilt": 1.0}
CAPS = [{"text": "THE EYE · SIMPLIFIED", "mono": True, "atSec": -1, "at": [724, 176]},
        {"text": "Cornea", "atSec": -1, "at": [736, 360], "anchor": [915, 470]},
        {"text": "Lens", "atSec": -1, "at": [880, 912], "anchor": [1050, 650]},
        {"text": "Retina", "atSec": -1, "at": [1560, 318], "anchor": [1428, 398]}]
ILL = lambda at, text="ILLUSTRATION", until=None: dict({"text": text, "atSec": at, "x": 120, "y": 960, "size": 20}, **({"untilSec": until} if until is not None else {}))

# --- A0: act 4's band, flat; the title (act join from a still of act 4's last frame)
shot(B(1), "SpectrumStrip", {"fromNm": 400, "toNm": 700, "ticks": False, "feather": True, "startSec": -1,
                             "titleCue": {"text": "5 · THE RAYS", "atSec": 0.75, "x": 210, "y": 440}},
     sid="A0_band_title", transitionIn="match", focus=[960, 518], ground=INSET,
     joinFrom={"id": "TRN-015", "file": "public/assets/joins/act4_end_215.66.jpg"}, extra=["LOK-029"])

# --- A: Opticks 1704 title page
shot(B(2, 3), "ArchivalScanCard", lambda r: {"srcId": "SRC-064", "imgSize": [1600, 2321], "crop": [110, 120, 1400, 2010], "side": "left",
                                             "source": "ISAAC NEWTON · OPTICKS · LONDON, 1704",
                                             "highlights": [{"box": [760, 2045, 240, 58], "atSec": r(4.60)}, {"box": [615, 1878, 370, 62], "atSec": r(5.90)},
                                                            {"box": [150, 135, 1320, 195], "atSec": r(6.98)}],
                                             "quote": "Opticks: or, a Treatise of the Reflexions, Refractions, Inflexions and Colours of Light", "quoteMarks": False, "quoteAtSec": r(6.98),
                                             "notes": [{"text": "1672 → 1704 · 32 YEARS", "atSec": r(3.16)}]},
     sid="A_opticks_title", transitionIn="slide", ground=PAPER, extra=["LOK-027"])

# --- B: p.90, the sentence that's easy to read past
shot(B(4, 5, 6, 7, 8), "ArchivalScanCard", lambda r: {"srcId": "SRC-005", "imgSize": [1600, 2321], "crop": [240, 370, 1280, 1221], "side": "left",
                                                      "source": "ISAAC NEWTON · OPTICKS · 1704 · P. 90", "sourceSize": 24,
                                                      "highlights": [{"box": [384, 1316, 724, 64], "atSec": r(16.19)}, {"box": [1113, 1316, 391, 64], "atSec": r(17.65)}],
                                                      "callout": {"atSec": r(13.50), "dim": 0.55, "keep": [[384, 1316, 1120, 64]]},
                                                      "quote": "For the rays to speak properly are not coloured.", "quoteAtSec": r(16.19),
                                                      "notes": [{"text": "P. 90", "atSec": r(10.10)}, {"text": "IN PLAIN WORDS", "atSec": r(19.79)},
                                                                {"text": "THE RAYS HAVE NO COLOUR", "atSec": r(21.65), "accent": True}],
                                                      "strokes": {"mode": "shadow", "strength": 0.2}},
     sid="B_p90_not_coloured", transitionIn="canvas", transition={"dir": "right", "pull": 0.86}, ground=PAPER)  # Gate 3 S6 not taken: TXT-024 is at its 8 panels in this act

# --- C: his second sentence as quote chips on the blurred page
Q = lambda words, x, y: {"x": x, "y": y, "words": [{"text": w, "atSec": a} for w, a in words]}
shot(B(9, 10, 11), "KeywordPanel", lambda r: {"panel": {"chips": []}},
     sid="C_power_quote", transitionIn="band", transition={"dir": "down", "tone": "dark"},
     ground={"kind": "blur", "srcId": "SRC-005", "file": SRC + "newton_opticks1704_p90.jpg", "size": [1600, 2321], "focus": [0.55, 0.62], "blurPx": 14, "brightness": 0.38},
     overlay=lambda r: {"chips": [{"size": 64, "chips": [{"text": "All they have", "atSec": r(24.39), "x": 860, "y": 190, "dimSec": r(26.69)}]}], "quotes": [{"size": 52, "source": {"text": "ISAAC NEWTON · OPTICKS · 1704 · P. 90", "atSec": r(24.39), "x": 860, "y": 730},
                                    "lines": [Q([("a", r(26.69)), ("certain", r(26.99)), ("power", r(27.37))], 860, 300),
                                              Q([("and", r(27.79)), ("disposition", r(28.05))], 860, 400),
                                              Q([("to", r(28.63)), ("stir", r(28.95)), ("up", r(29.23)), ("a", r(29.39)), ("sensation", r(29.57))], 860, 500),
                                              Q([("of", r(30.01)), ("this", r(30.35)), ("or", r(30.67)), ("that", r(30.93)), ("Colour", r(31.25))], 860, 600)]}]}, extra=["TXT-024"])

# --- D: the objection, then white sunlight onto the geranium and away, not pink
shot(B(12, 13, 14, 15), "KeywordPanel", lambda r: {
    "panel": {"size": 64, "untilSec": r(37.00), "chips": [
        {"text": "clashes with the prism", "atSec": r(33.99), "x": 940, "y": 560, "dimSec": r(36.10)},
        {"text": "It doesn't.", "atSec": r(36.10), "x": 940, "y": 680, "accent": True}]},
    "labels": [{"text": "MANY KINDS OF RAY", "atSec": r(38.89), "x": 360, "y": 120, "size": 26},
               {"text": "ISN'T PINK", "atSec": r(41.82), "x": 1260, "y": 340, "size": 26},
               ILL(r(37.60), "ILLUSTRATION · RAYS DRAWN WITHOUT COLOUR")], "head": True},
    sid="D_sunlight", transitionIn="slide", ground=INSET,
    overlay=lambda r: {"rays": [{"path": [[-40, 40], [560, 500]], "atSec": r(37.41), "color": WHITE, "jitter": 16, "glow": 0.25, "kinds": KINDS},
                                {"path": [[900, 520], [1980, 470]], "atSec": r(40.78), "color": WHITE, "jitter": 16, "glow": 0.25, "kinds": KINDS_OUT, "seed": 5}],
                       "stickers": [dict(GER, at=[680, 560], w=460, atSec=r(39.75), tilt=-2, tag={"text": GERTAG, "untilSec": r(42.60)})]})

# --- E: whoever is looking (the plate; the pink belongs to the looker)
shot(B(16, 17, 18), "EyeDiagram", lambda r: {"mode": "plate", "startSec": -1, "card": PLATE,
                                             "captions": CAPS[:3] + [{"text": "Retina", "atSec": r(46.48), "at": [1560, 318], "anchor": [1428, 398]},
                                                                     {"text": "seen as pink", "atSec": r(48.26), "at": [1440, 820], "anchor": [1595, 632], "size": 34, "swatch": "#E79AB9"}],
                                             "labels": [{"text": "A KIND OF PUSH", "atSec": r(44.90), "untilSec": r(48.80), "x": 160, "y": 380, "size": 26},
                                                        ILL(r(43.40))]},
     sid="E_whoever_looks", transitionIn="canvas", transition={"dir": "right", "pull": 0.86},
     overlay=lambda r: {"rays": [{"path": [[-40, 545], [1478, 545]], "atSec": -1, "untilSec": r(47.60), "color": WHITE, "stroke": "rgba(43,39,36,0.95)", "strokeWidth": 2.5, "jitter": 16, "kinds": KINDS}]})

# --- F: the verdict as chips on the blurred title page
shot(B(19, 20, 21, 22, 23, 24), "KeywordPanel", lambda r: {
    "panel": {"size": 64, "chips": [
        {"text": "on Newton's view", "atSec": r(51.54), "x": 480, "y": 130, "dimSec": r(61.46), "dimTo": 0.3},
        {"text": "isn't really in the flower", "atSec": r(52.80), "x": 480, "y": 250, "dimSec": r(61.46), "dimTo": 0.3},
        {"text": "isn't in the light either", "atSec": r(55.47), "x": 480, "y": 380, "dimSec": r(61.46), "dimTo": 0.3},
        {"text": "where the light meets a person", "atSec": r(58.58), "x": 480, "y": 520, "accent": True, "dimSec": r(61.46), "dimTo": 0.3},
        {"text": "a geranium and a leaf", "atSec": r(61.84), "x": 480, "y": 700},
        {"text": "still look different", "atSec": r(62.82), "x": 480, "y": 830}]},
    "labels": [{"text": "ISAAC NEWTON · OPTICKS, 1704", "atSec": r(51.54), "x": 1800, "y": 960, "align": "right", "size": 22}], "head": True},
    sid="F_newtons_view", transitionIn="band", transition={"dir": "up", "tone": "dark"},
    ground={"kind": "blur", "srcId": "SRC-064", "file": SRC + "newton_opticks1704_title.jpg", "size": [1600, 2321], "focus": [0.5, 0.43], "blurPx": 14, "brightness": 0.38})

# --- G: 1672 letter p.3084, paragraph 13
shot(B(25, 26, 27, 28), "ArchivalScanCard", lambda r: {"srcId": "SRC-058", "file": SRC + "newton1672_p3084.jpg", "imgSize": [1555, 2488], "crop": [40, 1070, 1480, 1411], "side": "left",
                                                       "source": "ISAAC NEWTON · PHIL. TRANS. NO. 80\n1672 · P. 3084",
                                                       "highlights": [{"box": [785, 1768, 705, 52], "atSec": r(69.31)}, {"box": [62, 1826, 662, 64], "atSec": r(69.31)},
                                                                      {"box": [745, 1824, 748, 64], "atSec": r(70.53)}, {"box": [62, 1883, 1190, 64], "atSec": r(70.53)}],
                                                       "quote": "variously qualified to reflect one sort of light in greater plenty then another", "quoteAtSec": r(71.45),
                                                       "notes": [{"text": "CAMBRIDGE · FEB 1672", "atSec": r(68.21)}],
                                                       "strokes": {"mode": "shadow", "strength": 0.2}},
     sid="G_p3084_reflect", transitionIn="lens", transition={"durSec": 0.7, "blur": 14}, ground=PAPER)

# --- H: same light in, two mixes out
shot(B(29, 30, 31, 32), "SpectrumStrip", lambda r: {
    "rows": [{"x": 330, "y": 175, "w": 1260, "atSec": -1, "label": "DAYLIGHT", "labelAtSec": -1},
             {"x": 330, "y": 680, "w": 460, "atSec": r(74.44), "under": "SENT BACK", "profile": PETAL},
             {"x": 1130, "y": 680, "w": 460, "atSec": r(76.92), "under": "SENT BACK", "profile": LEAFP}],
    "labels": [{"text": "ILLUSTRATION · SIMPLIFIED, NOT MEASURED", "atSec": r(74.44), "x": 1800, "y": 960, "align": "right", "size": 20}]},
    sid="H_choosing", transitionIn="slide",
    overlay=lambda r: {"stickers": [dict(GER, at=[560, 430], w=400, atSec=-1, tilt=-2, tag={"text": GERTAG, "untilSec": r(78.60)}),
                                    dict(LEAF, at=[1360, 430], w=250, atSec=r(75.75), tilt=3, tag={"text": "PHOTO TODAY · RUNIC EARTH", "untilSec": r(78.60)})],
                       "chips": [{"size": 64, "inkStrike": True, "chips": [
                           {"text": "painting the light", "atSec": r(79.37), "x": 330, "y": 820, "strikeSec": r(80.67)},
                           {"text": "choosing from it", "atSec": r(81.31), "x": 1060, "y": 820, "accent": True}]}]})

# --- I: the same geranium by daylight, then by candle (the approved LayerStage set-up)
shot(B(33, 34, 35, 36, 37), "LayerStage", lambda r: {
    "worlds": [{"atSec": 0, "srcId": "SRC-040", "kind": "video", "size": [1920, 1080], "revFile": SRC + "sky_clouds_mixkit51102_rev.mp4", "clipSec": 8.5,
                "light": "day", "haze": 0.12, "blur": 2, "rackSec": 0.3, "lightFrom": "top-left", "label": "DAYLIGHT", "today": True,
                "why": "The change itself: the same flower in the daylight the line compares the candle with."},
               {"atSec": r(85.70), "srcId": "SRC-011", "kind": "video", "size": [1080, 1920], "focus": [0.5, 0.5], "clipStartSec": 0.5, "change": "dissolve", "sec": 1.4,
                "light": "warm", "blur": 1.5, "lightFrom": "left", "label": "CANDLELIGHT", "today": True,
                "why": "The change itself: Dalton's evening light, which has far less blue."}],
    "carry": [dict(GER, at=[640, 470], w=640, atSec=-1,
                   moves=[{"atSec": r(85.75), "to": [1340, 400], "w": 520, "sec": 1.3, "why": "Steps aside so the flame whose light it now gets is seen."}])],
    "caption": "PHOTO D. J. STANG, CC BY-SA 4.0 (CUT OUT)",
    "camera": {"pan": -60, "push": 0.03},
    "labels": [{"text": "ILLUSTRATION · NOT MEASURED", "atSec": r(86.74), "x": 140, "y": 470, "size": 18}],
    "overlay": {"spectrum": {"rows": [
        {"x": 140, "y": 140, "w": 560, "h": 44, "atSec": r(83.57), "label": "DAYLIGHT", "labelTone": "chip"},
        {"x": 140, "y": 260, "w": 560, "h": 44, "atSec": r(86.74), "label": "CANDLELIGHT", "labelTone": "chip", "profile": CANDLE,
         "mark": {"fromNm": 400, "toNm": 470, "text": "FAR LESS BLUE", "atSec": r(88.40)}},
        {"x": 140, "y": 400, "w": 560, "h": 44, "atSec": r(91.53), "label": "THE GERANIUM'S MIX, BY CANDLE", "labelTone": "chip", "labelAtSec": r(92.63), "profile": PETAL_BY_CANDLE}]}}},
    sid="I_by_candle", transitionIn="push", focus=[560, 430], extra=["TRN-018"])

# --- J: most people / Dalton, by day and by candle (act 1's rows); the music break
shot(B(38, 39, 40), "SwatchRows", lambda r: {
    "columns": ["BY DAY", "BY CANDLE"], "startSec": -1,
    "rows": [{"name": "MOST PEOPLE", "nameAtSec": r(95.59), "atSec": -1,
              "cells": [{"color": "#E79AB9", "name": "PINK", "atSec": -1, "fillSec": r(95.59)}, {"color": "#E79AB9", "name": "PINK", "atSec": -1, "fillSec": r(95.43)}],
              "tag": {"text": "NO REAL CHANGE", "atSec": r(99.99)}},
             {"name": "DALTON", "nameAtSec": r(101.68), "atSec": r(100.90),
              "cells": [{"color": "#86B5E8", "name": "SKY-BLUE", "atSec": r(100.90), "fillSec": r(101.68)}, {"color": "#C8402F", "name": "RED", "atSec": r(100.90), "fillSec": r(102.18)}]}],
    "labels": [{"text": "REPORTED COLOURS · DALTON 1798, PP. 29-30", "atSec": r(102.60), "x": 960, "y": 830, "align": "center", "size": 22}]},
    sid="J_most_people", transitionIn="morph", transition={"fromShape": [140, 400, 560, 44, 6], "toShape": [1202, 374, 250, 150, 10], "durSec": 0.75, "holdSec": 1.0, "color": "#E79AB9"})

# --- K: Newton's seven, at his own proportions
shot(B(41, 42, 43, 44), "SpectrumStrip", lambda r: {
    "divisions": {"fractions": SEVEN, "colorsNm": SEVEN_NM, "drawAtSec": r(104.26), "dividersAtSec": r(109.07),
                  "names": [{"text": t, "atSec": r(a)} for t, a in [("RED", 110.41), ("ORANGE", 111.01), ("YELLOW", 111.65), ("GREEN", 112.21), ("BLUE", 112.81), ("INDIGO", 113.47), ("VIOLET", 114.13)]],
                  "nameSize": 26, "liftFrom": 0.45},  # Gate 3 stillness fix: each colour comes up as it is named
    "labels": [ILL(r(104.40), "ILLUSTRATION · AFTER NEWTON, OPTICKS, 1704")]},
    sid="K_seven", transitionIn="block", transition={"color": "#C8402F", "side": "right"}, ground=INSET, extra=["TXT-024"],
    overlay=lambda r: {"chips": [{"size": 60, "chips": [{"text": "the rainbow we learn at school", "atSec": r(105.50), "x": 210, "y": 250, "dimSec": r(108.50), "dimTo": 0.3},
                                                         {"text": "into seven", "atSec": r(108.50), "x": 210, "y": 340, "accent": True}]}]})

# --- L: Opticks p.92 (the seven names become his printed list)
shot(B(45, 46), "ArchivalScanCard", lambda r: {"srcId": "SRC-063", "imgSize": [1600, 2321], "crop": [250, 1000, 1290, 1230], "side": "left",
                                               "source": "ISAAC NEWTON · OPTICKS · 1704 · P. 92", "sourceSize": 24,
                                               "highlights": [{"box": [410, 1612, 1125, 66], "atSec": -1}, {"box": [520, 1100, 1000, 52], "atSec": r(116.94)},
                                                              {"box": [410, 1324, 530, 74], "atSec": r(118.22)}],
                                               "quote": "divided after the manner of a musical Chord", "quoteAtSec": r(116.94)},
     sid="L_p92_chord", transitionIn="match", focus=[622, 560], ground=PAPER)

# --- M: seven notes on the stops, seven colours between them; tidy; indigo?
shot(B(47, 48, 49, 50), "SpectrumStrip", lambda r: {
    "divisions": {"fractions": SEVEN, "colorsNm": SEVEN_NM, "dividersAtSec": -1,
                  "names": [{"text": t, "atSec": -1} for t in ["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "INDIGO", "VIOLET"]],
                  "chord": {"atSec": r(120.96), "y": 400}, "brighten": {"atSec": r(122.02), "from": 0.55},
                  "query": {"segment": 5, "atSec": r(128.62)}},
    "labels": [ILL(-1, "ILLUSTRATION · AFTER OPTICKS, 1704, P. 92")]},
    sid="M_seven_notes", transitionIn="slide",
    ground={"kind": "blur", "srcId": "SRC-063", "file": SRC + "newton_opticks1704_p92.jpg", "size": [1600, 2321], "focus": [0.5, 0.6], "blurPx": 14, "brightness": 0.38},
    overlay=lambda r: {"chips": [{"size": 64, "chips": [
        {"text": "It's tidy.", "atSec": r(123.51), "x": 210, "y": 820, "dimSec": r(127.44)},
        {"text": "a little too tidy", "atSec": r(125.33), "x": 650, "y": 820, "accent": True, "dimSec": r(127.44)}]}]})

# --- N: Dalton 1798 p.29
shot(B(51, 52, 53, 54, 55), "ArchivalScanCard", lambda r: {"srcId": "SRC-001", "file": SRC + "dalton1798_p29.jpg", "imgSize": [1920, 2813], "crop": [380, 440, 1060, 1011], "side": "left",
                                                           "source": "JOHN DALTON · 1798 · P. 29",
                                                           "highlights": [{"box": [831, 992, 552, 56], "atSec": r(134.09), "dimAtSec": r(137.00), "dimTo": 0.4},
                                                                          {"box": [430, 1055, 698, 58], "atSec": r(134.09), "dimAtSec": r(137.00), "dimTo": 0.4},
                                                                          {"box": [428, 1108, 955, 62], "atSec": r(137.00)}, {"box": [430, 1172, 100, 46], "atSec": r(139.38)}],
                                                           "quote": "pretty well acquainted with the theory of light and colours", "quoteAtSec": r(137.00),
                                                           "notes": [{"text": "ON NEWTON'S TERMS", "atSec": r(141.04)}, {"text": "HIS IDEA MAKES GOOD SENSE", "atSec": r(142.56), "accent": True}],
                                                           "strokes": {"mode": "shadow", "strength": 0.2}},
     sid="N_p29_acquainted", transitionIn="lens", transition={"durSec": 0.7, "blur": 14}, ground=PAPER)

GUESS = {"text": "DALTON'S GUESS · A BLUE VITREOUS", "mono": True, "at": [1230, 930], "anchor": [1330, 700]}
# --- O: rays reach the back; Dalton's guessed tint thins some
shot(B(56, 57, 58, 59, 60), "EyeDiagram", lambda r: {
    "mode": "plate", "startSec": -1, "card": PLATE,
    "captions": CAPS + [{"text": "Vitreous humour", "atSec": r(150.09), "at": [1240, 198], "anchor": [1300, 390], "size": 34},
                        dict(GUESS, atSec=r(149.67))],
    "rays": {"atSec": r(146.70), "untilSec": r(155.50), "speed": 700, "count": 18, "size": 10, "colors": ["#FF3B30", "#30D158", "#2F6BFF"],
             "absorb": {"atSec": r(150.40), "colors": ["#FF3B30", "#30D158"], "from": 0.52, "to": 0.7, "keep": 0.3}},
    "tints": [{"part": "vitreous", "color": "#3D6BD6", "atSec": r(149.67), "opacity": 0.55, "brushSec": 0.7}],
    "labels": [{"text": "ILLUSTRATION", "lines": ["DOTS: 3 OF NEWTON'S MANY KINDS", "RED-, GREEN-, BLUE-MAKING"], "atSec": r(146.70), "x": 120, "y": 250, "size": 20}]},
    sid="O_eye_jelly", transitionIn="push", focus=[870, 700],
    overlay=lambda r: {"chips": [{"size": 52, "chips": [
        {"text": "change the rays", "atSec": r(153.32), "x": 120, "y": 760},
        {"text": "change the colour", "atSec": r(154.70), "x": 120, "y": 880, "accent": True}],
        "arrows": [{"atSec": r(154.36), "from": [300, 840], "to": [320, 878]}]}]})

# --- P: the same plate closer; the guess; where it would be opened
shot(B(61, 62, 63, 64), "EyeDiagram", lambda r: {
    "mode": "plate", "startSec": -1, "card": PLATE, "zoom": {"scale": 1.35, "focus": [1250, 545]},
    "tints": [{"part": "vitreous", "color": "#3D6BD6", "atSec": -1.2, "opacity": 0.55}],
    "pulses": [{"part": "vitreous", "atSec": r(159.38), "to": 0.75, "sec": 1.6}],
    "captions": [{"text": "Vitreous humour", "atSec": -1, "at": [1240, 198], "anchor": [1300, 390], "size": 34},
                 dict(GUESS, atSec=-1, at=[720, 885], underline={"atSec": r(157.06), "fromCh": 9, "toCh": 14, "untilSec": r(162.80)})],
    "cutLine": {"atSec": r(162.80), "drawSec": 1.0}, "head": False,
    "labels": [ILL(r(157.10))]},  # the tag takes the corner once O's carried chips have gone
    sid="P_open_it", transitionIn="cut", extra=["TXT-024"],
    overlay=lambda r: {"chips": [{"size": 52, "untilSec": r(157.01), "chips": [  # Gate 3: O's chips carried over the cut, off before the GUESS underline
        {"text": "change the rays", "atSec": -1, "x": 120, "y": 760},
        {"text": "change the colour", "atSec": -1, "x": 120, "y": 880, "accent": True}]}]})

# Sounds (house levels: hero ~15-17 dB under the voice in a pause, texture 21-29 dB under). Paper foley is spent
# (SFX-016 + SFX-028 paper at 10 of 10): page landings ride on SFX-006 CardstockSlide, its best use.
K = "public/sfx/kit/"
audio = [
    {"id": "SFX-001", "atSec": 0.02, "volumeDb": -24.0},  # the act-join match (music only)
    {"id": "SFX-006", "atSec": 2.10, "volumeDb": -22.0},  # slide to the title page (Sound review: peak off "More")
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v1.wav", "atSec": 9.02, "volumeDb": -24.0},  # glide to p.90 (Sound S2: in the gap before "And")
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 23.73, "volumeDb": -21.0},  # band down (Sound S1: short swish, peak on the move)
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": 32.09, "volumeDb": -21.0},  # slide out of the document
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v1.wav", "atSec": 40.33, "volumeDb": -24.0},  # the geranium settles
    {"id": "SFX-001", "atSec": 43.11, "volumeDb": -24.0},  # glide with the light
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": 50.25, "volumeDb": -21.0},  # band up
    {"id": "SFX-006", "atSec": 64.40, "volumeDb": -22.0},  # lens to p.3084
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v2.wav", "atSec": 76.35, "volumeDb": -24.0},  # the leaf settles
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v3.wav", "atSec": 82.65, "volumeDb": -23.0},  # push into the light
    {"id": "SFX-001", "atSec": 94.58, "volumeDb": -24.0},  # the morph
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 103.50, "volumeDb": -21.0},  # the red block
    {"id": "SFX-006", "atSec": 114.97, "volumeDb": -22.0},  # match into p.92
    {"id": "SFX-006", "atSec": 120.23, "volumeDb": -22.0},  # slide out
    {"id": "SFX-006", "atSec": 130.40, "volumeDb": -22.0},  # lens to p.29
]
cues = json.load(open(os.path.join(G1, "act5_cues_v1.json")))
cues["ids"] = {"cues": ["MUS-007", "MUS-012", "MUS-013", "MUS-014"], "events": []}
# MUS-011 filter sweeps for the two transitions with no swish left (the brief: H slide, O push); mix-act-bed.py --sweep at Gate 3
cues["sweeps"] = [[73.30, 0.8], [144.05, 0.7]]
# Gate 3 Sound review: cue 1 settles before "More" (S taste); cue 4 dips under "to open it." and lifts after it (S3)
for c in cues["cues"]:
    if c["name"].startswith("1 "):
        c["levels"] = [[0, -26], [1.6, -26], [2.5, -34], [c["until"], -34]]
    if c["name"].startswith("4 "):
        c["levels"] = [[130.49, -35], [162.2, -35], [162.6, -38.5], [163.3, -38.5], [163.5, -35], [164.54, -27], [166.34, -27]]
for c in cues["cues"]:
    assert c["file"].startswith("public/music/")

act = {"finish": {}, "motionBlur": True, "episodeId": "WCL-E01-act05", "themeId": "LOK-009",
       "runningHead": {"text": "5 · THE RAYS", "fromSec": BEAT["E01-A5-02"][0]},
       "note": "Act 5 of WCL-E01 'The Man Who Saw Pink'. Gate 1 approved by Sam 25 Nov 2026. Shots join beat-sheet beats; directed shots carry the brief's names. Cues from 05_rays_paced_149wpm_even + 2.4 s slate.",
       "voice": {"id": "NAR-005", "atSec": LEAD, "tailSec": round(ACT_END - LEAD - VOICE_SEC, 2), "fadeOutSec": 0.03},
       "audio": audio, "beats": shots}
# Reading time (gate2 rule): a highlight keeps 2 s after it lands (0.7 s wipe).
for b in act["beats"]:
    if b["component"] != "ArchivalScanCard":
        continue
    room_s = round(b["end"] - b["start"] - 2.75, 2)
    for h in b["props"].get("highlights", []):
        if h["atSec"] > room_s:
            print(f"  {b['id']}: highlight {h['atSec']} -> {room_s} s (reading time)")
            h["atSec"] = room_s
json.dump(act, open(os.path.join(LIB, "src", "episodes", "ep01-act05.json"), "w"), indent=1, ensure_ascii=False)
json.dump(cues, open(os.path.join(LIB, "src", "episodes", "ep01-act05.music.json"), "w"), indent=1, ensure_ascii=False)
print(len(shots), "shots,", shots[-1]["end"], "s")
