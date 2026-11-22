import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import { assetFile, useAsset, useAssets } from "../registry";
import { drift, reveal, rise, SLOW_OUT, sec } from "../motion";
import { spectrumGradient } from "../layers/spectrum";

// VIS-013 ConeCurveChart: long, medium and short cone sensitivity (Stockman & Sharpe 2000, SRC-028),
// drawn on in turn, with an optional wavelength marker that glides and reads out each cone's response.
type Data = { nm: number[]; L: number[]; M: number[]; S: number[]; source: string };

export type ConeCurveChartProps = {
  title?: string;
  highlight?: ("L" | "M" | "S")[];
  markerFromNm?: number;
  markerToNm?: number;
  markerAtSec?: number;
  startSec?: number;
};

export const ConeCurveChart: React.FC<ConeCurveChartProps> = ({ title, highlight, markerFromNm, markerToNm, markerAtSec = 2, startSec = 0 }) => {
  useAssets(["VIS-013", "MOT-001", "MOT-002"]);
  const dataEntry = useAsset("SRC-028");
  const [data, setData] = useState<Data | null>(null);
  const [handle] = useState(() => delayRender("cone data"));
  useEffect(() => {
    fetch(assetFile(dataEntry))
      .then((r) => r.json())
      .then((d: Data) => {
        setData(d);
        continueRender(handle);
      });
  }, [dataEntry, handle]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (!data) return null;
  const x0 = 210, y0 = 230, w = 1500, h = 520;
  const X = (nm: number) => x0 + ((nm - 390) / (700 - 390)) * w;
  const Y = (v: number) => y0 + h - v * h;
  const keys = [
    { k: "S" as const, color: t.colors.cones.S, name: "SHORT" },
    { k: "M" as const, color: t.colors.cones.M, name: "MEDIUM" },
    { k: "L" as const, color: t.colors.cones.L, name: "LONG" },
  ];
  const pTitle = reveal(frame, fps, startSec, t.motion.enterSec);
  const a = sec(markerAtSec, fps);
  const pm = interpolate(frame, [a, a + sec(2.5, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
  const hasMarker = markerFromNm !== undefined;
  const mNm = hasMarker ? markerFromNm + ((markerToNm ?? markerFromNm) - markerFromNm) * pm : 0;
  const at = (arr: number[], nm: number) => {
    const i = Math.min(arr.length - 2, Math.max(0, Math.floor((nm - 390) / 5)));
    const f = (nm - data.nm[i]) / 5;
    return arr[i] * (1 - f) + arr[i + 1] * f;
  };

  return (
    <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      {title ? (
        <div style={{ position: "absolute", left: x0, top: 120, fontFamily: t.fonts.headline, fontWeight: t.fonts.headlineWeight, letterSpacing: t.fonts.headlineTracking, fontSize: 58, color: t.colors.ink, ...rise(pTitle) }}>
          {title}
        </div>
      ) : null}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={x0} y1={y0 + h} x2={x0 + w} y2={y0 + h} stroke={t.colors.hairline} strokeWidth={2} />
        {keys.map((c, i) => {
          const p = reveal(frame, fps, startSec + 0.3 + i * t.motion.staggerSec * 2, 0.9);
          const d = data.nm.map((nm, j) => `${j ? "L" : "M"}${X(nm).toFixed(1)} ${Y(data[c.k][j]).toFixed(1)}`).join(" ");
          const dim = highlight && !highlight.includes(c.k);
          return <path key={c.k} d={d} fill="none" stroke={c.color} strokeWidth={dim ? 3 : 6} opacity={dim ? 0.3 : 1} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />;
        })}
        {hasMarker ? <line x1={X(mNm)} y1={y0 - 10} x2={X(mNm)} y2={y0 + h} stroke={t.colors.ink} strokeWidth={3} opacity={Math.min(1, pm * 4)} /> : null}
      </svg>
      <div style={{ position: "absolute", left: x0, top: y0 + h + 14, width: w, height: 18, borderRadius: 3, background: spectrumGradient(390, 700) }} />
      {[400, 450, 500, 550, 600, 650, 700].map((nm) => (
        <div key={nm} style={{ position: "absolute", left: X(nm) - 40, top: y0 + h + 44, width: 80, textAlign: "center", fontFamily: t.fonts.mono, fontSize: 20, color: t.colors.secondary }}>
          {nm}
        </div>
      ))}
      {hasMarker ? (
        <div style={{ position: "absolute", left: Math.min(X(mNm) + 24, x0 + w - 300), top: y0, fontFamily: t.fonts.mono, fontVariantNumeric: "tabular-nums", fontSize: 24, color: t.colors.ink, background: t.colors.chip, padding: "10px 16px", borderRadius: 4, opacity: Math.min(1, pm * 4) }}>
          <div>{Math.round(mNm)} nm</div>
          {keys.map((c) => (
            <div key={c.k} style={{ color: c.color }}>
              {c.name} {at(data[c.k], mNm).toFixed(2)}
            </div>
          ))}
        </div>
      ) : null}
      <div style={{ position: "absolute", left: x0, bottom: 70, fontFamily: t.fonts.mono, fontSize: 18, letterSpacing: 1, color: t.colors.secondary }}>
        STOCKMAN &amp; SHARPE (2000) CONE FUNDAMENTALS · EACH CURVE SCALED TO ITS PEAK
      </div>
    </AbsoluteFill>
  );
};
