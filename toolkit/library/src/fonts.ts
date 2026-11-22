import { loadFont } from "@remotion/fonts";
import { assetFile, checkAsset, type RegistryMode } from "./registry";

// Font files per text-style entry (TXT-###). All SIL Open Font License, from Fontsource.
type FontFile = { family: string; file: string; weight: string; style: "normal" | "italic" };
const FONT_FILES: Record<string, readonly FontFile[]> = {
  "TXT-001": [{ family: "Archivo", file: "public/fonts/archivo-latin-800-normal.woff2", weight: "800", style: "normal" }],
  "TXT-002": [
    { family: "Newsreader", file: "public/fonts/newsreader-latin-500-normal.woff2", weight: "500", style: "normal" },
    { family: "Newsreader", file: "public/fonts/newsreader-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  "TXT-003": [{ family: "IBM Plex Mono", file: "public/fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" }],
  "TXT-004": [{ family: "Plus Jakarta Sans", file: "public/fonts/plus-jakarta-sans-latin-500-normal.woff2", weight: "500", style: "normal" }],
  "TXT-009": [
    { family: "Fraunces", file: "public/fonts/fraunces-latin-400-normal.woff2", weight: "400", style: "normal" },
    { family: "Fraunces", file: "public/fonts/fraunces-latin-400-italic.woff2", weight: "400", style: "italic" },
    { family: "Fraunces", file: "public/fonts/fraunces-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  "TXT-010": [{ family: "JetBrains Mono", file: "public/fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" }],
};

const loaded = new Set<string>();

// Loads a theme's text styles. Each style must be in the registry (Active, or Planned/Spec Ready in build mode).
export function ensureFonts(textStyles: readonly string[], mode: RegistryMode): void {
  for (const id of textStyles) {
    const entry = checkAsset(id, mode);
    if (loaded.has(id)) continue;
    const files = FONT_FILES[id];
    if (!files) throw new Error(`${id} has no font files in src/fonts.ts.`);
    loaded.add(id);
    for (const f of files) {
      loadFont({ family: f.family, url: assetFile(entry, f.file), weight: f.weight, style: f.style });
    }
  }
}
