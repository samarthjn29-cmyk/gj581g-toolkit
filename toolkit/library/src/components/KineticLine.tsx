import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets, useSource } from "../registry";
import { drift, exit, reveal, rise } from "../motion";
import { CropImage, type Rect } from "../layers/CropImage";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";

// VIS-020 KineticLine (beat type 3: a hinge question or one key label the viewer must keep, calm).
// One short line set large (serif), optionally with a small mono line under it, revealed on its word,
// over the canvas, over a dimmed picture ("full") or beside a picture card ("card-right").
export type KineticLineProps = {
  lines: { text: string; atSec: number; style?: "serif" | "mono"; untilSec?: number }[];
  backdrop?: { srcId: string; imgSize: readonly [number, number]; crop?: Rect; layout: "full" | "card-right"; dim?: number };
  align?: "centre" | "left";
  tag?: DatelineTagProps;
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

export const KineticLine: React.FC<KineticLineProps> = ({ lines, backdrop, align = "centre", tag, startSec = 0 }) => {
  useAssets(["VIS-020", "MOT-002"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beside = backdrop?.layout === "card-right";
  const left = align === "left" || beside;
  const boxStyle: React.CSSProperties = beside
    ? { position: "absolute", left: t.safe.x, top: 330, width: 1920 - t.safe.x * 2 - 600 - 120 }
    : { position: "absolute", left: left ? t.safe.x : 160, right: left ? undefined : 160, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: left ? "flex-start" : "center", textAlign: left ? "left" : "center" };
  return (
    <AbsoluteFill style={{ opacity: reveal(frame, fps, startSec, 0.6) }}>
      {backdrop ? <Backdrop b={backdrop} /> : null}
      <div style={boxStyle}>
        {lines.map((l) => {
          const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
          const out = l.untilSec !== undefined ? exit(frame, fps, l.untilSec, t.motion.enterSec) : 1;
          const mono = l.style === "mono";
          return (
            <div
              key={l.text}
              style={{
                fontFamily: mono ? t.fonts.mono : t.fonts.headline,
                fontWeight: mono ? 500 : t.fonts.headlineWeight,
                letterSpacing: mono ? 3 : t.fonts.headlineTracking,
                fontSize: mono ? 28 : 96,
                lineHeight: mono ? 1.4 : 1.05,
                color: mono ? t.colors.secondary : t.colors.ink,
                marginTop: mono ? 30 : 0,
                textShadow: backdrop?.layout === "full" ? "0 4px 30px rgba(0,0,0,0.6)" : undefined,
                ...rise(p * out, mono ? 12 : 26),
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
