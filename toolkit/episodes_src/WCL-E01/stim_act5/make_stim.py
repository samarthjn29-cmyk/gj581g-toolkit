"""Stimulation test (Sam, 25 Nov 2026: "the video is not as appealing ... some kind of stimulation is missing"; "Build the
stimulated version" + a new ground "which gives an illusion of energy and creativity"). Takes the approved act 5 file and
rebuilds shots I, J, K (82.8-115.05 s) at a higher energy, on a candidate ground: bigger type that lands hard, one burst,
saturated full-frame colour, the new transitions (ColourFlood into J, PrismSplit into K), sound that lands (sub impact,
riser into the prism, ticks on the named colours). Preview mode (BUILD PREVIEW tag): candidate pieces, not for delivery.
usage: make_stim.py THEME_ID OUT.json"""
import json, sys, copy
theme, out = sys.argv[1], sys.argv[2]
BURSTS = len(sys.argv) > 3 and sys.argv[3] == "bursts"  # Sam: "one more short clip ... with more bursts"
a = json.load(open("src/episodes/ep01-act05.json"))
a = copy.deepcopy(a); a["themeId"] = theme; a["previewMode"] = True
B = {b["id"]: b for b in a["beats"]}
I, J, K = B["I_by_candle"], B["J_most_people"], B["K_seven"]
rI = lambda t: round(t - I["start"], 2); rJ = lambda t: round(t - J["start"], 2); rK = lambda t: round(t - K["start"], 2)
for b in (I, J, K):
    b["assets"] = [x for x in b["assets"] if x not in ("LOK-009", "LOK-029")] + [theme]
# I: a real camera move, bigger strips, the key words land big
I["props"]["camera"] = {"pan": -220, "push": 0.06}
# the geranium lands low right, clear of the strips on the left and of the flame (Sam, 25 Nov 2026: "It is crashing into
# the color bars on the left")
I["props"]["carry"][0]["moves"][0].update({"to": [1530, 640], "w": 440})
I["props"]["labels"][0].update({"x": 1480, "y": 200})
for row in I["props"]["overlay"]["spectrum"]["rows"]:
    row["w"] = 760; row["h"] = 60
I["overlay"] = {"chips": [{"size": 120, "chips": [
    {"text": "far less blue", "atSec": rI(88.40), "x": 140, "y": 760, "accent": True}]}]}
I["assets"].append("TXT-024")
# J: the geranium's pink floods the frame and the table opens out of it; the table is big; "don't." lands with a hit
J["transitionIn"] = "flood"; J["transition"] = {"color": "#E79AB9", "at": [1340, 400], "r0": 130}
J["assets"] = [x for x in J["assets"] if x != "TRN-009"] + ["TRN-021", "TXT-024", "SFX-025"]
J["props"]["zoom"] = 1.2; J["props"]["zoomAtX"] = 1560
J["props"]["labels"][0]["y"] = 1000
J["overlay"] = {"chips": [{"size": 120, "chips": [{"text": "don't.", "atSec": rJ(102.15), "x": 1110, "y": 860, "accent": True}]}]}
# K: white light enters as a beam and splits into the band; the band fills the frame; each colour lands with a tick
K["transitionIn"] = "prism"; K["transition"] = {"y": 560, "splitX": 640}
K.pop("ground", None)
K["assets"] = [x for x in K["assets"] if x != "TRN-012"] + ["TRN-019", "SFX-015", "SFX-025", "MUS-015"]
d = K["props"]["divisions"]
d.update({"x": 120, "w": 1680, "y": 470, "h": 220, "nameSize": 40, "drawAtSec": 0.2, "liftFrom": 0.55})
K["overlay"]["chips"][0]["size"] = 84
for c, y in zip(K["overlay"]["chips"][0]["chips"], (230, 345)):
    c["x"] = 120; c["y"] = y
# sound that lands
a["audio"] = [c for c in a["audio"] if not (82.6 <= c["atSec"] <= 115.0 and c["id"] in ("SFX-001", "SFX-024"))]
a["audio"] += [
    {"id": "SFX-001", "atSec": 94.58, "volumeDb": -20.0},  # the flood
    {"id": "SFX-025", "file": "public/sfx/kit/mechanical/sub_impact_v1.wav", "atSec": 102.15, "volumeDb": -14.0},  # "don't."
    {"id": "MUS-015", "atSec": 101.11, "volumeDb": -18.0},  # riser into the prism (2.5 s, lands 103.61)
    {"id": "SFX-024", "file": "public/sfx/kit/whoosh/air_swish_v2.wav", "atSec": 103.62, "volumeDb": -17.0},  # the beam
] + [{"id": "SFX-015", "atSec": round(K["start"] + n["atSec"], 2), "volumeDb": -22.0} for n in d["names"]]
a["audio"].sort(key=lambda c: c["atSec"])
if BURSTS:
    # burst 1: the candle line lands word by word, three chips in 3 s, each with a pop
    I["overlay"]["chips"][0]["chips"][:0] = [
        {"text": "candlelight", "atSec": rI(85.70), "x": 140, "y": 480},
        {"text": "much yellower", "atSec": rI(86.74), "x": 140, "y": 610}]
    I["overlay"]["chips"][0]["size"] = 104
    # burst 2: "hardly matters" / "still pink" land fast before the break
    J["overlay"]["chips"].insert(0, {"size": 84, "chips": [
        {"text": "hardly matters", "atSec": rJ(96.97), "x": 120, "y": 800, "dimSec": rJ(99.24), "dimTo": 0.35},
        {"text": "still pink", "atSec": rJ(100.43), "x": 120, "y": 910, "accent": True}]})
    # burst 3: every colour name slams in big as it is said, one after another
    K["overlay"]["chips"].append({"size": 150, "chips": [
        {"text": n["text"].lower(), "atSec": n["atSec"], "x": 640, "y": 790,
         **({"dimSec": nx["atSec"] - 0.05, "dimTo": 0.0} if nx else {})}
        for n, nx in zip(d["names"], d["names"][1:] + [None])]})
    a["audio"] += [{"id": "SFX-026", "file": f"public/sfx/kit/tactile/soft_pop_v{i}.wav", "atSec": t, "volumeDb": -20.0}
                   for i, t in ((1, 85.70), (2, 86.74), (3, 96.97), (1, 100.43))]
    a["audio"] += [{"id": "SFX-020", "file": "public/sfx/kit/whoosh/low_whoosh_v2.wav", "atSec": 103.55, "volumeDb": -18.0}]
    a["audio"].sort(key=lambda c: c["atSec"])

json.dump(a, open(out, "w"), indent=1, ensure_ascii=False)
print("ok", theme, out)
