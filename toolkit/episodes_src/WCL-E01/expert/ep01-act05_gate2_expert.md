# WCL-E01 act 5 "The rays": Subject Expert, Gate 2 (built pictures)

Reviewer: the Subject Expert (colour vision, visual optics, history of colour science). 25 Nov 2026. No files edited
but this one; nothing rendered. Inputs: `rules/EXPERT.md`, `rules/notes/EXPERT_NOTES.md`, my Gate 1 report, the stills
`library/qa/WCL-E01-act05/review/sheet_*.jpg`, `t*.jpg` (960x540) and `look_sheet.jpg`, and the code/data:
`gate2_act5/make_act5.py` → `src/episodes/ep01-act05.json`, `layers/SpectrumParts.tsx`, `layers/OverlayRays.tsx`,
`layers/spectrum.ts`, `components/EyeDiagram.tsx`.

Grades: **MUST** (teaches something false), **SHOULD** (true but likely to mislead or weaker than the science allows),
**TASTE**.

**Counts: 0 MUST, 1 SHOULD, 4 TASTE, 3 NOTE. All five Gate 1 SHOULDs landed.**

---

## 1. Gate 1 fixes: did they land?

| Gate 1 | Built | Verdict |
|---|---|---|
| S1 D: outgoing a different mix | `KINDS_OUT` sizes 5/7/9 at counts 5/2/5, incoming 5/5/5, all `#FFF6DD`; t42.70 shows a thinner outgoing stream, `ISN'T PINK`, `RAYS DRAWN WITHOUT COLOUR` | PASS |
| S2 E: "seen as pink" past the retina | `anchor [1595, 632]`; t49.20 zoomed: the leader runs outside the globe to the nerve tail; "Retina" caption unchanged | PASS |
| S3 I: candle profile | `CANDLE` = my 1,900 K values (400 nm 0.01 vs my 0.005: invisible difference); `PETAL_BY_CANDLE` = product, sampled every 25 nm | PASS |
| S4 M: notes on the stops | heads at the band edges, violet end first, string from x -20 to 1710 (off the left edge), red-end head hollow, no ties, segments dimmed to 0.55 and brightened one by one on "colours" | PASS |
| S5 O: legend | `ILLUSTRATION / DOTS: 3 OF NEWTON'S MANY KINDS / RED-, GREEN-, BLUE-MAKING`, lands with the dots (146.70) | PASS |

## 2. The strips (H, I): checked in code and on the stills

Drawing (`SpectrumParts.weighted`): Bruton colour × weight^(1/2.2) on the encoded value, i.e. the weight is applied in
linear light and shown with display gamma. That is the right way: 2.5% of the light shows at ~19% brightness, weak but
not black, and honest.

- **H, geranium SENT BACK** (`PETAL`, red left): red strong, green dipped (0.10-0.12 → ~35% on screen), blue-violet
  back up. The saddle shape of a pink petal (Chittka et al. 1994). Deeper dip than my Gate 1 suggestion; fine, still
  pink rather than magenta given the 0.45-0.5 blue. PASS.
- **H, leaf SENT BACK** (`LEAFP`): dark everywhere but a yellow-green hump at 550-580 and a dark red at the 700 end
  (red edge onset). Reads green. PASS (TASTE 2 on its height).
- **H, DAYLIGHT**: full strip, red left. PASS as the simplification agreed at Gate 1.
- **I, CANDLELIGHT** (zoom of t94.20): red full, orange-yellow down, green dim, blue/violet end nearly black under
  `FAR LESS BLUE`. PASS; this is now the physics.
- **I, THE GERANIUM'S MIX, BY CANDLE**: red and orange, then near-black from green to violet. The petal's blue
  return is gone, so "not having then any blue in it" (Dalton p.30) follows from the picture. PASS.
- All rows red on the left (`reverse` default true). A0's band (act 4's still) is violet-left; the flip comes 70 s
  later at H, with no geometry linking them. NOTE 1, no change.

## 3. Newton's seven (K, M)

- `SEVEN = [1/8, 3/40, 2/15, 1/6, 1/6, 1/9, 2/9]`, red first (Opticks p.92, M → G); sum 1. Edges in frame:
  210, 397.5, 510, 710, 960, 1210, 1376.7, 1710. On t112.50/t114.50 (1/3 scale) the dividers sit at x 128, 166, 235,
  320, 405, 462, end 570 (= 384, 498, 705, 960, 1215, 1386, 1710 at full size, within rounding). PASS.
- `SEVEN_NM = 650, 605, 580, 530, 470, 445, 410`: Newton's blue as our cyan-blue, his indigo as our blue. PASS.
- M: eight heads (seven filled + hollow octave at the red end), all at one height, so no pitch is implied
  (fact-check 4). Colours brighten after the notes are down, so they read as the spaces between. `?` on indigo with
  dashed dividers. PASS.
- NOTE 2 (code comment only, not on screen): `SpectrumParts.tsx` calls the hollow red-end head "the stop past the
  band". It is the band's own red end, M, the octave (MX = GM; X is the stop past the band, off screen). Fix the
  comment when next touched.

## 4. The eye (E, O, P)

- E: white dots along the axis to the retina; `A KIND OF PUSH`; caption to the nerve. PASS.
- O: dot colours `#FF3B30`, `#30D158`, `#2F6BFF`; tint `#3D6BD6` brushed on with `DALTON'S GUESS · A BLUE VITREOUS`;
  absorb thins red and green to 0.3 between path 0.52 and 0.7 (inside the vitreous) and lets blue through. Matches
  Dalton p.43 ("Our eyes only transmit the blue excess"). PASS on content.
- **SHOULD 1 (O): the thinning is barely on screen, and red/green first cross the blue jelly untouched.**
  The tint is down at 149.67 (+0.7 s brush), but `absorb.atSec` is 151.01: for ~0.6-1.3 s red and green dots cross a
  fully blue vitreous at full strength (t150.30), which says "a blue filter lets red through". Then `rays.untilSec`
  151.70 ends the stream; by t153.60 no dots are left, so `change the rays` (153.32) and `change the colour` (154.70)
  land on an empty eye. **Change** in `make_act5.py`, shot O: `"absorb": {"atSec": r(150.40), ...}` (tint +0.7 s
  brush) and `"untilSec": r(155.50)` on `rays` (dots under 40 still: 18). No wording change.
- P: tint kept, `GUESS` underlined, dashed cut line labelled only by the act's ILLUSTRATION tag (fact-check 12).
  PASS.

## 5. Nothing false on screen

Every other directed shot checked on the look sheet (A0, A, B, C, F, G, J, L, N): quotes, page numbers and labels as
passed at Gate 1. J's `REPORTED COLOURS · DALTON 1798, PP. 29-30` covers the RED swatch (NOTE 3: `RED (HIS WORD)`
still optional). No MUST.

## 6. TASTE
1. **O:** add the page to the guess, `DALTON'S GUESS · A BLUE VITREOUS · 1798, P. 43`, if it fits (Gate 1 TASTE 5).
2. **H leaf:** `LEAFP` peak 0.45 at 550 nm is about twice a real green leaf's (~0.1-0.2); its yellow-green looks as
   bright as the petal's red. `[550, 0.3], [580, 0.2]` would keep it green and make the leaf the darker thing. Tagged
   NOT MEASURED, so optional.
3. **I:** the carried geranium stays daylight-pink in the candle world. Defensible (it is what "most people" report,
   J), but a light warm cast on the cutout would show the light reaching the eye did change while the name did not.
4. **M:** the hollow octave head could carry a tiny mono `OCTAVE`, so nobody counts eight notes against "seven".

## 7. Proposed line for `notes/EXPERT_NOTES.md`
- 2026-11-25 (act 5 G2): an absorption shown with dots starts when the filter is down and keeps running until the line
  that names the result has landed; a filter must never be seen passing what it is said to absorb.

## Sources
As Gate 1 (Newton, Opticks 1704 pp.90, 92; Dalton 1798 pp.29-30, 43; Chittka et al. 1994; Horler et al. 1983;
Chen et al. 2020 / Macleod 1975 for the candle). Leaf reflectance at 550 nm ~0.1-0.2: Horler et al. 1983; Gates et al.
1965, *Appl. Opt.* 4:11-20.
