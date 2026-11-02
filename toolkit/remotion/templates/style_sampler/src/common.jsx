// Shared pieces for the style sampler (3 Nov 2026): one narration, phrase cues, captions, sound cues.
import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender} from 'remotion';
import N from './data/narr.json';

export const FPS = 30;
export const LEN = Math.round(N.total * FPS);
const L = Object.fromEntries(N.lines.map((l) => [l.id, l]));
export const s = (id) => L[id].start, e = (id) => L[id].end;
// estimated word start inside a phrase (character position); k = occurrence
export const tw = (id, word, k = 0) => { const l = L[id]; const ws = l.text.split(' '); let n = -1, idx = -1;
  ws.forEach((w, i) => { if (idx < 0 && w.toLowerCase().replace(/[^a-z0-9']/g, '').startsWith(word.toLowerCase())) { n++; if (n === k) idx = i; } });
  if (idx < 0) throw new Error(`cue "${word}" not in ${id}`);
  const ch = ws.map((w) => w.length + 1); const b = ch.slice(0, idx).reduce((a, c) => a + c, 0), tot = ch.reduce((a, c) => a + c, 0);
  return l.start + (l.end - l.start) * (b / tot); };
export const useT = () => useCurrentFrame() / FPS;
const EZ = Easing.bezier(0.2, 0.8, 0.2, 1);
export const ramp = (t, a, d = 0.35, ez = EZ) => interpolate(t, [a, a + d], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ez});
export const back = (t, a, d = 0.45) => ramp(t, a, d, Easing.out(Easing.back(1.8)));
export const lerp = (a, b, p) => a + (b - a) * p;

if (typeof document !== 'undefined' && !window.__kalam) { window.__kalam = true; const h = delayRender('kalam');
  Promise.all([['Kalam', 'Kalam-Regular.ttf', '400'], ['Kalam', 'Kalam-Bold.ttf', '700']].map(([f, file, w]) => new FontFace(f, `url(${staticFile(`fonts/${file}`)})`, {weight: w}).load().then((x) => document.fonts.add(x))))
    .then(() => continueRender(h)).catch(() => continueRender(h)); }

export const Narr = () => <Audio src={staticFile('narr.wav')} />;
export const Sfx = ({at, name, vol = 0.45}) => <Sequence from={Math.max(0, Math.round(at * FPS))} durationInFrames={45}><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} /></Sequence>;

// captions: max 8 words, current word highlighted
export const Caps = ({bg = 'rgba(20,20,20,0.85)', fg = '#FFFFFF', hi = '#FFD23F', font = "'Inter', sans-serif", size = 38}) => { const t = useT();
  const l = N.lines.find((x) => t >= x.start - 0.05 && t <= x.end + 0.35); if (!l) return null;
  const ws = l.text.split(' '); const ch = ws.map((w) => w.length + 1), tot = ch.reduce((a, b) => a + b, 0);
  let cur = 0; ws.forEach((_, i) => { if (t >= l.start + (l.end - l.start) * ch.slice(0, i).reduce((a, b) => a + b, 0) / tot) cur = i; });
  const pg = Math.floor(cur / 8);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 990, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: bg, borderRadius: 12, padding: '8px 24px', fontFamily: font, fontSize: size, fontWeight: 600}}>
      {ws.slice(pg * 8, pg * 8 + 8).map((w, i) => <span key={i} style={{color: pg * 8 + i === cur ? hi : fg, marginRight: 10}}>{w}</span>)}</div></div>; };

// SVG draw-on: put pathLength={1} on the path and spread drawOn(p)
export const drawOn = (p) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.max(0, Math.min(1, p))});
