#!/bin/bash
# cut_samp.sh TAG "LABEL"  -> out/samp/TAG.mp4 (71.8-131.3, level-matched to -16.36 LUFS, label burnt in top-left)
set -e; cd /home/claude/bedtest/out
T=$1; L=$2; S=71.8; D=59.5
ffmpeg -v error -y -ss $S -t $D -i ${T}_full.mp4 -vn -ac 2 -ar 48000 samp/${T}_raw.wav
I=$(ffmpeg -hide_banner -i samp/${T}_raw.wav -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | grep -oP 'I:\s+\K-?[0-9.]+')
G=$(python3 -c "print(round(-16.36-($I),2))")
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
ffmpeg -v error -y -ss $S -t $D -i act2_stand_in.mov -i samp/${T}_raw.wav -map 0:v -map 1:a \
  -vf "drawbox=x=0:y=0:w=iw:h=44:color=black@0.6:t=fill,drawtext=fontfile=$FONT:text='$L':x=16:y=12:fontsize=22:fontcolor=white" \
  -af "volume=${G}dB,alimiter=limit=0.84:attack=1:release=50:level=false,afade=t=in:d=0.3,afade=t=out:st=$(python3 -c "print($D-0.6)"):d=0.6" \
  -c:v libx264 -crf 27 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 160k samp/${T}.mp4
echo "$T in $I gain $G"
