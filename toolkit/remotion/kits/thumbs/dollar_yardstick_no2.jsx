// The Dollar Yardstick No. 2 ("Twice") thumbnails, 4 Nov 2026. Drawn at 1920x1080, rendered at scale 2/3 -> 1280x720.
// Numbers exactly as in the video: +9% (Aon 2026 average; Sam's illustrative raise), +0.8% (1.09 x 88.37/95.52 - 1 = +0.84%, FRED EXINUS Oct-Oct averages),
// ~95 rupees per dollar (ECB / FRED DEXINUS, 30 Oct 2026). Safe zones: 60 px from every edge, bottom-right 210x90 kept empty (duration badge).
import React from 'react';
import {AbsoluteFill, staticFile, delayRender, continueRender} from 'remotion';
import {C, OS, FR, FI, IN, wave} from './bank';
import {Rig} from './rig';
import {BARB, SAM} from './twice';

if (typeof document !== 'undefined') { const h = delayRender('kalam');
  new FontFace('Kalam', `url(${staticFile('fonts/Kalam-Bold.ttf')})`).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h)); }

const W = 1920, H = 1080;
const Waves = ({bg, line, n = 28}) => <AbsoluteFill style={{background: bg}}>
  <svg width={W} height={H} style={{position: 'absolute'}}>{Array.from({length: n}, (_, i) => <path key={i} d={wave(-40, i * 40, 2000, 30, 9, i * 0.5)} stroke={line} strokeWidth="1.6" fill="none" />)}</svg>
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.22) 100%)'}} />
</AbsoluteFill>;

// series tag with the ruler icon (PW-06)
const Tag = ({c = '#E9D9C3', top = 54}) => <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
  <svg width="74" height="26"><rect x="1" y="3" width="72" height="20" rx="3" fill="none" stroke={c} strokeWidth="3" />{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={9 + i * 8} y1="3" x2={9 + i * 8} y2={i % 4 ? 11 : 16} stroke={c} strokeWidth="2.5" />)}</svg>
  <div style={{fontFamily: OS, fontWeight: 500, fontSize: 40, letterSpacing: 13, color: c}}>THE DOLLAR YARDSTICK · NO. 2</div>
</div>;

// a gold coin with depth (rim, face gradient, highlight)
const Coin = ({x, y, r, label = '₹', face = '#E2B54A', rim = '#9C7324', side = 0}) => <g>
  {side ? <rect x={x - r} y={y} width={2 * r} height={side} fill={rim} /> : null}
  {side ? <ellipse cx={x} cy={y + side} rx={r} ry={r * 0.32} fill={rim} /> : null}
  <ellipse cx={x} cy={y} rx={r} ry={side ? r * 0.32 : r} fill={`url(#cg)`} stroke={rim} strokeWidth={r * 0.06} />
  {!side ? <><circle cx={x} cy={y} r={r * 0.8} fill="none" stroke={rim} strokeWidth={r * 0.05} />
    <text x={x} y={y + r * 0.36} textAnchor="middle" fontFamily={FR} fontWeight={700} fontSize={r * 1.05} fill="#7A5716">{label}</text>
    <ellipse cx={x - r * 0.35} cy={y - r * 0.42} rx={r * 0.28} ry={r * 0.14} fill="#FFF3C8" opacity="0.7" transform={`rotate(-30 ${x - r * 0.35} ${y - r * 0.42})`} /></> : null}
</g>;
const Defs = () => <defs>
  <radialGradient id="cg" cx="40%" cy="35%" r="75%"><stop offset="0" stopColor="#F8DC86" /><stop offset="0.55" stopColor="#D9A93E" /><stop offset="1" stopColor="#A57A25" /></radialGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F3E2B4" /><stop offset="0.5" stopColor="#E2C98A" /><stop offset="1" stopColor="#B8975A" /></linearGradient>
  <linearGradient id="sage" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF1E4" /><stop offset="0.5" stopColor="#D5DEC6" /><stop offset="1" stopColor="#A9B798" /></linearGradient>
  <filter id="sh" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000" floodOpacity="0.35" /></filter>
</defs>;

// A. Two rulers (poster symbol, oxblood like No. 1): the same raise read on two rulers.
const Ruler = ({y, fill, label, unit = 64}) => <g filter="url(#sh)">
  <rect x={210} y={y} width={1500} height={120} rx={10} fill={fill} stroke="#3B2A16" strokeWidth={3} />
  {Array.from({length: 24}, (_, i) => <line key={i} x1={250 + i * unit} y1={y} x2={250 + i * unit} y2={y + (i % 5 ? 30 : 56)} stroke="#3B2A16" strokeWidth={i % 5 ? 3 : 5} />).filter((_, i) => 250 + i * unit < 1690)}
  <text x={1680} y={y + 98} textAnchor="end" fontFamily={OS} fontWeight={700} fontSize={34} letterSpacing={6} fill="#3B2A16">{label}</text>
</g>;
export const ThumbA = () => <AbsoluteFill>
  <Waves bg="#7A2333" line="rgba(255,255,255,0.07)" />
  <Tag />
  <svg width={W} height={H} style={{position: 'absolute'}}><Defs />
    <Ruler y={310} fill="url(#brass)" label="IN RUPEES" />
    <rect x={250} y={236} width={1180} height={50} rx={6} fill="#E2B54A" />
    <Ruler y={630} fill="url(#sage)" label="IN DOLLARS" unit={69} />
    <rect x={250} y={556} width={300} height={50} rx={6} fill="#E2B54A" opacity="0.95" />
  </svg>
  <div style={{position: 'absolute', left: 1452, top: 196, fontFamily: OS, fontWeight: 700, fontSize: 104, color: '#F7F3E8', lineHeight: 1}}>+9%</div>
  <div style={{position: 'absolute', left: 572, top: 516, fontFamily: OS, fontWeight: 700, fontSize: 104, color: '#F2C9A0', lineHeight: 1}}>+0.8%</div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontFamily: FI, fontWeight: 700, fontSize: 160, color: '#F4ECDD', lineHeight: 1}}>Same raise.</div>
</AbsoluteFill>;

// B. The seesaw (symbol with depth, green): one dollar balanced by a tall pile of rupees.
export const ThumbB = () => { const stack = Array.from({length: 12}, (_, i) => i);
  return <AbsoluteFill>
    <Waves bg="#24493A" line="rgba(255,255,255,0.06)" />
    <Tag c="#DCE6D2" />
    <svg width={W} height={H} style={{position: 'absolute'}}><Defs />
      <g filter="url(#sh)">
        <polygon points="860,880 1060,880 960,700" fill="#B98B2E" /><rect x={800} y={880} width={320} height={26} rx={6} fill="#8A6620" />
        <rect x={330} y={668} width={1260} height={30} rx={15} fill="#6B4A2E" />
        <circle cx={960} cy={684} r={20} fill="#E2B54A" />
      </g>
      {/* the dollar: one note-green coin */}
      <g filter="url(#sh)"><Coin x={500} y={545} r={118} label="$" /></g>
      {/* the rupees: a tall stack */}
      <g filter="url(#sh)">{stack.map((i) => <Coin key={i} x={1360 + (i % 2) * 6} y={640 - i * 30} r={112} side={30} />)}
        <Coin x={1366} y={640 - 11 * 30 - 2} r={112} side={0} label="₹" /></g>
    </svg>
    <div style={{position: 'absolute', left: 1530, top: 300, fontFamily: OS, fontWeight: 700, fontSize: 110, color: '#F7F3E8', lineHeight: 1}}>₹95</div>
    <div style={{position: 'absolute', left: 290, top: 300, fontFamily: OS, fontWeight: 700, fontSize: 110, color: '#F7F3E8', lineHeight: 1}}>$1</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 930, textAlign: 'center', fontFamily: FR, fontWeight: 700, fontSize: 100, color: '#F4ECDD', lineHeight: 1}}>
      Why so <i style={{fontFamily: FI, color: '#E9C46A'}}>many</i> rupees?</div>
  </AbsoluteFill>; };

// C. Editorial type on paper: the two numbers, one ruler, a hand note.
export const ThumbC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #FBF8F0 0%, #EAE3D2 100%)'}}>
  <Tag c="#7A6E5C" />
  <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: IN, fontWeight: 900, fontSize: 330, letterSpacing: -14, color: '#141414', lineHeight: 1}}>
    +9% <i style={{fontFamily: FI, fontWeight: 400, fontSize: 220, letterSpacing: -4, color: '#5A5246'}}>is</i></div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: IN, fontWeight: 900, fontSize: 330, letterSpacing: -14, color: '#7A2333', lineHeight: 1}}>+0.8%</div>
  <svg width={W} height={H} style={{position: 'absolute'}}>
    <path d="M 520 880 C 520 830 560 820 610 820" stroke="#1A1A1A" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M 594 802 L 614 820 L 594 840" stroke="#1A1A1A" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  <div style={{position: 'absolute', left: 640, top: 790, fontFamily: "'Kalam', cursive", fontSize: 84, color: '#1A1A1A', transform: 'rotate(-3deg)'}}>…measured in dollars</div>
</AbsoluteFill>;

// D. Characters with the hero object: two pay slips, who got the bigger raise?
const BigSlip = ({x, y, rot, text, cur, color}) => <div style={{position: 'absolute', left: x, top: y, width: 470, height: 330, transform: `rotate(${rot}deg)`, background: '#FFFFFF', borderRadius: 14,
  boxShadow: '0 18px 30px rgba(0,0,0,0.28)', overflow: 'hidden'}}>
  <div style={{height: 70, background: color, color: '#F7F3E8', fontFamily: OS, fontWeight: 700, fontSize: 40, letterSpacing: 6, display: 'flex', alignItems: 'center', paddingLeft: 30}}>PAY RAISE · {cur}</div>
  <div style={{textAlign: 'center', fontFamily: OS, fontWeight: 700, fontSize: 200, color, lineHeight: '240px'}}>{text}</div>
</div>;
export const ThumbD = () => <AbsoluteFill>
  <Waves bg="#EFE9DA" line="#E2DAC6" />
  <Tag c="#7A6E5C" />
  <svg width={W} height={H} style={{position: 'absolute'}}>
    <ellipse cx={330} cy={1040} rx={190} ry={22} fill="rgba(0,0,0,0.12)" /><ellipse cx={1590} cy={1040} rx={190} ry={22} fill="rgba(0,0,0,0.12)" />
    <Rig x={330} y={1040} s={1.2} look={BARB} face="smug" turn={1} pose={{fa: 40, fb: 30, ba: 8, bb: 10, tilt: 4}} />
    <Rig x={1590} y={1040} s={1.2} look={SAM} face="happy" turn={-1} pose={{fa: 40, fb: 30, ba: 8, bb: 10, tilt: -4}} />
  </svg>
  <BigSlip x={960} y={340} rot={4} text="+9%" cur="₹" color={C.green} />
  <BigSlip x={400} y={370} rot={-4} text="+5%" cur="$" color={C.ox} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
    <span style={{background: '#1C2422', color: '#F4ECDD', fontFamily: FR, fontWeight: 700, fontSize: 92, padding: '6px 34px 14px', borderRadius: 8}}>Who got <i style={{fontFamily: FI, color: '#E9C46A'}}>more?</i></span></div>
</AbsoluteFill>;
