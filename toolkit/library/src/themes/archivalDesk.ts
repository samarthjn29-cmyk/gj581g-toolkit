import type { Theme } from "./types";

// LOK-001 Archival Desk (tokens from the 4-Gate Protocol guide), calm version.
export const archivalDesk: Theme = {
  id: "LOK-001",
  name: "Archival Desk",
  colors: {
    canvas: "#14171A",
    grid: "#2E363E",
    hairline: "#2E363E",
    ink: "#EFECE6",
    secondary: "#9AA3AC",
    accent: "#D95D39",
    accentSoft: "rgba(217,93,57,0.38)",
    panel: "#1C2125",
    chip: "rgba(10,12,14,0.78)",
    dimMask: "rgba(10,12,14,0.8)",
    leaks: [],
  },
  fonts: { headline: "Archivo", headlineWeight: 800, headlineTracking: "-0.025em", titleWeight: 500, serif: "Newsreader", mono: "IBM Plex Mono", body: "Plus Jakarta Sans" },
  textStyles: ["TXT-001", "TXT-002", "TXT-003", "TXT-004"],
  optical: { grain: 0.12, grainStepFrames: 4, vignette: 0.32, gridOpacity: 0.55 },
  motion: { drift: 0.03, enterSec: 0.75, staggerSec: 0.15 },
  safe: { x: 120, y: 84 },
};
