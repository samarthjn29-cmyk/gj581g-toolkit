// Storyboard test (5 Nov 2026): video 3, stop 1 "The swap", built from an open kit (Fluent Emoji, MIT, recoloured to
// Banknote with toolkit/media/recolour_svg.py) + our Folk II rig + our own devices. Rendered as stills via react-dom/server.
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Rig} from '../gj581g-toolkit/toolkit/remotion/kits/folk_banknote/coffee/rig4.jsx';

const W = 1920, H = 1080;
const P = {ground: '#EFE9DA', cream: '#F7F3E8', green: '#24493A', green2: '#3E6B52', sage: '#7E9C82', pale: '#A9BFA0',
  ox: '#7A2333', gold: '#B98B2E', ink: '#1F1B16', wood: '#6B4430', wood2: '#8A5A3B', wall: '#E6D8BC', mute: '#6E665A', night: '#1A3329'};
const FR = 'Fraunces', OS = 'Oswald', MONO = 'DejaVu Sans Mono, monospace';
const SAM = {skin: '#B98463', hair: 'short', hairColor: '#1E1A17', top: '#2F5A44', bottom: '#3A3632', apron: '#5A3A28'};
const MARINA = {skin: '#B9835E', hair: 'long', hairColor: '#2A1C14', top: '#C4623F', bottom: '#3E3A36', hat: 'sunhat', hatColor: '#D9B77A', build: 'f'};

const Prop = ({n, x, y, s = 120, r = 0, o = 1}) => <image href={`props/${n}.svg`} x={x - s / 2} y={y - s / 2} width={s} height={s} opacity={o}
  transform={r ? `rotate(${r} ${x} ${y})` : undefined} />;
// our own banknotes (the kit has no rupee or real)
const Note = ({x, y, sym, c = P.green, w = 150, r = 0}) => <g transform={`translate(${x} ${y}) rotate(${r})`}>
  <rect x={-w / 2} y={-w * 0.27} width={w} height={w * 0.54} rx={6} fill={c} stroke={P.cream} strokeWidth={4} />
  <rect x={-w / 2 + 10} y={-w * 0.27 + 10} width={w - 20} height={w * 0.54 - 20} rx={3} fill="none" stroke={P.cream} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="4 3" />
  <circle cx={w * 0.22} cy={0} r={w * 0.15} fill="none" stroke={P.cream} strokeOpacity={0.6} strokeWidth={3} />
  <text x={-w * 0.16} y={w * 0.11} textAnchor="middle" fontFamily={FR} fontWeight={700} fontSize={w * 0.32} fill={P.cream}>{sym}</text></g>;
// items are drawn inside the rig's mirrored group, so a turned character needs the note flipped back
const hold = (sym, c, flip = false) => (hx, hy, side) => <g transform={`translate(${hx} ${hy - 30}) scale(${flip ? -1 : 1} 1)`}><Note x={0} y={0} sym={sym} c={c} w={120} r={-8 * side} /></g>;

// devices from R16 / the Banknote kit
const Tag = ({n, t, it, words}) => <g transform="translate(48 44)">
  <rect width={360} height={58} rx={6} fill={P.cream} stroke={P.ink} strokeOpacity={0.15} />
  <text x={18} y={38} fontFamily={MONO} fontSize={18} fill={P.mute}>{n}</text>
  <text x={56} y={39} fontFamily={FR} fontWeight={700} fontSize={28} fill={P.ink}>{t} <tspan fontStyle="italic" fill={P.ox}>{it}</tspan></text>
  {words !== undefined && <g transform="translate(395 29)"><circle r={24} fill={P.green} /><text y={9} textAnchor="middle" fontFamily={FR} fontWeight={700} fontSize={24} fill={P.cream}>{words}</text>
    <text y={-30} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={P.mute}>WORDS</text></g>}</g>;
const Kind = ({k, src}) => <g transform={`translate(48 ${H - 40})`}>
  <rect y={-24} width={k.length * 13 + 24} height={32} fill={P.ink} /><text x={12} y={-2} fontFamily={MONO} fontWeight={700} fontSize={17} fill={P.cream}>{k}</text>
  <text x={k.length * 13 + 40} y={-2} fontFamily={MONO} fontSize={17} fill={P.ink} opacity={0.75}>{src}</text></g>;
const Card = ({x, y, w, head, body, sub, hc = P.green}) => <g transform={`translate(${x} ${y})`}>
  <rect width={w} height={sub ? 150 : 118} fill={P.cream} filter="url(#lift)" /><rect width={w} height={34} fill={hc} />
  <text x={16} y={24} fontFamily={MONO} fontWeight={700} fontSize={16} fill={P.cream}>{head}</text>
  <text x={16} y={80} fontFamily={FR} fontWeight={700} fontSize={34} fill={P.ink}>{body}</text>
  {sub && <text x={16} y={122} fontFamily={MONO} fontSize={16} fill={P.mute}>{sub}</text>}</g>;
const Grain = () => <rect width={W} height={H} filter="url(#grain)" opacity={0.10} style={{mixBlendMode: 'multiply'}} />;
const Defs = () => <defs>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" /><feColorMatrix type="saturate" values="0" /></filter>
  <filter id="lift" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.18" /></filter>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C9D6D4" /><stop offset="1" stopColor="#ECE4D2" /></linearGradient>
  <marker id="arr" markerUnits="userSpaceOnUse" markerWidth="30" markerHeight="30" viewBox="0 0 12 12" refX="6" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 Z" fill={P.ink} /></marker>
  <marker id="arrG" markerUnits="userSpaceOnUse" markerWidth="36" markerHeight="36" viewBox="0 0 12 12" refX="6" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 Z" fill={P.gold} /></marker>
</defs>;
const Frame = ({children}) => <svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}><Defs />
  <rect width={W} height={H} fill={P.ground} />{children}<Grain /></svg>;

// the two worlds, built from kit props + simple shapes
const Cafe = ({dim = 0}) => <g opacity={1 - dim}>
  <rect x={0} y={0} width={960} height={H} fill={P.wall} /><rect x={0} y={700} width={960} height={380} fill={P.green} />
  <rect x={110} y={170} width={330} height={300} fill="url(#sky)" stroke={P.wood} strokeWidth={14} />
  {[[120, 330, 60], [185, 280, 50], [240, 360, 70], [315, 300, 55], [375, 340, 65]].map(([x, y, w], i) => <g key={i}><rect x={x} y={y} width={w} height={470 - y} fill={i % 2 ? P.sage : P.pale} />{[0, 1, 2, 3].map((r) => <rect key={r} x={x + 12} y={y + 18 + r * 30} width={w - 24} height={10} fill={P.cream} opacity={0.7} />)}</g>)}<line x1={275} y1={170} x2={275} y2={470} stroke={P.wood} strokeWidth={8} />
  <rect x={600} y={150} width={300} height={170} rx={6} fill={P.night} stroke={P.wood} strokeWidth={10} />
  <text x={750} y={210} textAnchor="middle" fontFamily={FR} fontStyle="italic" fontWeight={700} fontSize={38} fill={P.cream}>Sam's Café</text>
  <text x={750} y={260} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={P.pale}>COFFEE · FROM BRAZIL</text>
  <rect x={60} y={720} width={840} height={60} fill={P.wood2} /><rect x={80} y={780} width={800} height={240} fill={P.wood} />
  <Prop n="hot_beverage" x={190} y={680} s={110} /><Prop n="potted_plant" x={820} y={640} s={170} /><Prop n="receipt" x={330} y={690} s={90} r={-6} />
  <g transform="translate(110 520)"><rect width={150} height={44} fill={P.ox} /><text x={75} y={32} textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize={26} letterSpacing={4} fill={P.cream}>PUNE</text></g>
</g>;
const Farm = ({dim = 0}) => <g opacity={1 - dim}>
  <rect x={960} y={0} width={960} height={H} fill="url(#sky)" />
  <path d="M960 560 C1200 470 1420 520 1600 480 C1760 450 1850 470 1920 460 L1920 1080 L960 1080 Z" fill={P.pale} />
  <path d="M960 680 C1180 620 1450 650 1920 600 L1920 1080 L960 1080 Z" fill={P.sage} />
  <Prop n="house" x={1700} y={500} s={130} /><Prop n="deciduous_tree" x={1080} y={540} s={150} /><Prop n="deciduous_tree" x={1840} y={560} s={120} />
  {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => <Prop key={`${r}${c}`} n="seedling" x={1010 + c * 135 + (r % 2) * 60} y={760 + r * 100} s={70 + r * 12} />))}
  <g transform="translate(1530 120)"><rect width={340} height={44} fill={P.green} /><text x={170} y={32} textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize={24} letterSpacing={3} fill={P.cream}>MINAS GERAIS, BRAZIL</text></g>
</g>;

const F1 = () => <Frame><Cafe /><Farm />
  <Rig x={470} y={1000} s={1.05} look={SAM} face="neutral" turn={1} pose={{fa: 55, fb: 40}} frontItem={hold('₹', P.green)} />
  <Rig x={1400} y={1000} s={1.05} look={MARINA} face="neutral" turn={-1} pose={{fa: 55, fb: 40}} frontItem={hold('R$', P.ox, true)} />
  <path d="M720 470 C 820 380 1100 380 1180 470" fill="none" stroke={P.ink} strokeWidth={6} strokeDasharray="14 12" markerEnd="url(#arr)" />
  <Prop n="snail" x={880} y={385} s={90} /><Prop n="cross_mark" x={1030} y={390} s={80} />
  <Card x={985} y={190} w={520} head="DIRECT SWAP" body="Rupees ⇄ Brazilian money" sub="few people want either: slow, costly" hc={P.ox} />
  <Tag n="01" t="The" it="swap" /><Kind k="ILLUSTRATIVE" src="PROPS: FLUENT EMOJI (MIT), RECOLOURED · CAST: FOLK II" /></Frame>;

const F2 = () => <Frame><Cafe dim={0.35} /><Farm dim={0.35} />
  <Rig x={480} y={1000} s={1.0} look={SAM} face="happy" turn={1} pose={{fa: 50, fb: 40}} frontItem={hold('₹', P.green)} />
  <Rig x={1440} y={1000} s={1.0} look={MARINA} face="happy" turn={-1} pose={{fa: 50, fb: 40}} frontItem={hold('R$', P.ox, true)} />
  <Prop n="classical_building" x={960} y={560} s={300} />
  <g transform="translate(960 340)"><Prop n="dollar_banknote" x={0} y={0} s={190} /></g>
  <path d="M640 500 C 680 400 760 350 850 345" fill="none" stroke={P.gold} strokeWidth={10} markerEnd="url(#arrG)" />
  <path d="M1070 345 C 1160 350 1240 400 1280 490" fill="none" stroke={P.gold} strokeWidth={10} markerEnd="url(#arrG)" />
  <Prop n="high_voltage" x={700} y={370} s={70} /><Prop n="high_voltage" x={1220} y={370} s={70} />
  <Card x={560} y={140} w={260} head="SWAP 1 · QUICK" body="₹ → $" hc={P.green} /><Card x={1100} y={140} w={260} head="SWAP 2 · QUICK" body="$ → R$" hc={P.green} />
  <Tag n="01" t="The" it="swap" /><Kind k="ILLUSTRATIVE" src="PROPS: FLUENT EMOJI (MIT), RECOLOURED" /></Frame>;

const spokes = [['yen_banknote', 'JAPAN', -150], ['euro_banknote', 'EURO AREA', -90], ['pound_banknote', 'UK', -30], ['RUPEE', 'INDIA', 30], ['REAL', 'BRAZIL', 90], ['coin', 'EVERYONE ELSE', 150]];
const F3 = () => <Frame>
  <circle cx={1180} cy={560} r={330} fill="none" stroke={P.green} strokeOpacity={0.25} strokeWidth={3} strokeDasharray="6 10" />
  {spokes.map(([n, lab, a], i) => { const x = 1180 + 360 * Math.cos(a * Math.PI / 180), y = 560 + 360 * Math.sin(a * Math.PI / 180);
    return <g key={i}><line x1={1180} y1={560} x2={x} y2={y} stroke={P.gold} strokeWidth={8} />
      <circle cx={x} cy={y} r={92} fill={P.cream} filter="url(#lift)" />
      {n === 'RUPEE' ? <Note x={x} y={y - 8} sym="₹" c={P.green} w={120} /> : n === 'REAL' ? <Note x={x} y={y - 8} sym="R$" c={P.ox} w={120} /> : <Prop n={n} x={x} y={y - 10} s={110} />}
      <text x={x} y={y + 62} textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize={20} letterSpacing={2} fill={P.ink}>{lab}</text></g>; })}
  <circle cx={1180} cy={560} r={150} fill={P.gold} filter="url(#lift)" /><Prop n="dollar_banknote" x={1180} y={545} s={200} />
  <text x={1180} y={665} textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize={24} letterSpacing={3} fill={P.ink}>THE GO-BETWEEN</text>
  <g transform="translate(70 360)"><rect width={600} height={250} fill={P.night} filter="url(#lift)" />
    <text x={28} y={50} fontFamily={MONO} fontSize={18} fill={P.gold}>WORD 01</text>
    <text x={28} y={110} fontFamily={FR} fontWeight={700} fontSize={50} fill={P.cream}>Go-between currency</text>
    <text x={28} y={160} fontFamily={FR} fontSize={24} fill={P.pale}>The money everyone swaps through,</text>
    <text x={28} y={194} fontFamily={FR} fontSize={24} fill={P.pale}>because everyone else swaps through it.</text></g>
  <Tag n="01" t="The" it="swap" words={1} /><Kind k="SCHEMATIC" src="PROPS: FLUENT EMOJI (MIT), RECOLOURED" /></Frame>;

const F4 = () => <Frame>
  {[...Array(10)].map((_, i) => { const x = 330 + (i % 5) * 230, y = 420 + Math.floor(i / 5) * 300, d = i < 9;
    return <g key={i}><rect x={x - 95} y={y - 120} width={190} height={250} rx={10} fill={d ? P.cream : P.wall} filter="url(#lift)" />
      <Prop n="handshake" x={x} y={y + 30} s={140} o={d ? 1 : 0.55} />
      {d ? <Prop n="dollar_banknote" x={x} y={y - 70} s={90} /> : <g><Prop n="euro_banknote" x={x - 36} y={y - 70} s={70} /><Prop n="yen_banknote" x={x + 36} y={y - 70} s={70} /></g>}</g>; })}
  <g transform="translate(1440 330)"><rect width={420} height={330} fill={P.cream} filter="url(#lift)" /><rect width={420} height={38} fill={P.gold} />
    <text x={18} y={27} fontFamily={MONO} fontWeight={700} fontSize={16} fill={P.ink}>SWAPS WITH THE DOLLAR ON ONE SIDE</text>
    <text x={30} y={150} fontFamily={FR} fontWeight={700} fontSize={84} fill={P.ink}>almost 9</text>
    <text x={30} y={240} fontFamily={FR} fontWeight={700} fontSize={84} fill={P.ink}>in 10</text>
    <text x={30} y={300} fontFamily={MONO} fontSize={16} fill={P.mute}>SOURCE: BIS TRIENNIAL SURVEY, 2025</text></g>
  <Tag n="01" t="The" it="swap" words={1} /><Kind k="SCHEMATIC" src="ONE CARD = ONE IN TEN SWAPS · PROPS: FLUENT EMOJI (MIT)" /></Frame>;

const F5 = () => <Frame>
  <path d="M0 860 C 400 820 700 900 1100 860 S 1700 820 1920 850 L1920 1080 L0 1080 Z" fill={P.green2} opacity={0.35} />
  <Prop n="mobile_phone" x={960} y={500} s={420} />
  <path d="M260 820 C 500 760 700 700 820 600" fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="12 10" markerEnd="url(#arr)" />
  <path d="M1650 260 C 1400 260 1220 330 1110 420" fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="12 10" markerEnd="url(#arr)" />
  <path d="M300 230 C 520 230 700 300 800 400" fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="12 10" markerEnd="url(#arr)" />
  <Prop n="ship" x={250} y={850} s={260} /><Prop n="airplane" x={1700} y={250} s={230} /><Prop n="package" x={260} y={230} s={170} />
  {[[330, 720], [1560, 380], [400, 340]].map(([x, y], i) => <g key={i}><rect x={x - 90} y={y - 26} width={180} height={52} rx={26} fill={P.gold} />
    <text x={x} y={y + 11} textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize={26} fill={P.ink}>PRICED IN $</text></g>)}
  <Card x={1260} y={640} w={560} head="MADE IN INDIA" body="Parts priced in dollars" sub="on their way in" hc={P.green} />
  <Tag n="01" t="The" it="swap" words={1} /><Kind k="ILLUSTRATIVE" src="PROPS: FLUENT EMOJI (MIT), RECOLOURED" /></Frame>;

export const frames = {F1, F2, F3, F4, F5};
export const render = (k) => renderToStaticMarkup(React.createElement(frames[k]));
