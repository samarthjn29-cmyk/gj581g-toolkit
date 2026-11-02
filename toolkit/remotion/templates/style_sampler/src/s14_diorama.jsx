// S14 Isometric diorama: a tiny 2.5D world (two neighbourhoods) the camera flies over; money is coins that stack up and fly to the shop.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useT, s, tw, ramp, back, lerp, Narr, Sfx, Caps} from './common';

const C30 = 0.866;
const P = (X, Y, Z = 0) => [(X - Y) * C30, (X + Y) * 0.5 - Z];
const poly = (pts) => pts.map((p) => P(...p).map((v) => v.toFixed(1)).join(',')).join(' ');
const Box = ({X, Y, Z = 0, w, d, h, top, left, right}) => <g>
  <polygon points={poly([[X, Y + d, Z], [X + w, Y + d, Z], [X + w, Y + d, Z + h], [X, Y + d, Z + h]])} fill={left} />
  <polygon points={poly([[X + w, Y, Z], [X + w, Y + d, Z], [X + w, Y + d, Z + h], [X + w, Y, Z + h]])} fill={right} />
  <polygon points={poly([[X, Y, Z + h], [X + w, Y, Z + h], [X + w, Y + d, Z + h], [X, Y + d, Z + h]])} fill={top} /></g>;
const Roof = ({X, Y, Z, w, d, h, a, b}) => { const ap = [X + w / 2, Y + d / 2, Z + h];
  return <g><polygon points={poly([[X, Y + d, Z], [X + w, Y + d, Z], ap])} fill={a} /><polygon points={poly([[X + w, Y, Z], [X + w, Y + d, Z], ap])} fill={b} /></g>; };
const Tree = ({X, Y}) => { const [x, y] = P(X, Y, 0); return <g><ellipse cx={x} cy={y} rx="26" ry="14" fill="#000" opacity="0.15" />
  <rect x={x - 5} y={y - 30} width="10" height="30" fill="#6B4A2C" /><path d={`M ${x - 34} ${y - 26} L ${x} ${y - 120} L ${x + 34} ${y - 26} Z`} fill="#2F6B4A" /><path d={`M ${x} ${y - 120} L ${x + 34} ${y - 26} L ${x + 6} ${y - 26} Z`} fill="#25563B" /></g>; };
const Coin = ({x, y, glow = 0, c = '#E9B83C'}) => <g>
  {glow > 0 && <ellipse cx={x} cy={y} rx={44} ry={28} fill="#FFE28A" opacity={0.5 * glow} />}
  <path d={`M ${x - 32} ${y} L ${x - 32} ${y + 9} A 32 18 0 0 0 ${x + 32} ${y + 9} L ${x + 32} ${y} Z`} fill="#B98A22" />
  <ellipse cx={x} cy={y} rx="32" ry="18" fill={c} /><ellipse cx={x} cy={y} rx="20" ry="11" fill="none" stroke="#C8962A" strokeWidth="2.5" /></g>;
const Sign = ({x, y, t, a, text, col, sub}) => { const p = back(t, a, 0.4); if (p <= 0.01) return null; const bob = Math.sin(t * 2.4 + x) * 4; const w = Math.max(192, sub.length * 14 + 44);
  return <g transform={`translate(${x} ${y + bob}) scale(${p})`}>
    <rect x={-w / 2} y="-56" width={w} height="92" rx="16" fill="#FFFFFF" stroke={col} strokeWidth="5" />
    <text x="0" y="-22" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="20" fill="#6B7280" letterSpacing="2">{sub}</text>
    <text x="0" y="24" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="44" fill={col}>{text}</text>
    <path d="M -10 36 L 0 50 L 10 36 Z" fill={col} /></g>; };

const Island = ({X0, Y0, who, t, raise, newAt, price, priceAt, eatAt, keepCol}) => { const nNew = raise;
  const [px, py] = P(X0 + 190, Y0 + 270, 0); const [shx, shy] = P(X0 + 295, Y0 + 115, 150);
  const coins = [];
  for (let i = 0; i < 4; i++) coins.push(<Coin key={'b' + i} x={px} y={py - i * 12} c="#CFC4A6" />);
  for (let j = 0; j < nNew; j++) { const p = back(t, newAt + j * 0.12, 0.35); if (p <= 0.01) continue; const eaten = j < (eatAt ? 4 : 0) ? ramp(t, eatAt + j * 0.15, 0.6) : 0;
    const k = 4 + j; const x0 = px, y0 = py - k * 12 - (1 - p) * 120;
    const x = lerp(x0, shx, eaten), y = lerp(y0, shy, eaten) - Math.sin(eaten * Math.PI) * 160;
    if (eaten >= 1) continue;
    const keep = j >= (eatAt ? 4 : 0); coins.push(<Coin key={'n' + j} x={x} y={y} glow={keep ? ramp(t, keepCol, 0.4) : 0} />); }
  const name = who === 'ann' ? 'ANN' : 'BARBARA', col = who === 'ann' ? '#2E8B6E' : '#C0453A';
  return <g>
    <Box X={X0} Y={Y0} Z={-40} w={400} d={400} h={40} top="#A8C97F" left="#7A5A3C" right="#634930" />
    <Box X={X0 + 40} Y={Y0 + 40} w={150} d={130} h={110} top="#F2E6D0" left="#EADBC0" right="#D5C3A2" />
    <Roof X={X0 + 40} Y={Y0 + 40} Z={110} w={150} d={130} h={80} a={col} b={who === 'ann' ? '#246F58' : '#9E372E'} />
    {[[X0 + 90, 0.5]].map(([x], i) => <polygon key={i} points={poly([[x, Y0 + 170, 0], [x + 40, Y0 + 170, 0], [x + 40, Y0 + 170, 60], [x, Y0 + 170, 60]])} fill="#6B4A2C" />)}
    <Box X={X0 + 230} Y={Y0 + 60} w={130} d={110} h={90} top="#E9EEF2" left="#DCE3E8" right="#C4CDD4" />
    <polygon points={poly([[X0 + 230, Y0 + 170, 70], [X0 + 360, Y0 + 170, 70], [X0 + 360, Y0 + 190, 55], [X0 + 230, Y0 + 190, 55]])} fill="#E0684B" />
    <polygon points={poly([[X0 + 250, Y0 + 170, 10], [X0 + 340, Y0 + 170, 10], [X0 + 340, Y0 + 170, 50], [X0 + 250, Y0 + 170, 50]])} fill="#9EC3D8" />
    <Tree X={X0 + 50} Y={Y0 + 330} /><Tree X={X0 + 340} Y={Y0 + 330} /><Tree X={X0 + 30} Y={Y0 + 230} />
    {coins}
    <Sign x={P(X0 + 115, Y0 + 105, 0)[0]} y={P(X0 + 115, Y0 + 105, 260)[1]} t={t} a={newAt - 0.5} text={`+${raise}%`} col={col} sub={`${name}'S RAISE`} />
    <Sign x={shx} y={shy - 50} t={t} a={priceAt} text={price} col={price === '0%' ? '#6B7280' : '#C0453A'} sub="PRICES" />
  </g>; };

const CAM = [[0, 0, 300, 1.45], [s('p2') - 0.25, 1040, 300, 1.45], [s('p3'), 520, 260, 1.0], [s('p4'), 1180, 240, 1.4], [s('p5'), 140, 240, 1.4], [s('p6') - 0.05, 1040, 270, 1.5], [s('p7'), 520, 260, 1.0]];
const cam = (t) => { let i = 0; while (i + 1 < CAM.length && CAM[i + 1][0] <= t) i++; const a = CAM[i], b = i ? CAM[i - 1] : a; const p = ramp(t, a[0], 0.9);
  return [lerp(b[1], a[1], p), lerp(b[2], a[2], p), lerp(b[3], a[3], p)]; };

export const Diorama = () => { const t = useT(); const [cx, cy, z] = cam(t); const sway = Math.sin(t * 0.5) * 6;
  return <AbsoluteFill style={{background: 'linear-gradient(180deg, #CFE6F2 0%, #EAF4F8 60%, #F6F1E6 100%)', overflow: 'hidden'}}>
    <Narr /><Sfx at={tw('p1', 'two')} name="coin" vol={0.3} /><Sfx at={tw('p2', 'five')} name="coin" vol={0.3} /><Sfx at={tw('p4', 'four')} name="whoosh" vol={0.3} /><Sfx at={tw('p6', 'one')} name="ding" vol={0.25} /><Sfx at={tw('p7', 'two')} name="ding" vol={0.25} />
    <svg width={1920} height={1080}>
      <g transform={`translate(960 540) scale(${z}) translate(${-cx + sway} ${-cy})`}>
        <Island X0={0} Y0={0} who="ann" t={t} raise={2} newAt={tw('p1', 'two')} price="0%" priceAt={tw('p5', 'move')} keepCol={tw('p7', 'two')} />
        <Island X0={600} Y0={-600} who="barb" t={t} raise={5} newAt={tw('p2', 'five')} price="+4%" priceAt={tw('p4', 'four') + 0.5} eatAt={tw('p4', 'four')} keepCol={tw('p6', 'one')} />
        <g opacity={ramp(t, s('p3'), 0.3) * (1 - ramp(t, s('p4'), 0.3))}><circle cx="520" cy="40" r="60" fill="#FFFFFF" stroke="#2B2F36" strokeWidth="5" />
          <text x="520" y="66" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="80" fill="#2B2F36">?</text></g>
      </g>
    </svg>
    <Caps />
  </AbsoluteFill>; };
