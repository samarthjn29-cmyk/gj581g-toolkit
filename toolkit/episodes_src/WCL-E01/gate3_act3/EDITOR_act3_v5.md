# Editor: WCL-E01 act 3 "The talk", v5 (208.1 s)

**Verdict: NOT YET. 2 MUST (one frozen half-wiped label, one pop 17 frames late), both cheap; 6 SHOULD; the rhythm and the 13 cuts otherwise land.**

Clip: `library/out/WCL-E01_act3_v5_720.mp4` (stepped frame by frame around every cut; 1080p used for the crops).
The act file matches the render's snapshot (`WCL-E01_act3_v5.mp4.act.json`, no diff).
Voice times were checked against silencedetect on NAR-003 (+2.4 s). The word file is wrong in two places: "And" is at 139.30, not 137.50, and "A man" is at 204.34, not 203.00. Captions and pauses agree with the measured times.
Stillness check: 673 events, longest gap 4.0 s (204.1-208.1, the end hold). Every other gap is 3.9 s or less. Pass.
Not re-opened (Sam's calls): end at 208.1, the 2.9 s breath before "what is", the cut at 203.60, the eyes cutting, the blurred Newton.

Frame numbers are at 30 fps in act time. "local" means seconds from the shot's start, the way the act file stores them.

---

## MUST

**M1. 74.20-74.97: SIMULATION · ONE WAY / HE MAY HAVE SEEN THEM is frozen half-erased through the canvas glide.**
- The label starts to un-wipe at 74.20. The un-wipe takes 17 frames, so it is still running at 74.50.
- CanvasGridPan freezes B's last frame (2234), so the label rides the glide stopped at about 47% wiped. From frame 2234 to about 2250 it reads clearly as "MULATION · ONE WAY". The exit stops dead and does not match its entrance.
- Fix: in `B_leaf_and_wax`, change `props.labels[0].untilSec` from 22.96 to **22.62** (act 73.86; the un-wipe is done by frame 2232, before the freeze). Reading time is still 2.21 s.
- Also change `props.labels[1]` (PHOTOS TODAY) `untilSec` from 22.66 to **22.62**, so the two leave as one.
- Re-render: shot B (and S, for the frozen frame inside its glide).

**M2. 153.13: the wax sticker's pop sound comes 17 frames after the wax.**
- The wax pops in at frame 4594 (153.13) at nearly full size. Its wobble is over by frame 4600 (153.33).
- The soft pop plays at 153.70 (frame 4611). The beat note assumed the wax settles 0.6 s after 153.10; measured, it settles in under 0.25 s.
- At 153.70 nothing is moving on screen, so the pop reads as a separate event.
- Fix: in `audio`, change the SFX-026 `soft_pop_v2.wav` `atSec` from 153.70 to **153.13**. It is still in the pause before "Reds" (152.97-153.86). Audio only.

## SHOULD

**S1. Swishes land before the visual move.**
Each swish file peaks 0.10-0.13 s after its start (air_swish v1/v2 0.10 s, v3 0.13 s, low_whoosh 0.33 s). The transitions peak later than that. Change these `audio[].atSec` values; it is audio only.

| Cut | Cue | Now | Swish peak | Visual peak | New `atSec` | Check |
|---|---|---|---|---|---|---|
| 29.70 focus match | SFX-024 air_swish_v1 | 29.65 | 29.75 | the join, local frame 10 = 30.03 | **29.88** | peak 29.98; ends 30.20, clear of "Its" (30.16) apart from the tail |
| 203.60 focus match | SFX-024 air_swish_v1 | 203.65 | 203.75 | the join at 203.93 | **203.83** | ends 204.15; "A man" starts 204.34 |
| 195.02 band | SFX-024 air_swish_v3 | 195.12 | 195.25 | the band's mid-frame at 195.40 (inOut quad, 0.75 s) | **195.27** | ends 195.66; "But" starts 195.76 |
| 51.24 push | SFX-020 low_whoosh | 51.09 | 51.42 | the push's top speed at 51.54 (inOut cubic, 0.6 s) | **51.21** | ends 51.87; "Here's" starts 51.89 |

- Leave the slide at 161.85 as it is. SlideAcross uses SLOW_OUT, so it is fastest on its first frames, and the swish's peak at 161.95 is right.
- Leave pages_move at 40.31 as it is. Its peak at 41.51 lands on the glide's landing frame.

**S2. 55.00: the leaf settles six frames before its pop.**
- The leaf rises at 54.57 (on "laurel"), shows from frame 1638 and stops moving at frame 1650 (55.00).
- The pop is at 55.19 (frame 1656).
- Fix (keeps the pop in the comma pause, as the beat note asks): in `B_leaf_and_wax`, change `props.carry[0].atSec` from 3.33 to **3.52** (act 54.76, 3 frames before "leaf"). The leaf then settles at about 55.20, on the pop.
- Leave the wax rise (`carry[1]`, 6.51) as it is. Its pop is the only one in the shot.

**S3. 26.29-29.93: CROSS STREET CHAPEL · AS IN 1835 / THE SOCIETY MET IN A ROOM HERE UNTIL 1799 is on too briefly.**
- It is 15 words and is up 2.5 s, counting the 0.25 s it rides into the match (27.43 to about 29.93).
- Halfway through, at 28.95, the page rises and takes the eye. About 3.5-4.5 s would be enough to read it once.
- Fix: in `A_manchester_talk`, change `props.labels[3].atSec` from 25.03 to **24.50** (act 26.90). By then the dateline's un-wipe is over (26.85), so the corner is empty. The tag lands during the dissolve's second half and gets about 3.0 s.
- `untilSec` 27.25 can stay: the freeze holds the tag whole (exit start = frozen frame 890).
- If the tag must land only after the dissolve, the only other route is fewer words. That goes back to the fact-check.

**S4. 202.34: "one man" and ISAAC NEWTON · AFTER ENOCH SEEMAN, c. 1726 arrive on the same frame, in opposite corners.**
- The eye goes to the chip. The 7-word tag gets 1.26 s before the match at 203.60, and the match takes it soft from 203.70.
- So it is neither readable (about 2.1 s needed) nor a single entrance.
- Fix: in `73+74+75`, change `props.labels[0].atSec` from 7.32 to **5.42** (act 200.44, on "And on that"). The tag then has 3.16 s, and "one man" lands alone at 202.34.
- Trade-off for Sam: the picture is named 1.9 s before "one man". If that spoils the line, the other option is to credit the portrait in act 4, where Newton is named, and drop the tag here. Do not keep both on one frame.

**S5. 9.00-9.10: the dateline's move to the corner starts at full speed.**
- `DatelineTag.tsx` (around line 31) eases the 0.9 s move from (960, 860) to (120, 84) with SLOW_OUT. Frame 271 jumps about 170 px from rest, then the tag glides. On a move of about 1,140 px that reads as a jolt.
- Fix: change the easing to `Easing.inOut(Easing.cubic)` and keep 0.9 s.
- Act 1 also uses `toCornerAtSec`. Either re-render act 1's dateline shot too, or add an opt-in prop (for example `cornerEase: "inOut"`) and set it on act 3's `A_manchester_talk.props.tag` only.

**S6. 194.99-195.30: a sliver ". 25" of W. C. HENRY · 1854 · P. 25 is frozen under the band.**
- The un-wipe ends 1 frame after PaperBandWipe freezes H (frame 5850), so ". 25" sits frozen at (275, 927) for about 10 frames until the band covers it.
- Fix: in `H_wish_over_portrait`, change `props.labels[0].untilSec` from 10.63 to **10.55** (act 194.37).

## TASTE

- **T1. Pace, 51.24-128.08.** B (23.3 s), S (27.6 s) and D (26.0 s) are three similar long shots in a row: 77 s on three framings.
  - Inside them the changes come every 2-3.5 s (the stillness check passes), and the hard cut at 102.10 marks the turn, so I would not cut them up.
  - If a reframe is wanted, the best place is S's rack at 82.93: let the push carry on there, for example `camera.push` 0.03 over the second half only.
  - The last third builds well (15.6, 6.5, 11.2, 8.6, 4.5 s).
- **T2. 127.11-128.37: "tinted" is up 1.26 s** before the wipe covers it. The blue fill carries the word.
  - If wanted: start `49+50+51` at 128.30 (+0.22 s) and move SFX-006 to 127.80, the marker to 128.30, and that shot's highlight local times −0.22. All of it stays inside the pause 127.50-128.58.
- **T3. 143.44-144.85: "blue glass" is up 1.41 s.** In `C_carry_into_eye`, change `overlay.chips[0].untilSec` from 7.35 to **7.60** (act 145.10, before the rays at 145.17).
- **T4. 182.85-184.07: "two" is up 1.22 s**, the same as "one man". Sam accepted that length at the end; leave it unless he wants it longer.
- **T5. 28.95-29.70: the page settles only about 0.4 s before the match pulls into it.** Rising on "reads" (28.35, `carry[1].atSec` 25.95) would let it be seen landing, but it then crowds the chapel tag (S3). I prefer leaving it.
- **T6. 74.74: OTHERS · DALTON'S SIX lands while the glide is still pulling back** (it ends at 75.80), so the text is moving as it arrives. Option: change `props.overlay.spectrum.labels[0].atSec` from 0.24 to **1.30** (act 75.80, on "colours").
- **T7. 51.27-51.33 (frames 1543-1545): the push's iris edge shows 4-6 stepped rings** from the motion-blur samples. It is very brief; the reviewer may class it as a defect.
- **T8. 61.35-62.45: A SEALED LETTER · 1841 is settled and readable for about 1.1 s.** Option: `carry[2].untilSec` 11.21 → 11.40 (sinks 62.64-63.24, 0.18 s into "Think" and the rack).
- **T9. 153.10: the wax sticker and the PHOTOS TODAY label enter on the same frame.** Option: `labels[1].atSec` 15.6 → 15.9.

---

## The 13 cuts: eye trace and whether each reads

| # | Time | Transition | Last frame: where the eye is | Next subject | Verdict |
|---|---|---|---|---|---|
| 1 | 2.40 | band down, paper | slate title (100-430, 480) | "question" chip (160, 400) at 3.42 | Reads. The bright paper band carries the +48 L* jump; it reads as a page turn. |
| 2 | 29.70 | focus match | page title (408, 908) | p.28 page (x 120-1000, full height) | Reads. The eye lands inside the same page; the title is 0.75 frame-heights higher, but highlight 1 at 31.24 takes the eye there. Swish is early (S1). |
| 3 | 40.21 | canvas glide right | p.28 card, left | p.34 card, left | Reads. 10 frames of whole-frame blur (1220-1229) read as a pan, not a smear. |
| 4 | 51.24 | push (iris) | laurel line start (300, 595) | the same line's start lands at (615, 462) | Reads; good match. Whoosh 3 frames early (S1). |
| 5 | 74.50 | canvas glide down | olive pair / label, left | prism centre; chip at x 210 | Reads. The −50 L* drop is staged: the page shrinks onto the dark canvas, then the prism rises, over 1.3 s. No flash. The frozen label is M1. |
| 6 | 102.10 | hard cut | strips' centre (960, 518) | eye centre (960, 540) | Reads; the hit is on the cut frame (bed, −18 dB at 102.10). |
| 7 | 128.08 | drafting wipe right | "tinted" (160, 380) | p.43 card, left; the wipe reveals the left first | Reads; marker sound on the line. |
| 8 | 137.50 | ink bleed | "vitreous" (894, 303) | blue jelly, spreading from the same point | Reads. |
| 9 | 161.80 | slide | stickers, left | p.43 card, left | Reads; labels are clear of the freeze (frame 4853). |
| 10 | 177.37 | shape morph 0.35 s | vitreous box (832, 285) | disc on the left iris (472, 392), held 1 s | Reads. Fast but followable; pop within 1 frame (177.70 against the land at 177.73). The cross-dissolve ghosts for 4 frames (5326-5329). |
| 11 | 183.82 | cut on action down 90 px | left iris (472, ~430) | spectacle lens (854, 516), about 20% away | Reads: eyes to eyes, with the move blurred on both sides. |
| 12 | 195.02 | band up, dark | Henry strip (about 900, 1000) | blurred Newton; chips 3.5 s later | Reads (Sam's breath). Sliver: S6. |
| 13 | 203.60 | focus match | "one man" (230, 610) | closed shutter (280, 390) | Reads. Swish early (S1). |

## Brightness jumps flagged by the colour check (judged as cuts)

All four are acceptable. None of them needs a fix.

- **2.40, +48 L*:** a dark slate opening onto a bright plan is the right chapter opening, and the paper band brings the brightness in over 0.75 s.
- **29.70, −23 L*:** the same chapel, blurred and darkened behind the card. It reads as continuity.
- **51.24, +29 L*:** the bright page grows inside the iris. Going into the page explains the change.
- **74.50, −50 L*:** the biggest drop in the act. The glide stages it in two steps, the page shrinking onto the dark canvas and then the photo rising. The prism's bright spectrum sits where the eye lands, so it is darker by the meter than to the eye.

## Rhythm notes (passed)

- Every shot's picture arrives on or just before its words: the closest are 74.50 (words at 74.64), 102.10 (103.25) and 183.82 (184.64). Every shot leaves after its thought is complete.
- Every pause in the narration is used: the dateline moves at 8.94-10.09, the letter sinks at 61.89-63.10, the ink spreads at 137.56-139.30, and the transitions fall in the pauses at the cuts. The rest are deliberate holds ("To him, a match", "Then he does what a scientist should").
- Reading times pass except S3, S4 and T2-T4.
- Eases pass except S5 (the dateline jump-start). The slide's SLOW_OUT start is hidden by motion blur.
- Sound against picture: the pencil at 20.77, the marker at 128.08, the hit at 102.10, the morph pop at 177.70 and pages_move at 41.51 all land within 1 frame. The rest are M2, S1 and S2.

Fixes, in short:
- **Picture:** B (M1, S2), S (frozen frame, M1), A (S3, S5), H (S6), 73+74+75 (S4).
- **Audio:** M2 and S1.
- Re-render the picture fixes with `scripts/render-changed.py`.
