#!/usr/bin/env bash
# Motion preview: render the two matte decks, recover each slide's graphics layer, overlay it on the playing clips,
# concatenate with the narration. Takes 10+ minutes for a 25-slide deck: run it in the background.
# Usage: media/preview.sh <deck_dir> <narration.mp3> <out.mp4>
#   <deck_dir> must hold matte_black.pptx, matte_white.pptx, timing.json, media_slots.json (deck/build.sh ... --preview-mattes)
set -eo pipefail
TK="$(cd "$(dirname "$0")/.." && pwd)"; D="$(realpath "$1")"; AUD="$(realpath "$2")"; OUT="$(realpath -m "$3")"
rm -rf "$D/rb" "$D/rw" "$D/pv"; mkdir -p "$D/rb" "$D/rw"
soffice --headless --convert-to pdf "$D/matte_black.pptx" --outdir "$D/rb" >/dev/null 2>&1
soffice --headless --convert-to pdf "$D/matte_white.pptx" --outdir "$D/rw" >/dev/null 2>&1
pdftoppm -scale-to-x 1920 -scale-to-y 1080 -png "$D/rb/matte_black.pdf" "$D/rb/s" 2>/dev/null
pdftoppm -scale-to-x 1920 -scale-to-y 1080 -png "$D/rw/matte_white.pdf" "$D/rw/s" 2>/dev/null
python3 "$TK/media/preview.py" "$D" "$D/timing.json" "$D/media_slots.json" "$AUD" "$OUT"
# frame near the end of every slide, for checking readability of type on footage
python3 - "$D/timing.json" "$OUT" "$D/preview_check.png" <<'PY'
import json, subprocess, sys, os, tempfile
from PIL import Image
t = json.load(open(sys.argv[1]))['slides']; st, ims, tmp = 0.0, [], tempfile.mkdtemp()
for i in range(1, len(t) + 1):
    d = float(t[str(i)]['advance_s']); f = f'{tmp}/{i}.png'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', str(st + d - 1.0), '-i', sys.argv[2], '-frames:v', '1', '-vf', 'scale=480:-2', f])
    if os.path.exists(f): ims.append(Image.open(f))
    st += d
cols = 5; W = Image.new('RGB', (cols * 490, ((len(ims) + cols - 1) // cols) * 280), 'white')
for k, im in enumerate(ims): W.paste(im, ((k % cols) * 490, (k // cols) * 280))
W.save(sys.argv[3]); print('check sheet', sys.argv[3])
PY
