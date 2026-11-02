---
name: arsip
description: Rapikan Google Sheet content bank Aulia Rahman dengan memindahkan baris lama dari tab "Talking Head" ke "ArchiveTH" dan dari tab "Naskah" ke "ArchiveN" bila umurnya lebih dari X hari (default 14). Baris dipindah utuh (nilai dan format) di sisi server tanpa membaca isi arsip, sehingga tetap hemat token walau arsip berisi puluhan ribu baris. Gunakan ketika pengguna meminta /arsip, arsipkan, bersihkan, atau rapikan tab Talking Head atau Naskah karena barisnya terlalu banyak.
---

# Arsip Talking Head dan Naskah

Baca dulu [baca-arsip-hemat.md](references/baca-arsip-hemat.md). Arsip bisa berisi puluhan ribu baris, jadi **jangan pernah membaca tab arsip secara penuh**. Semua informasi dari arsip (baris terakhir, duplikat, verifikasi) didapat lewat rumus di tab bantu `Cari`.

Sheet: content bank di `CLAUDE.md` (ID `1CWo1QCbJv_W-4L2AV5qGU3S-1JWf1CqdR0GMVnZyYMY`). Butuh konektor **Google Sheets**; muat dengan ToolSearch "google sheets". Jika tidak ada, berhenti dan minta pengguna mengaktifkannya.

## Input
- `/arsip`: X = 14 hari, kedua tab.
- `/arsip <X>`: X hari, kedua tab.
- `/arsip <X> th` atau `/arsip <X> naskah`: hanya satu tab.
- `/arsip ... --ya`: lewati konfirmasi (hanya jika pengguna menulisnya sendiri).

## Pasangan tab
| Tab sumber | sheetId | Tab arsip | sheetId | Kolom yang dibaca dari sumber |
|---|---|---|---|---|
| `Talking Head` | 1001 | `ArchiveTH` | 768621504 | A (ID), B (Tanggal), H (Topik), N (Status) |
| `Naskah` | 1002 | `ArchiveN` | 1031784940 | A (ID), B (Judul), J (Diperbarui) |

Jika sheetId tidak cocok, ambil ulang dengan `get_spreadsheet` fields `sheets.properties.sheetId,sheets.properties.title,sheets.properties.gridProperties`. Jumlah kolom (`columnCount`) dan header sumber dibaca dari metadata dan baris 1, bukan dari asumsi. Jika header arsip berbeda dari sumber, salin baris 1 sumber ke arsip dengan `copyPaste` (tambah kolom dengan `appendDimension` bila perlu).

Baca tab sumber hanya pada kolom di atas, jangan seluruh baris: teks naskah dan padahal tidak perlu dibaca untuk dipindah.

## Aturan pilih baris
- Hari ini = tanggal sistem (zona Asia/Jakarta). Baris dipindah jika `hari ini - tanggal > X` hari.
- Tanggal kosong atau tidak berformat `YYYY-MM-DD`: jangan dipindah, laporkan.
- Talking Head berstatus `dipilih` tidak dipindah walau lama, karena sedang menunggu `/naskah`. Status lain ikut dipindah.
- Naskah dipindah hanya dari umur `Diperbarui`.
- Jangan pernah mengubah tab CORE, Fakta, atau tab lain selain pasangan di atas dan `Cari`.

## Langkah
1. **Baca sumber (kolom sempit) dan pilih baris.** Kelompokkan baris terpilih menjadi blok baris bersebelahan.
2. **Satu query ke `Cari`** untuk tiap tab arsip yang terlibat (semua rumus dalam satu panggilan):
   - `=COUNTA(<arsip>!A:A)`: baris kosong berikutnya.
   - ID terpilih yang sudah ada di arsip (rumus `COUNTIF` daftar ID), lalu `MATCH` untuk nomor barisnya.
   - `=SUMPRODUCT(LEN(<sumber>!A<r1>:<kolom terakhir><r2>))` per blok, sebagai hitungan karakter sebelum pindah.
   Baca hasilnya, lalu kosongkan `Cari`.
3. **Rencana (dry run).** Tampilkan tabel per tab: ID, tanggal, umur (hari), status, topik/judul singkat; baris yang dilewati beserta alasannya; ID yang sudah ada di arsip (akan ditimpa di barisnya). Minta konfirmasi, kecuali `--ya`. Jika tidak ada baris yang lolos, berhenti.
4. **Pindah, satu `update_spreadsheet` untuk semua tab** (atomik: gagal satu, gagal semua). Urutan request:
   1. `appendDimension` ROWS di tab arsip bila `gridProperties.rowCount` kurang dari baris tujuan terakhir.
   2. `copyPaste` (pasteType `PASTE_NORMAL`) per blok, dari sumber ke arsip. Data disalin di server, jadi isinya tidak lewat konteks. ID yang sudah ada di arsip ditempel di baris arsipnya (timpa); sisanya mulai dari baris kosong berikutnya. Jangan memakai `get_values` lalu `append_values`.
   3. `deleteDimension` ROWS di sumber per blok, **dari bawah ke atas**.
   Indeks GridRange berbasis 0 dan `endIndex` eksklusif: baris sheet n = indeks n-1.
5. **Verifikasi tanpa membaca isi arsip.** Satu query ke `Cari`:
   - `=SUMPRODUCT(LEN(...))` pada rentang tujuan di arsip harus sama dengan hitungan langkah 2 (jumlahkan per blok; untuk ID yang ditimpa, bandingkan per baris).
   - `COUNTIF` tiap ID yang dipindah di arsip harus 1, dan di sumber harus 0.
   - `=COUNTA(<arsip>!A:A)` harus naik sebanyak baris baru.
   Lalu baca ulang kolom A sumber dan cocokkan daftar ID yang tersisa dengan rencana. Kosongkan `Cari`. Jika ada yang tidak cocok, berhenti dan laporkan; jangan mencoba memperbaiki dengan menghapus lagi.

## Laporan
Tabel ringkas: tab, jumlah dipindah, rentang ID yang dipindah, yang dilewati beserta alasannya, sisa baris di sumber, total baris arsip (dari `COUNTA`), dan tautan sheet.
