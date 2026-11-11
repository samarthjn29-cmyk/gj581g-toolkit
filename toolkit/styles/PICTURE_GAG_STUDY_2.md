# Picture gag study 2: five more channels (11 Nov 2026)

Sam asked for a picture-gag study of channels not covered before. Our earlier studies are `EDIT_DENSITY_STUDY.md` (Climate Town, Slayy Point, OverSimplified, Johnny Harris), `RIDICULOUS_TOOLKIT.md`, `PICTURE_GAGS_CATALOGUE.md`, Blank Rascal, exurb1a and Emergence. **Method:** the same as the edit study. In the browser pane, one minute of each video was sampled at one frame a second into a 60-frame contact sheet. Each gag was named by its shape (what it does), never by its content.

| Channel and video (minute sampled) | Changes a minute | Feel | The gag shapes seen |
|---|---|---|---|
| **Half as Interesting**, "The Logistics of the NYC Marathon" (1:00-2:00) | about 25 | Fast, literal stock footage, dry | Stock footage taken literally for every phrase ("planners" = hard hats staring at a laptop). The channel's logo pasted as the head of a stock runner (a mascot head swap). Company names slapped onto footage as tilted stickers. A calendar overlay on footage with its labels ("Preparations start", "Race day"). The same eight-shot run repeated exactly, as a callback for "and then again next year". Whip pans with motion blur. |
| **Casually Explained**, "Evolution VI" (1:00-2:00) | about 8 | Slow, deadpan, white page | An "evolution chain": four cut-out pictures joined by red arrows, each one worse, the last a twist. A stick figure standing beside cut-out real objects. A red X drawn over a photo. A "Phase 1 / ? / Phase 3" board. A handwritten note pinned up as the punchline. Shots held 5-15 s: the joke is in the arrangement, not the cut. |
| **Sam O'Nella Academy**, "Pliny Explains it All 2" (1:30-2:30) | about 15 | Stick figures, dry narration | A rating badge in the corner that changes with every claim, from "brilliant" to "blunder", so the picture fact-checks the narrator. Label arrows stacking on one sad figure ("Naked", "Cold", "Screaming"). A magnifying glass on the globe showing tiny people, then "MAN." A deadpan chapter card in serif on black. Items added to a row one by one. |
| **Think School**, bond investing masterclass (2:00-3:00) | about 15 | Indian business explainer | Screen recordings with the cursor and a highlighted price. Keyword caption pills. A document quote with a highlighter sweep across the line. Name supers. (The sample fell on a sponsor read and an interview, so it shows little gag work.) |
| **Economics Explained**, "The 2026 Nobel Prize in Economics Explained" (2:30-3:30) | about 18 | Stock montage, cross-dissolves | A definition card on torn notepaper taped to the screen ("The Marginal Propensity to Consume"). Literal stock money shots. (The sample also fell partly on a sponsor read.) |

## What is new here (not in our library yet)
1. **The rating badge (Sam O'Nella).** One small badge in a corner rates each claim as it is spoken: "Solid", "Sort of", "Very sus", "Nope". It's a running gag that is also honest, and it suits a fact-checked channel perfectly: our badge can show the evidence strength of each claim. Build: `meter`, a corner badge whose state changes on cue words.
2. **The evolution chain (Casually Explained).** Three or four cut-out pictures in a row with red arrows, each step a degree worse, the last one the twist. Ours: "radio telescope → a borrowed amplifier → a bake sale → a billionaire". Build: `chain`.
3. **Stacked label arrows (Sam O'Nella).** Short labels arrive one by one, each with an arrow to the same subject, so the joke builds ("cold", "on hold", "in a metal box"). Build: `labels`.
4. **The exact repeat as a callback (Half as Interesting).** Replay the same short run of shots word for word when the same thing happens again. No new effect is needed: reuse the shot list. Our "And the universe said… nothing" lines are ready-made places for it.
5. **The mascot head swap (Half as Interesting).** Our own mascot's head (the popcorn alien, cut out) on a stock body doing the thing the line describes. It's safe because the head is ours and the body is anonymous stock; never on a real, identifiable person. Build later: `sticker` placed over a stock subject's head.
6. **The torn-paper definition card (Economics Explained).** A term and its plain meaning on a scrap of notepaper taped over the picture. It's a friendlier version of our Lexicon card. Build: a `paper` look for `title` cards (already partly in the kit as `title` with `paper: true`).
7. **Holding still is allowed when the arrangement is the joke (Casually Explained).** Our 2-second floor stays, but a composed gag frame can hold 5 s or more without a cut, as long as something lands in it every couple of seconds (a label, an arrow, an X).

## Rules
- Shapes only: no footage, characters, logos or badge designs copied from these channels; our badge, chain and labels are drawn in our own style.
- No real company logos as stickers. Half as Interesting uses them; we use generic labels.
- The rating badge must tell the truth: its rating per claim comes from the fact-check verdict, never from the joke.

## Sources (the videos sampled)
- Half as Interesting, "The Logistics of the NYC Marathon": https://www.youtube.com/watch?v=FPg1UL0RNnA
- Casually Explained, "Casually Explained: Evolution VI - Every Class and Build Explained": https://www.youtube.com/watch?v=7-1Uowqu4Bk
- Sam O'Nella Academy, "Pliny Explains it All 2: MAN (The Historia Naturalis Abridged)": https://www.youtube.com/watch?v=_kgTL-Z9sBU
- Think School, "50 Minute BOND Investing MASTERCLASS": https://www.youtube.com/watch?v=hjxaqZmvVPA
- Economics Explained, "The 2026 Nobel Prize in Economics Explained": https://www.youtube.com/watch?v=Qk6AuhfjvTk
