// Renders one 1920x1080 theme card per entry in themes.json into out/<id>.png (Playwright, local fonts only).
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
import fs from "node:fs";
import path from "node:path";
const here = path.dirname(new URL(import.meta.url).pathname);
const themes = JSON.parse(fs.readFileSync(path.join(here, "themes.json"), "utf8"));
const fontDir = (fam) => path.join(here, "node_modules/@fontsource", fam.toLowerCase().replace(/ /g, "-"), "files");
const face = (fam, w, style = "normal") => {
  const f = path.join(fontDir(fam), `${fam.toLowerCase().replace(/ /g, "-")}-latin-${w}-${style}.woff2`);
  return fs.existsSync(f) ? `@font-face{font-family:'${fam}';font-weight:${w};font-style:${style};src:url('file://${f}') format('woff2');}` : "";
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
fs.mkdirSync(path.join(here, "out"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
for (const t of themes) {
  const v = t.vars;
  const fams = [[t.head[0], t.head[1]], [t.body[0], t.body[1]], [t.body[0], 400], [t.label[0], t.label[1]], [t.label[0], 400]];
  let faces = fams.map(([f, w]) => face(f, w)).join("") + face(t.body[0], t.body[1], "italic") + face(t.body[0], 400, "italic");
  if (t.hand) faces += face(t.hand, 400);
  const H = `font-family:'${t.head[0]}';font-weight:${t.head[1]};${t.headCaps ? "text-transform:uppercase;letter-spacing:0.12em;" : "letter-spacing:-0.01em;"}`;
  const B = `font-family:'${t.body[0]}';font-weight:${t.body[1]};`;
  const L = `font-family:'${t.label[0]}';font-weight:${t.label[1]};`;
  const swatches = t.colors.map(([role, hex]) => {
    const parts = hex.split(" ");
    const fill = parts.length > 1 ? `linear-gradient(90deg,${parts.map((p, i) => `${p} ${(i * 100) / parts.length}%,${p} ${((i + 1) * 100) / parts.length}%`).join(",")})` : hex;
    return `<div class="sw"><div class="chip" style="background:${fill}"></div><div class="role">${esc(role)}</div><div class="hex">${esc(hex)}</div></div>`;
  }).join("");
  let sample;
  if (t.sample && t.sample.startsWith("image:")) {
    const p = path.resolve(here, t.sample.slice(6));
    sample = `<img src="file://${p}" style="width:100%;height:100%;object-fit:cover;display:block">`;
  } else {
    sample = `<div style="position:relative;width:100%;height:100%;background:${v.canvas};overflow:hidden">
      <div style="position:absolute;left:48px;top:58px;width:330px;height:410px;background:${v.paper};box-shadow:0 18px 40px rgba(0,0,0,.45);padding:26px 24px;box-sizing:border-box">
        ${Array.from({ length: 13 }, (_, i) => `<div style="height:9px;margin:0 0 15px;width:${[96, 88, 92, 70, 95, 90, 84, 93, 60, 91, 87, 94, 55][i]}%;background:${v.paperInk};opacity:.55"></div>`).join("")}
        <div style="position:absolute;left:18px;top:${26 + 24 * 4 - 4}px;width:250px;height:17px;background:${v.accent};opacity:.45;mix-blend-mode:multiply"></div>
        ${t.hand ? `<div style="position:absolute;left:150px;top:330px;font-family:'${t.hand}';font-size:32px;color:${v.accent};transform:rotate(-6deg)">his words!</div>` : ""}
      </div>
      <div style="position:absolute;left:430px;top:120px;width:470px">
        <div style="${L}font-size:15px;letter-spacing:.3em;color:${v.accent}">MANCHESTER · 1794</div>
        <div style="${H}font-size:${t.headCaps ? 40 : 54}px;line-height:1.05;color:${v.ink};margin-top:14px">The Man Who Saw Pink</div>
        <div style="${B}font-style:italic;font-size:24px;line-height:1.3;color:${v.sec};margin-top:18px">“almost an exact sky-blue by day”</div>
        <div style="width:150px;height:3px;background:${v.accent};margin-top:22px"></div>
        <div style="${L}font-size:13px;letter-spacing:.08em;color:${v.sec};margin-top:20px;background:${v.panel};display:inline-block;padding:6px 10px">DALTON · 1798 · P. 29</div>
      </div>
      <div style="position:absolute;left:430px;top:400px;width:440px">
        ${[["LONG", 0.83, v.accent], ["MEDIUM", 0.34, v.accent2], ["SHORT", 0.08, v.sec]].map(([n, val, c]) => `<div style="display:flex;align-items:center;margin-bottom:10px"><div style="${L}font-size:13px;color:${v.sec};width:80px">${n}</div><div style="height:12px;width:${300 * val}px;background:${c}"></div><div style="${L}font-size:13px;color:${v.ink};margin-left:10px">${val.toFixed(2)}</div></div>`).join("")}
      </div>
    </div>`;
  }
  const rules = Object.entries(t.rules).map(([k, val]) => `<div class="rule"><div class="rk">${esc(k)}</div><div class="rv">${esc(val)}</div></div>`).join("");
  const takeChange = t.take ? `<div class="tc"><div><span class="rk">We take</span> ${esc(t.take)}</div><div style="margin-top:8px"><span class="rk">We change</span> ${esc(t.change)}</div></div>` : "";
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${faces}
  *{box-sizing:border-box} body{margin:0;width:1920px;height:1080px;background:${v.canvas};color:${v.ink};overflow:hidden;position:relative}
  .kick{${L}font-size:18px;letter-spacing:.28em;color:${v.sec}} .pill{${L}font-size:15px;letter-spacing:.2em;color:${v.canvas};background:${v.accent};padding:6px 12px;border-radius:3px;margin-left:16px}
  .sw{width:116px;margin:0 14px 0 0} .chip{height:84px;border-radius:6px;border:1px solid ${v.hair}} .role{${L}font-size:12px;line-height:1.25;color:${v.ink};margin-top:9px;letter-spacing:.04em} .hex{${L}font-size:13px;color:${v.sec};margin-top:3px}
  .rule{flex:1;padding-right:28px} .rk{${L}font-size:14px;letter-spacing:.22em;text-transform:uppercase;color:${v.label || v.accent}} .rv{${B}font-size:20px;line-height:1.35;color:${v.ink};margin-top:8px}
  .tc{${B}font-size:19px;line-height:1.35;color:${v.ink}}
  </style></head><body>
  <div style="position:absolute;left:80px;top:64px;display:flex;align-items:center"><span class="kick">THEME CARD · ${esc(t.id)}</span><span class="pill">${esc(t.status)}</span></div>
  <div style="position:absolute;left:80px;top:112px;width:800px;${H}font-size:${t.headCaps ? 64 : t.name.length > 16 ? 62 : 88}px;line-height:1">${esc(t.name)}</div>
  <div style="position:absolute;left:82px;top:${t.headCaps || t.name.length > 16 ? 192 : 214}px;${B}font-style:italic;font-size:22px;color:${v.sec};width:760px">${esc(t.origin)}</div>
  <div style="position:absolute;left:80px;top:290px;width:820px;display:flex;flex-wrap:nowrap">${swatches}</div>
  <div style="position:absolute;left:80px;top:556px;width:780px">
    <div style="${H}font-size:${t.headCaps ? 40 : 56}px;line-height:1.05">Where Colour Lives</div>
    <div style="${B}font-size:26px;line-height:1.35;color:${v.ink};margin-top:12px">The flower was pink, but it appeared to me almost an exact sky-blue by day.</div>
    <div style="${L}font-size:16px;letter-spacing:.14em;color:${v.sec};margin-top:14px">${esc(t.head[0].toUpperCase())} ${t.head[1]} · ${esc(t.body[0].toUpperCase())} ${t.body[1]} · ${esc(t.label[0].toUpperCase())} ${t.label[1]}${t.hand ? " · " + esc(t.hand.toUpperCase()) : ""}</div>
  </div>
  <div style="position:absolute;left:920px;top:112px;width:920px;height:518px;border:1px solid ${v.hair};box-shadow:0 30px 70px rgba(0,0,0,.4)">${sample}</div>
  <div style="position:absolute;left:920px;top:640px;${L}font-size:13px;letter-spacing:.24em;color:${v.sec}">SAMPLE FRAME${t.sample ? " · RENDERED IN THE STUDIO" : " · MOCK-UP, NOT YET BUILT"}</div>
  <div style="position:absolute;left:920px;top:688px;width:920px">${takeChange}</div>
  <div style="position:absolute;left:80px;right:80px;top:${t.take ? 846 : 820}px;display:flex;border-top:1px solid ${v.hair};padding-top:26px">${rules}</div>
  </body></html>`;
  const f = path.join(here, "out", `${t.id.replace(/ /g, "_")}.html`);
  fs.writeFileSync(f, html);
  await page.goto("file://" + f);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const png = path.join(here, "out", `ThemeCard_${t.id.replace(/ /g, "_")}_${t.name.replace(/ /g, "")}.png`);
  await page.screenshot({ path: png });
  console.log(png);
}
await browser.close();
