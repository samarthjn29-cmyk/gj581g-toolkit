# WCL-E01 act 2: Director's brief (directed shots)

Act file `library/src/episodes/ep01-act02.json`. Frames reviewed from `library/out/WCL-E01_act2_v8.mp4` (1920x1080, 30 fps). Written 23 Nov 2026, after the fact: Sam designed and approved these shots before the Director existed, so each brief describes the shot **as built** and the review only asks for changes a viewer would feel.

Times are clip seconds. Word times come from `02_brothers_even_words.json` + 2.4 s. The act file already carries several fixes from `gate3_act2/REVIEW_act1_v17_act2_v8.md` that v8 does not show yet: the map cameras, the Kendal pin time and its soft pop, and the label `untilSec` values in 63+64+65. The brief describes the act file, and the frame review says where a v8 measurement will move.

## 12+13 TravellingMap (band)

| Field | What it says |
|---|---|
| Line | "He's been teaching in Kendal," (27.02-28.32) "a market town on the edge of the Lake District," (28.64-30.60) "since he was fifteen." (30.92-31.78). Clip 26.37-32.30. |
| Subject | Kendal (the teal pin), reached by the route from Eaglesfield. |
| World and why | Emanuel Bowen's 1760 map of Cumberland and Westmorland (SRC-033). **Same place, same time:** printed six years before Dalton was born, so this is the county as he knew it. |
| Period honesty | A period map. Its caption, MAP · EMANUEL BOWEN · 1760 · YALE UNIVERSITY LIBRARY, is on throughout. |
| Entry | A paper band up from the diary card. The Eaglesfield pin shows at 26.47, upper left: his birthplace, carried over from the act's opening map (02-05). |
| Path and landing | The route draws 27.40-28.70 from Eaglesfield down and right to Kendal. Left to right reads as forward in time, and it follows the real journey. The Kendal pin drops on "Kendal" (`pins[1]` 1.39 → about 27.76, landing by 28.35). The camera goes from flat at 0.86 to a 24° tilt at 27.4 (1.8 s), then a 32° tilt closer on Kendal at 30.16 (1.6 s). During 28.6-30.2 the pin sits on the lower-right third (v8: about (1390, 870)). The tag reads KENDAL at 27.98 and KENDAL · WESTMORLAND at 28.80. IN KENDAL FROM AGE 15 (accent) lands centred under the pin at 30.54, on "since". |
| Scale | The tilt turns the map into a table we lean over. The last framing steps closer to the place the story stays in. |
| Action | The pin drops, with an echo ring. |
| Exit | The camera carries the eye to the pin, and the next shot pushes out of it. |
| Eye out | The Kendal pin at the end. In v8 it is at about (1010, 630); with `cams[2]` [1900, 3560] it should sit at about (1045, 730). IN KENDAL FROM AGE 15 is under it at y 860. |
| Sound | air_swish at 26.47 (band). Pencil route texture at 27.40 (-29 dB). soft_pop at 28.36 (-24 dB), in the pause after "Kendal,". Low whoosh at 32.15 into the push. |

## 14+15 FootagePlate (push)

| Field | What it says |
|---|---|
| Line | "That's where the geranium happens." (32.82-34.46) "Dalton takes it for granted that everyone will see the same change," (35.76-38.84). Clip 32.30-38.34. |
| Subject | The geranium. |
| World and why | The flower photo held candle-warm (`warmth` [1, 1]) with `flicker` and light `analogue` grain. **Same time:** the 1792 candle evening, which is what "happens" there. |
| Period honesty | A modern stand-in. The label THE GERANIUM, 1792 dates the event, not the picture. The grain is light, and it reads as candlelight, not as an old photograph. |
| Entry | A push from `focus` [1248, 910] (see the frame review). |
| Path and landing | The photo fills the frame, with the bloom centre at about (980, 740). THE GERANIUM, 1792 rises at 33.46 on "geranium" at (1240, 820), on the lower-right third, and un-wipes at 35.98. WHAT DO YOU SEE? (accent) rises at 36.18, centred at (960, 860): the question Dalton is about to put to his friends. |
| Scale | None (drift). |
| Action | The candle flicker. |
| Exit | A focus match (blur dissolve) to Dalton's p. 30 at 38.34, on "change,". |
| Eye out | The centred question under the bloom. The page and its quote come up across the whole frame, and the first highlight follows at 39.70. |
| Sound | Low whoosh at 32.15 for the push. Candle room tone SFX-014 runs 32.30-38.34 (fades 0.8/0.6 s). |

## 16+17+18+19+20+21 ArchivalScanCard (match)

| Field | What it says |
|---|---|
| Line | "...the same change, so he asks around." (38.34-40.34) "He was surprised, he wrote later, to find they all agreed." (41.64-45.12) "By candle, the colour was not much different from daylight." (46.16-48.98) "Except, he says, for his brother, 'who saw it in the same light as myself'." (50.03-54.55). Clip 38.34-55.20. |
| Subject | Dalton's own sentences on p. 30 (SRC-029), lit in the order Sam reads them, ending on the brother's line. |
| World and why | A plain paper ground. **Same object family:** the page lies on paper and nothing competes with it. |
| Period honesty | A period page (1798), with the source tag JOHN DALTON · 1798 · P. 30. |
| Entry | A focus match: the flower blurs out as the page blurs in, in place. Nothing is carried, and the frame resets calmly. |
| Path and landing | The page card fills the left. The quote is fixed on the right third (x 1110-1780, y 320-480). The highlights land on their words: 39.70 "requested some of my friends..." (on "asks"); 41.88 "surprised"; 44.20 and 44.45 "they all / agreed,"; 47.52 "not materially different"; 50.03 "except my brother", with `callout` dim 0.7 so only the lit lines stay bright; 51.83 "who saw it in the same light as myself." |
| Scale | None. |
| Action | Seven highlight sweeps, then the callout dim. |
| Exit | A push from `focus` [700, 640] into the 1874 title page. |
| Eye out | The last highlighted line (x 180-810, y 640). The push opens from that line. |
| Sound | SFX-006 at 38.70 (-21 dB) as the page sharpens. Low whoosh at 55.05 into the push. |

## 22+23+24 ArchivalScanCard (push)

| Field | What it says |
|---|---|
| Line | "There's another story about the two brothers." (55.85-57.59) "It comes from a biography written thirty years after John died, so it may have grown in the telling." (58.63-63.53). Clip 55.20-64.18. |
| Subject | The 1874 title page of Lonsdale's *The Worthies of Cumberland: John Dalton* (SRC-036), then the warning notes. |
| World and why | A dark, blurred collage of the act's earlier sources (his pages, the portrait, the 1760 map). **Same idea:** the evidence so far, with a later and weaker source laid on top of it. |
| Period honesty | A period book page (1874). The title is set without quote marks (`quoteMarks` false), so it is not presented as a quote. |
| Entry | A push from [700, 640], the brother's line on p. 30. The new page opens out of the sentence it retells. |
| Path and landing | The title page sits on the left (x 120-700). JOHN DALTON, F.R.S. is highlighted at 55.70. The title and HENRY LONSDALE · LONDON, 1874 sit on the right. The notes stack under the source tag on their words: AS THE STORY GOES at 56.09, A BIOGRAPHY at 59.39, 1874 · 30 YEARS AFTER HE DIED at 60.11 (with "1874" lit on the page), and MAY HAVE GROWN IN THE TELLING (accent) at 62.10. |
| Scale | None. |
| Action | The notes stack, ending on the accent warning. |
| Exit | A cut to SourcePageStory, whose p. 99 slides in from the right. |
| Eye out | The accent note at about (1100, 790). The incoming page settles at frame centre, inside 25%. |
| Sound | Low whoosh at 55.05, in the pause before "There's". The notes are silent. |

## 63+64+65 FootagePlate (push)

| Field | What it says |
|---|---|
| Line | "Then one evening, a flower changes colour," (160.83-163.69) "and almost nobody else sees it happen." (164.15-166.25). Clip 160.30-166.90. |
| Subject | The geranium and what Dalton called it. |
| World and why | The flower photo going from day to candle (`warmth` [0, 1] over 162.95-164.15, with flicker). **The change itself**, the same device as the geranium model in DIRECTOR_NOTES. |
| Period honesty | A modern stand-in. SKY-BLUE · HIS WORDS and RED · HIS WORDS mark the colour names as his report, not as the photo's colours. |
| Entry | A push from `focus` [1180, 450], the YOU swatch on the SwatchRows card. "Your red" opens into Dalton's flower. |
| Path and landing | The photo fills the frame, with the bloom centre at about (980, 740). SKY-BLUE · HIS WORDS shows at (1240, 820), 160.70-162.60. RED · HIS WORDS (accent) shows at (1240, 760), 163.05-166.05, on "changes colour". ALMOST NOBODY ELSE SEES IT is centred at (960, 860), 164.25-166.20, on "almost nobody". |
| Scale | None. |
| Action | The warmth turns from day to candle. |
| Exit | The labels un-wipe (166.05 and 166.20) before the focus match at 166.9, in the pause 166.25-167.55. |
| Eye out | The bloom centre. The next shot's blurred ground face is centred at about (900, 560), so the blur dissolve passes the centre of the flower into the centre of the face. |
| Sound | Low whoosh at 160.15 for the push. Room tone SFX-014 160.30-162.38. air_swish at 166.82, in the pause. |

## 66+67 KineticLine (match)

| Field | What it says |
|---|---|
| Line | "Dalton, though, is a scientist." (167.55-169.23) "It's not enough for him to know that he's different." (170.27-172.43). Clip 166.90-172.95. |
| Subject | Dalton (the portrait card) and the word "scientist". |
| World and why | The same portrait, enlarged and blurred, behind the card (`ground` blur SRC-004). **Same person:** the man, then the record of him. |
| Period honesty | A period portrait, with JOHN DALTON · 1834 in the corner from frame 0. |
| Entry | A focus match from the flower. The card is in place on the right third from the first frame (x 1160-1770, y 160-920). |
| Path and landing | Dalton looks left into the frame, toward the words, so the left side is his lead room. "A scientist." lands on the left at 167.55 (x 120-610, y 385). The teal mark fills "scientist" at 168.83, on the word. NOT ENOUGH TO KNOW HE'S DIFFERENT types out at 170.57 (y 480). |
| Scale | None. |
| Action | The word fill, then the typed mono line. |
| Exit | A paper band up into the BuildUpMap at 172.95. |
| Eye out | The mono line at about (480, 480). The next shot's focus node, "The odd one out", lands at about (530, 725): 50 px across and 245 px down, inside 25%. |
| Sound | air_swish at 166.82 for the match. Typewriter run at 170.57 (-23 dB) under the typed line, as texture. |

## Frame review

Stills checked: the outgoing last frame, first frame, about 0.4 s in, the midpoint, every label, pin or highlight landing, the last frame and the next shot's first frame, all from v8.

**12+13: PASS.** The route runs from birthplace to Kendal, left to right, along the real journey. The pin lands on the lower-right third with the route's lead room behind it, and the centred label reads as its callout. The map-edge, pin-timing and dateline-overlap items are the reviewer's and are being fixed.
- Check on the fixed render: at 31.9-32.27, the pin should sit at least 60 px above the top of IN KENDAL FROM AGE 15 (y 830).

**14+15: NOTE (rank 1).** The push opens the geranium from `focus` [1248, 910]. That is empty map, about 240 px right of and 280 px below the Kendal pin (v8: (1010, 630)), and just past the end of the IN KENDAL label. The eye is on the pin, and the line is "That's where the geranium happens". The flower should open out of Kendal itself, not out of a blank patch of map to its lower right.
- Change: `14+15.focus [1248, 910] → the pin's frame position on the last map frame`. That is about [1045, 730] with the fixed `cams[2]`, or [1010, 630] on v8. Read it off the 32.27 still of the fixed render.
- Check stills at 32.34 and 32.45.

**16+17+18+19+20+21: PASS.** The highlights follow Sam's words in order, and the callout dim isolates the brother's line. The push out opens from that line.
- Taste, not a note: the quote is on screen from 38.34, about 14 s before its words. Act 1 has already named Jonathan, so it is not a spoiler, and it matches the ArchivalScanCard design Sam approved.

**22+23+24: PASS.** The push comes out of the sentence it retells. The page on the left is balanced by the title and the stacked notes on the right, and the accent warning lands last, on its words.

**63+64+65: PASS.** The push comes out of the YOU swatch. The labels stay off the bloom centre and, with the review's `untilSec` fix, leave before the match.

**66+67: PASS.** The card sits on the right third with Dalton facing into the frame. The words fill his lead room. The blur dissolve passes the flower's centre into the ghost face's centre, and the eye hands off to the next node inside 25%.

**Act 2 totals: 5 PASS, 1 NOTE.**
