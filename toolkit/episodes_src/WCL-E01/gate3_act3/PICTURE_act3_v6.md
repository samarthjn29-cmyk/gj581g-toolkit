# Picture pass (Designer + Editor): WCL-E01 act 3 v6 (208.1 s)

**Verdict: Ready for Sam. No MUST. Every v5 MUST is fixed. The plates look designed and in series. 6 SHOULDs, mostly finish on the two plates, and 2 SHOULDs carried over from v5.**

What I looked at: out/WCL-E01_act3_v6_720.mp4 (13:58), the act file (same as the render snapshot `_raw.mp4.act.json`), colour_v6.md, the stillness result (longest gap 4.0 s, the end hold: last word "born." ends 206.83, act ends 208.10, so 1.27 s), the small sheet, 8 frame tiles, and full 1080p stills at 127.6 and 158.6. Note: `out/WCL-E01_act3_v6.mp4` was being rewritten at 14:12-14:13 (a new `_premix.mov`). My 1080p stills were taken at 14:08, before that. If the picture changed, the 720p clip needs re-cutting from the final file.

## v5 items
| Item (source) | Status | Evidence |
|---|---|---|
| Plates replace the line eye, shots 7 and 9 (Designer MUST 1) | FIXED | Cream card, hatched sclera, stippled lens, iris, ciliary body, optic nerve, italic captions. Wash finish: SHOULD 1 |
| Seam, notches, doubled retina arc (Designer MUST 2) | FIXED | None seen at 1080p |
| 16 px labels (Designer MUST 3) | FIXED | B and C credits at 20; the 67+68 tags measure about 20 px |
| Empty quote column, shot 4 (SHOULD) | FIXED | ORANGE & YELLOW at 46.85, GREEN at 47.69 |
| Vitreous outline un-draws when "tinted" lands | FIXED | Gone at 127.11; the underline stays (SHOULD 4) |
| Shot 10 repeats shot 8's crop (SHOULD) | NOT FIXED | Both still `[180,900,1080,1040]`, side left (SHOULD 7) |
| Eye model w 400 tucked at [1420,600] (SHOULD) | FIXED | |
| Newton blur at 0.38 (TASTE) | FIXED | |
| Prism red end hue (Expert FIX 1) | FIXED / NEW PROBLEM | Now dim yellow (73,71,0), but flat with a hard step (SHOULD 6) |
| OTHERS · SIX COLOURS at 75.80 (Expert FIX 2, Editor T6) | FIXED | |
| MODERN SIMULATION · ONE WAY (Expert) | FIXED | |
| Plate anatomy spec (Expert sec. 2) | FIXED | Cornea bulges past the globe. Lens is 3.5 x 9.2 mm with the steeper surface at the back. Vitreous front is cupped. Retina runs forward. Nerve sits off the axis. THE EYE · SIMPLIFIED on the plate; DALTON'S GUESS only on the wash. Drawing: SHOULD 2-3 |
| Absorption starts at the vitreous front (Expert NOTE 3) | FIXED | 0.52 is about x 1110, the front face |
| Label frozen half-erased at 74.2 (Editor M1) | FIXED | Clean by 74.43; frozen frame 74.47 has no label |
| Wax pop (Editor M2) | FIXED | 153.13, wax on screen at 153.13 |
| Swishes early (S1) | FIXED | Act file has 29.88, 51.21, 195.27, 203.83. Measured high-band onsets: 29.96, 51.21, 195.31, 203.88 |
| Leaf settles before its pop (S2) | FIXED | Settles about 55.2, on the 55.19 pop |
| Chapel tag too short (S3) | FIXED | In at 26.90, readable to about 29.8 |
| Newton tag on the same frame as "one man" (S4) | FIXED | 200.44 |
| Dateline move starts at full speed, 9.00 (S5) | NOT FIXED | `DatelineTag.tsx` line 31 still SLOW_OUT (SHOULD 8) |
| Henry ". 25" sliver under the band (S6) | FIXED | `untilSec` 10.55 (act file) |
| T3 blue glass 7.60 / T9 PHOTOS TODAY 15.9 | FIXED | |
| T2 "tinted" length / T8 letter length | open (TASTE) | Not applied |

## MUST
None.

## SHOULD
1. **Wash, D 127.0-128.1 and all of C.** At 1080p it reads as fine digital static, not watercolour. It also fades out 50-60 px before the back wall, which leaves a strip of bare paper between the blue and the retina, though the vitreous fills right to it. Fix in the EyeDiagram plate tint:
   - Cut the feather at the back to 6-8 px so the wash meets the retina line.
   - Add a 2-3 px darker pigment edge (about +15% density).
   - Replace the per-pixel noise with low-frequency granulation (feTurbulence baseFrequency 0.02-0.04, 2 octaves) under the paper grain.
   - Re-render D and C.
2. **Front of the eye, both plates (1080p about x 975-1060, y 345-400 and 690-745).**
   - The ciliary bodies are hollow parallelograms that read as construction boxes. Draw each as a filled, hatched triangular wedge on the wall just behind the limbus.
   - The iris blades float on their own. Run each stroke from the wedge's tip to the pupil edge.
   - Round the lens's pointed tips (equator radius about 10 px).
3. **Retina, both plates.** The Expert lists it as one of the two labels the plate must have ("the light lands here"), but it is a faint 1 px dashed line. The "Retina" leader dot also lands on the sclera band at (1450,385), not on the retina.
   - Draw the retina as a solid 2 px ink line, or a 4 px warm wash band, round the back as far forward as the ciliary body.
   - Move `captions[3].anchor` from [1438,391] about 12 px towards the centre (about [1428,398]) in both D and C. Check on a still.
4. **Accent, 127.11-128.08 (D).** The teal underline under "humour" has been up since 114.83. It stays beside the teal "tinted" chip, its strike and its arrow, which breaks the one-teal-on-a-diagram note. Add `untilSec: 24.49` to `D_into_the_eye.props.captions[4].underline`; if EyeDiagram does not support the prop yet, add it.
5. **Leaders, both plates.**
   - Each leader starts at its caption's first letter. Cornea's leader begins on the "C" and runs under the word. Start every leader at the caption's nearer end, about 6 px clear of the text.
   - The "Lens" leader crosses the lower iris and the ciliary body. Move the caption to about `at` [1090,912] with `anchor` [1050,650], so the leader crosses only the wall. Check on a still.
6. **Prism strip red end, shot S (from 89.03).** The band is flat (73,71,0) and then steps hard to (243,249,0), so it reads as a fifth swatch, olive. The Expert asked for "one yellow running dim → intense → pale". In `SpectrumStrip.tsx` `LOWER.red`, use a linear ramp from about brightness 0.22 at the left edge to about 0.6 at the boundary, with no step into the yellow.
7. **(v5, carried) Shot 10, 161.8-177.4, same page and crop as shot 8.** Set `61+62+63+64+65+66.props.crop` to about `[220,1080,1020,260]` with `side: "right"`, or add a slow push.
8. **(v5, carried) Dateline jolt, 9.00-9.10.** Use `Easing.inOut(Easing.cubic)` over 0.9 s, with an opt-in `cornerEase` prop on `A_manchester_talk.props.tag` so act 1 stays as it is.

## TASTE
- **+29 L* at 102.10, S into D:** fine as it is.
  - It is a hard cut on the turn ("He offers an explanation"), and the hit lands on the cut frame.
  - The graphite ground carries on through the cut, so the bright card reads as a card being laid down, not a flash.
  - The card's centre is within 25% of where the strips' centre was. The prism photo has already gone at 100.17, so the real step is graphite with strips to graphite with the card.
- **DALTON'S GUESS** comes in at 126.59, but the wash only shows from about 127.05. For 0.45 s it labels a clear vitreous. Option: change D `captions[5].atSec` from 24.49 to 24.95.
- **Shot 4 notes:** they sit in plain mono below the source chip, and GREEN in teal sits under the teal rule. Option: put the notes above the source chip, so the content comes before the credit.
- **Still open:**
  - "tinted" gets 1.0 s before the wipe (v5 T2).
  - The spectrum tracks are hard-edged.
  - The shutter is a flat box (act 4's call).
  - Expert NOTE 1: an amber dot that passes through.
  - The ink bleed at 137.5-138.0 casts blue over the whole frame (accepted in v5).

## Passed
- **Cuts and transitions:** both sides of 74.50, 102.10, 137.50, 177.37 (the disc is held to about 178.72), 184.08 (the cut on action lands 0.25 s after 183.82, as in v5), 195.02 and 203.60 read cleanly.
- **Plate cues fall on their words:** "an explanation" 103.92, "isn't hollow" 106.52, vitreous 112.52, underline 114.83, rays 118.07, the clear/strike 124.81 and 125.27, "tinted" 127.11, model 180.28, "two" 182.85.
- **Plate drift:** a calm push of about 1% across each plate.
- **Ground count:** in limits; no ground runs three shots.

## Proposed notes lines
- DESIGNER: a wash fills its part right to the wall. A feather that leaves a strip of bare paper reads as a part that is missing.
- DESIGNER: plate leaders start at the caption's near end and cross no other part.
- EDITOR: check every exit-before-freeze fix on the frozen frame itself (74.47 here).
