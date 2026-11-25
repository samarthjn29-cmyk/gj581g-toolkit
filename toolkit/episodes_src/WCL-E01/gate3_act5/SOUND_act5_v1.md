# Sound review: WCL-E01 act 5 v1 (166.3 s)
Reviewer: Sound (Gate 3). Played no audio, changed no files. Phone-word test NOT run (no whisper, no librosa here): masking run with phone-check's own code minus transcription; music-beats not run.

**Verdict: FIX (no MUST that blocks; 3 SHOULD).**

## Measured
- Loudness -16.0 LUFS, TP -1.7 dBTP, LRA 6.0: PASS. Audio 166.314 s vs video 166.333 s (19 ms short, fine). Voice 2.4-163.7; 2.9 s of music alone to the end, fade to digital zero, no click.
- Masking 1-4 kHz: median +34.8 dB; 10 MASK, 9 warn. Pause-tail cases (15.4, 18.8, 60.0, 77.9, 139.9, 148.8) are the bed returning, not masking. Real ones: 8.9 (-18 dB), 32.7 (+7), 2.5 (+7), 132.9 (+5.4), 25.8 and 134.9 mild.
- Bed under word RMS (1-4 kHz): cue 1 and 2 about 19 dB, cue 3 24.6, cue 4 24.3. Quotes: 16.2-18.8 46 dB, 26.6-31.6 42, 136.9-139.9 35. The 123.4-126.7 span is -50 (bed 33 under) against -62 elsewhere.
- Break: bed fades 100.5-100.8 over the end of "pink." (ends 100.82), digital zero 100.8-103.6, cue 3 rises from 103.61 to full by "Newton" (104.26); swish 103.5. Clean, 0.86 s of pure silence before "Dalton's".
- Cue entries all in pauses: cue 2 32.16 (pause 31.61-32.81), cue 3 103.61, cue 4 130.49 (pause 129.97-131.14).
- Sweeps present at 73.3 and 144.05, both in pauses. Measured effect on the bed below 300 Hz: about -8 dB at 144.05, only -3 dB at 73.3 (the bed itself drops to -74 dBFS at 73.3 and a note lands at 73.4, 2 frames before the slide at 73.5). Nominal is -24 dB; judge by ear.
- Ambience: none in this act, so no early-stop loops. Longest sfx file 1.6 s.
- Swishes vs first moving frame (measured from picture diffs). Cue `atSec` leads by 2-7 frames (the act 4 convention); by each file's peak only K (103.63 vs 103.63) and I (82.91 vs 82.90) land within a frame. Others: C peak 25.03 vs move 23.87; D 32.72 vs 32.20; F 51.54 vs 50.40; cardstock (A, B, G, M, N) peaks 0.22-0.26 s after the cut.
- Act 3 / act 4 join: act 4 files absent, not checked. Note: act 4 ends on At Rest fading to zero and act 5 opens with Wholesome at -26 dB (mix -22 dBFS) with only a 0.03 s fade: lay act 4's tail under the join at assembly.

## SHOULD (exact fixes, `ep01-act05.json` audio unless stated)
1. **Swishes C, D, F are long files whose loud part lands in speech** (cloth_slide 24.96-25.09 on "have," at -16.6 dB vs voice; air_woosh peak 32.72 on "That", MASK +7; cloth_slide peak 51.54 under "So,"). Replace with short swishes whose peak sits on the first moving frame:
   - 23.66 -> `air_swish_v1.wav` atSec 23.73, -21
   - 32.08 -> `air_swish_v2.wav` atSec 32.09, -21
   - 50.17 -> `air_swish_v3.wav` atSec 50.25, -21
   Each ends inside its pause. (Cloth_slide and air_woosh then unused.)
2. **8.92 SFX-006 lands on "And" (9.18-9.70), -18 dB MASK, and repeats the 2.3 file.** Replace with `soft_pop_v1.wav` atSec 9.02, -24 (lands in the 8.99-9.18 gap).
3. **"to open it." 162.6-163.44 only +9.9 dB over the piano, and the lift starts 163.34 on the last "it."** In `ep01-act05.music.json` cue 4 `levels` replace `[163.34,-35]` with `[162.2,-35],[162.6,-38.5],[163.3,-38.5],[163.5,-35]`, keep `[164.54,-27]`.

## TASTE
- Three cardstock hits in a row (114.97, 120.23, 130.4): change 130.4 to `page_flip_v2.wav` (pixabay kit, peakSec 0.23) atSec 130.27.
- 2.3 cardstock peaks 2.66 on "More": atSec 2.1 puts the hit in the slate; with cue 1 levels `[1.6,-26],[2.5,-34]` (2.5 is a MASK, +7).
- Quiet span 123.36-126.76: -50 vs -62 elsewhere; match if it should feel like a quote.
- Cue 1 enters at 0.03 with no fade: assembly join (above).

## Listen list for Sam
1. **0:00-0:03** (join from act 4 once assembled): does Wholesome arriving feel like a clean change or a jolt?
2. **1:13-1:14**: sweep and the bed note at the slide; audible or not?
3. **1:40-1:44**: the pink / silence / "Dalton's eyes don't." break; held breath, and does "Newton" feel supported by cue 3?
4. **2:10-2:13** and **2:23-2:26**: piano under "Dalton." and "science." (MASK +5, +10) on a phone.
5. **2:41-2:46**: "Someone has to open it." Is "open it" clear on a phone, and does the lift feel earned?
