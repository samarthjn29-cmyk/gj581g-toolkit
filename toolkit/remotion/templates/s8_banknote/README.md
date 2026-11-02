# S8 Banknote template (The Dollar Yardstick, from 2 Nov 2026)

Built for the "Your Raise Is Lying to You" pilot (cold open, 58 s). Copy to `<Topic>_remotion`, `npm install`, copy `public/` fonts (kits/folk_banknote/fonts + Inter, JetBrains Mono) and `grain0.png`.

- `src/bank.jsx`: ground (security waves, drift), `NoteFrame`, `Portrait` (guilloché oval, clips a Folk bust), `Window` (footage graded to the palette with a line-screen and drift), `Stamp` (`bg` for footage), `Typed`, `T` (alignment composes with motion transforms), `Captions`, cue helpers `t0(id)` / `tw(id, word, k)`.
- `src/pilot.jsx`: the eight pilot scenes (Ann, Barbara, Duo, Poll, Shop, Illusion, UK, Title): a reference for pay slips, mini notes, hatched bars, counters.
- `tools/voice.py`: line-by-line placeholder VO (Kokoro, natural speed) -> `vo.wav` + `timing.json`. Replace with the Chatterbox clone + aligned word times for the real video.
- `tools/mix.py`: voice -16 LUFS, music ducked under it, SFX cues tied to on-screen frames.
- `sfx/make_sfx.py`: the series sound set, synthesised (typewriter, stamp, register ding, whoosh, paper, coin): no licence needed.
- `tw()` estimates word times from character position; with placeholder voices the cues drift by up to ~1 s. Use aligned times before the final.
