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

---

## Added layer shots (24 Nov 2026)

Written 24 Nov 2026, after Sam approved three more layered moments ("Try doing all 3"; VIS-059 is now max 4 per act). The narration is recorded, so times here are **act seconds** (take time + 2.4 s, from `gate1_act3/03_talk_final_words.json`), and beat numbers are the rows of `gate1_act3/act3_rows.json`. The builder turns them into shot-relative times (A starts at 2.40, S at 74.50, H at 183.82). The wording follows the coordinator's fact-check of 24 Nov: the chapel labels, Turner after Lonsdale, W. C. HENRY, no "the biographer", the prism's paper backdrop, and the album-cover warning.

Pictures I looked at and measured: `crossstreetchapel_1835.jpg` (800x564), `prism_evies.jpg` (1920x1282), `dalton_turner1834.jpg` (996x1230, greyscale; the print itself, not the halftone or trace forms), and `henry1854_p25.jpg` (the wish lines, measured by ink profile). Image px are pixels of the named file. All other positions are frame px. World geometry: LayerStage's cover scale is s = max(1920/w, 1080/h) x 1.08 x zoom, so an image point (x, y) sits at (960 + (x - fx·w)·s, 540 + (y - fy·h)·s) before the camera. Frame positions given for carried things **include the camera** (near plane: 960 + (at + pan·prog - 960)·push).

| Shot | Beats | Lines | Component | Transition in | Transition out |
|---|---|---|---|---|---|
| A_worldswap_chapel | 10-12 (inside A) | a3-03, first sentence | LayerStage A, second world | TRN-018 WorldSwap (dissolve) on "Literary" | TRN-015 into A2 (unchanged in kind) |
| S_prism_world | 29-38 | a3-07 and a3-08's first sentence | LayerStage + VIS-014 x2 | TRN-004 canvas glide (down) from B | the act's one hard cut, on the hit at 102.10, into D |
| H_wish_over_portrait | 69-72 | a3-14 | LayerStage | TRN-010 CutOnAction from the closing lid | TRN-011 paper band (up) into WHAT IS COLOUR? |

### A_worldswap_chapel (inside shot A)

**The idea:** the plan of the town gives way to the building in it where the Society met, and the paper rises in front of that building.

| Field | What it says |
|---|---|
| Line | a3-03, first sentence: "Tonight (24.01), he stands up in front of the town's Literary (26.29) and Philosophical (26.89) Society (27.43) and reads (28.35) out a paper (28.95)." A ends at the match into A2 (beat 13, 29.70). |
| Subject | 23.35-26.29: the plan, now cleared. From 26.29: the chapel, the building of the talk. From 28.95: the page. |
| World and why | World 2 is SRC-044, Cross Street Chapel as it looked in 1835. **Same place, same night.** `why: "Same place, same night: in 1794 the Literary and Philosophical Society met in a room at Cross Street Chapel; this is that building (the 1737 rebuilding, unchanged until 1856), drawn as it looked in 1835."` The plan was the town. The chapel is the building in it. |
| Period honesty | A period drawing, but of 1835, not 1794. The labels say so (coordinator wording): `CROSS STREET CHAPEL · AS IN 1835` and `THE SOCIETY MET IN A ROOM HERE UNTIL 1799`. No label says the drawing shows 1794. The 1794 dateline leaves as the chapel arrives, so 1794 and 1835 are never on screen together beside one picture. The date comes back on the page itself in A2 (READ OCT. 31ST, 1794, on "first paper"). |
| Entry | TRN-018 `change: "dissolve"`, `sec 1.2`, from 26.29 to 27.49. Why a dissolve: going from a plan to the building in it is the same place seen closer, not a journey. A pan would claim a direction (the chapel lies north of this crop, and LayerStage pans only sideways). A wipe would read as a page change. The camera move carries on through the swap. It is near its end by then (far plane at -13.4 px and x1.0144), so the chapel barely moves. |
| Path and landing | **Framing:** `zoom 1.0`, `focus [0.47, 0.5]`. Zoom 1.0 is the minimum: with the cover factor, that is already 2.59x of the 800 px file, so the register's 1.05 is a ceiling we stay under. With the far transform at the swap, the chapel sits as follows. Cornice: y 252. Door surround (pediment and columns): x 725-1000, y 523-934. Door: x 783-913, y 669-857. Lower-left window: x 483-601, y 652-776. Railings: y 732-918. Cart: x 990-1360, y 864-1100. Cloud: x 1140-1430, y 82-250. Chimney pot on the cornice: x 392-431, y 226-252. **Labels** are LabelSpecs, not the world label, because the house world-label spot (bottom-right) falls on the cart and the donkey. `CROSS STREET CHAPEL · AS IN 1835` at (120, 84), size 22, atSec 27.2, once the chapel is more than 80% in. `THE SOCIETY MET IN A ROOM HERE UNTIL 1799` at (120, 133), size 22, on "Society" (27.43). Both are left-aligned in the open sky (about x 120-520 and 120-771, bottoms about 125 and 174), about 50 px above the chimney pot and 75 px above the cornice. It is the corner the dateline used, so the place tag takes the date's place. **Page:** `w 500` (was 560). It rises on "paper" (28.95), `at [464, 1106]`. At its settle (camera -39.9 px, x1.0299) it sits at frame x 150-665, top 831, with its bottom off frame (1414). About 249 px of the page show: its top 43%, the title block (EXTRAORDINARY FACTS at about y 895-955). It covers the left railings, the pavement and the woman in the street (x 339-405, y 1000 and below). It covers none of the facade's door or windows: it is 60 px left of the door surround and 55 px below the lower-left window's sill. Why w 500: at 560 the page can only keep 60 px from the door if its left edge sits at x 89, cramped against the frame edge (rule 8). Its lead room faces right, towards the door. |
| Scale | None. The page grows in A2: we go into it. |
| Action | The dissolve, the two labels, then the page lands lifted with its shadow falling down and to the right. That agrees with the drawing, whose light comes from the left (the window reveals and the cart throw their shade to the right), and with the plan, the house convention and B. |
| Exit | **Tags first:** both labels get `untilSec 29.25` (after "paper.") and are gone by about 29.7. **The page does not leave:** the TRN-015 focus match at 29.70 opens A2, now with `focus [408, 908]`, the page's title (was [560, 780]). |
| Eye out | The page's title at (408, 908) → A2's first highlight, EXTRAORDINARY FACTS (about x 270-840, y 180-220). The match is a push from the title point (rule 10's second case), and the card's title is the same words. |
| Sound | The swap is silent: it falls mid-sentence with no pause, and the bed carries it. SFX-016 `paper_move` at -24 dB on the page's settle (about 29.65, in the pause after "paper.") and SFX-024 for the match in the pause before "Its": both unchanged. |

**LayerStage choices (world 2)**
- `worlds[1]`: `{ atSec: <26.29>, srcId: "SRC-044", kind: "image", size: [800, 564], zoom: 1.0, focus: [0.47, 0.5], change: "dissolve", sec: 1.2, light: "paper"` (Builder 4; fall back to `"none"`)`, haze: 0.12, blur: 1.8, rackSec: <28.95>, lightFrom: "top-left", why: ... }`. It has no `label`: the two LabelSpecs do that job.
- **World 1 (the plan) loses its `rackSec`.** The page no longer sits on the plan, so the plan stays sharp (haze 0.06) until it dissolves.
- **Haze 0.12**, twice the plan's. The low-resolution drawing, enlarged 2.6x, reads as a softer, flatter far plane, and the haze hides its JPEG steps a little. There is no blur while the chapel is the subject ("Literary" to "paper"). The 1.8 px blur racks in with the page (rule 14). If the 200% still shows block steps, a static `blur: 0.8` with no rack is allowed: that removes the blocks and does not read as out of focus. A larger scan is wanted (see Needs registering).
- **Focus:** at zoom 1.0 the file is limited by its width, so fx can only run from 0.463 to 0.537 and the building is centred whatever we pick. fx 0.47 puts the door just left of centre and keeps the left edge at -28 px (with the camera), off frame. fy 0.5 keeps a band of sky for the labels. fy 0.62 would leave only 16 px of sky and force the tag onto the cart and the donkey.
- **Rule 4:** the world's subject is the facade: the door surround, the Venetian window and the four windows. The page stays low and to the left of them, and the labels stay in the sky. The cart, the woman and the donkey are street detail, and only the woman goes under the page.
- **Rule 16:** the page's top edge (831) is horizontal, and so are the railings (732 and 918). It is 85+ px from both, so no edge of ours lines up with a line of the drawing. The page's right edge (665) is 60 px from the nearest vertical, the door surround's column (725).
- **Rule 13:** far = the drawing (its hatching, sky and street); near = the page. There is no mid plane, as before.
- **Rule 12:** one world change in the shot, with nothing carried during it. The page comes 2.66 s after the swap starts.
- **Stillness:** 24.01 and 24.31 (un-wipes), 26.29 (swap), 27.2, 27.43, 28.95, 29.25. No gap is over 2 s.

**Re-check of the earlier A choices**
1. **The ring and labels un-wiping on "Tonight"** (24.01; NEW COLLEGE and the ring at 24.31): kept. They are gone by about 25.2, 1.1 s before the swap, so nothing we drew on the plan is still there when it dissolves. The ring is drawn inside the plan's plane (Builder 2) and would otherwise dissolve with it.
2. **The dateline's `untilSec`:** moved from "title" (30.36) to **"Literary" (26.29)**. It un-wipes over about 26.45-26.95, together with the plan's own label (which un-wipes as the chapel reaches 40%), and it is gone 0.25 s before CROSS STREET CHAPEL lands in the same corner. Why: three dates (1794, 1835 and 1799) beside one picture are too many, and they invite reading the drawing as 1794. SRC-009's rule "always with a dateline tag" still holds while the plan is the picture. And the date returns on the page in A2.
3. **The page landing:** moved from (560, 780) at w 560 to `at [464, 1106]` at w 500 (frame x 150-665, top 831), as set out above. Note that the old figures left out the camera: at 29.7 the near plane sits at -40 px and x1.03, so (560, 780) would actually have rendered at about (536, 787).
4. **The camera** `{ pan: -40, push: 0.03 }`: kept. Its last few px carry towards the door.
5. **The match into A2:** unchanged in kind (TRN-015, 0.65 s, SFX-024). Only `focus` follows the page, to [408, 908].

**A2's blurred ground (beats 13-16) becomes the chapel:** `ground: { kind: "blur", srcId: "SRC-044", size: [800, 564], focus: [0.47, 0.5] }`. Why: the match blurs A's world as the card arrives. If the ground is the same chapel blurred (LOK-028: 38 px, brightness 0.42), the grey-white drawing simply goes soft behind the paper: a focus pull, with no second picture. The plan would bring the brown town back under the dissolve, a hidden second world change that would also read as going back. **Cost:** SRC-044 then takes 6 beats (11-16) against its limit of 4, which is Sam's decision: raise it to 6. If he does not, the order of fallbacks is: p.28 itself blurred (SRC-042, no extra beats, and it keeps LOK-028's "same source as the card in front"), then the approved plan ground (SRC-009, 14 of 16). Note that the chapel and the plan both break LOK-028's same-source rule, as the approved plan ground already did.

**Beat rows (A)**

| Beat | What changes |
|---|---|
| 10 | Notes: add "all gone by about 25.2, before the swap". |
| 11 | Transition: TRN-001 in, plus **TRN-018 inside the beat at 26.29**. Source: SRC-009, **SRC-044**. New: "Yes: SRC-044 Planned → Active; TRN-018 1 of 3". Notes: "WorldSwap (TRN-018, dissolve 1.2 s) from the plan to Cross Street Chapel as in 1835 on 'Literary' (26.29); the dateline (untilSec 26.29) and the plan's label un-wipe with it; CROSS STREET CHAPEL · AS IN 1835 at (120, 84), size 22, at 27.2." |
| 12 | Text: TXT-010 (TXT-011 drops). Source: **SRC-044**, SRC-042 (SRC-009 drops). Notes: "THE SOCIETY MET IN A ROOM HERE UNTIL 1799 at (120, 133) on 'Society'. Page (w 500) rises on 'paper' and lands lifted at frame x 150-665, top 831 (at [464, 1106]), its bottom off frame, clear of the door and the windows; blur racks in on the chapel (1.8 px); paper SFX-016 at -24 dB on its settle; both labels un-wipe at 29.25." |
| 13 | Text: drop TXT-011. Source: SRC-042, **SRC-044** (was SRC-009). New: "SRC-044 limit raise 4 → 6 (A2's ground)". Notes: focus match `focus [408, 908]`; ground = the chapel blurred; delete "the dateline un-wipes on 'title'". |
| 14-16 | Source: SRC-042, SRC-044. |

### S_prism_world (beats 29-38)

**The idea:** a prism today throws its colours on a paper backdrop, and the band others see and the band Dalton describes are laid in front of it. When the line turns from the prism to his words, the photo goes dim and soft. Before his explanation, it is gone.

| Field | What it says |
|---|---|
| Line | a3-07: "He describes (74.74) the band of colours from a prism, too. A prism (78.23) is a triangular (78.97) piece of glass that throws (80.29) colours on a wall. The part that others (82.93) call red, he writes, looks to him 'little (85.69) more than a shade, or defect of light'. Almost (89.03) no light at all. Where others see six colours, he sees two (93.47), or at most three. Yellow (95.43) and blue (96.05). Or yellow, blue and purple (98.53)." a3-08, first sentence: "Then (100.17) he does what a scientist should." Shot 74.50-102.10. |
| Subject | 74.5-82.9: the prism and its band (the world, then the top strip). From 82.93: Dalton's words (the lower track, the quote, the count). 101.37-102.10: the strips alone. |
| World and why | SRC-043: a glass prism today, throwing overlapping patches of colour onto a paper backdrop. **Same idea:** the line explains what a prism is and what it does. `why: "Same idea: the line explains what a prism is ('a triangular piece of glass that throws colours'); a glass prism today doing it, behind the band others see and the band Dalton describes."` A generic photo is allowed here because the line is about that thing (rule 1). |
| Period honesty | World label `PHOTO TODAY · A GLASS PRISM · EVIE S. / UNSPLASH`, bottom-right, at about x 1132-1800 over the dark surface. Use `today: false`: the `today` key prints "TODAY · ...", and the register asks for PHOTO TODAY. The indefinite "A GLASS PRISM" and the modern look say it is nobody's own prism. No name sits near it. It is dimmed when his words begin (82.93) and gone (101.37) before his explanation and before act 4's Newton, who gets his own plates. **Coordinator's album-cover warning:** no white beam goes into the triangle and nothing fans out of it. The strips are horizontal bars that draw from x 210 at the left, never out of the prism. D's beam appears only after the photo has gone, on the canvas. |
| Entry | TRN-004 canvas glide (down, pull 0.86) from B, unchanged. The photo arrives as the next card on the sheet, already in place (`startSec: -1`, so LayerStage's pIn fade does not run inside the glide). On arrival the frame holds only the photo and its tag, so the glide lands the eye on the prism (top centre). The track label `OTHERS · DALTON'S SIX` (210, 408), size 22, comes on "describes" (74.74) and brings the eye back to the strip's start (210, 518), where B left it (the pair at x 330). |
| Path and landing | **Framing:** `zoom 1.1`, `focus [0.5, 0.642]` (s 1.188). The prism sits top centre: apex (853, 132), top-right corner (1085, 115) (10.6% headroom), front base corners (639, 519) and (1079, 519), back-bottom corner (1310, 501). The photo's blue patch lies behind the apex (y 60-230). The green-to-red patch lies round the base (x 170-1280, y 320-670), magenta on the right (x 1305-1600, y 490-610) and the lower-right patch at x 1125-1840, y 630-905. **The top strip** (VIS-014: x 210-1710, y 470-566) draws left to right on "triangular" (78.97, over 1.4 s) and is complete on "throws colours" (80.37), so the band is complete as it is "thrown". It passes over the prism's base: the base line (519) and the back corner (501) sit inside the strip, 30-50 px from both of its edges, so no edge of ours lies on a line of the prism (rule 16). From 78.23 to 78.97 the whole prism shows, on "A prism is a triangular". **The lower track** (y 598-694, an opaque panel while empty) comes on "others" (82.93), with `DALTON'S WORDS` (210, 714), size 22, under it. **The quote** `little more than a shade, or defect of light` (serif italic 40, x 210, y 790) types on "little" (85.69), with its source tag `DALTON · 1798 · P. 31` (210, 856, mono 20). The quote sits under the red end, beside it as the row asks. The red end fills dim on "Almost" (89.03). The quote un-wipes at 92.9, and the count `I see only two or at most three distinctions` types in the same place on "two" (93.47). The tag holds if the fact-check confirms the count is on p.31; otherwise the tag changes with the line. Then yellow on "Yellow" (95.43), blue on "blue" (96.05) and the darker blue on "purple" (98.53). All our text ends by y 890, and the world label sits at about y 980-1014. |
| Scale | The push only. |
| Action | Two world actions, each on the word that turns the line: the rack and dim on "others" (82.93), and the rack-out on "Then" (100.17). |
| Exit | **Tags first:** the world label un-wipes from 100.17. The world then fades to the theme canvas over 1.2 s (to 101.37), its blur rising from 3 to 4 px. The strips, the track labels and the count hold. That leaves 0.73 s of strips alone on the canvas under the riser's peak, then the act's one hard cut, on the hit at 102.10, into D. |
| Eye out | The strips' centre (960, 518) → the eye's centre (960, 540). The strip's left end → the beam's start at x 210. |
| Sound | Nothing new. The glide stays silent under cue 2 (row 29), and the rack and the rack-out are silent. Cue 2 drops out after "purple.", the riser builds under beat 38, and the hit lands on the cut: all unchanged. |

**Decision: the world racks out before the cut.** (1) The cut goes from canvas to canvas, so the match the act depends on (the strips' centre onto the eye's centre, the strip's left end onto the beam's start) reads as one drawing becoming another. Cut from a full-colour photo, the diagram's first frame would read as a new place. (2) The riser needs the frame to empty with it. Clearing the world under "Then he does what a scientist should" is the pull-back before the hit: the break before the impact, as in the Harris sound study. (3) A present-day photo stays out of his explanation and never shares a cut with DALTON'S GUESS. (4) Beat 38 is the one beat with no prism in its line (the register: not for a line with no prism).

**LayerStage choices**
- `worlds[0]`: `{ atSec: 0, srcId: "SRC-043", kind: "image", size: [1920, 1282], zoom: 1.1, focus: [0.5, 0.642], light: "none", haze: 0.12, dim: 0.15, blur: 3, rackSec: <82.93>, rackDim: 0.55, outSec: <100.17>, label: "PHOTO TODAY · A GLASS PRISM · EVIE S. / UNSPLASH", why: ... }` (dim, rackDim and outSec: Builders S2, S3).
- **Haze 0.12 and dim 0.15 from the start.** The patches overlap and glow, and the coordinator asked for the photo hazed. The static dim keeps the photo's colours quieter than the strip's hard bands, so the bands win (rule 2), while the prism stays sharp as the line describes it.
- **The rack on "others" (82.93):** blur 0 → 3 px and dim 0.15 → 0.55, over 0.8 s. From here the subject is his words and his dim red. The photo's own red and orange patch sits right behind the lower track's red end, so it must be dark and grey by the time the red end fills (89.03), or the dim red will read as bright. This keeps rule 14: the world softens when the narration leaves it. For the same reason **the lower track must be an opaque panel while empty**, never transparent over the photo.
- **Camera** `{ pan: 0, push: 0.03 }`: the far plane scales to 1.015 and does nothing else. No pan, because any pan would move the strips' plane (or leave it behind), and the strips must end exactly where D's eye opens. The strips keep VIS-014's own 0.02 drift, as already accepted for the D match.
- **Planes (rule 13):** far = the photo, which has its own depth (the prism in front of the lit backdrop). Mid = the two strips and their labels. Near = the typed quote and count. Mid and near are one drawn layer (Builder S1), separated by placement, not motion, so the quote never slides off the red end it belongs to. Nothing of ours is blurred, graded or vignetted: the layer sits above the vignette.
- **Overscan:** the bottom edge is at 1085 at the start (5 px, and it only grows with the push), the left at -180 and the right at 2100. Check the bottom edge on the arrival still (rule 15).
- **Rule 4:** the prism's apex and both slanted faces stay visible all shot. The strip covers only its base, and only from about 79.4.
- **Text clearance:** the OTHERS label (x 210-557, y 408-450) is 130 px left of the prism's left face at that height (x 689).
- **Stillness:** 74.74, 78.97, 80.37, 82.93, 85.69, 89.03, 92.9, 93.47, 95.43, 96.05, 98.53, 100.17 and 102.10. The longest gap is 75.8-78.97 (3.2 s, after the glide), within the 3.5 s limit.
- **Change to the a3-07 card line** (Plain cards, above): there is no 62 px headline title at y 250, because it would sit on the prism's left face. The strip names are mono track chips instead.

**Beat rows (S):** in every row from 29 to 38, Visual becomes VIS-059, VIS-014 and Source becomes SRC-043. Motion gains MOT-016 (and MOT-013 on 36 and 38).

| Beat | What changes in the notes |
|---|---|
| 29 | New: "Yes: SRC-043 Planned → Active, 10 of 10; LayerStage builder additions (drawn overlay plane, dim/rackDim, outSec); VIS-014 two-track mode". Notes: "Director S_prism_world. World = SRC-043, a glass prism today (zoom 1.1, focus [0.5, 0.642], haze 0.12, dim 0.15), label PHOTO TODAY · A GLASS PRISM · EVIE S. / UNSPLASH bottom-right. The glide lands on the photo alone; OTHERS · DALTON'S SIX chip at (210, 408) on 'describes'. No headline title. Never a beam into the prism or a fan out of it." |
| 30 | "The whole prism on 'A prism'; the top strip draws left to right from x 210 on 'triangular' (78.97, 1.4 s), over the prism's base." |
| 31 | "Top strip complete on 'throws colours' (80.37)." |
| 32 | "World racks on 'others' (82.93): blur 3 px, dim 0.55 over 0.8 s. Lower track (opaque, empty) appears, with the DALTON'S WORDS chip at (210, 714)." |
| 33 | "Quote typed at (210, 790) on 'little', tag DALTON · 1798 · P. 31 at (210, 856), over the dimmed world." |
| 34 | As now, plus "against the opaque track; the photo's red behind it is already dark". |
| 35 | Unchanged. |
| 36 | "Quote un-wipes at 92.9; the count types in its place on 'two'; tag held; one yellow on 'Yellow'." |
| 37 | Unchanged. |
| 38 | "World label un-wipes and the photo fades to the canvas from 'Then' (100.17-101.37, blur to 4 px); the strips alone under the riser's peak; hard cut at 102.10." |

### H_wish_over_portrait (beats 69-72)

**The idea:** the eye shuts, and the cut lands on his spectacles: on the man who asked. Then his biographer's two lines rise in front of him.

| Field | What it says |
|---|---|
| Line | a3-14: "At (184.47) some point, he asks for exactly (186.15) that. For his eyes (188.39) to be examined after (189.41) he dies. His biographer (191.31) would call it his strongly (192.81) expressed wish." Beats 69-72, 183.82-195.02. |
| Subject | 183.82-186.15: the man (his portrait, with his spectacles where the closing eye was). From 186.15: the two lines, then the highlights in reading order. |
| World and why | SRC-004, `dalton_turner1834.jpg`. **Same person:** `why: "Same person: John Dalton, whose eyes his wish was about; his biographer's words about it are held up in front of him."` |
| Period honesty | A period print (mezzotint by Charles Turner after James Lonsdale, 1834; this is not shown on screen, and the painting is never dated on screen). The tag `JOHN DALTON · 1834` is the world label (bottom-right), on from the first frame until the paper band covers it. The strip's tag is `W. C. HENRY · 1854 · P. 25`. No label says "biographer", let alone "the biographer". The "not, however, verified" line (page y about 1050-1100) and the "pale yellow" line (page y about 1310-1390) are both outside the strip's crop. |
| Entry | TRN-010 cut on action from the closing lid (beat 68). **The action carries onto his spectacles, on the lens on the viewer's left** (image (417, 382), rim radius about 27 px). It lands at **(854, 516)**, 106 px left of and 30 px above the iris it replaces (960, 546). The portrait arrives 90 px high and settles down, so the lid's downward movement continues into the frame. Why the spectacles and not the eye: (a) the lens rim is a hard circle (r 57 frame px) answering the iris circle (r 112), a shape the eye can follow; his eye behind the glass is about 30 px across and soft at 2x, too small to match. (b) A closing eye cut onto his open eye reads as the same eye opening again, which is the opposite of the beat (the next words are about his death) and close to making his face act. Glass is an object, so nothing in his face seems to move. (c) It is the lens act 1's LensDive came back out onto (`out.to` (830, 525) there), so the episode has already made it the door to his eyes, and it lands within 30 px of the same screen spot. |
| Path and landing | **Framing:** `zoom 1.0` (s 2.082), `focus [0.47, 0.32]`. The print is narrow, so at zoom 1.0 fx can only run from 0.463 to 0.537 and the head sits near centre: hair top at y 75 (6.9%), the viewer's-left lens at (854, 516), the other lens at (1031, 507), the nose at about (922, 616), the chin at about (933, 751), and the face (with the ear) across about x 776-1360. His white stock and shirt lie at x 1067-1318, y 643 to the bottom of the frame. He looks to the frame's left. **Strip** (`henry1854_p25_wish_line.png`, re-cut to 1850x170, see the asset fix below): `w 1440`. It rises (`enter: "rise"`, 140 px, 0.9 s) on "exactly" (186.15) and settles in the pause after "that." (187.05-188.05), `at [880, 872]`. At its settle it sits at frame x 151-1597, y 807-939. At the shot's end (camera -30 px, x1.02) it is at x 113-1582, y 811-946, with its text starting at x 129, inside the safe line. Its x-height is 23 px (B's page was 27). It sits 56 px below his chin. **Tag:** `W. C. HENRY · 1854 · P. 25`, a LabelSpec at x 160, y 746, size 22 (about x 160-540), on 187.05. It sits on the black ground left of his face (the face starts at x 776), 19 px above the strip. **Highlights** (on the carried strip, Builder H1), in the strip file's px: H1 `[710, 20, 1112, 52]` "carefully made after Dalton's death" on "after" (189.41); H2 `[598, 102, 822, 54]` "his strongly expressed wish" on "strongly" (192.81). In page px these are [795, 1144, 1112, 52] and [683, 1226, 822, 54], measured by ink profile. The old brief's box [732, 1225, 562, 50] started inside "his" and stopped inside "expressed". |
| Scale | None. |
| Action | The two highlights, and one rack: the world's blur goes from 0 to 1.5 px on "His biographer" (191.31). |
| Exit | **Tags first:** the Henry tag gets `untilSec 194.45` (after "wish.") and is gone by about 195.0. The portrait's tag stays: the band rises from the bottom and covers that corner first, so the face is never on screen without its tag. Then TRN-011 paper band (dark, up) at 195.02, with SFX-024 (unchanged). |
| Eye out | H2 (about (914, 906) at the end) → WHAT IS COLOUR? at x 120, about y 540: 22% across and 34% up. The rising band carries the eye up, as act 2's band did. |
| Sound | Cue 4 enters in the pause after "two." (183.17-184.47), on the cut (unchanged). On the strip's settle, SFX-016 `paper_move` at -26 dB in the pause after "that." (about 187.1), **only if the episode's SFX-016 count has room** (max 10); otherwise silent. The highlights are silent, and the music is near-silent under the quote (beat 72). |

**LayerStage choices**
- `worlds[0]`: `{ atSec: 0, srcId: "SRC-004", file: "dalton_turner1834.jpg", kind: "image", size: [996, 1230], zoom: 1.0, focus: [0.47, 0.32], light: "none", haze: 0.10, blur: 1.5, rackSec: <191.31>, lightFrom: "top-left", label: "JOHN DALTON · 1834", why: ... }`.
- `carry[0]`: `{ srcId: "SRC-007", file: "henry1854_p25_wish_line.png", size: [1850, 170], at: [880, 872], w: 1440, atSec: <186.15>, enter: "rise", rest: false, highlights: [H1, H2] }`.
- `labels`: `[{ text: "W. C. HENRY · 1854 · P. 25", atSec: <187.05>, untilSec: <194.45>, x: 160, y: 746, size: 22 }]`.
- `arrive: { dir: "down", px: 90, sec: 0.45 }` (Builder H2). The print has about 290 px of picture above the frame and 1190 px below it, so arriving inside the stage shows no bare edge. CutOnAction's own translate would show a 90 px band of canvas at the bottom during the settle.
- **Camera** `{ pan: -30, push: 0.02 }`: calm. The strip drifts 30 px left, towards where the next shot's question stands (rule 6), and the far plane moves 10.5 px and 1%. **His face is never animated:** nothing moves inside the print, and there is no glint, no mask on the eye or lid, and no push aimed at the face (the push is about the frame centre, and only 1% on the far plane).
- **lightFrom "top-left", read from the print:** the light falls on him from the upper left (his forehead and the left of his face are lit, and the shadow falls to the right of his nose). The strip's shadow falls down and to the right, onto the shirt and coat.
- **light "none":** the world is a neutral grey print. Check the cream strip against it on the landing still (rule 17). If the warm paper jumps out, try `light: "paper"`, whose near grade lowers the strip's saturation.
- **Haze 0.10** lifts the mezzotint's blacks a little, so the lifted paper separates from them. The rack comes on "His biographer": up to there the line is about him and his eyes, and the print stays sharp (rule 14). From there it is Henry's words.
- **Rule 4:** the face (x 776-1360, y 75-751) is never covered. The strip is 56 px below the chin and the tag 236 px left of the face.
- **Rule 16:** the strip's long edges are horizontal. The print's lines here are the lapels' diagonals and the stock's curves, so there is no joint. The strip does cross the white stock and shirt (x 1067-1318), light paper on a light shirt for 250 px, so the lifted shadow and the rim must separate it (check at 200%). Fallback: a hairline keyline round the strip (Builder H3).
- **Rule 13:** far = the print (the mezzotint grain, the figure against the dark ground); near = the strip. There is no mid plane, as in A and B.
- **Stillness:** cut 184.07 (settled 184.52), strip 186.15, tag 187.05, H1 189.41, rack 191.31, H2 192.81, tag out 194.45, band 195.02. The longest gap is 2.4 s. This is also why the strip rises later and does not come in with the cut: with the strip in from the cut, the first change after it would have been H1, 5.3 s later.

**Asset fix (SRC-007's strip file):** the requested crop `[90, 1140, 2110, 135]` clips the descenders of line 2 (the g, y and p of "conformity", "strongly", "expressed" and "by"). It also clips the tops of line 1's ascenders (they start at y 1136), and it carries about 280 px of blank page on the right (the text ends at x 1921). **Re-cut it to `[85, 1124, 1850, 170]`** (y 1124-1294). The line above ("This theory was not, however, verified...") has descenders ending at about y 1112, and the line below ("medical attendant, Mr. Ransome. The vitreous humour was") has ascenders starting at about y 1304, so neither shows, and the "pale yellow" line is further down still. Check both edges at 200% for a stray serif.

**Beat rows (H)**

| Beat | What changes |
|---|---|
| 69 | Visual VIS-059 (was VIS-001). Motion MOT-016, MOT-013 (was MOT-003). Source SRC-004, SRC-007. New: "Yes: henry1854_p25_wish_line.png re-cut at [85, 1124, 1850, 170] (file of SRC-007); SRC-004 16 of 16; LayerStage builder additions (carried highlights, arrive)". Notes: "Calm. Director H_wish_over_portrait. TRN-010 cut on action, dir down, px 90 (the move is done by LayerStage arrive): the closing lid carries onto the viewer's-left lens of his spectacles in the 1834 mezzotint (SRC-004, zoom 1.0, focus [0.47, 0.32], haze 0.10), lens at (854, 516); tag JOHN DALTON · 1834 bottom-right from frame 0. Cue 4 in the same pause. The strip rises on 'exactly' (186.15), lifted, to frame x 151-1597, y 807-939, 56 px under his chin; tag W. C. HENRY · 1854 · P. 25 at (160, 746) on its settle. The 'not, however, verified' and 'pale yellow' lines never show. His face is never animated." (This replaces "the strip arrives moving down on 'At some point'" and "on the same page blurred".) |
| 70 | Visual VIS-059, motion MOT-016. Notes: "H1 'carefully made after Dalton's death' (file box [710, 20, 1112, 52]) on 'after' (189.41)." |
| 71 | Visual VIS-059, motion MOT-016. Notes: "The world racks to 1.5 px on 'His biographer' (191.31); no label for him (the tag names him)." |
| 72 | Visual VIS-059, motion MOT-016, MOT-013. Notes: "H2 'his strongly expressed wish' (file box [598, 102, 822, 54]) on 'strongly' (192.81); the Henry tag un-wipes at 194.45; the portrait's tag stays until the band covers it." |
| 73 | Unchanged, plus "the band covers the portrait's tag first". |

### Transition review: rows these shots change
- **Row 2 (A → A2):** `focus` [560, 780] → [408, 908]. A2's ground becomes the chapel (above).
- **Row 5 (B → S):** the canvas glide now carries a LayerStage (photo) card. The parameters stay: down, pull 0.86, silent (row 29).
- **Row 6 (S → D):** still the one hard cut, now canvas to canvas after S's rack-out.
- **Row 11 (simple eye → H):** dir down, px 90 and the lid keyed 0.30 s before the shot's end are kept. The cut now lands on the portrait's lens (854, 516), and the strip comes in later, on "exactly".
- **Row 12 (H → band):** the eye leaves from H2 at about (914, 906), and the band, rising, carries it to the question.
- **New, inside A:** TRN-018 on "Literary". It counts as a scene change, which makes 14. TRN-015's 2 stay within 1 in 3.

### Builder additions
**LayerStage**
- **S1 `overlay?: ReactNode`:** a drawn plane (a component), rendered above the vignette and below the world labels. The stage gives it no grade, blur, camera move or scale; it keeps its own drift. For S (VIS-014 x2 and the typed lines).
- **S2 `worlds[].dim` and `worlds[].rackDim`** (0-0.6): `brightness(1-d) saturate(1-d)`. `rackDim` is the dim value reached on the rack curve (rackSec, 0.8 s). For S.
- **S3 `worlds[].outSec`:** the world fades to the canvas over 1.2 s while its blur rises to 4 px, and its label un-wipes from outSec (MOT-013). For S.
- **H1 `carry[].highlights: { box (carried file px), atSec }[]`:** the ArchivalScanCard sweep (accentSoft, multiply), drawn inside the carried thing under its light wash. For H.
- **H2 `arrive?: { dir, px, sec }`:** every plane starts offset and settles (out-cubic), so a TRN-010 entry shows no bare edge. With it, CutOnAction needs a prop to leave `to` untranslated (for example `moveTo: false`). For H.
- **H3 (fallback only) `carry[].keyline`:** a 1 px ink hairline at 25% round a cut strip, if the frame review finds the strip lost on his shirt.
- **Header comment:** "max 2 per act" → "max 4 per act" (the register already says 4).
- **Still pending from the first brief:** Builder 1 (the tag, with `untilSec`: A's dateline now leaves at 26.29), Builder 2 (rings inside world 1's plane only, so the ring belongs to the plan), Builder 4 (the "paper" light, now used by the chapel too).
- **Noticed:** MidPlate ignores `push` (the near plane scales, the far plane scales by half, the mid plane not at all). No shot here uses `mid`. Fix it when one does.

**Elsewhere**
- **VIS-014 two-track mode**, which a3-07 needs whatever the world (check it is in the act build): a top track of six discrete bands drawn left to right from x 210 (red at the left); a lower track that is an opaque panel while empty and fills on cue (dim red, one yellow from strong to pale, blue, a darker blue); track names as mono chips (OTHERS · DALTON'S SIX above, DALTON'S WORDS below); and in this act no nm ticks and no 62 px title.
- **CutOnAction:** the `moveTo: false` prop (see H2).
- **Episode, A2's ground:** `{ kind: "blur", srcId: "SRC-044", size: [800, 564], focus: [0.47, 0.5] }`. No code change.

### Counts (asset limits these shots use)

| Asset | Limit | Use | Status |
|---|---|---|---|
| VIS-059 LayerStage | 4 per act | A, B, S, H = 4 | **At the limit.** C and E stay non-LayerStage. |
| TRN-018 WorldSwap | 3 per act | 1 (A) | OK. It counts as a scene change (14 in the act). |
| SRC-004 portrait | 16 per episode | 4 (beats 69-72) + 12 in acts 1-2 = 16 | **At the limit: none left for acts 4-7.** Act 6's examination will need another picture of him, or a raise. |
| SRC-007 Henry p.25 | 6 per episode | 4 (69-72) | OK. 2 left for act 6. |
| SRC-043 prism photo | 10 per episode | 10 (29-38) | **At the limit.** No other use in E01. |
| SRC-044 chapel | 4 per episode | 2 (11-12); **6 with A2's ground** | **Over by 2 if A2 takes the chapel.** Sam: raise to 6, or A2 falls back (p.28 blurred, then the plan). |
| SRC-009 plan | 16 per episode | 10 (2-11); 14 if A2 keeps the plan | OK. |
| SRC-042 p.28 | 6 per episode | 5 (12-16) | OK, unchanged. |
| TXT-011 dateline | 40 per episode | act 3: 9 (beats 3-11; was 11) | OK, 2 fewer. |
| VIS-014 SpectrumStrip | 20 per episode | 10 (29-38) | OK, unchanged. |
| LOK-028 BlurPlate | 3 shots per act; the card's own source | A2 only (the Henry strip's blurred-page ground is gone) | Count OK. The same-source rule is broken as it already was (flagged above). |
| TRN-010 / TRN-011 / TRN-004 / TRN-015 | 3 per act / 14 per episode / 4 per act / 1 in 3 changes | 1 / 1 / 2 / 2 | OK, unchanged. |
| SFX-016 paper | 10 per episode | +1, optional (H's settle) | Count the episode first. Silent if there is no room. |
| VIS-001 ArchivalScanCard | 30% of runtime | 4 beats fewer (69-72) | OK. |

### Needs registering
- `henry1854_p25_wish_line.png`, re-cut at `[85, 1124, 1850, 170]` (a file of SRC-007).
- SRC-043 and SRC-044, from Planned to Active (at the gate).
- **Proposed, not added:** a larger scan of the 1835 Cross Street Chapel drawing (or of its plate in Shercliff, 1960). The 800 px file is enlarged 2.6x.
- **Sam's decisions:** SRC-044 from 4 to 6 (A2's ground). Note also that SRC-004 is used up at 16.

### Stills to request for the frame review
- **A (chapel):** 25.2 (the plan clear: ring and labels gone). 26.29 (swap start; the dateline starting to un-wipe). 26.95 (the dateline and the plan's label gone, the chapel label not yet in: the corner clear). 27.6 (both chapel labels, at least 50 px above the chimney pot; the drawing at 200% for JPEG steps; the world's left edge). 29.4 (the page mid-rise). 29.65 (the page's settle: 60 px from the door surround and 55 px below the window, shadow down and right, no halo at 200%). 30.03 (match midpoint: the chapel soft behind the page). 30.35 (A2's first sharp frame on the chapel ground). Each A2 highlight landing.
- **S (prism):** 75.1 (the OTHERS chip, 130 px from the prism's face). 75.8 (the glide landed: the whole prism, the tag, the world's bottom edge). 79.4 (the strip mid-draw at the prism's base). 80.5 (the strip complete: the base line and the back corner inside the strip, no edge lined up). 83.8 (rack end). 86.6 (the quote readable on the dimmed world). 89.8 (the dim red end against the opaque track, with the photo's red behind it dark). 94.0 (the count and tag in place). 96.4 and 99.2 (fills). 100.6 (the world label gone, the world mid-fade). 101.5 (only canvas behind the strips). 102.07 (last frame), side by side with D's 102.10 (centres and the x 210 line agree).
- **H (portrait):** 184.0 (the lid moving in the old shot). 184.07 (the cut). 184.22 (the portrait arriving, no bare bottom edge). 184.6 (settled: the lens at about (854, 516) against the iris's (960, 546)). 186.6 (the strip rising). 187.1 (the strip settled: 56 px under the chin, the tag 19 px above it, the strip over his white stock at 200%, shadow down and right, any colour jump). 190.2 (H1). 192.2 (rack end). 193.6 (H2, plus a phone-size thumbnail of it: does the strip read?). 194.95 (the Henry tag gone, the portrait's tag on). 195.4 (band midpoint: the tag covered first).

---

## Within Motion blend (24 Nov 2026)

Sam, 24 Nov 2026: "Blend into E01 from act 3". Source: `/home/claude/recs/WITHIN_MOTION_STUDY_2026-11-24.md`, and I looked at frame sheets `WMsheet_00` and `WMsheet_02`. Their panels: one big spoken keyword on paper chips (white chips, the key word on the orange one: "washing / dishes", "dream / live inside"); strikes ("college", "reward"); a literal cut-out object for the noun (plates, a radio, a stack of books, a phone); halftone sticker people; map scraps with a route and a circled end. Pieces pop in and settle, and there are no camera moves. We keep LOK-009 and the calm version, and add five Planned devices: TXT-024, TXT-025, VIS-060, VIS-061 and MAP-017. All times are act seconds; beats are `act3_rows.json` rows.

**How the devices look in LOK-009 (so they belong to this theme, not to theirs)**
- **TXT-024 chips:**
  - **White chip:** the paper chip (#F6F0E4 at 0.92) with ink text. **Accent chip:** #00E0BE with ink text. One accent chip per panel.
  - **Type:** Fraunces 600, lowercase as spoken, 72-80 px, padding 10/18 px, radius 4. Each chip sits at a fixed tilt of ±1.5°. The lowercase serif tells the spoken words apart from our uppercase mono labels.
  - **Entrance:** each chip lands on its word with the house lock (rises 12 px, 0.35 s, no overshoot).
  - **Options:**
    - **Strike:** a 6 px accent line swipes across in 0.3 s, on the word.
    - **Swap:** a hand-drawn arrow draws in 0.35 s, then the second chip lands.
    - **Stack:** rows staggered by about 80 px.
  - **Exit:** an un-wipe (MOT-013), or the chips leave with the shot.
  - **Sound:** silent, as all our text is.
- **TXT-025 quote chips:** the same white chips at 44 px, landing word by word from the word times. The speaker or source sits on a mono chip.
- **VIS-060 sticker:** a 6 px white edge (the cut-out's alpha, dilated) and a small soft shadow.
  - **Entrance (the calm pop):** scale 0.94 → 1 and tilt ±6° → a resting tilt of ±2-3°, over 0.6 s, slow-out, no overshoot.
  - **Rules:** one sticker entrance at a time. No halftone where the object's colour is the point. Colour states apply inside the photo only, and the white edge stays white.
- **Not taken from Within Motion:** the poster palette, starbursts, spinners, bumpers, and the 50% footage pace. LayerStage keeps its one slow camera move. No device is placed on the act's one impact (the hit cut at 102.10) or over a page's own highlight.

### Placements, beat by beat

| # | Beat (act s) | Device | Words or object | Position (frame px) | Cue | Entrance / exit | Sound |
|---|---|---|---|---|---|---|---|
| W1 | 2 (2.40-5.09), shot A | TXT-024 swap | `question` (white) → `experts` (accent) | `question` at (160, 400) (x 160-553); the arrow runs down-right to `experts` at (260, 500) (x 260-608), over the plan's west streets, away from the college (1280, 310) and the dateline's low-centre spot | "question" 3.42; arrow + "experts" 4.14 (the plan is in by 3.0) | Both chips un-wipe from 6.9, before part 2 of the dateline on "October" (7.12). MANCHESTER lands low-centre at 5.56 while they are still on, in a different part of the frame. | silent |
| W2 | 5-7 (10.22-17.5), shot A, **conditional** | MAP-017 | A torn scrap of a 1790s regional map (to source) with a straight line KENDAL → MANCHESTER and a hand-drawn circle on Manchester; small mono chips `KENDAL` and `MANCHESTER`; no date on screen | A LayerStage carried piece, `w 520`, `at [440, 560]` (about x 180-700, y 330-760 with the camera), tilted -4°, torn edge. It stays clear of AGE 28 (x ~1190-1370) and TUTOR (x 955-1605). | Rises on "moved" (10.22); the line draws 10.42-11.24; the circle lands on "before" (11.24) | Sinks away from 17.4, before "That's the old name". | Silent: A's one SFX-016 (the page) and one SFX-017 (the ring) are already used. |
| W3 | 15 (36.08-36.48), A2 card | TXT-024 stack | `his own` (white) + `eyes` (accent) | One row in the card's right column at y 700: x 1106-1419 and 1435-1629. That is about 75 px under the source tag, which ends near y 625 (check), and off the page. | "his" 36.08, "eyes" 36.48 | Carried off by the canvas glide at 40.21, with the column. | silent |
| W4 | 24-25 (60.60-63.05), shot B | VIS-061 (as a layer cut-out, not a sticker: B is a lit LayerStage) | **A folded letter sealed with red wax, about 1790-1810** (to source) | `carry[2]`, `w 360`, `at [1450, 770]` (about x 1255-1620, y 650-890 at its settle). It sits over the page's lower, unhighlighted lines, 90 px below H3 (which ends at y 556). | Rises from "used" (60.60) and lands on "seal letters" (61.5) | Sinks away 62.45-63.05, so it leaves as a3-05 ends, before "Think". | SFX-016 `paper_move` at -27 dB at 61.6, in the pause after "letters." (B's first SFX-016) |
| W5 | 25-27 (65.08-71.5), shot B | TXT-024 stack | `green` (white), `red` (white), `to you` (accent) | Row 1 at y 640: `green` x 1160-1410, `red` x 1430-1600. Row 2 at y 750: `to you` x 1160-1440. On the blurred page's lower lines, where the letter was, 84 px clear of the highlights. | "green" 65.08, "red" 66.36, "To you" 68.84 | All un-wipe from 71.0, so the olive (71.65) and SIMULATION (72.06) land on a clean frame: the chips say "to you", and the olive pair shows "to him". | silent |
| W6 | 33-34 (85.69-88.35), shot S | TXT-025 quote chips (replace the typed quote) | `little more than a shade,` / `or defect of light`, verbatim as spoken, plus the source chip `DALTON · 1798 · P. 31` | Row 1 (210, 760), x 210-~910. Row 2 (210, 828). The source chip right of row 2, at about (720, 840). All under the lower track's red end, ending by y 890. | Word by word, from "little" (85.69) to "light" (88.35) | Un-wipe at 92.9, as the typed quote did. The count still types in their place on "two". | silent |
| W7 | 44 (114.83), shot D | Underline swipe on an existing label (no new words) | under `HUMOUR` in the VITREOUS HUMOUR label (1000, 480) | under the label | "humour" 114.83 | 0.35 s draw; it leaves with the label | silent |
| W8 | 47-48 (124.81-128.08), shot D | TXT-024 strike + swap | `clear` (white, struck) → `tinted` (accent) | `clear` at (160, 250) (x 160-~400); arrow down; `tinted` at (160, 350) (x 160-~470). Left of the eye circle (x 630), above the beam's line (y 540), 166 px under the DALTON'S GUESS corner tag. | "isn't" 124.81 (the chip); strike on "clear." 125.27; arrow + "tinted" 127.11, with the tint already running from 126.59 | Carried off by the DraftingWipe at 128.08, whose line uncovers the left side first. | silent |
| W9 | 54-55 (142.36-146.9), shot C | VIS-061 + VIS-060 sticker (replaces the tint pulse on "blue glass") | **A flat piece of blue glass, photographed today**, tagged `BLUE GLASS · TODAY` | `w 300` at (1560, 330) (x 1410-1710, y ~200-460), outside the eye circle (x 630-1290), balancing the leaf and wax that come later on the left. Its tag sits under it (y ~480, mono 20). It rides in EyeDiagram's carry layer. | Pops from "looking" (142.36) and settles on "blue glass" (~143.0) | Sinks away 146.4-146.9, before "soaks up" (147.15); the rays start at x 210, far from it. | silent (C's one pop belongs to the pair) |
| W10 | 57-60 (152.72-161.80), shot C | VIS-060 sticker look for C's leaf and wax (positions, sizes, states and moves unchanged) | SRC-014 / SRC-015 cut-outs, white edge, no halftone | (300, 380) and (300, 700), as briefed; resting tilts -3° and +2° | Leaf pops at 152.72, wax at 153.10 (one sticker entrance at a time), both settled before "Reds" (153.94) | Carried off by the slide at 161.80, as before. The multiply-blue "duller" state applies inside the photos only; the white edges stay white. | SFX-026 at -26 dB on the wax's settle (~153.7), the shot's one pop (was "on the pair's settle") |
| W11 | 67-68 (180.28-184.07), a3-13 | VIS-061 + VIS-060 sticker | **A 19th-century anatomical model of the eye that comes apart**, shown opened (to source), tagged `A MODEL OF AN EYE · <date from its record>` | `w 320` at (1600, 520) (x 1440-1760), 100 px right of the simple eye (x 580-1340); its tag under it at y ~720 | Pops on "open" (180.28), settled by "eye." (180.88) | Carried off by the cut on action (the old frame drops 90 px) at 184.07 | Silent: the deadpan runs in silence, and a3-13's one pop is the morph's |
| W12 | 68 (182.25-184.07), a3-13 | TXT-024 stack | `only` (white) + `two` (accent) | One row at y 490: x 160-360 and 376-540. `two` at about (458, 532) is 396 px from the lens the cut lands on (854, 516): inside 25%. | "only" 182.25, "two." 182.85, in the silence | Carried off by the cut, with the frame. The closing lid (from 183.52) stays the one moving thing into the cut. | silent |
| W13 | 73-75 (198.53-203.00), shot E | TXT-024 stack (**replaces VIS-020 KineticLine**) | `what is` (white) + `colour?` (accent), then `one man` (white) | Row 1 at (120, 470): x 120-464 and 480-824, about vertically centred as the line was. Row 2 `one man` at (120, 590), x 120-464. The match focus (280, 370) is about 100 px above. | "what" 198.53, "colour" 198.83; "one" 202.34 (this fills beat 75's 4 s of "nothing new") | Blurred away by the focus match into the dark room at 203.00 | silent |

**Not placed, with the reason**
- **'a careful paper' and 'one by one':** "careful" would land on the canvas glide and is 5.5 s after W3 (TXT-024 allows one panel per 15 s). "one by one" falls on the GREEN highlight, which already shows it.
- **'He offers an explanation':** that is the act's one impact (the hard cut, the hit and the eye drawing in on "explanation"). A chip there would be a second hero.
- **'strongly expressed wish':** H2 highlights those very words on Henry's page. TXT-025 is not allowed over a page that shows the words, and a chip elsewhere would duplicate the highlight (rule 2).
- **Quote chips over Dalton's portrait:** SRC-004 is at its limit (16 of 16). W6's quote sits beside the track named DALTON'S WORDS instead (p.31 is not local).
- **A prism object:** S's world is a prism already. A second, period prism next to his words would read as his own prism, which the register forbids. A period prism belongs to act 4 (Newton) if anywhere.
- **The request in H:** no object. The frame is already the portrait, the strip and two tags, and nothing else in the line is a thing.

### What it replaces, and the small retimes that keep it calm
- **Replaced:**
  - The typed quote (beat 33) → quote chips (W6).
  - C's tint pulse on "blue glass" (beat 54) → the blue glass (W9).
  - E's KineticLine (beats 73-75) → chips (W13).
  - B's "TO YOU" fallback label → part of W5.
  - C's carried cut-outs → stickers (W10).
- **Retimed, with no new elements:**
  - A's dateline corner move: from "moved" to 9.0, in the pause after "1794.", so W2 arrives alone.
  - B's wax label A WAX SEAL · TODAY: from "seal letters" to "wax" (59.88), so the letter arrives alone.
  - p.43's 'fication of blue.' highlight: from "probably" to "blue" (131.28, beat 50).
  - The p.43 dim: from "noticed by now" to "anywhere" (173.76, beat 65). It means the same thing: anywhere else, a tint would have been seen.
- **Stillness after the blend:**
  - The longest gaps are 4.35 s on the p.34 card (the card's own reveal, then "lists") and 4.6 s on the p.43 return while the quote is read in near-silence (165.66 → 170.28). Both are within Within Motion's 3-5 s and moving with the drift. The frame review judges them.
  - Fixed by the blend: A's 6.1 s on "That's the old name..." (W2; still open if W2 is not approved), A2's 4.9 s (W3), B's 7 s after the rack (W5), D's 5.5 s on "humour is an old word" (W7), and E's 4 s on "one man" (W13).
- **Beats with two new elements, each with its reason:**
  - 2 and 48: one device in two parts (a swap).
  - 24: the line names both the wax and the letters, 1.6 s apart.
  - 25: the rack, then the first colour named, 2 s apart.
  - 67: the morph, then the noun "eye", 2.2 s apart.
  - 68: the chips, then the lid, which is the existing cut-on-action.
  - No beat gains two things on one frame.
- **Words on screen:** no chip repeats a whole spoken line. Each carries the line's key word or words, all spoken. W6 is a verbatim quote, which is what TXT-025 is for. There are no new claims, apart from W2's Kendal (see the conditions).

### Counts

| Asset | Limit | Use | Status |
|---|---|---|---|
| TXT-024 KeywordChips | 8 per act; 1 panel per 15 s | W1, W3, W5, W8, W12, W13 = 6, at 3.42, 36.08, 65.08, 124.81, 182.25 and 198.53 (gaps 32.7, 29.0, 59.7, 57.4, 16.3 s) | OK |
| TXT-025 QuoteChips | 3 per act | W6 = 1 | OK |
| VIS-060 StickerCutout | 12 beats per act | beats 54, 55, 57-60, 67, 68 = 8 | OK |
| VIS-061 ObjectProp | 6 beats per act | letter 24-25, glass 54-55, eye model 67-68 = 6 | **At the limit** |
| MAP-017 MapScrapRoute | 3 per episode | W2 = 1 (conditional) | OK |
| VIS-059 carried things | 3 per shot | B: leaf, wax, letter = 3; A: scrap, page = 2 | B **at the limit** |
| SFX-026 SoftPop | 1 per shot; 8 per episode | no new pops (C's moves to the wax's settle); the episode stays at 5 (act 2: 2; act 3: 3) | OK |
| SFX-016 PaperFoley | 10 per episode; 1 per shot | +1 (B's letter): act 3 = beats 12, 17, 24 (+ H's optional) | OK; count acts 1-2 first |
| VIS-020 KineticLine | 12 per episode | 3 beats fewer (73-75) | frees 3 |
| SRC-004 | 16 per episode | no new use | stays at 16 of 16 |

Nothing goes over a limit. VIS-061 and B's carry are exactly at theirs.

### New objects to source (each needs its own SRC row, licence and Drive copy, then the fact-check; the Director only proposes)
1. **A folded letter sealed with red sealing-wax, about 1790-1810** (W4, beats 24-25). A museum photograph of a real letter of the period, folded into its own envelope (no separate envelope; those come after 1840), with an intact red wax seal, shot face-on with the seal showing. CC0 or public domain. If the address is legible, it must not be Dalton's or anyone the episode names. No tag (it is period-right); the credit goes in the description.
2. **A flat piece of blue glass, today** (W9, beats 54-55). A pane or disc of clear deep-blue glass on a plain ground, front-lit, so it reads as glass you could look through. Free licence. Tagged BLUE GLASS · TODAY. Not tinted spectacles (that would suggest he wore them, which no source says), and not a bottle (you can't look through one).
3. **A 19th-century model of the eye that comes apart** (W11, beats 67-68). A dissectible anatomical eye model (papier-mâché or ivory, from a museum collection such as the Science Museum Group or the Wellcome Collection), photographed opened or with its parts laid out. CC BY or public domain. Tagged A MODEL OF AN EYE with the date from its record. It must read as a model, never as Dalton's own eye (act 6's real remains).
4. **Conditional, for W2:** a public-domain 1790s map showing both Kendal and Manchester (for example John Cary's 1794 *New Map of England and Wales*, the sheet with both towns, or a 1790s map of Lancashire and Westmorland), large enough to tear a piece about 1000 px wide. W2 goes in only if both: (a) this map is registered; and (b) the fact-check passes "he moved from Kendal" as already established (act 2's Kendal pin; "the year before" = 1793, which is never put on screen). The line is a straight line between the towns, never a road (MAP-017: the route is never invented). Without both, W2 is dropped and A's 6.1 s gap goes back to the frame review.

### Builder additions (blend)
- **TXT-024 and TXT-025 as a per-shot chip layer in the act file**, using frame positions and word cues, over any component, with stack, strike, swap and word-by-word timing, as specified above.
- **VIS-060** for EyeDiagram's carry (Builder 6 of the first brief) and as a stand-alone layer: the white edge, the calm pop, the resting tilt, and states applied inside the photo only.
- **LayerStage carry exit:** `untilSec` with `exit: "sink"` (the rise reversed, 0.6 s), for W2 and W4.
- **MAP-017 on a carried piece:** a torn-paper mask, a from → to line in the map's image px, a hand-drawn end circle, and mono place chips, all drawn inside the carried thing.
- **Label `underline: { atSec, word }`** for W7.

### Rows to change (notes, and the visual, text or source column where named)

| Beat | Change |
|---|---|
| 2 | Add TXT-024 W1 (question → experts). |
| 4 | Dateline corner move at 9.0 (was on "moved", row 5). |
| 5-7 | Add MAP-017 W2 (conditional), the scrap out at 17.4. Source: + the new map SRC. |
| 15 | Add TXT-024 W3 (his own · eyes). |
| 24 | Wax label on "wax" (59.88). Add VIS-061 W4 (the sealed letter) and SFX-016 at 61.6. Source: + the letter SRC. |
| 25 | The letter sinks away by 63.05. Add W5's `green` (65.08). |
| 26 | Add `red` (66.36): no longer "nothing new". |
| 27 | Add `to you` (68.84); the chips un-wipe from 71.0. |
| 33 | The typed quote becomes TXT-025 W6. |
| 44 | The underline swipe under HUMOUR (W7). |
| 47-48 | Add TXT-024 W8 (clear, struck → tinted). |
| 49-50 | 'fication of blue.' highlight moves to "blue" (131.28). |
| 54-55 | The tint pulse is replaced by VIS-061/VIS-060 W9 (blue glass). Source: + the glass SRC. |
| 57-60 | The leaf and wax take the VIS-060 sticker look, staggered (152.72 / 153.10); the pop on the wax's settle. |
| 65-66 | The dim moves to "anywhere" (173.76, beat 65). |
| 67-68 | Add VIS-061/VIS-060 W11 (the eye model) and TXT-024 W12 (only · two). Source: + the model SRC. |
| 73-75 | Visual VIS-020 → TXT-024 (W13: what is · colour? · one man). |

### Stills to add to the frame review
- 4.4 (W1: both chips on, clear of the plan's college).
- 11.4 (W2: the line drawn and the circle on Manchester, the scrap's torn edge at 200%).
- 36.8 (W3, under the source tag).
- 61.6 (W4: the letter settled, 90 px under H3).
- 69.2 (W5: three chips, clear of the highlights).
- 88.5 (W6: all quote chips readable on the dimmed photo).
- 127.4 (W8).
- 143.2 (W9: the glass's sticker edge and tag).
- 153.8 (W10: both stickers, the edge staying white under the blue state at 156.5).
- 182.95 (W11 and W12: the model, the chips and the eye balanced).
- 202.6 (W13).
