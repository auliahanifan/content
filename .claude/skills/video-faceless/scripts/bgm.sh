#!/usr/bin/env bash
# BGM ducking di bawah suara. Pakai: bgm.sh <vo.mp3> <out bgm-duck.mp3> [musik=assets/bgm.mp3]
# Musik dipanjangkan (crossfade dua salinan), dipotong sepanjang VO + 0.8 dtk.
set -e; vo=${1:?vo}; out=${2:?out}; here=$(cd "$(dirname "$0")" && pwd); mus=${3:-$here/../assets/bgm.mp3}
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $vo); len=$(python3 -c "print(round($d+.8,2))")
ffmpeg -nostdin -v error -y -i $mus -i $mus -i $vo -filter_complex \
"[0:a][1:a]acrossfade=d=3,atrim=0:$len,asetpts=N/SR/TB,volume=0.55,afade=t=in:d=1,afade=t=out:st=$(python3 -c "print(round($len-2,2))"):d=2[m];\
[m][2:a]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=350:makeup=1[duck]" \
-map "[duck]" -b:a 160k $out
echo $out
