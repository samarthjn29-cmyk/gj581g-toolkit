#!/bin/bash
# clean_own_voice.sh IN.wav TIMING.json OUT.wav — Sam's own recordings (8 Nov 2026):
# declick (ffmpeg adeclick) -> DeepFilterNet3 noise removal (model in /home/claude/models/dfn3; fetch with a sparse git clone of
# Rikorose/DeepFilterNet models/, raw downloads are blocked) -> mouth_clicks.py in pauses -> 70 Hz high-pass, gentle compression,
# light de-ess, loudnorm -16 LUFS. Compression goes AFTER the noise removal (before it, it raised the room noise by 7 dB).
set -e; in=$1; tj=$2; out=$3; d=$(mktemp -d)
ffmpeg -v error -y -i "$in" -ac 1 -ar 48000 -af "adeclick=w=40:o=75:a=2:t=3:b=2" $d/dc.wav
/home/claude/cbenv/bin/deepFilter -m /home/claude/models/dfn3/DeepFilterNet3 $d/dc.wav -o $d 2>/dev/null >/dev/null
python3 "$(dirname "$0")/mouth_clicks.py" $d/dc_DeepFilterNet3.wav "$tj" $d/nc.wav
ffmpeg -v error -y -i $d/nc.wav -af "highpass=f=70,acompressor=threshold=-22dB:ratio=2.2:attack=10:release=150:makeup=1.5,deesser=i=0.3,loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 "$out"
rm -rf $d; echo "clean: $out"
