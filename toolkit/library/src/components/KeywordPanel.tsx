import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { drift } from "../motion";
import { useAssets } from "../registry";
import { KeywordChips, type KeywordPanel as Panel } from "../layers/Chips";
import { Label, type LabelSpec } from "../layers/Label";

// TXT-024 KeywordChips as a shot of its own (WCL-E01 act 3, beats 73-75: the new question after the paper band):
// the theme canvas with one keyword panel on it. The chips land on their spoken words; nothing else moves.
// `labels`: tags for what stands behind the panel (e.g. the blurred portrait ground of the person the line points to,
// act 3 v5); they sit outside the drift so they stay put. `panel` may carry no chips when overlay stickers carry the shot.
export type KeywordPanelProps = { panel: Panel; labels?: LabelSpec[] };

export const KeywordPanel: React.FC<KeywordPanelProps> = ({ panel, labels }) => {
  useAssets(["TXT-024", "MOT-001", "MOT-002"]);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // MOT-001 slow drift (2%) so the held panel is never a frozen frame
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${drift(frame, durationInFrames, 0.02)})` }}>
        {panel.chips.length ? <KeywordChips panel={panel} /> : null}
      </AbsoluteFill>
      {(labels ?? []).map((l, i) => (
        <Label key={i} spec={l} />
      ))}
    </AbsoluteFill>
  );
};
