#!/bin/bash
# Build one stills-format chapter (generalised from Zeigarnik's build_chapter.sh, 11 Nov 2026).
#   gathers the plan's pictures -> build_scene (word cues on Sam's audio) -> visible_lint (1.5 s rule) -> render
# Review renders are 720p DRAFTS (Remotion --scale=2/3, about half the render time); the 1080p master is
# rendered once, after Sam approves the chapter (Sam, 11 Nov 2026: workflow change 2).
# usage: build_chapter.sh <scene> [--norender | --draft (default) | --final]
# env:   PROJ   project folder (stills/<scene>.json, voice/final/timing_<scene>.json + vo_<scene>.wav, clips/)
#        PREFIX clip prefix (default: Z_)      RM  Remotion folder (default: /home/claude/twice/remotion)
#        PUB    public subfolder name (default: basename of PROJ)
# pictures are looked up in $PROJ/public/real, $PROJ/ai, $PROJ/video
# outputs: draft  -> clips/<PREFIX><scene>_720.mp4      final -> clips/<PREFIX><scene>.mp4 (+ _720 copy)
set -e
S=$1; MODE=${2:---draft}
: "${PROJ:?set PROJ to the project folder}"; PREFIX=${PREFIX:-Z_}; RM=${RM:-/home/claude/twice/remotion}
PUB=${PUB:-$(basename "$PROJ")}; OUT=$RM/public/$PUB/$S; TK=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$OUT" "$PROJ/clips"
python3 - "$S" "$OUT" "$PROJ" <<'EOF'
import json, sys, shutil, os
s, out, proj = sys.argv[1:]
P = json.load(open(f'{proj}/stills/{s}.json')); miss = []
dirs = [f'{proj}/public/real', f'{proj}/ai', f'{proj}/video', f'{proj}/video/overlays', f'{proj}/lottie/json']
def find(f):
    for d in dirs:
        if os.path.exists(f'{d}/{f}'): return f'{d}/{f}'
for sh in P['shots']:
    for key in ('img', 'video', 'page'):
        f = sh.get(key)
        if not f: continue
        src = find(f)
        if src: shutil.copy(src, f'{out}/{f}')
        else: miss.append(f)
    if sh.get('layers'):
        src = f"{proj}/public/real/{sh['layers']}"
        if os.path.isdir(src): shutil.copytree(src, f"{out}/{sh['layers']}", dirs_exist_ok=True)
        else: miss.append(sh['layers'])
    if sh.get('freeze_img') and not miss:
        t = sh.get('vstart', 0) + sh['freeze']
        os.system(f"ffmpeg -v error -y -ss {t} -i {out}/{sh['video']} -frames:v 1 -q:v 2 {out}/{sh['freeze_img']}")
fg = (P.get('finish') or {}).get('grain')
if fg: shutil.copy(f'{proj}/video/{fg}', f'{out}/{fg}')
for c in P.get('cards', []):
    for f2 in c.get('imgs', []):   # chain, burst, split: several pictures
        src = find(f2)
        if src: shutil.copy(src, f'{out}/{f2}')
        else: miss.append(f2)
    f = c.get('bg') or c.get('img') or c.get('file')   # file: a Lottie .json or an overlay clip
    if f:
        src = find(f)
        if src: shutil.copy(src, f'{out}/{f}')
        else: miss.append(f)
if miss: sys.exit('MISSING: ' + ' '.join(sorted(set(miss))))
print('pictures ok')
EOF
python3 "$TK/stills/build_scene.py" "$PROJ/stills/$S.json" "$PROJ/voice/final/timing_$S.json" "$PROJ/voice/final/vo_$S.wav" "$OUT" --pad 0.25
python3 "$TK/stills/visible_lint.py" "$OUT/timeline.json" || { echo "FAIL visible_lint: run fix_fast_cards.py $S first"; exit 1; }
python3 "$TK/stills/gag_lint.py" "$PROJ/stills/$S.json" || { echo "FAIL gag_lint: a gag or move is outside the plan's chosen gag schools (\"gags\": [...])"; exit 1; }
[ "$MODE" == "--norender" ] && exit 0
cd "$RM"
R="npx remotion render src/index_stills.jsx Scene"
A="--props=public/$PUB/$S/timeline.json --concurrency=1 --offthreadvideo-cache-size-in-bytes=400000000 --offthreadvideo-video-threads=1 --log=error"
if [ "$MODE" == "--final" ]; then
  $R "$PROJ/clips/${PREFIX}$S.mp4" $A
  ffmpeg -v error -y -i "$PROJ/clips/${PREFIX}$S.mp4" -vf scale=1280:720 -c:v libx264 -crf 26 -preset veryfast -c:a aac -b:a 128k "$PROJ/clips/${PREFIX}${S}_720.mp4"
else
  $R "$PROJ/clips/${PREFIX}${S}_720.mp4" $A --scale=0.66666666666666666   # exactly 2/3: 0.6667 gives height 720.036 and Remotion refuses it
fi
ls -la "$PROJ/clips/${PREFIX}${S}"*.mp4
