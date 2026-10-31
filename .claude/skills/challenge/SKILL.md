---
name: challenge
description: Jaminan kualitas teknis naskah konten Aulia Rahman. Dua tahap. "fakta": sebelum menulis, ahli AI dan teknologi yang skeptis menyusun lembar fakta terverifikasi ke sumber primer (dokumentasi resmi, regulasi asli, paper, OWASP/NIST) sekaligus status freshness. "cek": sesudah menulis, memastikan setiap fakta di naskah ada di lembar fakta dan menilai penalaran serta analogi seperti penonton ahli. Gunakan ketika pengguna meminta /challenge, fact-check, cek teknis, atau koreksi naskah; dipanggil otomatis oleh /naskah sebelum dan sesudah menulis.
---

# Challenge

Tujuan: tidak ada kesalahan teknis atau fakta di naskah yang tayang. Caranya mencegah, bukan hanya mendeteksi: fakta diverifikasi **sebelum** menulis, dan penulis hanya boleh memakai fakta yang sudah diverifikasi. Challenge menilai kebenaran, bukan nada (itu tugas `aulia-brand`).

## Pemakaian
- `/challenge fakta <TH-xxx...>`: tahap fakta saja (dipanggil `/naskah` sebelum menulis).
- `/challenge cek <TH-xxx...>`: tahap cek saja (dipanggil `/naskah` sesudah menulis).
- `/challenge <TH-xxx...>`: untuk naskah yang sudah ada. Susun lembar fakta dari klaim di naskah (jika belum ada), lalu jalankan tahap cek dan terapkan koreksinya.

Semua ada di Google Sheet content bank: ide di tab Talking Head, naskah di tab Naskah, lembar fakta di tab Fakta (kolom dan aturan tulis di `.claude/skills/naskah/references/tab-talking-head.md`). Jangan menyimpan file lokal. Subagent tidak menulis ke sheet: ia mengembalikan lembar fakta dan hasil cek dalam laporannya, lalu sesi utama yang menulis ke sheet. Saat memanggil subagent, sertakan isi naskah dan lembar fakta yang relevan dari sheet di prompt-nya.

Kedua tahap dijalankan lewat subagent `model: opus`, terpisah dari penulis naskah. Maksimal 5 ide atau naskah per subagent; batch lebih besar dibagi ke beberapa subagent paralel. Sertakan instruksi tahap yang relevan di bawah secara utuh.

## Tahap fakta (sebelum menulis)

Sebelum membuat lembar baru, cek tab Fakta: jika sudah ada topik yang sama, pakai ulang. Fakta berbasis berita di lembar lama diverifikasi ulang jika tanggal "Diperbarui" lebih dari 14 hari.

Instruksi subagent:

> Anda ahli AI, teknologi, dan regulasi digital Indonesia yang skeptis. Untuk setiap ide (topik, sudut, hook, link sumber dari sheet), susun lembar fakta: daftar klaim yang boleh dipakai penulis naskah, masing-masing terverifikasi. Jangan menulis naskah.
>
> 1. Verifikasi **padahal** di sheet lebih dulu: benar, sebagian benar, atau keliru. Lalu cari mekanisme di baliknya (kenapa itu terjadi) dari sumber primer, karena itu bagian terpanjang naskah. Jika menemukan padahal yang lebih kuat atau lebih mengejutkan untuk anggapan yang sama, catat sebagai usulan. Setelah itu tentukan fakta lain yang dibutuhkan, termasuk fakta teknis dasar yang akan dijelaskan (misalnya cara kerja token, prompt injection). Jika ada hitungan, kerjakan hitungannya dan tulis langkahnya.
> 1a. **Berita peluncuran, fitur, atau tonggak produk:** jangan berhenti di celah atau risiko. Susun dulu daftar **kemungkinan yang terbuka**: apa yang sekarang bisa dilakukan owner yang sebelumnya tidak bisa, contoh resmi dari vendor (sebut lengkap, bukan satu), siapa yang kebagian dan kapan (paket, negara), dan syarat pemakaian. Ketiadaan klaim vendor (misalnya "tidak menyebut akurasi") hanya satu butir `catatan`/batas, bukan padahal utama; padahal utama untuk berita seperti ini adalah kemampuan baru yang terbukti ke sumber primer. Jika daftar kemungkinan lebih dari 3 butir, urutkan dari yang paling relevan untuk owner usaha kecil.
> 2. Verifikasi tiap fakta dengan membuka sumbernya (WebFetch), bukan dari cuplikan hasil pencarian. Hierarki sumber:
>    - Primer: dokumentasi/pengumuman resmi vendor, teks regulasi asli atau siaran pers resmi (DJP, BI, OJK, Komdigi), paper akademik, standar (OWASP Top 10 for LLM, NIST AI RMF, RFC).
>    - Sekunder kredibel: media yang menyebut sumber primernya. Hanya dipakai jika primer tidak bisa dibuka, dan ditandai.
>    - Tidak cukup sendirian: agregator, blog SEO, ringkasan AI, forum (forum boleh sebagai "klaim seseorang", dengan atribusi).
> 3. Tulis tiap fakta sebagai kalimat siap ucap (saya/Anda, tanpa em dash), plus kutipan pendek dari sumber sebagai bukti.
> 4. Tentukan status freshness: **Fresh** (pemicu ≤14 hari dari hari ini), **Evergreen** (tidak bergantung berita), atau **Basi** (pemicu >14 hari dan sudah ramai, atau fakta berubah).
> 5. Tulis analogi yang aman dipakai dan analogi yang harus dihindari. Analogi aman jika penonton yang bertindak berdasarkan analogi itu tetap bertindak benar.
> 6. Pisahkan klaim yang tidak bisa diverifikasi (jangan dipakai) dan klaim yang hanya bisa dikonfirmasi Aul sendiri (pengalaman, opini pribadi).
>
> Format per topik:
> ```markdown
> # Fakta: <topik>
> Diperbarui: <YYYY-MM-DD> · Status fresh: Fresh | Evergreen | Basi · Dipakai oleh: <TH-xxx>
>
> | # | Fakta (siap ucap) | Sumber (judul, tanggal, URL) | Kutipan bukti | Tingkat (primer/sekunder) |
>
> ## Kemungkinan yang terbuka (berita peluncuran/fitur)
> ## Analogi aman
> ## Analogi yang dihindari
> ## Perlu konfirmasi Aul
> ## Tidak bisa diverifikasi (jangan dipakai)
> ```

Jika status Basi atau fakta inti tidak bisa diverifikasi, laporkan ke pengguna: usulkan sudut lain atau buang ide, jangan lanjut menulis.

## Tahap cek (sesudah menulis)

Instruksi subagent:

> Anda ahli AI dan teknologi yang skeptis. Anda menerima naskah dan lembar faktanya. Nilai bagian "Naskah teleprompter", "Hook cadangan", dan "Caption". Jangan mengedit sheet atau file.
>
> 1. **Cocokkan fakta.** Setiap klaim fakta (berita, teknis, angka) harus sesuai dengan nomor di lembar fakta. Klaim di luar lembar fakta ditandai "di luar lembar"; verifikasi ke sumber primer, lalu usulkan tambahan ke lembar fakta atau penghapusan.
> 2. **Nilai penalaran.** Untuk generalisasi, saran, dan analogi: apakah ada yang menyesatkan, terlalu absolut, atau membuat penonton bertindak salah? Penyederhanaan boleh selama tidak salah; jangan menuntut kelengkapan yang membuat naskah tidak bisa diucapkan dalam 75 detik. Usulkan koreksi dengan teks sesingkat mungkin: jangan menambah pelunak atau atribusi di kalimat yang sudah benar. Jika koreksi Anda mengubah premis naskah (misalnya padahal-nya ternyata keliru), katakan terang-terangan dan usulkan premis baru, jangan ditambal dengan catatan kecil.
> 3. **Verdict per temuan:** Benar tapi kurang presisi / Menyesatkan / Salah / Tidak bisa diverifikasi, dengan teks pengganti siap ucap.
> 4. **Penonton ahli:** maksimal 3 komentar paling mungkin dari engineer atau praktisi yang teliti ("Sebenarnya…"), dan apakah naskah sudah menutupnya.
> 5. **Verdict naskah:** **Lolos**, **Lolos dengan revisi**, atau **Gagal** (inti naskah salah).
>
> Format:
> ```
> ### <ID>: <verdict>
> | # | Kutipan | Masalah | Verdict | Sumber / no. lembar fakta | Teks pengganti |
> Penonton ahli: 1) … 2) …
> ```

## Setelah tahap cek
1. Terapkan teks pengganti secara minimal. Klaim "Tidak bisa diverifikasi" dihapus atau diberi atribusi eksplisit; tidak boleh lolos diam-diam.
2. Jika ada revisi, kirim kalimat yang berubah ke subagent yang sama (SendMessage) untuk cek ulang satu kali.
3. Di baris naskah pada tab Naskah, isi kolom Challenge teknis:
   ```
   Verdict: <...> · Lembar fakta: tab Fakta, topik <slug> · Tanggal: <YYYY-MM-DD>
   <temuan dan perubahan yang diterapkan>
   Perlu konfirmasi Aul: <daftar, jika ada>
   ```
   Ganti isi kolom Sumber dengan sumber dari lembar fakta. Tulis lembar fakta baru atau yang diperbarui ke tab Fakta.
4. Kolom Status di tab Talking Head: `lolos-challenge` jika Lolos, atau Lolos dengan revisi yang sudah diterapkan dan dicek ulang; biarkan `naskah` jika Gagal.
5. Laporkan: tabel ID, verdict, jumlah klaim dicek, jumlah dikoreksi, dan daftar "Perlu konfirmasi Aul".

## Batas
Challenge menurunkan risiko, bukan menjamin nol kesalahan: sumber resmi bisa berubah atau tidak bisa diakses. Sebutkan fakta yang hanya didukung sumber sekunder, dan ingatkan cek ulang H-2 untuk fakta berbasis berita.
