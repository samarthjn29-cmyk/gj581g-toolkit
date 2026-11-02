// "Your Raise Is Lying to You" — Banknote pilot (cold open, ~58 s). Placeholder VO (Kokoro); Sam's clone voices the final.
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';
import {Folk} from './folk';
import {C, OS, FR, FI, IN, MO, t0, tw, fr, TOTAL, ease, pop, wave, zig, rosette, Ground, Grain, NoteFrame, Portrait, T, Typed, Stamp, Window, Captions} from './bank';

const ANN = {hair: 'bob', hairColor: '#3A2A22', skin: '#F1C7A4', top: 'blazer', topColor: '#2E4A5E'};
const BARB = {hair: 'curly', hairColor: '#1E1A18', skin: '#8D5B3E', top: 'sweater', topColor: '#C4623F'};

// scene windows (seconds): each starts a little before its first line
const SC = [['ann', 0], ['barb', t0('b1') - 0.35], ['duo', t0('d1') - 0.35], ['poll', t0('p1') - 0.35], ['shop', t0('s1') - 0.35], ['illusion', t0('i1') - 0.35], ['uk', t0('u1') - 0.35], ['title', t0('t1') - 0.35]];
const span = (name) => { const i = SC.findIndex((s) => s[0] === name); return [SC[i][1], i + 1 < SC.length ? SC[i + 1][1] : TOTAL]; };
// frame helpers relative to the scene start
const useS = (name) => { const f = useCurrentFrame(); const base = span(name)[0]; return {f, at: (s) => fr(s - base)}; };

const Serial = ({c = C.ox}) => <T x={1700} y={58} s={24} f={MO} w={600} c={c} a="right" ls={3}>No. 1 · A 00004821</T>;

// pay slip (receipt) with typed lines
const Slip = ({x, y, w, h, rot, rows, title, f}) => <>
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}><path d={zig(x, y, w, h, 28, 12)} fill="#FFFDF7" style={{filter: 'drop-shadow(0 12px 14px rgba(40,30,10,0.25))'}} /></g>
  </svg>
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`}}>
    <T x={w / 2} y={44} s={28} f={MO} w={700} a="center" c={C.ink}>{title}</T>
    <div style={{position: 'absolute', left: 40, top: 96, width: w - 80, borderTop: `3px dashed ${C.ink}`}} />
    {rows.map((r, i) => <React.Fragment key={i}>
      <Typed text={r.label} at={r.at} f={f} x={40} y={140 + i * 96} s={30} w={600} c={C.ink} />
      {f >= r.at + 14 && <T x={w - 40} y={128 + i * 96} s={52} f={MO} w={800} c={r.c || C.ink} a="right" style={pop(f, r.at + 14, 8)}>{r.value}</T>}
    </React.Fragment>)}
  </div>
</>;

// one person, one note: portrait + pay slip
const PersonNote = ({name, who, color, side, faceAt, rows, stamp, f}) => {
  const pX = side === 'left' ? 520 : 1400, sX = side === 'left' ? 900 : 260; const draw = ease(f, 0, 12);
  return <AbsoluteFill>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <NoteFrame x={120} y={110} w={1680} h={820} color={color} draw={draw} />
      <path d={rosette(pX, 520, 330, 41, 70, 1500)} stroke={color} strokeWidth="0.6" fill="none" opacity={0.25 * draw} />
      <g opacity={ease(f, 4, 12)}><Portrait cx={pX} cy={480} rx={210} ry={260} color={color}>
        <Folk x={pX} y={790} h={560} {...who} face={faceAt(f)} />
      </Portrait></g>
    </svg>
    <T x={pX} y={780} s={44} f={OS} w={700} c={color} a="center" ls={10} style={pop(f, 8)}>{name.toUpperCase()}</T>
    <Slip x={sX} y={250} w={760} h={480} rot={side === 'left' ? -1.5 : 1.5} title={`PAY SLIP · ${name.toUpperCase()}`} rows={rows} f={f} />
    {stamp && <Stamp x={sX + 300} y={600} color={stamp.color} f={f} at={stamp.at}>{stamp.text}</Stamp>}
    <Serial c={color} />
  </AbsoluteFill>; };

const Ann = () => { const {f, at} = useS('ann');
  return <PersonNote name="Ann" who={ANN} color={C.green} side="left" f={f}
    faceAt={(f) => f < at(tw('a2', 'two')) ? 'neutral' : 'smile'}
    rows={[{label: 'RAISE THIS YEAR', value: '+2%', at: at(tw('a2', 'two')) - 14}, {label: 'PRICES THIS YEAR', value: '0%', at: at(tw('a3', 'prices')) - 6}]}
    stamp={{text: 'ZERO INFLATION', color: C.green, at: at(tw('a3', 'zero'))}} />; };

const Barb = () => { const {f, at} = useS('barb');
  return <PersonNote name="Barbara" who={BARB} color={C.ox} side="right" f={f}
    faceAt={(f) => f < at(tw('b1', 'five')) ? 'neutral' : f < at(tw('b2', 'except')) ? 'happy' : 'surprised'}
    rows={[{label: 'RAISE THIS YEAR', value: '+5%', at: at(tw('b1', 'five')) - 14}, {label: 'PRICES THIS YEAR', value: '+4%', at: at(tw('b2', 'prices')) - 6, c: C.ox}]}
    stamp={{text: '4% INFLATION', color: C.ox, at: at(tw('b2', 'four'))}} />; };

// two mini notes side by side
const Mini = ({x, name, who, color, face, raise, buys, buysAt, f, dim}) => { const y = 230, w = 780, h = 620;
  return <>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <NoteFrame x={x} y={y} w={w} h={h} color={color} draw={ease(f, 0, 10)} />
      <Portrait cx={x + 210} cy={y + 290} rx={140} ry={180} color={color}><Folk x={x + 210} y={y + 500} h={400} {...who} face={face} /></Portrait>
    </svg>
    <T x={x + 210} y={y + 506} s={34} f={OS} w={700} c={color} a="center" ls={8}>{name.toUpperCase()}</T>
    <T x={x + 590} y={y + 90} s={28} f={OS} w={500} c={C.mute} a="center" ls={6}>RAISE</T>
    <T x={x + 590} y={y + 130} s={120} f={FR} w={700} c={C.ink} a="center" style={{opacity: dim ? 0.35 : 1}}>{raise}</T>
    {f >= buysAt && <>
      <div style={{position: 'absolute', left: x + 440, top: y + 300, width: 300, borderTop: `2px solid ${color}`, opacity: ease(f, buysAt, 8)}} />
      <T x={x + 590} y={y + 330} s={28} f={OS} w={500} c={color} a="center" ls={6} style={pop(f, buysAt)}>WHAT IT BUYS</T>
      <T x={x + 590} y={y + 370} s={120} f={FR} w={700} c={color} a="center" style={pop(f, buysAt + 4)}>{buys}</T>
    </>}
  </>; };

const Duo = () => { const {f, at} = useS('duo'); const a2 = at(tw('d2', 'two')), b2 = at(tw('d3', 'one'));
  return <AbsoluteFill>
    <T x={960} y={96} s={72} f={OS} w={700} c={C.ink} a="center" ls={4} style={pop(f, at(t0('d1')))}>WHO'S BETTER OFF?</T>
    <Mini x={120} name="Ann" who={ANN} color={C.green} face={f < a2 ? 'thinking' : 'smile'} raise="+2%" buys="+2%" buysAt={a2} f={f} />
    <Mini x={1020} name="Barbara" who={BARB} color={C.ox} face={f < b2 ? 'smug' : 'sad'} raise="+5%" buys="+1%" buysAt={b2} f={f} dim={f >= b2} />
    <Serial />
  </AbsoluteFill>; };

// the poll certificate
const Bar = ({y, q, pct, who, color, at, f}) => { const p = ease(f, at, 22); const n = Math.round(pct * p); const W = 980;
  return f < at - 10 ? null : <>
    <T x={330} y={y} s={34} f={OS} w={500} c={C.ink} ls={3} style={pop(f, at - 10)}>{q}</T>
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <rect x={330} y={y + 60} width={W} height={70} fill="#E9E1CC" stroke={color} strokeWidth="1.5" />
      <defs><pattern id={`h${y}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill={color} /><line x1="0" y1="0" x2="0" y2="8" stroke={C.paper} strokeWidth="1.4" opacity="0.5" /></pattern></defs>
      <rect x={330} y={y + 60} width={(W * pct * p) / 100} height={70} fill={`url(#h${y})`} />
    </svg>
    <T x={1350} y={y + 40} s={110} f={FR} w={700} c={color}>{n}%</T>
    <T x={1356} y={y + 160} s={30} f={FI} w={400} c={color} style={{opacity: p}}>said {who}</T>
  </>; };

const Poll = () => { const {f, at} = useS('poll');
  return <AbsoluteFill>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <NoteFrame x={200} y={110} w={1520} h={820} color={C.green} draw={ease(f, 0, 10)} fill={C.paper} />
      <rect x={232} y={142} width={1456} height={756} rx="8" fill="none" stroke={C.gold} strokeWidth="1.5" />
    </svg>
    <T x={960} y={186} s={28} f={OS} w={500} c={C.green} a="center" ls={8} style={pop(f, 2)}>THE ANN AND BARBARA TEST · 1997</T>
    <Bar y={290} q="WHO IS BETTER OFF ECONOMICALLY?" pct={71} who="Ann" color={C.green} at={at(tw('p1', 'seventy'))} f={f} />
    <Bar y={560} q="WHO IS HAPPIER?" pct={64} who="Barbara" color={C.ox} at={at(tw('p3', 'sixty'))} f={f} />
    {f >= at(t0('p2')) && f < at(tw('p3', 'sixty')) - 10 && <T x={330} y={560} s={34} f={OS} w={500} c={C.ink} ls={3} style={pop(f, at(t0('p2')))}>WHO IS HAPPIER?</T>}
    <T x={330} y={830} s={22} f={IN} w={500} c={C.mute} style={pop(f, 6)}>Shafir, Diamond &amp; Tversky (1997), "Money Illusion", Quarterly Journal of Economics 112(2). Each question asked of a separate group.</T>
    <Serial />
  </AbsoluteFill>; };

const Shop = () => { const {f, at} = useS('shop'); const st = at(tw('s2', 'four'));
  return <AbsoluteFill>
    <Window x={200} y={110} w={1520} h={820} src="media/40176.mp4" from={0.3} rate={0.45} f={f} at={0} tint={C.ox} />
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <g opacity={ease(f, 10, 10)}><Portrait cx={380} cy={770} rx={110} ry={135} color={C.ox} bg="#EFE4D2"><Folk x={380} y={930} h={300} {...BARB} face={f < st ? 'happy' : 'surprised'} /></Portrait></g>
    </svg>
    <Stamp x={1250} y={180} color={C.ox} f={f} at={st} s={60} bg={C.paper}>+4% PRICES</Stamp>
    <Serial />
  </AbsoluteFill>; };

const Illusion = () => { const {f, at} = useS('illusion'); const b = at(tw('i2', 'number')), c = at(tw('i2', 'buy'));
  return <AbsoluteFill>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      {[180, 1740].map((cx) => [0, 1, 2].map((k) => <path key={cx + '_' + k} d={rosette(cx, 300, 120 - k * 16, 23 + k * 4, 44 - k * 6)} stroke={k === 1 ? C.gold : C.green} strokeWidth="0.8" fill="none" opacity={0.55 * ease(f, 0, 14)} />))}
    </svg>
    <T x={960} y={226} s={140} f={FR} w={700} c={C.ink} a="center" style={pop(f, 4)}>The money illusion</T>
    {f >= b && <Slip x={330} y={520} w={560} h={330} rot={-2} title="ON THE PAY SLIP" rows={[{label: 'RAISE', value: '+5%', at: b - 14}]} f={f} />}
    {f >= c && <>
      <svg width={1920} height={1080} style={{position: 'absolute'}}><path d="M 930 690 L 1060 690 M 1040 670 L 1062 690 L 1040 710" stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={200 * (1 - ease(f, c, 8))} /></svg>
      <svg width={1920} height={1080} style={{position: 'absolute'}}><NoteFrame x={1100} y={520} w={500} h={330} color={C.ox} draw={ease(f, c, 8)} micro={false} /></svg>
      <T x={1350} y={580} s={30} f={OS} w={500} c={C.ox} a="center" ls={6} style={pop(f, c)}>WHAT IT BUYS</T>
      <T x={1350} y={630} s={130} f={FR} w={700} c={C.ox} a="center" style={pop(f, c + 4)}>+1%</T>
    </>}
  </AbsoluteFill>; };

const UK = () => { const {f, at} = useS('uk'); const r = at(tw('u2', 'uk')), n52 = at(t0('u3')) - 22, a3 = at(t0('u3'));  // placeholder VO: count runs to the end of the line; re-cue on aligned word times with the clone
  const cnt = Math.round(52 * ease(f, r, n52 + 8 - r)); const shrink = ease(f, a3, 18); const BX = 1340, BW = 220, BT = 250, BH = 560, sliver = BH * (2.8 / 52.1);
  return <AbsoluteFill>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <NoteFrame x={120} y={110} w={1680} h={820} color={C.green} draw={ease(f, 0, 12)} />
      <defs><pattern id="ukh" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill={C.green} /><line x1="0" y1="0" x2="0" y2="8" stroke={C.paper} strokeWidth="1.4" opacity="0.5" /></pattern></defs>
      {f >= r && <g>
        <rect x={BX} y={BT + BH * (1 - ease(f, r, n52 + 8 - r))} width={BW} height={BH * ease(f, r, n52 + 8 - r)} fill="url(#ukh)" />
        <rect x={BX} y={BT} width={BW} height={(BH - sliver) * shrink} fill={C.grey} opacity={0.95} />
        {shrink > 0 && <rect x={BX} y={BT + BH - sliver} width={BW} height={sliver} fill={C.gold} />}
        <line x1={BX - 30} x2={BX + BW + 30} y1={BT + BH} y2={BT + BH} stroke={C.ink} strokeWidth="3" />
      </g>}
    </svg>
    <T x={200} y={190} s={30} f={OS} w={500} c={C.green} ls={6} style={pop(f, at(t0('u2')))}>UNITED KINGDOM · AVERAGE WAGE · 2010 → 2025</T>
    {f >= r && <T x={200} y={260} s={170} f={FR} w={700} c={C.ink}>+{cnt}%</T>}
    {f >= r && <T x={210} y={460} s={36} f={FI} w={400} c={C.green} style={pop(f, r + 6)}>on the pay slip</T>}
    {f >= a3 && <>
      <T x={210} y={560} s={36} f={FI} w={400} c={C.ox} style={pop(f, a3)}>after prices</T>
      <T x={200} y={610} s={170} f={FR} w={700} c={C.ox} style={pop(f, a3 + 6)}>+3%</T>
      <T x={BX + BW + 24} y={BT + (BH - sliver) / 2 - 20} s={26} f={OS} w={500} c={C.mute} ls={4} style={{opacity: shrink}}>PRICES</T>
      <T x={BX + BW + 24} y={BT + BH - 40} s={26} f={OS} w={700} c={C.gold} ls={4} style={{opacity: shrink}}>YOU</T>
    </>}
    <T x={200} y={850} s={20} f={IN} w={500} c={C.mute}>Source: OECD, average annual wages, current vs constant prices (pilot figures, fact-check pending)</T>
    <Serial />
  </AbsoluteFill>; };

const Title = () => { const {f, at} = useS('title'); const r = at(t0('t2'));
  return <AbsoluteFill>
    <Window x={120} y={110} w={1680} h={820} src="media/18261.mp4" from={1} rate={0.6} f={f} at={0} tint={C.green} />
    <div style={{position: 'absolute', left: 360, top: 330, width: 1200, height: 330, background: C.paper, borderRadius: 14, border: `3px solid ${C.green}`, boxShadow: '0 16px 30px rgba(0,0,0,0.3)', ...pop(f, 6, 14)}} />
    <T x={960} y={370} s={30} f={OS} w={500} c={C.green} a="center" ls={10} style={pop(f, 10)}>THE DOLLAR YARDSTICK · No. 1</T>
    <T x={960} y={440} s={108} f={FR} w={700} c={C.ink} a="center" style={pop(f, 14)}>Your raise is</T>
    <T x={960} y={548} s={92} f={FI} w={700} c={C.ox} a="center" style={pop(f, 20)}>lying to you</T>
    {f >= r && <>
      <svg width={1920} height={1080} style={{position: 'absolute'}}><g transform={`translate(0 ${(1 - ease(f, r, 12)) * 300}) rotate(4 1560 840)`}><path d={zig(1420, 720, 300, 220, 14, 10)} fill="#FFFDF7" style={{filter: 'drop-shadow(0 10px 12px rgba(0,0,0,0.3))'}} /></g></svg>
      <div style={{position: 'absolute', left: 1420, top: 720, width: 300, height: 220, transform: `translateY(${(1 - ease(f, r, 12)) * 300}px) rotate(4deg)`}}>
        <T x={150} y={40} s={22} f={MO} w={700} a="center">RECEIPT</T>
        <T x={150} y={84} s={18} f={MO} w={500} a="center" c={C.mute}>CHECKING...</T>
        <T x={150} y={130} s={34} f={MO} w={800} a="center" c={C.ox}>TOTAL ?</T>
      </div>
    </>}
  </AbsoluteFill>; };

const MAP = {ann: Ann, barb: Barb, duo: Duo, poll: Poll, shop: Shop, illusion: Illusion, uk: UK, title: Title};
export const Pilot = () => <AbsoluteFill>
  <Ground />
  {SC.map(([name]) => { const [a, b] = span(name); const C_ = MAP[name]; return <Sequence key={name} from={fr(a)} durationInFrames={fr(b) - fr(a)}><C_ /></Sequence>; })}
  <Grain />
  <Captions />
</AbsoluteFill>;
export const DUR = fr(TOTAL);
export const SCENES = SC.map(([n]) => [n, ...span(n)]);
