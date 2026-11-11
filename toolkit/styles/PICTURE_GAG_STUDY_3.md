# Picture gag study 3: four more videos (11 Nov 2026)

Sam asked for a picture-gag study of 4 new videos. The method is the same as studies 1 and 2: in the browser pane, one minute of each video was sampled at one frame a second into a 60-frame contact sheet, and each gag is named by its shape (what it does), never by its content. Earlier studies: `EDIT_DENSITY_STUDY.md`, `PICTURE_GAG_STUDY_2.md`, `PICTURE_GAGS_CATALOGUE.md`, `RIDICULOUS_TOOLKIT.md`, Blank Rascal, exurb1a, Emergence.

| Channel and video (minute sampled) | Changes a minute | Feel | The gag shapes seen |
|---|---|---|---|
| **Atrioc**, stream highlight compilation (4:00-5:00) | about 10 | Live stream, chat-driven | Several small reaction pictures-in-picture (PIPs) stacked over the main screen. A live chat column down one side. A weak sample: the jokes are in the talk, not the edit. |
| **Tanmay Bhat**, a talk-show episode review (3:00-4:00) | about 22 | Roast, reaction-heavy | Reaction split-screens: 2-up, 3-up and a 6-face grid. The person being roasted turns black and white while the others stay in colour. Small photo inset with a name tag. A money-rain overlay on a boast. A mosaic of everyone reacting to one line. |
| **LegalEagle**, a legal breakdown (4:00-5:00) | about 15 | Talking head, measured | A punch-in on the speaker every 3-5 s (wide, then close, then wide), so a single shot never feels static. A framed thumbnail of the video being discussed, inset in a corner as the reference. |
| **Captain Disillusion**, "CD / Blur" (1:30-2:30) | about 30 | 3D explainer, playful | The idea made into a physical object (a blur kernel as a 3D block you can turn). A portrait of the person the idea is named after slides in beside the result, and the name lands on it in bold yellow type ("GAUSSIAN"). The host shrinks to the bottom of the frame and the picture floats above his hands, as if he is holding it. A confetti burst on green when the effect works. A grid of named variants in a terminal style ("SHARPEN", "SOBEL", "RADIAL BLUR"), each applied to the same test picture. A grotesque close-up of the namesake's face as a one-second gag. |

## What is new here (not in our library yet)
1. **The grey-out (Tanmay Bhat).** In a split or grid, the subject of the joke goes black and white while everyone else stays in colour. It's one line of CSS, and it points the joke without a word. Build: a `grey` flag on `split` panels and on stills (grayscale filter, 0.3 s fade). Sound: `r:record_scratch` or a short `bleep`. Fits the Aliens opening at "the universe said… nothing" (the silent sky goes grey) and on the person who gets the bake-sale funding.
2. **The reaction grid (Tanmay Bhat).** One line, then 3 or 6 faces reacting to it at once. We can't use real people's faces as reactions, so ours uses our own popcorn alien in 3-6 expressions, or plain stock reactions with no real people. Build: `grid`, an n-up of images that pop in 0.1 s apart. Sound: `pop` ×n, one per tile.
3. **The punch-in (LegalEagle).** A 115-125% jump-zoom on the same picture, landing on the punchline word, then back. It's a free way to keep one picture alive past 4 s, and it suits our 2 s floor: the picture stays, but the frame changes. Build: `punch` on any shot (an instant scale change on a cue word, no easing). Sound: none, or a soft `thump`.
4. **The namesake card (Captain Disillusion).** When an idea is named after a person, their real portrait (public-domain, Commons) slides in beside the idea, and the name stamps onto it in bold type. It teaches the term and gives a face to it. Build: `namesake`, a portrait plus a stamped name, reusing `split` and `stamp`. Sound: `r:impact`. Fits Drake (the Drake equation) and Fermi (the Fermi paradox) in the Aliens script.
5. **The hold-it-up (Captain Disillusion).** The narrator's own picture or mascot sits at the bottom of the frame and the object floats just above, as if being shown off. Ours: the popcorn alien at the bottom edge "holding up" the radio-telescope still. Build: `sticker` at the bottom edge plus a floating card with a gentle bob. Sound: `sparkle`.
6. **The variants board (Captain Disillusion).** The same test picture shown several times, each with a different named treatment, ticked through one by one. Ours: "the same empty sky, according to optimists / pessimists / accountants / your mum". Build: `variants`, a picture grid with a label per tile, each lighting up on its cue word. Sound: `click` per tile.

## Rules
- Shapes only: none of these channels' footage, characters, overlays, fonts or layouts.
- **No real people as reaction faces.** Tanmay Bhat uses real guests; we use our own mascot or anonymous stock. A grey-out goes only on our own characters, on stock, or on objects, never on a real, named person to mock them.
- A namesake portrait must be a real photo or painting with an open licence, never an AI likeness.

## Sources (the videos sampled)
- Atrioc: https://www.youtube.com/watch?v=GZcYn3fTYUM
- Tanmay Bhat: https://www.youtube.com/watch?v=SHKI3A-aDHs
- LegalEagle: https://www.youtube.com/watch?v=6LbmvFgQ-8g
- Captain Disillusion, "CD / Blur": https://www.youtube.com/watch?v=xDLxFGXuPEc
