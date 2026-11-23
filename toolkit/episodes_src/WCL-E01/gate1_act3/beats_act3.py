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
  "Calm. Director shot A_manchester_talk. LayerStage world = Green's 1794 plan of Manchester (same place, same year), zoom 1.1, focus [0.4769, 0.37], haze 0.06, light 'paper' (fallback 'none'), lightFrom top-left; one slow move {pan -40, push 0.03} towards the college. NO PIN (in 1794 the Society met at Cross Street Chapel, outside this crop). Labels un-wipe (MOT-013).",
  ["Plan fades in under the slate (0.6 s); world label PLAN OF MANCHESTER · WILLIAM GREEN · 1794 bottom-right; the camera's one slow move begins.",
   "Dateline part 1 MANCHESTER arrives low-centre (960, 860) on 'Manchester'.",
   "Part 2 · 31 OCT 1794 arrives on 'October'.",
   "Dateline eases to the top-left corner (120, 84) on 'moved'.",
   "Label AGE 28 at (1280, 490), under where the college will be ringed, on 'twenty-eight'.",
   "Label TUTOR · MATHEMATICS AND NATURAL PHILOSOPHY at y 536 on 'mathematics'.",
   "Nothing new: the old name is in the narration only; the camera carries on towards the college.",
   "Ring (MAP-008, centre (1280, 307), r 125, drawn inside the far plane) round the plan's own 'Academy' building on 'college', pencil line SFX-017 at -29 dB; NEW COLLEGE (accent settle, MOT-014) lands above it at (1280, 135) on 'New College'.",
   "AGE 28 and TUTOR un-wipe on 'Tonight'; NEW COLLEGE and the ring 0.3 s later, so the right side is clear.",
   "Nothing new: the right side stays clear for the page.",
   "Page (p.28 page-only cut-out, w 560) rises on 'paper' and lands lifted at (560, 780), its bottom edge off frame, shadow down-right; paper sound SFX-016 at -24 dB on its settle, in the pause; blur racks in on the plan (1.5 px)."]),
 (13, 16, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-015", "MUS-007",
  "Calm. Director A2_title_match: TRN-015 focus match from the held page into the p.28 card (side left, crop [700, 160, 1000, 960]), ground = the same plan blurred. Source tag JOHN DALTON · 1798 · P. 28; quote column: Extraordinary Facts relating to the Vision of Colours: with Observations (no quote marks). Highlights in reading order.",
  ["Focus match on 'Its title is', swish SFX-024 in the pause before 'Its'; the dateline un-wipes on 'title'; highlight EXTRAORDINARY FACTS on 'Extraordinary'.",
   "Highlight Vision of Colours: on 'vision'.",
   "Nothing new: the two highlights hold on 'his own eyes'.",
   "Highlight READ OCT. 31ST, 1794. on 'first paper'."]),
 (17, 20, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-004", "MUS-007",
  "Calm. TRN-004 canvas glide, dir right, pull 0.86: page 28 to page 34 along one drafting sheet (two pages of the same paper). p.34 card (side left, crop [470, 600, 1300, 1290]), source tag JOHN DALTON · 1798 · P. 34; held at least 4 s, no scrolling.",
  ["The glide carries p.28 off and p.34 in on 'a careful paper', a quiet paper slide SFX-016 at -26 dB under it.",
   "Nothing new: the card holds.",
   "Highlight ORANGE & YELLOW. on 'lists', then GREEN. on 'one by one' (two sweeps in reading order, one shot hero each).",
   "Highlight the laurel line ('face of a laurel-leaf ... is a good') on 'examples'; it ends at about (620, 598), the point B pushes from."]),
 (21, 28, "VIS-059", "TXT-010", "MOT-016, MOT-013", "TRN-006", "MUS-012",
  "Calm. Director B_leaf_and_wax: TRN-006 push from the p.34 laurel line. World = p.34 itself, framed on the laurel sentence (zoom 1.15, focus [0.538, 0.4797], haze 0.08, light 'paper', lightFrom top-left), world label JOHN DALTON · 1798 · P. 34. The printed sentence is the on-screen quote (world highlights H1-H3; no typed copy). Leaf (330, 360) and wax (330, 690) rise in the margin BESIDE their words, lifted. Caption (bottom-left, static) PHOTOS TODAY · CHERRY LAUREL, RUNIC EARTH · WAX SEAL, PETRIK from the push until 0.6 s before the glide. Cue 2 enters in the pause before 'Here's one'.",
  ["Push lands on the laurel sentence with H1 'The' and H2 'face of a laurel-leaf (Prunus Lauro-cerasus) is a good' lit from frame 0; low whoosh SFX-020 in the pause before 'Here's one'; cue 2 enters; the caption comes in with the world.",
   "Leaf rises on 'leaf' and lands at (330, 360), soft pop SFX-026 on its settle in the comma pause (the shot's one pop); then H3 'match to a stick of red sealing-wax' on 'match' (reading order).",
   "Wax seal rises on 'sealing' and lands at (330, 690), no pop.",
   "State label A WAX SEAL · TODAY under the wax on 'seal letters' (it is never called a stick).",
   "Blur racks in on the page (2 px) on 'Think': the two things are now the subject.",
   "Nothing new: both things hold in their own colours.",
   "Nothing new (the longest still stretch, about 4.5 s, with the camera moving; if the frame review finds it still, a TO YOU label at (120, 830), per the brief).",
   "Both turn the same olive (#574F18, simulated) on 'To him'; the wax label un-wipes with it; label SIMULATION · ONE WAY / HE MAY HAVE SEEN THEM (x 120, y 830/868, size 22) 0.45 s later; that label and the caption un-wipe 0.6 s before the glide."]),
 (29, 38, "VIS-014", "TXT-009, TXT-010", "MOT-002", "TRN-004", "MUS-012",
  "Calm. TRN-004 canvas glide, dir down, pull 0.86 (the next example on the same sheet), silent under cue 2. Two SpectrumStrips: top OTHERS · DALTON'S SIX (red, orange, yellow, green, blue, purple); bottom DALTON'S WORDS (red end dim, not black; one yellow fading strong to pale under orange, yellow and green; blue under blue; a darker blue under purple). Quote typed only, credited DALTON · 1798 · P. 31. Cue 2 drops out in the pause after 'purple.'; the riser (MUS-015) builds under beat 38.",
  ["Glide down to the strips just before 'He describes'; the top strip titled OTHERS · DALTON'S SIX, its colours drawing left to right from x 210.",
   "The top strip draws on (nothing else new).",
   "Top strip complete.",
   "Lower track DALTON'S WORDS appears under it, still empty, on 'others call red'.",
   "Quote typed beside the red end as said: 'little more than a shade, or defect of light', source DALTON · 1798 · P. 31 (music near-silent under the quote).",
   "Lower red end fills dim (not black) on 'almost no light at all'.",
   "Nothing new: the top strip's six hold on 'six colours'.",
   "Typed count 'I see only two or at most three distinctions' on 'two'; the lower strip fills one yellow, strong to pale under orange, yellow and green, on 'yellow'.",
   "Blue under blue, then a darker blue under purple, on 'blue' and 'purple'; cue 2 out in the pause after 'purple.'.",
   "Nothing new; the riser (MUS-015) builds under 'Then he does what a scientist should' into the hard cut."]),
 (39, 48, "VIS-019", "TXT-010", "MOT-002", "TRN-001", "MUS-013",
  "Calm. Director D_into_the_eye: the act's ONE hard cut, at 102.10 s on the hit (SFX-025) in the measured silence after 'should.' (102.05-103.2 s); cue 3 (a low held drone) enters on the same frame. EyeDiagram section on the theme canvas, eye centre (960, 540) = the strips' centre. Music about 27 dB under the voice (explanation level).",
  ["Hard cut, hit and cue 3 on one frame; the cross-section draws in (0.9 s) on 'explanation'.",
   "Nothing new: the section holds on 'isn't hollow'.",
   "Nothing new on 'clear fluids' (frame review: check the stillness of 40-42).",
   "The vitreous outlined on 'clear jelly' (EyeDiagram builder addition: a part outline on cue).",
   "Label VITREOUS HUMOUR at (1000, 480) on 'vitreous humour'.",
   "Nothing new: 'humour' is explained in the narration only.",
   "Beam (VIS-021) draws from x 210 to x 1280 along y 540 on 'Light passes' (1.4 s), silent; the bed thins.",
   "The beam reaches the back of the eye; corner tag DALTON'S GUESS on 'Dalton's guess' (it stays on while the jelly is blue).",
   "Nothing new on 'his eyes, one of these fluids isn't'.",
   "The jelly tints blue (#3D6BD6, 50%, 1.2 s) on 'It's', complete before the wipe."]),
 (49, 51, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-002", "MUS-013",
  "Calm. TRN-002 drafting wipe, angle 8, dir right, into the p.43 card (side left, crop [180, 900, 1080, 1040]), source tag JOHN DALTON · 1798 · P. 43; highlights across the hyphenated line breaks; quote column 'probably some modification of blue' in near-silence.",
  ["J-cut: the page sound SFX-006 leads 0.5 s, then the drafting line (ink SFX-017 under the stroke) on 'In his words'; highlights 'probably some modi-' and 'fication of blue.' on 'probably' (music near-silent under the quote).",
   "Nothing new: 'So, some kind of blue' (the quote column holds).",
   "Highlights 'I suppose it must be the', 'vitreous' (its own box, for the ink point and the morph) and 'humour;' on 'supposes'."]),
 (52, 60, "VIS-019", "TXT-010", "MOT-002", "TRN-005", "MUS-013",
  "Calm. Director C_carry_into_eye: TRN-005 ink bleed in the jelly's blue (#3D6BD6) from [894, 303] (the word 'vitreous', inside the jelly in this framing), cued on 'And'; it opens on D's exact framing, jelly already blue, tag DALTON'S GUESS in the corner throughout. The leaf and the wax come back in their own colours on the left (the light's side), carried inside the diagram's drift; under his blue they go darker, duller and closer, but stay two colours. NO olive inside his guess (fact-check item 8).",
  ["Blue ink spreads from 'vitreous' into the eye on 'And honestly'; a soft ink drip (SFX-017, -26 dB).",
   "Nothing new on 'it makes sense'.",
   "Nothing new on 'blue glass' (the blue jelly is the picture).",
   "Rays (VIS-021: red, green, blue) start from x 210 on 'In Dalton's version'; red and green fade to about 30% in the jelly (path 0.55-0.75) on 'soaks up'; blue passes.",
   "Nothing new: the thinned red and green hold.",
   "The thinned beam reaches the back of the eye; leaf (w 180) and wax (w 140) rise on the left in the pause after 'eye.' and settle at (300, 380) and (300, 700), the beam starting between them; soft pop SFX-026 at -26 dB on the settle.",
   "Both darken under the jelly's blue (multiply) and move closer, to (300, 440) and (300, 645), on 'duller': still two colours.",
   "Label HIS IDEA: / DULLER, AND MORE ALIKE (x 120, y 790/830, size 22) 0.5 s after 'other.'.",
   "Nothing new on 'might end up looking like a leaf'; the label un-wipes 0.6 s before the slide."]),
 (61, 66, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-007", "MUS-013",
  "Calm. TRN-007 slide back into the same p.43 card, landing in the same place with the earlier highlights lit. The music drops to near-silence under the quote (about 45 dB under the voice) and returns in the pause after 'done.'.",
  ["Slide in on 'He has a reason', SFX-024 at the slide.",
   "Music near-silent from here; highlight 'otherwise I apprehend it might be disco-' on 'Otherwise'.",
   "Nothing new: the line is read.",
   "Highlight 'vered by inspection, which has not been done.' on 'has not been done'; the music returns in the pause after 'done.'.",
   "Nothing new on 'a tint anywhere easier to see'.",
   "Nothing new: the 'vitreous' box is about to lift."]),
 (67, 68, "VIS-019", "TXT-010", "MOT-002", "TRN-009", "MUS-013",
  "Calm. TRN-009 shape morph: the 'vitreous' highlight box [832, 285, 123, 37, 3] lifts off and becomes the IRIS [848, 434, 224, 224, 112] of EyeDiagram mode simple, centred (960, 540). The deadpan: the music drops to silence from the pause after 'eye.' through the pause after 'two.'; the eye closes once (one close, no reopen), its close keyed 0.30 s before the shot ends.",
  ["Morph lands on the iris on 'open an eye'; soft pop SFX-026 on the landing (this shot's one).",
   "Music silent; 'And Dalton only has two.' over the plain eye; the lid starts to close at the end."]),
 (69, 72, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-010", "MUS-014",
  "Calm. TRN-010 cut on action, dir down, px 90: the closing lid (the old shot plays on live) carries into the Henry LINE STRIP arriving downward: henry1854_p25_wish_line.png, image px [90, 1140, 2110, 135], the two lines only, on the same page blurred (the act 1 strip pattern). The 'not, however, verified' and 'pale yellow' lines never show. Cue 4 enters in the same pause.",
  ["Cut on the closing lid; the strip arrives moving down on 'At some point'; source tag W. C. HENRY · 1854 · P. 25 on arrival; cue 4 in.",
   "Nothing new: the two lines are read.",
   "Nothing new on 'His biographer' (the tag names him).",
   "Highlight 'his strongly expressed wish' on 'strongly' (music near-silent under the quote)."]),
 (73, 75, "VIS-020", "TXT-009", "MOT-002", "TRN-011", "MUS-014",
  "Calm. TRN-011 paper band (dark, up) into the new question; KineticLine left-aligned at x 120, vertically centred; one line only, never repeating the narration.",
  ["Band wipes up on 'But', SFX-024; the dark ground holds.",
   "WHAT IS COLOUR? sets on 'what colour is', accent fill on 'colour'.",
   "Nothing new: the question holds."]),
 (76, 77, "VIS-015", "TXT-010", "MOT-002", "TRN-015", "MUS-014",
  "Calm. TRN-015 focus match into act 1's dark room (PerspectiveGrid, depth 2000, dark 0.7, dolly 0.02, fog 0.15) with the CLOSED shutter at about (280, 370): no hole, no beam, no tag, no door (act 4 makes the hole on 'small hole'). After 'born.' the music plays alone for about 3 s. Act 4 opens from this exact framing.",
  ["Match into the dark room on 'A man who died', SFX-024 swish in the pause before it; the closed shutter on the left third.",
   "On 'born.' the room holds; cue 4 alone, up to -27 LUFS, to the end of the act."]),
]

# Per-beat columns: each asset only on the beats where it is on screen (Gate 1 review item 6/17), sounds on their beats.
VIS = {**{k: "VIS-019, VIS-021" for k in (45, 46, 47, 48, 55, 56, 57, 58, 59, 60)}}
TXT = {2: "TXT-010", 13: "TXT-009, TXT-010, TXT-011"}
SRC = {**{k: "SRC-009" for k in range(2, 12)}, 12: "SRC-009, SRC-042", **{k: "SRC-042, SRC-009" for k in range(13, 17)},
       17: "SRC-042, SRC-002", **{k: "SRC-002" for k in (18, 19, 20, 21)}, 22: "SRC-002, SRC-014",
       **{k: "SRC-002, SRC-014, SRC-015" for k in range(23, 29)}, **{k: "SRC-003" for k in (49, 50, 51)},
       **{k: "SRC-014, SRC-015" for k in (57, 58, 59, 60)}, **{k: "SRC-003" for k in range(61, 67)},
       **{k: "SRC-007" for k in range(69, 73)}}
SFX = {9: "SFX-017", 12: "SFX-016", 13: "SFX-024", 17: "SFX-016", 21: "SFX-020", 22: "SFX-026", 39: "SFX-025",
       49: "SFX-006, SFX-017", 52: "SFX-017", 57: "SFX-026", 61: "SFX-024", 67: "SFX-026", 73: "SFX-024", 76: "SFX-024"}
MAP = {9: "MAP-008", 10: "MAP-008"}
NEW = {
 1: "Yes: MUS-008 ActMoodCueSheet (scripts/mix-cue-bed.py, built); cue sheet act3_cues_v2.json",
 2: "Yes: SRC-009 limit raise 4 -> 16 beats (A + A2's blurred ground); LayerStage builder additions (dateline tag, rings inside the far plane, 'paper' light)",
 12: "Yes: SRC-042 Dalton 1798 p.28 (new, Planned) and its page-only cut-out (new file of SRC-042)",
 21: "Yes: leaf and wax-seal cut-outs (SRC-014/015 files); limit raises SRC-014 3 -> 14 (B, C and act 5's leaf), SRC-015 3 -> 10, SRC-002 10 -> 12, SFX-020 8 -> 12; MUS-012 Thinking Music (new cue 2, Sam to hear); LayerStage builder addition (world highlights)",
 29: "Yes: VIS-014 limit raise 5 -> 20 beats (act 3: 10; act 4's Newton spectrum)",
 38: "Yes: MUS-015 TurnRiser (new, in-house, Sam to hear)",
 39: "Yes: VIS-019 limit raise 10 -> 30 (acts 3 and 6); SFX-025 limit 2 -> 3, one per act (or the riser cut dead with no hit); MUS-013 Long Note Two (new cue 3, Sam to hear); EyeDiagram builder addition (part outline on cue)",
 45: "Yes: VIS-021 limit raise 6 -> 20 beats (act 3: 10; act 4's light paths)",
 49: "Yes: TRN-002 DraftingWipe (built 23 Nov 2026)",
 52: "Yes: TRN-005 InkBleed (built 23 Nov 2026); EyeDiagram builder additions (carried cut-outs with a multiply state, RaySpec absorb)",
 67: "Yes: TRN-009 ShapeMorph (built 23 Nov 2026)",
 69: "Yes: TRN-010 CutOnAction (built 23 Nov 2026); henry1854_p25_wish_line.png (new file of SRC-007); MUS-014 At Rest (new cue 4, Sam to hear)",
 17: "Yes: TRN-004 CanvasGridPan (built 23 Nov 2026)",
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
        rows.append([beat, 3, f"{st:.2f}", f"{en:.2f}", spoken(line), VIS.get(k, vis), TXT.get(k, txt), mot, trn if first else "TRN-001", L,
                     SFX.get(k, ""), CUE.get(k, mus), "", MAP.get(k, ""), "", SRC.get(k, ""), "", NEW.get(k, ""),
                     (shot + " " if first else "") + notes[k - a]])
        covered.append(k)
assert covered == list(range(1, len(C) + 1)), "every beat once"
for i in range(1, len(rows)):
    assert rows[i][2] == rows[i - 1][3], ("gap or overlap", rows[i][0])
json.dump(rows, open("act3_rows.json", "w"), indent=1, ensure_ascii=False)
print(len(rows), "rows")
