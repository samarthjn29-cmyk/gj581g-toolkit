// S11 Paper cut-out: coloured paper pieces with white cut edges and soft shadows slide, flip and pop up on a kraft desk.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useT, s, tw, ramp, back, lerp, Narr, Sfx, Caps} from './common';

const KRAFT = '#C8A27A', INK = '#2B2A28', NAVY = '#26456E', CORAL = '#E0684B', MUST = '#E8B33A', TEAL = '#3E8C84', CREAM = '#FBF5E9', FR = "'Fraunces', Georgia, serif";
// a cut piece: white edge + shadow under the shape
const Cut = ({children, edge = 7}) => <g filter="url(#shadow)"><g stroke="#FFFFFF" strokeWidth={edge * 2} strokeLinejoin="round">{children}</g><g>{children}</g></g>;
const slideIn = (t, a, dx = 0, dy = -500, rot = 0) => { const p = back(t, a, 0.5); return `translate(${(1 - p) * dx} ${(1 - p) * dy}) rotate(${(1 - p) * rot})`; };

const Person = ({x, y, col, hair, name, t, a}) => <g opacity={ramp(t, a, 0.12)} transform={`translate(${x} ${y}) ${slideIn(t, a, 0, 700, 12)}`}>
  <Cut><path d="M -110 230 C -110 120 -70 70 0 70 C 70 70 110 120 110 230 Z" fill={col} /><circle cx="0" cy="0" r="62" fill="#E7B48E" /><path d="M -64 -6 C -64 -60 -30 -76 0 -76 C 40 -76 66 -56 64 -4 C 46 -30 20 -36 -4 -34 C -30 -30 -50 -20 -64 -6 Z" fill={hair} /></Cut>
  <circle cx="-22" cy="4" r="6" fill={INK} /><circle cx="22" cy="4" r="6" fill={INK} /><path d="M -16 28 Q 0 38 16 28" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
  <g transform="translate(0 270) rotate(-3)"><Cut edge={5}><rect x="-90" y="-26" width="180" height="52" rx="4" fill={CREAM} /></Cut>
    <text x="0" y="14" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="38" fill={INK}>{name}</text></g>
</g>;

const Tag = ({x, y, text, col, t, a, rot = -6}) => { const p = back(t, a, 0.45);
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${p} ${p})`} opacity={Math.min(1, p * 2)}>
    <Cut edge={6}><path d="M -100 -48 L 70 -48 L 112 0 L 70 48 L -100 48 Z" fill={col} /></Cut>
    <circle cx="74" cy="0" r="9" fill={KRAFT} />
    <text x="-14" y="20" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="58" fill={CREAM}>{text}</text></g>; };

// pop-up price card: folds up from the desk (scaleY)
const PopUp = ({x, y, label, val, col, t, a}) => { const p = ramp(t, a, 0.4); if (p < 0.03) return null; return <g transform={`translate(${x} ${y}) scale(1 ${Math.max(0.02, p)})`}>
  <Cut edge={6}><rect x="-130" y="-150" width="260" height="150" rx="6" fill={CREAM} /></Cut>
  <rect x="-130" y="-150" width="260" height="40" rx="6" fill={col} />
  <text x="0" y="-122" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="26" fill={CREAM} letterSpacing="3">{label}</text>
  <text x="0" y="-36" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="70" fill={col}>{val}</text></g>; };

// balance: a paper beam on a stand that tips towards the richer side
const Balance = ({t}) => { const a = s('p6'); const o = ramp(t, a - 0.3, 0.4); const tip = -9 * ramp(t, tw('p7', 'two'), 0.7);
  return <g opacity={o} transform={`translate(0 ${lerp(1200, 0, back(t, a - 0.3, 0.6))})`}>
    <Cut><path d="M 930 880 L 990 880 L 975 520 L 945 520 Z" fill={INK} /><rect x="860" y="870" width="200" height="30" rx="6" fill={INK} /></Cut>
    <g transform={`rotate(${tip} 960 520)`}>
      <Cut><rect x="620" y="508" width="680" height="24" rx="6" fill={INK} /></Cut>
      {[[660, '+2%', TEAL, 'ANN'], [1260, '+1%', CORAL, 'BARBARA']].map(([cx, v, c, n]) => <g key={n} transform={`rotate(${-tip} ${cx} 532)`}>
        <path d={`M ${cx} 532 L ${cx - 70} 640 M ${cx} 532 L ${cx + 70} 640`} stroke={INK} strokeWidth="4" />
        <Cut><path d={`M ${cx - 110} 640 L ${cx + 110} 640 C ${cx + 90} 700 ${cx - 90} 700 ${cx - 110} 640 Z`} fill={c} /></Cut>
        <text x={cx} y="800" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="34" fill={INK}>{n}</text>
        <text x={cx} y="750" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="60" fill={INK}>{v}</text></g>)}
    </g><circle cx="960" cy="520" r="14" fill={MUST} /></g>; };

export const Cutout = () => { const t = useT();
  const out = ramp(t, s('p6') - 0.4, 0.4); // the first set slides away for the balance
  return <AbsoluteFill style={{background: KRAFT}}>
    <Narr /><Sfx at={s('p1')} name="paper" vol={0.35} /><Sfx at={s('p2')} name="paper" vol={0.35} /><Sfx at={s('p4')} name="paper" vol={0.3} /><Sfx at={s('p6') - 0.3} name="whoosh" vol={0.3} />
    <svg width={1920} height={1080}>
      <defs><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="6" dy="10" stdDeviation="7" floodColor="#4A3220" floodOpacity="0.35" /></filter>
        <filter id="fib"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" /><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.14  0 0 0 0.10 0" /></filter></defs>
      <rect width="1920" height="1080" filter="url(#fib)" />
      <g transform={`translate(0 ${out * 1200})`} opacity={1 - out * 0.3}>
        <Person x={520} y={300} col={TEAL} hair="#3A2A20" name="ANN" t={t} a={s('p1')} />
        <Person x={1400} y={300} col={CORAL} hair="#5A3420" name="BARBARA" t={t} a={s('p2')} />
        <Tag x={760} y={250} text="+2%" col={NAVY} t={t} a={tw('p1', 'two')} />
        <Tag x={1650} y={250} text="+5%" col={NAVY} t={t} a={tw('p2', 'five')} rot={7} />
        <g transform={`translate(960 ${lerp(-300, 330, back(t, s('p3'), 0.5))}) rotate(${lerp(-20, 4, ramp(t, s('p3'), 0.5))})`}>
          <Cut><circle cx="0" cy="0" r="78" fill={MUST} /></Cut><text x="0" y="36" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="110" fill={INK}>?</text></g>
        <PopUp x={1400} y={880} label="HER PRICES" val="+4%" col={CORAL} t={t} a={tw('p4', 'four') - 0.1} />
        <PopUp x={520} y={880} label="HER PRICES" val="0%" col={TEAL} t={t} a={tw('p5', 'move') - 0.1} />
      </g>
      <Balance t={t} />
    </svg>
    <Caps bg="rgba(43,42,40,0.88)" hi={MUST} />
  </AbsoluteFill>; };
