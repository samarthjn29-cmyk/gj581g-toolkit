// Scrolls (Herculaneum) style frames, 7 Nov 2026. Sam: "very vivid and detailed frames. The animation itself should do the
// talking." Seven Firefly worlds (vectorised, public/scrolls/*.jpg, 3840 x 2195 world px) with our own drawn pieces on top:
// the spiral inside the lump, scroll racks, the reader, the eruption, torches and lumps, Piaggio's machine, the scan screen,
// the unwrapping, the crackle and the word, the beamline. Devices from vw.jsx. One frame per index (composition frame = index).
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, random} from 'remotion';
import {RomanReader, RomanWalker, DiggerTorch, DiggerCrouch, Priest, BackView, Contact} from './people.jsx';
import {Layer, toScreen, flick, Glow, Dark, Grain, Vignette, Motes, Chapter, Lexicon, Kind, DateTag, Figure, POSE, Back, SR, SI, MO, IN} from '../cave/vw.jsx';

const W = 3840, H = 2195;
const EMB = '#E39A3A', GOLD = '#F2B85A', CREAM = '#FBE3B0', CYAN = '#7FE3F0', PURPLE = '#C77DFF';
const R = (s, k) => random(`${s}-${k}`);

// ---------- shared pieces ----------
const BG = ({cam, src, filter = 'none', p = 1}) => <Layer cam={cam} p={p}><Img src={staticFile(`scrolls/${src}.jpg`)} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, filter}} /></Layer>;
const World = ({cam, children, p = 1}) => <Layer cam={cam} p={p}><svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>{children}</svg></Layer>;

// a crushed spiral cross-section: n wraps, slightly squashed and wobbly like a carbonised roll
const spiralPath = (cx, cy, r0, r1, turns, squash = 0.86, seed = 'sp', wob = 0.06) => {
  const N = Math.round(turns * 90); let d = '';
  for (let i = 0; i <= N; i++) { const u = i / N, a = u * turns * 2 * Math.PI, r = r0 + (r1 - r0) * u;
    const w = 1 + wob * Math.sin(a * 3 + R(seed, 1) * 6) + wob * 0.6 * Math.sin(a * 7 + R(seed, 2) * 6);
    const x = cx + Math.cos(a) * r * w, y = cy + Math.sin(a) * r * w * squash; d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
  return d; };
const Spiral = ({cx, cy, r0 = 18, r1, turns = 14, squash = 0.86, color = '#2A211C', w = 7, glow = null, seed = 'sp'}) => <g>
  {glow && <path d={spiralPath(cx, cy, r0, r1, turns, squash, seed)} fill="none" stroke={glow} strokeWidth={w * 3.2} opacity={0.35} style={{filter: 'blur(8px)'}} />}
  <path d={spiralPath(cx, cy, r0, r1, turns, squash, seed)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" /></g>;

// a scroll seen end-on, resting in a pigeonhole
const ScrollEnd = ({x, y, r, seed, tag = true, lit = 1}) => <g>
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.94} fill="#E8D3A8" />
  <path d={spiralPath(x, y, r * 0.12, r * 0.92, 4.2, 0.94, seed, 0.03)} fill="none" stroke="#9C7A52" strokeWidth={r * 0.07} />
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.94} fill="none" stroke="#5A3F28" strokeWidth={r * 0.1} />
  {tag && R(seed, 3) > 0.4 && <g><line x1={x + r * 0.3} y1={y + r * 0.8} x2={x + r * 0.45} y2={y + r * 1.7} stroke="#4A3220" strokeWidth={3} />
    <rect x={x + r * 0.2} y={y + r * 1.6} width={r * 0.65} height={r * 0.45} rx={3} fill={R(seed, 4) > 0.5 ? '#C9A46A' : '#B5543A'} /></g>}
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.94} fill="#000" opacity={0.35 * (1 - lit)} /></g>;
const Rack = ({x, y, cols, rows, cell, seed, lit = 1}) => <g>
  <rect x={x - 22} y={y - 22} width={cols * cell + 44} height={rows * cell + 44} fill="#3A2416" />
  {Array.from({length: rows * cols}, (_, i) => { const c = i % cols, r = Math.floor(i / cols), cx = x + c * cell, cy = y + r * cell;
    const n = 2 + Math.floor(R(seed + i, 1) * 3);
    return <g key={i}><rect x={cx + 6} y={cy + 6} width={cell - 12} height={cell - 12} fill="#1A0F09" />
      {Array.from({length: n}, (_, k) => { const rr = cell * (0.17 + R(seed + i, k + 5) * 0.05);
        return <ScrollEnd key={k} x={cx + cell * (0.27 + 0.46 * ((k % 2) + R(seed + i, k + 9) * 0.1))} y={cy + cell - 12 - rr - (k > 1 ? rr * 1.7 : 0)} r={rr} seed={`${seed}${i}${k}`} tag={k === 0} lit={lit} />; })}
      <rect x={cx} y={cy + cell - 10} width={cell} height={14} fill="#5A3A22" /></g>; })}
  <rect x={x - 22} y={y - 34} width={cols * cell + 44} height={20} fill="#6B4528" /></g>;


// a wooden armarium (book cabinet) standing on the floor against the back wall, in the room's perspective.
// back face at the wall: x0..x1, top..floor; the front face is projected toward the viewer from the vanishing point.
const VP = {x: 1960, y: 1150};
const proj = (x, y, k) => ({x: VP.x + (x - VP.x) / k, y: VP.y + (y - VP.y) / k});
const Armarium = ({x0, x1, top, floor, rows = 4, cols = 3, seed, k = 0.9}) => {
  const A = proj(x0, top, k), B = proj(x1, floor, k), fx0 = A.x, fy0 = A.y, fx1 = B.x, fy1 = B.y, W_ = fx1 - fx0, H_ = fy1 - fy0;
  const innerRight = (x0 + x1) / 2 < VP.x;             // left cabinet shows its right side, right cabinet its left side
  const bi = innerRight ? x1 : x0, fi = innerRight ? fx1 : fx0;
  const crown = H_ * 0.075, plinth = H_ * 0.07, fr = W_ * 0.04, dv = W_ * 0.025;
  const ix0 = fx0 + fr, ix1 = fx1 - fr, iy0 = fy0 + crown, iy1 = fy1 - plinth, cw = (ix1 - ix0) / cols, ch = (iy1 - iy0) / rows;
  const gid = `ag${seed}`;
  return <g>
    <defs><linearGradient id={gid} x1={innerRight ? 0 : 1} y1="0" x2={innerRight ? 1 : 0} y2="0"><stop offset="0" stopColor="#000" stopOpacity="0.5" /><stop offset="1" stopColor="#000" stopOpacity="0" /></linearGradient>
      <linearGradient id={`${gid}h`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0E0805" /><stop offset="1" stopColor="#2A190E" /></linearGradient></defs>
    {/* floor shadow */}
    <path d={`M${fx0 - 20},${fy1} L${fx1 + 20},${fy1} L${fx1 + 60},${fy1 + 46} L${fx0 - 60},${fy1 + 46} Z`} fill="#000" opacity={0.35} style={{filter: 'blur(10px)'}} />
    {/* the inner side face, lit by the lamp */}
    <path d={`M${fi},${fy0} L${bi},${top} L${bi},${floor} L${fi},${fy1} Z`} fill="#8A5A34" />
    <path d={`M${fi},${fy0} L${bi},${top} L${bi},${top + (floor - top) * 0.08} L${fi},${fy0 + crown} Z`} fill="#B07A48" />
    {/* front frame */}
    <rect x={fx0} y={fy0} width={W_} height={H_} fill="#5A3A22" />
    {Array.from({length: rows * cols}, (_, i) => { const c = i % cols, r = Math.floor(i / cols), cx = ix0 + c * cw, cy = iy0 + r * ch;
      const rr = Math.min(cw, ch) * 0.155, n0 = Math.max(2, Math.floor((cw - dv * 2) / (rr * 2.05))), full = R(seed + 'f', i);
      const stack = []; for (let row = 0; row < 3; row++) { const n = n0 - row; if (n <= 0 || (row === 2 && full < 0.35) || (row === 1 && full < 0.12)) break;
        for (let j = 0; j < n; j++) stack.push({x: cx + cw / 2 + (j - (n - 1) / 2) * rr * 2.05 + (R(seed + 'j' + i, row * 9 + j) - 0.5) * 4, y: cy + ch - dv - rr - row * rr * 1.75, r: rr * (0.92 + R(seed + 'r' + i, row * 9 + j) * 0.12)}); }
      return <g key={i}>
        <rect x={cx + dv / 2} y={cy + dv / 2} width={cw - dv} height={ch - dv} fill={`url(#${gid}h)`} />
        {stack.map((q, j) => <ScrollEnd key={j} x={q.x} y={q.y} r={q.r} seed={`${seed}${i}-${j}`} tag={j === 0 && R(seed + 't', i) > 0.45} />)}
        <rect x={cx + dv / 2} y={cy + dv / 2} width={cw - dv} height={ch * 0.12} fill="#000" opacity={0.35} /></g>; })}
    {/* dividers and shelf lips */}
    {Array.from({length: cols + 1}, (_, c) => <rect key={`v${c}`} x={ix0 + c * cw - dv / 2} y={iy0} width={dv} height={iy1 - iy0} fill="#6B4528" />)}
    {Array.from({length: rows + 1}, (_, r) => <rect key={`h${r}`} x={ix0 - dv / 2} y={iy0 + r * ch - dv / 2} width={ix1 - ix0 + dv} height={dv} fill="#7A5030" />)}
    {/* crown and plinth mouldings */}
    <rect x={fx0 - fr * 0.6} y={fy0 - crown * 0.25} width={W_ + fr * 1.2} height={crown} fill="#6B4528" /><rect x={fx0 - fr * 0.6} y={fy0 - crown * 0.25} width={W_ + fr * 1.2} height={crown * 0.25} fill="#B07A48" />
    <rect x={fx0 - fr * 0.4} y={fy1 - plinth} width={W_ + fr * 0.8} height={plinth} fill="#4A2E1A" /><rect x={fx0 - fr * 0.4} y={fy1 - plinth} width={W_ + fr * 0.8} height={plinth * 0.18} fill="#8A5A34" />
    {/* light falloff across the front, darker on the side away from the lamp */}
    <rect x={fx0 - fr} y={fy0 - crown * 0.3} width={W_ + fr * 2} height={H_ + crown * 0.3} fill={`url(#${gid})`} />
  </g>; };

// an open scroll: two rollers and the sheet between with columns of writing
const OpenScroll = ({x, y, w, h, cols = 3, glowAmt = 0, seed = 'os', burnt = false}) => <g>
  <rect x={x} y={y} width={w} height={h} fill={burnt ? '#2B2420' : '#EBD8B0'} />
  <rect x={x} y={y} width={w} height={h} fill="url(#papyrusFibres)" opacity={0.35} />
  {Array.from({length: cols}, (_, c) => Array.from({length: Math.floor(h / 22) - 2}, (_, l) => { const lw = (w / cols - 40) * (0.7 + 0.3 * R(seed + c, l));
    return <rect key={`${c}-${l}`} x={x + 20 + c * (w / cols)} y={y + 18 + l * 22} width={lw} height={7} rx={3} fill={burnt ? '#120E0C' : '#3B2A1C'} opacity={0.8} />; }))}
  {[x - 18, x + w - 18].map((rx, i) => <g key={i}><rect x={rx} y={y - 24} width={36} height={h + 48} rx={18} fill="#6B4528" /><rect x={rx + 6} y={y - 24} width={10} height={h + 48} rx={5} fill="#A06A3C" opacity={0.6} /></g>)}
  {glowAmt > 0 && <rect x={x} y={y} width={w} height={h} fill={GOLD} opacity={glowAmt * 0.2} style={{filter: 'blur(20px)'}} />}</g>;

const Flame = ({x, y, s = 1, t, seed = 1}) => { const tongue = (k, w, h, c) => {
    const tip = [Math.sin(t * 5.3 + k + seed) * w * 0.35, -h * (1 + 0.12 * Math.sin(t * 8.7 + k * 1.7))];
    return <path d={`M${-w},0 C${-w},${-h * 0.35} ${tip[0] - w * 0.25},${tip[1] * 0.6} ${tip[0]},${tip[1]} C${tip[0] + w * 0.25},${tip[1] * 0.6} ${w},${-h * 0.35} ${w},0 Q0,${w * 0.5} ${-w},0 Z`} fill={c} />; };
  return <g transform={`translate(${x},${y}) scale(${s * flick(t, seed, 0.08)})`}>{tongue(0, 30, 90, '#C25E36')}{tongue(1.7, 24, 74, EMB)}{tongue(3.1, 16, 56, GOLD)}{tongue(4.4, 8, 34, CREAM)}</g>; };
const Torch = ({t, seed}) => <g><line x1={0} y1={30} x2={10} y2={-170} stroke="#3A2416" strokeWidth={14} strokeLinecap="round" /><rect x={-6} y={-196} width={30} height={34} rx={6} fill="#2A1A10" /><Flame x={10} y={-196} s={1.4} t={t} seed={seed} /></g>;

// a monogram medallion (living people and people with no portrait: no photo, our own monogram)
const MonoBadge = ({mono, name, role, dates, y = 300, side = 'right', o = 1}) => <div style={{position: 'absolute', [side]: 80, top: y, display: 'flex', flexDirection: side === 'right' ? 'row-reverse' : 'row', alignItems: 'center', gap: 22, opacity: o}}>
  <div style={{width: 150, height: 150, borderRadius: '50%', border: '2px solid #E9B66A', boxShadow: '0 0 0 7px rgba(14,10,9,0.6), 0 0 0 8.5px #E9B66A55', background: 'radial-gradient(circle at 40% 35%, #4A2E1E, #1A0F0A)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SR, fontWeight: 600, fontSize: 58, color: '#F4DDB0', letterSpacing: 2}}>{mono}</div>
  <div style={{textAlign: side === 'right' ? 'right' : 'left', background: 'rgba(14,10,9,0.55)', padding: '10px 16px'}}>
    <div style={{fontFamily: SR, fontWeight: 600, fontSize: 40, color: '#FBE3B0', letterSpacing: 4}}>{name}</div>
    <div style={{fontFamily: IN, fontSize: 19, color: '#E8D6BC', marginTop: 2}}>{role}</div>
    {dates && <div style={{fontFamily: MO, fontSize: 16, color: '#C9A27A', marginTop: 6, letterSpacing: 2}}>{dates}</div>}</div></div>;
const Defs = () => <defs>
  <pattern id="papyrusFibres" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0,10 H40 M0,27 H40" stroke="#8C6A40" strokeWidth={2} opacity={0.5} /><path d="M12,0 V40 M31,0 V40" stroke="#8C6A40" strokeWidth={1.4} opacity={0.35} /></pattern>
  <radialGradient id="ashG" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#6A5A55" /><stop offset="0.6" stopColor="#3A302E" /><stop offset="1" stopColor="#1E1817" /></radialGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" /><stop offset="1" stopColor={CYAN} stopOpacity="0.2" /></linearGradient></defs>;


// ---- people: smooth silhouettes with a rim light (feet at 0,0; about 300 units tall at s=1). Richer than the joint rig.
const Sil = ({x, y, s = 1, flip = false, rim = GOLD, rimDx = -5, fill = '#160F14', d, extra = null, children}) => <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
  <g transform={`translate(${rimDx},-3)`} opacity={0.9}>{d.map((p, i) => <path key={i} d={p} fill={rim} />)}</g>
  {d.map((p, i) => <path key={i} d={p} fill={fill} />)}{extra}{children}</g>;
const HEAD = (cx, cy, r = 21) => `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`;
// a Roman in a long tunic and mantle, walking, a scroll held at the chest
const Roman = (p) => <Sil {...p} d={[HEAD(4, -282),
  'M-12,-260 C-40,-254 -60,-236 -64,-204 C-70,-150 -74,-80 -70,-20 L-74,0 L-34,0 L-30,-14 L10,-14 L16,0 L60,0 C62,-40 64,-110 60,-170 C58,-214 44,-250 14,-260 Z',
  'M36,-226 C70,-206 92,-176 96,-150 L84,-140 C70,-160 50,-180 30,-190 Z']}
  extra={<g><rect x={64} y={-170} width={74} height={22} rx={11} fill="#E8D3A8" transform="rotate(-24 64 -170)" /><path d="M-56,-196 C-20,-150 20,-120 56,-60" stroke="#000" strokeOpacity={0.35} strokeWidth={6} fill="none" /></g>} />;
const RomanReading = (p) => <Sil {...p} d={[HEAD(10, -284),
  'M-10,-262 C-40,-256 -60,-236 -64,-204 C-70,-150 -74,-80 -70,-20 L-74,0 L-34,0 L-30,-14 L10,-14 L16,0 L60,0 C62,-40 64,-110 60,-170 C58,-214 44,-250 16,-262 Z',
  'M30,-230 C60,-214 84,-196 100,-178 L92,-166 C74,-180 50,-196 24,-206 Z', 'M-30,-222 C0,-200 40,-186 84,-176 L82,-162 C38,-168 -6,-180 -36,-200 Z']}
  extra={<g transform="translate(96,-182) rotate(-8)"><rect x={-6} y={-36} width={14} height={72} rx={7} fill="#6B4528" /><rect x={8} y={-30} width={110} height={60} fill="#EBD8B0" />
    {[0, 1, 2, 3, 4].map((l) => <rect key={l} x={16} y={-22 + l * 11} width={90} height={4} rx={2} fill="#3B2A1C" />)}<rect x={116} y={-36} width={14} height={72} rx={7} fill="#6B4528" /></g>} />;
// a reader seated on a stool, leaning over an open scroll held in both hands
const Reader = (p) => <Sil {...p} d={[HEAD(26, -232),
  'M6,-212 C-22,-206 -42,-186 -46,-156 C-50,-120 -50,-90 -46,-70 L-60,-70 L-62,0 L-44,0 L-40,-52 L40,-58 L44,0 L62,0 L60,-76 C50,-90 22,-92 0,-88 C2,-120 10,-150 30,-176 C38,-188 30,-206 6,-212 Z',
  'M14,-176 C40,-160 70,-140 96,-120 L88,-108 C62,-120 34,-136 8,-150 Z']} />;
// an 18th-century digger: coat with tails, breeches, a tricorn; arm raised holding a torch (child at the hand)
const Digger = ({torch, lump, t, ...p}) => <Sil {...p} d={[HEAD(0, -286, 20),
  'M-36,-300 L36,-300 L26,-314 L0,-306 L-26,-314 Z',
  'M-14,-266 C-42,-262 -56,-240 -58,-206 L-62,-120 L-78,-60 L-40,-70 L-36,-110 L-30,-110 L-34,-50 L-40,0 L-16,0 L-6,-60 L8,-60 L18,0 L42,0 L36,-50 L34,-110 L40,-110 L44,-70 L80,-60 L62,-120 C58,-180 54,-240 14,-266 Z',
  torch ? 'M38,-240 C60,-262 70,-300 74,-330 L90,-326 C88,-292 76,-252 50,-224 Z' : 'M40,-236 C66,-214 84,-190 96,-164 L82,-156 C70,-180 54,-200 34,-216 Z']}>
  {torch && <g transform="translate(84,-326)"><Torch t={t} seed={7} /></g>}
  {lump && <g transform="translate(96,-160) rotate(-20)"><rect x={-10} y={-26} width={110} height={52} rx={24} fill="#16100D" /><ellipse cx={-6} cy={0} rx={14} ry={24} fill="#2E241E" /></g>}</Sil>;
// a digger bending to lift a lump
const Bender = (p) => <Sil {...p} d={[HEAD(92, -168, 20),
  'M88,-186 L120,-196 L112,-178 Z',
  'M70,-150 C40,-170 -10,-176 -46,-160 C-60,-140 -58,-110 -50,-96 L-46,-50 L-52,0 L-28,0 L-20,-50 L-12,-90 L4,-92 L14,-46 L10,0 L34,0 L38,-50 L36,-100 C56,-110 70,-126 70,-150 Z',
  'M60,-140 C76,-110 88,-80 96,-50 L82,-46 C72,-76 58,-104 46,-128 Z']} />;

// ---------- the frames ----------
// 1. Open: "This looks like a lump of burnt wood."
const F_Lump = ({t}) => { const cam = {x: 2150, y: 1000, z: 0.56};
  return <AbsoluteFill style={{background: '#0A0807'}}>
    <BG cam={cam} src="lump" filter="saturate(1.05) contrast(1.05)" />
    <Dark lights={[{...toScreen(cam, 2700, 700), r: 1200, a: 1}]} a={0.5} />
    <Glow {...toScreen(cam, 3300, 200)} r={700} color="#F6C77A" a={0.35} />
    <Motes n={60} x0={900} y0={0} w={1020} h={720} color="#FCE3B4" seed="lm" />
    <Kind t={t} text="Illustration" /><Grain /><Vignette a={0.6} /></AbsoluteFill>; };

// 2. Open: "But this isn't wood. It's a book." The cut end becomes the cross-section of a rolled book.
const F_Book = ({t}) => { const cam = {x: 1250, y: 1250, z: 1.05}, c = {x: 860, y: 1290};
  return <AbsoluteFill style={{background: '#0A0807'}}>
    <BG cam={cam} src="lump" filter="brightness(0.75) saturate(1.1)" />
    <World cam={cam}><Defs />
      <ellipse cx={c.x} cy={c.y} rx={280} ry={340} fill="#1C1512" transform={`rotate(8 ${c.x} ${c.y})`} />
      <Spiral cx={c.x} cy={c.y} r0={10} r1={258} turns={24} squash={1.2} color="#4A3A2E" w={4.5} seed="bk" />
      <path d={spiralPath(c.x, c.y, 10, 258, 24, 1.2, 'bk')} fill="none" stroke="#F2B85A" strokeWidth={2.2} strokeDasharray="2 18" opacity={0.7} />
      <path d={spiralPath(c.x, c.y, 160, 198, 1.6, 1.2, 'bk')} fill="none" stroke={GOLD} strokeWidth={6} style={{filter: 'drop-shadow(0 0 10px #F2B85A)'}} />
    </World>
    <Glow {...toScreen(cam, c.x, c.y)} r={420} color={EMB} a={0.35} />
    {/* the label: what the rings really are */}
    <div style={{position: 'absolute', left: 1180, top: 300, width: 600}}>
      <div style={{fontFamily: MO, fontSize: 16, letterSpacing: 4, color: '#C9A27A'}}>NOT TREE RINGS</div>
      <div style={{fontFamily: SI, fontSize: 64, color: CREAM, lineHeight: 1.05, marginTop: 8}}>Layers of a rolled-up book</div>
      <div style={{width: 260, height: 1.5, background: '#E9B66A88', marginTop: 18}} /></div>
    <svg width={1920} height={1080} style={{position: 'absolute'}}><path d="M1170,420 C1000,430 860,470 720,560" stroke="#E9B66A" strokeWidth={2} fill="none" opacity={0.8} /><circle cx={720} cy={560} r={6} fill="#E9B66A" /></svg>
    <Kind t={t} text="Illustration" /><Grain /><Vignette a={0.55} /></AbsoluteFill>; };

// 3. Title card
const F_Title = ({t}) => <AbsoluteFill style={{background: '#0A0807'}}>
  <BG cam={{x: 2150, y: 900, z: 0.6}} src="lump" filter="brightness(0.35) blur(2px)" />
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(10,8,7,0.2), rgba(10,8,7,0.92) 70%)'}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: SI, fontWeight: 500, fontSize: 92, color: CREAM, letterSpacing: 1, lineHeight: 1.05}}>The Library We Destroyed<br />Trying to Read</div>
  <div style={{position: 'absolute', left: 860, width: 200, top: 640, height: 1.5, background: '#E9B66A99'}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 670, textAlign: 'center', fontFamily: MO, fontSize: 18, letterSpacing: 6, color: '#C9A27A'}}>HERCULANEUM · 79 AD — 2026</div>
  <Motes n={30} seed="tt" color="#FCE3B4" /><Grain /><Vignette /></AbsoluteFill>;

// 4. Chapter I: the villa by the sea, a reader walking by the pool with a scroll
const F_Villa = ({t}) => { const cam = {x: 2150, y: 1180, z: 0.6};
  return <AbsoluteFill style={{background: '#101226'}}>
    <BG cam={cam} src="villa" filter="saturate(1.12)" />
    <World cam={cam}><Defs />
      <Contact x={3150} y={1642} w={60} a={0.4} />
      <RomanWalker x={3150} y={1642} s={1.2} flip rim="#F6B784" light="front" shade={0.38} />
    </World>
    <Glow {...toScreen(cam, 3250, 1300)} r={420} color={GOLD} a={0.35} />
    <Motes n={30} seed="vf" color="#FFE6A8" y0={400} h={600} />
    <Chapter t={1} at={0} dur={99} n="I" title="The library by the sea" />
    <DateTag t={1} at={0} dur={99} text="HERCULANEUM · 79 AD" x={72} y={150} />
    <Kind t={t} text="Illustration · Villa of the Papyri, Herculaneum" /><Grain /><Vignette a={0.5} /></AbsoluteFill>; };

// 5. The scroll room: racks of scrolls, a reader unrolling one by the lamp
const F_Room = ({t}) => { const cam = {x: 1960, y: 1230, z: 0.56};
  return <AbsoluteFill style={{background: '#0B0A12'}}>
    <BG cam={cam} src="room" filter="brightness(0.8) saturate(1.1)" />
    <World cam={cam}><Defs />
      <Armarium x0={930} x1={1540} top={930} floor={1610} rows={4} cols={3} seed="al" />
      <Armarium x0={2290} x1={2840} top={930} floor={1610} rows={4} cols={3} seed="ar" />
      {/* two closed scrolls on the table */}
      <g transform="rotate(-6 1700 1712)"><rect x={1640} y={1696} width={190} height={34} rx={17} fill="#E3CFA2" /><ellipse cx={1640} cy={1713} rx={9} ry={17} fill="#B08A5A" /></g>
      <g transform="rotate(4 1780 1745)"><rect x={1700} y={1730} width={170} height={32} rx={16} fill="#D9C390" /><ellipse cx={1870} cy={1746} rx={9} ry={16} fill="#B08A5A" /></g>
      <Contact x={2620} y={2084} w={110} a={0.45} />
      <RomanReader x={2620} y={2084} s={2.15} flip rim={GOLD} light="front" shade={0.4} />
    </World>
    <Dark lights={[{...toScreen(cam, 1900, 900), r: 1000, a: 1}]} a={0.55} />
    <Glow {...toScreen(cam, 1950, 700)} r={520 * flick(t, 2, 0.06)} color={GOLD} a={0.55} />
    <Motes n={34} seed="rm" color="#FFE6A8" x0={500} w={900} y0={200} h={700} />
    <Lexicon t={1} at={0} dur={99} n={1} term="Papyrus" def="Paper made from a river reed, rolled into scrolls." />
    <MonoBadge mono="Φ" name="PHILODEMUS" role="Greek philosopher" dates="LIVED c. 110–35 BC" y={56} side="left" />
    <Kind t={t} text="Illustration" /><Grain /><Vignette a={0.5} /></AbsoluteFill>; };

// 6. 79 AD: Vesuvius erupts over the bay
const F_Erupt = ({t}) => { const cam = {x: 2000, y: 760, z: 0.62}, peak = {x: 2000, y: 778};
  const puffs = Array.from({length: 220}, (_, i) => { const u = Math.pow(R('pu', i), 0.8), y = peak.y - 30 - u * 1250, top = u > 0.78 ? (u - 0.78) / 0.22 : 0;
    const spread = 70 + u * 330 + top * 900; return {x: peak.x + (R('ax', i) - 0.5) * spread * 1.6, y: y + top * 120, r: 30 + u * 110 + R('ar', i) * 90, u}; }).sort((a, b) => a.y - b.y);
  const slope = (side, v) => ({x: peak.x + side * v * 820, y: peak.y + 40 + v * 150});
  const surge = Array.from({length: 70}, (_, i) => { const side = i % 2 ? 1 : -1, v = Math.pow(R('sv', i), 0.9), p0 = slope(side, v); return {x: p0.x + (R('sx', i) - 0.5) * 60, y: p0.y - R('sy', i) * 60, r: 26 + v * 70 * R('sr', i) + 20}; });
  return <AbsoluteFill style={{background: '#1A0A0A'}}>
    <BG cam={cam} src="villa" filter="brightness(0.55) saturate(1.3) hue-rotate(-18deg)" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(60,10,8,0.85) 0%, rgba(120,30,10,0.45) 40%, rgba(0,0,0,0) 60%)', mixBlendMode: 'multiply'}} />
    <World cam={cam}><Defs />
      <defs><radialGradient id="puff" cx="0.32" cy="0.3" r="0.75"><stop offset="0" stopColor="#B49C92" /><stop offset="0.35" stopColor="#7A6660" /><stop offset="0.8" stopColor="#3C302D" /><stop offset="1" stopColor="#241C1A" /></radialGradient>
        <radialGradient id="puffLow" cx="0.5" cy="0.75" r="0.7"><stop offset="0" stopColor="#E06A34" /><stop offset="0.5" stopColor="#6A3A2C" /><stop offset="1" stopColor="#2A1F1C" /></radialGradient></defs>
      {/* the plume: a column that spreads at the top, like the umbrella pine Pliny compared it to */}
      {puffs.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.u < 0.22 ? 'url(#puffLow)' : 'url(#puff)'} />)}
      {puffs.filter((p) => p.u > 0.3).slice(0, 40).map((p, i) => <circle key={`hl${i}`} cx={p.x - p.r * 0.35} cy={p.y - p.r * 0.35} r={p.r * 0.35} fill="#E9C9B4" opacity={0.18} />)}
      {/* the surge pouring down the slopes: a low billowing band that hugs the mountain */}
      <defs><linearGradient id="surgeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A5650" /><stop offset="0.6" stopColor="#3A2C28" /><stop offset="1" stopColor="#C2552A" /></linearGradient></defs>
      <path d={`M${peak.x - 60},${peak.y + 10} ${Array.from({length: 24}, (_, i) => { const v = i / 23; return `L${peak.x - 60 - v * 900},${peak.y + 20 + v * 160 - 30 - 26 * Math.abs(Math.sin(i * 1.9))}`; }).join(' ')} L${peak.x - 980},${peak.y + 230} L${peak.x + 980},${peak.y + 230} ${Array.from({length: 24}, (_, i) => { const v = 1 - i / 23; return `L${peak.x + 60 + v * 900},${peak.y + 20 + v * 160 - 30 - 26 * Math.abs(Math.sin(i * 2.3))}`; }).join(' ')} Z`} fill="url(#surgeG)" opacity={0.78} />
      <ellipse cx={peak.x} cy={peak.y + 210} rx={900} ry={36} fill="#FF7A2E" opacity={0.35} style={{filter: 'blur(20px)'}} />
      {/* lava glow at the vent and lightning in the plume */}
      <ellipse cx={peak.x} cy={peak.y + 10} rx={120} ry={40} fill="#FF7A2E" style={{filter: 'blur(16px)'}} />
      <path d="M2060,90 L2120,220 L2080,240 L2170,420" stroke="#FFE9C8" strokeWidth={7} fill="none" opacity={0.85} style={{filter: 'drop-shadow(0 0 14px #FFD9A0)'}} />
      {/* ash falling */}
      {Array.from({length: 140}, (_, i) => <circle key={`f${i}`} cx={R('fx', i) * W} cy={(R('fy', i) * H + t * 60) % H} r={2 + R('fr', i) * 4} fill="#B9A7A0" opacity={0.5} />)}
    </World>
    <Glow {...toScreen(cam, peak.x, peak.y)} r={520} color="#FF6A2A" a={0.6} />
    <Glow {...toScreen(cam, peak.x, peak.y + 700)} r={700} color="#FF6A2A" a={0.25} />
    <DateTag t={1} at={0} dur={99} text="HERCULANEUM · 79 AD" x={72} y={64} />
    <Kind t={t} text="Illustration" /><Grain a={0.12} /><Vignette a={0.65} /></AbsoluteFill>; };

// 7. Chapter II, 1752: diggers in the tunnel with torches, a heap of black lumps
const F_Tunnel = ({t}) => { const cam = {x: 1920, y: 1250, z: 0.6};
  const lumps = Array.from({length: 13}, (_, i) => ({x: 1760 + R('lx', i) * 360, y: 1930 - R('ly', i) * 50 - (i > 8 ? 55 : 0), l: 110 + R('ll', i) * 70, a: (R('la', i) - 0.5) * 50}));
  return <AbsoluteFill style={{background: '#0A0807'}}>
    <BG cam={cam} src="tunnel" filter="brightness(0.7) saturate(1.1)" />
    <World cam={cam}><Defs />
      {lumps.map((l, i) => <g key={i} transform={`translate(${l.x},${l.y}) rotate(${l.a})`}><rect x={-l.l / 2} y={-30} width={l.l} height={60} rx={28} fill="#16100D" />
        <ellipse cx={-l.l / 2 + 6} cy={0} rx={18} ry={28} fill="#2A201B" /><path d={`M${-l.l / 2 + 10},-12 L${l.l / 2 - 20},-18`} stroke="#3A2E28" strokeWidth={3} /></g>)}
      <Contact x={1480} y={1890} w={120} a={0.5} /><Contact x={2380} y={1930} w={150} a={0.5} />
      <DiggerTorch x={1480} y={1890} s={2.1} t={t} rim={EMB} light="front" shade={0.45} />
      <DiggerCrouch x={2380} y={1930} s={2.2} flip rim={EMB} light="front" shade={0.45} />
    </World>
    <Dark lights={[{...toScreen(cam, 1660, 1000), r: 1000, a: 1}, {...toScreen(cam, 2600, 900), r: 420, a: 1}, {...toScreen(cam, 900, 900), r: 380, a: 1}]} a={0.6} />
    <Glow {...toScreen(cam, 1655, 930)} r={620 * flick(t, 5, 0.1)} color={EMB} a={0.7} />
    <Motes n={40} seed="tn" color="#FFB36A" x0={500} w={900} y0={300} h={600} />
    <Chapter t={1} at={0} dur={99} n="II" title="Lumps of charcoal" />
    <DateTag t={1} at={0} dur={99} text="HERCULANEUM · 1752" x={72} y={150} />
    <Kind t={t} text="Illustration" /><Grain a={0.1} /><Vignette a={0.6} /></AbsoluteFill>; };

// 8. Piaggio's machine: silk threads lift the scroll open a sliver at a time
const F_Piaggio = ({t}) => { const cam = {x: 1990, y: 1400, z: 0.9};
  const L = 1560, Rp = 2380, base = 1700, topY = 1170, sc = {x: 1800, y: 1638, r: 54, len: 300};
  const strip = (u) => ({x: sc.x + 110 + u * 380, y: sc.y - sc.r - 6 - Math.sin(u * 1.4) * 150});
  return <AbsoluteFill style={{background: '#0A0B18'}}>
    <BG cam={cam} src="workshop" filter="brightness(0.7) saturate(1.05)" />
    <World cam={cam}><Defs />
      {/* base board on the bench, two posts, the top bar with its screws */}
      <rect x={L - 40} y={base} width={Rp - L + 110} height={34} rx={4} fill="#4A2E1A" /><rect x={L - 40} y={base} width={Rp - L + 110} height={7} fill="#8A5A34" />
      <rect x={L} y={topY} width={30} height={base - topY} fill="#5A3A22" /><rect x={L + 22} y={topY} width={8} height={base - topY} fill="#2E1C10" />
      <rect x={Rp} y={topY} width={30} height={base - topY} fill="#5A3A22" /><rect x={Rp} y={topY} width={8} height={base - topY} fill="#A06A3C" />
      <rect x={L - 30} y={topY - 34} width={Rp - L + 90} height={40} rx={5} fill="#6B4528" /><rect x={L - 30} y={topY - 34} width={Rp - L + 90} height={9} fill="#B07A48" />
      {Array.from({length: 7}, (_, i) => { const x = L + 110 + i * 105, p = strip(0.12 + i * 0.13); return <g key={i}>
        <rect x={x - 9} y={topY - 66} width={18} height={34} rx={3} fill="#B08A4A" /><rect x={x - 18} y={topY - 78} width={36} height={12} rx={4} fill="#E2BE74" />
        <line x1={x} y1={topY + 6} x2={p.x} y2={p.y} stroke="#F6EBD0" strokeWidth={2} opacity={0.9} /></g>; })}
      {/* the crank on the right post */}
      <circle cx={Rp + 15} cy={1610} r={26} fill="#B08A4A" /><rect x={Rp + 13} y={1584} width={60} height={10} rx={4} fill="#8A6A3A" /><circle cx={Rp + 73} cy={1589} r={11} fill="#D9B46A" />
      {/* the cradle and the scroll lying in it, end towards us */}
      <path d={`M${sc.x - 30},${base} L${sc.x + 10},${sc.y + 30} L${sc.x + 270},${sc.y + 30} L${sc.x + 310},${base} Z`} fill="#3A2416" />
      <rect x={sc.x} y={sc.y - sc.r} width={sc.len} height={sc.r * 2} rx={sc.r} fill="#1A1412" />
      <ellipse cx={sc.x} cy={sc.y} rx={sc.r * 0.5} ry={sc.r} fill="#2A201B" /><Spiral cx={sc.x} cy={sc.y} r0={4} r1={sc.r * 0.45} turns={7} squash={2} color="#5A4A3E" w={2.4} seed="pg" />
      {/* the opened strip, lifting off the top of the roll, its edge caught by the candle */}
      <path d={`M${strip(0).x},${strip(0).y + 8} ${Array.from({length: 21}, (_, i) => { const p = strip(i / 20); return `L${p.x},${p.y}`; }).join(' ')} ${Array.from({length: 21}, (_, i) => { const p = strip(1 - i / 20); return `L${p.x + 14},${p.y + 62}`; }).join(' ')} Z`} fill="#2B2420" stroke="#D9964E" strokeWidth={3} />
      {Array.from({length: 12}, (_, i) => { const p = strip(0.08 + i * 0.075); return <rect key={i} x={p.x + 4} y={p.y + 18 + (i % 2) * 14} width={18} height={4} rx={2} fill="#0E0B0A" />; })}
      {/* flakes on the base */}
      {Array.from({length: 18}, (_, i) => <rect key={`k${i}`} x={sc.x + 80 + R('kx', i) * 420} y={base - 6 - R('ky', i) * 8} width={6 + R('kw', i) * 12} height={4} fill="#241C18" transform={`rotate(${R('kr', i) * 40 - 20} ${sc.x + 80 + R('kx', i) * 420} ${base - 6})`} />)}
      {/* Piaggio in the foreground, backlit by the candle behind him */}
      <Priest x={2650} y={2300} s={2.6} flip rim="#F2B85A" rimW={6} light="back" shade={0.5} />
    </World>
    <Dark lights={[{...toScreen(cam, 2000, 1450), r: 900, a: 1}, {...toScreen(cam, 2680, 1350), r: 500, a: 1}]} a={0.42} />
    <Glow {...toScreen(cam, 2680, 1300)} r={420 * flick(t, 8, 0.06)} color={GOLD} a={0.45} />
    <MonoBadge mono="AP" name="ANTONIO PIAGGIO" role="priest and inventor" y={60} side="left" />
    <Kind t={t} text="Illustration" /><Grain /><Vignette a={0.55} /></AbsoluteFill>; };

// 9. Chapter IV: Brent Seales at the screen; the scan of a sealed scroll
const F_Scan = ({t}) => { const cam = {x: 2080, y: 1050, z: 0.62}, scr = {x: 1240, y: 470, w: 1720, h: 830};
  return <AbsoluteFill style={{background: '#060A16'}}>
    <BG cam={cam} src="lab" filter="brightness(0.7) saturate(1.05)" />
    <World cam={cam}><Defs />
      <rect x={scr.x} y={scr.y} width={scr.w} height={scr.h} fill="#04121C" />
      {/* the CT slice: the spiral, ghostly cyan, a scan line sweeping */}
      <Spiral cx={scr.x + 560} cy={scr.y + 420} r0={12} r1={330} turns={22} squash={0.72} color={CYAN} w={3.2} glow={CYAN} seed="ct" />
      <rect x={scr.x + 180} y={scr.y + 420 + 240 * Math.sin(t)} width={780} height={4} fill="#E8FDFF" opacity={0.7} />
      {/* the 3D stack on the right */}
      {Array.from({length: 18}, (_, i) => <ellipse key={i} cx={scr.x + 1300} cy={scr.y + 170 + i * 30} rx={240} ry={70} fill="none" stroke={CYAN} strokeWidth={2} opacity={0.15 + 0.5 * (i / 17)} />)}
      <text x={scr.x + 40} y={scr.y + 60} fill={CYAN} fontFamily="JetBrains Mono" fontSize={30} opacity={0.8}>SLICE 0412 / 1920</text>
    </World>
    <Glow {...toScreen(cam, scr.x + 860, scr.y + 420)} r={900} color="#3FB7D9" a={0.35} />
    <svg width={1920} height={1080} style={{position: 'absolute'}}><BackView x={1250} y={1290} s={2.4} rim="#7FE3F0" /></svg>
    <Chapter t={1} at={0} dur={99} n="IV" title="The man who wouldn't cut" />
    <MonoBadge mono="BS" name="BRENT SEALES" role="computer scientist · University of Kentucky" y={250} />
    <Kind t={t} text="Illustration · scan view schematic" /><Grain /><Vignette a={0.55} /></AbsoluteFill>; };

// 10. Virtual unwrapping: one layer followed round the spiral and laid flat
const F_Unwrap = ({t}) => { const cx = 560, cy = 540, turns = 9, r1 = 300;
  const N = 300, pts = Array.from({length: N + 1}, (_, i) => { const u = 0.55 + 0.25 * (i / N), a = u * turns * 2 * Math.PI, r = 20 + (r1 - 20) * u; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8]; });
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 50%, #0B2233 0%, #050B14 70%)'}}>
    <svg width={1920} height={1080} style={{position: 'absolute'}}><Defs />
      <Spiral cx={cx} cy={cy} r0={20} r1={r1} turns={turns} squash={0.8} color="#2B6C80" w={4} seed="uw" />
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={GOLD} strokeWidth={7} style={{filter: 'drop-shadow(0 0 10px #F2B85A)'}} />
      <path d={`M${pts[N][0]},${pts[N][1]} C980,320 1040,330 1120,360`} stroke={GOLD} strokeWidth={3} strokeDasharray="8 10" fill="none" />
      {/* the flattened layer */}
      <g transform="translate(1120,300)"><rect width={680} height={460} fill="#1E1A17" stroke={GOLD} strokeWidth={2} />
        {Array.from({length: 3}, (_, c) => Array.from({length: 16}, (_, l) => <rect key={`${c}-${l}`} x={30 + c * 220} y={30 + l * 26} width={170 * (0.6 + 0.4 * R('uf' + c, l))} height={8} rx={3} fill="#3A322C" />))}
        <rect width={680} height={460} fill="url(#papyrusFibres)" opacity={0.2} /></g>
    </svg>
    <div style={{position: 'absolute', left: 1120, top: 785, fontFamily: MO, fontSize: 16, letterSpacing: 3, color: '#C9A27A'}}>ONE LAYER, LAID FLAT</div>
    <div style={{position: 'absolute', left: 330, top: 120, fontFamily: MO, fontSize: 16, letterSpacing: 3, color: '#7FB7C9'}}>THE SCAN: A SLICE THROUGH THE ROLL</div>
    <Lexicon t={1} at={0} dur={99} n={2} term="Virtual unwrapping" def="Unrolling a scroll on a computer, from a scan." />
    <Kind t={t} text="Schematic" /><Grain a={0.07} /><Vignette a={0.45} /></AbsoluteFill>; };

// 11. The crackle and the first word: porphyras, purple. Ink shows as a crackle texture; the model lights it purple.
const F_Purple = ({t}) => { const letters = 'ΠΟΡΦΥΡΑΣ'.split(''), X0 = 352, DX = 174, BASE = 640, FS = 230;
  const strips = Array.from({length: 44}, (_, i) => ({y: i * 25 + R('sy', i) * 8, h: 14 + R('sh', i) * 16, c: ['#1E1612', '#261B15', '#191310', '#2C2019'][Math.floor(R('sc', i) * 4)]}));
  const crack = (seed, n, x0, y0, w, h) => Array.from({length: n}, (_, i) => { let x = x0 + R(seed + 'x', i) * w, y = y0 + R(seed + 'y', i) * h, d = `M${x.toFixed(1)},${y.toFixed(1)}`;
    for (let k = 0; k < 4; k++) { const a = R(seed + 'a' + k, i) * Math.PI * 2, l = 6 + R(seed + 'l' + k, i) * 14; x += Math.cos(a) * l; y += Math.sin(a) * l; d += ` L${x.toFixed(1)},${y.toFixed(1)}`; } return d; });
  const inside = crack('in', 900, 300, 400, 1400, 280), outside = crack('out', 260, 0, 120, 1920, 860);
  return <AbsoluteFill style={{background: '#120D0B'}}>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <defs><mask id="ltr"><rect width={1920} height={1080} fill="#000" />{letters.map((ch, i) => <text key={i} x={X0 + i * DX} y={BASE} textAnchor="middle" fontFamily="Georgia, 'DejaVu Serif', serif" fontSize={FS} fill="#fff">{ch}</text>)}</mask>
        <radialGradient id="vig2" cx="0.5" cy="0.5" r="0.7"><stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.7" /></radialGradient></defs>
      {/* the carbonised sheet: horizontal fibre strips over vertical ones */}
      {strips.map((st, i) => <rect key={i} x={0} y={st.y} width={1920} height={st.h} fill={st.c} />)}
      {Array.from({length: 60}, (_, i) => <rect key={`v${i}`} x={i * 33 + R('vx', i) * 10} y={0} width={4 + R('vw', i) * 5} height={1080} fill="#0C0907" opacity={0.18} />)}
      {outside.map((d, i) => <path key={i} d={d} stroke="#3E332C" strokeWidth={1.6} fill="none" />)}
      {/* the ink: a fine crackle only where the letters are */}
      <g mask="url(#ltr)"><rect width={1920} height={1080} fill="#2E2621" />{inside.map((d, i) => <path key={i} d={d} stroke="#857166" strokeWidth={2} fill="none" />)}
        <rect width={1920} height={1080} fill={PURPLE} opacity={0.55} /></g>
      <g mask="url(#ltr)" style={{filter: 'blur(14px)'}}><rect x={250} y={400} width={1450} height={300} fill="#9B4DFF" opacity={0.55} /></g>
      {/* the model's detection boxes on the letters it found first */}
      {[1, 3, 5].map((i) => <g key={i}><rect x={X0 + i * DX - 82} y={BASE - 190} width={164} height={230} fill="none" stroke={CYAN} strokeWidth={2.4} strokeDasharray="10 6" />
        <text x={X0 + i * DX - 78} y={BASE - 198} fill={CYAN} fontFamily="JetBrains Mono" fontSize={18}>{(0.82 + i * 0.03).toFixed(2)}</text></g>)}
      <rect width={1920} height={1080} fill="url(#vig2)" />
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center', fontFamily: SI, fontSize: 60, color: '#E7CCFF'}}>porphyras · <span style={{color: CREAM}}>purple</span></div>
    <MonoBadge mono="LF" name="LUKE FARRITOR" role="student, from Nebraska" y={60} />
    <Kind t={t} text="Schematic" /><Grain /><Vignette a={0.4} /></AbsoluteFill>; };

// 12. Chapter VI: the battered core on the beamline in Grenoble
const F_Beam = ({t}) => { const cam = {x: 1920, y: 1180, z: 0.6}, core = {x: 1920, y: 1760};
  return <AbsoluteFill style={{background: '#050B18'}}>
    <BG cam={cam} src="hall" filter="brightness(0.68) saturate(1.1)" />
    <World cam={cam}><Defs />
      <polygon points={`1920,1060 ${core.x - 26},${core.y - 40} ${core.x + 26},${core.y - 40}`} fill="url(#beam)" opacity={0.9} style={{filter: 'blur(3px)'}} />
      <rect x={core.x - 140} y={core.y + 50} width={280} height={180} rx={10} fill="#22324A" /><rect x={core.x - 170} y={core.y + 30} width={340} height={30} rx={6} fill="#5A6E8A" />
      <rect x={core.x - 30} y={core.y - 10} width={60} height={50} fill="#9AA8BA" />
      {/* the core: a small black stub */}
      <rect x={core.x - 70} y={core.y - 120} width={140} height={110} rx={40} fill="#14100E" />
      <ellipse cx={core.x} cy={core.y - 120} rx={70} ry={24} fill="#2A201B" />
      <Spiral cx={core.x} cy={core.y - 120} r0={4} r1={60} turns={8} squash={0.34} color="#4A3A30" w={2.4} seed="bc" />
    </World>
    <Glow {...toScreen(cam, core.x, core.y - 80)} r={260} color={CYAN} a={0.75} />
    <Glow {...toScreen(cam, 1920, 1060)} r={420} color="#FFFFFF" a={0.5} />
    <Chapter t={1} at={0} dur={99} n="VI" title="Read without touching" />
    <DateTag t={1} at={0} dur={99} text="GRENOBLE · SCAN" x={72} y={150} />
    <DateTag t={1} at={0} dur={99} text="NAPLES · PHerc. 1667" x={1500} y={760} />
    <Kind t={t} text="Illustration" /><Grain /><Vignette a={0.55} /></AbsoluteFill>; };

// 13. End: the lump again, its words glowing through the cracks
const F_End = ({t}) => { const cam = {x: 2150, y: 1000, z: 0.56};
  const gl = 'ΗΔΟΝΗΦΥΣΙΣΘΕΟΙΛΟΓΟΣΨΥΧΗ'.split('');
  return <AbsoluteFill style={{background: '#0A0807'}}>
    <BG cam={cam} src="lump" filter="brightness(0.6) saturate(1.05)" />
    <World cam={cam}>
      {gl.map((c, i) => { const u = i / gl.length, x = 1700 + u * 1650, y = 760 - u * 360 + Math.sin(i * 1.7) * 80 + 120;
        return <text key={i} x={x} y={y} fontFamily="Georgia, serif" fontSize={70 + R('gs', i) * 40} fill={GOLD} opacity={0.65 + 0.35 * R('go', i)} style={{filter: 'drop-shadow(0 0 12px #F2B85A)'}}>{c}</text>; })}
      <ellipse cx={1360} cy={1080} rx={258} ry={278} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.4} style={{filter: 'blur(6px)'}} />
    </World>
    <Glow {...toScreen(cam, 2500, 700)} r={900} color={GOLD} a={0.35} />
    <Motes n={70} seed="en" color="#FCE3B4" />
    <Kind t={t} text="Illustration" /><Grain /><Vignette a={0.6} /></AbsoluteFill>; };

export const FRAMES = [F_Lump, F_Book, F_Title, F_Villa, F_Room, F_Erupt, F_Tunnel, F_Piaggio, F_Scan, F_Unwrap, F_Purple, F_Beam, F_End];
export const ScrollsFrames = () => { const f = useCurrentFrame(), C = FRAMES[f] || FRAMES[0]; return <AbsoluteFill><C t={2.4 + f * 0.37} /></AbsoluteFill>; };
