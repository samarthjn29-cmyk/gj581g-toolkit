// Set D drawn entirely by us (7 Nov 2026 comparison against Adobe Stock 628092371): a Greek coast at dawn,
// built in depth layers (sky, far hills, mid hills, headland with a small temple, near shore, ledge, reeds),
// each hill layer carrying its own rippling reflection, so the camera gets real parallax.
import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Layer, Glow, Figure, POSE, toScreen} from './vw.jsx';

const W = 3840, H = 2160, WL = 1250;            // world size, waterline
export const SUN_OWN = {x: 683, y: 790};
const C = {skyTop: '#2B4A63', sky2: '#B65A4E', sky3: '#EFAE45', hor: '#F8D48A', sun: '#FDF0CF',
  far: '#B9A08C', far2: '#8E8679', mid: '#4E6458', mid2: '#2F4A40', head: '#1E352D', near: '#12211B', ink: '#0A130F',
  mLit: '#E7D2AE', mMid: '#9DA9A6', mSh: '#4F6A7A', mDeep: '#2E4659', mBack: '#8FA6B0',
  rim: '#F8D48A', water1: '#F4CC86', water2: '#9DB3B0', water3: '#355670', ledgeHi: '#EBA266', ledge: '#C47039', ledgeLo: '#5A2E18'};

// a ridge line: sum of a few sines with seeded phases, closed down to yb
const ridge = (seed, x0, x1, base, amp, yb, n = 90) => {
  const r = (k) => random(`${seed}${k}`); const ph = [r(1), r(2), r(3), r(4)].map((v) => v * 6.28);
  const pts = Array.from({length: n + 1}, (_, i) => { const x = x0 + (x1 - x0) * i / n, u = x / 1000;
    const y = base - amp * (0.55 * Math.sin(u * 1.1 + ph[0]) + 0.28 * Math.sin(u * 2.7 + ph[1]) + 0.12 * Math.sin(u * 6.1 + ph[2]) + 0.05 * Math.sin(u * 13 + ph[3]));
    const v = i / n, win = Math.pow(Math.sin(Math.PI * v), 0.35); return [x, yb - (yb - y) * win]; });
  return {top: pts, d: `M${x0},${yb} ` + pts.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ` L${x1},${yb} Z`};
};
const line = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');

const Cypress = ({x, y, h, c = C.near, lit = C.mid2}) => { const w = h * 0.11;
  const d = `M${x},${y - h} C${x + w * 0.7},${y - h * 0.72} ${x + w * 1.05},${y - h * 0.3} ${x + w * 0.55},${y} L${x - w * 0.55},${y} C${x - w * 1.05},${y - h * 0.3} ${x - w * 0.7},${y - h * 0.72} ${x},${y - h} Z`;
  const l = `M${x},${y - h} C${x - w * 0.7},${y - h * 0.72} ${x - w * 1.05},${y - h * 0.3} ${x - w * 0.55},${y} L${x - w * 0.15},${y} C${x - w * 0.5},${y - h * 0.35} ${x - w * 0.35},${y - h * 0.75} ${x},${y - h} Z`;
  return <g><path d={d} fill={c} /><path d={l} fill={lit} opacity={0.55} /></g>; };
const Olive = ({x, y, s = 1, seed, c = C.near, lit = C.mid2}) => { const r = (k) => random(`ol${seed}${k}`);
  const ends = [[-120, -230], [10, -290], [130, -215]];
  const blobs = ends.flatMap(([ex, ey], j) => Array.from({length: 9}, (_, i) => { const a = r(j * 40 + i) * 6.28, d = r(j * 40 + i + 20) * 95;
    return [x + (ex + Math.cos(a) * d * 1.3) * s, y + (ey + Math.sin(a) * d * 0.6) * s, (26 + r(j * 40 + i + 9) * 22) * s]; }));
  const br = ends.map(([ex, ey], j) => `M${x + (j - 1) * 6 * s},${y - 120 * s} C${x + ex * 0.3 * s},${y - 170 * s} ${x + ex * 0.8 * s},${y + (ey + 40) * s} ${x + ex * s},${y + ey * s}`);
  return <g><path d={`M${x - 26 * s},${y} C${x - 8 * s},${y - 50 * s} ${x - 34 * s},${y - 90 * s} ${x - 10 * s},${y - 125 * s} L${x + 16 * s},${y - 122 * s} C${x + 6 * s},${y - 80 * s} ${x + 34 * s},${y - 40 * s} ${x + 30 * s},${y} Z`} fill={c} />
    {br.map((d, i) => <path key={i} d={d} stroke={c} strokeWidth={13 * s} fill="none" strokeLinecap="round" />)}
    {blobs.map(([bx, by, b], i) => <ellipse key={i} cx={bx} cy={by} rx={b * 1.5} ry={b * 0.85} fill={c} />)}
    {blobs.filter((_, i) => i % 2 === 0).map(([bx, by, b], i) => <ellipse key={`l${i}`} cx={bx - b * 0.4} cy={by - b * 0.3} rx={b * 0.8} ry={b * 0.35} fill={lit} opacity={0.55} />)}</g>; };
const Temple = ({x, y, s = 1, c}) => <g transform={`translate(${x},${y}) scale(${s})`} fill={c}>
  <rect x={-120} y={-10} width={240} height={10} /><rect x={-110} y={-18} width={220} height={8} />
  {Array.from({length: 7}, (_, i) => <rect key={i} x={-100 + i * 32} y={-96} width={11} height={78} />)}
  <rect x={-112} y={-108} width={224} height={12} /><path d="M-118,-108 L0,-142 L118,-108 Z" /></g>;

// rippling mirror image of a group about the waterline: horizontal strips nudged sideways
const Reflect = ({t, children, n = 18, depth = 700, amp = 6, a = 0.55, tint, id}) => <g opacity={a}>
  <defs>{Array.from({length: n}, (_, i) => { const y0 = WL + depth * Math.pow(i / n, 1.4), y1 = WL + depth * Math.pow((i + 1) / n, 1.4);
    return <clipPath key={i} id={`${id}${i}`}><rect x={-2000} y={y0} width={W + 4000} height={y1 - y0 + 1} /></clipPath>; })}</defs>
  {Array.from({length: n}, (_, i) => { const dx = Math.sin(t * 1.6 + i * 1.9) * amp * (0.3 + i / n);
    return <g key={i} clipPath={`url(#${id}${i})`}><g transform={`translate(${dx},${2 * WL}) scale(1,-1)`}>{children}</g></g>; })}
  {tint && <rect x={-2000} y={WL} width={W + 4000} height={depth} fill={tint} opacity={0.35} />}
</g>;

// the hero: a limestone massif, faceted, lit from the sun on the left
const M = {L: [[860, WL], [1080, 1090], [1240, 960], [1380, 850], [1520, 700], [1650, 600], [1760, 470], [1870, 400], [1950, 330]],
  R: [[1950, 330], [2040, 420], [2120, 470], [2230, 610], [2380, 700], [2560, 860], [2760, 990], [3000, 1110], [3300, WL]]};
const SPINE = [[1950, 330], [1990, 560], [2060, 780], [2120, 1000], [2200, WL]];
const Massif = () => { const P = (a) => a.map((q) => q.join(',')).join(' ');
  const facets = [[[1760, 470], [1800, 700], [1700, 900], [1520, 700]], [[1380, 850], [1460, 1010], [1300, 1150], [1240, 960]], [[2230, 610], [2300, 820], [2460, 900], [2380, 700]], [[2560, 860], [2600, 1040], [2800, 1120], [2760, 990]]];
  const gullies = [[[1870, 400], [1900, 620], [1850, 860]], [[1650, 600], [1690, 800], [1620, 980]], [[1520, 700], [1560, 900], [1480, 1100]], [[2120, 470], [2180, 700], [2260, 950]], [[2380, 700], [2440, 900]]];
  return <g>
    <defs><linearGradient id="mlit" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stopColor="#F6E2BC" /><stop offset="0.55" stopColor={C.mLit} /><stop offset="1" stopColor="#B9A48A" /></linearGradient>
      <linearGradient id="msh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5E7C8C" /><stop offset="1" stopColor={C.mDeep} /></linearGradient></defs>
    <polygon points={P([[2300, WL], [2500, 820], [2650, 700], [2780, 640], [2900, 700], [3100, 860], [3500, 1060], [3900, WL]])} fill={C.mBack} />
    <polygon points={P([[2650, 700], [2780, 640], [2800, 900], [2740, WL], [2500, WL]])} fill="#B9C6C2" opacity={0.6} />
    <polygon points={P([...M.L, ...M.R.slice(1)])} fill="url(#msh)" />
    <polygon points={P([...M.L, ...SPINE.slice(1)])} fill="url(#mlit)" />
    {facets.map((f, i) => <polygon key={i} points={P(f)} fill={i < 2 ? C.mMid : C.mDeep} opacity={0.75} />)}
    {gullies.map((g, i) => <polyline key={i} points={P(g)} fill="none" stroke={i < 3 ? '#B8A386' : C.mDeep} strokeWidth={10} strokeLinecap="round" opacity={0.55} />)}
    <polyline points={P(M.L)} fill="none" stroke={C.sun} strokeWidth={5} opacity={0.7} />
    <polygon points={P([[860, WL], [1100, 1150], [1500, 1120], [2000, 1170], [2600, 1150], [3300, WL]])} fill={C.mid} opacity={0.55} />
  </g>; };
const far = ridge('far', -1200, 5000, WL - 40, 170, WL);
const far2 = ridge('far2', -1200, 5000, WL - 10, 110, WL);
const mid = ridge('mid', 2600, 5200, WL, 200, WL);
const head = ridge('head', -1200, 1500, WL + 10, 150, WL + 10);

export const OwnLakeSet = ({t, cam, sun = 0, white = 0}) => { const ss = toScreen(cam, SUN_OWN.x, SUN_OWN.y, 0.9);
  const glitter = Array.from({length: 46}, (_, i) => { const r = (k) => random(`gl${i}${k}`); const y = WL + 20 + Math.pow(r(1), 1.3) * 820;
    const w = (30 + r(2) * 120) * (0.5 + (y - WL) / 900), x = SUN_OWN.x + (r(3) - 0.5) * (60 + (y - WL) * 0.5) + Math.sin(t * 1.4 + i) * 14;
    return <rect key={i} x={x - w / 2} y={y} width={w} height={3 + (y - WL) / 160} rx={2} fill={C.sun} opacity={(0.35 + 0.5 * Math.abs(Math.sin(t * 2.2 + i * 1.7))) * (1 - (y - WL) / 1100)} />; });
  const farHills = <><path d={far.d} fill={C.far} /><path d={far2.d} fill={C.far2} opacity={0.85} /><Massif /></>;
  const midHills = <><path d={mid.d} fill={C.mid} /><path d={line(mid.top.filter(([x]) => x < 3300))} fill="none" stroke={C.rim} strokeWidth={4} opacity={0.45} />
    {Array.from({length: 26}, (_, i) => { const r = (k) => random(`mc${i}${k}`); const x = 2800 + r(1) * 2200, top = mid.top.reduce((a, p) => (Math.abs(p[0] - x) < Math.abs(a[0] - x) ? p : a));
      return <Cypress key={i} x={x} y={top[1] + 30 + r(2) * 90} h={60 + r(3) * 50} c={C.mid2} lit={C.far2} />; })}</>;
  const headland = <><path d={head.d} fill={C.head} /><Temple x={430} y={head.top[Math.round(90 * (1630 / 2700))][1] + 8} s={0.9} c={C.head} />
    {[[-300, 160], [-170, 120], [40, 190], [820, 150], [1000, 110], [1180, 170]].map(([x, h], i) => <Cypress key={i} x={x} y={WL + 6} h={h} c={C.head} lit={C.mid} />)}</>;
  return <AbsoluteFill style={{background: C.hor, overflow: 'hidden'}}>
    {/* sky + water base */}
    <Layer cam={cam} p={0.9}><svg width={W} height={H} style={{overflow: 'visible'}}>
      <defs><linearGradient id="osky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.skyTop} /><stop offset="0.3" stopColor="#6E7E8C" /><stop offset="0.55" stopColor={C.sky2} /><stop offset="0.8" stopColor={C.sky3} /><stop offset="1" stopColor={C.hor} /></linearGradient>
        <linearGradient id="owat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EFAE45" /><stop offset="0.3" stopColor="#C88A5A" /><stop offset="0.6" stopColor="#4F6A7A" /><stop offset="1" stopColor="#1E3246" /></linearGradient></defs>
      <rect x={-2000} y={-1400} width={W + 4000} height={WL + 1400} fill="url(#osky)" />
      <rect x={-2000} y={WL} width={W + 4000} height={H} fill="url(#owat)" />
      {[[300, 520, 520, 26], [1500, 420, 700, 22], [2600, 600, 600, 30], [3400, 380, 480, 18]].map(([x, y, w, h], i) => <g key={i} opacity={0.5}>
        <ellipse cx={x + Math.sin(t * 0.05 + i) * 30} cy={y} rx={w / 2} ry={h} fill="#F5D0C4" /><ellipse cx={x + w * 0.15} cy={y + h * 0.6} rx={w * 0.35} ry={h * 0.5} fill="#E3968A" opacity={0.6} /></g>)}
      <circle cx={SUN_OWN.x} cy={SUN_OWN.y} r={120} fill={C.sun} />
      {glitter}
    </svg></Layer>
    {/* far hills with their reflection */}
    <Layer cam={cam} p={0.94}><svg width={W} height={H} style={{overflow: 'visible'}}>{farHills}<Reflect t={t} id="rf" a={0.32} amp={10} tint="#C88A5A">{farHills}</Reflect></svg></Layer>
    {/* mid hills */}
    <Layer cam={cam} p={0.97}><svg width={W} height={H} style={{overflow: 'visible'}}>{midHills}<Reflect t={t + 3} id="rm" a={0.4} amp={10}>{midHills}</Reflect></svg></Layer>
    {/* headland with the temple, near water, the ledge and the freed prisoner */}
    <Layer cam={cam} p={1}><svg width={W} height={H} style={{overflow: 'visible'}}>
      {headland}<Reflect t={t + 6} id="rh" a={0.6} depth={600}>{headland}</Reflect>
      {Array.from({length: 22}, (_, i) => { const r = (k) => random(`rp${i}${k}`); const y = WL + 40 + r(1) * 860, x = -300 + r(2) * 4200 + Math.sin(t * 0.6 + i) * 40;
        return <rect key={i} x={x} y={y} width={120 + r(3) * 380} height={2.5} rx={1.5} fill="#E4EDE7" opacity={0.18 + 0.12 * Math.sin(t * 1.3 + i)} />; })}
      {/* left near shore */}
      <path d="M-1200,2160 L-1200,1500 C-700,1470 -200,1560 150,1660 C420,1740 640,1880 780,2160 Z" fill={C.near} />
      <path d="M-1200,1500 C-700,1470 -200,1560 150,1660 C420,1740 640,1880 780,2160" fill="none" stroke={C.rim} strokeWidth={4} opacity={0.35} />
      <Cypress x={-60} y={1620} h={520} c={C.ink} lit={C.head} /><Cypress x={120} y={1680} h={400} c={C.ink} lit={C.head} />
      <Olive x={420} y={1830} s={1.3} seed="a" c={C.ink} lit={C.head} />
      {/* the sunlit ledge (same place as the stock version) */}
      <defs><linearGradient id="oledge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.ledgeHi} /><stop offset="0.25" stopColor={C.ledge} /><stop offset="1" stopColor={C.ledgeLo} /></linearGradient></defs>
      <path d="M2450,2160 C2520,2040 2580,1960 2700,1935 C2860,1905 3050,1915 3240,1895 C3450,1875 3650,1890 3840,1880 L3840,2160 Z" fill="url(#oledge)" />
      {[[2620, 2010], [2900, 2050], [3100, 2100], [3600, 2030]].map(([x, y], i) => <path key={i} d={`M${x - 70},${y} L${x - 20},${y - 26} L${x + 60},${y - 10} L${x + 90},${y + 18}`} fill="none" stroke={C.ledgeLo} strokeWidth={5} opacity={0.5} />)}
      <Cypress x={2600} y={1960} h={620} c={C.near} lit={C.head} /><Cypress x={2780} y={1932} h={480} c={C.near} lit={C.head} />
      <g style={{filter: 'blur(5px)'}} opacity={0.5}>{[[2600, 1960], [2780, 1932]].map(([x, y], i) => <path key={i} d={`M${x - 30},${y} C${x + 40},${y + 50} ${x + 180},${y + 130} ${x + 280},${2160} L${x + 400},2160 C${x + 300},${y + 120} ${x + 140},${y + 40} ${x + 40},${y - 4} Z`} fill="#2A140A" />)}</g>
      <Olive x={3560} y={1895} s={1.15} seed="b" c={C.near} lit={C.head} /><Cypress x={3760} y={1890} h={560} c={C.near} lit={C.head} />
      <g style={{filter: 'blur(5px)'}} opacity={0.55}>{[[3600, 0], [3780, 1]].map(([x, i]) => <path key={i} d={`M${x},1895 C${x + 60},1960 ${x + 200},2080 ${x + 300},2160 L${x + 460},2160 C${x + 330},2070 ${x + 170},1960 ${x + 80},1890 Z`} fill="#2A140A" />)}</g>
      <Figure x={3230} y={1915} s={0.85} pose={POSE.slump} rim="#F7D4A8" rimDx={4} fill="#1A120E" />
      <path d="M3215,1915 C3280,1960 3380,2060 3440,2160 L3530,2160 C3460,2060 3330,1950 3255,1912 Z" fill="#2A140A" opacity={0.6} style={{filter: 'blur(4px)'}} />
    </svg></Layer>
    {/* nearest: reeds drifting past at the bottom left */}
    <Layer cam={cam} p={1.15}><svg width={W} height={H} style={{overflow: 'visible'}}>
      <path d="M700,2300 L760,2080 C820,2010 900,1990 980,2020 L1080,1960 C1160,1930 1240,1950 1300,2000 L1420,2060 C1480,2100 1520,2200 1540,2300 Z" fill={C.ink} />
      <path d="M760,2080 C820,2010 900,1990 980,2020 L1080,1960 C1160,1930 1240,1950 1300,2000" fill="none" stroke={C.rim} strokeWidth={5} opacity={0.4} />
      <Cypress x={930} y={2030} h={620} c={C.ink} lit={C.head} /><Cypress x={1090} y={1990} h={460} c={C.ink} lit={C.head} />
      {Array.from({length: 20}, (_, i) => { const r = (k) => random(`gr${i}${k}`); const x = 1150 + r(1) * 330, h = 50 + r(2) * 90, sw = Math.sin(t * 1.2 + i) * 8;
        return <path key={i} d={`M${x},2000 Q${x + sw * 0.4 + 6},${2000 - h * 0.6} ${x + sw + 14 * (r(3) - 0.5)},${2000 - h}`} stroke={C.ink} strokeWidth={5} strokeLinecap="round" fill="none" />; })}
    </svg></Layer>
    <Glow x={ss.x} y={ss.y} r={(260 + sun * 900) * cam.z} color="#FFF3D6" a={0.55 + sun * 0.45} />
    <Glow x={ss.x} y={ss.y} r={(120 + sun * 260) * cam.z} color="#FFFFFF" a={0.6 + sun * 0.4} />
    <AbsoluteFill style={{background: '#FFF8EA', opacity: white}} />
  </AbsoluteFill>; };
