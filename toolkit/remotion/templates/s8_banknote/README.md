# S8 Banknote template (The Dollar Yardstick, from 2 Nov 2026)

Built for the "Your Raise Is Lying to You" pilot (cold open, 58 s). Copy to `<Topic>_remotion`, `npm install`, copy `public/` fonts (kits/folk_banknote/fonts + Inter, JetBrains Mono) and `grain0.png`.

- `src/bank.jsx`: ground (security waves, drift), `NoteFrame`, `Portrait` (guilloché oval, clips a Folk bust), `Window` (footage graded to the palette with a line-screen and drift), `Stamp` (`bg` for footage), `Typed`, `T` (alignment composes with motion transforms), `Captions`, cue helpers `t0(id)` / `tw(id, word, k)`.
- `src/pilot.jsx`: the eight pilot scenes (Ann, Barbara, Duo, Poll, Shop, Illusion, UK, Title): a reference for pay slips, mini notes, hatched bars, counters.
- `tools/voice.py`: line-by-line placeholder VO (Kokoro, natural speed) -> `vo.wav` + `timing.json`. Replace with the Chatterbox clone + aligned word times for the real video.
- `tools/mix.py`: voice -16 LUFS, music ducked under it, SFX cues tied to on-screen frames.
- `sfx/make_sfx.py`: the series sound set, synthesised (typewriter, stamp, register ding, whoosh, paper, coin): no licence needed.
- `tw()` estimates word times from character position; with placeholder voices the cues drift by up to ~1 s. Use aligned times before the final.

## Voicing in Sam's clone (2 Nov 2026, Raise pilot)
- `toolkit/tts/clone_lines.py script.json ref.wav outdir [ids]`: one line per take, Whisper word check against the script (numbers normalised), up to 6 re-rolls, speaker guard; resumable via `log.json`.
- **Run one process per line or per few lines** (`for id in ...; do clone_lines.py ... $id; done`): Chatterbox + Whisper in one long process grows until it is killed (exit 137).
- `toolkit/tts/assemble_lines.py`: trims each take (including the clone's murmur before the first word), joins with 0.22 s inside a scene and 0.5 s between scenes, writes `timing.json` with per-word times; `tw()` and `mix.py` cue on those.
- Reference: `G:\My Drive\Decked out Data\voice_sample\ref_main.wav` (Sam's Saturday recording, token explainer, 19 s).
- Clone traps seen: "Barbara's buys" (reworded), "pay slip" -> "base lip" (re-roll), doubled lines (re-roll), "raise" transcribed as "rays" (same sound, accept).
