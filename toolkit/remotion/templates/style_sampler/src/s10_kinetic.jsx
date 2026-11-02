// S10 Kinetic type: the narration's key words are the picture. Big grotesk type, one accent, hard cuts and slams.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useT, s, e, tw, ramp, back, Narr, Sfx, Caps} from './common';

const BG = '#121212', FG = '#F4F1EA', Y = '#FFD23F', R = '#FF5A4E', G = '#8A8A8A', F = "'Inter', sans-serif";
const W = ({children, style}) => <div style={{position: 'absolute', fontFamily: F, fontWeight: 900, letterSpacing: -4, lineHeight: 0.9, whiteSpace: 'nowrap', ...style}}>{children}</div>;
const slam = (t, a) => { const p = back(t, a, 0.3); return {opacity: Math.min(1, p * 3), transform: `scale(${2.2 - 1.2 * p})`}; };
const slideX = (t, a, from) => { const p = ramp(t, a, 0.35); return {opacity: p, transform: `translateX(${(1 - p) * from}px)`}; };
const shake = (t, a) => t > a && t < a + 0.35 ? Math.sin((t - a) * 90) * 10 * (1 - (t - a) / 0.35) : 0;

export const Kinetic = () => { const t = useT();
  const ph = t < s('p3') - 0.1 ? 'A' : t < s('p4') - 0.1 ? 'B' : t < s('p6') - 0.1 ? 'C' : t < s('p7') - 0.05 ? 'D' : 'E';
  return <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
    <Narr />
    <Sfx at={tw('p1', 'two')} name="stamp" vol={0.35} /><Sfx at={tw('p2', 'five')} name="stamp" vol={0.35} />
    <Sfx at={tw('p4', 'four')} name="stamp" vol={0.45} /><Sfx at={tw('p6', 'one')} name="ding" vol={0.3} />
    {ph === 'A' && <>
      <W style={{left: 140, top: 170, fontSize: 150, color: FG, ...slideX(t, s('p1'), -300)}}>ANN</W>
      <W style={{left: 120, top: 340, fontSize: 250, color: Y, transformOrigin: 'left center', ...slam(t, tw('p1', 'two'))}}>+2%</W>
      <W style={{left: 150, top: 640, fontSize: 64, color: G, letterSpacing: 6, fontWeight: 700, ...slideX(t, tw('p1', 'raise'), -80)}}>RAISE</W>
      <W style={{right: 140, top: 170, fontSize: 150, color: FG, textAlign: 'right', ...slideX(t, s('p2'), 300)}}>BARBARA</W>
      <W style={{right: 120, top: 330, fontSize: 300, color: Y, transformOrigin: 'right center', ...slam(t, tw('p2', 'five'))}}>+5%</W>
    </>}
    {ph === 'B' && ['WHO\'S', 'BETTER', 'OFF?'].map((w, i) => { const a = tw('p3', ['who', 'better', 'off'][i]);
      return <W key={w} style={{left: 0, right: 0, textAlign: 'center', top: 150 + i * 240, fontSize: 250, color: i === 2 ? Y : FG, ...slam(t, a)}}>{w}</W>; })}
    {ph === 'C' && <>
      <W style={{left: 140, top: 140, fontSize: 96, color: FG, ...slideX(t, s('p4'), -200)}}>BARBARA'S PRICES</W>
      <W style={{left: 120, top: 250, fontSize: 340, color: R, transformOrigin: 'left center', ...slam(t, tw('p4', 'four')), marginLeft: shake(t, tw('p4', 'four'))}}>+4%</W>
      <W style={{left: 140, top: 640, fontSize: 96, color: FG, ...slideX(t, s('p5'), -200)}}>ANN'S PRICES</W>
      <W style={{left: 900, top: 600, fontSize: 200, color: G, transformOrigin: 'left center', ...slam(t, tw('p5', 'move'))}}>0%</W>
    </>}
    {ph === 'D' && <>
      <W style={{left: 0, right: 0, textAlign: 'center', top: 150, fontSize: 90, color: FG, ...slideX(t, s('p6'), 0)}}>BARBARA, REALLY</W>
      {['5', '−', '4', '=', '1%'].map((g, i) => { const a = s('p6') + 0.15 + i * 0.22; const last = i === 4;
        return <W key={i} style={{left: 160 + i * 290, top: 330, fontSize: last ? 330 : 280, color: last ? Y : FG, width: last ? 520 : 290, textAlign: 'center', ...slam(t, last ? tw('p6', 'one') : a)}}>{g}</W>; })}
    </>}
    {ph === 'E' && <>
      <W style={{left: 140, top: 160, fontSize: 120, color: FG, ...slideX(t, s('p7'), -200)}}>ANN</W>
      <W style={{left: 120, top: 280, fontSize: 420, color: Y, transformOrigin: 'left center', ...slam(t, tw('p7', 'two'))}}>2%</W>
      <W style={{right: 160, top: 420, fontSize: 70, color: G, textAlign: 'right', opacity: ramp(t, s('p7'))}}>BARBARA</W>
      <W style={{right: 160, top: 500, fontSize: 200, color: G, textAlign: 'right', opacity: ramp(t, s('p7'))}}>1%</W>
    </>}
    <Caps />
  </AbsoluteFill>; };
