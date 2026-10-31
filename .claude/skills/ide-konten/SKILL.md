---
name: ide-konten
description: Cari sampai 20 ide talking head Reels yang dalam (pola anggapan → padahal → kenapa) dan low effort untuk personal brand Aulia Rahman, dari sosmed (Reddit, X, Threads), berita AI ≤14 hari, berita bisnis/UMKM Indonesia, kerangka evergreen, dan pertanyaan audiens, lalu tulis ke tab "Talking Head" di Google Sheet content bank. Gunakan ketika pengguna meminta /ide-konten, cari ide konten fresh, atau isi bank talking head. Tidak memakai bank CORE sebagai bahan (itu tugas /naskah mode pecah).
---

# Ide konten fresh

Baca dulu `.claude/skills/naskah/references/tab-talking-head.md` (kolom, syarat kedalaman, syarat low effort, anti dobel, aturan tulis sheet) dan `.claude/skills/aulia-brand/references/brand-rules.md`.

Input: link Google Sheet content bank. Opsional: komentar atau DM audiens yang ditempel pengguna. Jika link tidak diberikan, cari di Drive dan konfirmasi ke pengguna sebelum menulis.

## 1. Baca sheet
Baca tab CORE dan tab Talking Head (untuk anti dobel dan ID terakhir). Jika tab Talking Head belum ada, buat sesuai spesifikasi.

## 2. Kumpulkan bahan
Audiens: owner dan tim kecil yang operasionalnya menyita waktu dan biaya tools terus bertambah. Hari ini dihitung dari tanggal sistem.

Yang dicari bukan berita, tapi **anggapan** yang bisa dibongkar. Untuk setiap bahan, tanyakan: anggapan apa yang dipegang owner soal ini, apa yang sebenarnya terjadi (dengan sumber primer atau hitungan), dan kenapa. Bahan tanpa padahal tidak dipakai, sefresh apa pun. Untuk peluncuran fitur, produk, atau tonggak, padahal boleh berupa **kemampuan baru yang terbukti** ("chat AI cuma teks" → "sekarang bisa jadi kalkulator, formulir, game"). Jangan jadikan celah atau ketiadaan klaim vendor sebagai inti ide kalau fiturnya sendiri menarik; peringatan cukup jadi satu kalimat batas. Di kolom Sudut Aul tulis kemungkinan konkret untuk owner, bukan cuma kewaspadaan.

- **Sosmed:** WebSearch atau Nimble untuk diskusi yang sedang ramai di Reddit (mis. r/smallbusiness, r/Entrepreneur, r/ChatGPT, r/automation), X, dan Threads tentang AI untuk kerja, biaya tools, otomatisasi, dan keluhan operasional. Tanpa login, jadi hasilnya seadanya; jangan klaim sesuatu "viral" tanpa bukti keramaian (jumlah komentar, upvote, atau liputan).
- **Berita AI ≤14 hari:** rilis model/tool, perubahan harga, tool yang ditutup, insiden keamanan. Cari salah paham yang muncul dari berita itu, atau detail di dokumen resmi yang tidak dimuat di judul berita.
- **Berita bisnis/UMKM Indonesia ≤14 hari:** hanya jika beritanya menyentuh cara owner memakai AI (fitur AI marketplace, chatbot, otomatisasi). Regulasi dan pajak murni tidak dipakai.
- **Evergreen:** anggapan umum soal AI dan tool yang bisa dibongkar dengan cara kerjanya (dokumentasi resmi, paper, standar). Bukan saran umum seperti "hitung dulu sebelum…", dan bukan ide yang isinya hanya menjumlah tarif. Hitungan harga lawan manfaat (titik impas dengan waktu atau kualitas) boleh.
- **Audiens:** hanya dari teks yang ditempel pengguna. Jangan mengarang pertanyaan audiens.

Buka sumber sebelum memakai faktanya. Catat URL dan tanggal terbit. Sumber >14 hari hanya boleh jadi Evergreen jika topiknya tidak bergantung pada berita itu.

**Jendela waktu dan cakupan.** Ikuti permintaan pengguna (misalnya "7 hari terakhir", "dari OpenAI dan Meta"); tanpa permintaan, pakai 14 hari dan semua sumber. Bila pengguna menyebut vendor, batasi ke vendor itu.

**Sisir semua kanal tiap vendor.** Halaman berita saja tidak cukup (peluncuran Claude Dashboards 8 Okt terbit di claude.com dan terlewat dari anthropic.com/news). Per vendor cek: blog atau newsroom, halaman riset, catatan rilis aplikasi, changelog developer, halaman harga dan dokumentasi, plus liputan media. Jika sumber primer diblokir (403/404), catat dan tandai `(belum diverifikasi)`; jangan menganggap tidak ada berita. Jika halaman catatan rilis berhenti sebelum akhir jendela, sebutkan tanggal terakhirnya di laporan.

## 3. Saring jadi 20
- Wajib lolos syarat kedalaman dan syarat low effort. Kolom Anggapan dan Padahal wajib terisi.
- Padahal harus sudah dibuka sumbernya di tahap ini; jika belum sempat, tandai `(belum diverifikasi)`. Ide yang padahal-nya ternyata keliru gugur di tahap fakta /naskah.
- **Sumber padahal maksimal 6 bulan.** Padahal dari paper atau riset hanya boleh dari studi yang terbit dalam 6 bulan terakhir; revisi paper lama tidak dihitung baru. Paper lebih tua hanya pendukung. Jika tidak ada studi dalam 6 bulan, ide dibuang, bukan diisi paper lama. Jika studi baru bertentangan atau mempersempit temuan lama, ubah padahal-nya. Sebutkan bulan dan tahun terbit di kolom Padahal, serta batas model yang diuji.
- Status fresh `Fresh` hanya jika padahal-nya juga dari bahan ≤14 hari, bukan cuma pemicunya. Pemicu baru dengan bukti lama ditulis `Evergreen`, pemicunya disebut di Sudut Aul.
- Lebih baik kurang dari 20 ide yang dalam daripada 20 ide yang dangkal. Laporkan jumlah sebenarnya.
- Minimal 1 ide dari setiap sumber yang tersedia jika ada yang lolos kedalaman (audiens hanya jika ada teks yang ditempel).
- Lolos anti dobel terhadap tab CORE dan Talking Head, termasuk baris berstatus `arsip` yang masih ada.
- Hook diambil dari padahal-nya, bukan dari beritanya. Saya/Anda, tanpa em dash, tanpa menakut-nakuti atau klaim absolut, dan tanpa mengklaim pengalaman atau hasil tes.
- Utamakan seri Katanya Nyatanya, Bukan Sulap, dan Sing Murah Wae; jangan 20 ide jatuh di satu seri.
- Wajib lolos tiga uji pengguna di syarat kedalaman; uji 3 punya dua jalur sah (perilaku AI, atau trade-off tersembunyi pada tool AI: tonggak produk dan pemain baru, perubahan cara memakai AI, syarat data dan privasi, harga lawan manfaat). Jangan menolak ide yang jelas masuk salah satu jalur itu hanya karena bukan soal perilaku AI. Variasikan bagian bisnis tempat AI dipakai (pelanggan, inbox dan akses, dokumen, marketing, data dan angka, keputusan owner, pemilihan tool, tim), bukan topik di luar AI.
- Ide yang lolos tipis (sumber primer tidak terbuka, mekanisme belum diverifikasi) tetap boleh ditulis dengan tanda `(belum diverifikasi)` di tempat yang tepat dan disebut di laporan; yang tidak punya padahal sama sekali tetap dibuang.

## 4. Tulis ke sheet
Tulis ke-20 ide sebagai baris baru di tab Talking Head dengan Status `usulan`, dalam satu panggilan. Verifikasi dengan membaca ulang.

## 5. Laporkan di chat
Tabel ringkas yang lolos: ID, Seri, Anggapan, Padahal, Hook; tandai yang lolos tipis dan apa yang belum terverifikasi. Lalu tabel yang difilter: item, tanggal, dan alasan spesifik (duplikat dengan ID mana, di luar jendela, tidak ada padahal, primer tidak terbuka, bukan wilayah owner). Pisahkan kandidat terkuat yang gugur agar pengguna bisa menimpa keputusan. Sebutkan sumber yang tidak menghasilkan ide dan sumber yang tidak bisa dibuka, serta tautan sheet. Tutup dengan: ubah Status ke `dipilih` lalu jalankan `/naskah` untuk menulis naskahnya.
