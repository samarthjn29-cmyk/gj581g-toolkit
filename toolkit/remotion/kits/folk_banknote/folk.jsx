// "Folk": our own flat-vector character kit (first test, 2 Nov 2026). Clean geometry, no outlines, one shade tone per colour.
import React from 'react';

const shade = (hex, k = 0.82) => { const n = parseInt(hex.slice(1), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k)); return `rgb(${c.join(',')})`; };
const tint = (hex, k = 0.25) => { const n = parseInt(hex.slice(1), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * k)); return `rgb(${c.join(',')})`; };

// faces: eyes, brows and mouth per expression (coordinates relative to head centre 0,0; head is 124 x 144)
const FACE = {
  neutral: {brow: [[-30, -22, -14, -24], [14, -24, 30, -22]], eye: 'dot', mouth: 'M -11 32 Q 0 36 11 32'},
  happy: {brow: [[-30, -25, -14, -28], [14, -28, 30, -25]], eye: 'smile', mouth: 'M -16 27 Q 0 46 16 27 Z'},
  smile: {brow: [[-30, -24, -14, -26], [14, -26, 30, -24]], eye: 'dot', mouth: 'M -14 29 Q 0 41 14 29'},
  sad: {brow: [[-30, -20, -14, -27], [14, -27, 30, -20]], eye: 'dot', mouth: 'M -12 37 Q 0 29 12 37'},
  thinking: {brow: [[-30, -27, -14, -27], [14, -22, 30, -26]], eye: 'side', mouth: 'M -6 33 L 12 31'},
  surprised: {brow: [[-30, -30, -14, -33], [14, -33, 30, -30]], eye: 'wide', mouth: 'O'},
  smug: {brow: [[-30, -23, -14, -25], [14, -27, 30, -24]], eye: 'lid', mouth: 'M -12 31 Q 4 38 16 27'},
};

const Hair = ({style, color, part}) => { const d = shade(color, 0.8);
  // part: 'back' (behind head) or 'front'
  if (style === 'bob') return part === 'back'
    ? <path d="M -74 -10 C -80 -70 -40 -92 0 -92 C 40 -92 80 -70 74 -10 L 76 52 C 60 64 40 62 30 54 L -30 54 C -40 62 -60 64 -76 52 Z" fill={d} />
    : <path d="M -66 -8 C -70 -64 -34 -86 6 -84 C 44 -82 70 -60 66 -10 C 50 -30 30 -44 -4 -46 C -26 -40 -48 -26 -66 -8 Z" fill={color} />;
  if (style === 'bun') return part === 'back'
    ? <g><circle cx="0" cy="-92" r="30" fill={d} /><path d="M -64 -6 C -68 -62 -32 -84 0 -84 C 32 -84 68 -62 64 -6 Z" fill={d} /></g>
    : <path d="M -64 -10 C -66 -60 -30 -82 0 -82 C 30 -82 66 -60 64 -10 C 52 -36 30 -50 0 -50 C -26 -50 -50 -36 -64 -10 Z" fill={color} />;
  if (style === 'short') return part === 'back' ? null
    : <path d="M -64 -16 C -66 -66 -30 -86 4 -84 C 40 -82 68 -62 64 -18 C 58 -36 48 -44 30 -48 C 10 -40 -18 -40 -38 -46 C -52 -42 -60 -30 -64 -16 Z" fill={color} />;
  if (style === 'curly') return part === 'back'
    ? <g fill={d}>{[[-60, -40, 30], [-40, -72, 30], [0, -86, 32], [40, -72, 30], [60, -40, 30], [-66, 0, 24], [66, 0, 24]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>
    : <g fill={color}>{[[-44, -56, 22], [-16, -70, 24], [16, -70, 24], [44, -56, 22], [-58, -30, 16], [58, -30, 16]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>;
  if (style === 'long') return part === 'back'
    ? <path d="M -72 -16 C -78 -74 -38 -94 0 -94 C 38 -94 78 -74 72 -16 L 80 120 C 50 132 -50 132 -80 120 Z" fill={d} />
    : <path d="M -66 -4 C -70 -64 -32 -86 4 -84 C 42 -82 70 -60 64 -6 C 46 -40 20 -52 -10 -48 C -36 -38 -54 -24 -66 -4 Z" fill={color} />;
  return null; };

const Eyes = ({type, ink}) => { const E = (x) => {
    if (type === 'smile') return <path key={x} d={`M ${x - 8} -6 Q ${x} -14 ${x + 8} -6`} stroke={ink} strokeWidth="4.5" fill="none" strokeLinecap="round" />;
    if (type === 'wide') return <g key={x}><ellipse cx={x} cy={-6} rx={8} ry={9} fill="#FFFFFF" /><circle cx={x} cy={-5} r={4.5} fill={ink} /></g>;
    if (type === 'side') return <g key={x}><ellipse cx={x} cy={-6} rx={7} ry={7.5} fill="#FFFFFF" /><circle cx={x + 3} cy={-8} r={4} fill={ink} /></g>;
    if (type === 'lid') return <g key={x}><ellipse cx={x} cy={-5} rx={5} ry={5.5} fill={ink} /><path d={`M ${x - 9} -9 L ${x + 9} -9`} stroke={ink} strokeWidth="4" strokeLinecap="round" /></g>;
    return <ellipse key={x} cx={x} cy={-6} rx={5} ry={6} fill={ink} />; };
  return <g>{E(-22)}{E(22)}</g>; };

// A bust (waist up). x, y = bottom centre; h = total height. top: 'blazer' | 'sweater' | 'shirt' | 'hoodie'
export const Folk = ({x, y, h = 520, skin = '#F1C7A4', hair = 'bob', hairColor = '#2B2420', top = 'blazer', topColor = '#2E3A59', inner = '#F4F1EA',
  face = 'neutral', ink = '#1F1B16', glasses = false, flip = false, hold, tilt = 0}) => {
  const s = h / 520; const f = FACE[face] || FACE.neutral; const sk = shade(skin, 0.86); const tc = topColor, td = shade(topColor, 0.78), tl = tint(topColor, 0.12);
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-200 -520)`}>
    {/* torso */}
    <path d="M 52 520 C 52 420 70 330 128 300 C 150 290 172 284 200 284 C 228 284 250 290 272 300 C 330 330 348 420 348 520 Z" fill={tc} />
    <path d="M 272 300 C 330 330 348 420 348 520 L 300 520 C 304 440 296 370 272 300 Z" fill={td} />
    {/* neck */}
    <path d="M 172 250 L 228 250 L 230 292 C 214 304 186 304 170 292 Z" fill={sk} />
    {top === 'blazer' && <g>
      <path d="M 170 290 L 200 360 L 230 290 Z" fill={inner} />
      <path d="M 166 288 L 200 362 L 186 520 L 150 520 L 140 360 L 152 296 Z" fill={tl} />
      <path d="M 234 288 L 200 362 L 214 520 L 250 520 L 260 360 L 248 296 Z" fill={td} />
      <path d="M 166 288 L 186 330 L 158 334 L 152 296 Z" fill={td} opacity="0.5" />
      <circle cx="200" cy="420" r="6" fill={shade(topColor, 0.6)} />
    </g>}
    {top === 'sweater' && <g>
      <path d="M 168 290 C 180 312 220 312 232 290 C 226 300 214 306 200 306 C 186 306 174 300 168 290 Z" fill={td} />
      <path d="M 70 500 L 330 500 L 334 520 L 66 520 Z" fill={td} opacity="0.6" />
    </g>}
    {top === 'shirt' && <g>
      <path d="M 176 288 L 200 330 L 186 342 L 164 300 Z" fill={tl} /><path d="M 224 288 L 200 330 L 214 342 L 236 300 Z" fill={tl} />
      {[360, 400, 440, 480].map((yy) => <circle key={yy} cx="200" cy={yy} r="4" fill={td} />)}
    </g>}
    {top === 'hoodie' && <g>
      <path d="M 150 296 C 160 330 240 330 250 296 C 236 318 164 318 150 296 Z" fill={td} />
      <path d="M 186 320 L 182 380 M 214 320 L 218 380" stroke={tl} strokeWidth="5" strokeLinecap="round" />
    </g>}
    {/* arms: relaxed along the body, or holding a card in front */}
    {hold ? <g>
      <path d="M 106 330 C 92 380 100 430 140 452" stroke={td} strokeWidth="46" fill="none" strokeLinecap="round" />
      <path d="M 294 330 C 308 380 300 430 260 452" stroke={shade(topColor, 0.68)} strokeWidth="46" fill="none" strokeLinecap="round" />
      <g transform={`rotate(${tilt} 200 420)`}><rect x="130" y="360" width="140" height="96" rx="8" fill="#FFFFFF" />
        <rect x="130" y="360" width="140" height="22" rx="8" fill={hold.color || '#F2C230'} /><rect x="130" y="374" width="140" height="8" fill={hold.color || '#F2C230'} />
        <text x="200" y="430" textAnchor="middle" fontFamily="'Bebas Neue', 'Oswald', 'Inter', sans-serif" fontWeight="700" fontSize="46" fill={ink}>{hold.text}</text></g>
      <ellipse cx="146" cy="452" rx="20" ry="16" fill={skin} /><ellipse cx="254" cy="452" rx="20" ry="16" fill={skin} />
    </g> : <g>
      <path d="M 128 300 C 96 318 84 360 82 420 L 80 520 L 128 520 L 130 420 C 132 380 136 350 146 330 Z" fill={td} />
      <path d="M 272 300 C 304 318 316 360 318 420 L 320 520 L 272 520 L 270 420 C 268 380 264 350 254 330 Z" fill={shade(topColor, 0.68)} />
    </g>}
    {/* head */}
    <g transform="translate(200 196)">
      <Hair style={hair} color={hairColor} part="back" />
      <ellipse cx="-62" cy="6" rx="12" ry="16" fill={skin} /><ellipse cx="62" cy="6" rx="12" ry="16" fill={skin} />
      <ellipse cx="0" cy="0" rx="62" ry="72" fill={skin} />
      <path d="M 30 -60 C 70 -36 72 34 26 68 C 56 64 64 -30 30 -60 Z" fill={sk} opacity="0.35" />
      <Hair style={hair} color={hairColor} part="front" />
      {f.brow.map(([a, b, c, d], i) => <path key={i} d={`M ${a} ${b} L ${c} ${d}`} stroke={shade(hairColor, 0.9)} strokeWidth="6" strokeLinecap="round" />)}
      <Eyes type={f.eye} ink={ink} />
      {glasses && <g fill="none" stroke={ink} strokeWidth="3.5"><circle cx="-22" cy="-6" r="15" /><circle cx="22" cy="-6" r="15" /><path d="M -7 -8 Q 0 -12 7 -8" /></g>}
      <path d="M -2 4 Q 6 16 -4 18" stroke={sk} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="-34" cy="18" r="10" fill="#E8836B" opacity="0.22" /><circle cx="34" cy="18" r="10" fill="#E8836B" opacity="0.22" />
      {f.mouth === 'O' ? <ellipse cx="0" cy="34" rx="8" ry="10" fill={shade(skin, 0.45)} />
        : f.mouth.endsWith('Z') ? <g><path d={f.mouth} fill={shade(skin, 0.4)} /><path d="M -10 30 Q 0 34 10 30" stroke="#FFFFFF" strokeWidth="4" fill="none" /></g>
        : <path d={f.mouth} stroke={shade(skin, 0.45)} strokeWidth="5" fill="none" strokeLinecap="round" />}
    </g>
  </g>; };
