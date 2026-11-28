// Silent cut-time scan for the beat-vs-cut study (28 Nov 2026). Paste in the built-in browser on a youtube.com page
// (feed/library has no video). FIRST install a guard so every video element stays muted at volume 0 (a full page load or a
// replaced element otherwise plays audio on Sam's speakers; LESSONS: 28 Nov 2026), then navigate in-app with __go(id).
// Needs the fronted browser tab: a hidden or background tab throttles seeks to almost nothing.
const now = Date.now(); localStorage.setItem("yt-player-volume", JSON.stringify({ data: JSON.stringify({ volume: 0, muted: true }), expiration: now + 2592000000, creation: now }));
const dm = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "muted"), dv = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "volume"), op = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function () { dm.set.call(this, true); dv.set.call(this, 0); return op.apply(this, arguments); };
Object.defineProperty(HTMLMediaElement.prototype, "muted", { get() { return dm.get.call(this); }, set() { dm.set.call(this, true); }, configurable: true });
Object.defineProperty(HTMLMediaElement.prototype, "volume", { get() { return dv.get.call(this); }, set() { dv.set.call(this, 0); }, configurable: true });
window.__fr = {};
window.__go = (id) => document.querySelector("ytd-app").fire("yt-navigate", { endpoint: { commandMetadata: { webCommandMetadata: { url: "/watch?v=" + id, webPageType: "WEB_PAGE_TYPE_WATCH", rootVe: 3832 } }, watchEndpoint: { videoId: id } } });
// __scan2(name, start, end, step, threshold): seek step by step, 32x18 grey diff; a change over threshold is pinned to the frame (1/30 s). Result in __fr[name].cuts.
window.__scan2 = async function (name, s, e, step, thr) {
  step = step || 0.1; thr = thr || 35;
  const v = document.querySelector("video.html5-main-video"); v.pause();
  const c = document.createElement("canvas"); c.width = 32; c.height = 18; const x = c.getContext("2d", { willReadFrequently: true });
  const out = { s, e, step, thr, n: 0, cuts: [], err: null, state: "start", t: s, tmo: 0 }; window.__fr[name] = out;
  const grab = async (t) => { await new Promise((r) => { let d = false; const f = () => { if (!d) { d = true; v.removeEventListener("seeked", f); r(); } }; v.addEventListener("seeked", f); v.currentTime = t; setTimeout(() => { if (!d) out.tmo++; f(); }, 4000); });
    x.drawImage(v, 0, 0, 32, 18); const im = x.getImageData(0, 0, 32, 18).data; const g = new Float32Array(576); for (let i = 0; i < 576; i++) g[i] = 0.3 * im[i * 4] + 0.59 * im[i * 4 + 1] + 0.11 * im[i * 4 + 2]; return g; };
  const df = (a, b) => { let q = 0; for (let i = 0; i < 576; i++) q += Math.abs(a[i] - b[i]); return q / 576; };
  try {
    let prev = await grab(s), pt = s;
    for (let t = s + step; t <= e; t += step) {
      if (window.__abort) throw new Error("abort");
      const g = await grab(t); out.n++; out.t = t; const d = df(prev, g);
      if (d > thr) { let a = prev, found = null; for (let k = 1; k <= Math.round(step * 30); k++) { const tt = pt + k / 30, gg = await grab(tt), dd = df(a, gg); if (dd > thr * 0.6) { found = [tt, dd]; break; } a = gg; }
        out.cuts.push(found ? [Math.round(found[0] * 1000) / 1000, Math.round(found[1] * 10) / 10] : [Math.round(t * 1000) / 1000, Math.round(d * 10) / 10, "c"]); }
      prev = g; pt = t;
    }
    out.state = "done";
  } catch (er) { out.err = String(er); out.state = "err"; }
};
