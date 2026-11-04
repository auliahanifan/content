---
name: ide-threads
description: Cari ide Reels yang benar-benar fresh dari topik yang sedang hot di Threads Indonesia (≤72 jam) untuk personal brand Aulia Rahman. Dua radar lewat ScrapeCreators: radar umum (sampel luas Threads Indonesia lewat kata umum, mengukur yang ramai se-Indonesia lalu disaring yang bisa ditarik ke AI) dan radar AI (akun AI Indonesia, hot = jauh di atas rata-rata akunnya). Bedah balasan untuk debat dan pertanyaan, saring dua jalur (reaksi cepat langsung dibuatkan naskah lewat /naskah, jalur normal jadi usulan), tulis ke tab Talking Head dan catat semua thread di tab Threads. Gunakan ketika pengguna meminta /ide-threads, ide dari Threads, topik yang lagi hot/viral di Threads, atau ide konten paling fresh.
---

# Ide dari Threads Indonesia

Baca dulu `.claude/skills/naskah/references/tab-talking-head.md` (kolom, syarat kedalaman, syarat produksi, arc, anti dobel, aturan tulis sheet) dan `.claude/skills/aulia-brand/references/brand-rules.md`. Sheet: link di `CLAUDE.md`. Butuh konektor Google Sheets dan env `SCRAPECREATORS_API_KEY`.

Keputusan pengguna (4 Nov 2026): hanya Threads Indonesia; jendela 72 jam; hot = cepat ramai + debat di balasan + banyak pertanyaan; cakupan AI atau yang bisa ditarik ke AI dengan jujur; maks 8 ide per run; ±40 kredit per run; dijalankan manual.

## Kenapa dua radar
Pencarian Threads mencocokkan frasa persis dan hanya mengembalikan ±15-20 post teratas. Kata AI ("ChatGPT", "Gemini") hampir selalu memberi post Inggris (dan "Gemini" memberi post zodiak), frasa Indonesia ("pake AI") kosong. Kata Indonesia umum ("gimana", "banget") memberi sampel Threads Indonesia yang benar-benar sedang ramai. Jadi:
- **Radar umum** (tab `Kata Kunci Threads`): mengukur yang hot se-Indonesia tanpa pilihan kita. Isinya kebanyakan bukan AI; yang lolos hanya yang bisa ditarik ke AI dengan jujur.
- **Radar AI** (tab `Akun Threads`): post terbaru akun Indonesia yang membahas AI. Agar tidak bias ke akun besar, hot dinilai relatif terhadap median akun itu sendiri (`rasio` ≥2) plus ambang minimum, dan akun baru masuk dari "post terkait" rekomendasi Threads, bukan pilihan kita.

## 1. Baca sheet
Dalam satu putaran baca: `Kata Kunci Threads` dan `Akun Threads` (status `aktif`), tab `Threads` kolom C (link yang sudah pernah diproses, untuk anti dobel), dan tab Talking Head. ArchiveTH tidak dibaca penuh: anti dobel lewat query di tab `Cari` (`.claude/skills/arsip/references/baca-arsip-hemat.md`).

## 2. Ambil data (maks ±40 kredit)
Folder kerja di scratchpad. Skrip: `.claude/skills/ide-threads/scripts/threads.py` (jalankan dengan `python3 -I`). Satu file hasil dipakai ketiga langkah; kredit total tercatat di file dan tiap langkah berhenti sebelum `--budget`.
```bash
S=.claude/skills/ide-threads/scripts/threads.py
python3 -I $S cari  --kata gimana banget ternyata ... --budget 40 --out hasil.json   # radar umum, ±10 kredit
python3 -I $S akun  --akun putstywd ghina.tresna ...  --budget 40 --out hasil.json   # radar AI, ±20 kredit
python3 -I $S balas --kode <kode terpilih...>  --budget 40 --out hasil.json          # bedah balasan, ±10 kredit
```
- Urutan: `cari` dengan semua kata aktif, lalu `akun` dengan semua akun aktif (bila akun aktif >20, ambil yang `Terakhir dicek` paling lama), lalu **saring topik dulu** (langkah 3) sebelum `balas`, supaya kredit tidak terbuang untuk thread yang pasti dibuang. `balas` hanya untuk 8-12 kandidat terkuat (`--kode` dari kolom kode keluaran skrip).
- Skor: `skor/jam` = (like + 3×balasan + 2×repost) per jam sejak diposting; `rasio` = keterlibatan post / median akunnya (radar AI); `debat` = balasan/like. Hanya post berbahasa Indonesia yang bisa hot. Ambang ada di fungsi `hot()`; ubah bila pengguna meminta.
- `balas` mencatat balasan, menghitung yang berupa pertanyaan ("gimana", "salahnya di mana", "aman nggak"), dan mengumpulkan akun Indonesia soal AI di post terkait sebagai usulan akun baru.

## 3. Saring topik
Kelompokkan post hot jadi **topik** (beberapa post soal hal yang sama = satu topik; topik yang dibahas banyak akun didahulukan). Untuk tiap topik:
- **Buang**: SARA dan tragedi (agama, suku, bencana, kematian, kriminal, kerusuhan), gosip dan drama orang (termasuk menyerang kreator lain), saham dan kripto. **Politik** hanya boleh dari sudut AI (cara kerja AI, deepfake, regulasi AI yang berdampak ke pengguna), tanpa memihak dan tanpa menyebut kandidat atau partai.
- **Sudut AI yang jujur**: topik umum lolos hanya bila AI benar-benar relevan dengan masalahnya, bukan ditempel. Contoh lolos: thread penipuan "ngaku polisi" ramai → cara mengenali modus penipuan, termasuk suara/foto palsu buatan AI; "butuh bantuan urus sosmed usaha" → tutorial AI untuk konten. Contoh gugur: KRL penuh → "AI bisa atur jadwal KRL" (dipaksakan).
- **Anti dobel**: terhadap tab Threads (link sama), Talking Head, dan ArchiveTH.
- Topik yang sudah jadi konten luas di banyak akun AI (mis. "Claude bisa bikin video") tetap boleh bila Aulia punya sudut yang belum ada: cara kerjanya, batas, biaya, atau versi yang lebih praktis.

## 4. Dua jalur
**Jalur cepat** (maks 3 per run): topik yang bergantung pada momen (rilis atau perubahan fitur, limit/harga berubah, insiden, modus baru) dan masih naik (post termuda dalam topik ≤48 jam). Syarat: fakta inti terverifikasi ke sumber primer (dokumentasi, catatan rilis, pengumuman resmi; thread bukan sumber fakta), sudut AI jujur, ada barang bawa pulang. Uji pengguna 1 dan 3 dari syarat kedalaman tidak wajib; anggapan + padahal tetap ditulis. Sumber di sheet `threads-cepat`.
**Jalur normal**: saringan penuh seperti `/ide-konten` (syarat kedalaman tiga uji, syarat produksi). Sumber `threads`.

Untuk tiap ide: Format `tutorial` bila balasan penuh pertanyaan cara ("gimana caranya", "salahnya di mana") atau topiknya alat yang bisa didemokan; selain itu `ucap`. Kolom Anggapan memakai kalimat penonton dari post/balasan (diparafrasekan, tanpa nama orang biasa). Sudut Aul menyebut angka thread-nya ("±11 rb like dalam 11 jam, 571 balasan") dan pertanyaan yang paling sering di balasan.

## 5. Tulis ke sheet (satu panggilan per tab)
- **Talking Head**: maks 8 ide (termasuk jalur cepat), Status `usulan`, Sumber `threads`/`threads-cepat`, Link sumber = URL thread utama, Tanggal pemicu = tanggal post, Status fresh `Fresh` hanya bila padahal-nya juga dari bahan ≤14 hari, kolom Format/Arc/Episode/Peminta diisi (Peminta kosong; itu untuk permintaan ke Aulia).
- **Threads**: semua post hot yang diperiksa (termasuk yang gugur): Tanggal run, Radar, Link, Akun, Diposting, Like, Balasan, Repost, Skor/jam, Rasio akun, Debat, Pertanyaan (jumlah), Topik, Keputusan (`TH-xxx`, `gugur`, atau `pantau`), Alasan (singkat, mis. "SARA", "tidak ada sudut AI", "dobel TH-071").
- **Akun Threads**: perbarui Median keterlibatan dan Terakhir dicek akun yang diambil, tambah Jumlah ide; tambahkan usulan akun baru dari post terkait (Status `usulan`, Asal "post terkait <link>"); akun tanpa post 30 hari → tulis di Catatan "usul matikan" (status diubah pengguna).
- **Kata Kunci Threads**: perbarui Hasil terakhir (jumlah post Indonesia), Terakhir dipakai, Jumlah ide. Kata dengan 0 post Indonesia dua run berturut-turut → Catatan "usul matikan". Kata umum baru boleh diusulkan (`usulan`) bila sering muncul di post hot Indonesia.
- Status `usulan` hanya dipakai setelah pengguna mengubahnya ke `aktif`. Ikuti aturan tulis Sheets di tab-talking-head.md (tanda `'` untuk tanggal dan teks berawalan `=`, `+`, `-`; baca ulang dan cocokkan jumlah baris).

## 6. Jalur cepat → naskah
Jalankan `/naskah` mode naskah untuk ID jalur cepat (lembar fakta lewat `challenge`, asah hook + uji buta, tulis, challenge teknis, review brand). Hook boleh memakai momennya ("Lagi ramai di Threads: ...") selama klaim di hook ada di lembar fakta.
**Atribusi**: screenshot thread boleh jadi bukti layar (`/video-karakter` elemen `shot`, ambil dengan `.claude/skills/video-faceless/scripts/shot.mjs`) dengan handle pembuat terlihat, dan pembuatnya disebut di caption ("via @handle di Threads"). Jangan menampilkan atau mengutip nama balasan dari orang biasa; parafrasekan pertanyaannya.

## 7. Laporkan di chat
1. Tabel topik hot: topik, radar, angka terkuat (like/balasan/jam), sinyal (cepat/debat/pertanyaan), keputusan.
2. Ide yang ditulis per jalur: ID, Format, Hook, alasan hot; untuk jalur cepat, status naskahnya dan tautan baris Naskah.
3. Usulan akun dan kata baru yang menunggu persetujuan, serta usulan mematikan.
4. Kandidat kuat yang gugur beserta alasannya (supaya pengguna bisa menimpa keputusan).
5. Kredit terpakai dan sisa (`credits_remaining` di respons API), tautan sheet.
Tutup dengan: ubah Status ide normal ke `dipilih` lalu jalankan `/naskah`; ubah `usulan` di tab akun/kata ke `aktif` bila setuju.

## Pegangan
- Thread adalah sinyal keramaian, bukan sumber fakta. Fakta selalu dari sumber primer lewat `challenge`.
- Jangan menulis "viral" tanpa angka. Sebut angka dan umurnya.
- Bahasa: saya/Anda, tanpa em dash, tanpa merendahkan pembuat thread atau penonton.
- Bila ScrapeCreators gagal (kredit habis, 4xx), laporkan dan berhenti; jangan mengisi dengan tebakan.
