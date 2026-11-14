# Big cinematic moves, picture and sound (14 Nov 2026)

Sam, 14 Nov 2026: "Search more for big cinematic moves. They can also be sound related." Follows DRAMA_MOVES.md (D1-D10) and
CINEMATIC_STUDY.md (C1-C24); nothing here repeats those. "Big" = a move a viewer notices and remembers; use one or two a chapter.

Sources: Hans Zimmer and Christopher Nolan on Dunkirk (CBC Q; Vox "The sound illusion that makes Dunkirk so intense"); No Film
School on Scorsese and Thelma Schoonmaker's editing (freeze frames, flashbulbs, cuts you notice); "Why the Sound of Metal sound
design is so effective" (subjective, muffled sound; body sounds); PremiumBeat "7 iconic Hollywood cinematography techniques";
Open Culture / Every Frame a Painting on Edgar Wright's visual comedy (sound-timed jokes, match cuts, cuts on the music); trailer
sound design (rises, hits, drones, downers); TED "Everything you hear on film is a lie" (Foley, sound is built).

## Sound moves
| # | Move | What it does | Build | Fit in Moctar |
|---|---|---|---|---|
| B1 | **Shepard tone** | a tone that seems to rise for ever: unbearable tension that never resolves (Dunkirk) | in-house synth, 4-8 s, cut dead | ch04 build to "there's a catch" |
| B2 | **Ticking clock** | a watch tick mixed into the bed, speeding up (Dunkirk) | in-house tick, rate ramps | "It took Kirkley years" |
| B3 | **Braaam** | a huge low brass blast on a reveal (the Inception trailer sound) | in-house synth: detuned saws + sub, 2.5 s | "Twice." or the ch04 turn |
| B4 | **Reverse swell** | a reversed reverb tail that sucks in and lands on a word or a cut | in-house: reversed noise burst with reverb | into "So he made one." |
| B5 | **Subjective muffle + ring** | the world goes muffled, a thin ear ring, then snaps back (Sound of Metal, war films) | mix: low-pass the bed and room tone, add a 4 kHz ring | "He couldn't get one." |
| B6 | **Heartbeat** | a close, slow heartbeat under a held moment | in-house (pulse is close; a true lub-dub) | the 2 a.m. bedroom, the final take |
| B7 | **Worldized music** | the bed starts tinny, as if from a phone speaker, then opens to full (phone-to-phone songs) | mix: band-pass the bed, then sweep open | "people passed them from phone to phone" |
| B8 | **Cut on the beat** | picture changes land on the bed's beats in a fast stretch (Edgar Wright) | build_scene option: snap cuts to beat times | the songs-travelling montage |
| B9 | **Doppler pass-by** | a sound flies past left to right with the pitch dropping, under a whip or a wipe | in-house: pitch-bent whoosh, stereo pan | whip moves |
| B10 | **One sound in silence** | everything stops, one small real sound plays (a pen tick, a string), then the bed returns | mix habit + picture sound | "Some of them are very real." |
| B11 | **Radio tuning** | static and dial sweep between "stations" as a transition | in-house | a chapter join |

## Picture moves
| # | Move | What it does | Build | Fit in Moctar |
|---|---|---|---|---|
| B12 | **Zoom-through** | the camera pushes into a detail (a phone screen, a window, a hole) and comes out in the next picture | shot move `through` + next shot starts from a crop | phone screen -> the song spreading |
| B13 | **Flashbulb cut** | a white camera-flash frame with a crackle hides a cut and punctuates (Scorsese / Raging Bull) | card `flashbulb` + crackle sound | the Tiny Desk / stage photos |
| B14 | **Freeze + narrator** | the picture stops dead, desaturates a touch, a name or note writes on (Goodfellas) | shot `freeze` for stills: hold + grade + scribble | introducing Kirkley |
| B15 | **Whip-pan transition** | a fast blurred pan carries us from one still to the next (P.T. Anderson) | move `whip` exists; pair it as a transition with B9 | between two places |
| B16 | **Lightning / flicker** | the still flashes bright two or three times with thunder (or a light flickers) | card `flicker` | the family's verdict |
| B17 | **Silhouette reveal** | the picture starts as a dark silhouette, light comes up to reveal it | shot `silhouette` (brightness from 0.1) | the homemade guitar's first look |
| B18 | **Camera shake on impact** | one heavy jolt on a hit, then still | `shake` exists; pair with B3 | the ch04 turn |
| B19 | **Split screen** | two stills side by side, held, for a then/now or two people | `split` exists (painted) | the homemade guitar vs the left-handed electric |
| B20 | **Overhead to eye level** | a top-down still cuts to the same thing at eye level on a beat | two stills, plan | the desk, the guitar case |

## Rules kept
One big move per beat; sounds in pauses, never over Sam's words (the muffle and the worldized bed are treatments of the bed,
not new sounds on words); no move on a real person's face; flashes stay short and soft (no strobing: at most 3 flashes,
each 2 frames, never more than 3 a second, for viewers with photosensitive epilepsy).

## Motion inside the picture (Sam, 14 Nov 2026: "create and use these whenever we can")
| Move | Field | Tool | Use |
|---|---|---|---|
| Cut-out move (hop, pull, tip, slide, bob) | shot `parts` + `parts_base` | `stills/part.py --box` (rembg in a box) | a thing in the still acts: a brick hops, a lever squeezes |
| Puppet part (swing, wag, wave) | shot `parts`, act `swing` with `pivot` | `stills/part.py --poly` (exact shape) | an arm paints, a tail wags; best when Firefly paints the part separately |
| Cinemagraph (one thing moves) | shot `cine` {mask} or part act `buzz` | `subject.py` / `part.py --keep` | a string shivers, steam, a flag |
| Plotagraph (a region flows for ever) | shot `flow` {mask or y/y2, dir, len, period} | mask PNG (alpha) or a band | sand off dunes, clouds, smoke, water |
| Reverse cinemagraph | `flow` with mask = inverse of subject.py near.png (+ particles) | subject.py, then invert the alpha | time stops for one thing: the homemade guitar still while the desert streams |
| Painted particles | card `particles` {type sand / dust / embers / snowpaper} | none | desert shots, light beams, stage photos |
| Distortion | shot `warp` {kind ripple / glitch, at, dur, amp} | none | ripple for memory or "years later"; glitch only for AI or screen beats |
Rules: painted look only (no digital sparkle), small moves (the inpainted gap only survives a short reveal), never on a real photo of a person, glitch 0.2-0.5 s with no brightness change (not a flash), about one in-picture motion every two or three shots so it stays alive without becoming busy.
Limbs bend, never slide (Sam, 14 Nov 2026, the writing hand: "It's cut out from the remaining hand"): a hand or arm part gets
`part.py --bend ANCHOR TIP` (the joint stays pinned, the tip moves) and a Firefly clean plate (`--plate`). Every new kind of moving
part is shown to Sam as a short test before it goes into a chapter.
