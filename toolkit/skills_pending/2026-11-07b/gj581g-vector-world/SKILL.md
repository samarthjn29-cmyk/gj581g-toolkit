---
name: gj581g-vector-world
description: Use for every GJ 581g video: the vector-animation format built the Emergence way (illustrated worlds, parallax camera, lit scenes, fixed devices), art sourcing and licensing, the Remotion kit, the one-command build, clip review, layout and render checks, captions.
---

# GJ 581g: vector-world videos (the only format, from 7 Nov 2026)

Sam, 7 Nov 2026, after the Emergence channel study (`styles/EMERGENCE_CHANNEL_STUDY.md`): "Going forward we are going to create vector animation videos only." The first pilot was Plato's Cave (`projects\Cave_v1\`, 60 s, 720p draft approved as the pilot).

This skill replaces `decked-out-styles`, `decked-out-media`, `decked-out-video`, `gj581g-scene-quality`, `gj581g-character-story` and the deck part of `decked-out-deck-builder` (7 Nov audit).

The other channel skills:
- **`decked-out-research-story`:** topic, script, fact-check.
- **`gj581g-voice`:** voice, pacing, music, sound.
- **`decked-out-youtube-packaging`:** packaging.
- **`gj581g-producer`:** board and workflow.
- **`gj581g-similar-videos`, `gj581g-peer-watch`, `gj581g-niche-scout`:** research.

## 0. Session basics
- **Toolkit:** clone `samarthjn29-cmyk/gj581g-toolkit` and read `README.md` and `LESSONS.md`. Commit and push every fix with the session's attribution lines.
- **Channel folder:** `G:\My Drive\Decked out Data\`. Each project lives in `projects\<Topic>_v<N>\` with subfolders `story\`, `voice\`, `stills\` and `clips\`.
- **Laptop copies** stay under 30 MB. Write to G: through the device tools; never delete anything on Sam's laptop without his permission.
- **Claude decides the visuals** as creative director and says in one line what was chosen and why. Voice and music go to Sam as samplers.

## 1. On screen: what is allowed
- **Vector illustration only.** Every frame is vector-style illustration. No live footage, stock video, photo montage, riso, PowerPoint, or screenshots of real sites. The one exception is a framed commentary clip Sam asks for: 10-15 s, the handle on screen, a credit in the description.
- **Photos only as flat-tone medallion portraits.** Cut out a statue or a public-domain portrait (Adobe `image_remove_background`), posterise it to 5-6 palette tones, and place it in the `Badge`. Never a living private person.
- **Art sources, in order:**
  1. **Free Adobe Stock vectors.**
     - Call `adobe_mandatory_init` once, then `asset_search` (StockAsset, `contentType: Vector`, `pricing: free`), then `asset_license_and_download_stock` with size -1.
     - Skip items marked `isGenTech` or editorial-only. **If the tool asks for confirmation or shows a price, stop.**
     - The `.ai`/EPS download is a PDF: rasterise with `pdftocairo -png -scale-to-x 3840` under `ulimit -v 2500000`. A Stock SVG renders with `rsvg-convert` (never run rsvg on big `.ai` SVGs).
     - Prefer one contributor per world. Replace any lettering or brands with ours.
  2. **Our own code-drawn shapes:** figures, fire, light, devices, simple props.
  3. **MIT/CC0 icon silhouettes for props and shadow shapes.**
     - Fluent Emoji `Flat` SVGs: clone `microsoft/fluentui-emoji` sparse with `git sparse-checkout set --no-cone "assets/<Name>/*"`, use `assets/<Name>/Flat/*.svg`, and fill them dark with the `sil` filter. Credit: "Props: Fluent Emoji (Microsoft, MIT)".
     - Or `graphics/icons.py <lucide|tabler|phosphor> <hex> ...`.
  4. **Firefly, only for gaps** (Sam signs in himself).
     - Full size, Fast mode off. Run `image_vectorize`, then recolour.
     - Label it "AI-generated illustration". Never as evidence. No real people, logos or known characters.
     - Never crop or cover a watermark.
- **Recolour everything** into the world's palette: `media/recolour_png.py in.png out.png --palette <name> [--keep 0.1] [--cutout 0.86]`.
  - The cutout makes a white opening transparent so it can be relit; it tests chroma, not saturation.
  - Palettes live in `media/recolour_svg.py`: `ember` (cave and fire), `dawn` (outside). Add one per world and check its contrast at phone size.
- **Log every asset** in `media/licence_log.csv`: asset, source or ID, licence, credit line, project, scene. Code-drawn art and synthesised sound get one "original" row each.

## 2. The world, camera and light
- **One rich set per story,** reused for several shots: the camera travels over it instead of cutting. A video has 2-4 sets.
- **Depth layers** (`Layer cam p`):
  - far, p 0.8-0.9: back wall, sky, ceiling band;
  - main plane, p 1: the action;
  - near, p 1.25-1.4: dark jagged silhouettes along the bottom edge only, never ellipses over the action.
- **Camera:** `camAt(keys, t)` eases between `{t, x, y, z}` keys, and `toScreen` maps world to screen.
  - Camera keys land on narration words: `tw(id, 'word', k)` with an explicit k, on the aligned **paced** timing (`timing_b.json`).
  - Keep the frame inside the art; an edge past the image shows bare background.
  - Move closer, to head and shoulders, for emotional beats.
- **Transitions:** a 0.6 s cross-dissolve between sets, a push through a light source into white, or a glare flash. Hard cuts are rare.
- **Light carries the story:** warm firelight inside, cold or white at the turn, red for menace, dawn when the idea resolves.
  - `Dark lights=[...]`: darkness with pools of light.
  - `Glow`: practical sources.
  - `flick(t, seed, amt <= 0.12)`: flicker, never strobing.
  - Rim light on figures on the side facing the light: `Figure rim rimDx`.
  - `Motes` in the light; `Grain` and `Vignette` on every frame.
- **Texture stays quiet:** 10-25% opacity, blurred, flat; never bubbles.
- **Motion everywhere:** something moves in every frame (camera drift, a flame, motes, a figure).
  - **Change rate target:** the picture changes in 80-100% of 2-second steps.
  - Check the draft with a frame-difference pass: the longest still run is at most 3 s, except the end title.

## 3. Characters
- **Small, silhouettes:** characters are small in the frame, mostly silhouettes or seen from behind (`Back`). No lip sync.
- **Poses:** use the `Figure` rig: `POSE.seated`, `stand`, `carry`, `shield`, `climb`, `slump`.
  - Props are held at the front wrist with `hold`.
  - No raised-arm poses that read as rabbit ears.
  - Nobody freezes for more than about 2 s.
  - Walk motion is tied to distance so feet don't slide.
- **Folk II rig** (`kits/folk_banknote/coffee/rig4.jsx`): only for close character scenes.
- **Real people:** shown as a badge (medallion portrait, name, role, place and year) or a labelled silhouette. Never photo-real, never mocked. Their words on screen are sourced quotes; an invented line is marked as a dramatisation.
- **Voices:** never copy a real person's look or voice. Each character voice is synthetic; Sam picks from a sampler (`gj581g-voice`).

## 4. The device system (our own design, fixed across all videos)
- **Chapter mark** (top-left): a Roman numeral in a thin ring, a growing rule, then the title in spaced caps. Component: `Chapter`. A glossary counter can sit under it.
- **Lexicon card** (bottom-left): "LEXICON · 01", the term in Cormorant italic, then a one-line definition. Component: `Lexicon`. The counter runs through the video.
- **Medallion badge** (right side): flat-tone portrait in a gold ring, name in spaced caps, role, then dates in mono. Component: `Badge`.
- **Kind label** (bottom-right, mono caps, on every illustrative frame): "Illustration · after <source>", "Illustrative", "Schematic", "Recreation" or "Source: ...". Component: `Kind`.
- **Date tag:** mono text in a thin frame. Component: `DateTag`.
- **Data on world surfaces:** numbers drawn on a chalkboard, ledger, book or monitor, with a SOURCE line. Simple charts go on a dark side panel with one accent colour.
  - Units stated. No 3D or gradients on data.
  - The narration speaks only the key figure.
- **Meta device:** one per long video where it fits:
  - a video inside a mock page, its timeline in sync with the real one; or
  - the whole video on one 2.5D overhead map where routes are flows.
- **Fonts:** Cormorant Garamond (titles, terms), Inter (body), JetBrains Mono (labels).
- **End screen:** the last 5 s keep the top-right quarter clear.
- **Ending:** the closing question, then the title card. When the next video exists, a short "Next" card names it in the device style.
- **Not copied from Emergence:** their exact look (gold italic tags, monogram badges, their layout), real company logos on buildings, their subscribe outro.

## 5. The kit and the build
- **Kit files** (`toolkit/remotion/kits/vector_world/`):
  - `vw.jsx`: camera, layers, light, devices, `Figure`/`Back`;
  - `cave.jsx`: the reference video, with sets, flames, `sil`, scenes and `CaveStill`;
  - `stills_cave.mjs`: renders many stills from one bundle, `node stills_cave.mjs frames.json 0.5`.
  - New videos copy `cave.jsx` as `<topic>.jsx`. Scenes read the paced timing, copied to `src/data/<topic>_timing.json`.
- **Remotion project:** the working project is `/home/claude/twice/remotion` (node_modules installed). Fonts go in `public/fonts/`, art in `public/<topic>/`.
- **Remotion facts:**
  - The cloud box has 2 cores, so use `--concurrency=2`.
  - A 720p draft needs `--scale=0.6666666666666666` (0.6667 gives 720.036 px and fails at the stitch step).
  - Composition ids have no underscores.
  - The licence is free for teams of up to 3 people.
- **One-command build:** `build/build.py project.json`. Stages: `voice, align, mix, listen, qa, lint, render, check, deliver, avcheck`.
  - Flags: `--from`, `--to`, `--only`, `--lines`, `--keep`; env `SEED_OFFSET`, `CBX_PY`, `MAXLINES`.
  - It is resumable and writes `build/status.json` and `build/build.log`.
  - It refuses to run beside another clone or render job.
  - **Never voice and render at once, never two renders, no stills or big rasterising while the clone voices** (out of memory, exit 137).
  - Kill processes by PID.
- **Vector videos so far:** render with `npx remotion render src/index_<topic>.jsx <Comp> out.mp4 --muted --concurrency=2`, then mux the chosen soundtrack (paced voice + bed) with `ffmpeg -c:v copy`.
- **Rewording a line:** update its `must`, `changes`, cue words and fact-check row in the same edit.

## 6. Review loop with Sam
1. MP3 + bed sampler approved (`gj581g-voice`). Nothing renders before this.
2. **Style frames:** 10-15 stills at the key moments, tiled into one sheet. Rendered before or after voicing, never during.
3. **720p draft** of the whole video, or clips of 60-100 s for long videos. Send each with a one-line caption and bullets on what each scene shows and what changed.
4. **Sam's notes:** he replies with numbered notes. Fix exactly those, then fix the same kind of problem in every similar scene. Add a line to `LESSONS.md` for every new kind of mistake.
5. **Final:** render the final (1080p only if Sam wants it), with captions and packaging.
- **Joining clips:** never `-f concat` files with different encodes. Re-encode them together with the concat filter and splice by `-frames:v`.

## 7. Checks before anything is sent
- **Lints:** `story/pace_lint.py` runs in the build. Run `story/scene_lint.py <scenes.jsx>` and `story/cue_lint.py <scenes.jsx> <script.json>` yourself.
- **Stills:** look at a frame at every line end, at the busiest moment of each new or changed scene, and at every moment the narration names.
- **Layout:**
  - Labels at least 40 px inside the edges; text never runs past its card; readable text at least 24 px at 1080p (source lines about 20 px).
  - No overlaps: check labels where the drawing is most complete, not at its first frame.
  - Text sits next to what it names.
  - Light text only on dark fills; labels never on top of a glow.
  - Centred or right-aligned text that animates composes alignment and motion in one transform.
  - **Paint order:** a later element covers earlier ones.
  - Readable text stays up for at least 1.5 s.
  - The light must read at phone size.
- **Remotion traps:**
  - HTML (div text, device components) never goes inside `<svg>`, and SVG pieces never go outside one. Either way they silently don't render.
  - A cue word spoken twice needs its index k.
  - Cue on aligned word times, never estimates.
  - No `//` comment in the middle of a continuing line.
- **After render:**
  - video and audio lengths match;
  - `freezedetect` and the frame-difference pass are clean;
  - the voice sits at about -16 LUFS;
  - frames pulled at every transition look right.

## 8. Captions
- **No burnt-in captions** (Emergence uploads closed captions). Make the English `.srt` with `story/timing_srt.py timing_b.json out.srt`; it leaves the Heckler out.
- **Translations:** Hindi first, then Spanish, Portuguese (Brazil), Indonesian, French and German, uploaded as separate subtitle tracks.
- **Burnt-in only if Sam asks:** at most 8 words on screen, the current word lit, kept clear of content.

## 9. The Emergence playbook (defaults; Sam can switch any off)
- **Topic:** a human phenomenon with a modern twin, taught through one true story per chapter. Prefer one of the two shapes behind their breakouts:
  - a debate question: "Is It Just a Fancy Dictionary, or Is Something Emerging?" (62.5K views);
  - a news hook plus a mysterious named idea: "The Dark Knowledge of AI" (229K).
- **Viewer:** one interactive test for the viewer per long video.
- **Script numbers** (their ranges):

  | Measure | Emergence |
  |---|---|
  | Words a minute | 152-171, steady |
  | Median sentence | 8-11 words |
  | Sentences of 6 words or fewer | 21-39% |
  | Questions a minute | 0.3-1.4 |
  | Numbers a minute | 1.6-3.7 (up to 7.7 in money videos) |

  Wonder over jokes.
- **Sound:** never silent; several bed tracks change with the chapters in long videos.
- **Cadence:** they post about one 20-minute video every 4 days because every device is a reusable component. Keep the kit; never rebuild a device per video.
- **Community:** comments are few relative to views. Viewers praise the visuals, the clarity and the detail, and argue about the claims, so keep debate-friendly claims honest and sourced.

## 10. Lessons (also in toolkit `LESSONS.md` 60-63)
- Big Stock `.ai` files rasterised with rsvg run out of memory; use `pdftocairo` under a memory cap.
- HLS saturation blows up near white: cut-outs test chroma.
- A 2-second glide built with `np.convolve` took minutes; use a cumulative sum.
- First style frames went wrong in four ways:
  - ellipse foreground rocks read as black holes;
  - rock blobs at 35-75% opacity read as bubbles;
  - raised arms read as rabbit ears;
  - shadows that drifted with time slid off the wall (oscillate them in place).
- The clone reads at about 192 wpm: always pace with `breathe.py` before Sam listens.
