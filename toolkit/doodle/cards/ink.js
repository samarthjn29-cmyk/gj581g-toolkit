// Mild Astonishment doodle-card library: ink on the video's painted paper, Kalam lettering, the video's fieldtag,
// a red pen for the verdict, a pencil margin aside. Every function is deterministic in t (same t, same frame).
import rough from '/node_modules/roughjs/bundled/rough.esm.js';
export const Q = new URLSearchParams(location.search);
export const P = {
  paper: Q.get('paper') || '#E5E3D2', ink: Q.get('ink') || '#1e2b22', red: Q.get('red') || '#8f1d10',
  gold: Q.get('gold') || '#c99a2e', green: Q.get('green') || '#3f5f46', pencil: Q.get('pencil') || '#7b776c', tagbg: Q.get('tagbg') || '#f1efe4',
};
export const cv = document.getElementById('c'), g = cv.getContext('2d'), rc = rough.canvas(cv);
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const ease = x => { x = clamp(x); return x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2; };
export const back = x => { x = clamp(x); const c1 = 1.7, c3 = c1 + 1; return 1 + c3*Math.pow(x-1,3) + c1*Math.pow(x-1,2); };
export const k = (t, a, d = 0.5) => ease((t - a) / d);           // 0..1 progress of a beat starting at a
export const boil = t => Math.floor(t * 6) % 3;                   // line boil, 6 times a second
let _s = 7; export const seedRnd = s => { _s = s; }; export const rnd = () => (_s = (_s * 16807) % 2147483647) / 2147483647;

// painted paper: cream ground, soft gouache blotches, fibre grain, warm vignette (built once)
let paperCv = null;
function buildPaper() {
  const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; const x = c.getContext('2d');
  x.fillStyle = P.paper; x.fillRect(0, 0, 1920, 1080); seedRnd(11);
  for (let i = 0; i < 140; i++) { const px = rnd()*1920, py = rnd()*1080, r = 60 + rnd()*320, dark = rnd() < .55;
    const gr = x.createRadialGradient(px, py, 0, px, py, r); gr.addColorStop(0, dark ? 'rgba(140,115,70,0.022)' : 'rgba(255,253,240,0.07)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.fillRect(px - r, py - r, 2*r, 2*r); }
  const id = x.getImageData(0, 0, 1920, 1080), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (rnd() - .5) * 10; d[i] += n; d[i+1] += n; d[i+2] += n * .8; }
  x.putImageData(id, 0, 0);
  const v = x.createRadialGradient(960, 540, 420, 960, 540, 1150); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(80,55,20,0.12)');
  x.fillStyle = v; x.fillRect(0, 0, 1920, 1080); return c;
}
// bg=none: a transparent layer for ink drawn straight onto a painted still (the mix)
export const INK_ONLY = Q.get('bg') === 'none';
if (INK_ONLY) { document.documentElement.style.background = 'transparent'; document.body.style.background = 'transparent'; }
export function paper() { if (INK_ONLY) { g.clearRect(0, 0, 1920, 1080); return; } if (!paperCv) paperCv = buildPaper(); g.drawImage(paperCv, 0, 0); }
// follow a slow camera zoom on the still under the ink: scale about (cx, cy), s = 1 + rate * (t - t0)
export function follow(t, cx, cy, t0, rate) { const s = 1 + rate * (t - t0); g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy); }

// lettering that writes on left to right
export function txt(s, x, y, size, color, kk = 1, align = 'center', rot = 0, font = 'Kalam', weight = 400) {
  if (kk <= 0) return; g.save(); g.font = `${weight} ${size}px ${font}`; g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle';
  g.translate(x, y); g.rotate(rot); const w = g.measureText(s).width; const left = align === 'center' ? -w/2 : align === 'right' ? -w : 0;
  g.beginPath(); g.rect(left - 12, -size * 1.2, (w + 24) * clamp(kk), size * 2.4); g.clip(); g.fillText(s, 0, 0); g.restore();
}
// the video's fieldtag: level cream card, dark border, dark dot ringed in red, mono text (top-left by default)
export function tag(s, kk, x = 77, y = 76, size = 34) {
  if (kk <= 0) return; g.save(); g.globalAlpha = clamp(kk * 1.4); g.font = `500 ${size}px JetBrains Mono`; const w = g.measureText(s).width + 92, h = size * 1.75;
  const dy = (1 - back(kk)) * -18; g.translate(x, y + dy);
  g.fillStyle = P.tagbg; g.fillRect(0, 0, w, h); g.strokeStyle = P.ink; g.lineWidth = 2.5; g.strokeRect(0, 0, w, h);
  g.beginPath(); g.arc(30, h/2, 9, 0, 7); g.fillStyle = P.ink; g.fill(); g.lineWidth = 3; g.strokeStyle = P.red; g.beginPath(); g.arc(30, h/2, 13, 0, 7); g.stroke();
  g.fillStyle = P.ink; g.textBaseline = 'middle'; g.fillText(s, 56, h/2 + 2); g.restore();
}
// pencil aside in the margin (Sam's dry voice)
export function margin(s, x, y, kk, size = 40, rot = -0.035) { txt(s, x, y, size, P.pencil, kk, 'center', rot); }
// a hand-drawn pen stroke along points, revealed up to kk
export function pen(pts, kk, color = P.red, w = 5) {
  if (kk <= 0) return; const n = Math.max(2, Math.floor(pts.length * clamp(kk))); g.save(); g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) g.lineTo(pts[i][0], pts[i][1]); g.stroke(); g.restore();
}
// the red-pen ring: a loose ellipse that overshoots its start, like a real pen circle
export function ring(cx, cy, rx, ry, kk, seed = 3, color = P.red, w = 5) {
  seedRnd(seed); const pts = []; const a0 = -2.2, turns = 1.12, N = 120;
  for (let i = 0; i <= N; i++) { const a = a0 + (i / N) * turns * 2 * Math.PI, j = 1 + (rnd() - .5) * 0.025 + 0.06 * (i / N);
    pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]); }
  pen(pts, kk, color, w);
}
export function line(x1, y1, x2, y2, kk, color = P.ink, w = 3, seed = 5) {
  if (kk <= 0) return; const t = clamp(kk); rc.line(x1, y1, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, {stroke: color, strokeWidth: w, roughness: 1.1, seed});
}
export function underline(x1, x2, y, kk, color = P.red, w = 5) { const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([x1 + (x2 - x1) * u, y + Math.sin(u * 9) * 2.5]); } pen(pts, kk, color, w); }
export function eye(cx, cy, s, kk, seed, iris = P.gold) {   // an ink eye with a gold iris
  if (kk <= 0) return; const sc = back(kk) * s; g.save(); g.translate(cx, cy); g.scale(sc, sc);
  rc.ellipse(0, 0, 120, 64, {stroke: P.ink, strokeWidth: 3 / sc, roughness: 1.2, seed, fill: P.tagbg, fillStyle: 'solid'});
  rc.circle(0, 0, 40, {stroke: P.ink, strokeWidth: 2.5 / sc, fill: iris, fillStyle: 'solid', seed: seed + 1}); g.beginPath(); g.arc(0, 0, 8, 0, 7); g.fillStyle = P.ink; g.fill(); g.restore();
}
export function flower(cx, cy, s, kk, seed) {
  if (kk <= 0) return; const sc = back(kk) * s; g.save(); g.translate(cx, cy); g.scale(sc, sc);
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; rc.ellipse(Math.cos(a) * 22, Math.sin(a) * 22, 30, 30, {stroke: P.ink, strokeWidth: 2.5 / sc, fill: '#d9a7a0', fillStyle: 'solid', seed: seed + i}); }
  rc.circle(0, 0, 24, {stroke: P.ink, strokeWidth: 2.5 / sc, fill: P.gold, fillStyle: 'solid', seed: seed + 9}); g.restore();
}
export const fontsReady = () => Promise.all(['40px Kalam', '700 40px Kalam', '500 30px JetBrains Mono'].map(f => document.fonts.load(f)));
