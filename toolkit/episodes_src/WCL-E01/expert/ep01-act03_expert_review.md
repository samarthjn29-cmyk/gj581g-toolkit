# WCL-E01 act 3 "The talk": Subject Expert review

Reviewed 24 Nov 2026 by the Subject Expert (colour vision, visual optics, history of colour science). Material: the
recorded narration a3-01..a3-15 (`gate3_act3/act3_recorded_script.json`), the act file and generator
(`library/src/episodes/ep01-act03.json`, `gate2_act3/make_act3.py`), the components that draw the shots
(`library/src/components/EyeDiagram.tsx`, `SpectrumStrip.tsx`, `LayerStage.tsx`), look sheet v5 and its frames,
extra frames I took from `library/out/WCL-E01_act3_v5.mp4` at 73.0, 73.5, 100, 118, 127.5, 150 and 160 s (no audio),
and the gate 1 on-screen fact-check. I read Dalton's paper again in full, pp.28-45, from the Internet Archive OCR of
*Memoirs* vol. 5. I also ran the Machado 2009 deuteranope matrix on the two cut-outs myself.

Verdicts: **PASS** means scientifically right and not misleading. **FIX** gives the problem, the evidence and the
exact change. **NOTE** means true as it stands but could be sharper, or something the redraw or act 6 should pick up.

**The narration has no FIX. Nothing recorded needs a re-record.** The two FIXes are both on pictures, in shot 6.

---

## 1. Pictures

### Shot 6 `S_prism_world` (74.5-102.1 s): the two spectrum strips

**FIX 1: the lower strip's red end is drawn as a dark *red*.** In `SpectrumStrip.tsx` it is `LOWER.red` =
`wavelengthRGB(650)`, `brightness(0.32) saturate(0.7)`, which reads as maroon (frame 100 s).
- *Problem.* The strip claims Dalton saw a red hue at the red end, and his paper says the opposite. p.31: "My yellow
  comprehends the *red*, orange, yellow, and green of others", and the red part is "little more than a shade, or defect
  of light". He nowhere says he sees redness in the spectrum. The strip also ends up with **four** clearly different
  hues (maroon, yellow, blue, dark blue) right above the caption "I see only two or at most three distinctions". The
  picture contradicts the quote it illustrates.
- *Science.* Hunt et al. (1995) give the modern reading. For a deuteranope, the long-wave end has the same hue as
  his yellow and orange and is less luminous than they are, so it looks like a dim shade. Herschel and Brewster
  questioned Dalton and found his red end was not shortened (Hunt et al. 1995, as summarised by Hektoen). So the band
  is dim, the same hue as his yellow, still visibly lit, and full length.
- *Change.* Fill the red band with his yellow, dimmed: `wavelengthRGB(578)` with about `brightness(0.28)`. It can
  get slightly darker toward the far left edge, and it should run straight into the intense start of the yellow band
  so that the red, orange, yellow and green zones read as **one** yellow running dim → intense → pale. Keep it clearly
  above black and keep the full band width. The lower strip then shows exactly what p.31 says: one yellow, then blue,
  then a darker blue ("or at most three"). This also fits shot 5, where the red wax already turns a dark yellow-olive.

**FIX 2: the upper label "OTHERS · DALTON'S SIX".** "DALTON'S SIX" is meant as "the six Dalton lists for other
people". A viewer reads it as "the six colours Dalton sees", the reverse of the point, sitting right above "DALTON'S
WORDS".
- *Change:* **OTHERS · SIX COLOURS** (or **WHAT OTHERS SEE · SIX COLOURS**). Keep **DALTON'S WORDS** for the lower strip.

**PASS: the rest of the lower strip.**
- One yellow under orange, yellow and green, "intense" at the orange end and fading to a pale "rare" yellow at the
  green end. That is p.31 exactly: "the orange, yellow, and green seem *one* colour, which descends pretty uniformly
  from an intense to a rare yellow". It also matches the physiology. "Rare" (dilute) toward green is the colour losing
  saturation as it nears a deuteranope's neutral point, about 500 nm. Graham & Hsia's unilateral dichromat had hers
  at 502 nm, with yellow above it and blue below it.
- The hard edge between the pale yellow and the blue matches p.31: green and blue "seem to be strongly contrasted".
  The print reads "the green part and the yellow part"; the archive copy has a hand correction to "blue", and the
  sense requires blue.
- Blue under blue matches "my blue and purple coincide with theirs".
- The darker blue under purple matches "The purple appears to be blue much darkened and condensed". The p.40 summary
  agrees: "yellow, blue, and purple … the two latter seem to differ more in degree than in kind".

**NOTE: the upper strip.** The equal-width, hard-edged bands are a naming diagram, not a spectrum. That is fine with
the label "SIX COLOURS". A real glass-prism spectrum is continuous and spreads the blue-violet end wider than the red.
No change needed.

### Shot 5 `B_leaf_and_wax` (~71.3 s): leaf and wax → olive #574F18

**PASS (fair, with caveats), plus one recommended picture change.**
- *Is the colour right?* I applied Machado, Oliveira & Fernandes (2009), deuteranopia at severity 1.0 (full
  dichromacy), in linear sRGB to the two cut-outs:
  - Leaf: the original median (53,80,40) simulates to median **#4F4829**.
  - Wax: the original median (150,10,16) simulates to median **#5E5305**.

  The two have almost the same luminance (relative Y 0.078 and 0.097; the originals are 0.080 and 0.077). #574F18
  (Y 0.077) lies between the two simulated medians, so the shared olive is honestly derived. Gate 1 row 9 got about
  #5A5524 from Machado and from Viénot 1999.
- *Is a deuteranope simulation the right model?* Yes. Hunt et al. (1995) found from his DNA that Dalton lacked the
  middle-wave (green-sensitive, "M") cone pigment: he was a deuteranope, a full dichromat. He was not deuteranomalous,
  so severity 1.0 is the correct setting.

**Caveats the team should hold, and say if a viewer asks** (description or pinned comment, not on screen):
1. A dichromat simulation is exact about one thing only: **which colours he could not tell apart.** The *hue* it
   shows (olive/yellow) is a convention. It is taken from people with one normal eye and one colour-blind eye
   ("unilateral dichromats"), who report that the colour-blind eye sees yellows and blues. Brettel, Viénot & Mollon
   (1997) note: "we can never be certain of another's sensations". Dalton's own words support the convention: his
   spectrum is "yellow and blue", and some reds by day are "dark drabs" (p.34).
2. The inputs are today's photos: a modern cherry laurel and modern wax, with a camera's colours, on the viewer's
   uncalibrated screen. They are not his leaf, his wax or his daylight.
3. The match also depends on lightness. Through a red-green-blind eye the two match because they also happen to be
   about equally light (true of these two photos). With a lighter leaf, the simulation would show two olives of
   different lightness.
4. About 8% of men of European ancestry have some red-green deficiency (Birch 2012). For them, shot 5 changes very
   little.

**On-screen label:** "SIMULATION · ONE WAY HE MAY HAVE SEEN THEM" is properly hedged: PASS. Optional sharpening:
**MODERN SIMULATION · ONE WAY HE MAY HAVE SEEN THEM**. "Modern" separates it from Dalton's own blue-jelly idea 70 s
later, and still does not name deuteranopia before episode 2. Put the method in the video description: "Simulation:
deuteranopia, Machado, Oliveira & Fernandes 2009, severity 1.0, applied to today's photos; diagnosis from Hunt et al.
1995".

**NOTE (recommended picture change): the olive is a flat fill.** The carry state is `blend: "replace"`, one flat
colour with the texture faint. In the 73.5 s frame the wax is uniform at about (90,77,22). A simulation of a photo
should transform each pixel. That keeps the leaf's gloss and veins and the seal's emboss, and leaves the two objects
as a near match, the way Dalton said "a good match", not identical swatches. If the pipeline allows it, replace the
flat fill with the per-pixel Machado transform of each cut-out (the matrix is in `make_act3.py`'s source note, row 9).
If not, the flat fill is an acceptable simplification and does not mislead.

### Shot 7 `D_into_the_eye` (102.1-128.1 s): the cross-section

**PASS as a simplified diagram, labelled honestly.**
- Cornea, a lens drawn as a separate solid part (FC2), the vitreous as the large back chamber, and an axial beam
  reaching the back: all correct in kind.
- The proportions are close. At 27.5 px/mm on a 24 mm globe: corneal apex to lens front about 3.4 mm (Le Grand
  schematic eye: 3.6 mm). Vitreous depth about 18 mm (16.7 mm). Axial length about 24.5 mm (24.2 mm).
- VITREOUS HUMOUR sits on the right part.
- The DALTON'S GUESS tag comes in on "Dalton's" (about 121 s), about 4 s before the tint ("It's", about 126 s).

**What is simplified or a little off.** These matter for the redraw, not for v5:
- The lens is about 3 mm thick and 8 mm across, and symmetric. A real lens is about 4 mm thick and 9-10 mm across,
  and biconvex with a **steeper back surface** (Le Grand radii: +10.2 mm front, −6.0 mm back).
- The front face of the vitreous is drawn as a flat vertical wall. A real one is cupped where the lens sits (the
  patellar fossa), and its edge sweeps forward to the ciliary body.
- No iris or pupil, no ciliary body.
- The teal arc at the back (the retina in `EyeDiagram.tsx`) has no label and covers only about ±63°. The real retina
  lines the inside of the globe forward to the ora serrata, well in front of the equator.
- Teaching tag NOTE: for about 4 s, DALTON'S GUESS hangs over the plain, correct anatomy. A viewer could take "the
  eye drawing" as the guess. On the plate, attach the tag to the tint itself (see section 2).

### Shot 9 `C_carry_into_eye` (137.5-161.8 s): the blue jelly and the coloured dots

**PASS. It shows his hypothesis correctly and is labelled as his.**
- Dalton p.42: the humour is "so constituted as to absorb red and green rays principally … and to transmit blue and
  other colours more perfectly". p.43: "probably some modification of blue". Hunt et al. 1995: "selectively absorbing
  longer wavelengths".
- The animation fits that. Red and green dots fade between 55% and 75% of the path, which is inside the vitreous:
  the path runs from x 210 to 1280 and the vitreous starts at about x 790. They keep 30% ("much of", and Dalton allows
  "a few red rays pervading the eye", p.43). The blue dots pass at full strength.
- That is also what a blue filter does: it passes short wavelengths and absorbs long and middle ones.
- DALTON'S GUESS stays up the whole shot, HIS IDEA: DULLER, AND MORE ALIKE is right, and so is PHOTOS TODAY.
- The leaf and the wax stay two colours here, with no olive. Gate 1 row 10c was right to keep the modern model out
  of his mechanism.

**NOTE 1.** Dalton's medium is not a plain blue glass. It "transmit[s] blue *and other colours*". His whole
explanation of red wax depends on its orange and yellow getting through (p.44: red bodies "reflect orange and yellow
in greatest plenty, next after red"). Real blue glass would also kill his yellow, and he saw yellow normally (p.34).
The narration's "In Dalton's version" covers this. If the redraw wants to be exactly faithful, add a few
amber/yellow dots that pass, and fade **only** red and green. Optional: it adds a colour the narration does not name.

**NOTE 2.** The blue multiply on the stickers (`multiply BLUE, opacity 0.6`) must not take the wax toward black.
Dalton raised exactly that objection to himself: "I thought red bodies, such as vermilion, should appear black to me,
which was contrary to fact" (p.42). The 160 s frame is fine: dark red and dark green, both duller. Keep it that way.

**NOTE 3.** A realism point for the plate. The absorption in a coloured medium builds up from where light enters it
(Beer–Lambert). The dots should start fading as they cross the front face of the vitreous and keep fading, rather
than switching off in a band mid-vitreous. This is a small change in `absorb.from`.

### Other shots

- p.43 cards (shots 8, 10), Henry strip (12), Newton chips (13): text checked by gate 1. Nothing about the eye is
  claimed beyond the quotes. PASS.
- Shot 11 (newspaper eyes, Wellcome eye model): no science claim. PASS.

---

## 2. The redrawn anatomical plates (shots 7 and 9): what they must get right

These are two plates of the same eye on paper: plate A is the eye as it is, plate B is Dalton's guess. Draw a
horizontal section, light from the left, schematic but in true proportion. Base the proportions on the Le Grand
full theoretical eye, scaled to the 24 mm globe.

**Parts to draw, front to back:**
1. **Cornea.**
   - Clear, thin (0.55 mm).
   - About 11.5-12 mm across.
   - More strongly curved than the white of the eye (radius 7.8 mm against about 12 mm), so it bulges about 1 mm
     beyond the globe's circle.
2. **Aqueous humour.**
   - Fills the front chamber, about 3 mm from the back of the cornea to the lens.
   - Plus a thin space behind the iris.
3. **Iris with the pupil.**
   - A thin diaphragm resting on the front of the lens.
   - Pupil opening about 3-4 mm, on the axis.
   - Its root joins the ciliary body.
4. **Lens.**
   - Biconvex, about 4 mm thick and 9-10 mm across.
   - **Back surface more curved than the front.**
   - Its centre about 5.5 mm behind the front of the cornea.
   - Hung from the ciliary body by fine zonule fibres (thin lines are enough).
   - Untinted: no yellow or blue on the lens on either plate.
5. **Ciliary body.** A small wedge behind the iris root, on each side.
6. **Vitreous humour.**
   - The largest part, about 16-17 mm deep along the axis and about 80% of the eye's volume.
   - Its front face is **cupped around the back of the lens** and sweeps forward to the ciliary body; not a flat wall.
   - It fills everything behind the lens back to the retina.
7. **Retina.**
   - A thin layer lining the inside of the back of the globe, running forward almost to the ciliary body, not just a
     cap at the back.
   - The light lands here ("the back of the eye").
8. **Optional:** sclera and choroid as the wall layers, and the optic nerve leaving the back. If the nerve is drawn,
   place it about 15° (3-4 mm) to the **nasal** side of the axis, never on the line of sight. The fovea is where the
   axis meets the retina.

**Labels.**
- At minimum **VITREOUS HUMOUR** (large) and **RETINA**. CORNEA, LENS, IRIS and AQUEOUS HUMOUR can be small, in
  plate-caption style.
- If the plate uses 18th-century naming, the lens may carry "crystalline humour" as a small secondary label. That
  is accurate to Dalton's time (see a3-10), but do not place it among "the fluids".
- Plate A caption: **THE EYE · SIMPLIFIED**. No DALTON'S GUESS on plate A.

**Light path.**
- A single straight axial ray to the retina is correct and enough.
- If a converging bundle is drawn instead, bend it **mostly at the cornea** (about two-thirds of the eye's focusing
  power), a little more at the lens, and meet at the retina. This would be a generic eye: Dalton himself was
  short-sighted ("Concave glasses of about five inches focus suit me best", p.31). Do not caption the focus as his.

**Plate B (Dalton's guess).**
- The same plate, with the blue wash in the **vitreous only**, not the lens or the aqueous.
- The wash should read as *added* to the plate: a hand-laid watercolour wash or a tinted overlay, not printed anatomy.
- Attach the tag to the wash with a leader line: **DALTON'S GUESS · A BLUE VITREOUS**. Keep the plate itself
  untagged so the anatomy reads as fact and the tint as the guess.
- A light sky-blue suits his source, "a sky-blue transparent liquid" (p.41). Keep the act 1 blue if continuity needs
  it.
- Dots: red and green fade from the front face of the vitreous onward, with some left at the retina; blue passes. If
  wanted, an amber dot also passes (NOTE 1 above).
- Act 6 will show the humours "perfectly pellucid" (Ransome). Plate A, the clear vitreous, is the image to return to
  there.

---

## 3. Narration, line by line

| Line | Verdict | Comment |
|---|---|---|
| a3-01 | PASS | Not a science claim (date checked at gate 1). |
| a3-02 | PASS | "Natural philosophy … the old name for the study of nature": fair. |
| a3-03 | PASS | Title as printed, p.28. |
| a3-04 | PASS | The paper does list colours by heads with matches (pp.32-37). |
| a3-05 | PASS | p.34 verbatim in sense. "Laurel" is cherry laurel (*Prunus laurocerasus*), as photographed. |
| a3-06 | PASS / NOTE | Red and green are opponent hues, so "about as different as two colours get" is fair for most viewers. NOTE: "To you" will not hold for the roughly 8% of men of European ancestry with red-green deficiency (Birch 2012), and for them the leaf and wax may already look alike. Nothing to change; a possible line for the description or a later act. |
| a3-07 | PASS / NOTE | The quotes and "two, or at most three … Yellow and blue. Or yellow, blue and purple" match p.31. "Almost no light at all" is a fair plain-words gloss of "little more than a shade, or defect of light", **as his report**. NOTE: physiologically, a deuteranope's red end is dim but clearly visible and not shortened (Hunt et al. 1995; Herschel and Brewster). Keep the pictures showing a dim, lit band (FIX 1), not black. "Six colours" is Dalton's convention (Newton had seven); fine. |
| a3-08 | PASS | — |
| a3-09 | PASS | The vitreous is a clear gel filling about 80% of the eye; light crosses it to the retina. Calling it a "fluid" and "humour" is fine at this level. "Isn't hollow" is good. |
| a3-10 | PASS / NOTE | p.43: "one of the humours of my eye … is a coloured medium, probably some modification of blue. I suppose it must be the vitreous humour". Correct and clearly his guess. NOTE: in Dalton's day "the humours" were three: aqueous, **crystalline (the lens)** and vitreous. So his "one of the humours" included the lens, which the line's "one of these fluids" leaves out. Harmless; worth knowing for the plate label. |
| a3-11 | PASS / NOTE | Correctly framed as "In Dalton's version". p.42: absorbs "red and green rays principally". p.44: "red and green to us will be nearly alike". "Duller and more like each other" is his conclusion. NOTE for act 6: looking through blue glass does **not** make a normal observer confuse red and green the way Dalton did. Dalton himself recorded that colours seen through a sky-blue liquid by candlelight appeared "to me as well as to others the same as by day-light" (p.36). A filter in front of three normal cone types changes every colour but leaves three channels. Dalton's confusions (whole families of colours collapsing onto one another) need one channel missing, which is Young's 1807 idea and the DNA answer. That is the cleanest scientific reason the blue-jelly idea fails, on top of Ransome's clear humours. |
| a3-12 | PASS | p.43 quote exact. The gloss ("a tint anywhere easier to see would have been noticed") is right: the cornea, aqueous and lens can be looked into through the pupil; the vitreous behind the lens could not, in 1794. |
| a3-13 | PASS | True for his lifetime. The ophthalmoscope came in 1851, after his death in 1844. |
| a3-14 | PASS | Henry 1854 p.25, "strongly expressed wish" (gate 1). |
| a3-15 | PASS / NOTE | Dalton does lean on Newton: p.42, "Newton has sufficiently ascertained, that opake bodies are of a particular colour from their reflecting the rays … of that colour more copiously". Newton died 1727 and Dalton was born 1766, so "long before" holds. NOTE: for the transparent-filter step he also cites Delaval (p.42). "One man" is fair for "what colour is", which is Newton's theory of light, but not for the whole hypothesis. |

---

## 4. What a specialist would add (if it fits the story)

1. **Act 6, the strongest refutation:** "a filter can dim colours; it can't take one away". This is the a3-11 note
   above, and Dalton's own sky-blue-liquid observation on p.36 is a gift for it.
2. **The one humour that really is coloured is the lens, and it is yellowish, not blue.** It yellows with age and
   absorbs blue light, the opposite of his guess. This also explains Henry's "pale yellow" vitreous line, which gate 1
   asked to crop. It belongs in act 6 if anywhere; not needed in act 3.

## 5. Limits of this review

- The anatomical numbers are the Le Grand schematic eye, from one tabulation (Biomed Opt Express 2013, table 1).
  The iris, ciliary body and retina extent are standard anatomy that I state from textbook knowledge and did not
  re-source here. An ocular anatomist or optometrist could sign off the final plate in one look.
- I read Hunt et al. (1995) through its PubMed abstract and a secondary summary (Hektoen), not the full text. The
  reconciliation of "defect of light" with deuteranopia is reported there, so read the full paper if FIX 1's wording
  goes on screen.
- A colour-vision researcher reading the script once, for example someone in the Cambridge group that did the 1995
  DNA work, is still the gold standard. Whether to ask is Sam's call.

## Sources

- Dalton, J. (1798). Extraordinary facts relating to the vision of colours: with observations. *Memoirs of the
  Literary and Philosophical Society of Manchester* 5, 28-45 (read 31 Oct 1794). Internet Archive OCR and page
  images: https://archive.org/details/memoirsofliterar05manc (pp.31, 34, 36, 40-45 quoted above).
- Hunt, D.M., Dulai, K.S., Bowmaker, J.K. & Mollon, J.D. (1995). The chemistry of John Dalton's color blindness.
  *Science* 267, 984-988. https://doi.org/10.1126/science.7863342 (abstract via PubMed).
- Franklin, J.L. John Dalton's eyes: a history of the eye and color vision, parts one and two. *Hektoen International*
  (secondary: Ransome's examination; Hunt et al.'s reconciliation; Herschel and Brewster; Young).
  https://hekint.org/?p=791 · https://hekint.org/2017/01/22/john-daltons-eyes-a-history-of-the-eye-and-color-vision-part-two/
- Brettel, H., Viénot, F. & Mollon, J.D. (1997). Computerized simulation of color appearance for dichromats.
  *JOSA A* 14, 2647-2655. https://doi.org/10.1364/josaa.14.002647
- Graham, C.H. & Hsia, Y. (1958). Color defect and color theory (unilateral dichromat; neutral point 502 nm).
  *Science* 127, 675-682. https://doi.org/10.1126/science.127.3300.675
- Machado, G.M., Oliveira, M.M. & Fernandes, L.A.F. (2009). A physiologically-based model for simulation of color
  vision deficiency. *IEEE TVCG* 15, 1291-1298. Matrices:
  https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
- Birch, J. (2012). Worldwide prevalence of red-green color deficiency. *JOSA A* 29, 313-320.
  https://doi.org/10.1364/JOSAA.29.000313
- Le Grand schematic eye values (cornea 7.8/6.5 mm, 0.55 mm; aqueous 3.05 mm; lens +10.2/−6.0 mm, 4.0 mm; vitreous
  16.66 mm; retina −12.5 mm), as tabulated in *Biomed Opt Express* 4(5):667 (2013), table 1.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC3646595/table/t001
- Cleveland Clinic, Aqueous and vitreous humor (vitreous about 80% of eye volume), via gate 1 row 10a.
  https://my.clevelandclinic.org/health/body/24611-aqueous-humor-vitreous-humor
- Henry, W.C. (1854). *Memoirs of the Life and Scientific Researches of John Dalton*, p.25 (via gate 1).
