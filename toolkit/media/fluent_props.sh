#!/bin/bash
# Open-kit props (5 Nov 2026): fetch Microsoft Fluent Emoji (MIT licence, github.com/microsoft/fluentui-emoji) by name
# and recolour each into the series palette. Usage: fluent_props.sh <out_dir> "Hot beverage" "Ship" ...
# Names are the folder names in the repo's assets/ (title case, spaces). Credit line: "Props: Fluent Emoji (Microsoft, MIT)".
# FLUENT_STYLE=Flat (default since 7 Nov 2026, vector world) or Color (old look)
set -e; OUT=$1; shift; mkdir -p "$OUT"; K=${FLUENT_DIR:-/home/claude/kits/fluentui-emoji}
[ -d "$K/.git" ] || git clone -q --depth 1 --filter=blob:none --sparse https://github.com/microsoft/fluentui-emoji.git "$K"
for n in "$@"; do (cd "$K" && git sparse-checkout add "assets/$n/*" >/dev/null 2>&1)
  S=${FLUENT_STYLE:-Flat}; src=$(ls "$K/assets/$n/$S/"*.svg "$K/assets/$n/Default/$S/"*.svg 2>/dev/null | head -1); slug=$(echo "$n" | tr 'A-Z -' 'a-z__')
  [ -n "$src" ] || { echo "no colour svg for $n"; continue; }
  python3 "$(dirname "$0")/recolour_svg.py" "$src" "$OUT/$slug.svg" ${PALETTE:+--palette $PALETTE} >/dev/null && echo "$slug"; done
