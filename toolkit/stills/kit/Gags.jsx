// Picture-gag overlays for the stills kit (Sam, 11 Nov 2026: "a detailed library of picture gags and various effects which we
// can give on our pictures and videos"). Each kind is a card in the scene plan: {at, word, kind, dur, ...options}.
// Positions x, y, w, h, r are fractions of the frame (0-1) unless noted. Every kind lists its paired sound in EFFECTS_LIBRARY.md.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, interpolate, Easing, delayRender, continueRender} from 'remotion';
import {Lottie} from '@remotion/lottie';

const cl = (v) => Math.min(1, Math.max(0, v));
const R = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.25, 1)});
const pop = (q, k = 1) => q < 0 ? 0 : 1 + 0.22 * k * Math.exp(-q * 7) * Math.sin(q * 22) - Math.exp(-q * 16);   // springy pop-in scale
const RED = '#E0261B', HAND = 'Kalam, cursive', SANS = 'Inter, "Helvetica Neue", Arial, sans-serif', MONO = '"JetBrains Mono", "Courier New", monospace', SERIF = '"Cormorant Garamond", Georgia, serif';
const W = 1920, H = 1080;

export const gagCard = (c, t, dir) => { const f = GAGS[c.kind]; if (!f) return undefined;   // undefined: not a gag kind
  const d = c.dur || 2, q = t - c.t; if (q < 0 || q > d) return null;
  return f(c, q, d, 1 - R(t, c.t + d - 0.15, c.t + d), dir); };


// Lottie animations (LottieFiles free animations, Lottie Simple License; Sam, 11 Nov 2026): c.file = a .json in the scene folder,
// placed at (x, y) (centre, 0-1), c.w = width as a share of the frame, c.loop, c.speed. Logged in media/<Prefix>_licence_log.csv.
const LottieGag = ({c, dir, out, inner}) => { const [data, setData] = React.useState(null); const [h] = React.useState(() => delayRender('lottie ' + c.file));
  React.useEffect(() => { fetch(staticFile(`${dir}/${c.file}`)).then(r => r.json()).then(j => { setData(j); continueRender(h); }).catch(() => continueRender(h)); }, []);
  if (!data) return null; const w = (c.w ?? 0.35) * W, ar = (data.h || 1) / (data.w || 1);
  if (inner) return <Sequence from={Math.round(c.t * 30)} layout="none"><Lottie animationData={data} loop={c.loop ?? true} playbackRate={c.speed ?? 1} style={{width: '100%', height: '100%'}} /></Sequence>;
  return <Sequence from={Math.round(c.t * 30)} layout="none"><div style={{position: 'absolute', left: (c.x ?? 0.5) * W - w / 2, top: (c.y ?? 0.5) * H - (w * ar) / 2, width: w, height: w * ar, opacity: out, transform: `rotate(${c.rot ?? 0}deg)`}}>
    <Lottie animationData={data} loop={c.loop ?? false} playbackRate={c.speed ?? 1} style={{width: '100%', height: '100%'}} /></div></Sequence>; };

const Pic = ({dir, f, style, filter}) => <Img src={staticFile(`${dir}/${f}`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: filter || 'none', ...style}} />;
const GAGS = {

  // ---- Built 11 Nov 2026 from the "to build" list in gag_schools.json (Sam: "start completing the existing gag chapters") ----

  // callin (South Park call-in box): one static photo in a phone-in box with a pulsing phone icon, and an ON THE LINE lower third.
  // c.img, c.name (caller), c.title (lower-third line). Our own mascot or anonymous stock only, never a real person's doctored face.
  callin: (c, q, d, out, dir) => { const p = Easing.out(Easing.cubic)(R(q, 0, 0.3)), ring = 1 + 0.08 * Math.sin(q * 18) * Math.exp(-q * 1.2);
    return <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', right: 80, top: 90, width: 620, height: 470, transform: `translateX(${(1 - p) * 120}%)`, border: '8px solid #FFFFFF', boxShadow: '0 16px 44px rgba(0,0,0,0.55)', background: '#111', overflow: 'hidden'}}>
        <Pic dir={dir} f={c.img} />
        <div style={{position: 'absolute', right: 18, top: 18, width: 84, height: 84, borderRadius: 42, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ring})`, boxShadow: '0 4px 14px rgba(0,0,0,0.4)'}}>
          <svg width="48" height="48" viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="#111" /></svg></div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.72)', color: '#FFFFFF', fontFamily: SANS, fontWeight: 800, fontSize: 34, padding: '10px 18px'}}>{c.name || 'CALLER'}</div></div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, height: 110, display: 'flex', transform: `translateX(${(1 - p) * -110}%)`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <div style={{background: '#D3121B', color: '#FFFFFF', fontFamily: SANS, fontWeight: 900, fontSize: 44, padding: '0 30px', display: 'flex', alignItems: 'center', letterSpacing: 2}}>ON THE LINE</div>
        <div style={{flex: 1, background: '#FFFFFF', color: '#111', fontFamily: SANS, fontWeight: 800, fontSize: c.size || 50, display: 'flex', alignItems: 'center', padding: '0 30px', whiteSpace: 'nowrap', overflow: 'hidden'}}>{c.title || ''}</div></div></AbsoluteFill>; },

  // triptych (South Park slide talk): a lecture stage with three framed screens; pictures swap in on cues. c.imgs = the pictures,
  // c.slides = [[offset s, screen 0-2, picture index], ...] (a screen shows its latest slide), c.speaker = optional cut-out PNG on stage,
  // c.caps = optional caption per picture index. Full-screen card. Sound: a projector click on each swap.
  triptych: (c, q, d, out, dir) => { const sl = c.slides || [[0, 0, 0], [0.4, 1, 1], [0.8, 2, 2]], sw = 570, sh = 400, gap = 40, x0 = (W - 3 * sw - 2 * gap) / 2;
    return <AbsoluteFill style={{opacity: out * (c.cutIn ? 1 : R(q, 0, 0.12)), background: 'linear-gradient(#2E2A26 0%, #3B352E 70%, #7A5532 70%, #5E3F22 100%)'}}>
      {[0, 1, 2].map(s => { const cur = sl.filter(x => x[1] === s && q >= x[0]).pop(), age = cur ? q - cur[0] : 0;
        return <div key={s} style={{position: 'absolute', left: x0 + s * (sw + gap), top: 170, width: sw, height: sh, background: '#111', border: '10px solid #1B1B1B', outline: '4px solid #8A8A8A', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
          {cur ? <div style={{width: '100%', height: '100%', opacity: R(age, 0, 0.08)}}><Pic dir={dir} f={c.imgs[cur[2]]} />
            {c.caps && c.caps[cur[2]] ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', color: '#FFF', fontFamily: SANS, fontWeight: 800, fontSize: 40, textAlign: 'center', padding: '8px 10px'}}>{c.caps[cur[2]]}</div> : null}</div> : null}</div>; })}
      <div style={{position: 'absolute', left: W / 2 - 360, top: 830, width: 720, height: 130, borderRadius: '50%', border: '6px solid rgba(255,255,255,0.75)'}} />
      {c.speaker ? <Img src={staticFile(`${dir}/${c.speaker}`)} style={{position: 'absolute', left: W / 2 - 170, top: 470, width: 340, height: 420, objectFit: 'contain'}} /> : null}</AbsoluteFill>; },

  // ruler (South Park's crude scale diagram): a schoolroom ruler on flat yellow; c.max (ruler length in c.unit), c.marks =
  // [[value, label], ...] drawn as red ticks with labels, c.title on top. The joke is the tiny tick. Full-screen. Sound: marker squeak.
  ruler: (c, q, d, out) => { const x0 = 160, x1 = W - 160, y = 520, mx = c.max || 100, st = c.step || mx / 10, sx = v => x0 + (x1 - x0) * v / mx, p = Easing.out(Easing.cubic)(R(q, 0, 0.35));
    const big = Array.from({length: Math.floor(mx / st) + 1}, (_, i) => i * st).filter(v => mx - v > st * 0.4), small = Array.from({length: Math.floor(mx / (st / 5)) + 1}, (_, i) => i * st / 5);
    return <AbsoluteFill style={{opacity: out, background: c.ground || '#FCCF3E'}}>
      {c.title ? <div style={{position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 70, color: '#111'}}>{c.title}</div> : null}
      <svg width={W} height={H} style={{position: 'absolute', transform: `translateX(${(1 - p) * -100}%)`}}>
        <rect x={x0 - 30} y={y} width={x1 - x0 + 60} height={150} rx={10} fill="#F2E3B3" stroke="#6B5A2A" strokeWidth={5} />
        {small.map((v, i) => <line key={'s' + i} x1={sx(v)} y1={y} x2={sx(v)} y2={y + 30} stroke="#3A2F12" strokeWidth={3} />)}
        {big.map((v, i) => <g key={'b' + i}><line x1={sx(v)} y1={y} x2={sx(v)} y2={y + 64} stroke="#3A2F12" strokeWidth={5} />
          <text x={sx(v)} y={y + 108} fontFamily={MONO} fontSize={34} textAnchor="middle" fill="#3A2F12">{v}</text></g>)}
        <line x1={x1} y1={y} x2={x1} y2={y + 64} stroke="#3A2F12" strokeWidth={5} />
        <text x={x1} y={y + 108} fontFamily={MONO} fontSize={34} textAnchor="middle" fill="#3A2F12">{mx}</text>
        <text x={x1 + 10} y={y + 142} fontFamily={MONO} fontSize={28} textAnchor="end" fill="#3A2F12">{c.unit || ''}</text>
        {(c.marks || []).map(([v, lab], i) => { const t = R(q, 0.5 + i * (c.gap ?? 0.7), 0.75 + i * (c.gap ?? 0.7)); if (t <= 0) return null; const x = sx(v), rt = x < W / 2;
          return <g key={i} opacity={t}><line x1={x} y1={y - 10} x2={x} y2={y + 150} stroke={RED} strokeWidth={9} strokeLinecap="round" />
            <line x1={x} y1={y - 20} x2={x + (rt ? 1 : -1) * 60} y2={y - 150} stroke={RED} strokeWidth={6} />
            <text x={x + (rt ? 1 : -1) * 70} y={y - 160} fontFamily={HAND} fontSize={64} textAnchor={rt ? 'start' : 'end'} fill={RED}>{lab}</text></g>; })}</svg></AbsoluteFill>; },

  // advert (South Park genre switch): a glossy mock advert. The picture pushes in slowly under a lens flare sweep, a gold serif title
  // rises in, and the last c.tagDur seconds cut to black with a white serif tagline. c.img, c.title, c.tagline. Full-screen.
  advert: (c, q, d, out, dir) => { const td = c.tagDur ?? 1.4, tag = q > d - td, s = 1.06 + 0.06 * (q / d), fx = -0.3 + 1.6 * R(q, 0.1, d - td);
    return <AbsoluteFill style={{opacity: out, background: '#000'}}>
      {!tag ? <><div style={{position: 'absolute', inset: 0, transform: `scale(${s})`}}><Pic dir={dir} f={c.img} filter="saturate(1.15) contrast(1.05)" /></div>
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${fx * 100}% 30%, rgba(255,240,200,0.85) 0, rgba(255,220,150,0.25) 8%, rgba(255,255,255,0) 22%)`, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: c.size || 150, letterSpacing: 4,
          color: '#F4D27A', textShadow: '0 4px 24px rgba(0,0,0,0.8)', opacity: R(q, 0.3, 0.8), transform: `translateY(${(1 - R(q, 0.3, 0.8)) * 30}px)`}}>{c.title}</div></>
        : <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><div style={{fontFamily: SERIF, fontSize: 70, color: '#FFFFFF', letterSpacing: 2, textAlign: 'center', whiteSpace: 'pre-line', opacity: R(q, d - td, d - td + 0.3)}}>{c.tagline}</div></AbsoluteFill>}</AbsoluteFill>; },

  // grey (Tanmay Bhat grey-out): the subject of the joke turns black and white while the rest stays in colour. A box (x, y, w, h,
  // fractions) is greyed, or the whole frame when no box. Only our own characters, stock or objects: never to mock a real, named person.
  grey: (c, q, d, out, dir) => { const g = R(q, 0, 0.3), bx = c.w ? [c.x, c.y, c.w, c.h] : [0, 0, 1, 1], s = c.scale ?? 1.04;
    const clip = `inset(${bx[1] * 100}% ${(1 - bx[0] - bx[2]) * 100}% ${(1 - bx[1] - bx[3]) * 100}% ${bx[0] * 100}% round ${c.r ?? 0}px)`;
    return <AbsoluteFill style={{opacity: out * g, clipPath: clip}}><div style={{position: 'absolute', inset: 0, transform: `scale(${s})`}}><Pic dir={dir} f={c.img} filter="grayscale(1) contrast(1.15)" /></div></AbsoluteFill>; },
  // c.img = the shot's own picture (put the shot on move "hold" so the grey copy lines up), c.scale = the shot's scale at that moment.

  // grid (Tanmay Bhat reaction grid): one line, then 2-6 reaction pictures pop in 0.1 s apart. c.imgs, c.labels (optional), c.cols.
  // Our mascot's expressions or anonymous stock only. Full-screen. Sound: one pop per tile.
  grid: (c, q, d, out, dir) => { const n = (c.imgs || []).length, cols = c.cols || (n <= 2 ? 2 : n <= 4 ? 2 : 3), rows = Math.ceil(n / cols), g = 8, w = (W - g * (cols + 1)) / cols, h = (H - g * (rows + 1)) / rows;
    return <AbsoluteFill style={{opacity: out, background: '#0A0A0A'}}>{c.imgs.map((im, i) => { const qi = q - i * (c.gap ?? 0.1); if (qi < 0) return null;
      return <div key={i} style={{position: 'absolute', left: g + (i % cols) * (w + g), top: g + Math.floor(i / cols) * (h + g), width: w, height: h, overflow: 'hidden', transform: `scale(${pop(qi, 0.4)})`}}>
        <Pic dir={dir} f={im} />{c.labels && c.labels[i] ? <div style={{position: 'absolute', left: 16, bottom: 14, background: '#FFFFFF', color: '#111', fontFamily: SANS, fontWeight: 900, fontSize: 34, padding: '4px 14px'}}>{c.labels[i]}</div> : null}</div>; })}</AbsoluteFill>; },

  // namesake (Captain Disillusion): when an idea is named after a person, their real portrait (open licence, never AI) slides in beside
  // the idea and the name stamps onto it in bold yellow. c.img (portrait), c.idea (picture of the idea), c.name, c.stampAt (s).
  // Full-screen. Sound: impact on the stamp.
  namesake: (c, q, d, out, dir) => { const p = Easing.out(Easing.cubic)(R(q, 0, 0.35)), st = q - (c.stampAt ?? 0.6), sb = st < 0 ? 0 : 1 + 0.5 * Math.exp(-st * 9);
    return <AbsoluteFill style={{opacity: out, background: c.ground || '#1A2238'}}>
      <div style={{position: 'absolute', left: 120, top: 150, width: 720, height: 780, transform: `translateX(${(1 - p) * -130}%) rotate(-2deg)`, border: '12px solid #F3EAD3', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden', background: '#111'}}>
        <Pic dir={dir} f={c.img} style={{objectFit: c.fit || 'cover'}} /></div>
      {c.idea ? <div style={{position: 'absolute', right: 120, top: 230, width: 820, height: 620, transform: `translateX(${(1 - p) * 130}%)`, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', overflow: 'hidden', borderRadius: 10}}><Pic dir={dir} f={c.idea} /></div> : null}
      {st >= 0 ? <div style={{position: 'absolute', left: 120, width: 720, top: 760, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: c.size || 110, color: '#FCCF3E', letterSpacing: 3,
        textShadow: '0 6px 0 #7A5A00, 0 10px 30px rgba(0,0,0,0.8)', transform: `scale(${sb}) rotate(-4deg)`}}>{c.name}</div> : null}</AbsoluteFill>; },

  // variants (Captain Disillusion variants board): the same picture shown 3-6 times, each with a named treatment, lit one by one.
  // c.img, c.items = [[label, css filter], ...], c.gap (s between tiles). Full-screen. Sound: a click per tile.
  variants: (c, q, d, out, dir) => { const it = c.items || [], n = it.length, cols = n <= 4 ? 2 : 3, rows = Math.ceil(n / cols), g = 26, w = (W - g * (cols + 1)) / cols, h = (H - 90 - g * (rows + 1)) / rows, gap = c.gap ?? 0.5;
    const curI = Math.min(n - 1, Math.floor(q / gap));
    return <AbsoluteFill style={{opacity: out, background: '#0E1A12'}}>
      {c.title ? <div style={{position: 'absolute', top: 18, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 44, color: '#7CFF9B', letterSpacing: 6}}>{c.title}</div> : null}
      {it.map(([lab, f], i) => { const on = q >= i * gap;
        return <div key={i} style={{position: 'absolute', left: g + (i % cols) * (w + g), top: 90 + g + Math.floor(i / cols) * (h + g), width: w, height: h, overflow: 'hidden', outline: i === curI ? '6px solid #7CFF9B' : '2px solid #2F4A36', opacity: on ? 1 : 0.25}}>
          <Pic dir={dir} f={c.img} filter={on ? f : 'grayscale(1) brightness(0.4)'} />
          <div style={{position: 'absolute', left: 0, top: 0, background: 'rgba(0,0,0,0.75)', color: '#7CFF9B', fontFamily: MONO, fontSize: 34, padding: '6px 14px', letterSpacing: 3}}>{lab}</div></div>; })}</AbsoluteFill>; },

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
    return <AbsoluteFill style={{opacity: out, background: c.ground || '#FFFFFF'}}>{c.imgs.map((im, i) => { const qi = q - i * gap; if (qi < 0) return null; const x = x0 + i * (w + 90);
      return <React.Fragment key={i}>{i ? <svg style={{position: 'absolute', left: x - 82, top: y0 + w * 0.32}} width={74} height={40}><path d="M4 20 L56 20 M44 8 L60 20 L44 32" stroke={RED} strokeWidth={8} fill="none" strokeLinecap="round" /></svg> : null}
        <div style={{position: 'absolute', left: x, top: y0, width: w, height: w * 0.8, transform: `scale(${pop(qi, 0.7)})`, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', overflow: 'hidden', borderRadius: 8}}><Img src={staticFile(`${dir}/${im}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
        {c.labels && c.labels[i] ? <div style={{position: 'absolute', left: x, width: w, top: y0 + w * 0.8 + 18, textAlign: 'center', fontFamily: HAND, fontSize: 54, color: '#111', opacity: R(qi, 0.1, 0.3)}}>{c.labels[i]}</div> : null}</React.Fragment>; })}</AbsoluteFill>; },

  // labels (Sam O'Nella's stacked label arrows, study 2): short labels arrive one by one, each with an arrow to the same point (x, y)
  labels: (c, q, d, out) => { const x = (c.x ?? 0.5) * W, y = (c.y ?? 0.55) * H, gap = c.gap ?? 0.6, spots = c.spots || [[0.2, 0.25], [0.8, 0.22], [0.15, 0.78], [0.85, 0.75], [0.5, 0.12]];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}>{(c.items || []).map((t, i) => { const p = R(q, i * gap, i * gap + 0.25); if (p <= 0) return null; const [lx, ly] = spots[i % spots.length], ax = lx * W, ay = ly * H;
        const ex = ax + (x - ax) * 0.82 * p, ey = ay + (y - ay) * 0.82 * p; return <path key={i} d={`M ${ax} ${ay + 30} L ${ex} ${ey}`} stroke="#FCCF3E" strokeWidth={7} strokeLinecap="round" />; })}</svg>
      {(c.items || []).map((t, i) => { const qi = q - i * gap; if (qi < 0) return null; const [lx, ly] = spots[i % spots.length];
        return <div key={i} style={{position: 'absolute', left: lx * W, top: ly * H, transform: `translate(-50%, -50%) scale(${pop(qi, 0.6)}) rotate(${(i % 2 ? 4 : -4)}deg)`, fontFamily: HAND, fontSize: c.size || 60, color: '#FCCF3E', textShadow: '0 3px 10px rgba(0,0,0,0.85)', whiteSpace: 'nowrap'}}>{t}</div>; })}</AbsoluteFill>; },

  // sticker (Indian vlog texture, edit study 11 Nov 2026): a cut-out object (PNG with transparency, or a Lottie json) with a thick
  // white border pops in, wobbles and stays; c.img or c.file, at (x, y), c.w share of width
  sticker: (c, q, d, out, dir) => { const s = pop(q, 1.2), w = (c.w ?? 0.2) * W, wob = 4 * Math.sin(q * 3);
    const edge = 'drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(0 10px 14px rgba(0,0,0,0.45))';
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><div style={{position: 'absolute', left: (c.x ?? 0.75) * W - w / 2, top: (c.y ?? 0.4) * H - w / 2, width: w, height: w, transform: `scale(${s}) rotate(${(c.rot ?? -6) + wob}deg)`, filter: edge, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {c.file ? <LottieGag c={{...c, x: 0.5, y: 0.5, w: 1}} dir={dir} out={1} inner /> : <Img src={staticFile(`${dir}/${c.img}`)} style={{maxWidth: '100%', maxHeight: '100%'}} />}</div>
      {c.text ? <div style={{position: 'absolute', left: (c.x ?? 0.75) * W, top: (c.y ?? 0.4) * H + w * 0.55, transform: `translateX(-50%) rotate(-3deg) scale(${pop(q - 0.15)})`, background: '#FCCF3E', color: '#111', fontFamily: SANS, fontWeight: 900, fontSize: 40, padding: '4px 18px', borderRadius: 8, whiteSpace: 'nowrap'}}>{c.text}</div> : null}</AbsoluteFill>; },

  // burst (gag sting, Climate Town's "DANG!" shape): 3-4 pictures slam in tilted around one big word, about a second, then gone
  burst: (c, q, d, out, dir) => { const imgs = c.imgs || [], pos = [[0.22, 0.32, -10], [0.78, 0.3, 8], [0.25, 0.75, 6], [0.76, 0.74, -7]];
    return <AbsoluteFill style={{opacity: out, background: `rgba(0,0,0,${0.35 * R(q, 0, 0.05)})`}}>
      {imgs.slice(0, 4).map((im, i) => { const qi = q - i * 0.07; if (qi < 0) return null; const [x, y, r] = pos[i];
        return <div key={i} style={{position: 'absolute', left: x * W - 330, top: y * H - 190, width: 660, height: 380, border: '10px solid #FFF', boxShadow: '0 14px 40px rgba(0,0,0,0.6)', overflow: 'hidden', transform: `rotate(${r}deg) scale(${pop(qi, 0.8)})`}}>
          <Img src={staticFile(`${dir}/${im}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>; })}
      <div style={{position: 'absolute', left: 0, right: 0, top: H / 2 - 130, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: c.size || 220, color: c.color || '#FCCF3E', letterSpacing: 4,
        textShadow: '8px 8px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000', transform: `rotate(-6deg) scale(${pop(q - 0.2, 1.4)})`}}>{c.text}</div></AbsoluteFill>; },

  // grow: the spoken line, each word bigger than the last (OverSimplified's escalation); words on a dim band over the picture.
  // c.text; c.times = word start offsets in s (default every 0.3 s)
  grow: (c, q, d, out) => { const ws = c.text.split(' '), tm = c.times || ws.map((_, i) => i * 0.3), base = c.size || 70, k = c.k ?? 1.18;
    return <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.35)'}}><div style={{maxWidth: 1700, textAlign: 'center', lineHeight: 1.05}}>
      {ws.map((w, i) => { const p = R(q, tm[i], tm[i] + 0.12); return <span key={i} style={{display: 'inline-block', marginRight: '0.25em', opacity: p, fontFamily: SANS, fontWeight: 900, color: i === ws.length - 1 ? (c.color || '#FCCF3E') : '#FFFFFF',
        fontSize: base * Math.pow(k, i), transform: `scale(${0.6 + 0.4 * p})`, textShadow: '0 6px 18px rgba(0,0,0,0.7)'}}>{w}</span>; })}</div></AbsoluteFill>; },

  // doc: a document slides in from the right at an angle, then its key line is lifted out as big highlighted text (Climate Town)
  doc: (c, q, d, out, dir) => { const p = Easing.out(Easing.cubic)(R(q, 0, 0.35)), hl = R(q, 0.7, 1.0);
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', right: 120 - (1 - p) * 900, top: 90, width: 620, height: 800, background: '#FFF', boxShadow: '0 24px 60px rgba(0,0,0,0.55)', transform: `rotate(${4 - 2 * p}deg)`, overflow: 'hidden'}}>
        {c.img ? <Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <div style={{padding: 50, fontFamily: 'Georgia, serif', color: '#222'}}><div style={{fontSize: 34, fontWeight: 700, marginBottom: 24}}>{c.title}</div>
          {Array.from({length: 14}).map((_, j) => <div key={j} style={{height: 12, margin: '16px 0', background: j === (c.line ?? 6) ? `linear-gradient(90deg, #FCCF3E ${hl * 100}%, #CFCFCF ${hl * 100}%)` : '#CFCFCF', width: `${75 + ((j * 29) % 25)}%`}} />)}</div>}</div>
      <div style={{position: 'absolute', left: 90, right: 820, bottom: 130, opacity: hl, transform: `translateY(${(1 - hl) * 30}px)`}}><span style={{background: '#FCCF3E', color: '#111', fontFamily: SERIF, fontWeight: 600, fontSize: c.size || 58, lineHeight: 1.35, padding: '2px 12px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{c.quote}</span>
        {c.source ? <div style={{marginTop: 14, fontFamily: SANS, fontSize: 28, color: '#FFF', textShadow: '0 2px 8px #000'}}>{c.source}</div> : null}</div></AbsoluteFill>; },
  // overlay footage (Mixkit Stock Video Free License): a texture clip over the picture with a blend mode (screen for light and static)
  overlay: (c, q, d, out, dir) => <AbsoluteFill style={{opacity: out * (c.opacity ?? 0.6), mixBlendMode: c.blend || 'screen', pointerEvents: 'none'}}>
    <Sequence from={Math.round(c.t * 30)} layout="none"><OffthreadVideo muted src={staticFile(`${dir}/${c.file}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence></AbsoluteFill>,
  lottie: (c, q, d, out, dir) => <AbsoluteFill style={{pointerEvents: 'none'}}><LottieGag c={c} dir={dir} out={out} /></AbsoluteFill>,
  // freeze-frame caption ("Yep. That's me." / "You're probably wondering how I got here"): the picture goes grey, a label lands
  freeze: (c, q, d, out) => <AbsoluteFill style={{opacity: out}}>
    <AbsoluteFill style={{backdropFilter: `grayscale(${R(q, 0, 0.12)}) contrast(1.1)`, background: 'rgba(0,0,0,0.12)'}} />
    <div style={{position: 'absolute', left: 90, bottom: 110, transform: `translateX(${(1 - R(q, 0.05, 0.3)) * -120}%)`, background: '#FCCF3E', color: '#111', fontFamily: SANS, fontWeight: 900,
      fontSize: c.size || 70, padding: '14px 34px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', whiteSpace: 'pre-line', lineHeight: 1.05}}>{c.text}</div></AbsoluteFill>,

  // hand-drawn red circle around a detail (draws on in 0.45 s), optional scribbled label
  circle: (c, q, d, out) => { const cx = (c.x ?? 0.5) * W, cy = (c.y ?? 0.5) * H, rx = (c.rx ?? 0.12) * W, ry = (c.ry ?? c.rx ?? 0.12) * H * (W / H) * 0.56, p = R(q, 0, 0.45), L = 2 * Math.PI * Math.max(rx, ry) * 1.15;
    const path = `M ${cx + rx} ${cy} C ${cx + rx} ${cy - ry * 1.3}, ${cx - rx * 1.1} ${cy - ry * 1.15}, ${cx - rx} ${cy + ry * 0.05} C ${cx - rx * 0.95} ${cy + ry * 1.25}, ${cx + rx * 1.05} ${cy + ry * 1.2}, ${cx + rx * 1.02} ${cy - ry * 0.25} L ${cx + rx * 0.9} ${cy - ry * 0.5}`;
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H}><path d={path} fill="none" stroke={c.color || RED} strokeWidth={c.stroke || 12} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} /></svg>
      {c.text ? <div style={{position: 'absolute', left: cx + rx * 0.7, top: cy - ry - 90, fontFamily: HAND, fontSize: c.size || 66, color: c.color || RED, opacity: R(q, 0.35, 0.55), transform: 'rotate(-6deg)', whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(255,255,255,0.35)'}}>{c.text}</div> : null}</AbsoluteFill>; },

  // red arrow from a label to a target point (x, y), drawn on
  arrow: (c, q, d, out) => { const x1 = (c.x ?? 0.6) * W, y1 = (c.y ?? 0.5) * H, x0 = (c.fx ?? 0.25) * W, y0 = (c.fy ?? 0.2) * H, p = R(q, 0.1, 0.45);
    const mx = (x0 + x1) / 2 + (y1 - y0) * 0.2, my = (y0 + y1) / 2 - (x1 - x0) * 0.2, L = Math.hypot(x1 - x0, y1 - y0) * 1.2, a = Math.atan2(y1 - my, x1 - mx);
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H}><path d={`M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`} fill="none" stroke={c.color || RED} strokeWidth={12} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
      {p > 0.95 ? <path d={`M ${x1} ${y1} L ${x1 - 50 * Math.cos(a - 0.45)} ${y1 - 50 * Math.sin(a - 0.45)} M ${x1} ${y1} L ${x1 - 50 * Math.cos(a + 0.45)} ${y1 - 50 * Math.sin(a + 0.45)}`} stroke={c.color || RED} strokeWidth={12} strokeLinecap="round" /> : null}</svg>
      <div style={{position: 'absolute', left: x0, top: y0, transform: `translate(-50%, -110%) rotate(-4deg) scale(${pop(q)})`, fontFamily: HAND, fontSize: c.size || 64, color: c.color || RED, whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(255,255,255,0.4)'}}>{c.text}</div></AbsoluteFill>; },

  // censor: a black bar with a label, or a blurred mosaic box (mode 'blur'), over a region
  censor: (c, q, d, out) => { const x = (c.x ?? 0.4) * W, y = (c.y ?? 0.4) * H, w = (c.w ?? 0.2) * W, h = (c.h ?? 0.08) * H, on = q > (c.delay ?? 0);
    if (!on) return null;
    return <AbsoluteFill style={{opacity: out}}>{c.mode === 'blur'
      ? <div style={{position: 'absolute', left: x, top: y, width: w, height: h, backdropFilter: 'blur(26px) saturate(1.4)', backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px'}} />
      : <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#050505', transform: `rotate(${c.rot ?? -2}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 800, fontSize: Math.min(h * 0.55, 64), color: '#FFFFFF', letterSpacing: 6}}>{c.text ?? 'CENSORED'}</div>}</AbsoluteFill>; },

  // iris-out (old cartoon ending): a black circle closes on (x, y), holds a moment, then goes black
  iris: (c, q, d) => { const p = R(q, 0, d * 0.6), r = 1300 * (1 - p) + (c.hold ?? 110) * p * (1 - R(q, d * 0.75, d)), x = (c.x ?? 0.5) * 100, y = (c.y ?? 0.5) * 100;
    return <AbsoluteFill style={{background: `radial-gradient(circle ${Math.max(0.1, r)}px at ${x}% ${y}%, rgba(0,0,0,0) 99%, #000 100%)`}} />; },

  // VHS / glitch burst: scan lines, tearing bands, colour fringes, an on-screen "PLAY" read-out
  glitch: (c, q, d, out) => { const n = Math.floor(q * 30), r = (k) => ((Math.sin((n + 1) * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 5px)'}} />
      {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: r(i) * H, height: 10 + r(i + 9) * 70, backdropFilter: `hue-rotate(${r(i + 3) * 180}deg) saturate(3)`, transform: `translateX(${(r(i + 5) - 0.5) * 120}px)`, background: 'rgba(255,0,80,0.08)'}} />)}
      <AbsoluteFill style={{boxShadow: `inset ${(r(7) - 0.5) * 30}px 0 0 rgba(0,255,255,0.25), inset ${(r(8) - 0.5) * -30}px 0 0 rgba(255,0,0,0.25)`}} />
      <div style={{position: 'absolute', left: 90, top: 70, fontFamily: MONO, fontWeight: 800, fontSize: 64, color: '#FFFFFF', textShadow: '3px 0 #f0f, -3px 0 #0ff'}}>{c.text ?? 'PLAY ▶'}</div>
      <div style={{position: 'absolute', right: 90, bottom: 80, fontFamily: MONO, fontSize: 48, color: '#FFFFFF', textShadow: '3px 0 #f0f, -3px 0 #0ff'}}>{c.stamp ?? 'NOV 11 2026'}</div></AbsoluteFill>; },

  // expectation vs reality: two pictures side by side with labels (full screen)
  split: (c, q, d, out, dir) => { const p = R(q, 0, 0.25);
    const half = (img, lab, side) => <div style={{position: 'absolute', top: 0, bottom: 0, width: W / 2, left: side ? W / 2 : 0, overflow: 'hidden', transform: `translateY(${(1 - p) * (side ? 100 : -100)}%)`}}>
      <Img src={staticFile(`${dir}/${img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center'}}><span style={{background: side ? RED : '#FFFFFF', color: side ? '#FFFFFF' : '#111', fontFamily: SANS, fontWeight: 900, fontSize: 64, padding: '8px 30px', letterSpacing: 3}}>{lab}</span></div></div>;
    return <AbsoluteFill style={{opacity: out, background: '#000'}}>{half(c.imgs[0], (c.labels || ['EXPECTATION'])[0], 0)}{half(c.imgs[1], (c.labels || [, 'REALITY'])[1] || 'REALITY', 1)}
      <div style={{position: 'absolute', left: W / 2 - 4, top: 0, bottom: 0, width: 8, background: '#FFFFFF'}} /></AbsoluteFill>; },

  // speech or thought bubble on a picture, tail toward (tx, ty)
  bubble: (c, q, d, out) => { const x = (c.x ?? 0.62) * W, y = (c.y ?? 0.22) * H, tx = (c.tx ?? 0.5) * W, ty = (c.ty ?? 0.5) * H, s = pop(q), think = c.think;
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H} style={{position: 'absolute'}}>{think
        ? [0.25, 0.5, 0.72].map((k, i) => <circle key={i} cx={tx + (x - tx) * k} cy={ty + (y - ty) * k} r={(10 + i * 9) * s} fill="#FFFFFF" stroke="#111" strokeWidth={4} />)
        : <path d={`M ${x - 40} ${y + 40} L ${tx} ${ty} L ${x + 40} ${y + 40} Z`} fill="#FFFFFF" stroke="#111" strokeWidth={4} opacity={s > 0.5 ? 1 : 0} />}</svg>
      <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${s})`, background: '#FFFFFF', border: '5px solid #111', borderRadius: think ? '50%' : 46, padding: think ? '50px 70px' : '26px 44px',
        fontFamily: c.hand === false ? SANS : HAND, fontSize: c.size || 58, color: '#111', maxWidth: 760, textAlign: 'center', lineHeight: 1.1, boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>{c.text}</div></AbsoluteFill>; },

  // loading bar that crawls, then stalls (a dry "nothing is happening")
  loading: (c, q, d, out) => { const pct = c.pct ?? 3, p = Math.min(1, q / (d * 0.5)), v = Math.round(pct * (1 - Math.pow(1 - p, 3)) * 10) / 10, sp = (q * 360 * 1.5) % 360;
    return <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center'}}><div style={{width: 1040, background: 'rgba(16,16,20,0.92)', borderRadius: 20, padding: '34px 44px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', transform: `scale(${pop(q, 0.5)})`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, fontFamily: SANS, fontWeight: 700, fontSize: 44, color: '#FFFFFF'}}>
        <svg width={50} height={50} style={{transform: `rotate(${sp}deg)`}}><circle cx={25} cy={25} r={19} fill="none" stroke="#FCCF3E" strokeWidth={7} strokeDasharray="70 60" strokeLinecap="round" /></svg>{c.text ?? 'Loading…'}</div>
      <div style={{marginTop: 26, height: 40, background: '#333', borderRadius: 20, overflow: 'hidden'}}><div style={{height: '100%', width: `${Math.max(1.2, v)}%`, background: '#FCCF3E'}} /></div>
      <div style={{marginTop: 14, fontFamily: MONO, fontSize: 38, color: '#BBBBBB', textAlign: 'right'}}>{v.toFixed(1)}%{c.sub ? `  ·  ${c.sub}` : ''}</div></div></AbsoluteFill>; },

  // a swinging price tag hung on a string from (x, y)
  tag: (c, q, d, out) => { const x = (c.x ?? 0.7) * W, y = (c.y ?? 0.15) * H, sw = 14 * Math.exp(-q * 1.6) * Math.sin(q * 6) + 3;
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: x, top: y - 400 * (1 - R(q, 0, 0.3)), transformOrigin: '0 0', transform: `rotate(${sw}deg)`}}>
      <div style={{position: 'absolute', left: -2, top: 0, width: 4, height: 120, background: '#DDD'}} />
      <div style={{position: 'absolute', left: -130, top: 116, width: 260, padding: '30px 10px 22px', background: '#F4EFE2', clipPath: 'polygon(20% 0, 80% 0, 100% 18%, 100% 100%, 0 100%, 0 18%)', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: c.size || 52, color: RED, boxShadow: '0 10px 30px rgba(0,0,0,0.4)'}}>
        <div style={{width: 18, height: 18, borderRadius: 9, background: '#333', margin: '-12px auto 12px'}} />{c.text}{c.sub ? <div style={{fontSize: 26, color: '#444', fontWeight: 700, marginTop: 6}}>{c.sub}</div> : null}</div></div></AbsoluteFill>; },

  // spotlight: everything goes dark except one circle that closes on the detail
  spotlight: (c, q, d, out) => { const p = R(q, 0, 0.5), r = 1400 - (1400 - (c.r ?? 0.14) * W) * p;
    return <AbsoluteFill style={{opacity: out, background: `radial-gradient(circle ${r}px at ${(c.x ?? 0.5) * 100}% ${(c.y ?? 0.5) * 100}%, rgba(0,0,0,0) 92%, rgba(0,0,0,0.86) 100%)`}}>
      {c.text ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, color: '#FFFFFF', opacity: R(q, 0.4, 0.6)}}>{c.text}</div> : null}</AbsoluteFill>; },

  // phone notification sliding down from the top (our own design, no real app's look)
  notify: (c, q, d) => { const p = R(q, 0, 0.3) * (1 - R(q, d - 0.3, d));
    return <AbsoluteFill><div style={{position: 'absolute', left: '50%', top: 40, width: 900, transform: `translate(-50%, ${(p - 1) * 160}%)`, background: 'rgba(245,245,247,0.96)', borderRadius: 34, padding: '24px 30px', boxShadow: '0 20px 50px rgba(0,0,0,0.45)', display: 'flex', gap: 24, alignItems: 'flex-start', fontFamily: SANS}}>
      <div style={{width: 84, height: 84, borderRadius: 20, background: c.color || '#0B5E2A', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 46, fontWeight: 900}}>{c.icon ?? '!'}</div>
      <div style={{flex: 1}}><div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#666', fontWeight: 600}}><span>{(c.app ?? 'SPACE BUDGET').toUpperCase()}</span><span>now</span></div>
        <div style={{fontSize: 38, fontWeight: 800, color: '#111', marginTop: 4}}>{c.title}</div><div style={{fontSize: 32, color: '#333', marginTop: 4, lineHeight: 1.25}}>{c.text}</div></div></div></AbsoluteFill>; },

  // retro error dialog (our own grey design): pops in with a shake
  errorbox: (c, q, d, out) => { const sh = q < 0.35 ? Math.sin(q * 90) * 14 * (1 - q / 0.35) : 0, n = c.stack || 1;
    return <AbsoluteFill style={{opacity: out}}>{Array.from({length: n}).map((_, i) => { const qi = q - i * 0.18; if (qi < 0) return null;
      return <div key={i} style={{position: 'absolute', left: (c.x ?? 0.5) * W + i * 46 + sh, top: (c.y ?? 0.45) * H + i * 46, transform: `translate(-50%, -50%) scale(${pop(qi, 0.4)})`, width: 860, background: '#D4D0C8', border: '3px solid #FFFFFF', borderRightColor: '#404040', borderBottomColor: '#404040', boxShadow: '6px 6px 0 rgba(0,0,0,0.35)', fontFamily: SANS}}>
        <div style={{background: 'linear-gradient(90deg, #8A1010, #C23B22)', color: '#FFF', fontWeight: 800, fontSize: 32, padding: '8px 16px', display: 'flex', justifyContent: 'space-between'}}><span>{c.title ?? 'Error'}</span><span>✕</span></div>
        <div style={{display: 'flex', gap: 26, alignItems: 'center', padding: '30px 34px', fontSize: 38, color: '#111'}}><div style={{width: 74, height: 74, borderRadius: 37, background: RED, color: '#FFF', fontWeight: 900, fontSize: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>!</div>{c.text}</div>
        <div style={{textAlign: 'center', paddingBottom: 26}}><span style={{display: 'inline-block', border: '3px solid #111', padding: '6px 56px', fontSize: 32, background: '#E4E0D8'}}>{c.button ?? 'OK'}</span></div></div>; })}</AbsoluteFill>; },

  // a lower-third line where one word is struck out and the honest word is scribbled above it
  strike: (c, q, d, out) => { const p = R(q, 0.5, 0.75), [a, b, e] = [c.before || '', c.wrong || '', c.after || ''];
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: 0, right: 0, bottom: 120, textAlign: 'center'}}>
      <span style={{display: 'inline-block', background: 'rgba(10,9,8,0.82)', padding: '18px 40px', borderRadius: 14, fontFamily: SERIF, fontSize: 72, color: '#F3EBDD', position: 'relative'}}>{a}
        <span style={{position: 'relative', display: 'inline-block'}}>{b}<span style={{position: 'absolute', left: -6, top: '52%', height: 8, width: `calc(${p * 100}% + 12px)`, background: RED, transform: 'rotate(-3deg)'}} />
          <span style={{position: 'absolute', left: '50%', bottom: '88%', transform: `translateX(-50%) rotate(-5deg) scale(${pop(q - 0.75)})`, fontFamily: HAND, fontSize: 70, color: RED, whiteSpace: 'nowrap'}}>{c.right}</span></span>{e}</span></div></AbsoluteFill>; },

  // magnifying lens: a round window showing the picture zoomed on (x, y); needs c.img = the shot's picture
  lens: (c, q, d, out, dir) => { const x = (c.x ?? 0.5) * W, y = (c.y ?? 0.5) * H, z = c.zoom || 2.6, rr = (c.r ?? 0.12) * W, s = pop(q, 0.6);
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: x - rr, top: y - rr, width: rr * 2, height: rr * 2, borderRadius: '50%', overflow: 'hidden', border: '14px solid #2A2520', boxShadow: '0 18px 50px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,255,255,0.25)', transform: `scale(${s})`}}>
      <Img src={staticFile(`${dir}/${c.img}`)} style={{position: 'absolute', width: W * z, height: H * z, left: rr - x * z, top: rr - y * z, maxWidth: 'none', objectFit: 'cover'}} /></div>
      <div style={{position: 'absolute', left: x + rr * 0.62, top: y + rr * 0.62, width: 30, height: rr * 0.9, background: '#2A2520', borderRadius: 14, transformOrigin: '50% 0', transform: `rotate(-45deg) scale(${s})`}} /></AbsoluteFill>; },

  // meme caption: big white outlined words at the top and/or bottom
  caption: (c, q, d, out) => { const st = {position: 'absolute', left: 60, right: 60, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: c.size || 96, color: '#FFFFFF', textShadow: '4px 4px 0 #000, -4px 4px 0 #000, 4px -4px 0 #000, -4px -4px 0 #000, 0 5px 0 #000, 0 -5px 0 #000, 5px 0 0 #000, -5px 0 0 #000', textTransform: 'uppercase', lineHeight: 1.0, transform: `scale(${pop(q, 0.3)})`};
    return <AbsoluteFill style={{opacity: out}}>{c.top ? <div style={{...st, top: 50}}>{c.top}</div> : null}{c.bottom ? <div style={{...st, bottom: 60}}>{c.bottom}</div> : null}</AbsoluteFill>; },

  // a trend line that crashes (dir 'down') or rockets (dir 'up') across the picture, with an arrowhead and a label
  trend: (c, q, d, out) => { const up = c.dir === 'up', p = R(q, 0.1, 0.1 + Math.min(1.4, d * 0.6)), pts = [], N = 14;
    for (let i = 0; i <= N; i++) { const k = i / N, base = up ? 0.82 - 0.62 * Math.pow(k, 1.6) : 0.25 + 0.6 * Math.pow(k, 1.6); pts.push([120 + k * 1680, (base + 0.06 * Math.sin(i * 2.3)) * H]); }
    const n = Math.max(2, Math.ceil(p * N) + 1), sel = pts.slice(0, n), [lx, ly] = sel[sel.length - 1], [px, py] = sel[sel.length - 2], a = Math.atan2(ly - py, lx - px), col = up ? '#22C55E' : RED;
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H}><polyline points={sel.map(v => v.join(',')).join(' ')} fill="none" stroke={col} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
      <path d={`M ${lx + 40 * Math.cos(a)} ${ly + 40 * Math.sin(a)} L ${lx + 30 * Math.cos(a + 2.2)} ${ly + 30 * Math.sin(a + 2.2)} L ${lx + 30 * Math.cos(a - 2.2)} ${ly + 30 * Math.sin(a - 2.2)} Z`} fill={col} /></svg>
      {c.text ? <div style={{position: 'absolute', left: up ? 140 : 1100, top: up ? 760 : 90, fontFamily: SANS, fontWeight: 900, fontSize: 70, color: col, textShadow: '0 4px 14px rgba(0,0,0,0.6)', opacity: R(q, 0.6, 0.8)}}>{c.text}</div> : null}</AbsoluteFill>; },

  // camcorder "REC" frame: corner brackets, a blinking red dot, a running timecode
  rec: (c, q, d, out) => { const tc = (s) => { const m = Math.floor(s / 60), x = Math.floor(s % 60), fr = Math.floor((s * 30) % 30); return `00:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}:${String(fr).padStart(2, '0')}`; };
    const br = (st) => <div style={{position: 'absolute', width: 120, height: 120, borderColor: '#FFF', borderStyle: 'solid', borderWidth: 0, ...st}} />;
    return <AbsoluteFill style={{opacity: out, fontFamily: MONO, color: '#FFF', textShadow: '0 2px 6px rgba(0,0,0,0.7)'}}>{br({left: 60, top: 60, borderTopWidth: 8, borderLeftWidth: 8})}{br({right: 60, top: 60, borderTopWidth: 8, borderRightWidth: 8})}
      {br({left: 60, bottom: 60, borderBottomWidth: 8, borderLeftWidth: 8})}{br({right: 60, bottom: 60, borderBottomWidth: 8, borderRightWidth: 8})}
      <div style={{position: 'absolute', left: 110, top: 100, fontSize: 56, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 18}}><span style={{width: 36, height: 36, borderRadius: 18, background: RED, opacity: Math.floor(q * 2) % 2 ? 0.2 : 1}} />{c.text ?? 'REC'}</div>
      <div style={{position: 'absolute', right: 110, bottom: 100, fontSize: 48}}>{tc(q + (c.from || 0))}</div></AbsoluteFill>; },

  // confetti burst (visual only; Sam removed the popper sound from the clean cut on 11 Nov 2026)
  confetti: (c, q, d, out) => { const n = c.n || 120, cols = ['#FCCF3E', '#E0261B', '#22C55E', '#3B82F6', '#F472B6', '#FFFFFF'];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H}>{Array.from({length: n}).map((_, i) => { const r = (k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
      const ang = -Math.PI / 2 + (r(1) - 0.5) * 1.6, v = 900 + r(2) * 900, x = (c.x ?? 0.5) * W + Math.cos(ang) * v * q, y = (c.y ?? 0.9) * H + Math.sin(ang) * v * q + 900 * q * q;
      return <rect key={i} x={x} y={y} width={14} height={24} fill={cols[i % cols.length]} transform={`rotate(${q * 700 * (r(3) - 0.5)} ${x} ${y})`} />; })}</svg></AbsoluteFill>; },

  // "x hours later" title card in the old documentary style (full screen)
  later: (c, q, d, out) => <AbsoluteFill style={{background: c.ground || '#5B3A1E', opacity: out * R(q, 0, 0.12), justifyContent: 'center', alignItems: 'center'}}>
    <div style={{fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 600, fontSize: 150, color: '#FCE9B0', textShadow: '0 6px 0 #2E1A0A', transform: `scale(${0.9 + 0.1 * R(q, 0, 0.4)})`}}>{c.text ?? 'Several minutes later…'}</div></AbsoluteFill>,
};
