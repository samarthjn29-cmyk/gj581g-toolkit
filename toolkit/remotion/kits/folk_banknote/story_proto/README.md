# Character story prototype (3 Nov 2026)
23 s two-character scene (Ann and Barbara, the money illusion) built on `../rig.jsx`, the full-body Folk rig:
articulated arms/legs, walk cycle, blinks, head tilt, turn, Rhubarb lip-sync mouth shapes (A-H, X).
- `voice_dialogue.py`: Kokoro voice per character (af_heart = Barbara, bf_emma = Ann) + Rhubarb 1.13 (GitHub release, Linux zip) -> `public/dialogue.wav`, `src/data/dialogue_timing.json` with mouth cues.
- `story.jsx`: pose tracks per character, camera keys, set (street + market + price board), sum cards, captions, title.
Built inside a copy of `templates/s8_banknote` (needs src/data/timing.json stub and the fonts in public/fonts).
