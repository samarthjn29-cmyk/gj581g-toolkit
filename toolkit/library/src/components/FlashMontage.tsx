import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { reveal, sec } from "../motion";

// TRN-016 FlashMontage (own build, 23 Nov 2026; from the cinematic review of Johnny Harris 'Sudan, Mapped', where the
// cold open makes 22 changes in 40 s; analysis only): one held hero picture with a slow push, broken by short flashes
// of real registered sources (0.3 s each, a light bloom in and out), then the hero returns. It is a shot, not a cut
// between two shots. Each flash keeps its source chip for its whole time on screen.
// Limit (register K): an episode's cold open only, 1 per episode, max 8 s; real registered sources only; no flash
// shorter than 0.25 s; flashes at least 0.6 s apart.
export type Flash = { srcId: string; file?: string; size: readonly [number, number]; atSec: number; label: string; focus?: readonly [number, number] };
export type FlashMontageProps = { hero: Flash; flashes: Flash[]; flashSec?: number; startSec?: number };

const Pic: React.FC<{ f: Flash; zoom: number }> = ({ f, zoom }) => {
  const src = useSourceFile(f.srcId, f.file);
  const s = Math.max(1920 / f.size[0], 1080 / f.size[1]) * 1.04;
  const iw = f.size[0] * s, ih = f.size[1] * s;
  const fo = f.focus ?? [0.5, 0.5];
  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        left: Math.min(0, Math.max(1920 - iw, 960 - fo[0] * iw)),
        top: Math.min(0, Math.max(1080 - ih, 540 - fo[1] * ih)),
        width: iw,
        height: ih,
        maxWidth: "none",
        transform: `scale(${zoom})`,
        transformOrigin: `${fo[0] * 100}% ${fo[1] * 100}%`,
        filter: "sepia(0.15) contrast(1.05)",
      }}
    />
  );
};

export const FlashMontage: React.FC<FlashMontageProps> = ({ hero, flashes, flashSec = 0.3, startSec = 0 }) => {
  useAssets(["TRN-016", "VIS-016"]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (durationInFrames / fps > 8.05) throw new Error("FlashMontage: max 8 s.");
  if (flashSec < 0.25) throw new Error("FlashMontage: no flash shorter than 0.25 s.");
  flashes.forEach((f, i) => {
    if (i > 0 && f.atSec - flashes[i - 1].atSec < flashSec + 0.6) throw new Error("FlashMontage: flashes at least 0.6 s apart.");
  });
  const p = frame / Math.max(1, durationInFrames);
  const pIn = reveal(frame, fps, startSec, 0.6);
  const now = frame / fps;
  const cur = flashes.find((f) => now >= f.atSec && now < f.atSec + flashSec);
  const fl = sec(flashSec, fps);
  return (
    <AbsoluteFill style={{ opacity: pIn, background: t.colors.canvas }}>
      <Pic f={hero} zoom={1 + 0.05 * p} />
      {flashes.map((f, i) => {
        const from = sec(f.atSec, fps);
        return (
          <Sequence key={i} from={from} durationInFrames={fl} layout="none">
            <FlashPic f={f} fl={fl} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", left: t.safe.x, bottom: 60, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>
        {(cur ?? hero).label}
      </div>
    </AbsoluteFill>
  );
};

const FlashPic: React.FC<{ f: Flash; fl: number }> = ({ f, fl }) => {
  const frame = useCurrentFrame();
  const b = interpolate(frame, [0, 2, fl - 3, fl], [1.35, 1, 1, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ filter: `brightness(${b.toFixed(2)})` }}>
      <Pic f={f} zoom={1.02} />
    </AbsoluteFill>
  );
};
