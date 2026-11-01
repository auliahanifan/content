#!/usr/bin/env bash
# Sintesis SFX bersih (tanpa kresek) dengan ffmpeg. Pakai: sfx.sh <folder-keluaran>
# Menghasilkan pop, swipe, thud, ding, warn (.mp3). ffmpeg di mesin ini tanpa drawtext, aevalsrc ada.
set -e; out=${1:?folder}; mkdir -p $out
mk(){ ffmpeg -nostdin -v error -y -f lavfi -i "aevalsrc=${2}:s=44100:d=${3}" -af "$4" -b:a 128k $out/$1.mp3; }
mk pop   "0.8*sin(2*PI*(520+900*exp(-t*40))*t)*exp(-t*28)" 0.22 "afade=t=out:st=0.18:d=0.04"
mk swipe "0.35*(random(0)*2-1)*sin(PI*t/0.26)*sin(PI*t/0.26)" 0.26 "lowpass=f=4500,highpass=f=500"
mk thud  "0.9*sin(2*PI*(60+90*exp(-t*18))*t)*exp(-t*9)" 0.5 "afade=t=out:st=0.4:d=0.1"
mk ding  "0.5*sin(2*PI*1320*t)*exp(-t*5)+0.25*sin(2*PI*1980*t)*exp(-t*7)" 0.8 "afade=t=out:st=0.7:d=0.1"
mk warn  "0.4*sin(2*PI*(220+40*sin(2*PI*30*t))*t)*exp(-t*6)" 0.3 "afade=t=out:st=0.26:d=0.04"
ls $out
