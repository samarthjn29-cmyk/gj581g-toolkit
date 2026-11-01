// Decked out Data, Remotion engine (Blindness). Shared components: layout units, reveals, captions band, grain + paper
// texture (idea 10), paper reveals with highlighter (3), people/dot grids (5), split screens (9), parallax stills (7).
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, interpolate, spring, Easing, delayRender, continueRender} from 'remotion';
import WORDS from './data/words.json';
import SLIDES from './data/slides.json';
import SNIPS from './data/snips.json';

export const FPS = 30;
export const I = 144, PT = 2;
export const f = (s) => Math.round(s * FPS);
export const C = {primary: '#2B1B3F', secondary: '#6E6680', panel: '#F4F1F8', rule: '#DCD6E5', accent: '#7A4FB5', callout: '#E07A5F',
  light: '#C9B6EE', mid: '#4B3A66', lineMedia: '#A89BB8', white: '#FFFFFF', negative: '#B5303A', hl: '#F4C3B5', ink: '#1E1430'};
export const SANS = "'Inter', Arial, sans-serif", HEAD = "'Inter Display', 'Inter', Arial, sans-serif";
export const SD = (n) => SLIDES[n - 1];
export {SNIPS};

// ---------- fonts ----------
const FONT_FILES = [['Inter', 'Inter-Regular', 400, 'normal'], ['Inter', 'Inter-Medium', 500, 'normal'], ['Inter', 'Inter-SemiBold', 600, 'normal'],
  ['Inter', 'Inter-Bold', 700, 'normal'], ['Inter', 'Inter-Italic', 400, 'italic'], ['Inter Display', 'InterDisplay-Bold', 700, 'normal'],
  ['Inter Display', 'InterDisplay-ExtraBold', 800, 'normal'], ['Inter Display', 'InterDisplay-Black', 900, 'normal']];
if (typeof document !== 'undefined' && !window.__fontsLoading) {
  window.__fontsLoading = true;
  const h = delayRender('fonts');
  Promise.all(FONT_FILES.map(([fam, file, weight, style]) => new FontFace(fam, `url(${staticFile(`fonts/${file}.otf`)})`, {weight: String(weight), style}).load().then((x) => document.fonts.add(x))))
    .then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
}

// ---------- narration cues: slide-relative seconds at which a spoken word starts (clip plays from +0.2 s) ----------
const norm = (w) => w.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9'\-]/g, '');
export const cue = (n, word, k = 0, off = 0) => {
  const ws = WORDS[String(n)] || []; const t = norm(word);
  let hits = ws.filter((w) => norm(w.w) === t);
  if (hits.length <= k) hits = ws.filter((w) => norm(w.w).startsWith(t));
  if (hits.length <= k) throw new Error(`cue: "${word}" #${k} not found in VO-${n}`);
  return hits[k].s + 0.2 + off;
};
export const cueEnd = (n, word, k = 0) => { cue(n, word, k); const ws = WORDS[String(n)]; const t = norm(word);
  let hits = ws.filter((w) => norm(w.w) === t); if (hits.length <= k) hits = ws.filter((w) => norm(w.w).startsWith(t)); return hits[k].e + 0.2; };
// Nearest spoken word start to a planned time t (slide seconds), for generated scenes: keeps planned builds on the voice.
export const snapCue = (n, t, maxShift = 1.5) => { const ws = WORDS[String(n)] || []; let best = null;
  for (const w of ws) { const s = w.s + 0.2; if (best == null || Math.abs(s - t) < Math.abs(best - t)) best = s; }
  return best != null && Math.abs(best - t) <= maxShift ? best : t; };
export const voEnd = (n) => { const ws = WORDS[String(n)] || []; return ws.length ? ws[ws.length - 1].e + 0.2 : 0; };

// ---------- motion helpers ----------
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const prog = (fr, at, dur = 0.5, e = ease) => interpolate(fr - f(at), [0, Math.max(1, f(dur))], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const box = (x, y, w, h) => ({position: 'absolute', left: x * I, top: y * I, width: w != null ? w * I : undefined, height: h != null ? h * I : undefined});
export const useSec = () => useCurrentFrame() / FPS;

export const Reveal = ({at, kind = 'up', dur = 0.5, style, children, out}) => {
  const fr = useCurrentFrame(); const p = prog(fr, at, dur); const t = fr - f(at);
  let transform = 'none', clipPath = 'none', opacity = p, filter = 'none';
  if (kind === 'up') transform = `translateY(${(1 - p) * 26}px)`;
  if (kind === 'down') transform = `translateY(${(1 - p) * -26}px)`;
  if (kind === 'left') transform = `translateX(${(1 - p) * -60}px)`;
  if (kind === 'right') transform = `translateX(${(1 - p) * 60}px)`;
  if (kind === 'focus') { filter = p < 1 ? `blur(${(1 - p) * 10}px)` : 'none'; transform = `scale(${1.04 - 0.04 * p})`; }
  if (kind === 'wipe') { clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`; opacity = t < 0 ? 0 : 1; }
  if (kind === 'wipeDown') { clipPath = `inset(0 0 ${(1 - p) * 100}% 0)`; opacity = t < 0 ? 0 : 1; }
  if (kind === 'pop') { const sp = t < 0 ? 0 : spring({frame: t, fps: FPS, config: {damping: 11, stiffness: 170, mass: 0.7}}); transform = `scale(${sp})`; opacity = t < 0 ? 0 : 1; }
  if (out != null) opacity *= 1 - prog(fr, out, 0.4);
  return <div style={{...style, opacity, transform, clipPath, filter}}>{children}</div>;
};

export const Words = ({text, at, dur = 0.9, style}) => {
  const fr = useCurrentFrame(); const ws = text.split(' ');
  return <div style={style}>{ws.map((w, i) => {
    const p = prog(fr, at + (dur - 0.35) * i / Math.max(1, ws.length - 1), 0.35);
    return <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 18}px)`, whiteSpace: 'pre'}}>{w + (i < ws.length - 1 ? ' ' : '')}</span>;
  })}</div>;
};

export const CountUp = ({to, at, dur = 1.0, prefix = '', suffix = '', decimals = 0, sep = false, style}) => {
  const fr = useCurrentFrame(); const p = prog(fr, at, dur); const v = to * p;
  let s = v.toFixed(decimals); if (sep) s = Number(s).toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  return <div style={{...style, opacity: fr < f(at) ? 0 : 1}}>{prefix}{s}{suffix}</div>;
};

// ---------- backgrounds and texture (idea 10) ----------
export const Footage = ({src, drift = 0.04, from = 0, style}) => {
  const fr = useCurrentFrame(); const sc = 1 + drift * fr / (60 * FPS);
  return <AbsoluteFill style={{overflow: 'hidden', background: C.primary, ...style}}>
    <OffthreadVideo src={staticFile(src)} muted startFrom={f(from)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${sc})`}} />
  </AbsoluteFill>;
};
// White slide: warm paper fibre + faint grid + soft vignette
export const PaperBg = () => <AbsoluteFill>
  <Img src={staticFile('paper.jpg')} style={{position: 'absolute', width: '100%', height: '100%'}} />
  <Img src={staticFile('grid.png')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, mixBlendMode: 'multiply'}} />
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(43,27,63,0.07) 100%)'}} />
</AbsoluteFill>;
export const Grain = ({opacity = 0.06}) => { const fr = useCurrentFrame(); const i = Math.floor(fr / 2) % 6;
  return <AbsoluteFill style={{backgroundImage: `url(${staticFile(`grain${i}.png`)})`, backgroundSize: '384px 384px', opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}} />; };
export const Vignette = ({k = 0.35}) => <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(20,10,30,${k}) 100%)`}} />;
export const SHADOW = '0 18px 40px rgba(43,27,63,0.16), 0 3px 8px rgba(43,27,63,0.10)';

// Foreground stage: slide content is laid out on the 13.333 x 7.5 in grid and scaled to 90% so a caption band
// stays clear at the bottom (idea 6). Backgrounds stay full-bleed.
export const STAGE = 0.9;
export const Stage = ({children}) => <AbsoluteFill style={{transform: `scale(${STAGE})`, transformOrigin: '50% 0%', top: 8}}>{children}</AbsoluteFill>;

// ---------- type ----------
export const T = ({x, y, w, h, size, color = C.primary, weight = 400, italic, align, font = SANS, children, style}) =>
  <div style={{...box(x, y, w, h), fontFamily: font, fontSize: size * PT, color, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal',
    textAlign: align || 'left', lineHeight: 1.2, ...style}}>{children}</div>;
export const Brand = ({media}) => <T x={10.73} y={6.9} w={2.0} size={10} color={media ? C.lineMedia : C.secondary} align="right" weight={600}>Decked out Data</T>;
export const Source = ({n, text, media, at = 0}) => { const s = text || SD(n).receipt; return s ? <Reveal at={at} kind="fade"><T x={0.6} y={6.86} w={9.9} size={10} color={media ? C.lineMedia : C.secondary}>{s}</T></Reveal> : null; };
export const Head = ({n, text, tracker, media, at = 0}) => { const d = SD(n); const tr = tracker !== undefined ? tracker : (d.tracker ? `${d.tracker.includes('|') ? d.tracker.split('|').slice(-1)[0].trim() : d.tracker}` : null);
  return <>
    {tr && <Reveal at={at} kind="fade"><T x={0.6} y={0.32} w={12} size={12} color={media ? C.light : C.accent} weight={700} style={{letterSpacing: 1.5, textTransform: 'uppercase'}}>{tr}</T></Reveal>}
    <Words at={at + 0.1} dur={0.8} text={text || d.head} style={{...box(0.6, 0.6, 12.1), fontFamily: HEAD, fontSize: 30 * PT, color: media ? C.white : C.primary, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.12}} />
  </>; };
export const Note = ({x, y, w, text, media, at, size = 11, align}) => <Reveal at={at} kind="fade"><T x={x} y={y} w={w} size={size} italic color={media ? C.lineMedia : C.secondary} align={align}>{text}</T></Reveal>;
export const Pill = ({x, y, w, h = 0.5, text, fill = C.callout, color = C.white, size = 15, at, kind = 'pop', line}) =>
  <Reveal at={at} kind={kind} style={{...box(x, y, w, h), borderRadius: h * I / 2, background: fill, border: line ? `2px solid ${line}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: fill !== 'transparent' ? '0 4px 12px rgba(43,27,63,0.18)' : 'none'}}>
    <span style={{fontFamily: SANS, fontWeight: 700, fontSize: size * PT, color, letterSpacing: 0.5, whiteSpace: 'nowrap'}}>{text}</span></Reveal>;
export const Panel = ({x, y, w, h, at, kind = 'up', fill = C.panel, accent, children, style, dark}) =>
  <Reveal at={at} kind={kind} style={{...box(x, y, w, h), background: dark ? 'rgba(30,20,48,0.72)' : fill, borderLeft: accent ? `${0.06 * I}px solid ${accent}` : 'none', boxShadow: dark ? 'none' : SHADOW, borderRadius: 3, ...style}}>{children}</Reveal>;

// Suspect callback pills: "Suspect n" then the verdict
export const Suspect = ({n, verdict, x, y, at, vAt, fill}) => <>
  <Pill x={x} y={y} w={1.65} h={0.45} size={12} text={`Suspect ${n}`} fill={C.white} color={C.primary} line={C.rule} at={at} />
  <Pill x={x + 1.8} y={y} w={0.13 * verdict.length + 0.6} h={0.45} size={12} text={verdict} fill={fill} at={vAt} />
</>;

// ---------- idea 3: paper reveal with a highlighter sweep ----------
// items: [{src, key}] stacked on one sheet; hlAt = when the highlighter sweeps the key sentence (snippet image).
export const PaperSheet = ({x, y, w, at, rotate = -1.2, push = 0.05, title, snip, hlAt, hlDur = 0.9, pad = 0.28, dur = 20, cite}) => {
  const fr = useCurrentFrame(); const p = prog(fr, at, 0.9); const tIn = fr - f(at);
  const pushP = interpolate(fr, [f(at), f(at + dur)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const innerW = w - 2 * pad;
  const tH = title ? innerW * SNIPS[title].h / SNIPS[title].w : 0;
  const sH = snip ? innerW * SNIPS[snip].h / SNIPS[snip].w : 0;
  const gap = title && snip ? 0.3 : 0;
  const H = pad * 2 + tH + gap + sH + (cite ? 0.38 : 0);
  return <div style={{...box(x, y, w, H), opacity: tIn < 0 ? 0 : Math.min(1, p * 1.6), filter: p < 1 ? `blur(${(1 - p) * 9}px)` : 'none',
    transform: `translateY(${(1 - p) * 70}px) rotate(${rotate * (0.6 + 0.4 * p)}deg) scale(${1 + push * pushP})`, transformOrigin: '30% 40%'}}>
    <div style={{position: 'absolute', inset: 0, background: '#FFFDF9', boxShadow: '0 24px 50px rgba(30,15,45,0.28), 0 4px 10px rgba(30,15,45,0.15)', borderRadius: 2,
      backgroundImage: `url(${staticFile('paper.jpg')})`, backgroundSize: 'cover'}} />
    {title && <Img src={staticFile(`snips/${title}.png`)} style={{position: 'absolute', left: pad * I, top: pad * I, width: innerW * I, mixBlendMode: 'multiply'}} />}
    {snip && <div style={{position: 'absolute', left: pad * I, top: (pad + tH + gap) * I, width: innerW * I, height: sH * I}}>
      {SNIPS[snip].hl.map((r, i, arr) => { const tot = arr.reduce((a, q) => a + (q[2] - q[0]), 0); const before = arr.slice(0, i).reduce((a, q) => a + (q[2] - q[0]), 0);
        const t0 = hlAt + hlDur * before / tot, d = hlDur * (r[2] - r[0]) / tot; const q = prog(fr, t0, d, Easing.inOut(Easing.quad));
        return <div key={i} style={{position: 'absolute', left: `${r[0] * 100}%`, top: `${(r[1] - 0.04) * 100}%`, width: `${(r[2] - r[0]) * 100 * q}%`, height: `${(r[3] - r[1] + 0.08) * 100}%`,
          background: C.hl, opacity: 0.9, borderRadius: 4, transform: 'skewX(-6deg)'}} />; })}
      <Img src={staticFile(`snips/${snip}_plain.png`)} style={{position: 'absolute', left: 0, top: 0, width: '100%', mixBlendMode: 'multiply'}} />
    </div>}
    {cite && <div style={{position: 'absolute', left: pad * I, bottom: pad * 0.6 * I, width: innerW * I, fontFamily: SANS, fontSize: 11 * PT, color: C.secondary, fontStyle: 'italic'}}>{cite}</div>}
  </div>;
};
export const sheetHeight = ({w, title, snip, pad = 0.28, cite}) => { const iw = w - 2 * pad; return pad * 2 + (title ? iw * SNIPS[title].h / SNIPS[title].w : 0) + (title && snip ? 0.3 : 0) + (snip ? iw * SNIPS[snip].h / SNIPS[snip].w : 0) + (cite ? 0.38 : 0); };

// ---------- idea 5: people and dot grids ----------
const seeded = (n, seed = 3) => { const a = Array.from({length: n}, (_, i) => i); let s = seed; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const Person = ({size, color, ring, eye, opacity = 1}) => <svg width={size} height={size * 1.3} viewBox="0 0 10 13" style={{overflow: 'visible', opacity}}>
  {ring && <circle cx="5" cy="7" r="6.6" fill="none" stroke={ring} strokeWidth="0.9" />}
  <circle cx="5" cy="2.9" r="2.4" fill={color} />
  <path d="M0.8 13 V9.4 a4.2 4.2 0 0 1 4.2 -4.2 a4.2 4.2 0 0 1 4.2 4.2 V13 Z" fill={color} />
  {eye && <g transform="translate(5 2.9)"><ellipse rx="1.9" ry="1.15" fill="#fff" /><circle r="0.75" fill={C.primary} /></g>}
</svg>;
// n figures in cols columns; from `dimAt`, `dim` of them fade (random order unless order='end'); `mark` get an eye or ring at markAt
export const People = ({x, y, w, n, cols, at, stagger = 1.0, color = C.accent, dim = 0, dimAt, dimColor = C.rule, mark = 0, markAt, markKind = 'eye', order = 'random', seed = 3, gap = 0.22, onDark}) => {
  const fr = useCurrentFrame(); const cell = w / cols; const s = cell * (1 - gap) * I;
  const perm = order === 'random' ? seeded(n, seed) : Array.from({length: n}, (_, i) => n - 1 - i);
  const dimSet = new Set(perm.slice(0, dim)); const markSet = new Set(perm.slice(dim, dim + mark));
  return <div style={{...box(x, y, w)}}>{Array.from({length: n}, (_, i) => {
    const r = Math.floor(i / cols), c = i % cols; const t0 = at + stagger * (r * cols + c) / n;
    const sp = fr < f(t0) ? 0 : spring({frame: fr - f(t0), fps: FPS, config: {damping: 13, stiffness: 190}});
    const d = dimSet.has(i) && dimAt != null ? prog(fr, dimAt + 0.5 * perm.indexOf(i) / Math.max(1, dim), 0.35) : 0;
    const mk = markSet.has(i) && markAt != null ? prog(fr, markAt + 0.6 * (perm.indexOf(i) - dim) / Math.max(1, mark), 0.3) : 0;
    const col = d > 0 ? mix(color, onDark ? '#5A4C70' : dimColor, d) : color;
    return <div key={i} style={{position: 'absolute', left: c * cell * I, top: r * cell * 1.3 * I, transform: `scale(${sp})`, transformOrigin: '50% 100%'}}>
      <Person size={s} color={col} eye={markKind === 'eye' && mk > 0.5} ring={markKind === 'ring' && mk > 0 ? C.callout : null} opacity={1} />
    </div>; })}</div>;
};
export const peopleHeight = (w, n, cols) => Math.ceil(n / cols) * (w / cols) * 1.3;
export const Dots = ({x, y, w, n, cols, at, dur = 1.5, color = C.accent, r = 0.4}) => {
  const fr = useCurrentFrame(); const cell = w / cols; const shown = Math.floor(n * prog(fr, at, dur, Easing.out(Easing.cubic)));
  return <svg style={{...box(x, y, w, Math.ceil(n / cols) * cell), overflow: 'visible'}} viewBox={`0 0 ${cols} ${Math.ceil(n / cols)}`}>
    {Array.from({length: shown}, (_, i) => <circle key={i} cx={(i % cols) + 0.5} cy={Math.floor(i / cols) + 0.5} r={r} fill={color} />)}</svg>;
};
export const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };

// ---------- idea 9: split screen ----------
export const Split = ({left, right, at = 0, ratio = 0.5, line = C.light}) => {
  const fr = useCurrentFrame(); const p = prog(fr, at, 0.8);
  return <AbsoluteFill>
    <AbsoluteFill style={{clipPath: `inset(0 ${100 - ratio * 100}% 0 0)`, transform: `translateX(${(1 - p) * -40}px)`}}>{left}</AbsoluteFill>
    <AbsoluteFill style={{clipPath: `inset(0 0 0 ${ratio * 100 + (1 - p) * (100 - ratio * 100)}%)`}}>{right}</AbsoluteFill>
    <div style={{position: 'absolute', left: `calc(${ratio * 100}% - 2px)`, top: 0, width: 4, height: `${p * 100}%`, background: line}} />
  </AbsoluteFill>;
};

// ---------- idea 7: 2.5D parallax still (two layers made by toolkit/media/parallax.py) ----------
export const Parallax = ({name, dur, x = 0, y = 0, w = 13.333, h = 7.5, at = 0, dir = 1, depth = 1, fgScale = 1, focus = [0.5, 0.45], tint}) => {
  const fr = useCurrentFrame(); const p = interpolate(fr, [f(at), f(at + dur)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const inP = prog(fr, at, 0.9);
  const bgX = dir * (p - 0.5) * 2.2 * depth, fgX = dir * (p - 0.5) * 5.5 * depth;
  const lay = (src, tx, sc, extra = {}) => <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover',
    objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`, transform: `translateX(${tx}%) scale(${sc})`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`, ...extra}} />;
  return <div style={{...box(x, y, w, h), overflow: 'hidden', background: C.primary}}>
    {lay(`${name}_bg.jpg`, bgX, 1.12 + 0.03 * p, {filter: inP < 1 ? `blur(${(1 - inP) * 6}px)` : 'none'})}
    {lay(`${name}_fg.png`, fgX, (1.1 + 0.08 * p) * fgScale, {filter: inP < 1 ? `blur(${(1 - inP) * 8}px)` : 'none'})}
    {tint && <AbsoluteFill style={{background: tint}} />}
  </div>;
};

// ---------- crossfading scene wrapper ----------
export const FadeIn = ({skip, children}) => { const fr = useCurrentFrame(); const o = skip ? 1 : interpolate(fr, [0, f(0.5)], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)}); return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>; };
