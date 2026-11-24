# WCL-E01 act 3 "The talk": Gate 3 independent review (final cut v3)

24 Nov 2026. Reviewer: independent; I did not see the act being made.

**Clips:** `library/out/WCL-E01_act3_v3.mp4` (1080p master) and `WCL-E01_act3_v3_720.mp4`.

**Spec:**
- `src/episodes/ep01-act03.json`, `.music.json` and `gate2_act3/make_act3.py`
- beat sheet dump v3 (rows E01-A3-01..77, cols 2/3/7/21)
- the Gate 2 reviews
- `03_talk_final_words.json`
- the SRT
- the v1 voice audit

**What I did:**
- **Picture.** Contact sheets at 1 fps (720p). A per-frame difference over all 6290 frames of the master (192x108, blinks, jumps, frozen runs). Frame-by-frame tiles through every transition and both splice joins, with v2_720 as the reference.
- **Sound.** I extracted the mixes and placed NAR-003 (`03_talk_paced_149wpm_even.wav`) by cross-correlation. It sits at 2.406 s, with gain +0.68 dB.
  - I subtracted the voice to get the music + SFX residual, then took BS.1770 block loudness per section, with SFX windows and limiter-touched blocks left out.
  - I re-rendered the cue bed with `scripts/mix-cue-bed.py` into scratch (not into the project) for pre-duck levels.
  - I ran a speech on/off map from the take itself. Its pauses are digital silence, so word onsets are exact to 10 ms.
  - I scanned for HF clicks wherever the voice is silent.
- **Checks.** I ran `scripts/stillness-check.py` on both files. I diffed the caption text against `act3_recorded_script.json`.

Scratch evidence: `/tmp/claude-0/-home-claude/4f679353-75c2-5592-944f-4863c7efe9b2/scratchpad/` (`img/`, `*.py`). It may be cleared.

## Verdict: FIX

There are five MUST items:
- an unplanned hard cut out of the slate;
- a one-frame scale snap at two transition starts (one of them is the first splice join);
- the explanation music about 6 dB too loud in shot D;
- six caption cues 1.3-1.8 s early;
- the audio stream 2 frames shorter than the picture.

All five are small edits to the generator, the mix call, the caption script or one library file. Apart from these, the cut holds up well: the olive pair, the hit cut, the period tags, the face rule and the second splice join are clean, and so are the delivery numbers.

## Delivery (item 4)

| Check | Spec | Master | 720 | Result |
|---|---|---|---|---|
| Length | 209.68 s | video 209.667 s (6290 frames = round(209.68 x 30)) | same | PASS |
| Frame rate | 30 fps CFR | 30/1; all 6289 pts deltas = 512/15360 | same | PASS |
| A/V same length | equal | **audio 209.600 s** (10,060,800 samples) vs video 209.667 | same | **FAIL → M5** |
| True peak | ≤ -1.5 dBTP | -1.8 | -1.7 | PASS |
| Loudness | -16 ±0.5 LUFS | -16.0 | -16.1 | PASS |

- The 720 audio is bit-identical to v2_720's, so v3 changed picture only.
- The master's AAC (262 kb/s) is the same mix as the 720's. The difference between them is -30 dB codec noise; there are no clicks in either.

## Checked and passing

**Voice**
- The voice is placed once at 2.406 s, with constant gain (+0.68 dB over the file).
- 0.5 s windowed gain: median +0.67 dB. The spread is -0.4 to +1.8 dB, and only on peaks or very quiet windows. No gaps, cuts or level jumps.
- The final peak limiter (house chain, mix-act-bed.py: 1 ms attack, -2 dBFS ceiling) takes up to about 1.7 dB off syllable peaks. That is the approved chain, not an edit.

**Hit cut**
- The cut is frame 3062→3063, at 102.100 s.
- The hit's onset in the residual is 102.105-102.110 s, a +13.5 dB rise inside one frame. Cue 3 enters under it.
- The riser runs 99.60-102.10, so it ends on the hit.

**Music alone at the act's ends**
- 0-2.4 s: music alone at -24.2 LUFS.
- After "born." (206.9-209.5): music alone at -25.1 LUFS, with the cue 4 lift to -27 (cue-sheet terms) in place.

**Clicks**
- No HF bursts at the cue joins (50.7-51.2, 99.6-99.8, 102.1, 183.4-183.6) or at any quiet-span edge.
- The one tick in the act is at 207.19 (S6).

**One hero at a time**
- The only overlaps are paper SFX-016 (-34) under the swish (-26) at 29.4-30.2, and the marker (-27) under the cardstock (-18) at 128.08. Both are textures 8-9 dB under their hero, as the rule allows.

**Sound effects in pauses**
I checked them against the measured silences, not the word file.
- These all start in true silence: 29.40, 29.65, 51.09, 102.10, 128.08, 153.70, 161.85, 195.12 and 203.65.
- SFX-006 at 127.58 overlaps the last 0.05 s of "tinted." This is the J-cut, by design.
- 20.77 (pencil) and 40.31 (pages) sit on words at texture level, as approved at Gate 2.
- The 55.19 pop sits in the comma dip after "leaf," (voice -40 to -45 dBFS). That is acceptable.
- The exception is 177.87 (S1).

**Quotes**
- All three quiet spans drop the music to -48 to -52 LUFS: 29-37 dB under the voice. See T3.

**Olive pair**
- At "To him" (frame 2162, 72.067 s), masked means are leaf (98, 86, 29) and wax (96, 83, 30). That is one colour.
- At 71.33 they were still green and red.

**C keeps two colours**
- At 159.0 the leaf is (37, 59, 37) and the wax (83, 8, 14), both under the blue.
- No olive in C. PHOTOS TODAY is on from 153.10.

**Period tags**
- Every modern photo is tagged: PHOTO TODAY (prism), PHOTOS TODAY (B and C), A WAX SEAL · TODAY.
- The dated old items are tagged too: the 1794 plan, the chapel AS IN 1835, the 1841 letter, the 1834 portrait and the Wellcome model.

**Face rule**
- Dalton's face is never covered or animated.
- The Henry strip sits under his chin, and the band reaches the face only as the shot ends (195.3-195.5).

**Second splice join (4853/4854)**
- It is clean. v2 and v3 frames 4851-4856 match to 0.5-0.6 levels (codec).
- Frame 4853→4854 changes by 0.9 levels, only at the incoming edge (the slide's first frame).

**Highlights and pages**
- Every highlight holds at least 2.2 s before its transition: 37.50→40.21, 48.50→51.24, 134.30-134.70→137.50, 192.81→195.02.
- Every page card holds at least 9.4 s.

**Stillness**
- stillness-check passes everywhere except 204.1-209.7 (T1).

**Captions**
- The words match the recorded script exactly: 508/508 tokens, figures 1794 and 28, quote marks as written.

## MUST (defects)

**M1. A hard cut at 2.40 s from the slate onto the plan.**
- **Evidence:**
  - Frames 71→72 show a mean luma jump of 47→169 in one frame. It is the largest single-frame change in the act (diff 122; the 102.10 cut is 17).
  - Tile: `img/t_slate.jpg`.
- **Spec:** row E01-A3-02 says "Plan fades in under the slate (0.6 s)", and row 39 calls 102.10 "the act's ONE hard cut".
- **Cause:** the A_manchester_talk shot has no `transitionIn`, so `Episode.tsx` treats it as a cut (`built=true`, startSec -1).
- **Fix:** in `make_act3.py`, add `transitionIn="band", transition={"dir": "down", "tone": "paper"}` to the `shot(B(*range(2, 13)), "LayerStage", ...)` call. This is act 2's slate exit; `shot()` adds TRN-011 to the assets.
  - `"match"` would be the closer "fade", but it would put TRN-015 twice in a row (A, then A2).
  - Write the change back to row 2. It changes an approved note, so Sam sees it.
- **Check:** frames 66-90, with no single-frame luma step over about 30.

**M2. A one-frame 1.6-2% scale snap of the page card as two transitions start: 51.23 s (p.34 → B push) and 137.50 s (p.43 → C ink). The 137.50 one is the first splice join (4124/4125).**
- **Evidence (1080p bounding box of the cream page):**

| Frames | Before | After |
|---|---|---|
| 1536 → 1537 | x 122-980, y 116-967 | x 129-973, y 122-959 |
| 4124 → 4125 | x 122-1199, y 117-967 | x 130-1199, y 124-958 |

- v2_720 has exactly the same jump at 4124/4125, so the splice did not cause it.
- **Cause:** the transitions draw the old shot frozen (`<Freeze frame={prevDur - 1}><Shot beat={prev} /></Freeze>`) inside the new shot's Sequence. So `drift(frame, durationInFrames)` in ArchivalScanCard reads the next shot's longer duration, and the frozen card comes out smaller than its real last frame:
  - p.34, 331 frames, frozen inside B's 698 frames: scale 1.014 instead of 1.03;
  - p.43, 282 frames, frozen inside C's 729 frames: scale 1.010 instead of 1.03.
- Joins where the next shot is shorter clamp, so they show no snap. I measured that for 128.08, 161.8, 177.37 and 203.6.
- **Fix:** in `src/episodes/Episode.tsx`, at all three freeze sites (`frozenPrev`, the slide and the push), wrap the old shot so it keeps its own duration:
  `<Freeze frame={prevDur - 1}><Sequence durationInFrames={prevDur} layout="none"><Shot beat={prev} /></Sequence></Freeze>`.
  - This is a library fix. Acts 1-2 lose the same snap where they have it, so re-render them only if wanted.
  - For act 3, re-render shot B (from frame 1537) and shot C (from frame 4125) and splice them as v3 did.
- **Check:** bounding boxes equal across 1536/1537 and 4124/4125.

**M3. Shot D: the explanation music is about 6 dB too loud (102.1-128.1).**
- **Measured:** music -36.9 LUFS against a voice at -15.9 LUFS integrated, so 21 dB under. Beat 39 asks "about 27 dB under the voice (explanation level)".
  - Measured in clean speech blocks, with SFX and limiter-touched blocks excluded.
  - Per second, it reaches -33 LUFS under "The biggest is a clear jelly" (110-113).
- **Causes:**
  1. Long Note Two is about 4 dB louder in its first 25 s than later. In the bed render, pre-duck: D -40.2 LUFS, C -44.5, p.43 -42.7. Cue 3's -41 is the cue's average.
  2. The whole bed sits about 2.5-3 dB hotter against the voice than the cue sheet assumes. In the premix the voice sits at about -19.2 LUFS (the master gain was +3.4 dB), not -16. See S2.
- **Fix (two lines):**
  - Add to cue 3 in `.music.json`: `"levels": [[102.1, -41], [103.0, -41], [103.4, -44], [127.6, -44], [128.3, -41], [183.4, -41]]`. This keeps the entrance on the hit full, then sits D 3 dB lower from before "He offers" (103.25).
  - Run `mix-act-bed.py ... --lufs -37.3` (the bed's printed -34.81 less 2.5 dB). That lowers the whole bed, and the alone parts keep their 8 dB lift.
  - Expected result: D about 26.5 dB under, C about 27.4, p.43 about 26.3, the p.43 return about 27.7. Story cues come out about 20-21.6 (S2).
- **Check:** re-measure D's music at 25-28 dB under the voice.

**M4. Six caption cues start 1.3-1.8 s before their words, and three of them cross a transition.**
- **Cause:** the aligner glued each first word onto the end of the previous word. In the take these gaps are digital silence. Measured voice onsets (act s):

| Cue | Text | SRT start | Speech starts | Early by |
|---|---|---|---|---|
| 21 | To you, … | 67.322 | 68.73 | 1.41 s |
| 32 | He offers an explanation. | 101.906 | 103.25 | 1.34 s, on screen over the 102.10 cut and the hit |
| 43 | And honestly? | 137.498 | 139.30 | 1.80 s, over the ink |
| 47 | Before it ever reaches … | 149.572 | 150.83 | 1.26 s |
| 53 | In other words, … | 171.079 | 172.48 | 1.40 s |
| 61 | A man who died … | 203.003 | 204.33 | 1.33 s, over the match into the room |

- Also: cue 30 starts at 96.39 against speech at 96.81 (0.42 s early). Cues 20, 31 and 42 end 0.12-0.16 s before their last word ends (67.43, 101.99, 137.58).
- **Fix:** in `gate3_act3/caption_words.py`, after alignment, snap any word whose start equals the previous word's end (±0.01 s) to the first 10 ms frame above -50 dBFS after the silence in `03_talk_paced_149wpm_even.wav`. End each cue at its last voiced frame + 0.05 s. Then rebuild the SRT.
  - The new starts are 68.68, 103.20, 139.25, 150.78, 172.43, 204.28 and 96.76.
  - The new ends are 67.48 (20), 102.04 (31, still before the cut) and 137.63 (42).
- **Note:** leave `03_talk_final_words.json` as it is for the generator. No picture cue rides on these six words, but beat notes 27 ("the held 'To' (67.32)") and 52 ("cued on 'And'") quote the wrong times (S8).

**M5. The audio ends 67 ms (2 frames) before the picture, and the cue 4 fade is cut short (209.600 against 209.667 s).**
- **Evidence:**
  - ffprobe audio duration_ts is 10,060,800 at 48 kHz.
  - The last 20 ms of the mix are at -46.6 dBFS (last sample 0.0038), not silence. The fade-out is planned to end at 209.68.
- **Why it matters:** when act 4 is joined on, the concat leaves a 67 ms hole under the music-alone ending, right on the frame act 4 opens with.
- **Cause (most likely):** in `mix-act-bed.py`, `amix ... duration=first` follows the render's own audio, which ends at 209.600. The bed itself is 209.680 s.
- **Fix:** in `scripts/mix-act-bed.py`, pad the act's audio to the video's length before the mix: `[0:a]aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur={dur}[act]`.
- **Check:**
  - ffprobe audio duration 209.667 s;
  - the last 20 ms below -60 dBFS;
  - TP and LUFS re-measured.

## SHOULD (clear improvements)

**S1. 177.87: the morph's pop lands on "So".**
- The voice starts at 177.86. The pause is digital silence from 177.24 to 177.80; the word file's 178.02 is 0.16 s late.
- The morph (durSec 0.5 from 177.37) also lands on the word, not in the pause the beat note asks for.
- **Fix:** in `make_act3.py`, shot 67+68: `transition={..., "durSec": 0.35}` and the SFX-026 pop at `round(S(67) + 0.33, 2)` (177.70). Both then land in the silence.

**S2. The story music sits 1-3 dB above the 19-21 dB target.**
- Music-alone dB under the voice's integrated -15.9 LUFS:
  - cue 1: 17.2;
  - cue 4 under the keyword panel: 17.7; in the room: 17.8;
  - cue 2 in B: 18.8; in S: 18.9-20.5;
  - cue 4 under H: 19.1.
- The same `--lufs -37.3` as M3 brings these to about 19.7-21.6. No other change.

**S3. Two two-line honesty labels are on screen for under 2 s.**

| Label | Length | On screen | Duration |
|---|---|---|---|
| CROSS STREET CHAPEL · AS IN 1835 / THE SOCIETY MET IN A ROOM HERE UNTIL 1799 | 73 characters | 27.43-29.25 | 1.8 s, about 40 characters a second |
| SIMULATION · ONE WAY / HE MAY HAVE SEEN THEM | 43 characters | 72.06-73.90 | 1.84 s |

- **Fix (make_act3.py):**
  - Chapel label: `"untilSec": r(29.65)`, so it leaves with the match blur. Sam and the fact-check should also decide whether line 2 can go, because 2.2 s still cannot carry 73 characters.
  - SIMULATION label: `"atSec": r(71.65)`, landing with the olive it explains, and `"untilSec": r(S(29) - 0.3)`. That gives about 2.55 s.

**S4. D and C: the "vitreous" blue fills the whole globe, past the vitreous outline the shot draws.**
- **Evidence:** at 126.6-128.08 the teal vitreous outline is still on screen, and the blue runs past it into the space round the lens (crop `img/cmpDC.jpg`). C carries the same fill.
- **Cause:** `EyeDiagram.tsx` section mode draws the tint as `<circle r={R - 6}>`.
- **Fix:** draw the tint with the vitreous outline's own path: the `d` of the `o.parts.includes("vitreous")` path, about line 154. Check acts 1-2 for vitreous tints before re-rendering them.

**S5. Caption form.**
- Cue 44 reads "it makes sense." in lowercase after "And honestly?". It matches the script, but on screen it reads as a typo. Use "It makes sense."
- Cue 46 runs to 3 lines. Split it into two cues at about 147.15: "In Dalton's version, the tinted jelly" / "soaks up much of the red and the green light."

**S6. 207.19: a small tick at the very end of the voice file, under the music-alone ending.**
- The take's last 5 ms rise to -37.7 dBFS peak and stop at the file's end (2.406 + 204.790 s). The HF burst is 10 dB above the bed.
- **Fix:** add `"fadeOutSec": 0.03` to the act's `voice` cue. It touches only room tone 0.5 s after "born.", not the performance. Sam may prefer to hear it first (headphones, 207.0-207.4).

**S7. The last frame is not the steady room act 4 must open on.**
- RunningHead ramps "3 · THE TALK" out over the act's last 0.3 s: head luma peaks at 152 at 209.30, then 109 at 209.50 and 73 at 209.63.
- **Fix:** in `layers/RunningHead.tsx`, don't ramp out at the last beat of the act (treat the act's end as `nextOn`). Then act 4 opens on a fully lit head, or swaps it, by its own choice.

**S8. Beat-sheet notes quote the aligner's wrong times.**
- Row 27: "after the held 'To' (67.32)". "To" is at 68.73, and there is no held "To".
- Row 52: "cued on 'And'". "And" is at 139.30; the ink runs in the silence 137.5-138.8.
- Row 39: "He offers" is at 103.25.
- Write these back so the notes match the picture.

## TASTE (Sam's call)

**T1. The end hold, 204.1-209.68 (5.6 s): my advice is to keep it.**

Reasons:
1. Only the last 2.9 s are wordless. The first 2.4 s carry the act's closing line ("A man who died long before Dalton was born.", 204.33-206.78), and a held frame lets that line land.
2. The last 2.9 s are the approved act-out: beat 77, Harris rule D, music alone and lifting 8 dB (cue 4 at 206.7-207.4). At that moment the change is in the sound. It is the same kind of exempt moment as the 2.4 s slate.
3. Every visible change I can find is either invented or breaks the hand-off:
   - a crack of daylight round the shutter, dust or a label would be invented, or would pre-empt act 4's hole;
   - anything discrete would have to carry into act 4's first frame, and "act 4 opens on this exact frame".
   - A slow grade change (for example `dark` 0.7→0.8) is honest, but the check would not count it, so it fixes nothing.

What to do:
- Record the hold as an approved exemption, with `--skip 204.1:209.68` in the stillness run and a line in the act note.
- **Condition for act 4:** its first visible change must come within about 1.5 s of its start. The same room otherwise holds for well over 7 s across the join. This is open until act 4 is built.
- **If Sam wants the 4 s rule kept literally:** the one minimal honest change is shorter music-alone: `ACT_END` 208.1, and cue 4 `until` 208.1 with its lift kept at 206.7-207.4. That gives a hold of about 4.0 s, no picture change and the same closing frame. It shortens the approved 3 s of music to about 1.4 s.

**T2. Still open from Gate 2, unchanged in v3:**
- The count quote has no source from 100.17 to 102.10.
- "HIS IDEA:" uses a colon, where the act's style is "·".
- The p.43 cards show "2. Pink is known to be a mixture of red and blue …".
- PHOTOS TODAY is at size 16.
- The world labels sit below the 84 px safe line.
- 'one man' reads for about 1.3 s (Sam chose 203.60).

**T3. The quotes are quieter than before, but not as quiet as row 61 says.**
- Under the quotes the music measures 29-37 dB under the voice (-48 to -52 LUFS). That reads as near-silence.
- Row 61 says "about 45 dB under". To meet that literally, set the quiet spans at 85.45, 129.4, 165.4 and 192.6 to -60.

**T4. The slide into p.43 (161.80) moves about a quarter of the frame in its first frame.**
- The mean change from 4854 to 4855 is 45 levels, and the blur makes it read almost as a cut.
- This is TRN-007's ease, the same as everywhere else. Change it only if Sam finds it abrupt.

## Open

- Act 4's first frame next to 209.63, for the hold condition in T1 and the head in S7.
