// Kit sheet: every reusable drawing piece on one frame, for reference when planning scenes.
import React from 'react';
import {C} from './lib';
import {Page, Sheet, Hand, Mono, Stamp, rectPath} from './draw';
import {Laptop} from './kit';
import {Hero, DeskRoom, Gauge2, Solid, Paper, Sticky, Walker, Pupil, poly} from './polish';
const L = ({x, y, t}) => <Mono x={x} y={y} text={t} at={0} dur={0.01} size={22} color={C.secondary} anchor="middle" />;
export const KitSheet = () => <Page drift={0}>
  <Sheet>
    <Paper x={60} y={60} w={300} h={200} at={0} seed={1} />
    <Sticky x={420} y={80} w={170} h={150} at={0} fill={C.you} rot={-4} seed={2} />
    <Sticky x={620} y={80} w={170} h={150} at={0} fill={C.ai} rot={4} seed={3} />
    <Gauge2 cx={1010} cy={250} r={150} at={0} value={61} color={C.callout} />
    <Solid d={poly([[1260, 260], [1380, 120], [1500, 260], [1260, 260]], 4, 0.6)} fill="#B85C3C" />
    <Solid d={rectPath(1290, 260, 180, 130, 5, 1)} fill="#FFFFFF" />
    <Walker x={1720} y={420} s={1} at={0} pack={3} packColor={C.ai} />
    <Laptop x={60} y={470} at={0} />
    <Pupil x={1500} y={960} at={0} raise={1} s={0.9} />
  </Sheet>
  <Hero x={1050} y={1000} h={480} at={0} bust body="Shirt" face="Smile" shirt={C.you} />
  <Stamp x={1720} y={620} text="STAMP" sub={null} at={0} size={44} rotate={-6} />
  <L x={210} y={290} t="Paper" /><L x={605} y={270} t="Sticky (you / AI)" /><L x={1010} y={300} t="Gauge2" /><L x={1380} y={420} t="poly (straight edges) + Solid" />
  <L x={1720} y={450} t="Walker (+ pack)" /><L x={440} y={440} t="Laptop (kit.jsx)" /><L x={1050} y={1030} t="Hero (Open Peeps, CC0)" /><L x={1500} y={990} t="Pupil" />
</Page>;
