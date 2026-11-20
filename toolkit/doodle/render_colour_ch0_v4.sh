#!/bin/bash
# Colour_v1 chapter 0 v4 "The eyes" (the new opening, 20 Nov 2026): renders every part on this computer's graphics chip and joins them, silent (107.4 s, 3222 frames).
# Run from toolkit/doodle:  bash render_colour_ch0_v4.sh   ->  ~/Desktop/Colour_ch0v4_silent.mp4 and ..._small.mp4 (attach the small one in the chat)
# Times are clip seconds (Sam's paced 00_opening v2 starts at 0.6 s). Parts: 3D candle-lit eye, 3D view through the eye, the 2D page,
# the patch close-up (D, its own 26.0-31.4 s: laser pulses one cell at a time), the 2D page again.
set -e
cd "$(dirname "$0")"
export GPU=1
OUT=${1:-$HOME/Desktop/Colour_ch0v4_silent.mp4}
T=$(mktemp -d)
C=cards/colour_ch0_v4.html
node render.js cards/colour_ch0v4_3d.html "shot=candle" 0 17.9 "$T/01.mp4"
node render.js cards/colour_ch0v4_3d.html "shot=through" 17.9 26.6 "$T/02.mp4"
node render.js $C "" 26.6 68.4 "$T/03.mp4"
node render.js cards/colour_patch_d.html "" 26.0 31.4 "$T/04.mp4"
node render.js $C "" 73.8 107.4 "$T/05.mp4"
for i in 01 02 03 04 05; do echo "file '$T/$i.mp4'"; done > "$T/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$T/list.txt" -c copy "$OUT"
rm -rf "$T"
# a small copy to attach in the chat (near-lossless renders are 700+ MB; the chat takes 400 MB at most; 16 Mbit/s is about 2 MB a second)
SMALL="${OUT%.mp4}_small.mp4"
ffmpeg -loglevel error -y -i "$OUT" -c:v libx264 -b:v 16M -maxrate 18M -bufsize 32M -preset medium -pix_fmt yuv420p "$SMALL"   # fixed bitrate: the film grain makes quality-based sizes huge
echo "done $OUT"
echo "attach this one: $SMALL ($(du -h "$SMALL" | cut -f1))"
