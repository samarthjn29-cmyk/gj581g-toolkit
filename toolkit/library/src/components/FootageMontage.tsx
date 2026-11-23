import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { reveal, sec } from "../motion";

// VIS-052 FootageMontage (Johnny Harris 'Sudan, Mapped', the B-roll run at ~2 s a cut; analysis only; Sam, 23 Nov 2026:
// "Build the necessary cinematic pieces"). 3-6 real clips or photos cut on their words, each 1.5-3 s, each with one
// slow push (4%) in alternating directions so the run feels like one moving camera; graded to the act (a warm film
// grade); full bleed, or inset in a rounded film frame on the shot's ground. Every clip keeps its own source chip.
// Best use: the world of a place or a thing in the present day (Kendal today, the Lake District, a candle, a prism,
// an eye) between graphics. Limit: max 2 montages per act; counts towards the footage share (VIS-016, 15% of an
// episode); real registered clips only, never presented as period footage; original audio muted.
export type MontageClip = { srcId: string; file?: string; kind: "video" | "image"; size: readonly [number, number]; atSec: number; clipStartSec?: number; focus?: readonly [number, number]; label: string };
export type FootageMontageProps = { clips: MontageClip[]; frame?: "full" | "inset"; startSec?: number };

const Clip: React.FC<{ c: MontageClip; len: number; i: number; w: number; h: number }> = ({ c, len, i, w, h }) => {
  const src = useSourceFile(c.srcId, c.file);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = frame / Math.max(1, sec(len, fps));
  const s = Math.max(w / c.size[0], h / c.size[1]) * 1.06;
  const iw = c.size[0] * s;
  const ih = c.size[1] * s;
  const f = c.focus ?? [0.5, 0.5];
  const dir = i % 2 === 0 ? 1 : -1;
  const zoom = 1 + 0.04 * (dir > 0 ? p : 1 - p);
  const style: React.CSSProperties = {
    position: "absolute",
    left: Math.min(0, Math.max(w - iw, w / 2 - f[0] * iw)) + dir * 14 * (p - 0.5),
    top: Math.min(0, Math.max(h - ih, h / 2 - f[1] * ih)),
    width: iw,
    height: ih,
    maxWidth: "none",
    transform: `scale(${zoom})`,
    transformOrigin: `${f[0] * 100}% ${f[1] * 100}%`,
    filter: "sepia(0.18) saturate(0.9) contrast(1.06)",
  };
  return c.kind === "video" ? <OffthreadVideo src={src} muted startFrom={sec(c.clipStartSec ?? 0, fps)} style={style} /> : <Img src={src} style={style} />;
};

export const FootageMontage: React.FC<FootageMontageProps> = ({ clips, frame: layout = "full", startSec = 0 }) => {
  useAssets(["VIS-052", "VIS-016", "MOT-001"]);
  if (clips.length < 3 || clips.length > 6) throw new Error("FootageMontage: 3-6 clips.");
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ends = clips.map((c, i) => (i + 1 < clips.length ? clips[i + 1].atSec : durationInFrames / fps));
  clips.forEach((c, i) => {
    const len = ends[i] - Math.max(0, c.atSec);
    if (i > 0 && i < clips.length - 1 && (len < 1.5 || len > 3)) throw new Error(`FootageMontage: clip ${i + 1} runs ${len.toFixed(2)} s (1.5-3 s).`);
  });
  const inset = layout === "inset";
  const W = inset ? 1440 : 1920;
  const H = inset ? 810 : 1080;
  const now = frame / fps;
  let cur = 0;
  clips.forEach((c, i) => {
    if (now >= c.atSec) cur = i;
  });
  const pIn = reveal(frame, fps, startSec, 0.6);
  return (
    <AbsoluteFill style={{ opacity: pIn }}>
      <div style={{ position: "absolute", left: (1920 - W) / 2, top: (1080 - H) / 2, width: W, height: H, overflow: "hidden", borderRadius: inset ? 18 : 0, boxShadow: inset ? "0 30px 70px rgba(0,0,0,0.55)" : undefined, border: inset ? `10px solid ${t.colors.panel}` : undefined, background: t.colors.canvas }}>
        {clips.map((c, i) => {
          const from = sec(Math.max(0, c.atSec), fps);
          const dur = sec(ends[i], fps) - from;
          return (
            <Sequence key={i} from={from} durationInFrames={Math.max(1, dur)} layout="none">
              <Clip c={c} len={ends[i] - Math.max(0, c.atSec)} i={i} w={W} h={H} />
            </Sequence>
          );
        })}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, ${t.colors.dimMask} 100%)`, opacity: 0.7 }} />
      </div>
      <div style={{ position: "absolute", left: inset ? (1920 - W) / 2 + 24 : t.safe.x, bottom: inset ? (1080 - H) / 2 + 24 : 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3, opacity: interpolate(frame, [sec(clips[cur].atSec, fps), sec(clips[cur].atSec + 0.3, fps)], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {clips[cur].label}
      </div>
    </AbsoluteFill>
  );
};
