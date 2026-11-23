# WCL-E01 act 1 v17 + act 2 v8: independent review (gate 3)

Clips: `library/out/WCL-E01_act1_v17.mp4` (1920x1080, 30 fps, 104.60 s) and `library/out/WCL-E01_act2_v8.mp4` (175.57 s). I checked them against `ep01-act01.json`, `ep01-act02.json`, the script (`WCL-E01_script_v2.json`, scenes 1 and 2), the word times (`01_flower_paced_words.json` +0.8 s, `02_brothers_even_words.json` +2.4 s), both SRTs, the two voice audits and the component sources (`TravellingMap.tsx`, `LensSettle.tsx`, `layers/Label.tsx`, `LensDive.tsx`, `DatelineTag.tsx`). All times are **clip seconds** unless a prop value (shot-relative) is quoted.

Method:
- 30 fps strips at every changed label swap, the lens settle, the pin drop, the map's moves and the cuts in and out of the map. Contact sheets at 0.5 s across both acts, plus 1 s sheets of the stockings scene at 640 px.
- Pixel measures: the teal pin tracked frame by frame (27.9-32.3); dark-pixel counts on the four frame edges of both map shots; edge rows during the lens settle.
- Sound, act 1: the voice subtracted from `_raw.mp4` (corr 0.999, gain -0.01 dB). The residual floor is about -60 dBFS and the voice median is -22.2 dBFS (50 ms).
- Sound, act 2: there is no v8 raw, so I subtracted the voice from the final mix (corr 0.987, +3.1 dB). The bed stays in the residual (about -25 to -40 dBFS), so texture cues cannot be measured directly. I mapped every cue's file envelope (atSec, volumeDb, fades, endSec) against the word times instead, and compared it with the v5 residual at the same bed position.
- Captions: parsed for order, overlaps, length and duration, and diffed word by word against the script.
- Loudness: ebur128 on both final mixes.

**Loudness: act 1 -16.0 LUFS integrated, true peak -1.8 dBTP, LRA 6.4 LU. Act 2 -16.0 LUFS, -1.9 dBTP, LRA 5.2 LU. PASS.** The audio streams are still a little shorter than the video: 67 ms in act 1 and 58 ms in act 2. The joiner must carry the bed across.

## MUST-FIX

1. **Act 2, 26.8-30.3: the TravellingMap shows the edge of the map.**
   - Problem:
     - From 26.80 to 27.93, a strip about 80 px wide down the whole left side of the frame is the bare canvas with the OpticalStack dot grid, plus the scan's dark margin. A plain paper border runs beside it, out to about x 260.
     - The first camera framing is at `center [1050, 2920]`, `zoom 0.86`. That puts the left frame edge at about map x -64, which is off the map.
     - From 28.4 to 30.3, during the tilted move (`cams[1]`: zoom 0.7, tilt 24, turn -4), a dark wedge shows in the top-left corner. It is up to about 60 px wide at the top and covers 35% of the 60x150 px corner. The tilt widens the far edge of the map past x 0.
     - This lasts about 3 s on the act's hero cinematic move. It reads as a prop on a table, not a world.
   - **Fix (props):**
     - `cams[0].center [1050, 2920] → about [1360, 2920]`. The left edge then sits at about map x 240, inside the neat line, and Eaglesfield lands at about frame x 530.
     - `cams[1]`: either `zoom 0.7 → 0.8` or `center [1480, 3330] → about [1700, 3330]`. With center 1700 at 0.8, Eaglesfield sits at frame x 286 and Kendal at 1188, so the whole route stays in frame.
     - Check stills at 27.0, 28.5, 29.5 and 30.2.
   - Component: TravellingMap could clamp the camera so that the tilted viewport never leaves the image. The image's four corners, projected through the same rotateX, scale and perspective, must cover the frame. Then no later map can repeat this.

2. **Act 2, 28.58: the Kendal pin lands with no sound, and it lands after its word.**
   - Problem:
     - There is no cue between the pencil route texture (27.40, which has died by 28.27) and the low whoosh at 32.15. In the v5 residual at the same bed position, the small bump at 28.46-28.62 is the same, so it is the bed and not a sound effect.
     - "Kendal," runs 27.98-28.32. The pin only becomes visible at about 28.30, because the accelerating fall keeps it below a third of its opacity for most of the drop. It lands at 28.58, after the word.
     - The echo ring shows at about 28.60-28.85.
   - **Fix (props):**
     - `pins[1].atSec 1.61 → 1.38`. The pin then lands at about 28.35, at the end of "Kendal,", and the ring runs from 28.35.
     - Add a short click at `atSec 28.33`, about -24 dB, in the pause 28.32-28.64 (the next word is "a"). For example SFX-019 `switch_click`, if its per-episode count allows. SFX-018 `stopwatch_tick_v3` would be that row's fourth and last beat in the episode.
     - MOT-012 asks for the drop "on the place's word". This keeps the drop on the word and puts the sound in the pause.

3. **Act 1, 79.7-80.9 (LensDive chips): 1844 · THE FLUID: CLEAR is readable for only about 0.4 s, and both chips fade.**
   - Problem:
     - The chip arrives at 80.31 and is fully up by 80.43. At 80.85 the `out` zoom starts, and the chip moves up with the circle and fades. It is gone by about 81.0.
     - That leaves 0.4-0.45 s of full readability for the line that pays off "His idea will fail the test". It is under the channel's ~1 s minimum.
     - Both LensDive chips are the component's own chips, not `layers/Label`. They enter as an opacity fade (`reveal`) and leave as an opacity fade: HIS GUESS · 1794 · A BLUE-TINTED FLUID fades from 79.73 to 79.97 at full width.
     - So the brief's claim that every on-screen label now un-wipes is not true here. A fade in and a fade out is a plain fade.
   - **Fix (props):**
     - `labels[0].untilSec 7.51 → 6.95`, so HIS GUESS leaves 79.15-79.55, on "will".
     - `inside.clearAtSec 7.51 → 7.55` and `labels[1].atSec 8.11 → 7.55`, so the fluid clears and the chip arrives on "fail" (79.71).
     - The chip is then readable from about 79.9 to 80.85, about 0.95 s. There are more than 6 clear frames between the two chips.
   - **Fix (component):** render LensDive `labels` through `layers/Label` (or reuse its `exit` and clip-path un-wipe). Keep the last chip at full opacity for the first 0.25 s of `out`.

4. **Act 1, 4.16: the cold-open dateline jumps.**
   - Problem:
     - At 4.13 the tag reads KENDAL · NORTH OF ENGLAND.
     - On the next frame, 4.17, "· NORTH OF ENGLAND" is gone. The centred chip snaps narrower, and KENDAL jumps right by about 245 px (the chip's left edge moves from about x 624 to about x 870).
     - The cause is in `DatelineTag`: a part with `untilSec` is filtered out of `shown` on one frame. Nothing animates its exit or the change in chip width.
     - Its entry is a fade, but its exit is a pop. This is the first 5 s of the episode, on "An autumn evening". This is not new in v17, but it is the one hard jump left in act 1.
   - **Fix (component):**
     - Give a part with `untilSec` the MOT-013 un-wipe (clip its span from the left over 0.4-0.5 s).
     - Then animate the chip's width, or its x for the centred position, over about 0.4 s with SLOW_OUT, so KENDAL glides to its new centre.
   - A props-only stop-gap would be to drop `untilSec 4.16` and let the tag run KENDAL · NORTH OF ENGLAND · AUTUMN 1792. That runs past the script's tag text (KENDAL · AUTUMN 1792) and is long for the corner, so the component fix is better.

## SHOULD-FIX

1. **Act 2, 30.9-32.3: the start of the route sits under the dateline tag.**
   - In the last framing, the Eaglesfield pin is at about (135, 60), just above the KENDAL · WESTMORLAND chip (x 120-573, y 82-138), and the first part of the red route runs behind the chip.
   - The start of the journey is hidden while "since he was fifteen" is spoken.
   - Fix: `cams[2].center [1940, 3700] → about [1900, 3560]` (pans the view up-left, so the pin and route start come down and right, clear of the chip). Or drop zoom to about 0.78. Check a still at 31.9.

2. **Act 2, 166.25-167.25: labels dissolve with the flower at the match cut.**
   - RED · HIS WORDS and ALMOST NOBODY ELSE SEES IT have no `untilSec`, so they stay on until the new match cut (it was a slide in v5) and dissolve together with the geranium (167.1-167.25).
   - MOT-013 asks that a tag leave before its object, and that labels on footage leave before the cut.
   - There is a pause from 166.25 to 167.55.
   - Fix: `labels[1].untilSec 5.75` (166.05) and `labels[2].untilSec 5.9` (166.20). ALMOST NOBODY still reads 164.4-166.2.
   - The same pattern exists at 32.3 (IN KENDAL FROM AGE 15 rides the push) and 38.34 (WHAT DO YOU SEE? rides the match). The v5 review accepted riding through a push, so treat those two as optional.

3. **Act 1, 72.20-72.97 and 95.30-95.88: the Turner portrait is on screen alone.**
   - LensDive opens on the bare portrait, with no tag, kicker or bracket, for 0.77 s (until "Tested") and for 0.58 s (until "Open Dalton's eyes").
   - The channel rule is never a photo of a person alone without design around it. Act 2 66+67 already does this right with a corner tag from frame 0.
   - Fix: a corner tag `JOHN DALTON · 1834` from 0, at least until the first line arrives, in both LensDive shots. The tag could also be a mono `lines` entry in row 2 until 3.4 s in shot 29+30+31, before EXAMINED… takes row 2.

4. **Act 1: sound cues on Sam's words.** These are outside the changed areas and not new, but they are measured on the raw render against a voice median of -22.2 dBFS.
   - **Pencil, 59.85:** peak -33.8 dBFS under "but Dalton". It is only 11.6 dB under the voice median, while the act 2 texture cues sit 20-24 dB under. Fix: `volumeDb -20.6 → about -31`.
   - **low_whoosh, 48.95:** peak -32.8 at 49.42, on "So who's". Fix: `atSec → 48.80` puts the peak at about 49.26, before "So" (49.28).
   - **The rest:** air_swish 54.12 on "be so" (-35.6), low_whoosh 10.95 on "a flower" (-34.6), air_swish 90.37 on "dark room," (-35.6), dial_turn 54.72 on "sure where" (-40.0), switch_click 95.88 on "open" (-38.3).
   - All are 13-20 dB under the voice, so none masks a word. They break the "cues in pauses" rule because their transitions sit on word boundaries. Either move each one so its peak lands in the nearest pause, or record them as accepted sync accents.
   - In act 2, every cue that overlaps words is texture at 20+ dB under (pencil, ticker_run, typewriter, room tone) or sits in a pause, except the cloth_slide (SHOULD-FIX 8).

5. **Act 1 captions: three cues are under 1 s.**
   - Cue 12 "changed." 32.45-33.33 (0.88 s), cue 17 "sees." 44.77-45.57 (0.80 s), cue 31 "he dies." 76.52-77.50 (0.98 s).
   - Each has a pause after it. Extend the ends to 33.50, 45.80 and 77.55 (the next cues start at 33.86, 46.14 and 78.77).
   - Everything else passes. Both SRTs are numbered in order, with no overlaps, no line over 42 characters and no 3-line cues. They match the script word for word, apart from numerals (1792, 151, 1766, 50, 15, 30), which is the house style.

6. **Act 2, about 88.0-98.6: the JONATHAN · DARK tag sits on the caption block.**
   - After the pull-back, the tag's bottom edge overlaps the top of the LONSDALE… / STOCKINGS… / RIJKSMUSEUM… caption box by a few pixels (clearest at 90.3; just touching at 93.6).
   - The caption text stays readable, but two chips touch.
   - Fix: `tags[1].y 885 → about 860`, or move the caption block down or right by 15 px.

7. **Act 2, 95.1: the MOTHER · RED tag lands with no sound.**
   - JOHN's landing (about 86.2) has page_turn (86.02, peak 86.16) and JONATHAN's has pages_move (87.93). MOTHER (`hard: true`, 30.98 → 95.16) has nothing, and it lands on "mother who is".
   - Fix: `tags[2].atSec 30.98 → about 30.45`, so it lands in the pause 94.52-94.84 (before "and a mother"), with a soft tap there at -28 dB, like the other two.
   - Or keep it on "mother" and accept a tap 25 dB under the word.

8. **Act 2, 70.05-70.97: the stockings' cloth_slide sounds under "He buys them for", 1.5 s after the slide.**
   - The stockings slide in at 68.43-69.33. SFX-021 `cloth_slide.wav` at 69.52 (-22 dB) has its energy late in the file. Within 20 dB of its peak it runs 70.05-70.97, peaking at 70.85, so it falls under "He buys them for" (70.42-71.08).
   - In the mix it rises about 5-8 dB above the bed at 70.88-70.96, about 10-12 dB under the voice median. That is louder than a texture cue should be, and it no longer matches the movement it belongs to.
   - Fix: `atSec 69.52 → 68.85`, `endSec 70.35`, `fadeOutSec 0.1`, `volumeDb -22 → -26`. Its body then fills the pause 69.37-70.42, just after the slide settles.

## PASS notes for the changed areas

**Act 2 shots 12+13, TravellingMap v2 (26.37-32.30), apart from MUST-FIX 1 and 2:**
- Band in at 26.37-26.9 and push out at 32.3 are both clean.
- Camera:
  - The moves are eased and continuous. The pin's screen path is smooth on every frame from 30.30 to 31.70, with no steps.
  - The lag reads as a small orbit. The turn and tilt finish about 0.25 s after the position.
  - holdTilt creeps without any visible jump.
- Depth of field:
  - The top of the map goes soft, the middle band is sharp, and the pin, tag, labels and caption stay sharp.
  - Kendal sits at y 874 during 28.6-30.2, just below the sharp band (380-840), but the map lettering around it is still readable. By 31.5 Kendal sits in the band at y 635.
  - Below the band the map softens only slightly: the mask ends at y 1254, so the bottom edge stays 42% sharp. That is fine for a tilted map.
- Route: it draws 27.40-28.70 from the Eaglesfield pin to Kendal. Its pencil texture (27.40, -29 dB) is about 20 dB under the voice, which is right for a texture.
- Text and facts:
  - KENDAL arrives on "Kendal" (27.98) and WESTMORLAND at 28.80. Both match the map and history: Kendal is in Westmorland.
  - IN KENDAL FROM AGE 15 (accent) arrives at 30.54 and reads from 30.7 into the push. It matches the script ("since he was fifteen") and its fact-check.
  - The caption MAP · EMANUEL BOWEN · 1760 · YALE UNIVERSITY LIBRARY is on throughout.
- Label overlap: the label never touches the pin. The pin's path passes right of the label and above it.

**Act 1 shots 29-31, lens settle (72.20):**
- The portrait lands blurred and slightly large on 72.20. It is sharp by 72.27 and settles fully by about 72.9, with no gap at any frame edge.
- The top and bottom edge rows dip for only 2-3 frames, on a dark ground. This is invisible.
- The tick (SFX-003 shutter_vintage, 72.18 at -24 dB) sounds 72.16-72.30 and peaks at 72.26 at -38.2 dBFS, 16 dB under the voice median. It sits in the pause: "flower." ends 71.44 and "He'll" starts at 72.34. That is 60 ms after the cut, which is in sync.
- This is the only lens cut in the act, within TRN-017's limit of 1 in 4.

**Un-wipe exits (`layers/Label`, MOT-013):**
- Every Label with `untilSec` retracts from its left edge in reading order, with a short fade at the end:
  - BORN 1766 (7.53-7.87)
  - NORTH-WEST ENGLAND (9.47-9.87)
  - THE GERANIUM, 1792 (36.20-36.52)
  - SKY-BLUE · HIS WORDS (162.80-163.13)
  - THE SAME COLOUR NAMES (153.77-154.10)
  - NOBODY HAS EVER TOLD YOU (157.42-157.75)
- Same-slot clear frames:

| Swap | Clear frames |
|---|---|
| BORN 1766 → NORTH-WEST ENGLAND | 7.87-7.93 (3) |
| NORTH-WEST ENGLAND → A QUAKER FAMILY | 9.87-9.93 (2-3) |
| THE SAME COLOUR NAMES → NOBODY HAS EVER TOLD YOU | 154.10 (1) |
| NOBODY HAS EVER TOLD YOU → NOBODY ELSE CAN SEE… | 157.75 (1) |

  - The last two meet the rule but have dropped from 2-3 frames in v5 to 1, because the un-wipe takes longer than the old fade. Taste: `untilSec 3.12 → 3.02` and `6.76 → 6.66` give 3-4 clear frames without moving the incoming labels off their words.
- No label overprints another.

**Accent settle (MOT-014):** no label in either act sets `settle`, so there is nothing to check. The labels that are teal (A QUAKER FAMILY, WHAT DO YOU SEE?, NOBODY HAS EVER TOLD YOU, IN KENDAL FROM AGE 15, RED · HIS WORDS) are fixed `accent` labels.

**Stockings scene (64.18-98.63), redesigned in the earlier pass:**
- The page is the real Lonsdale 1874 p.99, and the highlights follow the narration in order.
- The typed quotes match the page: 'a bluish dark drab' (with LONSDALE, 1874 · P. 99) and 'as red as a cherry'.
- The caption says RECOLOURED, and the REPORTED COLOURS tag is on throughout.
- DARK reads clearly on the paper ground, and no faces appear.
- Sounds: the wrap's paper_move (78.76-79.29) sits in a pause. The cloth_slide does not (see SHOULD-FIX 8).
- "A sensible dark colour." is narration wording (the page has "bluish dark drab, and quakerish enough"). It is set without quote marks, so it is not presented as a quote. Taste: it uses the same large serif as the two real quotes. A lighter or italic setting would keep the difference obvious.

**Match cut, act 2, 166.9:** clean, and JOHN DALTON · 1834 is on from the first frame. The air_swish at 166.82 still sits in the pause, but see SHOULD-FIX 2.

**Channel rules, both acts:**
- No laugh sounds.
- Real people appear only in real pictures (the Turner portrait); the brothers are name chips and an icon.
- No logos.
- The ILLUSTRATION tag is on the diary (22-26) and on the YOU / EVERYONE ELSE rows (150-160).
- HIS WORDS is on the recoloured geranium swatches.
- Nothing is still for 4 s: the slowest windows (dot grids, swatch rows) all have a cued change within 4 s.

## Taste
- **The pin's echo ring is very faint.** It is a 3 → 0.6 px teal ring on a busy, sepia map, and it is only clearly visible 28.60-28.85. A slightly thicker start (5 px), or an ink ring with a light halo, would read at phone size.
- **163.13:** RED · HIS WORDS starts its fade-in on the same frame the last letters of SKY-BLUE un-wipe. They are in different rows (y 760 and y 820) and do not overlap.
- **36.25-36.52:** WHAT DO YOU SEE? arrives while THE GERANIUM, 1792 is still un-wiping, in a different slot. Fine.
- **64.3-74.3:** the REPORTED COLOURS tag is on while the stockings are still shown in their photographed cream.
- **Act 1 geranium (11.1-19.5, 49.1-54.2):** a modern cultivar photo stands in for Dalton's flower. The label DALTON'S 'GERANIUM ZONALE' marks his name, as the fact-check asked. The description credit (modern zonal geranium) must say so.
- **Still open from v5:**
  - Caption 47 starts at 160.83, about 0.5 s before the audible "Then".
  - The cream stockings panel in the SAME row.
  - The candle panel while dimmed.
  - The 1,000-dot grid's tiny lit dots.
  - The licence credits.

## Verdict
**Not ready.** There are four MUST-FIX items:
- The map edge showing in the new TravellingMap.
- The silent, late Kendal pin.
- The 0.4 s 1844 · THE FLUID: CLEAR chip and the LensDive chips that fade.
- The cold-open dateline jump.

The first three are prop changes, plus small component fixes for LensDive chips and DatelineTag parts. Loudness is -16.0 LUFS on both acts. The lens settle, the un-wipe exits on `layers/Label` and the map's camera, depth of field and labels otherwise pass.
