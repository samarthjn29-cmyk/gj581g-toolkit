# Gag schools: every gag sorted by where it comes from (11 Nov 2026)

Sam asked: "If I ask you to use South Park gags then you should only utilize South Park gags. If I ask you to use some other type of gags then you should utilize those gags."

**How it works:**
- **One registry:** `toolkit/stills/gag_schools.json`. Every gag in the kit belongs to one or more *schools*, a style family learnt from one of our studies. This file is generated from it by `stills/gag_schools_doc.py`.
- **Asking for a style:** a request like "use South Park gags" puts `"gags": ["southpark"]` on the chapter's plan; several schools can be listed.
- **The check:** `gag_lint.py` runs on every build and stops it if any gag card, or any gag camera move, doesn't belong to a chosen school.
- **House grammar is always allowed:** chapter titles, the yellow spoken-words card, lower text, true-scale bars, and the gentle Ken Burns moves.
- **No style named:** any school may be used, and the build report shows which school each gag came from.
- **Browsing:** the Gag Library page has a Style menu that filters by school.

## The schools

### House grammar (always allowed)  (`house`)
Study: `gj581g-stills-world skill`. Camera moves: push, pullback, pan, panL, tilt, tiltDown, drift, hold.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `H-title` | Chapter / quote title card | `kind: title` | - | built |
| `H-text` | Lower text line | `kind: text` | - | built |
| `H-kinetic` | Spoken words / number card (yellow) | `kind: kinetic` | - | built |
| `H-number` | Big number | `kind: number` | - | built |
| `H-bars` | True-scale bars | `kind: bars` | - | built |
| `H-clock` | painted clock: AI-painted dial, ink hands sweep and land on the hour said | `kind: clock` | - | built |
| `H-chips` | gag study 12 Nov 2026: chips (EFFECTS_LIBRARY.md) | `kind: chips` | - | built |
| `H-panels` | gag study 12 Nov 2026: panels (EFFECTS_LIBRARY.md) | `kind: panels` | - | built |
| `H-clones` | gag study 12 Nov 2026: clones (EFFECTS_LIBRARY.md) | `kind: clones` | - | built |
| `H-pile` | gag study 12 Nov 2026: pile (EFFECTS_LIBRARY.md) | `kind: pile` | - | built |
| `H-doodle` | gag study 12 Nov 2026: doodle (EFFECTS_LIBRARY.md) | `kind: doodle` | - | built |
| `H-jack` | gag study 12 Nov 2026: jack (EFFECTS_LIBRARY.md) | `kind: jack` | - | built |
| `H-outline` | gag study 12 Nov 2026: outline (EFFECTS_LIBRARY.md) | `kind: outline` | - | built |
| `H-scroll` | gag study 12 Nov 2026: scroll (EFFECTS_LIBRARY.md) | `kind: scroll` | - | built |
| `H-recap` | gag study 12 Nov 2026: recap (EFFECTS_LIBRARY.md) | `kind: recap` | - | built |
| `H-hand` | gag study 12 Nov 2026: hand (EFFECTS_LIBRARY.md) | `kind: hand` | - | built |
| `H-weather` | gag study 12 Nov 2026: weather (EFFECTS_LIBRARY.md) | `kind: weather` | - | built |
| `H-quote` | gag study 12 Nov 2026: quote (EFFECTS_LIBRARY.md) | `kind: quote` | - | built |
| `H-ots` | gag study 12 Nov 2026: ots (EFFECTS_LIBRARY.md) | `kind: ots` | - | built |
| `H-black` | gag study 12 Nov 2026: black (EFFECTS_LIBRARY.md) | `kind: black` | - | built |
| `H-route` | gag study 12 Nov 2026: route (EFFECTS_LIBRARY.md) | `kind: route` | - | built |
| `H-pov` | gag study 12 Nov 2026: pov (EFFECTS_LIBRARY.md) | `kind: pov` | - | built |
| `H-signoff` | Channel sign-off: 'Live well' + winking logo (Sam, 13 Nov 2026) | `kind: signoff` | - | built |
| `H-palm` | gag study 13 Nov 2026 (fourth study): palm (EFFECTS_LIBRARY.md) | `kind: palm` | - | built |
| `H-beam` | gag study 13 Nov 2026 (fourth study): beam (EFFECTS_LIBRARY.md) | `kind: beam` | - | built |
| `H-tumble` | gag study 13 Nov 2026 (fourth study): tumble (EFFECTS_LIBRARY.md) | `kind: tumble` | - | built |
| `H-blocks` | gag study 13 Nov 2026 (fourth study): blocks (EFFECTS_LIBRARY.md) | `kind: blocks` | - | built |
| `H-smear` | gag study 13 Nov 2026 (fourth study): smear (EFFECTS_LIBRARY.md) | `kind: smear` | - | built |
| `H-linechart` | gag study 13 Nov 2026 (fourth study): linechart (EFFECTS_LIBRARY.md) | `kind: linechart` | - | built |
| `H-tear` | gag study 13 Nov 2026 (fifth study): tear (EFFECTS_LIBRARY.md) | `kind: tear` | - | built |
| `H-listening` | gag study 13 Nov 2026 (fifth study): listening (EFFECTS_LIBRARY.md) | `kind: listening` | - | built |
| `H-void` | gag study 13 Nov 2026 (fifth study): void (EFFECTS_LIBRARY.md) | `kind: void` | - | built |
| `H-blueprint` | gag study 13 Nov 2026 (fifth study): blueprint (EFFECTS_LIBRARY.md) | `kind: blueprint` | - | built |
| `H-neighbour` | gag study 13 Nov 2026 (fifth study): headline neighbour (EFFECTS_LIBRARY.md) | `kind: headline, neighbour: *` | - | built |
| `H-jacksign` | gag study 13 Nov 2026 (fifth study): jack sign (EFFECTS_LIBRARY.md) | `kind: jack, sign: *` | - | built |
| `H-bossbar` | gag study 13 Nov 2026 (sixth study): bossbar (EFFECTS_LIBRARY.md) | `kind: bossbar` | - | built |
| `H-flow` | gag study 13 Nov 2026 (sixth study): flow (EFFECTS_LIBRARY.md) | `kind: flow` | - | built |
| `H-telemetry` | gag study 13 Nov 2026 (sixth study): telemetry (EFFECTS_LIBRARY.md) | `kind: telemetry` | - | built |
| `H-search` | gag study 13 Nov 2026 (sixth study): search (EFFECTS_LIBRARY.md) | `kind: search` | - | built |
| `H-equation` | gag study 13 Nov 2026 (sixth study): equation (EFFECTS_LIBRARY.md) | `kind: equation` | - | built |
| `H-hero` | gag study 13 Nov 2026 (sixth study): void as hero object (EFFECTS_LIBRARY.md) | `kind: void, act: *` | - | built |
| `H-peel` | gag study 13 Nov 2026 (seventh study): peel (EFFECTS_LIBRARY.md) | `kind: peel` | - | built |
| `H-rollcall` | gag study 13 Nov 2026 (seventh study): rollcall (EFFECTS_LIBRARY.md) | `kind: rollcall` | - | built |
| `H-dust` | gag study 13 Nov 2026 (seventh study): dust (EFFECTS_LIBRARY.md) | `kind: dust` | - | built |
| `H-nest` | gag study 13 Nov 2026 (seventh study): nest (EFFECTS_LIBRARY.md) | `kind: nest` | - | built |
| `H-trophy` | gag study 13 Nov 2026 (seventh study): trophy (EFFECTS_LIBRARY.md) | `kind: trophy` | - | built |
| `H-foreground` | gag study 13 Nov 2026 (seventh study): foreground (EFFECTS_LIBRARY.md) | `kind: foreground` | - | built |
| `H-obey` | gag study 13 Nov 2026 (seventh study): clones vanish and sneak back (EFFECTS_LIBRARY.md) | `kind: clones, vanishAt: *` | - | built |
| `H-checklist` | gag study 14 Nov 2026 (eighth study): checklist (EFFECTS_LIBRARY.md) | `kind: checklist` | - | built |
| `H-tier` | gag study 14 Nov 2026 (eighth study): tier (EFFECTS_LIBRARY.md) | `kind: tier` | - | built |
| `H-stretch` | gag study 14 Nov 2026 (eighth study): stretch (EFFECTS_LIBRARY.md) | `kind: stretch` | - | built |
| `H-titledrop` | gag study 14 Nov 2026 (eighth study): titledrop (EFFECTS_LIBRARY.md) | `kind: titledrop` | - | built |

### South Park  (`southpark`)
Study: `styles/SOUTH_PARK_STUDY.md`. Camera moves: hold, drift; hard cuts only, a cut every 2-3 s, front-on staging.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `SP-counter` | Running-gag counter on black ("NOTHING · 1") | `kind: count` | click | built |
| `SP-correction` | Same graphic reversed: CORRECTION banner | `kind: banner, label: CORRECTION` | newsstab / scratch | built |
| `SP-news` | TV-news grammar: banner + ticker | `kind: banner` | newsstab | built |
| `SP-sting` | Spinning news title / masthead | `kind: headline` | whoosh | built |
| `SP-live` | Live inset with REC + timecode | `kind: rec` | click | built |
| `SP-callin` | Call-in box: static photo + phone icon + ON THE LINE | `kind: callin` | phone ring | built |
| `SP-triptych` | Slide-talk stage with three screens | `kind: triptych` | projector click | built |
| `SP-ruler` | Crude scale diagram (ruler on flat yellow) | `kind: ruler` | squeak | built |
| `SP-advert` | Genre switch: glossy mock advert + tagline on black | `kind: advert` | sparkle | built |
| `SP-flare` | Advert lens glint (part of the mock advert) | `kind: glint` | - | built |

### Half as Interesting  (`halfasinteresting`)
Study: `styles/PICTURE_GAG_STUDY_2.md`. Camera moves: whip, push, pan.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `HAI-sticker` | Tilted label sticker on literal stock | `kind: tag` | pop | built |
| `HAI-headswap` | Our mascot's head on a stock body | `kind: sticker, headswap: True` | pop | built |

### Casually Explained  (`casuallyexplained`)
Study: `styles/PICTURE_GAG_STUDY_2.md`. Camera moves: hold.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `CE-chain` | Evolution chain with red arrows | `kind: chain` | pop per step | built |
| `CE-x` | Red X over a picture | `kind: lottie, file: cross.json` | wrong | built |
| `CE-note` | Handwritten note pinned up | `kind: aside, hand: True` | - | built |

### Sam O'Nella Academy  (`samonella`)
Study: `styles/PICTURE_GAG_STUDY_2.md`. Camera moves: hold, push.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `SON-badge` | Rating badge that fact-checks each claim | `kind: meter` | ding | built |
| `SON-labels` | Stacked label arrows | `kind: labels` | pop per label | built |
| `SON-lens` | Magnifying glass on a tiny detail | `kind: lens` | sparkle | built |

### Economics Explained  (`economicsexplained`)
Study: `styles/PICTURE_GAG_STUDY_2.md`. Camera moves: push, drift.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `EE-paper` | Torn-paper definition card | `kind: title, paper: True` | - | built |

### Think School  (`thinkschool`)
Study: `styles/PICTURE_GAG_STUDY_2.md`. Camera moves: push, hold.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `TS-doc` | Document with highlighter sweep | `kind: doc` | paper whoosh | built |

### Tanmay Bhat  (`tanmaybhat`)
Study: `styles/PICTURE_GAG_STUDY_3.md`. Camera moves: hold, punch.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `TB-grey` | Grey-out on the subject of the joke | `kind: grey` | scratch | built |
| `TB-grid` | Reaction grid (our mascot / stock only) | `kind: grid` | pop per tile | built |
| `TB-rain` | Money rain on a boast | `kind: rain` | register | built |
| `TB-inset` | Photo inset with a name tag | `kind: pip` | pop | built |

### LegalEagle  (`legaleagle`)
Study: `styles/PICTURE_GAG_STUDY_3.md`. Camera moves: punch, hold.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `LE-ref` | Framed reference inset | `kind: pip` | - | built |

### Captain Disillusion  (`captaindisillusion`)
Study: `styles/PICTURE_GAG_STUDY_3.md`. Camera moves: push, pullback.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `CD-namesake` | Namesake card: real portrait + stamped name | `kind: namesake` | impact | built |
| `CD-variants` | Variants board: same picture, named treatments | `kind: variants` | click per tile | built |
| `CD-holdup` | Hold-it-up: mascot at the bottom edge | `kind: sticker` | sparkle | built |
| `CD-confetti` | Confetti when it works | `kind: confetti` | popper | built |

### Climate Town  (`climatetown`)
Study: `styles/EDIT_DENSITY_STUDY.md`. Camera moves: push, crash.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `CT-doc` | Document slides in, key line lifted out | `kind: doc` | - | built |
| `CT-burst` | One-second collage sting ("DANG!") | `kind: burst` | impact / airhorn | built |
| `CT-object` | The joke as a literal object sticker | `kind: sticker` | pop | built |

### Slayy Point (Indian vlog edit)  (`slayypoint`)
Study: `styles/EDIT_DENSITY_STUDY.md`. Camera moves: push, triple.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `SLP-sticker` | White-border cut-out sticker | `kind: sticker` | pop | built |
| `SLP-price` | Price tag that stays | `kind: tag` | register | built |
| `SLP-split` | Expectation vs reality inset | `kind: split` | trombone | built |
| `SLP-bw` | Black-and-white mock drama | `kind: freeze` | scratch | built |

### OverSimplified  (`oversimplified`)
Study: `styles/EDIT_DENSITY_STUDY.md`. Camera moves: crash, push.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `OS-bubble` | Speech bubble giving the picture a line | `kind: bubble` | pop | built |
| `OS-grow` | Words grow while the camera crashes in | `kind: grow` | rising whoosh + impact | built |

### Bill Wurtz  (`billwurtz`)
Study: `styles/RIDICULOUS_TOOLKIT.md`. Camera moves: hold.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `BW-aside` | Tiny lowercase aside | `kind: aside` | pop | built |

### Hindi primetime news / The Onion  (`newstv`)
Study: `styles/RIDICULOUS_TOOLKIT.md`. Camera moves: spin, shake.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `TV-banner` | BREAKING banner + ticker | `kind: banner` | newsstab | built |
| `TV-headline` | Onion-style sober headline (THE DAILY SHRUG) | `kind: headline` | whoosh | built |
| `TV-stamp` | Rubber-stamp verdict | `kind: stamp` | boom | built |

### Late-night infomercial  (`infomercial`)
Study: `styles/RIDICULOUS_TOOLKIT.md`. Camera moves: bounce.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `INF-star` | Starburst deal | `kind: starburst` | tada | built |

### Internet / meme edit  (`internet`)
Study: `styles/EFFECTS_LIBRARY.md`. Camera moves: punch, shake.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `NET-caption` | Meme caption top and bottom | `kind: caption` | airhorn | built |
| `NET-stonks` | Crashing / rocketing line | `kind: trend` | fall / climb | built |
| `NET-notify` | Phone notification | `kind: notify` | notify | built |
| `NET-error` | Retro error box | `kind: errorbox` | error | built |
| `NET-loading` | Stalled loading bar | `kind: loading` | ticks | built |
| `NET-lottie` | Emoji / Lottie reaction | `kind: lottie` | - | built |
| `NET-strike` | Strike-through correction | `kind: strike` | squeak | built |
| `NET-counter` | Draining money counter | `kind: counter` | ticks | built |

### Explainer annotation (red pen)  (`annotation`)
Study: `styles/EFFECTS_LIBRARY.md`. Camera moves: push, hold.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `AN-circle` | Red circle | `kind: circle` | squeak | built |
| `AN-arrow` | Red arrow with a note | `kind: arrow` | squeak | built |
| `AN-spot` | Spotlight on the detail | `kind: spotlight` | dundun | built |
| `AN-censor` | Censor bar / blur box | `kind: censor` | bleep | built |

### Classic cartoon (Looney Tunes / SpongeBob)  (`cartoon`)
Study: `styles/PICTURE_GAGS_CATALOGUE.md`. Camera moves: bounce, spin, whip.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `TOON-iris` | Iris out | `kind: iris` | boing | built |
| `TOON-later` | "Some time later" card | `kind: later` | tada | built |

### Indian daily-soap drama  (`dailysoap`)
Study: `styles/RIDICULOUS_TOOLKIT.md`. Camera moves: triple, dutch, shake.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `SOAP-flash` | Colour flash on the shock | `kind: flash` | dundun / thunder | built |

### VHS / found footage  (`vhs`)
Study: `styles/EFFECTS_LIBRARY.md`. Camera moves: hold.

| id | gag | kit card | paired sound | status |
|---|---|---|---|---|
| `VHS-glitch` | VHS glitch | `kind: glitch` | static | built |
| `VHS-overlay` | TV static / glitch overlay | `kind: overlay` | static | built |
| `VHS-rec` | Camcorder REC | `kind: rec` | click | built |

## Writing shapes by school (script level, not checked by the build)
- **South Park:** every beat joined by *but* or *therefore*, never *and then*. Find the take while writing. A running gag that escalates, gets banned, then comes back from the person who banned it. Same graphic, reversed meaning. A genre switch as the punchline.
- **Casually Explained:** escalating evidence that always gets the same deadpan verdict. Hold still when the arrangement is the joke.
- **Sam O'Nella:** the picture fact-checks the narrator (a rating badge).
- **OverSimplified:** the repetition gag ("after three… after FOUR"), and the pictures get the lines.
- **The Onion / Hindi news:** a sober headline with one swapped word.
- **Unfiltered / British / Schulz toolkits:** voice and delivery (see their own docs). They pair with any picture school.
