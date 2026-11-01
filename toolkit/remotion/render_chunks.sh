#!/bin/bash
# Render sections of the video (video only, resumable; one process per section keeps memory low on the 2-core/8 GB workspace).
# Usage: render_chunks.sh [section numbers...]      e.g. render_chunks.sh 2 5   (default: all sections that are missing)
#        DRAFT=1 render_chunks.sh 3                   720p review draft of section 3 (about twice as fast)
#        FORCE=1 render_chunks.sh 4                   re-render section 4 after an edit to slides 24-29
# Sections are listed in sections.txt. Then: assemble.sh out/final.mp4 (adds grain and the narration track).
cd "$(dirname "$0")"
WANT="$*"; DIR=out/chunks; SCALE=""; [ -n "$DRAFT" ] && { DIR=out/draft_chunks; SCALE="--scale=0.6667"; }
mkdir -p $DIR
grep -v '^#' sections.txt | while read sec slides frames; do
  [ -z "$sec" ] && continue
  [ -n "$WANT" ] && ! [[ " $WANT " == *" $sec "* ]] && continue
  o=$DIR/c_$frames.mp4; [ -s $o ] && [ -z "$FORCE" ] && { echo "skip section $sec"; continue; }
  npx remotion render src/index.jsx Video $o.tmp.mp4 --frames=$frames --muted --props='{"grain":false}' --codec=h264 --crf=17 $SCALE \
    --concurrency=2 --offthreadvideo-cache-size-in-bytes=400000000 --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome \
    > $DIR/log_$frames.txt 2>&1 && mv $o.tmp.mp4 $o && echo "DONE section $sec" || { echo "FAILED section $sec"; exit 1; }
done
echo ALLDONE
