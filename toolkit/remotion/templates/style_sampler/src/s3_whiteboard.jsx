// S3 Whiteboard (hand-drawn, draw-on with a marker): everything is drawn and written live as the narration names it.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useT, s, tw, ramp, Narr, Sfx, Caps, drawOn} from './common';

const K = '#23252B', BL = '#2B5BD7', RD = '#D93A3A', GR = '#2E9E5B', HF = "'Kalam', cursive";
// items: [start, duration, render(p), tip(p) -> [x, y]]
const txt = (x, y, str, size, col, anchor = 'middle') => { const w = str.length * size * 0.56 + 24; const x0 = anchor === 'middle' ? x - w / 2 : x;
  return {r: (p, id) => <g><defs><clipPath id={id}><rect x={x0 - 10} y={y - size} width={(w + 20) * p} height={size * 1.4} /></clipPath></defs>
    <text x={x} y={y} textAnchor={anchor} fontFamily={HF} fontWeight="700" fontSize={size} fill={col} clipPath={`url(#${id})`}>{str}</text></g>,
    tip: (p) => [x0 + w * p, y - size * 0.25 + Math.sin(p * 40) * size * 0.12]}; };
const pathI = (d, col, w, pts) => ({r: (p) => <path d={d} {...drawOn(p)} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  tip: (p) => { const n = pts.length - 1, f = Math.min(n - 1e-6, p * n), i = Math.floor(f), q = f - i; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * q, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * q]; }});
const circ = (cx, cy, r, col, w = 6) => ({r: (p) => <circle cx={cx} cy={cy} r={r} transform={`rotate(-90 ${cx} ${cy})`} {...drawOn(p)} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" />,
  tip: (p) => [cx + r * Math.cos(-Math.PI / 2 + p * Math.PI * 2), cy + r * Math.sin(-Math.PI / 2 + p * Math.PI * 2)]});
const face = (cx, cy) => [circ(cx, cy, 86, K), pathI(`M ${cx - 34} ${cy + 22} Q ${cx} ${cy + 52} ${cx + 34} ${cy + 22}`, K, 6, [[cx - 34, cy + 22], [cx, cy + 40], [cx + 34, cy + 22]]),
  pathI(`M ${cx - 28} ${cy - 18} L ${cx - 28} ${cy - 4} M ${cx + 28} ${cy - 18} L ${cx + 28} ${cy - 4}`, K, 9, [[cx - 28, cy - 18], [cx - 28, cy - 4], [cx + 28, cy - 18], [cx + 28, cy - 4]])];
const tag = (cx, cy, col) => pathI(`M ${cx - 90} ${cy - 40} L ${cx + 60} ${cy - 40} L ${cx + 100} ${cy} L ${cx + 60} ${cy + 40} L ${cx - 90} ${cy + 40} Z M ${cx + 52} ${cy} m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0`, col, 6,
  [[cx - 90, cy - 40], [cx + 60, cy - 40], [cx + 100, cy], [cx + 60, cy + 40], [cx - 90, cy + 40], [cx - 90, cy - 40]]);

const build = () => { const I = []; const add = (a, d, it) => I.push({a, d, ...it});
  const f1 = face(480, 300); add(s('p1'), 0.45, f1[0]); add(s('p1') + 0.45, 0.15, f1[1]); add(s('p1') + 0.6, 0.12, f1[2]);
  add(s('p1') + 0.75, 0.3, txt(480, 450, 'Ann', 64, K)); add(tw('p1', 'two'), 0.45, txt(480, 560, '+2% raise', 70, BL));
  const f2 = face(1440, 300); add(s('p2'), 0.45, f2[0]); add(s('p2') + 0.45, 0.15, f2[1]); add(s('p2') + 0.6, 0.12, f2[2]);
  add(s('p2') + 0.75, 0.35, txt(1440, 450, 'Barbara', 64, K)); add(tw('p2', 'five') + 0.1, 0.45, txt(1440, 560, '+5% raise', 70, BL));
  add(s('p3'), 0.5, pathI('M 910 250 C 910 180 1010 180 1010 250 C 1010 300 960 300 960 350 L 960 380', RD, 12, [[910, 250], [930, 195], [990, 195], [1010, 250], [975, 300], [960, 350], [960, 380]]));
  add(s('p3') + 0.5, 0.1, pathI('M 960 425 L 960 430', RD, 16, [[960, 425], [960, 430]]));
  add(s('p4'), 0.5, tag(1440, 700, RD)); add(tw('p4', 'up'), 0.3, pathI('M 1440 730 L 1440 670 M 1416 692 L 1440 668 L 1464 692', RD, 7, [[1440, 730], [1440, 670], [1416, 692], [1440, 668], [1464, 692]]));
  add(tw('p4', 'four'), 0.35, txt(1620, 722, '+4%', 66, RD, 'start'));
  add(s('p5'), 0.5, tag(480, 700, K)); add(tw('p5', 'move'), 0.3, txt(660, 722, '0%', 66, K, 'start'));
  add(s('p6') + 0.1, 0.9, txt(1440, 880, '5 − 4 = 1%', 76, RD));
  add(s('p7'), 0.7, txt(480, 880, '2 − 0 = 2%', 76, GR)); add(tw('p7', 'two'), 0.55, {...circ(480, 856, 170, GR, 7), r: (p) => <ellipse cx="480" cy="856" rx="230" ry="72" transform="rotate(-3 480 856)" {...drawOn(p)} stroke={GR} strokeWidth="7" fill="none" />,
    tip: (p) => [480 + 230 * Math.cos(-Math.PI / 2 + p * Math.PI * 2), 856 + 72 * Math.sin(-Math.PI / 2 + p * Math.PI * 2)]});
  return I; };
const ITEMS = build();

const Marker = ({x, y, col}) => <g transform={`translate(${x} ${y}) rotate(28)`}>
  <path d="M -6 0 L 6 0 L 14 -40 L -14 -40 Z" fill="#E9E6DD" /><rect x="-22" y="-210" width="44" height="172" rx="8" fill={col} />
  <rect x="-22" y="-120" width="44" height="40" fill="#FFFFFF" opacity="0.35" /><rect x="-24" y="-250" width="48" height="50" rx="10" fill="#3A3D45" /></g>;

export const Whiteboard = () => { const t = useT();
  const act = ITEMS.filter((it) => t >= it.a - 0.05 && t <= it.a + it.d + 0.1).pop();
  const last = ITEMS.filter((it) => it.a <= t).pop();
  let tip = [1780, 980], col = K;
  if (act) { tip = act.tip(Math.min(1, Math.max(0, (t - act.a) / act.d))); }
  else if (last) { const nx = ITEMS.find((it) => it.a > t); const from = last.tip(1); const to = nx ? nx.tip(0) : [1780, 980];
    const g = nx ? ramp(t, last.a + last.d + 0.1, Math.max(0.1, nx.a - last.a - last.d - 0.15)) : ramp(t, last.a + last.d + 0.1, 0.6); tip = [from[0] + (to[0] - from[0]) * g, from[1] + (to[1] - from[1]) * g - Math.sin(g * Math.PI) * 60]; }
  const qFade = 1 - ramp(t, s('p6') - 0.2, 0.3);
  return <AbsoluteFill style={{background: '#FBFBF8'}}>
    <Narr /><Sfx at={s('p3')} name="paper" vol={0.25} />
    <svg width={1920} height={1080}>
      <rect x="30" y="30" width="1860" height="1020" rx="18" fill="none" stroke="#DADDE2" strokeWidth="14" />
      {ITEMS.map((it, i) => { const p = Math.max(0, Math.min(1, (t - it.a) / it.d)); if (p <= 0) return null;
        const isQ = i === 10 || i === 11; return <g key={i} opacity={isQ ? qFade : 1}>{it.r(p, `wb${i}`)}</g>; })}
      <Marker x={tip[0]} y={tip[1]} col={act && act.r ? (ITEMS.indexOf(act) >= 10 ? RD : K) : K} />
    </svg>
    <Caps bg="rgba(35,37,43,0.9)" />
  </AbsoluteFill>; };
