// Dollar Yardstick No. 3 "The Trial of the Dollar": new cast design sheet (4 Nov 2026). Options per role; Sam picks one per role.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, OS, FR, IN} from './bank';
import {Rig, shade} from './rig3';
import {HECK} from './heckler';

const gavel = (hx, hy) => <g transform={`translate(${hx} ${hy}) rotate(-30)`}><rect x="-6" y="-10" width="12" height="90" rx="5" fill="#6B4A2E" /><rect x="-34" y="-34" width="68" height="34" rx="8" fill="#4E3420" /></g>;
const scroll = (hx, hy) => <g transform={`translate(${hx} ${hy - 30})`}><rect x="-40" y="-60" width="80" height="110" rx="4" fill="#F7F3E8" stroke="#CFC5AE" strokeWidth="3" />{[0, 1, 2, 3, 4].map((i) => <line key={i} x1="-28" x2="28" y1={-40 + i * 18} y2={-40 + i * 18} stroke="#B9B2A2" strokeWidth="4" />)}<rect x="-44" y="-68" width="88" height="14" rx="7" fill="#B98B2E" /></g>;
const brief = (hx, hy) => <g transform={`translate(${hx} ${hy + 40})`}><rect x="-50" y="-10" width="100" height="70" rx="8" fill="#3B2A1E" /><rect x="-18" y="-24" width="36" height="16" rx="5" fill="none" stroke="#3B2A1E" strokeWidth="6" /><rect x="-6" y="14" width="12" height="10" fill="#B98B2E" /></g>;
const teacup = (hx, hy) => <g transform={`translate(${hx} ${hy - 10})`}><ellipse cx="0" cy="22" rx="34" ry="7" fill="#E9E1CC" /><path d="M -24 -10 L 24 -10 L 18 18 L -18 18 Z" fill="#FFFFFF" stroke="#D8CFBA" strokeWidth="2" /><path d="M 24 -2 C 36 -2 36 12 22 12" stroke="#D8CFBA" strokeWidth="5" fill="none" /></g>;
const lily = (hx, hy) => <g transform={`translate(${hx} ${hy})`}><line x1="0" y1="10" x2="0" y2="-110" stroke="#3E6B4A" strokeWidth="6" /><path d="M 0 -110 C -30 -140 -24 -170 0 -150 C 24 -170 30 -140 0 -110 Z" fill="#FFFFFF" stroke="#D8CFBA" strokeWidth="2" /></g>;
const shovel = (hx, hy) => <g transform={`translate(${hx} ${hy}) rotate(8)`}><rect x="-5" y="-150" width="10" height="200" fill="#6B4A2E" /><path d="M -26 40 L 26 40 L 20 96 Q 0 112 -20 96 Z" fill="#8A8070" /></g>;
const point = null;

// The defendant: the Dollar as a banknote character (our own design: no real portrait, no real note layout)
const NoteMan = ({x, y, s = 1, face = 'smug', hat = false, monocle = false}) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <ellipse cx="0" cy="0" rx="120" ry="16" fill="#000" opacity="0.1" />
  <path d="M -40 -150 L -50 0 M 40 -150 L 50 0" stroke="#1C2422" strokeWidth="18" strokeLinecap="round" />
  <path d="M -74 2 L -30 2 M 30 2 L 74 2" stroke="#1C2422" strokeWidth="22" strokeLinecap="round" />
  <path d="M -165 -330 L -250 -230 M 165 -330 L 262 -290" stroke="#1C2422" strokeWidth="18" strokeLinecap="round" />
  <circle cx="-250" cy="-230" r="20" fill="#F4F1EA" /><circle cx="262" cy="-290" r="20" fill="#F4F1EA" />
  <rect x="-170" y="-470" width="340" height="330" rx="18" fill="#DDE5D0" stroke="#24493A" strokeWidth="10" />
  <rect x="-150" y="-450" width="300" height="290" rx="10" fill="none" stroke="#24493A" strokeWidth="3" />
  <ellipse cx="0" cy="-310" rx="86" ry="100" fill="#EFE9DA" stroke="#B98B2E" strokeWidth="8" />
  {[-120, 120].map((cx) => <g key={cx}><circle cx={cx} cy="-420" r="22" fill="none" stroke="#24493A" strokeWidth="4" /><text x={cx} y="-410" textAnchor="middle" fontFamily={FR} fontWeight={700} fontSize="28" fill="#24493A">1</text></g>)}
  <text x="0" y="-176" textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize="26" letterSpacing="6" fill="#24493A">ONE DOLLAR-ISH</text>
  {/* face in the oval */}
  <circle cx="-30" cy="-326" r="9" fill="#1C2422" /><circle cx="30" cy="-326" r="9" fill="#1C2422" />
  {face === 'smug' ? <path d="M -30 -270 Q 6 -252 34 -282" stroke="#1C2422" strokeWidth="7" fill="none" strokeLinecap="round" /> : <path d="M -26 -270 Q 0 -286 26 -270" stroke="#1C2422" strokeWidth="7" fill="none" strokeLinecap="round" />}
  <path d="M -52 -356 L -12 -350 M 12 -354 L 52 -360" stroke="#1C2422" strokeWidth="7" strokeLinecap="round" />
  {monocle && <g><circle cx="30" cy="-326" r="24" fill="none" stroke="#B98B2E" strokeWidth="5" /><path d="M 54 -326 C 70 -300 70 -260 60 -230" stroke="#B98B2E" strokeWidth="3" fill="none" /></g>}
  {hat && <g><rect x="-60" y="-600" width="120" height="120" rx="6" fill="#1C1A18" /><rect x="-60" y="-510" width="120" height="16" fill="#B98B2E" /><ellipse cx="0" cy="-480" rx="100" ry="14" fill="#141210" /></g>}
</g>;

const CoinMan = ({x, y, s = 1}) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <ellipse cx="0" cy="0" rx="100" ry="14" fill="#000" opacity="0.1" />
  <path d="M -28 -240 L -34 0 M 28 -240 L 34 0" stroke="#24493A" strokeWidth="40" strokeLinecap="round" />
  <path d="M -66 -420 C -80 -380 -70 -280 -60 -230 L 60 -230 C 70 -280 80 -380 66 -420 C 40 -436 -40 -436 -66 -420 Z" fill="#24493A" />
  <path d="M -14 -430 L 14 -430 L 18 -330 L 0 -310 L -18 -330 Z" fill="#B98B2E" />
  <path d="M -66 -410 L -110 -300 M 66 -410 L 120 -330" stroke="#24493A" strokeWidth="34" strokeLinecap="round" />
  <circle cx="-110" cy="-300" r="17" fill="#E2B54A" /><circle cx="120" cy="-330" r="17" fill="#E2B54A" />
  <circle cx="0" cy="-540" r="100" fill="#E2B54A" stroke="#9C7324" strokeWidth="10" />
  <circle cx="0" cy="-540" r="80" fill="none" stroke="#9C7324" strokeWidth="4" />
  <circle cx="-28" cy="-556" r="9" fill="#1C2422" /><circle cx="28" cy="-556" r="9" fill="#1C2422" />
  <path d="M -30 -506 Q 0 -488 30 -506" stroke="#1C2422" strokeWidth="7" fill="none" strokeLinecap="round" />
  <text x="0" y="-600" textAnchor="middle" fontFamily={FR} fontWeight={700} fontSize="34" fill="#7A5716">$</text>
</g>;

// looks: the options (skin tones varied; none copies a real person)
const L = {
  J1: {skin: '#E6B896', hair: 'bald', hairColor: '#BDB6AA', top: '#1C1A18', robe: '#7A2333', bottom: '#2A2522', collar: 'jabot', hat: 'judgewig', glasses: true},
  J2: {skin: '#8D5B3E', hair: 'bun', hairColor: '#CFC8BC', top: '#1C1A18', robe: '#1C1A18', bottom: '#2A2522', collar: 'bands', glasses: true},
  J3: {skin: '#C68E68', hair: 'bald', hairColor: '#E7E2D8', top: '#1C1A18', robe: '#24493A', bottom: '#2A2522', collar: 'bands', beard: 'beard'},
  P1: {skin: '#F1C7A4', hair: 'long', hairColor: '#7A2E1E', top: '#2F3A48', robe: '#1C1A18', bottom: '#2A2522', collar: 'bands', hat: 'wig'},
  P2: {skin: '#A86F4C', hair: 'swept', hairColor: '#17110E', top: '#7A2333', bottom: '#2F3A48', tie: '#B98B2E', beard: 'moustache'},
  P3: {skin: '#5E3B2A', hair: 'afro', hairColor: '#1E1A18', top: '#7A2333', robe: '#1C1A18', bottom: '#2A2522', collar: 'bands', glasses: true},
  D1: {skin: '#E8C2A0', hair: 'swept', hairColor: '#C9A46A', top: '#2E4A5E', bottom: '#2E4A5E', tie: '#B98B2E'},
  D2: {skin: '#C98B62', hair: 'short', hairColor: '#17110E', top: '#24493A', robe: '#1C1A18', bottom: '#2A2522', collar: 'bands', hat: 'wig', glasses: true},
  D3: {skin: '#7A4E36', hair: 'bald', hairColor: '#D8D2C6', top: '#3E3A36', bottom: '#3E3A36', tie: '#7A2333', beard: 'moustache', hat: 'bowler', hatColor: '#3E3A36'},
  U1: {skin: '#E9D3BC', hair: 'short', hairColor: '#2A2522', top: '#1C1A18', bottom: '#1C1A18', tie: '#1C1A18', hat: 'top', hatColor: '#1C1A18'},
  U2: {skin: '#B07A56', hair: 'bald', hairColor: '#2A2522', top: '#1C1A18', bottom: '#1C1A18', tie: '#7A2333', beard: 'moustache', hat: 'bowler'},
  U3: {skin: '#D9A27E', hair: 'long', hairColor: '#1E1A18', top: '#1C1A18', bottom: '#1C1A18', hat: 'veil', hatColor: '#1C1A18'},
};

const Cell = ({x, id, name, trait, children}) => <g>
  {children}
  <text x={x} y={1040} textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize="34" letterSpacing="3" fill={C.green}>{id}</text>
  <text x={x} y={1078} textAnchor="middle" fontFamily={IN} fontWeight={600} fontSize="22" fill={C.ink}>{name}</text>
  <text x={x} y={1106} textAnchor="middle" fontFamily={IN} fontSize="20" fill={C.mute}>{trait}</text>
</g>;
const Row = ({y, children}) => <g transform={`translate(0 ${y})`}>{children}</g>;
const Head = ({x, w, t}) => <g><rect x={x} y={60} width={w} height={54} rx="6" fill={C.green} /><text x={x + w / 2} y={98} textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize="30" letterSpacing="8" fill="#F7F3E8">{t}</text></g>;

const S = 0.95, GY = 980;
export const CastSheet = () => <AbsoluteFill style={{background: C.ground}}>
  <svg width={3000} height={2500}>
    <text x={1500} y={40} textAnchor="middle" fontFamily={FR} fontWeight={700} fontSize="40" fill={C.ink} dy="10">The Trial of the Dollar · new cast, design options (pick one per role)</text>
    <Row y={20}>
      <Head x={60} w={1380} t="THE JUDGE" /><Head x={1560} w={1380} t="COUNSEL FOR THE PROSECUTION" />
      {[['J1', 'Wig and red robe', 'British-court grandeur'], ['J2', 'Black robe, bands', 'stern, peers over glasses'], ['J3', 'Green robe, beard', 'kindly, quietly baffled']].map(([id, n, t], i) =>
        <Cell key={id} x={290 + i * 460} id={id} name={n} trait={t}><Rig x={290 + i * 460} y={GY} s={S} look={L[id]} face={['smug', 'neutral', 'thinking'][i]} pose={i === 0 ? {fa: 70, fb: 40} : {}} frontItem={i === 0 ? gavel : i === 1 ? gavel : null} /></Cell>)}
      {[['P1', 'Wig, black gown', 'theatrical pointer'], ['P2', 'Oxblood suit', 'fiery, waves papers'], ['P3', 'Gown and glasses', 'precise, never smiles']].map(([id, n, t], i) =>
        <Cell key={id} x={1790 + i * 460} id={id} name={n} trait={t}><Rig x={1790 + i * 460} y={GY} s={S} look={L[id]} turn={-1} face={['pushy', 'impatient', 'neutral'][i]} pose={i === 0 ? {fa: 95, fb: 0} : {fa: 40, fb: 50}} frontItem={i === 1 ? scroll : i === 2 ? scroll : null} /></Cell>)}
    </Row>
    <Row y={1180}>
      <Head x={60} w={1380} t="COUNSEL FOR THE DEFENCE" /><Head x={1560} w={880} t="THE UNDERTAKER" /><Head x={2480} w={460} t="REFERENCE" />
      {[['D1', 'Navy suit, gold tie', 'smooth, unbothered'], ['D2', 'Wig and gown', 'calm, sips tea'], ['D3', 'Bowler, moustache', 'old-school charm']].map(([id, n, t], i) =>
        <Cell key={id} x={290 + i * 460} id={id} name={n} trait={t}><Rig x={290 + i * 460} y={GY} s={S} look={L[id]} face={['smug', 'smile', 'happy'][i]} pose={{fa: 40, fb: 50}} frontItem={i === 0 ? brief : i === 1 ? teacup : null} /></Cell>)}
      {[['U1', 'Tall top hat', 'gloomy, reuses the coffin'], ['U2', 'Bowler, moustache', 'cheerfully morbid']].map(([id, n, t], i) =>
        <Cell key={id} x={1780 + i * 440} id={id} name={n} trait={t}><Rig x={1780 + i * 440} y={GY} s={S} look={L[id]} turn={-1} face={['sad', 'smile'][i]} pose={{fa: 30, fb: 40}} frontItem={i === 0 ? lily : shovel} /></Cell>)}
      <Cell x={2710} id="HECKLER" name="(stays, for scale)" trait="public gallery"><Rig x={2710} y={GY} s={S} look={HECK} face="impatient" /></Cell>
    </Row>
  </svg>
</AbsoluteFill>;

export const DefendantSheet = () => <AbsoluteFill style={{background: C.ground}}>
  <svg width={1920} height={1080}>
    <text x={960} y={70} textAnchor="middle" fontFamily={FR} fontWeight={700} fontSize="44" fill={C.ink}>The defendant: the Dollar (pick one, or none)</text>
    <NoteMan x={360} y={900} s={1} />
    <NoteMan x={960} y={900} s={1} hat monocle />
    <CoinMan x={1560} y={900} s={1.05} />
    {[['X1', 'Banknote, smug', 360], ['X2', 'Banknote, top hat + monocle', 960], ['X3', 'Coin-head in a green suit', 1560]].map(([id, n, x]) => <g key={id}>
      <text x={x} y={980} textAnchor="middle" fontFamily={OS} fontWeight={700} fontSize="40" letterSpacing="3" fill={C.green}>{id}</text>
      <text x={x} y={1024} textAnchor="middle" fontFamily={IN} fontWeight={600} fontSize="26" fill={C.ink}>{n}</text></g>)}
  </svg>
</AbsoluteFill>;
