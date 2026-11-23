"""WCL-E01 act 3 'The talk': Gate 1 beat sheet rows (beat sheet rows 109-185) from act3_cuts.json.
Shots follow the act 3 plan, the Director's brief (director/ep01-act03_brief.md, incl. its transition review), the
on-screen fact-check (gate1_act3_onscreen_factcheck.md), the cue sheet (act3_cues_v2.json) and the independent Gate 1 review (v2).
Each shot's IDs and note are set once; every beat in it gets its own note line; per-beat columns sit in VIS/TXT/SRC/SFX/MAP/NEW."""
import json, re
C = json.load(open("act3_cuts.json"))


def spoken(t):
    t = t.replace("October, 1794.", "October, seventeen ninety-four.").replace("He's 28.", "He's twenty-eight.")
    t = t.replace("the society.", "the Society.").replace("Philosophical Society", "Philosophical Society")
    t = t.replace("Its title is Extraordinary Facts", 'Its title is "Extraordinary facts').replace("relating to the vision of colours.", 'relating to the vision of colours".')
    t = t.replace("sealing wax", "sealing-wax").replace("looks to him little more than a shade or defect", 'looks to him "little more than a shade, or defect')
    t = t.replace("of light, almost no light at all.", 'of light". Almost no light at all.')
    t = t.replace("he sees two or at most three, yellow and", "he sees two, or at most three. Yellow and").replace("blue or yellow, blue and purple.", "blue. Or yellow, blue and purple.")
    t = t.replace("In his words, probably some modification of", 'In his words, "probably some modification of').replace("blue. So, some kind of blue.", 'blue". So, some kind of blue.')
    t = t.replace("Otherwise, he writes, I", '"Otherwise," he writes, "I').replace("which has not been done. In", 'which has not been done." In')
    t = t.replace("And honestly,", "And honestly?").replace("prism too.", "prism, too.").replace("jelly too.", "jelly, too.")
    t = t.replace("strongly expressed wish.", '"strongly expressed wish".').replace("Here, humour", 'Here, "humour"')
    t = t.replace("Here, ", "Here, ")
    return t



L = "LOK-009, LOK-010"
# v3 (24 Nov 2026): Sam's "Try doing all 3" (layer shots A world swap, S prism world, H wish over portrait) and
# "Blend into E01 from act 3" (Within Motion devices TXT-024/025, VIS-060/061, MAP-017), placed by the Director in
# director/ep01-act03_brief.md ("Added layer shots" and "Within Motion blend"). W9 (blue glass) is dropped: no free
# picture of plain blue glass was found, so C keeps v2's tint pulse. The eye model's tag carries no date ("possibly
# 19th century" in its record; on-screen fact-check addendum, row 13).
# v2 (23 Nov 2026), after the independent Gate 1 review: notes follow the Director's brief word cue by word cue; labels that
# only repeat the narration are cut; each asset is tagged only on the beats where it is on screen; sounds moved to their
# register uses. Two beat edges moved (BOUNDS): the olive's label needs time before the glide, and the hard cut sits in
# the measured silence after "should." (102.05-103.2 s), with the hit and cue 3 on the same frame.
BOUNDS = {28: (None, 74.50), 29: (74.50, None), 38: (None, 102.10), 39: (102.10, None)}

# (first beat, last beat, visual, text, motion, transition-in, music, shot note, per-beat notes)
S = [
 (1, 1, "VIS-007", "TXT-009, TXT-010", "MOT-002", "TRN-001", "MUS-007",
  "Calm. Chapter slate 3 · THE TALK. No narration: the music plays alone (cue 1, Wholesome carried on from act 2, about 8 dB louder than under the voice: -26 against -34 LUFS on the cue sheet, Harris rule D).",
  ["Slate fades up; title locks; cue 1 alone."]),
 (2, 12, "VIS-059", "TXT-011, TXT-010", "MOT-016, MOT-013, MOT-014", "TRN-001", "MUS-007",
  "Calm. Director shot A_manchester_talk + A_worldswap_chapel. LayerStage world 1 = Green's 1794 plan of Manchester (same place, same year), zoom 1.1, focus [0.4769, 0.37], haze 0.06, light 'paper' (fallback 'none'), lightFrom top-left, no rack; world 2 (from 'Literary', 26.29) = Cross Street Chapel as in 1835 (SRC-044, the building where the Society met; zoom 1.0, focus [0.47, 0.5], haze 0.12, rack 1.8 px on 'paper'). One slow move {pan -40, push 0.03} for the whole shot. NO PIN. Labels un-wipe (MOT-013). Keyword chips (TXT-024) are lowercase Fraunces 600 on paper chips, the key word on the one accent chip, silent.",
  ["Plan fades in under the slate (0.6 s); world label PLAN OF MANCHESTER · WILLIAM GREEN · 1794 bottom-right; the camera's one slow move begins. Chips (W1): 'question' (white) at (160, 400) on 'question' (3.42), then a drawn arrow down-right and 'experts' (accent) at (260, 500) on 'experts' (4.14), over the plan's west streets, away from the college; both un-wipe from 6.9.",
   "Dateline part 1 MANCHESTER arrives low-centre (960, 860) on 'Manchester' (5.56), clear of the chips.",
   "Part 2 · 31 OCT 1794 arrives on 'October'; the dateline eases to the top-left corner (120, 84) at 9.0, in the pause after '1794.', so the map scrap arrives alone.",
   "Map scrap (W2, MAP-017 on SRC-045: a torn piece of Kitchin's 1794 map, LayerStage carry w 520 at [440, 560], tilted -4°) rises on 'moved' (10.22); a straight line KENDAL → MANCHESTER draws 10.42-11.24 and a hand-drawn circle lands on Manchester on 'before' (11.24); mono chips KENDAL, MANCHESTER and the source chip KITCHIN · LAURIE & WHITTLE · 1794. No date for the move on screen; never a road. Silent.",
   "Label AGE 28 at (1280, 490), under where the college will be ringed, on 'twenty-eight' (clear of the scrap, x 180-700).",
   "Label TUTOR · MATHEMATICS AND NATURAL PHILOSOPHY at y 536 on 'mathematics'.",
   "The scrap sinks away (the rise reversed, 0.6 s) from 17.4, before 'That's the old name' (17.51); the camera carries on towards the college.",
   "Ring (MAP-008, centre (1280, 307), r 125, drawn inside the far plane) round the plan's own 'Academy' building on 'college', pencil line SFX-017 at -29 dB; NEW COLLEGE (accent settle, MOT-014) lands above it at (1280, 135) on 'New College'.",
   "AGE 28 and TUTOR un-wipe on 'Tonight' (24.01); NEW COLLEGE and the ring 0.3 s later (24.31); all gone by about 25.2, before the swap.",
   "WorldSwap (TRN-018, dissolve 1.2 s) from the plan to Cross Street Chapel as in 1835 on 'Literary' (26.29); the dateline (untilSec 26.29) and the plan's label un-wipe with it; CROSS STREET CHAPEL · AS IN 1835 at (120, 84), size 22, at 27.2 (no label says the drawing shows 1794).",
   "THE SOCIETY MET IN A ROOM HERE UNTIL 1799 at (120, 133) on 'Society' (27.43). Page (p.28 page-only cut-out, w 500) rises on 'paper' (28.95) and lands lifted at frame x 150-665, top 831 (at [464, 1106]), its bottom off frame, 60 px clear of the door surround and 55 px under the lower-left window, shadow down-right; blur racks in on the chapel (1.8 px); paper SFX-016 at -24 dB on its settle, in the pause; both labels un-wipe at 29.25."]),
 (13, 16, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-015", "MUS-007",
  "Calm. Director A2_title_match: TRN-015 focus match from the held page's title (focus [408, 908]) into the p.28 card (side left, crop [700, 160, 1000, 960]); ground = the chapel blurred (LOK-028 38 px, brightness 0.42: SRC-044, Sam's decision: see New_Assets), so the drawing simply goes soft behind the paper. Source tag JOHN DALTON · 1798 · P. 28; quote column: Extraordinary Facts relating to the Vision of Colours: with Observations (no quote marks). Highlights in reading order.",
  ["Focus match on 'Its title is', swish SFX-024 in the pause before 'Its'; highlight EXTRAORDINARY FACTS on 'Extraordinary'.",
   "Highlight Vision of Colours: on 'vision'.",
   "Chips (W3): 'his own' (white) on 'his' (36.08) and 'eyes' (accent) on 'eyes' (36.48), one row in the card's right column at y 700 (x 1106-1419 and 1435-1629), about 75 px under the source tag, off the page.",
   "Highlight READ OCT. 31ST, 1794. on 'first paper'."]),
 (17, 20, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-004", "MUS-007",
  "Calm. TRN-004 canvas glide, dir right, pull 0.86: page 28 to page 34 along one drafting sheet (two pages of the same paper). p.34 card (side left, crop [470, 600, 1300, 1290]), source tag JOHN DALTON · 1798 · P. 34; held at least 4 s, no scrolling.",
  ["The glide carries p.28 and the W3 chips off and p.34 in on 'a careful paper', a quiet paper slide SFX-016 at -26 dB under it.",
   "Nothing new: the card holds.",
   "Highlight ORANGE & YELLOW. on 'lists', then GREEN. on 'one by one' (two sweeps in reading order, one shot hero each).",
   "Highlight the laurel line ('face of a laurel-leaf ... is a good') on 'examples'; it ends at about (620, 598), the point B pushes from."]),
 (21, 28, "VIS-059", "TXT-010", "MOT-016, MOT-013", "TRN-006", "MUS-012",
  "Calm. Director B_leaf_and_wax: TRN-006 push from the p.34 laurel line. World = p.34 itself, framed on the laurel sentence (zoom 1.15, focus [0.538, 0.4797], haze 0.08, light 'paper', lightFrom top-left), world label JOHN DALTON · 1798 · P. 34. The printed sentence is the on-screen quote (world highlights H1-H3; no typed copy). Leaf (330, 360) and wax (330, 690) rise in the margin BESIDE their words, lifted; the sealed letter is the third and last carried thing (B at its carry limit of 3). Caption (bottom-left, static) PHOTOS TODAY · CHERRY LAUREL, RUNIC EARTH · WAX SEAL, PETRIK from the push until 0.6 s before the glide. Cue 2 enters in the pause before 'Here's one'.",
  ["Push lands on the laurel sentence with H1 'The' and H2 'face of a laurel-leaf (Prunus Lauro-cerasus) is a good' lit from frame 0; low whoosh SFX-020 in the pause before 'Here's one'; cue 2 enters; the caption comes in with the world.",
   "Leaf rises on 'leaf' and lands at (330, 360), soft pop SFX-026 on its settle in the comma pause (the shot's one pop); then H3 'match to a stick of red sealing-wax' on 'match' (reading order).",
   "Wax seal rises on 'sealing' and lands at (330, 690), no pop.",
   "State label A WAX SEAL · TODAY under the wax on 'wax' (59.88; it is never called a stick). The sealed letter (W4, VIS-061 on SRC-046, a layer cut-out carry[2], w 360) rises from 'used' (60.60) and lands on 'seal letters' (61.5) at about x 1255-1620, y 650-890, over the page's lower, unhighlighted lines, 90 px under H3; tag A SEALED LETTER · 1841 under it (mono 20); silent (SFX-016 is at its episode limit of 10).",
   "The letter and its tag sink away 62.45-63.05, before 'Think'; blur racks in on the page (2 px) on 'Think': the two things are now the subject. Chip (W5) 'green' (white) at y 640, x 1160-1410, on 'green' (65.08), on the blurred page's lower lines where the letter was.",
   "Chip 'red' (white) at x 1430-1600 on 'red' (66.36), 84 px clear of the highlights.",
   "Chip 'to you' (accent) row 2 at y 750, x 1160-1440, on 'To you' (68.84); all three chips un-wipe from 71.0, so the olive lands on a clean frame (the chips say 'to you', the olive pair shows 'to him').",
   "Both turn the same olive (#574F18, simulated) in the pause after 'get.' (about 71.65 s), the wax label un-wiping with it; label SIMULATION · ONE WAY / HE MAY HAVE SEEN THEM (x 120, y 830/868, size 22) on 'To him' (72.06 s, about 1.8 s to read); that label and the caption un-wipe 0.6 s before the glide."]),
 (29, 38, "VIS-059, VIS-014", "TXT-010", "MOT-016", "TRN-004", "MUS-012",
  "Calm. Director S_prism_world: TRN-004 canvas glide, dir down, pull 0.86 (the next card on the same sheet), silent under cue 2; the photo arrives already in place. LayerStage world = SRC-043, a glass prism today throwing colours on a paper backdrop (zoom 1.1, focus [0.5, 0.642], haze 0.12, dim 0.15, no camera pan, push 0.03), world label PHOTO TODAY · A GLASS PRISM · EVIE S. / UNSPLASH bottom-right. Overlay plane: two SpectrumStrips (VIS-014 two-track mode): top OTHERS · DALTON'S SIX (red, orange, yellow, green, blue, purple) at x 210-1710, y 470-566; lower DALTON'S WORDS, an opaque panel while empty (red end dim, not black; one yellow fading strong to pale under orange, yellow and green; blue under blue; a darker blue under purple). No headline title. Never a beam into the prism or a fan out of it. Cue 2 drops out in the pause after 'purple.'; the riser (MUS-015) builds under beat 38.",
  ["The glide lands on the photo alone (the prism top centre, its tag); track chip OTHERS · DALTON'S SIX at (210, 408), size 22, on 'describes' (74.74), bringing the eye back to x 210.",
   "The whole prism shows on 'A prism' (78.23); the top strip draws left to right from x 210 on 'triangular' (78.97, 1.4 s), over the prism's base (the base line and back corner inside the strip, no edge lined up).",
   "Top strip complete on 'throws colours' (80.37).",
   "World racks on 'others' (82.93): blur 3 px and dim 0.55 over 0.8 s. The lower track (opaque, empty) appears, with the DALTON'S WORDS chip at (210, 714).",
   "Quote chips (W6, TXT-025, verbatim as spoken) land word by word from 'little' (85.69) to 'light' (88.35): row 1 'little more than a shade,' at (210, 760), row 2 'or defect of light' at (210, 828), source chip DALTON · 1798 · P. 31 at about (720, 840), all under the red end, ending by y 890 (music near-silent under the quote).",
   "Lower red end fills dim (not black) on 'Almost' (89.03), against the opaque track; the photo's red behind it is already dark.",
   "Nothing new: the top strip's six hold on 'six colours'.",
   "Quote chips un-wipe at 92.9; the count 'I see only two or at most three distinctions' types in their place on 'two' (93.47), the source chip held; then, in reading order at the end of the beat, one yellow fills strong to pale under orange, yellow and green on 'Yellow' (95.43).",
   "Blue under blue (96.05), then a darker blue under purple (98.53); cue 2 out in the pause after 'purple.'.",
   "The world label un-wipes and the photo fades to the canvas from 'Then' (100.17-101.37, blur to 4 px); the strips, track chips and count alone on the canvas under the riser's peak; hard cut at 102.10."]),
 (39, 48, "VIS-019", "TXT-010", "MOT-002", "TRN-001", "MUS-013",
  "Calm. Director D_into_the_eye: the act's ONE hard cut, at 102.10 s on the hit (SFX-025) in the measured silence after 'should.' (102.05-103.2 s); cue 3 (a low held drone) enters on the same frame. Canvas to canvas: the strips' centre (960, 518) cuts onto the eye's centre (960, 540) and the strip's left end onto the beam's start at x 210. EyeDiagram section on the theme canvas. Music about 27 dB under the voice (explanation level). No device on the impact.",
  ["Hard cut, hit and cue 3 on one frame; the cross-section draws in (0.9 s) on 'explanation'.",
   "Nothing new: the section holds on 'isn't hollow'.",
   "The fluids (aqueous and vitreous) outlined on 'clear fluids' (EyeDiagram builder addition: a part outline on cue).",
   "The outline narrows to the vitreous alone on 'clear jelly'.",
   "Label VITREOUS HUMOUR at (1000, 480) on 'vitreous humour'.",
   "An accent underline swipes under HUMOUR (W7, 0.35 s) on 'humour' (114.83); no new words; it leaves with the label.",
   "Beam (VIS-021) draws from x 210 to x 1280 along y 540 on 'Light passes' (1.4 s), silent; the bed thins.",
   "The beam reaches the back of the eye; corner tag DALTON'S GUESS on 'Dalton's guess' (it stays on while the jelly is blue).",
   "Chip (W8) 'clear' (white) at (160, 250), left of the eye circle and 166 px under the DALTON'S GUESS tag, on 'isn't' (124.81).",
   "The accent strike swipes across 'clear' on 'clear.' (125.27); the jelly tints blue (#3D6BD6, 50%, 1.2 s) on 'It's' (126.59); an arrow draws down and 'tinted' (accent) lands at (160, 350) on 'tinted' (127.11), complete before the wipe, which carries the chips off at 128.08."]),
 (49, 51, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-002", "MUS-013",
  "Calm. TRN-002 drafting wipe, angle 8, dir right, into the p.43 card (side left, crop [180, 900, 1080, 1040]), source tag JOHN DALTON · 1798 · P. 43; highlights across the hyphenated line breaks; quote column 'probably some modification of blue' in near-silence.",
  ["J-cut: the page sound SFX-006 leads 0.5 s, then the drafting line (ink SFX-017 under the stroke) on 'In his words'; highlight 'probably some modi-' on 'probably' (music near-silent under the quote).",
   "Highlight 'fication of blue.' on 'blue' (131.28); nothing else new on 'So, some kind of blue'.",
   "Highlights 'I suppose it must be the', 'vitreous' (its own box, for the ink point and the morph) and 'humour;' on 'supposes'."]),
 (52, 60, "VIS-019", "TXT-010", "MOT-002", "TRN-005", "MUS-013",
  "Calm. Director C_carry_into_eye: TRN-005 ink bleed in the jelly's blue (#3D6BD6) from [894, 303] (the word 'vitreous', inside the jelly in this framing), cued on 'And'; it opens on D's exact framing, jelly already blue, tag DALTON'S GUESS in the corner throughout. The leaf and the wax come back as stickers (VIS-060: white edge, calm pop, resting tilt) on the left (the light's side), carried inside the diagram's drift; under his blue they go darker, duller and closer, but stay two colours; the blue state applies inside the photos only, the white edges stay white. NO olive inside his guess (fact-check item 8).",
  ["Blue ink spreads from 'vitreous' into the eye on 'And honestly' (silent: SFX-017 is for lines on paper).",
   "Nothing new on 'it makes sense'.",
   "The blue jelly brightens a little and settles back (tint 0.5 -> 0.6 -> 0.5, 1.2 s) on 'blue glass': no label, the blue is the picture (the blue-glass object, W9, is dropped: no free picture found).",
   "Rays (VIS-021: red, green, blue) start from x 210 on 'In Dalton's version'; red and green fade to about 30% in the jelly (path 0.55-0.75) on 'soaks up'; blue passes.",
   "Nothing new: the thinned red and green hold.",
   "The thinned beam reaches the back of the eye; the leaf sticker (w 180) pops at 152.72 and settles at (300, 380), resting tilt -3°; the wax sticker (w 140) pops at 153.10 (one entrance at a time) and settles at (300, 700), resting +2°, the beam starting between them; soft pop SFX-026 at -26 dB on the wax's settle (about 153.7), both settled before 'Reds'.",
   "Both darken under the jelly's blue (multiply, inside the photos) and move closer, to (300, 440) and (300, 645), on 'duller': still two colours.",
   "Label HIS IDEA: / DULLER, AND MORE ALIKE (x 120, y 790/830, size 22) 0.5 s after 'other.'.",
   "Nothing new on 'might end up looking like a leaf'; the label un-wipes 0.6 s before the slide."]),
 (61, 66, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-007", "MUS-013",
  "Calm. TRN-007 slide back into the same p.43 card, landing in the same place with the earlier highlights lit. The music drops to near-silence under the quote (about 45 dB under the voice) and returns in the pause after 'done.'.",
  ["Slide in on 'He has a reason', SFX-024 at the slide.",
   "Music near-silent from here; highlight 'otherwise I apprehend it might be disco-' on 'Otherwise'.",
   "Nothing new: the line is read.",
   "Highlight 'vered by inspection, which has not been done.' on 'has not been done'; the music returns in the pause after 'done.'.",
   "The other highlights dim to 40% on 'anywhere' (173.76); the 'vitreous' box alone stays lit, ready to lift.",
   "Nothing new on 'would have been noticed by now'."]),
 (67, 68, "VIS-019", "TXT-010", "MOT-002", "TRN-009", "MUS-013",
  "Calm. TRN-009 shape morph: the 'vitreous' highlight box [832, 285, 123, 37, 3] lifts off and becomes the IRIS [848, 434, 224, 224, 112] of EyeDiagram mode simple, centred (960, 540). The deadpan: the music drops to silence from the pause after 'eye.' through the pause after 'two.'; the eye closes once (one close, no reopen), its close keyed 0.30 s before the shot ends.",
  ["Morph lands on the iris on 'So the only way' (about 178.0); soft pop SFX-026 on the landing (this shot's one). The eye model (W11, VIS-061 + VIS-060 sticker on SRC-047, the Wellcome ivory model that comes apart, w 320 at (1600, 520), 100 px right of the simple eye) pops on 'open' (180.28), settled by 'eye.' (180.88); tag A MODEL OF AN EYE · WELLCOME COLLECTION under it at y about 720 (no date: the record says only 'possibly 19th century'). Silent.",
   "Music silent; chips (W12) 'only' (white) on 'only' (182.25) and 'two' (accent) on 'two.' (182.85), one row at y 490, x 160-360 and 376-540; the lid starts to close at the end (from about 183.52), the one moving thing into the cut; the model and chips leave with the frame."]),
 (69, 72, "VIS-059", "TXT-010", "MOT-016", "TRN-010", "MUS-014",
  "Calm. Director H_wish_over_portrait. TRN-010 cut on action, dir down, px 90 (the move done by LayerStage arrive, 0.45 s): the closing lid carries onto the viewer's-left lens of his spectacles in the 1834 mezzotint (SRC-004, zoom 1.0, focus [0.47, 0.32], haze 0.10, light 'none', lightFrom top-left), lens at (854, 516); world label JOHN DALTON · 1834 bottom-right from frame 0. Camera {pan -30, push 0.02}. Cue 4 enters in the same pause. His face is never animated (no glint, no mask, no push at the face) and never covered.",
  ["The cut lands on the lens; the portrait settles from 90 px above. The Henry strip (henry1854_p25_wish_line.png, re-cut [85, 1124, 1850, 170], w 1440) rises 140 px on 'exactly' (186.15) and settles lifted in the pause after 'that.' at frame x 151-1597, y 807-939, 56 px under his chin; the 'not, however, verified' and 'pale yellow' lines never show.",
   "Tag W. C. HENRY · 1854 · P. 25 at (160, 746), size 22, on the strip's settle (187.05). H1 'carefully made after Dalton's death' (strip box [710, 20, 1112, 52]) on 'after' (189.41).",
   "The world racks to 1.5 px on 'His biographer' (191.31); no label for him (the tag names him).",
   "H2 'his strongly expressed wish' (strip box [598, 102, 822, 54]) on 'strongly' (192.81; music near-silent under the quote); the Henry tag un-wipes at 194.45; the portrait's tag stays until the band covers it."]),
 (73, 75, "TXT-024", "TXT-024", "MOT-002", "TRN-011", "MUS-014",
  "Calm. TRN-011 paper band (dark, up) into the new question, covering the portrait's tag first. Keyword chips (W13, TXT-024, replacing the KineticLine) left-aligned at x 120: row 1 'what is' (white) + 'colour?' (accent) at y 470, row 2 'one man' (white) at y 590; never a whole spoken line.",
  ["Band wipes up on 'But', SFX-024; the dark ground holds.",
   "Chips 'what is' on 'what' (198.53) and 'colour?' on 'colour' (198.83).",
   "Chip 'one man' on 'one' (202.34); blurred away by the focus match at 203.00."]),
 (76, 77, "VIS-015", "TXT-010", "MOT-002", "TRN-015", "MUS-014",
  "Calm. TRN-015 focus match into act 1's dark room (PerspectiveGrid, depth 2000, dark 0.7, dolly 0.02, fog 0.15) with the CLOSED shutter at about (280, 370): no hole, no beam, no tag, no door (act 4 makes the hole on 'small hole'). After 'born.' the music plays alone for about 3 s. Act 4 opens from this exact framing.",
  ["Match into the dark room on 'A man who died', SFX-024 swish in the pause before it; the closed shutter on the left third.",
   "On 'born.' the room holds; cue 4 alone, up to -27 LUFS, to the end of the act."]),
]

# Per-beat columns: each asset only on the beats where it is on screen (Gate 1 review item 6/17), sounds on their beats.
VIS = {**{k: "VIS-019, VIS-021" for k in (45, 46, 47, 48, 55, 56)}, **{k: "VIS-019, VIS-021, VIS-060" for k in (57, 58, 59, 60)},
       24: "VIS-059, VIS-061", 25: "VIS-059, VIS-061", 67: "VIS-019, VIS-061, VIS-060", 68: "VIS-019, VIS-061, VIS-060"}
TXT = {2: "TXT-010, TXT-024", 12: "TXT-010", 13: "TXT-009, TXT-010", 15: "TXT-009, TXT-010, TXT-024",
       **{k: "TXT-010, TXT-024" for k in (25, 26, 27, 47, 48, 68)}, 33: "TXT-010, TXT-025", 34: "TXT-010, TXT-025",
       35: "TXT-010, TXT-025", 36: "TXT-010, TXT-025"}
SRC = {**{k: "SRC-009" for k in range(2, 11)}, **{k: "SRC-009, SRC-045" for k in (5, 6, 7, 8)}, 11: "SRC-009, SRC-044",
       12: "SRC-044, SRC-042", **{k: "SRC-042, SRC-044" for k in range(13, 17)},
       17: "SRC-042, SRC-002", **{k: "SRC-002" for k in (18, 19, 20, 21)}, 22: "SRC-002, SRC-014",
       **{k: "SRC-002, SRC-014, SRC-015" for k in range(23, 29)}, 24: "SRC-002, SRC-014, SRC-015, SRC-046",
       25: "SRC-002, SRC-014, SRC-015, SRC-046", **{k: "SRC-043" for k in range(29, 39)}, **{k: "SRC-003" for k in (49, 50, 51)},
       **{k: "SRC-014, SRC-015" for k in (57, 58, 59, 60)}, **{k: "SRC-003" for k in range(61, 67)},
       67: "SRC-047", 68: "SRC-047", **{k: "SRC-004, SRC-007" for k in range(69, 73)}}
MOT = {36: "MOT-016, MOT-013", 38: "MOT-016, MOT-013", 72: "MOT-016, MOT-013"}
SFX = {9: "SFX-017", 12: "SFX-016", 13: "SFX-024", 17: "SFX-016", 21: "SFX-020", 22: "SFX-026", 39: "SFX-025",
       49: "SFX-006, SFX-017", 57: "SFX-026", 61: "SFX-024", 67: "SFX-026", 73: "SFX-024", 76: "SFX-024"}
MAP = {5: "MAP-017", 6: "MAP-017", 7: "MAP-017", 8: "MAP-017", 9: "MAP-008", 10: "MAP-008"}
TRN_IN = {11: "TRN-001, TRN-018"}
NEW = {
 1: "Yes: MUS-008 ActMoodCueSheet (scripts/mix-cue-bed.py, built); cue sheet act3_cues_v2.json",
 2: "Yes: SRC-009 limit raise 4 -> 16 beats; TXT-011 limit raise 24 -> 40; LayerStage builder additions (dateline tag with untilSec, rings inside the far plane, 'paper' light); TXT-024 KeywordChips (new, Planned: chip layer with stack, strike, swap)",
 5: "Yes: MAP-017 MapScrapRoute (new, Planned) on SRC-045 Kitchin 1794 (new, Planned); LayerStage carry exit 'sink'",
 11: "Yes: SRC-044 Cross Street Chapel 1835 (new, Planned -> Active); TRN-018 WorldSwap, 1 of 3 in the act",
 12: "Yes: SRC-042 Dalton 1798 p.28 (Planned) and its page-only cut-out (file of SRC-042)",
 13: "Decision for Sam: SRC-044 limit raise 4 -> 6 (A2's ground = the chapel blurred); without it the ground falls back to p.28 blurred (SRC-042)",
 17: "Yes: TRN-004 CanvasGridPan (built 23 Nov 2026)",
 21: "Yes: leaf and wax-seal cut-outs (SRC-014/015 files); limit raises SRC-014 3 -> 14, SRC-015 3 -> 10, SRC-002 10 -> 12, SFX-020 8 -> 12; MUS-012 Thinking Music (new cue 2, Sam to hear); LayerStage builder addition (world highlights)",
 24: "Yes: VIS-061 ObjectProp (new, Planned) on SRC-046 sealed letter 1841 (new, Planned)",
 29: "Yes: SRC-043 prism photo (Planned -> Active, 10 of 10); VIS-014 limit raise 5 -> 20; LayerStage builder additions (S1 overlay plane, S2 dim/rackDim, S3 outSec); VIS-014 two-track mode",
 33: "Yes: TXT-025 QuoteChips (new, Planned)",
 38: "Yes: MUS-015 TurnRiser (new, in-house, Sam to hear)",
 39: "Yes: VIS-019 limit raise 10 -> 30; SFX-025 limit 3 per episode; MUS-013 Long Note Two (new cue 3, Sam to hear); EyeDiagram builder addition (part outline on cue)",
 44: "Yes: label underline option (builder addition)",
 45: "Yes: VIS-021 limit raise 6 -> 20 beats",
 49: "Yes: TRN-002 DraftingWipe (built 23 Nov 2026)",
 52: "Yes: TRN-005 InkBleed (built 23 Nov 2026); EyeDiagram builder additions (carried cut-outs with a multiply state, RaySpec absorb, a tint pulse)",
 57: "Yes: VIS-060 StickerCutout (new, Planned) for EyeDiagram's carry",
 67: "Yes: TRN-009 ShapeMorph (built 23 Nov 2026); SRC-047 Wellcome eye model + cut-out (new, Planned)",
 69: "Yes: TRN-010 CutOnAction (built; moveTo:false prop); henry1854_p25_wish_line.png re-cut [85, 1124, 1850, 170] (file of SRC-007, done); SRC-004 16 of 16 (none left for acts 4-7); LayerStage builder additions (H1 carried highlights, H2 arrive); MUS-014 At Rest (new cue 4, Sam to hear)",
}
CUE = {1: "MUS-007, MUS-008", 21: "MUS-012, MUS-008", 38: "MUS-012, MUS-015", 39: "MUS-013, MUS-008", 69: "MUS-014, MUS-008"}

rows = []
covered = []
for s in S:
    a, b, vis, txt, mot, trn, mus, shot, notes = s
    assert len(notes) == b - a + 1, (a, b, len(notes))
    for k in range(a, b + 1):
        beat, st, en, line = C[k - 1]
        lo, hi = BOUNDS.get(k, (None, None))
        st, en = (lo if lo is not None else st), (hi if hi is not None else en)
        first = k == a
        rows.append([beat, 3, f"{st:.2f}", f"{en:.2f}", spoken(line), VIS.get(k, vis), TXT.get(k, txt), MOT.get(k, mot), TRN_IN.get(k, trn if first else "TRN-001"), L,
                     SFX.get(k, ""), CUE.get(k, mus), "", MAP.get(k, ""), "", SRC.get(k, ""), "", NEW.get(k, ""),
                     (shot + " " if first else "") + notes[k - a]])
        covered.append(k)
assert covered == list(range(1, len(C) + 1)), "every beat once"
for i in range(1, len(rows)):
    assert rows[i][2] == rows[i - 1][3], ("gap or overlap", rows[i][0])
json.dump(rows, open("act3_rows.json", "w"), indent=1, ensure_ascii=False)
print(len(rows), "rows")
