# Style sampler (3 Nov 2026)
Seven presentation styles, each telling the same 15 s beat (Ann +2% / Barbara +5%, prices +4%) so they can be compared side by side.
One composition per style plus `Reel` (style card + demo for each). Templates to start a real video from.

| ID | File | Style |
|---|---|---|
| S2 | s2_board.jsx | Investigation board: cork, polaroids (Folk busts), index cards, clippings, red string, stamps, camera moves clue to clue |
| S3 | s3_whiteboard.jsx | Whiteboard draw-on: Kalam marker writing and drawing live, marker follows the tip |
| S10 | s10_kinetic.jsx | Kinetic type: giant Inter 900 words slam in, one accent, hard phase cuts |
| S11 | s11_cutout.jsx | Paper cut-out: white-edged paper pieces with shadows on kraft, pop-up cards, tipping balance |
| S12 | s12_datamorph.jsx | Data morph: dots = money; appear, get eaten by prices, regroup into the answer |
| S13 | s13_screen.jsx | Screen story: group chat on a phone, typing dots, bank notification, calculator sheet |
| S14 | s14_diorama.jsx | Isometric diorama: 2.5D islands, houses, shops, coin stacks that fly to the shop, floating signs |

Setup: copy into a project made from `templates/s8_banknote` (fonts: Fraunces, Oswald, Inter, JetBrains Mono, Kalam in public/fonts; sfx from s8 `sfx/make_sfx.py` into public/sfx; `src/folk.jsx` from kits/folk_banknote for S2).
Narration: `voice_narr.py` (Kokoro am_michael, phrase by phrase -> public/narr.wav + src/data/narr.json). Cues use phrase starts and estimated word times (`tw`).
