import React from "react";
import { AbsoluteFill } from "remotion";
import { useAssets } from "../registry";
import { KeywordChips, type KeywordPanel as Panel } from "../layers/Chips";

// TXT-024 KeywordChips as a shot of its own (WCL-E01 act 3, beats 73-75: the new question after the paper band):
// the theme canvas with one keyword panel on it. The chips land on their spoken words; nothing else moves.
export type KeywordPanelProps = { panel: Panel };

export const KeywordPanel: React.FC<KeywordPanelProps> = ({ panel }) => {
  useAssets(["TXT-024", "MOT-002"]);
  return (
    <AbsoluteFill>
      <KeywordChips panel={panel} />
    </AbsoluteFill>
  );
};
