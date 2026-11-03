---
name: "decked-out-deck-builder"
description: "Runs the Kokoro animatic voice and builds PowerPoint (.pptx) decks for GJ 581g (Decked out Data) videos when the user asks; final narration in Sam's cloned voice and the Heckler follow gj581g-voice-music-montage. Use for the animatic voice, deck builds, and narration tooling questions."
---

# GJ 581g (Decked out Data): narration and decks

## Channel updates, 3 Nov 2026 evening (skill audit; these win over everything below, including the 1-2 Nov block)
- **Workflow:** the workflow is `gj581g-producer` steps 1-8: script + storyboard (fresher test) -> animatic -> punch-up -> lock -> **voice first** (the whole locked script in one batch, `build.py full.json --to listen`, Sam approves the narration MP3; single lines fixed with `tts/patch_line.py`) -> picture clip by clip from the approved takes (`--from align`, never re-voiced) -> **join = one render of `full.json` from the approved takes** (`--from align`), not a stitch of clip files; after the join nothing changes in that video. Any text below that says "voice clip N+1 while Sam reviews clip N", "clip-by-clip narration" or "join the approved clips" is replaced by this.
- **Second voice:** the Heckler (`gj581g-voice-music-montage` section 0b): optional per video, used in the Dollar Yardstick from video 2; lines tagged `who: "heckler"` and `mood`; her own synthetic voice at 1.2x, voiced by `build.py` when `project.json` has `"heckler_ref"`; she never says a number; **her lines are never captioned or subtitled**. The old `{viewer: ...}` curious-viewer voice is legacy (Tokens, LongChat only); don't use it in new scripts.
- **Simple scripts:** `gj581g-first-lecture` wins on how many numbers are spoken and how plain the words are: at most 3 spoken numbers a minute, one key number per chapter, a person before every concept, one new term per chapter, sentences averaging 10-15 words (nothing over about 25), and the fresher test (`toolkit/story/simple_lint.py` + a first-day-student read) before the script locks.
- **Swearing and real people:** allowed within `gj581g-voice-music-montage` moves 8-9 (never in titles, thumbnails, descriptions or tags; public figures only, for what they publicly said or did, every claim sourced).
- **Who owns what:** narration rules (voice, delivery, the Heckler) belong to `gj581g-voice-music-montage`; this skill runs the Kokoro animatic tooling and builds PowerPoint decks.
- **Retries:** up to 8 tries per part (3 for pace-only failures), as `clone_scenes.py` does; `build.py` separately retries a memory-killed scene up to 6 times.

## Channel updates, 1-2 Nov 2026 (these win over anything below)
- **Channel name:** GJ 581g (formerly Decked out Data).
- **Folder and toolkit:** the channel folder is `G:\My Drive\Decked out Data` (Google Drive for desktop; the Google Drive connector can read it too). The toolkit's master copy is the private GitHub repo `samarthjn29-cmyk/gj581g-toolkit`: clone it at the start, commit and push every fix. Any `C:\Users\samar\Documents\Decked out Data` path in older notes means the same place on G:. Read `toolkit/LESSONS.md` (the mistakes log) at the start.
- **Board:** `gj581g-producer` keeps `PRODUCTION.md` and the workflow; read it at the start of a session and update it at each milestone.
- **Voice** (`gj581g-voice-music-montage` wins where this skill differs): Sam's saved voice profile `voice_sample\sam_voice_v1`, scene mode, every take word-checked; never sped up; the humour voice; talked delivery; clear sentences with no length rule.
- **Workflow (trial from 2 Nov 2026):** script + storyboard -> animatic in Kokoro (`build.py` with `"voice_mode": "kokoro"`, whole video, natural speed) that Sam watches and edits -> script locked and fact-check passed -> clip-by-clip narration in Sam's clone through `toolkit/build/build.py` (`"voice_mode": "scene"`; voice -> align -> mix -> pace lint -> render -> frame check -> deliver). The build refuses clone voicing without the passed fact-check CSV (`"factcheck"`) or a pilot's `"factcheck_waiver"`. This replaces `v2.py voice/accept` and `run.py voice` for new videos.
- **Music:** none in the money series pilot; any music is Sam's pick from a sampler played under the narration, never chosen unheard. **Sound effects** are allowed: at most 8 per minute, each tied to an on-screen action.
- **No silent holds** except in a video essay (S7 as the base style): storyboard `hold` is 0; only the natural gaps between sentences remain. Big moments land through the words and the picture.
- **Decorative montage** may set mood between evidence shots; evidence shots still show the thing itself, honestly labelled.
- **Platform clips** (YouTube, TikTok, Instagram) for commentary only: the clip the video is talking about, at most 10-15 s, shown as itself with the creator's handle on screen and a credit in the description, never b-roll, never a large share of the video. News, broadcast and sports clips stay banned. **Game, app and website screenshots** under a creator policy, an open licence, or for commentary on that game or site; never decorative.
- **Ending:** a short "Next time" end card that names the next video (no subscribe ask), with the YouTube end-screen element in the top-right quarter.

This skill has two jobs:
1. **For every video: the narrator and the narration.** The final narrator is **Sam's own voice, cloned with Chatterbox from his saved profile** (the section right below). Kokoro voices the animatic (and is the fallback when the user asks for a synthetic narrator). The per-scene audio feeds the Remotion video (`decked-out-video`) and any deck.
2. **Only when the user asks for a deck or a .pptx (or is editing an existing deck): the PowerPoint deck.**

It also owns the **clean-facts rules**, which every video follows, whatever its style.

Owners, one per decision:
- `decked-out-styles`: the creative direction, including the **palette, colour meanings, fonts and look**, and the single **project log** in `styles\STYLE_LIBRARY.md`. The palette library and the seven palette roles live in that file too.
- `decked-out-research-story`: the storyboard and voiceovers, and the independent fact-check.
- `decked-out-media`: all media, including music candidates and samplers.
- `decked-out-video`: the scenes, the mix and the render.
- `gj581g-voice-music-montage`: the voice profile and clone checks, the humour voice and talked delivery, music and sound effects.
- `gj581g-scene-quality`: pacing (pace lint), captions, layout.
- `gj581g-producer`: the board, the workflow and the build.

`SKILL_DIR` means the folder containing this SKILL.md. Where this SKILL.md differs from a reference file, this SKILL.md wins. **Retired:** the playing-card brand in `references/brand-kit.md`, `scripts/brand.js`, the demo, and `scripts/make_audio.py`. Do not use cards, suits, Joker mascots, stickers or the indigo card-table background. `references/layout-recipes.md` is retired with `brand.js` (its layouts survive only where this SKILL.md names them). In `references/animation-and-sound.md` read only the timing.json schema's field names; its sound-design, music and "every 8 seconds" sections are superseded, and so are the example's values: transitions are `fade` (never `push-left`), there is no `music` key unless Sam picked a track, sound effects sit at about -28 LUFS tied to a build (not a -6 dB "pop"), timing is planned at 2.6 words per second (not 2.3), and the scripts are `toolkit/media/apply_timing_media.py` and the build's mix (not `make_audio.py`). The timing script now lives in the toolkit (`media/apply_timing_media.py`, a superset of `scripts/apply_timing.py`; `--list` prints shape names).

## Toolkit (use it, don't rebuild it)
The tested scripts live in the user's toolkit: master copy in the GitHub repo `samarthjn29-cmyk/gj581g-toolkit`, working copy `G:\My Drive\Decked out Data\toolkit` on his computer. Versions: 1.8 the Remotion engine, `tts/align.py` and `media/parallax.py`; 1.7.3 per-slide narration; 2.1 the first clone scripts; 2.2 the clip workflow `v2.py`; 2.3 the clip workflow `clips/clip.py`, lints and libraries; **2 Nov 2026: `build/build.py` (one-command build with `kokoro`, `scene` and `line` voice modes, the fact-check gate and `render_scale`), `tts/clone_scenes.py` + `tts/assemble_scenes.py` (scene-mode voicing and word timings), `tts/kokoro_lines.py` (animatic voice), `tts/ref_test.py` (choosing a reference), `story/pace_lint.py`, `remotion/templates/s8_banknote`, `LESSONS.md`**. At the start of every project, clone the repo into `toolkit/` in the working directory (if GitHub can't be reached and the computer is linked, stage the `toolkit` folder from G: instead). Read `toolkit/README.md` and `toolkit/LESSONS.md`. Use the scripts rather than rewriting them; when you fix or improve one, commit and push it, copy it to the folder on G:, and bump the README version line. The Kokoro model may already sit in another folder of the workspace (point `KOKORO_DIR` at it rather than downloading again).

## Inputs
- The project's script/storyboard JSON (one entry per narration line with `id`, `scene`, `text`, optional `say`, `must`, `tight`, `treatment`, `changes`) or, for older projects, `<Topic>_storyboard.md`, `<Topic>_voiceovers.md`, `<Topic>_story_brief.md` and `story/slides.json` from `decked-out-research-story`. Never invent content or numbers.
- The fact-check CSV (`story/<Prefix>_factcheck.csv`), every verdict OK, before any clone voicing.
- `styles\STYLE_LIBRARY.md` (the project log), and for a deck the creative direction's identity sheet (palette).
- If the user sends back an edited deck, compare it shape by shape with the deck you built (positions, sizes, fonts, colors, text) and treat their changes as rules for the whole deck.
- If the user praises a specific slide or scene, work out what made it work and apply that treatment more widely (and record it via a skill update).

## Sam's own voice: the saved Chatterbox profile (from 2 Nov 2026)
The full rules are in `gj581g-voice-music-montage` section 0; this is the operating summary.
- **Disclosure:** YouTube's help page (checked Oct 2026) treats a creator cloning their own voice for a voiceover as a minor edit; the packaging still discloses the computer-generated narration in the description and ticks the altered or synthetic content box on upload, to be safe. Mention it if YouTube's rule changes.
- **The profile:** `G:\My Drive\Decked out Data\voice_sample\sam_voice_v1` (`ref.wav`, `conds.pt`, `profile.json`, `speaker_embedding.npy`), approved by Sam on 2 Nov 2026; 0.90 against his real reading. Stage it from G: into the project (it is never in GitHub). Retired: `voice_sample/ref_take2.wav` and the token-explainer take ("too soothing, like talking to a child"). A new reference is only chosen by measurement (`tts/ref_test.py`, Sam's real reading of the same passage as the yardstick) and confirmed by Sam from a sampler.
- **Tool:** Chatterbox (`chatterbox-tts`, MIT; its PerTh watermark is fine) in the venv `/home/claude/cbx` (torch 2.6.0 CPU, chatterbox-tts, faster-whisper, librosa, soundfile, num2words). Set it up with `python3 -m venv cbx && cbx/bin/pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu && cbx/bin/pip install chatterbox-tts faster-whisper librosa soundfile num2words`. Always use `/home/claude/cbx/bin/python3`; plain `python3` lacks soundfile and Chatterbox. It runs about 10x real time on the 2-core workspace (a scene of 15-45 words takes 1-3 minutes per try); an Apple Silicon Mac would be much faster (set-up deferred).
- **Settings:** exaggeration 0.5, cfg 0.5, temperature 0.8, breaths kept, no `atempo`, no debreath (all read from `profile.json`).
- **Scene mode:** `build.py` with `"voice_mode": "scene"` and `"voice_ref": "<path>/sam_voice_v1"` calls `tts/clone_scenes.py` once per scene (one process each). Each take is transcribed with faster-whisper (`small.en`, int8; decode with ffmpeg to 16 kHz numpy, since PyAV raises `metadata_errors`; read the segments generator once with `list(segs)`) and checked: words against the script (numbers as words), speaker similarity >= 0.80, every `must` phrase heard exactly, no pause inside `tight` lines; up to 6 re-rolls, then `SEED_OFFSET=<n> build.py project.json --lines <scene>` for fresh seeds (`--lines` takes scene ids in scene mode, line ids in line mode). Line mode (`tts/clone_lines.py`) only to fix a single line.
- **You cannot hear the audio.** The word check is the minimum; Sam's ear is the final check. Failures seen: "pay slip" -> "base slip" (fixed by writing "payslip" in `say`), "raise" at the end of a question -> "race" ("pay raise"), "Barbara's buys" -> "Babras/Bob Ross buys" (reworded "Barbara's only buys"), sentences dropped from passages of short sentences, "Retests" -> "Retest". Earlier (Tokens): "paying" -> "Bing", "Claude Code" -> "plot/cloud code", "tenth" -> "dent", a last phrase said twice. Whisper's harmless spellings (Anne/Ann, "3.5" for "three and a half", "rays" for "raise" when the sound is right) are not errors. When Sam flags a line, re-voice that scene and send him just that passage.
- **Pronunciation list:** in the profile's `profile.json` and in each line's `say` field (the clone reads `say`; captions show `text`). `spoken.json` is legacy (Tokens/LongChat).
- **Word timings:** `tts/assemble_scenes.py` joins the scene takes (trimming the clone's murmur before the first word; 0.45-0.5 s between scenes) and writes `timing.json` with each line's start/end and per-word times; scenes, captions and sound effects cue on those times (`build.py` align stage).
- **Timing estimate:** word-count estimates run long for his voice (a 12:00 plan voiced to about 9:30; the Raise pilot ran 60 s for 21 lines). Judge length from the voiced durations and never speed the voice to fit.
- **Running the jobs:** run `build.py` with the tool's background mode and a monitor on `build/build.log` that also matches failures. One voicing process per scene (long runs were OOM-killed, exit 137). Never voice while a render runs. Never start a background job that waits for another background job (two deadlocked for 45 minutes); chain steps in one command. `pgrep -f` matches its own command line, and `pkill -f <pattern>` kills a shell whose command line contains the pattern (exit 144): kill by PID from `ps -eo pid,args | awk '/pattern/ && !/awk/'`.
- **What he listens for:** sounding like him (not soothing, not fake), the energy of option A (2 Nov), one steady natural pace, no pause longer than about 0.5 s between sentences, no pause inside a phrase such as "Barbara, meanwhile" or "Sixty-four percent said Barbara", prices and lists in one breath, numbers clear, no dead air. Deliver voice tests as one short sampler with beeps between versions, his real recording first.
- **Legacy (Tokens, LongChat only):** `tts/clone_all.py` (12-28-word chunks, temperature 0.6, debreath at -28 dB, `atempo`), `v2.py voice/accept`, `tts/align_whisper.py`, scene = clip + 0.35 s. Do not use them for new videos.

## Kokoro narrator (the animatic voice; fallback when the user asks for a synthetic narrator)
The animatic uses one consistent Kokoro voice at **natural speed (SPEED=1.0)**; never sped up (the old 1.1x rule is retired). Default `am_michael` (American male; the user's last stated preference for a synthetic voice; `"kokoro_voice"` in `project.json` changes it). Use the English voices with the best quality:

| Voice id | Name | Accent | Dialect for the G2P (`DIALECT`) |
|---|---|---|---|
| bm_fable | Fable | British male | gb |
| am_michael | Michael | American male | us |
| bm_george | George | British male | gb |
| am_fenrir | Fenrir | American male | us |
| bm_lewis | Lewis | British male | gb |
| am_eric | Eric | American male | us |
| bf_emma | Emma | British female | gb |
| af_heart | Heart | American female | us |
| bf_isabella | Isabella | British female | gb |
| af_bella | Bella | American female | us |

Rules:
- Use the matching dialect: British voices with `DIALECT=gb` (RP rules), American voices with the default US rules.
- Legacy projects only: the `{viewer: ...}` lines use a second Kokoro voice set as `VIEWER`. New videos use the Heckler (`gj581g-voice-music-montage` 0b).
- The user can still pick a specific voice; their choice wins.

### Kokoro narration
Generate the audio locally with Kokoro (open-source, Apache-2.0):
1. `toolkit/tts/setup.sh` once per session (installs onnxruntime, downloads the Kokoro v1.0 model and voices, the kokoro-onnx config and the CMU Pronouncing Dictionary into `toolkit/tts/dl`; or set `KOKORO_DIR` to an existing download).
2. New projects voice the animatic through `build.py` with `"voice_mode": "kokoro"` (`tts/kokoro_lines.py`, which reads each line's `text` and writes `vo.wav` and `timing.json`). Older projects: `SPEED=1.0 [DIALECT=gb] [VIEWER=<voice id>] [PRON=pron.json] python3 toolkit/tts/synth.py story/slides.json tts/vo <voice_id>`. Both convert words to Kokoro phonemes from the dictionary and report words missing from it: hand-write their ARPAbet in `pron.json` and add good ones to `CUSTOM` in `g2p.py`. The animatic voice may run before the fact-check has passed (facts on screen are labelled "draft"); the clone may not.
3. Retime (older projects): `python3 toolkit/story/handoff.py project.py story --vo-dur tts/vo/durations.json` (scenes = clip length + 0.4 s + hold, which is 0 outside video essays), then have the media skill rerun `prep.py`.
4. For older-engine Remotion videos, `toolkit/tts/align.py` makes the word timings (see `decked-out-video`); re-run it for any scene you re-voice.
5. Optionally mix the full narration as one file for reference with `toolkit/tts/mix_voice.py`; the full mix (music if Sam chose any, sound effects) is `build.py`'s mix stage.
You cannot hear audio: check levels and pauses numerically, and ask the user to listen. If the user records the voices instead, save their clips as `tts/vo/VO-NN.mp3` (one per scene) and continue.

**Changing the voice later:** re-voice, re-align, refit the media clips and sound cues, and re-render the affected clips (`build.py --lines ...`).

## Clean-facts rules (every video, every style)
- Charts and data marks are flat: no 3D, gradients, textures, grain, shadows or rounded ends on data marks. One exception: a series' own chart style may fill bars with an even, regular hatch (S8 Banknote's engraved bars), as long as bar length, the zero baseline and the labels stay exact. Axes for bars start at zero; direct labels; units stated; exact scale.
- Numbers, chart labels and source lines use a clean, readable font (the data font), never a novelty, handwriting or typewriter font; at least 14 pt-equivalent for chart labels and 11 pt for source lines at 1080p; contrast checked on the background.
- Verbatim snips and evidence cards are shown as cropped, never tinted, graded or distorted; looks apply to footage only. The only re-typeset quotes are the licence-driven ones made with `snips/typeset.py`, with the words unchanged.
- Every data scene keeps its action title, source line and caveat where one applies. Decoration (including decorative montage) never overlaps data and never carries a number.
- When two measures of the same thing disagree (e.g. OECD's consumption deflator vs CPI), show both or say "roughly" (the Raise pilot's UK real wage: +2.8% vs -1.7%).
- Nothing appears on screen as fact until the independent fact-check has passed it.
- A style may change frames, textures, panel shapes, illustration and footage grade; it never changes values, scales, ordering or what is highlighted.
- No slide or scene numbers on screen (the user's rule since October 2026). The small channel name "GJ 581g" may sit at a bottom corner.
- No copying of any firm's logo, name, trademark colors or templates, or any real publication's masthead.

## PowerPoint decks (only when the user asks)
A deck turns the approved storyboard into a finished slide deck that exports to a YouTube video, with everything inside it: slides, media, charts, animation, timing, speaker notes and the per-slide narration (one clip per slide, so voice, builds and footage stay in step). **Media is handled by `decked-out-media`** (load it with the Skill tool when you reach the media steps; its section 9 covers autoplay, transitions and the motion preview).

### Before you start a deck
1. Read `/mnt/skills/public/pptx/SKILL.md` (structured decks, theme, gotchas) and, in `references/animation-and-sound.md`, only the timing.json schema's field names (values as corrected above).
2. Clone the toolkit (above). If `story/slides.json` is missing, run `python3 toolkit/story/handoff.py project.py story`.
3. Take the palette from the creative direction's identity sheet (or, for a deck made without one, pick one from the palette library in `STYLE_LIBRARY.md`, different from the previous project), and choose a deck theme (below). Run `toolkit/deck/preview_fonts.sh` once so local renders use look-alikes of the theme's Windows/Office fonts.
4. Load `decked-out-media` and run its plan, sourcing and prep steps with the palette's Primary for the tint and the theme's footage look.
5. Set up a task list: theme, media, build, narration, QA, preview, deliver.

### Deck themes
Build a deck theme from the toolkit's theme settings: `deck_config.json` `"theme": {name, head_font, body_font, label_font, radius, title_caps, deco}` and `"texture"`, plus the footage `"look"` in `media_specs.json` (presets in `toolkit/examples/themes/`, preview in `themes_preview.png`). Fonts must ship with Windows and Office so the deck renders right on the user's PC; never use a font only installed here.

| Theme | Fonts (head / body / label) | Texture, decoration, panels | Footage look | Suits |
|---|---|---|---|---|
| Boardroom | Arial / Arial | white or `grid`; none; square | none | finance, policy, business |
| Modern minimal | Bahnschrift / Segoe UI | `dots`; `bar`; radius 0.12 | none or cool | tech, AI, science |
| Editorial | Georgia / Franklin Gothic Medium | none; `rules`; square | bw or faded | society, culture, politics-light |
| Retro 70s | Rockwell / Century Gothic | `paper`; `stripes`; radius 0.15 | warm + grain 8 | everyday economics, consumer, nostalgia |
| Vintage newsprint | Georgia (caps titles) / Georgia / Courier New | `paper`; `rules`; square | sepia + grain 12 + vignette | history, classic psychology, crime cases |
| Lab / blueprint | Segoe UI / Segoe UI / Courier New | `grid`; `bar`; radius 0.08 | cool | engineering, medicine, data science |
New themes are welcome if they keep the clean-facts rules; add them to this table via a skill update.

**Palette in a deck:** the seven roles (Primary, Secondary, Panel, Rule, Accent, Callout, Negative; defined in `STYLE_LIBRARY.md`) go into `deck_config.json`. For media slides also define `light_accent` (trackers, headers and lines on footage, the last line of a word card, e.g. C9B6EE for Plum & Coral), `mid` (filled boxes on footage, between Primary and Accent, e.g. 4B3A66) and `line_on_media` (rules on footage, dimmed map items, e.g. A89BB8). Check contrast: white text on Primary, Accent and Callout fills, white text on tinted footage, and Accent numbers on white or on the texture, must stay readable at phone size. Put the theme, the palette name and hex table in the deck notes; the PowerPoint theme is named from them automatically. Snip highlights, tags and media tints use the same palette.

### Slides over footage (design rules for media slides)
The footage itself comes from `decked-out-media`; how the slide looks on top of it is decided here.
- **Layout `CORP_MEDIA`:** background Primary (shows if a clip fails), no master text; `VID(s, key, {x:0, y:0, w:13.333, h:7.5, name})` as the slide's **first** shape so everything else sits on top; `mediaHead(s, n0)` draws the tracker in `LIGHT`, the action title in white, the source line and channel name in `LIGHT_RULE` (no slide numbers). A clip may be a cut sequence of 2-3 clips (prepared by the media skill); the slide code doesn't change.
- **Colors on footage:** Panel-colored boxes keep their dark text (give filled text boxes an inner margin); text sitting directly on footage is white or `LIGHT`; lines and arrows are `LIGHT` or `LINE_ON_MEDIA`; filled boxes use Accent or `MID`, **never plain Primary** (it disappears into the tint); Callout tags stay as they are.
- **Where:** the title, the map, at least one slide per chapter, and most concept, process, timeline, list, quote, scenario and answer slides (about 10-12 of 25). Charts, verbatim snips and dense comparison tables stay on white so the numbers stay crisp.
- **Video panels:** `paperMedia()` puts the citation left and a 5.43 x 3.95 in video panel right (x 7.3, y 1.95), with study details in compact rows under the citation; thumbnails beside charts about 2.1 x 1.3 in. A photo panel is a still turned into a smooth push-in clip by the media skill (`toolkit/media/pushin.py`) and placed with `VID()` like any clip; its credit line sits under the panel ("Photo: <name> / Unsplash").
- **Labels:** generic footage that could be mistaken for the real event or study carries a small italic note on the slide (from the media plan).
- **Matte mode:** `VID()` draws flat black/white boxes when `MATTE` is set and records every slot in `media_slots.json`; `build.sh --preview-mattes` handles it.

### Rhythm and emotional beats
- **Visual change every 3-5 seconds** inside a deck (this rhythm is for PowerPoint decks only). Within a slide, reveal elements on narration beats (one build per beat), swap or highlight items, and let background clips cut (the media skill's cut sequences). For Remotion videos the rule is the pace lint (`gj581g-scene-quality` section 3: a picture change at least every 6 s, no treatment over 20 s).
- **Word cards** (layout `word-card`): `wordCard(n0, {video?})` shows the slide's `lines` full screen, large and bold, white with the last line in `LIGHT`, revealed line by line while the narration runs; on Primary, or over a slow tinted clip when `video` is given. 2-4 per video. Keep them to 1-4 words per line.
- **Chapter map** (layout `map`): `mapSlide(n0, {video?})` shows `map_items` numbered, the current chapter (`map_current`) highlighted with a Callout marker, past chapters dimmed, and hidden chapters (`map_hidden`) as "??????????".
- **Holds:** a slide's `hold` seconds are added after the narration. Since 1 Nov 2026 `hold` is 0 (no silent holds); only a video essay may use 1-3 s.

### Deck design system (fixed across themes; own design, not any firm's brand)
- **Canvas:** 16:9 (13.333 x 7.5 in), **white background** for data slides (optionally the house texture: `"texture": "grid"`, `"dots"` or `"paper"` in `deck_config.json`); tinted motion backgrounds for the signature slides; the Primary color for the title, word cards and maps without footage.
- **Palette:** one Accent focus per slide; Callout for the single "look here" item; Negative only for negative values or warnings.
- **Type:** the theme's fonts (head font for titles and big numbers, body font for everything else, label font only for small trackers and the brand). Action title 28-32pt bold in Primary (white on media slides), top-left, at most 2 lines. Body 18-20pt; chart labels 14-16pt; source lines and footnotes 11-12pt in Secondary (light on media slides). Large KPI numbers 54-72pt in Accent. Word cards 60-80pt bold.
- **Grid:** margins 0.6 in; title block y 0.45-1.45 (no decorative line under the title); content zone y 1.7-6.55; footer at y 6.9: source line bottom-left ("Source: ..."), the small channel name "GJ 581g" at the bottom-right edge (x 10.73, w 2.0, right-aligned). **No slide numbers.**
- **Tracker:** a small chapter label above the action title (e.g. "2 | The basics") in Accent 12pt caps (light Accent on media slides).
- **Every content slide has an action title** (the takeaway as a full sentence), a source line if it shows data, and a footnote for caveats or definitions. Word cards and maps are the exception.
- **Charts:** native editable charts where possible; no 3D, no gradients, light or no gridlines, direct data labels, bar axes start at zero, the highlighted series in Accent and the rest in Primary/Secondary, units in the chart title. When a bar must appear on its own narration cue, draw it as an exact-scale shape (`col()`, or bars with a fixed inches-per-unit scale) and note the scale in the deck notes.
- **Frameworks:** tables with thin rules and light banding, 2x2 matrices, chevron process flows (`chev()`), driver trees, KPI tiles (`kpi()`), key-takeaway panels, harvey balls, and line icons from `toolkit/graphics/icons.py` (one set and stroke weight per deck) where they help the viewer read a step or a thought experiment, never as decoration on charts.
- **Maps:** when a number varies by country or region, a choropleth from `toolkit/graphics/mapmaker.py` placed full width, with the action title, source line and caveats as slide text; reveal it, then the highlighted country, on narration beats.
- **Paper profile slide:** report title, authors, publisher, year, sample, method, and peer-reviewed/working-paper status (`paper()` or `paperMedia()`); the title font shrinks for long titles. **Quote panel:** the verbatim snippet in a Panel-colored box with a large Accent opening quote mark (`quoteMark()`) and the attribution under it.
- **Ending:** the answer and the one-line takeaway, then a short "Next time" slide naming the next video. No subscribe ask.
- **Build-script gotchas:** wrap strings containing apostrophes in double quotes; keep text inside fixed columns. `deck/head.js` declares globals (`CFG`, `TH`, `HX`, `SNIPS`, `SNIP_PX`, the colour constants and helpers); a project's `slides.js` must not redeclare them: give project variables their own names (e.g. `THEO` for the theory list).

### Receipts, theories and thought experiments (toolkit 1.3)
- **Evidence cards** (layout `evidence-card`, and anywhere a number comes from a chart, survey table or paper that exists as a PDF and whose licence allows a crop): `CONTEXT=40 HL=<Callout> python3 toolkit/snips/snip.py source.pdf <page> "exact line" snips/<key>.png` keeps the page around the line and writes `<key>.json` with the highlight position; `evidenceCard(s, key, {x, y, w, rotate?, cite})` places it as a white card with a soft shadow and returns `card` and `arrow` names: fly the card in on its beat, then wipe the arrow in on the narration cue. For a receipts montage, stack 2-4 cards slightly offset and rotated (±2-4°), each on its own build 2-3 s apart. Web pages: print them to PDF first (`page.pdf()`). Keep the source's own headline in the crop.
- **Paper title blocks:** when a paper is introduced, its PDF is available and its licence is CC BY or CC0, show its real header as an evidence card. For papers without an open licence (or CC BY-NC / ND), typeset the title card: `python3 toolkit/snips/typeset.py title snips t_<key> "Exact title" "Author, Author and Author"`.
- **Hypotheses and verdict:** `hypotheses(n0, {video?})` draws the numbered theories; reveal one per build. `scorecard(n0, {video?})` ranks the slide's `verdicts` by score with 0-3 Callout dots and a one-line note; reveal rows one by one on the narration.
- **Pill labels:** `pill(s, text, {x, y, w, fill?, color?, line?})` draws a rounded capsule label for mechanism diagrams and thought experiments; combine with simple icons, arrows and a balance or chain, one element per ~3 s beat. Size pills from their text (about 0.13 in per character + 0.6).
- **Charts that draw:** reveal a line chart with `wipe-from-left` and columns one by one; annotate the key point with a Callout pill.

### Verbatim snips from research papers
**Check the licence first** (the research brief's `SNIP_LICENCES`):
- **CC BY or CC0, PDF available** (PDFs behind a browser check: `node toolkit/fetch/fetch_pdf.js <url> paper.pdf`; an accepted manuscript on OSF or PMC is fine, labelled as such): show the exact sentence as an image cropped from the paper.
  1. `HL=<Callout hex> python3 toolkit/snips/snip.py paper.pdf <page> "exact sentence" snips/<key>.png` and again with `NOHL=1` to `snips/<key>_plain.png`. Record each image's pixel size in `deck_config.json` `snip_px`.
  2. On the slide, `snipPanel(s, key, {y, cite})`: animate the plain copy in first and wipe the highlighted copy in on the narration cue. (In a Remotion video the same two images feed `PaperSheet`.)
  3. Check the cropped text word for word against the snippet in the storyboard.
- **No open licence, or CC BY-NC / ND:** typeset the same verbatim words with `python3 toolkit/snips/typeset.py quote snips <key> "exact words" [--pre "… "] [--post " …"] [--width <px>] [--hl <Callout>]`, which writes `<key>.png` and `<key>_plain.png`. Keep these short and credited, and say in the notes that short credited quotation is the basis so the user makes the final call.
If no PDF can be reached for an open paper, fall back to the typed quote panel.
(The snip scripts serve the Remotion video too.)

### Motion, transitions and audio in a deck
- Animation is subtle and purposeful: fade or wipe for builds, one element per narration beat, a visible change every 3-5 seconds. No bouncy effects.
- **Transitions:** every slide fades in 0.5 s (PowerPoint's "fast" speed). No push, wipe or cover transitions; set any storyboard `trans` of `push-left` to `fade` before building.
- **Audio:** narration; music only if Sam picked a track from a sampler; sound effects only as `gj581g-voice-music-montage` section 4 allows (at most 8 per minute, each tied to a build). Stock clips are muted (a commentary clip may keep its own audio when the commentary is about what is said).
- **Narration lives on each slide, never as one long track.** With `"narration_clips": "tts/vo"` in `deck_config.json` (toolkit 1.7.3), the build puts each slide's own `VO-NN.mp3` on that slide (off-canvas), playing 0.2 s into the slide on the same timeline as its builds and video, at full volume, stopping when the slide ends; nobody needs to set "Play in Background". (A single track drifts by every transition's length: seen on the Blindness deck, about 7 s out by slides 15-16.) Music in a deck: a single background track only when Sam picks one from a sampler (`gj581g-voice-music-montage` section 3), set to play across slides at a low volume.

### Building the deck
1. Plan each slide (format, media slot from the media plan, builds, footnote, source line). Build order matches the narration order.
2. Write `deck_config.json` (copy `toolkit/examples/blindness_v4/deck_config.json`): title, `slides_json`, `out_dir`, `audio` (the mixed narration track, used by the motion preview), **`narration_clips: "tts/vo"`**, `media_manifest`, `snips_dir`, `snip_px`, `offset` (0 for new projects), `theme`, `texture` and the palette.
3. Write the project's `slides.js` with the helpers in `toolkit/deck/head.js` (see `toolkit/examples/blindness_v4/slides.js`, `toolkit/examples/new_features/slides.js` and `toolkit/examples/v13_features/slides.js`): `frame(n, layout)` per slide, `T`/`R`/`L` shapes (`R(..., {round: true})` for panels that follow the theme's rounding), `A(s, i, names)` to tie storyboard build i to shapes (it fills `timing.json`), `VID()` for clips, `wordCard(n)` and `mapSlide(n)`, `hypotheses(n)`, `scorecard(n)`, `evidenceCard()` and `pill()`, plus `kpi`, `col`, `chev`, `paper`, `paperMedia`, `mediaHead`, `snipPanel`, `tag`, `strip`, `quoteMark`, `footnote`. Speaker notes (VO with markup, plain spoken version, source IDs, caveat) are added by `frame()` automatically.
4. Build: `toolkit/deck/build.sh deck_config.json slides.js --preview-mattes`. It makes the texture, concatenates head + slides + tail, writes the matte decks and the real deck (matte builds never overwrite `timing.json` and carry no narration), adds each slide's narration clip, applies timing and autoplay, and validates `deck/deck.pptx`. **Don't rebuild with `--preview-mattes` while the motion preview is rendering**; make late text fixes after it finishes with a plain `build.sh deck_config.json slides.js`.
5. Visual QA (required): render to images (LibreOffice to PDF, `pdftoppm`, after `toolkit/deck/preview_fonts.sh`; while another LibreOffice is running, use a separate profile: `soffice -env:UserInstallation=file:///<scratch>/lo2 ...`) and check every slide for overflow, overlaps, alignment, readability at phone size, contrast, values vs source map, snippet text exact; check media slides on `deck/preview_check.png` from the motion preview; check the clean-facts rules, no slide numbers, and evidence-card text readable at phone size. Fonts in the local render are look-alikes: tell the user to glance at one slide in PowerPoint when a new theme font is used for the first time. Fix and rebuild until clean. Check timing: every animated shape exists (`python3 toolkit/media/apply_timing_media.py deck/deck_raw.pptx deck/timing.json --list`), nothing animates after the slide ends, a visual change every 3-5 seconds. **Check narration sync:** every slide carries its own clip, has an audio play at 0.2 s, and the clip ends before the slide's advance time (0.2 s + clip length <= `advance_s`).
6. After narration (above), rebuild with `build.sh ... --preview-mattes` (the per-slide clips go into the deck from `narration_clips`) and have the media skill render the motion preview.
7. Deliver with topic-prefixed names (`<Topic>_GJ581g.pptx`, `<Topic>_preview.mp4`, `<Topic>_deck_notes.md`, `<Topic>_media_plan.md`, `<Topic>_narration_track.mp3`, `<Topic>_vo_clips.zip`). Deck notes: theme, palette, narrator, runtime and slide count, chapters with times, export steps (nothing to set up for the narration; never tick "Play in Background"; File > Export > Create a Video at 1080p with recorded timings and narrations), the media credits table, which slides loop, substitutions, snip licences, testing notes. Keep the deck under ~80 MB; files over 30 MB can't be copied to the user's computer by the bridge, so save the small files to `projects\<Topic>_v<N>` there and say the deck and preview are in the outputs.
8. Add the project to the project log in `STYLE_LIBRARY.md`.

### Testing notes
- Video autoplay is **confirmed working in real PowerPoint** (user check on the Blindness deck, October 2026); no per-deck video check is needed unless the autoplay XML changes.
- Per-slide narration (toolkit 1.7.3) uses the same play command as the videos plus an audio media node at full volume, hidden when stopped. If a narration clip ever doesn't start, select its speaker icon (just off the slide's right edge) > Playback > Start: Automatically.
- Build animations and transitions are schema-validated and render in LibreOffice; if a new effect type is used for the first time, ask the user to glance at the Animations pane.
- The motion preview shows clips and slide graphics but not build animations or transitions, plays the mixed narration track, and uses local look-alike fonts. It takes 10-60 min for a 36-slide deck: start it with `run_in_background` and wait on its log (`until grep -q '^wrote ' preview.log; do sleep 15; done`), not on `pgrep -f`, which matches the waiting command itself.
- Generated voices cannot be heard here; ask the user to listen to the preview and to play a few slides in PowerPoint.

### Editing an existing deck
Change `slides.js` or `deck_config.json` and rerun `build.sh`; to inspect a deck made elsewhere, read it with `python /mnt/skills/public/pptx/scripts/slide_text.py`. Keep object names stable so the timing still matches. To add motion backgrounds, follow "Adding media to an existing deck" in `decked-out-media`, then switch those slides to `CORP_MEDIA` and apply the media-slide color rules. To restyle a deck in another theme, change `theme`, `texture` and the palette in `deck_config.json`, set the media skill's footage `look`, regenerate snip highlights in the new Callout color and have the media skill re-prep the clips. A deck built before toolkit 1.7.3 (one narration track on slide 1) gets in-sync narration by adding `"narration_clips": "tts/vo"` to its `deck_config.json` and rebuilding. To turn an existing deck project into a Remotion video, follow `decked-out-video` (it reuses slides.json, the VO clips, prepared clips and snips; `toolkit/examples/blindness_remotion/` translates every Blindness slide).

**Inserting or removing a slide or scene** (numbers are absolute everywhere; tested on the Blindness v4 update; steps 1-4 and 6 apply to a Remotion video too):
1. Keep copies (`slides_pre_<reason>.js`, `project_pre_<reason>.py`, `tts/vo_backup`).
2. Insert the scene dict in `project.py` at its place.
3. Shift the narration clips from the insertion point up by one, highest first (`VO-35.mp3` -> `VO-36.mp3` ...), and add one to those numbers in `tts/vo/durations.json` (subtract for a removal).
4. Run `handoff.py project.py story`, voice only the new and changed scenes (`synth.py ... <voice> 23 24 33 34` in Kokoro, or `build.py project.json --lines <scene ...>` with the clone, after the changed rows pass the fact-check), then retime and fix any pace-lint failures by moving builds.
5. Deck only: in `slides.js`, add one to every slide number from the insertion point on in `frame(`, `mapSlide(`, `wordCard(`, `scorecard(`, `hypotheses(`, `sd(` and `mediaHead(s, ` calls (a regex on those calls only, after the insertion marker), then write the new slide's code.
6. In `media_specs.json` and `media/prepared/manifest.json`, add one to the `slide` of every clip from the insertion point on; have the media skill re-prep only clips whose length changed.
7. Deck: remix the narration track, rebuild with `--preview-mattes`, QA the changed slides as stills, render the preview, and record the change in the deck notes. Video: re-align the changed scenes and follow `decked-out-video`'s "Editing" steps.

**Restructuring a whole video** (Tokens v2, Nov 2026): write `project_v2.py` that loads the old `project.py` and builds the new `SLIDES` with `reuse(name, **changes)` from the old scenes by name, so every scene whose `vo` is unchanged keeps its already-approved clip (copy `VO-<old>.mp3` to `VO-<new>.mp3` and record the mapping in `tts/vo2/plan.json`); voice only the new and changed scenes. The video skill's `comp`/`wkey` fields let the reused drawings and word timings follow the new numbers.