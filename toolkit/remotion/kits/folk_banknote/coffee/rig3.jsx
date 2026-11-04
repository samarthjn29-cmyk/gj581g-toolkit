// "Folk" full-body rig (3 Nov 2026 prototype): extends the Folk bust kit with articulated arms and legs, a walk cycle,
// blinks, head tilt, a turn, and Rhubarb mouth shapes (A-H, X) for lip sync. SVG only: place inside an <svg>.
// Origin = between the feet on the ground; the figure is about 600 units tall before `s`.
import React from 'react';

export const shade = (hex, k = 0.82) => { const n = parseInt(hex.slice(1), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k)); return `rgb(${c.join(',')})`; };
export const tint = (hex, k = 0.25) => { const n = parseInt(hex.slice(1), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * k)); return `rgb(${c.join(',')})`; };

const FACE = {
  neutral: {brow: [[-30, -22, -14, -24], [14, -24, 30, -22]], eye: 'dot', mouth: 'M -11 32 Q 0 36 11 32'},
  happy: {brow: [[-30, -25, -14, -28], [14, -28, 30, -25]], eye: 'smile', mouth: 'M -16 27 Q 0 46 16 27 Z'},
  smile: {brow: [[-30, -24, -14, -26], [14, -26, 30, -24]], eye: 'dot', mouth: 'M -14 29 Q 0 41 14 29'},
  sad: {brow: [[-30, -20, -14, -27], [14, -27, 30, -20]], eye: 'dot', mouth: 'M -12 37 Q 0 29 12 37'},
  worried: {brow: [[-30, -21, -14, -30], [14, -30, 30, -21]], eye: 'wide', mouth: 'M -12 37 Q 0 31 12 37'},
  thinking: {brow: [[-30, -27, -14, -27], [14, -22, 30, -26]], eye: 'side', mouth: 'M -6 33 L 12 31'},
  surprised: {brow: [[-30, -31, -14, -35], [14, -35, 30, -31]], eye: 'wide', mouth: 'O'},
  smug: {brow: [[-30, -23, -14, -25], [14, -27, 30, -24]], eye: 'lid', mouth: 'M -12 31 Q 4 38 16 27'},
  // Heckler moods (3 Nov 2026)
  impatient: {brow: [[-31, -25, -13, -19], [13, -19, 31, -25]], eye: 'lid', mouth: 'M -12 34 L 12 32'},
  pushy: {brow: [[-32, -29, -12, -17], [12, -17, 32, -29]], eye: 'dot', mouth: 'M -15 26 Q 0 50 15 26 Z'},
  deflated: {brow: [[-30, -19, -14, -26], [14, -26, 30, -19]], eye: 'lid', mouth: 'M -12 37 Q 0 31 12 37'},
  exasperated: {brow: [[-30, -35, -14, -39], [14, -39, 30, -35]], eye: 'roll', mouth: 'M -16 26 Q 0 52 16 26 Z'},
  groan: {brow: [[-30, -18, -14, -25], [14, -25, 30, -18]], eye: 'shut', mouth: 'M -13 35 Q 0 30 13 35'},
  envious: {brow: [[-30, -22, -14, -22], [14, -33, 30, -27]], eye: 'side', mouth: 'M -12 35 Q 2 30 14 37'},
  warm: {brow: [[-30, -25, -14, -28], [14, -28, 30, -25]], eye: 'smile', mouth: 'M -14 30 Q 0 40 14 30'},
};

const Hair = ({style, color, part}) => { const d = shade(color, 0.8);
  if (style === 'bob') return part === 'back'
    ? <path d="M -74 -10 C -80 -70 -40 -92 0 -92 C 40 -92 80 -70 74 -10 L 76 52 C 60 64 40 62 30 54 L -30 54 C -40 62 -60 64 -76 52 Z" fill={d} />
    : <path d="M -66 -8 C -70 -64 -34 -86 6 -84 C 44 -82 70 -60 66 -10 C 50 -30 30 -44 -4 -46 C -26 -40 -48 -26 -66 -8 Z" fill={color} />;
  if (style === 'bun') return part === 'back'
    ? <g><circle cx="0" cy="-92" r="30" fill={d} /><path d="M -64 -6 C -68 -62 -32 -84 0 -84 C 32 -84 68 -62 64 -6 Z" fill={d} /></g>
    : <path d="M -64 -10 C -66 -60 -30 -82 0 -82 C 30 -82 66 -60 64 -10 C 52 -36 30 -50 0 -50 C -26 -50 -50 -36 -64 -10 Z" fill={color} />;
  if (style === 'curly') return part === 'back'
    ? <g fill={d}>{[[-60, -40, 30], [-40, -72, 30], [0, -86, 32], [40, -72, 30], [60, -40, 30], [-66, 0, 24], [66, 0, 24]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>
    : <g fill={color}>{[[-44, -56, 22], [-16, -70, 24], [16, -70, 24], [44, -56, 22], [-58, -30, 16], [58, -30, 16]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>;
  if (style === 'short') return part === 'back'
    ? <path d="M -66 -14 C -70 -64 -34 -88 2 -88 C 40 -88 70 -64 66 -14 L 62 10 L -62 10 Z" fill={d} />
    : <path d="M -66 -12 C -70 -70 -30 -94 6 -90 C 44 -88 72 -64 66 -14 C 58 -40 36 -56 6 -58 C -24 -56 -48 -42 -66 -12 Z" fill={color} />;
  if (style === 'bald') return part === 'back'
    ? <g fill={d}><path d="M -66 -4 C -70 -30 -62 -44 -52 -50 L -50 10 Z" /><path d="M 66 -4 C 70 -30 62 -44 52 -50 L 50 10 Z" /></g> : null;
  if (style === 'long') return part === 'back'
    ? <path d="M -72 -16 C -78 -74 -38 -94 2 -94 C 42 -94 78 -74 72 -16 L 80 110 C 60 122 40 118 30 100 L -30 100 C -40 118 -60 122 -80 110 Z" fill={d} />
    : <path d="M -66 -8 C -70 -66 -32 -88 4 -86 C 44 -84 70 -62 66 -10 C 46 -40 18 -54 -10 -52 C -36 -44 -54 -28 -66 -8 Z" fill={color} />;
  if (style === 'afro') return part === 'back'
    ? <ellipse cx="0" cy="-36" rx="98" ry="92" fill={d} />
    : <path d="M -70 -14 C -76 -90 76 -90 70 -14 C 54 -44 -54 -44 -70 -14 Z" fill={color} />;
  if (style === 'swept') return part === 'back'
    ? <path d="M -64 -16 C -66 -66 -30 -90 6 -90 C 42 -90 68 -66 64 -16 Z" fill={d} />
    : <path d="M -66 -14 C -60 -80 10 -106 60 -70 C 72 -54 70 -34 66 -16 C 50 -52 10 -70 -30 -54 C -46 -44 -58 -30 -66 -14 Z" fill={color} />;
  return null; };

// headwear, drawn over the hair (head space, head centre at 0,0)
const Hat = ({kind, color = '#1C1A18'}) => { const d = shade(color, 0.75);
  if (kind === 'top') return <g><rect x="-50" y="-210" width="100" height="140" rx="6" fill={color} /><rect x="-50" y="-100" width="100" height="18" fill="#7A2333" /><ellipse cx="0" cy="-70" rx="86" ry="14" fill={d} /></g>;
  if (kind === 'bowler') return <g><path d="M -58 -60 C -58 -130 58 -130 58 -60 Z" fill={color} /><ellipse cx="0" cy="-58" rx="80" ry="12" fill={d} /></g>;
  if (kind === 'wig') return <g fill="#ECE7DA" stroke="#C9C1AE" strokeWidth="2.5">{[-48, -24, 0, 24, 48].map((x) => <ellipse key={x} cx={x} cy={-64} rx="16" ry="14" />)}{[-62, 62].map((x) => <g key={x}>{[-40, -18, 4].map((y) => <ellipse key={y} cx={x} cy={y} rx="13" ry="11" />)}</g>)}</g>;
  if (kind === 'judgewig') return <g fill="#EEE9DC" stroke="#C9C1AE" strokeWidth="2.5">{[-50, -25, 0, 25, 50].map((x) => <ellipse key={x} cx={x} cy={-66} rx="17" ry="15" />)}
    {[-1, 1].map((k) => <g key={k}>{[-40, -10, 22, 54, 86, 118].map((y, i) => <ellipse key={y} cx={k * (70 + (i % 2) * 8)} cy={y} rx="20" ry="17" />)}</g>)}</g>;
  if (kind === 'sunhat') return <g><ellipse cx="0" cy="-58" rx="118" ry="22" fill={color} /><path d="M -56 -60 C -54 -118 54 -118 56 -60 Z" fill={color} /><rect x="-56" y="-74" width="112" height="12" fill={shade(color, 0.7)} /></g>;
  if (kind === 'veil') return <g><ellipse cx="0" cy="-70" rx="74" ry="14" fill={color} /><path d="M -40 -72 C -40 -112 40 -112 40 -72 Z" fill={color} /><path d="M -70 -64 L 70 -64 L 60 -4 L -60 -4 Z" fill={color} opacity="0.35" /></g>;
  return null; };

const Beard = ({kind, color}) => {
  if (kind === 'moustache') return <path d="M -24 22 C -12 14 -4 18 0 22 C 4 18 12 14 24 22 C 16 30 6 28 0 25 C -6 28 -16 30 -24 22 Z" fill={color} />;
  if (kind === 'beard') return <path d="M -58 6 C -56 60 -30 86 0 88 C 30 86 56 60 58 6 C 50 40 30 50 14 46 C 8 44 -8 44 -14 46 C -30 50 -50 40 -58 6 Z" fill={color} />;
  return null; };

const Eyes = ({type, ink, blink, look}) => { const E = (x) => {
    if (blink > 0.5) return <path key={x} d={`M ${x - 8} -5 L ${x + 8} -5`} stroke={ink} strokeWidth="4" strokeLinecap="round" />;
    if (type === 'roll') return <g key={x}><ellipse cx={x} cy={-6} rx={8.5} ry={9.5} fill="#FFFFFF" /><circle cx={x} cy={-11.5} r={4.6} fill={ink} /></g>;
    if (type === 'shut') return <path key={x} d={`M ${x - 9} -6 Q ${x} 0 ${x + 9} -6`} stroke={ink} strokeWidth="4.5" fill="none" strokeLinecap="round" />;
    if (type === 'smile') return <path key={x} d={`M ${x - 8} -6 Q ${x} -14 ${x + 8} -6`} stroke={ink} strokeWidth="4.5" fill="none" strokeLinecap="round" />;
    if (type === 'wide') return <g key={x}><ellipse cx={x} cy={-6} rx={8.5} ry={9.5} fill="#FFFFFF" /><circle cx={x + look} cy={-5} r={4.8} fill={ink} /></g>;
    if (type === 'side') return <g key={x}><ellipse cx={x} cy={-6} rx={7} ry={7.5} fill="#FFFFFF" /><circle cx={x + 3} cy={-8} r={4} fill={ink} /></g>;
    if (type === 'lid') return <g key={x}><ellipse cx={x + look * 0.5} cy={-5} rx={5} ry={5.5} fill={ink} /><path d={`M ${x - 9} -9 L ${x + 9} -9`} stroke={ink} strokeWidth="4" strokeLinecap="round" /></g>;
    return <ellipse key={x} cx={x + look * 0.6} cy={-6} rx={5} ry={6} fill={ink} />; };
  return <g>{E(-22)}{E(22)}</g>; };

// Rhubarb mouth shapes, drawn around (0, 33) in head space
const Mouth = ({v, face, skin}) => { const dark = shade(skin, 0.4), lip = shade(skin, 0.45);
  const O = (rx, ry, teeth, tongue) => <g><ellipse cx="0" cy="34" rx={rx} ry={ry} fill={dark} />
    {teeth && <path d={`M ${-rx * 0.8} ${34 - ry * 0.55} Q 0 ${34 - ry * 0.9} ${rx * 0.8} ${34 - ry * 0.55}`} stroke="#FFFFFF" strokeWidth={Math.min(5, ry * 0.6)} fill="none" strokeLinecap="round" />}
    {tongue && <ellipse cx="0" cy={34 + ry * 0.45} rx={rx * 0.55} ry={ry * 0.35} fill="#D9706A" />}</g>;
  switch (v) {
    case 'A': return <path d="M -11 33 L 11 33" stroke={lip} strokeWidth="5" strokeLinecap="round" />;
    case 'B': return O(12, 5, true);
    case 'C': return O(13, 9, true, true);
    case 'D': return O(15, 14, true, true);
    case 'E': return O(10, 10, false, true);
    case 'F': return O(6, 7);
    case 'G': return <g>{O(12, 5)}<path d="M -9 31 L 9 31" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" /></g>;
    case 'H': return O(13, 10, true, true);
    default: break; }
  const f = FACE[face] || FACE.neutral;
  if (f.mouth === 'O') return <ellipse cx="0" cy="34" rx="8" ry="10" fill={dark} />;
  if (f.mouth.endsWith('Z')) return <g><path d={f.mouth} fill={dark} /><path d="M -10 30 Q 0 34 10 30" stroke="#FFFFFF" strokeWidth="4" fill="none" /></g>;
  return <path d={f.mouth} stroke={lip} strokeWidth="5" fill="none" strokeLinecap="round" />; };

const rad = (d) => (d * Math.PI) / 180;
const seg = (x, y, len, deg) => [x + len * Math.sin(rad(deg)), y + len * Math.cos(rad(deg))];

// arm: side +1 = the side the character faces, -1 = the other; a = outward swing from hanging down, b = elbow bend (further outward/up)
const Arm = ({side, a, b, color, skin, item}) => { const sx = side * 56, sy = -402;
  const [ex, ey] = seg(0, 0, 100, a), [hx, hy] = seg(ex, ey, 92, a + b);
  const X = (v) => sx + side * v;
  return <g>
    <path d={`M ${sx} ${sy} L ${X(ex)} ${sy + ey} L ${X(hx)} ${sy + hy}`} stroke={color} strokeWidth="36" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={X(hx)} cy={sy + hy} r="17" fill={skin} />
    {item && item(X(hx), sy + hy, side)}
  </g>; };

// leg: a = forward swing (+ towards facing), b = knee bend (shin swings back)
const Leg = ({side, a, b, color, shoe}) => { const hx = side * 26, hy = -250;
  const [kx, ky] = seg(hx, hy, 122, a), [ax, ay] = seg(kx, ky, 120, a - b);
  return <g>
    <path d={`M ${hx} ${hy} L ${kx} ${ky} L ${ax} ${ay}`} stroke={color} strokeWidth="44" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M ${ax - 22} ${ay + 6} C ${ax - 24} ${ay - 22} ${ax + 24} ${ay - 22} ${ax + 40} ${ay + 2} C ${ax + 46} ${ay + 14} ${ax + 30} ${ay + 18} ${ax + 10} ${ay + 18} L ${ax - 22} ${ay + 18} Z`} fill={shoe} />
  </g>; };

// pose: {fa, fb, ba, bb} arm angles (front/back arm), tilt (deg), lean (deg)
// walk: phase in radians or null; turn: -1..1 (scaleX, 1 = facing right, -1 = facing left)
export const Rig = ({x, y, s = 1, look, face = 'neutral', mouth = 'X', blink = 0, pose = {}, walk = null, turn = 1, bob = 0, eyeLook = 0, frontItem, backItem}) => {
  const {skin, hair, hairColor, top, bottom, shoe = '#2A2522', ink = '#1F1B16', glasses, earrings, robe, collar, hat, hatColor, beard, tie, apron} = look;
  const armTop = robe || top; const td = shade(armTop, 0.78), tl = tint(top, 0.12), bd = shade(bottom, 0.8), sk = shade(skin, 0.86);
  let {fa = 8, fb = 10, ba = 8, bb = 10, tilt = 0, lean = 0} = pose;
  let la = 0, lb = 0, ra = 0, rb = 0, lift = 0;
  if (walk !== null) { const p = walk;
    la = 24 * Math.sin(p); ra = -24 * Math.sin(p);
    lb = 34 * Math.max(0, Math.sin(p - Math.PI / 2)) + 6; rb = 34 * Math.max(0, Math.sin(p + Math.PI / 2)) + 6;
    lift = 10 * Math.abs(Math.cos(p));
    fa = 12 - 14 * Math.sin(p); ba = 12 - 14 * Math.sin(p); fb = 14; bb = 14; }
  // legs stay planted: drop the body by the vertical shortening of the longer leg
  const legH = (a, b) => 122 * Math.cos(rad(a)) + 120 * Math.cos(rad(a - b));
  const drop = 242 - Math.max(legH(la, lb), legH(ra, rb));
  const sx = Math.max(Math.abs(turn), 0.06) * Math.sign(turn || 1);
  return <g transform={`translate(${x} ${y}) scale(${s * sx} ${s})`}>
    <g transform={`translate(0 ${drop - lift * 0})`}>
      <ellipse cx="0" cy={-drop + 14} rx="96" ry="14" fill="#000" opacity="0.10" />
      <Leg side={-1} a={ra} b={rb} color={bd} shoe={shoe} />
      <g transform={`rotate(${lean} 0 -250) translate(0 ${-bob})`}>
        <Arm side={-1} a={ba} b={bb} color={shade(armTop, 0.66)} skin={sk} item={backItem} />
        <Leg side={1} a={la} b={lb} color={bottom} shoe={shoe} />
        {/* hips + torso */}
        <path d="M -62 -262 L 62 -262 L 66 -226 C 40 -214 -40 -214 -66 -226 Z" fill={bottom} />
        <path d="M -72 -420 C -86 -400 -70 -300 -64 -258 L 64 -258 C 70 -300 86 -400 72 -420 C 50 -436 -50 -436 -72 -420 Z" fill={top} />
        <path d="M 40 -432 C 70 -426 84 -402 76 -360 C 72 -320 66 -286 64 -258 L 34 -258 C 46 -320 50 -380 40 -432 Z" fill={td} />
        <path d="M -24 -436 L 0 -398 L 24 -436 Z" fill={tl} />
        <path d="M -20 -462 L 20 -462 L 22 -432 C 10 -424 -10 -424 -22 -432 Z" fill={sk} />
        {apron && <path d="M -46 -400 L 46 -400 L 58 -150 L -58 -150 Z" fill={apron} />}
        {apron && <path d="M -46 -400 L -20 -440 M 46 -400 L 20 -440" stroke={apron} strokeWidth="8" />}
        {tie && <path d="M -9 -430 L 9 -430 L 13 -330 L 0 -312 L -13 -330 Z" fill={tie} />}
        {robe && <g><path d="M -80 -424 C -96 -380 -96 -200 -104 -70 L 104 -70 C 96 -200 96 -380 80 -424 C 60 -436 34 -438 24 -436 L 30 -300 L -30 -300 L -24 -436 C -34 -438 -60 -436 -80 -424 Z" fill={robe} />
          <path d="M 44 -430 C 80 -420 92 -380 94 -300 C 96 -200 98 -120 104 -70 L 66 -70 C 64 -200 60 -330 44 -430 Z" fill={shade(robe, 0.78)} /></g>}
        {collar === 'bands' && <g fill="#FFFFFF"><path d="M -14 -432 L -2 -432 L -4 -386 L -16 -388 Z" /><path d="M 2 -432 L 14 -432 L 16 -388 L 4 -386 Z" /></g>}
        {collar === 'jabot' && <g fill="#FFFFFF" stroke="#DDD6C6" strokeWidth="2">{[0, 1, 2].map((i) => <path key={i} d={`M -22 ${-432 + i * 16} Q 0 ${-414 + i * 16} 22 ${-432 + i * 16} L 18 ${-418 + i * 16} Q 0 ${-404 + i * 16} -18 ${-418 + i * 16} Z`} />)}</g>}
        <Arm side={1} a={fa} b={fb} color={td} skin={skin} item={frontItem} />
        {/* head */}
        <g transform={`translate(0 -528) rotate(${tilt})`}>
          <Hair style={hair} color={hairColor} part="back" />
          <ellipse cx="-62" cy="6" rx="12" ry="16" fill={skin} /><ellipse cx="62" cy="6" rx="12" ry="16" fill={skin} />
          {earrings && <g fill="none" stroke={earrings} strokeWidth="4"><circle cx="-63" cy="30" r="9" /><circle cx="63" cy="30" r="9" /></g>}
          <ellipse cx="0" cy="0" rx="62" ry="72" fill={skin} />
          <path d="M 30 -60 C 70 -36 72 34 26 68 C 56 64 64 -30 30 -60 Z" fill={sk} opacity="0.35" />
          <Hair style={hair} color={hairColor} part="front" />
          {(FACE[face] || FACE.neutral).brow.map(([a, b, c, d], i) => <path key={i} d={`M ${a} ${b} L ${c} ${d}`} stroke={shade(hairColor, 0.9)} strokeWidth="6" strokeLinecap="round" />)}
          <Eyes type={(FACE[face] || FACE.neutral).eye} ink={ink} blink={blink} look={eyeLook} />
          {glasses && <g fill="none" stroke={ink} strokeWidth="3.5"><circle cx="-22" cy="-6" r="15" /><circle cx="22" cy="-6" r="15" /><path d="M -7 -8 Q 0 -12 7 -8" /></g>}
          <path d="M 4 4 Q 12 16 2 18" stroke={sk} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="-34" cy="18" r="10" fill="#E8836B" opacity="0.22" /><circle cx="34" cy="18" r="10" fill="#E8836B" opacity="0.22" />
          {beard && <Beard kind={beard} color={hairColor} />}
          <Mouth v={mouth} face={face} skin={skin} />
          {hat && <Hat kind={hat} color={hatColor} />}
        </g>
      </g>
    </g>
  </g>; };

// a payslip held in the hand: drawn upright, un-mirrored text
export const slip = (text, color, turnSign) => (hx, hy) => <g transform={`translate(${hx} ${hy - 50}) scale(${turnSign} 1)`}>
  <rect x="-58" y="-44" width="116" height="84" rx="6" fill="#FFFFFF" stroke="#D8CFBA" strokeWidth="2" />
  <rect x="-58" y="-44" width="116" height="18" rx="6" fill={color} /><rect x="-58" y="-34" width="116" height="8" fill={color} />
  <text x="0" y="24" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="700" fontSize="38" fill={color}>{text}</text>
</g>;
