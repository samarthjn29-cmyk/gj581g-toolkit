// Gags built from the 12 Nov 2026 daily gag studies (styles/GAG_STUDY_LOG.md; Sam: "put the gags in the library and make sure every
// gag is used in the AI animated painted format"). Painted-native: every card here draws in the painted palette (PAINT below: the
// gouache colours of stills/STYLE_PAINTED.md) with hand-lettered type, and the painted finish (finish.painted in StillsScene) adds
// the brush-edge wobble and paper grain over every card. Same card contract as Gags.jsx: {at, word, kind, dur, ...options};
// positions are fractions of the frame (0-1) unless noted. Paired sounds are listed in EFFECTS_LIBRARY.md.
import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, Easing} from 'remotion';

const R = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.25, 1)});
const pop = (q, k = 1) => q < 0 ? 0 : 1 + 0.22 * k * Math.exp(-q * 7) * Math.sin(q * 22) - Math.exp(-q * 16);
const W = 1920, H = 1080;
export const PAINT = {green: '#2E4A33', cream: '#F3EBDD', yellow: '#E9B93A', red: '#A8432F', ink: '#26302A', paper: '#EFE4CF', violet: '#6B4E8C'};   // matched to Paint.jsx (12 Nov 2026)
const HAND = 'Kalam, cursive', SANS = 'Inter, "Helvetica Neue", Arial, sans-serif', MONO = '"JetBrains Mono", "Courier New", monospace', SERIF = '"Cormorant Garamond", Georgia, serif';
const Pic = ({dir, f, style, filter}) => <Img src={staticFile(`${dir}/${f}`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: filter || 'none', ...style}} />;
const rnd = (i, k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
const brushBox = (extra = {}) => ({background: PAINT.cream, color: PAINT.ink, borderRadius: '14px 22px 12px 26px', boxShadow: '0 8px 22px rgba(20,16,10,0.45)', ...extra});

export const GAGS2 = {

  // chips (SunnyV2 quote chips): 2-4 short quotes lift out as painted pills that stack side by side, c.gap s apart, over a dimmed picture.
  // c.items, c.y (row centre), c.dim. Sound: pop per chip.
  chips: (c, q, d, out) => { const it = c.items || [], gap = c.gap ?? 0.9;
    return <AbsoluteFill style={{opacity: out, background: `rgba(20,16,10,${(c.dim ?? 0.35) * R(q, 0, 0.3)})`}}>
      <div style={{position: 'absolute', left: 80, right: 80, top: (c.y ?? 0.5) * H, transform: 'translateY(-50%)', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center'}}>
        {it.map((x, i) => { const qi = q - 0.15 - i * gap; if (qi < 0) return null;
          return <div key={i} style={{...brushBox({padding: '12px 30px 16px', fontFamily: HAND, fontSize: c.size || 64, transform: `scale(${pop(qi, 0.6)}) rotate(${i % 2 ? 2 : -2}deg)`})}}>“{x}”</div>; })}</div></AbsoluteFill>; },

  // panels (Kurzgesagt accumulating panels): each list item adds a vertical panel and the earlier ones squeeze to share the width.
  // c.imgs, c.times (offsets s, default every 1.2 s), c.caps (optional captions). Full-screen. Sound: whoosh per panel.
  panels: (c, q, d, out, dir) => { const im = c.imgs || [], tm = c.times || im.map((_, i) => i * 1.2), gw = 10;
    const vis = tm.map(x => R(q, x, x + 0.35)), tot = vis.reduce((a, b) => a + b, 0) || 1; let x0 = 0;
    return <AbsoluteFill style={{opacity: out, background: PAINT.ink}}>{im.map((f, i) => { const w = (W - gw * (im.length - 1)) * vis[i] / tot, left = x0; x0 += w + (vis[i] > 0 ? gw : 0); if (vis[i] <= 0) return null;
      return <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left, width: w, overflow: 'hidden'}}><Pic dir={dir} f={f} style={{position: 'absolute', left: '50%', width: W, maxWidth: 'none', transform: 'translateX(-50%)'}} />
        {c.caps && c.caps[i] ? <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center'}}><span style={{...brushBox({padding: '6px 22px 10px', fontFamily: HAND, fontSize: 52})}}>{c.caps[i]}</span></div> : null}</div>; })}</AbsoluteFill>; },

  // clones (MagnatesMedia clone line-up) and queue (CGP Grey "the queue grows"): one cut-out (PNG with transparency) repeated n times,
  // each tinted, with labels; queue: true lines them up behind the first, smaller with distance, one by one. c.img, c.n, c.labels,
  // c.gap, c.y, c.w. Our own mascot or anonymous AI figures only. Sound: pop per clone (rising), a sigh at the end of a queue.
  clones: (c, q, d, out, dir) => { const n = c.n || (c.labels || []).length || 3, gap = c.gap ?? (c.queue ? 0.4 : 0.25), w0 = (c.w ?? (c.queue ? 0.2 : 0.22)) * W, y = (c.y ?? 0.62) * H;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>{Array.from({length: n}).map((_, i) => { const qi = q - i * gap; if (qi < 0) return null;
      const k = c.queue ? Math.pow(0.86, i) : 1, w = w0 * k, x = c.queue ? (c.x ?? 0.3) * W + i * w0 * 0.55 * (1 - i * 0.03) : (W - n * w0 * 0.95) / 2 + i * w0 * 0.95 + w0 / 2, hue = c.queue ? 0 : (c.hues ? c.hues[i] : i * 70);
      return <div key={i} style={{position: 'absolute', left: x - w / 2, top: y - w * 0.6 - (c.queue ? i * 6 : 0), width: w, zIndex: n - i, transform: `scale(${pop(qi, 0.6)})`, transformOrigin: '50% 100%'}}>
        <Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', filter: `hue-rotate(${hue}deg) drop-shadow(0 8px 10px rgba(0,0,0,0.4))${c.queue ? ` brightness(${1 - i * 0.05})` : ''}`}} />
        {c.labels && c.labels[i] ? <div style={{marginTop: 6, textAlign: 'center'}}><span style={{...brushBox({padding: '2px 14px 6px', fontFamily: HAND, fontSize: 40})}}>{c.labels[i]}</span></div> : null}</div>; })}</AbsoluteFill>; },

  // pile (CGP Grey count-out pile): a number shown as that many objects. c.a = {n, label}, c.b = {n, label}: two groups side by side
  // (or one); c.img = a cut-out (coin, banknote) or a painted coin if none; c.cap = per-group cap (default 60: above it the label
  // must say "×1000"-style so the count stays honest). Sound: pop per item, speeding up, then ding.
  pile: (c, q, d, out, dir) => { const groups = [c.a, c.b].filter(Boolean), cap = c.cap ?? 60, sz = c.size || 74, step = c.step ?? 0.05;
    const item = (k) => c.img ? <Img src={staticFile(`${dir}/${c.img}`)} style={{width: sz, height: sz, objectFit: 'contain'}} />
      : <svg width={sz} height={sz}><circle cx={sz / 2} cy={sz / 2} r={sz / 2 - 3} fill={PAINT.yellow} stroke={PAINT.ink} strokeWidth={4} /><circle cx={sz / 2} cy={sz / 2} r={sz / 2 - 12} fill="none" stroke="#B8962E" strokeWidth={3} /></svg>;
    let start = 0.2;
    return <AbsoluteFill style={{opacity: out, background: `rgba(20,16,10,${0.45 * R(q, 0, 0.25)})`, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 140}}>
      {groups.map((g, gi) => { const n = Math.min(cap, g.n), cols = Math.min(10, Math.ceil(Math.sqrt(n * 1.6))), s0 = start; start += n * step + 0.3;
        return <div key={gi} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${sz}px)`, gap: 6}}>{Array.from({length: n}).map((_, i) => { const qi = q - s0 - i * step; return <div key={i} style={{transform: `scale(${pop(qi, 0.5)})`}}>{item(i)}</div>; })}</div>
          <div style={{...brushBox({padding: '6px 24px 10px', fontFamily: HAND, fontSize: 52, opacity: R(q, s0, s0 + 0.3)})}}>{g.label}</div></div>; })}</AbsoluteFill>; },

  // doodle (Map Men doodle on a photo): a crude hand-drawn figure draws itself onto a real photo and holds up a hand-lettered sign at
  // c.signAt s. c.x, c.y (feet), c.h (height share), c.sign, c.color. Places and objects only, never on a real person. Sound: squeak, pop.
  doodle: (c, q, d, out) => { const h = (c.h ?? 0.32) * H, x = (c.x ?? 0.5) * W, y = (c.y ?? 0.82) * H, col = c.color || PAINT.ink, p = R(q, 0, 0.6), sq = q - (c.signAt ?? 0.9), L = 1200;
    const hr = h * 0.13, hy = y - h + hr, sh = y - h * 0.68, hip = y - h * 0.32, arm = sq >= 0 ? -1 : 0;
    const body = `M ${x} ${hy + hr} L ${x} ${hip} M ${x} ${hip} L ${x - h * 0.13} ${y} M ${x} ${hip} L ${x + h * 0.13} ${y} M ${x} ${sh} L ${x - h * 0.2} ${sh + h * 0.18} M ${x} ${sh} L ${x + h * 0.22} ${sh + (arm ? -h * 0.2 : h * 0.16)}`;
    const sx = x + h * 0.22, sy = sh - h * 0.2;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}>
        <circle cx={x - hr * 0.35} cy={hy - hr * 0.1} r={4} fill={col} opacity={p} /><circle cx={x + hr * 0.35} cy={hy - hr * 0.1} r={4} fill={col} opacity={p} />
        <path d={body} fill="none" stroke={c.halo || PAINT.cream} strokeWidth={17} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} opacity={0.85} />
        <circle cx={x} cy={hy} r={hr} fill="none" stroke={c.halo || PAINT.cream} strokeWidth={17} strokeDasharray={L} strokeDashoffset={L * (1 - p)} opacity={0.85} />
        <circle cx={x} cy={hy} r={hr} fill="none" stroke={col} strokeWidth={9} strokeDasharray={L} strokeDashoffset={L * (1 - p)} strokeLinecap="round" />
        <path d={body} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
        {sq >= 0 ? <g transform={`translate(${sx} ${sy}) scale(${pop(sq, 0.6)})`}><line x1={0} y1={0} x2={0} y2={-h * 0.12} stroke={col} strokeWidth={7} />
          <rect x={-h * 0.36} y={-h * 0.12 - h * 0.26} width={h * 0.72} height={h * 0.26} rx={6} fill={PAINT.cream} stroke={col} strokeWidth={6} /></g> : null}</svg>
      {sq >= 0 ? <div style={{position: 'absolute', left: sx - h * 0.36, top: sy - h * 0.38, width: h * 0.72, height: h * 0.26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HAND, fontSize: c.size || h * 0.09, color: col, transform: `scale(${pop(sq, 0.6)})`, transformOrigin: '50% 100%', textAlign: 'center', lineHeight: 1}}>{c.sign}</div> : null}</AbsoluteFill>; },

  // jack (Danny Gonzalez jack-in-the-box): a cut-out object (c.img) splits into two halves that slide apart at c.openAt s, and our
  // mascot (c.inner, a cut-out) pops up from inside. c.x, c.y, c.w. Never a real person inside. Sound: creak + boing.
  jack: (c, q, d, out, dir) => { const w = (c.w ?? 0.34) * W, x = (c.x ?? 0.5) * W, y = (c.y ?? 0.58) * H, o = Easing.out(Easing.cubic)(R(q, c.openAt ?? 0.6, (c.openAt ?? 0.6) + 0.35)), qi = q - (c.openAt ?? 0.6) - 0.15;
    const half = (side) => <div style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, clipPath: side ? 'inset(0 0 0 50%)' : 'inset(0 50% 0 0)', transform: `translateX(${(side ? 1 : -1) * o * w * 0.42}px) rotate(${(side ? 1 : -1) * o * 9}deg)`, zIndex: 2}}>
      <Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.45))'}} /></div>;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      {c.inner && qi >= 0 ? <div style={{position: 'absolute', left: x - w * 0.3, top: y - w * 0.55, width: w * 0.6, height: w * 0.6, zIndex: 1, transform: `translateY(${(1 - Math.min(1, pop(qi, 1.4))) * w * 0.4}px) scale(${pop(qi, 1.2)})`}}>
        <Img src={staticFile(`${dir}/${c.inner}`)} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></div> : null}
      {half(0)}{half(1)}</AbsoluteFill>; },

  // outline (Kurzgesagt "the outline stays"): a cut-out (c.img, PNG) is shown solid, then at c.at s its fill drains away and only a
  // cream outline stays: "it was never built", "they're gone". c.x, c.y, c.w. Objects only. Sound: pop + silence.
  outline: (c, q, d, out, dir) => { const w = (c.w ?? 0.36) * W, x = (c.x ?? 0.5) * W, y = (c.y ?? 0.5) * H, k = R(q, c.at ?? 0.6, (c.at ?? 0.6) + 0.35), id = 'gjol' + Math.round((c.t || 0) * 100);
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}>
      <defs><filter id={id}><feMorphology operator="dilate" radius={5} in="SourceAlpha" result="dl" /><feComposite in="dl" in2="SourceAlpha" operator="out" result="ring" />
        <feFlood floodColor={c.color || PAINT.cream} /><feComposite in2="ring" operator="in" /></filter></defs>
      <image href={staticFile(`${dir}/${c.img}`)} x={x - w / 2} y={y - w / 2} width={w} height={w} opacity={1 - k} />
      <image href={staticFile(`${dir}/${c.img}`)} x={x - w / 2} y={y - w / 2} width={w} height={w} filter={`url(#${id})`} opacity={k} /></svg></AbsoluteFill>; },

  // scroll (LEMMiNO karaoke transmission): monospace lines scroll up over the shot and the line being read lights up (violet bar).
  // c.lines, c.times (offsets s; default every 0.9 s), c.x, c.w (box), c.color. Sound: soft radio blips (ping at -36 dB).
  scroll: (c, q, d, out) => { const ls = c.lines || [], tm = c.times || ls.map((_, i) => 0.2 + i * 0.9), cur = tm.filter(x => q >= x).length - 1, lh = (c.size || 44) * 1.6;
    const off = Math.max(0, cur - 2) + (cur >= 2 ? R(q, tm[Math.max(cur, 0)], tm[Math.max(cur, 0)] + 0.3) - 1 : 0);
    return <AbsoluteFill style={{opacity: out, background: `linear-gradient(90deg, rgba(20,16,10,${0.55 * R(q, 0, 0.3)}) 0%, rgba(20,16,10,0) 70%)`}}>
      <div style={{position: 'absolute', left: (c.x ?? 0.07) * W, top: H * 0.22, width: (c.w ?? 0.6) * W, height: lh * 5, overflow: 'hidden', maskImage: 'linear-gradient(transparent, #000 18%, #000 82%, transparent)', WebkitMaskImage: 'linear-gradient(transparent, #000 18%, #000 82%, transparent)'}}>
        <div style={{transform: `translateY(${(1 - off) * lh}px)`}}>{ls.map((l, i) => { const on = i === cur, seen = q >= tm[i];
          return <div key={i} style={{height: lh, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: c.size || 44, letterSpacing: 2, whiteSpace: 'nowrap', color: seen ? PAINT.cream : 'rgba(241,230,207,0.35)'}}>
            <span style={{background: on ? (c.color || PAINT.violet) : 'transparent', padding: '0 12px', borderRadius: 4}}>{l}</span></div>; })}</div></div></AbsoluteFill>; },

  // recap (CGP Grey recap screen): the previous picture shrinks from full frame into a small framed screen at the top left; c.host (an
  // optional cut-out, e.g. the popcorn alien at a desk) stands beside it and c.next (a picture) builds on the right. Sound: soft whoosh.
  recap: (c, q, d, out, dir) => { const p = Easing.inOut(Easing.cubic)(R(q, 0, 0.6)), sw = 640, sh = 360, L = 90 * p, T = 80 * p, w = W + (sw - W) * p, h = H + (sh - H) * p;
    return <AbsoluteFill style={{opacity: out, background: PAINT.paper}}>
      {c.next ? <div style={{position: 'absolute', right: 90, top: 200, width: 1000, height: 562, opacity: R(q, 0.6, 0.9), boxShadow: '0 14px 34px rgba(0,0,0,0.35)', borderRadius: 10, overflow: 'hidden'}}><Pic dir={dir} f={c.next} /></div> : null}
      {c.host ? <Img src={staticFile(`${dir}/${c.host}`)} style={{position: 'absolute', left: 150, bottom: 60, width: 520, opacity: R(q, 0.5, 0.8), objectFit: 'contain'}} /> : null}
      <div style={{position: 'absolute', left: L, top: T, width: w, height: h, border: `${12 * p}px solid ${PAINT.ink}`, borderRadius: 12 * p, overflow: 'hidden', boxShadow: `0 ${14 * p}px ${34 * p}px rgba(0,0,0,0.4)`}}><Pic dir={dir} f={c.img} /></div>
      {c.text ? <div style={{position: 'absolute', right: 90, top: 90, width: 1000, textAlign: 'center', fontFamily: HAND, fontSize: 64, color: PAINT.ink, opacity: R(q, 0.7, 1.0)}}>{c.text}</div> : null}</AbsoluteFill>; },

  // hand (Kurzgesagt giant hand): a huge cut-out hand (c.img, an anonymous AI hand PNG) slides in from c.from ('right' | 'bottom' |
  // 'top' | 'left') to (c.x, c.y), holds, and at c.exitAt (optional) leaves the way it came. Pair with a pullback on the shot.
  // A joke picture, never a claim. Sound: low whoosh + soft boom.
  hand: (c, q, d, out, dir) => { const w = (c.w ?? 0.7) * W, x = (c.x ?? 0.62) * W, y = (c.y ?? 0.5) * H, e = Easing.out(Easing.cubic)(R(q, 0, 0.6)), ex = c.exitAt ? R(q, c.exitAt, c.exitAt + 0.5) : 0, k = (1 - e) + ex;
    const dv = {right: [W, 0], left: [-W, 0], bottom: [0, H], top: [0, -H]}[c.from || 'right'];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><Img src={staticFile(`${dir}/${c.img}`)} style={{position: 'absolute', left: x - w / 2, top: y - w / 2, width: w, height: w, objectFit: 'contain',
      transform: `translate(${dv[0] * k}px, ${dv[1] * k}px) rotate(${(c.rot ?? -8) + 3 * Math.sin(q * 1.3)}deg)`, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5))'}} /></AbsoluteFill>; },

  // weather (MagnatesMedia literal weather): an idiom becomes real weather over the picture. c.particle = 'snow' | 'dust' | 'leaves'
  // | 'ash', c.n, c.text (optional idiom, big painted letters behind the particles). Money falling stays kind 'rain'. Sound: wind.
  weather: (c, q, d, out) => { const n = c.n || 140, pt = c.particle || 'snow', col = {snow: PAINT.cream, dust: '#C9A87A', leaves: '#B8692E', ash: '#8C8580'}[pt];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      {c.text ? <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.3, textAlign: 'center', fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: c.size || 160, letterSpacing: 6, color: PAINT.cream, opacity: 0.92 * R(q, 0.2, 0.7), textShadow: `0 10px 0 ${PAINT.ink}, 0 18px 40px rgba(0,0,0,0.6)`, transform: `scale(${0.94 + 0.06 * R(q, 0.2, 1.2)})`}}>{c.text}</div> : null}
      <svg width={W} height={H} style={{position: 'absolute'}}>{Array.from({length: n}).map((_, i) => { const sp = pt === 'dust' ? 40 + rnd(i, 2) * 60 : 120 + rnd(i, 2) * 200, x = (rnd(i, 1) * W + Math.sin(q * (0.6 + rnd(i, 5)) + i) * 60 + (pt === 'dust' ? q * 30 : 0)) % W, y = (rnd(i, 3) * H * 1.2 + q * sp) % (H * 1.1) - 40, r = (pt === 'leaves' ? 9 : 3) + rnd(i, 4) * (pt === 'leaves' ? 8 : 6);
        return pt === 'leaves' ? <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.45} fill={col} opacity={0.85} transform={`rotate(${q * 120 * (rnd(i, 6) - 0.5) + i * 40} ${x} ${y})`} /> : <circle key={i} cx={x} cy={y} r={r} fill={col} opacity={pt === 'dust' ? 0.4 : 0.85} />; })}</svg></AbsoluteFill>; },

  // quote (Internet Historian source subtitle): the source's own sentence, word for word, in a cream strip at the bottom while the
  // picture acts it out; c.text (exact quote), c.source (small). Sound: none.
  quote: (c, q, d, out) => <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: 0, right: 0, bottom: 90, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - R(q, 0, 0.25)) * 40}px)`}}>
    <div style={{position: 'relative', maxWidth: 1500}}><div style={{position: 'absolute', inset: 0, background: PAINT.cream, border: `4px solid ${PAINT.ink}`, borderRadius: 6, filter: 'url(#pRough) drop-shadow(0 8px 18px rgba(20,16,10,0.45))'}} />   {/* painted paper scrap (Aliens ch5 review) */}
      <div style={{position: 'relative', padding: '14px 38px 18px', fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700, fontSize: c.size || 48, lineHeight: 1.2, textAlign: 'center', color: PAINT.ink}}>“{String(c.text).replace(/^[“"]+|[”"]+$/g, '')}”
      {c.source ? <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 30, color: PAINT.red, marginTop: 6}}>{c.source}</div> : null}</div></div></div></AbsoluteFill>,

  // ots (Some More News over-the-shoulder pun box): one small box in the top left holds the beat's picture and a short pun title and
  // changes on each cue: c.steps = [[offset s, img, caption], ...]. Our own pictures only, no real logos. Sound: click per change.
  ots: (c, q, d, out, dir) => { const st = (c.steps || []).filter(x => q >= x[0]), cur = st[st.length - 1]; if (!cur) return null; const age = q - cur[0];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><div style={{position: 'absolute', left: 70, top: 70, width: c.w || 520, transform: `scale(${age < 0.2 ? 0.92 + 0.4 * age : 1})`, transformOrigin: '0 0'}}>
      <div style={{width: '100%', height: (c.w || 520) * 9 / 16, border: `8px solid ${PAINT.cream}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}><Pic dir={dir} f={cur[1]} /></div>
      {cur[2] ? <div style={{marginTop: -24, marginLeft: 18, display: 'inline-block', background: PAINT.red, color: PAINT.cream, fontFamily: HAND, fontWeight: 700, fontSize: 40, padding: '6px 18px', transform: 'rotate(-2deg)', boxShadow: '0 6px 16px rgba(0,0,0,0.45)'}}>{cur[2]}</div> : null}</div></AbsoluteFill>; },

  // black (Scott The Woz black beat): hard cut to black for c.dur s (1.5-3), hard cut back; leave a matching gap in the voice track.
  // Optional c.text in small cream type. Never twice in a chapter. Sound: silence.
  black: (c, q, d) => <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center'}}>{c.text && q > (c.textAt ?? 0.6) ? <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 54, color: PAINT.cream}}>{c.text}</div> : null}</AbsoluteFill>,
};
GAGS2.blackbeat = GAGS2.black;
