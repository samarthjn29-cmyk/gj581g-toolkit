// Teaching devices for The Dollar Yardstick (4 Nov 2026): show the idea so the narration can skip the numbers.
// Seesaw: one dollar vs the pile of rupees it takes to balance it (bigger pile = weaker rupee).
// TwoRulers: the same pay bar read on the rupee ruler and on the dollar ruler (the dollar ruler's marks stretch as the rupee weakens).
// CoinJar: a number becomes coins dropping in; part of them slide out again.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, OS, FR} from './bank';

const Coin = ({x, y, r = 18, c = C.gold, label}) => <g>
  <ellipse cx={x} cy={y + 3} rx={r} ry={r * 0.42} fill="#8C6A22" />
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.42} fill={c} />
  <ellipse cx={x} cy={y} rx={r * 0.7} ry={r * 0.28} fill="none" stroke="#E7C46A" strokeWidth={1.5} />
  {label ? <text x={x} y={y + 4} textAnchor="middle" fontFamily={OS} fontSize={r * 0.55} fill={C.ink}>{label}</text> : null}
</g>;

// tilt in degrees (+ = dollar side up), pile = number of rupee coins
export const Seesaw = ({x, y, w = 640, tilt = 0, pile = 10, dollarLabel = '$1', rupeeLabel = '₹', coinR = 16, coinC = C.gold}) => {
  const a = (tilt * Math.PI) / 180, hw = w / 2;
  const L = [x - hw * Math.cos(a), y + hw * Math.sin(a)], R = [x + hw * Math.cos(a), y - hw * Math.sin(a)];
  const coins = [];
  for (let i = 0; i < pile; i++) { const row = Math.floor(i / 5), col = i % 5; coins.push([R[0] - 76 + col * 30 + (row % 2) * 15, R[1] - 20 - row * 15]); }
  return <g>
    <polygon points={`${x - 60},${y + 150} ${x + 60},${y + 150} ${x},${y + 8}`} fill={C.green} />
    <rect x={x - 90} y={y + 150} width={180} height={14} fill="#1A3529" />
    <line x1={L[0]} y1={L[1]} x2={R[0]} y2={R[1]} stroke="#6B4A2E" strokeWidth={16} strokeLinecap="round" />
    <circle cx={x} cy={y} r={11} fill={C.gold} />
    <g transform={`translate(${L[0] - 70},${L[1] - 58}) rotate(${-tilt * 0.5})`}>
      <rect width={140} height={52} rx={4} fill="#DDE5D0" stroke={C.green} strokeWidth={4} />
      <rect x={8} y={8} width={124} height={36} fill="none" stroke={C.green} strokeWidth={1.5} />
      <text x={70} y={37} textAnchor="middle" fontFamily={FR} fontWeight={700} fontSize={28} fill={C.green}>{dollarLabel}</text>
    </g>
    {coins.map(([cx, cy], i) => <Coin key={i} x={cx} y={cy} r={coinR} c={coinC} label={rupeeLabel} />)}
  </g>;
};

// pay = bar length in rupee-ruler units (0..1 of rulerW); stretch = how much wider the dollar ruler's marks are
export const TwoRulers = ({x, y, rulerW = 900, pay = 0.6, grow = 0.09, stretch = 1.08, show = 1, labels = true}) => {
  const Ruler = ({yy, label, k, color}) => { const ticks = []; const step = 60 * k;
    for (let i = 0; i * step <= rulerW; i++) ticks.push(<line key={i} x1={x + i * step} y1={yy} x2={x + i * step} y2={yy + (i % 5 ? 18 : 34)} stroke={C.ink} strokeWidth={i % 5 ? 2 : 3} />);
    return <g>
      <rect x={x - 12} y={yy - 6} width={rulerW + 24} height={60} rx={4} fill={color} stroke={C.ink} strokeWidth={2} />
      {ticks}
      {labels ? <text x={x - 30} y={yy + 34} textAnchor="end" fontFamily={OS} fontSize={30} letterSpacing={2} fill={C.ink}>{label}</text> : null}
    </g>; };
  const base = rulerW * pay, raised = base * (1 + grow);
  return <g opacity={show}>
    <Ruler yy={y} label="RUPEE RULER" k={1} color="#EFE2BF" />
    <rect x={x} y={y - 46} width={base} height={28} fill={C.green} />
    <rect x={x + base} y={y - 46} width={raised - base} height={28} fill={C.gold} />
    <Ruler yy={y + 170} label="DOLLAR RULER" k={stretch} color="#DDE5D0" />
    <rect x={x} y={y + 124} width={base} height={28} fill={C.green} />
    <rect x={x + base} y={y + 124} width={Math.max(2, raised / stretch - base)} height={28} fill={C.gold} />
  </g>;
};

// coins = coins inside; out = coins sliding out (drawn beside the jar)
export const CoinJar = ({x, y, coins = 9, out = 0, label = 'JET SKI'}) => {
  const inside = [];
  for (let i = 0; i < coins - out; i++) inside.push(<Coin key={i} x={x - 52 + (i % 4) * 35 + (Math.floor(i / 4) % 2) * 17} y={y + 150 - Math.floor(i / 4) * 17} r={17} />);
  const gone = [];
  for (let i = 0; i < out; i++) gone.push(<Coin key={'o' + i} x={x + 150 + i * 30} y={y + 182 - (i % 2) * 6} r={17} c="#D9C08A" />);
  return <g>
    <path d={`M ${x - 95} ${y - 40} L ${x - 95} ${y + 175} Q ${x - 95} ${y + 195} ${x - 75} ${y + 195} L ${x + 75} ${y + 195} Q ${x + 95} ${y + 195} ${x + 95} ${y + 175} L ${x + 95} ${y - 40} Z`} fill="#E9EEE6" fillOpacity={0.55} stroke={C.green} strokeWidth={4} />
    <rect x={x - 70} y={y - 62} width={140} height={24} rx={4} fill={C.green} />
    {inside}
    <rect x={x - 70} y={y + 40} width={140} height={40} fill={C.paper} stroke={C.ox} strokeWidth={2} />
    <text x={x} y={y + 68} textAnchor="middle" fontFamily={OS} fontSize={24} letterSpacing={2} fill={C.ox}>{label}</text>
    {gone}
  </g>;
};

const Panel = ({x, title, sub, children}) => <g>
  <rect x={x} y={150} width={600} height={800} fill={C.paper} stroke={C.line} strokeWidth={2} />
  <text x={x + 300} y={215} textAnchor="middle" fontFamily={OS} fontSize={34} letterSpacing={3} fill={C.green}>{title}</text>
  <text x={x + 300} y={252} textAnchor="middle" fontFamily={FR} fontSize={22} fill={C.ox}>{sub}</text>
  {children}
</g>;

export const DevicesSheet = () => <AbsoluteFill style={{background: C.ground}}>
  <svg width={1920} height={1080}>
    <text x={60} y={90} fontFamily={FR} fontWeight={700} fontSize={46} fill={C.green}>Three ways to show it instead of saying it</text>
    <text x={60} y={130} fontFamily={OS} fontSize={22} letterSpacing={2} fill={C.mute}>THE DOLLAR YARDSTICK · NO. 2 · DEVICE TESTS (STILLS)</text>
    <Panel x={40} title="THE SEESAW" sub="it takes a bigger pile to balance the same dollar">
      <text x={80} y={330} fontFamily={OS} fontSize={22} letterSpacing={2} fill={C.mute}>LAST YEAR: BALANCED</text>
      <Seesaw x={340} y={440} w={400} tilt={0} pile={10} />
      <text x={80} y={655} fontFamily={OS} fontSize={22} letterSpacing={2} fill={C.mute}>THIS YEAR: EACH RUPEE COUNTS FOR LESS</text>
      <Seesaw x={340} y={765} w={400} tilt={0} pile={15} coinR={14} coinC="#CFAE62" />
    </Panel>
    <Panel x={660} title="TWO RULERS" sub="same pay, read twice">
      <TwoRulers x={700} y={420} rulerW={520} pay={0.6} grow={0.09} stretch={1.08} labels={false} />
      <text x={700} y={360} fontFamily={OS} fontSize={24} letterSpacing={2} fill={C.ink}>ON THE RUPEE RULER</text>
      <text x={700} y={530} fontFamily={OS} fontSize={24} letterSpacing={2} fill={C.ink}>ON THE DOLLAR RULER</text>
      <rect x={700} y={700} width={26} height={22} fill={C.green} /><text x={740} y={719} fontFamily={FR} fontSize={24} fill={C.ink}>last year's pay</text>
      <rect x={700} y={740} width={26} height={22} fill={C.gold} /><text x={740} y={759} fontFamily={FR} fontSize={24} fill={C.ink}>this year's pay raise</text>
    </Panel>
    <Panel x={1280} title="THE COIN JAR" sub="a raise drops in; the dollar takes some back">
      <CoinJar x={1520} y={420} coins={9} out={0} />
      <CoinJar x={1520} y={700} coins={9} out={6} />
    </Panel>
  </svg>
</AbsoluteFill>;
