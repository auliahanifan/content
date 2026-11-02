---
name: video-karakter
description: Use when the user pastes a naskah (script) and wants a faceless 9:16 Reels/TikTok/Shorts video where the illustrated Aulia Rahman character presents next to an animated concept board, built with Remotion. ElevenLabs voice "Aulia Rahman", full-body character poses with spring animation, cartoon-style props, word-by-word captions, SFX (no music), series logo. Dipanggil `/video-karakter <naskah>`. Penerus /video-faceless (HyperFrames) yang masih tersedia. Konten berbahasa Indonesia.
---

# Video karakter (9:16, Remotion)

Input: naskah polos (opsional nama seri; default **Sing Murah Wae**). Output: `dates/<YYYY-MM-DD>/<slug>/out/video.mp4`.
Studio Remotion bersama ada di `remotion/` (pnpm). Tiap video = satu `storyboard.json` di foldernya; komponen React merendernya. **Jangan menulis TSX per video**; bila butuh jenis papan baru, tambahkan ke `remotion/src/boards/` agar dipakai ulang.
Contoh utuh: `dates/2026-11-01/agent-harness/storyboard.json`. Skema & aturan tata letak: `references/storyboard.md`. Props: `references/props.md`.
Alur dengan **checkpoint**; jangan lompat ke render final tanpa persetujuan.

1. **Wawancara singkat** (`AskUserQuestion`, maks 2 putaran): seri, kalimat wajib-utuh, ada sumber web untuk bukti layar, durasi target. Jangan tanyakan yang sudah punya default di bawah.
2. **Verifikasi klaim**: tawarkan (opsional). Bila ya: cek angka/klaim ke sumber primer ≤6 bulan, tandai yang tak terverifikasi. Naskah jangan diubah diam-diam; usulkan perubahan.
3. **Folder**: `mkdir -p dates/<YYYY-MM-DD>/<slug>/{tts,assets/img}`. Logo seri harus ada di `assets/<seri>.svg` + `assets/<seri>-white.svg` (root repo); bila tidak ada, minta ke pengguna.
4. **Naskah bertag** → `tts/final.txt`: tag ekspresi ElevenLabs (`[casual] [relaxed] [conversational] [curious] [chuckles]`) per paragraf; angka ditulis terbaca (`satu koma dua puluh lima`). Tampilkan ke pengguna.
5. **Tes suara (checkpoint 1)**: script suara dipakai bersama dengan video-faceless:
   `.claude/skills/video-faceless/scripts/tts.sh tts/final.txt tts/final` lalu `python3 .claude/skills/video-faceless/scripts/words.py tts/final.align.json tts/words.json`. Kirim `tts/final.mp3` (SendUserFile), tunggu "oke". Detail suara: `.claude/skills/video-faceless/references/suara.md`.
6. **Hook**: usulkan 2-3 opsi papan pembuka (teks singkat + pose), minta pilih.
7. **Bukti layar** (tanyakan dulu per video): `node .claude/skills/video-faceless/scripts/shot.mjs <url> assets/img/shot-x.png "<teks>"` (sekali `pnpm i` di folder scripts itu). Lihat PNG sebelum dipakai; posisi cincin sorot dalam **persen** gambar.
8. **Storyboard**: tulis `storyboard.json`. Cetak dulu daftar kata berindeks:
   `python3 -c "import json;w=json.load(open('tts/words.json'));print(' '.join(f'{i}:{x[0]}' for i,x in enumerate(w)))"`
   Satu adegan per beat naskah; semua `at` = indeks kata. Pose harus cocok dengan kalimat (pengguna sangat peduli ini). Rapikan ejaan caption dengan `captionMerge`/`captionFix`.
9. **Props (checkpoint)**: kumpulkan nama `prop` di storyboard yang belum ada di `assets/props/`. Tulis daftar + prompt gambar (template di `references/props.md`) ke `dates/<tgl>/<slug>/props-prompt.md` dan tunjukkan ke pengguna. Pengguna yang generate; sementara itu emoji placeholder tampil otomatis. Jangan generate gambar sendiri.
10. **Cek visual**: dari `remotion/`: `pnpm still ../dates/<tgl>/<slug> 0.5 4 12 ...` (detik; `f120` = frame) → PNG di `out/stills/`. Gabungkan jadi satu lembar (`ffmpeg ... tile=5x2`) dan **lihat**. Periksa: teks tidak meluap dari papan, footer tidak menimpa kepala, caption tidak tertutup. `pnpm typecheck` bila mengubah kode.
11. **Draf (checkpoint 2)**: `pnpm render ../dates/<tgl>/<slug> --draft` → `out/draft.mp4` (setengah resolusi), kirim, ikuti revisi.
12. **Final** setelah "oke": `pnpm render ../dates/<tgl>/<slug>` → `out/video.mp4`; cek durasi `ffprobe`, kirim.

Setelah selesai tawarkan judul + deskripsi + hashtag (opsional).
Studio interaktif (Mac): `cd remotion && pnpm studio ../dates/<tgl>/<slug>`.

## Default tetap (jangan ditanya ulang)
Suara ElevenLabs v4 (stability 0,6 · similarity 1,0 · style 0,15) · karakter Aulia badan penuh kiri bawah, ganti pose dengan squash/hop, idle bernapas, goyang ikut volume suara · papan konsep di atas · caption kata-per-kata di kanan karakter (kata kunci jeruk, kata aktif stabilo) · logo seri kiri atas, tanda tangan kanan atas, logo terbang ke tengah pada `seriesLine` · tanpa musik; SFX otomatis (swipe ganti adegan, pop elemen muncul, thud coretan, ding footer) · penutup gelap (`dark: true`) · palet kartun hangat (krem, tinta navy, aksen jeruk), Bricolage Grotesque + Plus Jakarta Sans.

## Pegangan
- Timestamp kata dari alignment ElevenLabs, bukan Whisper. Tag `[..]` tidak diucapkan.
- Bahasa: sentence case, "saya/Anda", tanpa em dash. Teks papan ringkas (papan bukan transkrip; caption sudah memuat ucapan).
- Pengguna memutuskan; jangan hapus/komit apa pun tanpa diminta. `.env` di-gitignore.
- Container cloud: `scripts/run.mjs` otomatis memakai Chromium di `/opt/pw-browsers`; di Mac Remotion mengunduh Chrome Headless Shell sendiri sekali.
