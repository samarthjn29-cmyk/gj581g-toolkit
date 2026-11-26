# Sound review: WCL-E01 act 2, act2v2 v1 (by measurement; nothing was heard)

**Verdict: fix first.** Loudness and peak pass; music design is sound. One masking defect (the thump on "red" at 82.10), one broken
rule (SFX-016 three running), and the riser, the cue-3 numbers bed and several lifts are too quiet to be heard. All fixes are in
`src/episodes/ep01-act02-v2.json` (audio) or `ep01-act02-v2.music.json` (levels); sound only, no picture render.

## Measured
- Mix (out/act2v2_soundonly.mp4): **-16.05 LUFS**, true peak **-1.81 dBTP**, LRA 5.4. Both in target.
- Voice alone is about -19 dBFS RMS per 6 s window; the mix is within +0.4 dB of it everywhere. No cue or music pushes the mix over the voice.
- Music gap under the voice (ducked bed vs voice, 6 s windows): cue 1 (2.4-55) 17.7-20.9 dB (story, on target);
  cue 2 (55-79) 20-25; cue 3 (84-141) 17 at entry, 22-25 at 90-112, **29-32 at 115-141**; cue 4 (141-175) 21-26.
- Narration pauses (voice silent) have a median mix level of -34 to -41 dBFS up to 110 s, then -45 to -47 at 120-140 s.

## MUST
1. **82.10 hit masks "red" (82.10-82.34).** SFX-005 muted-thump has its peak 0.163 s after the file start, so at atSec 82.10 it
   peaks at 82.26 inside "red". Its 1-4 kHz energy is only 8 dB under the voice for 0.3 s (voice rms -16.6, hit rms -25.6 in the
   0.1 s steps 82.1-82.3: 0 to -12 dB). The sub impact is low-frequency and is not the problem (full-band -23 dB rms, 1-4 kHz -65 dB).
   Fix, act file, SFX-005 at 82.10: `atSec 82.10 -> 81.94` (peak lands on the sub at 82.10) and `volumeDb -14 -> -22`.
   Also SFX-026 pop at 82.10: `volumeDb -20 -> -26` (a third layer on one hit). Keep SFX-025 at 82.10, -12.
2. **SFX-016 three running at 103.60 / 104.03 / 106.25** (page_turn, pages_move, paper_move; no other sound ID between).
   Fix: remove the SFX-016 `pages_move.wav` cue at atSec 104.03 (endSec 104.48); page_turn at 103.60 already carries the move.

## SHOULD
3. **Cue 3 is too quiet under the numbers (115-141).** The track decays (dynaudnorm'd file level falls from about -26 dB at track
   position 60 s to -36 dB at 99 s; the cue plays positions 43-100 s). The ducked bed is **-48.7 to -52 dBFS**, 29-32 dB under the voice
   (target about 27) and 45-47 dBFS in the pauses; it is effectively inaudible on a phone. There is also a 12 dB dip right after the
   entry (88-92: -51 vs -38.7 at 84-88) and at 112-116 (-52). Fix, music.json cue "3 what stays the same", levels:
   `[98.55,-41],[141,-41]` -> `[98.55,-41],[111,-41],[115,-37],[141,-37]` (+4 dB from 115: gap becomes about 25-28 dB, bed about -45).
   A different `from` is not advised: it breaks the carry-on from act 1 (the flat part of the track is at 206 s).
4. **Lifts that do not lift (measured on the bed, voice absent):** cue 1 at 26.0-26.9 asked +4 dB, got +1.5; cue 3 at 97.15-98.3
   asked +3.5, got **+0.8**; cue 4 end 174.8 asked +8, got **+0.6** (the bed then falls to -45 by 175.5). Cue 2's lift at 78.8 (+12 dB
   measured) and cue 4's at 166.5 (+6) are audible. Fixes, music.json levels: cue 1 `[26.0,-30],[26.9,-30]` -> `[26.0,-27],[26.9,-27]`;
   cue 3 `[97.15,-37.5],[98.3,-37.5]` -> `[97.15,-34],[98.3,-34]`; cue 4 `[174.8,-27],[175.57,-27]` -> `[174.8,-22],[175.57,-22]`
   (re-measure the last 0.8 s; it must read at least 5 dB above the 174.6 level).
5. **Riser MUS-015 (79.6-82.10) is inaudible until its last 0.5 s.** File is 2.5 s so it does end exactly on the hit at 82.10 (good).
   But under "His mother opens the present and says," it is 26-45 dB under the voice (-65 dB at 80.0 rising to -45 at 81.2; the gap
   81.52-81.86 only reaches -40, the voice is -16). Fix, act file MUS-015: `volumeDb -12 -> -6` (end about -33, still 18 dB under "they're as").
6. **SFX-005 thump at 114.87 lands 0.16 s late** (file peak at 0.163 s; onset 115.00). The break is 114.47-114.87 and the mix is
   digital-silent (-65 to -80 dBFS) from 114.55 to 115.00, 0.45 s, not 0.4, and the hit comes after the quiet, not on its end.
   Fix: SFX-005 `atSec 114.87 -> 114.71` (peak at 114.87). The two swishes at 114.98 (-17.6) and 115.01 (-19) are 30 ms apart and stack
   (a doubled, phasey whoosh, combined peak -14.4): remove the SFX-024 at 115.01. The music bass sweep at 115.06 is at -63 dBFS in the
   bed (cue 3 is -49 around it): nothing is heard from it, the swishes do the job.
7. **Ticks on "four" are hot:** SFX-018 at 129.45 (stopwatch_tick_v2, -19) is 6 dB under the voice in 1-4 kHz; at 133.79 (v1, -19) it is
   only 1.8 dB under. Fix: 129.45 `volumeDb -19 -> -26`; 133.79 `-19 -> -27` (or move it into the pause at 134.19-134.5).
8. **50.19 SFX-005 thump + SFX-026 pop start with "Except,"** (thump peak 50.35 inside the word, 1-4 kHz 15.5 dB under the voice, warn
   level). Fix: SFX-005 `volumeDb -16 -> -22`. (A MASK-free move: atSec 50.19 -> 50.64, the pause after the word, if the picture hit allows.)
9. **94.79 pop (-27) is 170 ms before the 94.96 pop (-20)**, both under "and a mother": a doubled pop, and the fourth SFX-026 in a run
   (92.5, 93.7, 94.79, 94.96). Fix: remove the SFX-026 at 94.79.

## TASTE
- 147.08 / 147.88 / 148.64 / 149.56: four soft pops in a row on "Grass, blood, cherries, sky." (the same ID four times, rhythm on a list,
  each one on its word at about 41-49 dB under in 1-4 kHz, i.e. felt not heard). Could swap the last (149.56) for the swish or drop it.
- 55.2-55.5: cue 1 fades out (fadeOut 0.8 from 54.95) before cue 2 fades in (55.45-55.95): the bed dips about 11 dB (-49.6 vs -38) for
  0.3-0.4 s inside the pause. If heard as a hole: cue 1 `fadeOut 0.8 -> 0.4`.
- 87.93 pages_move (-28) peaks at -37 dBFS, about the level of cue 3 (-44 bed): marginal; `volumeDb -28 -> -22` if Sam wants it heard.
- 27.48 pencil_stroke (-29) is about 16 dB under the "teaching" word tail: fine as a texture; `-29 -> -25` if it is meant to be heard.
- The mix is digital silence (-89 dBFS) for 83.55-84.0, then cue 3 enters at 84.0 into a pause that runs to 84.55. Designed ("no music
  79.95-84.0"); but 0.45 s of true zero after "John!" may read as a dropout on some players. Optional: room tone under it.
- SFX-018 ticks: six in a row (121.48 x2, 129.45, 130.66, 133.79, 135.42): a counting rhythm on the numbers, deliberate.

## What passed
- **Entries versus pauses:** cue 1 alone 0-2.4 s (allowed); cue 2 enters 55.45 in the pause 54.55-55.85, 0.4 s before "There's another
  story" (55.85); cue 3 at 84.0 in the pause 83.44-84.55; cue 4 at 140.7 in the pause before "Picture it from the inside" (141.25).
  No cue overlaps another except the intended crossfades (55.45-55.75 and 140.7-141.0); no two cues run alone for more than 0.5 s.
- **Quiet spans:** 52.3-54.75 bed -53 to -55 dBFS (about 35 dB under the voice) and 75.4-78.6 bed -53 to -57: near-silent under the quotes; the
  bed is back (-44) by 54.75 and -42 by 78.6, in the pause after the words ("myself." ends 54.55, "words." 78.58).
- **Riser and hit:** riser file 2.5 s from 79.6 ends at 82.10 on the SFX-025 sub impact (file peak 6 ms in). SFX-025 appears once in the act. Sub
  hit is -23 dB rms full band (6.7 dB under the voice rms at 82.1) but almost all below 200 Hz: felt, not speech-masking. "John!"
  (83.26-83.44) and "cherry," (82.78-83.0) are clean: the hit is -35 dB under the voice by 82.8.
- **Break 114.47-114.87:** "brothers." ends 114.42, the bed is gone by 114.55 (fast 0.05 s drop), no click.
- **Words with a cue on their onset (all by design, all at or under -14 dB of the voice in the full band; 1-4 kHz gap in brackets):**
  5.43 dial_turn (-44), 14.69 / 15.71 pops (-47/-51), 21.71 swish + 21.76 pop on "than/50" (-20), 24.98, 27.48, 28.44, 44.7 (-31),
  68.85, 73.5, 92.5, 93.7, 98.55 swish on "look at" (-16, warn), 121.48 ticks on "eight" (-17), 147-149.5, 170.57 typewriter on "enough" (-29).
  Only 82.10, 50.19, 129.45 and 133.79 are close enough to matter (items 1, 7, 8).
- **Inaudible (over 30 dB under the mix around it):** none among the cues except the riser's first 1.6 s (item 5), the 115.06 music sweep (item 6)
  and the three lifts (item 4). Too hot (within 6 dB of the voice): only the ticks at 129.45 and 133.79 and the hit's thump at 82.10.
- **End:** last word "why." ends 174.57; the act ends 175.57, so music is alone for 1.0 s (rule allows 2-3 s, but the act length is fixed).
  Bed at 174.6-175.0 is -35 to -39 dBFS and falls to -45 at 175.5; the intended +8 dB end lift is not heard (item 4). fadeOut 0.05 s ends at
  -40 dB: no click. Next act's start is not in scope; at assembly lay the continuing track under the join (notes, 24 Nov).

## Listen list for Sam
1. **82.0-83.5** - does the hit land on "red" cleanly, and is "as red as a cherry" fully clear on a phone speaker?
2. **79.6-82.1** - after the riser fix, does the climb into the hit feel earned, or is it still hidden under "His mother opens the present"?
3. **114.4-115.3** - is the 0.4 s dropout after "brothers." a deliberate beat, and does the thump land on the end of the silence?
4. **115-141** - is the music audible at all under the numbers (the eight-in-a-hundred / four-in-a-hundred passage), and does the tick on "four" bother?
5. **174.5-175.57** - does the act end on music you can hear, or does it just stop?

## Proposed lines for rules/notes/SOUND_NOTES.md
- 2026-11-26 (act 2 v2): muted-thump.wav (SFX-005) peaks 0.163 s into the file (a 1-4 kHz click-thump); place atSec 0.16 s early so the peak sits on the picture hit, and keep it 8-10 dB lower than the sub impact when it shares a word.
- 2026-11-26 (act 2 v2): a `levels` lift on a decaying ambient track can measure only +1 dB (long_note_two, at_rest); measure the bed (out/*_bed.wav) at each lift and set the dB by the number, not by the cue sheet.
- 2026-11-26 (act 2 v2): long_note_two decays 10 dB over 60 s of its length; for a cue of 50 s or more, add a +4 dB levels ramp across the decay.
