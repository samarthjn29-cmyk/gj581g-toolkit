#!/bin/bash
# assemble.sh out.mp4 [chunk files...]: join video chunks, add a fine film grain (idea 10), mux the narration.
# With chunks given, the narration is trimmed to their total length starting at 0 (for section drafts).
cd "$(dirname "$0")"; OUT=$1; shift
FILES=${@:-$(ls out/chunks/c_*.mp4 | sort -t_ -k2 -n)}
: > out/concat.txt; for f in $FILES; do echo "file '$PWD/$f'" >> out/concat.txt; done
ffmpeg -y -v error -f concat -safe 0 -i out/concat.txt -i out/narration.wav -map 0:v -map 1:a \
  -vf "noise=c0s=5:c0f=t+u" -c:v libx264 -preset slow -crf 19 -profile:v high -level 4.1 -pix_fmt yuv420p -g 60 -bf 2 \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$OUT" && ffprobe -v error -show_entries format=duration,size -of csv=p=0 "$OUT"
