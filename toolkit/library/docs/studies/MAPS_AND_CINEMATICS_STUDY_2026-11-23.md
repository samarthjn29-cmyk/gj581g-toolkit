# Maps and cinematics study, 23 Nov 2026

Sam, 23 Nov 2026: "Analyze the above videos, learn from the presenter and build better cinematics for our videos."
Seven videos from Sam's playlist (index 2-8). They were watched muted in the built-in browser and are for analysis
only: no transcripts or frames are kept, and nothing of theirs goes into our videos.

| # | Video | Channel | What it teaches |
|---|---|---|---|
| 1 | Make VOX Style Maps in Adobe After Effects | Mapal | A Google Earth Studio zoom-out with track points. Flags blended onto the land in overlay at 40%, behind feathered masks that grow on. Top-view blasts with their sounds. A finish of desaturation, a vignette, faded film, a 16 mm grain loop and 10 fps posterised time |
| 2 | Clean 3D Animated Travel Map Tutorial | Ignace Aleya | A route that draws on with an eased stroke and a drop shadow, so it sits above the map. A 3D camera on a null that orbits from start to finish. Depth of field: the focus distance moves from origin to destination, and the far map goes soft. A pin pops in with an echo ring |
| 3 | How to Animate the Frontline of a War (Method 1) | Boone Loves Video | Two whole-region shapes in each side's colour share one matte (one normal, one inverted), so one animated mask path moves the front. A turbulent displace and a 25 px feather give it a ragged, organic edge. The base map is tinted and the shapes sit in colour blend, parented to the map |
| 4 | The Secret Trump Investigation Nobody is Talking About | Johnny Harris | The finished style: dark satellite maps with one country lit by a glowing red border. Octagon chips (an icon or a portrait in a real photo, with a small-caps label) are linked by lines and dashed lines, and a money chip travels along the link. A quote sits on the map with its words lit in turn and the paper's masthead under it. Labels lie flat on the tilted map. A running "WHAT WE KNOW" list on ruled paper comes back and gains a line each time. Re-enactments are labelled REENACTMENT. Macro inserts (the bill, the note) sit between the maps |
| 5 | How To Edit A Documentary Like Johnny Harris | Motion Array Tutorials | Three tricks: (1) a still arrives 7-8 frames from below and a little large, eased so it ends very slowly, out of a 30 blur, with a projector tick; (2) a match cut on one word across many pages, the first cuts 8 frames and then faster, with ticks; (3) texture everywhere (paper, wood, light leaks in screen or multiply, and lens blur at the frame edges) |
| 6 | How I Make My Maps | Johnny Harris | His own workflow. Strip the base map of every label and border, then add only his own. One controller carries the map, highlights and labels, so they move as one. A country lights with a left-to-right wipe during the move and fades as the camera goes in to a city. The camera starts wide, zooms in, and keeps tilting down slowly during the hold, then flies on. The bearing is keyed a little later than the position, so the move orbits. Labels are 3D and lie on the map. A period map (a sheet with A and B zones) lies over the satellite map at its true place, in perspective |
| 7 | 7 Map Creation Tools for Adobe After Effects | Boone Loves Video | The toolbox: a 3D globe with atmosphere and day or night, Google Earth Studio, vector maps as shapes, earth-zoom kits (call-outs, info boxes and markers, each with its own sound), route generators (the camera follows the path and stops on points), routes on a globe, country highlights, and map styles (realistic, old map, watercolour, dotted, vector) |

## What we already have
- **HeadlineMatchCut** (VIS-003, MOT-004): the word match cut.
- **LensFocusPocket** (LOK-024): edge lens blur.
- **RadioRings** (MAP-008): rings on a point.
- **The grain loops** (LOK-005, LOK-008) and **CinematicFinish** (LOK-030).
- **TravellingMap** (MAP-012): a tilted map, camera moves, billboard pins, routes.
- **BuildUpMap** (VIS-048) and **LedgerCard** (VIS-039).

## What takes us closer, and what we build
1. **The photo arrives through a lens** (video 5): a still lands from just below and a touch large, out of blur, and ends very slowly, with a projector tick. This is our TRN-017 LensSettle, a cut variant (`transitionIn: "lens"`). It moves 42 px with scale 1.06 to 1 and blur 14 px to 0 over 0.7 s, on the ExtremeEase curve, so most of the move lands in the first 8 frames. Use it on pictures only.
2. **The map moves like a camera, not a slide** (videos 2, 6, 7): MAP-012 TravellingMap v2.
   - The turn and tilt run a little behind the position (`lag`), so every move orbits.
   - During a hold the camera keeps tilting down slowly (`holdTilt`).
   - Labels can lie flat on the map (`flat`).
   - The route carries a drop shadow, lifted off the paper.
3. **Pins land, they don't pop** (video 2, the calm version): MOT-012 PinDrop. The pin falls 16 px onto the map, its shadow tightening as it lands, and one echo ring spreads and thins. There is no overshoot, which keeps the calm rule.
4. **Depth of field on the tilted map** (video 2): LOK-032 MapDepthOfField. Only a band round the focus point stays sharp; the far map, and the near edge, go soft. The focus follows the camera.
5. **Regions light and fronts move** (videos 3, 4, 6): MAP-014 MapRegion.
   - A region (a polygon in map pixels) fills in a tint, either with a left-to-right wipe or with a feathered grow from a point.
   - It can carry a glowing edge (Johnny Harris's lit border) and fade on a cue.
   - With `front`, the region's edge moves between shapes along a ragged, turbulent line: a frontline, a spreading idea, a border shifting.
6. **A period map laid on the modern one** (video 6): MAP-015 MapOverlaySheet. A registered old map lies as a sheet above the base map at its place, slightly lifted, with a shadow under it. It fades on, and can lift away again.
7. **Evidence as a chain** (video 4): VIS-053 EvidenceChain. Octagon chips (an icon, a real registered portrait or a document, with a small-caps label) are linked one by one on their words, by a solid line for a known link and a dashed one for a suspected link. A small token (a letter, a parcel, a sum) can travel along a link. It sits on the shot's ground or over a map plate.
8. **"What we know"** (video 4): VIS-054 WhatWeKnow. A ruled card in the screen's left third. Each time it comes back it shows the earlier lines and writes one new line by hand on its word. Lines can be ticked, or struck when a fact is overturned. It returns at most four times an act, and holds only facts the narration says.

## Rules carried over
- **Calm version:** entrances 0.6-0.9 s, no overshoot, one slow move per shot, blur ≤ 16 px on an entrance.
- **Real people only in real photos:** portrait chips use registered portraits. A re-enacted or illustrative picture carries a RECONSTRUCTION label.
- **Every new piece:** a register row (best use and limit), a Drive copy, strict stills before it goes Active, and only Active assets render.
