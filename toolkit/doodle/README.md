# Doodle cards (Sam, 16 Nov 2026: "Mix this style into our current video style")

Hand-drawn diagram cards that sit between the painted stills, for evidence and numbers only. Look borrowed from David Shapiro's "How Jobs Actually Disappear" (study, 16 Nov 2026): wobbly ink lines (rough.js), a handwritten font (Patrick Hand), one accent colour plus one highlight, a small label at the top, and something moving every half-second.

- One card = one HTML page with `render(t)` drawing frame t on a 1920x1080 canvas. Deterministic: same t, same frame. Line "boil" at 6 fps (`seed + floor(t*6)%3`).
- Palette from the query string: `paper`, `ink`, `accent`, `gold`, `grey`. Use the video's own palette (1a in gj581g-stills-world): Gods = paper `#E5E3D2`, accent `#77190D`.
- Render: `npm i` here once (roughjs, @fontsource/patrick-hand), then
  `node render.js <seconds> <out.mp4> "<query>" cards/<card>.html`
- Example: `cards/societies.html` (Gods ch02: 400 societies, every "?" crossed out as "no", stamp "\"we don't know\" is not \"no\"").
- Timing: the beat times inside a card are set from Sam's recorded chapter (whisper word times) so each step lands on its word. The card is used in the scene as a clip shot.
