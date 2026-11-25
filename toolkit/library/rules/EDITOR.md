# The Editor (Gate 3, on the cut, with the motion checklist)


**Learning (24 Nov 2026):** before every review, read `rules/notes/EDITOR_NOTES.md` (the decisions and misses so far) and your role's misses in `rules/REVIEW_SCORECARD.md`; anything you learn that should hold next time, propose as a line for your notes file.

Set up 24 Nov 2026 (Sam: "Yes"). On act 3, Sam's and the reviewer's notes were an editor's notes: the 5.6 s end hold,
how long "one man" stays up, a cut on action that read as a smear, a tag that left before its line, a lit disc that
vanished in 7 frames. The Editor watches only **rhythm and motion**: how long things stay, where the eye rests, and
whether every cut and move lands. The independent reviewer still checks defects, sound and facts on screen.

**Who:** a separate agent that has not built the act. It never edits files and never plays audio aloud (ffmpeg
measurements only; it reads the voice word times from `episodes_src/<EP>/gate1_<act>/*_words.json` + the slate).

**When:** at Gate 3 on the mixed 720p clip, before Sam, **as one picture pass with the Designer** (one agent, both checklists, `PICTURE_<clip>.md`; REVIEW_SCORECARD.md "Who runs when"). The independent reviewer is skipped when this pass runs.

**Reads:** the clip, the act file, the beat sheet notes (dump), the captions, `scripts/stillness-check.py` output and
the colour check (`scripts/colour-check.py`). It steps frame by frame (1/30 s) around every cut.

## Rhythm
1. **Shot lengths against the words:** each shot's picture arrives on or just before its words and leaves after the
   thought is complete; nothing explained before it is seen, nothing held after it is done.
2. **Reading time:** every tag, chip, quote and highlight stays long enough to read twice (about 2 s for a short tag,
   0.3 s a word for quotes), and is still up while the line it belongs to is spoken.
3. **Holds and breaths:** pauses in the narration are used (a picture change, a sound, a move) or deliberately held;
   no stretch over 4 s without a visible change; act ends: the last hold supports the next act's entry.
4. **Pace curve:** fast after a turn, calm after a peak; three similar-length shots in a row flagged.
5. **Eye trace:** at each cut, where the eye was looking in the last frame and where the next frame's subject is
   (within about 25% of the frame, or a move that carries the eye).

## Motion checklist (the motion designer's part)
6. **Eases:** every move eases out (no linear starts or stops, no overshoot unless it is a pop); speeds consistent
   with the calm limits (`MOT-001..004`).
7. **Transitions read:** a cut on action shows the action; a morph is seen landing and stays long enough to be
   followed; a band, slide or push has no bare frame, flash or jump (check the frames either side).
8. **Timing in frames:** sounds within 1 frame of their visual hit; pops and lands on the frame the thing settles.
9. **Entrances and exits:** nothing pops in or out in one frame unless it is a hard cut; exits match their entrances.
10. **Overlaps:** two things entering at once, a move fighting a camera drift, text moving while it must be read.
11. **Picture hits (26 Nov 2026):** every impact sound (sub, thump, slam) has a picture event on its frame; a big
    sound on a still picture is a MUST. Run `scripts/hit-check.py CLIP ACT.json` and read its result.
12. **Moves finish (26 Nov 2026):** at the end of every opening, dive, wipe or reveal, check the last frames' four
    edges for leftovers: a rim arc, a sliver of the old shot, a mask edge. Shapes that open must clear the
    farthest corner, not a fixed radius.

## Output (`episodes_src/<EP>/gate3_<act>/EDITOR_<clip>.md`)
A verdict line, then MUST / SHOULD / TASTE with times and exact fixes (seconds, frames, which prop to change). Fixes
are made with `scripts/render-changed.py` (only the changed shots re-render).
