# Motion ideas study, 22 Nov 2026 (three sources, analysis only)

Sam asked for three analyses on 22 Nov 2026:
- "Analyse the attached video and audio... classify the data in master register and save the appropriate assets in respective folders": *Why Graphic Design Still Matters* (Anton, Tokyo; 8:51), attached as MP4 + MP3.
- "Analyze this short and apply these rules to the videos": *5 tricks from Vox* (Denys Zhylin Tutorials, YouTube Short, 1:02).
- "Analyze this video for ideas and log them accordingly": *The Best Motion Design & Animation of 2026 (So Far...)* (Ben Marriott, 18:30).

Standing rule: studies of other channels are analysis only. Their footage, audio, frames and transcripts are not kept or placed in the library folders (copyright, and the 7 Nov rule). What goes in the register is our own build of each idea, logged as Planned with a best use and a limit, and a source line "Own (studied ...; analysis only)".

## 1. *Why Graphic Design Still Matters* (Anton)

**Measured**
- 8:51; voice about 114 wpm, slow and plain; 95 pauses over 0.6 s (median 1.0 s), and the longest silences are picture-only stretches of up to 10 s.
- A music bed runs under everything, about 10 dB below the voice in the pauses; the mix sits at -16.5 LUFS, LRA 5.6.
- Structure: a named host and city in the first 5 s, the viewer's question by 0:20, "let's go", titled chapters, then five numbered takeaways and a warm sign-off.

**Visual system**
- One dark ground (near-black) and one accent (signal red) for the whole video.
- Letters and numbers built from small pictogram tiles that assemble on screen (the big "A", the 1-5 numerals).
- Every key word set as a condensed bold caption in a solid accent slab, with a tiny mono line under it.
- A small mono running head top-left names the chapter all the way through it.
- Scale shown as a field: the screen fills with thousands of tiny tiles ("billions"), then collapses to one ("yours").
- A real picture next to its shape made of tiles (a woodblock print beside its mountain line).
- Works laid on a tilted wall that the camera glides across.
- Painterly smeared photo footage as the opening and as breaks.

**For us**
- The numbered keeper ending suits our "keeper" rule.
- The running head would help long acts.
- The tile field is a strong way to show a big number calmly.
- 114 wpm with long picture-only pauses is slower than our 140-150 ceiling. Our pace stays, but a held picture-only pause of 2-4 s at the act's peak is worth trying.

## 2. *5 tricks from Vox* (short) — rules applied

The five rules it teaches, and what we did with each:

1. **Visualise everything: numbers, places and events are seen, not only heard.**
   - Act 1: every name, place, date and number in the narration now has its tag, label or picture.
   - Two lines that had none got labels: WHO'S RIGHT? and A SILLY QUESTION?
2. **Use motion design to explain: maps, newspapers, diagrams, cutouts.** Already our system (scans, swatches, the cut eye, the grid).
3. **Constant motion: never still for more than a few seconds.** Held to the calm version: a slow drift alone doesn't count.
   - New Gate 3 check `scripts/stillness-check.py`: it fails any stretch longer than 4 s with no visible change in any part of the frame.
   - On act 1 v1 it found exactly the empty eye beats Sam flagged (72-81 s).
4. **Seamless transitions: zooms, slides, match cuts.** Scene changes now use a designed transition, and hard cuts stay inside a scene.
   - New TRN-007 SlideAcross (page pushed across a desk), used into the p.29 page and from the p.30 page to the swatches.
   - TRN-006 push-through from the friends' pink swatch into the geranium.
   - The gate now fails two push-throughs in a row.
5. **The real trick is storytelling, editing and graphics together.** Already the gate system (beat sheet first, then pictures, then the cut).

## 3. *The Best Motion Design & Animation of 2026* (Ben Marriott) — ideas logged

1. **Analogue finishes:** film grain, chromatic aberration and light leaks "add life and warmth without completely taking over" (Tezo Don Lee for RIMOWA). We have grain and leaks; a faint chromatic-aberration edge is new → LOK-015.
2. **Hide and simplify:** choose what shapes and motion to leave out so the eye goes to what matters, with line boil, brush texture and a lower frame rate balanced (Giant Ant for OpenTable) → MOT-009 LineBoil for our drawn diagrams.
3. **Texture as a palette from the start, not a filter on top** (dithering and screen tone in *Monsters We Make*). For us, a period engraving-hatch texture for the 1790s-1840s drawings → TEX-005.
4. **Theatrical scene changes:** miniature sets rotating and shifting (Telstra stop motion) → idea for act changes, a paper-theatre turn (later).
5. **Light really coming from the source:** steel wool burnt for every frame lights each shot (NOMINT). For us, the candle scenes' grade flickers with the flame → LOK-016 CandleFlicker.
6. **Torn frame edges hide part of the picture to make it mysterious** (JOYCGI for Nike). Matches existing LOK-006 TornPaperTapeOverlays.
7. **Tension between stillness and action:** montages of stills show time passing, set against short bursts of motion (Axel Digoix for Tinariwen) → VIS-027 StillsMontage, for "a hundred and fifty-one years".
8. **Confident, unintuitive colour:** the desert drenched in green, purple and pink, with no orange-brown. Fits a colour series: a scene shown in Dalton's palette.
9. **Limited moments of animation, so the flashier scenes get space** (Potto Collective). Same as our calm rule: at most one flashy moment per act.
10. **Layers of reality left visibly different, not forced together** (*Abstwin*). Supports our photo, scan and line-drawing mix.
11. **Ending:** make something small, for yourself. Same as our keeper ending.

## Register rows added (all Planned, own builds; analysis only)

| ID | Name | From |
|---|---|---|
| VIS-023 | GlyphMosaic | Anton |
| VIS-024 | ScaleField | Anton |
| VIS-025 | PictureToShape | Anton |
| VIS-026 | SourceWall | Anton |
| VIS-027 | StillsMontage | Ben Marriott (Tinariwen) |
| TXT-012 | KeywordSlab | Anton |
| TXT-013 | RunningHead | Anton |
| PKG-007 | NumberedKeepers | Anton |
| LOK-015 | AnalogueFinish | Ben Marriott (Tezo Don Lee) |
| LOK-016 | CandleFlicker | Ben Marriott (NOMINT) |
| MOT-009 | LineBoil | Ben Marriott (Giant Ant) |
| TEX-005 | EngravingHatch | Ben Marriott (*Monsters We Make*) |
| TRN-007 | SlideAcross (built, Active) | Vox short |

New checks:
- `scripts/stillness-check.py` (Gate 3);
- in gate2-qa: page reading time, and no two push-throughs in a row.
