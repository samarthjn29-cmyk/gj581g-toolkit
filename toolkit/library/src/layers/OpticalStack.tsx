import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useTheme } from "../themes";
import { useAsset, useRegistryMode } from "../registry";

// LOK-010 OpticalStack: the five-layer frame every shot sits in, all from the active theme.
// 1 canvas (+ optional hairline grid and faint corner glows), 2 evidence (children), 3 callouts,
// 4 grade, 5 grain (pattern changes every N frames) and vignette.
export const OpticalStack: React.FC<{ children: React.ReactNode; callouts?: React.ReactNode; grid?: boolean }> = ({
  children,
  callouts,
  grid = true,
}) => {
  useAsset("LOK-010");
  const t = useTheme();
  const mode = useRegistryMode();
  const frame = useCurrentFrame();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const seed = Math.floor(frame / t.optical.grainStepFrames);
  const corners = ["0% 0%", "100% 0%", "100% 100%"];
  return (
    <AbsoluteFill style={{ backgroundColor: t.colors.canvas, overflow: "hidden" }}>
      {grid && t.colors.grid ? (
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: t.optical.gridOpacity }}>
          <defs>
            <pattern id={`grid${uid}`} width={80} height={80} patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke={t.colors.grid} strokeWidth={1} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid${uid})`} />
        </svg>
      ) : null}
      {t.colors.leaks.map((c, i) => (
        <AbsoluteFill
          key={c}
          style={{ background: `radial-gradient(circle at ${corners[i % corners.length]}, ${c} 0%, transparent 42%)` }}
        />
      ))}
      <AbsoluteFill>{children}</AbsoluteFill>
      {callouts ? <AbsoluteFill>{callouts}</AbsoluteFill> : null}
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(255,250,240,0.025) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.08) 100%)" }}
      />
      <AbsoluteFill style={{ opacity: t.optical.grain, mixBlendMode: "overlay" }}>
        <svg width={1920} height={1080}>
          <filter id={`grain${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency={0.8} numOctaves={2} seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain${uid})`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${t.optical.vignette}) 100%)` }}
      />
      {mode === "build" ? (
        <div
          style={{
            position: "absolute",
            right: 28,
            top: 24,
            fontFamily: t.fonts.mono,
            fontSize: 18,
            letterSpacing: 1.5,
            color: t.colors.secondary,
            background: t.colors.chip,
            padding: "6px 12px",
            borderRadius: 4,
          }}
        >
          BUILD PREVIEW · NOT ALL ACTIVE
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
