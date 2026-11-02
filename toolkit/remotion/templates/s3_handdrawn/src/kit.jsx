// Tokens: hand-written scenes (S3 "The meter is running"). Every reveal is cued to Sam's spoken words via cue().
import React from 'react';
import {useCurrentFrame, interpolate, spring} from 'remotion';
import {C, f, prog, cue, SD, HAND, MONO, SANS} from './lib';
import {Page, Sheet, Ink, Hand, Mono, Stamp, PopG, Figure, rectPath, ellPath, linePath, wob, rng} from './draw';


const Src = ({text, at = 0}) => <Hand x={60} y={44} text={text} at={at} dur={0.6} size={24} weight={400} color={C.secondary} font={SANS} />;
const Label = ({text, at}) => <Hand x={1860} y={44} text={text} at={at} dur={0.5} size={24} weight={400} color={C.secondary} font={SANS} anchor="end" />;

// ---------------------------------------------------------------- S1 Limit reached
const Laptop = ({x, y, at}) => <>
  <Ink at={at} dur={0.7} d={rectPath(x - 14, y - 14, 788, 498, 10, 1.5)} w={6} fill={C.ink} fillAt={at + 0.2} />
  <Ink at={at + 0.1} dur={0.6} d={rectPath(x, y, 760, 470, 11)} w={3} fill="#FFFFFF" fillAt={at + 0.3} shadow={false} />
  <Ink at={at + 0.4} dur={0.5} d={wob([[x - 90, y + 520], [x + 850, y + 520], [x + 770, y + 484], [x - 10, y + 484], [x - 90, y + 520]], 12, 1.5)} w={6} fill="#D9CDB8" fillAt={at + 0.6} />
  <path d={wob([[x - 90, y + 520], [x + 850, y + 520], [x + 846, y + 532], [x - 86, y + 532], [x - 90, y + 520]], 14, 0.8)} fill="#BFAF98" stroke={C.ink} strokeWidth={4} opacity={useCurrentFrame() >= f(at + 0.6) ? 1 : 0} />
  <Ink at={at + 0.5} dur={0.4} d={rectPath(x + 20, y + 20, 720, 52, 13, 1.5)} w={3} color={C.rule} shadow={false} />
  <circle cx={x + 380} cy={y - 4} r={4} fill="#6E6258" />
</>;
const Bubble = ({x, y, w, me, at, seed}) => <PopG at={at} cx={x + w / 2} cy={y + 30}>
  <path d={rectPath(x, y, w, 60, seed, 1.6)} fill={me ? C.you : C.ai} stroke={C.ink} strokeWidth={3} />
  {[0, 1, 2].map((i) => <path key={i} d={linePath(x + 22, y + 20 + i * 12, x + w - 40 - ((seed + i) % 3) * 40, y + 20 + i * 12, seed + i, 0.8)} stroke={C.secondary} strokeWidth={4} strokeLinecap="round" opacity={i < 2 ? 1 : 0} />)}
</PopG>;
// A seated person at the laptop (our own drawing): chair, sweater, hair, face in profile; types, then slumps.
const Person = ({at = 0.2, slump = 0, typing = 0}) => { const fr = useCurrentFrame(); const sd = slump;
  const H = [300, 815]; const sh = [[290, 618 + sd * 28], [382, 628 + sd * 28]];
  const hc = [356 + sd * 22, 540 + sd * 50]; const r = 52;
  const bob = typing ? 5 * Math.sin(fr * 0.9) : 0;
  const hand = [520 - sd * 70 + bob * 0.4, 642 + sd * 135 + bob];
  const elbow = [425 - sd * 20, 735 + sd * 40];
  const P = (pts, seed, amp = 1.2) => wob(pts, seed, amp);
  const mouthC = hc[1] + 30 + (sd > 0.4 ? -9 : 6);
  return <>
    {/* chair */}
    <Ink at={at} dur={0.4} d={P([[212, 595], [222, 835]], 901)} w={6} color={C.secondary} />
    <Ink at={at + 0.1} dur={0.35} d={P([[200, 835], [380, 835]], 902)} w={7} color={C.secondary} />
    <Ink at={at + 0.2} dur={0.3} d={P([[228, 838], [222, 965]], 903)} w={5} color={C.secondary} />
    <Ink at={at + 0.2} dur={0.3} d={P([[362, 838], [368, 965]], 904)} w={5} color={C.secondary} />
    {/* legs */}
    <Ink at={at + 0.3} dur={0.4} d={P([[312, 812], [455, 818], [462, 952], [512, 956]], 905, 1)} w={16} color={C.ink} />
    {/* torso (sweater) */}
    <Ink at={at + 0.35} dur={0.5} d={P([sh[0], sh[1], [352, 826], [252, 826], sh[0]], 906, 1.5)} w={5} fill="#E9DCC4" fillAt={at + 0.6} />
    {/* back arm */}
    <Ink at={at + 0.55} dur={0.4} d={P([[352, 640 + sd * 28], [elbow[0] - 18, elbow[1] + 6], [hand[0] - 26, hand[1] + 6]], 907, 1)} w={11} color={C.secondary} />
    {/* neck + head */}
    <Ink at={at + 0.5} dur={0.2} d={P([[340 + sd * 12, 600 + sd * 30], [hc[0] - 8, hc[1] + r - 4]], 908, 0.5)} w={10} color={C.ink} />
    <Ink at={at + 0.55} dur={0.45} d={ellPath(hc[0], hc[1], r, r * 1.05, 909, 1.4)} w={5} fill="#FFFFFF" fillAt={at + 0.6} />
    <Ink at={at + 0.8} dur={0.35} d={P([[hc[0] - 52, hc[1] + 2], [hc[0] - 44, hc[1] - 40], [hc[0] - 5, hc[1] - 58], [hc[0] + 32, hc[1] - 44], [hc[0] + 46, hc[1] - 22]], 910, 1)} w={13} color={C.ink} />
    {/* face: eye, nose, mouth (smile -> frown) */}
    {fr >= f(at + 1.0) && <g>
      {sd > 0.4 ? <path d={`M ${hc[0] + 16} ${hc[1] - 2} q 8 5 16 0`} stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
                : <circle cx={hc[0] + 24} cy={hc[1] - 4} r={5.5} fill={C.ink} />}
      <path d={`M ${hc[0] + 47} ${hc[1] - 2} l 10 14 l -10 2`} stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${hc[0] + 20} ${hc[1] + 30} Q ${hc[0] + 31} ${mouthC} ${hc[0] + 42} ${hc[1] + 28}`} stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>}
    {/* front arm + hand */}
    <Ink at={at + 0.65} dur={0.4} d={P([[372, 642 + sd * 28], elbow, hand], 911, 1)} w={12} color={C.ink} />
    {fr >= f(at + 1.0) && <circle cx={hand[0]} cy={hand[1]} r={11} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} />}
  </>; };
const TokS1 = () => { const fr = useCurrentFrame();
  const tHard = cue(1, 'hard'), tSet = cue(1, 'set'), tEnter = cue(1, 'Enter'), tSlam = cue(1, 'slams'), tLimit = cue(1, 'Limit'), tFew = cue(1, 'few');
  const slump = prog(fr, tFew - 0.2, 0.8);
  return <Page>
    <Sheet>
      <Laptop x={560} y={150} at={0.0} />
      <Bubble x={600} y={250} w={420} at={tHard - 0.2} seed={21} />
      <Bubble x={980} y={330} w={300} me at={tHard + 0.4} seed={22} />
      <Bubble x={600} y={410} w={520} at={tSet} seed={23} />
      <Bubble x={900} y={490} w={380} me at={tSet + 0.6} seed={24} />
      <Person at={0.2} slump={slump} typing={fr >= f(tHard - 0.3) && fr < f(tEnter) ? 1 : 0} />
      <Ink at={tEnter} dur={0.25} d={linePath(1180, 560, 1250, 600, 41)} w={6} color={C.callout} />
      <Ink at={tEnter + 0.05} dur={0.25} d={linePath(1190, 610, 1255, 615, 42)} w={6} color={C.callout} />
    </Sheet>
    <Hand x={1215} y={680} text="Enter ↵" at={tEnter} size={44} color={C.callout} />
    <Stamp x={940} y={420} at={tSlam + 0.15} text="LIMIT REACHED" sub={null} size={78} rotate={-7} />
    <Hand x={900} y={735} text="resets at 3:40 pm" at={tLimit + 0.5} size={54} color={C.negative} anchor="middle" />
    <Label text="Generic chat window (illustration)" at={0.5} />
  </Page>; };

// ---------------------------------------------------------------- S2 The riddle
const Env = ({x, y, w = 34, h = 24, at, seed, thick}) => <PopG at={at} cx={x + w / 2} cy={y + h / 2}>
  <path d={rectPath(x, y, w, h, seed, thick ? 2 : 0.8)} fill={thick ? '#FFE3D1' : '#FFFFFF'} stroke={C.ink} strokeWidth={thick ? 5 : 2.5} />
  <path d={wob([[x, y], [x + w / 2, y + h * 0.55], [x + w, y]], seed + 1, thick ? 1.5 : 0.5)} fill="none" stroke={C.ink} strokeWidth={thick ? 4 : 2} />
</PopG>;
const Gauge = ({cx, cy, at, level, color}) => { const a = Math.PI * (1 - level); const nx = cx + 150 * Math.cos(a), ny = cy - 150 * Math.sin(a);
  return <>
    <Ink at={at} dur={0.6} d={wob(Array.from({length: 13}, (_, i) => [cx - 180 * Math.cos(Math.PI * i / 12), cy - 180 * Math.sin(Math.PI * i / 12)]), 51, 1.5)} w={6} />
    <Ink at={at + 0.3} dur={0.3} d={linePath(cx - 200, cy, cx + 200, cy, 52)} w={5} />
    <Hand x={cx - 180} y={cy + 40} text="E" at={at + 0.4} size={40} anchor="middle" />
    <Hand x={cx + 180} y={cy + 40} text="F" at={at + 0.4} size={40} anchor="middle" />
    {at != null && <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth={9} strokeLinecap="round" opacity={useCurrentFrame() >= f(at + 0.5) ? 1 : 0} />}
    <circle cx={cx} cy={cy} r={12} fill={C.ink} opacity={useCurrentFrame() >= f(at + 0.5) ? 1 : 0} />
  </>; };
const TokS2 = () => { const fr = useCurrentFrame();
  const tTue = cue(2, 'Tuesday'), tForty = cue(2, 'Forty'), tBarely = cue(2, 'barely'), tWed = cue(2, 'Wednesday'), tFour = cue(2, 'Four'), tLocked = cue(2, 'locked'), tSame = cue(2, 'Same'), tRiddle = cue(2, 'riddle'), tWhat = cue(2, 'what');
  const tueLevel = 0.92 - 0.06 * prog(fr, tBarely - 0.3, 1.2);
  const wedLevel = 0.92 - 0.92 * prog(fr, tFour + 0.6, 1.6);
  const flash = fr > f(tLocked) ? (Math.floor((fr - f(tLocked)) / 8) % 2 === 0 ? 1 : 0.35) : 1;
  return <Page>
    <Sheet>
      <Ink at={0} dur={0.5} d={linePath(960, 120, 960, 900, 61, 3)} w={4} color={C.rule} />
      {Array.from({length: 40}, (_, i) => <Env key={i} x={150 + (i % 10) * 64} y={250 + Math.floor(i / 10) * 46} at={tForty + i * 0.03} seed={100 + i} />)}
      <Gauge cx={480} cy={760} at={tTue + 0.3} level={tueLevel} color={C.accent} />
      {[0, 1, 2, 3].map((i) => <Env key={i} x={1130 + i * 150} y={270} w={110} h={80} at={tFour + i * 0.18} seed={200 + i} thick />)}
      <g opacity={flash}><Gauge cx={1440} cy={760} at={tWed + 0.3} level={wedLevel} color={C.negative} /></g>
    </Sheet>
    <Hand x={480} y={160} text="TUESDAY" at={tTue - 0.1} size={64} anchor="middle" />
    <Hand x={1440} y={160} text="WEDNESDAY" at={tWed - 0.1} size={64} anchor="middle" />
    <Mono x={480} y={490} text="40 quick messages" at={tForty + 0.4} size={36} color={C.secondary} anchor="middle" />
    <Mono x={1440} y={420} text="4 prompts" at={tFour + 0.5} size={36} color={C.secondary} anchor="middle" />
    <Hand x={1440} y={520} text="locked out" at={tLocked} size={52} color={C.negative} anchor="middle" />
    <Hand x={960} y={950} text="Same app. Same plan." at={tSame} size={44} color={C.ink} anchor="middle" />
    <Hand x={960} y={735} text="So what the hell is going on?" at={tWhat - 0.1} size={44} color={C.ink} weight={700} rotate={-2} anchor="middle" />
    <Hand x={960} y={610} text="?" at={tRiddle} size={150} color={C.callout} anchor="middle" />
    <Label text="Illustration: how fast you hit a limit depends on chat length, model and files" at={0.5} />
  </Page>; };

// ---------------------------------------------------------------- S3 Twenty questions (worked example)
const Odometer = ({x, y, value, digits = 8, w = 92}) => { const s = String(Math.floor(value)).padStart(digits, '0');
  return <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', display: 'flex', gap: 10}}>
    {s.split('').map((ch, i) => <div key={i} style={{width: w, height: w * 1.43, border: `5px solid ${C.ink}`, borderRadius: 10, background: '#FFFFFF', fontFamily: MONO, fontWeight: 700,
      fontSize: w, color: i < digits - String(Math.floor(value)).length ? C.rule : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ch}</div>)}
  </div>; };
const fmt = (v) => Math.round(v).toLocaleString('en-US');
const TokS3 = () => { const fr = useCurrentFrame();
  const tAdds = cue(3, 'adds'), tReport = cue(3, 'report'), tForty = cue(3, 'forty'), tTwenty = cue(3, 'twenty'), tEach = cue(3, 'Each'),
    tLast = cue(3, 'last'), tMillion = cue(3, 'million'), tLike = cue(3, 'Like');
  // question q (1..20) lands between tTwenty and tLast; the odometer adds what each question re-sends
  const span = Math.max(1.5, tLast - tTwenty - 0.2); const qAt = (q) => tTwenty + 0.1 + (q - 1) * span / 20;
  let sent = 0, cur = 0; for (let q = 1; q <= 20; q++) { if (fr >= f(qAt(q))) { cur = 40000 + 1000 * (q - 1); sent += cur; } }
  const nQ = Array.from({length: 20}, (_, i) => i + 1).filter((q) => fr >= f(qAt(q))).length;
  const pulse = cur && fr < f(qAt(Math.min(20, nQ)) + 0.25) ? 1 : 0;
  return <Page>
    <Hand x={960} y={140} text="One report, twenty questions" at={0.15} size={60} anchor="middle" />
    <Sheet>
      {/* the report */}
      <Ink at={tReport - 0.2} dur={0.6} d={rectPath(150, 290, 300, 380, 301)} w={6} fill="#FFFFFF" fillAt={tReport} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <Ink key={i} at={tReport + 0.1 + i * 0.05} dur={0.25} d={linePath(185, 345 + i * 42, 410 - (i % 3) * 30, 345 + i * 42, 310 + i, 1)} w={5} color={C.secondary} />)}
      <path d={rectPath(150, 290, 300, 380, 301)} fill="none" stroke={C.accent} strokeWidth={10} opacity={pulse * 0.8} />
      {/* question cards, 2 columns of 10 */}
      {Array.from({length: 20}, (_, i) => { const q = i + 1, cx = 560 + (i % 2) * 120, cy = 300 + Math.floor(i / 2) * 40;
        return <PopG key={i} at={qAt(q)} cx={cx + 50} cy={cy + 15}><path d={rectPath(cx, cy, 100, 30, 330 + i, 0.9)} fill={q === nQ ? '#FFE3D1' : '#F1EEE6'} stroke={C.ink} strokeWidth={2.5} /></PopG>; })}
      {/* re-read loop: report -> odometer */}
      <Ink at={tLike} dur={0.7} d={wob([[330, 745], [560, 830], [900, 805], [1180, 640]], 360, 3)} w={5} color={C.callout} />
      <Ink at={tLike + 0.6} dur={0.25} d={wob([[1150, 640], [1182, 638], [1170, 668]], 361, 1)} w={5} color={C.callout} />
    </Sheet>
    <Mono x={300} y={710} text="40,000 tokens" at={tForty} size={38} color={C.accent} anchor="middle" />
    <Mono x={680} y={725} text={nQ ? `question ${nQ}: +1,000` : ''} at={tTwenty} size={28} color={C.secondary} anchor="middle" />
    <Hand x={1380} y={300} text="tokens the app has sent" at={tEach - 0.3} size={40} anchor="middle" />
    <Odometer x={1380} y={430} value={sent} digits={7} w={72} />
    <Mono x={1380} y={560} text={cur ? `this question re-sends ${fmt(cur)}` : ''} at={tEach} size={30} color={C.callout} anchor="middle" />
    <Hand x={1380} y={650} text="nearly a million" at={tMillion - 0.1} size={56} color={C.callout} anchor="middle" />
    <Mono x={960} y={880} text="40,000 + 41,000 + ... + 59,000 = 990,000" at={tMillion + 0.6} size={34} color={C.ink} anchor="middle" />
    <Label text="Worked example: illustrative numbers" at={0.4} />
    <Src text="Resending: Claude Code docs, Manage costs effectively (2026)" at={0.5} />
  </Page>; };

// ---------------------------------------------------------------- S4 The pitch
const PriceCard = ({x, y, name, price, at, seed}) => <PopG at={at} cx={x + 150} cy={y + 110}>
  <path d={rectPath(x, y, 300, 220, seed)} fill="#FFFFFF" stroke={C.ink} strokeWidth={5} />
  <text x={x + 150} y={y + 80} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={50} fill={C.ink}>{name}</text>
  <text x={x + 150} y={y + 170} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={56} fill={C.ink}>{price}</text>
</PopG>;
const Brain = ({cx, cy, r, at, seed, glow}) => { const pts = Array.from({length: 18}, (_, i) => { const a = i / 18 * 2 * Math.PI; const k = 1 + 0.12 * Math.sin(i * 2.7 + seed); return [cx + r * k * Math.cos(a), cy + r * 0.78 * k * Math.sin(a)]; });
  return <>
    <Ink at={at} dur={0.5} d={wob(pts, seed, r * 0.04, true)} w={4 + r / 40} fill={glow ? '#FFE39A' : '#F1EEE6'} fillAt={at + 0.3} />
    <Ink at={at + 0.3} dur={0.4} d={wob([[cx, cy - r * 0.7], [cx - r * 0.1, cy], [cx, cy + r * 0.7]], seed + 5, r * 0.05)} w={3} />
    <Ink at={at + 0.4} dur={0.4} d={wob([[cx - r * 0.7, cy - r * 0.1], [cx - r * 0.35, cy + r * 0.2], [cx - r * 0.5, cy + r * 0.45]], seed + 6, r * 0.04)} w={3} />
    <Ink at={at + 0.45} dur={0.4} d={wob([[cx + r * 0.7, cy - r * 0.1], [cx + r * 0.35, cy + r * 0.2], [cx + r * 0.5, cy + r * 0.45]], seed + 7, r * 0.04)} w={3} />
  </>; };
const TokS4 = () => {
  const tPage = cue(4, 'pricing'), tFree = cue(4, 'Free'), tTw = cue(4, 'Twenty'), tHund = cue(4, 'hundred'), tTwo = cue(4, 'Two'), tLadder = cue(4, 'ladder'), tIntern = cue(4, 'intern'), tProf = cue(4, 'professor');
  const cards = [['Free', '$0', tFree], ['Pro', '$20', tTw], ['Max', '$100', tHund], ['Ultra', '$200', tTwo]];
  return <Page>
    <Sheet>
      {cards.map(([nm, pr, at], i) => <PriceCard key={nm} x={170 + i * 420} y={820 - i * 110 - 220} name={nm} price={pr} at={at} seed={90 + i} />)}
      {cards.map(([nm, , at], i) => <Brain key={nm} cx={320 + i * 420} cy={480 - i * 110} r={50 + i * 22} at={tLadder + i * 0.25} seed={300 + i * 7} glow={i === 3} />)}
    </Sheet>
    <Hand x={320} y={370} text="intern?" at={tIntern} size={44} color={C.secondary} anchor="middle" rotate={-4} />
    <Hand x={1440} y={150} text="professor?" at={tProf} size={50} color={C.callout} anchor="end" rotate={3} />
    <Src text="Prices: claude.com/pricing (Oct 2026); brains are an illustration of the pitch, not a claim" at={tPage} />
  </Page>; };

// ---------------------------------------------------------------- S5 Title
const TokS5 = () => { const fr = useCurrentFrame();
  const tSame = cue(5, 'same'), tBuy = cue(5, 'buying');
  return <Page>
    <Hand x={960} y={470} text="You're not paying for a" at={0.1} size={92} anchor="middle" dur={0.9} />
    <Hand x={960} y={600} text="smarter AI" at={0.7} size={110} anchor="middle" dur={0.5} />
    <Sheet>
      <Ink at={tSame} dur={0.45} d={linePath(700, 610, 1220, 590, 501, 4)} w={10} color={C.negative} />
    </Sheet>
    <Hand x={1020} y={740} text="bigger tank" at={tBuy} size={96} color={C.callout} anchor="middle" rotate={-3} dur={0.6} />
    <Hand x={960} y={900} text="(for the same model)" at={tSame} size={40} color={C.secondary} weight={400} anchor="middle" />
  </Page>; };


// one centred line in two colours, written on left to right as a unit
const TwoTone = ({y, a, b, at, dur = 0.7, size = 130, colorB = C.callout}) => { const fr = useCurrentFrame(); if (fr < f(at)) return null; const p = prog(fr, at, dur);
  return <div style={{position: 'absolute', left: 960, top: y, transform: 'translate(-50%, -50%)', fontFamily: HAND, fontWeight: 700, fontSize: size, color: C.ink, whiteSpace: 'nowrap',
    clipPath: `inset(-20% ${(1 - p) * 100}% -20% -2%)`, lineHeight: 1.1}}>{a} <span style={{color: colorB}}>{b}</span></div>; };
// a better processor chip: package, pins on four sides, die, notch
export const ChipArt = ({cx, cy, s = 1, at = 0, glow = 0, cells = 0, cellsOut = 0, label = 'CHIP'}) => { const fr = useCurrentFrame(); if (fr < f(at)) return null;
  const o = Math.min(1, (fr - f(at)) / 8); const P = 360 * s, D = 220 * s, x0 = cx - P / 2, y0 = cy - P / 2;
  const pins = []; for (let i = 0; i < 8; i++) { const d = x0 + 40 * s + i * (P - 80 * s) / 7;
    pins.push(<rect key={'t' + i} x={d - 7 * s} y={y0 - 34 * s} width={14 * s} height={34 * s} rx={3 * s} fill="#B9BEC8" stroke={C.ink} strokeWidth={2} />);
    pins.push(<rect key={'b' + i} x={d - 7 * s} y={y0 + P} width={14 * s} height={34 * s} rx={3 * s} fill="#B9BEC8" stroke={C.ink} strokeWidth={2} />);
    const e = y0 + 40 * s + i * (P - 80 * s) / 7;
    pins.push(<rect key={'l' + i} x={x0 - 34 * s} y={e - 7 * s} width={34 * s} height={14 * s} rx={3 * s} fill="#B9BEC8" stroke={C.ink} strokeWidth={2} />);
    pins.push(<rect key={'r' + i} x={x0 + P} y={e - 7 * s} width={34 * s} height={14 * s} rx={3 * s} fill="#B9BEC8" stroke={C.ink} strokeWidth={2} />); }
  return <g opacity={o}>
    {pins}
    <rect x={x0} y={y0} width={P} height={P} rx={18 * s} fill="#2A2F3B" stroke={C.ink} strokeWidth={5} />
    <circle cx={x0 + 30 * s} cy={y0 + 30 * s} r={9 * s} fill="#4A5060" />
    <rect x={cx - D / 2} y={cy - D / 2} width={D} height={D} rx={10 * s} fill={glow > 0 ? `rgba(47,111,228,${0.35 + 0.65 * glow})` : '#3A4150'} stroke="#8C93A3" strokeWidth={3} />
    {Array.from({length: 4}, (_, i) => <line key={'g' + i} x1={cx - D / 2 + (i + 1) * D / 5} y1={cy - D / 2 + 8} x2={cx - D / 2 + (i + 1) * D / 5} y2={cy + D / 2 - 8} stroke="#596070" strokeWidth={1.5} opacity={0.6} />)}
    {cells > 0 && Array.from({length: 16}, (_, i) => <rect key={'c' + i} x={cx - D / 2 + 18 * s + (i % 4) * 48 * s} y={cy - D / 2 + 18 * s + Math.floor(i / 4) * 48 * s} width={38 * s} height={38 * s} rx={5 * s} fill={C.accent} opacity={cells * (1 - cellsOut)} />)}
    <text x={cx} y={y0 + P - 22 * s} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={26 * s} fill="#C9CDD6" letterSpacing={4}>{label}</text>
  </g>; };
// ================================================================ CLIP 1 (scenes 6-12)
// ---------- shared: chapter map (questions as the map; sealed item 6) ----------
export const QUESTIONS = ['What are you actually paying for?', 'What is a token?', 'Why does writing cost more than reading?',
  'What happens when it "thinks"?', 'Why does a long chat get heavier?', 'Why do agents burn through so much?', 'So which user are you?'];
export const ChapterMap = ({at = 0, active, done = [], sealed = [6], step = 0.18, sealAt, title}) => { const fr = useCurrentFrame();
  return <>
    {title && <Hand x={960} y={120} text={title} at={at} size={60} anchor="middle" />}
    <Sheet>
      <Ink at={at} dur={0.5} d={linePath(430, 200, 430, 200 + 7 * 98, 601, 2)} w={4} color={C.rule} />
      {QUESTIONS.map((q, i) => { const n = i + 1, y = 240 + i * 98, isA = n === active, isD = done.includes(n);
        return <g key={n}>
          <Ink at={at + 0.2 + i * step} dur={0.3} d={ellPath(430, y, 26, 26, 610 + i, 1.2)} w={4} fill={isA ? C.callout : isD ? C.rule : '#FFFFFF'} fillAt={at + 0.3 + i * step} color={isA ? C.callout : C.ink} />
          {isD && <Ink at={at + 0.4 + i * step} dur={0.3} d={linePath(490, y + 2, 490 + q.length * 17.5, y - 2, 620 + i, 2)} w={4} color={C.secondary} />}
        </g>; })}
      {active && <Ink at={(sealAt ?? at) + 0.1} dur={0.5} d={ellPath(500 + QUESTIONS[active - 1].length * 9, 240 + (active - 1) * 98, QUESTIONS[active - 1].length * 9 + 50, 44, 640 + active, 3)} w={5} color={C.callout} />}
    </Sheet>
    {QUESTIONS.map((q, i) => { const n = i + 1, y = 240 + i * 98, s = sealed.includes(n) && !(n === active);
      return <React.Fragment key={n}>
        <Mono x={430} y={y} text={String(n)} at={at + 0.25 + i * step} size={26} color={n === active ? '#FFFFFF' : C.ink} anchor="middle" />
        {s ? <Hand x={490} y={y} text="? ? ? ? ? ?" at={at + 0.25 + i * step} size={44} color={C.secondary} />
           : <Hand x={490} y={y} text={q} at={at + 0.25 + i * step} size={40} weight={n === active ? 700 : 400} color={done.includes(n) ? C.secondary : C.ink} dur={0.5} />}
      </React.Fragment>; })}
    {sealAt != null && sealed.includes(6) && active !== 6 && <Stamp x={1150} y={240 + 5 * 98} at={sealAt} text="SEALED" size={40} rotate={-6} color={C.secondary} />}
  </>; };

// ---------- shared: the meter (two bars: blue reading, ember writing) ----------
export const Meter = ({x, y, s = 1, at = 0, read = 0.5, write = 0.2, readAt, writeAt, labels = true, labelAt}) => { const fr = useCurrentFrame();
  const W = 360 * s, H = 360 * s, bw = 90 * s, by = y + H - 30 * s, bh = H - 90 * s;
  const rp = readAt != null ? prog(fr, readAt, 0.8) : 1, wp = writeAt != null ? prog(fr, writeAt, 0.8) : 1;
  return <>
    <Sheet>
      <Ink at={at} dur={0.5} d={rectPath(x, y, W, H, 701, 2)} w={5 * Math.max(0.6, s)} fill="#FFFFFF" fillAt={at + 0.2} />
      <Ink at={at + 0.3} dur={0.3} d={linePath(x + 20 * s, by, x + W - 20 * s, by, 702, 1)} w={3 * Math.max(0.6, s)} color={C.rule} />
      <rect x={x + 50 * s} y={by - bh * read * rp} width={bw} height={bh * read * rp} fill={C.accent} rx={6 * s} />
      <rect x={x + W - 50 * s - bw} y={by - bh * write * wp} width={bw} height={bh * write * wp} fill={C.callout} rx={6 * s} />
    </Sheet>
    {labels && <>
      <Hand x={x + 50 * s + bw / 2} y={y + H + 34 * s} text="reading" at={labelAt ?? readAt ?? at} size={34 * s} color={C.accent} anchor="middle" />
      <Hand x={x + W - 50 * s - bw / 2} y={y + H + 34 * s} text="writing" at={labelAt ?? writeAt ?? at} size={34 * s} color={C.callout} anchor="middle" />
    </>}
  </>; };

// ---------------------------------------------------------------- S6 Map 1
const TokS6 = () => { const tRoute = cue(6, 'route'), tTue = cue(6, 'Tuesday'), tWhich = cue(6, 'which');
  return <Page>
    <ChapterMap at={0.1} title="Seven questions, one riddle" step={0.22} sealAt={tTue + 0.3} />
    <Sheet><Ink at={tWhich - 0.1} dur={0.5} d={ellPath(698, 240 + 6 * 98, 245, 42, 650, 3)} w={5} color={C.callout} /></Sheet>
    <Hand x={1520} y={890} text="the riddle gets solved here" at={tTue} size={34} color={C.callout} weight={400} anchor="middle" rotate={-3} />
    <Sheet><Ink at={tTue + 0.3} dur={0.4} d={wob([[1300, 880], [1100, 870], [960, 830]], 651, 1.5)} w={4} color={C.callout} /></Sheet>
  </Page>; };

// ---------------------------------------------------------------- S7 Same engine
const Engine = ({cx, cy, at, seed, label = 'Sonnet', w = 170, color = C.ink, fill = '#EFEAE0'}) => <PopG at={at} cx={cx} cy={cy}>
  <path d={rectPath(cx - w / 2, cy - 45, w, 90, seed, 1.5)} fill={fill} stroke={color} strokeWidth={4} />
  {[-1, 0, 1].map((k) => <path key={k} d={rectPath(cx + k * w * 0.27 - 14, cy - 70, 28, 26, seed + k + 3, 0.8)} fill="#FFFFFF" stroke={color} strokeWidth={3} />)}
  <text x={cx} y={cy + 12} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={w > 150 ? 36 : 26} fill={color}>{label}</text>
</PopG>;
const TokS7 = () => { const fr = useCurrentFrame();
  const tLift = cue(7, 'Lift'), tSon = cue(7, 'Sonnet'), tFree = cue(7, 'free'), tSmart = cue(7, 'smarter'), tTank = cue(7, 'tank'), tGar = cue(7, 'garage'), tBig = cue(7, 'bigger');
  const lift = prog(fr, tLift, 0.6);
  const cols = [['Free', '$0'], ['Pro', '$20'], ['Max', '$100'], ['Ultra', '$200']];
  const tankH = [null, 30, 150, 300], tankLab = ['limited', '1x', '5x', '10x'];
  return <Page>
    <Sheet>
      {cols.map(([nm, pr], i) => { const cx = 330 + i * 420;
        return <g key={nm}>
          <g transform={`translate(0 ${-75 * lift}) rotate(${-4 * lift * (i % 2 ? -1 : 1)} ${cx} 250)`}>
            <path d={rectPath(cx - 150, 160, 300, 180, 90 + i)} fill="#FFFFFF" stroke={C.ink} strokeWidth={5} />
            <text x={cx} y={235} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={46} fill={C.ink}>{nm}</text>
            <text x={cx} y={305} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={48} fill={C.ink}>{pr}</text>
          </g>
          <Engine cx={cx - 50} cy={440} at={tSon + 0.1 + i * 0.15} seed={720 + i * 9} />
          {i > 0 && <Engine cx={cx + 110} cy={415} w={110} at={tGar + (i - 1) * 0.15} seed={760 + i * 5} label="Opus" fill="#E8EEFC" color={C.accent} />}
          {i > 0 && <Engine cx={cx + 110} cy={555} w={110} at={tBig + 0.2 + (i - 1) * 0.15} seed={780 + i * 5} label="Fable" fill="#FFE3D1" color={C.callout} />}
          {/* fuel tank to scale of weekly usage vs Pro (Free: limited, unscaled) */}
          {tankH[i] == null
            ? <Ink at={tTank} dur={0.4} d={rectPath(cx - 130, 870, 160, 50, 800 + i, 1.5)} w={4} color={C.secondary} dash="10 9" />
            : <g opacity={fr >= f(tTank + i * 0.15) ? 1 : 0}>
                <path d={rectPath(cx - 130, 920 - tankH[i] * prog(fr, tTank + i * 0.15, 0.7), 160, Math.max(1, tankH[i] * prog(fr, tTank + i * 0.15, 0.7)), 800 + i, 1.5)} fill={C.cache} stroke={C.ink} strokeWidth={4} />
              </g>}
        </g>; })}
    </Sheet>
    {cols.map((c, i) => <Mono key={i} x={330 + i * 420 - 50} y={tankH[i] == null ? 840 : 900 - tankH[i]} text={tankLab[i]} at={tTank + 0.4 + i * 0.15} size={30} color={C.ink} anchor="middle" />)}
    {[1, 2, 3].map((i) => <Hand key={i} x={330 + i * 420 + 110} y={630} text={i === 1 ? 'credits' : 'up to half/week'} at={tBig + 0.3} size={24} weight={400} color={C.callout} anchor="middle" />)}
    <Hand x={330} y={610} text="same Sonnet, free included" at={tFree} size={30} color={C.accent} weight={400} anchor="middle" rotate={-2} />
    <Hand x={960} y={680} text="not a smarter copy" at={tSmart} size={40} color={C.negative} anchor="middle" rotate={-3} out={tTank - 0.2} />
    <Mono x={960} y={965} text="tank = weekly usage vs Pro (Free: limited, not to scale) · line-up: claude.com/pricing, Oct 2026" at={tTank} size={20} color={C.secondary} anchor="middle" />
  </Page>; };

// ---------------------------------------------------------------- S8 What paid buys (dot squares)
const Squares = ({x, y, n, at, color, size = 52, gap = 10, step = 0.06, outline}) => <Sheet>
  {Array.from({length: n}, (_, i) => <PopG key={i} at={at + i * step} cx={x + i * (size + gap) + size / 2} cy={y + size / 2}>
    <rect x={x + i * (size + gap)} y={y} width={size} height={size} rx={4} fill={outline ? 'none' : color} stroke={outline ? color : 'none'} strokeWidth={3} strokeDasharray={outline ? '6 5' : undefined} />
  </PopG>)}
</Sheet>;
const TokS8 = () => {
  const tRoom = cue(8, 'Room'), tFive = cue(8, 'five'), tMax = cue(8, 'Max'), tUltra = cue(8, 'Ultra'), tTen = cue(8, 'ten'), tAcc = cue(8, 'access'), tOpus = cue(8, 'Opus');
  const rows = [
    {y: 250, lab: 'Pro vs Free', sub: 'per session', a: 'Free', b: 'Pro', n: 5, at: tFive, note: 'at least'},
    {y: 450, lab: 'Max vs Pro', sub: 'per 5 hours and per week', a: 'Pro', b: 'Max', n: 5, at: tMax + 0.3},
    {y: 650, lab: 'Ultra vs Pro', sub: 'per week; no 5-hour limit*', a: 'Pro', b: 'Ultra', n: 10, at: tTen},
  ];
  return <Page>
    <Hand x={960} y={120} text="Paying more buys room to run" at={0.1} size={58} anchor="middle" />
    {rows.map((r, i) => <React.Fragment key={i}>
      <Hand x={130} y={r.y + 20} text={r.lab} at={i === 0 ? tRoom : r.at - 0.3} size={46} />
      <Hand x={130} y={r.y + 75} text={r.sub} at={i === 0 ? tRoom + 0.2 : r.at - 0.2} size={28} weight={400} color={C.secondary} />
      <Mono x={720} y={r.y + 26} text={r.a} at={r.at - 0.2} size={26} color={C.secondary} anchor="end" />
      <Squares x={740} y={r.y} n={1} at={r.at - 0.2} color={C.secondary} />
      <Mono x={720} y={r.y + 104} text={r.b} at={r.at} size={26} color={C.accent} anchor="end" />
      <Squares x={740} y={r.y + 78} n={r.n} at={r.at} color={C.accent} />
      {r.note && <Hand x={740 + r.n * 62 + 20} y={r.y + 104} text={r.note} at={r.at + 0.5} size={32} color={C.accent} weight={400} />}
    </React.Fragment>)}
    <Mono x={130} y={860} text="one square = the smaller plan's usage in that window" at={tFive + 0.6} size={22} color={C.secondary} />
    <Sheet><PopG at={tAcc} cx={1500} cy={870}><path d={rectPath(1150, 820, 700, 110, 850, 1.5)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} /></PopG></Sheet>
    <Hand x={1180} y={852} text="+ access: Opus from Pro" at={tOpus - 0.1} size={34} color={C.ink} />
    <Hand x={1180} y={900} text="Fable: credits on Pro, up to ½ weekly on Max/Ultra" at={tOpus + 0.3} size={24} weight={400} color={C.callout} />
    <Src text="Source: claude.com/pricing; Claude Help Center, Pro plan usage (Oct 2026). *verified accounts" at={0.4} />
  </Page>; };

// ---------------------------------------------------------------- S9 Fine print
const HL = ({at, children}) => { const fr = useCurrentFrame(); const p = prog(fr, at, 0.6);
  return <span style={{backgroundImage: `linear-gradient(${C.hl}, ${C.hl})`, backgroundRepeat: 'no-repeat', backgroundSize: `${p * 100}% 100%`, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', padding: '0 4px'}}>{children}</span>; };
const Icon = ({kind, cx, cy, at, seed}) => <PopG at={at} cx={cx} cy={cy}>
  {kind === 'engine' && <><path d={rectPath(cx - 60, cy - 32, 120, 64, seed, 1.2)} fill="#EFEAE0" stroke={C.ink} strokeWidth={4} />
    {[-1, 0, 1].map((k) => <path key={k} d={rectPath(cx + k * 34 - 11, cy - 52, 22, 20, seed + k + 2, 0.6)} fill="#fff" stroke={C.ink} strokeWidth={3} />)}</>}
  {kind === 'scroll' && <><path d={rectPath(cx - 40, cy - 70, 80, 140, seed, 1.2)} fill="#fff" stroke={C.ink} strokeWidth={4} />
    {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={linePath(cx - 26, cy - 50 + k * 20, cx + 22 - (k % 2) * 14, cy - 50 + k * 20, seed + k, 0.5)} stroke={C.secondary} strokeWidth={3} />)}</>}
  {kind === 'file' && <><path d={wob([[cx - 50, cy - 60], [cx + 25, cy - 60], [cx + 50, cy - 35], [cx + 50, cy + 60], [cx - 50, cy + 60]], seed, 1.2, true)} fill="#fff" stroke={C.ink} strokeWidth={6} />
    <text x={cx} y={cy + 15} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={30} fill={C.ink}>MB</text></>}
</PopG>;
const TokS9 = () => { const fr = useCurrentFrame();
  const tFair = cue(9, 'fair'), tStam = cue(9, 'stamina'), tFine = cue(9, 'fine'), tModel = cue(9, 'model', 2), tChats = cue(9, 'chats'), tFiles = cue(9, 'files');
  const slide = prog(fr, tFine - 0.3, 0.6);
  return <Page>
    <Hand x={960} y={140} text="bigger model: can be more capable" at={tFair} size={44} color={C.secondary} anchor="middle" out={tFine - 0.3} />
    <Hand x={960} y={230} text="same model: stamina, not IQ" at={tStam - 0.2} size={56} color={C.callout} anchor="middle" out={tFine - 0.3} />
    <div style={{position: 'absolute', left: 260, top: 300 + (1 - slide) * 700, width: 1400, opacity: slide, background: '#FFFFFF', border: `3px solid ${C.rule}`, borderRadius: 6,
      boxShadow: '0 8px 24px rgba(27,31,42,0.10)', padding: '40px 56px', fontFamily: SANS, fontSize: 46, lineHeight: 1.45, color: C.ink, transform: 'rotate(-0.5deg)'}}>
      <div style={{fontSize: 22, color: C.secondary, marginBottom: 14, letterSpacing: 1}}>CLAUDE.COM/PRICING · FOOTNOTE · OCT 2026 (TYPESET)</div>
      *Usage limits apply. How fast you reach a limit depends on <HL at={tModel - 0.1}>the model you use</HL>, <HL at={tChats - 0.4}>how long your chats are</HL>, and <HL at={tFiles - 0.4}>how large your files are</HL>.
    </div>
    <Sheet>
      <Icon kind="engine" cx={560} cy={830} at={tModel} seed={901} />
      <Icon kind="scroll" cx={960} cy={830} at={tChats - 0.2} seed={911} />
      <Icon kind="file" cx={1360} cy={830} at={tFiles - 0.2} seed={921} />
    </Sheet>
    <Src text="Source: claude.com/pricing, footnote (Oct 2026)" at={tFine} />
  </Page>; };

// ---------------------------------------------------------------- S10 Map 2
const TokS10 = () => { const tTok = cue(10, 'Tokens');
  return <Page>
    <ChapterMap at={0} step={0.05} active={2} done={[1]} sealAt={null} />
    <Stamp x={1520} y={360} at={tTok} text="TOKENS" size={64} rotate={-6} color={C.accent} />
  </Page>; };

// ---------------------------------------------------------------- S11 Token chips
const CHIPC = ['#E8EEFC', '#FFE3D1', '#EAF3E3', '#F1EEE6'];
const Chips = ({x, y, toks, at, step = 0.07, size = 40, hi = [], hiAt, hiColor = C.callout}) => { const fr = useCurrentFrame(); let cx = x;
  return <>{toks.map((t, i) => { const w = Math.max(30, t.length * size * 0.62) + 26; const left = cx; cx += w + 10; const t0 = at + i * step; if (fr < f(t0)) return null;
    const sp = prog(fr, t0, 0.25); const isH = hi.includes(i) && hiAt != null && fr >= f(hiAt);
    return <div key={i} style={{position: 'absolute', left, top: y - 34 + (1 - sp) * 20, width: w, height: 68, opacity: sp, background: CHIPC[i % 4], borderRadius: 10,
      border: `${isH ? 5 : 3}px solid ${isH ? hiColor : C.ink}`, fontFamily: MONO, fontWeight: 600, fontSize: size, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'pre'}}>{t}</div>; })}</>; };
const TokS11 = () => {
  const tChunk = cue(11, 'chunk'), tShort = cue(11, 'short'), tEarl = cue(11, 'earlier'), tRare = cue(11, 'rarer'), tThree = cue(11, 'three', 1), tCode = cue(11, 'Code'), tThirty = cue(11, 'thirty');
  const sent = ['The', ' market', ' felt', ' un', 'fetter', 'ed', '.'];
  const code = ['df', '.', 'group', 'by', '("', 'id', '")', '["', 'x', '"]', '.', 'sum', '()'];
  return <Page>
    <Mono x={150} y={200} text="The market felt unfettered." at={0.1} size={56} />
    <Chips x={150} y={340} toks={sent} at={tChunk} hi={[1, 3, 4, 5]} hiAt={tShort} />
    <Sheet>
      <Ink at={tShort} dur={0.4} d={ellPath(360, 340, 112, 52, 1101, 2)} w={4} color={C.accent} />
      <Ink at={tThree - 0.2} dur={0.5} d={linePath(612, 410, 1070, 410, 1102, 1.5)} w={6} color={C.callout} />
    </Sheet>
    <Hand x={355} y={440} text="one chip" at={tShort + 0.2} size={36} color={C.accent} anchor="middle" />
    <Hand x={840} y={460} text="three chips" at={tThree} size={36} color={C.callout} anchor="middle" />
    <Mono x={1150} y={300} text="≈ 3.5 English characters" at={tEarl} size={30} color={C.ink} />
    <Mono x={1150} y={345} text="per token (earlier Claude models)" at={tEarl + 0.3} size={24} color={C.secondary} />
    <Mono x={150} y={570} text={'df.groupby("id")["x"].sum()'} at={tCode - 0.4} size={40} color={C.secondary} />
    <Chips x={150} y={660} toks={code} at={tCode + 0.1} step={0.06} size={30} />
    <Hand x={150} y={830} text="newer Claude models: about 30% more tokens for the same text" at={tThirty - 0.3} size={42} color={C.callout} />
    <Label text="Example splits are illustrative; every model's tokenizer differs" at={tChunk} />
    <Src text="Source: Anthropic glossary (Nov 2026)" at={tEarl} />
  </Page>; };

// ---------------------------------------------------------------- S12 The meter
const TokS12 = () => { const fr = useCurrentFrame();
  const tSend = cue(12, 'send'), tWrites = cue(12, 'writes'), tMeet = cue(12, 'Meet'), tBlue = cue(12, 'Blue'), tOr = cue(12, 'Orange'), tWhy = cue(12, 'Why'), tLimit = cue(12, 'limit'), tCost = cue(12, 'Hold');
  const dock = 0;
  const mx = 1100 + (1560 - 1100) * dock, my = 250 + (130 - 250) * dock, ms = 1 - 0.55 * dock;
  return <Page>
    <Sheet>
      <PopG at={tSend - 0.3} cx={350} cy={420}><path d={rectPath(120, 340, 460, 160, 1201, 2)} fill="#E8EEFC" stroke={C.ink} strokeWidth={4} /></PopG>
      <PopG at={tWrites - 0.2} cx={350} cy={680}><path d={rectPath(120, 600, 460, 160, 1202, 2)} fill="#F1EEE6" stroke={C.ink} strokeWidth={4} /></PopG>
      {Array.from({length: 14}, (_, i) => { const t0 = tSend + i * 0.12, p = prog(fr, t0, 0.9); if (fr < f(t0) || p >= 1) return null; const sx = 560, sy = 400 + (i % 3) * 25, ex = 1180, ey = 470;
        return <rect key={i} x={sx + (ex - sx) * p} y={sy + (ey - sy) * p - 60 * Math.sin(Math.PI * p)} width={30} height={22} rx={4} fill={C.accent} />; })}
      {Array.from({length: 8}, (_, i) => { const t0 = tWrites + 0.2 + i * 0.14, p = prog(fr, t0, 0.9); if (fr < f(t0) || p >= 1) return null; const sx = 1300, sy = 470, ex = 560, ey = 660 + (i % 3) * 20;
        return <rect key={i} x={sx + (ex - sx) * p} y={sy + (ey - sy) * p - 60 * Math.sin(Math.PI * p)} width={30} height={22} rx={4} fill={C.callout} />; })}
    </Sheet>
    <Hand x={350} y={420} text="your message" at={tSend - 0.2} size={40} anchor="middle" />
    <Hand x={350} y={680} text="its answer" at={tWrites} size={40} anchor="middle" />
    <Hand x={1250} y={160} text="the meter" at={tMeet} size={56} anchor="middle" out={tCost + 0.4} />
    <Meter x={mx} y={my} s={ms} at={tMeet} read={0.55} write={0.3} readAt={tBlue} writeAt={tOr} />
    <Hand x={1280} y={790} text="— Why two colours?" at={tWhy} size={40} weight={400} color={C.accent} anchor="middle" rotate={-2} out={tCost + 0.5} />
    <Hand x={960} y={880} text="hold that thought…" at={tCost - 0.1} size={52} color={C.callout} anchor="middle" />
    <Hand x={1280} y={710} text="your limit + your bill" at={tLimit - 0.1} size={34} color={C.ink} anchor="middle" />
    <Label text="Meter is illustrative unless a number is shown" at={tMeet + 0.3} />
  </Page>; };

// ================================================================ CLIP 2 (scenes 13-18)
// ---------------------------------------------------------------- S13 Map 3
const TokS13 = () => { const tSur = cue(13, 'surprise');
  return <Page>
    <ChapterMap at={0} step={0.05} active={3} done={[1, 2]} sealAt={null} />
    <Hand x={1500} y={520} text="writing > reading?" at={tSur - 0.2} size={48} color={C.callout} anchor="middle" rotate={-4} />
  </Page>; };

// ---------------------------------------------------------------- S14 Five times
const Tag = ({x, y, w, text, color, at, seed}) => { const fr = useCurrentFrame(); const t = fr - f(at); if (t < 0) return null;
  const sw = spring({frame: t, fps: 30, config: {damping: 9, stiffness: 120, mass: 0.7}}); const rot = (1 - sw) * -18;
  return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, transformOrigin: '0% 50%', opacity: Math.min(1, t / 4)}}>
    <svg width={w + 20} height={120} style={{position: 'absolute', left: -10, top: -10, overflow: 'visible'}}>
      <path d={wob([[10, 10], [w + 10, 10], [w + 10, 110], [10, 110], [10, 10]], seed, 1.5)} fill="#FFFFFF" stroke={color} strokeWidth={6} />
      <circle cx={34} cy={60} r={10} fill="none" stroke={color} strokeWidth={4} />
    </svg>
    <div style={{position: 'absolute', left: 64, top: 22, fontFamily: MONO, fontWeight: 700, fontSize: 44, color, whiteSpace: 'nowrap'}}>{text}</div>
  </div>; };
const TokS14 = () => {
  const tRead = cue(14, 'reading'), tPer = cue(14, 'per'), tWrite = cue(14, 'Writing'), tTen = cue(14, 'ten'), tFive = cue(14, 'Five'), tSame = cue(14, 'same');
  return <Page>
    <Meter x={150} y={250} s={1.05} at={0} read={0.18} write={0.9} readAt={tRead} writeAt={tTen} />
    <Hand x={660} y={200} text="Sonnet 5.5, per million tokens" at={tPer - 0.2} size={40} color={C.secondary} />
    <Tag x={660} y={270} w={560} text="$2  read" color={C.accent} at={tRead + 0.2} seed={1401} />
    <Tag x={660} y={430} w={560} text="$10 written" color={C.callout} at={tTen - 0.1} seed={1402} />
    <Sheet><Ink at={tFive - 0.3} dur={0.5} d={wob([[1270, 320], [1310, 330], [1310, 480], [1270, 490]], 1403, 1.5)} w={6} color={C.callout} /></Sheet>
    <Hand x={1350} y={405} text="5x" at={tFive} size={140} color={C.callout} dur={0.3} />
    {[['Opus 5.5', '$4 / $20'], ['Fable 5.1', '$10 / $50'], ['Haiku 5.5', '$0.10 / $0.50*']].map(([m, p], i) =>
      <React.Fragment key={m}>
        <Mono x={660} y={680 + i * 62} text={m} at={tSame - 0.2 + i * 0.2} size={34} color={C.ink} />
        <Mono x={960} y={680 + i * 62} text={p} at={tSame - 0.2 + i * 0.2} size={34} color={C.ink} />
        <Hand x={1370} y={680 + i * 62} text="= 5x" at={tSame + i * 0.2} size={38} color={C.callout} />
      </React.Fragment>)}
    <Mono x={660} y={880} text="read / written · *Haiku: prompts up to 100K tokens" at={tSame + 0.5} size={22} color={C.secondary} />
    <Src text="Source: Anthropic API pricing (platform.claude.com, Oct 2026)" at={tPer} />
  </Page>; };

// ---------------------------------------------------------------- S15 Stamp and typewriter
const TokS15 = () => { const fr = useCurrentFrame();
  const tChip = cue(15, 'chip'), tKnown = cue(15, 'known'), tPar = cue(15, 'parallel'), tStamp = cue(15, 'stamp'), tType = cue(15, 'typewriter'), tDep = cue(15, 'depends'), tKey = cue(15, 'key');
  const tSlam = tPar - 0.1; const drop = fr < f(tSlam) ? 0 : spring({frame: fr - f(tSlam), fps: 30, config: {damping: 14, stiffness: 260, mass: 0.6}});
  const lit = fr >= f(tSlam + 0.15);
  const typed = fr < f(tType) ? 0 : Math.min(18, 1 + Math.floor((fr - f(tType)) / 11));
  return <Page>
    <Hand x={510} y={105} text="READING" at={tChip} size={56} color={C.accent} anchor="middle" />
    <Hand x={1410} y={105} text="WRITING" at={tChip + 0.3} size={56} color={C.callout} anchor="middle" />
    <Sheet>
      <Ink at={0} dur={0.5} d={linePath(960, 110, 960, 930, 1501, 3)} w={4} color={C.rule} />
      {/* document + chips */}
      <Ink at={tKnown - 0.3} dur={0.5} d={rectPath(330, 430, 360, 400, 1502)} w={5} fill="#FFFFFF" fillAt={tKnown} />
      {Array.from({length: 20}, (_, i) => fr >= f(tKnown) && <rect key={i} x={360 + (i % 5) * 62} y={460 + Math.floor(i / 5) * 90} width={52} height={60} rx={6} fill={lit ? C.accent : C.rule} />)}
      {/* stamp */}
      {fr >= f(tKnown) && <g transform={`translate(0 ${-110 + 110 * drop})`} opacity={Math.min(1, (fr - f(tKnown)) / 6)}>
        <rect x={485} y={270} width={50} height={90} fill={C.secondary} rx={6} />
        <path d={rectPath(300, 360, 420, 66, 1503, 1.5)} fill="#E8EEFC" stroke={C.ink} strokeWidth={5} />
      </g>}
      {/* typewriter */}
      <Ink at={tType - 0.6} dur={0.5} d={rectPath(1220, 300, 380, 360, 1510)} w={5} fill="#FFFFFF" fillAt={tType - 0.3} />
      <Ink at={tType - 0.4} dur={0.6} d={wob([[1130, 660], [1690, 660], [1740, 820], [1080, 820], [1130, 660]], 1511, 2)} w={6} fill="#F1EEE6" fillAt={tType} />
      {Array.from({length: 10}, (_, i) => <circle key={i} cx={1160 + i * 52} cy={745} r={16} fill="#FFFFFF" stroke={C.ink} strokeWidth={3} opacity={fr >= f(tType) ? 1 : 0} />)}
      {Array.from({length: typed}, (_, i) => { const r = Math.floor(i / 6), c = i % 6;
        return <rect key={i} x={1250 + c * 54} y={330 + r * 80} width={44} height={56} rx={5} fill={C.callout} opacity={i === typed - 1 ? 0.6 + 0.4 * ((fr % 11) / 11) : 1} />; })}
    </Sheet>
    <Hand x={510} y={890} text="one slam, all at once" at={tStamp} size={42} color={C.accent} anchor="middle" />
    <Hand x={1410} y={890} text="one key at a time" at={tKey - 0.4} size={42} color={C.callout} anchor="middle" />
    <Label text="Schematic" at={0.3} />
  </Page>; };

// ---------------------------------------------------------------- S16 The crate
const TokS16 = () => { const fr = useCurrentFrame();
  const tHaul = cue(16, 'haul'), tWeights = cue(16, 'weights'), tBerk = cue(16, 'Berkeley'), tSixty = cue(16, 'sixty-five'), tWaits = cue(16, 'waiting'), tEng = cue(16, 'Engineers');
  const P = 2.2, t = fr / 30 - (tHaul - 0.3); const ph = t < 0 ? 0 : (t % P) / P; const x0 = 470, x1 = 1230;
  const cx = t < 0 ? x0 : ph < 0.5 ? x0 + (x1 - x0) * interpolate(ph, [0, 0.5], [0, 1], {easing: (u) => u * u * (3 - 2 * u)}) : x1 - (x1 - x0) * interpolate(ph, [0.5, 1], [0, 1], {easing: (u) => u * u * (3 - 2 * u)});
  const trips = t < 0 ? 0 : Math.floor(t / P + 0.5); const wFill = prog(fr, tSixty - 0.2, 0.8), kFill = prog(fr, tSixty + 0.6, 0.8);
  return <Page>
    <Sheet>
      {/* memory warehouse */}
      <Ink at={0.1} dur={0.6} d={rectPath(150, 300, 360, 300, 1601, 2)} w={6} fill="#F1EEE6" fillAt={0.4} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={rectPath(180 + i * 82, 520, 60, 50, 1660 + i, 0.8)} fill="#DDD8CE" stroke={C.ink} strokeWidth={3} opacity={useCurrentFrame() >= f(0.5) ? 1 : 0} />)}
      {/* chip */}
      <Ink at={0.3} dur={0.6} d={rectPath(1400, 320, 280, 280, 1602)} w={6} fill="#E8EEFC" fillAt={0.6} />
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><path d={linePath(1430 + i * 55, 300, 1430 + i * 55, 320, 1610 + i, 0.5)} stroke={C.ink} strokeWidth={5} /><path d={linePath(1430 + i * 55, 600, 1430 + i * 55, 620, 1620 + i, 0.5)} stroke={C.ink} strokeWidth={5} /></g>)}
      <Ink at={0.4} dur={0.6} d={linePath(520, 640, 1390, 640, 1630, 2)} w={4} color={C.rule} />
      {/* cart + crate */}
      {fr >= f(tHaul - 0.3) && <g transform={`translate(${cx} 0)`}>
        <path d={rectPath(-90, 500, 180, 110, 1640, 1.5)} fill="#FFE3D1" stroke={C.ink} strokeWidth={5} />
        <circle cx={-55} cy={630} r={16} fill="#fff" stroke={C.ink} strokeWidth={4} /><circle cx={55} cy={630} r={16} fill="#fff" stroke={C.ink} strokeWidth={4} />
      </g>}
      {/* tokens written so far (one per arrival at the chip) */}
      {Array.from({length: Math.min(12, trips)}, (_, i) => <rect key={i} x={1180 + i * 52} y={180} width={42} height={52} rx={5} fill={C.callout} />)}
      {/* memory bar: weights 65%, KV ~30% */}
      <path d={rectPath(300, 760, 1320, 70, 1650, 1.2)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} opacity={fr >= f(tBerk - 0.2) ? 1 : 0} />
      <rect x={304} y={764} width={1312 * 0.65 * wFill} height={62} fill={C.secondary} />
      <rect x={304 + 1312 * 0.65} y={764} width={1312 * 0.30 * kFill} height={62} fill={C.cache} />
    </Sheet>
    <Hand x={330} y={420} text="MEMORY" at={0.3} size={44} anchor="middle" />
    <Hand x={1540} y={460} text="CHIP" at={0.5} size={50} anchor="middle" />
    {fr >= f(tHaul - 0.3) && <Mono x={cx} y={555} text="weights" at={tHaul - 0.3} size={26} anchor="middle" color={C.ink} />}
    <Hand x={1180} y={140} text="tokens written" at={tHaul + 1.0} size={32} color={C.callout} />
    <Hand x={300} y={720} text="one GPU's memory, Berkeley-led paper (2023)" at={tBerk} size={32} color={C.secondary} />
    <Mono x={304 + 1312 * 0.325} y={795} text="weights ~65%" at={tSixty} size={30} color="#FFFFFF" anchor="middle" />
    <Mono x={304 + 1312 * 0.80} y={795} text="KV ~30%" at={tSixty + 0.8} size={26} color={C.ink} anchor="middle" />
    <Mono x={300} y={870} text="13-billion-parameter model, one 40 GB GPU · KV = the conversation's working notes" at={tSixty + 1.0} size={20} color={C.secondary} />
    <Stamp x={960} y={380} at={tEng + 0.2} text="MEMORY-BOUND" size={56} rotate={-6} color={C.callout} />
    <Hand x={960} y={275} text="stuck waiting on memory, not maths" at={tWaits - 0.3} size={40} color={C.ink} anchor="middle" />
    <Label text="Simplified: real servers batch many users, sharing each haul" at={0.4} />
    <Src text="Source: Kwon et al., PagedAttention (vLLM), SOSP 2023" at={tBerk} />
  </Page>; };

// ---------------------------------------------------------------- S17 Fifteen hundred to six
const Clock = ({cx, cy, r, at, sweepAt, color, seed}) => { const fr = useCurrentFrame(); const a = -Math.PI / 2 + 2 * Math.PI * 0.62 * prog(fr, sweepAt, 1.2);
  return <>
    <Ink at={at} dur={0.5} d={ellPath(cx, cy, r, r, seed, 2)} w={6} fill="#FFFFFF" fillAt={at + 0.2} />
    {fr >= f(sweepAt) && <path d={`M ${cx} ${cy} L ${cx} ${cy - r + 14} A ${r - 14} ${r - 14} 0 ${a + Math.PI / 2 > Math.PI ? 1 : 0} 1 ${cx + (r - 14) * Math.cos(a)} ${cy + (r - 14) * Math.sin(a)} Z`} fill={color} opacity={0.25} />}
    <line x1={cx} y1={cy} x2={cx + (r - 30) * Math.cos(a)} y2={cy + (r - 30) * Math.sin(a)} stroke={C.ink} strokeWidth={8} strokeLinecap="round" opacity={fr >= f(at + 0.3) ? 1 : 0} />
    <circle cx={cx} cy={cy} r={10} fill={C.ink} opacity={fr >= f(at + 0.3) ? 1 : 0} />
  </>; };
const TokS17 = () => { const fr = useCurrentFrame();
  const tMs = cue(17, 'Microsoft'), tLarge = cue(17, 'large'), tFif = cue(17, 'fifteen'), tWrite = cue(17, 'Writing'), tSix = cue(17, 'six'), tShortA = cue(17, 'short'), tHold = cue(17, 'hold');
  const card = prog(fr, tMs - 0.3, 0.6);
  return <Page>
    <div style={{position: 'absolute', left: 260, top: 90 + (1 - card) * -40, width: 1400, opacity: card, background: '#FFFFFF', border: `3px solid ${C.rule}`, borderRadius: 6,
      boxShadow: '0 8px 24px rgba(27,31,42,0.10)', padding: '24px 40px', fontFamily: SANS}}>
      <div style={{fontSize: 20, color: C.secondary, letterSpacing: 1}}>ISCA 2024 · MICROSOFT + UNIVERSITY OF WASHINGTON · PAPER (TYPESET)</div>
      <div style={{fontSize: 40, fontWeight: 700, color: C.ink, marginTop: 6}}>Splitwise: Efficient Generative LLM Inference Using Phase Splitting</div>
      <div style={{fontSize: 24, color: C.secondary, marginTop: 4}}>Patel et al. · measured on BLOOM-176B with production request sizes</div>
    </div>
    <Sheet>
      <Clock cx={620} cy={600} r={150} at={tLarge} sweepAt={tFif} color={C.accent} seed={1701} />
      <Clock cx={1300} cy={600} r={150} at={tLarge + 0.2} sweepAt={tWrite} color={C.callout} seed={1702} />
    </Sheet>
    <Hand x={960} y={600} text="=" at={tSix + 0.2} size={120} color={C.ink} anchor="middle" />
    <Mono x={620} y={800} text="1,500 tokens read" at={tFif} size={40} color={C.accent} anchor="middle" />
    <Mono x={1300} y={800} text="6 tokens written" at={tSix - 0.1} size={40} color={C.callout} anchor="middle" />
    <Hand x={960} y={880} text="tip: when a short answer will do, ask for one" at={tShortA - 0.2} size={42} color={C.accent} anchor="middle" />
    <Hand x={960} y={945} text="hold on to this ratio" at={tHold - 0.1} size={44} color={C.callout} anchor="middle" rotate={-2} />
    <Src text="Source: Patel et al., Splitwise, ISCA 2024 (BLOOM-176B, production traces)" at={tMs} />
  </Page>; };

// ---------------------------------------------------------------- S18 Memory wall
const TokS18 = () => { const fr = useCurrentFrame();
  const tGrow = cue(18, 'growing'), tTw = cue(18, 'twenty'), tPeak = cue(18, 'Peak'), tMem = cue(18, 'Memory'), tHund = cue(18, 'hundred'), tType = cue(18, 'typewriter');
  const X0 = 330, X1 = 1450, Y0 = 860, U = 52; const sw = (X1 - X0) / 10;
  const stair = (k) => { const pts = [[X0, Y0]]; for (let i = 0; i < 10; i++) { const y = Y0 - U * Math.log(k) * (i + 1); pts.push([X0 + sw * i, y]); pts.push([X0 + sw * (i + 1), y]); } return pts; };
  const cTop = Y0 - U * Math.log(3) * 10, mTop = Y0 - U * Math.log(1.6) * 10;
  return <Page>
    <Sheet>
      <Ink at={tTw - 0.3} dur={0.6} d={linePath(X0, Y0, X1 + 30, Y0, 1801, 1.5)} w={5} />
      <Ink at={tTw - 0.3} dur={0.5} d={linePath(X0, Y0, X0, 220, 1802, 1.5)} w={5} />
      <Ink at={tPeak - 0.1} dur={1.6} d={wob(stair(3), 1803, 1)} w={7} color={C.ink} />
      <Ink at={tMem} dur={1.4} d={wob(stair(1.6), 1804, 1)} w={7} color={C.accent} />
      <Ink at={tType - 0.6} dur={0.5} d={wob([[X1 + 60, cTop], [X1 + 90, cTop], [X1 + 90, mTop], [X1 + 60, mTop]], 1805, 1.5)} w={5} color={C.callout} />
    </Sheet>
    <Hand x={X0 + (X1 - X0) / 2} y={Y0 + 50} text="20 years of server hardware" at={tTw} size={34} color={C.secondary} anchor="middle" />
    <Hand x={X0 - 20} y={200} text="growth (log scale)" at={tTw} size={28} color={C.secondary} weight={400} />
    <Mono x={X1 - 20} y={cTop - 40} text="peak maths ~60,000x" at={tPeak + 1.0} size={34} color={C.ink} anchor="end" />
    <Mono x={X1 - 20} y={mTop - 40} text="memory speed ~100x" at={tHund - 0.1} size={34} color={C.accent} anchor="end" />
    <Hand x={X1 + 110} y={(cTop + mTop) / 2} text="the wait" at={tType - 0.3} size={40} color={C.callout} />
    <Mono x={X0} y={950} text="3.0x vs 1.6x every two years (peak FLOPS vs DRAM bandwidth)" at={tHund + 0.3} size={22} color={C.secondary} />
    <Src text="Source: Gholami et al., AI and Memory Wall, IEEE Micro (2024)" at={tGrow} />
  </Page>; };

// ================================================================ CLIP 3 (scenes 19-23)
// ---------------------------------------------------------------- S19 Map 4
const TokS19 = () => { const tNever = cue(19, 'never');
  return <Page>
    <ChapterMap at={0} step={0.05} active={4} done={[1, 2, 3]} sealAt={null} />
    <Hand x={1500} y={560} text="the hidden writing" at={tNever - 0.2} size={46} color={C.callout} anchor="middle" rotate={-4} />
  </Page>; };

// ---------------------------------------------------------------- S20 Iceberg
const TokS20 = () => { const fr = useCurrentFrame();
  const tExt = cue(20, 'extended'), tWater = cue(20, 'waterline'), tSpin = cue(20, 'spinner'), tType = cue(20, 'typewriter'), tReas = cue(20, 'reasoning'),
    tBack = cue(20, 'backtracking'), tBills = cue(20, 'bills'), tRate = cue(20, 'rate'), tCode = cue(20, 'Code'), tChoose = cue(20, 'choose');
  const W = 430; const wave = Array.from({length: 33}, (_, i) => [60 + i * 56, W + 10 * Math.sin(i * 0.9 + fr * 0.05)]);
  const tape = prog(fr, tType, Math.max(1, tCode - tType)); const tapeX = 720 + 640 * tape;
  const bob = fr >= f(tType) ? 4 * Math.sin(fr * 1.3) : 0;
  return <Page>
    <Sheet>
      {fr >= f(tWater - 0.3) && <path d={`M 60 ${W} ${wave.map(([x, y]) => `L ${x} ${y}`).join(' ')} L 1900 1080 L 60 1080 Z`} fill={C.cache} opacity={0.35} />}
      <Ink at={tWater - 0.3} dur={0.6} d={wob(wave.map(([x]) => [x, W]), 2001, 6)} w={5} color={C.accent} />
      {/* bubble above with spinner */}
      <PopG at={tExt - 0.1} cx={760} cy={260}><path d={rectPath(520, 190, 480, 140, 2002, 2)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} /></PopG>
      {fr >= f(tSpin - 0.2) && <path d={`M ${600 + 30 * Math.cos(fr * 0.25)} ${260 + 30 * Math.sin(fr * 0.25)} A 30 30 0 1 1 ${600 + 30 * Math.cos(fr * 0.25 + 4.2)} ${260 + 30 * Math.sin(fr * 0.25 + 4.2)}`} fill="none" stroke={C.secondary} strokeWidth={7} strokeLinecap="round" />}
      {/* typewriter below */}
      <g transform={`translate(0 ${bob})`}>
        <Ink at={tType - 0.5} dur={0.4} d={rectPath(380, 600, 240, 110, 2004, 1.2)} w={4} fill="#FFFFFF" fillAt={tType - 0.3} />
        <Ink at={tType - 0.4} dur={0.5} d={wob([[300, 700], [700, 700], [740, 850], [260, 850], [300, 700]], 2003, 2)} w={6} fill="#F1EEE6" fillAt={tType} />
        {Array.from({length: 7}, (_, i) => <circle key={i} cx={330 + i * 55} cy={785} r={14} fill="#fff" stroke={C.ink} strokeWidth={3} opacity={fr >= f(tType) ? 1 : 0} />)}
      </g>
      {/* ember tape of attempts, crossings-out, arrows back */}
      {fr >= f(tType) && <g>
        <path d={`M 720 560 L ${tapeX} 560 L ${tapeX} 660 L 720 660 Z`} fill="#FFF3EA" stroke={C.callout} strokeWidth={4} />
        {Array.from({length: 12}, (_, i) => { const x = 740 + i * 52; if (x + 40 > tapeX) return null;
          return <path key={i} d={wob([[x, 600 + (i % 3) * 8], [x + 14, 590], [x + 28, 612], [x + 42, 596]], 2010 + i, 1.5)} stroke={C.callout} strokeWidth={4} fill="none" />; })}
        {[3, 6, 9].map((i) => fr >= f(tBack - 0.2 + i * 0.05) && 740 + i * 52 + 40 < tapeX && <path key={i} d={linePath(735 + i * 52, 640, 785 + i * 52, 578, 2030 + i, 1)} stroke={C.negative} strokeWidth={5} />)}
        {fr >= f(tBack) && tapeX > 1100 && <path d={wob([[1080, 545], [960, 505], [860, 545]], 2040, 2)} stroke={C.callout} strokeWidth={4} fill="none" />}
      </g>}
    </Sheet>
    <Hand x={660} y={260} text="Thinking..." at={tSpin - 0.2} size={44} color={C.secondary} />
    <Hand x={1700} y={395} text="what you see" at={tWater} size={30} color={C.secondary} weight={400} anchor="end" />
    <Hand x={1700} y={470} text="what it writes" at={tType} size={30} color={C.callout} weight={400} anchor="end" />
    <Hand x={900} y={720} text="trying · checking · backtracking" at={tReas} size={34} color={C.callout} weight={400} />
    <Meter x={1500} y={540} s={0.6} at={tType} read={0.15} write={0.15 + 0.75 * tape} labels={true} />
    <Hand x={1610} y={820} text="billed as output" at={tBills} size={34} color={C.callout} anchor="middle" />
    <Hand x={1610} y={865} text="writing rate" at={tRate - 0.1} size={30} color={C.callout} weight={400} anchor="middle" />
    <Hand x={1300} y={200} text="Claude Code: newest models always think" at={tCode - 0.2} size={32} color={C.ink} />
    <Hand x={1300} y={250} text="you set the effort" at={tChoose - 0.1} size={32} color={C.accent} />
    <Label text="Illustration" at={0.3} />
    <Src text="Source: Anthropic extended thinking docs; Claude Code docs (Oct 2026)" at={tBills} />
  </Page>; };

// ---------------------------------------------------------------- S21 Two plus three
const TokS21 = () => { const fr = useCurrentFrame();
  const tSum = cue(21, 'sum'), tSingle = cue(21, 'single'), tThir = cue(21, 'thirteen'), tFirst = cue(21, 'first'), tAvg = cue(21, 'average');
  const span = Math.max(0.8, tThir - tSingle + 0.3); const cAt = (i) => i === 0 ? tSum : tSingle + (i - 1) * span / 12;
  const labs = ['state the fact', 'break into steps', 'count objects', 'number line', 'add on fingers', 'check by subtracting', 'restate', 'verify again', 'another method', 'double-check', 'reconsider', 'confirm', 'final check'];
  return <Page>
    <Mono x={960} y={150} text="2 + 3 = ?" at={0.1} size={110} color={C.ink} anchor="middle" />
    <Sheet>
      {labs.map((l, i) => { const x = 140 + (i % 5) * 335, y = 290 + Math.floor(i / 5) * 140;
        return <PopG key={i} at={cAt(i)} cx={x + 150} cy={y + 50}>
          <path d={rectPath(x, y, 300, 100, 2101 + i, 1.2)} fill={i === 0 ? '#E8EEFC' : '#FFFFFF'} stroke={i === 0 ? C.accent : C.ink} strokeWidth={i === 0 ? 5 : 3} />
          <text x={x + 20} y={y + 42} fontFamily={HAND} fontSize={26} fill={C.secondary}>{`#${i + 1} ${l}`}</text>
          <text x={x + 20} y={y + 82} fontFamily={MONO} fontWeight={700} fontSize={30} fill={C.ink}>= 5</text>
        </PopG>; })}
      <Ink at={tFirst - 0.1} dur={0.4} d={wob([[370, 365], [390, 385], [425, 335]], 2120, 1)} w={7} color={C.accent} />
    </Sheet>
    <Hand x={1300} y={720} text="13 solutions, one model" at={tThir} size={46} color={C.ink} anchor="middle" />
    <Hand x={290} y={720} text="right in the first" at={tFirst} size={36} color={C.accent} anchor="middle" />
    <Hand x={960} y={850} text="on average: about 20x the tokens of ordinary models" at={tAvg - 0.2} size={46} color={C.callout} anchor="middle" />
    <Mono x={960} y={915} text="1,953% more · models from late 2024 to early 2025" at={tAvg + 0.6} size={22} color={C.secondary} anchor="middle" />
    <Src text="Source: Chen et al., Do NOT Think That Much for 2+3=?, ICML 2025 (Tencent AI Lab, SJTU)" at={tSum} />
  </Page>; };

// ---------------------------------------------------------------- S22 Fair to thinking (square stacks)
const TokS22 = () => { const fr = useCurrentFrame();
  const tFair = cue(22, 'fair'), tBerk = cue(22, 'Berkeley'), tExtra = cue(22, 'extra'), tRev = cue(22, 'revise'), tBeat = cue(22, 'outperform'), tFour = cue(22, 'fourteen'),
    tSame = cue(22, 'same'), tEasy = cue(22, 'easier'), tLight = cue(22, 'light'), tHard = cue(22, 'hardest'), tBarely = cue(22, 'barely'), tLet = cue(22, 'let'), tEasyOnes = cue(22, 'easy');
  const sq = (x, y, n, at, color, step = 0.05) => Array.from({length: n}, (_, i) => <PopG key={i} at={at + i * step} cx={x + (i % 7) * 58 + 24} cy={y + Math.floor(i / 7) * 58 + 24}>
    <rect x={x + (i % 7) * 58} y={y + Math.floor(i / 7) * 58} width={48} height={48} rx={4} fill={color} /></PopG>);
  return <Page>
    <Hand x={960} y={110} text="Fair to thinking: it isn't waste" at={tFair - 0.1} size={52} anchor="middle" out={tLet - 0.4} />
    <Hand x={960} y={110} text="tip: hard problem, let it think · easy job, effort down" at={tLet - 0.2} size={46} color={C.accent} anchor="middle" />
    <Sheet>
      <Engine cx={500} cy={290} w={130} at={tBerk} seed={2201} label="small" />
      <Ink at={tRev - 0.2} dur={0.7} d={ellPath(500, 270, 140, 90, 2202, 2, 0.9)} w={5} color={C.callout} />
      <Ink at={tRev + 0.4} dur={0.2} d={wob([[620, 230], [640, 262], [606, 262]], 2203, 0.8)} w={5} color={C.callout} />
      <Engine cx={1420} cy={290} w={330} at={tFour - 0.2} seed={2204} label="14x larger" />
      {sq(300, 440, 1, tExtra - 0.2, C.ink)}
      {fr >= f(tExtra) && sq(358, 440, 13, tExtra, C.callout, 0.06).map((e, i) => e)}
      {sq(1220, 440, 14, tFour, C.ink, 0.04)}
      <Ink at={tSame - 0.1} dur={0.5} d={wob([[300, 580], [300, 600], [1626, 600], [1626, 580]], 2205, 1.5)} w={5} color={C.secondary} />
    </Sheet>
    <Hand x={500} y={400} text="revise & check" at={tRev} size={30} color={C.callout} weight={400} anchor="middle" />
    <Hand x={960} y={640} text="same total compute" at={tSame} size={40} color={C.secondary} anchor="middle" />
    <Hand x={300} y={760} text="✓ easier maths problems, light use: the small thinker can win" at={tEasy - 0.1} size={38} color={C.accent} />
    <Hand x={300} y={840} text="– hardest problems: barely helped" at={tHard - 0.1} size={38} color={C.secondary} />
    <Mono x={300} y={920} text="schematic: one square = equal compute · PaLM 2-S* on the MATH benchmark" at={tSame + 0.4} size={20} color={C.secondary} />
    <Src text="Source: Snell et al., UC Berkeley & Google DeepMind (2024)" at={tBerk} />
  </Page>; };

// ---------------------------------------------------------------- S23 More writing (word card)
const TokS23 = () => { const tMagic = cue(23, 'magic'), tMore = cue(23, 'more');
  return <Page>
    <Hand x={960} y={430} text="Thinking isn't magic." at={0.05} size={110} anchor="middle" dur={0.6} />
    <TwoTone y={600} a="It's more" b="writing." at={tMore - 0.15} dur={0.75} />
  </Page>; };

// ================================================================ CLIP 4 (scenes 24-31)
// ---------- shared: the courier (our own character; illustrative) ----------
const Courier = ({x, y, at = 0, running = 0, face = 1, pack = 1, warm = 0, stagger = 0, packColor = '#FFE3D1'}) => { const fr = useCurrentFrame(); if (fr < f(at)) return null;
  const sw = running ? Math.sin(fr * 0.7) : 0; const lean = running ? 8 * face : 0; const wob2 = stagger ? 6 * Math.sin(fr * 0.35) : 0;
  const hx = x + lean + wob2, hy = y - 170; const ph = 70 + 26 * (pack - 1);
  const px = face > 0 ? x - 70 : x + 18;
  return <g opacity={Math.min(1, (fr - f(at)) / 6)}>
    {/* backpack: a stack of folders */}
    {Array.from({length: Math.max(1, Math.round(pack))}, (_, i) => <path key={i} d={rectPath(px + wob2 * 0.5, y - 130 - i * 26, 52, 24, 2500 + i, 0.8)} fill={i < pack * warm ? C.hl : packColor} stroke={C.ink} strokeWidth={3} />)}
    <path d={wob([[x + wob2 * 0.6, y - 135], [x, y + 10]], 2490, 0.6)} stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" />
    <circle cx={hx} cy={hy} r={32} fill="#FFFFFF" stroke={C.ink} strokeWidth={5} />
    <circle cx={hx + 12 * face} cy={hy - 4} r={4} fill={C.ink} />
    <path d={`M ${x} ${y - 110} L ${x + 50 * face} ${y - 70 + 20 * sw} M ${x} ${y - 110} L ${x - 40 * face} ${y - 75 - 20 * sw}`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
    <path d={`M ${x} ${y + 10} L ${x + 30 * sw + 10} ${y + 100} M ${x} ${y + 10} L ${x - 30 * sw - 10} ${y + 100}`} stroke={C.ink} strokeWidth={8} strokeLinecap="round" fill="none" />
  </g>; };
const Chip = ({x, y, s = 1, at = 0, flash = 0, seed = 2400}) => <>
  <Ink at={at} dur={0.5} d={rectPath(x, y, 220 * s, 220 * s, seed)} w={6} fill={flash > 0 ? `rgba(47,111,228,${0.15 + 0.6 * flash})` : '#E8EEFC'} fillAt={at + 0.2} />
  {[0, 1, 2, 3].map((i) => <g key={i} opacity={useCurrentFrame() >= f(at + 0.4) ? 1 : 0}>
    <path d={linePath(x + (30 + i * 52) * s, y - 18 * s, x + (30 + i * 52) * s, y, seed + 10 + i, 0.4)} stroke={C.ink} strokeWidth={5} />
    <path d={linePath(x + (30 + i * 52) * s, y + 220 * s, x + (30 + i * 52) * s, y + 238 * s, seed + 20 + i, 0.4)} stroke={C.ink} strokeWidth={5} /></g>)}
</>;
const Laptop2 = ({x, y, at}) => <>
  <Ink at={at} dur={0.5} d={rectPath(x, y, 260, 170, 2410)} w={5} fill="#FFFFFF" fillAt={at + 0.2} />
  <Ink at={at + 0.3} dur={0.3} d={wob([[x - 30, y + 190], [x + 290, y + 190], [x + 260, y + 170], [x, y + 170], [x - 30, y + 190]], 2411, 1)} w={5} />
</>;
const Bridge = ({at}) => <Ink at={at} dur={0.8} d={wob([[440, 760], [700, 700], [1000, 690], [1300, 700], [1520, 760]], 2420, 2)} w={6} color={C.secondary} />;

// ---------------------------------------------------------------- S24 Map 5
const TokS24 = () => { const tWed = cue(24, 'Wednesday');
  return <Page>
    <ChapterMap at={0} step={0.04} active={5} done={[1, 2, 3, 4]} sealAt={null} />
    <Hand x={1500} y={600} text="Wednesday" at={tWed - 0.2} size={56} color={C.negative} anchor="middle" rotate={-4} />
  </Page>; };

// ---------------------------------------------------------------- S25 The courier
const TokS25 = () => { const fr = useCurrentFrame();
  const tMeet = cue(25, 'courier'), tUp = cue(25, 'upload'), tCarr = cue(25, 'carries'), tStamp = cue(25, 'stamp'), tAns = cue(25, 'answer');
  const go = prog(fr, tCarr - 0.1, 1.4), back = prog(fr, tAns - 0.2, 1.3);
  const cx = 470 + 930 * go - 930 * back; const running = (fr > f(tCarr - 0.1) && go < 1) || (fr > f(tAns - 0.2) && back < 1);
  const flash = fr >= f(tStamp) ? Math.max(0, 1 - (fr - f(tStamp)) / 20) : 0;
  return <Page>
    <Sheet>
      <Laptop2 x={120} y={460} at={0.1} />
      <Chip x={1560} y={470} at={0.3} flash={flash} />
      <Bridge at={0.4} />
      <Courier x={cx} y={640} at={tMeet - 0.2} running={running ? 1 : 0} face={fr > f(tAns - 0.2) ? -1 : 1} pack={fr >= f(tUp + 0.3) && fr < f(tAns - 0.2) ? 3 : 1} />
      {fr >= f(tAns - 0.2) && <path d={rectPath(cx - 95, 548, 44, 32, 2430, 0.6)} fill="#E8EEFC" stroke={C.ink} strokeWidth={3} />}
    </Sheet>
    {fr >= f(tUp) && fr < f(tUp + 0.4) && <div style={{position: 'absolute', left: 400, top: 380 + 120 * prog(fr, tUp, 0.4), width: 60, height: 40, background: '#FFE3D1', border: `3px solid ${C.ink}`, borderRadius: 4}} />}
    <Stamp x={1670} y={420} at={tStamp} text="READ" size={40} rotate={-6} color={C.accent} />
    <Hand x={250} y={430} text="you" at={0.3} size={36} anchor="middle" />
    <Hand x={1670} y={780} text="CHIP" at={0.5} size={40} anchor="middle" />
    <Hand x={600} y={300} text="long report + question" at={tUp} size={36} color={C.callout} />
    <Hand x={900} y={860} text="answer" at={tAns} size={36} color={C.accent} anchor="middle" />
    <Label text="Illustrative character" at={0.4} />
  </Page>; };

// ---------------------------------------------------------------- S26 It forgets (word card)
const TokS26 = () => { const fr = useCurrentFrame(); const tFor = cue(26, 'forgets'), tAll = cue(26, 'all');
  const blank = prog(fr, tFor, 0.6);
  return <Page>
    <Sheet><ChipArt cx={960} cy={330} s={0.85} at={0} cells={1} cellsOut={blank} glow={0} /></Sheet>
    <Hand x={960} y={720} text="And then the chip forgets" at={0.05} size={96} anchor="middle" dur={0.6} />
    <Hand x={960} y={860} text="all of it." at={tAll - 0.1} size={110} color={C.callout} anchor="middle" dur={0.4} />
  </Page>; };

// ---------------------------------------------------------------- S27 The backpack
const TokS27 = () => { const fr = useCurrentFrame();
  const tNo = cue(27, 'memory'), tNext = cue(27, 'next'), tEvery = cue(27, 'everything'), tDocs = cue(27, 'docs'), tTurn = cue(27, 'Turn'), tHeavy = cue(27, 'heavier'), tThanks = cue(27, 'thanks'), tEven = cue(27, 'Even', 1);
  const turnAt = [tNext, tEvery + 0.4, tTurn, tTurn + 0.8, tHeavy]; const turns = [1, 2, 5, 10, 15];
  let k = 0; turnAt.forEach((t, i) => { if (fr >= f(t)) k = i; }); const pack = [1, 2.5, 5, 8, 11][k];
  const q = prog(fr, tDocs - 0.3, 0.5);
  return <Page>
    <Sheet>
      <Courier x={520} y={760} at={0} pack={pack} stagger={k >= 3 ? 1 : 0} />
      <path d={rectPath(140, 260, 240, 60, 2701, 1)} fill="#E8EEFC" stroke={C.ink} strokeWidth={3} opacity={fr >= f(tNext) ? 1 : 0} />
    </Sheet>
    <Mono x={260} y={290} text={k === 0 ? 'What about Q3?' : `turn ${turns[k]}`} at={tNext} size={26} color={C.ink} anchor="middle" />
    <Hand x={260} y={200} text="every turn sends:" at={tEvery} size={34} color={C.secondary} anchor="middle" />
    <Hand x={260} y={370} text="report + messages + replies" at={tEvery + 0.3} size={28} color={C.callout} weight={400} anchor="middle" />
    {fr >= f(tThanks - 0.3) && <Hand x={470} y={760 - 140 - 26 * pack - 40} text="Thanks!" at={tThanks - 0.3} size={40} color={C.accent} anchor="middle" />}
    <div style={{position: 'absolute', left: 900, top: 230, width: 880, opacity: q, transform: `translateY(${(1 - q) * 30}px)`, background: '#FFFFFF', border: `3px solid ${C.rule}`, borderRadius: 6,
      boxShadow: '0 8px 24px rgba(27,31,42,0.10)', padding: '28px 40px', fontFamily: SANS}}>
      <div style={{fontSize: 18, color: C.secondary, letterSpacing: 1}}>ANTHROPIC · CLAUDE CODE DOCS · MANAGE COSTS EFFECTIVELY (TYPESET)</div>
      <div style={{fontSize: 40, color: C.ink, marginTop: 8, lineHeight: 1.35}}>“Claude Code <span style={{background: C.hl}}>sends your full conversation with every request</span>”</div>
    </div>
    <Meter x={1250} y={560} s={0.6} at={tNext} read={0.12 + 0.07 * pack} write={0.1} labels={true} />
    <Hand x={1400} y={900} text="— Even if I just say thanks?" at={tThanks - 0.5} size={34} weight={400} color={C.accent} anchor="middle" />
    <Hand x={1400} y={955} text="Even then." at={tEven} size={36} color={C.callout} anchor="middle" />
    <Label text="Illustrative character" at={0.3} />
    <Src text="Source: Claude Code docs, Manage costs effectively (Oct 2026)" at={tDocs} />
  </Page>; };

// ---------------------------------------------------------------- S28 The fridge
const TokS28 = () => { const fr = useCurrentFrame();
  const tMiss = cue(28, 'miss'), tCache = cue(28, 'cache'), tAuto = cue(28, 'automatically'), tFridge = cue(28, 'copy'), tTenth = cue(28, 'tenth'), tLess = cue(28, 'less'),
    tCatch = cue(28, 'downside'), tFive = cue(28, 'five'), tCoffee = cue(28, 'coffee'), tProc = cue(28, 'process'), tAbove = cue(28, 'above'), tHour = cue(28, 'hour');
  const cold = fr >= f(tFridge + 0.6) && fr < f(tProc); const warm = fr >= f(tProc);
  const ring = fr >= f(tProc - 0.4) && fr < f(tProc + 0.8) ? 5 * Math.sin(fr * 2.2) : 0;
  const tm = prog(fr, tFive, Math.max(0.5, tCoffee - tFive + 0.6));
  return <Page>
    <Sheet>
      <Bridge at={0} />
      <Chip x={1560} y={470} at={0} s={0.9} />
      {/* fridge */}
      <Ink at={tFridge - 0.3} dur={0.6} d={rectPath(820, 300, 260, 400, 2801)} w={6} fill="#FFFFFF" fillAt={tFridge} />
      <Ink at={tFridge} dur={0.3} d={linePath(820, 430, 1080, 430, 2802, 1)} w={5} />
      <Ink at={tFridge + 0.1} dur={0.4} d={wob([[950, 340], [950, 400]], 2803, 0.4)} w={4} color={C.accent} />
      <Ink at={tFridge + 0.15} dur={0.4} d={wob([[925, 355], [975, 385]], 2804, 0.4)} w={4} color={C.accent} />
      <Ink at={tFridge + 0.2} dur={0.4} d={wob([[975, 355], [925, 385]], 2805, 0.4)} w={4} color={C.accent} />
      {[0, 1, 2, 3].map((i) => fr >= f(tFridge + 0.4 + i * 0.12) && <path key={i} d={rectPath(860, 460 + i * 55, 180, 40, 2810 + i, 0.8)} fill={warm ? C.hl : cold ? C.cache : '#FFE3D1'} stroke={C.ink} strokeWidth={3} />)}
      {/* timer */}
      {fr >= f(tFive - 0.2) && <g transform={`translate(${ring} 0)`}>
        <circle cx={1300} cy={250} r={60} fill="#FFFFFF" stroke={C.ink} strokeWidth={5} />
        <path d={`M 1300 250 L ${1300 + 50 * Math.cos(-Math.PI / 2 + 2 * Math.PI * tm)} ${250 + 50 * Math.sin(-Math.PI / 2 + 2 * Math.PI * tm)}`} stroke={warm ? C.negative : C.ink} strokeWidth={6} strokeLinecap="round" />
      </g>}
      {/* coffee */}
      <PopG at={tCoffee} cx={1300} cy={420}><path d={wob([[1270, 390], [1330, 390], [1322, 450], [1278, 450], [1270, 390]], 2820, 1)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} />
        <path d={`M 1330 405 q 22 8 0 28`} fill="none" stroke={C.ink} strokeWidth={4} /></PopG>
    </Sheet>
    <Hand x={950} y={250} text="the cache (a copy)" at={tCache - 0.1} size={44} color={C.accent} anchor="middle" />
    <Hand x={1380} y={345} text="Claude Code, subscription: 1 hour" at={tHour - 0.3} size={28} color={C.accent} weight={400} />
    <Hand x={950} y={760} text="Claude Code uses it automatically" at={tAuto - 0.2} size={30} color={C.secondary} weight={400} anchor="middle" />
    <Mono x={120} y={200} text="re-reading from the cache:" at={tTenth - 0.3} size={30} color={C.ink} />
    <Mono x={120} y={250} text="0.1x normal reading price" at={tTenth - 0.1} size={34} color={C.accent} />
    <Mono x={120} y={300} text="0.05x Opus 5.5 & Sonnet 5.5" at={tLess - 0.2} size={26} color={C.accent} />
    <Mono x={120} y={340} text="0.025x Fable 5.1" at={tLess} size={26} color={C.accent} />
    <Hand x={1380} y={250} text="~5 idle minutes" at={tFive} size={34} color={C.ink} />
    <Hand x={1380} y={295} text="(API default)" at={tFive + 0.2} size={26} color={C.secondary} weight={400} />
    <Hand x={120} y={860} text="after the break: pays a little above full price to refill" at={tAbove - 0.3} size={40} color={C.negative} />
    <Mono x={120} y={930} text="API prices; Anthropic doesn't publish exactly how cached tokens count toward subscription limits" at={tAbove + 0.3} size={20} color={C.secondary} />
    <Src text="Source: Anthropic prompt caching docs; Claude Code costs docs (Oct 2026)" at={tCache} />
  </Page>; };

// ---------------------------------------------------------------- S29 Our bill (two receipts)
const Receipt = ({x, at, lines, total, color, seed}) => { const fr = useCurrentFrame(); const p = prog(fr, at, 0.9); if (fr < f(at)) return null;
  return <div style={{position: 'absolute', left: x, top: 170, width: 560, height: 430 * p, overflow: 'hidden', background: '#FFFFFF', border: `3px solid ${C.rule}`, borderTop: `8px solid ${color}`,
    boxShadow: '0 8px 20px rgba(27,31,42,0.10)', fontFamily: MONO, padding: p > 0.1 ? '28px 36px' : 0, boxSizing: 'border-box'}}>
    {lines.map((l, i) => <div key={i} style={{fontSize: i === 0 ? 28 : 26, fontWeight: i === 0 ? 800 : 500, color: i === 0 ? color : C.ink, marginBottom: 18, whiteSpace: 'nowrap'}}>{l}</div>)}
    <div style={{borderTop: `3px dashed ${C.rule}`, marginTop: 20, paddingTop: 20, fontSize: 52, fontWeight: 800, color}}>{total}</div>
  </div>; };
const TokS29 = () => {
  const tRem = cue(29, 'Back'), tFresh = cue(29, 'Sent'), tTwo = cue(29, 'two'), tFridge = cue(29, 'cache'), tCents = cue(29, 'twenty-four'), tEight = cue(29, 'eight');
  return <Page>
    <Hand x={960} y={110} text="The twenty-question chat, priced" at={tRem} size={52} anchor="middle" />
    <Receipt x={300} at={tFresh} color={C.callout} seed={2901} lines={['SENT FRESH EVERY TIME', '990,000 tokens read', 'x $2 per million', 'Sonnet 5.5, API list price']} total="$1.98" />
    <Receipt x={1060} at={tFridge - 0.3} color={C.accent} seed={2902} lines={['WITH THE CACHE', 'new tokens written: $2.50/M', 're-reads: $0.10/M', 'each question < 5 min apart']} total="≈ $0.24" />
    <Hand x={960} y={850} text="roughly 8x less" at={tEight - 0.1} size={70} color={C.accent} anchor="middle" />
    <Mono x={960} y={930} text="worked example, Sonnet 5.5 API list prices; subscriptions count usage, not dollars" at={tCents + 0.3} size={22} color={C.secondary} anchor="middle" />
  </Page>; };

// ---------------------------------------------------------------- S30 Lost in the middle
const TokS30 = () => { const fr = useCurrentFrame();
  const tSec = cue(30, 'second'), tWorse = cue(30, 'worse'), tStan = cue(30, 'Stanford'), tStart = cue(30, 'start'), tMid = cue(30, 'middle'), tSome = cue(30, 'Sometimes');
  const fog = prog(fr, tMid - 0.3, 0.8); const sharp = prog(fr, tStart - 0.1, 0.5);
  return <Page>
    <Hand x={960} y={110} text="A heavy backpack can make answers worse" at={tSec} size={50} anchor="middle" />
    <Sheet>
      <Ink at={tWorse - 0.3} dur={0.5} d={rectPath(300, 200, 420, 690, 3001)} w={5} fill="#1B1F2A" fillAt={tWorse} fillOpacity={0.06} />
      {Array.from({length: 9}, (_, i) => { const edge = i < 2 || i > 6; const o = edge ? 1 : 1 - 0.75 * fog;
        return <g key={i} opacity={fr >= f(tWorse + i * 0.05) ? o : 0}>
          <path d={rectPath(340, 230 + i * 72, 340, 56, 3010 + i, 0.8)} fill={edge && sharp > 0 ? '#E8EEFC' : '#FFE3D1'} stroke={edge ? (sharp > 0 ? C.accent : C.ink) : C.ink} strokeWidth={edge ? 3 + 3 * sharp : 3} />
        </g>; })}
    </Sheet>
    {fog > 0 && <div style={{position: 'absolute', left: 320, top: 370, width: 380, height: 360, background: `rgba(250,247,240,${0.55 * fog})`, filter: 'blur(6px)', borderRadius: 30}} />}
    <Hand x={780} y={300} text="start: used best" at={tStart} size={40} color={C.accent} />
    <Hand x={780} y={550} text="middle: used worst" at={tMid} size={40} color={C.secondary} />
    <Hand x={780} y={800} text="end: used well" at={tStart + 0.4} size={40} color={C.accent} />
    <Hand x={1240} y={430} text="sometimes worse than" at={tSome - 0.1} size={40} color={C.negative} />
    <Hand x={1240} y={480} text="no documents at all" at={tSome + 0.2} size={40} color={C.negative} />
    <Mono x={1240} y={560} text="GPT-3.5-Turbo, 20 documents:" at={tSome + 0.1} size={22} color={C.secondary} />
    <Mono x={1240} y={592} text="middle positions fell below its" at={tSome + 0.2} size={22} color={C.secondary} />
    <Mono x={1240} y={624} text="no-document score (56.1%)" at={tSome + 0.3} size={22} color={C.secondary} />
    <Label text="2023 models; newer ones are better but still affected" at={tStan} />
    <Src text="Source: Liu et al., Lost in the Middle, TACL (2024)" at={tStan} />
  </Page>; };

// ---------------------------------------------------------------- S31 Still true
const TokS31 = () => { const fr = useCurrentFrame();
  const tNew = cue(31, 'Newer'), tBench = cue(31, 'benchmark'), tHalf = cue(31, 'half'), tAnother = cue(31, 'Another'), tEvery = cue(31, 'every'), tFix = cue(31, 'fix'), tCopy = cue(31, 'Copy'), tGood = cue(31, 'Good'), tSum = cue(31, 'summary');
  const drop = prog(fr, tHalf, 0.8);
  return <Page>
    <Hand x={960} y={110} text="Newer tests agree" at={tNew} size={54} anchor="middle" out={tGood - 0.3} />
    <Hand x={960} y={95} text="your move: new task, new chat" at={tGood} size={46} color={C.accent} anchor="middle" />
    <Hand x={960} y={160} text="before a break: short summary → fresh chat" at={tSum - 0.3} size={38} color={C.accent} anchor="middle" />
    <Sheet>
      {Array.from({length: 13}, (_, i) => { const falls = i >= 2; const y = 250 + (falls ? 190 * drop : 0);
        return <PopG key={i} at={tBench + i * 0.05} cx={190 + i * 80 + 30} cy={280}><rect x={190 + i * 80} y={y} width={60} height={60} rx={5} fill={falls && drop > 0.5 ? C.secondary : C.accent} /></PopG>; })}
      <Ink at={tHalf - 0.3} dur={0.6} d={linePath(170, 380, 1250, 380, 3101, 1)} w={4} color={C.negative} dash="14 10" />
    </Sheet>
    <Hand x={1270} y={380} text="half their short-text score" at={tHalf - 0.2} size={30} color={C.negative} />
    <Mono x={190} y={560} text="11 of 13 models fell below half at 32K tokens · one square = one model claiming 128K+ context" at={tHalf + 0.5} size={22} color={C.secondary} />
    <Mono x={190} y={595} text="NoLiMa, ICML 2025" at={tHalf + 0.6} size={22} color={C.secondary} />
    <Sheet><PopG at={tAnother - 0.2} cx={960} cy={770}><path d={rectPath(190, 680, 1540, 180, 3102, 1.5)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} /></PopG></Sheet>
    <Hand x={230} y={735} text="Even with every fact found: scores fell 13.9% to 85% as inputs grew" at={tEvery - 0.3} size={36} color={C.ink} />
    <Hand x={230} y={810} text="Their fix: copy out what matters → a short, fresh prompt" at={tCopy - 0.2} size={36} color={C.accent} />
    <Mono x={230} y={895} text="Du et al. 2025: preprint, not yet peer-reviewed" at={tEvery} size={22} color={C.secondary} />
    <Src text="Source: Modarressi et al., NoLiMa, ICML 2025; Du et al., arXiv 2510.05381 (2025 preprint)" at={tBench} />
  </Page>; };

// ================================================================ CLIP 5 (scenes 32-35)
// ---------------------------------------------------------------- S32 Map 6 (seal breaks)
const TokS32 = () => { const fr = useCurrentFrame(); const tAgent = cue(32, 'agent'); const open = fr >= f(tAgent - 0.4);
  return <Page>
    <ChapterMap at={0} step={0.04} active={open ? 6 : null} done={[1, 2, 3, 4, 5]} sealed={open ? [] : [6]} sealAt={open ? tAgent - 0.3 : null} />
    {!open && <Stamp x={1150} y={240 + 5 * 98} at={0} text="SEALED" size={40} rotate={-6} color={C.secondary} />}
    <Hand x={1500} y={760} text="the hidden chapter" at={tAgent} size={46} color={C.callout} anchor="middle" rotate={-4} />
  </Page>; };

// ---------------------------------------------------------------- S33 The loop
const TokS33 = () => { const fr = useCurrentFrame();
  const tAsk = cue(33, 'Ask'), tType = cue(33, 'type'), tReads = cue(33, 'reads'), tRuns = cue(33, 'runs'), tErr = cue(33, 'error'), tThinks = cue(33, 'thinks'),
    tRew = cue(33, 'rewrites'), tAgain = cue(33, 'again'), tLap = cue(33, 'lap'), tBack = cue(33, 'backpack'), tStamp = cue(33, 'cache'), tTw = cue(33, 'writing'), tIce = cue(33, 'thinking');
  const CX = 780, CY = 590, R = 270; const steps = [['read files', tReads], ['run test', tRuns], ['read error', tErr], ['think', tThinks], ['rewrite', tRew], ['run again', tAgain]];
  const lapT = Math.max(0, fr / 30 - (tReads - 0.2)); const ang = -Math.PI / 2 + lapT * 1.6; const laps = Math.floor(lapT * 1.6 / (2 * Math.PI)) + (fr >= f(tReads - 0.2) ? 1 : 0);
  const climb = Math.min(1, lapT / 9);
  return <Page>
    <Mono x={160} y={150} text="> Fix the failing test." at={tType - 0.1} size={46} color={C.ink} />
    <Hand x={160} y={215} text="you type one line" at={tType + 0.3} size={30} color={C.secondary} weight={400} />
    <Sheet>
      <Ink at={tReads - 0.3} dur={1.0} d={ellPath(CX, CY, R, R * 0.8, 3301, 2.5, 1.0)} w={5} color={C.rule} />
      {steps.map(([l, t], i) => { const a = -Math.PI / 2 + i * Math.PI / 3; return <PopG key={l} at={t - 0.1} cx={CX + R * Math.cos(a)} cy={CY + R * 0.8 * Math.sin(a)}>
        <circle cx={CX + R * Math.cos(a)} cy={CY + R * 0.8 * Math.sin(a)} r={16} fill={C.callout} /></PopG>; })}
      {fr >= f(tReads - 0.2) && <g transform={`translate(${CX + R * Math.cos(ang)} ${CY + R * 0.8 * Math.sin(ang) - 40})`}>
        <path d={rectPath(-14, -30 - 6 * Math.min(8, laps), 28, 30 + 6 * Math.min(8, laps), 3302, 0.5)} fill="#FFE3D1" stroke={C.ink} strokeWidth={3} />
        <circle cx={14} cy={-36} r={12} fill="#fff" stroke={C.ink} strokeWidth={3} />
      </g>}
    </Sheet>
    {steps.map(([l, t], i) => { const a = -Math.PI / 2 + i * Math.PI / 3; const x = CX + (R + 40) * Math.cos(a), y = CY + (R * 0.8 + 40) * Math.sin(a);
      return <Hand key={l} x={x} y={y} text={l} at={t - 0.1} size={34} color={C.ink} anchor={Math.cos(a) > 0.2 ? 'start' : Math.cos(a) < -0.2 ? 'end' : 'middle'} />; })}
    <Mono x={CX} y={CY - 20} text={fr >= f(tLap - 0.3) ? `lap ${laps}` : ''} at={tLap - 0.3} size={44} color={C.callout} anchor="middle" />
    <Hand x={CX} y={CY + 40} text="each lap: the whole trip" at={tLap} size={30} color={C.secondary} weight={400} anchor="middle" />
    {[['the whole backpack again', tBack], ['mostly from the cache', tStamp], ['new writing', tTw], ['often more thinking', tIce]].map(([w, t], i) =>
      <Hand key={w} x={1290} y={300 + i * 60} text={`+ ${w}`} at={t - 0.1} size={38} color={i === 0 ? C.accent : i === 1 ? C.accent : C.callout} />)}
    <Meter x={1500} y={560} s={0.7} at={tReads} read={0.1 + 0.8 * climb} write={0.08 + 0.75 * climb} />
    <Src text="Each request carries the full conversation: Claude Code docs (Oct 2026)" at={tLap} />
    <Label text="Schematic" at={0.3} />
  </Page>; };

// ---------------------------------------------------------------- S34 Four and fifteen
const TokS34 = () => {
  const tMeas = cue(34, 'measured'), tFour = cue(34, 'four'), tFif = cue(34, 'fifteen'), tThir = cue(34, 'thirteen');
  const rows = [['chat', 1, tMeas + 0.3, C.secondary], ['one agent', 4, tFour - 0.1, C.accent], ['several agents', 15, tFif - 0.1, C.callout]];
  return <Page>
    <Hand x={960} y={120} text="Agents burn through tokens" at={0.1} size={56} anchor="middle" />
    {rows.map(([l, n, at, c], i) => <React.Fragment key={l}>
      <Hand x={150} y={290 + i * 160} text={l} at={at - 0.2} size={46} color={C.ink} />
      <Squares x={560} y={260 + i * 160} n={n} at={at} color={c} size={64} gap={12} step={0.05} />
      <Mono x={560 + n * 76 + 20} y={292 + i * 160} text={n === 1 ? '1x' : `~${n}x`} at={at + n * 0.05} size={36} color={c} />
    </React.Fragment>)}
    <Mono x={150} y={760} text="one square = the tokens of a typical chat" at={tFour + 0.5} size={24} color={C.secondary} />
    <Hand x={150} y={860} text="Claude Code, enterprise average: about $13 per developer per active day" at={tThir - 0.3} size={40} color={C.ink} />
    <Src text="Source: Anthropic Engineering, multi-agent research system (June 2025); Claude Code docs (Oct 2026)" at={tMeas} />
  </Page>; };

// ---------------------------------------------------------------- S35 Docs example
const TokS35 = () => { const fr = useCurrentFrame();
  const tDocs = cue(35, 'docs'), tFresh = cue(35, 'Fresh'), tRe = cue(35, 'Re-read'), tNine = cue(35, 'nine'), tWhole = cue(35, 'whole');
  const S = 34, G = 6, X = 640;
  return <Page>
    <div style={{position: 'absolute', left: 150, top: 95, width: 1620, background: '#1B1F2A', borderRadius: 8, padding: '22px 30px', fontFamily: MONO, fontSize: 28, color: '#E8EEFC', opacity: prog(fr, tDocs - 0.3, 0.4), whiteSpace: 'nowrap'}}>
      claude-sonnet-4-6:  1.2k input, 5.3k output, 940.0k cache read, 50.0k cache write ($0.55)
    </div>
    <Sheet>
      <PopG at={tFresh} cx={X} cy={330}><rect x={X} y={313} width={S * 0.12} height={S} fill={C.accent} /></PopG>
      <PopG at={tFresh + 0.6} cx={X} cy={410}><rect x={X} y={393} width={S * 0.53} height={S} fill={C.callout} /></PopG>
      {Array.from({length: 5}, (_, i) => <PopG key={i} at={tRe - 0.4 + i * 0.04} cx={X + i * (S + G) + S / 2} cy={490}><rect x={X + i * (S + G)} y={473} width={S} height={S} fill={C.cache} stroke={C.accent} strokeWidth={2} /></PopG>)}
      {Array.from({length: 94}, (_, i) => <PopG key={i} at={tRe + i * 0.02} cx={X + (i % 24) * (S + G) + S / 2} cy={570 + Math.floor(i / 24) * (S + G)}>
        <rect x={X + (i % 24) * (S + G)} y={553 + Math.floor(i / 24) * (S + G)} width={S} height={S} fill={C.accent} /></PopG>)}
    </Sheet>
    <Hand x={150} y={330} text="new input  1.2k" at={tFresh - 0.1} size={36} color={C.ink} />
    <Hand x={150} y={410} text="output  5.3k" at={tFresh + 0.5} size={36} color={C.ink} />
    <Hand x={150} y={490} text="written to cache  50k" at={tRe - 0.5} size={36} color={C.ink} />
    <Hand x={150} y={570} text="re-read from cache" at={tRe - 0.1} size={36} color={C.accent} />
    <Hand x={150} y={620} text="940k" at={tNine} size={52} color={C.accent} />
    <Mono x={X} y={760} text="one square = 10,000 tokens" at={tRe + 0.5} size={24} color={C.secondary} />
    <Hand x={960} y={870} text="almost the whole bill is the backpack" at={tWhole - 0.2} size={56} color={C.callout} anchor="middle" />
    <Label text="Example output from Anthropic's Claude Code docs (Sonnet 4.6 session)" at={tDocs} />
    <Src text="Source: Claude Code docs, Manage costs effectively, /usage example" at={tDocs} />
  </Page>; };

// ================================================================ CLIP 6 (scenes 36-40)
// ---------------------------------------------------------------- S36 Map 7
const TokS36 = () => { const tRid = cue(36, 'riddle');
  return <Page>
    <ChapterMap at={0} step={0.04} active={7} done={[1, 2, 3, 4, 5, 6]} sealed={[]} sealAt={null} />
    <Hand x={1500} y={760} text="Tuesday vs Wednesday" at={tRid - 0.2} size={44} color={C.callout} anchor="middle" rotate={-4} />
  </Page>; };

// ---------------------------------------------------------------- S37 Four users
const TokS37 = () => { const fr = useCurrentFrame();
  const tSpr = cue(37, 'Sprinter'), tTue = cue(37, 'Tuesday'), tHeavy = cue(37, 'Heavy'), tBlue = cue(37, 'blue'), tDeep = cue(37, 'Deep'), tOr = cue(37, 'orange'),
    tRatio = cue(37, 'ratio'), tBuild = cue(37, 'Builder'), tBoth = cue(37, 'both'), tWed = cue(37, 'Wednesday');
  const Q = [[90, 150], [990, 150], [90, 570], [990, 570]];
  const steps = Math.min(5, Math.max(0, Math.floor((fr / 30 - tBlue + 0.3) / 0.5) + 1)) * (fr >= f(tBlue - 0.3) ? 1 : 0);
  const loop = fr >= f(tBoth - 0.2) ? 0.5 + 0.4 * Math.abs(Math.sin((fr - f(tBoth - 0.2)) * 0.12)) : 0.1;
  const users = [
    ['THE SPRINTER', 'short messages, fresh chats', tSpr, 0.15, 0.1],
    ['THE HEAVY LIFTER', 'long report, long thread', tHeavy, 0.12 + 0.16 * steps, 0.12],
    ['THE DEEP THINKER', 'a few hard prompts', tDeep, 0.2, fr >= f(tOr - 0.2) ? 0.15 + 0.8 * prog(fr, tOr - 0.2, 0.6) : 0.15],
    ['THE BUILDER', 'agents, lap after lap', tBuild, loop, loop * 0.9],
  ];
  return <Page>
    <Sheet>
      <Ink at={0} dur={0.5} d={linePath(960, 140, 960, 960, 3701, 2)} w={4} color={C.rule} />
      <Ink at={0.1} dur={0.5} d={linePath(80, 555, 1840, 555, 3702, 2)} w={4} color={C.rule} />
    </Sheet>
    {users.map(([t, s, at, r, w], i) => { const [x, y] = Q[i]; return <React.Fragment key={t}>
      <Hand x={x + 20} y={y + 50} text={t} at={at - 0.2} size={46} color={C.ink} />
      <Hand x={x + 20} y={y + 110} text={s} at={at + 0.2} size={32} color={C.secondary} weight={400} />
      {fr >= f(at - 0.2) && <Meter x={x + 560} y={y + 20} s={0.62} at={at - 0.2} read={r} write={w} labels={i === 0} />}
    </React.Fragment>; })}
    <Hand x={110} y={330} text="= Tuesday" at={tTue - 0.1} size={48} color={C.accent} rotate={-3} />
    <Hand x={1010} y={330} text="= Wednesday" at={tWed - 0.1} size={44} color={C.negative} rotate={-3} />
    <Hand x={110} y={750} text="= Wednesday" at={tWed + 0.3} size={44} color={C.negative} rotate={-3} />
    <Mono x={110} y={830} text="remember: 1,500 read = 6 written" at={tRatio - 0.2} size={28} color={C.callout} />
    <Label text="Illustrative user types: meters show direction, not measured amounts" at={0.3} />
  </Page>; };

// ---------------------------------------------------------------- S38 Three habits
const TokS38 = () => { const fr = useCurrentFrame();
  const tFirst = cue(38, 'First'), tBack = cue(38, 'backpack'), tSec = cue(38, 'Second'), tLess = cue(38, 'less'), tEff = cue(38, 'effort'), tThird = cue(38, 'Third'), tSum = cue(38, 'summary'), tFresh = cue(38, 'fresh');
  const cards = [[120, tFirst, '1', 'New task,', 'new chat'], [700, tSec, '2', 'Easy job? Ask for', 'less writing, lower effort'], [1280, tThird, '3', 'Before a break: a short', 'summary, then a fresh chat']];
  const empty = prog(fr, tBack, 0.6), shrink = prog(fr, tEff - 0.1, 0.8);
  return <Page>
    <Hand x={960} y={120} text="Three habits that stretch any plan" at={0} size={56} anchor="middle" />
    <Sheet>
      {cards.map(([x, at, n], i) => <Ink key={n} at={at - 0.3} dur={0.6} d={rectPath(x, 230, 520, 620, 3801 + i, 2.5)} w={5} fill="#FFFFFF" fillAt={at - 0.1} />)}
      {/* 1: backpack empties */}
      {fr >= f(tFirst) && Array.from({length: 6}, (_, i) => <rect key={i} x={340} y={700 - i * 30} width={80} height={26} rx={3} fill="#FFE3D1" stroke={C.ink} strokeWidth={3} opacity={i === 0 ? 1 : 1 - empty} />)}
      {/* 2: iceberg shrinks */}
      {fr >= f(tSec) && <g>
        <path d={wob([[740, 600], [1180, 600]], 3810, 4)} stroke={C.accent} strokeWidth={4} fill="none" />
        <path d={`M ${960 - 120 * (1 - 0.6 * shrink)} 600 L 960 ${600 - 60 * (1 - 0.5 * shrink)} L ${960 + 120 * (1 - 0.6 * shrink)} 600 L ${960 + 90 * (1 - 0.6 * shrink)} ${600 + 180 * (1 - 0.6 * shrink)} L ${960 - 90 * (1 - 0.6 * shrink)} ${600 + 180 * (1 - 0.6 * shrink)} Z`} fill={C.cache} stroke={C.ink} strokeWidth={3} />
      </g>}
      {/* 3: fridge timer */}
      {fr >= f(tThird) && <g>
        <circle cx={1540} cy={660} r={80} fill="#fff" stroke={C.ink} strokeWidth={5} />
        <path d={`M 1540 660 L ${1540 + 64 * Math.cos(-Math.PI / 2 + fr * 0.08)} ${660 + 64 * Math.sin(-Math.PI / 2 + fr * 0.08)}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
      </g>}
    </Sheet>
    {cards.map(([x, at, n, a, b]) => <React.Fragment key={n}>
      <Hand x={x + 40} y={300} text={n} at={at - 0.1} size={64} color={C.callout} />
      <Hand x={x + 40} y={400} text={a} at={at} size={36} color={C.ink} />
      <Hand x={x + 40} y={455} text={b} at={at + 0.4} size={36} color={C.ink} />
    </React.Fragment>)}
    <Src text="Sources: Anthropic Help Center; Claude Code docs; prompt caching docs; Du et al. (2025 preprint)" at={tFirst} />
  </Page>; };

// ---------------------------------------------------------------- S39 Tanks
const TokS39 = () => { const fr = useCurrentFrame();
  const tPage = cue(39, 'pricing'), tSame = cue(39, 'same'), tLad = cue(39, 'ladder'), tTanks = cue(39, 'tanks'), tNeed = cue(39, 'need'), tBurn = cue(39, 'burns');
  const cols = [['Free', '$0'], ['Pro', '$20'], ['Max', '$100'], ['Ultra', '$200']]; const tankH = [null, 30, 150, 300];
  const brainsOut = 1 - prog(fr, tLad + 0.3, 0.8);
  return <Page>
    <Sheet>
      {cols.map(([nm, pr], i) => { const cx = 330 + i * 420;
        return <g key={nm}>
          <PopG at={0.1 + i * 0.1} cx={cx} cy={190}><path d={rectPath(cx - 130, 120, 260, 140, 3901 + i)} fill="#FFFFFF" stroke={C.ink} strokeWidth={5} />
            <text x={cx} y={180} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={42} fill={C.ink}>{nm}</text>
            <text x={cx} y={240} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={40} fill={C.ink}>{pr}</text></PopG>
          <g opacity={brainsOut * (fr >= f(tPage) ? 1 : 0)}><ellipse cx={cx} cy={380} rx={40 + i * 18} ry={(40 + i * 18) * 0.78} fill={i === 3 ? '#FFE39A' : '#F1EEE6'} stroke={C.ink} strokeWidth={4} /></g>
          {tankH[i] == null
            ? <Ink at={tTanks} dur={0.4} d={rectPath(cx - 80, 750, 160, 50, 3910 + i, 1.5)} w={4} color={C.secondary} dash="10 9" />
            : fr >= f(tTanks + i * 0.15) && <path d={rectPath(cx - 80, 800 - tankH[i] * prog(fr, tTanks + i * 0.15, 0.7), 160, Math.max(1, tankH[i] * prog(fr, tTanks + i * 0.15, 0.7)), 3920 + i, 1.5)} fill={C.cache} stroke={C.ink} strokeWidth={4} />}
          {fr >= f(tNeed) && Array.from({length: 3}, (_, k) => { const p = ((fr - f(tNeed)) / 30 * 0.8 + k / 3 + i * 0.1) % 1; return <rect key={k} x={cx - 10} y={800 + 20 + 60 * p} width={20} height={16} rx={3} fill={k % 2 ? C.callout : C.accent} opacity={1 - p} />; })}
        </g>; })}
      <Ink at={tSame} dur={0.6} d={rectPath(760, 900, 400, 80, 3930, 1.5)} w={5} fill="#EFEAE0" fillAt={tSame + 0.2} />
    </Sheet>
    <Hand x={960} y={940} text="same engine: Sonnet" at={tSame + 0.2} size={36} anchor="middle" />
    <Hand x={960} y={470} text="not a ladder of brains" at={tLad} size={48} color={C.negative} anchor="middle" out={tTanks} />
    <Hand x={960} y={470} text="a row of fuel tanks" at={tTanks} size={52} color={C.accent} anchor="middle" />
    <Hand x={1500} y={430} text="how does your work burn fuel?" at={tBurn - 0.3} size={34} color={C.callout} anchor="middle" />
    <Label text="Tank = weekly usage vs Pro (Free: limited, not to scale)" at={tTanks + 0.4} />
  </Page>; };

// ---------------------------------------------------------------- S40 Answer (word card)
const TokS40 = () => { const tBig = cue(40, 'Bigger');
  return <Page>
    <Hand x={960} y={430} text="Same brain." at={0.05} size={150} anchor="middle" dur={0.5} />
    <TwoTone y={620} a="Bigger" b="tank." at={tBig - 0.1} dur={0.6} size={150} colorB={C.accent} />
    <Meter x={1660} y={780} s={0.35} at={0} read={0.4} write={0.2} labels={false} />
  </Page>; };

// ================================================================ v2 NEW SCENES (1 Nov 2026): keyed 'v<n>' in words.json
// ---------- shared: the five idea icons (promise + recap) ----------
export const IDEAS = ['tokens', 'a token at a time', 'writing costs more', 'thinking is writing', 'the backpack'];
const IdeaGlyph = ({i, cx, cy, s = 1}) => {
  if (i === 0) return <>{[-1, 0, 1].map((k) => <rect key={k} x={cx + k * 34 * s - 14 * s} y={cy - 12 * s} width={28 * s} height={24 * s} rx={4} fill={[C.light, '#FFE3D1', '#EAF3E3'][k + 1]} stroke={C.ink} strokeWidth={2.5} />)}</>;
  if (i === 1) return <><rect x={cx - 40 * s} y={cy - 12 * s} width={26 * s} height={24 * s} rx={4} fill={C.light} stroke={C.ink} strokeWidth={2.5} /><path d={`M ${cx - 6 * s} ${cy} L ${cx + 14 * s} ${cy}`} stroke={C.ink} strokeWidth={4} /><path d={`M ${cx + 8 * s} ${cy - 8 * s} L ${cx + 18 * s} ${cy} L ${cx + 8 * s} ${cy + 8 * s}`} fill="none" stroke={C.ink} strokeWidth={4} /><rect x={cx + 22 * s} y={cy - 12 * s} width={26 * s} height={24 * s} rx={4} fill={C.callout} /></>;
  if (i === 2) return <text x={cx} y={cy + 14 * s} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={40 * s} fill={C.callout}>5x</text>;
  if (i === 3) return <><ellipse cx={cx} cy={cy - 4 * s} rx={40 * s} ry={26 * s} fill="#FFFFFF" stroke={C.ink} strokeWidth={3} /><circle cx={cx - 26 * s} cy={cy + 30 * s} r={6 * s} fill="#fff" stroke={C.ink} strokeWidth={2.5} /><text x={cx} y={cy + 4 * s} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30 * s} fill={C.callout}>…</text></>;
  return <>{[0, 1, 2, 3].map((k) => <rect key={k} x={cx - 24 * s} y={cy + 24 * s - k * 16 * s} width={48 * s} height={14 * s} rx={3} fill="#FFE3D1" stroke={C.ink} strokeWidth={2.5} />)}</>;
};
const IdeaIcons = ({x0, y, step = 175, at, lit = [], gap = 0.2, s = 1, labels = true}) => { const fr = useCurrentFrame();
  return <>
    <Sheet>{IDEAS.map((_, i) => { const cx = x0 + i * step, on = lit[i] != null && fr >= f(lit[i]);
      return <PopG key={i} at={at + i * gap} cx={cx} cy={y}>
        <circle cx={cx} cy={y} r={62 * s} fill={on ? '#FFF3EA' : '#FFFFFF'} stroke={on ? C.callout : C.ink} strokeWidth={on ? 6 : 4} />
        <IdeaGlyph i={i} cx={cx} cy={y} s={s} />
      </PopG>; })}</Sheet>
    {labels && IDEAS.map((l, i) => <Hand key={l} x={x0 + i * step} y={y + (95 + (step < 220 && i % 2 ? 40 : 0)) * s} text={l} at={at + i * gap + 0.1} size={24 * s} color={lit[i] != null && fr >= f(lit[i]) ? C.callout : C.secondary} weight={400} anchor="middle" />)}
  </>; };

// ---------------------------------------------------------------- v5 The promise
const TokV5 = () => { const tFive = cue('v5', 'five'), tMin = cue('v5', 'minute'), tUse = cue('v5', 'useful'), tRid = cue('v5', 'riddle');
  return <Page>
    <Hand x={560} y={150} text="PART 1" at={0.1} size={44} color={C.callout} anchor="middle" />
    <Hand x={560} y={215} text="How an AI chat actually works" at={0.3} size={46} anchor="middle" />
    <IdeaIcons x0={200} y={420} step={180} at={tFive - 0.1} gap={0.18} />
    <Hand x={560} y={640} text="about a minute each · each useful on its own" at={tMin - 0.2} size={32} color={C.secondary} weight={400} anchor="middle" />
    <Sheet><Ink at={0.4} dur={0.6} d={linePath(1100, 120, 1100, 900, 501, 2)} w={4} color={C.rule} /></Sheet>
    <Hand x={1480} y={150} text="PART 2" at={0.5} size={44} color={C.accent} anchor="middle" />
    <Hand x={1480} y={215} text="What your plan actually buys" at={0.7} size={46} anchor="middle" />
    <Sheet><PopG at={tRid - 0.2} cx={1480} cy={470}><path d={rectPath(1180, 360, 600, 220, 502, 2)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} /></PopG></Sheet>
    <Hand x={1480} y={420} text="Tuesday: 40 messages, fine" at={tRid} size={30} color={C.accent} anchor="middle" />
    <Hand x={1480} y={480} text="Wednesday: 4 prompts, locked out" at={tRid + 0.2} size={30} color={C.negative} anchor="middle" />
    <Hand x={1480} y={540} text="solved here" at={tRid + 0.5} size={30} color={C.callout} weight={400} anchor="middle" />
  </Page>; };

// ---------------------------------------------------------------- v6 Hit Enter (Part 1 card)
const TokV6 = () => { const fr = useCurrentFrame(); const tEnter = cue('v6', 'Enter'), tWords = cue('v6', 'words'), tTok = cue('v6', 'tokens');
  const card = 1 - prog(fr, tEnter - 0.5, 0.4);
  const toks = ['Why', ' is', ' the', ' sky', ' blue', '?'];
  return <Page>
    <Sheet>
      <Ink at={tEnter - 0.4} dur={0.5} d={rectPath(260, 300, 1000, 120, 601, 2)} w={5} fill="#FFFFFF" fillAt={tEnter - 0.2} />
      <PopG at={tEnter} cx={1340} cy={360}><path d={rectPath(1290, 320, 110, 80, 602, 1.5)} fill={C.callout} stroke={C.ink} strokeWidth={4} /></PopG>
      <ChipArt cx={1500} cy={720} s={0.55} at={tTok - 0.3} />
    </Sheet>
    <Mono x={300} y={360} text="Why is the sky blue?" at={tEnter - 0.2} size={48} out={tTok - 0.1} />
    <Hand x={1345} y={362} text="↵" at={tEnter} size={44} color="#FFFFFF" anchor="middle" />
    <Hand x={760} y={500} text="the AI doesn't see words…" at={tWords - 0.2} size={40} color={C.secondary} anchor="middle" />
    <Chips x={300} y={360} toks={toks} at={tTok - 0.1} step={0.08} size={44} />
    <Hand x={760} y={600} text="it sees tokens" at={tTok} size={56} color={C.callout} anchor="middle" />
    {card > 0 && <div style={{position: 'absolute', inset: 0, background: C.panel, opacity: card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 64, color: C.callout}}>PART 1</div>
      <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 96, color: C.ink}}>How an AI chat actually works</div>
    </div>}
  </Page>; };

// ---------------------------------------------------------------- v9 Numbers on a chip
const NUMS = ['0.13', '-1.07', '0.88', '0.02', '-0.41', '1.26', '-0.09', '0.57', '-0.73', '0.31', '0.04', '-1.18', '0.66', '-0.25', '0.92', '0.11'];
const TokV9 = () => { const fr = useCurrentFrame();
  const tModel = cue('v9', 'model'), tFile = cue('v9', 'file'), tW = cue('v9', 'weights'), tThir = cue('v9', 'thirteen'), tChips = cue('v9', 'chips'), tData = cue('v9', 'data'), tComp = cue('v9', 'compute'), tMaths = cue('v9', 'maths');
  const scroll = fr / 30 * 40;
  return <Page>
    <Hand x={420} y={130} text="the model" at={tModel - 0.1} size={56} anchor="middle" />
    <Sheet>
      <Ink at={tFile - 0.3} dur={0.6} d={rectPath(220, 200, 400, 520, 901, 2)} w={5} fill="#FFFFFF" fillAt={tFile - 0.1} />
    </Sheet>
    {fr >= f(tFile - 0.1) && <div style={{position: 'absolute', left: 240, top: 215, width: 360, height: 490, overflow: 'hidden', fontFamily: MONO, fontSize: 30, color: C.secondary, lineHeight: '44px'}}>
      <div style={{transform: `translateY(${-(scroll % 44)}px)`}}>{Array.from({length: 14}, (_, r) => <div key={r}>{NUMS[(r + Math.floor(scroll / 44)) % 16]}  {NUMS[(r * 3 + 5 + Math.floor(scroll / 44)) % 16]}  {NUMS[(r * 7 + 2 + Math.floor(scroll / 44)) % 16]}</div>)}</div>
    </div>}
    <Hand x={420} y={770} text="= weights (illustrative numbers)" at={tW - 0.1} size={34} color={C.callout} anchor="middle" />
    <Mono x={420} y={850} text="13,000,000,000 of them" at={tThir - 0.1} size={40} color={C.ink} anchor="middle" />
    <Mono x={420} y={895} text="13-billion-parameter model, 2023 Berkeley-led paper" at={tThir + 0.4} size={20} color={C.secondary} anchor="middle" />
    <Sheet>
      <Ink at={tChips - 0.4} dur={0.6} d={rectPath(1150, 200, 560, 560, 902, 2)} w={5} fill="#F1EEE6" fillAt={tChips - 0.2} />
      {[0, 1, 2].map((k) => <Ink key={k} at={tChips - 0.2 + k * 0.1} dur={0.3} d={linePath(1170, 330 + k * 160, 1690, 330 + k * 160, 910 + k, 1)} w={3} color={C.rule} />)}
      <ChipArt cx={1430} cy={480} s={0.62} at={tChips} label="GPU" />
      <Ink at={tComp - 0.2} dur={0.7} d={wob([[640, 460], [880, 420], [1130, 470]], 920, 2)} w={6} color={C.callout} />
      <Ink at={tComp + 0.4} dur={0.2} d={wob([[1100, 445], [1132, 470], [1098, 492]], 921, 0.8)} w={6} color={C.callout} />
    </Sheet>
    <Hand x={1430} y={150} text="AI chips, like GPUs" at={tChips} size={40} anchor="middle" />
    <Hand x={1430} y={810} text="in a data centre" at={tData - 0.1} size={36} color={C.secondary} anchor="middle" />
    <Hand x={880} y={360} text="compute" at={tComp - 0.1} size={50} color={C.callout} anchor="middle" />
    <Hand x={880} y={560} text="= the maths the chips do" at={tMaths - 0.3} size={32} color={C.callout} weight={400} anchor="middle" />
    <Label text="Anthropic does not publish Claude model sizes" at={tThir + 0.6} />
    <Src text="Source: Kwon et al., PagedAttention (vLLM), SOSP 2023" at={tThir} />
  </Page>; };

// ---------------------------------------------------------------- v10 Next token
const TokV10 = () => { const fr = useCurrentFrame();
  const tPred = cue('v10', 'predict'), tTok = cue('v10', 'token'), tLater = cue('v10', 'Later'), tTime = cue('v10', 'time'), tAdded = cue('v10', 'added'), tCap = cue('v10', 'capital'), tParis = cue('v10', 'Paris');
  const toks = ['The', ' capital', ' of', ' France', ' is'];
  const after = fr >= f(tParis);
  return <Page>
    <Hand x={960} y={140} text="predict the next word" at={tPred - 0.1} size={62} anchor="middle" />
    <Hand x={960} y={210} text="(strictly: the next token)" at={tTok - 0.1} size={34} color={C.secondary} weight={400} anchor="middle" />
    <Hand x={960} y={300} text="later training → a helpful assistant, still writing a token at a time" at={tLater} size={32} color={C.accent} weight={400} anchor="middle" />
    <Chips x={160} y={560} toks={toks} at={tCap - 0.1} step={0.1} size={46} />
    {fr >= f(tCap + 0.3) && !after && <div style={{position: 'absolute', left: 1010, top: 526, width: 150, height: 68, borderRadius: 10, border: `4px dashed ${C.callout}`, opacity: 0.5 + 0.5 * Math.abs(Math.sin(fr * 0.15)), fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.callout, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>}
    {after && <PopDiv at={tParis}><div style={{position: 'absolute', left: 1010, top: 526, width: 170, height: 68, borderRadius: 10, background: C.callout, border: `3px solid ${C.ink}`, fontFamily: MONO, fontSize: 44, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> Paris</div></PopDiv>}
    <Sheet>
      <ChipArt cx={1620} cy={560} s={0.5} at={tTime - 0.3} label="MODEL" />
      <Ink at={tTime} dur={0.5} d={wob([[1200, 560], [1300, 560], [1400, 560]], 1001, 1)} w={5} color={C.ink} />
      <Ink at={tAdded} dur={0.8} d={wob([[1620, 700], [1500, 800], [900, 820], [400, 780], [300, 640]], 1002, 3)} w={5} color={C.callout} dash="14 10" />
    </Sheet>
    <Hand x={960} y={860} text="each new token goes back in, and it predicts the next" at={tAdded + 0.2} size={34} color={C.callout} weight={400} anchor="middle" />
    <Label text="Illustration" at={0.3} />
    <Src text="Source: Anthropic glossary, Pretraining (Nov 2026)" at={tPred} />
  </Page>; };
const PopDiv = ({at, children}) => { const fr = useCurrentFrame(); const t = fr - f(at); if (t < 0) return null; const sp = spring({frame: t, fps: 30, config: {damping: 11, stiffness: 200, mass: 0.6}});
  return <div style={{position: 'absolute', inset: 0, transform: `scale(${0.7 + 0.3 * sp})`, transformOrigin: '1095px 560px', opacity: Math.min(1, t / 4)}}>{children}</div>; };

// ---------------------------------------------------------------- v15 Hidden writing (thinking)
const TokV15 = () => { const fr = useCurrentFrame();
  const tExt = cue('v15', 'extended'), tSpin = cue('v15', 'spinner'), tBeh = cue('v15', 'Behind'), tTry = cue('v15', 'trying'), tBack = cue('v15', 'backtracking'),
    tBills = cue('v15', 'bills'), tRate = cue('v15', 'rate'), tCode = cue('v15', 'Code'), tChoose = cue('v15', 'choose');
  const lift = prog(fr, tBeh - 0.2, 0.6); const fill = prog(fr, tBeh, Math.max(1, tCode - tBeh));
  return <Page>
    <Sheet>
      {/* hidden page */}
      {fr >= f(tBeh - 0.2) && <g opacity={lift}>
        <path d={rectPath(260, 300, 640, 560, 1501, 2)} fill="#FFF3EA" stroke={C.callout} strokeWidth={4} />
        {Array.from({length: 11}, (_, i) => i / 11 < fill && <path key={i} d={wob(Array.from({length: 9}, (_, k) => [300 + k * 62, 345 + i * 46 + (k % 2) * 6]), 1510 + i, 2)} stroke={C.callout} strokeWidth={4} fill="none" />)}
        {[2, 5, 8].map((i) => fr >= f(tBack - 0.2 + i * 0.05) && <path key={i} d={linePath(290, 360 + i * 46, 860, 330 + i * 46, 1530 + i, 2)} stroke={C.negative} strokeWidth={5} />)}
        {fr >= f(tBack) && <path d={wob([[880, 700], [940, 560], [880, 430]], 1540, 2)} stroke={C.callout} strokeWidth={4} fill="none" />}
      </g>}
      {/* the visible bubble: a lid that lifts */}
      <g transform={`translate(0 ${-100 * lift}) rotate(${-4 * lift} 580 260)`}>
        <PopG at={tExt - 0.1} cx={580} cy={280}><path d={rectPath(280, 210, 600, 140, 1502, 2)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} /></PopG>
        {fr >= f(tSpin - 0.2) && <path d={`M ${360 + 28 * Math.cos(fr * 0.25)} ${280 + 28 * Math.sin(fr * 0.25)} A 28 28 0 1 1 ${360 + 28 * Math.cos(fr * 0.25 + 4.2)} ${280 + 28 * Math.sin(fr * 0.25 + 4.2)}`} fill="none" stroke={C.secondary} strokeWidth={7} strokeLinecap="round" />}
        <text x={410} y={295} fontFamily={HAND} fontWeight={700} fontSize={44} fill={C.secondary} opacity={fr >= f(tSpin - 0.2) ? 1 : 0}>Thinking…</text>
      </g>
    </Sheet>
    <Hand x={580} y={900} text="trying · checking · backtracking" at={tTry} size={36} color={C.callout} anchor="middle" />
    <Mono x={260} y={950} text="illustration: the raw thinking; apps show at most a summary" at={tBeh + 0.3} size={20} color={C.secondary} />
    <Meter x={1200} y={260} s={0.8} at={tExt} read={0.15} write={0.12 + 0.75 * fill} />
    <Hand x={1520} y={330} text="billed as output" at={tBills - 0.1} size={36} color={C.callout} />
    <Hand x={1520} y={385} text="(writing rate)" at={tRate - 0.1} size={30} color={C.callout} weight={400} />
    <Hand x={1340} y={720} text="Claude Code: newest models always think" at={tCode - 0.2} size={32} color={C.ink} anchor="middle" />
    {['low', 'medium', 'high'].map((l, i) => <React.Fragment key={l}>
      <Sheet><PopG at={tChoose + i * 0.12} cx={1170 + i * 170} cy={810}><path d={rectPath(1110 + i * 170, 780, 120, 60, 1550 + i, 1)} fill={i === 1 ? '#E8EEFC' : '#FFFFFF'} stroke={C.accent} strokeWidth={4} /></PopG></Sheet>
      <Hand x={1170 + i * 170} y={810} text={l} at={tChoose + i * 0.12} size={28} color={C.accent} anchor="middle" />
    </React.Fragment>)}
    <Hand x={1340} y={880} text="effort" at={tChoose} size={28} color={C.secondary} weight={400} anchor="middle" />
    <Src text="Source: Anthropic extended thinking docs; Claude Code docs (Oct 2026)" at={tBills} />
  </Page>; };

// ---------------------------------------------------------------- v21 Working memory (context window)
const TokV21 = () => { const fr = useCurrentFrame();
  const tHold = cue('v21', 'hold'), tCtx = cue('v21', 'context'), tWork = cue('v21', 'working'), tMil = cue('v21', 'million'), tDep = cue('v21', 'depending');
  const g = prog(fr, tMil - 0.3, 1.0);
  return <Page>
    <Sheet>
      <Courier x={420} y={760} at={0} pack={9} />
      <Ink at={tCtx - 0.2} dur={0.5} d={wob([[300, 380], [280, 380], [280, 640], [300, 640]], 2101, 1)} w={5} color={C.accent} />
      <path d={rectPath(800, 520, 900, 70, 2102, 1.2)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} opacity={fr >= f(tMil - 0.4) ? 1 : 0} />
      <rect x={804} y={524} width={892 * g} height={62} fill={C.accent} />
    </Sheet>
    <Hand x={260} y={300} text="how much can it hold?" at={tHold - 0.2} size={38} color={C.secondary} />
    <Hand x={800} y={300} text="the context window" at={tCtx - 0.1} size={62} color={C.ink} />
    <Hand x={800} y={380} text="= the model's working memory" at={tWork - 0.1} size={42} color={C.accent} />
    <Mono x={800} y={490} text="0" at={tMil - 0.4} size={28} color={C.secondary} />
    <Mono x={1700} y={490} text="1,000,000 tokens" at={tMil - 0.1} size={34} color={C.accent} anchor="end" />
    <Hand x={800} y={650} text="on Claude: up to a million tokens, depending on the model" at={tDep - 0.3} size={36} color={C.ink} />
    <Mono x={800} y={720} text="what it can look back on now, not what it was trained on" at={tDep + 0.4} size={22} color={C.secondary} />
    <Label text="Illustrative character" at={0.3} />
    <Src text="Source: claude.com/pricing (context window: up to 1M, varies by model); Anthropic glossary" at={tMil} />
  </Page>; };

// ---------------------------------------------------------------- v27 Recap
const TokV27 = () => {
  const tFive = cue('v27', 'five'), t1 = cue('v27', 'Tokens'), t2 = cue('v27', 'token'), t3 = cue('v27', 'Writing'), t4 = cue('v27', 'Thinking'), t5 = cue('v27', 'backpack'), tRid = cue('v27', 'riddle');
  return <Page>
    <Hand x={960} y={200} text="Five ideas" at={tFive - 0.2} size={64} anchor="middle" />
    <IdeaIcons x0={410} y={470} step={275} at={tFive} gap={0.08} s={1.3} lit={[t1, t2, t3, t4, t5]} />
    <Sheet><PopG at={tRid - 0.2} cx={960} cy={820}><path d={rectPath(660, 760, 600, 120, 2701, 2)} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} /></PopG></Sheet>
    <Hand x={960} y={820} text="now, the riddle" at={tRid - 0.1} size={46} color={C.negative} anchor="middle" />
  </Page>; };

// ---------------------------------------------------------------- v28 Part 2 card over "Same engine"
const TokV28 = () => { const fr = useCurrentFrame(); const tGo = cue(7, 'Go'); const card = 1 - prog(fr, tGo - 0.4, 0.4);
  return <>
    <S7 />
    {card > 0 && <div style={{position: 'absolute', inset: 0, background: C.panel, opacity: card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 64, color: C.accent}}>PART 2</div>
      <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 96, color: C.ink}}>What your plan actually buys</div>
    </div>}
  </>; };

// ---------- 37 Next time: pointer to the next video (user's request, 1 Nov 2026). Top-right kept clear for the YouTube end-screen element.
const TokV37 = () => { const fr = useCurrentFrame();
  const tCost = cue('v37', 'cost'), tWorse = cue('v37', 'worse'), tNext = cue('v37', 'Next'), tFix = cue('v37', 'fix');
  const stagger = fr > f(tWorse) ? 1 : 0;
  return <Page>
    <Sheet>
      {/* the courier under a bursting backpack, left */}
      <Courier x={430} y={720} at={0.1} pack={fr < f(tWorse) ? 4 : 6} stagger={stagger} warm={fr > f(tCost) ? 0.5 : 0} />
      {/* a worried wobble line over the head once the answers get worse */}
      {fr > f(tWorse) && <Ink at={tWorse} dur={0.4} d={wob([[385, 495], [408, 468], [432, 495], [456, 468], [480, 495]], 2600, 1.5)} w={4} color={C.negative} />}
      {/* arrow to the next card */}
      <Ink at={tNext} dur={0.5} d={linePath(700, 640, 940, 640, 2610, 2)} w={8} />
      <Ink at={tNext + 0.3} dur={0.25} d={wob([[900, 600], [945, 640], [900, 680]], 2611, 2)} w={8} />
      {/* the next-video card, bottom-right area (end-screen element goes top-right) */}
      <Ink at={tNext + 0.4} dur={0.5} d={rectPath(990, 500, 820, 300, 2620, 2)} w={6} fill={C.panel} fillAt={tNext + 0.6} />
    </Sheet>
    <Stamp x={1120} y={470} text="NEXT" at={tNext + 0.5} color={C.callout} size={64} rotate={-6} />
    <Hand x={1400} y={620} text="Why your AI gets dumber" at={tNext + 0.9} size={62} anchor="middle" dur={0.6} />
    <Hand x={1400} y={710} text="in long chats" at={tNext + 1.3} size={62} anchor="middle" dur={0.4} color={C.accent} />
    <Hand x={1400} y={770} text="...and the fix" at={tFix} size={40} anchor="middle" dur={0.4} color={C.ink} weight={400} />
    <Hand x={120} y={200} text="It makes the answers worse." at={tWorse} size={64} dur={0.8} color={C.negative} />
  </Page>; };
export {Src, Label, Laptop, Bubble, Person, Courier, Gauge, Squares, Tag, IdeaIcons, PopDiv, TwoTone, Clock};
