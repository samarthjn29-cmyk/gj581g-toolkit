import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { COMPONENTS } from "../components";
import { ThemeProvider, useTheme } from "../themes";
import { OpticalStack } from "../layers/OpticalStack";
import { RegistryModeProvider, type RegistryMode } from "../registry";
import { VectorTraceConnector } from "../layers/VectorTraceConnector";
import { BoilDefs } from "../layers/LineBoil";
import { HatchDefs, hatch } from "../layers/EngravingHatch";
import { PrintScreenOverlay } from "../layers/PrintScreenOverlay";
import { Label } from "../layers/Label";
import { reveal, snap } from "../motion";
import { DEMO } from "./demoProps";

// Previews for MOT-005 VectorTraceConnector, MOT-009 LineBoil, MOT-011 ExtremeEase, TEX-005 EngravingHatch and
// TEX-006 PrintScreenOverlay (22 Nov 2026, built for WCL-E01 act 2). Neutral preview labels, no claims.
export type MotionTextureKind = "trace" | "boil" | "snap" | "hatch" | "printscreen";

const Pin: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const t = useTheme();
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill="none" stroke={t.colors.ink} strokeWidth={3} />
      <circle cx={x} cy={y} r={4} fill={t.colors.ink} />
    </g>
  );
};

const Trace: React.FC = () => (
  <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <BoilDefs id="pins-boil" amp={1} />
      </defs>
      <g filter="url(#pins-boil)">
        <Pin x={560} y={330} />
        <Pin x={1330} y={720} />
      </g>
    </svg>
    <VectorTraceConnector spec={{ from: [560, 330], to: [1330, 720], atSec: 1.0, drawSec: 1.3, dashed: true, boil: 1, bend: 0.2 }} />
    <Label spec={{ text: "POINT A", atSec: 0.4, x: 590, y: 290 }} />
    <Label spec={{ text: "POINT B", atSec: 2.3, x: 1360, y: 690, accent: true }} />
    <Label spec={{ text: "MOT-005 · TRACE (dashed route, boil on)", atSec: 0.2, x: 120, y: 980 }} />
  </>
);

const BoilDemo: React.FC = () => {
  const t = useTheme();
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <BoilDefs id="b1" amp={1.5} />
        </defs>
        <g filter="url(#b1)" fill="none" stroke={t.colors.ink} strokeWidth={4} strokeLinecap="round">
          <circle cx={960} cy={500} r={170} />
          <circle cx={960} cy={500} r={70} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={960 + Math.cos(a) * 200} y1={500 + Math.sin(a) * 200} x2={960 + Math.cos(a) * 260} y2={500 + Math.sin(a) * 260} />;
          })}
        </g>
      </svg>
      <Label spec={{ text: "MOT-009 · LINE BOIL (1.5 px, on threes)", atSec: 0.2, x: 120, y: 980 }} />
    </>
  );
};

const SnapDemo: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = reveal(frame, fps, 1.2, 0.75);
  const s = snap(frame, fps, 1.2, 0.6);
  const dark = "#3B4250";
  const cherry = "#B3262E"; // data colour: the reported cherry red
  const box = (x: number, p: number, title: string) => (
    <div style={{ position: "absolute", left: x, top: 300, width: 520, height: 380, borderRadius: 8, background: interpolateColors(p, [0, 1], [dark, cherry]), boxShadow: "0 18px 50px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: t.fonts.mono, fontSize: 26, color: t.colors.secondary, letterSpacing: "0.12em" }}>{title}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {box(300, r, "REVEAL · MOT-002")}
      {box(1100, s, "SNAP · MOT-011")}
      <div style={{ position: "absolute", left: 1100 + interpolate(s, [0, 1], [-14, 0]), top: 270, width: 520, height: 4, background: t.colors.accent, opacity: s }} />
    </AbsoluteFill>
  );
};

const HatchDemo: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = Math.floor(interpolate(frame, [fps * 1, fps * 4], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  // An open notebook drawn as a period engraving: hatched cover edge, spine shadow and page curl; ruled rows fill in.
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <HatchDefs />
          <BoilDefs id="hb" amp={0.8} />
        </defs>
        <g filter="url(#hb)" stroke={t.colors.ink} strokeWidth={3} strokeLinejoin="round">
          <path d="M520 760 L960 800 L1400 760 L1400 300 L960 340 L520 300 Z" fill={hatch(0.75)} />
          <path d="M540 740 L960 778 L960 330 L540 292 Z" fill={t.colors.panel} />
          <path d="M1380 740 L960 778 L960 330 L1380 292 Z" fill={t.colors.panel} />
          <path d="M960 330 L960 778 L905 772 L905 325 Z" fill={hatch(0.45)} stroke="none" />
          <path d="M960 330 L960 778 L1015 772 L1015 325 Z" fill={hatch(0.3)} stroke="none" />
          <path d="M1380 292 L1380 740 L1340 744 Q1360 520 1340 296 Z" fill={hatch(0.15)} stroke="none" />
        </g>
        <g stroke={t.colors.secondary} strokeWidth={2} opacity={0.8}>
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={1040} y1={380 + i * 40} x2={1040 + (i < rows ? 300 : 0)} y2={380 + i * 40} />
          ))}
        </g>
      </svg>
      <Label spec={{ text: "TEX-005 · ENGRAVING HATCH (tones 0.15-0.75)", atSec: 0.2, x: 120, y: 980 }} />
    </>
  );
};

const PrintDemo: React.FC = () => {
  const C = COMPONENTS.FootagePlate.Component;
  return (
    <>
      <C {...DEMO.FootagePlate} />
      <PrintScreenOverlay strength={0.08} />
    </>
  );
};

const Body: React.FC<{ kind: MotionTextureKind }> = ({ kind }) => {
  if (kind === "trace") return <Trace />;
  if (kind === "boil") return <BoilDemo />;
  if (kind === "snap") return <SnapDemo />;
  if (kind === "hatch") return <HatchDemo />;
  return <PrintDemo />;
};

export const MotionTexturePreview: React.FC<{ themeId: string; registryMode: RegistryMode; kind: MotionTextureKind }> = ({ themeId, registryMode, kind }) => (
  <RegistryModeProvider mode={registryMode}>
    <ThemeProvider themeId={themeId}>
      <OpticalStack grid={kind !== "printscreen"}>
        <Body kind={kind} />
      </OpticalStack>
    </ThemeProvider>
  </RegistryModeProvider>
);
