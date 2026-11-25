# Sound reviewer notes (taste log)

Read before every review, with `../REVIEW_SCORECARD.md`.

- 2026-11-24 (act 3 v5): never `music-beats.py --apply` blindly: a fade that is also a crossfade into the next cue keeps
  its length; a cue that runs on from the last act keeps its track position continuous across the join.
- 2026-11-24 (act 3 v5): a phone-check MASK in the pause after a sentence (the music coming back up) is not masking.
- 2026-11-24 (acts 1-3): acts mixed alone dip to silence at their edges; at assembly, lay the continuing track under
  each join so the quietest 50 ms stays above -50 dBFS.
- 2026-11-25 (act 4 v1): `endSec` in the act file does not loop the audio. Check a long ambience cue's file length against its span; two 12 s projector files stopped 9 to 16 s early, found only by measuring the residual in pauses.
