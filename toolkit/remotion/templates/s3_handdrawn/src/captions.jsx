// Idea 6: burnt-in captions in the band under the stage; each word lights up as it is spoken, stressed words in coral.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import WORDS from './data/words.json';
import SLIDES from './data/slides.json';
import {C, FPS, SANS} from './lib';

const SKIP = new Set(SLIDES.filter((d) => d.layout === 'word-card' || d.layout === 'title-slide').map((d) => d.n));   // the screen already shows the words
export const buildChunks = () => {
  const out = [];
  for (const d of SLIDES) {
    if (SKIP.has(d.n)) continue;
    const ws = (WORDS[String(d.wkey ?? d.n)] || []).map((w) => ({...w, s: d.start + 0.2 + w.s, e: d.start + 0.2 + w.e}));
    let cur = [];
    const flush = () => { if (cur.length) out.push({s: cur[0].s, e: cur[cur.length - 1].e, words: cur}); cur = []; };
    ws.forEach((w, i) => {
      cur.push(w); const nx = ws[i + 1]; const chars = cur.reduce((a, q) => a + q.w.length + 1, 0);
      if (!nx || /[.?!…]$/.test(w.w) || chars > 44 || (/[,;:—]$/.test(w.w) && chars > 22) || (nx && nx.s - w.e > 0.45) || (nx && (nx.who || '') !== (w.who || ''))) flush();
    });
    flush();
  }
  for (let i = 0; i < out.length; i++) out[i].show = Math.min(out[i].e + 0.5, i + 1 < out.length ? out[i + 1].s - 0.02 : 1e9);
  return out;
};
const CHUNKS = buildChunks();

export const Captions = () => {
  const t = useCurrentFrame() / FPS;
  const ch = CHUNKS.find((c) => t >= c.s - 0.05 && t < c.show);
  if (!ch) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
    <div style={{background: 'rgba(27,31,42,0.80)', borderRadius: 10, padding: '9px 22px 11px', maxWidth: 1560, fontFamily: SANS, fontWeight: 600, fontSize: 36, lineHeight: 1.25, textAlign: 'center',
      boxShadow: '0 6px 18px rgba(0,0,0,0.25)'}}>
      {ch.words.map((w, i) => { const on = t >= w.s - 0.03; const txt = w.w.replace(/[*]/g, '');
        const viewer = w.who === 'viewer';   // second 'viewer' voice: italic, light accent, with a dash before its first word
        return <span key={i} style={{color: w.emph ? (on ? '#FF9A5C' : 'rgba(255,154,92,0.5)') : viewer ? (on ? C.light : 'rgba(157,187,245,0.5)') : (on ? '#FFFFFF' : 'rgba(255,255,255,0.45)'),
          fontWeight: w.emph ? 800 : 600, fontStyle: viewer ? 'italic' : 'normal'}}>{viewer && i === 0 ? '– ' : ''}{txt}{i < ch.words.length - 1 ? ' ' : ''}</span>; })}
    </div>
  </div>;
};
