// Stills workflow (8 Nov 2026): one scene = narration + realistic stills + camera moves (+ optional 2.5D layers) + info boxes.
// Props = the timeline.json written by toolkit/stills/build_scene.py, plus `dir` (the scene's folder under public/).
// Shot fields: img (file in dir), move: push | pullback | pan | panL | tilt | drift | hold, focus [x, y] (0-1, where a push
// heads), fade (s of dissolve into this shot; default 0 = cut), layers (folder with far/mid/near.png from stills/layers.py).
// Gags (9 Nov 2026): move 'punch' (snap zoom at punch_at s toward focus, size punch), freeze + freeze_img on video shots,
// gag: true marks the shot for the music dip at the mix. Gags carry no caption or label (Sam: "no labels").
// Cards: kind 'title' (big centred line) or 'info' (term + definition box, e.g. WORD 01 · Papyrus); dur (s, default 4.5).
// No image-source labels on screen (Sam, 8 Nov 2026): credits and the AI disclosure live in the description.
import React from 'react';
import {AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing, delayRender, continueRender} from 'remotion';
// load the real fonts before the first frame (until 10 Nov 2026 the serif silently fell back to Georgia)
const FONTS = [['Cormorant Garamond', 'cormorant-garamond-latin-500-normal.woff2'], ['Kalam', 'Kalam-Regular.ttf'], ['Inter', 'Inter.ttf'], ['JetBrains Mono', 'JetBrainsMono.ttf']];
if (typeof document !== 'undefined' && !window.__zfonts) { window.__zfonts = 1; const h = delayRender('fonts');
  Promise.all(FONTS.map(([f, file]) => new FontFace(f, `url(${staticFile('fonts/' + file)})`).load().then(ff => document.fonts.add(ff)))).then(() => continueRender(h), () => continueRender(h)); }

const ez = Easing.bezier(0.45, 0, 0.25, 1);
const R = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ez});
const lin = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const MOVES = {   // [scale from, scale to, x from, x to, y from, y to] in % of frame
  push: [1.0, 1.12, 0, 0, 0, 0], pullback: [1.14, 1.0, 0, 0, 0, 0], pan: [1.1, 1.1, 3.5, -3.5, 0, 0], panL: [1.1, 1.1, -3.5, 3.5, 0, 0],
  tilt: [1.12, 1.12, 0, 0, 4, -4], tiltDown: [1.12, 1.12, 0, 0, -4, 4], drift: [1.04, 1.09, 1, -1, 0.5, -0.5], hold: [1.03, 1.05, 0, 0, 0, 0],
  vdrift: [1.03, 1.1, 0.6, -0.6, 0, 0],   // footage: a slow push under the clip, so the frame keeps moving through the dissolve
};

// A real document page (Sam, 10 Nov 2026: show the actual paper): the scan on a dark desk, a highlighter sweeping each hl box
// [x0, y0, x1, y1] (0-1 of the page) from hl_at s into the shot, the camera easing in toward the first box (zoom, default 1.7).
const PageShot = ({s, t, dir}) => {
  const hl = s.hl || [], a = s.t + (s.hl_at ?? 0.6), [bx0, by0, bx1, by1] = hl[0] || [0.3, 0.3, 0.7, 0.4];
  const z = 1 + ((s.zoom ?? 1.7) - 1) * R(t, s.t + 0.2, s.t + Math.max(1.2, Math.min(s.dur, 3.2)));
  const H = 1000, W = H * (s.aspect || 2 / 3), L = (1920 - W) / 2, T = 40;
  const cx = L + W * (bx0 + bx1) / 2, cy = T + H * (by0 + by1) / 2;
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a241d 0%, #120f0c 75%)'}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${cx}px ${cy}px`}}>
      <div style={{position: 'absolute', left: L, top: T, width: W, height: H, boxShadow: '0 30px 80px rgba(0,0,0,0.6)', transform: `rotate(${s.tiltDeg ?? -0.8}deg)`}}>
        <Img src={staticFile(`${dir}/${s.page}`)} style={{width: '100%', height: '100%', filter: 'sepia(0.25) contrast(1.05)'}} />
        {hl.map(([x0, y0, x1, y1], i) => { const p = R(t, a + i * 0.9, a + i * 0.9 + 0.85); return p <= 0 ? null :
          <div key={i} style={{position: 'absolute', left: `${x0 * 100}%`, top: `${(y0 - 0.004) * 100}%`, width: `${(x1 - x0) * 100 * p}%`, height: `${(y1 - y0 + 0.008) * 100}%`, background: 'rgba(255, 205, 60, 0.55)', mixBlendMode: 'multiply', borderRadius: 3}} />; })}
      </div></div></AbsoluteFill>;
};

// Diagrams (Sam, 10 Nov 2026): simple drawn explainers in the film's palette. Event words are found in the aligned narration
// after the shot starts (wt). Types: springs (finished relaxes / interrupted stays pulled), bars2 (two bars), share (a share vs chance).
const INK = '#F3EBDD', GOLD = '#C9A86A', DIM = '#8C8273', SERIF = '"Cormorant Garamond", Georgia, serif', SANS = 'Inter, sans-serif';
const wt = (words, w, after, k = 0) => { const n = x => x.toLowerCase().replace(/[^a-z0-9]/g, ''); const h = words.filter(x => x[1] >= after - 0.05 && n(x[0]).startsWith(n(w))); return h[k] ? h[k][1] : after + 1; };
const coil = (x, y0, len, turns = 9, amp = 34, wob = 0) => { let d = `M ${x} ${y0}`; const n = turns * 16;
  for (let i = 1; i <= n; i++) { const f = i / n; d += ` L ${x + Math.sin(f * turns * 2 * Math.PI) * amp + wob * Math.sin(i)} ${y0 + f * len}`; } return d; };
const Diagram = ({s, t, words}) => { const g = s.diagram, a = R(t, s.t, s.t + 0.6);
  const lab = (x, y, txt, o = 1, size = 44, col = INK) => <text x={x} y={y} textAnchor="middle" fill={col} opacity={o} style={{fontFamily: SERIF, fontSize: size}}>{txt}</text>;
  let body = null;
  if (g.type === 'springs') { const tr = wt(words, g.relax || 'relaxes', s.t), tp = wt(words, g.pull || 'pulled', s.t);
    const rl = R(t, tr, tr + 0.9), shake = t > tp ? Math.sin(t * 40) * 2.2 * Math.max(0, 1 - (t - tp) / 2.5) : 0;
    const L1 = 560 - 300 * rl, L2 = 560;
    body = <>{/* finished */}<line x1={560} y1={140} x2={760} y2={140} stroke={DIM} strokeWidth={8} />
      <path d={coil(660, 140, L1, 9, 34)} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" opacity={a} />
      <circle cx={660} cy={140 + L1} r={16} fill={INK} opacity={a} />{lab(660, 950, g.left || 'finished', a)}
      {/* interrupted */}<line x1={1160} y1={140} x2={1360} y2={140} stroke={DIM} strokeWidth={8} />
      <path d={coil(1260 + shake, 140, L2, 9, 22)} fill="none" stroke={GOLD} strokeWidth={6} strokeLinejoin="round" opacity={a} />
      <circle cx={1260 + shake} cy={140 + L2} r={16} fill={GOLD} opacity={a} />
      <path d={`M ${1260 + shake} ${716} L ${1260 + shake} ${800}`} stroke={GOLD} strokeWidth={5} opacity={a * R(t, tp, tp + 0.4)} markerEnd="url(#arr)" />
      {lab(1260, 950, g.right || 'interrupted', a, 44, GOLD)}</>; }
  if (g.type === 'bars2') { const tb = wt(words, g.grow || s.word || '', s.t), p = R(t, tb, tb + 1.1), H = 560, base = 840, [v1, v2] = g.values, mx = Math.max(v1, v2);
    const bar = (x, v, col, txt, num) => <><rect x={x - 110} y={base - H * v / mx * p} width={220} height={H * v / mx * p} fill={col} opacity={a} />{lab(x, base + 70, txt, a, 44, col)}
      {num && lab(x, base - H * v / mx - 28, num, R(t, tb + 0.9, tb + 1.4), 56, col)}</>;
    body = <><line x1={480} y1={base} x2={1440} y2={base} stroke={DIM} strokeWidth={3} />{bar(760, v1, INK, g.labels[0], (g.shown || [])[0])}{bar(1160, v2, GOLD, g.labels[1], (g.shown || [])[1])}
      {g.title && lab(960, 130, g.title, a, 52)}</>; }
  if (g.type === 'share') { const ts = wt(words, g.grow || 'two', s.t), tc = wt(words, g.chanceWord || 'chance', s.t), p = R(t, ts, ts + 1.2), W = 1100, x0 = 410, y = 520;
    body = <><rect x={x0} y={y - 50} width={W} height={100} fill="none" stroke={DIM} strokeWidth={3} />
      <rect x={x0} y={y - 50} width={W * g.value * p} height={100} fill={GOLD} opacity={a} />
      <line x1={x0 + W * 0.5} y1={y - 70} x2={x0 + W * 0.5} y2={y + 110} stroke={INK} strokeWidth={4} strokeDasharray="14 10" opacity={R(t, tc, tc + 0.5)} />
      {lab(x0 + W * 0.5, y + 170, g.chanceLabel || 'pure chance', R(t, tc, tc + 0.5), 40, INK)}
      {lab(x0 + W * g.value, y - 120, g.label || '', p, 52, GOLD)}</>; }
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a241d 0%, #120f0c 80%)'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080"><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={GOLD} /></marker></defs>{body}</svg></AbsoluteFill>;
};

const Shot = ({s, t, dir, words = []}) => { const {fps} = useVideoConfig();
  if (s.page) return <PageShot s={s} t={t} dir={dir} />;
  if (s.diagram) return <Diagram s={s} t={t} words={words} />;
  const [s0, s1, x0, x1, y0, y1] = MOVES[s.move === 'punch' ? 'hold' : (s.video && (s.move || 'hold') === 'hold' && !s.freeze_img) ? 'vdrift' : (s.move || 'drift')], k = lin(t, s.t, s.t + s.dur + (s.tail ?? 0.6));   // keeps moving through the outgoing dissolve
  let sc = s0 + (s1 - s0) * k; const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k, [fx, fy] = s.focus || [0.5, 0.5];
  // gag punch-in (Zeigarnik, 9 Nov 2026 research: a fast snap zoom on the funny detail lands the beat): 0.18 s snap at punch_at s
  if (s.move === 'punch') { const p0 = s.t + (s.punch_at ?? 0.5); sc += (s.punch || 0.22) * interpolate(t, [p0, p0 + 0.18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}); }
  // freeze frame: a video gag stops on its best frame (freeze_img, cut by build_chapter.sh) freeze s into the shot
  const frozen = s.video && s.freeze_img && t >= s.t + s.freeze;
  const frame = (extra, src, style = {}) => <AbsoluteFill style={{transform: `translate(${x * extra}%, ${y * extra}%) scale(${1 + (sc - 1) * extra})`, transformOrigin: `${fx * 100}% ${fy * 100}%`, ...style}}>
    {frozen ? <Img src={staticFile(`${dir}/${s.freeze_img}`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: s.grade || 'none'}} />
      : s.video  // archive or stock footage (Sam, 9 Nov 2026: "If you can find videos those works too"): muted, starts at vstart s
      ? <Sequence from={Math.round(s.t * fps)} layout="none"><OffthreadVideo muted src={staticFile(`${dir}/${s.video}`)} startFrom={Math.round((s.vstart || 0) * fps)} playbackRate={s.rate || 1} style={{width: '100%', height: '100%', objectFit: 'cover', filter: s.grade || 'none'}} /></Sequence>
      : <Img src={staticFile(`${dir}/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}</AbsoluteFill>;
  if (!s.layers) return frame(1, s.img);
  // 2.5D: the far layer moves least, the near layer most (small amounts: inpainted edges must never show)
  return <>{frame(0.7, `${s.layers}/far.png`)}{frame(1.0, `${s.layers}/mid.png`)}{frame(1.35, `${s.layers}/near.png`)}</>;
};

// exurb1a study (Sam, 10 Nov 2026: "Apply the study results"): key lines sit on a moving texture (rain on glass, old film,
// dust in light) instead of a flat dark wash; chapter titles are written on one recurring story object (an index card).
const Tex = ({c, o, dir}) => { const {fps} = useVideoConfig(); if (!c.bg) return null;
  return <Sequence from={Math.round(c.t * fps)} layout="none"><AbsoluteFill style={{opacity: o * (c.bgOpacity ?? 0.9), mixBlendMode: c.blend || 'screen'}}>
    <OffthreadVideo muted src={staticFile(`${dir}/${c.bg}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill></Sequence>; };
const Card = ({c, t, words = [], dir}) => { const d = c.dur || 4.5, o = R(t, c.t, c.t + 0.4) * (1 - R(t, c.t + d - 0.4, c.t + d)); if (o <= 0) return null;
  const FONT = c.hand ? 'Kalam, cursive' : '"Cormorant Garamond", Georgia, serif', dark = c.bg ? 0.9 : 0.5;   // 0.9: a bright shot showed through the texture card (itch I11, spring behind the words)
  if (c.kind === 'title' && c.paper) { const [num, ...rest] = c.text.split(' · '), rot = c.rot ?? -2.5;
    return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: o, background: `rgba(8,7,6,${0.55 * o})`}}>
      <div style={{width: 820, height: 470, background: 'linear-gradient(180deg, #F1E7D2 0%, #E8DCC2 100%)', boxShadow: '0 30px 70px rgba(0,0,0,0.65)', transform: `rotate(${rot}deg) translateY(${(1 - o) * 30}px)`, position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 92, height: 3, background: '#C9786E', opacity: 0.7}} />
        {[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 150 + i * 52, height: 2, background: '#9DB4C8', opacity: 0.45}} />)}
        <div style={{position: 'absolute', left: 46, top: 30, fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: 34, letterSpacing: 6, color: '#4A4036'}}>{num}</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', fontFamily: 'Kalam, cursive', fontSize: 104, color: '#2B2620', transform: 'rotate(-1.5deg)'}}>{rest.join(' · ').toLowerCase()}</div>
      </div></AbsoluteFill>; }
  // big number (Sam, 10 Nov 2026): one fact-checked figure, large, with its plain-words unit underneath
  if (c.kind === 'number') return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: o, background: `rgba(10,9,8,${0.55 * o})`}}>
    <div style={{fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 240, lineHeight: 1, color: '#F3EBDD', textShadow: '0 6px 30px rgba(0,0,0,0.7)', transform: `scale(${0.92 + 0.08 * o})`}}>{c.term}</div>
    <div style={{fontFamily: 'Inter, sans-serif', fontSize: 40, letterSpacing: 2, color: '#D9D2C5', marginTop: 18, maxWidth: 1300, textAlign: 'center'}}>{c.text}</div></AbsoluteFill>;
  // short kinetic card (gj581g-stills-world s1, Sam 10 Nov 2026, Blank Rascal study): 1-4 spoken words on the video's own
  // plain dark ground, each landing on its aligned time; colour roles: ordinary cream, accent gold (c.accent), numbers blue (c.nums)
  if (c.kind === 'kinetic' && c.style === 'short') { const ws = c.text.split(' '), st = words.filter(w => w[1] >= c.t - 0.05).slice(0, ws.length).map(w => w[1]);
    const oo = R(t, c.t, c.t + 0.12) * (1 - R(t, c.t + d - 0.15, c.t + d)), key = w => w.toLowerCase().replace(/[^a-z0-9']/g, '');
    const col = w => (c.nums || []).map(key).includes(key(w)) ? '#9DB4C8' : (c.accent || []).map(key).includes(key(w)) ? '#C9A86A' : '#F3EBDD';
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: oo, background: '#0E0C0A'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(60,48,36,0.55) 0%, rgba(14,12,10,0) 65%)'}} />
      <div style={{fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: ws.length > 3 ? 132 : 156, fontWeight: 500, position: 'relative', textAlign: 'center', maxWidth: 1600, lineHeight: 1.05, letterSpacing: 1}}>
        {ws.map((w, i) => { const s0 = st[i] ?? c.t + i * 0.3, p = R(t, s0 - 0.06, s0 + 0.14);
          return <span key={i} style={{color: col(w), opacity: p, display: 'inline-block', transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + 0.04 * p})`, marginRight: '0.24em'}}>{w}</span>; })}</div></AbsoluteFill>; }
  // kinetic text: the spoken words appear one by one on their aligned times (verbatim from the line)
  if (c.kind === 'kinetic') { const ws = c.text.split(' '), st = words.filter(w => w[1] >= c.t - 0.05).slice(0, ws.length).map(w => w[1]);
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o, background: `rgba(10,9,8,${dark * o})`}}><Tex c={c} o={o} dir={dir} />
      <div style={{fontFamily: FONT, fontSize: c.hand ? 84 : 92, position: 'relative', color: '#F3EBDD', textAlign: 'center', maxWidth: 1500, lineHeight: 1.12, textShadow: '0 4px 24px rgba(0,0,0,0.8)'}}>
        {ws.map((w, i) => { const p = R(t, (st[i] ?? c.t + i * 0.3) - 0.05, (st[i] ?? c.t + i * 0.3) + 0.2); return <span key={i} style={{opacity: p, display: 'inline-block', transform: `translateY(${(1 - p) * 18}px)`, marginRight: '0.28em'}}>{w}</span>; })}</div></AbsoluteFill>; }
  if (c.kind === 'title') return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: o, background: `rgba(0,0,0,${0.35 * o})`}}>
    <div style={{fontFamily: '"Cormorant Garamond", "Noto Serif", Georgia, serif', fontSize: 84, letterSpacing: 6, color: '#F3EBDD', textAlign: 'center', maxWidth: 1500, whiteSpace: 'pre-line', lineHeight: 1.1, textShadow: '0 4px 24px rgba(0,0,0,0.7)', transform: `translateY(${(1 - o) * 12}px)`}}>{c.text}</div></AbsoluteFill>;
  // on-screen text (Sam, 8 Nov 2026: "putting text on the screen where it makes sense"): a key line in the end-title look,
  // set low so the picture stays visible; words verbatim from a fact-checked line
  if (c.kind === 'text' && c.bg) return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o, background: `rgba(10,9,8,${dark * o})`}}><Tex c={c} o={o} dir={dir} />
    <div style={{fontFamily: FONT, fontSize: c.hand ? 78 : 80, position: 'relative', color: '#F3EBDD', textAlign: 'center', maxWidth: 1400, lineHeight: 1.2, textShadow: '0 4px 24px rgba(0,0,0,0.8)', transform: `translateY(${(1 - o) * 12}px)`}}>{c.text}</div></AbsoluteFill>;
  if (c.kind === 'text') return <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', opacity: o, background: `linear-gradient(to top, rgba(0,0,0,${0.62 * o}) 0%, rgba(0,0,0,0) 45%)`}}>
    <div style={{fontFamily: '"Cormorant Garamond", "Noto Serif", Georgia, serif', fontSize: 66, letterSpacing: 3, color: '#F3EBDD', textAlign: 'center', maxWidth: 1500, lineHeight: 1.15, marginBottom: 110, textShadow: '0 4px 24px rgba(0,0,0,0.8)', transform: `translateY(${(1 - o) * 12}px)`}}>{c.text}</div></AbsoluteFill>;
  // info box: what a term means (kept on screen at Sam's request)
  return <div style={{position: 'absolute', left: 96, bottom: 120, width: 640, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: 'rgba(14,16,20,0.82)', borderLeft: '6px solid #C9A86A', padding: '22px 28px', backdropFilter: 'blur(6px)'}}>
    {c.label && <div style={{fontFamily: 'Inter, sans-serif', fontSize: 18, letterSpacing: 4, color: '#C9A86A', marginBottom: 8}}>{c.label}</div>}
    <div style={{fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 52, color: '#F3EBDD', lineHeight: 1}}>{c.term}</div>
    <div style={{fontFamily: 'Inter, sans-serif', fontSize: 26, color: '#D9D2C5', marginTop: 10, lineHeight: 1.35}}>{c.text}</div></div>; };

// "Film finish" (exurb1a study, Sam 10 Nov 2026): one look over every source: a soft vignette, a light grain/dust pass
// (finish.grain: a texture video in dir, looped) and an optional warm lift. Timeline field: finish {grain, grainOpacity, vignette}.
const Finish = ({f, dir}) => { const {fps} = useVideoConfig(); if (!f) return null;
  return <>{f.grain && <AbsoluteFill style={{opacity: f.grainOpacity ?? 0.22, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <Loop durationInFrames={Math.round((f.grainLen || 10) * fps)}><OffthreadVideo muted src={staticFile(`${dir}/${f.grain}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Loop></AbsoluteFill>}
    <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${f.vignette ?? 0.45}) 100%)`}} />
    {f.warm && <AbsoluteFill style={{pointerEvents: 'none', background: 'rgba(255,170,90,0.06)', mixBlendMode: 'soft-light'}} />}</>; };

export const StillsScene = ({dir, shots, cards = [], words = [], finish}) => { const {fps} = useVideoConfig(), t = useCurrentFrame() / fps;
  return <AbsoluteFill style={{background: '#000'}}>
    <Audio src={staticFile(`${dir}/vo.mp3`)} />
    {shots.map((s, i) => { const nx = shots[i + 1], end = nx ? nx.t + (nx.fade || 0) : s.t + s.dur;
      if (t < s.t - 0.01 || t > end + 0.01) return null;
      return <AbsoluteFill key={s.id} style={{opacity: s.fade ? R(t, s.t, s.t + s.fade) : 1}}><Shot s={s} t={t} dir={dir} words={words} /></AbsoluteFill>; })}
    <Finish f={finish} dir={dir} />
    {cards.map((c, i) => <Card key={i} c={c} t={t} words={words} dir={dir} />)}
  </AbsoluteFill>; };
