#!/bin/zsh
# Scaffold proyek video faceless. Pakai: new.sh <dates/YYYY-MM-DD/slug> [seri-svg]
# seri-svg default: assets/img/sing-murah-wae.svg milik skill. Seri lain: beri path svg gelap; versi "<nama>-white.svg" wajib sebelahan.
set -e; dir=${1:?folder}; here=${0:A:h}/..; R=/Users/noice/Dev/content
DS="$R/Aulia Rahman Design System/assets"; series=${2:-$here/assets/img/sing-murah-wae.svg}
mkdir -p $dir/{tts,renders,assets/img} && cd $dir
cp -R $here/assets/fonts $here/assets/sfx assets/ ; cp $here/assets/img/clay-*.png assets/img/
cp $R/assets/kepala-*.png assets/img/
cp "$DS/logo-signature-black.svg" "$DS/logo-signature-white.svg" assets/img/
cp $series assets/img/; s=${series:t:r}; [[ -f ${series:h}/$s-white.svg ]] && cp ${series:h}/$s-white.svg assets/img/
for c in laptop robot money-bag package gear chart-increasing light-bulb magnifying-glass hourglass; do
  [[ -f assets/img/clay-$c.png ]] || cp "$DS/illustrations/3d-clay/$c.png" assets/img/clay-$c.png; done
cat > hyperframes.json <<'J'
{ "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": { "blocks": "compositions", "components": "compositions/components", "assets": "assets" },
  "media": { "autoProxy": true }, "authoringSkill": "general-video" }
J
echo "{\"id\":\"${dir:t}\",\"name\":\"${dir:t}\",\"createdAt\":\"$(date -u +%FT%TZ)\"}" > meta.json
echo "siap: $dir (kepala ekspresi: $(ls assets/img/kepala-*.png | wc -l))"
