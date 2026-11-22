import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, reveal, rise } from "../motion";
import { RisoPrint, type RisoInk } from "../layers/RisoPrint";
import { GateWeave } from "../layers/GateWeave";
import { PaperFibre } from "../layers/PaperFibre";
import { DatelineTag, type DatelineTagProps } from "./DatelineTag";
import { FillLine, type WordFill } from "../layers/FillWord";

// LOK-021 RisoPlate: one picture printed in two or three spot inks on a paper card (RisoPrint), the inks
// entering one by one so the overlap colour is SEEN to be made (subtractive mixing), with a caption chip and
// words beside it. The card weaves very slightly (LOK-022 GateWeave) so a long hold stays alive.
// Best for the colour series' printing and mixing beats; calm: inks enter 0.75 s apart, no overshoot.
export type RisoPlateProps = {
  srcId: string;
  inks: (RisoInk & { atSec: number })[];
  imgSize: readonly [number, number]; // the ink files' pixels (all the same size)
  w?: number; // card width
  caption?: string;
  lines?: { text: string; atSec: number; style?: "serif" | "mono"; fill?: WordFill }[];
  tag?: DatelineTagProps;
  startSec?: number;
};

export const RisoPlate: React.FC<RisoPlateProps> = ({ srcId, inks, imgSize, w = 700, caption, lines = [], tag, startSec = 0 }) => {
  useAssets(["LOK-021", "LOK-022", "TEX-007", "MOT-002"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const h = (w * imgSize[1]) / imgSize[0];
  const shown = inks.map((k) => ({ ...k, color: k.color }));
  return (
    <AbsoluteFill style={{ opacity: reveal(frame, fps, startSec, 0.6) }}>
      <div
        style={{
          position: "absolute",
          right: t.safe.x + 60,
          top: (1080 - h) / 2 - 10,
          width: w,
          height: h,
          transform: `scale(${drift(frame, durationInFrames, 0.02)}) rotate(-1.2deg)`,
          filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.45))",
        }}
      >
        <GateWeave weave={0.8} flicker={0.015}>
          {shown.map((k, i) => {
            const p = reveal(frame, fps, k.atSec, t.motion.enterSec);
            return (
              <div key={i} style={{ position: "absolute", inset: 0, opacity: i === 0 ? 1 : p, mixBlendMode: i === 0 ? "normal" : "multiply" }}>
                <RisoPrint srcId={srcId} inks={[k]} width={w} height={h} paper={i === 0 ? t.colors.ink : "transparent"} />
              </div>
            );
          })}
          <PaperFibre seed={9} strength={0.9} />
        </GateWeave>
        {caption ? (
          <div style={{ position: "absolute", left: 18, bottom: -22, padding: "8px 14px", background: t.colors.chip, color: t.colors.ink, fontFamily: t.fonts.mono, fontSize: 26, letterSpacing: 3, whiteSpace: "nowrap", borderRadius: 4 }}>
            {caption}
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: t.safe.x, top: 0, bottom: 0, width: 1920 - t.safe.x * 2 - w - 160, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {lines.map((l) => {
          const p = reveal(frame, fps, l.atSec, t.motion.enterSec);
          const mono = l.style === "mono";
          return (
            <div
              key={l.text}
              style={{
                fontFamily: mono ? t.fonts.mono : t.fonts.headline,
                fontWeight: mono ? 500 : t.fonts.headlineWeight,
                letterSpacing: mono ? 3 : t.fonts.headlineTracking,
                fontSize: mono ? 30 : 84,
                lineHeight: mono ? 1.45 : 1.05,
                color: mono ? t.colors.secondary : t.colors.ink,
                marginTop: mono ? 28 : 0,
                ...rise(p, mono ? 12 : 26),
              }}
            >
              <FillLine text={l.text} fill={l.fill} ink={mono ? t.colors.secondary : t.colors.ink} />
            </div>
          );
        })}
      </div>
      {tag ? <DatelineTag {...tag} /> : null}
    </AbsoluteFill>
  );
};
