---
name: belajar
description: Belajar dari konten Aulia Rahman yang sudah diposting. Tarik angka performa tiap post (Buffer, ScrapeCreators, atau angka yang ditempel pengguna), hubungkan ke baris Talking Head/Naskah (seri, format, pola hook, potensi hasil uji buta), bandingkan dengan median akun, lalu simpulkan apa yang berhasil, apa yang tidak, dan kenapa. Hasilnya ditulis ke tab "Performa" dan "Pelajaran" di Google Sheet content bank, dan pelajaran yang aktif dibaca oleh /ide-konten dan /naskah. Gunakan ketika pengguna meminta /belajar, evaluasi konten, review performa, apa yang works dan tidak works, kenapa video ini flop atau tembus, atau menempelkan views untuk dianalisis.
---

# Belajar dari konten yang sudah tayang

Tujuan: mengubah angka post menjadi aturan yang memperbaiki naskah berikutnya. Bukan laporan analitik. Setiap temuan harus berakhir sebagai satu dari tiga hal: aturan baru, aturan yang diubah, atau "belum cukup data".

Baca dulu [tab-performa-pelajaran.md](references/tab-performa-pelajaran.md) (kolom, tingkat bukti, aturan tulis). Sheet: content bank di `CLAUDE.md`. Tab arsip jangan dibaca penuh; pakai `.claude/skills/arsip/references/baca-arsip-hemat.md`.

## Input
- `/belajar`: semua post yang tayang 3-45 hari lalu dan belum tercatat di `Performa`.
- `/belajar <hari>`: jendela berbeda (umur post minimal 3 hari, supaya angka sudah stabil).
- `/belajar <TH-xxx>`: satu naskah (diagnosis mendalam, lihat tahap 5).
- `/belajar rangkum`: tidak menarik data baru, hanya menyusun ulang `Pelajaran` dari `Performa` yang sudah ada.
- Pengguna boleh menempelkan angka sendiri (tangkapan layar insight, tabel, CSV). Itu sumber yang sah dan menang atas hasil tarikan bila berbeda.

## 1. Kumpulkan post dan angkanya
Urutan sumber, berhenti di yang memberi angka cukup:
1. **Buffer** (muat dengan ToolSearch "buffer"): `get_account` → `list_channels` → `list_posts` status terkirim di jendela → `get_post` untuk metrik per post, `get_aggregated_post_metrics` untuk rata-rata kanal. Jangan menebak channel ID. Sebut nama organisasi dan kanal yang dipakai.
2. **ScrapeCreators** (skill `scrapecreators-api`) untuk akun Instagram/TikTok Aulia bila Buffer tidak punya angka tontonan, atau untuk akun pembanding. Handle diambil dari Buffer; jika tidak ada, tanyakan sekali.
3. **Angka dari pengguna.**

Catat per post: tanggal-jam tayang, platform, link, durasi, views/plays, reach, like, komentar, share, simpan, rata-rata durasi tonton, retensi 3 detik, persentase tonton sampai habis, follow dari post. Metrik yang tidak disediakan platform dibiarkan kosong, jangan diisi perkiraan. Angka beda antar platform tidak dijumlahkan; satu video yang tayang di Reels dan TikTok jadi dua baris.

Jangan menarik komentar penuh di tahap ini. Bila pengguna ingin tahu *kenapa* orang bereaksi, lanjutkan dengan skill `comment-mining` pada post yang dipilih.

## 2. Hubungkan post ke naskahnya
Tanpa hubungan ke naskah, angka tidak bisa jadi pelajaran. Cocokkan tiap post ke ID `TH-xxx`:
- Cocokkan kalimat pertama caption/hook dengan kolom Hook, Hook cadangan, dan Judul di tab Naskah dan Talking Head lewat tab `Cari` (rumus `MATCH`/`SEARCH`, hemat token; yang sudah diarsipkan dicari di `ArchiveTH`/`ArchiveN` dengan cara yang sama).
- Folder video di `dates/<tanggal>/<slug>/` (storyboard, versi v2/v3) menjelaskan gaya visual, durasi, dan versi.
- Yang tidak ketemu: tampilkan daftar dan minta pengguna menyebut ID-nya. Jangan menebak. Post tanpa naskah di sheet tetap dicatat dengan atribut yang bisa dibaca dari video itu sendiri.
- Hook yang dipakai di post bisa hook cadangan (uji A/B). Catat hook *yang benar-benar tayang*, bukan hook utama di sheet.

Atribut yang dicatat per post (dari sheet dan folder video): Seri, Format (`ucap`/`tutorial`/`faceless-kanvas`/`game`), Sumber ide, Status fresh, Pola hook (nomor pola di `naskah`), Struktur naskah, Potensi hasil uji buta, Arc dan episode, Peminta (Nitip, Mas), ada CTA kata kunci atau tidak, hari dan jam tayang.

## 3. Nilai relatif terhadap akun sendiri
Views mentah menyesatkan karena akun tumbuh dan platform berbeda. Nilai tiap post terhadap **median 15 post sebelumnya di platform yang sama** (bukan rata-rata; satu post tembus merusak rata-rata).

| Rasio views ÷ median | Tingkat |
|---|---|
| ≥ 3 | `tembus` (sejalan dengan patokan di `naskah`) |
| 1,5 sampai < 3 | `baik` |
| 0,67 sampai < 1,5 | `biasa` |
| < 0,67 | `rendah` |

Bila akun punya kurang dari 8 post sebelumnya, tulis tingkatnya sebagai `dugaan` dan jangan menyimpulkan lebih dari "arah awal".

Selain views, hitung yang menjelaskan *kenapa*:
- **Tahan 3 detik** (jika ada) → kualitas hook.
- **Rata-rata durasi tonton ÷ durasi video** dan **selesai ditonton** → kualitas tubuh naskah dan tempo.
- **Share dan simpan per 1.000 views** → nilai bawa pulang (simpan) dan pemicu bagikan (share). Ini lebih penting daripada like untuk akun edukasi.
- **Follow per 1.000 views** → apakah isinya membuat orang mau menunggu video berikutnya.
- **Komentar per 1.000 views**, dan apakah isinya pertanyaan lanjutan atau permintaan (bahan `/ide-konten`).

## 4. Cari pola, dengan disiplin
Bandingkan kelompok, satu atribut sekali, memakai tingkat dan metrik di atas.

Aturan supaya tidak menipu diri sendiri:
1. **Ukuran sampel menentukan bahasa.** n ≥ 5 per kelompok dan arah sama: `terbukti`. n = 3-4: `indikasi`. n ≤ 2: `dugaan`, hanya dicatat. Jangan menulis aturan dari satu post, termasuk satu post yang tembus.
2. **Satu atribut berubah sekali.** Kalau post tembus juga topiknya sedang ramai, formatnya baru, dan tayang Jumat malam, jangan klaim format yang menyebabkannya. Tulis semua pembaur yang ada di kolom Catatan. Pasangan yang bisa dibandingkan lurus (isi sama, hook beda; hook sama, visual beda; naskah yang sama diposting ulang) bernilai lebih daripada puluhan perbandingan lintas topik.
3. **Pisahkan jangkauan dan retensi.** Views rendah dengan tahan 3 detik tinggi dan selesai ditonton tinggi berarti isinya bagus tetapi tidak sampai ke orang (topik, waktu, distribusi). Views rendah dengan tahan 3 detik rendah berarti hook. Tahan 3 detik tinggi tetapi selesai ditonton rendah berarti hook menjanjikan hal yang tidak dibayar tubuh naskah.
4. **Topik tidak sama dengan eksekusi.** Sebelum menyalahkan hook atau visual pada post yang gagal, cek apakah topiknya memang tidak dikenal penonton (pelajaran dari akun pembanding: isi serupa, topik kurang akrab, 19 ribu vs 1,46 juta views).
5. **Uji prediksi.** Bandingkan `Potensi` hasil uji buta dengan hasil nyata. Jika `Tertinggi`/`Tinggi` sering `rendah`, uji butanya perlu dikoreksi (laporkan, jangan diam-diam diabaikan). Jika `Rendah` sering `baik`, ada sinyal yang belum ditangkap uji buta.
6. **Regresi ke rata-rata.** Satu tembus biasanya diikuti hasil biasa. Jangan mengubah strategi setelah satu post, naik atau turun.
7. **Jangan menyalin yang menang secara mekanis.** Pelajaran ditulis sebagai *mekanisme* ("hook yang menyebut benda milik penonton ditonton lebih lama"), bukan resep permukaan ("selalu pakai angka di hook").
8. **Yang gagal juga dicatat sebagai pelajaran**, dengan tingkat bukti yang sama. Termasuk aturan lama di skill lain yang ternyata tidak terbukti.

Hasil tahap ini per perbandingan: kelompok A vs B, n masing-masing, selisih median rasio, metrik yang menjelaskan, pembaur, tingkat bukti.

## 5. Diagnosis satu naskah (`/belajar <TH-xxx>` atau post yang mencolok)
Untuk satu post tembus atau gagal, tulis:
- **Corong:** jangkauan → tahan 3 detik → durasi tonton → selesai → aksi (share/simpan/follow/komentar). Tunjuk satu titik patah terbesar dibanding median akun.
- **Penyebab paling mungkin**, urut peluang, dengan bukti dari naskah/video (hook yang tayang, kalimat tempat orang berhenti bila grafik retensi tersedia, panjang, tempo, tutup).
- **Apa yang diuji ulang**: satu perubahan tunggal (hook lain, topik sama; potong 15 detik; gaya visual lain) dan di naskah mana. Naskah yang tembus diproduksi ulang dalam 1-2 minggu dengan visual berbeda (aturan di `naskah`).

## 6. Tulis ke sheet
Dalam satu panggilan per tab (pola tulis di referensi):
- **Performa**: satu baris per post per platform. Post yang sudah tercatat diperbarui angkanya, tidak diduplikasi (cocokkan dengan link).
- **Pelajaran**: satu baris per aturan. Aturan yang sudah ada diperbarui (tambah bukti, ubah tingkat, atau tandai `gugur`), jangan membuat baris kembar. Aturan baru dari `dugaan` tidak masuk ke yang dibaca skill lain sampai naik ke `indikasi`.
- Jangan mengubah tab lain. Status baris Talking Head menjadi `posting` hanya bila pengguna menyatakan sudah tayang dan baris itu belum berstatus tersebut.

## 7. Laporan di chat
Jangan mengulang seluruh tabel. Urutan:
1. **Satu paragraf inti**: apa yang paling jelas berhasil dan paling jelas tidak, dalam bahasa biasa.
2. **Yang berhasil / yang tidak**: masing-masing maksimal 3-5 poin, tiap poin berisi pola, bukti (n dan selisih), tingkat bukti, dan satu kalimat mekanisme. Poin `dugaan` dipisah di bawah "Masih dugaan".
3. **Post tembus dan post terendah**: ID, hook yang tayang, rasio, titik patah corong.
4. **Kalibrasi uji buta**: cocok atau meleset, dengan angkanya.
5. **Perubahan yang diusulkan** untuk `/naskah` dan `/ide-konten`, dan yang perlu diputuskan pengguna (mengubah aturan yang tertulis di skill lain butuh persetujuan pengguna; skill ini hanya mengusulkan).
6. **Tes berikutnya**: maksimal tiga, masing-masing satu variabel.
7. Data yang kurang (metrik yang tidak tersedia, post tanpa naskah, sampel kecil) dan tautan sheet.

Nada laporan: apa adanya. Kalau datanya belum cukup untuk menyimpulkan, katakan itu dan jangan mengisi dengan cerita yang masuk akal.

## Batas
- Jangan mengarang angka, retensi, atau komentar. Metrik yang tidak ada ditulis kosong.
- Jangan membuka akun orang lain untuk menarik data pribadi; akun pembanding hanya data publik.
- Jangan memasang label konten AI saat membahas posting Instagram lewat Buffer (aturan proyek) dan jangan menjadwalkan atau mengedit post dari skill ini. Skill ini hanya membaca.
