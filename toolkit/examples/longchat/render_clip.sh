#!/bin/bash
# render_clip.sh FIRST LAST NAME: data + music mix for scenes FIRST..LAST, render, grain + audio, laptop copy, stage in outputs
set -e; cd /home/claude/LongChat_v1
python3 /home/claude/gj581g-toolkit/toolkit/story/cue_lint.py LongChat_remotion/src/scenes_custom.jsx story/slides.json && python3 /home/claude/gj581g-toolkit/toolkit/story/scene_lint.py LongChat_remotion/src/scenes_custom.jsx | grep -q "clean" || { echo "LINT FAILED"; exit 1; }
python3 tts_tools/lc_data.py $1 $2
cd LongChat_remotion && rm -f out/chunks/*.mp4
npx remotion render src/index.jsx Video out/chunks/c_0.mp4 --props='{"grain":false}' --muted --concurrency=2 --offthreadvideo-cache-size-in-bytes=400000000 --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome --log=error > out/render.log 2>&1
bash assemble.sh out/LongChat_$3.mp4 out/chunks/c_0.mp4
ffmpeg -v error -y -i out/LongChat_$3.mp4 -c:v libx264 -preset veryfast -crf 24 -c:a copy out/LongChat_$3_lap.mp4
cp out/LongChat_$3.mp4 out/LongChat_$3_lap.mp4 /mnt/user-data/outputs/
echo "DONE $3"
