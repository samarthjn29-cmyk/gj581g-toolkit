---
name: "decked-out-video"
description: "Renders a GJ 581g (Decked out Data) video to MP4 with Remotion, following each video's creative direction (any style: footage-led, hand-drawn S3 kit, S8 Banknote, investigation board, Manim, 3D): the animatic, then clip-by-clip renders through the one-command build, reviewed with the user. Use for \"make/render the video\", the animatic, or to change and re-render scenes."
---

# GJ 581g (Decked out Data): video (Remotion)

## Channel updates, 3 Nov 2026 evening (skill audit; these win over everything below, including the 1-2 Nov block)
- **Workflow:** the workflow is `gj581g-producer` steps 1-8: script + storyboard (fresher test) -> animatic -> punch-up -> lock -> **voice first** (the whole locked script in one batch, `build.py full.json --to listen`, Sam approves the narration MP3; single lines fixed with `tts/patch_line.py`) -> picture clip by clip from the approved takes (`--from align`, never re-voiced) -> **join = one render of `full.json` from the approved takes** (`--from align`), not a stitch of clip files; after the join nothing changes in that video. Any text below that says "voice clip N+1 while Sam reviews clip N", "clip-by-clip narration" or "join the approved clips" is replaced by this.
- **Second voice:** the Heckler (`gj581g-voice-music-montage` section 0b): optional per video, used in the Dollar Yardstick from video 2; lines tagged `who: "heckler"` and `mood`; her own synthetic voice at 1.2x, voiced by `build.py` when `project.json` has `"heckler_ref"`; she never says a number; **her lines are never captioned or subtitled**. The old `{viewer: ...}` curious-viewer voice is legacy (Tokens, LongChat only); don't use it in new scripts.
- **Simple scripts:** `gj581g-first-lecture` wins on how many numbers are spoken and how plain the words are: at most 3 spoken numbers a minute, one key number per chapter, a person before every concept, one new term per chapter, sentences averaging 10-15 words (nothing over about 25), and the fresher test (`toolkit/story/simple_lint.py` + a first-day-student read) before the script locks.
- **Swearing and real people:** allowed within `gj581g-voice-music-montage` moves 8-9 (never in titles, thumbnails, descriptions or tags; public figures only, for what they publicly said or did, every claim sourced).
- **Captions:** the narrator's and characters' lines only; the S8 `Captions` component and `story/timing_srt.py` skip `who: "heckler"`. YouTube captions come from `story/timing_srt.py <timing.json> <out.srt>` for build projects; `make_srt.py` is the old engine's.
- **Characters:** `gj581g-character-story` (rig, lip sync, pose tracks) and the cast looks in `gj581g-scene-quality` section 2.

## Channel updates, 1-2 Nov 2026 (these win over anything below)
- **Folder and toolkit:** the channel folder is `G:\My Drive\Decked out Data` (Google Drive for desktop; the Google Drive connector can read it too). The toolkit's master copy is the private GitHub repo `samarthjn29-cmyk/gj581g-toolkit`: clone it at the start, commit and push every fix. Any `C:\Users\samar\Documents\Decked out Data` path in older notes means the same place on G:. Read `toolkit/LESSONS.md` (the mistakes log) at the start.
- **Board and workflow:** `gj581g-producer` keeps `PRODUCTION.md` and owns the workflow; read it at the start of a session and update it at each milestone.
- **Voice** (`gj581g-voice-music-montage` wins where this skill differs): Sam's saved cloned-voice profile, scene mode, every take word-checked; never sped up; the humour voice; talked delivery.
- **Workflow (trial from 2 Nov 2026):** script + storyboard -> **animatic** (whole video through `build.py` with `"voice_mode": "kokoro"`, Kokoro at natural speed, real layouts, simple motion, captions, 720p) that Sam watches and edits -> script locked and fact-check passed -> **clip by clip in Sam's clone through `toolkit/build/build.py`** (`"voice_mode": "scene"`; voice -> align -> mix -> pace lint -> render -> frame check -> deliver; voice clip N+1 while Sam reviews clip N) -> join the approved clips. `v2.py` and `run.py` are legacy (Tokens, LongChat).
- **Music:** none in the money series pilot; any music is Sam's pick from a sampler heard under the narration. **Sound effects** are allowed: at most 8 per minute, each tied to an on-screen action.
- **Pacing and captions** (`gj581g-scene-quality` wins): every line tagged `treatment` + `changes`; `pace_lint.py` must pass (a picture change at least every 6 s, no treatment over 20 s); captions show at most 8 words at a time.
- **No silent holds** except in a video essay (S7 as the base style): storyboard `hold` is 0; only the natural gaps between sentences remain (a try-it window with a moving countdown is not a hold). Big moments land through the words and the picture.
- **Decorative montage** may set mood between evidence shots; evidence shots still show the thing itself, honestly labelled.
- **Platform clips** (YouTube, TikTok, Instagram) for commentary only: the clip the video is talking about, at most 10-15 s, shown as itself with the creator's handle on screen and a credit in the description, never b-roll, never a large share of the video. News, broadcast and sports clips stay banned. **Game, app and website screenshots** under a creator policy, an open licence, or for commentary on that game or site; never decorative.
- **Ending:** a short "Next time" end card that names the next video (no subscribe ask), with the YouTube end-screen element in the top-right quarter.

Since October 2026 the channel's videos are rendered directly as MP4 with **Remotion** (React), not exported from PowerPoint; the user compared a Remotion pilot with the PowerPoint version and chose Remotion. **The look is decided per video** (since 31 Oct 2026): `decked-out-styles` writes each video's creative direction. This skill turns that direction into scenes and renders them. It owns the engine, its components and the render, plus reference specs for styles that need their own engine (the investigation board, S2). Build a .pptx (`decked-out-deck-builder`) only when the user asks for a deck.

The older data files still say "slide" (`slides.json`, `S<n>`, `VO-NN` per slide). Read every slide as **one scene** on the timeline. Newer projects keep one entry per narration line grouped by `scene`, with `timing.json` from the build.

**You decide the visuals.** The user's standing instruction (Oct 2026): Claude decides which graphics, images and videos go where in each video and when to use them, as creative director. Follow the creative direction, and choose each scene's exact treatment yourself. Don't ask the user to pick visuals (one exception: a chart look outside dot-matrix, icon arrays or the series' own chart style goes to Sam). Show the result (the animatic, then clips) and change it if they react. Voice and music are different: those go to Sam as A/B samplers.

Owners, one per decision:
- `decked-out-styles`: the creative direction, including the **palette, colour meanings, fonts and look** (identity sheet), and the single project log in `STYLE_LIBRARY.md`.
- `decked-out-research-story`: the storyboard and voiceovers, and the independent fact-check.
- `decked-out-deck-builder`: the narration audio (Sam's voice profile; Kokoro for the animatic), and the clean-facts rules, which apply here unchanged.
- `decked-out-media`: sourcing, licensing and preparing footage, photos, Manim and other clips, music candidates and samplers, montage and commentary clips, parallax layers, split-screen halves and riso versions (prepared files go into `public/`), and the media library.
- `decked-out-youtube-packaging`: titles, thumbnails (in the video's identity) and the description; add the captions .srt to the upload.
- `gj581g-voice-music-montage`: the voice, music and sound-effect rules and the montage rhythm.
- `gj581g-scene-quality`: drawing, layout, pacing, captions, thumbnails and render checks.
- `gj581g-producer`: the board, the workflow and the build.

Remotion is free for individuals and companies of up to 3 people (the user qualifies); mention it if that ever changes.

## The animatic (every new video, from 2 Nov 2026)
Sam edits the script best while watching it play out. After the storyboard exists:
1. Write the scenes from the storyboard script (the Kokoro voice in step 2 gives `timing.json`), and build them with the real layouts and simple motion (no polish yet), captions on.
2. Build it with `build.py project.json` with `"voice_mode": "kokoro"` (Kokoro at natural speed straight to `vo.wav` + `timing.json`, no clone, no fact-check needed) and `"render_scale": 0.6667` for a 720p draft; the build runs mix, pace lint, render, frame check and deliver as usual. Label facts the fact-check hasn't cleared "draft". For the final clips, switch the same `project.json` to `"voice_mode": "scene"`, remove `render_scale` and add the fact-check (below).
3. Send it with the script-review file; apply Sam's edits (add, cut, move, reword); re-render; repeat until he is happy and the fact-check has passed. Then the script is locked.

## Clip-by-clip review (the user's workflow since 1 Nov 2026)
The user prefers to judge the video in **short clips** rather than review sheets or a full render: "analyze things in short clips, that is much better than looking at the entire video at once." So, once the script is locked:
1. Split the video into clips of about 60-100 s (one or two chapters each; `clip A, B, C...`), each with its own `project.json` (or a clip filter) for `toolkit/build/build.py`, with `"voice_mode": "scene"` and `"factcheck": "<the passed CSV>"` (the build refuses clone voicing without it). Run the build for a clip, look at `build/frames_sheet.png` and the frames the narration names, and **send it as soon as it is done** (SendUserFile with a one-line caption; a bullet list of what each scene shows and what changed). Voice the next clip while he watches (never voice while a render runs).
2. He replies with a numbered list of notes per clip. Fix exactly those, re-run the build for that clip (`build.py project.json --lines <scene ...>` to re-voice, `--from mix` when music or sound cues changed, `--from render` for picture-only fixes), and send it again with a note saying what changed. Treat a note about one scene as a rule for similar scenes, and add a line to `toolkit/LESSONS.md` when it reveals a new kind of mistake.
3. Keep every clip's MP4 and a laptop copy under 30 MB in `projects\<Topic>_v<N>\` on his computer (the build's deliver stage shrinks it). The full video is joined only when every clip is approved.
4. **The build (`toolkit/build/build.py project.json`)** runs voice (scene mode, word check, `must`, `tight`, speaker check, re-rolls; one process per scene; refused without the fact-check) -> align (`timing.json` with per-word times) -> mix (narration at -16 LUFS, music only if chosen, sound cues) -> pace lint -> render (silent Remotion render + mux) -> frame check (one frame per line end, loudness) -> deliver (laptop copy). It is resumable (`--from`, `--only`, `--lines`, `SEED_OFFSET`), writes `build/status.json` and `build/build.log`, and refuses to start while another voice or render job runs. It runs only the pace lint; run `scene_lint.py` and `cue_lint.py` yourself. Stop it before render when a scene needs re-voicing, so no render is wasted.
5. **Legacy clip workflow (Tokens, LongChat only):** `toolkit/tts/v2.py voice/accept/lint/clip/join` with `tts/clips.json`, `comp`/`wkey` keys for renumbered scenes, `assemble.sh` for the mix. Keep it only to rebuild those videos.
6. Environment: Chatterbox and faster-whisper live in the `cbx` venv (`/home/claude/cbx/bin/python3`); the build calls it itself. Plain `python3` has neither, so a `ModuleNotFoundError: soundfile` means the wrong interpreter, not a lost install.

Stills before every clip render: the build's frame sheet plus stills of the busiest moment of each new or changed scene (`npx remotion still ... --frame=<n> --scale=0.5`, tiled with PIL), checked for overlaps, text under the caption band, labels colliding with marks, centred text pushed off its card, a source line hidden behind content, captions running off the frame. Fix and re-still before rendering. Don't render stills while a render is running.

**Joining clips:** never `-f concat` files that were encoded with different settings. Re-encode them together with the `concat` filter first, or re-render the whole clip; splice by frame count (`-frames:v`), not by `select`.

## Components (any style)
The engine's components work in any direction, drawn in the video's identity (palette, fonts, line style):
- **Full-screen:** `Footage` (tinted, content on top; also places Manim, Blender and other prepared clips untinted), `BigNumber`, `WordCard`, `TextBehind`, `Split`, `MapZoom` and event diagrams, `DotMap`, `ArchiveFrame`, `LabelledPhoto`, `TitleCard`, `Panel dark`.
- **Data:** `People`, `Dots`, `CountUp`, `DotColumns`, `DotBars`, `DotLegend`.
- **Paper and evidence:** `PaperSheet` (snip with a highlighter sweeping line by line as the narrator reaches it: `snip=<key> hlAt=cue(...)`), `Profile`, `SourceCard`, Pill tags.
- **Structure:** `ChapterMap`, `Suspects`, `Scorecard`, `Tint`, `VidPanel`, and the **"Next time" end card** (V37 in the Tokens project: the next video's title written on, a NEXT stamp, the top-right quarter kept clear for YouTube's end-screen element).
- **Commentary and montage:** a framed commentary clip (untinted, with the creator's handle, platform and date on screen), and montage runs (cut sequences of decorative clips, 2-4 s each, cut on the phrase, graded to the identity sheet, never with a number or event label on them).
- **3D:** light 3D with `@remotion/three` for objects, depth and simple 3D diagrams; Blender clips are rendered beforehand and placed like footage. Charts with numbers stay flat.
When a direction needs a component that doesn't exist, build it in `scenes_custom.jsx` (or the series template) first, then move it into the engine and write it back to the toolkit. The creative direction's build budget limits this to one major new build per video, with a pilot first.

### The S8 Banknote template (The Dollar Yardstick, 2 Nov 2026)
`toolkit/remotion/templates/s8_banknote`: `bank.jsx` (security-paper `Ground` with drift, `NoteFrame`, guilloché `Portrait` clipping a Folk character, graded footage `Window`, `Stamp` with an optional paper background over footage, `Typed`, `T` whose alignment and motion transforms compose, `Captions` paged at 8 words, cue helpers `t0(id)` and `tw(id, word, k)` on aligned word times), `pilot.jsx` (eight reference scenes: pay slips, mini notes, hatched bars with counters, a footage window, a typographic card, a stacked real-vs-prices bar, a title note), `tools/mix.py`, `sfx/make_sfx.py` (the synthesised sound set). Folk characters and the identity stills are in `kits/folk_banknote/`. Fonts: Fraunces, Oswald, Inter, JetBrains Mono.

### The hand-drawn kit, S3 (built for Tokens, Nov 2026; toolkit 2.1)
`src/draw.jsx`: `rng` (seeded), `wob`, `rectPath`, `ellPath`, `linePath`, `Sheet`, `Ink` (a stroke that draws on over `dur` s; `fill`/`fillAt`, `out`, `dash`), `Hand` (hand-written text that writes on left to right; 0.08 s + 0.032 s per character, capped at 0.8 s), `Mono`, `Stamp`, `PopG`, `Page` and `Figure`. Scene-level pieces in `scenes_custom.jsx`, ready to reuse: `Person`, `ChipArt`, `Meter`, `ChapterMap`, `Courier`, `Chips`, `PriceCard`, `Engine`, `Odometer`, `Tag`, `Clock`, `Squares`, `Receipt`, `IdeaIcons`, `TwoTone` (one centred line in two colours; never two separate `Hand`s) and `Laptop`. The template `toolkit/remotion/templates/s3_handdrawn` packages the kit with `Hero` (Open Peeps), `DeskRoom`, `Paper`, `Sticky`, `Gauge2`. Conventions: source lines top-left (`Src`, y 44) and honesty labels top-right (`Label`); nothing in the caption band below y about 980; "Illustration" / "Schematic" / "Illustrative character" labels on anything not measured; one idea per scene.

**Channel conventions (any style):**
- **Charts:** dot-matrix squares by default (`DotColumns`, `DotBars`, `DotMap`, `DotLegend`, `Dots`), with **people icon arrays** allowed alongside, or the series' own chart style (S8: evenly hatched engraved bars, allowed by the clean-facts exception). Say the unit in a small note. No 3D, gradients or shadows on data. Bins and values come from the source map.
- **Big numbers** (`BigNumber`), for the 2-4 most important numbers, never two in a row; the number and label exactly as in the source map, with the everyday comparison.
- **Words behind a cut-out subject** (`TextBehind`), once or twice per video at chapter starts or a key word, when the direction uses photos.
- **Labelled photos:** labels say only what the source supports.
- **Archive footage as archive** (`ArchiveFrame` or a small framed screen) with its year and honest caption, never tinted full-bleed.
- **Small source cards** (`SourceCard`) when a study is first named, for about 4.5 s; the source line stays in the corner.
- **Risograph prints, used sparingly** (the user's balance rule, Oct 2026): at most 2-4 riso moments in a video, never more than about one in five of its photo and footage moments, never two in a row, never next to a big number. Never riso data, snips, evidence, source cards, commentary clips or archive frames.
- **Second voice:** the Heckler (`gj581g-voice-music-montage` 0b); her lines are never captioned. `{viewer: ...}` lines exist only in legacy projects.
- **Captions on every scene:** at most 8 words on screen at a time, each word lighting up on its aligned time, *stressed* words in the Callout; word cards too (captions run on every scene). Keep important content above the caption band. `make_srt.py` writes the same captions for YouTube.
- **Illustrations of real events** are labelled "Illustration based on <source>; not to scale"; characters are labelled as illustrative where they could be mistaken for real people.
- **No silent holds** (Sam, 1 Nov 2026): `hold` is 0. Only a video essay (S7 base) may hold 1-3 s.
- **Music:** only Sam's pick from a sampler, at least 12 dB under the voice while he speaks (a bed of about -24 LUFS, sidechain-ducked), 1-2 s fades at cue changes. **Sound effects:** each placed at the frame of its on-screen action (in the project's mix cue list), at most 8 per minute.

## How to choose (scene by scene, inside the direction)
- Read each line's narration, `treatment`, `changes` and media line, then pick the exact treatment that shows what the sentence says: a number to remember gets a chart or a big number; a share of people gets `People`; a place gets a map; a study named for the first time gets a paper profile and a source card; a mechanism that must move gets a moving diagram, Manim or 3D; a real-world moment gets footage; a mood between facts may get a montage run; a clip the narration is discussing gets the commentary frame.
- Keep to the direction's identity sheet and its through-line.
- The pace lint must pass: a picture change at least every 6 s (aim 3-4 s in explainers), no treatment over 20 s, no empty card while the narration runs. Motion by default; a static frame only with the reason in the storyboard, and even then with a slow drift or a cued highlight.
- Count the riso moments (2-4 at most).
- Write one line per scene in the media plan (what and why), so the choices can be reviewed. The user reviews results, not menus.

## Style reference: the investigation board (S2)
Use this when the creative direction chooses the board. The whole video, or one part of it, takes place on one investigation board, a paper collage that the camera moves across. Research papers slide onto it and get highlighted. Photos are pinned up as prints, and index cards, sticky notes and chart cards land as the narrator names them. Marker strokes circle the key line, and red thread links evidence across chapters. At real-world moments the camera dives into a pinned photo or a small screen, and the video goes full-screen documentary (tinted footage with content on top), then pulls back out.

- **One board per video, filling up as the story goes.** The board is a large canvas, by default 7680 x 4320 board px, i.e. 4 x 4 screens at 1080p. It is laid out in **chapter columns from left to right**: cold open, basics, each research chapter, the answer. The **theory suspects** run along the top row. Items stay pinned once they land, so a pull-back to the whole board shows the story so far.
- **The chapter map is the board overview.** At every chapter start the camera pulls back to show the whole board (or most of it). The chapter question cards along the top of each column are the chapter map: past chapters are dimmed with a marker strike-through, and the current one gets a marker circle. The hidden twist chapter is a **sealed envelope** that opens on its cue. Then the camera pushes into the current column.
- **The camera always moves.** Each scene has a camera target (x, y, zoom, small rotation). Moves take 0.6-1.2 s, are eased, and start at the scene start so they land as the narration begins (+0.2 s). During a scene the camera drifts slowly (a 2-3% zoom or a few px of pan), so the board never freezes.
- **Leaving the board.** Real-world moments, the biggest numbers, word cards, maps, split screens and Manim animations are **full-screen scenes off the board**, reached by diving into a pinned print or screen (0.6-0.9 s), by a hard cut on a spoken word, or by a 0.5 s crossfade. Never stay on the board more than about 45 s without a full-screen moment; aim for about 50-65% of the runtime on the board and 35-50% full-screen.
- **Honest, not gimmicky.** No fake case numbers, "classified" stamps, crime-scene tape or police imagery. Stamps only state evidence.

**Sets** (the board's surface, paper, props and fonts; the palette comes from the identity sheet):

| Set | Surface and props | Fonts (typed / marker / data) | Footage look | Suits |
|---|---|---|---|---|
| Corkboard | cork, push pins, red thread, typed index cards, sticky notes | Special Elite / Permanent Marker / Inter | warm, grain 8 | psychology, mysteries, "why do people..." |
| Lab bench | green cutting mat or graph paper, binder clips, masking tape, specimen labels | IBM Plex Mono / Kalam / IBM Plex Sans | cool | science, health, medicine |
| Newsroom desk (1960s) | desk blotter, carbon copies, own-typeset clippings, paper clips | Courier Prime / Caveat / Inter | sepia or faded, grain 12, vignette | history, the economics of the past |
| Drafting table | blueprint or tracing paper, drafting tape, rulers, pencil marks | IBM Plex Mono / Kalam / IBM Plex Sans | none or cool | cities, housing, engineering, energy |
| Kitchen table | wood grain, receipts, sticky notes, a mug ring | Courier Prime / Caveat / Inter | warm | personal finance, prices, everyday economics |
| Ledger desk | green ledger paper, rubber bands, adding-machine tape | IBM Plex Mono / Kalam / Inter | none | markets, money, accounting, companies |
| Chalkboard | slate, chalk strokes instead of marker, pinned paper on clips | Courier Prime / Kalam (chalk colour) / Inter | bw or faded | maths, logic, big ideas |
| Light table | backlit white glass, film sheets, grease pencil | IBM Plex Mono / Kalam / IBM Plex Sans | cool | medical imaging, photography, perception |
All these fonts have open licences (OFL or Apache 2.0); ship them as files in `public/fonts/` and list them in `FONT_FILES`. The board texture comes from the media skill.

**Clean facts on the board:**
- Anything the viewer must read (chart cards, snips, numbers, source cards) is shown **flat and square to the camera**: item rotation at most 1°, camera rotation 0, and the item filling at least about 55% of the frame width while it is read. Decorative items may tilt up to about 6°.
- Numbers are always in the data or typed font, never in a marker or chalk font. Marker is only for annotations of at most 4 words.
- No thread, pin, tape, stamp, marker stroke or texture crosses a value, a label or a snip line.
- Stamps say only what the theory table and the source map support: REPLICATED, FAILED TO REPLICATE, PREPRINT, SMALL SAMPLE, STRONG / PARTIAL / WEAK / NO EVIDENCE (from the 0-3 scores), CORRECTED.
- Real screenshots stay what they are: a credited small clipping, never "aged" or restyled.

**Board items:** `PaperSheet`, `Folder`, `IndexCard`, `Sticky`, `Print`, `Screen`, `ChartCard`, `Clipping`, `Envelope`. Props and marks drawn in code (SVG): `Pin`, `Tape`, `Clip`, `Thread` (red string with a slight sag, drawn along its length on cue), `Mark` (circle, underline, arrow, cross-out, tick, bracket; drawn on in 0.4-0.8 s on the spoken word), `Stamp`.

**Board treatments by layout:** title (pull back across the empty board while the title is typed onto a card, then push to the cold-open column); hook about a real event (full-screen `MapZoom` and an event diagram, then its print pinned in the cold-open column); `map` (the board overview); `pin-up` (push into the column, cards and prints landing one per beat); `paper-profile` (`Folder` opens, `SourceCard` clipped on); `quote-panel` (`PaperSheet` close-up with the highlighter, then a marker bracket); charts (a flat `ChartCard`, squares filling on their cues; a regional number goes full-screen as a `DotMap`); `big-number` and real-world moments (dive into the print that echoes it, then full-screen); `media-panel`; `archive`; two conditions (two prints side by side, then a dive into `Split`); `hypotheses` (suspect cards along the top row); `string-link` (pull back to show both items and draw the thread on the linking word); `stamp` (push in and stamp on the verdict word); `scorecard` (pull back over the suspect row, stamps in the narrator's order, the winner circled, then the row reordered by rank); `does-doesnt`; `word-card` (full-screen over a slow tinted clip); a mechanism that must move (dive into a full-screen Manim clip). Set-ups get a small marker flag, and their payoff draws the thread back.

### The board engine (build it when a direction first uses the board; toolkit 3.0)
Toolkit 2.0 renders the full-screen components only. The first video whose direction uses the board builds these (it is that video's major new build), tests them on a pilot, and writes them back as toolkit 3.0:
1. **`src/board.jsx`**: `Board` (one persistent layer holding the set's baked texture and every item whose landing time has passed; off-view items culled), `Camera` (interpolates per-scene targets with easing and adds the drift), the items and props above, plus `Portal` and `PortalOut`; one shadow style per item size, static, never an animated filter.
2. **`sets/<set>.json`**: texture file, fonts, prop colours and paper stock per set, with the palette roles filled in from the identity sheet.
3. **`Video.jsx`**: scenes with `cam: 'offboard'` render full-screen; on-board scenes render inside the shared `Board` and `Camera`. Crossfades only between off-board scenes, portals and cuts elsewhere.
4. **`story/handoff.py`**: pass the board fields into `slides.json` and check them (45 s rule, links and stamps name existing items, every theory has a stamp by the scorecard).
5. **`gen_scenes.py`**: lay out the chapter columns and the suspect row; write camera targets per scene; emit board items, threads and stamps cued with `snapCue`; add `board_layout.png` for review.
6. **`review_sheet.py`**: add a board-overview still per chapter to the review sheets.

### Pilots (a new look or a major new build)
When a new series or look starts, or the creative direction needs a major new build (the board engine, a character kit, a Blender pipeline, the S6 sheet components, the S7 montage cards), render a 45-60 s pilot before the animatic, and send it to the user. A pilot may use Sam's clone only after its own lines are fact-checked (or its figures are labelled "pending"), recorded as `"factcheck_waiver"` in `project.json`; otherwise it uses Kokoro (`"voice_mode": "kokoro"`). Use the real project's first scenes when they exist (the Raise pilot was the money series' cold open: S8 Banknote, Folk characters, the build, Sam's voice profile, its claims checked first); otherwise a scratch copy of an existing project. Show the new style's key moves. Change it on the user's reactions (expect two to four rounds; his notes come as a numbered list), record each note in `LESSONS.md` when it reveals a mistake, then proceed to the animatic, and add the pilot stills to `styles\samples\`.

## Manim animations (added 31 Oct 2026, the user's choice)
**Manim** (Manim Community, MIT licence; the engine behind 3Blue1Brown) is the channel's tool for moments where a mechanism, equation, graph or probability has to *move* to be understood. It renders a clip that the scenes place full-screen like footage.
- **How often:** as the creative direction's difficulty map calls for it; typically 1-2 per video. Never two in a row, and never for something a still chart shows just as well. Record each one and why in the media plan.
- **Style, so it looks like the same video:** background in the video's base colour (with the paper texture faintly behind when the direction uses paper); the video's palette for every colour; the video's data font via `Text(..., font=...)`; `MathTex` only for formulas; flat, clean shapes, no neon glow, no default Manim blue; charts follow the chart conventions; numbers come from the source map, and schematic animations carry a small "Schematic" label.
- **Timed to the voice:** the Manim script reads the scene's cue times from the aligned word times (`toolkit/graphics/manim/cues.py`, or the line-level `timing.json`) and uses `self.wait()` between animations, so every step lands on its spoken word. The clip runs the scene length + 1 s, starts on a complete, steady frame and ends on a held frame.
- **Render:** `manim render -r 1920,1080 --fps 30 --format mp4 -o <name> scene.py <Class>`. Install in the cloud with `pip install manim --break-system-packages` (needs `libcairo2-dev`, `libpango1.0-dev` and `ffmpeg`), plus a small LaTeX only if the video uses `MathTex`. Run the clip through the media skill's smooth-playback checks, add it to `media/prepared/manifest.json` untinted, and place it with `Footage src=...`.
- **Toolkit 3.1:** the first video that uses Manim adds `toolkit/graphics/manim/` (`base.py`, `cues.py`, one example scene) and writes it back to the toolkit.

## Toolkit
Use the user's toolkit (master copy: the GitHub repo `samarthjn29-cmyk/gj581g-toolkit`; working copy `G:\My Drive\Decked out Data\toolkit`). Read `toolkit/README.md`, `toolkit/LESSONS.md` and `toolkit/remotion/README_remotion.md`. The engine is `toolkit/remotion/`; templates `templates/s3_handdrawn` and `templates/s8_banknote`; the build `toolkit/build/build.py` (modes `kokoro`, `scene`, `line`). The worked examples are `toolkit/examples/blindness_remotion/` (S1, footage), `projects/Tokens_v1/Tokens_remotion/` (S3, "Next time" card) and the Raise pilot in `templates/s8_banknote` (S8, scene-mode voice, build). Copy, don't rewrite. When you improve the engine, commit and push it to the repo, copy it to the folder on G:, and bump the README version line.

## Legacy pipeline: run.py (older projects)
`python3 toolkit/run.py video.json <stage | a:b | all>` ran the older pipeline (story, factcheck, voice, retime, media, setup, words, assets, gen, sections, review, srt, package, render) with gates: voice refuses until the fact-check passed; words stops on a timing MISMATCH; render refuses while any TODO box remains. Its Kokoro speed setting is 1.0 now (never sped up). New videos use `build.py`; the `gen`, `review`, `srt` and `package` stages remain useful for S1-S3 engine projects.

## Inputs
- `<Topic>_creative_direction.md`: the difficulty map, identity sheet, through-line, scene flow, music plan (if any) and budgets.
- The line-level script with `treatment`, `changes`, `say`, `must`, `tight`, and `timing.json` from the build (or, for older projects, `story/slides.json` after retiming). Never invent content or numbers.
- The fact-check CSV (`story/<Prefix>_factcheck.csv`), every verdict OK, before any clone voicing.
- The voice: Sam's profile `voice_sample\sam_voice_v1` (staged from G:), or Kokoro for the animatic.
- From the media skill: prepared clips (`media/prepared/*.mp4`, with `manifest.json`), Manim and other rendered clips, photos, parallax pairs and riso versions, music (only Sam's pick), commentary clips, sound effects, and the board texture and prints for board videos. Snips (`snips/<key>_plain.png`, `t_<key>.png`).

## Set up the project
1. Copy the series template (`templates/s8_banknote`, `templates/s3_handdrawn`) or `toolkit/remotion/` to `<Topic>_remotion/`. Install with `npm install` (the workspace proxy is pre-configured; if it isn't: `npm install --proxy "$HTTPS_PROXY" --https-proxy "$HTTPS_PROXY" --cafile /root/.ccr/ca-bundle.crt`). Chromium and Playwright are pre-installed; Remotion downloads its own headless Chrome when needed.
2. `public/`: prepared and rendered clips, photos, the video's fonts as files in `fonts/` (open licences only; loaded with `FontFace` in the template or `FONT_FILES` in lib.jsx), `snips/`, textures, `grain0.png`, and the board texture for board videos.
3. `src/data/`: `timing.json` (from the build) or `slides.json`, `snips.json` and `words.json` (older engine). Set the palette from the identity sheet.
4. Write `project.json` for the build (script, voice_mode `kokoro` + `render_scale` 0.6667 for the animatic, then `scene` with voice_ref = the profile folder and `factcheck` = the passed CSV for the clips; takes, vo, timing, remotion, composition, mix, sfx, mix_out, out).

## Word timings (every build is cued to the voice)
- **Clone, scene mode (new projects):** the build's align stage (`tts/assemble_scenes.py`) writes `timing.json` with each line's start/end and per-word times; S8 scenes cue with `tw(id, 'word', k)`, captions and sound effects read the same times. Never cue on estimated times after clone voicing (the Raise v1 numbers landed late).
- **Kokoro (animatic):** `build.py` with `"voice_mode": "kokoro"` runs `tts/kokoro_lines.py`, which writes `timing.json` with each line's start/end (no per-word times; cues and captions estimate word times inside each line, which is fine for a draft). Older engine projects: `KOKORO_DIR=<dl> SPEED=1.0 python3 toolkit/tts/align.py story/slides.json tts/vo <voice_id> src/data/words.json`. A MISMATCH means the clip was edited after synthesis: find the speech islands with `silencedetect`, shift each segment's words to its island, and save the fix in the `words_override` file.
- **Legacy clone (Tokens, LongChat):** `toolkit/tts/align_whisper.py` into `words.json`.

In the older engine, `cue(n, 'word', k)` returns the scene-relative second at which the k-th 'word' is spoken in VO-n (exact match first, then prefix); `snapCue(n, t)` moves a planned time to the nearest spoken word start. **Time every reveal, mark, camera move, count-up, montage cut, highlight and sound effect to a spoken word.** An unknown cue word stops the render with an error; when a line is rewritten, update its cue words in the same edit, and run the lints before any render.

## Write the scenes
Older engine: `run.py gen` (`remotion/gen_scenes.py`) writes `src/scenes_gen.jsx` with a working scene `S<n>` for every scene, timed with `snapCue`; chapter maps, word cards, the title, suspects, scorecard and full-screen clips come out finished. Copy a scene into `src/scenes_custom.jsx` (it always wins over the generated one) and replace its TODO boxes with real content, cueing every reveal with `cue()`. Never edit `scenes_gen.jsx`. Template projects (S8): write scenes in the project's scene file with the template's components, one component per `scene`, timed with `t0`/`tw`. Full-screen scenes in the older engine are laid out in inches on the 13.333 x 7.5 grid inside `<Stage>`; S3 and S8 scenes in 1920x1080 px. Board items use board px.

## Review sheet (only when the user asks for sheets instead of clips)
`run.py review` renders one still per scene at 85% of its length in one bundle (`review.mjs`), plus a board overview per chapter for board videos; `review_sheet.py` lays them out as `out/<Prefix>_review_N.png`, 12 scenes per sheet. Before sending, run the creative checks in `decked-out-styles` section 4 and fix what they find. Since Nov 2026 the user prefers the animatic and the clip-by-clip review.

## QA (required before rendering everything)
1. Stills: the build's frame sheet plus `./stills.sh <name> <frames...>` or `npx remotion still` contact sheets. Check every scene at about 85% of its length and at the moments the narration names (numbers landing, stamps, footage).
   - Fix overlaps, tiny text, labels colliding, centred text off its card, anything under the caption band, captions running off the frame.
   - Readable items must be flat and big enough at phone size; footage readable (sharp segment, light grade).
   - Nothing decorative may cross data.
   - For board videos, check that the overview reads and nothing jumps when the camera arrives.
   - In Manim, 3D and other rendered clips, check the colours, fonts and background match the identity sheet and every step lands on its word.
   - On the "Next time" card, the top-right quarter is clear for the end-screen element.
   Don't run stills while a render is running.
2. Numbers and words against the fact-checked source map: charts, big numbers, map bins, source cards, labels in animations and any evidence marks. Snippet text exactly as in the storyboard, every chart states its unit, riso moments within the balance rule, no number or event label on a decorative montage clip, every commentary clip shows its handle and date, and no fact on screen that the fact-check hasn't passed.
3. After a render:
   - Video and audio lengths equal the timeline.
   - No gap in the narration over about 1 s outside a try-it window or a video essay (`silencedetect=n=-35dB:d=0.8`).
   - The voice at about -16 LUFS integrated; music (if any) at least about 12 dB under the voice while he speaks; sound effects at most 8 per minute (the pace lint).
   - `freezedetect=n=0.0003:d=1` finds no frozen footage (deliberate static frames with a written reason excepted).
   - Pull frames at the start of each scene and across each transition.

## Render
**In the cloud workspace through the build** (2 cores, 8 GB; S8 renders a 60 s clip in about 9 minutes at 1080p): `build.py project.json` renders the composition silent (`--crf=18`, plus `--scale` when `render_scale` is set), muxes the mixed audio, checks frames and loudness, and makes the laptop copy. Run it with the tool's background mode and a monitor on `build/build.log` that also matches failures. Never run two Remotion renders at once, and never voice and render at the same time (memory, exit 137). `pgrep -f` matches its own command line and `pkill -f <pattern>` kills a shell whose command line contains the pattern; kill by PID.

**On the user's laptop (older-engine projects, or a full re-render Sam asks for; new videos join the approved build clips instead, so the final matches what he approved):**
1. Package the project: `render.bat`, `README.txt`, the captions .srt, and `<Topic>_partN.zip` zips under 30 MB each (`run.py package` builds this for older-engine projects).
2. Save the package with `device_commit_files` to `G:\My Drive\Decked out Data\projects\<Topic>_v<N>\remotion`.
3. Test the package here first: unpack it into a clean folder, then render stills of four scenes and a short clip with audio.
`render.bat` checks Node.js, unpacks the zips with Windows `tar`, runs `npm install` once, and renders `out\<Topic>_final.mp4`. Variants: `render.bat draft` (720p), `render.bat section 3`, `render.bat studio`. When the session has the device shell, run it yourself; otherwise tell the user to double-click `render.bat`. Never delete files on the laptop without the user's permission. A `render.sh` for the brother's Mac is still to do.

**Older-engine cloud renders:** `render_chunks.sh [sections]` renders the sections in `sections.txt` (one process each, `--offthreadvideo-cache-size-in-bytes=400000000`; a single long render was killed at 4.5 GB), then the narration mix and `assemble.sh` join the sections with grain and audio. To fix a few seconds, render just those frames and splice them in (re-encode with the `concat` filter).

**Speed rules:**
- No `backdrop-filter`. CSS `blur()`/`grayscale()` only during entrances, or on footage where the grade needs it (S8 `Window`).
- Bake constant looks into the files: ffmpeg `hue=s=0`, a pre-blurred parallax background, riso prints made before the render, textures as one JPEG. Never apply them as live effects when a baked file would do.
- Grain in the browser is fine for S8 (a moving tiled PNG); for heavy engines add it with ffmpeg.
- Manim and Blender clips are rendered before the Remotion render, never inside it. Keep `@remotion/three` scenes light.
- `DotMap` rasterises once per scene (useMemo); keep `cols` at or under about 120.
- Board: cull off-screen items, keep shadows static, render images at the size they're seen, and move the camera with one CSS transform on the board layer.

## Studying a reference video
Use `decked-out-styles` section 1: it holds the tested capture method and the analysis template.

## Deliver
- The clips (and finally `<Topic>_final.mp4`, joined from the approved clips), `<Topic>_captions.srt` (YouTube: Subtitles > Upload file > With timing), and the project package on the laptop for long renders.
- Tell the user in plain words what changed visually, what was checked (sync, frames, loudness, sound-effect count), and the render time.
- Record the project in the project log in `styles\STYLE_LIBRARY.md`, follow the styles skill's "After the video" steps, update the board, and add new lessons to `toolkit/LESSONS.md`.
- Add every newly vetted clip, photo, music track and sound effect to the media library (`toolkit/media/library.py seed media/licence_log.csv --project <Prefix>`) and save `toolkit/media/library.json` back with the toolkit.

## Editing
Change the scene code or the data, check stills of the changed scenes, then re-run the build for the affected clip: `build.py project.json --from render` for picture-only changes, `--from mix` when music or sound cues changed, `--lines <scene ...>` (with `SEED_OFFSET=<n>` for fresh takes) when narration changes. Rewording a line also means updating its `changes`, `must`, cue words and the fact-check row (the row must read OK again before re-voicing). For board videos, an item moved on the board can change later overviews, so re-check the overview stills after it. A retimed scene with a Manim clip needs the clip re-rendered from the new cue times. Join only when every clip is approved; legacy projects use `v2.py voice/accept/clip/join`.