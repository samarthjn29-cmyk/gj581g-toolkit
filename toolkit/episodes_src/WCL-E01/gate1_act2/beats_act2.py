"""WCL-E01 act 2 'The odd one out': Gate 1 beat sheet rows (beat sheet rows 41-108) from act2_cuts.json.
Shots are runs of beats; each shot's IDs and note are set once and every beat in it gets its own note line."""
import json, re
C = json.load(open("act2_cuts.json"))
FIX = {"1766": "seventeen sixty-six", "50": "fifty", "15.": "fifteen.", "30": "thirty", "Kendal,": None, "northwest": "north-west",
       "-dark": "dark", "bluish": "bluish"}
def spoken(i, t):
    t = t.replace("By Kendal,", "By candle,").replace("bluish -dark", "bluish dark").replace("northwest", "north-west")
    t = re.sub(r"\b1766\b", "seventeen sixty-six", t)
    t = re.sub(r"\b50 years\b", "fifty years", t)
    t = re.sub(r"\b15\.", "fifteen.", t)
    t = re.sub(r"\b30 years\b", "thirty years", t)
    t = t.replace("says, they're as red as a cherry, John!", 'says, "They\'re as red as a cherry, John!"')
    t = t.replace("they're as red as a cherry, John!", '"They\'re as red as a cherry, John!"')
    t = t.replace("same light as myself.", 'same light as myself".').replace("for his brother, who saw", 'for his brother, "who saw')
    return t
L = "LOK-009, LOK-010"
# (first beat, last beat, visual, text, motion, transition-in, sfx, music, texture, map, source, new flag, shot note, per-beat notes)
S = [
 (1, 1, "VIS-007", "TXT-009, TXT-010", "MOT-002", "TRN-001", "", "MUS-007", "", "", "", "",
  "Calm. Chapter slate 2 · THE ODD ONE OUT (no narration; the bed carries on from act 1).", ["Slate fades up; title locks."]),
 (2, 5, "MAP-010", "TXT-011, TXT-010", "MOT-001", "TRN-011", "SFX-024, SFX-019", "MUS-007", "", "MAP-008", "SRC-033",
  "Yes: new MAP-010 PeriodMapPlate, MAP-008 RadioRings (build), SRC-033 period map",
  "Calm. TRN-011 paper band down from the slate (air swish). A real period map of the north of England (public domain, 1790s); slow drift; MAP-008 rings settle on EAGLESFIELD (soft dial tick).",
  ["Map fades in under the band; dateline EAGLESFIELD · CUMBERLAND on 'Eaglesfield'.", "Rings pulse once on the Eaglesfield pin; tag BORN 1766 on 'seventeen sixty-six'.",
   "Label NORTH-WEST ENGLAND on 'north-west'.", "Label A QUAKER FAMILY on 'Quakers'."]),
 (6, 7, "VIS-001", "TXT-009, TXT-010", "MOT-002", "TRN-007", "SFX-006", "MUS-007", "", "", "SRC-034",
  "Yes: new SRC-034 Quaker advices page",
  "Calm. TRN-007 slide to a real printed page of Quaker advice (public domain) with the line on plainness highlighted; source chip.",
  ["Page slides in; highlight 'plainness' on 'plain'.", "Quote line PLAIN CLOTHES · PLAIN WORDS beside the page on 'Plain clothes'."]),
 (8, 11, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-013", "SFX-024", "MUS-007", "", "", "SRC-035",
  "Yes: new SRC-035 Dalton 1793 title page",
  "Calm. TRN-013 flash (page to page, same idea: his plain, careful habits). The title page of Dalton's own Meteorological Observations and Essays (1793; Wellcome Collection, public domain); his weather record: label THE DIARY · 1787 TO 1844 (Henry 1854 pp.11-12).",
  ["Title page in; highlight 'Meteorological Observations' on 'writes everything down'.", "Label HIS WEATHER RECORD on 'For more than'.",
   "Mono tag THE DIARY · 1787 TO 1844 on 'fifty years'.", "Tag EVERY DAY · TO THE NIGHT BEFORE HE DIED on 'every single day'."]),
 (12, 13, "MAP-010", "TXT-011, TXT-010", "MOT-001", "TRN-011", "SFX-024, SFX-016", "MUS-007, MUS-011", "", "MAP-009, MAP-008", "SRC-033",
  "Yes: MAP-009 TiltedRouteDraw (build)",
  "Calm. TRN-011 band back to the map (bass drop-out MUS-011 on the band); MAP-009 route draws Eaglesfield to Kendal, rings on KENDAL.",
  ["Route draws on 'teaching in Kendal'; dateline KENDAL · LAKE DISTRICT.", "Tag TEACHING FROM AGE 15 on 'since he was fifteen'."]),
 (14, 15, "VIS-016", "TXT-010", "MOT-001", "TRN-006", "SFX-020", "MUS-007", "", "", "SRC-013",
  "", "Calm. TRN-006 push-through from the Kendal pin into the geranium (SRC-013), candle-warm grade.",
  ["Geranium on 'geranium'; label THE GERANIUM, 1792.", "Label WHAT DO YOU SEE? on 'takes it for granted'."]),
 (16, 21, "VIS-001", "TXT-009, TXT-010", "MOT-003", "TRN-007", "SFX-006", "MUS-007", "", "", "SRC-029",
  "", "Calm. TRN-007 slide into Dalton 1798 p.30 (SRC-029), held 16.9 s, highlights in reading order (exact words checked against the scan at Gate 2).",
  ["Highlight 'I requested some of my friends to observe the phenomenon' on 'asks around'.", "Highlight on 'surprised'.",
   "Highlight 'they all agreed' on 'agreed'.", "Highlight 'not materially different' on 'not much different'.",
   "Highlight 'except my brother' on 'Except'; the rest of the page dims.", "Pull quote 'who saw it in the same light as myself' on 'who saw'."]),
 (22, 24, "VIS-001", "TXT-009, TXT-010, TXT-011", "MOT-002", "TRN-006", "SFX-020", "MUS-007", "", "", "SRC-036",
  "Yes: new SRC-036 Lonsdale 1874",
  "Calm. TRN-006 push-through from 'my brother' on p.30 into the next source on the brothers. Lonsdale's The Worthies of Cumberland: John Dalton (1874) title page; label AS THE STORY GOES; tag 1874 · 30 YEARS AFTER HE DIED.",
  ["Title page in on 'another story'; label AS THE STORY GOES.", "Tag 1874 · THIRTY YEARS AFTER HE DIED on 'thirty years'.", "Label MAY HAVE GROWN IN THE TELLING (mono) on 'grown'."]),
 (25, 30, "VIS-035", "TXT-011, TXT-010", "MOT-001", "TRN-011", "SFX-024, SFX-021", "MUS-007", "", "", "SRC-037",
  "Yes: new VIS-035 ReportedColour, SRC-037 museum stockings photo",
  "Calm. TRN-011 band. A real pair of late-18th-century stockings (museum photo, open licence); VIS-035 shows the stockings in the colour each person reported (tagged REPORTED COLOURS, an illustration of the words, not a measurement). Cloth swish on each colour change.",
  ["Dateline KENDAL on 'One day in Kendal'.", "Stockings in; label A SHOP WINDOW on 'shop window'.", "Label FOR HIS MOTHER on 'mother'.",
   "Colour eases to a dark blue-grey on 'dark colour'; label JOHN'S VIEW.", "Quote tag 'A BLUISH DARK DRAB' (Lonsdale 1874) on 'bluish'.", "Hold."]),
 (31, 35, "VIS-035", "TXT-009, TXT-010", "MOT-003", "TRN-001", "SFX-021", "MUS-007", "", "", "SRC-037",
  "", "Calm. Same shot: the reported colours flip.",
  ["Label HIS MOTHER on 'mother opens'.", "Colour flips to cherry red on 'cherry'; quote 'AS RED AS A CHERRY'.", "Back to dark on 'John can't see it'; label JOHN.",
   "Label JONATHAN joins JOHN on 'Jonathan'.", "Both DARK, MOTHER RED, side by side on 'the stockings are dark'."]),
 (36, 38, "VIS-035", "TXT-009, TXT-010", "MOT-001", "TRN-001", "", "MUS-007", "", "", "SRC-037",
  "", "Calm. The deadpan line: the three labels hold side by side (JOHN · DARK, JONATHAN · DARK, MOTHER · RED); the bed dips under 'quite sure she's right' (MUS-007 dip); nothing else moves.",
  ["Three labels hold.", "Hold; bed dips.", "Hold to the cut after 'right.'"]),
 (39, 44, "VIS-008", "TXT-009, TXT-010", "MOT-002", "TRN-012", "SFX-024, SFX-016", "MUS-007, MUS-010", "", "", "SRC-013, SRC-011, SRC-037",
  "Yes: VIS-008 SplitComparisonCard (build)",
  "Calm. TRN-012 colour block in the stockings' cherry red (the colour is the subject), on 'So,'. VIS-008: the flower, the candle and the stockings side by side; each gets a SAME stamp (paper tap); on 'Only the person looking changes' the three fade back and the two names JOHN and JONATHAN come forward.",
  ["Block, then the three panels; line WHAT STAYS THE SAME? on 'look at'.", "Flower and candle stamped SAME.", "Stockings stamped SAME.",
   "Panels dim; line ONLY THE PERSON LOOKING CHANGES.", "Line THE ODD THING ISN'T THE FLOWER.", "Names JOHN · JONATHAN come forward on 'two brothers'; break and impact after 'brothers.' (MUS-010, SFX-025)."]),
 (45, 54, "VIS-024", "TXT-009, TXT-010", "MOT-002", "TRN-007", "SFX-018", "MUS-007, MUS-011", "", "", "",
  "Yes: VIS-024 ScaleField (build as a unit dot grid); source line Birch 2012 (no page shown)",
  "Calm. TRN-007 slide (bass drop-out). VIS-024 unit grid: dots light one by one with a soft tick (SFX-018, creative); source line BIRCH 2012 · J. OPT. SOC. AM. A under every count.",
  ["Line THEY AREN'T RARE on 'rare'.", "Term COLOUR BLINDNESS (red-green) set large on 'colour blindness'.", "100 dots; 8 light on 'eight in a hundred'; label MEN OF EUROPEAN DESCENT.",
   "Label TROUBLE TELLING SOME REDS AND GREENS APART.", "Grid widens to 1,000 dots.", "4 light on 'four in a thousand'; label WOMEN OF EUROPEAN DESCENT.",
   "A room of 50 dots on 'room of fifty'.", "4 light on 'about four'.", "Label MEN IN CHINA AND JAPAN: 4-6.5% on 'China and Japan'.", "Label STILL THERE on 'still there'."]),
 (55, 58, "VIS-020", "TXT-009, TXT-015", "MOT-002", "TRN-011", "SFX-024", "MUS-007", "", "", "",
  "", "Calm. TRN-011 band. KineticLine from the inside: the four words, each filling in its colour (TXT-015, 4 of the act's 6 fills).",
  ["Line PICTURE IT FROM THE INSIDE.", "Line YOUR WHOLE LIFE (small).", "GRASS fills green, BLOOD fills dark red.", "CHERRIES fills red, SKY fills sky-blue."]),
 (59, 62, "VIS-017", "TXT-010", "MOT-003", "TRN-001", "", "MUS-007", "", "", "",
  "Yes: VIS-017 limit raise (see the new-assets list)",
  "Calm. SwatchRows: two rows, YOU and EVERYONE ELSE, both cells named RED; YOUR cell a slightly different red (tag ILLUSTRATIVE: nobody can show what another person sees).",
  ["Rows YOU / EVERYONE ELSE, both named RED on 'same colour names'.", "Hold on 'nobody has ever'.", "YOUR red shifts slightly on 'your red is different'; tag ILLUSTRATIVE.", "EVERYONE ELSE row dims on 'Nobody else can see'."]),
 (63, 65, "VIS-016", "TXT-010", "MOT-001", "TRN-006", "SFX-020", "MUS-007", "", "", "SRC-013",
  "", "Calm. TRN-006 push-through from YOUR red swatch into the geranium by candle (warm grade); swatches SKY-BLUE then RED on 'changes colour'.",
  ["Geranium by candle on 'one evening'.", "Swatch SKY-BLUE turns RED on 'changes colour'.", "Label ALMOST NOBODY ELSE SEES IT on 'nobody else'."]),
 (66, 68, "VIS-020", "TXT-009, TXT-015", "MOT-002", "TRN-001", "", "MUS-007", "", "", "",
  "", "Calm. KineticLine on the geranium's colours: A SCIENTIST, then WHY? filling in Dalton's red (the act's 5th fill). Act 3 starts on the next frame.",
  ["Line A SCIENTIST on 'scientist'.", "Line NOT ENOUGH TO KNOW HE'S DIFFERENT.", "WHY? fills red on 'why'; hold to the end."]),
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
        rows.append([beat, 2, st, en, spoken(k, line), s[2], s[3], s[4], s[5] if first else "TRN-001", L, s[6] if first else "", s[7], s[8], s[9], "",
                     s[10], "", s[11] if first else "", (s[12] + " " if first else "") + notes[k - a]])
        covered.append(k)
assert covered == list(range(1, len(C) + 1)), "every beat once"
for r in rows:  # the act's one impact: SFX-025 after 'brothers.' (beat 44), with the MUS-010 break before it
    if r[0] == "E01-A2-44":
        r[10] = "SFX-025"
json.dump(rows, open("act2_rows.json", "w"), indent=1, ensure_ascii=False)
print(len(rows), "rows")
