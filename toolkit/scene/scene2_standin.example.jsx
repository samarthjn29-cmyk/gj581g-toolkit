// Scene 2, gate 3: the stand-in pass. The locked set (pilot room, gate 2) with every move at real timing on the narration
// (scene2_words.json, t 0 = 85.4 s): the librarian is the real rig drawn grey, your hands are grey mittens. Everything
// here is driven by scene/room2.scene.json, which the validator also reads. Rough on purpose: we judge blocking, reach,
// crops, hand-overs and timing, not art.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {Room, Plate, MARKS, CURE, COLS_U, COL_W, CURE_COL, CURE_L0, LINE_V0, LINE_DV, LEAN} from './pilot_room10.jsx';
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
  const bm = boardMap(cam), fm = front(ucW, k, 960, 600);
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
    {[wa, wb].map((u, i) => { const a = q(u, V0 - 0.03), b = q(u, V1 + 0.03), dd = d * (i ? 1.0 : 0.55 + 0.1 * (pov(t, cam).s1 + pov(t, cam).s2)), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const k0 = q(u, V0 - 0.075), k1 = q(u, V1 + 0.075);
      return <g key={i}><line x1={k0[0]} y1={k0[1]} x2={k1[0]} y2={k1[1]} stroke="#000" strokeWidth={dd * 0.28 + 6} strokeLinecap="round" /><line x1={k0[0]} y1={k0[1]} x2={k1[0]} y2={k1[1]} stroke="#8a5a34" strokeWidth={dd * 0.28} strokeLinecap="round" />
        <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}><rect x={0} y={-dd / 2} width={L} height={dd} rx={dd * 0.18} fill="#E6D2AE" stroke="#000" strokeWidth={4} />
          {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={0} x2={L} y1={-dd / 2 + dd * f} y2={-dd / 2 + dd * f} stroke="#b99a6a" strokeWidth={2} />)}</g></g>; })}
  </svg>; };
// YOUR hands: grey mittens on the rollers, forearms coming in from the bottom corners. Before the lift they reach for the
// rollers on the board; after the roll is set back down they withdraw out of frame.
const Hands = ({t, cam}) => { if (t < POV0 || t > OUT1) return null;
  const inn = R(t, T.you - 0.1, LIFT0), {M, wa, wb, out, s1, s2} = pov(t, cam);
  const turn = -6 * (R(t, T.unrolled - 0.18, T.unrolled) * (1 - s1) + R(t, T.column - 0.18, T.column) * (1 - s2)) + 14 * (s1 > 0 && s1 < 1 ? Math.sin(s1 * Math.PI) : 0) + 14 * (s2 > 0 && s2 < 1 ? Math.sin(s2 * Math.PI) : 0);
  const vm = (V0 + V1) / 2, grip = [ap(M, wa, vm), ap(M, wb, vm)], rest = [[160, 1300], [1760, 1300]], drop = 700 * out;
  return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    {grip.map((g, i) => { const h = [rest[i][0] + (g[0] - rest[i][0]) * inn, rest[i][1] + (g[1] - rest[i][1]) * inn + drop], elbow = [i ? 1980 : -60, 1220 + drop * 0.3];
      const r = i ? turn : 0;
      return <g key={i}><line x1={elbow[0]} y1={elbow[1]} x2={h[0]} y2={h[1] + 30} stroke="#000" strokeWidth={118} strokeLinecap="round" />
        <line x1={elbow[0]} y1={elbow[1]} x2={h[0]} y2={h[1] + 30} stroke={GREY} strokeWidth={106} strokeLinecap="round" />
        <g transform={`rotate(${r} ${h[0]} ${h[1]})`}><rect x={h[0] - 62} y={h[1] - 70} width={124} height={150} rx={52} fill={GREY} stroke="#000" strokeWidth={6} />
          <rect x={h[0] + (i ? -78 : 34)} y={h[1] - 36} width={44} height={86} rx={22} fill={GREY_D} stroke="#000" strokeWidth={5} /></g></g>; })}
    <text x={960} y={1050} textAnchor="middle" fontFamily="monospace" fontSize={18} fill="#fff" opacity={inn * (1 - out)}>STAND-IN · YOUR HANDS</text>
  </svg>; };

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

const Cast = ({t}) => { const st = LIB.state(t);
  return <><div style={{position: 'absolute', left: st.px - 140, top: st.py - 20, width: 280, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', filter: 'blur(7px)'}} />
    <Puppet2 pose={st.pose} offset={st.offset} x={st.px} y={st.py} scale={st.WS} hand={st.handShape} dir={st.dir} style={{filter: 'grayscale(1) brightness(1.1) contrast(0.8)'}} /></>; };

const Source = ({t}) => { const o = R(t, T.philosophy, T.philosophy + 0.4) * (1 - R(t, BADGE0 - 0.3, BADGE0)); const d = SPEC.devices[0];
  return <div style={{position: 'absolute', left: d.box[0], top: d.box[1], width: d.box[2], height: d.box[3], boxSizing: 'border-box', opacity: o, background: `rgba(10,14,20,${d.bg})`,
    color: '#F1E2C4', fontFamily: 'monospace', fontSize: 15, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{d.text}</div>; };

export const Scene2StandIn = () => { const f = useCurrentFrame(), t = f / SPEC.fps, cam = SC.camAt(t);
  const holding = t >= LIFT0 && t < BACK1;   // one-frame hand-overs: the roll is either on the board or in your hands, never both
  const gate = {cam, laid: holding ? 0 : 1, unroll: 1, wallBlur: t >= POV0 && t < 13.4 ? 30 : 4, cast: <Cast t={t} />, mid: <SheetCues t={t} />, wall: <Ripple t={t} />};
  return <AbsoluteFill style={{background: '#000'}}>
    <Audio src={staticFile('scrolls/scene2/vo.mp3')} />
    {t < MAP0 || (t >= COL0 && t < BADGE0) ? <Room t={0} gate={gate} /> : t < COL0 ? <RoomAndMap t={t} /> : <Badge t={t} />}
    {t >= MAP0 && t < MAP0 + 1.4 && (() => { // the rise out of the room: the SAME locked room (with him in it) shrinks into the Herculaneum pin
      const up = R(t, MAP0, MAP0 + 1.4), z = 1 - 0.985 * up, [hx, hy] = MAP.pins.Herculaneum, bw = 1920 * z, bh = 1080 * z, bx = hx + (960 - hx) * (1 - up) - bw / 2, by = hy + (540 - hy) * (1 - up) - bh / 2;
      return <div style={{position: 'absolute', left: bx, top: by, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${z})`, overflow: 'hidden', boxShadow: '0 0 0 3px #000'}}><Room t={0} gate={gate} /></div>; })()}
    {t < 1.35 && <AbsoluteFill><Back t={t} /></AbsoluteFill>}
    <HeldRoll t={t} cam={cam} />
    <Hands t={t} cam={cam} />
    <Source t={t} />
    <div style={{position: 'absolute', left: 24, top: 20, fontFamily: 'monospace', fontSize: 20, color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '4px 10px'}}>STAND-IN PASS · gate 3 · {(85.4 + t).toFixed(1)} s</div>
  </AbsoluteFill>; };
