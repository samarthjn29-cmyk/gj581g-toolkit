#!/usr/bin/env python3
"""Re-render only the shots that changed (Sam, 24 Nov 2026: workflow idea 2, "Do 1,2,3 and 6").
Compares the new act file with the act file of the previous render, renders just the changed span with Remotion
(one render at a time, --concurrency=1), keeps the previous render's frames before and after it, joins the parts
(each re-encoded the same way, then the concat demuxer: one ffmpeg graph with a double trim got OOM-killed on 23 Nov),
and lays the act's raw sound under it from scripts/act-audio.py (no audio render). Writes OUT_RAW and its act file
OUT_RAW.act.json, so the next change can diff against it. mix-act-bed.py then adds the bed as usual.

usage: render-changed.py NEW_ACT.json PREV_RENDER.mp4 OUT_RAW.mp4 [--prev-act PREV.act.json] [--full] [--dry]
  PREV_RENDER: the previous 1080p render (the mixed master is fine: only its picture is used)
  --prev-act:  the act file PREV_RENDER was made from (default PREV_RENDER.act.json)
  --full:      render the whole act (also chosen automatically when a whole-act setting changed)
What counts as a change: any beat whose entry differs (props, overlay, transition, ground, times), and the shot after
it (its transition may hold the changed shot: freeze, cut on action, morph, focus match). A change to the act's length
or number of shots renders from the first change to the end. Theme, finish, motion blur or running head: full render.
Sound cues and the voice never need a picture render."""
import json, os, shutil, subprocess, sys, tempfile
import numpy as np

FPS = 30
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(HERE)
a = sys.argv[1:]
flag = lambda f: (a.remove(f), True)[1] if f in a else False
full, dry = flag("--full"), flag("--dry")
prev_act_path = None
if "--prev-act" in a:
    i = a.index("--prev-act")
    prev_act_path = a[i + 1]
    del a[i:i + 2]
new_path, prev_mp4, out = a
prev_act_path = prev_act_path or prev_mp4 + ".act.json"
new = json.load(open(new_path))
F = lambda s: round(s * FPS)
total = F(max(b["end"] for b in new["beats"]))

prev_total = F(max(b["end"] for b in json.load(open(prev_act_path))["beats"])) if os.path.exists(prev_act_path) else None
GLOBAL = ("themeId", "finish", "motionBlur", "runningHead", "episodeId")
span = None  # (first frame, last frame) to render, inclusive
if full or not os.path.exists(prev_act_path):
    if not full:
        print(f"no act file for the previous render ({prev_act_path}): full render")
    span = (0, total - 1)
else:
    old = json.load(open(prev_act_path))
    if any(old.get(k) != new.get(k) for k in GLOBAL):
        print("a whole-act setting changed: full render")
        span = (0, total - 1)
    else:
        ob, nb = old["beats"], new["beats"]
        first = next((i for i in range(min(len(ob), len(nb))) if ob[i] != nb[i]), None)
        same_len = len(ob) == len(nb) and abs(ob[-1]["end"] - nb[-1]["end"]) < 1e-6
        if first is None and same_len:
            print("no picture change (sound only): the previous picture is kept")
            span = None
        elif first is None or not same_len:
            first = first if first is not None else min(len(ob), len(nb)) - 1
            span = (F(nb[first]["start"]), total - 1)
        else:
            last = max(i for i in range(len(nb)) if ob[i] != nb[i])
            last = min(last + 1, len(nb) - 1)  # the next shot's transition may hold the changed one
            span = (F(nb[first]["start"]), F(nb[last]["end"]) - 1)
        if span:
            ids = [b["id"] for b in nb if F(b["end"]) > span[0] and F(b["start"]) <= span[1]]
            print(f"changed span {span[0] / FPS:.2f}-{(span[1] + 1) / FPS:.2f} s (frames {span[0]}-{span[1]} of {total}): shots {', '.join(ids)}")

if dry:
    sys.exit(0)

tmp = tempfile.mkdtemp(prefix="rchg_", dir=os.path.join(LIB, "out"))
enc = ["-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", "-r", str(FPS)]
parts = []


def run(cmd):
    subprocess.run(cmd, check=True, cwd=LIB)


if span:
    s0, s1 = span
    # one extra frame each side, where the previous render exists, to check that nothing outside the span changed
    r0, r1 = max(0, s0 - 1), min(total - 1, s1 + 1)
    seg = os.path.join(tmp, "seg.mp4")
    run(["npx", "remotion", "render", "Episode", seg, f"--props={new_path}", "--concurrency=1", "--gl=swangle", f"--frames={r0}-{r1}", "--log=error"])

    def frame(path, t):
        raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.4f}", "-i", path, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                             capture_output=True, check=True).stdout
        return np.frombuffer(raw, np.uint8).astype(float)

    def nth(path, k):  # frame k by index (a seek to a file's last frame can return nothing)
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"select=eq(n\\,{k})", "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                             capture_output=True, check=True).stdout
        return np.frombuffer(raw, np.uint8).astype(float)

    half = 0.5 / FPS
    if r0 < s0:
        d = np.abs(nth(seg, 0) - frame(prev_mp4, r0 / FPS + half)).mean()
        print(f"seam before: frame {r0} differs from the previous render by {d:.2f} (codec noise is about 1-2)")
    if r1 > s1 and prev_total == total:
        d = np.abs(nth(seg, r1 - r0) - frame(prev_mp4, r1 / FPS + half)).mean()
        print(f"seam after: frame {r1} differs from the previous render by {d:.2f}")
    if s0 > 0:
        p = os.path.join(tmp, "p0.mp4")
        run(["ffmpeg", "-v", "error", "-y", "-i", prev_mp4, "-frames:v", str(s0)] + enc + [p])
        parts.append(p)
    p = os.path.join(tmp, "p1.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-i", seg, "-vf", f"trim=start_frame={s0 - r0}:end_frame={s0 - r0 + s1 - s0 + 1},setpts=PTS-STARTPTS"] + enc + [p])
    parts.append(p)
    if s1 < total - 1:
        p = os.path.join(tmp, "p2.mp4")
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{(s1 + 1) / FPS:.4f}", "-i", prev_mp4, "-frames:v", str(total - 1 - s1)] + enc + [p])
        parts.append(p)
else:
    p = os.path.join(tmp, "p0.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-i", prev_mp4, "-frames:v", str(total)] + enc + [p])
    parts.append(p)

lst = os.path.join(tmp, "parts.txt")
open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
wav = os.path.join(tmp, "audio.wav")
run(["python3", os.path.join(HERE, "act-audio.py"), new_path, wav])
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", out])
n = int(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", out],
                       capture_output=True, text=True, cwd=LIB).stdout.strip())
if n != total:
    raise SystemExit(f"FAIL: {out} has {n} frames, the act has {total}")
shutil.copy(new_path, out + ".act.json")
shutil.rmtree(tmp)
print(f"{out}: {n} frames ({n / FPS:.2f} s), act file kept as {out}.act.json")
