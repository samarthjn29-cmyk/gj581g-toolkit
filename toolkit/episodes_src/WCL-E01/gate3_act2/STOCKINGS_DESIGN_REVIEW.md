# Stockings scene: independent design review (WCL-E01, act 2, 64.83-98.63)

Reviewer: independent motion and graphic designer, brought in fresh. I watched the v6 preview at 1 fps and 5 fps, the v5 act render, the 16-still sheet, `ObjectStory.tsx`, the source photo and mask, the backgrounds study, and the act-2 on-screen fact-check CSV. I changed no project files.

---

## 0. Two findings to read first

**A. The whole anecdote is on one clean, real page, and the narration follows it line by line.** Lonsdale 1874, chapter VI, p.99 (archive.org `worthiescumberl02lonsgoog`, leaf **n120**; p.100 is n121). It is the same Google/NYPL scan as the registered title page (leaf n8). The page has, in order: "passing a shop-window in Kendal, saw a pair of stockings prominently marked—'Silk, and newest fashion'", "bought them as a fitting present for his mother", "On his next visit to Eaglesfield", "appeared to his eyes a bluish dark drab, and quakerish enough", "'They're as red as a cherry, John!'", "But John could not see this, nor could brother Jonathan", "so there were two to one in the dispute, and poor Deborah left in the minority. Being firm in her opinions…". I downloaded a review copy (2862x4344, greyscale) to `/tmp/claude-0/-home-claude/4f679353-75c2-5592-944f-4863c7efe9b2/scratchpad/lons/n120.jpg`. It is not registered yet, so register it like SRC title page n8. Bottom right there is a library stamp, "70598B", that must be cropped out (keep y < ~4050 px).

**B. In v6 the dark stockings are almost invisible.** DARK #3B4250 against the graphite canvas #2F2D2C has a contrast ratio of **1.36:1**. Sampled from the v6 render at 96.2 s: the stocking body is rgb(44,43,46) and the panel behind it is rgb(45,43,41), which is effectively the same value. For the scene's key state ("a sensible dark colour", "to both of them, dark") the hero object disappears, and only the drop shadow and the mask edge are left. On cream #F2EEE4 the same DARK reaches **8.7:1** and CHERRY 5.6:1. This one fact argues for a paper ground in this scene more than any taste argument does.

Also found:
- Fact-check row 31 asks for "recoloured" in the credit. The v6 caption ("SILK STOCKINGS · NETHERLANDS · c. 1806-10 · RIJKSMUSEUM") leaves it out.
- The multiply recolour comes out about 16% darker than spec. Cherry renders at rgb(150,31,33) against the spec's rgb(179,38,46).
- The brief's times are sentence boundaries, not word onsets. The real word onsets (from `gate1_act2/02_brothers_final_words.json` + 2.40 s) are used throughout this review:

| Phrase | Clip time (s) |
|---|---|
| One day in Kendal, | 64.83-66.39 |
| John passes a shop window | 66.77-67.89 |
| and sees a pair of stockings. | 67.89-69.37 |
| *pause* | 69.37-70.41 |
| He buys them for his mother. | 70.41-71.48 |
| *pause* | 71.48-72.52 |
| To him, they're a sensible dark colour. | 72.52-74.58 ("dark" 73.86) |
| *pause* | 74.58-75.62 |
| A bluish-dark drab, | 75.62-77.10 |
| in the biographer's words. | 77.42-78.58 |
| *pause* | 78.58-79.88 |
| His mother opens the present and says, | 79.88-81.52 |
| they're as red as a cherry, John! | 81.86-83.50 ("red" 82.10, "cherry" 82.78) |
| *pause* | 83.50-84.55 |
| John can't see it. | 84.55-85.77 |
| *pause* | 85.77-86.81 |
| Neither can Jonathan. | 86.81-87.63 |
| *pause* | 87.63-88.68 |
| To both of them, the stockings are dark. | 88.68-90.98 |
| *pause* | 90.98-92.28 |
| Two grown men, one pair of stockings, | 92.28-94.52 |
| and a mother who is quite sure she's right. | 94.84-97.08 ("mother" 95.15, "sure" 96.08) |
| *pause* | 97.08-98.63 ("So, look at what stays the same" starts 98.38) |

---

## 1. Critique

### Why v5 failed
- **The photo was the ground, and it is a catalogue shot.** About 70% of the Rijksmuseum frame is grey studio paper. At full screen the viewer gets a large flat beige-grey field with two pale tubes across it: no place, no light and no story. A plain object photo has not earned 34 s of full frame. Sam's "there is no need of that" is right.
- **The recolour was a full-frame flood.** When the pair went dark, the frame became a big dark slab. The cherry state, and the red flash frame at the end, put a huge field of saturated red on screen. The emotional pitch of the colour was far louder than a calm anecdote.
- **The type was squeezed into the leftovers.** Small mono chips sat in the bottom-centre band, over the subject's edge. Quotes, names and colours were all set in the same chip style, so nothing led.
- **Nothing moved but colour.** For 34 s the only events were tint changes and chips. The camera barely moved and no element entered or left, so every beat felt the same.

### v6 (ObjectStory): what works
- **The sync is good.** I checked it at 1 fps against the word timings. The object appears on "stockings" (68.7), the note lands on "For his mother" (70.7), the pair goes dark on "dark" (73.9-74.7), the drab quote lands on "bluish" (75.7), the parcel wraps in the pause (78.6-79.7) and opens on "opens the present" (80.3), the cherry snap lands on "cherry" (82.77), and the columns come in on "John" (84.6), "To both" (88.7), "Two grown men" (92.7) and "mother" (95.7). Only Jonathan's column is about 0.5 s late. Whoever built this listened.
- **The object is never more than half the frame.** That answers Sam's note directly.
- **The rules are kept.** The clean mask cut-out, the REPORTED COLOURS chip, the attributed quotes (LONSDALE 1874) and the EAGLESFIELD dateline on the mother's beat all hold.
- **The information design of the ending is right:** one copy per person, each labelled with what that person reported.

### v6: what reads as cheap or generic
1. **Two visual languages that never meet.** The real photographic silk sits inside a flat white wireframe window: a rectangle, three mullion lines and two diagonal "glass" strokes. That is the universal placeholder for "window", and it reads as a UI wireframe, not a Kendal shop in the 1790s. A drawing that thin makes the photo look pasted on, and it forces an extra ILLUSTRATION chip.
2. **The parcel is a modern cardboard box.** It is a flat tan rectangle with a centre seam and white lines for string. The two flaps slide in sideways like lift doors instead of folding. There is no paper texture, no thickness and no shading on the fold. For something that is meant to be kraft paper it is anachronistic, and it is the cheapest-looking moment in the scene.
3. **The hero vanishes in its key state.** See finding B. On "a sensible dark colour" and through all of 84-98 s, the object the story is about is barely there. The three-panel end is grey on grey on grey, with one red shape.
4. **The ending looks like a product picker.** Three identical grey cards with a white 3 px "selected" ring on the mother's card is the "choose your colour" pattern from an online shop. The story's joke is a **2-to-1 vote with the majority wrong-footed**, and equal columns flatten that. The next shot (98.63) is also a three-panel layout (flower, candle, stockings), so v6 ends one three-panel and starts another.
5. **The punchline is in the weakest type.** "QUITE SURE SHE'S RIGHT", "TWO GROWN MEN · ONE PAIR OF STOCKINGS" and "TO BOTH OF THEM · DARK" are small teal mono in chips: the HUD voice, used to restate the narration word for word. The funniest line of the act gets the type style of a metadata tag. These titles are subtitles, and they compete with the narration instead of adding to it.
6. **Teal on colour words.** 'A bluish dark drab' and 'As red as a cherry' are set in teal. A third colour on the two words that name colours muddies the very thing the scene is about. The cherry quote in teal sitting next to cherry-red silk is a clash.
7. **HUD furniture in all four corners**, all scene long: dateline, REPORTED COLOURS, ILLUSTRATION and the caption. Plus the chips in the middle, that makes five or six mono rectangles in some frames. Calm editorial design wants one or two.
8. **The rhythm is flat.** Every event uses the same 0.7-0.9 s SLOW_OUT fade or slide, at the same weight. "For his mother" and "as red as a cherry" land with the same force. Nothing gets bigger, nothing stops hard, and the camera never moves meaningfully (a 2% drift).
9. **Dead layouts wait for content.** 65.7-68.5 is an empty drawn window for about 3 s. 84.6-87.0 is one lonely panel at the left with two-thirds of the frame empty. Both are within the 4 s rule, but they look like loading screens.
10. **One flat ground for 34 s.** This is the "boring background" problem Sam named. It is also what causes problem 3.

---

## 2. Three new concepts

All three use the real photo (cut out, captioned as a period pair, RECOLOURED), keep the REPORTED COLOURS tag, use only the two allowed typed quotes, and show no likenesses.

### Concept A: "The page tells it" (my pick)
**Idea:** The scene is played out on Lonsdale's actual p.99, lying on a desk. The stockings lie beside it on their wrapping tissue, and each colour comes off the page, from the words of the people who reported it.

**Why it fits:** This is a second-hand story, and the narration has just said "it may have grown in the telling". Showing the very page it was told on is the most honest picture there is: the viewer watches the source say it. "In the biographer's words" becomes literal. It continues straight on from the previous shot (the Lonsdale title page): we turn from the title page to the page. And the colours being driven by underlines in the text is the REPORTED COLOURS rule made visible: colour comes from words, not from eyes.

**Ground:** LOK-027 PaperDesk in a dark variant. A warm, dark desk (canvas pushed warm, about #34302C, with a soft light pool from the top-left and a vignette). On it are two paper pieces, each with PaperFibre inside the piece: (1) the p.99 scan multiplied onto a cream sheet #EDE6D6, rotated -1.5°, filling the left ~58% and running off the top and bottom of frame; (2) a cream tissue sheet #E8DFCB at the right, rotated +3°, with the stockings on it. Cream under the stockings fixes the contrast problem.

**Layout (1920x1080):**
- Page text block about 1000 px wide on screen. That gives a line pitch of about 52 px and a body x-height of about 19 px, the size of 38-40 px type. Each frame shows about 9 lines.
- Tissue sheet at x 1110-1830, y 230-760.
- Stockings 680 px wide, rotated -4°, centred on the tissue, overlapping the page edge by about 40 px so the pieces feel physically stacked.
- Pull-quote zone: on the desk under the tissue, x 1130-1800, y 790-960.

**Storyboard:**

| Time | Words | On screen and motion | Sound (pauses only) |
|---|---|---|---|
| 64.4-65.1 | (end of the previous shot) | Hand-off from the title page: it slides off left while p.99 slides in from the right (SlideAcross, 0.6 s, ease-in-out, 8 px horizontal blur). | paper slide, under the previous pause |
| 64.83 | "One day in Kendal," | The page settles, framed on lines 1-9 (drop-cap J to "to be acquainted"). DATELINE KENDAL enters top-left. REPORTED COLOURS is on top-right from the first frame. Highlight wipes "Kendal," (line 2, 66.0-66.4). | |
| 66.77 | "John passes a shop window" | Accent highlight wipes "passing a shop-window in" (line 1), at speaking pace. | |
| 67.89 | "and sees a pair of stockings." | Highlight "saw a pair of stockings". At 68.4 the tissue and stockings slide in together from the right (0.9 s ease-out, small rotation settle), as photographed (pale). Caption chip bottom-left. | |
| 69.37-70.41 | *pause* | Highlight "Silk, and newest fashion," (line 3): the shop's own label, from the page, so nothing is invented. | soft cloth-on-paper set-down at 69.4 |
| 70.41 | "He buys them for his mother." | Highlight wipes "bought them as a fitting present for his mother" across lines 4-5, in step with the words. | |
| 71.48-72.52 | *pause* | The camera eases down the page to lines 12-20 ("John was disconcerted" to "Being firm"), 1.0 s, ease-in-out. The un-narrated lines (the mother's "Thou hast brought me…") dim to 55% so the eye does not read ahead. **The camera stays on this framing until 97.08.** | |
| 72.52 | "To him, they're a sensible dark colour." | A thin ink underline runs under "appeared to his eyes a", then "quakerish enough" on "sensible" (73.5), since "sensible" paraphrases it. On "dark" (73.80-74.70) the stockings crossfade from pale to DARK. A kicker appears under the tissue: TO JOHN · AS THE STORY TELLS IT. | |
| 74.58-75.62 | *pause* | Hold (camera drift only). | |
| 75.62 | "A bluish-dark drab," | A DARK-coloured underline (4 px, slightly hand-wobbled) wipes under "bluish dark drab". A small DARK swatch tab lands in the page margin beside that line. The pull-quote fades up: *'a bluish dark drab'* (Fraunces, cream ink). | |
| 77.42 | "in the biographer's words." | The byline types on under the quote: LONSDALE 1874 · p.99 (mono). | |
| 78.58-79.88 | *pause* | The pull-quote leaves (0.4 s). The tissue's two side flaps fold over the stockings (3D rotateY, 0.6 s each, staggered 0.15 s, with a shading gradient on the turning flap). The present is wrapped. | tissue rustle, 78.7-79.7 |
| 79.88 | "His mother opens the present and says," | The dateline wipes KENDAL to EAGLESFIELD (fact-check row 36). On "opens the present" (80.3-81.1) the flaps unfold. The stockings are still DARK. The kicker changes to HIS MOTHER · AS THE STORY TELLS IT. | |
| 81.86 | "they're as red as a cherry, John!" | The **recolour moment** (see craft note 5). A CHERRY underline wipes under '"They're as red as a cherry, John!"' (81.9-83.0). The stockings snap DARK to CHERRY in 6 frames, landing on "cher-" (82.78). The pull-quote *'as red as a cherry'* appears in the same frame. | none: the voice carries it |
| 83.50-84.55 | *pause* | Hold. | |
| 84.55 | "John can't see it." | The stockings ease back to DARK (0.8 s). The pull-quote leaves at 85.0. An ink underline runs under "But John could not see this". A kraft string tag, JOHN ▪ DARK, drops onto the desk under the tissue, left. | tag tap at 85.8 |
| 86.81 | "Neither can Jonathan." | Underline "nor could brother Jonathan". The JONATHAN ▪ DARK tag lands touching John's, overlapping slightly. | tag tap at 87.65 |
| 88.68 | "To both of them, the stockings are dark." | A thin string draws a loop through both tag holes (0.7 s) and ties them together: "both". The two tags shift 12 px left as one. | |
| 90.98-92.28 | *pause* | A slow camera pull-back, 1.00 to 0.93 (1.2 s), opening space on the right of the tag row. | |
| 92.28 | "Two grown men, one pair of stockings," | The page itself delivers the line: an accent highlight wipes "so there were two to one in the dispute" across lines 18-19. Nothing is retyped. | |
| 94.84 | "and a mother who is quite sure she's right." | On "mother" (95.15) the MOTHER ▪ RED tag drops alone, far right, with a hard landing: 0.25 s ease-in, a dead stop, 3 px of 1-frame impact and no wobble. She's sure. Underline "Being firm in her opinions" (95.3-96.8). The stockings stay DARK. **The final picture is one red swatch holding out against a field of dark: two to one.** | |
| 97.08-98.63 | *pause* | Hold to 98.0. Then hand off to the "What stays the same?" shot. Best: the stockings cut-out moves and scales into its slot in that shot's stockings panel (a shared-element match cut, 0.6 s). Fallback: SlideAcross. | firm tag thud at 97.1 |

**Changes per 4 s:** the longest still stretch is about 2.6 s. Every chip and quote is on screen for at least 2.2 s.

**What it needs built:**
- *New:* `SourcePageStory`, or ArchivalScanCard extended with an `object` slot. ArchivalScanCard already does real scans with highlight boxes in image pixels and dims the rest of the page. What it lacks:
  - a two-step camera (framing A, then framing B);
  - underline-style highlights in an arbitrary colour, plus margin swatch tabs;
  - the object-on-tissue slot (reuse `Cut` from ObjectStory with the new recolour recipe, craft note 4);
  - the tissue fold (CSS 3D, two flaps);
  - kraft string tags with a drawn string (SVG path with stroke-dashoffset).
- *Reuse:* PaperFibre, DatelineTag, SlideAcross, the reveal/exit/snap helpers, the KineticLine typewriter for the byline.
- *Sources:* register p.99 (leaf n120) under the existing Lonsdale item. Add fact-check rows for the newly highlighted page phrases ("Silk, and newest fashion", "two to one in the dispute", "Being firm in her opinions") and for the dark → cherry → dark sequence. Highlighting a real page is showing the source, not quoting, but log it.
- *Rough highlight boxes on n120* (source pixels; y is the line centre, line pitch about 104 px). Verify by eye.

| Phrase | x | y |
|---|---|---|
| "passing a shop-window in" | 1300-2350 | ~1925 |
| "Kendal," | 740-1000 | ~2025 |
| "saw a pair of stockings" | 1000-1830 | ~2025 |
| "Silk, and newest fashion," | 990-2050 | ~2130 |
| "bought them as a fitting present for his mother" | 1860-2350 (line 4, ~2235) then 350-2350 (line 5, ~2340) | see x |
| "bluish dark drab" | 350-1250 | ~3370 |
| "quakerish enough" | 1500-2050 | ~3370 |
| '"They're as red as a cherry, John!"' | 350-1830 | ~3475 |
| "But John could not see this" | 2000-2350 (~3475) and 350-760 (~3580) | see y |
| "nor could brother Jonathan" | 760-1900 | ~3580 |
| "so there were two to one in the" | 1240-2350 | ~3685 |
| "dispute," | 350-640 | ~3785 |
| "Being firm in her opinions" | 350-1300 | ~3890 |

**Build risk: low to medium.** The highlight engine exists, and the asset exists and is clean. The riskiest piece is the tissue fold. If it fights, the fallback is a single tissue sheet sliding over the pair and off again in the pause. Watch the order of the page: the text puts the mother's first words before "bluish dark drab". The framing in this plan avoids that by dimming lines 8-12, so the camera never has to jump back up.

---

### Concept B: "The disputed entry"
**Idea:** The disagreement is recorded as paperwork. On a typed object card, the COLOUR line is entered by John, struck out by his mother, and settled by a 2-to-1 tally that does not settle anything.

**Why it fits:** "Reported colours" taken literally: colour as a written claim that can be entered, challenged and outvoted. There is a quiet Quaker plainness joke in a family row filed like a ledger. It is told from the outside, which suits a second-hand anecdote.

**Ground:** LOK-027 PaperDesk, light variant, top-down. A kraft desk (#A9845A darkened to about #8A6A48, with fibre) and a cream index card, 1100x700, at left-centre, rotated -2°. The cut-out stockings are clipped to the card's right edge with a drawn paper clip. Stated plainly as our graphic: the card carries the ILLUSTRATION chip, with no institution name or museum styling.

**Storyboard:**

| Time | Words | On screen and motion | Sound |
|---|---|---|---|
| 64.83 | "One day in Kendal," | The card slides up into frame (0.8 s). Mono header typed: OBJECT / SILK STOCKINGS (A PERIOD PAIR). Field: WHERE → KENDAL (typed on "Kendal"). | |
| 66.77 | "…shop window…stockings." | Field: FROM → A SHOP WINDOW. On "stockings" the stocking cut-out drops onto the card (pale) and the clip snaps on. | clip click at 69.4 |
| 70.41 | "He buys them for his mother." | Field: FOR → HIS MOTHER. | |
| 72.52 | "To him… sensible dark colour." | Field: COLOUR, REPORTED BY JOHN. The DARK swatch is stamped in on "dark". The stockings ease to DARK. | |
| 75.62 | "A bluish-dark drab… biographer's words." | Typed after the swatch: 'a bluish dark drab', then (LONSDALE 1874). | stamp in the 74.6 pause |
| 78.58-79.88 | *pause* | The card slides 300 px left. A second, smaller card tucks in at its right: COLOUR, REPORTED BY HIS MOTHER, with the dateline changing to EAGLESFIELD. | card slide |
| 81.86 | "…as red as a cherry, John!" | The CHERRY swatch is stamped. 'as red as a cherry' is typed. The stockings snap to CHERRY on "cherry". | |
| 84.55 | "John can't see it." | The JOHN line gets a mono margin tick, STILL: DARK, and the stockings go back to DARK. Do not strike his line through: a strike would claim a verdict that the story never gives. | |
| 86.81 | "Neither can Jonathan." | A new line is typed: JONATHAN → DARK, with a tick. | |
| 88.68 | "To both of them… dark." | The tally box at the bottom of the card draws two strokes under DARK. | pen scratch at 91.0 |
| 92.28 | "Two grown men, one pair of stockings," | One stroke under RED. The result, 2 : 1, is stamped in Fraunces 120 px. | |
| 94.84 | "…a mother who is quite sure she's right." | The mother's card nudges on top of John's card, overlapping it (she's not having it). Her CHERRY swatch is the only colour left at full strength. | stamp thud at 97.1 |

**Needs:** LedgerCard (torn paper list) restyled as a clean card, the KineticLine typewriter, a stamp animation (scale 1.15 to 1 in 4 frames, plus an ink-spread mask), and a tally-stroke path. ObjectStory's `Cut` for the stockings. About 3 hours of build.

**Risk: low** to build. *Design* risk is medium: it is text-heavy, the typed fields restate the narration (the same problem I flagged in v6), and an invented form can look like a fake record if it is styled too "official". It has to stay plainly a graphic, not an artefact.

---

### Concept C: "The parcel goes north"
**Idea:** The present travels from Kendal to Eaglesfield on the dark lit Bowen map, carrying John's colour with it. When it opens under the light at the other end, the colour changes.

**Why it fits:** The page itself says this was a journey: bought in Kendal, opened "on his next visit to Eaglesfield". A colour that changes between two places and two people is the whole story in one camera move. It gives the act a strong place beat and a mood change (Johnny Harris's dark lit map).

**Ground:** MAP-012 LitMapGround, the Bowen 1760 map desaturated and darkened, with a moving vignette spot (radius about 520 px) and paper fibre.

**Storyboard:**

| Time | Words | On screen and motion | Sound |
|---|---|---|---|
| 64.83 | "One day in Kendal," | Fade up on the dark map. The spot opens over Kendal, with a pin and the label KENDAL in Fraunces 44 px. | |
| 66.77 | "…shop window…stockings." | The stockings cut-out (pale, 420 px) rises into the spot beside the pin, with a contact shadow on the map paper. | |
| 70.41 | "He buys them for his mother." | A kraft tag ties on: FOR HIS MOTHER. | |
| 72.52 | "To him… dark colour." | The stockings ease to DARK. Kicker: TO JOHN · AS THE STORY TELLS IT. | |
| 75.62 | "A bluish-dark drab…" | A pull-quote card stuck to the map in the spot: 'a bluish dark drab', LONSDALE 1874. | |
| 78.58-79.88 | *pause* | Kraft wraps the pair into a parcel. The **camera travels** north-west along a dotted route (labelled ROUTE ILLUSTRATIVE) to Eaglesfield, with the spot following (1.3 s, ease-in-out, slight motion blur on the map). | paper rustle, then a low whoosh |
| 79.88 | "His mother opens the present…" | The spot lands on EAGLESFIELD and the light warms 10%. The parcel unfolds and the pair is DARK. | |
| 81.86 | "…as red as a cherry, John!" | Snap to CHERRY on "cherry". Quote card. | |
| 84.55-87.63 | "John… Jonathan." | Two round name tokens (mono initials J. and J., no faces) settle on one side of Eaglesfield. The pair goes back to DARK. | token taps in the pauses |
| 88.68-97.08 | "To both of them… quite sure she's right." | The tokens link with a line ("both"). A third token, M., settles alone on the far side with a CHERRY ring. The spot tightens around her token at "sure". | |

**Needs:** PeriodMapPlate / BuildUpMap with a lit-spot layer (MAP-012 is being built now), a route path, the parcel (rebuild as real paper, not v6's box), name tokens, and ObjectStory's `Cut`. About 4-5 hours.

**Risk: medium to high.**
- The map already carries act-2 map shots 2-5, so this repeats the ground within a minute.
- On the 1760 map, Kendal and Eaglesfield are far apart, across the Lakes. The route must be labelled as illustrative, and the camera move is long for a 1.3 s pause.
- Quote text over a moving map breaks the 2 s reading rule unless the camera stops for it.
- The fact-check needs one more row ("on his next visit": was the parcel carried or posted? Lonsdale implies he took it himself, but the route is our drawing).

---

## 3. My pick: Concept A, "The page tells it"

**Why:**
1. **It is the honest picture of this story.** The narration hedges ("as the story tells it", "in the biographer's words", "may have grown in the telling"). Concept A shows exactly where the story comes from, and every colour is tied visibly to a sentence. No other concept makes the REPORTED COLOURS rule feel like the point rather than a disclaimer.
2. **It fixes the actual failures.** The cream tissue gives the dark state 8.7:1 contrast. Real paper replaces the wireframe window and the cardboard box. The punchline (two tags tied together, one red tag alone) is about weight and position, not equal columns. And it does not end on a three-panel just before the next three-panel.
3. **It gives Sam a different ground without a gimmick.** A dark desk with real paper is the PaperDesk ground the backgrounds study already assigns to "document or object" shots. It also flows straight on from the title-page shot before it.
4. **It is the cheapest to build well.** The asset is already downloaded, and the highlight engine exists. The new work is a camera with two framings, underlines, a fold and tags. It can be done in an afternoon.

### Five craft notes the builder must get right

**1. Type: one voice per job, and the page leads.**
- **Pull-quotes:** only the two allowed quotes. Fraunces 600, **62 px**, line-height 1.12, max width 640 px, cream ink #F2EEE4 on the desk. Plain ink, **never teal**: the colour belongs to the swatch and the stockings, not the letters. Lowercase start with real curly single quotes (' '), matching the source.
- **Kickers:** JetBrains Mono **22 px**, uppercase, tracking 0.14em, #9EA5B8, 16 px above the quote. Byline: mono 20 px, 20 px below the quote.
- **Tags:** mono **26 px**, #2F2D2C ink on kraft #A9845A with PaperFibre. A swatch 26x26, 2 px ink border, 10 px gap.
- **Persistent chrome:** at most **two** chips (REPORTED COLOURS top-right; the caption bottom-left, which now reads "SILK STOCKINGS · NETHERLANDS · c. 1806-10 · RIJKSMUSEUM · A PERIOD PAIR, RECOLOURED"). The dateline shows only for 2.5 s after each place change, then fades to 40%. No ILLUSTRATION chip: nothing in A is drawn except tags and underlines.
- **No restating titles:** drop "TO BOTH OF THEM · DARK" and the like; the page highlights do that job.
- **Margins:** 96 px safe on all sides, with spacing on an 8 px grid.

**2. Easing: give the beats different weights.**
- *Camera moves:* cubic-bezier(0.45, 0, 0.15, 1), 1.0-1.2 s, only in pauses, never during a colour change.
- *Entries:* ease-out cubic-bezier(0.16, 1, 0.3, 1), 0.6-0.8 s, 12-20 px of travel.
- *John's and Jonathan's tags:* 0.4 s drop with a 1.5° rotation settle.
- *The mother's tag:* 0.25 s ease-in, then a dead stop, with a 3 px one-frame impact and **no settle**. That difference is the joke.
- *Background motion:* a slow continuous drift of 1.5% scale over the whole scene, so no frame is ever truly frozen.
- *Underlines:* wipe at speaking pace (the duration of the phrase's words), starting 2 frames before the first word.

**3. Colour discipline.**
- *Teal #00E0BE* is for non-colour highlights (a multiply marker at about 35% opacity on cream, which reads as a pale mint wash) and the chip edge, nothing else.
- *Colour words get their reported colour:* the DARK underline and swatch under "bluish dark drab", the CHERRY underline under the cherry line.
- *Cherry appears in at most two places at once* (the stockings plus one underline or tag). In the final tableau it is only the mother's tag, so it reads as the lone hold-out.
- *Keep red off the desk:* no red glow, no red light leak.
- *Slow colour changes:* for the slow pale-to-DARK change, **crossfade two pre-tinted layers** instead of `interpolateColors`. An sRGB interpolation between these colours passes through a muddy brown-grey, which is acceptable only inside the 6-frame cherry snap.

**4. Recolour recipe: keep the silk looking like silk.**
v6 multiplies a flat colour onto the photo. That crushes the sheen and lands 16% darker than spec. Build each tinted copy as three masked layers in an `isolation: isolate` box:
```
L1  <Img> photo, filter: grayscale(1) contrast(1.2) brightness(1.1)          // luminance only
L2  <div> background: TARGET, mix-blend-mode: multiply                       // the reported colour
L3  <Img> photo, filter: grayscale(1) contrast(1.8), mix-blend-mode: soft-light, opacity 0.30   // sheen and knit back
```
Then **sample a mid-thigh pixel** in a test still. DARK must render within ±8 of #3B4250 and CHERRY within ±10 of #B3262E. Adjust L1's brightness until they do. The contact shadow on the tissue should be warm and soft: 0 14px 22px rgba(40,26,12,0.35), plus a 2 px tight shadow at the edges. No cold black drop shadow.

**5. How the cherry moment lands.**
- **Stillness before:** the camera is locked from 82.0 to 83.6, nothing else moves, and the DARK pair has been visible and still since the unfold ends (~81.1), so the eye is settled.
- **The snap:** DARK to CHERRY over **6 frames, 82.62-82.82**, ease-out, landing on "cher-" (82.78). At the same moment, scale the pair 1.000 → 1.015 → 1.000 over 10 frames. No other motion.
- **The underline** under the page line starts at 81.90 and finishes at 83.0. The pull-quote fades up over 8 frames from 82.78 and holds to 85.0 (2.2 s).
- **No sound effect:** her voice line is the hit.
- **After:** the return to DARK on "John can't see it" is **slow (0.8 s)**. A fast hit then a slow fall back is what makes the change read as an event and not a flicker.

### Smaller notes
- The hand-off into "What stays the same?": agree with whoever builds that shot where its stockings panel sits, so the cut-out can move into it (a shared element). If the panels change, fall back to SlideAcross. Do not hard-cut from the desk to graphite.
- The mother can be named. Lonsdale p.99 calls her "Dame Deborah", and Henry p.4 gives "Deborah". A tag reading HIS MOTHER (DEBORAH) humanises the end, but add a fact-check row first.
- "Silk, and newest fashion" and "two to one in the dispute" are **highlighted on the page only, never retyped** as quotes, so the two-quote rule still holds.
- Render stills at 64.9, 68.9, 74.3, 76.5, 79.3, 80.9, 82.8, 85.9, 88.0, 90.5, 93.5 and 96.5 for the still check. Also make a 0.5 fps contact sheet to confirm no stretch over 4 s is unchanged.
