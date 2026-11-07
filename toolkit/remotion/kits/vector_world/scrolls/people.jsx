// Scrolls cast (7 Nov 2026, Sam: "the characters should be designed in a much better way and placed thoughtfully").
// Flat-vector people in profile: skin, hair, clothes in their own colours, a cel shadow on the side away from the light,
// a rim of the scene's light on the lit edge, small faces (eye, brow, nose, lips), props in the hands.
// Design space: facing right, feet at (0,0), about 400 units tall. Scale with s, mirror with flip.
import React from 'react';
import {flick} from '../cave/vw.jsx';

let UID = 0;
// parts: [{d, fill}] drawn in order. light: 'front' (the side the person faces) or 'back'. rim: colour of the light.
export const Person = ({x, y, s = 1, flip = false, parts, details = null, props = null, rim = '#F2B85A', rimW = 5, light = 'front', shade = 0.42, shadeCol = '#0B0710', id}) => {
  const k = id || `p${UID++}`, sx = flip ? -s : s, rx = light === 'front' ? rimW : -rimW;
  // the shadow half-plane in design space: everything behind a slanted terminator
  const term = light === 'front' ? 'M-400,-500 L2,-500 L-14,40 L-400,40 Z' : 'M400,-500 L6,-500 L22,40 L400,40 Z';
  return <g transform={`translate(${x},${y}) scale(${sx},${s})`}>
    <defs><clipPath id={`c${k}`}>{parts.map((p, i) => <path key={i} d={p.d} transform={p.t} />)}</clipPath></defs>
    <g transform={`translate(${rx},-2)`}>{parts.map((p, i) => p.fill !== 'none' && <path key={i} d={p.d} fill={rim} transform={p.t} />)}</g>
    {parts.map((p, i) => <path key={i} d={p.d} fill={p.fill} transform={p.t} />)}
    <g clipPath={`url(#c${k})`}><path d={term} fill={shadeCol} opacity={shade} /></g>
    {details}{props}</g>; };

// ---------- shared head (profile, facing right). bow: degrees the head tips forward.
const SKIN = '#C98E66', SKIN_D = '#A26A4C';
const head = ({hair = '#3A2E28', beard = null, bow = 0, cap = null, hat = null}) => {
  const R = `rotate(${bow} 2 -322)`;
  return {parts: [
    {d: 'M-14,-318 L-14,-338 C-24,-352 -27,-374 -22,-390 C-16,-404 0,-410 14,-404 C24,-398 28,-386 28,-376 L29,-370 C33,-366 36,-360 34,-357 L29,-355 C30,-352 30,-350 28,-348 C29,-346 28,-344 26,-342 C25,-338 22,-334 16,-332 C10,-331 6,-330 4,-326 L4,-318 Z', fill: SKIN, t: R},
    hair && {d: 'M-25,-370 C-28,-392 -12,-411 8,-409 C21,-407 29,-397 29,-386 C20,-392 8,-394 -2,-389 C-6,-382 -10,-370 -12,-356 C-19,-356 -24,-362 -25,-370 Z', fill: hair, t: R},
    beard && {d: 'M3,-324 C0,-336 4,-348 12,-350 L27,-343 C29,-334 27,-322 19,-314 C11,-308 3,-312 3,-324 Z', fill: beard, t: R},
    cap && {d: 'M-18,-398 C-12,-410 6,-413 18,-405 L14,-400 C4,-404 -8,-403 -16,-396 Z', fill: cap, t: R},
    hat && {d: 'M-34,-392 L38,-397 L30,-405 C22,-420 -14,-423 -26,-406 Z', fill: hat, t: R},
  ].filter(Boolean), details: <g transform={R}>
    <ellipse cx={-5} cy={-366} rx={4} ry={6.5} fill={SKIN_D} />
    <circle cx={20} cy={-371} r={2.2} fill="#1A100C" /><path d="M14,-378 L25,-377" stroke={hair || '#3A2E28'} strokeWidth={2.4} strokeLinecap="round" />
    <path d="M26,-346 L22,-346" stroke="#7A3E30" strokeWidth={1.6} /></g>}; };
// Person draws parts without per-part transforms, so heads with a bow are wrapped: return parts with a <g> transform via details

// ---------- 1. a Roman scholar standing, reading an open scroll held in both hands
export const RomanReader = ({hairCol = '#8A8580', ...p}) => { const h = head({hair: hairCol, beard: '#A8A29C', bow: 14});
  const body = [
    {d: 'M-22,-150 C-26,-110 -24,-76 -20,-50 C-18,-30 -17,-20 -17,-14 L-23,-3 L-3,0 L-5,-12 C-4,-40 -2,-80 -4,-150 Z', fill: SKIN_D},                       // far leg
    {d: 'M-26,1 L1,1 L1,-5 L-26,-5 Z', fill: '#5A3A22'},
    {d: 'M-4,-150 C-6,-110 0,-80 2,-50 C3,-30 2,-20 2,-14 L-2,-3 L27,0 L25,-8 L17,-13 C18,-40 22,-80 20,-150 Z', fill: SKIN},
    {d: 'M-4,1 L29,1 L29,-5 L-4,-5 Z', fill: '#6B4528'},
    {d: 'M-26,-320 C-42,-312 -48,-280 -46,-240 L-44,-146 C-20,-140 10,-140 34,-146 L36,-240 C38,-280 32,-308 16,-320 Z', fill: '#E3D3B2'},   // tunic
    {d: 'M-22,-322 C-46,-316 -54,-282 -52,-232 L-50,-128 C-30,-120 -6,-120 8,-126 L4,-170 C14,-196 26,-224 32,-252 L20,-258 C10,-236 -2,-216 -12,-200 C-16,-246 -10,-292 -2,-322 Z', fill: '#8E3B2E'},  // mantle
    {d: 'M-6,-300 C-20,-280 -30,-250 -32,-210', fill: 'none'},
    {d: 'M0,-302 C6,-282 9,-264 9,-252 C18,-254 33,-263 43,-271 L48,-263 C36,-249 18,-239 6,-239 C-2,-247 -5,-272 -7,-298 Z', fill: SKIN},  // near arm
  ];
  return <Person {...p} parts={[...body, ...h.parts]} details={<g>{h.details}
    <path d="M-40,-280 C-34,-240 -30,-200 -34,-150" stroke="#632418" strokeWidth={3} fill="none" opacity={0.7} /><path d="M18,-252 C6,-232 -4,-214 -10,-196" stroke="#632418" strokeWidth={3} fill="none" opacity={0.7} /></g>}
    props={<g transform="rotate(-10 44 -268)">
      <rect x={40} y={-298} width={64} height={52} fill="#EAD7AE" /><rect x={40} y={-298} width={64} height={52} fill="#C9A46A" opacity={0.25} />
      {[0, 1, 2, 3, 4, 5].map((l) => <rect key={l} x={46} y={-292 + l * 8} width={26 - (l % 2) * 6} height={3} rx={1.5} fill="#4A3424" />)}
      {[0, 1, 2, 3, 4, 5].map((l) => <rect key={`b${l}`} x={78} y={-292 + l * 8} width={20 - (l % 3) * 4} height={3} rx={1.5} fill="#4A3424" />)}
      <rect x={34} y={-304} width={9} height={64} rx={4.5} fill="#6B4528" /><rect x={101} y={-304} width={9} height={64} rx={4.5} fill="#6B4528" />
      <ellipse cx={42} cy={-268} rx={8} ry={9} fill={SKIN} /><ellipse cx={104} cy={-266} rx={7} ry={8} fill={SKIN_D} /></g>} />; };

// ---------- 2. a Roman scholar walking, a closed scroll in the hand
export const RomanWalker = (p) => { const h = head({hair: '#2E2420', beard: '#2E2420', bow: 2});
  const body = [
    {d: 'M-16,-150 C-24,-110 -30,-70 -32,-40 L-36,-18 L-44,-4 L-24,0 L-20,-14 C-16,-50 -6,-100 4,-150 Z', fill: SKIN_D},
    {d: 'M-46,1 L-20,1 L-20,-5 L-46,-5 Z', fill: '#5A3A22'},
    {d: 'M-2,-150 C8,-110 18,-70 22,-40 L26,-16 L24,-4 L52,0 L50,-8 L40,-14 C38,-50 30,-100 22,-150 Z', fill: SKIN},
    {d: 'M22,1 L54,1 L54,-5 L22,-5 Z', fill: '#6B4528'},
    {d: 'M-26,-320 C-42,-312 -48,-280 -46,-240 L-48,-146 C-20,-138 14,-138 38,-146 L36,-240 C38,-280 32,-308 16,-320 Z', fill: '#E3D3B2'},
    {d: 'M-22,-322 C-46,-316 -56,-282 -54,-232 L-54,-126 C-32,-118 -6,-118 10,-124 L6,-170 C16,-196 28,-224 34,-252 L22,-258 C12,-236 0,-216 -10,-200 C-14,-246 -8,-292 0,-322 Z', fill: '#2F4A6B'},
    {d: 'M2,-302 C8,-276 12,-246 18,-214 L28,-216 C24,-248 18,-280 12,-304 Z', fill: SKIN},
  ];
  return <Person {...p} parts={[...body, ...h.parts]} details={<g>{h.details}<path d="M20,-252 C8,-232 -2,-214 -8,-196" stroke="#1C2E45" strokeWidth={3} fill="none" opacity={0.7} /></g>}
    props={<g><rect x={-6} y={-222} width={70} height={18} rx={9} fill="#EAD7AE" transform="rotate(-14 24 -212)" /><ellipse cx={23} cy={-211} rx={8} ry={9} fill={SKIN} /></g>} />; };

// ---------- 3. a digger, 1752: tricorn, long coat, waistcoat, breeches, stockings; torch raised
const coatBody = (coat, vest) => [
  {d: 'M-26,-190 L-30,-128 L-12,-126 L-8,-190 Z', fill: '#3A3530'}, {d: 'M-30,-128 C-32,-90 -28,-50 -26,-14 L-10,-14 C-10,-50 -8,-90 -10,-128 Z', fill: '#BDB39C'}, {d: 'M-31,-14 L-8,-14 L2,-4 L2,1 L-33,1 Z', fill: '#141010'},
  {d: 'M-6,-190 L-2,-128 L18,-128 L20,-190 Z', fill: '#3A3530'}, {d: 'M-4,-128 C-4,-90 -2,-50 0,-14 L18,-14 C18,-50 22,-90 18,-128 Z', fill: '#D4CAB2'}, {d: 'M-3,-14 L18,-14 L33,-4 L33,1 L-5,1 Z', fill: '#141010'},
  {d: 'M-24,-318 C-40,-310 -46,-280 -44,-240 L-48,-136 L-22,-148 L-16,-200 L18,-200 L22,-148 L36,-146 L32,-240 C34,-280 28,-310 12,-318 Z', fill: coat},
  {d: 'M12,-302 L31,-290 L30,-206 L14,-206 Z', fill: vest}, {d: 'M3,-324 L18,-319 L16,-300 L7,-302 Z', fill: '#EDE6D6'}];
export const DiggerTorch = ({t = 0, coat = '#5E4330', ...p}) => { const h = head({hair: '#4A3628', bow: -6, hat: '#18130F'});
  const body = [...coatBody(coat, '#8A6A3A'), {d: 'M0,-308 C14,-313 28,-307 38,-297 L58,-338 L71,-329 L48,-285 C40,-277 24,-283 10,-291 Z', fill: coat}, {d: 'M56,-342 L72,-332 L68,-326 L52,-336 Z', fill: '#EDE6D6'}];
  return <Person {...p} parts={[...body, ...h.parts]} details={<g>{h.details}<path d="M-22,-354 L-34,-336" stroke="#18130F" strokeWidth={5} strokeLinecap="round" />{[0, 1, 2, 3].map((i) => <circle key={i} cx={28} cy={-280 + i * 20} r={2.2} fill="#D9B46A" />)}</g>}
    props={<g transform="translate(66,-336)"><ellipse cx={0} cy={0} rx={9} ry={10} fill={SKIN} /><line x1={-4} y1={30} x2={8} y2={-110} stroke="#3A2416" strokeWidth={9} strokeLinecap="round" />
      <rect x={-2} y={-128} width={20} height={22} rx={4} fill="#2A1A10" /><Flame x={8} y={-126} s={1} t={t} /></g>} />; };

// ---------- 4. a digger crouching to lift a lump of carbonised papyrus
export const DiggerCrouch = ({coat = '#4E3A2C', ...p}) => { const h = head({hair: '#2E2420', bow: 38, hat: '#18130F'});
  const body = [
    {d: 'M-16,-118 L-60,-30 L-70,-6 L-52,-2 L-40,-24 L4,-104 Z', fill: '#3A3530'}, {d: 'M-74,-8 L-46,-8 L-44,1 L-78,1 Z', fill: '#141010'},          // back leg kneeling
    {d: 'M-8,-120 L40,-118 L44,-100 L-4,-96 Z', fill: '#3A3530'}, {d: 'M30,-112 L44,-104 L40,-14 L24,-14 Z', fill: '#D4CAB2'}, {d: 'M22,-14 L42,-14 L58,-4 L58,1 L20,1 Z', fill: '#141010'},  // front leg
    {d: 'M-30,-120 C-34,-160 -20,-210 6,-248 C18,-262 36,-266 48,-256 L58,-236 C40,-206 26,-170 22,-128 L14,-90 L-26,-86 Z', fill: coat},          // torso leaning
    {d: 'M44,-250 C58,-224 66,-180 70,-120 L58,-118 C52,-170 44,-210 32,-236 Z', fill: coat}, {d: 'M56,-124 L72,-122 L72,-114 L56,-116 Z', fill: '#EDE6D6'}];
  // the head sits forward at the top of the leaning torso
  return <Person {...p} parts={[...body, ...h.parts.map((q) => ({...q, t: `translate(46,96) ${q.t}`}))]} details={<g transform="translate(46,96)">{h.details}</g>}
    props={<g transform="translate(66,-106) rotate(-30)"><ellipse cx={0} cy={0} rx={9} ry={10} fill={SKIN} /><rect x={-6} y={4} width={62} height={30} rx={14} fill="#17110E" /><ellipse cx={-4} cy={19} rx={7} ry={14} fill="#2E241E" /></g>} />; };

// ---------- 5. Antonio Piaggio: a priest in a black cassock, white collar, skullcap, reaching to turn a knob
export const Priest = (p) => { const h = head({hair: '#B9B2AA', bow: 4, cap: '#141018'});
  const body = [
    {d: 'M-28,-320 C-46,-310 -52,-276 -50,-236 C-52,-160 -58,-80 -64,0 L50,0 C44,-80 38,-160 36,-236 C38,-278 32,-310 14,-320 Z', fill: '#1E1B26'},
    {d: 'M-6,-306 C12,-300 36,-284 62,-268 L80,-258 L74,-244 L56,-252 C30,-264 8,-276 -10,-284 Z', fill: '#262233'},
    {d: 'M74,-262 L84,-256 L78,-244 L70,-250 Z', fill: '#F2EEE6'},
    {d: 'M-2,-326 L18,-322 L17,-312 L-2,-314 Z', fill: '#F2EEE6'}];
  return <Person {...p} parts={[...body, ...h.parts]} details={<g>{h.details}{Array.from({length: 9}, (_, i) => <circle key={i} cx={30 - i * 0.4} cy={-296 + i * 28} r={2} fill="#3A3448" />)}</g>}
    props={<g><ellipse cx={86} cy={-248} rx={9} ry={9} fill={SKIN} /></g>} />; };

// ---------- 6. a researcher seen from behind (no likeness): hair, ears, collar, shoulders, lit by the screen
export const BackView = ({x, y, s = 1, rim = '#7FE3F0'}) => <g transform={`translate(${x},${y}) scale(${s})`}>
  <path d="M-150,0 C-150,-70 -95,-104 -48,-112 L-40,-150 L40,-150 L48,-112 C95,-104 150,-70 150,0 Z" fill={rim} transform="translate(0,-4)" opacity={0.85} />
  <path d="M-150,0 C-150,-70 -95,-104 -48,-112 L-40,-150 L40,-150 L48,-112 C95,-104 150,-70 150,0 Z" fill="#1E2B42" />
  <path d="M-46,-112 L-20,-96 L0,-112 L20,-96 L46,-112 L40,-150 L-40,-150 Z" fill="#2B3B58" />
  <ellipse cx={0} cy={-210} rx={66} ry={78} fill={rim} opacity={0.85} transform="translate(0,-4)" />
  <ellipse cx={0} cy={-210} rx={64} ry={76} fill="#9C6B50" />
  <ellipse cx={-64} cy={-200} rx={10} ry={18} fill="#B27C5E" /><ellipse cx={64} cy={-200} rx={10} ry={18} fill="#B27C5E" />
  <path d="M-66,-206 C-70,-262 -40,-292 0,-292 C40,-292 70,-262 66,-206 C60,-180 40,-160 0,-156 C-40,-160 -60,-180 -66,-206 Z" fill="#5A4A40" />
  <path d="M-58,-250 C-30,-270 30,-270 58,-250" stroke="#7A6656" strokeWidth={4} fill="none" opacity={0.6} /></g>;

// a small flame for torches (local copy so this file has no cycle)
export const Flame = ({x, y, s = 1, t, seed = 1}) => { const tongue = (k, w, h, c) => {
    const tip = [Math.sin(t * 5.3 + k + seed) * w * 0.35, -h * (1 + 0.12 * Math.sin(t * 8.7 + k * 1.7))];
    return <path d={`M${-w},0 C${-w},${-h * 0.35} ${tip[0] - w * 0.25},${tip[1] * 0.6} ${tip[0]},${tip[1]} C${tip[0] + w * 0.25},${tip[1] * 0.6} ${w},${-h * 0.35} ${w},0 Q0,${w * 0.5} ${-w},0 Z`} fill={c} />; };
  return <g transform={`translate(${x},${y}) scale(${s * flick(t, seed, 0.08)})`}>{tongue(0, 18, 60, '#C25E36')}{tongue(1.7, 14, 50, '#E39A3A')}{tongue(3.1, 9, 38, '#F2B85A')}{tongue(4.4, 5, 22, '#FBE3B0')}</g>; };

// a soft contact shadow under feet
export const Contact = ({x, y, w = 120, a = 0.35}) => <ellipse cx={x} cy={y} rx={w} ry={w * 0.14} fill="#000" opacity={a} style={{filter: 'blur(6px)'}} />;

// the cast sheet for reviewing the designs at size
export const CastSheet = () => <svg width={1920} height={1080} style={{position: 'absolute', background: '#2A2430'}}>
  <RomanReader x={200} y={900} s={1.9} rim="#F2B85A" />
  <RomanWalker x={520} y={900} s={1.9} rim="#F2B85A" />
  <DiggerTorch x={860} y={900} s={1.9} rim="#E39A3A" t={1} />
  <DiggerCrouch x={1220} y={900} s={1.9} rim="#E39A3A" />
  <Priest x={1560} y={900} s={1.9} rim="#F2B85A" light="back" />
  <BackView x={1800} y={1060} s={0.9} />
</svg>;
