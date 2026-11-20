#!/bin/bash
# Colour_v1 chapter 1 "The geranium" v1: renders every part on this computer's graphics chip and joins them, silent (93.5 s, 2805 frames).
# Run from toolkit/doodle:  bash render_colour_ch1.sh   ->  ~/Desktop/Colour_ch1_silent.mp4   (voice and bed are added in the workspace)
# Times are clip seconds (Sam's 01_jar voice starts at 0.6 s). The 3D page uses shot-local time, so its parts start at 0.
set -e
cd "$(dirname "$0")"
export GPU=1
OUT=${1:-$HOME/Desktop/Colour_ch1_silent.mp4}
T=$(mktemp -d)
C=cards/colour_ch1.html
node render.js $C "" 0 62.6 "$T/01.mp4"
node render.js cards/colour_ch1_3d.html "shot=filter" 0 10.0 "$T/02.mp4"
node render.js $C "" 72.6 79.0 "$T/03.mp4"
node render.js cards/colour_ch1_3d.html "shot=opened" 0 8.5 "$T/04.mp4"
node render.js $C "" 87.5 93.5 "$T/05.mp4"
for i in 01 02 03 04 05; do echo "file '$T/$i.mp4'"; done > "$T/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$T/list.txt" -c copy "$OUT"
rm -rf "$T"
echo "done $OUT"
