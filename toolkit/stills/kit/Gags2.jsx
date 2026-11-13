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
          return <div key={i} style={{...brushBox({padding: '12px 30px 16px', fontFamily: HAND, fontSize: c.size || 64, transform: `scale(${pop(qi, 0.6)}) rotate(${i % 2 ? 2 : -2}deg)`})}}>{c.quotes === false ? x : `“${x}”`}</div>; })}</div></AbsoluteFill>; },

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
  // clones options (Primer "let's skip drawing the blobs", gag study 13 Nov 2026, seventh study): c.vanishAt (s) pops the whole line
  // away when Sam says "let's not draw them", then c.returnAt (s) brings c.returnN (default 1) back, slowly and sheepishly, from the
  // edge, when he gives in. Sound: pop as they vanish, a small squeak per one that sneaks back.
  clones: (c, q, d, out, dir) => { const n = c.n || (c.labels || []).length || 3, gap = c.gap ?? (c.queue ? 0.4 : 0.25), w0 = (c.w ?? (c.queue ? 0.2 : 0.22)) * W, y = (c.y ?? 0.62) * H;
    const va = c.vanishAt, gone = va != null && q >= va, ra = c.returnAt, rn = c.returnN ?? 1;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>{Array.from({length: n}).map((_, i) => { const qi = q - i * gap; if (qi < 0) return null;
      if (gone) { const back = ra != null && i < rn ? q - ra - i * 0.6 : -1; const vq = q - va;
        if (back < 0) { if (vq > 0.18) return null; const k0 = 1 - vq / 0.18; const xx = (W - n * w0 * 0.95) / 2 + i * w0 * 0.95 + w0 / 2;
          return <div key={i} style={{position: 'absolute', left: xx - w0 / 2, top: y - w0 * 0.6, width: w0, transform: `scale(${k0 * 1.15})`, opacity: k0, transformOrigin: '50% 100%'}}><Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%'}} /></div>; }
        const e = Easing.out(Easing.cubic)(R(back, 0, 1.4)), xb = W + w0 * 0.2 - e * (W * 0.22 + i * w0 * 0.8), tilt = -8 + 3 * Math.sin(back * 5);
        return <div key={i} style={{position: 'absolute', left: xb - w0 / 2, top: y - w0 * 0.6, width: w0, transform: `rotate(${tilt}deg) scale(${0.9})`, transformOrigin: '50% 100%'}}>
          <Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.4))'}} /></div>; }
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
      {c.sign && qi >= 0.15 ? <div style={{position: 'absolute', left: x - w * 0.34, top: y - w * 0.22, width: w * 0.68, zIndex: 3, ...brushBox({padding: '18px 22px', textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: c.signSize || 54, lineHeight: 1.05, border: `5px solid ${PAINT.ink}`}),
        transform: `translateY(${(1 - Math.min(1, pop(qi - 0.15, 1.2))) * 120}px) rotate(${-4 + 2 * Math.sin(q * 3)}deg)`}}>{c.sign}</div> : null}
      {half(0)}{half(1)}</AbsoluteFill>; },
  // jack option c.sign (JaidenAnimations "sign in the window", gag study 13 Nov 2026): the pop-up figure comes up holding a
  // hand-lettered card with c.sign on it (c.signSize). Our mascot or an object only. Sound: pop + small boing.

  // outline (Kurzgesagt "the outline stays"): a cut-out (c.img, PNG) is shown solid, then at c.at s its fill drains away and only a
  // cream outline stays: "it was never built", "they're gone". c.x, c.y, c.w. Objects only. Sound: pop + silence.
  outline: (c, q, d, out, dir) => { const w = (c.w ?? 0.36) * W, x = (c.x ?? 0.5) * W, y = (c.y ?? 0.5) * H, k = R(q, (typeof c.at === 'number' ? c.at : (c.drainAt ?? 0.6)), (typeof c.at === 'number' ? c.at : (c.drainAt ?? 0.6)) + 0.35), id = 'gjol' + Math.round((c.t || 0) * 100);
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
      {c.source ? <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 40, color: PAINT.red, marginTop: 6}}>{c.source}</div> : null}</div></div></div></AbsoluteFill>,

  // ots (Some More News over-the-shoulder pun box): one small box in the top left holds the beat's picture and a short pun title and
  // changes on each cue: c.steps = [[offset s, img, caption], ...]. Our own pictures only, no real logos. Sound: click per change.
  ots: (c, q, d, out, dir) => { const st = (c.steps || []).filter(x => q >= x[0]), cur = st[st.length - 1]; if (!cur) return null; const age = q - cur[0];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><div style={{position: 'absolute', left: 70, top: 70, width: c.w || 520, transform: `scale(${age < 0.2 ? 0.92 + 0.4 * age : 1})`, transformOrigin: '0 0'}}>
      <div style={{width: '100%', height: (c.w || 520) * 9 / 16, border: `8px solid ${PAINT.cream}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}><Pic dir={dir} f={cur[1]} /></div>
      {cur[2] ? <div style={{marginTop: -24, marginLeft: 18, display: 'inline-block', background: PAINT.red, color: PAINT.cream, fontFamily: HAND, fontWeight: 700, fontSize: 40, padding: '6px 18px', transform: 'rotate(-2deg)', boxShadow: '0 6px 16px rgba(0,0,0,0.45)'}}>{cur[2]}</div> : null}</div></AbsoluteFill>; },

  // black (Scott The Woz black beat): hard cut to black for c.dur s (1.5-3), hard cut back; leave a matching gap in the voice track.
  // Optional c.text in small cream type. Never twice in a chapter. Sound: silence.
  black: (c, q, d) => <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center'}}>{c.text && q > (c.textAt ?? 0.6) ? <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 54, color: PAINT.cream}}>{c.text}</div> : null}</AbsoluteFill>,

  // ---- Gag study 13 Nov 2026 (The Why Files, bill wurtz, Joe Scott, Cleo Abram, PolyMatter). Sam: "start using them from next video onwards".

  // palm (Cleo Abram hold-in-palm): an open hand (c.hand, an anonymous painted cut-out) rises in at the bottom and a small object
  // (c.obj, a painted cut-out) floats, bobs and slowly turns just above the palm with a soft glow and a contact shadow.
  // c.x (palm centre), c.w (hand width share), c.objW, c.glow (colour). Never a real person's hand. Sound: soft sparkle.
  palm: (c, q, d, out, dir) => { const w = (c.w ?? 0.42) * W, x = (c.x ?? 0.5) * W, rise = Easing.out(Easing.cubic)(R(q, 0, 0.5)), oq = q - 0.35, ow = (c.objW ?? 0.14) * W;
    const py = H - w * 0.52 * rise, bob = 10 * Math.sin(q * 2.4), oy = py - ow * 0.9 + bob;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      {oq >= 0 ? <><div style={{position: 'absolute', left: x - ow * 0.9, top: oy - ow * 0.4, width: ow * 1.8, height: ow * 1.8, borderRadius: '50%', background: `radial-gradient(circle, ${c.glow || 'rgba(232,197,71,0.55)'} 0%, rgba(232,197,71,0) 65%)`, opacity: R(oq, 0, 0.4)}} />
        <div style={{position: 'absolute', left: x - ow * 0.35, top: py - 14, width: ow * 0.7, height: 18, borderRadius: '50%', background: 'rgba(20,16,10,0.35)', filter: 'blur(6px)', transform: `scaleX(${1 - bob / 60})`}} />
        <Img src={staticFile(`${dir}/${c.obj}`)} style={{position: 'absolute', left: x - ow / 2, top: oy, width: ow, height: ow, objectFit: 'contain', transform: `scale(${pop(oq, 0.5)}) rotate(${q * (c.spin ?? 25)}deg)`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))'}} /></> : null}
      <Img src={staticFile(`${dir}/${c.hand}`)} style={{position: 'absolute', left: x - w / 2, top: py - w * 0.1, width: w, height: w, objectFit: 'contain', objectPosition: '50% 0'}} /></AbsoluteFill>; },

  // beam (Cleo Abram beam strikes the Earth): a tapered light beam draws from (c.fx, c.fy) to (c.x, c.y) in c.draw s (default 0.45)
  // and flashes where it lands. c.color, c.width. A signal or a capsule arriving; a picture of it, never a claim. Sound: whoosh + ding.
  beam: (c, q, d, out) => { const x0 = (c.fx ?? 0.5) * W, y0 = (c.fy ?? -0.05) * H, x1 = (c.x ?? 0.5) * W, y1 = (c.y ?? 0.6) * H, p = Easing.in(Easing.quad)(R(q, 0, c.draw ?? 0.45)), col = c.color || '#BFE8FF';
    const ex = x0 + (x1 - x0) * p, ey = y0 + (y1 - y0) * p, a = Math.atan2(y1 - y0, x1 - x0), wd = c.width ?? 26, nx = -Math.sin(a), ny = Math.cos(a), fl = q - (c.draw ?? 0.45);
    const tail = Math.max(0, p - 0.55), tx = x0 + (x1 - x0) * tail, ty = y0 + (y1 - y0) * tail;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}>
      <defs><linearGradient id={'bm' + Math.round((c.t || 0) * 100)} x1={tx} y1={ty} x2={ex} y2={ey} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={col} stopOpacity={0} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={1} /></linearGradient></defs>
      <polygon points={`${tx},${ty} ${ex + nx * wd / 2},${ey + ny * wd / 2} ${ex - nx * wd / 2},${ey - ny * wd / 2}`} fill={`url(#bm${Math.round((c.t || 0) * 100)})`} style={{filter: `drop-shadow(0 0 18px ${col})`}} />
      {fl >= 0 ? <circle cx={x1} cy={y1} r={30 + 220 * R(fl, 0, 0.35)} fill={col} opacity={0.75 * (1 - R(fl, 0, 0.5))} /> : null}
      {fl >= 0 ? <circle cx={x1} cy={y1} r={26} fill="#FFFFFF" opacity={1 - R(fl, 0.1, 0.6)} /> : null}</svg></AbsoluteFill>; },

  // tumble (bill wurtz tumbling words): the line's words land one by one at a small random tilt and offset and settle unevenly,
  // for a line meant to feel unsure. c.text, c.times (offsets s; default every 0.32 s), c.size, c.y. Use sparingly. Sound: pop per word.
  tumble: (c, q, d, out) => { const ws = (c.text || '').split(' '), tm = c.times || ws.map((_, i) => 0.15 + i * 0.32), base = c.size || 120;
    return <AbsoluteFill style={{opacity: out, background: `rgba(20,16,10,${0.35 * R(q, 0, 0.2)})`, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{maxWidth: 1600, textAlign: 'center', lineHeight: 1.15, transform: `translateY(${((c.y ?? 0.5) - 0.5) * H}px)`}}>{ws.map((w, i) => { const qi = q - tm[i]; if (qi < 0) return null;
        const r0 = (rnd(i, 1) - 0.5) * 60, r1 = (rnd(i, 2) - 0.5) * 16, dy = (rnd(i, 3) - 0.5) * 50, k = Easing.out(Easing.back(2))(R(qi, 0, 0.35)), fall = (1 - k) * -140;
        return <span key={i} style={{display: 'inline-block', margin: '0 0.18em', fontFamily: SANS, fontWeight: 900, fontSize: base * (0.8 + rnd(i, 4) * 0.45), color: i % 3 === 2 ? PAINT.yellow : PAINT.cream,
          transform: `translateY(${fall + dy}px) rotate(${r0 + (r1 - r0) * k}deg)`, textShadow: `0 6px 0 ${PAINT.ink}, 0 10px 24px rgba(0,0,0,0.5)`}}>{w}</span>; })}</div></AbsoluteFill>; },

  // blocks (bill wurtz colour-block beat card): two or three solid painted-palette blocks snap in behind one big word on the cue,
  // then hard cut. c.text (one or two words), c.colors, c.dur (short: 0.8-1.4). Full-screen. Sound: soft boom on the snap.
  blocks: (c, q, d) => { const cols = c.colors || [PAINT.red, PAINT.green, PAINT.yellow], n = cols.length, gap = c.gap ?? 0.07;
    return <AbsoluteFill style={{background: PAINT.ink}}>{cols.map((col, i) => q < i * gap ? null : <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: `${i * 100 / n}%`, width: `${100 / n + 0.2}%`, background: col}} />)}
      {q >= n * gap ? <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><div style={{fontFamily: SANS, fontWeight: 900, fontSize: c.size || 260, letterSpacing: 4, color: PAINT.cream, textShadow: `0 12px 0 ${PAINT.ink}`, transform: `scale(${pop(q - n * gap, 0.4)})`}}>{c.text}</div></AbsoluteFill> : null}</AbsoluteFill>; },

  // smear (bill wurtz datamosh): for c.dur s (0.4-0.8) the picture melts into horizontal painted-palette pixel streaks that slide and
  // stretch, then clear: a loud transition between a hopeful beat and a bleak one. At most one a video. Sound: static burst.
  smear: (c, q, d) => { const n = 26, cols = [PAINT.red, PAINT.green, PAINT.yellow, PAINT.cream, PAINT.violet, PAINT.ink], env = Math.sin(Math.PI * Math.min(1, q / d)), fr = Math.floor(q * 30);
    return <AbsoluteFill style={{pointerEvents: 'none', opacity: Math.min(1, env * 1.4)}}>{Array.from({length: n}).map((_, i) => { const r = k => rnd(i * 7 + Math.floor(fr / 2), k), h = 12 + r(1) * 70, y = r(2) * H, len = (0.2 + r(3) * 0.9) * W * env;
      return <div key={i} style={{position: 'absolute', top: y, height: h, left: r(4) * W - len / 2 + (r(5) - 0.5) * 300 * env, width: len, background: cols[Math.floor(r(6) * cols.length)], opacity: 0.85,
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0 6px, transparent 6px 18px)'}} />; })}</AbsoluteFill>; },

  // linechart (PolyMatter full-bleed branded data chart): a real series drawn full frame on a flat painted ground. c.series =
  // [{label, color, pts: [[x, y], ...]}] in data units; c.x0/x1/y0/y1 axis range (defaults from the data), c.xticks, c.yticks,
  // c.ylabel, c.title, c.source (small, bottom), c.ground, c.draw (s, default 1.1). Numbers must be the fact-checked ones.
  // Sound: climb while drawing, ding at the end point.
  linechart: (c, q, d, out) => { const S = c.series || [], all = S.flatMap(s => s.pts), X0 = c.x0 ?? Math.min(...all.map(p => p[0])), X1 = c.x1 ?? Math.max(...all.map(p => p[0])),
      Y0 = c.y0 ?? 0, Y1 = c.y1 ?? Math.max(...all.map(p => p[1])) * 1.1, L = 220, Rr = W - 200, T = 200, B = H - 190, sx = v => L + (Rr - L) * (v - X0) / (X1 - X0 || 1), sy = v => B - (B - T) * (v - Y0) / (Y1 - Y0 || 1),
      p = R(q, 0.25, 0.25 + (c.draw ?? 1.1)), ink = c.ink || PAINT.cream;
    const part = pts => { const n = pts.length - 1, f = p * n, k = Math.floor(f), u = f - k, out2 = pts.slice(0, k + 1).map(([a, b]) => [sx(a), sy(b)]);
      if (k < n) { const [a0, b0] = pts[k], [a1, b1] = pts[k + 1]; out2.push([sx(a0 + (a1 - a0) * u), sy(b0 + (b1 - b0) * u)]); } return out2; };
    return <AbsoluteFill style={{opacity: out, background: c.ground || PAINT.green}}>
      {c.title ? <div style={{position: 'absolute', left: L, top: 70, fontFamily: SANS, fontWeight: 900, fontSize: 64, color: ink, letterSpacing: 1}}>{c.title}</div> : null}
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {(c.yticks || []).map((v, i) => <g key={'y' + i}><line x1={L} x2={Rr} y1={sy(v)} y2={sy(v)} stroke={ink} strokeOpacity={0.22} strokeWidth={2} /><text x={L - 20} y={sy(v) + 10} textAnchor="end" fontFamily={MONO} fontSize={30} fill={ink} opacity={0.8}>{c.yfmt ? c.yfmt.replace('{}', v) : v}</text></g>)}
        {(c.xticks || []).map((v, i) => <text key={'x' + i} x={sx(v)} y={B + 50} textAnchor="middle" fontFamily={MONO} fontSize={30} fill={ink} opacity={0.8}>{v}</text>)}
        <line x1={L} x2={Rr} y1={B} y2={B} stroke={ink} strokeWidth={4} />
        {S.map((s, i) => { const pp = part(s.pts), [lx, ly] = pp[pp.length - 1];
          return <g key={i}><polyline points={pp.map(v => v.join(',')).join(' ')} fill="none" stroke={s.color || PAINT.yellow} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={lx} cy={ly} r={14} fill={s.color || PAINT.yellow} stroke={ink} strokeWidth={4} /></g>; })}</svg>
      {S.map((s, i) => { const pp = part(s.pts), [lx, ly] = pp[pp.length - 1]; return p > 0.95 ? <div key={'l' + i} style={{position: 'absolute', left: Math.min(lx + 26, Rr - 200), top: ly - 30, background: s.color || PAINT.yellow, color: PAINT.ink, fontFamily: SANS, fontWeight: 900, fontSize: 32, padding: '4px 14px', borderRadius: 6, transform: `scale(${pop(q - 0.25 - (c.draw ?? 1.1), 0.4)})`, transformOrigin: '0 50%', whiteSpace: 'nowrap'}}>{s.label}</div> : null; })}
      {c.source ? <div style={{position: 'absolute', left: L, bottom: 60, fontFamily: SANS, fontSize: 24, letterSpacing: 2, color: ink, opacity: 0.75, textTransform: 'uppercase'}}>{c.source}</div> : null}
      {c.ylabel ? <div style={{position: 'absolute', left: L, top: T - 60, fontFamily: SANS, fontSize: 28, letterSpacing: 2, color: ink, opacity: 0.8}}>{c.ylabel}</div> : null}</AbsoluteFill>; },
  // ---- Gag study 13 Nov 2026, fifth study (Vox, fern, Hank Green, Mustard, JaidenAnimations, Answer in Progress).

  // tear (fern "the wall tears open"): a ragged hole rips open in the picture from (c.x, c.y), growing to c.r (share of the frame
  // height) over c.open s (default 0.3) from c.at s, showing ink-black behind with a paper-white torn lip and a glowing cream "?"
  // (c.text) or a cut-out (c.img) inside. "But one was missing." Sound: rip, then a soft ding as the inside glows.
  tear: (c, q, d, out, dir) => { const cx = (c.x ?? 0.5) * W, cy = (c.y ?? 0.5) * H, at = (typeof c.at === 'number' ? c.at : (c.openAt ?? 0.2)), p = Easing.out(Easing.back(1.4))(R(q, at, at + (c.open ?? 0.3))), r = (c.r ?? 0.24) * H * p, n = 56, gq = q - at - (c.open ?? 0.3);
    if (q < at) return null;
    const pts = (k, s0) => Array.from({length: n}, (_, i) => { const a = i / n * Math.PI * 2, j = 1 + 0.12 * (rnd(i, s0) - 0.5) + 0.07 * Math.sin(i * 1.3 + s0) + 0.05 * Math.sin(i * 0.45 + 2 * s0); return `${cx + Math.cos(a) * r * k * j * 1.25},${cy + Math.sin(a) * r * k * j}`; }).join(' ');
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}>
      <polygon points={pts(1.09, 3)} fill={PAINT.paper} style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.55))'}} />
      <polygon points={pts(1.0, 3)} fill="#0B0A09" /></svg>
      {gq >= 0 ? c.img ? <Img src={staticFile(`${dir}/${c.img}`)} style={{position: 'absolute', left: cx - r * 0.6, top: cy - r * 0.6, width: r * 1.2, height: r * 1.2, objectFit: 'contain', transform: `scale(${pop(gq, 0.5)})`, filter: `drop-shadow(0 0 24px ${PAINT.yellow})`}} />
        : <div style={{position: 'absolute', left: cx - r, top: cy - r * 0.62, width: r * 2, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: r * 1.05, lineHeight: 1, color: PAINT.cream, opacity: R(gq, 0, 0.35), textShadow: `0 0 28px ${PAINT.yellow}, 0 0 60px rgba(232,197,71,0.6)`}}>{c.text ?? '?'}</div> : null}</AbsoluteFill>; },

  // listening (JaidenAnimations "LISTENING..." badge): a cream disc with a drawn mic and two slow pulsing rings, "LISTENING" with
  // cycling dots under it, held while nothing happens. c.x, c.y, c.size (disc px, default 150), c.label, c.year (optional small
  // date line that can tick: c.years = [[t, '1960'], [t, '1985'], ...]). A running-gag candidate. Sound: none, or a slow ping.
  listening: (c, q, d, out) => { const x = (c.x ?? 0.78) * W, y = (c.y ?? 0.62) * H, S = c.size || 150, inq = Easing.out(Easing.cubic)(R(q, 0, 0.3)), dots = '.'.repeat(1 + Math.floor(q * 2) % 3);
    const yr = (c.years || []).filter(v => q >= v[0]).pop(), ring = k => { const ph = ((q * 0.8 + k * 0.5) % 1); return <div key={k} style={{position: 'absolute', left: x - S / 2, top: y - S / 2, width: S, height: S, borderRadius: '50%', border: `4px solid ${PAINT.cream}`, transform: `scale(${1 + ph * 0.9})`, opacity: (1 - ph) * 0.7}} />; };
    return <AbsoluteFill style={{opacity: out * inq, pointerEvents: 'none'}}>{ring(0)}{ring(1)}
      <div style={{position: 'absolute', left: x - S / 2, top: y - S / 2, width: S, height: S, borderRadius: '50%', background: PAINT.cream, boxShadow: '0 8px 22px rgba(20,16,10,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <svg width={S * 0.5} height={S * 0.5} viewBox="0 0 40 40"><rect x="14" y="4" width="12" height="20" rx="6" fill={PAINT.ink} /><path d="M9 18 a11 11 0 0 0 22 0" fill="none" stroke={PAINT.ink} strokeWidth="3" strokeLinecap="round" /><line x1="20" y1="29" x2="20" y2="35" stroke={PAINT.ink} strokeWidth="3" strokeLinecap="round" /></svg></div>
      <div style={{position: 'absolute', left: x - 260, top: y + S / 2 + 22, width: 520, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: c.textSize || 36, letterSpacing: 6, color: PAINT.cream, textShadow: '0 2px 8px rgba(0,0,0,0.85)'}}>{(c.label || 'LISTENING')}<span style={{display: 'inline-block', width: 60, textAlign: 'left'}}>{dots}</span></div>
      {yr ? <div style={{position: 'absolute', left: x - 260, top: y + S / 2 + 72, width: 520, textAlign: 'center', fontFamily: MONO, fontSize: 30, color: PAINT.yellow, textShadow: '0 2px 8px rgba(0,0,0,0.85)', transform: `scale(${pop(q - yr[0], 0.4)})`}}>{yr[1]}</div> : null}</AbsoluteFill>; },

  // void (JaidenAnimations tiny figure in a blank void): cut to plain painted paper with one small cut-out (c.img) dead centre at
  // c.h of the frame height (default 0.08), held. Loneliness by scale; no move (not pullback) and not dark (not black). c.ground,
  // c.text (an optional tiny caption under it), c.x, c.y. Sound: the wind loop very low, or silence.
  // void options (Simple History hero object on black, gag study 13 Nov 2026, sixth study): c.ground '#0B0A09' for black, c.spin (a slow
  // turn, degrees a second, e.g. 20), c.glint (little sparkles round it), c.act = {img, at} swaps to a second cut-out at c.act.at s
  // (the object doing its job). With a bigger c.h (0.3-0.4) the object is the star of the beat. Sound: sparkle, then the job's sound.
  void: (c, q, d, out, dir) => { const h = (c.h ?? 0.08) * H, x = (c.x ?? 0.5) * W, y = (c.y ?? 0.5) * H, dark = !!c.ground && c.ground[0] === '#' && parseInt(c.ground.slice(1, 3), 16) < 80, acted = c.act && q >= c.act.at, img = acted ? c.act.img : c.img;
    const sw = acted ? pop(q - c.act.at, 0.6) : 1, rot = c.spin && !acted ? q * c.spin : 0;
    return <AbsoluteFill style={{background: c.ground || PAINT.paper, opacity: out}}>
      {c.glint ? [0, 1, 2, 3, 4].map(i => { const a = i * 1.3 + q * 0.7, ph = (q * 1.1 + i * 0.37) % 1, gx = x + Math.cos(a) * h * 0.85, gy = y + Math.sin(a) * h * 0.55, gs = 18 + 22 * Math.sin(ph * Math.PI);
        return <svg key={i} width={gs * 2} height={gs * 2} viewBox="-10 -10 20 20" style={{position: 'absolute', left: gx - gs, top: gy - gs, opacity: Math.sin(ph * Math.PI)}}><path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill={PAINT.yellow} /></svg>; }) : null}
      <Img src={staticFile(`${dir}/${img}`)} style={{position: 'absolute', left: x - h, top: y - h / 2, width: h * 2, height: h, objectFit: 'contain', transform: `translateY(${Math.sin(q * 1.3) * 2}px) rotate(${rot}deg) scale(${sw})`, filter: dark ? `drop-shadow(0 0 24px rgba(232,197,71,0.35))` : undefined}} />
      {c.text ? <div style={{position: 'absolute', left: 0, right: 0, top: y + h * 0.7, textAlign: 'center', fontFamily: HAND, fontSize: 34, color: dark ? PAINT.cream : PAINT.ink, opacity: R(q, c.textAt ?? 1.2, (c.textAt ?? 1.2) + 0.4)}}>{c.text}</div> : null}</AbsoluteFill>; },

  // blueprint (Mustard blueprint side-by-side): two line drawings (c.items = [{img, label, note}], cut-outs drawn as cream lines by
  // an SVG edge filter) on a forest-green ground with a cream grid, each labelled, labels landing c.gap s apart, and an optional
  // short note under each (the one difference). A calm explainer card. Sound: click as each label lands.
  blueprint: (c, q, d, out, dir) => { const it = c.items || [], n = it.length || 1, gap = c.gap ?? 0.5, cw = (W - 240) / n, id = 'gjbp' + Math.round((c.t || 0) * 100), G = c.ground || PAINT.green;
    return <AbsoluteFill style={{background: G, opacity: out}}>
      <svg width={W} height={H} style={{position: 'absolute'}}><defs><pattern id={id + 'g'} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke={PAINT.cream} strokeOpacity="0.16" strokeWidth="2" /></pattern>
        <filter id={id} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="a" /><feMorphology in="a" operator="dilate" radius="3" result="d" /><feComposite in="d" in2="a" operator="out" result="e" />
          <feFlood floodColor={PAINT.cream} /><feComposite in2="e" operator="in" /></filter></defs>
        <rect width={W} height={H} fill={`url(#${id}g)`} /></svg>
      {c.title ? <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 34, letterSpacing: 8, color: PAINT.cream, opacity: 0.85}}>{c.title}</div> : null}
      {it.map((v, i) => { const lq = q - 0.3 - i * gap, dr = R(q, i * gap * 0.6, i * gap * 0.6 + 0.6);
        return <div key={i} style={{position: 'absolute', left: 120 + i * cw, top: 200, width: cw, height: 640}}>
          <div style={{position: 'absolute', left: cw * 0.08, top: 0, width: cw * 0.84, height: 460, clipPath: `inset(0 ${(1 - dr) * 100}% 0 0)`}}><Img src={staticFile(`${dir}/${v.img}`)} style={{width: '100%', height: '100%', objectFit: 'contain', filter: `url(#${id})`}} /></div>
          {lq >= 0 ? <div style={{position: 'absolute', top: 480, left: 0, right: 0, textAlign: 'center', transform: `scale(${pop(lq, 0.4)})`}}><div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: PAINT.cream}}>{v.label}</div>
            {v.note ? <div style={{fontFamily: HAND, fontSize: 34, color: PAINT.yellow, marginTop: 8}}>{v.note}</div> : null}</div> : null}</div>; })}</AbsoluteFill>; },
  // ---- Gag study 13 Nov 2026, sixth study (Fireship, Wendover, TierZoo, Asianometry, Not Just Bikes, Simple History, Real
  // Engineering, Jacob Geller, ElectroBOOM, Phil Edwards). Sam: "Yes go ahead" (build them).

  // bossbar (TierZoo boss health bar): a video-game boss plate at the top (c.name, small c.sub above it) with a long bar that drains
  // in steps on cues (c.hits = [[t, remaining 0-1], ...]); each hit flashes white and shakes the bar, and a lighter "damage" bar
  // catches up behind. Over a real picture. A running-gag candidate. Sound: a soft boom per hit, trombone when it empties.
  bossbar: (c, q, d, out) => { const hits = c.hits || [], cur = hits.filter(h => q >= h[0]).pop(), v = cur ? cur[1] : 1, since = cur ? q - cur[0] : 9;
    const prev = (() => { const i = hits.indexOf(cur); return i > 0 ? hits[i - 1][1] : 1; })(), lag = cur ? prev + (v - prev) * R(since, 0.25, 0.7) : 1;
    const sh = since < 0.3 ? Math.sin(since * 90) * 10 * (1 - since / 0.3) : 0, fl = since < 0.12, bw = c.w ?? 0.62 * W, x0 = (W - bw) / 2, inq = Easing.out(Easing.cubic)(R(q, 0, 0.35));
    return <AbsoluteFill style={{opacity: out * inq, pointerEvents: 'none'}}><div style={{position: 'absolute', left: x0, top: 46 + (1 - inq) * -40, width: bw, transform: `translateX(${sh}px)`}}>
      {c.sub ? <div style={{textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: PAINT.cream, textShadow: '0 2px 6px rgba(0,0,0,0.9)', textTransform: 'uppercase'}}>{c.sub}</div> : null}
      <div style={{textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: c.size || 54, letterSpacing: 3, color: PAINT.cream, textShadow: '0 3px 10px rgba(0,0,0,0.95)', fontVariant: 'small-caps', lineHeight: 1.1}}>{c.name}</div>
      <div style={{position: 'relative', height: 34, marginTop: 10, background: 'rgba(20,16,10,0.75)', border: `4px solid ${PAINT.ink}`, borderRadius: 6, boxShadow: '0 4px 14px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${lag * 100}%`, background: PAINT.cream, opacity: 0.85}} />
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v * 100}%`, background: fl ? '#FFFFFF' : PAINT.red}} /></div></div></AbsoluteFill>; },

  // flow (Fireship flowchart that closes into a loop): painted boxes (c.nodes = [{label, x, y, value?, color?}], fractions) appear one
  // at a time c.gap s apart, joined by labelled arrows (c.edges = [[from, to, label]]) drawn after their second box; with c.loop the
  // last arrow closes the circuit and a dashed ring draws round the whole thing at c.loopAt s. Values are fact-checked figures only.
  // On a dark ground (c.ground) or over a dimmed picture. Sound: pop per box, squeak per arrow, ding when the loop closes.
  flow: (c, q, d, out) => { const N = c.nodes || [], E = c.edges || [], gap = c.gap ?? 0.45, bw = c.bw ?? 300, bh = c.bh ?? 110, P0 = N.map(n => [n.x * W, n.y * H]);
    const cx = P0.reduce((a, p) => a + p[0], 0) / (P0.length || 1), cy = P0.reduce((a, p) => a + p[1], 0) / (P0.length || 1), rr = Math.max(...P0.map(p => Math.hypot(p[0] - cx, (p[1] - cy) * 1.6))) + bw * 0.75;
    const la = c.loopAt ?? (N.length * gap + 0.4), lp = c.loop ? R(q, la, la + 0.6) : 0, cols = [PAINT.green, PAINT.violet, PAINT.red, '#3F6E8C', PAINT.yellow];
    const edge = (e, i) => { const [a, b, lab] = e, ta = Math.max(a, b) * gap + 0.25, p = R(q, ta, ta + 0.35); if (p <= 0) return null;
      const [x0, y0] = P0[a], [x1, y1] = P0[b], ang = Math.atan2(y1 - y0, x1 - x0), sx = x0 + Math.cos(ang) * bw * 0.55, sy = y0 + Math.sin(ang) * bh * 0.8, ex = x1 - Math.cos(ang) * bw * 0.55, ey = y1 - Math.sin(ang) * bh * 0.8;
      const px = sx + (ex - sx) * p, py = sy + (ey - sy) * p, mx = (sx + ex) / 2, my = (sy + ey) / 2;
      return <g key={i}><line x1={sx} y1={sy} x2={px} y2={py} stroke={PAINT.cream} strokeWidth={6} strokeLinecap="round" />
        {p >= 1 ? <polygon points="0,-12 22,0 0,12" fill={PAINT.cream} transform={`translate(${ex},${ey}) rotate(${ang * 180 / Math.PI}) translate(-20,0)`} /> : null}
        {p >= 1 && lab ? <text x={mx - Math.sin(ang) * 34} y={my + Math.cos(ang) * 34 + 10} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={c.labelSize || 32} fill={PAINT.yellow} stroke="#0B0A09" strokeWidth={6} paintOrder="stroke">{lab}</text> : null}</g>; };
    return <AbsoluteFill style={{background: c.ground || 'rgba(11,10,9,0.72)', opacity: out}}>
      <svg width={W} height={H} style={{position: 'absolute'}}>{E.map(edge)}
        {c.loop && lp > 0 ? <ellipse cx={cx} cy={cy} rx={rr} ry={rr / 1.6} fill="none" stroke={PAINT.yellow} strokeWidth={5} strokeDasharray="18 16" pathLength={1000} strokeDashoffset={0} style={{clipPath: `inset(0 ${(1 - lp) * 100}% 0 0)`}} /> : null}</svg>
      {N.map((n, i) => { const nq = q - i * gap; if (nq < 0) return null; const [x, y] = P0[i];
        return <div key={i} style={{position: 'absolute', left: x - bw / 2, top: y - bh / 2, width: bw, height: bh, transform: `scale(${pop(nq, 0.5)})`, ...brushBox({background: n.color || cols[i % cols.length], color: PAINT.cream}), display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 34, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.05}}>
          {n.label}{n.value ? <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 28, color: PAINT.yellow, marginTop: 4}}>{n.value}</div> : null}</div>; })}
      {c.loop && lp >= 1 && c.loopLabel ? <div style={{position: 'absolute', left: 0, right: 0, top: cy + rr / 1.6 + 10, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 60, color: PAINT.yellow, transform: `scale(${pop(q - la - 0.6, 0.5)})`}}>{c.loopLabel}</div> : null}</AbsoluteFill>; },

  // telemetry (Real Engineering live readout): a small mono HUD block (c.x, c.y; default top-left) with 2-4 labelled rows that tick
  // every second together (c.rows = [{label, from, to, unit, dp}]; a row with from === to never changes, e.g. MESSAGES RECEIVED 0).
  // c.title (small header). Over a still or a render. Sound: a soft ticks loop, or none.
  telemetry: (c, q, d, out) => { const rows = c.rows || [], k = Math.min(1, Math.floor(q) / Math.max(1, Math.floor(d) - 1)), inq = R(q, 0, 0.3), fmt = (v, dp) => Number(v).toLocaleString('en-GB', {minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0});
    return <AbsoluteFill style={{opacity: out * inq, pointerEvents: 'none'}}><div style={{position: 'absolute', left: (c.x ?? 0.05) * W, top: (c.y ?? 0.07) * H, padding: '18px 26px', background: 'rgba(11,10,9,0.62)', border: `2px solid rgba(241,230,207,0.35)`, borderRadius: 10, fontFamily: MONO, color: PAINT.cream}}>
      {c.title ? <div style={{fontSize: 24, letterSpacing: 5, opacity: 0.9, marginBottom: 8, color: PAINT.yellow}}>{c.title}</div> : null}
      {rows.map((r, i) => { const v = r.from + (r.to - r.from) * k, still = r.from === r.to;
        return <div key={i} style={{display: 'flex', gap: 36, fontSize: c.size || 38, lineHeight: 1.45}}><span style={{width: c.labelW || 420, opacity: 0.85, whiteSpace: 'nowrap'}}>{r.label}</span>
          <span style={{color: still ? '#F07A62' : PAINT.yellow, fontWeight: 700, minWidth: 220, textAlign: 'right'}}>{fmt(v, r.dp)}{r.unit ? ' ' + r.unit : ''}</span></div>; })}</div></AbsoluteFill>; },

  // search (Phil Edwards search bar that types): a cream search box (c.y) types c.query letter by letter with a blinking cursor
  // (c.speed letters a second, default 14), then at c.resultAt s shows c.result under it (a result line, "0 results", "did you mean").
  // Sound: a soft click per key, then ding or trombone on the result.
  search: (c, q, d, out) => { const Q = c.query || '', sp = c.speed ?? 14, n = Math.min(Q.length, Math.max(0, Math.floor((q - 0.25) * sp))), ra = c.resultAt ?? (0.45 + Q.length / sp + 0.35), bw = c.w ?? 0.56 * W, y = (c.y ?? 0.4) * H, inq = Easing.out(Easing.cubic)(R(q, 0, 0.3));
    return <AbsoluteFill style={{background: c.dim === false ? undefined : 'rgba(11,10,9,0.5)', opacity: out}}>
      <div style={{position: 'absolute', left: (W - bw) / 2, top: y - 50 + (1 - inq) * 30, width: bw, height: 100, borderRadius: 50, ...brushBox({borderRadius: 50}), display: 'flex', alignItems: 'center', padding: '0 40px', boxSizing: 'border-box', gap: 26}}>
        <svg width={44} height={44} viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke={PAINT.ink} strokeWidth="2.6" /><line x1="15" y1="15" x2="22" y2="22" stroke={PAINT.ink} strokeWidth="2.8" strokeLinecap="round" /></svg>
        <div style={{fontFamily: SANS, fontSize: 46, color: PAINT.ink, whiteSpace: 'nowrap'}}>{Q.slice(0, n)}<span style={{opacity: Math.floor(q * 2.5) % 2 ? 0 : 1, fontWeight: 300}}>|</span></div></div>
      {q >= ra && c.result ? <div style={{position: 'absolute', left: (W - bw) / 2 + 40, top: y + 76, fontFamily: c.resultHand ? HAND : SANS, fontSize: c.resultSize || 40, fontWeight: 700, color: PAINT.cream, textShadow: '0 2px 8px rgba(0,0,0,0.9)', transform: `scale(${pop(q - ra, 0.4)})`, transformOrigin: '0 50%'}}>{c.result}</div> : null}</AbsoluteFill>; },

  // equation (Phil Edwards icon sum): 2-3 painted cut-outs (c.terms = [{img} | {text}]) land one by one c.gap s apart with "+"
  // between them, then "=" and the answer (c.answer = {img} | {text}). A picture sum for a plain point. c.y, c.size (term px).
  // Sound: pop per term, ding (or trombone) on the answer.
  equation: (c, q, d, out, dir) => { const gap = c.gap ?? 0.45, S = c.size || 230, y = (c.y ?? 0.5) * H;
    const items = []; (c.terms || []).forEach((t, i) => { if (i) items.push({op: '+'}); items.push(t); }); items.push({op: '='}); items.push(c.answer || {text: '?'});
    const wOf = it => it.op ? 110 : S, tot = items.reduce((a, it) => a + wOf(it), 0); let x = (W - tot) / 2; let k = -1;
    return <AbsoluteFill style={{background: c.ground || 'rgba(234,223,198,0.94)', opacity: out}}>{items.map((it, i) => { const x0 = x; x += wOf(it); if (!it.op) k++; const at = (it.op ? k + 0.6 : k) * gap + (it === items[items.length - 1] ? 0.3 : 0), iq = q - at;
      if (iq < 0) return null; const st = {position: 'absolute', left: x0, top: y - S / 2, width: wOf(it), height: S, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(iq, 0.6)})`};
      return <div key={i} style={st}>{it.op ? <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 110, color: PAINT.ink}}>{it.op}</span>
        : it.img ? <Img src={staticFile(`${dir}/${it.img}`)} style={{width: S * 0.92, height: S * 0.92, objectFit: 'contain', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))'}} />
        : <span style={{fontFamily: HAND, fontWeight: 700, fontSize: it.size || 120, color: it === items[items.length - 1] ? PAINT.red : PAINT.ink, whiteSpace: 'nowrap'}}>{it.text}</span>}</div>; })}</AbsoluteFill>; },
  // ---- Gag study 13 Nov 2026, seventh study (RealLifeLore, Vsauce2, Primer, Ordinary Things, Nerdwriter1, Tantacrul, Kraut,
  // Mark Rober, Veritasium, Extra History). Sam: "yes" (build them).

  // peel (Mark Rober glasses under glasses): a stamp on the picture (c.text, red ink plate) peels away from a corner at each of
  // c.times (s), curling and lifting off, and underneath is the same stamp again; c.last (text) can finally be different.
  // c.x, c.y, c.rot. Sound: a sticky rip per peel, trombone when it is the same again.
  peel: (c, q, d, out) => { const tm = c.times || [0.9, 1.8], k = tm.filter(x => q >= x + 0.45).length, cur = tm.find(x => q >= x && q < x + 0.45), x = (c.x ?? 0.5) * W, y = (c.y ?? 0.45) * H, rot = c.rot ?? -9;
    const label = i => i >= tm.length && c.last ? c.last : (c.texts ? c.texts[Math.min(i, c.texts.length - 1)] : c.text || 'CANCELLED');
    const stamp = (txt, extra = {}) => <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)`, border: `10px solid ${PAINT.red}`, color: PAINT.red, background: 'rgba(241,230,207,0.92)', fontFamily: SANS, fontWeight: 900, fontSize: c.size || 104, letterSpacing: 6, padding: '6px 34px', whiteSpace: 'nowrap', boxShadow: '0 10px 24px rgba(0,0,0,0.45)', ...extra}}>{txt}</div>;
    const first = q < 0.25 ? 1 + 0.6 * Math.exp(-q * 12) : 1;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      {stamp(label(k + (cur != null ? 1 : 0)), cur == null && k === 0 ? {transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${first})`} : {})}
      {cur != null ? (() => { const p = Easing.in(Easing.quad)(R(q, cur, cur + 0.45));
        return stamp(label(k), {transformOrigin: '100% 100%', transform: `translate(-50%, -50%) rotate(${rot}deg) perspective(900px) rotateX(${-p * 70}deg) rotateY(${p * 40}deg) translate(${p * 320}px, ${-p * 420}px) rotate(${p * 25}deg)`, opacity: 1 - p * 0.6, boxShadow: `0 ${10 + p * 50}px ${24 + p * 40}px rgba(0,0,0,0.5)`}); })() : null}</AbsoluteFill>; },

  // rollcall (Vsauce2 roll-call montage): full-frame pictures cut hard every c.gap s (default 1.0), each with its name in bold caps
  // at the bottom (c.items = [{img, label}]), so a list has a length you can feel. Sound: a soft click on each cut.
  rollcall: (c, q, d, out, dir) => { const it = c.items || [], gap = c.gap ?? 1.0, i = Math.min(it.length - 1, Math.max(0, Math.floor(q / gap))), cur = it[i] || {}, iq = q - i * gap;
    return <AbsoluteFill style={{background: '#0B0A09', opacity: out}}>{cur.img ? <Img src={staticFile(`${dir}/${cur.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.04 + iq * 0.03})`}} /> : null}
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(11,10,9,0.7) 0%, rgba(11,10,9,0) 30%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: c.size || 72, letterSpacing: 4, color: PAINT.cream, textShadow: '0 4px 14px rgba(0,0,0,0.9)', textTransform: 'uppercase'}}>{cur.label}</div></AbsoluteFill>; },

  // dust (Tantacrul "blows dust off the UI"): a grey-brown dust layer lies over the picture (or c.img, a document still, shown
  // centred); at c.at s a puff sweeps it off left to right in a cloud of particles, leaving it clean. Sound: blow, then a small cough.
  dust: (c, q, d, out, dir) => { const at = c.at ?? 0.8, p = R(q, at, at + 0.7), id = 'gjdust' + Math.round((c.t || 0) * 100), fx = p * 1.25 * W;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      {c.img ? <div style={{position: 'absolute', left: W * 0.2, top: H * 0.1, width: W * 0.6, height: H * 0.8, ...brushBox({padding: 0, overflow: 'hidden'})}}><Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div> : null}
      <svg width={W} height={H} style={{position: 'absolute'}}><defs><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.9 0.6" numOctaves="3" seed="4" /><feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.50  0 0 0 0 0.42  0 0 0 2.4 -0.9" /></filter>
        <linearGradient id={id + 'm'} x1="0" x2="1"><stop offset={Math.max(0, p * 1.25 - 0.12)} stopColor="#000" /><stop offset={Math.min(1, p * 1.25)} stopColor="#fff" /></linearGradient><mask id={id + 'k'}><rect width={W} height={H} fill={`url(#${id}m)`} /></mask></defs>
        <g mask={`url(#${id}k)`}><rect width={W} height={H} fill="rgba(150,135,110,0.55)" /><rect width={W} height={H} filter={`url(#${id})`} opacity={0.9} /></g>
        {p > 0 && p < 1 ? Array.from({length: 70}).map((_, i) => { const r0 = rnd(i, 3), r1 = rnd(i, 7), px = fx - 140 + r0 * 260 + p * 300 * r1, py = H * (0.1 + 0.8 * r1) - p * 120 * r0;
          return <circle key={i} cx={px} cy={py} r={4 + 14 * r0} fill="#A8987C" opacity={0.6 * (1 - p)} />; }) : null}</svg></AbsoluteFill>; },

  // nest (Tantacrul menu crawl): a painted dialog box opens, then a smaller one inside it, then another (c.titles, one per window,
  // c.gap s apart), each offset down and right, until the last is tiny; bureaucracy as a picture. c.last (text inside the last one).
  // Sound: click per window, error on the last.
  nest: (c, q, d, out) => { const T = c.titles || ['Application'], gap = c.gap ?? 0.5, w0 = 0.72 * W, h0 = 0.72 * H;
    return <AbsoluteFill style={{background: 'rgba(11,10,9,0.45)', opacity: out}}>{T.map((t, i) => { const iq = q - i * gap; if (iq < 0) return null; const k = Math.pow(0.74, i), w = w0 * k, h = h0 * k, x = (W - w0) / 2 + (w0 - w) * 0.62, y = (H - h0) / 2 + (h0 - h) * 0.66, last = i === T.length - 1;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${pop(iq, 0.4)})`, ...brushBox({borderRadius: 12, padding: 0, overflow: 'hidden', border: `4px solid ${PAINT.ink}`})}}>
        <div style={{height: Math.max(26, 54 * k), background: PAINT.green, color: PAINT.cream, fontFamily: SANS, fontWeight: 800, fontSize: Math.max(14, 30 * k), display: 'flex', alignItems: 'center', padding: `0 ${18 * k}px`, gap: 10 * k}}>
          <span style={{display: 'inline-flex', gap: 6 * k}}>{[PAINT.red, PAINT.yellow, PAINT.cream].map((col, j) => <span key={j} style={{width: 14 * k, height: 14 * k, borderRadius: '50%', background: col}} />)}</span>{t}</div>
        {last && c.last ? <div style={{padding: 14 * k, fontFamily: HAND, fontSize: Math.max(16, 44 * k), color: PAINT.ink}}>{c.last}</div> : null}</div>; })}</AbsoluteFill>; },

  // trophy (Extra History city on a plinth): a cut-out (c.img) on a painted plinth with a nameplate (c.label) and a plain flag on a
  // pole (c.flag text on c.flagColor); at c.swapAt s the flag drops and a new one rises (c.flag2 on c.flag2Color). Our own plain
  // flags with a word only: no real national flags or logos. Sound: whoosh as it drops, tada (or trombone) as the new one rises.
  trophy: (c, q, d, out, dir) => { const x = (c.x ?? 0.5) * W, base = (c.y ?? 0.8) * H, ow = (c.w ?? 0.3) * W, sw = c.swapAt, down = sw != null ? R(q, sw, sw + 0.35) : 0, up = sw != null ? Easing.out(Easing.back(1.6))(R(q, sw + 0.4, sw + 0.9)) : 0, inq = pop(q, 0.4);
    const px = x + ow * 0.62, top = base - ow * 1.05, flag = (txt, col, k) => <div style={{position: 'absolute', left: px + 6, top: top + 10 + (1 - k) * ow * 0.75, height: 70, minWidth: 150, padding: '0 22px', background: col, color: PAINT.cream, fontFamily: HAND, fontWeight: 700, fontSize: 38, display: 'flex', alignItems: 'center', borderRadius: '0 10px 10px 0', boxShadow: '0 6px 12px rgba(0,0,0,0.35)', transform: `skewY(${-3 + 2 * Math.sin(q * 4)}deg)`, opacity: k > 0.02 ? 1 : 0}}>{txt}</div>;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none', transform: `scale(${inq})`, transformOrigin: `${x}px ${base}px`}}>
      <div style={{position: 'absolute', left: px, top, width: 8, height: ow * 1.05, background: PAINT.ink, borderRadius: 4}} />
      {sw == null || q < sw + 0.4 ? flag(c.flag || 'OURS', c.flagColor || PAINT.green, 1 - down) : flag(c.flag2 || 'THEIRS', c.flag2Color || PAINT.red, up)}
      <Img src={staticFile(`${dir}/${c.img}`)} style={{position: 'absolute', left: x - ow / 2, top: base - ow * 0.78, width: ow, height: ow * 0.7, objectFit: 'contain', filter: 'drop-shadow(0 10px 12px rgba(0,0,0,0.4))'}} />
      <div style={{position: 'absolute', left: x - ow * 0.62, top: base - 10, width: ow * 1.24, height: 70, background: '#6B4A2E', borderRadius: '10px 10px 4px 4px', boxShadow: '0 12px 20px rgba(0,0,0,0.45)', borderTop: `6px solid #8A6440`}} />
      {c.label ? <div style={{position: 'absolute', left: x - ow * 0.38, top: base + 6, width: ow * 0.76, textAlign: 'center', ...brushBox({padding: '2px 8px', fontFamily: SERIF, fontWeight: 700, fontSize: 32, letterSpacing: 3, background: '#D9B46A', boxShadow: 'none'})}}>{c.label}</div> : null}</AbsoluteFill>; },

  // foreground (Ordinary Things over-the-shoulder): one large cut-out (c.img) at a frame edge (c.side 'left' | 'right' | 'bottom'),
  // heavily blurred and darkened, in front of the still, so we look past something (a dish rim, the alien's shoulder) at the subject.
  // It drifts a little against the picture for depth. c.w (share of the frame width), c.blur. Sound: none.
  foreground: (c, q, d, out, dir) => { const side = c.side || 'right', w = (c.w ?? 0.55) * W, dx = Math.sin(q * 0.6) * 14 + q * (side === 'left' ? 6 : -6), inq = Easing.out(Easing.cubic)(R(q, 0, 0.5));
    const pos = side === 'left' ? {left: -w * 0.35 - (1 - inq) * w * 0.3 + dx, top: H * 0.25} : side === 'bottom' ? {left: (W - w) / 2 + dx, top: H * 0.62 + (1 - inq) * H * 0.3} : {left: W - w * 0.65 + (1 - inq) * w * 0.3 + dx, top: H * 0.2};
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><Img src={staticFile(`${dir}/${c.img}`)} style={{position: 'absolute', ...pos, width: w, height: w, objectFit: 'contain', filter: `blur(${c.blur ?? 18}px) brightness(0.55)`, transform: side === 'left' ? 'scaleX(-1)' : undefined}} /></AbsoluteFill>; },
};
GAGS2.blackbeat = GAGS2.black;
