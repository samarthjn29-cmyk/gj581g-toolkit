// Scene 2, gate 3: the stand-in pass. The locked set (pilot room, gate 2) with every move at real timing on the narration
// (scene2_words.json, t 0 = 85.4 s): the librarian is the real rig drawn grey, your hands are grey mittens. Everything
// here is driven by scene/room2.scene.json, which the validator also reads. Rough on purpose: we judge blocking, reach,
// crops, hand-overs and timing, not art.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {Room, Plate, Nile, PILOT_END, MARKS, CURE, COLS_U, COL_W, CURE_COL, CURE_L0, LINE_V0, LINE_DV, LEAN} from './pilot_room10.jsx';
import {Back, RoomAndMap, Badge} from './scene2_animatic.jsx';
import {Puppet2} from './kit/Puppet2.jsx';
import {makeScene} from './scene/core.mjs';
import SPEC from './scene/room2.scene.json';
import WORDS from './scene2_words.json';
import RIG from './kit/librarian_rig.json';
import PL from './pilot8_place.json';
import MAP from './scene2_map.json';

export const S2_SI_DUR = Math.round(SPEC.duration * SPEC.fps);
const SC = makeScene(SPEC, WORDS, {[SPEC.characters[0].rig]: RIG}, PL), LIB = SC.character('librarian'), at = SC.stand.at;
const ez = Easing.bezier(0.45, 0, 0.25, 1);
const R = (t, a, b, f = 0, to = 1) => interpolate(t, [a, b], [f, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ez});
const W = (line, w, k = 0) => SC.time(`${line}.${w}${k ? `#${k}` : ''}`);
const SHEET = 'rgb(232,212,183)', INK = '#3a2a26', GREY = '#a3a8ad', GREY_D = '#7d838a';
const [RV0, RV1] = SPEC.objects.find((o) => o.id === 'stand').scroll_layout.roller_v, [U0, U1] = SPEC.objects.find((o) => o.id === 'stand').scroll_layout.u_open;
const V0 = RV0 + 0.02, V1 = RV1 - 0.02;

// ---- cue times (words, not guesses)
const T = {glued: W('lib7', 'glued'), end: W('lib7', 'end'), columns: W('lib7', 'columns'), side: W('lib7', 'side'),
  you: W('lib8', 'you'), held: W('lib8', 'held'), hands: W('lib8', 'hands'), unrolled: W('lib8', 'unrolled'), column: W('lib8', 'column'),
  this_: W('lib9', 'this'), hundreds: W('lib9', 'hundreds'), greek: W('lib10', 'greek'), philosophy: W('lib10', 'philosophy')};
const POV0 = 7.6, LIFT0 = T.held, LIFT1 = T.hands + 0.1, NARROW1 = LIFT1 + 0.45, BACK0 = 12.6, BACK1 = 13.2, OUT1 = 13.6, MAP0 = 15.4, COL0 = 21.3, BADGE0 = 25.0;

// ---- the roll in YOUR hands (screen space). Its sheet is drawn in board units (u, v) through an affine map A that starts
// as the board's own map at the current camera (so the hand-over from the stand is seamless) and turns to face you.
const mapOf = (o, a, b) => [a[0] - o[0], a[1] - o[1], b[0] - o[0], b[1] - o[1], o[0], o[1]];   // (u,v) -> screen
const boardMap = (cam) => { const s = (q) => { const p = SC.screen(cam, q, 1.05); return [p.x, p.y]; }; return mapOf(s(at(0, 0)), s(at(1, 0)), s(at(0, 1))); };
const front = (uc, k, cx = 960, cy = 560) => { const kv = k * 0.45 / 0.95;   // 1 u = 0.95 m, 1 v = 0.45 m: keep the sheet's true shape
  return [k, 0, 0, kv, cx - uc * k, cy - 0.5 * kv]; };
const mix = (A, B, w) => A.map((v, i) => v + (B[i] - v) * w);
const ap = (M, u, v) => [M[0] * u + M[2] * v + M[4], M[1] * u + M[3] * v + M[5]];
const poly = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
// the window between your hands (u range) and where it is centred: whole sheet -> one column and a half, then one column per step
const COLC = (c) => COLS_U[c] + COL_W / 2 - 16 * LEAN;
const pov = (t, cam) => { const lift = R(t, LIFT0, LIFT1), narrow = R(t, LIFT1, NARROW1), s1 = R(t, T.unrolled, T.unrolled + 0.5), s2 = R(t, T.column, T.column + 0.5);
  const back = R(t, BACK0, BACK1), out = R(t, BACK1, OUT1);
  const uc = COLC(1) + (COLC(2) - COLC(1)) * s1 + (COLC(3) - COLC(2)) * s2, half = 0.37 * (1 - narrow) + 0.115 * narrow;   // hands ~22 cm apart: two and a half columns show
  const ucW = ((U0 + U1) / 2) * (1 - narrow) + uc * narrow;
  const k = 1500 / 0.74 * (1 - narrow) + 2765 * narrow;   // the whole roll height (28 cm) fits the frame with room for the hands
  const wa = ucW - half, wb = ucW + half;
  const bm = boardMap(cam), fm = front(ucW, k, 960, 540);
  const M = mix(mix(bm, fm, lift), bm, back);           // lifts toward you, later lowers back onto the board
  return {M, wa: wa * (1 - back) + U0 * back, wb: wb * (1 - back) + U1 * back, lift, back, out, s1, s2}; };
const HeldRoll = ({t, cam}) => { if (t < LIFT0 || t > BACK1) return null; const {M, wa, wb} = pov(t, cam);
  const q = (u, v) => ap(M, u, v), d = Math.hypot(M[2], M[3]) * 0.07 / 0.45 * 1.0;   // roller diameter ~ 7 cm in screen px
  return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    <defs><clipPath id="win"><polygon points={poly([q(wa, V0), q(wb, V0), q(wb, V1), q(wa, V1)])} /></clipPath></defs>
    <polygon points={poly([q(wa, V0), q(wb, V0), q(wb, V1), q(wa, V1)])} fill={SHEET} stroke="#000" strokeWidth={3} />
    <g clipPath="url(#win)">
      {MARKS.map((m, i) => <polygon key={i} points={poly([q(m.u, m.v), q(m.u + m.wl, m.v), q(m.u + m.wl, m.v + m.hh), q(m.u, m.v + m.hh)])} fill={INK} opacity={0.72} />)}
      <g transform={`matrix(${[M[0] / 1000, M[1] / 1000, M[2] / 1000, M[3] / 1000, M[4], M[5]].join(',')})`}>{CURE.map((ln, l) => { const L = CURE_L0 + l;
        return <text key={l} x={(COLS_U[CURE_COL] - L * LEAN) * 1000} y={(LINE_V0 + L * LINE_DV + 0.0088) * 1000} fontFamily="Inter" fontWeight={700} fontSize={12.2} fill={INK}
          textLength={COL_W * 1000 * ln.length / 11.5} lengthAdjust="spacingAndGlyphs">{ln}</text>; })}</g></g>
    {[wa, wb].map((u, i) => { const P = pov(t, cam), dd = d * (i ? 1.0 : 0.55 + 0.1 * (P.s1 + P.s2)), a = q(u, RV0), b = q(u, RV1), s0 = q(u, RV0 - 0.045), s1 = q(u, RV1 + 0.045);
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, L = Math.hypot(b[0] - a[0], b[1] - a[1]), ow = Math.max(3, dd * 0.035);
      return <g key={i}><line x1={s0[0]} y1={s0[1]} x2={s1[0]} y2={s1[1]} stroke="#000" strokeWidth={dd * 0.3 + 2 * ow} /><line x1={s0[0]} y1={s0[1]} x2={s1[0]} y2={s1[1]} stroke="rgb(168,99,55)" strokeWidth={dd * 0.3} />
        <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}><rect x={0} y={-dd / 2} width={L} height={dd} rx={dd * 0.3} fill={SHEET} stroke="#000" strokeWidth={ow} />
          <ellipse cx={0} cy={0} rx={dd * 0.3} ry={dd / 2} fill={SHEET} stroke="#000" strokeWidth={ow} />
          <circle cx={0} cy={0} r={dd * 0.13} fill="none" stroke="#3a2a22" strokeWidth={ow} /><circle cx={0} cy={0} r={dd * 0.05} fill="#3a2a22" /></g>
        {i === 0 && <g><line x1={a[0]} y1={a[1]} x2={a[0] - dd * 0.25} y2={a[1] + dd * 0.4} stroke="#3a2a22" strokeWidth={ow} />
          <rect x={a[0] - dd * 0.25 - dd * 0.17} y={a[1] + dd * 0.4} width={dd * 0.34} height={dd * 0.8} fill="#B8322B" stroke="#000" strokeWidth={ow} /></g>}</g>; })}
  </svg>; };
// YOUR hands: grey mittens on the rollers, forearms coming in from the bottom corners. Before the lift they reach for the
// rollers on the board; after the roll is set back down they withdraw out of frame.
// capsule path (tapered), as in the kit
const cap = (p0, p1, r0, r1) => { const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, a = Math.asin(Math.max(-1, Math.min(1, (r0 - r1) / L))), nx = -uy, ny = ux, c = Math.cos(a), sn = Math.sin(a);
  const n1 = [nx * c + ux * sn, ny * c + uy * sn], n2 = [-nx * c + ux * sn, -ny * c + uy * sn], P = (p, n, r) => `${(p[0] + n[0] * r).toFixed(1)},${(p[1] + n[1] * r).toFixed(1)}`;
  return `M${P(p0, n1, r0)} L${P(p1, n1, r1)} A${r1},${r1} 0 0 0 ${P(p1, n2, r1)} L${P(p0, n2, r0)} A${r0},${r0} 0 0 0 ${P(p0, n1, r0)} Z`; };
const SKIN = 'rgb(200,151,106)', SKIN_D = 'rgb(176,128,88)';
// YOUR hands. Final: bare forearms in the warm skin of the room, each hand closed round a roller from the outside, the thumb
// lying across the front of the roller (what you see of your own grip); sized from the roller so hand and roll keep true scale
// (a hand ~1.3x a 7 cm roll). Stand-in: grey mittens. Before the lift they reach for the rollers; after, they withdraw.
const Hands = ({t, cam, final}) => { if (t < POV0 || t > OUT1) return null;
  const inn = R(t, T.you - 0.1, LIFT0), {M, wa, wb, out, s1, s2} = pov(t, cam);
  const turn = -6 * (R(t, T.unrolled - 0.18, T.unrolled) * (1 - s1) + R(t, T.column - 0.18, T.column) * (1 - s2)) + 14 * (s1 > 0 && s1 < 1 ? Math.sin(s1 * Math.PI) : 0) + 14 * (s2 > 0 && s2 < 1 ? Math.sin(s2 * Math.PI) : 0);
  const vm = (V0 + V1) / 2, grip = [ap(M, wa, vm), ap(M, wb, vm)], rest = [[160, 1300], [1760, 1300]], drop = 700 * out;
  const dR = Math.hypot(M[2], M[3]) * 0.07 / 0.45, size = 230 * (1 - inn) + Math.max(dR, 40) * inn;
  if (!final) return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    {grip.map((g, i) => { const h = [rest[i][0] + (g[0] - rest[i][0]) * inn, rest[i][1] + (g[1] - rest[i][1]) * inn + drop], elbow = [i ? 1980 : -60, 1220 + drop * 0.3];
      return <g key={i}><line x1={elbow[0]} y1={elbow[1]} x2={h[0]} y2={h[1] + 30} stroke="#000" strokeWidth={118} strokeLinecap="round" />
        <line x1={elbow[0]} y1={elbow[1]} x2={h[0]} y2={h[1] + 30} stroke={GREY} strokeWidth={106} strokeLinecap="round" />
        <g transform={`rotate(${i ? turn : 0} ${h[0]} ${h[1]})`}><rect x={h[0] - 62} y={h[1] - 70} width={124} height={150} rx={52} fill={GREY} stroke="#000" strokeWidth={6} /></g></g>; })}</svg>;
  return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    {grip.map((g, i) => { const sgn = i ? 1 : -1, S = size, h = [rest[i][0] + (g[0] - rest[i][0]) * inn, rest[i][1] + (g[1] - rest[i][1]) * inn + drop], ow = Math.max(4, S * 0.04);
      // palm on the outer side of the roller, wrist below it; the forearm is ~1.6 hands long and its elbow sits just below the frame
      const palmC = [h[0] + sgn * S * 0.45, h[1] + S * 0.05], wrist = [h[0] + sgn * S * 0.55, h[1] + S * 0.55];
      const dirv = [sgn * 0.42, 0.91], elbow = [wrist[0] + dirv[0] * S * 1.7, wrist[1] + dirv[1] * S * 1.7], shoulder = [elbow[0] + sgn * S * 0.2, elbow[1] + 1400];
      const palm = cap([palmC[0], palmC[1] - S * 0.28], [palmC[0], palmC[1] + S * 0.3], S * 0.34, S * 0.36);
      const arm = cap(wrist, elbow, S * 0.3, S * 0.4), upper = cap(elbow, shoulder, S * 0.42, S * 0.5);
      const fingers = [-0.27, -0.09, 0.09, 0.26].map((dy, k) => cap([palmC[0] - sgn * S * 0.05, h[1] + dy * S], [h[0] - sgn * S * (0.22 - Math.abs(k - 1.5) * 0.05), h[1] + dy * S + S * 0.02], S * 0.1, S * 0.085));
      return <g key={i} transform={`rotate(${i ? turn : 0} ${h[0]} ${h[1]})`} strokeLinejoin="round">
        {[upper, arm, palm].map((d, k) => <path key={`o${k}`} d={d} fill="#000" stroke="#000" strokeWidth={ow * 2} />)}
        {[upper, arm, palm].map((d, k) => <path key={`f${k}`} d={d} fill={SKIN} />)}
        {fingers.map((d, k) => <path key={`fo${k}`} d={d} fill="#000" stroke="#000" strokeWidth={ow * 1.6} />)}
        {fingers.map((d, k) => <path key={`ff${k}`} d={d} fill={SKIN} />)}
        {[-0.18, 0, 0.18].map((dy, k) => <path key={`kn${k}`} d={`M${palmC[0] - sgn * S * 0.02},${h[1] + dy * S} l${-sgn * S * 0.1},0`} stroke={SKIN_D} strokeWidth={ow * 0.7} strokeLinecap="round" />)}</g>; })}</svg>; };

// ---- 2A/2B on the stand: the joins between sheets glow on "glued ... end", the columns light up left to right on "columns"
const JOINS = [0.315, 0.5, 0.685];   // ~17.5 cm sheets (kollemata), in u
const SheetCues = ({t}) => { const g = (k) => R(t, [T.glued, T.end, T.end + 0.35][k], [T.glued, T.end, T.end + 0.35][k] + 0.25) * (1 - R(t, T.columns - 0.6, T.columns - 0.2));
  const colOn = (i) => R(t, T.columns - 0.4 + i * 0.12, T.columns - 0.2 + i * 0.12) * (1 - R(t, T.side + 0.6, T.side + 0.9)), sweep = R(t, T.side, T.side + 0.8, 0, 1);
  if (t < 1 || t > POV0) return null;
  return <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    {JOINS.map((u, k) => <g key={k}><line x1={at(u, V0)[0]} y1={at(u, V0)[1]} x2={at(u, V1)[0]} y2={at(u, V1)[1]} stroke="#b99a6a" strokeWidth={1.4} />
      <polygon points={poly([at(u - 0.008, V0), at(u + 0.008, V0), at(u + 0.008, V1), at(u - 0.008, V1)])} fill="#FFF0C8" opacity={0.85 * g(k)} style={{mixBlendMode: 'screen'}} /></g>)}
    {COLS_U.map((u, i) => <polygon key={i} points={poly([at(u - 0.004, LINE_V0 - 0.01), at(u + COL_W + 0.004, LINE_V0 - 0.01), at(u + COL_W + 0.004 - 32 * LEAN, LINE_V0 + 32 * LINE_DV), at(u - 0.004 - 32 * LEAN, LINE_V0 + 32 * LINE_DV)])}
      fill="none" stroke="#F2B85A" strokeWidth={1.6} opacity={colOn(i)} />)}
    {sweep > 0 && sweep < 1 && <polygon points={poly([at(U0 + (U1 - U0) * sweep - 0.05, V0), at(U0 + (U1 - U0) * sweep + 0.05, V0), at(U0 + (U1 - U0) * sweep + 0.05, V1), at(U0 + (U1 - U0) * sweep - 0.05, V1)])} fill="#FFF0C8" opacity={0.45 * Math.sin(sweep * Math.PI)} style={{mixBlendMode: 'screen'}} />}
  </svg>; };

// ---- 2D-1: a ripple of light across every scroll end on "hundreds", left to right
const Ripple = ({t}) => { if (t < T.hundreds - 0.2 || t > T.hundreds + 1.6) return null;
  return <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0}}>{['A', 'B', 'C'].flatMap((k) => PL.scrolls[k].map((q, i) => { const x = PL['rack' + k][0] + q.x, y = PL['rack' + k][1] + q.y;
    const a = R(t, T.hundreds + x / 3840 * 0.9, T.hundreds + 0.25 + x / 3840 * 0.9) * (1 - R(t, T.hundreds + 0.6 + x / 3840 * 0.6, T.hundreds + 1.0 + x / 3840 * 0.6));
    return a > 0.01 ? <circle key={`${k}${i}`} cx={x} cy={y} r={q.d / 2} fill="#FFF0C8" opacity={0.7 * a} style={{mixBlendMode: 'screen'}} /> : null; }))}</svg>; };

// he takes down another roll: at the end of his reach the top roll of the cubby under his hand leaves the rack (one-frame
// hand-over, the cubby gap drawn on the wall layer) and is in his grip from then on
const TAKE_T = LIB.end('reach');
const TAKEN = (() => { const hp = LIB.hand(TAKE_T); let best = null; for (const q of PL.scrolls.C) { if (!q.top) continue; const x = PL.rackC[0] + q.x, y = PL.rackC[1] + q.y, dd = Math.hypot(x - hp[0], y - hp[1]); if (!best || dd < best.dd) best = {x, y, r: q.d / 2, dd}; } return best; })();
const CUB = `rgb(${PL.cubby_bgr.slice().reverse().map(Math.round).join(',')})`;
const Gap = ({t}) => t >= TAKE_T ? <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0}}><circle cx={TAKEN.x} cy={TAKEN.y} r={TAKEN.r + 1.5} fill={CUB} /></svg> : null;
const heldRoll = (W, layer) => { if (layer !== 'under') return null; const m = W.hand, P0 = [6, -781], cd = 70, cl = 300;
  return <g transform={`matrix(${m.join(',')})`}><rect x={P0[0] - cl * 0.28} y={P0[1] - cd / 2} width={cl} height={cd} rx={cd * 0.3} fill={SHEET} stroke="#000" strokeWidth={7} />
    <ellipse cx={P0[0] + cl * 0.72} cy={P0[1]} rx={cd * 0.18} ry={cd / 2} fill={SHEET} stroke="#000" strokeWidth={7} /></g>; };
const Cast = ({t, final}) => { const st = LIB.state(t);
  return <><div style={{position: 'absolute', left: st.px - 140, top: st.py - 20, width: 280, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', filter: 'blur(7px)'}} />
    <Puppet2 pose={st.pose} offset={st.offset} x={st.px} y={st.py} scale={st.WS} hand={t >= TAKE_T ? 'grip' : st.handShape} prop={t >= TAKE_T ? heldRoll : null} dir={st.dir} style={final ? undefined : {filter: 'grayscale(1) brightness(1.1) contrast(0.8)'}} /></>; };

const Source = ({t}) => { const o = R(t, T.philosophy, T.philosophy + 0.4) * (1 - R(t, BADGE0 - 0.25, BADGE0 - 0.1)); const d = SPEC.devices[0];
  return <div style={{position: 'absolute', left: d.box[0], top: d.box[1], width: d.box[2], height: d.box[3], boxSizing: 'border-box', opacity: o, background: `rgba(10,14,20,${d.bg})`,
    color: '#F1E2C4', fontFamily: 'monospace', fontSize: 15, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{d.text}</div>; };


// ---- T1: the pilot's last image played back. It opens on exactly the pilot's final Nile frame; the reeds lie down into the
// two crossed layers of a papyrus sheet inside the magnifier, which shrinks back onto the open sheet on the stand. The lens is
// clipped to the sheet, so the weave never spills onto the wood; the Nile has faded before the lens lands.
const T1 = ({t, cam}) => { if (t > 1.35) return null; const PE = PILOT_END(), grow = 1 - R(t, 0.1, 0.9), nileO = 1 - R(t, 0.15, 0.6), lensO = R(t, 0, 0.3) * (1 - R(t, 0.95, 1.3));   // the pilot's last frame has no lens: it fades in, as it faded out there
  const c = SC.screen(cam, SC.stand.sheet, 1.05), r = 190 * (1 + 7 * grow), sq = (u, v) => { const p = SC.screen(cam, at(u, v), 1.05); return [p.x, p.y]; };
  const g = R(grow, 0.15, 0.7), col = `rgb(${[226, 197, 140].map((v, i) => Math.round(v + ([154, 169, 131][i] - v) * g)).join(',')})`, st = 1 + 2.5 * grow;
  return <AbsoluteFill>
    {nileO > 0 && <AbsoluteFill style={{opacity: nileO}}><Nile t={PE.t + t} t0={PE.t0} /></AbsoluteFill>}
    <div style={{position: 'absolute', right: 64, top: 56, opacity: 1 - R(t, 0, 0.3), fontFamily: 'monospace', fontSize: 15, letterSpacing: 3, color: '#F1E2C4', border: '1px solid #C9B48E77', padding: '6px 12px', background: 'rgba(10,14,20,0.6)'}}>NILE · EGYPT</div>
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: lensO}}><defs>
      <clipPath id="lensT1"><circle cx={c.x} cy={c.y} r={r} /></clipPath>
      <clipPath id="sheetT1"><polygon points={poly([sq(U0, V0), sq(U1, V0), sq(U1, V1), sq(U0, V1)])} /></clipPath></defs>
      <g clipPath={grow > 0.25 ? undefined : 'url(#sheetT1)'}><g clipPath="url(#lensT1)">
        <rect x={c.x - r} y={c.y - r} width={2 * r} height={2 * r} fill="#9E8556" opacity={1 - grow} />
        {Array.from({length: 44}, (_, i) => { const x = c.x - r + i * 34 * (1 + grow); return <rect key={`v${i}`} x={x} y={c.y + r - 2 * r * st} width={26 * (1 + grow * 0.4)} height={2 * r * st} fill={col} stroke="#111" strokeWidth={2} />; })}
        {Array.from({length: 44}, (_, i) => <rect key={`h${i}`} x={c.x - r} y={c.y - r + 6 + i * 34} width={2 * r} height={20} fill="#F4DDB0" stroke="#111" strokeWidth={2} opacity={0.95 * (1 - R(grow, 0, 0.45))} />)}</g></g>
      <circle cx={c.x} cy={c.y} r={r} fill="none" stroke="#7E4A3B" strokeWidth={16} opacity={1 - R(grow, 0.2, 0.6)} />
      <circle cx={c.x} cy={c.y} r={r + 8} fill="none" stroke="#111" strokeWidth={3} opacity={1 - R(grow, 0.2, 0.6)} /></svg>
  </AbsoluteFill>; };

// ---- 2D-2: the map. The room has shrunk into Herculaneum's pin; famous libraries whose books are lost appear as hollow rings on
// "Greek or Roman library"; on "books" Herculaneum's pin fills with scroll ends, and the tag lands on "still in it". One marker per
// place, labels placed clear of each other, every label on a solid backing. Then the dive into the pin.
const LIBS = [['Rome', -1, -1], ['Pergamon', 1, -1], ['Ephesus', 1, 1], ['Alexandria', 1, 0]];
const MapShot = ({t}) => { const tLib = W('lib9', 'greek'), tBooks = W('lib9', 'books'), tStill = W('lib9', 'still');
  const mapO = R(t, MAP0 + 0.5, MAP0 + 1.4), dive = R(t, 20.2, 21.3, 0, 1), mz = 1 + 60 * dive * dive, [hx, hy] = MAP.pins.Herculaneum;
  const lab = (x, y, text, sx, sy, col, bold) => { const w = text.length * 15 + 20, X = sx < 0 ? x - 26 - w : x + 26, Y = y + (sy < 0 ? -44 : sy > 0 ? 12 : -16);
    return <g><rect x={X} y={Y} width={w} height={32} fill="#0b1a24" opacity={0.92} /><text x={X + 10} y={Y + 23} fontFamily="monospace" fontSize={22} fontWeight={bold ? 700 : 400} letterSpacing={1} fill={col}>{text}</text></g>; };
  return <AbsoluteFill style={{background: '#123447'}}>
    <div style={{position: 'absolute', inset: 0, opacity: mapO, transformOrigin: `${hx}px ${hy}px`, transform: `scale(${mz})`}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {MAP.rings.map((d, i) => <path key={i} d={d} fill="#c8b894" stroke="#3a3326" strokeWidth={2} />)}
        {LIBS.map(([k, sx, sy], i) => { const [x, y] = MAP.pins[k], o = R(t, tLib + i * 0.25, tLib + 0.3 + i * 0.25);
          return <g key={k} opacity={o}><circle cx={x} cy={y} r={13} fill="none" stroke="#0b1a24" strokeWidth={5} /><circle cx={x} cy={y} r={13} fill="none" stroke="#F4E6C8" strokeWidth={2} />{lab(x, y, k.toUpperCase(), sx, sy, '#F4E6C8')}</g>; })}
        <circle cx={hx} cy={hy} r={16} fill="#F2B85A" stroke="#0b1a24" strokeWidth={4} />
        {[[-6, -4], [6, -4], [0, 6]].map(([dx, dy], k) => <circle key={k} cx={hx + dx} cy={hy + dy} r={4.5} fill="#FFF0C8" stroke="#3a2a22" strokeWidth={1.5} opacity={R(t, tBooks + k * 0.08, tBooks + 0.2 + k * 0.08)} />)}
        {lab(hx, hy, 'HERCULANEUM', 1, 1, '#F2B85A', true)}
</svg>
      <div style={{position: 'absolute', right: 1920 - (hx - 26), top: hy + 52, fontFamily: 'monospace', fontSize: 20, letterSpacing: 3, color: '#F1E2C4', background: 'rgba(10,14,20,0.96)', borderRight: '3px solid #F2B85A', padding: '6px 12px', opacity: R(t, tStill, tStill + 0.5) * (1 - R(dive, 0, 0.15))}}>THE ONLY ONE FOUND WITH ITS BOOKS</div>
      {dive > 0.7 && <div style={{position: 'absolute', inset: 0, background: SHEET, opacity: R(dive, 0.7, 1)}} />}
    </div></AbsoluteFill>; };

// ---- T2: the name carries across the cut. "PHILODEMUS" lifts out of the source tag, the sheet darkens to night blue, and the
// name settles under a monogram medallion (no face: no likeness of him survives), ready for lib11.
const BadgeMorph = ({t}) => { const u = R(t, BADGE0 - 0.2, BADGE0 + 0.5), dark = R(t, BADGE0 - 0.1, BADGE0 + 0.35), med = R(t, BADGE0 + 0.15, BADGE0 + 0.6);
  const d = SPEC.devices[0], x0 = d.box[0] + 20, y0 = d.box[1] + 8, x1 = 960 - 5 * 33, y1 = 640;
  return <AbsoluteFill>
    <AbsoluteFill style={{background: '#1b2230', opacity: dark}} />
    <div style={{position: 'absolute', left: 960 - 110, top: 360 - 110, width: 220, height: 220, borderRadius: 110, background: '#efe3c8', border: '6px solid #c9b48e', opacity: med, transform: `scale(${0.7 + 0.3 * med})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Noto Serif", "DejaVu Serif", serif', fontSize: 120, color: '#7a2333'}}>Φ</div>
    <div style={{position: 'absolute', left: x0 + (x1 - x0) * u, top: y0 + (y1 - y0) * u, fontFamily: 'monospace', fontSize: 15 + 33 * u, letterSpacing: 3 + 5 * u, color: '#F1E2C4', whiteSpace: 'nowrap', opacity: R(t, BADGE0 - 0.25, BADGE0 - 0.15)}}>PHILODEMUS</div>
  </AbsoluteFill>; };

export const Scene2StandIn = ({final = false}) => { const f = useCurrentFrame(), t = f / SPEC.fps, cam = SC.camAt(t);
  const holding = t >= LIFT0 && t < BACK1;   // one-frame hand-overs: the roll is either on the board or in your hands, never both
  const gate = {cam, laid: holding ? 0 : 1, unroll: 1, wallBlur: t >= POV0 && t < 13.4 ? 30 : 4, midBlur: 8 * R(t, LIFT0, LIFT1) * (1 - R(t, BACK0, BACK1)), cast: <Cast t={t} final={final} />, mid: <SheetCues t={t} />, wall: <><Ripple t={t} /><Gap t={t} /></>};
  return <AbsoluteFill style={{background: '#000'}}>
    <Audio src={staticFile('scrolls/scene2/vo.mp3')} />
    {t < MAP0 || (t >= COL0 && t < BADGE0 + 0.4) ? <Room t={0} gate={gate} /> : t < COL0 ? (final ? <MapShot t={t} /> : <RoomAndMap t={t} />) : null}
    {final && t >= BADGE0 - 0.25 && <BadgeMorph t={t} />}
    {!final && t >= BADGE0 && <Badge t={t} />}
    {t >= MAP0 && t < MAP0 + 1.4 && (() => { // the rise out of the room: the SAME locked room (with him in it) shrinks into the Herculaneum pin
      const up = R(t, MAP0, MAP0 + 1.4), z = 1 - 0.985 * up, [hx, hy] = MAP.pins.Herculaneum, bw = 1920 * z, bh = 1080 * z, bx = hx + (960 - hx) * (1 - up) - bw / 2, by = hy + (540 - hy) * (1 - up) - bh / 2;
      return <div style={{position: 'absolute', left: bx, top: by, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${z})`, overflow: 'hidden', boxShadow: '0 0 0 3px #000'}}><Room t={0} gate={gate} /></div>; })()}
    {t < 1.35 && (final ? <T1 t={t} cam={cam} /> : <AbsoluteFill><Back t={t} /></AbsoluteFill>)}
    <HeldRoll t={t} cam={cam} />
    <Hands t={t} cam={cam} final={final} />
    {t >= COL0 && t < BADGE0 && (() => { const c = SC.screen(cam, at(0.4483, 0.5038), 1.05), m = `radial-gradient(ellipse 330px 300px at ${c.x}px ${c.y}px, transparent 62%, black 100%)`;
      return <div style={{position: 'absolute', inset: 0, backdropFilter: `blur(${6 * R(t, COL0 + 0.3, COL0 + 1.0)}px)`, WebkitMaskImage: m, maskImage: m}} />; })()}
    <Source t={t} />
    {final ? <div style={{position: 'absolute', right: 64, bottom: 40, fontFamily: 'monospace', fontSize: 12, letterSpacing: 2, color: '#B8AC96', background: 'rgba(8,10,14,1)', padding: '4px 8px'}}>{t >= MAP0 + 0.6 && t < COL0 ? 'MAP · NATURAL EARTH' : 'AI-GENERATED ILLUSTRATION'}</div>
      : <div style={{position: 'absolute', left: 24, top: 20, fontFamily: 'monospace', fontSize: 20, color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '4px 10px'}}>STAND-IN PASS · gate 3 · {(85.4 + t).toFixed(1)} s</div>}
  </AbsoluteFill>; };
