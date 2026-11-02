// Idea 4: animated maps and original diagrams of real events (illustrations, not footage).
import React from 'react';
import {useCurrentFrame, interpolate, Easing, AbsoluteFill} from 'remotion';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import usTopo from 'us-atlas/states-10m.json';
import worldTopo from 'world-atlas/countries-50m.json';
import {C, f, FPS, prog, SANS, HEAD, mix} from './lib';

const STATES = feature(usTopo, usTopo.objects.states).features;
const WORLD = feature(worldTopo, worldTopo.objects.countries).features.filter((c) => ['124', '484'].includes(String(c.id)));  // Canada, Mexico
const MA = STATES.find((s) => s.properties.name === 'Massachusetts');

// keyframes: [{t, lon, lat, w}] where w = view width in degrees of longitude; zoom is interpolated in log space
export const MapZoom = ({keys, pin, pinAt, label, labelAt, highlightAt, W = 1920, H = 1080, dim = 0}) => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  let k = 0; while (k < keys.length - 2 && t > keys[k + 1].t) k++;
  const a = keys[k], b = keys[k + 1];
  const p = interpolate(t, [a.t, b.t], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const lw = Math.exp(Math.log(a.w) + (Math.log(b.w) - Math.log(a.w)) * p);
  const pc = Math.min(1, p * 1.25);
  const lon = a.lon + (b.lon - a.lon) * pc, lat = a.lat + (b.lat - a.lat) * pc;
  const scale = W / (lw * Math.PI / 180);
  const proj = geoMercator().scale(scale).center([lon, lat]).translate([W / 2, H / 2]).clipExtent([[-10, -10], [W + 10, H + 10]]);
  const path = geoPath(proj);
  const hp = highlightAt != null ? prog(fr, highlightAt, 0.8) : 0;
  const [px, py] = pin ? proj(pin) : [0, 0];
  const pp = pinAt != null ? prog(fr, pinAt, 0.5) : 0; const ring = ((fr - f(pinAt || 0)) % 45) / 45;
  const lp = labelAt != null ? prog(fr, labelAt, 0.5) : 0;
  const sw = Math.max(0.6, Math.min(2.2, 1.2 * Math.sqrt(1700 / lw / 60)));
  return <AbsoluteFill style={{background: '#1E1430'}}>
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <defs><pattern id="mgrid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#2E2245" strokeWidth="1" /></pattern></defs>
      <rect width={W} height={H} fill="url(#mgrid)" />
      {WORLD.map((c, i) => <path key={'w' + i} d={path(c)} fill="#2F2343" stroke="#3E3058" strokeWidth={sw} />)}
      {STATES.map((s, i) => <path key={i} d={path(s)} fill={s === MA ? mix('#3D2E57', C.accent, hp) : '#3D2E57'} stroke="#6A5A86" strokeWidth={sw} />)}
      {pin && pp > 0 && <g transform={`translate(${px} ${py})`} opacity={pp}>
        <circle r={14 + ring * 46} fill="none" stroke={C.callout} strokeWidth={3} opacity={1 - ring} />
        <circle r={12 * pp} fill={C.callout} stroke="#fff" strokeWidth={3} />
      </g>}
      {pin && lp > 0 && <text x={px + 26} y={py - 18} fill="#fff" opacity={lp} fontFamily={HEAD} fontWeight={800} fontSize={40}>{label}</text>}
    </svg>
    {dim > 0 && <AbsoluteFill style={{background: `rgba(30,20,48,${dim})`}} />}
  </AbsoluteFill>;
};

// Top-down sketch of the 1995 chase (Chabris et al., 2011, describe the facts): officer chases a suspect over a fence,
// running past the spot where a fellow officer is being beaten. Not to scale; positions are illustrative.
const lerpPath = (pts, u) => { const seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let x = u * L; for (let i = 0; i < seg.length; i++) { if (x <= seg[i] || i === seg.length - 1) { const q = Math.min(1, x / seg[i]); return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * q, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * q]; } x -= seg[i]; } return pts[pts.length - 1]; };
const Fig = ({x, y, c, r = 1.6, label, lc = '#fff', lp = 1, below}) => <g transform={`translate(${x} ${y})`}>
  <circle r={r} fill={c} stroke="#fff" strokeWidth={0.35} />
  {label && <text y={below ? r + 3.4 : -r - 1.4} textAnchor="middle" fill={lc} opacity={lp} fontFamily={SANS} fontWeight={700} fontSize={2.3}>{label}</text>}
</g>;
export const ChaseDiagram = ({start, cone, dimAt, x = 0, y = 0, w = 1920, h = 1080, fade = 1, labels = true, runDur = 9}) => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  const P = [[36, 47], [50, 42], [61, 37], [71, 33], [80, 29], [88, 26]];
  const u = interpolate(t, [start, start + runDur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const sus = lerpPath(P, u * 0.86 + 0.14), off = lerpPath(P, u * 0.86);
  const inP = prog(fr, start - 0.6, 0.8);
  const ang = Math.atan2(sus[1] - off[1], sus[0] - off[0]);
  const cp = cone != null ? prog(fr, cone, 0.6) : 0; const dm = dimAt != null ? prog(fr, dimAt, 0.7) : 0;
  const R = 34, half = 0.32;
  const c1 = [off[0] + R * Math.cos(ang - half), off[1] + R * Math.sin(ang - half)], c2 = [off[0] + R * Math.cos(ang + half), off[1] + R * Math.sin(ang + half)];
  const beat = [69, 21]; const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  return <svg viewBox="0 0 100 56.25" style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: inP * fade}}>
    <defs>
      <mask id="cone"><rect width="100" height="56.25" fill="#fff" /><polygon points={`${off[0]},${off[1]} ${c1.join(',')} ${c2.join(',')}`} fill="#000" /></mask>
      <linearGradient id="cg" x1="0" x2="1"><stop offset="0" stopColor={C.light} stopOpacity="0.55" /><stop offset="1" stopColor={C.light} stopOpacity="0" /></linearGradient>
    </defs>
    <rect width="100" height="56.25" fill="#211735" />
    {[10, 30, 50, 70, 90].map((gx) => <rect key={gx} x={gx - 7} y={2} width={14} height={9} rx={0.6} fill="#2C2042" />)}
    {[10, 30, 70, 90].map((gx) => <rect key={'b' + gx} x={gx - 7} y={48} width={14} height={7} rx={0.6} fill="#2C2042" />)}
    <path d="M0 14 H100 M0 46 H100" stroke="#3B2E54" strokeWidth={3.2} />
    <line x1={78} y1={20} x2={72} y2={44} stroke={C.lineMedia} strokeWidth={0.5} strokeDasharray="1 0.8" />
    {labels && <text x={79} y={42} fill={C.lineMedia} fontFamily={SANS} fontSize={2} fontWeight={600}>fence</text>}
    <path d={`M${P.map((p) => p.join(' ')).join(' L')}`} fill="none" stroke={C.lineMedia} strokeWidth={0.35} strokeDasharray="0.8 1" opacity={0.7} />
    {cp > 0 && <polygon points={`${off[0]},${off[1]} ${c1.join(',')} ${c2.join(',')}`} fill="url(#cg)" opacity={cp} />}
    <g>
      <circle cx={beat[0]} cy={beat[1]} r={4.5 + pulse * 1.2} fill={C.callout} opacity={0.18} />
      <Fig x={beat[0] - 1.8} y={beat[1]} c={C.callout} r={1.2} /><Fig x={beat[0] + 1.6} y={beat[1] - 1} c={C.callout} r={1.2} /><Fig x={beat[0] + 0.2} y={beat[1] + 1.7} c="#fff" r={1.2} />
      {labels && <text x={beat[0]} y={beat[1] - 5.5} textAnchor="middle" fill={C.callout} fontFamily={SANS} fontWeight={800} fontSize={2.4}>a fellow officer being beaten</text>}
    </g>
    <Fig x={sus[0]} y={sus[1]} c="#fff" r={1.5} label={labels ? 'suspect' : null} />
    <Fig x={off[0]} y={off[1]} c={C.accent} r={1.7} label={labels ? 'officer' : null} lc={C.light} below />
    {dm > 0 && <rect width="100" height="56.25" fill="#120B1E" opacity={0.62 * dm} mask="url(#cone)" />}
  </svg>;
};

// Chabris et al. (2011): follow a runner 9.1 m behind on a 400 m route, counting head-touches; three people stage a fight
// 8 m off the path. Illustration, not to scale.
export const RouteDiagram = ({start, fightAt, countAt, w = 780, h = 570, dur = 14}) => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  const P = [[10, 80], [10, 22], [40, 12], [80, 18], [90, 50], [70, 82], [35, 88], [10, 80]];
  const u = ((t - start) / dur) % 1; const runner = lerpPath(P, (Math.max(0, u) + 0.06) % 1), you = lerpPath(P, Math.max(0, u));
  const inP = prog(fr, start - 0.5, 0.8); const fp = prog(fr, fightAt, 0.6); const cp = prog(fr, countAt, 0.5);
  const count = cp > 0 ? Math.floor(Math.max(0, t - countAt) / 1.6) : 0; const jig = Math.sin(t * 9) * 0.6;
  return <svg viewBox="0 0 100 100" style={{width: w, height: h, opacity: inP, overflow: 'visible'}}>
    <rect x="0" y="0" width="100" height="100" rx="2" fill="#F7F4FA" />
    <path d={`M${P.map((p) => p.join(' ')).join(' L')}`} fill="none" stroke={C.rule} strokeWidth={5} strokeLinejoin="round" />
    <path d={`M${P.map((p) => p.join(' ')).join(' L')}`} fill="none" stroke="#fff" strokeWidth={0.5} strokeDasharray="2 2" />
    <text x="50" y="52" textAnchor="middle" fill={C.secondary} fontFamily={SANS} fontSize={3.6} fontWeight={600}>400 m route</text>
    <g opacity={fp}>
      <circle cx={62} cy={36} r={8} fill={C.callout} opacity={0.14} />
      <circle cx={59 + jig} cy={35} r={1.8} fill={C.callout} /><circle cx={64 - jig} cy={34} r={1.8} fill={C.callout} /><circle cx={62} cy={39 + jig * 0.5} r={1.8} fill={C.negative} />
      <line x1={70} y1={30} x2={82} y2={22} stroke={C.callout} strokeWidth={0.4} strokeDasharray="1 1" />
      <text x={63} y={27} textAnchor="middle" fill={C.callout} fontFamily={SANS} fontSize={3.2} fontWeight={800}>staged fight</text>
      <text x={63} y={46.5} textAnchor="middle" fill={C.callout} fontFamily={SANS} fontSize={2.6} fontWeight={600}>8 m off the path</text>
    </g>
    <circle cx={runner[0]} cy={runner[1]} r={2.4} fill={C.primary} stroke="#fff" strokeWidth={0.6} />
    <circle cx={you[0]} cy={you[1]} r={2.4} fill={C.accent} stroke="#fff" strokeWidth={0.6} />
    <text x={you[0] + 3.5} y={you[1] + 1} fill={C.accent} fontFamily={SANS} fontSize={3} fontWeight={800}>you</text>
    <text x={runner[0] + 3.5} y={runner[1] + 1} fill={C.primary} fontFamily={SANS} fontSize={3} fontWeight={700}>runner</text>
    <g opacity={cp}><rect x={4} y={93} width={42} height={6.5} rx={3.2} fill={C.primary} />
      <text x={25} y={97.6} textAnchor="middle" fill="#fff" fontFamily={SANS} fontSize={3.2} fontWeight={700}>{`head-touches counted: ${count}`}</text></g>
    <text x={96} y={97.6} textAnchor="end" fill={C.secondary} fontFamily={SANS} fontSize={2.6} fontStyle="italic">9.1 m behind the runner</text>
  </svg>;
};
