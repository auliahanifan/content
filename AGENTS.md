# AGENTS.md

## Codex dan Claude Code

- Baca `CLAUDE.md` di root sebelum bekerja. File itu menjadi acuan bersama untuk struktur proyek, Google Sheet content bank, transkripsi lokal, aset, HyperFrames, dan Remotion. Aturan tambahan di `AGENTS.md` ini tetap berlaku.
- Skill Codex ada di `.agents/skills/`. Folder skill ditautkan ke `.claude/skills/` agar instruksi, referensi, dan skrip yang dipakai kedua aplikasi selalu sama. Pengecualian: `social` disimpan di `.agents/skills/social/` dan ditautkan dari Claude Code. Edit sumber aslinya, jangan membuat salinan terpisah.
- Saat menambah skill di `.claude/skills/<nama>/`, tambahkan symlink relatif `.agents/skills/<nama> -> ../../.claude/skills/<nama>`. Sertakan folder sumber beserta symlink saat commit agar berfungsi di checkout lain.
- Di Codex, panggil skill dengan `$nama-skill` (misalnya `$naskah`, `$ide-konten`, `$video-karakter`) atau pilih lewat `/skills`. Jika pengguna menulis bentuk Claude seperti `/naskah`, baca dan jalankan `.agents/skills/naskah/SKILL.md` dengan argumen yang sama; bentuk slash itu adalah maksud pengguna, bukan jaminan adanya perintah bawaan Codex.
- Sebelum menjalankan workflow, baca `SKILL.md` dan referensi yang diwajibkannya. Jalur `.claude/skills/...` tetap valid; jalur relatif dihitung dari folder skill atau referensi yang menyebutnya. Jangan mengganti jalur skrip hanya karena skill dibuka lewat `.agents/`.
- Terjemahkan nama tool Claude ke kemampuan yang tersedia di sesi Codex: `Read`/`Glob`/`Grep` ke pembacaan file dan `rg`, `Bash` ke terminal, `Edit`/`Write` ke pengeditan file, `WebSearch`/`WebFetch` ke pencarian dan pembukaan sumber web, serta `AskUserQuestion` ke pertanyaan pengguna. Pertahankan urutan, batasan, dan hasil yang diminta workflow.
- Jika skill meminta `Task`/subagent atau `SendMessage`, gunakan fasilitas subagent Codex bila tersedia. Nama model Claude seperti `opus` bukan ID model Codex: gunakan model Codex yang tersedia, pertahankan pemisahan penulis dan pemeriksa, dan jangan mengklaim memakai model Claude. Jika subagent tidak tersedia, jelaskan bahwa pemeriksaan independen belum dijalankan.
- Tool dan kredensial Claude Code tidak otomatis tersedia di Codex. Periksa konektor atau CLI yang tersedia untuk Google Sheets, Buffer, ElevenLabs, dan layanan lain. Bila akses yang diperlukan tidak ada, jelaskan bagian yang terhambat; jangan mengklaim sudah membaca, menulis, mengirim, atau merender tanpa bukti hasilnya.
- Simpan proyek dan hasil sesuai `CLAUDE.md` dan skill terkait. Periksa artefak akhir sesuai workflow sebelum menyerahkannya.

## Menemukan skill lokal di cloud

- Jika skill tidak muncul di katalog skill cloud atau executor, periksa file dalam repo sebelum menyatakan skill tidak tersedia atau meminta pengguna mengunggahnya.
- Contoh: `$ide-threads` atau `/ide-threads` merujuk ke `.agents/skills/ide-threads/SKILL.md`, dengan sumber asli di `.claude/skills/ide-threads/SKILL.md`. Baca sumber asli langsung bila tautan tidak tersedia.
- Untuk melihat file panduan skill sumber, jalankan `rg --files --hidden .claude/skills -g SKILL.md` dari root repo. Skill khusus `social` ada di `.agents/skills/social/SKILL.md`.

## Ide konten: batas usia sumber

- Jangan ambil ide konten dari sumber yang terbit lebih dari 6 bulan lalu. Tahun lalu tidak boleh.
- Aturan ini paling ketat untuk paper dan naskah ilmiah: hanya studi yang terbit atau direvisi substansial dalam 6 bulan terakhir (hitung dari tanggal sistem hari ini).
- Paper lama yang ditulis ulang atau direvisi kecil tidak dihitung baru. Pakai tanggal terbit asli.
- Berlaku untuk `/ide-konten`, `/naskah` (mode pecah dan naskah), dan `/challenge`. `tab-talking-head.md` sudah memuat batas 6 bulan yang sama.
- Jika tidak ada studi dalam 6 bulan untuk suatu klaim, ide itu dibuang, bukan diisi dengan paper lama.

## Cover Reels/TikTok: komposisi dan crop thumbnail

- Untuk cover TikTok, desain komposisi utama pada **1080 × 1440 px (3:4)**. Ini patokan dari tampilan thumbnail pada screenshot pengguna, bukan spesifikasi resmi yang dijamin berlaku di semua tampilan TikTok.
- Sediakan thumbnail **1080 × 1440** dan versi cover vertikal **1080 × 1920 (9:16)**. Pada versi 9:16, tempatkan komposisi 3:4 utuh di tengah, yaitu **y=240–1680**. Bagian atas dan bawah masing-masing 240 px hanya untuk latar.
- Semua elemen penting, termasuk kedua logo, judul, wajah, dan objek utama, harus berada di dalam area 3:4 dengan jarak dari tepinya. Jangan menaruh logo di bagian atas/bawah canvas 9:16 yang akan terpotong. Hindari area kiri bawah thumbnail untuk elemen penting karena ikon jumlah tayangan dapat menutupinya.
- **Stiker wajah Aulia harus besar, di tengah, dan menjadi pusat perhatian utama.** Gunakan referensi wajah dari `assets/`; pertahankan identitas dan ekspresinya. Ilustrasi atau objek pendukung tidak boleh mengalahkan atau menutupi wajah.
- Gunakan logo asli **`assets/aulia-rahman.svg`** dan **`assets/sing-murah-wae.svg`**. Jangan mengganti logo dengan tulisan biasa atau hasil generasi AI. Tempelkan aset asli saat komposisi akhir; varian putih boleh dipakai pada latar gelap dengan bentuk logo tetap sama.
- Aulia Rahman Design System menjadi acuan warna dan identitas, tetapi tidak perlu diikuti secara kaku kecuali diminta. Preferensi pengguna untuk cover: gaya gambar hasil generasi dengan **3D clay, judul tebal, dan wajah dominan**.
- Sebelum menyerahkan hasil, periksa preview **crop tengah 3:4** dari versi 9:16: kedua logo, judul, dan seluruh wajah harus terlihat utuh. Pastikan crop tersebut sama dengan file thumbnail 3:4, serta periksa keterbacaan pada ukuran kecil.
