# Free vector libraries (installed 2 Nov 2026)

Install once per machine: `cd toolkit/vectors && npm install` (the SVGs are not copied into this repo: unDraw's licence forbids redistributing its illustrations as a pack, and the sets are large). Contact sheets: `open_doodles_sheet.png` here; all eight unDraw sheets (1,740 illustrations, file names under each) are in `G:\My Drive\Decked out Data\media\vectors\`. Re-make them with `node sheet_doodles.mjs` / `node sheet_undraw.js`.

| Library | What | Package | Licence of the artwork | Credit |
|---|---|---|---|---|
| Open Peeps (Pablo Stanley) | mix-and-match people: busts and full bodies, ~30 faces, poses | `react-peeps` (MIT code) | CC0 | not required; we credit "Characters: Open Peeps by Pablo Stanley (CC0)" |
| Open Doodles (Pablo Stanley) | 33 lively sketch people (reading, running, coffee, levitating...) with `ink` and `accent` colour props | `react-open-doodles` (MIT code) | CC0 | not required; credit as "Illustrations: Open Doodles by Pablo Stanley (CC0)" |
| Humaaans (Pablo Stanley) | flat mix-and-match people (body, pose, head, bottom) | `humaaans` (MIT code) | **CC BY 4.0**: credit required | "Illustrations: Humaaans by Pablo Stanley (CC BY 4.0)" |
| unDraw (Katerina Limpitsouni) | 1,740 flat scene illustrations (work, tech, AI, money, travel, home...) | `undraw-svg` | unDraw licence: free for commercial use, no attribution; no redistributing as packs or building a competing service | not required |
| Lucide | 2,295 line icons | `lucide-static` | ISC | not required |
| Tabler Icons | 11,460 icons (outline + filled) | `@tabler/icons` | MIT | not required |
| Phosphor | 9,072 icons in 6 weights (thin to fill, duotone) | `@phosphor-icons/core` | MIT | not required |

Not installed: OpenMoji (CC BY-SA 4.0, share-alike) — ask Sam before using.

## Using them in a scene
- Recolour to the video's palette: Open Doodles via `ink`/`accent`; unDraw by replacing its fill colours (dark `#2f2e41`/`#3f3d56`, accent `#6c63ff` in older files) with the palette; icons via `stroke`/`fill`.
- Skip any unDraw file that shows a real brand or logo (e.g. `algolia`, `bitcoin`, `android`); never use one as if it were a real product.
- Log each one used in the project's `media/licence_log.csv`, and add the credit line to the description where the table says so.
- `gj581g-scene-quality` sets the order: vectors and free libraries first, stock next, AI images only on request.
