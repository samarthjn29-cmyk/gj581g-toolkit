#!/usr/bin/env python3
"""Mix the music bed under a rendered act (Gate 3). The act's own audio (voice, sounds, sting) stays as rendered;
the bed is levelled to --lufs, sidechain-ducked under the narration, dipped where asked, faded at the act's ends,
then the whole mix is levelled to -16 LUFS (two-pass loudnorm, TP -1.5).
usage: mix-act-bed.py ACT.mp4 VOICE.wav OUT.mp4 --bed BED.mp3 [--voice-at 0.8] [--bed-from 0] [--lufs -33]
       [--dip A:B,...] [--fade-in 2] [--fade-out 3]
--bed-from: seconds into the track where this act starts (the bed carries on across acts)."""
import sys, json, subprocess, argparse
ap = argparse.ArgumentParser()
ap.add_argument("act"); ap.add_argument("voice"); ap.add_argument("out")
ap.add_argument("--bed", required=True); ap.add_argument("--voice-at", type=float, default=0.8)
ap.add_argument("--bed-from", type=float, default=0); ap.add_argument("--lufs", type=float, default=-33)
ap.add_argument("--dip", default=""); ap.add_argument("--fade-in", type=float, default=2); ap.add_argument("--fade-out", type=float, default=3)
a = ap.parse_args()
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
vd = int(a.voice_at * 1000)
fc = (
    f"[1:a]atrim={a.bed_from}:{a.bed_from+dur},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume={gain:.2f}dB,"
    f"volume='{vol}':eval=frame,afade=t=in:d={a.fade_in},afade=t=out:st={dur-a.fade_out:.2f}:d={a.fade_out}[bed];"
    f"[2:a]adelay={vd}|{vd},aresample=48000,aformat=channel_layouts=stereo,apad[key];"
    f"[bed][key]sidechaincompress=threshold=0.05:ratio=3:attack=20:release=400[duck];"
    f"[0:a]aresample=48000,aformat=channel_layouts=stereo[act];"
    f"[act][duck]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.89[mix]"
)
tmp = a.out.replace(".mp4", "_premix.mp4")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.act, "-i", a.bed, "-i", a.voice, "-filter_complex", fc, "-map", "0:v", "-map", "[mix]", "-c:v", "copy", "-c:a", "pcm_s16le", tmp.replace(".mp4", ".mov")], check=True)
m = lufs(["-i", tmp.replace(".mp4", ".mov")])
ln = f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp.replace(".mp4", ".mov"), "-c:v", "copy", "-af", ln + ",aresample=48000", "-c:a", "aac", "-b:a", "256k", a.out], check=True)
subprocess.run(["rm", "-f", tmp.replace(".mp4", ".mov")])
f = lufs(["-i", a.out])
print(f"bed {L:.1f} LUFS -> {a.lufs} (gain {gain:+.1f} dB), dips {dips}; final {f['input_i']} LUFS, TP {f['input_tp']}")
