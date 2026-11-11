# Tab "Talking Head": spesifikasi bersama

Dipakai oleh `/ide-konten` (menulis ide fresh) dan `/naskah` mode pecah (menulis pecahan CORE) serta mode naskah (membaca baris dan memperbarui Status).

## Lokasi
Spreadsheet yang sama dengan bank CORE (link di `CLAUDE.md`). Nama tab: `Talking Head`. Baris lama dipindah ke `ArchiveTH` (dan naskahnya dari `Naskah` ke `ArchiveN`) oleh `/arsip`. Jika tab belum ada, buat dengan `addSheet` lalu tulis baris header dan bekukan baris 1. Jangan pernah mengubah tab CORE.

## Kolom (urutan tetap)
| Kolom | Isi |
|---|---|
| ID | `TH-001`, berurutan. Lanjutkan dari nomor terbesar di tab Talking Head **dan** ArchiveTH, agar ID yang sudah diarsipkan tidak dipakai ulang. Ambil angkanya dengan rumus di tab `Cari`, jangan membaca kolom ID arsip (lihat bagian "Tab arsip"). |
| Tanggal | Tanggal ide dibuat, `YYYY-MM-DD`. |
| Sumber | Salah satu: `CORE#<id>`, `berita AI`, `berita UMKM`, `sosmed`, `evergreen`, `audiens`, `komentar` (komentar/DM di akun Aulia yang ditempel pengguna), `arc` (episode lanjutan sebuah arc), `threads` / `threads-cepat` (dari `/ide-threads`; `-cepat` = jalur reaksi cepat yang langsung dibuatkan naskah) |
| Link sumber | URL yang benar-benar dibuka. Kosong untuk evergreen. Untuk audiens: kutipan singkat pertanyaannya. |
| Tanggal pemicu | Tanggal terbit sumber, `YYYY-MM-DD`. Kosong untuk evergreen. |
| Status fresh | `Fresh` (≤14 hari), `Evergreen`, atau `Basi` |
| Seri | Dari tabel pilar `aulia-brand` (AI Umum, Katanya Nyatanya, Bukan Sulap, Sing Murah Wae, Garapan Weekend, Nitip Mas) |
| Topik | Judul kerja, satu kalimat |
| Anggapan | Anggapan yang dipegang owner atau pemula AI, ditulis seperti mereka mengucapkannya. Untuk tutorial: anggapan soal kemampuan atau biaya ("Harus beli kelas prompt biar hasil AI bagus."). Contoh: "Izin draft berarti AI tidak bisa mengirim email." |
| Padahal | Yang sebenarnya, satu kalimat, harus bisa dibuktikan ke sumber primer. Tandai `(belum diverifikasi)` jika belum dicek. |
| Sudut Aul | Kenapa itu terjadi (mekanismenya), artinya untuk owner, dan pertanyaan yang lebih besar di penutup |
| Hook | Satu hook utama, saya/Anda, ≤15 kata |
| Kenapa bisa viral | Satu kalimat, merujuk pola di checklist viral (kontras, berlawanan arus beralasan, pertanyaan milik penonton, bisa disimpan, pemicu share) |
| Status | `usulan` → `dipilih` → `naskah` → `lolos-challenge` → `rekam` → `posting`, atau `arsip` |
| Format | `ucap` (talking head/faceless tanpa rekam layar) atau `tutorial` (Aulia merekam layar; langkah ditandai `[REKAM: ...]` di naskah) |
| Arc | Nama arc kurikulum bila ide bagian dari seri bersambung (mis. `prompt-dasar`, `agent-pemula`), kosong bila lepas |
| Episode | `<n>/<total>` lalu ID episode sebelumnya dan sesudahnya, mis. `2/5 · ←TH-061 →TH-063`. Kosong bila lepas |
| Peminta | Handle atau nama penonton yang meminta topik ini (dari komentar yang ditempel pengguna), atau kosong. Jangan mengarang |

Kolom Format, Arc, Episode, Peminta ditambahkan November 2026 di sebelah kanan Status (kolom O-R; header sudah ada di sheet sejak 4 Nov 2026). Bila header tab belum punya kolom itu, tulis dulu keempat header-nya di baris 1 (sekali), lalu isi. Jangan menggeser kolom lama.

Ide baru selalu ditulis dengan Status `usulan`. Pengguna yang mengubah ke `dipilih`. `arsip` untuk ide yang gugur di saringan kedalaman. Baris arsip boleh dihapus pengguna kapan saja; setelah dihapus, ide itu tidak lagi ikut dicek anti dobel.

## Syarat kedalaman (wajib untuk setiap ide)
Pola "Behind the AI": anggapan → padahal → kenapa → artinya untuk Anda → pertanyaan yang lebih besar.
- Ada **anggapan** nyata yang dipegang owner, tim, atau pemula AI, bukan sekadar berita. Berita hanya pemicu atau contoh.

Tiga uji pengguna (hasil seleksi Okt 2026: yang lolos TH-002, TH-018, TH-023; yang ditolak antara lain TH-011, TH-012, TH-016). Ide wajib lolos ketiganya:
1. **Orang pintar pun percaya anggapannya.** Anggapan yang hanya dipegang orang yang malas berpikir ("langganan berarti tanpa batas") membuat penonton merasa diremehkan. Buang.
2. **Terus kenapa?** Setelah menonton, ada keputusan atau tindakan penonton yang berubah (model mana, izin apa, apa yang disiapkan, atau **cara baru yang bisa langsung dipraktikkan**). Membedakan istilah boleh bila ditutup dengan aturan memilih yang bisa dipakai ("butuh saran, pakai chatbot; butuh pekerjaan selesai, pakai agent"); istilah tanpa aturan memilih dibuang.
3. **Ada "ohh" yang relevan bagi owner.** Salah satu dari dua jalur:
   - **Perilaku AI:** kenapa-nya menjelaskan cara AI bekerja atau bertingkah, bukan pasal atau statistik survei.
   - **Trade-off tersembunyi pada tool AI:** tonggak produk atau pemain baru (pertama kali, mulai bersaing), perubahan cara memakai AI (misalnya chat jadi interaktif), syarat yang jarang disadari (data dipakai melatih model menurut mode atau paket), atau harga lawan manfaat yang dihitung sampai titik impas dengan nilai waktu atau kualitas. Hitungan biaya boleh jika membandingkan harga dengan manfaat dan mengubah keputusan, bukan sekadar menjumlah tarif.
   Topik di luar AI (pajak, QRIS, kepemilikan akun iklan) tetap bukan wilayah Aul.

Analogi yang paling mengena: AI sebagai staf atau asisten yang diatur owner.
- Ada **padahal** yang mengejutkan dan bisa dibuktikan ke sumber primer, atau ke hitungan yang benar-benar dikerjakan. Padahal yang hanya opini atau saran umum ("hitung dulu", "cek dulu") tidak lolos.
  - **Padahal boleh berupa kemampuan baru**, bukan hanya pembongkaran. Untuk peluncuran fitur atau tonggak produk, anggapan "chat AI cuma teks" dan padahal "sekarang bisa jadi kalkulator, formulir, grafik, game" lolos. Kemungkinan yang terbuka itu bahan utama dan paling menarik bagi penonton.
  - **Ketiadaan klaim vendor** ("OpenAI tidak menyebut akurasi") bukan padahal. Itu paling banyak jadi satu kalimat batas. Jangan jadikan celah sebagai inti ide kalau fiturnya sendiri menarik (pelajaran TH-060).
- Ada **kenapa**: mekanisme di balik padahal itu. Format `ucap`: bisa dijelaskan tanpa layar. Format `tutorial`: kenapa caranya bekerja, satu-dua kalimat, lalu langkahnya.
- Taruhannya terasa bagi owner: uang, kepercayaan pelanggan, data usaha, atau waktu tim. Tanpa menakut-nakuti.
- Membongkar anggapan, bukan merendahkan orang. Anggapan dari pendukung AI, termasuk hitungan Aul sendiri yang keliru, boleh dan bagus dibongkar.

Uji cepat: kalau penonton bisa mendapat isi video hanya dari membaca judul beritanya, ide itu dangkal. Buang atau cari padahal-nya.
- **Sumber terbaru (maksimal 6 bulan).** Padahal dari paper atau riset hanya boleh memakai studi yang terbit dalam 6 bulan terakhir (sesuai AGENTS.md proyek). Revisi paper lama tidak dihitung baru; pakai tanggal terbit asli. Paper lebih tua hanya boleh jadi pendukung, dan temuan yang dibantah atau dipersempit studi baru harus diperbarui. Cantumkan bulan dan tahun terbit serta batas model yang diuji. Jika tidak ada studi dalam 6 bulan untuk suatu klaim, ide itu dibuang, bukan diisi paper lama.
- `Fresh` hanya jika padahal-nya dari bahan ≤14 hari. Pemicu baru dengan bukti lama tetap `Evergreen`.

Prioritas seri: Bukan Sulap, Garapan Weekend (tutorial yang bisa direkam Aulia), Nitip, Mas (permintaan dari komentar), lalu Katanya Nyatanya dan Sing Murah Wae. AI Umum hanya jika ada salah paham yang jelas dari sebuah berita. Nitip, Mas hanya dari komentar/DM nyata yang ditempel pengguna; jangan mengarang permintaan.

## Tab Threads (dari /ide-threads)
`Threads` (log semua thread hot yang diperiksa), `Akun Threads` (akun radar AI), `Kata Kunci Threads` (kata umum radar umum). Kolom dan aturannya di `.claude/skills/ide-threads/SKILL.md`. Link di tab `Threads` ikut dicek untuk anti dobel.

## Tab "Naskah" dan "Fakta"
Semua hasil kerja disimpan di spreadsheet yang sama, bukan di file lokal. Jika tab belum ada, buat dengan header di bawah, bekukan baris 1, dan aktifkan wrap text.

**Naskah**, satu baris per ID. Jika ID sudah ada, timpa barisnya (jangan menambah baris kedua). Jika ID itu hanya ada di `ArchiveN` dan naskahnya ditulis ulang, tulis di tab Naskah lalu sebutkan ke pengguna bahwa versi lama masih di arsip:
| ID | Judul | Naskah teleprompter | Hook cadangan | Caption | Perlu diisi | Sumber | Challenge teknis | Catatan review | Diperbarui | Potensi | Hasil uji |

- Naskah teleprompter: satu ide per baris (baris baru di dalam sel), paragraf dipisah baris kosong.
- Hook cadangan, Perlu diisi, Sumber: daftar bernomor atau `- ` per baris.
- Challenge teknis: `Verdict: ... · Lembar fakta: tab Fakta, topik <slug> · Tanggal: <YYYY-MM-DD>`, lalu perubahan dan "Perlu konfirmasi Aul".

**Fakta**, satu baris per butir, dikelompokkan per topik:
| Topik | # | Jenis | Isi | Sumber | Kutipan bukti | Tingkat | Diperbarui | Status fresh | Dipakai oleh |

- Topik: slug, misalnya `mdr-qris`. Topik dipakai ulang oleh naskah lain.
- Jenis: `judul` (satu baris pembuka per topik, berisi Diperbarui, Status fresh, dan Dipakai oleh), `fakta`, `terbuka` (kemungkinan baru yang sekarang bisa dilakukan owner, wajib untuk berita peluncuran/fitur), `catatan`, `bagian`, `analogi aman`, `analogi dihindari`, `perlu konfirmasi Aul`, `tidak bisa diverifikasi`.
- Kolom Sumber, Kutipan bukti, dan Tingkat hanya diisi untuk Jenis `fakta`.
- Memperbarui topik yang sudah ada: timpa baris topik itu di tempatnya, lalu tambah atau hapus baris seperlunya. Jangan biarkan dua versi topik yang sama.

## Syarat produksi (wajib untuk setiap ide)
- Format `ucap`: bisa diucapkan tanpa layar, demo, atau b-roll. Format `tutorial`: Aulia bisa merekam layarnya dalam ±15 menit kerja, maksimal 9 langkah, dengan akun gratis atau paket yang disebut jelas. Mudah diproduksi, bukan dangkal: syarat kedalaman tetap berlaku.
- Tidak butuh hasil tes panjang. Jika ide hanya kuat dengan hasil tes, itu ide CORE: jangan masukkan.
- Ada **barang bawa pulang**: prompt/template yang ditulis lengkap di caption, langkah yang bisa diikuti, atau satu aturan satu kalimat. Ide yang hanya memotivasi dibuang.
- CTA tidak menjanjikan sesuatu yang belum ada. Default CTA: pertanyaan yang jawabannya jadi bahan episode berikutnya, simpan, atau follow.
- Satu ide utama per video. Durasi mengikuti struktur (tabel durasi di `/naskah`): 45-120 detik.

## Arc (seri bersambung)
Penonton follow karena ada episode berikutnya. Susun ide yang saling menyambung menjadi arc 3-10 episode dari dasar ke praktik (mis. `prompt-dasar`: anatomi prompt → alat pembuat prompt → skill di Claude → skill di Gemini). Tiap episode harus berdiri sendiri bagi penonton baru, tapi menyebut episode sebelumnya dalam satu kalimat dan menjanjikan atau memvoting episode berikutnya. Episode lanjutan yang dipicu komentar ditulis dengan Sumber `komentar` atau `arc`.

## Anti dobel
Sebelum mengusulkan, baca tab Talking Head dan CORE, lalu cek ArchiveTH dengan query kata kunci per kandidat ide (lihat bagian "Tab arsip"); baca penuh hanya baris arsip yang cocok. Jangan usulkan ide yang topik dan sudutnya pada dasarnya sama dengan baris yang sudah ada. Sudut berbeda atas topik yang sama boleh, sebutkan bedanya di "Sudut Aul". (Pengecualian: pecahan CORE memang berasal dari baris CORE, tapi tidak boleh sama dengan pecahan yang sudah ada.)

## Tab arsip (ArchiveTH, ArchiveN)
Arsip bisa berisi ribuan sampai puluhan ribu baris. **Jangan pernah membaca tab arsip secara penuh** (termasuk satu kolom penuh). Pakai query rumus di tab tersembunyi `Cari` sesuai `.claude/skills/arsip/references/baca-arsip-hemat.md`: ID terbesar, anti dobel per kata kunci, dan cari baris dari ID. Lalu baca hanya baris yang cocok.

## Aturan tulis Google Sheets
- Butuh konektor **Google Sheets** (bukan hanya Drive). Muat dengan ToolSearch "google sheets". Jika tidak ada, berhenti dan minta pengguna mengaktifkannya; jangan membuat file baru sebagai pengganti.
- Baca skill `google-workspace` dan `references/sheets.md`-nya sebelum menulis pertama kali.
- Baca ulang tab tepat sebelum menulis untuk menentukan ID terakhir dan baris kosong berikutnya.
- Kedua alat tulis mem-parse input seperti UI. Awali dengan `'` setiap sel yang bisa salah terbaca: Hook atau Topik yang diawali `=`, `+`, `-`, atau angka; dan tanggal agar tetap teks `YYYY-MM-DD`.
- Sel yang diawali `- ` (misalnya daftar) juga perlu `'` di depannya, karena kalau tidak akan terbaca sebagai rumus.
- Tulis semua baris baru dalam satu panggilan. Setelah menulis, baca lagi dan cocokkan jumlah baris serta ID. Untuk teks panjang (tab Naskah dan Fakta), cocokkan jumlah karakter: tulis sementara `=SUMPRODUCT(LEN(<rentang>))` di sel kosong, bandingkan dengan hitungan lokal, lalu hapus selnya.
