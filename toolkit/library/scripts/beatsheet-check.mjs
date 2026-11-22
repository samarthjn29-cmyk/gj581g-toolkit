// Gate 1 register check for an episode's Beat Sheet (Sam, 22 Nov 2026: Claude fills Registry_Check, no cross-file formula).
// 1. Dump the episode's Beat_Sheet!A1:W with the Sheets connector (get_values) to a JSON file.
// 2. Rebuild the manifest from the live register first (scripts/registry-build.mjs), so statuses are current.
// 3. node scripts/beatsheet-check.mjs <dump.json>  -> prints a summary and writes <dump>_registry_check.json:
//    {"range": "Beat_Sheet!W2:W<n>", "values": [["VALID"], ["FIX: ..."], ...]} ready for update_values.
// VALID only when every ID in Visual_ID..Source_ID is registered AND Active, and no asset goes over the limit in its
// Best_Use_&_Limit (max beats per episode, max % of runtime): beats past the limit read FIX ("over its limit").
import fs from "node:fs";

const file = process.argv[2];
if (!file) throw new Error("Give the Beat_Sheet dump (get_values JSON).");
const raw = JSON.parse(fs.readFileSync(file, "utf8"));
const rows = Array.isArray(raw) ? raw : raw.values;
const header = rows[0];
const reg = JSON.parse(fs.readFileSync("src/registry/registry.json", "utf8"));
const ID_COLS = ["Visual_ID", "Text_ID", "Motion_ID", "Transition_ID", "Look_ID", "SFX_ID", "Music_ID", "Texture_ID", "Map_ID", "Packaging_ID", "Source_ID"];
const idx = Object.fromEntries(ID_COLS.map((c) => [c, header.indexOf(c)]));
for (const [c, i] of Object.entries(idx)) if (i < 0) throw new Error(`Beat_Sheet has no ${c} column`);
const beatCol = header.indexOf("Beat");
const checkCol = header.indexOf("Registry_Check");
if (checkCol < 0) throw new Error("Beat_Sheet has no Registry_Check column");
const colLetter = (n) => (n < 26 ? String.fromCharCode(65 + n) : String.fromCharCode(64 + Math.floor(n / 26)) + String.fromCharCode(65 + (n % 26)));

// Usage limits: count beats and seconds per asset across the whole sheet first.
const startCol = header.indexOf("Start_Sec");
const endCol = header.indexOf("End_Sec");
const num = (v) => Number(String(v ?? "").replace(",", "."));
const idsOf = (row, c) =>
  String(row[idx[c]] ?? "")
    .split(/[,;\s]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
let runtime = 0;
const seen = {}; // id -> {beats, secs}
const over = {}; // row index -> issues
for (let r = 1; r < rows.length; r++) {
  const row = rows[r] ?? [];
  if (!String(row[beatCol] ?? "").trim()) continue;
  const d = Math.max(0, num(row[endCol]) - num(row[startCol])) || 0;
  runtime = Math.max(runtime, num(row[endCol]) || 0);
  for (const c of ID_COLS)
    for (const id of new Set(idsOf(row, c))) {
      const a = reg.assets[id];
      if (!a) continue;
      const s0 = (seen[id] ??= { beats: 0, secs: 0 });
      s0.beats++;
      s0.secs += d;
      if (a.maxBeats && s0.beats > a.maxBeats) (over[r] ??= []).push(`${id} ${a.name} over its limit (${a.maxBeats} beats per episode)`);
    }
}
const shareIssues = [];
for (const [id, s0] of Object.entries(seen)) {
  const a = reg.assets[id];
  if (a?.maxShare && runtime > 0 && (100 * s0.secs) / runtime > a.maxShare)
    shareIssues.push(`${id} ${a.name} fills ${((100 * s0.secs) / runtime).toFixed(1)}% of the runtime (limit ${a.maxShare}%)`);
}

const out = [];
let valid = 0;
let fix = 0;
const problems = [];
for (let r = 1; r < rows.length; r++) {
  const row = rows[r] ?? [];
  const beat = String(row[beatCol] ?? "").trim();
  if (!beat) {
    out.push([""]);
    continue;
  }
  const issues = [];
  if (!String(row[idx.Visual_ID] ?? "").trim()) issues.push("no Visual_ID");
  for (const c of ID_COLS) {
    const ids = String(row[idx[c]] ?? "")
      .split(/[,;\s]+/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    for (const id of ids) {
      const a = reg.assets[id];
      if (!a) issues.push(`${id} not registered`);
      else if (a.status !== "Active") issues.push(`${id} ${a.name} is ${a.status}`);
    }
  }
  for (const o of over[r] ?? []) issues.push(o);
  if (issues.length) {
    fix++;
    problems.push(`beat ${beat}: ${issues.join("; ")}`);
    out.push([`FIX: ${issues.join("; ")}`]);
  } else {
    valid++;
    out.push(["VALID"]);
  }
}
while (out.length && out[out.length - 1][0] === "") out.pop();
const L = colLetter(checkCol);
const result = { range: `Beat_Sheet!${L}2:${L}${out.length + 1}`, values: out };
const dest = file.replace(/\.json$/, "") + "_registry_check.json";
fs.writeFileSync(dest, JSON.stringify(result));
console.log(`Registry manifest generated ${reg.generated}`);
console.log(`Beats checked: ${valid + fix}; VALID: ${valid}; FIX: ${fix}`);
problems.forEach((p) => console.log("  - " + p));
shareIssues.forEach((p) => console.log("  - SHARE: " + p));
console.log(`Write ${result.range} from ${dest}`);
process.exit(fix || shareIssues.length ? 1 : 0);
