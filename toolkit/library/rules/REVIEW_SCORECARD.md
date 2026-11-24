# Review scorecard: how the review roles learn

Set up 24 Nov 2026 (Sam: "How do you make sure that our designer, Editor, Director, etc. also get better?"). The
roles are agents that start fresh each time; they get better only through what they read. So every role reads three
things before it reviews: its role file (`DIRECTOR.md`, `DESIGNER.md`, `EDITOR.md`, `SOUND.md`, `EXPERT.md`,
`FIRST_VIEWER.md`), its notes file (`notes/<ROLE>_NOTES.md`, the director's is `DIRECTOR_NOTES.md`), and the misses
below for its role.

## The loop (after every Sam review)
1. **Score:** each of Sam's notes is matched to the role that should have caught it. Caught before Sam = a catch;
   found by Sam = a miss. A reviewer suggestion Sam turns down = an over-flag.
2. **A miss becomes a rule:** one line in that role's notes file, in Sam's words with the date, written as a check the
   role can apply ("a plain line drawing of something a real picture can show fails").
3. **An over-flag becomes a limit:** one line saying what not to flag again ("Sam keeps the 2.9 s dark breath").
4. **The test set grows:** the frame or clip moment of each miss is kept in `rules/test_set/` with the expected finding.
   When a role file changes, the role is re-run on the test set; it must catch every case (calibration, as the gag
   judge was calibrated on Sam's ratings).
5. **The trend:** the table below; misses per act should fall towards zero. A role with misses in two acts running
   gets its checklist rewritten.

## Act scores

| Act | Version | Sam's notes | Caught before Sam | Missed (role) | Over-flags (role) |
|---|---|---|---|---|---|
| E01 act 3 | v4 | 3: drawn eye "not looking good"; blurred Newton wanted behind 'what is colour?'; end at 208.1 | 0 | drawn eye (Director: no design check yet); end hold (reviewer flagged it as T1, left to Sam) | none |
| E01 act 3 | v5 | (pending) | Designer: the two other drawn eyes, 16 px tags; Editor: frozen half-erased label, late pop, early swishes; Sound: act-join holes; Expert: prism red end, 'DALTON'S SIX' label; Viewer: 'By Kendal' caption (act 2), empty quote card | - | - |

## Misses by role (read yours before reviewing)
- **Director / Designer:** a drawn diagram that a real picture could show, drawn as bare lines on graphite (act 3 v4,
  Sam: "It's not looking good and i would like to drop it"). Ask of every drawing: does it explain something a picture
  cannot? If yes, is it drawn as a designed plate (paper, engraving, captions), not a default outline?
- **Editor:** a hold after the last word that has nothing to look at (act 3 v4 end, 5.6 s; Sam: "end at 208.1").
  Judge every end hold by what the next act does with it; if nothing yet, keep it under 2 s.
