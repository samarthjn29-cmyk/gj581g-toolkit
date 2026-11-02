# S3 hand-drawn kit (template)

The drawing kit built for LongChat (1-2 Nov 2026), ready for any new S3 (hand-drawn) video. Copy this folder to `<Topic>_remotion`, run `npm install` (or link an existing `node_modules`), then set the video's palette in `src/lib.jsx` (`C = {...}`; keep the role names) and its fonts in `FONT_FILES`.

See `kit_sheet.png` for every piece on one frame (`npx remotion still src/index.jsx KitSheet kit.png`).

## Pieces
- `draw.jsx`: `Page` (paper + vignette), `Sheet` (the SVG layer; hatch fills defined inside), `Ink` (draw-on stroke, shadow, hatch shade), `Hand` / `Mono` (HTML text, typed on), `Stamp`, `PopG`, `rectPath`, `ellPath`, `linePath`, `wob` (organic wobble).
- `polish.jsx`:
  - `Hero`: the main character (Open Peeps, CC0, by Pablo Stanley; `react-peeps`, MIT). Bust or full body, `face` changes on cue (Calm, Smile, SmileBig, Concerned, Suspicious, Tired, Awe, Serious, Driven...), `shirt` in the palette. Use body `Shirt` for busts (other busts carry their own patterned shirts); full-body poses such as `PointingFingerWB`, `WalkingWB`.
  - `DeskRoom` (wall, window, shelf, desk, mug, plant; `part="wall"` behind the Hero, `part="desk"` in front).
  - `Paper` (lifted shadow, folded corner), `Sticky` (tape, curl), `Gauge2` (bezel, coloured scale, ticks), `Solid` (filled shape with shadow and hatch), `poly` (straight edges for buildings, boxes, roofs), `Walker` (simple figure with a backpack of folders), `Pupil`.
- `kit.jsx`: the Tokens kit (`Laptop`, `Bubble`, `Person`, `Courier`, `Gauge`, `Squares`, `Tag`, `Clock`, ...).
- `thumbs.jsx`: four thumbnail compositions (rendered at 1920x1080, scaled to 1280x720); replace their content per video.

## Rules (from the LongChat review; full list in the `gj581g-scene-quality` skill)
- HTML text (`Hand`, `Mono`, `Stamp`, `Hero`) goes outside `<Sheet>`; SVG pieces go inside. `toolkit/story/scene_lint.py` checks it.
- `cue(n, 'word', k)`: give k for any word spoken more than once. `toolkit/story/cue_lint.py` checks it.
- Straight things use `poly`, organic things `wob`. No scribbled emphasis strokes.
- Keep labels 40 px inside the frame, clear of drawings, and above the caption band (y < 980).
