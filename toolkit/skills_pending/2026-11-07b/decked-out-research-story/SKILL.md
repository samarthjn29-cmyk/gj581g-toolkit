---
name: decked-out-research-story
description: Finds a topic and turns it into a story-led, fact-checked script for a GJ 581g vector-animation video: angles with packaging first, research and source map, openings, plain-words writing, storyboard fields, the independent fact-check gate. Use for a new video, "next video", "make a video about [topic]" or a script. Starts the pipeline.
---

# GJ 581g: research, story, script and fact-check

Rewritten 7 Nov 2026 (skills audit). This skill now also holds what used to be in `gj581g-first-lecture` (plain words) and `gj581g-openings` (opening options).

The format is `gj581g-vector-world`: one true story per chapter, an illustrated world, a parallax camera, lit scenes. Narration is covered in `gj581g-voice`, packaging in `decked-out-youtube-packaging`, and the board in `gj581g-producer`. Of this skill's reference files, `references/story-selection.md` (the scoring rubric) still applies; the other reference files describe the old deck format and are retired.

## 0. Setup
- **Toolkit:** clone `samarthjn29-cmyk/gj581g-toolkit` and read `LESSONS.md`. Read the board (`PRODUCTION.md`) and the activity log.
- **Project folder:** `projects\<Topic>_v<N>\` on G:, with `story\`, `voice\`, `stills\`, `clips\` and `sources\`. Pick a file prefix at the start (`Cave_`) and use it on every file. Save files to G: as you go.

## 1. Topic and angle (checkpoint 1 with Sam)
- **The topic formula:** a big idea (philosophy, art, mind, science, money) taught through **one true story per chapter**: a person, a place, a year. Best of all is a human phenomenon paired with a modern twin (an old idea that explains something today).
- **Inputs:**
  - `gj581g-niche-scout` (demand, gaps, news pegs);
  - the latest `gj581g-peer-watch` run;
  - `gj581g-similar-videos` (study the same topic before scripting);
  - `styles/EMERGENCE_CHANNEL_STUDY.md`.
- **Three angles.** For each, give:
  - the basics needed (2-4 concepts, with sources);
  - the stories, one per chapter;
  - the parallel or paradox;
  - 1-2 coined ideas;
  - the world it can be drawn in (the sets);
  - its hero object for the thumbnail.
- **Score each angle** with `references/story-selection.md`: surprise, everyday relevance, emotional pull, visualisability, evidence strength and tension, 1-5 each, out of 30. Reject any angle with evidence strength 2 or below, or one that needs heavy jargon.
- **Prefer the two breakout shapes:** a debate question ("Is X Just Y, or Is Something Z?"), or a news hook plus a mysterious named idea.
- **Packaging first:** run the early pass of `decked-out-youtube-packaging` for each angle (a working title under 60 characters plus a one-line thumbnail concept). The pair Sam picks is the brief:
  - the opening delivers the title's promise;
  - the thumbnail's hero appears in the video;
  - a promise made on an earlier video's ending is kept.
- **Replication check:** for every key effect, search replication, failed to replicate, retraction, correction and meta-analysis. Use the newest large studies.

## 2. Research
- **Connectors first:** their summaries are leads, not sources.
  - **Consensus `search`:** at most 3 searches at a time; wait 30 s after a rate limit. When showing results to Sam, cite [n], list the hyperlinked titles and copy the tool's closing message word for word.
  - **PubMed:** `search_articles` -> `get_article_metadata` -> `get_full_text_article`.
  - **bioRxiv:** a preprint never carries a headline claim alone, and is labelled "Preprint" on screen.
  - **alphaXiv:** take numbers only from `get_paper_content` with `fullText: true`.
  - **MoSPI:** record dataset, indicator, base year and units.
  - **Also:** statistics agencies, central banks, primary texts (e.g. Perseus for classics), Britannica and the Stanford Encyclopedia of Philosophy (SEP).
- **Full text behind bot walls:** metadata from Crossref or Europe PMC; the page itself through the built-in browser (`get_page_text`). Never solve a CAPTCHA.
- **Save every source you read** as `sources/S<id>_<name>_<date>.txt` with its URL. Read results and discussion in full.
- **Claims list before drafting:** `story/<Prefix>_claims.csv` with `id, claim, figure, primary source + URL, date, exact quote, computed-by`.
  - Derived figures are computed in the project's own `story/calc.py`, never by hand.
  - Each factual line carries its claim id in `src`.
  - News and Wikipedia are leads until the primary source is found.
- **Credibility:**
  - never invent, round or tidy a statistic;
  - keep the hedge words;
  - never mix samples, countries, units or years;
  - when two fair measures disagree, show both or say "roughly";
  - separate correlation from causation;
  - qualifiers travel with the number;
  - no straw-man myths;
  - no invented first-person anecdotes;
  - stories told only as far as the sources go, and anything illustrative is labelled.
- **Quotes:** under 15 words, verbatim, checked in two reads of the full text. Attribute them exactly. In a dialogue, name the speaker ("Plato has Socrates add").

## 3. Length (by value)
- **The runtime has to earn its value:** cut repetition first, never a fact or caveat that changes what the viewer should believe. Emergence runs 18-30 min; pilots and shorts run about 60 s. Show the maths: runtime, word budget, number of chapters.
- **Word budget:** plan at 2.6 words a second of paced narration (about 155 words a minute). After voicing, `breathe.py` brings the clone from about 190 to about 160.

## 4. Structure (Emergence story shape)
- **Opening** (lands by about 0:50 in a long video, 0:12 in a short):
  1. One vivid present-tense scene.
  2. Optional parallel scenes.
  3. One question.
  4. A roadmap line.
  A person or case appears in the first 30 s.
- **Chapters:**
  - Numbered, titled as story moments ("The wall", "The climb").
  - Each is one true story and teaches one idea inside it: the person first, then the concept, then the term.
  - Each ends on a one-line "so far".
  - A story reset (new place or person) at least every 3-4 minutes.
- **Ending:**
  1. A recap of the stories in one breath.
  2. A turn to the viewer.
  3. The opening question again (word for word if the opening was a surprise claim).
  4. Optionally a "Next" card naming the next video.
  No subscribe ask.
- **Retention devices:**
  - 2-3 plants flagged aloud ("Hold that thought."), each paid off by name;
  - a mid-video turn (a second one past 8 min);
  - a fairness turn at about 75-90% with a "how to check" line;
  - one misconception said out loud and corrected;
  - a motif phrase repeated (`"motif"` in the script file);
  - one running metaphor with at least 3 returns (at most 3 metaphors in total);
  - 1-2 coined ideas, always in the same words;
  - one interactive test for the viewer per long video (a word list to remember, a guess before the reveal).
- **Every scene teaches or reveals one thing.** Cut scenes with no job.
- **A 60-s short from each long video:**
  - 0-3 s: the object or line;
  - 3-8 s: the question;
  - 8-35 s: one passage with at most 2 numbers;
  - 35-50 s: the reveal;
  - 50-60 s: a loop line to the long video.

## 5. Openings (checkpoint 2 with Sam)
- **Before scripting,** send Sam 3-4 opening options from `styles/OPENINGS_LIBRARY.md` (O1-O14), each inside the vivid scene -> question -> roadmap shape.
  - At least one surprise or mystery type (O2, O3, O5, O6, O13, O14).
  - Different types from each other, and not the previous video's type.
  - Each option gives the type, the first 2-3 spoken lines, the picture, the payoff and the risk. End with a recommendation.
  - Facts in the options get a quick primary-source check; mark the rest "to verify".
- **Record Sam's pick** in the brief and on the board. Tag the lines `opening: "O<n>"`, and write the payoff line at the same time as the opening.
- **Mystery openings:**
  - the claim is true as worded (or true with a caveat said aloud);
  - one clue per chapter;
  - the payoff restates the opening line;
  - if the claim fails the fact-check, change the opening, never the facts;
  - the packaging never gives away the reveal.

## 6. Plain words (the first-lecture rules)
- **The viewer is an 18-year-old on day one** who leaves the moment they feel lost.
- **Number budget:**
  - at most 3 spoken numbers a minute;
  - one key number per chapter;
  - never two numbers in one sentence unless the comparison is the point;
  - one "ladder burst" per video (up to 4 numbers on one unit ladder, `"ladder": true`).
  - Round and translate ("about five percent"), give every number a human-size version, and say years only when they matter.
  - The fact-check row keeps both the exact figure and the spoken form.
- **Concept before term:** show it happening to a person, then "That's called...", then the same name every time.
  - At most one new term per chapter, 3-4 per video, each with a Lexicon card (`gj581g-vector-world` §4).
  - No acronym before its plain version. Say what a term is not, when it's easy to confuse.
- **Craft:**
  - median sentence 8-11 words, about a third six words or fewer, none over about 25;
  - questions as hinges, 1-2 a minute;
  - "you" often, "I" rarely;
  - wonder over jokes (humour rules are in `gj581g-voice` section 8).
  - Banned: "Let's dive in", "In today's video", "Welcome back".
  - Claims never stronger than the evidence.
- **Fresher test, on every draft before lock:**
  1. Run `python3 toolkit/story/simple_lint.py <script.json> [timing.json]`. Fix every FAIL; fix or justify every WARN.
  2. A separate agent, which hasn't seen the research, reads the script as a first-day student and lists everything it can't follow. Fix every point.
  3. Put the results in the script review file.

## 7. Storyboard data
- **One entry per narration line,** grouped by `scene`. The reference is `projects\Cave_v1\story\Cave_script_v1.json`.
- **Fields:**
  - `id`, `scene`, `who` (narrator / heckler / character), `text`;
  - `say` (the clone's respelling), `must`, `tight`;
  - `treatment` (world-travel, pov, map, panel-chart, surface-data, portrait-badge, lexicon, title, meta);
  - `changes` (the words where the picture visibly changes; `["word", k]` for a repeat);
  - `src`, `opening`, `ladder`, `energy`, `pattern`, `sfx`;
  - **`media`** on the first line of each scene: all the on-screen device text (chapter mark, Lexicon term and definition, badge name, role and dates, date tags, kind labels), so it is fact-checked like narration.
  - At file level: `title`, `motif`.
- **Pace lint:** `python3 toolkit/story/pace_lint.py <script.json> [timing.json]` must pass: a listed change at least every 6 s, no treatment over 20 s, sound effects at most 8 a minute. Camera travel, a light change or a figure's move counts when its word is in `changes`.
- **Script review for Sam:** `<Prefix>_script_review.md`, with per scene the spoken lines, an "On screen" line and the source tags, plus what the fact-check changed and the fresher results.

## 8. Independent fact-check (the gate)
- **Who checks:** a fresh general-purpose Agent (never a fork), started in the background as soon as the script exists. It follows `toolkit/story/FACTCHECK_CHECKLIST.md`.
  - **Pass 1, per claim:** primary source, exact match recomputed in code, scope, freshness, hedge strength, listener test, on-screen text, and whether the illustrated scene matches the source (e.g. "he can barely see", not "he stumbles").
  - **Pass 2, the whole script as a doubtful first-time viewer:** consistency, hidden assumptions, causal claims, and the second voice never saying a number.
- **What it gets:** the checklist, the todo file, the script, the CSV and `sources/`.
- **What it returns:** OK / NO CLAIM / FIX / OVERSTATED / WRONG, with evidence and exact replacement wording. It never edits the script.
- **The loop:**
  1. `python3 toolkit/story/factcheck_sync.py story/<Prefix>_script.json story/<Prefix>_factcheck.csv --update`. This makes one row per line plus `media:<scene>` rows, and a `.todo.md`.
  2. Apply the fixes, using the checker's wording.
  3. Run `--update` again. A fresh agent checks only the todo rows. A replacement applied verbatim may be marked OK with a note.
  4. `--stamp ID ...` or `--stamp-all-ok`.
  5. Repeat until a plain run exits 0.
  - Never hand-set OK without a checker verdict. The tool keeps `.bak` and writes through `.new`.
- **The gate:** `project.json` has `"factcheck": "<csv>"`, and `build.py` refuses to voice with the clone if any row is missing, pending or stale. A pilot can use `"factcheck_waiver"` instead. Every later edit, including Sam's, goes through the same loop. A revision line quoted to Sam is "(unchecked)" until its row passes.
- **Before upload:** run `factcheck_sync.py ... --fresh` and re-check the time-sensitive lines and the packaging figures.

## 9. After the lock (checkpoints 3-6)
- **Lock:** the script is locked when Sam is happy, every fact-check row passes and the fresher test is clean.
- **Next steps:**
  1. Clone MP3, then `breathe.py`, then the paced MP3 + bed sampler + listening checklist (`gj581g-voice`).
  2. Style frames.
  3. 720p draft.
  4. Final.
  These are all in `gj581g-vector-world` section 6. A Kokoro animatic happens only if Sam asks for one.
- **Tell Sam the next step** at the end of each stage, and update the board.
- **Updating a finished video:** audit first, keep a `_pre_<reason>` copy, re-fact-check the changed rows, re-voice with `build.py --lines`, and archive the old outputs.
