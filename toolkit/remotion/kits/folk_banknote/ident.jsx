// Three original identity directions for "The Dollar Yardstick" series (2 Nov 2026). Same moment, our own design language.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import './lib';
import {Folk} from './folk';
const OS = "'Oswald', 'Inter', sans-serif", FR = "'Fraunces', Georgia, serif", FI = "'FrauncesI', Georgia, serif", IN = "'Inter', sans-serif", MO = "'JetBrains Mono', monospace";
const T = ({x, y, children, s = 40, f = IN, w = 700, c = '#000', a = 'left', ls = 0, style}) => <div style={{position: 'absolute', left: x, top: y, fontFamily: f, fontWeight: w, fontSize: s, color: c, textAlign: a, letterSpacing: ls, whiteSpace: 'nowrap', transform: a === 'center' ? 'translateX(-50%)' : a === 'right' ? 'translateX(-100%)' : 'none', ...style}}>{children}</div>;

// ---------------------------------------------------------------- A. "PAY SLIP": receipts and pay slips as the tiles
const zig = (x, y, w, h, n = 40, d = 12) => { let p = `M ${x} ${y}`; for (let i = 0; i <= n; i++) p += ` L ${x + (w * i) / n} ${y + (i % 2 ? d : 0)}`; p += ` L ${x + w} ${y + h}`;
  for (let i = n; i >= 0; i--) p += ` L ${x + (w * i) / n} ${y + h - (i % 2 ? d : 0)}`; return p + ' Z'; };
export const IdA = () => { const BG = '#1F3B34', PAPER = '#FBF8F1', INK = '#1E2422', AMB = '#F0B429', RED = '#D1495B';
  return <AbsoluteFill style={{background: BG}}>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#2C4B43" /></pattern>
        <filter id="sh" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity="0.35" /></filter></defs>
      <rect width="1920" height="1080" fill="url(#dots)" />
      <g filter="url(#sh)" transform="rotate(-2 560 540)"><path d={zig(170, 150, 760, 760)} fill={PAPER} /></g>
      <g filter="url(#sh)" transform="rotate(2.5 1420 470)"><path d={zig(1100, 170, 600, 560, 30)} fill={PAPER} /></g>
      <Folk x={1440} y={1080} h={430} hair="short" hairColor="#2B2420" skin="#E2A97E" top="hoodie" topColor="#D1495B" face="surprised" />
    </svg>
    <div style={{position: 'absolute', left: 170, top: 150, width: 760, height: 760, transform: 'rotate(-2deg)', transformOrigin: '390px 390px'}}>
      <T x={60} y={60} s={26} f={MO} w={600} c={INK}>*** PAY SLIP · UNITED KINGDOM ***</T>
      <T x={60} y={110} s={22} f={MO} w={500} c="#7C8582">AVERAGE ANNUAL WAGE · 2010 → 2025</T>
      <div style={{position: 'absolute', left: 60, top: 160, width: 640, borderTop: `3px dashed ${INK}`}} />
      {[['NOMINAL CHANGE', '+52.1%', INK], ['PRICES (CONSUMPTION)', '+48.0%', INK], ['', '', INK], ['REAL CHANGE', '+2.8%', RED]].map(([a, b, c], i) => a ? <React.Fragment key={i}>
        <T x={60} y={200 + i * 90} s={34} f={MO} w={600} c={INK}>{a}</T><T x={700} y={194 + i * 90} s={46} f={MO} w={800} c={c} a="right">{b}</T></React.Fragment>
        : <div key={i} style={{position: 'absolute', left: 60, top: 200 + i * 90 + 20, width: 640, borderTop: `3px solid ${INK}`}} />)}
      <div style={{position: 'absolute', left: 60, top: 560, padding: '10px 26px', border: `5px solid ${RED}`, color: RED, fontFamily: MO, fontWeight: 800, fontSize: 40, transform: 'rotate(-6deg)', letterSpacing: 3}}>MOSTLY INFLATION</div>
      <T x={60} y={680} s={20} f={MO} w={500} c="#7C8582">OECD · constant vs current prices · draft</T>
    </div>
    <div style={{position: 'absolute', left: 1100, top: 170, width: 600, height: 560, transform: 'rotate(2.5deg)', transformOrigin: '300px 280px'}}>
      <T x={300} y={70} s={30} f={MO} w={700} c={INK} a="center">WHERE THE RAISE WENT</T>
      {[['PRICES', 48, '#B9C4C0'], ['YOU', 2.8, AMB]].map(([a, v, c], i) => <React.Fragment key={i}>
        <div style={{position: 'absolute', left: 60, top: 170 + i * 150, width: 480 * v / 52, height: 80, background: c}} />
        <T x={60} y={130 + i * 150} s={26} f={MO} w={600} c={INK}>{a}</T></React.Fragment>)}
      <T x={60} y={440} s={30} f={MO} w={600} c={INK}>TOTAL ON PAPER .... +52%</T>
    </div>
    <T x={80} y={970} s={64} f={OS} w={700} c={PAPER} ls={1}>YOUR RAISE IS LYING TO YOU</T>
  </AbsoluteFill>; };

// ---------------------------------------------------------------- B. "BANKNOTE": engraved guilloché frames, security-paper ground
const rosette = (cx, cy, R, r, d, n = 1400) => { let p = ''; for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI * 2 * r;
  const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t), y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t); p += (i ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y.toFixed(1); } return p; };
const waveBand = (x, y, w, h, k, ph) => { let p = ''; for (let i = 0; i <= 200; i++) { const xx = x + (w * i) / 200; const yy = y + h / 2 + (h / 2) * Math.sin(i / 200 * Math.PI * k + ph); p += (i ? ' L ' : 'M ') + xx.toFixed(1) + ' ' + yy.toFixed(1); } return p; };
export const IdB = () => { const GROUND = '#EFE9DA', GREEN = '#24493A', OX = '#7A2333', GOLD = '#B98B2E', INK = '#1C2422';
  return <AbsoluteFill style={{background: GROUND}}>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      {Array.from({length: 26}, (_, i) => <path key={i} d={waveBand(0, 20 + i * 40, 1920, 30, 9, i * 0.5)} stroke="#E2DAC6" strokeWidth="1.2" fill="none" />)}
      <rect x="110" y="150" width="1100" height="640" rx="18" fill="#F7F3E8" stroke={GREEN} strokeWidth="3" />
      <rect x="126" y="166" width="1068" height="608" rx="12" fill="none" stroke={GREEN} strokeWidth="1" />
      {Array.from({length: 10}, (_, i) => <path key={i} d={waveBand(140, 176 + (i % 2) * 6, 1040, 16, 60, i)} stroke={GREEN} strokeWidth="0.8" fill="none" opacity="0.5" />)}
      {Array.from({length: 10}, (_, i) => <path key={'b' + i} d={waveBand(140, 744 + (i % 2) * 6, 1040, 16, 60, i)} stroke={GREEN} strokeWidth="0.8" fill="none" opacity="0.5" />)}
      <g opacity="0.9">{[0, 1, 2].map((k) => <path key={k} d={rosette(1010, 470, 170 - k * 18, 23 + k * 4, 60 - k * 6)} stroke={k === 1 ? GOLD : GREEN} strokeWidth="0.9" fill="none" />)}</g>
      <circle cx="1010" cy="470" r="64" fill="#F7F3E8" stroke={GREEN} strokeWidth="2" />
      <rect x="1290" y="150" width="520" height="640" rx="18" fill="#F7F3E8" stroke={OX} strokeWidth="3" />
      {[0, 1].map((k) => <path key={k} d={rosette(1550, 300, 110 - k * 14, 17 + k * 3, 40)} stroke={OX} strokeWidth="0.8" fill="none" opacity="0.6" />)}
      <Folk x={1550} y={790} h={400} hair="long" hairColor="#5A3B2A" skin="#F1C7A4" top="blazer" topColor={OX} face="sad" />
    </svg>
    <T x={110} y={60} s={30} f={FI} w={400} c={GREEN}>The Dollar Yardstick · No. 1</T>
    <T x={170} y={220} s={30} f={OS} w={500} c={GREEN} ls={6}>ONE POUND OF RAISE · 2010–2025</T>
    <T x={170} y={290} s={150} f={FR} w={700} c={INK}>+52%</T>
    <T x={175} y={480} s={36} f={FI} w={400} c={GREEN}>on paper. After prices:</T>
    <T x={170} y={540} s={130} f={FR} w={700} c={OX}>+3%</T>
    <T x={1010} y={448} s={40} f={OS} w={700} c={GREEN} a="center">UK</T>
    <T x={110} y={860} s={64} f={FR} w={700} c={INK}>Your raise is lying to you</T>
    <T x={110} y={1010} s={20} f={IN} w={500} c="#8A8070">Source (draft): OECD average annual wages, current vs constant prices</T>
  </AbsoluteFill>; };

// ---------------------------------------------------------------- C. "TWO-INK PRINT": cut paper shapes, two overprinting inks, print grain
export const IdC = () => { const PAPER = '#F4EFE6', BLUE = '#2F5DA8', PINK = '#F2617A', INK = '#16233D';
  return <AbsoluteFill style={{background: PAPER}}>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0" /><feComposite in2="SourceGraphic" operator="in" /></filter></defs>
      <g style={{mixBlendMode: 'multiply'}}>
        <rect x="140" y="250" width="980" height="150" rx="75" fill={BLUE} opacity="0.92" />
        <rect x="150" y="470" width="300" height="150" rx="75" fill={PINK} opacity="0.95" />
        <circle cx="1460" cy="420" r="300" fill={PINK} opacity="0.85" />
        <circle cx="1560" cy="520" r="240" fill={BLUE} opacity="0.75" />
      </g>
      <rect width="1920" height="1080" fill="#000" filter="url(#grain)" />
      <Folk x={1500} y={1080} h={560} hair="bun" hairColor="#16233D" skin="#C68A62" top="sweater" topColor="#F2C230" face="thinking" />
    </svg>
    <T x={140} y={90} s={110} f={OS} w={700} c={INK}>PAID MORE.</T>
    <T x={720} y={90} s={110} f={OS} w={500} c={PINK}>RICHER?</T>
    <T x={190} y={290} s={74} f={OS} w={700} c={PAPER}>+52% ON PAPER</T>
    <T x={190} y={510} s={74} f={OS} w={700} c={PAPER}>+3%</T>
    <T x={490} y={520} s={50} f={FI} w={400} c={INK}>after prices</T>
    <T x={140} y={720} s={40} f={FI} w={400} c={INK}>United Kingdom, average wage, 2010–2025</T>
    <T x={140} y={1010} s={20} f={IN} w={500} c="#6B7180">Source (draft): OECD average annual wages</T>
  </AbsoluteFill>; };
