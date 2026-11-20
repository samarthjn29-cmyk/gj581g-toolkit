#!/bin/bash
# Colour_v1 chapter 0 (the opening), version 2: renders the three parts on this computer's graphics chip and joins them, silent.
# Run from toolkit/doodle:  bash render_colour_ch0.sh   ->  ~/Desktop/Colour_ch0_v2_silent.mp4   (audio and music are added in the workspace)
set -e
cd "$(dirname "$0")"
export GPU=1
OUT=${1:-$HOME/Desktop/Colour_ch0_v2_silent.mp4}
T=$(mktemp -d)
node render.js cards/colour_ch0_v2.html "" 0 20.2 "$T/p1.mp4"
node render.js cards/colour_patch_d.html "" 20.2 37.6 "$T/p2.mp4"
node render.js cards/colour_ch0_v2.html "" 37.6 107.2 "$T/p3.mp4"
printf "file '%s'\nfile '%s'\nfile '%s'\n" "$T/p1.mp4" "$T/p2.mp4" "$T/p3.mp4" > "$T/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$T/list.txt" -c copy "$OUT"
rm -rf "$T"
echo "done $OUT"
