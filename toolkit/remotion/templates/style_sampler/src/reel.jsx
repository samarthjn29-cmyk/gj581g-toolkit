// Style sampler reel: a card naming each style, then its 15 s demo of the same beat.
import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {LEN, useT, ramp} from './common';
import {Kinetic} from './s10_kinetic';
import {Whiteboard} from './s3_whiteboard';
import {Cutout} from './s11_cutout';
import {DataMorph} from './s12_datamorph';
import {Board} from './s2_board';
import {Screen} from './s13_screen';
import {Diorama} from './s14_diorama';

export const STYLES = [
  ['S2', 'Investigation board', 'Several studies or clues that connect; mysteries; "what really happened"', Board],
  ['S3', 'Whiteboard draw-on', 'Mechanisms and step-by-step logic; maths made friendly', Whiteboard],
  ['S10', 'Kinetic type', 'Punchy opinion, hooks, quotes, short-form clips', Kinetic],
  ['S11', 'Paper cut-out', 'Everyday money and life scenarios; warm, tactile stories', Cutout],
  ['S12', 'Data morph', 'One key number or comparison the viewer must feel', DataMorph],
  ['S13', 'Screen story', 'AI, apps, money and work topics people live on their phones', Screen],
  ['S14', 'Isometric diorama', 'Systems with places and flows: cities, markets, supply chains', Diorama],
];
export const CARD = 66;
const Card = ({id, name, best, n}) => { const t = useT(); const p = ramp(t, 0.05, 0.4), q = ramp(t, 0.35, 0.4);
  return <AbsoluteFill style={{background: '#14161A', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif"}}>
    <div style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`, textAlign: 'center'}}>
      <div style={{color: '#8A919C', fontSize: 30, fontWeight: 700, letterSpacing: 8}}>STYLE {n} OF 7 · {id}</div>
      <div style={{color: '#F4F1EA', fontSize: 110, fontWeight: 900, letterSpacing: -3, marginTop: 10}}>{name}</div>
      <div style={{color: '#FFD23F', fontSize: 36, fontWeight: 500, marginTop: 18, opacity: q}}>Best for: {best}</div></div></AbsoluteFill>; };
export const REEL = STYLES.length * (CARD + LEN);
export const Reel = () => <Series>{STYLES.map(([id, name, best, C], i) => <React.Fragment key={id}>
  <Series.Sequence durationInFrames={CARD}><Card id={id} name={name} best={best} n={i + 1} /></Series.Sequence>
  <Series.Sequence durationInFrames={LEN}><C /></Series.Sequence></React.Fragment>)}</Series>;
