# Cinematic elements study (14 Nov 2026)

Sam, 14 Nov 2026: "Can you once again do a deep dive on what other kind of cinematic elements can we use in our videos which
compliments our style?" Our style = painted gouache stills (STYLE_PAINTED.md), real unedited photos for real people, painted gag
cards, Sam's narration as the spine. Already built and not repeated here: DRAMA_MOVES.md D1-D10 (vertigo, drop to silence, colour
drain, match cut, letterbox, rack focus, speed ramp, pull-back reveal, withheld payoff, long hold), the 2.5D layers, gag moves.

Sources read: School of Motion "What is a cinematic shot" (composition, light, depth, camera as character); Motion Array on Johnny
Harris-style documentary editing (blur-in photos, text match-cut montage, film textures); No Film School and Cartoon Brew on
Spider-Verse (comic framing, Kirby dots, colour blobs as light, selective animation); trailer sound design guide (rises, hits,
drones, pulses, downers); Wikipedia / MasterClass on the Ken Burns effect and its 3D version; Kurzgesagt production write-ups.

Each idea: what it is -> how we'd build it on painted stills -> where it could sit in Moctar. Cost: S (plan/mix only), M (a new
move or card), L (new tool).

## Light and atmosphere
| # | Element | Build | Fit | Cost |
|---|---|---|---|---|
| C1 | **Moving light** - a soft sunbeam or shaft sweeps slowly across a still | screen-blend gradient layer that travels; strength 0.15-0.3 | desert town, the stage photos | M |
| C2 | **Relight over time** - the same still slides from day to dusk (grade + closing vignette) | animated CSS grade on the shot | "It took Kirkley years" | M |
| C3 | **Heat haze** - the lower third of a desert still shimmers | animated displacement map on a masked band | Sahara / map shots | M |
| C4 | **Blowing sand / dust motes** in the foreground | painted particle layer, slow drift | every desert shot, sparingly | M |
| C5 | **Colour script** - each chapter leans on one hue (warm sand, cool alien green, paper cream, dusk for the ending) | a per-chapter grade in the plan's finish | whole video | S |
| C6 | **Practical glow** - a lamp or phone screen in the still pulses softly | masked brightness flicker | 2 a.m. bedroom, the keypad phone | M |

## Camera and lens
| # | Element | Build | Fit | Cost |
|---|---|---|---|---|
| C7 | **Handheld breath** - a tiny organic drift that feels like a person holding the camera | procedural noise on the move | tense lines, POV beats | M |
| C8 | **Blur-in photo** - a real photo slides in from soft focus to sharp, with a projector click | shot entry: blur 30 -> 0 over 0.5 s + ease | Seuss, Mdou stage photos | S |
| C9 | **Anamorphic streak** - a horizontal light streak across the brightest point | painted-colour streak card, 0.6 s | stage lights, "Twice." | M |
| C10 | **Scale cut** - wide still, then a second still of the same place much closer, on the beat | two stills, plan only | the guitar case, the desk | S |
| C11 | **Symmetry framing** - dead-centre, one-point compositions for "order / rules" moments | a prompt rule for chosen stills | Dr. Seuss bet, the rule chapter | S |

## Editing and structure
| # | Element | Build | Fit | Cost |
|---|---|---|---|---|
| C12 | **Cinemagraph** - one thing moves in a still picture (a string vibrates, sand blows, a flag flutters) | subject.py mask + looping displacement inside it | the homemade guitar, desert | L |
| C13 | **Text match-cut montage** - quick cuts of many pictures, each with the same word centred in the same place | rollcall + aligned label, faster each cut | "phone to phone", the alien drawings | M |
| C14 | **Cold open + title drop** - the opening question, a beat of black, the video's title lands | titledrop card (painted) + black | after op5 | S |
| C15 | **J-cut ambience** - the next scene's sound starts under the last second of the current picture | mix habit | every chapter join (no chapter cards) | S |
| C16 | **Light-leak bridge** - a warm painted light leak washes over the join between two chapters | painted leak overlay, 0.8 s | the five chapter joins | M |

## Sound
| # | Element | Build | Fit | Cost |
|---|---|---|---|---|
| C17 | **Rise -> hit -> downer** - a short riser into a low hit on a reveal, then near-silence | in-house risers in gag_sfx.py | "Twice.", "there's a catch" | M |
| C18 | **Room tone per place** - desert wind, classroom hum, street crowd under the narration at -40 LUFS | ambience beds in mix_bed | each chapter | S |
| C19 | **Tension pulse** - a slow low pulse under a building idea, cut dead at the turn | in-house pulse loop | ch04 before "there's a catch" | S |
| C20 | **Sound from the picture** - the thing on screen makes its sound (a string twang, a phone buzz, a pencil scratch), in a pause | gag_sfx / Mixkit, never on words | guitar, keypad phone, drawings | S |

## Texture and type
| # | Element | Build | Fit | Cost |
|---|---|---|---|---|
| C21 | **Archive treatment** - gate weave, soft grain and a faint frame edge on old real photos | shot flag `archive` | the 1957 Seuss photo | M |
| C22 | **Comic dots (halftone)** - a painted dot screen fades over a still for a punchline beat | overlay card | ch03/ch04 joke beats | M |
| C23 | **Location chyron** - a small typed place-and-year stamp ("Agadez, Niger") | painted lower-left card | first shot of a new place | M |
| C24 | **End credits roll** - a slow painted credits crawl with sources and music under the sign-off | card | after "live well" | M |

## Picks
Most "our style" for the least work: C5 colour script, C8 blur-in photos, C15 J-cut ambience, C18 room tone, C20 sound from the
picture, C14 title drop (plan and mix only); then C1 moving light, C4 sand, C16 light-leak bridges and C21 archive photos (one new
layer each); C12 cinemagraph is the big one (one moving thing in a painted still is very "painted film") and worth the tool.
Rules that still hold: nothing over a face, no gag on a real face, real photos never doctored (archive grain and blur-in are
presentation, not edits to the picture), sounds in pauses only, one drama/cinematic move per beat so they stay special.
