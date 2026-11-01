#!/usr/bin/env bash
# Scaffold proyek video faceless. Pakai: new.sh <dates/YYYY-MM-DD/slug> [seri-svg]
# seri-svg default: assets/img/sing-murah-wae.svg milik skill. Seri lain: beri path svg gelap; versi "<nama>-white.svg" wajib sebelahan.
# Aset dibaca dari root repo: assets/kepala-*.png dan "Aulia Rahman Design System/assets" (override: env DS).
set -e; dir=${1:?folder}
here=$(cd "$(dirname "$0")/.." && pwd)
R=$(git -C "$here" rev-parse --show-toplevel 2>/dev/null || (cd "$here/../../.." && pwd))
DS=${DS:-"$R/Aulia Rahman Design System/assets"}
series=${2:-$here/assets/img/sing-murah-wae.svg}; series=$(cd "$(dirname "$series")" && pwd)/$(basename "$series")
warn(){ echo "PERINGATAN: $*" >&2; }
mkdir -p "$dir"/{tts,renders,assets/img} && cd "$dir"
cp -R "$here/assets/fonts" "$here/assets/sfx" assets/ ; cp "$here"/assets/img/clay-*.png assets/img/
shopt -s nullglob; heads=("$R"/assets/kepala-*.png); shopt -u nullglob
(( ${#heads[@]} )) && cp "${heads[@]}" assets/img/ || warn "kepala-*.png tidak ada di $R/assets"
for f in logo-signature-black.svg logo-signature-white.svg; do
  [[ -f $DS/$f ]] && cp "$DS/$f" assets/img/ || warn "$f tidak ada di $DS"; done
s=$(basename "$series" .svg)
[[ -f $series ]] && cp "$series" assets/img/ || warn "logo seri $series tidak ada"
[[ -f $(dirname "$series")/$s-white.svg ]] && cp "$(dirname "$series")/$s-white.svg" assets/img/ || warn "$s-white.svg tidak ada"
for c in laptop robot money-bag package gear chart-increasing light-bulb magnifying-glass hourglass; do
  [[ -f assets/img/clay-$c.png ]] && continue
  [[ -f $DS/illustrations/3d-clay/$c.png ]] && cp "$DS/illustrations/3d-clay/$c.png" assets/img/clay-$c.png || warn "clay-$c.png tidak ada"; done
cat > hyperframes.json <<'J'
{ "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": { "blocks": "compositions", "components": "compositions/components", "assets": "assets" },
  "media": { "autoProxy": true }, "authoringSkill": "general-video" }
J
id=$(basename "$dir")
echo "{\"id\":\"$id\",\"name\":\"$id\",\"createdAt\":\"$(date -u +%FT%TZ)\"}" > meta.json
echo "siap: $dir (kepala ekspresi: ${#heads[@]})"
