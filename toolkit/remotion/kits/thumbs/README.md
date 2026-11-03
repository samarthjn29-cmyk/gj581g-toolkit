# Thumbnail styles as Remotion stills (3 Nov 2026)
`thumbs.jsx`: TS05 giant word on pattern, TS08 chart drama, TS09 receipt evidence, TS10 banknote portrait, TS11 repetition, TS15 word behind subject (1280x720, durationInFrames 1).
Needs `bank.jsx` and `folk.jsx` from `templates/s8_banknote` / `kits/folk_banknote`, fonts in public/fonts (Oswald, Fraunces, Inter, JetBrains Mono, Kalam).
Register: `<Composition id="TS05" component={TS05} durationInFrames={1} fps={30} width={1280} height={720} />`, render: `npx remotion still src/index.jsx TS05 out/TS05.png`.
Catalogue: `thumbs/THUMBNAIL_LIBRARY.md`.
