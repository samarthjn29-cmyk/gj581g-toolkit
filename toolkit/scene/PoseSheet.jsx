// Rig test sheet: the character in every pose the scene uses (sampled from the core at key times), on a flat magenta
// ground, so rig_holes.py can find gaps where the background shows through the figure (seams at the neck, shoulder, knees).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Puppet2} from '../kit/Puppet2.jsx';
import WR from '../kit/librarian_rig.json';
import PL from '../pilot8_place.json';
import WORDS from '../pilot8_words.json';
import SPEC from './room.scene.json';
import {makeScene} from './core.mjs';
const SC = makeScene(SPEC, WORDS, {'kit/librarian_rig.json': WR}, PL), LIB = SC.character('librarian');
export const SAMPLE_T = [1.0, 1.2, 1.4, 1.6, LIB.at('look') + 0.6, LIB.at('grab'), LIB.at('lower') + 0.7, 7.1, 7.4, LIB.at('release'), LIB.at('rest') + 0.7, 2.0];
export const PoseSheet = () => <AbsoluteFill style={{background: '#ff00ff'}}>
  {SAMPLE_T.map((t, i) => { const s = LIB.state(t); return <Puppet2 key={i} pose={s.pose} offset={s.offset} x={160 + (i % 6) * 320} y={520 + Math.floor(i / 6) * 540} scale={0.26} hand={s.handShape} prop={s.held ? (W, layer) => layer === 'under' && <g transform={`matrix(${W.hand.join(',')})`}><rect x={6 - 75} y={-781 - 35} width={300} height={70} rx={20} fill="rgb(232,212,183)" stroke="#000" strokeWidth={9} /></g> : null} />; })}
</AbsoluteFill>;
