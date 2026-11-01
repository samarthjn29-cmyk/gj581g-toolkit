# Remotion video engine (toolkit 2.0)

Renders a Decked out Data video directly as an MP4 (React + Remotion), instead of a PowerPoint deck. Narration, footage,
builds and transitions share one frame-accurate timeline, so nothing can drift. First used for Blindness v6 (Oct 2026).
Remotion is free for individuals and companies of up to 3 people.

## Project layout
```
<Project>_remotion/
  package.json            exact versions (remotion 4.0.524, react 18.3.1, d3-geo, topojson-client, us-atlas, world-atlas)
  sections.txt            section -> slides -> frame range (re-render only what changed)
  src/index.jsx           Composition id `Video` (1920x1080, 30 fps, defaultProps {grain: true})
  src/Video.jsx           timeline: one Sequence per slide from slides.json, 0.5 s crossfade, VO-NN.mp3 at +0.2 s, grain, captions
  src/lib.jsx             engine (below)          src/captions.jsx   burnt-in captions      src/diagrams.jsx   maps and diagrams
  src/scenes_gen.jsx      written by gen_scenes.py: a working, narration-timed scene S<n> for every slide (never edit)
  src/scenes_custom.jsx   your designed scenes; an S<n> here replaces the generated one (Video.jsx merges GEN then CUSTOM)
  src/layouts.jsx         ChapterMap, WordCard, TitleCard, Profile, Suspects, Scorecard, VidPanel, Tint, Todo (red placeholder)
  gen_scenes.py           slides.json (+ media manifest) -> scenes_gen.jsx; prints the TODO count
  review.mjs, review_sheet.py   one still per scene -> review sheets with narration lines (the approval checkpoint)
  src/data/               slides.json (story/handoff output), words.json (tts/align.py), snips.json (highlight boxes)
  public/                 prepared clips (*.mp4), vo/VO-NN.mp3, fonts/*.otf, snips/*.png, paper.jpg, grid.png, grain0-5.png,
                          <name>_fg.png + <name>_bg.jpg parallax layers
```

## Engine (src/lib.jsx)
- Layout: inches x 144 = px on the 13.333 x 7.5 in slide grid; `T`, `Head` (tracker + word-by-word action title), `Source`, `Brand`, `Note`, `Pill`, `Panel` (dark glass panel on footage with `dark`), `Suspect`.
- **Cues from the voice:** `cue(n, 'word', k)` = slide-relative second when the k-th "word" is spoken in VO-n (needs words.json). Time every build to a spoken word; never to estimates. An unknown cue word stops the render with an error (catches typos).
- Motion: `Reveal` (up, down, left, right, fade, focus = blur-to-sharp, wipe, wipeDown, pop = spring), `Words` (headline word by word), `CountUp` (decimals, thousands separator), `Footage` (full-bleed clip with slow drift).
- **Paper reveals (idea 3):** `PaperSheet` drops the paper's title card and/or verbatim sentence onto the page as a sheet of paper (blur to sharp, slight tilt, slow push-in); `hlAt` sweeps a highlighter over the quote (rectangles per line from snips.json, measured from <key>.png vs <key>_plain.png).
- **People and dot grids (idea 5):** `People` (n figures, `dim` fade at `dimAt`, `mark` eyes or rings at `markAt`, random or end order), `Dots` (fills up to 1,000 dots, e.g. sample sizes), `peopleHeight`.
- **Split screens (idea 9):** `Split left right` with a divider that draws in; prepare half-width clips with ffmpeg (crop 960x1080, keep the native frame rate).
- **Parallax stills (idea 7):** `Parallax name` moves `public/<name>_bg.jpg` and `<name>_fg.png` at different speeds; make the layers with `media/parallax.py photo.jpg public/<name>` (rembg; bake extra blur into the background JPEG).
- **Texture (idea 10):** `PaperBg` (paper fibre + faint grid + vignette) behind white slides, `SHADOW` under panels, `Vignette`, `Grain` (or ffmpeg grain in assemble.sh).
- `Stage` scales the slide layer to 90% so the bottom band stays free for captions.
- **Captions (idea 6, src/captions.jsx):** phrase chunks from words.json; each word lights up as it is spoken, words marked *word* in the script turn coral; word cards are skipped. `make_srt.py out.srt` writes the same captions for YouTube.
- **Maps and diagrams (idea 4, src/diagrams.jsx):** `MapZoom keys=[{t, lon, lat, w}]` (log-space zoom over US states and neighbouring countries, pin + label, highlight a state); `ChaseDiagram` and `RouteDiagram` are Blindness examples of top-down event sketches (label them "Illustration ... not to scale").

## House style (src/house.jsx, toolkit 1.9; from the Maxinomics and Urbanomaly reference videos, Oct 2026)
- `DotColumns` / `DotBars`: every chart is built from equal squares (one square = `unit`; the last square is partly filled for the remainder, so the scale stays exact). Say the unit in a note ("one square = 1 percentage point"). `DotMap` rasterises GeoJSON regions (us-atlas, world-atlas) into square pixels coloured by value bins, sweeping in left to right, with an optional highlighted region; `DotLegend`. With `People` and `Dots` this is the channel's one chart look: use it for every chart.
- `TextBehind name text`: a huge word between the background and the cut-out subject of a parallax pair (`media/parallax.py`), for chapter titles and key words. Stills only.
- `LabelledPhoto src|video labels=[{x, y, dx, dy, text, at}]`: a dot with a pulsing ring on the spot, a leader line that draws, then the label. Label what the narrator points at (where the gorilla was, where they looked, the fight 8 m off the path).
- `ArchiveFrame video year caption`: archive film in a rounded old-screen frame on black, slight sepia and flicker, red year tag, honest caption ("Archive film, New York, 1940 (public domain, Prelinger Archives)").
- `SourceCard at kind date title pub`: a small white card with a Callout edge that pops in for ~4.5 s when a study, report or filing is first named (kind: STUDY, REPORT, FILING, SURVEY).
- `BigNumber video to suffix label source`: a full-screen count-up in huge extruded type over a tinted clip, with a one-line label and the source; for the 2-4 biggest numbers in a video (never two in a row).
- Second "viewer" voice: words from `{viewer: ...}` lines carry `who: 'viewer'` in words.json; captions show them in italic light accent with a dash, and the .srt prefixes them with a dash.

## Commands
Normally run through `toolkit/run.py video.json <stage>` (setup, words, assets, gen, sections, review, srt, package, render); the table shows what each stage runs.

| Step | Command |
|---|---|
| Install (once per project) | `npm install` (cloud workspace: `NO_PROXY= no_proxy= npm install --proxy "$HTTPS_PROXY" --https-proxy "$HTTPS_PROXY" --noproxy "" --cafile /root/.ccr/ca-bundle.crt`) |
| Word timings | `KOKORO_DIR=... SPEED=1.1 python3 tts/align.py story/slides.json tts/vo <voice_id> src/data/words.json` (re-synthesises each segment exactly; checks the rebuilt length against each clip; a clip whose silences were edited by hand reports MISMATCH: shift its segments to the real speech islands) |
| Generate scenes | `python3 gen_scenes.py src/data/slides.json src/scenes_gen.jsx --manifest ../media/prepared/manifest.json` |
| Review sheets | `node review.mjs out/review 0.85 [chromium path]` then `python3 review_sheet.py src/data/slides.json out/review out/<Prefix>_review` |
| Check frames | `./stills.sh name <frame> <frame> ...` -> out/name.png contact sheet (look at every slide near its end, and at entrances) |
| Cloud render (2 cores) | `./render_chunks.sh [sections]`, `DRAFT=1` for 720p, `FORCE=1` to redo a section; then `python3` narration mix to out/narration.wav and `./assemble.sh out/final.mp4` (joins sections, ffmpeg grain, narration) |
| Laptop render (fast) | ship `render.bat` + README + the project as zips under 30 MB; `render.bat` (full), `render.bat draft`, `render.bat section 3`, `render.bat studio` |

## Speed and memory rules (learned on Blindness v6)
- The cloud workspace has 2 cores and 8 GB: about 2 frames a second at 1080p (11 min = about 1 h 50). Render there in sections with `--offthreadvideo-cache-size-in-bytes=400000000`, one process per section; a single long render was killed for memory at 4.5 GB.
- Never run stills while a render runs (they compete for the same 2 cores and memory).
- Avoid per-frame CSS filters: `backdrop-filter` and constant `blur()`/`grayscale()` are expensive; keep blur only during entrances (`p < 1 ? blur : 'none'`) and bake constant looks into the clip or image (ffmpeg `hue=s=0`, blurred background JPEG).
- Grain: in the browser on a fast laptop (`grain: true`), in ffmpeg (`noise=c0s=5:c0f=t+u`) in the cloud.
- Review drafts at 720p (`--scale=0.6667`), final at 1080p CRF 17-18.
- `pgrep -f "remotion render"` inside a wait loop matches its own command line: wait on the output file or the log instead.
