---
name: video-faceless
description: Use when the user pastes a naskah (script) and wants a faceless 9:16 Reels/TikTok/Shorts video in Aulia Rahman's style: ElevenLabs voice "Aulia Rahman", iso-kit + head-sticker visuals, word-by-word captions, SFX (no music by default), series logo, built with HyperFrames. Dipanggil `/video-faceless <naskah>`. Konten berbahasa Indonesia.
---

# Video faceless (9:16, suara Aulia, visual iso + kepala stiker)

Input: naskah polos dari pengguna (opsional nama seri; default **Sing Murah Wae**). Output: `renders/video.mp4`.
Referensi utuh satu video jadi: `examples/contributor-build.py` (+ `contributor-naskah-bertag.txt`).
Alur dengan **checkpoint**; jangan lompat ke render final tanpa persetujuan.

1. **Wawancara singkat** (`AskUserQuestion`, maks 2 putaran): seri (logo/penutup), kalimat wajib-utuh, ada sumber web untuk bukti layar, durasi target. Jangan menanyakan yang sudah punya default di bawah.
2. **Verifikasi klaim**: tawarkan dulu (opsional, pengguna yang memutuskan). Bila ya: cek tiap angka/klaim ke sumber primer ≤6 bulan (AGENTS.md repo), tandai yang tak terverifikasi. Naskah jangan diubah diam-diam; usulkan perubahan.
3. **Scaffold**: `scripts/new.sh dates/<YYYY-MM-DD>/<slug> [seri.svg]` (menyalin font, SFX, ikon clay, kepala, logo). Seri lain: SVG gelap + `<nama>-white.svg` harus ada; tanpa aset, minta ke pengguna atau pakai teks tipografi.
4. **Naskah bertag**: tambahkan tag ekspresi ElevenLabs `[confident]` per paragraf (default; `[curious]`/`[chuckles]` bila perlu; jangan `[relaxed]`/`[energetic]`, lihat `references/suara.md`), tampilkan ke pengguna. Angka ditulis terbaca (`satu koma dua puluh lima`), singkatan seperti AI ditulis agar terbaca benar; tes bila ragu. Simpan `tts/final.txt`.
5. **Tes suara (checkpoint 1)**: `scripts/tts.sh tts/final.txt tts/final` lalu `scripts/words.py tts/final.align.json tts/words.json`; kirim `tts/final.mp3` (SendUserFile) dan tunggu "oke". Detail & default di `references/suara.md`.
6. **Hook**: usulkan 2-3 opsi hook (sketsa teks singkat) dan minta pilih. Kandidat: angka/klaim raksasa + coretan, pertanyaan tajam, kontras sebelum/sesudah.
7. **Bukti layar**: bila naskah punya sumber web, **tanyakan dulu** per video. Bila ya: `scripts/shot.mjs` (sekali `pnpm i` di `scripts/`), lihat PNG hasilnya sebelum dipakai.
8. **Storyboard → build**: tulis `build.py` proyek yang `from lib import *` (lihat `references/gaya.md` untuk komponen, aturan, dan peta adegan). Satu adegan per beat naskah, waktu dari `T(i)`/`E(i)`. `cp tts/final.mp3 assets/vo.mp3`. **Tanpa musik/BGM** (pengguna tidak mau); hanya bila diminta: `scripts/bgm.sh assets/vo.mp3 assets/bgm-duck.mp3` lalu `page(..., bgm_dur=VO)`. SFX sudah di `assets/sfx` (regenerasi: `scripts/sfx.sh`).
9. **Cek**: `python3 build.py && npx hyperframes check` (0 error) lalu `npx hyperframes snapshot --at t1,t2,...` di tiap batas adegan dan lihat gambarnya. Perbaiki tumpang tindih sebelum render.
10. **Draf (checkpoint 2)**: `npx hyperframes render --quality draft --output renders/preview-vN.mp4`, kirim, ikuti revisi. Hapus draf lama.
11. **Final** hanya setelah "oke": `npx hyperframes render --quality high --output renders/video.mp4`, cek durasi `ffprobe`, kirim. Sampaikan baris aplikasi desktop HyperFrames dari output render. Cache render ±3,7 GB (CLAUDE.md repo): hapus bila `ENOSPC`.

Setelah selesai tawarkan judul + deskripsi + hashtag (bukan bagian wajib).

## Default tetap (jangan ditanya ulang)
Suara ElevenLabs v4, stability 0,5, similarity 1,0, style 0,2, tag `[confident]`, tempo 1,1x (default `tts.sh`) · logo seri kiri atas + tanda tangan kanan atas (putih di penutup gelap) · kepala Aulia kiri bawah, ekspresi tepat per konteks · caption kata-per-kata (kata kunci kobalt) · tanpa musik (BGM off), hanya SFX sintetis · kalimat khas seri utuh (mis. "Kalau sama-sama beres... Sing Murah Wae.") dengan logo seri terbang ke tengah lalu kembali.

## Pegangan
- Timestamp kata dari alignment ElevenLabs, bukan Whisper. Tag `[..]` tidak diucapkan.
- Gaya design system: Geist, sentence case, "saya/Anda", tanpa em dash, satu kepala Aulia per frame.
- Pengguna memutuskan; jangan hapus/komit apa pun tanpa diminta. `.env` sudah di-gitignore.
