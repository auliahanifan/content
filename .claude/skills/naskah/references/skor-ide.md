# Skor ide (0-100 per elemen, total tertimbang)

Dipakai oleh `/ide-konten` (skor tahap ide), `/naskah` (skor tahap naskah), dan `/belajar` (kalibrasi). Disepakati dengan Aul, 14 Nov 2026.

## Prinsip
- **Gerbang lama tetap menggugurkan.** Ide yang gagal tiga uji kedalaman, syarat produksi, atau gerbang hook tidak dinilai (tetap `arsip`). Skor hanya mengurutkan ide yang lolos.
- **Total = 0,35 Hook + 0,30 Kedalaman + 0,20 Potensi + 0,15 Produksi.** Bulatkan ke bilangan bulat.
- **Pita total:** ≥80 prioritas, 65-79 layak, <65 tinjau ulang. Pita hanya label; tidak menggugurkan.
- **Patokan kalibrasi:** rasio views Instagram terhadap median 15 post sebelumnya (tab Performa, kolom Rasio), `tembus` ≥3. TikTok tidak dipakai (pola berlawanan dengan IG, data tipis).
- **Label "belum terkalibrasi"** tetap tertera di kolom Tahap sampai ada 20 post IG yang cocok ke ide. Tiap `/belajar` menghitung korelasi peringkat (Spearman) skor Total dengan Rasio, dan melaporkan n. Bobot hanya diubah dengan persetujuan Aul.
- Skor diberi alasan singkat per elemen. Aul boleh menimpa angka langsung di sheet; penimpaan Aul tidak ditimpa balik oleh Claude.

## Kedalaman (5 sub-uji x 20; nilai 0, 5, 10, 15, 20)
1. **Orang pintar pun percaya anggapannya.** 20: ada bukti nyata (komentar, thread, survei) bahwa orang pintar memegangnya. 10: masuk akal tapi tanpa bukti. 0: hanya dipegang orang yang malas berpikir.
2. **Terus kenapa.** 20: tindakan spesifik yang langsung dipakai (aturan satu kalimat, langkah, pengaturan). 10: keputusan umum. 0: informasi saja.
3. **Ohh relevan.** 20: perilaku AI terbukti atau trade-off tersembunyi dengan angka. 10: salah satunya tanpa angka. 0: tidak ada.
4. **Bukti padahal.** 20: sumber primer terbuka, ≤14 hari, atau studi ≤6 bulan. 15: primer lebih lama tapi masih berlaku. 10: sekunder terverifikasi. 5: ada tanda `(belum diverifikasi)`. 0: opini.
5. **Mekanisme "kenapa".** 20: dijelaskan dan ada analogi aman. 10: disebut tanpa penjelasan. 0: tidak ada.

## Hook (0-100)
**Tahap ide: rubrik 100 poin** (dinilai dari satu hook di kolom Hook):
| Butir | Poin |
|---|---|
| Kalimat pertama ≤7 kata = 15; 8-9 kata = 10; >9 kata = 0 | 15 |
| Taruhan atau untung dan benda penonton sudah ada dalam 4 kata pertama (15, 8, 0) | 15 |
| Uji scroll: dari kalimat pertama saja jelas penonton dapat atau terhindar dari apa (15, 8, 0) | 15 |
| Milik penonton: menyebut benda, kebiasaan, atau anggapan dengan "Anda" (15, 8, 0) | 15 |
| Tanpa pemanasan ("Coba tebak", "Jadi gini", "Tahukah Anda"): 10, 5, 0 | 10 |
| Berdasar fakta, tanpa klaim absolut: 10, 5, 0 | 10 |
| Bisa digambar di detik 0-3: 10, 5, 0 | 10 |
| Segmen jelas (siapa yang kena): 10, 5, 0 | 10 |

**Tahap naskah:** 50% rubrik ditambah 50% uji buta. Uji buta per persona: BERHENTI di putaran 1 = 100, putaran 2 = 60, SCROLL = 0. Rata-rata persona Owner dan Pemula AI (bobot sama). Bila uji buta asli tidak tersedia, skor dari label Potensi ditandai `proksi`: Tertinggi 100, Tinggi 85, Tinggi (pemula/umum) 75, Sedang (owner) 50, Rendah 0.

## Produksi (0-100)
- **Waktu kerja Aul** (35): ≤15 menit 35; ≤45 menit 25; ≤90 menit 15; lebih dari itu 5 (butuh hasil tes panjang = CORE, bukan ide cepat).
- **Barang bawa pulang** (25): prompt atau template lengkap di caption 25; langkah bernomor 20; aturan satu kalimat 15; tidak ada 0.
- **Kelayakan penonton** (20): bisa dengan akun gratis 20; paket disebut jelas 15; paket mahal atau region khusus 5.
- **Kesiapan fakta** (20): terverifikasi sampai praktik atau sudah tayang 20; hanya dokumentasi (lolos challenge) 12; ada tanda `(belum diverifikasi)` 4.

## Potensi (0-100)
- **Audiens brand: owner dan pemula AI** (40): seri Bukan Sulap, Garapan Weekend, Nitip, Mas = 40; Katanya Nyatanya dan Sing Murah Wae = 30; AI Umum = 15.
- **Kesegaran** (30): dihitung ulang dari Tanggal pemicu terhadap hari penilaian. ≤7 hari 30; ≤14 hari 25; Evergreen 20; Basi 0.
- **Dorongan sosial** (30): ada Peminta nyata atau voting episode 30; bisa disimpan dan dibagikan kuat 20; salah satunya 15; lemah 5.

## Kolom di tab Talking Head
S Skor Kedalaman, T Skor Hook, U Skor Potensi, V Skor Produksi, W Skor Total, X Tahap Skor (`ide` atau `naskah`, ditambah `belum terkalibrasi` dan `proksi` bila berlaku), Y Skor Diperbarui (`YYYY-MM-DD`), Z Alasan Skor (satu kalimat per elemen).
Ide berstatus `arsip` tidak dinilai. Kolom S sampai Z ikut dipindah oleh `/arsip` (jumlah kolom sumber dan arsip harus sama).
