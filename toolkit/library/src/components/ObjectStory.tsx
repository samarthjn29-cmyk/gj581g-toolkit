import React from "react";
import { AbsoluteFill, Img, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { drift, exit, reveal, sec, snap, SLOW_OUT } from "../motion";
import { Label, type LabelSpec } from "../layers/Label";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-049 ObjectStory (Sam, WCL-E01 act 2 Gate 3: "I don't like how this picture is coming on the whole screen";
// he picked option A, "the parcel"): one real object, cut out of its registered photo by its mask, is carried
// through a short story on the theme canvas, never larger than about half the frame:
//   window -> a drawn shop window, the object small on its shelf (our drawing; ILLUSTRATION chip); it slides away
//             and the object sits left with quote cards on the right; its colour follows `states`;
//   parcel -> kraft flaps, string and a tag wrap the object at the centre, then part again (the present opened);
//   views  -> the object moves into the first of 2-4 columns, one per person, each copy in the colour that person
//             REPORTED (VIS-035's rule: the REPORTED COLOURS tag stays; never "what they saw").
// Best use: a story about one object passed between people who then disagree about it (bought, wrapped, given,
// seen differently). Limit: 1 per episode, max 16 beats; a real registered photo with its mask and caption (a
// period piece is captioned as one, never as the person's own); drawn settings tagged ILLUSTRATION.
export type ObjectState = { atSec: number; color: string | null; snap?: boolean; sec?: number };
export type ObjectNote = { atSec: number; untilSec?: number; head?: string; text?: string; textAtSec?: number; by?: string; accent?: boolean };
export type ObjectView = { name: string; color: string; colorName: string; atSec: number };
export type ObjectStoryProps = {
  srcId: string;
  file: string; // flat photo
  mask: string; // object mask (alpha), same source
  size: readonly [number, number];
  bbox: readonly [number, number, number, number]; // the object's box in the photo: x, y, w, h
  window?: { atSec: number; objectAtSec?: number; outAtSec: number }; // drawn shop window; the object appears, then leaves it
  parcel?: { atSec: number; openAtSec: number; tag: string; tagAtSec?: number }; // wrap, then unwrap
  views?: { atSec: number; columns: ObjectView[]; focus?: { index: number; atSec: number } };
  states?: ObjectState[];
  notes?: ObjectNote[];
  labels?: LabelSpec[];
  tag?: DatelineTagProps;
  caption: string;
  illustration?: [number, number][]; // spans that show our own drawings (window, parcel): ILLUSTRATION chip
  startSec?: number;
};

const ease = (frame: number, fps: number, at: number, dur: number) =>
  interpolate(frame, [sec(at, fps), sec(at + dur, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const VIEW_W = 420; // a copy in a view column

// The object alone, cut out by its mask, tinted by a masked multiply layer (white = as photographed).
const Cut: React.FC<{ img: string; msk: string; size: readonly [number, number]; bbox: ObjectStoryProps["bbox"]; width: number; color: string; dim?: number }> = ({ img, msk, size, bbox, width, color, dim = 1 }) => {
  const s = width / bbox[2];
  const full: React.CSSProperties = { position: "absolute", left: -bbox[0] * s, top: -bbox[1] * s, width: size[0] * s, height: size[1] * s, maxWidth: "none", WebkitMaskImage: `url(${msk})`, maskImage: `url(${msk})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" };
  return (
    <div style={{ position: "relative", width, height: bbox[3] * s, overflow: "hidden", isolation: "isolate", filter: `drop-shadow(0 18px 24px rgba(0,0,0,0.45)) brightness(${dim})` }}>
      <Img src={img} style={{ ...full, filter: "contrast(1.03)" }} />
      <div style={{ ...full, background: color, mixBlendMode: "multiply" }} />
    </div>
  );
};

export const ObjectStory: React.FC<ObjectStoryProps> = ({ srcId, file, mask, size, bbox, window: win, parcel, views, states = [], notes = [], labels = [], tag, caption, illustration = [], startSec = 0 }) => {
  useAssets(["VIS-049", "VIS-035", "MOT-001", ...(states.some((s) => s.snap) ? ["MOT-011"] : [])]);
  if (views && (views.columns.length < 2 || views.columns.length > 4)) throw new Error("ObjectStory: 2-4 view columns.");
  const t = useTheme();
  const img = useSourceFile(srcId, file);
  const msk = useSourceFile(srcId, mask);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const now = frame / fps;
  const kraft = t.colors.kraft ?? interpolateColors(0.42, [0, 1], [t.colors.ink, t.colors.panel]);
  const kraftEdge = interpolateColors(0.35, [0, 1], [kraft, t.colors.canvas]);

  // colour of the travelling object
  let color = "#FFFFFF";
  for (const st of states) {
    if (now < st.atSec) break;
    const target = st.color ?? "#FFFFFF";
    const p = st.snap ? snap(frame, fps, st.atSec, st.sec ?? 0.6) : ease(frame, fps, st.atSec, st.sec ?? 0.9);
    color = interpolateColors(p, [0, 1], [color, target]);
  }

  // stage progress
  const wIn = win ? ease(frame, fps, win.atSec, 1.1) : 0; // window draws on
  const wOut = win ? ease(frame, fps, win.outAtSec, 0.9) : 1; // window slides away
  const pWrap = parcel ? ease(frame, fps, parcel.atSec + 0.35, 0.7) : 0; // flaps close
  const pString = parcel ? ease(frame, fps, parcel.atSec + 0.95, 0.5) : 0;
  const pTag = parcel ? ease(frame, fps, parcel.tagAtSec ?? parcel.atSec + 1.2, 0.7) : 0;
  const pOpen = parcel ? ease(frame, fps, parcel.openAtSec, 0.9) : 0;

  // views: one column per person
  const colX = views ? views.columns.map((_, i, a) => 960 + (i - (a.length - 1) / 2) * 560) : [];
  const focusP = views?.focus ? ease(frame, fps, views.focus.atSec, 0.6) : 0;

  // the travelling object's place: a chain of keyframes, each eased in over 0.9 s from its time
  type K = { at: number; w: number; x: number; y: number };
  const keys: K[] = [];
  if (win) keys.push({ at: -1, w: 560, x: 960, y: 560 });
  keys.push({ at: win ? win.outAtSec : -1, w: 760, x: 640, y: 520 }); // left, beside the notes
  if (parcel) {
    keys.push({ at: parcel.atSec, w: 430, x: 960, y: 520 }); // centre, to be wrapped
    keys.push({ at: parcel.openAtSec, w: 760, x: 640, y: 520 });
  }
  if (views) keys.push({ at: views.atSec, w: VIEW_W, x: colX[0], y: 500 });
  let { w, x: objX, y: cy } = keys[0];
  for (const k of keys.slice(1)) {
    const p = ease(frame, fps, k.at, 0.9);
    w = mix(w, k.w, p);
    objX = mix(objX, k.x, p);
    cy = mix(cy, k.y, p);
  }
  const h = (bbox[3] / bbox[2]) * w;
  const objIn = win ? ease(frame, fps, win.objectAtSec ?? win.atSec + 0.5, 0.7) : 1;

  // window frame (our drawing)
  const FR = { x: 960 - 430, y: 210, w: 860, h: 600 };
  const perim = 2 * (FR.w + FR.h);
  const wx = -1500 * wOut;
  const wOpacity = win ? 1 - wOut : 0;
  const pIn = reveal(frame, fps, startSec, 0.9);
  const cam = drift(frame, durationInFrames, 0.02);
  const illus = illustration.reduce((m, [a0, b0]) => Math.max(m, Math.min(reveal(frame, fps, a0, 0.6), exit(frame, fps, b0, 0.6))), 0);

  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {/* the shop window */}
        {wOpacity > 0.01 ? (
          <svg width={1920} height={1080} style={{ position: "absolute", left: wx, top: 0, opacity: wOpacity }}>
            <rect x={FR.x} y={FR.y} width={FR.w} height={FR.h} rx={6} fill={t.colors.panel} fillOpacity={0.55 * wIn} />
            <rect x={FR.x} y={FR.y} width={FR.w} height={FR.h} rx={6} fill="none" stroke={t.colors.ink} strokeOpacity={0.75} strokeWidth={5} strokeDasharray={perim} strokeDashoffset={perim * (1 - wIn)} />
            {[1, 2].map((k) => (
              <line key={k} x1={FR.x + (FR.w * k) / 3} y1={FR.y} x2={FR.x + (FR.w * k) / 3} y2={FR.y + 150} stroke={t.colors.ink} strokeOpacity={0.45 * wIn} strokeWidth={3} />
            ))}
            <line x1={FR.x} y1={FR.y + 150} x2={FR.x + FR.w} y2={FR.y + 150} stroke={t.colors.ink} strokeOpacity={0.45 * wIn} strokeWidth={3} />
            {/* shelf and sill */}
            <line x1={FR.x + 90} y1={FR.y + 470} x2={FR.x + FR.w - 90} y2={FR.y + 470} stroke={t.colors.ink} strokeOpacity={0.5 * wIn} strokeWidth={4} />
            <rect x={FR.x - 30} y={FR.y + FR.h} width={FR.w + 60} height={22} rx={3} fill={t.colors.ink} fillOpacity={0.55 * wIn} />
            {/* glass reflections */}
            {[0, 1].map((k) => (
              <line key={k} x1={FR.x + 120 + k * 70} y1={FR.y + 560} x2={FR.x + 300 + k * 70} y2={FR.y + 190} stroke={t.colors.ink} strokeOpacity={0.08 * wIn} strokeWidth={26} strokeLinecap="round" />
            ))}
          </svg>
        ) : null}

        {/* view columns 2..n (column 1 is the travelling object itself) */}
        {views
          ? views.columns.map((v, i) => {
              const a = ease(frame, fps, v.atSec, 0.8);
              const dim = views.focus ? (i === views.focus.index ? 1 : 1 - 0.45 * focusP) : 1;
              const x = colX[i];
              return (
                <React.Fragment key={v.name}>
                  <div style={{ position: "absolute", left: x - 250, top: 300, width: 500, height: 400, borderRadius: 8, background: t.colors.panel, opacity: a * (0.4 + 0.6 * dim), boxShadow: views.focus && i === views.focus.index ? `0 0 0 ${3 * focusP}px ${t.colors.ink}` : undefined }} />
                  {i > 0 && a > 0 ? (
                    <div style={{ position: "absolute", left: x - VIEW_W / 2, top: 500 - ((bbox[3] / bbox[2]) * VIEW_W) / 2 + (1 - a) * 30, opacity: a }}>
                      <Cut img={img} msk={msk} size={size} bbox={bbox} width={VIEW_W} color={v.color} dim={0.55 + 0.45 * dim} />
                    </div>
                  ) : null}
                  <div style={{ position: "absolute", left: x, top: 740, transform: `translate(-50%, ${(1 - a) * 16}px)`, opacity: a * (0.5 + 0.5 * dim), display: "flex", alignItems: "center", gap: 14, fontFamily: t.fonts.mono, fontSize: 28, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "10px 16px", borderRadius: 4 }}>
                    <span>{v.name}</span>
                    <span style={{ width: 30, height: 30, borderRadius: 3, background: v.color, border: `2px solid ${t.colors.ink}` }} />
                    <span style={{ color: t.colors.secondary }}>{v.colorName}</span>
                  </div>
                </React.Fragment>
              );
            })
          : null}

        {/* the travelling object */}
        {(() => {
          const col0 = views ? views.columns[0] : null;
          const c = col0 ? interpolateColors(views ? ease(frame, fps, views.atSec, 0.9) : 0, [0, 1], [color, col0.color]) : color;
          const dim0 = views?.focus ? (views.focus.index === 0 ? 1 : 1 - 0.45 * focusP) : 1;
          return (
            <div style={{ position: "absolute", left: objX - w / 2, top: cy - h / 2, opacity: objIn }}>
              <Cut img={img} msk={msk} size={size} bbox={bbox} width={w} color={c} dim={0.55 + 0.45 * dim0} />
            </div>
          );
        })()}

        {/* the parcel: two kraft flaps close over the object, string, a tag; they part at `openAtSec` */}
        {parcel && pWrap > 0 && pOpen < 1 ? (
          (() => {
            const pw = 620;
            const ph = 360;
            const px = 960 - pw / 2;
            const py = 520 - ph / 2;
            const close = pWrap * (1 - pOpen);
            const o = 1 - pOpen;
            return (
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
                <rect x={px - (1 - close) * 700} y={py} width={pw / 2 + 4} height={ph} fill={kraft} stroke={kraftEdge} strokeWidth={3} />
                <rect x={px + pw / 2 - 4 + (1 - close) * 700} y={py} width={pw / 2 + 4} height={ph} fill={kraft} stroke={kraftEdge} strokeWidth={3} />
                {[0.25, 0.55, 0.8].map((k, i) => (
                  <line key={i} x1={px + 30} y1={py + ph * k} x2={px + pw - 30} y2={py + ph * k + 6} stroke={kraftEdge} strokeOpacity={0.35 * close} strokeWidth={2} />
                ))}
                <line x1={960} y1={py} x2={960} y2={py + ph * pString} stroke={t.colors.ink} strokeWidth={4} strokeOpacity={0.9 * close} />
                <line x1={px} y1={520} x2={px + pw * pString} y2={520} stroke={t.colors.ink} strokeWidth={4} strokeOpacity={0.9 * close} />
                <g opacity={pTag * close} transform={`translate(${960 + 40} ${520 + 18}) rotate(${(1 - pTag) * -18 + 6})`}>
                  <line x1={-40} y1={-18} x2={0} y2={20} stroke={t.colors.ink} strokeWidth={2} />
                  <rect x={0} y={20} width={360} height={76} rx={6} fill={t.colors.ink} />
                  <circle cx={22} cy={58} r={7} fill={kraft} />
                  <text x={194} y={68} textAnchor="middle" fontFamily={t.fonts.mono} fontSize={28} letterSpacing={2} fill={t.colors.canvas}>{parcel.tag}</text>
                </g>
              </svg>
            );
          })()
        ) : null}
      </AbsoluteFill>

      {/* quote cards on the right while the object sits open */}
      {notes.map((n) => {
        const a = reveal(frame, fps, n.atSec, 0.7);
        const out = n.untilSec !== undefined ? exit(frame, fps, n.untilSec, t.motion.enterSec) : 1;
        if (a * out <= 0) return null;
        return (
          <div key={`${n.text}${n.atSec}`} style={{ position: "absolute", left: 1120, top: 360, width: 620, opacity: a * out, transform: `translateY(${(1 - a) * 18}px)` }}>
            {n.head ? <div style={{ fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 3, color: t.colors.secondary, marginBottom: 18 }}>{n.head}</div> : null}
            {n.text ? <div style={{ fontFamily: t.fonts.serif, fontWeight: 600, fontSize: 56, lineHeight: 1.15, color: n.accent ? t.colors.accent : t.colors.ink, opacity: n.textAtSec !== undefined ? reveal(frame, fps, n.textAtSec, 0.6) : 1 }}>{n.text}</div> : null}
            {n.by ? <div style={{ marginTop: 18, fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 2, color: t.colors.secondary }}>{n.by}</div> : null}
          </div>
        );
      })}
      {labels.map((l) => (
        <Label key={`${l.text}${l.atSec}`} spec={l} />
      ))}
      <div style={{ position: "absolute", right: t.safe.x, top: t.safe.y, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "8px 14px", borderRadius: 4, borderLeft: `3px solid ${t.colors.accent}` }}>REPORTED COLOURS</div>
        {illus > 0 ? <div style={{ fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 3, color: t.colors.secondary, background: t.colors.chip, padding: "6px 12px", borderRadius: 4, opacity: illus }}>ILLUSTRATION</div> : null}
      </div>
      <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{caption}</div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
