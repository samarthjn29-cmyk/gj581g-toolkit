// The villa set (8 Nov 2026): the Villa of the Papyri on the Bay of Naples, Vesuvius (one peak, before 79 AD) behind it.
// Built once, used in every state the continuity sheet lists: 'day' (lib1-lib3), 'eruption' (lib14-lib15), 'buried' (lib16),
// 'today' (rd20-rd21), 'dawn' (end). Art: Recraft V4.1 vector on the paid plan (far sky + mountain, the villa); land, sea,
// ash, surge, rock and modern ground are drawn here so every state shares one layout.
import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, Easing} from 'remotion';

export const VW = 5760, VH = 2880, HZ = 1787;                     // plate size and the horizon (sea line) in plate px
const VILLA = {x: 250, w: 3300, h: Math.round(1257 * 3300 / 5641)}; VILLA.y = HZ + 90 - VILLA.h;   // its sea wall stands in the water
export const PXM_V = VILLA.h / 15;                                    // the villa front is about 15 m tall: plate px per metre
const PEAK = [4848, 912];
const ez = Easing.bezier(0.45, 0, 0.25, 1);
const R = (t, a, b, f = 0, to = 1) => interpolate(t, [a, b], [f, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ez});
const L = ({cam, p = 1, children}) => { const s = 0.5 * Math.pow(cam.z, p);   // a parallax layer of the plate
  return <div style={{position: 'absolute', left: 960 - cam.x * s, top: 540 - cam.y * s, width: VW, height: VH, transformOrigin: '0 0', transform: `scale(${s})`}}>{children}</div>; };
const svg = (children) => <svg width={VW} height={VH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>{children}</svg>;
// rock depth: "more than twenty metres" (lib16); the new ground stands 20 m above the villa's old ground
const OLD_GROUND = HZ + 90, NEW_GROUND = OLD_GROUND - 20 * PXM_V;

export const Villa = ({cam, state = 'day', u = 1}) => {   // u: progress through the state's own motion (0..1)
  const erupt = state === 'eruption', buried = state === 'buried' || state === 'today', today = state === 'today', dawn = state === 'dawn';
  const plume = erupt ? R(u, 0, 0.5) : 0, surge = erupt ? R(u, 0.45, 1) : 0, rock = buried ? 1 : 0;
  const land = `M0,${HZ} L0,${HZ - 150} C900,${HZ - 210} 2200,${HZ - 240} 3300,${HZ - 270} C3700,${HZ - 260} 3950,${HZ - 90} 4250,${HZ} Z`;
  return <AbsoluteFill style={{background: '#9cc3dd', overflow: 'hidden'}}>
    <L cam={cam} p={0.9}><div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${buried ? NEW_GROUND + 60 - HZ : 0}px)`}}><Img src={staticFile('scrolls/villa/far.png')} style={{position: 'absolute', left: 0, top: 0, width: VW, height: HZ}} /></div>
      {(erupt || dawn) && <div style={{position: 'absolute', left: 0, top: 0, width: VW, height: HZ, mixBlendMode: 'multiply', background: erupt ? `rgba(120,70,60,${0.25 + 0.5 * plume})` : 'rgba(255,170,110,0.45)'}} />}
      {erupt && <Img src={staticFile('scrolls/villa/column.png')} style={{position: 'absolute', left: PEAK[0] - 780 * 0.9, top: PEAK[1] + 30 - 2400 * 0.9 * plume, width: 1560 * 0.9, height: 2400 * 0.9 * plume, opacity: Math.min(1, plume * 3)}} />}
    </L>
    <L cam={cam} p={0.95}>{svg(<g><path d={land} fill={erupt ? '#5d5a48' : '#7c8656'} stroke="#000" strokeWidth={6} />
</g>)}
      {erupt && surge > 0 && <Img src={staticFile('scrolls/villa/surge.png')} style={{position: 'absolute', left: 4300 - 3900 * surge, top: HZ - 1100 * 0.8, width: 3000 * 0.8, height: 1500 * 0.8, opacity: Math.min(1, surge * 4)}} />}</L>
    {!buried && <L cam={cam} p={1}>{svg(<g><rect x={-2000} y={HZ} width={VW + 4000} height={VH} fill={erupt ? '#2c4a63' : dawn ? '#3a5f86' : '#245d93'} />
      {Array.from({length: 9}, (_, i) => <line key={i} x1={-2000} x2={VW + 2000} y1={HZ + 160 + i * 120} y2={HZ + 160 + i * 120} stroke="#2f72ad" strokeWidth={5} />)}</g>)}</L>}
    <L cam={cam} p={1}>
      <Img src={staticFile('scrolls/villa/villa.png')} style={{position: 'absolute', left: VILLA.x, top: VILLA.y, width: VILLA.w, height: VILLA.h, filter: erupt ? `brightness(${1 - 0.35 * plume}) sepia(${0.3 * plume})` : dawn ? 'sepia(0.25) saturate(1.2)' : undefined}} />
      {rock > 0 && svg(<g>
        {/* the rock that buried it: grey-brown bands from the old ground up to the new ground, and out over the old shore */}
        <path d={`M0,${NEW_GROUND} L${VW},${NEW_GROUND + 40} L${VW},${VH} L0,${VH} Z`} fill="#7a6e63" stroke="#000" strokeWidth={6} opacity={0.94} />
        {[0.18, 0.36, 0.55, 0.74].map((f, i) => <path key={i} d={`M0,${NEW_GROUND + f * (OLD_GROUND - NEW_GROUND) + 30 * Math.sin(i)} C1900,${NEW_GROUND + f * (OLD_GROUND - NEW_GROUND) - 40} 3800,${NEW_GROUND + f * (OLD_GROUND - NEW_GROUND) + 50} ${VW},${NEW_GROUND + f * (OLD_GROUND - NEW_GROUND) + 20}`} fill="none" stroke="#5f554c" strokeWidth={10} />)}
        {/* the villa still inside it, seen in section */}
        <rect x={VILLA.x} y={VILLA.y} width={VILLA.w} height={VILLA.h} fill="none" stroke="#F2B85A" strokeWidth={8} strokeDasharray="30 18" />
        {/* scale: 20 m */}
        <g transform={`translate(${VILLA.x + VILLA.w + 220} 0)`}><line x1={0} x2={0} y1={NEW_GROUND} y2={OLD_GROUND} stroke="#F4E6C8" strokeWidth={10} />
          <line x1={-40} x2={40} y1={NEW_GROUND} y2={NEW_GROUND} stroke="#F4E6C8" strokeWidth={10} /><line x1={-40} x2={40} y1={OLD_GROUND} y2={OLD_GROUND} stroke="#F4E6C8" strokeWidth={10} />
          <text x={60} y={(NEW_GROUND + OLD_GROUND) / 2 + 30} fontFamily="monospace" fontSize={90} fill="#F4E6C8">20 m</text></g>
        {today && <g>{/* modern ground: fields and a town on top; one trench reaches part of the villa, the rest is still under the rock */}
          <path d={`M0,${NEW_GROUND} L${VW},${NEW_GROUND + 40} L${VW},${NEW_GROUND + 110} L0,${NEW_GROUND + 70} Z`} fill="#7c8656" stroke="#000" strokeWidth={6} />
          {Array.from({length: 14}, (_, i) => { const x = 2600 + i * 230, w = 160 + (i % 3) * 40, h = 140 + (i % 4) * 50; return <rect key={i} x={x} y={NEW_GROUND + 40 * (x + w / 2) / VW - h + 4} width={w} height={h} fill={i % 2 ? '#e8dcc6' : '#d9c3a1'} stroke="#000" strokeWidth={6} />; })}
          <path d={`M${VILLA.x + 300},${NEW_GROUND + 50} L${VILLA.x + 420},${VILLA.y + 260} L${VILLA.x + 1250},${VILLA.y + 260} L${VILLA.x + 1380},${NEW_GROUND + 60} Z`} fill="#3b342e" stroke="#000" strokeWidth={6} opacity={0.85} />
        </g>}
      </g>)}
    </L>

  </AbsoluteFill>; };
