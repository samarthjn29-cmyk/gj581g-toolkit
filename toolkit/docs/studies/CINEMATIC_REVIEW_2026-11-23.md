# Cinematic effects in the six reference videos, and what would bring us closer (23 Nov 2026)

Sam asked: "Can you again review those videos for cinematic effects? What things will take us closer to that style of editing?" The videos are the same six as in `BACKGROUNDS_STUDY_2026-11-23.md`: Faceless Universe, byl parts 1 and 2, Johnny Harris "Coups, Mapped" and "Sudan, Mapped", and Mapal. They were studied muted, through their transcripts, frame-by-frame canvas samples around transitions and frame-difference measurements. No clips were kept.

## What makes them feel cinematic (measured or seen)
1. **The camera never stops, and it travels through one world.**
   - The Sudan map section changes by about 2 units every 0.25 s for 15 s with no cut. That is one continuous push and pan across the map, from place to place.
   - The scene lives on one large map, and the camera goes to the places in it. Cards do not replace each other.
2. **Depth.**
   - Tilted 3D maps with a route line drawing on and an X that marks the spot, then a push into the X (byl clip 7, Mapal).
   - A satellite view of a city with clouds drifting across it and a photo card lying on the terrain (Sudan, 500 s).
   - A blurred copy of a photo behind the sharp one, with the blur easing to 0% during a camera push (byl clip 14).
3. **Light.**
   - A physical map shot dark under a spotlight with a heavy vignette (Sudan, 200 s).
   - A warm grade on everything (byl's adjustment layer). A grunge texture in multiply at full exposure, slowly zooming.
4. **Lens.**
   - A focus pull at every match cut: blur 0 → 3 → 1 → 0 over a few frames (Mapal).
   - Motion blur on fast moves (byl compounds the memo slide and adds motion blur).
   - A slight RGB split at the frame edges (Mapal, "chroma warp").
5. **Film.**
   - Grain in overlay blend, fractal film dust in screen blend, and rounded footage frames with a film border (Coups, 700 s).
   - Animation posterised to 12 fps, so moves step like hand animation.
   - A tiny camera shake (a wiggle posterised to 6 fps) on an adjustment layer over the whole frame (Mapal).
6. **Edit rhythm.**
   - Match cuts on motion: the outgoing scene scales and moves toward a corner, and the incoming scene continues the same move (Mapal).
   - The Sudan cold open intercuts a held map with single news-footage flashes about 0.3 s long: 22 changes in 40 s.
   - Its middle runs a montage of real B-roll at about 2 s a cut (500-517 s).
   - Fast montage is set against long held map moves.
7. **Real footage carries the world.** Johnny Harris cuts real B-roll and news footage between the graphics. In our act 2, footage is 7% of the runtime.
8. **Sound follows place and cut.** The music changes character with each location (Coups), and every match cut has its swish.

## What we already have
- The calm drift on every shot (1.5-3% a shot): the same idea, but on separate cards, not one travelling world.
- Grain (LOK-010), corner light leaks, LOK-015 AnalogueFinish, LOK-016 CandleFlicker and LOK-022 GateWeave (built for act 1).
- The new grounds (paper, desk, lit map, blur plate, collage, inset) and VIS-051's page camera with two framings.
- Transitions: push, slide, paper band, colour block, flash, all with sounds.

## What would take us closer, in order of payoff
| # | Piece | What it is | Where it would go first | Effort |
|---|---|---|---|---|
| 1 | **LOK-030 CinematicFinish** | One episode-wide finish layer in OpticalStack: warm grade, grain, film dust, a 1 px edge RGB split, a 0.4 px camera shake on sixes and gate weave. All within the calm limits, set per theme. | Acts 1-2 straight away, then every act | Small |
| 2 | **TRN-015 FocusPull** and **TRN-010 CutOnAction** (Planned) | A match cut on motion: the outgoing shot scales and drifts toward the next shot's key point with a blur pull, and the incoming shot continues the same move from blur to sharp. | Replaces about half of our slides and pushes | Small to medium |
| 3 | **Motion blur on fast moves** | `@remotion/motion-blur` (CameraMotionBlur) on transitions and object moves only: 0.6 s, 6 samples, so render time stays reasonable. | Slides, pushes, the stockings tissue, the BuildUpMap pieces | Small, but slower renders |
| 4 | **MAP-012 TravellingMap** | One large registered map as the act's world. The camera flies between places (Eaglesfield → Kendal → Manchester) instead of cutting between cards, with tokens and route lines on the map and optional 3D tilt (MAP-009 TiltedRouteDraw, Planned). | Act 3 (Manchester, 1793-94), and act 2's map shots | Medium |
| 5 | **VIS-052 FootageMontage** | 3-6 real clips of 1.5-2.5 s each, graded to the act, in a rounded film frame or full bleed, cut on the beat. Clips come from free-licence stock (Mixkit, Pexels) and public-domain archives (NASA, Prelinger); every clip gets its own SRC row. | Today's Lake District, Kendal and Manchester; candles, prisms, eyes, light. Within the footage limit (VIS-016 at 15%) | Medium, mostly sourcing |
| 6 | **MAP-013 EarthFlyIn** | A public-domain satellite image (NASA or Sentinel) tilted in 3D, with two parallax cloud layers drifting over it and a photo card set down on the place. | An act opening ("north-west England") | Medium |
| 7 | **TRN-016 FlashMontage** | For cold opens: a held hero image intercut with 0.3 s flashes of real sources and footage, then the hold returns. | WCL-E02's cold open | Small |
| 8 | **12 fps stepping (option)** | Posterise only the graphic animation (tokens, lines, tags) to 12 fps for a hand-made feel. The camera and footage stay at 30. | A test on one act; it may fight the calm look | Small |

## Notes
- Johnny Harris's flags and the CIA seal are not for us: no logos or brands. Our tokens are our own icons, and real people appear only in real photos.
- Fast montage is the opposite of our calm pacing, so use it only for cold opens and act turns. The rest stays held and travelling.
- Each new piece gets a register row with a best use and limit, is checked by the stillness and ground checks, and goes through the reviewer before Sam sees it.
