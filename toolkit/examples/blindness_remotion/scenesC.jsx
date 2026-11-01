// Slides 21-36: is it just some people, the twist, the verdict and what it means.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {C, SANS, HEAD, I, PT, f, box, cue, cueEnd, voEnd, prog, Reveal, Words, CountUp, Footage, PaperBg, Stage, T, Brand, Source, Head, Note, Pill, Panel,
  People, Dots, PaperSheet, sheetHeight, Split, Suspect, SHADOW, SD, Vignette} from './lib';
import {ChapterMap} from './scenesA';
import {Profile, WordCard} from './scenesB';
import {OffthreadVideo, Sequence, staticFile} from 'remotion';

const Tint = ({k = 0.55}) => <AbsoluteFill style={{background: `rgba(30,20,48,${k})`}} />;
const VidPanel = ({src, at, x = 7.3, y = 1.95, w = 5.43, h = 3.95}) => <Panel x={x} y={y} w={w} h={h} at={at} kind="focus" style={{overflow: 'hidden'}}>
  <Sequence from={f(at)}><OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence></Panel>;
const Seg = ({x1, y1, x2, y2, at, dur = 0.4, color = C.primary, w = 5, arrow}) => { const fr = useCurrentFrame(); const p = prog(fr, at, dur);
  const X2 = x1 + (x2 - x1) * p, Y2 = y1 + (y2 - y1) * p; const ang = Math.atan2(y2 - y1, x2 - x1);
  return <svg style={{position: 'absolute', left: 0, top: 0, width: 13.333 * I, height: 7.5 * I, overflow: 'visible'}}>
    {p > 0 && <line x1={x1 * I} y1={y1 * I} x2={X2 * I} y2={Y2 * I} stroke={color} strokeWidth={w} strokeLinecap="round" />}
    {arrow && p > 0.95 && <polygon points="0,0 -16,-9 -16,9" fill={color} transform={`translate(${X2 * I} ${Y2 * I}) rotate(${ang * 180 / Math.PI})`} />}
  </svg>; };

export const S21 = () => <ChapterMap n={21} video="map21_archive.mp4" current={3}
  footnote={<Note at={0.3} x={0.9} y={6.85} w={8} media size={10} text="Archive film, New York, 1940 (public domain, Prelinger Archives)" />} />;

export const S22 = () => { const n = 22; return <Profile n={n} label="RESEARCH 3  |  PEER-REVIEWED, OPEN ACCESS" title="t_kreitz" pub="PLOS ONE 10(8), 2015"
  sheetAt={cue(n, 'carina') - 0.4} rowAt={cue(n, 'measuring')} rows={[['Sample', 'University students: 116 in study 1, 198 in study 2'], ['Measures', 'Working memory, breadth of attention, and more'], ['Test', 'Several inattentional blindness tasks each']]}
  right={<VidPanel src="s15_study.mp4" at={0.5} />} />; };

// ===== 23 Does / doesn't predict, then the authors' conclusion highlighted
export const S23 = () => { const n = 23; const d = SD(n); const Item = ({y, at, mark, mc, text}) => <Reveal at={at} kind="left">
  <T x={6.83} y={y} w={5.9} size={17}><span style={{color: mc, fontWeight: 800}}>{mark}  </span>{text}</T></Reveal>;
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <Reveal at={cue(n, 'working') - 0.3} kind="fade"><T x={0.6} y={1.9} w={5.9} size={14} weight={800} color={C.accent} style={{letterSpacing: 1}}>PREDICTED NOTICING</T></Reveal>
      <Reveal at={cue(n, 'working') - 0.3} kind="wipe" style={{...box(0.6, 2.32, 5.9, 0.02), background: C.accent}} />
      <Reveal at={cue(n, 'working')} kind="left"><T x={0.6} y={2.45} w={5.9} size={17}><span style={{color: C.accent, fontWeight: 800}}>✓  </span>Working memory, weakly, in one of four task versions</T></Reveal>
      <Reveal at={cue(n, 'version') - 0.2} kind="fade"><T x={6.83} y={1.9} w={5.9} size={14} weight={800} color={C.secondary} style={{letterSpacing: 1}}>DIDN'T PREDICT NOTICING</T></Reveal>
      <Reveal at={cue(n, 'version') - 0.2} kind="wipe" style={{...box(6.83, 2.32, 5.9, 0.02), background: C.secondary}} />
      <Item y={2.45} at={cue(n, 'version')} mark="–" mc={C.secondary} text="Working memory in the other tasks" />
      <Item y={2.9} at={cue(n, 'breadth')} mark="–" mc={C.secondary} text="Breadth of attention" />
      <Item y={3.35} at={cue(n, 'barely')} mark="–" mc={C.secondary} text="Noticing in one task barely predicted another" />
      <PaperSheet x={0.6} y={4.1} w={9.4} snip="kreitz" at={cue(n, 'verdict') - 0.4} hlAt={cue(n, 'stable') - 0.6} hlDur={1.4} cite={d.snippet.attribution} dur={9} rotate={-0.6} push={0.025} />
      <Reveal at={cue(n, 'students')} kind="fade"><T x={0.6} y={3.45} w={5.9} size={13} italic color={C.secondary}>Both samples were university students.</T></Reveal>
      <Source n={n} /><Brand />
    </Stage></>; };

// ===== 24 The biggest test: 1,000 dots per study vs 44 (idea 5) + highlighted conclusion
export const S24 = () => { const n = 24; const d = SD(n); const k = cue(n, 'thousand'), dz = cue(n, 'dozen');
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <Reveal at={k - 0.5} kind="fade"><T x={0.6} y={1.85} w={6.6} size={14} weight={700}>2026 registered report: people in <i>each</i> of two studies</T></Reveal>
      <Dots x={0.6} y={2.25} w={6.0} n={1000} cols={50} at={k} dur={2.2} color={C.accent} r={0.36} />
      <CountUp at={k} dur={2.2} to={1000} sep style={{...box(6.75, 3.1, 1.0), fontFamily: HEAD, fontWeight: 900, fontSize: 24 * PT, color: C.accent}} />
      <Reveal at={dz - 0.5} kind="fade"><T x={0.6} y={4.85} w={6.6} size={14} weight={700}>Typical earlier sample (median)</T></Reveal>
      <Dots x={0.6} y={5.22} w={6.0} n={44} cols={50} at={dz} dur={0.5} color={C.secondary} r={0.36} />
      <CountUp at={dz} dur={0.5} to={44} style={{...box(6.75, 5.08, 1.0), fontFamily: HEAD, fontWeight: 900, fontSize: 24 * PT, color: C.secondary}} />
      <PaperSheet x={7.75} y={1.9} w={5.0} snip="simons26c" at={cue(n, 'memory') - 0.4} hlAt={cue(n, 'none') - 0.2} dur={10} rotate={1.0} push={0.03} />
      <Reveal at={cue(n, 'memory')} kind="fade"><T x={7.75} y={3.05} w={5.0} size={10} italic color={C.secondary}>{d.snippet.attribution} (shown: accepted manuscript on OSF; article CC BY 4.0)</T></Reveal>
      <Reveal at={cue(n, 'surprise')} kind="wipe" style={{...box(7.75, 3.75, 5.0, 0.95), background: C.callout, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, boxShadow: SHADOW}}>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 14 * PT, color: C.white, textAlign: 'center'}}>Same study: a harder counting task didn’t lower noticing (about 45% either way)</span></Reveal>
      <Suspect n={2} verdict="Mostly cleared" x={7.75} y={5.0} at={cue(n, 'suspect')} vAt={cue(n, 'mostly')} fill={C.secondary} />
      <Source n={n} /><Brand />
    </Stage></>; };

export const S25 = () => <ChapterMap n={25} video="map24_bg.mp4" current={4} hidden reveal={cue(25, 'twist') - 0.2} />;

export const S26 = () => { const n = 26; return <Profile n={n} label="RESEARCH 4  |  PEER-REVIEWED (eLife ASSESSMENT: CONVINCING)" title="t_nartker" pub="Johns Hopkins | eLife, Version of Record 19 May 2025"
  sheetAt={cue(n, 'johns') - 0.5} rowAt={cue(n, 'tested')} rows={[['Sample', 'Over 25,000 online participants'], ['Design', 'Five pre-registered experiments'], ['Authors’ claim', 'The largest ever set of inattentional blindness studies']]}
  right={<VidPanel src="s17_office.mp4" at={0.5} />}
  tags={<><Pill x={7.3} y={5.95} w={2.6} h={0.45} size={13} text="Over 25,000 people" at={cue(n, 'twenty-five')} />
    <Pill x={10.05} y={5.95} w={2.68} h={0.45} size={12} text="Largest ever set of IB studies" fill={C.accent} at={cue(n, 'largest')} /></>} />; };

// ===== 27 The extra question: the trial animates step by step
export const S27 = () => { const n = 27; const fr = useCurrentFrame(); const cr = cue(n, 'cross'), sp = cue(n, 'surprise'), q = cue(n, 'usual'), g = cue(n, 'another');
  const flash = fr >= f(sp) ? (fr < f(sp + 0.6) ? ((fr - f(sp)) % 6 < 3 ? 1 : 0.15) : 1) : 0;
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <Reveal at={cr - 0.4} kind="fade"><T x={0.6} y={1.9} w={5} size={12} weight={800} color={C.accent} style={{letterSpacing: 1}}>ONE TRIAL</T></Reveal>
      <Seg x1={1.6} y1={3.55} x2={4.0} y2={3.55} at={cr} color={C.primary} w={7} />
      <Seg x1={2.8} y1={2.45} x2={2.8} y2={4.65} at={cr + 0.15} color={C.primary} w={7} />
      <Pill x={0.9} y={5.0} w={3.8} h={0.5} size={14} text="Which arm is longer?" fill={C.white} color={C.primary} line={C.rule} at={cr + 0.4} />
      <div style={{...box(5.2, 2.6, 0.1, 1.4), background: C.negative, opacity: flash, borderRadius: 4, boxShadow: flash ? '0 0 18px rgba(181,48,58,0.6)' : 'none'}} />
      <Pill x={4.6} y={4.3} w={1.6} h={0.45} size={13} text="Surprise" at={sp + 0.2} />
      <Seg x1={6.55} y1={3.55} x2={7.45} y2={3.55} at={cue(n, 'then') } color={C.primary} w={4} arrow />
      <Pill x={7.6} y={2.25} w={5.13} h={0.6} size={15} text="Did you notice anything unusual?" fill={C.primary} at={q - 0.3} />
      <Pill x={8.4} y={3.1} w={1.5} h={0.5} size={14} text="Yes" fill={C.white} color={C.primary} line={C.rule} at={q + 0.3} />
      <Pill x={10.4} y={3.1} w={1.5} h={0.5} size={14} text="No" fill={C.secondary} at={q + 0.45} />
      <Seg x1={11.15} y1={3.7} x2={11.15} y2={4.25} at={g} color={C.primary} w={4} arrow />
      <Pill x={7.6} y={4.35} w={5.13} h={0.6} size={15} text="Even if no: left or right? Guess." fill={C.accent} at={g + 0.3} />
      <Reveal at={cue(n, 'guess') + 0.5} kind="up" style={{...box(0.6, 5.75, 7.0, 0.5), background: C.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW}}>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 16 * PT}}>Some people were shown nothing at all, but asked anyway</span></Reveal>
      <Reveal at={cue(n, 'guess') + 0.8} kind="fade"><T x={0.6} y={6.35} w={12.13} size={11} color={C.secondary}>Experiment 1 design (N = 374); absent trials were added in later experiments. Diagram simplified.</T></Reveal>
      <Source n={n} /><Brand />
    </Stage></>; };

// ===== 28 Columns grow with count-ups; chance line drawn at exactly 50%
export const S28 = () => { const n = 28; const fr = useCurrentFrame(); const base = 5.45, k = 0.031;
  const Col = ({x, v, at, fill, label, vc}) => { const p = prog(fr, at, 0.9); return <>
    <div style={{...box(x, base - v * k * p, 2.2, v * k * p), background: fill, borderRadius: '3px 3px 0 0', boxShadow: SHADOW}} />
    <CountUp at={at} dur={0.9} to={v} decimals={1} suffix="%" style={{...box(x, base - v * k * p - 0.62, 2.2), textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 26 * PT, color: vc || fill}} />
    <Reveal at={at} kind="up"><T x={x - 0.2} y={base + 0.12} w={2.6} size={14} weight={600} align="center">{label}</T></Reveal></>; };
  const ch = cue(n, 'half');
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <Reveal at={0.4} kind="fade"><T x={0.6} y={1.85} w={7} size={14} color={C.secondary}>Experiment 1 (%)</T></Reveal>
      <Reveal at={0.4} kind="wipe" style={{...box(0.8, base, 11.4, 0.015), background: C.secondary}} />
      <Col x={1.4} v={71.4} at={cue(n, 'seventy-one')} fill={C.secondary} label="Said they noticed it" />
      <Col x={5.2} v={87.4} at={cue(n, 'eighty-seven')} fill={C.accent} label="Located it correctly" />
      <Reveal at={ch} kind="wipe" style={{...box(8.6, base - 50 * k, 4.1, 0), borderTop: `3px dashed ${C.callout}`}} />
      <Reveal at={ch + 0.2} kind="fade"><T x={11.25} y={base - 50 * k - 0.4} w={1.48} size={12} weight={800} color={C.callout} align="right">guessing: 50%</T></Reveal>
      <Col x={9.0} v={63.6} at={cue(n, 'sixty-three')} fill={C.callout} label="“Non-noticers” who located it" />
      <Note at={cue(n, 'sixty-three') + 1} x={0.6} y={6.25} w={12} text="Group-level result; Experiment 1 sample of 374. Columns drawn to scale." />
      <Source n={n} /><Brand />
    </Stage></>; };

// ===== 29 Playing it safe
export const S29 = () => { const n = 29; const d = SD(n); const s7 = cue(n, 'seven'), hi = cue(n, 'highly');
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <Panel x={0.6} y={1.9} w={5.9} h={1.9} at={s7 - 0.5} kind="left" accent={C.accent} />
      <CountUp at={s7} to={7.2} decimals={1} suffix="%" dur={0.9} style={{...box(0.95, 2.05, 5.3), fontFamily: HEAD, fontWeight: 900, fontSize: 44 * PT, color: C.accent}} />
      <Reveal at={s7 + 0.3} kind="up"><T x={0.95} y={2.95} w={5.3} size={13} color={C.secondary}>said yes when nothing was shown at all (Experiment 5)</T></Reveal>
      <Reveal at={s7 + 0.6} kind="fade"><T x={0.6} y={3.85} w={5.9} size={12} italic color={C.secondary}>Shown nothing, asked anyway</T></Reveal>
      <Panel x={6.83} y={1.9} w={5.9} h={1.9} at={hi - 0.4} kind="right" accent={C.callout} />
      <Reveal at={hi} kind="pop"><T x={7.18} y={2.1} w={5.3} size={36} weight={900} font={HEAD} color={C.callout}>Above chance</T></Reveal>
      <Reveal at={hi + 0.3} kind="up"><T x={7.18} y={2.95} w={5.3} size={13} color={C.secondary}>even people highly confident they saw nothing (N = 204)</T></Reveal>
      <PaperSheet x={0.6} y={4.35} w={10.6} snip="nartker" at={cue(n, 'phrase') - 0.5} hlAt={cue(n, 'playing') - 0.4} hlDur={1.3} cite={d.snippet.attribution} dur={8} rotate={-0.5} push={0.02} />
      <Source n={n} /><Brand />
    </Stage></>; };

export const S30 = () => <WordCard n={30} video="wc29_mist.mp4" from={0.4} lines={['Not nothing.', 'Just not sure.']} ats={[cue(30, 'nothing') - 0.2, cue(30, 'sure') - 0.3]} />;

// ===== 31 What it shows / doesn't show: split screen (idea 9)
export const S31 = () => { const n = 31; const It = ({x, y, at, mark, mc, text}) => <Reveal at={at} kind="up">
  <T x={x} y={y} w={0.5} size={22} weight={900} color={mc}>{mark}</T><T x={x + 0.55} y={y} w={5.1} size={18} color={C.white}>{text}</T></Reveal>;
  return <>
    <Split at={0.2} left={<><Footage src="s21_glass.mp4" /><AbsoluteFill style={{background: 'rgba(60,35,100,0.72)'}} /></>}
      right={<><Footage src="s21_glass_gray.mp4" /><AbsoluteFill style={{background: 'rgba(25,18,36,0.8)'}} /></>} />
    <Stage>
      <Head n={n} media />
      <Reveal at={cue(n, 'group') - 0.3} kind="fade"><T x={0.6} y={1.95} w={5.9} size={14} weight={800} color={C.light} style={{letterSpacing: 1}}>WHAT IT SHOWS</T></Reveal>
      <Reveal at={cue(n, 'prove') - 0.3} kind="fade"><T x={6.95} y={1.95} w={5.8} size={14} weight={800} color={C.lineMedia} style={{letterSpacing: 1}}>WHAT IT DOESN'T SHOW</T></Reveal>
      <It x={0.6} y={2.6} at={cue(n, 'group')} mark="✓" mc={C.light} text="As a group, people pick up location, colour and shape of things they deny seeing" />
      <It x={6.95} y={2.6} at={cue(n, 'prove')} mark="–" mc={C.lineMedia} text="That every individual saw it: the results are group-level" />
      <It x={6.95} y={3.95} at={cue(n, 'fifty-seven')} mark="–" mc={C.lineMedia} text="That missing things is a myth: with a moving object on screen for 5 seconds, 57.3% still said they noticed nothing" />
      <It x={0.6} y={3.95} at={cue(n, 'story')} mark="✓" mc={C.light} text="The yes/no question undercounts what people perceive" />
      <Suspect n={4} verdict="Revealed: it got in" x={0.6} y={5.45} at={cue(n, 'hidden')} vAt={cue(n, 'got')} fill={C.callout} />
      <Source n={n} media /><Brand media />
    </Stage></>; };

export const S32 = () => <ChapterMap n={32} video="map31_bg.mp4" current={5} hidden={false} />;

// ===== 33 Verdict scorecard: rows in rank order, revealed in the order the narrator scores them
const VERD = [{t: "You weren't looking at it", score: 1, word: 'Weak', note: '12 of 20 who missed it looked right at it', k: 0, wc: ['weak', 0]},
  {t: "Some people just don't notice", score: 1, word: 'Weak', note: '2,000-person test: ability and personality barely predicted it', k: 1, wc: ['weak', 1]},
  {t: 'Attention filtered it out', score: 3, word: 'Strong', note: 'Load cut noticing 72% to 42%; a 2026 study saw no drop', k: 2, wc: ['strong', 0]},
  {t: "It got in, but you weren't sure", score: 2, word: 'Promising', note: 'Located it 63.6% vs 50% chance; group-level', k: 3, wc: ['promising', 0]}];
export const S33 = () => { const n = 33; const fr = useCurrentFrame(); const order = [2, 3, 0, 1]; const rh = 1.0;
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      {order.map((vi, i) => { const v = VERD[vi]; const y = 2.0 + i * (rh + 0.08); const at = cue(n, 'suspect', v.k) - 0.1; const va = cue(n, v.wc[0], v.wc[1]);
        const col = v.score === 3 ? C.accent : v.score === 2 ? C.callout : C.secondary;
        return <React.Fragment key={vi}>
          <Panel x={0.55} y={y} w={12.23} h={rh} at={at} kind="left" fill={C.white} />
          <Reveal at={at + 0.1} kind="pop" style={{...box(0.75, y + 0.2, 0.6, 0.6), borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: HEAD, fontWeight: 900, fontSize: 18 * PT, color: C.white}}>{vi + 1}</span></Reveal>
          <Reveal at={at + 0.15} kind="up"><T x={1.55} y={y + 0.12} w={4.6} size={18} weight={800}>{v.t}</T></Reveal>
          <Reveal at={va} kind="up"><T x={1.55} y={y + 0.56} w={4.6} size={12} color={C.secondary}>{v.note}</T></Reveal>
          {[0, 1, 2].map((d) => { const p = prog(fr, va + 0.12 * d, 0.3); const on = d < v.score;
            return <div key={d} style={{...box(6.5 + d * 0.5, y + 0.33, 0.34, 0.34), borderRadius: '50%', border: `3px solid ${on ? col : C.rule}`, background: on ? col : 'transparent', transform: `scale(${on ? 0.6 + 0.4 * p : 1})`, opacity: fr < f(va) ? 0 : 1}} />; })}
          <Pill x={8.3} y={y + 0.27} w={1.9} h={0.46} size={14} text={v.word} fill={col} at={va + 0.2} />
        </React.Fragment>; })}
      <Reveal at={cue(n, 'wins')} kind="pop" style={{...box(0.5, 2.0 - 0.05, 12.33, rh + 0.1), border: `4px solid ${C.accent}`, borderRadius: 6}} />
      <Reveal at={cue(n, 'zero')} kind="pop" style={{...box(0.5, 2.0 + (rh + 0.08) - 0.05, 12.33, rh + 0.1), border: `3px dashed ${C.callout}`, borderRadius: 6}} />
      <Reveal at={cue(n, 'read') - 0.3} kind="fade"><T x={10.4} y={2.25} w={2.3} size={12} weight={800} color={C.accent} align="right">MY READ: THE FILTER WINS</T></Reveal>
      <Note at={cue(n, 'read')} x={0.6} y={6.42} w={9.6} text="Scores are our reading of the four papers, not their own ranking." />
      <Source n={n} /><Brand />
    </Stage></>; };

// ===== 34 What helps: if/then rows over park footage
export const S34 = () => { const n = 34; const rows = [['Lighten the load', "Runners who didn't count noticed the fight 72% of the time, vs 42% with separate counts (Chabris et al.)", cue(n, 'lighten')],
  ['Expect the unexpected', 'The radiology study’s authors think their experts would have done much better if told to look for it (Drew et al.)', cue(n, 'tell')],
  ['Doubt “I would have noticed”', 'Most people overestimate what they notice (Simons, Noba)', cue(n, 'humbler')]];
  return <>
    <Footage src="s23_park.mp4" /><Tint k={0.35} />
    <Stage>
      <Head n={n} media />
      {rows.map(([a, b, at], i) => { const y = 1.95 + i * 1.2; return <React.Fragment key={i}>
        <Reveal at={at} kind="pop" style={{...box(0.6, y, 3.2, 1.0), background: i === 0 ? C.accent : C.mid, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 8px 18px rgba(0,0,0,0.3)'}}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 16 * PT, color: C.white, padding: 8}}>{a}</span></Reveal>
        <Seg x1={3.85} y1={y + 0.5} x2={4.3} y2={y + 0.5} at={at + 0.2} dur={0.2} color={C.light} w={3} arrow />
        <Panel x={4.4} y={y} w={8.33} h={1.0} at={at + 0.35} kind="left" fill="rgba(255,255,255,0.94)">
          <div style={{padding: '10px 14px', fontFamily: SANS, fontSize: 16 * PT, color: C.primary, lineHeight: 1.2}}>{b}</div></Panel>
      </React.Fragment>; })}
      <Reveal at={cue(n, 'study') + 0.3} kind="fade"><T x={0.6} y={5.55} w={12.13} size={12} color={C.rule}>Row 1: a large 2026 study found no drop in noticing with a harder counting task (Simons et al., 2026).</T></Reveal>
      <Reveal at={cue(n, 'warned') + 0.3} kind="fade"><T x={0.6} y={5.9} w={12.13} size={12} color={C.rule}>Row 2: the expectation effect is the authors' presumption, not tested in their study.</T></Reveal>
      <Source n={n} media /><Brand media />
    </Stage></>; };

export const S35 = () => <WordCard n={35} video="wc3_clouds.mp4" lines={['Attention', 'decides.']} ats={[cue(35, 'attention') - 0.15, cue(35, 'decides') - 0.15]} />;

// ===== 36 The answer and four takeaways over the eye footage
export const S36 = () => { const n = 36; const tk = ['About half missed the gorilla', 'Experts aren’t immune', 'It’s the situation, not your IQ', 'We often see more than we say']; const t0 = cue(n, 'kenny');
  return <>
    <Footage src="s24_eye.mp4" /><Tint k={0.4} />
    <Stage>
      <Head n={n} media />
      <Panel x={0.6} y={1.95} w={4.6} h={3.55} at={0.4} fill={C.primary} style={{boxShadow: '0 12px 30px rgba(0,0,0,0.35)'}} />
      <Reveal at={0.5} kind="fade"><T x={0.9} y={2.1} w={4.0} size={12} weight={800} color={C.rule} style={{letterSpacing: 1}}>THE ANSWER</T></Reveal>
      <Words at={0.6} dur={2.0} text="Why don’t we see what’s right in front of us? Attention filters it out, and we under-report the little that gets through." style={{...box(0.9, 2.5, 4.0), fontFamily: SANS, fontSize: 19 * PT, color: C.white, lineHeight: 1.25}} />
      {tk.map((t, i) => { const y = 1.95 + i * 0.9, at = t0 + i * 1.3; return <React.Fragment key={i}>
        <Reveal at={at} kind="pop" style={{...box(5.6, y + 0.1, 0.6, 0.6), borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontFamily: HEAD, fontWeight: 900, fontSize: 18 * PT, color: C.white}}>{i + 1}</span></Reveal>
        <Reveal at={at + 0.1} kind="left"><T x={6.4} y={y + 0.12} w={6.33} size={20} weight={800} color={C.white}>{t}</T></Reveal></React.Fragment>; })}
      <Reveal at={cue(n, "don't") - 0.2} kind="wipe" style={{...box(0.6, 5.75, 12.13, 0.8), background: C.callout, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.3)'}}>
        <span style={{fontFamily: HEAD, fontWeight: 800, fontSize: 26 * PT, color: C.white}}>You don't see with your eyes. You see with your attention.</span></Reveal>
      <Source n={n} media /><Brand media />
    </Stage></>; };
