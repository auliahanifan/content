# Content

Video konten (Reels/TikTok) per tanggal di `dates/<YYYY-MM-DD>/`. Footage mentah, proyek HyperFrames, dan hasil render ada di folder tanggal itu.

## Google Sheet content bank

https://docs.google.com/spreadsheets/d/1CWo1QCbJv_W-4L2AV5qGU3S-1JWf1CqdR0GMVnZyYMY/edit (`contentBank - aulia rahman`)

Dipakai oleh `/ide-konten`, `/ide-threads`, `/naskah`, `/challenge`, dan `/arsip`. Tab: `Talking Head`, `Naskah`, `Fakta`, serta arsipnya `ArchiveTH` (dari Talking Head) dan `ArchiveN` (dari Naskah), tab `/ide-threads` (`Threads`, `Akun Threads`, `Kata Kunci Threads`), dan tab bantu tersembunyi `Cari`. Pakai link ini; tidak perlu mencari di Drive.

Tab arsip bisa berisi puluhan ribu baris. Jangan pernah membacanya penuh. Pakai query rumus di tab tersembunyi `Cari` sesuai `.claude/skills/arsip/references/baca-arsip-hemat.md`, lalu baca hanya baris yang cocok.

## Transkripsi: pakai Whisper lokal

Model sudah ada di repo ini. **Jangan unduh ulang.**

- Model: `model/ggml-large-v3-turbo.bin` (multibahasa, dipakai untuk bahasa Indonesia)
- CLI: `whisper-cli` (`/opt/homebrew/bin/whisper-cli`)
- Model Whisper bawaan HyperFrames (`small.en` dkk) hanya Inggris. Parakeet tidak mendukung bahasa Indonesia. Jadi pakai model di atas.

```bash
# audio 16 kHz mono dulu
ffmpeg -v error -y -i footage.mov -ar 16000 -ac 1 a.wav
whisper-cli -m model/ggml-large-v3-turbo.bin -l id -nt -f a.wav
# tambahkan --prompt "Meta Muse, WhatsApp, VPN" untuk menjaga ejaan istilah
```

Pelajaran dari proyek `dates/2026-10-01`:

- Timestamp kata dari Whisper tidak akurat dan sering sambung-menyambung. Jangan dipakai untuk menentukan titik potong.
- Untuk memilah retake: potong audio per jeda (`ffmpeg -af silencedetect=noise=-32dB:d=0.22`), transkripsi tiap potongan, lalu pilih take terakhir yang bersih.
- Titik potong akhir ditentukan dari amplitudo (RMS per 20–50 ms), bukan dari timestamp Whisper. Jeda napas sekitar -45 dB, bicara di atas -30 dB.
- Whisper kadang membuang kata awal yang pelan (contoh "Katanya") atau mengarang kata di ujung jendela yang terpotong. Kata yang meragukan harus didengar manusia, jangan ditebak.
- Caption mengikuti yang diucapkan, bukan naskah. Ejaan istilah (Muse, WhatsApp, VPN) dirapikan.

## Render HyperFrames

- Tiap render menulis cache ±3,7 GB di `/private/var/folders/.../T/hyperframes-extract-cache-501`. Bila disk penuh (`ENOSPC`), hapus cache itu. Aman, dibuat ulang otomatis.
- Hasil render ditaruh di `dates/<tanggal>/out/` (sudah di-gitignore).

## Remotion (video karakter)

Studio Remotion bersama ada di `remotion/` (pnpm). Dipakai skill `/video-karakter`; HyperFrames tetap dipakai `/video-faceless` dan `/edit-video-viral`.

- Tiap video = `dates/<tanggal>/<slug>/storyboard.json` (+ `tts/final.mp3`, `tts/words.json`). Tidak ada kode per video; jenis papan baru ditambahkan ke `remotion/src/boards/`.
- Perintah dari `remotion/`: `pnpm studio <folder-video>`, `pnpm still <folder-video> <detik>...`, `pnpm render <folder-video> [--draft]`. Hasil ke `<folder-video>/out/`.
- `scripts/run.mjs` mengarahkan symlink `remotion/public/video` ke folder video aktif. `remotion/public/shared` adalah symlink ke `assets/` (karakter `assets/pixel-aulia/`, logo, `assets/props/`).
- Gaya default **kanvas** v4 Tactile Explainer: dunia Paper Cutout v3 + 1-2 adegan metafora khusus per video (`illus`), bukti asli scrapbook (`evidence`, tangkapan layar dari `.claude/skills/video-faceless/scripts/bukti.mjs`), gerak pegas, hanya yang membantu paham yang bergerak. Dasarnya v3 Paper Cutout (`remotion/src/kanvas/`, skema `.claude/skills/video-karakter/references/kanvas.md`): dunia kertas kraft, kartu krem bertumpuk, judul Fraunces, hook kata jatuh di lembar kertas, headline kinetik dua tingkat pengganti caption, **satu elemen di panggung dalam satu waktu**, ilustrasi beranimasi dan simulasi chat, kamera pelan, Paper Cutout Aulia (`assets/paper-cutout-aulia/`) dengan gerak idle, SFX minimal (`pop`, `tick`, `soft-hit` di `remotion/public/sfx/v2/`), rekaman layar asli dalam bingkai HP untuk tutorial (`<folder-video>/rekam/`). Dasar keputusan: `dates/2026-11-04/riset-hisvill.md`.
- Posting Instagram lewat Buffer: jangan pasang label konten AI.
- Gaya opsional **game** (`"style": "game"` atau storyboard `scenes`): dunia pixel game, papan RPG, interupsi epik anime. Untuk konten hiburan. SFX 8-bit dibuat ulang dengan `remotion/scripts/sfx8bit.sh`.
- Lisensi: Remotion gratis untuk individu (konten personal brand). Bila dipakai atas nama perusahaan dengan lebih dari 3 orang, perlu company license.

## Aset turunan (tidak di-commit)

`dates/<tanggal>/muse-video/assets/take.mp4` dan `take-cut.webm` dibuat dari footage mentah dan ada di `.gitignore`. Buat ulang bila hilang:

```bash
cd dates/<tanggal>/muse-video
ffmpeg -y -i ../IMG_XXXX.MOV -c copy assets/take.mp4
npx hyperframes remove-background assets/take.mp4 -o assets/take-cut.webm   # ±10 menit, mengunduh model sekali
```
