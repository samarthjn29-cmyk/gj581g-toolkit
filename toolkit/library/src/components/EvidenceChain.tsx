import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { drift, reveal, sec, SLOW_OUT } from "../motion";

// VIS-053 EvidenceChain (Johnny Harris, 'The Secret Trump Investigation Nobody is Talking About': octagon chips with
// an icon or a portrait and a small-caps label, linked by solid and dashed lines, a money chip travelling along a
// link; analysis only; Sam, 23 Nov 2026: "learn from the presenter and build better cinematics"). Who or what is
// linked to what, built link by link on the words: each node lands on its word (an own line icon, a real registered
// portrait or page, or a word), each link draws on, solid for a known link and dashed (its dashes crawling) for one
// that is only suspected or claimed, and a small token (a letter, a parcel, a sum) can travel along a link.
// Best use: a chain of evidence or of hands (a paper read to a society, an eye kept in a jar, a test 150 years later);
// who wrote to whom. Limit: 3-7 nodes; links 0.6-1.2 s; at most 2 tokens; portraits are real registered photos of
// real people, never drawings of them; a dashed link is said as uncertain in the narration; max 2 per act.
type XY = readonly [number, number];
export type ChainIcon = "letter" | "book" | "eye" | "question" | "person" | "house" | "page" | "flask" | "bank" | "jar";
export type ChainNode = { id: string; at: XY; atSec: number; label: string; sub?: string; icon?: ChainIcon; srcId?: string; file?: string; imgSize?: readonly [number, number]; focus?: readonly [number, number]; word?: string; accent?: boolean; size?: number };
export type ChainLink = { from: string; to: string; atSec: number; sec?: number; dashed?: boolean; label?: string; token?: { text: string; atSec: number; sec?: number } };
export type EvidenceChainProps = { nodes: ChainNode[]; links: ChainLink[]; caption?: string; startSec?: number };

export const Icon: React.FC<{ k: ChainIcon; c: string; s: number }> = ({ k, c, s }) => {
  const p = { fill: "none", stroke: c, strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const body: Record<ChainIcon, React.ReactNode> = {
    letter: <><rect x={-24} y={-16} width={48} height={32} rx={2} {...p} /><path d="M -24 -14 L 0 4 L 24 -14" {...p} /></>,
    book: <><path d="M -24 -16 Q -12 -20 0 -14 Q 12 -20 24 -16 L 24 16 Q 12 12 0 18 Q -12 12 -24 16 Z" {...p} /><path d="M 0 -14 L 0 18" {...p} /></>,
    eye: <><path d="M -26 0 Q 0 -22 26 0 Q 0 22 -26 0 Z" {...p} /><circle r={7.5} {...p} /><circle r={2.2} fill={c} /></>,
    question: <><path d="M -10 -10 Q -10 -22 2 -22 Q 13 -22 13 -11 Q 13 -3 3 1 L 2 8" {...p} /><circle cx={2} cy={18} r={2.4} fill={c} /></>,
    person: <><circle cy={-10} r={10} {...p} /><path d="M -22 22 Q -20 4 0 4 Q 20 4 22 22" {...p} /></>,
    house: <><path d="M -22 -2 L 0 -22 L 22 -2" {...p} /><path d="M -16 -6 L -16 20 L 16 20 L 16 -6" {...p} /><path d="M -5 20 L -5 8 L 5 8 L 5 20" {...p} /></>,
    page: <><path d="M -16 -22 L 8 -22 L 18 -12 L 18 22 L -16 22 Z" {...p} /><path d="M 8 -22 L 8 -12 L 18 -12 M -9 -4 L 11 -4 M -9 4 L 11 4 M -9 12 L 5 12" {...p} /></>,
    flask: <><path d="M -6 -22 L 6 -22 M -4 -22 L -4 -6 L -18 18 Q -19 22 -14 22 L 14 22 Q 19 22 18 18 L 4 -6 L 4 -22" {...p} /><path d="M -11 8 L 11 8" {...p} /></>,
    bank: <><path d="M -24 -8 L 0 -22 L 24 -8 Z" {...p} /><path d="M -16 -4 L -16 14 M -5 -4 L -5 14 M 5 -4 L 5 14 M 16 -4 L 16 14 M -24 20 L 24 20" {...p} /></>,
    jar: <><path d="M -12 -22 L 12 -22 M -10 -22 L -10 -16 Q -20 -12 -20 0 L -20 16 Q -20 22 -14 22 L 14 22 Q 20 22 20 16 L 20 0 Q 20 -12 10 -16 L 10 -22" {...p} /><circle cy={4} r={6} {...p} /></>,
  };
  return <g transform={`scale(${s / 64})`}>{body[k]}</g>;
};

const octagon = (r: number) => {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = Math.PI / 8 + (i * Math.PI) / 4;
    return `${(50 + 50 * Math.cos(a)).toFixed(2)}% ${(50 + 50 * Math.sin(a)).toFixed(2)}%`;
  });
  return { clip: `polygon(${pts.join(", ")})`, r };
};

const NodeImage: React.FC<{ n: ChainNode; size: number }> = ({ n, size }) => {
  const src = useSourceFile(n.srcId as string, n.file);
  const f = n.focus ?? [0.5, 0.35];
  return <Img src={src} style={{ position: "absolute", inset: 0, width: size, height: size, objectFit: "cover", objectPosition: `${f[0] * 100}% ${f[1] * 100}%`, filter: "grayscale(0.35) sepia(0.25) contrast(1.05)" }} />;
};

export const EvidenceChain: React.FC<EvidenceChainProps> = ({ nodes, links, caption, startSec = 0 }) => {
  useAssets(["VIS-053", "MOT-001", "MOT-002", ...nodes.filter((n) => n.srcId).map((n) => n.srcId as string)]);
  if (nodes.length < 3 || nodes.length > 7) throw new Error("EvidenceChain: 3-7 nodes.");
  if (links.filter((l) => l.token).length > 2) throw new Error("EvidenceChain: at most 2 tokens.");
  links.forEach((l) => {
    if ((l.sec ?? 0.8) < 0.6 || (l.sec ?? 0.8) > 1.2) throw new Error("EvidenceChain: links draw on in 0.6-1.2 s.");
  });
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const z = drift(frame, durationInFrames, 0.025);
  const pIn = reveal(frame, fps, startSec, 0.75);
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          {links.map((l, i) => {
            const a = byId[l.from];
            const b = byId[l.to];
            if (!a || !b) throw new Error(`EvidenceChain: link ${l.from}-${l.to} names a missing node.`);
            const d = l.sec ?? 0.8;
            const p = interpolate(frame, [sec(l.atSec, fps), sec(l.atSec + d, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
            if (p <= 0) return null;
            const ra = (a.size ?? 132) / 2 + 10;
            const rb = (b.size ?? 132) / 2 + 10;
            const L = Math.hypot(b.at[0] - a.at[0], b.at[1] - a.at[1]);
            const ux = (b.at[0] - a.at[0]) / L;
            const uy = (b.at[1] - a.at[1]) / L;
            const x0 = a.at[0] + ux * ra;
            const y0 = a.at[1] + uy * ra;
            const x1 = b.at[0] - ux * rb;
            const y1 = b.at[1] - uy * rb;
            const xe = x0 + (x1 - x0) * p;
            const ye = y0 + (y1 - y0) * p;
            const crawl = (frame / fps) * 26;
            const tk = l.token;
            const tp = tk ? Easing.inOut(Easing.cubic)(interpolate(frame, [sec(tk.atSec, fps), sec(tk.atSec + (tk.sec ?? 1.4), fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 0;
            const tVis = tk ? interpolate(frame, [sec(tk.atSec, fps), sec(tk.atSec + 0.25, fps), sec(tk.atSec + (tk.sec ?? 1.4), fps), sec(tk.atSec + (tk.sec ?? 1.4) + 0.35, fps)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
            const lp = reveal(frame, fps, l.atSec + d * 0.6, 0.6);
            return (
              <g key={i}>
                <line x1={x0} y1={y0} x2={xe} y2={ye} stroke={t.colors.ink} strokeOpacity={0.7} strokeWidth={3} strokeLinecap="round" strokeDasharray={l.dashed ? "12 12" : undefined} strokeDashoffset={l.dashed ? -crawl : undefined} />
                {l.label && lp > 0 ? (
                  <text x={(x0 + x1) / 2} y={(y0 + y1) / 2 - 16} textAnchor="middle" fontFamily={t.fonts.mono} fontSize={20} letterSpacing={2} fill={t.colors.secondary} opacity={lp}>
                    {l.label}
                  </text>
                ) : null}
                {tk && tVis > 0 ? (
                  <g transform={`translate(${x0 + (x1 - x0) * tp} ${y0 + (y1 - y0) * tp})`} opacity={tVis}>
                    <rect x={-(tk.text.length * 8.4 + 18)} y={-17} width={2 * (tk.text.length * 8.4 + 18)} height={34} rx={17} fill={t.colors.accent} />
                    <text y={7} textAnchor="middle" fontFamily={t.fonts.mono} fontSize={18} letterSpacing={2} fill={t.colors.canvas}>
                      {tk.text}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
        {nodes.map((n) => {
          const a = reveal(frame, fps, n.atSec, 0.7);
          if (a <= 0) return null;
          const size = n.size ?? 132;
          const o = octagon(size / 2);
          const ring = n.accent ? t.colors.accent : t.colors.ink;
          return (
            <div key={n.id} style={{ position: "absolute", left: n.at[0] - size / 2, top: n.at[1] - size / 2, width: size, height: size, opacity: a, transform: `translateY(${(1 - a) * 14}px) scale(${0.94 + 0.06 * a})` }}>
              <div style={{ position: "absolute", inset: -6, clipPath: o.clip, background: ring, opacity: 0.9 }} />
              <div style={{ position: "absolute", inset: 0, clipPath: o.clip, background: t.colors.panel, overflow: "hidden" }}>
                {n.srcId ? <NodeImage n={n} size={size} /> : null}
                {!n.srcId && n.icon ? (
                  <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} style={{ position: "absolute", inset: 0 }}>
                    <Icon k={n.icon} c={t.colors.ink} s={size * 0.62} />
                  </svg>
                ) : null}
                {!n.srcId && !n.icon && n.word ? (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: t.fonts.serif, fontWeight: 600, fontSize: size * 0.3, color: t.colors.ink }}>{n.word}</div>
                ) : null}
              </div>
              <div style={{ position: "absolute", left: size / 2, top: size + 14, transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center" }}>
                <div style={{ fontFamily: t.fonts.mono, fontSize: 22, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "5px 11px", borderRadius: 3 }}>{n.label}</div>
                {n.sub ? <div style={{ marginTop: 6, fontFamily: t.fonts.mono, fontSize: 18, letterSpacing: 2, color: t.colors.secondary }}>{n.sub}</div> : null}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      {caption ? <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>{caption}</div> : null}
    </AbsoluteFill>
  );
};
