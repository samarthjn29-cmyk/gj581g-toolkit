# Sound review: WCL-E01 act 3 "The talk" v5 (208.1 s)

Reviewer: Sound (Gate 3). I did not mix this act, played no audio, and changed no project files except this report.

**Verdict: PASS for act 3 v5. No MUST inside the act.** All 8 MASKs are deliberate: a word's tail running into a pause where the bed comes back, the turn riser, or the cardstock slide. Of the 2 phone-lost words, 'and' is a false flag and 'seal' is marginal. There are 4 SHOULDs, all in the cue sheet only: re-mix with `mix-cue-bed.py` and `mix-act-bed.py`, with no picture render. The joins need a patch when the episode is assembled (a MUST then, see below).

## What I read and measured
- **Reports read:** `phone_v5.md`, `join_act2_act3.md`, `act3_v5_voice_audit.md`, `ep01-act03.json` ("audio", "voice"), `ep01-act03.music.json`, the word times (+2.4 s), and the registry entries for the SFX and MUS used.
- **Music editor:** re-ran `music-beats.py` (report only, no `--apply`). Output is the same as given.
- **Voice, SFX and music split:**
  - `out/v5_audio.wav` is the voice plus SFX. The voice sits sample-exact at 2.40 s with gain 1.000, so SFX = raw minus voice, exactly.
  - In the 720 mix the voice sits at +6 ms with gain x1.434 (+3.1 dB).
  - Music in the mix = |mix| - |g*raw| per STFT bin (magnitude domain, as in `phone-check.py`).
  - Each flag was read at 50 ms resolution, 1-4 kHz, with checks in 350-1000 Hz and 4-7 kHz at the lost words.
- **Phone re-transcription:** I re-transcribed the phone-model snippets at 56-64 s and 178-186 s (faster-whisper small.en) for the mix, the voice alone and the full-range mix.
- **Track positions:** I cross-correlated acts 1, 2 and 3 against the Wholesome track to find where each act sits in it.
- **Loudness:** -16.0 LUFS integrated (audit: -16.10), TP -1.8 dBTP (audit: -1.78). **PASS.**
- **Voice against music on speech, 1-4 kHz:**

  | cue | voice vs music |
  |---|---|
  | cue 1 | +23.8 dB |
  | cue 2 | +23.3 dB |
  | cue 3 (D) | +25.1 dB |
  | cue 3 (rest) | +24.6 dB |
  | cue 4 | +21.9 dB |

  Cue 4 is the closest to the voice; that is still fine at story level.

## Each MASK and phone-lost word: what is under it
The masking windows are 0.5 s long, starting at the time shown. Six of the eight start on the last syllable of a sentence and run into the pause after it. The pocket duck releases there, so the bed returns. In every case the body of the word is +14 to +24 dB over the music; the low reading comes from the pause half of the window. No SFX is under any of them except at 127.5.

| act time | under it | word body vs rest (1-4 kHz, 50 ms) | call |
|---|---|---|---|
| 19.3 | cue 1 Wholesome (-34) returns in the 0.94 s pause after "nature." | +17-24 dB; the pause half reads -46 dB rest vs no voice | Deliberate (bed in a pause). No fix. |
| 34.2 | cue 1 returns after "colours." (end of the title read) | +16-22 dB | Deliberate. See T1 (optional quiet span on the title). |
| 42.2 | cue 1 under the tail of "paper." (the final /r/ at 42.35 is level with the music) | +15 dB | Deliberate (bed in a pause). The pages_move SFX ended at 41.55. No fix. |
| 58.5 | cue 2 Thinking Music, a note at 58.90 in the pause after "wax." | +18-20 dB | Deliberate. No fix. |
| 96.2 | cue 2 in the mid-list pause after "blue" (before "or") | +25 dB on "blue" | Deliberate. No fix. |
| 101.7 | MUS-015 riser (99.6-102.1, -30) cresting into SFX-025 at 102.1 | +20-22 dB on "should"; only the final /d/ (101.85-102.0) is under the crest | **Deliberate** (the riser goes under the line before the turn, per MUS-015). The hit lands in true silence: voice is digital zero from 102.05 to 103.2, so the word time 'He' 101.91 is an aligner error and "He offers" starts at 103.2. Listen item 2. |
| 127.5 (-11 dB) | SFX-006 CardstockSlide (127.58, -18 dB, hero) in the pause after "tinted." (127.61); then SFX-017 marker at 128.08 | The window is 90% pause. Voice is gone by 127.55; the slide peaks at 127.90 | **Deliberate**: the hero sound of p.43 arriving (cut at 128.08), in the pause before "In his words" (128.54). No fix. |
| 199.4 | cue 4 At Rest (-35) back up in the 0.93 s pause after "is." | +14-17 dB | Deliberate. No fix. |
| phone 'seal' 61.08 | cue 2 under "to seal letters". Not masked: +22 dB at 1-4 kHz, +24 dB at 4-7 kHz. Weakest at 350-1000 Hz (+12 dB), where a music note attack at 60.90 (-31 dBFS) sits on the "to s-" join. | Re-run: phone mix "to **see** letters"; voice alone "seal"; full-range mix "seal". | **Real but marginal.** A fix is possible (S4), but only if Sam hears it. Captions read "seal". On the phone, Sam's "sealing wax" (57.7) reads as "ceiling wax" on the voice alone too: that is in the voice (final), and the captions cover it. |
| phone 'and' 181.84 | Quiet span 180.95-183.5 at -55 under the punchline "And Dalton only has two." No SFX. | +22-25 dB in all bands | **False flag.** Re-transcribing 178-186 s keeps "And" at 181.84 in the phone mix; the full-file miss is a whisper segmentation slip. No fix. |

The warn rows (76.9, 81.3, 194.4, 202.9, 206.3) follow the same pattern: word tails into pauses ("too.", "wall.", "wish.", "man.", "born.").

## Sound designer's read
- **In a pause:**
  - In a pause: 29.4 paper under the 29.65 swish; 51.09 low whoosh; 127.58 slide; 128.08 marker; 153.7 pop; 161.85 swish; 177.7 pop; 195.12 swish; 203.65 swish.
  - 55.19 pop sits in the 0.16 s comma gap after "leaf," and is 36 dB under the voice.
- **On words, at texture level:**
  - SFX-017 pencil (20.75-21.65) runs under "college is called", 22-29 dB under the voice. It is tied to the map ring drawn at 20.77. See T2.
  - SFX-016 pages_move (40.40-41.55) fills the pause, then its tail runs 0.45 s under "And it's a", 24-32 dB under. Acceptable.
- **No sound three times running:** none. The last run is pop, swish, swish.
- **Kit and hero levels:** kit fits the material (paper for pages, ink for the ring and highlight, air for wipes, a pop for the lifted leaf). Hero sounds are at hero level (slide -18, swishes -17.6 to -26).
- **Episode SFX counts:** SFX-016 PaperFoley has 11 cues across acts 1-3 (3 + 6 + 2), against a registry max of 10 beats per episode. See T4.
- **Near-silences inside the act** (not joins, so the -50 rule does not apply):
  - 64.0-64.9: Thinking Music's own decrescendo to about -75 dBFS after "Think about that." Not in the cue sheet. Listen item 5.
  - 99.55-99.85: cue 2 has faded out and the riser starts from quiet. This is the drop-out before the turn.
  - 181.0-181.7: the punchline quiet span.
  - 183.3-183.6: true silence, about -85 dBFS, from cue 3 ending at 183.4 to cue 4 fading in at 183.6. A beat after "two." Listen item 3.
- **Voice audit a3-12** (1.36 s pause at 171.1): this is the sentence end after the quote "...which has not been done." The aligner misplaces 'In'; "In other words" starts at about 172.4. The quiet span ends at 171.3, so the bed returns to -51 to -58 dBFS in the pause. That is no hole and no swell. Nothing for sound.

## Music editor: each proposal
`--apply` writes **all** proposals at once, so do not run it. Make the edits below by hand in `ep01-act03.music.json`.

| cue | proposal | judgement |
|---|---|---|
| 1 the talk, entry | from 280.20 -> 280.15 (-0.051) | **Change `from`, but to 280.167, not 280.15** (S1). This is not a cue entry: the Wholesome bed runs continuously through acts 1-3. Measured: act 1 at track 0.0, act 2 at 104.59 (nominal 104.6), act 2 lasts 175.567 s, so act 2 ends at track 280.167. Act 3 now starts at 280.19-280.20, which skips about 33 ms at the join; the tool's 280.15 would repeat 17 ms. Continuity is what matters here, not a beat. It will be heard once the join hole is patched. |
| 1 the talk, fade-out | 1.00 -> 1.97 s | **Do not apply.** This is the crossfade into cue 2: cue 1 fades 50.2-51.2 against cue 2's 0.6 s fade-in from 50.7, with the low whoosh at 51.09 and the cut at 51.24. A 1.97 s fade would start at 49.23 under "anyone can check." and thin the music a bar before cue 2 arrives. Keep 1.0. |
| 2 the match, entry | from 0.00 -> 0.09 (+0.093) | **Do not apply.** The track's own first attack is at 0.03-0.05 s, and at 50.7 the 0.6 s fade-in starts from silence, so a beat there is inaudible. The current `from` already puts a beat at 51.257, 17 ms after the cut at 51.24; the shift would move it to 51.16. |
| 2 the match, fade-out | 0.80 -> 1.64 s | **Apply** (S2). No cue crossfades in here: the riser is an event, and cue 3 only enters after the hit. The fade starts on a bar at 98.16 under "blue and purple." and ends at 99.8 as the riser starts. The music clears before the turn (the Harris drop-out) and is lower under the last words. Listen item 2. |
| 3 the guess | no steady beat, left | Agree. Long Note Two is ambient, and its entry is pinned to the hit at 102.1. |
| 4 the wish, entry | from 75.00 -> 75.26 (+0.256) | **Do not apply.** The 1.0 s fade-in hides the beat at 183.6. The current `from` puts a beat at 183.856, 36 ms after the cut at 183.82, and one at 184.41 on "At" (184.47). The shift moves both off by about 0.25 s. |
| 4 the wish, fade-out | 1.00 -> 2.39 s | **Do not apply.** The fade would start at 205.7 under "before Dalton was born." and cancel the +8 dB music-alone lift (206.7-207.4) before it blooms. See S3 instead. |

Note on the tool: its fade logic starts the fade on a bar and ends it at the fixed `until`. The docstring says the fade ends on a bar.

## MUST (act 3 v5)
None.

## SHOULD (sound only: edit the cue sheet, `mix-cue-bed.py` -> bed v4, then the same `mix-act-bed.py` call as v5 with `--fade-in 0.03 --fade-out 0.03`, then re-run `phone-check.py`)
- **S1 (cue 1, track continuity):** `"from": 280.167` (was 280.2). Do not take the 280.15 the tool proposed.
- **S2 (cue 2, fade before the turn):** `"fadeOut": 1.64` (was 0.8).
- **S3 (cue 4, act-out):**
  - **Change:** `"levels": [[183.6,-35],[206.7,-35],[207.08,-27],[208.1,-27]]` and `"fadeOut": 0.6` (was a lift to 207.4 and a 1.0 s fade).
  - **Problem now:** music alone after "born." (206.68) lasts 1.42 s, against the 2-3 s rule. Its lift is mostly eaten by the fade: the act-out measures -34.3 LUFS, against the slate's -26.3.
  - **Effect:** the change reaches -27 on the beat at 207.08 and fades from 207.5. That is about +3.3 dB on the act-out, to roughly -31 LUFS.
  - **Full fix (later):** the 2-3 s needs either the last shot (E_dark_room) held 1.0 s longer at the next picture render, or cue 4 carried across the join into act 4's slate (see joins).
- **S4 (cue 2, 'seal' on a phone; only if Sam hears "see" at listen item 1):**
  - **Change:** add `"levels": [[50.7,-35],[60.6,-35],[60.85,-38],[61.8,-38],[62.1,-35],[99.8,-35]]`.
  - **Effect:** a 3 dB dip under "to seal letters." Cue 2 is otherwise unchanged.

## TASTE
- **T1:** The paper's title read (31.24-34.22, "Extraordinary facts relating to the vision of colours") has no quiet span; the other quotes do. Option: `"quiet"` add `[31.1, 34.4, -50, 0.3]`.
- **T2:** SFX-017 at 20.77 sits on words, at texture level. Leave it now. In a future picture pass, move the ring and the stroke into the pause at 19.45-20.3.
- **T3:** The quiet span for "his strongly expressed wish" ends at 194.6 with a 0.3 s ramp, so the music starts back 70 ms before "wish." ends (194.37). Option: end it at 194.8.
- **T4:** SFX-016 has 11 cues against a max of 10 per episode (counted on audio cues). `beatsheet-check.mjs` counts beats, so confirm at the episode check. If it is over, drop act 3's 29.4 `paper_move` (it sits under the 29.65 swish).

## Joins (for assembly; acts 1-2 are locked, the episode is not joined)

| join | step | quietest 50 ms | cause |
|---|---|---|---|
| act 1 v18 -> act 2 v10 | +8.1 LU | -71.9 | act 2 opens on a fade-in from silence (first 0.25 s at -50 dBFS rms) |
| act 2 v10 -> act 3 v5 | +3.3 LU (OK) | -60.6 | act 2's last 100 ms fade to -52/-61 dBFS; act 3 opens with a 0.03 s fade |
| act 3 v5 -> act 4 (to come) | not joined yet | about -61, then digital zero | act 3's last 50 ms is digital zero (cue 4 fades to nothing at 208.1) |

Act 2 -> act 3 also has the same key (E major), no click, and the 33 ms track skip covered by S1.

**MUST at assembly: no hole at any join.** Patch the joins and leave the acts as they are (picture stream-copied, acts 1-2 not re-mixed):
- Acts 1-2 and 2-3 share one continuous Wholesome bed. Under each join, lay the same track at the same position (track 104.6 for 1->2, 280.167 for 2->3), from 1.0 s before the join to 0.5 s after it.
- Set its gain to each side's music-alone level times (1 minus that act's own edge fade), so that the sum is a steady bed through the cut.
- Then re-run `act-join-check.py` on the joined file. Target: quietest 50 ms above -50 dBFS.
- For 3 -> 4: when act 4 is mixed, set cue 4 `fadeOut` to 0.03 and let At Rest continue under act 4's slate, or crossfade it into act 4's first cue across the join. This also gives act 3 its 2-3 s of music alone.

**Loudness steps:**
- The +8.1 LU at 1->2 is not a level mismatch. The music-alone stretches either side match: act 1's last 3 s are -30.0 LUFS, act 2's slate (0-2.4 s) is -30.5 LUFS. The 6 s windows catch act 2's voice from 2.4 s against act 1's quiet act-out, plus the fade-in hole. No level change is needed; re-measure after the patch.
- At 2->3, act 3's slate (-26.3 LUFS) is about 4 dB hotter than acts 1-2's music-alone parts. Ramp the patch from act 2's bed level up to act 3's slate level across the 0.5 s after the cut.

## Listen list for Sam (5)
1. **1:01** (on your phone): in "people once used to seal letters", do you hear "seal" or "see"? Only if it's "see", apply S4, the 3 dB dip.
2. **1:38-1:43** (after S2): the music thins under "blue and purple", then the riser builds under "Then he does what a scientist should" into the hit. Does the riser feel earned, and does "should" stay clear at its crest?
3. **3:01-3:04**: in "And Dalton only has two.", the music is near-silent, then there are 0.25 s of true silence before "the wish" fades in. Does the silence land as a beat, or feel like a drop-out?
4. **3:27** (after S3): the act-out after "born." Is 1.4 s of music enough of a breath, or does the act feel cut off? If cut off, hold the last shot 1 s longer at the next picture render.
5. **1:04**: after "Think about that.", the music's own rest drops to near-silence for about half a second before "A green leaf". Does it sound intended, or like a hole?
