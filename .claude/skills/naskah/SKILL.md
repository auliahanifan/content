---
name: naskah
description: Produksi naskah Reels talking head untuk personal brand Aulia Rahman dari Google Sheet content bank. Dua mode. "pecah": memecah baris bank CORE menjadi 2-3 ide talking head low effort dan menulisnya ke tab "Talking Head". "naskah" (default): menulis naskah dari baris tab Talking Head berstatus dipilih (atau ID yang disebut), dengan lembar fakta terverifikasi dan cek freshness ≤14 hari (skill challenge), asah hook untuk potensi viral, penulisan dengan aulia-brand yang dikunci ke lembar fakta, challenge teknis, review brand terpisah, dan cek klaim. Gunakan ketika pengguna meminta /naskah, pecah CORE, bikin naskah dari bank ide, atau batch script talking head. Ide fresh di luar CORE dicari dengan /ide-konten.
---

# Naskah talking head

Baca dulu [tab-talking-head.md](references/tab-talking-head.md) (kolom, syarat low effort, anti dobel, aturan tulis sheet).

Input: link Google Sheet content bank (jika tidak ada, cari di Drive dan konfirmasi), lalu salah satu:
- `/naskah pecah <ID CORE...>`: mode pecah.
- `/naskah <TH-xxx...>`: mode naskah untuk ID tersebut. Jika ID tidak ada di Talking Head, cari di ArchiveTH.
- `/naskah` saja: mode naskah untuk semua baris Talking Head berstatus `dipilih`, maksimal 8. Jika lebih dari 8, ambil 8 teratas dan sebutkan sisanya.

Format: Instagram Reels, talking head, 45-75 detik (120-160 kata lisan).

## Mode pecah (CORE → ide talking head)

Untuk setiap ID CORE yang diminta:
1. Baca barisnya: Business Problem, Aul Angle, Hook A/B/C, Cost Lens, Application Lens / Guardrail, Fresh Trigger.
2. Ambil 2-3 poin yang bisa berdiri sendiri **tanpa tes atau demo**: penalaran biaya, kerangka keputusan, guardrail, istilah, atau reaksi atas pemicu. Jangan paksa: jika bahannya hanya cukup untuk 1, buat 1.
3. Cek pemicu dengan WebSearch untuk mengisi Tanggal pemicu dan Status fresh (aturan di tahap 1 mode naskah).
4. Setiap pecahan wajib lolos syarat kedalaman (kolom Anggapan dan Padahal terisi), syarat low effort, dan anti dobel. Poin yang hanya berupa saran atau kerangka tanpa padahal tidak dipecah.
5. Tulis ke tab Talking Head dengan Sumber `CORE#<id>`, Status `usulan`, dalam satu panggilan. Jangan mengubah tab CORE.

Laporkan tabel ringkas (ID TH, dari CORE#, Hook) dan ide CORE yang tidak bisa dipecah beserta alasannya.

## Mode naskah

### 1. Lembar fakta
Jalankan `challenge` tahap **fakta** untuk seluruh batch. Hasilnya lembar fakta terverifikasi per topik di tab **Fakta** beserta status freshness (Fresh / Evergreen / Basi). Ide Basi, atau yang fakta intinya tidak bisa diverifikasi, tidak ditulis: laporkan dan usulkan sudut lain atau buang. Fakta inti = **padahal** di sheet. Jika padahal ternyata keliru atau hanya opini, ide tidak ditulis. Jika lembar fakta menemukan padahal yang lebih kuat dari yang di sheet, pakai yang lebih kuat dan perbarui kolom Padahal.

### 2. Asah hook
Hook menentukan penonton berhenti scroll atau tidak. Ini tahap terpenting; jangan diringkas. Pakai skill `social` (bagian Hook Formulas, The 3-Second Rule, dan No AI Tells) sebagai acuan tambahan. Kalau bertentangan, aturan skill ini dan `aulia-brand` yang menang.

**a. Penonton dan taruhannya.** Sebelum menulis hook, jawab dua hal (tidak disimpan):
- Untuk siapa padahal ini benar? Contoh: hemat dari model kecil hanya terasa bagi yang bayar per pemakaian, bukan langganan bulanan flat. Jika padahal hanya berlaku untuk sebagian audiens, hook wajib menyebut segmen itu ("Bayar AI per pemakaian?") atau pilih sudut yang berlaku luas. Jika tidak bisa, laporkan ide itu sebagai lemah.
- Apa yang hilang atau didapat penonton, dalam kata konkret: uang, pelanggan, data, waktu, malu di depan pelanggan.

**b. Tulis 12 hook dari minimal 6 pola berbeda** (maksimal 3 per pola). Sertakan hook dari sheet sebagai salah satu kandidat.
1. Akibat konkret: "Chatbot AI Anda bisa janji retur yang nggak ada."
2. Anggapan dibalik: "Banyak yang mikir X. Padahal Y."
3. Kutipan yang akrab: "'Kak, bisa retur?' Chatbot Anda jawab apa?"
4. Berhenti/jangan: "Berhenti pakai model AI paling mahal buat ngerangkum chat."
5. Kata pembuatnya sendiri: "Pembuat Claude sendiri nyaranin model kecil buat ngerangkum chat."
6. Angka berkonteks, hanya dari lembar fakta.
7. Kontras pendek: "Salah rangkum bisa dibenahi. Salah kirim, lain cerita."
8. Pertanyaan yang langsung kena, bukan "pernah nggak": "Email bisa nyuruh AI Anda?"
9. Perintah fisik: "Matikan wifi. Notulen AI ini tetap jalan."
10. Adegan + jebakan: "Foto ini lolos cek AI Google. Belum tentu asli."

**c. Gerbang wajib.** Hook gugur kalau satu saja gagal; tidak ada nilai "cukup".
1. Kalimat pertama maksimal 9 kata, terucap dalam 3 detik oleh suara ElevenLabs (±2,5–3 kata/detik; angka dihitung sebagai kata yang diucapkan, mis. "30 ribu dolar" = 3 kata). Angka, benda, atau taruhannya muncul di 4 kata pertama, karena detik pertama yang menentukan.
2. Kalimat pertama sudah memuat benda yang dikenal owner (chatbot, email, tagihan, model AI, admin) **dan** taruhan atau pembalikannya. Pemanasan dilarang: "Coba tebak", "Pernah nggak", "Jadi gini", "Halo", "Di video ini", "Tahukah Anda". Yang boleh ditunda hanya *kenapa*-nya, bukan *apa* taruhannya.
3. Uji scroll: baca kalimat pertama saja. Bisakah dijawab "kalau lanjut nonton, penonton dapat atau terhindar dari apa"? Jika kabur, gugur.
4. Uji salah paham: tulis satu kalimat tentang apa yang akan dikira penonton isi videonya. Jika berbeda dari isi naskah, gugur (clickbait atau terlalu kabur).
5. Berdasar: setiap klaim di hook ada di lembar fakta, pakai "bisa" untuk kemungkinan. Tidak menakut-nakuti, tidak absolut, tidak menyindir.
6. Relevan untuk segmen di (a).
7. Bisa digambar: hook bisa divisualkan dengan kit `/video-faceless` di detik 0–3 (angka raksasa + coretan, chip/stempel seperti tanggal, "Free", "dilarang", ikon clay, atau kontras sebelum/sesudah). Tulis sketsa visual satu kalimat. Hook yang hanya kuat diucapkan tapi tidak punya gambar, gugur.

**d. Uji buta.** Kirim hook yang lolos gerbang (Ucap + Layar) ke subagent terpisah (`model: sonnet`), tanpa naskah dan tanpa penilaian Anda, dengan dua persona yang dinilai terpisah:
- **Owner:** owner usaha kecil di Indonesia yang sedang scroll Reels sambil menunggu pesanan, tidak tertarik teknologi kecuali menyangkut uang, pelanggan, atau waktu.
- **Umum:** penonton Reels usia 20-35 (karyawan atau mahasiswa), bukan owner, berhenti hanya kalau penasaran, kaget, atau merasa "ini soal gue". Persona ini mengukur jangkauan di luar audiens inti.

Untuk tiap hook dan tiap persona: BERHENTI atau SCROLL, tebakan isi video, dan alasan; lalu 3 hook terkuat per persona, dan masalah utama hook yang di-scroll kedua persona. Jika tebakan soal isi video meleset dari naskah, hook itu gugur. Jika pilihannya berbeda dari pilihan Anda, ikuti pilihannya. Hook yang di-scroll kedua persona ditulis ulang dan diuji lagi dengan subagent **baru** (jangan memakai ulang subagent yang sudah melihat versi lama). Maksimal dua putaran; jika masih kalah di kedua persona, laporkan ide itu berpotensi rendah, jangan dipaksa.

**e. Pilih** 1 hook utama + 2 cadangan dari **pola yang berbeda**, supaya cadangan bisa dipakai untuk uji A/B saat posting. Ringkasan uji buta disimpan di kolom **Hasil uji**, dan potensinya di kolom **Potensi** (aturan di tahap 6).

Gerbang ini menaikkan peluang, bukan menjamin viral. Jangan menyebut hook "pasti viral" di laporan; yang membuktikan adalah data retensi 3 detik setelah posting.

### 3. Tulis naskah
Panggil skill `aulia-brand` mode Create. Pakai skill `social` (bagian Hook Formulas, The 3-Second Rule, dan No AI Tells) sebagai acuan tambahan. Kalau bertentangan, aturan skill ini dan `aulia-brand` yang menang. Pilih struktur dulu:

**Mode unlock** dipakai otomatis bila sumber ide adalah peluncuran fitur, produk, atau tonggak (lembar fakta punya bagian "Kemungkinan yang terbuka"). Inti video: *apa yang sekarang bisa dilakukan owner*, bukan apa yang perlu diwaspadai.
1. **Hook:** kemampuan baru dalam bahasa owner ("ChatGPT sekarang bisa bikinin alat hitung, langsung di chat.").
2. **Apa yang baru:** satu-dua kalimat, siapa yang kebagian dan kapan.
3. **Kalimat khas seri** bila ada (Bukan Sulap: "Bukan sulap. Begini cara kerjanya.").
4. **Mekanisme:** satu-dua kalimat, kenapa itu mungkin (cukup tingkat tinggi).
5. **Kemungkinan terbuka (bagian terpanjang):** contoh resmi vendor, lalu 2-3 pemakaian konkret untuk usaha penonton (ditandai sebagai ide/saran, bukan klaim fakta). Penonton harus bisa membayangkan apa yang akan mereka minta besok.
6. **Batas:** maksimal satu kalimat. Maksimal sekitar 20% naskah. Jika peringatan lebih panjang dari daftar kemungkinan, naskah salah arah: tulis ulang.
7. **Penutup:** pertanyaan "mau coba apa dulu?" atau ajakan menyebut kasus mereka.
Syarat kedalaman tetap berlaku (ada mekanisme, ada padahal yang terbukti), tapi padahal berupa kemampuan baru yang terbukti, bukan celah.

Untuk ide yang bukan peluncuran (membongkar anggapan keliru), pakai struktur "Behind the AI", dipetakan ke struktur reels brand:

1. **Anggapan** (masalah): ucapkan anggapan penonton seperti mereka mengucapkannya.
2. **Padahal** (penyebab sebenarnya): fakta yang membongkarnya, dengan atribusi singkat ke sumber yang paling dipercaya penonton.
3. **Kenapa** (proses): mekanisme di balik padahal. Ini bagian terpanjang dan inti #RumitJadiJelas. Satu analogi aman boleh dipakai di sini.
4. **Artinya untuk Anda** (hasil): satu tindakan atau keputusan konkret. Checklist hanya jika memang perlu, maksimal tiga butir.
5. **Batas**: hanya jika material, satu kalimat. Jangan jadikan ritual.
6. **Penutup**: pertanyaan atau kalimat yang mengubah cara pandang, bukan "Jadi, cocok untuk Anda yang…". CTA boleh menyatu dengan pertanyaan ini.

**Kalimat khas seri (wajib):** setiap seri yang punya kalimat khas di bagian "Kalimat khas seri" aturan `aulia-brand` wajib memuatnya **kata per kata**, di posisi yang ditentukan di sana (contoh: Bukan Sulap setelah pembuka sebelum mekanisme; Sing Murah Wae menjelang penutup setelah perbandingan hasil dan biaya total). Jangan diparafrasekan, dan jangan dipasang di seri lain. Isi dan analogi di sekitarnya yang menyesuaikan topik.

Aturan gaya:
- **Ngobrol santai, bukan dibaca.** Saya/Anda tetap, tapi pakai kata lisan secara alami (nggak, sih, kok, gitu, kayak, mikir, ngerjain, kan, nah) dan kata sambung obrolan ("Nah,", "Masalahnya,", "Kenapa?", "Jadi coba deh."). Uji: bacakan keras-keras; kalau terdengar seperti membaca dokumen, tulis ulang. Contoh nada: "Rapi sih. Tapi mahal." / "Nah, pembuatnya sendiri nggak bilang gitu."
- **Satu ide utama.** Buang ide kedua walau benar dan menarik (misalnya pengaturan tambahan atau fitur lain). Lebih baik satu poin yang nempel daripada empat poin yang lewat.
- Satu analogi utama dari dunia owner (gaji staf, ongkir, belanja bahan) lebih kuat daripada analogi abstrak. Bawa analogi yang sama dari hook, contoh, jebakan, sampai pertanyaan penutup; jangan ganti analogi di tengah naskah.
- **Analogi harus sedunia dengan contohnya.** Pilih analogi yang pekerjaannya sejenis dengan contoh nyata di naskah. Contoh memilah pesan pelanggan cocok dengan direktur dan admin (sama-sama pekerjaan kantor), tapi janggal dengan truk dan motor ("Ini cukup diantar motor" untuk memilah pesan). Uji: baca kalimat punchline analogi tepat setelah contohnya; jika terdengar aneh diucapkan secara harfiah, ganti analogi, bukan contohnya.
- Hook paling kuat memakai momen yang akrab bagi owner, bahkan kutipan chat yang sering mereka terima ("Kak, ini masih ada?").
- Kalimat pendek untuk diucapkan, satu ide per baris teleprompter. Maksimal dua ungkapan Jawa, hanya jika alami.
- Kalau ada hitungan, kerjakan hitungannya di naskah dengan angka dari lembar fakta. Jangan berhenti di "hitung dulu".
- Atribusi seperlunya: satu kali per sumber cukup. Pelunak ("biasanya", "bisa") hanya pada klaim yang memang tidak pasti.
- Satu slot suara Aul per naskah: `[ISI: pengalaman atau pendapat Anda soal ...]` dengan pertanyaan yang spesifik. Slot ini opsional untuk direkam, tapi selalu disiapkan.
- Variasikan pembuka dan penutup antar naskah dalam satu batch. Jangan ada dua naskah yang memakai kalimat pembuka atau penutup yang sama.

**Pola teks naskah:**
- **Kalimat pertama = hook terpilih, kata per kata.** Kalimat berikutnya mempertajam taruhannya dalam satu kontras pendek ("Rapi sih. Tapi mahal."), bukan pemanasan. Kalau hook memadatkan klaim (angka hanya untuk sebagian kasus, tanggal tanpa tahun, syarat yang dipendekkan), kalimat kedua langsung memberi lingkupnya, dalam 6 detik pertama ("Bayar Claude Team? Ada kredit 100 dolar yang bisa hangus." lalu "Itu untuk tim lima orang di paket Standard."). Lalu buang kalimat di badan naskah yang mengulang isi hook. Jangan pakai jembatan cetakan seperti "Itulah yang terjadi saat..." atau "Begitulah..."; kalau dipakai di satu naskah, jangan di naskah lain dalam batch yang sama.
- **Bayar janji hook dengan cepat.** Padahal sudah terucap dalam sekitar 40 kata pertama (±15 detik). Penjelasan boleh panjang, tapi penonton harus sudah tahu poinnya.
- **Satu alasan untuk simpan atau kirim.** Misalnya aturan satu kalimat yang bisa langsung dipakai, atau sebut siapa yang perlu dengar ("kirim ke admin Anda").
- **Contoh ditutup dengan punchline analogi.** Setelah contoh nyata dari dunia owner, tutup dengan satu kalimat yang mengembalikan contoh ke analogi ("Ini pekerjaan admin, bukan direktur.").
- **Callback di penutup.** Pertanyaan terakhir kembali ke gambaran di hook dan diarahkan ke bisnis penonton ("Jadi, di bisnis Anda... direktur sedang mengerjakan tugas siapa?").
- **Langkah dalam satu kalimat mengalir.** Gabungkan dua atau tiga langkah menjadi satu kalimat ("Tentukan jawaban yang benar, lalu bandingkan hasil, biaya, dan waktunya."), bukan daftar perintah yang terdengar seperti membaca slide.
- **Batas juga memakai analogi** bila bisa, supaya opsi mahal tetap punya tempat ("Untuk masalah rumit dan penuh nuansa, barulah panggil direktur: model terkuat.").
- **Biaya total dalam satu frasa tajam** bila topiknya soal biaya ("hitung sampai pekerjaan selesai, bukan per jawaban").
- **Tanda jeda.** Pakai "..." hanya di tempat yang memang akan diberi jeda saat diucapkan, biasanya sebelum punchline. Maksimal empat per naskah; jangan dipasang hanya karena aturan.
- **Pangkas sebelum selesai.** Hitung kata yang diucapkan (tanpa blok `[HOOK]` selain isi baris Ucap). Jika lebih dari 160, buang dulu kalimat yang mengulang poin, lalu persingkat contoh. Jangan buang batas yang material atau kalimat khas seri.

**Kunci ke lembar fakta:** naskah hanya boleh berisi (1) fakta dari lembar fakta, (2) penalaran atau saran yang jelas berbentuk saran, dan (3) analogi dari bagian "Analogi aman". Jangan menambah klaim fakta, angka, atau generalisasi baru. Butuh fakta tambahan? Tambahkan lewat `challenge` tahap fakta, jangan ditulis langsung.

Jika baris berasal dari ide berformat tes/demo/perbandingan, ubah menjadi kerangka berpikir ("cara menghitung", "yang perlu dicek sebelum memilih") dan beri slot `[ISI: hasil tes]`. CTA tidak boleh menjanjikan sesuatu yang belum ada. Jika nama seri tidak ada di tabel pilar brand, pilih seri yang paling cocok dan tandai di "Yang perlu Anda isi".

### 4a. Challenge teknis
Jalankan `challenge` tahap **cek** untuk seluruh batch dan terapkan koreksinya sebelum review brand, karena koreksi bisa menambah kalimat baru yang perlu dicek brand.

### 4b. Review brand (terpisah)
Kirim naskah ke subagent (`model: sonnet`) dengan instruksi: panggil skill `aulia-brand` mode **Review**, beri verdict dan temuan dengan kutipan. Reviewer juga menilai kedalaman: apakah penonton mendapat sesuatu yang tidak ada di judul beritanya, dan apakah bagian "kenapa" benar-benar menjelaskan mekanisme. Naskah yang dangkal ditandai "Perlu penyesuaian". Untuk naskah mode unlock, reviewer juga mengecek proporsi: bagian kemungkinan harus lebih panjang daripada batas/peringatan, dan hook harus menyebut kemampuan, bukan risiko; jika terbalik, tandai "Perlu penyesuaian". Reviewer juga mengecek kalimat pertama terhadap gerbang hook di tahap 2c (terutama 2c.2: tanpa pemanasan, taruhan sudah ada), dan memastikan kalimat khas seri muncul kata per kata di posisi yang benar; jika hilang atau diparafrasekan, tandai "Perlu penyesuaian". Subagent tidak melihat proses penulisan, hanya naskah + konteks ide. Satu subagent boleh mereview seluruh batch. Jika verdict bukan "Sudah selaras", revisi minimal sesuai temuan. Review ulang hanya jika revisi menambah kalimat baru di luar saran reviewer.

### 5. Cek klaim
Daftar setiap klaim pengalaman pribadi, hasil tes, angka biaya, atau pelanggan. Yang tidak berasal dari lembar fakta atau pernyataan pengguna diganti `[ISI: ...]` di naskah, termasuk semua butir "Perlu konfirmasi Aul". Jangan pernah menulis "saya sudah mencoba" tanpa fakta dari pengguna.

### 6. Output
Tulis satu baris per ide ke tab **Naskah** (kolom dan aturan di [tab-talking-head.md](references/tab-talking-head.md)), seluruh batch dalam satu panggilan. Jangan menulis file lokal.

- Naskah teleprompter: dibuka dengan blok hook, lalu naskah baris per baris:
  ```
  [HOOK 0–3 dtk]
  Ucap: <hook terpilih, kata per kata, lolos gerbang 2c>
  Layar: <teks overlay detik 0–3, maksimal 5 kata>
  Visual: <satu kalimat, memakai kit /video-faceless>

  <kalimat kedua dan seterusnya>
  ```
  Label `[HOOK ...]`, `Ucap:`, serta baris Layar dan Visual tidak dibacakan dan tidak dikirim ke TTS; yang diucapkan hanya isi Ucap lalu teks naskah sesudahnya.
- Hook cadangan: 2 hook.
- Caption: caption + #RumitJadiJelas + satu hashtag seri.
- Perlu diisi: `[ISI: ...] → kenapa`, atau `Tidak ada.`
- Sumber: sumber dari lembar fakta, `<judul> (<tanggal>) <url>`.
- Challenge teknis: dari langkah 4a.
- Catatan review: verdict dan temuan reviewer brand, ringkas.
- Potensi: dari uji buta hook utama. `Tertinggi` = kedua persona berhenti di semua putaran; `Tinggi` = kedua persona berhenti, atau persona Umum berhenti dengan alasan "ini soal gue" (`Tinggi (umum)`); `Sedang (owner)` = hanya persona Owner yang berhenti; `Rendah` = kedua persona scroll setelah dua putaran. Ini perkiraan, bukan jaminan views.
- Hasil uji: `Uji buta <YYYY-MM-DD>.` lalu per persona BERHENTI/SCROLL + alasan singkat, dan hook lama yang gugur beserta masalahnya.

Di chat, urutkan saran posting dari Potensi tertinggi.

Penilaian hook dan hasil uji buta hanya dipakai untuk memilih hook, tidak disimpan.

Setelah baris ditulis dan diverifikasi, ubah Status baris tersebut di tab Talking Head menjadi `lolos-challenge` jika challenge teknis lolos, atau `naskah` jika gagal (hanya kolom Status; baris CORE tidak diubah). Lalu di chat: tabel ringkas per ide (ID, status fresh, hook utama, verdict, jumlah [ISI]) dan tautan sheet.
