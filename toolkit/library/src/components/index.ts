import type React from "react";
import catalog from "./catalog.json";
import { ArchivalScanCard } from "./ArchivalScanCard";
import { MinimalDataChart } from "./MinimalDataChart";
import { HeadlineMatchCut } from "./HeadlineMatchCut";
import { ParallaxCutout } from "./ParallaxCutout";
import { SpotlightIsolator } from "./SpotlightIsolator";
import { CleanUICard } from "./CleanUICard";
import { ChapterSlate } from "./ChapterSlate";
import { ColourPathMap } from "./ColourPathMap";
import { ConeTrio } from "./ConeTrio";
import { ConeCurveChart } from "./ConeCurveChart";
import { SpectrumStrip } from "./SpectrumStrip";
import { SeriesTitleCard } from "./SeriesTitleCard";
import { EpisodeCard } from "./EpisodeCard";

// Beat-sheet name -> component. catalog.json holds each one's registry ID, beat type and energy
// (rules/beat-routing.md); the gate scripts read the same file. Episodes may only use components listed here.
export type LibraryEntry = {
  assetId: string;
  beatType: number;
  energy: string;
  grid: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FC<any>;
};

const IMPL: Record<keyof typeof catalog, LibraryEntry["Component"]> = {
  ArchivalScanCard,
  MinimalDataChart,
  HeadlineMatchCut,
  ParallaxCutout,
  SpotlightIsolator,
  CleanUICard,
  ChapterSlate,
  ColourPathMap,
  ConeTrio,
  ConeCurveChart,
  SpectrumStrip,
  SeriesTitleCard,
  EpisodeCard,
};

export const COMPONENTS: Record<string, LibraryEntry> = Object.fromEntries(
  (Object.keys(catalog) as (keyof typeof catalog)[]).map((k) => [k, { ...catalog[k], Component: IMPL[k] }]),
);
