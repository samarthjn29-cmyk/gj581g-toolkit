---
name: "decked-out-media"
description: "Plans, sources, licenses and prepares all media for a GJ 581g (Decked out Data) video, following its creative direction: footage, photos, textures, Manim, Lottie and other animations, music samplers, sound effects, free Adobe Stock, Unsplash, keyless and public-domain sources, and credits. Use when building a video or adding footage."
---

# GJ 581g (Decked out Data): media

## Channel updates, 1-2 Nov 2026 (these win over anything below)
- **Folder and toolkit:** the channel folder is `G:\My Drive\Decked out Data` (Google Drive for desktop; the Google Drive connector can read it too). The toolkit's master copy is the private GitHub repo `samarthjn29-cmyk/gj581g-toolkit`: clone it at the start, commit and push every fix. Any `C:\Users\samar\Documents\Decked out Data` path in older notes means the same place on G:. Read `toolkit/LESSONS.md` (the mistakes log) at the start.
- **Board and workflow:** `gj581g-producer` keeps `PRODUCTION.md` and owns the workflow (animatic -> punch-up -> locked script -> voice first (the narration MP3 and its listening checklist, which Sam reviews by item number) -> picture clip by clip from the approved takes -> one-render join, all through `toolkit/build/build.py`); read it at the start of a session and update it at each milestone.
- **Voice** (`gj581g-voice-music-montage` wins where this skill differs): Sam's saved cloned-voice profile, never sped up; the humour voice; talked delivery.
- **Music:** none in the money series pilot. Any music is chosen by Sam from a sampler this skill builds after the script is locked (section 3b), never placed unheard. "Investigations" (not urgent) and "Hitman" ("way too different from our topic") were rejected for the money series.
- **Sound effects are allowed** (2 Nov 2026): a small themed set per series, at most 8 per minute, each tied to an on-screen action (section 3d).
- **No silent holds** except in a video essay (S7 as the base style): storyboard `hold` is 0; only the natural gaps between sentences remain (a try-it window with a moving countdown is not a hold).
- **Decorative montage** may set mood between evidence shots; evidence shots still show the thing itself, honestly labelled. A clip that shows a named thing must show that thing.
- **Platform clips** (YouTube, TikTok, Instagram) for commentary only: the clip the video is talking about, at most 10-15 s, shown as itself with the creator's handle on screen and a credit in the description, never b-roll, never a large share of the video. News, broadcast and sports clips stay banned. **Game, app and website screenshots** under a creator policy, an open licence, or for commentary on that game or site; never decorative.
- **Ending:** a short "Next time" end card that names the next video (no subscribe ask), with the YouTube end-screen element in the top-right quarter.
- **Pacing:** `toolkit/story/pace_lint.py` (a picture change at least every 6 s, no treatment over 20 s, sound effects at most 8 per minute) is the pacing rule for Remotion videos; clip cuts are one of the ways to meet it. PowerPoint decks keep their own 3-5 s build rhythm (`decked-out-deck-builder`).

This skill owns the **media layer** of every video:
- which moments get footage, photos or animation, and where the media comes from and whether it may be used;
- how each clip is cut, graded, tinted and timed;
- photos and clips prepared for every placement the direction uses (full-screen, panels, windows, prints and screens on a board), and textures;
- original animations (Manim, Pillow, and Blender when the direction calls for it), small Lottie accents, and the occasional risograph print;
- music candidates and the sampler Sam chooses from, the sound-effect set, and the decorative montage;
- the channel-wide media library.

**The look and the media mix are decided per video** (since 31 Oct 2026) by the creative direction (`decked-out-styles` section 3). It sets the footage share (a fully drawn video is fine when the topic suits it), the palette and colour meanings, and the footage look. When a direction uses footage, **full-screen footage tinted in the Primary colour with content on top** remains a signature look the user loves (S8 plays footage inside an engraved note window instead). **Every clip must play smoothly** (see "Smooth playback" in section 4).

**You decide what goes where.** The user's standing instruction (Oct 2026): Claude decides which graphics, images and videos go where in each video and when to use them. Within the creative direction, make every media choice yourself, record each choice and the reason in the media plan, and don't ask the user to choose between visual options. **Music is the exception:** Sam picks it from a sampler (section 3b). The user reviews the result (the animatic, then the clips) and can redirect.

Videos are rendered with Remotion (`decked-out-video`) through `toolkit/build/build.py`. Older projects used `python3 toolkit/run.py video.json media` (it runs `prep.py`) and the `assets` stage. A PowerPoint deck is built only when the user asks; section 9 covers what a deck needs on top.

Owners, one per decision:
- `decked-out-styles`: the creative direction (palette, colour meanings, fonts, look, footage share) and the project log.
- `decked-out-research-story`: the storyboard (with `treatment` and `changes` per line, and a Media line per scene).
- `decked-out-deck-builder`: the narrator voice and the narration.
- `decked-out-video`: the scenes, the Manim style and timing rules, and the render.
- `decked-out-youtube-packaging`: credits the footage, music and sounds and may reuse a frame or photo for a thumbnail.
- `gj581g-voice-music-montage`: the rules for music, sound effects and the montage.
- `gj581g-scene-quality`: asset priority (vectors and stock first), pacing and layout.

## Toolkit (use it, don't rebuild it)
The tested scripts live in the user's toolkit: master copy in the GitHub repo `samarthjn29-cmyk/gj581g-toolkit`, working copy `G:\My Drive\Decked out Data\toolkit` on his computer. Version 2.0 added the media library `media/library.py`, 1.9.1 `graphics/riso.py`, 1.8 `media/parallax.py` and the Remotion engine, and 1.7.1-1.7.2 hold the smooth-playback fixes; 2.3 the mood-tagged library and vector libraries; 2 Nov 2026 the S8 sound set (`remotion/templates/s8_banknote/sfx/make_sfx.py`) and the one-command build. The board engine (3.0) and the Manim helpers (3.1, `graphics/manim/`) are built by `decked-out-video` when a direction first needs them.

At the start of a project, if the research-story skill hasn't already done it:
1. Clone the toolkit repo into `toolkit/` in the working directory. If GitHub can't be reached, and the computer is linked, stage the `toolkit` folder from `G:\My Drive\Decked out Data` instead (request access once if the folder isn't connected).
2. Read `toolkit/README.md` and `toolkit/LESSONS.md`.
Use the scripts rather than rewriting them. When you fix or improve one, commit and push it, copy it to the folder on G:, and bump the README version line. Commands below are relative to the project folder.

## Inputs
- `<Topic>_creative_direction.md`: palette (Primary hex for the tint), colour meanings, footage look and footage share, and which scenes use which visual language.
- The storyboard: the line-level script with `treatment` and `changes` (new projects) or `story/slides.json` with the Media line per scene, scene durations, planned `cuts` and the board plan (older projects).
- After narration: the final scene durations (clips are refitted to them) and the aligned word times (`timing.json`, or `words.json` in older projects) for Manim clips and sound cues.

## Outputs (the hand-off contract)
- `media_specs.json`: which clip or clip sequence goes on which scene, slot size, tint and look. `media/prepared/<name>.mp4` + `.png` for every slot, plus `media/prepared/manifest.json`: `{name: {slide, path, cover, dur, w, h, cuts, use}}`, where `use` is `full`, `panel`, `screen` or `print`. Each `.mp4` runs 1 s longer than its scene (last frame held), while `dur` stays the scene length; the `.png` is the clip's first frame. prep.py does all of this for footage. Manim, Blender and Pillow clips are added to the manifest by hand (section 5). Template projects (S8) may instead re-encode the chosen clip segment at 1280 px into `public/media/` and play it in the scene's window.
- Photos prepared for their placement, and textures.
- `media/manim/<name>.py` and other animation sources, plus the rendered clips; recoloured Lottie files in `media/lottie/`.
- Music: a sampler for Sam and, once he picks, the chosen track(s) (section 3b); none for the money pilot.
- Sound effects: the series set and the cue list (sound, time from aligned words, gain) in the project's mix (section 3d).
- `<Topic>_media_plan.md`: one line per scene (what goes there, where, and why), plus the counts (including sound effects per minute). Also the credits table for the project notes.
- New entries in the media library (`toolkit/media/library.json`).

## 1. Plan the mix
Targets come from the creative direction:
- **The footage share** it sets. As a guide: footage-led (S1) about 50-60% of the runtime; the board (S2) about 35-50% full-screen; hand-drawn (S3) 0-20%; cinematic inner-world (S4) 0-15%; montage essay (S7) 60-85%; S8 Banknote about 10-25% (footage in note windows). A new direction states its own.
- **The pace lint passes** (a picture change at least every 6 s), carried by clip cuts in footage and by builds, marks and camera moves elsewhere.
- **Motion by default:** stills move (push-in, parallax, drift) unless the storyboard gives a `STATIC` reason.

Media types (use those the direction calls for):
1. **Full-screen tinted footage (signature, when footage is used).** Full-screen footage, muted, tinted in Primary at 0.65-0.8 opacity, with the scene's content on top. **On full-screen scenes longer than about 10 s, cut 2-3 short clips together** so the picture keeps changing. Place the cuts on narration beats; this also avoids visible loops. In S8, footage plays inside the engraved window with a line-screen grade; keep the grade light enough that the subject reads.
2. **Panels and small screens:** a clip or photo beside the content, untinted (only the video's look), cropped to its slot. In board videos these are prints and screens pinned to the board.
3. **Interactive opener:** an original full-screen test in the first 30-60 seconds (count the bouncing squares; Ann and Barbara: who's better off?), with narration cues and a short window for the viewer to try, carried by a visible, moving countdown (and music only if Sam chose it) rather than dead air.
4. **Original animations and drawn diagrams** for experiments, mechanisms and tests that stock footage can't show honestly. Maps and event diagrams are drawn in Remotion code; prefer them to generic footage that could be mistaken for a real event. A mechanism that has to move is a **Manim** animation (section 5); a 3D object or space is light 3D in Remotion or, when the direction calls for it, a Blender clip.
5. **Evidence clippings and receipts montages:** real screenshots of sources as small credited clippings, landing every 2-3 s in a montage.
6. **Behind word cards** (optional): one slow, calm clip under a heavy tint (0.75-0.8), so the words dominate.
7. **Still images in motion:** a public-domain painting, print or photo with a slow push-in. Run `python3 toolkit/media/pushin.py photo.jpg media/us/<name>_pushin.mp4 <seconds> --size <WxH of the slot> --zoom 1.15 --center <x,y of the subject>` (sub-pixel, eased motion; don't use ffmpeg's zoompan, which judders). Label historical images (title, year). A photo with a clear subject gets a 2.5D parallax move instead (section 8).
8. **Risograph prints, sparingly** (section 8): at most 2-4 riso moments per video, never more than about one in five of its photo and footage moments, never two in a row.
9. **Icons and maps** (made here, placed by the video skill): line icons in the palette, and choropleth maps for any number that varies by country.
10. **Lottie accents, sparingly** (source 10 below): a small animated icon or micro-moment, recoloured to the palette. Never a scene's main visual.
11. **Decorative montage** (section 3c): mood clips, archive and public-domain paintings cut between the evidence shots, 2-4 s each, never carrying a number or a label that claims they are the event.
12. **Commentary clips** (section 3c): a platform clip or a game or app screenshot the narration is talking about, shown as itself.

Charts, verbatim snips, clippings and dense comparison tables stay flat and readable, with no footage behind them. Never use the same clip twice in one video. Write the plan to `<Topic>_media_plan.md` (scene, title, media type, placement, clips and search terms or idea, why or mood, status), together with the counts: footage share, panels, prints, screens, Manim or 3D clips, Lottie accents, riso moments, montage clips, commentary clips, music tracks (if any) and sound effects per minute. Keep it updated.

Footage choice:
- Echo the scene's idea without competing with it; a clip that shows a named thing must show that thing ("out celebrating with the shopping" -> groceries being carried, not a generic street).
- Clips in one cut sequence should belong together: same theme, similar light and pace, ideally the same shoot.
- Calm, slow, wide shots work best; avoid busy close-ups of faces behind text.
- **Use the sharp part of a clip.** Sample frames across the clip and pick the segment where the subject is in focus; slow that segment down rather than letting the clip run into a blurred or dark end (the Raise grocery clip turned to blur after 3 s).
- **Plan clip lengths:** each clip must cover its share of the scene (plus its offset). If it doesn't, add another clip to the sequence, or for calm content slow it modestly.

## 2. Board materials (board videos only)
- **Board texture.** One surface per project, matching the set. Source it like any photo (Unsplash `plus: "none"`, the free Adobe Stock collection) or generate it with `toolkit/deck/texture.py`. Requirements: flat, even light, shot straight on; no text, logos, pins or objects; at least 4000 px on the long side, or a seamless 2048-4096 px tile. Bake it as one JPEG at board size (default 7680 x 4320) or a tile, toned down slightly, save it to `media/board/<set>_texture.jpg` and log it. Props are drawn in code by the video skill.
- **Paper stock.** Paper, index cards and sticky notes use `paper.jpg` and the generated grid in the palette; a set may use another paper texture, sourced or generated and logged.
- **Photo prints.** Crop each to a print aspect around the subject at about 2x its on-screen size, keep it natural, apply the look lightly (no tint), save to `media/prints/<name>.jpg`. A print that starts a dive is also prepared as the full-screen still or clip it opens into, matching its first frame.
- **Screen insets.** Prepare clips for small screens with `"use": "screen"` and `"tint": 0`, cropped to the screen's aspect at about 2x its on-screen size. Archive film keeps its own look, at native resolution in a 4:3 screen.

## 3. Source and license
Check every item's licence on its own page and record it. **Every clip, image, texture, Lottie file, music track, sound effect and icon set in the video has a row in `media/licence_log.csv`** (in-house synthesised sounds get one row as "original, synthesised"). `openvideo.py`, `coverr.py`, `openimages.py` and `icons.py` write rows for their downloads; `openvideo.py log` records everything else.

**Never used, even with a credit line:** news channel, news site, broadcast and sports footage; and platform clips used as b-roll or for anything other than commentary on that clip. Commentary clips follow section 3c. Don't decide fair use for the user. Other such material reaches the video only in two ways:
- **As a clip the user supplies with a licence or written permission.** Log it first with `python3 toolkit/media/openvideo.py log <file> --source "..." --licence "..." --proof "<receipt, licence page or the permission message>" [--credit "..."]`, then prep and credit it like any other clip. No log row, no clip.
- **As a small credited screenshot** of a headline, chart or post, shown while the narration comments on it. Point out in the media plan that this relies on short, credited quotation being acceptable, so the user makes the final call.
For a "real people react" moment, suggest the user records a few people (with their consent) rather than borrowing reels.

**Only free assets.** The user's standing rule: use free assets only, never anything that costs money or uses up paid credits.
- Pexels and Pixabay need API keys the user can't get (Oct 2026), so they are used only by web download on Sam's laptop: he downloads, we log.
- Smithsonian Open Access and DVIDS also need keys, and the Art Institute of Chicago and the Library of Congress block the workspace.
- Adobe Stock (free collection only) and Unsplash (free photos only) come through the user's claude.ai connectors; check they are connected at the start.

**Services reviewed:** JSON2Video, Replicate, Wireflow and Vercel AI Gateway are not used (paid or duplicate; the user's decision, 31 Oct 2026). Splice is not used (paid). **Freesound CC0 is a source for sound effects** (sound effects allowed since 2 Nov 2026), logged like any asset; Replicate only for processing real footage if the user ever lifts the free-only rule for it.

**Start with the media library (toolkit 2.0).** `toolkit/media/library.json` indexes every clip, photo, texture, Lottie file and music track already vetted for an earlier video. It stores where each asset came from, not the files.
1. Before searching the web for a slot, run `python3 toolkit/media/library.py search <terms> [--kind video|photo|music] [--min-w 1920]`.
2. Re-download a hit with `library.py fetch <key> --dir media/lib`. The fetcher re-checks the licence, and Unsplash photos go through `download_asset` again, as its terms require.
3. Log it in this project's `media/licence_log.csv` like any download, and mark it with `library.py used <key> --project <Prefix>`.
Don't reuse the same hero clip or the same main music theme in two consecutive videos. Every new asset you vet goes in (`library.py add ...` or `library.py seed media/licence_log.csv --project <Prefix>` at the end), tagged by what it shows (and `music` or `sfx` plus the mood). Save `library.json` back with the toolkit. Music files live in `G:\My Drive\Decked out Data\media\music\`.

Sources, in order (after the library):
1. **Adobe Stock free collection** (via the user's Adobe connector, when connected). Best for specialist subjects (hospitals, laboratories, offices), 4K videos and clean textures.
   - Call `adobe_mandatory_init` once per conversation, then `asset_search` with `entityScope: "StockAsset"` and **always `filters.pricing: "free"`**, plus `contentType` and `orientation: "landscape"` for full-screen use.
   - Look at the `renditionURL` thumbnails before choosing. Skip results with `isGenTech: true` (AI-generated) and anything marked editorial use only.
   - License only free items, with `asset_license_and_download_stock` (`size: "1080"` for video, `"2400"` for photos). **If the tool ever returns `confirmationRequired` or a price quote, stop and do not confirm**: that item isn't free.
   - Download the presigned URL within an hour with `curl -L` into `media/as/`, then log it: `python3 toolkit/media/openvideo.py log media/as/<id>.mov --source "Adobe Stock #<id> (free collection)" --licence "Adobe Stock Standard License (free asset)" --proof "licensed free via the Adobe connector on <date>" --credit "Adobe Stock"`. Never use Adobe's paid generative tools.
2. **Unsplash** (via the user's Unsplash connector, when connected). Best for high-quality photos of places, everyday life, work and objects, and for textures.
   - Search with `search_photos` and **always `plus: "none"`**, `orientation: "landscape"` for full-screen use, or `search_illustrations`. Skip any result with `premium: true` or a `sponsorship`.
   - Read `description` / `alt_description`; they often name the real place, which the label must respect.
   - **Download only through `download_asset`** with the photo's `id`; append `&w=3840` to the returned URL for a 4K still and fetch it with `curl -sSL`.
   - Log it with the photographer's name and "Unsplash License (free commercial use, no attribution required)"; credit the photographer anyway.
   - Avoid shots with recognisable brands, logos, or a person's face as the focus behind a claim, and never present a photo as the event in the story.
3. **Mixkit** (stock video, no key; reachable from the workspace).
   - `python3 toolkit/media/mixkit.py search "busy street" "eye close up"` lists Free and Restricted items and writes `mixkit_results.json` (each search overwrites it; pass an item page URL to `get` for an id from an earlier search).
   - `python3 toolkit/media/mixkit.py get <id|item URL> ... --dir media/mk` downloads the best file and **refuses Restricted (non-commercial) items**. Many grocery and supermarket clips are Restricted; check the Free ones.
   - Check each download's orientation (`ffprobe`); portrait clips never go full-screen.
   - Log each clip you use with `openvideo.py log` (source "Mixkit #<id> (<title>)", licence "Mixkit Stock Video Free License", proof = the item page URL).
4. **Coverr** (stock video, no key): `python3 toolkit/media/coverr.py search ...`, then `get <id> --dir media/cv`. Free commercial use, no attribution required, not AI training. The script refuses premium, vertical and AI-generated clips and logs each download.
5. **Public-domain and openly licensed video** (Internet Archive trusted collections, NASA, Wikimedia Commons): `python3 toolkit/media/openvideo.py search <archive|nasa|commons> "term"`, then `get <source>:<id> --start S --len L`. Accepts only public domain, CC0, CC BY and CC BY-SA. Archival film is mostly 4:3 SD, so it belongs in a panel, a small screen or `ArchiveFrame` with its year; skip title cards with `offset`. NASA: no logo, no implied endorsement, credit "NASA". Commons is often rate-limited (HTTP 429). CC BY / BY-SA clips need their credit line.
6. **Museum and public-domain images** (no key): `python3 toolkit/media/openimages.py search <cleveland|met|nasa> "term"`, then `get <source>:<id> --dir media/img`. Show them as what they are (artworks with title and year), never as evidence of a study.
7. **Openverse** (`toolkit/media/openverse.py "query"`) for Creative Commons photos (small placements only); credit the author and licence, avoid NC and ND.
8. **Wikimedia Commons** (`toolkit/media/commons.py`) may rate-limit (HTTP 429); retry later or use Openverse.
9. **Icons** (no key): `python3 toolkit/graphics/icons.py <lucide|tabler|phosphor> <hex> media/icons name1 name2 ...` (Lucide ISC, Tabler MIT, Phosphor MIT), recoloured, transparent 512 px PNGs. One set and one stroke weight per video; credit the set.
10. **LottieFiles free animations** (Lottie Simple License), for small animated accents only: read the full licence text before the first use; free items only; no brands or characters; download the JSON into `media/lottie/`, log it, **recolour it to the palette**, place it with `@remotion/lottie`, at most a handful per video, never for data; credit the creators.
11. **Maps** (no key): `python3 toolkit/graphics/mapmaker.py data.csv map.png --palette deck_config.json --bins ... [--highlight IND]` draws a choropleth from Natural Earth (public domain). Values come from the source map. Remotion videos draw animated maps from `us-atlas` and `world-atlas` (credit "Maps: Natural Earth").

Checking candidates:
- Search 2-3 terms per slot and download 2-3 candidates each. Run `python3 toolkit/media/contact_sheet.py sheet.png media/mk/*.mp4` (or tile frames at 1 s, mid and late points yourself) and look before choosing.
- **Check resolution and orientation.** Full-screen slots need landscape sources of at least about 1920x1080; panels and windows need about 2x their on-screen size.
- **Check length and sharpness across the clip**, not just the first frame.
- **Check the first second** of every clip you'll use (frames at 0, 0.3 and 0.7 s), and set `offset` past fades, flash frames, focus pulls, camera shake or motion blur.
- For Adobe Stock and Unsplash, choose from the thumbnails first and license or download only the items you will use.

Honesty rules:
- Archival or government footage and museum images are shown as what they are, never presented as footage of the event in the story unless it is.
- No AI-generated stock presented as real, and no recognisable brands or logos.
- Label generic footage and photos that could be mistaken for the real event or study, on screen.
- Never use footage of real people in a way that implies they took part in a study.
- Never use stills or footage from copyrighted study videos or commercial films; make an original animation instead.
- Drawn reconstructions of real events are labelled as illustrations, and schematic animations carry a "Schematic" label.
- When nothing suitable and free exists, use a drawn or animated treatment instead, and say so in the media plan.

## 3b. Music (only what Sam picks)
Rules for music are in `gj581g-voice-music-montage` section 3; this is how to offer it. The sampler comes after the script is locked, so it plays under the real narration.
1. **Ask whether the video wants music at all** (the money series pilot has none). If it does, read the topic and the creative direction's mood.
2. **Shortlist 3-4 tracks that suit the topic**, library first (`library.py search <mood terms> --kind music`), then free sources: Kevin MacLeod's incompetech (CC BY 4.0; downloads directly from the workspace: `curl -s -o "<Title>.mp3" "https://incompetech.com/music/royalty-free/mp3-royaltyfree/<Title%20With%20Spaces>.mp3"`), Free Music Archive (filter CC BY or CC0, check each track's own licence), Pixabay Music and the YouTube Audio Library (Sam downloads on his laptop), or music Sam owns. Never a commercial track, never one whose attribution we can't give, never AI-generated music presented as human. Prefer tracks without vocals and with a steady level.
3. **Measure tempo and drive** (`librosa.beat.beat_track`, mean onset strength) and find where each track's drive kicks in; say these numbers in the offer.
4. **Build a sampler**: 12-15 s of each track under the narration at the real mix level (narration -16 LUFS; a music bed about -24 LUFS, sidechain-ducked so it sits at least 12 dB under the voice while he speaks), a beep or gap between options, as one MP3; send it with the options numbered. Use only the track Sam picks.
5. **Log** the chosen track in `media/licence_log.csv` (title, artist, licence, URL, proof, the exact credit line), add it to the library and to `G:\My Drive\Decked out Data\media\music\`, and hand the credit line to packaging. The storyboard gets its 2-4 cue changes now.
6. **Prepare:** trim and loop to length, 1-2 s fades; the build's mix ducks it under the narration (`build.py --from mix` for clips already built).

## 3c. Decorative montage and commentary clips
- **Montage clips:** search with mood words as well as literal ones; public-domain paintings from Wikimedia Commons and museum CC0 collections; archive film from Prelinger. Record each clip's purpose in the media plan ("mood: gamble"); never put a number or an event label on a decorative clip; a clip that shows a named thing must show that thing.
- **Commentary clips:** we can't download from YouTube, TikTok or Instagram in the workspace, and don't try. Sam records or downloads the 10-15 s clip on his laptop (or it is a Creative Commons clip, or one with the creator's written permission), and we log it with `openvideo.py log <file> --source "<platform, creator handle, video title, URL, date>" --licence "commentary use (Sam's decision, 1 Nov 2026)" [--proof ...] --credit "..."`. Show it as itself: framed, with the handle and date on screen, never tinted or used as b-roll.

## 3d. Sound effects (from 2 Nov 2026)
- **One small themed set per series.** The money series (S8 Banknote) uses an in-house synthesised set (`toolkit/remotion/templates/s8_banknote/sfx/make_sfx.py`: typewriter, stamp, register ding, whoosh, paper, coin): no licence needed, one log row as "original, synthesised". Other sounds: Freesound CC0, Mixkit sound effects or Pixabay, logged with the credit line when one is required.
- **Each sound is tied to an on-screen action** at its frame (a stamp landing, a number arriving, a push-in), cued on the aligned word times in the project's mix cue list.
- **At most 8 per minute, at least 1.5 s apart** (`pace_lint.py` checks the cue list); the Raise pilot v3 had 24 in 61 s and was cut to 8. None under a sentence the viewer must follow closely; about -26 to -30 LUFS short-term, under the voice.

## 4. Prepare clips
Write `media_specs.json`: copy `toolkit/examples/blindness_v4/media_specs.json` (`toolkit/examples/new_features/media_specs.json` shows a cut sequence). Its shape is `{"primary": "<Primary hex>", "look": {...}, "clips": {name: {src, slide, w, h, tint, offset, use}}}`, with slot sizes in inches (13.333 x 7.5 = full-screen).

For a cut sequence, `src` is a list of 2-3 clips (and `offset` may be a list). The scene's duration is split evenly between them, or at `cut_at` seconds to land on narration beats. Panel and screen insets that sit next to content usually use `"tint": 0`.

Then run `python3 toolkit/media/prep.py media_specs.json story/slides.json media/prepared`. It mutes and crops each clip to its slot, fits each clip to its share of the scene, applies the look and tints in Primary, joins cut sequences with hard cuts in one re-encode, saves the cover frames and the manifest, and lists looping clips, soft (upscaled) sources and clips slowed over 1.15x. Template projects (S8) may skip prep: re-encode the chosen segment (`ffmpeg -an -vf scale=1280:-2 -c:v libx264 -crf 23`) into `public/media/` and let the scene's `Window` grade, slow and drift it.

**Smooth playback (toolkit 1.7.1-1.7.2):**
- **Covers are the first frame.** Never hand-pick a "nicer" frame as the cover.
- **No repeated frames.** prep.py keeps each slot's native frame rate and slows a clip only by frame blending. A clip slowed over 1.15x by prep is a planning failure (move the cut, add a clip from the same shoot, or find a longer source); calm, slow content may go to about 1.3x. A deliberate slow-motion of a sharp segment in an S8 window (playbackRate 0.45-0.8) is fine when the content is calm.
- **Tails.** Every clip runs 1 s past its scene (last frame held).
- **Encoding.** H.264 High@4.1, CRF 24, yuv420p, a keyframe at least every 2 s, faststart. Never stream-copy different encodes together.
- **Checks after prep (required):** the cover equals frame 0; no exact repeated frames within the scene's duration in footage clips; the frames at 0-1 s are sharp and steady; each file is the scene length + 1 s. Fix and re-prep until clean.

**Look:** the top-level `"look"` grades every clip to match the creative direction before the tint: `{"grade": "none|sepia|bw|warm|cool|faded", "grain": 0-25, "vignette": true}`. A clip's own `look` overrides it. Apply the same grade (without tint) to panels, prints, screen insets and decorative montage clips. Never grade original animations that carry text or data, snips, evidence or commentary clips.

Rerun prep after narration (new durations), a palette change (re-tint) or a look change; pass clip names to redo only some. Re-render Manim clips and recolour Lottie files after a palette change, and re-render Manim clips and re-cut sound cues after a retime. When scene numbers shift, update the `slide` of every later clip in both `media_specs.json` and `media/prepared/manifest.json`.

## 5. Original animations
**Which tool:**
- Diagrams, charts, maps, event diagrams, typography, simple drawn scenes and light 3D (`@remotion/three`) are built in Remotion by the video skill.
- A mechanism, equation, graph or probability that has to move is made with **Manim**. Its style, timing and render rules are in `decked-out-video`, "Manim animations".
- **Blender** (Python) when the creative direction calls for real lighting, materials or cinematic 3D; its first use is that video's major new build, with a pilot.
- Small ready-made animated accents can come from **LottieFiles**, recoloured.
- Pillow (PIL) stays for frame-by-frame work already built that way and for riso and image processing.

**Manim clips:** write the scene in `media/manim/<name>.py` from the toolkit example, render at 1920x1080, 30 fps, timed to the aligned word times; run the smooth-playback checks; add it to the manifest with `use: full`, `tint: 0` and no grade; log it as an original animation. Never two in a row.

**Pillow animations:** draw frames with PIL in the project's palette and pipe them to ffmpeg (30 fps, H.264); see `toolkit/examples/blindness/try_it.py` and `gorilla_anim.py`. Keep shapes flat and clean, start on a complete, steady frame, and move things by sub-pixel amounts.

Kinds of animation:
- **Thought-experiment and mechanism style:** flat icons, capsule **pill labels** in caps, and simple props, one new element per beat.
- **Schematics instead of missing footage**, labelled on screen as a schematic.
- **Interactive opener:** instructions, a short try-it window (carried by a visible, moving countdown, and music only if Sam chose it), the reveal, and a replay. Base the test on a published method (cite it) without copying any study's video.
- **Mechanism animations:** a diagram that explains, not a recreation of copyrighted footage.
- Flat silhouettes need the cues that make them recognisable; look at a frame to check.

## 6. Credits and hand-over
- **Credits table** for the project notes: scene, use (full-screen, panel, window, screen, print, texture, Lottie accent, montage, commentary clip, music track, sound effect), title and id, page link, licence, and the credit line where required (from `media/licence_log.csv`), plus the icon set and "Maps: Natural Earth" when used. Check that every asset used has a log row. Add one line for original animations, drawn diagrams, props drawn in code and in-house synthesised sounds. Note which items appear as risograph prints.
- **Tell the user:**
  - the footage share of the runtime and the counts from the media plan (including sound effects per minute);
  - which moments use cut sequences, which clips loop or are slowed, and any soft (upscaled) sources;
  - the look, and the riso moments (2-4 at most);
  - the music: the sampler options with tempo, or the track he picked (artist, licence), or "no music";
  - any commentary clips Sam needs to capture on his laptop (creator, video, timestamps);
  - any moments drawn or animated for lack of free footage;
  - which Adobe Stock items were licensed, which Unsplash photos were downloaded and which Lottie files were used (all free);
  - how many came from the media library, and that the smooth-playback checks passed.
- **Library:** add every asset used (`library.py seed media/licence_log.csv --project <Prefix>`, then tag new entries) and save `toolkit/media/library.json` back with the toolkit.
- **Packaging:** give the packaging skill a one-line footage credit for the description, one music line per track Sam chose ("Music: <title> by <artist>, <licence>, <url>"; none when there is no music), a sound-effects line when outside sounds were used, a credit for each commentary clip, plus every required CC BY / BY-SA credit. For thumbnail backgrounds, point it to calm frames or a strong photo, and note any billboards, signs or faces to crop out.

## 7. Media in the Remotion video
- **Placement:** copy the prepared and rendered clips, photos, textures, music and sounds and recoloured Lottie files into the Remotion project's `public/` (older projects: `run.py assets`), where the scenes place them. Native frame rates, no repeated frames and clean first seconds still matter.
- Never add a blur-in to a video background (the user disliked a blurry clip start). Blur-to-sharp is only for stills and paper landing.

## 8. Parallax, risograph, split screens and baked looks
- **Parallax stills (2.5D):** `python3 toolkit/media/parallax.py photo.jpg public/<name>` cuts the subject out with rembg and inpaints the background, writing `<name>_fg.png` and `<name>_bg.jpg`. Bake extra blur into the background; check the cut-out on a magenta background; best for one clear subject. The same layers feed `TextBehind`.
- **Risograph prints (toolkit 1.9.1), used sparingly:** `python3 toolkit/graphics/riso.py image photo.jpg public/<name>_riso.png --inks <dark>,<callout>[,<light>]`; `riso.py video ...` for a clip (about 3 minutes per 10 s). Inks come from the project palette. Choose subjects with clear shapes and contrast. **Balance with normal images:** 2-4 riso moments per video at most, never two in a row; never riso data, snips, evidence, source cards, animations, commentary clips or archive film shown as archive.
- **Split-screen halves:** crop each source to 960x1080, keep its native frame rate, cover the scene length (+ `tpad=stop_mode=clone`), CRF about 22, a keyframe every 2 s, no audio, untinted.
- **Baked looks:** a constant look that would otherwise be a CSS filter on every frame is baked into a separate file, because per-frame filters slow the render a lot.
- **Size:** keep `public/` lean (remove unused clips, photos at about 2x their on-screen size); laptop packages travel as zips under 30 MB.

## 9. Only for a PowerPoint deck (when the user asks for one)
The deck builder places each clip from the manifest with `VID()` as the slide's first shape. Looks follow the deck's theme.
- **Autoplay:** `toolkit/media/apply_timing_media.py` (run by `toolkit/deck/build.sh`) adds a `play` effect for every clip (a `mediacall` par with `playFrom(0.0)` at the slide start, plus a muted `cMediaNode`). The user confirmed it works in real PowerPoint (Oct 2026). Keep this exact XML. Fallback: select the clip > Playback > Start: Automatically.
- **Seamless slide changes:** every slide uses a **0.5 s fade**, no push, wipe or cover transitions. If the user reports a jump, blur or stall, check the cover against frame 0 first.
- **Motion preview:** run `toolkit/deck/preview_fonts.sh` once; build with `toolkit/deck/build.sh deck_config.json slides.js --preview-mattes`; run `toolkit/media/preview.sh deck deck/<Topic>_narration_track.mp3 deck/<Topic>_preview.mp4` in the background and wait on its log; check `deck/preview_check.png`. The preview doesn't show build animations or transitions; say so.
- **Adding media to an existing deck:** source the clips (library first), add them to `media_specs.json`, rerun `prep.py` for those names, have the deck builder place them and rebuild, then update the preview, media plan, licence log and credits.

## Adding media to an existing video
Pick the moments and source the new clips, photos, music (Sam's pick) or sounds (library first), or write the new animation. Add them to the project, copy the files into `public/`, have the video skill update the scenes, and re-run the build for the affected clip: `build.py project.json --from mix` when music or sounds changed (the mix and pace lint must run again), `--from render` only for picture-only changes. Update the media plan, licence log, credits and library.