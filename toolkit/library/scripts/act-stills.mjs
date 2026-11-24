// Stills of an act at chosen act times (the Director's frame-review list), strict registry mode as in gate2-qa.
// Usage: node scripts/act-stills.mjs src/episodes/ep01-act03.json qa/WCL-E01-act03/review 2.45,8.0,22.9 [--scale 1]
// Writes <outdir>/t<sec>.jpg per time (frame = round(sec * 30)), plus <outdir>/index.json [[sec, frame, file, shot id]].
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";

const [actFile, outDir, times] = process.argv.slice(2);
if (!actFile || !outDir || !times) throw new Error("usage: act-stills.mjs ACT.json OUTDIR t1,t2,... [--scale 1]");
const args = process.argv.slice(2);
const scale = Number(args.includes("--scale") ? args[args.indexOf("--scale") + 1] : "1");
const act = JSON.parse(fs.readFileSync(actFile, "utf8"));
const last = Math.round(act.beats[act.beats.length - 1].end * 30) - 1;
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
// each bundle is ~280 MB in /tmp; 50 stale ones filled the disk on 24 Nov 2026 (LESSONS): remove it on exit
process.on("exit", () => { try { fs.rmSync(serveUrl, { recursive: true, force: true }); } catch {} });
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "swangle" } });
const index = [];
try {
  const comp = await selectComposition({ serveUrl, id: "Episode", inputProps: act, puppeteerInstance: browser });
  for (const t of times.split(",").map(Number)) {
    const frame = Math.min(last, Math.round(t * 30));
    const shot = act.beats.find((b) => frame >= Math.round(b.start * 30) && frame < Math.round(b.end * 30));
    const out = path.join(outDir, `t${t.toFixed(2)}.jpg`);
    await renderStill({ composition: comp, serveUrl, frame, output: out, inputProps: act, puppeteerInstance: browser, scale, imageFormat: "jpeg" });
    index.push([t, frame, out, shot?.id ?? "?"]);
    console.log(`t ${t.toFixed(2)} frame ${frame} ${shot?.id}`);
  }
} finally {
  await browser.close({ silent: true });
  fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(index));
}
