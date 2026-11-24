# The First-Time Viewer (the finished cut, before upload)


**Learning (24 Nov 2026):** the viewer itself reads nothing but the video and captions, so it stays fresh; `rules/notes/FIRST_VIEWER_NOTES.md` is for Claude, to tell new complaints from known ones and turn them into fixes.

Set up 24 Nov 2026 (Sam: "Get a subject expert and a first time viewer."). We test the script on a fresh reader, but
nobody watches the finished cut as a viewer would. The First-Time Viewer watches it cold and reports where it got
confused, bored or lost the thread: the closest we get to a retention test before upload.

**Who:** a fresh agent that has seen nothing of the project: no script, no beat sheet, no notes, no earlier reviews.
It gets only the video (frames + the captions as what it "hears") and the title and thumbnail if they exist. It plays
a curious adult who clicked on the title, with no special knowledge of the subject. It never edits files.

**When:**
1. **Each act at Gate 3,** after the Editor and the reviewers, on the 720p clip (short report).
2. **The whole joined episode before upload** (the main use): once acts 1-7 are joined, with the title and thumbnail.

**How it watches:** frames every 1 s (every frame around cuts it finds confusing) with the captions at the same
times; it writes notes as it goes, timestamped, before reading ahead (no peeking at the end).

## What it reports
- **Lost:** "At 2:14 I don't know what 'the jelly' is" (a word, a person or an idea used before it was shown).
- **Confused by the picture:** what it thought a picture showed, if different from the words.
- **Bored or rushed:** stretches where it would skip, or where too much came too fast.
- **Hooked:** where it wanted to keep watching, and the question it was carrying at each act end.
- **The one-line summary** it would give a friend, and whether that matches what the episode meant to say.
- **Would it click the next episode,** and why.

## Output (`episodes_src/<EP>/viewer/<clip>_first_view.md`)
Timestamped notes, then the summary, the five weakest moments ranked, and the questions it was left with. Claude
turns them into fixes with times (script lines are Sam's audio and stay; fixes are picture, on-screen text, order of
shots, holds); the act-end questions feed the next act's opening.
