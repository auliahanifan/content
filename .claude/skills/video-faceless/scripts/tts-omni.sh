#!/usr/bin/env bash
# Suara Aulia default (OmniVoice lokal). Pakai: tts-omni.sh <naskah-bertag.txt> <prefix-keluaran, mis. tts/final>
# Keluaran: <prefix>.mp3, words.json (folder yang sama), <prefix>.paras.json. Detail: references/suara.md.
# env opsional: SPEED (1.0), REF/REF_TEXT (contoh suara), GAP (0.28), WHISPER (small).
set -e
here=$(cd "$(dirname "$0")" && pwd)
R=$(git -C "$here" rev-parse --show-toplevel)
[[ -x $R/.venv-voice/bin/python ]] || { echo "Lingkungan suara belum ada. Jalankan dulu: $here/setup-voice.sh"; exit 1; }
exec "$R/.venv-voice/bin/python" "$here/omni_tts.py" "$@"
