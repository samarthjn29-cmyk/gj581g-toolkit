"""WCL-E01 act 3 act file (src/episodes/ep01-act03.json + .music.json) from the approved Gate 1 beat sheet v3.1 (Sam,
24 Nov 2026: "Approve", SRC-044 "Raise to 6"), the Director's brief (director/ep01-act03_brief.md: the directed shots,
"Added layer shots" and "Within Motion blend") and Sam's final take (03_talk_paced_149wpm_even, NAR-003) + the 2.4 s
slate. Shots join beat-sheet beats whose picture carries on; every cue is a word time of the take (act seconds).
Directed shots carry the brief's shot names as their ids (gate2-qa looks the brief heading up by id)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
G1 = os.path.join(HERE, "..", "gate1_act3")
LIB = os.path.join(HERE, "..", "..", "..", "library")
LEAD = 2.4
VOICE_SEC = 204.790  # ffprobe of public/episodes/wcl-e01/03_talk_paced_149wpm_even.wav (NAR-003)
ACT_END = 208.10  # Gate 3 v5 (Sam, 24 Nov 2026: "Also end at 208.1"); was 209.68, the cue sheet's end (cue 4 alone after 'born.')
W = [(t.strip(".,;?!\"'").lower(), a + LEAD, b + LEAD) for t, a, b in json.load(open(os.path.join(G1, "03_talk_final_words.json")))]
dump = json.load(open(os.path.join(G1, "beatsheet_dump_v3.json")))
vals = dump["values"] if isinstance(dump, dict) else dump
ROWS = {r[0]: r for r in vals if r and r[0].startswith("E01-A3-")}
BEAT = {k: (float(r[2]), float(r[3])) for k, r in ROWS.items()}
assert len(ROWS) == 77 and abs(BEAT["E01-A3-77"][1] - ACT_END) < 0.01


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


shots = []
TRN = {"push": "TRN-006", "slide": "TRN-007", "match": "TRN-015", "band": "TRN-011", "block": "TRN-012", "flash": "TRN-013", "lens": "TRN-017",
       "draft": "TRN-002", "canvas": "TRN-004", "ink": "TRN-005", "morph": "TRN-009", "action": "TRN-010"}


def shot(beats, component, props, sid=None, extra=(), **kw):
    s, e = BEAT[beats[0]][0], BEAT[beats[-1]][1]
    rel = lambda x: round(x - s, 2)
    p = props(rel) if callable(props) else props
    d = {"id": sid or "+".join(b.split("-")[-1] for b in beats), "beats": beats, "start": s, "end": e,
         "component": component, "assets": ids(beats) + [x for x in extra], "props": p,
         "beatTimes": [[b, BEAT[b][0], BEAT[b][1]] for b in beats]}
    d.update(kw)
    trn = TRN.get(d.get("transitionIn", ""))
    if trn and trn not in d["assets"]:
        d["assets"].append(trn)

    def walk(o, path=""):  # any cue before the shot starts is a wrong word match (act 1 review lesson)
        if isinstance(o, dict):
            for k, v in o.items():
                if k.endswith("Sec") and k not in ("moveSec", "drawSec", "sec", "durSec", "leadSec", "settleSec") and isinstance(v, (int, float)) and v < -0.05 and v not in (-1, -1.2):
                    raise SystemExit(f"shot {d['id']}: {path}.{k} = {v} (before the shot starts: wrong word match?)")
                walk(v, f"{path}.{k}")
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, f"{path}[{i}]")
    walk(p)
    walk(d.get("overlay", {}))
    shots.append(d)


B = lambda *n: [f"E01-A3-{k:02d}" for k in n]
S = lambda n: BEAT[f"E01-A3-{n:02d}"][0]

# Data colours (what is named or reported), never theme colours.
BLUE = "#3D6BD6"  # Dalton's guess: act 1's lens tint (callback)
OLIVE = "#574F18"  # the Machado deuteranope simulation of the two cut-outs (coordinator, fact-check row 9)
RAY = ["#FF3B30", "#30D158", "#2F6BFF"]
LEAF = {"srcId": "SRC-014", "file": "public/assets/sources/laurel_runicearth_leaf_cutout.png", "size": [800, 700]}
WAX = {"srcId": "SRC-015", "file": "public/assets/sources/sealingwax_petrik_cutout.png", "size": [438, 497]}
P43 = {"srcId": "SRC-003", "imgSize": [1920, 2813], "crop": [180, 900, 1080, 1040], "side": "left", "source": "JOHN DALTON · 1798 · P. 43"}
# p.43 highlights (image px), in reading order (brief, the p.43 card line)
H43_PROB = [805, 1048, 405, 46]
H43_FIC = [250, 1098, 315, 46]
H43_SUP = [590, 1098, 465, 46]
H43_VIT = [1055, 1098, 155, 46]  # its own box: the ink point and the morph start
H43_HUM = [250, 1148, 180, 48]
H43_OTH = [435, 1148, 775, 48]
H43_VER = [250, 1203, 875, 48]
P43_BACK = [200, 1000, 1040, 1000]  # the return to p.43 (shot 61-66): lower on the page, card right, every box inside
# Grounds (23 Nov 2026 rule, scripts/ground-check.mjs): the page cards sit on the paper desk (LOK-027), so the
# diagrams between them keep the theme canvas without three graphite shots in a row (Gate 2 look choice).
PAPER = {"kind": "paper", "tone": "dark"}  # frame review FIX 7: the cream page reads on the dark desk

# 1 the chapter slate (music alone: cue 1, Wholesome carried on from act 2).
shot(B(1), "ChapterSlate", {"index": "03", "title": "The talk"})

# 2-12 A_manchester_talk + A_worldswap_chapel: Green's 1794 plan, then Cross Street Chapel as in 1835 (TRN-018 dissolve
# on "Literary"); the Kitchin map scrap (MAP-017), the ring on the plan's own "Academy", the p.28 page rises on "paper".
shot(B(*range(2, 13)), "LayerStage", lambda r: {
    "worlds": [
        {"atSec": 0, "srcId": "SRC-009", "kind": "image", "size": [1920, 1280], "zoom": 1.1, "focus": [0.4769, 0.37], "light": "paper", "haze": 0.06,
         "lightFrom": "top-left", "label": "PLAN OF MANCHESTER · WILLIAM GREEN · 1794",
         "rings": [{"x": 1280, "y": 307, "r": 125, "atSec": r(word("college")), "untilSec": r(word("tonight")) + 0.3, "drawSec": 0.7}],
         "why": "Same place, same year: Manchester as Green finished mapping it in 1794, the year of the talk; the plan itself marks the college where Dalton taught."},
        {"atSec": r(word("literary")), "srcId": "SRC-044", "kind": "image", "size": [800, 564], "zoom": 1.0, "focus": [0.47, 0.5], "change": "dissolve", "sec": 1.2,
         "light": "paper", "haze": 0.12, "blur": 1.8, "rackSec": r(word("paper", 28)), "lightFrom": "top-left",
         "why": "Same place, same night: in 1794 the Literary and Philosophical Society met in a room at Cross Street Chapel; this is that building (the 1737 rebuilding, unchanged until 1856), drawn as it looked in 1835."},
    ],
    "carry": [
        {"srcId": "SRC-045", "size": [960, 1015], "at": [440, 560], "w": 520, "atSec": r(word("moved")), "enter": "rise", "tilt": -4, "torn": True,
         "untilSec": r(17.4), "exit": "sink",  # sinks before "That's the old name" (17.51)
         "route": {"from": [411, 346], "to": [602, 894], "atSec": r(word("to", 10)), "drawSec": round(word("before") - word("to", 10), 2), "circleSec": r(word("before")),
                   "chips": [{"text": "KENDAL", "at": [190, 300]}, {"text": "MANCHESTER", "at": [300, 940]}], "source": "KITCHIN · LAURIE & WHITTLE · 1794"}},
        {"srcId": "SRC-042", "file": "public/assets/sources/dalton1798_p28_page.png", "size": [1661, 1890], "at": [464, 1106], "w": 500, "atSec": r(word("paper", 28)), "enter": "rise"},
    ],
    "labels": [
        {"text": "AGE 28", "atSec": r(word("28")), "untilSec": r(word("tonight")), "x": 1280, "y": 490, "align": "center"},
        {"text": "TUTOR · MATHEMATICS AND NATURAL PHILOSOPHY", "atSec": r(word("mathematics")), "untilSec": r(word("tonight")), "x": 1280, "y": 536, "align": "center"},
        {"text": "NEW COLLEGE", "atSec": r(word("new")), "untilSec": r(word("tonight")) + 0.3, "x": 1280, "y": 112, "align": "center", "accent": True, "settle": True},
        # one landing on "Society" (Gate 1 reviewer: not the brief's two, 0.23 s apart)
        {"text": "CROSS STREET CHAPEL · AS IN 1835", "lines": ["THE SOCIETY MET IN A ROOM HERE UNTIL 1799"], "atSec": r(26.90), "untilSec": r(29.65), "x": 120, "y": 84, "size": 22},  # v6 Editor S3: 3 s to read, as the corner clears  # Gate 3 review S3: leaves with the match
    ],
    "tag": {"parts": [{"text": "MANCHESTER", "atSec": r(word("manchester"))}, {"text": "31 OCT 1794", "atSec": r(word("october"))}],
            "at": "low-centre", "toCornerAtSec": r(9.0), "untilSec": r(word("literary")), "cornerEase": True},  # v7 S8: no jolt at 9.0
    "camera": {"pan": -40, "push": 0.03}},
    sid="A_manchester_talk", transitionIn="band", transition={"dir": "down", "tone": "paper"},  # Gate 3 review M1: no hard cut off the slate (act 2's slate exit)
    overlay={"chips": [{"chips": [{"text": "question", "atSec": round(word("question") - S(2), 2), "x": 160, "y": 400},
                                  {"text": "experts", "atSec": round(word("experts") - S(2), 2), "x": 300, "y": 580, "accent": True}],
                        "arrows": [{"atSec": round(word("experts") - S(2) - 0.35, 2), "from": [400, 505], "to": [440, 572]}],
                        "untilSec": round(6.9 - S(2), 2)}]})

# 13-16 A2_title_match: the p.28 card in place of the held page (focus match on its title); ground = the chapel blurred.
# p.28 was cropped to the page (commit c70a0dc, 1669 px wide): the brief's image px are less 185 in x.
shot(B(13, 14, 15, 16), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-042", "imgSize": [1669, 1890], "crop": [515, 160, 1000, 960], "side": "left",
    "highlights": [{"box": [655, 208, 690, 64], "atSec": r(word("extraordinary"))},
                   {"box": [755, 318, 490, 76], "atSec": r(word("vision"))},
                   {"box": [790, 578, 425, 56], "atSec": r(37.50)}],  # Gate 2: in the pause before "It's his first paper" (2 s to read before the glide)
    "quote": "Extraordinary Facts relating to the Vision of Colours: with Observations", "quoteMarks": False,
    "source": "JOHN DALTON · 1798 · P. 28"},
    sid="A2_title_match", transitionIn="match", focus=[408, 908],
    ground={"kind": "blur", "srcId": "SRC-044", "size": [800, 564], "focus": [0.47, 0.5]},
    overlay={"chips": [{"chips": [{"text": "his own", "atSec": round(word("his", 35) - S(13), 2), "x": 1106, "y": 760},
                                  {"text": "eyes", "atSec": round(word("eyes", 35) - S(13), 2), "x": 1435, "y": 760, "accent": True}]}]})

# 17-20 p.34, the next page on the same sheet (canvas glide right): the list, lines lit as read; held, no scroll.
shot(B(17, 18, 19, 20), "ArchivalScanCard", lambda r: {
    "srcId": "SRC-002", "imgSize": [1920, 2934], "crop": [470, 600, 1300, 1290], "side": "left",
    "highlights": [{"box": [1000, 620, 500, 50], "atSec": r(word("lists"))},
                   {"box": [1150, 1065, 190, 48], "atSec": r(word("one", 47))},
                   {"box": [745, 1308, 980, 54], "atSec": r(48.50)}],  # the laurel line, in the pause before "with examples" (Gate 2: 2 s to read); B pushes from it, lit from B's frame 0
    "quote": "", "quoteMarks": False, "source": "JOHN DALTON · 1798 · P. 34",
    "notes": [{"text": "ORANGE & YELLOW", "atSec": r(word("lists"))}, {"text": "GREEN", "atSec": r(word("one", 47)), "accent": True}]},  # v6 Designer: the page's own headings, as he lists them
    transitionIn="canvas", transition={"dir": "right", "pull": 0.86}, ground=PAPER, extra=[])

# 21-28 B_leaf_and_wax: p.34 itself, framed on the laurel sentence (push from the card's laurel line); the leaf and the
# wax rise in the margin beside their words; the sealed letter (VIS-061) on "seal letters"; chips W5; both turn olive.
shot(B(*range(21, 29)), "LayerStage", lambda r: {
    "worlds": [{"atSec": 0, "srcId": "SRC-002", "kind": "image", "size": [1920, 2934], "zoom": 1.15, "focus": [0.538, 0.4797], "light": "paper", "haze": 0.08,
                "blur": 2, "rackSec": r(word("think", 62)), "lightFrom": "top-left",
                "highlights": [{"box": [1645, 1252, 80, 50], "atSec": 0}, {"box": [745, 1308, 980, 54], "atSec": 0},
                               {"box": [745, 1366, 690, 54], "atSec": r(word("match", 56))}],
                "why": "Same idea: the sentence on p.34 where Dalton matches the laurel leaf to red sealing-wax; the two things lift off the page that names them."}],
    "carry": [
        # rises at 54.76 so it settles in the comma pause after "leaf," on its pop (v6 Editor S2)
        {**LEAF, "at": [330, 360], "w": 300, "atSec": r(54.76), "enter": "rise", "states": [{"atSec": r(71.30), "color": OLIVE, "blend": "replace"}]},
        {**WAX, "at": [330, 690], "w": 200, "atSec": r(word("sealing")), "enter": "rise",
         "states": [{"atSec": r(word("wax", 59)), "label": "A WAX SEAL · TODAY"}, {"atSec": r(71.30), "color": OLIVE, "blend": "replace"}]},  # Gate 2 review M3: complete (72.00) before "To him"; FIX 2: one measured olive on both
        # W4: pale on the pale page, so 420 wide (Gate 2 builder test); lands on "seal letters", sinks before "Think"
        {"srcId": "SRC-046", "file": "public/assets/sources/letter1841_wenden_reverse_cutout.png", "size": [1899, 1056], "at": [1440, 770], "w": 420, "tilt": 3, "atSec": r(word("used")), "enter": "rise",  # FIX 8
         "untilSec": r(62.45), "exit": "sink", "caption": "A SEALED LETTER · 1841", "captionSize": 20},
    ],
    # FIX 3: the caption and the page's tag sit in the paper margin, off the page's bottom line of print
    "labels": [{"text": "MODERN SIMULATION · ONE WAY", "lines": ["HE MAY HAVE SEEN THEM"], "atSec": r(71.65), "untilSec": r(73.86), "x": 120, "y": 830, "size": 22},  # v6: Expert 'MODERN'; Editor M1: gone before the glide freezes the frame
               {"text": "PHOTOS TODAY", "lines": ["CHERRY LAUREL", "WAX SEAL"], "atSec": 0, "untilSec": r(73.86), "x": 120, "y": 96, "size": 20},
               {"text": "JOHN DALTON · 1798 · P. 34", "atSec": 0, "x": 120, "y": 930, "size": 20}],
    "camera": {"pan": -40, "push": 0.03}},
    sid="B_leaf_and_wax", transitionIn="push", focus=[620, 598],
    overlay={"chips": [{"chips": [{"text": "green", "atSec": round(word("green", 64) - S(21), 2), "x": 1160, "y": 640},
                                  {"text": "red", "atSec": round(word("red", 66) - S(21), 2), "x": 1430, "y": 640},
                                  {"text": "to you", "atSec": round(word("you", 68) - S(21), 2), "x": 1160, "y": 750, "accent": True}],
                        "untilSec": round(71.0 - S(21), 2)}]})

# 29-38 S_prism_world: a glass prism today behind the two-track SpectrumStrip; quote chips W6 (TXT-025); the photo
# racks and dims on "others" and fades to the canvas on "Then"; strips alone under the riser's peak.
shot(B(*range(29, 39)), "LayerStage", lambda r: {
    "worlds": [{"atSec": 0, "srcId": "SRC-043", "kind": "image", "size": [1920, 1282], "zoom": 1.1, "focus": [0.5, 0.642], "light": "none", "haze": 0.12, "dim": 0.15,
                "blur": 3, "rackSec": r(word("others", 82)), "rackDim": 0.55, "outSec": r(word("then", 99)), "label": "PHOTO TODAY · A GLASS PRISM",
                "why": "Same idea: the line explains what a prism is ('a triangular piece of glass that throws colours'); a glass prism today doing it, behind the band others see and the band Dalton describes."}],
    "overlay": {"spectrum": {
        "tracks": {"drawAtSec": r(word("triangular")), "drawSec": 1.4, "lowerAtSec": r(word("others", 82)),
                   "fills": [{"band": "red", "atSec": r(word("almost"))}, {"band": "yellow", "atSec": r(word("yellow"))},
                             {"band": "blue", "atSec": r(word("blue", 96))}, {"band": "purple", "atSec": r(word("purple"))}],
                   "count": {"text": "I see only two or at most three distinctions", "atSec": r(word("two", 93)), "y": 792}},  # Gate 2 builder test: clear of the source chip
        "labels": [{"text": "OTHERS · SIX COLOURS", "atSec": r(75.80), "x": 210, "y": 408, "size": 22},  # v6: Expert FIX 2 (read as 'Dalton sees six'); Editor T6: lands after the glide
                   {"text": "DALTON'S WORDS", "atSec": r(word("others", 82)), "x": 210, "y": 714, "size": 22}]}},
    "camera": {"pan": 0, "push": 0.03},
    "startSec": -1},  # the photo arrives already in place inside the glide
    sid="S_prism_world", transitionIn="canvas", transition={"dir": "down", "pull": 0.86},
    overlay={"quotes": [{"lines": [{"x": 210, "y": 780, "words": [{"text": t, "atSec": round(word(k, 85) - S(29), 2)} for t, k in
                                                                   [("little", "little"), ("more", "more"), ("than", "than"), ("a", "a"), ("shade,", "shade")]]},
                                   {"x": 210, "y": 848, "words": [{"text": t, "atSec": round(word(k, 87) - S(29), 2)} for t, k in
                                                                   [("or", "or"), ("defect", "defect"), ("of", "of"), ("light", "light")]]}],
                         "source": {"text": "DALTON · 1798 · P. 31", "atSec": round(word("little") - S(29), 2), "x": 720, "y": 866, "untilSec": round(word("then", 99) - S(29), 2)},
                         "untilSec": round(92.9 - S(29), 2)}]})

# v6 plates (Designer MUST 1 + Subject Expert, 24 Nov 2026): the two section eyes drawn as one anatomical plate on a
# cream card (EyeDiagram mode "plate"); eye centre (1220, 540), 23.8 px per mm, light from the left.
PLATE_CARD = {"x": 680, "y": 130, "w": 1060, "h": 830, "tilt": 1.0}  # tilted down at the right, clear of the running head
PLATE_CAPTIONS = [{"text": "THE EYE · SIMPLIFIED", "mono": True, "atSec": -1, "at": [724, 176]},
                  {"text": "Cornea", "atSec": -1, "at": [736, 360], "anchor": [915, 470]},
                  {"text": "Lens", "atSec": -1, "at": [1090, 912], "anchor": [1050, 650]},
                  {"text": "Retina", "atSec": -1, "at": [1560, 318], "anchor": [1428, 398]}]  # v7 picture pass S3/S5: dot on the retina; Lens leader crosses only the wall
# 39-48 D_into_the_eye: the act's one hard cut, on the hit at 102.10 (cue 3 on the same frame); the cross-section draws
# in on "explanation"; the fluids outlined, then the vitreous; VITREOUS HUMOUR with the HUMOUR underline (W7); the beam;
# DALTON'S GUESS in the corner; chips W8 (clear struck, tinted); the jelly tints blue on "It's".
shot(B(*range(39, 49)), "EyeDiagram", lambda r: {
    "mode": "plate", "startSec": -1, "card": PLATE_CARD,  # v6 (Sam: "Apply all"): the Designer's plate, the Expert's anatomy
    "outlines": [{"parts": ["aqueous", "vitreous"], "atSec": r(word("clear", 108)), "untilSec": r(word("clear", 111))},
                 {"parts": ["vitreous"], "atSec": r(word("clear", 111)), "untilSec": r(word("tinted"))}],  # Designer: one teal at a time
    "captions": PLATE_CAPTIONS + [
        {"text": "Vitreous humour", "atSec": r(word("vitreous", 112)), "at": [1240, 198], "anchor": [1300, 390], "size": 34,
         "underline": {"atSec": r(word("humour", 114)), "fromCh": 9, "untilSec": r(word("it's", 126))}},  # v7 S4: one teal at a time
        {"text": "DALTON'S GUESS · A BLUE VITREOUS", "mono": True, "atSec": round(r(word("it's", 126)) + 0.46, 2), "at": [1230, 930], "anchor": [1330, 700]}],  # Expert: tied to the wash  # v7 taste: in when the wash shows
    "rays": {"atSec": r(word("light", 117)), "speed": 700, "count": 18, "size": 10, "colors": RAY},  # Designer: light as dots, as in C
    "tints": [{"part": "vitreous", "color": BLUE, "atSec": r(word("it's", 126)), "opacity": 0.55, "brushSec": 0.7}]},  # v7 S1: the wash reaches the back wall before the cut
    sid="D_into_the_eye",
    overlay={"chips": [{"size": 64, "chips": [{"text": "an explanation", "atSec": round(word("explanation") - S(39), 2), "x": 110, "y": 250},
                                              {"text": "isn't hollow", "atSec": round(word("hollow") - S(39), 2), "x": 110, "y": 360, "accent": True}],
                         "untilSec": round(108.3 - S(39), 2)},  # review S2 + Gate 3 stillness (102.1-106.6): one panel, two spoken key phrases
                       {"size": 64, "chips": [{"text": "clear", "atSec": round(word("isn't", 124) - S(39), 2), "x": 110, "y": 250, "strikeSec": round(word("clear", 125) - S(39), 2)},
                                              {"text": "tinted", "atSec": round(word("tinted") - S(39), 2), "x": 110, "y": 380, "accent": True}],
                        "arrows": [{"atSec": round(word("tinted") - S(39) - 0.4, 2), "from": [322, 320], "to": [342, 392]}]}]})

# 49-51 p.43 (drafting wipe in the beam's direction): "probably some modification of blue", near-silence under it.
shot(B(49, 50, 51), "ArchivalScanCard", lambda r: {
    **P43,
    "highlights": [{"box": H43_PROB, "atSec": r(word("probably"))}, {"box": H43_FIC, "atSec": r(word("blue", 131))},
                   {"box": H43_SUP, "atSec": r(134.30)}, {"box": H43_VIT, "atSec": r(134.50)}, {"box": H43_HUM, "atSec": r(134.70)}],  # Gate 2: in the pause before "And he supposes" (2 s to read before the ink bleed)
    "quote": "probably some modification of blue"},
    transitionIn="draft", transition={"angle": 8, "dir": "right"}, ground=PAPER, extra=[])

# 52-60 C_carry_into_eye: ink bleed from "vitreous" into D's framing (jelly already blue); the blue jelly brightens on
# "blue glass"; rays lose red and green in the jelly; the leaf and the wax come back as stickers (VIS-060) on the
# light's side and go darker, duller and closer under his blue (still two colours: no olive here, fact-check 8).
shot(B(*range(52, 61)), "EyeDiagram", lambda r: {
    "mode": "plate", "card": PLATE_CARD,
    "tints": [{"part": "vitreous", "color": BLUE, "atSec": -1.2, "opacity": 0.55}],
    "pulses": [{"part": "vitreous", "atSec": r(word("looking")), "to": 0.75, "sec": 1.6}],  # Gate 3 stillness: from "looking at the world through blue glass" (was on "blue")
    "rays": {"atSec": r(word("in", 145)), "speed": 700, "count": 18, "size": 10, "colors": RAY,  # Gate 3: dots that read at phone size (Director note 9)
             "absorb": {"atSec": r(word("soaks")), "colors": RAY[:2], "from": 0.52, "to": 0.70, "keep": 0.3}},  # Expert: fading starts where the light enters the vitreous
    "captions": PLATE_CAPTIONS + [{"text": "Vitreous humour", "atSec": -1, "at": [1240, 198], "anchor": [1300, 390], "size": 34},
                                  {"text": "DALTON'S GUESS · A BLUE VITREOUS", "mono": True, "atSec": -1, "at": [1230, 930], "anchor": [1330, 700]}],
    "labels": [{"text": "HIS IDEA:", "lines": ["DULLER, AND MORE ALIKE"], "atSec": r(word("other", 156, end=True) + 0.5), "untilSec": r(S(61) - 0.6), "x": 120, "y": 790, "size": 22},
               {"text": "PHOTOS TODAY", "lines": ["CHERRY LAUREL", "WAX SEAL"], "atSec": r(153.40), "untilSec": r(S(61) - 0.6), "x": 120, "y": 200, "size": 20}]},  # v6: Designer M3 (20 px + credit), Editor T9 (after the wax)
    sid="C_carry_into_eye", transitionIn="ink", transition={"at": [894, 303], "tint": BLUE, "durSec": 1.3},  # Gate 3 stillness: the spread carries to 138.8
    overlay={"drift": 0.02,
             # Gate 3 stillness (138.8-145.3): W9's keyword panel in place of the dropped blue-glass object; gone before the rays
             "chips": [{"size": 64, "chips": [{"text": "makes sense", "atSec": round(word("makes") - S(52), 2), "x": 160, "y": 250},
                                              {"text": "blue glass", "atSec": round(word("blue", 143) - S(52), 2), "x": 160, "y": 360, "accent": True}],
                        "untilSec": round(145.10 - S(52), 2)}],  # v6 Editor T3: 'blue glass' 1.66 s
             "stickers": [
        {**LEAF, "at": [300, 380], "w": 180, "atSec": round(152.50 - S(52), 2), "tilt": -3,
         "states": [{"atSec": round(word("duller") - S(52), 2), "multiply": BLUE, "opacity": 0.6}], "moves": [{"atSec": round(word("duller") - S(52), 2), "to": [300, 440]}]},
        {**WAX, "at": [300, 700], "w": 140, "atSec": round(153.10 - S(52), 2), "tilt": 2,
         "states": [{"atSec": round(word("duller") - S(52), 2), "multiply": BLUE, "opacity": 0.6}], "moves": [{"atSec": round(word("duller") - S(52), 2), "to": [300, 645]}]}]})

# 61-66 back into the same p.43 card (slide), the earlier highlights lit; the "otherwise ... not been done" lines in
# near-silence; the rest dim to 40% on "anywhere", "vitreous" alone stays lit, ready to lift.
ANY = word("anywhere")
shot(B(*range(61, 67)), "ArchivalScanCard", lambda r: {
    **P43, "crop": P43_BACK, "side": "right",  # v7 picture pass S7: not shot 8's crop again (the lines being read, card right)
    "highlights": [{"box": b, "atSec": -1, "dimAtSec": r(ANY)} for b in (H43_PROB, H43_FIC, H43_SUP)] + [{"box": H43_VIT, "atSec": -1}] +
                  [{"box": H43_HUM, "atSec": -1, "dimAtSec": r(ANY)},
                   {"box": H43_OTH, "atSec": r(word("otherwise")), "dimAtSec": r(ANY)},
                   {"box": H43_VER, "atSec": r(word("has", 170)), "dimAtSec": r(ANY)}],
    "quote": "otherwise I apprehend it might be discovered by inspection, which has not been done", "quoteAtSec": r(word("otherwise"))},  # review S3: in on its word  # FIX 6: the quote being read (p.43, verbatim, the 'disco-/vered' break joined)
    transitionIn="slide", ground=PAPER, extra=[])

# 67-68 the eyes (Gate 3 v5, Sam 24 Nov 2026: "Can we do a newpaper cutting or a picture cut ... to display the eye in
# the frame. It's not looking good and i would like to drop it."): the line-drawn eye is gone. A newspaper cutting of a
# real pair of eyes (SRC-048, halftone on newsprint, our own print of an Unsplash photo) lies on the dark ground; the
# "vitreous" bar morphs onto its left iris (landing in the pause before "So"); the eye model (VIS-061) on "open"; chips
# "only" / "two" under the cutting; the frame drops out on the cut on action into the portrait.
CLIP_W = 1180
CLIP = {"srcId": "SRC-048", "file": "public/assets/sources/eyes_kimbarovsky_clipping.png", "size": [1852, 553]}
CLIP_AT = (860, 410)
_s = CLIP_W / CLIP["size"][0]
_ix = CLIP_AT[0] - CLIP_W / 2 + 1370 * _s  # v7: the right-hand iris in the cutting (1370, 320) -> frame px; nearer the p.43 box now the card sits right (left iris: 390, 320)
_iy = CLIP_AT[1] - CLIP["size"][1] * _s / 2 + 320 * _s
_ir = 46
shot(B(67, 68), "KeywordPanel", lambda r: {"panel": {"chips": []}},
    transitionIn="morph", transition={"fromShape": [1635, 196, 142, 45, 3], "toShape": [round(_ix - _ir), round(_iy - _ir), 2 * _ir, 2 * _ir, _ir], "durSec": 0.35, "holdSec": 1.0},  # v7: fromShape = the lit "vitreous" box on the new p.43 card (measured on a still)  # v5 review S1: the disc stays on the iris 1 s  # Gate 3 review S1: lands in the silence before "So" (177.86)
    overlay={"stickers": [{**CLIP, "at": list(CLIP_AT), "w": CLIP_W, "atSec": 0.12, "tilt": -1.2, "fromTilt": -1.2, "edge": 0,
                           "tag": {"text": "PHOTO TODAY", "dy": 18}},  # v5 review S2/S3: tag up to the cut, photographer named like the prism
                          {"srcId": "SRC-047", "file": "public/assets/sources/eye_model_wellcome_cutout.png", "size": [1714, 1197], "at": [1420, 600], "w": 400,  # v6 Designer: over the cutting's corner, one group
                           "atSec": round(word("open") - S(67), 2), "tilt": 2, "object": True, "tag": {"text": "A MODEL OF AN EYE"}}],
             "chips": [{"size": 64, "chips": [{"text": "only", "atSec": round(word("only", 182) - S(67), 2), "x": 270, "y": 700},
                                  {"text": "two", "atSec": round(word("two", 182) - S(67), 2), "x": 486, "y": 700, "accent": True}]}]})

# 69-72 H_wish_over_portrait: cut on action from the closing lid onto the viewer's-left lens of his spectacles (1834
# mezzotint); the Henry strip rises on "exactly" with its two highlights; the world racks on "His biographer".
shot(B(69, 70, 71, 72), "LayerStage", lambda r: {
    "worlds": [{"atSec": 0, "srcId": "SRC-004", "file": "public/assets/sources/dalton_turner1834.jpg", "kind": "image", "size": [996, 1230], "zoom": 1.0, "focus": [0.47, 0.32],
                "light": "none", "haze": 0.10, "blur": 1.5, "rackSec": r(word("his", 191)), "lightFrom": "top-left", "label": "JOHN DALTON · 1834",
                "why": "Same person: John Dalton, whose eyes his wish was about; his biographer's words about it are held up in front of him."}],
    "carry": [{"srcId": "SRC-007", "file": "public/assets/sources/henry1854_p25_wish_line.png", "size": [1850, 170], "at": [880, 872], "w": 1440,
               "atSec": r(word("exactly")), "enter": "rise",
               "highlights": [{"box": [710, 20, 1112, 52], "atSec": r(word("after", 189))}, {"box": [598, 102, 822, 54], "atSec": r(word("strongly"))}]}],
    "labels": [{"text": "W. C. HENRY · 1854 · P. 25", "atSec": r(187.05), "untilSec": r(194.37), "x": 160, "y": 746, "size": 22}],  # v6 Editor S6
    "arrive": {"dir": "down", "px": 90, "sec": 0.45, "atSec": 0.25},  # settles from the cut (CutOnAction leadSec 0.25)
    "camera": {"pan": -30, "push": 0.02}},
    sid="H_wish_over_portrait", transitionIn="action", transition={"dir": "down", "px": 90, "leadSec": 0.25, "settleSec": 0.45, "moveTo": False})

# 73-75 the new question on keyword chips (W13), after the dark paper band (up) in the pause before "But".
shot(B(73, 74, 75), "KeywordPanel", lambda r: {
    "panel": {"chips": [{"text": "what is", "atSec": r(word("what", 198)), "x": 120, "y": 470},
                        {"text": "colour?", "atSec": r(word("colour", 198)), "x": 476, "y": 470, "accent": True},
                        {"text": "one man", "atSec": r(word("one", 202)), "x": 120, "y": 590}]},
    # Gate 3 v5 (Sam: "show in the background a blurred photo of Issac Newton. The photo shouldn't be too famous."): the
    # one man is Newton; his face (J. Swaine's engraving after Enoch Seeman's 1726 portrait, SRC-049) blurred behind the
    # chips, tagged on "one man" so the face is named when the line points at him.
    "labels": [{"text": "ISAAC NEWTON · AFTER ENOCH SEEMAN, c. 1726", "atSec": r(200.44), "x": 1800, "y": 980, "align": "right", "size": 22}]},
    transitionIn="band", transition={"dir": "up", "tone": "dark"},
    ground={"kind": "blur", "srcId": "SRC-049", "file": "public/assets/sources/newton_swaine_after_seeman1726.jpg", "size": [1063, 1790],
            "focus": [0.0, 0.26], "blurPx": 22, "brightness": 0.38, "zoom": 1.4})

# 76-77 E_dark_room: focus match into act 1's dark room, the closed shutter on the left third; act 4 opens from here.
shot(B(76, 77), "PerspectiveGrid", {
    "variant": "room", "depth": 2000, "dark": 0.7, "dolly": 0.02, "fog": 0.15, "startSec": -1,
    "objects": [{"kind": "shutter", "at": [-1050, -150, 600], "w": 260, "h": 360, "atSec": -1}]},
    sid="E_dark_room", transitionIn="match", focus=[280, 370])

# Sounds (house levels: hero ~15-17 dB under the voice in a pause, texture 21-29 dB under). The riser (MUS-015) and
# the hit (SFX-025) are events on the cue sheet (.music.json), so they are not repeated here.
K = "public/sfx/kit/"
audio = [
    {"id": "SFX-017", "file": K + "tactile/pencil_stroke.wav", "atSec": round(word("college"), 2), "volumeDb": -29.0},  # the ring draws round "Academy"
    {"id": "SFX-016", "file": K + "tactile/paper_move.wav", "atSec": round(word("paper", 28) + 0.45, 2), "volumeDb": -34.0},  # review S1: under the swish, not over it  # the p.28 page settles (pause after "paper.")
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 29.88, "volumeDb": -26.0},  # v6 Editor S1: peaks on the match  # focus match into the p.28 card (pause before "Its")
    {"id": "SFX-016", "file": K + "tactile/pages_move.wav", "atSec": round(S(17) + 0.1, 2), "volumeDb": -26.0},  # the glide to p.34 (quiet paper slide)
    {"id": "SFX-020", "file": K + "whoosh/low_whoosh_v1.wav", "atSec": 51.21, "volumeDb": -21.6},  # v6 Editor S1  # push into the page (pause before "Here's one"); cue 2 enters
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v1.wav", "atSec": round(word("laurel") + 0.62, 2), "volumeDb": -24.0},  # the leaf settles (comma pause after "leaf,")
    {"id": "SFX-006", "atSec": round(S(49) - 0.5, 2), "volumeDb": -18.0},  # J-cut: the page leads the drafting wipe by 0.5 s
    {"id": "SFX-017", "file": K + "tactile/marker_stroke.wav", "atSec": round(S(49), 2), "volumeDb": -27.0},  # the drafting line's stroke
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v2.wav", "atSec": 153.13, "volumeDb": -26.0},  # v6 Editor M2: on the wax landing  # the wax sticker settles (pause before "Reds")
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v2.wav", "atSec": round(S(61) + 0.05, 2), "volumeDb": -17.6},  # slide back into p.43
    {"id": "SFX-026", "file": K + "tactile/soft_pop_v3.wav", "atSec": round(S(67) + 0.33, 2), "volumeDb": -24.0},  # the morph lands on the iris (pause before "So")
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v3.wav", "atSec": 195.27, "volumeDb": -17.6},  # v6 Editor S1  # dark paper band up (pause before "But")
    {"id": "SFX-024", "file": K + "whoosh/air_swish_v1.wav", "atSec": 203.83, "volumeDb": -21.0},  # v6 Editor S1  # focus match into the room
]
# The act's music is the approved cue sheet (MUS-008 ActMoodCueSheet, scripts/mix-cue-bed.py), files in public/music.
cues = json.load(open(os.path.join(G1, "act3_cues_v2.json")))
REMAP = {"Wholesome.mp3": "public/music/wholesome_kevin_macleod.mp3", "Thinking Music.mp3": "public/music/thinking_music_kevin_macleod.mp3",
         "Long Note Two.mp3": "public/music/long_note_two_kevin_macleod.mp3", "At Rest.mp3": "public/music/at_rest_kevin_macleod.mp3",
         "riser_turn.wav": "public/sfx/kit/riser_turn_act3_v1.wav", "sub_impact_v1.wav": "public/sfx/kit/mechanical/sub_impact_v1.wav"}
for c in cues["cues"] + cues["events"]:
    c["file"] = REMAP[os.path.basename(c["file"])]
# Gate 3 review M3: Long Note Two is about 4 dB louder in its first 25 s; D (explanation) sits 3 dB lower after the hit
for c in cues["cues"]:
    if c["name"].startswith("3 "):
        c["levels"] = [[102.1, -41], [103.0, -41], [103.4, -44], [127.6, -44], [128.3, -41], [183.4, -41]]
# Gate 3 v5: the act ends at 208.10 (Sam); cue 4 and the level line end there
cues["dur"] = ACT_END
for c in cues["cues"]:
    if c["until"] > ACT_END:
        c["until"] = ACT_END
        c["levels"] = [l for l in c.get("levels", []) if l[0] < ACT_END] + [[ACT_END, c["levels"][-1][1]]] if c.get("levels") else c.get("levels")
# v6 Sound reviewer S1-S3
for c in cues["cues"]:
    if c["name"].startswith("1 "):
        c["from"] = 280.167  # Wholesome runs on from act 2 (104.59 + 175.567): no skip at the join
    if c["name"].startswith("2 "):
        c["fadeOut"] = 1.64  # ends on a bar of Thinking Music
    if c["name"].startswith("4 "):
        c["levels"] = [[183.6, -35], [206.7, -35], [207.08, -27], [208.1, -27]]
        c["fadeOut"] = 0.6  # the music-alone lift after 'born.' is heard
cues["ids"] = {"cues": ["MUS-007", "MUS-012", "MUS-013", "MUS-014"], "events": ["MUS-015", "SFX-025"]}

act = {"finish": {}, "motionBlur": True, "episodeId": "WCL-E01-act03", "themeId": "LOK-009",
       "runningHead": {"text": "3 · THE TALK", "fromSec": round(S(2), 2)},  # TXT-013, on diagram and text shots only
       "note": "Act 3 of WCL-E01 'The Man Who Saw Pink'. Gate 1 v3.1 approved by Sam 24 Nov 2026. Shots join beat-sheet beats; directed shots carry the brief's names. Cues from 03_talk_paced_149wpm_even + 2.4 s slate.",
       "voice": {"id": "NAR-003", "atSec": LEAD, "tailSec": round(ACT_END - LEAD - VOICE_SEC, 2), "fadeOutSec": 0.03},  # Gate 3 review S6: the take's last 5 ms (room tone) end in a tick
       "audio": audio, "beats": shots}
json.dump(act, open(os.path.join(LIB, "src", "episodes", "ep01-act03.json"), "w"), indent=1, ensure_ascii=False)
json.dump(cues, open(os.path.join(LIB, "src", "episodes", "ep01-act03.music.json"), "w"), indent=1, ensure_ascii=False)
print("mix: scripts/mix-cue-bed.py src/episodes/ep01-act03.music.json <bed.wav>  (cue sheet: %d cues, %d events, %d quiet spans)" % (len(cues["cues"]), len(cues["events"]), len(cues["quiet"])))
print(len(shots), "shots,", shots[-1]["end"], "s")
