# Suara (ElevenLabs)

- Kunci: `ELEVENLABS_API_KEY`, `ELEVENLABS_AULIA_RAHMAN_VOICEID` dari environment (sesi cloud: secret/env var environment); bila kosong, `tts.sh` membaca `.env` di root repo (Mac). Jangan dicetak/dikomit.
- Model **eleven_v4**: abaikan parameter `speed`. Ekspresif lewat tag audio, bukan setting. `language_code: id`.
- **Standar (5 Nov 2026):** stability 0,5 · similarity 1,0 · style 0,2 · tag `[confident]` per paragraf · tempo 1,1x (`tts.sh` default `TEMPO=1.1`: ffmpeg `atempo` tanpa ubah nada, timestamp alignment ikut diskalakan). Override: env `STAB SIM STYLE MODEL TEMPO`.
- Dasar keputusan (TH-098, diukur): suara lama `[relaxed]` 5,2 suku kata/dtk, nada tengah 131 Hz. `[energetic]` menaikkan nada tengah ke 180 Hz (+37%) tanpa menambah variasi nada, jadi terdengar kurang mirip Aulia: **jangan dipakai**. `[confident]` 157 Hz, 5,3 suku kata/dtk pada 1,1x: dipilih. Rasa cepat datang dari naskah yang padat, bukan dari tempo; jangan naikkan tempo di atas 1,15x (pemula kehilangan istilah teknis).
- Tag lain hanya untuk momen tertentu: `[curious]` di pertanyaan, `[chuckles]` bila lucu. Hindari `[relaxed]` dan `[casual]` sebagai tag default (membuat tempo terasa santai).
- Tes pengguna: "tidak mirip" → turunkan intensitas tag atau hapus tag nada, similarity 1,0; "datar" → stability 0,45.
- Ucapan: tulis angka sebagai kata; kata asing (AI, API, Muse Spark) tes dengar. Ejaan tampilan di caption diatur lewat `FIX`/`MERGE` di `captions()`, bukan lewat teks TTS.
- Frasa khas seri ("sing murah wae") minta santai, boleh logat Jawa ringan lewat tag `[casual]` dan titik-titik "...".
- Python 3.14 di Mac tanpa CA cert: pakai curl (sudah di `tts.sh`). Script memakai bash, jalan di Mac dan cloud Linux.
