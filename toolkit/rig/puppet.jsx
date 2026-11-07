// Cut-out puppets from Recraft vector characters (7 Nov 2026). Parts and pivots come from build_rig.py (rig.json).
// A pose gives each part an angle (degrees, clockwise) about its pivot, applied down the parent chain, so motion
// stays smooth and the character always stays the same drawing. Joint caps hide seams at knees and elbows.
import React from 'react';
import {Img, staticFile} from 'remotion';

const mul = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
const T = (x, y) => [1, 0, 0, 1, x, y];
const Rot = (deg) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; };
const about = (p, deg) => mul(T(p[0], p[1]), mul(Rot(deg), T(-p[0], -p[1])));
const css = (m) => `matrix(${m.map((v) => v.toFixed(5)).join(',')})`;

// rig: rig.json; dir: public folder of the parts; pose: {part: deg}; offset: {part: [dx, dy]} (base px, before rotation)
// x, y: where the feet anchor lands (in the parent layer's px); h: on-screen height of the full figure; flip: face left
// anchor: [x, y] feet point in base px; attach: {part: (ctx) => svg children drawn in that part's frame}; caps: [{part, at:[x,y], r, fill, z}]
export const Puppet = ({rig, dir, pose = {}, offset = {}, x, y, scale, flip = false, anchor, attach = {}, caps = [], opacity = 1}) => {
  const byName = Object.fromEntries(rig.parts.map((p) => [p.name, p]));
  const world = {};
  const M = (name) => {
    if (world[name]) return world[name];
    const p = byName[name], local = mul(T(...(offset[name] || [0, 0])), about(p.pivot, pose[name] || 0));
    world[name] = p.parent ? mul(M(p.parent), local) : local; return world[name]; };
  rig.parts.forEach((p) => M(p.name));
  const items = [...rig.parts.map((p) => ({z: p.z, kind: 'part', p})), ...caps.map((c) => ({z: c.z, kind: 'cap', c}))].sort((a, b) => a.z - b.z);
  const sx = flip ? -scale : scale;
  return <div style={{position: 'absolute', left: 0, top: 0, opacity, transformOrigin: '0 0', transform: `translate(${x}px, ${y}px) scale(${sx}, ${scale}) translate(${-anchor[0]}px, ${-anchor[1]}px)`}}>
    {items.map((it, i) => it.kind === 'part'
      ? <div key={i} style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: css(world[it.p.name])}}>
          <Img src={staticFile(`${dir}/${it.p.src || it.p.name}.png`)} style={{position: 'absolute', left: it.p.x, top: it.p.y, width: it.p.w, height: it.p.h, filter: it.p.tint ? 'brightness(0.8) saturate(0.9)' : 'none'}} />
          {attach[it.p.name] && <svg width={rig.width} height={rig.height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>{attach[it.p.name]()}</svg>}</div>
      : <div key={i} style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: css(world[it.c.part])}}>
          <svg width={rig.width} height={rig.height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <circle cx={it.c.at[0]} cy={it.c.at[1]} r={it.c.r} fill={it.c.fill} style={{filter: it.c.tint ? 'brightness(0.8) saturate(0.9)' : 'none'}} /></svg></div>)}
  </div>; };

// a natural walk: phase in cycles, amp 0..1. Facing right; positive angles are clockwise (backwards for a leg).
export const walkPose = (phase, amp) => {
  const a = 2 * Math.PI * phase, s = Math.sin(a), c = Math.cos(a);
  const knee = (v) => 42 * Math.pow(Math.max(0, v), 1.4);
  return {
    pose: {near_thigh: -24 * s * amp, far_thigh: 24 * s * amp, near_shin: (knee(c) + 4) * amp, far_shin: (knee(-c) + 4) * amp,
      upper_arm: 16 * s * amp, forearm: (-10 - 8 * s) * amp, torso: (2.5 + 1.2 * Math.sin(2 * a)) * amp, head: (-1.5 - 0.8 * Math.sin(2 * a)) * amp},
    bob: -9 * amp * Math.abs(Math.cos(a)) + 4 * amp };
};
