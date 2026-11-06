---
name: gj581g-vector-world
description: Use for every GJ 581g video from 7 Nov 2026: all videos are vector animation built the Emergence way (story-led script, one illustrated world per story, layered parallax camera, practical light, a fixed device system, a music bed under the voice). Overrides older look, media and music rules in the channel skills.
---

# GJ 581g: vector-world videos (the standing format from 7 Nov 2026)

Sam, 7 Nov 2026, after the Emergence channel study (`styles/EMERGENCE_CHANNEL_STUDY.md`): "Going forward our objective is to only create vector animation videos... do everything which the Emergence is doing." The first pilot is Plato's Cave (`projects\Cave_v1\`, 60 s).

**This skill wins** over every other channel skill and reference file where they differ: `decked-out-styles` (per-video looks, S1-S8 styles), `decked-out-media` (footage, photos, montage, riso), `decked-out-video` (components, investigation board), `decked-out-youtube-packaging` (thumbnail heroes), `gj581g-scene-quality` (asset order, captions), `gj581g-voice-music-montage` (music rule, montage), `gj581g-character-story` (Folk rig as the default cast), `decked-out-research-story` and `gj581g-first-lecture` (script shape). Everything not contradicted still applies: fact-check gate, plain words, MP3 approval before any render, clip-by-clip review, credits, honesty labels, no subscribe asks, Sam's voice clone, never cloning a real person, no swearing in packaging.

## 1. What is banned and what is allowed on screen
- **Every frame is vector-style illustration.** No live-action footage, no stock video, no photographic montage, no screenshots of real sites (except a framed commentary clip Sam asks for).
- **Photos only as flat-tone portraits:** a statue or a public-domain portrait cut out (Adobe `image_remove_background`) and posterised to 5-6 palette tones, placed in a medallion badge. Never a photo of a living private person.
- **Art sources, in order:** (1) free Adobe Stock vectors (`asset_search` StockAsset + Vector + free -> `asset_license_and_download_stock` size -1 -> `.ai`/EPS is a PDF: `pdftocairo -png -scale-to-x 3840` (rsvg on big .ai SVGs runs out of memory); SVGs from Stock render with `rsvg-convert`); (2) our own code-drawn shapes (silhouettes from the `Figure` rig, fire, light, devices); (3) MIT/CC0 icon sets for small props and shadow shapes (Fluent Emoji `Flat`, filled to a silhouette with the `sil` filter); (4) Firefly only for gaps, at full size, labelled, never real people. Log every asset in `media/licence_log.csv`.
- **Recolour everything into the video's palette** with `toolkit/media/recolour_png.py --palette <name>` (`--cutout 0.86` makes a white opening transparent so we can relight it). Palettes live in `recolour_svg.py` (`ember` cave/fire, `dawn` outside; add one per world).

## 2. Story and script (Emergence pattern)
- **Topic formula:** a big idea (philosophy, art, mind, science, money) taught through **one true story per chapter** (a person, a place, a year). The concept lives inside the story.
- **Opening (by 0:50 in a long video, by 0:12 in a short):** one vivid present-tense scene -> (optional) two more in parallel -> one question -> a roadmap line.
- **Chapters:** numbered, titled as story moments ("The wall", "The climb"). The last chapter returns to the opening question.
- **Ending:** recap of the stories in one breath -> a turn to the viewer -> the closing question. No subscribe ask.
- **Pace:** 150-165 words a minute; median sentence 8-11 words; about a third of sentences six words or fewer.
- Every claim fact-checked as before; quotes and dialogue attributed exactly (e.g. "Plato has Socrates add").

## 3. The world and the camera
- **One rich set per story,** reused for several shots; the camera travels over it instead of cutting. A video has 2-4 sets.
- **Depth layers:** far (p 0.8-0.9: back wall, sky, ceiling band), main plane (p 1: the action), near (p 1.25-1.4: dark rocks or foliage drifting past). `Layer cam p` in `remotion/kits/vector_world/vw.jsx` does the parallax; `camAt(keys, t)` eases between camera keys `{t, x, y, z}`.
- **Camera keys land on the narration's words** (`tw(id, word, k)` from the aligned timing). Something always moves: a drift, a flame, motes, a figure.
- **Transitions:** cross-dissolve between sets (0.6 s), a push through a light source into white, a glare flash; hard cuts rare.

## 4. Light (the biggest difference from our old look)
- Scenes are lit, not flat: a dark base with pools of light (`Dark lights=[...]`), practical sources that glow (`Glow`) and flicker (`flick(t, seed)`), rim light on figures on the side facing the light (`Figure rim rimDx`), floating motes in the light (`Motes`), grain (`Grain`) and a vignette on every frame.
- Light carries the story: warm fire inside, cold or white at the turn, red for menace, dawn when the idea resolves.

## 5. Characters
- Small in the frame, mostly silhouettes or seen from behind (`Back`), simple poses from the `Figure` rig (`POSE.seated`, `stand`, `carry`, `shield`, `climb`, `slump`); no lip sync. The Folk II rig stays for close character scenes only.

## 6. The device system (our own design, fixed for the whole line)
- **Chapter mark** (top-left): Roman numeral in a thin ring + a growing rule + the title in spaced caps (`Chapter`).
- **Lexicon card** (bottom-left): "LEXICON · 01", the term in Cormorant italic, a one-line definition (`Lexicon`). A counter runs through the video.
- **Medallion badge** (right): flat-tone portrait in a gold ring, name in spaced caps, role, dates in mono (`Badge`).
- **Kind label** (bottom-right, mono caps): Illustration · after <source> / Illustrative / Schematic / Source: ... (`Kind`).
- **Date tag:** mono in a thin frame (`DateTag`).
- Fonts: Cormorant Garamond (titles, terms), Inter (body), JetBrains Mono (labels). Keep the top-right quarter clear in the last 5 s (end screen).

## 7. Sound
- **Narration:** Sam's clone as before (scene mode, word check, `must` on phrases the checker mishears, repeat guard). Emergence uses a fully synthetic voice; ours stays Sam's.
- **Music bed under the whole video** (Emergence: the bed never drops below about -35 dB): about 12-14 dB under the voice, swelling at chapter turns, ducking under speech. Sources: in-house beds from `toolkit/media/ambient_bed.py <ember|glass|pulse> <sec> <out> --changes <chapter starts>` (no licence), or free YouTube Audio Library / Pixabay tracks Sam picks. **Sam still picks from a sampler** (2-3 beds under the real narration) before the first render of each video; record the pick.
- Sound effects: at most 8 a minute, each tied to an action (fire crackle, chain clink, wind at the cave mouth).

## 8. Captions and reach
- **No burnt-in captions** (Emergence uploads closed captions instead): upload the `.srt` from `make_srt.py`, plus translations (Hindi first, then Spanish, Portuguese, Indonesian, French, German). If Sam wants burnt-in captions back, use the old 8-word rule.
- Description in Emergence's honest shape: cold-open paragraph, the question, "Along the way:" list of stories, sources per chapter, "If we got something wrong, the correction will be pinned", credits (Stock IDs, icon sets, music), the synthetic-voice note.
- A pinned comment with a debate question; title A/B test on every upload.

## 9. Pipeline (per video)
1. Topic -> script (section 2) -> independent fact-check (`factcheck_sync.py`) -> MP3 in Sam's clone (`build.py --to listen`) **plus the music-bed sampler** -> Sam approves.
2. Creative direction: palette name, the sets, the camera path per line, the device moments; source and recolour art (section 1).
3. Build scenes in `remotion/kits/vector_world/` style (`vw.jsx` kit + `<topic>.jsx` sets and scenes); style frames (stills at the key moments) to Sam while the voice runs.
4. After MP3 approval: render 720p draft -> Sam's notes -> final render, mix with the chosen bed (`mix.py <bed>`), captions, packaging.
5. Checks before sending: frames sheet at every line end; nothing important under the bottom 60 px; labels never on top of a glow; flicker not strobing (amplitude <= 0.12); motion on every frame; the light reads at phone size.

## 10. Lessons from the pilot
- Never rasterise big `.ai` SVGs with rsvg while the clone runs (OOM); use `pdftocairo` with a memory cap.
- Don't render stills or video while the clone voices (memory).
- HLS saturation blows up near white: cut-outs test chroma (max-min), not saturation.
