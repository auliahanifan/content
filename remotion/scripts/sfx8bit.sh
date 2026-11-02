#!/usr/bin/env bash
# Sintesis SFX 8-bit (gelombang kotak + noise) dengan ffmpeg aevalsrc. Pakai: scripts/sfx8bit.sh [folder=public/sfx]
set -e
out=${1:-$(dirname "$0")/../public/sfx}; mkdir -p "$out"
sq(){ echo "sgn(sin(2*PI*($1)*t))"; }  # gelombang kotak
mk(){ ffmpeg -v error -y -f lavfi -i "aevalsrc='$2':s=44100:d=$3" -af "${4:-anull},volume=0.9" -ac 1 -b:a 128k "$out/$1.mp3"; }
# blip: elemen muncul
mk blip   "0.25*$(sq '880+440*lt(t,0.03)')*exp(-t*18)" 0.12
# coin: angka/sorotan, dua nada naik
mk coin   "0.22*$(sq 'if(lt(t,0.07),988,1319)')*exp(-t*5)" 0.4
# select: dialog/footer
mk select "0.2*$(sq 'if(lt(t,0.05),660,990)')*exp(-t*12)" 0.18
# sweep: ganti adegan, noise menyapu
mk sweep  "0.35*(random(0)*2-1)*sin(PI*t/0.3)" 0.3 "lowpass=f=2500,highpass=f=300"
# hit: coretan/benturan
mk hit    "(0.5*$(sq '110*exp(-t*8)')+0.4*(random(1)*2-1))*exp(-t*14)" 0.3 "lowpass=f=3000"
# power: power-up naik (arpeggio)
mk power  "0.22*$(sq '330*pow(2,floor(t*24)/12)')*(1-t/0.55)" 0.55
# boom: interupsi epik, ledakan noise + nada turun
mk boom   "(0.55*(random(2)*2-1)+0.35*$(sq '220*exp(-t*3)'))*exp(-t*4)" 0.9 "lowpass=f=1800"
ls "$out"
