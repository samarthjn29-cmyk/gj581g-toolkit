// Render one still per scene (at `frac` of each slide, default 0.85: everything revealed) in a single bundle.
// Usage: node review.mjs out_dir [frac] [browserExecutable]   -> out_dir/scene_NN.png ; review_sheet.py builds the sheet.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs'; import path from 'path';
const [outDir, fracArg, browser] = process.argv.slice(2); const frac = parseFloat(fracArg || '0.85');
const slides = JSON.parse(fs.readFileSync('src/data/slides.json', 'utf8'));
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.jsx')});
const opts = browser ? {browserExecutable: browser} : {};
const composition = await selectComposition({serveUrl, id: 'Video', inputProps: {grain: false}, ...opts});
for (const d of slides) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round((d.start + d.dur * frac) * 30));
  const output = path.join(outDir, `scene_${String(d.n).padStart(2, '0')}.png`);
  await renderStill({composition, serveUrl, output, frame, inputProps: {grain: false}, scale: 0.5, ...opts});
  process.stdout.write(`still ${d.n}\n`);
}
