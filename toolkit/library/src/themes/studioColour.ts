import type { Theme } from "./types";
import { warmGraphite } from "./warmGraphite";

// Background candidates for Sam's "illusion of energy and creativity" (25 Nov 2026), replacing the dark graphite.
// Same fonts, motion and paper palette as LOK-009; only the ground and its colours change. Planned until Sam picks.
const base = warmGraphite;

// LOK-033 Studio Cream: warm cream ground with slow-moving colour fields in one warm family around the tomato accent
// (was tomato, sun, cobalt, pink until 26 Nov 2026; changed for colour harmony, Sam: option A).
export const studioCream: Theme = {
  ...base,
  id: "LOK-033",
  name: "Studio Cream",
  colors: {
    ...base.colors,
    canvas: "#F4ECDD",
    hairline: "rgba(30,26,23,0.12)",
    ink: "#1E1A17",
    secondary: "#6A6158",
    accent: "#FF4F2E",
    accentSoft: "rgba(255,79,46,0.30)",
    panel: "#FFF8EC",
    chip: "rgba(255,250,242,0.94)",
    dimMask: "rgba(244,236,221,0.82)",
    leaks: [],
  },
  // colour fields: one warm family around the tomato accent (Sam, 26 Nov 2026: harmony, option A), never unrelated hues
  optical: { grain: 0.07, grainStepFrames: 2, vignette: 0.06, gridOpacity: 0, blobs: { colors: ["#FF9A7A", "#FFC9A8", "#F2B48C", "#FFD9C2"], opacity: 0.5, size: 1100, speed: 0.35 } },  // page shots keep the paper palette but the series' one accent (Sam, 25 Nov 2026: "Tomato everywhere")
  paper: { ...base.paper, accent: "#FF4F2E", accentSoft: "rgba(255,79,46,0.30)" },
};

// LOK-034 Cobalt Studio: saturated cobalt ground, white ink, sun-yellow accent, cyan and magenta fields.
export const cobaltStudio: Theme = {
  ...base,
  id: "LOK-034",
  name: "Cobalt Studio",
  colors: {
    ...base.colors,
    canvas: "#2343D6",
    hairline: "rgba(255,255,255,0.16)",
    ink: "#FFFFFF",
    secondary: "#C9D4FF",
    accent: "#FFD23F",
    accentSoft: "rgba(255,210,63,0.40)",
    panel: "#2E52E8",
    chip: "rgba(18,30,120,0.72)",
    dimMask: "rgba(20,32,140,0.80)",
    leaks: [],
  },
  optical: { grain: 0.06, grainStepFrames: 2, vignette: 0.18, gridOpacity: 0, blobs: { colors: ["#00D1FF", "#FF4FA3", "#7A5CFF"], opacity: 0.45, size: 1200, speed: 0.3 } },
};

// LOK-035 Sky Lilac: a light blue-to-lilac day sky with peach and mint fields, dark ink, tomato accent.
export const skyLilac: Theme = {
  ...base,
  id: "LOK-035",
  name: "Sky Lilac",
  colors: {
    ...base.colors,
    canvas: "#DCE6FF",
    hairline: "rgba(30,30,60,0.12)",
    ink: "#1C1C33",
    secondary: "#5B5F80",
    accent: "#FF5A36",
    accentSoft: "rgba(255,90,54,0.28)",
    panel: "#F4F2FF",
    chip: "rgba(250,248,255,0.94)",
    dimMask: "rgba(220,230,255,0.82)",
    leaks: [],
  },
  optical: { grain: 0.06, grainStepFrames: 2, vignette: 0.06, gridOpacity: 0, blobs: { colors: ["#E7C6FF", "#FFC2A8", "#A8F0D8", "#9FB8FF"], opacity: 0.7, size: 1200, speed: 0.3 } },
};
