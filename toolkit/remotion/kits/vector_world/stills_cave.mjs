import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
const frames = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const serveUrl = await bundle({entryPoint: './src/index_cave.jsx'});
const comp = await selectComposition({serveUrl, id: 'Cave'});
for (const [name, f] of Object.entries(frames)) {
  await renderStill({composition: comp, serveUrl, frame: Math.min(f, comp.durationInFrames - 1), output: `out/cave/${name}.png`, scale: Number(process.argv[3] || 0.5)});
  console.log(name);
}
