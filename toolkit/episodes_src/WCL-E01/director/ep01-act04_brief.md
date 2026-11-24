# WCL-E01 act 4 "A hole in the shutter": Director's brief (before the build)

Written 24 Nov 2026 by a fresh Director agent that has not seen any act 4 build. Inputs: `rules/DIRECTOR.md` (rules 1-26),
`rules/DIRECTOR_NOTES.md`, `STYLE_GUIDE.md`, `beat-routing.md`, `director/ep01-act04_plan.md`, `gate1_act4/act4_cuts.json`
(84 beats, act time), `04_shutter_paced_words.json` (+2.4 s), `WCL-E01_act4_recorded.json`, the act 3 brief and plan,
the register and the component headers (PerspectiveGrid, TimelineRail, KeywordPanel/Chips, ArchivalScanCard,
SpotlightIsolator, FootagePlate, the transition components).

**All times are act times in seconds** (the frame the word starts). Act files take shot-local `atSec`: subtract the
shot's start. House offsets apply (a dropping tag's sound on its settle frame, about atSec + 0.23 s; exits about 0.2 s
early when they must clear a cut). Frame 1920x1080, 30 fps, LOK-009, calm version (rule 12), LOK-030 finish at Episode level.

**Pictures:** the ten new source files, one downscaled look each; word boxes from a tesseract pass on the full files, so
every box is in the file's own pixels (p.3075 1554x2466, p.3076 1566x2342, p.3078 1567x2351, p.3081 1564x2352, p.3082
1549x2355, p.3083 1555x2355, p.5084 1470x2318, Plate IV 2423x3071, Micrographia 1800x2883, glass 2560x1834).

**Card geometry used for every page** (ArchivalScanCard as coded): card 860 tall, top 110; width min(900, 860 x crop
aspect); inner box = card - 18 px; crop drawn "cover". For a 1440-1480 px wide crop the scale is about 0.584 and the inner
origin is (138, 128) on the left side or (918, 128) on the right side. Crops are chosen at the inner aspect (about 1.05) so
nothing is trimmed. Highlight boxes are `[x, y, w, h]` in source pixels.

**Room geometry** (PerspectiveGrid defaults: focal 1100, vanishY 470, width 2600, floorY 430, ceilY 470): a point at
depth z draws at scale 1100/(1100+z) around (960, 470). Act 3's last frame (shutter `[-1050,-150,600]`) puts the shutter
at (281, 373), 168x233 px. Every room position below is computed with this and must be read off the first still.

---

## Shot list

| Shot | Beats | Act time | Picture | In |
|---|---|---|---|---|
| A0_title_room | 1 | 0.00-2.40 | act 3's room, title in it | act join |
| A_rail_1666 | 2-4 | 2.40-9.62 | TimelineRail, Newton sticker at 1666, Dalton at 1766 | TRN-011 band |
| B_p3075_date | 5-9 | 9.62-24.25 | p.3075 card | TRN-015 match (1666 -> printed 1666) |
| C_p3076_chamber | 10-12 | 24.25-33.06 | p.3076 card | TRN-004 glide |
| D1_shutter_room | 13-16 | 33.06-44.90 | ROOM wide: hole, beam, prism, band | TRN-006 push from "hole" |
| D2_far_wall | 17-23 | 44.90-60.78 | ROOM, the far wall close: colours, then the shape x5 | hard cut (same scene) |
| E_p3076_oblong | 24-25 | 60.78-66.17 | p.3076 card | TRN-007 slide |
| F_common_view | 26-30 | 66.17-80.32 | keyword panel | TRN-011 band |
| G_p3078_crucis | 31-33 | 80.32-86.80 | p.3078 card | TRN-007 slide |
| H_fig18 | 34-35 | 86.80-91.32 | Opticks Plate IV, Fig. 18 isolated | TRN-017 lens |
| I1_board_room | 36-38 | 91.32-98.73 | ROOM: board with a hole, blue, second prism | TRN-015 match (Fig. 18's hole -> the board's hole) |
| I2_second_prism | 39-43 | 98.73-112.19 | ROOM closer: the ghost, "It doesn't.", blue bends, red | hard cut (same scene) |
| J_p3082_obstinately | 44-46 | 112.19-119.20 | p.3082 card | TRN-007 slide |
| L_sorting_room | 47-51 | 119.20-131.63 | ROOM wide + chips making -> sorting; mixed rays sorted | TRN-012 colour block |
| M_lens | 52-55 | 131.63-140.72 | ROOM: a lens gathers the rays to white | hard cut (same scene) |
| N_p3083_white | 56-57 | 140.72-145.73 | p.3083 card | TRN-002 drafting wipe |
| O_glass_today | 58-60 | 145.73-154.12 | photo TODAY, glass-of-water rainbow | TRN-017 lens |
| P_p3081_quote | 61-65 | 154.12-164.88 | p.3081 card, quote highlighted as read | TRN-007 slide |
| Q_plain_version | 66-70 | 164.88-177.90 | keyword panel on p.3081 blurred | TRN-011 band |
| R_p3075_masthead | 71-74 | 177.90-189.38 | p.3075 masthead and heading | TRN-007 slide |
| S1_hooke | 75-78 | 189.38-199.81 | Micrographia title-page sticker on its blur, chips | TRN-011 band |
| S2_p5084_answer | 79-80 | 199.81-205.44 | p.5084 card | TRN-007 slide |
| T_where_is_it | 81-84 | 205.44-215.70 | ROOM wide, the light path held; At Rest alone | TRN-015 match ("Light" -> the hole) |

23 shots, 19 scene changes, 3 hard cuts inside scenes (D1->D2, I1->I2, L->M).

**Changes to Claude's plan, and why (the Director wins on how a shot looks):**
1. **A0 -> A is a band wipe, not a hard cut.** Room to timeline is a scene change, and every scene change is a designed,
   sounded transition.
2. **D is two shots, not one 28 s shot,** and the far wall gets its own close framing. At the wide framing the band is
   178x35 px: "Red at one end, violet at the other" and "five times longer than it is wide" cannot be read on a phone.
3. **I is two framings.** The ghost of the prediction, its disappearance on "It doesn't." and the two bends need the
   second prism large.
4. **K is folded into L.** A 4.4 s chip card between a page and the room would be a lone panel; "making" -> "sorting"
   reads better over the beam it is about, and it saves a scene change and a layout.
5. **S is two shots, without a second TimelineRail.** Every S event happens in 1672 (letter printed, Hooke's critique,
   the printed Answer), so a rail would pile three things on one tick. The "about six years" goes on the Answer card.
6. **T: the prism does not lift out with the band staying.** Without the prism there is no band; viewers who have just
   learned the experiment would see a wrong picture. Instead the glass goes dim (an empty outline) while the light and
   its colours stay bright, and on "So where is it?" the room's lines fall away, leaving only the light.
7. **No RayParticles where a beam can do it** (D, I): rays only where the meaning is the rays themselves (L mixed and
   sorted, M gathered). Keeps VIS-021 inside its limit.
8. **No hatch texture on the shutter** (TEX-005): A0 must match act 3's last frame exactly (no texture), and a shutter
   that is hatched in one room shot and plain in the next is a continuity break.

---

## Shot A0_title_room

| Field | What it says |
|---|---|
| Line | Slate, 0.00-2.40, music alone (Wholesome, MUS-007). |
| Subject | The title, then the closed shutter it promises to open. |
| World and why | Act 3's last shot, **same place**: PerspectiveGrid `variant room, depth 2000, dark 0.7, fog 0.15`, shutter `[-1050,-150,600] w 260 h 360`, nothing else. The act join shows no jump. |
| Period honesty | A drawn room; no tag yet (act 3 did not tag it either); D1 tags it. |
| Entry | Title `4 · A HOLE IN THE SHUTTER` (Fraunces, slate size, left-aligned) rises 0.20-0.90 at x 620, baseline y 560, in the dark open space right of the shutter. |
| Path and landing | Shutter on the left third at (281, 373); the title spans about x 620-1500 on the right two-thirds: shutter and title balance (rule 8). |
| Scale | None. **Builder 1:** `dollyFrom 0.02` so the near plane starts at act 3's end scale (1.02) and eases to 1.025; a fresh 1.00 start would jump at the join. |
| Action | None. |
| Exit | Title un-wipes 1.85-2.30; the band wipe takes the room at 2.40. |
| Eye out | Title centre (1060, 540) -> A's Newton at (960, about 470). |
| Sound | Wholesome alone. SFX-024 for the band at 2.28 (pause before "So"). |
| Texture | None (must match act 3's frame; title is ink). |

## Shot A_rail_1666

| Field | What it says |
|---|---|
| Line | a4-01 "So let's go back to Isaac Newton (2.40-3.58). It's the start of 1666 (5.69), a hundred years (7.27) before Dalton (8.27) is born." |
| Subject | Newton at 1666, then the hundred years to Dalton. |
| World and why | TimelineRail (VIS-055) on warm graphite: **the change itself** (a span of time). The rail is the series' own device. |
| Period honesty | Newton's sticker is SRC-049, tagged as the act 3 tag is: `ISAAC NEWTON · AFTER ENOCH SEEMAN, c. 1726` (a later likeness, never a portrait of him at 23). |
| Entry | `from 1640, to 1790, pxPerYear 9`, `cams [{atSec 2.40, year 1666}, {atSec 7.27, year 1716, sec 1.5}]`. Newton (SRC-049, w 220, h 330) rises from behind the rail on "Newton" 3.58 at x 960 (a single reveal, centred on purpose); his tag wipes on 0.4 s later. The year label `1666` goes accent on "1666" 5.69 (Builder 12). |
| Path and landing | One pan, on the spoken "a hundred years" 7.27-8.77, carries Newton left to x 510 (left third) and brings 1766 in at x 1410 (right third). A bracket draws from 1666 to 1766 under the year labels (y 790) with `100 YEARS` (mono chip) centred at x 960, on 7.40. `DALTON BORN` (text slip, w 220) rises at 1766 on "Dalton" 8.27. Newton's tag spans about x 600-1224 at y 580; the slip spans 1300-1520: 76 px clear. |
| Scale | None. |
| Action | 1666 accent; the bracket draws during the pan. |
| Exit | Nothing leaves: the focus match takes the 1666 label into the page. |
| Eye out | The `1666` label at (510, 746) -> B's printed "1666" at (188, 812): 322 px across, 66 down (inside 25%). |
| Sound | SFX-026 soft pop on Newton's settle, 4.25 (pause 3.95-4.97). Bracket silent (on words). SFX-024 for the match at 9.52. |
| Texture | **object:** the Seeman engraving keeps its own surface; graphite ground flat; slip and chips crisp. |

Builder 12 (TimelineRail): `yearLabels: [1666, 1766]` instead of decade ticks (1666 is not a decade tick), `accentAtSec`
on a year, a `bracket {fromYear, toYear, atSec, text}`, and a year with an item turns solid when its item rises.

## Shot B_p3075_date

| Field | What it says |
|---|---|
| Line | a4-01 end, a4-02: "At least, that's the date (11.21) Newton gives when he writes it up, six (13.33) years later. He's 23 (15.71). He has just bought a triangular (18.57) glass prism. People already (20.88) know a prism can throw colours on a wall." |
| Subject | The printed date, then the prism and the "celebrated Phænomena". |
| World and why | ArchivalScanCard (VIS-001), SRC-058 NEW p.3075, on the dark paper desk (LOK-027): **same idea**, the letter is the proof of the date. |
| Period honesty | The real 1672 page; source tag `ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672 · P. 3075`. |
| Entry | Focus match (TRN-015, `focus [188, 812]`) from the rail's 1666 into the printed "1666": the year becomes its print. `side left`, `crop [40, 1040, 1480, 1411]` (the heading "A Letter of Mr. Isaac Newton ..." to the foot of the page). |
| Path and landing | Card x 120-1020. Highlights: **H1** "in the beginning of the Year 1666" `[855,2128,632,62]` + `[64,2171,124,78]` at 11.21 ("date"). **H2** "Febr. 6. 1671/72" `[1328,1846,155,66]` + `[120,1901,135,64]` at 13.33 ("six"): the page's own date is the "six years later". Note `AGE 23` (accent) at 15.71. **H3** "Triangular glass-Prisme" `[1290,2229,198,70]` + `[62,2284,385,64]` at 18.57, with `callout {atSec 18.57, dim 0.45}` and H1, H2 `dimAtSec 18.57`. **H4** "to try therewith the celebrated Phænomena of Colours" `[450,2284,1048,64]` + catchword `[1326,2349,165,60]` at 20.88 ("already"). Quote column (x 1110-1800): "in the beginning of the Year 1666", `quoteAtSec 11.21`. |
| Scale | Drift only (MOT-001). |
| Action | Highlights as read; the callout at 18.57 is the layout change (14.6 s shot). |
| Exit | Carried off by the canvas glide. |
| Eye out | H4 at the page foot (about (700, 840)); the glide carries the eye to the next page's top-left, where "Colours." (the catchword's own word) is already lit. |
| Sound | SFX-024 for the match (9.52). Highlights silent. SFX-020 for the glide at 24.10 (pause after "wall."); MUS-012 enters with it. |
| Texture | **ground:** the dark desk; the scan gets nothing new; TEX-008 strokes `shadow`, 0.2, off the highlighted lines (1 of 3). |

## Shot C_p3076_chamber (card, one line)
TRN-004 glide `dir right, pull 0.86` from B (the next page on the same sheet; keeps `side left`); SRC-058 p.3076,
`crop [40, 120, 1480, 1411]`; H0 "Colours." `[68,126,200,64]` lit from frame 0 (carried from B's catchword); H1 "having
darkened my chamber" `[740,126,665,64]` at 28.62 ("darkens"); H2 "made a small hole in my window-shuts" `[66,186,945,62]` at
31.27 ("small"); quote empty; source `... · P. 3076`; desk ground. Eye starts top-left at "Colours.", ends on "hole" at
**(375, 184)**, the push point. Ground placement, no strokes.

## Shot D1_shutter_room

| Field | What it says |
|---|---|
| Line | a4-03 end, a4-04 start: "and he lets one thin beam (34.71) of sunlight in. He puts the prism (37.77) in the beam. The glass bends (40.29) the light, and on the far wall, a band (43.25) of colours appears." |
| Subject | The light path, built left to right: hole, beam, prism, band. |
| World and why | PerspectiveGrid (VIS-015) room, **same place** as A0 and act 3: `depth 2000, dark 0.85` (darker: "he darkens his room"), `fog 0.15` (LOK-014), `dolly 0.02`. |
| Period honesty | Tag `ILLUSTRATION · NEWTON'S DARKENED ROOM` (PerspectiveGrid `tag`, top-left corner (120, 84)) on 33.70, held through D2. No window view, no place: where he did it is not known. |
| Entry | Push (TRN-006, `focus [375, 184]`) from the word "hole" on C. The hole `[-1050,-150,600] r 16` is lit on the cut frame at **(281, 373)**: 94 px across, 189 down from the push point. Light comes from the left, the direction the story reads. |
| Path and landing | Beam hole -> prism `[-600,-60,950]` (screen (638, 438)) draws on "beam" 34.71 (0.9 s). Prism (size 160) on "prism" 37.77. **Builder 3:** the fan's cone (prism -> back wall) draws on "bends" 40.29 (`coneAtSec`), and the band on the wall on "band" 43.25: fan `from [-600,-60,950], x0 150 (violet), x1 650 (red), y -40, height 100, z 2000` -> band x 1013-1191, y 456 (5:1). The path runs from the left third to the right of centre; lead room to the right. |
| Scale | Dolly only. |
| Action | Each piece arrives on its word. |
| Exit | Hard cut at 44.90 (pause after "appears.") to the far wall. The tag stays (same scene). |
| Eye out | The band at (1102, 456) -> D2's band centre (900, 470): 202 px. |
| Sound | SFX-020 push whoosh at 32.93, -26 dB. SFX-028 (Pixabay) wooden-shutter knock trimmed to 0.14 s on the cut, 33.06 (before "and" 33.22). SFX-022 projector ambience J-cut from 32.70, 26-30 dB under, through D2, fading 60.3-60.7. SFX-028 glass clink on the prism's settle 38.95 (pause 38.9-39.8). |
| Texture | **ground:** TEX-009 NEW plaster, faint, inside the wall and floor planes only (the wall the colours land on); grid lines, beam, prism and band stay crisp and flat. If TEX-009 is not registered by Gate 2, flat. |

## Shot D2_far_wall

| Field | What it says |
|---|---|
| Line | a4-04 end, a4-05 to "wide.": "Red (45.44) at one end, violet (46.62) at the other, and everything (48.00) in between. The first thing that surprises him is its shape (52.20). The beam came in through a small round (55.26) hole, but the band on the wall is long (58.06), about five (58.92) times longer than it is wide." |
| Subject | The band; then its shape against the round hole. |
| World and why | Same room, **the far wall close** ("we go into it", rule 7): `depth 400, dark 0.85, fog 0, dolly 0.02`. |
| Period honesty | Tag held from D1 (`startSec -1`, no re-entry). |
| Entry | On the cut the band is there: fan `from [-1400,-100,-250]` (off-screen upper left, the light's direction), `x0 418 (violet), x1 -582 (red), y 0, height 200, z 400` -> band **x 533-1267, y 397-543** (733x147 px, 5:1). Red on the left, the end named first. |
| Path and landing | Labels (mono caps, size 22, `dy` below the band, y 573): `RED` at x 570 on 45.44; `VIOLET` at x 1230 on 46.62; `EVERYTHING IN BETWEEN` centred x 900 on 48.00 (gaps 155 and 135 px). **Phase 2 (the layout change):** labels un-wipe 51.74; the band dims to 0.45 on "shape" 52.20 (Builder 2 `dimSec`) so its outline reads; a dashed ring (Builder 5) `[-482,0,400] r 100` -> (607, 470) r 73 on "round" 55.26, label `ROUND HOLE` under it at 55.66; four more dashed rings step along the band at x 753, 900, 1047, 1193 on "five" 58.92 (0.15 s apart); label `× 5` at (1332, 470), right of the band's end, at 59.60. |
| Scale | The cut itself is the size change. |
| Action | The rings count the band out: five holes long. |
| Exit | Labels un-wipe 60.40; the tag un-wipes 60.30; slide at 60.78. |
| Eye out | `× 5` at (1332, 470) -> E's H1 starts at (936-1742, 377): about 0 across, 93 down. |
| Sound | Ambience continues (SFX-022). All changes sit on words: silent. SFX-024 for the slide at 60.70. |
| Texture | **ground:** TEX-009 plaster on the wall plane; the band, rings and labels flat and crisp. |

15.9 s in one framing: accepted because the dim at 52.20 and the ring build are a full change of layout inside the shot
(colours -> shape); every gap is under 3.7 s.

## Shot E_p3076_oblong (card, one line)
TRN-007 slide; SRC-058 p.3076, `side right`, `crop [40, 120, 1480, 1411]`; H1 "an oblong form; which, according to the
received laws of Refra-" `[68,516,1414,62]` at 61.30; H2 "ction, I expected should have been circular," `[66,573,950,62]` at
63.73 ("says"; holds 2.4 s); quote column "which, according to the received laws of Refraction, I expected should have been
circular" `quoteAtSec 63.73`; source `... · P. 3076`; desk. Eye starts on "oblong" (1050, 377), ends at H2 (1210, 410).
Ground placement.

## Shot F_common_view (panel, one line plus positions)
TRN-011 band `dir down, tone dark` at 66.17 (SFX-024 66.07); KeywordPanel (TXT-024) on **warm graphite**, 64 px chips:
`something simple` (560, 250) 69.17; `white light` (560, 390) 71.20; `is pure` accent (960, 390) 72.00; `the prism`
(560, 530) 73.66; `changes it` (900, 530) 73.90; `makes the colours` (560, 670) 75.68; on "suspects" 77.94 the six chips dim
to 0.35 (Builder 15); `Newton` (560, 830) 77.70; `the other way round` accent (800, 830) 78.80. The rows start at x 560 so
the first chip lands within 25% of E's last highlight (1210, 410). The dim is the layout change of a 14.2 s shot. Ground
placement, no texture (words only).

## Shot G_p3078_crucis (card, one line)
TRN-007 slide 80.32 (SFX-024 80.22); SRC-058 p.3078, `side right`, `crop [55, 968, 1460, 1383]` (scale 0.596); H1
"Experimentum Crucis," `[88,1636,460,68]` at 83.25; quote "Experimentum Crucis" (italic) `quoteAtSec 85.13` ("crucial"),
so the print and its English arrive together; source `... · P. 3078`; desk. Eye ends on H1 at **(1074, 546)**.

## Shot H_fig18

| Field | What it says |
|---|---|
| Line | a4-08: "He lets the band of colours fall on a board (89.25) with a small hole (90.05) in it." |
| Subject | Fig. 18: Newton's own drawing of the two boards and two prisms. |
| World and why | SpotlightIsolator (VIS-005) on SRC-059 NEW, Plate IV, **same idea**: his own picture of the experiment the line describes. The plate is crowded (Figs. 17-20), the right use of VIS-005. |
| Period honesty | Label `NEWTON'S OWN DRAWING · OPTICKS, 1704`: the date says it was drawn later. Never flipped, even though his light runs right to left. |
| Entry | Lens settle (TRN-017) at 86.80 from G. `crop [0, 380, 2423, 1363]` (scale 0.792, full frame); `target [450, 770, 1720, 610]` -> screen x 357-1719, y 309-792, centre (1038, 550): 36 px from G's H1. |
| Path and landing | Brackets lock on "He lets" 87.45; label below the target (y about 834) 0.4 s later. |
| Scale | Drift only. |
| Action | The lock. |
| Exit | The focus match on 91.32 carries the drawn board's hole into the room's. |
| Eye out | Fig. 18's hole g (second board), source (930, 1130) -> screen **(740, 594)** -> I1's board hole (800, 500). |
| Sound | SFX-019 (focus set) on the settle, 86.85 (pause 86.2-87.45). SFX-024 for the match at 91.22. |
| Texture | **object:** the plate keeps its own paper and ink (rule 25); nothing added; brackets and label crisp. |

Note the plate's light travels right to left and our room's left to right. The match is on a point (the hole), not on a
direction, and Fig. 18 is on screen only 4.5 s; I accept the flip of direction rather than flip a period source.

## Shot I1_board_room

| Field | What it says |
|---|---|
| Line | a4-08: "Only one colour gets through (92.65), say, just the blue (94.45). Then he sends that blue light through a second (97.50) prism." |
| Subject | The hole in the board, and the one colour that passes it. |
| World and why | The room again (same place), wide: `depth 2000, dark 0.85, fog 0, dolly 0.02`. Tag `ILLUSTRATION · NEWTON'S DARKENED ROOM` on 92.00, held through I2. |
| Period honesty | A drawn room with one board (the script's simplification of Newton's two boards; the drawing just shown has both). |
| Entry | Focus match (TRN-015, `focus [740, 594]`). On the cut: shutter, hole, beam, prism 1 (as D1), and **Builder 4 `board`**: an upright board at z 1200, centre `[-335,170,1200]`, w 700, h 520 (screen x 633-967, y 427-676) with a hole `[-335,63,1200] r 14` at **(800, 500)**; the fan's cone from prism 1 lands on the board: `z 1200, x0 -255 (violet), x1 -655 (red), y 63, height 80`, placed so its blue falls on the hole. |
| Path and landing | A blue beam (`color` = wavelengthRGB(460)) draws from the hole to prism 2 `[150,40,1650]` (screen (1020, 486)) on "gets through" 92.65; label `BLUE` 36 px below the beam's middle at (910, 530) on 94.45; prism 2 (size 160) on "second" 97.50. |
| Scale | Dolly only. |
| Action | Only blue passes; the rest of the band stops on the board. |
| Exit | Hard cut at 98.73 (pause after "prism."). |
| Eye out | Prism 2 (1020, 486) -> I2's prism 2 (1045, 493). |
| Sound | SFX-022 ambience J-cut from 91.00 (second and last scene for it in this act), through I2, fading 111.7-112.1. SFX-028 glass clink on prism 2's settle 98.35 (pause 98.2-99.4). |
| Texture | **ground:** TEX-009 plaster in the wall planes; board flat panel (theme panel colour), crisp. |

## Shot I2_second_prism

| Field | What it says |
|---|---|
| Line | a4-09 to "too.": "If the glass (99.64) makes the colours, the second prism should turn that blue (102.42) into something else. It doesn't (104.93). The blue bends (106.77) again, by its own fixed (108.41) amount. He tries the other (110.78) colours too." |
| Subject | Prism 2 and what leaves it. |
| World and why | Same room, the camera nearer the board (every z - 800): `depth 1200, dark 0.85, fog 0`. The shutter is now behind the camera; prism 1 stays in frame at the left, so both prisms are seen. |
| Period honesty | The ghost is labelled as the prediction, never shown as a result. |
| Entry | On the cut: prism 1 `[-600,-60,150]` (432, 417); board `[-335,170,400]` with hole **(714, 516)**; band on the board `z 400, x0 -255, x1 -655, y 63, h 80`; prism 2 `[150,40,850]` (1045, 493); blue beam hole -> prism 2. |
| Path and landing | Caption label `IF THE GLASS MAKES THE COLOURS` at (1295, 298) on "glass" 99.64. **Builder 6 ghost fan** from prism 2 to the wall (`z 1200, x 400-1000, y -40, h 120` -> x 1151-1438, y 451): dashed outline, faint spectral fill 0.18, on "blue" 102.42. **Music break** in the pause 103.6-104.77. On "doesn't" 104.93 the ghost and its caption go (label un-wipes 104.73, ghost fades 0.4 s): the act's peak, dry. Blue bends: beam prism 2 -> `[560,-120,1200]` (1228, 413) on "bends" 106.77; a blue patch there 107.10; label `ITS OWN FIXED AMOUNT` under prism 2 at (1045, 583) on "fixed" 108.41. Then **Builder 7 `shift`**: the band on the board slides so red sits on the hole on "other" 110.62 (Newton turning the first prism); red beam hole -> prism 2 -> `[640,0,1200]` (1266, 470), bent less, 110.78-111.30. |
| Scale | The cut. |
| Action | The ghost goes; the real blue bends by itself; red bends less. |
| Exit | Labels un-wipe 111.70; slide at 112.19. |
| Eye out | The wall spots (about (1250, 440)) -> J's H1 (1150, 190): the slide carries the eye up. |
| Sound | MUS-010 break 103.6-104.77 (Thinking Music cut); no hit (SFX-025 is at 3 of 3). The rest on words: silent. SFX-024 for the slide at 112.10. |
| Texture | **ground:** TEX-009 plaster; ghost, beams, labels crisp. |

13.5 s: "It doesn't." at 104.93 changes the layout (the ghost leaves); gaps never over 2.3 s.

## Shot J_p3082_obstinately (card, one line)
TRN-007 slide; SRC-058 p.3082, `side right`, `crop [40, 60, 1480, 1411]`; H1 "parted from those of other kinds,"
`[60,132,745,66]` at 113.49 ("separated"); H2 "obstinately retained its colour," `[1228,132,245,66]` + `[60,189,470,62]` at
115.01; H3 "notwithstanding my utmost endeavours to change it." `[528,189,944,62]` + `[60,244,265,62]` at 117.16 (2.04 s
hold); quote "it hath afterwards obstinately retained its colour, notwithstanding my utmost endeavours to change it."
`quoteAtSec 115.01`; source `... · P. 3082`; desk. Eye ends at H3 (about (1130, 220)).

## Shot L_sorting_room

| Field | What it says |
|---|---|
| Line | a4-10: "So the prism isn't making (120.85) the colours, it's sorting (122.43) them. Every (124.15) kind of ray was in the white sunlight all along, mixed (127.21) together. The glass just spreads (130.12) them out." |
| Subject | The turn word, then the white beam's hidden colours. |
| World and why | The room wide (as D1, `depth 2000, dark 0.85, fog 0`), **same place**, the whole path lit on the cut: hole, white beam, prism 1, cone, band (D1's values). Tag `ILLUSTRATION · NEWTON'S DARKENED ROOM` on 119.90. |
| Period honesty | Coloured dots are our picture of "kinds of ray" (an illustration, tagged). |
| Entry | TRN-012 colour block `color #FFF6DD` (the beam's white), `side left` (from where the light comes) floods and reveals the lit room. Chips (TXT-024, overlay) in the dark ceiling band: `making` (1000, 140) on 120.85, struck 121.41; `sorting` accent (1340, 140) on 122.43. Both more than 120 px above the light path (y 373-456). |
| Path and landing | On "Every" 124.15 the white beam dims to 0.3 (Builder 2) and RayParticles (VIS-021) run hole -> prism, `count 12`, `colors` the six spectral hexes cycled, `jitter 6`. Label `MIXED TOGETHER` at (460, 560) on 127.21 (155 px below the dots), un-wipes 129.40. On "spreads" 130.12: six rays objects prism -> their own spot on the band (red end x 1191 ... violet end x 1013), `count 4` each (36 dots in all, under 40). |
| Scale | Dolly only. |
| Action | The mixture becomes the order on the wall. |
| Exit | Chips leave with the panel `untilSec 130.80`; hard cut at 131.63. |
| Eye out | The band (1102, 456) -> M's wall band at the cut (1246, 461). |
| Sound | SFX-024 under the block at 119.10; MUS-013 Long Note Two enters with it. Rest silent (on words). |
| Texture | **ground:** TEX-009 plaster; dots, chips and lines crisp. |

## Shot M_lens

| Field | What it says |
|---|---|
| Line | a4-11 to "again.": "He checks it the other way too. He gathers (134.74) the spread-out rays back together with a lens (136.91). Where they meet (138.65), they make white (139.57) again." |
| Subject | The lens, then the white spot. |
| World and why | Same room, nearer prism 1 and turned towards a clear patch of wall: `depth 1400, dark 0.85, fog 0`. |
| Period honesty | Tag held from L (`startSec -1`). |
| Entry | On the cut: beam from off-left into prism `[-900,-60,300]` (253, 423); the fan to the back wall (band x 400-900 at z 1400 -> x 1136-1356, y 461). |
| Path and landing | **Builder 8 `lens`** (vertical biconvex outline, the prism's ink) `[-200,-40,800]` h 500, w 80 -> (844, 447), 290 px tall, rises into the cone on "gathers" 134.74; the wall band exits (Builder 2 `untilSec` 135.20) and a second fan's band lands on the lens plane (z 800, x -350..-50 -> x 757-931). On "rays" 135.64 six coloured rays objects run from their lens points to `[600,-20,1400]` (1224, 461), `count 5` each (30). Label `LENS` under the lens (844, 640) on 136.91. On "meet" 138.65 the dots meet; a white patch (`#FFF6DD`, glow) blooms there on "white" 139.57; label `WHITE AGAIN` under it (1224, 560) at 139.81. |
| Scale | The cut. |
| Action | The colours go back into one white. |
| Exit | Labels and tag un-wipe 140.30; the drafting wipe at 140.72. |
| Eye out | The white spot (1224, 461) -> N's H2 (1351, 407). |
| Sound | Silent (all on words); SFX-017 ink line under the drafting stroke 140.75-141.20 (pause). |
| Texture | **ground:** TEX-009 plaster; lens outline, rays, labels crisp. |

## Shot N_p3083_white (card, one line)
TRN-002 drafting wipe `angle 8, dir left` (uncovers the card on the right first, where the eye is), J-cut; SFX-017 under
the stroke; SRC-058 p.3083, `side right`, `crop [40, 400, 1480, 1411]`; H1 "all the Colours of the Prisme being made to
converge," `[1145,678,330,62]` + `[70,735,862,66]` at 141.26 ("In his words"); H2 "reproduced light, intirely and perfectly
white," `[262,845,1032,66]` at 143.02 (2.7 s hold); quote "reproduced light, intirely and perfectly white" `quoteAtSec
143.02`; source `... · P. 3083`; **ground LOK-028 blur of the same page** (keeps the paper desk under 35%). Eye ends on H2
(1351, 407).

## Shot O_glass_today

| Field | What it says |
|---|---|
| Line | a4-12: "Ever seen a little rainbow (147.04) thrown on a wall by a window, or a glass (149.62) of water? Then you've seen the first half (152.10) of his experiment." |
| Subject | The everyday rainbow. |
| World and why | FootagePlate (VIS-016) image, SRC-062 NEW: **same idea, today**: sunlight split by a glass of water on a table. |
| Period honesty | `PHOTO TODAY` tag; it is never said to be Newton's. |
| Entry | Lens settle (TRN-017) at 145.73. `crop [0, 200, 2560, 1440]` (scale 0.75); `push 0.02` the one move. The inner arc's upper limb at about (963, 240) is where the eye lands (388 px from N's H2). |
| Path and landing | Tag (DatelineTag, bottom-left (120, 980)): part 1 `PHOTO TODAY` on "rainbow" 147.04; part 2 `· SUNLIGHT THROUGH A GLASS OF WATER · R. & S. HOLLOS, EXSTROM LABS · CC BY 4.0` on "glass" 149.62. Chip (TXT-024) `the first half` at (1300, 120), in the plain wood between the arcs and the glass (source x 1712-2200, y 200-460), on 152.10. |
| Scale | Push only. |
| Action | None on the photo itself. |
| Exit | Tag un-wipes 153.60 (before the chip, which leaves with the slide). |
| Eye out | The chip (1470, 160) -> P's H1 (1353, 333). |
| Sound | SFX-003 shutter click on the settle frame 146.20 (pause 145.2-146.38). SFX-024 for the slide at 154.02. |
| Texture | None: TODAY photo, nothing laid on it (rule 25; TEX-008 never on a colour photo). |

## Shot P_p3081_quote (card, one line)
TRN-007 slide; SRC-058 p.3081, `side right`, `crop [40, 700, 1480, 1411]`; H1 "Colours are not Qualifications of Light,"
`[362,1018,845,64]` at 156.92; H2 "derived from" `[1205,1018,297,64]` at 160.79; H3 "Refractions, or Reflections of natural
Bodies" `[86,1074,980,63]` at 161.51 (3.4 s hold); quote "Colours are not Qualifications of Light, derived from
Refractions, or Reflections of natural Bodies" `quoteAtSec 156.92`; source `... · P. 3081`; desk; TEX-008 `shadow` 0.2 off
the highlighted lines (2 of 3). Eye ends at H3 (1230, 365).

## Shot Q_plain_version (panel, one line plus positions)
TRN-011 band `dir down, tone dark` at 164.88 (SFX-024 164.78); **ground LOK-028 blur of SRC-058 p.3081** (the page just
read, soft, brightness 0.38), label `NEWTON'S LETTER · 1672 · P. 3081` (right-aligned, (1800, 980), size 22) at 165.50;
chips on the right half (first one within 25% of P's H3): `glass` (900, 300) 167.30, struck 168.20; `light bouncing off
things` (900, 440) 169.92, struck 171.30; `each kind of ray` (900, 600) 172.73; `fixed` accent (1430, 600) 174.17; `which
colour you'll see` (900, 760) 176.33. First chip at 167.30 keeps 15 s after O's chip (152.10). Ground placement.

## Shot R_p3075_masthead (card, one line)
TRN-007 slide 177.90 (MUS-014 At Rest enters); SRC-058 p.3075, `side left`, `crop [0, 40, 1554, 1923]` (card 695 wide,
scale 0.4285); H1 "from Cambridge, Febr. 6. 1671/72" `[990,1846,492,66]` + `[120,1901,135,64]` at 180.07; note `CAMBRIDGE ·
FEB 1672` at 181.11; H2 "PHILOSOPHICAL TRANSACTIONS." `[60,175,1412,120]` + `[310,340,942,70]` at 184.75; H3 "to be
communicated to the R. Society" `[410,1901,665,64]` at 187.28 (2.1 s hold); quote empty; source `... · P. 3075`; desk;
TEX-008 `shadow` 0.2 (3 of 3). Eye starts at H1 (660, 915), ends at H3 (450, 940).

## Shot S1_hooke

| Field | What it says |
|---|---|
| Line | a4-15 to "says so.": "Plenty of readers (190.59) like it, but not (192.00) all of them. Robert Hooke (194.04), a leading London (195.30) scientist, is not impressed, and says so (198.50)." |
| Subject | Hooke, shown by his book. |
| World and why | KeywordPanel with an overlay sticker; **ground LOK-028 blur of SRC-060 NEW** (the Micrographia title page): the card's own picture behind it, and the person the line points to. |
| Period honesty | Tag line 2 says it: no authentic portrait of Hooke survives, so his 1665 book stands for him. |
| Entry | TRN-011 band `dir up, tone dark` at 189.38 (up: the story lifts from the letter to its readers). Chips (64 px) low-left, within 25% of R's H3: `plenty of readers` (120, 640) 190.59; `not all of them` accent (120, 760) 192.00. Sticker (VIS-060): Micrographia title page `crop [40, 280, 1490, 2340]`, w 420 (h about 597), rises on "Robert" 194.04 and lands at **(1380, 520)** (right third, top edge y 222), tilt 2°, white edge 6 px. |
| Path and landing | Tag under the sticker (x 1170-1800, y about 850): line 1 `ROBERT HOOKE · MICROGRAPHIA, LONDON, 1665` with the landing; line 2 `NO AUTHENTIC PORTRAIT OF HOOKE SURVIVES` on "scientist" 195.62. Chip `says so` accent (120, 880) on 198.50. |
| Scale | Sticker lands at size; drift on the ground. |
| Action | None after landing (never animate a portrait; here, a page). |
| Exit | Tag un-wipes 199.10, before the sticker; the slide takes the rest at 199.81. |
| Eye out | `says so` (230, 920) -> S2's H1 (617, 189): the slide carries it up. |
| Sound | SFX-024 band 189.28. SFX-026 soft pop on the sticker's settle 194.64 (pause 194.55-194.90). SFX-024 slide 199.72. |
| Texture | **object:** the title page (its own printed surface, rule 25) on its own blur; chips and tag crisp. |

## Shot S2_p5084_answer (card, one line)
TRN-007 slide; SRC-061 NEW p.5084, `side left`, `crop [30, 60, 1420, 1354]` (scale 0.6086); H1 "Answer to some
Considerations" `[495,127,650,64]` at 200.61 ("arguments"); note `ABOUT 6 YEARS` at 203.95 ("six"); quote "Answer to some
Considerations upon his Doctrine of Light and Colors" `quoteAtSec 200.61`; source `ISAAC NEWTON · ANSWER TO HOOKE'S
CONSIDERATIONS · PHIL. TRANS. 1672 · P. 5084`; desk. Eye ends on "Light and Colors" in the heading, source (296-700, 183-246)
-> **(423, 222)**, the match point.

## Shot T_where_is_it

| Field | What it says |
|---|---|
| Line | a4-16: "But notice what Newton (206.83) has done. He's taken colour out (209.69) of the glass. So where (212.06) is it?" (act ends 215.70) |
| Subject | The light, and the colours it carries; the glass as only glass. |
| World and why | The room wide (as D1, `depth 2000, dark 0.85, fog 0`), **same place**: the act ends where it started, now explained. |
| Period honesty | Tag `ILLUSTRATION · NEWTON'S DARKENED ROOM` on "Newton" 206.83 (the name on screen). |
| Entry | Focus match (TRN-015, `focus [423, 222]`): the printed "Light" goes into the hole of light at (281, 373) (142 px, 151 px). The full path is lit on the cut. |
| Path and landing | Dolly 0.02 the one move. On "out" 209.69 the prism dims to an empty outline, 0.3 (Builder 2 on `prism`): the glass is just glass; beam and band stay bright. On "where" 212.06 the grid lines fade to 40% (Builder 9 `lineFadeSec`), leaving only the light path. |
| Scale | Dolly only. |
| Action | The glass empties; the light stays. |
| Exit | Holds to the act end; At Rest alone 212.9-215.70. Act 5 decides its own in. |
| Eye out | The band (1102, 456). |
| Sound | SFX-024 for the match 205.34 (pause 204.9-206.09). At Rest alone after "it?". |
| Texture | **ground:** TEX-009 plaster (it fades with the lines). |

---

## Transition review

Eye trace: the focal point lands within 25% (480 px across, 270 down) or the move carries it. Every transition starts on
the new beat's first frame and sits in a pause (checked against the word times).

| # | From -> to | On the line | Transition and parameters | Why | Sound |
|---|---|---|---|---|---|
| 1 | A0 -> A | "So let's go back" (2.40) | TRN-011 PaperBandWipe `dir down, tone dark`, 0.65 s | room to timeline is a scene change; the band is the series' chapter turn | SFX-024 2.28 |
| 2 | A -> B | "At least" (9.62) | TRN-015 FocusMatchCut `focus [188, 812]`, 0.65 s | the year to its print (a word to its page) | SFX-024 9.52 |
| 3 | B -> C | "Newton wants" (24.25) | TRN-004 CanvasGridPan `dir right, pull 0.86`, 1.3 s | the next page on the same sheet; catchword "Colours," -> "Colours." | SFX-020 24.10; MUS-012 in |
| 4 | C -> D1 | "and he lets" (33.06) | TRN-006 PushThrough `focus [375, 184]` | the word "hole" becomes the hole | SFX-020 32.93; SFX-028 knock 33.06 |
| - | D1 -> D2 | "Red" (44.90) | hard cut, same scene | we go to the wall | none |
| 5 | D2 -> E | "By the rules" (60.78) | TRN-007 SlideAcross 0.7 s | out of the drawing into his own words | SFX-024 60.70 |
| 6 | E -> F | "At the time" (66.17) | TRN-011 band `dir down, tone dark` | a turn of the story: the common view | SFX-024 66.07 |
| 7 | F -> G | "So he sets up" (80.32) | TRN-007 slide | into a document | SFX-024 80.22 |
| 8 | G -> H | "He lets" (86.80) | TRN-017 LensSettle `durSec 0.7, blur 14` | a cut to a real picture (the plate) | SFX-019 86.85 |
| 9 | H -> I1 | "Only one colour" (91.32) | TRN-015 `focus [740, 594]` | his drawn hole becomes the room's hole | SFX-024 91.22 |
| - | I1 -> I2 | "If the glass" (98.73) | hard cut, same scene | closer on prism 2 | none |
| 10 | I2 -> J | "Once a colour" (112.19) | TRN-007 slide | into his words | SFX-024 112.10 |
| 11 | J -> L | "So the prism isn't" (119.20) | TRN-012 ColourBlockWipe `color #FFF6DD, side left` | the act's turn; white light floods in and reveals its colours | SFX-024 119.10; MUS-013 in |
| - | L -> M | "He checks it" (131.63) | hard cut, same scene | closer, the lens | none |
| 12 | M -> N | "In his words" (140.72) | TRN-002 JCutDraftingWipe `angle 8, dir left`, 0.8 s | from a diagram into a document | SFX-017 140.75 |
| 13 | N -> O | "Ever seen" (145.73) | TRN-017 `durSec 0.7, blur 14` | a cut to a real photo; not two lenses in a row (row 12 is a wipe) | SFX-003 146.20 |
| 14 | O -> P | "In his letter" (154.12) | TRN-007 slide | into a document | SFX-024 154.02 |
| 15 | P -> Q | "Put simply" (164.88) | TRN-011 band `dir down, tone dark` | the plain version of the quote | SFX-024 164.78 |
| 16 | Q -> R | "He sends all this" (177.90) | TRN-007 slide | into a document | SFX-024 177.80; MUS-014 in |
| 17 | R -> S1 | "Plenty of readers" (189.38) | TRN-011 band `dir up, tone dark` | the story turns to the readers | SFX-024 189.28 |
| 18 | S1 -> S2 | "The arguments" (199.81) | TRN-007 slide | between two documents (Hooke's book -> Newton's reply) | SFX-024 199.72 |
| 19 | S2 -> T | "But notice" (205.44) | TRN-015 `focus [423, 222]` | "Light" in his title to the light in the room | SFX-024 205.34 |

Checks: TRN-015 3 of 19 changes (limit 1 in 3), never adjacent (rows 2, 9, 19). TRN-017 2 of 19 (limit 1 in 4), not
adjacent. TRN-007 six times, never two in a row (5, 7, 10, 14, 16, 18). TRN-011 four times (1, 6, 15, 17), never adjacent.
TRN-006 once, TRN-004 once, TRN-012 once, TRN-002 once. No TRN-013 (none left), no MUS-015 riser, no SFX-025 hit.

---

## Limits

Act 4 use in beats (episode total after act 4 / limit). Raises are listed last.

| Asset | Act 4 use | Episode after act 4 | Verdict |
|---|---|---|---|
| VIS-015 PerspectiveGrid | A0 1, D1 4, D2 7, I1 3, I2 5, L 5, M 4, T 4 = **33** (about 83 s) | 37 / 8 beats | **raise needed** |
| LOK-014 DepthFog | A0 1, D1 4 = 5 | 7 / 8 | inside (fog only where act 3's look is matched and on the first beam) |
| VIS-021 RayParticles | L 3 (b49-51), M 3 (b53-55) = 6 | 16 / 20 | inside |
| VIS-005 SpotlightIsolator | H 2 | 2 / 8 | inside |
| VIS-055 TimelineRail | A 1 shot | 1 (2 per act) | inside |
| VIS-060 StickerCutout | A 3, S1 3 = 6 | act 6 / 12 | inside |
| VIS-016 FootagePlate | O 3 (8.4 s) | 19 / 24 | inside; count the 15% share |
| VIS-001 ArchivalScanCard | 9 cards, 29 beats, 73.1 s (34% of the act) | 65 beats | count the episode's 30% share on the beat sheet |
| TXT-024 KeywordChips | 5 panels (F, L, O, Q, S1), first chips at 69.17, 120.85, 152.10, 167.30, 190.59 | 25 | inside (8 per act, 1 per 15 s) |
| LOK-027 PaperDesk | B, C, E, G, J, P, R, S2 = 70.2 s (32.5%), never 3 in a row | - | inside (~35%) |
| LOK-028 BlurPlate | N, Q, S1 | 3 per act | inside, at the limit |
| TRN-006 | 1 | 7 / 14 | inside |
| TRN-007 | 6 | 12 / 16 | inside |
| TRN-011 | 4 | 12 / 14 | inside |
| TRN-015 | 3 | 9 | inside (1 in 3) |
| TRN-017 | 2 | 3 | inside (1 in 4) |
| SRC-049 Newton after Seeman | A 3 | 6 / 6 | inside, **none left** after act 4 |
| SFX-024 AirSwish | 14 | 29 / 30 | inside (one left for acts 5-7: likely a raise later) |
| SFX-020 LowWhoosh | 2 | 11 / 12 | inside |
| SFX-019 SwitchDial | 1 (H's focus) | 4 / 4 | inside, none left |
| SFX-026 SoftPop | 2 (Newton, Micrographia) | 5 / 8 | inside |
| SFX-017 InkLineFoley | 1 (N's wipe) | 4 / 6 | inside |
| SFX-028 Pixabay kit | 3 (shutter knock, two glass clinks); **no paper files** | 3 | inside each file's limit |
| SFX-016 paper | 0 | 10 / 10 | not used: pages ride on their transition's swish |
| SFX-003 MechanicalShutter | 1 (O) | count (about 3 / 4) | builder to count |
| SFX-022 ProjectorAmbience | 2 scenes (D, I) | count / 3 scenes | if acts 1-3 used 2 already, drop I's |
| TEX-008 ScreenStrokes | B, P, R | 3 per act | inside, at the limit |
| TEX-009 NEW | 7 room shots (D1, D2, I1, I2, L, M, T) | new row | limit to set at registration |
| MUS | 012 in 24.25, 010 break 103.6-104.77, 013 in 119.20, 014 in 177.90, alone 212.9-215.70; no 015, no SFX-025 | - | inside |
| SRC-058 NEW (1672 letter) | B 5, C 3, E 2, G 3, J 3, N 2, P 5, Q 5, R 4 = 32 beats | new row | propose max 34 per episode (act 4 plus one return) |
| SRC-059 NEW (Plate IV) | H 2 | new row | propose max 4 |
| SRC-060 NEW (Micrographia) | S1 4 | new row | propose max 4, always with the no-portrait line |
| SRC-061 NEW (Answer p.5084) | S2 2 | new row | propose max 3 |
| SRC-062 NEW (glass rainbow) | O 3 | new row | propose max 3, always PHOTO TODAY + CC BY credit |

**Raises Sam must approve:**
1. **VIS-015 PerspectiveGrid: 8 -> 37 beats**, keeping 8% of runtime (about 83 s in act 4; check the episode total).
   This is the register's named best use (shutter, prism, Experimentum Crucis, lens). Smaller than the plan's room count
   would leave the experiment unseen. **This is the only raise.**
- Not raised, by design: LOK-014 (fog on 5 beats only), VIS-021 (rays only in L and M), paper sounds (none used).
- New rows to set when registered: SRC-058 to SRC-062 and TEX-009 (above).

**Ground share:** paper desk 32.5%, flat graphite 21.4 s (A, F: 9.9%), blur 3 shots, two full-frame pictures (H, O), and
the drawn room 82.8 s (38.4%). I count the room as its own ground (a drawn world, near black, with its own texture). If
Sam counts it as graphite, the act is at 48% graphite and only cutting room shots can fix it: Sam's call (question 2).

---

## Builder additions

1. **PerspectiveGrid `dollyFrom`** (A0 starts at act 3's end scale 1.02, eases to 1.025; calm limit unchanged).
2. **Exits and dims for every GridObject:** `untilSec` (labels un-wipe 0.4-0.6 s per MOT-013; beams and fans fade 0.4 s)
   and `dimSec` + `dimTo` (beam 0.3 in L, fan 0.45 in D2, prism 0.3 in T).
3. **Fan `coneAtSec`**: the cone from the prism draws first (on "bends"), the band on the wall later (`atSec`, on "band").
4. **`board` object:** an upright board in a z plane (`at`, `w`, `h`, theme panel fill like the shutter) with a `hole`
   offset; a fan with that `z` lands on it and is clipped to the board.
5. **Ring `dashed: true`** and a `stagger` list for D2's five rings.
6. **Fan `ghost: true`**: dashed outline, spectral fill at 0.18, for I2's prediction.
7. **Fan `shift: { atSec, dx }`**: slides the band across the board (I2, red onto the hole), eased 0.5 s.
8. **`lens` object:** a vertical biconvex outline in the prism's ink (`at`, `w`, `h`), entering with a rise; plus the
   second fan whose band sits on the lens plane.
9. **Grid `lineFadeSec` / `lineTo`** (T: the room lines fall to 40% on "where").
10. **A title over the room** for A0 (the ChapterSlate title layer with a transparent ground over PerspectiveGrid, or a
    PerspectiveGrid `title`).
11. **Overlay chips on a PerspectiveGrid beat** (L): confirm the Episode overlay renders KeywordChips over VIS-015.
12. **TimelineRail:** `yearLabels`, `accentAtSec`, `bracket {fromYear, toYear, atSec, text}`, item years solid on rise.
13. **ColourBlockWipe:** fine as is with `#FFF6DD`; optional spectral fringe on the reveal edge (not required).
14. **PaperBandWipe:** only `up`/`down` exist; A0 -> A uses `down` (no left/right needed).
15. **KeywordChips `dimSec`** on a set of chips (F's turn).
16. **FootagePlate tag in two parts** (DatelineTag parts) for O: confirm it works on an image plate.
17. Optional: an `arc` object at prism 2 for "its own fixed amount" (the label alone is enough).

---

## For the fact-check

Every on-screen string, exactly as it will appear (printed quotes as printed, long s shown as s), with its beat.

**Titles, tags, labels**
- b1: `4 · A HOLE IN THE SHUTTER`
- b2-4: `ISAAC NEWTON · AFTER ENOCH SEEMAN, c. 1726`; year labels `1666`, `1766`; slip `DALTON BORN`; bracket chip `100 YEARS`
- b13-23, b36-43, b47-55, b81-84: `ILLUSTRATION · NEWTON'S DARKENED ROOM`
- b17: `RED`; b17-18: `VIOLET`; b18: `EVERYTHING IN BETWEEN`
- b22: `ROUND HOLE`; b23: `× 5`
- b34-35: `NEWTON'S OWN DRAWING · OPTICKS, 1704`
- b37: `BLUE`
- b39-40: `IF THE GLASS MAKES THE COLOURS`; b42: `ITS OWN FIXED AMOUNT`
- b50: `MIXED TOGETHER`; b54: `LENS`; b55: `WHITE AGAIN`
- b58-59: `PHOTO TODAY` / `· SUNLIGHT THROUGH A GLASS OF WATER · R. & S. HOLLOS, EXSTROM LABS · CC BY 4.0`
- b66: `NEWTON'S LETTER · 1672 · P. 3081`
- b76-77: `ROBERT HOOKE · MICROGRAPHIA, LONDON, 1665` / `NO AUTHENTIC PORTRAIT OF HOOKE SURVIVES`

**Card source tags and notes**
- b5-9: `ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672 · P. 3075`; note b7 `AGE 23`
- b10-12, b24-25: `ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672 · P. 3076`
- b31-33: `... · P. 3078`; b44-46: `... · P. 3082`; b56-57: `... · P. 3083`; b61-65: `... · P. 3081` (same prefix)
- b71-74: `... · P. 3075`; note b72 `CAMBRIDGE · FEB 1672`
- b79-80: `ISAAC NEWTON · ANSWER TO HOOKE'S CONSIDERATIONS · PHIL. TRANS. 1672 · P. 5084`; note b80 `ABOUT 6 YEARS`

**Chips (spoken words only)**
- F b27-30: `something simple`, `white light`, `is pure`, `the prism`, `changes it`, `makes the colours`, `Newton`, `the other way round`
- L b47-48: `making` (struck), `sorting`
- O b60: `the first half`
- Q b66-70: `glass` (struck), `light bouncing off things` (struck), `each kind of ray`, `fixed`, `which colour you'll see`
- S1 b75-78: `plenty of readers`, `not all of them`, `says so`

**Highlights (page words as printed) and quote columns**
- p.3075 b5: "in the beginning of the Year 1666"; b6: "Febr. 6. 1671/72"; b8: "Triangular glass-Prisme"; b9: "to try therewith the celebrated Phænomena of" + catchword "Colours,"; quote "in the beginning of the Year 1666"
- p.3076 b10: "Colours." (carried); b11: "having darkened my chamber"; b12: "made a small hole in my window-shuts"
- p.3076 b24: "an oblong form; which, according to the received laws of Refra-"; b25: "ction, I expected should have been circular,"; quote "which, according to the received laws of Refraction, I expected should have been circular"
- p.3078 b32: "Experimentum Crucis,"; quote "Experimentum Crucis"
- p.3082 b44: "parted from those of other kinds,"; b45: "obstinately retained its colour,"; b46: "notwithstanding my utmost endeavours to change it."; quote "it hath afterwards obstinately retained its colour, notwithstanding my utmost endeavours to change it."
- p.3083 b56: "all the Colours of the Prisme being made to converge,"; b57: "reproduced light, intirely and perfectly white,"; quote "reproduced light, intirely and perfectly white"
- p.3081 b62-65: "Colours are not Qualifications of Light," / "derived from" / "Refractions, or Reflections of natural Bodies"; quote "Colours are not Qualifications of Light, derived from Refractions, or Reflections of natural Bodies"
- p.3075 b71: "from Cambridge, Febr. 6. 1671/72"; b73: "PHILOSOPHICAL TRANSACTIONS."; b74: "to be communicated to the R. Society"
- p.5084 b79: "Answer to some Considerations"; quote "Answer to some Considerations upon his Doctrine of Light and Colors"

**Points for the fact-checker to rule on**
1. "Febr. 6. 1671/72" is lit on "six years later" (1666 -> 1672). The note says `CAMBRIDGE · FEB 1672` (new-style year);
   confirm no on-screen gloss of the old-style year is needed.
2. `NEWTON'S OWN DRAWING · OPTICKS, 1704`: confirm Fig. 18 is the Experimentum Crucis set-up (SRC-059's row says so).
3. `ANSWER TO HOOKE'S CONSIDERATIONS`: the page itself names only "some Considerations"; the source tag names Hooke.
4. `ROUND HOLE` labels a dashed circle on the wall that stands for the round image the hole would give.
5. The quote on p.3082 begins "it hath afterwards" (the page's "afcerwards" is a print blemish for "afterwards").
6. The board scene shows one board where Newton used two (the script's simplification); the drawing in H shows both.

---

## Questions for Sam
1. Raise VIS-015 to 37 beats?
2. Is the drawn room its own ground, or graphite (which puts the act at 48% graphite)?
3. T: the prism dims instead of lifting out, because without the prism the band would vanish. OK?
4. Chip strikes (L `making`, Q `glass`, `light bouncing off things`): do they count against TXT-020 StrikeThrough
   (max 2 per episode)? If yes, Q's two strikes become a plain dim.
5. Five shots run 13-16 s (B, D2, F, I2, Q), each with a layout change inside it. Accept, or split?

---

## Applied after fact-check 2 and the Expert (Claude, 25 Nov 2026; written into gate1_act4/beats_act4.py)
Fact-check: gate1_act4_onscreen_factcheck.md (42 PASS, 8 FIX, 3 CHECK). Expert: expert/ep01-act04_gate1_expert.md (4 MUST, 7 SHOULD, 5 TASTE). All FIX and MUST items applied; SHOULDs applied except the vertical band (`fan.axis: "y"`, optional).
- **Light geometry (Expert MUST 1-4, fact-check FIX 2/6):** every prism is drawn point-down (builder: `prism.apex: "down"`), so light bends towards the base; red is the end nearest the beam's straight line in every room shot. D2 fan `x0 -582 (violet), x1 418 (red)`, `VIOLET` x 570, `RED` x 1230. I1: board `[-450,120,1200] w 600`, board band `x0 -422, x1 -303, y -55, h 40`, hole `[-398,-55,1200]` (770, 444), prism 2 `[-34,-46,1650]` (946, 452), one straight line prism 1 -> hole -> prism 2. I2: prism 2 `[-34,-46,850]` (941, 444); blue lands `[249,-339,1200]` (1079, 308), red `[249,-234,1200]` (1079, 358); ghost centred on the blue landing (`x0 169, x1 569, y -339`); prism 1 turns ~4° during the shift; `ITS OWN FIXED AMOUNT` at (941, 530). M: beam from `[-1850,-120,-250]`, wall band violet 400 / red 900, lens-plane band -309..-82, y -51.
- **Labels:** `ROUND, LIKE THE HOLE` (was ROUND HOLE: the ring is the round spot he expected); `NEWTON'S DIAGRAM · OPTICKS, 1704` (was OWN DRAWING); `NO CONFIRMED PORTRAIT OF HOOKE SURVIVES` (was NO AUTHENTIC); p.5084 tag adds `NO. 88`; photo credit `EXSTROM LABORATORIES`; L adds `KINDS OF RAY` over the mixed streaks (dots drawn as short streaks).
- **Printed words:** catchword "Colours." (full stop), p.3076 H2 ends "circular."; R's H3 box `[410,1901,795,64]`, crop `[0,40,1554,1930]`.
- **Q chips:** the verbs are struck (`doesn't create colour`, `creates it`), never `glass` or `light bouncing off things`; 2 strikes in the act (chip layer TXT-024).
- **CHECK items decided:** coloured streaks in the white beam kept as Newton's own 1672 picture ("kinds of ray"), under the ILLUSTRATION tag and the KINDS OF RAY label; act 5 says the rays are not themselves coloured. SRC-061 register row updated to the brief's tag and max 3 beats.
- **Builder additions added:** 18 `prism.apex`; 19 RayParticles `streak` style.
