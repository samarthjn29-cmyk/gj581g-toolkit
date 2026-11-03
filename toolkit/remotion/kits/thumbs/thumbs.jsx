// Thumbnail style mock-ups (3 Nov 2026), 1280x720 stills: TS05 giant word, TS08 chart drama, TS09 receipt evidence,
// TS10 banknote portrait, TS11 repetition grid, TS15 text behind subject. Topic: "Your Raise Is Lying to You".
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, OS, FR, NoteFrame, Portrait, rosette, wave} from './bank';
import {Folk} from './folk';
import {Img, staticFile} from 'remotion';
import {Rig} from './rig';


const IN = "'Inter', sans-serif";
if (typeof document !== 'undefined' && !window.__k) { window.__k = 1; const {delayRender, continueRender, staticFile} = require('remotion'); const h = delayRender('kalam');
  new FontFace('Kalam', `url(${staticFile('fonts/Kalam-Bold.ttf')})`).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h)); }
const BARB = {skin: '#EDBE98', hair: 'curly', hairColor: '#3B2417', top: 'blazer', topColor: C.ox};
const shadow = '0 18px 40px rgba(30,20,10,0.35)';

// small line icons for the pattern bed
const ICONS = [
  (c) => <g stroke={c} strokeWidth="3" fill="none"><circle cx="0" cy="0" r="16" /><path d="M -6 -6 Q 0 -10 6 -6 M -6 6 Q 0 10 6 6 M 0 -12 L 0 12" /></g>,
  (c) => <g stroke={c} strokeWidth="3" fill="none"><path d="M -18 -10 L 8 -10 L 18 0 L 8 10 L -18 10 Z" /><circle cx="8" cy="0" r="2.5" /></g>,
  (c) => <g stroke={c} strokeWidth="3" fill="none"><path d="M -18 -12 L -12 -12 L -6 8 L 14 8 L 18 -6 L -9 -6" /><circle cx="-4" cy="14" r="3" /><circle cx="11" cy="14" r="3" /></g>,
  (c) => <g stroke={c} strokeWidth="3" fill="none"><rect x="-12" y="-16" width="24" height="32" rx="2" /><path d="M -6 -8 L 6 -8 M -6 -1 L 6 -1 M -6 6 L 2 6" /></g>,
  (c) => <g stroke={c} strokeWidth="3" fill="none"><path d="M -16 12 L -6 0 L 2 6 L 16 -12 M 8 -12 L 16 -12 L 16 -4" /></g>,
];
const Pattern = ({c, op = 0.35}) => <svg width={1280} height={720} style={{position: 'absolute', opacity: op}}>
  {Array.from({length: 12 * 7}, (_, i) => { const x = (i % 12) * 112 + ((Math.floor(i / 12) % 2) * 56) + 30, y = Math.floor(i / 12) * 108 + 40;
    return <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 37) % 30 - 15})`}>{ICONS[i % ICONS.length](c)}</g>; })}</svg>;

// TS05 giant word over an illustrated pattern bed
export const TS05 = () => <AbsoluteFill style={{background: C.green}}>
  <Pattern c={C.gold} op={0.32} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center'}}>
    <span style={{background: C.paper, color: C.green, fontFamily: OS, fontWeight: 700, fontSize: 56, letterSpacing: 6, padding: '4px 26px', borderRadius: 8, boxShadow: shadow}}>YOUR</span></div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: OS, fontWeight: 700, fontSize: 330, lineHeight: 1, color: C.paper, letterSpacing: 4, textShadow: '0 10px 0 rgba(0,0,0,0.25)'}}>RAISE</div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center'}}>
    <span style={{background: C.ox, color: C.paper, fontFamily: OS, fontWeight: 700, fontSize: 64, letterSpacing: 5, padding: '6px 30px', display: 'inline-block', transform: 'rotate(-2deg)', boxShadow: shadow}}>IS LYING</span></div>
</AbsoluteFill>;

// TS08 one dramatic chart with a marker comment
export const TS08 = () => { const X = (i) => 110 + i * 175, pay = [600, 556, 512, 468, 424, 380], pr = [650, 585, 510, 425, 330, 225];
  const line = (a) => a.map((y, i) => `${i ? 'L' : 'M'} ${X(i)} ${y}`).join(' ');
  return <AbsoluteFill style={{background: '#FAF8F3'}}>
    <svg width={1280} height={720} style={{position: 'absolute'}}>
      {Array.from({length: 26}, (_, i) => <line key={'v' + i} x1={i * 50} x2={i * 50} y1="0" y2="720" stroke="#E2DDD2" strokeWidth="1.5" />)}
      {Array.from({length: 15}, (_, i) => <line key={'h' + i} y1={i * 50} y2={i * 50} x1="0" x2="1280" stroke="#E2DDD2" strokeWidth="1.5" />)}
      <path d={line(pay)} stroke={C.green} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={line(pr)} stroke={C.ox} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={X(2) + 40} cy="495" r="58" fill="none" stroke="#141414" strokeWidth="6" />
      <text x={X(5) + 24} y={pay[5] + 14} fontFamily={OS} fontWeight="700" fontSize="44" fill={C.green}>PAY</text>
      <text x={X(5) + 24} y={pr[5] + 14} fontFamily={OS} fontWeight="700" fontSize="44" fill={C.ox}>PRICES</text>
    </svg>
    <div style={{position: 'absolute', left: 70, top: 46, fontFamily: OS, fontWeight: 700, fontSize: 118, color: '#141414', letterSpacing: 1}}>THE LINES <span style={{color: C.ox}}>CROSSED</span></div>
    <div style={{position: 'absolute', left: 120, top: 380, fontFamily: "'Kalam', cursive", fontSize: 56, color: '#141414', transform: 'rotate(-4deg)'}}>this is you →</div>
  </AbsoluteFill>; };

// TS09 a receipt as evidence, the number circled, a sticker
export const TS09 = () => <AbsoluteFill style={{background: 'linear-gradient(135deg,#2B3B34,#1B2420)'}}>
  <div style={{position: 'absolute', left: 120, top: 40, width: 420, height: 640, background: '#FBFAF6', transform: 'rotate(-6deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', padding: '40px 40px', fontFamily: "'JetBrains Mono', monospace", color: '#2A2A2A'}}>
    <div style={{textAlign: 'center', fontWeight: 800, fontSize: 30, letterSpacing: 4}}>CORNER MARKET</div>
    <div style={{textAlign: 'center', fontSize: 18, color: '#777', marginBottom: 26}}>same basket · this year</div>
    {[['BREAD', '2.08'], ['MILK', '1.56'], ['RICE', '3.12'], ['EGGS x12', '4.16'], ['COFFEE', '8.32'], ['APPLES', '3.64']].map(([a, b]) => <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, margin: '10px 0'}}><span>{a}</span><span>{b}</span></div>)}
    <div style={{borderTop: '3px dashed #999', margin: '22px 0 14px'}} />
    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 36, fontWeight: 800}}><span>TOTAL</span><span style={{position: 'relative'}}>22.88
      <svg width="230" height="110" style={{position: 'absolute', left: -60, top: -34}}><ellipse cx="115" cy="55" rx="104" ry="44" fill="none" stroke="#D3312A" strokeWidth="6" transform="rotate(-4 115 55)" /></svg></span></div>
  </div>
  <div style={{position: 'absolute', left: 700, top: 440, background: '#D3312A', color: '#fff', fontFamily: IN, fontWeight: 900, fontSize: 92, padding: '6px 26px', borderRadius: 14, transform: 'rotate(8deg)', boxShadow: shadow}}>▲4%</div>
  <div style={{position: 'absolute', left: 680, top: 170, width: 580, fontFamily: IN, fontWeight: 900, fontSize: 112, lineHeight: 0.98, color: '#F4F1EA', letterSpacing: -4, whiteSpace: 'nowrap'}}>Where my<br />raise <span style={{color: '#FFD23F'}}>went</span></div>
</AbsoluteFill>;

// TS10 the banknote portrait: denomination crossed out and re-stamped
export const TS10 = () => <AbsoluteFill style={{background: '#1C2422'}}>
  <svg width={1280} height={720} style={{position: 'absolute'}}>
    <g transform="rotate(-3 640 360)">
      <NoteFrame x={90} y={110} w={1100} h={500} color={C.green} />
      <Portrait cx={420} cy={360} rx={150} ry={180}><Folk x={420} y={540} h={360} {...BARB} face="worried" /></Portrait>
      <path d={rosette(980, 300, 120, 34, 46, 1600)} stroke={C.green} strokeWidth="0.9" fill="none" opacity="0.5" />
      <text x="980" y="370" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="210" fill={C.green}>5%</text>
      <line x1="830" y1="390" x2="1130" y2="250" stroke={C.ox} strokeWidth="16" strokeLinecap="round" />
      <text x="640" y="170" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="30" letterSpacing="10" fill={C.green}>ONE PAY RAISE</text>
    </g>
    <g transform="translate(960 520) rotate(-10)">
      <rect x="-250" y="-70" width="500" height="140" rx="12" fill={C.paper} stroke={C.ox} strokeWidth="8" />
      <text x="0" y="40" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="96" fill={C.ox}>REALLY 1%</text>
    </g>
  </svg>
</AbsoluteFill>;

// TS11 repetition: a wall of +4% price tags, one +5% payslip in the middle
export const TS11 = () => <AbsoluteFill style={{background: '#EFE9DA'}}>
  {Array.from({length: 6 * 4}, (_, i) => { const c = i % 6, r = Math.floor(i / 6); if (((c === 2 || c === 3) && (r === 1 || r === 2)) || (c === 5 && r === 3)) return null;
    return <div key={i} style={{position: 'absolute', left: 30 + c * 205, top: 30 + r * 170, width: 180, height: 140, transform: `rotate(${((i * 53) % 14) - 7}deg)`}}>
      <div style={{width: '100%', height: '100%', background: C.ox, borderRadius: '10px 50px 50px 10px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: OS, fontWeight: 700, fontSize: 64, color: C.paper}}>+4%</div></div>; })}
  <div style={{position: 'absolute', left: 445, top: 205, width: 390, height: 310, background: '#FFFFFF', borderTop: `30px solid ${C.green}`, boxShadow: '0 30px 60px rgba(0,0,0,0.35)', transform: 'rotate(-3deg)', textAlign: 'center', fontFamily: OS}}>
    <div style={{fontSize: 34, letterSpacing: 6, color: C.green, marginTop: 24, fontWeight: 700}}>MY RAISE</div>
    <div style={{fontSize: 170, fontWeight: 700, color: C.green, lineHeight: 1.05}}>+5%</div></div>
</AbsoluteFill>;

// TS15 the big word behind the subject, duotone
export const TS15 = () => <AbsoluteFill style={{background: C.ox}}>
  <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: OS, fontWeight: 700, fontSize: 420, lineHeight: 1, color: '#E9C7B0', letterSpacing: 6}}>RAISE?</div>
  <svg width={1280} height={720} style={{position: 'absolute'}}>
    <defs><filter id="duo"><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" /><feComponentTransfer><feFuncR type="table" tableValues="0.12 0.98" /><feFuncG type="table" tableValues="0.08 0.92" /><feFuncB type="table" tableValues="0.08 0.86" /></feComponentTransfer></filter></defs>
    <Folk x={640} y={760} h={640} {...BARB} topColor="#24493A" face="surprised" hold={{text: '+5%', color: '#B98B2E'}} />
  </svg>
  <div style={{position: 'absolute', right: 60, top: 520, background: '#F4E3D3', color: C.ox, fontFamily: OS, fontWeight: 700, fontSize: 60, padding: '4px 22px', transform: 'rotate(-4deg)', boxShadow: shadow}}>or +1%?</div>
</AbsoluteFill>;

// ---------------- art, philosophy and science styles (3 Nov 2026) ----------------

// TS18 painting detail + loupe (public-domain painting: Petrus Christus, A Goldsmith in his Shop, 1449, The Met, CC0)
export const TS18 = () => { const X0 = 1000, Y0 = 2300, k = 1280 / 2400, cx = 2080, cy = 3070, Lx = 980, Ly = 300, R = 210, z = 3;
  return <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
    <Img src={staticFile('goldsmith.jpg')} style={{position: 'absolute', left: -X0 * k, top: -Y0 * k, width: 3469 * k, height: 4000 * k}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)'}} />
    <svg width={1280} height={720} style={{position: 'absolute'}}><line x1={(cx - X0) * k} y1={(cy - Y0) * k} x2={Lx - R * 0.7} y2={Ly + R * 0.7} stroke="#F4E9D0" strokeWidth="4" /></svg>
    <div style={{position: 'absolute', left: Lx - R, top: Ly - R, width: R * 2, height: R * 2, borderRadius: R, overflow: 'hidden', border: '10px solid #F4E9D0', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'}}>
      <Img src={staticFile('goldsmith.jpg')} style={{position: 'absolute', width: 3469 * k * z, height: 4000 * k * z, left: R - (cx * k * z), top: R - (cy * k * z)}} /></div>
    <div style={{position: 'absolute', left: 50, top: 520, background: '#F4E9D0', padding: '8px 28px 12px', fontFamily: FR, fontWeight: 700, fontSize: 84, color: '#1C2422', boxShadow: shadow}}>Weigh <i style={{fontFamily: "'FrauncesI', serif"}}>your</i> raise</div>
  </AbsoluteFill>; };

// TS19 a lone figure in vast space
export const TS19 = () => <AbsoluteFill style={{background: 'linear-gradient(180deg,#E9E6DF 0%,#D7D2C8 100%)'}}>
  <svg width={1280} height={720} style={{position: 'absolute'}}>
    <path d="M 0 470 L 1280 300 L 1280 720 L 0 720 Z" fill="#C9C3B7" />
    <path d="M 750 418 L 1240 560 L 1262 548 L 800 410 Z" fill="#000" opacity="0.18" />
    <Rig x={770} y={420} s={0.26} look={{skin: '#EDBE98', hair: 'curly', hairColor: '#3B2417', top: '#7A2333', bottom: '#2F3A48'}} pose={{fa: 14, fb: 16, ba: 14, bb: 16}} walk={0.9} />
  </svg>
  <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: FR, fontSize: 84, color: '#2A2A2A', letterSpacing: 2}}><i style={{fontFamily: "'FrauncesI', serif"}}>more</i> is not <i style={{fontFamily: "'FrauncesI', serif"}}>enough</i></div>
</AbsoluteFill>;

// TS20 classical bust + one word on a brush stroke (photo: Unsplash, Andres Hernandez)
export const TS20 = () => <AbsoluteFill style={{background: '#06110D', overflow: 'hidden'}}>
  <Img src={staticFile('bust.jpg')} style={{position: 'absolute', right: -60, top: -110, height: 1000, WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 30%)', maskImage: 'linear-gradient(90deg, transparent 0%, #000 30%)'}} />
  <svg width={1280} height={720} style={{position: 'absolute'}}>
    <path d="M 40 330 C 200 290 420 300 640 286 C 700 282 760 300 740 330 C 720 360 680 372 620 380 C 430 404 220 410 60 420 C 20 422 10 400 20 380 Z" fill="#B3262B" />
    <path d="M 70 300 C 260 280 520 276 700 270" stroke="#B3262B" strokeWidth="10" fill="none" opacity="0.7" />
    <path d="M 80 430 C 300 418 520 410 660 396" stroke="#B3262B" strokeWidth="6" fill="none" opacity="0.6" />
  </svg>
  <div style={{position: 'absolute', left: 80, top: 286, fontFamily: FR, fontWeight: 700, fontSize: 118, color: '#F4EFE6', letterSpacing: 6}}>ENOUGH?</div>
  <div style={{position: 'absolute', left: 92, top: 440, fontFamily: OS, fontSize: 30, letterSpacing: 8, color: '#C9D6CF'}}>WHAT A RAISE CAN'T BUY</div>
</AbsoluteFill>;

// TS21 engraved plates grid (our Folk busts in guilloché ovals)
export const TS21 = () => { const P = [['THE SAVER', 'bun', '#24493A', 'smile'], ['THE SPENDER', 'curly', '#7A2333', 'happy'], ['THE WORRIER', 'bob', '#35609E', 'sad'], ['THE INVESTOR', 'short', '#B98B2E', 'smug']];
  return <AbsoluteFill style={{background: C.ground}}>
    <svg width={1280} height={720} style={{position: 'absolute'}}>
      {P.map(([lab, hair, col, face], i) => { const cx = 175 + i * 310, cy = 385; return <g key={lab}>
        <Portrait cx={cx} cy={cy} rx={110} ry={140}><Folk x={cx} y={cy + 150} h={280} hair={hair} topColor={col} top="blazer" face={face} skin={['#9A6343', '#EDBE98', '#D8A07A', '#C68A64'][i]} /></Portrait>
        <text x={cx} y={cy + 200} textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="30" letterSpacing="4" fill={C.ink}>{lab}</text></g>; })}
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: 36, textAlign: 'center', fontFamily: FR, fontWeight: 700, fontSize: 104, color: C.green}}>Which one <i style={{fontFamily: "'FrauncesI', serif", color: C.ox}}>are you?</i></div>
  </AbsoluteFill>; };

// TS22 two-tone poster: one symbol (an eye whose iris is a coin), red and black
export const TS22 = () => <AbsoluteFill style={{background: '#B3262B'}}>
  <svg width={1280} height={720} style={{position: 'absolute'}}>
    <path d="M 330 320 Q 640 60 950 320 Q 640 580 330 320 Z" fill="#F2E6D6" />
    <circle cx="640" cy="320" r="140" fill="#111" />
    <circle cx="640" cy="320" r="110" fill="#B98B2E" /><circle cx="640" cy="320" r="90" fill="none" stroke="#8A6420" strokeWidth="6" />
    <text x="640" y="358" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="110" fill="#5E4310">%</text>
    <circle cx="600" cy="280" r="22" fill="#FFFFFF" opacity="0.7" />
  </svg>
  <div style={{position: 'absolute', left: 0, right: 0, top: 545, textAlign: 'center', fontFamily: "'FrauncesI', serif", fontWeight: 700, fontSize: 84, color: '#111'}}>The money illusion</div>
</AbsoluteFill>;

// TS24 minimal diagram on black (conceptual curve of diminishing returns)
export const TS24 = () => { const pts = Array.from({length: 60}, (_, i) => { const x = i / 59; return [140 + x * 1000, 620 - Math.log(1 + x * 12) / Math.log(13) * 380]; });
  return <AbsoluteFill style={{background: '#0B0B0D'}}>
    <svg width={1280} height={720} style={{position: 'absolute'}}>
      <defs><linearGradient id="bar" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#1F5E52" /><stop offset="1" stopColor="#58C4A8" /></linearGradient></defs>
      {pts.filter((_, i) => i % 5 === 2).map(([x, y], i) => <rect key={i} x={x - 30} y={y} width="60" height={620 - y} fill="url(#bar)" opacity="0.85" />)}
      <path d={pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ')} stroke="#F4F1EA" strokeWidth="6" fill="none" />
      <line x1="140" y1="620" x2="1160" y2="620" stroke="#8A8A8A" strokeWidth="3" /><line x1="140" y1="620" x2="140" y2="200" stroke="#8A8A8A" strokeWidth="3" />
    </svg>
    <div style={{position: 'absolute', left: 140, top: 60, fontFamily: FR, fontSize: 96, color: '#F4F1EA'}}>The Curve <i style={{fontFamily: "'FrauncesI', serif"}}>of Enough</i></div>
  </AbsoluteFill>; };

// Raise_v1 thumbnail, TS22 two-tone poster in the Dollar Yardstick identity (3 Nov 2026)
export const RaiseTS22 = () => <AbsoluteFill style={{background: C.ox}}>
  <svg width={1280} height={720} style={{position: 'absolute'}}>
    {Array.from({length: 18}, (_, i) => <path key={i} d={wave(-20, 20 + i * 40, 1320, 26, 8, i * 0.6)} stroke="#8A2C3C" strokeWidth="1.4" fill="none" />)}
    <path d="M 290 290 Q 640 40 990 290 Q 640 620 290 290 Z" fill={C.ground} />
    <circle cx="640" cy="290" r="146" fill={C.ink} />
    <circle cx="640" cy="290" r="118" fill={C.gold} />
    <path d={rosette(640, 290, 112, 33, 44, 1800)} stroke="#8F6A1F" strokeWidth="1.1" fill="none" opacity="0.9" />
    <circle cx="640" cy="290" r="80" fill={C.gold} stroke="#8F6A1F" strokeWidth="5" />
    <text x="640" y="326" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="100" fill="#4E3A10">5%</text>
    <ellipse cx="600" cy="238" rx="26" ry="18" fill="#FFFFFF" opacity="0.55" transform="rotate(-30 600 238)" />
    <path d="M 700 520 C 676 560 668 584 668 600 C 668 624 688 640 708 640 C 728 640 748 624 748 600 C 748 584 740 560 708 520 Z" fill={C.ink} transform="translate(-6 -100)" />
    <text x="702" y="530" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="30" fill={C.ground}>1%</text>
  </svg>
  <div style={{position: 'absolute', left: 0, right: 0, top: 34, textAlign: 'center', fontFamily: OS, fontWeight: 700, fontSize: 26, letterSpacing: 10, color: '#E8C9B6'}}>THE DOLLAR YARDSTICK · NO. 1</div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 572, textAlign: 'center', fontFamily: "'FrauncesI', serif", fontWeight: 700, fontSize: 80, color: C.ground}}>The money illusion</div>
</AbsoluteFill>;
