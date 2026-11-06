---
name: decked-out-youtube-packaging
description: Creates the YouTube packaging for a GJ 581g vector-animation video: an early working title and thumbnail concept per angle, then 10 titles, 4 thumbnails drawn from the video's own world, the description with chapters, sources and credits, captions and translations, pinned comment and tags. Use for packaging, titles, thumbnails or descriptions.
---

# GJ 581g: YouTube packaging

Rewritten 7 Nov 2026 (skills audit). Every video is a vector animation (`gj581g-vector-world`), and the packaging follows the Emergence study (`styles/EMERGENCE_CHANNEL_STUDY.md`, section 6). This skill runs twice:
- an **early pass** at the angle stage, called by `decked-out-research-story`;
- the **full pass**, once the picture is approved.

Files go to `projects\<Topic>_v<N>\packaging\` on G:. The reference file `references/title-patterns.md` still applies. `description-template.md` and `thumbnail-playbook.md` are retired; this file wins.

## Early pass (for each of the 3 angles, before one is picked)
- **Working title:** under 60 characters (count in code), honest and front-loaded, in the words viewers search (autocomplete, Reddit and comment phrasing from `gj581g-scout`).
- **Thumbnail concept**, in one line:
  - the hero object or scene from the planned world;
  - its light source;
  - the 2-3 word label;
  - the curiosity device;
  - how it pairs with the title.
- **Click risk**, in one line: too abstract, too close to a big video, a promise the evidence may not keep, or no strong hero object.

An angle with no strong thumbnail is a weak angle. The pair Sam picks becomes the brief. In the full pass it stays as one of the 10 titles and thumbnail A, unless the finished video found something stronger; then say why.

## Principles
- **Honest curiosity:** the title and thumbnail promise what the video delivers, no more.
- **One curiosity gap from two parts:** the thumbnail's words add the stakes, the question or the named idea. They never repeat the title.
- **Plain words:**
  - the words a first-day student would search, never jargon;
  - at most one number in a title;
  - no swear words in titles, thumbnails, descriptions, tags or the pinned comment;
  - no subscribe asks anywhere.
- **Facts:** every number, claim and caveat in the packaging has passed the fact-check (its CSV row reads OK; packaging-only figures get their own rows), worded no stronger than the video. Caveats travel with the claims.
- **Clean:**
  - no real brand logos;
  - no recognisable faces apart from a credited medallion portrait of a historical figure;
  - no frames from other creators' videos;
  - no imitation of another channel's look.

## 1. Titles
- **10 titles under 60 characters** (count in code), grouped by emotion: curiosity, surprise, worry, awe, humour, hope. Recommend the top 3, one line each.
- **Include the two breakout shapes:**
  - a debate question: "Is X Just Y, or Is Something Z?";
  - a news hook plus a named idea: "The Dark Knowledge of AI".
- **Other shapes:** "The [year] [experiment] That Explains [now]", "Which [X] Were You?", "What if...".
- **Series tag:** when the video is part of a series, put the series name and number in the title if it still fits under 60 characters, otherwise first in the description.
- **Test & compare:** run it on titles for every upload, and record the winner on the board and in `claude/PEER_WATCH.md`.

## 2. Thumbnails (4, clearly different)
- **The hero:** one illustrated object or scene from the video's own world, lit as in the video (glow, rim light, grain, vignette), in its palette. Rendered as a Remotion still from the video's own components:
  - a `<topic>_thumbs.jsx` beside the scenes;
  - drawn at 1920x1080;
  - rendered with `--scale=0.6666666666666666` to 1280x720.
  - No stock photos, paintings or 3D renders. A medallion portrait may support the hero; a silhouette figure may support it, never be the whole picture.
- **Text:** a 2-3 word caps label in a dark box (Inter or JetBrains Mono caps), or a short Cormorant serif phrase.
  - Devices: a strike-through or an arrow ("BET -> MESS"), a year ("Never. 1843").
  - Main words readable at 170 px wide.
- **Four different registers,** so Test & compare has real alternatives:
  1. a hero close-up;
  2. a wide lit set with one silhouette;
  3. a medallion portrait with a phrase;
  4. a serif-phrase card.
  `styles/THUMBNAIL_LIBRARY.md` holds style ideas to mix within the device system.
- **Rules:**
  - one focal point, truly centred where it is meant to be;
  - strong contrast;
  - the bottom-right 140x60 px kept clear for the duration badge;
  - nothing important within 40 px of the edges;
  - PNG or JPG under 2 MB.
- **Check:** look at each image yourself, then the dark feed mock (`toolkit/thumbs/templates_v2/feed.html`, 380 px wide) and a strip at about 170 px. Fix and re-render until clean.
- **Files:** save as `<Topic>_thumb_A.png` ... `_D.png`, plus `_thumbs_sheet.png` and `_thumbs_feed.png`. Recommend three for Test & compare, and record the winner in the thumbnail library's post-publish log.

## 3. Description (Emergence's honest shape; count characters in code, aim for about 4,700 of YouTube's 5,000)
1. **Cold open:** a paragraph in the video's voice, with the main search words in its first two lines.
2. **"So ...?":** the question the video answers.
3. **"Along the way:"** the stories, in one breath.
4. **Chapters:** from the paced timing (`timing_b.json`, scene starts). The first starts at 0:00; at least 3, each at least 10 s. Titles match the on-screen chapter marks, under about 50 characters.
5. **Sources by chapter:**
   - DOI, arXiv, or a primary text (e.g. Perseus for classics), plus Britannica or the Stanford Encyclopedia of Philosophy (SEP) where used;
   - company or advocacy figures are flagged as the source's own claims;
   - never drop a source to fit: shorten titles first.
6. **"If we got something wrong, the correction will be pinned."**
7. **Credits:**
   - "Illustrations: Adobe Stock #..., recoloured" (every ID);
   - "Props: Fluent Emoji (Microsoft, MIT)" when used;
   - each medallion portrait ("photo: Adobe Stock #..., cut out and flat-toned");
   - "Music: original ambient bed (GJ 581g)" or the library track's credit;
   - outside sound effects when their licence asks;
   - any Firefly image ("AI-generated illustration").
   Everything comes from `media/licence_log.csv`.
8. **The voice note:** "Narration: computer-generated from the creator's own voice." Tick YouTube's altered or synthetic content box.
9. **3 hashtags.**

## 4. Captions, pinned comment, tags
- **Captions:** the English `.srt` from `story/timing_srt.py timing_b.json <Topic>_captions.srt`, plus translations: Hindi first, then Spanish, Portuguese (Brazil), Indonesian, French and German. Each is uploaded as its own track. Nothing is burnt in.
- **Pinned comment:** a debate question tied to the video's closing question (not "what do you think?"), plus a link to the newest video.
- **10 tags:** the topic, the stories' subjects, the key terms, the channel name (GJ 581g).

## 5. Save, present, before-you-publish
- **Files:** save `<Topic>_packaging.md` with the titles, thumbnails (file names and paired titles), the Test & compare pick, the description, the pinned comment, the tags and the checks. Send it with the thumbnails and the caption files, and save everything to G:.
- **Before-you-publish checks:**
  - captions and translations uploaded;
  - the end-screen element in the top-right quarter in the last 5 s;
  - the synthetic-content box ticked;
  - every source and credit link opened once;
  - chapter times re-checked after any re-voice;
  - `factcheck_sync.py --fresh` re-checked on the upload date;
  - three thumbnails and the title test loaded into Test & compare.
- **Board:** packaging delivered; then the upload, the Test & compare winners, and the 7- and 28-day reviews.
- **Repackaging:** when repackaging an updated video, archive the old packaging with its version prefix first.
