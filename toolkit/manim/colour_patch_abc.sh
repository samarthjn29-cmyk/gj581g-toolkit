#!/bin/bash
# Three-way comparison of the ch0 patch close-up (clip 20.2-37.6 s): A canvas, B Manim, C Three.js, on Sam's audio.
set -e
cd /home/claude/colour/manim
CLIP=/home/claude/colour/clips/Colour_ch0_opening_v1.mp4
B=media/videos/patch_shot/1080p30/patch_manim.mp4
C=Colour_patch_C_three_silent.mp4
F=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf
lab() { echo "drawtext=fontfile=$F:text='$1':x=24:y=20:fontsize=26:fontcolor=0xEFE6D2:box=1:boxcolor=0x070B17CC:boxborderw=10"; }
ffmpeg -loglevel error -y -ss 20.2 -t 17.4 -i $CLIP -i $B -i $C -filter_complex "
[0:v]scale=960:540,setsar=1,$(lab 'A  canvas (current)')[a];
[1:v]scale=960:540,setsar=1,$(lab 'B  Manim')[b];
[2:v]scale=960:540,setsar=1,$(lab 'C  Three.js  glow + depth of field + grain')[c];
color=c=0x070B17:s=960x540:d=17.4,drawtext=fontfile=$F:text='Same 17 s, same audio':x=(w-tw)/2:y=230:fontsize=30:fontcolor=0xEFE6D2,drawtext=fontfile=$F:text='Colour_v1 ch0  patch close-up':x=(w-tw)/2:y=285:fontsize=24:fontcolor=0x7F8AA6[d];
[a][b]hstack[t];[c][d]hstack[u];[t][u]vstack,format=yuv420p[v]" \
 -map "[v]" -map 0:a -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 160k -t 17.4 Colour_patch_A_B_C.mp4
ffmpeg -loglevel error -y -i $C -ss 20.2 -t 17.4 -i $CLIP -map 0:v -map 1:a -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 160k -t 17.4 Colour_patch_C_three_fullscreen.mp4
ls -la Colour_patch_A_B_C.mp4 Colour_patch_C_three_fullscreen.mp4
