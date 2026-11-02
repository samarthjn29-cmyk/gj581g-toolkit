// S8 "Banknote" kit for The Dollar Yardstick (pilot, 2 Nov 2026): ground, engraved frames, portrait ovals, pay slips, footage windows, captions.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender} from 'remotion';
import timing from './data/timing.json';

export const FPS = 30;
export const C = {ground: '#EFE9DA', paper: '#F7F3E8', green: '#24493A', ox: '#7A2333', gold: '#B98B2E', ink: '#1C2422', line: '#E2DAC6', mute: '#8A8070', grey: '#B9B2A2'};
export const OS = "'Oswald', 'Inter', sans-serif", FR = "'Fraunces', Georgia, serif", FI = "'FrauncesI', Georgia, serif", IN = "'Inter', sans-serif", MO = "'JetBrains Mono', monospace";

const FONTS = [['Fraunces', 'fraunces-latin-400-normal.woff2', '400'], ['Fraunces', 'fraunces-latin-700-normal.woff2', '700'], ['FrauncesI', 'fraunces-latin-400-italic.woff2', '400'],
  ['FrauncesI', 'fraunces-latin-700-italic.woff2', '700'], ['Oswald', 'oswald-latin-500-normal.woff2', '500'], ['Oswald', 'oswald-latin-700-normal.woff2', '700'],
  ['Inter', 'Inter.ttf', '100 900'], ['JetBrains Mono', 'JetBrainsMono.ttf', '100 800']];
if (typeof document !== 'undefined') { const h = delayRender('fonts');
  Promise.all(FONTS.map(([fam, file, weight]) => new FontFace(fam, `url(${staticFile(`fonts/${file}`)})`, {weight}).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }

// ---- timing: seconds of a line, or of a word inside a line (k = which occurrence)
const L = Object.fromEntries(timing.lines.map((l) => [l.id, l]));
export const t0 = (id) => L[id].start;
// aligned word times (clone + Whisper) when present; otherwise estimated from character position
export const tw = (id, word, k = 0) => { const l = L[id]; const key = word.toLowerCase();
  if (l.words) { const hits = l.words.filter((w) => w[0].startsWith(key)); if (hits.length > k) return hits[k][1]; throw new Error(`cue word "${word}" (${k}) not heard in ${id}`); }
  const ws = l.text.split(' '); let n = -1, idx = 0;
  ws.forEach((w, i) => { if (n < k && w.toLowerCase().replace(/[^a-z0-9-']/g, '').startsWith(key)) { n++; if (n === k) idx = i; } });
  if (n < k) throw new Error(`cue word "${word}" (${k}) not in ${id}`);
  const chars = ws.map((w) => w.length + 1); const before = chars.slice(0, idx).reduce((a, b) => a + b, 0); const tot = chars.reduce((a, b) => a + b, 0);
  return l.start + (l.end - l.start) * before / tot; };
export const fr = (s) => Math.round(s * FPS);
export const TOTAL = timing.total;
export const LINES = timing.lines;

// ---- motion
export const ease = (f, a, d = 12) => interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0.8, 0.2, 1)});
export const pop = (f, a, d = 10) => { const p = ease(f, a, d); return {opacity: p, transform: `translateY(${(1 - p) * 24}px)`}; };
export const stampIn = (f, a) => { const p = ease(f, a, 6); return {opacity: p, transform: `scale(${1.6 - 0.6 * p}) rotate(-7deg)`}; };

// ---- engraved geometry
export const rosette = (cx, cy, R, r, d, n = 1100) => { let p = ''; for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI * 2 * r;
  const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t), y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t); p += (i ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y.toFixed(1); } return p; };
export const wave = (x, y, w, h, k, ph, n = 160) => { let p = ''; for (let i = 0; i <= n; i++) { const xx = x + (w * i) / n; const yy = y + h / 2 + (h / 2) * Math.sin((i / n) * Math.PI * k + ph); p += (i ? ' L ' : 'M ') + xx.toFixed(1) + ' ' + yy.toFixed(1); } return p; };
export const zig = (x, y, w, h, n = 30, d = 12) => { let p = `M ${x} ${y}`; for (let i = 0; i <= n; i++) p += ` L ${x + (w * i) / n} ${y + (i % 2 ? d : 0)}`; p += ` L ${x + w} ${y + h}`;
  for (let i = n; i >= 0; i--) p += ` L ${x + (w * i) / n} ${y + h - (i % 2 ? d : 0)}`; return p + ' Z'; };

// security-paper ground with a slow drift
export const Ground = () => { const f = useCurrentFrame();
  return <AbsoluteFill style={{background: C.ground}}>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      {Array.from({length: 28}, (_, i) => <path key={i} d={wave(-40, 0 + i * 40, 2000, 30, 9, i * 0.5 + f * 0.012)} stroke={C.line} strokeWidth="1.2" fill="none" />)}
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(60,45,20,0.16) 100%)'}} />
  </AbsoluteFill>; };

export const Grain = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain0.png')})`, backgroundSize: '384px 384px',
  backgroundPosition: `${(f * 37) % 384}px ${(f * 53) % 384}px`, opacity: 0.18, mixBlendMode: 'multiply', pointerEvents: 'none'}} />; };

// an engraved note frame (SVG pieces; put inside an <svg>)
export const NoteFrame = ({x, y, w, h, color = C.green, draw = 1, fill = C.paper, micro = true}) => <g opacity={draw}>
  <rect x={x} y={y} width={w} height={h} rx="18" fill={fill} stroke={color} strokeWidth="3" />
  <rect x={x + 16} y={y + 16} width={w - 32} height={h - 32} rx="12" fill="none" stroke={color} strokeWidth="1" />
  {micro && Array.from({length: 8}, (_, i) => <path key={i} d={wave(x + 30, y + 26 + (i % 2) * 6, w - 60, 14, Math.round(w / 18), i)} stroke={color} strokeWidth="0.8" fill="none" opacity="0.45" />)}
  {micro && Array.from({length: 8}, (_, i) => <path key={'b' + i} d={wave(x + 30, y + h - 46 + (i % 2) * 6, w - 60, 14, Math.round(w / 18), i)} stroke={color} strokeWidth="0.8" fill="none" opacity="0.45" />)}
  {[[x + 44, y + 44], [x + w - 44, y + 44], [x + 44, y + h - 44], [x + w - 44, y + h - 44]].map(([cx, cy], i) => <g key={i}>
    <circle cx={cx} cy={cy} r="20" fill={fill} stroke={color} strokeWidth="1.5" /><path d={rosette(cx, cy, 17, 5, 7, 300)} stroke={color} strokeWidth="0.6" fill="none" /></g>)}
</g>;

// portrait oval with a guilloché ring; children = SVG portrait drawn around (cx, cy)
let _id = 0;
export const Portrait = ({cx, cy, rx, ry, color = C.green, ring = C.gold, children, bg = '#E9E1CC'}) => { const id = `po${cx}_${cy}_${rx}`;
  return <g>
    {[0, 1].map((k) => <ellipse key={k} cx={cx} cy={cy} rx={rx + 26 - k * 10} ry={ry + 26 - k * 10} fill="none" stroke={k ? ring : color} strokeWidth={k ? 1 : 2} />)}
    {Array.from({length: 46}, (_, i) => { const a = (i / 46) * Math.PI * 2; return <ellipse key={i} cx={cx + Math.cos(a) * (rx + 13)} cy={cy + Math.sin(a) * (ry + 13)} rx="7" ry="4.5"
      transform={`rotate(${(a * 180) / Math.PI} ${cx + Math.cos(a) * (rx + 13)} ${cy + Math.sin(a) * (ry + 13)})`} fill="none" stroke={color} strokeWidth="0.8" opacity="0.8" />; })}
    <defs><clipPath id={id}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} /></clipPath></defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={bg} />
    <g clipPath={`url(#${id})`}>
      {Array.from({length: Math.ceil(ry * 2 / 9)}, (_, i) => <line key={i} x1={cx - rx} x2={cx + rx} y1={cy - ry + i * 9} y2={cy - ry + i * 9} stroke={color} strokeWidth="0.7" opacity="0.18" />)}
      {children}
    </g>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={color} strokeWidth="2.5" />
  </g>; };

// HTML text helper
export const T = ({x, y, children, s = 40, f = IN, w = 700, c = C.ink, a = 'left', ls = 0, style}) => <div style={{position: 'absolute', left: x, top: y, fontFamily: f, fontWeight: w, fontSize: s, color: c, textAlign: a,
  letterSpacing: ls, whiteSpace: 'nowrap', lineHeight: 1.05, ...style, transform: `${a === 'center' ? 'translateX(-50%)' : a === 'right' ? 'translateX(-100%)' : ''} ${(style && style.transform) || ''}`.trim() || 'none'}}>{children}</div>;

// typed-on text (mono)
export const Typed = ({text, at, f, cps = 26, ...rest}) => { const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps / FPS)));
  return f < at ? null : <T f={MO} {...rest}>{text.slice(0, n)}</T>; };

// stamp (HTML)
export const Stamp = ({x, y, children, color = C.ox, f, at, s = 38, bg}) => f < at ? null : <div style={{position: 'absolute', left: x, top: y, padding: '8px 22px', border: `5px solid ${color}`, color,
  fontFamily: OS, fontWeight: 700, fontSize: s, letterSpacing: 3, whiteSpace: 'nowrap', borderRadius: 6, ...stampIn(f, at), transformOrigin: 'center', mixBlendMode: bg ? 'normal' : 'multiply', background: bg || 'transparent'}}>{children}</div>;

// footage inside an engraved window, graded to the palette, line-screen on top
export const Window = ({x, y, w, h, src, from = 0, rate = 1, f, at, tint = C.green, push = 0}) => { const p = ease(f, at, 14); const drift = interpolate(f - at, [0, 300], [1.12, 1.0], {extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 14, overflow: 'hidden', opacity: p, transform: `scale(${0.86 + 0.14 * p + push})`, boxShadow: '0 14px 30px rgba(40,30,10,0.25)'}}>
    <OffthreadVideo src={staticFile(src)} muted startFrom={fr(from)} playbackRate={rate} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${drift})`, filter: 'grayscale(1) contrast(1.15) brightness(1.15)'}} />
    <div style={{position: 'absolute', inset: 0, background: tint, mixBlendMode: 'color', opacity: 0.55}} />
    <div style={{position: 'absolute', inset: 0, background: C.paper, mixBlendMode: 'multiply', opacity: 0.35}} />
    <div style={{position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(28,36,34,0.22) 0px, rgba(28,36,34,0.22) 1.5px, transparent 1.5px, transparent 5px)`, mixBlendMode: 'multiply'}} />
    <div style={{position: 'absolute', inset: 0, border: `3px solid ${tint}`, borderRadius: 14}} />
    <div style={{position: 'absolute', inset: 10, border: `1px solid ${C.paper}`, borderRadius: 8, opacity: 0.8}} />
  </div>; };

// burnt-in captions: the current line, word highlighted
export const Captions = () => { const f = useCurrentFrame(); const s = f / FPS; const l = LINES.find((x) => s >= x.start - 0.05 && s <= x.end + 0.25);
  if (!l) return null; const ws = l.text.split(' ');
  const k = l.words && l.words.length === ws.length ? Math.max(0, l.words.filter((w) => w[1] <= s).length - 1) : Math.floor(((s - l.start) / (l.end - l.start)) * ws.length);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 990, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: 'rgba(28,36,34,0.88)', padding: '8px 22px', borderRadius: 10, fontFamily: IN, fontWeight: 650, fontSize: 38, color: C.ground, whiteSpace: 'nowrap'}}>
      {(() => { const kk = Math.min(Math.max(k, 0), ws.length - 1); const N = 8; const a = Math.floor(kk / N) * N; const part = ws.slice(a, a + N);  // at most 8 words on screen (long lines ran off the frame)
        return part.map((w, j) => <span key={a + j} style={{color: a + j === kk ? '#E2B65A' : C.ground}}>{w}{j < part.length - 1 ? ' ' : ''}</span>); })()}
    </div></div>; };
