// Style options board (2 Nov 2026): the same moment drawn six ways. Numbers are draft (OECD average wages, UK, 2010-2025).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import './lib';
import {Folk} from './folk';
const P = {parch: '#EFE6D2', card: '#FFFFFF', ink: '#1F1B16', grey: '#8A8278', soft: '#D9CFBC', yellow: '#F2C230', red: '#C2462E', navy: '#2E3A59', terra: '#C4623F'};
const OS = "'Oswald', 'Inter', sans-serif", FR = "'Fraunces', Georgia, serif", FI = "'FrauncesI', Georgia, serif", IN = "'Inter', sans-serif", MO = "'JetBrains Mono', monospace";
const T = ({x, y, children, s = 40, f = IN, w = 700, c = P.ink, a = 'left', ls = 0, style}) => <div style={{position: 'absolute', left: x, top: y, fontFamily: f, fontWeight: w, fontSize: s, color: c, textAlign: a, letterSpacing: ls, whiteSpace: 'nowrap', transform: a === 'center' ? 'translateX(-50%)' : a === 'right' ? 'translateX(-100%)' : 'none', ...style}}>{children}</div>;
const Card = ({x, y, w, h, children, rot = 0, bg = P.card, shadow = true}) => <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: bg, borderRadius: 10, transform: `rotate(${rot}deg)`, boxShadow: shadow ? '0 18px 40px rgba(60,45,20,0.18), 0 2px 6px rgba(60,45,20,0.12)' : 'none'}}>{children}</div>;
const Src = ({t, c = P.grey}) => <T x={60} y={1018} s={20} w={500} c={c} f={IN}>{t}</T>;
const Bars = ({x, y, w}) => <>
  <T x={x} y={y} s={30} f={OS} w={500} c={P.grey} ls={2}>ON PAPER</T>
  <div style={{position: 'absolute', left: x, top: y + 50, width: w, height: 70, background: P.soft, borderRadius: 6}} />
  <T x={x + w + 24} y={y + 48} s={64} f={OS} w={700}>+52%</T>
  <T x={x} y={y + 160} s={30} f={OS} w={500} c={P.grey} ls={2}>AFTER INFLATION</T>
  <div style={{position: 'absolute', left: x, top: y + 210, width: w * 0.055, height: 70, background: P.yellow, borderRadius: 6}} />
  <T x={x + w * 0.055 + 24} y={y + 208} s={64} f={OS} w={700}>+3%</T>
</>;

// 1. S5 parchment data documentary
export const M1 = () => <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #F5EEDD 0%, ${P.parch} 60%, #E2D6BD 100%)`}}>
  <T x={80} y={70} s={26} f={OS} w={500} c={P.grey} ls={4}>THE PAY RISE TEST · UNITED KINGDOM</T>
  <T x={80} y={110} s={84} f={FR} w={700}>Fifteen years of raises</T>
  <Card x={80} y={300} w={1180} h={460}><Bars x={60} y={60} w={820} /></Card>
  <Card x={1340} y={300} w={500} h={460}>
    <T x={40} y={40} s={24} f={OS} w={500} c={P.grey} ls={3}>WHERE THE 52% WENT</T>
    {[['Prices rose', '+48%', P.ink], ['Your extra', '+3%', P.ink]].map(([a, b], i) => <React.Fragment key={i}><T x={40} y={120 + i * 120} s={40} f={FR} w={400}>{a}</T><T x={460} y={110 + i * 120} s={56} f={OS} w={700} a="right" c={i ? P.red : P.ink}>{b}</T></React.Fragment>)}
    <div style={{position: 'absolute', left: 40, top: 340, width: 420, height: 3, background: P.soft}} />
    <T x={40} y={370} s={28} f={FI} w={400} c={P.grey}>“the money illusion”</T>
  </Card>
  <div style={{position: 'absolute', left: 760, top: 600, border: `6px solid ${P.red}`, color: P.red, fontFamily: OS, fontWeight: 700, fontSize: 52, padding: '4px 22px', transform: 'rotate(-8deg)', letterSpacing: 4, borderRadius: 6, opacity: 0.9}}>MOSTLY ILLUSION</div>
  <Src t="Source (draft): OECD average annual wages, national currency, current vs constant prices, 2010-2025" />
</AbsoluteFill>;

// 2. Flat vector characters in a set
export const M2 = () => <AbsoluteFill style={{background: '#F4EBDD'}}>
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
    <rect x="0" y="0" width="1920" height="760" fill="#EADFCB" />
    <rect x="1380" y="120" width="380" height="300" rx="14" fill="#C9D8DF" /><rect x="1380" y="262" width="380" height="16" fill="#EADFCB" /><rect x="1562" y="120" width="16" height="300" fill="#EADFCB" />
    <rect x="160" y="200" width="300" height="20" rx="6" fill="#B79C7A" />{[['#2E3A59', 60], ['#C4623F', 80], ['#F2C230', 50], ['#7E8F6A', 70]].map(([c, h], i) => <rect key={i} x={180 + i * 64} y={200 - h} width="52" height={h} rx="4" fill={c} />)}
    <rect x="0" y="760" width="1920" height="320" fill="#D8C7A9" /><rect x="0" y="760" width="1920" height="14" fill="#CBB898" />
    <Folk x={640} y={900} h={600} hair="bob" hairColor="#3A2A22" skin="#F1C7A4" top="blazer" topColor={P.navy} face="thinking" hold={{text: '+2%', color: P.yellow}} />
    <Folk x={1260} y={900} h={600} hair="curly" hairColor="#1E1A18" skin="#8D5B3E" top="sweater" topColor={P.terra} face="happy" hold={{text: '+5%', color: P.yellow}} tilt={-3} />
  </svg>
  <T x={640} y={930} s={44} f={FR} a="center">Ann · prices flat</T>
  <T x={1260} y={930} s={44} f={FR} a="center">Barbara · prices +4%</T>
  <T x={960} y={60} s={64} f={FR} w={700} a="center">Who is better off?</T>
</AbsoluteFill>;

// 3. S7 montage essay: graded stock footage + big type
export const M3 = () => <AbsoluteFill style={{background: '#000'}}>
  <Img src={staticFile('mock/crowd.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.55) sepia(0.25) contrast(1.05) brightness(0.62)'}} />
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,14,8,0) 40%, rgba(20,14,8,0.75) 100%)'}} />
  <T x={120} y={690} s={110} f={FI} w={700} c="#FFFFFF">Everyone got a raise.</T>
  <T x={124} y={840} s={56} f={FR} w={400} c={P.yellow}>So why does nobody feel richer?</T>
  <Src t="Stock footage: Mixkit (generic commuters, not the people in the data)" c="rgba(255,255,255,0.6)" />
</AbsoluteFill>;

// 4. S6 engineering sheet: diagram panel + callout column
export const M4 = () => { const gx = (t) => 160 + t * 64, gy = (v) => 860 - v * 7;
  const W = [0, 2, 5, 8, 11, 14, 17, 20, 24, 28, 32, 36, 41, 46, 49, 52], Pz = [0, 3, 6, 8, 10, 11, 12, 14, 16, 19, 24, 32, 39, 44, 46, 48];
  return <AbsoluteFill style={{background: '#F3EEDF', backgroundImage: 'linear-gradient(#E4DCC6 1px, transparent 1px), linear-gradient(90deg, #E4DCC6 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
  <div style={{position: 'absolute', left: 60, top: 60, width: 1180, height: 900, border: `3px solid ${P.ink}`}} />
  <svg width={1920} height={1080} style={{position: 'absolute'}}>
    <path d={`M 160 860 L 1180 860 M 160 860 L 160 420`} stroke={P.ink} strokeWidth="3" />
    <polyline points={W.map((v, i) => `${gx(i)},${gy(v)}`).join(' ')} fill="none" stroke={P.navy} strokeWidth="7" />
    <polyline points={Pz.map((v, i) => `${gx(i)},${gy(v)}`).join(' ')} fill="none" stroke={P.red} strokeWidth="7" strokeDasharray="16 10" />
    <path d={`M ${gx(15) + 20} ${gy(52)} L ${gx(15) + 20} ${gy(48)}`} stroke={P.ink} strokeWidth="3" />
  </svg>
  <T x={100} y={90} s={30} f={MO} w={600}>FIG. 1 — UK AVERAGE PAY VS PRICES, 2010 = 0</T>
  <T x={gx(15) - 10} y={gy(52) - 60} s={30} f={MO} w={600} c={P.navy} a="right">pay +52%</T>
  <T x={gx(15) - 10} y={gy(48) + 44} s={30} f={MO} w={600} c={P.red} a="right">prices +48%</T>
  <T x={160} y={880} s={24} f={MO} w={500} c={P.grey}>2010</T><T x={1150} y={880} s={24} f={MO} w={500} c={P.grey}>2025</T>
  {[['ON PAPER', '+52%', P.navy], ['PRICES', '+48%', P.red], ['REAL RAISE', '+3%', '#B8901A']].map(([a, b, c], i) => <div key={i} style={{position: 'absolute', left: 1300, top: 80 + i * 300, width: 560, height: 260, background: '#FFFFFF', border: `3px solid ${P.ink}`}}>
    <div style={{height: 46, background: c}} /><T x={30} y={66} s={30} f={MO} w={600} c={P.grey}>{a}</T><T x={30} y={104} s={110} f={OS} w={700}>{b}</T></div>)}
  <Src t="Source (draft): OECD average wages, UK, 2010-2025 · schematic lines" />
</AbsoluteFill>; };

// 5. S1 paper and footage documentary
export const M5 = () => <AbsoluteFill style={{background: '#EDE6D8'}}>
  <div style={{position: 'absolute', left: 90, top: 150, width: 980, height: 560, background: '#fff', padding: 18, transform: 'rotate(-2deg)', boxShadow: '0 22px 50px rgba(40,30,15,0.25)'}}>
    <Img src={staticFile('mock/typing.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.8)'}} />
    <div style={{position: 'absolute', left: 380, top: -22, width: 200, height: 44, background: 'rgba(242,232,190,0.85)', transform: 'rotate(3deg)'}} />
  </div>
  <Card x={1130} y={190} w={700} h={520} rot={1.5}>
    <T x={44} y={40} s={22} f={MO} w={600} c={P.grey}>STUDY · QUARTERLY JOURNAL OF ECONOMICS · 1997</T>
    <T x={44} y={84} s={48} f={FR} w={700}>Money Illusion</T>
    <T x={44} y={146} s={26} f={IN} w={500} c={P.grey}>Shafir, Diamond & Tversky</T>
    <div style={{position: 'absolute', left: 44, top: 220, width: 612, fontFamily: FR, fontSize: 34, lineHeight: 1.45, color: P.ink, whiteSpace: 'normal'}}>
      people tend to think in <span style={{background: P.yellow, padding: '0 6px'}}>nominal rather than real</span> terms</div>
  </Card>
  <T x={110} y={760} s={40} f={FR} w={400} c={P.ink}>Illustrative footage · the source card names the study</T>
  <Src t="Typeset excerpt (draft wording, to be checked against the paper) · Footage: Mixkit" />
</AbsoluteFill>;

// 6. A mix: S5 data page as the base, the flat characters as the second style
export const M6 = () => <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #F5EEDD 0%, ${P.parch} 60%, #E2D6BD 100%)`}}>
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
    <Folk x={380} y={1000} h={720} hair="bun" hairColor="#2B2420" skin="#C68A62" top="shirt" topColor="#4E6E58" face="surprised" />
  </svg>
  <T x={800} y={90} s={26} f={OS} w={500} c={P.grey} ls={4}>THE PAY RISE TEST · UNITED KINGDOM</T>
  <Card x={800} y={150} w={1040} h={520}><Bars x={60} y={70} w={700} /></Card>
  <div style={{position: 'absolute', left: 700, top: 300, width: 0, height: 0, borderTop: '30px solid transparent', borderBottom: '30px solid transparent', borderRight: `60px solid ${P.card}`}} />
  <T x={800} y={720} s={46} f={FI} w={400} c={P.ink}>“Wait. Fifteen years of raises bought me 3%?”</T>
  <Src t="Source (draft): OECD average annual wages, 2010-2025 · character: illustration" />
</AbsoluteFill>;
