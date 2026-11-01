// Slides 1-6: hook, opener test, cold open, title, four suspects, chapter map.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {C, SANS, HEAD, I, PT, f, box, cue, cueEnd, prog, Reveal, Words, CountUp, Footage, PaperBg, Stage, T, Brand, Source, Head, Note, Pill, Panel,
  People, peopleHeight, Parallax, Vignette, SD} from './lib';
import {MapZoom, ChaseDiagram} from './diagrams';

// ===== 1 Hook: map zoom to Boston, then a top-down sketch of the chase (idea 4)
export const S1 = () => { const fr = useCurrentFrame(); const n = 1;
  const chase = cue(n, 'chases') - 0.7; const mapOut = prog(fr, chase, 0.8);
  return <>
    <AbsoluteFill style={{opacity: 1 - mapOut}}>
      <MapZoom keys={[{t: 0, lon: -95, lat: 38.5, w: 64}, {t: 0.3, lon: -95, lat: 38.5, w: 64}, {t: 1.7, lon: -71.4, lat: 42.3, w: 7.5}, {t: 3.0, lon: -71.06, lat: 42.36, w: 2.6}]}
        pin={[-71.06, 42.36]} pinAt={cue(n, 'boston') + 0.5} label="Boston" labelAt={cue(n, 'boston') + 0.9} highlightAt={1.2} />
    </AbsoluteFill>
    <AbsoluteFill style={{opacity: mapOut}}>
      <ChaseDiagram start={cue(n, 'chases') - 0.2} runDur={cue(n, 'swore') - cue(n, 'chases') + 0.6} cone={cue(n, 'chases') + 0.4} dimAt={cue(n, 'swore')} x={260} y={60} w={1700} h={956} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(30,20,48,0.96) 0%, rgba(30,20,48,0.85) 34%, rgba(30,20,48,0) 58%)'}} />
    </AbsoluteFill>
    <Vignette k={0.3} />
    <Stage>
      <Reveal at={0.1} kind="fade"><T x={0.9} y={0.75} w={11} size={18} color={C.light} weight={700} style={{letterSpacing: 1}}>25 JANUARY 1995, 2 A.M.   |   BOSTON</T></Reveal>
      <Words at={cue(n, 'police') - 0.3} text="A police officer chases a suspect past a brutal beating." style={{...box(0.9, 1.45, 6.4), fontFamily: HEAD, fontSize: 34 * PT, fontWeight: 800, color: C.white, lineHeight: 1.1}} />
      <Words at={cue(n, 'swore') - 0.1} dur={0.7} text="He swears he saw nothing." style={{...box(0.9, 3.5, 6.4), fontFamily: HEAD, fontSize: 34 * PT, fontWeight: 800, color: C.white}} />
      <Reveal at={cue(n, 'convicted')} kind="wipe" style={{...box(0.9, 4.45, 3.9, 0.6), background: C.callout, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.3)'}}>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 20 * PT, color: C.white}}>Convicted of perjury</span></Reveal>
      <Reveal at={cue(n, 'could')} kind="up"><T x={0.9} y={5.3} w={6.6} size={30} color={C.light} weight={800} font={HEAD}>Could you miss something like that?</T></Reveal>
      <Note at={chase + 0.6} x={7.6} y={6.45} w={5.1} align="right" media text="Illustration based on Chabris et al. (2011); not to scale" />
      <Source n={n} media /><Brand media />
    </Stage>
  </>; };

// ===== 2 Opener: the original "try it yourself" counting test (unchanged)
export const S2 = () => <AbsoluteFill style={{background: C.primary}}><OffthreadVideo src={staticFile('opener.mp4')} muted style={{width: '100%', height: '100%'}} /></AbsoluteFill>;

// ===== 3 Cold open: 78% tile, parallax gorilla (idea 7), then 100 people with half fading (idea 5)
export const S3 = () => { const n = 3; const a78 = cue(n, 'seventy-eight'), act = cue(n, 'actual'), half = cue(n, 'half');
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      <Panel x={7.1} y={1.9} w={5.63} h={2.6} at={0.3} kind="focus" style={{overflow: 'hidden', padding: 0}}>
        <Parallax name="gorilla" dur={22} w={5.63} h={2.6} focus={[0.48, 0.35]} fgScale={1.0} /></Panel>
      <T x={7.1} y={4.53} w={5.63} size={10} italic color={C.secondary} align="right">Photo: Greg Gollin / Unsplash</T>
      <Panel x={0.6} y={1.9} w={6.2} h={1.9} at={a78 - 0.5} kind="left" accent={C.accent} />
      <CountUp at={a78} to={78} suffix="%" style={{...box(0.95, 2.06, 5.6), fontFamily: HEAD, fontWeight: 900, fontSize: 48 * PT, color: C.accent, letterSpacing: -1}} />
      <Reveal at={a78 + 0.3} kind="up"><T x={0.95} y={2.95} w={5.6} size={13} color={C.secondary}>in a national survey agreed people generally notice when something unexpected enters their field of view</T></Reveal>
      <Panel x={0.6} y={3.95} w={6.2} h={1.9} at={act} kind="left" accent={C.callout} />
      <CountUp at={half} to={50} prefix="~" suffix="%" style={{...box(0.95, 4.11, 5.6), fontFamily: HEAD, fontWeight: 900, fontSize: 48 * PT, color: C.callout, letterSpacing: -1}} />
      <Reveal at={act + 0.2} kind="up"><T x={0.95} y={5.0} w={5.6} size={13} color={C.secondary}>of observers missed a person in a gorilla suit walking through a ball-passing video</T></Reveal>
      <Reveal at={act} kind="fade"><T x={7.1} y={4.9} w={5.63} size={11} weight={700} color={C.secondary} style={{letterSpacing: 1}}>EVERY 100 VIEWERS</T></Reveal>
      <People x={7.1} y={5.2} w={5.63} n={100} cols={25} at={act + 0.1} stagger={1.0} dim={50} dimAt={half + 0.2} color={C.accent} gap={0.18} />
      <Note at={cueEnd(n, 'gorilla', 1)} x={0.6} y={6.25} w={6.3} text="Survey figure as reported in Simons's Noba chapter (citing Simons and Chabris, 2010). Figures show ~50%, rounded." />
      <Source n={n} /><Brand />
    </Stage>
  </>; };

// ===== 4 Title over crowd footage
export const S4 = () => <>
  <Footage src="s2_crowd.mp4" drift={0.06} />
  <Stage>
    <Words at={0.15} dur={1.0} text="Why you don't see what's right in front of you" style={{...box(0.9, 2.2, 11.5), fontFamily: HEAD, fontSize: 48 * PT, fontWeight: 900, color: C.white, lineHeight: 1.05, letterSpacing: -1}} />
    <Reveal at={cue(4, 'research') - 0.2} kind="up"><T x={0.9} y={4.05} w={11.5} size={22} color={C.rule}>Inattentional blindness: the basics, four studies, and a 2025 twist</T></Reveal>
    <Reveal at={cue(4, 'surprising')} kind="wipe" style={{...box(0.9, 5.88, 1.2, 0.04), background: C.callout}} />
    <Reveal at={cue(4, 'surprising') + 0.2} kind="up"><T x={0.9} y={6.0} w={4} size={14} color={C.white} weight={700}>Decked out Data</T></Reveal>
  </Stage>
</>;

// ===== 5 Four suspects
const THEORIES = ["You weren't looking at it", "Some people just don't notice", 'Attention filtered it out', '??????????'];
export const S5 = () => { const fr = useCurrentFrame(); const n = 5; const ats = [cue(n, 'one'), cue(n, 'two'), cue(n, 'three'), cue(n, 'four', 1)];
  return <>
    <PaperBg />
    <Stage>
      <Head n={n} />
      {THEORIES.map((t, i) => { const at = ats[i], y = 2.05 + i * 0.95, hidden = i === 3;
        const pulse = hidden && fr > f(at + 0.6) ? 0.55 + 0.45 * Math.abs(Math.sin((fr - f(at)) / 9)) : 1;
        return <React.Fragment key={i}>
          <Reveal at={at} kind="pop" style={{...box(0.6, y, 0.62, 0.62), borderRadius: '50%', background: C.callout, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(43,27,63,0.2)'}}>
            <span style={{fontFamily: HEAD, fontWeight: 900, fontSize: 22 * PT, color: C.white}}>{i + 1}</span></Reveal>
          <Reveal at={at + 0.08} kind="left"><T x={1.45} y={y + 0.08} w={9} size={22} weight={700} color={C.primary} style={{opacity: pulse, letterSpacing: hidden ? 4 : 0}}>{t}</T></Reveal>
        </React.Fragment>; })}
      <Pill x={8.6} y={5.55} w={3.4} text="SCORED AT THE END" at={cue(n, 'score')} />
      <Brand />
    </Stage>
  </>; };

// ===== chapter map (slides 6, 12, 16, 21, 25, 32)
export const MAP_ITEMS = ['The basics: attention as a filter', 'Experts: radiologists and a gorilla', 'The real world: a staged fight', 'Is it just some people?', 'The twist: did they really see nothing?', 'What this means for you'];
const scramble = (txt, p, fr) => { const k = Math.floor(txt.length * p); const G = '?#%&@*';
  return txt.slice(0, k) + txt.slice(k).split('').map((c, i) => c === ' ' ? ' ' : G[(i + Math.floor(fr / 2)) % G.length]).join(''); };
export const ChapterMap = ({n, video, current, hidden = true, rowAts, footnote, reveal}) => { const rh = 5.0 / 6, y0 = 1.7; const fr = useCurrentFrame();
  const rp = reveal != null ? prog(fr, reveal, 1.0, (x) => x) : 0;
  return <>
    {video ? <Footage src={video} /> : <AbsoluteFill style={{background: C.primary}} />}
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(30,20,48,0.78), rgba(30,20,48,0.35))'}} />
    <Stage>
      <Reveal at={0} kind="fade"><T x={0.9} y={0.8} w={11} size={16} color={C.light} weight={700} style={{letterSpacing: 1.5}}>WHAT WE'LL COVER</T></Reveal>
      {MAP_ITEMS.map((it0, i) => { const y = y0 + i * rh, on = i === current, done = i < current; const it = i === 4 && reveal != null ? (fr < f(reveal) ? '??????????' : scramble(it0, rp, fr)) : hidden && i === 4 ? '??????????' : it0;
        const at = rowAts ? rowAts[i] : 0.1 + i * 0.06;
        return <React.Fragment key={i}>
          {on && <Reveal at={rowAts ? at : 0.35} kind="wipe" style={{...box(0.8, y + 0.08, 0.75, rh - 0.16), background: C.callout}} />}
          <Reveal at={at} kind="left">
            <T x={0.8} y={y} w={0.75} h={rh} size={28} weight={800} font={HEAD} align="center" color={on ? C.white : done ? C.lineMedia : C.light} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</T>
            <T x={1.8} y={y} w={10.5} h={rh} size={on ? 30 : 24} weight={on ? 800 : 500} font={on ? HEAD : SANS} color={on ? C.white : done ? C.lineMedia : C.rule}
              style={{display: 'flex', alignItems: 'center', letterSpacing: it.startsWith('?') ? 4 : 0, textDecoration: done ? 'line-through' : 'none', textDecorationColor: 'rgba(168,155,184,0.6)'}}>{it}</T>
          </Reveal>
        </React.Fragment>; })}
      {footnote}
    </Stage>
  </>; };
export const S6 = () => { const n = 6; const tw = cueEnd(n, 'twist');
  return <ChapterMap n={n} video="s3_dusk.mp4" current={0} rowAts={[cue(n, 'basics'), cue(n, 'doctors'), cue(n, 'runners'), cue(n, 'question'), cue(n, 'twist'), tw + 0.9]} />; };
