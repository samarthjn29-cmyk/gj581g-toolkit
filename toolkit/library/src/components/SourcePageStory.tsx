import React from "react";
import { AbsoluteFill, Img, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { drift, exit, reveal, sec, SLOW_OUT } from "../motion";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-051 SourcePageStory (independent motion-design review of the WCL-E01 stockings scene, 23 Nov 2026, concept A
// "The page tells it"; Sam: "Let's think of something else to do the stockings scene"). A second-hand story told on
// the real page that tells it: the scan lies on a dark desk beside the real object on a sheet of tissue. Each phrase is
// marked on the page as it is spoken; the object's colour comes off the page's words (REPORTED COLOURS, never "what
// they saw"); the tissue folds over the object and opens again; at the end kraft tags name who said what, two tied
// together, one alone. Page and object stay real and captioned; nothing is drawn but marks, tissue and tags.
// Best use: an anecdote from a named source about an object people disagreed on. Limit: 1 per episode, max 16 beats;
// the page is the source of the story (registered), the object a registered photo with its mask; marks only on words
// the narration says or that the fact-check logs; quotes on screen only where the script quotes.
type Box = readonly [number, number, number]; // x0, x1, y (line centre), in page pixels
export type PageMark = { boxes: Box[]; atSec: number; sec?: number; kind?: "mark" | "line"; color?: string };
export type ObjectState = { atSec: number; color: string | null; sec?: number; snap?: boolean };
export type PageQuote = { atSec: number; untilSec: number; kicker?: string; text?: string; textAtSec?: number; by?: string; byAtSec?: number };
export type PageTag = { name: string; color: string; colorName: string; atSec: number; x: number; y: number; hard?: boolean };
export type SourcePageStoryProps = {
  page: { srcId: string; file?: string; size: readonly [number, number]; scale?: number; lineH?: number };
  frames: { atSec: number; y: number }[]; // camera: the page y shown at the frame's centre, eased in from each atSec
  marks?: PageMark[];
  dims?: { y0: number; y1: number; atSec: number }[]; // page lines veiled to 55% so the eye does not read ahead
  swatches?: { x: number; y: number; color: string; atSec: number }[]; // margin tabs beside a colour line
  object: { srcId: string; file: string; mask: string; size: readonly [number, number]; bbox: readonly [number, number, number, number]; atSec: number; width?: number };
  states: ObjectState[];
  wrap?: { atSec: number; openAtSec: number };
  quotes?: PageQuote[];
  tags?: PageTag[];
  tie?: { atSec: number; names: [string, string] };
  pullBack?: { atSec: number; sec?: number; scale: number };
  tag?: DatelineTagProps;
  caption: string;
  startSec?: number;
};

const ease = (frame: number, fps: number, at: number, dur: number, easing = SLOW_OUT) =>
  interpolate(frame, [sec(at, fps), sec(at, fps) + Math.max(1, sec(dur, fps))], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// The object, tinted so the silk keeps its sheen: luminance, the reported colour in multiply, the knit back in soft-light.
const Tinted: React.FC<{ img: string; msk: string; size: readonly [number, number]; bbox: readonly [number, number, number, number]; width: number; color: string | null }> = ({ img, msk, size, bbox, width, color }) => {
  const s = width / bbox[2];
  const full: React.CSSProperties = { position: "absolute", left: -bbox[0] * s, top: -bbox[1] * s, width: size[0] * s, height: size[1] * s, maxWidth: "none", WebkitMaskImage: `url(${msk})`, maskImage: `url(${msk})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" };
  return (
    <div style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
      {color === null ? (
        <Img src={img} style={full} />
      ) : (
        <>
          <Img src={img} style={{ ...full, filter: "grayscale(1) contrast(1.2) brightness(1.18)" }} />
          <div style={{ ...full, background: color, mixBlendMode: "multiply" }} />
          <Img src={img} style={{ ...full, filter: "grayscale(1) contrast(1.8)", mixBlendMode: "soft-light", opacity: 0.3 }} />
        </>
      )}
    </div>
  );
};

export const SourcePageStory: React.FC<SourcePageStoryProps> = ({ page, frames, marks = [], dims = [], swatches = [], object, states, wrap, quotes = [], tags = [], tie, pullBack, tag, caption, startSec = 0 }) => {
  useAssets(["VIS-051", "VIS-035", "MOT-001", "TXT-017"]);
  const t = useTheme();
  const paperInk = t.paper?.ink ?? t.colors.canvas;
  const sheet = t.paper?.canvas ?? t.colors.ink;
  const tissue = t.paper?.panel ?? t.colors.ink;
  const kraft = t.colors.kraft ?? t.colors.secondary;
  const pg = useSourceFile(page.srcId, page.file);
  const img = useSourceFile(object.srcId, object.file);
  const msk = useSourceFile(object.srcId, object.mask);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const S = page.scale ?? 0.48;
  const lineH = (page.lineH ?? 84) * S;

  // camera: the page y at screen centre, eased between framings (only in pauses: set by the act file)
  let camY = frames[0].y;
  for (const f of frames.slice(1)) camY += (f.y - camY) * inOut(interpolate(frame, [sec(f.atSec, fps), sec(f.atSec + 1.0, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pageLeft = 30;
  const pageTop = 540 - camY * S;
  const pb = pullBack ? interpolate(frame, [sec(pullBack.atSec, fps), sec(pullBack.atSec + (pullBack.sec ?? 1.2), fps)], [1, pullBack.scale], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT }) : 1;
  const cam = drift(frame, durationInFrames, 0.015) * pb;

  // the object's colour: crossfade between pre-tinted copies; a snap is a 6-frame ease-out with a 1.5% pop
  const layers: { color: string | null; o: number }[] = [{ color: null, o: 1 }];
  let pop = 1;
  for (const st of states) {
    if (st.atSec <= 0 && st.color === null) continue;
    const d = st.snap ? 0.2 : st.sec ?? 0.9;
    const p = ease(frame, fps, st.atSec, d, st.snap ? SLOW_OUT : SLOW_OUT);
    if (p <= 0) break;
    layers.push({ color: st.color, o: p });
    if (st.snap) pop = 1 + 0.015 * Math.sin(Math.PI * interpolate(frame, [sec(st.atSec, fps), sec(st.atSec, fps) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  const objIn = ease(frame, fps, object.atSec, 0.9);
  const OW = object.width ?? 640;
  const OH = (object.bbox[3] / object.bbox[2]) * OW;
  const TIS = { x: 1110, y: 250, w: 720, h: 470 };
  const tisX = TIS.x + (1 - objIn) * 900;
  const wrapP = wrap ? ease(frame, fps, wrap.atSec + 0.1, 0.6) - ease(frame, fps, wrap.openAtSec, 0.7) : 0;
  const wrapR = wrap ? ease(frame, fps, wrap.atSec + 0.25, 0.6) - ease(frame, fps, wrap.openAtSec + 0.1, 0.7) : 0;

  return (
    <AbsoluteFill style={{ opacity: reveal(frame, fps, startSec, 0.6) }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "50% 50%" }}>
        {/* the page: the scan multiplied onto a cream sheet, turned 1.5 degrees */}
        <div style={{ position: "absolute", left: pageLeft, top: pageTop, width: page.size[0] * S, height: page.size[1] * S, transform: "rotate(-1.5deg)", transformOrigin: "50% 40%", background: sheet, boxShadow: "0 24px 48px rgba(20,12,6,0.55), 0 2px 4px rgba(20,12,6,0.4)" }}>
          <Img src={pg} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "multiply", filter: "contrast(1.05)" }} />
          {/* marks: accent marker washes and coloured underlines, wiping at speaking pace */}
          {marks.map((m, mi) => {
            const total = m.boxes.reduce((s0, b) => s0 + (b[1] - b[0]), 0);
            let acc = 0;
            return m.boxes.map((b, bi) => {
              const p = interpolate(frame, [sec(m.atSec - 0.07, fps), sec(m.atSec - 0.07 + (m.sec ?? 0.8), fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const seg = Math.max(0, Math.min(1, (p * total - acc) / (b[1] - b[0])));
              acc += b[1] - b[0];
              if (seg <= 0) return null;
              const w = (b[1] - b[0]) * S * seg;
              const line = m.kind === "line";
              const wob = (random(`pm${mi}-${bi}`) - 0.5) * 2;
              return line ? (
                <div key={`${mi}-${bi}`} style={{ position: "absolute", left: b[0] * S, top: b[2] * S + lineH * 0.42 + wob, width: w, height: 4, borderRadius: 2, background: m.color ?? paperInk, opacity: 0.9, transform: `rotate(${wob * 0.15}deg)` }} />
              ) : (
                <div key={`${mi}-${bi}`} style={{ position: "absolute", left: b[0] * S - 4, top: b[2] * S - lineH * 0.42, width: w + 8, height: lineH * 0.84, borderRadius: 3, background: m.color ?? t.colors.accent, opacity: 0.32, mixBlendMode: "multiply" }} />
              );
            });
          })}
          {dims.map((d, i) => {
            const a = ease(frame, fps, d.atSec, 0.6);
            return a > 0 ? <div key={i} style={{ position: "absolute", left: 0, right: 0, top: d.y0 * S, height: (d.y1 - d.y0) * S, background: sheet, opacity: 0.45 * a }} /> : null;
          })}
          {swatches.map((sw, i) => {
            const a = ease(frame, fps, sw.atSec, 0.6);
            return a > 0 ? <div key={i} style={{ position: "absolute", left: sw.x * S, top: sw.y * S - 13, width: 26, height: 26, borderRadius: 3, background: sw.color, border: `2px solid ${paperInk}`, opacity: a, transform: `translateX(${(1 - a) * -14}px)` }} /> : null;
          })}
        </div>

        {/* the tissue and the object on it */}
        <div style={{ position: "absolute", left: tisX, top: TIS.y, width: TIS.w, height: TIS.h, transform: `rotate(${3 + (1 - objIn) * 4}deg)`, opacity: objIn, background: tissue, boxShadow: "0 18px 36px rgba(20,12,6,0.5)", perspective: 1400 }}>
          <div style={{ position: "absolute", left: (TIS.w - OW) / 2, top: (TIS.h - OH) / 2, width: OW, height: OH, transform: `rotate(-7deg) scale(${pop})`, filter: "drop-shadow(0 14px 22px rgba(40,26,12,0.35)) drop-shadow(0 2px 2px rgba(40,26,12,0.3))" }}>
            {layers.map((l, i) => (
              <div key={i} style={{ position: "absolute", inset: 0, opacity: l.o }}>
                <Tinted img={img} msk={msk} size={object.size} bbox={object.bbox} width={OW} color={l.color} />
              </div>
            ))}
          </div>
          {/* two tissue flaps fold over the pair (the present wrapped) and part again */}
          {wrap && (wrapP > 0 || wrapR > 0)
            ? [0, 1].map((side) => {
                const p = side === 0 ? wrapP : wrapR;
                if (p <= 0) return null;
                return (
                  <div
                    key={side}
                    style={{
                      position: "absolute",
                      top: 0,
                      [side === 0 ? "left" : "right"]: 0,
                      width: TIS.w / 2 + 6,
                      height: TIS.h,
                      transformOrigin: side === 0 ? "0% 50%" : "100% 50%",
                      transform: `rotateY(${(side === 0 ? -1 : 1) * 92 * (1 - p)}deg)`,
                      background: `linear-gradient(${side === 0 ? 90 : 270}deg, ${tissue} 0%, ${sheet} ${60 + 40 * p}%)`,
                      boxShadow: `${side === 0 ? 6 : -6}px 0 14px rgba(20,12,6,${0.25 * p})`,
                      opacity: Math.min(1, p * 3),
                    }}
                  />
                );
              })
            : null}
        </div>

        {/* kraft tags: who said what */}
        {tags.map((tg) => {
          const d = tg.hard ? 0.25 : 0.4;
          const a = interpolate(frame, [sec(tg.atSec, fps), sec(tg.atSec + d, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (a <= 0) return null;
          const y = tg.hard ? -60 * (1 - a * a) : -40 * (1 - SLOW_OUT(a));
          const impact = tg.hard && frame === sec(tg.atSec + d, fps) ? 3 : 0;
          const tied = tie && tie.names.includes(tg.name) ? ease(frame, fps, tie.atSec + 0.5, 0.5) : 0;
          const rot = tg.hard ? -2 : (1 - SLOW_OUT(a)) * 1.5 + (tg.name === tie?.names[1] ? 2 : -1);
          return (
            <div key={tg.name} style={{ position: "absolute", left: tg.x - 12 * tied, top: tg.y + y + impact, opacity: Math.min(1, a * 2), transform: `rotate(${rot}deg)`, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px 12px 34px", background: kraft, borderRadius: "4px 4px 4px 4px", boxShadow: "0 8px 14px rgba(20,12,6,0.45)", fontFamily: t.fonts.mono, fontSize: 26, letterSpacing: 2.5, color: paperInk }}>
              <span style={{ position: "absolute", left: 12, top: "50%", width: 10, height: 10, marginTop: -5, borderRadius: 5, background: t.colors.canvas }} />
              <span>{tg.name}</span>
              <span style={{ width: 26, height: 26, borderRadius: 3, background: tg.color, border: `2px solid ${paperInk}` }} />
              <span>{tg.colorName}</span>
            </div>
          );
        })}
        {tie
          ? (() => {
              const a = tags.find((x) => x.name === tie.names[0]);
              const b = tags.find((x) => x.name === tie.names[1]);
              if (!a || !b) return null;
              const p = ease(frame, fps, tie.atSec, 0.7);
              const sh = 12 * ease(frame, fps, tie.atSec + 0.5, 0.5);
              const x1 = a.x + 17 - sh;
              const x2 = b.x + 17 - sh;
              const y1 = a.y + 31;
              const y2 = b.y + 31;
              const d = `M ${x1} ${y1} C ${x1 - 40} ${y1 + 60}, ${x2 - 30} ${y2 + 70}, ${x2} ${y2} C ${x2 + 20} ${y2 - 30}, ${x1 + 30} ${y1 - 34}, ${x1} ${y1}`;
              return (
                <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
                  <path d={d} fill="none" stroke={sheet} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.9} />
                </svg>
              );
            })()
          : null}
      </AbsoluteFill>

      {/* pull-quotes on the desk, under the tissue */}
      {quotes.map((q) => {
        const a = reveal(frame, fps, q.atSec, 0.6);
        const out = exit(frame, fps, q.untilSec, 0.6);
        if (a * out <= 0) return null;
        return (
          <div key={`${q.atSec}`} style={{ position: "absolute", left: 1130, top: 770, width: 680, opacity: a * out, transform: `translateY(${(1 - a) * 14}px)` }}>
            {q.kicker ? <div style={{ fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 3, color: t.colors.secondary, marginBottom: 16 }}>{q.kicker}</div> : null}
            {q.text ? <div style={{ fontFamily: t.fonts.serif, fontWeight: 600, fontSize: 62, lineHeight: 1.12, color: t.colors.ink, opacity: q.textAtSec !== undefined ? interpolate(frame, [sec(q.textAtSec, fps), sec(q.textAtSec, fps) + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1 }}>{q.text}</div> : null}
            {q.by ? <div style={{ marginTop: 20, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.secondary, opacity: q.byAtSec !== undefined ? reveal(frame, fps, q.byAtSec, 0.6) : 1 }}>{q.by}</div> : null}
          </div>
        );
      })}

      <div style={{ position: "absolute", right: t.safe.x, top: t.safe.y, fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "8px 14px", borderRadius: 4, borderLeft: `3px solid ${t.colors.accent}` }}>REPORTED COLOURS</div>
      <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, lineHeight: 1.6, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, whiteSpace: "pre" }}>{caption}</div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
