---
name: "gj581g-vector-world"
description: "Use only to finish or update an older GJ 581g vector-animation video (the Cave pilot); new videos use gj581g-stills-world. Covers the vector-animation format built the Emergence way (illustrated worlds, parallax camera, lit scenes, fixed devices), the Recraft art rules, the Remotion kit, the build, clip review, layout and render checks."
---

# GJ 581g: vector-world videos (legacy format; new videos use `gj581g-stills-world` since 8 Nov 2026)

> **Legacy file (9 Nov 2026).** Use it only to finish or update an older vector video. Where it describes the narration (Kokoro, `timing_b.json`, "Narration MP3 approved before render", voice samplers), captions, jokes or the build's `voice` stage, the current rules win: `gj581g-voice` (Sam's ElevenLabs audio is final; captions from its word times; jokes with emotion cards) and `gj581g-producer` (render with `--concurrency=1`). With Sam's audio, start `build.py` at `--from align`. Firefly backgrounds are retired: new vector images use Recraft on the paid plan.

Sam, 7 Nov 2026, after the Emergence channel study (`styles/EMERGENCE_CHANNEL_STUDY.md`): "Going forward we are going to create vector animation videos only." (Superseded 8 Nov 2026 by the stills format.) The first pilot was Plato's Cave (`projects\Cave_v1\`, 60 s, 720p draft approved as the pilot).

This skill replaces `decked-out-styles`, `decked-out-media`, `decked-out-video`, `gj581g-scene-quality`, `gj581g-character-story` and the deck part of `decked-out-deck-builder` (7 Nov audit).

The other channel skills:
- **`gj581g-stills-world`:** the current format for every new video.
- **`decked-out-research-story`:** topic, script, fact-check.
- **`gj581g-voice`:** voice, pacing, music, sound.
- **`decked-out-youtube-packaging`:** packaging.
- **`gj581g-producer`:** board and workflow.
- **`gj581g-scout`:** what to make next, peer channels, the same-topic study.

## 0. Session basics
- **Toolkit:** clone `samarthjn29-cmyk/gj581g-toolkit` and read `README.md` and `LESSONS.md`. Commit and push every fix with the session's attribution lines.
- **Channel folder:** `G:\My Drive\Decked out Data\`. Each project lives in `projects\<Topic>_v<N>\` with subfolders `story\`, `voice\`, `stills\` and `clips\`.
- **Laptop copies** stay under 30 MB. Write to G: through the device tools; never delete anything on Sam's laptop without his permission.
- **Claude decides the visuals** as creative director and says in one line what was chosen and why. Voice and music go to Sam as samplers.

## 1. On screen: what is allowed
- **Vector illustration only.** Every frame is vector-style illustration. No live footage, stock video, photo montage, riso, PowerPoint, or screenshots of real sites. The one exception is a framed commentary clip Sam asks for: 10-15 s, the handle on screen, a credit in the description.
- **Photos only as flat-tone medallion portraits.** Cut out a statue or a public-domain portrait (Adobe `image_remove_background`), posterise it to 5-6 palette tones, and place it in the `Badge`. Never a living private person.
- **Recraft is the only image generator (Sam, 8 Nov 2026: "we will use Recraft to draw vector images only"; Pro 4K plan bought the same day: 4,000 credits a month for about four videos).** This replaces Firefly below for every new image.
  - **Paid-plan images only:** on the paid plan Sam owns them with commercial rights and they stay private; Free-plan images belong to Recraft. Every asset made on the Free plan (the librarian's head, lamp, Nile background and reeds, the room picture's wall panels and floor) is redrawn on the paid plan before the video is published.
  - **Through the Recraft connector,** in the vector model (`recraftv4_1_vector`, 4 credits an image), with one saved style per channel look (`create_style` from approved images) so most images land in one or two tries.
  - **One object per image,** placed and layered by code; a set's states reuse the same objects with different light. Every object goes into the asset library and is reused across videos.
  - **Budget:** about 250 images per video, including re-rolls. Log credits used per video on the board; stop and tell Sam if a video passes 300.
  - **Not used:** OpenArt (no connector, commercial use only on higher plans) and Recraft API units (need an API key, which Claude must not handle).
- **The art split (Sam, 7 Nov 2026, "go with your suggestions", after the stock / own / AI comparison in `projects\Cave_v1\compare\`; Firefly parts retired 8 Nov 2026):**
  - **Detailed backgrounds come from Adobe Firefly**, turned into vector layers with depth (`toolkit/media/ai_to_layers.py`): a full-size image (Image 3, Fast mode off: Fast gives a 672x384 preview; full gives 2688x1536), `vtracer` stacked-colour SVG, rendered at 5760 px, then split into a near layer (dark components touching the bottom edge, soft alpha) and an inpainted back layer. Reference set: `remotion/kits/vector_world/lake_ai.jsx` (W 5760, H 3292, water line and bank, rippling reflection strips, sun glow, camera keys `aiCam`). Label "AI-generated illustration"; no real people, logos or known characters; never crop or cover a watermark.
  - **Our own code draws everything that moves or lights:** figures, props they hold, fire, light, reflections, motes, and the device cards. Own-drawn backgrounds (`lake_own.jsx`: massif, cypress, olive, temple, reflection strips) are the fallback when a world needs no detail.
  - **Free stock only where it already fits** the world (one contributor per world, recoloured).
  - **Recraft (Sam's preferred look, 7 Nov 2026):** `recraftv4_1_vector` (4 credits; the Free plan has 60) gives true SVG in a clean flat style with black outlines.
    - Draw each object as its own image (a sheet of several props on white is fine), then cut and place it by code from the layout.
    - Rig characters with `toolkit/rig/build_rig.py`. Put the shoulder pivot at the top of the sleeve, and never darken far limbs.
    - Anything the story changes (a stand a scroll is laid on, a cabinet, a scroll that unrolls) is drawn in code in the same style.
  - **Firefly credits** (Sam: use fewer; balance 905 of 1,000 on 7 Nov): one wide background per world, not per shot; settle prompt and composition in Fast-mode drafts, then make only the chosen image at full detail (never re-run all four); keep prompts and the style reference per world so re-rolls are rare; keep every generated background in a library (`media\ai_backgrounds\` on G:) and reuse; log credits used per video on the board.
  - **Getting the image out:** Sam signs in; the generated asset is pulled through `asset_search` (GenAIAsset) and the page's own token, moved as base64 chunks and reassembled (`ffly/pull.py`), so nothing is downloaded to Sam's disk without permission.
- **Art sources, in order (for anything the split leaves open):**
  1. **Free Adobe Stock vectors.**
     - Call `adobe_mandatory_init` once, then `asset_search` (StockAsset, `contentType: Vector`, `pricing: free`), then `asset_license_and_download_stock` with size -1.
     - Skip items marked `isGenTech` or editorial-only. **If the tool asks for confirmation or shows a price, stop.**
     - The `.ai`/EPS download is a PDF: rasterise with `pdftocairo -png -scale-to-x 3840` under `ulimit -v 2500000`. A Stock SVG renders with `rsvg-convert` (never run rsvg on big `.ai` SVGs).
     - Prefer one contributor per world. Replace any lettering or brands with ours.
  2. **Our own code-drawn shapes:** figures, fire, light, devices, simple props.
  3. **MIT/CC0 icon silhouettes for props and shadow shapes.**
     - Fluent Emoji `Flat` SVGs: clone `microsoft/fluentui-emoji` sparse with `git sparse-checkout set --no-cone "assets/<Name>/*"`, use `assets/<Name>/Flat/*.svg`, and fill them dark with the `sil` filter. Credit: "Props: Fluent Emoji (Microsoft, MIT)".
     - Or `graphics/icons.py <lucide|tabler|phosphor> <hex> ...`.
  4. **Firefly for backgrounds** as the split above says; `image_vectorize` is the quick route for a single prop, `ai_to_layers.py` for a world.
- **Recolour everything** into the world's palette: `media/recolour_png.py in.png out.png --palette <name> [--keep 0.1] [--cutout 0.86]`.
  - The cutout makes a white opening transparent so it can be relit; it tests chroma, not saturation.
  - Palettes live in `media/recolour_svg.py`: `ember` (cave and fire), `dawn` (outside). Add one per world and check its contrast at phone size.
- **Log every asset** in `media/licence_log.csv`: asset, source or ID, licence, credit line, project, scene. Code-drawn art and synthesised sound get one "original" row each.

## 1a. The continuity sheet: decided once per video (Sam, 8 Nov 2026: "spend less time on reviews and reduce our mistakes from the very start")
Before any scene is built, make one continuity sheet for the whole video and get Sam's OK once. It is `story/<Prefix>_continuity.json` (one source of truth) plus a page made from it (`toolkit/scene/continuity/continuity_page.py`). Reference: `projects\Scrolls_v1\layout\Scrolls_continuity_sheet.png`. It holds:
- **chapters:** the sets each uses and its light;
- **sets:** what each is and every state it passes through (one set, built once, reused in every state; locked sets listed with their spec);
- **props:** one drawing each, its real size, every state in story order;
- **characters:** how each is drawn (kit rig, POV hands, badge), where they appear, their marks at scene joins; living people are monogram badges only;
- **rules:** screen direction, legible writing (only fact-checked real text), scale, credits, how harm is shown, the plants and their payoffs;
- **facts to look up before each set is drawn;**
- **decisions for Sam:** only the open choices, each with a recommendation.
`toolkit/scene/continuity_check.mjs <continuity.json> <root>` checks every scene spec against it: N1 locked sets unchanged, N2 prop sizes, N3 a character starts a scene where it ended the last. A change to the sheet after Sam's OK is a decision for Sam, not a scene fix.

## 1b. Directing every scene (Sam, 7 Nov 2026: "think of yourself as a movie director and film maker")
Every scene is planned like a film scene, inside the continuity sheet. Reference: `projects\Scrolls_v1\layout\Scrolls_scene2_blocking.png` (blocking plan) and `projects\Scrolls_v1\clips\Scrolls_scene2_directors_pack.png`. The plan holds:
- **Treatment:**
  - the scene's job: what the viewer must understand;
  - the one image to remember;
  - the emotional line;
  - the thread from the previous scene.
- **Shot list:** per shot:
  - the time and cue words, taken from the narration's aligned word times;
  - a rough board;
  - foreground, middle ground and background;
  - the shot size and a camera move with its motivation;
  - the light;
  - the action with the actors' marks (where each character is at which second);
  - what the eye should be on.
- **Blocking rules:**
  - Every character has a motivation for each move.
  - Keep screen direction consistent across shots and scenes, or break it on purpose.
  - Eyes lead, then the head, then the body.
  - Subjects sit on the thirds, with room ahead of them.
  - One character thread and one focal point at a time.
  - Props with no job are cut.
- **Prop cards:** each prop gets:
  - its real size;
  - its material and weight;
  - where it lives;
  - every state it passes through (one prop keeps one size in every shot);
  - its source for period accuracy;
  - any invention, flagged as one.
- **Motion notes:**
  - anticipation, contact (hands close on what they take), weight, follow-through and holds;
  - never two actions starting at once;
  - walk timing from real reference: studied clips (analysis only) or the CMU motion-capture library (free for research; may be used inside products, not resold).
- **Joins:** every shot's last frame is planned against the next shot's first: match cuts on shape, motivated reveals, continuous moves, a hard cut only for a new idea, and a name carried across a cut.
- **Background push-down:**
  - The background is muted in value and saturation.
  - The only light falls where the story is heading.
  - The wall behind the focal point stays plain.

**Set first, then actors: four gates per scene** (Sam, 8 Nov 2026, "like movies where a set is designed first"). A set change after its lock goes back to gate 2.
1. **Blocking plan:** floor plan from the spec in metres, front view at true heights, camera positions with their view cones, the characters' marks, the shot table (time, camera, action, who is where, what is in frame, the join). Generator: `toolkit/scene/blocking_page.example.py`. Cheapest place to change anything.
2. **Empty set, locked:** the room and props at true scale, a still from every camera with nobody in it (`index_gate2.jsx` pattern: `Room` with a `gate` override). Set checks run here.
3. **Stand-in pass:** the real rig drawn grey, grey mitten hands, every move at real timing on the narration, from the scene's own spec (`scene/room2.scene.json` + `scene2_standin.example.jsx`). The validator runs on that spec. Judge reach, crops, hand-overs, joins, timing.
4. **Performance:** the real character and hands go into exactly those moves (`final` prop). The work is only acting and finish.
**Sam's touchpoints:** a decision page only when the scene needs a choice the continuity sheet doesn't settle, and the finished clip. Gates 2 and 3 are signed off by the checks and the independent reviewer; send them to Sam only if he asks.
After gate 4: gaze check, detail check, independent review, `join_check.py` (section 7), then render.

## 2. The world, camera and light
- **One rich set per story,** reused for several shots: the camera travels over it instead of cutting. A video has 2-4 sets.
- **Depth layers** (`Layer cam p`):
  - far, p 0.8-0.9: back wall, sky, ceiling band;
  - main plane, p 1: the action;
  - near, p 1.25-1.4: dark jagged silhouettes along the bottom edge only, never ellipses over the action.
- **Camera:** `camAt(keys, t)` eases between `{t, x, y, z}` keys, and `toScreen` maps world to screen.
  - Camera keys land on the narration: on line starts and ends from Kokoro's `timing.json` (`t0(id)`), or on words (`tw(id, 'word', k)`, explicit k) when an aligner has added word times.
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
- **Kit characters (from 8 Nov 2026):** one code-drawn rig per character (`toolkit/scene/kit/librarian.mjs`: tapered capsules on joints, one outline pass per depth group, a Recraft head as an image), drawn by `Puppet2` (mirrors with `dir` to face left; a held prop sits between palm and fingers, with an `under` and an `over` layer). New characters are costume and head variants of this rig, never a new rig. Walks come from the spec (`moves`): the character faces the way it walks, the phase follows distance, the planted foot is locked.
- **POV hands ("you"):** bare forearms, fingers curled over the held object, palm on its outer side, forearm about 1.7 hands long to an elbow just below the frame, sized from the object (a hand is about 1.3x a 7 cm roll). The same hands every time they appear.
- **Small, silhouettes:** in wide shots characters stay small, often silhouettes or seen from behind (`Back`). No lip sync.
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
  - `cave.jsx`: the reference video, with sets, flames, `sil`, scenes and `CaveStill`; `index_cave.jsx` takes inputProps `{own}` / `{ai}` to swap the lake set;
  - `lake_own.jsx` and `lake_ai.jsx`: the own-drawn and the AI-layered versions of one set (the comparison Sam judged);
  - `stills_cave.mjs`: renders many stills from one bundle, `node stills_cave.mjs frames.json 0.5`.
  - New videos copy `cave.jsx` as `<topic>.jsx`. Scenes read the paced timing, copied to `src/data/<topic>_timing.json`.
- **Remotion project:** the working project is `/home/claude/twice/remotion` (node_modules installed). Fonts go in `public/fonts/`, art in `public/<topic>/`.
- **The scene system** (`toolkit/scene/`, README there): the scene spec (`room.scene.json`: objects, props with states, characters with moves and actions, camera shots on word cues, devices, credits, beats, rules) is the single source of truth. `core.mjs` computes positions, cues, rig FK, hand and feet, camera; the Remotion scene, the asset builder, the validator and the pose sheet all read it. `validate.mjs <spec> [--variant v --variants file]` runs the G, Z, C, R, M, E, F, T, A, K, L, S, W checks; `regression_variants*.json` are past mistakes it must keep catching (all must FAIL). `rig_holes.py` checks a rig's pose sheet for gaps. Racks are drawn to true scale by `kit/kit_rack.py`, which returns every scroll's position.
- **One drawing per prop:** a prop keeps one design in every state (on the shelf, carried, on the stand, in your hands); its tag goes with it. Hand-overs between states are one-frame switches, never crossfades.
- **Remotion facts:**
  - Render with `--concurrency=1` (`gj581g-producer` engineering guards).
  - A 720p draft needs `--scale=0.6666666666666666` (0.6667 gives 720.036 px and fails at the stitch step).
  - Composition ids have no underscores.
  - The licence is free for teams of up to 3 people.
- **One-command build:** `build/build.py project.json`. Stages: `voice, align, mix, listen, qa, lint, render, check, deliver, avcheck`.
  - Flags: `--from`, `--to`, `--only`, `--lines`, `--keep`; env `SEED_OFFSET`, `CBX_PY`, `MAXLINES`.
  - It is resumable and writes `build/status.json` and `build/build.log`.
  - It refuses to run beside another clone or render job.
  - **Never voice and render at once, never two renders, no stills or big rasterising while the clone voices** (out of memory, exit 137).
  - Kill processes by PID.
- **Vector videos so far:** render with `npx remotion render src/index_<topic>.jsx <Comp> out.mp4 --muted --concurrency=1`, then mux the approved soundtrack (Sam's levelled ElevenLabs audio plus the bed, `gj581g-voice` section 6) with `ffmpeg -c:v copy`.
- **Disk:** full-size clip renders in `remotion/out/` fill the box (8 GB in Twice); keep the laptop copies and delete the full-size files in the workspace once a clip is approved and saved to G:.
- **Rewording a line:** update its `must`, `changes`, cue words and fact-check row in the same edit.

## 6. Review loop with Sam
1. Sam's ElevenLabs narration is final (`gj581g-voice`): build and render on it, then run the post-render voice audit and send the clip with it.
2. **Continuity sheet** (section 1a), approved once. Then per scene, the four gates (section 1b): Sam sees a decision page only if the scene needs one, and the finished clip.
- **Nothing reaches Sam with an unfixed reviewer finding.** Every delivery starts with a short "Known rough parts" list (placeholders and anything left on purpose), so he never spends time finding them.
- **Score:** log Sam's notes per scene (count and kind) on the board. If the count isn't falling, the system isn't working; say so.
3. **Style frames:** 10-15 stills at the key moments, tiled into one sheet, each world's Firefly background made first (credit rules above) with own-drawn figures and light over it. Rendered before or after voicing, never during.
4. **720p draft** of the whole video, or clips of 60-100 s for long videos. Send each with a one-line caption and bullets on what each scene shows and what changed.
5. **Sam's notes:** he replies with numbered notes. Fix exactly those, then fix the same kind of problem in every similar scene. Add a line to `LESSONS.md` for every new kind of mistake, and turn every finding that can be checked from data into a validator check plus a regression variant.
6. **Final:** render the final (1080p only if Sam wants it), with captions and packaging.
- **Joining clips:** never `-f concat` files with different encodes. Re-encode them together with the concat filter and splice by `-frames:v`.

## 7. Checks before anything is sent
- **Gaze check** (`toolkit/study/gaze.py`, DeepGaze IIE, in its own venv):
  - On every keyframe, the region holding 50% of predicted looks must sit on what the narration names. Emergence frames land at about 5% of the frame.
  - Fix distractors: bright panels, second figures, busy props, a word card out-pulling its visual.
- **Detail check** (`toolkit/study/DETAIL_CHECKLIST.md`):
  - full-size stills, with 100% crops of every prop and of each character's hands, feet and joints;
  - check physical logic, limb colours, leftover outlines, layering and shadows, and text collisions.
  - Then a fresh agent that hasn't seen how the frames were made reviews the same stills against the checklist. Fix what it finds, and re-check those spots before rendering.
- **Scene checks:** `scene/validate.mjs` on the scene spec (0 FAIL), every regression variant still FAILs, `scene/continuity_check.mjs` against the continuity sheet, `rig_holes.py` on the pose sheet without props.
- **Join check:** `study/join_check.py clip.mp4 --spec scene.json` lists every jump that isn't a planned cut (cuts = camera shots shorter than 0.05 s); `--pair a.mp4 b.mp4` measures the join between clips (a continuous join stays under 12).
- **Independent review before Sam:** a fresh agent reads full-size stills against `DETAIL_CHECKLIST.md`; fix what it finds before sending.
- **Lints:** `story/pace_lint.py` runs in the build. It knows the vector treatments, and lets a world-travel or pov run last up to 60 s within one scene, because the camera travels one set. Run `story/scene_lint.py <scenes.jsx>` and `story/cue_lint.py <scenes.jsx> <script.json>` yourself.
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
- **No burnt-in captions** (Emergence uploads closed captions). Make the English `.srt` with `story/timing_srt.py timing_b.json out.srt`.
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

  Wonder first; jokes with emotion cards (`gj581g-voice` section 4).
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
- Narration: Sam's ElevenLabs recording, final as delivered (`gj581g-voice`); Kokoro and the clone are reserve engines.
- AI backgrounds (LESSONS 64): a vectorised Firefly image looks smeary when split at its native size; split at 5760 px with a soft alpha and widen the camera; Fast mode gives previews only.