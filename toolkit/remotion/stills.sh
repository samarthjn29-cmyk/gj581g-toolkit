#!/bin/bash
# usage: stills.sh name frame1 frame2 ...  -> out/st_<frame>.png and out/<name>.png contact sheet
name=$1; shift; files=()
for fr in "$@"; do npx remotion still src/index.jsx Video out/st_$fr.png --frame=$fr --browser-executable=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome --log=error >/dev/null 2>out/still_err.txt || { cat out/still_err.txt | grep -v -i memory | head -20; }; files+=(out/st_$fr.png); done
python3 - "$name" "${files[@]}" <<'PY'
import sys
from PIL import Image
name, fs = sys.argv[1], sys.argv[2:]
ims=[Image.open(f).resize((960,540)) for f in fs]
cols=2; rows=(len(ims)+1)//2
c=Image.new('RGB',(1920,540*rows),'white')
for i,im in enumerate(ims): c.paste(im,((i%2)*960,(i//2)*540))
c.save(f'out/{name}.png')
PY
