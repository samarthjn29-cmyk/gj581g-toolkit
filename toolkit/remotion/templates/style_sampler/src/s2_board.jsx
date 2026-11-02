// S2 Investigation board: polaroids, index cards, clippings and red string on cork; the camera moves from clue to clue.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useT, s, tw, ramp, back, lerp, Narr, Sfx, Caps, drawOn} from './common';
import {Folk} from './folk';

const CORK = '#B4875A', RED = '#C3302B', PAPER = '#F6F1E4', NEWS = '#E9E4D6', INK = '#24211D', MONO = "'JetBrains Mono', monospace", FR = "'Fraunces', Georgia, serif", HF = "'Kalam', cursive";
const Pin = ({x, y, c = RED}) => <g><circle cx={x + 3} cy={y + 5} r="13" fill="#000" opacity="0.25" /><circle cx={x} cy={y} r="13" fill={c} /><circle cx={x - 4} cy={y - 4} r="4" fill="#FFFFFF" opacity="0.6" /></g>;
const pinIn = (t, a, x, y, rot) => { const p = back(t, a, 0.4); return `translate(${x} ${y}) rotate(${rot}) scale(${lerp(1.25, 1, p)})`; };
const shadow = 'url(#dsh)';

const Polaroid = ({x, y, rot, t, a, who, name}) => { const p = ramp(t, a, 0.2); if (p <= 0) return null;
  return <g transform={pinIn(t, a, x, y, rot)} opacity={p}>
    <rect x="-140" y="-160" width="280" height="330" fill="#FFFFFF" filter={shadow} />
    <defs><clipPath id={`ph${name}`}><rect x="-120" y="-140" width="240" height="240" /></clipPath></defs>
    <rect x="-120" y="-140" width="240" height="240" fill={who === 'ann' ? '#9DB7B0' : '#D7B39A'} />
    <g clipPath={`url(#ph${name})`}><Folk x={0} y={120} h={260} {...(who === 'ann' ? {skin: '#9A6343', hair: 'bun', hairColor: '#1C1512', top: 'sweater', topColor: '#24493A', glasses: true}
      : {skin: '#EDBE98', hair: 'curly', hairColor: '#3B2417', top: 'blazer', topColor: '#7A2333'})} face="smile" /></g>
    <text x="0" y="150" textAnchor="middle" fontFamily={HF} fontWeight="700" fontSize="40" fill={INK}>{name}</text>
    <Pin x={0} y={-150} /></g>; };

const Card = ({x, y, rot, t, a, lines}) => { const p = ramp(t, a, 0.2); if (p <= 0) return null;
  return <g transform={pinIn(t, a, x, y, rot)} opacity={p}>
    <rect x="-170" y="-90" width="340" height="180" fill={PAPER} filter={shadow} />
    <line x1="-170" x2="170" y1="-52" y2="-52" stroke={RED} strokeWidth="2" />
    {[-14, 24, 62].map((yy) => <line key={yy} x1="-170" x2="170" y1={yy} y2={yy} stroke="#9EB6D0" strokeWidth="1.2" />)}
    {lines.map((l, i) => <text key={i} x="-148" y={-62 + i * 66 + (i ? 40 : 0)} fontFamily={MONO} fontWeight={i ? 800 : 500} fontSize={i ? 62 : 26} fill={INK}>{l}</text>)}
    <Pin x={0} y={-80} c="#2F5D9B" /></g>; };

const Clip = ({x, y, rot, t, a, head, sub}) => { const p = ramp(t, a, 0.2); if (p <= 0) return null;
  return <g transform={pinIn(t, a, x, y, rot)} opacity={p}>
    <path d="M -200 -120 L 196 -126 L 204 118 L -196 124 Z" fill={NEWS} filter={shadow} />
    <text x="-176" y="-74" fontFamily={MONO} fontSize="16" fill="#6E675A" letterSpacing="2">THE DAILY LEDGER · LOCAL</text>
    <text x="-176" y="-14" fontFamily={FR} fontWeight="700" fontSize="56" fill={INK}>{head}</text>
    <text x="-176" y="30" fontFamily={FR} fontSize="26" fill="#4A453C">{sub}</text>
    {[60, 78, 96].map((yy) => <g key={yy}><rect x="-176" y={yy} width="160" height="8" fill="#C8C1B0" /><rect x="0" y={yy} width="170" height="8" fill="#C8C1B0" /></g>)}
    <Pin x={0} y={-112} /></g>; };

const Stamp = ({x, y, t, a, text, c}) => { const p = back(t, a, 0.3); if (p <= 0.01) return null;
  return <g transform={`translate(${x} ${y}) rotate(-12) scale(${lerp(1.8, 1, p)})`} opacity={Math.min(1, p * 2)}>
    <rect x="-150" y="-46" width="300" height="92" rx="8" fill="none" stroke={c} strokeWidth="7" />
    <text x="0" y="22" textAnchor="middle" fontFamily={MONO} fontWeight="800" fontSize="60" fill={c}>{text}</text></g>; };

const String_ = ({pts, t, a, d = 0.5}) => { const p = ramp(t, a, d); if (p <= 0) return null; const [[x1, y1], [x2, y2]] = pts;
  return <path d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.max(y1, y2) + 70} ${x2} ${y2}`} {...drawOn(p)} stroke={RED} strokeWidth="5" fill="none" />; };

const CAM = [[0, 600, 640, 1.35], [s('p2') - 0.2, 1800, 640, 1.35], [s('p3') - 0.1, 1200, 640, 1.0], [s('p4'), 1850, 880, 1.15], [s('p5') - 0.1, 550, 880, 1.15], [s('p6') - 0.1, 1800, 760, 1.25], [s('p7') - 0.1, 1200, 700, 0.8]];
const cam = (t) => { let i = 0; while (i + 1 < CAM.length && CAM[i + 1][0] <= t) i++; const a = CAM[i], b = i ? CAM[i - 1] : CAM[i]; const p = ramp(t, a[0], 0.8);
  return [lerp(b[1], a[1], p), lerp(b[2], a[2], p), lerp(b[3], a[3], p)]; };

export const Board = () => { const t = useT(); const [cx, cy, z] = cam(t);
  return <AbsoluteFill style={{background: '#3B2A1C', overflow: 'hidden'}}>
    <Narr />{[s('p1'), s('p2'), s('p3') + 0.1, tw('p4', 'four'), tw('p5', 'move')].map((a, i) => <Sfx key={i} at={a} name="paper" vol={0.25} />)}
    <Sfx at={tw('p6', 'one')} name="stamp" vol={0.45} /><Sfx at={tw('p7', 'two')} name="stamp" vol={0.45} />
    <svg width={1920} height={1080}>
      <defs><filter id="cork"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="9" /><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 0.35 0" /></filter>
        <filter id="dsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="5" dy="9" stdDeviation="6" floodColor="#2A1A0C" floodOpacity="0.45" /></filter></defs>
      <g transform={`translate(960 540) scale(${z}) translate(${-cx} ${-cy})`}>
        <rect x="0" y="0" width="2400" height="1400" fill={CORK} /><rect x="0" y="0" width="2400" height="1400" filter="url(#cork)" />
        <rect x="-40" y="-40" width="2480" height="1480" fill="none" stroke="#6B4A2C" strokeWidth="80" />
        <String_ pts={[[600, 350], [1180, 300]]} t={t} a={s('p3') + 0.2} /><String_ pts={[[1800, 350], [1220, 300]]} t={t} a={s('p3') + 0.35} />
        <String_ pts={[[1800, 350], [2150, 930]]} t={t} a={tw('p4', 'up')} /><String_ pts={[[600, 350], [270, 930]]} t={t} a={s('p5')} />
        <Polaroid x={600} y={500} rot={-4} t={t} a={s('p1')} who="ann" name="Ann" />
        <Card x={600} y={880} rot={3} t={t} a={tw('p1', 'two')} lines={['RAISE', '+2%']} />
        <Polaroid x={1800} y={500} rot={5} t={t} a={s('p2')} who="barb" name="Barbara" />
        <Card x={1800} y={880} rot={-3} t={t} a={tw('p2', 'five')} lines={['RAISE', '+5%']} />
        <g transform={pinIn(t, s('p3'), 1200, 400, 4)} opacity={ramp(t, s('p3'), 0.2)}>
          <rect x="-150" y="-130" width="300" height="260" fill="#F4D35E" filter={shadow} />
          <text x="0" y="-20" textAnchor="middle" fontFamily={HF} fontWeight="700" fontSize="58" fill={INK}>Who's</text>
          <text x="0" y="50" textAnchor="middle" fontFamily={HF} fontWeight="700" fontSize="58" fill={INK}>better off?</text><Pin x={0} y={-118} /></g>
        <Clip x={2120} y={1080} rot={4} t={t} a={tw('p4', 'four') - 0.2} head="Prices up 4%" sub="Barbara's city, this year" />
        <Clip x={300} y={1080} rot={-4} t={t} a={tw('p5', 'move') - 0.2} head="Prices flat" sub="Ann's city, this year" />
        <Stamp x={1760} y={1000} t={t} a={tw('p6', 'one')} text="REAL +1%" c={RED} />
        <Stamp x={660} y={1000} t={t} a={tw('p7', 'two')} text="REAL +2%" c="#1F7A4D" />
      </g>
    </svg>
    <Caps bg="rgba(36,33,29,0.88)" hi="#F4D35E" />
  </AbsoluteFill>; };
