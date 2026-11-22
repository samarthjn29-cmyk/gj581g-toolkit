import React, { createContext, useContext } from "react";
import { staticFile } from "remotion";
import manifest from "./registry.json";

// The render manifest: generated from the Master_Asset_Registry by scripts/registry-build.mjs.
// Rule (Sam, 22 Nov 2026): no asset is used without a register entry, and only Active assets render.
// Every file under public/ is loaded through assetFile() below; nothing else in src/ calls staticFile().

export type AssetEntry = {
  readonly id: string;
  readonly folder: string;
  readonly name: string;
  readonly paths: readonly string[];
  readonly status: string;
};
type Manifest = { generated: string; source: string; assets: Record<string, AssetEntry> };
const M = manifest as Manifest;
export const registryInfo = { generated: M.generated, source: M.source };

// "render" (default): only Active assets. "build": library previews of pieces still being built may use
// Planned or Spec Ready assets, and the frame carries a BUILD PREVIEW tag. Episodes always render strict.
export type RegistryMode = "render" | "build";
const ModeContext = createContext<RegistryMode>("render");
export const RegistryModeProvider: React.FC<{ mode: RegistryMode; children: React.ReactNode }> = ({ mode, children }) => (
  <ModeContext.Provider value={mode}>{children}</ModeContext.Provider>
);
export const useRegistryMode = () => useContext(ModeContext);

export function checkAsset(id: string, mode: RegistryMode): AssetEntry {
  const e = M.assets[id];
  if (!e) {
    throw new Error(`${id} is not in the Master_Asset_Registry manifest. Register it, then run scripts/registry-build.mjs.`);
  }
  if (e.status === "Active") return e;
  if (mode === "build" && e.status !== "Retired") return e;
  throw new Error(`${id} (${e.name}) is "${e.status}" in the Master_Asset_Registry. Only Active assets render.`);
}

export const useAsset = (id: string): AssetEntry => checkAsset(id, useRegistryMode());

export const useAssets = (ids: readonly string[]): AssetEntry[] => {
  const mode = useRegistryMode();
  return ids.map((id) => checkAsset(id, mode));
};

// A file of a registered asset. The file must be one of the entry's paths (or inside a folder path ending in "/").
export function assetFile(entry: AssetEntry, file?: string): string {
  const p = file ?? entry.paths[0];
  if (!p) throw new Error(`${entry.id} has no file path in the registry.`);
  const listed = entry.paths.some((x) => x === p || (x.endsWith("/") && p.startsWith(x)));
  if (!listed) throw new Error(`${p} is not listed under ${entry.id} in the registry.`);
  if (!p.startsWith("public/")) throw new Error(`${entry.id}: ${p} is not a file in public/.`);
  return staticFile(p.slice("public/".length));
}

// A photo, scan or clip from 11_Sources (SRC-###).
export const useSource = (id: string): string => {
  const e = useAsset(id);
  if (e.folder !== "11_Sources") throw new Error(`${id} is in ${e.folder}, not 11_Sources.`);
  return assetFile(e);
};

// One file of a multi-file source (e.g. a clip and its reversed copy). The file must be listed on the entry.
export const useSourceFile = (id: string, file?: string): string => {
  const e = useAsset(id);
  if (e.folder !== "11_Sources") throw new Error(`${id} is in ${e.folder}, not 11_Sources.`);
  return assetFile(e, file);
};
