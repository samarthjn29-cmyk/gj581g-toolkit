# Gate 3 picture pass: WCL-E01 act 1 v2 (Designer + Editor), v1

Clip `library/out/WCL-E01_act1_v2.mp4` (1080p, 104.6 s). Act file `library/src/episodes/ep01-act01-v2.json`; generator
`rework_act1_v2.py` on `rework_act1.py`. This is a new act version, so the whole act was reviewed. Frame sheets are in
`/tmp/pp` (s01-s13, crops c01-c16). The magenta box on the sheets is the 120x84 safe area. Read before review:
DESIGNER/EDITOR/ENERGY/STYLE_GUIDE, both notes files, the scorecard, the v2 brief and colour_v1.md.

**Verdict: Fix first.** The new v2 work (the fly-in, the focus match, the scrap, the geranium layer shot and the desk
texture) mostly lands. The fly-in in particular is good. Nine MUST fixes remain. Four of them share one root cause:
components written for the dark LOK-009 theme take **theme tokens that flip on LOK-033 Studio Cream** (`ink` is now
dark and `canvas`/`panel`/`dimMask` are now cream). That causes a negative Dalton portrait, a cream flash between
two dark shots, milky corners on the candle, and an unreadable "John Dalton". These are component fixes. They also
need checking in every other act that runs on LOK-033.

## MUST

1. **25+26 and 27+28, 62.6-72.2 (frames 63.5, 64.8, 66.0, 68.6): the collage pieces render as photographic negatives.**
   Dalton's 1834 halftone has a black face and a white coat (c11; the file itself is correct, c13). The 1808 atoms
   plate is white on black, and the p.29 strip ("HIS OWN WORDS · P. 29") is white type on a black scrap. This breaks
   "period portraits ... never colourised, flipped or retouched". A dark-faced Dalton is not shippable.
   Cause: `DuotoneCollage.tsx` Piece `paper = p.color ?? t.colors.ink` and Ink fill `t.colors.canvas`. On LOK-033
   that gives a dark paper with cream dots.
   Fix: take the paper and ink from the theme by lightness. Paper = the lighter of (`canvas`, `ink`) or `panel`
   (#FFF8EC). Dots = the darker (`ink` #1E1A17). Re-render 25+26 and 27+28 and check that the face is light.

2. **35+36 entry, 90.45-90.85 (s12): a cream paper band sweeps between two near-black shots.** The guttering candle
   (L* 1.5) goes to a cream band and then to Newton's dark room. It reads as a flash in the quiet close.
   Transition `{"dir": "up", "tone": "dark"}`, but `PaperBandWipe.tsx` l.51 maps `dark` → `t.colors.panel` (cream on
   LOK-033) and `paper` → `t.colors.ink` (dark). The same inversion is why the 62.6 band ("tone paper") is dark
   (62.9).
   Fix: in PaperBandWipe use the darker theme token for `dark` and the lighter one for `paper`. A stopgap in the act
   only: swap the two tones (35+36 → `"paper"`, 25+26 → `"dark"`).

3. **02+03+04 and 05+06+07, 3.9-19.5 (6.5, 9.0, 14.4): an inverted vignette.** The candle sits in a black oval with
   milky grey corners: corner pixels are (104,98,89), the mid-frame ring is (16,11,8). Shots 23 and 34 show the same
   candle with black corners (57.6: (6,6,6)), so the clip changes look between uses. It also looks like a fogged
   porthole.
   Cause: `LayerStage.tsx` l.451 vignette uses `t.colors.dimMask`, which is `rgba(244,236,221,0.82)` on LOK-033.
   Fix: give the footage/photo vignette a fixed dark `rgba(22,21,20,0.8)` (as LOK-009), or add a theme `vignette`
   token.

4. **24, 60.2-62.6 (c10): "John Dalton" headline is unreadable.** It is ink #1E1A17-ish on the near-black blurred
   portrait, about 1.3:1 contrast. `ParallaxCutout.tsx` l.97 `color: t.colors.ink`.
   Fix: a light colour on this dark ground (`t.colors.panel` #FFF8EC, or a `headlineColor` prop set to it). Keep the
   kicker as is.

5. **05+06+07, 16.75-17.15 (s04 16.90, c02 17.10): a half-erased label rides the daylight wipe.** The chips
   ("anium", "ing rare") are still erasing when the wipe starts. At 17.10 the fragment `ZONALE'` sits alone on the
   TODAY sky, so a Dalton-era label shares a frame with the TODAY world.
   Fix: `labels[0].untilSec` 5.50 → **4.95** (16.05) and overlay panel `untilSec` 5.50 → **4.95**, so both exits
   finish before the wipe at 16.70. "rare." ends at 15.65, so reading time stays.

6. **05+06+07, 17.3-19.5 (c02 17.60): `TODAY · DAYLIGHT` sits below the safe line.** The chip spans y ≈ 984-1021
   (the safe line is at 996). `LayerStage.tsx` l.459 hard-codes `bottom: 60`. The caption at l.464 has the same
   problem.
   Fix: `bottom: t.safe.y` (84) for both.

7. **11+12+13, 31.45-33.86 (s06 32.2, measured): the punch "astonishingly changed" is off the safe area.** The
   accent chip spans y 896-1051 and the type reaches about 1015.
   Fix (rework_act1.py BURST 1): punch `y` 900 → **835** (size 110 kept, bottom ≈ 990). The chip then lands about
   50 px over the dimmed "by the candle". That is fine for a slam, but set the set-up chips' `dimTo` 0.3 → 0.15.

8. **24, 61.13-62.6 (c06 61.2): "not a silly man" chip runs past the right safe line.** The chip spans x 1018-1850 and
   the type ends near 1820.
   Fix: overlay chip `x` 1020 → **960** (right edge ≈ 1790).

9. **25+26, 62.6-67.8 (c11 63.5): the `JOHN DALTON · 1834` caption on the collage portrait is above the safe line.**
   The top is at y ≈ 56.
   Fix: halftone piece `y` 450 → **490** (caption top ≈ 96). This is re-checked after fix 1 in any case.

## SHOULD

1. **02+03+04, 4.0-5.4 (c03): the scrap's source chip is 16 px, under the 20 px floor (DESIGNER_NOTES 24 Nov).**
   `LayerStage.tsx` l.321 has `fontSize: 16`. Fix: set it to 20. Also shorten `route.source` to `"KITCHIN · 1794"`.
   That is the style guide's own example for this map, and LAURIE & WHITTLE is the publisher, which drifts towards
   the "no credits" line. The chip's bottom stays at about 990.
2. **02+03+04, 5.30-5.45 (s02b 5.43): the dateline `KENDAL` lands over the still-visible sinking scrap.** Two KENDAL
   labels are on screen for about 4 frames. Fix: tag part 1 `atSec` 1.60 → **1.76** (5.46), with "AUTUMN 1792" at
   1.77 kept (or 1.80).
3. **02+03+04 → 05+06+07 push, 11.23-11.33 (s13): `JOHN DALTON · TEACHER` vanishes in one frame at 11.27**, and the
   corner dateline cuts off at about 11.35. Neither is carried by the push. Fix: give both an exit ending by 11.05:
   label `untilSec` 7.30 (11.00), and tag `untilSec` 7.30 if the tag supports it. Also, the flower's `rise` (11.25)
   happens inside the push and has already landed by 11.33, so two entrances overlap. Fix: carry `atSec` 0.15 → 0.45
   (11.55), so the rise is seen on "flower".
4. **11+12+13, 26.22 vs 26.40 (s05b): the page-turn foley is about 5 frames before the first moving frame of the
   turn.** Unless the Pixabay file has about 0.17 s of pre-roll, move SFX-028 to about 26.36 (the Sound reviewer
   should confirm the transient).
5. **05+06+07: the modern geranium cut-out has no honesty tag now that the credit is gone (11.25-16.7).** The style
   guide keeps `PHOTO TODAY` for a modern stand-in. Removing "PHOTO D. J. STANG ..." (correct under the new
   no-credits rule) also removed the only signal. Ask the Director whether a small `PHOTO TODAY` chip belongs under
   the flower in the candle part (the same question applies to 20-22).
6. **29+30+31, 78.1-79.15: `HIS GUESS · 1794 · A BLUE-TINTED FLUID` is up for 1.05 s** (7 words, the act's answer
   beat). Fix: labels[0] `untilSec` 6.95 → **7.50**, so it hands straight to `1844 · THE FLUID: CLEAR` at 7.55.
7. **29+30+31, 79.0-81.4: "His idea will fail the / test." breaks with an orphan.** Fix: text
   `"His idea will fail\nthe test."` (or a narrower line width).
8. **37, 95.4-98.6 (c15 97.0): a thin lens-rim arc stays on the left frame edge for 3 s**, which looks like an
   unfinished dive. Fix: let the final lens radius clear the frame (or fade the rim out by 96.0).
9. **32+33, 87.20: the sub impact (the act's one big line) has no picture hit.** The counter locked to the accent at
   85.88 and nothing changes at 87.2 (86.9 and 87.4 are the same frame). Fix: a 1.0 → 1.06 → 1.0 scale pop or a shadow
   bloom on "151" at local 5.80.
10. **05+06+07, 15.0-15.6: "nothing rare" touches the flame's reflection.** The brief asked for at least 60 px of
    clearance, and the footage flame drifts. Fix: chips `y` 640/760 → 620/740 with `x` 140 kept (or x 120).

## TASTE (for Sam)

- **05+06+07 daylight (17.3-19.5):** the flower floats on the clouds with no edge or shadow, close to clip art. The
  house sticker (6 px white edge, soft shadow, 2-3° tilt) would make it an object in today's world.
- **3.7-19.5:** the same candle clip for 16 s across two shots (accepted in the brief). After MUST 3 it will at least
  match 23 and 34.
- **Accent vs data red:** "red." (35.18) and "fail." in accent #FF4F2E sit beside the RED data swatch #C8402F. They
  are close hues, so the word and the colour can read as one thing. This is acceptable as a word, but it is Sam's
  call.
- **Paper desk texture (19.5-33.9):** TEX-009 at 0.2 reads as soft mottled clouds, more "stained" than "paper fibre".
  If Sam wants it quieter, use 0.12.
- **34, 89.3-90.3:** about 1 s of near-black with only an ember. It is a deliberate gutter, but on a phone it can read
  as a dropout.

## Boredom pass ("Where would a viewer reach for their phone?")

1. **6.7-9.5 (02+03+04):** a candle and a small corner tag, with the music alone, inside the first 10 s, where the hook
   must hold. The push 0.04 is not visible on the sheet. Change: camera `push` 0.04 → 0.10 with `pan` about -150
   towards the flame (ENERGY rule 5), so the breath moves.
2. **21.2-24.6 (08+09+10):** a static page between "by day" and "sky blue" (3.5 s). Change: a slow 4-6% drift onto
   the highlighted lines, or the "sky blue" highlight at about 23.0.
3. **39-47 (rows):** a small table on a large cream field (ENERGY rule 3 asks tables at 1.2x). The chips keep it alive,
   but scale the table 1.2x if it is reopened.
Everything else changes at least every 2-3 s. The stillness check (1.8 s longest) agrees.

## Passes (checked)

- **01 fly-in:** the eye starts at the centre, the pin lands at 0.80 on Kendal (c16), and NORTH OF ENGLAND and the
  TODAY tag (now without NASA, which is correct) exit by 3.0. Kendal lands at (960, 420) at 3.68.
- **Focus match 3.70:** the frozen WebGL frame is present at 3.70-3.90 (not blank). The scrap circle lands on the same
  pixel (960, 416). TODAY never shares a frame with 1794 or 1792, and 1794 never shares one with 1792.
- **Daylight wipe 16.7-17.9:** it reads as "the change itself", and the flower's move to the centre is eased.
- The slide at 19.5, the page turn at 26.3, the red flood at 33.86, the push at 49.1, the dive at 51.7, the flash at
  57.0, the match at 67.8, the lens at 72.2 and the title/episode cards all read with no bare frames.
- Every chip lands on its word. No credits are on screen anywhere in the act.

## Proposed notes lines

- DESIGNER_NOTES: 2026-11-25 (act 1 v2 Gate 3): on a light theme (LOK-033), check every component that takes
  `ink`/`canvas`/`panel`/`dimMask` as a fixed role (collage ink, band tones, vignette, headline colour). Negatives,
  cream vignettes and dark-on-dark type all come from this.
- EDITOR_NOTES: 2026-11-25 (act 1 v2): every label exit finishes before a world wipe or swap starts, not only before
  frozen-frame transitions.
