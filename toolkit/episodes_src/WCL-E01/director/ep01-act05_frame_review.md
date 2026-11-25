# WCL-E01 act 5 "The rays": Director's Gate 2 frame review

25 Nov 2026. Stills: `qa/WCL-E01-act05/review/` (17 sheets plus the half-size t*.jpg), `look_sheet.jpg`, `contact_sheet.jpg`, and act 4's last-frame still `public/assets/joins/act4_end_215.66.jpg`. Act file: `src/episodes/ep01-act05.json` from `gate2_act5/make_act5.py`. The brief's last section ("Applied after fact-check 2 and the Expert") overrides the earlier shot text where the two differ. All times are act seconds. Shot-local values (`atSec` in the act file) are given in brackets. I also sampled the candle clip `candle_lighting_mixkit3458.mp4` (12.96 s) at 0.3-12.5 s. No extra act stills were rendered.

## Verdicts

| Shot | Verdict | In one line |
|---|---|---|
| A0_band_title | PASS | The match lands the band within 25%: act 4's band is at (1103, 456) and the new band's centre at (960, 518). The title sits 38 px above the band's left end. |
| A_opticks_title | PASS | H1, H2 and H3 land on their words. The eye ends on OPTICKS. |
| B_p90_not_coloured | FIX | The callout and highlights are right. The source tag wraps and leaves "90" alone on its own line. |
| C_power_quote | FIX (minor) | The quote chips are right. There are 2.95 s of blur and a tiny chip before the first spoken chip. |
| D_sunlight | PASS | The white rays, the flower landing at (450-915, 405-705), ISN'T PINK and the tags are all as briefed. |
| E_whoever_looks | FIX | The white dots disappear on the cream plate. "Lens ■ seen as pink" reads as one phrase. |
| F_newtons_view | FIX (minor) | The name label sits under the bottom safe line. There are 2.55 s before the first chip. There is no running head. |
| G_p3084_reflect | FIX (minor) | The source tag wraps, and line 1 ends on a separator. |
| H_choosing | FIX (minor) | Good ensemble, and the two mixes read differently. The running head is 34 px above the DAYLIGHT strip. |
| I_by_candle | FIX | The candle clip burns out: from about 91.1 the world is black under "different mix". |
| J_most_people | PASS | The morph lands in the BY CANDLE cell. RED comes on "don't". |
| K_seven | FIX (minor) | 1.85 s of empty inset after the block wipe. The proportions and names are right. |
| L_p92_chord | FIX (minor) | H0, H1 and H2 are right. The source tag wraps "92". |
| M_seven_notes | PASS | The notes sit on the stops, with the hollow note at 210. The segments light on "colours". The `?` lands at (1299, 675). |
| N_p29_acquainted | PASS | The H1 dim works: measured (133,195,167) at 135.0 and (184,202,179) at 138.2. The notes land on their words. |
| O_eye_jelly | PASS (note) | The coloured dots read, the tint comes with its tag, and red and green thin in the jelly. |
| P_open_it | FIX | VITREOUS in the guess tag runs onto the sclera ring. The zoomed card rises under the running head. |

Honesty: every photo and clip is tagged (PHOTO TODAY · … · CUT OUT, TODAY · DAYLIGHT/CANDLELIGHT), every drawing has its ILLUSTRATION tag, and the tint is never shown without its tag. Texture: the placements match the brief. The scans get only the strokes, the TODAY footage gets nothing, the ink is crisp, and H's two stickers share one white edge.

## MUST (fix before Sam sees the look sheet)

**M1. I: the candle goes out.**
- **What is wrong:** SRC-011 is a clip of a candle burning down. The flame lies flat from about 9 s and is gone by about 12.5 s. With `clipStartSec 7.6`, playing from the world's start at 85.70, the clip ends at about 91.06. From there 92.40 and 94.20 are black apart from the strips and the flower, under "So by candle, the geranium has a different mix".
- **Change:** `worlds[1].clipStartSec` 7.6 → **0.5**. The flame stays upright from 0.5 to 9.5 s, which covers the 8.98 s the world is on screen.
- **Check:** stills at 87.6, 92.4 and 94.6 show the flame lit, and it is at least 60 px clear of the flower and the strips.

**M2. E: the rays cannot be seen on the plate.**
- **What is wrong:** the 5/7/9 px warm-white dots with a 1.5 px stroke at 0.6 read as faint hollow rings on the cream card (t47.40 and t49.20 at full size). On "reaches whoever is looking" there is no visible arrival.
- **Change (Builder):** in `OverlayRays.tsx` l.51, set `strokeWidth={r.strokeWidth ?? 1.5}`.
- **Change (E's ray):** `stroke "rgba(43,39,36,0.95)", strokeWidth 2.5`, and kinds `size` 7 / 10 / 13 (speeds and counts unchanged). The dots stay white, as the brief requires.
- **Check:** at 45.6 and 48.4, the dots read inside the globe at thumbnail size, and some are at the retina (x about 1478).

**M3. E: "seen as pink" sits on the same baseline as "Lens".**
- **What is wrong:** "Lens" (1090-1155, y 912) and the swatch caption (1185-1425, y 905) are 30 px apart and read as "Lens seen as pink", which is the misreading fact-check 18 removed.
- **Change:** set the caption to `at [1440, 820]` and keep `anchor [1595, 632]`. That leaves about 130 px to the ring at y 820 and puts the caption under the optic nerve.
- **Check:** at 49.2, the caption stands alone, with a short leader to the nerve.

**M4. P: VITREOUS touches the sclera ring.**
- **What is wrong:** after the 1.15 zoom, the end of the tag (to x about 1175, y 873) lies on the hatched ring (t156.40).
- **Change:** set the `DALTON'S GUESS · A BLUE VITREOUS` caption to `at [720, 885]` (it was [720, 836]), keeping the anchor. On screen that is about (640, 936), about 50 px below the ring and inside the card.
- **Check:** at 156.4 and 163.8, the tag is clear of the ring, the leader and the dashed line.

**M5. P: the running head sits on the zoomed card.**
- **What is wrong:** the card top rises to about y 68, so `5 · THE RAYS` is grey on cream, on the card's own border line (t156.40).
- **Change (Builder):** in `RunningHead.tsx` `allowed()`, honour `b.props.head === false`.
- **Change (P):** set `"head": false`. A zoom cannot keep the card 60 px under the head.
- **Check:** at 156.4, no head on the card. The head fades out at O's end.

**M6. B and L: the source tag leaves the page number on a line by itself.**
- **What is wrong:** `ISAAC NEWTON · OPTICKS · 1704 · P.` / `90` (and `92`) does not fit the 28 px mono tag in the 690 px column.
- **Change (Builder):** add `ArchivalScanCard.sourceSize` (default 28). Set `sourceSize 24` on B and L. About 605 px then fits on one line. No change to the fact-checked text.
- **Check:** at 11.0 and 117.4, the tag is one line.

**M7. F: the name label sits under the safe line.**
- **What is wrong:** `ISAAC NEWTON · OPTICKS, 1704` at `y 980` renders at about y 1002, which is past the 996 safe line.
- **Change:** `labels[0].y` 980 → **960**, the same line as the act's other bottom tags.
- **Check:** at 53.6, the label's bottom is at or above 996.

## SHOULD

**S1. G: the source tag breaks after a separator.**
- **Change:** let `source` take `\n` (`whiteSpace: pre-line`). Set `"ISAAC NEWTON · PHIL. TRANS. NO. 80\n1672 · P. 3084"`.

**S2. C: 2.95 s before the first spoken chip on the blur.**
- **What is wrong:** the taste note allows at most 2 s on a blur ground.
- **Change:** add `panel.chips: [{"text": "All they have", "atSec": 0.65, "x": 860, "y": 190, "size": 52, "dimSec": 2.95, "dimTo": 0.35}]`. These are spoken words, on "All" at 24.39.
- **Check:** at 25.0, the chip is lit, and its bottom is 40 px or more above line 1 (y 300).

**S3. F: 2.55 s before the first chip, with only a small label in the corner.**
- **Change:** add the chip `on Newton's view` (480, 130) at `atSec 1.29` (51.54), with `dimSec 11.21, dimTo 0.3` like the others.
- **Check:** its top is 60 px or more from the running head line once S4 is done.

**S4. D and F: no running head, though the brief puts one on both.**
- **What is wrong:** KeywordPanel is not in `HEAD_ON`.
- **Change:** with the M5 flag, set `"head": true` on D and F. The new flag only overrides when it is present, so acts 1-4 do not change.

**S5. H: the running head is 34 px above the DAYLIGHT strip's right end.**
- **Change:** move the DAYLIGHT row's `y` from 150 to **175**. Its label follows. The geranium top (about 300) stays 79 px clear.

**S6. K: 1.85 s of empty inset after the red block.**
- **What is wrong:** the block is meant to "reveal K's red band".
- **Change:** `divisions.drawAtSec` 1.85 → **0.65**, on "Newton" at 104.26. The band is whole at 105.55 for "rainbow", and the dividers and names do not change.

**S7. I: the carried geranium keeps its daylight pink on the candle world.**
- **What is wrong:** at 87.6 and 92.4 the flower looks the same as on the sky (rule 11).
- **Check:** confirm that LayerStage's carry takes world 2's `warm` cast after the dissolve. Sample the petal at 84.6 and at 88.0: the second should be warmer and darker. If not, add the cast for `light: "warm"` worlds.

## NOTES (taste; no change needed unless Sam asks)

1. **A0:** the match is a blur dissolve with a slight scale, not a visible growth. The old chips ghost for about 0.3 s. That is acceptable.
2. **C and M:** the blur grounds (p.90, p.92) are nearly flat grey at brightness 0.38, so the "same page" relation is barely visible. F's title-page blur reads well because of its large type. Raise brightness to 0.5 if Sam wants the page felt.
3. **E and O:** the plate's top-right corner sits about 24 px under the running head. This is act 3's approved plate geometry, so it is kept.
4. **O:** `Lens` (y 912) and `DALTON'S GUESS · A BLUE VITREOUS` (y about 930) are near one baseline. The fonts differ (italic serif vs mono caps), so they read as two things.
5. **D:** the first chip comes 1.83 s after the slide, against the 1.5 s note. It is accepted because MUS-012 enters there and the words are on their cue.
6. **Look sheet:** for row 4 (C, D), pick 31.4 and 42.7, not the empty early frames. Otherwise Sam judges the act on blank grounds.

## Stills wanted (next round)
- 85.7, 87.6, 92.4, 94.6 (M1, S7).
- 45.6, 48.4, 49.2 (M2, M3).
- 156.4, 163.8 (M4, M5).
- 11.0, 64.9, 117.4 (M6, S1).
- 53.6 (M7, S3); 25.0 (S2); 33.2 and 51.0 (S4).
- 74.2 (S5); 104.8 and 105.6 (S6).

## Taste-log lines for DIRECTOR_NOTES.md
- 2026-11-25 | WCL-E01 act 5 E | White "colourless" rays with a 1.5 px ink edge vanished on the cream plate; nothing visibly reached the eye on "reaches". | Dots crossing a light card get a ≥2.5 px ink edge and ≥7 px size; judge them at thumbnail size on the still where they arrive.
- 2026-11-25 | WCL-E01 act 5 I | SRC-011 is a candle burning down; `clipStartSec 7.6` let it go out, and the world went black under the act's key line. | Before setting clipStartSec, sample the clip to the shot's last frame; a world must not end or change state under the line.
- 2026-11-25 | WCL-E01 act 5 E + P | A new caption next to an old one on the same baseline read as one phrase ("Lens ■ seen as pink"); a zoomed plate rose under the running head. | Captions on one plate keep 150 px or a different line; a zoom keeps the card 60 px under the head, or the head is switched off for that shot.
