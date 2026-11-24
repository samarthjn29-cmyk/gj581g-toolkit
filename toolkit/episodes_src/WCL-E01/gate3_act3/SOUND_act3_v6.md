# Sound review: WCL-E01 act 3 "The talk" v6 (208.1 s)

Reviewer: Sound (Gate 3). I did not mix this act, played no audio, and changed no files except this report.

**Verdict: PASS with one SHOULD. No MUST inside the act.** S1-S3 are applied and measure as intended. The 4 swishes and the wax pop sit in pauses. One thing changed that was not on the list: the whole music bed is about +2.2 dB louder than v5 (see SHOULD 1). It raised the phone-check MASK count from 8 to 11, and every one is a word tail running into a pause.

## Measured
- Loudness -16.0 LUFS, TP -1.9 (PASS). Voice audit: only the 3 known flags (148.9 'the', 161.85 swish in a pause, 171.1 Sam's pause).
- Voice over everything else at 1-4 kHz: median +29.2 dB (v5 +29.6); 11 MASK, 5 warn (v5 8 and 6).
- Bed level, music-alone windows, v5 -> v6 (RMS dBFS, same clip positions):

  | window | v5 | v6 |
  |---|---|---|
  | slate 0.1-2.3 | -26.4 | -24.4 |
  | 19.5-20.2 (pause) | -34.6 | -32.5 |
  | 64.0-64.9 | -46.4 | -44.2 |
  | 199.3-200.3 | -29.4 | -27.9 |
  | 203.2-204.2 | -33.9 | -31.7 |

  Voice-dominated windows are unchanged (+-0.1 dB), so only the bed moved. This is why the pauses read 2-3 dB lower.

## S1-S3 status
- **S1** cue 1 `from` 280.167: applied. The tool still proposes 280.15 (-0.018); keep 280.167 (track continuity across the join, as in my v5 note).
- **S2** cue 2 `fadeOut` 1.64: applied. It matches the tool's proposal exactly; the fade ends at 99.8, as the riser starts.
- **S3** cue 4 levels and `fadeOut` 0.6: applied. Act-out 206.7-208.1 is -28.7 LUFS (v5 -34.3). Music alone at 207.2-207.6 is -30.4 dBFS (v5 -36.1). The lift to -27 lands at 207.08. Still 1.4 s of music alone after "born.", short of the 2-3 s rule; see the act 4 note in Joins.
- Music editor, the other proposals: cue 1 fade 1.97, cue 2 `from` +0.09 and cue 4 `from` +0.26 and fade 2.39 stay rejected, for the same reasons as v5. Cue 3 is ambient and left alone.

## New SFX times (all checked against word times, +2.4 s)
- **29.88** swish_v1 (-26, 0.32 s): in the pause after "paper." (ends 29.35); its tail ends at 30.20, 40 ms into "Its" (30.16) at -26 dB. OK.
- **51.21** low whoosh: after "check." (50.67), ends 51.87 before "Here's" (51.89). OK.
- **153.13** pop v2: in the pause after "eye." (ends 153.06), 0.8 s before "Reds". OK.
- **195.27** swish v3 (-17.6, 0.39 s): ends 195.66, "But" at 195.67. It clears the word (mix 195.6-195.7 shows the dip before the onset). OK, but with no margin; see TASTE 1.
- **203.83** swish v1 (-21): in the pause after "man." (ends 203.09), ends 204.15 before "A" (204.34). OK.
- No sound three times running: pop, swish, pop, swish, swish; the last two are pop-free and 8.6 s apart. OK.

## MUST
None.

## SHOULD
1. **Whole bed +2.2 dB over v5 (cause unknown to me).** Either it is intended, or the `mix-cue-bed.py` normalisation moved when S1/S2/S3 were re-run.
   - Check first: v5 and v6 `lufs` per cue and the bed files' integrated loudness (cue 1 -34, cue 2 -35, cue 4 -35 are unchanged in the sheet).
   - If not intended, re-mix with each cue 2 dB lower: cue 1 `lufs` -36 and its `levels` [[0,-28],[2.0,-28],[2.9,-36],[51.2,-36]]; cue 2 `lufs` -37; cue 4 `lufs` -37 and levels [[183.6,-37],[206.7,-37],[207.08,-29],[208.1,-29]]. Cue 3 untested: I could not isolate it. This restores the v5 MASK margins (+5 to +9 dB at the pause windows) and keeps S3's act-out gain over v5 (+3 dB).
   - If intended, leave it, but note that act 3's slate is now -24.4 dBFS against act 2's -30.5 music-alone, so the join patch has a 6 dB ramp to hide.
2. **'and' at 200.44 on a phone** ("And on that, Dalton leans on one man"): the phone-check misses it in the mix, not on the voice alone. It follows a 1.4 s pause with cue 4 at -27.9 dBFS in it. This is a different word from v5's false flag at 181.84. It likely clears when SHOULD 1 is applied; if not, take `[[199.0,-35],[200.2,-35],[200.4,-38],[200.9,-38],[201.2,-35]]` into the cue 4 levels.

## TASTE
1. 195.27 swish: move to 195.20 for a 70 ms margin before "But". Low priority.
2. T1, T3 and T4 from v5 still stand (title read quiet span; end of the 192.6-194.6 span; SFX-016 count at the episode check).

## Joins (acts 1-2 locked)
- Act 2 v10 found (`out/WCL-E01_act2_v10.mp4`). Act 2 -> act 3 v6: +3.3 LU (OK, same as v5), no click, E major both sides (0.64 / 0.68). **Quietest 50 ms -60.6 dBFS: a hole**, the same as v5 (act 2's last 100 ms fade plus act 3's 0.03 s fade-in). Still a MUST at assembly, not for this act: lay the Wholesome track at 280.167 under the join, as in the v5 report.
- Act 3 -> act 4: the last 35 ms is digital zero (208.05-208.085) and the bed is at -54 dBFS from 208.0. Unchanged. At act 4, set cue 4 `fadeOut` 0.03 and carry At Rest into act 4's slate; this also gives the 2-3 s of music alone.

## Listen list for Sam (3)
1. **1:01** on your phone: "to seal letters" - "seal" or "see"? Still lost in the phone mix. If "see", add S4 from v5 (a 3 dB dip), or the bed trim in SHOULD 1.
2. **3:20** on your phone: "And on that, Dalton leans on one man." Is "And" clear after the pause?
3. **3:26-3:28**: the act-out after "born." Music lifts at 207.08 and fades out. Enough of a breath, or cut off?

## Proposed line for SOUND_NOTES.md
- 2026-11-24 (act 3 v6): after any cue-sheet edit and re-mix, compare music-alone windows with the last version: the bed shifted +2.2 dB with no cue-level change and was found only through the MASK count.
