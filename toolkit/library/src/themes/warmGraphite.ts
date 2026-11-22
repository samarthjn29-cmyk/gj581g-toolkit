import type { Theme } from "./types";

// LOK-009 Warm Graphite Light Lab (the Colour_v1 look, Sam's pick 21 Nov 2026). Default theme.
export const warmGraphite: Theme = {
  id: "LOK-009",
  name: "Warm Graphite Light Lab",
  colors: {
    canvas: "#2F2D2C",
    grid: null,
    hairline: "rgba(242,238,228,0.10)",
    ink: "#F2EEE4",
    secondary: "#9EA5B8",
    accent: "#00E0BE",
    accentSoft: "rgba(0,224,190,0.42)",
    panel: "#3A3836",
    chip: "rgba(22,21,20,0.72)",
    dimMask: "rgba(22,21,20,0.8)",
    leaks: ["rgba(255,59,48,0.10)", "rgba(48,209,88,0.08)", "rgba(47,107,255,0.12)"],
  },
  fonts: { headline: "Fraunces", headlineWeight: 600, headlineTracking: "-0.01em", titleWeight: 600, serif: "Fraunces", mono: "JetBrains Mono", body: "Fraunces" },
  textStyles: ["TXT-009", "TXT-010"],
  optical: { grain: 0.045, grainStepFrames: 2, vignette: 0.32, gridOpacity: 0 },
  motion: { drift: 0.03, enterSec: 0.75, staggerSec: 0.15 },
  safe: { x: 120, y: 84 },
};
