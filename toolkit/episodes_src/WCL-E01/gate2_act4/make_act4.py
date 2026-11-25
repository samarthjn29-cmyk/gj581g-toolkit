"""WCL-E01 act 4 'A hole in the shutter' act file (src/episodes/ep01-act04.json + .music.json) from the approved Gate 1
beat sheet (Sam, 25 Nov 2026: "Approve"; VIS-015 "Raise to 37"), the Director's brief (director/ep01-act04_brief.md, with
its section "Applied after fact-check 2 and the Expert": prisms point-down, red at the same end in every room shot, no kink
at the hole, red bends less the same way) and Sam's final take (04_shutter_paced_149wpm_even, NAR-004) after the 2.4 s
slate. Shots join beat-sheet beats whose picture carries on; every cue is a word time of the take in act seconds (the
brief's times). Directed shots carry the brief's shot names as their ids (gate2-qa looks the brief heading up by id)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
G1 = os.path.join(HERE, "..", "gate1_act4")
LIB = os.path.join(HERE, "..", "..", "..", "library")
LEAD = 2.4
VOICE_SEC = 210.651  # ffprobe of public/episodes/wcl-e01/04_shutter_paced_149wpm_even.mp3 (NAR-004)
ROWS = {r[0]: r for r in json.load(open(os.path.join(G1, "act4_rows.json")))}
BEAT = {k: (float(r[2]), float(r[3])) for k, r in ROWS.items()}
ACT_END = BEAT["E01-A4-84"][1]
assert len(ROWS) == 84 and abs(ACT_END - 215.70) < 0.01


def ids(beats):
    out = []
    for b in beats:
        for col in range(8, 19):  # Visual .. Source columns
            for x in str(ROWS[b][col]).split(","):
                x = x.strip()
                if x and x not in out:
                    out.append(x)
    return out


shots = []
TRN = {"push": "TRN-006", "slide": "TRN-007", "match": "TRN-015", "band": "TRN-011", "block": "TRN-012", "lens": "TRN-017",
       "draft": "TRN-002", "canvas": "TRN-004"}


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
                if k.endswith("Sec") and k not in ("moveSec", "drawSec", "sec", "durSec", "leadSec", "settleSec", "floodSec", "holdSec", "revealSec") and isinstance(v, (int, float)) and v < -0.05 and v != -1:
                    raise SystemExit(f"shot {d['id']}: {path}.{k} = {v} (before the shot starts)")
                walk(v, f"{path}.{k}")
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, f"{path}[{i}]")
    walk(p)
    walk(d.get("overlay", {}))
    shots.append(d)


B = lambda *n: [f"E01-A4-{k:02d}" for k in n]
SRC = "public/assets/sources/"
TAGTXT = "ILLUSTRATION · NEWTON'S DARKENED ROOM"
NEWT = "ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672 · P. "
PAPER = {"kind": "paper", "tone": "dark"}
WHITE = "#FFF6DD"
BLUE = "#3A6BFF"  # ~460 nm (spectrum.ts wavelengthRGB family)
RED = "#FF3B30"  # ~650 nm
SPEC6 = [("#FF3B30", 650), ("#FF8C1A", 600), ("#FFD60A", 575), ("#30D158", 530), ("#2F6BFF", 470), ("#7A3CFF", 420)]
PAGE = lambda p: {"srcId": "SRC-058", "file": SRC + f"newton1672_p{p}.jpg"}
SIZE = {"3075": [1554, 2466], "3076": [1566, 2342], "3078": [1567, 2351], "3081": [1564, 2352], "3082": [1549, 2355], "3083": [1555, 2355]}

# The room (PerspectiveGrid, VIS-015): act 3's shutter; Newton's light path, prisms point-down (light bends towards the
# base), the band violet (x0) to red (x1, the end nearest the beam's straight line).
SHUT = {"kind": "shutter", "at": [-1050, -150, 600], "w": 260, "h": 360, "atSec": -1}
HOLE = {"kind": "hole", "at": [-1050, -150, 600], "r": 16, "atSec": -1}
P1 = [-600, -60, 950]
FAN1 = {"kind": "fan", "from": P1, "x0": 150, "x1": 650, "y": -40, "height": 100, "z": 2000}


def room(**kw):
    d = {"variant": "room", "depth": 2000, "dark": 0.85, "dolly": 0.02, "fog": 0, "startSec": -1, "plaster": 0.12}
    d.update(kw)
    return d


def tag(atSec, untilSec=None):
    t = {"parts": [{"text": TAGTXT, "atSec": atSec}]}
    if untilSec is not None:
        t["untilSec"] = untilSec
    return t


def lit_room(r, extra=(), beam=None, prism=None, fan=None):
    return [SHUT, HOLE, dict({"kind": "beam", "from": [-1050, -150, 600], "to": P1, "atSec": -1, "width": 14}, **(beam or {})),
            dict({"kind": "prism", "at": P1, "size": 160, "apex": "down", "atSec": -1}, **(prism or {})),
            dict(FAN1, atSec=-1, **(fan or {}))] + list(extra)


# --- A0: act 3's last frame, the title in the room (music alone)
shot(B(1), "PerspectiveGrid", room(dark=0.7, fog=0.15, dolly=0.025, dollyFrom=0.02, plaster=0, objects=[SHUT],
                                   title={"text": "4 · A HOLE IN THE SHUTTER", "atSec": 0.2, "untilSec": 1.85, "x": 620, "y": 560}),
     sid="A0_title_room", transitionIn="cut")

# --- A: the rail, 1666 -> 1766
shot(B(2, 3, 4), "TimelineRail", lambda r: {
    "from": 1640, "to": 1790, "pxPerYear": 10, "labelTone": "chip",
    "cams": [{"atSec": 0, "year": 1666}, {"atSec": r(7.27), "year": 1716, "sec": 1.5}],
    "items": [{"year": 1666, "atSec": r(3.58), "srcId": "SRC-049", "w": 220, "h": 330, "focus": [0.5, 0.3], "label": "ISAAC NEWTON · AFTER ENOCH SEEMAN, c. 1726"},
              {"year": 1766, "atSec": r(8.27), "text": "DALTON BORN", "w": 220, "h": 110}],
    "yearLabels": [1666, 1766], "accents": [{"year": 1666, "atSec": r(5.69)}],
    "bracket": {"fromYear": 1666, "toYear": 1766, "atSec": r(7.40), "text": "100 YEARS"}},
    sid="A_rail_1666", transitionIn="band", transition={"dir": "down", "tone": "dark"})

# --- B: p.3075, the date and the prism
shot(B(5, 6, 7, 8, 9), "ArchivalScanCard", lambda r: dict(PAGE("3075"), **{
    "imgSize": SIZE["3075"], "crop": [40, 1040, 1480, 1411], "side": "left", "source": NEWT + "3075",
    "highlights": [{"box": [855, 2128, 632, 62], "atSec": r(11.21), "dimAtSec": r(18.57), "dimTo": 0.45}, {"box": [64, 2171, 124, 78], "atSec": r(11.21), "dimAtSec": r(18.57), "dimTo": 0.45},
                   {"box": [1328, 1846, 155, 66], "atSec": r(13.33), "dimAtSec": r(18.57), "dimTo": 0.45}, {"box": [120, 1901, 135, 64], "atSec": r(13.33), "dimAtSec": r(18.57), "dimTo": 0.45},
                   {"box": [1290, 2229, 198, 70], "atSec": r(18.57)}, {"box": [62, 2284, 385, 64], "atSec": r(18.57)},
                   {"box": [450, 2284, 1048, 64], "atSec": r(20.88)}, {"box": [1326, 2349, 165, 60], "atSec": r(20.88)}],
    "quote": "in the beginning of the Year 1666", "quoteAtSec": r(11.21),
    "notes": [{"text": "AGE 23", "atSec": r(15.71), "accent": True}],
    "callout": {"atSec": r(18.57), "dim": 0.45},
    "strokes": {"mode": "shadow", "strength": 0.2}}),
    sid="B_p3075_date", transitionIn="match", focus=[188, 812], ground=PAPER, extra=["LOK-027"])

# --- C: p.3076, the darkened chamber (the next page on the same sheet)
shot(B(10, 11, 12), "ArchivalScanCard", lambda r: dict(PAGE("3076"), **{
    "imgSize": SIZE["3076"], "crop": [40, 120, 1480, 1411], "side": "left", "source": NEWT + "3076",
    "highlights": [{"box": [68, 126, 200, 64], "atSec": -1}, {"box": [740, 126, 665, 64], "atSec": r(28.62)}, {"box": [66, 186, 945, 62], "atSec": r(31.27)}],
    "quote": "", "quoteMarks": False}),
    sid="C_p3076_chamber", transitionIn="canvas", transition={"dir": "right", "pull": 0.86}, ground=PAPER)

# --- D1: the room wide; hole, beam, prism, cone, band
shot(B(13, 14, 15, 16), "PerspectiveGrid", lambda r: room(fog=0.15, tag=tag(r(33.70)), objects=[
    SHUT, HOLE,
    {"kind": "beam", "from": [-1050, -150, 600], "to": P1, "atSec": r(34.71), "drawSec": 0.9, "width": 14},
    {"kind": "prism", "at": P1, "size": 160, "apex": "down", "atSec": r(37.77)},
    dict(FAN1, coneAtSec=r(40.29), atSec=r(43.25))]),
    sid="D1_shutter_room", transitionIn="push", focus=[375, 184])

# --- D2: the far wall close; colours, then the shape (labels in world units at z 400: screen x = 960 + 0.733 X)
shot(B(17, 18, 19, 20, 21, 22, 23), "PerspectiveGrid", lambda r: room(depth=400, tag=dict(tag(-1), untilSec=r(60.30)), objects=[
    {"kind": "fan", "from": [-1400, -100, -250], "x0": -582, "x1": 418, "y": 0, "height": 200, "z": 400, "atSec": -1, "coneAtSec": -1, "dimSec": r(52.20), "dimTo": 0.45},
    {"kind": "label", "at": [368, 100, 400], "dy": 30, "text": "RED", "atSec": r(45.44), "untilSec": r(51.74)},
    {"kind": "label", "at": [-532, 100, 400], "dy": 30, "text": "VIOLET", "atSec": r(46.62), "untilSec": r(51.74)},
    {"kind": "label", "at": [-82, 100, 400], "dy": 30, "text": "EVERYTHING IN BETWEEN", "atSec": r(48.00), "untilSec": r(51.74)},
    {"kind": "ring", "at": [-482, 0, 400], "r": 100, "dashed": True, "atSec": r(55.26), "untilSec": r(60.40)},
    {"kind": "label", "at": [-482, 100, 400], "dy": 30, "text": "ROUND, LIKE THE HOLE", "atSec": r(55.66), "untilSec": r(60.40)},
] + [{"kind": "ring", "at": [x, 0, 400], "r": 100, "dashed": True, "atSec": round(r(58.30) + 0.12 * k, 2), "untilSec": r(60.40)} for k, x in enumerate([-282, -82, 118, 318])]
  + [{"kind": "label", "at": [507, 0, 400], "dy": -20, "text": "× 5", "atSec": r(58.92), "untilSec": r(60.40)},
     # Gate 3 stillness (7.8 s with no visible change): the band re-lights at full strength on "the band on the wall"
     {"kind": "fan", "from": [-1400, -100, -250], "x0": -582, "x1": 418, "y": 0, "height": 200, "z": 400, "atSec": r(57.10), "coneAtSec": -1},
     # ... and the round spot he expected fills in under the ring on "round hole"
     {"kind": "patch", "at": [-482, 0, 400], "w": 200, "h": 200, "round": True, "color": WHITE, "atSec": r(55.26), "untilSec": r(57.10)}]),
    sid="D2_far_wall", transitionIn="cut")

# --- E: p.3076 again, "should have been circular."
shot(B(24, 25), "ArchivalScanCard", lambda r: dict(PAGE("3076"), **{
    "imgSize": SIZE["3076"], "crop": [40, 120, 1480, 1411], "side": "right", "source": NEWT + "3076",
    "highlights": [{"box": [68, 516, 1414, 62], "atSec": r(61.30)}, {"box": [66, 573, 950, 62], "atSec": r(63.73)}],
    "quote": "which, according to the received laws of Refraction, I expected should have been circular", "quoteAtSec": r(61.30)}),
    sid="E_p3076_oblong", transitionIn="slide", ground=PAPER)

# --- F: the common view (keyword panel)
shot(B(26, 27, 28, 29, 30), "KeywordPanel", lambda r: {"panel": {"size": 64, "chips": [
    {"text": "most people", "atSec": r(67.67), "x": 560, "y": 250, "dimSec": r(77.94)},
    {"text": "something simple", "atSec": r(69.17), "x": 990, "y": 250, "dimSec": r(77.94)},
    {"text": "white light", "atSec": r(71.20), "x": 560, "y": 390, "dimSec": r(77.94)},
    {"text": "is pure", "atSec": r(72.00), "x": 960, "y": 390, "dimSec": r(77.94)},
    {"text": "the prism", "atSec": r(73.66), "x": 560, "y": 530, "dimSec": r(77.94)},
    {"text": "changes it", "atSec": r(73.90), "x": 925, "y": 530, "dimSec": r(77.94)},
    {"text": "makes the colours", "atSec": r(75.68), "x": 560, "y": 670, "dimSec": r(77.94)},
    {"text": "Newton", "atSec": r(77.70), "x": 560, "y": 830},
    {"text": "the other way round", "atSec": r(78.42), "x": 850, "y": 830, "accent": True}]}},
    sid="F_common_view", transitionIn="band", transition={"dir": "down", "tone": "dark"})

# --- G: p.3078, Experimentum Crucis
shot(B(31, 32, 33), "ArchivalScanCard", lambda r: dict(PAGE("3078"), **{
    "imgSize": SIZE["3078"], "crop": [55, 968, 1460, 1383], "side": "right", "source": NEWT + "3078",
    "highlights": [{"box": [88, 1636, 460, 68], "atSec": r(83.25)}],
    "quote": "Experimentum Crucis", "quoteAtSec": r(83.25), "quoteMarks": False}),
    sid="G_p3078_crucis", transitionIn="slide", ground=PAPER)

# --- H: Opticks Plate IV, Fig. 18 isolated
shot(B(34, 35), "SpotlightIsolator", lambda r: {"srcId": "SRC-059", "imgSize": [2423, 3071], "crop": [0, 380, 2423, 1363],
                                                 "target": [450, 770, 1720, 610], "label": "NEWTON'S DIAGRAM · OPTICKS, 1704", "atSec": r(87.45)},
     sid="H_fig18", transitionIn="lens", transition={"durSec": 0.7, "blur": 14})

# --- I1: the board, one colour through, the second prism (Expert MUST 3: one straight line prism 1 -> hole -> prism 2)
P2 = [-34, -46, 1650]
shot(B(36, 37, 38), "PerspectiveGrid", lambda r: room(tag=tag(r(92.00)), objects=[
    {"kind": "board", "at": [-450, 120, 1200], "w": 600, "h": 520, "atSec": -1, "dimSec": r(96.16), "dimTo": 0.45},
    SHUT, HOLE, {"kind": "beam", "from": [-1050, -150, 600], "to": P1, "atSec": -1, "width": 14, "dimSec": r(96.16), "dimTo": 0.35},
    {"kind": "prism", "at": P1, "size": 160, "apex": "down", "atSec": -1},
    {"kind": "fan", "from": P1, "x0": -422, "x1": -303, "y": -55, "height": 40, "z": 1200, "atSec": -1, "coneAtSec": -1, "dimSec": r(96.16), "dimTo": 0.35},
    {"kind": "hole", "at": [-398, -55, 1200], "r": 14, "atSec": -1},
    {"kind": "beam", "from": [-398, -55, 1200], "to": P2, "atSec": r(92.65), "drawSec": 0.8, "width": 8, "color": BLUE},
    {"kind": "label", "at": [-398, 70, 1200], "dy": 0, "text": "BLUE", "atSec": r(94.45)},
    {"kind": "prism", "at": P2, "size": 160, "apex": "down", "atSec": r(97.50)}]),
    sid="I1_board_room", transitionIn="match", focus=[740, 594])

# --- I2: closer on prism 2 (every z - 800); the ghost of the prediction, "It doesn't.", blue bends, then red, less
P1n, P2n, HOLEn = [-600, -60, 150], [-34, -46, 850], [-398, -55, 400]
shot(B(39, 40, 41, 42, 43), "PerspectiveGrid", lambda r: room(depth=1200, tag=dict(tag(-1), untilSec=r(111.70)), objects=[
    {"kind": "board", "at": [-450, 120, 400], "w": 600, "h": 520, "atSec": -1},
    {"kind": "beam", "from": [-1850, -120, -250], "to": P1n, "atSec": -1, "width": 14},
    {"kind": "prism", "at": P1n, "size": 160, "apex": "down", "atSec": -1, "turn": {"atSec": r(110.28), "deg": 4}},
    {"kind": "fan", "from": P1n, "x0": -422, "x1": -303, "y": -55, "height": 40, "z": 400, "atSec": -1, "coneAtSec": -1, "shift": {"atSec": r(110.28), "dx": -75}},
    {"kind": "hole", "at": HOLEn, "r": 14, "atSec": -1},
    {"kind": "beam", "from": HOLEn, "to": P2n, "atSec": -1, "width": 8, "color": BLUE, "untilSec": r(110.28)},
    {"kind": "prism", "at": P2n, "size": 160, "apex": "down", "atSec": -1},
    {"kind": "label", "at": [369, -560, 1200], "dy": 0, "text": "IF THE GLASS MAKES THE COLOURS", "atSec": r(99.64), "untilSec": r(104.73)},
    {"kind": "fan", "from": P2n, "x0": 169, "x1": 569, "y": -339, "height": 120, "z": 1200, "ghost": True, "atSec": r(102.42), "untilSec": r(104.93)},
    {"kind": "beam", "from": P2n, "to": [249, -339, 1200], "atSec": r(106.77), "drawSec": 0.9, "width": 8, "color": BLUE, "dimSec": r(110.28), "dimTo": 0.35},
    {"kind": "patch", "at": [249, -339, 1200], "w": 46, "h": 30, "color": BLUE, "atSec": r(107.10), "dimSec": r(110.28), "dimTo": 0.35},
    {"kind": "label", "at": [-34, 106, 850], "dy": 0, "text": "ITS OWN FIXED AMOUNT", "atSec": r(108.41), "untilSec": r(111.70)},
    {"kind": "beam", "from": HOLEn, "to": P2n, "atSec": r(110.36), "drawSec": 0.6, "width": 8, "color": RED},
    {"kind": "beam", "from": P2n, "to": [249, -234, 1200], "atSec": r(110.70), "drawSec": 0.6, "width": 8, "color": RED},
    {"kind": "patch", "at": [249, -234, 1200], "w": 46, "h": 30, "color": RED, "atSec": r(111.15)}]),
    sid="I2_second_prism", transitionIn="cut")

# --- J: p.3082, "obstinately retained its colour"
shot(B(44, 45, 46), "ArchivalScanCard", lambda r: dict(PAGE("3082"), **{
    "imgSize": SIZE["3082"], "crop": [40, 60, 1480, 1411], "side": "right", "source": NEWT + "3082",
    "highlights": [{"box": [60, 132, 745, 66], "atSec": r(113.49)}, {"box": [1228, 132, 245, 66], "atSec": r(115.01)}, {"box": [60, 189, 470, 62], "atSec": r(115.01)},
                   {"box": [528, 189, 944, 62], "atSec": r(117.16)}, {"box": [60, 244, 265, 62], "atSec": r(117.16)}],
    "quote": "it hath afterwards obstinately retained its colour, notwithstanding my utmost endeavours to change it.", "quoteAtSec": r(115.01)}),
    sid="J_p3082_obstinately", transitionIn="slide", ground=PAPER)

# --- L: the turn; the room wide, making -> sorting, the kinds of ray mixed in the white beam, then sorted
shot(B(47, 48, 49, 50, 51), "PerspectiveGrid", lambda r: room(tag=tag(r(119.90)), objects=lit_room(r, beam={"dimSec": r(124.15), "dimTo": 0.3}, extra=[
    {"kind": "rays", "from": [-1050, -150, 600], "to": P1, "atSec": r(124.15), "count": 12, "speed": 260, "jitter": 6, "size": 5, "streak": 14, "colors": [c for c, _ in SPEC6]},
    {"kind": "label", "at": [-760, -420, 775], "dy": 0, "text": "KINDS OF RAY", "atSec": r(124.15), "untilSec": r(130.80)},
    {"kind": "label", "at": [-852, 153, 775], "dy": 0, "text": "MIXED TOGETHER", "atSec": r(127.21), "untilSec": r(129.40)},
] + [{"kind": "rays", "from": P1, "to": [150 + 500 * (nm - 400) / 300, -40, 2000], "atSec": r(130.12), "count": 4, "speed": 380, "jitter": 3, "size": 5, "streak": 14, "color": c, "colors": [c]} for c, nm in SPEC6])),
    sid="L_sorting_room", transitionIn="block", transition={"color": WHITE, "side": "left"},
    overlay=lambda r: {"chips": [{"size": 64, "untilSec": r(130.80), "chips": [
        {"text": "making", "atSec": r(120.85), "x": 1000, "y": 165, "strikeSec": r(121.41)},
        {"text": "sorting", "atSec": r(122.43), "x": 1340, "y": 165, "accent": True}]}]})

# --- M: the lens gathers the colours back to white
P1m = [-900, -60, 300]
LENS = [-200, -40, 800]
shot(B(52, 53, 54, 55), "PerspectiveGrid", lambda r: room(depth=1400, tag=dict(tag(-1), untilSec=r(140.30)), objects=[
    {"kind": "beam", "from": [-1850, -120, -250], "to": P1m, "atSec": -1, "width": 14},
    {"kind": "prism", "at": P1m, "size": 160, "apex": "down", "atSec": -1},
    {"kind": "fan", "from": P1m, "x0": 400, "x1": 900, "y": -20, "height": 60, "z": 1400, "atSec": -1, "coneAtSec": -1, "untilSec": r(135.20)},
    {"kind": "fan", "from": P1m, "x0": -235, "x1": -165, "y": -51, "height": 50, "z": 800, "atSec": r(134.74), "coneAtSec": r(134.74)},
    {"kind": "lens", "at": LENS, "w": 80, "h": 500, "atSec": r(134.74)},
    {"kind": "label", "at": [-200, 260, 800], "dy": 0, "text": "LENS", "atSec": r(136.91), "untilSec": r(140.30)},
    {"kind": "patch", "at": [600, -20, 1400], "w": 70, "h": 46, "color": WHITE, "atSec": r(138.65)},
    {"kind": "label", "at": [600, 100, 1400], "dy": 30, "text": "WHITE AGAIN", "atSec": r(138.95), "untilSec": r(140.45)},
] + [{"kind": "rays", "from": [-235 + 70 * (nm - 400) / 300, -51, 800], "to": [600, -20, 1400], "atSec": r(135.64), "count": 5, "speed": 300, "jitter": 2, "size": 5, "color": c, "colors": [c]} for c, nm in SPEC6]),
    sid="M_lens", transitionIn="cut")

# --- N: p.3083, "intirely and perfectly white" (ground: the same page blurred)
shot(B(56, 57), "ArchivalScanCard", lambda r: dict(PAGE("3083"), **{
    "imgSize": SIZE["3083"], "crop": [40, 400, 1480, 1411], "side": "right", "source": NEWT + "3083",
    "highlights": [{"box": [1145, 678, 330, 62], "atSec": r(141.26)}, {"box": [70, 735, 862, 66], "atSec": r(141.26)}, {"box": [262, 845, 1032, 66], "atSec": r(143.02)}],
    "quote": "reproduced light, intirely and perfectly white", "quoteAtSec": r(143.02)}),
    sid="N_p3083_white", transitionIn="draft", transition={"angle": 8, "dir": "left"},
    ground={"kind": "blur", "srcId": "SRC-058", "file": SRC + "newton1672_p3083.jpg", "size": SIZE["3083"], "focus": [0.5, 0.35]})

# --- O: the glass-of-water rainbow, today
shot(B(58, 59, 60), "FootagePlate", lambda r: {"srcId": "SRC-062", "kind": "image", "size": [2560, 1834], "crop": [0, 200, 2560, 1440], "push": 0.02,
                                                "tag": {"parts": [{"text": "PHOTO TODAY", "atSec": r(147.04)}],
                                                        "at": "low-centre",
                                                        "untilSec": r(153.60)}},
     sid="O_glass_today", transitionIn="lens", transition={"durSec": 0.7, "blur": 14},
     overlay=lambda r: {"chips": [{"size": 64, "chips": [{"text": "the first half", "atSec": r(152.10), "x": 1300, "y": 180, "accent": True}]}]})

# --- P: p.3081, the quote
shot(B(61, 62, 63, 64, 65), "ArchivalScanCard", lambda r: dict(PAGE("3081"), **{
    "imgSize": SIZE["3081"], "crop": [40, 700, 1480, 1411], "side": "right", "source": NEWT + "3081",
    "highlights": [{"box": [362, 1018, 845, 64], "atSec": r(156.92)}, {"box": [1205, 1018, 297, 64], "atSec": r(160.79)}, {"box": [86, 1074, 980, 63], "atSec": r(161.51)}],
    "quote": "Colours are not Qualifications of Light, derived from Refractions, or Reflections of natural Bodies", "quoteAtSec": r(156.92),
    "strokes": {"mode": "shadow", "strength": 0.2}}),
    sid="P_p3081_quote", transitionIn="slide", ground=PAPER)

# --- Q: the plain version (verbs struck, Expert SHOULD), on the page blurred
shot(B(66, 67, 68, 69, 70), "KeywordPanel", lambda r: {
    "panel": {"size": 64, "chips": [
        {"text": "glass", "atSec": r(166.46), "x": 900, "y": 300},
        {"text": "doesn't create colour", "atSec": r(166.84), "x": 1090, "y": 300, "strikeSec": r(167.66)},
        {"text": "light bouncing off things", "atSec": r(169.08), "x": 900, "y": 440},
        {"text": "create it", "atSec": r(170.28), "x": 900, "y": 540, "strikeSec": r(170.88)},
        {"text": "each kind of ray", "atSec": r(172.73), "x": 900, "y": 660},
        {"text": "fixed", "atSec": r(174.17), "x": 1430, "y": 660, "accent": True},
        {"text": "which colour you'll see", "atSec": r(176.33), "x": 900, "y": 800}]},
    "labels": [{"text": "NEWTON'S LETTER · 1672 · P. 3081", "atSec": r(165.50), "x": 1800, "y": 980, "align": "right", "size": 22}]},
    sid="Q_plain_version", transitionIn="band", transition={"dir": "down", "tone": "dark"},
    ground={"kind": "blur", "srcId": "SRC-058", "file": SRC + "newton1672_p3081.jpg", "size": SIZE["3081"], "focus": [0.5, 0.45], "brightness": 0.38})

# --- R: p.3075, the masthead and "from Cambridge"
shot(B(71, 72, 73, 74), "ArchivalScanCard", lambda r: dict(PAGE("3075"), **{
    "imgSize": SIZE["3075"], "crop": [0, 40, 1554, 1930], "side": "left", "source": NEWT + "3075",
    "highlights": [{"box": [990, 1846, 492, 66], "atSec": r(180.07)}, {"box": [120, 1901, 135, 64], "atSec": r(180.07)},
                   {"box": [60, 175, 1412, 120], "atSec": r(184.75)}, {"box": [310, 340, 942, 70], "atSec": r(184.75)},
                   {"box": [410, 1901, 795, 64], "atSec": r(187.28)}],
    "quote": "", "quoteMarks": False,
    "notes": [{"text": "CAMBRIDGE · FEB 1672", "atSec": r(181.11)}],
    "strokes": {"mode": "shadow", "strength": 0.2}}),
    sid="R_p3075_masthead", transitionIn="slide", ground=PAPER)

# --- S1: Hooke, shown by his book (no confirmed portrait survives)
shot(B(75, 76, 77, 78), "KeywordPanel", lambda r: {"panel": {"size": 64, "chips": [
    {"text": "plenty of readers", "atSec": r(190.59), "x": 140, "y": 640},
    {"text": "not all of them", "atSec": r(192.00), "x": 140, "y": 760},
    {"text": "says so", "atSec": r(198.24), "x": 140, "y": 880, "accent": True}]}},
    sid="S1_hooke", transitionIn="band", transition={"dir": "up", "tone": "dark"},
    ground={"kind": "blur", "srcId": "SRC-060", "size": [1800, 2883], "focus": [0.5, 0.4], "blurPx": 14},
    overlay=lambda r: {"stickers": [{"srcId": "SRC-060", "size": [1800, 2883], "crop": [40, 280, 1490, 2340], "at": [1380, 520], "w": 420, "atSec": r(194.04), "tilt": 2, "edge": 6,
                                     "tag": {"text": "ROBERT HOOKE · MICROGRAPHIA, LONDON, 1665\nNO CONFIRMED PORTRAIT OF HOOKE SURVIVES", "untilSec": r(199.10)}}]})

# --- S2: Newton's printed answer, p.5084
shot(B(79, 80), "ArchivalScanCard", lambda r: {"srcId": "SRC-061", "imgSize": [1470, 2318], "crop": [30, 60, 1420, 1354], "side": "left",
                                               "source": "ISAAC NEWTON · ANSWER TO HOOKE'S CONSIDERATIONS · PHIL. TRANS. NO. 88, 1672 · P. 5084",
                                               "highlights": [{"box": [495, 127, 650, 64], "atSec": r(200.61)}],
                                               "quote": "Answer to some Considerations upon his Doctrine of Light and Colors", "quoteAtSec": r(200.61),
                                               "notes": [{"text": "ABOUT 6 YEARS", "atSec": r(203.95)}]},
     sid="S2_p5084_answer", transitionIn="slide", ground=PAPER)

# --- T: where is it? The room wide, the glass dims, the light stays
shot(B(81, 82, 83, 84), "PerspectiveGrid", lambda r: room(tag=tag(r(206.83)), lineFadeSec=r(212.06), lineTo=0.4,
                                                          objects=lit_room(r, prism={"dimSec": r(209.69), "dimTo": 0.3})),
     sid="T_where_is_it", transitionIn="match", focus=[423, 222],
     overlay=lambda r: {"chips": [{"size": 64, "chips": [
         {"text": "colour out of the glass", "atSec": r(210.25), "x": 1060, "y": 700},
         {"text": "so where is it?", "atSec": r(212.06), "x": 1060, "y": 800, "accent": True}]}]})

# Sounds (house levels: hero ~15-17 dB under the voice in a pause, texture 21-29 dB under).
K = "public/sfx/kit/"
audio = [
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 2.68, "volumeDb": -21.0},  # band off the title
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v1.wav", "atSec": 4.25, "volumeDb": -24.0},  # Newton settles on the rail
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": 9.91, "volumeDb": -21.0},  # match into p.3075
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v1.wav", "atSec": 24.57, "volumeDb": -24.0},  # glide to p.3076
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v2.wav", "atSec": 32.93, "volumeDb": -22.0},  # push into the room
    {"id": "SFX-028", "file": K + "pixabay/shutter_lock_v1.wav", "atSec": 33.06, "volumeDb": -24.0},  # the wooden shutter
    {"id": "SFX-022", "file": K + "ambience/projector_hum.wav", "atSec": 32.70, "endSec": 60.70, "volumeDb": -30.0, "fadeInSec": 0.4, "fadeOutSec": 0.4},
    {"id": "SFX-022", "file": K + "ambience/projector_hum.wav", "atSec": 44.60, "endSec": 56.40, "volumeDb": -30.0, "fadeInSec": 0.4, "fadeOutSec": 0.4},
    {"id": "SFX-022", "file": K + "ambience/projector_hum.wav", "atSec": 56.00, "endSec": 60.70, "volumeDb": -30.0, "fadeInSec": 0.4, "fadeOutSec": 0.4},
    {"id": "SFX-028", "file": K + "pixabay/glass_clink.wav", "atSec": 38.95, "volumeDb": -26.0},  # prism 1 settles
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": 60.78, "volumeDb": -24.0},  # slide to p.3076
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 66.41, "volumeDb": -21.0},  # band
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": 80.22, "volumeDb": -21.0},  # slide to p.3078
    {"id": "SFX-019", "file": K + "mechanical/dial_turn.wav", "atSec": 86.85, "volumeDb": -20.0},  # focus set on Fig. 18
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": 91.42, "volumeDb": -21.0},  # match into the room
    {"id": "SFX-022", "file": K + "ambience/projector_run.wav", "atSec": 91.00, "endSec": 112.10, "volumeDb": -30.0, "fadeInSec": 0.4, "fadeOutSec": 0.4},
    {"id": "SFX-022", "file": K + "ambience/projector_run.wav", "atSec": 102.70, "endSec": 112.10, "volumeDb": -30.0, "fadeInSec": 0.4, "fadeOutSec": 0.4},
    {"id": "SFX-028", "file": K + "pixabay/glass_clink_wine.wav", "atSec": 98.35, "volumeDb": -26.0},  # prism 2 settles
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 112.10, "volumeDb": -21.0},  # slide to p.3082
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": 119.10, "volumeDb": -20.0},  # under the colour block
    {"id": "SFX-017", "file": K + "tactile/marker_stroke.wav", "atSec": 140.75, "volumeDb": -27.0},  # the drafting stroke
    {"id": "SFX-003", "file": K + "mechanical/shutter_click.wav", "atSec": 145.80, "volumeDb": -24.0},  # the photo lands
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": 154.02, "volumeDb": -21.0},  # slide to p.3081
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 165.15, "volumeDb": -21.0},  # band
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": 177.80, "volumeDb": -21.0},  # slide to p.3075
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": 189.55, "volumeDb": -21.0},  # band up
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v2.wav", "atSec": 194.64, "volumeDb": -24.0},  # Micrographia settles
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 199.72, "volumeDb": -21.0},  # slide to p.5084
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": 205.61, "volumeDb": -21.0},  # match into the room
]
cues = json.load(open(os.path.join(G1, "act4_cues_v1.json")))
REMAP = {"Wholesome.mp3": "public/music/wholesome_kevin_macleod.mp3", "Thinking Music.mp3": "public/music/thinking_music_kevin_macleod.mp3",
         "Long Note Two.mp3": "public/music/long_note_two_kevin_macleod.mp3", "At Rest.mp3": "public/music/at_rest_kevin_macleod.mp3"}
for c in cues["cues"]:
    c["file"] = REMAP[os.path.basename(c["file"])]
cues["ids"] = {"cues": ["MUS-007", "MUS-012", "MUS-013", "MUS-014"], "events": []}

act = {"finish": {}, "motionBlur": True, "episodeId": "WCL-E01-act04", "themeId": "LOK-009",
       "runningHead": {"text": "4 · A HOLE IN THE SHUTTER", "fromSec": BEAT["E01-A4-02"][0]},
       "note": "Act 4 of WCL-E01 'The Man Who Saw Pink'. Gate 1 approved by Sam 25 Nov 2026. Shots join beat-sheet beats; directed shots carry the brief's names. Cues from 04_shutter_paced_149wpm_even + 2.4 s slate.",
       "voice": {"id": "NAR-004", "atSec": LEAD, "tailSec": round(ACT_END - LEAD - VOICE_SEC, 2), "fadeOutSec": 0.03},
       "audio": audio, "beats": shots}
# Designer (25 Nov 2026): every lit spectrum on a wall is one smooth, feathered patch, not stepped bands.
for b in act["beats"]:
    if b["component"] == "PerspectiveGrid":
        for o in b["props"].get("objects", []):
            if o.get("kind") == "fan" and not o.get("ghost"):
                o["smooth"] = True
# Sam, 25 Nov 2026 ("Do all three (Recommended)"): glass prisms; strike-throughs in ink.
def walk(x):
    if isinstance(x, dict):
        if x.get("kind") == "prism":
            x["glass"] = True
        if isinstance(x.get("chips"), list) and any(isinstance(c, dict) and "strikeSec" in c for c in x["chips"]):
            x["inkStrike"] = True
        for v in x.values():
            walk(v)
    elif isinstance(x, list):
        for v in x:
            walk(v)
walk(act["beats"])
# Reading time (gate2 rule): a highlight keeps 2 s after it lands (0.7 s wipe). A late one lands early,
# on the phrase before its word, rather than the page staying past its words.
for b in act["beats"]:
    if b["component"] != "ArchivalScanCard":
        continue
    room_s = round(b["end"] - b["start"] - 2.75, 2)
    for h in b["props"].get("highlights", []):
        if h["atSec"] > room_s:
            print(f"  {b['id']}: highlight {h['atSec']} -> {room_s} s (reading time)")
            h["atSec"] = room_s
json.dump(act, open(os.path.join(LIB, "src", "episodes", "ep01-act04.json"), "w"), indent=1, ensure_ascii=False)
json.dump(cues, open(os.path.join(LIB, "src", "episodes", "ep01-act04.music.json"), "w"), indent=1, ensure_ascii=False)
print(len(shots), "shots,", shots[-1]["end"], "s")
