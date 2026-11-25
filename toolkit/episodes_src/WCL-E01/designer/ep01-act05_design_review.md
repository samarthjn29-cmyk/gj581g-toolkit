# Designer review: WCL-E01 act 5 "The rays" (Gate 2 look sheet)

25 Nov 2026. Fresh eyes; I did not build this act and rendered nothing. Looked at: `qa/WCL-E01-act05/look_sheet.jpg`,
all 17 `review/sheet_*.jpg`, full-size frames t1.44, t30.48, t80.93, t92.30, t112.76, t128.45, t148.33, t164.27, and
enlarged crops of review stills t45.60, t49.20, t120.90, t129.40. Read DESIGNER.md, DESIGNER_NOTES.md, REVIEW_SCORECARD.md,
STYLE_GUIDE.md, the act 5 brief (the section "Applied after fact-check 2 and the Expert" overrides the earlier text) and the act 3 design
review. Contrast was measured on pixels.

**Verdict: not ready for Sam.** The cards (A, B, G, L, N), the F panel, J and the eye plate in O are in series and
look good. Several of the new pieces are not finished yet. The white rays vanish on the cream plate in E, and they are
specks the size of dust in D. The candle footage runs out, so I ends on a flower floating on pure black. The dimmed
band in M shows a hard dark rectangle. The three kinds of spectrum strip in the act have three different finishes. In
E, "seen as pink" sits on the same line as "Lens". In P, the running head shows through the plate and the guess
caption runs into the eye.

Note: the look-sheet stills appear to be before the LOK-030 finish (I's ground measures exactly 0,0,0), so I have not
judged grade or grain.

## MUST (fix before the look sheet goes to Sam)

1. **D 37.4-43.2, white rays read as dust.** The 5/7/9 px dots are the same size and colour as the inset ground's
   dust, so at phone size the shot's subject disappears. Set the overlay rays `size` to 10/13/16, add a soft glow (a
   second circle at 2.2x size, `#FFF6DD`, opacity 0.25, blur 4 px), and set `count` to 8 per kind. Drop the inset dust
   to opacity 0.4 for this shot only.
2. **E 43.2-50.2, white dots on the cream plate are invisible.** On the plate they render as grey hairline rings, so
   the rays never visibly reach the back of the eye. On the plate, draw each dot with fill `#FFF6DD`, a 2.5 px ring in
   `#2B2724` at 0.85 and shadow `0 1px 3px rgba(43,39,36,0.45)`, at sizes 12/15/18. Give the outgoing D dots the same
   look, so that the glide matches.
3. **E 48.26, "seen as pink" reads as "Lens ■ seen as pink".** The swatch caption sits on the Lens caption's baseline
   with about 30 px between them. Move it to the right of the optic nerve, below it: right-aligned at (1700, 800) with
   the leader to [1595, 632], so it sits 300 px or more from "Lens". Keep the 28 px `#E79AB9` swatch, but give it a
   1 px ink keyline (`#2B2724` at 0.6), because the swatch's edge is soft on cream.
4. **I 89-94.7, the candle disappears.** After about 90 s the candle clip leaves the frame or ends, and the last 4 s
   are a cool pink geranium alone on pure black (0,0,0). That is a lone object on an empty canvas, and the ground is
   off-series. Choose SRC-011's `clipStartSec` (or hold the last good frame / `playbackRate 0.7`) so the flame stays in
   frame and lit until 94.7, and check the 94.2 still. If the clip cannot cover 9 s, freeze on the last frame where the
   flame is lit (see SHOULD 4 for the flower's warm light).
5. **M 120.31-122.0, the dimmed band shows a hard dark rectangle.** The dim is a rectangle over the band, so the
   feathered ends and edges become a boxed bar with a black frame. The yellow also turns olive and muddy. Dim the
   band's own layer instead: `opacity 0.35` on the strip group, with feather and mask kept, not an overlay rect. Each
   segment then brightens to 1.0 on its cue.
6. **H 73.5-82.8, spectrum strips have a different finish from the rest of the act.** The rows-mode strips are hard
   rectangles with a 2 px black frame and ends that fade to black, so they read as UI progress bars. A0, K and M (and
   I's overlay strips, the same rows mode) are feathered. Give H's rows the feathered finish I already has: no frame,
   6 px top and bottom feather, ends fading to transparent rather than to black.
7. **P 156-166.3, the running head shows through the plate.** At 1.15x zoom the card covers x 1595-1800, y 98, and
   `5 · THE RAYS` ghosts over the cream (measured 129-207 grey on paper). Set the running head off for P, or keep it on
   the graphite by placing the plate below y 140.
8. **P, the guess caption runs into the eye and its underline is off.** On screen,
   `DALTON'S GUESS · A BLUE VITREOUS` spans x 634-1178, and "VITREOUS" sits on the hatched sclera and its leader. Set
   it on two lines (`DALTON'S GUESS` / `A BLUE VITREOUS`, pre-zoom (700, 820), 24 px line gap) so that it ends before
   x 1000 on screen. The accent underline at 157.06 runs x 765-838, under " GU", so it starts about 20 px early and
   stops short. Measure it from the rendered glyph box of "GUESS" (about x 787-870).

## SHOULD

1. **C 23.7-32.2 and M 120.3-130.5, the blurred page grounds read as plain brown.** At `brightness 0.38` and the
   default blur, p.90 and p.92 (body text) become an even brown with no page in it. F's title page reads because its
   type is large. As a result C and M read as graphite, and graphite is then about 40% of the act. For body-text
   pages: `blurPx 7`, `brightness 0.42`, focus on a line of type (C `focus [0.45, 0.55]`; M
   `[0.5, 0.45]`, over the chord numbers), so that rows of type show as soft grey lines. In C, also move the quote
   block left to x 640 (it ends by x 1270) so the left half is not dead.
2. **H, "sent back" reads weakly.** With brightness alone, the geranium strip looks almost like daylight, with a dark
   olive middle. Add a 2 px cream profile line (`#ECE4D2` at 0.8) 6 px above each SENT BACK strip, tracing the
   weights, with its height up to 40 px, so "more of some, less of others" reads at phone size. It needs no numbers.
3. **K 103.6-115 (and M), stepped blocks.** The seven fills meet with only about 8 px of blending, so the band reads
   as seven flat tiles. The guide says "never stepped bands", and the band looks unlike A0's band. Keep the dividers
   and widen the blend to ±40 px (or draw a continuous gradient with each named colour at its segment's centre). The
   ink dividers already do the dividing.
4. **I 85.7-94.7, the geranium is not lit by the candle.** It keeps its cool daylight pink, so it looks pasted on.
   Apply the world's `light warm` to the flower: multiply `#FFB46B` at 0.30 plus a warm rim from the left (lightFrom
   left).
5. **M, the string's end ticks miss the band.** The end ticks sit at x 192 and 1726, while the band runs 210-1710.
   Put the end stops at x 210 and 1710, as in the Expert's fix, so all eight stops line up with the band.
6. **O 149.7-151.7, blue dots inside the blue wash.** `#2F6BFF` on the `#3D6BD6` wash loses contrast, and the passing
   blue dots are the point of the shot. Give the dots inside the tint a 2 px paper ring (`#ECE4D2` at 0.9).
7. **O and P, two captions on one baseline.** "Lens" (italic serif) and `DALTON'S GUESS…` (mono) share the bottom
   baseline about 40 px apart, so they read as one line. MUST 8 moves the guess caption in P. In O, place it at (1230,
   960) with the same two-line set, or raise "Lens" to y 870.
8. **P 162.8 on, two accents.** The GUESS underline and the dashed cut line are both teal. Un-draw the underline when
   the cut line starts (`untilSec 162.80`), so the dashed line is the one accent at the end.

## TASTE (for Sam)

- A0 / K / M: the band is pure sRGB primaries (blue 18,15,254; cyan 0,239,244; lime 18,254,21; yellow 248,255,1),
  which reads like a default rainbow, and it is brighter than anything else in the series. Option: cap chroma (each
  channel between about 25 and 235) so it sits in the warm graded world. Judge after LOK-030.
- M: the `?` at 72 px is small for the act's turn. Option: 96 px.
- P: the dashed line in ink with only a short teal tick at the top would keep the end quieter.

## Per shot

| Shot | Time | Call | Finding |
|---|---|---|---|
| A0_band_title | 0-2.4 | PASS / TASTE | Feathered band and title are clean; the title 76 px sits well over the left end. See TASTE (chroma). |
| A_opticks_title | 2.4-9.0 | PASS | Card, highlights and tag in series. |
| B_p90_not_coloured | 9.0-23.7 | PASS | The callout dim and the kept line work; the quote column is good. |
| C_power_quote | 23.7-32.2 | SHOULD 1 | Quote chips good; the ground reads as nothing and the left half is empty. |
| D_sunlight | 32.2-43.2 | MUST 1 | The rays are lost in the dust. Sticker and chips good. |
| E_whoever_looks | 43.2-50.2 | MUST 2, 3 | Plate good; dots invisible; "Lens ■ seen as pink". |
| F_newtons_view | 50.2-64.5 | PASS | Best blur ground in the act; the accent chip is the only accent. |
| G_p3084_reflect | 64.5-73.5 | PASS | |
| H_choosing | 73.5-82.8 | MUST 6, SHOULD 2 | Stickers good; strips are boxed bars; the profile reads weakly. SENT BACK measures 6.3:1. |
| I_by_candle | 82.8-94.7 | MUST 4, SHOULD 4 | The sky world and overlay strips are good; the candle runs out and the flower is not candlelit. |
| J_most_people | 94.7-103.6 | PASS | The act 1 callback layout is in series. |
| K_seven | 103.6-115.0 | SHOULD 3 | Names and dividers clean; segments stepped. |
| L_p92_chord | 115.0-120.3 | PASS | |
| M_seven_notes | 120.3-130.5 | MUST 5, SHOULD 1, 5 | Dim rectangle; ground reads as plain brown; end ticks off. The note heads on the stops, the dashed indigo dividers and the `?` read well. |
| N_p29_acquainted | 130.5-144.2 | PASS | |
| O_eye_jelly | 144.2-156.0 | SHOULD 6, 7 | Plate, wash and legend are in series with act 3. |
| P_open_it | 156.0-166.3 | MUST 7, 8, SHOULD 8 | The closer framing works; the dashed line is clean and stops at the globe. |

Ground share: if C and M are counted as graphite (as they read now), graphite is about 66 s of 166 s (40%), at the
limit. SHOULD 1 brings it back to about 29%. No ground runs three shots in a row.

## Proposed STYLE_GUIDE.md lines

- **Light on paper** (Designer, act 5): rays crossing a cream plate are warm-white dots with a 2.5 px ink ring and a
  soft shadow, 12 px or larger; on dark grounds they are 10 px or larger with a soft glow, never dust-sized.
- **One finish for every spectrum in an act** (Designer, act 5): bands and strips are feathered (top and bottom, ends
  fading to transparent), never framed bars; dimming a band dims its own layer, never a rectangle laid over it.
- **A blurred page must still read as a page** (Designer, act 5): for body-text pages use `blurPx` 7 or less and
  brightness about 0.42, focused on a line of type; if it reads as flat colour, count it as graphite.
- **Captions on a plate keep apart** (Designer, act 5): two captions are never set on one baseline unless 120 px or
  more apart; a swatch caption sits beside the part it names.
