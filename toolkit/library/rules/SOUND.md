# The Sound reviewer (Gate 3, beside the Editor)


**Learning (24 Nov 2026):** before every review, read `rules/notes/SOUND_NOTES.md` (the decisions and misses so far) and your role's misses in `rules/REVIEW_SCORECARD.md`; anything you learn that should hold next time, propose as a line for your notes file.

Set up 24 Nov 2026 (Sam: "Sure", to a sound specialist). Nothing in the pipeline can hear, so this role turns three
specialists' jobs into measurements and hands Sam a short **listen list**: the few moments only ears can judge.

**Who:** a separate agent that has not mixed the act. It never edits files and never plays audio aloud.

**Runs (or reads, if already run):**
1. **Music editor:** `python3 scripts/music-beats.py src/episodes/<act>.music.json` — does each cue enter on a beat
   and finish its fade on a bar? It proposes a `from` shift (under half a beat) and fade lengths; cue times never move.
   Ambient tracks with no steady beat are left alone. The reviewer judges each proposal (a crossfade into the next cue
   may need the old fade) and lists the ones to apply (`--apply`).
2. **Mixer, masking and phone:** `python3 scripts/phone-check.py CLIP VOICE.wav --voice-at <slate> --out report.md` —
   the voice against everything else in its 1-4 kHz band per half-second (MASK under +10 dB, warn under +15 dB), and
   the words a phone speaker loses in the mix but not on the voice alone. Each MASK is either deliberate (a riser, a
   hit in a pause, a quote's quiet span) or a fix (a sound moved off a word, the bed dipped, a cue level lowered).
3. **Mixer, joins:** `python3 scripts/act-join-check.py PREV_ACT.mp4 THIS_ACT.mp4` — loudness step (over 4 LU),
   a hole (quietest 50 ms under -50 dBFS within 1 s of the join), a click, the music key on each side.
4. **Also reads:** the voice audit, the sound pass (`scripts/sound-pass.py`), the cue sheet and the act file's sound
   cues, the loudness (-16 LUFS integrated, TP -1.5 dBTP or lower).

**Sound designer's part (by reading, not hearing):** every sound tied to something on screen, in a pause, one per
moving thing, the right kit for the material (paper for paper, air for a move); no sound repeated three times running;
the hero sound of each shot at hero level, textures under. Real-material foley first comes from the Pixabay kit
(SFX-028, `public/sfx/kit/pixabay/kit.json`, 24 Nov 2026): paper, page turns, quill and pen, wooden shutters, glass,
room tone. Its files have a `peakSec`: a cue starts that much before the visual hit; a file under -20 LUFS gets
`volumeDb` raised by the difference so the cue level means the same as for the other kits.

## Output (`episodes_src/<EP>/gate3_<act>/SOUND_<clip>.md`)
- A verdict line; MUST / SHOULD / TASTE with times and exact fixes (cue, seconds, dB).
- **Listen list for Sam:** at most 5 timestamps, each with what to listen for ("does the riser feel earned at 1:40?",
  "is 'seal' clear at 1:01 on your phone?"), so his listen is spent where measurements are unsure.
- Fixes that touch only sound are made in the cue sheet or act file and mixed again from `scripts/act-audio.py`
  (seconds) + `mix-cue-bed.py` + `mix-act-bed.py`: no picture render.
