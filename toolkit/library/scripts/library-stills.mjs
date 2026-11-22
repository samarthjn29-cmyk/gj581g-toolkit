// Renders check stills of every library preview composition (both themes) and a contact sheet.
// Usage: node scripts/library-stills.mjs [render|build] [seconds,comma,separated] [id-filter-regex]
// "render" (default) is strict: only Active assets. "build" previews pieces still Planned (frames are tagged).
import { bundle } from "@remotion/bundler";
import { getCompositions, openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const mode = process.argv[2] ?? "render";
const times = (process.argv[3] ?? "2.5").split(",").map(Number);
const only = process.argv[4] ? new RegExp(process.argv[4]) : null;
const outDir = path.resolve("qa", "library", mode);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "swangle" } });
const comps = (await getCompositions(serveUrl, { puppeteerInstance: browser })).filter((c) => c.id !== "Episode" && (!only || only.test(c.id)));
const files = [];
const failures = [];
for (const c0 of comps) {
  const inputProps = { ...c0.defaultProps, registryMode: mode };
  let c;
  try {
    c = await selectComposition({ serveUrl, id: c0.id, inputProps, puppeteerInstance: browser });
  } catch (e) {
    failures.push(`${c0.id}: ${String(e.message ?? e).split("\n")[0]}`);
    console.log("FAIL", c0.id, String(e.message ?? e).split("\n")[0]);
    continue;
  }
  for (const t of times) {
    const frame = Math.min(c.durationInFrames - 1, Math.round(t * c.fps));
    const output = path.join(outDir, `${c.id}_f${String(frame).padStart(3, "0")}.jpg`);
    try {
      await renderStill({
        composition: c,
        serveUrl,
        frame,
        output,
        imageFormat: "jpeg",
        jpegQuality: 88,
        inputProps,
        puppeteerInstance: browser,
      });
      files.push(output);
      console.log("ok  ", path.basename(output));
    } catch (e) {
      failures.push(`${c.id} @${frame}: ${String(e.message ?? e).split("\n")[0]}`);
      console.log("FAIL", c.id, String(e.message ?? e).split("\n")[0]);
    }
  }
}
if (files.length) {
  const cols = 4;
  const args = [];
  files.forEach((f) => args.push("-i", f));
  const rows = Math.ceil(files.length / cols);
  const fill = rows * cols - files.length;
  const labels = files.map((f, i) => `[${i}:v]scale=640:360,drawtext=text='${path.basename(f, ".jpg")}':x=8:y=8:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`);
  for (let k = 0; k < fill; k++) labels.push(`color=black:s=640x360:d=1[e${k}]`);
  const inputs = files.map((_, i) => `[v${i}]`).concat(Array.from({ length: fill }, (_, k) => `[e${k}]`));
  const layout = inputs.map((_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join("|");
  const graph = `${labels.join(";")};${inputs.join("")}xstack=inputs=${inputs.length}:layout=${layout}[out]`;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args, "-filter_complex", graph, "-map", "[out]", "-frames:v", "1", path.join(outDir, "contact_sheet.jpg")]);
}
await browser.close({ silent: true });
fs.writeFileSync(path.join(outDir, "failures.txt"), failures.join("\n") + "\n");
console.log(`${files.length} stills, ${failures.length} failures -> ${outDir}`);
process.exit(failures.length ? 1 : 0);
