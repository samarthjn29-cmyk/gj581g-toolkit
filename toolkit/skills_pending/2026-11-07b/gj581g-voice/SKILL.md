---
name: gj581g-voice
description: Use whenever writing for, voicing, pacing or mixing the sound of a GJ 581g video: Sam's cloned voice (profile, scene mode, word checks, must/say, repeat guard), pacing with breathe.py, the MP3 review, the Heckler, humour delivery, the music bed and sound effects.
---

# GJ 581g: voice, pacing, music bed and sound

This skill replaces `gj581g-voice-music-montage` and the narration part of `decked-out-deck-builder` (7 Nov 2026 audit). The format is `gj581g-vector-world`; the script rules are in `decked-out-research-story`; the board and workflow are in `gj581g-producer`.

## 1. Gates and order
- **Fact-check gate:** never voice in the clone until `project.json` names the fact-check CSV (`"factcheck"`) and every verdict is OK. A pilot can use `"factcheck_waiver": "<why>"` instead. Keep the CSV valid: quote any text containing a comma.
- **Voice lint:** run `story/voice_lint.py` before every clone voicing. `build.py` stops on a FAIL hazard unless the line id is in `voice_lint_allow`, which is only for lines Sam already approved.
- **Order:**
  1. Script locked.
  2. Clone MP3: `build/build.py project.json --to listen`.
  3. `tts/breathe.py` (section 5).
  4. Paced MP3 + music-bed sampler + listening checklist go to Sam.
  5. Sam approves and picks a bed.
  6. Render.
  **Never render before the MP3 is approved.**
- **Approved means frozen:** an approved clip or video is not touched again. New ideas go to the next video.

## 2. Sam's voice profile
- **Where it lives:** `G:\My Drive\Decked out Data\voice_sample\sam_voice_v1\`:
  - `ref.wav` (11.9 s, take 2 of the 2 Nov recording);
  - `conds.pt` (`Conditionals.load`);
  - `profile.json` (settings, `post_fx`, pronunciations, `hazards`);
  - `speaker_embedding.npy`.
  It scored 0.90 against his real reading.
- **It is Sam's biometric data:** Drive only. Never GitHub, never shared. Copy it into the project from G: when needed.
- **Re-record only if** Sam asks, changes mic or room, or the clone drifts. Then:
  1. He records 2-3 takes of a ~40 s passage.
  2. Cut a 10-12 s reference from each take.
  3. Clone a *different* part of the passage with each reference (`tts/ref_test.py`, one process each).
  4. Score each against his real reading.
  5. Send a sampler with his real reading first.
- **Engine:** Chatterbox (MIT) on CPU in the `cbx` venv. Always use `/home/claude/cbx/bin/python3`, or pass `CBX_PY=<venv python>` to `build.py`. Setup (~10 min, run in the background):
  `python3 -m venv /home/claude/cbx && /home/claude/cbx/bin/pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu && /home/claude/cbx/bin/pip install chatterbox-tts faster-whisper librosa soundfile num2words`
- **Settings** come from `profile.json` (exaggeration 0.5, cfg 0.5, temperature 0.8):
  - keep the breaths;
  - no debreath;
  - **never `atempo` on the narrator** (never sped up or slowed);
  - squeeze long pauses inside a line, keep sentence pauses.

## 3. Voicing and automatic checks
- **Scene mode:** set `"voice_mode": "scene"` explicitly; the code's default is `"line"`. `build.py` calls `tts/clone_scenes.py` once per scene, one process each.
  - Long scenes go in parts (`MAXLINES=2` avoids out-of-memory kills on this 8 GB box), saved as `<scene>.partN.wav` so a retry resumes.
  - `build.py` retries a scene up to 6 times.
  - `--lines <scene ids>` re-voices only those scenes; `SEED_OFFSET=<n>` gives fresh seeds.
  - Line mode (`clone_lines.py`) is only for fixing one line.
- **Checks on every take:** up to 8 tries per part.
  - **Word check:** faster-whisper `small.en` (int8). Numbers are compared as words; harmless spellings are allowed. Word-match ratio must be at least 0.93.
  - **Speaker check:** similarity at least 0.80.
  - **Pace:** no line of 5+ words faster than 3.9 words a second (`MAXWPS`). Give up on pace-only failures after `PACE_TRIES=3`.
  - **`must`:** every `must` phrase must be heard exactly. Use it for meaning-carrying words, the key number, names, and any phrase the checker mishears.
  - **`tight: true`:** no pause inside the line.
  - **Repeat guard:** `repeats()` in `clone_scenes.py` rejects looped takes; `qa_final.py` lists REPEATED stretches as hard faults.
- **Mishearings:** always re-roll a meaning-changing mishearing, then respell (`say`) or reword. If a word keeps failing, reword at once, and update the script, the fact-check CSV and the cues together.
- **Second opinion:** if a kept take shows an odd word, re-transcribe it with `medium.en`. If both models hear it, re-voice.

## 4. Writing for the clone
- **`say` vs `text`:** `say` is what the clone reads; captions show `text`.
- **Numbers:** write numbers and years as words in `say`.
- **Punctuation:** end deadpan lines with full stops. No exclamation marks for the narrator. No `...` for pacing.
- **Grammar traps:** no possessive followed by a verb. Keep very short lines inside a scene passage, not alone.
- **Stress:** the last word of a sentence takes the stress, so end on a word that can carry it.
- **Known hazards** (add every new one to the profile's `hazards` on G: the same day, never GitHub):

  | Written | Heard as | Fix |
  |---|---|---|
  | "raise" ending a phrase | race | write "pay raise" |
  | payslip | base slip | `must` |
  | isn't | is in | `must` ("question isn't") |
  | sits chained | six-chained | `must` |
  | reflections in water | reflections and water | `must` |
  | ruler | router | `must` |
  | find | fine | `must` |
  | had put | have put | listen |

- **Names:** 2-3 syllables with clear consonants, not near a common word. Test each in the clone at the start, middle and end of a phrase before the script locks.

## 5. Join, finish, pace, loudness
- **Join:** `assemble_scenes.py` trims the clone's pre-word murmur and leaves 0.45-0.5 s between scenes. For clipped first consonants, `patch_line.py` uses `PATCH_LEAD="Right."`.
- **Voice finish B** (narrator only), from `post_fx` via `VOICE_FX`:
  - 0.7 semitone down, formants kept;
  - +2 dB low shelf at 160 Hz;
  - -1 dB at 3.5 kHz;
  - tempo unchanged.
  The checks run on the raw takes.
- **Pacing:** the clone reads at 190-200 words a minute; the target is **150-165**. Run
  `tts/breathe.py vo.wav timing.json vo_b.wav timing_b.json --sentence 0.45 --scene 0.9`
  (always pass the flags; the code defaults are 0.35/0.8). It adds silence at sentence ends and chapter changes and shifts every word time; nothing is stretched. The pilot went from 192 to 159. Sam reviews the paced file and the video renders on `timing_b.json`.
  - Breathe does not yet know about the Heckler or `tight` lines. Check her 0.2 s handovers by ear; if needed, voice her lines into the same scene so no pause lands before them.
- **After breathe:** re-mix and re-run `tts/qa_final.py timing_b.json <mix.wav> <out_dir>` by hand. The build's `listen`/`qa` stages ran on the unpaced mix.
- **Loudness:**
  - voice: `apad=pad_dur=3,loudnorm=I=-16:TP=-1.5:LRA=11`, then trim;
  - limiter: `alimiter=limit=0.8:level=false`;
  - QA hard fault: true peak above -1 dBTP.

## 6. MP3 review with Sam
- **Machine check:** `qa_final.py` re-transcribes the whole file and checks words, clipped first and missing last words, unsure numbers, names and `must` phrases, pace, dead air (over 1.6 s), run-together lines, level per speaker, LUFS and true peak, and pitch. Fix hard faults before Sam listens.
- **Checklist for Sam:** everything else goes into `<name>_listening_checklist.md`, sorted by time, each item with its time and the reason. Add your own doubts from the word check (e.g. "the checker heard 'have put': is it 'had'?") and the bed pick as the last item.
- **Sam's reply:** he answers by item number. Re-voice only the "redo" lines (`patch_line.py`, or `build.py --lines`), then make a new MP3 and checklist. Never touch lines marked fine.
- **You can't hear:** check numerically and say so. His ear is the final check: does it sound like him, is the pace steady, are there pauses inside phrases, are the numbers clear.

## 7. The Heckler (optional second voice)
- **Never clone a real person,** famous or not, even for parody.
- **Her voice:** Kokoro `bf_isabella` as the Chatterbox reference:
  - `G:\My Drive\Decked out Data\voice_sample\heckler_isabella\ref.wav`, also `toolkit/tts/heckler/ref_bf_isabella.wav`;
  - switched on with `"heckler_ref"` in `project.json`;
  - lines `who: "heckler"` with a `mood`, voiced by `tts/heckler_lines.py` as `H_<id>` units.

  | Mood | Exaggeration / cfg |
  |---|---|
  | impatient | 0.7 / 0.45 |
  | pushy | 0.85 / 0.35 |
  | deflated | 0.3 / 0.6 |
  | exasperated | 0.95 / 0.3 |
  | groan | 0.55 / 0.5 |
  | envious | 0.75 / 0.4 |
  | grudgingly warm | 0.4 / 0.55 |

- **Delivery:** `HECKLER_TEMPO` 1.2 on her lines only; about a 0.2 s gap before her interjections; 4 seeds per short line (`HECKLER_SEEDS=4`).
- **Content:** 4-8 interjections a video. She never says a number or a claim, never gets the last word on a fact, may swear mildly, and has one sincere beat at the end.
- **Never captioned or shown as text:** not in captions or translations. Make captions with `story/timing_srt.py` (it skips her); not `remotion/make_srt.py`. The narrator's next line must make sense without her.
- **On screen:** an off-screen voice, or a small silhouette (no lip sync).
- **Other character voices:** each is synthetic; Sam picks from a sampler. Second-voice settings go in `P['voices'][who] = {ref, exag, cfg, tempo}`.

## 8. Humour and talked delivery
- **Sam's own humour:** dry, deadpan, self-aware, warm. Never smug, no stereotypes, no invented personal history.
- **Moves:** literal follow-through, the act-out, the narrator as subject, the bathos list, objection and answer (the Heckler can voice the scoff), the admission. British patterns B01-B30 are in `styles/BRITISH_HUMOUR_TOOLKIT.md`; pick 6-10 per video and tag lines `pattern: "Bnn"`.
- **Placement:** about one laugh line per 45-60 s in story chapters; mark humour lines `energy: "dry"`. Never inside a number, claim, caveat, source or quote, and none after the serious turn. The beat before a punchline is a picture change, never a silent hold.
- **Swearing:** occasional, as the last word of a calm build-up, and always a `must`. Never in the title, thumbnail, description, tags or pinned comment. No slurs, never at viewers or groups.
- **Real people:** true, sourced claims (in the fact-check); verbatim quotes with dates; jokes about conduct, never identity; never private individuals; never fake their voice.
- **Talked feel:** self-answered questions and tags ("right?", "you know") where they help; never stacked, never inside a fact.

## 9. Music bed (every video)
- **The bed:** a music bed runs under the whole narration, so no pause is near-silent.
  - About 12-14 dB under the voice.
  - Ducked under speech: `[voice]asplit[v][sc]; [bed][sc]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=600[bd]; [v][bd]amix=normalize=0, alimiter=limit=0.89`.
  - Swells at chapter turns; 1-2 s fades at cue changes; one fixed gain per track across clip joins.
- **Target:** after the mix, the quietest 10% of the file sits between -30 and -38 dB (Emergence about -34 to -37; our old video 1 was -50).
- **In-house beds:** `toolkit/media/ambient_bed.py <ember|glass|pulse> <sec> <out.wav> --changes <chapter starts> [--key D]`. Written at -28 LUFS; no licence, credit "Music: original ambient bed (GJ 581g)".
- **Library tracks:** YouTube Audio Library, Pixabay, CC0 or CC BY. Credited; never commercial tracks; never AI music presented as human.
- **Sam picks from a sampler** of 2-3 beds under the real paced narration, before the first render. Record the pick on the board. After a bed change, run `build.py --from mix` (or re-mux the soundtrack).
- **Log** every track in `media/licence_log.csv`.

## 10. Sound effects
- **Limits:** at most 8 a minute and at least 1.5 s apart (`pace_lint.py` fails above that).
- **Use:** each one tied to an on-screen action (fire crackle, chain clink, wind at the cave mouth). None under a sentence the viewer must follow closely.
- **Level:** about -26 to -30 LUFS, under the voice, no stingers.
- **Sources:** synthesised in-house, or Freesound CC0, Mixkit or Pixabay; log each one.

## 11. Disclosure and engineering
- **Disclosure:** the description states the narration is computer-generated from Sam's own voice (and names any second synthetic voice). Tick YouTube's altered or synthetic content box.
- **Memory:** never voice while a render, a still render or a big rasterise runs (out of memory, exit 137). One voicing process per scene.
- **Processes:** kill by PID only, never `pkill -f` or `pgrep -f` from a shell whose own command contains the pattern (exit 144). Run `build.py` in the background with a monitor on `build/build.log` that also matches failures.
- **Length:** judge it from voiced and paced durations, never by speeding up.
