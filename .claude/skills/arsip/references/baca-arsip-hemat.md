# Membaca tab arsip dengan hemat token

`ArchiveTH` dan `ArchiveN` bisa berisi ribuan sampai puluhan ribu baris. **Jangan pernah membaca tab arsip secara penuh**, termasuk satu kolom penuh seperti `ArchiveTH!A:A` atau `ArchiveTH!H:H`, dan jangan memakai `get_spreadsheet` dengan `includeGridData`. Biarkan Sheets yang menghitung atau menyaring, lalu baca hasilnya saja.

## Tab bantu `Cari`
Tab tersembunyi `Cari` (sheetId `87447762`) dipakai untuk query sekali pakai. Jika tab itu belum ada, buat dengan `addSheet` (`hidden: true`, 20 x 3).
1. Tulis rumus dengan `update_formulas` ke `Cari!A1:A<n>`. Satu sel untuk satu pertanyaan. Kumpulkan semua pertanyaan dalam satu panggilan.
2. Baca `Cari!A1:A<n>` dengan `get_values`.
3. Kosongkan dengan `batch_clear_values` `["Cari!A1:C20"]`. Selalu kosongkan, juga saat ada error.

Hasil yang mengembalikan daftar ID dibatasi dengan `TEXTJOIN`. Jika daftarnya panjang (lebih dari ±50 ID), persempit kata kuncinya, jangan menarik semuanya.

## Rumus (sudah diuji di sheet ini)
| Pertanyaan | Rumus |
|---|---|
| Jumlah baris terisi (termasuk header). Baris kosong berikutnya = hasil + 1 | `=COUNTA(ArchiveTH!A:A)` |
| Nomor ID TH terbesar di Talking Head dan arsip | `=MAX(ARRAYFORMULA(IFERROR(VALUE(MID({ArchiveTH!A2:A;'Talking Head'!A2:A},4,9)),0)))` |
| Anti dobel: ID arsip yang Topik atau Anggapan-nya memuat kata kunci | `=IFERROR(TEXTJOIN(",",TRUE,FILTER(ArchiveTH!A2:A,REGEXMATCH(LOWER(ArchiveTH!H2:H&" "&ArchiveTH!I2:I),"synthid\|tanda air"))),"-")` |
| ID mana dari daftar ini yang sudah ada di arsip | `=IFERROR(TEXTJOIN(",",TRUE,FILTER(ArchiveTH!A2:A,COUNTIF({"TH-067";"TH-068"},ArchiveTH!A2:A))),"-")` |
| Nomor baris (sheet) dari satu ID di arsip | `=IFERROR(MATCH("TH-067",ArchiveTH!A:A,0),"-")` |
| Duplikat ID di arsip | `=IFERROR(TEXTJOIN(",",TRUE,FILTER(ArchiveTH!A2:A,COUNTIF(ArchiveTH!A2:A,ArchiveTH!A2:A)>1)),"-")` |
| Jumlah karakter suatu rentang, untuk verifikasi | `=SUMPRODUCT(LEN(ArchiveN!C60:C67))` |

Catatan:
- Di tabel ini `\|` berarti `|`. Dalam rumus asli, pisahkan kata kunci dengan `|` biasa, huruf kecil, tanpa spasi di sekitar `|`. Pakai 2-4 kata kunci inti per ide, termasuk sinonim Indonesia dan Inggris (misalnya `tanda air|watermark|synthid`).
- `IFERROR(...)` di dalam array tanpa `ARRAYFORMULA` hanya menghitung sel pertama. Bungkus dengan `ARRAYFORMULA` seperti pada rumus ID terbesar.
- Untuk ArchiveN, ganti nama tab dan kolomnya: ID di A, Judul di B.

## Setelah dapat ID
Baca hanya baris yang dibutuhkan, dengan rentang sempit. Contoh: `ArchiveTH!A120:N120`, atau hanya kolom yang perlu, seperti `ArchiveTH!H120:J120`. Cari nomor baris dengan rumus `MATCH`, jangan dengan membaca kolom A.
