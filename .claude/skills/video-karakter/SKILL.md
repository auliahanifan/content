---
name: video-karakter
description: Use when the user pastes a naskah (script) and wants a faceless 9:16 Reels/TikTok/Shorts video in a retro pixel-game world where the Pixel Aulia character presents next to RPG-window concept boards, with epic anime reaction interrupts, built with Remotion. ElevenLabs voice "Aulia Rahman", pixel props, word-by-word captions, 8-bit SFX (no music), series logo. Dipanggil `/video-karakter <naskah>`. Penerus /video-faceless (HyperFrames) yang masih tersedia. Konten berbahasa Indonesia.
---

# Video karakter (9:16, Remotion, dunia pixel game)

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
6. **Rencana visual otomatis** (pengguna memilih "otomatis dulu, revisi di draf"; jangan bertanya per elemen). Susun sendiri lalu tampilkan ringkasan tabel per adegan (map, mood, skin, papan, epik) dan langsung lanjut ke storyboard; revisi terjadi di checkpoint draf. Tanyakan hanya bila naskah ambigu soal fakta, bukan soal gaya. Isinya: 2-3 opsi papan pembuka dipilih yang terkuat, lalu **maks 4 interupsi epik** (punchline: fakta mengejutkan, insight, CTA; utamakan reaksi Anime Metafora yang cocok dengan naskah, mis. `pawang-ai` untuk orkestrasi AI), **3-5 mini-epik** (`aura`: efek terpisah di belakang presenter pada kata penting), **map** per topik (ganti tiap 2-4 adegan), **mood** di kalimat beremosi, **skin** bervariasi, satu **boss** bila naskah punya "masalah vs solusi", dan **juice** (stiker, pop, fx, loot) sampai `pnpm density` bersih. Usulkan juga, bila cocok: `meter` (taruhan yang menumpuk; otomatis bila naskah punya baris `Meter:`), `loop` (bila naskah punya baris `Janji:`), papan `word` untuk kata kunci pembalik, dan penutup CTA (`ui` kind `comments` untuk CTA kata kunci, `profile` untuk CTA follow).
7. **Bukti layar** (tanyakan dulu per video): `node .claude/skills/video-faceless/scripts/shot.mjs <url> assets/img/shot-x.png "<teks>"` (sekali `pnpm i` di folder scripts itu). Lihat PNG sebelum dipakai; posisi cincin sorot dalam **persen** gambar.
8. **Storyboard**: tulis `storyboard.json`. Cetak dulu daftar kata berindeks:
   `python3 -c "import json;w=json.load(open('tts/words.json'));print(' '.join(f'{i}:{x[0]}' for i,x in enumerate(w)))"`
   Satu adegan per beat naskah; semua `at` = indeks kata. Pose harus cocok dengan kalimat (pengguna sangat peduli ini). Variasikan `layout` (left/right/center) antar adegan; jangan dua adegan berturut-turut dengan layout sama kecuali alasan kuat. Tambah `punch` di kata kunci. Rapikan ejaan caption dengan `captionMerge`/`captionFix`.
   **Mock UI**: butir yang menyebut benda milik penonton (form, checkout, chat WA, notifikasi, struk, email, terminal) pakai papan `ui`, bukan papan ikon. Baris `[UI: ...]` di naskah dari `/naskah` adalah saran jenisnya. Tumpukan jebakan: satu adegan `ui` per butir + `flag` pada kekurangannya + `meter` naik di angka butir itu.
   **Kepadatan (wajib)**: setelah storyboard ditulis, dari `remotion/` jalankan `pnpm density ../dates/<tgl>/<slug>`; isi setiap jeda > 2 detik (target rata-rata ≤ 1 detik per kejadian) dengan stiker/pop/fx/pose/baris papan yang relevan dengan kata di jeda itu, lalu ulangi sampai bersih. Contoh pilot: `dates/2026-11-01/agent-harness-v2/storyboard.json`.
9. **Props**: tiap item diberi `emoji` yang tepat; emoji otomatis di-pixel-kan dalam slot inventory, jadi tidak perlu aset baru. PNG `assets/props/<prop>.png` (gaya Pixel Aulia) menggantikannya bila suatu saat ada; tawarkan `props-prompt.md` hanya bila pengguna mau (`references/props.md`).
10. **Cek visual**: dari `remotion/`: `pnpm still ../dates/<tgl>/<slug> 0.5 4 12 ...` (detik; `f120` = frame) → PNG di `out/stills/`. Ambil satu titik per adegan + satu di tengah tiap epik (untuk papan `ui`, ambil setelah baris terakhir/flag muncul); gabungkan (`ffmpeg ... tile=6x2`) dan **lihat**. Periksa: teks tidak menabrak title bar/terpotong, mock `ui` tidak terpotong di bawah (turunkan `zoom`), HUD tidak bertabrakan dengan logo, dialog tidak menutup isi, caption tidak tertutup karakter. `pnpm typecheck` bila mengubah kode.
11. **Draf (checkpoint 2)**: `pnpm render ../dates/<tgl>/<slug> --draft` → `out/draft.mp4` (setengah resolusi), kirim, ikuti revisi.
12. **Final** setelah "oke": `pnpm render ../dates/<tgl>/<slug>` → `out/video.mp4`; cek durasi `ffprobe`, kirim.

Setelah selesai tawarkan judul + deskripsi + hashtag (opsional).
Studio interaktif (Mac): `cd remotion && pnpm studio ../dates/<tgl>/<slug>`.

## Default tetap (jangan ditanya ulang)
Gaya energik: sesuatu terjadi tiap 1-2 detik, map procedural per topik dengan kamera dash, latar bereaksi (mood), skin papan bervariasi, stiker emoji pixel, damage number, boss, partikel ambien; efek tidak menutupi isi yang sedang dibaca; bahaya tetap lucu-epik, tidak seram; tanpa meme/aset pihak lain.
Suara ElevenLabs v4 (stability 0,6 · similarity 1,0 · style 0,15) · karakter **Pixel Aulia** (`assets/pixel-aulia/`, tinggi badan dinormalkan dari manifest) yang berpindah kiri/kanan/tengah antar adegan dengan geser mulus; **diam seperti sprite** (tanpa goyang/napas/lompat, pengguna menilainya tidak natural), ganti pose = potongan bersih dengan fade 2 frame · papan = jendela RPG (title bar jeruk berisi kicker, isi krem, sudut berundak), judul Pixelify Sans · dunia: map procedural (padang default), malam arcade untuk epik dan penutup (`dark: true`) · transisi mosaik pixel / iris bergantian · kamera zoom pelan + punch-in + shake saat epik · `footer` = kotak dialog RPG mengetik dengan potret · caption Plus Jakarta Sans putih outline tinta (kata kunci kuning, kata aktif kotak kuning) · logo seri kiri atas, tanda tangan kanan atas, logo terbang pada `seriesLine` · tanpa musik; SFX 8-bit otomatis (`remotion/scripts/sfx8bit.sh`).

## Pegangan
- Aset Vol. 5 (mulut bicara, kedip, jalan, sprite interaksi, monster, map bergambar) belum ada; promptnya di `assets/pixel-aulia/prompts-vol5.md`. Sampai ada, karakter tetap ganti pose + masuk dash/beam, monster dari emoji pixel, map procedural.
- Timestamp kata dari alignment ElevenLabs, bukan Whisper. Tag `[..]` tidak diucapkan.
- Bahasa: sentence case, "saya/Anda", tanpa em dash. Teks papan ringkas (papan bukan transkrip; caption sudah memuat ucapan).
- Pengguna memutuskan; jangan hapus/komit apa pun tanpa diminta. `.env` di-gitignore.
- Container cloud: `scripts/run.mjs` otomatis memakai Chromium di `/opt/pw-browsers`; di Mac Remotion mengunduh Chrome Headless Shell sendiri sekali.
