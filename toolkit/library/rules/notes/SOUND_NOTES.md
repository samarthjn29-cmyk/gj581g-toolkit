# Sound reviewer notes (taste log)

Read before every review, with `../REVIEW_SCORECARD.md`.

- 2026-11-24 (act 3 v5): never `music-beats.py --apply` blindly: a fade that is also a crossfade into the next cue keeps
  its length; a cue that runs on from the last act keeps its track position continuous across the join.
- 2026-11-24 (act 3 v5): a phone-check MASK in the pause after a sentence (the music coming back up) is not masking.
- 2026-11-24 (acts 1-3): acts mixed alone dip to silence at their edges; at assembly, lay the continuing track under
  each join so the quietest 50 ms stays above -50 dBFS.
- 2026-11-25 (act 4 v1): `endSec` in the act file does not loop the audio. Check a long ambience cue's file length against its span; two 12 s projector files stopped 9 to 16 s early, found only by measuring the residual in pauses.
- 2026-11-25 (act 5 v1): a long whoosh file (cloth_slide, air_woosh) started before the picture puts its loud part 0.6-1.4 s later, inside speech; use a short swish whose file peak sits on the first moving frame, and run sound-pass with --lead 2.4.
- 2026-11-26 (act 2 v2): muted-thump.wav (SFX-005) peaks 0.163 s into the file; place atSec 0.16 s early so the peak sits on the picture hit, and keep it 8-10 dB under the sub impact when it shares a word.
- 2026-11-26 (act 2 v2): a `levels` lift on a decaying ambient track can measure only +1 dB (long_note_two, at_rest); measure the bed (out/*_bed.wav) at each lift and set the dB by the number. long_note_two decays 10 dB over 60 s: a cue of 50 s or more gets a +4 dB ramp across the decay.
- 2026-11-26 (act 2 v2): SFX-025 once per act: a reworked act inherits the old version's impact, so count the subs in the final act file, not in the rework script.
