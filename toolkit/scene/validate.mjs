// Scene validator (7 Nov 2026): checks a scene spec before anything is rendered, using the same core as the scene.
// usage: node validate.mjs <scene.json> [--variant <name>] [--json out.json]
// Each check returns PASS / FAIL / WARN with the time, object and numbers, so a failure points at its fix.
import fs from 'fs'; import path from 'path';
import {makeScene} from './core.mjs';

const args = process.argv.slice(2), file = args[0], dir = path.dirname(file);
const vi = args.indexOf('--variant'), variant = vi > 0 ? args[vi + 1] : null, ji = args.indexOf('--json'), jout = ji > 0 ? args[ji + 1] : null;
let spec = JSON.parse(fs.readFileSync(file, 'utf8'));
if (variant) { const V = JSON.parse(fs.readFileSync(path.join(dir, 'regression_variants.json'), 'utf8'))[variant];
  for (const [p, v] of Object.entries(V.set)) { const ks = p.split('.'); let o = spec; for (const k of ks.slice(0, -1)) o = o[isNaN(k) ? k : +k]; o[ks.at(-1)] = v; } }
const R = (f) => JSON.parse(fs.readFileSync(path.join(dir, '..', f), 'utf8'));
const words = R(spec.words.file), place = R('pilot8_place.json'), rigs = Object.fromEntries(spec.characters.map((c) => [c.rig, R(c.rig)]));
// G7 keeps 5% of the board clear beside each roller. R0: the rig must have every part the spec names (hand, feet); a missing part would crash the checks, so stop here with a FAIL
for (const c of spec.characters) { const names = new Set(rigs[c.rig].parts.map((p) => p.name)), need = [c.hand.part, ...c.feet.map((f) => f.part)].filter((n) => !names.has(n));
  if (need.length) { console.log(`${spec.id}${variant ? ` [variant ${variant}]` : ''}: 1 FAIL, 0 WARN\n  FAIL  R0 rig has the parts the spec names: ${c.rig} has no ${need.join(', ')}  -> use the kit rig`); process.exit(1); } }
const sc = makeScene(spec, words, rigs, place), RU = spec.rules, out = [];
const add = (id, status, msg, fix = '') => out.push({id, status, msg, fix});
const m = (px, l = 'wall') => px / (sc.PXM * sc.lane(l).scale);   // plate px -> metres
const frames = Array.from({length: Math.round(spec.duration * spec.fps)}, (_, i) => i / spec.fps);
const sceneEnd = sc.time(spec.camera.scene_end);

// ---------- G: geometry and support
for (const o of spec.objects) if (o.rests_on === 'floor' && (o.z || 0) !== 0) add('G1 rests on floor', 'FAIL', `${o.id} floats ${o.z} m above the floor`, 'set z to 0');
{ const st = sc.stand, top = st.top, tol = 1.5;
  for (const l of Object.values(st.legs)) {
    if (Math.abs(l.bottom - top) > tol) add('G2 legs stand on the cabinet', 'FAIL', `${l.id} bottom is ${m(l.bottom - top, 'mid').toFixed(3)} m off the cabinet top`, 'end the leg on the cabinet top');
    const xc = l.x + l.w / 2;
    if (l.layer === 'front') { if (Math.abs(l.y - (st.B.bl[1] + st.thick)) > tol) add('G3 legs meet the board', 'FAIL', `${l.id} top is ${m(l.y - st.B.bl[1] - st.thick, 'mid').toFixed(3)} m from the board's underside`, 'end the front leg at the board edge');
      if (xc < st.B.bl[0] || xc > st.B.br[0]) add('G3 legs meet the board', 'FAIL', `${l.id} is outside the board's front edge`, 'move it under the board'); }
    else { // a back leg must end hidden behind the board: its top corners inside the board quad
      const inside = (px, py) => { const v = (py - st.B.tl[1]) / (st.B.bl[1] - st.B.tl[1]); if (v < 0 || v > 1) return false;
        const xl = st.B.tl[0] + (st.B.bl[0] - st.B.tl[0]) * v, xr = xl + (st.B.tr[0] - st.B.tl[0]); return px >= xl - 0.5 && px <= xr + 0.5; };
      if (!inside(l.x, l.y + 0.5) || !inside(l.x + l.w, l.y + 0.5)) add('G3 legs meet the board', 'FAIL', `${l.id}'s top sticks out from behind the board`, 'end the back leg under the board, hidden');
      const vy = l.y + l.h; if (vy <= st.B.bl[1]) add('G3 legs meet the board', 'FAIL', `${l.id} is hidden all the way down`, 'check its height'); } }
  for (const b of Object.values(st.bars)) { const a = st.legs[b.from], c = st.legs[b.to];
    for (const [L, end] of [[a, b.x], [c, b.x + b.w]]) if (end < L.x - 0.5 || end > L.x + L.w + 0.5) add('G4 stretchers meet both legs', 'FAIL', `${b.id} end at x=${end.toFixed(0)} misses ${L.id}`, 'end the stretcher inside the leg');
    if (b.y < Math.max(a.y, c.y) || b.y + b.h > top) add('G4 stretchers meet both legs', 'FAIL', `${b.id} is above a leg's top or below the cabinet`, 'move it between the legs');
    const di = (id) => st.draw.indexOf(id); if (di(b.id) > Math.min(di(b.from), di(b.to))) add('G5 draw order', 'FAIL', `${b.id} is drawn over its legs`, 'draw stretchers before legs'); }
  if (st.base) { const f = st.base.front;
    if (Math.abs(f[0][1] - (st.B.bl[1] + st.thick)) > tol) add('G2 the base meets the board', 'FAIL', 'the base does not reach the board lip', 'raise the base');
    if (Math.abs(f[2][1] - top) > tol) add('G2 the base stands on the cabinet', 'FAIL', 'the base floats above the cabinet', 'lower it');
    const [sx, sy] = st.base.side[1], v = (sy - st.B.tl[1]) / (st.B.bl[1] - st.B.tl[1]), xr = st.B.tl[0] + (st.B.bl[0] - st.B.tl[0]) * v + (st.B.tr[0] - st.B.tl[0]);
    if (sx > xr) add('G2 the base stays under the board', 'FAIL', 'the side of the base sticks out past the board edge', 'pull it in'); }
  if (!st.base && !Object.keys(st.legs).length) add('G6 the board is supported', 'FAIL', 'the board has no base and no legs', 'add a base');
  const fl = Object.values(st.legs).filter((l) => l.layer === 'front').map((l) => l.x + l.w / 2), span = st.B.br[0] - st.B.bl[0];
  if (fl.length && (Math.min(...fl) > st.B.bl[0] + 0.3 * span || Math.max(...fl) < st.B.br[0] - 0.3 * span)) add('G6 the board is supported at both ends', 'FAIL', 'front legs are bunched in the middle', 'put one leg near each end');
}
// ---------- Z: sizes against the prop cards
{ const pc = spec.prop_cards, rng = (v, [a, b]) => v >= a && v <= b;
  for (const o of spec.objects) { const card = pc[o.kind]; if (card && card.h && !rng(o.h, card.h)) add('Z1 real sizes', 'FAIL', `${o.id} is ${o.h} m tall (card ${card.h.join('-')} m)`, 'resize to its card'); }
  const st = sc.stand, topH = m(st.cab.y + st.cab.h - st.B.tl[1], 'mid'); if (!rng(topH, pc.stand.top_height)) add('Z1 real sizes', 'FAIL', `stand top at ${topH.toFixed(2)} m (card ${pc.stand.top_height.join('-')})`, 'adjust the stand');
  for (const c of spec.characters) if (!rng(c.height, pc.person.h)) add('Z1 real sizes', 'FAIL', `${c.id} is ${c.height} m`, 'person 1.55-1.85 m');
  for (const p of spec.props) { const card = pc[p.kind]; const ds = [p.diameter, ...p.states.map((s) => s.diameter).filter(Boolean)];
    if (new Set(ds).size > 1) add('C1 one prop, one size', 'FAIL', `${p.id} changes diameter between states: ${ds.join(', ')} m`, 'one size for every state');
    for (const d of ds) { if (!rng(d, card.diameter)) add('Z2 prop sizes', 'FAIL', `${p.id} diameter ${d} m (card ${card.diameter.join('-')})`, 'resize');
      const r = d / sc.rackEndDiameter(); if (!rng(r, card.vs_rack_end)) add('Z3 matches the rack art', 'FAIL', `${p.id} is ${r.toFixed(2)}x the rack's scroll ends (allowed ${card.vs_rack_end.join('-')})`, 'match the rack scroll ends'); } } }
// ---------- C: continuity and hand-overs (forward kinematics of the rig)
for (const c of spec.characters) { const ch = sc.character(c.id);
  for (const a of c.actions.filter((a) => a.target)) { const t = sc.time(a.t), cam = sc.camAt(t), hs = sc.screen(cam, ch.hand(t), sc.lane(c.lane).parallax);
    let tgt, tp; const mm = a.target.match(/^(\w+)\.slot\[(\d+),(\d+)\]$/); if (mm) { const q = sc.slot(mm[1], +mm[2], +mm[3]); tgt = [q.x, q.y]; tp = 1; } else if (a.target === 'stand.top') { tgt = sc.stand.at(sc.stand.layout.u_open[0], 0.5); tp = 1.05; }
    const ts = sc.screen(cam, tgt, tp), h = hs; const d = Math.hypot(hs.x - ts.x, hs.y - ts.y) / (ts.s * sc.PXM), lim = RU.contact_m[a.name];
    add('C2 hands touch what they take', d <= lim ? 'PASS' : 'FAIL', `${a.name} at ${t.toFixed(2)} s: hand is ${d.toFixed(2)} m from ${a.target} (limit ${lim})`, d <= lim ? '' : 'move the target or the reach pose');
    if (mm) { let best = null; const [R0, C0] = sc.objs[mm[1]].grid; for (let r = 0; r < R0; r++) for (let k = 0; k < C0; k++) { const q = sc.screen(cam, [sc.slot(mm[1], r, k).x, sc.slot(mm[1], r, k).y], 1), dd = Math.hypot(h.x - q.x, h.y - q.y); if (!best || dd < best.d) best = {r, k, d: dd}; }
      if (best.r !== +mm[2] || best.k !== +mm[3]) add('C3 the slot he reaches is the slot that empties', 'FAIL', `hand is nearest slot [${best.r},${best.k}] but ${a.target} empties`, `take slot [${best.r},${best.k}]`); }
    const pr = spec.props.find((p) => p.id === a.prop), st = pr.states.find((s) => sc.time(s.from) === t);
    if (!st) add('C4 prop state changes at the hand-over', 'FAIL', `${a.prop} has no state starting at ${a.name}`, 'align the prop states with the action'); }
  // rig rules
  const rig = rigs[c.rig];
  if (!c.rules.limb_tint && rig.parts.some((p) => p.tint)) add('R1 both limbs the same colour', 'FAIL', `${c.id}'s rig darkens ${rig.parts.filter((p) => p.tint).map((p) => p.name).join(', ')}`, 'turn tint off');
  const ua = rig.parts.find((p) => p.name === 'upper_arm'), frac = (ua.pivot[1] - ua.y) / ua.h;
  if (frac > c.rules.shoulder_pivot_top_frac) add('R2 shoulder pivot at the top of the sleeve', 'FAIL', `pivot is ${(frac * 100).toFixed(0)}% down the upper arm`, 'move the pivot up');
  // ---------- M: motion
  let back = 0, slide = 0, slideT = 0, jump = 0, jumpT = 0;
  for (let i = 1; i < frames.length; i++) { const t = frames[i], t0 = frames[i - 1], s = ch.state(t), s0 = ch.state(t0);
    if ((s.x - s0.x) * (s.dir || (c.facing === 'right' ? 1 : -1)) < -1e-4) back++;   // against the way he faces right now
    if (s.speed > 0.3) { const f = ch.feet(t), f0 = ch.feet(t0); const d = Math.min(...[0, 1].map((k) => Math.abs(m(f[k][0] - f0[k][0], c.lane)))); if (d > slide) { slide = d; slideT = t; } }
    const h = ch.hand(t), h0 = ch.hand(t0), dh = m(Math.hypot(h[0] - h0[0], h[1] - h0[1]), c.lane); if (dh > jump) { jump = dh; jumpT = t; } }
  add('M1 screen direction', back ? 'FAIL' : 'PASS', back ? `${c.id} steps backwards in ${back} frames` : `${c.id} always walks the way he faces`);
  add('M2 feet do not slide', slide <= RU.foot_slide_m ? 'PASS' : 'WARN', `largest planted-foot slip ${(slide * 100).toFixed(1)} cm/frame at ${slideT.toFixed(2)} s (limit ${RU.foot_slide_m * 100} cm)`, slide <= RU.foot_slide_m ? '' : 'tie the cycle length to stride');
  add('M3 hands move at human speed', jump <= RU.max_step_m_per_frame ? 'PASS' : 'FAIL', `fastest hand move ${(jump * 100).toFixed(1)} cm/frame = ${(jump * 30).toFixed(1)} m/s at ${jumpT.toFixed(2)} s (limit ${(RU.max_step_m_per_frame * 30).toFixed(1)} m/s)`, jump <= RU.max_step_m_per_frame ? '' : 'give the move more time');
  const starts = c.actions.map((a) => ({n: a.name, t: sc.time(a.t)})).sort((a, b) => a.t - b.t);
  for (let i = 1; i < starts.length; i++) if (starts[i].t - starts[i - 1].t < RU.min_action_gap) add('M4 one action at a time', 'FAIL', `${starts[i - 1].n} and ${starts[i].n} start ${(starts[i].t - starts[i - 1].t).toFixed(2)} s apart`, 'stagger them');
  for (const mv of c.moves) for (const a of c.actions) { const t = sc.time(a.t); if (t > mv.t0 + 0.3 && t < mv.t1 - 0.3 && ['grab', 'release'].includes(a.name)) add('M4 one action at a time', 'FAIL', `${a.name} happens mid-walk at ${t.toFixed(2)} s`, 'stop walking first'); }
  // ---------- E: entrance
  const first = frames.find((t) => { const cam = sc.camAt(t), b = sc.screenBox(cam, ch.bbox(t), sc.lane(c.lane).parallax); return b.x + b.w > 0 && b.x < 1920; });
  if (first !== undefined) { const cam = sc.camAt(first), b = sc.screenBox(cam, ch.bbox(first), sc.lane(c.lane).parallax);
    const fromEdge = b.x < 5 || b.x + b.w > 1915; add('E1 characters enter from an entrance', fromEdge ? 'PASS' : 'FAIL', `${c.id} first visible at ${first.toFixed(2)} s, ${fromEdge ? 'at the frame edge' : `in the middle of the frame (x ${b.x.toFixed(0)})`}`, fromEdge ? '' : 'start him at an entrance or off frame'); }
}
// ---------- F: framing
const focalBox = (id, t, cam) => { if (id === 'librarian') { const ch = sc.character(id); return sc.screenBox(cam, ch.bbox(t), 1.03); }
  if (id === 'librarian.hand') { const h = sc.character('librarian').hand(t); return sc.screenBox(cam, {x: h[0] - 40, y: h[1] - 40, w: 80, h: 80}, 1.03); }
  if (id === 'scroll1') { const p = sc.propAt('scroll1', t).pos; return sc.screenBox(cam, {x: p[0] - 60, y: p[1] - 40, w: 120, h: 80}, 1.03); }
  if (id === 'stand.sheet') { const B = sc.stand.B; return sc.screenBox(cam, {x: B.bl[0], y: B.tl[1], w: B.tr[0] - B.bl[0], h: B.bl[1] - B.tl[1]}, 1.05); }
  if (id.startsWith('stand.at:')) { const [u, v, du, dv] = id.slice(9).split(',').map(Number), q = [[u - du / 2, v - dv / 2], [u + du / 2, v - dv / 2], [u - du / 2, v + dv / 2], [u + du / 2, v + dv / 2]].map(([a, b]) => sc.stand.at(a, b));   // a patch of the board, e.g. one column
    const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]); return sc.screenBox(cam, {x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys)}, 1.05); }
  const o = sc.objs[id]; return sc.screenBox(cam, sc.box(id), sc.lane(o.lane).parallax); };
for (const b of spec.beats) { const t = sc.time(b.t), cam = sc.camAt(t), fb = focalBox(b.focal, t, cam);
  const inFrame = fb.x >= -2 && fb.y >= -2 && fb.x + fb.w <= 1922 && fb.y + fb.h <= 1082;
  add('F1 the focal subject is fully in frame', inFrame ? 'PASS' : 'FAIL', `${b.focal} at ${t.toFixed(2)} s: box x ${fb.x.toFixed(0)}..${(fb.x + fb.w).toFixed(0)}, y ${fb.y.toFixed(0)}..${(fb.y + fb.h).toFixed(0)}`, inFrame ? '' : 'reframe the camera');
  for (const d of spec.devices) { const t0 = sc.time(d.t0), t1 = sc.time(d.t1); if (t < t0 || t > t1) continue; const [x, y, w, h] = d.box;
    const ov = Math.max(0, Math.min(x + w, fb.x + fb.w) - Math.max(x, fb.x)) * Math.max(0, Math.min(y + h, fb.y + fb.h) - Math.max(y, fb.y));
    if (ov > 0.15 * fb.w * fb.h) add('F2 text never covers the focal subject', 'FAIL', `${d.id} covers ${(100 * ov / (fb.w * fb.h)).toFixed(0)}% of ${b.focal} at ${t.toFixed(2)} s`, 'move the device'); } }
for (const c of spec.characters) { const ch = sc.character(c.id); let cut = null;
  for (const t of frames) { const cam = sc.camAt(t), cn = sc.camAt(t + 1 / spec.fps); if (cam.z > 2.2 || t > sceneEnd || Math.abs(cn.z / cam.z - 1) > 0.004) continue; const bb = sc.screenBox(cam, ch.bbox(t), 1.03);  // held framings only
    const by = bb.y + bb.h - 1080; if (bb.x > 0 && bb.x + bb.w < 1920 && by > 4 && by < 0.12 * bb.h) { cut = {t, by}; break; } }
  let tight = null; for (const t of frames) { const cam = sc.camAt(t), cn = sc.camAt(t + 1 / spec.fps); if (cam.z > 2.2 || t > sceneEnd || Math.abs(cn.z / cam.z - 1) > 0.004) continue; const bb = sc.screenBox(cam, ch.bbox(t), 1.03), by = bb.y + bb.h - 1080;
    if (bb.x > 0 && bb.x + bb.w < 1920 && by > -RU.safe_margin_px * 0.5 && by <= 4) { tight = {t, by}; break; } }
  if (tight) add('F3 feet not cramped against the bottom edge', 'WARN', `${c.id}'s feet sit ${(-tight.by).toFixed(0)} px from the bottom at ${tight.t.toFixed(2)} s (leave at least ${RU.safe_margin_px * 0.5} px or crop well above)`, 'lower the camera a touch');
  add('F3 no awkward crops at the feet', cut ? 'FAIL' : 'PASS', cut ? `${c.id}'s feet are clipped by ${cut.by.toFixed(0)} px at ${cut.t.toFixed(2)} s (a sliver: either show the feet or crop well above the ankles)` : 'feet either fully in frame or cleanly cropped', cut ? 'reframe' : ''); }
{ let worstF = 0, wt = 0; const fig = []; for (const t of frames) { const cam = sc.camAt(t); if (cam.z > RU.wide_z || t > sceneEnd) continue;
    const fy = sc.screen(cam, [0, sc.FLOOR], 1).y, share = Math.max(0, 1080 - fy) / 1080; if (share > worstF) { worstF = share; wt = t; }
    const bb = sc.screenBox(cam, sc.character('librarian').bbox(t), 1.03); if (bb.x > 0 && bb.x + bb.w < 1920) fig.push(bb.h / 1080); }
  add('F4 floor share in wide shots', worstF <= RU.floor_share_max ? 'PASS' : 'FAIL', `floor up to ${(worstF * 100).toFixed(0)}% of the frame at ${wt.toFixed(2)} s (max ${RU.floor_share_max * 100}%)`, worstF <= RU.floor_share_max ? '' : 'raise the camera');
  if (fig.length) { const lo = Math.min(...fig), hi = Math.max(...fig), [a, b] = RU.figure_share; add('F5 figure size in wide shots', lo < a ? 'FAIL' : hi > b ? 'WARN' : 'PASS', `figure is ${(lo * 100).toFixed(0)}-${(hi * 100).toFixed(0)}% of frame height (target ${a * 100}-${b * 100}%; too small fails, too big is a style warning)`, lo < a ? 'bring the camera closer' : ''); } }
// ---------- F6: no object clipped to a sliver at the frame edge in a held shot (a cut-off foot of a lamp reads as a stray shape)
for (const o of spec.objects.filter((o) => ['rack', 'cabinet', 'lampstand'].includes(o.kind))) { let sl = null;
  for (const t of frames) { const cam = sc.camAt(t), cn = sc.camAt(t + 1 / spec.fps); if (t > sceneEnd || Math.abs(cn.z / cam.z - 1) > 0.004 || Math.abs(cn.x - cam.x) > 3) continue;
    const b = sc.screenBox(cam, sc.box(o.id), sc.lane(o.lane).parallax), vis = Math.max(0, Math.min(1920, b.x + b.w) - Math.max(0, b.x)) / b.w;
    if (vis > 0 && vis < 0.1) { sl = {t, vis}; break; } }
  if (sl) add('F6 no slivers at the frame edge', 'WARN', `only ${(sl.vis * 100).toFixed(0)}% of ${o.id} shows at the edge at ${sl.t.toFixed(2)} s`, 'show more of it or none'); }
// F6 for characters: a strip of a person at the frame edge (an arm and a hem beside the close-up) reads as a stray shape; it fails
for (const c of spec.characters) { const ch = sc.character(c.id); let sl = null, run = null;
  for (const t of frames) { const cam = sc.camAt(t), cn = sc.camAt(t + 1 / spec.fps); if (t > sceneEnd || (cam.z < 2.2 && (Math.abs(cn.z / cam.z - 1) > 0.004 || Math.abs(cn.x - cam.x) > 3))) continue;   // close shots count even while the camera moves (v13 frame 280)
    const b = sc.screenBox(cam, ch.bbox(t), sc.lane(c.lane).parallax), vis = Math.max(0, Math.min(1920, b.x + b.w) - Math.max(0, b.x)) / b.w;
    // a reveal sweeps past the edge in a few frames and is fine; a sliver that lingers 0.3 s or more is the defect
    if (vis > 0 && vis < 0.25) { run = run || {t, vis, px: Math.max(0, Math.min(1920, b.x + b.w) - Math.max(0, b.x)), n: 0}; run.n++; if (run.n >= Math.round(0.3 * spec.fps)) { sl = run; break; } } else run = null; }
  add('F6 no character slivers at the frame edge', sl ? 'FAIL' : 'PASS', sl ? `only ${(sl.vis * 100).toFixed(0)}% (${sl.px.toFixed(0)} px) of ${c.id} shows at the edge at ${sl.t.toFixed(2)} s` : 'characters are in frame or out of it', sl ? 'frame him out or show more of him' : ''); }
// ---------- T: text and devices
{ const mg = RU.safe_margin_px;
  // the stand's whole drawn body (board and wedge base), not only its sheet: the v13 cut-in puts the word card over the base
  const standBox = (cam) => { const pts = [...Object.values(sc.stand.B), ...(sc.stand.base ? sc.stand.base.front.concat(sc.stand.base.side) : [])].map((q) => sc.screen(cam, q, 1.05));
    const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y); return {x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys)}; };
  for (const d of spec.devices) { const [x, y, w, h] = d.box, t0 = sc.time(d.t0), t1 = sc.time(d.t1);
    if (x < mg || y < mg || x + w > 1920 - mg || y + h > 1080 - mg) add('T1 safe margins', 'FAIL', `${d.id} is ${Math.min(x, y, 1920 - x - w, 1080 - y - h).toFixed(0)} px from the edge (min ${mg})`, 'move it in');
    const md = d.min_dur || RU.text_min_dur; if (t1 - t0 < md) add('T2 text stays up long enough', 'FAIL', `${d.id} shows for ${(t1 - t0).toFixed(1)} s (min ${md} s)`, 'lengthen it');
    if (d.kind === 'title' && t1 > sceneEnd + 0.01) add('T3 devices end with their scene', 'FAIL', `${d.id} stays on ${(t1 - sceneEnd).toFixed(1)} s into the next scene`, 'end it with the scene');
    // anything drawn behind a device must not show through unless the device has an opaque backing
    let hit = null; for (const t of frames) { if (t < t0 || t > t1 || t > sceneEnd + 0.5) continue; const cam = sc.camAt(t);
      const things = [['librarian', sc.screenBox(cam, sc.character('librarian').bbox(t), 1.03)], ['stand', focalBox('stand.sheet', t, cam)], ['stand body', standBox(cam)],
        ['lamp', sc.screenBox(cam, sc.box('lamp'), 1.05)], ['cabinet', sc.screenBox(cam, sc.box('cabinet'), 1.05)],
        ...spec.objects.filter((o) => ['panel', 'rack'].includes(o.kind)).map((o) => [o.id, sc.screenBox(cam, sc.box(o.id), 1)])];
      for (const [n, b] of things) { const ov = Math.max(0, Math.min(x + w, b.x + b.w) - Math.max(x, b.x)) * Math.max(0, Math.min(y + h, b.y + b.h) - Math.max(y, b.y));
        if (ov > 0.05 * w * h && d.bg < RU.opaque_bg) { hit = {n, t}; break; } } if (hit) break; }
    if (hit) add('T4 text over drawings needs a solid backing', 'FAIL', `${d.id} (backing ${d.bg}) is crossed by the ${hit.n} at ${hit.t.toFixed(2)} s`, `give it a backing of at least ${RU.opaque_bg}`); }
  for (let i = 0; i < spec.devices.length; i++) for (let j = i + 1; j < spec.devices.length; j++) { const a = spec.devices[i], b = spec.devices[j];
    const tt = Math.min(sc.time(a.t1), sc.time(b.t1)) - Math.max(sc.time(a.t0), sc.time(b.t0)); if (tt <= 0) continue;
    const [ax, ay, aw, ah] = a.box, [bx, by, bw, bh] = b.box; if (ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah) add('T5 devices do not overlap', 'FAIL', `${a.id} and ${b.id} overlap`, 'move one'); } }
// ---------- L: layering: nothing in front hides a wall painting in the wide shots
for (const p of spec.objects.filter((o) => o.kind === 'panel')) { let hid = null;
  for (const t of frames) { const cam = sc.camAt(t); if (cam.z > RU.wide_z || t > sceneEnd) continue; const pb = sc.screenBox(cam, sc.box(p.id), 1);
    for (const o of spec.objects.filter((o) => o.lane !== 'wall')) { const ob = sc.screenBox(cam, o.id === 'cabinet' ? {x: sc.stand.B.bl[0], y: sc.stand.B.tl[1], w: sc.stand.B.tr[0] - sc.stand.B.bl[0], h: sc.box('cabinet').y + sc.box('cabinet').h - sc.stand.B.tl[1]} : sc.box(o.id), 1.05);
      const ov = Math.max(0, Math.min(pb.x + pb.w, ob.x + ob.w) - Math.max(pb.x, ob.x)) * Math.max(0, Math.min(pb.y + pb.h, ob.y + ob.h) - Math.max(pb.y, ob.y));
      if (ov > 0.02 * pb.w * pb.h) { hid = {o: o.id, t}; break; } } if (hid) break; }
  if (hid) add('L1 nothing hides a painting', 'FAIL', `${hid.o} covers ${p.id} at ${hid.t.toFixed(2)} s`, 'move one of them'); }
// ---------- S: how a scroll opens
{ const L = sc.stand.layout; if (!(L.rollers === 'left-right' && L.unroll_axis === L.columns_axis))
    add('S1 a scroll opens along its columns', 'FAIL', `rollers ${L.rollers}, unrolls along ${L.unroll_axis}, columns run along ${L.columns_axis}`, 'rollers at the left and right ends; it unrolls along the line of columns'); }
{ const L = sc.stand.layout; if (L.roller_v) { const st = sc.stand, stub = (L.stub || 0) * st.m, vlen = st.B.bl[1] - st.B.tl[1];
    const v0 = L.roller_v[0] - stub / vlen, v1 = L.roller_v[1] + stub / vlen;
    if (L.u_open) { const uw = st.B.br[0] - st.B.bl[0], r = (s0 => s0)(spec.props[0].diameter * st.m / 2) / uw;
      if (L.u_open[0] - r < 0.05 || L.u_open[1] + r > 0.95) add('G7 the open scroll stays on the board', 'FAIL', `rollers at u ${L.u_open.join('-')} with radius ${r.toFixed(3)} reach the board's side edges`, 'move the rollers in'); }
    else add('G7 the open scroll stays on the board', 'FAIL', 'no u_open range for the rollers', 'set scroll_layout.u_open');
    if (v0 < 0 || v1 > 1) add('G7 the open scroll stays on the board', 'FAIL', `rollers and stubs run from v ${v0.toFixed(2)} to ${v1.toFixed(2)} of the board's slope`, 'shorten the rollers'); } }
// ---------- C5: the prop looks like the thing it came from (a tagged scroll comes from a tagged slot)
for (const p of spec.props) { const m0 = p.states[0].at.match(/^(\w+)\.slot\[(\d+),(\d+)\]$/); if (!m0) continue; const q = sc.slot(m0[1], +m0[2], +m0[3]);
  if (!!p.tag !== !!q.tag) add('C5 the prop matches its source', 'FAIL', `${p.id} ${p.tag ? 'has' : 'has no'} tag but ${p.states[0].at} ${q.tag ? 'has one' : 'has none'}`, 'take a matching slot or match the tag'); }
// ---------- F7: the camera never shows past the edge of the art
{ let bad = null; for (const t of frames) { const cam = sc.camAt(t), s0 = sc.screen(cam, [0, 0], 1), s1 = sc.screen(cam, spec.stage.plate, 1);
    if (t <= sceneEnd && (s0.x > 0.5 || s0.y > 0.5 || s1.x < 1919.5 || s1.y < 1079.5)) { bad = {t, s0, s1}; break; } }
  add('F7 the camera stays inside the art', bad ? 'FAIL' : 'PASS', bad ? `at ${bad.t.toFixed(2)} s the wall plate covers x ${bad.s0.x.toFixed(0)}..${bad.s1.x.toFixed(0)}, y ${bad.s0.y.toFixed(0)}..${bad.s1.y.toFixed(0)}` : 'the wall plate covers the frame in every frame', bad ? 'clamp the camera' : ''); }
// ---------- W: every cue word exists
for (const ref of [...spec.beats.map((b) => b.t), ...spec.devices.flatMap((d) => [d.t0, d.t1]), spec.camera.scene_end]) { try { sc.time(ref); } catch (e) { add('W1 cue words exist', 'FAIL', e.message, 'fix the cue'); } }

// ---------- report
const names = [...new Set(out.map((o) => o.id))];
for (const n of names) { const rows = out.filter((o) => o.id === n); if (!rows.some((r) => r.status !== 'PASS')) out.push({id: n, status: 'PASS', msg: '', fix: '', summary: true}); }
const fails = out.filter((o) => o.status === 'FAIL'), warns = out.filter((o) => o.status === 'WARN');
console.log(`${spec.id}${variant ? ` [variant ${variant}]` : ''}: ${fails.length} FAIL, ${warns.length} WARN`);
for (const o of out.filter((o) => o.status !== 'PASS')) console.log(`  ${o.status}  ${o.id}: ${o.msg}${o.fix ? `  -> ${o.fix}` : ''}`);
if (jout) fs.writeFileSync(jout, JSON.stringify({variant, fails: fails.length, warns: warns.length, rows: out}, null, 1));
process.exit(fails.length ? 1 : 0);
