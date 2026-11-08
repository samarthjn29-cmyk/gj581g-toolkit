// Motion test sheet for the kit character: rest, a walk cycle, reach, grip and carry, lay, two-hand hold.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Puppet2} from './Puppet2.jsx';
import {walkPose} from '../scene/core.mjs';
const W = (ph) => { const w = walkPose(ph, 0.8); return {...w.pose, far_upper_arm: -w.pose.upper_arm, far_forearm: -10 + (w.pose.forearm + 10) * -1}; };
export const KIT_POSES = [
  ['rest', {}, 'relaxed'], ['walk 0', W(0), 'relaxed'], ['walk .25', W(0.25), 'relaxed'], ['walk .5', W(0.5), 'relaxed'], ['walk .75', W(0.75), 'relaxed'],
  ['reach', {upper_arm: -75, forearm: -15, hand: 0, torso: 4}, 'reach'], ['grip', {upper_arm: -70, forearm: -15, hand: 0, torso: 4}, 'grip'],
  ['carry', {upper_arm: -10, forearm: -25, hand: 35}, 'grip'], ['lay', {upper_arm: -60, forearm: -30, hand: -20, torso: 2}, 'grip'],
  ['two hands', {upper_arm: -35, forearm: -55, hand: 10, far_upper_arm: -40, far_forearm: -50}, 'grip'], ['look up', {head: -14}, 'relaxed'], ['sit-ish', {near_thigh: -70, near_shin: 70, far_thigh: -65, far_shin: 65}, 'relaxed']];
const scroll = (W) => <g transform={`matrix(${W.hand.join(',')})`}><rect x={-60} y={-806} width={130} height={56} rx={18} fill="rgb(232,212,183)" stroke="#000" strokeWidth={9} /></g>;
export const KitTest = () => <AbsoluteFill style={{background: '#ff00ff'}}>
  {KIT_POSES.map(([n, pose, hand], i) => <React.Fragment key={i}>
    <Puppet2 pose={pose} x={160 + (i % 6) * 320} y={500 + Math.floor(i / 6) * 540} scale={0.26} hand={hand} prop={hand === 'grip' ? scroll : null} />
    <div style={{position: 'absolute', left: 60 + (i % 6) * 320, top: 510 + Math.floor(i / 6) * 540, fontFamily: 'monospace', fontSize: 20, color: '#fff'}}>{n}</div></React.Fragment>)}
</AbsoluteFill>;
