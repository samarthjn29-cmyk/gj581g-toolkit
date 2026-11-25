# Gate 3 Sound review: WCL-E01 act 1 v2 (104.6 s, 30 fps), v1

Reviewer: Sound (not the builder). Measured, not heard. Nothing edited, rendered or committed.
Clip: `library/out/WCL-E01_act1_v2.mp4`; stems `_act.wav`, `_bed.wav`; narration `01_flower_paced_148wpm.wav` (+0.80 s); words JSON (+0.80 s).

## Verdict: FIX (3 MUST, all sound-only: act file edits + remix, no picture render)

Everything else passes: loudness, peaks, quiet spans, the break, "fail." dry, no clicks, no clipping.

## Method (so the numbers can be trusted)
- Mix decoded from the mp4 (6 ms AAC delay aligned). Mix = 1.57x (+3.95 dB) of the stem + ducked bed. Music in the mix = mix minus 3.95 dB-scaled stem; checked against my own re-run of the pocket duck (300-4000 Hz, ratio 4) on the bed stem: agrees within 1 dB, so the AAC residual is not polluting the figures.
- Voice in the mix = narration wav x 0.707 x 1.57. Voice sits at -18.0 dBFS RMS (active samples), peaks -0.4 dBFS before the limiter.
- Word times = JSON + 0.80 s (checked: narration starts 0.80 in the act, "Kendall," voiced 0.80-1.20).
- NOT run: `phone-check.py` (no result after 8 min, stopped) and `music-beats.py` (needs `librosa`, not installed). I ran a 1-4 kHz voice-vs-rest margin by hand instead (see Masking). The music-beats proposals are therefore not judged: nothing here uses `--apply`.

## Loudness (PASS)
| Item | Target | Measured |
|---|---|---|
| Integrated | -16 LUFS | -16.11 (ffmpeg, as reported); -15.99 (pyloudnorm, my check) |
| True peak | -1.5 dBTP or lower | -1.87 (oversampled -1.86); sample peak -1.87 dBFS at 81.73 (a voice peak, limiter) |
| Clipping | none | 0 samples above 0.81 full scale |
| L/R | balanced | -19.65 / -19.60 dB |
| Clicks at cue edges | none | none. Largest second-difference spikes: 15.04 (pop v2 attack, -21 dBFS, the pop's own transient), 33.89 and 54.18 (whoosh/voice onsets), 104.527 (file end, -40 dBFS, the 0.03 s fade at the join). Act starts at exact 0 and ends at -42 dBFS (music, by design for the join). |

## Music under the narration (K-weighted, voiced samples only, after the pocket duck)
| Cue | Class | Target under voice | Measured | Call |
|---|---|---|---|---|
| 1 the evening 1.0-26.0 | story | 19-21 dB | 20.4 dB (-34.7 vs voice -14.3 LUFS) | PASS |
| 2 the evidence 26.6-49.0 | story | 19-21 dB | 17.3 dB (-33.1 vs -15.8) | 2 dB hot: S3 |
| 3 the question 49.1-78.3 | explanation | ~27 dB | 27.1 dB (-43.1 vs -15.9) | PASS |
| 4 the wait 82.0-98.3 | story | 19-21 dB | 22.5 dB (-39.7 vs -17.2) | 1.5-3.5 dB quiet: S4 (low priority) |

## Cue entries and quiet spans (bed stem and mix residual)
| Spot | Plan | Measured | Call |
|---|---|---|---|
| Cue 1 at 0.0 | music alone, lifted, fade-in 0.03 | Music alone 0.0-0.8 at -24 to -31 dBFS in the mix (13 dB under the voice average). No click. "Kendall," (0.80) starts while the ramp to -34 is still falling: music -31 at 0.8, -34 at 0.9, -42 at 1.0 (14-17 dB under the voice onset) | PASS, S6 minor |
| Pause 6.275-8.611 | music alone, lifted | 6.7-8.2: mix music -30.1 dBFS vs -37.0 / -35.9 on the flanks = +6 dB (bed +4.5 dB); back down by 8.6 before "A young" (8.611). Room tone also present at -44 | PASS |
| Cue 2 at 26.15 | enters in pause 25.30-26.47 | 0.6 s fade-in runs 26.15-26.75; only the last 0.3 s is under "Tonight," (26.47-26.81). Page turn is in the same pause. First music beat at 26.90 (bed -30, in the gap before "by" 27.25) | PASS |
| Quiet 29.9-33.0 | quote dry | Bed -45 to -68; mix music -44 to -60 dBFS = 26-42 dB under the voice. "astonishingly changed" is dry. One music note at 29.4-29.7 (mix -37) in the pause before "In" (29.985): this is the voice audit's "NOISE 0.30 s at 29.5". It is a normal note, not a defect (T3) | PASS |
| Cue 2 swell 35.95-37.2 (+3.5) | reveal swell | Bed -37.1 vs flanks -36.0 / -35.5: lift is about 0 to -1 dB on average (track rests at 36.75-37.2, bed -56 to -65; its real note is at 37.25, outside the window) | S3 |
| Cue 3 at 48.70 | enters in pause 47.40-49.28 | `long_note_two` has 1.85 s of digital silence at its head. Bed at 48.7-49.0 is cue 2's fade tail (-39 to -66); cue 3 is silent after 49.1 and only audible from about 51 (bed -64 at 50-52, -47 at 52-54). The pause carries only the whoosh (peak -31) | S1 |
| Cue 3 swells 57.0 and 77.3 | +3.5 | +3.5 to +5 dB (57-58) and +2.2 dB (77.3-78.3), both in pauses | PASS |
| "fail." 79.71 | no music | Cue 3 out at 78.75; bed is digital zero 78.8-81.3; mix music -54 at 78.8-79.2, below -64 at 80.0-80.4. Pop (T1) on the word | PASS |
| Cue 4 at 80.80 | enters in pause 80.67-81.53 | `at_rest` has a 0.55 s silent head, a faint swell at 0.6 (-44), first full chord at about 1.65. Bed zero until 81.4 (-57), -48 at 81.5; the first chord lands at 82.4. So the entry is heard as "And" (81.53) begins, not in the pause | S2 |
| Break 86.8-87.2 | near-silence | Bed -50, -67, -71, -52 (86.8-87.1); mix music -65 to -68. Voice ends 86.75 | PASS |
| Cue 4 lift on the sub 87.2 (+4) | swell | Bed -41 before, -40 to -43 after: lift not visible; the sub dominates. Music alone after the hit sits at -37 to -41 dBFS | PASS (T4) |
| Quiet 98.45-101.55 | under the sting | Bed -61 to -71; mix music -56 to -63 while the sting plays (MUS-006: peak -16 dBFS, 1 s rms -21 dBFS, 5.6 dB above the voice average). Music returns at 101.5 (bed -32) and holds -26 to -29 dBFS to 104.0, 3.0 s alone | PASS |

## Sound cues (levels in the final mix; 20 ms RMS peak unless noted)
| Cue | Act level | Measured | Against the voice (avg -18) | Call |
|---|---|---|---|---|
| SFX-001 globe whoosh 2.70 (pause 2.66-4.16) | -20 | rises -55 to -38; peak -35.5; sample peak -29.9 | 17 dB under; about equal to the music in that pause (-36) | S5 |
| SFX-013 match strike 3.35 (peak at 3.46) | +2 | peak -21.9; sample peak -3.4 dBFS | at voice level, the loudest non-voice event after the sub | listen L1 |
| SFX-014 room tone 3.45-17.6 | 0, fades 0.6/1.0 | -44 dBFS in pauses (-47.5 at 3.5-4.1); gone by 17.6 (-85) | 26 dB under the voice; 8-13 dB under the music in the same pauses | S5 |
| SFX-028 page turn 26.22 | -18 | body -45 to -39 in the pause; its loudest hit lands at 26.74 (file `peakSec` 0.52) at -33, under "Tonight," | 15-19 dB under the word | M3 |
| SFX-028 shutter lock 94.64 | -24 | 20 ms peak -37 (at 94.98); sample transient -23 dBFS at 94.72; projector hum -45 to -48 | 10 dB over the hum; 17 dB under the voice | S5 |
| MUS-015 riser 83.37 | -18 | -76 at 83.4, -55 at 84.2, -42 at 85.4-85.8 (peak), then silent from 85.87 (file is 2.5 s) | peak 19 dB under the local voice and equal to the music (-40) | M1 |
| SFX-025 sub 87.20 | -12 | peak -18.2, 1 s rms -27.1 | 0.7 dB over the voice average, in the pause | M2 (phone) |
| SFX-015 tick 85.87 | -22 | peak -30.5, on "years." | 6 dB under the word | PASS |
| SFX-003 shutter tick 72.18 | -24 | peak -37.2, in the pause | | PASS |
| SFX-001 77.15 | -15 | peak -26.1, in the pause 77.10-78.77 | | PASS |
| Whoosh pair 33.55 / 33.81 | -14.6 / -18 | peak -25.7; nothing above voice-14 dB after "It's" (33.86) | | PASS |

Cue timing against words (non-pop cues): 3.35 and 2.70 sit in the pause after "England." (ends 2.66); 26.22, 33.55, 48.70, 72.18, 77.15, 87.20, 94.64 all start in real pauses. Cues that start on a word, all well under it: 10.95 low whoosh on "at" (-16.5 dB under the word), 54.20 SFX-001 on "be" (peak -42.9, 24 dB under), 54.72 dial_turn on "sure" (-13), 64.75 paper_move on "a" (-14), 68.50 pages_move on "years" (-25), 83.37 riser on "in" (-48), 90.37 swish on "dark" (-15), 95.88 switch click on "open" (-19). None is a problem at those levels.
All 18 chip pops (SFX-026) sit exactly on a spoken word onset, by ENERGY rule 9: peak -25.8 dBFS each, 5-10 dB under the word (closest in T1).

## Masking (my 1-4 kHz voice-vs-everything margin per 0.5 s, stand-in for phone-check)
13 windows under +15 dB, 7 under +10 dB. Deliberate or in pauses: 26.0 (page turn), 33.5 (red-flood whooshes), 67.5 (low whoosh 67.35), 90.5 (pop 90.28 / swish 90.37), 93.0 (pop 92.98 on "small"). Real: 85.5 (4.2 dB) and 86.0 (8.1 dB), the riser's loud end plus the tick plus music under the quiet tail of "151". M1 moves the riser's loud end out of those windows (expected riser at 85.5 about -52 instead of -42).

## MUST (fix before Gate 3 passes)

**M1. Riser (MUS-015) is inaudible and ends 1.33 s before the hit.** Act file `ep01-act01-v2.json`, entry `MUS-015`.
Measured: file is 2.5 s, so it stops at 85.87; its peak in the mix is -42 dBFS, the same level as the music under it and 19 dB under the voice; then 1.0 s of nothing (86.2-87.0, -91) before the break and sub. ENERGY rule 6 and the registry ask for a riser "ending hard on the hit".
Fix: `"atSec": 83.37` to `84.70`, `"volumeDb": -18.0` to `-12.0`. It then ends on 87.20; its last 0.45 s (86.75-87.20) lands in the pause over the break; start is under "for 151" at below -60 dBFS. Expected: about -35 dBFS rms at the end, 15 dB over the broken music, 8 dB under the sub. Re-measure after the remix.

**M2. The sub is inaudible on a phone speaker.** Entry `SFX-025` at 87.20, `sub_impact_v1.wav`.
Measured: 99.9% of its energy is under 120 Hz (peak 51 Hz); the 120-300 Hz band is 49.6 dB below the total, 300 Hz and up lower still. `sub_impact_v2` is the same (under 120 Hz, -72 dB above). On a phone the act's one big line has no audible hit; only headphones get it. The shot's asset list already names SFX-005 (registry: "MutedThump ... one big number or reveal landing, in the pause after the line"), but the act file has no SFX-005 cue.
Fix: add `{"id": "SFX-005", "file": "public/sfx/muted-thump.wav", "atSec": 87.2, "volumeDb": -14.0}` next to the sub (the file has real energy at 120 Hz-5 kHz: -12 dB in each of 120-1000 Hz). Target: its 20 ms peak about -24 dBFS, 6 dB under the voice average, and the sub unchanged. Re-measure; if it reads too weak, go to -11. Check the SFX-005 count (cap 4 per episode) in the cap table before committing.

**M3. Page turn (SFX-028) lands its loudest moment on "Tonight,", and is faint in the pause.** Entry at 26.22, `page_turn_book_v2.wav`.
Measured: the kit file's loudest 10 ms is 0.52 s after its start (kit.json `peakSec`), so it hits at 26.74, inside "Tonight," (26.47-26.81, voice -14 to -18 dB). The picture cuts to the p.30 card (TRN-020) at 26.30. Inside the pause the body is only -45 to -39 dBFS, level with the fading cue-1 tail (-44 to -47). Rule (SOUND.md): start the cue `peakSec` before the visual hit.
Fix: `"atSec": 26.22` to `25.78` (peak on the cut at 26.30; whole sound 25.78-26.44 is inside the pause 25.30-26.47) and `"volumeDb": -18` to `-14` (expected peak about -29 dBFS, 11 dB under the voice average). If the page turn's visual hit is not the cut, use hit minus 0.52.

## SHOULD
**S1. Cue 3 entry is silent until about 51 s.** `ep01-act01-v2.music.json`, cue "3 the question": `"from": 0.0` to `2.4` (skips the 1.85 s silent head and the first 0.5 s of build; the note rises from about -67 dB re full at 48.7 to -50 by 49.2, in the pause, ahead of "So" at 49.28). Check dynaudnorm does not lift the start; keep `lufs -41`.
**S2. Cue 4 entry is heard under "And" (81.53), not in the pause.** Same file, cue "4 the wait": `"from": 0.0` to `0.55` (skips the 0.55 s silent head, so the faint swell is audible from 80.8 in the pause 80.67-81.53; first chord then lands at about 81.85 under "the real"). Keep fade-in 0.5.
**S3. Cue 2 is 2 dB hot and its swell does not register.** Same file, cue "2 the evidence": `"lufs": -35` to `-37`; `levels` to `[[26.15,-37],[35.75,-37],[35.95,-33],[37.45,-33],[37.8,-37],[49.1,-37]]` (swell is +4 dB and now covers the 37.25 note instead of ending in the track's rest). Expected gap under the voice 19.3 dB.
**S4. Cue 4 is 1.5-3.5 dB quiet under the voice (22.5 vs 19-21).** Only if Sam hears the finale music as faint: cue "4 the wait" `"lufs": -35` to `-33`; levels `-35` to `-33`, `-31` to `-29`, keep `101.7,-27`. Expected gap 20.5 dB.
**S5. Foley that is present but too faint.**
- SFX-001 globe whoosh 2.70: `volumeDb -20` to `-14` (peak -35.5 to about -29.5, now above the music).
- SFX-014 room tone: `volumeDb 0` to `5` (about -39 dBFS in pauses, still 21 dB under the voice, and now audible over the music). Keep fades 0.6/1.0 and `endSec 17.6`.
- SFX-028 shutter lock 94.64: `volumeDb -24` to `-18` (peak about -31, 14 dB over the hum). Timing is fine (peak at 95.00, in the pause 94.60-95.36).
**S6. "Kendall," enters over a falling bed.** Cue 1 `levels`: `[0.55,-26],[1.0,-34]` to `[0.45,-26],[0.75,-34]` so the music is settled by 0.8.

## TASTE
- T1. Pops on quiet words: 47.12 "Jonathan." (pop 1.2 dB under the word's rms), 35.18 "red." (3.0 dB), 53.94 "not" (4.7 dB), 79.71 "fail." (the word "fail" is the only sound there besides this pop). If they stick out on a phone, set these four to -23 dB.
- T2. The match strike (3.35, +2 dB) has a sample peak of -3.4 dBFS, level with the voice. Fine as the opening hit; drop to 0 dB if it feels sharp.
- T3. The 29.4-29.7 music note before the quote: let it ring, or set the quiet span's start from 29.9 to 29.45 to kill it.
- T4. The +4 dB music lift on the sub (87.2) is not visible; the sub covers it. No change needed.
- T5. 54.20 SFX-001 sits on "be" at 24 dB under the word: inaudible, and the registry says not under words. Remove it or accept.
- T6. SFX-014 runs 14.15 s of this 104.6 s act (13.5%; registry share cap 10% is presumably per episode): confirm in the Gate 3 cap table.

## Listen list for Sam (headphones first, then a phone speaker)
1. **2.6-3.8**: globe whoosh into the match strike. Is the whoosh heard at all, and is the strike too sharp right after "England."?
2. **25.6-27.0**: after the fix, does the page turn hit on the cut before "Tonight,", and does the first Thinking Music beat (26.9) feel like a landing?
3. **29.3-33.2**: the quote. Is "astonishingly changed" dry, and does the music note at 29.5 before it bother you?
4. **83.0-87.6** (on the phone speaker): riser rising through the break into the hit. Is there a hit you can hear without the sub?
5. **79.5-82.5**: "fail." with no music, then the At Rest entry. Does the silence feel deliberate, and does the music come in with the pause or after it?

(Also quickly, at 94.5-95.4: is the shutter latch heard over the projector hum on a phone?)
