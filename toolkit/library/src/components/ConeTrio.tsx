import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { useAssets } from "../registry";
import { drift, lock, reveal, rise } from "../motion";

// VIS-012 ConeTrio: three round lights for the long, medium and short cones, used whenever cones come up.
// levels: how strongly each cone responds (0-1). "dalton" = the medium cone missing; "olo" = the medium cone alone.
type Levels = readonly [number, number, number];
const PRESETS: Record<string, Levels> = { normal: [1, 1, 1], dalton: [1, 0, 1], olo: [0, 1, 0] };

export type ConeTrioProps = {
  preset?: "normal" | "dalton" | "olo";
  levels?: Levels;
  from?: Levels;
  atSec?: number;
  missing?: ("L" | "M" | "S")[];
  caption?: string;
  startSec?: number;
};

export const ConeTrio: React.FC<ConeTrioProps> = ({ preset = "normal", levels, from, atSec = 1.5, missing, caption, startSec = 0 }) => {
  useAssets(["VIS-012", "MOT-001", "MOT-002", "MOT-003"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const target = levels ?? PRESETS[preset];
  const start = from ?? target;
  const pChange = from ? lock(frame, fps, atSec) : 1;
  const gone = missing ?? (preset === "dalton" ? ["M"] : []);
  const cones = [
    { k: "L" as const, name: "LONG", color: t.colors.cones.L },
    { k: "M" as const, name: "MEDIUM", color: t.colors.cones.M },
    { k: "S" as const, name: "SHORT", color: t.colors.cones.S },
  ];
  const pCap = reveal(frame, fps, startSec + t.motion.staggerSec * 5, t.motion.enterSec);

  return (
    <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      {cones.map((c, i) => {
        const p = reveal(frame, fps, startSec + t.motion.staggerSec * (i + 1), t.motion.enterSec);
        const lvl = interpolate(pChange, [0, 1], [start[i], target[i]]);
        const isGone = gone.includes(c.k);
        const cx = 960 + (i - 1) * 300;
        return (
          <div key={c.k} style={{ position: "absolute", left: cx - 130, top: 330, width: 260, textAlign: "center", ...rise(p, 20) }}>
            <div
              style={{
                margin: "0 auto",
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: isGone ? `3px dashed ${t.colors.secondary}` : `2px solid ${c.color}`,
                background: isGone ? "transparent" : c.color,
                opacity: isGone ? 0.8 : 0.15 + 0.85 * lvl,
                boxShadow: isGone ? "none" : `0 0 ${90 * lvl}px ${c.color}`,
              }}
            />
            <div style={{ marginTop: 36, fontFamily: t.fonts.mono, fontSize: 26, letterSpacing: 4, color: isGone ? t.colors.secondary : t.colors.ink }}>
              {c.name}
            </div>
            {isGone ? (
              <div style={{ marginTop: 10, fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 30, color: t.colors.secondary }}>missing</div>
            ) : null}
          </div>
        );
      })}
      {caption ? (
        <div style={{ position: "absolute", left: t.safe.x, right: t.safe.x, top: 790, textAlign: "center", fontFamily: t.fonts.serif, fontStyle: "italic", fontSize: 42, color: t.colors.ink, ...rise(pCap, 16) }}>
          {caption}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
