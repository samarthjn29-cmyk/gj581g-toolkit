// Stills workflow (8 Nov 2026): one scene = narration + realistic stills + camera moves (+ optional 2.5D layers) + info boxes.
// Props = the timeline.json written by toolkit/stills/build_scene.py, plus `dir` (the scene's folder under public/).
// Shot fields: img (file in dir), move: push | pullback | pan | panL | tilt | drift | hold, focus [x, y] (0-1, where a push
// heads), fade (s of dissolve into this shot; default 0 = cut), layers (folder with far/mid/near.png from stills/layers.py).
// Gags (9 Nov 2026): move 'punch' (snap zoom at punch_at s toward focus, size punch), freeze + freeze_img on video shots,
// gag: true marks the shot for the music dip at the mix. Gags carry no caption or label (Sam: "no labels").
// Cards: kind 'title' (big centred line) or 'info' (term + definition box, e.g. WORD 01 · Papyrus); dur (s, default 4.5).
// No image-source labels on screen (Sam, 8 Nov 2026): credits and the AI disclosure live in the description.
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';

const ez = Easing.bezier(0.45, 0, 0.25, 1);
const R = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ez});
const lin = (t, a, b) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const MOVES = {   // [scale from, scale to, x from, x to, y from, y to] in % of frame
  push: [1.0, 1.12, 0, 0, 0, 0], pullback: [1.14, 1.0, 0, 0, 0, 0], pan: [1.1, 1.1, 3.5, -3.5, 0, 0], panL: [1.1, 1.1, -3.5, 3.5, 0, 0],
  tilt: [1.12, 1.12, 0, 0, 4, -4], tiltDown: [1.12, 1.12, 0, 0, -4, 4], drift: [1.04, 1.09, 1, -1, 0.5, -0.5], hold: [1.03, 1.05, 0, 0, 0, 0],
};

const Shot = ({s, t, dir}) => { const {fps} = useVideoConfig();
  const [s0, s1, x0, x1, y0, y1] = MOVES[s.move === 'punch' ? 'hold' : (s.move || 'drift')], k = lin(t, s.t, s.t + s.dur + (s.tail || 0));
  let sc = s0 + (s1 - s0) * k; const x = x0 + (x1 - x0) * k, y = y0 + (y1 - y0) * k, [fx, fy] = s.focus || [0.5, 0.5];
  // gag punch-in (Zeigarnik, 9 Nov 2026 research: a fast snap zoom on the funny detail lands the beat): 0.18 s snap at punch_at s
  if (s.move === 'punch') { const p0 = s.t + (s.punch_at ?? 0.5); sc += (s.punch || 0.22) * interpolate(t, [p0, p0 + 0.18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}); }
  // freeze frame: a video gag stops on its best frame (freeze_img, cut by build_chapter.sh) freeze s into the shot
  const frozen = s.video && s.freeze_img && t >= s.t + s.freeze;
  const frame = (extra, src, style = {}) => <AbsoluteFill style={{transform: `translate(${x * extra}%, ${y * extra}%) scale(${1 + (sc - 1) * extra})`, transformOrigin: `${fx * 100}% ${fy * 100}%`, ...style}}>
    {frozen ? <Img src={staticFile(`${dir}/${s.freeze_img}`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: s.grade || 'none'}} />
      : s.video  // archive or stock footage (Sam, 9 Nov 2026: "If you can find videos those works too"): muted, starts at vstart s
      ? <Sequence from={Math.round(s.t * fps)} layout="none"><OffthreadVideo muted src={staticFile(`${dir}/${s.video}`)} startFrom={Math.round((s.vstart || 0) * fps)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: s.grade || 'none'}} /></Sequence>
      : <Img src={staticFile(`${dir}/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}</AbsoluteFill>;
  if (!s.layers) return frame(1, s.img);
  // 2.5D: the far layer moves least, the near layer most (small amounts: inpainted edges must never show)
  return <>{frame(0.7, `${s.layers}/far.png`)}{frame(1.0, `${s.layers}/mid.png`)}{frame(1.35, `${s.layers}/near.png`)}</>;
};

const Card = ({c, t}) => { const d = c.dur || 4.5, o = R(t, c.t, c.t + 0.4) * (1 - R(t, c.t + d - 0.4, c.t + d)); if (o <= 0) return null;
  if (c.kind === 'title') return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: o, background: `rgba(0,0,0,${0.35 * o})`}}>
    <div style={{fontFamily: '"Cormorant Garamond", "Noto Serif", Georgia, serif', fontSize: 84, letterSpacing: 6, color: '#F3EBDD', textAlign: 'center', maxWidth: 1500, whiteSpace: 'pre-line', lineHeight: 1.1, textShadow: '0 4px 24px rgba(0,0,0,0.7)', transform: `translateY(${(1 - o) * 12}px)`}}>{c.text}</div></AbsoluteFill>;
  // on-screen text (Sam, 8 Nov 2026: "putting text on the screen where it makes sense"): a key line in the end-title look,
  // set low so the picture stays visible; words verbatim from a fact-checked line
  if (c.kind === 'text') return <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', opacity: o, background: `linear-gradient(to top, rgba(0,0,0,${0.62 * o}) 0%, rgba(0,0,0,0) 45%)`}}>
    <div style={{fontFamily: '"Cormorant Garamond", "Noto Serif", Georgia, serif', fontSize: 66, letterSpacing: 3, color: '#F3EBDD', textAlign: 'center', maxWidth: 1500, lineHeight: 1.15, marginBottom: 110, textShadow: '0 4px 24px rgba(0,0,0,0.8)', transform: `translateY(${(1 - o) * 12}px)`}}>{c.text}</div></AbsoluteFill>;
  // info box: what a term means (kept on screen at Sam's request)
  return <div style={{position: 'absolute', left: 96, bottom: 120, width: 640, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: 'rgba(14,16,20,0.82)', borderLeft: '6px solid #C9A86A', padding: '22px 28px', backdropFilter: 'blur(6px)'}}>
    {c.label && <div style={{fontFamily: 'Inter, sans-serif', fontSize: 18, letterSpacing: 4, color: '#C9A86A', marginBottom: 8}}>{c.label}</div>}
    <div style={{fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 52, color: '#F3EBDD', lineHeight: 1}}>{c.term}</div>
    <div style={{fontFamily: 'Inter, sans-serif', fontSize: 26, color: '#D9D2C5', marginTop: 10, lineHeight: 1.35}}>{c.text}</div></div>; };

export const StillsScene = ({dir, shots, cards = []}) => { const {fps} = useVideoConfig(), t = useCurrentFrame() / fps;
  return <AbsoluteFill style={{background: '#000'}}>
    <Audio src={staticFile(`${dir}/vo.mp3`)} />
    {shots.map((s, i) => { const nx = shots[i + 1], end = nx ? nx.t + (nx.fade || 0) : s.t + s.dur;
      if (t < s.t - 0.01 || t > end + 0.01) return null;
      return <AbsoluteFill key={s.id} style={{opacity: s.fade ? R(t, s.t, s.t + s.fade) : 1}}><Shot s={s} t={t} dir={dir} /></AbsoluteFill>; })}
    {cards.map((c, i) => <Card key={i} c={c} t={t} />)}
  </AbsoluteFill>; };
