# One-off: derive pilot_room10.jsx (spec-driven) from pilot_room8.jsx. Kept for the record of what moved into the spec.
import re
s = open('/home/claude/twice/remotion/src/scrolls/pilot_room8.jsx').read()
def rep(a, b):
    global s
    assert a in s, a[:80]; s = s.replace(a, b)
def sub(pat, b):
    global s
    n = len(re.findall(pat, s, flags=re.S)); assert n == 1, (pat[:60], n); s = re.sub(pat, lambda m: b, s, flags=re.S)

rep("""import React from 'react';
import {AbsoluteFill, Img, Audio, staticFile, useCurrentFrame, interpolate, Easing, random} from 'remotion';
import {flick, Grain, SR, SI, MO, IN} from '../cave/vw.jsx';
import {Puppet, walkPose} from './puppet.jsx';
import WR from './walker_rig8.json';
import PL from './pilot8_place.json';
import WORDS from './pilot8_words.json';""",
"""// Pilot v10: the same scene driven entirely by the scene spec (scene/room.scene.json) through scene/core.mjs.
// Positions, sizes, timings, poses, camera and devices come from the spec; the validator (scene/validate.mjs) checks
// the very same numbers before any render.
import React from 'react';
import {AbsoluteFill, Img, Audio, staticFile, useCurrentFrame, random, getInputProps} from 'remotion';
import {flick, Grain, SR, SI, MO, IN} from '../cave/vw.jsx';
import {Puppet} from './puppet.jsx';
import WR from './walker_rig8.json';
import PL from './pilot8_place.json';
import WORDS from './pilot8_words.json';
import SPEC from './scene/room.scene.json';
import {makeScene, ramp, lin, fade} from './scene/core.mjs';
const SC = makeScene(SPEC, WORDS, {'walker_rig8.json': WR}, PL), LIB = SC.character('librarian');""")
rep("export const PILOT8_DUR = 459;", "export const PILOT10_DUR = Math.round(SPEC.duration * SPEC.fps);")
sub(r"const ez = Easing\.bezier.*?\nconst fade = [^\n]*\n", "")
sub(r"const LINES = \[.*?const tw = [^\n]*\n", "const tw = (id, w, k = 0) => SC.time(`${id}.${w}${k ? '#' + k : ''}`);\n")
rep("""const PXM = PL.mpx, CX = 4.35, FLOOR = PL.floor;
const LANE = {wall: [1.0, 0], near: [1.03, 50], mid: [1.05, 90]};
const LX = (x, l) => 1920 + (x - CX) * PXM * LANE[l][0];""", "const PXM = SC.PXM, FLOOR = SC.FLOOR, LX = SC.X;")
rep("const scr = (cam, X, Y, p = 1) => { const s = BASE * Math.pow(cam.z, p); return {x: 960 + (X - cam.x) * s, y: 540 + (Y - cam.y) * s, s}; };",
    "const scr = (cam, X, Y, p = 1) => SC.screen(cam, [X, Y], p);")
sub(r"const \[CBX, CBY, CBW\] = PL\.cabinet.*?const SHEET_C = at\(0\.5, 0\.52\);",
"""const CAB = SC.box('cabinet'), CBX = CAB.x, CBY = CAB.y, CBW = CAB.w, CBH = CAB.h, CBC = CBX + CBW / 2, MPX = SC.stand.m;
const {B, at} = SC.stand, BY = B.bl[1], TY = B.tl[1];
const poly = (pts) => pts.map((p) => p.join(',')).join(' ');
const SHEET_C = SC.stand.sheet;""")
rep("const SD = 0.55 * 2 * 58;   // scroll diameter on screen-plate px: 0.55 of the rack's scroll ends (they're drawn oversized in the rack art)",
    "const SD = SPEC.props[0].diameter * MPX;   // the scroll's diameter from the spec (one size in every state)")
i = s.index("const Roller = "); j = s.index("// the cabinet under the stand")
s = s[:i] + '''const vdir = (() => { const a = at(0, 0), b = at(0, 1), L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / L, (b[1] - a[1]) / L, L]; })();
// a roller lies along the board's slope at position u (the scroll lies across the board and opens sideways); d = diameter
const Roller = ({u, d}) => { const a = at(u, 0.06), b = at(u, 0.94), ang = Math.atan2(vdir[1], vdir[0]) * 180 / Math.PI, L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
    <rect x={-18} y={-5} width={L + 36} height={10} fill={WOOD2} stroke="#000" strokeWidth={2.5} />
    <rect x={0} y={-d / 2} width={L} height={d} rx={d * 0.3} fill={SHEET} stroke="#000" strokeWidth={3} />
    <ellipse cx={0} cy={0} rx={d * 0.3} ry={d / 2} fill={SHEET} stroke="#000" strokeWidth={2.5} />
    <circle cx={0} cy={0} r={d * 0.13} fill="none" stroke="#3a2a22" strokeWidth={2.5} /><circle cx={0} cy={0} r={d * 0.05} fill="#3a2a22" /></g>; };
const Tag = ({x, y, s = 1}) => <g><line x1={x} y1={y} x2={x} y2={y + 14 * s} stroke="#3a2a22" strokeWidth={2 * s} />
  <rect x={x - 6 * s} y={y + 14 * s} width={12 * s} height={26 * s} fill="#B8322B" stroke="#000" strokeWidth={2 * s} /></g>;
const Stand = ({laid, unroll}) => { const u0 = 0.06, ur = u0 + 0.88 * unroll, dL = SD * (1 - 0.38 * unroll), dR = SD * 0.62 * Math.min(1, unroll * 3);
  const parts = {...Object.fromEntries(Object.values(SC.stand.legs).map((l) => [l.id, <rect key={l.id} x={l.x} y={l.y} width={l.w} height={l.h} fill={l.layer === 'back' ? WOOD2 : WOOD} stroke="#000" strokeWidth={2.5} />])),
    ...Object.fromEntries(Object.values(SC.stand.bars).map((b) => [b.id, <rect key={b.id} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.layer === 'back' ? WOOD2 : WOOD} stroke="#000" strokeWidth={2.5} />])),
    board: <g key="board"><polygon points={poly([B.bl, B.br, [B.br[0], B.br[1] + SC.stand.thick], [B.bl[0], B.bl[1] + SC.stand.thick]])} fill={WOOD2} stroke="#000" strokeWidth={3} strokeLinejoin="round" />
      <polygon points={poly([B.tl, B.tr, B.br, B.bl])} fill={WOOD} stroke="#000" strokeWidth={3} strokeLinejoin="round" /></g>};
  return <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <defs><clipPath id="sheet10"><polygon points={poly([at(u0, 0.08), at(ur, 0.08), at(ur, 0.92), at(u0, 0.92)])} /></clipPath></defs>
    {SC.stand.draw.map((id) => parts[id])}
    {laid > 0 && <g opacity={laid}>
      {unroll > 0 && <polygon points={poly([at(u0, 0.08), at(ur, 0.08), at(ur, 0.92), at(u0, 0.92)])} fill={SHEET} stroke="#000" strokeWidth={2.5} />}
      {unroll > 0 && <g clipPath="url(#sheet10)">{MARKS.map((m, i) => <polygon key={i} points={poly([at(m.u, m.v), at(m.u + m.wl, m.v), at(m.u + m.wl, m.v + m.hh), at(m.u, m.v + m.hh)])} fill={INK} />)}</g>}
      {unroll > 0.02 && <Roller u={ur} d={dR} />}
      <Roller u={u0} d={dL} />
      <Tag x={at(u0, 0.06)[0]} y={at(u0, 0.06)[1] - 4} /></g>}
  </svg>; };

''' + s[j:]
rep("const Cabinet = () => { const H = PL.cabinet[3],", "const Cabinet = () => { const H = CBH,")
sub(r"// ---- the librarian's timeline.*?const T = \{[^\n]*\};\n",
    "const TAKE_SLOT = (() => { const m = SPEC.props[0].states[0].at.match(/slot\\[(\\d+),(\\d+)\\]/); return SC.slot('rackC', +m[1], +m[2]); })();\n")
sub(r"// ---- the camera: a chain of shots.*?  return c; \};\n", "export const camAt = SC.camAt;\n")
sub(r"  // librarian\n.*?  const wOff = [^\n]*\n",
"""  const st = LIB.state(t), wx = st.px, wy = st.py, WS = st.WS, wp = st.pose, wOff = st.offset, held = st.held, laid = st.laid;
  const T = {grab: LIB.at('grab'), unrollA: LIB.at('release') + 0.08, unrollB: LIB.at('release') + 1.28};
""")
rep("const [rcx, rcy] = PL.rackC, take = PL.discs[TAKE];", "const take = TAKE_SLOT, RC = SC.box('rackC');")
rep("<ellipse cx={rcx + take[0]} cy={rcy + take[1]} rx={take[2] + 3} ry={take[3] + 3} fill={cub} />", "<ellipse cx={take.x} cy={take.y} rx={take.rx + 3} ry={take.ry + 3} fill={cub} />")
rep("<circle key={i} cx={rcx + x} cy={rcy + y}", "<circle key={i} cx={RC.x + x} cy={RC.y + y}")
rep("export const PilotRoom8 = () => {", """const DEV = Object.fromEntries(SPEC.devices.map((d) => [d.id, d]));
const dT = (id) => [SC.time(DEV[id].t0), SC.time(DEV[id].t1)];
// debug overlay (--props '{"debug":true}'): the validator's hand point and rack C's top-row slots, to prove render and checks agree
const DebugMarks = ({t}) => { const cam = camAt(t), h = SC.screen(cam, LIB.hand(t), 1.03), sl = [0, 1, 2].map((k) => SC.screen(cam, [SC.slot('rackC', 0, k).x, SC.slot('rackC', 0, k).y], 1));
  const ft = LIB.feet(t).map((p) => SC.screen(cam, p, 1.03)), bb = SC.screenBox(cam, LIB.bbox(t), 1.03);
  return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}><circle cx={h.x} cy={h.y} r={10} fill="none" stroke="#0f0" strokeWidth={4} />
    {ft.map((p, k) => <circle key={k} cx={p.x} cy={p.y} r={7} fill="#0ff" />)}<rect x={bb.x} y={bb.y} width={bb.w} height={bb.h} fill="none" stroke="#ff0" strokeWidth={2} />
    {sl.map((p, k) => <g key={k}><circle cx={p.x} cy={p.y} r={8} fill="#f0f" /><text x={p.x + 10} y={p.y} fill="#f0f" fontSize={22}>{k}</text></g>)}</svg>; };
export const PilotRoom10 = () => {""")
rep("<ChapterTag o={ramp(t, 1.6, 2.3) * (1 - toNile)} />", "<ChapterTag o={fade(t, dT('chapter')[0], dT('chapter')[1] - dT('chapter')[0], 0.7, 0.5)} />")
rep('<PlaceTag t={t} at={2.0} dur={tC - 2.0} text="HERCULANEUM · 79 AD" />', "<PlaceTag t={t} at={dT('place')[0]} dur={dT('place')[1] - dT('place')[0]} text=\"HERCULANEUM · 79 AD\" />")
rep("<WordCard t={t} at={tw('lib5', 'not')} dur={tC - tw('lib5', 'not') + 0.2} />", "<WordCard t={t} at={dT('wordcard')[0]} dur={dT('wordcard')[1] - dT('wordcard')[0]} />")
rep("background: 'rgba(8,10,14,0.7)', padding: '4px 8px'}}>{left}", "background: `rgba(8,10,14,${DEV.credit_l.bg})`, padding: '4px 8px'}}>{left}")
rep("background: 'rgba(8,10,14,0.7)', padding: '4px 8px'}}>{right}", "background: `rgba(8,10,14,${DEV.credit_r.bg})`, padding: '4px 8px'}}>{right}")
rep("    <Grain a={0.03} />\n  </AbsoluteFill>; };", "    <Grain a={0.03} />\n    {getInputProps().debug && <DebugMarks t={t} />}\n  </AbsoluteFill>; };")
for bad in ['walkPose', 'interpolate', 'Easing', 'PL.cabinet', 'W1', 'W2.', 'TAKE]']:
    assert bad not in s, bad
open('/home/claude/twice/remotion/src/scrolls/pilot_room10.jsx', 'w').write(s)
print('ok')
