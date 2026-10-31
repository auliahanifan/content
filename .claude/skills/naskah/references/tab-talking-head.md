# Tab "Talking Head": spesifikasi bersama

Dipakai oleh `/ide-konten` (menulis ide fresh) dan `/naskah` mode pecah (menulis pecahan CORE) serta mode naskah (membaca baris dan memperbarui Status).

## Lokasi
Spreadsheet yang sama dengan bank CORE. Nama tab: `Talking Head`. Jika tab belum ada, buat dengan `addSheet` lalu tulis baris header dan bekukan baris 1. Jangan pernah mengubah tab CORE.

## Kolom (urutan tetap)
| Kolom | Isi |
|---|---|
| ID | `TH-001`, berurutan. Lanjutkan dari nomor terbesar yang ada di tab. |
| Tanggal | Tanggal ide dibuat, `YYYY-MM-DD`. |
| Sumber | Salah satu: `CORE#<id>`, `berita AI`, `berita UMKM`, `sosmed`, `evergreen`, `audiens` |
| Link sumber | URL yang benar-benar dibuka. Kosong untuk evergreen. Untuk audiens: kutipan singkat pertanyaannya. |
| Tanggal pemicu | Tanggal terbit sumber, `YYYY-MM-DD`. Kosong untuk evergreen. |
| Status fresh | `Fresh` (≤14 hari), `Evergreen`, atau `Basi` |
| Seri | Dari tabel pilar `aulia-brand` (AI Umum, Katanya Nyatanya, Bukan Sulap, Sing Murah Wae, Garapan Weekend, Nitip Mas) |
| Topik | Judul kerja, satu kalimat |
| Anggapan | Anggapan yang dipegang owner, ditulis seperti mereka mengucapkannya. Contoh: "Izin draft berarti AI tidak bisa mengirim email." |
| Padahal | Yang sebenarnya, satu kalimat, harus bisa dibuktikan ke sumber primer. Tandai `(belum diverifikasi)` jika belum dicek. |
| Sudut Aul | Kenapa itu terjadi (mekanismenya), artinya untuk owner, dan pertanyaan yang lebih besar di penutup |
| Hook | Satu hook utama, saya/Anda, ≤15 kata |
| Kenapa bisa viral | Satu kalimat, merujuk pola di checklist viral (kontras, berlawanan arus beralasan, pertanyaan milik penonton, bisa disimpan, pemicu share) |
| Status | `usulan` → `dipilih` → `naskah` → `lolos-challenge` → `rekam` → `posting`, atau `arsip` |

Ide baru selalu ditulis dengan Status `usulan`. Pengguna yang mengubah ke `dipilih`. `arsip` untuk ide yang gugur di saringan kedalaman. Baris arsip boleh dihapus pengguna kapan saja; setelah dihapus, ide itu tidak lagi ikut dicek anti dobel.

## Syarat kedalaman (wajib untuk setiap ide)
Pola "Behind the AI": anggapan → padahal → kenapa → artinya untuk Anda → pertanyaan yang lebih besar.
- Ada **anggapan** nyata yang dipegang owner atau tim, bukan sekadar berita. Berita hanya pemicu atau contoh.

Tiga uji pengguna (hasil seleksi Okt 2026: yang lolos TH-002, TH-018, TH-023; yang ditolak antara lain TH-011, TH-012, TH-016). Ide wajib lolos ketiganya:
1. **Orang pintar pun percaya anggapannya.** Anggapan yang hanya dipegang orang yang malas berpikir ("langganan berarti tanpa batas") membuat penonton merasa diremehkan. Buang.
2. **Terus kenapa?** Setelah menonton, ada keputusan owner yang berubah (model mana, izin apa, apa yang disiapkan sebelum memasang AI). Pengetahuan istilah tanpa keputusan ("bedanya workflow dan agent") dibuang.
3. **Ada "ohh" yang relevan bagi owner.** Salah satu dari dua jalur:
   - **Perilaku AI:** kenapa-nya menjelaskan cara AI bekerja atau bertingkah, bukan pasal atau statistik survei.
   - **Trade-off tersembunyi pada tool AI:** tonggak produk atau pemain baru (pertama kali, mulai bersaing), perubahan cara memakai AI (misalnya chat jadi interaktif), syarat yang jarang disadari (data dipakai melatih model menurut mode atau paket), atau harga lawan manfaat yang dihitung sampai titik impas dengan nilai waktu atau kualitas. Hitungan biaya boleh jika membandingkan harga dengan manfaat dan mengubah keputusan, bukan sekadar menjumlah tarif.
   Topik di luar AI (pajak, QRIS, kepemilikan akun iklan) tetap bukan wilayah Aul.

Analogi yang paling mengena: AI sebagai staf atau asisten yang diatur owner.
- Ada **padahal** yang mengejutkan dan bisa dibuktikan ke sumber primer, atau ke hitungan yang benar-benar dikerjakan. Padahal yang hanya opini atau saran umum ("hitung dulu", "cek dulu") tidak lolos.
  - **Padahal boleh berupa kemampuan baru**, bukan hanya pembongkaran. Untuk peluncuran fitur atau tonggak produk, anggapan "chat AI cuma teks" dan padahal "sekarang bisa jadi kalkulator, formulir, grafik, game" lolos. Kemungkinan yang terbuka itu bahan utama dan paling menarik bagi penonton.
  - **Ketiadaan klaim vendor** ("OpenAI tidak menyebut akurasi") bukan padahal. Itu paling banyak jadi satu kalimat batas. Jangan jadikan celah sebagai inti ide kalau fiturnya sendiri menarik (pelajaran TH-060).
- Ada **kenapa**: mekanisme di balik padahal itu, yang bisa dijelaskan tanpa layar.
- Taruhannya terasa bagi owner: uang, kepercayaan pelanggan, data usaha, atau waktu tim. Tanpa menakut-nakuti.
- Membongkar anggapan, bukan merendahkan orang. Anggapan dari pendukung AI, termasuk hitungan Aul sendiri yang keliru, boleh dan bagus dibongkar.

Uji cepat: kalau penonton bisa mendapat isi video hanya dari membaca judul beritanya, ide itu dangkal. Buang atau cari padahal-nya.
- **Sumber terbaru (maksimal 6 bulan).** Padahal dari paper atau riset hanya boleh memakai studi yang terbit dalam 6 bulan terakhir (sesuai AGENTS.md proyek). Revisi paper lama tidak dihitung baru; pakai tanggal terbit asli. Paper lebih tua hanya boleh jadi pendukung, dan temuan yang dibantah atau dipersempit studi baru harus diperbarui. Cantumkan bulan dan tahun terbit serta batas model yang diuji. Jika tidak ada studi dalam 6 bulan untuk suatu klaim, ide itu dibuang, bukan diisi paper lama.
- `Fresh` hanya jika padahal-nya dari bahan ≤14 hari. Pemicu baru dengan bukti lama tetap `Evergreen`.

Prioritas seri: Katanya Nyatanya, Bukan Sulap, dan Sing Murah Wae. AI Umum hanya jika ada salah paham yang jelas dari sebuah berita. Garapan Weekend dan Nitip, Mas berasal dari pekerjaan nyata Aul; jangan diisi tanpa bahan dari pengguna.

## Tab "Naskah" dan "Fakta"
Semua hasil kerja disimpan di spreadsheet yang sama, bukan di file lokal. Jika tab belum ada, buat dengan header di bawah, bekukan baris 1, dan aktifkan wrap text.

**Naskah**, satu baris per ID. Jika ID sudah ada, timpa barisnya (jangan menambah baris kedua):
| ID | Judul | Naskah teleprompter | Hook cadangan | Caption | Perlu diisi | Sumber | Challenge teknis | Catatan review | Diperbarui  Potensi | Hasil uji |

- Naskah teleprompter: satu ide per baris (baris baru di dalam sel), paragraf dipisah baris kosong.
- Hook cadangan, Perlu diisi, Sumber: daftar bernomor atau `- ` per baris.
- Challenge teknis: `Verdict: ... · Lembar fakta: tab Fakta, topik <slug> · Tanggal: <YYYY-MM-DD>`, lalu perubahan dan "Perlu konfirmasi Aul".

**Fakta**, satu baris per butir, dikelompokkan per topik:
| Topik | # | Jenis | Isi | Sumber | Kutipan bukti | Tingkat | Diperbarui | Status fresh | Dipakai oleh |

- Topik: slug, misalnya `mdr-qris`. Topik dipakai ulang oleh naskah lain.
- Jenis: `judul` (satu baris pembuka per topik, berisi Diperbarui, Status fresh, dan Dipakai oleh), `fakta`, `terbuka` (kemungkinan baru yang sekarang bisa dilakukan owner, wajib untuk berita peluncuran/fitur), `catatan`, `bagian`, `analogi aman`, `analogi dihindari`, `perlu konfirmasi Aul`, `tidak bisa diverifikasi`.
- Kolom Sumber, Kutipan bukti, dan Tingkat hanya diisi untuk Jenis `fakta`.
- Memperbarui topik yang sudah ada: timpa baris topik itu di tempatnya, lalu tambah atau hapus baris seperlunya. Jangan biarkan dua versi topik yang sama.

## Syarat lolos "low effort" (wajib untuk setiap ide)
- Bisa diucapkan tanpa layar, demo, atau b-roll. Low effort berarti mudah direkam, bukan dangkal: syarat kedalaman tetap berlaku.
- Tidak butuh hasil tes. Jika ide hanya kuat dengan hasil tes, itu ide CORE: jangan masukkan.
- CTA tidak menjanjikan sesuatu yang belum ada (lead magnet, tabel hasil tes). Default CTA: simpan, follow, atau pertanyaan untuk komentar.
- Satu ide utama per video, 45-75 detik.

## Anti dobel
Sebelum mengusulkan, baca tab Talking Head dan tab CORE. Jangan usulkan ide yang topik dan sudutnya pada dasarnya sama dengan baris yang sudah ada. Sudut berbeda atas topik yang sama boleh, sebutkan bedanya di "Sudut Aul". (Pengecualian: pecahan CORE memang berasal dari baris CORE, tapi tidak boleh sama dengan pecahan yang sudah ada.)

## Aturan tulis Google Sheets
- Butuh konektor **Google Sheets** (bukan hanya Drive). Muat dengan ToolSearch "google sheets". Jika tidak ada, berhenti dan minta pengguna mengaktifkannya; jangan membuat file baru sebagai pengganti.
- Baca skill `google-workspace` dan `references/sheets.md`-nya sebelum menulis pertama kali.
- Baca ulang tab tepat sebelum menulis untuk menentukan ID terakhir dan baris kosong berikutnya.
- Kedua alat tulis mem-parse input seperti UI. Awali dengan `'` setiap sel yang bisa salah terbaca: Hook atau Topik yang diawali `=`, `+`, `-`, atau angka; dan tanggal agar tetap teks `YYYY-MM-DD`.
- Sel yang diawali `- ` (misalnya daftar) juga perlu `'` di depannya, karena kalau tidak akan terbaca sebagai rumus.
- Tulis semua baris baru dalam satu panggilan. Setelah menulis, baca lagi dan cocokkan jumlah baris serta ID. Untuk teks panjang (tab Naskah dan Fakta), cocokkan jumlah karakter: tulis sementara `=SUMPRODUCT(LEN(<rentang>))` di sel kosong, bandingkan dengan hitungan lokal, lalu hapus selnya.
