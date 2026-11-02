// House style components (toolkit 1.9), from the Oct 2026 reference videos (Maxinomics, Urbanomaly):
// dot-matrix charts and maps, words behind a cut-out subject, labelled photos, framed archive clips with a year tag,
// small source cards, and big numbers over footage. All take cue times in slide seconds (use cue(n, 'word')).
import React, {useMemo} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing} from 'remotion';
import {geoMercator, geoContains, geoBounds} from 'd3-geo';
import {C, SANS, HEAD, I, PT, f, FPS, box, prog, mix} from './lib';

// ---------- 1. Dot-matrix charts: every bar is a stack of equal squares (one square = `unit`) ----------
// Columns: data [{label, value, color?, at}] ; squares fill bottom-up row by row, `perRow` squares wide.
// Exact scale: square count = value / unit, the last square partly filled for the remainder. Say the unit in a note.
export const DotColumns = ({x, y, w, h, data, unit = 1, perRow = 5, gap = 0.18, max, labelSize = 14, valueFmt = (v) => `${v}`, colGap = 0.6, fillDur = 1.0, dimColor = '#E4DFEC'}) => {
  const fr = useCurrentFrame(); const n = data.length; const colW = (w - colGap * (n - 1)) / n;
  const cell = colW / perRow; const sq = cell * (1 - gap); const top = max != null ? max : Math.max(...data.map((d) => d.value));
  const rowsMax = Math.ceil(top / unit / perRow); const cellH = Math.min(cell, (h - 0.9) / rowsMax);
  return <div style={{...box(x, y, w, h)}}>
    {data.map((d, i) => { const total = d.value / unit; const p = prog(fr, d.at, fillDur, Easing.out(Easing.cubic)); const shown = total * p;
      const cx = i * (colW + colGap); const full = Math.floor(shown), part = shown - full;
      return <React.Fragment key={i}>
        {Array.from({length: Math.ceil(total)}, (_, k) => { const r = Math.floor(k / perRow), c = k % perRow; const fill = k < full ? 1 : k === full ? part : 0;
          if (fill <= 0) return null;
          return <div key={k} style={{position: 'absolute', left: (cx + c * cell) * I, top: (h - 0.75 - (r + 1) * cellH) * I, width: sq * I, height: Math.min(sq, cellH * (1 - gap)) * I,
            background: `linear-gradient(90deg, ${d.color || C.accent} ${fill * 100}%, ${dimColor} ${fill * 100}%)`, borderRadius: 1}} />; })}
        <div style={{position: 'absolute', left: cx * I, top: (h - 0.7) * I, width: colW * I, textAlign: 'center', fontFamily: SANS, fontSize: labelSize * PT, fontWeight: 600, color: C.primary, opacity: fr >= f(d.at) ? 1 : 0}}>{d.label}</div>
        <div style={{position: 'absolute', left: cx * I, top: (h - 0.75 - Math.ceil(shown / perRow) * cellH - 0.55) * I, width: colW * I, textAlign: 'center', fontFamily: HEAD, fontSize: 24 * PT, fontWeight: 900, color: d.color || C.accent, opacity: p}}>{valueFmt(+(d.value * p).toFixed(1))}</div>
      </React.Fragment>; })}
  </div>;
};
// Horizontal dot bars: rows of squares left to right (good for rankings). data [{label, value, color?, at}]
export const DotBars = ({x, y, w, data, unit = 1, rowsPerBar = 2, cell = 0.12, gap = 0.2, labelW = 3.2, valueFmt = (v) => `${v}`, fillDur = 1.0, onDark}) => {
  const fr = useCurrentFrame(); const barH = rowsPerBar * cell + 0.28;
  return <div style={{...box(x, y, w, data.length * barH)}}>
    {data.map((d, i) => { const total = d.value / unit; const p = prog(fr, d.at, fillDur, Easing.out(Easing.cubic)); const shown = total * p; const cols = Math.ceil(total / rowsPerBar);
      return <div key={i} style={{position: 'absolute', left: 0, top: i * barH * I, width: w * I, height: barH * I, opacity: fr >= f(d.at) - 6 ? 1 : 0}}>
        <div style={{position: 'absolute', left: 0, width: (labelW - 0.15) * I, textAlign: 'right', top: 0, fontFamily: SANS, fontSize: 14 * PT, fontWeight: 600, color: onDark ? C.white : C.primary, lineHeight: `${rowsPerBar * cell * I}px`}}>{d.label}</div>
        {Array.from({length: Math.ceil(shown)}, (_, k) => { const c = Math.floor(k / rowsPerBar), r = k % rowsPerBar; const fill = Math.min(1, shown - k);
          return <div key={k} style={{position: 'absolute', left: (labelW + c * cell) * I, top: r * cell * I, width: cell * (1 - gap) * I * fill, height: cell * (1 - gap) * I, background: d.color || C.accent}} />; })}
        <div style={{position: 'absolute', left: (labelW + cols * cell * p + 0.12) * I, top: -4, fontFamily: HEAD, fontWeight: 900, fontSize: 18 * PT, color: d.color || C.accent}}>{valueFmt(+(d.value * p).toFixed(1))}</div>
      </div>; })}
  </div>;
};
// Dot map: GeoJSON features rasterised once into square "pixels" coloured by value bins (computed once, then animated).
// features: GeoJSON features; valueOf(feature) -> number or null; bins: [{max, color}] ascending; noData colour for null.
export const DotMap = ({x, y, w, h, features, valueOf, bins, noData = '#3A2E50', cols = 90, at = 0, sweep = 1.2, highlight, highlightAt, bg = 'transparent'}) => {
  const fr = useCurrentFrame();
  const cells = useMemo(() => {
    const fc = {type: 'FeatureCollection', features}; const proj = geoMercator().fitSize([w * I, h * I], fc);
    const step = (w * I) / cols; const out = [];
    for (let py = step / 2; py < h * I; py += step) for (let px = step / 2; px < w * I; px += step) {
      const ll = proj.invert([px, py]); if (!ll) continue;
      const ft = features.find((ff) => geoContains(ff, ll)); if (!ft) continue;
      const v = valueOf(ft); const bin = v == null ? null : bins.find((b) => v <= b.max) || bins[bins.length - 1];
      out.push({px, py, color: bin ? bin.color : noData, id: ft.id});
    }
    return {out, step};
  }, [features, w, h, cols]);
  const hp = highlightAt != null ? prog(fr, highlightAt, 0.5) : 0;
  return <svg style={{...box(x, y, w, h), overflow: 'visible', background: bg}}>
    {cells.out.map((c, i) => { const d = interpolate(fr, [f(at) + (c.px / (w * I)) * f(sweep), f(at) + (c.px / (w * I)) * f(sweep) + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      const hi = highlight != null && c.id === highlight; const s = cells.step * (0.82 + (hi ? 0.1 * hp : 0));
      return <rect key={i} x={c.px - s / 2} y={c.py - s / 2} width={s} height={s} fill={hi && hp > 0 ? mix(c.color, '#FFFFFF', 0.35 * hp) : c.color} opacity={d} />; })}
  </svg>;
};
// Legend for dot charts and maps: small squares with labels
export const DotLegend = ({x, y, items, onDark}) => <div style={{...box(x, y), display: 'flex', gap: 18, fontFamily: SANS, fontSize: 12 * PT, color: onDark ? C.white : C.secondary}}>
  {items.map((it, i) => <span key={i} style={{display: 'flex', alignItems: 'center', gap: 6}}><span style={{width: 14, height: 14, background: it.color, display: 'inline-block'}} />{it.label}</span>)}</div>;

// ---------- 2. Words behind a cut-out subject (needs <name>_bg.jpg + <name>_fg.png from media/parallax.py) ----------
export const TextBehind = ({name, text, at = 0, dur = 8, color = C.white, size = 300, top = 0.42, font = HEAD, tint = 'rgba(30,20,48,0.35)', focus = [0.5, 0.45]}) => {
  const fr = useCurrentFrame(); const p = prog(fr, at, 0.8); const drift = interpolate(fr, [0, f(dur)], [0, 1], {extrapolateRight: 'clamp'});
  const lay = (src, sc, extra = {}) => <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`, transform: `scale(${sc})`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`, ...extra}} />;
  return <AbsoluteFill style={{overflow: 'hidden', background: C.primary}}>
    {lay(`${name}_bg.jpg`, 1.06 + 0.02 * drift)}
    <AbsoluteFill style={{background: tint}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: `${top * 100}%`, transform: `translateY(-50%) scale(${0.94 + 0.06 * p})`, textAlign: 'center', fontFamily: font, fontWeight: 900, fontSize: size,
      letterSpacing: -6, color, opacity: p, lineHeight: 0.9, whiteSpace: 'nowrap'}}>{text}</div>
    {lay(`${name}_fg.png`, 1.06 + 0.05 * drift)}
  </AbsoluteFill>;
};

// ---------- 3. Labelled photo: callouts with a dot, a leader line that draws, and a label ----------
// labels: [{x, y (0..1 of the image), dx, dy (label offset in inches), text, at}]
export const LabelledPhoto = ({src, video, x, y, w, h, labels, color = C.white, line = C.callout, fit = 'cover', onWhite}) => {
  const fr = useCurrentFrame();
  return <div style={{...box(x, y, w, h)}}>
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 3}}>
      {video ? <OffthreadVideo src={staticFile(video)} muted style={{width: '100%', height: '100%', objectFit: fit}} /> : <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: fit}} />}
    </div>
    <svg style={{position: 'absolute', left: 0, top: 0, width: w * I, height: h * I, overflow: 'visible'}}>
      {labels.map((l, i) => { const p = prog(fr, l.at, 0.5); const ax = l.x * w * I, ay = l.y * h * I, bx = ax + l.dx * I, by = ay + l.dy * I;
        const ex = ax + (bx - ax) * p, ey = ay + (by - ay) * p; const pulse = 1 + 0.25 * Math.max(0, Math.sin((fr - f(l.at)) / 6)) * (fr < f(l.at + 1.5) ? 1 : 0);
        return fr < f(l.at) ? null : <g key={i}>
          <circle cx={ax} cy={ay} r={9 * pulse} fill="none" stroke={line} strokeWidth={3} />
          <circle cx={ax} cy={ay} r={4} fill={line} />
          <line x1={ax} y1={ay} x2={ex} y2={ey} stroke={line} strokeWidth={3} />
        </g>; })}
    </svg>
    {labels.map((l, i) => { const p = prog(fr, l.at + 0.35, 0.35); const bx = l.x * w + l.dx, by = l.y * h + l.dy; const right = l.dx >= 0;
      return <div key={'t' + i} style={{position: 'absolute', left: bx * I + (right ? 10 : -10), top: by * I - 22,
        transform: `translateX(${right ? 0 : -100}%)`, opacity: p, fontFamily: SANS, fontWeight: 800, fontSize: 15 * PT, color: onWhite ? C.primary : color,
        background: onWhite ? 'rgba(255,255,255,0.92)' : 'rgba(24,14,38,0.72)', padding: '4px 10px', borderRadius: 4, whiteSpace: 'nowrap'}}>{l.text}</div>; })}
  </div>;
};

// ---------- 4. Archive clip in a rounded "old screen" frame on black, with a red year tag and an honest caption ----------
export const ArchiveFrame = ({video, from = 0, year, caption, at = 0, w = 9.0, h = 6.2, sepia = 0.25}) => {
  const fr = useCurrentFrame(); const p = prog(fr, at, 0.6); const flick = 0.96 + 0.04 * Math.sin(fr * 1.7) * Math.sin(fr * 0.31);
  const x = (13.333 - w) / 2, y = (7.5 - h) / 2 - 0.15;
  return <AbsoluteFill style={{background: '#0B0810'}}>
    <div style={{...box(x, y, w, h), borderRadius: 28, overflow: 'hidden', boxShadow: '0 0 0 3px #1E1828, 0 30px 60px rgba(0,0,0,0.6)', opacity: p, transform: `scale(${0.97 + 0.03 * p})`}}>
      <Sequence from={f(at)}><OffthreadVideo src={staticFile(video)} muted startFrom={f(from)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `sepia(${sepia}) contrast(1.05) brightness(${flick})`}} /></Sequence>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
    </div>
    {year && <div style={{...box(x - 0.15, y + 0.25), background: '#D7263D', color: '#fff', fontFamily: HEAD, fontWeight: 900, fontSize: 28 * PT, padding: '2px 16px', transform: `translateX(${(1 - prog(fr, at + 0.4, 0.4)) * -30}px)`, opacity: prog(fr, at + 0.4, 0.4)}}>{year}</div>}
    {caption && <div style={{...box(x, y + h + 0.12, w), textAlign: 'center', fontFamily: SANS, fontStyle: 'italic', fontSize: 11 * PT, color: C.lineMedia, opacity: p}}>{caption}</div>}
  </AbsoluteFill>;
};

// ---------- 5. Small source card: pops in beside a claim when a study or document is first named ----------
export const SourceCard = ({at, dur = 4.5, pub, title, date, kind = 'STUDY', x = 9.0, y = 1.55, w = 3.75, onDark}) => {
  const fr = useCurrentFrame(); const t = fr - f(at); if (t < 0 || t > f(dur + 0.5)) return null;
  const sp = spring({frame: t, fps: FPS, config: {damping: 14, stiffness: 160}}); const out = 1 - prog(fr, at + dur, 0.4);
  return <div style={{...box(x, y, w), background: onDark ? 'rgba(255,255,255,0.96)' : C.white, borderRadius: 8, boxShadow: '0 12px 30px rgba(20,10,30,0.28)', padding: '12px 16px',
    transform: `translateY(${(1 - sp) * 24}px) scale(${0.96 + 0.04 * sp})`, opacity: Math.min(1, sp * 1.5) * out, borderLeft: `6px solid ${C.callout}`}}>
    <div style={{fontFamily: SANS, fontSize: 9.5 * PT, fontWeight: 800, letterSpacing: 1.5, color: C.callout}}>{kind}{date ? `  ·  ${date}` : ''}</div>
    <div style={{fontFamily: SANS, fontSize: 12 * PT, fontWeight: 800, color: C.primary, lineHeight: 1.2, marginTop: 4}}>{title}</div>
    <div style={{fontFamily: SANS, fontSize: 10 * PT, color: C.secondary, marginTop: 4, fontStyle: 'italic'}}>{pub}</div>
  </div>;
};

// ---------- 6. Big number over footage: count-up in huge extruded type over a tinted clip ----------
export const BigNumber = ({video, from = 0, to, decimals = 0, prefix = '', suffix = '', label, at = 0.3, dur = 1.2, tint = 'rgba(30,20,48,0.55)', color = C.white, accent = C.callout, size = 330, source}) => {
  const fr = useCurrentFrame(); const p = prog(fr, at, dur, Easing.out(Easing.cubic)); const lp = prog(fr, at + dur * 0.7, 0.5);
  const v = (to * p).toFixed(decimals); const depth = Array.from({length: 10}, (_, i) => `${i + 1}px ${i + 1}px 0 ${mix(accent, '#000000', 0.35 + i * 0.04)}`).join(', ');
  return <AbsoluteFill style={{background: C.primary}}>
    {video && <OffthreadVideo src={staticFile(video)} muted startFrom={f(from)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.04 + 0.03 * p})`}} />}
    <AbsoluteFill style={{background: tint}} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: size, color, letterSpacing: -8, lineHeight: 1, textShadow: depth, opacity: fr < f(at) ? 0 : 1, transform: `scale(${0.92 + 0.08 * p})`}}>{prefix}{v}{suffix}</div>
      {label && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30 * PT, color: C.white, marginTop: 10, opacity: lp, transform: `translateY(${(1 - lp) * 16}px)`, maxWidth: 1400, textAlign: 'center'}}>{label}</div>}
      {source && <div style={{fontFamily: SANS, fontSize: 11 * PT, color: C.lineMedia, marginTop: 14, opacity: lp}}>{source}</div>}
    </AbsoluteFill>
  </AbsoluteFill>;
};
