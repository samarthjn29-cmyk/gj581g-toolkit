#!/usr/bin/env bash
# Build a Decked out Data deck from the shared head + the project's slides.js.
# Usage: deck/build.sh <deck_config.json> <slides.js> [--preview-mattes]
#   writes <out_dir>/deck_raw.pptx, timing.json, media_slots.json, subs_build.json, then deck.pptx (timed, validated).
#   --preview-mattes also writes matte_black.pptx / matte_white.pptx first (needed by media/preview.py).
set -eo pipefail
TK="$(cd "$(dirname "$0")/.." && pwd)"
CFG="$(realpath "$1")"; SLJS="$(realpath "$2")"
OUT="$(python3 -c "import json,os,sys;c=json.load(open(sys.argv[1]));print(os.path.realpath(os.path.join(os.path.dirname(sys.argv[1]),c['out_dir'])))" "$CFG")"
mkdir -p "$OUT"
if python3 -c "import json,sys;sys.exit(0 if json.load(open(sys.argv[1])).get('texture') else 1)" "$CFG"; then python3 "$TK/deck/texture.py" "$CFG" >/dev/null; fi
cat "$TK/deck/head.js" "$SLJS" "$TK/deck/tail.js" > "$OUT/build.js"
export NODE_PATH="$(npm root -g):/opt/npm-tools/node_modules:${NODE_PATH:-}"
if [[ "${3:-}" == "--preview-mattes" ]]; then
  MATTE=black node "$OUT/build.js" "$CFG" >/dev/null
  MATTE=white node "$OUT/build.js" "$CFG" >/dev/null
fi
node "$OUT/build.js" "$CFG"                         # real deck last: it writes the final timing.json
python3 "$TK/media/apply_timing_media.py" "$OUT/deck_raw.pptx" "$OUT/timing.json" -o "$OUT/deck.pptx"
python3 /mnt/skills/public/pptx/scripts/office/validate.py "$OUT/deck.pptx"
