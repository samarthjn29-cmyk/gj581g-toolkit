// Screen positions of every joint in each PoseSheet cell (same poses, same layout as PoseSheet.jsx), for rig_holes.py.
import fs from 'fs'; import {makeScene, apply} from './core.mjs';
const J = (f) => JSON.parse(fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8'));
const spec = JSON.parse(fs.readFileSync(new URL('./room.scene.json', import.meta.url), 'utf8')), rig = J('walker_rig8.json');
const sc = makeScene(spec, J('pilot8_words.json'), {'walker_rig8.json': rig}, J('pilot8_place.json')), L = sc.character('librarian');
const T = [1.0, 1.2, 1.4, 1.6, L.at('look') + 0.6, L.at('grab'), L.at('lower') + 0.7, 7.1, 7.4, L.at('release'), L.at('rest') + 0.7, 2.0];
const out = T.map((t, i) => { const w = L.world(t), x = 160 + (i % 6) * 320, y = 520 + Math.floor(i / 6) * 540;
  return rig.parts.filter((p) => p.parent).map((p) => { const q = apply(w.W[p.parent], p.pivot); return [p.name, x + 0.3 * (q[0] - 520), y + 0.3 * (q[1] - 1523)]; }); });
fs.writeFileSync(process.argv[2], JSON.stringify(out)); console.log('joints', out.length);
