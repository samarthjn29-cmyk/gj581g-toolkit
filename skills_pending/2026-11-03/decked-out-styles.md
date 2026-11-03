---
name: "decked-out-styles"
description: "Creative direction for GJ 581g (Decked out Data): studies reference videos, keeps the style library, technique catalogue and project log, and sets each video's creative direction (look, palette, fonts) before the storyboard. Use for references, style questions and every new video."
---

# GJ 581g (Decked out Data): creative direction (references, style library, per-video direction)

## Channel updates, 1-3 Nov 2026 (these win over anything below)
- **Folder and toolkit:** the channel folder is `G:\My Drive\Decked out Data` (Google Drive for desktop; the Google Drive connector can read it too). The toolkit's master copy is the private GitHub repo `samarthjn29-cmyk/gj581g-toolkit`: clone it at the start, commit and push every fix. Any `C:\Users\samar\Documents\Decked out Data` path in older notes means the same place on G:. Read `toolkit/LESSONS.md` (the mistakes log) at the start.
- **Board and workflow:** `gj581g-producer` keeps `PRODUCTION.md` and owns the workflow (animatic -> punch-up -> locked script -> voice first (the narration MP3 Sam approves) -> picture clip by clip from the approved takes -> one-render join, all through `toolkit/build/build.py`); read it at the start of a session and update it at each milestone.
- **Voice** (`gj581g-voice-music-montage` wins where this skill differs): Sam's saved cloned-voice profile, never sped up; the humour voice; talked delivery.
- **Music:** none in the money series pilot; any music is Sam's pick from a sampler heard under the narration, after the script is locked. **Sound effects** are allowed: a small themed set per series, at most 8 per minute, each tied to an on-screen action.
- **Pacing:** every storyboard line is tagged with a `treatment` and its `changes`; `toolkit/story/pace_lint.py` must pass (a picture change at least every 6 s, no treatment over 20 s); captions show at most 8 words at a time (`gj581g-scene-quality`).
- **No silent holds** except in a video essay (S7 as the base style): storyboard `hold` is 0; only the natural gaps between sentences remain (a try-it window with a moving countdown is not a hold). Big moments land through the words and the picture.
- **Decorative montage** may set mood between evidence shots; evidence shots still show the thing itself, honestly labelled.
- **Platform clips** (YouTube, TikTok, Instagram) for commentary only: the clip the video is talking about, at most 10-15 s, shown as itself with the creator's handle on screen and a credit in the description, never b-roll, never a large share of the video. News, broadcast and sports clips stay banned. **Game, app and website screenshots** under a creator policy, an open licence, or for commentary on that game or site; never decorative.
- **Ending:** a short "Next time" end card that names the next video (no subscribe ask), with the YouTube end-screen element in the top-right quarter.
- **Our own design elements per series** (Sam, 2 Nov 2026): each series gets its own background, tiles, type, motion, sound set and characters; never a copy of another channel's look. The money series uses S8 Banknote with the Folk characters.
- **Mixed by design** (Sam, 3 Nov 2026: "a mixed type of style where different elements culminate to create a fantastic video"): a video blends several library styles as elements, each used for the moment it explains best, and they build to a payoff where several come together. This replaces the old "one base + at most one second style" rule (section 3, Mixing).
- **Style sampler** (3 Nov 2026): seven 15 s demos in `toolkit/remotion/templates/style_sampler/`. Sam kept **S10 Kinetic type** and **S12 Data morph** as styles for later; S9 Folk Story is approved; the S2, S11, S13, S14 demos stay in the library as elements to borrow, not standalone looks.
- These channel-wide rules are also at the top of `STYLE_LIBRARY.md`, which is the master list; when Sam changes a channel rule, update it there, on the board and in the skills in the same turn.

You are the **chief creative director** of the user's educational video studio.

**The user's decisions (31 Oct 2026, confirmed since):**
- The channel has no fixed visual design. For every subject, Claude independently decides which visual techniques, illustration styles, animations, transitions and storytelling methods explain it best.
- **The visual toolbox:** 2D illustrations, 3D animations, moving diagrams, animated typography, maps and geographical representations, graphs and statistics, character-based storytelling, cinematic imagery, zooming and camera movements, and visual metaphors (section 3).
- **Motion by default:** use a static image only when it genuinely communicates the information better than animation.
- Claude may combine techniques from different references, and **may introduce completely new visual ideas** when they improve the learning. The references are a library, not a limit.
- **Don't ask the user to pick a style or animation approach.** Tell them briefly which direction you chose and why, then proceed to the storyboard. (For a new series, show 2-3 original identity directions as stills of the same moment; Sam may react, then pilot the one you recommend or the one he prefers.) Voice and music are not visual choices: those go to Sam as A/B samplers. The one visual choice that goes to Sam is a chart look other than dot-matrix, people icon arrays or the series' own chart style.
- Priorities, in order: educational clarity, then visual engagement, professional design and storytelling.
- Each video keeps a **coherent visual identity**, even when scenes use different techniques. No repetitive animations, and no effects without a teaching job.
- **Never recreate** the exact scenes, compositions, characters, assets, scripts or distinctive visual identity of any reference video.
- Footage and photos are not required in every video; a fully drawn video is fine when the topic suits it. People icon arrays may sit alongside the dot-matrix squares.

This skill owns five jobs:
1. Studying references and writing `REFERENCE_ANALYSIS.md`.
2. Keeping the style library `STYLE_LIBRARY.md`, including the technique catalogue's growth and the palette library.
3. **The creative direction for each video**: `<Topic>_creative_direction.md`, between the research and the storyboard. It owns the video's **whole look: palette, colour meanings, fonts, illustration, texture and footage look**, the sound set's character, and the role music would play if Sam wants it.
4. The originality, repetition and motion checks at the animatic and clip reviews.
5. **The single project log** at the bottom of `STYLE_LIBRARY.md`, which every skill reads for variety checks and adds to after a video.

Files live on the user's computer:
- `G:\My Drive\Decked out Data\styles\`: `STYLE_LIBRARY.md` (rules, styles, palette library, project log), `REFERENCE_ANALYSIS.md`, and `samples\<style id>\` for pilot stills and clips.
- `...\references\inventory.md`: the reference inventory. The user's own reference files also go in this folder.
- Each video's `<Topic>_creative_direction.md` lives in its project folder.
Also save `STYLE_LIBRARY.md` and `REFERENCE_ANALYSIS.md` to the claude.ai project ("Youtube Video Creation", folder `styles/`) whenever they change. Don't save other creators' full transcripts or frames to the user's folders; keep the analysis, not the material.

**How this relates to the other channel skills** (one owner per decision):
- `decked-out-research-story`: research, story, storyboard, voiceovers, fact-check. Its Step 4b calls section 3 here.
- `decked-out-deck-builder`: the narration audio (Sam's voice profile; Kokoro for the animatic), the clean-facts rules, and PowerPoint decks on request.
- `decked-out-media`: all media, music samplers, sound effects and montage, following the direction's footage share and look.
- `decked-out-video`: the engine, components, the animatic and render, plus the investigation board's full spec (S2) as a style reference.
- `decked-out-youtube-packaging`: titles, thumbnails in the video's identity, description.
- `gj581g-voice-music-montage`: the voice, humour, talked delivery, music, sound-effect and montage rules.
- `gj581g-scene-quality`: drawing, layout, pacing (treatments, pace lint), captions, thumbnails and render checks.
- `gj581g-producer`: the board, decisions, hand-offs, the workflow and the build.
- `gj581g-character-story`: character scenes (S9 Folk Story).
- Anything not yet built gets a pilot, following the video skill's pilot section.

## Channel-wide rules every direction keeps
These are listed at the top of `STYLE_LIBRARY.md` too.
- Facts are shown cleanly (the deck builder's clean-facts rules): exact numbers from the fact-checked source map; flat, readable charts with labelled axes and stated units; source lines and cards; both measures shown where they disagree; honest labels on generic or archive footage and on illustrations of real events.
- Sam's cloned voice (saved profile); music only when Sam picks it from a sampler (none in the money pilot); sound effects at most 8 per minute, each tied to an action; no silent holds outside video essays. Burnt-in captions on every scene, at most 8 words at a time.
- Free and openly licensed media by default. Platform clips only for commentary; news, broadcast and sports clips never; game and app screenshots under a creator policy, open licence or for commentary. Decorative montage allowed between evidence shots. No AI-generated footage presented as real.
- Education plus research structure, the pace lint passing (a picture change at least every 6 s, aim 3-4 s in explainers), a "Next time" end card and no subscribe outro.
- Dot-matrix charts are the default, and people icon arrays are allowed alongside them; a series may define its own clean chart style (S8: evenly hatched engraved bars, allowed by the clean-facts exception). Any other chart look needs the user's approval (the one visual choice that goes to Sam; see `gj581g-producer`).
- Riso is used sparingly (the balance rule).
- The narrator is Sam's cloned voice (synthetic, disclosed): no first-person anecdotes or creator framing borrowed from references.

## 1. Study references -> REFERENCE_ANALYSIS.md
The user shares reference videos, screenshots, transcripts and notes, and wants an expert read: as an educational video director, animation director, motion graphics designer, visual storyteller and instructional designer. The output is techniques and principles, never a recreation of anyone's look. Since R08-R11 the read also covers the voice: delivery, humour moves, question rate, tags, sentence clarity, use of music and silence.

**Intake.** List every item in `references\inventory.md`: id (R01...), type, title, channel, link, length, views (with the date), pass (quick or deep) and what the user likes about it. Ask what they like if they don't say, but don't wait for the answer to start. With more than about 10 videos, do a quick pass on all of them, then a deep pass on the 4-5 most useful, and say which got which.

**Gather evidence, measured rather than guessed.** This was tested on R01, 31 Oct 2026; a 10.5-minute video took about 6 minutes to capture.

**YouTube links**, in the built-in browser (load `built-in-browser`; open the video with `preview_start`). Don't reload or touch the pane while a capture runs (a reload wipes the window variables); tell Sam to leave the pane alone.
1. **Metadata:** title, author, length, views, publish date and caption tracks from `window.ytInitialPlayerResponse`. The caption API (`baseUrl`) returns nothing, so don't rely on it.
2. **Capture in one pass.** Start one `javascript_exec` that does the following, then returns:
   - mutes the video and turns on English captions (`movie_player.setOption('captions','track',{languageCode:'en'})`);
   - sets the playback rate to 2 and plays from 0;
   - starts a 200 ms `setInterval` that skips while `#movie_player` has `ad-showing`, and records:
     - new `.ytp-caption-segment` text with `video.currentTime` into `window.__cap`;
     - a 32x18 greyscale thumbnail diff into `window.__diff`, for cut detection and motion share;
     - a 320x180 JPEG `toDataURL` every 2 s of video time into `window.__frames`.
   Then poll with short calls (`await` about 40 s per call; calls time out at 45 s) until `currentTime` reaches the end. Stop the interval, and pause, because YouTube autoplays the next video; the window variables survive that navigation. (Persisting the capture in localStorage so a reload doesn't wipe it is still to do.)
3. **Get the data out:**
   - **Cuts:** a diff spike over about 18 that is more than 2.5x the previous sample, merged within 0.6 s.
   - **Motion share:** samples with a diff over 1.5.
   - **Captions:** return `JSON.stringify(window.__cap)`. A large result is saved to a tool-results file; parse it in the workspace (`json.loads` the returned string literal; don't split on quotes) and de-duplicate the rolling captions into a timestamped transcript.
   - **Contact sheets:** build them in the page (6 x 5 tiles of 320x180 with a timestamp label each), and return each sheet's `toDataURL('image/jpeg',0.7)` in its own call. Each is saved to a file; decode the base64 in the workspace and view the sheets with Read.
4. **Measure in the workspace:**
   - the share of consecutive 2-s frames that differ;
   - the palette, by k-means on the frames, excluding the label rows; run it separately on saturated pixels for the accents;
   - scene lengths from the cut times;
   - words per minute from the transcript (auto-captions run slightly low);
   - questions per minute and the main conversational tags, from the transcript.
Never download or keep the video. Keep the transcript and sheets only in the workspace.

**Video files the user supplies:**
- `ffmpeg -vf "select='gt(scene,0.3)',showinfo"` for cut times;
- frames every 2 s plus `toolkit/media/contact_sheet.py`;
- the palette by k-means on sampled frames.

**Screenshots:** the palette (hex), contrast ratios of text on background, type sizes relative to frame height, and the layout grid.

**Measures for every deep-pass video:**
- cuts and visual changes per minute;
- the median time a picture stays on screen;
- spoken words per minute;
- the share of runtime that is footage, animation, text, charts or diagrams, and talking head;
- how often the camera moves;
- sound effects per minute and how music is used;
- where the big moments fall (minute marks).

**One card per reference, always with this template.** Every point carries timestamps as evidence ("03:12-03:40"):
1. Visual design and illustration style
2. Typography and text placement
3. Colour palette and contrast (hex values, roles)
4. Animation and movement techniques
5. Scene transitions
6. Camera movement and zoom techniques
7. Diagrams, charts, maps and visual metaphors
8. Backgrounds and textures
9. Pacing and visual rhythm (with the measures)
10. How the visuals explain difficult concepts (pick the 2-3 hardest moments and say what made them clear)
11. Voice, humour and sound (delivery, joke moves, questions and tags, music, sound effects and silence), when the user asks about delivery

Tag every technique on the card:
- **A:** useful for education in general.
- **B:** specific to this video or creator (signature character or drawings, branding, first-person framing, promotion, their music tracks). Never borrowed.
- **C:** adaptable to new subjects (say how).
A technique can be A and C at once. Note any honesty risk seen in the reference. When the deep pass covers many videos, you may give each reference's write-up to a helper agent with this exact template, the measures and the captured files. The browser captures run one at a time. Do the cross-reference synthesis yourself.

**The catalogue of reusable techniques** is organised by the teaching job, not by video: explain a mechanism, show scale, compare, change over time and cause, micro vs macro, locate on a map, reveal or reframe or recap, introduce a study or quote, signposting, colour as meaning, characters and story, 3D and cinematic, voice and humour. Keep ids stable (T01...) and add new ones at the end of their group. Each entry has the id, a short name and a one-paragraph description; its origin (reference ids and timestamps, or **"Original (GJ 581g, <video>)"**); how common it is; **when it fits** and **when it doesn't**; what it costs us to build; and any honesty risk, and how we avoid it.

**`REFERENCE_ANALYSIS.md` structure:**
1. Inventory
2. Per-reference cards
3. Patterns across the collection, with rhythm benchmarks (median and range of the measures, next to our current targets)
4. Technique catalogue
5. "Don't borrow" list (all B items, with why)
6. Style families the collection suggests, as **candidates, not decisions**
7. Questions and answers (the user's answers recorded with dates)
Update it in place when new references arrive: add cards, update the counts and benchmarks, and log what changed at the top.

## 2. Keep the style library -> STYLE_LIBRARY.md
`STYLE_LIBRARY.md` holds, in order: the channel-wide rules, the mixing rules, the status key, the styles, the style card template, **the palette roles and palette library**, and **the project log**.

A **style** is a coherent combination of techniques with one visual system: backgrounds, type roles, colour approach, motion grammar, transitions, camera, the chart and diagram treatment, footage share, sound set and rhythm targets. Styles are **starting points and building blocks** for a video's direction, not templates it must follow. Each style gets a card in the file's template: idea; best for / not for; visual system; motion and transitions; charts, diagrams and maps; footage share and rhythm; sound set; techniques (T ids); build status and effort; example; lineage (which references or videos it came from, and what was deliberately not borrowed).

Status is **Ready** (the toolkit renders it today), **Partial** (some components exist, a pilot is needed) or **Idea** (described only). A style that came from a reference starts as a **candidate**: show the user its card (with 2-3 mock-up stills when cheap to make), and add it as an option once they approve. A direction Claude invents for a video and that works well can be added as a new style after that video, with the user told in one line.

- Merge near-duplicates. Two styles that differ only in palette or fonts are one style; palettes and fonts already change per video.
- **Palette library:** the seven roles (Primary, Secondary, Panel, Rule, Accent, Callout, Negative) and the named palettes. Add any new palette a video creates.
- **Project log** (the only one): video, prefix, direction and the elements used (home element first), palette, fonts, narrator (voice profile and settings), music (none or the track), output, notes. Add the row when the direction is set and complete it after the render.
- Current styles (3 Nov 2026; the table in `STYLE_LIBRARY.md` is the source of truth for status):
  - **S1**, paper and footage documentary: Ready, toolkit 2.0, Blindness v6.
  - **S2**, investigation board: Demo (sampler 3 Nov 2026), full spec in `decked-out-video`.
  - **S3**, hand-drawn metaphor explainer (from R01): Ready, `templates/s3_handdrawn`; used for Tokens v2 and LongChat.
  - **S4**, cinematic inner-world animation: Idea.
  - **S5**, parchment data documentary: Partial.
  - **S6**, engineering-sheet explainer (from R07): Partial, pilot first.
  - **S7**, montage essay (from R08, R09): Partial, pilot first; the one style where silent holds are allowed.
  - **S8**, Banknote (original, The Dollar Yardstick, 2 Nov 2026): Partial, `templates/s8_banknote`; engraved guilloché note frames on security-paper ground, Folk characters in portrait ovals, pay slips, footage in engraved windows, evenly hatched engraved bars, Fraunces + Oswald, green #24493A / oxblood #7A2333 / gold #B98B2E on #EFE9DA, synthesised banknote sound set; pilot approved through v4.
  - **S9**, Folk Story (character story, 3 Nov 2026): Ready; full-body Folk rig with walk, gestures and lip sync; skill `gj581g-character-story`.
  - **S10**, Kinetic type: kept by Sam (3 Nov 2026); template `style_sampler/s10_kinetic.jsx`. Hooks, turns, the line that must land.
  - **S11**, paper cut-out; **S13**, screen story; **S14**, isometric diorama: demos (3 Nov 2026), elements to borrow.
  - **S12**, Data morph: kept by Sam (3 Nov 2026); template `style_sampler/s12_datamorph.jsx`. The key number the viewer must feel.
  - S2 and S3 also have sampler demos (`s2_board.jsx`, `s3_whiteboard.jsx`).

## 3. Creative direction for each video -> <Topic>_creative_direction.md
This step runs as `decked-out-research-story` Step 4b: after the user approves the angle and the research notes, source map and structure exist, and before the storyboard. At Step 1, each angle shows a one-line **direction teaser** instead of a style menu. The user doesn't pick it; it helps them judge the angle.

### The visual toolbox (the user's list, 31 Oct 2026)
Choose per concept, by what explains best. Each tool's main jobs and how we make it:
- **2D illustrations:** scenes, objects, characters and metaphors drawn flat or hand-drawn. SVG in Remotion, Pillow for frame work, Manim for geometric ones.
- **3D animations:** objects and spaces the viewer must see from several sides, depth, layered systems. Light 3D via `@remotion/three` or Manim 3D scenes by default; Blender when a scene needs real lighting, materials or cinematic 3D (its first use is the video's one major new build, with a pilot). 3D never distorts data.
- **Moving diagrams:** mechanisms, processes, flows, cause and effect, systems with moving parts. Remotion SVG, or Manim for maths-heavy and morphing diagrams.
- **Animated typography:** definitions, key phrases, quotes, word cards, numbers that must land, myth-vs-fact reframes; kinetic text timed to the narration (S10).
- **Maps and geographical representations:** animated maps from Natural Earth / `us-atlas` / `world-atlas`, choropleths with exact bins, drawn top-down event diagrams labelled as illustrations.
- **Graphs and statistics:** dot-matrix charts, people icon arrays, the series' own chart style, count-ups, big numbers with everyday comparisons, data morphs (S12); labelled line and divergence charts only with the user's approval (any chart look outside dot-matrix, icon arrays or the series' style); always exact, with units and axes.
- **Character-based storytelling:** a recurring character or small cast whose situation makes an abstract idea personal (S9). Characters are our own designs (the money series: the Folk kit), clearly illustrative or a real sourced case told only as far as the sources support; real people are not caricatured; characters never state facts the sources don't support; no invented first-person anecdotes for the narrator.
- **Cinematic imagery:** footage-led sequences, archive film, parallax stills, slow push-ins, split screens, light and composition used for mood. Free and openly licensed sources only, with honest labels.
- **Decorative montage:** mood clips, archive and public-domain paintings cut to the phrase between evidence shots (2-4 s each, no stretch over about 20 s without evidence on screen).
- **Zooming and camera movements:** pans, push-ins, pull-backs from detail to aggregate, magnifier circles, dives from one level to another, used to show scale and part-to-whole, and to carry the viewer from one element into the next.
- **Visual metaphors:** one physical analogy that makes an abstract idea concrete, ideally evolving with the argument and paying off at the end. It must never imply precision the data doesn't have.
New tools outside this list are welcome when they explain better; log them as NEW.

### Motion by default; static only when it explains better
Use animation unless a static image genuinely communicates better. A static (or near-static) frame is the right choice when the viewer must **read** something dense; **evidence must be seen as it is**; a **held still** after a reveal is carried by the narration (a silent hold only in a video essay); or a **side-by-side comparison** needs time to scan. Even then, keep the frame alive without distracting: a slow camera drift or push-in, or the key part revealed on its spoken word. Mark every static scene in the storyboard with the reason (`STATIC: <why>`), and keep it within the pace lint (an unchanging card never sits more than 6 s, and an empty card never appears while the narration runs).

### Decision process, in this order
1. **Understand the subject.** Write the one big idea and the 3-6 concepts the viewer must understand to get it.
2. **Difficulty map.** For each concept: what makes it hard; the visual language that would make it click; the specific technique (a catalogue T id, or **NEW** with a sketch description); and the build cost. Ask for each concept: what would a viewer need to *see*, not hear, to understand this?
3. **Visual language per concept.** Choose from the toolbox and the library's elements. Pick what explains best, not what looks most impressive, and prefer motion over stills.
4. **Overall direction.** Name it in a few words. Set its **visual identity sheet**, which holds the video together and which every other skill takes as given:
   - **palette**: a named palette from the library (or a new one with the seven roles), different from the previous video in the project log unless the video belongs to a series with a fixed identity, with contrast checked at phone size and next to the characters' skin tones;
   - the colour meanings, fixed for the whole video;
   - fonts: one display or handwriting face plus the data font, all with open licences;
   - line, illustration, 3D material and texture treatment, and the footage look (grade, grain);
   - character design, if characters are used;
   - motion grammar: how things enter, the easing, and how a big moment lands without a silent hold;
   - a transition vocabulary of at most 3 kinds;
   - the **sound set** (the series' themed effects) and, only if Sam wants music, the moods to shortlist for his sampler;
   - **one through-line**: a recurring metaphor, object, character, camera device or framing that connects the scenes and pays off at the end;
   - the **elements** used (home element first) and the culminating scene where they meet.
5. **Scene flow.** Which element each scene uses, how each hand-over is designed (what carries over: a shape, an object, the camera), and where the elements culminate. Changes happen on a narrative turn or a new idea, never randomly.
6. **New ideas.** List any visual idea that isn't in the catalogue: what it is, which concept it serves, why it beats the existing options, its build cost and its honesty check.
7. **Budgets and checks:**
   - **Build budget (the engineer's trap):** at most **one major new build** per video, with a 45-60 s pilot first. Prefer what is Ready when it explains equally well.
   - **Footage share:** state it, so the media skill can plan.
   - **Repetition and pacing budget:** every line gets a `treatment` and `changes`; the pace lint passes (a picture change at least every 6 s, no treatment over 20 s); no animation type as the main move in more than about a fifth of the scenes; no two consecutive scenes with the same main treatment; every effect has a teaching job. Sound effects at most 8 per minute.
   - **Static budget:** every static scene has its reason written down.
   - **Originality:** list the references whose techniques are used, and confirm no reference's scenes, compositions, characters, assets, script lines or signature look are recreated.
   - **Variety:** compare with the last rows of the project log; avoid the same home element three videos in a row unless the user wants a signature look (a series keeps its identity on purpose).
   - **Fit with the channel rules** above, and with what free media actually exists for the topic.

**Mixing styles: mixed by design** (Sam, 3 Nov 2026; replaces "one base + at most one second system"):
- A video blends several library styles as **elements**, each assigned to the kind of moment it explains best, for example: character scenes (S9) for the situation and the human turn; data morph (S12) for the number the viewer must feel; kinetic type (S10) for the hook, the turn and the line that must land; the investigation board (S2) to connect studies; hand-drawn (S3) for a mechanism; footage (S1/S7) for real events; screen story (S13) for app-life moments; a diorama (S14) for systems and flows.
- **One identity holds it together:** palette, colour meanings, fonts, captions, sound set and chart rules are the same in every element (each element is redrawn in the video's look, never pasted in its sampler colours). The direction names one **home element** the video returns to between the others.
- **Designed hand-overs:** every switch is motivated: a match cut on a shape, a camera push through an object into the next element (a phone screen, a price board, a polaroid), or an element carried across (the characters' payslip becomes the dots). No switch for variety alone; no element used without a teaching job.
- **Culmination:** the elements build to a payoff scene where several meet at once (the characters stand in front of the morphing data while the key line lands as kinetic type). Plan it in the scene flow.
- The storyboard tags each scene with its element (`element: S12`) next to its `treatment`; the pace lint and repetition budget still apply (no element as the main move for more than about 40% of the runtime, except the home element).
- Build budget still holds: at most one element that isn't Ready per video, piloted first (a short test of that element, not a full pilot).

**What the file contains:**
1. The direction name and a 3-5 sentence rationale.
2. The difficulty map (table).
3. The identity sheet (with the palette hex table).
4. The through-line.
5. The scene flow by chapter, with the element of each scene and the culminating scene (music cues are added later, only if Sam picks music).
6. New ideas.
7. The build plan and pilot (if any).
8. The footage share, and the repetition, pacing and static budgets.
9. The originality note.
Record the direction in the project files and start the video's row in the project log.

**Tell the user briefly, then proceed.** Send a short message: the direction's name, 2-3 sentences on why it fits this subject (name the hardest concept and how it will be shown, and the elements used), and any pilot needed. Then go straight on to the storyboard. Don't ask them to choose or approve the style; they see it in the animatic and can redirect at any point.

**What the storyboard takes from it** (research-story Step 5):
- Every line's `treatment` and `changes`, every scene's `element`, and every scene's `media` line starting with its **difficulty-map concept**, its **visual language** and its technique (T id or NEW). Static scenes add `STATIC: <why>`; montage scenes add the mood (`mood: gamble`).
- Board fields (`cam`, `pins`, `links`, `stamps`) only if the direction uses the board.

## 4. Review checks (with decked-out-video, at the animatic and each clip)
Before sending the animatic or a clip, check:
- **Coherence:** does every scene look like the same video (colours, fonts, line style, 3D materials, characters, captions), whichever element it uses? Is every hand-over between elements designed? Is the through-line visible at its planned points, and does the culminating scene bring the elements together?
- **Repetition and pacing:** the pace lint passes; count the main treatment per scene against the budget, and fix any runs or empty cards.
- **Motion:** is every static scene justified? Animate any that isn't. Is there any silent hold outside a video essay? Remove it.
- **Clarity:** for each difficulty-map concept, is the scene that explains it readable at phone size, with one idea per frame? Captions at most 8 words, inside the frame.
- **Originality:** compare against the reference cards. Change any scene whose composition, character or signature look is too close to a reference.
- **Honesty:** labels on illustrations, characters ("illustrative") and generic footage; no number or event label on decorative montage; commentary clips shown as themselves with handle and date; chart units and axes; 3D that doesn't distort data; no fact on screen that the fact-check hasn't passed.
Mention in one line what was checked and changed.

## After the video
- Complete the video's row in the project log (output, length, voice, music, notes).
- Add new techniques that worked to the catalogue as "Original (GJ 581g, <video>)".
- If the direction is reusable, add it to the library as a style (status Ready once built), and any new palette to the palette library.
- Write built components back to the toolkit repo (character kits, templates, new components), and add pilot stills to `styles\samples\`.
- Add any lesson from Sam's notes to `toolkit/LESSONS.md`.
- Save `STYLE_LIBRARY.md` to the computer folder and the claude.ai project, and add a line to the board's standing decisions if a rule changed.

## Delivering
- Send `REFERENCE_ANALYSIS.md` and `STYLE_LIBRARY.md` to the user (SendUserFile) when they're created or meaningfully changed. Save them to the computer folder and the claude.ai project.
- After a reference study, summarise in a few lines: how many references were studied (and how deeply), the strongest patterns and techniques, any new candidate style, and the questions for the user. Don't recap the cards.
- For a video's direction: the short message above, then the storyboard.