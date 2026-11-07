// Set D, version C (7 Nov 2026 comparison): Adobe Firefly generation (Image 3, seed 85342), vectorised with vtracer
// (coast.svg kept), rendered back at 3840 px and split into two depth layers (back with the lake, near with the trees
// and banks, the gap behind the near layer inpainted). We add the moving water, the sun glow and the freed prisoner.
import React from 'react';
import {AbsoluteFill, Img, staticFile, random} from 'remotion';
import {Layer, Glow, Figure, POSE, toScreen} from './vw.jsx';

const W = 5760, H = 3292, WL = 2033, WB = 2940;       // world size, waterline, lowest visible water
export const SUN_AI = {x: 1427, y: 1295};
const PB = 0.96, PN = 1.06;

// the back layer, with its lake band cut into strips that sway sideways: a ripple on the AI reflection
const Back = ({t}) => { const n = 26;
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H}}>
    <Img src={staticFile('cave/ai_back.png')} style={{position: 'absolute', left: 0, top: 0, width: W}} />
    {Array.from({length: n}, (_, i) => { const y0 = WL + 8 + (WB - WL) * Math.pow(i / n, 1.3), y1 = WL + 8 + (WB - WL) * Math.pow((i + 1) / n, 1.3);
      const dx = Math.sin(t * 1.5 + i * 1.7) * (3 + 14 * i / n);
      return <div key={i} style={{position: 'absolute', left: 0, top: y0, width: W, height: y1 - y0 + 1, overflow: 'hidden'}}>
        <Img src={staticFile('cave/ai_back.png')} style={{position: 'absolute', left: dx, top: -y0, width: W}} /></div>; })}
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: 30}, (_, i) => { const r = (k) => random(`ag${i}${k}`); const y = WL + 45 + Math.pow(r(1), 1.4) * 780;
        const w = (60 + r(2) * 210) * (0.6 + (y - WL) / 750), x = SUN_AI.x + (r(3) - 0.5) * (120 + (y - WL) * 0.6) + Math.sin(t * 1.3 + i) * 18;
        return <rect key={i} x={x - w / 2} y={y} width={w} height={4 + (y - WL) / 140} rx={3} fill="#FFF6E2" opacity={(0.3 + 0.45 * Math.abs(Math.sin(t * 2 + i * 1.9))) * (1 - (y - WL) / 1050)} />; })}
    </svg></div>; };

export const AiLakeSet = ({t, cam, sun = 0, white = 0}) => { const ss = toScreen(cam, SUN_AI.x, SUN_AI.y, PB);
  return <AbsoluteFill style={{background: '#D9876A', overflow: 'hidden'}}>
    <Layer cam={cam} p={PB}><Back t={t} /></Layer>
    <Layer cam={cam} p={PN}><div style={{position: 'absolute', left: 0, top: 0, width: W, height: H}}>
      <Img src={staticFile('cave/ai_near.png')} style={{position: 'absolute', left: 0, top: 0, width: W}} />
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <Figure x={4350} y={2868} s={1.2} pose={POSE.slump} rim="#F7D4A8" rimDx={-4} fill="#0E1426" flip />
      </svg></div></Layer>
    <Glow x={ss.x} y={ss.y} r={(260 + sun * 900) * cam.z} color="#FFF3D6" a={0.5 + sun * 0.5} />
    <Glow x={ss.x} y={ss.y} r={(120 + sun * 260) * cam.z} color="#FFFFFF" a={0.55 + sun * 0.45} />
    <AbsoluteFill style={{background: '#FFF8EA', opacity: white}} />
  </AbsoluteFill>; };

// camera keys for this world (its hero, bank and sun sit in different places from the stock picture)
export const aiCam = (t, c2, s1, s2, s3) => [{t: c2 + 0.3, x: 4000, y: 2350, z: 0.62}, {t: s1 - 0.4, x: 3800, y: 2290, z: 0.56}, {t: s1 + 0.9, x: 2880, y: 2000, z: 0.43},
  {t: s2 - 0.2, x: 2880, y: 1960, z: 0.43}, {t: s2 + 1.2, x: 2880, y: 1520, z: 0.46}, {t: s3 - 0.2, x: 2500, y: 1450, z: 0.44}, {t: s3 + 1.0, x: 1680, y: 1320, z: 0.62}];
