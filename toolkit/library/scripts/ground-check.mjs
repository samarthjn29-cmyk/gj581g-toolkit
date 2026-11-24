// Ground rule check (Sam, 23 Nov 2026: "it gets a bit boring when you use only one background for all your frames").
// Usage: node scripts/ground-check.mjs src/episodes/ep01-act02.json [...more act files]
// Each shot's ground is its `ground.kind`, else the component's own full-frame picture (footage, map, collage),
// else the theme canvas ("graphite"). Title cards are left out. FAIL when:
//   - one ground holds for more than 2 shots in a row ("photo" is exempt: each footage or photo shot is its own picture);
//   - an act of 8+ shots uses fewer than 4 grounds;
//   - graphite covers more than 40% of the act's runtime.
import fs from "node:fs";

const NATIVE = {
  FootagePlate: "photo", LensDive: "photo", HalftoneMoire: "photo", ParallaxCutout: "photo", ReportedColour: "photo",
  LayerStage: "photo", PeriodMapPlate: "map", TravellingMap: "map", FootageMontage: "photo", DuotoneCollage: "collage", SourceWall: "collage", BuildUpMap: "paper",
};
const TITLES = new Set(["ChapterSlate", "SeriesTitleCard", "EpisodeCard"]);
let failed = false;
for (const f of process.argv.slice(2)) {
  const act = JSON.parse(fs.readFileSync(f, "utf8"));
  const shots = act.beats.filter((b) => !TITLES.has(b.component));
  const rows = shots.map((b) => ({ id: b.id, comp: b.component, g: b.ground ? (b.ground.kind === "paper" && b.ground.tone === "dark" ? "desk" : b.ground.kind) : NATIVE[b.component] ?? "graphite", dur: b.end - b.start }));
  const total = rows.reduce((s, r) => s + r.dur, 0);
  const share = {};
  for (const r of rows) share[r.g] = (share[r.g] ?? 0) + r.dur;
  const problems = [];
  let run = 1;
  for (let i = 1; i < rows.length; i++) {
    run = rows[i].g === rows[i - 1].g && rows[i].g !== "photo" ? run + 1 : 1;
    if (run === 3) problems.push(`${rows[i - 2].id} -> ${rows[i].id}: "${rows[i].g}" for 3+ shots in a row`);
  }
  const kinds = Object.keys(share);
  if (rows.length >= 8 && kinds.length < 4) problems.push(`only ${kinds.length} grounds (${kinds.join(", ")}); 4+ needed`);
  const gShare = (share.graphite ?? 0) / total;
  if (gShare > 0.4) problems.push(`graphite ${(gShare * 100).toFixed(0)}% of the act (max 40%)`);
  console.log(`\n${f}: ${rows.length} shots, ${total.toFixed(1)} s`);
  for (const [k, v] of Object.entries(share).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(9)} ${v.toFixed(1).padStart(6)} s  ${((v / total) * 100).toFixed(0).padStart(3)}%`);
  console.log("  order: " + rows.map((r) => r.g).join(" > "));
  if (problems.length) {
    failed = true;
    for (const p of problems) console.log("  FAIL " + p);
  } else console.log("  PASS");
}
process.exit(failed ? 1 : 0);
