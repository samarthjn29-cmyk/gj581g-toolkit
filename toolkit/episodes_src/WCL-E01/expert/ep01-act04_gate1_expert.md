# WCL-E01 act 4 "A hole in the shutter": Subject Expert, Gate 1 (lines and planned pictures)

Reviewer: the Subject Expert (optics and history of optics). Written 24 Nov 2026 before any build. I have not seen
the work being made. Inputs: `rules/EXPERT.md`, `rules/notes/EXPERT_NOTES.md`, the misses in `REVIEW_SCORECARD.md`
(act 3: "prism red end"), `director/ep01-act04_brief.md` (all shots, Builder additions), `gate1_act4/WCL-E01_act4_recorded.json`,
the 1672 letter scans p.3076, p.3078 and p.3083, Opticks 1704 Plate IV (Fig. 18), the Opticks text (Book I), and
`PerspectiveGrid.tsx` (how `prism` and `fan` are actually drawn).

Grades: **MUST** (teaches something false, or contradicts a picture shown in the same act), **SHOULD** (true but
likely to mislead, or a weaker picture than the physics allows), **TASTE** (a specialist's addition).

**Counts: 4 MUST, 7 SHOULD, 5 TASTE. Shots that PASS as planned: A0, A, B, C, E, F, G, H, J, N, O, P, R, S1, S2, T.**

---

## 0. How the room's optics are drawn now, and the one rule they must follow

What the code draws (checked in `PerspectiveGrid.tsx`):
- `prism` is a flat triangle in the screen plane with its **apex up** (`[x, y - 0.62k]` on top, base below).
- `fan` puts 400 nm at `x0` and 700 nm at `x1`, in equal steps of wavelength, as a **horizontal** band.
- Screen y grows downward (`cy + y·s`).

The physics a viewer can check by eye, and Newton's own text: a prism bends light **towards its base**, and the
colours separate along that bend, **red least, violet most** (p.3083: "from the least refracted Scarlet to the most
refracted Violet"; Opticks Exp. 3: the beam "refracted upwards toward the opposite Wall"). A hole does not bend light.
All colours from one prism leave from the same place and deviate the same way. The only difference is how far.

**The room rule (apply to D1, D2, I1, I2, L, M, T):**
1. Every prism is drawn **apex down**, as both prisms are in Newton's Fig. 18 (shown at 86.8 s). Then every bend in
   the plan that goes **up** on screen goes towards the base, which is correct. (Builder: `prism.apex: "down"`, points
   `[x, y + 0.62k]`, `[x - 0.55k, y - 0.38k]`, `[x + 0.55k, y - 0.38k]`.)
2. On every band, the **red end is the end nearest the unbent line** (the straight continuation of the beam into the
   prism), and violet is the far end. In D1 the unbent line meets the wall at `[750, 210, 2000]` → screen (1226, 545).
   The band `x 150 (violet) .. 650 (red), y -40` lies above it (bent up) with red nearest. **D1 is right once the
   prism is flipped.** In every other shot, the same order holds: **red on the right, violet on the left.**
3. The light keeps a straight line through a hole: prism 1, the board hole and prism 2 lie on one line.

---

## 1. Shots with notes

### D1_shutter_room: **MUST 1**
- **Problem.** With the prism drawn apex up, the beam visibly bends **towards the apex**. Screen slope in: hole
  (281, 373) → prism (638, 438) = +0.18 (going down). Slope out: prism → band (1102, 456) = +0.04. That is a turn of
  about 8° **upwards**. Anyone who has seen a school prism diagram sees the light bend the wrong way, on "The glass
  bends the light".
- **Change.** Draw the prism apex down (room rule 1). Keep every D1 coordinate. Hole, beam, prism `[-600,-60,950]` and
  fan `x0 150 (violet), x1 650 (red), y -40, h 100, z 2000` are then correct, with red at the end nearest the straight
  line (x 1191 on screen) and violet at x 1013. Because L, M and T reuse the prism, the same flip fixes them.
- Sun's beam coming in descending from a high hole: right. "Light comes from the left": fine.

### D2_far_wall: **MUST 2**, SHOULD 1, TASTE 1
- **MUST 2: the band is mirrored against D1.** The plan has `x0 418 (violet), x1 -582 (red)`, so red is on the left.
  In D1, a hard cut earlier and in the same room and wall, red is on the right. The order of a spectrum is a fact about
  which colour bends least, not a reading-order choice. The viewer sees it flip, and sees it flip back in L and T.
  **Change:** `x0 -582 (violet), x1 418 (red)` (band still x 533-1267, y 397-543). Labels: `RED` at **x 1230** on 45.44,
  `VIOLET` at **x 570** on 46.62, `EVERYTHING IN BETWEEN` unchanged at x 900. The eye goes right then left, which is
  fine: the line says "one end … the other". The rings can stay where they are (the first ring, `ROUND …`, now sits at
  the violet end; any end will do as a measuring rod).
- **5:1 and the rings: PASS.** 733 × 147 px = 4.99:1 (p.3076 "about five times greater"). Ring r 73 = half the band's
  height. That is right: the round image the hole would give is exactly as wide as the band (the band's width *is* the
  Sun's round image), and five rings touching at 146.5 px steps fill the length.
- **SHOULD 1: the label `ROUND HOLE`.** The dashed ring is on the far wall, so `ROUND HOLE` says the hole is there.
  It stands for the round **spot** the hole would cast (fact-check point 4). **Change:** `ROUND SPOT` (same place,
  same time, 55.66). Or, if the strings must be spoken words, keep `ROUND` alone.
- **TASTE 1 (what a specialist would add, if it fits the build):** p.3076 says the band's sides were "streight lines,
  but at the ends … semicircular". Give the band round ends (caps of radius = half its height). That is exactly why
  the five rings work: the band *is* a row of overlapping round images, one per colour. This sets up L ("sorting")
  without saying it.

### I1_board_room: **MUST 3**
Three errors, all visible on screen:
1. **The band on the board is mirrored.** `x0 -255 (violet), x1 -655 (red)` puts red on the left. On the wall in D1,
   from the same prism, red is on the right.
2. **The band is not where D1's light goes.** D1's cone cut at z 1200 lies at x -422 .. -303, **y -55**. The plan puts
   the board band at y +63, which is below the unbent line (y +4 at z 1200), so light bent downwards, the opposite of D1.
3. **The blue beam kinks at the hole.** Prism 1 (638, 438) → hole (800, 500) → prism 2 (1020, 486): the light goes down
   to the hole, then level/up to prism 2. A hole does not bend light. Newton's whole control is that the light leaving
   the hole keeps its line. Every colour he tested hit prism 2 the same way.

**Change (one set of numbers that satisfies all three; the designer may scale it, keeping the rules):**
- Board band = D1's cone where it meets the board: `fan z 1200, x0 -422 (violet), x1 -303 (red), y -55, height 40`
  (screen x 758-815, y 444; height 40 is a legible simplification of the true ~24).
- Hole on the blue (460 nm sits at u = 0.2 of the band): `hole [-398,-55,1200] r 14` → **screen (770, 444)**.
- Board moved so the hole sits inside it and prism 2 is clear of it: `board [-450,120,1200] w 600 h 520`
  (screen x 602-888, y 403-651).
- Prism 2 on the line prism 1 → hole: `prism [-34,-46,1650]` → **screen (946, 452)** (the slopes 638→770→946 are both 0.045).
- Blue beam hole → prism 2 along that line; `BLUE` label 36 px under its middle, about (858, 484).
- The focus match from Fig. 18's hole (740, 594) now lands on (770, 444): 30 px across, 150 up, inside 25%.
- If a bigger band is wanted, move the board **deeper**, not the band sideways. The cone grows with distance from
  prism 1, and Newton's second board stood "about twelve Feet" from the first (Opticks Exp. 6). For example, at z 1600 the
  cone is x -136 .. 174, y -48 (126 px).

### I2_second_prism: **MUST 4**, SHOULD 2, SHOULD 3
- **MUST 4: the second refraction.** Plan: blue to `[560,-120,1200]`, red to `[640,0,1200]`. The unbent line from
  prism 2 meets the wall at `[527, 22]`. Blue's offset is (33, -142), mostly up. Red's is (113, -22), almost
  sideways, and on screen red turns only about 2° (from (1045, 493) to (1266, 470), with the incoming beam at about -4°).
  So red reads as **going straight through glass**, and red and blue bend in different directions. The act's result
  is "each colour bends by its own fixed amount": both bend the same way, red less, and red is still clearly bent.
  **Change (with MUST 3's geometry, I2 = I1 with z - 800):** prism 1 `[-600,-60,150]`; board `[-450,120,400]`; hole
  `[-398,-55,400]` → (668, 430); board band `z 400, x0 -422, x1 -303, y -55, h 40` → x 651-738; prism 2 `[-34,-46,850]`
  → **(941, 444)**. Unbent line at the wall: `[249,-39,1200]` → (1079, 451). **Blue** lands `[249,-339,1200]` →
  **(1079, 308)** (a bend of about 47°). **Red** lands `[249,-234,1200]` → **(1079, 358)** (about 35°): same direction,
  less, plainly bent. (Real glass differs by only a degree or two between red and blue. Exaggerating the gap is
  fine. Showing red unbent is not.) `ITS OWN FIXED AMOUNT` under prism 2 at **(941, 530)**: the beams now go up, so
  it is clear of them.
- **SHOULD 2: the ghost fan (the prediction).** The caption `IF THE GLASS MAKES THE COLOURS` and the dashed, 0.18
  fill make it read clearly as a prediction: PASS on the idea and the label. But it is placed `x 400-1000, y -40`,
  away from where blue actually lands, so on "It doesn't." the viewer sees the prediction vanish and a blue beam go
  somewhere *else*. Under the modification view, blue would be spread again **around where it lands**. **Change:**
  centre the ghost on blue's landing spot with its blue part on the spot: `ghost fan z 1200, x0 169 (violet),
  x1 569 (red), y -339, h 100` (screen x 1041-1232, y 308). Then on "doesn't" everything but the blue spot fades, and
  what is left is the result.
- **SHOULD 3: show the cause of the shift.** Newton "took the first Prisme in my hand, and turned it to and fro …
  about its Axis" (p.3078; Opticks Exp. 6: the image moved "up and down upon that Board"). In the plan the band
  slides (`shift dx`) with nothing moving. **Change:** rotate prism 1 about 4° on 110.62 while the band slides
  (Builder: `prism.rotateAtSec, rotateDeg`). With MUST 3's band, red (u ≈ 0.85, x -321) reaches the hole with
  `shift dx -77`. The beam hole → prism 2 must **not** move for red: same entry into prism 2, different bend. That
  is the experiment.

### L_sorting_room: SHOULD 4, TASTE 2
- Chips `making` (struck) → `sorting`: **PASS.** In modern terms, too, a glass prism adds no new wavelengths (linear
  optics); it separates what is there.
- Rays to their own spots, red at x 1191 and violet at x 1013: **PASS** (same order as D1).
- **SHOULD 4: the coloured dots.** Twelve round, glowing dots in six colours read as **"white light is made of little
  coloured balls"**. That is a modern misconception, and act 5 must undo it ("the Rays to speak properly are not
  coloured", Opticks Bk I Pt II, Def. after Prop. II). It is faithful to 1672 Newton, though: p.3083 calls light "a
  confused aggregate of Rays indued with all sorts of Colors". So keep the picture, but say whose picture it is.
  **Change:** add the label `EVERY KIND OF RAY` (spoken words) at (460, 520) on 124.15, then `MIXED TOGETHER` on 127.21 as
  planned. Draw the dots as short streaks along the beam (RayParticles elongated, or `size` 3 with `trail 0.15`) so
  they read as rays, not particles. The tag `ILLUSTRATION · …` stays.
- **TASTE 2 (for act 5):** reuse this exact shot in act 5 and turn the dots grey-white on "not coloured". The
  picture the viewer built in act 4 is then the one that gets corrected.
- Six colours: fine (the 1672 letter lists five primaries plus orange and indigo, p.3082).

### M_lens: SHOULD 5, TASTE 3
- **Geometry of the recombination: PASS in principle.** Each colour runs from its point on the lens to one point on
  the wall, and white blooms there. That is an ideal converging lens with the wall at its focus, and it matches p.3083
  ("all the Colours of the Prisme being made to converge … reproduced light, intirely and perfectly white").
- **SHOULD 5: fix the order and the cut, which the brief leaves open.** Wall band `x0 400 (violet), x1 900 (red)`.
  Lens-plane band = the same cone cut at z 800: `x0 -309 (violet), x1 -82 (red), y -51` (the plan's -350..-50 at
  y -40 is close; use the computed values so the cone does not jump). Give the incoming beam a source whose straight
  line passes beyond the red end and below the band, so the bend reads up, towards the flipped prism's base:
  `beam from [-1850,-120,-250]` (off-screen) → prism `[-900,-60,300]`. The unbent line then meets the wall at
  `[1000, 60, 1400]`.
- **TASTE 3:** Newton's own proof that this is mixing, not destruction: past the focus the rays cross, and "the Colours
  … appear again, but yet in a contrary order" (Opticks Bk I Pt II, Prop. V, Exp. 10). If there is room after "white
  again", let a few dots pass a little beyond the white spot and fan out red ↔ violet reversed. That is not required
  by the line, and it is the strongest thing a physicist would add.

### Q_plain_version: SHOULD 6
- Striking `glass` and `light bouncing off things` reads as "glass and reflection have nothing to do with colour".
  The spoken claim is narrower: they do not **create** it. Newton's own theory (the one Dalton leans on in act 3,
  a3-15) is that bodies look coloured **by** reflecting some rays more than others. **Change:** strike the verb, not
  the noun. `glass` (900, 300) plain, `create colour` (1120, 300) **struck** on 168.20; `light bouncing off things`
  (900, 440) plain, `create it` struck on 171.30 (both are spoken words). The strike count is unchanged (2).
- `each kind of ray` / `fixed` / `which colour you'll see`: PASS **as Newton's view** (the ground and label say it is
  his letter). It is not the modern answer (what you see also depends on the mixture and the eye), and act 5 onwards
  takes that up. Nothing to change here.

### Band orientation, all room shots: SHOULD 7
- With a horizontal refracting edge (an apex-down triangle facing us), the spectrum is **vertical**: Newton's was
  (Opticks Exp. 3, "refracted upwards"; Fig. 18's image MN on the wall is a vertical line). A horizontal band beside
  a face-on triangle is a mixed picture. After the flip it no longer teaches a wrong direction, but it cannot *show*
  "red bends least", and the wedge from prism to band is a thin sliver in which, on screen, the red ray turns about 1°
  *more* than the violet. **Recommended if the build allows (Builder: `fan.axis: "y"`, `y0` violet top, `y1` red
  bottom, `x`, `width`):** D1 band `x 750, y0 -400 (violet), y1 0 (red), width 80, z 2000` → screen x 1212-1240,
  y 328-470 (28 × 142, 5:1), red on the unbent line's side. D2 band at z 400: `x -182..18, y0 -405 (violet), y1 596
  (red)` → screen x 827-973, y 173-907. `VIOLET` right of the top end, `RED` right of the bottom end, `EVERYTHING IN BETWEEN`
  at (1010, 540), rings stacked at y 247 / 393 / 540 / 687 / 833 on x 900, `× 5` at (1060, 540). The I1/I2 shift becomes
  `dy` (the image moves "up and down upon that Board", as Newton wrote). If the horizontal band stays, MUST 1-4 alone
  make the act correct. This is the better picture, not a correctness gate.

### T_where_is_it: PASS (with a note)
- Dimming the prism to an outline while the band stays is right, and better than lifting it out (no prism, no band).
  Note: keep the outline at ≥ 0.3 and the bend unchanged through the dim. The glass still *sorts*; it just does not
  *colour*. With the flipped prism the bend reads correctly here too.

### H_fig18: PASS, TASTE 4
- Fig. 18 is Opticks Bk I Pt I, Exp. 6: the two-board, two-prism set-up of the 1672 Experimentum Crucis (p.3078: two
  boards, the second "at about 12 feet distance", a prism behind it, the first prism "turned … to and fro … about its
  Axis"). The label `NEWTON'S OWN DRAWING · OPTICKS, 1704` is honest. Fact-check point 2: yes, it is the same
  experiment, but Opticks itself never uses the name "Experimentum Crucis" (only the 1672 letter does). Fine as captioned.
- Light right to left in the plate, left to right in the room: acceptable as planned (match on a point). Bonus: after
  MUST 1, the room's prisms are drawn apex down like Newton's.
- The single board in I1/I2 stands for Newton's **second** board (hole g). The match from hole g is exactly right.
  The first board (G) only narrowed the beam. The simplification is honest, with the drawing shown just before it.
- **TASTE 4:** the phrase "experimentum crucis" is usually credited to Hooke (Micrographia, 1665), after Bacon's
  "instantia crucis". So Newton named his key test with the words of the man who attacked it (S1). That is a possible
  line for the description or act 5. Fact-check it before use.

---

## 2. The script lines (Gate 1)

| Line | Verdict | Note |
|---|---|---|
| a4-01 | PASS | "the date Newton gives" is the right hedge: historians doubt that the whole sequence (in particular the two-board crucial experiment) belongs to early 1666. Dalton born 1766: a hundred years. |
| a4-02 | PASS | 23 in early 1666 (born 25 Dec 1642 O.S.). The letter says "procured"; "bought" is fine. |
| a4-03 | PASS | p.3075-76: darkened chamber, small hole in the window-shuts. |
| a4-04 | PASS | "The glass bends the light": the picture must bend it towards the base (MUST 1). |
| a4-05 | PASS | p.3076. Physicist's note: his expectation was right for light of one refrangibility (a prism near minimum deviation keeps a round image round), which is why the oblong was the clue. |
| a4-06 | PASS | The modification view (Descartes, Hooke, Boyle), fairly simplified. |
| a4-07 | PASS | Named in the 1672 letter itself (p.3078), "later" than 1666. See TASTE 4. |
| a4-08 | PASS | One board for Newton's two, shown honestly by Fig. 18 just before. |
| a4-09 | PASS | The bend is the 1672 argument (refrangibility, p.3078-79). The unchanged colour is p.3082. The picture must show red bent less, not unbent (MUST 4). |
| a4-10 | PASS | Correct in modern terms too. "Kind of ray" is Newton's term; see SHOULD 4 for the picture. |
| a4-11 | PASS | p.3083. Spoken "entirely" for printed "intirely" is fine. |
| a4-12 | PASS | A glass of water's rainbow is refraction with dispersion: the "first half". |
| a4-13 | PASS | "Doesn't create" is the right verb; keep it on the chips (SHOULD 6). "Decides which colour you'll see" is Newton's view; act 5 takes it up. |
| a4-14 | PASS | Letter dated Cambridge, 6 Feb 1671/72; Phil. Trans. No. 80, run by Oldenburg, the Society's secretary. |
| a4-15 | PASS | Hooke's Considerations came in Feb 1672. Exchanges with Pardies, Huygens, Linus and Lucas ran into 1678: "about six years". |
| a4-16 | PASS | The right question to end on. |

---

## 3. Every MUST in one line
1. **D1 (and L, M, T):** the light bends towards the apex of the apex-up prism. Draw every prism apex down (as in
   Fig. 18); D1's coordinates then stand, with red at x 1191 nearest the unbent line.
2. **D2:** the band is mirrored against D1. Use `x0 -582 (violet), x1 418 (red)`, `RED` at x 1230, `VIOLET` at x 570.
3. **I1:** the board band is mirrored and off D1's cone, and the blue beam kinks at the hole. Use board band `x0 -422,
   x1 -303, y -55`, hole `[-398,-55,1200]` (770, 444), board `[-450,120,1200] w 600`, prism 2 `[-34,-46,1650]` (946, 452).
4. **I2:** red barely bends and goes a different way from blue. Use blue → `[249,-339,1200]` (1079, 308) and red →
   `[249,-234,1200]` (1079, 358), the same direction with red bent less, from prism 2 `[-34,-46,850]` (941, 444).

## 4. Proposed lines for `notes/EXPERT_NOTES.md`
- 2026-11-24 (act 4 G1): read the component code for how a prism and a fan are drawn (apex up; 400 nm at `x0`) and
  check every bend on screen: towards the base, red least, red at the end nearest the unbent line.
- 2026-11-24 (act 4 G1): one spectrum keeps one order in every shot of the same room; a hard cut must not mirror it.
- 2026-11-24 (act 4 G1): through a hole the light keeps its line; check prism → hole → prism is collinear on screen.

## Sources
- Newton, "A Letter … containing his New Theory about Light and Colors", Phil. Trans. 6 (No. 80, 1672): p.3076
  (oblong, "circular", "five times", semicircular ends), p.3078 (Experimentum Crucis: two boards, 12 feet, turning the
  prism), p.3082 (primaries; "obstinately retained"), p.3083 ("least refracted Scarlet to the most refracted Violet";
  "confused aggregate of Rays indued with all sorts of Colors"; recombination to white). Scans in
  `library/public/assets/sources/`.
- Newton, Opticks (1704), Book I Part I Exp. 3 ("refracted upwards"), Exp. 6 and Fig. 18 (Plate IV); Book I Part II
  Prop. II definition ("the Rays to speak properly are not coloured"); Prop. V Exp. 10 (white at the focus, colours "in a
  contrary order" beyond it). Text checked in a plain-text copy of the 1730 edition.
- "Experimentum crucis", Wikipedia (Hooke coining the phrase after Bacon's "instantia crucis"): secondary; fact-check
  before use.
- `library/src/components/PerspectiveGrid.tsx` (prism and fan drawing, projection).
- Who would know better: a historian of Newton's optics (A. E. Shapiro's edition of Newton's optical papers) on the
  1666 date and the order of the experiments.
