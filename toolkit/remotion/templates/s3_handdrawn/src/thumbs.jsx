// LongChat thumbnails (rendered at 1920x1080, scaled to 1280x720). Video identity: Espresso & Denim, Kalam, Open Peeps hero.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, HAND, MONO} from './lib';
import {Page, Sheet, Hand, rectPath, wob} from './draw';
import {Laptop} from './kit';
import {Hero, DeskRoom, Gauge2, Solid, Paper} from './polish';

const Bub = ({x, y, w, me, seed, op = 1, bug, rot = 0}) => <g opacity={op} transform={`rotate(${rot} ${x + w / 2} ${y + 40})`}>
  <path d={rectPath(x + 7, y + 10, w, 80, seed, 1.4)} fill={C.ink} opacity={0.13} />
  <path d={rectPath(x, y, w, 80, seed, 1.4)} fill={me ? C.you : C.ai} stroke={C.ink} strokeWidth={5} />
  {[0, 1].map((i) => <path key={i} d={rectPath(x + 26, y + 24 + i * 22, w - 90 - i * 50, 6, seed + i, 0.3)} fill={C.secondary} />)}
  {bug && <g transform={`translate(${x + w - 40} ${y + 40})`}><ellipse rx={20} ry={15} fill={C.callout} stroke={C.ink} strokeWidth={4} />
    {[-1, 1].map((s) => [-9, 0, 9].map((dx) => <line key={`${s}${dx}`} x1={dx} y1={s * 13} x2={dx + s * 5} y2={s * 25} stroke={C.ink} strokeWidth={3.5} />))}</g>}
</g>;
const T = (p) => <Hand at={0} dur={0.01} weight={700} {...p} />;

export const ThumbA = () => <Page drift={0}>
  <Sheet>{[0, 1, 2, 3, 4, 5].map((i) => <Bub key={i} x={i % 2 ? 1300 : 1080} y={90 + i * 128} w={i % 2 ? 480 : 520} me={i % 2 === 1} seed={50 + i}
    op={1 - i * 0.12} rot={i > 2 ? (i % 2 ? 3 : -4) * (i - 2) : 0} bug={i === 0 || i === 5} />)}</Sheet>
  <Hero x={330} y={1080} h={640} at={0} bust body="Shirt" face="Concerned" shirt={C.you} />
  <T x={70} y={150} text="LONG CHAT" size={180} color={C.ink} />
  <T x={70} y={330} text="= DUMBER?" size={180} color={C.callout} />
  <T x={560} y={800} text="-39%" size={210} color={C.negative} rotate={-6} />
</Page>;

export const ThumbB = () => <Page drift={0}>
  <Hero x={360} y={1080} h={760} at={0} bust body="Shirt" face="Awe" shirt={C.you} />
  <T x={1180} y={400} text="-39%" size={460} color={C.callout} anchor="middle" />
  <T x={1180} y={720} text="SAME AI. LONGER CHAT." size={96} color={C.ink} anchor="middle" />
</Page>;

export const ThumbC = () => <Page drift={0}>
  <Sheet>
    <Gauge2 cx={500} cy={720} r={330} at={0} value={100} color={C.accent} />
    <Gauge2 cx={1400} cy={720} r={330} at={0} value={61} color={C.callout} />
  </Sheet>
  <T x={960} y={140} text="SAME AI?" size={200} color={C.ink} anchor="middle" />
  <T x={500} y={870} text="all at once" size={110} color={C.accent} anchor="middle" />
  <T x={1400} y={870} text="bit by bit" size={110} color={C.callout} anchor="middle" />
</Page>;

export const ThumbD = () => <Page drift={0}>
  <Sheet><DeskRoom at={0} deskY={860} part="wall" /></Sheet>
  <Hero x={380} y={1080} h={760} at={0} bust body="Shirt" face="Tired" shirt={C.you} />
  <Sheet><DeskRoom at={0} deskY={860} part="desk" />
    <Laptop x={880} y={300} at={0} />
    <Bub x={960} y={420} w={560} seed={71} />
    <Bub x={1060} y={530} w={500} me seed={72} />
    <Bub x={960} y={640} w={600} seed={73} bug />
  </Sheet>
  <Sheet><Paper x={170} y={40} w={1580} h={200} at={0} seed={91} fold={false} /></Sheet>
  <T x={960} y={140} text="IT'S BACK. AGAIN." size={170} color={C.negative} anchor="middle" rotate={-2} />
</Page>;
