# Review scorecard: how the review roles learn

Set up 24 Nov 2026 (Sam: "How do you make sure that our designer, Editor, Director, etc. also get better?"). The
roles are agents that start fresh each time; they get better only through what they read. So every role reads three
things before it reviews: its role file (`DIRECTOR.md`, `DESIGNER.md`, `EDITOR.md`, `SOUND.md`, `EXPERT.md`,
`FIRST_VIEWER.md`), its notes file (`notes/<ROLE>_NOTES.md`, the director's is `DIRECTOR_NOTES.md`), and the misses
below for its role.

## Who runs when (usage budget, Sam, 24 Nov 2026: "Sure", to using fewer review agents)
Each review agent starts cold and re-reads files and frames, so they run only where they catch the most:
- **Gate 1:** fact-check (on-screen text); the **Expert** on the lines and planned pictures that explain science.
- **Gate 2:** the Director's frame review; the **Expert** on diagrams, simulations and data pictures only; the
  **Designer** on the look sheet.
- **Gate 3 (each act):** **one picture agent plays both the Designer and the Editor** (both checklists, one report,
  `gate3_<act>/PICTURE_<clip>.md`), plus the **Sound** checks. The independent reviewer runs only when that agent
  is not run (it covers the same defects).
- **First-Time Viewer:** only on the joined episode before upload, not per act.
- **No re-check agents after small fixes:** Claude checks each fixed item on stills or measurements and lists it in
  the report's "Applied" section. A fresh agent re-checks only after a redo of a whole shot or more.
- Agents get contact sheets of the changed shots **plus one shot either side** (the cuts in and out), not the whole act, unless the whole act is new. A new act always gets the full review. Scripts that read every frame (stillness, colour, seams, gate2-qa) still run on the whole act. If Sam finds a miss outside the sheet, it is scored here and the sheet widens.
- **Claude's own looks (Sam, 24 Nov 2026: "So apply it too so that you use less tokens"):** numbers before pictures
  (stillness, colour, seam and loudness reports first); then one small sheet of the changed shots and their
  neighbours (`scripts/look-sheet.py ACT OUT --shots IDS --near --small`); a full-size still only for a shot that
  fails a check or looks wrong on the sheet; never re-open a picture already looked at; waveform and spectrogram
  plots at 60 dpi. Sam's look sheet at Gate 2 stays full size.
- **Models (Sam, 24 Nov 2026: "Sure"):** the **Sound** reviewer and routine consistency checks (register vs beat
  sheet vs act file, a second opinion on a voice-audit flag) run on **Sonnet** (Agent `model: "sonnet"`). The
  **Director**, the **Designer + Editor** picture pass, the **Expert**, the **fact-check** and the **First-Time Viewer**
  stay on **Opus**: their misses cost Sam a review round.

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
| E01 act 3 | v5 | 0 own notes: Sam took the roles' fixes ("Apply all (Recommended)"; "Show it earlier" for the Newton tag) | Designer: the two other drawn eyes, 16 px tags; Editor: frozen half-erased label, late pop, early swishes; Sound: act-join holes; Expert: prism red end, 'DALTON'S SIX' label; Viewer: 'By Kendal' caption (act 2), empty quote card | none | none |
| E01 act 3 | v6 | 0 notes: "Approve"; the picture pass's 8 polish SHOULDs accepted ("Apply them") | Picture pass (Designer + Editor): 8 SHOULDs; Sound: bed 2.2 dB louder than v5 (Claude's mix level), fixed before Sam | none | none |

## Misses by role (read yours before reviewing)
- **Director / Designer:** a drawn diagram that a real picture could show, drawn as bare lines on graphite (act 3 v4,
  Sam: "It's not looking good and i would like to drop it"). Ask of every drawing: does it explain something a picture
  cannot? If yes, is it drawn as a designed plate (paper, engraving, captions), not a default outline?
- **Editor:** a hold after the last word that has nothing to look at (act 3 v4 end, 5.6 s; Sam: "end at 208.1").
  Judge every end hold by what the next act does with it; if nothing yet, keep it under 2 s.
