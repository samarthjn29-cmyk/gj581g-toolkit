// Stills workflow (8 Nov 2026): one scene = narration + realistic stills + camera moves (+ optional 2.5D layers) + info boxes.
// Props = the timeline.json written by toolkit/stills/build_scene.py, plus `dir` (the scene's folder under public/).
// Shot fields: img (file in dir), move: push | pullback | pan | panL | tilt | drift | hold, focus [x, y] (0-1, where a push
// heads), fade (s of dissolve into this shot; default 0 = cut), layers (folder with far/mid/near.png from stills/layers.py).
// Gags (9 Nov 2026): move 'punch' (snap zoom at punch_at s toward focus, size punch), freeze + freeze_img on video shots,
// gag: true marks the shot for the music dip at the mix. Gags carry no caption or label (Sam: "no labels").
// Cards: kind 'title' (big centred line) or 'info' (term + definition box, e.g. WORD 01 · Papyrus); dur (s, default 4.5).
// No image-source labels on screen (Sam, 8 Nov 2026): credits and the AI disclosure live in the description.
import React from 'react';
import {gagCard} from './Gags.jsx';
import {P, PaintDefs, PaperTex, paintedCard} from './Paint.jsx';
import {AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing, delayRender, continueRender} from 'remotion';
// load the real fonts before the first frame (until 10 Nov 2026 the serif silently fell back to Georgia)
const FONTS = [['Cormorant Garamond', 'cormorant-garamond-latin-500-normal.woff2'], ['Kalam', 'Kalam-Regular.ttf'], ['Kalam', 'Kalam-Bold.ttf', {weight: '700'}], ['Fraunces', 'fraunces-latin-700-normal.woff2', {weight: '700'}], ['Fraunces', 'fraunces-latin-400-normal.woff2', {weight: '400'}], ['Inter', 'Inter.ttf'], ['JetBrains Mono', 'JetBrainsMono.ttf']];
if (typeof document !== 'undefined' && !window.__zfonts) { window.__zfonts = 1; const h = delayRender('fonts');
  Promise.all(FONTS.map(([f, file, ds]) => new FontFace(f, `url(${staticFile('fonts/' + file)})`, ds).load().then(ff => document.fonts.add(ff)))).then(() => continueRender(h), () => continueRender(h)); }

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

const FISHEYE = 'data:image/png;base64,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';   // 128px radial displacement map for the peephole bulge (made with numpy, stretched to the frame)
const Shot = ({s, t, dir, words = []}) => { const {fps} = useVideoConfig();
  if (s.page) return <PageShot s={s} t={t} dir={dir} />;
  if (s.diagram) return <Diagram s={s} t={t} words={words} />;
  const SPECIAL = {triple: 'hold', whip: 'hold', spin: 'hold', crash: 'hold', bounce: 'hold', dutch: 'push'};   // gag moves (Sam, 11 Nov 2026: 'bring varieties in zooms')
  const [s0, s1, x0, x1, y0, y1] = MOVES[SPECIAL[s.move] || (s.move === 'punch' ? 'hold' : (s.video && (s.move || 'hold') === 'hold' && !s.freeze_img) ? 'vdrift' : (s.move || 'drift'))], k = lin(t, s.t, s.t + s.dur + (s.tail ?? 0.6));   // keeps moving through the outgoing dissolve
  let sc = s0 + (s1 - s0) * k; const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k, [fx, fy] = s.focus || [0.5, 0.5];
  // gag punch-in (Zeigarnik, 9 Nov 2026 research: a fast snap zoom on the funny detail lands the beat): 0.18 s snap at punch_at s
  if (s.move === 'punch') { const p0 = s.t + (s.punch_at ?? 0.5); sc += (s.punch || 0.22) * interpolate(t, [p0, p0 + 0.18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}); }
  // gag moves: whip (fast blurred pan in), spin (one turn in from small), crash (zoom out from very close), bounce (springy scale), dutch (tilted)
  const q = t - s.t, ep = (d) => Math.min(1, Math.max(0, q / d)); let rot = 0, blur = 0, xo = 0;
  if (s.move === 'whip') { const p = ep(0.24); xo = (s.from ?? 70) * Math.pow(1 - p, 2.2); blur = 22 * (1 - p); sc = Math.max(sc, 1 + 2 * Math.abs(xo) / 100); }   // scaled so the slide never shows a black edge (ch1 review)
  if (s.move === 'spin') { const p = 1 - Math.pow(1 - ep(0.6), 3); rot = -360 * (1 - p); sc *= 0.2 + 0.8 * p; }
  if (s.move === 'crash') { sc += 0.8 * Math.pow(1 - ep(0.35), 3); blur = 8 * (1 - ep(0.2)); }
  if (s.move === 'bounce') sc *= 1 + 0.22 * Math.exp(-q * 4.5) * (1 - Math.cos(q * 15)) / 2;   // springs up from 1 and settles: never under 1, so no black border (Aliens v7 review, 13 Nov 2026)
  // triple zoom (Indian daily-soap reaction, Ridiculous toolkit 11 Nov 2026): three snaps at triple_at + 0 / 0.35 / 0.7 s, then a slow sink-in
  if (s.move === 'triple') { const a = s.t + (s.triple_at ?? 0.2); [0, 0.35, 0.7].forEach(o => { sc += 0.17 * interpolate(t, [a + o, a + o + 0.09], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}); }); sc += 0.04 * Math.max(0, t - a - 0.8); }
  if (s.move === 'dutch') rot = (s.angle ?? 8) * (q < 0.2 ? q / 0.2 : 1);
  if (s.move === 'dutch') { const ar = Math.abs(rot) * Math.PI / 180; sc = Math.max(sc, (Math.cos(ar) + (16 / 9) * Math.sin(ar)) * 1.01); }   // a tilted picture always covers the frame: no black wedges (Aliens ch3 review)
  // freeze frame: a video gag stops on its best frame (freeze_img, cut by build_chapter.sh) freeze s into the shot
  const frozen = s.video && s.freeze_img && t >= s.t + s.freeze;
  // shake (Sam, 11 Nov 2026, "most ridiculous version"): a camera shake that decays over 0.8 s from shake_at s into the shot
  const sa = s.t + (s.shake_at ?? 0), sk = s.shake && t >= sa ? s.shake * Math.max(0, 1 - (t - sa) / 0.8) : 0;
  const shx = sk * Math.sin(t * 71), shy = sk * Math.cos(t * 53); if (sk) sc += 0.04;
  const frame = (extra, src, style = {}) => <AbsoluteFill style={{transform: `translate(${x * extra + shx + xo}%, ${y * extra + shy}%) scale(${1 + (sc - 1) * extra}) rotate(${rot}deg)`, filter: blur ? `blur(${blur}px)` : undefined, transformOrigin: `${fx * 100}% ${fy * 100}%`, ...style}}>
    {frozen ? <Img src={staticFile(`${dir}/${s.freeze_img}`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: s.grade || 'none'}} />
      : s.video  // archive or stock footage (Sam, 9 Nov 2026: "If you can find videos those works too"): muted, starts at vstart s
      ? <Sequence from={Math.round(s.t * fps)} layout="none"><OffthreadVideo muted src={staticFile(`${dir}/${s.video}`)} startFrom={Math.round((s.vstart || 0) * fps)} playbackRate={s.rate || 1} style={{width: '100%', height: '100%', objectFit: 'cover', filter: s.grade || 'none'}} /></Sequence>
      : <Img src={staticFile(`${dir}/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: s.duotone ? `url(#duo_${s.id})` : undefined}} />}</AbsoluteFill>;
  // duotone (bill wurtz idiom-colour photo, gag study 13 Nov 2026): s.duotone = [dark, light] hex colours: the photo is pushed to two
  // flat palette colours for a dreamy or unreal beat (e.g. ['#2E4A33', '#F1E6CF'] forest green and cream).
  const duo = s.duotone ? (() => { const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255), [a0, a1] = s.duotone.map(hx);
    return <svg width={0} height={0} style={{position: 'absolute'}}><filter id={`duo_${s.id}`} colorInterpolationFilters="sRGB"><feColorMatrix type="saturate" values="0" />
      {['R', 'G', 'B'].map((ch, j) => React.createElement('feComponentTransfer', {key: ch}, React.createElement(`feFunc${ch}`, {type: 'table', tableValues: `${a0[j]} ${a1[j]}`})))}</filter></svg>; })() : null;
  // peephole (Answer in Progress, gag study 13 Nov 2026): s.peephole = true (or {x, y, r} fractions) shows the shot through a round
  // fisheye, like a door peephole or a telescope eyepiece: a circular mask with a soft dark edge, the picture bulged a little
  // (a radial displacement), black around it. For "someone is watching" beats. Sound: a soft creak.
  if (s.peephole) { const P = s.peephole === true ? {} : s.peephole, px = (P.x ?? 0.5) * 100, py = (P.y ?? 0.5) * 100, pr = (P.r ?? 0.42) * 1080, id = `pp_${s.id || Math.round(s.t * 100)}`;
    return <AbsoluteFill style={{background: '#050403'}}><svg width={0} height={0} style={{position: 'absolute'}}><filter id={id} x="0" y="0" width="100%" height="100%">
        <feImage href={FISHEYE} result="m" preserveAspectRatio="none" /><feDisplacementMap in="SourceGraphic" in2="m" scale={P.bulge ?? 90} xChannelSelector="R" yChannelSelector="G" /></filter></svg>
      <AbsoluteFill style={{WebkitMaskImage: `radial-gradient(circle ${pr}px at ${px}% ${py}%, #000 93%, transparent 100%)`, maskImage: `radial-gradient(circle ${pr}px at ${px}% ${py}%, #000 93%, transparent 100%)`, filter: P.bulge === 0 ? undefined : `url(#${id})`}}>
        {duo}{frame(1.15, s.img)}</AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(circle ${pr}px at ${px}% ${py}%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 92%, rgba(0,0,0,0) 100%)`}} /></AbsoluteFill>; }
  if (!s.layers) return <>{duo}{frame(1, s.img)}</>;
  // 2.5D: the far layer moves least, the near layer most (small amounts: inpainted edges must never show)
  return <>{frame(0.7, `${s.layers}/far.png`)}{frame(1.0, `${s.layers}/mid.png`)}{frame(1.35, `${s.layers}/near.png`)}</>;
};

// exurb1a study (Sam, 10 Nov 2026: "Apply the study results"): key lines sit on a moving texture (rain on glass, old film,
// dust in light) instead of a flat dark wash; chapter titles are written on one recurring story object (an index card).
const Tex = ({c, o, dir}) => { const {fps} = useVideoConfig(); if (!c.bg) return null;
  return <Sequence from={Math.round(c.t * fps)} layout="none"><AbsoluteFill style={{opacity: o * (c.bgOpacity ?? 0.9), mixBlendMode: c.blend || 'screen'}}>
    <OffthreadVideo muted src={staticFile(`${dir}/${c.bg}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill></Sequence>; };
// painted mode: full-screen cards get a paper grain and wash on top while they are up
// breathe (Sam, Aliens v8, 13 Nov 2026: "The video stopped playing at 3:51" = two dead-still yellow cards for 5 s): every full-screen
// card drifts in by 3% over its life so the screen never freezes; c.still: true opts out.
const BREATHE = (c) => !c.still && c.style !== 'rise' && c.style !== 'roll' && (FULLK.includes(c.kind) || c.kind === 'panels');
const Card = (props) => { const {c, t} = props, d0 = c.dur || (['kinetic', 'title', 'number', 'bars', 'headline'].includes(c.kind) ? 4.5 : 2), q0 = t - c.t;
  const inner = <CardInner {...props} />, el = BREATHE(c) && q0 >= 0 && q0 <= d0 ? <AbsoluteFill style={{transform: `scale(${1 + 0.03 * q0 / d0})`}}>{inner}</AbsoluteFill> : inner;
  if (!P.on || !FULLK.includes(c.kind) || c.style === 'rise' || c.style === 'roll') return el;
  const d = d0, q = q0; if (q < 0 || q > d) return el;
  const v = (c.cutIn ? 1 : R(t, c.t, c.t + 0.3)) * (c.cutOut ? 1 : 1 - R(t, c.t + d - 0.3, c.t + d)); return <>{el}<PaperTex o={v} /></>; };
const CardInner = ({c, t, words = [], dir}) => { const pc = paintedCard(c, t, dir); if (pc !== undefined) return pc; const gg = gagCard(c, t, dir); if (gg !== undefined) return gg; const d = c.dur || 4.5, o = (c.cutIn ? (t >= c.t ? 1 : 0) : R(t, c.t, c.t + 0.4)) * (c.cutOut ? (t < c.t + d ? 1 : 0) : 1 - R(t, c.t + d - 0.4, c.t + d)); if (o <= 0) return null;
  // Ridiculous-mode overlays (Sam, 11 Nov 2026): stamp (a rubber stamp slammed on), rain (money falling), flash (white frame), pip (a reaction picture popping up in a corner)
  if (c.kind === 'stamp') { const p = R(t, c.t, c.t + 0.12), sh = (1 - R(t, c.t + 0.12, c.t + 0.6)) * 10 * Math.sin(t * 90);
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - R(t, c.t + d - 0.2, c.t + d)}}><div style={{transform: `translate(${(c.x || 0) + sh}px, ${c.y || 0}px) rotate(${c.rot ?? -12}deg) scale(${3 - 2 * p})`, opacity: p,
      fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif', fontWeight: 900, fontSize: c.size || 150, letterSpacing: 6, color: c.color || '#D11F2A', border: `14px solid ${c.color || '#D11F2A'}`, borderRadius: 18, padding: '10px 40px',
      background: 'rgba(255,255,255,0.12)', textShadow: '0 4px 18px rgba(0,0,0,0.35)', boxShadow: '0 10px 40px rgba(0,0,0,0.35)', whiteSpace: 'nowrap'}}>{c.text}</div></AbsoluteFill>; }
  if (c.kind === 'rain') { const n = c.n || 46, q = t - c.t;
    return <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}><svg width={1920} height={1080}>{Array.from({length: n}).map((_, i) => { const r = (k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
      const x = r(1) * 1920, sp = 420 + r(2) * 520, y = -160 + (q * sp + r(3) * 1200) % 1350, a = (r(4) - 0.5) * 80 + Math.sin(q * (2 + r(5) * 3) + i) * 35;
      return <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${0.7 + r(6) * 0.6})`}><rect x={-62} y={-28} width={124} height={56} rx={4} fill="#5E9B5A" stroke="#2F5D31" strokeWidth={3} />
        <rect x={-50} y={-18} width={100} height={36} rx={3} fill="none" stroke="#CFE6C3" strokeWidth={2} /><text x={0} y={12} textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize={30} fill="#E9F5E2">$</text></g>; })}</svg></AbsoluteFill>; }
  // aside (Bill Wurtz-style tiny text pop): lowercase serif, on and off with no fade
  if (c.kind === 'aside') { if (t < c.t || t > c.t + d) return null;
    return <AbsoluteFill><div style={{position: 'absolute', left: c.x ?? 120, top: c.y ?? 120, transform: `rotate(${c.rot ?? -3}deg)`, fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: c.size || 64,
      color: c.color || '#FFFFFF', textShadow: '0 0 12px rgba(0,0,0,0.9), 0 3px 6px rgba(0,0,0,0.8)', whiteSpace: 'nowrap',
      // dark backing chip by default (reviewer, opening v13: thin white italic was lost on busy painted seats and streamers); chip: false for none
      ...(c.chip === false ? {} : {background: 'rgba(14,12,10,0.72)', padding: '6px 26px 12px', borderRadius: 10, fontWeight: 600})}}>{c.text.toLowerCase()}</div></AbsoluteFill>; }
  // breaking banner + ticker (Hindi primetime parody, our own colours, no channel branding)
  if (c.kind === 'banner') { const p = Easing.out(Easing.cubic)(R(t, c.t, c.t + 0.25)), q = t - c.t, oo = 1 - R(t, c.t + d - 0.2, c.t + d), pulse = 0.85 + 0.15 * Math.sin(q * 12);
    return <AbsoluteFill style={{opacity: oo}}><div style={{position: 'absolute', left: 0, right: 0, bottom: 150, height: 150, transform: `translateX(${(1 - p) * -110}%)`, display: 'flex', alignItems: 'stretch', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
      <div style={{background: '#FFD400', color: '#B00000', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 900, fontSize: 54, padding: '0 34px', display: 'flex', alignItems: 'center', letterSpacing: 2, opacity: pulse}}>{c.label || 'BREAKING'}</div>
      <div style={{flex: 1, background: 'linear-gradient(180deg, #D3121B, #8E0A10)', color: '#FFFFFF', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 800, fontSize: c.size || 58, display: 'flex', alignItems: 'center', padding: '0 34px', whiteSpace: 'nowrap', overflow: 'hidden'}}>{c.text}</div></div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 96, height: 54, background: '#0B1A3A', color: '#FFFFFF', overflow: 'hidden', transform: `translateX(${(1 - p) * 110}%)`}}>
        <div style={{position: 'absolute', top: 8, left: 1920 - q * 260, whiteSpace: 'nowrap', fontFamily: 'Inter, Arial, sans-serif', fontWeight: 700, fontSize: 34}}>{(c.ticker || '').toUpperCase()}</div></div></AbsoluteFill>; }
  // starburst (infomercial): a spiky yellow star that pops in and wobbles, red text
  if (c.kind === 'starburst') { const q = t - c.t, b = q < 0 ? 0 : 1 + 0.3 * Math.exp(-q * 7) * Math.sin(q * 24) - Math.exp(-q * 16), oo = 1 - R(t, c.t + d - 0.15, c.t + d), n = 18, R1 = 300, R2 = 230;
    const pts = Array.from({length: n * 2}).map((_, i) => { const a = (i / (n * 2)) * 2 * Math.PI, r = i % 2 ? R2 : R1; return `${Math.cos(a) * r},${Math.sin(a) * r}`; }).join(' ');
    return <AbsoluteFill style={{opacity: oo}}><div style={{position: 'absolute', left: 960 + (c.x ?? 420) - 320, top: 540 + (c.y ?? -170) - 320, width: 640, height: 640, transform: `scale(${b * (c.scale ?? 1)}) rotate(${(c.rot ?? 12) + Math.sin(q * 5) * 4}deg)`}}>
      <svg width={640} height={640} viewBox="-320 -320 640 640"><polygon points={pts} fill="#FFE51F" stroke="#E0261B" strokeWidth={10} /></svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 120, fontFamily: 'Inter, Arial, sans-serif', fontWeight: 900, fontSize: c.size || 64, lineHeight: 1.0, color: '#E0261B', whiteSpace: 'pre-line'}}>{c.text}</div></div></AbsoluteFill>; }
  // headline (fake front page, our own masthead "THE DAILY MESS"): spins in like an old film newspaper, Onion-style sober headline
  if (c.kind === 'headline') { const p = 1 - Math.pow(1 - R(t, c.t, c.t + 0.7), 3), oo = 1 - R(t, c.t + d - 0.2, c.t + d);
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: oo, background: `rgba(0,0,0,${0.45 * p})`}}><div style={{width: 1180, height: 760, background: '#F4EFE2', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', transform: `translate(${c.dx || 0}px, ${c.dy || 0}px) rotate(${-720 * (1 - p) - 3}deg) scale(${(0.1 + 0.9 * p) * (c.scale ?? 1)})`, padding: '40px 60px', fontFamily: 'Georgia, "Times New Roman", serif', color: '#1A1814'}}>
      <div style={{textAlign: 'center', fontSize: 92, fontWeight: 700, letterSpacing: 4, borderBottom: '6px double #1A1814', paddingBottom: 10}}>{c.masthead || 'THE DAILY MESS'}</div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, padding: '8px 0', borderBottom: '2px solid #1A1814', fontStyle: 'italic'}}><span>{c.kicker || 'Late edition'}</span><span>Price: one hundred million dollars</span></div>
      <div style={{fontSize: c.size || 84, fontWeight: 700, lineHeight: 1.05, textAlign: 'center', margin: '34px 0 24px'}}>{c.text}</div>
      <div style={{display: 'flex', gap: 30}}>{[0, 1, 2].map(k => k === 2 && c.neighbour   // the absurd neighbour headline (Mustard, gag study 13 Nov 2026): a smaller deadpan story beside the real one, never pointed at
        ? <div key={k} style={{flex: 1, borderLeft: '2px solid #1A1814', paddingLeft: 18}}><div style={{fontSize: c.nsize || 30, fontWeight: 700, lineHeight: 1.1, margin: '6px 0 10px'}}>{c.neighbour}</div>{Array.from({length: 4}).map((_, j) => <div key={j} style={{height: 10, margin: '10px 0', background: '#B9B2A2', width: `${66 + ((j * 29) % 30)}%`}} />)}</div>
        : <div key={k} style={{flex: 1}}>{Array.from({length: 7}).map((_, j) => <div key={j} style={{height: 12, margin: '12px 0', background: '#B9B2A2', width: `${70 + ((j * 37 + k * 11) % 30)}%`}} />)}</div>)}</div></div></AbsoluteFill>; }
  // bars (picture-gags catalogue E6, Aliens opening 11 Nov 2026): a true-scale bar chart on the number-card ground. The small bar is
  // drawn first, then the camera "tilts up" the big bar (scale kept honest: c.ratio x the small bar), so the big bar runs off the top
  // for a long blurred scroll before its label lands. c.a / c.b = {label, value}; c.ratio = b / a.
  if (c.kind === 'bars') { const q = t - c.t, oo = (c.cutIn ? 1 : R(t, c.t, c.t + 0.15)) * (c.cutOut ? 1 : 1 - R(t, c.t + d - 0.12, c.t + d)), G = c.ground || '#FCCF3E', I = c.ink || '#0B5E2A', N = c.inkNum || '#063F1C';
    const h0 = c.h0 || 8, H = h0 * c.ratio, base = 860, s0 = c.hold0 ?? 0.75, s1 = c.scrollEnd ?? (d - 0.45), e = R(t, c.t + s0, c.t + s1), ez = e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2;
    // reverse (Sam, 12 Nov 2026: "play in reverse where you show coming down from 730 billion to 100 million"): ONE bar that
    // really shrinks, its number counting down on top of it, a dashed outline left where it started; flipping the scroll
    // only read as the bar growing (reviewer, opening v13).
    if (c.reverse) { const F = P.on ? 'Fraunces, Georgia, serif' : 'Inter, "Helvetica Neue", Arial, sans-serif', LF = P.on ? 'Kalam, cursive' : F, vA = c.vFrom || 730e9, vB = c.vTo || 100e6, v = vA + (vB - vA) * ez;   // linear: bar height and number stay in proportion and the shrink reads smoothly (log made it vanish in 0.3 s)
      const full = 640, hh = Math.max(h0, full * v / vA), fmt = x => x >= 1e9 ? `$${x >= 1e10 ? Math.round(x / 1e9) : (x / 1e9).toFixed(1)} billion` : `$${Math.max(100, Math.round(x / 1e6))} million`;
      const lab = ez < 0.5 ? c.b.label : c.a.label, done = e >= 1;
      return <AbsoluteFill style={{background: G, opacity: oo, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 760, width: 400, top: base - full, height: full, border: `5px dashed ${N}`, opacity: 0.35, boxSizing: 'border-box'}} />
        {P.on ? <div style={{position: 'absolute', left: 760, width: 400, top: base - full + 18, textAlign: 'center', fontFamily: 'Kalam, cursive', fontWeight: 700, fontSize: 40, color: N, opacity: 0.55 * Math.min(1, e * 4)}}>{c.b.value}</div> : null}
        <div style={{position: 'absolute', left: 760, width: 400, top: base - hh, height: hh, background: I, ...(P.on ? {border: '5px solid #26302A', boxSizing: 'border-box', filter: 'url(#pRough)'} : {})}} />
        <div style={{position: 'absolute', left: 120, right: 120, top: base, height: 6, background: N, filter: P.on ? 'url(#pRough)' : undefined}} />
        <div style={{position: 'absolute', left: 560, width: 800, top: base - hh - 110, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 84, color: N, whiteSpace: 'nowrap'}}>{done ? c.a.value : fmt(v)}</div>
        <div style={{position: 'absolute', left: 460, width: 1000, top: base + 26, textAlign: 'center', fontFamily: LF, color: I, fontWeight: 800, fontSize: P.on ? 52 : 44}}>{lab}</div>
        {e > 0.05 && e < 0.95 ? <div style={{position: 'absolute', left: 120, top: 110, fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 70, color: N, transform: 'rotate(-3deg)'}}>{c.scrollText || 'going down…'}</div> : null}
        {done ? <div style={{position: 'absolute', left: P.on ? 1330 : 1200, top: base - 150, fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 58, color: N, transform: 'rotate(-4deg)', whiteSpace: 'nowrap'}}>{c.aside || "(it's there. squint.)"}</div> : null}
      </AbsoluteFill>; }
    const Y = (c.reverse ? 1 - ez : ez) * (H - base + 330), top = base - H + Y, bot = base + Y, F = 'Inter, "Helvetica Neue", Arial, sans-serif', tick = c.tick || 4000;
    const ticks = []; for (let k = 1; k * tick < H; k++) { const y = base - k * tick + Y; if (y > -60 && y < 1140) ticks.push(<div key={k} style={{position: 'absolute', left: 1180, top: y - 2, width: 60, height: 4, background: N}}><div style={{position: 'absolute', right: 80, top: -26, fontFamily: F, fontWeight: 800, fontSize: 44, color: N, whiteSpace: 'nowrap'}}>{(c.tickLabel || '$#B').replace('#', k * (c.tickStep || 50))}</div></div>); }
    const blur = e > 0 && e < 1 ? 10 * Math.sin(Math.PI * e) : 0;   // motion blur while it scrolls
    return <AbsoluteFill style={{background: G, opacity: oo, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, filter: `blur(${blur}px)`}}>
        {ticks}
        <div style={{position: 'absolute', left: 1260, width: 260, top: Math.max(-80, top), height: Math.max(0, Math.min(1160, bot) - Math.max(-80, top)), background: I}} />
        <div style={{position: 'absolute', left: 300, width: 260, top: bot - h0, height: h0, background: I}} />
        <div style={{position: 'absolute', left: 120, right: 120, top: bot, height: 6, background: N}} />
        <div style={{position: 'absolute', left: 200, width: 460, top: bot + 26, textAlign: 'center', fontFamily: F, color: I, fontWeight: 800, fontSize: 40, lineHeight: 1.15}}>{c.a.label}<br /><span style={{color: N, fontWeight: 900, fontSize: 56}}>{c.a.value}</span></div>
        <div style={{position: 'absolute', left: 1160, width: 460, top: bot + 26, textAlign: 'center', fontFamily: F, color: I, fontWeight: 800, fontSize: 40, lineHeight: 1.15}}>{c.b.label}</div>
        {(c.reverse ? q > s1 : q < s0) ? <div style={{position: 'absolute', left: 480, top: bot - 210, fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 58, color: N, transform: 'rotate(-4deg)', whiteSpace: 'nowrap'}}>{c.aside || "(it's there. squint.)"} ↓</div> : null}
      </div>
      {e > 0.08 && e < 0.92 ? <div style={{position: 'absolute', left: 120, top: 110, fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 70, color: N, transform: 'rotate(-3deg)'}}>{c.scrollText || 'still going…'}</div> : null}
      <div style={{position: 'absolute', left: 1160, width: 460, top: top - 120, textAlign: 'center', fontFamily: F, fontWeight: 900, fontSize: 72, color: N, opacity: c.reverse ? 1 : R(t, c.t + s1 - 0.1, c.t + s1 + 0.1), transform: `scale(${c.reverse ? 1 : 1 + 0.25 * (1 - R(t, c.t + s1 - 0.1, c.t + s1 + 0.2))})`}}>{c.b.value}</div>
    </AbsoluteFill>; }
  // counter (Aliens opening, 11 Nov 2026): a money counter in a pill that holds, then drains faster and faster to its end value,
  // which flashes red. c.from / c.to numbers, c.prefix, c.hold s before it starts draining, c.drain s.
  if (c.kind === 'counter') { const q = t - c.t, hold = c.hold ?? 0.6, dr = c.drain ?? 1.6, p = Math.min(1, Math.max(0, (q - hold) / dr)), e = p * p * p;
    const v = Math.round(c.from + (c.to - c.from) * e), done = p >= 1, fl = done ? (Math.floor((q - hold - dr) * 8) % 2 === 0) : false, oo = R(t, c.t, c.t + 0.15) * (1 - R(t, c.t + d - 0.15, c.t + d));
    return <AbsoluteFill style={{opacity: oo}}><div style={{position: 'absolute', left: c.left ?? '50%', bottom: c.bottom ?? 120, transform: `translateX(-50%) scale(${done ? 1.12 : 1})`, background: 'rgba(10,9,8,0.82)', borderRadius: 28, padding: '18px 54px',
      border: `6px solid ${done ? '#E0261B' : '#FCCF3E'}`, fontFamily: '"JetBrains Mono", "Courier New", monospace', fontWeight: 800, fontSize: c.size || 120, color: done && fl ? '#FF3B30' : '#FCCF3E', letterSpacing: 2, whiteSpace: 'nowrap', boxShadow: '0 16px 50px rgba(0,0,0,0.6)'}}>
      {(c.prefix ?? '$') + v.toLocaleString('en-US')}</div>
      {c.label ? <div style={{position: 'absolute', left: c.left ?? '50%', bottom: (c.bottom ?? 120) + (c.size || 120) * 1.25 + 80, transform: 'translateX(-50%) rotate(-2deg)', fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 58, color: '#FFFFFF', background: 'rgba(10,9,8,0.7)', padding: '4px 26px', borderRadius: 12, whiteSpace: 'nowrap'}}>{c.label}</div> : null}</AbsoluteFill>; }
  // glint (picture-gags catalogue: the "shiny" sparkle): a diagonal light sweep across the shot plus a few star twinkles
  if (c.kind === 'glint') { const q = t - c.t; if (q < 0 || q > d) return null; const p = q / d, x = -40 + 140 * p;
    const stars = c.stars || [[0.62, 0.32], [0.3, 0.45], [0.78, 0.55], [0.45, 0.25]];
    return <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `linear-gradient(115deg, rgba(255,255,255,0) ${x - 12}%, rgba(255,255,255,0.55) ${x}%, rgba(255,255,255,0) ${x + 12}%)`, mixBlendMode: 'screen'}} />
      {stars.map(([sx, sy], i) => { const s0 = i * 0.12, k = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (q - s0) / 0.45)))), sz = 140 * k;
        return <svg key={i} width={sz * 2 + 1} height={sz * 2 + 1} style={{position: 'absolute', left: sx * 1920 - sz, top: sy * 1080 - sz, transform: `rotate(${q * 90}deg)`}} viewBox="-1 -1 2 2">
          <path d="M0,-1 C0.08,-0.08 0.08,-0.08 1,0 C0.08,0.08 0.08,0.08 0,1 C-0.08,0.08 -0.08,0.08 -1,0 C-0.08,-0.08 -0.08,-0.08 0,-1 Z" fill="#FFFFFF" opacity={0.95} /></svg>; })}
    </AbsoluteFill>; }
  if (c.kind === 'flash') return <AbsoluteFill style={{background: c.color || '#FFFFFF', opacity: 1 - R(t, c.t, c.t + (c.dur || 0.25))}} />;
  if (c.kind === 'pip') { const q = t - c.t, b = q < 0 ? 0 : 1 + 0.25 * Math.exp(-q * 6) * Math.sin(q * 20) - Math.exp(-q * 14);
    return <AbsoluteFill style={{opacity: 1 - R(t, c.t + d - 0.2, c.t + d)}}><div style={{position: 'absolute', right: c.right ?? 70, bottom: c.bottom ?? 70, width: c.w || 560, height: (c.w || 560) * 9 / 16, transform: `scale(${b}) rotate(${c.rot ?? 4}deg)`, transformOrigin: '100% 100%',
      border: '10px solid #FFFFFF', borderRadius: 14, overflow: 'hidden', boxShadow: '0 18px 50px rgba(0,0,0,0.6)'}}><Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div></AbsoluteFill>; }
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
  // rising text over the picture (Sam, 11 Nov 2026, Aliens opening: "What the F**K? should rise from the bottom" of a sunny field):
  // no ground, the shot stays visible; big bold words rise from below the frame and settle at c.y (default centre) over c.rise s
  if (c.kind === 'kinetic' && c.style === 'rise') { const rs = c.rise || 0.8, p = R(t, c.t, c.t + rs), e = 1 - Math.pow(1 - p, 3);
    const oo = (1 - R(t, c.t + d - 0.2, c.t + d));
    // painted mode: the words land on a cream paper scrap in Fraunces and fade in (no slide from below the frame)
    if (P.on) return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: oo * R(t, c.t, c.t + 0.25)}}><div style={{position: 'relative', transform: `translate(${c.x || 0}px, ${c.y || 0}px) rotate(-2deg) scale(${0.94 + 0.06 * e})`}}>
      <div style={{position: 'absolute', inset: 0, background: '#F3EBDD', border: '4px solid #26302A', borderRadius: 6, filter: 'url(#pRough) drop-shadow(0 8px 18px rgba(20,16,10,0.45))'}} />
      <div style={{position: 'relative', padding: '14px 40px 20px', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: c.size || 150, color: '#26302A', textAlign: 'center', lineHeight: 1, whiteSpace: 'pre-line'}}>{c.text}</div></div></AbsoluteFill>;
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: oo}}>
      <div style={{fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif', fontWeight: 900, fontSize: c.size || 190, color: c.color || '#FFFFFF', letterSpacing: -2, textAlign: 'center', maxWidth: 1700, lineHeight: 1,
        textShadow: '0 0 60px rgba(0,0,0,0.7), 0 6px 30px rgba(0,0,0,0.75), 0 2px 0 rgba(0,0,0,0.5)', whiteSpace: 'pre-line', transform: `translate(${c.x || 0}px, ${(1 - e) * 820 + (c.y || 0)}px) scale(${0.9 + 0.1 * e})`}}>{c.text}</div></AbsoluteFill>; }
  // rolling text (Sam, 11 Nov 2026, Aliens opening doc comment: "rolling into the screen from the center", dark green,
  // "fireworks at the end of the font animation"): the words grow from a point at the centre while turning one full roll,
  // overshoot a little and settle; a pale outline keeps dark green readable on a green field; then firework bursts around them
  if (c.kind === 'kinetic' && c.style === 'roll') { const rs = c.rise || 0.8, p = R(t, c.t, c.t + rs);
    const back = p => { const k = 1.7; return 1 + (k + 1) * Math.pow(p - 1, 3) + k * Math.pow(p - 1, 2); };   // ease-out-back
    const sc = p <= 0 ? 0 : back(p), rot = -360 * (1 - (1 - Math.pow(1 - p, 3))), oo = (1 - R(t, c.t + d - 0.2, c.t + d));
    const col = c.color || '#1E5631', edge = '#F4F1E4';
    const bursts = c.fireworks ?? [[-600, -60, 0], [600, -90, 0.1], [-150, -230, 0.2], [330, -250, 0.3], [-700, 160, 0.38], [720, 150, 0.45]];
    const fw = bursts.map(([bx, by, dl], i) => { const t0 = c.t + rs + dl, q = (t - t0) / 0.8; if (q <= 0 || q >= 1) return null;
      const hues = ['#FFD54A', '#FF6B5B', '#FFFFFF', '#7FE3FF', '#FFB13B'], n = 26, rr = 210 + 50 * (i % 2);
      return <g key={i} transform={`translate(${960 + bx} ${540 + (c.y || 0) + by})`} opacity={1 - Math.pow(q, 2)}>
        {q < 0.18 && <circle r={60 * (1 - q / 0.18)} fill="#FFF7D6" opacity={0.9} />}
        {Array.from({length: n}).map((_, j) => { const a = (j / n) * 2 * Math.PI + i, e = 1 - Math.pow(1 - q, 2.2), r = rr * e,
          px = Math.cos(a) * r, py = Math.sin(a) * r + 90 * q * q, tl = 0.28 * r;
          return <g key={j}><line x1={px - Math.cos(a) * tl} y1={py - Math.sin(a) * tl - 20 * q * q} x2={px} y2={py} stroke={hues[(i + j) % 5]} strokeWidth={6} strokeLinecap="round" opacity={0.75} />
            <circle cx={px} cy={py} r={8} fill={hues[(i + j) % 5]} /></g>; })}</g>; });
    return <AbsoluteFill style={{opacity: oo}}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif', fontWeight: 900, fontSize: c.size || 190, color: col, letterSpacing: -2, textAlign: 'center', maxWidth: 1700, lineHeight: 1,
          WebkitTextStroke: `9px ${edge}`, paintOrder: 'stroke fill', textShadow: '0 0 50px rgba(255,250,230,0.8), 0 0 18px rgba(255,250,230,0.7), 0 8px 26px rgba(0,0,0,0.35)',
          transform: `translateY(${c.y || 0}px) rotate(${rot}deg) scale(${sc})`}}>{c.text}</div></AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>{fw}</svg></AbsoluteFill>; }
  // short kinetic card (gj581g-stills-world s1, Sam 10 Nov 2026, Blank Rascal study): 1-4 spoken words on the video's own
  // plain dark ground, each landing on its aligned time; colour roles: ordinary cream, accent gold (c.accent), numbers blue (c.nums)
  if (c.kind === 'kinetic' && c.style === 'short') { const ws = c.text.split(' '), st = words.filter(w => w[1] >= c.t - 0.05).slice(0, ws.length).map(w => w[1]);
    const oo = (c.cutIn ? 1 : R(t, c.t, c.t + 0.12)) * (c.cutOut ? 1 : 1 - R(t, c.t + d - 0.15, c.t + d)), key = w => w.toLowerCase().replace(/[^a-z0-9']/g, '');
    // c.ground / c.ink (Sam, Aliens opening, 11 Nov 2026: golden-parakeet yellow ground, green text): one colour for every word,
    // numbers a shade deeper; without them the default dark ground with cream / gold accent / blue numbers
    const col = w => c.ink ? ((c.nums || []).map(key).includes(key(w)) ? (c.inkNum || c.ink) : c.ink)
      : (c.nums || []).map(key).includes(key(w)) ? '#9DB4C8' : (c.accent || []).map(key).includes(key(w)) ? '#C9A86A' : '#F3EBDD';
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: oo, background: c.ground || '#0E0C0A'}}>
      {c.bgImg ? <Img src={staticFile(`${dir}/${c.bgImg}`)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: c.bgOpacity ?? 1}} /> : null}
      <AbsoluteFill style={{background: c.ground ? 'radial-gradient(ellipse at 50% 45%, rgba(255,240,170,0.45) 0%, rgba(0,0,0,0) 60%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(120,70,0,0.25) 100%)' : 'radial-gradient(ellipse at 50% 45%, rgba(60,48,36,0.55) 0%, rgba(14,12,10,0) 65%)'}} />
      <div style={{fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: ws.length > 3 ? 132 : 156, fontWeight: c.ink ? 600 : 500, position: 'relative', textAlign: 'center', maxWidth: 1600, lineHeight: 1.05, letterSpacing: 1}}>
        {ws.map((w, i) => { const s0 = st[i] ?? c.t + i * 0.3, p = c.static ? 1 : R(t, s0 - 0.06, s0 + 0.14);   // c.static: all words at once, no motion (Sam, 11 Nov 2026)
          return <span key={i} style={{color: col(w), opacity: p, display: 'inline-block', transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + 0.04 * p})`, marginRight: '0.24em'}}>{w}</span>; })}</div></AbsoluteFill>; }
  // kinetic text: the spoken words appear one by one on their aligned times (verbatim from the line)
  if (c.kind === 'kinetic') { const ws = c.text.split(' '), st = words.filter(w => w[1] >= c.t - 0.05).slice(0, ws.length).map(w => w[1]);
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o, background: `rgba(10,9,8,${dark * o})`}}><Tex c={c} o={o} dir={dir} />
      <div style={{fontFamily: FONT, fontSize: c.hand ? 84 : 92, position: 'relative', color: '#F3EBDD', textAlign: 'center', maxWidth: 1500, lineHeight: 1.12, textShadow: '0 4px 24px rgba(0,0,0,0.8)'}}>
        {ws.map((w, i) => { const p = R(t, (st[i] ?? c.t + i * 0.3) - 0.05, (st[i] ?? c.t + i * 0.3) + 0.2); return <span key={i} style={{opacity: p, display: 'inline-block', transform: `translateY(${(1 - p) * 18}px)`, marginRight: '0.28em'}}>{w}</span>; })}</div></AbsoluteFill>; }
  if (c.kind === 'title') return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: o, background: `rgba(10,9,8,${(c.dim ?? 0.35) * o})`, paddingTop: c.y > 0 ? 2 * c.y : 0, paddingBottom: c.y < 0 ? -2 * c.y : 0, paddingLeft: c.x > 0 ? 2 * c.x : 0, paddingRight: c.x < 0 ? -2 * c.x : 0}}>
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

// House-style finishes (Sam, 12 Nov 2026: "recreate the opening clip with 1, 2 and 3 style"):
//   finish.filter: one colour grade for every picture (CSS filter), finish.noise: animated film grain (0-1),
//   finish.desk: style 1, "paper collage on a desk": every picture and card is a print lying on one desk (finish.deskImg),
//   with a white border, tape and a shadow, a small tilt that changes with each new picture, under the camera move.
// Painted finish for the gag cards (Sam, 12 Nov 2026: "make sure every gag is used in the AI animated painted format"): with
// finish.painted, every card is drawn through one SVG filter: a slow brush-edge wobble that re-seeds every finish.boil frames (the
// hand-made "animated painting" boil; 0 = still), paper grain inside the card shapes only, and a warm gouache shift (saturate down,
// a little sepia) so pure white reads as cream and red as brick. finish.paintEdge = wobble strength (px, default 5).
const PaintFilterDefs = ({f}) => { const fr = useCurrentFrame(), b = f.boil ?? 4, seed = b ? Math.floor(fr / b) % 3 : 0;
  return <svg width={0} height={0} style={{position: 'absolute'}}><filter id="gjPaint" x="-2%" y="-2%" width="104%" height="104%">
    <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed={seed + 1} result="w" />
    <feDisplacementMap in="SourceGraphic" in2="w" scale={f.paintEdge ?? 5} xChannelSelector="R" yChannelSelector="G" result="d" />
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={7} result="g" /><feColorMatrix in="g" type="saturate" values="0" result="gg" />
    <feComponentTransfer in="gg" result="g2"><feFuncR type="linear" slope="0.25" intercept="0.8" /><feFuncG type="linear" slope="0.25" intercept="0.8" /><feFuncB type="linear" slope="0.25" intercept="0.78" /></feComponentTransfer>
    <feBlend in="d" in2="g2" mode="multiply" result="m" /><feComposite in="m" in2="d" operator="in" /></filter></svg>; };
const FULLK = ['kinetic', 'title', 'number', 'bars', 'chain', 'later', 'split', 'triptych', 'ruler', 'advert', 'grid', 'namesake', 'variants', 'headline'];
const Grain = ({o}) => { const f = useCurrentFrame(); return <AbsoluteFill style={{pointerEvents: 'none', opacity: o, mixBlendMode: 'overlay'}}>
  <svg width="100%" height="100%"><filter id={`gr${f % 8}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 8} /><feColorMatrix type="saturate" values="0" /></filter>
  <rect width="100%" height="100%" filter={`url(#gr${f % 8})`} /></svg></AbsoluteFill>; };
export const StillsScene = ({dir, shots, cards = [], words = [], finish}) => { const {fps} = useVideoConfig(), t = useCurrentFrame() / fps, F = finish || {}; P.on = F.gags !== 'flat';   // painted gag kit (Paint.jsx) is the default from 12 Nov 2026 (Sam: "going forward whatever gags we use should be created in the painted AI format"); finish.gags: 'flat' only to rebuild an old video as it was
  const isFull = c => FULLK.includes(c.kind) && c.style !== 'rise' && c.style !== 'roll' && t >= c.t && t < c.t + (c.dur || 2);
  const pics = <>{shots.map((s, i) => { const nx = shots[i + 1], end = nx ? nx.t + (nx.fade || 0) : s.t + s.dur;
      if (t < s.t - 0.01 || t > end + 0.01) return null;
      return <AbsoluteFill key={s.id} style={{opacity: s.fade ? R(t, s.t, s.t + s.fade) : 1, filter: F.filter || undefined}}><Shot s={s} t={t} dir={dir} words={words} />
        {s.src && F.srcTags ? <div style={{position: 'absolute', right: 28, bottom: 22, fontFamily: 'Inter, sans-serif', fontSize: 20, letterSpacing: 1, color: 'rgba(241,230,207,0.8)', textShadow: '0 1px 4px rgba(0,0,0,0.9)'}}>{s.src}</div> : null}</AbsoluteFill>; })}</>;   // corner source tag (Defunctland, gag study 12 Nov 2026): only with finish.srcTags, because Sam's 8 Nov 2026 rule keeps source labels off screen
  const cardLayer0 = <>{P.on ? <PaintDefs /> : null}{cards.map((c, i) => <Card key={i} c={c} t={t} words={words} dir={dir} />)}</>;
  // cards that read the picture behind them (backdrop-filter: freeze grey-out, blur censor, VHS glitch) stay outside the painted
  // wrapper, because a filtered parent cuts them off from the backdrop (painted test, 12 Nov 2026: the freeze stopped greying)
  const BACK = c => c.kind === 'freeze' || c.kind === 'glitch' || (c.kind === 'censor' && c.mode === 'blur');
  const cardLayer = F.painted ? <><PaintFilterDefs f={F} />{P.on ? <PaintDefs /> : null}<AbsoluteFill style={{filter: `url(#gjPaint) saturate(${F.paintSat ?? 0.85}) sepia(${F.paintSepia ?? 0.16})`}}>
      {cards.map((c, i) => BACK(c) ? null : <Card key={i} c={c} t={t} words={words} dir={dir} />)}</AbsoluteFill>
    {cards.map((c, i) => BACK(c) ? <Card key={'b' + i} c={c} t={t} words={words} dir={dir} /> : null)}</> : cardLayer0;
  if (!F.desk) return <AbsoluteFill style={{background: '#000'}}>
    <Audio src={staticFile(`${dir}/vo.mp3`)} />{pics}{F.overCards ? cardLayer : null}<Finish f={finish} dir={dir} />{F.noise ? <Grain o={F.noise} /> : null}{F.overCards ? null : cardLayer}</AbsoluteFill>;   // overCards: grade-wide finish over the cards too (style 2)
  // desk: which print is on top now (a full-screen card counts as its own print), its tilt and paper
  const fc = cards.map((c, i) => [c, i]).filter(([c]) => isFull(c)).pop(), si = shots.filter(s => s.t <= t + 0.001).length - 1;
  const key = fc ? 100 + fc[1] : si, rot = (F.tilt ?? 0.4) * [-1, -0.4, 0.3, 0.8, -0.7, 0.5][key % 6], dx = ((key * 53) % 5 - 2) * 4, dy = ((key * 29) % 5 - 2) * 3;   // small tilt, no big flips (style review)
  const S = F.deskScale ?? 0.84, paper = fc ? '#F7F1E1' : '#FBFAF6';
  const tape = (l, tp, r) => <div style={{position: 'absolute', left: l, top: tp, width: 190, height: 54, background: 'rgba(236,224,190,0.78)', transform: `rotate(${r}deg)`, boxShadow: '0 2px 4px rgba(0,0,0,0.15)', zIndex: 5}} />;
  return <AbsoluteFill style={{background: '#2B2620'}}>
    <Audio src={staticFile(`${dir}/vo.mp3`)} />
    {F.deskImg ? <Img src={staticFile(`${dir}/${F.deskImg}`)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
    <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${S})`}}>
      <AbsoluteFill style={{background: paper, boxShadow: '0 28px 60px rgba(0,0,0,0.55), 0 6px 14px rgba(0,0,0,0.35)', transform: 'scale(1.035)'}} />
      <AbsoluteFill style={{overflow: 'hidden', background: '#111'}}>{pics}{F.noise ? <Grain o={F.noise} /> : null}{cardLayer}</AbsoluteFill>
      {tape(-60, -48, -8)}{tape(1790, -40, 9)}
    </AbsoluteFill>
    <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,${F.vignette ?? 0.35}) 100%)`}} />
  </AbsoluteFill>; };
