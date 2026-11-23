# Vox: how things come on and how they leave (study, 23 Nov 2026)

Sam, 23 Nov 2026: "Can you watch 5 videos on Vox channel for their cinematics to learn and apply those to our channel? Pay attention to how new objects are brought in on to the screen and how they leave the screen."

The videos were watched muted in the built-in browser and are for analysis only: no transcripts or frames are kept.

**Method.** For each video:
1. A frame sheet across the whole video, to find the graphics passages.
2. A change scan of those passages (every 0.2-0.25 s), to find each event.
3. Frame bursts 0.07-0.15 s apart around each event, to see the motion frame by frame.

The four most recent Vox uploads were podcasts (America, Actually; The Gray Area), so the five studied are the explainers:

| # | Video | Passages studied |
|---|---|---|
| 1 | Creatine, debunked (9:35, 1.2M views) | The word CREATINE and its Greek root (69-73 s); the battery diagram (138-170 s); a portrait with a drawn arrow (62 s) |
| 2 | How US intervention is changing Venezuela (History Can't Hide) | The timeline (134-138 s); the interviewee lower third (140 s); the one barrel that becomes a grid of barrels (292-303 s) |
| 3 | Why the right can't stop talking about communism (History Can't Hide) | The icon timeline (208-220 s); a name tag on archive footage (243-253 s) |
| 4 | Elite universities are losing Black students (History Can't Hide) | Vertical phone clips laid on paper (59-72 s) |
| 5 | Why are fewer Black Americans getting GLP-1s? (History Can't Hide) | The portrait and report on a timeline (264-268 s); a newspaper headline highlight (295 s) |

## How things come on
1. **Arrive pale, settle solid.**
   - In CREATINE, each letter lands 2 frames after the last, grey, a touch high and large, and settles dark on the baseline in about 4-5 frames.
   - A year ahead on a timeline sits grey until the story reaches it (Venezuela's 2014).
   - A bar arriving in a battery is pale on top until it lands.
2. **Rise from behind the line.** On a timeline, the thing comes up from behind the ruled line as if from below a horizon. It is masked by the line, takes about 0.3-0.5 s and slows at the end.
   - In the communism video, a small flag appears first and the globe rises under it.
   - In the GLP-1 video, the report rises where the portrait sank.
3. **The name tag comes after the thing.** The tag types or wipes on once the object has landed, with a yellow accent bar. A lower third's name types letter by letter (about 0.6 s), and the role line follows it.
4. **Make room.** When a second battery joins, the first battery and the lifter slide right in about 0.35 s, with a brief ghost echo, and the new battery fades in where the space opened.
5. **One becomes many.** A single barrel sits centre. The camera pulls back and copies multiply round it into a grid of hundreds (about 1 s). Then it pushes back in to the one barrel, which gains a donut ring that counts up (8.3% to 17.2%).
6. **The first panel slides, the rest pop.** The first phone clip in a layout slides in from the frame edge in about 5 frames with a hard ease-out. Later clips pop in on the beat beside it.
7. **A word rolls into its origin.** Letter by letter, the old letter drops out below as the new one drops in from above. Then a yellow line draws under the root, and the meaning ("flesh or meat") is set under it in italic, word by word.
8. **Drawn pointers.** A yellow hand-drawn arrow draws on towards a face, then the name appears. On moving footage, the tag follows the person.

## How things leave
1. **Tags leave first, by un-wiping.** In the GLP-1 video, MARGARET HECKLER disappears from its left edge ("ARET HECKLER", "ECKLER", gone) over about 0.5 s, before its portrait moves.
2. **Things leave the way they came.** The portrait then sinks back behind the timeline line, accelerating (about 0.45 s).
3. **The camera carries things off.** On a timeline the camera pans to the next year, and earlier icons slide off the left edge. Nothing fades.
4. **Tags on footage leave early.** In the communism video, the name tag on the archive clip un-wipes about 1.5 s before the cut, so the shot ends on a clean picture.
5. **Graphics leave by a hard cut on a word,** almost never by a fade: battery diagram to gym footage, waffle grid to the host, timeline to the host.

## What we built (all Active)

| ID | Piece | From |
|---|---|---|
| VIS-055 | TimelineRail | Rise from behind the line, sink back, the camera pan carrying things off, years pale until reached, tag after and before |
| TXT-023 | LetterDrop | Letters arriving pale and settling, the roll into another word, the highlighter line, the italic gloss |
| MOT-013 | UnwipeExit | Every Label with an end time now leaves by un-wiping from its left edge, with a short fade only at the end. Applied across acts 1 and 2 (re-rendering as v17 and v8) |

Still to build (Planned in this study, not yet registered):
- the make-room slide;
- the one-becomes-many grid (our ScaleField, VIS-024, already covers part of it);
- the first-panel edge slide for footage layouts.

## Our rules from this study
- **Entrances:** a thing arrives first and its tag second. It leaves in reverse: the tag first, then the thing.
- **Exits:** a thing leaves the way it came (the line it rose from, the edge the camera carries it to) or by a hard cut on a word, never a plain fade.
- **Footage tags:** a tag on footage leaves before the cut when the shot ends on a held picture.
- **Calm version:** these keep our limits. Entrances run 0.6-0.9 s overall; the per-letter settles are 0.15 s inside one 0.6-0.9 s word reveal; nothing overshoots.
