"""WCL-E01 act 3 'The talk': Gate 1 beat sheet rows (beat sheet rows 109-185) from act3_cuts.json.
Shots follow the act 3 plan, the Director's brief (director/ep01-act03_brief.md, incl. its transition review), the
on-screen fact-check (gate1_act3_onscreen_factcheck.md) and the Harris-style cue sheet (gate1_act3/act3_cues_sampler_v1.json).
Each shot's IDs and note are set once; every beat in it gets its own note line."""
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
# (first beat, last beat, visual, text, motion, transition-in, sfx, music, texture, map, source, new flag, shot note, per-beat notes)
S = [
 (1, 1, "VIS-007", "TXT-009, TXT-010", "MOT-002", "TRN-001", "", "MUS-007", "", "", "", "Yes: MUS-008 ActMoodCueSheet (scripts/mix-cue-bed.py, built)",
  "Calm. Chapter slate 3 · THE TALK. No narration: the music plays alone (cue 1, Wholesome carried on from act 2, about 12 dB louder than under the voice, Harris rule D).",
  ["Slate fades up; title locks; cue 1 alone."]),
 (2, 12, "VIS-059", "TXT-011, TXT-010", "MOT-016, MOT-013, MOT-014", "TRN-001", "SFX-017, SFX-016", "MUS-007", "", "", "SRC-009, SRC-042",
  "Yes: SRC-042 Dalton 1798 p.28 (new, Planned); SRC-009 limit raise 4 -> 12 beats; LayerStage builder additions (a dateline tag, rings drawn on the world)",
  "Calm. Director shot A_manchester_talk. LayerStage world = Green's 1794 plan of Manchester (same place, same year), zoom 1.1, focus [0.4769, 0.37], haze 0.06, light top-left; one slow move {pan -40, push 0.03}. Fades up under the slate. NO PIN (in 1794 the Society met at Cross Street Chapel, outside this crop; any pin would name a street as the venue). Labels un-wipe (MOT-013).",
  ["Plan fades in; dateline MANCHESTER · 31 OCT 1794 parts low-centre on 'Manchester'.", "Dateline holds; the plan's streets in the haze.",
   "Dateline moves to the top-left corner on 'October'.", "Corner holds; the camera drifts towards the college.",
   "Ring draws on the plan's own 'Academy' building (pencil, -29 dB) as 'He's' starts; tag AGE 28 on 'twenty-eight'.", "Tag TUTOR · MATHEMATICS AND NATURAL PHILOSOPHY on 'mathematics'.",
   "Tag stays; the old name in the narration, nothing new on screen.", "Tag NEW COLLEGE lands on 'New College' (accent settle, MOT-014).",
   "AGE 28 and TUTOR un-wipe on 'Tonight'; NEW COLLEGE and the ring 0.3 s later.", "Right side clear; the page rises from below at (560, 780), lifted, cut edge off frame.",
   "Page settles on 'paper' (paper sound in the pause); blur racks in on the plan (1.5 px); dateline un-wipes on 'title'."]),
 (13, 16, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-015", "SFX-024", "MUS-007", "", "", "SRC-042",
  "Yes: SRC-042 (see beat 2)",
  "Calm. Director A2_title_match: TRN-015 focus match from the held page into the p.28 card (swish SFX-024 in the pause; Director). Highlights in reading order.",
  ["Card in on 'Its title is'; highlight EXTRAORDINARY FACTS relating to the VISION OF COLOURS on the words.", "Highlight runs on through 'relating to the vision of colours'.",
   "Highlight 'READ OCT. 31st, 1794.' on 'his own eyes'; tag HIS OWN EYES (mono).", "Tag HIS FIRST PAPER TO THE SOCIETY on 'first paper'."]),
 (17, 20, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-004", "SFX-021", "MUS-007", "", "", "SRC-002",
  "Yes: TRN-004 CanvasGridPan (built 23 Nov 2026)",
  "Calm. TRN-004 canvas glide, dir right, pull 0.86: page 28 to page 34 along one drafting sheet (two pages of the same paper). p.34's list of colours, lines highlighted as read.",
  ["Glide lands on p.34 on 'a careful paper'; label A CAREFUL PAPER.", "Lines of the colour list highlight one by one on 'He doesn't just say'.",
   "Label ONE BY ONE on 'one by one'; the highlight steps down the list.", "Label EXAMPLES ANYONE CAN CHECK on 'examples'; the laurel line lit last."]),
 (21, 28, "VIS-059", "TXT-009, TXT-010", "MOT-016, MOT-013", "TRN-006", "SFX-020, SFX-016", "MUS-012", "", "", "SRC-002, SRC-014, SRC-015",
  "Yes: leaf and wax-seal cut-outs (SRC-014/015 files); SRC-014 and SRC-015 limit raise 3 -> 20 beats; MUS-012 Thinking Music (new cue 2); LayerStage builder addition (highlight on a world)",
  "Calm. Director B_leaf_and_wax: TRN-006 push from the p.34 laurel line. World = p.34 itself framed on the laurel sentence (zoom 1.15, focus [0.538, 0.4797], haze 0.08). The printed sentence is the on-screen quote (highlighted). Leaf (330, 360) and wax (330, 690) land in the margin beside it, lifted. Cue 2 enters in the pause before 'Here's one'.",
  ["Push lands on the laurel sentence; cue 2 enters; 'Here's one' with the sentence highlighted from 'The face of a laurel-leaf'.", "Leaf lands in the margin on 'laurel leaf'; label LAUREL LEAF.",
   "Wax seal lands below it on 'sealing-wax'; label A WAX SEAL · TODAY (never called a stick).", "Label THE WAX PEOPLE SEALED LETTERS WITH on 'seal letters'.",
   "Both hold; the highlight stays on the printed line.", "Label TO YOU: GREEN · RED on 'red stick of wax'.",
   "Hold on 'as different as two colours get'.", "Both turn the same olive (#574F18, simulated) on 'match'; label SIMULATION · ONE WAY HE MAY HAVE SEEN THEM."]),
 (29, 38, "VIS-014", "TXT-009, TXT-010", "MOT-002", "TRN-004", "SFX-021", "MUS-012", "", "", "",
  "Yes: VIS-014 limit raise 5 -> 12 beats; MUS-015 TurnRiser (new, in-house)",
  "Calm. TRN-004 canvas glide, dir down, pull 0.86 (the next example on the same sheet). Two SpectrumStrips: OTHERS (DALTON'S SIX) above; DALTON'S WORDS below: red end dim (not black), one yellow fading strong to pale under orange-yellow-green, blue under blue, a darker blue under purple. The quote typed, credited DALTON, 1798, p.31. Cue 2 drops out in the pause after 'purple.'; the riser builds under beat 38.",
  ["Glide down to the strips on 'band of colours from a prism'; top strip in.", "Label A PRISM on 'prism'; a small drawn prism throws the band.",
   "Band on the wall; label GLASS THAT THROWS COLOURS.", "Label OTHERS CALL IT RED on the red end.",
   "Quote 'little more than a shade, or defect of light' typed beside the red end; source line DALTON, 1798, p.31.", "Lower strip's red end dims: label ALMOST NO LIGHT.",
   "Tag OTHERS · SIX on 'six colours'.", "Lower strip draws: YELLOW, then BLUE on 'two'.", "PURPLE added on 'or yellow, blue and purple'; cue 2 out in the pause after it.",
   "Hold under 'Then he does what a scientist should'; the riser (MUS-015) builds into the hard end."]),
 (39, 48, "VIS-019, VIS-021", "TXT-009, TXT-010", "MOT-002", "TRN-001", "SFX-025", "MUS-013", "", "", "",
  "Yes: VIS-019 limit raise 10 -> 30 beats (acts 3 and 6); MUS-013 Long Note Two (new cue 3)",
  "Calm. Director D_into_the_eye: the act's ONE hard cut, on the hit (SFX-025) in the pause before 'He offers'; cue 3 (a low held drone) enters on the hit. EyeDiagram section; a beam (VIS-021) passes to the back. Music about 27 dB under the voice (explanation level).",
  ["Hard cut on the hit; cross-section draws in on 'explanation'.", "Label NOT HOLLOW on 'isn't hollow'.", "Fluids fill pale on 'clear fluids'.",
   "The big jelly outlined on 'clear jelly'.", "Label VITREOUS HUMOUR lands on 'vitreous humour'.", "Mono note HUMOUR = AN OLD WORD FOR A BODY FLUID.",
   "A beam of light enters on 'Light passes through it'.", "The beam reaches the back of the eye; label DALTON'S GUESS on 'Dalton's guess'.",
   "Tag DALTON'S GUESS holds; the jelly starts to tint.", "The jelly tints blue on 'It's tinted' (DALTON'S GUESS stays on while it is blue)."]),
 (49, 51, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-002", "SFX-016, SFX-017", "MUS-013", "", "", "SRC-003",
  "Yes: TRN-002 DraftingWipe (built 23 Nov 2026)",
  "Calm. TRN-002 drafting wipe, angle 8, dir right; J-cut: the page sound (SFX-016) starts 0.5 s before the line, the ink line (SFX-017) under the stroke. p.43, highlight across the hyphenated line breaks.",
  ["Line drafts across on 'In his words'; highlight 'probably some modification of blue'.", "Label SOME KIND OF BLUE on 'some kind of blue'.",
   "Highlight 'I suppose it must be the vitreous humour' on 'vitreous humour'; 'vitreous' boxed as its own highlight (the ink point and the later morph)."]),
 (52, 60, "VIS-019, VIS-021", "TXT-009, TXT-010", "MOT-002", "TRN-005", "SFX-016", "MUS-013", "", "", "SRC-014, SRC-015",
  "Yes: TRN-005 InkBleed (built 23 Nov 2026); EyeDiagram builder addition (carried cut-outs with a multiply state)",
  "Calm. Director C_carry_into_eye: TRN-005 ink bleed in the jelly's blue (#3D6BD6) from [894, 303] (the word 'vitreous', also inside the jelly), cued on 'And'. Inside DALTON'S GUESS: red and green dots thin out in the jelly; the leaf and the wax come back in their own colours from the left and darken under the blue, closer, but stay two colours. NO olive inside his guess (fact-check item 8).",
  ["Blue ink spreads from 'vitreous' into the eye on 'And honestly'.", "Eye with the blue jelly; tag DALTON'S GUESS.", "Label LIKE BLUE GLASS on 'blue glass'.",
   "Red and green dots enter the jelly on 'In Dalton's version'.", "Red and green thin out on 'red and the green light'.", "The thinned beam reaches the back of the eye.",
   "Label DULLER · MORE ALIKE on 'duller'.", "Leaf and wax carried in on the left, in their own colours, on 'a red stick of wax'.",
   "Both darken under the blue and drift a little closer on 'like a leaf' (two colours still)."]),
 (61, 66, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-007", "SFX-024", "MUS-013", "", "", "SRC-003",
  "",
  "Calm. TRN-007 slide back into p.43 (into a document). The music drops to near-silence under the quote (Harris rule: quotes near-silent, about 45 dB under the voice) and returns in the pause after 'done.'.",
  ["Slide in on 'He has a reason'; label WHY THE JELLY?", "Music near-silent; highlight runs from 'otherwise I apprehend'.",
   "Highlight 'it might be discovered by inspection'.", "Highlight 'which has not been done'; music returns in the pause.",
   "Label A TINT ANYWHERE ELSE WOULD SHOW on 'easier to see'.", "Hold on 'noticed by now'."]),
 (67, 68, "VIS-019", "TXT-009, TXT-010", "MOT-002", "TRN-009", "SFX-026", "MUS-013", "", "", "",
  "Yes: TRN-009 ShapeMorph (built 23 Nov 2026)",
  "Calm. TRN-009 shape morph: the 'vitreous' highlight box [832, 285, 123, 37, 3] lifts off and becomes the eye's IRIS [848, 434, 224, 224, 112] (Director); soft pop on the landing. The deadpan: the music drops to silence from the pause after 'eye.' through the pause after 'two.'; the eye closes once (one close, no reopen), its close keyed 0.30 s before the shot ends.",
  ["Morph lands on the iris on 'open an eye'; label OPEN AN EYE.", "Music silent; 'And Dalton only has two.' over the plain eye; the lid starts to close at the end."]),
 (69, 72, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-010", "", "MUS-014", "", "", "SRC-007",
  "Yes: TRN-010 CutOnAction (built 23 Nov 2026); MUS-014 At Rest (new cue 4)",
  "Calm. TRN-010 cut on action, dir down, px 90: the lid closing carries into the Henry strip arriving downward (the old shot plays on into the cut). Henry 1854 p.25 as a two-line strip only (the 'pale yellow' line two lines below never shows). Cue 4 enters in the same pause.",
  ["Cut on the closing lid; the Henry strip arrives moving down on 'At some point'; cue 4 in.", "Label AFTER HE DIES on 'after he'.",
   "Source line HENRY · 1854 · HIS BIOGRAPHER on 'His biographer'.", "Highlight 'his strongly expressed wish' on the words."]),
 (73, 75, "VIS-020", "TXT-009", "MOT-002", "TRN-011", "SFX-024", "MUS-014", "", "", "",
  "",
  "Calm. TRN-011 paper band (dark, up) into the new question; KineticLine centred at y 540.",
  ["Band; line A BLUE TINT ONLY EXPLAINS COLOURS on 'only explains colours'.", "Line IF WE KNOW WHAT COLOUR IS; WHAT IS COLOUR? sets large on 'what colour is'.",
   "Line holds; tag ONE MAN (mono) on 'one man'."]),
 (76, 77, "VIS-015", "TXT-010", "MOT-002", "TRN-015", "SFX-024", "MUS-014", "", "", "",
  "",
  "Calm. TRN-015 focus match into the dark room with act 1's shutter (focus [280, 370]); no door (no source has one). The room holds; after 'born' the music plays alone for about 3 s. Act 4 opens from this exact framing.",
  ["Match into the dark room on 'A man who died'; the shutter hole faint.", "'born'; the room holds; cue 4 alone, louder, to the end of the act."]),
]
rows = []
covered = []
for s in S:
    a, b = s[0], s[1]
    notes = s[13]
    assert len(notes) == b - a + 1, (a, b, len(notes))
    for k in range(a, b + 1):
        beat, st, en, line = C[k - 1]
        first = k == a
        rows.append([beat, 3, st, en, spoken(line), s[2], s[3], s[4], s[5] if first else "TRN-001", L, s[6] if first else "", s[7], s[8], s[9], "",
                     s[10], "", s[11] if first else "", (s[12] + " " if first else "") + notes[k - a]])
        covered.append(k)
assert covered == list(range(1, len(C) + 1)), "every beat once"
CUE = {"E01-A3-01": "MUS-007, MUS-008", "E01-A3-21": "MUS-012, MUS-008", "E01-A3-38": "MUS-012, MUS-015", "E01-A3-39": "MUS-013, MUS-008",
       "E01-A3-69": "MUS-014, MUS-008"}  # cue entries carry the cue sheet (MUS-008); the riser sits on beat 38
for r in rows:
    if r[0] in CUE:
        r[11] = CUE[r[0]]
json.dump(rows, open("act3_rows.json", "w"), indent=1, ensure_ascii=False)
print(len(rows), "rows")
