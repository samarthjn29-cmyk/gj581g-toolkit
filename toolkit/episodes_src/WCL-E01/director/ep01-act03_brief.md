# WCL-E01 act 3 "The talk": Director's brief (directed shots)

Written 23 Nov 2026, before the build, from `director/ep01-act03_plan.md`, script lines a3-01 to a3-15 (`WCL-E01_script_v2.json`), the gate 1 on-screen fact-check (`gate1_act3_onscreen_factcheck.md`) and the coordinator's fact-check items 1-10 (same day). The narration is not recorded yet, so every time is a word cue: "on 'laurel'" means the frame the word starts. When the paced take exists, the builder turns cues into seconds with the house offsets (a tag's landing sound on the settle frame, about atSec + 0.23 s; exits about 0.2 s early when they must clear a cut).

Frame 1920x1080, 30 fps, house theme LOK-009. Calm version throughout (rule 12).

Pictures I looked at: `manchester_plan_1794.jpg` (1920x1280, a crop of Green's plan), `dalton1798_p28.jpg` (1920x1890), `p30`, `p34`, `p43` (1920 wide), `henry1854_p25.jpg` (2288x4010), `laurel_runicearth.jpg` and `laurel_runicearth_leaf_cutout.png` (800x700), `sealingwax_petrik.jpg` and `sealingwax_petrik_cutout.png` (438 wide x 497 high), and the last frame of `WCL-E01_act2_v10.mp4` (BuildUpMap, eye on the "Why?" node at about (744, 424)). All coordinates in "image px" are pixels of the file named. All others are frame px.

**Shot list (directed shots get a full table; plain cards get one line at the end):**

| Shot | Lines | Component | Transition in |
|---|---|---|---|
| A_manchester_talk | a3-01, a3-02, a3-03 to "reads out a paper." | LayerStage (VIS-059) | from the act slate |
| A2_title_match | a3-03 from "Its title is" | ArchivalScanCard p.28 | focus match (TRN-015) from A's page |
| (card) | a3-04 | ArchivalScanCard p.34 | CanvasGridPan (TRN-004), right |
| B_leaf_and_wax | a3-05, a3-06 | LayerStage (VIS-059) | push (TRN-006) from the p.34 card's laurel line |
| (card) | a3-07 | SpectrumStrip x2 | CanvasGridPan (TRN-004), down |
| D_into_the_eye | a3-08, a3-09, a3-10 to "It's tinted." | EyeDiagram, section | cut on the swell's hit |
| (card) | a3-10 from "In his words" | ArchivalScanCard p.43 | DraftingWipe (TRN-002) |
| C_carry_into_eye | a3-11 | EyeDiagram, section, + two carried cut-outs | InkBleed (TRN-005) |
| (cards) | a3-12, a3-13, a3-14 | p.43 card, EyeDiagram simple, Henry strip | SlideAcross (TRN-007), ShapeMorph (TRN-009), CutOnAction (TRN-010) |
| E_dark_room | a3-15 | KineticLine, then PerspectiveGrid room | PaperBandWipe (TRN-011) in, then focus match (TRN-015) into the room |

---

## A_manchester_talk

**The idea:** the plan is the town of the talk in its year. The college where he teaches is marked on it in the plan's own engraving ("Academy"). Then the paper he read that night is held up in front of the town.

| Field | What it says |
|---|---|
| Line | a3-01 "So Dalton takes his question to the experts. Manchester, the last day of October, seventeen ninety-four." a3-02 "He moved to the town the year before. He's twenty-eight. He teaches mathematics and natural philosophy, the old name for the study of nature, at a college called the New College." a3-03, first sentence: "Tonight, he stands up in front of the town's Literary and Philosophical Society and reads out a paper." The shot ends at the match on "Its title is". |
| Subject | One at a time. a3-01: the town, named by the dateline. a3-02: the New College, which is the building the plan itself labels "Academy". a3-03: the paper (p.28). |
| World and why | SRC-009, Green's plan of Manchester (begun 1787, completed 1794). **Same place, same year.** `why: "Same place, same year: Manchester as Green finished mapping it in 1794, the year of the talk; the plan itself marks the college where Dalton taught."` |
| Period honesty | A period map, labelled throughout `PLAN OF MANCHESTER · WILLIAM GREEN · 1794`, with the holder as the register gives it. No modern picture in the shot. SRC-009 limit: always with a dateline tag (it has one). |
| Entry | The act slate is centred, so the eye is at frame centre. The world fades in under it (LayerStage pIn, 0.6 s). The DatelineTag starts `at: "low-centre"` (960, 860), just below where the eye already is. That spot is the open ground under St Peter's on the plan (image px about (915, 745)). Part 1 `MANCHESTER` arrives on "Manchester". Part 2 `· 31 OCT 1794` arrives on "October". `toCornerAtSec` on "moved" (a3-02) eases it to the corner (120, 84), out of the way of the college. |
| Path and landing | **Framing:** `zoom 1.1`, `focus [0.4769, 0.37]`. That puts the "Academy" building (image px about (1185, 280)) at frame **(1280, 310)**, on the right third and upper third. It ends at about (1271, 307) after the camera move. St Peter's Church lands at about (1042, 702). The world's edges stay off frame through the whole move: left -128, right 2153, top -23, bottom 1498. **Facts (Labels, centred on x 1280, under the college):** `AGE 28` at y 490 on "twenty-eight". `TUTOR · MATHEMATICS AND NATURAL PHILOSOPHY` at y 536 on "mathematics" (about x 955-1605). **College:** a ring (MAP-008), centre (1280, 307), r 125, drawn on "college" ("at a college called"). It goes round the hatched building and leaves the engraved word "Academy" (frame about x 1268-1327, y 231-356) readable inside it. `NEW COLLEGE` (accent, `settle`) sits centred above the ring at (1280, 135) and lands on "New College". So the plan's own word and our label say the same thing. **Page (p.28):** a cut-out of the page only (see Asset 2), `w 560` (h about 637). It rises on "paper" and lands at **(560, 780)**: x 280-840, y 462-1098. Its bottom edge sits off frame on purpose. It is held up from below, the way he "stands up ... and reads out a paper", and that hides the scan's cut bottom edge. Its lead room faces right, towards the college. |
| Scale | None for the world, apart from the camera's push. The page does not change size here. It grows by the match into the card (A2): we go into it. |
| Action | The ring draws (0.7 s). The page takes the plan's light and lands lifted, with a soft shadow falling down and to the right. |
| Exit | **Tags first.** `AGE 28` and `TUTOR · ...` un-wipe on "Tonight" (a3-03). `NEW COLLEGE` and the ring un-wipe 0.3 s later, so the right side is clear before the page comes. The dateline gets `untilSec` on "title" (a3-03), so it is gone just before the match. **The page does not leave.** A focus match (TRN-015) on "Its title is" opens A2's card in its place. |
| Eye out | The page centre (560, 780). A2's card is centred on (568, 540), and the title it highlights first is at about (270-840, 180-220). The blur dissolve carries the eye up the page in place. |
| Sound | The bed carries the world in. The dateline is silent (house). The pencil texture plays at -29 dB under the ring draw, which falls in the pause after "New College." SFX-016 `paper_move` at -24 dB plays on the page's settle frame (rise atSec + about 0.7 s), in the pause after "paper.". SFX-024 swish for the match plays in the pause before "Its". |

**LayerStage choices**
- `worlds[0]`: `{ atSec: 0, srcId: "SRC-009", kind: "image", size: [1920, 1280], zoom: 1.1, focus: [0.4769, 0.37], light: "paper"` (see Builder 4; fall back to `"none"`)`, haze: 0.06, blur: 1.5, rackSec: <the page's atSec>, lightFrom: "top-left", label: "PLAN OF MANCHESTER · WILLIAM GREEN · 1794", why: ... }`.
- **Haze 0.06** only. For about 20 s the plan is the subject. Rule 14 says never blur the world's subject while the narration is about it, so the blur (1.5 px) racks in only when the page arrives, as the line moves from the town to the paper. The ring and labels have already un-wiped by then, so nothing we drew goes soft.
- **lightFrom: there is no light in the picture.** It is an engraved plan, and the scan is evenly lit with no fall-off. I use the house `"top-left"` (the Weather shot), so the page's shadow falls down and right onto open plan and away from the dateline corner. This agrees with the seal photo's own light (see B).
- **Lifted, not resting** (`rest` false, `enter: "rise"`). A page lying flat on a flat map would slide across it under parallax (near plane 1x, far plane 0.35x), which is wrong for a resting thing. A held-up paper can parallax, and the line has him stand up and read.
- **Camera:** `{ pan: -40, push: 0.03 }`. The planes drift left, so the camera moves right, towards the college. That is the one slow move, and it has a destination (rule 6, rule 18).
- **Where text sits:** the dateline starts in open ground low-centre, then goes to the top-left corner (built-up streets, on a chip). The facts sit under the ring over minor street names (Dickenson, Bond), 58 px below the ring. The college name sits above the ring in the top band (top about 120, inside the 84 px safe line). The world label sits bottom-right over the open fields ("Salford Poor" is at about y 951, 30 px above the chip).
- **What the move uncovers:** the pan brings about 14 px more of the plan in on the right. Nothing is covered and then revealed: the labels leave before the page arrives, and the page never leaves.
- **Rule 4 (the world's own subject):** the subject is the college, with the engraved word "Academy". The ring goes round the building, so nothing sits on it. The page's right edge (x 840) stays 300+ px from the ring and 130 px from St Peter's. The dateline corner covers only built-up streets.
- **Rule 16 (lines tying planes):** passes. The plan's long straight streets (Peter Street, Cooper Street, the Oxford road) stay in the far plane, and no near thing continues them. The page is an upright rectangle on a plan whose streets run at about 55°, so there is no false joint. The ring must ride the far plane (Builder 2), or it will slip about 14 px off the building over the shot, and that is exactly the cardboard tear rule 16 warns about.
- **Rule 13 (three planes):** far = the plan; near = the page. There is no mid plane, and that is accepted: the plan's own building hatching, stippled fields and hedges give the far plane texture at two scales.
- **Stillness:** the dateline parts (a3-01), the corner move ("moved"), `AGE 28`, `TUTOR`, the ring and `NEW COLLEGE`, the un-wipes ("Tonight"), the page ("paper") and the match. The longest gap is "He moved to the town the year before. He's", about 3 s, and it holds the corner move. The camera moves throughout.

**Changes to the plan (rule or fact-check):**
1. **No pin on "Manchester".** The coordinator asked for the pin to stay "general on 'Manchester'", but on a street plan of Manchester a pin always names one street. Any spot I pick would say "the talk was here", and that is false: until Dec 1799 the Society met at Cross Street Chapel, which is outside this crop. It would also break rule 6 (a destination with no meaning). The dateline tag is the general marker. The only mark on the plan is the ring on the college, labelled as the college. It never says the talk was there, because the labels un-wipe on "Tonight", before the talk is described. If Sam wants a pin on the talk, it needs a wider crop of the plan with Cross Street Chapel in it (see Needs registering).
2. The college label is split into three timed pieces with the fact-checked words (NEW COLLEGE · TUTOR · AGE 28, plus the subject). That way each lands on its own word and none sits on screen ahead of it.
3. The plan's "p.28 rises onto the plan with the title and READ highlighted" is split. The page arrives in A, and the highlights are done on a card in A2. At w 560 on the plan the title is about 15 px tall, which cannot be read, and LayerStage cannot highlight a carried thing.

## A2_title_match (focus match into the p.28 card)

| Field | What it says |
|---|---|
| Line | a3-03 from "Its title is 'Extraordinary facts relating to the vision of colours'. The subject is his own eyes. It's his first paper to the Society." |
| Subject | The printed title, then "READ OCT. 31st, 1794." |
| World and why | ArchivalScanCard ground: the same plan, blurred (`ground` blur SRC-009). **Same place, same night.** The card is the paper he read, in front of the town. |
| Period honesty | A period page. Source tag `JOHN DALTON · 1798 · P. 28`. |
| Entry | TRN-015 focus match from A's page, in place. `side: "left"` with crop `[700, 160, 1000, 960]` (image px): card x 120-1016, centred on (568, 540). |
| Path and landing | Highlights in image px, in reading order. `[840, 208, 690, 64]` "EXTRAORDINARY FACTS" on "Extraordinary". `[940, 318, 490, 76]` "Vision of Colours:" on "vision". `[975, 578, 425, 56]` "READ OCT. 31ST, 1794." on "first paper". On the card these sit at about y 180-220, 266-310 and 498-528. Quote column (right): the title without quote marks (`quoteMarks: false`), as the fact-check set it: "Extraordinary Facts relating to the Vision of Colours: with Observations". |
| Scale | It grows from A's w 560 page to the 896 px card: we go into it. |
| Action | Three highlight sweeps. |
| Exit | TRN-004 CanvasGridPan (dir right, pull 0.86) to the a3-04 p.34 card, which keeps the card's place on the left. It is not a second match: TRN-015 is never two in a row. |
| Eye out | The READ line, at about (557, 513). The p.34 card's first highlight, ORANGE & YELLOW, is at about (477-796, 154) and is reached by the slide. |
| Sound | SFX-024 at the match (above). The highlights are silent. |

Asset: `dalton1798_p28.jpg` has a sliver of the cropped library stamp (blue) along the bottom edge at about x 1130-1355, y 1875-1890. The crop above stops at y 1120, so it is out of frame. A's page cut-out must also leave it out (it goes off frame anyway).

---

## B_leaf_and_wax

**The idea:** the two things lift off the page beside the sentence that names them. The page is the world, because the comparison exists only as his written words.

| Field | What it says |
|---|---|
| Line | a3-05 "Here's one. The face of a laurel leaf, he says, is a good match to a stick of red sealing-wax. That's the wax people once used to seal letters." a3-06 "Think about that. A green leaf, and a red stick of wax. To you, about as different as two colours get. To him, a match." |
| Subject | a3-05: his sentence, then the leaf, then the wax. a3-06: the two things, ending as one colour. |
| World and why | SRC-002, Dalton 1798 p.34, framed on the laurel sentence. **Same idea:** the exact words that make the comparison. The things come off the page that names them. `why: "Same idea: the sentence on p.34 where Dalton matches the laurel leaf to red sealing-wax; the two things lift off the page that names them."` |
| Period honesty | A period page with world label `JOHN DALTON · 1798 · P. 34`. The two cut-outs are modern photos. The LayerStage `caption` (bottom-left, static) reads `PHOTOS TODAY · CHERRY LAUREL, RUNIC EARTH · WAX SEAL, PETRIK` (credit wording per register). The wax carries the state label `A WAX SEAL · TODAY` (coordinator item 5: the picture must not be called a stick). The olive is labelled `SIMULATION · ONE WAY` / `HE MAY HAVE SEEN THEM` (rule 19). |
| Entry | A push (TRN-006) from the p.34 card's last highlight, the laurel line. With the a3-04 crop below, that is at about **[620, 598]**; measure it on the a3-04 still (DIRECTOR_NOTES, act 2 14+15). The world opens with the same line at frame (605-1822, 450), so the eye moves about 150 px. The world's highlights H1 and H2 are lit from frame 0, carried over from the card. |
| Path and landing | **Framing:** `zoom 1.15`, `focus [0.538, 0.4797]` (s = 1.242). The frame shows image px x 260-1806, y 973-1842. The left page margin (image x 260-750) becomes a clear paper column at frame x 0-605. The text column is at x 605-1822. The GREEN heading is at the top (y about 141), which tells the viewer which part of the list this is. **Sentence (world highlights, image px):** H1 `[1645, 1252, 80, 50]` "The"; H2 `[745, 1308, 980, 54]` "face of a laurel-leaf (*Prunus Lauro-cerasus*) is a good" (frame y about 417-484); H3 `[745, 1366, 690, 54]` "match to a stick of red sealing-wax" (frame y about 489-556, ending at x 1447, before the semicolon). H3 lands on "match". **Leaf** (`laurel_runicearth_leaf_cutout.png`, [800, 700], `w 300`, h 263) rises on "leaf" ("laurel leaf") and lands at **(330, 360)**: x 180-480, y 229-491, top 21% of the frame, 125 px from the text column. **Wax** (`sealingwax_petrik_cutout.png`, [438, 497], `w 200`, h 227) rises on "sealing" and lands at **(330, 690)**: x 230-430, y 577-804. The pair brackets the sentence in height, with the leaf above its line and the wax below its line, and both face right towards their words. |
| Scale | None. Both things become smaller in C, where they are part of a bigger picture (rule 7). |
| Action | **One state change, for both at once, on "match" ("To him, a match"):** `color: "#574F18"`. That is the coordinator's target olive from the Machado deuteranope simulation of these two cut-outs (leaf #4F492A, wax #5F5405). It is not hand-picked. The leaf's and the wax's own colours stay untouched before that. The wax's earlier state label `A WAX SEAL · TODAY` (state on "seal letters", under the wax at y 826-864, x about 158-502) un-wipes automatically when the olive state starts. The SIMULATION label (world `labels`, x 120, y 830 and 868, size 22, left-aligned, x 120-470) comes in 0.45 s after "match", so the two never overlap. |
| Exit | Labels first. The SIMULATION label `untilSec` and the caption `captionUntilSec` start about 0.6 s before the cut. Then TRN-004 CanvasGridPan (dir down, pull 0.86) to the SpectrumStrip. The things do not move out. |
| Eye out | The olive pair at x 330 (y 360 and 690), with the label under them. The SpectrumStrip's title starts at x 210, y 250, and its strip at x 210, y 470: within 25% of the pair. |
| Sound | SFX-020 low whoosh (-21.6 dB) in the pause before "Here's one" for the push. The house soft pop (-24 dB) plays on each settle frame: the leaf's falls in the comma pause after "laurel leaf," and the wax's in the full stop after "sealing-wax.". The olive state and the labels are silent. |

**LayerStage choices**
- `worlds[0]`: `{ atSec: 0, srcId: "SRC-002", kind: "image", size: [1920, 2934], zoom: 1.15, focus: [0.538, 0.4797], light: "paper"` (or `"none"`)`, haze: 0.08, blur: 2, rackSec: <"Think" (a3-06)>, lightFrom: "top-left", label: "JOHN DALTON · 1798 · P. 34", highlights: [H1, H2, H3], why: ... }`.
- **Rack at "Think about that"**, not earlier. Through a3-05 the printed sentence is the subject and must stay sharp (rule 14). From a3-06 the subject is the two things, so the page softens to 2 px and the highlights soften with it.
- **The on-screen quote is the page's own printed sentence**, highlighted and readable (x-height about 27 px at this scale). It is exact by definition, and it carries the print's italics. The highlight stops before the semicolon, which does the ellipsis's job. I recommend **no typed duplicate** in this shot: there is no open space for one, and two copies of one sentence would compete (rule 2). If the fact-check insists on typed text, the only clean place is a chip strip at the top, `"The face of a laurel-leaf (Prunus Lauro-cerasus) is a good match to a stick of red sealing-wax…"`. That would be serif 34 px with the Latin in italics, x 160-1760, y 110-160, on from "Here's one" until "Think". It would sit over the grass lines, not over the laurel sentence, with 70 px above the leaf.
- **lightFrom "top-left", read from the pictures.** The page scan is evenly lit (copy stand), so it decides nothing. The seal photo is lit from the top-left: its upper-left rim is bright and its shadow sits lower right. The leaf is backlit (Asset 4). "top-left" agrees with the seal, with the house convention, and with shot A. The shadows fall down and right, a few px towards the text column, and are never thrown onto the highlighted lines (the things are 125 px clear).
- **Lifted, not resting** (`rest` false, `enter: "rise"`, 140 px, 0.9 s). The plan says they "come off p.34", and lifted things may parallax. Resting things would slide over the words.
- **Camera:** `{ pan: -40, push: 0.03 }`. The camera drifts right, towards the sentence, so the things keep their lead room. The far plane moves -14 px and the right edge then shows image x about 1817, still paper (the page edge and gutter start at about 1860). No tearing.
- **Where text sits:** all our text is in the paper margin (x 120-502), 100+ px from the text column. Nothing sits on the page's text.
- **What the moves uncover:** the rises cover only margin paper. The un-wiping wax label reveals margin paper. There is a small foxing spot at image px about (506, 1342), frame about (318, 457), under the leaf. It is period paper and fine either way.
- **Rule 4:** the world's subject is the sentence at frame y 345-556, x 605-1822. Nothing lands on it. The plan said the things land "on their words", which would break rule 4, so this brief changes it to **beside** their words.
- **Rule 16:** passes. The page's text lines are horizontal and stay in the far plane. The text column's left edge (x 605) is a vertical line that no cut-out touches or continues. The leaf's straight bottom edge (Asset 4) is not parallel to any page line.
- **Rule 13:** far = the page (print, paper grain, show-through); near = the two things. There is no mid plane. As in A, the page's own grain and type give it texture.
- **Stillness:** the push, H3 ("match"), the leaf ("leaf"), the wax ("sealing"), the wax label ("seal letters"), the rack ("Think"), the olive ("match") and the SIMULATION label. The longest gap is "A green leaf, and a red stick of wax. To you, about as different as two colours get." (about 4.5 s), which goes over the 3.5 s limit. The camera moves throughout. If the frame review finds it still, add a `TO YOU` label on "To you" in the margin at (120, 830), un-wiping on "To him". Do not add a colour change there.

---

## D_into_the_eye (cut on the hit into the cross-section)

| Field | What it says |
|---|---|
| Line | a3-08 "Then he does what a scientist should. He offers an explanation." a3-09 "Your eye isn't hollow ... Light passes through it on its way to the back of the eye." a3-10 to "It's tinted." |
| Subject | The eye, then the jelly, then the jelly tinted. |
| World and why | None. This is a drawn diagram (VIS-019 section) on the theme canvas. It is plainly a diagram, so it needs no tag until the tint (below). |
| Period honesty | While the jelly is blue, the corner tag reads `DALTON'S GUESS` (fact-check 7). The lens is drawn as a separate part, which the component already does. |
| Entry | The SpectrumStrip holds through "Then he does what a scientist should." under the swell. The cut is on the swell's hit, at "He offers", and the cross-section draws in (0.9 s) on "explanation". The eye's centre (960, 540) is the strips' centre (960, about 518), so the eye does not move. The beam starts at x 210, the strip's own left end, so the light in the strip becomes the light going in. |
| Path and landing | `parts`: `VITREOUS HUMOUR` at (1000, 480) on "vitreous humour". `beat` (the beam) draws on "Light passes" (drawSec 1.4), from x 210 to x 1280 along y 540. Tint: `{ part: "vitreous", color: "#3D6BD6", opacity: 0.5, atSec: <"tinted"> }`. That is act 1's lens tint colour (29+30+31 `inside.tint`), the callback. The tag `{ at: "corner", parts: [{ text: "DALTON'S GUESS", atSec: <"tinted"> }] }` arrives with it. |
| Scale | The component drift only. |
| Action | The label, the beam, then the tint. |
| Exit | TRN-002 DraftingWipe on "In his words" (angle 8, dir right; the page sound leads 0.5 s), to the p.43 card. The tint `atSec` goes on "It's", so the 1.2 s tint is complete before the wipe starts. See the transition review, row 7. |
| Eye out | The tinted jelly at (960, 540). The p.43 card's first highlight, "probably some modi-", lands at about (634-956, 245). That is a jump of about 500 px, carried by a hard cut onto a page. It is accepted, because the card is the same left-card layout the viewer already knows from a3-04. |
| Sound | The swell-to-hit lands on the cut. The beam is silent, and the bed thins under it. |

Check: `VITREOUS HUMOUR` (secondary ink) sits on the 50% blue once the tint is in. Check its contrast on the still. If it fails, set the label `atSec` so it is read before the tint, and let the tint pass under it.

## (card) a3-10 from "In his words", and a3-12: p.43

One line. Entered by the DraftingWipe (row 7) into ArchivalScanCard SRC-003, `side: "left"`, crop `[180, 900, 1080, 1040]`. Highlights in image px: `[805, 1048, 405, 46]` "probably some modi-" and `[250, 1098, 315, 46]` "fication of blue." on "probably". `[590, 1098, 465, 46]` "I suppose it must be the", `[1055, 1098, 155, 46]` "vitreous" (its own box, for row 10's morph) and `[250, 1148, 180, 48]` "humour;" on "supposes". The quote column has "probably some modification of blue", in near-silence (plan). a3-12 is a SlideAcross (row 9) back to **the same card, landing in the same place**, with the earlier highlights already lit, adding `[435, 1148, 775, 48]` "otherwise I apprehend it might be disco-" on "Otherwise" and `[250, 1203, 875, 48]` "vered by inspection, which has not been done." on "has not been done". The eye starts on the left card and ends on the bottom highlight, about (540, 385).

---

## C_carry_into_eye

**The idea:** the leaf and the wax come back, in their own colours, out where the light comes from. The light from them crosses the blue jelly, and under his guess both go duller, darker and closer together. Nothing turns olive here: the olive is the modern model, kept to B (fact-check 8).

| Field | What it says |
|---|---|
| Line | a3-11 "It makes sense. Think of looking at the world through blue glass. In Dalton's version, the tinted jelly soaks up much of the red and the green light before it reaches the back of the eye. Reds and greens would both look duller, and more like each other. And a red stick of wax might end up looking like a leaf." |
| Subject | The beam losing its red and green in the jelly, then the two things it comes from. |
| World and why | D's cross-section, returned to in the same place, already tinted (tint `atSec` at -1.2 s, so it is full from the first frame). **The idea itself:** his guess, drawn. The cut-outs are B's two things. **Same things:** the example he gave, put through his own explanation. |
| Period honesty | The tag `DALTON'S GUESS` is in the corner throughout (fact-check 7 and 8). The cut-outs keep their B identity, with no caption repeated; the episode description credits them. The result label reads `HIS IDEA:` / `DULLER, AND MORE ALIKE`, which marks the picture as his model and not a record (rule 19). |
| Entry | TRN-005 InkBleed from p.43 on "It makes sense.", with the drop at [894, 303] on the highlighted word "vitreous". That point is inside the jelly in this framing, so his word spreads into his blue jelly (row 8). It opens on the identical framing of D. **The things rise (`enter: "rise"`) on the full stop after "back of the eye."** They settle in that pause and are in place for "Reds and greens". They come up on the **left**, the side the light comes from in the diagram (rule 5). B also left them on the left, so the viewer finds them where they were. |
| Path and landing | **Rays** (VIS-021): `{ colors: [red, green, blue], speed ..., atSec: <"In Dalton's version"> }` from x 210 to x 1280 on y 540. On "soaks up", red and green dots fade to about 30% between path u 0.55 and 0.75, which is the jelly's front edge past the lens at about x 800 (Builder 5). Blue passes. Red **and** green both thin (fact-check 7). **Leaf** w 180 (h 158) lands at **(300, 380)**, x 210-390. **Wax** w 140 (h 159) lands at **(300, 700)**, x 230-370. The beam starts between them at (210, 540), so the light reads as coming from them. Both are 170+ px clear of the cornea (x 560) and clear of the `VITREOUS HUMOUR` label. |
| Scale | Smaller than in B (300 → 180, 200 → 140). They are now part of a bigger picture: the eye, the beam and the guess (rule 7). |
| Action | **One state and one move, together, on "duller":** state `{ color: "#3D6BD6", blend: "multiply" }` (Builder 6). That is the jelly's own blue, laid over the things as blue glass would be. On the measured colours, the leaf (57, 84, 41) goes to about (14, 35, 34) and the wax (152, 19, 21) to about (36, 8, 18): both darker, both duller, far closer in brightness, and not the same colour. Moves: the leaf to (300, 440) and the wax to (300, 645), `sec 1.0`, `why: "Closer together as his blue jelly makes them more alike; still two things, not one colour."` The gap between them stays about 45 px, with the beam running through it. The result label lands 0.5 s after "alike" (x 120, y 790 and 830, size 22, left-aligned, x 120-483, outside the eye circle). Nothing new happens on "looking like a leaf". The line pays off a picture that is already there. |
| Exit | The label un-wipes about 0.6 s before the transition. A SlideAcross (row 9) on "He has a reason" (a3-12) to the p.43 card. |
| Eye out | The pair at (300, 440-645). The p.43 card is on the left (x 120-1012), and its new highlights land at about (540, 330-385): within 25%. |
| Sound | The house soft pop at -26 dB on the pair's settle, in the pause after "eye.". The rays and the state are silent. The bed stays low, so the a3-12 near-silence lands. |

**Layer choices (not a LayerStage):** the cross-section is a drawn component, not a registered picture, so it cannot be a LayerStage world. The cut-outs are carried in by EyeDiagram's own `carry` (Builder 6), so they use the LayerStage carry code: lifted shadow, `light: "none"` (a flat drawn world, no cast and no wrap), `lightFrom: "top-left"` as in A and B. There is no parallax and no camera move apart from the diagram's drift, so rules 13-15 do not apply. **The cut-outs must sit inside the same drifting layer as the diagram.** If they do not, the beam's start (x 210) slides away from them as the diagram scales (0.02), and the beam is the one line that ties them to the eye (rule 16 in a drawn shot). **Rule 4:** the diagram's subject is the jelly and the beam inside the circle (x 630-1290). The things stay outside the circle, and the label stays below them.

**Change to the plan:** the plan's "drift together" as the olive is out (fact-check 8). The things arrive in their own colours. They darken by his blue-glass idea, multiplied by the jelly's tint, and move a little closer. They stay two colours.

## (cards) a3-12 to a3-14

- **a3-13 "So the only way to check the jelly is to open an eye. And Dalton only has two."** A cut to EyeDiagram `mode: "simple"`, centred (960, 540), where the section's centre was. Entered by the ShapeMorph (row 10). `openKeys`: open 1, then **one close, with no reopen**. Its key sits 0.30 s before the shot's end, so the CutOnAction (row 11) cuts about 0.55 s into the 0.8 s close: the lid is about 85% shut and still moving. Near-silence after "two." (plan). The eye starts and ends at the centre. The section cannot close its lid, which is why the mode changes on the morph.
- **a3-14 Henry p.25 "his strongly expressed wish".** A CutOnAction (row 11, dir down, 90 px) onto a **line strip, not the page card.** It is cut from SRC-007 at image px `[90, 1140, 2110, 135]` (the two lines "of the eye, which was carefully made after Dalton's death, / in conformity with his strongly expressed wish, by his skilful"), laid on a dark ground of the same page blurred (the act 1 27+28 strip pattern), with source tag `WILLIAM HENRY · 1854 · P. 25`. The highlight `[732, 1225, 562, 50]` "his strongly expressed wish" comes on "strongly". Why a strip: an ArchivalScanCard crop is held near square (860 px high), so any crop round the wish line also shows "This theory was not, however, verified by an examination of the eye" (it gives away act 6) and "The vitreous humour was of a pale yellow colour", which contradicts Ransome (fact-check 9). A callout dim leaves both still readable. The eye starts and ends on the highlight, at about (700, 540).

---

## E_dark_room (the act's exit, handing over to act 4)

| Field | What it says |
|---|---|
| Line | a3-15 "But a blue tint only explains colours if we know what colour is. And on that, Dalton leans on one man. A man who died long before Dalton was born." |
| Subject | The question, then the dark room where its answer starts. |
| World and why | PerspectiveGrid room. **Same place as act 1's Newton tease (35+36) and act 4's opening:** the same room, the same shutter, unnamed. `depth 2000, dark 0.7, dolly 0.02, fog 0.15`, with one object: `{ kind: "shutter", at: [-1050, -150, 600], w: 260, h: 360 }`, as in act 1. No hole, no beam and no tag. |
| Period honesty | A drawn room, plainly a diagram. No name is given: the line does not name him either. |
| Entry | First a KineticLine (`align: "left"`): "What is colour?" at x 120, vertically centred (about y 540), landing on "what colour is", with the accent fill on "colour". Then, on "one man", a focus match (TRN-015) into the room. The shutter's screen position is about (280, 370); read it off act 1 v18 at 35+36. That is about 230 px from the question's first word, so the eye moves less than 25% of the frame. |
| Path and landing | The room fades up around the shutter. The dolly (0.02) is the only move, so the shutter sits on the left third with the room's depth to its right as lead room. |
| Scale | The dolly only. |
| Action | None. On "born" the room holds, and the bed alone carries 2-3 s (plan). |
| Exit | Hard cut or fade at act end. **Act 4 opens on this exact framing** and darkens the room on "So he darkens his room", then makes the hole on "small hole" (a4-03). |
| Eye out | The shutter at about (280, 370). Act 4's first change (the hole) is at the same point. |
| Sound | SFX-024 swish for the match in the pause after "colour is.". Then the bed alone. |

**Change to the plan: no door.** "A dark-room door begins to close" is not in any source. Newton darkened his room by closing the window shutter and then made a hole in it (a4-03: "So he darkens his room. He makes a small hole in his window shutter."). A closing door would be an invented image, and it would also take act 4's beat ("darkens") away from it. So act 3 ends on the same room, already dim, with the closed shutter that act 1 introduced and that act 4 will open. This needs no new component work.

---

## Plain cards and pages (one line each)

- **a3-04, p.34 card (SRC-002).** A CanvasGridPan from the p.28 card, keeping `side: "left"`. Crop `[470, 600, 1300, 1290]` (card x 120-987, the ORANGE & YELLOW heading at the top). Highlights in reading order: `ORANGE & YELLOW.` `[1000, 620, 500, 50]` on "lists". `GREEN.` `[1150, 1065, 190, 48]` on "one by one". Then H2 of B `[745, 1308, 980, 54]` on "examples". The eye starts at the top heading and ends on the laurel line at about (620, 598), the point B pushes from. Hold it at least 4 s (plan). There is no "scrolling": the drift is enough, and a scroll would move the line B needs to push from.
- **a3-07, SpectrumStrip x2 (VIS-014).** Top: `OTHERS · DALTON'S SIX` with red, orange, yellow, green, blue, purple. Bottom: `DALTON'S WORDS`, with the red end dim but not black, **one** yellow fading from strong to pale under orange, yellow and green, blue under blue, and a darker blue under purple (fact-check 10). Quote, typed only: "little more than a shade, or defect of light", source `DALTON · 1798 · P. 31` (fact-check 4: p.31, not p.34). Typed counts: "I see only two or at most three distinctions" (no comma after "two"). The eye starts at the strip's left (x 210, which is where B left it) and ends at the strip's centre, where D's eye opens.

---

## Problems found (assets, counts, rules)

**Assets**
1. **SRC-009 is a 1920x1280 crop.** At zoom 1.1 the plan is enlarged by about 1.19x (cover 1.08 x 1.1). That is soft but acceptable, and it matches the Howard plate in Weather. A larger scan of the same sheet (Manchester Digital Collections, PR-R-15369, per the fact-check) would be sharper. Cross Street Chapel, where the Society met in 1794, is not in the crop, so no pin can mark the talk (A, change 1). Not blocking.
2. **p.28 (`dalton1798_p28.jpg`, 1920x1890)** includes the binding and marbled board (x 0-185), the facing-page gutter (x > 1840) and a blue sliver of the cropped stamp at the bottom (x 1130-1355, y 1875-1890), and the page is cut off below "not of-". Shot A needs a **page-only cut-out**, about image px `[190, 0, 1645, 1870]`. Its straight bottom edge is hidden, because the page lands with its bottom off frame. A2's card crop stays above y 1120.
3. **Wax (`sealingwax_petrik_cutout.png`, 438x497):** it is a pressed modern fleur-de-lis seal, not a stick, and it is slightly out of focus. **It is acceptable here** for three reasons. The comparison is of colour, and the seal is the same red wax. The narration's next sentence ("the wax people once used to seal letters") is about exactly this use. And the state label says what it is (`A WAX SEAL · TODAY`), so the printed "a stick of" beside it is not contradicted silently. The quote keeps "stick", and no label or caption calls the picture a stick (coordinator item 5). **A better source is still wanted:** a photo of red sealing-wax **sticks**, ideally a period object from a CC0 museum collection. If one is registered, it replaces the seal and the wax label is dropped. Note also that the cut-out's alpha tops out at 254, not 255. That is harmless, but the builder should know it if a 1-level halo shows at 200%.
4. **Leaf (`laurel_runicearth_leaf_cutout.png`, 800x700):** the species looks right (cherry laurel, finely toothed edge, per the fact-check). Three problems: (a) **it is backlit**, with glowing veins and a translucent body, so it is probably the paler **back** of the leaf. Dalton matched the **face** to the wax and the back to "the lighter red of wafers". (b) Its light (from behind) disagrees with a front-lit page, which is a rule 17 note waiting to happen. (c) **The cut-out has a straight crop edge** along its bottom (alpha bottom at about y 679-687 from x 70 to 300) where the photo cut the leaf off, and the stalk end is missing. On a floating cut-out that edge reads as a torn photo. **Accepted for the first build, because nothing on screen calls it "the face".** A better source is wanted: a whole cherry laurel leaf (tip and stalk), photographed front-lit from above on the glossy upper face. It gets the same treatment, and the colour measurement for the olive must be re-run if it changes.
5. **Henry p.25** shows the spoiler line ("not, however, verified") and the "pale yellow" line next to the wish. Hence the line strip (above) and a derived file `henry1854_p25_wish_line.png` (register it as a file of SRC-007).
6. **p.31** is not local. The prism quote is typed only, credited to p.31 (fact-check 4).

**Count limits (the builder must count on the beat sheet before Gate 2)**
- **SRC-014 and SRC-015 are "max 3 beats per episode" each.** B (a3-05 and a3-06, about 7 beats) and C (a3-11, about 3 beats) already go over, and SRC-014 is also planned for act 5's return. Either Sam raises both limits (proposal: 10 each, for "Dalton's own laurel and wax example and his explanation of it, acts 3 and 5"), or C drops the cut-outs, which would lose the act's payoff picture. The Director recommends raising them.
- **SRC-009 is "max 4 beats per episode".** Shot A runs about 2.5 script lines (roughly 8-9 beats at about 3.7 beats a line), and A2's blurred ground uses it again. Either Sam raises SRC-009 to about 10 for this act's opening, or A2's ground changes from SRC-009 to SRC-029 blurred and A is checked to fit. The Director recommends raising it: it is the only place picture in the act.
- VIS-059: A and B make 2 of the 2 allowed this act. C and E are not LayerStage.
- TRN-015 (focus match): A → A2 and KineticLine → room, never two in a row. TRN-006 (push): p.34 → B. TRN-017 (lens): not used (Henry now comes in on TRN-010). TRN-018: no world changes in A or B. For the full transition counts, see the transition review.
- VIS-019 (max 10 beats per episode): D, C and a3-13 come to about 9-10 beats, and acts 1 and 6 also plan eye beats. Count them, and if needed fold a3-13's blink into fewer beats.

**Rules the plan broke, and the fixes**
- A pin "on 'Manchester'" (rule 6, and the talk was not at any spot in this crop) → no pin. The dateline does the general job, and a ring on the plan's own "Academy" marks the college as the college (A, change 1).
- Things landing "on their words" in B (rule 4) → beside them, in the page margin.
- p.28 highlighted while it is a w 560 cut-out on the plan (it cannot be read, and LayerStage has no carried highlights) → a focus match to the p.28 card (A2).
- The olive inside the eye (fact-check 8, and it would make the modern model look like the effect of his guess) → C uses his blue-glass idea, multiplied by the jelly's blue, and stays two colours.
- A dark-room "door" (not in any source, and it takes act 4's beat) → act 1's shutter room, unchanged, handed to act 4.
- p.34 "slowly scrolling" in a3-04 → held with highlights, so B's push point is fixed.

## Builder notes (what the components do not do yet; each goes through strict stills)
1. **LayerStage `tag`** (DatelineTag props, as EyeDiagram and PeriodMapPlate have), for A's dateline `low-centre` → corner.
2. **LayerStage `worlds[].rings` and `worlds[].pins`** (MapPin and ring specs in image px), drawn **inside the far plane** so they move and scale with the world, but **outside its blur filter**. For A's ring.
3. **LayerStage `worlds[].highlights`** (`{ box: [x, y, w, h] in image px, atSec }`, the ArchivalScanCard highlight look), drawn in the far plane (they blur with the rack, which is wanted). For B. `atSec <= 0` means lit from frame 0.
4. **Optional light key `"paper"`** for a period page or plan world: grade `none`, cast `rgba(255,236,205,0.10)`, shadow `rgba(58,40,20,`, near grade `sepia(0.06) saturate(0.92)`, wrap `#fff3e0` at 0.15. The modern cut-outs then sit in the page's warm light without a saturation jump (rule 17). Fallback `"none"`, then check the jump in the frame review.
5. **RaySpec `absorb`**: `{ atSec, colors: [red, green], from: 0.55, to: 0.75, keep: 0.3 }`. Dots of those colours fade to `keep` alpha between those path fractions. For C.
6. **EyeDiagram `carry`** (export LayerStage's `Carried`), rendered inside the diagram's drift transform, and **CarryState `blend?: "color" | "multiply"`** (default `color`). For C's blue-glass state.
7. **LayerStage `labels` `size`** is already in LabelSpec. Use size 22 for the two-line SIMULATION and result labels.

## Needs registering
- The page-only cut-out of p.28 (Asset 2), as a file of the p.28 source.
- `henry1854_p25_wish_line.png`, a strip of SRC-007 (Asset 5).
- **Proposed, not added** (Director only proposes): (a) a red sealing-wax **stick** photo, CC0 or public domain, preferably a museum object; (b) a whole, front-lit cherry laurel leaf, upper face; (c) optional, a larger scan of Green's 1794 plan that includes Cross Street Chapel, only if Sam wants the talk's place marked. Each goes through the register (row, best use and limit, licence, Drive copy) and the fact-check.
- Count-limit changes for SRC-014, SRC-015 and SRC-009 (above): Sam's decision.

## Checks for the frame review (stills to request)
- **A:** first frame after the slate; "October" (the dateline fully in, low-centre, clear of St Peter's); "New College" + 0.8 s (the ring round the building, "Academy" readable inside it, labels 58 px clear); "Tonight" + 0.6 s (the right side clear); the page's settle (shadow down-right, the bottom edge off frame, no halo at 200%); the last frame before the match.
- **A2:** each highlight landing.
- **B:** frame 0 after the push (H1 and H2 lit where the card had them); the leaf's settle; the wax's settle (the 86 px gap between them, and the leaf's straight edge at 200%); "seal letters" (the wax label clear of the text column); rack end; the olive + 0.8 s (the SIMULATION label clear and the wax label gone); the last frame.
- **C:** the settle (beam start between the pair); "duller" + 1.0 s (both darker, not the same colour, the beam in the gap); the label; the last frame.
- **E:** "colour is" (the question on the left), the match midpoint, and the shutter at about (280, 370) on the last frame, compared side by side with act 4's first frame.

---

## Transition review (23 Nov 2026)

I checked the 13-row map in `ep01-act03_plan.md` ("## Transitions") against this brief, the DIRECTOR rules (5, 6, 10, 12), the register limits and each component's header. Eye trace (TRN-001 / rule 10): the focal point lands within 25% of the screen across the change (about 480 px across, 270 px down), or the move carries it there. Every transition starts on the new beat's first frame, so "on the line" is the new beat's start.

**One finding that affects the build (Episode wiring).** `Episode.tsx` passes every new transition `from={frozenPrev()}`, which is the old shot frozen on its last frame. For draft, canvas, ink and morph that is fine, because the old shots are still at their ends. For **`action` it breaks TRN-010's own rule**: "the movement must be in the old shot (never invented for the cut)". With a frozen old shot, the lid stops dead and only the frame slides down. **Fix (builder):** for `transitionIn: "action"`, feed `from` as the old shot playing its last `leadSec` live, not frozen. That means starting the old shot `leadSec` earlier inside the transition, or ending the old beat `leadSec` later and overlapping. Check it on stills at cut -0.2, -0.1, cut and cut +0.1 s: the lid must visibly move on each.

| # | From -> to | Verdict | Reason | Parameters |
|---|---|---|---|---|
| 1 | slate -> A plan | **keep** | The act opens on music alone. The dateline then appears low-centre (960, 860), under the slate's centre (17% of the width, 30% of the height away, carried by the tag's rise). | LayerStage pIn 0.6 s (A's world). The slate cuts to it (`transitionIn` cut), and the world fades up from canvas. |
| 2 | A -> A2 p.28 card | **keep, change the sound** | A's held page becomes the card in place (focus match at [560, 780] → card centre (568, 540)). TRN-015 needs its swish, SFX-024, in a pause, but the map gives SFX-016. | `focus: [560, 780]`. The page's SFX-016 stays on its settle frame. SFX-024 at about -26 dB 0.25 s into the match, in the same pause before "Its". If that pause is under 0.8 s, drop the settle sound and keep the swish. |
| 3 | A2 p.28 -> p.34 card | **keep** (replaces my "slide") | Two pages of one paper on one sheet. Moving right reads as forward, to the next page (rule 5). Both cards share the left layout, so the card area stays in place on screen. The p.34 heading the eye goes to next (636, 154) is reached after the move, and the first highlight lands later, on "lists". | **dir `"right"`, pull `0.86`**, gap 160 (default), 1.3 s. At 0.86 each card is 1651 px wide with about 134 px of grid each side, which is enough to read as one sheet. That is calmer than the 0.82 default and inside the register's 0.8 floor. SFX-021 air on the glide. |
| 4 | p.34 card -> B | **keep** | The line becomes the shot. | Push `focus [620, 598]` (the laurel line on the card; measure it on the still). SFX-020 whoosh in the pause before "Here's one", and cue 2 enters with it. |
| 5 | B -> SpectrumStrip | **keep** | The next example of his, on the same sheet. Down reads as the next item, not a step in time. I avoided "left", which reads as going back, even though p.31 comes before p.34. It is not two canvas moves in a row (row 4 is a push). B's eye out, the pair at x 330 (y about 520), lands within 25% of the strip's left end (210, 518), because the canvas returns the new card to the same screen place. | **dir `"down"`, pull `0.86`**, gap 160, 1.3 s. B's SIMULATION label and caption must have un-wiped before the pull starts (they leave 0.6 s before the cut, as in B). SFX-021. |
| 6 | SpectrumStrip -> D eye | **keep** | The act's one impact, on the turn. Strip centre (960, 518) → eye centre (960, 540). The beam starts at x 210, the strip's own left end. | Hard cut on "He offers". Riser, hit (SFX-025), cue 3. |
| 7 | D eye -> p.43 card | **keep** | It is the register's best use: from a diagram into a document. The line drafts across in the beam's own direction (left to right), uncovering the card (on the left) first. The jelly (960, 540) → the first highlight, "probably some modi-" (634-956, 245): about 165 px across and 295 px down, and the card is revealed before the jelly is covered, so the eye moves with the line. | **angle `8`**, **dir `"right"`**, 0.8 s. The tint's `atSec` goes on "It's", so the jelly is fully blue before the wipe. SFX-016 page 0.5 s early (J-cut), SFX-017 under the stroke. |
| 8 | p.43 card -> C eye | **keep, with an exact drop point; fix the cue word** | Spreading blue is his idea. The drop goes on the highlighted word "vitreous" on p.43, and the same frame point is inside the vitreous jelly of the D/C cross-section. His word becomes his jelly, and the eye does not move. | **`at: [894, 303]`**, `tint: "#3D6BD6"`, 1.0 s. That is image px (1132, 1120) on p.43 mapped through the card (scale 0.7935, inner origin (138, 128)). In the eye it is 246 px from the centre (r 330), above the `VITREOUS HUMOUR` label (y about 455-485), and right of the lens (x 708-792). C's jelly is already tinted at 0.5, so the ink clears into the same blue. SFX-016 wet spread at -26 dB. The map's line reads "And honestly? It makes sense."; script v2 reads "It makes sense.". Cue the drop on "It". |
| 9 | C -> p.43 sentence card | **keep** (replaces my hard cut) | Into a document. The old shot slides out left and the card comes in and lands on the left again. C's eye out, the pair at (300, 440-645), → the card's lit lines at about (540, 285-385): within 25%. | SlideAcross 0.7 s (no direction prop: out left, in from the right). C's result label must have un-wiped before. Swish. |
| 10 | p.43 -> EyeDiagram simple | **keep, with an exact shape pair; change "outline" to "iris"** | The bar on "vitreous" lifts off and becomes the eye. The simple eye's outline is an almond (two quadratic lids), which a radius rectangle cannot match. The iris is a true circle, and a bar to a circle is the clean morph. Both shapes are real elements (register). The move carries the eye from (894, 303) to (960, 546). | **`fromShape: [832, 285, 123, 37, 3]`**: the "vitreous" highlight box [1055, 1098, 155, 46] on p.43 in the card. This needs "vitreous" to be its own highlight (done above, in the p.43 card line). **`toShape: [848, 434, 224, 224, 112]`**: the iris (simple mode's svg 760x370 centred at left 580, top 355; iris cx 380, cy 171 + 20 viewBox offset, r 112). 0.75 s, soft pop on the landing. 1 of the 2 allowed per act. |
| 11 | EyeDiagram simple -> Henry strip | **keep, after the wiring fix above; the blink becomes a single close** | Does the blink exist? **The component can do it.** EyeDiagram simple mode closes the lid downward through `openKeys` (each change takes 0.8 s, and the upper lid drops to meet the lower). **No act 3 file exists yet, so there is no built blink to check.** The cut must land mid-movement, so a3-13 gets one close and no reopen: the eye shuts on the pause after "two.", and the next line is about his death. The iris (960, 546) → the strip's highlight, "his strongly expressed wish", at about (666-1066, 552): within 25%. The strip arrives already moving down the same way. | **dir `"down"`, px `90`** (the limit is 120), leadSec 0.25, settleSec 0.45. Simple-mode `openKeys`: `{ atSec: <shot end - 0.30>, open: 0 }`, so the cut falls about 0.55 s into the close, with the lid about 85% shut. Cue 4 enters in the same pause. 1 of the 3 allowed per act. |
| 12 | Henry strip -> WHAT IS COLOUR? | **keep** | A turn to the new question, on a pause (TRN-011 best use). The strip's highlight (866, 552) → the question at x 120, vertically centred (about y 540). The text's centre is about 470 px left, so it sits just inside 25%. | `tone: "dark"`, **dir `"up"`** (as act 2's band), 0.75 s. SFX-024. |
| 13 | WHAT IS COLOUR? -> dark room | **keep** | Act 4 opens from this framing. It is not two matches in a row (row 12 is a band). | `focus: [280, 370]` (the shutter; measure it on act 1 v18 35+36). SFX-024, then cue 4 alone. |

**Counts:** TRN-004 2 of 4 per act, not in a row. TRN-015 2 (rows 2 and 13) of at most 4 (1 in 3 of 12 changes), not in a row. TRN-002 1 of 4 per episode. TRN-005 1 of 2 per episode. TRN-009 1 of 2 per act. TRN-010 1 of 3 per act. TRN-007, TRN-011 and TRN-006 1 each. Only row 6 is a hard cut. TRN-017 is no longer used in act 3.

**Not used (agree):** TRN-003 PhotoToCard. Its move goes from a full frame into a slot, which is the wrong direction for row 2, where we go into the page. TRN-014 StaticBurst: no TV-era material, and act 3 is calm. TRN-016 FlashMontage: cold opens only.

**This review changed earlier sections of this brief** to match: D's exit (draft), the p.43 card's entry, its highlight split and its a3-12 return (slide), C's entry (ink) and exit (slide), a3-13 (one close, no reopen), a3-14 (action, not lens), A2's and B's exits (canvas), and E's question position (vertically centred, not y 385).
