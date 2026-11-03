# Thumbnail styles as Remotion stills (3 Nov 2026)
`thumbs.jsx`: TS05 giant word on pattern, TS08 chart drama, TS09 receipt evidence, TS10 banknote portrait, TS11 repetition, TS15 word behind subject (1280x720, durationInFrames 1).
Needs `bank.jsx` and `folk.jsx` from `templates/s8_banknote` / `kits/folk_banknote`, fonts in public/fonts (Oswald, Fraunces, Inter, JetBrains Mono, Kalam).
Register: `<Composition id="TS05" component={TS05} durationInFrames={1} fps={30} width={1280} height={720} />`, render: `npx remotion still src/index.jsx TS05 out/TS05.png`.
Catalogue: `thumbs/THUMBNAIL_LIBRARY.md`.
Art/philosophy/science styles (added 3 Nov 2026): TS18 painting + loupe, TS19 lone figure, TS20 bust + brush stroke, TS21 engraved plates, TS22 two-tone poster, TS24 minimal diagram. `rig.jsx` is needed for TS19.
Images used by the mocks (public/): `goldsmith.jpg` = Petrus Christus, A Goldsmith in his Shop (1449), The Met Open Access, CC0 (Met API objectID 459052; search via /public/collection/v1.1/search); `bust.jpg` = Unsplash photo by Andres Hernandez (QlGQ1myi1-8), credit in the description.
