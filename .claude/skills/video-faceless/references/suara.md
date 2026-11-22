# Suara Aulia

## Default: OmniVoice lokal (sejak 22 Nov 2026)

- **Perintah:** `scripts/tts-omni.sh tts/final.txt tts/final` → `tts/final.mp3` + `tts/words.json` (+ `tts/final.paras.json`). Satu perintah, tanpa kunci API, tanpa biaya per pemakaian.
- **Pasang sekali:** `scripts/setup-voice.sh` membuat `.venv-voice/` di root repo (Mac: torch MPS; Linux tanpa GPU: torch CPU). Model OmniVoice (±3 GB) dan Whisper `small` diunduh dari Hugging Face saat pertama dipakai.
- **Cara kerja:** OmniVoice (k2-fsa) mengklon suara dari contoh pendek, langsung bicara bahasa Indonesia (data latih ±6.300 jam). Naskah dibuat per paragraf (cache di `tts/.omni-cache/`, jadi mengubah satu paragraf hanya membuat ulang paragraf itu), digabung dengan jeda 0,28 detik, lalu loudnorm -14 LUFS.
- **Timestamp kata dari Whisper** (faster-whisper `small`, per paragraf) yang dicocokkan ke kata naskah; kata yang tidak tertangkap (mis. "Satu." ditulis "1") dibagi rata atau diinterpolasi. Indeks kata = urutan kata naskah, jadi storyboard tetap cocok.
- **Contoh suara:** `assets/voice/aulia-ref.wav` (13 detik) + `aulia-ref.txt` (transkrip persis). Saat ini diambil dari voice over ElevenLabs video 5 Nov 2026, jadi yang ditiru adalah "Aulia versi ElevenLabs". Ganti dengan rekaman asli 10-20 detik (bersih, tanpa musik) dengan nama yang sama untuk hasil yang lebih mirip suara asli; transkripnya harus persis.
- **Kecepatan:** default `SPEED=1.0` (±2,8 kata/dtk, setara standar lama `[confident]` 1,1x). Jangan di atas 1,15.
- **Tag:** `[confident]`, `[curious]`, dll. dibuang otomatis (tidak diucapkan); boleh tetap ada di `final.txt`. OmniVoice tidak memakai tag emosi; nada mengikuti contoh suara.
- **Waktu:** di CPU 4 core ±15x waktu audio (naskah 110 detik ±30 menit). Di Mac Apple Silicon jauh lebih cepat.
- **Hasil uji TH-150 (22 Nov 2026):** kemiripan warna suara dengan ElevenLabs 0,919 (dua rekaman ElevenLabs saling 0,924), kejelasan Whisper terbaik dari semua cara yang dicoba (Seed-VC dari Google Chirp/Gemini, Gemini-TTS asli). Seed-VC dari suara Google ditinggalkan karena intonasinya ikut gaya penyiar Google.
- **Lisensi:** kode OmniVoice Apache 2.0, **bobot model CC-BY-NC (non-komersial)**. Untuk konten yang menjual jasa/produk, putuskan dulu atau ganti mesin.
- Ucapan: tulis angka sebagai kata; kata asing (Claude, effort, API) tes dengar. Ejaan tampilan diatur di caption/headline (`captionFix`/`captionMerge`), bukan lewat teks TTS.

## Cadangan: ElevenLabs (`scripts/tts.sh`)

Hanya bila pengguna memintanya. Kunci `ELEVENLABS_API_KEY`, `ELEVENLABS_AULIA_RAHMAN_VOICEID` dari environment atau `.env` (Mac); jangan dicetak/dikomit.
- `scripts/tts.sh tts/final.txt tts/final` lalu `python3 scripts/words.py tts/final.align.json tts/words.json` (timestamp dari alignment ElevenLabs).
- Standar lama (5 Nov 2026): model eleven_v4, stability 0,5 · similarity 1,0 · style 0,2 · tag `[confident]` per paragraf · tempo 1,1x (`TEMPO`). `[energetic]` terdengar kurang mirip (nada +37%): jangan dipakai. `[curious]` di pertanyaan, `[chuckles]` bila lucu.
