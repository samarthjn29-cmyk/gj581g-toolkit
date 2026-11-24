# Designer review: WCL-E01 act 3 "The talk" (v5 cut)

24 Nov 2026. Fresh eyes; I did not build this act. Looked at: look_sheet_v5.jpg and its frames, 1080p stills pulled from
out/WCL-E01_act3_v5.mp4 (104.5, 108.5, 113, 118.8, 125.5, 127.5, 139, 143.5, 147, 151, 155, 160.5, 182.5, 202.5,
203.3, 206 s and others), the act file, EyeDiagram.tsx, STYLE_GUIDE.md, warmGraphite.ts, and frames sampled from the
locked act 1 v18 and act 2 v10.

**Verdict: not ready for Sam.** The two shots that still use the drawn eye (7 and 9) do not meet the bar the halftone
eyes in shot 11 now set. They are drawn in the same way as the eye Sam dropped: 4 px ink outlines on bare graphite, with
a flat panel fill and a flat colour fill. Next to the engraved and halftone pictures around them they look like
placeholders. The drawing should stay, because a cross-section with a tint and light passing through explains something
a photo cannot. It needs a designed treatment (MUST 1). Two smaller MUSTs: construction artefacts in the drawing, and
16 px labels.

## MUST (fix before the look sheet goes to Sam)

1. **Shots 7 and 9, the drawn eye (102.1-128.1 s and 137.5-161.8 s): change it from bare line art to an anatomical
   plate.** Keep EyeDiagram's geometry and cues and change how it is drawn (a new `plate` style on section mode):
   - Ground of the drawing: a cream plate card (paper tokens `#ECE4D2`, paper grain, 1.5 degree tilt, the
     ArchivalScanCard shadow), about 1180 x 860 px, centred at x 1100 so the chips keep the left margin. The ground
     stays graphite. This is the act 2 "Where is the pink?" card idea (a designed card on the dark ground), not a
     document on the desk, so the desk does not run 7-8-9-10.
   - Line: paper ink `#2B2724`, 3 px outlines and 1.5 px inner lines. The sclera becomes a band (two lines 14 px apart)
     filled with engraving hatching (1 px strokes at 45 degrees, 6 px apart), so it matches the engraved Dalton
     portrait, Green's plan and the halftone eyes. The lens gets light stipple. Add an iris (two short heavy strokes in
     front of the lens) and an optic-nerve stub at the back, so it reads as an eye and not as a circle with an ellipse.
   - Labels: plate captions in Fraunces italic 30 px with fine 1 px leader lines ("Vitreous humour", later "Lens" if
     the script names it). Drop the dark mono chip that now sits inside the eye at 112.5 s. The mono tag stays only for
     DALTON'S GUESS.
   - Tint (Dalton's guessed blue, `#3D6BD6`, a data colour, correct): change it from a flat 0.5 fill to a watercolour
     wash. Multiply blend at about 0.55, a feathered edge (feTurbulence displacement 4-6 px plus a 1.5 px blur), paper
     grain showing through, and a brush wipe from front to back over 1.2 s (126.6 s; and the 0.5-0.72 pulse at 142.4 s)
     in place of the fade.
   - Light in shot 7 (beam at 118.1 s): replace the 10 px white bar, which reads as a skewer through the eye, with the
     VIS-021 dots used in shot 9 (warm white, same speed and size). Light then has one look in both shots. On the plate,
     shot 9's R/G/B dots stay their data hexes.
   - Shot 9's leaf and seal stickers stay as they are (white edge, shadow): photos on top of the plate.
   - A further option, for the register and not mine to add: if a period engraving of the eye in section gets
     registered (for example a Wellcome plate), lay the wash and the dots over that and drop the drawing.

2. **Shots 7 and 9, construction artefacts (seen at 118.8 s and 155 s):**
   - A hard vertical seam at x 670 inside the eye, where the cornea's canvas fill (`fill={t.colors.canvas}`, line 136)
     cuts the panel fill. Give the cornea no fill and clip the panel fill to the eye outline.
   - Small notches where the cornea curve meets the eyeball circle (about y 390 and y 690). Join the two shapes as one
     path.
   - Doubled accent lines at the back of the eye: the always-on retina arc (r = R-12, accent, lines 139-145) runs beside
     the vitreous outline (r = R-18). From 126.6 s a lavender sliver also shows between the tint and the outer circle.
     Remove the always-on retina arc. If the script names the retina, draw it as a plate part on its cue.

3. **Labels under 20 px:**
   - Shot 5 (51.2-74.5 s): the "PHOTOS TODAY / CHERRY LAUREL, RUNIC EARTH / WAX SEAL, PETRIK" label is `size: 16`.
     Set it to 20.
   - Shot 9 (153.1-161.2 s): the "PHOTOS TODAY" label is `size: 16`. Set it to 20 and give the credit as in shot 5
     ("PHOTOS TODAY · RUNIC EARTH, PETRIK"). Whether that credit is required is the register's call.

## Per shot

| # | Shot | Time | Call | Finding and fix |
|---|---|---|---|---|
| 1 | 01 slate | 0.0-2.4 | PASS | |
| 2 | A_manchester_talk | 2.4-29.7 | PASS | Lit period plan, torn Kitchin map, tags in series. |
| 3 | A2_title_match | 29.7-40.2 | PASS | Blur chapel ground; the page and title column are in series. |
| 4 | 17+18+19+20 | 40.2-51.2 | SHOULD | The quote column is empty (`quote: ""`), so a teal rule and the source tag float alone in the right half (44 s, 49 s). Either set the quote to the words being read (the highlighted p.34 line) or drop the rule and move the source tag under the page. |
| 5 | B_leaf_and_wax | 51.2-74.5 | MUST 3 | 16 px credit label. Otherwise PASS: stickers and highlight are good. |
| 6 | S_prism_world | 74.5-102.1 | PASS / TASTE | The spectrum tracks are flat, hard-edged digital rectangles over a textured photo. Option: 4 px corner radius plus a soft drop shadow, like act 1's swatch tiles. |
| 7 | D_into_the_eye | 102.1-128.1 | MUST 1, 2 | Bare line drawing; see MUST 1 (plate) and MUST 2 (seam, notches, doubled arc). The white beam becomes dots. Accent: at 125.5 s four teal things show at once (the "tinted" chip, the vitreous outline, the retina arc, the HUMOUR underline). Once the "tinted" chip lands (127.1 s), un-draw the vitreous outline (`untilSec: 24.9` on the second outline) so the key chip is the only accent. |
| 8 | 49+50+51 | 128.1-137.5 | PASS | |
| 9 | C_carry_into_eye | 137.5-161.8 | MUST 1, 2, 3 | As shot 7. Also, the "blue glass" chip (143.4 s) shares the accent with the retina arc; removing the arc fixes this. |
| 10 | 61+62+...+66 | 161.8-177.4 | SHOULD | Same page, same crop (`[180,900,1080,1040]`), same side and desk as shot 8, eight seconds earlier, so it reads as a repeat. Change the scale: crop tighter to the two new lines (about `[220,1080,1020,260]`) with `side: "right"`, or push in slowly on the page. |
| 11 | 67+68 | 177.4-183.8 | PASS / SHOULD | The halftone cutting is the best eye in the act. SHOULD: the Wellcome model (w 300 at x 1665) is a small island far from the cutting, which leaves three separate groups. Enlarge it to w 400 and tuck it over the cutting's lower right corner (about at [1420, 600]) as a scrapbook layer, keeping its tag. TASTE: the guide says "on newsprint", but the cutting sits straight on graphite. A faint newsprint scrap behind it would finish the look. |
| 12 | H_wish_over_portrait | 183.8-195.0 | PASS | Engraving kept; the Henry strip and highlight are clean. |
| 13 | 73+74+75 | 195.0-203.6 | PASS / TASTE | Newton blur ground works: the face is readable but soft, the chips have strong contrast, and the credit is 12.9:1 once in. TASTE: at `brightness: 0.46` the frame turns mid-grey and loses the warm graphite. 0.36 would sit with shot 3's chapel blur ("dark and soft", LOK-028). |
| 14 | E_dark_room | 203.6-208.1 | PASS / TASTE | A deliberate callback to act 1 (35+36), so it is in series. For act 4, which leans on this room: the shutter is a flat grey box with three lines, the weakest object in the series. Give it plank grain and a hand-drawn edge before act 4. Note that this changes act 1 too, so it is Sam's call. |

Ground count: graphite is about 29% of the act (shots 1, 7, 9, 11), within the 40% limit. No ground runs three shots in
a row (7 graphite, 8 desk, 9 graphite, 10 desk, 11 graphite). The plate in MUST 1 keeps it that way.

## Proposed STYLE_GUIDE.md lines

- **Drawn diagrams are plates** (24 Nov, Designer act 3, following Sam on the simple eye): where a drawing is kept (a
  cross-section, light paths, a tint), draw it as a plate on a paper card. That means paper ink at 3 px, engraving
  hatching or stipple for mass, Fraunces italic captions with leader lines, and a 1-2 degree tilt with a shadow. Never
  bare ink outlines on graphite. Tints on a plate are washes (multiply, feathered edge, grain showing through), not flat
  fills.
- **One look for light:** light that travels is always shown as VIS-021 dots or rays, never a solid bar.
- **No resting accent on a diagram:** the accent goes only on the part being named, on its cue, and leaves when the
  next accent (usually the key chip) arrives.
- **20 px minimum includes credits:** photo and credit labels follow the same 20 px floor as every other tag.
- **Same page twice in one act:** the second shot changes crop scale or side, or moves the camera, so it does not read
  as a repeat.
