#!/bin/bash
# Finish a Kokoro narration and lay a bed under it (7 Nov 2026). The voice: highpass 70 Hz, two-pass linear loudnorm to
# -16 LUFS. The bed: two ambient_bed characters with chord changes at every scene start, crossfading (6 s) at one scene,
# sidechain-ducked under the voice, mixed about 12.5 dB under it (bed about -28.5 LUFS on its own before ducking).
# Usage: kokoro_finish.sh vo.wav timing.json <bedA> <bedB|-> <switch scene|-> out_prefix   (e.g. ember glass seales outputs/Scrolls_voice_v2)
set -e; VO=$1; TJ=$2; A=$3; B=$4; SW=$5; OUT=$6; D=$(dirname "$OUT"); W=$(mktemp -d); BED=$(dirname "$0")/../media/ambient_bed.py
ffmpeg -hide_banner -y -i "$VO" -af highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2> $W/ln.txt
read I TP LRA TH OFF < <(python3 -c "
import json,re;d=json.loads(re.search(r'\{[^{}]*\}',open('$W/ln.txt').read().split('Parsed_loudnorm')[-1],re.S).group());print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -v error -y -i "$VO" -af "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true" -ar 48000 -ac 2 $W/vo_final.wav
read DUR CH X0 < <(python3 -c "
import json;T=json.load(open('$TJ'));s={}
for l in T['lines']: s.setdefault(l['scene'],l['start'])
print(round(T['total']+2,1),','.join(str(round(v if i else 0,1)) for i,v in enumerate(s.values())),round(s.get('$SW',0)-3,1))")
python3 $BED $A $DUR $W/bedA.wav --changes $CH
if [ "$B" != "-" ]; then python3 $BED $B $DUR $W/bedB.wav --changes $CH; X1=$(python3 -c "print($X0+6)")
  ffmpeg -v error -y -i $W/bedA.wav -i $W/bedB.wav -filter_complex "[0]volume='if(lt(t,$X0),1,if(lt(t,$X1),($X1-t)/6,0))':eval=frame[e];[1]volume='if(lt(t,$X0),0,if(lt(t,$X1),(t-$X0)/6,1))':eval=frame[g];[e][g]amix=inputs=2:normalize=0,volume=-0.5dB[bed]" -map "[bed]" $W/bed.wav
else ffmpeg -v error -y -i $W/bedA.wav -af volume=-0.5dB $W/bed.wav; fi
ffmpeg -v error -y -i $W/vo_final.wav -i $W/bed.wav -filter_complex "[1][0]sidechaincompress=threshold=0.05:ratio=3:attack=20:release=400[bd];[0][bd]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.89[m]" -map "[m]" -ar 48000 $W/mix.wav
cp $W/vo_final.wav "$D/vo_final.wav"; ffmpeg -v error -y -i $W/vo_final.wav -b:a 192k "$OUT.mp3"; ffmpeg -v error -y -i $W/mix.wav -b:a 192k "${OUT}_${A}$( [ "$B" != "-" ] && echo _$B ).mp3"
for f in vo_final bed mix; do echo -n "$f "; ffmpeg -hide_banner -i $W/$f.wav -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1; done; rm -rf $W
