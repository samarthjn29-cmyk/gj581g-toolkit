import React, { createContext, useContext } from "react";
import type { Theme } from "./types";
import { warmGraphite } from "./warmGraphite";
import { archivalDesk } from "./archivalDesk";
import { studioCream, cobaltStudio, skyLilac } from "./studioColour";
import { useAsset, useRegistryMode } from "../registry";
import { ensureFonts } from "../fonts";

export type { Theme };
// One file per Theme_Library row in use. A theme may change from video to video; the episode overview records the pick.
export const THEMES: Record<string, Theme> = { "LOK-009": warmGraphite, "LOK-001": archivalDesk, "LOK-033": studioCream, "LOK-034": cobaltStudio, "LOK-035": skyLilac };
export const DEFAULT_THEME = "LOK-009";

const ThemeContext = createContext<Theme>(warmGraphite);
export const useTheme = () => useContext(ThemeContext);

// A light theme (LOK-033 Studio Cream and the other light grounds) flips ink and canvas: ink is dark, canvas/panel
// are light. Components written for the dark graphite use these in fixed roles; they ask this instead (act 1 v2
// Gate 3 picture pass, 25 Nov 2026: negatives in the collage, a cream band between dark shots, grey vignettes).
const lum = (hex: string) => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 0.5;
  const n = parseInt(m[1], 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const isLightTheme = (t: Theme) => lum(t.colors.canvas) > 0.5;
// the light and dark tones of a theme, whichever way round ink and panel sit
export const lightTone = (t: Theme) => (isLightTheme(t) ? t.colors.panel : t.colors.ink);
export const darkTone = (t: Theme) => (isLightTheme(t) ? t.colors.ink : t.colors.panel);

export const ThemeProvider: React.FC<{ themeId: string; children: React.ReactNode }> = ({ themeId, children }) => {
  const theme = THEMES[themeId];
  if (!theme) throw new Error(`Theme ${themeId} has no file in src/themes. Add it there and on the Theme_Library tab.`);
  useAsset(themeId); // the theme itself must be in the master register
  ensureFonts(theme.textStyles, useRegistryMode());
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

// A shot on a paper ground (LOK-027) renders with the theme's paper palette, so text and lines read dark on cream.
export const ThemeOverride: React.FC<{ paper?: boolean; children: React.ReactNode }> = ({ paper, children }) => {
  const base = useTheme();
  if (!paper || !base.paper) return <>{children}</>;
  const theme = { ...base, colors: { ...base.colors, ...base.paper }, optical: { ...base.optical, vignette: base.optical.vignette * 0.5 } } as Theme;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
