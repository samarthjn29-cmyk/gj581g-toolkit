# WCL-E01 act 3 "The talk": Gate 2 independent review

24 Nov 2026. Reviewer: independent; I did not see the act being made.

Read: the beat sheet v3.1 (`gate1_act3/beatsheet_dump_v3.json`, rows E01-A3-01 to 77), the on-screen fact-check (main table and addendum rows 11-17), the Director's brief, the Director's frame review (15 fixes), `make_act3.py`, `src/episodes/ep01-act03.json` and `.music.json`, and the word times.

Looked at: `stills/` with the contact sheet, `review/` and `review2/`. I also rendered 17 new frames to `qa/WCL-E01-act03/review3/`: 26.9, 30.0, 41.5, 51.5, 72.06, 74.9, 100.8, 128.4, 137.9, 161.95, 177.6, 184.1, 184.4, 195.3, 202.7, 203.0 and 203.2.

Measured the narration level under every sound cue, straight from `03_talk_paced_149wpm_even.wav`.

Ran: `ground-check` (PASS: photo 43%, graphite 34%, desk 17%, blur 5%, no run of 3) and `registry-check` (0 problems). I did not re-run `gate2-qa`: its text checks were not needed, and its last result (AUTO-PASS, 0 critical) postdates the act file.

## Verdict: FIX

Three small MUST items:
- Two notes on the beat sheet are out of date.
- The leaf and wax photos in shot C have no "today" tag.
- The olive match finishes after "To him" has started.

Each fix is a line or two in `make_act3.py`, or a beat-sheet write-back. Apart from these, the act matches the spec. These all hold:
- Every cue lands on its word, within 0.3 s, or in the pause the notes name.
- Every on-screen word matches the fact-check.
- The p.43 typed quote matches the scan word for word.
- The counts are inside their limits, SFX-016 included (10 of 10 beats).
- All 15 of the Director's fixes show on the review2 stills.

## Checked and passing (no action)

**Cue timing**
- I checked every `atSec` against the word times. Shot A (all of its labels, chips, the ring, the scrap, the dateline and the swap), A2, p.34, B, S, D, p.43, C, the p.43 return, the simple eye, H and the chips all land within 0.3 s of their words.
- The three Gate 2 pause moves are in their pauses and each holds at least 2.7 s before the next transition: 37.50 (before the 40.21 glide), 48.50 (before the 51.24 push) and 134.30-134.70 (before the 137.50 ink).

**Sound placement**
- The hit (102.10) lands in true silence: the voice is at -180 dB from 102.0 to 103.2.
- The riser runs 99.6 to 102.1, so it ends on the hit.
- Every swish, pop and whoosh starts in a pause; the voice measures -60 to -180 dB under each start.
- SFX-017 (20.77) and the glide's SFX-016 (40.31) sit on words, at texture level (-29 and -26 dB), as approved.

**Sound counts for the episode**
- SFX-016: 10 of 10 beats.
- SFX-024: 17 of 30. SFX-020: 9 of 12. SFX-026: 5 of 8, one per shot. SFX-017: 4 of 6. SFX-006: 4 of 10. SFX-025: 3 of 3, one in this act.

**Asset counts**
- TRN-015 is used twice, and not in a row. TRN-004 is used twice; pull 0.86 is a scale, so it is shallower than the 0.82 limit. TRN-009, TRN-010 and TRN-005 are used once each.
- VIS-060: 7 of 12. VIS-061: 5 of 6. TXT-024: 6 panels, with gaps of at least 16.3 s. TXT-025: 1.
- Sources at their limits, and within them: SRC-002 (12), SRC-004 (16), SRC-015 (10), SRC-043 (10), SRC-044 (6) and SRC-042 (6).

**On-screen words**
- All of these match the fact-check exactly: the dateline, NEW COLLEGE / AGE 28 / TUTOR, the chapel's two lines, the Kitchin chip, the p.28 title, W6 with P. 31, the count text, the p.43 quote, DALTON'S GUESS, SIMULATION · ONE WAY / HE MAY HAVE SEEN THEM, A SEALED LETTER · 1841, A MODEL OF AN EYE / WELLCOME COLLECTION, JOHN DALTON · 1834, W. C. HENRY · 1854 · P. 25, PHOTO TODAY · A GLASS PRISM, and the source tags for p.28, p.34 and p.43.
- **New p.43 quote.** I checked it against `dalton1798_p43.jpg` at image y 1140-1250: "humour; otherwise I apprehend it might be disco-/vered by inspection, which has not been done." The typed text is verbatim, with the lowercase start and the break joined, as fact-check row 6 asks.
- **p.43 highlight boxes.** All seven sit on their words in the scan: PROB, FIC, SUP, VIT, HUM, OTH and VER.

**Period honesty**
- No 1794 is on screen with the chapel: the dateline and the plan's label are gone by 26.9 (`review3/t26.90`).
- C has no olive. In C, the leaf and wax are darker but still two colours (`stills/E01-A3-59`).
- Dalton's face is never covered or animated. The Henry strip sits under his chin. The band at 195.3 crosses the face only as the shot ends.
- The Henry "pale yellow" line never shows.

**The Director's fixes, as rendered**
- FIX 1: the eye is complete on the cut frame, centred at about (960, 540) under the strips' centre (`review2/t102.07`, `t102.10`).
- FIX 2: olive at 72.50 measures leaf (96, 83, 27) and wax (92, 79, 24), within 4 levels of each other.
- FIX 3: the PHOTOS TODAY caption and the page tag sit in the margin.
- FIX 4: VITREOUS HUMOUR is clear of the wall.
- FIX 5: no stray dot at 104.9 or 109.5.
- FIX 8: the letter has no rim and is tilted.
- FIX 9 and FIX 10 clearances: about 60 px and about 24 px.
- FIX 11: NEW COLLEGE is about 18 px clear of the ring.
- FIX 12: the arrow reads down-right.
- FIX 13: the eye model shows three clean parts.
- FIX 15: the Kitchin chip is readable.

## MUST (defects)

**M1. Two layout changes are not on the list, and the beat sheet still shows pre-fix notes (shot B at 60.6; shot D at 127.11 and 102.10).**
- **The letter's size.** Beat 24 says the letter (SRC-046) is "w 360 … about x 1255-1620". The act has `"w": 420, "at": [1440, 770]` (make_act3.py, B `carry[2]`; comment "Gate 2 builder test"). The frame review's FIX 8 says "keep w 420", but this change is not in the list of approved Gate 2 changes.
- **The 'tinted' chip.** Beat 48 says 'tinted' sits at (160, 350). The act has `"y": 380`, with the arrow from [372, 320] to [392, 392] (D overlay). At 350 the chip would sit about 20 px under 'clear' (size 64), with no room for the arrow, so 380 is right. It is still unrecorded.
- **The dump predates the fixes.** `beatsheet_dump_v3.json` (05:03) is older than the fixes (make_act3.py, 05:27). Row 39 still says "the cross-section draws in (0.9 s) on 'explanation'". FIX 1 says that row changes and that Sam sees it as a change.
- **Fix:** write these back to the beat sheet before Sam's review, so that what he approves is what he sees:
  - row 24: w 420, at [1440, 770], tilt 3;
  - row 39: drawn on the cut;
  - row 43: (940, 440);
  - row 48: 'tinted' at (160, 380), with the arrow;
  - rows 61-62: the new quote column (FIX 6);
  - rows 2, 9, 15 and 33: the moved chip positions (FIX 9-12).
- No change to the act file is needed.

**M2. C: the modern leaf and wax photos are on screen untagged for 9.3 s (shot C, 152.50-161.80).**
- **Evidence:** `stills/E01-A3-57` to `E01-A3-60`. The only text in the frame is DALTON'S GUESS and, from 157.78, HIS IDEA.
- **The rules:** modern photos are always tagged as today. VIS-060 stickers are "credited". The last PHOTOS TODAY caption left at 73.90, about 79 s earlier.
- **Fix:** add to C `labels` in make_act3.py: `{"text": "PHOTOS TODAY", "atSec": r(153.10), "untilSec": r(S(61) - 0.6), "x": 120, "y": 230, "size": 16}`.
  - It lands with the wax sticker's pop. It sits between the corner tag (bottom about 125) and the leaf (top about 300). It goes out with HIS IDEA.
  - This changes the approved shot, so Sam sees it.

**M3. B: the pair is not yet one olive when "To him" starts (shot B, 72.06).**
- **What the beat sheet says (beat 28):** both turn the same olive in the pause after 'get.' (71.12-72.06), "about 71.65".
- **What happens:** the state crossfades over 0.7 s (LayerStage l.242), so the change finishes at 72.35, on "him".
- **Measured (masked means):**

| Frame | Leaf | Wax |
|---|---|---|
| `review3/t72.06` | (90, 84, 32) | (103, 70, 26): still brown-red, 14 levels apart in green |
| `review2/t72.50` | (96, 83, 27) | (92, 79, 24): matched |

- **Fix:** in B, on both the leaf and the wax, set the olive state to `{"atSec": r(71.30), "color": OLIVE, "blend": "replace"}`. It then completes at 72.00, still inside the pause.
  - The chips' un-wipe (71.0, about 0.5 s) overlaps only the eased-in first 0.2 s.
  - Re-render 72.06 and check that the two masked means are within 10 levels.

## SHOULD (clear improvements)

**S1. A to A2: two paper and air sounds are stacked in one 0.93 s pause, and the "under" sound is the louder one (shot A at 29.65, A2 at 29.95).**
- `paper_move` (SFX-016, -24 dB, 0.80 s long) runs 29.65-30.45. The swish (SFX-024, -26 dB) runs 29.95-30.27, and "Its" starts at 30.16.
- SFX-016's rule says it sits 8-10 dB under its hero, so this breaks the one-hero rule.
- **Fix (keeps both approved cues):**
  - set SFX-016 to `"atSec": round(word("paper", 28) + 0.45, 2)` (29.40), `"volumeDb": -34.0`;
  - set the swish to `round(S(13) - 0.05, 2)` (29.65), which follows TRN-015's "swish in a pause" and SFX-024's "0.05-0.15 s before the wipe".

**S2. D: the eye is unchanged for 6.7 s after the cut (shot D, 102.10-108.78).**
- FIX 1 removed the draw-in at 103.92. Now the only motion from the cut to the outline on 'clear fluids' is the 2% drift, through "He offers an explanation. Your eye isn't hollow." (`review2/t102.10`, `t103.00`, `t104.90` are identical apart from scale).
- Before FIX 1, the longest hold here was 4.0 s. The house rule is a change on every 2.0-3.5 s phrase.
- **Fix (choose one):**
  - add a cue on "hollow" (106.52), for example a first faint outline of both fluids: `{"parts": ["aqueous", "vitreous"], "atSec": r(word("hollow")), "untilSec": r(word("clear", 108)), "opacity": 0.35}`, if EyeDiagram outlines accept an opacity;
  - or ask Sam to accept the hold as the breath after the impact.
- C has a similar 4.9 s hold (138.5-143.44, as approved). It is fine if D's is fixed.

**S3. The p.43 return shows its new quote 3.9 s before it is read (shot 61-66, 161.80-165.66).**
- Since FIX 6, the column shows "otherwise I apprehend …" from the slide's landing, under "He has a reason for picking the jelly, too." `stills/E01-A3-61` is at 163.5. The viewer reads ahead of Sam.
- **Fix:**
  - add `quoteAtSec?: number` to ArchivalScanCard (`pQuote = reveal(frame, fps, quoteAtSec ?? startSec + st * 2, …)`, and the same for `pLine`);
  - set `"quoteAtSec": r(word("otherwise"))` in the 61-66 shot.
- The source tag can stay from the start.

**S4. 'one man' is readable for only about 1 s, and the match runs 1.3 s ahead of its words (shot KP, 202.34-203.33; shot E from 203.00).**
- **The aligner is wrong here.** The word file puts "A" at 203.00-203.48. The audio is silent from 203.1 to 204.3 and "A man" starts at about 204.3 (RMS profile: -180 dB from 203.1 to 204.1).
- **What it costs:**
  - The focus match blurs 'one man' about 1 s after it lands (`review3/t203.00`, `t203.20`).
  - Beat 76's "match into the dark room on 'A man who died'" really happens 1.3 s before "A".
- **Fix (needs Sam's OK, because it is a beat time):** move the beat 75/76 boundary to 203.60, still in the true pause. That gives the chip about 1.3 s, and the swish (`S(76) + 0.05`) stays in silence.
- The same aligner error affects "He" (101.91; really about 103.2) and "And" (137.50; really about 139.0). Neither causes a defect, but the cue comments "on 'And'" are off by 1.5 s.

**S5. KP: the frame does not move at all for 8 s (shot KP, 195.02-203.00).**
- KeywordPanel has no drift ("nothing else moves"). After the band clears there are 2.9 s of empty ground (195.6-198.53) and then 3.3 s of fully still chips (199.1-202.34), against "Nothing static past 3.5 s; one slow move per shot".
- **Fix:** give KeywordPanel the shared drift, `transform: scale(drift(frame, durationInFrames, 0.02))`, as ArchivalScanCard and EyeDiagram have. See T1 for the empty ground.

## TASTE (for Sam)

**T1. 73: 2.9 s of empty dark ground under "But a blue tint only explains colours if we know" (195.67-198.53).**
- See `stills/E01-A3-73`. This is the Director's NOTE 12.
- Option: a white chip `blue tint` in the same panel on "blue" (196.09).

**T2. S: the count quote has no source for its last 1.9 s (100.17-102.10).**
- From 100.17 the count "I see only two or at most three distinctions" sits on the canvas without DALTON · 1798 · P. 31 (`review3/t100.80`).
- Option: source `untilSec: round(S(39) - S(29), 2)`, so it leaves with the cut.

**T3. S to D: the ground jumps at the hard cut (102.10).**
- S's faded canvas is a light warm grey; D's canvas is darker, with colour washes (`review2/t102.07` and `t102.10`). This is the Director's NOTE 8.
- On the act's one hard cut it can read as intended. If it does not, fade S's `outSec` to D's canvas wash.

**T4. B: the PHOTOS TODAY / CHERRY LAUREL, RUNIC EARTH / WAX SEAL, PETRIK caption is set at size 16 (51.24-73.90).**
- It is readable at full size (crop of `review2/t55.40`) but tiny at phone size. It is the only credit for both photos.
- Option: size 18-20, which fits the margin: the leaf's top is about 229.

**T5. C: the label style differs from the rest of the act (157.78).**
- "HIS IDEA: / DULLER, AND MORE ALIKE" uses a colon, where the rest of the act uses "·". Fact-check row 9 asked for one style.
- Option: "HIS IDEA · DULLER, AND MORE ALIKE".

**T6. p.43 cards: the lower half shows "2. Pink is known to be a mixture of red and blue … Our eyes only transmit the blue excess" (128-177).**
- This is the Director's NOTE 13. It is the episode's title subject, visible ahead of its act.
- Option: a tighter crop, or VIS-029's `callout` dim on the lower lines.

**T7. World labels sit below the 84 px safe line (whole act).**
- The library's bottom-right world labels use `bottom: 60`. The PLAN OF MANCHESTER chip spans y 983-1023, 27 px under the 84 px line (`review2/t22.90`). JOHN DALTON · 1834 and PHOTO TODAY · A GLASS PRISM sit the same way.
- This is the house caption band, used the same way in the approved acts 1-2. Raise it library-wide or keep it as the house exception; it is not a fix for act 3 alone.

## Open (not reviewable yet)

- The frame review still asks for act 4's first frame beside 209.60. Act 4 is not built, so the hand-off from E's closed-shutter framing (the shutter at about (275, 370), `review2/t209.60`) is still unchecked.

## Applied (24 Nov 2026, after this review)
- M1: the beat sheet notes were written back (rows 2, 9, 12, 13, 15, 21, 24, 28, 33, 39, 40, 43, 48, 57, 62, 73) plus Text_ID TXT-024 on 40 and Motion MOT-001 on 73-75; beatsheet-check 184/184 VALID.
- M2: PHOTOS TODAY (120, 230, size 16) in C from 153.10 to 0.6 s before the slide.
- M3: the olive state starts at 71.30 on both; measured at 72.06: leaf (99, 87, 29), wax (92, 80, 23).
- S1: paper SFX-016 at 29.40, -34 dB; the swish SFX-024 at 29.65.
- S2: chip 'isn't hollow' (160, 250, size 64) on 'hollow' (106.52), un-wiping at 108.3.
- S3: ArchivalScanCard `quoteAtSec`; the p.43 return's quote comes in on 'Otherwise' (165.66).
- S5: the KeywordPanel shot drifts 2% (MOT-001).
- S4 (start the last shot at 203.60, a beat time): for Sam. TASTE T1-T7: for Sam; T7 is library-wide.
- gate2-qa after the fixes: AUTO-PASS, 0 critical; registry-check 0; ground-check PASS. Stills qa/WCL-E01-act03/stills (77 midpoints) and review4.
