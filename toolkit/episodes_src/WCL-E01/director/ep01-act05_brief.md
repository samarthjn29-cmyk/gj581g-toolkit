# WCL-E01 act 5 "The rays": Director's brief (before the build)

Written 25 Nov 2026 by a fresh Director agent that has not seen any act 5 build. Inputs: `rules/DIRECTOR.md` (rules 1-26),
`rules/DIRECTOR_NOTES.md`, `STYLE_GUIDE.md`, `beat-routing.md`, `director/ep01-act05_plan.md`, `gate1_act5/act5_cuts.json`
(64 beats, act time), `05_rays_paced_words.json` (+2.4 s), `WCL-E01_act5_recorded.json`, `act5_cues_v1.json`, the act 4
brief and act 4's act file (`src/episodes/ep01-act04.json`, shot T's real last frame), the register (`registry.json` "use"
lines), `/home/claude/work/usage.txt` (acts 1-4), and the component sources (SpectrumStrip, ColourPathMap, SwatchRows,
EyeDiagram, KeywordPanel/Chips, LayerStage, ArchivalScanCard, RayParticles, Sticker, Label, Ground, the transitions).

**All times are act times in seconds** (the frame the word starts). Act files take shot-local `atSec`: subtract the
shot's start. House offsets apply (a dropping tag's sound on its settle frame, about atSec + 0.23 s; a sticker's pop on
its settle, atSec + 0.6 s; exits about 0.2 s early when they must clear a cut). Frame 1920x1080, 30 fps, LOK-009, calm
version, LOK-030 finish at Episode level. Running head `5 · THE RAYS` from 2.40, on diagram and panel shots only
(D, E, F, H, J, K, M, O, P); off on A0, the cards (A, B, G, L, N), the quote panel C and the full-frame footage in I.

**Pictures looked at** (one downscaled look each, then word boxes from a tesseract pass on the full files, every box in
the file's own pixels, checked by drawing them back on the page): Opticks title 1600x2321, p.90 1600x2321, p.92
1600x2321, 1672 p.3083 1555x2355, p.3084 1555x2488, Dalton p.29 1920x2813, geranium 1920x1280 (cut-out 1185x769),
laurel 1640x1640 (cut-out 800x700). p.3083 is not used (see change 9).

**Card geometry** (ArchivalScanCard as coded): card 860 tall, top 110; width min(900, 860 x crop aspect); inner box =
card - 18 px; crop drawn "cover"; left side inner origin (138, 128), text column x 1110-1800 (for a 900 card); right side
inner origin (918, 128), text column x 120-810. Screen point = origin + offset + source px x scale (scale and offsets
given per card). Highlight boxes `[x, y, w, h]` in source pixels.

**Act 4's last frame** (ep01-act04.json, T_where_is_it at 215.70, dolly 1.02 reached): room lines at 40%, the prism an
empty outline at 0.3, the beam and the band bright. The band (fan `x0 150, x1 650, y -40, h 100, z 2000, smooth`) draws
at **x 1014-1192, y 438-474, centre (1103, 456), violet on the left, red on the right**. Overlay chips `colour out of
the glass` (1060, 700) and `so where is it?` (accent, 1060, 800) are still on screen.

---

## Shot list

| Shot | Beats | Act time | Picture | In |
|---|---|---|---|---|
| A0_band_title | 1 | 0.00-2.40 | act 4's band, flat, on the act's inset ground; `5 · THE RAYS` | TRN-015 match from act 4's last-frame still (act join) |
| A_opticks_title | 2-3 | 2.40-9.02 | Opticks 1704 title page card | TRN-007 slide |
| B_p90_not_coloured | 4-8 | 9.02-23.74 | p.90 card: the sentence pulled out of its page, read, put plainly | TRN-004 canvas |
| C_power_quote | 9-11 | 23.74-32.16 | his second sentence as quote chips on the blurred p.90 | TRN-011 band |
| D_sunlight | 12-15 | 32.16-43.21 | chips; white sunlight rays; the geranium lands; light leaves it, not pink | TRN-007 slide |
| E_whoever_looks | 16-18 | 43.21-50.25 | the eye plate; the rays reach the back; "seen as pink" at the looker | TRN-004 canvas |
| F_newtons_view | 19-24 | 50.25-64.47 | the verdict as chips on the blurred Opticks title page | TRN-011 band |
| G_p3084_reflect | 25-28 | 64.47-73.46 | 1672 letter p.3084 card, ¶13 | TRN-017 lens |
| H_choosing | 29-32 | 73.46-82.80 | geranium and leaf under a daylight strip; what each sends back | TRN-007 slide |
| I_by_candle | 33-37 | 82.80-94.68 | LayerStage: the geranium by daylight, then by candle; light strips | TRN-006 push |
| J_most_people | 38-40 | 94.68-103.61 | SwatchRows, act 1's day/candle callback; the music break | TRN-009 morph |
| K_seven | 41-44 | 103.61-115.05 | the band split into Newton's seven, at his proportions | TRN-012 colour block |
| L_p92_chord | 45-46 | 115.05-120.31 | Opticks p.92 card | TRN-015 match |
| M_seven_notes | 47-50 | 120.31-130.49 | the band under a string divided the same way; tidy; indigo ? | TRN-007 slide |
| N_p29_acquainted | 51-55 | 130.49-144.19 | Dalton 1798 p.29 card | TRN-017 lens |
| O_eye_jelly | 56-60 | 144.19-156.01 | the eye plate: rays reach the back; Dalton's guessed tint thins them | TRN-006 push |
| P_open_it | 61-64 | 156.01-166.34 | the same eye, closer; the guess; a dashed line where it would be opened | hard cut (same scene) |

17 shots, 15 scene changes plus the act join, 1 hard cut inside a scene (O -> P).

**Changes to Claude's plan, and why (the Director wins on how a shot looks):**
1. **The act join is a match from a still of act 4's last frame, not a new room beat.** VIS-015 is at 37 of 37 and its
   8% runtime share is spent. A0 opens on act 4's real last frame (a PNG of 215.67, Builder 1) and focus-matches its
   band into a flat band. No PerspectiveGrid is rendered in act 5.
2. **"on page 90" opens the page** (B starts at b4, not b5). The number is on screen as the page's own tag the moment it
   is said, and b5 ("easy to read past") gets a picture: the page dims around the one line.
3. **The second p.90 sentence is a quote-chip panel on the blurred page (C)**, not a second card. A second card of the
   same page would be a clone layout, and the old type ("difpofition", "fenfation") does not read at phone size.
4. **The rays are drawn white.** Act 5's claim is that rays have no colour, so every ray in D and E is a warm-white dot;
   "many kinds" is shown by three dot sizes and speeds, never by hue. Coloured dots come back only in O, labelled with
   Newton's own p.90 names (red-making, green-making, blue-making).
5. **No ColourPathMap (VIS-011).** Its register line rules out "explaining one idea mid-act" and it has 3 beats; the
   verdict runs 6 beats. F is a plain-words panel (as act 4's Q), on the blurred Opticks title page (Newton's view, his
   book standing for him, as Hooke's book did in act 4 S1).
6. **b23-24 stay in F.** Neither 59.84 ("meets a | person") nor 62.42 ("geranium and | a leaf") has a pause for a
   sounded transition, and both are mid-sentence. F ends at 64.47 (pause 64.00-64.94).
7. **The leaf/geranium "same daylight" shot is folded** into F's last chips and H; the p.3084 card (G) opens on "Newton
   has an answer for that too."
8. **The candle is a LayerStage (I)**, built on Sam's approved LayerStage-Geranium test (daylight sky, then the candle,
   the flower stepping aside so the flame shows), with the light strips in its overlay; not a blurred candle ground.
9. **p.3083 ("the yellow flame of a Candle") is dropped.** One more page in a run of five cards, and SRC-058 would need
   a bigger raise.
10. **Newton's seven are laid out at his own proportions from p.92** (derived from the printed chord lengths, no numbers
    on the bands), and "seven notes" is shown as a string divided at the same points ("after the manner of a musical
    Chord"), not as a staff, which would have to claim which colour is the low note.
11. **Page landings are not paper foley.** The register's SFX-028 line caps paper at 10 per episode *across SFX-016 and
    SFX-028*, so the Pixabay paper files are spent too. Pages arrive on SFX-006 CardstockSlide (its best use).

---

## Shot A0_band_title

| Field | What it says |
|---|---|
| Line | Slate, 0.00-2.40, music alone (Wholesome, MUS-007, fading in at -26 under act 4's At Rest tail). |
| Subject | The band of colours, the thing act 4 ended asking about; then the act's title. |
| World and why | LOK-029 InsetGround `{kind: "inset", act: 5}` (lilac glow, dust): **the change itself**, the band lifted off the wall onto a ground of its own, set apart as the act's turn. |
| Period honesty | A title over a drawn band (2.4 s, a slate): no tag. |
| Entry | TRN-015 FocusMatchCut, `focus [960, 518]`, from act 4's last-frame still (Builder 1): the wall's band (1103, 456) goes soft and grows into the flat band, centre (960, 518): 143 px across, 62 down. SpectrumStrip `startSec -1` so the band is whole on the match frame; `ticks: false`, `feather: true` (Builder 2); default orientation (violet left, red right) = act 4's band. |
| Path and landing | Band x 210-1710, y 470-566, centred (a single object, symmetric on purpose). Title `5 · THE RAYS` (Fraunces 600, 76 px, Builder 2 `title {text, atSec 0.75, x 210, y 400}`) rises 0.75-1.45 above the band's left end, wiping left to right. |
| Scale | The match is the size change (the wall's band becomes the subject). Drift 0.02. |
| Action | None after the title. |
| Exit | Carried off by the slide at 2.40. |
| Eye out | Band centre (960, 518) -> A's source tag and first note in the text column (about (1000, 650), 3.00-3.16). |
| Sound | SFX-001 SoftWhoosh at 0.02, -24 dB (music only). SFX-006 CardstockSlide for the slide at 2.30 (pause to 2.70). |
| Texture | **ground:** the inset ground's dust and glow; band flat and smooth; title ink. |

## Shot A_opticks_title (card, one line plus positions)
TRN-007 slide 2.40; ArchivalScanCard, SRC-064 NEW `newton_opticks1704_title.jpg` [1600, 2321], `side left`, `crop [110, 120,
1400, 2010]` (card 599 wide; scale 0.40995; screen = (87.4 + 0.40995x, 78.8 + 0.40995y); the owner's handwriting above
y 110 is cropped out). Note `1672 → 1704 · 32 YEARS` at 3.16 ("30"). **H1** "MDCCIV" `[760, 2045, 240, 58]` at 4.60
("1704") -> screen x 399-497, y 917-941. **H2** "LONDON," `[615, 1878, 370, 62]` at 5.90 -> x 340-491, y 849-874. **H3**
"OPTICKS:" `[150, 135, 1320, 195]` at 6.98 ("publishes", so it holds 2.04 s before the slide) -> x 149-690, y 134-214.
Title column `quoteMarks: false`, "Opticks: or, a Treatise of the Reflexions, Refractions, Inflexions and Colours of
Light", `quoteAtSec 6.98`. Source tag `ISAAC NEWTON · OPTICKS · LONDON, 1704`. Desk ground (LOK-027 dark). The eye runs
right column -> bottom of the page (date, place) -> the title at the top; it ends on H3 (420, 175). Ground placement,
the scan untouched, no strokes.

## Shot B_p90_not_coloured

| Field | What it says |
|---|---|
| Line | a5-01 end, a5-02: "and on page 90 (10.10), he gives his answer. It's a sentence (13.50) that's easy to read past. For the rays (16.19) to speak properly are (17.65) not coloured. In plain words (19.79), strictly speaking, the rays (22.05) have no colour." |
| Subject | The one line on the page that answers act 4's question. |
| World and why | ArchivalScanCard (VIS-001), SRC-005 p.90 [1600, 2321], on the dark paper desk (LOK-027): **same idea**, the page is the answer. |
| Period honesty | The real 1704 page; source tag `ISAAC NEWTON · OPTICKS · 1704 · P. 90`. |
| Entry | TRN-004 canvas glide `dir right, pull 0.86` from the title page (the same book, a later page). `side left`, `crop [240, 370, 1280, 1221]` (scale 0.675; screen = (-24 + 0.675x, -121.85 + 0.675y)): the end of the paragraph before, the DEFINITION heading and its paragraph down to "Colour." Note `P. 90` at 10.10 ("90"), under the tag. |
| Path and landing | **Layout change at 13.50** ("sentence", Builder 6 `callout {atSec 13.50, dim 0.55, keep: [[384, 1316, 1120, 64]]}`): the page dims and one line stays bright, screen x 235-991, y 766-810: the sentence that is easy to read past. **H1a** "For the rays to speak properly" `[384, 1316, 724, 64]` at 16.19 (x 235-724) and **H1b** "are not coloured." `[1113, 1316, 391, 64]` at 17.65 (x 727-991), swept as read. Quote column (x 1110-1800, from y 300) "For the rays to speak properly are not coloured." `quoteAtSec 16.19`. Notes under the tag: `IN PLAIN WORDS` at 19.79; `THE RAYS HAVE NO COLOUR` (accent) at 22.05 ("rays"). |
| Scale | Drift only (MOT-001). |
| Action | The page gives up one line; the line is read; it is put plainly. |
| Exit | Carried off by the band at 23.74. |
| Eye out | The accent note `THE RAYS HAVE NO COLOUR` (about (1110-1590, 790)) -> C's source chip at (860, 730): 250 across, 60 up. |
| Sound | SFX-006 for the canvas glide at 8.92 (pause 8.86-9.18). Music near-silent (-62) 16.04-18.98 under the quote. Highlights and notes silent. SFX-021 cloth_slide for the band at 23.66 (pause 23.09-24.39). |
| Texture | **ground:** the dark desk; the scan gets nothing new; TEX-008 strokes `shadow` 0.2 off the kept line (1 of 3). |

## Shot C_power_quote (panel, one line plus positions)
TRN-011 band `dir down, tone dark` at 23.74; KeywordPanel `panel {chips: []}` with overlay `quotes` (TXT-025); **ground
LOK-028 blur of SRC-005 p.90** (`file newton_opticks1704_p90.jpg, size [1600, 2321], focus [0.55, 0.62], brightness
0.38`): the page just read, soft. Source chip `ISAAC NEWTON · OPTICKS · 1704 · P. 90` at (860, 730) on "All" 24.39 (the
panel's first mark 0.65 s after the cut). QuotePanel `size 52`, words as spoken, long s shown as s: line 1 (860, 300) "a"
26.69, "certain" 26.99, "power" 27.37; line 2 (860, 400) "and" 27.79, "disposition" 28.05; line 3 (860, 500) "to" 28.63,
"stir" 28.95, "up" 29.23, "a" 29.39, "sensation" 29.57; line 4 (860, 600) "of" 30.01, "this" 30.35, "or" 30.67, "that"
30.93, "Colour" 31.25 (capital C as printed). Lines end by x 1550. Music -62 26.54-31.76. Eye ends on "Colour" (about
(1450, 630)). Ground placement; the chips are crisp. Running head off (a quote).

## Shot D_sunlight

| Field | What it says |
|---|---|
| Line | a5-04 to "pink.": "That sounds like it clashes (33.99) with the prism. It doesn't (36.10). What's in sunlight (37.41) is many kinds (38.89) of ray. The light coming off (40.78) that geranium isn't pink (41.82)." |
| Subject | First the objection, then light arriving at the geranium and leaving it still white. |
| World and why | LOK-029 inset ground (act 5's glow): **same idea**, a dark, quiet stage for light, where white dots read. No picture behind: the subject is the light itself. |
| Period honesty | The geranium is a modern photo cut-out: sticker tag `PHOTO TODAY · D. J. STANG, CC BY-SA 4.0`. Tag `ILLUSTRATION · RAYS DRAWN WITHOUT COLOUR` bottom-left (120, 960), size 20, at 37.60 (the dots are a picture, and white on purpose). |
| Entry | TRN-007 slide at 32.16 (out of the document; MUS-012 Thinking Music enters). Chips (TXT-024, 64 px) where the eye already is (C's last word, about (1450, 630)): `clashes with the prism` (940, 560) on 33.99; `It doesn't.` accent (940, 680) on 36.10, when the first chip dims (`dimSec 36.10`). Panel `untilSec 37.00` (un-wipes before the light starts). |
| Path and landing | **Builder 5 overlay rays**, warm white `#FFF6DD`, three kinds (size 5 / 7 / 9 px, speed 560 / 620 / 680 px/s, count 5 each, 15 dots, jitter 16): sunlight from off-frame upper left `path [[-40, 40], [560, 500]]` from 37.41. Label `MANY KINDS OF RAY` (mono 26) at (360, 120) on 38.89, 186 px above the beam. The geranium (VIS-060 sticker, SRC-013 `geranium_stang_flowerhead_cutout.png` [1185, 769]) pops in at (680, 560), w 460 (x 450-910, y 411-709), tilt -2, at 39.75 (the pause before "The light"): the rays were already falling on that spot. Outgoing rays (same three kinds) `path [[900, 520], [1980, 470]]` from 40.78, towards whoever is looking, off the right edge. Label `ISN'T PINK` (mono 26) at (1260, 340) on 41.82, 160 px above the outgoing dots. Sticker tag un-wipes 42.60. |
| Scale | None; drift 0.02. |
| Action | The light arrives white and leaves white. |
| Exit | The canvas glide (dir right) at 43.21 follows the light to the right. |
| Eye out | The outgoing dots at the right edge (about (1750, 480)) -> E's dots entering from the left edge at y 545 (the glide carries the eye along the light). |
| Sound | SFX-021 air_woosh for the slide at 32.08 (pause 31.51-32.81). SFX-026 soft pop on the geranium's settle 40.33 (pause 39.61-40.55). Chips, labels and dots silent. SFX-001 for the glide at 43.11 (pause 42.74-43.68). |
| Texture | **object:** the geranium photo cut-out (white sticker edge) is the one textured hero on the quiet inset; dots, chips, labels crisp. |

## Shot E_whoever_looks

| Field | What it says |
|---|---|
| Line | a5-04 end: "Each ray only has a kind (44.90) of push, and the pink (46.48) is what happens when that push reaches (48.26) whoever is looking (49.30)." |
| Subject | The rays arriving at the back of an eye, and the pink appearing at the one looking, not in the rays. |
| World and why | EyeDiagram (VIS-019) `mode "plate"` on warm graphite, act 3's card `{x 680, y 130, w 1060, h 830, tilt 1.0}` (eye centre (1220, 545), cornea apex x 911, retina at x 1478): **same idea**, "whoever is looking" is an eye, and it is the same plate act 3 used for Dalton's eye. |
| Period honesty | Caption `THE EYE · SIMPLIFIED` (mono, (724, 176), from -1); tag `ILLUSTRATION` bottom-left (120, 960) from 43.40. |
| Entry | TRN-004 canvas glide `dir right, pull 0.86` from D; the plate is whole on arrival (`startSec -1`). Builder 5 overlay rays continue from the left edge: `path [[-40, 545], [1478, 545]]`, the same three white kinds with a 1.5 px paper-ink edge (`stroke rgba(43,39,36,0.6)`, so they read on the cream card), `atSec 42.60` (dots already in flight at the cut), `untilSec 47.60` (the last dot reaches the back by 50.1). |
| Path and landing | Label `A KIND OF PUSH` (mono 26) at (160, 380) on 44.90, 125 px above the dots, on the graphite left of the card. Caption "Retina" (serif 30) at (1560, 318), anchor (1428, 398), on 46.48 ("pink": the eye has the back where it happens). **Builder 7** caption with a swatch: "seen as pink" (italic 34) with a 28 px `#E79AB9` square (act 1's geranium pink), at (1180, 905), anchor (1440, 700) on the back of the eye, on 48.26 ("reaches"). |
| Scale | None; plate drift 0.02. |
| Action | White dots arrive; the colour is attached to the looker. |
| Exit | Labels un-wipe 49.90; the band (up) at 50.25. |
| Eye out | "seen as pink" (1180-1430, 905) -> F: the band lifts the eye up to the verdict chips (first at (480, 250) on 52.80); F's name label (1800, 980) lands at 51.54 first. |
| Sound | SFX-001 glide 43.11. All changes on words: silent. SFX-021 cloth_slide for the band at 50.17 (pause 49.60-50.90). |
| Texture | **object:** the plate (cream card, engraved hatching) is the one textured hero on flat graphite; dots, labels and captions crisp. |

## Shot F_newtons_view (panel, one line plus positions)
TRN-011 band `dir up, tone dark` at 50.25 (the story lifts from the picture to the verdict); KeywordPanel; **ground
LOK-028 blur of SRC-064 NEW** (the Opticks title page, `size [1600, 2321], focus [0.5, 0.43], blurPx 14, brightness
0.38`): "Newton's view", his book standing for him (no Newton portrait is left: SRC-049 is at 6 of 6). Label `ISAAC
NEWTON · OPTICKS, 1704` (right-aligned (1800, 980), size 22) on "Newton's" 51.54. Chips 64 px, left edge x 480 (the
panel's block spans 480-1585, balanced by the label on the right): `isn't really in the flower` (480, 250) on 52.80;
`isn't in the light either` (480, 380) on 55.47; `where the light meets a person` accent (480, 520) on "where" 58.58.
**Layout change on "But" 61.46:** the three dim to 0.3 (`dimSec 61.46`); `a geranium and a leaf` (480, 700) on 61.84;
`still look different` (480, 830) on 62.82 (bottom 913). The negations are spoken words, so no strike is needed. Eye
starts at the label/first chip, ends on `still look different` (about (850, 870)). Ground placement; chips crisp; 60 px
or more from the running head.

## Shot G_p3084_reflect (card, one line plus positions)
TRN-017 lens `durSec 0.7, blur 14` at 64.47 (a cut to a real page; "Newton has an answer"); ArchivalScanCard, SRC-058
p.3084 `newton1672_p3084.jpg` [1555, 2488], `side left`, `crop [40, 1070, 1480, 1411]` (scale 0.5838; screen = (114.6 +
0.5838x, -496.7 + 0.5838y); ¶12 to "They have there no appropriate colour", ¶13 in the middle). Note `CAMBRIDGE · FEB 1672`
on "Cambridge" 68.21 (act 4's wording). **H1** "the Colours of all natural Bodies" `[785, 1768, 705, 52]` + "have no
other origin than this," `[62, 1826, 662, 64]` on "things" 69.31 (x 573-985, y 536-566; x 151-537, y 569-607). **H2**
"that they are variously qualified to" `[745, 1824, 748, 64]` + "reflect one sort of light in greater plenty then
another," `[62, 1883, 1190, 64]` on "sending" 70.53 (2.9 s to read; x 550-986, y 568-606; x 151-846, y 602-639). Quote
column "variously qualified to reflect one sort of light in greater plenty then another" (`then` as printed)
`quoteAtSec 71.45` (b28's change). Source `ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672 · P. 3084`. Desk; TEX-008 strokes
`shadow` 0.2 off H1/H2 (2 of 3). Eye ends at H2 (about (500, 620)). SFX-006 for the lens at 64.40 (pause 64.00-64.94).

## Shot H_choosing

| Field | What it says |
|---|---|
| Line | a5-06 end: "A geranium sends back (74.44) one mix. A leaf (76.70) sends back (76.92) another. Neither one is painting the light (79.37), each (80.67) is choosing (81.31) from it." |
| Subject | The two things side by side, each sending back a different part of the same light. |
| World and why | SpectrumStrip (VIS-014) **Builder 3 rows mode** on warm graphite: **same idea**, the light offered (a daylight strip on top) and what each thing returns (a strip under each). Data and light go on graphite. |
| Period honesty | Sticker tags `PHOTO TODAY · D. J. STANG, CC BY-SA 4.0` and `PHOTO TODAY · RUNIC EARTH` (both un-wipe 78.60); tag `ILLUSTRATION · SIMPLIFIED, NOT MEASURED` (right-aligned (1800, 960), size 20) from 74.44: the strip shapes are a picture of "more of some, less of others", not a reflectance measurement. |
| Entry | TRN-007 slide at 73.46 (out of the document). On the cut: the `DAYLIGHT` strip (x 330-1590, y 150-196, all colours full, label at (330, 112)) and the geranium sticker (560, 430), w 400 (x 360-760, y 300-560), tilt -2: within 25% of G's H2 (500, 620). The leaf (SRC-014 `laurel_runicearth_leaf_cutout.png` [800, 700]) pops in at (1360, 430), w 250 (x 1235-1485), tilt 3, at 75.75 (the pause before "A leaf"): one sticker entrance at a time. |
| Path and landing | Red on the left in every strip from here on (Builder 3 `reverse`, as act 3's six bands). Geranium's strip x 330-790, y 680-726, draws on "sends" 74.44: strong at the red end, low through green, some again at blue-violet. Leaf's strip x 1130-1590, y 680-726, on "sends" 76.92: a green hump, low at both ends. Labels `SENT BACK` (mono 22) centred under each at y 742, with its strip. Chips (64 px): `painting the light` (330, 820) on 79.37, ink strike (`inkStrike`) on "each" 80.67; `choosing from it` accent (1060, 820) on 81.31. |
| Scale | None; drift 0.015. |
| Action | Same light in; two different mixes out. |
| Exit | Chips stay; the push at 82.80 grows out of the geranium. |
| Eye out | The geranium (560, 430): the push opens I from there. |
| Sound | MUS-011 filter sweep on the Thinking Music bed 73.30-74.10 for the slide (no swish left in the slide's own budget; pause 72.99-73.92). SFX-026 soft pop on the leaf's settle 76.35 (pause 75.58-76.52). Strips, chips silent. |
| Texture | **ensemble:** two photo cut-outs, held by one badge shape (the same 6 px white sticker edge and soft shadow); strips, labels and chips flat and crisp. |

## Shot I_by_candle

| Field | What it says |
|---|---|
| Line | a5-07: "That also (83.57) explains the candle. Candlelight (85.70) is much yellower (86.74) than daylight, with far less (88.40) blue in it. So by candle, the geranium (91.53) has a different mix (92.63) of rays to choose from." |
| Subject | The same geranium, first by daylight, then by candlelight; what each light offers it. |
| World and why | LayerStage (VIS-059), the approved LayerStage-Geranium set-up. World 1 SRC-040 sky (`kind video, size [1920, 1080], revFile sky_clouds_mixkit51102_rev.mp4, clipSec 8.5, light day, haze 0.12, blur 2, rackSec 0.3, lightFrom top-left, label DAYLIGHT, today`), why: "The change itself: the same flower in the daylight the line compares the candle with." World 2 SRC-011 candle from 85.70 (`size [1080, 1920], focus [0.5, 0.5], clipStartSec 7.6, change dissolve, sec 1.4, light warm, blur 1.5, lightFrom left, label CANDLELIGHT, today`), why: "The change itself: Dalton's evening light, which has far less blue." One world change (TRN-018, 1 of 3). |
| Period honesty | World labels read `TODAY · DAYLIGHT` / `TODAY · CANDLELIGHT` (bottom-right, the component's place); stage caption `PHOTO D. J. STANG, CC BY-SA 4.0 (CUT OUT)` bottom-left; tag `ILLUSTRATION · NOT MEASURED` (140, 470), size 18, from 86.74, under the strips. No DatelineTag (TXT-011 is at 40 of 40). |
| Entry | TRN-006 push, `focus [560, 430]` (H's geranium). The carried geranium is settled on the cut at (640, 470), w 640 (`atSec -1`), within 25% of the push point. |
| Path and landing | On the swap 85.75 the geranium moves (1.3 s) to (1290, 430), w 560: why "Steps aside so the flame whose light it now gets is seen" (as the approved test; check on the landing still that the flame is clear and 60 px or more from the strips). **Builder 3 rows in `overlay.spectrum`**, top-left, x 140-700, red on the left: `DAYLIGHT` strip y 140-184 (label y 106) on 83.57, flat; `CANDLELIGHT` strip y 260-304 (label y 226) on 86.74, full at the red end fading to about a sixth at the violet end (a smooth ramp, no numbers); a bracket over its blue-violet end (x 560-700, y 254) with `FAR LESS BLUE` (mono 22) at (720, 266) on 88.40 (90 px clear of the flower); `THE GERANIUM'S MIX, BY CANDLE` strip y 400-444 on 91.53, its label (y 366) on 92.63: the geranium's sent-back shape from H times the candle strip (red strong, blue nearly gone). |
| Scale | The flower shrinks a little (640 -> 560) as it becomes one part of the candlelit room. Camera `pan -60, push 0.03` (the one slow move). |
| Action | The light changes under the flower; the menu it chooses from changes with it. |
| Exit | The morph at 94.68 lifts the bottom strip out. |
| Eye out | The bottom strip `[140, 400, 560, 44]` -> J's MOST PEOPLE / BY CANDLE swatch `[1202, 374, 250, 150]` (the morph carries it). |
| Sound | SFX-020 low_whoosh_v3 for the push at 82.65 (pause 82.15-83.45). The world dissolve and strips silent (on words). SFX-001 for the morph at 94.58 (pause 94.03-95.33). |
| Texture | **object:** the geranium cut-out is the one textured hero; both worlds are real footage (TODAY) and get nothing laid on them (rule 25); strips flat. |

## Shot J_most_people

| Field | What it says |
|---|---|
| Line | a5-08: "And to most people (95.59), that change hardly (96.97) matters. Their eyes still call (99.99) it pink. [music break 100.70-103.03] Dalton's (101.68) eyes don't (102.18)." |
| Subject | The same change in the light; one row barely moves, Dalton's turns over. |
| World and why | SwatchRows (VIS-017) on warm graphite: **same idea**, act 1's "by day / by candle" rows, now with the reason under them. |
| Period honesty | Label `REPORTED COLOURS · DALTON 1798, PP. 29-30` (centred (960, 830), size 22) on 102.60: the swatches are what people reported, not a measurement. |
| Entry | TRN-009 ShapeMorph `fromShape [140, 400, 560, 44, 6]` (I's bottom strip) -> `toShape [1202, 374, 250, 150, 10]` (MOST PEOPLE / BY CANDLE), 0.75 s, `holdSec 1.0`: the geranium's candle mix becomes what most people call it. Columns `BY DAY`, `BY CANDLE` (heads y 304); row 1 outlines on the cut. |
| Path and landing | Component layout (2 rows): names right-aligned to x 868; swatches x 908-1158 and 1202-1452; row 1 y 374-524, row 2 y 580-730. Row 1 `MOST PEOPLE` (name on 95.59): BY DAY `#E79AB9` `PINK` fills 95.59; BY CANDLE `#E79AB9` `PINK` fills 96.97; tag `NO REAL CHANGE` (x 1488-1793) on "call" 99.99. **In the break** row 2 slides in empty at 100.90; `DALTON` and BY DAY `#86B5E8` `SKY-BLUE` on 101.68; BY CANDLE `#C8402F` `RED` on "don't" 102.18, the act's peak. The colours are act 1's hexes. |
| Scale | None; drift 0.015. |
| Action | The last swatch turns red on the word. |
| Exit | The red block floods out of the RED swatch at 103.61. |
| Eye out | The RED swatch (1327, 655) -> the block from the right, which reveals K's red band at the left. |
| Sound | SFX-001 morph 94.58. MUS-010 break 100.70-103.03 (Thinking Music cut, dry; no hit: SFX-025 at 3 of 3); fills silent. SFX-024 for the block at 103.50 (pause 102.96-104.26); MUS-013 Long Note Two in 103.61. |
| Texture | **ground (flat):** pure data on graphite, no texture (rule 22). |

## Shot K_seven

| Field | What it says |
|---|---|
| Line | a5-09 to "violet.": "Newton (104.26) also gives us the rainbow (105.46) we learn at school. He splits (107.61) his band of colours into seven (109.07). Red (110.41), orange (111.01), yellow (111.65), green (112.21), blue (112.81), indigo (113.47) and violet (114.13)." |
| Subject | The band, then Newton's seven divisions of it, named as said. |
| World and why | SpectrumStrip (VIS-014) **Builder 4 divisions mode** on the inset ground (LOK-029): **same idea**, act 5's band returns as the "rainbow we learn at school". |
| Period honesty | Tag `ILLUSTRATION · AFTER NEWTON, OPTICKS, 1704` (bottom-left (120, 960), size 20) on 104.40 ("Newton"). Band widths from p.92 (see For the fact-check 3); no numbers on screen. |
| Entry | TRN-012 colour block `color #C8402F` (Dalton's red), `side right` (the RED swatch's side), at 103.61. |
| Path and landing | Band x 210-1710, y 470-566, red on the left (`reverse`), drawn left to right on "rainbow" 105.46 (0.9 s). Seven segments at Newton's proportions, red 1/8, orange 3/40, yellow 2/15, green 1/6, blue 1/6, indigo 1/9, violet 2/9 of the band: boundaries at x 210, 397.5, 510, 710, 960, 1210, 1376.7, 1710. Each segment is filled with its own named colour (wavelengthRGB of 650, 605, 580, 530, 470, 445, 410 nm), blended over about ±20 px at each boundary and feathered at the ends (a smooth band, never stepped bands; style guide). Six ink dividers (2 px, band height + 12) drop in on "seven" 109.07, 0.08 s apart. Names (mono caps 22) centred under each segment at y 590, each on its word: `RED` (304), `ORANGE` (454), `YELLOW` (610), `GREEN` (835), `BLUE` (1085), `INDIGO` (1293), `VIOLET` (1543). |
| Scale | None; drift 0.02. |
| Action | One band becomes seven named spaces. |
| Exit | The match at 115.05 carries the names into his printed list. |
| Eye out | The names row (centre about (923, 603)) -> L's printed colour list (622, 560): 301 across, 43 up. |
| Sound | SFX-024 block 103.50. Dividers and names silent (on words). SFX-006 for the match at 114.97 (pause 114.59-115.52). |
| Texture | **ground:** the inset ground's dust and glow; band, dividers, names flat and crisp. |

## Shot L_p92_chord (card, one line plus positions)
TRN-015 FocusMatchCut `focus [622, 560]` at 115.05 (the seven names become his printed list); ArchivalScanCard, SRC-063
NEW `newton_opticks1704_p92.jpg` [1600, 2321], `side left`, `crop [250, 1000, 1290, 1230]` (scale 0.6698; screen = (138 +
(x - 250) x 0.6698, 128 + (y - 1000) x 0.6698)). **H0** "( red, orange, yellow, green, blue, indico, violet )"
`[410, 1612, 1125, 66]` lit on the cut (`atSec -1`; x 245-999, y 538-582). **H1** "divided after the manner of a musical
Chord." `[520, 1100, 1000, 52]` on "proportions" 116.94 (x 319-989, y 195-230). **H2** the chord numbers "1, 8/9, 5/6,
3/4, 2/3, 3/5, 9/16, 1/2" `[410, 1324, 530, 74]` on "steps" 118.22 (x 245-600, y 345-395; 2.09 s to read). Quote column
"divided after the manner of a musical Chord" `quoteAtSec 116.94`. Source `ISAAC NEWTON · OPTICKS · 1704 · P. 92`. Desk;
no strokes. Page held 5.26 s. Eye ends at H2 (420, 370). SFX-006 for the slide out at 120.23 (pause 119.66-120.96).

## Shot M_seven_notes

| Field | What it says |
|---|---|
| Line | a5-10: "Seven notes (120.96), seven colours (122.02). It's tidy (123.51). Possibly a little too (125.33) tidy. People (127.44) have been arguing about indigo (128.62) ever since." |
| Subject | The seven bands matched one-for-one to seven notes; then the one band people argue about. |
| World and why | SpectrumStrip divisions (as K, whole from frame 0: band, dividers, names) plus **Builder 4 `chord`**, on **LOK-028 blur of SRC-063 p.92** (`focus [0.5, 0.6], brightness 0.38`): **same idea**, the page just read, soft, behind his idea drawn out. |
| Period honesty | Tag `ILLUSTRATION · AFTER OPTICKS, 1704, P. 92` (bottom-left (120, 960), size 20) from 120.31: the string is our picture of his "musical Chord", divided at the same points as the bands, not his figure. |
| Entry | TRN-007 slide at 120.31 (out of the document). The band (y 470-566) sits where K left it. |
| Path and landing | On "notes" 120.96 a string (ink, 3 px) draws across at y 400 from x 210 to 1710 (0.5 s), with bridges at the six boundaries, and seven note heads (♪, ink, 36 px) pop at the segment centres just above it, 0.08 s apart. On "colours" 122.02 seven ink ties (1 px) drop from each note to its segment. Chips (64 px, below the names): `It's tidy.` (210, 820) on 123.51; `a little too tidy` accent (650, 820) on 125.33; both dim to 0.35 on "People" 127.44. On "indigo" 128.62 (**Builder 4 `query`**) the two indigo dividers turn dashed and a `?` (Fraunces 72, accent) lands centred under `INDIGO` at (1293, 690); 90 px above the chips. |
| Scale | None; drift 0.02. |
| Action | Seven matches seven, too neatly; one band goes into question. |
| Exit | Chips and `?` stay; the lens cut at 130.49. |
| Eye out | The `?` (1293, 690) -> N's source tag in the text column (about (1110, 620)): 183 across, 70 up. |
| Sound | SFX-006 slide 120.23. Music near-silent (-50) 123.36-126.76 for the joke; all changes silent. SFX-006 for the lens at 130.40 (pause 129.84-131.14); MUS-014 At Rest in 130.49. |
| Texture | **ground:** the blurred page; band, string, notes, chips and `?` flat and crisp. |

## Shot N_p29_acquainted (card, one line plus positions)
TRN-017 lens `durSec 0.7, blur 14` at 130.49; ArchivalScanCard, SRC-001 `dalton1798_p29.jpg` [1920, 2813], `side left`,
`crop [380, 440, 1060, 1011]` (from the running head "On the Vision of Colours. 29" down to "their nomenclature";
scale 0.8151; screen = (-171.7 + 0.8151x, -230.6 + 0.8151y)). Source `JOHN DALTON · 1798 · P. 29` (as act 1) at 131.09
(his name on screen with "Dalton" 132.64). **H1** (the paraphrase's source, on "knows" 134.09) "application to the
sciences, that" `[831, 992, 552, 56]` + "of optics necessarily claimed attention;" `[430, 1055, 698, 58]` (x 506-956,
y 578-624; x 179-748, y 629-677), `dimAtSec 137.00, dimTo 0.4`. **H2a** "pretty well acquainted with the theory of light
and co-" `[428, 1108, 955, 62]` on "pretty" 137.00 (x 177-956, y 673-723); **H2b** "lours" `[430, 1172, 100, 46]` on
"colours" 139.38 (x 179-260, y 725-762). Quote column "pretty well acquainted with the theory of light and colours"
`quoteAtSec 137.00`. Notes: `ON NEWTON'S TERMS` on "Newton's" 141.04; `HIS IDEA MAKES GOOD SENSE` (accent) on "makes"
142.56. Music -62 136.85-140.01. Desk; TEX-008 `shadow` 0.2 off the highlights (3 of 3). Eye ends on H2a's "light"
(about (870, 700)), the push point.

## Shot O_eye_jelly

| Field | What it says |
|---|---|
| Line | a5-12: "Colour is what happens when certain rays (146.70) reach the back (147.54) of the eye. So a tinted (149.67) jelly (150.09) in front of it changes (151.01) which rays arrive. Change the rays (153.32), and (154.36) you change (154.70) the colour." |
| Subject | Rays reaching the back of the eye; then Dalton's guessed blue jelly thinning some of them. |
| World and why | EyeDiagram plate on warm graphite, act 3 C's card `{x 680, y 130, w 1060, h 830, tilt 1.0}`: **same idea and same picture** as act 3's Dalton explanation and E, so the viewer meets the eye again where "Newton's terms" lead. |
| Period honesty | Captions as act 3 (`THE EYE · SIMPLIFIED`, Cornea, Lens, Retina, from -1). The tint arrives **with** its tag: `DALTON'S GUESS · A BLUE VITREOUS` (mono, (1230, 930), anchor (1330, 700)) on "tinted" 149.67, never shown untagged. Legend Label (120, 250), size 20, three lines: `ILLUSTRATION` / `DOTS: NEWTON'S RED-, GREEN-` / `AND BLUE-MAKING RAYS` on 146.70: the coloured dots stand for kinds of ray by the colour they stir up (p.90's own names), not coloured rays. |
| Entry | TRN-006 push, `focus [870, 700]` (N's "light"): the theory of light opens into light entering the eye; the cornea apex (911, 545) is 41 across, 155 up from the push point. Plate whole on the cut. |
| Path and landing | Plate `rays` (VIS-021) `atSec 146.70, untilSec 151.70, speed 700, count 18, size 10, colors [#FF3B30, #30D158, #2F6BFF]` from the card's edge to the retina (x 714 -> 1478, y 545). "Retina" caption underline (accent) on "back" 147.54. Vitreous `tints` `#3D6BD6, opacity 0.55, brushSec 0.7` on "tinted" 149.67; caption "Vitreous humour" (1240, 198), anchor (1300, 390), on "jelly" 150.09. `absorb {atSec 151.01, colors [#FF3B30, #30D158], from 0.52, to 0.7, keep 0.3}`: red- and green-making dots thin in the jelly, blue ones pass. Chips 52 px in the graphite margin: `change the rays` (120, 760) on 153.32; arrow (300, 840) -> (320, 878) on "and" 154.36; `change the colour` accent (120, 880) on 154.70 (x 120-638, 42 px clear of the card). |
| Scale | None; drift 0.02. |
| Action | The tint goes on; fewer red and green rays reach the back. |
| Exit | Hard cut at 156.01 (pause 155.36-156.66), same scene. |
| Eye out | `change the colour` (380, 916) -> P's guess caption at (640-1010, 880): about 420 across, 0 down (inside 25%). |
| Sound | MUS-011 filter sweep on the At Rest bed at 144.05-144.75 for the push (no whoosh left; pause 143.54-144.84). The rest on words: silent. |
| Texture | **object:** the plate; dots, chips, captions crisp. |

## Shot P_open_it

| Field | What it says |
|---|---|
| Line | a5-13: "But a guess (157.06) about the inside of an eye can only be tested (159.38) one way. Someone has to open (162.80) it (163.06)." Act ends 166.34, At Rest alone from 163.34. |
| Subject | The guess (the tinted vitreous), and the one way to test it. |
| World and why | The same plate, closer (**Builder 7 `zoom {scale 1.15, focus [1250, 545]}`**): **same place**; we go into the inside the line is about (rule 7). |
| Period honesty | Captions kept: "Vitreous humour" (pre-zoom (1240, 198), anchor (1300, 390)) and `DALTON'S GUESS · A BLUE VITREOUS` moved to pre-zoom (720, 836), anchor (1330, 700) -> on screen about (640-1010, 880), anchor (1342, 723). The dashed line is an illustration of where an eye would be opened, not a record of 1844. Others off. |
| Entry | Hard cut; the plate, tint (`atSec -1.2`, as act 3 C) and captions are there on the cut frame (`startSec -1`). |
| Path and landing | Underline (accent) under `GUESS` on "guess" 157.06. Tint pulse (`pulses` to 0.75, 1.6 s) on "tested" 159.38. **Builder 7 `cutLine {atSec 162.80, drawSec 1.0}`**: a dashed accent line across the globe, top to bottom, at x = centre + 0.35 R, on "open". |
| Scale | The cut is the size change; then the one slow drift (1.00 -> 1.03). |
| Action | The guess is named, questioned, and marked for opening. |
| Exit | Holds to the act end; act 6 opens on the dissection. |
| Eye out | The dashed line (about (1330, 545)). |
| Sound | None on the cut. At Rest alone 163.34-166.34 (-27). |
| Texture | **object:** the plate; captions and the dashed line crisp. |

Last 3.54 s (162.80-166.34) without a new mark: inside the 4 s ceiling; the drift keeps moving under At Rest alone, as act
4 ended.

---

## Transition review

Eye trace: the focal point lands within 25% (480 px across, 270 down) or the move carries it. Every transition starts on
the new beat's first frame and sits in a pause (checked against the word times).

| # | From -> to | On the line | Transition and parameters | Why | Sound |
|---|---|---|---|---|---|
| join | act 4 T -> A0 | slate (0.00) | TRN-015 `focus [960, 518]` from a still of act 4's last frame (Builder 1), 0.65 s | the wall's band becomes the act's band (143 px, 62 px) | SFX-001 0.02 (music only) |
| 1 | A0 -> A | "More than" (2.40) | TRN-007 SlideAcross 0.7 s | into a document | SFX-006 2.30 |
| 2 | A -> B | "and on page" (9.02) | TRN-004 CanvasGridPan `dir right, pull 0.86`, 1.3 s | the same book, a later page | SFX-006 8.92 |
| 3 | B -> C | "All they have" (23.74) | TRN-011 PaperBandWipe `dir down, tone dark` | from the printed line to his words set large | SFX-021 cloth_slide 23.66 |
| 4 | C -> D | "That sounds" (32.16) | TRN-007 slide | out of the document; the objection | SFX-021 air_woosh 32.08; MUS-012 in |
| 5 | D -> E | "Each ray" (43.21) | TRN-004 `dir right, pull 0.86` | follow the light from the flower to whoever is looking | SFX-001 43.11 |
| 6 | E -> F | "So, on Newton's view" (50.25) | TRN-011 `dir up, tone dark` | up from the picture to the verdict | SFX-021 cloth_slide 50.17 |
| 7 | F -> G | "Newton has an answer" (64.47) | TRN-017 LensSettle `durSec 0.7, blur 14` | a cut to a real page | SFX-006 64.40 |
| 8 | G -> H | "A geranium sends back" (73.46) | TRN-007 slide | out of the document | MUS-011 sweep 73.30 |
| 9 | H -> I | "That also explains" (82.80) | TRN-006 PushThrough `focus [560, 430]` | the geranium grows into its own light | SFX-020 82.65 |
| 10 | I -> J | "And to most people" (94.68) | TRN-009 ShapeMorph `[140, 400, 560, 44, 6]` -> `[1202, 374, 250, 150, 10]`, 0.75 s, hold 1.0 | the geranium's candle mix becomes what most people call it | SFX-001 94.58 |
| 11 | J -> K | "Newton also gives" (103.61) | TRN-012 ColourBlockWipe `color #C8402F, side right` | Dalton's red floods out of its swatch; red is the first of the seven | SFX-024 103.50; MUS-013 in |
| 12 | K -> L | "And he spaces" (115.05) | TRN-015 `focus [622, 560]` | the seven names become his printed list (301 px, 43 px) | SFX-006 114.97 |
| 13 | L -> M | "Seven notes" (120.31) | TRN-007 slide | out of the document | SFX-006 120.23 |
| 14 | M -> N | "Here's why" (130.49) | TRN-017 `durSec 0.7, blur 14` | a cut to a real page | SFX-006 130.40; MUS-014 in |
| 15 | N -> O | "Colour is what happens" (144.19) | TRN-006 `focus [870, 700]` | "the theory of light" opens into light entering the eye | MUS-011 sweep 144.05 |
| - | O -> P | "But a guess" (156.01) | hard cut, same scene | closer on the guess | none |

Pauses: 0.00-2.70, 8.86-9.18, 23.09-24.39, 31.51-32.81, 42.74-43.68, 49.60-50.90, 64.00-64.94, 72.99-73.92, 82.15-83.45,
94.03-95.33, 102.96-104.26, 114.59-115.52, 119.66-120.96, 129.84-131.14, 143.54-144.84, 155.36-156.66.
Checks: TRN-015 2 of 16 changes (join, 12), not adjacent. TRN-017 2 of 15 (7, 14), not adjacent. TRN-007 four times
(1, 4, 8, 13), never two in a row. TRN-011 twice (3, 6). TRN-004 twice (2, 5; act max 4), not adjacent. TRN-006 twice
(9, 15). TRN-009 once, TRN-012 once. No TRN-013 (spent), no MUS-015 riser, no SFX-025 hit, no TRN-005 (its one left is
better kept for act 6).

---

## Limits

Act 5 use in beats (episode total after act 5 / limit). Raises are listed last.

| Asset | Act 5 use | Episode after act 5 | Verdict |
|---|---|---|---|
| VIS-015 PerspectiveGrid | 0 (the join is a still) | 37 / 37 | inside |
| VIS-011 ColourPathMap | 0 | 0 / 3 | not used (register: not mid-act) |
| VIS-001 ArchivalScanCard | A 2, B 5, G 4, L 2, N 5 = 18 beats, 49.3 s (29.6% of the act) | 83 beats | inside the 30% share |
| VIS-014 SpectrumStrip | A0 1, H 4, I 5 (overlay), K 4, M 4 = **18** | **28 / 20** | **raise to 28** |
| VIS-017 SwatchRows | J 3 | **13 / 12** | **raise to 13** |
| VIS-019 EyeDiagram | E 3, O 5, P 4 = **12** | **32 / 30** | **raise to 32** |
| VIS-021 RayParticles | D 2 (b14-15), E 3 (b16-18), O 3 (b57-59) = **8**, about 18.8 s | **24 / 20** | **raise to 24**; share: acts 1-4 about 39 s on screen + 18.8 s = about 58 s, under 5% only if the episode runs past about 1,160 s: acts 6-7 should use rays only if the total allows |
| VIS-059 LayerStage | I (1 shot) | act 1 of 4 | inside |
| VIS-060 StickerCutout | D 2, H 4 = 6 | act 6 / 12 | inside |
| TXT-024 KeywordChips | 5 panels (D, F, H, M, O); first chips 33.99, 52.80, 79.37, 123.51, 153.32 (gaps 18.8-44 s); 1 strike (H) | - | inside (8 per act, 1 per 15 s) |
| TXT-025 QuoteChips | C | act 1 / 3 | inside |
| TXT-011 DatelineTag | 0 (40 / 40) | 40 / 40 | none used: tags are Labels and card notes |
| LOK-027 PaperDesk | A, B, G, L, N = 49.3 s (29.6%), never 3 in a row | - | inside (~35%) |
| LOK-028 BlurPlate | C (p.90), F (Opticks title), M (p.92) | 3 per act | inside, at the limit |
| LOK-029 InsetGround | A0, D, K | 3 per act | inside, at the limit |
| TEX-008 ScreenStrokes | B, G, N | 3 per act | inside, at the limit |
| TEX-009 | 0 | 32 / 40 | not used |
| TRN-007 | 4 | **16 / 16** | inside, none left |
| TRN-011 | 2 | **14 / 14** | inside, none left |
| TRN-006 | 2 | 9 / 14 | inside |
| TRN-004 | 2 | act 2 / 4 | inside |
| TRN-015 / TRN-017 | 2 / 2 | 1 in 3 / 1 in 4 | inside |
| TRN-009 / TRN-012 | 1 / 1 | act 1 of 2 / 1 of 2 | inside |
| SFX-024 AirSwish | 1 (the block) | **30 / 30** | inside, none left |
| SFX-020 LowWhoosh | 1 (push 9) | **12 / 12** | inside, none left |
| SFX-021 AirClothWhoosh | 3 (bands 3, 6; slide 4) | **4 / 4** | inside, none left |
| SFX-001 SoftWhoosh | 3 (join 0.02, glide 5 at 43.11, morph 10 at 94.58) | 5 / 6 | inside, one left for act 6 |
| SFX-006 CardstockSlide | 6 (1, 2, 7, 12, 13, 14) | **10 / 10** | inside, none left |
| SFX-026 SoftPop | 2 (geranium 40.33, leaf 76.35) | 7 / 8 | inside |
| MUS-011 BedFilterSweep | 2 (8, 15) | 6 / 14 | inside |
| SFX-016 / SFX-028 paper | 0 | 10 / 10 shared | none left (register: paper 10 across both kits) |
| MUS | 007 under 0-32.56; 012 in 32.16; 010 break 100.70-103.03; 013 in 103.61; 014 in 130.49, alone 163.34-166.34 | - | as act5_cues_v1 |
| SRC-005 p.90 | B 5, C 3 = **8** | **8 / 6** | **raise to 8** |
| SRC-058 1672 letter | G 4 | **36 / 34** | **raise to 36** (not 40: p.3083 dropped) |
| SRC-063 NEW p.92 | L 2, M 4 (blur) | new row | propose max 6 |
| SRC-064 NEW title page | A 2, F 6 (blur) | new row | propose max 8; tag says the page names no author (fact-check 1) |
| SRC-001 Dalton p.29 | N 5 | 10 / 10 | inside, at the limit |
| SRC-003 Dalton p.43 | 0 (the guess is drawn and tagged) | 9 / 10 | inside |
| SRC-013 geranium | D 2, H 4, I 5 = **11** | **27 / 20** | **raise to 27** |
| SRC-014 laurel | H 3 (lands b30) | 14 / 14 | inside, at the limit |
| SRC-011 candle | I 4 (b34-37) | **16 / 14** | **raise to 16** |
| SRC-040 sky | I (1 shot, b33-34) | 1 / 3 shots | inside; counts to the VIS-016 footage share |
| SRC-049 / SRC-004 portraits | 0 | 6 / 6, 16 / 16 | not used |

**Raises Sam must approve:** VIS-014 20 -> 28; VIS-017 12 -> 13; VIS-019 30 -> 32; VIS-021 20 -> 24 (share watched);
SRC-005 6 -> 8; SRC-058 34 -> 36; SRC-013 20 -> 27; SRC-011 14 -> 16. New rows: SRC-063 (max 6), SRC-064 (max 8).
- Not raised, by design: VIS-015 (still join), VIS-011 (not used), paper foley (SFX-006 instead), TXT-011 (labels).
- After act 5 these are spent: TRN-007, TRN-011, SFX-024, SFX-020, SFX-021, SFX-006 (SFX-001 has one left). Acts 6-7 will
  need sound raises before their briefs.

**Ground share:** graphite 47.5 s (28.5%: E, H, J, O, P); desk 49.3 s (29.6%); blur 32.8 s (19.7%, 3 shots); inset 24.9 s
(15.0%, 3 shots); LayerStage footage 11.9 s (7.1%). Five grounds; no ground three shots running (A-B desk and O-P
graphite are the only pairs).

---

## Builder additions

1. **Episode `joinFrom {still}`** for the act join: a PNG of act 4's last frame (rendered from the locked act 4 at
   215.67 s) used as the frozen `prev` of beat 1, so `transitionIn: "match"` works across the act boundary. No VIS-015
   beat is rendered.
2. **SpectrumStrip options:** `ticks: false` (no nm numbers), `feather: true` (soft top and bottom edges, fading ends),
   `reverse: true` (red on the left), `title {text, atSec, x, y, size 76}` rising and wiping in on its own cue.
3. **SpectrumStrip `rows` mode** (H, and I through `overlay.spectrum`): labelled strips at given `x, y, w, h`, each with
   `atSec` (draws left to right 0.9 s), `label` (mono 22, above, own `labelAtSec`), and `profile: [[nm, weight 0-1],
   ...]` drawn as brightness along the strip (no numbers shown); optional `mark {fromNm, toNm, text, atSec}` (a bracket
   over a span with a mono label beside it).
4. **SpectrumStrip `divisions` mode** (K, M): `fractions` (seven, summing to 1), `names` with cues, each segment filled
   with its named colour and blended about ±20 px at the boundaries; `dividersAtSec` (ink, 0.08 s stagger); `query
   {segment, atSec}` (that segment's dividers turn dashed, a `?` in accent under its name); `chord {atSec, notesAtSec,
   tiesAtSec, y}` (an ink string with bridges at the boundaries, seven note heads at segment centres, ties down to the
   band).
5. **Episode overlay `rays`**: RayParticles (VIS-021) along a polyline in frame px over any component: `path`, `atSec`,
   `untilSec`, `speed`, `count`, `size`, `jitter`, `color`, optional `stroke`; several per shot (D, E). Counted as VIS-021
   on the beats it shows; 40 dots on screen at most across all of them.
6. **ArchivalScanCard callout `keep: Rect[]`**: boxes that stay bright under the callout without a highlight (B's line on
   "sentence").
7. **EyeDiagram plate:** `PlateCaption.swatch` (a filled square in a data colour before the caption, E); `zoom {scale,
   focus}` (a fixed closer framing, P); `cutLine {atSec, drawSec}` (a dashed accent line across the globe at x = centre +
   0.35 R, P).
8. **TRN-009 ShapeMorph** from a strip in a LayerStage overlay into a SwatchRows cell: confirm both shapes are measured on
   the stills (I's bottom strip, J's row 1 BY CANDLE outline present from frame 0).
9. Confirm **overlay chips and stickers render over SpectrumStrip and KeywordPanel on an inset ground** (D, H, M), and
   that KeywordChips `dimSec` and `inkStrike` work in one panel (F, H, M).

---

## For the fact-check

Every on-screen string, exactly as it will appear (printed quotes as printed, long s shown as s), with its beat.

**Titles, tags, labels**
- b1: `5 · THE RAYS`
- b2-3: note `1672 → 1704 · 32 YEARS`; source `ISAAC NEWTON · OPTICKS · LONDON, 1704`; title column "Opticks: or, a Treatise of the Reflexions, Refractions, Inflexions and Colours of Light"
- b4-8: source `ISAAC NEWTON · OPTICKS · 1704 · P. 90`; notes `P. 90`, `IN PLAIN WORDS`, `THE RAYS HAVE NO COLOUR`
- b9-11: source chip `ISAAC NEWTON · OPTICKS · 1704 · P. 90`
- b12-15: `MANY KINDS OF RAY`, `ISN'T PINK`, `PHOTO TODAY · D. J. STANG, CC BY-SA 4.0`, `ILLUSTRATION · RAYS DRAWN WITHOUT COLOUR`
- b16-18: `THE EYE · SIMPLIFIED`, `Retina`, `seen as pink` (with a #E79AB9 swatch), `A KIND OF PUSH`, `ILLUSTRATION`
- b19-24: `ISAAC NEWTON · OPTICKS, 1704`
- b25-28: source `ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672 · P. 3084`; note `CAMBRIDGE · FEB 1672`
- b29-32: `DAYLIGHT`, `SENT BACK` (x2), `PHOTO TODAY · D. J. STANG, CC BY-SA 4.0`, `PHOTO TODAY · RUNIC EARTH`, `ILLUSTRATION · SIMPLIFIED, NOT MEASURED`
- b33-37: `TODAY · DAYLIGHT`, `TODAY · CANDLELIGHT`, `PHOTO D. J. STANG, CC BY-SA 4.0 (CUT OUT)`, `DAYLIGHT`, `CANDLELIGHT`, `FAR LESS BLUE`, `THE GERANIUM'S MIX, BY CANDLE`, `ILLUSTRATION · NOT MEASURED`
- b38-40: `BY DAY`, `BY CANDLE`, `MOST PEOPLE` (`PINK`, `PINK`, `NO REAL CHANGE`), `DALTON` (`SKY-BLUE`, `RED`), `REPORTED COLOURS · DALTON 1798, PP. 29-30`
- b41-44: `RED`, `ORANGE`, `YELLOW`, `GREEN`, `BLUE`, `INDIGO`, `VIOLET`; `ILLUSTRATION · AFTER NEWTON, OPTICKS, 1704`
- b45-46: source `ISAAC NEWTON · OPTICKS · 1704 · P. 92`
- b47-50: `ILLUSTRATION · AFTER OPTICKS, 1704, P. 92`; `?`
- b51-55: source `JOHN DALTON · 1798 · P. 29`; notes `ON NEWTON'S TERMS`, `HIS IDEA MAKES GOOD SENSE`
- b56-60: `THE EYE · SIMPLIFIED`, `Cornea`, `Lens`, `Retina`, `Vitreous humour`, `DALTON'S GUESS · A BLUE VITREOUS`; legend `ILLUSTRATION` / `DOTS: NEWTON'S RED-, GREEN-` / `AND BLUE-MAKING RAYS`
- b61-64: `Vitreous humour`, `DALTON'S GUESS · A BLUE VITREOUS`

**Chips (spoken words only)**
- D b12-13: `clashes with the prism`, `It doesn't.`
- F b20-24: `isn't really in the flower`, `isn't in the light either`, `where the light meets a person`, `a geranium and a leaf`, `still look different`
- H b31-32: `painting the light` (struck), `choosing from it`
- M b48-49: `It's tidy.`, `a little too tidy`
- O b60: `change the rays`, `change the colour`
- C b10-11 (TXT-025, verbatim): "a certain power and disposition to stir up a sensation of this or that Colour"

**Highlights (page words as printed) and quote columns**
- Title page b2-3: "MDCCIV"; "LONDON,"; "OPTICKS:"
- p.90 b5: line kept bright "For the rays to fpeak properly are not coloured."; b6: "For the rays to fpeak properly" / "are not coloured."; quote "For the rays to speak properly are not coloured."
- p.3084 b27: "the Colours of all natural Bodies" / "have no other origin than this,"; b27-28: "that they are varioufly qualified to" / "reflect one fort of light in greater plenty then another,"; quote "variously qualified to reflect one sort of light in greater plenty then another"
- p.92 b45: "( red, orange, yellow, green, blue, indico, violet )" (on the cut); "divided after the manner of a mufical Chord."; b46: "1, 8/9, 5/6, 3/4, 2/3, 3/5, 9/16, 1/2"; quote "divided after the manner of a musical Chord"
- p.29 b52: "application to the sciences, that" / "of optics necessarily claimed attention;"; b53-54: "pretty well acquainted with the theory of light and co-" / "lours"; quote "pretty well acquainted with the theory of light and colours"

**Points for the fact-checker to rule on**
1. The 1704 *Opticks* title page names no author (the first edition appeared without his name; check the Advertisement's
   "I. N."). The source tag adds ISAAC NEWTON; confirm that is acceptable. The handwriting above the title (an owner's
   inscription) is cropped out.
2. `1672 → 1704 · 32 YEARS` for "more than 30 years later" (the 1672 letter to the 1704 book).
3. **Band widths (K, M)** from p.92: GM produced to X with MX = GM, and GX, λX, ιX, ηX, εX, γX, αX, MX in proportion
   1, 8/9, 5/6, 3/4, 2/3, 3/5, 9/16, 1/2. The intervals Mα, αγ, γε, εη, ηι, ιλ, λG (red, orange, yellow, green, blue,
   indigo, violet) are then 1/16, 3/80, 1/15, 1/12, 1/12, 1/18, 1/9 of GX, so 1/8, 3/40, 2/15, 1/6, 1/6, 1/9, 2/9 of the
   band. Confirm the order (M is the red end, G the violet end) and the arithmetic. No numbers appear on the bands.
4. The string in M is divided at the same points as the bands; it does not show which colour is the low note (by p.92's
   geometry the violet end G takes the whole chord, the red end M its octave), so no pitch order is drawn.
5. "seen as pink" (E) is anchored at the back of the eye where the rays land; the sensation is the looker's (p.90 goes on
   to "the Sensorium"). Confirm the leader does not read as "the retina turns pink"; if it does, anchor it to the optic
   nerve.
6. The geranium and leaf "sent back" shapes (H, I) and the candle ramp are illustrative (tagged NOT MEASURED): a pink
   petal returns most at the red end, little in the green, some in the blue-violet; a leaf most in the green.
7. "Candlelight is much yellower than daylight, with far less blue": shown only as a ramp, no numbers.
8. Dalton by day "almost an exact sky-blue", by candle "red" (1798 pp. 29-30); act 1's hexes reused; MOST PEOPLE pink
   by day and by candle ("still call it pink").
9. The legend uses p.90's own terms ("red-making ... green-making, blue-making"; the page prints "red-makng").
10. `DALTON'S GUESS · A BLUE VITREOUS` (1798 p.43) arrives with the tint in O and stays in P; the tint is never untagged.
11. `then another` as printed (for "than").
12. P's dashed line marks where an eye would be opened; it is not a record of the 1844 examination.
13. `CAMBRIDGE · FEB 1672`: the letter is dated from Cambridge, Febr. 6. 1671/72 (as act 4).

---

## Questions for Sam
1. Raises: VIS-014 to 28, VIS-017 to 13, VIS-019 to 32, VIS-021 to 24, SRC-005 to 8, SRC-058 to 36, SRC-013 to 27, SRC-011
   to 16; new rows SRC-063 (6) and SRC-064 (8). OK?
2. The act join matches from a still of act 4's last frame (Builder 1). Does that still count against VIS-015? If you
   prefer a live room frame instead, VIS-015 needs 38.
3. Paper foley: the register caps paper at 10 across SFX-016 and the Pixabay kit, so no paper files are free; pages ride
   on SFX-006 CardstockSlide. Raise the shared paper cap if you want page foley in acts 5-7.
4. From K on, named bands run red on the left (as act 3's six bands); A0 keeps act 4's violet-left band for the match.
   OK?
5. P's dashed "open it" line across the eye: keep, or end on the tinted eye alone?
6. RayParticles will sit near its 5% share after this act (about 58 s); acts 6-7 may need to go without rays.

---

## Applied after fact-check 2 and the Expert (Claude, 25 Nov 2026; written into gate1_act5/beats_act5.py)
Fact-check 2 (`gate1_act5_onscreen_factcheck.md`): 39 PASS, 8 FIX, 2 CHECK. Expert (`expert/ep01-act05_gate1_expert.md`): 0 MUST, 5 SHOULD, 5 TASTE.
1. D b15: outgoing dots white but a different mix, counts 5 / 2 / 5 (FC 15, Expert S1).
2. D, H sticker tags: `PHOTO TODAY · D. J. STANG, CC BY-SA 4.0 · CUT OUT` (FC 16).
3. E b18: `seen as pink` leader to the optic nerve, anchor [1595, 632] (FC 18, Expert S2).
4. G b27: H2 string ends "another." with the printed full stop (FC 22).
5. I b35-37: candle strip = ~1,900 K flame in linear light, profile [[400,0.01],[450,0.025],[500,0.07],[550,0.17],[600,0.36],[650,0.63],[700,1]]; the geranium-by-candle strip = petal profile x this (FC 29, Expert S3; the floor kept just above zero so the strip's edge shows).
6. M b47: notes on the stops between colours (x 1710, 1376.7, 1210, 960, 710, 510, 397.5; hollow at 210), string off the left edge, no ties; the segments brighten one by one on "colours" (Expert S4, FC CHECK 38).
7. O b57: legend `ILLUSTRATION` / `DOTS: 3 OF NEWTON'S MANY KINDS` / `RED-, GREEN-, BLUE-MAKING` (Expert S5).
8. P: `ILLUSTRATION` (120, 960) held through P so the dashed line is not read as Ransome's 1844 cut (FC 48). Act 6 brief: show Ransome's real cuts.
9. FC 39: the two M chips are both in b48. FC 24: SRC-058 gets p.3084 in its file list, description and Drive copy at Gate 2 (with the raise if Sam approves). FC 49: raises go to Sam.
TASTE not taken (for Sam if he wants): Newton's p.90 bell analogy for the "push"; p.92's assistant "whose Eyes for distinguishing Colours were more critical than mine"; Newton's blue ≈ our cyan; a leaf reflects most in the near-infrared; `· 1798, P. 43` on the guess tag.
