// LongChat: hand-written scenes ("The wrong turn", S3 base + S7 montage beats). Every reveal is cued to Sam's words via cue().
// Colours: Accent denim blue = what YOU said; Callout orange = what the MODEL guessed or wrote; Negative = wrong answers only.
import React from 'react';
import {useCurrentFrame, interpolate, OffthreadVideo, staticFile, AbsoluteFill} from 'remotion';
import {C, f, prog, cue, HAND, MONO, SANS} from './lib';
import {Page, Sheet, Ink, Hand, Mono, Stamp, PopG, rectPath, ellPath, linePath, wob} from './draw';
import {Src, Label, Laptop, Person, Courier} from './kit';
import {Walker, Sticky, Paper, Gauge2, Pupil, Solid, Hero, DeskRoom, poly} from './polish';
export const __custom = true;

// a chat bubble that can carry the orange "bug" (the old mistake) or a teal fix stroke
const Msg = ({x, y, w, me, at, seed, bug, bugAt, fixAt}) => { const fr = useCurrentFrame();
  return <PopG at={at} cx={x + w / 2} cy={y + 28}>
    <path d={rectPath(x + 5, y + 7, w, 56, seed, 1.4)} fill={C.ink} opacity={0.12} />
    <path d={rectPath(x, y, w, 56, seed, 1.4)} fill={me ? C.you : C.ai} stroke={C.ink} strokeWidth={3} />
    <path d={wob(me ? [[x + w - 30, y + 56], [x + w - 10, y + 76], [x + w - 50, y + 56]] : [[x + 30, y + 56], [x + 12, y + 76], [x + 52, y + 56]], seed + 5, 0.5)} fill={me ? C.you : C.ai} stroke={C.ink} strokeWidth={3} />
    {[0, 1].map((i) => <path key={i} d={linePath(x + 20, y + 20 + i * 14, x + w - 40 - ((seed + i) % 3) * 30, y + 20 + i * 14, seed + i, 0.7)} stroke={C.secondary} strokeWidth={4} strokeLinecap="round" />)}
    {bug && fr >= f(bugAt ?? at) && <g transform={`translate(${x + w - 26} ${y + 28})`}>
      <ellipse rx={13} ry={10} fill={C.callout} stroke={C.ink} strokeWidth={2.5} />
      {[-1, 1].map((s) => [-6, 0, 6].map((dx) => <line key={`${s}${dx}`} x1={dx} y1={s * 9} x2={dx + s * 3} y2={s * 16} stroke={C.ink} strokeWidth={2} />))}
    </g>}
    {fixAt != null && <Ink at={fixAt} dur={0.35} d={linePath(x + w - 46, y + 10, x + w - 6, y + 48, seed + 9, 1)} w={6} color={C.accent} />}
  </PopG>; };

// ---------------------------------------------------------------- S1 Twenty messages ago
export const S1 = () => { const fr = useCurrentFrame();
  const tHour = cue(1, 'hour'), tBril = cue(1, 'brilliant'), tNow = cue(1, 'Now'), tMist = cue(1, 'mistake'), tCorr = cue(1, 'correct'), tApol = cue(1, 'apologises'), tAgain = cue(1, 'again');
  const scroll = interpolate(fr, [f(tNow - 0.6), f(tNow + 0.6)], [0, -150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const face = fr >= f(tAgain + 0.2) ? 'Tired' : fr >= f(tApol) ? 'Suspicious' : fr >= f(tMist) ? 'Concerned' : fr >= f(tBril) ? 'Smile' : 'Calm';
  const LX = 860, LY = 170;
  return <Page>
    <Sheet><DeskRoom at={0} deskY={800} part="wall" /></Sheet>
    <Hero x={470} y={1020} h={760} at={0.1} bust body="Shirt" face={face} shirt={C.you} bob={fr < f(tAgain) ? 2 * Math.sin(fr * 0.25) : 6} />
    <Sheet>
      <DeskRoom at={0} deskY={800} part="desk" />
      <Laptop x={LX} y={LY} at={0.0} />
      <defs><clipPath id="scr"><rect x={LX + 15} y={LY + 75} width={730} height={385} /></clipPath></defs>
      <g clipPath="url(#scr)"><g transform={`translate(${LX - 560} ${scroll + LY - 150})`}>
        <Msg x={600} y={240} w={380} at={0.4} seed={11} bug bugAt={tBril + 0.3} fixAt={tMist + 0.4} />
        <Msg x={930} y={315} w={290} me at={tHour - 0.1} seed={12} />
        <Msg x={600} y={390} w={460} at={tHour + 0.3} seed={13} />
        <Msg x={900} y={465} w={320} me at={tNow - 0.4} seed={14} />
        <Msg x={600} y={540} w={420} at={tMist} seed={15} bug bugAt={tMist + 0.1} fixAt={tCorr + 0.2} />
        <Msg x={960} y={615} w={260} me at={tCorr} seed={16} />
        <Msg x={600} y={690} w={440} at={tApol} seed={17} />
        <Msg x={600} y={765} w={300} at={tAgain} seed={18} bug bugAt={tAgain + 0.1} />
      </g></g>
    </Sheet>
    <Hand x={1680} y={440} text="brilliant" at={tBril} size={46} color={C.accent} rotate={-4} />
    <Hand x={1665} y={500} text="you fixed this" at={tCorr + 0.3} size={36} color={C.accent} />
    <Hand x={1680} y={560} text="sorry!" at={tApol + 0.2} size={40} color={C.callout} />
    <Hand x={1240} y={900} text="...and it's back" at={tAgain + 0.4} size={56} color={C.negative} anchor="middle" />
    <Label text="Generic chat window (illustration); character: Open Peeps (CC0)" at={0.5} />
  </Page>; };

// ---------------------------------------------------------------- S2 The obvious answer (+ montage beat: library)
export const S2 = () => { const fr = useCurrentFrame();
  const tObv = cue(2, 'obvious'), tExc = cue(2, 'Except'), tPaid = cue(2, 'paid'), tTwo = cue(2, 'two'), tPages = cue(2, 'pages'), tLonger = cue(2, 'longer'), tMore = cue(2, 'more');
  const libIn = tPages + 0.1, libOut = tLonger - 0.25; const showLib = fr >= f(libIn) && fr < f(libOut);
  const libOp = Math.min(1, prog(fr, libIn, 0.35)) * (1 - prog(fr, libOut - 0.35, 0.35));
  const N = 14; const stackTop = 230;
  const face2 = fr >= f(tMore - 0.3) ? 'Smile' : fr >= f(tTwo) ? 'Awe' : fr >= f(tExc) ? 'Suspicious' : 'Serious';
  return <Page>
    <Hero x={250} y={1080} h={520} at={0} bust body="Shirt" face={face2} shirt={C.you} bob={2 * Math.sin(fr * 0.2)} />
    <Sheet>
      <Ink at={tObv} dur={0.6} d={ellPath(470, 300, 300, 120, 201, 3)} w={5} fill="#FFFFFF" fillAt={tObv + 0.3} />
      {[0, 1, 2].map((i) => <Ink key={i} at={tObv + 0.3 + i * 0.1} dur={0.2} d={ellPath(360 - i * 40, 450 + i * 34, 22 - i * 5, 18 - i * 4, 210 + i, 1)} w={4} />)}
      <Ink at={tExc} dur={0.35} d={linePath(220, 250, 720, 350, 220, 2)} w={9} color={C.negative} />
      {Array.from({length: N}, (_, i) => <PopG key={i} at={tPaid + i * 0.05} cx={1350} cy={stackTop + 40 * i + 20} from={0.85}>
        <path d={rectPath(1156 - (i % 2) * 6, stackTop + i * 40 + 6, 400, 34, 300 + i, 1.2)} fill={C.ink} opacity={0.1} />
        <path d={rectPath(1150 - (i % 2) * 6, stackTop + i * 40, 400, 34, 300 + i, 1.2)} fill={i >= N - 2 ? C.you : '#FFFFFF'} stroke={C.ink} strokeWidth={3} />
        <path d={linePath(1175 - (i % 2) * 6, stackTop + i * 40 + 17, 1480 - ((i * 37) % 90), stackTop + i * 40 + 17, 340 + i, 0.5)} stroke={C.rule} strokeWidth={3} />
      </PopG>)}
      <Ink at={tPages} dur={0.5} d={linePath(1135, stackTop, 1135, stackTop + N * 40, 330, 1)} w={4} color={C.secondary} />
    </Sheet>
    <Hand x={470} y={318} text="it ran out of memory?" at={tObv + 0.2} size={48} anchor="middle" />
    <Mono x={1350} y={stackTop - 50} text="200,000+ tokens" at={tTwo} size={50} color={C.accent} anchor="middle" />
    <Hand x={1120} y={stackTop + 300} text="a few hundred pages" at={tPages - 0.1} size={38} color={C.secondary} anchor="end" />
    <Hand x={1350} y={stackTop + N * 40 + 70} text="your chat so far" at={tLonger - 0.1} size={40} color={C.accent} anchor="middle" />
    <Hand x={720} y={720} text="so... more room = better?" at={tMore - 0.3} size={50} color={C.ink} anchor="middle" rotate={-2} />
    <Src text="Anthropic Help Center: 200K-token context window on paid plans" at={tPaid} />
    <Label text="Pages: rough guide" at={tPages} />
    {showLib && <AbsoluteFill style={{opacity: libOp}}>
      <OffthreadVideo src={staticFile('clips/library.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} startFrom={0} />
      <AbsoluteFill style={{background: C.primary, opacity: 0.25}} />
    </AbsoluteFill>}
  </Page>; };

// ---------------------------------------------------------------- S3 More than a third (two dials)
const Dial = ({cx, cy, at, value, color, label, r = 230}) => { const fr = useCurrentFrame(); const a = Math.PI * (1 - value / 100);
  return <>
    <Ink at={at} dur={0.6} d={wob(Array.from({length: 17}, (_, i) => [cx - r * Math.cos(Math.PI * i / 16), cy - r * Math.sin(Math.PI * i / 16)]), cx, 1.5)} w={7} />
    {[0, 25, 50, 75, 100].map((v) => { const b = Math.PI * (1 - v / 100);
      return <path key={v} d={linePath(cx + (r - 22) * Math.cos(b), cy - (r - 22) * Math.sin(b), cx + r * Math.cos(b), cy - r * Math.sin(b), cx + v, 0.5)} stroke={C.ink} strokeWidth={4} opacity={fr >= f(at + 0.3) ? 1 : 0} />; })}
    {fr >= f(at + 0.4) && <><line x1={cx} y1={cy} x2={cx + (r - 40) * Math.cos(a)} y2={cy - (r - 40) * Math.sin(a)} stroke={color} strokeWidth={11} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={16} fill={C.ink} /></>}
  </>; };
export const S3 = () => { const fr = useCurrentFrame();
  const tRes = cue(3, 'researchers'), tSim = cue(3, 'simulated'), tTest = cue(3, 'tested'), tEv = cue(3, 'everything'), tWell = cue(3, 'well'), tPiece = cue(3, 'piece', 0), tThird = cue(3, 'third'), tSame = cue(3, 'Same', 2), tSpread = cue(3, 'spread');
  const left = 100 * prog(fr, tEv, 0.8); const right = 100 - 39 * prog(fr, tPiece, 1.4);
  return <Page>
    <Sheet>
      <Gauge2 cx={520} cy={680} at={tEv - 0.4} value={left} color={C.accent} />
      <Gauge2 cx={1400} cy={680} at={tPiece - 0.5} value={fr < f(tPiece) ? 100 : right} color={C.callout} />
      <Paper x={560} y={95} w={800} h={170} at={tRes} seed={401} />
    </Sheet>
    <Mono x={960} y={125} text="STUDY" at={tRes + 0.1} size={24} color={C.secondary} anchor="middle" />
    <Hand x={960} y={172} text="Microsoft Research & Salesforce Research" at={tRes + 0.2} size={32} anchor="middle" />
    <Mono x={960} y={240} text="Laban et al., ICLR 2026" at={tRes + 0.4} size={26} color={C.secondary} anchor="middle" />
    <Mono x={960} y={292} text="200,000+ simulated chats · 15 models · 6 tasks" at={tTest} size={30} anchor="middle" />
    <Hand x={520} y={392} text="everything at once" at={tEv} size={44} color={C.accent} anchor="middle" />
    <Mono x={520} y={790} text="100" at={tWell} size={64} color={C.accent} anchor="middle" />
    <Hand x={1400} y={392} text="same facts, piece by piece" at={tPiece - 0.2} size={44} color={C.callout} anchor="middle" />
    {fr >= f(tPiece + 0.3) && <Mono x={1400} y={790} text={`about ${Math.round(right)}`} at={tPiece + 0.3} size={64} color={C.callout} anchor="middle" />}
    <Hand x={1400} y={860} text="average drop: 39%" at={tThird - 0.1} size={48} color={C.negative} anchor="middle" />
    <Hand x={960} y={930} text="Same model. Same facts." at={tSame} size={50} anchor="middle" />
    <Hand x={1400} y={930} text="" at={tSpread} size={40} color={C.secondary} anchor="middle" />
    <Mono x={520} y={850} text="100 = one-message score (reference)" at={tWell + 0.2} size={22} color={C.secondary} anchor="middle" />
    <Label text="Simulated conversations; averages across tasks and models" at={tTest} />
  </Page>; };

// ---------------------------------------------------------------- S4 Title
export const S4 = () => { const fr = useCurrentFrame(); const tWhy = cue(4, 'why'), tLong = cue(4, 'long');
  return <Page>
    <Hand x={960} y={420} text="Why your AI gets dumber" at={tWhy - 0.1} size={110} anchor="middle" />
    <Hand x={960} y={560} text="in long chats" at={tLong - 0.2} size={110} color={C.callout} anchor="middle" />
    <Sheet>{Array.from({length: 7}, (_, i) => { const wob2 = i * 7 * Math.sin(fr * 0.15 + i); return <g key={i} opacity={1 - i * 0.11} transform={`translate(${wob2} 0) rotate(${i * 1.2 * Math.sin(fr * 0.1 + i)} ${700 + i * 80} 760)`}>
      <PopG at={0.2 + i * 0.12} cx={700 + i * 80} cy={760}><path d={rectPath(640 + i * 80, 735, 120, 50, 450 + i, 1.2 + i * 0.4)} fill={i % 2 ? C.you : C.ai} stroke={C.ink} strokeWidth={3} /></PopG></g>; })}</Sheet>
  </Page>; };

// ---------------------------------------------------------------- S5 The route (three ideas, then the fix)
const Spot = ({cx, cy, at}) => <PopG at={at} cx={cx} cy={cy}>
  <rect x={cx - 45} y={cy - 70} width={90} height={140} rx={10} fill="#FFFFFF" stroke={C.ink} strokeWidth={4} />
  <rect x={cx - 45} y={cy - 70} width={90} height={40} rx={10} fill={C.hl} opacity={0.9} /><rect x={cx - 45} y={cy + 30} width={90} height={40} rx={10} fill={C.hl} opacity={0.9} />
  <rect x={cx - 45} y={cy - 30} width={90} height={60} fill={C.rule} opacity={0.7} />
</PopG>;
export const S5 = () => { const fr = useCurrentFrame();
  const tThree = cue(5, 'three'), tSees = cue(5, 'sees'), tEach = cue(5, 'Each'), tUse = cue(5, 'useful'), tFix = cue(5, 'fix'), tWrites = cue(5, 'writes');
  const xs = [430, 830, 1230]; const lit = fr >= f(tWrites) ? 1 : 0.35;
  return <Page>
    <Hand x={960} y={190} text="what the AI actually sees" at={tSees - 0.2} size={58} anchor="middle" />
    <Sheet>
      <Paper x={xs[0] - 80} y={360} w={160} h={240} at={tThree} seed={501} />
      {fr >= f(tThree + 0.1) && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={linePath(xs[0] - 58 + (i % 3 === 1 ? 20 : 0), 410 + i * 24, xs[0] + 50 - (i % 2) * 24, 410 + i * 24, 510 + i, 0.6)} stroke={i % 3 === 1 ? C.callout : C.accent} strokeWidth={6} strokeLinecap="round" />)}
      <Sticky x={xs[1] - 120} y={390} w={130} h={120} at={tThree + 0.35} fill={C.you} rot={-6} seed={541} />
      <Sticky x={xs[1] - 5} y={450} w={130} h={120} at={tThree + 0.5} fill={C.ai} rot={5} seed={542} />
      <Paper x={xs[2] - 80} y={360} w={160} h={240} at={tThree + 0.7} seed={551} fold={false} />
      {fr >= f(tThree + 0.8) && [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const mid = i > 1 && i < 6; return <path key={i} d={linePath(xs[2] - 58, 400 + i * 26, xs[2] + 54 - (i % 2) * 22, 400 + i * 26, 560 + i, 0.6)} stroke={mid ? C.rule : C.ink} strokeWidth={6} strokeLinecap="round" opacity={mid ? 0.5 : 1} />; })}
      {fr >= f(tThree + 0.8) && <><rect x={xs[2] - 74} y={378} width={148} height={52} fill={C.hl} opacity={0.55} /><rect x={xs[2] - 74} y={530} width={148} height={52} fill={C.hl} opacity={0.55} /></>}
      <g opacity={lit}><PopG at={tFix - 0.1} cx={1600} cy={480}><Solid d={rectPath(1490, 440, 220, 80, 520, 1.5)} fill={lit === 1 ? C.accent : C.rule} w={4} /></PopG></g>
      {fr >= f(tFix) && [0, 1, 2].map((i) => <path key={i} d={linePath(1340 + i * 40, 480, 1370 + i * 40, 480, 570 + i, 0.4)} stroke={C.secondary} strokeWidth={6} strokeLinecap="round" opacity={0.6} />)}
      {[0, 1, 2].map((i) => <Ink key={i} at={tEach + i * 0.2} dur={0.3} d={ellPath(xs[i], 640, 30, 30, 530 + i, 1)} w={4} color={C.accent} />)}
    </Sheet>
    <Hand x={xs[0]} y={640} text="1" at={tEach} size={40} anchor="middle" /><Hand x={xs[1]} y={640} text="2" at={tEach + 0.2} size={40} anchor="middle" /><Hand x={xs[2]} y={640} text="3" at={tEach + 0.4} size={40} anchor="middle" />
    <Hand x={xs[1] - 55} y={462} text="you" at={tThree + 0.4} size={36} color={C.accent} anchor="middle" rotate={-6} />
    <Hand x={xs[1] + 60} y={522} text="AI" at={tThree + 0.55} size={36} color={C.callout} anchor="middle" rotate={5} />
    <Hand x={xs[0]} y={740} text="one long document" at={tThree + 0.1} size={34} color={C.secondary} anchor="middle" />
    <Hand x={xs[1]} y={740} text="your words, its guesses" at={tThree + 0.45} size={34} color={C.secondary} anchor="middle" />
    <Hand x={xs[2]} y={740} text="a dim middle" at={tThree + 0.8} size={34} color={C.secondary} anchor="middle" />
    <Hand x={1600} y={493} text="New chat" at={tFix} size={38} color={lit === 1 ? '#FFFFFF' : C.secondary} anchor="middle" />
    <Hand x={960} y={900} text="each one useful on its own" at={tUse - 0.1} size={44} color={C.accent} anchor="middle" />
  </Page>; };

// ================================================================ CLIP B: PART 1, what the AI actually sees
const PartCard = ({n, text, at, out}) => { const fr = useCurrentFrame(); if (fr < f(at) || fr >= f(out)) return null;
  const op = Math.min(1, prog(fr, at, 0.3)) * (1 - prog(fr, out - 0.35, 0.35));
  return <AbsoluteFill style={{opacity: op}}><Page>
    <Hand x={960} y={430} text={`PART ${n}`} at={at} size={60} color={C.callout} anchor="middle" />
    <Hand x={960} y={560} text={text} at={at + 0.3} size={86} anchor="middle" />
  </Page></AbsoluteFill>; };
// a scroll of lines: teal = you, orange = the AI; `rows` lines visible, unrolling from `at`
const Scroll = ({x, y, w, rows, at, seed = 600, unroll = 1, dim}) => { const fr = useCurrentFrame(); const vis = Math.floor(rows * Math.min(1, unroll));
  return <>
    <Ink at={at} dur={0.5} d={rectPath(x, y, w, 30 + rows * 34, seed, 1.5)} w={5} fill="#FFFFFF" fillAt={at + 0.2} />
    {Array.from({length: vis}, (_, i) => { const me = i % 3 !== 1; const yy = y + 28 + i * 34;
      const o = dim ? dim(i, rows) : 1;
      return <path key={i} d={linePath(x + 26 + (me ? 0 : 40), yy, x + w - 30 - ((seed + i) % 4) * 26, yy, seed + i, 0.8)} stroke={me ? C.accent : C.callout} strokeWidth={8} strokeLinecap="round" opacity={o} />; })}
  </>; };

// ---------------------------------------------------------------- S6 One long document (+ courier callback)
export const S6 = () => { const fr = useCurrentFrame();
  const tSee = cue(6, 'see'), tRem = cue(6, 'remember'), tEnter = cue(6, 'Enter'), tSends = cue(6, 'sends'), tLong = cue(6, 'long'), tWatched = cue(6, 'watched'), tBack = cue(6, 'backpack'), tYour = cue(6, 'Your', 1), tScroll = cue(6, 'scroll');
  const cardOut = tSee + 1.2; const sends = [tSends - 0.2, tSends + 1.0, tLong + 0.4];
  const k = sends.filter((t) => fr >= f(t)).length; const unroll = 0.35 + 0.22 * k;
  return <Page>
    <Sheet>
      {/* three Enter presses, each sending the whole scroll to the model */}
      <Scroll x={260} y={220} w={520} rows={16} at={cardOut} unroll={unroll} />
      {sends.map((t, i) => { const p = prog(fr, t, 0.9); if (fr < f(t) || p >= 1) return null;
        return <g key={i} transform={`translate(${p * 820} ${-p * 40}) scale(${1 - p * 0.55})`} opacity={1 - p * 0.6} style={{transformOrigin: '520px 470px'}}>
          <rect x={260} y={220} width={520} height={30 + 16 * 34} fill="none" stroke={C.callout} strokeWidth={5} strokeDasharray="14 10" /></g>; })}
      <PopG at={tSends + 0.1} cx={1400} cy={470}><path d={rectPath(1290, 380, 220, 180, 640, 2)} fill={C.ink} stroke={C.ink} strokeWidth={4} /></PopG>
      <Walker x={1770} y={900} s={1.2} at={tWatched} face={-1} pack={1 + 3 * prog(fr, tBack, 1.5)} packColor={C.ai} />
    </Sheet>
    <Hand x={1400} y={482} text="model" at={tSends + 0.2} size={40} color="#FFFFFF" anchor="middle" />
    <Hand x={1400} y={640} text={'no memory between messages'} at={tRem} size={34} color={C.secondary} anchor="middle" />
    <Mono x={520} y={185} text={`sent again: ${k}x`} at={tEnter} size={32} color={C.callout} anchor="middle" />
    <Hand x={330} y={880} text="you" at={tYour} size={44} color={C.accent} />
    <Hand x={500} y={880} text="its replies" at={tYour + 0.4} size={44} color={C.callout} />
    <Hand x={1770} y={400} text="the backpack" at={tBack} size={40} color={C.secondary} anchor="middle" />
    <Hand x={520} y={960} text="all on the same scroll" at={tScroll - 0.2} size={44} anchor="middle" />
    <Src text="Anthropic: the full conversation is sent with every request" at={tSends} />
    <PartCard n={1} text="What does the AI actually see?" at={0} out={cardOut} />
  </Page>; };

// ---------------------------------------------------------------- S7 Its own words (sticky notes)
const Note = ({x, y, at, me, text, rot = 0, seed, glow}) => <Sticky x={x} y={y} at={at} fill={me ? C.you : C.ai} rot={rot} seed={seed} glow={glow}>
  {text ? text.split('|').map((t, i, a) => <text key={i} x={x + 90} y={y + 78 + (i - (a.length - 1) / 2) * 32} textAnchor="middle" fontFamily={HAND} fontSize={28} fill={C.ink}>{t}</text>)
    : [0, 1, 2].map((i) => <path key={i} d={linePath(x + 22, y + 44 + i * 28, x + 150 - ((seed + i) % 3) * 20, y + 44 + i * 28, seed + i, 0.6)} stroke={C.secondary} strokeWidth={4} />)}
</Sticky>;
export const S7 = () => { const fr = useCurrentFrame();
  const tTwo = cue(7, 'two'), tSaid = cue(7, 'said', 0), tHolds = cue(7, 'holds'), tGuess = cue(7, 'guesses'), tCode = cue(7, 'code'), tDetail = cue(7, 'detail'), tFills = cue(7, 'fills'), tAssume = cue(7, 'assumption', 0), tNext = cue(7, 'Next'), tSolid = cue(7, 'solid'), tHold = cue(7, 'Hold', 1);
  const shuffle = prog(fr, tNext, 1.0); const mix = (a, b) => a + (b - a) * shuffle;
  return <Page>
    <Sheet>
      <Note x={mix(220, 520)} y={mix(240, 300)} at={tSaid - 0.2} me rot={-4} seed={701} />
      <Note x={mix(220, 820)} y={mix(420, 470)} at={tSaid} me rot={3} seed={702} />
      <Note x={mix(1500, 640)} y={mix(240, 520)} at={tHolds + 0.1} rot={5} seed={703} />
      <Note x={mix(1500, 980)} y={mix(420, 290)} at={tGuess - 0.1} rot={-3} seed={704} />
      <Note x={mix(220, 400)} y={mix(600, 560)} at={tCode} me rot={2} seed={705} text="write me|some code" />
      <Note x={mix(1500, 1180)} y={mix(600, 430)} at={tFills} rot={-5} seed={706} text="assume:|Python 2" glow={fr >= f(tAssume)} />
      {fr >= f(tDetail) && fr < f(tFills) && <Ink at={tDetail} dur={0.3} d={ellPath(960, 670, 70, 50, 707, 2)} w={5} color={C.secondary} dash />}
    </Sheet>
    <Hand x={380} y={200} text="what you said" at={tSaid - 0.2} size={44} color={C.accent} anchor="middle" />
    <Hand x={1590} y={200} text="what it guessed" at={tGuess} size={44} color={C.callout} anchor="middle" />
    <Hand x={960} y={690} text="missing detail?" at={tDetail} size={34} color={C.secondary} anchor="middle" />
    <Hand x={960} y={860} text="next turn: one pile, read as if it were all fact" at={tNext + 0.3} size={46} anchor="middle" />
    <Hand x={960} y={930} text="just as solid as your instructions" at={tSolid - 0.2} size={40} color={C.callout} anchor="middle" />
    <Stamp x={1620} y={640} text="HOLD THAT THOUGHT" sub={null} at={tHold} size={44} rotate={-6} color={C.callout} />
    <Label text="Illustration" at={0.3} />
  </Page>; };

// ---------------------------------------------------------------- S8 The dim middle (spotlight + U-curve, Liu et al.)
const U = [[1, 0.75], [5, 0.57], [10, 0.535], [15, 0.55], [20, 0.63]]; // illustrative shape of the 20-document curve (2023 models)
export const S8 = () => { const fr = useCurrentFrame();
  const tThree = cue(8, 'three'), tEven = cue(8, 'evenly'), tStan = cue(8, 'Stanford-led'), tStart = cue(8, 'start'), tEnd = cue(8, 'end'), tBur = cue(8, 'buried'), tMiss = cue(8, 'missed'), tMeet = cue(8, 'meeting'), tTech = cue(8, 'technically');
  const dimP = prog(fr, tBur, 1.0);
  const gx = (d) => 1000 + (d - 1) / 19 * 720, gy = (v) => 820 - (v - 0.4) / 0.45 * 520;
  return <Page>
    <Sheet>
      <Scroll x={180} y={200} w={480} rows={18} at={0.1} dim={(i, n) => { const mid = Math.abs(i - (n - 1) / 2) < n * 0.3; return mid ? 1 - 0.75 * dimP : 1; }} />
      {fr >= f(tStart) && <ellipse cx={420} cy={265} rx={290} ry={80} fill={C.hl} opacity={0.35 * prog(fr, tStart, 0.5)} />}
      {fr >= f(tEnd) && <ellipse cx={420} cy={790} rx={290} ry={80} fill={C.hl} opacity={0.35 * prog(fr, tEnd, 0.5)} />}
      {/* axes */}
      <Ink at={tStan} dur={0.5} d={linePath(980, 300, 980, 840, 801, 0.8)} w={4} />
      <Ink at={tStan + 0.2} dur={0.5} d={linePath(980, 840, 1740, 840, 802, 0.8)} w={4} />
      <Ink at={tStart} dur={Math.max(0.8, tEnd - tStart + 1.2)} d={wob(U.map(([d, v]) => [gx(d), gy(v)]), 803, 1)} w={7} color={C.accent} />
      {fr >= f(tBur) && <circle cx={gx(10)} cy={gy(0.535)} r={34} fill="none" stroke={C.negative} strokeWidth={5} opacity={prog(fr, tBur, 0.4)} />}
    </Sheet>
    <Hand x={1360} y={250} text="Lost in the Middle (Liu et al.)" at={tStan} size={40} anchor="middle" />
    <Mono x={960} y={300} text="accuracy" at={tStan} size={24} color={C.secondary} anchor="end" />
    <Mono x={1360} y={895} text="where the answer sat among 20 documents" at={tStan + 0.3} size={24} color={C.secondary} anchor="middle" />
    <Mono x={1000} y={870} text="1st" at={tStart} size={24} anchor="middle" /><Mono x={1720} y={870} text="20th" at={tEnd} size={24} anchor="middle" />
    <Hand x={420} y={190} text="start" at={tStart} size={40} color={C.callout} anchor="middle" />
    <Hand x={420} y={900} text="end" at={tEnd} size={40} color={C.callout} anchor="middle" />
    <Hand x={720} y={540} text="the middle?" at={tBur} size={40} color={C.negative} />
    <Hand x={1360} y={130} text="like the middle of a long meeting" at={tMeet - 0.3} size={40} color={C.secondary} anchor="middle" />
    <Src text="Liu et al., Lost in the Middle, TACL 2024 (2023 models)" at={tStan} />
    <Label text="Curve shape redrawn from the paper; 2023 models" at={tStan} />
  </Page>; };

// ---------------------------------------------------------------- S9 Three ideas (recap)
export const S9 = () => { const fr = useCurrentFrame();
  const tOne = cue(9, 'one'), tWords = cue(9, 'words'), tDim = cue(9, 'dim'), tWatch = cue(9, 'watch'), tConv = cue(9, 'conversation');
  const xs = [480, 960, 1440]; const lits = [tOne, tWords, tDim];
  return <Page>
    <Sheet>{xs.map((x, i) => <PopG key={i} at={lits[i] - 0.1} cx={x} cy={420}><circle cx={x} cy={420} r={110} fill={i === 0 ? '#FFFFFF' : i === 1 ? C.you : C.hl} stroke={C.ink} strokeWidth={5} /></PopG>)}</Sheet>
    <Hand x={xs[0]} y={440} text="1" at={tOne} size={90} anchor="middle" /><Hand x={xs[1]} y={440} text="2" at={tWords} size={90} anchor="middle" /><Hand x={xs[2]} y={440} text="3" at={tDim} size={90} anchor="middle" />
    <Hand x={xs[0]} y={620} text="one long document" at={tOne + 0.1} size={42} anchor="middle" />
    <Hand x={xs[1]} y={620} text="its guesses look like facts" at={tWords + 0.1} size={42} color={C.callout} anchor="middle" />
    <Hand x={xs[2]} y={620} text="the middle fades" at={tDim + 0.1} size={42} anchor="middle" />
    <Hand x={960} y={820} text="now watch what that does to a conversation" at={tWatch - 0.1} size={50} color={C.accent} anchor="middle" />
  </Page>; };

// ================================================================ CLIP C: PART 2, the experiment and the twist
// decorative montage beat (S7): a graded stock clip, faded in and out, never carrying a number or an event label
const Montage = ({src, at, out, tint = 0.2, start = 0}) => { const fr = useCurrentFrame(); if (fr < f(at) || fr >= f(out)) return null;
  const op = Math.min(1, prog(fr, at, 0.35)) * (1 - prog(fr, out - 0.35, 0.35));
  return <AbsoluteFill style={{opacity: op}}>
    <OffthreadVideo src={staticFile(`clips/${src}`)} muted startFrom={f(start)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: C.primary, opacity: tint}} />
  </AbsoluteFill>; };
const Card = ({x, y, w, h, at, seed, fill = '#FFFFFF', lw = 4, fold}) => <Paper x={x} y={y} w={w} h={h} at={at} seed={seed} fill={fill} lw={lw} fold={fold ?? (w > 300 && h > 150)} />;
const Grid = ({x, y, n, at, color, cols = 10, size = 30, gap = 6, step = 0.012, total = 100}) => { const fr = useCurrentFrame();
  return <>{Array.from({length: total}, (_, i) => { const on = i < n && fr >= f(at + i * step);
    return <rect key={i} x={x + (i % cols) * (size + gap)} y={y + Math.floor(i / cols) * (size + gap)} width={size} height={size} rx={3} fill={on ? color : 'none'} stroke={on ? C.ink : C.rule} strokeWidth={on ? 1.5 : 1.5} />; })}</>; };

// ---------------------------------------------------------------- S10 Snowballs (three ways)
export const S10 = () => { const fr = useCurrentFrame();
  const tWrong = cue(10, 'wrong'), tStudy = cue(10, 'study'), tSnow = cue(10, 'snowballs'), tMelt = cue(10, 'melt'), tLong = cue(10, 'long'), tWhole = cue(10, 'whole'), tDrips = cue(10, 'drips'), tFive = cue(10, 'five'), tTalk = cue(10, 'talk');
  const cardOut = tStudy + 0.4;
  const shards = ['how long until he\'s ready?', 'a snowball fight', '20 snowballs an hour', 'aiming for 60', '2 melt every 15 min'];
  return <Page>
    <Sheet>
      <Card x={480} y={115} w={960} h={180} at={tSnow - 0.6} seed={1001} />
      <Card x={140} y={420} w={700} h={210} at={tWhole} seed={1002} fill={C.you} />
      {shards.map((t, i) => <Card key={i} x={1060 + (i % 2) * 40} y={360 + i * 92} w={560} h={74} at={tDrips + i * 0.3} seed={1010 + i} fill={C.you} lw={3} />)}
    </Sheet>
    <Mono x={960} y={160} text="the paper's example (GSM8K)" at={tSnow - 0.5} size={24} color={C.secondary} anchor="middle" />
    <Hand x={960} y={215} text="20 snowballs an hour, but 2 melt every 15 minutes." at={tMelt - 0.4} size={34} anchor="middle" />
    <Hand x={960} y={262} text="How long until there are 60?" at={tLong - 0.2} size={36} anchor="middle" />
    <Hand x={490} y={395} text="ONE MESSAGE" at={tWhole} size={40} color={C.accent} anchor="middle" />
    <Hand x={490} y={500} text="the whole problem," at={tWhole + 0.2} size={40} anchor="middle" />
    <Hand x={490} y={560} text="all at once" at={tWhole + 0.4} size={40} anchor="middle" />
    <Hand x={1360} y={330} text="FIVE MESSAGES" at={tDrips} size={40} color={C.callout} anchor="middle" />
    {shards.map((t, i) => <Hand key={i} x={1090 + (i % 2) * 40} y={408 + i * 92} text={t} at={tDrips + i * 0.3 + 0.1} size={30} />)}
    <Hand x={490} y={760} text="closer to how a lot of us talk →" at={tTalk - 0.4} size={42} color={C.secondary} anchor="middle" rotate={-2} />
    <Src text="Example adapted from GSM8K, as shown in Laban et al. (Figure 2)" at={tSnow - 0.5} />
    <PartCard n={2} text="What actually goes wrong?" at={0} out={cardOut} />
  </Page>; };

// ---------------------------------------------------------------- S11 Not the missing facts (CONCAT control)
export const S11 = () => { const fr = useCurrentFrame();
  const tClever = cue(11, 'clever'), tList = cue(11, 'list'), tNinety = cue(11, 'ninety-five'), tLost = cue(11, 'lost'), tDrip = cue(11, 'drip');
  return <Page>
    <Sheet>
      <Grid x={180} y={300} n={100} at={tClever} color={C.accent} />
      <Grid x={760} y={300} n={95} at={tNinety - 1.0} color={C.accent} step={0.01} />
      <Card x={1360} y={300} w={420} h={330} at={tList - 0.2} seed={1101} fill={C.you} />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1400} cy={350 + i * 58} r={7} fill={C.ink} opacity={fr >= f(tList + i * 0.12) ? 1 : 0} />)}
      {[0, 1, 2, 3, 4].map((i) => <Ink key={i} at={tList + i * 0.12} dur={0.3} d={linePath(1425, 350 + i * 58, 1720 - (i % 3) * 40, 350 + i * 58, 1120 + i, 0.6)} w={6} color={C.secondary} />)}
    </Sheet>
    <Hand x={360} y={250} text="whole problem, one message" at={tClever} size={36} color={C.accent} anchor="middle" />
    <Mono x={360} y={700} text="100 (reference)" at={tClever + 0.5} size={32} anchor="middle" />
    <Hand x={940} y={250} text="same pieces as a list" at={tList} size={36} color={C.accent} anchor="middle" />
    <Mono x={940} y={700} text="about 95" at={tNinety} size={40} color={C.accent} anchor="middle" />
    <Hand x={1570} y={250} text="one message, bullet points" at={tList} size={34} color={C.secondary} anchor="middle" />
    <Hand x={940} y={790} text="nothing lost in the chopping" at={tLost - 0.2} size={44} anchor="middle" />
    <Hand x={1570} y={790} text="the problem is the drip" at={tDrip - 0.3} size={50} color={C.callout} anchor="middle" rotate={-2} />
    <Mono x={60} y={1000} text="one square = 1% of the one-message score" at={tClever + 0.4} size={22} color={C.secondary} />
    <Src text="Laban et al., ICLR 2026: list version averaged 95.1% of the one-message score" at={tNinety} />
  </Page>; };

// ---------------------------------------------------------------- S12 Thirty-nine percent
const TASKS = ['code', 'databases', 'API calls', 'maths', 'table captions', 'summaries'];
export const S12 = () => { const fr = useCurrentFrame();
  const tThirty = cue(12, 'thirty-nine'), tCode = cue(12, 'code'), tEvery = cue(12, 'Every'), tSmall = cue(12, 'small'), tTop = cue(12, 'top'), tFollow = cue(12, 'follow-up'), tTwo = cue(12, 'two'), tCause = cue(12, 'cause');
  return <Page>
    <Hand x={960} y={420} text="-39%" at={tThirty - 0.2} size={260} color={C.callout} anchor="middle" />
    <Hand x={960} y={530} text="average drop, spread across a conversation" at={tThirty + 0.6} size={40} anchor="middle" />
    {TASKS.map((t, i) => <Hand key={t} x={260 + i * 280} y={170} text={t} at={tCode + i * 0.18} size={36} color={C.secondary} anchor="middle" />)}
    <Sheet>{Array.from({length: 15}, (_, i) => <PopG key={i} at={tSmall + i * 0.08} cx={460 + i * 72} cy={700}><circle cx={460 + i * 72} cy={700} r={10 + i * 1.6} fill={C.ai} stroke={C.ink} strokeWidth={3} /></PopG>)}
      <Ink at={tEvery} dur={0.5} d={linePath(420, 760, 1500, 760, 1201, 1)} w={4} color={C.secondary} /></Sheet>
    <Hand x={460} y={800} text="small open models" at={tSmall} size={32} color={C.secondary} anchor="middle" />
    <Hand x={1470} y={800} text="top models of early 2025" at={tTop} size={32} color={C.secondary} anchor="middle" />
    <Hand x={960} y={640} text="every model tested lost ground" at={tEvery} size={42} anchor="middle" />
    <Stamp x={1600} y={330} text="EVEN 2 MESSAGES" sub={null} at={tTwo} size={44} rotate={-6} color={C.negative} />
    <Mono x={1600} y={460} text="follow-up test: GPT-4o and GPT-4o-mini" at={tTwo + 0.3} size={22} color={C.secondary} anchor="middle" />
    <Src text="Laban et al., ICLR 2026: 15 models, 6 tasks, simulated users" at={tThirty} />
  </Page>; };

// ---------------------------------------------------------------- S13 So it gets dumber? (ten runs each)
const ONE = [99, 97, 96, 95, 94, 93, 92, 91, 90, 88], SPREAD = [84, 79, 72, 66, 58, 51, 46, 40, 35, 31]; // illustrative dots
export const S13 = () => { const fr = useCurrentFrame();
  const tNot = cue(13, 'Not'), tTen = cue(13, 'ten'), tBest = cue(13, 'best', 0), tGap = cue(13, 'gap'), tDoubled = cue(13, 'doubled'), tNails = cue(13, 'nails'), tWrong = cue(13, 'wrong'), tBack = cue(13, 'back');
  const py = (v) => 860 - v * 6.2; const scatter = prog(fr, tGap - 0.3, 1.2);
  const face13 = fr >= f(tWrong) ? 'Concerned' : fr >= f(tNails) ? 'Awe' : 'Suspicious';
  return <Page>
    <Hero x={170} y={1080} h={430} at={0} bust body="Shirt" face={face13} shirt={C.you} />
    <Hand x={960} y={150} text="So it just gets dumber?" at={0.1} size={60} color={C.secondary} anchor="middle" />
    <Sheet>
      <Ink at={tTen - 0.4} dur={0.5} d={linePath(380, 860, 1540, 860, 1301, 0.8)} w={4} color={C.secondary} />
      {ONE.map((v, i) => <PopG key={i} at={tTen + i * 0.06} cx={640} cy={py(v)}><circle cx={560 + (i % 5) * 40} cy={py(v) + (i % 2) * 14} r={16} fill={C.accent} stroke={C.ink} strokeWidth={3} /></PopG>)}
      {SPREAD.map((v, i) => { const y0 = py(ONE[i]); const y1 = py(v); const yy = i === 0 ? py(84) : y0 + (y1 - y0) * scatter;
        return <PopG key={i} at={tBest + i * 0.05} cx={1280} cy={yy}><circle cx={1240 + (i % 3) * 40} cy={yy} r={16} fill={i >= 6 && fr >= f(tWrong) ? C.negative : C.callout} stroke={C.ink} strokeWidth={3} /></PopG>; })}
      <Ink at={tDoubled} dur={0.5} d={wob([[1400, py(84)], [1430, py(84)], [1430, py(31)], [1400, py(31)]], 1310, 1)} w={5} color={C.negative} />
      <Ink at={tGap} dur={0.4} d={wob([[760, py(99)], [790, py(99)], [790, py(88)], [760, py(88)]], 1311, 0.6)} w={5} color={C.secondary} />
    </Sheet>
    <Hand x={640} y={920} text="one message (10 runs)" at={tTen} size={36} color={C.accent} anchor="middle" />
    <Hand x={1280} y={920} text="spread out (10 runs)" at={tBest} size={36} color={C.callout} anchor="middle" />
    <Hand x={1460} y={py(84) - 34} text="best run: a little lower" at={tBest + 0.4} size={32} />
    <Hand x={1460} y={py(55)} text="gap more than doubled" at={tDoubled} size={34} color={C.negative} />
    <Hand x={330} y={420} text="sometimes it nails it" at={tNails} size={36} color={C.accent} />
    <Hand x={1620} y={py(35)} text="wrong turn" at={tWrong} size={36} color={C.negative} />
    <Label text="Illustrative dots; best-run drop about 16% and gap +112% from the study" at={tBest} />
  </Page>; };

// ---------------------------------------------------------------- S14 Not dumber (word card over a montage beat)
export const S14 = () => { const fr = useCurrentFrame(); const tBlunt = cue(14, 'blunt'), tLost = cue(14, 'lost'), tRec = cue(14, 'recover');
  return <AbsoluteFill style={{background: C.primary}}>
    <Montage src="roundabout.mp4" at={0} out={99} tint={0.6} />
    <Hand x={960} y={420} text="Not dumber." at={0.2} size={130} color="#FFFFFF" anchor="middle" />
    <Hand x={960} y={580} text="Less reliable." at={tBlunt} size={130} color={C.callout} anchor="middle" />
    <Hand x={960} y={760} text={'"they get lost and do not recover"'} at={tLost - 0.2} size={48} color={C.light} anchor="middle" />
    <Mono x={960} y={830} text="Laban et al., ICLR 2026, abstract" at={tRec} size={24} color={C.light} anchor="middle" />
  </AbsoluteFill>; };

// ---------------------------------------------------------------- S15 Answering too early
export const S15 = () => { const fr = useCurrentFrame();
  const tLook = cue(15, 'look'), tFirst = cue(15, 'First'), tCoding = cue(15, 'coding'), tJumped = cue(15, 'jumped'), tHalf = cue(15, 'half'), tWaited = cue(15, 'waited'), tStudent = cue(15, 'student'), tFin = cue(15, 'finished');
  const H = (v) => v * 5.2; const base = 820;
  const eh = H(30.9) * prog(fr, tJumped, 0.8), lh = H(64.4) * prog(fr, tWaited - 0.6, 0.8);
  return <Page>
    <Hand x={960} y={150} text="1. It answers too early" at={tFirst - 0.1} size={60} color={C.callout} anchor="middle" />
    <Sheet>
      <Ink at={tCoding} dur={0.4} d={linePath(240, base, 1000, base, 1501, 0.6)} w={4} color={C.secondary} />
      <rect x={330} y={base - eh} width={200} height={eh} fill={C.callout} stroke={C.ink} strokeWidth={3} />
      <rect x={700} y={base - lh} width={200} height={lh} fill={C.accent} stroke={C.ink} strokeWidth={3} />
      {/* eager pupil at a desk; the teacher's question sheet */}
      <Pupil x={1420} y={860} at={tStudent - 0.2} raise={fr >= f(tStudent + 0.3) ? 1 : 0} s={1.05} />
      <Paper x={1640} y={420} w={200} h={250} at={tStudent + 0.4} seed={1514} />
      {[0, 1, 2, 3].map((i) => <Ink key={i} at={tStudent + 0.6 + i * 0.1} dur={0.2} d={linePath(1662, 470 + i * 32, 1810 - (i % 2) * 40, 470 + i * 32, 1520 + i, 0.5)} w={4} color={C.secondary} />)}
    </Sheet>
    <Mono x={430} y={base - eh - 20} text="30.9" at={tJumped + 0.6} size={44} color={C.callout} anchor="middle" />
    <Mono x={800} y={base - lh - 20} text="64.4" at={tWaited} size={44} color={C.accent} anchor="middle" />
    <Hand x={430} y={base + 50} text="answered early" at={tJumped} size={32} anchor="middle" />
    <Hand x={800} y={base + 50} text="waited" at={tWaited - 0.3} size={32} anchor="middle" />
    <Hand x={620} y={300} text="less than half" at={tHalf} size={46} color={C.negative} anchor="middle" />
    <Hand x={1740} y={395} text="the question..." at={tFin - 0.3} size={28} color={C.secondary} anchor="middle" />
    <Mono x={620} y={base + 100} text="average score; code and maths tasks" at={tCoding} size={22} color={C.secondary} anchor="middle" />
    <Src text="Laban et al., Appendix F.1 (Table 6): first answer in the first vs last fifth of the chat" at={tCoding} />
    <Label text="A pattern in the data, not a controlled test; student is an illustration" at={tHalf} />
  </Page>; };

// ================================================================ CLIP D: causes, length, fairness
// ---------------------------------------------------------------- S16 Renovating (answer bloat)
export const S16 = () => { const fr = useCurrentFrame();
  const tSecond = cue(16, 'Second'), tRem = cue(16, 'Remember'), tHere = cue(16, 'Here'), tAdd = cue(16, 'add'), tStart = cue(16, 'start'), tRen = cue(16, 'renovates'), tEnd = cue(16, 'end'), tSev = cue(16, 'several'), tWorse = cue(16, 'worse');
  return <Page>
    <Hand x={960} y={150} text="2. It patches its old answer" at={tSecond - 0.1} size={60} color={C.callout} anchor="middle" />
    <Sheet>
      {/* the first answer: a small house */}
      <Ink at={tSecond + 0.3} dur={0.6} d={rectPath(760, 560, 280, 220, 1601, 1.5)} w={6} fill="#FFFFFF" fillAt={tSecond + 0.6} />
      <Ink at={tSecond + 0.6} dur={0.5} d={poly([[740, 565], [900, 430], [1060, 565]], 1602, 0.8)} w={6} />
      <Ink at={tSecond + 0.8} dur={0.4} d={rectPath(870, 680, 60, 100, 1603, 1)} w={5} fill="#C9A77C" fillAt={tSecond + 0.9} />
      <Ink at={tSecond + 0.6} dur={0.5} d={poly([[740, 565], [900, 430], [1060, 565], [740, 565]], 1604, 0.8)} w={6} fill="#B85C3C" fillAt={tSecond + 0.8} shade="l" />
      {[[790, 600], [960, 600]].map(([wx, wy], i) => <g key={i}><Ink at={tSecond + 0.9 + i * 0.1} dur={0.3} d={rectPath(wx, wy, 60, 50, 1605 + i, 0.8)} w={4} fill={C.you} fillAt={tSecond + 1.0} />
        <Ink at={tSecond + 1.0 + i * 0.1} dur={0.2} d={linePath(wx + 30, wy, wx + 30, wy + 50, 1607 + i, 0.3)} w={3} /></g>)}
      {/* the guess note on the door */}
      <PopG at={tHere} cx={900} cy={720}><rect x={872} y={694} width={56} height={46} fill={C.ai} stroke={C.ink} strokeWidth={3} transform="rotate(-6 900 717)" /></PopG>
      <Ink at={tHere + 0.1} dur={0.4} d={linePath(720, 835, 862, 748, 1630, 0.6)} w={4} color={C.callout} />
      <Ink at={tHere + 0.4} dur={0.2} d={poly([[838, 744], [864, 746], [856, 770]], 1631, 0.3)} w={4} color={C.callout} />
      {/* renovations */}
      <Ink at={tRen} dur={0.5} d={rectPath(1040, 620, 220, 160, 1610, 1.5)} w={6} fill={C.ai} fillAt={tRen + 0.3} shade="l" />
      <Ink at={tRen + 0.3} dur={0.3} d={rectPath(1110, 660, 70, 50, 1618, 0.8)} w={4} fill={C.you} fillAt={tRen + 0.4} />
      <Ink at={tRen + 0.4} dur={0.5} d={rectPath(560, 640, 200, 140, 1611, 1.5)} w={6} fill={C.ai} fillAt={tRen + 0.7} shade="x" />
      <Ink at={tRen + 0.5} dur={0.4} d={poly([[550, 645], [660, 580], [770, 645]], 1619, 0.8)} w={5} />
      <Ink at={tRen + 0.8} dur={0.4} d={rectPath(950, 380, 40, 90, 1612, 1)} w={5} />
      <Ink at={tEnd - 0.2} dur={0.5} d={rectPath(1260, 520, 180, 260, 1613, 1.5)} w={6} fill={C.ai} fillAt={tEnd + 0.1} shade="l" />
      {[0, 1].map((i) => <Ink key={i} at={tEnd + 0.1 + i * 0.1} dur={0.3} d={rectPath(1310, 570 + i * 90, 80, 55, 1620 + i, 0.8)} w={4} fill={C.you} fillAt={tEnd + 0.2} />)}
      <Ink at={tEnd} dur={0.4} d={poly([[1300, 520], [1340, 330], [1380, 520]], 1614, 0.8)} w={5} />
      <Ink at={tEnd + 0.2} dur={0.4} d={linePath(1460, 780, 1520, 420, 1615, 1)} w={5} color={C.secondary} />
      <Ink at={tEnd + 0.3} dur={0.4} d={rectPath(420, 700, 140, 80, 1616, 1.5)} w={5} fill={C.ai} fillAt={tEnd + 0.5} />
      <Ink at={tEnd - 0.5} dur={0.4} d={linePath(380, 780, 1560, 780, 1617, 0.8)} w={5} color={C.secondary} />
    </Sheet>
    <Hand x={400} y={430} text="its first answer" at={tSecond + 0.6} size={34} color={C.secondary} anchor="middle" />
    <Hand x={1320} y={870} text="new detail? add a wing" at={tAdd} size={36} color={C.callout} anchor="middle" />
    <Hand x={1640} y={300} text="up to several times longer" at={tSev - 0.1} size={38} color={C.negative} anchor="middle" />
    <Hand x={1640} y={350} text="and scored worse on average" at={tWorse - 0.3} size={34} color={C.negative} anchor="middle" />
    <Hand x={620} y={870} text="remember this guess?" at={tRem} size={36} color={C.callout} anchor="middle" />
    <Src text="Laban et al., Appendix F.2: final answers 20% to 300% longer than one-message answers" at={tSev - 0.2} />
    <Label text="Illustration" at={0.3} />
  </Page>; };

// ---------------------------------------------------------------- S17 The forgotten middle (turn-8 citations)
const CITE = [13, 8, 8, 10, 11, 12, 13, 20]; // % of citations in turn-8 summaries, by the turn a document was introduced (Fig. 10)
export const S17 = () => { const fr = useCurrentFrame();
  const tThird = cue(17, 'Third', 0), tTask = cue(17, 'task'), tEvery = cue(17, 'every'), tEighth = cue(17, 'eighth'), tLatest = cue(17, 'latest'), tSecond = cue(17, 'second'), tDim = cue(17, 'dim'), tMiddle = cue(17, 'middle', 2);
  const base = 800, X = (i) => 420 + i * 150;
  return <Page>
    <Hand x={960} y={150} text="3. The middle messages fade" at={tThird - 0.1} size={60} color={C.callout} anchor="middle" />
    {fr >= f(tDim) && <AbsoluteFill style={{background: `linear-gradient(90deg, transparent 22%, rgba(59,47,42,${0.12 * prog(fr, tDim, 0.6)}) 30%, rgba(59,47,42,${0.12 * prog(fr, tDim, 0.6)}) 70%, transparent 78%)`}} />}
    <Sheet>
      {CITE.map((v, i) => <PopG key={i} at={tTask + i * 0.12} cx={X(i) + 50} cy={300}><path d={rectPath(X(i), 270, 100, 56, 1700 + i, 1.2)} fill={C.you} stroke={C.ink} strokeWidth={3} /></PopG>)}
      <Ink at={tEighth - 0.3} dur={0.4} d={linePath(380, base, 1620, base, 1710, 0.6)} w={4} color={C.secondary} />
      {CITE.map((v, i) => { const h = v * 18 * prog(fr, tEighth + i * 0.08, 0.6); const hi = i === 7 ? C.accent : (i === 1 || i === 2) ? C.callout : C.rule;
        return <rect key={i} x={X(i) + 15} y={base - h} width={70} height={h} fill={hi} stroke={C.ink} strokeWidth={2.5} />; })}
    </Sheet>
    {CITE.map((v, i) => <Mono key={i} x={X(i) + 50} y={306} text={`#${i + 1}`} at={tTask + i * 0.12} size={26} anchor="middle" />)}
    <Hand x={960} y={240} text="a summary rewritten after every message" at={tEvery - 0.2} size={34} color={C.secondary} anchor="middle" />
    <Mono x={X(7) + 50} y={base - 20 * 18 - 20} text="20%" at={tLatest} size={36} color={C.accent} anchor="middle" />
    <Mono x={X(1) + 50} y={base - 8 * 18 - 20} text="8%" at={tSecond} size={32} color={C.callout} anchor="middle" />
    <Mono x={X(2) + 50} y={base - 8 * 18 - 20} text="8%" at={tSecond + 0.3} size={32} color={C.callout} anchor="middle" />
    <Hand x={960} y={870} text="share of citations in the summary written at message 8" at={tEighth} size={32} color={C.secondary} anchor="middle" />
    <Hand x={960} y={930} text="your middle messages" at={tMiddle} size={40} color={C.callout} anchor="middle" />
    <Src text="Laban et al., Appendix F.3 (Figure 10), averaged over 15 models" at={tEighth} />
  </Page>; };

// ---------------------------------------------------------------- S18 Think harder? (two crossed-out fixes)
export const S18 = () => { const fr = useCurrentFrame();
  const tTried = cue(18, 'tried'), tTwo = cue(18, 'two'), tThird = cue(18, 'third'), tSuspect = cue(18, 'suspect'), tTurn = cue(18, 'turning'), tFix = cue(18, 'fix');
  return <Page>
    <Hand x={960} y={160} text="Can't I just use a model that thinks harder?" at={0.1} size={52} color={C.secondary} anchor="middle" />
    <Sheet>
      <Card x={200} y={300} w={680} h={340} at={tTried} seed={1801} />
      <Card x={1040} y={300} w={680} h={340} at={tTurn - 0.2} seed={1802} />
      <Ink at={tTurn - 0.5} dur={0.5} d={linePath(240, 330, 840, 610, 1803, 1)} w={8} color={C.negative} />
      <Ink at={tTurn - 0.3} dur={0.5} d={linePath(840, 330, 240, 610, 1804, 1)} w={8} color={C.negative} />
      <Ink at={tFix} dur={0.5} d={linePath(1080, 330, 1680, 610, 1805, 1)} w={8} color={C.negative} />
      <Ink at={tFix + 0.2} dur={0.5} d={linePath(1680, 330, 1080, 610, 1806, 1)} w={8} color={C.negative} />
      {/* randomness dial */}
      <Ink at={tTurn} dur={0.5} d={ellPath(1380, 520, 70, 70, 1807, 1.2)} w={5} fill="#FFFFFF" fillAt={tTurn + 0.2} />
      {fr >= f(tTurn + 0.3) && <line x1={1380} y1={520} x2={1380 + 55 * Math.cos(Math.PI * (0.2 + 0.8 * prog(fr, tTurn + 0.4, 1)))} y2={520 - 55 * Math.sin(Math.PI * (0.2 + 0.8 * prog(fr, tTurn + 0.4, 1)))} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />}
      {/* longer answer scroll */}
      {fr >= f(tThird) && <><rect x={340} y={500} width={260} height={34} rx={5} fill={C.rule} stroke={C.ink} strokeWidth={2.5} />
        <rect x={340} y={555} width={260 + 87 * prog(fr, tThird, 0.8)} height={34} rx={5} fill={C.callout} stroke={C.ink} strokeWidth={2.5} /></>}
    </Sheet>
    <Hand x={540} y={370} text="use a thinking model" at={tTried} size={44} anchor="middle" />
    <Mono x={540} y={430} text="o3, DeepSeek-R1" at={tTwo} size={28} color={C.secondary} anchor="middle" />
    <Hand x={540} y={700} text="lost in similar ways" at={tTwo + 0.8} size={38} color={C.negative} anchor="middle" />
    <Mono x={328} y={526} text="usual" at={tThird} size={22} color={C.secondary} anchor="end" />
    <Mono x={328} y={581} text="thinking" at={tThird} size={22} color={C.callout} anchor="end" />
    <Hand x={700} y={588} text="~1/3 longer" at={tThird + 0.5} size={30} color={C.callout} />
    <Hand x={540} y={760} text="authors suspect: more room for guesses" at={tSuspect} size={30} color={C.secondary} anchor="middle" />
    <Hand x={1380} y={370} text="turn randomness to zero" at={tTurn} size={44} anchor="middle" />
    <Hand x={1380} y={700} text="still unreliable" at={tFix + 0.2} size={38} color={C.negative} anchor="middle" />
    <Mono x={1380} y={760} text="tested on GPT-4o and GPT-4o-mini" at={tFix + 0.4} size={24} color={C.secondary} anchor="middle" />
    <Src text="Laban et al., Sec. 6.1 and 7.2" at={tTried} />
  </Page>; };

// ---------------------------------------------------------------- S19 The backpack weighs too (length alone hurts)
export const S19 = () => { const fr = useCurrentFrame();
  const tSecond = cue(19, 'second'), tBack = cue(19, 'backpack'), tBench = cue(19, 'benchmark'), tHalf = cue(19, 'half'), tAnother = cue(19, 'Another'), tEvery = cue(19, 'every'), tTwo = cue(19, 'two'), tWrong = cue(19, 'Wrong'), tWeight = cue(19, 'weight');
  return <Page>
    <Sheet>
      <Walker x={300} y={880} s={1.3} at={0.1} pack={3 + 5 * prog(fr, tBack, 1.4)} packColor={C.ai} stagger={fr >= f(tBack) ? 1 : 0} mood={fr >= f(tBack) ? 'worried' : 'neutral'} />
      <Card x={600} y={220} w={560} h={430} at={tBench - 0.3} seed={1901} />
      <Card x={1240} y={220} w={560} h={430} at={tAnother - 0.2} seed={1902} />
    </Sheet>
    <Hand x={300} y={330} text="the backpack" at={tBack} size={40} color={C.secondary} anchor="middle" />
    <Mono x={880} y={260} text="NoLiMa, ICML 2025" at={tBench} size={26} color={C.secondary} anchor="middle" />
    <Sheet><Grid x={700} y={300} n={11} total={13} cols={5} size={56} gap={14} at={tHalf - 0.6} color={C.negative} step={0.06} /></Sheet>
    <Hand x={880} y={560} text="11 of 13 models fell below" at={tHalf} size={34} anchor="middle" />
    <Hand x={880} y={605} text="half their short-text score at 32K tokens" at={tHalf + 0.2} size={26} anchor="middle" />
    <Mono x={1520} y={260} text="Du et al., Findings of EMNLP 2025" at={tAnother} size={24} color={C.secondary} anchor="middle" />
    <Hand x={1520} y={380} text="the model found" at={tEvery - 0.4} size={40} anchor="middle" />
    <Hand x={1520} y={430} text="every fact it needed..." at={tEvery} size={40} anchor="middle" />
    <Hand x={1520} y={520} text="scores still fell 13.9% to 85%" at={tEvery + 0.6} size={36} color={C.negative} anchor="middle" />
    <Hand x={1520} y={565} text="as the input grew" at={tEvery + 0.8} size={32} color={C.negative} anchor="middle" />
    <Hand x={960} y={780} text="two strikes:" at={tTwo} size={48} anchor="middle" />
    <Hand x={960} y={850} text="wrong turns + sheer weight" at={tWrong} size={52} color={C.callout} anchor="middle" />
    <Label text="Benchmarks, not chats" at={tBench} />
  </Page>; };

// ---------------------------------------------------------------- S20 To be fair
export const S20 = () => { const fr = useCurrentFrame();
  const tFair = cue(20, 'fair'), tSim = cue(20, 'simulated'), tAnal = cue(20, 'analytical'), tTrans = cue(20, 'translation'), tMess = cue(20, 'messier'), tApps = cue(20, 'Apps'), tClaude = cue(20, 'Claude'), tSumm = cue(20, 'summarizes'), tFrees = cue(20, 'frees'), tNothing = cue(20, 'Nothing');
  const gauge = prog(fr, tFrees, 0.8);
  return <Page>
    <Hand x={960} y={140} text="To be fair to the AIs" at={tFair - 0.2} size={60} anchor="middle" />
    <Hand x={480} y={260} text="the study used" at={tSim - 0.3} size={40} color={C.secondary} anchor="middle" />
    <Hand x={480} y={340} text="• simulated users, not real people" at={tSim} size={36} anchor="middle" />
    <Hand x={480} y={410} text="• analytical tasks with checkable answers" at={tAnal} size={36} anchor="middle" />
    <Hand x={480} y={480} text="• translation (2 models): no drop" at={tTrans} size={36} color={C.accent} anchor="middle" />
    <Hand x={480} y={570} text="authors: real chats likely messier" at={tMess - 0.2} size={36} color={C.callout} anchor="middle" />
    <Sheet>
      <Card x={1080} y={260} w={700} h={300} at={tApps} seed={2001} />
      <rect x={1130} y={460} width={600} height={34} rx={6} fill="none" stroke={C.ink} strokeWidth={3} opacity={fr >= f(tSumm) ? 1 : 0} />
      <rect x={1132} y={462} width={596 * (1 - 0.55 * gauge)} height={30} rx={5} fill={C.callout} opacity={fr >= f(tSumm) ? 0.8 : 0} />
    </Sheet>
    <Hand x={1430} y={320} text="Claude (code execution on):" at={tClaude} size={34} anchor="middle" />
    <Hand x={1430} y={380} text="summarizes earlier messages" at={tSumm} size={36} color={C.accent} anchor="middle" />
    <Hand x={1430} y={430} text="near the limit" at={tSumm + 0.3} size={32} color={C.secondary} anchor="middle" />
    <Mono x={1430} y={530} text="context used" at={tSumm + 0.2} size={22} color={C.secondary} anchor="middle" />
    <Hand x={1430} y={610} text="frees up room" at={tFrees} size={40} color={C.accent} anchor="middle" />
    <Hand x={1380} y={760} text="undoes a wrong turn? nothing says so" at={tNothing + 0.2} size={36} color={C.negative} anchor="middle" />
    <Src text="Laban et al., Sec. 7.3 and 9; Anthropic Help Center 11647753" at={tSim} />
    <Label text="Our reading: the Help Center presents the summary as a way to keep long chats going" at={tNothing} />
  </Page>; };

// ================================================================ CLIP E: PART 3, the fix, the answer, the pointer
// ---------------------------------------------------------------- S21 Say it all up front (requirements merge into one message; the dial comes back)
const REQS = ['Python 3, not 2', 'read the CSV', 'skip empty rows', 'output a chart', 'keep it short'];
export const S21 = () => { const fr = useCurrentFrame();
  const tFirst = cue(21, 'First', 0), tKnow = cue(21, 'know'), tEvery = cue(21, 'every'), tMsg = cue(21, 'message'), tStudy = cue(21, 'study'), tBest = cue(21, 'best'), tSlow = cue(21, 'slower'), tFast = cue(21, 'faster'), tCorr = cue(21, 'corrections');
  const cardOut = tFirst - 0.3; const merge = prog(fr, tMsg - 0.2, 0.9);
  const face = fr >= f(tFast) ? 'Smile' : fr >= f(tSlow) ? 'Tired' : fr >= f(tEvery) ? 'Driven' : 'Calm';
  return <Page>
    <Hero x={260} y={1080} h={560} at={cardOut} bust body="Shirt" face={face} shirt={C.you} bob={2 * Math.sin(fr * 0.22)} />
    <Sheet>
      {/* five requirement notes fly into one long message */}
      {REQS.map((t, i) => { const x0 = 560 + (i % 3) * 230, y0 = 230 + Math.floor(i / 3) * 190, x1 = 640, y1 = 360 + i * 56;
        if (merge >= 1) return null;
        return <g key={i} opacity={1 - merge * 0.9}><Sticky x={x0 + (x1 - x0) * merge} y={y0 + (y1 - y0) * merge} w={200} h={130} at={tKnow + i * 0.15} fill={C.you} rot={[-5, 3, -2, 4, -4][i]} seed={2100 + i} /></g>; })}
      {fr >= f(tMsg - 0.2) && <Paper x={600} y={260} w={560} h={420} at={tMsg + 0.4} seed={2110} fill={C.you} />}
      <Gauge2 cx={1500} cy={640} r={200} at={tStudy - 0.2} value={fr < f(tBest) ? 61 : 61 + 39 * prog(fr, tBest, 1.2)} color={C.accent} />
    </Sheet>
    {REQS.map((t, i) => { const x0 = 560 + (i % 3) * 230, y0 = 230 + Math.floor(i / 3) * 190; return merge < 0.05 && <Hand key={i} x={x0 + 100} y={y0 + 74} text={t} at={tKnow + i * 0.15 + 0.1} size={28} anchor="middle" />; })}
    <Hand x={880} y={330} text="FULL: one message" at={tMsg + 0.6} size={40} color={C.accent} anchor="middle" />
    {REQS.map((t, i) => <Hand key={i} x={650} y={400 + i * 52} text={`• ${t}`} at={tMsg + 0.7 + i * 0.08} size={32} />)}
    <Hand x={1500} y={330} text="the study's best version" at={tStudy} size={38} color={C.accent} anchor="middle" />
    <Mono x={1500} y={740} text={fr >= f(tBest) ? `${Math.round(61 + 39 * prog(fr, tBest, 1.2))}` : '61'} at={tStudy} size={56} color={C.accent} anchor="middle" />
    <Hand x={880} y={790} text="slower to write..." at={tSlow - 0.1} size={42} color={C.secondary} anchor="middle" />
    <Hand x={880} y={860} text="...faster than an hour of corrections" at={tFast} size={42} anchor="middle" />
    <Src text="Laban et al., ICLR 2026: FULL (everything in the first message) scored best" at={tStudy} />
    <Label text="Example requirements; illustration" at={tKnow} />
    <PartCard n={3} text="How do you fix it?" at={0} out={cardOut} />
  </Page>; };

// ---------------------------------------------------------------- S22 Consolidate, fix, paste into a new chat
const ChatWin = ({x, y, w = 520, h = 520, at, title, seed, children}) => <g>
  <Paper x={x} y={y} w={w} h={h} at={at} seed={seed} fold={false} />
  <PopG at={at} cx={x + w / 2} cy={y + 25}><path d={rectPath(x, y, w, 50, seed + 1, 0.8)} fill={C.panel} stroke={C.ink} strokeWidth={3} />
    {[0, 1, 2].map((i) => <circle key={i} cx={x + 24 + i * 22} cy={y + 25} r={7} fill={[C.negative, C.hl, C.rule][i]} stroke={C.ink} strokeWidth={1.5} />)}</PopG>
  {children}
</g>;
export const S22 = () => { const fr = useCurrentFrame();
  const tSecond = cue(22, 'Second'), tRails = cue(22, 'rails'), tArgue = cue(22, 'argue'), tSugg = cue(22, 'suggest'), tPlease = cue(22, 'please'), tRead = cue(22, 'Read'), tFix = cue(22, 'fix'), tPaste = cue(22, 'paste'), tBrand = cue(22, 'brand'), tKeep = cue(22, 'keep'), tLeave = cue(22, 'leave');
  const slide = prog(fr, tPaste, 0.9);
  return <Page>
    <Sheet>
      <ChatWin x={90} y={170} at={tSecond} seed={2201}>
        <Msg x={120} y={250} w={300} at={tSecond + 0.1} seed={2210} />
        <Msg x={300} y={325} w={260} me at={tSecond + 0.2} seed={2211} />
        <Msg x={120} y={400} w={360} at={tSecond + 0.3} seed={2212} bug bugAt={tRails} />
        <Msg x={300} y={475} w={260} me at={tSecond + 0.4} seed={2213} />
        <Msg x={120} y={550} w={330} at={tRails} seed={2214} bug bugAt={tRails + 0.1} />
      </ChatWin>
      {fr >= f(tArgue) && fr < f(tSugg) && <Ink at={tArgue} dur={0.4} d={linePath(110, 190, 590, 670, 2220, 2)} w={9} color={C.negative} />}
      <ChatWin x={1340} y={170} at={tBrand - 0.4} seed={2260} />
      {/* the consolidated summary, checked and fixed */}
      <g transform={`translate(${slide * 650} 0)`}>
        <Paper x={700} y={300} w={500} h={360} at={tRead - 0.1} seed={2230} fill={C.you} />
        {[0, 1, 2, 3, 4].map((i) => <Ink key={i} at={tRead + i * 0.1} dur={0.25} d={linePath(740, 370 + i * 54, 1140 - (i % 2) * 60, 370 + i * 54, 2240 + i, 0.6)} w={6} color={C.accent} />)}
        {fr >= f(tFix) && <><Ink at={tFix} dur={0.3} d={linePath(735, 478, 1110, 478, 2250, 0.3)} w={5} color={C.negative} />
          <Ink at={tFix + 0.3} dur={0.3} d={linePath(745, 448, 1040, 448, 2251, 0.3)} w={6} color={C.accent} /></>}
      </g>
    </Sheet>
    <Hand x={350} y={740} text="off the rails? don't argue" at={tArgue - 0.1} size={38} color={C.negative} anchor="middle" />
    <Hand x={960} y={110} text={'"Please consolidate everything I\'ve told you so far"'} at={tPlease - 0.2} size={42} color={C.accent} anchor="middle" />
    <Hand x={950 + slide * 650} y={710} text="read it, fix it" at={tRead} size={36} color={C.secondary} anchor="middle" />
    <Hand x={1600} y={260} text="brand new chat" at={tBrand} size={36} color={C.secondary} anchor="middle" />
    <Hand x={960} y={860} text="keep your requirements" at={tKeep} size={46} color={C.accent} anchor="middle" />
    <Hand x={960} y={930} text="leave its wrong turns behind" at={tLeave} size={46} color={C.callout} anchor="middle" />
    <Src text="Laban et al., arXiv 2505.06120, Sec. 7.4 (suggested prompt)" at={tSugg} />
    <Label text="Generic chat windows (illustration)" at={tSecond} />
  </Page>; };

// ---------------------------------------------------------------- S23 Try again (fresh roll of the dice, drawn; the dots callback)
const Die = ({cx, cy, s = 120, n, at, rot = 0, seed}) => { const P = {1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]}[n];
  return <PopG at={at} cx={cx} cy={cy}><g transform={`rotate(${rot} ${cx} ${cy})`}>
    <Solid d={rectPath(cx - s / 2, cy - s / 2, s, s, seed, 1)} fill="#FFFFFF" w={5} />
    {P.map(([a, b], i) => <circle key={i} cx={cx + a * s * 0.27} cy={cy + b * s * 0.27} r={s * 0.08} fill={C.ink} />)}</g></PopG>; };
export const S23 = () => { const fr = useCurrentFrame();
  const tThird = cue(23, 'Third'), tTry = cue(23, 'try'), tRem = cue(23, 'Remember'), tBest = cue(23, 'best'), tFresh = cue(23, 'fresh', 0), tDice = cue(23, 'dice'), tPush = cue(23, 'pushing'), tHelp = cue(23, 'help'), tCure = cue(23, 'cure'), tPeople = cue(23, 'people'), tStop = cue(23, 'Stop'), tWrite = cue(23, 'write'), tStart = cue(23, 'start');
  const py = (v) => 820 - v * 5.4; const roll = fr >= f(tDice) ? Math.floor((fr - f(tDice)) / 4) : 0; const settled = fr >= f(tDice + 0.8);
  const face = fr >= f(tStart) ? 'SmileBig' : fr >= f(tCure) ? 'Smile' : fr >= f(tPush) ? 'Concerned' : 'Calm';
  return <Page>
    <Hand x={960} y={150} text="3. Just try again" at={tThird - 0.1} size={60} color={C.accent} anchor="middle" />
    <Sheet>
      <Ink at={tRem - 0.3} dur={0.5} d={linePath(240, 820, 900, 820, 2301, 0.8)} w={4} color={C.secondary} />
      {SPREAD.map((v, i) => <PopG key={i} at={tRem + i * 0.05} cx={570} cy={py(v)}><circle cx={430 + (i % 4) * 90} cy={py(v)} r={16} fill={C.callout} stroke={C.ink} strokeWidth={3} opacity={i < 3 ? 1 : 0.45} /></PopG>)}
      {fr >= f(tBest) && <Ink at={tBest} dur={0.5} d={ellPath(520, py(80), 150, 42, 2302, 1.5)} w={5} color={C.accent} />}
      <Die cx={1180} cy={470} n={settled ? 6 : 1 + (roll % 6)} at={tFresh - 0.2} rot={settled ? -8 : roll * 23} seed={2310} />
      <Die cx={1350} cy={520} n={settled ? 5 : 1 + ((roll + 3) % 6)} at={tFresh} rot={settled ? 10 : -roll * 31} seed={2311} />
    </Sheet>
    <Hero x={1690} y={1080} h={540} at={tThird} bust body="Shirt" face={face} shirt={C.you} bob={2 * Math.sin(fr * 0.2)} />
    <Hand x={570} y={300} text="the best runs were still good" at={tBest} size={38} color={C.accent} anchor="middle" />
    <Hand x={570} y={880} text="spread out (10 runs), from earlier" at={tRem} size={30} color={C.secondary} anchor="middle" />
    <Hand x={1265} y={340} text="fresh chat, same information" at={tFresh} size={36} anchor="middle" />
    <Hand x={1265} y={760} text="pushing on in a lost chat: no help" at={tPush} size={34} color={C.negative} anchor="middle" />
    <Hand x={960} y={940} text="stop. write it all down. start again." at={tStop - 0.1} size={52} color={C.accent} anchor="middle" />
    <Label text="Illustrative dots, as in part two" at={tRem} />
  </Page>; };

// ---------------------------------------------------------------- S24 Try it yourself (a checklist)
export const S24 = () => { const fr = useCurrentFrame();
  const tWord = cue(24, 'word'), tSide = cue(24, 'sideways'), tCons = cue(24, 'Consolidate'), tFresh = cue(24, 'fresh'), tComp = cue(24, 'compare'), tPaper = cue(24, 'paper'), tEvery = cue(24, 'every');
  const steps = [['consolidate', tCons], ['start fresh', tFresh], ['compare the answers', tComp]];
  return <Page>
    <Hand x={960} y={160} text="Don't take my word for it" at={tWord - 0.3} size={64} anchor="middle" />
    <Sheet>
      <Paper x={560} y={260} w={800} h={470} at={tSide - 0.2} seed={2401} />
      {steps.map(([t, at], i) => <g key={i}><Ink at={at - 0.2} dur={0.3} d={rectPath(640, 340 + i * 120, 60, 60, 2410 + i, 1)} w={5} fill="#FFFFFF" fillAt={at} />
        <Ink at={at + 0.2} dur={0.35} d={wob([[652, 370 + i * 120], [668, 390 + i * 120], [694, 344 + i * 120]], 2420 + i, 1)} w={8} color={C.accent} /></g>)}
    </Sheet>
    <Hero x={1650} y={1080} h={600} at={tWord} bust body="Shirt" face={fr >= f(tComp) ? 'Smile' : 'Driven'} shirt={C.you} />
    <Hand x={960} y={315} text="next time a chat goes sideways" at={tSide} size={36} color={C.secondary} anchor="middle" />
    {steps.map(([t, at], i) => <Hand key={i} x={740} y={385 + i * 120} text={`${i + 1}. ${t}`} at={at} size={50} />)}
    <Hand x={960} y={850} text="paper + every number: in the description" at={tPaper} size={42} color={C.accent} anchor="middle" />
  </Page>; };

// ---------------------------------------------------------------- S25 The answer (callback to the opening desk, then the word card)
export const S25 = () => { const fr = useCurrentFrame();
  const tMist = cue(25, 'mistake'), tStub = cue(25, 'stubbornness'), tOld = cue(25, 'old'), tSit = cue(25, 'sitting'), tFact = cue(25, 'fact'), tArgue = cue(25, 'argue'), tFresh = cue(25, 'fresh');
  const card = fr >= f(tArgue - 0.4); const cOp = prog(fr, tArgue - 0.4, 0.4);
  const face = fr >= f(tFact) ? 'Concerned' : fr >= f(tStub) ? 'Serious' : 'Calm';
  const LX = 860, LY = 170;
  return <Page>
    <Sheet><DeskRoom at={0} deskY={800} part="wall" /></Sheet>
    <Hero x={470} y={1020} h={760} at={0} bust body="Shirt" face={face} shirt={C.you} bob={2 * Math.sin(fr * 0.25)} />
    <Sheet>
      <DeskRoom at={0} deskY={800} part="desk" />
      <Laptop x={LX} y={LY} at={0} />
      <defs><clipPath id="scr25"><rect x={LX + 15} y={LY + 75} width={730} height={385} /></clipPath></defs>
      <g clipPath="url(#scr25)"><g transform={`translate(${LX - 560} ${LY - 300})`}>
        {[0, 1, 2, 3, 4, 5].map((i) => <Msg key={i} x={i % 2 ? 900 : 600} y={390 + i * 75} w={i % 2 ? 300 : 420} me={i % 2 === 1} at={0.1 + i * 0.05} seed={2500 + i} bug={i === 0 || i === 4} bugAt={tOld} />)}
      </g></g>
      {fr >= f(tOld) && <Ink at={tOld} dur={0.5} d={ellPath(LX + 380, LY + 140, 260, 60, 2520, 2)} w={6} color={C.callout} />}
    </Sheet>
    <Hand x={1240} y={125} text="not stubbornness" at={tStub} size={44} color={C.secondary} anchor="middle" rotate={-2} />
    <Hand x={1240} y={900} text="an old wrong turn, still in the chat" at={tSit - 0.2} size={48} color={C.negative} anchor="middle" />
    <Hand x={1240} y={960} text="...read as fact" at={tFact} size={44} color={C.negative} anchor="middle" />
    {card && <AbsoluteFill style={{background: C.primary, opacity: cOp}}>
      <Hand x={960} y={470} text="Don't argue with a lost chat." at={tArgue - 0.2} size={96} color="#FFFFFF" anchor="middle" />
      <Hand x={960} y={620} text="Start a fresh one." at={tFresh - 0.2} size={110} color={C.light} anchor="middle" />
    </AbsoluteFill>}
  </Page>; };

// ---------------------------------------------------------------- S26 Watch next (points to the YouTube end-screen element top-right; that area stays empty)
export const S26 = () => { const fr = useCurrentFrame();
  const tWant = cue(26, 'want'), tLimit = cue(26, 'limit'), tLast = cue(26, 'last'), tUp = cue(26, 'up');
  return <Page>
    <Hero x={380} y={1060} h={900} at={0.1} body="PointingFingerWB" face={fr >= f(tLast) ? 'SmileBig' : 'Smile'} shirt={C.you} />
    <Sheet>
      {fr >= f(tUp - 0.5) && <Ink at={tUp - 0.5} dur={0.6} d={wob([[760, 640], [900, 560], [1060, 470], [1180, 420]], 2601, 2)} w={7} color={C.accent} />}
      {fr >= f(tUp) && <Ink at={tUp} dur={0.3} d={wob([[1130, 400], [1185, 418], [1150, 465]], 2602, 1)} w={7} color={C.accent} />}
    </Sheet>
    <Hand x={720} y={760} text="why long chats also eat" at={tWant} size={48} anchor="start" />
    <Hand x={720} y={830} text="your usage limit" at={tLimit - 0.2} size={56} color={C.callout} anchor="start" />
    <Hand x={720} y={910} text="watch next" at={tLast} size={44} color={C.accent} anchor="start" />
  </Page>; };
