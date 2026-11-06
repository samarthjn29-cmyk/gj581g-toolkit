// VW: the vector-world kit (7 Nov 2026, Sam: "only vector animation videos from now on", Emergence-style).
// One wide illustrated set per story, built from depth layers; a camera travels over it with parallax;
// practical lights glow and flicker; grain and vignette sit on top; a fixed device system labels the facts.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender, random} from 'remotion';

export const FPS = 30;
export const SR = "'Cormorant', Georgia, serif", SI = "'CormorantI', Georgia, serif", IN = "'Inter', sans-serif", MO = "'JetBrains Mono', monospace";
const FONTS = [['Cormorant', 'cormorant-garamond-latin-500-normal.woff2', '500'], ['Cormorant', 'cormorant-garamond-latin-600-normal.woff2', '600'],
  ['CormorantI', 'cormorant-garamond-latin-500-italic.woff2', '500'], ['CormorantI', 'cormorant-garamond-latin-600-italic.woff2', '600'],
  ['Inter', 'Inter.ttf', '100 900'], ['JetBrains Mono', 'JetBrainsMono.ttf', '100 800']];
if (typeof document !== 'undefined') { const h = delayRender('fonts');
  Promise.all(FONTS.map(([f, file, w]) => new FontFace(f, `url(${staticFile(`fonts/${file}`)})`, {weight: w}).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }

export const useT = () => useCurrentFrame() / FPS;           // seconds inside the current Sequence
export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const ramp = (t, a, b, from = 0, to = 1, e = ease) => interpolate(t, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

// ---- camera: keys [{t, x, y, z}] (world point at the frame centre, zoom); eased between keys
export const camAt = (keys, t) => {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1];
    if (t <= b.t) { const u = ease((t - a.t) / (b.t - a.t || 1)); return {x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, z: a.z + (b.z - a.z) * u}; } }
  return keys[keys.length - 1];
};
// a layer at depth p (1 = the main plane, <1 farther away, >1 nearer): world coords -> screen with parallax
export const Layer = ({cam, p = 1, children, style}) => {
  const z = cam.z * p, tx = 960 - cam.x * z, ty = 540 - cam.y * z;
  return <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${z})`, ...style}}>{children}</div>;
};
export const toScreen = (cam, x, y, p = 1) => ({x: 960 + (x - cam.x) * cam.z * p, y: 540 + (y - cam.y) * cam.z * p});

// ---- light
export const flick = (t, seed = 1, amt = 0.12) => 1 + amt * (0.55 * Math.sin(t * 9.1 + seed) + 0.3 * Math.sin(t * 23.7 + seed * 3) + 0.15 * (random(`f${seed}-${Math.floor(t * 12)}`) - 0.5) * 2);
export const Glow = ({x, y, r, color, a = 1, blend = 'screen'}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', mixBlendMode: blend, opacity: a,
    background: `radial-gradient(circle, ${color} 0%, ${color}88 22%, ${color}22 50%, transparent 70%)`}} />);
// darkness everywhere except pools of light (screen-space): lights [{x, y, r, a}]
export const Dark = ({lights, color = '#07050A', a = 0.9}) => {
  const g = lights.map((l) => `radial-gradient(circle at ${l.x}px ${l.y}px, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${l.r * 0.25}px, rgba(0,0,0,${(1 - (l.a ?? 1)).toFixed(2)}) ${l.r}px)`);
  return <AbsoluteFill style={{background: color, opacity: a, mixBlendMode: 'multiply', WebkitMaskImage: g.join(','), WebkitMaskComposite: 'source-in', maskComposite: 'intersect'}} />;
};
export const Grain = ({a = 0.09}) => { const f = useCurrentFrame();
  return <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain0.png')})`, backgroundPosition: `${(f * 37) % 300}px ${(f * 53) % 300}px`, opacity: a, mixBlendMode: 'overlay'}} />; };
export const Vignette = ({a = 0.55}) => <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${a}) 100%)`}} />;
export const Motes = ({n = 26, x0 = 0, y0 = 0, w = 1920, h = 1080, color = '#F6C77A', seed = 's'}) => { const t = useT();
  return <>{Array.from({length: n}, (_, i) => { const r = (k) => random(`${seed}${i}${k}`);
    const x = x0 + ((r(1) * w + t * (8 + r(2) * 14)) % w), y = y0 + ((r(3) * h - t * (5 + r(4) * 10) + h * 10) % h), s = 1.5 + r(5) * 3;
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: color, opacity: 0.25 + 0.5 * Math.abs(Math.sin(t * (0.6 + r(6)) + i))}} />; })}</>; };

// ---- devices (our own system, not Emergence's): chapter mark, lexicon card, medallion badge, kind label, date tag
const fade = (t, at, dur, inn = 0.5, out = 0.5) => Math.min(ramp(t, at, at + inn), 1 - ramp(t, at + dur - out, at + dur));
export const Chapter = ({t, at = 0.3, dur = 4.5, n, title}) => { const o = fade(t, at, dur, 0.6, 0.8), dx = (1 - ramp(t, at, at + 0.9)) * -18;
  return <div style={{position: 'absolute', left: 72, top: 64, display: 'flex', alignItems: 'center', gap: 18, opacity: o, transform: `translateX(${dx}px)`}}>
    <div style={{width: 54, height: 54, borderRadius: '50%', border: '1.5px solid #E9B66A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SR, fontWeight: 600, fontSize: 30, color: '#F4DDB0'}}>{n}</div>
    <div style={{width: interpolate(ramp(t, at + 0.2, at + 1.1), [0, 1], [0, 70]), height: 1.5, background: '#E9B66A88'}} />
    <div style={{fontFamily: IN, fontWeight: 600, fontSize: 19, letterSpacing: 6, color: '#F4DDB0', textTransform: 'uppercase'}}>{title}</div></div>; };
export const Lexicon = ({t, at, dur = 5, n, term, def}) => { const o = fade(t, at, dur), dy = (1 - ramp(t, at, at + 0.7)) * 20;
  return <div style={{position: 'absolute', left: 72, bottom: 84, width: 560, opacity: o, transform: `translateY(${dy}px)`, display: 'flex'}}>
    <div style={{width: 4, background: '#E39A3A', borderRadius: 2}} />
    <div style={{padding: '16px 24px', background: 'rgba(14,10,9,0.72)', backdropFilter: 'blur(4px)'}}>
      <div style={{fontFamily: MO, fontSize: 15, letterSpacing: 3, color: '#C9A27A'}}>LEXICON · {String(n).padStart(2, '0')}</div>
      <div style={{fontFamily: SI, fontWeight: 600, fontSize: 52, color: '#FBE3B0', lineHeight: 1.05, marginTop: 4}}>{term}</div>
      <div style={{fontFamily: IN, fontSize: 21, color: '#E8D6BC', lineHeight: 1.35, marginTop: 6}}>{def}</div></div></div>; };
export const Badge = ({t, at, dur = 5, img, name, role, dates, side = 'right', y = 300}) => { const o = fade(t, at, dur), s = 0.92 + 0.08 * ramp(t, at, at + 0.8);
  return <div style={{position: 'absolute', [side]: 80, top: y, display: 'flex', flexDirection: side === 'right' ? 'row-reverse' : 'row', alignItems: 'center', gap: 22, opacity: o, transform: `scale(${s})`, transformOrigin: side === 'right' ? 'right center' : 'left center'}}>
    <div style={{width: 170, height: 170, borderRadius: '50%', overflow: 'hidden', border: '2px solid #E9B66A', boxShadow: '0 0 0 7px rgba(14,10,9,0.6), 0 0 0 8.5px #E9B66A55', background: '#2E1C14'}}>
      <Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
    <div style={{textAlign: side === 'right' ? 'right' : 'left', background: 'rgba(14,10,9,0.55)', padding: '10px 16px'}}>
      <div style={{fontFamily: SR, fontWeight: 600, fontSize: 44, color: '#FBE3B0', letterSpacing: 4}}>{name}</div>
      <div style={{fontFamily: IN, fontSize: 19, color: '#E8D6BC', marginTop: 2}}>{role}</div>
      <div style={{fontFamily: MO, fontSize: 16, color: '#C9A27A', marginTop: 6, letterSpacing: 2}}>{dates}</div></div></div>; };
export const Kind = ({t, at = 0, dur = 999, text}) => <div style={{position: 'absolute', right: 72, bottom: 60, opacity: fade(t, at, dur, 0.6, 0.4) * 0.85,
  fontFamily: MO, fontSize: 15, letterSpacing: 3, color: '#D9C2A0', textTransform: 'uppercase'}}>{text}</div>;
export const DateTag = ({t, at, dur = 4, text, x, y}) => <div style={{position: 'absolute', left: x, top: y, opacity: fade(t, at, dur), fontFamily: MO, fontSize: 18, letterSpacing: 3,
  color: '#FBE3B0', border: '1px solid #E9B66A99', padding: '6px 12px', background: 'rgba(14,10,9,0.55)'}}>{text}</div>;

// ---- people as flat silhouettes from a small joint rig (degrees; 0 = pointing right, 90 = down)
const P = (x, y, a, l) => [x + Math.cos(a * Math.PI / 180) * l, y + Math.sin(a * Math.PI / 180) * l];
export const Figure = ({x, y, s = 1, pose, fill = '#120C0A', rim = '#E39A3A', rimDx = -3, rimA = 0.9, flip = false, hold = null}) => {  // hold: drawn at the front wrist
  // pose: {torso, head, ua1, fa1, ua2, fa2, th1, sh1, th2, sh2}; hip at (0,0); a slim adult about 300 units tall standing
  const q = {torso: -90, ua1: 100, fa1: 80, ua2: 80, fa2: 100, th1: 95, sh1: 90, th2: 85, sh2: 90, head: 0, ...pose};
  const T = 112, Sh = P(0, 0, q.torso, T - 10), N = P(0, 0, q.torso, T + 4), Hd = P(...N, q.torso + q.head, 26);
  const E1 = P(...Sh, q.ua1, 58), W1 = P(...E1, q.fa1, 54), E2 = P(...Sh, q.ua2, 58), W2 = P(...E2, q.fa2, 54);
  const K1 = P(0, 0, q.th1, 84), A1 = P(...K1, q.sh1, 82), K2 = P(0, 0, q.th2, 84), A2 = P(...K2, q.sh2, 82);
  const rot = q.torso + 90;
  const limb = (pts, w1, w2, c) => <><polyline points={`${pts[0]} ${pts[1]}`} stroke={c} strokeWidth={w1} /><polyline points={`${pts[1]} ${pts[2]}`} stroke={c} strokeWidth={w2} /></>;
  const body = (c, dx) => <g fill="none" stroke={c} strokeLinecap="round" strokeLinejoin="round" transform={`translate(${dx},0)`}>
    {limb([[0, 0], K2, A2], 26, 19, c)}{limb([Sh, E2, W2], 16, 13, c)}
    <path d="M-21,4 C-25,-38 -31,-78 -30,-98 Q-27,-110 -12,-113 L12,-113 Q27,-110 30,-98 C31,-78 25,-38 21,4 Z" fill={c} stroke="none" transform={`rotate(${rot})`} />
    <polyline points={`${Sh} ${N}`} stroke={c} strokeWidth={15} />
    {limb([[0, 0], K1, A1], 26, 19, c)}{limb([Sh, E1, W1], 16, 13, c)}
    <circle cx={Hd[0]} cy={Hd[1]} r={22} fill={c} stroke="none" /></g>;
  return <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>{hold && <g transform={`translate(${W1[0]},${W1[1]})`}>{hold}</g>}{rim && <g opacity={rimA}>{body(rim, rimDx * (flip ? -1 : 1))}</g>}{body(fill, 0)}</g>;
};
export const POSE = {
  seated: {torso: -82, head: 8, th1: -18, sh1: 98, th2: -24, sh2: 100, ua1: 30, fa1: -20, ua2: 25, fa2: -15},
  stand: {torso: -90, head: 0, th1: 92, sh1: 90, th2: 88, sh2: 90, ua1: 95, fa1: 92, ua2: 85, fa2: 88},
  carry: {torso: -86, head: -4, th1: 100, sh1: 92, th2: 82, sh2: 90, ua1: -20, fa1: -80, ua2: -10, fa2: -70},
  shield: {torso: -96, head: 22, th1: 98, sh1: 92, th2: 80, sh2: 88, ua1: -150, fa1: 60, ua2: 120, fa2: 95},
  climb: {torso: -60, head: -10, th1: 40, sh1: 110, th2: 120, sh2: 80, ua1: 10, fa1: -30, ua2: 150, fa2: 110},
  slump: {torso: -100, head: 35, th1: 92, sh1: 92, th2: 86, sh2: 92, ua1: 100, fa1: 85, ua2: 82, fa2: 95},
};
// a head-and-shoulders seen from behind (foreground of the prisoner's-view shot)
export const Back = ({x, y, s = 1, fill = '#0E0907', rim = '#E39A3A', tilt = 0}) => { const d = "M-150,0 C-150,-70 -95,-104 -50,-114 C-46,-128 -44,-138 -46,-146 C-62,-150 -66,-168 -58,-176 C-72,-214 -60,-262 -20,-280 C12,-292 50,-282 64,-252 C76,-226 70,-196 60,-178 C70,-170 66,-150 50,-146 C48,-136 48,-126 52,-114 C98,-104 150,-70 150,0 Z";
  return <g transform={`translate(${x},${y}) scale(${s}) rotate(${tilt})`}><path d={d} fill={rim} opacity={0.8} transform="translate(-4,-3)" /><path d={d} fill={fill} /></g>; };
