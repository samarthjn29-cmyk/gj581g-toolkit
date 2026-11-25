// Gate 2, still check, for one act file.
// Usage: node scripts/gate2-qa.mjs src/episodes/epXX-actYY.json [--voice voice.wav] [--scale 1]
// Writes qa/<episodeId>/stills/<beat>.jpg at each beat's midpoint, contact_sheet.jpg, checks.txt and gate2-report.md.
// The visual verdict per beat (PASS / FAIL / WARN with the exact fix) is filled in after looking at the stills.
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const actFile = args.find((a) => a.endsWith(".json"));
if (!actFile) throw new Error("Give the act file, e.g. src/episodes/ep01-act01.json");
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const scale = Number(opt("--scale", "0.5"));
const voice = opt("--voice", null);
const FPS = 30;
const act = JSON.parse(fs.readFileSync(actFile, "utf8"));
const catalog = JSON.parse(fs.readFileSync("src/components/catalog.json", "utf8"));
const qa = path.resolve("qa", act.episodeId);
const stillsDir = path.join(qa, "stills");
fs.mkdirSync(stillsDir, { recursive: true });

// ---- checks that need no rendering
const checks = [];
const crit = [];
const warn = [];
const beats = act.beats;
const f = (s) => Math.round(s * FPS);
// A shot may join several beat-sheet beats (beatTimes: [[id, start, end], ...]); lengths and stills go per beat.
const units = beats.flatMap((b) =>
  Array.isArray(b.beatTimes) && b.beatTimes.length
    ? b.beatTimes.map(([id, s0, e0]) => ({ ...b, id, start: s0, end: e0, shot: b.id }))
    : [{ ...b, shot: b.id }],
);
checks.push(`Act: ${act.episodeId}  theme: ${act.themeId}  beats: ${beats.length}  fps: ${FPS}`);
let gaps = 0;
beats.forEach((b, i) => {
  if (f(b.end) <= f(b.start)) crit.push(`${b.id}: zero or negative length`);
  if (i && f(b.start) !== f(beats[i - 1].end)) gaps++;
});
checks.push(`Frame parity: ${beats.length} beats on whole frames (Math.round(s*30)); gaps/overlaps between beats: ${gaps}`);
if (gaps) crit.push(`${gaps} gap(s) or overlap(s) between beats`);
for (const b of units) {
  const len = (f(b.end) - f(b.start)) / FPS;
  if (len > 6) crit.push(`${b.id}: ${len.toFixed(2)} s (static risk; split it or add a change inside the shot)`);
  else if (len < 2 || len > 3.5) warn.push(`${b.id}: ${len.toFixed(2)} s, outside 2.0-3.5 s (OK only if the shot changes inside)`);
  if (!catalog[b.component]) crit.push(`${b.id}: ${b.component} is not a library component`);
}
beats.forEach((b, i) => {
  const p = beats[i - 1];
  if (!p) return;
  if (catalog[p.component]?.energy === "Peak" && catalog[b.component]?.energy === "Peak") crit.push(`${p.id}->${b.id}: peak after peak (needs a calm beat between)`);
  if (p.component === b.component) {
    const key = (x) => JSON.stringify([x.props?.srcId ?? x.props?.bg, x.props?.backdrop, x.props?.file, x.props?.crop, x.props?.mode, x.props?.lines, x.props?.worlds?.map((w) => w.srcId), x.props?.depth, x.props?.vanishY, x.ground?.kind, x.ground?.srcId, x.props?.zoom?.scale]); // act 5: a panel on a different ground, or an eye plate framed closer, is a different picture // LayerStage: its worlds; PerspectiveGrid: its camera (a wide room and a close wall are different pictures)
    const same = key(p) === key(b);
    (same ? crit : warn).push(`${p.id}->${b.id}: back-to-back ${b.component}${same ? " on the same picture (clone)" : ""}`);
  }
  if (b.transitionIn === "push" && !b.focus) crit.push(`${b.id}: push-through without a focus point`);
  if (b.transitionIn === "push" && p.transitionIn === "push") crit.push(`${p.id}->${b.id}: two push-throughs in a row (TRN-006 limit)`);
  if (b.transitionIn === "match" && p.transitionIn === "match") crit.push(`${p.id}->${b.id}: two match cuts in a row (TRN-015 limit)`);
  // TRN-011/012/013 (22 Nov 2026): never the same designed wipe twice in a row; a colour block needs its data colour.
  if (["band", "block", "flash"].includes(b.transitionIn) && p.transitionIn === b.transitionIn) crit.push(`${p.id}->${b.id}: two ${b.transitionIn} transitions in a row`);
  if (b.transitionIn === "block" && !b.transition?.color) crit.push(`${b.id}: colour block without its data colour`);
});
// Reading time (Sam, 22 Nov 2026: "should stay on the screen for enough time so that someone can actually read
// them when you highlight"): a page shot stays at least 4 s, and every highlight keeps 2 s on screen after it lands.
for (const b of beats.filter((x) => x.component === "ArchivalScanCard")) {
  const len = b.end - b.start;
  if (len < 4) crit.push(`${b.id}: page on screen ${len.toFixed(2)} s (at least 4 s to read it)`);
  for (const h of b.props?.highlights ?? []) {
    const left = len - h.atSec - 0.7;
    if (left < 2) crit.push(`${b.id}: highlight at ${h.atSec}s leaves ${left.toFixed(2)} s to read (needs 2 s)`);
  }
}
// Rule R, real entrances (MOT-015, 23 Nov 2026; Sam: "Sure" to things entering by their own motion): every cut-out
// object comes in by a named real-world entrance (the component throws without one) and lands with a sound: a cue
// from 0.35 s before to 0.15 s after the landing. Its one action must come after it lands (the component throws).
// Cut-outs may only enter through ObjectEntrance: ObjectStory, RiseFromBehind keep their own designed moves.
const cues = act.audio ?? [];
for (const b of beats.filter((x) => x.component === "ObjectEntrance")) {
  for (const o of b.props?.objects ?? []) {
    if (!o.enter?.kind) crit.push(`${b.id}: an object with no entrance (rule R: slide, setDown, roll, path or grow)`);
    const land = b.start + o.atSec + (o.enter?.sec ?? 0.9);
    const heard = cues.some((c) => c.atSec >= land - 0.35 && c.atSec <= land + 0.15);
    if (!heard) crit.push(`${b.id}: ${o.srcId} lands at ${land.toFixed(2)} s with no sound (rule R: a cue within -0.35/+0.15 s)`);
  }
  if ((b.props?.objects ?? []).length > 4) crit.push(`${b.id}: more than 4 objects in one ObjectEntrance`);
}
const entranceShots = beats.filter((b) => b.component === "ObjectEntrance").length;
if (entranceShots > 3) crit.push(`${entranceShots} ObjectEntrance shots in one act (VIS-058: max 3)`);
// Rule D, the Director (23 Nov 2026; Sam: "Setup the Director"; rules/DIRECTOR.md): every layered, carried-object,
// map-move or carry-over-transition shot has a brief in episodes_src/<EP>/director/<act>_brief.md under a heading
// with its shot id, and every LayerStage world states its relation to the subject (`why`).
const DIRECTED = new Set(["LayerStage", "ObjectEntrance", "ObjectStory", "TravellingMap"]);
const CARRY_IN = new Set(["push", "match", "lens"]);
const directed = beats.filter((b) => DIRECTED.has(b.component) || CARRY_IN.has(b.transitionIn));
if (directed.length) {
  const ep = String(act.episodeId).split("-act")[0];
  const briefFile = path.resolve("..", "episodes_src", ep, "director", `${path.basename(actFile, ".json")}_brief.md`);
  const brief = fs.existsSync(briefFile) ? fs.readFileSync(briefFile, "utf8") : "";
  checks.push(`Director: ${directed.length} shot(s) need a brief; ${brief ? path.relative(process.cwd(), briefFile) : "no brief file"}`);
  for (const b of directed) {
    if (!new RegExp(`^#+ .*\\b${b.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "m").test(brief)) crit.push(`${b.id}: no Director's brief (rule D: ${path.basename(briefFile)}, a heading with the shot id)`);
  }
}
for (const b of beats.filter((x) => x.component === "LayerStage")) {
  (b.props?.worlds ?? []).forEach((w, i) => {
    if (!w.why || w.why.trim().length < 12) crit.push(`${b.id}: world ${i + 1} (${w.srcId}) has no 'why' (rule D: its relation to the subject)`);
  });
  (b.props?.carry ?? []).forEach((c) => (c.moves ?? []).forEach((m, i) => {
    if (!m.why) crit.push(`${b.id}: ${c.srcId} move ${i + 1} has no 'why' (rule D: a destination that means something)`);
  }));
}
const frenzy = beats.filter((b) => b.component === "HeadlineMatchCut").length;
const matches = beats.filter((b) => b.transitionIn === "match").length;
const changes = beats.filter((b, i) => i > 0 && b.transitionIn && b.transitionIn !== "cut").length;
if (matches * 3 > changes + 2) crit.push(`${matches} match cuts in ${changes} scene changes (TRN-015: max 1 in 3)`);
if (frenzy > 1) warn.push(`HeadlineMatchCut used ${frenzy} times in one act (once a chapter at most)`);
const remote = JSON.stringify(act).match(/https?:\/\/[^"]+/g) ?? [];
checks.push(`Local paths: ${remote.length ? `${remote.length} remote URL(s)` : "all local"}`);
if (remote.length) crit.push(`remote URLs in the act file: ${remote.join(", ")}`);
const fontsMissing = fs.readdirSync("public/fonts").length ? [] : ["public/fonts is empty"];
checks.push(`Fonts: ${fs.readdirSync("public/fonts").length} files in public/fonts${fontsMissing.length ? " (MISSING)" : ""}`);
if (voice) {
  const d = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", voice]).toString());
  const at = act.voice?.atSec ?? 0;
  const cards = new Set(["SeriesTitleCard", "EpisodeCard"]);
  const lastVoiced = [...units].reverse().find((u) => !cards.has(u.component)) ?? units[units.length - 1];
  // tailSec: a deliberate pause after the voice file ends (the gap before the next act), declared in the act file
  // (WCL-E01 act 2, 22 Nov 2026: the approved beat sheet ends 0.64 s after Sam's take). Only that tail is accepted.
  const tail = act.voice?.tailSec ?? 0;
  const diff = Math.abs(f(at + d + tail) - f(lastVoiced.end));
  checks.push(`Voice: ${d.toFixed(3)} s from ${at.toFixed(2)} s, ends ${(at + d).toFixed(3)} s${tail ? ` + ${tail.toFixed(2)} s tail` : ""}; last voiced beat ends ${lastVoiced.end.toFixed(3)} s; difference ${diff} frame(s)`);
  if (diff > 1) crit.push(`beats and voice differ by ${diff} frames`);
} else checks.push("Voice length: not checked (no --voice given)");
checks.push(
  `Sounds in the act: ${(act.audio ?? []).map((c) => `${c.id} @ ${c.atSec}s`).join(", ") || "none"} (placement in pauses checked at Gate 3 against the word times)`,
);
const reg = spawnSync("node", ["scripts/registry-check.mjs", actFile], { encoding: "utf8" });
checks.push("--- registry guard", reg.stdout.trim());
if (reg.status !== 0) crit.push("registry guard failed (see above)");

// ---- stills at each beat's midpoint, strict registry mode
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
// each bundle is ~280 MB in /tmp; 50 stale ones filled the disk on 24 Nov 2026 (LESSONS): remove it on exit
process.on("exit", () => { try { fs.rmSync(serveUrl, { recursive: true, force: true }); } catch {} });
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "swangle" } });
const rendered = [];
const stillErr = {};
try {
  const comp = await selectComposition({ serveUrl, id: "Episode", inputProps: act, puppeteerInstance: browser });
  for (const b of units) {
    const frame = Math.floor((f(b.start) + f(b.end)) / 2);
    const out = path.join(stillsDir, `${b.id}_f${frame}.jpg`);
    try {
      await renderStill({ composition: comp, serveUrl, frame, output: out, inputProps: act, puppeteerInstance: browser, scale, imageFormat: "jpeg" });
      rendered.push([b, frame, out]);
    } catch (e) {
      stillErr[b.id] = String(e.message ?? e).split("\n")[0];
      crit.push(`${b.id}: still failed: ${stillErr[b.id]}`);
    }
  }
} catch (e) {
  crit.push(`Episode composition failed: ${String(e.message ?? e).split("\n")[0]}`);
}
await browser.close({ silent: true });

if (rendered.length) {
  const cols = Math.min(4, rendered.length);
  const inputs = rendered.flatMap(([, , o]) => ["-i", o]);
  const n = rendered.length;
  const fill = Math.ceil(n / cols) * cols - n;
  const lab = rendered.map(([b], i) => `[${i}:v]scale=640:360,drawtext=text='${b.id} ${b.component}':x=8:y=8:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`);
  for (let k = 0; k < fill; k++) lab.push(`color=black:s=640x360:d=1[e${k}]`);
  const all = rendered.map((_, i) => `[v${i}]`).concat(Array.from({ length: fill }, (_, k) => `[e${k}]`));
  const layout = all.map((_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join("|");
  const graph = all.length > 1 ? `${lab.join(";")};${all.join("")}xstack=inputs=${all.length}:layout=${layout}[out]` : `${lab[0].replace(/\[v0\]$/, "[out]")}`;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...inputs, "-filter_complex", graph, "-map", "[out]", "-frames:v", "1", path.join(qa, "contact_sheet.jpg")]);
}

const verdict = crit.length ? "FAIL" : "AUTO-PASS (visual review pending)";
checks.push("--- critical", ...(crit.length ? crit.map((c) => `  - ${c}`) : ["  none"]), "--- warnings", ...(warn.length ? warn.map((w) => `  - ${w}`) : ["  none"]), `Result: ${verdict}`);
fs.writeFileSync(path.join(qa, "checks.txt"), checks.join("\n") + "\n");
const rows = units.map((b) => {
  const r = rendered.find(([x]) => x.id === b.id);
  const auto = [...crit, ...warn].filter((c) => c.includes(b.id)).join("; ") || "ok";
  return `| ${b.id} | ${b.start.toFixed(2)}-${b.end.toFixed(2)} | ${b.component} | ${r ? `stills/${path.basename(r[2])}` : "FAILED"} | ${auto} | to review |`;
});
fs.writeFileSync(
  path.join(qa, "gate2-report.md"),
  [`# Gate 2 report: ${act.episodeId}`, "", `Automatic result: **${verdict}** (details in checks.txt)`, "", "| Beat | Time (s) | Component | Still | Automatic checks | Visual (PASS / FAIL / WARN + fix) |", "|---|---|---|---|---|---|", ...rows, ""].join("\n"),
);
console.log(checks.join("\n"));
process.exit(crit.length ? 1 : 0);
