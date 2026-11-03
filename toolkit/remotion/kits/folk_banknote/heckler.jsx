// The Heckler (Dollar Yardstick, from video 2): Folk character design sheet + an in-frame mock (3 Nov 2026).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Ground, Grain, NoteFrame, C, OS, FR, IN} from './bank';
import {Rig} from './rig';

export const HECK = {skin: '#C98B62', hair: 'bun', hairColor: '#2B1E1A', top: C.gold, bottom: '#2F3A48', shoe: '#2A2522', earrings: '#E7C46A'};

// waist-up moods: face, mouth (Rhubarb shape or X), pose
export const MOODS = [
  ['impatient', 'Just tell me if I\'m poorer.', 'X', {fa: 24, fb: 70, ba: 24, bb: 70, tilt: -4}],
  ['pushy', 'Get there faster!', 'D', {fa: 150, fb: 15, ba: 10, bb: 10, tilt: 3, lean: 3}],
  ['deflated', 'Well. That\'s bloody depressing.', 'X', {fa: 3, fb: 4, ba: 3, bb: 4, tilt: 9, lean: 5}],
  ['exasperated', 'Oh, great! More rulers!', 'D', {fa: 150, fb: 30, ba: 150, bb: 30, tilt: -3}],
  ['groan', 'Christ.', 'X', {fa: 140, fb: 120, ba: 6, bb: 8, tilt: 10}],
  ['envious', 'Nine percent? Lucky sod!', 'X', {fa: 30, fb: 95, ba: 10, bb: 20, tilt: -7}],
  ['warm', 'Alright. That was actually useful.', 'X', {fa: 60, fb: 75, ba: 8, bb: 10, tilt: 5}],
];

const Bust = ({w, h, mood, bg}) => { const [face, , mouth, pose] = mood;
  return <svg width={w} height={h} viewBox="-215 -665 430 348" style={{display: 'block', background: bg}}>
    <Rig x={0} y={0} s={1} look={HECK} face={face} mouth={mouth} pose={pose} />
  </svg>; };

export const HecklerSheet = () => <AbsoluteFill style={{background: C.ground, fontFamily: IN}}>
  <div style={{position: 'absolute', left: 70, top: 46, fontFamily: FR, fontWeight: 700, fontSize: 64, color: C.green}}>The Heckler</div>
  <div style={{position: 'absolute', left: 74, top: 128, fontSize: 26, color: '#5A544A', width: 1700}}>Folk style, next to Ann and Barbara: hair in a bun, mustard-gold jumper, gold hoops. Her face and pose follow the mood tag on each line.</div>
  <div style={{position: 'absolute', left: 70, top: 190, display: 'grid', gridTemplateColumns: 'repeat(4, 420px)', gap: 26}}>
    {MOODS.map((m, i) => <div key={i} style={{background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px #0002'}}>
      <Bust w={420} h={340} mood={m} bg={i % 2 ? '#E7DFC9' : '#EAE3D0'} />
      <div style={{padding: '8px 16px 12px'}}>
        <div style={{fontFamily: OS, fontWeight: 700, fontSize: 26, color: C.ox, textTransform: 'uppercase', letterSpacing: 1}}>{m[0]}</div>
        <div style={{fontSize: 19, color: '#333', marginTop: 2}}>"{m[1]}"</div></div></div>)}
    <div style={{background: C.green, borderRadius: 14, padding: 28, color: C.paper, fontSize: 21, lineHeight: 1.45}}>
      <div style={{fontFamily: OS, fontSize: 28, letterSpacing: 1, marginBottom: 8}}>HOW SHE APPEARS</div>
      Pops up from the lower-left edge, says her line with her mouth synced, then ducks back down.<br />Never covers a chart, a number or the captions.</div>
  </div>
</AbsoluteFill>;

// in-frame mock: a chart scene with her popping up lower left
export const HecklerFrame = () => { const bars = [100, 92, 81, 70, 63, 55];
  return <AbsoluteFill style={{background: C.ground, fontFamily: IN}}>
    <Ground />
    <svg width="1920" height="1080" style={{position: 'absolute'}}>
      <NoteFrame x={560} y={90} w={1260} h={760} />
      <text x={1190} y={190} textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="44" fill={C.green} letterSpacing="2">ONE SALARY, MEASURED IN DOLLARS</text>
      {bars.map((b, i) => <g key={i}><rect x={700 + i * 175} y={740 - b * 4.6} width={110} height={b * 4.6} fill={i === 5 ? C.ox : C.green} opacity={i === 5 ? 1 : 0.85} />
        <text x={755 + i * 175} y={780} textAnchor="middle" fontFamily={OS} fontSize="28" fill={C.ink}>{2010 + i * 3}</text></g>)}
      <text x={1190} y={250} textAnchor="middle" fontFamily={IN} fontSize="22" fill={C.mute}>Illustrative mock-up, not data</text>
      {/* the heckler: pops up from the bottom-left edge */}
      <Rig x={250} y={1450} s={1.55} look={HECK} face="exasperated" mouth="D" pose={{fa: 150, fb: 30, ba: 150, bb: 30, tilt: -3}} />
    </svg>
    {/* no caption or bubble while the Heckler speaks (Sam, 3 Nov 2026) */}
    <Grain />
  </AbsoluteFill>; };
