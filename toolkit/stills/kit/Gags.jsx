// Picture-gag overlays for the stills kit (Sam, 11 Nov 2026: "a detailed library of picture gags and various effects which we
// can give on our pictures and videos"). Each kind is a card in the scene plan: {at, word, kind, dur, ...options}.
// Positions x, y, w, h, r are fractions of the frame (0-1) unless noted. Every kind lists its paired sound in EFFECTS_LIBRARY.md.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, interpolate, Easing, delayRender, continueRender} from 'remotion';
import {Lottie} from '@remotion/lottie';
import {GAGS2} from './Gags2.jsx';   // gag-study cards (12 Nov 2026), painted-native

const cl = (v) => Math.min(1, Math.max(0, v));
const R = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.25, 1)});
const pop = (q, k = 1) => q < 0 ? 0 : 1 + 0.22 * k * Math.exp(-q * 7) * Math.sin(q * 22) - Math.exp(-q * 16);   // springy pop-in scale
const RED = '#E0261B', HAND = 'Kalam, cursive', SANS = 'Inter, "Helvetica Neue", Arial, sans-serif', MONO = '"JetBrains Mono", "Courier New", monospace', SERIF = '"Cormorant Garamond", Georgia, serif';
const W = 1920, H = 1080;
import {P, PAPER, INK, BRICK} from './Paint.jsx';   // painted mode (finish.gags: painted)

// painted mode for the older flat gags (Sam, 14 Nov 2026: "Paint all the gags"): with finish.gags painted, every colour of these
// kinds maps to the gouache palette and computer type turns to the painted faces. Flat videos keep their old look.
const PMAP = {'#FFFFFF': '#F3EBDD', '#FFF': '#F3EBDD', '#000': '#1F241F', '#000000': '#1F241F', '#050505': '#1F241F', '#0A0A0A': '#1F241F', '#111': '#26302A', '#E0261B': '#A8432F', '#D3121B': '#A8432F', '#C23B22': '#A8432F', '#8A1010': '#7A2E20', '#FCCF3E': '#E9B93A', '#F4D27A': '#E9B93A', '#22C55E': '#5AA866', '#7CFF9B': '#9CC98A', '#3B82F6': '#6B4E8C', '#F472B6': '#C97B84', '#1A2238': '#2E4A33', '#0E1A12': '#26302A', '#2F4A36': '#2E4A33', '#D4D0C8': '#EFE4CF', '#E4E0D8': '#E4D8C2', '#404040': '#26302A', '#7A5A00': '#7A5A20', '#F3EAD3': '#F3EBDD', '#BFE8FF': '#F6E7B0'};
export const PC = (h) => !P.on || typeof h !== 'string' ? h : h.replace(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/g, (x) => PMAP[x.toUpperCase()] || x);
export const PF = (f) => !P.on ? f : (f && f.includes('Mono') ? 'Kalam, cursive' : 'Fraunces, Georgia, serif');

export const gagCard = (c, t, dir) => { const f = GAGS[c.kind] || GAGS2[c.kind]; if (!f) return undefined;   // undefined: not a gag kind
  const d = c.dur || 2, q = t - c.t; if (q < 0 || q > d) return null;
  return f(c, q, d, c.cutOut ? 1 : 1 - R(t, c.t + d - 0.15, c.t + d), dir); };   // cutOut: hard cut out (plans with dissolve 0, Aliens ch3)


// Lottie animations (LottieFiles free animations, Lottie Simple License; Sam, 11 Nov 2026): c.file = a .json in the scene folder,
// placed at (x, y) (centre, 0-1), c.w = width as a share of the frame, c.loop, c.speed. Logged in media/<Prefix>_licence_log.csv.
const LottieGag = ({c, dir, out, inner}) => { const [data, setData] = React.useState(null); const [h] = React.useState(() => delayRender('lottie ' + c.file));
  React.useEffect(() => { fetch(staticFile(`${dir}/${c.file}`)).then(r => r.json()).then(j => { setData(j); continueRender(h); }).catch(() => continueRender(h)); }, []);
  if (!data) return null; const w = (c.w ?? 0.35) * W, ar = (data.h || 1) / (data.w || 1);
  if (inner) return <Sequence from={Math.round(c.t * 30)} layout="none"><Lottie animationData={data} loop={c.loop ?? true} playbackRate={c.speed ?? 1} style={{width: '100%', height: '100%'}} /></Sequence>;
  return <Sequence from={Math.round(c.t * 30)} layout="none"><div style={{position: 'absolute', left: (c.x ?? 0.5) * W - w / 2, top: (c.y ?? 0.5) * H - (w * ar) / 2, width: w, height: w * ar, opacity: out, transform: `rotate(${c.rot ?? 0}deg)`, ...(c.plate ? {background: P.on ? PAPER : c.plate, borderRadius: '50%', boxShadow: '0 6px 20px rgba(0,0,0,0.5)', ...(P.on ? {border: `5px solid ${INK}`} : {})} : {}), ...(P.on ? {filter: 'url(#pRough) sepia(0.35) saturate(0.85)'} : {})}}>
    <Lottie animationData={data} loop={c.loop ?? false} playbackRate={c.speed ?? 1} style={{width: '100%', height: '100%'}} /></div></Sequence>; };

const Pic = ({dir, f, style, filter}) => <Img src={staticFile(`${dir}/${f}`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: filter || 'none', ...style}} />;
const GAGS = {

  // ---- Built 11 Nov 2026 from the "to build" list in gag_schools.json (Sam: "start completing the existing gag chapters") ----

  // callin (South Park call-in box): one static photo in a phone-in box with a pulsing phone icon, and an ON THE LINE lower third.
  // c.img, c.name (caller), c.title (lower-third line). Our own mascot or anonymous stock only, never a real person's doctored face.
  callin: (c, q, d, out, dir) => { const p = Easing.out(Easing.cubic)(R(q, 0, 0.3)), ring = 1 + 0.08 * Math.sin(q * 18) * Math.exp(-q * 1.2);
    return <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', right: 80, top: 90, width: 620, height: 470, transform: `translateX(${(1 - p) * 120}%)`, border: PC('8px solid #FFFFFF'), boxShadow: '0 16px 44px rgba(0,0,0,0.55)', background: PC('#111'), overflow: 'hidden'}}>
        <Pic dir={dir} f={c.img} />
        <div style={{position: 'absolute', right: 18, top: 18, width: 84, height: 84, borderRadius: 42, background: PC('#FFFFFF'), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ring})`, boxShadow: '0 4px 14px rgba(0,0,0,0.4)'}}>
          <svg width="48" height="48" viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill={PC('#111')} /></svg></div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.72)', color: PC('#FFFFFF'), fontFamily: PF(SANS), fontWeight: 800, fontSize: 34, padding: '10px 18px'}}>{c.name || 'CALLER'}</div></div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, height: 110, display: 'flex', transform: `translateX(${(1 - p) * -110}%)`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <div style={{background: PC('#D3121B'), color: PC('#FFFFFF'), fontFamily: PF(SANS), fontWeight: 900, fontSize: 44, padding: '0 30px', display: 'flex', alignItems: 'center', letterSpacing: 2}}>ON THE LINE</div>
        <div style={{flex: 1, background: PC('#FFFFFF'), color: PC('#111'), fontFamily: PF(SANS), fontWeight: 800, fontSize: c.size || 50, display: 'flex', alignItems: 'center', padding: '0 30px', whiteSpace: 'nowrap', overflow: 'hidden'}}>{c.title || ''}</div></div></AbsoluteFill>; },

  // triptych (South Park slide talk): a lecture stage with three framed screens; pictures swap in on cues. c.imgs = the pictures,
  // c.slides = [[offset s, screen 0-2, picture index], ...] (a screen shows its latest slide), c.speaker = optional cut-out PNG on stage,
  // c.caps = optional caption per picture index. Full-screen card. Sound: a projector click on each swap.
  triptych: (c, q, d, out, dir) => { const sl = c.slides || [[0, 0, 0], [0.4, 1, 1], [0.8, 2, 2]], sw = 570, sh = 400, gap = 40, x0 = (W - 3 * sw - 2 * gap) / 2;
    return <AbsoluteFill style={{opacity: out * (c.cutIn ? 1 : R(q, 0, 0.12)), background: P.on ? 'linear-gradient(#E8DCC4 0%, #EFE4CF 70%, #9A7448 70%, #7C5A34 100%)' : 'linear-gradient(#2E2A26 0%, #3B352E 70%, #7A5532 70%, #5E3F22 100%)'}}>
      {[0, 1, 2].map(s => { const cur = sl.filter(x => x[1] === s && q >= x[0]).pop(), age = cur ? q - cur[0] : 0;
        if (!cur && c.hideEmpty) return null;
        return <div key={s} style={{position: 'absolute', left: x0 + s * (sw + gap), top: c.top ?? 170, width: sw, height: sh, background: P.on ? '#2B2620' : '#111', border: P.on ? `14px solid ${PAPER}` : '10px solid #1B1B1B', outline: P.on ? `3px solid ${INK}` : '4px solid #8A8A8A', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden', transform: P.on ? `rotate(${[-1.5, 1, -0.8][s]}deg)` : undefined}}>
          {cur ? <div style={{width: '100%', height: '100%', opacity: R(age, 0, 0.08)}}><Pic dir={dir} f={c.imgs[cur[2]]} />
            {c.caps && c.caps[cur[2]] ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: P.on ? 'rgba(243,235,221,0.92)' : 'rgba(0,0,0,0.7)', color: P.on ? INK : '#FFF', fontFamily: P.on ? HAND : SANS, fontWeight: 800, fontSize: (c.capSize ?? 40) * (P.on ? 1.1 : 1), textAlign: 'center', padding: '8px 10px'}}>{c.caps[cur[2]]}</div> : null}</div> : null}</div>; })}
      {c.stage === false ? null : <div style={{position: 'absolute', left: W / 2 - 360, top: 830, width: 720, height: 130, borderRadius: '50%', border: P.on ? `6px solid ${INK}` : '6px solid rgba(255,255,255,0.75)', opacity: P.on ? 0.6 : 1}} />}
      {c.speaker ? <Img src={staticFile(`${dir}/${c.speaker}`)} style={{position: 'absolute', left: W / 2 - 170, top: 470, width: 340, height: 420, objectFit: 'contain'}} /> : null}</AbsoluteFill>; },

  // ruler (South Park's crude scale diagram): a schoolroom ruler on flat yellow; c.max (ruler length in c.unit), c.marks =
  // [[value, label], ...] drawn as red ticks with labels, c.title on top. The joke is the tiny tick. Full-screen. Sound: marker squeak.
  ruler: (c, q, d, out) => { const x0 = 160, x1 = W - 160, y = 520, mx = c.max || 100, st = c.step || mx / 10, sx = v => x0 + (x1 - x0) * v / mx, p = Easing.out(Easing.cubic)(R(q, 0, 0.35));
    const big = Array.from({length: Math.floor(mx / st) + 1}, (_, i) => i * st).filter(v => mx - v > st * 0.4), small = Array.from({length: Math.floor(mx / (st / 5)) + 1}, (_, i) => i * st / 5);
    return <AbsoluteFill style={{opacity: out, background: c.ground || '#FCCF3E'}}>
      {c.title ? <div style={{position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center', fontFamily: P.on ? HAND : SANS, fontWeight: 900, fontSize: P.on ? 80 : 70, color: P.on ? INK : '#111'}}>{c.title}</div> : null}
      <svg width={W} height={H} style={{position: 'absolute', transform: `translateX(${(1 - p) * -100}%)`}}>
        <rect x={x0 - 30} y={y} width={x1 - x0 + 60} height={150} rx={10} fill="#F2E3B3" stroke={P.on ? INK : '#6B5A2A'} strokeWidth={5} filter={P.on ? 'url(#pRough)' : undefined} />
        {small.map((v, i) => <line key={'s' + i} x1={sx(v)} y1={y} x2={sx(v)} y2={y + 30} stroke="#3A2F12" strokeWidth={3} />)}
        {big.map((v, i) => <g key={'b' + i}><line x1={sx(v)} y1={y} x2={sx(v)} y2={y + 64} stroke="#3A2F12" strokeWidth={5} />
          <text x={sx(v)} y={y + 108} fontFamily={MONO} fontSize={34} textAnchor="middle" fill="#3A2F12">{v}</text></g>)}
        <line x1={x1} y1={y} x2={x1} y2={y + 64} stroke="#3A2F12" strokeWidth={5} />
        <text x={x1} y={y + 108} fontFamily={MONO} fontSize={34} textAnchor="middle" fill="#3A2F12">{mx}</text>
        <text x={x1 + 10} y={y + 142} fontFamily={MONO} fontSize={28} textAnchor="end" fill="#3A2F12">{c.unit || ''}</text>
        {(c.marks || []).map(([v, lab], i) => { const t = R(q, 0.5 + i * (c.gap ?? 0.7), 0.75 + i * (c.gap ?? 0.7)); if (t <= 0) return null; const x = sx(v), rt = x < W / 2;
          return <g key={i} opacity={t}><line x1={x} y1={y - 10} x2={x} y2={y + 150} stroke={P.on ? BRICK : RED} strokeWidth={9} strokeLinecap="round" />
            <line x1={x} y1={y - 20} x2={x + (rt ? 1 : -1) * 60} y2={y - 150} stroke={P.on ? BRICK : RED} strokeWidth={6} />
            <text x={x + (rt ? 1 : -1) * 70} y={y - 160} fontFamily={HAND} fontWeight={700} fontSize={64} textAnchor={rt ? 'start' : 'end'} fill={P.on ? BRICK : RED}>{lab}</text></g>; })}</svg></AbsoluteFill>; },

  // advert (South Park genre switch): a glossy mock advert. The picture pushes in slowly under a lens flare sweep, a gold serif title
  // rises in, and the last c.tagDur seconds cut to black with a white serif tagline. c.img, c.title, c.tagline. Full-screen.
  advert: (c, q, d, out, dir) => { const td = c.tagDur ?? 1.4, tag = q > d - td, s = 1.06 + 0.06 * (q / d), fx = -0.3 + 1.6 * R(q, 0.1, d - td);
    return <AbsoluteFill style={{opacity: out, background: PC('#000')}}>
      {!tag ? <><div style={{position: 'absolute', inset: 0, transform: `scale(${s})`}}><Pic dir={dir} f={c.img} filter="saturate(1.15) contrast(1.05)" /></div>
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${fx * 100}% 30%, rgba(255,240,200,0.85) 0, rgba(255,220,150,0.25) 8%, rgba(255,255,255,0) 22%)`, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: c.size || 150, letterSpacing: 4,
          color: PC('#F4D27A'), textShadow: '0 4px 24px rgba(0,0,0,0.8)', opacity: R(q, 0.3, 0.8), transform: `translateY(${(1 - R(q, 0.3, 0.8)) * 30}px)`}}>{c.title}</div></>
        : <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><div style={{fontFamily: SERIF, fontSize: 70, color: PC('#FFFFFF'), letterSpacing: 2, textAlign: 'center', whiteSpace: 'pre-line', opacity: R(q, d - td, d - td + 0.3)}}>{c.tagline}</div></AbsoluteFill>}</AbsoluteFill>; },

  // grey (Tanmay Bhat grey-out): the subject of the joke turns black and white while the rest stays in colour. A box (x, y, w, h,
  // fractions) is greyed, or the whole frame when no box. Only our own characters, stock or objects: never to mock a real, named person.
  grey: (c, q, d, out, dir) => { const g = R(q, 0, 0.3), bx = c.w ? [c.x, c.y, c.w, c.h] : [0, 0, 1, 1], s = c.scale ?? 1.04;
    const clip = `inset(${bx[1] * 100}% ${(1 - bx[0] - bx[2]) * 100}% ${(1 - bx[1] - bx[3]) * 100}% ${bx[0] * 100}% round ${c.r ?? 0}px)`;
    return <AbsoluteFill style={{opacity: out * g, clipPath: clip}}><div style={{position: 'absolute', inset: 0, transform: `scale(${s})`}}><Pic dir={dir} f={c.img} filter="grayscale(1) contrast(1.15)" /></div></AbsoluteFill>; },
  // c.img = the shot's own picture (put the shot on move "hold" so the grey copy lines up), c.scale = the shot's scale at that moment.

  // grid (Tanmay Bhat reaction grid): one line, then 2-6 reaction pictures pop in 0.1 s apart. c.imgs, c.labels (optional), c.cols.
  // Our mascot's expressions or anonymous stock only. Full-screen. Sound: one pop per tile.
  grid: (c, q, d, out, dir) => { const n = (c.imgs || []).length, cols = c.cols || (n <= 2 ? 2 : n <= 4 ? 2 : 3), rows = Math.ceil(n / cols), g = 8, w = (W - g * (cols + 1)) / cols, h = (H - g * (rows + 1)) / rows;
    return <AbsoluteFill style={{opacity: out, background: PC('#0A0A0A')}}>{c.imgs.map((im, i) => { const qi = q - i * (c.gap ?? 0.1); if (qi < 0) return null;
      return <div key={i} style={{position: 'absolute', left: g + (i % cols) * (w + g), top: g + Math.floor(i / cols) * (h + g), width: w, height: h, overflow: 'hidden', transform: `scale(${pop(qi, 0.4)})`}}>
        <Pic dir={dir} f={im} />{c.labels && c.labels[i] ? <div style={{position: 'absolute', left: 16, bottom: 14, background: PC('#FFFFFF'), color: PC('#111'), fontFamily: PF(SANS), fontWeight: 900, fontSize: 34, padding: '4px 14px'}}>{c.labels[i]}</div> : null}</div>; })}</AbsoluteFill>; },

  // namesake (Captain Disillusion): when an idea is named after a person, their real portrait (open licence, never AI) slides in beside
  // the idea and the name stamps onto it in bold yellow. c.img (portrait), c.idea (picture of the idea), c.name, c.stampAt (s).
  // Full-screen. Sound: impact on the stamp.
  namesake: (c, q, d, out, dir) => { const p = Easing.out(Easing.cubic)(R(q, 0, 0.35)), st = q - (c.stampAt ?? 0.6), sb = st < 0 ? 0 : 1 + 0.5 * Math.exp(-st * 9);
    return <AbsoluteFill style={{opacity: out, background: c.ground || PC('#1A2238')}}>
      <div style={{position: 'absolute', left: 120, top: 150, width: 720, height: 780, transform: `translateX(${(1 - p) * -130}%) rotate(-2deg)`, border: PC('12px solid #F3EAD3'), boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden', background: PC('#111')}}>
        <Pic dir={dir} f={c.img} style={{objectFit: c.fit || 'cover'}} /></div>
      {c.idea ? <div style={{position: 'absolute', right: 120, top: 230, width: 820, height: 620, transform: `translateX(${(1 - p) * 130}%)`, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden', borderRadius: 10}}><Pic dir={dir} f={c.idea} /></div> : null}
      {st >= 0 ? <div style={{position: 'absolute', left: 120, width: 720, top: 760, textAlign: 'center', fontFamily: PF(SANS), fontWeight: 900, fontSize: c.size || 110, color: PC('#FCCF3E'), letterSpacing: 3,
        textShadow: PC('0 6px 0 #7A5A00, 0 10px 30px rgba(0,0,0,0.8)'), transform: `scale(${sb}) rotate(-4deg)`}}>{c.name}</div> : null}</AbsoluteFill>; },

  // variants (Captain Disillusion variants board): the same picture shown 3-6 times, each with a named treatment, lit one by one.
  // c.img, c.items = [[label, css filter], ...], c.gap (s between tiles). Full-screen. Sound: a click per tile.
  variants: (c, q, d, out, dir) => { const it = c.items || [], n = it.length, cols = n <= 4 ? 2 : 3, rows = Math.ceil(n / cols), g = 26, w = (W - g * (cols + 1)) / cols, h = (H - 90 - g * (rows + 1)) / rows, gap = c.gap ?? 0.5;
    const curI = Math.min(n - 1, Math.floor(q / gap));
    return <AbsoluteFill style={{opacity: out, background: PC('#0E1A12')}}>
      {c.title ? <div style={{position: 'absolute', top: 18, left: 0, right: 0, textAlign: 'center', fontFamily: PF(MONO), fontSize: 44, color: PC('#7CFF9B'), letterSpacing: 6}}>{c.title}</div> : null}
      {it.map(([lab, f], i) => { const on = q >= i * gap;
        return <div key={i} style={{position: 'absolute', left: g + (i % cols) * (w + g), top: 90 + g + Math.floor(i / cols) * (h + g), width: w, height: h, overflow: 'hidden', outline: i === curI ? PC('6px solid #7CFF9B') : PC('2px solid #2F4A36'), opacity: on ? 1 : 0.25}}>
          <Pic dir={dir} f={c.img} filter={on ? f : 'grayscale(1) brightness(0.4)'} />
          <div style={{position: 'absolute', left: 0, top: 0, background: 'rgba(0,0,0,0.75)', color: PC('#7CFF9B'), fontFamily: PF(MONO), fontSize: 34, padding: '6px 14px', letterSpacing: 3}}>{lab}</div></div>; })}</AbsoluteFill>; },

  // count (South Park study, 11 Nov 2026: the "01 OF 50" black counter card + an escalating running gag): a small black box
  // with plain computer type that tallies a running gag each time it returns ("NOTHING · 1", "NOTHING · 2"...). c.text, c.x, c.y
  // (centre, 0-1), c.size. Pops in with a hard cut, no wobble: deadpan. Sound: one typewriter-like click or none.
  count: (c, q, d, out) => <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: (c.x ?? 0.5) * W, top: (c.y ?? 0.8) * H,
      transform: 'translate(-50%, -50%)', background: '#000000', color: '#FFFFFF', fontFamily: MONO, fontSize: c.size || 54, letterSpacing: 6,
      padding: '18px 40px', whiteSpace: 'pre', boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}}>{q < 0.05 ? '' : c.text}</div></AbsoluteFill>,

  // meter (Sam O'Nella's rating badge, study 2): a corner badge that rates each claim as it is spoken; c.steps = [[offset s,
  // label, colour], ...]. The rating must come from the fact-check verdict, never the joke.
  meter: (c, q, d, out) => { const st = (c.steps || [[0, 'SOLID', '#22C55E']]).filter(x => q >= x[0]).pop() || c.steps[0], since = q - st[0], s = pop(since, 0.6);
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><div style={{position: 'absolute', right: 60, top: 60, display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(14,16,20,0.88)', borderRadius: 18, padding: '12px 22px 12px 14px', transform: `scale(${s * (c.scale ?? 1.35)})`, transformOrigin: '100% 0', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
      <div style={{width: 58, height: 58, borderRadius: 29, background: st[2], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 34, color: '#111'}}>{st[3] || '!'}</div>
      <div><div style={{fontFamily: SANS, fontSize: 18, letterSpacing: 3, color: '#BBB'}}>{c.title || 'EVIDENCE'}</div><div style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, color: st[2]}}>{st[1]}</div></div></div></AbsoluteFill>; },

  // chain (Casually Explained's evolution chain, study 2): pictures in a row joined by red arrows, each landing in turn; c.imgs, c.labels, c.gap s
  chain: (c, q, d, out, dir) => { const n = (c.imgs || []).length, gap = c.gap ?? 0.55, w = Math.min(c.maxW ?? 540, (W - 160 - (n - 1) * 90) / n), y0 = H / 2 - w * 0.5, x0 = (W - (n * w + (n - 1) * 90)) / 2;
    return <AbsoluteFill style={{opacity: out, background: c.ground || (P.on ? PAPER : '#FFFFFF')}}>{c.imgs.map((im, i) => { const qi = q - (c.times ? c.times[i] : i * gap); if (qi < 0) return null; const x = x0 + i * (w + 90);   // c.times: per-picture offsets (cue each on its word)
      return <React.Fragment key={i}>{i && !c.noArrows ? <svg style={{position: 'absolute', left: x - 82, top: y0 + w * 0.32}} width={74} height={40}><path d="M4 20 L56 20 M44 8 L60 20 L44 32" stroke={P.on ? BRICK : RED} strokeWidth={8} filter={P.on ? 'url(#pRough)' : undefined} fill="none" strokeLinecap="round" /></svg> : null}
        <div style={{position: 'absolute', left: x, top: y0, width: w, height: w * 0.8, transform: `scale(${pop(qi, 0.7)})${P.on ? ` rotate(${i % 2 ? 1.5 : -1.5}deg)` : ''}`, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', overflow: 'hidden', borderRadius: P.on ? 2 : 8, ...(P.on ? {border: `3px solid ${INK}`} : {})}}><Img src={staticFile(`${dir}/${im}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
        {c.labels && c.labels[i] ? <div style={{position: 'absolute', left: x, width: w, top: y0 + w * 0.8 + 18, textAlign: 'center', fontFamily: HAND, fontWeight: P.on ? 700 : 400, fontSize: 54, color: P.on ? INK : '#111', opacity: R(qi, 0.1, 0.3)}}>{c.labels[i]}</div> : null}</React.Fragment>; })}</AbsoluteFill>; },

  // labels (Sam O'Nella's stacked label arrows, study 2): short labels arrive one by one, each with an arrow to the same point (x, y)
  labels: (c, q, d, out) => { const x = (c.x ?? 0.5) * W, y = (c.y ?? 0.55) * H, gap = c.gap ?? 0.6, spots = c.spots || [[0.2, 0.25], [0.8, 0.22], [0.15, 0.78], [0.85, 0.75], [0.5, 0.12]];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}>{(c.style === 'manicule' ? [] : c.items || []).map((t, i) => { const p = R(q, i * gap, i * gap + 0.25); if (p <= 0) return null; const [lx, ly] = spots[i % spots.length], ax = lx * W, ay = ly * H;
        const ex = ax + (x - ax) * 0.82 * p, ey = ay + (y - ay) * 0.82 * p; return <path key={i} d={`M ${ax} ${ay + 30} L ${ex} ${ey}`} stroke="#FCCF3E" strokeWidth={7} strokeLinecap="round" />; })}</svg>
      {c.style === 'manicule' ? (c.items || []).map((t, i) => { const qi = q - i * gap; if (qi < 0) return null; const [lx, ly] = spots[i % spots.length], ax = lx * W, ay = ly * H, a = Math.atan2(y - ay, x - ax) * 180 / Math.PI;   // Map Men pointing hands (gag study 12 Nov 2026)
        return <div key={'m' + i} style={{position: 'absolute', left: ax, top: ay, transform: `translate(-50%, -50%) scale(${pop(qi, 0.5)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: c.size || 50, color: '#2A2724', background: 'rgba(241,230,207,0.92)', padding: '0 16px 4px', borderRadius: 6, whiteSpace: 'nowrap'}}>{t}</div>
          <svg width={120} height={70} viewBox="0 0 120 70" style={{transform: `rotate(${a}deg)`, overflow: 'visible'}}>{/* a drawn pointing hand (the ☞ glyph is missing from the render fonts) */}
            <g fill="#F1E6CF" stroke="#2A2724" strokeWidth={4} strokeLinejoin="round"><path d="M 4 22 C 4 14 10 10 18 10 L 30 10 C 36 4 44 4 50 10 L 108 10 C 116 10 116 24 108 24 L 66 24 L 66 30 C 74 30 74 40 66 40 L 66 46 C 72 46 72 56 64 56 L 60 56 C 64 62 58 68 52 66 L 18 66 C 8 66 4 58 4 50 Z" />
              <path d="M 66 24 L 50 24 M 66 40 L 52 40 M 64 56 L 50 56" fill="none" /><path d="M 2 18 L 2 60" strokeWidth={8} stroke="#2A2724" /></g></svg></div>; }) : null}
      {c.style === 'manicule' ? null : (c.items || []).map((t, i) => { const qi = q - i * gap; if (qi < 0) return null; const [lx, ly] = spots[i % spots.length];
        return <div key={i} style={{position: 'absolute', left: lx * W, top: ly * H, transform: `translate(-50%, -50%) scale(${pop(qi, 0.6)}) rotate(${(i % 2 ? 4 : -4)}deg)`, fontFamily: HAND, fontSize: c.size || 60, color: '#FCCF3E', textShadow: '0 3px 10px rgba(0,0,0,0.85)', whiteSpace: 'nowrap',
          ...(c.chip === false ? {} : {background: 'rgba(14,12,10,0.62)', padding: '0 18px 6px', borderRadius: 10})}}>{t}</div>; })}</AbsoluteFill>; },   // dark chip: thin yellow handwriting was lost over busy painted dials (reviewer, Aliens ch1 v10)

  // sticker (Indian vlog texture, edit study 11 Nov 2026): a cut-out object (PNG with transparency, or a Lottie json) with a thick
  // white border pops in, wobbles and stays; c.img or c.file, at (x, y), c.w share of width
  // c.path = [[offset s, x, y, rot], ...] (Internet Historian puppet path, gag study 12 Nov 2026): the cut-out travels between the
  // keyframes (eased), so one card spanning several shots carries the same object across them. c.border: false drops the white edge.
  sticker: (c, q, d, out, dir) => { if (c.path && c.path.length) { const KP = c.path, k = KP.findIndex(p => p[0] > q), a = KP[Math.max(0, (k < 0 ? KP.length : k) - 1)], b = KP[k < 0 ? KP.length - 1 : k], u = a === b ? 1 : Easing.inOut(Easing.cubic)(cl((q - a[0]) / (b[0] - a[0])));
      c = {...c, x: a[1] + (b[1] - a[1]) * u, y: a[2] + (b[2] - a[2]) * u, rot: (a[3] ?? 0) + ((b[3] ?? 0) - (a[3] ?? 0)) * u}; }
    const s = c.path ? 1 : pop(q, 1.2), w = (c.w ?? 0.2) * W, wob = c.path ? 0 : 4 * Math.sin(q * 3);
    const edge = c.border === false ? 'drop-shadow(0 10px 14px rgba(0,0,0,0.45))' : 'drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(0 10px 14px rgba(0,0,0,0.45))';
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><div style={{position: 'absolute', left: (c.x ?? 0.75) * W - w / 2, top: (c.y ?? 0.4) * H - w / 2, width: w, height: w, transform: `scale(${s}) rotate(${(c.rot ?? -6) + wob}deg)`, filter: P.on ? 'drop-shadow(3px 0 0 #26302A) drop-shadow(-3px 0 0 #26302A) drop-shadow(0 3px 0 #26302A) drop-shadow(0 -3px 0 #26302A) drop-shadow(0 10px 14px rgba(0,0,0,0.45))' : edge, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {c.file ? <LottieGag c={{...c, x: 0.5, y: 0.5, w: 1}} dir={dir} out={1} inner /> : <Img src={staticFile(`${dir}/${c.img}`)} style={{maxWidth: '100%', maxHeight: '100%'}} />}</div>
      {c.text ? <div style={{position: 'absolute', left: (c.x ?? 0.75) * W, top: (c.y ?? 0.4) * H + w * 0.55, transform: `translateX(-50%) rotate(-3deg) scale(${pop(q - 0.15)})`, background: '#FCCF3E', color: '#111', fontFamily: SANS, fontWeight: 900, fontSize: 40, padding: '4px 18px', borderRadius: 8, whiteSpace: 'nowrap'}}>{c.text}</div> : null}</AbsoluteFill>; },

  // burst (gag sting, Climate Town's "DANG!" shape): 3-4 pictures slam in tilted around one big word, about a second, then gone
  burst: (c, q, d, out, dir) => { const imgs = c.imgs || [], pos = [[0.22, 0.32, -10], [0.78, 0.3, 8], [0.25, 0.75, 6], [0.76, 0.74, -7]];
    return <AbsoluteFill style={{opacity: out, background: `rgba(0,0,0,${0.35 * R(q, 0, 0.05)})`}}>
      {imgs.slice(0, 4).map((im, i) => { const qi = q - i * 0.07; if (qi < 0) return null; const [x, y, r] = pos[i];
        return <div key={i} style={{position: 'absolute', left: x * W - 330, top: y * H - 190, width: 660, height: 380, border: PC('10px solid #FFF'), boxShadow: '0 14px 40px rgba(0,0,0,0.6)', overflow: 'hidden', transform: `rotate(${r}deg) scale(${pop(qi, 0.8)})`}}>
          <Img src={staticFile(`${dir}/${im}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>; })}
      <div style={{position: 'absolute', left: 0, right: 0, top: H / 2 - 130, textAlign: 'center', fontFamily: PF(SANS), fontWeight: 900, fontSize: c.size || 220, color: c.color || PC('#FCCF3E'), letterSpacing: 4,
        textShadow: PC('8px 8px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000'), transform: `rotate(-6deg) scale(${pop(q - 0.2, 1.4)})`}}>{c.text}</div></AbsoluteFill>; },

  // grow: the spoken line, each word bigger than the last (OverSimplified's escalation); words on a dim band over the picture.
  // c.text; c.times = word start offsets in s (default every 0.3 s)
  grow: (c, q, d, out) => { const ws = c.text.split(' '), tm = c.times || ws.map((_, i) => i * 0.3), base = c.size || 70, k = c.k ?? 1.18;
    return <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.35)'}}><div style={{maxWidth: 1700, textAlign: 'center', lineHeight: 1.05}}>
      {ws.map((w, i) => { const p = R(q, tm[i], tm[i] + 0.12); return <span key={i} style={{display: 'inline-block', marginRight: '0.25em', opacity: p, fontFamily: PF(SANS), fontWeight: 900, color: i === ws.length - 1 ? (c.color || PC('#FCCF3E')) : PC('#FFFFFF'),
        fontSize: base * Math.pow(k, i), transform: `scale(${0.6 + 0.4 * p})`, textShadow: '0 6px 18px rgba(0,0,0,0.7)'}}>{w}</span>; })}</div></AbsoluteFill>; },

  // doc: a document slides in from the right at an angle, then its key line is lifted out as big highlighted text (Climate Town)
  // Gag study 12 Nov 2026: c.update = Coffeezilla's "update footnote", a small-caps line in red stamped under the quote at c.updateAt s
  // (default 1.6) saying what happened later ("– cancelled the next year"). Must be a fact-checked outcome. Sound: click or typeding.
  // c.marks = SunnyV2's colour-coded highlighter on the page's lines: [[line, 'good' | 'bad', at s], ...], green for praise, red for damage.
  doc: (c, q, d, out, dir) => { const p = Easing.out(Easing.cubic)(R(q, 0, 0.35)), hl = R(q, 0.7, 1.0), MK = P.on ? {good: '#8DB36B', bad: '#C9654E'} : {good: '#5BE37D', bad: '#FF5A4E'}, LC = P.on ? '#C9BCA2' : LC, HY = P.on ? '#E9B93A' : HY, mk = {};
    (c.marks || []).forEach(([j, k, at]) => { mk[j] = [MK[k] || k, R(q, at ?? 0.5, (at ?? 0.5) + 0.35)]; });
    // c.focus = line: Jarvis Johnson focus-blur read: every other line blurs and fades, the read line stays sharp (12 Nov 2026)
    const fz = c.focus !== undefined ? R(q, 0.5, 0.8) : 0, lineSt = j => (c.focus !== undefined && j !== c.focus ? {filter: `blur(${4 * fz}px)`, opacity: 1 - 0.5 * fz} : {});
    const lineBg = j => j === (c.line ?? 6) && c.quote ? `linear-gradient(90deg, ${HY} ${hl * 100}%, ${LC} ${hl * 100}%)` : mk[j] ? `linear-gradient(90deg, ${mk[j][0]} ${mk[j][1] * 100}%, ${LC} ${mk[j][1] * 100}%)` : LC;
    const uq = q - (c.updateAt ?? 1.6), us = uq < 0 ? 0 : 1 + 0.35 * Math.exp(-uq * 10);
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', right: 120 - (1 - p) * 900, top: 90, width: 620, height: 800, background: P.on ? PAPER : '#FFF', border: P.on ? `4px solid ${INK}` : 'none', boxShadow: '0 24px 60px rgba(0,0,0,0.55)', transform: `rotate(${4 - 2 * p}deg)`, overflow: 'hidden'}}>
        {c.img ? <Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{padding: 50, fontFamily: P.on ? 'Fraunces, Georgia, serif' : 'Georgia, serif', color: P.on ? INK : '#222'}}><div style={{fontSize: 34, fontWeight: 700, marginBottom: 24}}>{c.title}</div>
          {Array.from({length: 14}).map((_, j) => <div key={j} style={{height: mk[j] || c.focus === j ? 18 : 12, margin: mk[j] || c.focus === j ? '13px 0' : '16px 0', background: c.focus === j ? `linear-gradient(90deg, ${HY} ${fz * 100}%, ${LC} ${fz * 100}%)` : lineBg(j), width: `${75 + ((j * 29) % 25)}%`, ...lineSt(j)}} />)}</div>}</div>
      {c.translate ? <div style={{position: 'absolute', left: 90, top: 140, width: 1000, display: 'flex', flexDirection: 'column', gap: 26}}>{c.translate.map(([orig, plain], i) => { const qi = q - 0.5 - i * (c.gap ?? 0.8); if (qi < 0) return null;   // LEMMiNO original + translation (12 Nov 2026)
        const n = Math.min(plain.length, Math.floor(qi * 45)); return <div key={i} style={{display: 'flex', gap: 30, alignItems: 'baseline'}}>
          <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 60, color: '#F1E6CF', minWidth: 220, textShadow: '0 3px 10px #000'}}>{orig}</span>
          <span style={{fontFamily: SERIF, fontWeight: 600, fontSize: 50, color: '#2A2724', background: '#E8C547', padding: '0 14px 4px', borderRadius: 4, whiteSpace: 'nowrap'}}>{plain.slice(0, n)}</span></div>; })}</div> : null}
      <div style={{position: 'absolute', left: 90, right: 820, bottom: 130, opacity: c.quote ? hl : 1, transform: `translateY(${(1 - (c.quote ? hl : 1)) * 30}px)`}}>{c.quote ? <span style={{background: HY, color: '#111', fontFamily: SERIF, fontWeight: 600, fontSize: c.size || 58, lineHeight: 1.35, padding: '2px 12px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{c.quote}</span> : null}
        {c.source ? <div style={{marginTop: 14, fontFamily: SANS, fontSize: 28, color: '#FFF', textShadow: '0 2px 8px #000'}}>{c.source}</div> : null}
        {c.update && uq >= 0 ? <div style={{marginTop: 22, display: 'inline-block', transform: `scale(${us})`, transformOrigin: '0 50%', background: '#111', color: '#FF5A4E', fontFamily: SANS, fontWeight: 900, fontSize: c.updateSize || 46, letterSpacing: 4, textTransform: 'uppercase', padding: '8px 20px', boxShadow: '0 6px 20px rgba(0,0,0,0.5)'}}>{c.update}</div> : null}</div></AbsoluteFill>; },
  // overlay footage (Mixkit Stock Video Free License): a texture clip over the picture with a blend mode (screen for light and static)
  overlay: (c, q, d, out, dir) => <AbsoluteFill style={{opacity: out * (c.opacity ?? 0.6), mixBlendMode: c.blend || 'screen', pointerEvents: 'none'}}>
    <Sequence from={Math.round(c.t * 30)} layout="none"><OffthreadVideo muted src={staticFile(`${dir}/${c.file}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence></AbsoluteFill>,
  lottie: (c, q, d, out, dir) => <AbsoluteFill style={{pointerEvents: 'none'}}><LottieGag c={c} dir={dir} out={out} /></AbsoluteFill>,
  // freeze-frame caption ("Yep. That's me." / "You're probably wondering how I got here"): the picture goes grey, a label lands
  freeze: (c, q, d, out) => <AbsoluteFill style={{opacity: out}}>
    <AbsoluteFill style={{backdropFilter: P.on ? `sepia(${0.7 * R(q, 0, 0.12)}) contrast(1.05)` : `grayscale(${R(q, 0, 0.12)}) contrast(1.1)`, background: 'rgba(0,0,0,0.12)'}} />
    <div style={{position: 'absolute', left: 90, bottom: 110, transform: `translateX(${(1 - R(q, 0.05, 0.3)) * -120}%)`, background: P.on ? PAPER : '#FCCF3E', color: P.on ? INK : '#111', fontFamily: P.on ? HAND : SANS, fontWeight: 900, border: P.on ? `4px solid ${INK}` : 'none', borderRadius: P.on ? 6 : 0,
      fontSize: c.size || 70, padding: '14px 34px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', whiteSpace: 'pre-line', lineHeight: 1.05}}>{c.text}</div></AbsoluteFill>,

  // hand-drawn red circle around a detail (draws on in 0.45 s), optional scribbled label
  circle: (c, q, d, out) => { const cx = (c.x ?? 0.5) * W, cy = (c.y ?? 0.5) * H, rx = (c.rx ?? 0.12) * W, ry = (c.ry ?? c.rx ?? 0.12) * H * (W / H) * 0.56, p = R(q, 0, 0.45), L = 2 * Math.PI * Math.max(rx, ry) * 1.15;
    const path = `M ${cx + rx} ${cy} C ${cx + rx} ${cy - ry * 1.3}, ${cx - rx * 1.1} ${cy - ry * 1.15}, ${cx - rx} ${cy + ry * 0.05} C ${cx - rx * 0.95} ${cy + ry * 1.25}, ${cx + rx * 1.05} ${cy + ry * 1.2}, ${cx + rx * 1.02} ${cy - ry * 0.25} L ${cx + rx * 0.9} ${cy - ry * 0.5}`;
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H}><path d={path} fill="none" stroke={c.color || RED} strokeWidth={c.stroke || 12} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} /></svg>
      {c.text ? <div style={{position: 'absolute', left: cx + rx * 0.7, top: cy - ry - 90, fontFamily: HAND, fontSize: c.size || 66, color: c.color || RED, opacity: R(q, 0.35, 0.55), transform: 'rotate(-6deg)', whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(255,255,255,0.35)'}}>{c.text}</div> : null}</AbsoluteFill>; },

  // red arrow from a label to a target point (x, y), drawn on
  arrow: (c, q, d, out) => { const x1 = (c.x ?? 0.6) * W, y1 = (c.y ?? 0.5) * H, x0 = (c.fx ?? 0.25) * W, y0 = (c.fy ?? 0.2) * H, p = R(q, 0.1, 0.45);
    const mx = (x0 + x1) / 2 + (y1 - y0) * 0.2, my = (y0 + y1) / 2 - (x1 - x0) * 0.2, L = Math.hypot(x1 - x0, y1 - y0) * 1.2, a = Math.atan2(y1 - my, x1 - mx);
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H}><path d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`} fill="none" stroke={c.color || PC(RED)} strokeWidth={12} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
      {p > 0.95 ? <path d={`M ${x1} ${y1} L ${x1 - 50 * Math.cos(a - 0.45)} ${y1 - 50 * Math.sin(a - 0.45)} M ${x1} ${y1} L ${x1 - 50 * Math.cos(a + 0.45)} ${y1 - 50 * Math.sin(a + 0.45)}`} stroke={c.color || PC(RED)} strokeWidth={12} strokeLinecap="round" /> : null}</svg>
      <div style={{position: 'absolute', left: x0, top: y0, transform: `translate(-50%, -110%) rotate(-4deg) scale(${pop(q)})`, fontFamily: HAND, fontSize: c.size || 64, color: c.color || PC(RED), whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(255,255,255,0.4)'}}>{c.text}</div></AbsoluteFill>; },

  // censor: a black bar with a label, or a blurred mosaic box (mode 'blur'), over a region
  censor: (c, q, d, out) => { const x = (c.x ?? 0.4) * W, y = (c.y ?? 0.4) * H, w = (c.w ?? 0.2) * W, h = (c.h ?? 0.08) * H, on = q > (c.delay ?? 0);
    if (!on) return null;
    return <AbsoluteFill style={{opacity: out}}>{c.mode === 'blur'
      ? <div style={{position: 'absolute', left: x, top: y, width: w, height: h, backdropFilter: 'blur(26px) saturate(1.4)', backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px'}} />
      : <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: PC('#050505'), transform: `rotate(${c.rot ?? -2}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: PF(MONO), fontWeight: 800, fontSize: Math.min(h * 0.55, 64), color: PC('#FFFFFF'), letterSpacing: 6}}>{c.text ?? 'CENSORED'}</div>}</AbsoluteFill>; },

  // iris-out (old cartoon ending): a black circle closes on (x, y), holds a moment, then goes black
  iris: (c, q, d) => { const p = R(q, 0, d * 0.6), r = 1300 * (1 - p) + (c.hold ?? 110) * p * (1 - R(q, d * 0.75, d)), x = (c.x ?? 0.5) * 100, y = (c.y ?? 0.5) * 100;
    return <AbsoluteFill style={{background: `radial-gradient(circle ${Math.max(0.1, r)}px at ${x}% ${y}%, rgba(0,0,0,0) 99%, ${PC('#000')} 100%)`}} />; },

  // VHS / glitch burst: scan lines, tearing bands, colour fringes, an on-screen "PLAY" read-out
  glitch: (c, q, d, out) => { const n = Math.floor(q * 30), r = (k) => ((Math.sin((n + 1) * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 5px)'}} />
      {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: r(i) * H, height: 10 + r(i + 9) * 70, backdropFilter: `hue-rotate(${r(i + 3) * 180}deg) saturate(3)`, transform: `translateX(${(r(i + 5) - 0.5) * 120}px)`, background: 'rgba(255,0,80,0.08)'}} />)}
      <AbsoluteFill style={{boxShadow: `inset ${(r(7) - 0.5) * 30}px 0 0 rgba(0,255,255,0.25), inset ${(r(8) - 0.5) * -30}px 0 0 rgba(255,0,0,0.25)`}} />
      <div style={{position: 'absolute', left: 90, top: 70, fontFamily: MONO, fontWeight: 800, fontSize: 64, color: '#FFFFFF', textShadow: '3px 0 #f0f, -3px 0 #0ff'}}>{c.text ?? 'PLAY ▶'}</div>
      <div style={{position: 'absolute', right: 90, bottom: 80, fontFamily: MONO, fontSize: 48, color: '#FFFFFF', textShadow: '3px 0 #f0f, -3px 0 #0ff'}}>{c.stamp ?? ''}</div></AbsoluteFill>; },

  // expectation vs reality: two pictures side by side with labels (full screen).
  // c.grow = 0 | 1 ("the winner grows", SunnyV2, gag study 12 Nov 2026): at c.grow_at s that panel expands to fill the frame in 0.45 s
  // and pushes the other off its edge. Sound: whoosh at grow_at (+ a soft boom when it lands).
  split: (c, q, d, out, dir) => { const p = c.noSlide ? 1 : R(q, 0, 0.25), gi = c.grow, g = gi === 0 || gi === 1 ? Easing.out(Easing.cubic)(R(q, c.grow_at ?? 1.0, (c.grow_at ?? 1.0) + 0.45)) : 0;
    const xb = gi === 0 ? W / 2 + (W / 2) * g : gi === 1 ? W / 2 - (W / 2) * g : W / 2;   // the divider's x
    const half = (img, lab, side) => { const left = side ? xb : 0, width = side ? W - xb : xb, shrinks = gi !== undefined && gi !== side;
      return <div style={{position: 'absolute', top: 0, bottom: 0, width, left, overflow: 'hidden', transform: `translateY(${(1 - p) * (side ? 100 : -100)}%)`}}>
        <Img src={staticFile(`${dir}/${img}`)} style={shrinks ? {position: 'absolute', top: 0, height: '100%', width: W / 2, maxWidth: 'none', objectFit: 'cover', left: side ? 0 : width - W / 2} : {width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', opacity: shrinks ? 1 - g : 1, whiteSpace: 'nowrap'}}><span style={{background: side ? (P.on ? BRICK : RED) : (P.on ? PAPER : '#FFFFFF'), color: side ? (P.on ? PAPER : '#FFFFFF') : (P.on ? INK : '#111'), fontFamily: P.on ? HAND : SANS, fontWeight: 900, border: P.on ? `3px solid ${INK}` : 'none', fontSize: 64 * (shrinks ? 1 : 1 + 0.25 * g), padding: '8px 30px', letterSpacing: 3}}>{lab}</span></div></div>; };
    return <AbsoluteFill style={{opacity: out, background: '#000'}}>{half(c.imgs[0], (c.labels || ['EXPECTATION'])[0], 0)}{half(c.imgs[1], (c.labels || [, 'REALITY'])[1] || 'REALITY', 1)}
      {g < 1 && !c.chevron ? <div style={{position: 'absolute', left: xb - 4, top: 0, bottom: 0, width: 8, background: P.on ? PAPER : '#FFFFFF', filter: P.on ? 'url(#pRough)' : undefined}} /> : null}
      {g < 1 && c.chevron ? <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}><path d={`M ${xb - 40} 0 L ${xb + 10} 0 L ${xb + 80} ${H / 2} L ${xb + 10} ${H} L ${xb - 40} ${H} L ${xb + 30} ${H / 2} Z`} fill={c.chevronColor || (P.on ? PAPER : '#F1E6CF')} filter={P.on ? 'url(#pRough)' : undefined} /></svg> : null}</AbsoluteFill>; },   // chevron: Kurzgesagt before -> after notch (gag study 12 Nov 2026)

  // route (Internet Historian route draw, gag study 12 Nov 2026): a red line draws itself point by point over a map or photo and
  // ends in a hand-drawn circle. c.pts = [[x, y], ...] (fractions), c.draw = drawing time s (default 1.0), c.dash = dashed (a flight
  // path), c.end = 'circle' (default) | 'x' | 'none', c.text = scribbled label at the end, c.stamp = a verdict slammed at the end point
  // (e.g. "CANCELLED", for a line that stops dead), c.stampAt s. Overlay on the shot. Sound: squeak while drawing, ding on the circle,
  // boom on the stamp.
  // c.curve: true bends the path into a smooth wander (Catmull-Rom); c.end: 'question' ends it in a hand-lettered "???" (Cleo Abram's
  // uncertain path, gag study 13 Nov 2026). Sound for the question: a small boing.
  route: (c, q, d, out) => { const P0 = (c.pts || [[0.2, 0.7], [0.5, 0.4], [0.8, 0.3]]).map(([x, y]) => [x * W, y * H]);
    const pts = !c.curve ? P0 : P0.slice(0, -1).flatMap((p1, i) => { const p0 = P0[i - 1] || p1, p2 = P0[i + 1], p3 = P0[i + 2] || p2;
      return Array.from({length: 12}, (_, k) => { const t = k / 12, t2 = t * t, t3 = t2 * t; return [0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)); }); }).concat([P0[P0.length - 1]]), seg = pts.slice(1).map((v, i) => Math.hypot(v[0] - pts[i][0], v[1] - pts[i][1])),
      tot = seg.reduce((a, b) => a + b, 0), p = R(q, 0.1, 0.1 + (c.draw ?? 1.0)), col = c.color || (P.on ? BRICK : RED), done = p >= 1, [ex, ey] = pts[pts.length - 1];
    let need = tot * p; const drawn = [pts[0]];   // the part of the polyline drawn so far
    for (let i = 0; i < seg.length && need > 0; i++) { const k = Math.min(1, need / seg[i]); drawn.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]); need -= seg[i]; }
    const line = drawn.map(v => v.join(',')).join(' '), qe = q - 0.1 - (c.draw ?? 1.0), cr = 46, L = 2 * Math.PI * cr * 1.2, cp = R(qe, 0, 0.35), end = c.end || 'circle';
    const st = q - (c.stampAt ?? 0.1 + (c.draw ?? 1.0) + 0.35), sb = st < 0 ? 0 : 1 + 0.6 * Math.exp(-st * 10);
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}><g filter={P.on ? 'url(#pBrush)' : undefined}>
        <polyline points={line} fill="none" stroke={P.on ? 'rgba(243,235,221,0.85)' : 'rgba(255,255,255,0.85)'} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={c.dash ? '2 34' : undefined} />
        <polyline points={line} fill="none" stroke={col} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={c.dash ? '26 18' : undefined} />
        <circle cx={pts[0][0]} cy={pts[0][1]} r={14} fill={col} stroke="#FFF" strokeWidth={5} />
        {!done ? <circle cx={drawn[drawn.length - 1][0]} cy={drawn[drawn.length - 1][1]} r={11} fill="#FFF" stroke={col} strokeWidth={5} /> : null}
        {done && end === 'circle' ? <path d={`M ${ex + cr} ${ey} C ${ex + cr} ${ey - cr * 1.35}, ${ex - cr * 1.15} ${ey - cr * 1.2}, ${ex - cr} ${ey} C ${ex - cr} ${ey + cr * 1.3}, ${ex + cr * 1.1} ${ey + cr * 1.25}, ${ex + cr} ${ey - cr * 0.3}`}
          fill="none" stroke={col} strokeWidth={10} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - cp)} /> : null}
        {done && end === 'question' ? <text x={ex + 20} y={ey + 30} fontFamily={HAND} fontSize={c.size || 140} fill={col} transform={`rotate(-6 ${ex} ${ey})`} opacity={cp} stroke="#FFFFFF" strokeWidth={3} paintOrder="stroke">???</text> : null}
        {done && end === 'x' ? <path d={`M ${ex - 36} ${ey - 36} L ${ex + 36} ${ey + 36} M ${ex + 36} ${ey - 36} L ${ex - 36} ${ey + 36}`} stroke={col} strokeWidth={14} strokeLinecap="round" opacity={cp} /> : null}</g></svg>
      {done && c.text ? <div style={{position: 'absolute', left: ex + (ex > W * 0.7 ? -60 : 60), top: c.stamp ? ey + 40 : ey - 110, transform: `translateX(${ex > W * 0.7 ? '-100%' : '0'}) rotate(-5deg) scale(${pop(qe, 0.6)})`, fontFamily: HAND, fontWeight: P.on ? 700 : 400, fontSize: c.size || 64, color: col, whiteSpace: 'nowrap', textShadow: '0 2px 10px rgba(255,255,255,0.6)'}}>{c.text}</div> : null}
      {c.stamp && st >= 0 ? <div style={{position: 'absolute', left: ex, top: ey - (c.stampLift ?? 110), transform: `translate(-50%, -50%) rotate(${c.rot ?? -10}deg) scale(${sb})`, border: `10px solid ${col}`, color: col, fontFamily: SANS, fontWeight: 900, fontSize: c.stampSize || 96, letterSpacing: 6, padding: '6px 30px', background: c.plate ?? 'rgba(255,250,240,0.9)', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.45)'}}>{c.stamp}</div> : null}</AbsoluteFill>; },

  // pov (Danny Gonzalez's "object's point of view", gag study 12 Nov 2026): we see through the machine's camera. HUD corner brackets,
  // a centre reticle, a blinking readout and scan lines over c.img (full frame, focus-hunts in: blur, then sharp) or over the shot
  // when no c.img. c.label = top-left readout ("NAVCAM · SOL 1217"), c.lines = readout lines typed one by one at the bottom (each
  // c.gap s apart), c.tint = 'green' | 'blue' | 'none'. Anonymous AI faces or objects only, never a real person. Sound: servo + ping.
  pov: (c, q, d, out, dir) => { const foc = R(q, 0, 0.35), gap = c.gap ?? 0.6, tint = {green: 'rgba(60,255,140,0.10)', blue: 'rgba(80,170,255,0.12)', none: 'rgba(0,0,0,0)'}[c.tint || (P.on ? 'none' : 'green')], hud = c.hud || (P.on ? PAPER : '#B8FFD0');
    const br = (st) => <div style={{position: 'absolute', width: 140, height: 100, borderColor: hud, borderStyle: 'solid', borderWidth: 0, opacity: 0.9, ...st}} />;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      {c.img ? <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}><div style={{position: 'absolute', inset: 0, transform: `scale(${1.18 - 0.06 * foc + 0.01 * Math.sin(q * 2.2)})`}}>
        <Pic dir={dir} f={c.img} filter={`blur(${(1 - foc) * 9}px) contrast(1.12) saturate(0.75)`} /></div></AbsoluteFill> : null}
      <AbsoluteFill style={{background: tint, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, height: 90, top: ((q * 0.45) % 1) * H - 45, background: 'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.07), rgba(255,255,255,0))'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.75) 100%)'}} />
      {br({left: 70, top: 70, borderTopWidth: 6, borderLeftWidth: 6})}{br({right: 70, top: 70, borderTopWidth: 6, borderRightWidth: 6})}
      {br({left: 70, bottom: 70, borderBottomWidth: 6, borderLeftWidth: 6})}{br({right: 70, bottom: 70, borderBottomWidth: 6, borderRightWidth: 6})}
      <svg width={W} height={H} style={{position: 'absolute', opacity: 0.8}}><g filter={P.on ? 'url(#pRough)' : undefined} stroke={hud} strokeWidth={3} fill="none">
        <circle cx={W / 2} cy={H / 2} r={64 + (1 - foc) * 60} /><path d={`M ${W / 2 - 120} ${H / 2} h 40 M ${W / 2 + 80} ${H / 2} h 40 M ${W / 2} ${H / 2 - 120} v 40 M ${W / 2} ${H / 2 + 80} v 40`} /></g></svg>
      <div style={{position: 'absolute', left: 110, top: 100, fontFamily: P.on ? 'Fraunces, Georgia, serif' : MONO, fontSize: 40, color: hud, letterSpacing: 3, display: 'flex', alignItems: 'center', gap: 16}}>
        <span style={{width: 22, height: 22, borderRadius: 11, background: RED, opacity: Math.floor(q * 2.5) % 2 ? 0.25 : 1}} />{c.label ?? 'CAM 01'}</div>
      <div style={{position: 'absolute', right: 110, top: 100, fontFamily: MONO, fontSize: 32, color: hud, letterSpacing: 2}}>{foc < 1 ? 'FOCUSING…' : 'LOCK'}</div>
      <div style={{position: 'absolute', left: 110, bottom: 100, fontFamily: MONO, fontSize: c.size || 50, color: hud, letterSpacing: 4, lineHeight: 1.3, textShadow: '0 0 10px rgba(0,0,0,0.9)'}}>
        {(c.lines || []).map((l, i) => { const qi = q - 0.4 - i * gap; if (qi < 0) return null; const n = Math.min(l.length, Math.floor(qi * 40)); return <div key={i}>{'> ' + l.slice(0, n)}</div>; })}</div></AbsoluteFill>; },

  // speech or thought bubble on a picture, tail toward (tx, ty)
  bubble: (c, q, d, out) => { const x = (c.x ?? 0.62) * W, y = (c.y ?? 0.22) * H, tx = (c.tx ?? 0.5) * W, ty = (c.ty ?? 0.5) * H, s = pop(q), think = c.think;
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H} style={{position: 'absolute'}}>{think
        ? [0.25, 0.5, 0.72].map((k, i) => <circle key={i} cx={tx + (x - tx) * k} cy={ty + (y - ty) * k} r={(10 + i * 9) * s} fill="#FFFFFF" stroke="#111" strokeWidth={4} />)
        : <path d={`M ${x - 40} ${y + 40} L ${tx} ${ty} L ${x + 40} ${y + 40} Z`} fill="#FFFFFF" stroke="#111" strokeWidth={4} opacity={s > 0.5 ? 1 : 0} />}</svg>
      <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, background: '#FFFFFF', border: '5px solid #111', borderRadius: think ? '50%' : 46, padding: think ? '50px 70px' : '26px 44px',
        fontFamily: c.hand === false ? SANS : HAND, fontSize: c.size || 58, color: '#111', maxWidth: 760, textAlign: 'center', lineHeight: 1.1, boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>{c.text}</div></AbsoluteFill>; },

  // loading bar that crawls, then stalls (a dry "nothing is happening")
  loading: (c, q, d, out) => { const pct = c.pct ?? 3, p = Math.min(1, q / (d * 0.5)), v = Math.round(pct * (1 - Math.pow(1 - p, 3)) * 10) / 10, sp = (q * 360 * 1.5) % 360;
    return <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center'}}><div style={{width: 1040, background: 'rgba(16,16,20,0.92)', borderRadius: 20, padding: '34px 44px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', transform: `translate(${c.dx || 0}px, ${c.dy || 0}px) scale(${pop(q, 0.5) * (c.scale ?? 1)})`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, fontFamily: SANS, fontWeight: 700, fontSize: 44, color: '#FFFFFF'}}>
        <svg width={50} height={50} style={{transform: `rotate(${sp}deg)`}}><circle cx={25} cy={25} r={19} fill="none" stroke="#FCCF3E" strokeWidth={7} strokeDasharray="70 60" strokeLinecap="round" /></svg>{c.text ?? 'Loading…'}</div>
      <div style={{marginTop: 26, height: 40, background: '#333', borderRadius: 20, overflow: 'hidden'}}><div style={{height: '100%', width: `${Math.max(1.2, v)}%`, background: '#FCCF3E'}} /></div>
      <div style={{marginTop: 14, fontFamily: MONO, fontSize: 46, color: '#EEEEEE', textAlign: 'right'}}>{v.toFixed(1)}%{c.sub ? `  ·  ${c.sub}` : ''}</div></div></AbsoluteFill>; },

  // a swinging price tag hung on a string from (x, y)
  // tag: a hanging name tag. Always in the top-left corner, same place and size in every video (Sam, 12 Nov 2026: "The tags ...
  // should always come on the left hand side top corner in all the videos ... they should be equal"). c.free: true keeps c.x/c.y.
  // c.swaps = [[offset s, text], ...] (label swap, Kurzgesagt / Map Men, gag study 12 Nov 2026): the tag flips over and shows the new text.
  tag: (c, q, d, out) => { const sw0 = (c.swaps || []).filter(x => q >= x[0]).pop(); if (sw0) c = {...c, text: sw0[1], sub: sw0[2] ?? c.sub};
    const flip = (c.swaps || []).reduce((m, x) => (q >= x[0] && q < x[0] + 0.25 ? Math.abs(Math.cos((q - x[0]) / 0.25 * Math.PI)) : m), 1);
    const free = c.free, TW = 400, TH = 200, L = free ? (c.x ?? 0.7) * W - TW / 2 : 72, y = free ? (c.y ?? 0.15) * H : 0.045 * H,
      sw = 5 * Math.exp(-q * 2) * Math.sin(q * 6) + 2, longest = Math.max(...String(c.text || '').split(/\s+/).map(w => w.length), 1), fs = free ? (c.size || 52) : Math.min(40, Math.floor((TW - 50) / (0.7 * longest)));
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: L, top: -140 - 300 * (1 - R(q, 0, 0.25)), width: TW, transformOrigin: '50% 0', transform: `rotate(${sw}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: 5, height: 120 + y + 140, background: '#EEE', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.55)'}} />   {/* the string starts above the frame (Sam, 12 Nov 2026) */}
      <div style={{marginTop: -4, width: TW, height: free ? 'auto' : TH, boxSizing: 'border-box', padding: '26px 22px 18px', background: '#F4EFE2', clipPath: 'polygon(20% 0, 80% 0, 100% 18%, 100% 100%, 0 100%, 0 18%)', transform: `scaleY(${flip})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: fs, lineHeight: 1.08, color: RED, boxShadow: '0 10px 30px rgba(0,0,0,0.4)'}}>
        <div style={{width: 18, height: 18, borderRadius: 9, background: '#333', marginBottom: 10, flex: 'none'}} />{c.text}{c.sub ? <div style={{fontSize: 30, lineHeight: 1.15, color: '#444', fontWeight: 700, marginTop: 6}}>{c.sub}</div> : null}</div></div></AbsoluteFill>; },

  // spotlight: everything goes dark except one circle that closes on the detail
  spotlight: (c, q, d, out) => { const p = R(q, 0, 0.5), r = 1400 - (1400 - (c.r ?? 0.14) * W) * p;
    return <AbsoluteFill style={{opacity: out, background: `radial-gradient(circle ${r}px at ${(c.x ?? 0.5) * 100}% ${(c.y ?? 0.5) * 100}%, rgba(0,0,0,0) 92%, rgba(0,0,0,0.86) 100%)`}}>
      {c.text ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, color: PC('#FFFFFF'), opacity: R(q, 0.4, 0.6)}}>{c.text}</div> : null}</AbsoluteFill>; },

  // phone notification sliding down from the top (our own design, no real app's look)
  notify: (c, q, d) => { const p = R(q, 0, 0.3) * (1 - R(q, d - 0.3, d));
    return <AbsoluteFill><div style={{position: 'absolute', left: '50%', top: 40, width: 900, transform: `translate(-50%, ${(p - 1) * 160}%)`, background: 'rgba(245,245,247,0.96)', borderRadius: 34, padding: '24px 30px', boxShadow: '0 20px 50px rgba(0,0,0,0.45)', display: 'flex', gap: 24, alignItems: 'flex-start', fontFamily: SANS}}>
      <div style={{width: 84, height: 84, borderRadius: 20, background: c.color || '#0B5E2A', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 46, fontWeight: 900}}>{c.icon ?? '!'}</div>
      <div style={{flex: 1}}><div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#666', fontWeight: 600}}><span>{(c.app ?? 'SPACE BUDGET').toUpperCase()}</span><span>now</span></div>
        <div style={{fontSize: 38, fontWeight: 800, color: '#111', marginTop: 4}}>{c.title}</div><div style={{fontSize: 32, color: '#333', marginTop: 4, lineHeight: 1.25}}>{c.text}</div></div></div></AbsoluteFill>; },

  // retro error dialog (our own grey design): pops in with a shake
  errorbox: (c, q, d, out) => { const sh = q < 0.35 ? Math.sin(q * 90) * 14 * (1 - q / 0.35) : 0, n = c.stack || 1;
    return <AbsoluteFill style={{opacity: out}}>{Array.from({length: n}).map((_, i) => { const qi = q - i * 0.18; if (qi < 0) return null;
      return <div key={i} style={{position: 'absolute', left: (c.x ?? 0.5) * W + i * 46 + sh, top: (c.y ?? 0.45) * H + i * 46, transform: `translate(-50%, -50%) scale(${pop(qi, 0.4)})`, width: 860, background: PC('#D4D0C8'), border: PC('3px solid #FFFFFF'), borderRightColor: PC('#404040'), borderBottomColor: PC('#404040'), boxShadow: '6px 6px 0 rgba(0,0,0,0.35)', fontFamily: PF(SANS)}}>
        <div style={{background: PC('linear-gradient(90deg, #8A1010, #C23B22)'), color: PC('#FFF'), fontWeight: 800, fontSize: 32, padding: '8px 16px', display: 'flex', justifyContent: 'space-between'}}><span>{c.title ?? 'Error'}</span><span>✕</span></div>
        <div style={{display: 'flex', gap: 26, alignItems: 'center', padding: '30px 34px', fontSize: 38, color: PC('#111')}}><div style={{width: 74, height: 74, borderRadius: 37, background: PC(RED), color: PC('#FFF'), fontWeight: 900, fontSize: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>!</div>{c.text}</div>
        <div style={{textAlign: 'center', paddingBottom: 26}}><span style={{display: 'inline-block', border: PC('3px solid #111'), padding: '6px 56px', fontSize: 32, background: PC('#E4E0D8')}}>{c.button ?? 'OK'}</span></div></div>; })}</AbsoluteFill>; },

  // a lower-third line where one word is struck out and the honest word is scribbled above it
  strike: (c, q, d, out) => { const p = R(q, 0.5, 0.75), [a, b, e] = [c.before || '', c.wrong || '', c.after || ''];
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center'}}>
      <span style={{display: 'inline-block', background: 'rgba(10,9,8,0.82)', padding: '18px 40px', borderRadius: 14, fontFamily: SERIF, fontSize: 72, color: PC('#F3EBDD'), position: 'relative'}}>{a}
        <span style={{position: 'relative', display: 'inline-block'}}>{b}<span style={{position: 'absolute', left: -6, top: '52%', height: 8, width: `calc(${p * 100}% + 12px)`, background: PC(RED), transform: 'rotate(-3deg)'}} />
          <span style={{position: 'absolute', left: '50%', bottom: '88%', transform: `translateX(-50%) rotate(-5deg) scale(${pop(q - 0.75)})`, fontFamily: HAND, fontSize: 70, color: PC(RED), whiteSpace: 'nowrap'}}>{c.right}</span></span>{e}</span></div></AbsoluteFill>; },

  // magnifying lens: a round window showing the picture zoomed on (x, y); needs c.img = the shot's picture
  lens: (c, q, d, out, dir) => { const x = (c.x ?? 0.5) * W, y = (c.y ?? 0.5) * H, z = c.zoom || 2.6, rr = (c.r ?? 0.12) * W, s = pop(q, 0.6);
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: x - rr, top: y - rr, width: rr * 2, height: rr * 2, borderRadius: '50%', overflow: 'hidden', border: P.on ? '14px solid #9C7A3C' : '14px solid #2A2520', outline: P.on ? `4px solid ${INK}` : 'none', boxShadow: '0 18px 50px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,255,255,0.25)', transform: `scale(${s})`}}>
      <Img src={staticFile(`${dir}/${c.img}`)} style={{position: 'absolute', width: W * z, height: H * z, left: rr - x * z, top: rr - y * z, maxWidth: 'none', objectFit: 'cover'}} /></div>
      <div style={{position: 'absolute', left: x + rr * 0.62, top: y + rr * 0.62, width: 30, height: rr * 0.9, background: P.on ? '#5B3A1E' : '#2A2520', border: P.on ? `3px solid ${INK}` : 'none', borderRadius: 14, transformOrigin: '50% 0', transform: `rotate(-45deg) scale(${s})`}} /></AbsoluteFill>; },

  // meme caption: big white outlined words at the top and/or bottom
  caption: (c, q, d, out) => { const st = {position: 'absolute', left: 60, right: 60, textAlign: 'center', fontFamily: PF(SANS), fontWeight: 900, fontSize: c.size || 96, color: PC('#FFFFFF'), textShadow: PC('4px 4px 0 #000, -4px 4px 0 #000, 4px -4px 0 #000, -4px -4px 0 #000, 0 5px 0 #000, 0 -5px 0 #000, 5px 0 0 #000, -5px 0 0 #000'), textTransform: 'uppercase', lineHeight: 1.0, transform: `scale(${pop(q, 0.3)})`};
    return <AbsoluteFill style={{opacity: out}}>{c.top ? <div style={{...st, top: 50}}>{c.top}</div> : null}{c.bottom ? <div style={{...st, bottom: 60}}>{c.bottom}</div> : null}</AbsoluteFill>; },

  // a trend line that crashes (dir 'down') or rockets (dir 'up') across the picture, with an arrowhead and a label
  trend: (c, q, d, out) => { const up = c.dir === 'up', p = R(q, 0.1, 0.1 + Math.min(1.4, d * 0.6)), pts = [], N = 14;
    for (let i = 0; i <= N; i++) { const k = i / N, base = up ? 0.82 - 0.62 * Math.pow(k, 1.6) : 0.25 + 0.6 * Math.pow(k, 1.6); pts.push([120 + k * 1680, (base + 0.06 * Math.sin(i * 2.3)) * H]); }
    const n = Math.max(2, Math.ceil(p * N) + 1), sel = pts.slice(0, n), [lx, ly] = sel[sel.length - 1], [px, py] = sel[sel.length - 2], a = Math.atan2(ly - py, lx - px), col = up ? PC('#22C55E') : PC(RED);
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H}><polyline points={sel.map(v => v.join(',')).join(' ')} fill="none" stroke={col} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
      <path d={`M ${lx + 40 * Math.cos(a)} ${ly + 40 * Math.sin(a)} L ${lx + 30 * Math.cos(a + 2.2)} ${ly + 30 * Math.sin(a + 2.2)} L ${lx + 30 * Math.cos(a - 2.2)} ${ly + 30 * Math.sin(a - 2.2)} Z`} fill={col} /></svg>
      {c.text ? <div style={{position: 'absolute', left: up ? 140 : 1100, top: up ? 760 : 90, fontFamily: PF(SANS), fontWeight: 900, fontSize: 70, color: col, textShadow: '0 4px 14px rgba(0,0,0,0.6)', opacity: R(q, 0.6, 0.8)}}>{c.text}</div> : null}</AbsoluteFill>; },

  // camcorder "REC" frame: corner brackets, a blinking red dot, a running timecode
  rec: (c, q, d, out) => { const tc = (s) => { const m = Math.floor(s / 60), x = Math.floor(s % 60), fr = Math.floor((s * 30) % 30); return `00:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}:${String(fr).padStart(2, '0')}`; };
    const br = (st) => <div style={{position: 'absolute', width: 120, height: 120, borderColor: PC('#FFF'), borderStyle: 'solid', borderWidth: 0, ...st}} />;
    return <AbsoluteFill style={{opacity: out, fontFamily: PF(MONO), color: PC('#FFF'), textShadow: '0 2px 6px rgba(0,0,0,0.7)'}}>{br({left: 60, top: 60, borderTopWidth: 8, borderLeftWidth: 8})}{br({right: 60, top: 60, borderTopWidth: 8, borderRightWidth: 8})}
      {br({left: 60, bottom: 60, borderBottomWidth: 8, borderLeftWidth: 8})}{br({right: 60, bottom: 60, borderBottomWidth: 8, borderRightWidth: 8})}
      <div style={{position: 'absolute', left: 110, top: 100, fontSize: 56, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 18}}><span style={{width: 36, height: 36, borderRadius: 18, background: PC(RED), opacity: Math.floor(q * 2) % 2 ? 0.2 : 1}} />{c.text ?? 'REC'}</div>
      <div style={{position: 'absolute', right: 110, bottom: 100, fontSize: 48}}>{tc(q + (c.from || 0))}</div></AbsoluteFill>; },

  // confetti burst (visual only; Sam removed the popper sound from the clean cut on 11 Nov 2026)
  confetti: (c, q, d, out) => { const n = c.n || 120, cols = [PC('#FCCF3E'), PC('#E0261B'), PC('#22C55E'), PC('#3B82F6'), PC('#F472B6'), PC('#FFFFFF')];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H}>{Array.from({length: n}).map((_, i) => { const r = (k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
      const ang = -Math.PI / 2 + (r(1) - 0.5) * 1.6, v = 900 + r(2) * 900, x = (c.x ?? 0.5) * W + Math.cos(ang) * v * q, y = (c.y ?? 0.9) * H + Math.sin(ang) * v * q + 900 * q * q;
      return <rect key={i} x={x} y={y} width={14} height={24} fill={cols[i % cols.length]} transform={`rotate(${q * 700 * (r(3) - 0.5)} ${x} ${y})`} />; })}</svg></AbsoluteFill>; },

  // "x hours later" title card in the old documentary style (full screen)
  // style 'vcr' (Internet Historian fast-forward time skip, gag study 12 Nov 2026): a VCR double-arrow, small caps, two static bands
  later: (c, q, d, out) => c.style === 'vcr' ? <AbsoluteFill style={{background: P.on ? '#1E2620' : '#050505', opacity: out, justifyContent: 'center', alignItems: 'center'}}>
    {[0.18, 0.8].map((y, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y * H, height: 46, background: P.on ? 'repeating-linear-gradient(90deg, #26302A 0 3px, #A89B82 3px 5px, #26302A 5px 9px)' : 'repeating-linear-gradient(90deg, #222 0 3px, #777 3px 5px, #111 5px 9px)', opacity: 0.55 + 0.3 * Math.sin(q * 40 + i), transform: `translateX(${Math.sin(q * 23 + i) * 30}px)`}} />)}
    <div style={{position: 'absolute', left: 110, top: 110, fontFamily: MONO, fontWeight: 900, fontSize: 110, color: '#F1E6CF', opacity: Math.floor(q * 3) % 2 ? 0.55 : 1}}>▶▶</div>
    <div style={{fontFamily: SERIF, fontVariant: 'small-caps', fontSize: 120, color: '#F1E6CF', letterSpacing: 6}}>{c.text ?? 'three weeks later'}</div></AbsoluteFill>
  : <AbsoluteFill style={{background: c.ground || '#5B3A1E', opacity: out * R(q, 0, 0.12), justifyContent: 'center', alignItems: 'center'}}>
    <div style={{fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 600, fontSize: 150, color: '#FCE9B0', textShadow: '0 6px 0 #2E1A0A', transform: `scale(${0.9 + 0.1 * R(q, 0, 0.4)})`}}>{c.text ?? 'Several minutes later…'}</div></AbsoluteFill>,
};
