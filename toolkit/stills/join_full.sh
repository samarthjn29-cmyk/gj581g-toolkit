#!/usr/bin/env bash
# Join finished chapter clips into the full video (stills format), the Zeigarnik way (11 Nov 2026):
#   1. concat FILTER (re-encode together; never -f concat across differently encoded files), PCM audio in between
#   2. two-pass linear loudnorm of the whole mix to -16 LUFS, TP -1.5 (video stream copied)
#   3. a 720p review copy and a 1080p delivery copy at CRF 21: SendUserFile refuses files over 500 MiB
#      (the CRF 18 master of a 12.5-min video was 580 MB; CRF 21 was 350 MB), and the master stays in the workspace
#   4. prints integrated loudness, LRA and true peak; refuses (exit 1) a result under -17 LUFS
# Usage: join_full.sh OUT_PREFIX clip1.mp4 clip2.mp4 ...   -> OUT_PREFIX.mp4, OUT_PREFIX_720.mp4, OUT_PREFIX_1080p.mp4
# Run alone (no render, voice model or whisper at the same time); about 15 min for 12 min of 1080p on this box.
set -euo pipefail
OUT=$1; shift
I=(); F=""; n=0
for c in "$@"; do I+=(-i "$c"); F="$F[$n:v][$n:a]"; n=$((n+1)); done
ffmpeg -v error -y "${I[@]}" -filter_complex "${F}concat=n=$n:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
  -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a pcm_s16le "${OUT}_pre.mkv"
J=$(ffmpeg -hide_banner -i "${OUT}_pre.mkv" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "${OUT}_pre.mkv" -c:v copy \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 192k -movflags +faststart "${OUT}.mp4"
rm -f "${OUT}_pre.mkv"
ffmpeg -v error -y -i "${OUT}.mp4" -vf scale=1280:720 -c:v libx264 -preset veryfast -crf 26 -c:a copy -movflags +faststart "${OUT}_720.mp4"
ffmpeg -v error -y -i "${OUT}.mp4" -c:v libx264 -preset veryfast -crf 21 -pix_fmt yuv420p -c:a copy -movflags +faststart "${OUT}_1080p.mp4"
M=$(ffmpeg -hide_banner -i "${OUT}.mp4" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p')
echo "$M" | grep -E "I:|LRA:|Peak:"
ls -la "${OUT}.mp4" "${OUT}_720.mp4" "${OUT}_1080p.mp4"
I_=$(echo "$M" | awk '/ I:/{print $2; exit}')
python3 -c "import sys; sys.exit(0 if float('$I_') >= -17 else 1)" || { echo "FAIL: integrated $I_ LUFS is under -17"; exit 1; }
