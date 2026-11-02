// S13 Screen story: the story plays out on a phone (group chat, notifications, apps) on a desk; the camera leans in.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useT, s, tw, ramp, back, lerp, Narr, Sfx, Caps} from './common';

const F = "'Inter', sans-serif";
const PEOPLE = {ann: ['Ann', '#2E8B6E'], dev: ['Dev', '#C2742F'], me: ['Barbara', '#3B6FE0']};
const MSGS = [
  {at: s('p1'), who: 'ann', text: 'Got my raise today. 2%'},
  {at: s('p2'), who: 'me', text: "Mine's 5%!! Drinks on me"},
  {at: s('p3'), who: 'dev', text: "ok but who's actually better off?"},
  {at: s('p5'), who: 'ann', text: "My prices didn't move at all"},
  {at: s('p7'), who: 'ann', text: 'so I got 2.'},
];
const PW = 500, PH = 940, PX = 960 - PW / 2, PY = 40;

const Bubble = ({m, y, t}) => { const me = m.who === 'me'; const [name, col] = PEOPLE[m.who]; const p = back(t, m.at, 0.35);
  const w = Math.min(340, 40 + m.text.length * 13.5);
  return <div style={{position: 'absolute', top: y, left: me ? PW - 24 - w : 70, width: w, transform: `scale(${p})`, transformOrigin: me ? 'right bottom' : 'left bottom', opacity: Math.min(1, p * 2)}}>
    {!me && <div style={{position: 'absolute', left: -52, bottom: 0, width: 40, height: 40, borderRadius: 20, background: col, color: '#fff', fontFamily: F, fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{name[0]}</div>}
    {!me && <div style={{fontFamily: F, fontSize: 16, fontWeight: 600, color: col, margin: '0 0 4px 14px'}}>{name}</div>}
    <div style={{background: me ? '#3B6FE0' : '#ECEEF2', color: me ? '#fff' : '#17191D', fontFamily: F, fontSize: 24, lineHeight: 1.25, padding: '12px 16px', borderRadius: 22,
      borderBottomRightRadius: me ? 6 : 22, borderBottomLeftRadius: me ? 22 : 6}}>{m.text}</div></div>; };

const Typing = ({t, at}) => { const o = ramp(t, at - 0.55, 0.15) * (1 - ramp(t, at - 0.05, 0.1)); if (o <= 0) return null;
  return <div style={{position: 'absolute', bottom: 112, left: 70, opacity: o, background: '#ECEEF2', borderRadius: 20, padding: '14px 18px', display: 'flex', gap: 7}}>
    {[0, 1, 2].map((i) => <div key={i} style={{width: 11, height: 11, borderRadius: 6, background: '#8D939E', transform: `translateY(${Math.sin(t * 12 - i) * 4}px)`}} />)}</div>; };

export const Screen = () => { const t = useT();
  const shown = MSGS.filter((m) => t >= m.at - 0.02);
  const heights = shown.map((m) => (m.who === 'me' ? 0 : 24) + 26 + Math.ceil((m.text.length * 13.5) / 300) * 30 + 26);
  let y = PH - 120; const ys = []; for (let i = shown.length - 1; i >= 0; i--) { y -= heights[i] + 16; ys[i] = y; }
  const notif = ramp(t, s('p4') - 0.1, 0.35) * (1 - ramp(t, s('p5') + 0.6, 0.35));
  const calc = back(t, s('p6') - 0.05, 0.45) * (1 - ramp(t, s('p7') - 0.1, 0.3));
  const z = lerp(1, 1.12, ramp(t, s('p3'), 3)) * lerp(1, 0.95, ramp(t, s('p7'), 1));
  const barbTyping = t > tw('p7', 'two') + 0.3 && t < tw('p7', 'two') + 1.6;
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 20%, #E8D9C3 0%, #BFA88A 60%, #8E7558 100%)', overflow: 'hidden'}}>
    <Narr /><Sfx at={s('p1')} name="coin" vol={0.18} /><Sfx at={s('p2')} name="coin" vol={0.18} /><Sfx at={s('p3')} name="coin" vol={0.18} /><Sfx at={s('p4') - 0.1} name="ding" vol={0.25} /><Sfx at={s('p7')} name="coin" vol={0.18} />
    {[[260, 260, 180, '#F6E7CF'], [1650, 300, 140, '#FFF3DE'], [1500, 860, 220, '#D9C2A3']].map(([x, y, r, c], i) => <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: c, opacity: 0.45, filter: 'blur(30px)'}} />)}
    {/* coffee cup and notebook on the desk */}
    <div style={{position: 'absolute', left: 1380, top: 180, width: 230, height: 230, borderRadius: 115, background: '#F5F1EA', boxShadow: '0 18px 40px rgba(60,40,20,0.35)'}}><div style={{margin: 30, width: 170, height: 170, borderRadius: 85, background: '#5A3A22'}} /></div>
    <div style={{position: 'absolute', left: 170, top: 520, width: 360, height: 460, background: '#2F4A6A', borderRadius: 10, transform: 'rotate(-8deg)', boxShadow: '0 18px 40px rgba(60,40,20,0.35)'}} />
    <div style={{position: 'absolute', left: PX, top: PY, width: PW, height: PH, transform: `scale(${z})`, transformOrigin: '50% 60%'}}>
      <div style={{position: 'absolute', inset: -16, borderRadius: 70, background: '#16171A', boxShadow: '0 40px 80px rgba(40,25,10,0.5)'}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: 56, background: '#FFFFFF', overflow: 'hidden'}}>
        <div style={{height: 120, background: '#F7F8FA', borderBottom: '1px solid #E3E6EA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 14}}>
          <div style={{display: 'flex', gap: 4, marginBottom: 6}}>{['ann', 'dev', 'me'].map((k) => <div key={k} style={{width: 30, height: 30, borderRadius: 15, background: PEOPLE[k][1], border: '2px solid #fff'}} />)}</div>
          <div style={{fontFamily: F, fontWeight: 700, fontSize: 22, color: '#17191D'}}>Work friends</div></div>
        {shown.map((m, i) => <Bubble key={i} m={m} y={ys[i]} t={t} />)}
        <Typing t={t} at={s('p3')} /><Typing t={t} at={s('p5')} /><Typing t={t} at={s('p7')} />
        {barbTyping && <div style={{position: 'absolute', bottom: 112, right: 24, background: '#3B6FE0', borderRadius: 20, padding: '14px 18px', display: 'flex', gap: 7, opacity: ramp(t, tw('p7', 'two') + 0.3, 0.15)}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: 11, height: 11, borderRadius: 6, background: '#DCE6FF', transform: `translateY(${Math.sin(t * 12 - i) * 4}px)`}} />)}</div>}
        <div style={{position: 'absolute', left: 16, right: 16, bottom: 24, height: 64, borderRadius: 32, border: '1px solid #DADDE2', fontFamily: F, fontSize: 22, color: '#A0A6B0', display: 'flex', alignItems: 'center', paddingLeft: 24}}>Message</div>
        {/* notification */}
        <div style={{position: 'absolute', left: 14, right: 14, top: lerp(-140, 18, notif), borderRadius: 26, background: 'rgba(30,32,36,0.94)', padding: '16px 20px', color: '#fff', fontFamily: F}}>
          <div style={{fontSize: 16, color: '#AEB4BE', fontWeight: 600, letterSpacing: 1}}>MY BANK · now</div>
          <div style={{fontSize: 24, fontWeight: 700, marginTop: 4}}>Your groceries cost 4% more</div>
          <div style={{fontSize: 20, color: '#D5D9E0', marginTop: 2}}>than the same basket last year</div></div>
        {/* calculator sheet */}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: lerp(-520, 0, calc), height: 500, background: '#1E2024', borderTopLeftRadius: 34, borderTopRightRadius: 34, padding: 28, fontFamily: F}}>
          <div style={{color: '#8D939E', fontSize: 30, textAlign: 'right'}}>raise − prices</div>
          <div style={{color: '#fff', fontSize: 64, fontWeight: 300, textAlign: 'right', marginTop: 8}}>5 − 4</div>
          <div style={{color: '#FFB547', fontSize: 120, fontWeight: 600, textAlign: 'right', opacity: ramp(t, tw('p6', 'one'), 0.2)}}>= 1%</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16}}>{Array.from({length: 4}, (_, i) => <div key={i} style={{height: 70, borderRadius: 35, background: i === 3 ? '#FFB547' : '#3A3D44'}} />)}</div></div>
      </div></div>
    <Caps />
  </AbsoluteFill>; };
