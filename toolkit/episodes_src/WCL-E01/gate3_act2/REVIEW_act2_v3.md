# WCL-E01 act 2 v3: independent review (gate 3)

Clip: `library/out/WCL-E01_act2_v3_1080p.mp4` (1920x1080, 30 fps, 175.57 s). Checked against `ep01-act02.json`, the narration word times (+2.4 s), `WCL-E01_act2_en.srt` and the gate 2 report. All times below are **clip seconds** unless a prop value (shot-relative) is quoted.

Method: frames every 0.5 s (15 contact sheets); 30 fps strips around all 17 shot starts; full-res crops at every label change I flagged; same-slot label swaps listed by script from the act file; each audio cue rebuilt from its file, gain, trim and fades and compared with the voice track (`02_brothers_paced_149wpm_even.wav`, which lines up with the mix at +2.4 s +6 ms, gain -0.1 dB). Median voice level during words is **-21.5 dBFS (50 ms RMS)**. I took "texture level" to mean about 20 dB or more under that, which is the registry's figure for SFX-027.

## Passes

- **Loudness:** -16.0 LUFS integrated, true peak -1.9 dBTP, LRA 5.2 LU. PASS.
- **Transitions:** band, slide, flash, push and block all run clean frame by frame (2.4, 11.65, 16.97, 26.37, 32.3, 38.34, 55.2, 64.18, 98.63, 115.06, 140.6, 160.3, 172.95). There are no black frames, blinks or old text showing through. The shots at 145.43 and 150.4 have no transition, but they sit on the same dark ground, so the change is only text clearing (OK). For 21.76 and 166.9 see below.
- **4 s rule:** the longest gap between visible changes is 3.4 s (the "Picture it from the inside" hold, 142.0-145.4). PASS.
- **Highlights:** every page highlight has 2 s or more before the next change or cut. PASS.
- **New strings against the narration:** PASS for all of them. A BIOGRAPHY ("It comes from a biography", 58.6-59.8). TO BOTH OF THEM · DARK (88.7-91.0). TWO GROWN MEN · ONE PAIR OF STOCKINGS (92.3-94.5). QUITE SURE SHE'S RIGHT (95.9-97.1). THE SAME COLOUR NAMES, NOBODY HAS EVER TOLD YOU and NOBODY ELSE CAN SEE WHAT YOU SEE (151.0-159.8). WHERE IS THE PINK?, which is a question with no claim. The flower: SKY-BLUE BY DAY / RED BY CANDLE, matching Dalton 1798 pp. 29-30 ("sky-blue by day", "what I called red" by candle). The odd one out: HIS BROTHER TOO (p. 30) / NOT RARE (narration and Birch). Why? (174.2). The running head 2 · THE ODD ONE OUT matches the slate. JOHN DALTON · 1834 matches the asset record (SRC-004 "DaltonTurner1834"); see the taste note on the credit. Gate 2 fixes that I confirmed: TO JOHN · AS THE STORY TELLS IT, the ILLUSTRATION tag on the diary, ILLUSTRATIVE from frame 1 of the swatches, the China/Japan phase with an en dash, the Lonsdale date box, the SKY-BLUE/RED labels, ZÜRICH, the stockings caption, and Blood/Cherries outlines.
- **Real people only in real pictures:** the only person shown is the Turner portrait. PASS.
- **Captions:** cue starts match voice onsets within 0.05 s at 2.4, 9.76, 41.64, 64.83, 98.38, 141.25 and 173.47. The cue reads "By candle". Two exceptions are listed below.

## MUST-FIX

1. **10.48-11.0, label collision, and A QUAKER FAMILY is too short.** NORTH-WEST ENGLAND (`untilSec 8.08`) and A QUAKER FAMILY (`atSec 8.08`) share the slot (960, 860). The 0.6 s fade makes them overprint ("N A QUAKER FAMILY D") for about 0.5 s. After that, A QUAKER FAMILY reads cleanly for only about 0.8 s before the slide at 11.65.
   **Fix (shot 02+03+04+05 labels):**
   - BORN 1766 `untilSec 5.34 → 4.9`
   - NORTH-WEST ENGLAND `atSec 5.74 → 5.5`, `untilSec 8.08 → 6.9`
   - A QUAKER FAMILY `atSec 8.08 → 7.5` (9.90, on "family")

2. **88.9-98.6, stockings labels sit on the name chips.** TO BOTH OF THEM · DARK, TWO GROWN MEN · ONE PAIR OF STOCKINGS and QUITE SURE SHE'S RIGHT are drawn at y 860, on top of the JONATHAN · DARK chip (960, 880). The chip shows through as ghost text, so JONATHAN reads cleanly for only 1.6 s (87.29-88.88) in the whole act. TWO GROWN MEN is wide enough to also cover JOHN · DARK and the MOTHER chip ("ER RED"). On top of that, TO BOTH → TWO GROWN MEN is a same-slot swap at 92.28 with zero gap.
   **Fix (shot 25+…+38 labels):**
   - Set `y 860 → 780` on all three labels. This is the slot 'AS RED AS A CHERRY' already uses cleanly.
   - TO BOTH OF THEM · DARK `untilSec 28.1 → 27.5`.

3. **Same-slot text swaps overprint for about 0.5 s (new in act 2; act 1 has none).** The outgoing text fades over 0.6 s from `untilSec` while the incoming text starts at the same moment. The places:
   - 107.23 What stays the same? → Only the person looking changes.
   - 110.07 Only the person looking changes. → The odd thing isn't the flower. Large serif, very visible.
   - 119.58 They aren't rare. → Colour blindness
   - 124.02 RED-GREEN → TROUBLE TELLING…
   - 154.12 THE SAME COLOUR NAMES → NOBODY HAS EVER TOLD YOU
   - 157.76 NOBODY HAS EVER TOLD YOU → NOBODY ELSE CAN SEE WHAT YOU SEE

   **Fix: end each outgoing line 0.6 s before the next one starts.**
   - Shot 39-44 lines: What stays the same? `untilSec 8.6 → 8.0`; Only the person… `untilSec 11.34 → 10.84`.
   - Shot 45-54 lines: They aren't rare. `untilSec 4.32 → 3.9`; RED-GREEN `untilSec 8.96 → 8.4`.
   - Shot 59-62 labels: THE SAME COLOUR NAMES `untilSec 3.62 → 3.12`; NOBODY HAS EVER TOLD YOU `untilSec 7.26 → 6.76`.

4. **About 107.0-115.06, THE CANDLE panel goes black.** The Mixkit clip (12.96 s) fades to black at its end. With `clipStartSec 3` the footage runs out at about 107 s. The panel then shows an empty black square under "SAME" for 8 s, while the voice says "the same candle".
   **Fix:** the panel has to hold a lit frame to the end of the shot, which is 16.4 s and longer than the clip. Add a hold or freeze option to SplitComparisonCard video panels, for example `holdAtSec: 9.5` (freeze on a lit frame) or a ping-pong with `candle_lighting_mixkit3458_rev.mp4`. Changing `clipStartSec` alone cannot cover 16.4 s.

5. **166.9, hard cut** from the full-bleed geranium (shot 63-65) to the dark portrait card (shot 66+67). This is a real scene change with no designed transition. The portrait also sits with no text for 0.3 s before its tag arrives.
   **Fix:**
   - Shot 66+67: add `"transitionIn": "push"` (or `"slide"`).
   - Tag `atSec 0.3 → 0`.

6. **Sounds on spoken words / above texture level.**
   - **129.45 and 133.79, stopwatch ticks** (SFX-018 v1/v2, -22 dB) both hit exactly on the word "four". The peak is -35.4 dBFS, about 14 dB under the voice, and the tick is a transient on a spoken number.
     **Fix:** move each tick and its dots into the pause after its phrase.
     - Women phase: `litAtSec 14.39 → 15.39`, tick at 130.45 ("thousand." ends 130.41; the next word is at 131.71).
     - Room-of-50 phase: `litAtSec 18.73 → 20.36`, tick at 135.42 ("it." ends 135.39; the next word is at 136.43).
     - The labels can keep their times.
   - **102.05 / 103.23 / 105.65, SAME-stamp sounds** (page_turn -12.5, pages_move -18, paper_move -23) peak on "flower" (102.20, -38.8 dBFS), "candle." (103.38) and "stockings." (105.88).
     **Fix:** move the stamps and their sounds into the pauses.
     - Flower stamp `atSec 3.37 → 4.97`, page_turn at 103.60.
     - Candle stamp `4.55 → 5.40`, pages_move at 104.03 (ends 104.48, before "Everyone" at 104.60).
     - Stockings stamp `6.97 → 7.62`, paper_move at 106.25 (ends 107.05, before "Only" at 107.23).
   - **170.57, typewriter run** (SFX-027, -16 dB) runs under "not enough for him to know that he's", with a peak of -37.2 dBFS (about 16 dB under the voice). Its registry rule is 22-24 dB under the voice.
     **Fix:** `volumeDb -16 → -23`.
   - **27.40, pencil_stroke** (route draw, -22.6 dB) peaks on "in" (27.82, -37.1 dBFS, about 15.6 dB under) and spans "teaching in Kendal".
     **Fix:** `volumeDb -22.6 → -29`.
   - **2.50, air_swish_v1** (-21 dB) peaks on the act's first word, "John" (2.62, -37.5 dBFS).
     **Fix:** `atSec 2.50 → 2.05` (ends 2.37, before the voice), or `volumeDb → -27`.

7. **173.6-175.57, final board (the held last image).** The dashed connector from "The flower" to the brothers icon runs through the "L" of RED BY CANDLE.
   **Fix:** in BuildUpMap, start node connectors below the keyword lines, at least one line-height of clearance, for nodes that have keywords.

8. **Captions, cue 22 (75.62):** it reads "A bluish -dark drab", because the word file has a "-dark" token.
   **Fix:** make it "A bluish-dark drab". Either join hyphen-led tokens to the previous word in `make_captions.py`, or edit the SRT.

## TASTE / WARN

- **21.76:** the book card clears to the diary illustration by a one-frame cut on the same dark ground. This is acceptable by act 1 practice, but a `slide` would match the other document changes.
- **62.71, MAY HAVE GROWN IN THE TELLING** (6 words) reads for about 1.6 s. Suggest `atSec 7.51 → 6.9` (62.10, on "so").
- **113.73 / 113.98, JOHN / JONATHAN names** on the split card read for about 1.3-1.5 s, and the JOHN chip sits over the candle panel's SAME stamp. Suggest `15.1/15.35 → 14.7/14.9`.
- **64.18-73.86:** the REPORTED COLOURS tag sits over the undyed cream museum photo, a colour nobody reported. This is the gate 2 V8 warning and is unchanged. The tag could arrive with the first colour state (9.68).
- **99-115, split card stockings panel:** it shows the cream pair labelled "THE STOCKINGS · A PERIOD PAIR". After the red/dark story, cream reads as a third colour. Consider tinting it, and "A PERIOD PAIR" is loose for c. 1806-10 against a story set before 1793 (gate 2 CHECK).
- **JOHN · DARK and JONATHAN · DARK chips:** the #3B4250 swatch almost disappears on the chip ground. Give it a light 1 px border.
- **167-173, portrait:** the JOHN DALTON · 1834 tag sits in the far top-left corner, about 1,000 px from the portrait. A chip under the portrait would read better and match the other source chips, for example `JOHN DALTON · MEZZOTINT, C. TURNER · 1834`. Confirm the date and engraver against the holder's record (I only checked the asset name and catalogue titles).
- **12-17, Quaker scan:** the left edge still clips first letters ("DVISED", "avoid"). The quoted words are all intact.
- **44-55, p. 30 callout:** an empty dark outlined box sits on "to find" between the highlights. The "not materially different" box starts on the "s" of "was"; suggest `x 1085 → 1100`.
- **38.29, cardstock slide:** peaks on "change," at about 20 dB under the voice, which is on the line. The registry says "in the pause before its line"; 38.85 is in the pause.
- **160.83, caption 47:** it starts 0.56 s before the voice. The word "Then" is timed 158.43-159.17 in the word file, but the audible onset is at about 161.39 clip time.
- **127.5-128.1:** the 100-dot and 1,000-dot grids cross-fade messily. The 4 lit dots in the 1,000 grid are tiny.
- **150.7+:** the WHAT IT IS CALLED header wraps to two lines.
- **Join to act 3:** the picture ends cleanly on the held board. The audio stream is 58 ms shorter than the video (175.51 vs 175.57 s), and the audio fades to about -68 dBFS in the last 70 ms (act 1 also dips at its end). Make sure the act joiner carries MUS-007 across the joins without an audible dip, since the registry says the bed "never stops".
- **Geranium photo:** a modern CC BY-SA photo labelled "THE GERANIUM, 1792", consistent with act 1's "DALTON'S 'GERANIUM ZONALE'". The licence credit must go in the description.

## Verdict

**Not ready for Sam.** There are 8 MUST-FIX items. The main ones are the stockings labels covering the name chips, the overprinting text swaps, the candle panel going black, and the sounds on spoken words. All are data or small component fixes, and loudness, the transitions and the facts pass.
