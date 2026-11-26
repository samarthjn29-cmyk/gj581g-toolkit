# Designer notes (taste log)

Read before every review, with `../STYLE_GUIDE.md` and `../REVIEW_SCORECARD.md`. One line per decision: date, the case,
the rule, whose call.

- 2026-11-24 (act 3 v4, Sam): the line-drawn eye "not looking good": a plain line drawing of something a real picture
  can show is replaced by the picture (here a newspaper halftone cutting of real eyes).
- 2026-11-24 (act 3 v5, Designer, Sam "Apply all"): drawings that explain (a cross-section, a tint, light paths) are
  drawn as plates on cream paper: engraved hatching, stipple, italic serif captions on fine leaders, a watercolour wash
  for colour, never bare outlines on graphite.
- 2026-11-24 (act 3 v5): travelling light is dots in the light's colours, never a white bar.
- 2026-11-24 (act 3 v5): one teal at a time on a diagram; only the part being named carries the accent.
- 2026-11-24 (act 3 v5): the 20 px floor applies to credits and PHOTOS TODAY tags too.
- 2026-11-24 (act 3 v5): the same page twice in an act changes crop, side or camera.
- 2026-11-24 (act 3 v5, Sam): a blurred portrait ground stays dark (brightness about 0.38), so the graphite stays warm.
- 2026-11-25 (act 4 v1): chips placed by x on one row must clear the previous chip's measured width.
- 2026-11-25 (act 5 Gate 3): a blur ground behind a quote must not let the same words be read: blurPx 14 or more, brightness 0.38, at 1080p.
- 2026-11-25 (act 5 Gate 3): labels over a bright photo world (sky, footage) sit on the dark chip (`labelTone: "chip"`), never bare mono.
- 2026-11-26 (act 2 v2 Gate 3): on LOK-033 a ground that darkens a picture (blur, collage) never vignettes to `dimMask` (cream there); check text colour against the ground actually behind it, not the theme token.
- 2026-11-26 (act 2 v2 Gate 3): an overlay chip's x is its left edge: measure every chip's right edge on a still (safe edge 1800); long chips at x 1230 overran by up to 100 px.
- 2026-11-26 (act 2 v2 Gate 3): SwatchRows labels sit inside the zoomed table; with `zoom` set, place them so they land on screen (x = origin + (target - origin) / zoom).
- 2026-11-26 (act 2 v2 Gate 3): credits hide in ArchivalScanCard `source` strings too (a library name); search every act file for archive and library names when the no-credits rule is applied.
- 2026-11-26 (act 2, Sam's miss): look at every highlighter box at full size against its words: it starts on the first letter and ends on the last mark of the phrase, never in the word before or after. snap_highlights.py does the first pass.
