// Generic scene layouts (toolkit 2.0), lifted from the Blindness scenes and parameterised, used by gen_scenes.py and by
// hand-written scenes: chapter map, word card, title, paper profile, video panel, suspects, scorecard, and the TODO box.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, SANS, HEAD, I, PT, f, box, prog, Reveal, Words, Footage, PaperBg, Stage, T, Brand, Source, Head, Pill, Panel, PaperSheet, sheetHeight, SD, Vignette} from './lib';

export const Tint = ({k = 0.55}) => <AbsoluteFill style={{background: `rgba(30,20,48,${k})`}} />;

// A visible placeholder: the review sheet shows it in red, and run.py refuses to render while any remain in the code.
export const Todo = ({x = 0.6, y = 1.9, w = 12.1, h = 0.9, at = 0, text}) => <Reveal at={at} kind="fade" style={{...box(x, y, w, h), border: '3px dashed #D7263D', background: 'rgba(215,38,61,0.08)', display: 'flex', alignItems: 'center', padding: 14}}>
  <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 13 * PT, color: '#D7263D'}}>TODO: {text}</span></Reveal>;

export const VidPanel = ({src, at = 0.5, x = 7.3, y = 1.95, w = 5.43, h = 3.95}) => <Panel x={x} y={y} w={w} h={h} at={at} kind="focus" style={{overflow: 'hidden'}}>
  <Sequence from={f(at)}><OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence></Panel>;

const scramble = (txt, p, fr) => { const k = Math.floor(txt.length * p); const G = '?#%&@*';
  return txt.slice(0, k) + txt.slice(k).split('').map((c, i) => c === ' ' ? ' ' : G[(i + Math.floor(fr / 2)) % G.length]).join(''); };
// items: chapter questions; current: index; hidden: indices shown as ??????; rowAts: first map only; reveal: decode time for a hidden row
export const ChapterMap = ({items, video, current, hidden = [], rowAts, reveal, revealIndex, title = "WHAT WE'LL COVER", footnote}) => { const fr = useCurrentFrame(); const rh = Math.min(0.9, 5.0 / items.length), y0 = 1.7;
  const rp = reveal != null ? prog(fr, reveal, 1.0, (x) => x) : 0;
  return <>
    {video ? <Footage src={video} /> : <AbsoluteFill style={{background: C.primary}} />}
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(30,20,48,0.78), rgba(30,20,48,0.35))'}} />
    <Stage>
      <Reveal at={0} kind="fade"><T x={0.9} y={0.8} w={11} size={16} color={C.light} weight={700} style={{letterSpacing: 1.5}}>{title}</T></Reveal>
      {items.map((it0, i) => { const y = y0 + i * rh, on = i === current, done = i < current; const isHidden = hidden.includes(i);
        const it = revealIndex === i && reveal != null ? (fr < f(reveal) ? '??????????' : scramble(it0, rp, fr)) : isHidden ? '??????????' : it0;
        const at = rowAts ? rowAts[i] : 0.1 + i * 0.06;
        return <React.Fragment key={i}>
          {on && <Reveal at={rowAts ? at : 0.35} kind="wipe" style={{...box(0.8, y + 0.08, 0.75, rh - 0.16), background: C.callout}} />}
          <Reveal at={at} kind="left">
            <T x={0.8} y={y} w={0.75} h={rh} size={28} weight={800} font={HEAD} align="center" color={on ? C.white : done ? C.lineMedia : C.light} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</T>
            <T x={1.8} y={y} w={10.5} h={rh} size={on ? 30 : 24} weight={on ? 800 : 500} font={on ? HEAD : SANS} color={on ? C.white : done ? C.lineMedia : C.rule}
              style={{display: 'flex', alignItems: 'center', letterSpacing: it.startsWith('?') ? 4 : 0, textDecoration: done ? 'line-through' : 'none', textDecorationColor: 'rgba(168,155,184,0.6)'}}>{it}</T>
          </Reveal></React.Fragment>; })}
      {footnote}
    </Stage></>; };

export const WordCard = ({video, lines, ats, from = 0}) => { const fr = useCurrentFrame(); return <>
  {video ? <Footage src={video} from={from} drift={0.08} /> : <AbsoluteFill style={{background: C.primary}} />}<Tint k={0.5} /><Vignette k={0.45} />
  <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
    {lines.map((l, i) => { const p = prog(fr, ats[i], 0.7); return <div key={i} style={{fontFamily: HEAD, fontWeight: 900, fontSize: 104, color: i === lines.length - 1 ? C.white : C.light, letterSpacing: -2,
      opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.96 + 0.04 * p})`, filter: p < 1 ? `blur(${(1 - p) * 6}px)` : 'none', textAlign: 'center', maxWidth: 1600, lineHeight: 1.05}}>{l}</div>; })}
  </AbsoluteFill></>; };

export const TitleCard = ({video, title, sup, supAt = 2.5, brandAt = 4}) => <>
  {video ? <Footage src={video} drift={0.06} /> : <AbsoluteFill style={{background: C.primary}} />}{video && <Tint k={0.35} />}
  <Stage>
    <Words at={0.15} dur={1.0} text={title} style={{...box(0.9, 2.2, 11.5), fontFamily: HEAD, fontSize: 48 * PT, fontWeight: 900, color: C.white, lineHeight: 1.05, letterSpacing: -1}} />
    {sup && <Reveal at={supAt} kind="up"><T x={0.9} y={4.05} w={11.5} size={22} color={C.rule}>{sup}</T></Reveal>}
    <Reveal at={brandAt} kind="wipe" style={{...box(0.9, 5.88, 1.2, 0.04), background: C.callout}} />
    <Reveal at={brandAt + 0.2} kind="up"><T x={0.9} y={6.0} w={4} size={14} color={C.white} weight={700}>Decked out Data</T></Reveal>
  </Stage></>;

// Paper profile: the title card lands as a sheet, then publisher and rows (flex column so long rows wrap)
export const Profile = ({n, label, title, pub, rows = [], sheetAt = 0.8, rowAt = 2, right, tags}) => { const w = 6.3; const h = title ? sheetHeight({w, title}) : 0;
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      {label && <Reveal at={0.4} kind="fade"><T x={0.6} y={1.85} w={6.3} size={12} weight={800} color={C.accent} style={{letterSpacing: 1}}>{label}</T></Reveal>}
      {title && <PaperSheet x={0.6} y={2.3} w={w} title={title} at={sheetAt} dur={SD(n).dur} />}
      {pub && <Reveal at={sheetAt + 0.6} kind="up"><T x={0.6} y={2.3 + h + 0.22} w={6.3} size={13} color={C.secondary}>{pub}</T></Reveal>}
      <div style={{...box(0.6, 2.3 + h + 0.62, 6.3), display: 'flex', flexDirection: 'column', gap: 0.12 * I}}>
        {rows.map(([k, v], i) => <Reveal key={i} at={rowAt + i * 0.25} kind="up"><div style={{fontFamily: SANS, fontSize: 13 * PT, color: C.primary, lineHeight: 1.2}}>
          <span style={{fontWeight: 800, color: C.secondary, fontSize: 11 * PT, letterSpacing: 1}}>{k.toUpperCase()}   </span>{v}</div></Reveal>)}</div>
      {right}{tags}
      <Source n={n} /><Brand />
    </Stage></>; };

// Numbered theories, revealed on their cues; the last can stay hidden (pulsing ??????????)
export const Suspects = ({n, theories, ats, hiddenLast = true, pillText = 'SCORED AT THE END', pillAt}) => { const fr = useCurrentFrame(); return <>
  <PaperBg />
  <Stage>
    <Head n={n} />
    {theories.map((t0, i) => { const at = ats[i], y = 2.05 + i * 0.95, hidden = hiddenLast && i === theories.length - 1; const t = hidden ? '??????????' : t0;
      const pulse = hidden && fr > f(at + 0.6) ? 0.55 + 0.45 * Math.abs(Math.sin((fr - f(at)) / 9)) : 1;
      return <React.Fragment key={i}>
        <Reveal at={at} kind="pop" style={{...box(0.6, y, 0.62, 0.62), borderRadius: '50%', background: C.callout, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(43,27,63,0.2)'}}>
          <span style={{fontFamily: HEAD, fontWeight: 900, fontSize: 22 * PT, color: C.white}}>{i + 1}</span></Reveal>
        <Reveal at={at + 0.08} kind="left"><T x={1.45} y={y + 0.08} w={9} size={22} weight={700} color={C.primary} style={{opacity: pulse, letterSpacing: hidden ? 4 : 0}}>{t}</T></Reveal>
      </React.Fragment>; })}
    {pillAt != null && <Pill x={8.6} y={5.55} w={3.4} text={pillText} at={pillAt} />}
    <Brand />
  </Stage></>; };

// Verdict scorecard: rows in rank order; each row appears at its own time (in the order the narrator scores them)
export const Scorecard = ({n, verdicts, ats, verdictAts, words = {3: 'Strong', 2: 'Promising', 1: 'Weak', 0: 'No support'}, footnote}) => { const fr = useCurrentFrame();
  const order = verdicts.map((v, i) => i).sort((a, b) => verdicts[b].score - verdicts[a].score); const rh = Math.min(1.0, 4.3 / verdicts.length);
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      {order.map((vi, i) => { const v = verdicts[vi]; const y = 2.0 + i * (rh + 0.08); const at = ats[vi], va = verdictAts[vi];
        const col = v.score === 3 ? C.accent : v.score === 2 ? C.callout : C.secondary;
        return <React.Fragment key={vi}>
          <Panel x={0.55} y={y} w={12.23} h={rh} at={at} kind="left" fill={C.white} />
          <Reveal at={at + 0.15} kind="up"><T x={0.85} y={y + 0.12} w={5.2} size={18} weight={800}>{v.theory}</T></Reveal>
          <Reveal at={va} kind="up"><T x={0.85} y={y + 0.56} w={5.2} size={12} color={C.secondary}>{v.note}</T></Reveal>
          {[0, 1, 2].map((d) => { const p = prog(fr, va + 0.12 * d, 0.3); const on = d < v.score;
            return <div key={d} style={{...box(6.5 + d * 0.5, y + 0.33, 0.34, 0.34), border: `3px solid ${on ? col : C.rule}`, background: on ? col : 'transparent', transform: `scale(${on ? 0.6 + 0.4 * p : 1})`, opacity: fr < f(va) ? 0 : 1}} />; })}
          <Pill x={8.3} y={y + 0.27} w={1.9} h={0.46} size={14} text={words[v.score]} fill={col} at={va + 0.2} />
        </React.Fragment>; })}
      {footnote}
      <Source n={n} /><Brand />
    </Stage></>; };
