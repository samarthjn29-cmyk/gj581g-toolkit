import React from "react";
import { Img } from "remotion";

// A rectangle of a scan or photo, given in the image's own pixels, fitted to a box ("cover" or "contain").
// cropToBox() maps image pixels to box pixels, so highlights and spotlights stay on the right words.
export type Rect = readonly [number, number, number, number]; // x, y, w, h in image pixels

export function cropToBox(
  crop: Rect,
  boxW: number,
  boxH: number,
  fit: "cover" | "contain" = "cover",
) {
  const [cx, cy, cw, ch] = crop;
  const s =
    fit === "cover"
      ? Math.max(boxW / cw, boxH / ch)
      : Math.min(boxW / cw, boxH / ch);
  const ox = (boxW - cw * s) / 2 - cx * s;
  const oy = (boxH - ch * s) / 2 - cy * s;
  const map = (r: Rect) => ({
    left: ox + r[0] * s,
    top: oy + r[1] * s,
    width: r[2] * s,
    height: r[3] * s,
  });
  return { s, ox, oy, map };
}

export const CropImage: React.FC<{
  src: string;
  imgSize: readonly [number, number];
  crop?: Rect;
  width: number;
  height: number;
  fit?: "cover" | "contain";
  filter?: string;
  children?: React.ReactNode;
}> = ({
  src,
  imgSize,
  crop,
  width,
  height,
  fit = "cover",
  filter,
  children,
}) => {
  const c = crop ?? ([0, 0, imgSize[0], imgSize[1]] as const);
  const { s, ox, oy } = cropToBox(c, width, height, fit);
  return (
    <div style={{ position: "relative", width, height, overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          position: "absolute",
          left: ox,
          top: oy,
          width: imgSize[0] * s,
          height: imgSize[1] * s,
          maxWidth: "none",
          filter,
        }}
      />
      {children}
    </div>
  );
};
