# Gate 3 picture pass: WCL-E01 act 2 v2 (Designer + Editor), v1

Clip `library/out/WCL-E01_act2v2_v1.mp4` (1080p, 30 fps, 175.57 s). Act file `library/src/episodes/ep01-act02-v2.json`
(generator `rework_act2/rework_act2.py` over `gate2_act2/make_act2.py`). Whole act reviewed: 8 contact sheets at 1 fps,
every frame from -0.3 s to +0.8 s at all 17 shot starts, every frame 81.90-82.47, and full-size frames at 22 suspect
times (all in `/tmp/pp2`). Read first: DESIGNER, EDITOR, ENERGY, STYLE_GUIDE, both notes files, the scorecard misses,
the v2 brief, harmony_v1, colour_v1. Nothing was re-rendered; fixes below are not tested.

**Verdict: Fix first.** The burst structure works and all 17 transitions read, but 10 MUST items remain. Most are
act-file numbers (chip positions and times); three are component fixes (blur ground on cream, the iris lids, the
p.99 source tag).

## MUST

1. **66+67, 166.9-172.95 (frames 168.0, 171.5, 172.6): dark text on a dark ground, cream corners.** "A" and the full
   stop of "A scientist." are ink on dark grey; the typed line NOT ENOUGH TO KNOW HE'S DIFFERENT is dark grey on dark
   grey and cannot be read; the running head vanishes. The ground is a dark blob with light corners.
   Cause: `src/layers/Ground.tsx` blur case: image `brightness(0.42)` then a vignette to `t.colors.dimMask`, which is
   cream `rgba(244,236,221,0.82)` on LOK-033; `KineticLine.tsx` l.107/115 draws text in `t.colors.ink` / `secondary`
   (dark on LOK-033). Same token flip as act 1 MUST 3.
   Fix: Ground.tsx vignette to a fixed `rgba(22,21,20,0.8)`; in KineticLine, when the shot has a blur ground or
   `backdrop`, serif `#FFF8EC`, mono `#D8CFC2`. (Other route: see TASTE 1.)

2. **25-38, 86.3-98.6 (88.5, 93.0, 96.5): the name tags overlap.** JONATHAN ■ DARK covers the lower half of
   JOHN ■ DARK (JOHN is unreadable from 87.65 on); MOTHER ■ RED covers the K of Jonathan's DARK.
   Cause: `tags` JOHN (1140, 800), JONATHAN (1190, 842), MOTHER (1520, 830); a tag is about 70 px high.
   Fix: JONATHAN → x 1140, y 880; MOTHER → x 1505, y 800 (right edge then about 1797). Check a still at 96.5.

3. **25-38, four chips break the right safe area (1800).** Measured right edges: "a sensible dark colour" 1864
   (73.5-81.6), "red as a cherry" 1903 (82.1-86.4), "one pair of stockings" about 1881 (93.7-94.9), "a mother quite
   sure" 1866 (94.96-98.4). The cherry chip ends 17 px from the frame edge.
   Fix: overlay chips x 1230 → 1120 on all five chips of this shot (they then cover only the page's blank margin).

4. **25-38, whole shot: source tag is under the type floor and outside the safe area.** 18 px mono, right edge 1843.
   Cause: `SourcePageStory.tsx` l.229 `fontSize: 18`, `right: t.safe.x - 40`. Fix: `fontSize: 20`, `right: t.safe.x`.

5. **25-38, 73.2-75.1 (75.0): the pull-quote "A sensible dark colour." wraps to two lines and its second line sits on
   the source tag** (no gap). It also repeats the chip above it word for word.
   Cause: `quotes[0]` at left 1130, top 770, 62 px, width 680. Fix: delete `quotes[0].text` (keep the kicker
   TO JOHN · AS THE STORY TELLS IT; the chip carries the words), or l.222 `fontSize: 62` → 54 so it stays on one line.

6. **45-54, 124.0-127.4 (125.5): TROUBLE TELLING SOME REDS AND GREENS APART runs into the "8 in 100" chip** (the
   last T touches the chip; chip x 1393-1809, line ends 1400).
   Fix: chip `untilSec: 12.34` → 8.9 (it has been up 2.5 s; the dots and the label still say 8 in 100).

7. **45-54, 137.75-140.4 (139.8): "4 in 50" stays on screen over the China/Japan field (4-6.5 in 100)**: the wrong
   number on the picture for 2.65 s. It then freezes half-wiped ("n 50") under the iris, 140.53-140.93.
   Fix: chip `untilSec: 25.34` → 22.5.

8. **55+56 entry, 140.97-141.07 (3 frames): the iris blink never closes at the sides.** Two cream slits about 160 px
   long stay open at mid-left and mid-right while the rest is black.
   Cause: `SeriesTransitions.tsx` IrisBlink `lid = 560 * close`, `curve = 220 * (1 - close * 0.6)`: at close the lid
   edge at x = 0 and 1920 is at 472 (top) and 608 (bottom). Fix: `lid = 640 * close` (edge at 552 / 528, overlapped).

9. **57+58, 147.08-150.4 (150.0): YOUR WHOLE LIFE sticks out from behind the colour chips** ("FE" to the right of
   "sky"; the label is centred at 960, the chips sit on it at x 760). Before that, 145.9-147.08, the frame is a
   blank cream field with one 24 px label: the emptiest frame of the act.
   Fix: replace the mono line with a paper chip that sets up the list: overlay
   `{"size": 96, "chips": [{"text": "your whole life", "atSec": 0.0, "x": 640, "y": 300}]}` (no `untilSec`), and
   `lines: []`. The four colour chips at y 470 then land under it.

10. **08+09, 16.97-21.76: a library credit on screen.** Source tag reads JOHN DALTON · LONDON, 1793 · FIRST EDITION ·
    ETH-BIBLIOTHEK ZÜRICH (no-credits rule, 25 Nov). Fix: `source` → "JOHN DALTON · LONDON, 1793 · FIRST EDITION"
    (it then also fits one line); ETH goes in the description credits.

## SHOULD

1. **25-38, 82.10 hit: reads as landing; make it certain.** Frames: 82.10 no chip; 82.13 the cherry chip is fully in
   (one frame after the sub, inside the 1-frame rule) and settles by 82.20. The stockings stay dark until 82.62.
   By eye the hit lands; hit-check misses only because the chip is 17% of the frame. Smallest fix: `states[1].atSec`
   18.44 → 17.92 so the stockings snap red on the chip's frame (and `quotes[2].textAtSec` 18.6 → 18.1).
2. **45-54, 129.45-131.6: "4 in 1,000" brushes the dot field** (chip bottom 319, top row of dots 322). Yes, fix:
   chip x 1290 → 1280, y 190 → 160 (clears the dots by about 30 px and the running head by 45 px).
   Also "8 in 100" x 1392 → 1380 and "4 in 50" x 1443 → 1433 (right edges 1809 / 1807).
3. **16-21, 50.2-55.2 (52.0): "except his brother" covers the page's bottom-right corner** (x 919-1020, two lines of
   page text, not highlighted) and ends at 1810. Fix: size 96 → 82, x 920 → 1040, y 870 → 880.
4. **22-24, 55.2-64.2 (57.5): the collage ground reads as grey slabs on cream; the title crosses a slab edge and
   leaves "Dalton" alone on line two; the scan is blue-white beside warm paper.** Cause: Ground.tsx collage
   `brightness(0.5)` on a cream canvas. Fix: on LOK-033 use `blur(7px) brightness(0.95) saturate(0.5)` at opacity
   0.5; `quote` → "The Worthies of Cumberland"; add `sepia(0.18)` to the scan.
5. **57+58, 147.08-150.4: chip text.** Cream on sky `#86B5E8` is about 2:1. Fix: ink text on the sky chip.
6. **59-62, 150.4-160.3 (155.5): two 250 x 150 swatches on an empty field** (ENERGY 3), WHAT IT IS CALLED wraps onto
   the swatch (5 px gap), and tomato sits beside the reds (ILLUSTRATIVE tag, NOBODY HAS EVER TOLD YOU).
   Fix: `zoom: 1.5`; `columns: ["CALLED"]`; SwatchRows.tsx l.175 tag colour → `t.colors.ink`; drop `accent` on
   labels[1].
7. **14+15 (35.1-38.3) and 63-65 (163.05-166.05): tomato label text on the pink petals** (STYLE_GUIDE harmony 5).
   Fix: drop `accent: true` on WHAT DO YOU SEE? and RED · HIS WORDS (ink on the paper chip).
8. **39-44, 113.3-115.4 (114.3): JONATHAN overlaps the third SAME stamp and the thread crosses the candle's SAME like
   a strike-through.** Fix: un-wipe the three stamps at 14.5, before the names arrive at 14.7.
9. **45-54, 139.35-140.6: STILL THERE** is 24 px tomato on cream (about 3:1) for 1.4 s. With MUST 7 the chip slot is
   free: make it the punch chip `{"size": 96, "text": "still there", "atSec": 24.29, "x": 1380, "y": 190, "accent": true}`.
10. **25-38, 64.2-68.9: right half holds only two tags for 4.7 s**, and the tags name what is not there yet
    (REPORTED COLOURS; STOCKINGS: SILK ...). Fix: bring both in with the stockings (`object.atSec` 4.25).
11. **25-38: pull-quotes cross-fade** (75.9, 78.9) where labels un-wipe. Fix: SourcePageStory l.220 exit by clip.
12. **02-05, 7.9-9.3: NORTH-WEST ENGLAND** is up 1.4 s. Fix: `untilSec` 6.9 → 7.2.
13. **25-38 entry, 64.33-64.53:** the page turn gets 6 frames and about 60 degrees before the cut. Lengthen to 0.5 s.

## TASTE (for Sam)

1. **66+67 ground.** MUST 1 keeps the dark portrait ground (your 24 Nov rule for graphite). On cream it is the only
   dark shot of the last minute (L* 33 between 62 and 89). Option: a light blur ground (brightness 1.1, cream wash)
   with ink text.
2. **68, 172.95-175.57: the map card.** Pink, green and ochre chips are three invented colours on one card, and the
   card is two-thirds empty by design (7 slots). Option: paper chips, tomato only on the current act.
3. **115.4-115.8: the spectrum sweep** is the harmony check's 7-family frame. It is 0.4 s and the series motif;
   accepted here. A plain warm sweep is the option. The 161 s flag is the geranium photo itself: accepted.
4. **16-21:** the quote card shows "except my brother..." from 38.6, 11.6 s before the line (Director: approved).

## What works
- Every big chip lands on its word (checked against the word times, all within 0.1 s); the three bursts read.
- The geranium opening out of the Kendal pin (32.4-32.6) and the tear between the two books finish clean.
- End: map readable from 173.57, "Why?" on its word at 174.19, 1.0 s hold after the last word.

## Proposed notes
- Designer: on LOK-033 any ground that darkens a picture (blur, collage) must not vignette to `dimMask`; check text
  colour against the ground actually behind it, not the theme.
- Designer: measure every overlay chip's right edge on a still; x is the left edge, so long chips at x 1230 overrun.
- Editor: a chip that names a number leaves before the data under it changes; check chip `untilSec` against the
  next phase's `atSec`.
- Editor: on the closed frames of a blink or wipe, check the left and right edges as well as the last frames.
