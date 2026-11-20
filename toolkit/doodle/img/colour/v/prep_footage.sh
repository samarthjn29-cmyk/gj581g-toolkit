#!/bin/bash
# Cut, grade and encode the opening's footage to VP9 WebM for the canvas page (Playwright Chromium has no H.264).
set -e; O=/home/claude/toolkit/toolkit/doodle/img/colour/v
G="eq=contrast=1.06:saturation=0.9:gamma=0.97,colorbalance=bs=0.025:gm=0.005:rh=0.015"
enc() { ffmpeg -loglevel error -y -ss $2 -i $1 -t $3 -an -vf "$4,$G,fps=30,format=yuv420p" -c:v libvpx-vp9 -b:v 0 -crf 33 -g 10 -deadline good -cpu-used 4 -row-mt 1 $O/$5.webm; }
enc F_eye.mp4 1.3 3.6 "scale=1920:1080:flags=lanczos" eye
enc F_earth_nasa.mp4 0.5 4.6 "scale=1920:1080" earth
enc F_flower.mp4 2.0 4.0 "scale=560:-2,crop=560:900" flower
enc F_screen.mp4 0.3 4.0 "scale=560:-2,crop=560:900" screen
enc F_sky.mp4 3.0 4.0 "scale=-2:900,crop=560:900" sky
enc F_apples.mp4 1.0 8.9 "scale=1920:1080:flags=lanczos" apples
enc F_pixels_rgb.mp4 2.0 5.2 "scale=1920:1080" pixels_rgb
enc F_pixels_cursor.mp4 3.0 6.4 "scale=1920:1080" pixels_cursor
ls -la $O
