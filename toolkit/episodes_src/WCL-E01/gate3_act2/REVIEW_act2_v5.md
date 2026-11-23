# WCL-E01 act 2 v4: independent review (gate 3, re-check)

Clip: `library/out/WCL-E01_act2_v4_1080p.mp4` (1920x1080, 30 fps, 175.57 s), checked against `ep01-act02.json`, the word times (+2.4 s), `WCL-E01_act2_en.srt` and my v3 report. All times are **clip seconds** unless a prop value (shot-relative) is quoted.

Method:
- 30 fps strips at every changed label swap, stamp, tick, transition and turnaround. Contact sheets at 0.2-0.5 s across each changed shot.
- A whole-clip v3-against-v4 frame diff at 96x54, to find every place the picture changed. It found only the intended spots, plus 160.30-160.47: in v4 NOBODY ELSE CAN SEE WHAT YOU SEE stays on through the push. That is an improvement.
- For audio, I subtracted the voice (offset 2.400 s, gain -0.01 dB) from the raw render (`_raw.mp4`, no bed). This isolates every sound effect. The residual floor under the words is about -57 dBFS. I measured each cue as 50 ms RMS against the voice, and the voice median is again **-21.5 dBFS**.
- Loudness: ebur128 on the final mix.

**Loudness: -16.0 LUFS integrated, true peak -1.9 dBTP, LRA 5.2 LU. PASS.**

## Fixed

**1. Map labels (shot 02-05): PASS.**
- BORN 1766 has fully cleared by 7.87.
- NORTH-WEST ENGLAND fades in from 7.97 ("northwest" is spoken at 7.74) and reads cleanly from 8.0 to 9.8. It has gone by 9.93.
- A QUAKER FAMILY fades in from 9.97 (on "family", 9.88) and holds until the slide at 11.65, about 1.6 s readable (it was 0.8 s in v3).
- There is no overprint at either swap, checked frame by frame from 7.6 to 8.2 and from 9.6 to 10.2.

**2. Stockings labels at y 780: PASS.**
- TO BOTH OF THEM · DARK, TWO GROWN MEN · ONE PAIR OF STOCKINGS and QUITE SURE SHE'S RIGHT all sit on their own line above the JOHN, JONATHAN and MOTHER chips. No ghost text shows.
- JONATHAN · DARK reads cleanly from 87.3 to 98.6.
- The swap at TO BOTH → TWO GROWN MEN is clean. TO BOTH has gone by 92.23 and TWO GROWN MEN starts at 92.30.
- The swap at TWO GROWN MEN → QUITE SURE is clean. TWO GROWN MEN has gone by 95.70 and QUITE SURE starts at 95.87.

**3. Six same-slot swaps: PASS.** All six have empty frames between the outgoing and incoming text, checked at 30 fps:

| Swap | Last frame of old text | First frame of new text |
|---|---|---|
| What stays the same? → Only the person… | 107.17 | 107.27 |
| Only the person… → The odd thing… | 110.00 | 110.10 |
| They aren't rare. → Colour blindness | 119.50 | 119.63 |
| RED-GREEN → TROUBLE TELLING… | 124.00, faint | 124.07 (one empty frame) |
| THE SAME COLOUR NAMES → NOBODY HAS EVER TOLD YOU | 154.07 | 154.17 |
| NOBODY HAS EVER TOLD YOU → NOBODY ELSE CAN SEE… | 157.70 | 157.83 |

Note: the exit easing finishes about 0.5 s after `untilSec`, so a 0.6 s gap leaves only 1-3 clear frames. Treat 0.6 s as the minimum, not a target.

**4. Candle panel (98.63-115.06): PASS.**
- **Stays lit:** a flame is visible in every frame. The brightest pixel in the panel never drops below 140/255, and the 99.5th percentile never drops below 82, even during the deliberate all-panel dim (107.2-113.5).
- **Turnarounds:** forward to reverse at 106.13, and reverse to forward at 113.63. There is no visible jump. The frame-to-frame change at 106.10-106.17 is 0.04-1.5, the same as the normal flicker (0.3-1.6). The reversed file starts at 2.458 s, which is 10.5 s forward, so the frames match.
- Shot entry (block wipe) and exit (slide at 115.06) are clean.

**5. Shot 66+67 slide, tag at 0: PASS.**
- The portrait card slides in from the right from 166.93 to about 167.23, over the geranium. It is clean, with no black frame.
- JOHN DALTON · 1834 is on screen from the first frame of the new shot.
- This is not two pushes in a row: 160.3 is a push, 166.9 is the slide and 172.95 is the band.

**6. Sounds: PASS (one minor timing note under Taste).**

| Cue | Peak (50 ms) | Under the voice median | Position |
|---|---|---|---|
| air_swish_v1, 2.05 | -37.3 | 15.8 dB | Sounds 2.07-2.27; ends before "John" at 2.40 |
| pencil_stroke, -29 dB | -43.1 | 21.6 dB | Texture under "teaching in Kendal" |
| typewriter_run_v1, -23 dB | -44.3 | 22.8 dB | Inside the registry's 22-24 dB; under its own typed line |
| page_turn, 103.60 | -38.5 | 17.0 dB | Sounds 103.71-103.86, in the pause ("candle." decays by 103.66) |
| pages_move, 104.03 | -40.8 | 19.3 dB | Sounds 104.08-104.48, in the pause before "Everyone" (104.60) |
| paper_move, 106.25 | -41.0 | 19.5 dB | Sounds 106.36-106.86, in the pause (voice silent by 106.30) |
| tick_v1, 130.45 | -35.5 | 14.0 dB | First dot lights at 130.50 |
| tick_v2, 135.42 | -35.5 | 14.0 dB | Starts 135.43, voice already at -66; first dot lights at 135.47 |

- The three SAME stamps land at 103.67-103.73, 104.07-104.13 and 106.33. Each is 0.05-0.15 s before its sound's peak, which is in sync.
- None of the cues sits on a spoken word.
- The cues still above -41 dBFS (the swish, page_turn and both ticks) are sync accents alone in pauses, in the same class as the act's whooshes (8-12 dB under). They are not texture under speech.
- Texture cues that run under speech are all 21.6-23.8 dB under: pencil, typewriter, ticker_run (23.8) and dial_turn (22.6).

**7. Final board connectors: clearance PASS, shape FAIL.** See new MUST-FIX 1.
- Clearance: no dashed line touches a label, keyword, icon or pill. The flower connector starts at y 595, about 40 px below RED BY CANDLE.
- Shape: the board does not read as links between the pieces. This is a regression.

**8. Caption cue 22: PASS.** It reads "A bluish-dark drab, in the biographer's / words." (75.623). There are no hyphen-led tokens anywhere in the SRT. The SRT is numbered in order, has no overlaps, no cue under 1 s, and no line over 42 characters.

**Adopted taste items: all PASS.**
- MAY HAVE GROWN IN THE TELLING arrives at 62.2 (on "so … may") and reads for about 2 s until the band at 64.18.
- JOHN and JONATHAN arrive at 113.3 and 113.5 and read for about 1.6 s. They now sit between the panels, clear of every SAME stamp.
- SFX-006 at 38.85 sounds 39.02-39.28, inside the pause between "change," and "so" (39.30). Its tail under "so" is -60 dBFS. See Taste for its sync.

## Regressions / new MUST-FIX

1. **173.0-175.57, final board: the new connector ends make the path read as a broken underline, not as links.**
   - Problem:
     - The flower's end now leaves from below its keyword block (y about 595). The odd-one-out end arrives above its icon (y about 590).
     - The two ends sit at almost the same height, so the flower → odd-one-out segment is a near-horizontal dash, (336,595) → (517,590). It floats about 45 px above the brothers icon and does not point at the piece.
     - The odd-one-out → Why? segment does the same, (550,590) → (726,525).
     - For 173.7-174.2, only the first segment is on screen, and it reads as an underline under RED BY CANDLE.
     - With both segments drawn, the eye reads one dashed line from the flower to Why? that passes over the odd one out. It does not read as two links into it. v3's lines, which pointed down at the icon, read clearly; only their touch on the "L" was wrong.
     - This is the held last image of the act, and the component will carry 4-7 pieces in later acts, where the flat-line effect gets worse.
   - **Fix (BuildUpMap end points):** when one piece sits beside or below another (|dx| > |dy| between the block edges), leave from the side of the pill that faces the next piece, not from below the keyword block. Arrive at the near side of the next piece's icon.
     - Start: pill edge ±16 px, at the pill's lower third.
     - End: icon edge ±16 px, at the icon's mid-height.
   - Expected result on this board: flower (about 470,470) → brothers icon left (about 490,655). This runs at x 474-485 past the keyword lines, which end at x 441, so there is about 30 px clearance.
   - Why? (about 650,470) → brothers icon right (about 578,655).
   - That gives back v3's clear V into the odd one out, with nothing crossing text. Check it again on a 3-node and a 5-node test board.

No other regressions found. The v3-against-v4 frame diff shows changes only at the intended spots.

## Taste

- **130.43, tick 1:** it is clear of the word timing ("thousand." ends at 130.41 in the word file). But the audible tail of "thousand" runs to about 130.55 (-37 to -43 dBFS, 20 ms RMS), so the tick lands on the final "-nd". It is about 16 dB under the median voice and reads as phrase punctuation. Moving it would make it fully clean: women phase `litAtSec 15.39 → 15.6`, with the tick at 130.66. Tick 2 at 135.43 is already fully clean.
- **38.85, SFX-006:** the page has finished sliding by 38.73, so the cardstock peak (39.20) lands about 0.45 s after the movement. It is in the pause, as asked, but it no longer matches the slide. `atSec 38.70` keeps the start in the pause ("change," ends 38.84, and the sound rises from about 38.87) and is closer to the movement. Or leave it as it is.
- **166.9 slide has no sound.** The other slides carry one (SFX-006 at 11.55, air_swish at 114.98). An air_swish at about 166.80, -21 dB, sits in the pause (166.25-167.55). Optional.
- **107.2-113.5, candle panel while dimmed:** it is lit, but the footage is mostly black around a small flame (panel mean about 4/255). On "the same candle" it reads close to an empty black square. Consider a lighter dim on the video panel only, or a tighter focus on the flame.
- **160.83, caption 47** still starts about 0.5 s before the audible "Then" (onset 161.35). This is unchanged from v3.
- **Unchanged from v3, still open:**
  - REPORTED COLOURS tag over the cream photo.
  - "A PERIOD PAIR" wording and the cream stockings panel.
  - Light border on the #3B4250 chip swatches.
  - Portrait tag far from the portrait, and confirming the engraver and date.
  - Quaker scan clipping first letters.
  - The empty p. 30 callout box.
  - 1,000-dot grid: the lit dots are tiny.
  - WHAT IT IS CALLED wraps to two lines.
  - The audio stream is 58 ms shorter than the video, with a fade at the end. Make sure the joiner carries MUS-007 across.
  - Geranium photo licence credit in the description.

## Verdict

**Not ready.** One MUST-FIX remains: the final board connector shape (BuildUpMap end points). All 8 v3 MUST-FIX items pass on v4, and loudness is -16.0 LUFS / -1.9 dBTP.

---

## v5 re-check (`out/WCL-E01_act2_v5_1080p.mp4`)

Method:
- Frame diff of v4 against v5 at 192x108 over all 5,267 frames.
- 30 fps and 0.1 s strips of the final board, with zooms on both connector ends.
- Sound effects isolated again from `WCL-E01_act2_v5_raw.mp4`: voice subtracted at 2.400 s, residual floor -57 dBFS, voice median -21.5 dBFS.
- ebur128 on the final mix.

**Nothing else moved.** Only two spans differ beyond encode noise (no other frame differs by more than 12/255):
- 130.50-131.27: the women-phase dots now light later.
- 173.43-175.57: the board connectors.

**Loudness: -16.0 LUFS integrated, true peak -1.9 dBTP, LRA 5.2 LU. PASS.** The streams are unchanged at 175.567 s video and 175.509 s audio.

1. **Board connectors (v4 MUST-FIX 1): PASS.**
   - The path is now a clear V into The odd one out.
   - Flower line: from the right side of The flower's pill (about 471,442, 14 px off the pill) down to the left of the brothers icon (about 481,650). It passes about 30 px right of SKY-BLUE BY DAY and RED BY CANDLE.
   - Why? line: from the left side of Why?'s pill (about 662,446) down to the right of the icon (about 585,657).
   - Nothing crosses a label, a keyword, an icon or the pill text.
   - With only the first line drawn (173.47-174.23), it reads as a link from the flower down to the odd one out, not as an underline.
   - The second line draws on from the icon up to Why? (174.27-175.0) and is clean on every frame.
2. **Women-phase tick (130.66): PASS.** The tick sounds 130.66-130.72, where the voice is silent (-120 dBFS; the tail of "thousand" has died by about 130.62). The first dot lights at 130.70, in sync. The level is -35.4 dBFS, an accent alone in the pause. The lit dots then hold for 1.3 s before the room-of-50 grid.
3. **SFX-006 at 38.70: PASS.**
   - Most of the sound falls at 38.84-39.12 and peaks at 39.05, after "change," dies away (voice under -55 dBFS from 38.90). The next word, "so", is at 39.30, where the sound is at -92 dBFS.
   - The rise starts at 38.74. There it sits 20-25 dB under the end of "change,", so it is masked.
   - The sound is now closer to the page slide, which settles at 38.73.
4. **New air_swish_v2 at 166.82: PASS.** It sounds 166.87-167.03 and peaks at 166.94, -32.9 dBFS. It sits under the slide into the portrait (166.93-167.23) and well inside the pause between "happen." (ends 166.25) and "Dalton," (167.55). The voice is silent there. Its level matches the act's other slide swishes (11-12 dB under the voice median).

### New MUST-FIX
None.

### Taste (v5)
- **Why? end of the connector:** it starts at the edge of the pill (0-2 px), while the flower end has a 14 px gap. The reason is that `pillHalf` estimates pill width from the character count (23 px a character). That fits "The flower" and "The odd one out" but comes out about 15 px short for "Why?" (wide W and ?). Here the line only touches the pill outline, nowhere near the text, so it is fine for this act. For later boards with 4-7 pieces, measure the real pill width, for example with `measureText` from `@remotion/layout-utils` or a ref, so a label with wide letters cannot start its line inside the pill.
- The other taste items above still stand as listed (candle panel while dimmed, cue 47 about 0.5 s early, and the open v3 items).

### Verdict (v5)
**Ready for Sam.** All 8 MUST-FIX items from v3 and the v4 connector MUST-FIX pass. Nothing else moved, and loudness is -16.0 LUFS / -1.9 dBTP.
