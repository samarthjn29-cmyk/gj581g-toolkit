// Painted gag kit (Sam, 12 Nov 2026: "the design and feel of the gags is not really going with the AI generated painted images ...
// I would like to align them more so that they compliment each other"). Turned on per plan with finish.gags: "painted".
// Same timing and motion as the flat gags; only the look changes: cream paper (#F3EBDD), ink lines (#26302A) with a slightly
// rough, hand-cut edge (SVG displacement), brick-red stamps with an ink texture, Kalam lettering, Fraunces for names and mastheads.
// Text itself stays crisp (never displaced), so it keeps its reading time.
import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, Easing} from 'remotion';

export const P = {on: false};
export const INK = '#26302A', PAPER = '#F3EBDD', BRICK = '#A8432F', OCHRE = '#E9B93A', GREEN = '#0B5E2A', STRING = '#8B6B4A';
const HAND = 'Kalam, cursive', SERIF = 'Fraunces, Georgia, serif', W = 1920, H = 1080;
const R = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.45, 0, 0.25, 1)});
const pop = (q, k = 1) => q < 0 ? 0 : 1 + 0.22 * k * Math.exp(-q * 7) * Math.sin(q * 22) - Math.exp(-q * 16);
const paperShadow = 'drop-shadow(0 8px 18px rgba(20,16,10,0.45))';

// paper grain + uneven wash laid over full-screen cards (kinetic, number, title, chain, ruler ...) so they read as painted paper
// opacity sits on each blended child, never on the wrapper: a wrapper below 1 opacity becomes its own group, the multiply
// blends inside it instead of with the picture, and the paper flashes near-white while the card fades (ch6 review, 12 Nov 2026)
export const PaperTex = ({o = 1}) => o <= 0 ? null : <AbsoluteFill style={{pointerEvents: 'none'}}>
  <Img src={staticFile('paint/paper_tex.jpg')} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', mixBlendMode: 'multiply', opacity: o}} />
  <svg width={W} height={H} style={{position: 'absolute', mixBlendMode: 'multiply', opacity: o}}>
    <filter id="pTexF"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="11" /><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 -1.6 1.15" /></filter>
    <filter id="pWashF"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="3" seed="6" /><feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 -1.2 0.75" /></filter>
    <rect width={W} height={H} filter="url(#pWashF)" opacity={0.25} /><rect width={W} height={H} filter="url(#pTexF)" opacity={0.35} /></svg>
  <AbsoluteFill style={{boxShadow: 'inset 0 0 160px rgba(70,50,25,0.45)'}} /></AbsoluteFill>;

// filters, once per frame
export const PaintDefs = () => <svg width={0} height={0} style={{position: 'absolute'}}>
  <filter id="pRough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="8" /></filter>
  <filter id="pInk" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="t" />
    <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 1.25" result="m" /><feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
    <feTurbulence type="fractalNoise" baseFrequency="0.04" seed="2" result="w" /><feDisplacementMap in="c" in2="w" scale="6" /></filter>
  <filter id="pBrush" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="5" result="t" />
    <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.3" result="m" /><feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
    <feTurbulence type="fractalNoise" baseFrequency="0.05" seed="4" result="w" /><feDisplacementMap in="c" in2="w" scale="5" /></filter>
</svg>;

// a paper scrap behind a block of text (rough edge on the shape only)
const Scrap = ({fill = PAPER, stroke = INK, sw = 4, r = 6, children, style, pad = '18px 34px 22px'}) => <div style={{position: 'relative', ...style}}>
  <div style={{position: 'absolute', inset: 0, background: fill, border: stroke ? `${sw}px solid ${stroke}` : 'none', borderRadius: r, filter: `url(#pRough) ${paperShadow}`}} />
  <div style={{position: 'relative', padding: pad}}>{children}</div></div>;

// speech / thought bubble: one path (body + tail) so the tail joins the body like a drawn balloon
const bubblePath = (x, y, w, h, tx, ty) => { const l = x - w / 2, r = x + w / 2, tp = y - h / 2, b = y + h / 2, k = 0.55;
  // base of the tail on the edge nearest the tip
  const below = ty > b, above = ty < tp, side = !below && !above; let a1, a2;
  if (below || above) { const ex = above ? tp : b, bx = Math.max(l + w * 0.2, Math.min(r - w * 0.2, x + (tx - x) * 0.35)); a1 = [bx - 34, ex]; a2 = [bx + 34, ex]; }
  else { const ex = tx > x ? r : l, by = Math.max(tp + h * 0.25, Math.min(b - h * 0.25, y)); a1 = [ex, by - 30]; a2 = [ex, by + 30]; }
  const e = (px, py) => `${px.toFixed(1)},${py.toFixed(1)}`;
  // ellipse-ish rounded body drawn as 4 curves, the tail spliced into the matching side
  const top = `M ${e(l, y)} C ${e(l, y - h / 2 * k * 1.8)} ${e(x - w / 2 * k, tp)} ${e(x, tp)}`;
  const tr = ` C ${e(x + w / 2 * k, tp)} ${e(r, y - h / 2 * k * 1.8)} ${e(r, y)}`;
  const br = ` C ${e(r, y + h / 2 * k * 1.8)} ${e(x + w / 2 * k, b)} ${e(x, b)}`;
  const bl = ` C ${e(x - w / 2 * k, b)} ${e(l, y + h / 2 * k * 1.8)} ${e(l, y)} Z`;
  const tail = ` L ${e(...a2)} L ${e(tx, ty)} L ${e(...a1)}`;
  const body = top + tr + br + bl, T = `M ${e(...a1)} L ${e(tx, ty)} L ${e(...a2)} Z`;
  return {body, T, side, tailUnused: tail}; };

const measure = (text, size) => { const lines = String(text).split('\n'); const longest = Math.max(...lines.map(s => s.length)); return {w: Math.min(820, longest * size * 0.5 + 110), h: lines.length * size * 1.15 + 70, lines}; };

export const PAINTED = {
  // peel, painted (Sam, Moctar 14 Nov 2026: "Do the peeling stamp"): an inked stamp printed on a cream paper sticker with a
  // hand-cut edge; at each of c.times the sticker peels from its bottom-right corner, its pale paper back curling towards the
  // camera, and underneath is the next label (c.texts[i], or c.text again, with c.last for the final one). c.x, c.y (0-1), c.rot, c.size.
  peel: (c, q, d, out) => { const PD = 0.7, tm = c.times || [0.9, 1.8], k = tm.filter(x => q >= x + PD).length, cur = tm.find(x => q >= x && q < x + PD),
      x = (c.x ?? 0.5) * W, y = (c.y ?? 0.45) * H, rot = c.rot ?? -9, size = c.size || 92;
    const label = i => i >= tm.length && c.last ? c.last : (c.texts ? c.texts[Math.min(i, c.texts.length - 1)] : c.text || 'CANCELLED');
    const sticker = (txt, back = false) => <div style={{position: 'relative', padding: `${Math.round(size * 0.22)}px ${Math.round(size * 0.34)}px`}}>
      <div style={{position: 'absolute', inset: 0, background: back ? '#E4D8C2' : (c.paper || '#E8D2A6'), filter: `url(#pRough) ${paperShadow}`}} />
      <div style={{position: 'relative', filter: 'url(#pInk)', border: `${Math.round(size * 0.07)}px solid ${BRICK}`, outline: `${Math.round(size * 0.025)}px solid ${BRICK}`, outlineOffset: Math.round(size * 0.05),
        padding: `${Math.round(size * 0.04)}px ${Math.round(size * 0.28)}px`, fontFamily: SERIF, fontWeight: 700, fontSize: size, letterSpacing: Math.round(size * 0.065), color: BRICK,
        whiteSpace: 'nowrap', lineHeight: 1.1, opacity: back ? 0.12 : 1, transform: back ? 'scaleX(-1)' : 'none'}}>{txt}</div></div>;
    const place = (el, extra = '', o = 1, inner = '') => <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `translate(-50%, -50%) rotate(${rot}deg) ${extra}`}}><div style={{transformOrigin: '100% 100%', transform: inner || 'none'}}>{el}</div></div>;   // the peel turns about its own corner inside the placed box, so it starts exactly on the sticker under it (Sam: a jump at 0:18)
    const p0 = R(q, 0, 0.14), slam = q < 0.14 ? `scale(${2.4 - 1.4 * p0})` : '';
    const under = label(k + (cur != null ? 1 : 0));
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      {place(sticker(under), cur == null && k === 0 ? slam : '', cur == null && k === 0 ? p0 : 1)}
      {cur != null ? (() => { const p = interpolate(q, [cur, cur + PD], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.sin)}), flip = p > 0.5;   // one steady lift, no hold-then-snap (Sam: glitch at 0:18)
        return place(sticker(label(k), flip), '', 1 - R(q, cur + PD - 0.2, cur + PD), `perspective(1100px) rotateX(${-p * 75}deg) rotateY(${p * 55}deg) translate(${p * 360}px, ${-p * 460}px) rotate(${p * 30}deg)`); })() : null}
    </AbsoluteFill>; },
  bubble: (c, q, d, out) => { const x = (c.x ?? 0.62) * W, y = (c.y ?? 0.22) * H, tx = (c.tx ?? 0.5) * W, ty = (c.ty ?? 0.5) * H, s = pop(q), size = c.size || 56;
    const {w, h, lines} = measure(c.text, size), bp = bubblePath(x, y, w * 1.12, h * 1.1, tx, ty);
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: `${tx}px ${ty}px`}}>
      <svg width={W} height={H} style={{position: 'absolute', filter: paperShadow}}><g filter="url(#pRough)">{c.think
          ? [0.25, 0.5, 0.72].map((k, i) => <circle key={i} cx={tx + (x - tx) * k * 0.9} cy={ty + (y - ty) * k * 0.9} r={10 + i * 9} fill={PAPER} stroke={INK} strokeWidth={5} />)
          : <path d={bp.T} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
        <path d={bp.body} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {c.think ? null : <path d={bp.T} fill={PAPER} stroke="none" transform={`translate(${(x - tx) * 0.04} ${(y - ty) * 0.04})`} />}</g></svg>
      <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%) rotate(-1.5deg)', fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.12, color: INK, textAlign: 'center', whiteSpace: 'pre'}}>{lines.join('\n')}</div></div></AbsoluteFill>; },

  // tape tag (Sam, Moctar, 14 Nov 2026: "Go with B"): a torn cream paper scrap held on with a strip of masking tape, top-left,
  // hand lettering in ink, small sub line. Slaps on (scale 1.08 -> 1, 0.15 s) with a slight tilt; no string.
  tape: (c, q, d, out) => { const L = c.free ? (c.x ?? 0.2) * W : 84, T = c.free ? (c.y ?? 0.1) * H : 0.07 * H, rot = c.rot ?? -2.5, s = 1 + 0.08 * (1 - R(q, 0, 0.15)), o = R(q, 0, 0.08);
    return <AbsoluteFill style={{opacity: out * o}}><div style={{position: 'absolute', left: L, top: T, transformOrigin: '0 0', transform: `rotate(${rot}deg) scale(${s})`}}>
      <Scrap pad="10px 34px 14px" sw={0}><div style={{fontFamily: HAND, fontWeight: 700, fontSize: c.size || 54, color: INK, whiteSpace: 'nowrap', lineHeight: 1.05}}>{c.text}</div>
        {c.sub ? <div style={{fontFamily: HAND, fontWeight: 400, fontSize: 32 * (c.subSize || 1), color: INK, opacity: 0.8, whiteSpace: 'nowrap', marginTop: 2}}>{c.sub}</div> : null}</Scrap>
      <div style={{position: 'absolute', left: '38%', top: -18, width: 150, height: 40, background: 'rgba(226,210,158,0.82)', transform: 'rotate(7deg)', boxShadow: '0 1px 2px rgba(0,0,0,0.25)', clipPath: 'polygon(0 8%, 4% 0, 9% 10%, 14% 2%, 100% 0, 97% 20%, 100% 45%, 96% 70%, 100% 100%, 7% 96%, 0 100%, 3% 60%)'}} /></div></AbsoluteFill>; },
  tag: (c, q, d, out) => { if (c.style === 'tape') return PAINTED.tape(c, q, d, out); const sw0 = (c.swaps || []).filter(x => q >= x[0]).pop(); if (sw0) c = {...c, text: sw0[1], sub: sw0[2] ?? c.sub};   // label swap (gag study 12 Nov 2026)
    const free = c.free, TW = 400, TH = 200, L = free ? (c.x ?? 0.7) * W - TW / 2 : 72, y = free ? (c.y ?? 0.15) * H : 0.045 * H,
      sw = 5 * Math.exp(-q * 2) * Math.sin(q * 6) + 2, longest = Math.max(...String(c.text || '').split(/\s+/).map(w => w.length), 1), fs = free ? (c.size || 52) : Math.min(42, Math.floor((TW - 56) / (0.8 * longest))), SL = 120 + y + 140;
    return <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: L, top: -140 - 300 * (1 - R(q, 0, 0.25)), width: TW, transformOrigin: '50% 0', transform: `rotate(${sw}deg) scaleY(${sw0 && q - sw0[0] < 0.25 ? Math.max(0.05, Math.abs(Math.cos(Math.PI * (q - sw0[0]) / 0.25))) : 1})`}}>
      <svg width={TW} height={SL + TH + 20} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={`M ${TW / 2} 0 C ${TW / 2 + 6} ${SL * 0.4}, ${TW / 2 - 6} ${SL * 0.7}, ${TW / 2} ${SL + 36}`} stroke={STRING} strokeWidth={5} fill="none" />
        <g filter="url(#pRough)" style={{filter: `url(#pRough) ${paperShadow}`}}><path d={`M ${TW * 0.2} ${SL} L ${TW * 0.8} ${SL} L ${TW} ${SL + TH * 0.2} L ${TW} ${SL + TH} L 0 ${SL + TH} L 0 ${SL + TH * 0.2} Z`} fill={PAPER} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={TW / 2} cy={SL + 36} r={11} fill="none" stroke={INK} strokeWidth={4} /></g></svg>
      <div style={{position: 'absolute', left: 0, top: SL + 54, width: TW, height: TH - 64, boxSizing: 'border-box', padding: '0 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: fs, lineHeight: 1.05, color: BRICK, letterSpacing: 1}}>{c.text}</div>
        {c.sub ? <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 30 * (c.subSize || 1), lineHeight: 1.1, color: INK, marginTop: 6}}>{c.sub}</div> : null}</div></div></AbsoluteFill>; },

  labels: (c, q, d, out) => { const x = (c.x ?? 0.5) * W, y = (c.y ?? 0.55) * H, gap = c.gap ?? 0.6, spots = c.spots || [[0.2, 0.25], [0.8, 0.22], [0.15, 0.78], [0.85, 0.75], [0.5, 0.12]];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}><g filter="url(#pBrush)">{(c.items || []).map((t, i) => { const p = R(q, i * gap, i * gap + 0.25); if (p <= 0) return null; const [lx, ly] = spots[i % spots.length], ax = lx * W, ay = ly * H;
        const ex = ax + (x - ax) * 0.82 * p, ey = ay + (y - ay) * 0.82 * p, mx = (ax + ex) / 2 + (ey - ay) * 0.12, my = (ay + ey) / 2 - (ex - ax) * 0.12;
        return <path key={i} d={`M ${ax} ${ay + 34} Q ${mx} ${my} ${ex} ${ey}`} stroke={PAPER} strokeWidth={8} strokeLinecap="round" fill="none" style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.7))'}} />; })}</g></svg>
      {(c.items || []).map((t, i) => { const qi = q - i * gap; if (qi < 0) return null; const [lx, ly] = spots[i % spots.length];
        return <div key={i} style={{position: 'absolute', left: lx * W, top: ly * H, transform: `translate(-50%, -50%) scale(${pop(qi, 0.6)}) rotate(${(i % 2 ? 3 : -3)}deg)`}}>
          <Scrap pad="2px 22px 8px" sw={3}><div style={{fontFamily: HAND, fontWeight: 700, fontSize: c.size || 58, color: INK, whiteSpace: 'nowrap'}}>{t}</div></Scrap></div>; })}</AbsoluteFill>; },

  circle: (c, q, d, out) => { const cx = (c.x ?? 0.5) * W, cy = (c.y ?? 0.5) * H, rx = (c.rx ?? 0.12) * W, ry = (c.ry ?? c.rx ?? 0.12) * H * (W / H) * 0.56, p = R(q, 0, 0.45), L = 2 * Math.PI * Math.max(rx, ry) * 1.15;
    const path = `M ${cx + rx} ${cy} C ${cx + rx} ${cy - ry * 1.3}, ${cx - rx * 1.1} ${cy - ry * 1.15}, ${cx - rx} ${cy + ry * 0.05} C ${cx - rx * 0.95} ${cy + ry * 1.25}, ${cx + rx * 1.05} ${cy + ry * 1.2}, ${cx + rx * 1.02} ${cy - ry * 0.25} L ${cx + rx * 0.9} ${cy - ry * 0.5}`, col = c.color || BRICK;
    return <AbsoluteFill style={{opacity: out}}><svg width={W} height={H}><g filter="url(#pBrush)"><path d={path} fill="none" stroke={PAPER} strokeWidth={(c.stroke || 12) + 8} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} opacity={0.55} />
      <path d={path} fill="none" stroke={col} strokeWidth={c.stroke || 12} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} /></g></svg>
      {c.text ? <div style={{position: 'absolute', left: cx + rx * 0.7, top: cy - ry - 100, opacity: R(q, 0.35, 0.55), transform: 'rotate(-6deg)'}}><Scrap pad="0 20px 6px" sw={3}><div style={{fontFamily: HAND, fontWeight: 700, fontSize: c.size || 62, color: BRICK, whiteSpace: 'nowrap'}}>{c.text}</div></Scrap></div> : null}</AbsoluteFill>; },

  loading: (c, q, d, out) => { const pct = c.pct ?? 3, p = Math.min(1, q / (d * 0.5)), v = Math.round(pct * (1 - Math.pow(1 - p, 3)) * 10) / 10, sp = (q * 360 * 1.5) % 360;
    return <AbsoluteFill style={{opacity: out, justifyContent: 'center', alignItems: 'center'}}><div style={{width: 1040, transform: `translate(${c.dx || 0}px, ${c.dy || 0}px) scale(${pop(q, 0.5) * (c.scale ?? 1)}) rotate(-1deg)`}}>
      <Scrap pad="30px 46px 30px" sw={5} r={10}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, fontFamily: HAND, fontWeight: 700, fontSize: 50, color: INK}}>
          <svg width={50} height={50} style={{transform: `rotate(${sp}deg)`}}><circle cx={25} cy={25} r={19} fill="none" stroke={BRICK} strokeWidth={7} strokeDasharray="70 60" strokeLinecap="round" /></svg>{c.text ?? 'Loading…'}</div>
        <div style={{position: 'relative', marginTop: 22, height: 44}}><svg width={948} height={44} style={{position: 'absolute'}}><g filter="url(#pRough)">
          <rect x={2} y={2} width={944} height={40} rx={8} fill="none" stroke={INK} strokeWidth={4} /><rect x={8} y={8} width={Math.max(10, 932 * Math.max(1.2, v) / 100)} height={28} rx={4} fill={OCHRE} /></g></svg></div>
        <div style={{marginTop: 12, fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: INK, textAlign: 'right'}}>{v.toFixed(1)}%{c.sub ? <span style={{fontFamily: HAND, fontWeight: 400}}>{`  ·  ${c.sub}`}</span> : ''}</div></Scrap></div></AbsoluteFill>; },

  notify: (c, q, d) => { const p = R(q, 0, 0.3) * (1 - R(q, d - 0.3, d));
    return <AbsoluteFill><div style={{position: 'absolute', left: '50%', top: 40, width: 900, transform: `translate(-50%, ${(p - 1) * 160}%) rotate(-0.8deg)`}}>
      <Scrap pad="22px 30px 24px" sw={4} r={14}><div style={{display: 'flex', gap: 24, alignItems: 'flex-start'}}>
        <div style={{width: 84, height: 84, flexShrink: 0, position: 'relative'}}><div style={{position: 'absolute', inset: 0, borderRadius: 18, background: c.color || GREEN, border: `4px solid ${INK}`, filter: 'url(#pRough)'}} />
          <div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: PAPER, fontFamily: SERIF, fontSize: 46, fontWeight: 700}}>{c.icon ?? '!'}</div></div>
        <div style={{flex: 1}}><div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SERIF, fontSize: 24, letterSpacing: 3, color: BRICK, fontWeight: 700}}><span>{(c.app ?? 'SPACE BUDGET').toUpperCase()}</span><span style={{fontFamily: HAND, letterSpacing: 0, color: INK}}>now</span></div>
          <div style={{fontFamily: SERIF, fontSize: 40, fontWeight: 700, color: INK, marginTop: 4}}>{c.title}</div><div style={{fontFamily: HAND, fontSize: 36, color: INK, marginTop: 2, lineHeight: 1.2}}>{c.text}</div></div></div></Scrap></div></AbsoluteFill>; },

  count: (c, q, d, out) => <AbsoluteFill style={{opacity: out}}><div style={{position: 'absolute', left: (c.x ?? 0.5) * W, top: (c.y ?? 0.8) * H, transform: 'translate(-50%, -50%) rotate(-1.5deg)'}}>
    <Scrap pad="10px 40px 14px" sw={5}><div style={{fontFamily: SERIF, fontWeight: 700, fontSize: (c.size || 54) * 1.05, letterSpacing: 4, color: INK, whiteSpace: 'pre'}}>{q < 0.05 ? '' : c.text}</div></Scrap></div></AbsoluteFill>,

  meter: (c, q, d, out) => { const st = (c.steps || [[0, 'SOLID', '#22C55E']]).filter(x => q >= x[0]).pop() || c.steps[0], since = q - st[0], s = pop(since, 0.6), col = st[2];
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><div style={{position: 'absolute', right: 60, top: 60, transform: `scale(${s * (c.scale ?? 1.35)}) rotate(1.5deg)`, transformOrigin: '100% 0'}}>
      <Scrap pad="10px 24px 12px 14px" sw={4} r={12}><div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 62, height: 62, position: 'relative'}}><div style={{position: 'absolute', inset: 0, borderRadius: 31, background: col, border: `4px solid ${INK}`, filter: 'url(#pRough)'}} />
          <div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: INK}}>{st[3] || '!'}</div></div>
        <div><div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: BRICK}}>{c.title || 'EVIDENCE'}</div><div style={{fontFamily: HAND, fontWeight: 700, fontSize: 44, lineHeight: 1, color: INK}}>{st[1]}</div></div></div></Scrap></div></AbsoluteFill>; },


  // painted clock (replaces the flat clock.json Lottie): an AI-painted dial (c.img, no hands) with ink hands that sweep c.turns times
  clock: (c, q, d, out, dir) => { const w = (c.w ?? 0.16) * W, s = pop(q, 0.6), tn = c.turns ?? 3, a = 360 * tn * Math.min(1, q / Math.max(0.4, d - 0.2)), cx = w / 2;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}><div style={{position: 'absolute', left: (c.x ?? 0.85) * W - w / 2, top: (c.y ?? 0.22) * H - w / 2, width: w, height: w, transform: `scale(${s}) rotate(${c.rot ?? 0}deg)`, filter: paperShadow}}>
      <Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      <svg width={w} height={w} style={{position: 'absolute', left: 0, top: 0}}><g filter="url(#pRough)">
        <line x1={cx} y1={cx} x2={cx} y2={cx - w * 0.22} stroke={INK} strokeWidth={w * 0.035} strokeLinecap="round" transform={`rotate(${(c.hour ?? 4) * 30 - 30 * tn + a / 12} ${cx} ${cx})`} />
        <line x1={cx} y1={cx} x2={cx} y2={cx - w * 0.33} stroke={BRICK} strokeWidth={w * 0.022} strokeLinecap="round" transform={`rotate(${a} ${cx} ${cx})`} />
        <circle cx={cx} cy={cx} r={w * 0.03} fill={INK} /></g></svg></div></AbsoluteFill>; },

  // money rain with a painted note sprite (c.img), same motion as the flat rain
  rain: (c, q, d, out, dir) => { const n = c.n || 40;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>{Array.from({length: n}).map((_, i) => { const r = (k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
      const x = r(1) * W, sp = 420 + r(2) * 520, y = -200 + (q * sp + r(3) * 1300) % 1450, a = (r(4) - 0.5) * 80 + Math.sin(q * (2 + r(5) * 3) + i) * 35, sc = 0.6 + r(6) * 0.6, fl = Math.cos(q * (3 + r(7) * 4) + i);
      return <Img key={i} src={staticFile(`${dir}/${c.img}`)} style={{position: 'absolute', left: x - 110, top: y - 55, width: 220, transform: `rotate(${a}deg) scale(${sc}, ${sc * (0.55 + 0.45 * Math.abs(fl))})`, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.35))'}} />; })}</AbsoluteFill>; },

  // TV interference as painted grain instead of video static: ink-and-cream noise that changes every frame, with a few drifting bands
  overlay: (c, q, d, out) => { const f = Math.floor(q * 30), o = c.opacity ?? 0.5;
    return <AbsoluteFill style={{opacity: out * Math.min(1, o + 0.2), pointerEvents: 'none'}}><svg width={W} height={H} style={{position: 'absolute'}}>
      <filter id={`pSt${f % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.55 0.9" numOctaves="2" seed={f % 6 + 1} /><feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.92  0 0 0 0 0.86  0 0 0 2.2 -0.9" /></filter>
      <rect width={W} height={H} fill="rgba(38,48,42,0.35)" /><rect width={W} height={H} filter={`url(#pSt${f % 6})`} />
      {[0, 1, 2].map(i => <rect key={i} x={0} width={W} y={((f * 37 + i * 400) % 1200) - 60} height={18 + i * 14} fill={i === 1 ? 'rgba(168,67,47,0.35)' : 'rgba(243,235,221,0.35)'} />)}</svg></AbsoluteFill>; },

  glitch: (c, q, d, out) => { const n = Math.floor(q * 30), r = (k) => ((Math.sin((n + 1) * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(38,48,42,0.25) 0px, rgba(38,48,42,0.25) 2px, transparent 2px, transparent 6px)'}} />
      {[0, 1, 2, 3].map(i => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: r(i) * H, height: 10 + r(i + 9) * 70, backdropFilter: 'sepia(0.8) contrast(1.2)', transform: `translateX(${(r(i + 5) - 0.5) * 120}px)`, background: i % 2 ? 'rgba(168,67,47,0.22)' : 'rgba(233,185,58,0.2)'}} />)}
      <AbsoluteFill style={{boxShadow: `inset ${(r(7) - 0.5) * 30}px 0 0 rgba(11,94,42,0.3), inset ${(r(8) - 0.5) * -30}px 0 0 rgba(168,67,47,0.3)`}} />
      {c.text !== '' ? <div style={{position: 'absolute', left: 90, top: 70, fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: PAPER, textShadow: `3px 0 ${BRICK}, -3px 0 ${GREEN}`}}>{c.text ?? 'PLAY ▶'}</div> : null}
      {c.stamp ? <div style={{position: 'absolute', right: 90, bottom: 80, fontFamily: SERIF, fontSize: 48, color: PAPER, textShadow: `3px 0 ${BRICK}, -3px 0 ${GREEN}`}}>{c.stamp}</div> : null}</AbsoluteFill>; },

  // ---- kinds that live in StillsScene.jsx (called with the absolute time t) ----
  // signoff (Sam, 13 Nov 2026): "Live well" in the title serif over the picture, then the brick-red eyebrow logo pops in and winks
  // (star closes to a lid for ~0.35 s). c.text, c.logo_at (s), c.wink_at (s). Sound: a soft ting on the wink, in silence.
  signoff: (c, q, d, out) => { const ta = R(q, 0, 0.6), la = c.logo_at ?? 1.0, wa = c.wink_at ?? 2.0, lq = q - la, wink = q >= wa && q < wa + 0.38;
    const sq = wink ? 1 - 0.06 * Math.sin(Math.min(1, (q - wa) / 0.38) * Math.PI) : 1;
    return <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: H * (c.y ?? 0.36), transform: `translateY(${(1 - ta) * 24}px)`, opacity: ta, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: c.size || 168, color: '#F3EBDD', letterSpacing: 2, textShadow: '0 6px 30px rgba(0,0,0,.55)'}}>{c.text || 'Live well'}</div>
      {lq >= 0 ? <Img src={staticFile(wink ? 'paint/logo_wink.png' : 'paint/logo_open.png')} style={{position: 'absolute', width: 230, height: 230, left: W / 2 - 115, top: H * (c.logo_y ?? 0.66) - 115, transform: `scale(${pop(lq, 0.8)}) scaleY(${sq})`, filter: 'drop-shadow(0 8px 22px rgba(0,0,0,.45))'}} /> : null}
    </AbsoluteFill>; },
  stamp: (c, q, d) => { const p = R(q, 0, 0.12), sh = (1 - R(q, 0.12, 0.6)) * 10 * Math.sin(q * 90), col = c.color && c.color !== '#D11F2A' ? c.color : BRICK, size = (c.size || 150) * 0.85;
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - R(q, d - 0.2, d)}}><div style={{transform: `translate(${(c.x || 0) + sh}px, ${c.y || 0}px) rotate(${c.rot ?? -9}deg) scale(${3 - 2 * p})`, opacity: p}}>
      {/* a pale paper wash under the ink keeps it readable on dark pictures */}
      <div style={{position: 'absolute', inset: -30, background: `radial-gradient(closest-side, rgba(243,235,221,${c.wash ?? 0.38}), rgba(243,235,221,${(c.wash ?? 0.38) * 0.58}) 70%, rgba(243,235,221,0))`, filter: 'blur(6px)'}} />
      <div style={{position: 'relative', filter: 'url(#pInk)', border: `${Math.round(size * 0.07)}px solid ${col}`, outline: `${Math.round(size * 0.025)}px solid ${col}`, outlineOffset: Math.round(size * 0.05), padding: `${Math.round(size * 0.04)}px ${Math.round(size * 0.28)}px`,
        fontFamily: SERIF, fontWeight: 700, fontSize: size, letterSpacing: Math.round(size * 0.065), color: col, whiteSpace: 'nowrap', lineHeight: 1.1}}>{c.text}</div></div></AbsoluteFill>; },

  aside: (c, q, d) => { if (q < 0 || q > d) return null;
    return <AbsoluteFill><div style={{position: 'absolute', left: c.x ?? 120, top: c.y ?? 120, transform: `rotate(${c.rot ?? -3}deg)`}}>
      <Scrap pad="0 26px 8px" sw={3} fill={c.chip === false ? 'transparent' : PAPER} stroke={c.chip === false ? null : INK}><div style={{fontFamily: HAND, fontWeight: 700, fontSize: (c.size || 64) * 0.92, color: INK, whiteSpace: 'nowrap'}}>{c.text.toLowerCase()}</div></Scrap></div></AbsoluteFill>; },

  banner: (c, q, d) => { const p = Easing.out(Easing.cubic)(R(q, 0, 0.25)), oo = 1 - R(q, d - 0.2, d), L = c.label || 'Breaking', lab = L.charAt(0) + L.slice(1).toLowerCase(), txt = /^[A-Z0-9 '!?.,’-]+$/.test(c.text) ? c.text.charAt(0) + c.text.slice(1).toLowerCase() : c.text;
    const tick = c.ticker || '', y0 = 830;
    return <AbsoluteFill style={{opacity: oo}}><div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - p) * -110}%)`}}>
      <svg width={W} height={H} style={{position: 'absolute', filter: paperShadow}}><g filter="url(#pRough)">
        <path d={`M -20 ${y0 + 16} L 180 ${y0 + 8} L 420 ${y0 + 20} L 760 ${y0 + 6} L 1100 ${y0 + 18} L 1500 ${y0 + 4} L 1940 ${y0 + 16} L 1940 ${y0 + 142} L 1500 ${y0 + 150} L 1120 ${y0 + 136} L 760 ${y0 + 152} L 400 ${y0 + 138} L 120 ${y0 + 148} L -20 ${y0 + 140} Z`} fill={OCHRE} />
        <path d={`M 30 ${y0} L ${70 + lab.length * 34} ${y0 - 8} L ${80 + lab.length * 34} ${y0 + 160} L 40 ${y0 + 166} Z`} fill={BRICK} /></g></svg>
      <div style={{position: 'absolute', left: 55 + lab.length * 17, top: y0 + 76, transform: 'translate(-50%, -50%) rotate(-3deg)', fontFamily: HAND, fontWeight: 700, fontSize: 64, color: PAPER, whiteSpace: 'nowrap'}}>{lab}</div>
      <div style={{position: 'absolute', left: 120 + lab.length * 34, top: y0 + 78, transform: 'translateY(-50%)', fontFamily: HAND, fontWeight: 700, fontSize: (c.size || 58) * 1.3, color: GREEN, whiteSpace: 'nowrap'}}>{txt}</div></div>
      {tick ? <div style={{position: 'absolute', right: 40, top: y0 + 170, transform: `translateX(${(1 - p) * 110}%) rotate(-0.6deg)`}}><Scrap pad="2px 26px 6px" sw={0} stroke={null}>
        <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 36, color: INK, whiteSpace: 'nowrap'}}>{tick.charAt(0).toUpperCase() + tick.slice(1).toLowerCase()}</div></Scrap></div> : null}</AbsoluteFill>; },

  starburst: (c, q, d) => { const b = q < 0 ? 0 : 1 + 0.3 * Math.exp(-q * 7) * Math.sin(q * 24) - Math.exp(-q * 16), oo = 1 - R(q, d - 0.15, d), n = 16, R1 = 300, R2 = 235;
    const pts = Array.from({length: n * 2}).map((_, i) => { const a = (i / (n * 2)) * 2 * Math.PI, r = (i % 2 ? R2 : R1) * (1 + 0.04 * Math.sin(i * 2.3)); return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ');
    return <AbsoluteFill style={{opacity: oo}}><div style={{position: 'absolute', left: 960 + (c.x ?? 420) - 320, top: 540 + (c.y ?? -170) - 320, width: 640, height: 640, transform: `scale(${b * (c.scale ?? 1)}) rotate(${(c.rot ?? 12) + Math.sin(q * 5) * 4}deg)`}}>
      <svg width={640} height={640} viewBox="-320 -320 640 640" style={{filter: paperShadow}}><g filter="url(#pRough)"><polygon points={pts} fill={OCHRE} stroke={INK} strokeWidth={7} strokeLinejoin="round" /><polygon points={pts} transform="scale(0.86)" fill="none" stroke={PAPER} strokeWidth={4} opacity={0.6} /></g></svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 120, fontFamily: HAND, fontWeight: 700, fontSize: (c.size || 64) * 1.05, lineHeight: 1.0, color: BRICK, whiteSpace: 'pre-line'}}>{c.text}</div></div></AbsoluteFill>; },

  headline: (c, q, d) => { const p = 1 - Math.pow(1 - R(q, 0, 0.7), 3), oo = 1 - R(q, d - 0.2, d);
    return <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: oo, background: `rgba(20,16,10,${0.45 * p})`}}><div style={{width: 1180, height: 760, position: 'relative', transform: `translate(${c.dx || 0}px, ${c.dy || 0}px) rotate(${-720 * (1 - p) - 3}deg) scale(${(0.1 + 0.9 * p) * (c.scale ?? 1)})`}}>
      <div style={{position: 'absolute', inset: 0, background: '#EFE4CF', filter: `url(#pRough) ${paperShadow}`, boxShadow: 'inset 0 0 80px rgba(120,90,50,0.35)'}} />
      <div style={{position: 'relative', padding: '40px 60px', fontFamily: SERIF, color: INK}}>
        <div style={{textAlign: 'center', fontSize: 92, fontWeight: 700, letterSpacing: 4, borderBottom: `6px double ${INK}`, paddingBottom: 10}}>{c.masthead || 'THE DAILY MESS'}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, padding: '8px 0', borderBottom: `2px solid ${INK}`, fontFamily: HAND}}><span>{c.kicker || 'Late edition'}</span><span>Price: one hundred million dollars</span></div>
        <div style={{fontSize: c.size || 84, fontWeight: 700, lineHeight: 1.05, textAlign: 'center', margin: '34px 0 24px'}}>{c.text}</div>
        <div style={{display: 'flex', gap: 30}}>{[0, 1, 2].map(k => k === 2 && c.neighbour   // the absurd neighbour headline (Mustard, gag study 13 Nov 2026): a smaller deadpan story beside the real one
          ? <div key={k} style={{flex: 1, borderLeft: `2px solid ${INK}`, paddingLeft: 18}}><div style={{fontSize: c.nsize || 30, fontWeight: 700, lineHeight: 1.1, margin: '6px 0 10px'}}>{c.neighbour}</div>{Array.from({length: 4}).map((_, j) => <div key={j} style={{height: 10, margin: '11px 0', background: '#B7A98E', borderRadius: 4, width: `${66 + ((j * 29) % 30)}%`}} />)}</div>
          : <div key={k} style={{flex: 1}}>{Array.from({length: 7}).map((_, j) => <div key={j} style={{height: 10, margin: '13px 0', background: '#B7A98E', borderRadius: 4, width: `${70 + ((j * 37 + k * 11) % 30)}%`}} />)}</div>)}</div></div></div></AbsoluteFill>; },

  counter: (c, q, d) => { const hold = c.hold ?? 0.6, dr = c.drain ?? 1.6, p = Math.min(1, Math.max(0, (q - hold) / dr)), e = p * p * p;
    const v = Math.round(c.from + (c.to - c.from) * e), done = p >= 1, fl = done ? (Math.floor((q - hold - dr) * 8) % 2 === 0) : false, oo = R(q, 0, 0.15) * (1 - R(q, d - 0.15, d));
    return <AbsoluteFill style={{opacity: oo}}><div style={{position: 'absolute', left: c.left ?? '50%', bottom: c.bottom ?? 120, transform: `translateX(-50%) scale(${done ? 1.12 : 1}) rotate(-1deg)`}}>
      <Scrap pad="12px 54px 16px" sw={6} stroke={done ? BRICK : INK} r={12}><div style={{fontFamily: SERIF, fontWeight: 700, fontSize: c.size || 120, color: done && fl ? BRICK : INK, letterSpacing: 2, whiteSpace: 'nowrap', lineHeight: 1.1}}>
        {(c.prefix ?? '$') + v.toLocaleString('en-US')}</div></Scrap></div>
      {c.label ? <div style={{position: 'absolute', left: typeof c.left === 'number' && c.left < 700 ? 40 : (c.left ?? '50%'), bottom: (c.bottom ?? 120) + (c.size || 120) * 1.25 + 80, transform: `${typeof c.left === 'number' && c.left < 700 ? '' : 'translateX(-50%) '}rotate(-2deg)`}}><Scrap pad="0 26px 6px" sw={3}><div style={{fontFamily: HAND, fontWeight: 700, fontSize: 56, color: INK, whiteSpace: 'nowrap'}}>{c.label}</div></Scrap></div> : null}</AbsoluteFill>; },

  pip: (c, q, d, out, dir) => { const b = q < 0 ? 0 : 1 + 0.25 * Math.exp(-q * 6) * Math.sin(q * 20) - Math.exp(-q * 14), w = c.w || 560;
    return <AbsoluteFill style={{opacity: 1 - R(q, d - 0.2, d)}}><div style={{position: 'absolute', right: c.right ?? 70, bottom: c.bottom ?? 70, width: w, height: w * 9 / 16, transform: `scale(${b}) rotate(${c.rot ?? 4}deg)`, transformOrigin: '100% 100%'}}>
      <div style={{position: 'absolute', inset: -14, background: PAPER, border: `3px solid ${INK}`, filter: `url(#pRough) ${paperShadow}`}} />
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}><Img src={staticFile(`${dir}/${c.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
      <div style={{position: 'absolute', right: -40, top: -18, width: 130, height: 36, transform: 'rotate(38deg)', background: 'rgba(233,185,58,0.75)'}} /></div></AbsoluteFill>; },
};

// timing wrapper shared with the flat kit: fade-out like gagCard (out over the last 0.2 s)
const SCENE = ['stamp', 'aside', 'banner', 'starburst', 'headline', 'counter', 'pip'];   // default 4.5 s like StillsScene's Card
export const paintedCard = (c, t, dir) => { const f = PAINTED[c.kind]; if (!P.on || !f || (c.kind === 'rain' && !c.img) || (c.kind === 'labels' && c.style === 'manicule')) return undefined;   // manicule labels are already paper and ink in Gags.jsx
  const d = c.dur || (SCENE.includes(c.kind) ? 4.5 : 2), q = t - c.t;
  if (q < 0 || q > d) return null; const out = c.cutOut ? 1 : 1 - R(q, d - 0.15, d); return f(c, q, d, out, dir); };
