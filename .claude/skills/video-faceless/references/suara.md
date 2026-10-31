# Suara (ElevenLabs)

- Kunci: `ELEVENLABS_API_KEY`, `ELEVENLABS_AULIA_RAHMAN_VOICEID` di `/Users/noice/Dev/content/.env` (jangan dicetak/dikomit).
- Model **eleven_v4**: abaikan parameter `speed`. Ekspresif lewat tag audio, bukan setting. `language_code: id`.
- Setting terpilih: stability 0,6 · similarity 1,0 · style 0,15 (mirip suara asli, tidak kaku). Override: env `STAB SIM STYLE MODEL`.
- Tes pengguna: "terlalu formal/datar" → tambah tag `[casual]`/`[conversational]`, turunkan stability; "tidak mirip" → similarity 1,0.
- Ucapan: tulis angka sebagai kata; kata asing (AI, API, Muse Spark) tes dengar. Ejaan tampilan di caption diatur lewat `FIX`/`MERGE` di `captions()`, bukan lewat teks TTS.
- Frasa khas seri ("sing murah wae") minta santai, boleh logat Jawa ringan lewat tag `[casual]` dan titik-titik "...".
- Python 3.14 di mesin ini tanpa CA cert: pakai curl (sudah di `tts.sh`).
