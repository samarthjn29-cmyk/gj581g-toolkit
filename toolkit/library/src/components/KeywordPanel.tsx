import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { drift } from "../motion";
import { useAssets } from "../registry";
import { KeywordChips, type KeywordPanel as Panel } from "../layers/Chips";

// TXT-024 KeywordChips as a shot of its own (WCL-E01 act 3, beats 73-75: the new question after the paper band):
// the theme canvas with one keyword panel on it. The chips land on their spoken words; nothing else moves.
export type KeywordPanelProps = { panel: Panel };

export const KeywordPanel: React.FC<KeywordPanelProps> = ({ panel }) => {
  useAssets(["TXT-024", "MOT-001", "MOT-002"]);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // MOT-001 slow drift (2%) so the held panel is never a frozen frame
  return (
    <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
      <KeywordChips panel={panel} />
    </AbsoluteFill>
  );
};
