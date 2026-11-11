// Picture-gag overlays for the stills kit (Sam, 11 Nov 2026: "a detailed library of picture gags and various effects which we
// can give on our pictures and videos"). Each kind is a card in the scene plan: {at, word, kind, dur, ...options}.
// Positions x, y, w, h, r are fractions of the frame (0-1) unless noted. Every kind lists its paired sound in EFFECTS_LIBRARY.md.
import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, Easing} from 'remotion';

const cl = (v) => Math.min(1, Math.max(0, v));
const R = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.25, 1)});
const pop = (q, k = 1) => q < 0 ? 0 : 1 + 0.22 * k * Math.exp(-q * 7) * Math.sin(q * 22) - Math.exp(-q * 16);   // springy pop-in scale
const RED = '#E0261B', HAND = 'Kalam, cursive', SANS = 'Inter, "Helvetica Neue", Arial, sans-serif', MONO = '"JetBrains Mono", "Courier New", monospace', SERIF = '"Cormorant Garamond", Georgia, serif';
const W = 1920, H = 1080;

export const gagCard = (c, t, dir) => { const f = GAGS[c.kind]; if (!f) return undefined;   // undefined: not a gag kind
  const d = c.dur || 2, q = t - c.t; if (q < 0 || q > d) return null;
  return f(c, q, d, 1 - R(t, c.t + d - 0.15, c.t + d), dir); };

const GAGS = {
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
