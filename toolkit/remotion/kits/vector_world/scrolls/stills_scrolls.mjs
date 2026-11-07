import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null, scale = Number(process.argv[3] || 0.5);
fs.mkdirSync('out/scrolls', {recursive: true});
const serveUrl = await bundle({entryPoint: './src/index_scrolls.jsx'});
const comp = await selectComposition({serveUrl, id: 'ScrollsFrames'});
for (let f = 0; f < comp.durationInFrames; f++) { if (only && !only.includes(f)) continue;
  await renderStill({composition: comp, serveUrl, frame: f, output: `out/scrolls/f${String(f + 1).padStart(2, '0')}.png`, scale}); console.log('f', f + 1); }
