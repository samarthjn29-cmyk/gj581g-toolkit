// Plato's Cave: 60-second vector-world pilot (7 Nov 2026). Three sets: the cave seen from the side (our own drawing over
// Adobe Stock rock bands), the prisoners' view of the wall, the cave mouth and the lake outside (Adobe Stock, recoloured).
import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, random} from 'remotion';
import {FPS, useT, ramp, camAt, Layer, toScreen, flick, Glow, Dark, Grain, Vignette, Motes, Chapter, Lexicon, Badge, Kind, DateTag, Figure, POSE, Back, SR, SI, MO, IN} from './vw.jsx';
import timing from '../data/cave_timing.json';

const LN = Object.fromEntries(timing.lines.map((l) => [l.id, l]));
const ts = (id) => LN[id].start, te = (id) => LN[id].end;
const tw = (id, word, k = 0) => { const w = LN[id].words.filter((x) => x[0].replace(/[^a-z0-9']/g, '') === word.toLowerCase()); return (w[k] || w[0] || [0, LN[id].start])[1]; };
const SCENES = [['wall', 'wall1'], ['climb', 'climb1'], ['return', 'return1'], ['end', 'end1']];
const sceneStart = (i) => (i === 0 ? 0 : ts(SCENES[i][1]) - (i === 2 ? 0.05 : 0.25));
export const CAVE_DUR = Math.ceil((timing.total) * FPS);

const EMB = '#E39A3A', GOLD = '#F2B85A', CREAM = '#FBE3B0';
const sil = <filter id="sil"><feColorMatrix type="matrix" values="0 0 0 0 0.07  0 0 0 0 0.045  0 0 0 0 0.035  0 0 0 1 0" /></filter>;

// ---------- the fire (animated flames + light)
const Flames = ({x, y, s = 1, t, heat = 1}) => {
  const tongue = (k, w, h, c) => {
    const tip = [Math.sin(t * 5.3 + k) * w * 0.35, -h * (1 + 0.12 * Math.sin(t * 8.7 + k * 1.7))], bend = Math.sin(t * 3.1 + k) * w * 0.3;
    const d = `M${-w},0 C${-w},${-h * 0.35} ${tip[0] - w * 0.25 + bend},${tip[1] * 0.6} ${tip[0]},${tip[1]} C${tip[0] + w * 0.25 + bend},${tip[1] * 0.6} ${w},${-h * 0.35} ${w},0 Q0,${w * 0.5} ${-w},0 Z`;
return <path d={d} fill={c} />; };
  const f = flick(t, 3, 0.1) * heat;
  return <g transform={`translate(${x},${y}) scale(${s * f}, ${s * (0.9 + 0.1 * f)})`}>
    {tongue(0, 95, 260, '#8C3320')}{tongue(1.7, 80, 230, '#C25E36')}{tongue(3.1, 62, 190, EMB)}{tongue(4.4, 42, 140, GOLD)}{tongue(5.9, 24, 90, CREAM)}
    <g transform="translate(-60,-30) rotate(-25)">{tongue(7, 30, 120, '#C25E36')}</g><g transform="translate(64,-24) rotate(22)">{tongue(8.3, 28, 110, EMB)}</g></g>;
};
const Logs = ({x, y}) => <g transform={`translate(${x},${y})`} fill="#1A110D"><ellipse cx={0} cy={6} rx={150} ry={22} fill="#0E0907" />
  <rect x={-120} y={-18} width={240} height={30} rx={14} transform="rotate(-10)" /><rect x={-120} y={-18} width={240} height={30} rx={14} transform="rotate(12)" fill="#241712" />
  {[-80, -20, 50, 100].map((u, i) => <circle key={i} cx={u} cy={-4 + (i % 2) * 6} r={9} fill="#C25E36" opacity={0.8} />)}</g>;

// ---------- set A: the cave from the side (world coords; floor at y 1190)
const FIRE = {x: 1700, y: 1150}, EXIT = {x: 380, y: 360}, WALLX = 4300;
const rock = (seed, n, x0, y0, w, h, c) => Array.from({length: n}, (_, i) => { const r = (k) => random(`${seed}${i}${k}`);
  const cx = x0 + r(1) * w, cy = y0 + r(2) * h, rx = 160 + r(3) * 360, ry = 30 + r(4) * 90;
  return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={c} opacity={0.1 + r(5) * 0.16} transform={`rotate(${r(6) * 24 - 12} ${cx} ${cy})`} style={{filter: 'blur(18px)'}} />; });
const PATH = [[1420, 1200], [1150, 1150], [1020, 1090], [930, 1000], [820, 930], [760, 840], [640, 770], [590, 680], [480, 600], [440, 520], [360, 470], [300, 400], [200, 380], [120, 1250], [1420, 1250]];
const OPEN = 'M150,250 C190,170 300,150 380,190 C450,150 560,200 590,280 C620,350 580,430 520,470 C470,520 360,540 290,500 C220,470 140,420 130,340 Z';
const pathPt = (u) => { const a = [[1250, 1170], [1020, 1085], [880, 960], [720, 820], [570, 668], [430, 515], [320, 410]]; const f = u * (a.length - 1), i = Math.min(a.length - 2, Math.floor(f)), v = f - i;
  return [a[i][0] + (a[i + 1][0] - a[i][0]) * v, a[i][1] + (a[i + 1][1] - a[i][1]) * v]; };
const PRISONERS = [[2900, 1190, 0.92], [3110, 1192, 0.95], [3330, 1188, 0.93], [3550, 1191, 0.96]];
const OBJ = [['horse_flat.svg', 2060], ['amphora_flat.svg', 2230]];

const SideSet = ({t, cam, heat = 1, dim = 0, freed = null, objT = 0, laugh = 0, red = 0}) => {
  const f = flick(t, 1, 0.1) * heat; const fs = toScreen(cam, FIRE.x, FIRE.y - 120), es = toScreen(cam, EXIT.x, EXIT.y, 0.92);
  const fireCol = red > 0 ? `rgb(${227},${Math.round(154 - 70 * red)},${Math.round(58 - 20 * red)})` : EMB;
  return <AbsoluteFill style={{background: '#0B0807', overflow: 'hidden'}}>
    {/* far: back wall of the cave and the ceiling */}
    <Layer cam={cam} p={0.86}><svg width={6200} height={1700} style={{overflow: 'visible'}}>
      <defs><linearGradient id="bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#140E0B" /><stop offset="0.7" stopColor="#21170F" /><stop offset="1" stopColor="#120C09" /></linearGradient>
        <radialGradient id="day" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFF6E2" /><stop offset="0.6" stopColor="#F6D9A0" /><stop offset="1" stopColor="#E9B66A" /></radialGradient></defs>
      <rect x={-600} y={-300} width={7000} height={2200} fill="url(#bw)" />
      {rock('bw', 26, -400, 100, 6400, 1000, '#2A1D17')}
      <path d={OPEN} fill="url(#day)" />
    </svg></Layer>
    <Layer cam={cam} p={0.9}>{[0, 1, 2].map((i) => <Img key={i} src={staticFile('cave/ceiling_ember.png')} style={{position: 'absolute', left: -500 + i * 2300, top: -90, width: 2304, filter: 'brightness(0.55)'}} />)}</Layer>
    {/* floor band */}
    <Layer cam={cam} p={1}>{[0, 1].map((i) => <Img key={i} src={staticFile('cave/floor_ember.png')} style={{position: 'absolute', left: 1000 + i * 3070, top: 1150, width: 3072, filter: 'brightness(0.38) saturate(0.8)'}} />)}</Layer>
    {/* main plane */}
    <Layer cam={cam} p={1}><svg width={6000} height={1600} style={{overflow: 'visible'}}>
      <defs>{sil}<linearGradient id="wl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6A4C38" /><stop offset="1" stopColor="#2A1D17" /></linearGradient>
        <linearGradient id="pa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5E4535" /><stop offset="1" stopColor="#271C17" /></linearGradient></defs>
      {/* the path up to daylight */}
      <polygon points={PATH.map((p) => p.join(',')).join(' ')} fill="#241A15" />
      <polyline points={PATH.slice(0, 13).map((p) => p.join(',')).join(' ')} fill="none" stroke="#8C6C52" strokeWidth={6} strokeLinejoin="round" opacity={0.55} />
      {[[1100, 1135], [880, 965], [690, 800], [520, 630], [380, 480]].map(([x, y], i) => <path key={i} d={`M${x - 60},${y + 30} L${x - 10},${y} L${x + 50},${y + 26}`} fill="none" stroke="#5E4535" strokeWidth={5} opacity={0.5} />)}
      {/* the wall the prisoners face */}
      <path d={`M${WALLX},1200 L${WALLX - 60},700 C${WALLX - 40},420 ${WALLX + 200},200 ${WALLX + 700},120 L6000,80 L6000,1220 Z`} fill="url(#wl)" />
      {rock('wl', 10, WALLX, 200, 1500, 900, '#7A5A42')}
      {/* shadows on the wall: the carried objects and the prisoners' heads */}
      <g opacity={0.82 * (1 - dim * 0.5)} style={{filter: 'blur(3px)'}}>
        {OBJ.map(([img, ox], i) => { const k = 2.3, sx = WALLX + 200 + i * 420 + Math.sin(objT * 0.5 + i * 2) * 120, sy = 380 + i * 50 + Math.sin(objT * 2.4 + i * 1.7) * 18;
          return <image key={i} href={staticFile(`cave/${img}`)} x={sx} y={sy} width={130 * k * flick(t, 7 + i, 0.03)} height={130 * k} filter="url(#sil)" />; })}
        {PRISONERS.map(([px, , s], i) => <Back key={i} x={WALLX + 300 + i * 230} y={1180} s={0.62 * s} tilt={laugh ? Math.sin(t * 9 + i * 1.3) * 6 * laugh : 0} fill="#170E0B" rim="#170E0B" />)}
      </g>
      {/* parapet with the people carrying objects behind it */}
      {OBJ.map(([img, ox], i) => { const bob = Math.sin(objT * 2.4 + i * 1.7) * 8; return <g key={i}>
        <Figure x={ox} y={1150 + bob} s={0.9} pose={POSE.carry} rim="#F2B85A" rimDx={-4}
          hold={<g><line x1={0} y1={0} x2={6} y2={-150} stroke="#1A110D" strokeWidth={8} strokeLinecap="round" /><image href={staticFile(`cave/${img}`)} x={-60} y={-275} width={130} height={130} filter="url(#sil)" /></g>} /></g>; })}
      <rect x={2330} y={935} width={90} height={265} fill="url(#pa)" /><rect x={2318} y={922} width={114} height={22} rx={4} fill="#6A4C38" />
      {/* the prisoners, chained, facing the wall */}
      {PRISONERS.map(([px, py, s], i) => { const isF = freed && i === 1; if (isF && freed.hide) return null;
        const head = laugh ? Math.sin(t * 9 + i * 1.3) * 10 * laugh : 0;
        return <g key={i}><line x1={px - 40} y1={py - 2} x2={px + 120} y2={py} stroke="#8C6C52" strokeWidth={3} strokeDasharray="7 5" opacity={0.7} />
          <line x1={px - 10} y1={py - 112 * s} x2={px - 90} y2={py - 60} stroke="#8C6C52" strokeWidth={3} strokeDasharray="7 5" opacity={0.6} />
          <circle cx={px - 92} cy={py - 58} r={7} fill="none" stroke="#8C6C52" strokeWidth={3} />
          {!isF && <Figure x={px} y={py} s={s} pose={{...POSE.seated, head: POSE.seated.head + head}} rim={fireCol} rimDx={-4} />}</g>; })}
      {freed && !freed.hide && <Figure x={freed.x} y={freed.y} s={0.95} pose={freed.pose} flip={freed.flip} rim={freed.rimCol || EMB} rimDx={freed.flip ? 4 : -4} />}
      {freed && freed.helper && <Figure x={freed.helper.x} y={freed.helper.y} s={0.98} pose={POSE.climb} flip rim="#F6D9A0" rimDx={-4} rimA={0.7} />}
      {/* the fire */}
      <ellipse cx={FIRE.x} cy={FIRE.y + 40} rx={230} ry={26} fill="#0A0605" opacity={0.45} />
      <Logs x={FIRE.x} y={FIRE.y + 30} />
      <Flames x={FIRE.x} y={FIRE.y + 30} s={1} t={t} heat={heat} />
    </svg></Layer>
    {/* light: darkness with pools of light at the fire and the exit, then glows */}
    <Dark lights={[{x: fs.x, y: fs.y, r: 1150 * cam.z * f * (1 - dim * 0.35), a: 1}, {x: es.x, y: es.y, r: 520 * cam.z, a: 1}]} a={0.92 - dim * 0.02} />
    <Glow x={fs.x} y={fs.y} r={760 * cam.z * f} color={fireCol} a={0.55 * heat} />
    <Glow x={fs.x} y={fs.y + 40 * cam.z} r={260 * cam.z * f} color={GOLD} a={0.7 * heat} />
    <Glow x={es.x} y={es.y} r={420 * cam.z} color="#F6E3B8" a={0.55} />
    {red > 0 && <AbsoluteFill style={{background: '#5E1410', mixBlendMode: 'multiply', opacity: 0.35 * red}} />}
    {/* near: dark rocks drifting past */}
    <Layer cam={cam} p={1.35}><svg width={6000} height={1600} style={{overflow: 'visible'}}>
      {[[700, 1330], [2350, 1360], [3900, 1340], [5100, 1330]].map(([x, y], i) => { const r = (k) => random(`nr${i}${k}`);
        const pts = Array.from({length: 9}, (_, j) => { const u = j / 8; return `${x - 420 + u * 840},${y - Math.sin(u * Math.PI) * (90 + r(j) * 80)}`; }).join(' ');
        return <polygon key={i} points={`${x - 460},${y + 400} ${pts} ${x + 460},${y + 400}`} fill="#050302" />; })}</svg></Layer>
    <Motes n={22} seed="sa" color={GOLD} />
  </AbsoluteFill>;
};

// ---------- set B: the prisoners' view of the wall
const SHAPES = [['horse_flat.svg', 0], ['amphora_flat.svg', 2.3], ['bird_flat.svg', 4.1], ['goat_flat.svg', 5.6], ['ox_flat.svg', 7.4], ['deciduous_tree_flat.svg', 9.0]];
const PovSet = ({t, screens = 0, push = 0, turn = -1, heat = 1}) => {
  const f = flick(t, 2, 0.12) * heat, z = 1 + push * 0.12;
  return <AbsoluteFill style={{background: '#120C09', overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: `scale(${z})`}}>
      {/* the lit wall */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 38% 70%, #8A6448 0%, #5E4535 30%, #2E2019 62%, #120C09 100%)`, filter: `brightness(${0.82 + 0.18 * f})`}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>{rock('pw', 14, -100, 80, 2100, 800, '#7A5A42')}</svg>
      <Img src={staticFile('cave/ceiling_ember.png')} style={{position: 'absolute', left: -200, top: -150, width: 2400, filter: 'brightness(0.45)'}} />
      {/* shadows gliding across */}
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: (1 - screens * 0.7) * 0.85, filter: 'blur(4px)'}}><defs>{sil}</defs>
        {SHAPES.map(([img, off], i) => { const per = 11, u = ((t + off) % per) / per, x = -420 + u * 2600, y = 230 + (i % 3) * 70 + Math.sin(t * 1.3 + i) * 8, s = 330 + (i % 2) * 70;
          return <image key={i} href={staticFile(`cave/${img}`)} x={x} y={y} width={s * flick(t, 9 + i, 0.025)} height={s} filter="url(#sil)" />; })}</svg>
      {/* the modern walls: many small glowing screens */}
      {screens > 0 && <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {Array.from({length: 26}, (_, i) => { const r = (k) => random(`sc${i}${k}`); const big = i % 7 === 0;
          const w = big ? 220 : 64 + r(5) * 40, h = big ? 140 : w * 1.75, x = 80 + r(1) * 1700, y = 120 + r(2) * 560;
          const o = ramp(screens, r(3) * 0.6, r(3) * 0.6 + 0.4) * (0.7 + 0.3 * Math.sin(t * (2 + r(4) * 3) + i));
          return <g key={i} opacity={o}><rect x={x - 16} y={y - 16} width={w + 32} height={h + 32} rx={18} fill="#BFD6E8" opacity={0.16} style={{filter: 'blur(10px)'}} />
            <rect x={x} y={y} width={w} height={h} rx={big ? 8 : 10} fill="#DCEAF3" opacity={0.9} /><rect x={x + w * 0.1} y={y + h * 0.1} width={w * 0.8} height={h * 0.5} rx={4} fill="#9FC0D6" /></g>; })}</svg>}
    </AbsoluteFill>
    <Glow x={700} y={1100} r={900 * f} color={EMB} a={0.35 * heat * (1 - screens * 0.6)} />
    {screens > 0 && <Glow x={960} y={480} r={900} color="#BFD6E8" a={0.35 * screens} />}
    {/* the backs of the prisoners' heads */}
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      {[[230, 1135, 1.25], [610, 1150, 1.4], [990, 1128, 1.3], [1370, 1148, 1.38], [1730, 1132, 1.25]].map(([x, y, s], i) =>
        <Back key={i} x={x} y={y} s={s} tilt={i === 2 && turn >= 0 ? -turn * 14 : Math.sin(t * 0.7 + i) * 1.2} rim={screens > 0.5 ? '#BFD6E8' : EMB} />)}</svg>
    <Motes n={18} seed="pv" color={GOLD} />
  </AbsoluteFill>;
};

// ---------- set C: the cave mouth (Adobe Stock 1421108489, recoloured)
const MouthSet = ({t, cam, white = 0, walkers = 0}) => <AbsoluteFill style={{background: '#FFF4DC', overflow: 'hidden'}}>
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 45%, #FFFBF0 0%, #FBE6BE 45%, #F2C487 100%)'}} />
  <Layer cam={cam} p={0.95}><Glow x={700} y={1350} r={1300} color="#FFFFFF" a={0.9} blend="normal" /></Layer>
  <Layer cam={cam} p={1}><Img src={staticFile('cave/mouth_ember.png')} style={{position: 'absolute', left: 0, top: 0, width: 3200}} />
    <svg width={3200} height={3200} style={{position: 'absolute', left: 0, top: 0}}>
      {walkers > 0 && [[0, 1.0], [1, 0.95]].map(([i, s]) => { const u = Math.min(1, walkers), x = 1900 - u * 700 - i * 120, y = 2580 - u * 240 - i * 10;
        return <Figure key={i} x={x} y={y} s={s * (1 - u * 0.35)} pose={i ? POSE.climb : POSE.shield} flip rim="#FFF4DC" rimDx={-5} fill="#140C09" />; })}</svg></Layer>
  <AbsoluteFill style={{background: '#FFFBF0', opacity: white}} />
  <Motes n={20} seed="mo" color="#FFF4DC" />
</AbsoluteFill>;

// ---------- set D: the world outside (Adobe Stock 628092371, recoloured)
const SUN = {x: 683, y: 790};
const LakeSet = ({t, cam, sun = 0, white = 0}) => { const ss = toScreen(cam, SUN.x, SUN.y);
  return <AbsoluteFill style={{background: '#F6D4A8', overflow: 'hidden'}}>
    <Layer cam={cam} p={1}><Img src={staticFile('cave/lake_dawn.png')} style={{position: 'absolute', left: 0, top: 0, width: 3840}} />
      <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0}}>
        {/* a sunlit ledge with long tree shadows: the first thing he can bear to look at */}
        <defs><linearGradient id="ledge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EBA266" /><stop offset="0.25" stopColor="#C47039" /><stop offset="1" stopColor="#5A2E18" /></linearGradient></defs>
        <path d="M2450,2160 C2520,2040 2580,1960 2700,1935 C2860,1905 3050,1915 3240,1895 C3450,1875 3650,1890 3840,1880 L3840,2160 Z" fill="url(#ledge)" />
        <g style={{filter: 'blur(5px)'}} opacity={0.6}>{[[2720, 0], [2960, 1], [3420, 2], [3640, 3]].map(([x, i]) => <path key={i} d={`M${x},1940 C${x + 40},1990 ${x + 160},2080 ${x + 260},2160 L${x + 420},2160 C${x + 300},2080 ${x + 150},1990 ${x + 70},1932 Z`} fill="#2A140A" />)}</g>
        <Figure x={3230} y={1915} s={0.85} pose={POSE.slump} rim="#F7D4A8" rimDx={4} fill="#1A120E" />
        <path d="M3215,1915 C3280,1960 3380,2060 3440,2160 L3530,2160 C3460,2060 3330,1950 3255,1912 Z" fill="#2A140A" opacity={0.6} style={{filter: 'blur(4px)'}} /></svg></Layer>
    <Glow x={ss.x} y={ss.y} r={(260 + sun * 900) * cam.z} color="#FFF3D6" a={0.55 + sun * 0.45} />
    <Glow x={ss.x} y={ss.y} r={(120 + sun * 260) * cam.z} color="#FFFFFF" a={0.6 + sun * 0.4} />
    <AbsoluteFill style={{background: '#FFF8EA', opacity: white}} />
  </AbsoluteFill>; };

// ---------- scenes
const Wall = () => { const t = useT(), w2 = ts('wall2'), w3 = ts('wall3'), w4 = ts('wall4');
  const cam = camAt([{t: 0, x: FIRE.x + 40, y: 1020, z: 1.7}, {t: w2 - 0.2, x: FIRE.x + 300, y: 960, z: 1.15}, {t: w2 + 2.2, x: 3700, y: 900, z: 0.8}, {t: w3, x: 3850, y: 880, z: 0.84}], t);
  const pov = ramp(t, w3 - 0.35, w3 + 0.35), turn = ramp(t, tw('wall4', 'free') - 0.2, tw('wall4', 'free') + 0.8);
  return <AbsoluteFill>
    <AbsoluteFill style={{opacity: 1 - pov}}><SideSet t={t} cam={cam} objT={t} /></AbsoluteFill>
    {pov > 0 && <AbsoluteFill style={{opacity: pov}}><PovSet t={t} push={ramp(t, w3, te('wall4'), 0, 1)} turn={turn} /></AbsoluteFill>}
    <Chapter t={t} at={0.4} dur={4.6} n="I" title="The wall" />
    <Kind t={t} at={0.8} dur={te('wall4') + 0.6} text="Illustration · after Plato, Republic, Book VII" />
    <Badge t={t} at={tw('wall4', 'plato') - 0.15} dur={4.2} img="cave/plato_flat.png" name="PLATO" role="Athenian philosopher" dates="c. 428 – 348 BC" y={250} />
    <DateTag t={t} at={tw('wall4', 'two') - 0.1} dur={3.2} text="REPUBLIC · c. 375 BC" x={1350} y={560} />
    <Lexicon t={t} at={tw('wall4', 'story') - 0.1} dur={4.4} n={1} term="Allegory" def="A story in which each part stands for an idea." />
    <Grain /><Vignette />
  </AbsoluteFill>; };

const Climb = () => { const t = useT(), c1 = ts('climb1') - sceneStart(1), c2 = ts('climb2') - sceneStart(1), off = sceneStart(1);
  const T = (id, w, k) => tw(id, w, k) - off;
  const turn = T('climb1', 'turns'), drag = T('climb1', 'dragged'), day = T('climb1', 'daylight');
  const u = ramp(t, drag - 0.2, day - 0.3, 0, 1);
  const [fx, fy] = u > 0 ? pathPt(u) : [3110, 1192];
  const pose = t < turn + 0.25 ? {...POSE.seated} : t < drag - 0.2 ? POSE.shield : POSE.climb;
  const freed = {x: u > 0 ? fx : 3110, y: u > 0 ? fy : (t < turn + 0.25 ? 1192 : 1150), pose, flip: t >= turn + 0.25, helper: u > 0 ? {x: pathPt(Math.min(1, u + 0.08))[0], y: pathPt(Math.min(1, u + 0.08))[1]} : null};
  const cam = camAt([{t: 0, x: 3000, y: 960, z: 0.85}, {t: turn + 0.4, x: 2500, y: 1000, z: 0.75}, {t: drag, x: 1900, y: 980, z: 0.7}, {t: day - 0.6, x: 700, y: 640, z: 0.8}], t);
  const glare = Math.max(0, 1 - Math.abs(t - (turn + 0.7)) / 0.9) * 0.5;
  const mouth = ramp(t, day - 0.35, day + 0.05), mcam = camAt([{t: day - 0.35, x: 1350, y: 1900, z: 0.42}, {t: c2 + 0.5, x: 900, y: 1500, z: 1.1}], t);
  const lake = ramp(t, c2 + 0.3, c2 + 0.65);
  const s1 = T('climb2', 'reflections'), s2 = T('climb2', 'things'), s3 = T('climb2', 'sun');
  const lcam = camAt([{t: c2 + 0.3, x: 3150, y: 1960, z: 1.6}, {t: s1 - 0.4, x: 3000, y: 1920, z: 1.45}, {t: s1 + 0.9, x: 2150, y: 1600, z: 1.05}, {t: s2 - 0.2, x: 2150, y: 1560, z: 1.0},
    {t: s2 + 1.2, x: 1900, y: 820, z: 0.78}, {t: s3 - 0.2, x: 1600, y: 860, z: 0.7}, {t: s3 + 1.0, x: SUN.x + 120, y: SUN.y + 20, z: 1.25}], t);
  return <AbsoluteFill>
    <SideSet t={t + 20} cam={cam} freed={freed} objT={t + 20} heat={1 + glare} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 60%, #FFF3D6 0%, rgba(255,243,214,0.4) 35%, rgba(0,0,0,0) 70%)', opacity: glare * 1.2, mixBlendMode: 'screen'}} />
    {mouth > 0 && <AbsoluteFill style={{opacity: mouth}}><MouthSet t={t} cam={mcam} walkers={ramp(t, day - 0.35, c2 + 0.2)} white={ramp(t, c2 - 0.1, c2 + 0.4)} /></AbsoluteFill>}
    {lake > 0 && <AbsoluteFill style={{opacity: lake}}><LakeSet t={t} cam={lcam} sun={ramp(t, s3 - 0.2, s3 + 1.0)} white={ramp(t, s3 + 0.9, s3 + 1.6, 0, 0.5)} /></AbsoluteFill>}
    <Chapter t={t} at={0.35} dur={4.4} n="II" title="The climb" />
    <Lexicon t={t} at={s2 - 0.1} dur={4.6} n={2} term="The Forms" def="Plato's name for the perfect originals that everyday things only copy." />
    <Kind t={t} at={0} dur={c2 + 0.2} text="Illustration · Republic 515c–e" />
    <Kind t={t} at={c2 + 0.3} dur={20} text="Illustration · Republic 516a–b" />
    <Grain /><Vignette a={0.45} />
  </AbsoluteFill>; };

const Return = () => { const t = useT(), off = sceneStart(2), r2 = ts('return2') - off; const T = (id, w, k) => tw(id, w, k) - off;
  const down = ramp(t, 0.2, T('return1', 'see') - 0.2), [px, py] = pathPt(1 - down);
  const back = ramp(t, T('return1', 'see'), T('return1', 'laugh') + 0.3);
  const fx = down < 1 ? px : 1150 + back * 1700, fy = down < 1 ? py : 1150;
  const laugh = ramp(t, T('return1', 'laugh') - 0.1, T('return1', 'laugh') + 0.3) * (1 - ramp(t, r2 - 0.3, r2 + 0.3));
  const red = ramp(t, T('return2', 'kill') - 0.4, T('return2', 'kill') + 0.6);
  const cam = camAt([{t: 0, x: 900, y: 800, z: 0.8}, {t: T('return1', 'see'), x: 1600, y: 1000, z: 0.75}, {t: T('return1', 'laugh'), x: 2700, y: 1000, z: 0.8},
    {t: r2, x: 3000, y: 1030, z: 1.0}, {t: T('return2', 'kill') + 0.8, x: 3250, y: 1080, z: 1.5}, {t: 30, x: 3300, y: 1090, z: 1.6}], t);
  return <AbsoluteFill>
    <SideSet t={t + 40} cam={cam} dim={0.6} heat={1 - red * 0.25} laugh={laugh} red={red} objT={t + 40}
      freed={{x: fx, y: fy, pose: down < 1 ? POSE.stand : POSE.slump, flip: down >= 1 ? false : true, rimCol: '#C98445'}} />
    <AbsoluteFill style={{background: '#000', opacity: 0.25 * (1 - ramp(t, T('return1', 'laugh'), T('return1', 'laugh') + 1))}} />
    <Chapter t={t} at={0.35} dur={4.4} n="III" title="The return" />
    <Badge t={t} at={T('return2', 'socrates', 1) - 0.2} dur={4.6} img="cave/socrates_flat.png" name="SOCRATES" role="Plato's teacher" dates="EXECUTED · ATHENS · 399 BC" y={260} />
    <Kind t={t} at={0.5} dur={30} text="Illustration · Republic 516e–517a" />
    <Grain /><Vignette a={0.6} />
  </AbsoluteFill>; };

const End = () => { const t = useT(), off = sceneStart(3); const T = (id, w, k) => tw(id, w, k) - off;
  const scr = ramp(t, T('end1', 'wall') - 1.0, T('end1', 'wall') + 0.8), out = ramp(t, te('end1') - off + 0.2, te('end1') - off + 1.6);
  return <AbsoluteFill>
    <PovSet t={t + 60} screens={scr} push={0.6 - 0.6 * ramp(t, 0, te('end1') - off)} />
    <Kind t={t} at={T('end1', 'wall') - 0.5} dur={20} text="Illustrative" />
    <AbsoluteFill style={{background: '#0B0807', opacity: out}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', opacity: out, fontFamily: SI, fontWeight: 500, fontSize: 64, color: CREAM, letterSpacing: 2}}>Plato's Cave</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', opacity: out, fontFamily: MO, fontSize: 18, letterSpacing: 4, color: '#C9A27A'}}>REPUBLIC · BOOK VII · c. 375 BC</div>
    <Grain /><Vignette />
  </AbsoluteFill>; };

export const Cave = () => { const parts = [Wall, Climb, Return, End];
  return <AbsoluteFill style={{background: '#0B0807'}}>{parts.map((C, i) => { const a = Math.round(sceneStart(i) * FPS), b = i < 3 ? Math.round(sceneStart(i + 1) * FPS) : CAVE_DUR;
    return <Sequence key={i} from={a} durationInFrames={b - a}><C /></Sequence>; })}</AbsoluteFill>; };
// stills for review: a frame at a given second
export const CaveStill = ({sec}) => <Sequence from={-Math.round(sec * FPS)}><Cave /></Sequence>;
