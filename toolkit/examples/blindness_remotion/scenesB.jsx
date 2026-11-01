// Slides 7-20: the basics, experts, the real world.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C, SANS, HEAD, I, PT, f, FPS, box, cue, cueEnd, voEnd, prog, ease, Reveal, Words, CountUp, Footage, PaperBg, Stage, T, Brand, Source, Head, Note, Pill, Panel,
  People, Dots, PaperSheet, sheetHeight, Split, Suspect, SHADOW, SD, Vignette} from './lib';
import {ChaseDiagram, RouteDiagram} from './diagrams';
import {ChapterMap} from './scenesA';

const Tint = ({k = 0.55}) => <AbsoluteFill style={{background: `rgba(30,20,48,${k})`}} />;
const Chevron = ({x, y, w, h, text, fill, at, first}) => { const tip = 0.35 * I;
  const poly = first ? `polygon(0 0, calc(100% - ${tip}px) 0, 100% 50%, calc(100% - ${tip}px) 100%, 0 100%)` : `polygon(0 0, calc(100% - ${tip}px) 0, 100% 50%, calc(100% - ${tip}px) 100%, 0 100%, ${tip}px 50%)`;
  return <Reveal at={at} kind="left" style={{...box(x, y, w, h)}}>
    <div style={{position: 'absolute', inset: 0, background: fill, clipPath: poly, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${tip + 14}px`}}>
      <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 20 * PT, color: C.white, textAlign: 'center', lineHeight: 1.15}}>{text}</span></div></Reveal>; };
const QuoteMark = ({x, y, at, color = C.callout}) => <Reveal at={at} kind="pop"><T x={x} y={y} w={0.8} size={66} weight={900} font={HEAD} color={color} style={{lineHeight: 1}}>“</T></Reveal>;
// typewriter: characters appear between t0 and t1
const Typed = ({text, t0, t1, style}) => { const fr = useCurrentFrame(); const k = Math.round(text.length * interpolate(fr, [f(t0), f(t1)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return <div style={style}><span>{text.slice(0, k)}</span><span style={{opacity: 0}}>{text.slice(k)}</span></div>; };

// ===== 7 Attention as a filter: chevrons over street footage
export const S7 = () => { const n = 7; return <>
  <Footage src="s4_street.mp4" /><Vignette k={0.35} />
  <Stage>
    <Head n={n} media />
    <Chevron x={0.6} y={2.05} w={4.5} h={1.4} first text="Everything your eyes and ears take in" fill="rgba(110,102,128,0.92)" at={cue(n, 'eyes')} />
    <Chevron x={4.95} y={2.05} w={4.1} h={1.4} text="Attention selects" fill={C.accent} at={cue(n, 'filter')} />
    <Chevron x={8.9} y={2.05} w={3.83} h={1.4} text="What you're aware of" fill={C.callout} at={cue(n, 'picks')} />
    <Panel x={0.6} y={3.95} w={12.13} h={1.9} at={cue(n, 'useful')} dark />
    <QuoteMark x={0.8} y={3.9} at={cue(n, 'useful') + 0.1} />
    <Words at={cue(n, 'useful') + 0.2} dur={1.4} text="We appear able to process only one stream of information at a time, effectively filtering other information from awareness." style={{...box(1.65, 4.1, 10.8), fontFamily: SANS, fontSize: 22 * PT, fontWeight: 700, color: C.white, lineHeight: 1.2}} />
    <Reveal at={cue(n, 'useful') + 1.4} kind="fade"><T x={1.65} y={5.3} w={10.8} size={14} color={C.light}>— Daniel Simons, Noba Project</T></Reveal>
    <Source n={n} media /><Brand media />
  </Stage></>; };

// ===== 8 Definition + the original diagram of the 1999 experiment
export const S8 = () => { const n = 8; const an = cue(n, 'famous') - 0.3; return <>
  <PaperBg />
  <Stage>
    <Head n={n} />
    <Reveal at={cue(n, 'inattentional')} kind="up"><T x={0.6} y={1.95} w={5.6} size={26} weight={800} font={HEAD}>Inattentional blindness</T></Reveal>
    <Reveal at={cue(n, 'missing')} kind="up"><T x={0.6} y={2.55} w={5.6} size={18} color={C.secondary}>The surprising failure to notice an unexpected object or event when attention is focused on something else.</T></Reveal>
    <Reveal at={cue(n, 'missing') + 0.4} kind="fade"><T x={0.6} y={4.0} w={5.6} size={13} color={C.secondary}>— Simons, Noba Project</T></Reveal>
    <Panel x={6.6} y={1.95} w={6.13} h={3.065} at={an} kind="focus" style={{overflow: 'hidden'}}>
      <Sequence from={f(an)}><OffthreadVideo src={staticFile('s5_anim.mp4')} muted style={{width: '100%', height: '100%'}} /></Sequence></Panel>
    <Note at={an + 0.5} x={6.6} y={5.05} w={6.13} align="right" text="Schematic, not the original video" />
    <Reveal at={cue(n, 'half')} kind="wipe" style={{...box(0.6, 5.45, 12.13, 0.75), background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW}}>
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 24 * PT, color: C.white}}>About half the viewers missed the gorilla</span></Reveal>
    <Source n={n} /><Brand />
  </Stage></>; };

// ===== word cards (9, 30, 35) with a silent hold
export const WordCard = ({n, video, lines, ats, from = 0}) => { const fr = useCurrentFrame(); return <>
  <Footage src={video} from={from} drift={0.08} /><Tint k={0.5} /><Vignette k={0.45} />
  <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
    {lines.map((l, i) => { const p = prog(fr, ats[i], 0.7); return <div key={i} style={{fontFamily: HEAD, fontWeight: 900, fontSize: 104, color: i === lines.length - 1 ? C.white : C.light, letterSpacing: -2,
      opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.96 + 0.04 * p})`, filter: `blur(${(1 - p) * 6}px)`, textAlign: 'center', maxWidth: 1600, lineHeight: 1.05}}>{l}</div>; })}
  </AbsoluteFill></>; };
export const S9 = () => <WordCard n={9} video="wc9_eye.mp4" lines={['Looking', "isn't seeing"]} ats={[cue(9, 'looking') - 0.1, cue(9, 'seeing') - 0.25]} />;

// ===== 10 Driver tree over basketball footage; lines draw, red-cross figure row
const Line = ({x1, y1, x2, y2, at, dur = 0.5, color = C.light, w = 3}) => { const fr = useCurrentFrame(); const p = prog(fr, at, dur);
  return <svg style={{position: 'absolute', left: 0, top: 0, width: 13.333 * I, height: 7.5 * I, overflow: 'visible'}}><line x1={x1 * I} y1={y1 * I} x2={(x1 + (x2 - x1) * p) * I} y2={(y1 + (y2 - y1) * p) * I} stroke={color} strokeWidth={w} /></svg>; };
export const S10 = () => { const n = 10; const b1 = cue(n, 'first'), b2 = cue(n, 'second'), rc = cue(n, 'cross');
  const Br = ({y, at, bodyAt, head, body}) => <>
    <Line x1={4.25} y1={y + 0.75} x2={4.6} y2={y + 0.75} at={at} dur={0.25} />
    <Panel x={4.6} y={y} w={8.13} h={1.5} at={at + 0.15} kind="left" dark />
    <Reveal at={at + 0.2} kind="up"><T x={4.85} y={y + 0.12} w={7.6} size={21} weight={800} color={C.light}>{head}</T></Reveal>
    <Reveal at={bodyAt} kind="up"><T x={4.85} y={y + 0.58} w={7.6} size={16} color={C.white}>{body}</T></Reveal></>;
  return <>
    <Footage src="s6_court.mp4" /><Tint k={0.35} />
    <Stage>
      <Head n={n} media />
      <Reveal at={0.4} kind="pop" style={{...box(0.6, 2.85, 3.3, 1.4), background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 20 * PT, color: C.white, padding: 10}}>Chance of missing the unexpected</span></Reveal>
      <Line x1={3.9} y1={3.55} x2={4.25} y2={3.55} at={b1 - 0.4} dur={0.2} />
      <Line x1={4.25} y1={2.7} x2={4.25} y2={4.45} at={b1 - 0.2} dur={0.4} />
      <Br y={1.95} at={b1} bodyAt={cue(n, 'separate')} head="A harder task" body="Keeping separate counts of bounce passes and aerial passes made viewers less likely to notice the gorilla." />
      <Br y={3.7} at={b2} bodyAt={cue(n, 'counting')} head="It resembles what you're ignoring" body="Viewers counting the team in white missed the dark gorilla more than those counting the team in black." />
      <Panel x={0.6} y={5.45} w={12.13} h={0.8} at={rc - 0.3} kind="up" dark />
      <Reveal at={rc - 0.2} kind="fade"><T x={0.8} y={5.52} w={8.3} size={15} color={C.white}><b>Even unique items get missed: </b>about 30% failed to see a bright red cross crossing the screen for five seconds (Most et al., 2001).</T></Reveal>
      <People x={9.35} y={5.55} w={3.25} n={10} cols={10} at={rc} stagger={0.5} dim={3} dimAt={cue(n, 'thirty')} color={C.light} onDark gap={0.2} />
      <Source n={n} media /><Brand media />
    </Stage></>; };

// ===== 11 How it's measured: the question types itself out
export const S11 = () => { const n = 11; const q0 = cue(n, 'did'), q1 = cueEnd(n, 'unusual'); return <>
  <Footage src="s7_notes.mp4" /><Tint k={0.3} />
  <Stage>
    <Head n={n} media />
    <Panel x={0.6} y={1.95} w={12.13} h={1.7} at={q0 - 0.5} dark />
    <QuoteMark x={0.8} y={1.9} at={q0 - 0.4} />
    <Typed text="Did you notice anything unusual on the last trial which wasn't there on previous trials?" t0={q0} t1={q1 + 0.6} style={{...box(1.65, 2.1, 10.8), fontFamily: SANS, fontSize: 24 * PT, fontWeight: 700, color: C.white, lineHeight: 1.2}} />
    <Reveal at={q1 + 0.6} kind="fade"><T x={1.65} y={3.1} w={10.8} size={13} color={C.light}>— the standard question, as described by Nartker et al. (2025)</T></Reveal>
    <Reveal at={cue(n, 'say')} kind="pop" style={{...box(0.6, 4.1, 3.0, 1.0), background: C.callout, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(0,0,0,0.3)'}}>
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 22 * PT, color: C.white}}>Answer: no</span></Reveal>
    <Line x1={3.7} y1={4.6} x2={4.45} y2={4.6} at={cue(n, 'counted') - 0.3} dur={0.3} color={C.light} w={4} />
    <Panel x={4.6} y={4.1} w={8.13} h={1.0} at={cue(n, 'counted')} kind="left" dark />
    <Reveal at={cue(n, 'counted') + 0.1} kind="fade"><T x={4.6} y={4.1} w={8.13} h={1.0} size={20} weight={700} color={C.white} align="center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Counted as inattentionally blind: assumed to have seen nothing</T></Reveal>
    <Pill x={10.23} y={5.45} w={2.5} h={0.5} size={14} text="Hold that thought" fill={C.light} color={C.primary} at={cue(n, 'hold')} />
    <Source n={n} media /><Brand media />
  </Stage></>; };

export const S12 = () => <ChapterMap n={12} video="map12_bg.mp4" current={1} />;

// ===== paper profiles (13, 18, 22, 26): the paper's title block lands on the desk (idea 3)
export const Profile = ({n, label, title, pub, rows, sheetAt, rowAt, right, tags}) => { const w = 6.3; const h = sheetHeight({w, title});
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <Reveal at={0.4} kind="fade"><T x={0.6} y={1.85} w={6.3} size={12} weight={800} color={C.accent} style={{letterSpacing: 1}}>{label}</T></Reveal>
      <PaperSheet x={0.6} y={2.3} w={w} title={title} at={sheetAt} dur={SD(n).dur} />
      <Reveal at={sheetAt + 0.6} kind="up"><T x={0.6} y={2.3 + h + 0.22} w={6.3} size={13} color={C.secondary}>{pub}</T></Reveal>
      <div style={{...box(0.6, 2.3 + h + 0.62, 6.3), display: 'flex', flexDirection: 'column', gap: 0.12 * I}}>
        {rows.map(([k, v], i) => <Reveal key={i} at={rowAt + i * 0.25} kind="up"><div style={{fontFamily: SANS, fontSize: 13 * PT, color: C.primary, lineHeight: 1.2}}>
          <span style={{fontWeight: 800, color: C.secondary, fontSize: 11 * PT, letterSpacing: 1}}>{k.toUpperCase()}   </span>{v}</div></Reveal>)}</div>
      {right}
      {tags}
      <Source n={n} /><Brand />
    </Stage></>; };
const VidPanel = ({src, at, x = 7.3, y = 1.95, w = 5.43, h = 3.95}) => <Panel x={x} y={y} w={w} h={h} at={at} kind="focus" style={{overflow: 'hidden'}}>
  <Sequence from={f(at)}><OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence></Panel>;
export const S13 = () => { const n = 13; return <Profile n={n} label="RESEARCH 1  |  PEER-REVIEWED" title="t_drew" pub="Drew, Võ and Wolfe | Psychological Science 24(9), 2013"
  sheetAt={cue(n, 'trafton') - 0.4} rowAt={cue(n, 'trafton') + 1.2} rows={[['Sample', '24 radiologists; 24-25 untrained observers'], ['Task', 'Search five lung CT scans for nodules while eye-tracked'], ['The twist', 'A gorilla inserted into the last scan']]}
  right={<VidPanel src="s13_scan.mp4" at={0.5} />}
  tags={<Pill x={7.3} y={5.95} w={3.4} h={0.45} size={13} text="24 radiologists, eye-tracked" fill={C.accent} at={cue(n, 'radiologists') + 0.3} />} />; };

// ===== 14 Gorilla in the lungs: three dark tiles over hospital footage; 24 radiologists, 20 fade (idea 5)
export const S14 = () => { const n = 14; const t20 = cue(n, 'twenty'); const Tile = ({x, at, children}) => <Panel x={x} y={2.0} w={3.75} h={3.55} at={at} kind="up" dark>{children}</Panel>;
  return <>
    <Footage src="s9_hall.mp4" /><Tint k={0.25} />
    <Stage>
      <Head n={n} media />
      <Tile x={0.6} at={cue(n, 'forty-eight') - 0.3} />
      <CountUp at={cue(n, 'forty-eight')} dur={1.1} to={48} suffix="x" style={{...box(0.85, 2.2, 3.3), fontFamily: HEAD, fontWeight: 900, fontSize: 60 * PT, color: C.light}} />
      <Reveal at={cue(n, 'forty-eight') + 0.4} kind="up"><T x={0.85} y={3.75} w={3.3} size={15} color={C.white}>Gorilla size vs the average lung nodule in the scans</T></Reveal>
      <Tile x={4.8} at={cue(n, 'matchbook') - 0.3} />
      <Reveal at={cue(n, 'matchbook')} kind="pop"><T x={5.05} y={2.35} w={3.3} size={40} weight={900} font={HEAD} color={C.light}>Matchbook</T></Reveal>
      <Reveal at={cue(n, 'matchbook') + 0.3} kind="up"><T x={5.05} y={3.75} w={3.3} size={15} color={C.white}>Roughly the gorilla’s size, inside a scan of 239 slices</T></Reveal>
      <Tile x={9.0} at={cue(n, 'asked') - 0.3} />
      <People x={9.3} y={2.25} w={3.15} n={24} cols={8} at={cue(n, 'asked')} stagger={0.8} dim={20} dimAt={t20} color={C.light} onDark gap={0.22} />
      <Reveal at={t20} kind="pop"><T x={9.25} y={4.05} w={3.3} size={34} weight={900} font={HEAD} color={C.callout}>20 of 24</T></Reveal>
      <Reveal at={t20 + 0.3} kind="up"><T x={9.25} y={4.75} w={3.3} size={14} color={C.white}>radiologists did not report the gorilla (83%)</T></Reveal>
      <Note at={0.6} x={0.6} y={5.75} w={6} media text="Generic hospital footage, not from the study" />
      <Source n={n} media /><Brand media />
    </Stage></>; };

// ===== 15 Looked right at it: paper sentence highlighted (idea 3), 20 who missed it, 12 get an eye (idea 5)
export const S15 = () => { const n = 15; const d = SD(n); const eye = cue(n, 'directly'), ctl = cue(n, 'eighty-eight');
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <PaperSheet x={0.6} y={1.8} w={7.2} snip="drew" at={0.5} hlAt={cue(n, 'strangest')} cite={d.snippet.attribution} dur={d.dur} rotate={-0.8} push={0.03} />
      <Panel x={0.6} y={3.45} w={12.13} h={1.35} at={cue(n, 'eye-tracker') - 0.2} kind="left" accent={C.accent} />
      <CountUp at={cue(n, 'twelve')} to={12} suffix=" of 20" dur={0.7} style={{...box(0.85, 3.62, 2.8), fontFamily: HEAD, fontWeight: 900, fontSize: 36 * PT, color: C.accent}} />
      <Reveal at={eye} kind="up"><T x={0.85} y={4.25} w={4.6} size={13} color={C.secondary}>radiologists who missed the gorilla looked directly at its location (eye-tracking)</T></Reveal>
      <People x={6.6} y={3.56} w={4.4} n={20} cols={10} at={cue(n, 'twelve')} stagger={0.6} mark={12} markAt={eye} markKind="eye" color={C.secondary} gap={0.16} />
      <Reveal at={eye + 0.5} kind="fade"><T x={11.05} y={3.75} w={1.55} size={11} italic color={C.secondary}>each figure: one radiologist who missed it; eye = looked right at it</T></Reveal>
      <Panel x={0.6} y={4.95} w={12.13} h={0.85} at={ctl - 0.3} kind="wipe" accent={C.callout} />
      <CountUp at={ctl} to={88} suffix="%" dur={0.9} style={{...box(0.85, 5.0, 2.0), fontFamily: HEAD, fontWeight: 900, fontSize: 32 * PT, color: C.callout}} />
      <Reveal at={ctl + 0.2} kind="up"><T x={2.6} y={5.17} w={9.8} size={15}>detection by untrained observers when told where to look (control test)</T></Reveal>
      <Reveal at={cue(n, 'filter')} kind="fade"><T x={0.6} y={5.98} w={8.3} size={11} color={C.secondary}>The authors suggest a light-coloured gorilla, closer to the bright nodules the radiologists hunted, might have been noticed more.</T></Reveal>
      <Suspect n={1} verdict="Unlikely" x={9.05} y={5.97} at={cue(n, 'suspect')} vAt={cue(n, 'hold')} fill={C.secondary} />
      <Source n={n} /><Brand />
    </Stage></>; };

export const S16 = () => <ChapterMap n={16} video="map16_bg.mp4" current={2} />;

// ===== 17 The Boston case: timeline over a callback to the opening diagram
export const S17 = () => { const n = 17; const pts = [['25 Jan 1995, 2 a.m.', 'Officer Kenny Conley chases a suspect over a fence, past where fellow officer Michael Cox is being beaten', C.white, cue(n, 'kenny')],
  ['Afterwards', 'Conley says he didn’t see the beating', C.white, cue(n, 'said')], ['Trial', 'Convicted of perjury and obstruction; sentenced to 34 months', C.callout, cue(n, 'convicted')],
  ['Later', 'Wins on appeal; not retried', C.light, cue(n, 'appeal')]];
  return <>
    <ChaseDiagram start={cue(n, 'chased')} runDur={6} cone={cue(n, 'chased') + 0.6} dimAt={cue(n, 'never')} labels={false} />
    <Tint k={0.72} />
    <Stage>
      <Head n={n} media />
      <Line x1={0.9} y1={3.0} x2={12.5} y2={3.0} at={cue(n, 'boston') - 0.2} dur={1.2} color={C.lineMedia} w={2} />
      {pts.map(([d, t, c, at], i) => { const x = 0.9 + i * 3.0; return <React.Fragment key={i}>
        <Reveal at={at} kind="pop" style={{...box(x + 0.05, 2.82, 0.36, 0.36), borderRadius: '50%', background: c, boxShadow: `0 0 0 6px rgba(255,255,255,0.08)`}} />
        <Reveal at={at + 0.1} kind="down"><T x={x} y={2.2} w={2.85} size={14} weight={800} color={c}>{d}</T></Reveal>
        <Reveal at={at + 0.2} kind="up"><T x={x} y={3.4} w={2.75} size={16} color={C.white}>{t}</T></Reveal></React.Fragment>; })}
      <Reveal at={cue(n, 'appeal') + 0.6} kind="fade"><T x={0.6} y={5.8} w={9} size={11} color={C.lineMedia}>The appeal decision did not rely on inattentional blindness (Chabris et al., 2011).</T></Reveal>
      <Note at={1} x={8.2} y={6.35} w={4.53} align="right" media size={10} text="Background: illustration from the opening, not to scale" />
      <Source n={n} media /><Brand media />
    </Stage></>; };

// ===== 18 Chabris profile with the running-route diagram (idea 4)
export const S18 = () => { const n = 18; return <Profile n={n} label="RESEARCH 2  |  PEER-REVIEWED SHORT REPORT" title="t_chabris" pub="Chabris, Weinberger, Fontaine and Simons | i-Perception 2, 2011"
  sheetAt={cue(n, 'christopher') - 0.4} rowAt={cue(n, 'students')} rows={[['Task', 'Follow a runner 9.1 m behind on a 400 m route, counting his head-touches'], ['The surprise', 'Three people staging a fight, 8 m off the path'], ['Sample', '94 students across three studies']]}
  right={<Panel x={7.3} y={1.95} w={5.43} h={3.95} at={0.5} kind="focus" fill="#F7F4FA" style={{overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <RouteDiagram start={0.8} fightAt={cue(n, 'staged') - 0.3} countAt={cue(n, 'counted')} w={5.43 * I} h={3.95 * I} /></Panel>}
  tags={<><Pill x={7.3} y={5.95} w={3.7} h={0.45} size={13} text="A staged fight beside the route" fill={C.callout} at={cue(n, 'staged')} />
    <Note at={1.2} x={11.1} y={6.0} w={1.63} size={9} align="right" text="Illustration, not to scale" /></>} />; };

// ===== 19 Night vs day: split screen (idea 9) with people counts (idea 5)
export const S19 = () => { const n = 19; const nt = cue(n, 'thirty-five'), dy = cue(n, 'fifty-six');
  const Half = ({x, label, pct, at, ofN, lit, sub, color}) => <>
    <Reveal at={at - 0.6} kind="fade"><T x={x} y={1.95} w={5.6} size={16} weight={800} color={C.light} style={{letterSpacing: 2}}>{label}</T></Reveal>
    <CountUp at={at} to={pct} suffix="%" dur={1} style={{...box(x, 2.3, 5.6), fontFamily: HEAD, fontWeight: 900, fontSize: 76 * PT, color, letterSpacing: -2, textShadow: '0 4px 20px rgba(0,0,0,0.4)'}} />
    <Reveal at={at + 0.3} kind="up"><T x={x} y={3.85} w={5.6} size={16} color={C.white}>{sub}</T></Reveal>
    <People x={x} y={4.45} w={ofN === 20 ? 5.0 : 4.0} n={ofN} cols={10} at={at - 0.4} stagger={0.6} dim={ofN - lit} dimAt={at + 0.6} color={color} onDark gap={0.22} />
  </>;
  return <>
    <Split at={0.1} left={<><Footage src="split_night.mp4" /><Tint k={0.55} /></>} right={<><Footage src="split_day.mp4" /><Tint k={0.45} /></>} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(30,20,48,0.85) 0%, rgba(30,20,48,0) 26%)'}} />
    <Stage>
      <Head n={n} media />
      <Half x={0.6} label="AT NIGHT" pct={35} at={nt} ofN={20} lit={7} sub="noticed the fight (7 of 20)" color={C.light} />
      <Half x={7.25} label="IN DAYLIGHT" pct={56} at={dy} ofN={16} lit={9} sub="noticed the fight (9 of 16)" color={C.callout} />
      <Panel x={7.25} y={5.55} w={5.45} h={0.6} at={cue(n, 'broad')} dark />
      <Reveal at={cue(n, 'broad') + 0.1} kind="fade"><T x={7.4} y={5.63} w={5.2} size={15} weight={700} color={C.white}>Fight in view for at least 30 seconds</T></Reveal>
      <Source n={n} media /><Brand media />
    </Stage></>; };

// ===== 20 Filter under load: two rows of runners (idea 5), then the authors' sentence highlighted (idea 3)
export const S20 = () => { const n = 20; const d = SD(n); const a72 = cue(n, 'seventy-two'), a42 = cue(n, 'forty-two');
  const Row = ({y, label, pct, total, lit, at, color}) => <>
    <Reveal at={at - 0.8} kind="left"><T x={0.6} y={y} w={3.7} size={15} weight={700} align="right">{label}</T></Reveal>
    <People x={4.5} y={y - 0.05} w={6.4} n={total} cols={total} at={at - 0.8} stagger={0.6} dim={total - lit} dimAt={at + 0.1} color={color} gap={0.12} order="end" />
    <CountUp at={at} to={pct} suffix="%" dur={0.8} style={{...box(11.1, y - 0.12, 1.7), fontFamily: HEAD, fontWeight: 900, fontSize: 32 * PT, color}} /></>;
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <Reveal at={0.4} kind="fade"><T x={0.6} y={1.8} w={7} size={13} color={C.secondary}>Daytime runners who noticed the fight; each figure is one runner</T></Reveal>
      <Row y={2.3} label="Just follow the runner (18 of 25)" pct={72} total={25} lit={18} at={a72} color={C.accent} />
      <Row y={3.25} label="Keep separate counts for each hand (14 of 33)" pct={42} total={33} lit={14} at={a42} color={C.callout} />
      <PaperSheet x={0.6} y={4.3} w={7.6} snip="chabris" at={cue(n, 'conclusion') - 0.3} hlAt={cue(n, 'conley')} cite={d.snippet.attribution} dur={8} rotate={-0.8} push={0.03} />
      <Suspect n={3} verdict="Strong point" x={8.7} y={4.55} at={cue(n, 'suspect')} vAt={cue(n, 'filter', 1)} fill={C.accent} />
      <Source n={n} /><Brand />
    </Stage></>; };
