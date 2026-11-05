---
name: naskah
description: Produksi naskah Reels (talking head, faceless kanvas, dan tutorial rekam layar) untuk personal brand Aulia Rahman dari Google Sheet content bank. Dua mode. "pecah": memecah baris bank CORE menjadi 2-3 ide talking head low effort dan menulisnya ke tab "Talking Head". "naskah" (default): menulis naskah dari baris tab Talking Head berstatus dipilih (atau ID yang disebut), dengan lembar fakta terverifikasi dan cek freshness ≤14 hari (skill challenge), asah hook untuk potensi viral, penulisan dengan aulia-brand yang dikunci ke lembar fakta, challenge teknis, review brand terpisah, dan cek klaim. Gunakan ketika pengguna meminta /naskah, pecah CORE, bikin naskah dari bank ide, atau batch script talking head. Ide fresh di luar CORE dicari dengan /ide-konten.
---

# Naskah talking head

Baca dulu [tab-talking-head.md](references/tab-talking-head.md) (kolom, syarat produksi, anti dobel, aturan tulis sheet).

Input: link Google Sheet content bank (jika tidak ada, cari di Drive dan konfirmasi), lalu salah satu:
- `/naskah pecah <ID CORE...>`: mode pecah.
- `/naskah <TH-xxx...>`: mode naskah untuk ID tersebut. Jika ID tidak ada di Talking Head, cari nomor barisnya di ArchiveTH dengan `MATCH` di tab `Cari` lalu baca baris itu saja; jangan membaca arsip penuh.
- `/naskah` saja: mode naskah untuk semua baris Talking Head berstatus `dipilih`, maksimal 8. Jika lebih dari 8, ambil 8 teratas dan sebutkan sisanya.
- `/naskah ulang <ID Naskah>`: daur ulang naskah yang sudah tembus (lihat bagian "Daur ulang pemenang").

Audiens: owner dan tim kecil, **serta orang Indonesia yang baru belajar memakai AI untuk kerja** (karyawan, freelancer, mahasiswa). Tulis supaya pemula total paham tanpa merasa digurui; owner tetap mendapat keputusan konkret.

Format: Instagram Reels (talking head atau faceless `/video-karakter` mode kanvas). **Durasi mengikuti muatan**, bukan sebaliknya:
| Struktur | Durasi | Kata lisan |
|---|---|---|
| Behind the AI, Mode unlock | 45-75 dtk | 110-190 |
| Penjelasan satu tugas | 60-80 dtk | 150-200 |
| Tutorial langkah, Nitip | 60-120 dtk | 150-300 |
| Tumpukan jebakan | 45-65 dtk | 120-170 |
Angka kata mengikuti suara standar (`[confident]`, 1,1x, ±2,6 kata/dtk). Standar 5 Nov 2026: **padat, tidak bertele-tele** (lihat "Padat dan tidak ambigu" di tahap menulis).
Panjang hanya boleh bila tiap 10-15 detik ada langkah baru, contoh baru, atau perubahan peraga. Video panjang tanpa muatan kalah (riset `dates/2026-11-04/riset-hisvill.md`: 177 detik tanpa rekaman asli gagal, 85-166 detik dengan langkah nyata menang).

## Mode pecah (CORE → ide talking head)

Untuk setiap ID CORE yang diminta:
1. Baca barisnya: Business Problem, Aul Angle, Hook A/B/C, Cost Lens, Application Lens / Guardrail, Fresh Trigger.
2. Ambil 2-3 poin yang bisa berdiri sendiri: penalaran biaya, kerangka keputusan, guardrail, istilah, reaksi atas pemicu, **atau demo/tutorial yang bisa direkam layar oleh Aulia** (Format `tutorial`, langkah ditandai `[REKAM: ...]`). Yang butuh hasil tes panjang tetap tinggal di CORE. Jangan paksa: jika bahannya hanya cukup untuk 1, buat 1.
3. Cek pemicu dengan WebSearch untuk mengisi Tanggal pemicu dan Status fresh (aturan di tahap 1 mode naskah).
4. Setiap pecahan wajib lolos syarat kedalaman (kolom Anggapan dan Padahal terisi), syarat produksi, dan anti dobel. Isi kolom Format (`ucap` atau `tutorial`). Poin yang hanya berupa saran atau kerangka tanpa padahal tidak dipecah.
5. Tulis ke tab Talking Head dengan Sumber `CORE#<id>`, Status `usulan`, dalam satu panggilan. Jangan mengubah tab CORE.

Laporkan tabel ringkas (ID TH, dari CORE#, Hook) dan ide CORE yang tidak bisa dipecah beserta alasannya.

## Mode naskah

### 1. Lembar fakta
Jalankan `challenge` tahap **fakta** untuk seluruh batch. Hasilnya lembar fakta terverifikasi per topik di tab **Fakta** beserta status freshness (Fresh / Evergreen / Basi). Ide Basi, atau yang fakta intinya tidak bisa diverifikasi, tidak ditulis: laporkan dan usulkan sudut lain atau buang. Fakta inti = **padahal** di sheet. Jika padahal ternyata keliru atau hanya opini, ide tidak ditulis. Jika lembar fakta menemukan padahal yang lebih kuat dari yang di sheet, pakai yang lebih kuat dan perbarui kolom Padahal.

### 2. Asah hook
Hook menentukan penonton berhenti scroll atau tidak. Ini tahap terpenting; jangan diringkas. Pakai skill `social` (bagian Hook Formulas, The 3-Second Rule, dan No AI Tells) sebagai acuan tambahan. Kalau bertentangan, aturan skill ini dan `aulia-brand` yang menang.

**a. Penonton dan taruhannya.** Sebelum menulis hook, jawab dua hal (tidak disimpan):
- Untuk siapa padahal ini benar? Contoh: hemat dari model kecil hanya terasa bagi yang bayar per pemakaian, bukan langganan bulanan flat. Jika padahal hanya berlaku untuk sebagian audiens, hook wajib menyebut segmen itu ("Bayar AI per pemakaian?") atau pilih sudut yang berlaku luas. Jika tidak bisa, laporkan ide itu sebagai lemah.
- Apa yang **didapat** penonton, dalam kata konkret: alat yang bisa langsung dipakai, waktu yang dihemat, uang yang tidak perlu dikeluarkan, kemampuan baru, atau cara membedakan yang tadinya membingungkan. Baru kemudian apa yang hilang bila salah. Default hook adalah untung (hadiah, kemampuan, kejelasan); hook rugi hanya bila taruhannya nyata dan bersumber.

**b. Tulis 12 hook dari minimal 6 pola berbeda** (maksimal 3 per pola, minimal 3 hook dari pola untung 12-15 atau 2, 5, 9). Sertakan hook dari sheet sebagai salah satu kandidat.
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
11. Rugi sebelum untung: "Toko online Anda bisa kena denda sebelum laku satu pun." Kerugian besar + kontras "belum dapat apa-apa". Hanya untuk Tumpukan jebakan dengan angka bersumber; patuhi `aulia-brand` aturan 5 (rasa takut bukan pengganti alasan).
12. Hadiah + jangkar harga: "Masih beli kelas prompt jutaan? Sini, saya kasih caranya gratis." Sebut harga pasar yang nyata (dari lembar fakta) lalu berikan alternatif gratis yang benar-benar ada di video. Hook terlaris di akun pembanding Indonesia (@hisvill, 180 rb play).
13. Permintaan dikabulkan: "Banyak yang minta tutorial Hermes. Hari ini kita pasang bareng dari nol." Hanya bila permintaan itu nyata (kolom Peminta di sheet atau komentar yang ditempel pengguna).
14. Janji hasil di akhir: "Di akhir video ini, Anda bisa membedakan chatbot dan agent dalam tiga detik." Hasil harus konkret dan benar-benar dibayar.
15. Identitas / baru lihat bungkusnya: "Kalau Anda pikir ChatGPT itu AI-nya, Anda baru melihat bungkusnya." Membalik anggapan yang dipegang orang pintar, tanpa merendahkan.

**c. Gerbang wajib.** Hook gugur kalau satu saja gagal; tidak ada nilai "cukup".
1. Kalimat pertama maksimal 9 kata, terucap dalam 3 detik oleh suara ElevenLabs (±2,6 kata/detik pada tempo 1,1x; angka dihitung sebagai kata yang diucapkan, mis. "30 ribu dolar" = 3 kata). Angka, benda, atau taruhannya muncul di 4 kata pertama, karena detik pertama yang menentukan.
2. Kalimat pertama sudah memuat benda yang dikenal owner (chatbot, email, tagihan, model AI, admin) **dan** taruhan atau pembalikannya. Pemanasan dilarang: "Coba tebak", "Pernah nggak", "Jadi gini", "Halo", "Di video ini", "Tahukah Anda". Yang boleh ditunda hanya *kenapa*-nya, bukan *apa* taruhannya.
3. Uji scroll: baca kalimat pertama saja. Bisakah dijawab "kalau lanjut nonton, penonton dapat atau terhindar dari apa"? Jika kabur, gugur.
4. Uji salah paham: tulis satu kalimat tentang apa yang akan dikira penonton isi videonya. Jika berbeda dari isi naskah, gugur (clickbait atau terlalu kabur).
5. Berdasar: setiap klaim di hook ada di lembar fakta, pakai "bisa" untuk kemungkinan. Tidak menakut-nakuti, tidak absolut, tidak menyindir.
6. Relevan untuk segmen di (a).
7. Milik penonton: kalimat pertama menyebut benda, kebiasaan, atau anggapan milik penonton dengan "Anda" ("form daftar Anda", "prompt Anda cuma satu kalimat?", "Anda pikir ChatGPT itu AI-nya?"), bukan hal umum. Penonton harus bisa membatin "itu saya".
8. Kata kerja taruhan diuji (hanya hook rugi): bila hook memuat kerugian, tulis dua versi kata kerja dan bawa keduanya ke uji buta (mis. "dituntut" vs "berutang", "diblokir" vs "kena biaya", "bocor" vs "terlihat orang"). Di akun pembanding, naskah dengan isi serupa dapat 1,46 juta views dengan "sued" dan 19 ribu dengan "owe". Tetap patuhi gerbang 5: kata yang lebih tajam tetap harus benar menurut lembar fakta.
9. Bisa digambar: hook bisa divisualkan di detik 0–3 dengan peraga `/video-karakter` mode kanvas (kartu harga yang dicoret jadi Rp0, dua kartu A vs B, benda milik penonton, layar HP asli). Tulis sketsa visual satu kalimat. Hook yang hanya kuat diucapkan tapi tidak punya gambar, gugur.

**d. Uji buta.** Kirim hook yang lolos gerbang (Ucap + Layar) ke subagent terpisah (`model: sonnet`), tanpa naskah dan tanpa penilaian Anda, dengan dua persona yang dinilai terpisah (Owner dan Pemula AI):
- **Owner:** owner usaha kecil di Indonesia yang sedang scroll Reels sambil menunggu pesanan, tidak tertarik teknologi kecuali menyangkut uang, pelanggan, atau waktu.
- **Pemula AI:** penonton Reels usia 20-35 (karyawan, freelancer, mahasiswa) yang baru mulai pakai ChatGPT/Gemini untuk kerja, ingin hasil lebih bagus tanpa bayar kelas, berhenti kalau dijanjikan sesuatu yang bisa langsung dipakai, penasaran, atau merasa "ini soal gue". Audiens ini sama pentingnya dengan owner.

Untuk tiap hook dan tiap persona: BERHENTI atau SCROLL, tebakan isi video, dan alasan; lalu 3 hook terkuat per persona, dan masalah utama hook yang di-scroll kedua persona. Jika tebakan soal isi video meleset dari naskah, hook itu gugur. Jika pilihannya berbeda dari pilihan Anda, ikuti pilihannya. Hook yang di-scroll kedua persona ditulis ulang dan diuji lagi dengan subagent **baru** (jangan memakai ulang subagent yang sudah melihat versi lama). Maksimal dua putaran; jika masih kalah di kedua persona, laporkan ide itu berpotensi rendah, jangan dipaksa.

**e. Pilih** 1 hook utama + 2 cadangan dari **pola yang berbeda**, supaya cadangan bisa dipakai untuk uji A/B saat posting. Ringkasan uji buta disimpan di kolom **Hasil uji**, dan potensinya di kolom **Potensi** (aturan di tahap 6).

Gerbang ini menaikkan peluang, bukan menjamin viral. Jangan menyebut hook "pasti viral" di laporan; yang membuktikan adalah data retensi 3 detik setelah posting.

### 3. Tulis naskah
Panggil skill `aulia-brand` mode Create. Pakai skill `social` (bagian Hook Formulas, The 3-Second Rule, dan No AI Tells) sebagai acuan tambahan. Kalau bertentangan, aturan skill ini dan `aulia-brand` yang menang. Pilih struktur dulu.

**Kerangka wajib semua struktur** (dari riset @hisvill, `dates/2026-11-04/riset-hisvill.md`):
1. **Bawa pulang.** Tiap video memberi satu hal yang bisa langsung dipakai: prompt/template (lengkap di caption atau komentar yang disematkan), langkah bernomor, atau satu aturan satu kalimat ("Butuh saran, pakai chatbot. Butuh pekerjaan selesai, pakai agent."). Video yang hanya memotivasi ("AI bisa jauh lebih dari itu") gugur.
2. **Janji eksplisit** untuk video >60 detik, di kalimat 2-3: "Di akhir video ini, Anda bisa ..." atau "Prompt-nya saya kasih di akhir." Tulis `Janji:` di blok hook. Bayar persis di akhir.
3. **Kait ulang tiap ±30-40 detik**: satu kalimat yang membuka loop kecil sebelum bagian berikutnya ("Nah, di langkah berikutnya ada satu bagian yang sering bikin orang mengira gagal. Padahal solusinya sederhana.").
4. **Satu tugas konkret yang dialami semua orang** sebagai contoh (folder Download berantakan, balas chat pelanggan, bikin rencana promosi), dikerjakan dengan dua cara bila membandingkan.
5. **Satu analogi universal** (mesin, mobil, supir; restoran vs masak sendiri; kunci rumah). Analogi regional (andong Malioboro) hanya sebagai bumbu, bukan analogi utama.
6. **Episode.** Bila naskah bagian dari arc (kolom Arc di sheet), sebut episode sebelumnya dalam satu kalimat ("Kemarin kita bahas anatomi prompt.") dan tutup dengan episode berikutnya atau voting ("Mau Hermes atau OpenCode dulu? Tulis di komentar.").
7. **Penutup = pertanyaan yang jawabannya jadi bahan episode berikutnya** (bukan pertanyaan retoris), lalu kalimat follow singkat.

**Memilih struktur** dari kolom Format di sheet dan bahannya: `tutorial` → Tutorial langkah (atau Nitip bila ada Peminta); membedakan dua hal yang membingungkan → Penjelasan satu tugas; peluncuran fitur → Mode unlock; membongkar anggapan → Behind the AI; 4-6 risiko bersumber → Tumpukan jebakan. Dalam satu batch, usahakan minimal sepertiga naskah berupa Tutorial langkah atau Penjelasan satu tugas.

**Tutorial langkah** dipakai bila inti video adalah cara melakukan sesuatu di sebuah aplikasi (Format `tutorial` di sheet). Aulia merekam layarnya; naskah memandu rekaman.
1. **Hook** pola 12, 13, atau 14 (hadiah, permintaan, janji hasil).
2. **Janji** hasil akhir yang terlihat ("Di akhir video, satu kalimat Anda jadi prompt enam bagian.").
3. **Kenapa ini berguna:** maksimal dua kalimat, rujuk episode sebelumnya bila ada.
4. **Langkah bernomor** ("Satu, buka Gemini. Dua, ..."): satu langkah satu kalimat pendek, angka diucapkan. Di atas tiap langkah baris `[REKAM: <layar dan tindakan>]` (mis. `[REKAM: HP · Gemini · ketuk ikon plus di kiri bawah]`). Kait ulang sebelum langkah yang sering gagal, dan solusinya.
5. **Hasil** diperlihatkan, lalu aset bawa pulang ("Prompt-nya ada di caption, langsung salin.").
6. **Batas** satu kalimat bila material (biaya, paket, privasi).
7. **Penutup** pertanyaan yang memancing permintaan berikutnya ("Mau versi ChatGPT-nya? Tulis di komentar.").
Fakta langkah (nama menu, letak tombol, paket yang dibutuhkan) wajib dicek ke dokumentasi resmi lewat `challenge`, dan ditandai `Perlu konfirmasi Aul` bila hanya bisa dipastikan saat merekam.

**Penjelasan satu tugas** dipakai untuk membedakan dua hal yang membingungkan (chatbot vs agent, model vs aplikasi, lokal vs online).
1. **Hook** pola 15 atau 14. 2. **Janji** cara membedakan. 3. **Pasangan nyata** (siapa punya apa, dari lembar fakta). 4. **Satu tugas universal dikerjakan dua cara**, langkah demi langkah, sampai terasa bedanya. 5. **Tiga pembeda** dalam satu kalimat masing-masing. 6. **Analogi** yang merangkum. 7. **Aturan bawa pulang** satu kalimat. 8. **Penutup** pertanyaan pengalaman ("Anda lebih sering pakai yang mana?").

**Nitip (permintaan penonton)** = Tutorial langkah atau Penjelasan satu tugas yang dibuka dengan permintaan nyata (pola 13): kutip permintaannya, sebut nama peminta bila pengguna mengizinkan (kolom Peminta), lalu "saya kasih yang lebih praktis" bila memang ada. Seri brand: Nitip, Mas.

**Mode unlock** dipakai otomatis bila sumber ide adalah peluncuran fitur, produk, atau tonggak (lembar fakta punya bagian "Kemungkinan yang terbuka"). Inti video: *apa yang sekarang bisa dilakukan owner*, bukan apa yang perlu diwaspadai.
1. **Hook:** kemampuan baru dalam bahasa owner ("ChatGPT sekarang bisa bikinin alat hitung, langsung di chat.").
2. **Apa yang baru:** satu-dua kalimat, siapa yang kebagian dan kapan.
3. **Kalimat khas seri** bila ada (Bukan Sulap: "Bukan sulap. Begini cara kerjanya.").
4. **Mekanisme:** satu-dua kalimat, kenapa itu mungkin (cukup tingkat tinggi).
5. **Kemungkinan terbuka (bagian terpanjang):** contoh resmi vendor, lalu 2-3 pemakaian konkret untuk usaha penonton (ditandai sebagai ide/saran, bukan klaim fakta). Penonton harus bisa membayangkan apa yang akan mereka minta besok.
6. **Batas:** maksimal satu kalimat. Maksimal sekitar 20% naskah. Jika peringatan lebih panjang dari daftar kemungkinan, naskah salah arah: tulis ulang.
7. **Penutup:** pertanyaan "mau coba apa dulu?" atau ajakan menyebut kasus mereka.
Syarat kedalaman tetap berlaku (ada mekanisme, ada padahal yang terbukti), tapi padahal berupa kemampuan baru yang terbukti, bukan celah.

**Tumpukan jebakan** (bukan default; maks 1 dari 5 naskah) dipakai bila lembar fakta memuat 4-6 risiko konkret yang masing-masing punya angka dan sumber (denda, tagihan, kebocoran, aduan), dan semuanya mengenai benda yang dimiliki penonton. Pola ini meniru reels faceless paling ramai di akun pembanding (@adilet.fndr, 1,46 juta views, analisis 2 Nov 2026):
1. **Hook rugi sebelum untung** (pola 11): angka total + benda milik penonton + "sebelum ... satu pun".
2. **Janji:** satu kalimat bahwa perbaikannya ada di akhir ("Perbaikannya cukup satu prompt, saya kasih di akhir."). Hanya bila payoff-nya benar-benar ada (prompt, checklist, template) dan ditulis lengkap di caption.
3. **Butir jebakan (4-6):** tiap butir satu-dua kalimat dengan pola tetap: *benda milik Anda* + *apa yang kurang* + *akibat dengan angka dan sumber* ("Form daftar Anda minta nomor WA tanpa izin. ..."). Tanpa pemanasan antar butir; pindah butir cukup dengan "Lalu," atau langsung benda berikutnya. Urutkan dari yang paling akrab ke yang paling mengejutkan.
4. **Kata kunci pembalik:** satu kata atau frasa yang menjelaskan *kenapa* angkanya bisa sebesar itu, diucapkan terpisah dengan jeda ("Kata kuncinya... *per*. Per pelanggan. Per pesan."). Inilah bagian #RumitJadiJelas-nya: mekanisme yang membuat semua butir masuk akal. Bila tidak ada mekanisme pemersatu, jangan pakai struktur ini.
5. **Payoff:** tindakan siap pakai ("Kirim link video ini ke Claude, minta audit semuanya" atau prompt di caption). Video harus bisa dipakai, bukan hanya ditonton; ini alasan orang menyimpan dan membagikannya.
6. **Penutup:** kalimat khas seri bila ada, lalu pertanyaan penutup atau CTA kata kunci (lihat "CTA kata kunci").
Gerbang 2c.5 tetap mutlak: setiap angka dari lembar fakta, pakai "bisa"/"sampai" untuk batas atas, dan tambahkan di caption "Bukan nasihat hukum" bila menyangkut regulasi. Angka akun pembanding (COPPA, CAN-SPAM, dst.) berlaku di AS/UE; jangan disalin untuk penonton Indonesia, cari padanannya lewat `challenge` (UU PDP, aturan e-commerce, hak cipta, perlindungan konsumen).

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
- **Janji di depan, dibayar di akhir (open loop).** Bila naskah punya payoff berupa aset (prompt, checklist, template, hitungan), umumkan di kalimat kedua atau ketiga bahwa aset itu ada di akhir, lalu bayar persis di akhir. Jangan menjanjikan aset yang tidak ditulis lengkap di caption. Tandai kata payoff-nya di blok hook (`Janji:`) agar `/video-karakter` bisa memasang progress bar hitung mundur.
- **Satu alasan untuk simpan atau kirim.** Misalnya aturan satu kalimat yang bisa langsung dipakai, atau sebut siapa yang perlu dengar ("kirim ke admin Anda").
- **Contoh ditutup dengan punchline analogi.** Setelah contoh nyata dari dunia owner, tutup dengan satu kalimat yang mengembalikan contoh ke analogi ("Ini pekerjaan admin, bukan direktur.").
- **Callback di penutup.** Pertanyaan terakhir kembali ke gambaran di hook dan diarahkan ke bisnis penonton ("Jadi, di bisnis Anda... direktur sedang mengerjakan tugas siapa?").
- **Langkah dalam satu kalimat mengalir.** Gabungkan dua atau tiga langkah menjadi satu kalimat ("Tentukan jawaban yang benar, lalu bandingkan hasil, biaya, dan waktunya."), bukan daftar perintah yang terdengar seperti membaca slide.
- **Batas juga memakai analogi** bila bisa, supaya opsi mahal tetap punya tempat ("Untuk masalah rumit dan penuh nuansa, barulah panggil direktur: model terkuat.").
- **Biaya total dalam satu frasa tajam** bila topiknya soal biaya ("hitung sampai pekerjaan selesai, bukan per jawaban").
- **Tanda jeda.** Pakai "..." hanya di tempat yang memang akan diberi jeda saat diucapkan, biasanya sebelum punchline. Maksimal empat per naskah; jangan dipasang hanya karena aturan.
- **CTA kata kunci (opsional, pengguna yang memutuskan).** Alternatif penutup pertanyaan: "Komentar *PROMPT*, saya kirim lengkapnya lewat DM." Di akun pembanding, CTA ini membuat hampir semua komentar berisi kata kunci (sampai 0,8% dari views). Syarat: otomasi DM (mis. ManyChat) sudah aktif dan asetnya ada. Karena menyimpang dari aturan penutup `aulia-brand`, tulis versi penutup pertanyaan sebagai default dan versi CTA kata kunci di kolom Hook cadangan dengan label `CTA alt:`, lalu sebut di "Perlu diisi".
- **Padat dan tidak ambigu (standar 5 Nov 2026).** Draf pertama hampir selalu kelebihan sekitar 30%. Sebelum review:
  - Buang kalimat yang mengulang poin sebelumnya, hedge ("mungkin", "kadang", "sebenarnya") yang tidak membawa makna, dan contoh kedua bila contoh pertama sudah cukup.
  - Sisipan definisi (", fitur yang membolehkan Claude menjalankan kode") pindah ke `Layar:` (label singkat saat kata itu diucapkan) dan caption, bukan diucapkan.
  - Detail sekunder (syarat instal, lisensi, kuota, versi) cukup satu kalimat lisan ("Syarat dan lisensinya ada di caption.") + checklist di layar + teks lengkap di caption.
  - Penanda yang menunda isi ("Di akhir video, saya kasih dua yang jujur.") dipadatkan jadi janji 4-5 kata ("Saya kasih di akhir."). Janji tetap wajib, kalimat khas seri tetap kata per kata.
  - **Satu kata, satu makna.** Kata yang bisa berarti dua hal dilarang. Contoh: "gratisan" bisa berarti paket Free atau biaya Rp0. Pisahkan: biaya → "tanpa bayar sepeser pun"; paket → "paket gratis (Free)", "paket individu, bahkan yang berbayar", "paket bisnis".
  - Daftar paket, harga, dan fitur dicek ulang ke halaman resmi saat menulis (contoh 5 Nov 2026: paket individu Claude = Free, Pro, Max, Ultra). Bila daftar bisa berubah, ucapkan kategorinya ("paket individu") dan tampilkan daftarnya di layar.
  - Memadatkan tidak boleh membuat klaim jadi mutlak: "tiga puluh gambar per detik" → "puluhan gambar per detik"; "Claude nggak menggambar" → "nggak menggambar tiap halaman".
- **Pangkas sebelum selesai.** Hitung kata yang diucapkan (tanpa blok `[HOOK]` selain isi baris Ucap, tanpa baris `[REKAM: ...]`). Jika melebihi batas struktur di tabel durasi, buang dulu kalimat yang mengulang poin, lalu persingkat contoh. Jangan buang langkah tutorial, batas yang material, atau kalimat khas seri.
- **Bahasa pemula.** Istilah teknis dijelaskan saat pertama muncul dengan satu analogi atau padanan ("API key, anggap saja kunci rumah"). Uji: apakah orang yang baru seminggu pakai ChatGPT paham tanpa berhenti?

**Kunci ke lembar fakta:** naskah hanya boleh berisi (1) fakta dari lembar fakta, (2) penalaran atau saran yang jelas berbentuk saran, dan (3) analogi dari bagian "Analogi aman". Jangan menambah klaim fakta, angka, atau generalisasi baru. Butuh fakta tambahan? Tambahkan lewat `challenge` tahap fakta, jangan ditulis langsung.

Jika baris berformat `ucap` tetapi idenya butuh hasil tes atau perbandingan, ubah menjadi kerangka berpikir ("cara menghitung", "yang perlu dicek sebelum memilih") dan beri slot `[ISI: hasil tes]`. CTA tidak boleh menjanjikan sesuatu yang belum ada. Jika nama seri tidak ada di tabel pilar brand, pilih seri yang paling cocok dan tandai di "Yang perlu Anda isi".

### 4a. Challenge teknis
Jalankan `challenge` tahap **cek** untuk seluruh batch dan terapkan koreksinya sebelum review brand, karena koreksi bisa menambah kalimat baru yang perlu dicek brand.

### 4b. Review brand (terpisah)
Kirim naskah ke subagent (`model: sonnet`) dengan instruksi: panggil skill `aulia-brand` mode **Review**, beri verdict dan temuan dengan kutipan. Reviewer juga menilai kedalaman: apakah penonton mendapat sesuatu yang tidak ada di judul beritanya, dan apakah bagian "kenapa" benar-benar menjelaskan mekanisme. Naskah yang dangkal ditandai "Perlu penyesuaian". Untuk Tumpukan jebakan, reviewer mengecek bahwa tiap butir menyebut benda milik penonton dan angka bersumber, ada kata kunci pembalik yang benar-benar menjelaskan mekanisme, dan janji di awal dibayar di akhir; jika salah satu tidak ada, tandai "Perlu penyesuaian". Untuk semua struktur, reviewer mengecek kerangka wajib (bawa pulang, janji dibayar, kait ulang untuk >60 detik, analogi universal), bahasa pemula, kepadatan (jumlah kata dalam batas tabel durasi, tidak ada kalimat yang mengulang atau sisipan definisi yang seharusnya di layar), dan kata yang ambigu; yang hilang ditandai "Perlu penyesuaian". Untuk Tutorial langkah, reviewer mengecek tiap langkah punya `[REKAM: ...]` dan aset yang dijanjikan tertulis lengkap. Untuk naskah mode unlock, reviewer juga mengecek proporsi: bagian kemungkinan harus lebih panjang daripada batas/peringatan, dan hook harus menyebut kemampuan, bukan risiko; jika terbalik, tandai "Perlu penyesuaian". Reviewer juga mengecek kalimat pertama terhadap gerbang hook di tahap 2c (terutama 2c.2: tanpa pemanasan, taruhan sudah ada), dan memastikan kalimat khas seri muncul kata per kata di posisi yang benar; jika hilang atau diparafrasekan, tandai "Perlu penyesuaian". Subagent tidak melihat proses penulisan, hanya naskah + konteks ide. Satu subagent boleh mereview seluruh batch. Jika verdict bukan "Sudah selaras", revisi minimal sesuai temuan. Review ulang hanya jika revisi menambah kalimat baru di luar saran reviewer.

### 5. Cek klaim
Daftar setiap klaim pengalaman pribadi, hasil tes, angka biaya, atau pelanggan. Yang tidak berasal dari lembar fakta atau pernyataan pengguna diganti `[ISI: ...]` di naskah, termasuk semua butir "Perlu konfirmasi Aul". Jangan pernah menulis "saya sudah mencoba" tanpa fakta dari pengguna.

### 6. Output
Tulis satu baris per ide ke tab **Naskah** (kolom dan aturan di [tab-talking-head.md](references/tab-talking-head.md)), seluruh batch dalam satu panggilan. Jangan menulis file lokal.

- Naskah teleprompter: dibuka dengan blok hook, lalu naskah baris per baris:
  ```
  [HOOK 0–3 dtk]
  Ucap: <hook terpilih, kata per kata, lolos gerbang 2c>
  Layar: <teks overlay detik 0–3, maksimal 5 kata>
  Visual: <satu kalimat, memakai kit /video-faceless atau /video-karakter>
  Janji: <kata payoff di akhir, mis. "prompt">   (wajib untuk video >60 dtk)
  Episode: <arc · sebelumnya → berikutnya>   (hanya bila bagian dari arc)
  Meter: <label + angka per butir, mis. "RISIKO: 50 jt, 1,2 M, 6 M">   (hanya Tumpukan jebakan)

  <kalimat kedua dan seterusnya>
  [UI: form · nomor WA tanpa izin]
  <butir jebakan 1>
  [REKAM: HP · Gemini · ketuk ikon plus]
  <langkah tutorial 1>
  ```
  Label `[HOOK ...]`, `Ucap:`, `[UI: ...]`, `[REKAM: ...]`, serta baris Layar, Visual, Janji, Episode, dan Meter tidak dibacakan dan tidak dikirim ke TTS; yang diucapkan hanya isi Ucap lalu teks naskah sesudahnya. `[UI: <jenis> · <isi>]` ditaruh di atas butir yang menyebut layar milik penonton sebagai saran mock untuk `/video-karakter` (jenis: form, checkout, notif, chat, receipt, terminal, email, comments, profile). `[REKAM: <perangkat> · <aplikasi> · <tindakan>]` ditaruh di atas tiap langkah tutorial: daftar rekaman yang perlu dibuat Aulia, sekaligus panduan `/video-karakter` memasang bingkai HP dan stepper.
- Hook cadangan: 2 hook.
- Caption: caption + #RumitJadiJelas + satu hashtag seri.
- Perlu diisi: `[ISI: ...] → kenapa`, daftar `[REKAM: ...]` yang harus direkam, atau `Tidak ada.`
- Sumber: sumber dari lembar fakta, `<judul> (<tanggal>) <url>`.
- Challenge teknis: dari langkah 4a.
- Catatan review: verdict dan temuan reviewer brand, ringkas.
- Potensi: dari uji buta hook utama. `Tertinggi` = kedua persona berhenti di semua putaran; `Tinggi` = kedua persona berhenti, atau persona Pemula AI berhenti dengan alasan "ini soal gue" atau "bisa langsung saya pakai" (`Tinggi (pemula)`); `Sedang (owner)` = hanya persona Owner yang berhenti; `Rendah` = kedua persona scroll setelah dua putaran. Ini perkiraan, bukan jaminan views.
- Hasil uji: `Uji buta <YYYY-MM-DD>.` lalu per persona BERHENTI/SCROLL + alasan singkat, dan hook lama yang gugur beserta masalahnya.

Di chat, urutkan saran posting dari Potensi tertinggi.

Penilaian hook dan hasil uji buta hanya dipakai untuk memilih hook, tidak disimpan.

Setelah baris ditulis dan diverifikasi, ubah Status baris tersebut di tab Talking Head menjadi `lolos-challenge` jika challenge teknis lolos, atau `naskah` jika gagal (hanya kolom Status; baris CORE tidak diubah). Lalu di chat: tabel ringkas per ide (ID, status fresh, hook utama, verdict, jumlah [ISI]) dan tautan sheet.

## Daur ulang pemenang

Naskah yang tembus (pengguna menyebut views-nya, patokan ≥3x median akun) diproduksi ulang dalam 1-2 minggu. Akun pembanding mendapat sekitar 3 juta views dari satu naskah yang diposting ulang tiga kali dengan visual berbeda. Versi yang gagal (19 ribu) bukan karena visual, melainkan isinya diganti topik yang kurang akrab bagi penontonnya.

`/naskah ulang <ID Naskah>`:
1. Baca baris itu di tab Naskah (atau ArchiveN lewat tab `Cari`). Pertahankan inti yang terbukti: taruhan, struktur, kata kunci pembalik, payoff.
2. Ganti hook dengan pola lain dari tahap 2b (uji buta tetap wajib), dan ganti 1-2 butir/contoh dengan fakta baru dari `challenge` (cek freshness ulang semua angka).
3. Jangan ganti topik ke yang lebih jauh dari dunia penonton.
4. Tulis sebagai baris baru di tab Naskah, Judul diberi akhiran `(v2)`, `(v3)`, dan sebut ID asal di Catatan review. Sarankan visual yang berbeda dari versi sebelumnya (peraga kanvas lain, rekam layar vs simulasi, atau talking head).
