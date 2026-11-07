// Pilot v8 (7 Nov 2026): designed shot by shot for where the eye goes (checked with DeepGaze IIE).
// One thread the viewer follows: you walk in through the arch (FG) -> a librarian walks along the shelves (BG) ->
// takes a scroll from rack C -> carries it into the lamplight -> lays it on the reading stand (MG), it unrolls ->
// close-up of the writing -> reed strips -> the Nile. No second character, no burnt-in captions (Sam, 7 Nov 2026).
// Pilot v10: the same scene driven entirely by the scene spec (scene/room.scene.json) through scene/core.mjs.
// Positions, sizes, timings, poses, camera and devices come from the spec; the validator (scene/validate.mjs) checks
// the very same numbers before any render.
import React from 'react';
import {AbsoluteFill, Img, Audio, staticFile, useCurrentFrame, random, getInputProps} from 'remotion';
import {flick, Grain, SR, SI, MO, IN} from '../cave/vw.jsx';
import {Puppet} from './puppet.jsx';
import WR from './walker_rig8.json';
import PL from './pilot8_place.json';
import WORDS from './pilot8_words.json';
import SPEC from './scene/room.scene.json';
import {makeScene, ramp, lin, fade} from './scene/core.mjs';
const SC = makeScene(SPEC, WORDS, {'walker_rig8.json': WR}, PL), LIB = SC.character('librarian');
const CAPS = SPEC.characters[0].caps.map((c) => ({...c, fill: SPEC.palette[c.fill] || c.fill}));
// both legs drawn in the same colours (Sam, 7 Nov 2026): the far leg is no longer darkened
// walker_rig8: no darkened far limbs, shoulder pivot at the top of the sleeve so the sleeve follows the raised arm

export const PILOT10_DUR = Math.round(SPEC.duration * SPEC.fps);
const FPS = 30, PW = 3840, PH = 2160, BASE = 1920 / PW, T0 = 70.9;
const GOLD = '#F2B85A', CREAM = '#FBE3B0', SKIN = 'rgb(200,151,106)', WOOD = 'rgb(195,135,90)', WOOD2 = 'rgb(168,99,55)', SHEET = 'rgb(232,212,183)', INK = '#3a2a26';
const tw = (id, w, k = 0) => SC.time(`${id}.${w}${k ? '#' + k : ''}`);

// ---- stage units (same as the layout page): metres -> plate px
const PXM = SC.PXM, FLOOR = SC.FLOOR, LX = SC.X;
const Plate = ({cam, p = 1, children, style}) => { const s = BASE * Math.pow(cam.z, p);
  return <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, transformOrigin: '0 0', transform: `translate(${960 - cam.x * s}px, ${540 - cam.y * s}px) scale(${s})`, ...style}}>{children}</div>; };
const Pic = ({src, dir = 'pilot8', x = 0, y = 0, w, h, style}) => <Img src={staticFile(`scrolls/${dir}/${src}`)} style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}} />;
const scr = (cam, X, Y, p = 1) => SC.screen(cam, [X, Y], p);
const Shadow = ({x, y, w}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.07, width: w, height: w * 0.14, borderRadius: '50%', background: 'rgba(0,0,0,0.38)', filter: 'blur(7px)'}} />;

// ---- the reading stand on the cabinet (mid lane), drawn here so a scroll can be laid on it
const CAB = SC.box('cabinet'), CBX = CAB.x, CBY = CAB.y, CBW = CAB.w, CBH = CAB.h, CBC = CBX + CBW / 2, MPX = SC.stand.m;
const {B, at} = SC.stand, BY = B.bl[1], TY = B.tl[1];
const poly = (pts) => pts.map((p) => p.join(',')).join(' ');
const SHEET_C = SC.stand.sheet;
const MARKS = (() => { const out = []; let k = 0;
  for (let c = 0; c < 3; c++) for (let l = 0; l < 12; l++) { const v = 0.17 + l * 0.058; let u = 0.1 + c * 0.285; const ue = u + 0.22 + 0.03 * random(`ue${c}${l}`);
    while (u < ue) { const n = 2 + Math.floor(random(`n${k}`) * 5);
      for (let q = 0; q < n; q++) { const wl = 0.006 + 0.008 * random(`w${k}${q}`); if (u + wl > ue) break;
        out.push({u, v, wl, hh: 0.026 + 0.012 * random(`h${k}${q}`)}); u += wl + 0.003 + 0.003 * random(`g${k}${q}`); }
      u += 0.012 + 0.008 * random(`s${k}`); k++; } }
  return out; })();
const SD = SPEC.props[0].diameter * MPX;   // the scroll's diameter from the spec (one size in every state)
const End = ({cx, cy, d}) => <g><ellipse cx={cx} cy={cy} rx={d * 0.3} ry={d / 2} fill={SHEET} stroke="#000" strokeWidth={2.5} />
  <circle cx={cx} cy={cy} r={d * 0.13} fill="none" stroke="#3a2a22" strokeWidth={2.5} /><circle cx={cx} cy={cy} r={d * 0.05} fill="#3a2a22" /></g>;
const vdir = (() => { const a = at(0, 0), b = at(0, 1), L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / L, (b[1] - a[1]) / L, L]; })();
// a roller lies along the board's slope at position u (the scroll lies across the board and opens sideways); d = diameter
const [RV0, RV1] = SPEC.objects.find((o) => o.id === 'stand').scroll_layout.roller_v, STUB = SPEC.objects.find((o) => o.id === 'stand').scroll_layout.stub * SC.stand.m;
const Roller = ({u, d}) => { const a = at(u, RV0), b = at(u, RV1), ang = Math.atan2(vdir[1], vdir[0]) * 180 / Math.PI, L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
    <rect x={-STUB} y={-5} width={L + 2 * STUB} height={10} fill={WOOD2} stroke="#000" strokeWidth={2.5} />
    <rect x={0} y={-d / 2} width={L} height={d} rx={d * 0.3} fill={SHEET} stroke="#000" strokeWidth={3} />
    <ellipse cx={0} cy={0} rx={d * 0.3} ry={d / 2} fill={SHEET} stroke="#000" strokeWidth={2.5} />
    <circle cx={0} cy={0} r={d * 0.13} fill="none" stroke="#3a2a22" strokeWidth={2.5} /><circle cx={0} cy={0} r={d * 0.05} fill="#3a2a22" /></g>; };
const TAGC = `rgb(${PL.tag_bgr.slice().reverse().map(Math.round).join(',')})`;
const Tag = ({x, y, s = 1}) => <g><line x1={x} y1={y} x2={x} y2={y + 14 * s} stroke="#3a2a22" strokeWidth={2 * s} />
  <rect x={x - 6 * s} y={y + 14 * s} width={12 * s} height={26 * s} fill={TAGC} stroke="#000" strokeWidth={2 * s} /></g>;
const [U0, U1] = SPEC.objects.find((o) => o.id === 'stand').scroll_layout.u_open;
const Stand = ({laid, unroll}) => { const u0 = U0, ur = U0 + (U1 - U0) * unroll, dL = SD * (1 - 0.38 * unroll), dR = SD * 0.62 * Math.min(1, unroll * 3);
  const parts = {...Object.fromEntries(Object.values(SC.stand.legs).map((l) => [l.id, <rect key={l.id} x={l.x} y={l.y} width={l.w} height={l.h} fill={l.layer === 'back' ? WOOD2 : WOOD} stroke="#000" strokeWidth={2.5} />])),
    ...Object.fromEntries(Object.values(SC.stand.bars).map((b) => [b.id, <rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.layer === 'back' ? WOOD2 : WOOD} stroke="#000" strokeWidth={2.5} />])),
    base: SC.stand.base && <g key="base"><polygon points={poly(SC.stand.base.side)} fill={WOOD2} stroke="#000" strokeWidth={3} strokeLinejoin="round" />
      <polygon points={poly(SC.stand.base.front)} fill={WOOD} stroke="#000" strokeWidth={3} strokeLinejoin="round" />
      <line x1={SC.stand.base.x0 + 8} x2={SC.stand.base.x1 - 8} y1={SC.stand.base.yF + 14} y2={SC.stand.base.yF + 14} stroke={WOOD2} strokeWidth={4} /></g>,
    board: <g key="board"><polygon points={poly([B.bl, B.br, [B.br[0], B.br[1] + SC.stand.thick], [B.bl[0], B.bl[1] + SC.stand.thick]])} fill={WOOD2} stroke="#000" strokeWidth={3} strokeLinejoin="round" />
      <polygon points={poly([B.tl, B.tr, B.br, B.bl])} fill={WOOD} stroke="#000" strokeWidth={3} strokeLinejoin="round" /></g>};
  return <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <defs><clipPath id="sheet10"><polygon points={poly([at(u0, RV0 + 0.02), at(ur, RV0 + 0.02), at(ur, RV1 - 0.02), at(u0, RV1 - 0.02)])} /></clipPath></defs>
    {SC.stand.draw.map((id) => parts[id])}
    {laid > 0 && <g opacity={laid}>
      {unroll > 0 && <polygon points={poly([at(u0, RV0 + 0.02), at(ur, RV0 + 0.02), at(ur, RV1 - 0.02), at(u0, RV1 - 0.02)])} fill={SHEET} stroke="#000" strokeWidth={2.5} />}
      {unroll > 0 && <g clipPath="url(#sheet10)">{MARKS.map((m, i) => <polygon key={i} points={poly([at(m.u, m.v), at(m.u + m.wl, m.v), at(m.u + m.wl, m.v + m.hh), at(m.u, m.v + m.hh)])} fill={INK} />)}</g>}
      {unroll > 0.02 && <Roller u={ur} d={dR} />}
      <Roller u={u0} d={dL} />
      <Tag x={at(u0, RV0)[0]} y={at(u0, RV0)[1] - 4} /></g>}
  </svg>; };

// the cabinet under the stand, drawn here: closed storage in the background of the story, so its scroll ends are muted
const Cabinet = () => { const H = CBH, fr = 0.035 * MPX, dv = 0.022 * MPX, C = 6, R = 4;
  const cw = (CBW - 2 * fr - (C - 1) * dv) / C, ch = (H - 2 * fr - (R - 1) * dv) / R, cells = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) cells.push([CBX + fr + c * (cw + dv), CBY + fr + r * (ch + dv)]);
  return <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0}}>
    <rect x={CBX} y={CBY} width={CBW} height={H} fill={WOOD} stroke="#000" strokeWidth={3} />
    {cells.map(([x, y], i) => <g key={i}><rect x={x} y={y} width={cw} height={ch} fill="#4a2f22" stroke="#000" strokeWidth={2} />
      <ellipse cx={x + cw / 2} cy={y + ch / 2} rx={cw * 0.4} ry={ch * 0.4} fill="#8c7a66" stroke="#000" strokeWidth={2} />
      <circle cx={x + cw / 2} cy={y + ch / 2} r={Math.min(cw, ch) * 0.06} fill="#3a2a22" /></g>)}
    <rect x={CBX - 6} y={CBY - 8} width={CBW + 12} height={12} fill={WOOD2} stroke="#000" strokeWidth={2.5} /></svg>; };

const TAKE_SLOT = (() => { const m = SPEC.props[0].states[0].at.match(/slot\[(\d+),(\d+)\]/); return SC.slot('rackC', +m[1], +m[2]); })();

export const camAt = SC.camAt;

// ---- devices
const ChapterTag = ({o = 1}) => <div style={{position: 'absolute', left: 52, top: 40, opacity: o, display: 'flex', alignItems: 'baseline', gap: 14, padding: '8px 14px', background: `rgba(10,14,20,${SPEC.devices[0].bg})`}}>
  <span style={{fontFamily: MO, fontSize: 16, letterSpacing: 3, color: '#D9C6A2'}}>I ·</span>
  <span style={{fontFamily: SR, fontWeight: 600, fontSize: 30, color: '#F4E6C8'}}>The library by the <span style={{fontFamily: SI, color: GOLD}}>sea</span></span></div>;
const PlaceTag = ({t, at: a, dur = 99, text}) => <div style={{position: 'absolute', right: 64, top: 56, opacity: fade(t, a, dur, 0.6, 0.4), fontFamily: MO, fontSize: 15, letterSpacing: 3,
  color: '#F1E2C4', border: '1px solid #C9B48E77', padding: '6px 12px', background: 'rgba(10,14,20,0.6)'}}>{text}</div>;
const WordCard = ({t, at: a, dur}) => { const o = fade(t, a, dur, 0.6, 0.5), dy = (1 - ramp(t, a, a + 0.7)) * 16;
  return <div style={{position: 'absolute', left: 64, bottom: 110, width: 470, opacity: o, transform: `translateY(${dy}px)`, padding: '14px 20px', background: `rgba(10,14,20,${SPEC.devices[2].bg})`, borderLeft: `3px solid ${GOLD}`}}>
    <div style={{fontFamily: MO, fontSize: 14, letterSpacing: 3, color: '#C9B48E'}}>WORD 01</div>
    <div style={{fontFamily: SR, fontWeight: 600, fontSize: 44, color: CREAM, lineHeight: 1.1, marginTop: 2}}>Papyrus</div>
    <div style={{fontFamily: IN, fontSize: 19, color: '#DCCDB2', lineHeight: 1.35, marginTop: 4}}>Paper made from a reed of the Nile marshes, rolled into scrolls.</div></div>; };
const Foot = ({left, right}) => <>
  {left && <div style={{position: 'absolute', left: 64, bottom: 40, fontFamily: MO, fontSize: 12, letterSpacing: 2, color: '#B8AC96', background: `rgba(8,10,14,${DEV.credit_l.bg})`, padding: '4px 8px'}}>{left}</div>}
  <div style={{position: 'absolute', right: 64, bottom: 40, fontFamily: MO, fontSize: 12, letterSpacing: 2, color: '#B8AC96', background: `rgba(8,10,14,${DEV.credit_r.bg})`, padding: '4px 8px'}}>{right}</div></>;

// ---- FG: the front wall and its arch; the camera passes through it on "Walk inside"
const Arch = ({t}) => { const g = Math.pow(ramp(t, 0.25, 2.1), 1.5), s = 1 + 3.2 * g; if (s > 4.1) return null;
  const cx = 960, cy = 640, w = 980 * s, top = cy - 520 * s, spring = top + w / 2, bot = 1080 + 400 * s, j = 34 * s;
  const arch = (W, tp) => { const sp = tp + W / 2; return `M${cx - W / 2},${bot} L${cx - W / 2},${sp} A${W / 2},${W / 2} 0 0 1 ${cx + W / 2},${sp} L${cx + W / 2},${bot} Z`; };
  return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, filter: `blur(${1 + 5 * g}px)`}}>
    <defs><linearGradient id="fw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2230" /><stop offset="1" stopColor="#10141c" /></linearGradient></defs>
    <path d={`M-4000,-4000 H6000 V6000 H-4000 Z ${arch(w + 2 * j, top - j)}`} fill="url(#fw)" fillRule="evenodd" stroke="#000" strokeWidth={4} />
    <path d={`${arch(w + 2 * j, top - j)} ${arch(w, top)}`} fill="#2c3546" fillRule="evenodd" stroke="#000" strokeWidth={3} /></svg>; };

const Room = ({t}) => {
  const tRoom = tw('lib4', 'room'), tBooks = tw('lib4', 'books');
  const cam = camAt(t), lit = ramp(t, tRoom - 0.5, tRoom + 0.5);
  const st = LIB.state(t), wx = st.px, wy = st.py, WS = st.WS, wp = st.pose, wOff = st.offset, held = st.held, laid = st.laid;
  const T = {grab: LIB.at('grab'), unrollA: LIB.at('release') + 0.08, unrollB: LIB.at('release') + 1.28};
  const cd = SD / WS, cl = 0.3 * PXM / WS;   // scroll diameter and length in rig px
  const carried = () => held && <g transform="rotate(95 560 905)"><rect x={600 - cl} y={905 - cd / 2} width={cl} height={cd} rx={cd * 0.3} fill={SHEET} stroke="#000" strokeWidth={5} />
    <ellipse cx={600} cy={905} rx={cd * 0.3} ry={cd / 2} fill={SHEET} stroke="#000" strokeWidth={5} />
    <circle cx={600} cy={905} r={cd * 0.13} fill="none" stroke="#3a2a22" strokeWidth={5} /><circle cx={600} cy={905} r={cd * 0.05} fill="#3a2a22" />
    <line x1={600} y1={905 + cd / 2} x2={600} y2={905 + cd / 2 + 26} stroke="#3a2a22" strokeWidth={4} />
    <rect x={589} y={905 + cd / 2 + 26} width={22} height={48} fill={TAGC} stroke="#000" strokeWidth={4} /></g>;
  // light and focus cues
  const fl = scr(cam, PL.flame[0], PL.flame[1], 1.05), pool = scr(cam, (PL.flame[0] + SHEET_C[0]) / 2 - 60, PL.flame[1] + 40, 1.05);
  const glint = ramp(t, tBooks - 0.6, tBooks - 0.1) * (1 - ramp(t, tBooks + 0.6, tBooks + 1.2));
  const closeO = ramp(cam.z, 2.6, 4.6);
  const take = TAKE_SLOT, RC = SC.box('rackC');
  const cub = `rgb(${PL.cubby_bgr.slice().reverse().map(Math.round).join(',')})`;
  const R0 = (260 + 520 * lit) * fl.s, R1 = (1500 + 900 * lit) * fl.s;
  return <AbsoluteFill style={{background: '#0B0F16'}}>
    <Plate cam={cam} p={1} style={{filter: `blur(${4 * closeO}px)`}}>
      <Pic src="back.jpg" w={PW} h={PH} />
      {t > T.grab && <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0}}><defs><clipPath id="cell10"><rect x={take.x - take.rx - 4} y={take.y - take.ry - 4} width={2 * take.rx + 8} height={2 * take.ry + 8} /></clipPath></defs><g clipPath="url(#cell10)"><ellipse cx={take.x} cy={take.y} rx={take.rx + 3} ry={take.ry + 3} fill={cub} />{take.tag && <rect x={take.tag.x - 9} y={take.tag.y - 20} width={18} height={44} fill={cub} />}</g></svg>}
      
    </Plate>
    <Plate cam={cam} p={1.05}>
      <Shadow x={CBC} y={FLOOR + 90} w={CBW * 1.1} />
      <Stand laid={laid} unroll={ramp(t, T.unrollA, T.unrollB)} />
      <Cabinet />
      <Shadow x={PL.lamp[0] + PL.lamp[2] / 2} y={FLOOR + 90} w={PL.lamp[2] * 1.2} />
      <Pic src="lamp.png" x={PL.lamp[0]} y={PL.lamp[1]} w={PL.lamp[2]} h={PL.lamp[3]} />
    </Plate>
    <Plate cam={cam} p={1.03}>
      <Shadow x={wx} y={wy} w={280} /><Shadow x={wx - 30} y={wy} w={200} />
      <Puppet rig={WR} dir="scrolls/pilot6/walker_parts2" pose={wp} offset={wOff} x={wx} y={wy} scale={WS} anchor={[520, 1523]} attach={{forearm: carried}}
        caps={CAPS} />
    </Plate>
    {/* the lamp is the only light: everything outside its pool sinks into a dark teal */}
    <AbsoluteFill style={{background: `radial-gradient(circle at ${pool.x}px ${pool.y}px, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${R0}px, rgba(8,22,34,${(0.86 - 0.24 * lit) * (1 - 0.8 * closeO)}) ${R1}px)`, mixBlendMode: 'multiply'}} />
    <div style={{position: 'absolute', left: fl.x - 300 * fl.s * 2, top: fl.y - 300 * fl.s * 2, width: 600 * fl.s * 2, height: 600 * fl.s * 2, borderRadius: '50%', mixBlendMode: 'screen', opacity: (0.18 + 0.34 * lit) * flick(t, 2, 0.05), background: `radial-gradient(circle, ${GOLD} 0%, ${GOLD}55 22%, transparent 62%)`}} />
  </AbsoluteFill>; };

// the magnifier over the sheet: crossed reed strips; from "reed" the upright strips stretch up and turn green, the Nile fades in
const Loupe = ({t}) => { const tPaper = tw('lib6', 'paper'), tR = tw('lib6', 'reed');
  const show = ramp(t, tPaper - 0.3, tPaper + 0.5), grow = ramp(t, tR - 0.5, tR + 0.7), out = 1 - ramp(t, tR + 0.35, tR + 0.8);
  if (show <= 0 || out <= 0) return null;
  const c = scr(camAt(t), SHEET_C[0], SHEET_C[1], 1.05), r = (170 + 40 * show) * (1 + 7 * grow);
  const green = () => { const g = ramp(grow, 0.15, 0.7), a = [226, 197, 140], b = [154, 169, 131]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * g)).join(',')})`; };
  return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: out}}><defs><clipPath id="lp8"><circle cx={c.x} cy={c.y} r={r} /></clipPath></defs>
    <g opacity={Math.min(1, show * 1.5)}><g clipPath="url(#lp8)">
      <rect x={c.x - r} y={c.y - r} width={2 * r} height={2 * r} fill="#9E8556" opacity={1 - grow} />
      {Array.from({length: 44}, (_, i) => { const x = c.x - r + i * 34 * (1 + grow), st = 1 + 2.5 * grow;
        return <rect key={`v${i}`} x={x} y={c.y + r - 2 * r * st} width={26 * (1 + grow * 0.4)} height={2 * r * st} fill={green()} stroke="#111" strokeWidth={2} />; })}
      {Array.from({length: 44}, (_, i) => <rect key={`h${i}`} x={c.x - r} y={c.y - r + 6 + i * 34} width={2 * r} height={20} fill="#F4DDB0" stroke="#111" strokeWidth={2} opacity={0.95 * (1 - ramp(grow, 0, 0.45))} />)}</g>
      <circle cx={c.x} cy={c.y} r={r} fill="none" stroke="#7E4A3B" strokeWidth={16} opacity={1 - ramp(grow, 0.2, 0.6)} />
      <circle cx={c.x} cy={c.y} r={r + 8} fill="none" stroke="#111" strokeWidth={3} opacity={1 - ramp(grow, 0.2, 0.6)} /></g></svg>; };

const Nile = ({t, t0}) => { const u = t - t0, cam = {x: 3840 / 2 + 80 * ramp(u, 0, 3), y: 2194 / 2, z: 1.04 + 0.05 * ramp(u, 0, 3)}, sway = Math.sin(t * 1.3) * 0.5;
  return <AbsoluteFill>
    <Plate cam={cam} p={1}><Pic dir="pilot8" src="nile_back.jpg" w={3840} h={2194} /></Plate>
    <div style={{position: 'absolute', inset: 0, transformOrigin: '30% 100%', transform: `skewX(${sway}deg)`}}><Plate cam={cam} p={1.15}><Pic dir="pilot6" src="nile_reeds.png" w={1902} h={2194} /></Plate></div>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,40,0.25) 0%, rgba(0,0,0,0) 45%, rgba(8,20,30,0.25) 100%)'}} />
  </AbsoluteFill>; };

const DEV = Object.fromEntries(SPEC.devices.map((d) => [d.id, d]));
const dT = (id) => [SC.time(DEV[id].t0), SC.time(DEV[id].t1)];
// debug overlay (--props '{"debug":true}'): the validator's hand point and rack C's top-row slots, to prove render and checks agree
const DebugMarks = ({t}) => { const cam = camAt(t), h = SC.screen(cam, LIB.hand(t), 1.03), sl = [0, 1, 2].map((k) => SC.screen(cam, [SC.slot('rackC', 0, k).x, SC.slot('rackC', 0, k).y], 1));
  const ft = LIB.feet(t).map((p) => SC.screen(cam, p, 1.03)), bb = SC.screenBox(cam, LIB.bbox(t), 1.03);
  return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}><circle cx={h.x} cy={h.y} r={10} fill="none" stroke="#0f0" strokeWidth={4} />
    {ft.map((p, k) => <circle key={k} cx={p.x} cy={p.y} r={7} fill="#0ff" />)}<rect x={bb.x} y={bb.y} width={bb.w} height={bb.h} fill="none" stroke="#ff0" strokeWidth={2} />
    {sl.map((p, k) => <g key={k}><circle cx={p.x} cy={p.y} r={8} fill="#f0f" /><text x={p.x + 10} y={p.y} fill="#f0f" fontSize={22}>{k}</text></g>)}</svg>; };
export const PilotRoom10 = () => { const f = useCurrentFrame(), t = f / FPS;
  const tC = tw('lib6', 'reed') - 0.1, toNile = ramp(t, tC, tC + 0.8);
  return <AbsoluteFill style={{background: '#000'}}>
    <Audio src={staticFile('scrolls/pilot/room_vo.mp3')} />
    {toNile < 1 && <Room t={t} />}
    {toNile > 0 && <AbsoluteFill style={{opacity: toNile}}><Nile t={t} t0={tC} /></AbsoluteFill>}
    <Loupe t={t} />
    <Arch t={t} />
    <ChapterTag o={fade(t, dT('chapter')[0], dT('chapter')[1] - dT('chapter')[0], 0.7, 0.5)} />
    <PlaceTag t={t} at={dT('place')[0]} dur={dT('place')[1] - dT('place')[0]} text="HERCULANEUM · 79 AD" />
    <PlaceTag t={t} at={tw('lib6', 'nile') - 0.2} dur={9} text="NILE · EGYPT" />
    <WordCard t={t} at={dT('wordcard')[0]} dur={dT('wordcard')[1] - dT('wordcard')[0]} />
    <Foot left={t < tC ? 'SOURCE · GELL, POMPEIANA (1832)' : null} right="AI-GENERATED ILLUSTRATION" />
    <Grain a={0.03} />
    {getInputProps().debug && <DebugMarks t={t} />}
  </AbsoluteFill>; };
