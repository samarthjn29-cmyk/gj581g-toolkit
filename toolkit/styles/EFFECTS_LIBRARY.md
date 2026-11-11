# Effects library: camera moves, cards, picture gags and sounds

Built 11 Nov 2026 for Sam ("a detailed library of picture gags and various effects which we can give on our pictures and videos"). Every entry works in the stills kit today (`kit/StillsScene.jsx` + `kit/Gags.jsx`); previews are on the Gag Library page. Regenerate the demo reel and previews with `toolkit/stills/fxlib.py` (entries live there).

**How to use one:** add the shot fields or the card to the scene plan (`stills/<scene>.json`), cue it on a heard word, then add the paired sound to the mix with `mix_bed.py --sfx sfx/sfx_<name>.wav@<cue time + offset>:-29`. Sam's clean cuts now use voice + gag sounds only (`--bed none`, 11 Nov 2026), with gag sounds on as many gags as fit.

**Rules:** pictures at least 2 s on screen; text gags up for 0.8 s + 0.3 s a word; one gag per beat; back-to-back full-screen cards hard-cut; sounds about 12 dB under the voice and never on top of a fact the viewer must follow; gags punch up; no real logos or AI likenesses of real people; on-screen figures are the fact-checked spoken ones.


## Camera moves

| id | name | use it for | plan fields | paired sound | shape from |
|---|---|---|---|---|---|
| `push` | Push | Slow push in: the default for a still the line is about. | `{"move": "push"}` | - | Ken Burns |
| `pullback` | Pull back | Starts close, reveals the whole picture: a reveal or "and here is the scale of it". | `{"move": "pullback"}` | - | Ken Burns |
| `pan` | Pan right / panL | Travel across a wide picture (a landscape, a row of servers). | `{"move": "pan"}` | - | Ken Burns |
| `tilt` | Tilt up / tiltDown | Climb a tall thing (a dish, a building) or come down to a detail. | `{"move": "tilt"}` | - | Ken Burns |
| `drift` | Drift | Gentle float for reflective lines. | `{"move": "drift"}` | - | Ken Burns |
| `hold` | Hold | Almost still: under cards, or when the picture must be read. | `{"move": "hold"}` | - | - |

## Gag moves

| id | name | use it for | plan fields | paired sound | shape from |
|---|---|---|---|---|---|
| `punch` | Punch-in | Snap zoom onto the funny detail on the beat ("Can you believe that?"). | `{"move": "punch", "punch_at": 0.6, "punch": 0.3}` | whoosh@0.5 | Edgar Wright snap zoom |
| `whip` | Whip pan | Fast blurred arrival: a sudden change of subject. | `{"move": "whip", "from": 70}` | whoosh@0.0 | Edgar Wright whip pan |
| `spin` | Spin in | The picture spins in from small: a newspaper-spin "meanwhile". | `{"move": "spin"}` | whoosh@0.05 | old newsreel |
| `crash` | Crash zoom | Slams in from very close: shock, a big reveal. | `{"move": "crash"}` | boom@0.0 | crash zoom |
| `bounce` | Bounce | Springy scale: cute or silly subjects (robot babies). | `{"move": "bounce"}` | boing@0.0 | cartoon squash |
| `dutch` | Dutch tilt | The frame tips over: something is wrong, mock-sinister. | `{"move": "dutch", "angle": -8}` | dundun@0.2 | Dutch angle |
| `triple` | Triple zoom | Three snaps in: soap-opera shock reaction. | `{"move": "triple", "triple_at": 0.3}` | dundun@0.3 | Indian daily-soap reaction |
| `shake` | Shake | Camera shake that settles: an impact, a boom, a shouted word. | `{"move": "hold", "shake": 1.8, "shake_at": 0.4}` | boom@0.4 | impact shake |

## Cards

| id | name | use it for | plan fields | paired sound | shape from |
|---|---|---|---|---|---|
| `kinetic` | Number card (kinetic short) | The spoken number in big type on the parakeet-yellow ground, words landing as said. | `{"kind": "kinetic", "style": "short", "text": "730 billion dollars", "nums": ["730"], "dur": 2.6, "ground": "#FCCF3E", "ink": "#0B5E2A", "inkNum": "#063F1C"}` | boom@0.3 | Blank Rascal study |
| `kinetic_static` | Static word card | A short line, all words at once, no motion ("What the F**K?"). | `{"kind": "kinetic", "style": "short", "text": "What the F**K?", "static": true, "dur": 2.2, "ground": "#FCCF3E", "ink": "#0B5E2A", "inkNum": "#063F1C"}` | scratch@0.0 | Sam, 11 Nov 2026 |
| `rise` | Rising words | Big bold words rise from below over the picture. | `{"kind": "kinetic", "style": "rise", "text": "Seventy-two minutes", "dur": 2.6}` | whoosh@0.2 | - |
| `number` | Big number | One fact-checked figure with its plain-words unit. | `{"kind": "number", "term": "$730B", "text": "four companies, this year", "dur": 2.6}` | ding@0.5 | - |
| `title` | Title card | Chapter marks and quotes, centred serif. | `{"kind": "title", "text": "1. The cold box", "dur": 2.6}` | - | - |
| `text` | Lower text line | One key line low on the picture. | `{"kind": "text", "text": "More than twenty metres of volcanic rock", "dur": 2.6}` | - | - |
| `bars` | True-scale bar chart | Two amounts at honest scale: the camera climbs the big bar for ages. | `{"kind": "bars", "dur": 2.9, "ratio": 7300, "h0": 8, "tick": 4000, "tickStep": 50, "hold0": 0.8, "scrollEnd": 2.1, "a": {"label": "Alien search, ten years", "value": "$100 million"}, "b": {"label": "Big tech, this year", "value": "$730 billion"}}` | climb@0.8, ding@2.1 | xkcd scale chart (E6) |
| `counter` | Draining counter | A money counter that holds, then drains faster and faster to $0. | `{"kind": "counter", "dur": 2.9, "from": 100000000, "to": 0, "hold": 0.5, "drain": 1.7, "label": "the biggest alien search, live"}` | ticks@0.0 | countdown gag |

## Picture gags

| id | name | use it for | plan fields | paired sound | shape from |
|---|---|---|---|---|---|
| `banner` | Breaking-news banner | A sober headline about something obvious, with a joke ticker. | `{"kind": "banner", "text": "TECH COMPANIES STILL TECH COMPANIES", "ticker": "aliens unavailable for comment  •  more at eleven", "dur": 2.9}` | newsstab@0.0 | news parody |
| `headline` | Newspaper front page | Spins in: an Onion-style sober headline ("THE DAILY SHRUG"). | `{"kind": "headline", "text": "Civilisation Spends 72 Minutes On Biggest Question Ever", "dur": 2.9, "size": 74}` | whoosh@0.0 | The Onion / newsreel |
| `aside` | Tiny aside | Small italic text pops on and off: a muttered comment. | `{"kind": "aside", "text": "(rated u for unfunded)", "dur": 2.4, "x": 1080, "y": 140, "size": 64}` | pop@0.0 | Bill Wurtz |
| `stamp` | Rubber stamp | A verdict slammed onto the picture (REJECTED, CANCELLED). | `{"kind": "stamp", "text": "CANCELLED", "dur": 2.4, "rot": -12}` | boom@0.05 | stamp gag |
| `starburst` | Infomercial starburst | A spiky yellow star with a "deal": mock salesmanship. | `{"kind": "starburst", "text": "ONLY $100M!\nTEN WHOLE\nYEARS!", "dur": 2.4}` | tada@0.0 | infomercial |
| `pip` | Reaction pop-up | A reaction picture pops up in the corner. | `{"kind": "pip", "img": "G_alien_popcorn.jpg", "dur": 2.4}` | pop@0.0 | reaction cut-in |
| `flash` | White flash | A camera-flash frame on an impact or a cut. | `{"kind": "flash", "dur": 0.3}` | click@0.8 | - |
| `rain` | Money rain | Banknotes falling over the picture: big spending. | `{"kind": "rain", "dur": 2.9}` | register@0.2 | make-it-rain |
| `confetti` | Confetti burst | A burst of confetti from the bottom: mock celebration. | `{"kind": "confetti", "dur": 2.6}` | popper@0.0 | party gag |
| `glint` | Sparkle glint | A light sweep and twinkles: "shiny", "brand new". | `{"kind": "glint", "dur": 1.2}` | sparkle@0.6 | sparkle |
| `freeze` | Freeze-frame caption | The picture goes grey and a yellow label lands: "Yep. That's me." | `{"kind": "freeze", "text": "Yep. That's the plan.", "dur": 2.6}` | scratch@0.3 | freeze-frame narration |
| `circle` | Red circle | A hand-drawn circle around the detail, with a scribble. | `{"kind": "circle", "x": 0.5, "y": 0.45, "rx": 0.14, "text": "the entire budget", "dur": 2.6}` | squeak@0.2 | red-circle annotation |
| `arrow` | Red arrow | An arrow from a scribbled note to the thing that matters. | `{"kind": "arrow", "x": 0.55, "y": 0.55, "fx": 0.22, "fy": 0.2, "text": "this costs $0", "dur": 2.6}` | squeak@0.3 | annotation |
| `censor` | Censor bar | A black bar over a word or a face, with a bleep. | `{"kind": "censor", "x": 0.36, "y": 0.42, "w": 0.28, "h": 0.12, "text": "[REDACTED]", "dur": 2.6, "delay": 0.4}` | bleep@0.4 | censor bar |
| `censor_blur` | Blur box | A blurred mosaic box: "we are not allowed to show this". | `{"kind": "censor", "mode": "blur", "x": 0.3, "y": 0.25, "w": 0.4, "h": 0.45, "dur": 2.6, "delay": 0.3}` | bleep@0.3 | pixelation |
| `spotlight` | Spotlight | Everything goes dark except the detail: "and THIS is the problem". | `{"kind": "spotlight", "x": 0.5, "y": 0.45, "r": 0.13, "text": "the one that matters", "dur": 2.6}` | dundun@0.2 | iris highlight |
| `lens` | Magnifying glass | A lens enlarges a tiny detail of the same picture. | `{"kind": "lens", "x": 0.5, "y": 0.4, "r": 0.13, "zoom": 2.6, "dur": 2.6}` | pop@0.0 | magnifier |
| `bubble` | Speech bubble | A picture "says" the subtext. | `{"kind": "bubble", "text": "Please. Just one more data centre.", "x": 0.64, "y": 0.22, "tx": 0.5, "ty": 0.5, "dur": 2.6}` | pop@0.0 | comic bubble |
| `think` | Thought bubble | What the subject is secretly thinking. | `{"kind": "bubble", "think": true, "text": "is anyone out there?", "x": 0.66, "y": 0.22, "tx": 0.48, "ty": 0.55, "dur": 2.6}` | pop@0.0 | comic bubble |
| `notify` | Phone notification | A push notification slides down with the bad news. | `{"kind": "notify", "app": "Space budget", "title": "Mission cancelled", "text": "Your Mars sample is now someone else's problem.", "dur": 2.9}` | ping@0.1 | phone notification |
| `errorbox` | Error dialog | A retro error box (stacked): something has stopped working. | `{"kind": "errorbox", "title": "budget.exe", "text": "Funding for curiosity has stopped responding.", "stack": 3, "dur": 2.9}` | error@0.0, error@0.18, error@0.36 | computer error |
| `loading` | Stalled loading bar | A progress bar that crawls and stalls at 3%. | `{"kind": "loading", "text": "Loading alien budget…", "pct": 3, "sub": "about 40 years left", "dur": 2.9}` | ticks@0.0 | loading bar |
| `tag` | Price tag | A swinging price tag on the thing: "this is what it costs". | `{"kind": "tag", "text": "$100M", "sub": "ten years", "x": 0.66, "y": 0.12, "dur": 2.6}` | register@0.25 | price tag |
| `strike` | Strike-through correction | A word struck out and the honest one scribbled above. | `{"kind": "strike", "before": "The search was ", "wrong": "funded", "right": "defunded", "after": ".", "dur": 2.9}` | squeak@0.5 | self-correction |
| `caption` | Meme caption | Big outlined words at the top and bottom of the picture. | `{"kind": "caption", "top": "They spent $730 billion", "bottom": "on not aliens", "dur": 2.6}` | airhorn@0.2 | meme caption |
| `trend_down` | Crashing line | A red line crashes down across the picture. | `{"kind": "trend", "dir": "down", "text": "alien funding", "dur": 2.6}` | fall@0.1 | stonks |
| `trend_up` | Rocketing line | A green line rockets up across the picture. | `{"kind": "trend", "dir": "up", "text": "AI spending", "dur": 2.6}` | climb@0.1 | stonks |
| `rec` | Camcorder REC | Corner brackets, blinking REC and a timecode: "live footage". | `{"kind": "rec", "text": "REC", "dur": 2.9, "from": 3601}` | click@0.0 | found footage |
| `glitch` | VHS glitch | Scan lines, tearing and a PLAY read-out: rewinding, old tape, a malfunction. | `{"kind": "glitch", "dur": 1.6}` | static@0.5 | VHS |
| `split` | Expectation vs reality | Two pictures side by side, labelled. | `{"kind": "split", "imgs": ["G_alien_radio.jpg", "R_leopard.jpg"], "labels": ["EXPECTATION", "REALITY"], "dur": 2.9}` | trombone@0.6 | expectation vs reality meme |
| `later` | "Some time later…" card | The old documentary time-skip card. | `{"kind": "later", "text": "Thirty years later…", "dur": 2.6}` | tada@0.0 | SpongeBob-style time card |
| `iris` | Iris out | The picture closes to a circle and goes black: "that's all, folks". | `{"kind": "iris", "x": 0.5, "y": 0.45, "dur": 2.4}` | boing@1.6 | Looney Tunes iris |
| `count` | Running-gag counter | A plain black counter tallies a running gag each time it returns ("NOTHING · 1"). | `{"kind": "count", "text": "NOTHING · 1", "x": 0.5, "y": 0.5, "dur": 1.4}` | click@0.25 | South Park "01 OF 50" card |
| `callin` | Call-in box | A static photo in a phone-in box, ringing phone icon, ON THE LINE strap: a picture gets a voice. | `{"kind": "callin", "img": "G_alien_popcorn.jpg", "name": "ALIEN, DEEP SPACE", "title": "Human have money.", "dur": 2.9}` | r:notify@0.1 | South Park news call-in |
| `triptych` | Slide-talk stage | A lecture stage with three screens; pictures swap in on cues. Full-screen. | `{"kind": "triptych", "imgs": ["a.jpg", "b.jpg", "c.jpg"], "slides": [[0, 0, 0], [0.6, 1, 1], [1.2, 2, 2]], "caps": ["the cost", "the time", "the upside"], "dur": 2.9}` | click per swap | South Park slide talk |
| `ruler` | Crude scale diagram | A ruler on flat yellow with a tiny red tick. Full-screen. | `{"kind": "ruler", "title": "One year of NASA science", "max": 365, "unit": "days", "marks": [[4, "big tech: 4 days"]], "dur": 2.9}` | squeak@0.75 | South Park crude diagram |
| `advert` | Mock advert switch | Glossy advert: slow push, lens flare, gold serif title, then a tagline on black. Full-screen. | `{"kind": "advert", "img": "R_servers.jpg", "title": "THE CLOUD", "tagline": "Very large warm boxes.\nThat think.", "tagDur": 1.2, "dur": 2.9}` | sparkle@0.2 | South Park PSA |
| `grey` | Grey-out | The subject of the joke drains to black and white (a box, or the whole frame). | `{"kind": "grey", "x": 0.3, "y": 0.1, "w": 0.4, "h": 0.85, "dur": 2.6}` | scratch@0.0 | Tanmay Bhat roast edit |
| `grid` | Reaction grid | A grid of reaction pictures popping in (our mascot or stock only). Full-screen. | `{"kind": "grid", "imgs": ["a.jpg", "b.jpg", "c.jpg", "d.jpg"], "labels": ["aliens", "robots", "also aliens", "nobody"], "dur": 2.6}` | pop per tile | Tanmay Bhat reaction grid |
| `namesake` | Namesake card | A real portrait (open licence) beside the idea named after the person, name stamped in yellow. Full-screen. | `{"kind": "namesake", "img": "R_portrait.jpg", "idea": "R_thing.jpg", "name": "DRAKE", "stampAt": 0.6, "dur": 2.9}` | r:impact@0.6 | Captain Disillusion |
| `variants` | Variants board | The same picture several times with named treatments, lit one by one. Full-screen. | `{"kind": "variants", "img": "a.jpg", "title": "THE SAME EMPTY SKY, ACCORDING TO", "items": [["OPTIMISTS", "saturate(1.7)"], ["PESSIMISTS", "grayscale(1)"]], "gap": 0.55, "dur": 2.9}` | click per tile | Captain Disillusion |

Every gag also belongs to one or more gag schools (style families): see `GAG_SCHOOLS.md` and `stills/gag_schools.json`. A plan with `"gags": ["southpark"]` uses only that school.

## Sounds (`toolkit/media/gag_sfx.py OUTDIR <names>`, in-house, no credit)

| name | what it is |
|---|---|
| `trombone` | Sad trombone: a failure, a let-down |
| `boo` | Crowd boo (synthesised; a real CC0 one is sfx_boo_real) |
| `popper` | Party popper |
| `register` | Cash register ka-ching |
| `kiss` | Cartoon "mwah" |
| `airhorn` | Air horn |
| `scratch` | Record scratch: stop, what? |
| `drumroll` | Drum roll before a reveal |
| `boom` | Deep boom on a big number or impact |
| `whistle` | Short slide whistle up |
| `climb` | Long slide whistle up: a bar or line that keeps going |
| `fall` | Slide whistle down: things going badly |
| `dundun` | Dun-dun-DUNNN: mock drama |
| `whoosh` | Whoosh for fast moves and spins |
| `thunder` | Thunder: doom |
| `boing` | Cartoon boing |
| `tada` | Ta-da fanfare |
| `kazoo` | Kazoo fanfare: mock triumph |
| `newsstab` | News sting |
| `ding` | Clean bell ding: a correct answer, a landing |
| `sparkle` | Sparkle chime: shiny |
| `ticks` | Stopwatch ticking faster and faster |
| `bleep` | Censor bleep |
| `static` | TV static burst |
| `ping` | Phone notification |
| `error` | Retro computer error buzz |
| `pop` | Bubble pop: something appears |
| `click` | Camera shutter |
| `squeak` | Marker squeak while drawing |

## Growing the library
- Build the remaining shapes in `PICTURE_GAGS_CATALOGUE.md` (about 170; about 40 are built).
- LottieFiles animations (Remotion `@remotion/lottie`), licence checked per file.
- Overlay footage (film burn, light leaks, smoke, glitch) from Pixabay / Mixkit video, logged.
- Real recorded sounds (Freesound CC0, Pixabay, Mixkit) to replace the synthesised ones where they sound fake; Sam's own reaction sounds.
- A study of heavily edited channels (effects and sounds per minute).
- Every new video adds 2-3 entries; Sam's notes become rules here.
