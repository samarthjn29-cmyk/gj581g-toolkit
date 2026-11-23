# The Director (GJ 581g library build)

Sam, 23 Nov 2026, on the first LayerStage tests: "You need to consider the background by paying attention to the
foreground. There has to be some kind of relation between the two. Also pay attention to where do you bring in a
particular object and where do you move it so that it seems good to the eyes of the viewers. We can bring in a
Director who can help us with these things." Then: "Yeah i agree. Setup the Director."

The Director is a separate agent with its own job. It is not the reviewer.
- **The Director decides how a shot looks before it is built:** what is behind the subject and why, where things
  come in, where they travel and land, how they leave, and how the eye moves from one shot to the next.
- **The reviewer checks the built clip for mistakes:** facts, overlaps, timing, sound, loudness, captions.

Order for every act, from Gate 2: **Director's brief -> build -> strict stills -> Director's frame review -> fixes ->
render -> independent reviewer -> Sam.** Nothing reaches Sam with an open Director note.

## 1. Which shots need a brief
Every shot that has any of these:
- a LayerStage (VIS-059), or any shot with a world behind a held thing;
- an ObjectEntrance (VIS-058), ObjectStory (VIS-049) or any carried cut-out;
- a camera move across a map (TravellingMap, PeriodMapPlate) with pins, labels or a route;
- a transition that carries something from one shot into the next (push, match cut, lens, world change).
Plain cards, charts and pages get a one-line brief (where the eye starts and ends), not the full table.

## 2. The brief (one per shot, in `episodes_src/<EP>/director/<act>_brief.md`)

| Field | What it says |
|---|---|
| Line | The words this shot sits on, with their times. |
| Subject | The one thing the viewer must look at. |
| World and why | Each background and the one-line relation to the subject: **same place, same time, same idea, or the change itself** (the geranium by day and by candle). A world with no relation is not used. Generic stock (a sky, a texture) only when the line is about that thing. |
| Period honesty | A modern clip or photo behind a period object carries a TODAY tag, or the world is a period picture (a print, painting, map or page of the time). Film did not exist before the late 1880s: no "period footage" for earlier times. |
| Entry | Where the subject comes in, from which side, and why that side (where the eye already is, where the story comes from). |
| Path and landing | Where it travels and where it lands (a third of the frame, a named place on the map), and what that landing means. |
| Scale | Any size change and its motive (it becomes a detail in a bigger picture; we go into it). |
| Action | The one thing it does after landing (swap, tint, glint, tilt, state change). |
| Exit | How it leaves: in reverse of its entry, carried off by the camera, or a hard cut on a word. The tag first. |
| Eye out | Where the eye is at the end, and where the next shot's subject appears (within 25% of it, or a push from it). |
| Sound | The landing or change sound, in a pause. |

## 3. Composition rules (what the Director holds every shot to)
1. **The background has a reason.** It shares a place, a time or an idea with the subject, or it is the change the
   line is about. The same reason is written in the act file (`why` on each LayerStage world).
2. **One subject at a time.** Everything else is quieter: lower contrast, softer, smaller.
3. **Land on a third, not dead centre,** unless the shot is symmetric on purpose (a single object reveal). Leave
   space on the side the subject faces or moves towards (lead room).
4. **Never cover the background's own subject.** The flame, the place on the map, the face, the title of a page stay
   visible. Check the landing spot against the world's focus point.
5. **Enter where the eye already is,** or from the side the story comes from. On a map, things come from where they
   came from in life. Left to right reads as forward in time; right to left as going back.
6. **Every move has a destination that means something.** The page goes to Kendal; the flower steps aside so the
   flame shows. No drifting to an empty corner.
7. **Size changes are motivated.** Shrink when the thing becomes part of a bigger picture; grow when we go into it.
8. **Balance:** a heavy subject on one third is balanced by its tag, a caption or the background's weight on the
   other side. No frame with everything crowded on one half and nothing on the other.
9. **Safe area and headroom:** text inside 120 px x 84 px; a subject's top edge at least about 8% below the frame
   top; nothing important under the bottom caption band.
10. **Continuity of the eye across cuts:** the next shot's subject lands within 25% of the screen of where the eye
    left (rules/beat-routing.md, eye trace), or the cut is a push from that point.
11. **Light agrees with the world.** A carried thing takes the world's light (LayerStage cast); a dark world gets a
    lit subject, never a flat cut-out pasted on top.
12. **Calm version:** one move per shot, entrances 0.6-0.9 s, no overshoot, at most one world change every 2.5 s.

### Layering (study of compositing and parallax practice, 23 Nov 2026: `styles/LAYERING_STUDY_2026-11-23.md`)
13. **Three planes, each with texture.** A layered shot has a far world, a mid plane or a second depth inside the
    world, and the near thing. A flat colour plane hides parallax; every plane carries real detail.
14. **Depth by more than speed.** Far moves slowest (0.35x), and is also a little softer and flatter: `haze`
    0.05-0.15, `blur` 1-2.5 px, with `rackSec` when the near thing arrives (focus moves from the world to the thing).
    Never blur the world's own subject while the narration is about it.
15. **No gaps, no tearing.** Every plane overlaps the frame and the plane in front by at least the full camera move;
    scrub the stills at the move's ends for a bare edge.
16. **No lines that tie the planes together.** A road, bridge, horizon rail or power line running from the near plane
    into the far one locks to one perspective and shows the cardboard; pick another world or keep the move tiny.
17. **Integrate the cut-out.** Its shadow falls away from the world's light (`lightFrom`) in the world's own ambient
    colour, never grey-black; `rest: true` for a thing lying on a surface (tight contact shadow), lifted otherwise.
    The edge is choked and wrapped in the world's light; the thing is graded part-way to the world (LayerStage does
    these). Halos from the old background, a light direction that disagrees, or a saturation jump are notes.
18. **Moves stay small and eased.** One pan or push of a few per cent, eased in and out, all planes the same
    direction; the big moves are the carried thing's own, with a destination (rule 6).
19. **Stylised is fine when it is honest.** A layered picture is a made picture: ILLUSTRATION, SIMULATION or
    RECOLOURED tags where the meaning could be taken as a record.

## 4. The frame review (after strict stills)
The Director gets stills at the shot's start, entry midpoint, landing, each change, and end, plus the brief. For each
shot it answers:
- Does the world relate to the subject, as the brief says? Is the relation visible, not just written?
- Where does the eye go first? Is that the subject?
- Is the landing on a third, with lead room, and off the background's own subject?
- Is anything crowded, cramped against an edge, or unbalanced?
- Does the eye leave this shot where the next one picks it up?
- Layering checks on the landing still: blur the frame in your head (does the cut-out's brightness or colour jump
  out of the world?), look at the edge at 200% (fringe or halo?), look at the thumbnail (does it read at phone size?),
  and check the shadow falls away from the world's light.
It returns PASS or a note per shot, each note with a concrete change in prop terms (move `at` to [x, y], change the
world, change the entry side). Notes are logged in `rules/DIRECTOR_NOTES.md` so its taste stays the same act to act.

## 5. How the Director agent is briefed
A fresh agent each time (it has not seen the work being made), given:
- this file and `rules/DIRECTOR_NOTES.md` (Sam's notes and past decisions come first);
- the act's script lines with word times, the beat sheet rows, the register's best use and limit for every asset
  it may pick, and the list of Active sources;
- the studies: `docs/studies/` (Vox and Johnny Harris entry and exit, maps and cinematics) and the project's
  BACKGROUNDS_STUDY and CINEMATIC_REVIEW;
- for the frame review, the stills (as images it reads) and the act file.
It may propose a new source (a period print, a painting, a map) but it never adds one itself: new sources go through
the register (row, best use and limit, licence, Drive copy) and the fact-check like any other.
