import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useAssets, useSourceFile } from "../registry";
import { useTheme } from "../themes";
import { sec, SLOW_OUT } from "../motion";
import { Label, type LabelSpec } from "../layers/Label";

// MAP-013 EarthFlyIn (Johnny Harris's establishing fly-in; Sam, 24 Nov 2026: "focus on 4 and 5"): the real Earth as a
// globe (NASA Blue Marble Next Generation, a cloud-free satellite composite, public domain), turning and closing in
// from space onto a place, then handing over to a registered period map of the same ground, laid exactly on its
// places (a two-point fit on two named towns), so the eye goes from today's Earth to the 1790s map without a cut.
// The globe is drawn in WebGL as a true orthographic projection: a global texture (8192 x 4096) plus a sharp inset
// for the region (240 px per degree), blended at its edges, with limb shading and a thin atmosphere.
// Best use: an act or episode opening that lands on a place. Limit: 1 per episode; public-domain imagery only,
// credited (NASA); always tagged as a satellite composite of today; the period map keeps its own source tag.
type LonLat = readonly [number, number];
export type EarthKey = { atSec: number; lon: number; lat: number; radius: number; sec?: number }; // radius: globe px
export type EarthPin = { lon: number; lat: number; text: string; atSec: number; untilSec?: number; accent?: boolean; side?: "left" | "right" };
export type EarthMap = {
  srcId: string;
  file?: string;
  size: readonly [number, number];
  atSec: number;
  sec?: number; // the dissolve, default 1.4
  // two places on the map: [map x, map y, lon, lat]
  fit: readonly [readonly [number, number, number, number], readonly [number, number, number, number]];
  grade?: "paper" | "dark";
  label?: string; // its source tag
};
export type EarthFlyInProps = {
  globe: { srcId: string; file: string; size: readonly [number, number] };
  inset?: { srcId: string; file: string; size: readonly [number, number]; lon0: number; lon1: number; lat0: number; lat1: number }; // lat0 = north edge
  keys: EarthKey[];
  pins?: EarthPin[];
  map?: EarthMap;
  tag?: { text: string; atSec?: number; untilSec?: number };
  labels?: LabelSpec[];
};

const VS = `#version 300 es
in vec2 p; out vec2 v; void main(){ v = p; gl_Position = vec4(p, 0.0, 1.0); }`;
const FS = `#version 300 es
precision highp float;
in vec2 v; out vec4 o;
uniform sampler2D g; uniform sampler2D ins; uniform int hasIns;
uniform vec4 box; // inset lon0, lon1, latN, latS
uniform vec2 res; uniform vec2 c; uniform float R; // c = lon, lat (radians); R = globe radius px
uniform vec3 atm; uniform vec3 bg;
const float PI = 3.141592653589793;
void main(){
  vec2 px = (v * 0.5 + 0.5) * res;
  vec2 q = (px - res * 0.5) / R; // y up (clip space)
  float r2 = dot(q, q);
  if (r2 > 1.0) {
    float d = (sqrt(r2) - 1.0) * R;
    float glow = exp(-d / 22.0) * 0.55;
    o = vec4(mix(bg, atm, glow), 1.0);
    return;
  }
  float z = sqrt(1.0 - r2);
  float x = q.x, y = q.y;
  float lat = asin(clamp(z * sin(c.y) + y * cos(c.y), -1.0, 1.0));
  float lon = c.x + atan(x, z * cos(c.y) - y * sin(c.y));
  lon = mod(lon + PI, 2.0 * PI) - PI;
  float dlon = degrees(lon), dlat = degrees(lat);
  vec2 uvg = vec2((dlon + 180.0) / 360.0, (90.0 - dlat) / 180.0);
  vec3 col = texture(g, uvg).rgb;
  if (hasIns == 1) {
    vec2 uvi = vec2((dlon - box.x) / (box.y - box.x), (box.z - dlat) / (box.z - box.w));
    float e = min(min(uvi.x, 1.0 - uvi.x), min(uvi.y, 1.0 - uvi.y));
    if (e > 0.0) {
      float w = smoothstep(0.0, 0.04, e);
      col = mix(col, texture(ins, uvi).rgb, w);
    }
  }
  float shade = mix(0.42, 1.0, pow(z, 0.45));
  float rim = smoothstep(0.82, 1.0, sqrt(r2));
  col = col * shade;
  col = mix(col, atm, rim * 0.35);
  o = vec4(col, 1.0);
}`;

const toRad = (d: number) => (d * Math.PI) / 180;

// the same orthographic projection on the CPU, for pins and the map fit (screen px; null when behind the globe)
const project = (lon: number, lat: number, c: LonLat, R: number, W: number, H: number): [number, number] | null => {
  const la = toRad(lat), lo = toRad(lon), la0 = toRad(c[1]), lo0 = toRad(c[0]);
  const cosc = Math.sin(la0) * Math.sin(la) + Math.cos(la0) * Math.cos(la) * Math.cos(lo - lo0);
  if (cosc < 0) return null;
  const x = R * Math.cos(la) * Math.sin(lo - lo0);
  const y = R * (Math.cos(la0) * Math.sin(la) - Math.sin(la0) * Math.cos(la) * Math.cos(lo - lo0));
  return [W / 2 + x, H / 2 - y];
};

const camAt = (keys: EarthKey[], t: number): { c: LonLat; R: number } => {
  let k = 0;
  for (let i = 0; i < keys.length; i++) if (keys[i].atSec <= t) k = i;
  const a = keys[k];
  const b = keys[k + 1];
  if (!b) return { c: [a.lon, a.lat], R: a.radius };
  const span = b.sec ?? b.atSec - a.atSec;
  const u = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (t - (b.atSec - span)) / span)));
  if (t < b.atSec - span) return { c: [a.lon, a.lat], R: a.radius };
  // radius in log space (a zoom feels even); position eased, a little ahead of the zoom so it orbits in
  const ul = Easing.inOut(Easing.quad)(Math.min(1, u * 1.15));
  return { c: [a.lon + (b.lon - a.lon) * ul, a.lat + (b.lat - a.lat) * ul], R: Math.exp(Math.log(a.radius) + (Math.log(b.radius) - Math.log(a.radius)) * u) };
};

export const EarthFlyIn: React.FC<EarthFlyInProps> = ({ globe, inset, keys, pins = [], map, tag, labels = [] }) => {
  useAssets(["MAP-013", globe.srcId, ...(inset ? [inset.srcId] : []), ...(map ? [map.srcId] : [])]);
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const gSrc = useSourceFile(globe.srcId, globe.file);
  const iSrc = inset ? useSourceFile(inset.srcId, inset.file) : null; // eslint-disable-line react-hooks/rules-of-hooks
  const mSrc = map ? useSourceFile(map.srcId, map.file) : null; // eslint-disable-line react-hooks/rules-of-hooks
  const canvas = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{ gl: WebGL2RenderingContext; prog: WebGLProgram } | null>(null);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("EarthFlyIn textures"));
  const now = frame / fps;
  const cam = camAt(keys, now);

  const hex = (h: string): [number, number, number] => {
    const m = h.replace("#", "");
    return [parseInt(m.slice(0, 2), 16) / 255, parseInt(m.slice(2, 4), 16) / 255, parseInt(m.slice(4, 6), 16) / 255];
  };
  const bg = useMemo(() => hex(t.colors.canvas), [t.colors.canvas]);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const gl = cv.getContext("webgl2", { preserveDrawingBuffer: true, antialias: true });
    if (!gl) throw new Error("EarthFlyIn: WebGL2 is not available (render with --gl=swangle or angle).");
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("EarthFlyIn shader: " + gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const load = (src: string, unit: number) =>
      new Promise<void>((res, rej) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const tex = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          const ext = gl.getExtension("EXT_texture_filter_anisotropic");
          if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
          res();
        };
        img.onerror = () => rej(new Error("EarthFlyIn: could not load " + src));
        img.src = src;
      });
    Promise.all([load(gSrc, 0), ...(iSrc ? [load(iSrc, 1)] : [])])
      .then(() => {
        glRef.current = { gl, prog };
        setReady(true);
      })
      .catch((e) => {
        throw e;
      });
  }, [gSrc, iSrc]);

  useLayoutEffect(() => {
    const g = glRef.current;
    if (!g || !ready) return;
    const { gl, prog } = g;
    gl.viewport(0, 0, W, H);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform1i(u("g"), 0);
    gl.uniform1i(u("ins"), 1);
    gl.uniform1i(u("hasIns"), inset ? 1 : 0);
    if (inset) gl.uniform4f(u("box"), inset.lon0, inset.lon1, inset.lat0, inset.lat1);
    gl.uniform2f(u("res"), W, H);
    gl.uniform2f(u("c"), toRad(cam.c[0]), toRad(cam.c[1]));
    gl.uniform1f(u("R"), cam.R);
    gl.uniform3f(u("atm"), 0.45, 0.66, 0.95);
    gl.uniform3f(u("bg"), bg[0], bg[1], bg[2]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.finish();
    continueRender(handle);
  }, [frame, ready, cam.c[0], cam.c[1], cam.R, W, H, bg, inset, handle]);

  // the period map, fitted to two named places and dissolved in
  let mapEl: React.ReactNode = null;
  if (map && mSrc) {
    const pIn = interpolate(frame, [sec(map.atSec, fps), sec(map.atSec + (map.sec ?? 1.4), fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
    const A = project(map.fit[0][2], map.fit[0][3], cam.c, cam.R, W, H);
    const B = project(map.fit[1][2], map.fit[1][3], cam.c, cam.R, W, H);
    if (pIn > 0 && A && B) {
      const [ax, ay] = [map.fit[0][0], map.fit[0][1]];
      const [bx, by] = [map.fit[1][0], map.fit[1][1]];
      const dm = Math.hypot(bx - ax, by - ay);
      const ds = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const s = ds / dm;
      const rot = Math.atan2(B[1] - A[1], B[0] - A[0]) - Math.atan2(by - ay, bx - ax);
      const filter = map.grade === "dark" ? "sepia(0.35) brightness(0.62) contrast(1.05)" : "sepia(0.15) contrast(1.02)";
      mapEl = (
        <div style={{ position: "absolute", left: 0, top: 0, width: map.size[0], height: map.size[1], transformOrigin: "0 0",
          transform: `translate(${A[0]}px, ${A[1]}px) rotate(${rot}rad) scale(${s}) translate(${-ax}px, ${-ay}px)`, opacity: pIn,
          WebkitMaskImage: "radial-gradient(ellipse 62% 60% at 50% 50%, #000 70%, transparent 100%)", maskImage: "radial-gradient(ellipse 62% 60% at 50% 50%, #000 70%, transparent 100%)" }}>
          <Img src={mSrc} style={{ width: map.size[0], height: map.size[1], filter }} />
        </div>
      );
    }
  }

  return (
    <AbsoluteFill style={{ background: t.colors.canvas }}>
      <canvas ref={canvas} width={W} height={H} style={{ position: "absolute", inset: 0, width: W, height: H }} />
      {mapEl}
      {pins.map((p, i) => {
        const xy = project(p.lon, p.lat, cam.c, cam.R, W, H);
        if (!xy) return null;
        const pin = interpolate(frame, [sec(p.atSec, fps), sec(p.atSec + 0.5, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SLOW_OUT });
        const pout = p.untilSec !== undefined ? interpolate(frame, [sec(p.untilSec, fps), sec(p.untilSec + 0.4, fps)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        const v = Math.min(pin, pout);
        if (v <= 0) return null;
        const left = p.side === "left";
        return (
          <div key={i} style={{ position: "absolute", left: xy[0], top: xy[1], opacity: v }}>
            <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: p.accent ? t.colors.accent : t.colors.ink, boxShadow: "0 2px 6px rgba(0,0,0,0.5)", transform: `scale(${0.6 + 0.4 * pin})` }} />
            <div style={{ position: "absolute", top: -17, [left ? "right" : "left"]: 22, whiteSpace: "nowrap", fontFamily: t.fonts.mono, fontSize: 24, letterSpacing: 3, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3 }}>
              {p.text}
            </div>
          </div>
        );
      })}
      {tag ? (
        <div style={{ position: "absolute", right: 120, bottom: 84, fontFamily: t.fonts.mono, fontSize: 20, letterSpacing: 2, color: t.colors.ink, background: t.colors.chip, padding: "6px 12px", borderRadius: 3,
          opacity: interpolate(frame, [sec(tag.atSec ?? 0, fps), sec((tag.atSec ?? 0) + 0.5, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
            (tag.untilSec !== undefined ? interpolate(frame, [sec(tag.untilSec, fps), sec(tag.untilSec + 0.4, fps)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1) }}>
          {tag.text}
        </div>
      ) : null}
      {labels.map((l) => (
        <Label key={`${l.text}${l.atSec}`} spec={l} />
      ))}
    </AbsoluteFill>
  );
};
