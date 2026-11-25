"""WCL-E01 act 5 'The rays': Gate 1 beat sheet rows (Beat_Sheet rows 270-333) from act5_cuts.json.
Shots follow the Director's brief (director/ep01-act05_brief.md: 17 shots, its transition review and its limits), the cue
sheet (act5_cues_v1.json) and Claude's plan (director/ep01-act05_plan.md). Each shot's IDs and note are set once; every
beat gets its own note line. Row = [Beat, Act, Start, End, (E-G: the sheet's formulas), Spoken, I Visual .. V Notes]."""
import json, re
C = json.load(open("act5_cuts.json"))

def spoken(t):
    for a, b in [("30 years", "thirty years"), ("in 1704,", "in seventeen oh-four,"), ("called Optics,", "called Opticks."),
                 ("Optics", "Opticks"), ("page 90,", "page ninety,"), ("For the rays", '"For the rays'),
                 ("coloured. In plain", 'coloured." In plain'), ("is a certain", 'is "a certain'),
                 ("that colour.", 'that colour".'), ("he's pretty", 'he\'s "pretty'), ("and colours. And", 'and colours". And'),
                 ("answer for that too.", "answer for that, too."), ("the light, each", "the light. Each")]:
        t = t.replace(a, b)
    return t

G = "LOK-009, LOK-010"                       # warm graphite
D = "LOK-009, LOK-010, LOK-027"              # page cards on the dark paper desk
B = "LOK-009, LOK-010, LOK-028"              # blur plate of a page
I = "LOK-009, LOK-010, LOK-029"              # act 5 inset ground
CARD = "MOT-001, MOT-003"
DIAG = "MOT-002, MOT-013"

# (first, last, visual, text, motion, transition-in, look, texture, source, shot note, per-beat notes)
S = [
 (1, 1, "VIS-014", "TXT-009", "MOT-002", "TRN-015", I, "", "",
  "Calm. Director A0_band_title: TRN-015 focus match [960, 518] from a still of act 4's last frame (Builder 1; no VIS-015 rendered): the wall's band (1103, 456) becomes a flat SpectrumStrip on the act 5 inset ground (LOK-029), x 210-1710, y 470-566, violet left as act 4, ticks off, feathered (Builder 2). Texture: ground (inset dust and glow).",
  ["Title 5 · THE RAYS (Fraunces 600, 76 px) rises 0.75-1.45 above the band's left end (x 210, y 400). Wholesome alone (cue 1, -26). SFX-001 at 0.02; SFX-006 at 2.30 for the slide."]),
 (2, 3, "VIS-001", "TXT-009, TXT-010", CARD, "TRN-007", D, "", "SRC-064",
  "Calm. A_opticks_title: TRN-007 slide; ArchivalScanCard on SRC-064 (Opticks 1704 title page), side left, crop [110, 120, 1400, 2010] (owner's inscription cropped out); title column 'Opticks: or, a Treatise of the Reflexions, Refractions, Inflexions and Colours of Light' from 6.98; source tag ISAAC NEWTON · OPTICKS · LONDON, 1704. Ground placement; scan untouched.",
  ["Note 1672 → 1704 · 32 YEARS on 'thirty' (3.16); H1 'MDCCIV' on 'seventeen oh-four' (4.60).",
   "H2 'LONDON,' on 'London' (5.90); H3 'OPTICKS:' on 'publishes' (6.98), held 2 s. SFX-006 at 8.92 for the glide."]),
 (4, 8, "VIS-001", "TXT-009, TXT-010", CARD, "TRN-004", D, "TEX-008", "SRC-005",
  "Calm. Director B_p90_not_coloured: TRN-004 canvas glide (dir right, pull 0.86), the same book, a later page. ArchivalScanCard on SRC-005 p.90, side left, crop [240, 370, 1280, 1221]; source tag ISAAC NEWTON · OPTICKS · 1704 · P. 90. Texture: ground (dark desk); TEX-008 strokes 'shadow' 0.2 off the kept line (1 of 3).",
  ["Glide lands; note P. 90 on 'ninety' (10.10).",
   "Callout on 'sentence' (13.50): the page dims to 0.55 and one line stays bright (Builder 6 keep): the sentence that is easy to read past.",
   "H1a 'For the rays to speak properly' on 'For' (16.19); H1b 'are not coloured.' on 'are' (17.65); quote column from 16.19. Music -62 16.04-18.98.",
   "Note IN PLAIN WORDS on 'plain' (19.79).",
   "Note THE RAYS HAVE NO COLOUR (accent) on 'rays' (22.05). SFX-021 cloth_slide at 23.66 for the band."]),
 (9, 11, "TXT-025", "TXT-025, TXT-010", "MOT-002", "TRN-011", B, "", "SRC-005",
  "Calm. C_power_quote: TRN-011 band (down, dark); quote chips (TXT-025, 52 px, words as spoken, long s as s) on a LOK-028 blur of SRC-005 p.90 (brightness 0.38): the page just read, soft. Source chip ISAAC NEWTON · OPTICKS · 1704 · P. 90 at (860, 730) on 'All' (24.39). Ground placement; chips crisp; running head off. Music -62 26.54-31.76.",
  ["Band lands; the source chip on 'All' (24.39).",
   "Line 1 'a certain power' from 26.69; line 2 'and disposition' from 27.79; line 3 begins 'to stir up a' from 28.63.",
   "Line 3 ends 'sensation' (29.57); line 4 'of this or that Colour' 30.01-31.25 (capital C as printed). SFX-021 air_woosh at 32.08 for the slide."]),
 (12, 15, "VIS-021, VIS-060", "TXT-024, TXT-010", DIAG, "TRN-007", I, "", "SRC-013",
  "Calm. Director D_sunlight: TRN-007 slide out of the document (Thinking Music enters). Act 5 inset ground (LOK-029). Rays drawn white on purpose (Builder 5 overlay rays, three sizes and speeds, never hue): tag ILLUSTRATION · RAYS DRAWN WITHOUT COLOUR from 37.60. Geranium = SRC-013 sticker (VIS-060), tag PHOTO TODAY · D. J. STANG, CC BY-SA 4.0 · CUT OUT. Texture: object (the geranium cut-out the one hero); dots, chips and labels crisp.",
  ["Chip 'clashes with the prism' (940, 560) on 'clashes' (33.99).",
   "Chip 'It doesn't.' accent (940, 680) on 'doesn't' (36.10), the first chip dims; panel un-wipes by 37.00.",
   "White sunlight dots from the upper left on 'sunlight' (37.41); label MANY KINDS OF RAY on 'kinds' (38.89); the geranium pops in (680, 560), w 460, at 39.75; SFX-026 pop on its settle 40.33.",
   "Outgoing dots, still white but a different mix (counts 5 / 2 / 5: fewer of the middle kind; fact-check FIX 15, Expert S1), from the flower towards the right edge on 'coming off' (40.78); label ISN'T PINK on 'pink' (41.82). SFX-001 at 43.11 for the glide."]),
 (16, 18, "VIS-019, VIS-021", "TXT-010", DIAG, "TRN-004", G, "", "",
  "Calm. Director E_whoever_looks: TRN-004 canvas glide (dir right) following the light. EyeDiagram plate (act 3's card, eye centre (1220, 545)), caption THE EYE · SIMPLIFIED, tag ILLUSTRATION; the same white dots (ink edge) travel to the retina (x 1478) from 42.60. Texture: object (the plate); dots and labels crisp.",
  ["Label A KIND OF PUSH (160, 380) on 'kind' (44.90).",
   "Caption 'Retina' on 'pink' (46.48).",
   "Caption 'seen as pink' with a #E79AB9 swatch (Builder 7) at (1180, 905), leader to the optic nerve where it leaves the back of the globe (anchor [1595, 632]), not the retina, so the pink belongs to the looker (fact-check FIX 18, Expert S2), on 'reaches' (48.26); labels un-wipe 49.90. SFX-021 cloth_slide at 50.17 for the band."]),
 (19, 24, "TXT-024", "TXT-024, TXT-010", "MOT-002", "TRN-011", B, "", "SRC-064",
  "Calm. F_newtons_view: TRN-011 band (up, dark); keyword panel on a LOK-028 blur of SRC-064 (the Opticks title page standing for Newton: no portrait left). Label ISAAC NEWTON · OPTICKS, 1704 right-aligned (1800, 980) on 'Newton's' (51.54). Chips 64 px from x 480, spoken words only. Ground placement; chips crisp.",
  ["Band lands; label on 'Newton's' (51.54).",
   "Chip 'isn't really in the flower' (480, 250) on 52.80.",
   "Chip 'isn't in the light either' (480, 380) on 55.47.",
   "Chip 'where the light meets a person' accent (480, 520) on 'where' (58.58).",
   "Layout change on 'But' (61.46): the three dim to 0.3; chip 'a geranium and a leaf' (480, 700) on 61.84.",
   "Chip 'still look different' (480, 830) on 62.82. SFX-006 at 64.40 for the lens."]),
 (25, 28, "VIS-001", "TXT-009, TXT-010", CARD, "TRN-017", D, "TEX-008", "SRC-058",
  "Calm. G_p3084_reflect: TRN-017 lens settle (0.7 s, blur 14) to a real page. ArchivalScanCard on SRC-058 p.3084 (new page file), side left, crop [40, 1070, 1480, 1411], ¶13 in the middle; source tag ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672 · P. 3084. Desk; TEX-008 'shadow' 0.2 off H1/H2 (2 of 3).",
  ["Lens lands on the page.",
   "Note CAMBRIDGE · FEB 1672 on 'Cambridge' (68.21).",
   "H1 'the Colours of all natural Bodies' + 'have no other origin than this,' on 'things' (69.31); H2 'that they are variously qualified to' + 'reflect one sort of light in greater plenty then another.' (full stop as printed; fact-check FIX 22) on 'sending' (70.53).",
   "Quote column 'variously qualified to reflect one sort of light in greater plenty then another' ('then' as printed) on 71.45. MUS-011 filter sweep 73.30-74.10 for the slide."]),
 (29, 32, "VIS-014, VIS-060", "TXT-024, TXT-010", DIAG, "TRN-007", G, "", "SRC-013, SRC-014",
  "Calm. Director H_choosing: TRN-007 slide out of the document. SpectrumStrip rows (Builder 3) on warm graphite, red on the left from here on: DAYLIGHT strip on top (x 330-1590, y 150-196); the geranium sticker (560, 430) w 400 on the cut; a strip under each thing of what it sends back (shapes illustrative). Tag ILLUSTRATION · SIMPLIFIED, NOT MEASURED from 74.44; sticker tags PHOTO TODAY · D. J. STANG, CC BY-SA 4.0 · CUT OUT and PHOTO TODAY · RUNIC EARTH. Texture: ensemble (two cut-outs, one badge shape); strips and chips flat.",
  ["Geranium's strip (x 330-790, y 680-726) draws on 'sends' (74.44): strong at the red end, low through green, some again at blue-violet; SENT BACK under it.",
   "The laurel leaf (SRC-014) pops in (1360, 430), w 250, at 75.75; SFX-026 on its settle 76.35; leaf's strip (x 1130-1590) on 'sends' (76.92): a green hump; SENT BACK under it.",
   "Chip 'painting the light' (330, 820) on 'painting' (79.37).",
   "Ink strike through 'painting the light' on 'each' (80.67); chip 'choosing from it' accent (1060, 820) on 'choosing' (81.31). SFX-020 at 82.65 for the push."]),
 (33, 37, "VIS-059, VIS-060, VIS-014", "TXT-010", "MOT-002", "TRN-006", G, "", "SRC-040, SRC-011, SRC-013",
  "Calm. Director I_by_candle: TRN-006 push from H's geranium [560, 430]. LayerStage (the approved geranium set-up): world 1 SRC-040 sky, label TODAY · DAYLIGHT, why 'the same flower in the daylight the line compares the candle with'; world 2 SRC-011 candle from 85.70 (TRN-018 world swap, dissolve 1.4 s), label TODAY · CANDLELIGHT, why 'Dalton's evening light, which has far less blue'. The geranium steps aside to (1290, 430) on the swap so the flame shows. Strips in the overlay (Builder 3), top-left x 140-700, red on the left; tag ILLUSTRATION · NOT MEASURED from 86.74. Camera pan -60, push 0.03. Texture: object (the cut-out); the footage gets nothing (rule 25).",
  ["Push lands on the geranium in daylight; DAYLIGHT strip (y 140-184), flat, on 'also' (83.57).",
   "World swap to the candle on 'Candlelight' (85.70); the flower moves aside 85.75-87.05.",
   "CANDLELIGHT strip (y 260-304) on 'yellower' (86.74): a ~1,900 K flame drawn in linear light, profile [[400,0.01],[450,0.025],[500,0.07],[550,0.17],[600,0.36],[650,0.63],[700,1]] (blue about 1/40 of red; fact-check FIX 29, Expert S3); bracket and FAR LESS BLUE on 'less' (88.40).",
   "THE GERANIUM'S MIX, BY CANDLE strip (y 400-444) on 'geranium' (91.53): the petal's sent-back profile from H multiplied by the candle profile: red strong, blue nearly gone.",
   "Its label on 'mix' (92.63). SFX-001 at 94.58 for the morph."]),
 (38, 40, "VIS-017", "TXT-010", "MOT-002", "TRN-009", G, "", "",
  "Calm. Director J_most_people: TRN-009 shape morph from I's bottom strip [140, 400, 560, 44] to the MOST PEOPLE / BY CANDLE swatch [1202, 374, 250, 150] (0.75 s, hold 1.0). SwatchRows (act 1's hexes) on warm graphite; columns BY DAY / BY CANDLE. Pure data: no texture. Label REPORTED COLOURS · DALTON 1798, PP. 29-30 on 102.60.",
  ["Row 1 MOST PEOPLE: BY DAY pink fills on 'people' (95.59); BY CANDLE pink on 'hardly' (96.97).",
   "Tag NO REAL CHANGE on 'call' (99.99). Music break (MUS-010) from 100.70: Thinking Music cut, dry.",
   "In the break, row 2 slides in empty (100.90); DALTON and BY DAY SKY-BLUE on 'Dalton's' (101.68); BY CANDLE RED on 'don't' (102.18), the act's peak; the label on 102.60. SFX-024 at 103.50 for the colour block; Long Note Two enters 103.61."]),
 (41, 44, "VIS-014", "TXT-010", DIAG, "TRN-012", I, "", "",
  "Calm. Director K_seven: TRN-012 colour block in Dalton's red (#C8402F) from the RED swatch's side. SpectrumStrip divisions (Builder 4) on the inset ground, red on the left, x 210-1710, y 470-566: seven segments at Newton's p.92 proportions (red 1/8, orange 3/40, yellow 2/15, green 1/6, blue 1/6, indigo 1/9, violet 2/9; no numbers on screen), blended at the boundaries. Tag ILLUSTRATION · AFTER NEWTON, OPTICKS, 1704 on 'Newton' (104.40). Texture: ground (inset).",
  ["The band draws left to right on 'rainbow' (105.46).",
   "Six ink dividers drop in on 'seven' (109.07), 0.08 s apart.",
   "Names under the segments, each on its word: RED (110.41), ORANGE (111.01), YELLOW (111.65).",
   "GREEN (112.21), BLUE (112.81), INDIGO (113.47), VIOLET (114.13). SFX-006 at 114.97 for the match."]),
 (45, 46, "VIS-001", "TXT-009, TXT-010", CARD, "TRN-015", D, "", "SRC-063",
  "Calm. L_p92_chord: TRN-015 focus match [622, 560]: the seven names become his printed list. ArchivalScanCard on SRC-063 Opticks p.92, side left, crop [250, 1000, 1290, 1230]; source tag ISAAC NEWTON · OPTICKS · 1704 · P. 92. H0 '( red, orange, yellow, green, blue, indico, violet )' lit on the cut. Desk; no strokes. Page held 5.26 s.",
  ["Match lands with H0 lit; H1 'divided after the manner of a musical Chord.' on 'proportions' (116.94), quote column from 116.94.",
   "H2 the chord numbers '1, 8/9, 5/6, 3/4, 2/3, 3/5, 9/16, 1/2' on 'steps' (118.22). SFX-006 at 120.23 for the slide."]),
 (47, 50, "VIS-014", "TXT-024, TXT-010", DIAG, "TRN-007", B, "", "SRC-063",
  "Calm. Director M_seven_notes: TRN-007 slide out of the document. The divided band as K (whole from frame 0) on a LOK-028 blur of SRC-063 p.92; Builder 4 chord: an ink string divided at the same points, running off the left edge (his string is twice the band); the notes sit on the stops between the colours, because Newton's colours are the steps between notes (Expert S4, fact-check CHECK 38): seven heads at x 1710, 1376.7, 1210, 960, 710, 510, 397.5, a hollow head at 210; no ties (no pitch order drawn). Tag ILLUSTRATION · AFTER OPTICKS, 1704, P. 92 from 120.31. Texture: ground (the blurred page); everything drawn flat.",
  ["String draws on 'notes' (120.96); note heads pop on the stops 0.08 s apart; on 'colours' (122.02) the seven segments brighten one by one between their stops.",
   "Chip 'It's tidy.' (210, 820) on 'tidy' (123.51). Music -50 123.36-126.76 for the joke.",
   "Chip 'a little too tidy' accent (650, 820) on 'too' (125.33).",
   "Chips dim on 'People' (127.44); on 'indigo' (128.62) the indigo dividers turn dashed and a ? lands under INDIGO (Builder 4 query). SFX-006 at 130.40 for the lens; At Rest enters 130.49."]),
 (51, 55, "VIS-001", "TXT-009, TXT-010", CARD, "TRN-017", D, "TEX-008", "SRC-001",
  "Calm. N_p29_acquainted: TRN-017 lens settle; ArchivalScanCard on SRC-001 Dalton 1798 p.29, side left, crop [380, 440, 1060, 1011]; source tag JOHN DALTON · 1798 · P. 29 at 131.09. Desk; TEX-008 'shadow' 0.2 off the highlights (3 of 3). Music -62 136.85-140.01.",
  ["Lens lands; source tag at 131.09 (his name on screen with 'Dalton', 132.64).",
   "H1 'application to the sciences, that' + 'of optics necessarily claimed attention;' on 'knows' (134.09).",
   "H1 dims to 0.4 and H2a 'pretty well acquainted with the theory of light and co-' on 'pretty' (137.00); quote column from 137.00.",
   "H2b 'lours' on 'colours' (139.38); note ON NEWTON'S TERMS on 'Newton's' (141.04).",
   "Note HIS IDEA MAKES GOOD SENSE (accent) on 'makes' (142.56). MUS-011 filter sweep 144.05-144.75 for the push."]),
 (56, 60, "VIS-019, VIS-021", "TXT-024, TXT-010", DIAG, "TRN-006", G, "", "",
  "Calm. Director O_eye_jelly: TRN-006 push from N's 'light' [870, 700]. EyeDiagram plate as E and act 3 (captions THE EYE · SIMPLIFIED, Cornea, Lens, Retina). Legend ILLUSTRATION / DOTS: 3 OF NEWTON'S MANY KINDS / RED-, GREEN-, BLUE-MAKING on 146.70: the dots stand for some kinds of ray by the colour they stir up, not coloured rays, and not 'light comes in three kinds' (Expert S5). The tint always arrives with its tag DALTON'S GUESS · A BLUE VITREOUS. Texture: object (the plate).",
  ["Plate on the cut; nothing new until the rays.",
   "Rays (red-, green-, blue-making dots) from the card's edge to the retina on 'rays' (146.70) with the legend; 'Retina' underline on 'back' (147.54).",
   "Vitreous tint (blue, 0.55) brushes in on 'tinted' (149.67) with its tag DALTON'S GUESS · A BLUE VITREOUS; caption 'Vitreous humour' on 'jelly' (150.09).",
   "On 'changes' (151.01) the red- and green-making dots thin in the jelly; the blue-making pass.",
   "Chip 'change the rays' (120, 760) on 153.32; arrow on 'and' (154.36); chip 'change the colour' accent (120, 880) on 'change' (154.70). Hard cut at 156.01."]),
 (61, 64, "VIS-019", "TXT-010", "MOT-002", "TRN-001", G, "", "",
  "Calm. Director P_open_it: hard cut inside the scene, the same plate closer (Builder 7 zoom 1.15 on [1250, 545]); tint, 'Vitreous humour', DALTON'S GUESS · A BLUE VITREOUS and the ILLUSTRATION tag (120, 960) there on the cut and held to the end, so the dashed line is not read as the 1844 cut (fact-check FIX 48). One slow drift 1.00 -> 1.03. Texture: object (the plate).",
  ["Accent underline under GUESS on 'guess' (157.06).",
   "Tint pulse (to 0.75, 1.6 s) on 'tested' (159.38).",
   "A dashed accent line draws across the globe on 'open' (162.80) (Builder 7 cutLine; an illustration of where an eye would be opened, not a record of 1844).",
   "Holds to the act end under At Rest alone (163.34-166.34, -27); act 6 opens on the dissection."]),
]

SFX = {1: "SFX-001, SFX-006", 3: "SFX-006", 8: "SFX-021", 11: "SFX-021", 15: "SFX-026, SFX-001", 18: "SFX-021",
       24: "SFX-006", 30: "SFX-026", 32: "SFX-020", 37: "SFX-001", 40: "SFX-024", 44: "SFX-006", 46: "SFX-006", 50: "SFX-006"}
SRCB = {12: "", 13: "", 29: "SRC-013", 33: "SRC-040, SRC-013", 34: "SRC-040, SRC-011, SRC-013", 35: "SRC-011, SRC-013", 36: "SRC-011, SRC-013", 37: "SRC-011, SRC-013"}   # sources only where on screen
VISB = {12: "TXT-024", 13: "TXT-024", 14: "VIS-021, VIS-060", 29: "VIS-014, VIS-060", 56: "VIS-019", 60: "VIS-019"}   # rays only on the beats they show
TXTB = {}
TRNB = {34: "TRN-018"}

def music(k, st, en):
    ids = []
    if st < 32.56: ids.append("MUS-007")
    if en > 32.16 and st < 100.75: ids.append("MUS-012")
    if en > 103.61 and st < 130.79: ids.append("MUS-013")
    if en > 130.49: ids.append("MUS-014")
    if k in (1, 12, 41, 51): ids.append("MUS-008")
    if k in (39, 40): ids.append("MUS-010")
    if k in (28, 55): ids.append("MUS-011")
    return ", ".join(ids)

NEW = {
 1: "Yes: Builder 1 act-join still (act 4's last frame); SpectrumStrip options (ticks off, feather, title) (Builder 2); MUS-008 cue sheet act5_cues_v1.json; NAR-005 the act 5 take (new, Planned)",
 2: "Yes: SRC-064 Opticks 1704 title page (new, Planned)",
 4: "Yes: ArchivalScanCard callout keep (Builder 6); limit raise SRC-005 6 -> 8",
 12: "Decision for Sam: VIS-021 RayParticles limit raise 20 -> 24 beats (5% kept); overlay rays (Builder 5)",
 14: "Decision for Sam: SRC-013 geranium limit raise 20 -> 27",
 16: "Decision for Sam: VIS-019 EyeDiagram limit raise 30 -> 32; plate caption swatch (Builder 7)",
 25: "Yes: SRC-058 p.3084 page file (newton1672_p3084.jpg, same scan); limit raise 34 -> 36",
 29: "Decision for Sam: VIS-014 SpectrumStrip limit raise 20 -> 28; rows mode (Builder 3)",
 33: "Decision for Sam: SRC-011 candle limit raise 14 -> 16",
 38: "Decision for Sam: VIS-017 SwatchRows limit raise 12 -> 13; shape morph from a LayerStage overlay strip (Builder 8)",
 41: "Yes: SpectrumStrip divisions mode (Builder 4)",
 45: "Yes: SRC-063 Opticks 1704 p.92 (new, Planned)",
 47: "Yes: SpectrumStrip divisions chord and query (Builder 4)",
 61: "Yes: EyeDiagram plate zoom and cutLine (Builder 7)",
}

rows, covered = [], []
for a, b, vis, txt, mot, trn, look, tex, src, shot, notes in S:
    assert len(notes) == b - a + 1, (a, b, len(notes))
    for k in range(a, b + 1):
        beat, st, en, line = C[k - 1]
        first = k == a
        note = (shot + " " if first else "") + notes[k - a]
        rows.append([beat, 5, f"{st:.2f}", f"{en:.2f}", spoken(line),
                     VISB.get(k, vis), TXTB.get(k, txt), mot, TRNB.get(k, trn if first else "TRN-001"), look,
                     SFX.get(k, ""), music(k, st, en), tex, "", "", SRCB.get(k, src), "", NEW.get(k, ""), note])
        covered.append(k)
assert covered == list(range(1, len(C) + 1)), "every beat once"
for i in range(1, len(rows)):
    assert rows[i][2] == rows[i - 1][3], ("gap or overlap", rows[i][0])
json.dump(rows, open("act5_rows.json", "w"), indent=1, ensure_ascii=False)
print(len(rows), "rows")
