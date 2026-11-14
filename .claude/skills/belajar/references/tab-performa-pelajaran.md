# Tab "Performa" dan "Pelajaran": spesifikasi

Spreadsheet yang sama dengan content bank (link di `CLAUDE.md`). Jika tab belum ada, buat dengan `addSheet`, tulis header, bekukan baris 1, aktifkan wrap text pada kolom teks panjang. Jangan mengubah tab lain.

## Performa (satu baris per post per platform)
| Kolom | Isi |
|---|---|
| Link | URL post. Kunci pembaruan: link yang sama = baris yang sama. |
| ID | `TH-xxx` naskahnya, kosong bila tidak ada di sheet |
| Platform | `instagram`, `tiktok`, `youtube`, `threads`, dst. |
| Tayang | `YYYY-MM-DD HH:MM` zona Asia/Jakarta |
| Diukur | Tanggal angka ditarik, `YYYY-MM-DD` (angka berubah seiring waktu) |
| Hook tayang | Kalimat hook yang benar-benar dipakai |
| Seri | Dari tabel pilar `aulia-brand` |
| Format | `ucap`, `tutorial`, `faceless-kanvas`, `game` |
| Pola hook | Nomor pola di `naskah` |
| Potensi | Salin dari tab Naskah (`Tertinggi`/`Tinggi`/`Sedang (owner)`/`Rendah`), kosong bila tidak ada |
| Durasi (dtk) | Panjang video |
| Views | |
| Reach | |
| Tahan 3 dtk (%) | Kosong bila platform tidak menyediakan |
| Rata-rata tonton (dtk) | |
| Selesai ditonton (%) | |
| Like | |
| Komentar | |
| Share | |
| Simpan | |
| Follow | |
| Median acuan | Median views 15 post sebelumnya di platform yang sama |
| Rasio | Views ÷ Median acuan, 2 desimal |
| Tingkat | `tembus` / `baik` / `biasa` / `rendah`, atau `dugaan` bila acuan < 8 post |
| Share/1k | Share per 1.000 views |
| Simpan/1k | |
| Follow/1k | |
| Titik patah | Satu kata: `jangkauan`, `hook`, `tubuh`, `aksi`, atau kosong |
| Catatan | Pembaur (topik sedang ramai, format baru, jam tayang tidak biasa, pasangan uji A/B, repost) |

Angka yang tidak tersedia dikosongkan, bukan 0.

## Pelajaran (satu baris per aturan)
| Kolom | Isi |
|---|---|
| Kode | `PL-001`, berurutan |
| Pelajaran | Satu kalimat, ditulis sebagai mekanisme dan arah tindakan ("Hook yang menyebut benda milik penonton menahan lebih lama; pakai di naskah risiko.") |
| Jenis | `berhasil`, `gagal`, atau `kalibrasi` (tentang uji buta/potensi) |
| Berlaku untuk | Seri/format/struktur yang terkena, atau `semua` |
| Bukti | Ringkas: kelompok A vs B, n, selisih median rasio, metrik penjelas, ID contoh |
| n | Jumlah post terkuat dari bukti |
| Tingkat | `dugaan` (n ≤ 2), `indikasi` (n 3-4), `terbukti` (n ≥ 5, arah konsisten), atau `gugur` |
| Pembaur | Hal lain yang bisa menjelaskan hasil yang sama |
| Dipakai oleh | `naskah`, `ide-konten`, `video-karakter`, atau kosong |
| Dibuat | `YYYY-MM-DD` |
| Diperbarui | `YYYY-MM-DD` |
| Tes berikutnya | Satu perubahan tunggal yang akan menguji aturan ini, atau kosong |

Aturan baris:
- Hanya `indikasi` dan `terbukti` yang dibaca skill lain. `dugaan` hanya catatan sampai buktinya bertambah.
- Aturan yang ternyata keliru tidak dihapus: ubah Tingkat ke `gugur` dan tulis alasannya di Bukti, supaya tidak ditemukan ulang dan dipercaya lagi.
- Aturan yang bertentangan dengan teks di skill lain (`aulia-brand`, `naskah`) tidak mengubah skill itu. Laporkan ke pengguna sebagai usulan.
- Maksimal sekitar 30 aturan aktif. Jika lebih, gabungkan yang mirip atau gugurkan yang paling lemah.

## Cara skill lain membaca
- `/ide-konten` dan `/naskah` membaca baris Pelajaran berstatus `indikasi`/`terbukti` yang kolom Dipakai oleh-nya menyebut skill itu, sebelum menyaring ide atau menulis hook. Hanya itu; jangan membaca tab Performa penuh.
- Aturan dipakai sebagai kecenderungan, bukan larangan. Ide atau hook yang bertentangan dengan aturan `indikasi` boleh tetap dipakai sebagai uji, dan harus ditandai di Catatan agar `/belajar` bisa menilainya.
