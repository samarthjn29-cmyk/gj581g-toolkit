#!/bin/bash
# process every raw/*.webm that has no map yet; start time is the number in the name
cd "${1:-/home/claude/jhsound}"
for f in raw/JHsound_*.webm; do n=$(basename $f .webm); [ -f maps/$n.txt ] && continue; s=$(echo $n | sed -E 's/.*_([0-9]+)_2x/\1/'); echo "== $n"; nice -n 19 python3 /home/claude/toolkit/toolkit/study/sound/sound_map.py $f $s 2 > /dev/null 2> logs_$n.err || echo "FAIL $n"; done
echo QDONE
