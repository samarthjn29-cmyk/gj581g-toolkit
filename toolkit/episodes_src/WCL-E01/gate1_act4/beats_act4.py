"""WCL-E01 act 4 'A hole in the shutter': Gate 1 beat sheet rows (beat sheet rows 186-269) from act4_cuts.json.
Shots follow the Director's brief (director/ep01-act04_brief.md: 23 shots, its transition review and its limits), the cue
sheet (act4_cues_v1.json) and Claude's plan (director/ep01-act04_plan.md). Each shot's IDs and note are set once; every
beat gets its own note line. Row = [Beat, Act, Start, End, Spoken, I Visual .. V Notes] (E-G written from the times)."""
import json, re
C = json.load(open("act4_cuts.json"))

def spoken(t):
    for a, b in [("1666", "sixteen sixty-six"), ("He's 23.", "He's twenty-three."), ("1672", "sixteen seventy-two"),
                 ("experimentum cruces", "Experimentum Crucis"), ("spread -out", "spread-out"),
                 ("it obstinately retained its colour,", 'it "obstinately retained its colour".'),
                 ("entirely and perfectly white.", '"entirely and perfectly white".'), ("light,", "light"),
                 ("like this. Colours", 'like this. "Colours'), ("qualifications", "Qualifications"),
                 ("refractions or", "Refractions, or"), ("reflections of natural bodies.", 'Reflections of natural Bodies."'),
                 ("Philosophical Transactions,", "Philosophical Transactions,"), ("impressed, and says so.", "impressed. And says so.")]:
        t = t.replace(a, b)
    return t

L = "LOK-009, LOK-010"
D = "LOK-009, LOK-010, LOK-027"          # page cards on the dark paper desk
TAG = "ILLUSTRATION · NEWTON'S DARKENED ROOM"
SRCTAG = "ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672"

# (first, last, visual, text, motion, transition-in, look, texture, source, music, shot note, per-beat notes)
S = [
 (1, 1, "VIS-015, VIS-007", "TXT-009", "MOT-002", "TRN-001", L + ", LOK-014", "", "", "MUS-007, MUS-008",
  "Calm. Director A0_title_room: act 3's last shot, same place (PerspectiveGrid room, depth 2000, dark 0.7, fog 0.15, shutter [-1050,-150,600] w 260 h 360), starting at act 3's end scale (dollyFrom 0.02 -> 1.025) so the join shows no jump. Texture none (must match act 3's frame).",
  ["Title 4 · A HOLE IN THE SHUTTER (Fraunces, slate size) rises 0.20-0.90 at x 620, baseline y 560, right of the shutter (281, 373); un-wipes 1.85-2.30. Wholesome alone (cue 1, -26 LUFS on the sheet). SFX-024 at 2.28 for the band."]),
 (2, 4, "VIS-055, VIS-060", "TXT-010", "MOT-002, MOT-013", "TRN-011", L, "", "SRC-049", "MUS-007",
  "Calm. Director A_rail_1666: TRN-011 band (down, dark) from the room. TimelineRail on warm graphite (the change itself: a span of time), from 1640 to 1790, 9 px a year; cams on 1666, then 1716 during 'a hundred years'. Newton = SRC-049 sticker (w 220), tag ISAAC NEWTON · AFTER ENOCH SEEMAN, c. 1726 (a later likeness). Texture: object (the engraving's own surface), ground flat.",
  ["Newton rises from behind the rail on 'Newton' (3.58) at x 960 (single reveal, centred on purpose); tag wipes on 0.4 s later; soft pop SFX-026 on his settle 4.25 (pause 3.95-4.97).",
   "Year label 1666 goes accent on 'sixteen sixty-six' (5.69).",
   "One pan on 'a hundred years' (7.27-8.77) carries Newton to x 510 and brings 1766 in at x 1410; bracket 1666 -> 1766 draws under the year labels (y 790), chip 100 YEARS at x 960 (7.40); slip DALTON BORN rises at 1766 on 'Dalton' (8.27). SFX-024 at 9.52 for the match."]),
 (5, 9, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-015", D, "TEX-008", "SRC-058", "MUS-007",
  "Calm. Director B_p3075_date: TRN-015 focus match [188, 812] from the rail's 1666 into the printed 1666 (the year becomes its print). ArchivalScanCard on SRC-058 p.3075, side left, crop [40, 1040, 1480, 1411]; source tag " + SRCTAG + " · P. 3075; quote column 'in the beginning of the Year 1666' from 11.21. Texture: ground (dark desk); scan untouched; TEX-008 strokes 'shadow' 0.2 off the highlighted lines (1 of 3).",
  ["Match lands; H1 'in the beginning of the Year 1666' on 'date' (11.21) and the quote column.",
   "H2 'Febr. 6. 1671/72' (the page's own date) on 'six' (13.33): this is the 'six years later'.",
   "Note AGE 23 (accent) on 'twenty-three' (15.71).",
   "H3 'Triangular glass-Prisme' on 'triangular' (18.57); callout: H1/H2 dim to 0.45 (the shot's layout change); H4 'to try therewith the celebrated Phænomena of' + catchword 'Colours.' on 'already' (20.88): people already knew.",
   "Nothing new: H3/H4 hold ('know a prism can throw colours on a wall'). SFX-020 at 24.10 for the glide; cue 2 enters with it."]),
 (10, 12, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-004", D, "", "SRC-058", "MUS-012, MUS-008",
  "Calm. TRN-004 canvas glide (dir right, pull 0.86): the next page on the same sheet. SRC-058 p.3076, side left, crop [40, 120, 1480, 1411]; source tag ... · P. 3076; no quote column. Ground placement, no strokes. Cue 2 (Thinking Music) enters in the pause before 'Newton wants to know' (24.25).",
  ["Glide lands with H0 'Colours.' lit (carried from p.3075's catchword); the eye starts top-left.",
   "H1 'having darkened my chamber' on 'darkens' (28.62).",
   "H2 'made a small hole in my window-shuts' on 'small' (31.27); the eye ends on 'hole' (375, 184), the push point. SFX-020 at 32.93."]),
 (13, 16, "VIS-015", "TXT-010", "MOT-002", "TRN-006", L + ", LOK-014", "TEX-009", "", "MUS-012",
  "Calm. Director D1_shutter_room: TRN-006 push from the word 'hole' into the room (same place as A0 and act 3): depth 2000, dark 0.85 ('he darkens his room'), fog 0.15, dolly 0.02. Tag " + TAG + " at top-left (120, 84) from 33.70, held through D2 (no place shown: where he did it is not known). The light path builds left to right. Texture: ground (TEX-009 plaster, faint, inside wall and floor planes only; beam, prism, band crisp). SFX-022 projector ambience J-cut from 32.70, 26-30 dB under, through D2.",
  ["Push lands; the hole [-1050,-150,600] r 16 lit at (281, 373); wooden-shutter knock (SFX-028, 0.14 s) on the cut 33.06; the beam draws hole -> prism point on 'beam' (34.71, 0.9 s); tag on 33.70.",
   "Prism (size 160) at [-600,-60,950] (638, 438) on 'prism' (37.77); glass clink SFX-028 on its settle 38.95 (pause).",
   "The fan's cone from the prism draws on 'bends' (40.29) (builder: coneAtSec).",
   "The band lands on the far wall on 'band' (43.25): x 1013-1191, y 456, 5:1, red at the right (the end nearest the beam's straight line: red bends least). Every prism is drawn point-down, as both of Newton's are in Fig. 18 (builder: prism apex; a prism bends light towards its base). Hard cut at 44.90 (pause after 'appears.')."]),
 (17, 23, "VIS-015", "TXT-010", "MOT-002, MOT-013", "TRN-001", L, "TEX-009", "", "MUS-012",
  "Calm. Director D2_far_wall: hard cut, same scene, the far wall close (depth 400, dark 0.85, fog 0, dolly 0.02): the band is there on the cut, x 533-1267, y 397-543 (733x147 px, 5:1), fan x0 -582 (violet, left), x1 418 (red, right): the same orientation as D1 across the hard cut (fact-check FIX 2, Expert MUST 2). Tag held from D1. Phase 1 colours, phase 2 shape (the layout change at 52.20). Texture: ground (TEX-009 plaster on the wall plane); band, rings and labels flat and crisp.",
  ["Labels (mono caps 22, y 573): RED at x 1230 on 'Red' (45.44); VIOLET at x 570 on 'violet' (46.62).",
   "EVERYTHING IN BETWEEN centred x 900 on 'everything' (48.00).",
   "Nothing new; labels un-wipe at 51.74.",
   "The band dims to 0.45 on 'shape' (52.20) so its outline reads (builder: dimSec).",
   "Dashed ring at (607, 470) r 73 on 'round' (55.26), label ROUND, LIKE THE HOLE under it at 55.66 (the round spot he expected the hole to give; fact-check FIX 3).",
   "Nothing new on 'long' (58.06): the dimmed band and the one ring hold.",
   "Four more dashed rings step along the band at x 753, 900, 1047, 1193 on 'five' (58.92, 0.15 s apart); label × 5 at (1332, 470) at 59.60. Labels un-wipe 60.40, tag 60.30; SFX-022 fades 60.3-60.7; SFX-024 at 60.70."]),
 (24, 25, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-007", D, "", "SRC-058", "MUS-012",
  "Calm. TRN-007 slide out of the drawing into his words: SRC-058 p.3076 again, side right, crop [40, 120, 1480, 1411]; source tag ... · P. 3076; quote column 'which, according to the received laws of Refraction, I expected should have been circular' from 63.73. Ground placement.",
  ["Slide lands; H1 'an oblong form; which, according to the received laws of Refra-' at 61.30 (eye on 'oblong', 1050, 377).",
   "H2 'ction, I expected should have been circular.' on 'says' (63.73), holding 2.4 s, and the quote column."]),
 (26, 30, "VIS-007", "TXT-010, TXT-024", "MOT-002", "TRN-011", L, "", "", "MUS-012",
  "Calm. Director F_common_view: TRN-011 band (down, dark) at 66.17 (SFX-024 66.07); KeywordPanel on warm graphite, 64 px chips, spoken words only; the rows start at x 560 (within 25% of E's last highlight). The dim at 77.94 is the layout change of this 14.2 s shot. Ground placement, no texture (words only). [Visual: the panel is TXT-024 on the theme ground; VIS-007 is not used: see note]",
  ["Band wipe; the graphite panel ground.",
   "Chip 'something simple' (560, 250) on 'simple' (69.17).",
   "Chip 'white light' (560, 390) on 71.20; 'is pure' accent (960, 390) on 72.00; 'the prism' (560, 530) on 73.66.",
   "Chip 'changes it' (900, 530) on 73.90; 'makes the colours' (560, 670) on 75.68.",
   "Chip 'Newton' (560, 830) on 77.70; the six chips above dim to 0.35 on 'suspects' (77.94); 'the other way round' accent (800, 830) on 78.80. SFX-024 at 80.22."]),
 (31, 33, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-007", D, "", "SRC-058", "MUS-012",
  "Calm. TRN-007 slide into a document: SRC-058 p.3078, side right, crop [55, 968, 1460, 1383]; source tag ... · P. 3078; quote 'Experimentum Crucis' (italic) from 85.13 so the print and its English arrive together. Ground placement.",
  ["Slide lands on the page.",
   "H1 'Experimentum Crucis,' on 'Experimentum' (83.25); the eye ends at (1074, 546).",
   "Quote column 'Experimentum Crucis' on 'crucial' (85.13)."]),
 (34, 35, "VIS-005", "TXT-010", "MOT-001, MOT-003", "TRN-017", L, "", "SRC-059", "MUS-012",
  "Calm. Director H_fig18: TRN-017 lens settle (0.7 s, blur 14) to a real picture: SpotlightIsolator on SRC-059 Opticks Plate IV, crop [0, 380, 2423, 1363], target Fig. 18 [450, 770, 1720, 610] -> screen x 357-1719, y 309-792. Label NEWTON'S DIAGRAM · OPTICKS, 1704 (an engraving of his figure, published later; fact-check FIX 5). Never flipped, though his light runs right to left. Texture: object (the plate keeps its own paper and ink).",
  ["Lens settle; focus-set sound SFX-019 on the settle 86.85 (pause); brackets lock on 'He lets' (87.45); label below the target 0.4 s later.",
   "Nothing new: Fig. 18 holds on 'board with a small hole'. SFX-024 at 91.22 for the match from Fig. 18's hole g (740, 594)."]),
 (36, 38, "VIS-015", "TXT-010", "MOT-002", "TRN-015", L, "TEX-009", "", "MUS-012",
  "Calm. Director I1_board_room: TRN-015 focus match [740, 594]: his drawn hole becomes the room's hole. Room wide (depth 2000, dark 0.85, fog 0, dolly 0.02), tag " + TAG + " from 92.00, held through I2. On the cut: shutter, hole, beam, prism 1 (as D1) and a board (builder: board object) at z 1200, centre [-450,120,1200], w 600; the band from prism 1 falls on the board where D1's light reaches it, x0 -422 (violet), x1 -303 (red), y -55, h 40 (red on the same side as D1); hole [-398,-55,1200] at (770, 444) on its blue; prism 2 at [-34,-46,1650] (946, 452), on one line with prism 1 and the hole, so the blue beam does not kink at the hole (Expert MUST 3). One board where Newton used two (the script's simplification; Fig. 18 showed both). SFX-022 J-cut from 91.00 through I2. Texture: ground (TEX-009 plaster in the wall planes); board a flat panel.",
  ["Match lands on the board's hole; a blue beam draws from the hole towards prism 2 on 'gets through' (92.65).",
   "Label BLUE (910, 530) on 'blue' (94.45).",
   "Prism 2 (size 160, point-down) at [-34,-46,1650] (946, 452) on 'second' (97.50); glass clink SFX-028 on its settle 98.35 (pause). Hard cut at 98.73."]),
 (39, 43, "VIS-015", "TXT-010", "MOT-002, MOT-013", "TRN-001", L, "TEX-009", "", "MUS-012, MUS-010",
  "Calm. Director I2_second_prism: hard cut, same scene, the camera nearer the board (every z - 800: depth 1200): prism 1, board and hole [-398,-55,400], prism 2 at [-34,-46,850] (941, 444), blue beam hole -> prism 2 in one straight line. The ghost is labelled as the prediction, never shown as a result. 'It doesn't.' (104.93) changes the layout. Music break MUS-010 in the pause 103.6-104.77 (Thinking Music cut, no hit: SFX-025 is at 3 of 3). Texture: ground (TEX-009 plaster); ghost, beams and labels crisp.",
  ["Caption IF THE GLASS MAKES THE COLOURS at (1295, 298) on 'glass' (99.64).",
   "Ghost fan (builder: dashed outline, faint spectral fill 0.18) from prism 2 to the wall, centred on where the blue really lands (x0 169, x1 569, y -339) so on 'It doesn't.' only the real result is left, on 'blue' (102.42); the music breaks in the pause after 'something else.' (103.6).",
   "On 'doesn't' (104.93) the ghost fades (0.4 s) and its caption un-wipes (from 104.73): the act's peak, dry. The blue bends: beam prism 2 -> [249,-339,1200] (1079, 308), about 47°, on 'bends' (106.77); blue patch there 107.10 (Expert MUST 4).",
   "Label ITS OWN FIXED AMOUNT under prism 2 (941, 530) on 'fixed' (108.41).",
   "The band on the board slides so red sits on the hole on 'other' (110.62) while prism 1 turns about 4° (Newton turned it by hand) (builder: fan shift, 0.5 s); red beam hole -> prism 2 -> [249,-234,1200] (1079, 358), about 35°: the same way as blue, bent less, 110.78-111.30. Labels un-wipe 111.70; SFX-022 fades 111.7-112.1; SFX-024 at 112.10."]),
 (44, 46, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-007", D, "", "SRC-058", "MUS-012",
  "Calm. TRN-007 slide into his words: SRC-058 p.3082, side right, crop [40, 60, 1480, 1411]; source tag ... · P. 3082; quote 'it hath afterwards obstinately retained its colour, notwithstanding my utmost endeavours to change it.' from 115.01 (near-silent music under it). Ground placement.",
  ["Slide lands; H1 'parted from those of other kinds,' on 'separated' (113.49).",
   "H2 'obstinately retained its colour,' on 'obstinately' (115.01) and the quote column; music near-silent.",
   "H3 'notwithstanding my utmost endeavours to change it.' on 'whatever' (117.16), holding 2.0 s. SFX-024 at 119.10 under the colour block."]),
 (47, 51, "VIS-015, VIS-021", "TXT-010, TXT-024", "MOT-002, MOT-013", "TRN-012", L, "TEX-009", "", "MUS-013, MUS-008",
  "Calm. Director L_sorting_room: the act's turn. TRN-012 colour block in the beam's white #FFF6DD, from the left (where the light comes from), reveals the room wide (as D1: depth 2000, dark 0.85, fog 0) with the whole path lit. Tag " + TAG + " on 119.90. Chips (TXT-024 overlay, the chip layer's own strike) in the dark ceiling band, > 120 px above the light path. Coloured streaks are our picture of Newton's 'kinds of ray' (tagged illustration; act 5 says the rays are not themselves coloured). Cue 3 (Long Note Two) enters with the block. Texture: ground (TEX-009 plaster); dots, chips, lines crisp.",
  ["Colour block reveals the lit room; chip 'making' (1000, 140) on 'making' (120.85), struck at 121.41.",
   "Chip 'sorting' accent (1340, 140) on 'sorting' (122.43).",
   "On 'Every' (124.15) the white beam dims to 0.3 and RayParticles run hole -> prism as short streaks, 12 of the six spectral colours, mixed (jitter 6); label KINDS OF RAY above them at (460, 330) on 124.15 (Expert SHOULD).",
   "Label MIXED TOGETHER (460, 560) on 'mixed' (127.21), 155 px below the dots; un-wipes 129.40.",
   "On 'spreads' (130.12) six rays run prism -> their own place on the band, red at the right end (4 streaks each, 36 in all); chips leave at 130.80. Hard cut at 131.63."]),
 (52, 55, "VIS-015, VIS-021", "TXT-010", "MOT-002, MOT-013", "TRN-001", L, "TEX-009", "", "MUS-013",
  "Calm. Director M_lens: hard cut, same scene, nearer prism 1 and turned to a clear patch of wall (depth 1400, dark 0.85, fog 0): beam from [-1850,-120,-250] into the point-down prism (253, 423), the band on the back wall violet 400 / red 900 (x 1136-1356, y 461), the same order as D1 (Expert SHOULD). Tag held from L. Texture: ground (TEX-009 plaster); lens outline, rays and labels crisp.",
  ["Cut lands on the prism and its band ('He checks it the other way too').",
   "Lens (builder: vertical biconvex outline in the prism's ink, 290 px tall) rises into the cone at (844, 447) on 'gathers' (134.74); the wall band leaves (135.20) and the colours land on the lens plane (-309..-82, y -51); on 'rays' (135.64) six coloured rays run from the lens to one point (1224, 461), 5 dots each.",
   "Label LENS under the lens (844, 640) on 'lens' (136.91).",
   "The dots meet on 'meet' (138.65); a white patch blooms there on 'white' (139.57); label WHITE AGAIN (1224, 560) at 139.81. Labels and tag un-wipe 140.30; ink line SFX-017 under the drafting stroke 140.75."]),
 (56, 57, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-002", L + ", LOK-028", "", "SRC-058", "MUS-013",
  "Calm. TRN-002 drafting wipe (angle 8, dir left, J-cut) from the diagram into the document; SRC-058 p.3083, side right, crop [40, 400, 1480, 1411]; source tag ... · P. 3083; ground = LOK-028 blur of the same page (keeps the paper desk under 35%); quote 'reproduced light, intirely and perfectly white' from 143.02 (near-silent music).",
  ["Wipe lands; H1 'all the Colours of the Prisme being made to converge,' on 'In his words' (141.26).",
   "H2 'reproduced light, intirely and perfectly white,' (printed spelling) on 'entirely' (143.02), holding 2.7 s, and the quote column."]),
 (58, 60, "VIS-016", "TXT-010, TXT-011", "MOT-001", "TRN-017", L, "", "SRC-062", "MUS-013",
  "Calm. Director O_glass_today: TRN-017 lens settle to a real photo: FootagePlate image SRC-062 (sunlight through a glass of water, today), crop [0, 200, 2560, 1440], push 0.02 the one move; the eye lands on the inner arc's upper limb (963, 240). Never said to be Newton's. Texture none (TODAY photo, nothing laid on it).",
  ["Settle; shutter click SFX-003 on the settle frame 146.20 (pause); tag part 1 PHOTO TODAY (bottom-left, 120, 980) on 'rainbow' (147.04).",
   "Tag part 2 · SUNLIGHT THROUGH A GLASS OF WATER · R. & S. HOLLOS, EXSTROM LABORATORIES · CC BY 4.0 on 'glass' (149.62).",
   "Chip 'the first half' at (1300, 120), in the plain wood between the arcs and the glass, on 'first half' (152.10); the tag un-wipes 153.60. SFX-024 at 154.02."]),
 (61, 65, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-007", D, "TEX-008", "SRC-058", "MUS-013",
  "Calm. TRN-007 slide into the letter: SRC-058 p.3081, side right, crop [40, 700, 1480, 1411]; source tag ... · P. 3081; quote column 'Colours are not Qualifications of Light, derived from Refractions, or Reflections of natural Bodies' from 156.92 (near-silent music under the whole quote); TEX-008 'shadow' 0.2 off the highlighted lines (2 of 3). Ground placement.",
  ["Slide lands on the page ('In his letter, he puts it like this').",
   "H1 'Colours are not Qualifications of Light,' on 'Colours' (156.92) with the quote column.",
   "Nothing new: H1 holds while it is read.",
   "H2 'derived from' on 'derived' (160.79); H3 'Refractions, or Reflections of natural Bodies' on 'Refractions' (161.51).",
   "Nothing new: H3 holds 3.4 s. SFX-024 at 164.78."]),
 (66, 70, "VIS-007", "TXT-010, TXT-024", "MOT-002", "TRN-011", L + ", LOK-028", "", "SRC-058", "MUS-013",
  "Calm. Director Q_plain_version: TRN-011 band (down, dark) at 164.88; KeywordPanel on LOK-028 blur of SRC-058 p.3081 (the page just read, soft, brightness 0.38), label NEWTON'S LETTER · 1672 · P. 3081 (right-aligned, 1800, 980, size 22) at 165.50; chips on the right half, spoken words only; strikes are the chip layer's own (TXT-024). Ground placement. [Visual: the panel is TXT-024; VIS-007 is not used: see note]",
  ["Band wipe; the blurred page and its label (165.50); chip 'glass' (900, 300) on 'glass' (167.30), then 'doesn't create colour' (1080, 300).",
   "Chip 'doesn't create colour' struck on 'colour' (168.20): the verb is struck, not the glass (Expert SHOULD).",
   "Chip 'light bouncing off things' (900, 440) on 'Light' (169.92); 'creates it' beside it, struck at 171.30 (the second and last strike).",
   "Chip 'each kind of ray' (900, 600) on 'Each' (172.73); 'fixed' accent (1430, 600) on 'fixed' (174.17).",
   "Chip 'which colour you'll see' (900, 760) on 'which' (176.33). SFX-024 at 177.80."]),
 (71, 74, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-007", D, "TEX-008", "SRC-058", "MUS-014, MUS-008",
  "Calm. TRN-007 slide; cue 4 (At Rest) enters with it in the pause before 'He sends all this' (177.90). SRC-058 p.3075 again, side left, crop [0, 40, 1554, 1930] (card 695 wide); source tag ... · P. 3075; no quote column; TEX-008 'shadow' 0.2 (3 of 3). Ground placement.",
  ["Slide lands; H1 'from Cambridge, Febr. 6. 1671/72' on 'Cambridge' (180.07).",
   "Note CAMBRIDGE · FEB 1672 on 'February' (181.11).",
   "H2 'PHILOSOPHICAL TRANSACTIONS.' (the masthead) on 'Philosophical' (184.75).",
   "H3 'to be communicated to the R. Society' (box [410,1901,795,64], the crop to [0,40,1554,1930]) on 'Royal Society' (187.28), holding 2.1 s. SFX-024 at 189.28."]),
 (75, 78, "VIS-060", "TXT-010, TXT-024", "MOT-002, MOT-013", "TRN-011", L + ", LOK-028", "", "SRC-060", "MUS-014",
  "Calm. Director S1_hooke: TRN-011 band (up, dark: the story lifts from the letter to its readers); KeywordPanel with an overlay sticker, ground LOK-028 blur of SRC-060 (the Micrographia title page). No confirmed portrait of Hooke survives (a candidate Mary Beale portrait is not accepted), so his 1665 book stands for him, and the tag says so. Texture: object (the title page's own printed surface, on its own blur).",
  ["Band wipe; chip 'plenty of readers' (120, 640) on 'readers' (190.59).",
   "Chip 'not all of them' accent (120, 760) on 'not' (192.00); the Micrographia title page (sticker, w 420, white edge 6 px, tilt 2°) rises on 'Robert' (194.04) to (1380, 520); soft pop SFX-026 on its settle 194.64 (pause).",
   "Tag line 1 ROBERT HOOKE · MICROGRAPHIA, LONDON, 1665 with the landing; line 2 NO CONFIRMED PORTRAIT OF HOOKE SURVIVES on 'scientist' (195.62).",
   "Chip 'says so' accent (120, 880) on 'says so' (198.50); the tag un-wipes 199.10. SFX-024 at 199.72."]),
 (79, 80, "VIS-001", "TXT-009, TXT-010", "MOT-001, MOT-003", "TRN-007", D, "", "SRC-061", "MUS-014",
  "Calm. TRN-007 slide between two documents (Hooke's book -> Newton's printed reply): SRC-061 p.5084, side left, crop [30, 60, 1420, 1354]; source tag ISAAC NEWTON · ANSWER TO HOOKE'S CONSIDERATIONS · PHIL. TRANS. NO. 88, 1672 · P. 5084; quote 'Answer to some Considerations upon his Doctrine of Light and Colors' from 200.61. Ground placement.",
  ["Slide lands; H1 'Answer to some Considerations' on 'arguments' (200.61) with the quote column.",
   "Note ABOUT 6 YEARS on 'six' (203.95); the eye ends on 'Light and Colors' (423, 222), the match point. SFX-024 at 205.34."]),
 (81, 84, "VIS-015", "TXT-010", "MOT-002", "TRN-015", L, "TEX-009", "", "MUS-014",
  "Calm. Director T_where_is_it: TRN-015 focus match [423, 222]: 'Light' in his title to the hole of light (281, 373). The room wide (as D1: depth 2000, dark 0.85, fog 0), the full path lit on the cut: the act ends where it started, now explained. The prism dims instead of lifting out (without the prism the band would vanish); its outline stays at 0.3 or more and the bend is unchanged. Texture: ground (TEX-009 plaster, fading with the lines).",
  ["Match lands; tag " + TAG + " on 'Newton' (206.83); dolly 0.02, the one move.",
   "On 'out' (209.69) the prism dims to an empty outline (0.3): the glass is just glass; beam and band stay bright.",
   "On 'where' (212.06) the room's lines fade to 40% (builder: lineFadeSec), leaving only the light path.",
   "Hold; At Rest alone from 212.9 to the act end 215.70 (3 s after 'it?'). Act 5 decides its own way in."]),
]
VIS = {**{k: "TXT-024" for k in range(26, 31)}, **{k: "TXT-024" for k in range(66, 71)}}  # panels: chips on a ground (no VIS)
VIS.update({47: "VIS-015", 48: "VIS-015", 52: "VIS-015", 75: "VIS-060", 76: "VIS-060", 77: "VIS-060", 78: "VIS-060"})
SFX = {1: "SFX-024", 2: "SFX-026", 4: "SFX-024", 9: "SFX-020", 12: "SFX-020", 13: "SFX-028, SFX-022", 14: "SFX-028, SFX-022",
       **{k: "SFX-022" for k in (15, 16, 17, 18, 19, 20, 21, 22)}, 23: "SFX-022, SFX-024", 30: "SFX-024", 33: "",
       34: "SFX-019", 35: "SFX-024", 36: "SFX-022", 37: "SFX-022", 38: "SFX-028, SFX-022", **{k: "SFX-022" for k in (39, 40, 41, 42)},
       43: "SFX-022, SFX-024", 46: "SFX-024", 55: "SFX-017", 58: "SFX-003", 60: "SFX-024", 65: "SFX-024", 70: "SFX-024",
       74: "SFX-024", 76: "SFX-026", 78: "SFX-024", 80: "SFX-024", 25: "SFX-024"}
SFX[25] = "SFX-024"  # F's band at 66.07 sits in beat 25
TXT = {7: "TXT-009, TXT-010", 72: "TXT-009, TXT-010, TXT-011", 60: "TXT-010, TXT-024"}
NEW = {
 1: "Yes: PerspectiveGrid builder additions (dollyFrom; a title over the room); MUS-008 cue sheet act4_cues_v1.json (tracks Sam heard in act 3)",
 2: "Yes: TimelineRail builder additions (yearLabels, accentAtSec, bracket); VIS-055 first use",
 5: "Yes: SRC-058 Newton 1672 letter, Phil. Trans. No. 80 (new, Planned; six pages)",
 13: "Decision for Sam: VIS-015 limit raise 8 -> 37 beats (8% of runtime kept); TEX-009 Texturelabs kit (new, Planned); PerspectiveGrid builder additions (coneAtSec, untilSec/dimSec on objects); SFX-028 shutter knock and glass clink",
 17: "Yes: PerspectiveGrid builder addition (dashed rings with stagger)",
 34: "Yes: SRC-059 Opticks 1704 Plate IV, Fig. 18 (new, Planned); VIS-005 first use",
 36: "Yes: PerspectiveGrid builder addition (board object with a hole; fan clipped to the board)",
 39: "Yes: PerspectiveGrid builder additions (ghost fan; fan shift); MUS-010 break",
 47: "Yes: chips over a PerspectiveGrid beat (overlay check)",
 52: "Yes: PerspectiveGrid builder addition (lens object and the fan on the lens plane)",
 58: "Yes: SRC-062 glass-of-water rainbow, Hollos / Exstrom, CC BY 4.0 (new, Planned); FootagePlate two-part tag",
 75: "Yes: SRC-060 Micrographia 1665 title page (new, Planned)",
 79: "Yes: SRC-061 Newton's 1672 Answer, p.5084 (new, Planned)",
 81: "Yes: PerspectiveGrid builder addition (lineFadeSec)",
}

def pacing(d):
    return "Too Fast (<2s)" if d < 2.0 - 1e-6 else ("Too Slow (>3.5s)" if d > 3.5 + 1e-6 else "OK")

rows, covered = [], []
for a, b, vis, txt, mot, trn, look, tex, src, mus, shot, notes in S:
    assert len(notes) == b - a + 1, (a, b, len(notes))
    for k in range(a, b + 1):
        beat, st, en, line = C[k - 1]
        first = k == a
        d = round(en - st, 2)
        note = (shot + " " if first else "") + notes[k - a]
        note = re.sub(r" \[Visual: .*?\]", "", note)
        mus_k = mus if first else mus.replace(", MUS-008", "")
        if "MUS-010" in mus_k and k not in (40, 41): mus_k = mus_k.replace(", MUS-010", "")
        rows.append([beat, 4, f"{st:.2f}", f"{en:.2f}", f"{d:.2f}", str(round(d * 30)), pacing(d), spoken(line),
                     VIS.get(k, vis), TXT.get(k, txt), mot if first or "MOT-013" in mot else mot, trn if first else "TRN-001", look,
                     SFX.get(k, ""), mus_k, tex, "", "", src, "", NEW.get(k, ""), note])
        covered.append(k)
assert covered == list(range(1, len(C) + 1)), "every beat once"
for i in range(1, len(rows)):
    assert rows[i][2] == rows[i - 1][3], ("gap or overlap", rows[i][0])
json.dump(rows, open("act4_rows.json", "w"), indent=1, ensure_ascii=False)
print(len(rows), "rows;", sum(r[6] != "OK" for r in rows), "pacing flags")
