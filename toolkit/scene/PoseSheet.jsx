// Rig test sheet: the character in every pose the scene uses (sampled from the core at key times), on a flat magenta
// ground, so rig_holes.py can find gaps where the background shows through the figure (seams at the neck, shoulder, knees).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Puppet} from '../puppet.jsx';
import WR from '../walker_rig8.json';
import PL from '../pilot8_place.json';
import WORDS from '../pilot8_words.json';
import SPEC from './room.scene.json';
import {makeScene} from './core.mjs';
const SC = makeScene(SPEC, WORDS, {'walker_rig8.json': WR}, PL), LIB = SC.character('librarian');
export const SAMPLE_T = [1.0, 1.2, 1.4, 1.6, LIB.at('look') + 0.6, LIB.at('grab'), LIB.at('lower') + 0.7, 7.1, 7.4, LIB.at('release'), LIB.at('rest') + 0.7, 2.0];
export const CAPS = SPEC.characters[0].caps.map((c) => ({...c, fill: SPEC.palette[c.fill] || c.fill}));
export const PoseSheet = () => <AbsoluteFill style={{background: '#ff00ff'}}>
  {SAMPLE_T.map((t, i) => { const s = LIB.state(t); return <Puppet key={i} rig={WR} dir="scrolls/pilot6/walker_parts2" pose={s.pose} offset={s.offset}
    x={160 + (i % 6) * 320} y={520 + Math.floor(i / 6) * 540} scale={0.3} anchor={[520, 1523]} caps={CAPS} />; })}
</AbsoluteFill>;
