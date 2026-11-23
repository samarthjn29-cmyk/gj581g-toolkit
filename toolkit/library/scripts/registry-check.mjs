// The register guard for Gate 2 (and any time): every file in public/ is registered, every Active path exists,
// no component calls staticFile() directly, and every ID an act file uses is Active.
// Usage: node scripts/registry-check.mjs [src/episodes/epXX-actYY.json ...]   (default: all act files)
import fs from "node:fs";
import path from "node:path";

const reg = JSON.parse(fs.readFileSync("src/registry/registry.json", "utf8")).assets;
const entries = Object.values(reg);
const walk = (d) =>
  fs.existsSync(d)
    ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))
    : [];
const listed = (file) => entries.find((a) => a.paths.some((p) => p === file || (p.endsWith("/") && file.startsWith(p))));

const unregistered = walk("public").filter((f) => !f.endsWith(".gitkeep")).filter((f) => !listed(f));
const missing = entries
  .filter((a) => a.status === "Active")
  .flatMap((a) => a.paths.filter((p) => p.startsWith("public/") && !p.endsWith("/") && !fs.existsSync(p)).map((p) => `${a.id}: ${p}`));
const direct = walk("src")
  .filter((f) => /\.(tsx?|jsx?)$/.test(f) && !f.startsWith(path.join("src", "registry")))
  .flatMap((f) =>
    fs
      .readFileSync(f, "utf8")
      .split("\n")
      .map((l, i) => [l, i])
      .filter(([l]) => /staticFile\s*\(|https?:\/\//.test(l.replace(/http:\/\/www\.w3\.org\/2000\/svg/g, "")) && !/^\s*\/\//.test(l)) // the SVG namespace is not a fetch
      .map(([l, i]) => `${f}:${i + 1}: ${l.trim()}`),
  );
const COMPONENT_IDS = Object.fromEntries(
  Object.entries(JSON.parse(fs.readFileSync("src/components/catalog.json", "utf8"))).map(([k, v]) => [k, v.assetId]),
);
const acts = process.argv.slice(2).length ? process.argv.slice(2) : walk("src/episodes").filter((f) => f.endsWith(".json") && !f.endsWith(".music.json"));
const inactive = [];
for (const f of acts) {
  const act = JSON.parse(fs.readFileSync(f, "utf8"));
  const ids = new Set([act.themeId]);
  for (const b of act.beats) {
    (b.assets ?? []).forEach((id) => ids.add(id));
    ids.add(COMPONENT_IDS[b.component] ?? `unknown component ${b.component}`);
    JSON.stringify(b.props ?? {}).match(/[A-Z]{3}-\d{3}/g)?.forEach((id) => {
      if (!b.assets.includes(id)) inactive.push(`${f} ${b.id}: ${id} used in props but not listed in the beat's assets`);
      ids.add(id);
    });
  }
  for (const id of ids) {
    const a = reg[id];
    if (!a) inactive.push(`${f}: ${id} is not in the registry`);
    else if (a.status !== "Active") inactive.push(`${f}: ${id} (${a.name}) is ${a.status}`);
  }
}
const lines = [
  `Registry manifest: ${entries.length} entries, ${entries.filter((a) => a.status === "Active").length} Active`,
  `Unregistered assets: ${unregistered.length}`,
  ...unregistered.map((f) => `  - ${f}`),
  `Missing files for Active entries: ${missing.length}`,
  ...missing.map((m) => `  - ${m}`),
  `Direct staticFile() or remote URLs outside src/registry: ${direct.length}`,
  ...direct.map((m) => `  - ${m}`),
  `Act files checked: ${acts.length}; IDs not Active or not listed: ${inactive.length}`,
  ...inactive.map((m) => `  - ${m}`),
];
console.log(lines.join("\n"));
process.exit(unregistered.length + missing.length + direct.length + inactive.length ? 1 : 0);
