#!/usr/bin/env bash
# Pasang lingkungan suara (OmniVoice + faster-whisper) di <root repo>/.venv-voice. Sekali saja.
# Mac Apple Silicon: torch biasa (MPS). Linux tanpa GPU (sesi cloud): torch CPU.
# Model OmniVoice (±3 GB) dan Whisper small diunduh dari Hugging Face saat pertama dipakai.
set -e
here=$(cd "$(dirname "$0")" && pwd)
R=$(git -C "$here" rev-parse --show-toplevel)
PY=${PYTHON:-python3}
[[ -x $R/.venv-voice/bin/python ]] || "$PY" -m venv "$R/.venv-voice"
P="$R/.venv-voice/bin/pip"
"$P" install -q --upgrade pip
if [[ $(uname) == Linux ]] && ! command -v nvidia-smi >/dev/null; then
  "$P" install -q torch torchaudio --index-url https://download.pytorch.org/whl/cpu
else
  "$P" install -q torch torchaudio
fi
"$P" install -q omnivoice faster-whisper librosa soundfile numpy
# Python 3.13+ tidak punya audioop bawaan (dipakai pydub di omnivoice)
"$R/.venv-voice/bin/python" -c "import audioop" 2>/dev/null || "$P" install -q audioop-lts
"$R/.venv-voice/bin/python" -c "import omnivoice, faster_whisper; print('lingkungan suara siap:', '$R/.venv-voice')"
