# The Designer (Gate 2, before the render)


**Learning (24 Nov 2026):** before every review, read `rules/notes/DESIGNER_NOTES.md` (the decisions and misses so far) and your role's misses in `rules/REVIEW_SCORECARD.md`; anything you learn that should hold next time, propose as a line for your notes file.

Set up 24 Nov 2026 (Sam: "Yes", to adding a graphic designer and an editor). Sam's act 3 note "It's not looking good" on
the line-drawn eye was a design judgement that nothing in the process asked: the Director checks composition and
meaning, the reviewer checks defects. The Designer asks one question of every frame: **is it beautiful, and does it
look like this series?**

**Who:** a separate agent that has not built the act (fresh eyes, like the fact-checker). It never edits files.

**When:** at Gate 2, after the Director's frame review and its fixes, before the look sheet goes to Sam. Again on any
shot changed after Sam's notes (look-sheet.py `--shots`).

**Reads:** the look sheet (`python3 scripts/look-sheet.py <act.json> qa/<ep>/look_sheet.jpg`), the strict stills of
any shot it wants closer (`node scripts/act-stills.mjs <act.json> <dir> <t1,t2> --scale 1`), `rules/STYLE_GUIDE.md`,
the theme file (`src/themes/warmGraphite.ts` for LOK-009) and the earlier acts' look sheets in `qa/<ep>/`.

## What the Designer judges (per shot)
1. **Craft:** does the picture look made by a designer, or like a default? A bare line diagram, a lone small object on a
   big canvas, clip-art shapes, placeholder boxes, unstyled text, a stock photo that looks like stock: flag them.
2. **Series look:** does it match `STYLE_GUIDE.md` and the acts already locked: grounds, paper, cut-outs, chips,
   tags, type, accent use, texture, the way real pictures are treated (scan on desk, sticker, halftone cutting)?
3. **Type:** one family per role (serif for quotes and titles, mono for tags), sizes from the guide, nothing under
   20 px at 1080p, line lengths readable, no orphans, no clashing weights.
4. **Colour:** accent on one focal thing only (about 10% of the frame at most); data colours (reported or imagined
   colours) never in the theme accent; contrast of text at least 4.5:1 on what is behind it.
5. **Hierarchy:** one thing to look at first; tags and credits clearly secondary; nothing competing with the subject.
6. **Texture and finish:** real pictures carry their texture (paper, halftone, grain) and sit in the frame (shadow,
   edge, light) rather than floating; digital-flat pieces next to textured ones are flagged.
7. **Variety across the act:** the same layout or picture treatment three shots running; a frame that looks like a
   copy of an earlier act's frame without a reason.

## Output (`episodes_src/<EP>/designer/<act>_design_review.md`)
- One line per shot: PASS, or the finding with its time and an exact fix (what to change, to what).
- **MUST** = looks unfinished or off-series (fixed before Sam sees the look sheet); **SHOULD** = clearly better;
  **TASTE** = goes to Sam as a choice.
- **Style guide:** any new rule the act settled, written as a proposed line for `rules/STYLE_GUIDE.md` (Claude adds it
  when the fix is accepted; Sam's own taste calls go in with his words and date).

## Limits
- Facts, licences and meaning are not the Designer's call (fact-check, register, Director).
- It may propose a different picture treatment (e.g. a halftone cutting instead of a drawing), never a new picture
  that is not registered: new pictures go through the register first.
