// S12 Data morph: the data is the character. Dots stand for money; they appear, get eaten by prices, and regroup into the answer.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useT, s, tw, ramp, back, lerp, Narr, Sfx, Caps} from './common';

const BG = '#0E1A2B', BASE = '#3C5A80', NEW = '#FFC94A', EAT = '#FF6B5B', TX = '#E8EEF6', MU = '#8AA0BC', F = "'Inter', sans-serif";
const SP = 34, R = 12;
const gp = (cx, cy, i) => [cx - 153 + (i % 10) * SP, cy - 200 + Math.floor(i / 10) * SP];

const Grid = ({cx, cy, a, extra, eatAt, t, keep, label, col}) => { const m = ramp(t, s('p6') + 0.1, 0.9);
  const base = Array.from({length: 100}, (_, i) => { const p = back(t, a + (i % 10 + Math.floor(i / 10)) * 0.018, 0.3); const [x, y] = gp(cx, cy, i);
    return <circle key={i} cx={x} cy={y} r={R * p * lerp(1, 0.55, m)} fill={BASE} opacity={lerp(1, 0.35, m)} />; });
  const ex = extra.map((at, j) => { const p = back(t, at, 0.35); const [x0, y0] = [cx - 153 + j * SP, cy - 200 + 10 * SP + 14];
    const eaten = eatAt[j] !== undefined ? ramp(t, eatAt[j], 0.4) : 0; const kept = keep.indexOf(j);
    const [x1, y1] = kept >= 0 ? [cx + (kept - (keep.length - 1) / 2) * 150, cy - 40] : [x0, y0 + 80];
    const x = lerp(x0, x1, kept >= 0 ? m : 0), y = lerp(y0, y1, kept >= 0 ? m : 0) + eaten * 90; const r = R * p * (kept >= 0 ? lerp(1, 5, m) : 1);
    return <circle key={'e' + j} cx={x} cy={y} r={Math.max(0, r)} fill={eaten > 0.05 ? EAT : NEW} opacity={1 - eaten} />; });
  return <g>
    <text x={cx} y={cy - 260} textAnchor="middle" fontFamily={F} fontWeight="800" fontSize="54" fill={TX} opacity={ramp(t, a, 0.3)} letterSpacing="2">{label}</text>
    {base}{ex}
    <text x={cx} y={cy + 270} textAnchor="middle" fontFamily={F} fontWeight="900" fontSize={lerp(0, 120, m)} fill={col} opacity={m}>{`+${keep.length}%`}</text>
  </g>; };

const Count = ({x, y, t, from, to, a, d, col, size = 44}) => { const p = ramp(t, a, d); const v = Math.round(lerp(from, to, p));
  return <text x={x} y={y} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize={size} fill={col} opacity={ramp(t, a, 0.2)}>{v}</text>; };

export const DataMorph = () => { const t = useT(); const m = ramp(t, s('p6') + 0.1, 0.9);
  const annEx = [tw('p1', 'two'), tw('p1', 'two') + 0.12];
  const barEx = [0, 1, 2, 3, 4].map((k) => tw('p2', 'five') + k * 0.1);
  const eat = Object.fromEntries([1, 2, 3, 4].map((j, k) => [j, tw('p4', 'four') + k * 0.16]));
  return <AbsoluteFill style={{background: BG}}>
    <Narr /><Sfx at={tw('p4', 'four')} name="coin" vol={0.3} /><Sfx at={s('p6') + 0.1} name="whoosh" vol={0.3} />
    <svg width={1920} height={1080}>
      <Grid cx={520} cy={520} a={s('p1')} extra={annEx} eatAt={{}} keep={[0, 1]} t={t} label="ANN" col={NEW} />
      <Grid cx={1400} cy={520} a={s('p2')} extra={barEx} eatAt={eat} keep={[0]} t={t} label="BARBARA" col={NEW} />
      <g opacity={1 - m}>
        <Count x={520} y={890} t={t} from={100} to={102} a={tw('p1', 'two')} d={0.3} col={MU} />
        <text x={1400} y={890} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize={44} fill={t > tw('p4', 'four') ? EAT : MU} opacity={ramp(t, tw('p2', 'five'), 0.2)}>{105 - [0, 1, 2, 3].filter((k) => t > tw('p4', 'four') + k * 0.16 + 0.2).length - Math.round(lerp(5, 0, ramp(t, tw('p2', 'five'), 0.5)))}</text>
        <text x="960" y="520" textAnchor="middle" fontFamily={F} fontWeight="900" fontSize="120" fill={TX} opacity={ramp(t, s('p3'), 0.3) * (1 - ramp(t, s('p4'), 0.3))}>?</text>
        <text x="1400" y="950" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="34" fill={EAT} opacity={ramp(t, tw('p4', 'four'), 0.3)}>prices ate 4</text>
        <text x="520" y="950" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="34" fill={MU} opacity={ramp(t, tw('p5', 'move'), 0.3)}>prices ate 0</text>
      </g>
      <text x="960" y="120" textAnchor="middle" fontFamily={F} fontWeight="600" fontSize="34" fill={MU} opacity={ramp(t, s('p1'), 0.4)} letterSpacing="4">EACH DOT = 1% OF LAST YEAR'S PAY</text>
      {t > s('p7') && <rect x={300} y={300} width={440} height={520} rx="30" fill="none" stroke={NEW} strokeWidth="5" opacity={ramp(t, tw('p7', 'two'), 0.4)} />}
    </svg>
    <Caps bg="rgba(5,12,22,0.85)" hi={NEW} />
  </AbsoluteFill>; };
