// Renderer for kit characters (librarian.mjs): each depth group is drawn as outline pass (thick black strokes of every
// fill shape), then fills, then details; a held prop is drawn between the hand's palm and its wrapping fingers.
import React from 'react';
import {Img, staticFile} from 'remotion';
import {mul, Tm, about} from '../scene/core.mjs';
import {RIG, SHAPES, OUTLINE, DETAIL, POINTS} from './librarian.mjs';
import {HEAD_PNG} from './head_png.mjs';

const css = (m) => `matrix(${m.map((v) => v.toFixed(5)).join(',')})`;
export const worldMatrices = (pose, offset = {}) => { const by = Object.fromEntries(RIG.parts.map((p) => [p.name, p])), W = {};
  const M = (n) => { if (W[n]) return W[n]; const p = by[n], local = mul(Tm(...(offset[n] || [0, 0])), about(p.pivot, pose[n] || 0)); return (W[n] = p.parent ? mul(M(p.parent), local) : local); };
  RIG.parts.forEach((p) => M(p.name)); return W; };

// x, y: plate position of the anchor (ground under the hip); scale: plate px per rig unit
// prop: (world, layer) => svg in rig units; layer 'under' is drawn between the palm and the fingers, 'over' after the fingers
export const Puppet2 = ({pose, offset, x, y, scale, hand = 'relaxed', farHand = 'relaxed', prop, opacity = 1, dir = 1, style}) => {
  const W = worldMatrices(pose, offset), S = SHAPES(hand, farHand);
  const shapesOf = (g, pick) => Object.entries(g.parts).flatMap(([part, list]) => (list === 'image' ? [] : list).filter(pick).map((s, i) => ({part, s, i})));
  const tr = (part) => css(W[part]);
  const group = (g) => <g key={g.id}>
    {shapesOf(g, (s) => s.kind === 'under').map(({part, s, i}) => <path key={`u${part}${i}`} d={s.d} transform={tr(part)} fill={s.fill} />)}
    {shapesOf(g, (s) => !s.kind || s.kind === 'front').map(({part, s, i}) => <path key={`o${part}${i}`} d={s.d} transform={tr(part)} fill="#000" stroke="#000" strokeWidth={OUTLINE} strokeLinejoin="round" />)}
    {shapesOf(g, (s) => !s.kind).map(({part, s, i}) => <path key={`f${part}${i}`} d={s.d} transform={tr(part)} fill={s.fill} />)}
    {shapesOf(g, (s) => s.kind === 'detail').map(({part, s, i}) => <path key={`d${part}${i}`} d={s.d} transform={tr(part)} fill="none" stroke={s.stroke} strokeWidth={s.width || DETAIL} strokeLinecap="round" />)}
    {g.id === 'near_arm' && prop && prop(W, 'under')}
    {shapesOf(g, (s) => s.kind === 'front').map(({part, s, i}) => <g key={`ff${part}${i}`}><path d={s.d} transform={tr(part)} fill="#000" stroke="#000" strokeWidth={OUTLINE * 0.75} /><path d={s.d} transform={tr(part)} fill={s.fill} /></g>)}
    {shapesOf(g, (s) => s.kind === 'front-detail').map(({part, s, i}) => <path key={`fd${part}${i}`} d={s.d} transform={tr(part)} fill="none" stroke={s.stroke} strokeWidth={DETAIL * 0.8} strokeLinecap="round" />)}
    {g.id === 'near_arm' && prop && prop(W, 'over')}
  </g>;
  // three layers so the Recraft head (an <Img>, which Remotion waits for) sits between the body and the near arm
  const b = 2000, svg = (gs, k) => <svg key={k} width={b * 2 * scale} height={b * 2 * scale} viewBox={`${-b} ${-b * 1.5} ${b * 2} ${b * 2}`} style={{position: 'absolute', left: x - b * scale, top: y - b * 1.5 * scale, overflow: 'visible'}}>{gs.map(group)}</svg>;
  const front = S.groups.filter((g) => g.id === 'near_arm'), back = S.groups.filter((g) => g.id !== 'near_arm'), H = POINTS.headImg;
  // dir -1 mirrors the whole figure about the anchor (he faces left); the rig itself is always drawn facing right
  return <div style={{position: 'absolute', left: 0, top: 0, opacity, transformOrigin: `${x}px 0px`, transform: dir < 0 ? 'scaleX(-1)' : undefined, ...style}}>
    {svg(back, 'back')}
    <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${x}px, ${y}px) scale(${scale}) ${css(W.head)}`}}>
      <Img src={HEAD_PNG} style={{position: 'absolute', left: H.x, top: H.y, width: H.w, height: H.h}} /></div>
    {svg(front, 'front')}</div>; };
