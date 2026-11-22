import React from "react";
import { useSource } from "../registry";

// Resolves an SRC-### entry to its file through the registry (a component, so lists of sources can use it).
export const SourceImage: React.FC<{
  srcId: string;
  children: (src: string) => React.ReactNode;
}> = ({ srcId, children }) => <>{children(useSource(srcId))}</>;
