---
name: gj581g-producer
description: Run at the start and end of every GJ 581g session and at each milestone: catches up from the activity log, reads and updates the production board (PRODUCTION.md), logs every finished thing, keeps decisions and hand-offs so nothing is lost between sessions, and routes work to the right channel skill.
---

# GJ 581g: producer (work management)

GJ 581g explores new ideas, one at a time (Sam, 7 Nov 2026). Every video is a vector animation built the Emergence way. The channel has six skills, and this one is the thin layer above the other five: one board, one activity log, one mistakes log and one hand-off, so a new or compacted session picks up exactly where the last one stopped. It never does the stage work itself.

| Task | Skill |
|---|---|
| Idea, angle, research, opening, script, plain words, storyboard, fact-check | `decked-out-research-story` |
| Look, palette, sets, art sourcing, camera, light, figures, devices, scenes, renders, checks, captions | `gj581g-vector-world` |
| Narration, clone, pacing (`breathe.py`), MP3 review, humour delivery, music bed, sound effects | `gj581g-voice` |
| Titles, thumbnails, description, pinned comment, tags, A/B tests | `decked-out-youtube-packaging` |
| What to make next, peer channels, the same-topic video study before a script | `gj581g-scout` |
| Board, log, hand-off, routing, audits | this skill |

**Precedence:**
- **On workflow,** this skill wins.
- **On look, art, devices, captions and the build,** `gj581g-vector-world` wins.
- **On anything the viewer hears,** `gj581g-voice` wins.
- **On research, script and fact-check,** `decked-out-research-story` wins.
- Every skill wins over its own reference files.

## Where things live
- **Channel folder:** `G:\My Drive\Decked out Data`, on Sam's computer through the device link (Google Drive for desktop).
- **Project folders:** `projects\<Topic>_v<N>\`, with `story\`, `voice\`, `stills\`, `clips\` and `packaging\`.
- **Toolkit:** the private GitHub repo `samarthjn29-cmyk/gj581g-toolkit` is the master copy; `toolkit\` on G: is a working copy.
- **Activity log:** `ACTIVITY_LOG.md` at the G: root and `claude/ACTIVITY_LOG.md` in the project. It is append-only, newest first: `- YYYY-MM-DD HH:MM IST | chat | what | where | next`. Never edit another chat's line.
- **Mistakes log:** `toolkit/LESSONS.md` records every error, its root cause and its guard. Its guards are binding.
- **Board:** `PRODUCTION.md` on G: and `claude/PRODUCTION.md` in the project.
- **Sam's voice profile:** `voice_sample\sam_voice_v1\` on G: only. It is private biometric data, never GitHub (`gj581g-voice`).
- **Project docs** (claude.ai project "Youtube Video Creation", mirrored on G:):
  - `styles/EMERGENCE_CHANNEL_STUDY.md` (the format's source)
  - `styles/OPENINGS_LIBRARY.md`
  - `styles/BRITISH_HUMOUR_TOOLKIT.md`
  - `styles/THUMBNAIL_LIBRARY.md`
  - `styles/REFERENCE_ANALYSIS.md`
  - `styles/STYLE_LIBRARY.md`
  - `claude/SIMILAR_VIDEOS_STUDY.md`
  - `claude/PEER_WATCH.md`
  - `claude/NICHE_INSIGHTS.md`
  - `claude/IDEAS.md`
  - `claude/ACTIVITY_LOG.md`
  - `claude/PRODUCTION.md`
- **Paused work:** the money series "The Dollar Yardstick" (`series/DollarYardstick.md`) and video 3 (`projects\Trial_v1\`). Files are kept; nothing is redone unless Sam asks.
- **Rules for Sam's laptop:**
  - Laptop copies stay under 30 MB.
  - Never delete files on his computer without his permission.
  - If the computer's file tools are missing, the link has dropped. Ask Sam to open the task in the Claude desktop app and choose "Link to this computer", and keep working in the workspace meanwhile.

## The board
Sections, in this order:
1. **Now:** at most three items, in priority order, each with its next concrete step. A decision waiting on Sam is marked **Decision pending**.
2. **Backlog:** one line each.
3. **Standing decisions (newest first):** dated, one line, in Sam's words where possible.
4. **Hand-off:** what is delivered, what is running, the open decisions, and the first step next time.

**Writing the board:** never write blind.
1. Stage the G: copy, diff it against yours, and merge, keeping every line other sessions added.
2. Write the result to G: and to the project.
3. List G: again and check the size. Google Drive has put older copies back several times.

## Session start: the catch-up
1. **Activity log:** read the top of it (project copy, then G:; the longer one wins). `git pull` the toolkit and run `git log --since=<newest log entry>`. Read the scheduled tasks' outputs (`toolkit/niche/reports/`, `toolkit/peerwatch/reports/`). Log anything new as "found at catch-up".
2. **Board:** read it from G: when linked, otherwise from the project. If the two differ, the newer one wins; say so.
3. **Toolkit lessons:** read `toolkit/LESSONS.md`.
4. **Background work:** check for anything that may have finished: `build/status.json`, `build/build.log`, renders in `out/`.
5. **Tell Sam:** say in three to five lines where things stand and what you're about to do.
6. **Start:** open the skill the first task needs (table above).

## The workflow (one video)
1. **Scout:** ideas and the same-topic study (`gj581g-scout`).
2. **Angles:** three angles with packaging first. **Sam picks.** Then the opening options; **Sam picks** (`decked-out-research-story`).
3. **Script:** research, claims list, script, fresher test and the independent fact-check. **Lock** when Sam is happy and every row passes.
4. **Voice:** the clone MP3, then `breathe.py`, then the paced MP3 + music-bed sampler + listening checklist. **Sam approves the MP3 and picks a bed. Nothing renders before this** (`gj581g-voice`).
5. **Picture:** style frames, then a 720p draft (or 60-100 s clips for a long video), then Sam's numbered notes, then the final. **An approved clip or video is frozen;** new ideas go to the next video (`gj581g-vector-world`).
6. **Captions and packaging:** closed captions plus translations, and the packaging (`decked-out-youtube-packaging`). Sam uploads.
7. **Post-publish review** at 7 and 28 days (below).

## Engineering guards (details in LESSONS.md)
- **Memory:**
  - Never voice and render at the same time. Never run two renders. Never render stills or rasterise big files while the clone voices (exit 137).
  - Use one voicing process per scene. Long scenes are voiced in parts that resume after a kill.
- **Background jobs:**
  - Run long jobs with the tool's background mode, and watch them with a monitor whose filter also matches failures (Traceback, Killed, FAIL, Error).
  - Background jobs stop at 2 hours; resume the build with `--keep`.
  - Stop the build before render when a scene needs re-voicing.
- **Processes:** never `pkill -f` or `pgrep -f` a pattern that appears in your own command line (exit 144). Kill by PID.
- **Git:** commit and push every toolkit change before ending a turn (`git pull --rebase` first). LESSONS numbers are shared, so take the next free one.
- **Text matches tools:** when a skill says a tool does something, the tool must really do it. Change one or the other, never leave them apart.

## Choices that go to Sam
- **Voice and music:** short samplers under the real narration. Never pick music he hasn't heard.
- **Angles and openings:** numbered options with a recommendation.
- **Look, scenes and visuals:** Claude decides as creative director and says in one line what was chosen and why. A new standing device goes to Sam first.
- **The narration:** the paced MP3 with its listening checklist, reviewed by item number.
- **Facts:** never Sam's job to catch. The independent fact-check does it.
- **Plan first:** when Sam asks to hear the plan first, send it with its cost and wait.

## During the session
- **Decisions:** when Sam decides something that will still be true next month, add a dated line to Standing decisions in the same turn. If it changes how a stage works, propose the skill change too.
- **Problems:** when Sam flags a problem, or a build fails for a new reason, add a line to `LESSONS.md` and fix the same kind of problem everywhere it occurs.
- **Log every finished thing in the same turn:** files, approvals, decisions, toolkit changes, scheduled tasks. Write the project copy, then the G: copy (stage G: first and merge).
- **Before a milestone that freezes something,** re-read the top of the log and the board for anything written since this session started.
- **Delivery:** every deliverable goes to the chat (SendUserFile) and to G: (`device_commit_files`, under 30 MB).
- **Hand-off:** write it early, after each milestone, because compaction drops anything not written down.

## Session end
1. Add the last log line and the hand-off.
2. Save the board and the log to G: and the project; commit and push the toolkit.
3. Reply in two or three lines: what is done and what is waiting on Sam.

## Review cadence
- **Post-publish, 7 and 28 days after each upload:**
  - read the YouTube Studio retention curve in the built-in browser;
  - note the three biggest drops against the script;
  - log the Test & compare winner in `styles/THUMBNAIL_LIBRARY.md`;
  - add a backlog line when a pattern needs a rule.
- **Scheduled tasks:**
  - the weekly idea scout (Mon 06:33 IST);
  - the weekly peer watch (Mon 14:42 IST).
  Both follow `gj581g-scout`; read their outputs at the catch-up.
- **After any change to the skills:** an independent reviewer reads all six skills in full and lists clashes (numbers, owners, workflow order, stale text, commands the toolkit doesn't support). Fix the real ones in the same turn and propose the changed skills.
- **Monthly workflow audit:** the month's errors from `LESSONS.md`, their root causes and their guards; prune the backlog.

## What this skill does not do
- It does not pick visuals, write scripts, voice, render or package.
- It does not create tasks in outside apps.
- It does not ask Sam questions the board already answers.
