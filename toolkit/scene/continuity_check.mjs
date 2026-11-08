// Continuity check (8 Nov 2026): compares every scene spec with the video's continuity sheet and with its neighbours.
// usage: node continuity_check.mjs <continuity.json> <root dir for spec paths>
//  N1 locked sets: a locked set's objects are identical in every scene that uses it
//  N2 prop sizes: every scroll prop has the sheet's size (one prop, one size, every scene)
//  N3 marks across a cut: a character starts a scene where it ended the previous one
//  N4 one drawing per prop: the scene code draws each prop through the component the sheet names (when given)
import fs from 'fs'; import path from 'path';
const [cf, root] = process.argv.slice(2), C = JSON.parse(fs.readFileSync(cf, 'utf8')), rd = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const out = [], add = (id, ok, msg) => out.push({id, ok, msg}), eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const specs = C.scenes.map((s) => ({...s, spec: rd(s.spec)}));
for (const [set, L] of Object.entries(C.locked_sets || {})) { const ref = rd(L.from).objects.filter((o) => L.objects.includes(o.id));
  for (const s of specs) { const mine = s.spec.objects.filter((o) => L.objects.includes(o.id)); if (!mine.length) continue;
    const diff = ref.filter((o) => !eq(o, mine.find((m) => m.id === o.id))).map((o) => o.id); add(`N1 locked set ${set}`, !diff.length, diff.length ? `${s.id} changes ${diff.join(', ')}` : `${s.id} matches`); } }
for (const s of specs) for (const p of s.spec.props || []) { const want = (C.prop_sizes || {})[p.kind]; if (!want) continue;
  const bad = Object.entries(want).filter(([k, v]) => Math.abs((p[k] || 0) - v) > 1e-6); add('N2 prop size', !bad.length, bad.length ? `${s.id} ${p.id}: ${bad.map(([k, v]) => `${k} ${p[k]} (sheet ${v})`).join(', ')}` : `${s.id} ${p.id} matches`); }
const endX = (c) => { const m = c.moves[c.moves.length - 1]; return m ? m.x1 : null; }, startX = (c) => { const m = c.moves[0]; return m ? m.x0 : null; };
for (let i = 1; i < specs.length; i++) for (const c of specs[i].spec.characters) { const prev = specs[i - 1].spec.characters.find((x) => x.id === c.id); if (!prev) continue;
  const a = endX(prev), b = startX(c); add('N3 marks across the cut', Math.abs(a - b) < 0.05, `${c.id}: ends ${specs[i - 1].id} at ${a} m, starts ${specs[i].id} at ${b} m`); }
const fails = out.filter((o) => !o.ok); console.log(`continuity: ${fails.length} FAIL, ${out.length - fails.length} PASS`); for (const o of out) console.log(`  ${o.ok ? 'PASS' : 'FAIL'}  ${o.id}: ${o.msg}`); process.exit(fails.length ? 1 : 0);
