# Folk characters + Banknote identity (started 2 Nov 2026, "The Dollar Yardstick" series)

- `folk.jsx`: our own flat-vector character kit, drawn from scratch (no library): busts with 7 expressions (neutral, smile, happy, sad, thinking, surprised, smug), hair (bob, bun, short, curly, long), tops (blazer, sweater, shirt, hoodie), glasses, skin tones, a card-holding pose (`hold={{text, color}}`). Clean shapes, no outlines, one shade tone per colour. Sam asked for characters different from Open Peeps, "extremely neat and well drawn". Still to build: full-body standing/sitting poses, hands, pointing, shrug, desk scenes, walk cycle.
- `ident.jsx`: three original identity directions; **IdB "Banknote" was chosen** (engraved guilloché frames, security-paper wave ground, Fraunces engraved serif numbers, Oswald caps labels, palette green #24493A / oxblood #7A2333 / gold #B98B2E / ground #EFE9DA). IdA "Pay slip" (receipt tiles, zigzag edges, mono type, stamp) is the planned second device for personal moments.
- `mocks.jsx`: the six earlier style mock-ups (library styles) for reference.
- `foltest.jsx`: the character test sheet. Sheets in `sheets/`.
- Fonts: Oswald, Fraunces (OFL, from Fontsource); add them to `lib.jsx` FONT_FILES (`Fraunces`, `FrauncesI` for italic).
- To try: copy into a project made from `templates/s3_handdrawn`, register the compositions in `index.jsx` (see the LongChat-era chartest).
