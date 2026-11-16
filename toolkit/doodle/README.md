# Doodle evidence cards (Mild Astonishment)

Sam, 16 Nov 2026: "Mix this style into our current video style", then "Watch more videos of David Shapiro having such style to sharpen this skill and then adapt this skill in a different way which makes it unique and ours and then push it to the videos." The full study and rules are in the project doc `styles/DOODLE_CARDS.md`.

## Two ways the doodle style mixes with the painted stills (Sam, 16 Nov 2026: "We don't have to use such style for every frame. I would very much like to mix these two styles together.")
1. **Ink on paint (the main mix):** ink and red pen drawn straight onto a painted still while it plays: a red ring round the thing being talked about, dashed sight-lines, an arrow, a handwritten label, little ink coins dropping into a painted box. The painting stays; the ink explains it. Render with `bg=none` to a `.mov` (transparent qtrle) and overlay it; `follow(t, cx, cy, t0, rate)` keeps the ink on the painting during the still's slow zoom (measure the zoom centre and rate from two frames). Gods: the eyes poster ringed, "watching" sight-lines to the honesty box, coins dropping in (5:57-6:02, `eyesInk`).
2. **Full doodle cards (sparingly):** only where a number or a study design needs its own diagram, in place of a kinetic number card.

## What a card is
A short hand-drawn diagram (5-12 s) that takes the place of a number or evidence moment between the painted stills. First used in Gods_v1, where four cards replaced the four red kinetic number cards (`projects\Gods_v1\clips\Gods_full_cards_1080p.mp4`).

## Our look (what makes it ours, not a Shapiro copy)
- **The video's painted paper:** the card sits on its palette's cream with soft gouache blotches, grain and a warm vignette (`paper()`), so it belongs with the painted stills. His is flat white.
- **Kalam lettering and the video's own tag:** headings in Kalam (our channel hand); the source sits in the video's tag style top-left ("Bateson et al., 2006"). His labels float in the middle.
- **The red pen verdict:** every card ends with a red-pen mark: a ring, an underline, a crossed-out box, a bracket and a handwritten verdict ("nearly 3×", "~300 years later", "\"we don't know\" is not \"no\"").
- **A pencil margin aside:** one dry line in grey pencil in a lower corner ("(fashionably late. again.)", "(same tea. same price.)"). Callbacks to the video's own jokes work best. Asides state no new fact.
- **Painted props only as painted:** no flat clip art of people; ink figures are dots, boxes and icons. The Monocle Egg host never appears as a doodle (he stays painted, `styles/HOST_CHARACTER.md`).

## Kit
- `cards/ink.js`: paper, txt (writes on), tag, margin, pen, ring, underline, line, eye, flower; palette from the query (`paper ink red gold green pencil tagbg`); 6 fps line boil.
- `cards/gods.html?card=societies|timeline|honesty|review`: the four Gods cards, with beats at absolute times in the full video.
- `cards/societies.html`: the first test card (Patrick Hand, flat paper), kept as the before.
- Render: `npm i` once here, then `node render.js cards/<page>.html "card=<name>&<palette>" <start> <end> <out.mp4>`; add a last argument (a time) to write one PNG for checking.
- Beat times come from whisper word times on Sam's audio (`faster-whisper small.en`, word_timestamps). A beat lands on its word, never before it.
- Into the video: overlay on the chapter or full video with 0.25 s alpha fades at both ends, `eof_action=pass`; soft pencil scratches (band-passed noise, about -26 dBFS peak) on the main strokes, mixed under the voice (`amix normalize=0`).
