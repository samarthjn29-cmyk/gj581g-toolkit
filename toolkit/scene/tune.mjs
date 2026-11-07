// Search spec parameters that make the validator's contact and slip checks pass (prints the best values; edits nothing).
import fs from 'fs'; import {makeScene} from './core.mjs';
const J = (f) => JSON.parse(fs.readFileSync('../' + f, 'utf8')), base = JSON.parse(fs.readFileSync('room.scene.json', 'utf8'));
const words = J('pilot8_words.json'), place = J('pilot8_place.json'), rigs = {'walker_rig8.json': J('walker_rig8.json')};
const clone = () => JSON.parse(JSON.stringify(base));
// 1) the reach: walker stop x and reach pose so the hand lands on rackC slot [0,1]
let best = null;
for (let x1 = 3.2; x1 <= 3.9; x1 += 0.025) for (let ua = -110; ua <= -20; ua += 2) for (let fa = -60; fa <= 10; fa += 2) {
  const s = clone(); const c = s.characters[0]; c.moves[0].x1 = x1; c.moves[1].x0 = x1; c.actions.find((a) => a.name === 'reach').pose = {upper_arm: ua, forearm: fa};
  
  const sc = makeScene(s, words, rigs, place), ch = sc.character('librarian'), t = sc.time('action:grab'), cam = sc.camAt(t);
  const h = sc.screen(cam, ch.hand(t), 1.03), q = sc.slot('rackC', 2, 0), p = sc.screen(cam, [q.x, q.y], 1), d = Math.hypot(h.x - p.x, h.y - p.y) / (p.s * sc.PXM);
  const cost = d + 0.002 * Math.abs(ua + 75); if (!best || cost < best.cost) best = {cost, d, x1, ua, fa}; }
console.log('reach', JSON.stringify(best));
// 2) the walk cycle length that keeps the planted foot still
let bc = null;
for (let cyc = 500; cyc <= 1000; cyc += 10) { const s = clone(); s.characters[0].walk.cycle_rig_px = cyc; const sc = makeScene(s, words, rigs, place), ch = sc.character('librarian');
  let worst = 0; for (let f = 25; f < 130; f++) { const t = f / 30, t0 = (f - 1) / 30; if (ch.state(t).speed < 0.3) continue; const a = ch.feet(t), b = ch.feet(t0);
    worst = Math.max(worst, Math.min(...[0, 1].map((k) => Math.abs(a[k][0] - b[k][0]) / (sc.PXM * 1.03)))); }
  if (!bc || worst < bc.worst) bc = {cyc, worst}; }
console.log('cycle', JSON.stringify(bc));
