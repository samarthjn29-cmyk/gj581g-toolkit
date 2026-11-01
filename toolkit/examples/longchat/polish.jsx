// LongChat drawing kit, quality pass (Sam, 1 Nov 2026: "I want the quality of all of the drawings to go up").
// Fuller characters with volume and clothes, paper props with tape, curl and shadow, richer instruments.
import React from 'react';
import {useCurrentFrame, spring} from 'remotion';
import {C, f, prog, FPS, HAND} from './lib';
import {Ink, PopG, rectPath, ellPath, linePath, wob} from './draw';
import Peep from 'react-peeps';
// straight-edged hand-drawn polygon: each edge subdivided so the wobble stays small and the corners stay sharp
export const poly = (pts, seed = 1, amp = 1.2) => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; const n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 60)); for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } out.push(pts[pts.length - 1]); return wob(out, seed, amp); };

const SKIN = '#F6DCC2', HAIR = '#4A3528', TROUSER = '#5A4A40', SHOE = '#2E2420';

// soft shadow + filled shape + outline, drawn instantly (for things that pop rather than draw on)
export const Solid = ({d, fill, w = 4, color = C.ink, shade, shadow = true, op = 1}) => <g opacity={op}>
  {shadow && <path d={d} fill={C.ink} opacity={0.13} transform="translate(7 9)" />}
  <path d={d} fill={fill} />
  {shade && <path d={d} fill={`url(#hatch-${shade})`} opacity={0.55} />}
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />
</g>;

// a standing (or walking) person with volume: hair, face, neck, shirt with collar, sleeves, hands, trousers, shoes; optional backpack of folders
export const Walker = ({x, y, s = 1, at = 0, face = 1, shirt = '#E9DCC4', walk = 0, stagger = 0, raise = 0, pack = 0, packColor = C.ai, mood = 'neutral', seed = 7000, sit = 0, typing = 0, slump = 0}) => {
  const fr = useCurrentFrame(); if (fr < f(at)) return null;
  const t = fr - f(at); const pop = spring({frame: t, fps: FPS, config: {damping: 14, stiffness: 160, mass: 0.7}});
  const sw = walk ? Math.sin(fr * 0.35) : 0; const st = stagger ? 7 * Math.sin(fr * 0.22) : 0;
  const P = (pts, k, amp = 0.9) => wob(pts.map(([a, b]) => [x + (a + st * (b < -150 ? 1 : 0.4)) * s * face, y + b * s]), seed + k, amp);
  const hx = x + (st + 4) * s * face, hy = y - 262 * s;
  const leg = (side) => { if (sit) return [[side * 12, -122], [92 + side * 10, -118], [96 + side * 14, -6]]; const k = side * (walk ? 26 * sw : 0); return [[side * 18, -120], [side * 22 + k * 0.5, -60], [side * 20 + k, 0]]; };
  const tb = typing ? 6 * Math.sin(fr * 0.9) : 0;
  const armF = raise ? [[30, -205], [62, -260], [78, -330]] : sit ? [[30, -205], [72, -150 + slump * 40], [150 - slump * 60, -150 + tb + slump * 70]] : [[30, -205], [48 + 10 * sw, -150], [50 + 14 * sw, -105]];
  const armB = sit ? [[-30, -205], [40, -160 + slump * 40], [126 - slump * 60, -156 - tb + slump * 70]] : [[-30, -205], [-46 - 10 * sw, -150], [-46 - 14 * sw, -108]];
  return <g transform={`translate(${x} ${y}) scale(${0.85 + 0.15 * pop}) translate(${-x} ${-y})`} opacity={Math.min(1, t / 5)}>
    {/* ground shadow */}
    <ellipse cx={x} cy={y + 6 * s} rx={70 * s} ry={12 * s} fill={C.ink} opacity={0.12} />
    {/* backpack (behind): a canvas bag with a stack of folders poking out */}
    {pack > 0 && (() => { const bx = x - face * 66 * s - 28 * s; return <g>
      {Array.from({length: Math.round(pack)}, (_, k) => <path key={k} d={rectPath(bx + (k % 2 ? 6 : 2) * s, y - (250 + k * 20) * s, 52 * s, 18 * s, seed + 40 + k, 0.6)} fill={k % 2 ? '#FFFFFF' : packColor} stroke={C.ink} strokeWidth={2.5} />)}
      <Solid d={rectPath(bx, y - 232 * s, 56 * s, 124 * s, seed + 30, 1.2)} fill={packColor} w={3.5} shade="l" />
    </g>; })()}
    {sit ? <g>
      <Solid d={rectPath(x - 70 * s * face - (face < 0 ? 50 * s : 0), y - 128 * s, 170 * s, 22 * s, seed + 60, 0.8)} fill="#8C6B4F" w={3.5} />
      <Solid d={rectPath(x - 86 * s * face - (face < 0 ? 22 * s : 0), y - 300 * s, 22 * s, 190 * s, seed + 61, 0.8)} fill="#8C6B4F" w={3.5} />
      {[-60, 80].map((dx, k) => <path key={k} d={wob([[x + dx * s * face, y - 106 * s], [x + (dx + (k ? 8 : -8)) * s * face, y]], seed + 62 + k, 0.5)} stroke={C.ink} strokeWidth={7} fill="none" />)}
    </g> : null}
    {/* legs (trousers) + shoes */}
    {[-1, 1].map((sd) => <g key={sd}>
      <path d={P(leg(sd), 10 + sd, 0.6)} stroke={TROUSER} strokeWidth={26 * s} strokeLinecap="round" fill="none" />
      <path d={P(leg(sd), 12 + sd, 0.6)} stroke={C.ink} strokeWidth={3} fill="none" opacity={0.5} />
      <ellipse cx={x + (leg(sd)[2][0] + 10) * s * face} cy={y - 2 * s} rx={22 * s} ry={9 * s} fill={SHOE} />
    </g>)}
    {/* back arm */}
    <path d={P(armB, 20, 0.6)} stroke={shirt} strokeWidth={20 * s} strokeLinecap="round" fill="none" />
    <path d={P(armB, 21, 0.6)} stroke={C.ink} strokeWidth={3} fill="none" opacity={0.6} />
    <circle cx={x + armB[2][0] * s * face} cy={y + armB[2][1] * s} r={10 * s} fill={SKIN} stroke={C.ink} strokeWidth={2.5} />
    {/* torso: shirt with collar and hem */}
    <Solid d={P([[-38, -222], [-10, -224], [12, -224], [38, -222], [41, -175], [44, -125], [0, -124], [-44, -125], [-41, -175], [-38, -222]], 30, 0.8)} fill={shirt} w={4} />
    <path d={P([[-14, -222], [0, -204], [14, -222]], 31, 0.4)} stroke={C.ink} strokeWidth={3} fill="#FFFFFF" />
    <path d={P([[-40, -140], [40, -140]], 32, 0.6)} stroke={C.ink} strokeWidth={2} opacity={0.4} fill="none" />
    {/* straps */}
    {pack > 0 && <path d={P([[-30, -220], [-22, -150]], 33, 0.4)} stroke={C.ink} strokeWidth={6} fill="none" />}
    {/* neck + head + hair + face */}
    <rect x={hx - 9 * s} y={hy + 34 * s} width={18 * s} height={16 * s} fill={SKIN} />
    <ellipse cx={hx} cy={hy} rx={36 * s} ry={39 * s} fill={SKIN} stroke={C.ink} strokeWidth={4} />
    <path d={wob([[hx - 38 * s, hy - 2 * s], [hx - 34 * s, hy - 30 * s], [hx - 6 * s, hy - 44 * s], [hx + 26 * s, hy - 36 * s], [hx + 38 * s * face, hy - 14 * s], [hx + 10 * s * face, hy - 22 * s], [hx - 20 * s, hy - 16 * s], [hx - 38 * s, hy - 2 * s]], seed + 50, 0.8)} fill={HAIR} stroke={C.ink} strokeWidth={3} />
    <ellipse cx={hx - 30 * s * face} cy={hy + 4 * s} rx={6 * s} ry={9 * s} fill={SKIN} stroke={C.ink} strokeWidth={2.5} />
    <circle cx={hx + 14 * s * face} cy={hy + 2 * s} r={4.2 * s} fill={C.ink} />
    {mood === 'worried' ? <path d={`M ${hx + 4 * s * face} ${hy + 22 * s} q ${8 * s * face} ${-5 * s} ${16 * s * face} 0`} stroke={C.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
      : <path d={`M ${hx + 4 * s * face} ${hy + 18 * s} q ${8 * s * face} ${7 * s} ${16 * s * face} 0`} stroke={C.ink} strokeWidth={3} fill="none" strokeLinecap="round" />}
    <path d={`M ${hx + 8 * s * face} ${hy - 12 * s} l ${10 * s * face} ${-2 * s}`} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
    {/* front arm */}
    <path d={P(armF, 40, 0.6)} stroke={shirt} strokeWidth={20 * s} strokeLinecap="round" fill="none" />
    <path d={P(armF, 41, 0.6)} stroke={C.ink} strokeWidth={3} fill="none" opacity={0.6} />
    <circle cx={x + armF[2][0] * s * face} cy={y + armF[2][1] * s} r={11 * s} fill={SKIN} stroke={C.ink} strokeWidth={2.5} />
  </g>; };

// sticky note with a strip of tape, a curled corner and a lifted shadow
export const Sticky = ({x, y, w = 180, h = 150, at, fill, rot = 0, seed = 1, glow, children}) => <PopG at={at} cx={x + w / 2} cy={y + h / 2}>
  <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
    {glow && <rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} rx={16} fill={C.callout} opacity={0.22} />}
    <path d={`M ${x + 8} ${y + 14} L ${x + w + 6} ${y + 16} L ${x + w + 2} ${y + h + 14} L ${x + 12} ${y + h + 10} Z`} fill={C.ink} opacity={0.14} />
    <path d={poly([[x, y], [x + w, y], [x + w, y + h - 26], [x + w - 26, y + h], [x, y + h], [x, y]], seed, 1)} fill={fill} stroke={C.ink} strokeWidth={3} />
    <path d={wob([[x + w, y + h - 26], [x + w - 22, y + h - 22], [x + w - 26, y + h]], seed + 1, 0.4)} fill="#FFFFFF" stroke={C.ink} strokeWidth={2.5} opacity={0.9} />
    <rect x={x + w / 2 - 34} y={y - 12} width={68} height={24} fill="#FFF6DA" opacity={0.85} stroke={C.rule} strokeWidth={1.5} transform={`rotate(${-3 + (seed % 5)} ${x + w / 2} ${y})`} />
    {children}
  </g></PopG>;

// a sheet of paper / card with lifted shadow and a folded corner
export const Paper = ({x, y, w, h, at, fill = '#FFFFFF', seed = 1, fold = true, lw = 4}) => <PopG at={at} cx={x + w / 2} cy={y + h / 2}>
  <path d={rectPath(x + 8, y + 10, w, h, seed + 3, 1)} fill={C.ink} opacity={0.12} />
  <path d={fold ? poly([[x, y], [x + w - 34, y], [x + w, y + 34], [x + w, y + h], [x, y + h], [x, y]], seed, 1.2) : rectPath(x, y, w, h, seed, 1.4)} fill={fill} stroke={C.ink} strokeWidth={lw} />
  {fold && <path d={poly([[x + w - 34, y], [x + w - 34, y + 34], [x + w, y + 34]], seed + 1, 0.5)} fill={C.rule} stroke={C.ink} strokeWidth={3} />}
</PopG>;

// a proper gauge: bezel ring, coloured scale, numbered ticks, needle with hub
export const Gauge2 = ({cx, cy, r = 230, at, value, color, label}) => { const fr = useCurrentFrame(); if (fr < f(at)) return null; const a = Math.PI * (1 - value / 100);
  const arc = (r1, a0, a1) => { const p0 = [cx + r1 * Math.cos(Math.PI * (1 - a0)), cy - r1 * Math.sin(Math.PI * (1 - a0))], p1 = [cx + r1 * Math.cos(Math.PI * (1 - a1)), cy - r1 * Math.sin(Math.PI * (1 - a1))];
    return `M ${p0[0]} ${p0[1]} A ${r1} ${r1} 0 0 1 ${p1[0]} ${p1[1]}`; };
  const pop = Math.min(1, prog(fr, at, 0.4));
  return <g opacity={pop}>
    <path d={`${arc(r + 28, 0, 1)} L ${cx + r + 28} ${cy + 30} L ${cx - r - 28} ${cy + 30} Z`} fill={C.ink} opacity={0.12} transform="translate(8 10)" />
    <path d={`${arc(r + 28, 0, 1)} L ${cx + r + 28} ${cy + 30} L ${cx - r - 28} ${cy + 30} Z`} fill="#FFFFFF" stroke={C.ink} strokeWidth={6} />
    <path d={arc(r - 6, 0, 0.5)} stroke={C.ai} strokeWidth={26} fill="none" opacity={0.9} />
    <path d={arc(r - 6, 0.5, 0.8)} stroke={C.hl} strokeWidth={26} fill="none" opacity={0.9} />
    <path d={arc(r - 6, 0.8, 1)} stroke={C.you} strokeWidth={26} fill="none" />
    {Array.from({length: 11}, (_, i) => { const b = Math.PI * (1 - i / 10); const big = i % 5 === 0;
      return <line key={i} x1={cx + (r - (big ? 52 : 38)) * Math.cos(b)} y1={cy - (r - (big ? 52 : 38)) * Math.sin(b)} x2={cx + (r + 8) * Math.cos(b)} y2={cy - (r + 8) * Math.sin(b)} stroke={C.ink} strokeWidth={big ? 5 : 3} />; })}
    {[0, 50, 100].map((v) => { const b = Math.PI * (1 - v / 100); return <text key={v} x={cx + (r - 86) * Math.cos(b)} y={cy - (r - 86) * Math.sin(b) + 10} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={C.secondary}>{v}</text>; })}
    <line x1={cx} y1={cy} x2={cx + (r - 30) * Math.cos(a)} y2={cy - (r - 30) * Math.sin(a)} stroke={C.ink} strokeWidth={14} strokeLinecap="round" opacity={0.15} transform="translate(5 7)" />
    <line x1={cx} y1={cy} x2={cx + (r - 30) * Math.cos(a)} y2={cy - (r - 30) * Math.sin(a)} stroke={color} strokeWidth={12} strokeLinecap="round" />
    <circle cx={cx} cy={cy} r={22} fill={C.ink} /><circle cx={cx} cy={cy} r={8} fill="#FFFFFF" />
  </g>; };

// a school desk with a pupil raising a hand (for "answers too early")
export const Pupil = ({x, y, at, raise = 1, s = 1}) => <g>
  <Walker x={x} y={y} s={s} at={at} raise={raise} sit={1} shirt={C.you} seed={7300} />
  <Solid d={rectPath(x - 130 * s, y - 120 * s, 260 * s, 26 * s, 7310, 1)} fill="#C9A77C" shade="l" />
  <path d={wob([[x - 110 * s, y - 94 * s], [x - 110 * s, y], [x + 110 * s, y - 94 * s], [x + 110 * s, y]].slice(0, 2), 7311, 0.5)} stroke={C.ink} strokeWidth={6} fill="none" />
  <path d={wob([[x + 110 * s, y - 94 * s], [x + 110 * s, y]], 7312, 0.5)} stroke={C.ink} strokeWidth={6} fill="none" />
</g>;

// ---------------------------------------------------------------- the main character ("you"), built from Open Peeps (CC0, Pablo Stanley)
// Two layers so the shirt and the skin can have different colours: body layer (shirt colour) under a head layer (skin colour).
const SKIN2 = '#F3D2B3';
export const Hero = ({x, y, h = 600, at = 0, body = 'Shirt', face = 'Calm', hair = 'ShortVolumed', shirt = C.you, flip = false, bust = false, bob = 0}) => {
  const fr = useCurrentFrame(); if (fr < f(at)) return null; const t = fr - f(at);
  const sp = spring({frame: t, fps: FPS, config: {damping: 14, stiffness: 150, mass: 0.7}});
  const VB = bust ? {x: '0', y: '0', width: '850', height: '1200'} : {x: '-150', y: '-50', width: '1500', height: '2600'};
  const w = h * Number(VB.width) / Number(VB.height);
  const st = {position: 'absolute', left: 0, top: 0, width: w, height: h};
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h + bob, width: w, height: h, opacity: Math.min(1, t / 5),
    transform: `scale(${(flip ? -1 : 1) * (0.92 + 0.08 * sp)}, ${0.92 + 0.08 * sp})`, transformOrigin: '50% 100%', filter: 'drop-shadow(7px 9px 0 rgba(59,47,42,0.13))'}}>
    <Peep style={st} body={body} strokeColor={C.ink} backgroundColor={shirt} viewBox={VB} />
    <Peep style={st} face={face} hair={hair} strokeColor={C.ink} backgroundColor={SKIN2} viewBox={VB} />
  </div>; };

// a simple room corner behind a desk: wall, window with sky, shelf with books, desk top, mug, plant
export const DeskRoom = ({at = 0, deskY = 760, part = 'all'}) => { const fr = useCurrentFrame(); const op = Math.min(1, prog(fr, at, 0.5));
  const wall = part !== 'desk', desk = part !== 'wall';
  return <g opacity={op}>{wall && <>
    <rect x={0} y={0} width={1920} height={deskY} fill="#EAD9BB" opacity={0.55} />
    <Solid d={rectPath(1660, 70, 220, 300, 9001, 1.5)} fill="#DCE6F5" w={6} />
    <path d={linePath(1770, 70, 1770, 370, 9002, 0.6)} stroke={C.ink} strokeWidth={5} /><path d={linePath(1660, 220, 1880, 220, 9003, 0.6)} stroke={C.ink} strokeWidth={5} />
    <path d={wob([[1680, 330], [1720, 300], [1760, 320], [1800, 290], [1860, 310]], 9004, 2)} stroke="#7FB8A4" strokeWidth={10} fill="none" />
    <Solid d={rectPath(120, 250, 380, 18, 9010, 0.8)} fill="#8C6B4F" w={3.5} />
    {[['#B85C3C', 40], ['#35609E', 34], ['#E0892E', 46], ['#7A6A58', 30], ['#F3E6CC', 40]].map(([c, w], i, a) => { const xx = 140 + a.slice(0, i).reduce((s2, b) => s2 + b[1] + 6, 0); const hh = 90 + (i * 37) % 40;
      return <Solid key={i} d={rectPath(xx, 250 - hh, w, hh, 9020 + i, 0.8)} fill={c} w={3} shadow={false} />; })}
    </>}{desk && <>
    <Solid d={rectPath(-20, deskY, 1960, 46, 9030, 1)} fill="#B98F63" w={5} shade="l" />
    <rect x={0} y={deskY + 46} width={1920} height={1080 - deskY - 46} fill="#C9A77C" />
    <rect x={0} y={deskY + 46} width={1920} height={1080 - deskY - 46} fill="url(#hatch-l)" opacity={0.5} />
    {/* mug */}
    <Solid d={rectPath(1560, deskY - 90, 80, 90, 9040, 1)} fill="#FFFFFF" w={4} />
    <path d={wob([[1640, deskY - 70], [1672, deskY - 64], [1672, deskY - 30], [1640, deskY - 24]], 9041, 0.6)} stroke={C.ink} strokeWidth={5} fill="none" />
    {fr % 60 < 40 && <path d={wob([[1590, deskY - 110], [1580, deskY - 140], [1598, deskY - 170]], 9042 + Math.floor(fr / 20), 2)} stroke={C.secondary} strokeWidth={3} fill="none" opacity={0.6} />}
    {/* plant */}
    <Solid d={poly([[30, deskY], [45, deskY - 80], [135, deskY - 80], [150, deskY], [30, deskY]], 9050, 0.8)} fill="#B85C3C" w={4} />
    {[[-40, -190], [0, -230], [40, -200], [-70, -150], [70, -150]].map(([dx, dy], i) => <path key={i} d={wob([[90, deskY - 80], [90 + dx * 0.6, deskY - 80 + dy * 0.6], [90 + dx, deskY - 80 + dy]], 9060 + i, 2)} stroke="#2E7D5B" strokeWidth={12} fill="none" strokeLinecap="round" />)}
  </>}</g>; };
