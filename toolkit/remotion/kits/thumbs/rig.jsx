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
  return null; };

const Eyes = ({type, ink, blink, look}) => { const E = (x) => {
    if (blink > 0.5) return <path key={x} d={`M ${x - 8} -5 L ${x + 8} -5`} stroke={ink} strokeWidth="4" strokeLinecap="round" />;
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
  const {skin, hair, hairColor, top, bottom, shoe = '#2A2522', ink = '#1F1B16', glasses} = look;
  const td = shade(top, 0.78), tl = tint(top, 0.12), bd = shade(bottom, 0.8), sk = shade(skin, 0.86);
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
        <Arm side={-1} a={ba} b={bb} color={shade(top, 0.66)} skin={sk} item={backItem} />
        <Leg side={1} a={la} b={lb} color={bottom} shoe={shoe} />
        {/* hips + torso */}
        <path d="M -62 -262 L 62 -262 L 66 -226 C 40 -214 -40 -214 -66 -226 Z" fill={bottom} />
        <path d="M -72 -420 C -86 -400 -70 -300 -64 -258 L 64 -258 C 70 -300 86 -400 72 -420 C 50 -436 -50 -436 -72 -420 Z" fill={top} />
        <path d="M 40 -432 C 70 -426 84 -402 76 -360 C 72 -320 66 -286 64 -258 L 34 -258 C 46 -320 50 -380 40 -432 Z" fill={td} />
        <path d="M -24 -436 L 0 -398 L 24 -436 Z" fill={tl} />
        <path d="M -20 -462 L 20 -462 L 22 -432 C 10 -424 -10 -424 -22 -432 Z" fill={sk} />
        <Arm side={1} a={fa} b={fb} color={td} skin={skin} item={frontItem} />
        {/* head */}
        <g transform={`translate(0 -528) rotate(${tilt})`}>
          <Hair style={hair} color={hairColor} part="back" />
          <ellipse cx="-62" cy="6" rx="12" ry="16" fill={skin} /><ellipse cx="62" cy="6" rx="12" ry="16" fill={skin} />
          <ellipse cx="0" cy="0" rx="62" ry="72" fill={skin} />
          <path d="M 30 -60 C 70 -36 72 34 26 68 C 56 64 64 -30 30 -60 Z" fill={sk} opacity="0.35" />
          <Hair style={hair} color={hairColor} part="front" />
          {(FACE[face] || FACE.neutral).brow.map(([a, b, c, d], i) => <path key={i} d={`M ${a} ${b} L ${c} ${d}`} stroke={shade(hairColor, 0.9)} strokeWidth="6" strokeLinecap="round" />)}
          <Eyes type={(FACE[face] || FACE.neutral).eye} ink={ink} blink={blink} look={eyeLook} />
          {glasses && <g fill="none" stroke={ink} strokeWidth="3.5"><circle cx="-22" cy="-6" r="15" /><circle cx="22" cy="-6" r="15" /><path d="M -7 -8 Q 0 -12 7 -8" /></g>}
          <path d="M 4 4 Q 12 16 2 18" stroke={sk} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="-34" cy="18" r="10" fill="#E8836B" opacity="0.22" /><circle cx="34" cy="18" r="10" fill="#E8836B" opacity="0.22" />
          <Mouth v={mouth} face={face} skin={skin} />
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
