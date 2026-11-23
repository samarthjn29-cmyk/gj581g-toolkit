// Silent audio + frame capture of YouTube passages for a private sound study (Johnny Harris sound study, 23 Nov 2026).
// Paste into the built-in browser with javascript_tool, in this order, on ANY youtube.com page (the channel's videos
// tab is best): 1) SETUP (once per tab), 2) navigate in-app with __go(id) (never a full page load: a new page makes a
// new <video> that is NOT routed, and its audio would play on Sam's speakers), 3) __cap(name, [[start,end],...]).
// Downloads land in Sam's Downloads as JHsound_<name>_<start>_2x.webm (opus, recorded at 2x with pitch NOT preserved:
// slow it back with ffmpeg asetrate=24000) and JHsound_<name>_<start>_frames.jpg (a frame every 2 s of video time).
// Ads: __cap waits while one plays (also detected by a changed duration); a skippable ad needs a real click on its
// Skip button (find "Skip" -> computer left_click); programmatic clicks are ignored. Long unskippable mid-rolls at a
// break: split the passage around the break.

// 1) SETUP: route the page's single video element into a recorder only (no connection to the speakers).
window.__vel = document.querySelector("video.html5-main-video");
window.__ac = new AudioContext({ sampleRate: 48000 });
window.__src = __ac.createMediaElementSource(__vel);
window.__dest = __ac.createMediaStreamDestination();
__src.connect(__dest); // never __src.connect(__ac.destination)
await __ac.resume();
window.__status = {};
window.__go = (id) => document.querySelector("ytd-app").fire("yt-navigate", { endpoint: { commandMetadata: { webCommandMetadata: { url: "/watch?v=" + id, webPageType: "WEB_PAGE_TYPE_WATCH", rootVe: 3832 } }, watchEndpoint: { videoId: id } } });
window.__chap = () => [...new Set([...document.querySelectorAll("ytd-macro-markers-list-item-renderer")].map((e) => e.innerText.replace(/\s+/g, " ").trim()))];
window.__wait = async (n) => { for (let i = 0; i < 40 && !/AD/.test(__status[n].state) && !__status[n].finished; i++) await new Promise((r) => setTimeout(r, 1000)); const s = __status[n]; return [s.state, s.done.length, s.err, s.finished || false]; };

// 3) CAPTURE: after __go(id), wait ~5 s, check document.querySelector("video.html5-main-video") === __vel (same element,
// still routed), then __cap("name", [[0,150],[chapterStart-10, chapterStart+45], ..., [end-90, end]]); poll __wait(name).
window.__cap = async (name, segs, rate = 2) => {
  const P = document.querySelector("#movie_player");
  const MD = __vel.duration;
  const ad = () => P.classList.contains("ad-showing") || Math.abs(__vel.duration - MD) > 1;
  const st = (__status[name] = { done: [], err: null, state: "start", queue: segs.slice() });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const dl = (blob, fn) => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fn; document.body.appendChild(a); a.click(); a.remove(); };
  try {
    while (st.queue.length) {
      const [s, e] = st.queue[0];
      while (ad()) { st.state = "AD"; __vel.play(); await sleep(1000); }
      st.state = "seek " + s; P.seekTo(s, true); P.playVideo(); await sleep(1500);
      while (ad()) { st.state = "AD"; await sleep(1000); }
      P.pauseVideo();
      const v = document.querySelector("video.html5-main-video");
      if (v !== __vel) { st.err = "element changed: STOP, the audio is no longer routed"; break; }
      v.currentTime = s; await sleep(800);
      const n = Math.ceil((e - s) / 2) + 1, cols = 10, W = 192, H = 108;
      const cv = document.createElement("canvas"); cv.width = cols * W; cv.height = Math.ceil(n / cols) * H;
      const cx = cv.getContext("2d"); cx.font = "bold 16px sans-serif"; let k = 0, nextT = s;
      v.preservesPitch = false; v.playbackRate = rate; v.muted = false; // muted would silence the recording too
      const rec = new MediaRecorder(__dest.stream, { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 256000 });
      const ch = []; rec.ondataavailable = (ev) => ch.push(ev.data);
      const t0 = v.currentTime, w0 = performance.now(); rec.start(1000); await v.play(); st.state = "rec " + s; let bad = false;
      while (v.currentTime < e && !v.ended) {
        if (ad()) { bad = true; break; }
        if (v.muted) v.muted = false; if (v.playbackRate !== rate) v.playbackRate = rate;
        if (v.currentTime >= nextT && k < n) { try { cx.drawImage(v, (k % cols) * W, Math.floor(k / cols) * H, W, H); cx.fillStyle = "#ff0"; cx.fillText(Math.round(v.currentTime), (k % cols) * W + 4, Math.floor(k / cols) * H + 18); } catch (x) {} k++; nextT += 2; }
        await sleep(100);
      }
      v.pause(); const t1 = v.currentTime, wall = (performance.now() - w0) / 1000; rec.stop(); await new Promise((r) => (rec.onstop = r));
      if (bad) { st.state = "AD (retry " + s + ")"; continue; }
      if (wall > ((t1 - t0) / rate) * 1.3 + 1.5) { st.slow = (st.slow || 0) + 1; st.state = "slow (retry " + s + ")"; if (st.slow < 3) continue; }
      dl(new Blob(ch, { type: "audio/webm" }), `JHsound_${name}_${Math.round(s)}_${rate}x.webm`);
      dl(await new Promise((r) => cv.toBlob(r, "image/jpeg", 0.8)), `JHsound_${name}_${Math.round(s)}_frames.jpg`);
      st.done.push([s, +t0.toFixed(2), +t1.toFixed(2), +wall.toFixed(1)]); st.queue.shift();
    }
  } catch (x) { st.err = String(x); }
  st.finished = true; st.state = "done"; __vel.playbackRate = 1;
};
