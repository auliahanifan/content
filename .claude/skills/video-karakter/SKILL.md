---
name: video-karakter
description: Use when the user pastes a naskah (script) and wants a faceless 9:16 Reels/TikTok/Shorts video with the Aulia character (Bold Vector in kanvas, Pixel Aulia in game), built with Remotion. Default style "kanvas" v2 (Bold Vector Aulia character, giant kinetic hook, two-tier kinetic headline instead of word captions, one stage with animated vector illustrations and chat simulations, always-moving camera, modern SFX, real screen recordings in a phone frame for tutorials). Optional style "game" (retro pixel-game world, RPG boards, epic anime interrupts) for entertainment pieces. ElevenLabs voice "Aulia Rahman", soft SFX, no music, series logo. Dipanggil `/video-karakter <naskah>`. Konten berbahasa Indonesia.
---

# Video karakter (9:16, Remotion, Pixel Aulia)

Input: naskah (idealnya dari `/naskah`, dengan blok `[HOOK]`, `Janji:`, `[REKAM: ...]`), opsional nama seri (default **Sing Murah Wae**). Output: `dates/<YYYY-MM-DD>/<slug>/out/video.mp4`.
Studio Remotion bersama di `remotion/` (pnpm). Tiap video = satu `storyboard.json`; **jangan menulis TSX per video**. Jenis elemen baru ditambahkan ke `remotion/src/kanvas/Elements.tsx` (kanvas) atau `remotion/src/boards/` (game) agar dipakai ulang.

**Gaya** (tentukan di langkah 6, jangan ditanyakan kecuali naskah jelas hiburan):
- **`kanvas` (default)**: skema `references/kanvas.md`, contoh `dates/2026-11-01/agent-harness-kanvas/storyboard.json`. Dasarnya riset `dates/2026-11-04/riset-hisvill.md`: penonton tertahan oleh **kemajuan penjelasan**, bukan dekorasi. Satu latar, headline dua tingkat, satu peraga yang tumbuh, rekaman layar asli untuk tutorial.
- **`game`**: hanya bila pengguna memintanya atau konten hiburan/cerita. Skema `references/storyboard.md`, contoh `dates/2026-11-01/agent-harness-v2/storyboard.json`.

Alur dengan **checkpoint**; jangan lompat ke render final tanpa persetujuan.

1. **Wawancara singkat** (`AskUserQuestion`, maks 2 putaran) hanya untuk yang belum jelas: seri, kalimat wajib-utuh, sumber web untuk bukti layar, **rekaman layar** (bila naskah punya `[REKAM: ...]`: sudah ada filenya, atau perlu direkam dulu), handle IG untuk CTA follow.
2. **Verifikasi klaim**: tawarkan (opsional). Bila ya: cek angka/klaim ke sumber primer ≤6 bulan, tandai yang tak terverifikasi. Naskah jangan diubah diam-diam; usulkan perubahan.
3. **Folder**: `mkdir -p dates/<YYYY-MM-DD>/<slug>/{tts,assets/img,rekam}`. Logo seri harus ada di `assets/<seri>.svg` + `assets/<seri>-white.svg` (root repo); bila tidak ada, minta ke pengguna. Rekaman layar dari pengguna disimpan di `rekam/` (mp4/mov di sana sudah di-gitignore).
4. **Naskah bertag** → `tts/final.txt`: hanya teks yang diucapkan (tanpa `[HOOK]`, `Layar:`, `Visual:`, `Janji:`, `[UI: ...]`, `[REKAM: ...]`). Tag ekspresi ElevenLabs (`[casual] [relaxed] [conversational] [curious] [chuckles]`) per paragraf; angka ditulis terbaca (`satu koma dua puluh lima`). Tampilkan ke pengguna.
5. **Tes suara (checkpoint 1)**: `.claude/skills/video-faceless/scripts/tts.sh tts/final.txt tts/final` lalu `python3 .claude/skills/video-faceless/scripts/words.py tts/final.align.json tts/words.json`. Kirim `tts/final.mp3` (SendUserFile), tunggu "oke". Detail suara: `.claude/skills/video-faceless/references/suara.md`.
6. **Rencana visual otomatis** (jangan bertanya per elemen; revisi terjadi di draf). Tampilkan tabel ringkas per panel: kata mulai, bagian naskah, peraga, posisi karakter, pose. Isinya untuk kanvas:
   - **Detik 0-3**: peraga hook langsung tampil di frame 0 (kartu harga yang akan dicoret, dua kartu A vs B, benda milik penonton). Headline baris pertama = kalimat hook. Tanpa epik di awal.
   - **Satu analogi = satu peraga yang tumbuh** (`flow`/`icon` + label), dipanggil lagi di penutup.
   - **Satu tugas konkret disimulasikan** bila naskah punya contoh: `ui` chat + `checklist` yang dicentang langkah demi langkah (chatbot vs agent, sebelum vs sesudah).
   - **Tutorial**: panel `char: "corner"` + `phone` berisi rekaman dari `rekam/`, `steps` per langkah, `rings` di tombol yang ditekan.
   - **Janji** (`Janji:` di naskah) → `loop` sampai kata payoff. **Kait ulang** di tengah ("ada satu langkah yang sering bikin gagal") → `dimAt` pada elemen lama + elemen baru yang menandai bagian itu.
   - **Penutup**: aturan bawa pulang dalam satu `card`, lalu `ui` `comments` (pertanyaan atau kata kunci) dan/atau `profile` (follow).
   - Dekorasi: epik maks 1 (hanya punchline terbesar), stempel maks 2.
7. **Bukti layar** (tanyakan dulu per video): `node .claude/skills/video-faceless/scripts/shot.mjs <url> assets/img/shot-x.png "<teks>"` (sekali `pnpm i` di folder scripts itu). Lihat PNG sebelum dipakai; cincin sorot dalam **persen** gambar.
8. **Storyboard**: tulis `storyboard.json`. Cetak dulu daftar kata berindeks:
   `python3 -c "import json;w=json.load(open('tts/words.json'));print(' '.join(f'{i}:{x[0]}' for i,x in enumerate(w)))"`
   - `lines`: satu frasa per baris (maks 10-12 kata), `split` di kata bermakna; semua kata tercakup. Rapikan ejaan dengan `captionMerge`/`captionFix` (headline mengikuti ucapan; ejaan istilah dirapikan).
   - `panels`: ganti panel saat bagian penjelasan berganti, elemen muncul pada kata yang menyebutnya. Pose cocok dengan kalimat (pengguna sangat peduli ini).
   - **Kepadatan (wajib)**: dari `remotion/` jalankan `pnpm density ../dates/<tgl>/<slug>`. Kanvas: tidak ada jeda > 3 detik tanpa perubahan headline/panggung, semua kata punya headline, baris ≤14 kata, dekorasi dalam batas. Ulangi sampai exit 0. Jangan mengisi jeda dengan dekorasi; isi dengan baris checklist, label, coretan, atau `dimAt` yang relevan dengan kata di jeda itu.
9. **Props**: tiap ikon diberi `emoji` yang tepat (di-pixel-kan otomatis). PNG `assets/props/<prop>.png` (gaya Pixel Aulia) menggantikannya bila ada; tawarkan `props-prompt.md` hanya bila pengguna mau (`references/props.md`). Logo aplikasi nyata: PNG di `assets/img/` lewat `icon: {src}`.
10. **Cek visual**: dari `remotion/`: `pnpm still ../dates/<tgl>/<slug> 0.5 4 12 ...` (detik; `f120` = frame) → PNG di `out/stills/`. Ambil satu titik di awal tiap panel, satu setelah elemen terakhirnya muncul, dan satu di tengah tiap langkah tutorial; gabungkan (`ffmpeg ... tile=6x2`) dan **lihat**. Periksa: headline tidak lebih dari 3 baris, panggung tidak terpotong (turunkan `zoom` panel atau `w` elemen), HP tidak menabrak headline, karakter tidak menutupi isi, tidak ada teks di y>1500. `pnpm typecheck` bila mengubah kode.
11. **Draf (checkpoint 2)**: `pnpm render ../dates/<tgl>/<slug> --draft` → `out/draft.mp4` (setengah resolusi), kirim, ikuti revisi.
12. **Final** setelah "oke": `pnpm render ../dates/<tgl>/<slug>` → `out/video.mp4`; cek durasi `ffprobe`, kirim.

Setelah selesai tawarkan judul + deskripsi + hashtag (opsional). Bila naskah menjanjikan aset (prompt, template), pastikan teks lengkapnya ada di caption atau komentar yang disematkan.
Studio interaktif (Mac): `cd remotion && pnpm studio ../dates/<tgl>/<slug>`.

## Default tetap (jangan ditanya ulang)
Kanvas v2: latar terang bergrid titik · header logo seri kiri, chip "Seri · topik" kanan, tanda tangan · hook teks raksasa + benda kunci · headline dua tingkat (pengantar abu, inti Bricolage Grotesque tebal yang katanya masuk satu per satu, kata kunci stabilo kuning) sebagai pengganti caption · panggung satu peraga: kartu bergaris navy + bayangan keras, ikon vektor, ilustrasi beranimasi, simulasi chat · kamera selalu bergerak pelan, transisi geser · karakter **Bold Vector Aulia** sepertiga layar dengan gerak idle halus dan pop saat ganti pose (Pixel Aulia diam hanya untuk mode game) · SFX modern otomatis (whoosh, pop, tick, ketikan, ding), tanpa musik · suara ElevenLabs v4 (stability 0,6 · similarity 1,0 · style 0,15).

## Pegangan
- Timestamp kata dari alignment ElevenLabs, bukan Whisper. Tag `[..]` tidak diucapkan.
- Bahasa: sentence case, "saya/Anda", tanpa em dash. Teks elemen ringkas (headline sudah memuat ucapan).
- Jangan meniru tampilan akun lain (palet, header, gaya avatar). Prinsipnya yang dipakai; identitas Aulia tetap: palet faceless Aulia, Pixel Aulia, logo seri.
- Pengguna memutuskan; jangan hapus/komit apa pun tanpa diminta. `.env` di-gitignore.
- Container cloud: `scripts/run.mjs` otomatis memakai Chromium di `/opt/pw-browsers`; di Mac Remotion mengunduh Chrome Headless Shell sendiri sekali.
- Aset Vol. 5 (mulut bicara, kedip) belum ada; promptnya di `assets/pixel-aulia/prompts-vol5.md`.
