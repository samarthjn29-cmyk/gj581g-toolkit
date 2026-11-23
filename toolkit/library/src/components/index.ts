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
import { PerspectiveGrid } from "./PerspectiveGrid";
import { FootagePlate } from "./FootagePlate";
import { SwatchRows } from "./SwatchRows";
import { YearCounter } from "./YearCounter";
import { EyeDiagram } from "./EyeDiagram";
import { KineticLine } from "./KineticLine";
import { EyeDissection } from "./EyeDissection";
import { HalftoneMoire } from "./HalftoneMoire";
import { DuotoneCollage } from "./DuotoneCollage";
import { RisoPlate } from "./RisoPlate";
import { LensDive } from "./LensDive";
import { PeriodMapPlate } from "./PeriodMapPlate";
import { ReportedColour } from "./ReportedColour";
import { SplitComparisonCard } from "./SplitComparisonCard";
import { ScaleField } from "./ScaleField";
import { PageSpread } from "./PageSpread";
import { LedgerCard } from "./LedgerCard";
import { SourceWall } from "./SourceWall";
import { BuildUpMap } from "./BuildUpMap";
import { ObjectStory } from "./ObjectStory";
import { SourcePageStory } from "./SourcePageStory";
import { TravellingMap } from "./TravellingMap";
import { FootageMontage } from "./FootageMontage";
import { EvidenceChain } from "./EvidenceChain";
import { WhatWeKnow } from "./WhatWeKnow";
import { TimelineRail } from "./TimelineRail";
import { LetterDrop } from "./LetterDrop";
import { ArchiveGate } from "./ArchiveGate";
import { ZoomNest } from "./ZoomNest";
import { ObjectEntrance } from "./ObjectEntrance";
import { LayerStage } from "./LayerStage";
import { StillsMontage } from "./StillsMontage";
import { FlashMontage } from "./FlashMontage";

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
  PerspectiveGrid,
  FootagePlate,
  SwatchRows,
  YearCounter,
  EyeDiagram,
  KineticLine,
  EyeDissection,
  HalftoneMoire,
  DuotoneCollage,
  RisoPlate,
  LensDive,
  PeriodMapPlate,
  ReportedColour,
  SplitComparisonCard,
  ScaleField,
  PageSpread,
  LedgerCard,
  SourceWall,
  BuildUpMap,
  ObjectStory,
  SourcePageStory,
  TravellingMap,
  FootageMontage,
  EvidenceChain,
  WhatWeKnow,
  TimelineRail,
  LetterDrop,
  ArchiveGate,
  ZoomNest,
  ObjectEntrance,
  LayerStage,
  StillsMontage,
  FlashMontage,
};

export const COMPONENTS: Record<string, LibraryEntry> = Object.fromEntries(
  (Object.keys(catalog) as (keyof typeof catalog)[]).map((k) => [k, { ...catalog[k], Component: IMPL[k] }]),
);
