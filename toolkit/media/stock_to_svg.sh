#!/bin/bash
# Licensed Adobe Stock vector (EPS/.ai) -> SVG in the series palette + a preview PNG (LESSONS 58).
# Usage: stock_to_svg.sh <id> <download_url> <out_dir>
set -e; ID=$1; URL=$2; OUT=$3; mkdir -p "$OUT"; cd "$OUT"
curl -s -L -m 180 -o "AdobeStock_$ID.ai" "$URL"
if head -c 4 "AdobeStock_$ID.ai" | grep -q '%PDF'; then cp "AdobeStock_$ID.ai" "s$ID.pdf"; else gs -q -dNOPAUSE -dBATCH -dEPSCrop -sDEVICE=pdfwrite -sOutputFile="s$ID.pdf" "AdobeStock_$ID.ai"; fi
pdftocairo -svg "s$ID.pdf" "s$ID.svg"
python3 "$(dirname "$0")/recolour_svg.py" "s$ID.svg" "s${ID}_pal.svg" --palette "${PALETTE:-ember}"  # palette per world (7 Nov 2026)
pdftocairo -png -scale-to 1200 -singlefile "s$ID.pdf" "s${ID}_orig"
echo "$ID done: $(du -h s${ID}_pal.svg | cut -f1)"
