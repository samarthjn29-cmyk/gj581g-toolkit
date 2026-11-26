import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSource } from "../registry";
import { drift, exit, reveal, rise } from "../motion";
import { CropImage, type Rect } from "../layers/CropImage";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";
import { InkPressFilter } from "../layers/PaperFibre";
import { FillLine, type WordFill } from "../layers/FillWord";
import { HatchNotebook, type NotebookSpec } from "../layers/HatchNotebook";
import { Typed, type TypeSpec } from "../layers/TypewriterLine";
import { Strike, type StrikeSpec } from "../layers/StrikeThrough";
import { Ruled, type RuledSpec } from "../layers/RuledTitle";

// VIS-020 KineticLine (beat type 3: a hinge question or one key label the viewer must keep, calm).
// One short line set large (serif), optionally with a small mono line under it, revealed on its word,
// over the canvas, over a dimmed picture ("full") or beside a picture card ("card-right").
export type KineticLineProps = {
  lines: {
    text: string;
    atSec: number;
    style?: "serif" | "mono";
    untilSec?: number;
    fill?: WordFill;
    type?: TypeSpec | true; // TXT-021 TypewriterLine: typed from atSec (mono lines)
    strike?: StrikeSpec; // TXT-020 StrikeThrough: crossed out on the spoken correction
    ruled?: RuledSpec; // TXT-022 RuledTitle: rules above and below, slow grow
  }[];
  ink?: boolean; // TXT-016 InkPress on the serif lines (period headline cards)
  backdrop?: { srcId: string; imgSize: readonly [number, number]; crop?: Rect; layout: "full" | "card-right"; dim?: number };
  align?: "centre" | "left";
  tag?: DatelineTagProps;
  notebook?: NotebookSpec; // TEX-005 hatched notebook on the right (illustrative), lines on the left
  startSec?: number;
};

const Backdrop: React.FC<{ b: NonNullable<KineticLineProps["backdrop"]> }> = ({ b }) => {
  const src = useSource(b.srcId);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (b.layout === "full") {
    return (
      <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
        <CropImage src={src} imgSize={b.imgSize} crop={b.crop} width={1920} height={1080} filter={`brightness(${1 - (b.dim ?? 0.55)}) saturate(0.85)`} />
      </AbsoluteFill>
    );
  }
  const cardW = 600;
  const cardH = 760;
  return (
    <div
      style={{
        position: "absolute",
        right: t.safe.x + 40,
        top: (1080 - cardH) / 2,
        padding: 14,
        background: t.colors.panel,
        borderRadius: 6,
        boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
        transform: `scale(${drift(frame, durationInFrames, 0.02)})`,
      }}
    >
      <CropImage src={src} imgSize={b.imgSize} crop={b.crop} width={cardW - 28} height={cardH - 28} filter="contrast(1.04)" />
    </div>
  );
};

export const KineticLine: React.FC<KineticLineProps> = ({ lines, backdrop, align = "centre", tag, ink, notebook, startSec = 0 }) => {
  useAssets([
    "VIS-020",
    "MOT-002",
    ...(ink ? ["TXT-016"] : []),
    ...(lines.some((l) => l.fill) ? [lines.find((l) => l.fill)?.fill?.style === "mark" ? "TXT-017" : "TXT-015"] : []),
    ...(lines.some((l) => l.type) ? ["TXT-021"] : []),
    ...(lines.some((l) => l.strike) ? ["TXT-020"] : []),
    ...(lines.some((l) => l.ruled) ? ["TXT-022"] : []),
  ]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beside = backdrop?.layout === "card-right" || !!notebook;
  const left = align === "left" || beside;
  const boxStyle: React.CSSProperties = beside
    ? { position: "absolute", left: t.safe.x, top: 330, width: 1920 - t.safe.x * 2 - 600 - 120 }
    : { position: "absolute", left: left ? t.safe.x : 160, right: left ? undefined : 160, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: left ? "flex-start" : "center", textAlign: left ? "left" : "center" };
  return (
    <AbsoluteFill style={{ opacity: reveal(frame, fps, startSec, 0.6) }}>
      {backdrop ? <Backdrop b={backdrop} /> : null}
      {notebook ? <HatchNotebook spec={notebook} /> : null}
      {ink ? <InkPressFilter id="klinkpress" /> : null}
      <div style={boxStyle}>
        {lines.map((l) => {
          // A typed line appears letter by letter, so it skips the rise (it would double the entrance).
          const p = l.type ? (frame >= Math.round(l.atSec * fps) ? 1 : 0) : reveal(frame, fps, l.atSec, t.motion.enterSec);
          const out = l.untilSec !== undefined ? exit(frame, fps, l.untilSec, t.motion.enterSec) : 1;
          const mono = l.style === "mono";
          return (
            <div
              key={l.text}
              style={{
                fontFamily: mono ? t.fonts.mono : t.fonts.headline,
                fontWeight: mono ? 500 : t.fonts.headlineWeight,
                letterSpacing: mono ? 3 : t.fonts.headlineTracking,
                fontSize: mono ? 32 : 96,
                lineHeight: mono ? 1.4 : 1.05,
                color: backdrop ? (mono ? "#D8CFC2" : "#FFF8EC") : mono ? t.colors.secondary : t.colors.ink,
                marginTop: mono ? 30 : 0,
                textShadow: backdrop?.layout === "full" ? "0 4px 30px rgba(0,0,0,0.6)" : undefined,
                filter: ink && !mono ? "url(#klinkpress)" : undefined,
                ...rise(p * out, mono ? 12 : 26),
              }}
            >
              {(() => {
                const color = backdrop ? (mono ? "#D8CFC2" : "#FFF8EC") : mono ? t.colors.secondary : t.colors.ink;
                let body: React.ReactNode = l.type ? (
                  <Typed text={l.text} atSec={l.atSec} spec={l.type === true ? undefined : l.type} color={color} />
                ) : (
                  <FillLine text={l.text} fill={l.fill} ink={color} />
                );
                if (l.strike) body = <Strike spec={l.strike} color={t.colors.accent} ink={color} grey={t.colors.secondary}>{body}</Strike>;
                if (l.ruled) body = <Ruled spec={l.ruled} color={color}>{body}</Ruled>;
                return body;
              })()}
            </div>
          );
        })}
      </div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
