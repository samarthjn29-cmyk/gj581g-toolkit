#!/bin/bash
# Colour_v1 chapter 0 (the opening), version 3: renders every part on this computer's graphics chip and joins them, silent.
# Run from toolkit/doodle:  bash render_colour_ch0.sh   ->  ~/Desktop/Colour_ch0_silent.mp4   (audio and music are added in the workspace)
# Parts are in clip time (audio + 0.6 s lead): cards and footage, the 3D eye, the patch close-up (D), the 3D light-vs-laser shot.
set -e
cd "$(dirname "$0")"
export GPU=1
OUT=${1:-$HOME/Desktop/Colour_ch0_silent.mp4}
T=$(mktemp -d)
C=cards/colour_ch0_v2.html
node render.js $C "" 0 11.5 "$T/01.mp4"
node render.js cards/colour_ch0_3d.html "shot=eye" 11.5 14.7 "$T/02.mp4"
node render.js $C "" 14.7 20.2 "$T/03.mp4"
node render.js cards/colour_patch_d.html "" 20.2 37.6 "$T/04.mp4"
node render.js $C "" 37.6 44.0 "$T/05.mp4"
node render.js cards/colour_ch0_3d.html "shot=light" 44.0 48.2 "$T/06.mp4"
node render.js $C "" 48.2 107.2 "$T/07.mp4"
for i in 01 02 03 04 05 06 07; do echo "file '$T/$i.mp4'"; done > "$T/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$T/list.txt" -c copy "$OUT"
rm -rf "$T"
# a small copy to attach in the chat (near-lossless renders are 700+ MB; the chat takes 400 MB at most)
SMALL="${OUT%.mp4}_small.mp4"
ffmpeg -loglevel error -y -i "$OUT" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p "$SMALL"
echo "done $OUT"
echo "attach this one: $SMALL ($(du -h "$SMALL" | cut -f1))"
