#!/usr/bin/env python3
"""Mix the music bed under a rendered act (Gate 3). The act's own audio (voice, sounds, sting) stays as rendered;
the bed is levelled to --lufs, sidechain-ducked under the narration, dipped where asked, faded at the act's ends,
then the whole mix is levelled to -16 LUFS (two-pass loudnorm, TP -1.5).
usage: mix-act-bed.py ACT.mp4 VOICE.wav OUT.mp4 --bed BED.mp3 [--voice-at 0.8] [--bed-from 0] [--lufs -33]
       [--dip A:B,...] [--fade-in 2] [--fade-out 3] [--pocket [LO:HI]] [--bed-only OUT.wav]
--bed-from: seconds into the track where this act starts (the bed carries on across acts).
--pocket: a frequency pocket instead of ducking the whole bed (22 Nov 2026, from the study of Chris Moran's "The VOX
  Sound Design System", analysis only: Audition's "make room for vocals" carves the voice's band out of the music and
  ducks only that band, so the music stays full). The bed is split at LO and HI Hz (default 300:4000, Linkwitz-Riley,
  sums flat); only the middle band is sidechain-ducked under the narration (ratio 4); the lows and highs carry on.
--bed-only: also write the processed bed alone (for measuring the pocket).
--break A:B,...  MUS-010 BreakAndImpact (studied ilkin's collage ad, 22 Nov 2026; analysis only): the whole bed drops
  to near-silence (-30 dB) from A to B (0.3-0.6 s, in a pause, never over words), 40 ms ramps inside the range; the
  impact (SFX-025) is a cue in the act file at B.
--sweep T[:DUR],...  MUS-011 BedFilterSweep (same study): at a transition the bed's lows (< 300 Hz) drop out by 24 dB
  for DUR s (default 0.4) from T-0.15 (60 ms down, 150 ms back up), so the wipe is heard as a breath; the voice is
  never filtered (only the bed is touched)."""
import sys, json, subprocess, argparse
ap = argparse.ArgumentParser()
ap.add_argument("act"); ap.add_argument("voice"); ap.add_argument("out")
ap.add_argument("--bed", required=True); ap.add_argument("--voice-at", type=float, default=0.8)
ap.add_argument("--bed-from", type=float, default=0); ap.add_argument("--lufs", type=float, default=-33)
ap.add_argument("--dip", default=""); ap.add_argument("--fade-in", type=float, default=2); ap.add_argument("--fade-out", type=float, default=3)
ap.add_argument("--pocket", nargs="?", const="300:4000", default="300:4000"); ap.add_argument("--no-pocket", action="store_true"); ap.add_argument("--bed-only", default=None)
ap.add_argument("--break", dest="brk", default=""); ap.add_argument("--sweep", default="")
ap.add_argument("--threshold", type=float, default=None)  # sidechain threshold (default 0.03 pocket / 0.05 full); lower = deeper duck (demo only)
ap.add_argument("--ratio", type=float, default=None)  # duck ratio (default 4 with --pocket, 2 without); a big ratio exaggerates the effect for a demo
a = ap.parse_args()
if a.no_pocket:
    a.pocket = None  # the pocket is the default (Sam, 22 Nov 2026: "Use the music pocket"); --no-pocket ducks the whole bed
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.act], capture_output=True, text=True).stdout)
def lufs(args):
    o = subprocess.run(["ffmpeg", "-nostats", *args, "-af", "loudnorm=print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    return json.loads(o[o.rindex("{"):o.rindex("}") + 1])
L = float(lufs(["-ss", str(a.bed_from), "-t", str(dur), "-i", a.bed])["input_i"])
gain = a.lufs - L
dips = [tuple(map(float, d.split(":"))) for d in a.dip.split(",") if d]
# Dips: down 12 dB with 0.3 s ramps.
vol = "1"
for s, e in dips:
    vol = f"({vol})*(1-0.75*min(1,max(0,min((t-{s-0.3})/0.3,({e+0.3}-t)/0.3))))"
breaks = [tuple(map(float, d.split(":"))) for d in a.brk.split(",") if d]
for s_, e_ in breaks:  # near-silence inside [s_, e_]: gain 1 -> 0.0316 (-30 dB) with 40 ms ramps
    vol = f"({vol})*(1-0.9684*min(1,max(0,min((t-{s_})/0.04,({e_}-t)/0.04))))"
sweeps = []
for d in a.sweep.split(","):
    if d:
        q = d.split(":")
        sweeps.append((float(q[0]), float(q[1]) if len(q) > 1 else 0.4))
lowvol = "1"
for T, D in sweeps:  # lows -24 dB (0.063) from T-0.15 for D s: 60 ms down, 150 ms up
    s0, s1 = T - 0.15, T - 0.15 + D
    lowvol = f"({lowvol})*(1-0.937*min(1,max(0,min((t-{s0})/0.06,({s1 + 0.15}-t)/0.15))))"
vd = int(a.voice_at * 1000)
fc = (
    f"[1:a]atrim={a.bed_from}:{a.bed_from+dur},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume={gain:.2f}dB,"
    f"volume='{vol}':eval=frame,afade=t=in:d={a.fade_in},afade=t=out:st={dur-a.fade_out:.2f}:d={a.fade_out}[bed0];"
    + (f"[bed0]acrossover=split=300:order=4th[swl][swh];[swl]volume='{lowvol}':eval=frame[swl2];[swl2][swh]amix=inputs=2:normalize=0[bed];"
       if sweeps else "[bed0]anull[bed];")
    + f"[2:a]adelay={vd}|{vd},aresample=48000,aformat=channel_layouts=stereo,apad[key];"
    + (
        (lambda lo, hi: f"[bed]acrossover=split={lo} {hi}:order=4th[blo][bmid][bhi];"
         f"[bmid][key]sidechaincompress=threshold={a.threshold or 0.03}:ratio={a.ratio or 4}:attack=60:release=900[bmidd];"
         f"[blo][bmidd][bhi]amix=inputs=3:normalize=0[duck0];")(*a.pocket.split(":"))
        if a.pocket else
        f"[bed][key]sidechaincompress=threshold={a.threshold or 0.05}:ratio={a.ratio or 2}:attack=80:release=1100[duck0];"
    )
    + (f"[duck0]asplit=2[duck][bedonly];" if a.bed_only else f"[duck0]anull[duck];")
    + f"[0:a]aresample=48000,aformat=channel_layouts=stereo[act];"
    f"[act][duck]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.89[mix]"
)
tmp = a.out.replace(".mp4", "_premix.mp4")
extra = ["-map", "[bedonly]", "-c:a", "pcm_s16le", a.bed_only] if a.bed_only else []
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.act, "-i", a.bed, "-i", a.voice, "-filter_complex", fc, "-map", "0:v", "-map", "[mix]", "-c:v", "copy", "-c:a", "pcm_s16le", tmp.replace(".mp4", ".mov"), *extra], check=True)
m = lufs(["-i", tmp.replace(".mp4", ".mov")])
# Linear level (independent review, 22 Nov 2026: loudnorm fell back to dynamic mode and rode the voice up
# 2 dB across the act, against "Sam's audio is final"): one fixed gain to -16 LUFS, then only a peak limiter.
gain_all = -16.0 - float(m["input_i"])
af = f"volume={gain_all:.2f}dB,alimiter=limit={10 ** (-2.0 / 20):.4f}:attack=1:release=60:level=false,aresample=48000"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp.replace(".mp4", ".mov"), "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "256k", a.out], check=True)
subprocess.run(["rm", "-f", tmp.replace(".mp4", ".mov")])
f = lufs(["-i", a.out])
print(f"bed {L:.1f} LUFS -> {a.lufs} (gain {gain:+.1f} dB), {'pocket ' + a.pocket if a.pocket else 'full-band duck'}, dips {dips}, breaks {breaks}, sweeps {sweeps}; final {f['input_i']} LUFS, TP {f['input_tp']}")
