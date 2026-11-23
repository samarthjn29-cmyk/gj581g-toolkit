// Builds src/registry/registry.json (the render manifest) from a dump of Master_Asset_Registry!A1:Y (K = Best_Use_&_Limit, W = Drive_Copy).
// Usage: node scripts/registry-build.mjs scripts/data/registry_values.json
// The dump is either the Sheets get_values response ({values:[[...]]}) or a bare array of rows; row 1 is the header.
// Columns used: A Asset_ID, B Folder, C Asset_Name, E File_Path_or_Token (";"-separated), G Status.
import fs from "node:fs";
import path from "node:path";

const input = process.argv[2] ?? "scripts/data/registry_values.json";
const raw = JSON.parse(fs.readFileSync(input, "utf8"));
const rows = Array.isArray(raw) ? raw : raw.values;
const header = rows[0];
const col = (name) => {
  const i = header.indexOf(name);
  if (i < 0) throw new Error(`Column ${name} missing from the registry dump`);
  return i;
};
const [A, B, C, E, G] = ["Asset_ID", "Folder", "Asset_Name", "File_Path_or_Token", "Status"].map(col);
// Best_Use_&_Limit (Sam, 22 Nov 2026: "determine the best use of that particular asset. That asset shall never be
// used ubiquitously"). Text like "Best use: ... Limit: max 3 beats per episode; max 8% of runtime. Not for: ...".
const K = header.indexOf("Best_Use_&_Limit");
const limits = (t) => ({
  maxBeats: Number((t.match(/max\s+(\d+)\s+(?:beats?|shots?)\s+per\s+episode/i) ?? [])[1] ?? NaN) || null,
  maxShare: Number((t.match(/max\s+(\d+(?:\.\d+)?)\s*%\s+of\s+(?:the\s+)?runtime/i) ?? [])[1] ?? NaN) || null,
});
const noLimit = [];
// Drive_Copy (Sam, 22 Nov 2026: "Are we saving the digital copies of the assets we are using in their respective
// folders?"): every Active asset that is a file (or has a preview) has a copy in its Video Reference Library folder,
// linked in column W. Code-only rules and motion presets (MOT-, TRN-001, LOK-010) live in the toolkit repo.
const W = header.indexOf("Drive_Copy");
const CODE_ONLY = /^(MOT-|TRN-001$|LOK-010$)/;
const noCopy = [];
const STATUSES = new Set(["Planned", "Spec Ready", "Active", "Retired"]);
const assets = {};
const problems = [];
for (const r of rows.slice(1)) {
  const id = (r[A] ?? "").trim();
  if (!id) continue;
  if (assets[id]) problems.push(`duplicate ID ${id}`);
  const status = (r[G] ?? "").trim();
  if (!STATUSES.has(status)) problems.push(`${id}: unknown status "${status}"`);
  assets[id] = {
    id,
    folder: (r[B] ?? "").trim(),
    name: (r[C] ?? "").trim(),
    paths: (r[E] ?? "").split(";").map((s) => s.trim()).filter(Boolean),
    status,
    use: K >= 0 ? (r[K] ?? "").trim() : "",
    ...limits(K >= 0 ? r[K] ?? "" : ""),
  };
  if (status === "Active" && K >= 0 && !(r[K] ?? "").trim() && !id.startsWith("SRC-") && !id.startsWith("NAR-")) noLimit.push(id);
  if (status === "Active" && W >= 0 && !(r[W] ?? "").trim() && !CODE_ONLY.test(id)) noCopy.push(id);
}
if (problems.length) {
  console.error("Registry problems:\n- " + problems.join("\n- "));
  process.exit(1);
}
const out = {
  generated: new Date().toISOString(),
  source: "Library - Clip Tracker / Master_Asset_Registry (1r_YXrgUdbRgWtdKjFXHQwkrSV0NoqQOiBwWN-XkKBR0)",
  assets,
};
const dest = path.join("src", "registry", "registry.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 1) + "\n");
const counts = {};
for (const a of Object.values(assets)) counts[a.status] = (counts[a.status] ?? 0) + 1;
console.log(`${dest}: ${Object.keys(assets).length} assets`, counts);
if (K < 0) console.log("WARN: no Best_Use_&_Limit column in the dump (dump Master_Asset_Registry!A1:Y).");
else if (noLimit.length) console.log(`WARN: Active assets with no Best_Use_&_Limit yet: ${noLimit.join(", ")}`);
if (W < 0) console.log("WARN: no Drive_Copy column in the dump (dump Master_Asset_Registry!A1:W).");
else if (noCopy.length) console.log(`WARN: Active assets with no Drive copy yet: ${noCopy.join(", ")}`);
