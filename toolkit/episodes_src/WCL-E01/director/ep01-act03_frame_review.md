# WCL-E01 act 3 "The talk": Director's Gate 2 frame review

24 Nov 2026. Stills: `qa/WCL-E01-act03/review/` (13 sheets plus the full-size frames, some cropped to 200%), `qa/WCL-E01-act03/stills/` and `contact_sheet.jpg`. Act file: `src/episodes/ep01-act03.json` from `gate2_act3/make_act3.py`. Where the brief and the beat sheet differ, the beat sheet wins. Two FIX items (1 and 6) change approved beat-sheet notes, so Sam sees them as changes. All times are act seconds.

## Verdicts

| Shot | Verdict | In one line |
|---|---|---|
| A_manchester_talk | FIX (minor) | The world, the swap, the period labels and the page landing are right. Clearances are tight on NEW COLLEGE and W1's arrow, the Kitchin source chip is dim, and the page shadow does not show. |
| A2_title_match | FIX (minor) | The highlights land exactly (the -185 px shift works). The W3 chips touch the source tag. |
| 17+18+19+20 p.34 | FIX (ground) | The highlights and the push point (620, 598) are right. The cream page on the cream paper desk has almost no separation, and the empty right column leaves the frame lopsided. |
| B_leaf_and_wax | FIX | The olive pair is not the same colour. The caption and the world label sit on the page's bottom text line. The letter has a white rim. No shadows show. |
| S_prism_world | FIX (minor) | Good overall. The DALTON'S WORDS chip touches the first row of quote chips. |
| D_into_the_eye | FIX | The hit cut lands on an empty frame for 1.8 s. The VITREOUS HUMOUR label crosses the eye wall. A stray beam dot shows for 13 s. |
| 49+50+51 p.43 | FIX (ground) | The highlights are right. Same ground problem as p.34. |
| C_carry_into_eye | PASS | No olive. The pair stays two colours under the blue, the white edges stay white, the rays start between the pair and the label is clear. |
| 61-66 p.43 return | FIX | The card lands in the same place and the dim is right. The quote column still shows the old quote while a different quote is read. |
| 67+68 simple eye | FIX (minor) | The morph lands before "So" and the lid is moving into the cut. The eye-model cut-out has a grey smudge part. |
| H_wish_over_portrait | PASS | The cut lands on the lens at about (840, 502). The strip is 70 px under the chin. Both tags and both highlights are right. The face is never covered or animated. |
| 73+74+75 chips | NOTE | The chips are placed as briefed. 2.9 s of empty dark ground before the first chip. |
| E_dark_room | PASS | The shutter settles at about (277, 370). Still wanted: act 4's first frame beside 209.60. |

Period honesty, checked on the stills:
- Every modern photo is tagged: the leaf and wax caption, A WAX SEAL · TODAY, and PHOTO TODAY on the prism.
- The chapel label reads AS IN 1835, and no 1794 is on screen with it: the dateline is gone by 26.95.
- The 1841 letter is dated.
- C has no olive.
- His face is never covered or animated.

## FIX list (most important first)

**1. D: the act's one impact lands on an empty frame.**
- **What is wrong:** `startSec: r(word("explanation"))` (103.92) leaves canvas only from the hit cut at 102.10 to 103.92. "He offers an" is spoken over nothing (t102.10 and t102.50 are empty). The strips' centre (960, 518) has no eye to cut onto, so the brief's eye trace and the x 210 match are lost.
- **Change:** in `make_act3.py` D, set `"startSec": -1` so the section is fully drawn on the cut frame, the way PerspectiveGrid uses -1. If EyeDiagram does not read -1 as "already drawn", set `0` instead: the 0.9 s draw then runs 102.10-103.00, done before "offers" (103.32). The `outlines`, `labels`, `beat`, `tag` and `tints` cues are relative to the shot start, so they do not change.
- **Beat sheet:** row 39 changes from "draws in on 'explanation'" to "drawn on the cut".
- **Check:** stills at 102.07 and 102.10 side by side: the eye's centre at (960, 540) under the strips' centre, and the beam start (x 210) under the strip's left end. Also 103.0: the section complete.

**2. B: the olive pair does not match.**
- **What is wrong:** the state is laid on with mix-blend `color` at 0.92 (`LayerStage.tsx` l.288), which keeps each photo's own lightness, so the wax stays far darker than the leaf. Measured at 72.50: leaf (105, 96, 37), wax (76, 56, 8). That is two different colours on "To him, a match", the act's payoff.
- **Change:** add `CarryState.blend?: "color" | "replace"`, the same key Builder 6 already asks EyeDiagram's CarryState for. `"replace"` fills the thing's mask with the state colour in normal blend at 0.85, then lays the photo's luminosity over it at about 0.3 so the texture stays. Use `{"atSec": r(71.65), "color": OLIVE, "blend": "replace"}` on both the leaf and the wax.
- **Check:** at 72.5, sample the boxes (280-360, 320-400) and (270-330, 650-720). The two means are within about 10 levels per channel and near #574F18 (87, 79, 24). Fine detail (the veins, the fleur-de-lis) still shows.

**3. B: the caption and the world label sit on the page's bottom text line.**
- **What is wrong:** both are at `bottom: 60`. The chips cut through "Green and orange have much affinity also. Apple", with half-letters showing above and below them (t55.40, t61.60). It breaks the note that text on a world keeps clear of the picture's hard shapes.
- **Change:** in B, drop the world `label` and the stage `caption`/`captionUntilSec`. Replace them with two LabelSpecs in the paper margin (x 0-605). Keep the wording as it is, split onto lines.
  - `{"text": "PHOTOS TODAY", "lines": ["CHERRY LAUREL, RUNIC EARTH", "WAX SEAL, PETRIK"], "atSec": 0, "untilSec": r(S(29) - 0.6), "x": 120, "y": 96, "size": 16}`. Its bottom is about 182, and the leaf's top is about 229.
  - `{"text": "JOHN DALTON · 1798 · P. 34", "atSec": 0, "x": 120, "y": 930, "size": 20}`. The SIMULATION label's bottom is about 895.
- **Check:** at 61.6 and 72.5, nothing of ours sits on the text column (x 600 and right) apart from the letter, its tag and the W5 chips. The caption is still in at 51.9 and gone by 74.0.

**4. D: VITREOUS HUMOUR crosses the eye wall.**
- **What is wrong:** at x 1000 and size 26 the chip runs to x 1296. It covers the teal vitreous outline and the white wall at x 1270-1296 (crop of t115.30). Its bottom (about 525) is also only 15 px above the beam (y 540).
- **Change:** in D `labels[0]`, set `"x": 940, "y": 440`. The chip then sits at about x 940-1236, y 446-485: 45 px inside the wall, 145 px right of the lens and 55 px above the beam. The W7 underline moves with it. C's ink point [894, 303] and the morph boxes are not affected.
- **Check:** at 115.3, clear canvas between the chip's right end and the teal outline. At 127.4, the chip still reads on the 50% blue.

**5. D: a stray beam-source dot.**
- **What is wrong:** a 10 px white dot at about (205, 540) shows from the section draw (about 104) until the beam draws (117.6). It reads as dust (t104.90-t115.30).
- **Change:** EyeDiagram draws the beam's source dot with `beat`, from `beat.atSec` (117.60) and not from `startSec`.
- **Check:** at 109.5 and 115.3 there is no dot. At 119.0 the dot is there with the beam.

**6. 61-66 p.43 return: the quote column is stale.**
- **What is wrong:** "probably some modification of blue" stays large on the right while Sam reads a different quote in near-silence ("Otherwise ... which has not been done"). The eye goes to the wrong words (rule 2).
- **Change:** in the 61-66 shot, set `"quote": "otherwise I apprehend it might be discovered by inspection, which has not been done"`. It is verbatim, with the "disco-/vered" break joined, and the typed text needs the fact-check's OK first. If it is not cleared before render, use `"quote": ""`. Never keep the old one.
- **Check:** at 166.5 and 171.2, the column matches the lit lines.

**7. p.34 and both p.43 cards: ground.**
- **What is wrong:** `PAPER = {"kind": "paper"}` puts a cream page on a mottled cream desk. The page edge barely separates, and the desk's foxing blotches compete with the page's own (t49.30, t136.00). The light ground between dark D, C and the simple eye also makes a dark-light-dark-light-dark run from 128 to 184 s, and the glide at 41.00 shows a light panel sliding over the dark sheet.
- **Change:** set `PAPER = {"kind": "paper", "tone": "dark"}` (Ground.tsx: a warm dark desk under a light pool).
- **Ground rule:** I ran `scripts/ground-check.mjs` on a copy with this change and it PASSES: photo 43%, graphite 34%, desk 17%, blur 5%. There are 4 grounds and no run of 3. It also gives p.34's empty right column dark negative space in place of a blotchy cream field (see NOTE 3).
- **Check:** at 49.3 and 136.0, the page edge reads at thumbnail size. At 41.0, the glide shows one dark sheet.

**8. B: the sealed letter (SRC-046) reads as a pasted print.**
- **What is wrong:** a 4-6 px white rim runs round it (the photo's old background, a rule 17 halo; 200% crop of t61.60). It is an untilted rectangle, pale on the pale page, cutting words mid-line.
- **Change:**
  - Re-cut the SRC-046 cut-out to the paper's own edge, choked about 3 px so no white shows.
  - Add `"tilt": 3` to `carry[2]`.
  - Keep `w 420` and `at [1440, 770]`.
- **Check:** at 61.6 (200%), no white rim, and the letter's edge reads against the page.

**9. A2: the W3 chips touch the source tag.**
- **What is wrong:** the source tag ends at y about 698 and the chips start at 700 (t38.20).
- **Change:** set both chips to `"y": 760`, which leaves about 60 px under the tag. The bottoms land at about 860, inside the safe area.
- **Check:** at 36.8 and 38.2, a clear gap under the tag.

**10. S: DALTON'S WORDS touches the first row of quote chips.**
- **What is wrong:** the chip's bottom is at about 756 and row 1's top at about 760 (t88.50).
- **Change:** add 20 px to the quote and count layout: `lines[0].y` 780, `lines[1].y` 848, source chip `y` 866, `count.y` 792. Row 2 then ends at about 906, still above the world label (about 985).
- **Check:** at 88.5 and 94.0, about 24 px under the DALTON'S WORDS chip.

**11. A: NEW COLLEGE touches the ring.**
- **What is wrong:** the chip's bottom (about 190) meets the ring's top (about 192) at x 1200-1300 (200% crop of t22.90).
- **Change:** set NEW COLLEGE `"y": 112`. The chip then sits at about 112-167, inside the 84 px safe line, with about 25 px clear of the ring.
- **Check:** at 22.9, a gap between the chip and the ring all along.

**12. A: W1's arrow does not read.**
- **What is wrong:** `arrows[0]` runs from (330, 495) to (300, 520). That is about 40 px, pointing down-left and hidden between the chips (t4.40). The brief asks for an arrow down-right.
- **Change:** set `experts` to `"x": 300, "y": 580` and the arrow to `"from": [400, 505], "to": [440, 572]`. That is about 75 px of visible arrow, down-right, and still over the west streets, away from the college.
- **Check:** at 4.4, the arrow is visible between the two chips, and `experts` sits clear of MOUNT STREET's buildings.

**13. 67+68: the eye-model cut-out has a smudge.**
- **What is wrong:** the right-hand part of `eye_model_wellcome_cutout.png` (frame about (1670-1730, 525-580)) is a blurred grey blob with no sticker edge. It reads as dirt (t182.95).
- **Change:** re-cut the file without that part, or mask it out. Keep `w 320` and `at [1600, 520]`.
- **Check:** at 182.95, three clean parts, each with its white edge.

**14. LayerStage: lifted shadows do not show on paper worlds.**
- **What is wrong:** under the settled wax, below-right reads (206, 198, 172) and left reads (206, 196, 170), so no shadow shows. The same is true for the p.28 page on the chapel and for the leaf. A lifted thing with no shadow reads pasted (rule 17).
- **Change:** in `LayerStage.tsx` l.255, for `light.key === "paper"` only (so the approved acts 1-2 do not change), set the settled lifted shadow to an offset of about 12 px, a blur of about 18 px and an alpha of about 0.38.
- **Check:** at 61.6, the below-right patch is at least 12 levels darker than the left patch, with no hard edge.

**15. A: the map scrap's source chip is dim.**
- **What is wrong:** `KITCHIN · LAURIE & WHITTLE · 1794` is grey on grey (crop of t11.40), well below the KENDAL and MANCHESTER chips.
- **Change:** draw `route.source` in ink, as `captionSize` does for the letter's tag.
- **Check:** at 11.4, it reads at the same contrast as the place chips.

## NOTES (taste; no change needed unless Sam asks)

1. **A, 8.0:** the dateline at low-centre half-covers the plan's "The Cottage" lettering. That is not the world's subject, and it leaves at 9.0. Accepted.
2. **A, chapel at 200%:** the drawing's halftone dots show before the rack (27.6). They are fine at 100%. The brief's fallback (a static `blur: 0.8` with no rack) is optional.
3. **p.34:** with no quote (the beat sheet names none), the right half holds only the rule and the tag. FIX 7 makes that calm negative space. Do not invent a quote.
4. **p.34 → B push:** the laurel highlight is muted on the card (accentSoft on the card's light) and bright mint in B, so it changes colour across the push. If it shows in motion, match B's world highlight to the card's tone.
5. **B, leaf:** the leaf's straight crop edge shows at its lower-left tip (Asset 4). A whole, front-lit cherry laurel leaf is still wanted, and the olive must be re-measured if the leaf changes.
6. **B, W5 chips:** they sit on blurred text with about 10 px between the rows. This is by design and reads well.
7. **S:** the full rainbow bar across the prism's base comes near the album-cover look. There is no beam and no fan, so it keeps to the warning. The word-by-word quote chips read well.
8. **S → D:** S's faded canvas is plainer and darker than EyeDiagram's canvas (colour washes), so the ground visibly changes at 102.10. Judge it again after FIX 1. If it jumps, let S's `outSec` fade go to the same canvas wash.
9. **C:** the ray dots (about 10 px at 60 px spacing) read at full size but are specks at phone size. The VITREOUS HUMOUR label is not carried from D into C. That is fine, because p.43 sits between them.
10. **67+68:** `two` ends about 42 px from the eye's left corner. Setting the chip panel to `"size": 64` (as D's W8) would give about 130 px. The model reads more as an object than as an eye at w 320. Acceptable, because the tag says what it is.
11. **H:** both highlights take in the trailing comma ("death," and "wish,"). The strip's shadow is faint, but the strip separates from the stock by colour. Both are fine.
12. **73:** about 2.9 s of empty dark ground (195.67-198.53) under "But a blue tint only explains colours if we know". The beat sheet has this, and it works as the breath of the turn. If Sam finds it dead, the only addition is a white chip `blue tint` in the same panel on "blue" (196.09). The KeywordPanel shot also carries no running head, while D, C and E do.
13. **p.43:** the lower half of the card shows "2. Pink is known to be a mixture of red and blue ...". That is for the fact-check and the later acts to judge, not a frame problem.

## Stills wanted (next round)
- 102.07, 102.10 and 103.0 (FIX 1); 104.9, 109.5 and 115.3 (FIX 4 and 5); 127.4.
- 71.9 and 72.5 (FIX 2); 55.4, 61.6 and 74.0 (FIX 3, 8 and 14); 51.9.
- 4.4, 11.4, 13.4, 16.5, 17.7 (the scrap sinking clear of TUTOR) and 22.9.
- 36.8 and 38.2; 41.0, 49.3 and 136.0 on the dark desk; 166.5 and 171.2.
- 88.5 and 94.0; 182.95.
- Act 4's first frame beside 209.60.
