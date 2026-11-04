// "Folk II" rig (5 Nov 2026, Sam's option 4): a redrawn body at about 7.5 heads tall (rig3 was about 4.3), with a small
// face, tapered limbs drawn as shapes (not stroked lines), mitten hands with a thumb, clothes cut as garments (collar,
// sleeve, cuff, trouser crease) and one consistent light from the left (shade on the right-hand planes).
// Same props as rig3's Rig (look, face, mouth, blink, pose, walk, turn, bob, eyeLook, frontItem, backItem), so scenes can
// switch with a one-line import change. Origin = between the feet on the ground; about 620 units tall before `s`.
// The head reuses rig3's face set (expressions + Rhubarb mouths) at 0.55 scale, so lip sync keeps working.
import React from 'react';
import {shade, tint, FACE, Hair, Hat, Beard, Eyes, Mouth} from './rig3';

const rad = (d) => (d * Math.PI) / 180;
const seg = (x, y, len, deg) => [x + len * Math.sin(rad(deg)), y + len * Math.cos(rad(deg))];
// a tapered limb segment from p to q, width w1 -> w2, with round ends
const limb = ([x1, y1], [x2, y2], w1, w2) => { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const q = (x, y, w, k) => `${x + nx * w / 2 * k} ${y + ny * w / 2 * k}`;
  const circ = (x, y, r) => `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  return `M ${q(x1, y1, w1, 1)} L ${q(x2, y2, w2, 1)} L ${q(x2, y2, w2, -1)} L ${q(x1, y1, w1, -1)} Z ` + circ(x1, y1, w1 / 2) + ' ' + circ(x2, y2, w2 / 2); };
const Hand = ({x, y, ang, skin}) => <g transform={`translate(${x} ${y}) rotate(${-ang})`}>
  <ellipse cx="-7" cy="5" rx="5" ry="8.5" fill={skin} /><ellipse cx="1" cy="11" rx="10.5" ry="13" fill={skin} /><path d="M -4 16 L 6 18" stroke="rgba(0,0,0,0.12)" strokeWidth="2" /></g>;

// arm: a = outward swing from hanging, b = elbow bend; sleeve to the elbow when `rolled`, else to the wrist
const Arm = ({side, a, b, top, skin, item, rolled, dark, f}) => { const sx = side * (f ? 37 : 44), sy = -494;
  const [ex, ey] = seg(0, 0, 112, a), [hx, hy] = seg(ex, ey, 100, a + b);
  const P = (px, py) => [sx + side * px, sy + py];
  const S = P(0, 0), E = P(ex, ey), H = P(hx, hy), cuff = P(ex + (hx - ex) * 0.12, ey + (hy - ey) * 0.12);
  const sleeve = dark ? shade(top, 0.8) : top, sk = dark ? shade(skin, 0.88) : skin;
  return <g>
    <path d={limb(E, H, 21, 16)} fill={rolled ? sk : sleeve} />
    {rolled && <path d={limb(E, cuff, 24, 23)} fill={shade(sleeve, 0.92)} />}
    <path d={limb(S, E, 28, 22)} fill={sleeve} />
    <Hand x={H[0]} y={H[1]} ang={(a + b) * side} skin={sk} />
    {item && item(H[0], H[1] + 6, side)}
  </g>; };

const Leg = ({side, a, b, color, shoe, dark}) => { const hx = side * 19, hy = -290;
  const [kx, ky] = seg(hx, hy, 145, a), [ax, ay] = seg(kx, ky, 135, a - b);
  const c = dark ? shade(color, 0.82) : color;
  return <g>
    <path d={limb([kx, ky], [ax, ay], 27, 20)} fill={c} />
    <path d={limb([hx, hy], [kx, ky], 36, 28)} fill={c} />
    <path d={`M ${kx + 4} ${ky - 60} L ${kx + 2} ${ky + 60}`} stroke={shade(c, 0.9)} strokeWidth="2" />
    <path d={`M ${ax - 13} ${ay - 4} C ${ax - 14} ${ay - 18} ${ax + 14} ${ay - 18} ${ax + 30} ${ay - 2} C ${ax + 36} ${ay + 8} ${ax + 26} ${ay + 11} ${ax + 12} ${ay + 11} L ${ax - 13} ${ay + 11} Z`} fill={shoe} />
  </g>; };

export const Rig = ({x, y, s = 1, look, face = 'neutral', mouth = 'X', blink = 0, pose = {}, walk = null, turn = 1, bob = 0, eyeLook = 0, frontItem, backItem}) => {
  const {skin, hair, hairColor, top, bottom, shoe = '#2A2522', ink = '#1F1B16', glasses, earrings, robe, collar, hat, hatColor, beard, tie, apron, rolled = !!apron, build} = look; const F = build === 'f';
  const td = shade(top, 0.82), tl = tint(top, 0.14);
  let {fa = 6, fb = 8, ba = 6, bb = 8, tilt = 0, lean = 0} = pose;
  let la = 0, lb = 0, ra = 0, rb = 0;
  if (walk !== null) { const p = walk;
    la = 22 * Math.sin(p); ra = -22 * Math.sin(p);
    lb = 30 * Math.max(0, Math.sin(p - Math.PI / 2)) + 5; rb = 30 * Math.max(0, Math.sin(p + Math.PI / 2)) + 5;
    fa = 10 - 14 * Math.sin(p); ba = 10 + 14 * Math.sin(p); fb = 12; bb = 12; }
  const legH = (a, b) => 145 * Math.cos(rad(a)) + 135 * Math.cos(rad(a - b));
  const drop = 280 - Math.max(legH(la, lb), legH(ra, rb)) - 8;
  const sx = Math.max(Math.abs(turn), 0.06) * Math.sign(turn || 1);
  return <g transform={`translate(${x} ${y}) scale(${s * sx} ${s})`}>
    <ellipse cx="0" cy="2" rx="70" ry="9" fill="#000" opacity="0.10" />
    <g transform={`translate(0 ${drop})`}>
      <Leg side={-1} a={ra} b={rb} color={bottom} shoe={shoe} dark />
      <g transform={`rotate(${lean} 0 -290) translate(0 ${-bob})`}>
        <Arm side={-1} a={ba} b={bb} top={top} skin={skin} item={backItem} rolled={rolled} dark f={F} />
        <Leg side={1} a={la} b={lb} color={bottom} shoe={shoe} />
        {/* trousers' seat and belt line */}
        <path d={F ? "M -46 -334 L 46 -334 L 52 -276 C 22 -266 -22 -266 -52 -276 Z" : "M -45 -330 L 45 -330 L 47 -276 C 20 -268 -20 -268 -47 -276 Z"} fill={bottom} />
        <rect x="-45" y="-334" width="90" height="10" rx="3" fill={shade(bottom, 0.75)} />
        {/* torso as a garment: shoulders, slight waist, hem; shade plane on the right */}
        <path d={F ? "M -45 -496 C -50 -470 -40 -410 -36 -390 C -38 -370 -46 -350 -46 -326 L 46 -326 C 46 -350 38 -370 36 -390 C 40 -410 50 -470 45 -496 C 30 -506 -30 -506 -45 -496 Z" : "M -54 -496 C -60 -470 -50 -390 -45 -326 L 45 -326 C 50 -390 60 -470 54 -496 C 36 -508 -36 -508 -54 -496 Z"} fill={top} />
        <path d={F ? "M 18 -505 C 40 -500 50 -486 46 -450 C 42 -420 36 -400 36 -390 C 38 -370 46 -350 46 -326 L 20 -326 C 26 -380 28 -460 18 -505 Z" : "M 22 -506 C 48 -502 60 -488 56 -450 C 52 -410 47 -360 45 -326 L 20 -326 C 28 -400 32 -460 22 -506 Z"} fill={td} />
        {/* collar */}
        <path d="M -16 -506 L 0 -480 L 16 -506 L 12 -510 L 0 -492 L -12 -510 Z" fill={tl} />
        <path d="M -9 -532 L 9 -532 L 10 -505 C 4 -500 -4 -500 -10 -505 Z" fill={shade(skin, 0.86)} />
        {apron && <g><path d="M -34 -468 L 34 -468 L 42 -230 C 20 -224 -20 -224 -42 -230 Z" fill={apron} /><path d="M 14 -468 L 34 -468 L 42 -230 L 26 -228 Z" fill={shade(apron, 0.85)} />
          <path d="M -34 -468 L -14 -506 M 34 -468 L 14 -506" stroke={apron} strokeWidth="6" /><rect x="-24" y="-400" width="48" height="34" rx="3" fill={shade(apron, 0.9)} /></g>}
        {tie && <path d="M -6 -500 L 6 -500 L 9 -420 L 0 -406 L -9 -420 Z" fill={tie} />}
        {robe && <path d="M -58 -496 C -70 -440 -70 -250 -76 -120 L 76 -120 C 70 -250 70 -440 58 -496 C 44 -506 26 -508 18 -506 L 22 -380 L -22 -380 L -18 -506 C -26 -508 -44 -506 -58 -496 Z" fill={robe} />}
        <Arm side={1} a={fa} b={fb} top={top} skin={skin} item={frontItem} rolled={rolled} f={F} />
        {/* head: rig3's head and face at 0.55 scale */}
        <g transform={`translate(0 -566) rotate(${tilt}) scale(0.55)`}>
          <Hair style={hair} color={hairColor} part="back" />
          <ellipse cx="-60" cy="8" rx="11" ry="15" fill={skin} /><ellipse cx="60" cy="8" rx="11" ry="15" fill={shade(skin, 0.9)} />
          {earrings && <g fill="none" stroke={earrings} strokeWidth="5"><circle cx="-61" cy="30" r="9" /><circle cx="61" cy="30" r="9" /></g>}
          <path d="M -58 -10 C -58 -64 -30 -80 0 -80 C 30 -80 58 -64 58 -10 C 58 34 36 72 0 74 C -36 72 -58 34 -58 -10 Z" fill={skin} />
          <path d="M 24 -74 C 62 -54 66 30 14 72 C 44 66 62 30 58 -10 C 58 -50 44 -70 24 -74 Z" fill={shade(skin, 0.88)} />
          <Hair style={hair} color={hairColor} part="front" />
          {(FACE[face] || FACE.neutral).brow.map(([a, b, c, d], i) => <path key={i} d={`M ${a} ${b} L ${c} ${d}`} stroke={shade(hairColor, 0.9)} strokeWidth="7" strokeLinecap="round" />)}
          <Eyes type={(FACE[face] || FACE.neutral).eye} ink={ink} blink={blink} look={eyeLook} />
          {glasses && <g fill="none" stroke={ink} strokeWidth="4"><circle cx="-22" cy="-6" r="15" /><circle cx="22" cy="-6" r="15" /><path d="M -7 -8 Q 0 -12 7 -8" /></g>}
          <path d="M 2 0 L 8 16 L 0 18" stroke={shade(skin, 0.75)} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {beard && <Beard kind={beard} color={hairColor} />}
          <Mouth v={mouth} face={face} skin={skin} />
          {hat && <Hat kind={hat} color={hatColor} />}
        </g>
      </g>
    </g>
  </g>; };
