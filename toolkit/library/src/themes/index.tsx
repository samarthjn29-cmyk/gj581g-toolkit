import React, { createContext, useContext } from "react";
import type { Theme } from "./types";
import { warmGraphite } from "./warmGraphite";
import { archivalDesk } from "./archivalDesk";
import { useAsset, useRegistryMode } from "../registry";
import { ensureFonts } from "../fonts";

export type { Theme };
// One file per Theme_Library row in use. A theme may change from video to video; the episode overview records the pick.
export const THEMES: Record<string, Theme> = { "LOK-009": warmGraphite, "LOK-001": archivalDesk };
export const DEFAULT_THEME = "LOK-009";

const ThemeContext = createContext<Theme>(warmGraphite);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ themeId: string; children: React.ReactNode }> = ({ themeId, children }) => {
  const theme = THEMES[themeId];
  if (!theme) throw new Error(`Theme ${themeId} has no file in src/themes. Add it there and on the Theme_Library tab.`);
  useAsset(themeId); // the theme itself must be in the master register
  ensureFonts(theme.textStyles, useRegistryMode());
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
