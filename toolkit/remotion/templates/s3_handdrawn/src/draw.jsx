// S3 hand-drawn kit (Decked out Data, first built for Tokens, Nov 2026): wobbly ink strokes that draw on with the voice,
// hand-written text that writes on, rough boxes and circles, rubber stamps, the warm paper page.
// Everything is SVG in a 1920x1080 coordinate space (px), drawn in the identity sheet's colours.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, spring} from 'remotion';
import {C, f, prog, FPS, HAND, MONO} from './lib';

// seeded random so a drawing looks the same on every frame
export const rng = (seed) => { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };

// a smooth wobbly path through points, jittered by amp px
export const wob = (pts, seed = 1, amp = 2.2, closed = false) => {
  const r = rng(seed); const P = pts.map(([x, y]) => [x + (r() - 0.5) * 2 * amp, y + (r() - 0.5) * 2 * amp]);
  if (closed) P.push(P[0]);
  let d = `M ${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for (let i = 1; i < P.length; i++) { const [x0, y0] = P[i - 1], [x1, y1] = P[i]; const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    d += ` Q ${x0.toFixed(1)} ${y0.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`; }
  const L = P[P.length - 1]; return d + ` L ${L[0].toFixed(1)} ${L[1].toFixed(1)}`;
};
// points along a line, so long straight edges wobble gently
const seg = (x0, y0, x1, y1, n = 6) => Array.from({length: n + 1}, (_, i) => [x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]);
export const rectPath = (x, y, w, h, seed = 1, amp = 2.4) => wob([...seg(x, y, x + w, y), ...seg(x + w, y, x + w, y + h).slice(1), ...seg(x + w, y + h, x, y + h).slice(1), ...seg(x, y + h, x, y + 2).slice(1)], seed, amp);
export const ellPath = (cx, cy, rx, ry, seed = 1, amp = 2.5, turns = 1.06) => { const n = 28; const pts = [];
  for (let i = 0; i <= n * turns; i++) { const a = -Math.PI / 2 + i / n * 2 * Math.PI; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return wob(pts, seed, amp); };
export const linePath = (x0, y0, x1, y1, seed = 1, amp = 2) => wob(seg(x0, y0, x1, y1, Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 60))), seed, amp);

// full-frame SVG layer
export const Hatches = () => <defs>
  {[['l', 45, C.ink, 9], ['d', 45, C.ink, 5], ['x', 135, C.ink, 9]].map(([k, ang, col, gap]) => <pattern key={k} id={`hatch-${k}`} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${ang})`}>
    <line x1={0} y1={0} x2={0} y2={gap} stroke={col} strokeWidth={1.4} opacity={0.35} /></pattern>)}
</defs>;
export const Sheet = ({children, style}) => <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}><Hatches />{children}</svg>;

// a stroke that draws on from `at` over `dur` seconds (pathLength trick: no measuring needed)
export const Ink = ({d, at = 0, dur = 0.6, color = C.ink, w = 5, fill = 'none', fillAt, fillOpacity = 1, out, dash, shadow = true, shade}) => {
  const fr = useCurrentFrame(); const p = prog(fr, at, dur); if (fr < f(at)) return null;
  const fo = fill !== 'none' ? (fillAt != null ? prog(fr, fillAt, 0.35) : p) * fillOpacity : 0;
  const o = out != null ? 1 - prog(fr, out, 0.4) : 1;
  return <g opacity={o}>
    {fill !== 'none' && shadow && <path d={d} fill={C.ink} opacity={fo * 0.13} stroke="none" transform="translate(7 9)" />}
    {fill !== 'none' && <path d={d} fill={fill} opacity={fo} stroke="none" />}
    {fill !== 'none' && shade && <path d={d} fill={`url(#hatch-${shade})`} opacity={fo * 0.55} stroke="none" />}
    <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={dash || '1 1'} strokeDashoffset={dash ? 0 : 1 - p} style={dash ? {opacity: p} : undefined} />
  </g>;
};

// hand-written text that writes on left to right
export const Hand = ({x, y, text, at = 0, dur, size = 56, color = C.ink, weight = 700, anchor = 'start', font = HAND, out, rotate = 0}) => {
  const fr = useCurrentFrame(); const D = dur != null ? dur : Math.min(0.8, 0.08 + text.length * 0.032); const p = prog(fr, at, D);
  if (fr < f(at)) return null; const o = out != null ? 1 - prog(fr, out, 0.4) : 1;
  const tx = anchor === 'middle' ? '-50%' : anchor === 'end' ? '-100%' : '0';
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(${tx}, -50%) rotate(${rotate}deg)`, fontFamily: font, fontWeight: weight, fontSize: size, color,
    whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -2%)`, opacity: o, lineHeight: 1.1}}>{text}</div>;
};
export const Mono = (props) => <Hand font={MONO} weight={600} {...props} />;

// rubber stamp: lands big and settles with a slight ink spread
export const Stamp = ({x, y, text, sub, at, color = C.negative, size = 64, rotate = -8, w}) => {
  const fr = useCurrentFrame(); const t = fr - f(at); if (t < 0) return null;
  const sp = spring({frame: t, fps: FPS, config: {damping: 13, stiffness: 220, mass: 0.6}}); const sc = 1.9 - 0.9 * sp;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${sc})`, opacity: Math.min(1, t / 3),
    border: `7px solid ${color}`, borderRadius: 14, padding: '10px 30px 12px', color, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: 4, textAlign: 'center', width: w,
    background: 'rgba(250,247,240,0.55)'}}>
    {text}{sub && <div style={{fontSize: size * 0.42, letterSpacing: 1, fontWeight: 600, marginTop: 2}}>{sub}</div>}
  </div>;
};

// pop-in wrapper for groups of SVG shapes (scale from a centre point)
export const PopG = ({at, cx, cy, children, from = 0.6}) => { const fr = useCurrentFrame(); const t = fr - f(at); if (t < 0) return null;
  const sp = spring({frame: t, fps: FPS, config: {damping: 12, stiffness: 180, mass: 0.6}}); const s = from + (1 - from) * sp;
  return <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`} opacity={Math.min(1, t / 4)}>{children}</g>; };

// the warm paper page (Panel colour + paper fibre), with a slow camera drift so the page is never frozen
export const Page = ({children, drift = 0.015}) => { const fr = useCurrentFrame(); const s = 1 + drift * Math.min(1, fr / (20 * FPS));
  return <AbsoluteFill style={{background: C.panel}}>
    <Img src={staticFile('paper.jpg')} style={{position: 'absolute', width: '100%', height: '100%', opacity: 0.45, mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(80,55,30,0.16) 100%)'}} />
    <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>
  </AbsoluteFill>; };

// simple figure (our own design: round head, body as one stroke), drawn on
export const Figure = ({x, y, s = 1, at = 0, seed = 3, color = C.ink, slump = 0}) => {
  const hx = x, hy = y - 150 * s + slump * 18 * s;
  return <>
    <Ink at={at} dur={0.4} d={ellPath(hx, hy, 30 * s, 32 * s, seed)} w={5} />
    <Ink at={at + 0.25} dur={0.5} d={wob([[hx, hy + 34 * s], [x + slump * 6, y - 40 * s], [x, y + 40 * s]], seed + 1, 1.5)} w={5} />
    <Ink at={at + 0.45} dur={0.4} d={wob([[x - 60 * s, y - 30 * s + slump * 30], [x, y - 80 * s + slump * 12], [x + 55 * s, y - 40 * s + slump * 30]], seed + 2, 1.5)} w={5} />
    <Ink at={at + 0.6} dur={0.4} d={wob([[x - 40 * s, y + 130 * s], [x, y + 40 * s], [x + 40 * s, y + 130 * s]], seed + 3, 1.5)} w={5} />
  </>;
};
