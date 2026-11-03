import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Rig} from './rig';
import {HECK} from './heckler';
import {C} from './bank';
const ANN = {skin: '#F1C7A4', hair: 'bob', hairColor: '#3A2A22', top: '#2E4A5E', bottom: '#2F3A48', shoe: '#2A2522'};
const BARB = {skin: '#8D5B3E', hair: 'curly', hairColor: '#1E1A18', top: '#C4623F', bottom: '#2F3A48', shoe: '#2A2522'};
const SAM = {skin: '#A86F4C', hair: 'short', hairColor: '#17110E', top: C.green, bottom: '#3E3A36', shoe: '#2A2522'};
const cast = [['Ann', ANN, 'smug'], ['Barbara', BARB, 'happy'], ['Cousin Sam', SAM, 'smile'], ['The Heckler', HECK, 'impatient']];
export const Lineup = () => <AbsoluteFill style={{background: C.ground, fontFamily: 'Oswald, sans-serif'}}>
  <svg width={1920} height={1080}>{cast.map(([n, l, f], i) => <Rig key={n} x={300 + i * 440} y={930} s={1.15} look={l} face={f} pose={{}} />)}</svg>
  {cast.map(([n], i) => <div key={n} style={{position: 'absolute', left: 300 + i * 440 - 200, width: 400, top: 970, textAlign: 'center', fontSize: 40, color: C.ink, letterSpacing: 2}}>{n.toUpperCase()}</div>)}
</AbsoluteFill>;
