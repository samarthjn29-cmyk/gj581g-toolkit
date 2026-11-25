# WCL-E01 act 5 "The rays": Subject Expert, Gate 1 (lines and planned pictures)

Reviewer: the Subject Expert (colour vision, visual optics, history of colour science). Written 25 Nov 2026, before any
build. I did not write the script or the brief. Inputs: `rules/EXPERT.md`, `rules/notes/EXPERT_NOTES.md`, the misses in
`REVIEW_SCORECARD.md` (none listed for the Expert yet; act 3 v5's "prism red end" and "DALTON'S SIX" were checked
again here), act 4's Gate 1 review (format), `gate1_act5/WCL-E01_act5_recorded.json`, `director/ep01-act05_brief.md`
(every shot, Builder additions 1-9, fact-check points 1-13), and the code: `SpectrumStrip.tsx`, `layers/spectrum.ts`,
`EyeDiagram.tsx` (plate mode), `layers/RayParticles.ts`, `SwatchRows.tsx`, `LayerStage.tsx`, `KeywordPanel.tsx`.
Sources read on the scans in `library/public/assets/sources/` (OCR checked against the images): Opticks 1704 p.90 and
p.92, the 1672 letter p.3083-3084, Dalton 1798 p.29, p.30 and p.43.

Grades: **MUST** (teaches something false, or contradicts a picture in the same act), **SHOULD** (true but likely to
mislead, or a weaker picture than the science allows), **TASTE** (a specialist's addition).

**Counts: 0 MUST, 5 SHOULD, 5 TASTE, 6 NOTE. Shots that PASS as planned: A0, A, B, C, F, G, J, L, N, P. Every
recorded line PASSES; no wording change is needed.**

---

## 0. How the science is drawn now (checked in the code)

- `SpectrumStrip` (default) maps `fromNm 380` to x 210 and `toNm 700` to x 1710, linear in wavelength, so **violet on
  the left, red on the right**; colours come from `wavelengthRGB` (Bruton's approximation, ends dimmed). `rows`,
  `divisions`, `reverse` and `chord` do not exist yet (Builder 2-4), so the strips below are judged on the brief's
  description, and the profiles I give are what the builder should put in `profile`.
- `EyeDiagram` plate: a 24 mm eye at 23.8 px/mm, centre (1220, 545) on act 3's card, retina at x ≈ 1478, lens back at
  x ≈ 1092, optic nerve leaving ~15° below the axis at about (1496, 618) → (1603, 633). Rays run **straight along the
  axis** from x 714 to 1478 (correct for an on-axis ray: no bend through cornea or lens). The vitreous wash is a
  multiply tint clipped to the vitreous; it does **not** itself filter anything.
- `RayParticles.absorb`: dots of the listed colours fade to `keep` between path fractions `from` and `to`. With O's
  `from 0.52, to 0.7` that is x 1111-1249: **inside the vitreous** (which starts at x ≈ 1092). Right place.
- `LayerStage` "warm" world: a sepia grade and an orange soft-light cast on the carried geranium. A look, not a
  claim; fine with the TODAY labels.

---

## 1. Shots with notes

### B_p90_not_coloured, C_power_quote: PASS
- p.90 (1704), DEFINITION after Book I Part II Prop. II: "For the rays to speak properly are not coloured. In them
  there is nothing else than a certain power and disposition to stir up a sensation of this or that Colour." Both
  quotes are exact. "In plain words, strictly speaking, the rays have no colour" is a fair gloss: Newton has just said
  that when he calls rays coloured he speaks "grossly", "according to such conceptions as vulgar People ... would be
  apt to frame". That is why O's legend rightly says "red-making", not "red".
- NOTE 1: the same page also says "Colours in the Object are nothing but a disposition to reflect this or that sort of
  rays more copiously than the rest". So "colour isn't **really** in the flower" (a5-05) is right only with the
  "really": Newton keeps a disposition in the object. The recorded hedge is enough.

### D_sunlight: SHOULD 1
- White rays, three sizes for "many kinds", tag `ILLUSTRATION · RAYS DRAWN WITHOUT COLOUR`: PASS. Honest and exactly
  the act's point.
- **SHOULD 1: the outgoing light is the same mix as the incoming light.** The brief sends out "the same three kinds"
  at the same counts (5/5/5). Nine seconds later H says "A geranium sends back one mix ... choosing from it". So D
  shows a flower that returns the whole of daylight unchanged, which is what a white petal does. **Change (no hue
  added):** outgoing rays `size 5: count 5, size 7: count 2, size 9: count 5` (the middle kind thinned, standing for
  the green the petal absorbs). Incoming stays 5/5/5. The label `ISN'T PINK` stays: the dots are still white.

### E_whoever_looks: SHOULD 2, NOTE 2
- **SHOULD 2: "seen as pink" points at the retina.** The leader runs to (1440, 700), on the back wall. With a pink
  square beside it, the plate reads "the back of the eye turns pink" or "the pink is made in the retina". Newton puts
  the sensation in "the Sensorium" (p.90, sound analogy: "in the Sensorium 'tis a sense of that Motion"). The modern
  answer also puts the colour beyond the retina (cones start it, the brain makes it). The line says "whoever is
  looking", a person, not a surface. Fact-check point 5 asked for exactly this. **Change:** anchor the caption to the
  optic nerve where it leaves the plate, `anchor [1595, 632]` (the nerve tail on this card). The caption keeps its
  place (1180, 905). The leader then runs up the outside of the globe (at y 800 the globe ends at x ≈ 1348). Leave
  the "Retina" caption as it is.
- NOTE 2: "a kind of push" for "power and disposition" is a fair plain word. Newton's own picture is motion: p.90
  compares it to a bell's "trembling Motion" carried by the air. Opticks Query 12 has rays exciting "Vibrations in the
  Tunica Retina". "Push" is not wrong; see TASTE 1.

### F_newtons_view: PASS
- `where the light meets a person`: right as Newton's view, and right today.

### G_p3084_reflect: PASS
- p.3084 ¶13 is printed as quoted ("varioufly qualified to reflect one fort of light in greater plenty then another").
  "Sending back" for "reflect" is fine.

### H_choosing: NOTE 3
- Same daylight in, two different returns out, `painting` struck, `choosing` kept: PASS. In modern terms this is
  selective absorption (anthocyanin in the petal, chlorophyll in the leaf). The tag `SIMPLIFIED, NOT MEASURED` is honest.
- Daylight strip "all colours full": fine as a simplification (D65 is roughly flat across 400-700 nm).
- NOTE 3, the profiles (so the builder does not invent them): pink and purple petals reflect at short and long
  wavelengths with a dip in the green. When the dip is a shallow "saddle", the flower reads pink (Chittka et al.
  1994). Anthocyanin absorbs most near 530-550 nm (Iriel & Lagorio 2009, pink petals: 533 nm). Leaves reflect little
  everywhere, peak near 550 nm, and always turn up at 700 nm (the red edge). Most of what a leaf reflects is
  near-infrared, which is off the strip. Suggested `profile`s (red on the left as `reverse`):
  geranium `[[400,0.45],[450,0.5],[500,0.3],[540,0.2],[580,0.35],[620,0.8],[700,0.9]]`;
  leaf `[[400,0.05],[450,0.06],[500,0.12],[550,0.35],[600,0.15],[670,0.05],[700,0.2]]`.
  The leaf's peak stays well below the petal's red, because the leaf is the darker thing.

### I_by_candle: SHOULD 3
- The line and the idea are right: a candle is a soot glow of about 1,800-1,900 K (1,819 K measured for a paraffin
  candle, Chen et al. 2020; "candle or kerosene lamp 1900 K", Macleod 1975). It is much yellower, with far less blue.
  The `THE GERANIUM'S MIX, BY CANDLE` strip as petal × candle is the right operation. PASS on those.
- **SHOULD 3: the candle ramp is far too generous in the blue.** The brief has "full at the red end fading to about a
  sixth at the violet end", a straight ramp. Planck at 1,900 K, relative to 700 nm: 650 nm 0.63, 600 nm 0.36, 550 nm
  0.17, 500 nm 0.07, 450 nm 0.022, 400 nm 0.005. Against flat daylight, the blue is about 1/45 of the red, not 1/6,
  and green is under a fifth, not about half. That matters for J. With a sixth of the blue left, the petal's
  blue-violet return would still be a real part of its mix, and "not having then any blue in it" (Dalton p.30) would
  not follow from the picture. **Change:** `CANDLELIGHT profile [[400,0.005],[450,0.02],[500,0.07],[550,0.17],[600,0.36],
  [650,0.63],[700,1]]`, drawn in linear light (or the strip's dark end will be lifted by display gamma). Keep
  `FAR LESS BLUE` and its bracket as planned; the tag `ILLUSTRATION · NOT MEASURED` stays true (shape after a 1,900 K
  glow, no numbers). The geranium-by-candle strip is then the product of this candle profile and NOTE 3's geranium
  profile: red strong, the blue end practically black.

### J_most_people: PASS, NOTE 4
- Dalton p.29-30: "almost an exact sky-blue by day; in candle-light ... not having then any blue in it, but being what
  I called red". His friends "all agreed, that the colour was not materially different" (except his brother).
  `NO REAL CHANGE` and `REPORTED COLOURS · DALTON 1798, PP. 29-30` match the page.
- Consistent with deuteranopia (Hunt et al. 1995: DNA from his eye shows no middle-wave pigment). The petal's red
  excess and its blue excess are told apart only along his blue-yellow axis. By day the blue excess wins (sky-blue).
  By candle the blue is gone, and what is left he called red.
- NOTE 4: the RED swatch is his word, not his sensation (EXPERT_NOTES, act 3: his red end is his yellow, dimmed). The
  `REPORTED COLOURS` label covers it, and these are act 1's approved hexes. If a sub-label fits, `RED (HIS WORD)`
  would be exact.

### K_seven: PASS, NOTE 5
- p.92 checked on the scan: "the intervals Mα, αγ, γε, εη, ηι, ιλ, and λG, will be the spaces which the several
  Colours ( red, orange, yellow, green, blue, indico, violet ) take up". GX : λX : ιX : ηX : εX : γX : αX : MX =
  1, 8/9, 5/6, 3/4, 2/3, 3/5, 9/16, 1/2, with MX = GM. **M is the red end (MαF is "the red"), G the violet end.**
  Widths of GM: red 1/8, orange 3/40, yellow 2/15, green 1/6, blue 1/6, indigo 1/9, violet 2/9 (sum 1). Boundaries
  x 210, 397.5, 510, 710, 960, 1210, 1376.7, 1710: arithmetic confirmed (fact-check 3).
- The steps are T S T T T S T (9/8, 16/15, 10/9, 9/8, 10/9, 16/15, 9/8): the Dorian mode on D, Newton's
  "sol, la, fa, sol, la, mi, fa, sol". "The seven steps of a musical scale" (a5-09) is right.
- Fills: `wavelengthRGB(470)` for BLUE is a cyan-blue and 445 for INDIGO a deep blue. That fits the usual reading that
  Newton's "blue" is our cyan and his "indigo" our blue. PASS.
- NOTE 5: the widths are those of **his prism's** image (glass spreads the violet end), not of a wavelength scale.
  A0's band is linear in nm, so K's red looks narrower than A0's red. The tag `AFTER NEWTON, OPTICKS, 1704` covers
  it; no change. The flip from A0 (violet left) to K (red left) is 100 s and many shots later, in no room geometry.
  Acceptable (brief Q4).

### M_seven_notes: SHOULD 4
- **SHOULD 4: the note heads sit in the middle of the colours.** Newton maps the colours to the **intervals** between
  notes, the "spaces" between the stops of a string, not to notes. The script says it correctly ("seven steps").
  With a ♪ on each colour, the picture says "each colour is a pitch", the popular myth the line avoids. Second, the
  string in his construction is GX, **twice the band**: X lies a band-length beyond the red end (MX = GM). The band
  is the half of the string between the key and its octave. **Change (Builder 4 `chord`):** draw the string from
  x 1710 (G) **off the left edge** (towards X at x -1290), bridges at the band's boundaries. Put the seven note heads
  **on the stops** G, λ, ι, η, ε, γ, α = x 1710, 1376.7, 1210, 960, 710, 510, 397.5 (key, tone, minor third, fourth,
  fifth, major sixth, seventh). The octave stop at M (x 210) gets a hollow head or none. Drop the ties: the dividers
  already join each stop to the band. On "colours" 122.02, brighten the seven segments one after another (0.08 s
  apart), so the colours read as the steps between the notes. "Seven notes, seven colours" still matches seven heads
  and seven segments. Pitch order stays unstated (fact-check 4): nothing on screen says high or low.
- `?` on indigo, with dashed dividers: PASS. Indigo is the classic doubtful band (Newton saw five colours in the
  1670-72 lectures and added orange and indigo later; Topper 1990; Asimov).

### O_eye_jelly: SHOULD 5, PASS on the tint
- The tint arrives with `DALTON'S GUESS · A BLUE VITREOUS`, never untagged: PASS. p.43: "one of the humours of my eye
  ... is a coloured medium, probably some modification of blue. I suppose it must be the vitreous humour". Hunt et
  al. 1995: he "supposed that his vitreous humor was tinted blue, selectively absorbing longer wavelengths". Red- and
  green-making dots thinning and blue passing matches his account (p.43: "Our eyes only transmit the blue excess").
  The absorption happens inside the vitreous (section 0). PASS.
- **SHOULD 5: three dot colours named red-, green- and blue-making read as "light is made of three kinds of ray".**
  That is the RGB myth, and it is the wrong preparation for the later acts: three is a fact about the eye (cones),
  not about light. Newton's own p.90 list is red-, yellow-, green-, blue-, violet-making "and so of the rest", a
  continuum. **Change (on-screen text only):** legend `ILLUSTRATION` / `DOTS: 3 OF NEWTON'S MANY KINDS` /
  `RED-, GREEN-, BLUE-MAKING`. Or add `#FFD60A` yellow-making dots to `colors` and to `absorb.colors`. Dalton's red
  and "higher colours" go too; his p.43 explanation keeps blue. Either fix is enough; the text one needs no rebuild.
- a5-12 "Colour is what happens when certain rays reach the back of the eye": PASS as Dalton reading Newton (N's
  note `ON NEWTON'S TERMS` frames it). It is the start of the process, not where the colour is (see SHOULD 2).

### P_open_it: PASS, NOTE 6
- The guess named, the dashed line as an illustration only (fact-check 12): PASS.
- NOTE 6 (for act 6, not here): even a truly blue vitreous could not give Dalton's symptoms as he lived them. A filter
  in front of three cone types leaves three signals. It recolours and dims, but it does not collapse colours onto
  one axis. Dalton's confusions (pink with blue, scarlet with green) are the confusions of a missing cone class.
  That, more than the clear humours found in 1844, is why the guess fails. Hunt et al. 1995 then named the class.
  Only the by-day half of his geranium (red removed → blue) fits the filter. By candle, a blue filter would leave a
  dim, dark flower, not his "red".

---

## 2. The script lines (Gate 1)

| Line | Verdict | Note |
|---|---|---|
| a5-01 | PASS | Opticks, London 1704; 32 years after the 1672 letter. The definition is on p.90 of the 1704 edition (scan header). |
| a5-02 | PASS | Exact quote; the gloss is fair (Newton's "grossly" vs "properly"). |
| a5-03 | PASS | Exact quote, p.90. |
| a5-04 | PASS | "Push": fair plain word (NOTE 2). The picture must not show the flower returning the whole light (SHOULD 1). |
| a5-05 | PASS | Newton's view; "really" carries his disposition-in-the-object (NOTE 1). |
| a5-06 | PASS | p.3084 ¶13. "Choosing" = selective absorption; true today. |
| a5-07 | PASS | True; the picture must show how little blue (SHOULD 3). |
| a5-08 | PASS | p.30: "not materially different". "Their eyes still call it pink": fine (constancy is part retina, part brain). |
| a5-09 | PASS | p.92; Dorian steps; the colours are the steps (SHOULD 4). |
| a5-10 | PASS | "Seven notes": popular but acceptable (seven notes, the eighth the octave). The indigo argument is real. |
| a5-11 | PASS | p.29, as printed. |
| a5-12 | PASS | Dalton on Newton's terms; tagged as his guess. |
| a5-13 | PASS | Sets up act 6 (1844 examination). |

---

## 3. Every SHOULD in one line
1. **D:** outgoing rays are the incoming mix; send out sizes 5/7/9 at counts 5/2/5 (still white).
2. **E:** `seen as pink` anchored on the retina; anchor it to the optic nerve, `anchor [1595, 632]`.
3. **I:** candle ramp to "a sixth" overstates its blue about 8x; use `[[400,0.005],[450,0.02],[500,0.07],[550,0.17],
   [600,0.36],[650,0.63],[700,1]]` in linear light, and the geranium-by-candle strip as its product.
4. **M:** notes on the colours and a string the band's length; put seven heads on the stops x 1710, 1376.7, 1210, 960,
   710, 510, 397.5, run the string off the left edge, drop the ties, brighten the segments on "colours".
5. **O:** RGB dots read as "light has three kinds of ray"; legend `DOTS: 3 OF NEWTON'S MANY KINDS` / `RED-, GREEN-,
   BLUE-MAKING` (or add yellow-making dots).

## 4. TASTE (a specialist's additions, if they fit)
1. **Newton's own analogy for the "push"** (p.90): a bell trembles, the air carries the motion, and only in the
   sensorium is it sound. Light and colour work the same way. One line for the description, or a 3-word label in E.
2. **p.92: the seven boundaries were drawn by "an Assistant whose Eyes for distinguishing Colours were more critical
   than mine".** The textbook rainbow was marked by someone else's eyes: a natural tie to Dalton (description, or a
   highlight on L if time allows). Fact-check the wording before use.
3. **Indigo:** Newton's "blue" is probably our cyan and his "indigo" our blue (Rood 1881; Waldman). So the argument is
   partly about words, not the spectrum. Description.
4. **The leaf's real colour is infrared:** most of what a leaf sends back is near-infrared, past the strip's red end.
   Description only.
5. **Tag O's guess with its page:** `DALTON'S GUESS · A BLUE VITREOUS · 1798, P. 43`, if it fits the 20 px mono line.

## 5. Proposed lines for `notes/EXPERT_NOTES.md`
- 2026-11-25 (act 5 G1): a light-source strip follows its physics (candle = ~1,900 K Planck: blue ~1/45 of red), not
  a straight ramp; give the builder the `profile`, in linear light.
- 2026-11-25 (act 5 G1): a caption for a sensation ("seen as pink") points past the retina (optic nerve or out of
  frame), never at the back wall.
- 2026-11-25 (act 5 G1): coloured ray dots never come in exactly red/green/blue without saying "some of many": three
  belongs to the eye, not to light.
- 2026-11-25 (act 5 G1): Newton's colours are the intervals between the string's stops (the spaces), and his string is
  twice the band; notes go on the boundaries.

## Sources
- Newton, *Opticks* (London, 1704), Book I Part II: p.90 (Definition: "rubrific or red-making ... For the rays to speak
  properly are not coloured ... a certain power and disposition"; the bell analogy; "Colours in the Object are nothing
  but a disposition to reflect"); p.92 (Prop. III: the assistant; Mα ... λG; chords 1 ... 1/2; "after the manner of a
  musical Chord"). Scans `newton_opticks1704_p90.jpg`, `_p92.jpg`. Colour circle (Prop. VI): "Sol, la, fa, sol, la, mi,
  fa, sol" (Newton Project / Gutenberg text).
- Newton, letter, *Phil. Trans.* 6 (No. 80, 1672): p.3083 ¶8 ("the yellow flame of a Candle"), p.3084 ¶13.
- Dalton, "Extraordinary facts relating to the vision of colours", *Mem. Lit. Phil. Soc. Manchester* 5 (1798):
  p.29 ("pretty well acquainted with the theory of light and colours"), p.30 (sky-blue / red; "not materially
  different"), p.43 (blue vitreous; "Our eyes only transmit the blue excess").
- Hunt DM, Dulai KS, Bowmaker JK, Mollon JD (1995). The chemistry of John Dalton's color blindness. *Science*
  267:984-988. doi:10.1126/science.7863342 (via PubMed).
- Chittka L, Shmida A, Troje N, Menzel R (1994). Ultraviolet as a component of flower reflections. *Vision Res.* 34:
  1489-1508 (pink = blue and red reflection with a green "saddle"; leaves low throughout, upward slope at 700 nm).
- Iriel A, Lagorio MG (2009). *Photochem. Photobiol. Sci.* 8:337-344 (pink petals, anthocyanin absorption 533 nm).
- Horler DNH et al. (1983). The red edge of plant leaf reflectance. *Int. J. Remote Sens.* 4:273-288.
- Chen J-H et al. (2020). Unveiling the mythical candles. *Building and Environment* (1,819 K paraffin candle);
  Macleod KJ (1975), *Museum Lighting*, CCI Technical Bulletin 2 (candle 1,900 K). Planck ratios computed here.
- Topper D (1990). Newton on the number of colours in the spectrum. *Stud. Hist. Phil. Sci.* 21:269-279; Rood ON (1881),
  *Am. J. Sci.* (indigo); Wikipedia "Visible spectrum" (Waldman, Asimov; secondary).
- Who would know better: J. D. Mollon (Cambridge) on Dalton and on what a filter can and cannot do; A. E. Shapiro on
  Opticks p.92 and the assistant.
