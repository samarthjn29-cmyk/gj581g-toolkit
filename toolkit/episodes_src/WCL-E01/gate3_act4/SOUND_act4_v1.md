# Sound review: WCL-E01 act 4 v1 (215.7 s)

Reviewer: Sound (Gate 3). I did not mix this act, played no audio, ran no whisper, changed no files except this report.

**Verdict: PASS with 5 SHOULDs. No MUST.** Loudness -16.0 LUFS, TP -1.8 dBTP (PASS; LRA 4.9). Voice over everything else at 1-4 kHz: median +34.5 dB (act 3 +29.2); 13 MASK, 10 warn, all but two groups are word tails running into a pause or the slate. The break, the cue entries and both act ends are clean. The phone-speaker word test is NOT run (it needs whisper); masking was run with phone-check's own code minus the transcription.

## Measured
- Bed under the voice (word RMS vs bed RMS): cue 1 story 16.0 dB; cue 2 explanation 15.8 (act 3 house level, -34/-35 unchanged); cue 3 explanation 23.9, 19.1 near 146-156; cue 4 19.3. Quotes: 114.96-118.8 30.7 under (bed -50.6 dBFS); 142.25-145.33 40.3 under (-57.6); 156.77-164.54 30.3 under (-49.1). So explanation cue 2 is about 11 dB louder than the ~27 target, and quotes 1 and 3 about 15 dB louder than ~45. Not masking (see SHOULD 4); cue levels match act 3, so I did not call it a re-mix.
- MUS-010 break: "else." ends 103.78, "It" starts 104.77. Bed ducks 103.63-103.68 and the mix is -54 to -72 dBFS for 0.9 s (not digital zero), nothing else sounds in it, and the bed is back at 104.77-104.82 under "It doesn't." with no click. Works as designed.
- Cue entries: cue 2 at 24.25 inside the 23.74-24.90 pause (crossfade with cue 1, low whoosh 24.1 in the same pause); cue 3 at 119.2 inside 118.60-119.85, swish 119.1; cue 4 fades in 177.9-178.9, "He" starts 178.55 with the bed about 65% up, about -3.7 dB under its final level: fine.
- Start: music alone 0-2.4 at -24 dBFS (fade-in 0.03: first 20 ms -127, then up); the swish at 2.28 sits just before "So" (2.40). Bed drops -26 to -34 over 2.0-2.9, so it is still about -28 under "So let's".
- End: "it?" ends 212.75; lift starts 212.7, mix -39 to -25 dBFS at 213.1 (a 13 dB step in about 0.2 s); 2.95 s of music alone (rule 2-3 s: OK); fade from 214.7; last 100 ms -50 to -103; last samples digital zero (1 ms). No hole, no click.
- SFX vs picture: sound-pass finds every sounded shot within 0.1 s lead of its motion time (2.28/2.40, 60.70/60.78, 66.07/66.17, 80.22/80.32, 112.10/112.19, 119.10/119.20, 154.02/154.12, 164.78/164.88, 177.80/177.90, 189.28/189.38, 199.72/199.81). Unsounded beams (D1, I1, I2) stay silent by one-hero rule. Measured SFX peaks sit -24 to -29 dBFS, 3 to 8 dB over the bed RMS, except dial_turn (below).
- Music editor: cue 2 `from` -0.059 and fade 0.70, cue 1 `from` +0.209, cue 4 `from` +1.718 and fade 1.02: all rejected (cue 1 is the series bed from track 0, cue 4 is a new At Rest entry, cue 2's fade ends in a quote quiet span). Cue 3 ambient, left.
- Act 3 -> 4 join not checked: no act 3 mp4 in out/. Do it at assembly.

## MUST
None.

## SHOULD
1. **Projector ambience stops early.** projector_hum.wav and projector_run.wav are 12.0 s files and the act list gives 28 s and 21.1 s with no loop. Measured: hum present 34-45 s (-49 dBFS), gone from 44.7 (inside the 44.58-45.44 pause) to the end of the shot at 60.7; run present 92-103 s, gone from 103.0 to 112.1. Fix: in `src/episodes/ep01-act04.json` audio, add a second entry for each, `projector_hum.wav` atSec 44.6 endSec 60.7 fadeInSec 0.4 fadeOutSec 0.4 volumeDb -30, and `projector_run.wav` atSec 102.9 endSec 112.1 fadeInSec 0.4 fadeOutSec 0.4 volumeDb -30 (or add loop support in `scripts/act-audio.py`). The run restart falls inside "else." (103.28-103.78); it is quiet, but check the seam is not heard at the break.
2. **"And" 198.24 and tail of "impressed." 196.92.** Piano notes of cue 4 are only +1.8 dB (And) and +2.1 dB (impressed.) under the voice in 1-4 kHz, after a short 0.75 s pause: the same case as act 3's "And on that". In `ep01-act04.music.json` cue 4 `levels`, add between the first two points: `[196.8,-35],[197.2,-39],[198.9,-39],[199.4,-35]`.
3. **"But notice what Newton has" 206.09-207.3** sits only +7 to +9 dB over the bed (the line that sets up the last question). Same file, cue 4 `levels`: `[205.8,-35],[206.0,-38.5],[207.6,-38.5],[208.0,-35]` before `[212.7,-35]`.
4. **Quote spans not near-silent.** The `quiet` entries `[114.96,118.8,-50,0.3]` and `[156.77,164.54,-50,0.4]` give a bed at -49 to -50 dBFS, 30 dB under the voice, not ~45. Set both to -62 (the middle one measures -57.6 already; set to -62 for the same feel).
5. **Two SFX.** (a) swish_v3 at 60.70 overlaps the tail of "wide." (60.46-60.89): voice over it only +9.7 dB in the band; set `atSec` 60.78 (matches the motion) and `volumeDb` -24. (b) dial_turn at 86.85 (-26) is -16.7 dB under the bed and sound-pass flags it as lost: raise `volumeDb` to -20.

## TASTE
- Four swishes in a row at 154.02, 164.78, 177.80, 189.28 (three at 60.7, 66.07, 80.22 earlier); swap 177.80 for low_whoosh (as at 24.1) if it feels sing-song.
- pop v2 at 194.64 lands inside "Hooke," (194.28-194.80), though it is only 0.09 s and low in the voice band; move to 194.82 if it is noticed.
- The end lift at 213.1 (+13 dB over about 0.2 s) may feel like a stab; a longer ramp starting 212.7 would soften it.

## Listen list for Sam
1. **1:44-1:46** ("...something else." then silence, then "It doesn't."): is the 1 s break a held breath, and does the bed return land with "It"?
2. **3:18-3:19** on a phone: "impressed. And says so." Is "And" clear over the piano?
3. **0:30-1:00** and **1:55-2:00**: is the bed in the explanation too present or just right, and are the quotes quiet enough (SHOULD 4 and the level note)?
4. **3:32-3:35**: after "So where is it?", does the lift at 213.1 and fade to the end feel earned?

## Proposed line for SOUND_NOTES.md
- 2026-11-25 (act 4 v1): `endSec` in the act file does not loop the audio: check a long ambience cue's file length against its span; two 12 s projector files stopped 9 to 16 s early and were found only by measuring the residual in pauses.
