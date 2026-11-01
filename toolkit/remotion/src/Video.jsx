// Full timeline: one Sequence per slide (start/dur from slides.json), 0.5 s crossfades, that slide's narration clip
// from +0.2 s, grain on top, captions in the band below the stage. Scenes: scenes_gen.jsx (written by gen_scenes.py)
// overridden by scenes_custom.jsx (hand-written S<n> components win).
import React from 'react';
import {AbsoluteFill, Sequence, Audio, staticFile} from 'remotion';
import {C, f, FadeIn, Grain} from './lib';
import SLIDES from './data/slides.json';
import {Captions} from './captions';
import * as GEN from './scenes_gen';
import * as CUSTOM from './scenes_custom';
const REG = {...GEN, ...CUSTOM};
const Missing = ({n}) => <AbsoluteFill style={{background: C.primary, color: '#fff', fontSize: 60, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>Slide {n}</AbsoluteFill>;

export const TOTAL = SLIDES[SLIDES.length - 1].start + SLIDES[SLIDES.length - 1].dur;
export const Video = ({grain = true}) => <AbsoluteFill style={{background: C.primary}}>
  {SLIDES.map((d, i) => { const Comp = REG[`S${d.n}`]; const last = i === SLIDES.length - 1;
    return <Sequence key={d.n} from={f(d.start)} durationInFrames={f(d.dur + (last ? 0 : 0.5))} name={`Slide ${d.n}`}>
      <FadeIn skip={i === 0}>{Comp ? <Comp /> : <Missing n={d.n} />}</FadeIn>
      <Sequence from={f(0.2)}><Audio src={staticFile(`vo/VO-${String(d.n).padStart(2, '0')}.mp3`)} /></Sequence>
    </Sequence>; })}
  {grain && <Grain opacity={0.055} />}
  <Captions />
</AbsoluteFill>;
