// Scene core (7 Nov 2026): every number the scene needs is computed here from the scene spec (room.scene.json),
// so the Remotion scene, the layout page and the validator can never disagree. Pure JS: no React, no Remotion.
// Plate px: the 3840x2160 stage picture; metres -> px through the lane's scale; screen px through the camera.

// ---- easing: the same cubic-bezier as CSS / Remotion's Easing.bezier
export const bezier = (x1, y1, x2, y2) => { const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t, dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x;
    for (let i = 0; i < 8; i++) { const e = sx(t) - x, d = dx(t); if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break; t -= e / d; }
    let lo = 0, hi = 1; for (let i = 0; i < 30 && Math.abs(sx(t) - x) > 1e-6; i++) { if (sx(t) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    return sy(t); }; };
export const EZ = bezier(0.45, 0, 0.25, 1);
export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const ramp = (t, a, b, f = 0, to = 1, e = EZ) => f + (to - f) * e(clamp01((t - a) / (b - a)));
export const lin = (t, a, b) => clamp01((t - a) / (b - a));
export const fade = (t, a, d, i = 0.5, o = 0.5) => Math.min(ramp(t, a, a + i), 1 - ramp(t, a + d - o, a + d));

// ---- 2D affine matrices (same as puppet.jsx)
export const mul = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
export const Tm = (x, y) => [1, 0, 0, 1, x, y];
export const Rot = (deg) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; };
export const about = (p, deg) => mul(Tm(p[0], p[1]), mul(Rot(deg), Tm(-p[0], -p[1])));
export const apply = (m, p) => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];

// ---- the walk cycle (moved here from puppet.jsx so the validator runs the same motion)
export const walkPose = (phase, amp) => { const a = 2 * Math.PI * phase, s = Math.sin(a), c = Math.cos(a);
  const knee = (v) => 42 * Math.pow(Math.max(0, v), 1.4);
  return {pose: {near_thigh: -24 * s * amp, far_thigh: 24 * s * amp, near_shin: (knee(c) + 4) * amp, far_shin: (knee(-c) + 4) * amp,
    upper_arm: 24 * s * amp, forearm: (-10 - 8 * s) * amp, far_upper_arm: -24 * s * amp, far_forearm: (-10 + 8 * s) * amp, torso: (2.5 + 1.2 * Math.sin(2 * a)) * amp, head: (-1.5 - 0.8 * Math.sin(2 * a)) * amp},
    bob: -9 * amp * Math.abs(Math.cos(a)) + 4 * amp}; };

export const makeScene = (spec, words, rigs, place) => {
  const S = spec.stage, PXM = S.pxm, FLOOR = S.floor_y, CX = S.cx, BASE = S.base;
  const lane = (l) => S.lanes[l];
  const X = (x, l) => 1920 + (x - CX) * PXM * lane(l).scale;
  const Y = (z, l) => FLOOR + lane(l).drop - z * PXM * lane(l).scale;
  const objs = Object.fromEntries(spec.objects.map((o) => [o.id, o]));
  const chars = Object.fromEntries(spec.characters.map((c) => [c.id, c]));

  // ---- time references: numbers, 'line.word[#k]', 'action:name', 'end', each with an optional +/- offset
  const wordT = (line, w, k = 0) => { const [a, b] = spec.words.spans[line];
    const hit = words.slice(a, b).filter((x) => x[0].toLowerCase().replace(/[^a-z']/g, '') === w)[k];
    if (!hit) throw new Error(`cue word not found: ${line}.${w}#${k}`); return hit[1]; };
  const actionT = (name) => { for (const c of spec.characters) { const a = c.actions.find((x) => x.name === name); if (a) return a.t; } throw new Error(`no action ${name}`); };
  const time = (ref) => { if (typeof ref === 'number') return ref; if (ref === 'end') return spec.duration;
    const m = String(ref).match(/^(.*?)([+-]\d+(\.\d+)?)?$/), base = m[1], off = m[2] ? parseFloat(m[2]) : 0;
    if (base.startsWith('action:')) return actionT(base.slice(7)) + off;
    const [line, wk] = base.split('.'), [w, k] = wk.split('#'); return wordT(line, w, k ? +k : 0) + off; };

  // ---- objects in plate px (x is the centre in metres, the box rests at height z on its lane's floor)
  const box = (id) => { const o = objs[id], sc = lane(o.lane).scale, w = o.w * PXM * sc, h = o.h * PXM * sc;
    const z = o.z || 0; return {x: X(o.x, o.lane) - w / 2, y: Y(z + o.h, o.lane) + (o.drop_px || 0), w, h, lane: o.lane}; };

  // ---- the stand on the cabinet: board quad, legs, stretchers (plate px), and a point on the board at (u, v)
  const stand = (() => { const st = objs.stand, cab = box(st.on), m = PXM * lane(st.lane).scale, cx = cab.x + cab.w / 2, top = cab.y;
    const b = st.board, BY = top - b.z * m, TY = BY - b.h * m, BX0 = cx + b.x0 * m, BW = b.w * m, SL = b.slant * m;
    const B = {bl: [BX0, BY], br: [BX0 + BW, BY], tl: [BX0 + SL, TY], tr: [BX0 + SL + BW, TY]};
    const at = (u, v) => [B.tl[0] + (B.tr[0] - B.tl[0]) * u + (B.bl[0] - B.tl[0]) * v, B.tl[1] + (B.bl[1] - B.tl[1]) * v];
    const legs = Object.fromEntries((st.legs || []).map((l) => [l.id, {...l, x: cx + l.x * m - l.w * m / 2, w: l.w * m, y: top - l.z1 * m, h: (l.z1 - l.z0) * m, bottom: top - l.z0 * m}]));
    const bars = Object.fromEntries((st.stretchers || []).map((s) => { const a = legs[s.from], c = legs[s.to], x0 = a.x + a.w / 2, x1 = c.x + c.w / 2;
      return [s.id, {...s, x: Math.min(x0, x1), w: Math.abs(x1 - x0), y: top - s.z * m - s.h * m / 2, h: s.h * m}]; }));
    // a solid wedge base: its front face runs from the cabinet top up to the board's front edge (under the lip), its side face
    // from the cabinet top up the board's slanted right edge; it is inset from the board's ends so the board overhangs a little
    const base = st.base && st.base.type ? (() => { const i = st.base.inset * m, x0 = B.bl[0] + i, x1 = B.br[0] - i, yF = BY + b.thick * m;
      return {front: [[x0, yF], [x1, yF], [x1, top], [x0, top]], side: [[x1, yF], [B.br[0] + (B.tr[0] - B.br[0]) * 0.85 - i, BY - (BY - TY) * 0.85], [B.br[0] + (B.tr[0] - B.br[0]) * 0.85 - i, top], [x1, top]], x0, x1, yF}; })() : null;
    return {B, at, legs, bars, base, top, cab, m, thick: b.thick * m, sheet: at(0.5, 0.5), draw: st.draw, layout: st.scroll_layout}; })();

  // ---- rack slots: the scroll ends found in the rack art, sorted into the rack's grid (rows top to bottom)
  const slot = (rackId, r, c) => { const rb = box(rackId), L = rackId.replace(/^rack/, '');
    if (place.scrolls && place.scrolls[L]) {   // kit racks: the top scroll of cubby (r, c) is the one a hand takes
      const q = place.scrolls[L].find((s) => s.row === r && s.col === c && s.top); if (!q) throw new Error(`no scroll in ${rackId} cubby ${r},${c}`);
      const cell = place.cells[L].find((e) => e.row === r && e.col === c);
      return {x: rb.x + q.x, y: rb.y + q.y, rx: q.d / 2, ry: q.d / 2, tag: q.tag ? {x: rb.x + q.x, y: rb.y + q.y + q.d * 0.3} : null, cell: {x0: rb.x + cell.x0, y0: rb.y + cell.y0, x1: rb.x + cell.x1, y1: rb.y + cell.y1}}; }
    const [R, C] = objs[rackId].grid;
    const ds = [...place.discs].sort((a, b) => a[1] - b[1]); const rows = [];
    for (let i = 0; i < R; i++) rows.push(ds.slice(i * C, i * C + C).sort((a, b) => a[0] - b[0]));
    const d = rows[r][c], tag = (place.tags || []).find((g) => Math.abs(g[0] - d[0]) < d[2] && g[1] > d[1] - d[3] - 40 && g[1] < d[1]);
    return {x: rb.x + d[0], y: rb.y + d[1], rx: d[2], ry: d[3], index: place.discs.indexOf(d), tag: tag ? {x: rb.x + tag[0], y: rb.y + tag[1]} : null}; };
  const rackEndDiameter = () => place.scrolls ? (() => { const all = Object.values(place.scrolls).flat(); return all.reduce((s, q) => s + q.d, 0) / all.length / PXM; })()
    : (place.discs.reduce((s, d) => s + 2 * d[2], 0) / place.discs.length) / PXM;   // metres

  // ---- characters: position along the lane, walk, poses from the actions, FK of the rig
  const character = (id) => { const c = chars[id], rig = rigs[c.rig], A = Object.fromEntries(c.actions.map((a) => [a.name, a]));
    const legX = (t, W) => { const q = lin(t, W.t0, W.t1), e = q < 0.15 ? 0.5 * q * q / 0.15 / 0.85 : q > 0.85 ? 1 - 0.5 * (1 - q) * (1 - q) / 0.15 / 0.85 : (q - 0.075) / 0.85;
      return W.x0 + (W.x1 - W.x0) * e; };
    const legSpeed = (t, W) => { const q = lin(t, W.t0, W.t1); return q > 0 && q < 1 ? (q < 0.15 ? q / 0.15 : q > 0.85 ? (1 - q) / 0.15 : 1) : 0; };
    const moveAt = (t) => { let i = 0; while (i < c.moves.length - 1 && t >= c.moves[i + 1].t0) i++; return i; };
    const xAt = (t) => legX(t, c.moves[moveAt(t)]);
    const distAt = (t) => { const i = moveAt(t); let d = 0; for (let k = 0; k < i; k++) d += c.moves[k].x1 - c.moves[k].x0; return d + xAt(t) - c.moves[i].x0; };
    // the walk phase advances by distance / (cycle x amplitude): shorter steps when easing in and out, so the stride the
    // legs take always matches the ground covered (with the foot lock this keeps the planted foot still)
    let PH = null;
    const phaseAt = (t, CYC) => { if (!PH) { PH = [0]; const N = Math.ceil(spec.duration * spec.fps) + 2;
        for (let f = 1; f <= N; f++) { const t1 = f / spec.fps, t0 = (f - 1) / spec.fps, sp = legSpeed(t1, c.moves[moveAt(t1)]), a = Math.max(0.3, Math.min(1, Math.pow(sp, 0.6)));
          PH.push(PH[f - 1] + (distAt(t1) - distAt(t0)) * PXM / (CYC * a)); } }
      const fi = t * spec.fps, i = Math.max(0, Math.min(PH.length - 2, Math.floor(fi))), u = fi - i; return PH[i] * (1 - u) + PH[i + 1] * u; };
    const at_ = (name) => time(A[name].t), end_ = (name) => A[name].to ? time(A[name].to) : at_(name) + (A[name].dur || 0.5);
    const state = (t) => { const s0 = state0(t), fx = footLock(t); return {...s0, px: s0.px + fx}; };
    const state0 = (t) => { const sc = lane(c.lane).scale, x = xAt(t), speed = legSpeed(t, c.moves[moveAt(t)]);
      const WS = c.height * PXM * sc / c.rig_height, CYC = c.walk.cycle_rig_px * WS * c.walk.stride;
      const amp = Math.min(1, Math.pow(speed, 0.6)), walk = walkPose(phaseAt(t, CYC), c.walk.stride * amp);
      const look = ramp(t, at_('look'), end_('look')) * (1 - ramp(t, 6.0, 6.6));
      const reach = ramp(t, at_('reach'), end_('reach')), lower = ramp(t, at_('lower'), end_('lower'));
      const lay = ramp(t, at_('lay'), end_('lay')), rest = ramp(t, at_('rest'), end_('rest'));
      const P = (n, k) => A[n].pose[k];
      const arm = (walk.pose.upper_arm || 0) * (1 - reach) + P('reach', 'upper_arm') * reach * (1 - lower) + P('lower', 'upper_arm') * lower;
      const fore = (walk.pose.forearm || 0) * (1 - reach) + P('reach', 'forearm') * reach * (1 - lower) + P('lower', 'forearm') * lower;
      const hp = (n) => (A[n] && A[n].pose && A[n].pose.hand) || 0;
      const handA = hp('reach') * reach * (1 - lower) + hp('lower') * lower;
      const pose = {...walk.pose, hand: (handA * (1 - lay) + hp('lay') * lay) * (1 - rest),
        upper_arm: (arm * (1 - lay) + P('lay', 'upper_arm') * lay) * (1 - rest) + (walk.pose.upper_arm || 0) * rest,
        forearm: (fore * (1 - lay) + P('lay', 'forearm') * lay) * (1 - rest) + (walk.pose.forearm || 0) * rest,
        torso: (walk.pose.torso || 0) + 4 * reach * (1 - lower) + 2 * lay * (1 - rest),
        head: (walk.pose.head || 0) - 12 * look + 3 * lay * (1 - rest)};
      const breathe = Math.sin(t * 2.1) * 3 * (1 - speed);
      const offset = {torso: [0, walk.bob * speed + breathe - 14 * reach * (1 - lower)]};
      return {x, speed, WS, pose, offset, px: X(x, c.lane), py: FLOOR + lane(c.lane).drop,
        held: t > at_('grab') && t < at_('release'), laid: t >= at_('release') ? 1 : 0,
        handShape: t >= at_('grab') && t < at_('release') ? 'grip' : (t >= at_('reach') && t < at_('grab')) ? 'reach' : 'relaxed',
        propYaw: 90 * ramp(t, at_('grab'), at_('grab') + 0.55)}; };
    // foot lock (precomputed per frame): while walking, the lower foot is planted; the body offset keeps it still,
    // fading out as the walk eases in and out so every stop still lands on its planned mark
    let LOCK = null;
    const footLock = (t) => { if (c.foot_lock === false) return 0;
      if (!LOCK) { LOCK = []; const by = Object.fromEntries(rig.parts.map((p) => [p.name, p])); let plant = null, foot = -1;
        for (let f = 0; f <= Math.ceil(spec.duration * spec.fps) + 1; f++) { const tt = f / spec.fps, s = state0(tt);
          const W = {}; const M = (n) => { if (W[n]) return W[n]; const p = by[n], local = mul(Tm(...(s.offset[n] || [0, 0])), about(p.pivot, s.pose[n] || 0)); return (W[n] = p.parent ? mul(M(p.parent), local) : local); };
          const fl = c.feet.map((q) => apply(M(q.part), q.at).map((v, k) => (v - c.anchor[k]) * s.WS));
          // the stance foot is the one travelling backwards under the body (its leg is pushing); keep it until the other one is
          const s1 = state0(tt + 1 / spec.fps), W1 = {}; const M1 = (n) => { if (W1[n]) return W1[n]; const p = by[n], local = mul(Tm(...(s1.offset[n] || [0, 0])), about(p.pivot, s1.pose[n] || 0)); return (W1[n] = p.parent ? mul(M1(p.parent), local) : local); };
          const vx = c.feet.map((q, i) => (apply(M1(q.part), q.at)[0] - c.anchor[0]) * s1.WS - fl[i][0]);
          let k = foot < 0 ? (vx[0] < vx[1] ? 0 : 1) : (vx[1 - foot] < vx[foot] - 2 ? 1 - foot : foot); const w = Math.min(1, s.speed / 0.35);
          if (w <= 0) { plant = null; foot = -1; LOCK.push(0); continue; }
          if (k !== foot || plant === null) { foot = k; plant = s.px + fl[k][0] + (LOCK.length ? LOCK[LOCK.length - 1] : 0); }
          LOCK.push(w * (plant - (s.px + fl[k][0]))); } }
      const fi = t * spec.fps, i = Math.max(0, Math.min(LOCK.length - 2, Math.floor(fi))), u = fi - i; return LOCK[i] * (1 - u) + LOCK[i + 1] * u; };
    const world = (t) => { const s = state(t), by = Object.fromEntries(rig.parts.map((p) => [p.name, p])), W = {};
      const M = (n) => { if (W[n]) return W[n]; const p = by[n], local = mul(Tm(...(s.offset[n] || [0, 0])), about(p.pivot, s.pose[n] || 0));
        return (W[n] = p.parent ? mul(M(p.parent), local) : local); };
      rig.parts.forEach((p) => M(p.name));
      const toPlate = (m, pt) => { const q = apply(m, pt); return [s.px + s.WS * (q[0] - c.anchor[0]), s.py + s.WS * (q[1] - c.anchor[1])]; };
      return {s, W, toPlate, by}; };
    const point = (t, part, pt) => { const w = world(t); return w.toPlate(w.W[part], pt); };
    const hand = (t) => point(t, c.hand.part, c.hand.at);
    const feet = (t) => c.feet.map((f) => point(t, f.part, f.at));
    const bbox = (t) => { const w = world(t); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const p of rig.parts) for (const q of [[p.x, p.y], [p.x + p.w, p.y], [p.x, p.y + p.h], [p.x + p.w, p.y + p.h]]) {
        const [a, b] = w.toPlate(w.W[p.name], q); x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, a); y1 = Math.max(y1, b); }
      return {x: x0, y: y0, w: x1 - x0, h: y1 - y0}; };
    return {spec: c, rig, state, world, point, hand, feet, bbox, at: at_, end: end_, xAt}; };

  // ---- camera: a chain of shots, each blended into the next
  const mix = (a, b, w) => ({x: a.x + (b.x - a.x) * w, y: a.y + (b.y - a.y) * w, z: a.z * Math.pow(b.z / a.z, w)});
  const target = (to) => { if (to.target === 'stand.sheet') return {x: stand.sheet[0] + (to.dx || 0), y: stand.sheet[1] + (to.dy || 0), z: to.z};
    if (to.wall_x !== undefined) return {x: X(to.wall_x, 'wall'), y: to.y, z: to.z}; return to; };
  const camAt = (t) => { let c = {...spec.camera.start};
    for (const sh of spec.camera.shots) { const w = sh.linear ? lin(t, time(sh.t0), time(sh.t1)) : ramp(t, time(sh.t0), time(sh.t1));
      const tgt = sh.follow ? {x: Math.max(sh.min_x || 0, X(character(sh.follow).xAt(t), chars[sh.follow].lane) + sh.lead), y: sh.y, z: sh.z} : target(sh.to);
      c = mix(c, tgt, w); }
    // never show past the edge of the art: the wall plate (parallax 1) must cover the whole frame
    const hw = 960 / (BASE * c.z), hh = 540 / (BASE * c.z), [PW, PH] = S.plate;
    if (spec.camera.clamp === false) return c;
    c.x = hw * 2 >= PW ? PW / 2 : Math.min(PW - hw, Math.max(hw, c.x)); c.y = hh * 2 >= PH ? PH / 2 : Math.min(PH - hh, Math.max(hh, c.y));
    return c; };
  const screen = (cam, P, p = 1) => { const s = BASE * Math.pow(cam.z, p); return {x: 960 + (P[0] - cam.x) * s, y: 540 + (P[1] - cam.y) * s, s}; };
  const screenBox = (cam, b, p = 1) => { const a = screen(cam, [b.x, b.y], p), c = screen(cam, [b.x + b.w, b.y + b.h], p); return {x: a.x, y: a.y, w: c.x - a.x, h: c.y - a.y}; };

  // ---- props: where a prop is at time t
  const propAt = (id, t) => { const pr = spec.props.find((p) => p.id === id);
    const st = pr.states.find((s) => t >= time(s.from) && t < time(s.to)) || pr.states[pr.states.length - 1];
    const where = (ref) => { let m = ref.match(/^(\w+)\.slot\[(\d+),(\d+)\]$/); if (m) { const q = slot(m[1], +m[2], +m[3]); return [q.x, q.y]; }
      if (ref.endsWith('.hand')) return character(ref.split('.')[0]).hand(t);
      if (ref === 'stand.top') return stand.at(stand.layout.u_open ? stand.layout.u_open[0] : 0.06, 0.5); throw new Error(`unknown place ${ref}`); };
    return {state: st, at: st.at, pos: where(st.at), diameter: st.diameter || pr.diameter}; };

  return {spec, PXM, FLOOR, BASE, lane, X, Y, time, box, stand, slot, rackEndDiameter, character, camAt, screen, screenBox, propAt, objs, chars};
};
