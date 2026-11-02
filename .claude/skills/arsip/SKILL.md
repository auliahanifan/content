---
name: arsip
description: Rapikan Google Sheet content bank Aulia Rahman dengan memindahkan baris lama dari tab "Talking Head" ke "ArchiveTH" dan dari tab "Naskah" ke "ArchiveN" bila umurnya lebih dari X hari (default 14). Baris dipindah utuh (nilai dan format), bukan disalin ulang. Gunakan ketika pengguna meminta /arsip, arsipkan, bersihkan, atau rapikan tab Talking Head atau Naskah karena barisnya terlalu banyak.
---

# Arsip Talking Head dan Naskah

Baca dulu `.claude/skills/naskah/references/tab-talking-head.md` (kolom tab, aturan tulis sheet) dan, sebelum menulis pertama kali, skill `google-workspace` beserta `references/sheets.md`-nya.

Sheet: content bank di `CLAUDE.md` (ID `1CWo1QCbJv_W-4L2AV5qGU3S-1JWf1CqdR0GMVnZyYMY`). Butuh konektor **Google Sheets**; muat dengan ToolSearch "google sheets". Jika tidak ada, berhenti dan minta pengguna mengaktifkannya.

## Input
- `/arsip`: X = 14 hari, kedua tab.
- `/arsip <X>`: X hari, kedua tab.
- `/arsip <X> th` atau `/arsip <X> naskah`: hanya satu tab.
- `/arsip ... --ya`: lewati konfirmasi (hanya jika pengguna menulisnya sendiri).

## Pasangan tab dan kolom umur
| Tab sumber | Tab arsip | Kolom umur |
|---|---|---|
| `Talking Head` | `ArchiveTH` | `Tanggal` (B) |
| `Naskah` | `ArchiveN` | `Diperbarui` |

Cari kolom dari nama header, jangan dari huruf, karena kolom bisa bertambah. Jika tab arsip belum ada, buat dengan `addSheet`, salin baris header sumber, dan bekukan baris 1.

## Aturan pilih baris
- Hari ini = tanggal sistem (zona Asia/Jakarta). Baris dipindah jika `hari ini - tanggal > X` hari.
- Tanggal kosong atau tidak berformat `YYYY-MM-DD`: jangan dipindah, laporkan.
- Talking Head berstatus `dipilih` tidak dipindah walau lama, karena sedang menunggu `/naskah`. Status lain (`usulan`, `naskah`, `lolos-challenge`, `rekam`, `posting`, `arsip`) ikut dipindah.
- Naskah dipindah hanya dari umur `Diperbarui`; status di Talking Head tidak dicek.
- Jangan pernah mengubah tab CORE, Fakta, atau tab lain.

## Langkah
1. **Baca.** `get_spreadsheet` dengan fields `sheets.properties` untuk sheetId dan rowCount. Baca seluruh tab sumber dan kolom A tab arsip. Bandingkan header sumber dengan header arsip; jika arsip kurang kolom (misalnya ArchiveN belum punya `Potensi` dan `Hasil uji`), lengkapi header arsip dulu dengan header sumber.
2. **Rencana (dry run).** Tampilkan tabel per tab: ID, tanggal, umur (hari), status, judul/topik singkat. Sebutkan juga baris yang dilewati (status `dipilih`, tanggal rusak) dan ID yang sudah ada di arsip. Minta konfirmasi pengguna sebelum menulis, kecuali `--ya`. Jika tidak ada baris yang lolos, berhenti di sini.
3. **Pindah, satu `update_spreadsheet` per tab sumber**, agar salin dan hapus terjadi bersama atau gagal bersama. Urutan request:
   1. `appendDimension` di tab arsip bila baris kosong tidak cukup.
   2. `copyPaste` (pasteType `PASTE_NORMAL`) dari tab sumber ke tab arsip, satu request per blok baris yang bersebelahan. Ini memindahkan nilai, format, dan teks multibaris persis seperti aslinya; jangan memakai `get_values` lalu `append_values` karena tanggal dan sel berawalan `-` bisa terbaca ulang.
      - Baris tujuan: setelah baris terakhir yang berisi ID di kolom A arsip.
      - Jika ID sudah ada di arsip, tempel di baris arsip itu (timpa), jangan menambah duplikat.
   3. `deleteDimension` (ROWS) di tab sumber untuk setiap blok, **dari bawah ke atas** agar indeks tidak bergeser.
   Indeks GridRange berbasis 0 dan `endIndex` eksklusif: baris sheet n = indeks n-1.
4. **Verifikasi.** Baca ulang kedua tab. Cocokkan: jumlah baris sumber berkurang sebanyak yang dipindah, setiap ID yang dipindah ada tepat satu kali di arsip dan tidak lagi di sumber, dan baris yang tidak dipindah masih utuh (bandingkan daftar ID sebelum dan sesudah). Untuk Naskah, cocokkan juga jumlah karakter kolom `Naskah teleprompter` per ID antara data awal dan arsip. Jika ada yang tidak cocok, berhenti dan laporkan; jangan mencoba memperbaiki dengan menghapus lagi.

## Laporan
Tabel ringkas: tab, jumlah dipindah, ID yang dipindah, yang dilewati beserta alasan, sisa baris di tab sumber, dan tautan sheet. Sebutkan duplikat ID yang sudah ada di arsip sebelum skill berjalan (jangan dihapus otomatis; tawarkan ke pengguna).
