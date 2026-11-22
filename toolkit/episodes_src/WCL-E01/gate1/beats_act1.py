import json
W=json.load(open('../voice/eleven/01_flower_paced_words.json'))
LEAD=0.8
W=[[w[0],round(w[1]+LEAD,3),round(w[2]+LEAD,3)] for w in W]
L="LOK-009, LOK-010"
# (end_sec, visual, text, motion, transition, sfx, music, packaging, source, new_flag, notes)
B=[
(2.95,"VIS-016","TXT-011","MOT-001","TRN-001","SFX-013, SFX-014","","","SRC-011","NEW: VIS-016, TXT-011, SFX-013, SFX-014; SRC-011 to Active","Calm. Dark; a candle is lit (Mixkit 3458). Match strike at 0.00 s in the 0.8 s lead-in, room tone starts under it. Dateline tag fades up: KENDAL · NORTH OF ENGLAND."),
(6.40,"VIS-016","TXT-011","MOT-002","TRN-001","SFX-014","","","SRC-011","","Calm. Dateline extends: KENDAL · AUTUMN 1792 (locks on 'seventeen ninety-two')."),
(8.60,"VIS-016","","MOT-001","TRN-001","SFX-014","","","SRC-011","","Calm. Pause: the flame settles, slow drift; dateline tag eases to the corner."),
(11.10,"VIS-016","TXT-010","MOT-002","TRN-001","SFX-014","","","SRC-011","","Calm. Label JOHN DALTON · TEACHER on 'John Dalton'."),
(13.60,"VIS-004","TXT-010","MOT-001","TRN-006","SFX-014","","","SRC-013","SRC-013 to Active","Calm. Push-through from the flame's glow into the geranium photo on 'flower', warm candle grade."),
(16.60,"VIS-004","TXT-010","MOT-002","TRN-001","SFX-014","","","SRC-013","","Calm. Label GERANIUM ZONALE locks on 'geranium' (Dalton's own name for it, p.29)."),
(19.50,"VIS-004","","MOT-001","TRN-001","","","","SRC-013","","Calm. Label shrinks to the corner; room tone fades out by 19.4 s; grade drifts from candle-warm to neutral."),
(22.00,"VIS-001","TXT-009, TXT-010","MOT-002","TRN-001","SFX-006","","","SRC-001, SRC-029","NEW: SRC-029 (Dalton 1798 p.30); SFX-006 file","Calm. Paper slide in the pause at 19.50 s. Spread p.29 | p.30 on the tray; highlight p.29's last lines 'the Geranium zonale by candle-light, in the Autumn of 1792'. Source tag: JOHN DALTON · 1798 · P. 29-30."),
(24.20,"VIS-001","TXT-009, TXT-010","MOT-003","TRN-001","","","","SRC-001, SRC-029","","Calm. Highlight runs onto p.30: 'almost an exact sky-blue by day'."),
(26.30,"VIS-017","TXT-010","MOT-003","TRN-001","","","","SRC-001, SRC-029","NEW: VIS-017","Calm. Beside the page, Dalton's swatch DAY: sky-blue locks on 'sky-blue'."),
(29.00,"VIS-017","TXT-010","MOT-002","TRN-001","","","","SRC-001, SRC-029","","Calm. Second swatch CANDLE appears, empty, on 'by the candle'."),
(31.40,"VIS-001","TXT-009, TXT-010","MOT-001","TRN-001","","","","SRC-029","","Calm. Page p.30 fills the tray; slow push towards the line."),
(33.60,"VIS-001","TXT-009","MOT-003","TRN-001","","","","SRC-029","","Peak. Highlight 'astonishingly changed' locks on the word."),
(36.00,"VIS-017","TXT-010","MOT-003","TRN-001","","","","SRC-029","","Peak. CANDLE swatch fills red on 'red'; caption: WHAT HE CALLED RED."),
(38.80,"VIS-017","TXT-010","MOT-002","TRN-001","","","","","","Calm. Swatch rows: JOHN blue / red stays; FRIENDS row slides in on 'friends'."),
(41.40,"VIS-017","TXT-010","MOT-003","TRN-001","","","","","","Calm. FRIENDS: pink / pink, tag NO REAL CHANGE locks on 'candle'."),
(44.00,"VIS-017","TXT-010","MOT-002","TRN-001","","","","","","Calm. FRIENDS row dims; JOHN row brightens on 'only one'."),
(46.10,"VIS-017","TXT-010","MOT-001","TRN-001","","","","","","Calm. Hold; an empty third row waits."),
(49.10,"VIS-017","TXT-010","MOT-003","TRN-001","","","","","","Peak. Third row HIS BROTHER blue / red on 'brother'; name JONATHAN locks on 'Jonathan'."),
(51.70,"VIS-004","","MOT-001","TRN-001","","","","SRC-013","","Calm. The geranium alone, labels gone; slow push."),
(54.20,"VIS-004","","MOT-001","TRN-001","","","","SRC-013","","Calm. Hold, push continues."),
(57.00,"VIS-020","TXT-009","MOT-002","TRN-001","","","","SRC-013","NEW: VIS-020","Calm. Over the flower, one line: WHERE IS THE PINK? reveals on 'where the pink'."),
(59.60,"VIS-016","","MOT-001","TRN-001","","","","SRC-011","","Calm. Back to the candle, wide."),
(62.60,"VIS-016","","MOT-001","TRN-001","","","","SRC-011","","Calm. Hold; flame moves."),
(65.20,"VIS-020","TXT-009","MOT-002","TRN-001","","","","SRC-011","","Calm. Beside the candle: A PIONEER OF ATOMIC THEORY reveals on 'pioneer'."),
(67.80,"VIS-020","TXT-010","MOT-003","TRN-001","","","","SRC-011","","Calm. Small mono line under it: LATER · 1808, A NEW SYSTEM OF CHEMICAL PHILOSOPHY."),
(69.90,"VIS-020","TXT-011","MOT-002","TRN-001","","","","","","Calm. Dateline tag: TWO YEARS LATER."),
(72.20,"VIS-020","TXT-009","MOT-002","TRN-001","","","","","","Calm. Line: AN ANSWER reveals on 'answer'."),
(75.00,"VIS-019","","MOT-002","TRN-001","","","","","NEW: VIS-019","Calm. A simple drawn eye opens in the centre on 'his own eyes'."),
(78.00,"VIS-019","","MOT-003","TRN-001","","","","","","Calm. The eye closes on 'dies'."),
(81.40,"VIS-019","TXT-011","MOT-001","TRN-001","","","","","","Calm. Closed eye holds; dateline tag THE TEST · 1844 fades up."),
(84.80,"VIS-018","TXT-010","MOT-002","TRN-001","","","","","NEW: VIS-018","Calm. Counter appears and starts counting up: 0 YEARS."),
(87.90,"VIS-018","TXT-010","MOT-003","TRN-001","SFX-005","","","","SFX-005 file","Peak. Counter locks at 151 YEARS on 'years'; soft low thump at 86.85 s in the pause."),
(90.25,"VIS-018","","MOT-001","TRN-001","","","","","","Calm. Counter dims; the frame darkens towards the next shot."),
(93.20,"VIS-015","TXT-010","MOT-001","TRN-001","","","","","","Calm. Perspective grid (beat 1 of the episode's 8): Newton's dark room fades up on 'dark room' (dark 0.7), slow dolly; label ISAAC NEWTON on 'Newton'."),
(95.30,"VIS-015","","MOT-002","TRN-001","SFX-001","","","","SFX-001 file","Calm. Grid beat 2 of 8: the shutter hole lights on 'hole'; the beam starts across after 'shutter.' with a soft air swell at 94.60 s. No prism, no spectrum (saved for act 4)."),
(98.60,"VIS-019","","MOT-002","TRN-001","","","","","","Calm. Cut on 'And' to the drawn eye, which opens again on 'open Dalton's eyes'."),
(101.60,"PKG-005","","MOT-002","TRN-001","","MUS-006","PKG-005","","MUS-006 file","Calm. Series title card WHERE COLOUR LIVES with the season sting (no narration)."),
(104.60,"PKG-006","","MOT-002","TRN-001","","","PKG-006","","","Calm. EPISODE 1 · THE MAN WHO SAW PINK (no narration). Act 2 starts on the next frame."),
]
rows=[]; start=0.0
for i,b in enumerate(B,1):
    end=b[0]
    words=[w[0] for w in W if start-0.05<=w[1]<end-0.05]
    REP={"Kendall,":"Kendal,","North":"north","Autumn":"autumn","Evening,":"evening,","1792.":"seventeen ninety-two.","151":"a hundred and fifty-one"}
    words=[REP.get(x,x) for x in words]
    txt=" ".join(words).replace("sky blue.","sky-blue.")
    rows.append({"beat":f"E01-A1-{i:02d}","act":1,"start":round(start,2),"end":end,"line":txt,
      "vis":b[1],"txt":b[2],"mot":b[3],"trn":b[4],"look":L,"sfx":b[5],"mus":b[6],"tex":"","map":"","pkg":b[7],"src":b[8],"new":b[9],"notes":b[10]})
    start=end
json.dump(rows,open('act1_beats.json','w'),indent=1,ensure_ascii=False)
for r in rows: print(r['beat'],r['start'],r['end'],round(r['end']-r['start'],2),'|',r['line'][:70])
spoken=sum(1 for r in rows if r['line'])
print('beats',len(rows),'with voice',spoken,'voice ends',W[-1][2], 'act ends', rows[-1]['end'])
