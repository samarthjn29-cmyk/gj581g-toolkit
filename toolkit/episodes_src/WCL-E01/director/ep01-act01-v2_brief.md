# WCL-E01 act 1 v2 "The Man Who Saw Pink": Director's brief (before the build)

Written 25 Nov 2026 for Sam's four picks (PLAN_v2.md: layers, Harris cue sheet, stickers/props/textures, Earth fly-in), on
top of the v1 energy pass Sam approved at Gate 2 (`rework_act1.py` -> `src/episodes/ep01-act01-energy.json`, 19 shots,
104.6 s, LOK-033 Studio Cream). Everything v1 does stays unless a heading below replaces it: the three bursts, every
chip on its word, TRN-019..022, the riser, the sub on 151 years.

Times are **act seconds** (narration NAR-001 at 0.8 s; word times = `01_flower_paced_words.json` + 0.8). Component
props inside a shot are **shot seconds**; both are given as `local (act)`. Frame 1920x1080, 30 fps.

## v2 summary

- **Layer shots: 2, not 4** (cap 4). `02+03+04` the 1794 Kendal map scrap (MAP-017) held over the candle, and
  `05+06+07` the geranium cut-out by candlelight, then in today's daylight (TRN-018). Both have a world that is the
  same place and time, or the change itself. I turned down the other two ideas (see "Declined").
- **Earth fly-in** (MAP-013) on "Kendal, in the north of England.", 0.00-3.70. The globe is TODAY and is tagged.
  The handover goes **globe (today) -> focus match on the Kendal point -> Kitchin's 1794 map scrap with Kendal
  circled -> the scrap sinks as the candle comes up -> dateline KENDAL · AUTUMN 1792**. So no date ever sits on
  the globe, and TODAY never sits on a period picture.
- **One structural change:** a shot holds one component (Episode.tsx), so v1's `01+02+03+04` is split at 3.70,
  in the pause after "England.". It becomes `01` (EarthFlyIn) and `02+03+04` (LayerStage). Every other shot id,
  the act length and the narration stay as they are.
- **Cue sheet:** four cues in the house order, entering in real pauses: Wholesome 0.00 / Thinking Music 26.15
  ("Tonight") / Long Note Two 48.70 ("So who's right") / At Rest 80.80 (after "fail the test"). The music breaks
  under the "astonishingly changed" quote and under "His idea will fail the test.". The 151-years break and sub
  stay at 86.80-87.20.
- **Foley:** SFX-028 Pixabay on the page turn (26.22) and on Newton's shutter (94.64), replacing three Mixkit cues.
  The match strike moves to 3.35 (J-cut into the candle).
- **Stickers and props, checked honestly:** no line in act 1 names a leaf, wax, a seal or a letter, so SRC-014,
  SRC-015 and SRC-046 are **not used**. No VIS-061 prop either: the nouns that are spoken (candle, flower, page,
  eyes, room, shutter) already have real pictures.
- **Texture:** TEX-009 Paper_363M on the paper-desk ground of the two page shots, if the builder adds a ground
  hook (open question 3). There is no plaster on Newton's room: Concrete_202M is already over its per-file cap
  in act 4.
- **TODAY footage: none.** The one line about today ("walked past this week") gets the Active TODAY daylight world
  (SRC-040). A Lake District clip could only sit on "Kendal", which the fly-in and the scrap already carry.
  SRC-052..057 stay Planned.

### Energy curve (act seconds)

| Span | Level | What carries it |
|---|---|---|
| 0.00-3.70 | rising | globe turns and plunges onto Kendal (2.0-3.55), pin on "Kendal" 0.80, NORTH OF ENGLAND 1.90 |
| 3.70-5.45 | medium | focus match into the 1794 scrap, circle on Kendal, scrap sinks as the candle comes up |
| 5.45-11.10 | quiet | candle; dateline 5.30/5.47, to corner 6.70; music alone 6.3-8.6; JOHN DALTON · TEACHER 9.53 |
| 11.10-19.50 | quiet, lifting | push into the flame, flower rises 11.25, stack "a geranium"/"nothing rare" 13.89/14.99, candle -> TODAY daylight 16.70-17.90 |
| 19.50-26.30 | low-medium | p.29: "by day" / "sky blue" (v1) |
| **26.30-37.00** | **BURST 1** | page turn, "tonight"/"by the candle", music drops under the quote 29.9-33.0, punch "astonishingly changed" 31.45, red flood 33.86, "red." 35.18 + swell 35.9-37.2 |
| 37.00-49.10 | medium | rows, "much the same" / "only one" / "Jonathan" (v1) |
| **49.10-57.00** | **BURST 2** | cue 3 enters 48.70; "who's right?", dive, "not so sure", pink flood (v1) |
| 57.00-72.20 | calmer | silly question, portrait, pioneer, answer (v1); swell 56.8-58.25 |
| **72.20-88.00** | **BURST 3** | LensDive, music out 78.75, "fail." dry 79.71, At Rest 80.80, riser 83.37, break 86.80, sub + swell 87.20 |
| 88.00-104.60 | quiet close | dark room, Dalton's eyes, prism title, At Rest alone 101.6-104.6 |

The longest stretch at one level is 5.45-11.10 (5.7 s), and it has changes at 5.47, 6.70 and 9.53. No gap between
visible changes is longer than 4 s.

---

## 01 fly-in (EarthFlyIn, new: split from v1 01+02+03+04)

| Field | What it says |
|---|---|
| Line | "Kendal, in the north of England." "Kendal" 0.80, "North" 1.90, "England." ends 2.66. Pause 2.66-4.16. Shot 0.00-3.70. |
| Subject | Kendal as a point on the Earth: the KENDAL pin, which the globe flies into. |
| World and why | SRC-050 NASA Blue Marble (globe + British Isles inset). **Same place, today:** the real ground the line names, seen from space before we go down into the evening. |
| Period honesty | A satellite composite of today, tagged `SATELLITE COMPOSITE TODAY · NASA BLUE MARBLE` from 0.20. No date on the globe. The tag un-wipes at 3.20, before the match, so the TODAY tag never shares a frame with the 1794 scrap or the 1792 candle. |
| Entry | The act's first frame. The globe is already there, small and centred on the North Atlantic (radius 420, lon -24, lat 44), turning. The eye starts at frame centre, where the globe is. |
| Path and landing | It turns towards Britain under "Kendal, in the north" (key 1.90: lon -5, lat 52.5, r 2200), then dives on Kendal in the pause (key 3.55: r 29300). Kendal **lands at (960, 420)**, centred on purpose (a single-place reveal) and 120 px above centre. That is so the scrap that replaces it can keep its source chip inside the safe line. The pin lands on "Kendal" at 0.80. At that moment Kendal is on the visible face, about 22° from the globe's centre. |
| Scale | Radius 420 -> 29300: we go into the place. The final radius is set so that Kendal->Manchester on the globe is the same length as on the scrap at w 760 (459 px). The match then changes the picture, not the size. Formula: `R_end = 29300 × (scrap w / 760)`. |
| Action | The pin lands at 0.80. NORTH OF ENGLAND rises at 1.90. |
| Exit | Tags first: NORTH OF ENGLAND un-wipes at 3.15 and the TODAY tag at 3.20. Then a focus match (TRN-015) at 3.70 on (960, 420). |
| Eye out | (960, 420), the Kendal pin. The next shot's circled Kendal on the scrap is on the same pixel. |
| Sound | Wholesome alone at -26 LUFS for the 0.8 s lead-in, then story level. SFX-001 soft whoosh at 2.70 (-20 dB) for the plunge, in the pause after "England.". The match strike SFX-013 at 3.35 (-> next shot) is the cut's sound, in place of TRN-015's usual swish (a match for a match). |
| Texture | None (rule 25: real imagery keeps its own surface). The globe sits on the LOK-033 cream canvas, so there is no black space: the atmosphere rim blends into cream. |

**Build**
- `id "01"`, `component "EarthFlyIn"`, start 0.00, end 3.70, `beatTimes [["E01-A1-01", 0.0, 3.70]]` (the beat-sheet boundary 01/02 moves from 2.95 to 3.70, inside the pause; the voice is untouched). No `transitionIn` (act start).
- `globe: { srcId: "SRC-050", file: "public/assets/sources/bm_global_8192.jpg", size: [8192, 4096] }`
- `inset: { srcId: "SRC-050", file: "public/assets/sources/bm_britain_240ppd.jpg", size: [3840, 3120], lon0: -12, lon1: 4, lat0: 61, lat1: 48 }` (as the registered demo `EarthFlyIn-Kendal`)
- `keys: [{atSec: 0, lon: -24, lat: 44, radius: 420}, {atSec: 1.9, lon: -5, lat: 52.5, radius: 2200, sec: 1.9}, {atSec: 3.55, lon: -2.746, lat: 54.093, radius: 29300, sec: 1.65}]`. The last centre is 0.235° south of Kendal (54.328), so Kendal sits 120 px above centre. Check on the 3.69 still that Kendal is at (960±6, 420±6).
- `pins: [{lon: -2.746, lat: 54.328, text: "KENDAL", atSec: 0.80, accent: true, side: "left"}]` (the label goes left, the same side as the scrap's KENDAL chip after the match)
- `labels: [{text: "NORTH OF ENGLAND", atSec: 1.90, untilSec: 3.15, x: 960, y: 860, align: "center"}]`
- `tag: {text: "SATELLITE COMPOSITE TODAY · NASA BLUE MARBLE", atSec: 0.20, untilSec: 3.20}`
- No `map` prop: the period map arrives as the torn scrap in `02+03+04` (SRC-045 must always be a torn scrap).
- Assets: add `MAP-013, SRC-050, SFX-001, TXT-010, MOT-002, MOT-013, LOK-010, MUS-007`.
- Notes: the inset is about 2x upscaled for the last 0.4 s, and that softness goes under the match dissolve. Render with `--gl=angle`, and check that FocusMatchCut's frozen frame of the WebGL canvas is not blank.

## 02+03+04 Kendal scrap and candle (LayerStage, layer shot 1)

| Field | What it says |
|---|---|
| Line | (pause from 3.70) "An autumn evening, seventeen ninety-two." 4.16-6.27; pause 6.27-8.61; "A young teacher named John Dalton is looking at" 8.61-11.05. Shot 3.70-11.10. |
| Subject | 3.70-5.45: Kendal on the 1794 map (the circle). Then the candle flame (the evening), and from 9.53 the name. |
| World and why | SRC-011, the candle clip (light warm). **Same place, same time:** the candle-lit evening in Kendal that the dateline names. The scrap in front shows where that room is. The world opens dimmed (dim 0.5) behind the scrap and comes up as the scrap leaves: focus moves from the place to the evening. |
| Period honesty | The scrap is Kitchin's map (SRC-045), with its source chip `KITCHIN · LAURIE & WHITTLE · 1794` on whenever the scrap is on screen. It is **lifted** (not `rest`) and leaves before the dateline, so it never reads as an object lying in a 1792 room, and the two dates are never on screen together. The candle carries KENDAL · AUTUMN 1792, as in v1 (Sam's approved convention for this clip). |
| Entry | Focus match (TRN-015) from the globe at (960, 420). The scrap is already landed on frame 1 (`atSec -1`), with its Kendal at the pin's pixel, at the same scale, north up (Kitchin is north-up: the Kendal->Manchester bearing is 70.8° on both). |
| Path and landing | Scrap centre (1015, 548), w 760 (x 635-1395, y 146-950). Kendal (file px 411, 346) falls at (960, 420). The source chip sits under the scrap's lower-left edge at about y 962-990, inside the 996 safe line. KENDAL route chip (file px 190, 300) sits left of the town. The circle draws on Kendal from 4.15 (0.5 s). |
| Scale | None. The size was chosen in 01 so that the match keeps the scale. |
| Action | The circle on Kendal. Then the scrap sinks (exit `sink`, 4.85-5.45) while the candle brightens (rackDim 0.5 -> 0, 4.65-5.45). |
| Exit | The scrap leaves first (`untilSec` 4.85). Dateline KENDAL 5.30, AUTUMN 1792 5.47 on "1792", low-centre, to the corner at 6.70 (v1). JOHN DALTON · TEACHER at 9.53 on "John", (960, 820), as v1. A push (TRN-006) at 11.10 from the wick (960, 560), unchanged. |
| Eye out | The wick (960, 560). `05+06+07` opens out of it (v1 push). |
| Sound | SFX-013 match strike at 3.35 (+2 dB, v1 level), in the pause after "England.". It is a J-cut, so the flame has caught by the 3.70 cut. SFX-014 candle room tone from 3.45 (fade in 0.6). Music: Wholesome at story level, lifted to -30 alone in the pause 6.3-8.6. The scrap and the circle are silent (the strike already marks the change). |
| Texture | **object:** the scrap is the one textured hero (period paper, torn edge). The candle footage gets nothing new (rule 25). |

**Build**
- `id "02+03+04"`, `component "LayerStage"`, start 3.70, end 11.10, `beatTimes [["E01-A1-02", 3.70, 6.4], ["E01-A1-03", 6.4, 8.6], ["E01-A1-04", 8.6, 11.1]]`, `transitionIn "match"`, `focus [960, 420]`.
- `worlds: [{atSec: 0, srcId: "SRC-011", file: "public/assets/sources/candle_lighting_mixkit3458_rev.mp4", kind: "video", size: [1080, 1920], focus: [0.5, 0.56], clipStartSec: <the first frame on which the flame has fully caught; builder measures, expected < 1 s>, light: "warm", lightFrom: "top", haze: 0.06, dim: 0.5, rackDim: 0, rackSec: 0.95 (4.65), why: "Same place, same time: the candle-lit evening in Kendal, autumn 1792, that the dateline names; the 1794 map scrap in front shows where that room is."}]`. The clip must stay lit for 7.4 s after `clipStartSec` (act 5 rule: never open a candle world on a dark or guttering frame).
- `carry: [{srcId: "SRC-045", size: [960, 1015], at: [1015, 548], w: 760, atSec: -1, tilt: 0, torn: true, untilSec: 1.15 (4.85), exit: "sink", route: {from: [411, 346], to: [411, 346], atSec: 0.05 (3.75), drawSec: 0.1, circleSec: 0.45 (4.15), chips: [{text: "KENDAL", at: [190, 300]}], source: "KITCHIN · LAURIE & WHITTLE · 1794"}}]`. There are no `moves`. `from = to` is a single place: a circle and no line (MAP-017's single-place use; see open question 2).
- `tag: {parts: [{text: "KENDAL", atSec: 1.60 (5.30)}, {text: "AUTUMN 1792", atSec: 1.77 (5.47)}], at: "low-centre", toCornerAtSec: 3.00 (6.70)}`
- `labels: [{text: "JOHN DALTON · TEACHER", atSec: 5.83 (9.53), x: 960, y: 820, align: "center"}]`
- `camera: {pan: 0, push: 0.04}`: one slow push towards the flame, which keeps the wick at (960, 560) for the push-out.
- Assets: add `VIS-059, MOT-016, MAP-017, SRC-045, TRN-015, TXT-011, MOT-013`; keep `SRC-011, SFX-013, SFX-014, TXT-010, LOK-010, MOT-002`; drop `VIS-016, MOT-001, TRN-001`. Use the music ID of cue 1 (MUS-007).
- Check stills at 3.70 (Kendal on the globe pixel), 4.60 (circle complete, chip and source inside the frame), 5.50 (scrap gone, flame bright) and 6.80 (tag in the corner).

## 05+06+07 geranium by candle, then today (LayerStage, layer shot 2)

| Field | What it says |
|---|---|
| Line | "a flower by candlelight." 11.05-12.39; "It's a geranium, nothing rare." 13.61-15.65; "The kind of flower you've probably walked past this week." 16.76-19.38. Shot 11.10-19.50. |
| Subject | The geranium flowerhead (cut-out). |
| World and why | World 1, SRC-011 candle, closer (zoom 1.2). **Same place, same time:** the candle he looks at it by, and the flower takes its warm light. World 2, SRC-040 daylight sky, dissolved in at 16.70. **The change itself:** the line turns from Dalton's evening to the viewer's week, so the flower is in today's daylight. This is Sam's geranium model ("The background for geranium is fine"), run candle -> day here. Act 5's `I_by_candle` later runs it day -> candle and pays it off. |
| Period honesty | World 2 is tagged `TODAY · DAYLIGHT` (`today: true`), on the line that is about today. The cut-out is a modern zonal geranium: the photo credit `PHOTO D. J. STANG, CC BY-SA 4.0 (CUT OUT)` is on screen (act 5 precedent; the CC BY-SA change is marked). Dalton's name for it is in quotes, as an attribution. **No colour states:** the flower keeps its own pink. A recolour would be a reported colour, and nobody reports one until p.29. |
| Entry | A push (TRN-006) out of the wick (focus [960, 560]), unchanged from v1. The candle world is framed closer (zoom 1.2, focus x 0.58), so the flame sits at about (760, 540). The flower **rises** on "flower" (11.25) from below on the right. It enters beside the flame, not over it. |
| Path and landing | The flower lands at (1340, 640), w 680 (x 1000-1680, y 419-861): the right third, about 180 px clear of the flame (rule 4), with lead room towards the flame it is lit by. DALTON'S 'GERANIUM ZONALE' at (1340, 890), centred under it, on "geranium" 13.89. The chips move up to the top-left to stay off the flame: "a geranium" (140, 120) 13.89, "nothing rare" (140, 240) 14.99. At 16.75, as the day dissolves in, the flower moves to **centre (960, 540), w 760**. |
| Scale | 680 -> 760 at the move: it comes nearer as it becomes "your" flower. |
| Action | The light changes on it: warm cast -> cool day cast (LayerStage crossfades the cast). No recolour. |
| Exit | Tags first: the label and the chip panel un-wipe at 16.60 (on "The kind of flower", where the line stops being Dalton's flower; this also settles the v1 frame-review note about the label running off the edge). Then a slide (TRN-007) to p.29 at 19.50, unchanged. |
| Eye out | The flower at centre (960, 540). p.29's first highlight is at about (630-940, 800), and the slide carries the eye there. |
| Sound | SFX-020 low whoosh at 10.95 for the push (v1). The flower's landing (12.15) is silent: the shot already has its pops on the two chips (13.89, 14.99, v1), and the whoosh carries the arrival. The candle room tone fades out 16.6-17.6 as the day comes in, so the sound of the change is the room going away. |
| Texture | **object:** the flower photo cut-out is the hero; the footage worlds get nothing new. |

**Build**
- `component "LayerStage"` (was FootagePlate); start, end and `beatTimes` as v1; `transitionIn "push"`, `focus [960, 560]` as v1.
- `worlds[0]: {atSec: 0, srcId: "SRC-011", file: "public/assets/sources/candle_lighting_mixkit3458.mp4", kind: "video", size: [1080, 1920], focus: [0.58, 0.56], zoom: 1.2, clipStartSec: 1.0, light: "warm", lightFrom: "left", haze: 0.1, why: "Same place, same time: the candle Dalton looks at the flower by, in Kendal in 1792; the flower takes its light."}`. Check the world's right edge at 19.5 (about 85 px spare before the pan). If any canvas shows, set focus x 0.56.
- `worlds[1]: {atSec: 5.60 (16.70), srcId: "SRC-040", file: "public/assets/sources/sky_clouds_mixkit51102.mp4", revFile: "public/assets/sources/sky_clouds_mixkit51102_rev.mp4", clipSec: 8.5, kind: "video", size: [1920, 1080], change: "dissolve", sec: 1.2, light: "day", lightFrom: "top-left", haze: 0.12, blur: 1.5, rackSec: 5.60, label: "DAYLIGHT", today: true, why: "The change itself: the line turns to today ('walked past this week'), so the same flower in today's daylight, tagged TODAY."}`
- `carry: [{srcId: "SRC-013", file: "public/assets/sources/geranium_stang_flowerhead_cutout.png", size: [1185, 769], at: [1340, 640], w: 680, atSec: 0.15 (11.25), enter: "rise", moves: [{atSec: 5.65 (16.75), to: [960, 540], w: 760, sec: 1.4, why: "Comes to the centre as the line turns to the viewer: in today's daylight it is just a flower you walk past."}]}]`
- `labels: [{text: "DALTON'S 'GERANIUM ZONALE'", atSec: 2.79 (13.89), untilSec: 5.50 (16.60), x: 1340, y: 890, align: "center"}]`
- `caption: "PHOTO D. J. STANG, CC BY-SA 4.0 (CUT OUT)"`; `camera: {pan: -60, push: 0.03}`
- `overlay.chips`: the v1 panel (size 96, same words and times), moved to `x 140, y 120` and `x 140, y 240`, with panel `untilSec: 5.50`. Keep at least 60 px between "nothing rare" and the flame tip on the 15.0 still. If it is closer, raise the chips by 20 px.
- Remove `warmth`, `warmthSec` and `crop` (FootagePlate props). Assets: add `VIS-059, MOT-016, TRN-018, SRC-011, SRC-040, MOT-013`; keep `SRC-013, TRN-006, TXT-010, TXT-024, SFX-026, SFX-014, LOK-010, MOT-002`; drop `VIS-016, MOT-001, TRN-001`.
- gate2-qa will WARN that two LayerStages are back to back (`02+03+04` -> `05+06+07`). The worlds differ (candle wide vs candle close + sky) and the push cuts between them, so it is accepted.

## 08+09+10 p.29 card (texture only)

| Field | What it says |
|---|---|
| Line, subject, entry, path, exit, eye, sound | As v1: the slide in at 19.50, the highlights, "by day" / "sky blue", the cardstock slide SFX-006. |
| Texture | **ground:** TEX-009 `Texturelabs_Paper_363M.jpg` inside the LOK-027 paper desk, at low strength (0.15-0.25), behind the card. The p.29 scan gets nothing new (rule 25). The chips and highlights stay crisp (rule 21). |

**Build:** only if the Ground hook exists (open question 3): `ground: {kind: "paper", tex: "TEX-009", texFile: "public/assets/textures/texturelabs/Texturelabs_Paper_363M.jpg", texStrength: 0.2}`, and add `TEX-009` to assets. Otherwise there is no change.

## 11+12+13 p.30 card (page-turn foley + texture)

| Field | What it says |
|---|---|
| Line, subject, entry, path, exit, eye | As v1 (TRN-020 page turn, chips "tonight" / "by the candle", punch "astonishingly changed"). |
| Sound | **SFX-028 `public/sfx/kit/pixabay/page_turn_book_v2.wav` at 26.22, -18 dB**, in the pause before "Tonight" (25.30-26.47): a real page for the page turn. It replaces SFX-016 `paper_move` at 26.05 and 26.35 and SFX-020 `low_whoosh_v1` at 26.00. The music drops to near-silence under the quote, 29.90-33.00 (cue sheet), so "astonishingly changed" lands dry. |
| Texture | **ground:** TEX-009 Paper_363M on the desk, as 08+09+10 (same desk, same file; the two shots are one scene). |

**Build:** audio swap as above. Ground `tex` as 08+09+10 if the hook exists. Add `SFX-028`; drop `SFX-020` from this shot's cues.

## 35+36 Newton's room (shutter foley)

| Field | What it says |
|---|---|
| Line, picture | As v1: "dark room ... a small hole in his window shutter.", the beam draws 94.22-94.92. |
| Sound | **SFX-028 `public/sfx/kit/pixabay/shutter_lock_v2.wav` at 94.64, -24 dB**, in the pause after "shutter." (94.60-95.36): the wooden shutter's latch, the room's one real sound. Act 4's room uses `shutter_lock_v1`, so act 4 hears the same shutter again. It replaces SFX-001 at 94.60, which frees that SFX-001 slot for the fly-in. |
| Texture | No change. TEX-009 plaster (`plaster`, Concrete_202M) would match act 4's room, but that file is already on 32 joined beats in act 4 against its 12-per-file cap. Not added until Sam raises it. |

**Build:** audio swap. Add `SFX-028` to the beat's assets.

## Unchanged shots (one line each: where the eye starts and ends)

- `14+15+16+17+18+19` SwatchRows: the red flood from the quote, then "red." top-left, then the rows. The eye ends on JONATHAN (about 1334, 760).
- `20` FootagePlate push: from the grid centre to "who's right?" (560, 760). Cue 3 is already up (48.70).
- `21` dive: into the bloom; "not so sure" bottom-left.
- `22` HalftoneMoire: pink flood; the loupe travels right; "Where is the pink?". Cue 3 swells in the pause 56.8-58.25.
- `23` candle (flash): "a silly question?" bottom-left.
- `24` ParallaxCutout push: the trace draws Dalton's face; "not a silly man" right.
- `25+26` DuotoneCollage: portrait upper right, atoms plate, "A pioneer of atomic theory".
- `27+28` DuotoneCollage match: the p.29 strip where the portrait was; swatches day -> candle; "An answer." left. Sound as v1. SFX-016 stays at 68.5 because SFX-028 is never on a word.
- `29+30+31` LensDive: into his eye, the tint clears on "fail.". Cue 3 is out by 78.75, so "fail." lands with no music.
- `32+33` YearCounter: 0 at the spectacle lens (830, 560) -> 151 YEARS. Riser, break and sub as v1, under cue 4.
- `34` candle push: the flame gutters. Cue 4 runs at story level.
- `37` LensDive dive: Dalton's eyes open, AS HE ASKED.
- `38` SeriesTitleCard (prism): the season sting alone; cue 4 is near-silent under it.
- `39` EpisodeCard: At Rest alone at -27 LUFS for 3.0 s, into act 2.

## Declined (Sam's other layer ideas)

- **Dalton's portrait over his p.29 (08+09+10):** the portrait is from 1834, when he was 68. Over a page about a
  26-year-old's 1792 evening, it would also take away his designed first face at 59.95 (shot 24, the trace). The
  page shot keeps its reading time and highlights.
- **The lens over the 1844 eye:** SRC-047 (the Wellcome eye model) is "never presented as Dalton's eye or as an
  examination". Shot 29+30+31 is exactly the examination line, and it is already VIS-032, the act's one flashy
  move.

## Cue sheet

Write it as a mix-cue-bed.py sheet: `src/episodes/ep01-act01-energy.music.json`, which replaces v1's `{"break", "sweeps"}`
Wholesome-bed file. Levels are integrated LUFS before the pocket duck. Classes: **story** -34/-35, **explanation**
-41 (+ `dynaudnorm=f=3000:g=31`), **quote near-silent** = a quiet span at -50, **break** -60, **alone** -26/-27 (-30 in
a mid-act pause).

| Cue | ID | File | from | in -> out (act s) | Enters in | Class / LUFS | Fades | Levels and notes |
|---|---|---|---|---|---|---|---|---|
| 1 the evening | MUS-007 | public/music/wholesome_kevin_macleod.mp3 | 0.0 | 0.00 -> 26.40 | act start | story -34 | in 0.03, out 1.0 (25.40-26.40, after "blue." 25.30) | `[[0,-26],[0.55,-26],[1.0,-34],[6.3,-34],[6.7,-30],[8.2,-30],[8.6,-34],[26.4,-34]]`: alone for the 0.8 s lead-in and again in the 6.27-8.61 pause (the flame settles) |
| 2 the evidence | MUS-012 | public/music/thinking_music_kevin_macleod.mp3 | 0.0 | 26.15 -> 49.10 | pause 25.30-26.47, before "Tonight" | story -35 | in 0.6, out 0.6 (in the pause after "Jonathan.") | `[[26.15,-35],[35.75,-35],[35.95,-31.5],[37.2,-31.5],[37.55,-35],[49.1,-35]]`: +3.5 dB in the pause after "red." (rule 6) |
| 3 the question | MUS-013 | public/music/long_note_two_kevin_macleod.mp3 | 0.0 | 48.70 -> 78.75 | pause 47.40-49.28, before "So who's right" | explanation -41, filter `dynaudnorm=f=3000:g=31` | in 0.4, out 0.4 (78.35-78.75, before "His idea") | `[[48.7,-41],[56.8,-41],[57.0,-37.5],[58.0,-37.5],[58.25,-41],[77.1,-41],[77.3,-37.5],[78.3,-37.5],[78.35,-41]]`: small swells only in the pauses after "is." and "dies." |
| 4 the wait | MUS-014 | public/music/at_rest_kevin_macleod.mp3 | 0.0 | 80.80 -> 104.60 | pause 80.67-81.53, after "fail the test." | story -35 | in 0.5, out 0.03 (act join) | `[[80.8,-35],[87.15,-35],[87.2,-31],[88.2,-31],[88.45,-35],[101.5,-35],[101.7,-27],[104.6,-27]]`: +4 dB on the sub, alone 3.0 s on the episode card |

- **quiet:** `[[29.90, 33.00, -50, 0.3], [86.80, 87.20, -60, 0.05], [98.45, 101.55, -62, 0.3]]`. In order: the
  quote, so "astonishingly changed" lands dry (ENERGY rule 10, music breaks before the punch); the 151-years break
  (v1); and under the season sting (MUS-006 at 98.75, -6 dB, v1). Cue 3 is already out under "His idea will fail
  the test." (78.75-80.80), so "fail." (79.71) also lands with no music.
- **events:** none. MUS-015 (83.37, -18 dB), SFX-015 (85.87) and SFX-025 (87.20, sub_impact_v1, -12 dB) stay in the
  act's `audio` as in v1. Do not add them twice.
- **sweeps:** keep v1's `[33.86, 0.8]` (the red flood). Drop the one at 49.1: cue 3's entry is now that change.
- `ids: {cues: ["MUS-007", "MUS-012", "MUS-013", "MUS-014"], events: []}`. Put each cue's ID on the beats it covers
  in place of MUS-007.
- `from` offsets: act 1 is the episode's first act, so each track starts at its own first bar. Snap each `from` and
  entry to a downbeat with `scripts/music-beats.py`. Act 4 also starts Wholesome and At Rest at 0.0, three acts
  later, which is acceptable.
- Music alone: the act cannot open with 2-3 s of music before the first word, because "Kendal" is fixed at 0.80.
  The opening breath is the 2.3 s pause at 6.3-8.6 instead, with Wholesome alone at -30. At the end, At Rest plays
  alone 98.10-98.45, the sting plays alone, and At Rest plays alone again 101.6-104.6 (3.0 s).

## Foley

| Second | ID | File | dB | Why |
|---|---|---|---|---|
| 2.70 | SFX-001 | public/sfx/soft-whoosh.wav | -20 | The globe's plunge onto Kendal, in the pause after "England." (new; the slot is freed from 94.60). |
| 3.35 | SFX-013 | public/sfx/candle_strike_mk2590.wav | +2 | Moved from 0.00: the match is struck in the pause, as a J-cut, so the candle has caught by the 3.70 cut. |
| 3.45 -> 17.60 | SFX-014 | public/sfx/room_tone_mk3080.wav | 0, fade in 0.6, fade out 1.0 | The candle room starts with the candle (was 0.00) and goes as the day comes in (was 19.4). |
| 26.22 | SFX-028 | public/sfx/kit/pixabay/page_turn_book_v2.wav | -18 | The p.29 -> p.30 page turn, in the pause before "Tonight". Replaces SFX-016 ×2 and SFX-020 at 26.0. |
| 94.64 | SFX-028 | public/sfx/kit/pixabay/shutter_lock_v2.wav | -24 | Newton's wooden shutter, in the pause after "shutter.". Replaces SFX-001 at 94.60. |

- Removed: SFX-016 at 26.05 and 26.35, SFX-020 at 26.00, SFX-001 at 94.60. All other v1 cues stay where they are
  (pops, whooshes, pencil on the trace, shutter tick 72.18, riser, tick, sub, projector hum).
- **No quill:** no line or picture in act 1 shows anyone writing. The quill and pen files wait for a line where he
  writes. Page highlights take no foley (SFX-016 and SFX-026 rules).
- SFX-028 is credited in the description (Pixabay). The kit's files are not on this machine yet (see open
  questions).

## Limits

Counts are beat-sheet beats (a shot's `beatTimes`) unless the limit counts shots or uses. "Acts 2-5" are counted from
`ep01-act0[2-5].json` as they stand today.

| Asset | Act 1 v2 | Cap | Acts 2-5 | Episode total | Note |
|---|---|---|---|---|---|
| VIS-059 LayerStage | 2 shots | 4 / act | (3: 4, 5: 1) | n/a | OK |
| MAP-013 EarthFlyIn | 1 | 1 / episode | 0 | 1 | OK (at cap) |
| SRC-050 Blue Marble | 1 shot | via MAP-013 only | 0 | 1 | OK, tag on |
| MAP-017 MapScrapRoute | 1 | 3 / episode | 1 (act 3) | 2 | OK |
| SRC-045 Kitchin 1794 | 1 beat (E01-A1-02) | 4 beats / episode | act 3 shot joins 11 beats | 2+ | **Check:** if the Beat_Sheet lists SRC-045 on all 11 act 3 beats, it is already over. |
| SRC-046 / SRC-014 / SRC-015 | 0 | 2 / 14 / 10 | 1 / 3 / 2 | n/a | Not used: no line names them |
| VIS-060 / VIS-061 | 0 / 0 | 12 / 6 per act | n/a | n/a | n/a |
| SRC-011 candle | 8 (02-07, 23, 34) | 16 / episode | 6 + 5 | **19** | **Over** (v1 was already 17). Ask to raise (Sam raised it before), or fall back below. |
| SRC-013 geranium | 5 (unchanged) | 27 / episode | 11 + 13 | 29 | **Over before v2**; ask to raise |
| SRC-040 sky | 1 shot | 3 shots / episode | 1 (act 5) | 2 | OK |
| TRN-018 WorldSwap | 1 | 3 / act | n/a | n/a | OK |
| TRN-015 match | 2 (02+03+04, 27+28) | 1 in 3 changes, never 2 in a row | n/a | n/a | OK (2 in 18) |
| TRN-006 push | 4 (unchanged) | 14 / episode, never 2 in a row | n/a | n/a | OK |
| SFX-001 | 3 (2.70, 54.2, 77.15) | 6 / episode | 3 (act 5) | 6 | OK (at cap; 94.60 moved to 2.70) |
| SFX-013 strike | 1 | 2 / episode | 0 | 1 | OK |
| SFX-014 room tone | 6 beats (02-07) | 10 / episode | 5 | 11 | **Over by 1** (v1 was 12). Ask to raise. |
| SFX-016 + SFX-028 paper | 3 (26.22, 64.75, 68.5) | 10 / episode | 6 + 2 | 11 | **Over by 1** (v1 was 12). Ask to raise. |
| SFX-028 shutter / glass | 1 | per kit | 3 (act 4) | 4 | OK |
| SFX-020 low whoosh | 5 (26.0 dropped) | 12 / episode | 3+1+2+1 | 12 | OK (was 13) |
| SFX-025 sub | 1 | 3 / episode, 1 / act | 1 + 1 | 3 | OK (at cap) |
| SFX-026 soft pop | 18 cues in 10 beats (v1) | 8 beats / episode | 2+3+2+3 cues | n/a | **Over since v1:** ENERGY rule 9 has a pop on every chip; the register needs Sam's raise. |
| MUS-012 / 013 / 014 | 1 each | 1 / act | 1 each per act | n/a | OK |
| MUS-015 riser | 1 | 1 / act | 1 (act 3) | n/a | OK (act 2 has none, so not two acts in a row) |
| MUS-006 sting | 1 | 1 / episode | 0 | 1 | OK |
| TEX-009 kit | 6 beats (08-13, Paper_363M) if the hook exists | 40 / episode, 12 per file | 32 (act 4, all Concrete_202M) | 38 | Kit OK; **Concrete_202M is over its 12 in act 4**, so there is no plaster in act 1 |

**Fallback if Sam won't raise SRC-011:** `05+06+07` world 1 becomes SRC-013's own photo, warm-graded (`light: "warm"`,
the v1 look), with the cut-out in front. That brings SRC-011 back to 5 beats in act 1. The 1794 scrap shot keeps the
candle.

## New assets / open questions for Sam

1. **Split `01+02+03+04` into `01` (fly-in, 0-3.70) and `02+03+04` (3.70-11.10).** One component per shot, so the
   globe and the candle cannot share an id. Every other id stays. If you would rather not split, the fly-in
   cannot go in act 1 without losing the lit candle.
2. **Register wording:** (a) SRC-045 says "always ... with a route line". Act 1 names one place, so the scrap
   carries a circle on Kendal and no line (MAP-017 allows "a single place said in the line"). (b) MUS-013's "Not
   for story": it sits under the question and his guess (48.7-78.75) at explanation level. If it feels cold, use
   Wholesome at story level. (c) MUS-007 "never stops" is now cue 1 of 4, as in acts 3-5.
3. **TEX-009 on the paper desk** needs a small Ground option (`tex`, `texFile`, `texStrength`) in
   `layers/Ground.tsx`. Only PerspectiveGrid's `plaster` is wired today. Build it, or skip the desk texture.
4. **Raise limits** that v1 had already passed: SRC-011 (to 20), SRC-013 (to 30), SFX-026 (to cover the chip
   pops), SFX-014 (12), paper foley (12), TEX-009 Concrete_202M (act 4's room).
5. **Files not on this machine:** the candle and sky clips, the music, the Pixabay kit and the Texturelabs kit
   (G: or Drive). The builder also measures the candle's catch frame for `clipStartSec`.
6. gate2-qa looks for `<act file name>_brief.md`. If the v2 act file stays `ep01-act01-energy.json`, copy this
   brief to `ep01-act01-energy_brief.md`, or name the v2 act file to match.
7. **No TODAY footage proposed** (SRC-051..057 stay Planned). For act 1 none is needed.

---

# Carried from v1 (directed shots v2 does not change; rule D)

The v1 briefs below still hold for v2, with the energy pass of rework_act1.py on top (chips, dive/flood transitions).

## 20 FootagePlate (push)

| Field | What it says |
|---|---|
| Line | "So who's right about this flower?" (49.28-51.06). Clip 49.10-51.70. |
| Subject | The geranium and the question WHO'S RIGHT?. |
| World and why | The same flower photo at neutral warmth (`warmth` [0, 0]). **Same thing, no candle:** the disputed flower put plainly, after the table of who saw what. |
| Period honesty | The same modern stand-in as 05+06+07. It has no date label here, so it claims nothing. |
| Entry | A push from `focus` [1033, 552], the centre of the swatch grid. The flower opens out of the table it is being argued over. The last change there (HIS BROTHER / JONATHAN, red cell at about (1334, 760)) is 300 px across and 210 px down from it, inside 25%. |
| Path and landing | The photo fills the frame, with the bloom centre at about (980, 740). WHO'S RIGHT? (accent) rises at 49.54 on "who's" at (960, 860), centred on purpose (a question card), under the stamens and clear of them. |
| Scale | None. Shot 21 then cuts in closer on the same bloom. |
| Action | The label rises. |
| Exit | A hard cut at 51.7 to shot 21's closer crop [640, 560, 520, 292]. |
| Eye out | The bloom centre (980, 740). Shot 21's bloom centre is at about (920, 560), 180 px away. |
| Sound | Low whoosh at 48.80 (-21.6 dB), moved off "So" per the review. Nothing on the label. |

## 27+28 DuotoneCollage (match)

| Field | What it says |
|---|---|
| Line | "About two years after that evening," (67.90-69.62) "he'll have an answer to this flower." (69.96-71.44). Clip 67.80-72.20. |
| Subject | Dalton's own line about the geranium (p. 29 strip, HIS OWN WORDS · P. 29), then the flower's two colours, then "An answer.". |
| World and why | The dark collage ground of 25+26, where his later work was laid out. **Same idea:** his own papers. The ghost of the atoms collage dissolves out under the strip. |
| Period honesty | Period page cut-outs (1798). The two swatches are flat graphic colour and claim nothing. |
| Entry | A match from 25+26. The strip lands at (1340, 420), where the portrait was (1420, 450), so the eye stays on the upper right. ABOUT TWO YEARS LATER comes into the corner at 67.9, on "About". |
| Path and landing | The strip sits on the upper right (x 860-1830, y 300-520). The blue swatch drops at 68.5 (1150, 740) and the red at 68.9 (1540, 760): day, then candle, left to right. "An answer." lands on the left at 70.42, on "answer" (x 120-560, y 540), balancing the right-heavy collage. |
| Scale | None. |
| Action | The swatches drop in, then the line arrives. |
| Exit | A lens cut (TRN-017) at 72.2. |
| Eye out | "An answer." on the left. The next shot's first line, "Tested", lands in the same left column (x 120-380, y 370), and the portrait's face fills the right. |
| Sound | pages_move at 68.5-69.3 (-18.5 dB) with the swatch drops. Then the shutter tick at 72.18 (-24 dB), in the pause before "He'll". |

## 29+30+31 LensDive (lens)

| Field | What it says |
|---|---|
| Line | "He'll want it tested so much that he'll ask for his own eyes to be examined after he dies." (72.38-77.10) "His idea will fail the test." (78.77-80.67). Clip 72.20-81.40. |
| Subject | Dalton's eye (the lens at about (1086, 540), his right eye), then the idea inside it (a blue-tinted fluid), then its failure (the fluid is clear). |
| World and why | The 1834 portrait (SRC-004). **Same person:** these are the eyes the line is about. The push goes into the eye itself. |
| Period honesty | A period portrait. The corner tag JOHN DALTON · 1834 is on from 0 (act file, after the review). The scraps and tint inside the lens are graphic, a model of his guess. |
| Entry | The lens settle: the portrait lands blurred and slightly large on 72.2 and is sharp by 72.27. "Tested" arrives at 72.92 on "tested". The brackets close on the eye at 74.88 on "eyes". EXAMINED AFTER HE DIES · 1844 arrives at 75.82 on "examined". |
| Path and landing | The push into the eye starts at 77.15 (1.1 s) and ends in a circle at `push.to` [1250, 500], r 330, right of centre, leaving the left for the words. Inside are a red and a blue scrap under a blue tint. HIS GUESS · 1794 · A BLUE-TINTED FLUID shows 78.10-79.15. "His idea will fail the test." lands on the left at 78.93. The tint clears at 79.75 on "fail", and 1844 · THE FLUID: CLEAR arrives with it. |
| Scale | It grows into the eye (we go into it) and shrinks back out of it at 80.85 (`out.to` [830, 525], r 70). |
| Action | The tint clears and the red scrap shows its true red. |
| Exit | The `out` zoom carries the circle back onto the left lens of his spectacles and dims the frame. Hard cut at 81.4. |
| Eye out | (830, 525). The YearCounter "0" lands at about (830, 560): the same spot. |
| Sound | The shutter tick at 72.18 for the settle, in the pause. SFX-001 at 77.15 (-15 dB) for the push into the eye, in the pause 77.10-78.77. |

## 24 ParallaxCutout (push, v1 energy pass)

One-line brief: a push (TRN-006) from the candle's flash into Dalton's portrait at focus (700, 540); the eye starts on the flash centre and ends on his face (the trace draws it), "not a silly man" lands right at (1020, 820). Sound: SFX-024 swish on the push, SFX-017 pencil on the trace.

## 34 FootagePlate (push, v1 energy pass)

One-line brief: a push (TRN-006) from 151 YEARS into the candle at focus (960, 600); the eye goes from the number to the flame, which gutters under "Along the way". Sound: SFX-024 swish on the push; cue 4 at story level.
