import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets } from "../registry";
import { drift } from "../motion";
import { KeywordChips, QuoteChips, type KeywordPanel, type QuotePanel } from "./Chips";
import { Sticker, type StickerSpec } from "./Sticker";

// A shot's overlay plane (Within Motion blend, act 3): keyword chips (TXT-024), quote chips (TXT-025) and stickers
// (VIS-060, VIS-061 objects) laid over any component, in frame px and shot seconds. It belongs to the shot, so it
// leaves with it (carried off by a glide, wiped by a drafting line, dropped by a cut on action, blurred by a match).
// `drift`: stickers ride the component's own slow drift (EyeDiagram 0.02) so they stay with the drawing.
export type ShotOverlaySpec = { chips?: KeywordPanel[]; quotes?: QuotePanel[]; stickers?: StickerSpec[]; drift?: number };

export const ShotOverlay: React.FC<{ spec: ShotOverlaySpec }> = ({ spec }) => {
  const st = spec.stickers ?? [];
  useAssets([
    ...((spec.chips ?? []).length ? ["TXT-024"] : []),
    ...((spec.quotes ?? []).length ? ["TXT-025"] : []),
    ...(st.length ? ["VIS-060"] : []),
    ...(st.some((s) => s.object) ? ["VIS-061"] : []),
    ...st.map((s) => s.srcId),
  ]);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const d = spec.drift ?? 0;
  // one sticker entrance at a time: a pop lasts 0.6 s
  const starts = st.map((s) => s.atSec).sort((a, b) => a - b);
  for (let i = 1; i < starts.length; i++) if (starts[i] - starts[i - 1] < 0.6 - 1e-6) throw new Error("ShotOverlay: one sticker entrance at a time (0.6 s apart).");
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ transform: d ? `scale(${drift(frame, durationInFrames, d)})` : undefined }}>
        {st.map((s, i) => (
          <Sticker key={i} s={s} />
        ))}
      </AbsoluteFill>
      {(spec.quotes ?? []).map((q, i) => (
        <QuoteChips key={`q${i}`} panel={q} />
      ))}
      {(spec.chips ?? []).map((c, i) => (
        <KeywordChips key={`c${i}`} panel={c} />
      ))}
    </AbsoluteFill>
  );
};
