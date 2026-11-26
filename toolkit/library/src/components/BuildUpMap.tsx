import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { isLightTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, reveal, sec, SLOW_OUT } from "../motion";
import { chapterColour } from "../themes/chapterKey";

// VIS-048 BuildUpMap (studied Johnny Harris, 'I don't get democracy', 22 Nov 2026; analysis only: his numbered
// drawers and foam pieces that fit into one cube). Ours: one paper board that grows across the episode. Each act
// adds its idea as a coloured pill (LOK-026 ChapterColourKey) with a small silhouette icon of our own and two or
// three mono keywords; a dashed path joins them in order. At the end the pills' colours lift off as ring segments
// and fit together into one ring (the pieces of one question).
// Best use: an episode built from 3-7 named ideas, shown again at each act end and as the recap. Limit: 1 per
// episode, at most once per act plus the recap; labels and keywords are the narration's own words; no real people.
export type MapIcon = "flower" | "page" | "eye" | "prism" | "candle" | "question" | "box" | "people" | "brothers";
export type BuildUpMapProps = {
  title?: string;
  nodes: { act: number; label: string; keywords?: string[]; icon: MapIcon; atSec: number }[];
  focus?: { act: number; atSec: number }; // this act's pill stays bright, the others dim
  assembleAtSec?: number; // the pieces fit together into one ring
  ringLabel?: string; // the word in the ring's centre after it closes
  slots?: number; // places on the board for the whole episode (default: the nodes given), so an act's early map keeps its places
  startSec?: number;
};

const BOARD = { x: 120, y: 110, w: 1680, h: 860 };

const Icon: React.FC<{ kind: MapIcon; color: string; detail: string; size?: number }> = ({ kind, color, detail, size = 64 }) => {
  const s = size / 64;
  const g = (children: React.ReactNode) => (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }}>
      <g fill={color} stroke="none">
        {children}
      </g>
    </svg>
  );
  void s;
  switch (kind) {
    case "flower":
      return g(
        <>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={32} cy={18} rx={8} ry={12} transform={`rotate(${a} 32 30)`} />
          ))}
          <circle cx={32} cy={30} r={6} fill="none" stroke={color} strokeWidth={3} />
          <rect x={30.5} y={40} width={3} height={22} />
        </>,
      );
    case "page":
      return g(
        <>
          <path d="M14 6 H40 L50 16 V58 H14 Z" />
          <path d="M40 6 V16 H50" fill="none" stroke={detail} strokeOpacity={0.6} strokeWidth={2} />
        </>,
      );
    case "eye":
      return g(
        <>
          <path d="M4 32 C16 14, 48 14, 60 32 C48 50, 16 50, 4 32 Z" />
          <circle cx={32} cy={32} r={9} fill={detail} fillOpacity={0.8} />
        </>,
      );
    case "prism":
      return g(<path d="M32 8 L58 54 H6 Z" />);
    case "candle":
      return g(
        <>
          <rect x={24} y={28} width={16} height={32} rx={2} />
          <path d="M32 6 C38 14, 38 20, 32 24 C26 20, 26 14, 32 6 Z" />
        </>,
      );
    case "question":
      return g(
        <text x={32} y={52} textAnchor="middle" fontSize={56} fontFamily="Fraunces, serif" fontWeight={600}>
          ?
        </text>,
      );
    case "box":
      return g(
        <>
          <rect x={8} y={24} width={48} height={32} rx={2} />
          <rect x={4} y={16} width={56} height={10} rx={2} />
        </>,
      );
    case "people":
    case "brothers":
      return g(
        <>
          <circle cx={22} cy={18} r={8} />
          <path d="M8 58 C8 38, 36 38, 36 58 Z" />
          <circle cx={44} cy={20} r={7} />
          <path d="M32 58 C32 40, 56 40, 56 58 Z" />
        </>,
      );
  }
};

export const BuildUpMap: React.FC<BuildUpMapProps> = ({ title, nodes, focus, assembleAtSec, ringLabel, slots, startSec = 0 }) => {
  useAssets(["VIS-048", "LOK-026", "MOT-002", "MOT-005"]);
  const places = slots ?? nodes.length;
  if (nodes.length < 2 || places < 3 || places > 7 || nodes.length > places) throw new Error("BuildUpMap: 2-7 ideas on 3-7 places.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // light themes flip the roles (LESSONS 25 Nov 2026): the board is the light panel with dark ink; graphite unchanged
  const paper = isLightTheme(t) ? t.colors.panel : t.colors.ink;
  const ink = isLightTheme(t) ? t.colors.ink : t.colors.canvas;
  const n = nodes.length;
  // Nodes along a gentle wave across the board, alternating high and low so labels never collide.
  const pos = nodes.map((_, i) => ({
    x: BOARD.x + 200 + (i * (BOARD.w - 400)) / Math.max(1, places - 1),
    y: BOARD.y + BOARD.h / 2 + (i % 2 === 0 ? -150 : 150) + (title ? 30 : 0),
  }));
  const pIn = reveal(frame, fps, startSec, t.motion.enterSec);
  const a = assembleAtSec !== undefined ? sec(assembleAtSec, fps) : null;
  const ap = a === null ? 0 : interpolate(frame, [a, a + sec(1.4, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
  const f = focus ? sec(focus.atSec, fps) : 0;
  const fp = focus ? interpolate(frame, [f, f + sec(0.6, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const cx = BOARD.x + BOARD.w / 2;
  const cy = BOARD.y + BOARD.h / 2 + (title ? 40 : 0);
  const R = 210;
  const seg = (i: number) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.03;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - 0.03;
    const p = (ang: number, r: number) => `${Math.cos(ang) * r} ${Math.sin(ang) * r}`;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${p(a0, R)} A ${R} ${R} 0 ${large} 1 ${p(a1, R)} L ${p(a1, R - 64)} A ${R - 64} ${R - 64} 0 ${large} 0 ${p(a0, R - 64)} Z`;
  };

  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <div style={{ position: "absolute", left: BOARD.x, top: BOARD.y, width: BOARD.w, height: BOARD.h, background: paper, borderRadius: 6, boxShadow: "0 40px 80px rgba(0,0,0,0.5)", transform: `scale(${drift(frame, durationInFrames, 0.012)})` }} />
      {title ? (
        <div style={{ position: "absolute", left: BOARD.x, width: BOARD.w, top: BOARD.y + 48, textAlign: "center", fontFamily: t.fonts.mono, fontSize: 30, letterSpacing: 5, color: ink, opacity: 0.8 * (1 - ap) + 0.2 }}>
          {title}
        </div>
      ) : null}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* The path: one dashed segment between each pair of shown pieces, from the high piece's pill side to the
            low piece's icon side, so it never runs through a label; it draws on as the later piece arrives. */}
        {pos.slice(1).map((q, k) => {
          const p0 = pos[k];
          const st = nodes[k + 1] ? sec(nodes[k + 1].atSec, fps) : null;
          if (st === null) return null;
          const dp = interpolate(frame, [st, st + sec(0.8, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
          if (dp <= 0) return null;
          // A V into each low piece (gate 3 act 2 reviews: lines through RED BY CANDLE, then flat dashes that read as
          // one line over the low piece): the higher piece's end leaves from the side of its pill that faces the
          // other piece; the lower piece's end lands on the near side of its icon, above its pill and keywords.
          const side = Math.sign(q.x - p0.x) || 1;
          const pillHalf = (i: number) => (nodes[i].label.length * 23 + 44) / 2; // serif 44 px, 22 px padding a side
          const pillEnd = (i: number, c: { x: number; y: number }, dir: number) => ({ x: c.x + dir * (pillHalf(i) + 14), y: c.y + 5 });
          const iconEnd = (c: { x: number; y: number }, dir: number) => ({ x: c.x + dir * 52, y: c.y - 80 });
          const p0High = p0.y <= q.y;
          const a0 = p0High ? pillEnd(k, p0, side) : iconEnd(p0, side);
          const b0 = p0High ? iconEnd(q, -side) : pillEnd(k + 1, q, -side);
          const ax = a0.x;
          const ay = a0.y;
          const bx = b0.x;
          const by = b0.y;
          return <line key={k} x1={ax} y1={ay} x2={ax + (bx - ax) * dp} y2={ay + (by - ay) * dp} stroke={ink} strokeOpacity={0.35 * (1 - ap)} strokeWidth={3} strokeDasharray="10 12" strokeLinecap="round" />;
        })}
        {nodes.map((nd, i) => {
          const s0 = sec(nd.atSec, fps);
          const pn = interpolate(frame, [s0, s0 + sec(0.6, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
          if (pn <= 0) return null;
          const x = pos[i].x + (cx - pos[i].x) * ap;
          const y = pos[i].y + (cy - pos[i].y) * ap;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${0.25 + 0.75 * Math.max(pn * (1 - ap), ap)})`} opacity={pn}>
              <path d={seg(i)} fill={chapterColour(nd.act)} opacity={ap} />
            </g>
          );
        })}
      </svg>
      {nodes.map((nd, i) => {
        const pn = reveal(frame, fps, nd.atSec, 0.6);
        if (pn <= 0) return null;
        // pieces that arrive after the focus (the next question) stay bright
        const dim = focus && nd.act !== focus.act && nd.atSec <= focus.atSec ? 1 - 0.5 * fp : 1;
        const col = chapterColour(nd.act);
        return (
          <div key={i} style={{ position: "absolute", left: pos[i].x - 190, top: pos[i].y - 118, width: 380, display: "flex", flexDirection: "column", alignItems: "center", opacity: pn * dim * (1 - ap), transform: `translateY(${(1 - pn) * 18}px)` }}>
            <Icon kind={nd.icon} color={ink} detail={paper} size={76} />
            <div style={{ marginTop: 10, padding: "10px 22px", borderRadius: 40, background: col, fontFamily: t.fonts.serif, fontWeight: 600, fontSize: 44, color: ink, whiteSpace: "nowrap", boxShadow: focus?.act === nd.act ? `0 0 0 ${4 * fp}px ${ink}` : undefined }}>{nd.label}</div>
            <div style={{ marginTop: 10, fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 2, color: ink, opacity: 0.7, textAlign: "center", lineHeight: 1.5 }}>
              {(nd.keywords ?? []).map((k) => (
                <div key={k}>{k}</div>
              ))}
            </div>
          </div>
        );
      })}
      {ringLabel && a !== null ? (
        <div style={{ position: "absolute", left: cx - 200, width: 400, top: cy - 44, textAlign: "center", fontFamily: t.fonts.serif, fontWeight: 600, fontSize: 72, color: ink, opacity: interpolate(frame, [a + sec(1.2, fps), a + sec(1.8, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {ringLabel}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
