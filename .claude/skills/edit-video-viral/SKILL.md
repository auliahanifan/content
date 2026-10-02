---
name: edit-video-viral
description: Use when editing a raw talking-head video (often with many retakes) into a vertical 9:16 Reels/TikTok video with bold creator-style visuals, captions, split-screen hook, and SFX, rendered with HyperFrames. Konten berbahasa Indonesia.
---

# Edit video viral (9:16, gaya kreator)

Alur: wawancara → pilah retake → tulis spec → bangun → cek → render.

1. **Wawancara** sampai yakin 99%: `references/interview.md`. Unduhan apa pun butuh izin eksplisit.
2. **Pilah retake**: `references/retake.md`, pakai `python3 scripts/chunks.py take.mov` (Whisper di `model/`, lihat CLAUDE.md repo).
3. **Siapkan proyek HyperFrames** (`/hyperframes`): `take.mp4` (audio), `take-cut.webm` (cutout alfa bila latar diganti, `npx hyperframes remove-background`), gambar, logo, `sfx/*.mp3`.
4. **Tulis spec.json**: skema `references/spec.md`, contoh `examples/muse-spec.json`. Gaya: `references/visual-system.md`.
5. **Bangun**, dari folder proyek: `python3 <skill>/scripts/build.py spec.json` (tulis `index.html` dan `timeline.json`). Tambah `--music` untuk `index-music.html`.
6. **Cek**: `npx hyperframes check`, lalu `npx hyperframes snapshot` dan lihat gambar di titik hook, takeover, stiker, caption. Perbaiki spec, bangun ulang.
7. **Iterasi presisi** (revisi kecil, hemat render): tambah `scenes` di spec, lalu dari folder proyek
   `python3 <skill>/scripts/scenes.py spec.json --only <id> --debug`. Video diberi id segmen dan timecode (resolusi 1 frame, `t` = waktu video, `src` = waktu footage mentah) di kiri atas.
   Scene dirender ke `../out/scenes/`, digabung ke `../out/scenes-merge/final.mp4`. Tanpa `--debug` untuk hasil bersih; `--merge-only` hanya menggabung ulang.
   Lihat dengan `mpv --osd-level=3 --osd-fractions file.mp4` (`.` / `,` = maju/mundur 1 frame). Revisi dinyatakan sebagai "s9 mulai +0.08" di spec.
8. **Render penuh**: `npx hyperframes render` ke `out/`. Versi musik: `python3 scripts/bgm.py render.mp4 musik.mp3 out.mp4`.

Jebakan:
- Disk penuh: cache ekstraksi HyperFrames bisa 3,7 GB; jangan pakai `--video-frame-format png`.
- Hanya satu file HTML root di proyek; hapus `index-music.html` setelah render.
- Kata pendek di sambungan ("Katanya") sering hilang di ASR; minta user mendengar klip periksa.
- Jangan unduh model, musik, atau gambar tanpa izin; lisensi musik dan foto stok belum terverifikasi.
