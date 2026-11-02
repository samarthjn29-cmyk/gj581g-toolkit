// Character story prototype (3 Nov 2026): Ann and Barbara, the money illusion as a 23 s scene.
// Two rigged Folk characters, Kokoro voices, Rhubarb lip sync, a walk-in, gestures, a camera that follows the conversation.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {Ground, Grain, NoteFrame, C, OS, FR, wave} from './bank';
import {Rig, slip, shade} from './rig';
import T from './data/dialogue_timing.json';

export const FPS = 30;
export const DUR = Math.round(T.total * FPS);
const LN = Object.fromEntries(T.lines.map((l) => [l.id, l]));
const st = (id) => LN[id].start, en = (id) => LN[id].end;
// estimated word time inside a line (character position); k = which occurrence
const tw = (id, word, k = 0) => { const l = LN[id]; const ws = l.text.split(' '); let n = -1, idx = -1;
  ws.forEach((w, i) => { if (idx < 0 && w.toLowerCase().replace(/[^a-z0-9']/g, '').startsWith(word.toLowerCase())) { n++; if (n === k) idx = i; } });
  if (idx < 0) throw new Error(`cue "${word}" not in ${id}`);
  const ch = ws.map((w) => w.length + 1); const b = ch.slice(0, idx).reduce((a, c) => a + c, 0), tot = ch.reduce((a, c) => a + c, 0);
  return l.start + (l.end - l.start) * (b / tot); };
const E = Easing.bezier(0.3, 0, 0.2, 1);
const ramp = (t, a, d = 0.35) => interpolate(t, [a, a + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E});
const lerp = (a, b, p) => a + (b - a) * p;

// pose track: [[time, {fa, fb, ba, bb, tilt, lean, face, turn}]]; numbers blend over 0.35 s, face switches a third of the way in
const track = (keys, t, d = 0.35) => { let i = 0; while (i + 1 < keys.length && keys[i + 1][0] <= t) i++;
  const [k0, cur] = keys[i], prev = i ? keys[i - 1][1] : cur, p = ramp(t, k0, d); const out = {};
  for (const k of new Set([...Object.keys(prev), ...Object.keys(cur)])) {
    const a = prev[k] ?? cur[k], b = cur[k] ?? prev[k];
    out[k] = typeof b === 'number' ? lerp(a, b, p) : (p > 0.3 ? b : a); }
  return out; };

const mouthAt = (who, t) => { const l = T.lines.find((x) => x.who === who && t >= x.start && t <= x.end + 0.05); if (!l) return {v: 'X', talking: false};
  let v = 'X'; for (const [ct, cv] of l.mouth) { if (ct <= t) v = cv; else break; } return {v, talking: true}; };
const blinkAt = (t, off) => { const c = (t + off) % 3.4; return c < 0.12 ? 1 : 0; };

// ---- cast
const BARB = {skin: '#EDBE98', hair: 'curly', hairColor: '#3B2417', top: C.ox, bottom: '#2F3A48', shoe: '#2A2522'};
const ANN = {skin: '#9A6343', hair: 'bun', hairColor: '#1C1512', top: C.green, bottom: '#3E3A36', shoe: '#2A2522', glasses: true};
const GROUND_Y = 900, S = 0.95, ANN_X = 1030;

// ---- timeline (from the voiced lines)
const tWait = tw('l5', 'wait'), tRicher = tw('l5', 'richer'), tPrices = tw('l4', 'prices'), tMove = tw('l6', 'move'), tTwo = tw('l6', 'two');
const ARRIVE = 1.75, TITLE = en('l7') + 0.35;

const barbX = (t) => interpolate(t, [0, ARRIVE], [-220, 640], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
const STEP = 46; // units of travel per radian of walk phase
export const STEPS = (() => { const out = []; let last = 0; for (let f = 0; f <= ARRIVE * FPS; f++) { const ph = (barbX(f / FPS) + 220) / STEP; const k = Math.floor(ph / Math.PI); if (k > last) { out.push(f / FPS); last = k; } } return out; })();

const BARB_KEYS = [
  [0, {fa: 12, fb: 14, ba: 12, bb: 14, tilt: 0, face: 'happy'}],
  [ARRIVE - 0.2, {fa: 150, fb: 24, ba: 10, bb: 10, tilt: -4, face: 'happy'}],
  [st('l2') - 0.1, {fa: 20, fb: 150, ba: 10, bb: 10, tilt: 0, face: 'smile'}],
  [st('l3') - 0.05, {fa: 158, fb: 22, ba: 158, bb: 22, tilt: -3, face: 'happy'}],
  [en('l3') + 0.25, {fa: 34, fb: 74, ba: 12, bb: 12, tilt: 2, face: 'neutral'}],
  [tPrices, {fa: 34, fb: 74, ba: 12, bb: 12, tilt: 4, face: 'surprised'}],
  [tWait, {fa: 26, fb: 60, ba: 14, bb: 18, tilt: -2, face: 'worried'}],
  [tRicher, {fa: 14, fb: 30, ba: 10, bb: 12, tilt: -6, face: 'sad'}],
  [st('l7') - 0.1, {fa: 26, fb: 50, ba: 165, bb: 35, tilt: -8, face: 'thinking'}],
];
const ANN_KEYS = [
  [0, {fa: 10, fb: 12, ba: 10, bb: 12, tilt: 3, face: 'thinking', turn: 1}],
  [st('l1') + 0.05, {fa: 10, fb: 12, ba: 10, bb: 12, tilt: 0, face: 'surprised', turn: -1}],
  [st('l1') + 0.9, {fa: 10, fb: 12, ba: 10, bb: 12, tilt: 0, face: 'smile', turn: -1}],
  [st('l2') - 0.1, {fa: 20, fb: 150, ba: 10, bb: 12, tilt: 4, face: 'smile', turn: -1}],
  [st('l3'), {fa: 20, fb: 40, ba: 10, bb: 12, tilt: 6, face: 'smug', turn: -1}],
  [st('l4') - 0.05, {fa: 96, fb: -6, ba: 10, bb: 12, tilt: 0, face: 'smug', turn: 1}],
  [st('l5') + 0.4, {fa: 10, fb: 14, ba: 10, bb: 12, tilt: 3, face: 'smile', turn: -1}],
  [st('l6') - 0.1, {fa: 112, fb: 24, ba: 10, bb: 12, tilt: 5, face: 'smug', turn: -1}],
  [st('l7') + 0.1, {fa: 38, fb: 84, ba: 38, bb: 84, tilt: -4, face: 'smile', turn: -1}],
];

// camera keys: [time, cx, cy, zoom]
const CAM = [[0, 960, 540, 1], [st('l2') - 0.2, 860, 520, 1.12], [st('l4') + 0.2, 1240, 510, 1.1], [tWait - 0.15, 700, 400, 1.42], [st('l6') - 0.05, 1020, 400, 1.42], [st('l7') + 0.1, 960, 540, 1]];
const camAt = (t) => { const v = track(CAM.map(([tt, x, y, z]) => [tt, {x, y, z}]), t, 0.7); return v; };

// ---- set pieces (SVG)
const Street = () => <g>
  <rect x="-400" y={GROUND_Y - 8} width="2720" height="400" fill="#D8CDB4" />
  <rect x="-400" y={GROUND_Y - 8} width="2720" height="10" fill="#C3B697" />
  {Array.from({length: 18}, (_, i) => <line key={i} x1={-400 + i * 160} y1={GROUND_Y + 2} x2={-430 + i * 160} y2="1180" stroke="#C7BB9E" strokeWidth="3" />)}
  {/* lamp post: straight edges */}
  <rect x="286" y="300" width="16" height={GROUND_Y - 300} fill={C.ink} opacity="0.85" />
  <path d="M 262 300 L 326 300 L 314 262 L 274 262 Z" fill={C.ink} opacity="0.85" /><rect x="276" y="300" width="36" height="14" fill="#F2D98A" />
  <rect x="270" y={GROUND_Y - 24} width="48" height="24" fill={C.ink} opacity="0.85" />
  {/* tree */}
  <rect x="96" y="560" width="22" height={GROUND_Y - 560} fill="#6B5642" />
  {[[107, 520, 92], [60, 580, 64], [158, 585, 62]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i ? '#3E6A52' : C.green} />)}
</g>;

const PRICES = [['BREAD', '2.00', '2.08'], ['MILK', '1.50', '1.56'], ['RICE', '3.00', '3.12']];
const Shop = ({t}) => { const flip = (i) => { const a = tPrices + i * 0.12; return {p: ramp(t, a, 0.18), q: ramp(t, a + 0.18, 0.18)}; };
  const sp = ramp(t, tPrices + 0.5, 0.12);
  return <g>
    <rect x="1230" y="170" width="700" height={GROUND_Y - 170} fill="#E6DAC0" />
    <rect x="1230" y="170" width="700" height="16" fill={C.green} />
    <rect x="1262" y="200" width="636" height="86" fill={C.green} />
    <text x="1580" y="262" textAnchor="middle" fontFamily={FR} fontWeight="700" fontSize="58" fill={C.gold} letterSpacing="10">MARKET</text>
    {Array.from({length: 12}, (_, i) => <path key={i} d={`M ${1250 + i * 55} 300 L ${1305 + i * 55} 300 L ${1305 + i * 55} 348 Q ${1277 + i * 55} 366 ${1250 + i * 55} 348 Z`} fill={i % 2 ? C.paper : C.ox} />)}
    <rect x="1250" y="294" width="660" height="10" fill={shade(C.ox, 0.8)} />
    {/* window with shelves */}
    <rect x="1262" y="400" width="250" height="380" fill="#C9D6CF" stroke={C.green} strokeWidth="10" />
    {[520, 640].map((y) => <rect key={y} x="1267" y={y} width="240" height="8" fill={C.green} opacity="0.7" />)}
    {[[1290, 470, '#C9873A'], [1350, 476, '#E2C26A'], [1420, 466, C.ox], [1300, 590, '#E8E2D2'], [1370, 584, '#B98B2E'], [1440, 596, '#7E9C6A'], [1310, 710, '#D8A25C'], [1400, 706, '#E8E2D2']].map(([x, y, c], i) =>
      <rect key={i} x={x} y={y} width="46" height={(i % 3 === 1 ? 46 : 50)} rx="5" fill={c} />)}
    <rect x="1262" y="780" width="250" height={GROUND_Y - 780} fill={C.green} />
    {/* price board */}
    <NoteFrame x={1548} y={388} w={350} h={330} color={C.green} />
    <text x="1723" y="478" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="24" letterSpacing="4" fill={C.green}>TODAY'S PRICES</text>
    {PRICES.map(([name, a, b], i) => { const {p, q} = flip(i); const y = 532 + i * 50; const showNew = p >= 1; const sy = showNew ? q : 1 - p;
      return <g key={name}>
        <text x="1596" y={y} fontFamily={OS} fontWeight="500" fontSize="34" fill={C.ink}>{name}</text>
        <g transform={`translate(1852 ${y - 12}) scale(1 ${Math.max(sy, 0.02)}) translate(-1852 ${-(y - 12)})`}>
          <text x="1852" y={y} textAnchor="end" fontFamily={FR} fontWeight="700" fontSize="40" fill={showNew ? C.ox : C.ink}>{showNew ? b : a}</text></g>
      </g>; })}
    {/* stamp */}
    <g opacity={sp} transform={`translate(1723 683) rotate(-6) scale(${1.6 - 0.6 * sp})`}>
      <rect x="-60" y="-23" width="120" height="46" rx="6" fill={C.paper} stroke={C.ox} strokeWidth="4" />
      <text x="0" y="13" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="36" fill={C.ox}>+4%</text></g>
    {[[1580, 790], [1730, 790]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width="130" height={GROUND_Y - y} fill="#B5875A" /><rect x={x} y={y + 40} width="130" height="10" fill="#94683F" />
      {[0, 1, 2, 3].map((k) => <circle key={k} cx={x + 22 + k * 29} cy={y - 6} r="16" fill={i ? '#E2B33C' : C.ox} />)}</g>)}
  </g>; };

// a small engraved sum card above a character (SVG)
const Sum = ({x, y, t, rows, color}) => { const a0 = rows[0][2]; const o = ramp(t, a0 - 0.1, 0.25) * (1 - ramp(t, TITLE - 0.25, 0.3));
  return <g opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
    <NoteFrame x={x - 190} y={y} w={380} h={210} color={color} micro={false} />
    {rows.map(([label, val, at, strong], i) => { const p = ramp(t, at, 0.22); return <g key={i} opacity={p}>
      {strong ? <g transform={`translate(${x} ${y + 168}) rotate(-6) scale(${1.5 - 0.5 * p})`}>
        <rect x="-110" y="-34" width="220" height="62" rx="6" fill={C.paper} stroke={color} strokeWidth="5" />
        <text x="0" y="16" textAnchor="middle" fontFamily={OS} fontWeight="700" fontSize="44" fill={color}>{val}</text></g>
        : <g><text x={x - 116} y={y + 66 + i * 50} fontFamily={OS} fontWeight="500" fontSize="30" fill={C.mute} letterSpacing="2">{label}</text>
          <text x={x + 116} y={y + 66 + i * 50} textAnchor="end" fontFamily={FR} fontWeight="700" fontSize="38" fill={C.ink}>{val}</text></g>}
    </g>; })}
  </g>; };

// ---- captions (HTML, max 8 words, current word highlighted, speaker tag)
const Captions = ({t}) => { const l = T.lines.find((x) => t >= x.start - 0.05 && t <= x.end + 0.3); if (!l) return null;
  const ws = l.text.split(' '); const ch = ws.map((w) => w.length + 1), tot = ch.reduce((a, b) => a + b, 0);
  const at = ws.map((_, i) => l.start + (l.end - l.start) * ch.slice(0, i).reduce((a, b) => a + b, 0) / tot);
  let cur = 0; at.forEach((a, i) => { if (t >= a) cur = i; });
  const page = Math.floor(cur / 8), shown = ws.slice(page * 8, page * 8 + 8);
  const col = l.who === 'barb' ? C.ox : C.green;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 990, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: 'rgba(28,36,34,0.88)', borderRadius: 14, padding: '10px 26px', display: 'flex', alignItems: 'center', gap: 16, fontFamily: OS, fontSize: 40}}>
      <span style={{background: col, color: C.paper, fontSize: 24, fontWeight: 700, letterSpacing: 3, padding: '4px 12px', borderRadius: 6}}>{l.who === 'barb' ? 'BARBARA' : 'ANN'}</span>
      <span>{shown.map((w, i) => <span key={i} style={{color: page * 8 + i === cur ? '#F2D98A' : C.paper, marginRight: 11, fontWeight: 500}}>{w}</span>)}</span>
    </div></div>; };

const Title = ({t}) => { const p = ramp(t, TITLE, 0.2); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: 330, top: 56}}>
    <div style={{opacity: p, transform: `scale(${1.5 - 0.5 * p}) rotate(-3deg)`, background: C.paper, border: `6px solid ${C.green}`, outline: `2px solid ${C.gold}`, outlineOffset: -14,
      borderRadius: 14, padding: '26px 64px', textAlign: 'center', boxShadow: '0 10px 30px rgba(40,30,10,0.25)'}}>
      <div style={{fontFamily: OS, fontWeight: 700, fontSize: 28, letterSpacing: 10, color: C.ox}}>WHY IT HAPPENS</div>
      <div style={{fontFamily: FR, fontWeight: 700, fontSize: 80, color: C.green, lineHeight: 1.05}}>The Money Illusion</div>
    </div></div>; };

export const Story = () => { const f = useCurrentFrame(); const t = f / FPS;
  const cam = camAt(t);
  // Barbara
  const bx = barbX(t), walking = t < ARRIVE; const bp = track(BARB_KEYS, t);
  const bm = mouthAt('barb', t); const am = mouthAt('ann', t);
  const wave1 = t > ARRIVE - 0.2 && t < en('l1') ? 14 * Math.sin(t * 13) : 0;
  const hop = t > st('l3') && t < en('l3') + 0.1 ? 16 * Math.abs(Math.sin((t - st('l3')) * 9)) : 0;
  const ap = track(ANN_KEYS, t, 0.28);
  const talkB = bm.talking ? 2.2 * Math.sin(t * 8.5) : 0, talkA = am.talking ? 2 * Math.sin(t * 8) : 0;
  const breathe = (o) => 2.2 * Math.sin(t * 2.2 + o);
  const annTurn = ap.turn, annSign = Math.sign(annTurn || 1);
  return <AbsoluteFill style={{background: C.ground, overflow: 'hidden'}}>
    <Audio src={staticFile('dialogue.wav')} />
    {STEPS.map((s, i) => <Sequence key={i} from={Math.round(s * FPS)} durationInFrames={10}><Audio src={staticFile('sfx/step.wav')} volume={0.32} /></Sequence>)}
    <Sequence from={Math.round((tPrices + 0.5) * FPS)} durationInFrames={20}><Audio src={staticFile('sfx/stamp.wav')} volume={0.5} /></Sequence>
    <Sequence from={Math.round(tRicher * FPS)} durationInFrames={20}><Audio src={staticFile('sfx/stamp.wav')} volume={0.45} /></Sequence>
    <Sequence from={Math.round(TITLE * FPS)} durationInFrames={30}><Audio src={staticFile('sfx/stamp.wav')} volume={0.55} /></Sequence>
    <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(960px, 540px) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`}}>
      <Ground />
      <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
        <Street />
        <Shop t={t} />
        <Rig x={ANN_X} y={GROUND_Y} s={S} look={ANN} face={ap.face} mouth={am.v} blink={blinkAt(t, 1.3)} turn={annTurn} bob={breathe(1)}
          pose={{...ap, tilt: ap.tilt + talkA}} eyeLook={2}
          frontItem={t > st('l2') - 0.3 && t < st('l4') - 0.1 || (t > st('l6') - 0.3 && t < st('l7')) ? slip('+2%', C.green, annSign) : null} />
        <Rig x={bx} y={GROUND_Y - hop} s={S} look={BARB} face={bp.face} mouth={bm.v} blink={blinkAt(t, 0)} walk={walking ? (bx + 220) / STEP : null}
          bob={walking ? 0 : breathe(0)} pose={{...bp, fa: bp.fa + wave1, tilt: bp.tilt + talkB}} eyeLook={t > tPrices && t < tWait ? 4 : 2}
          frontItem={t < st('l7') - 0.1 ? slip('+5%', C.ox, 1) : null} />
        <Sum x={640} y={36} t={t} color={C.ox} rows={[['RAISE', '+5%', tWait - 0.1], ['PRICES', '−4%', tWait + 0.35], ['', '= +1%', tRicher, true]]} />
        <Sum x={1070} y={36} t={t} color={C.green} rows={[['RAISE', '+2%', st('l6') + 0.05], ['PRICES', '−0%', tMove], ['', '= +2%', tTwo, true]]} />
        {t > st('l7') && <text x={bx + 92} y={300} fontFamily={FR} fontWeight="700" fontSize={90 * ramp(t, st('l7'), 0.25)} fill={C.ox} opacity={t > TITLE ? 1 - ramp(t, TITLE, 0.3) : 1}>?</text>}
      </svg>
    </AbsoluteFill>
    <Title t={t} />
    <Captions t={t} />
    <Grain />
  </AbsoluteFill>; };
