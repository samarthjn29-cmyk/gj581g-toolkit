#!/bin/bash
# 1080p master of one chapter: build --final, mix on the 1080 render, CRF 20 delivery chapter. Usage: run_final.sh <scene> <name>
# Run from the project folder with PROJ/PREFIX/PUB set like build_chapter.sh. 1080p takes ~7.5 min per 2-min chapter: keep <= 5 chapters per background run (2 h cap), then join with CRF=20 python3 stills/join_breath.py ... OUT (true peak must read <= -1 dBTP; ebur128=peak=true).
PROJ=${PROJ:-$PWD}; PREFIX=${PREFIX:-AL_}; PUB=${PUB:-aliens}; cd $PROJ; s=$1; n=$2; rm -rf /tmp/remotion-webpack-bundle-* /tmp/react-motion-render*
PROJ=$PROJ PREFIX=$PREFIX PUB=$PUB bash /home/claude/toolkit/toolkit/stills/build_chapter.sh $s --final > logs_final_$s.txt 2>&1 || { echo "BUILD FAIL $s"; exit 1; }
rm -f clips/${PREFIX}${s}_720.mp4
sed -e "s|clips/${PREFIX}${s}_720.mp4|clips/${PREFIX}${s}.mp4|" -e "s|clips/${PREFIX}${s}_720_mix.mp4|clips/${PREFIX}${s}_1080_mix.mp4|" mix_$s.sh > /tmp/mixf_$s.sh && bash /tmp/mixf_$s.sh >> logs_final_$s.txt 2>&1 || { echo "MIX FAIL $s"; exit 1; }
rm -f clips/${PREFIX}${s}.mp4
ffmpeg -nostdin -v error -y -i clips/${PREFIX}${s}_1080_mix.mp4 -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 192k clips/$n.mp4 && rm -f clips/${PREFIX}${s}_1080_mix.mp4
rm -rf /tmp/react-motion-render* /tmp/remotion-webpack-bundle-*; ls -la clips/$n.mp4; df -h / | tail -1
