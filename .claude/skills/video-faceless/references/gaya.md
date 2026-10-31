# Gaya & komponen (lihat examples/contributor-build.py untuk pemakaian nyata)

Kanvas 1080x1920. Latar mist, kartu putih, kobalt = aksen/kata kunci, mint = benar/hemat, amber = peringatan, koral = bahaya/coretan.

## Komponen `lib.py`
`Words` (T/E) · `box cyl sphere cone pipe ring` (peta iso, U=92, origin `o=(x,y)`) · `captions()` · `clip card chip head` · `persistent_head(EXP,...)` · `sfx_html(events)` · `page(...)`.
CSS dasar ada di `BASE_CSS`; CSS khusus adegan lewat `extra_css`.
Ikon clay: `assets/img/clay-*.png` (laptop robot money-bag package gear chart-increasing light-bulb magnifying-glass hourglass).

## Peta adegan (pola yang terbukti)
Hook (angka raksasa + kartu harga dicoret + peta iso) → kartu bukti (screenshot + cincin sorot) → peta iso penjelas (label chip dengan `lblpos`) → kutipan (chip quote + sorot) → timeline/bar sebelum-sesudah → amplop/kotak surat metafora → antarmuka pengaturan (toggle) → "tukar tambah" (ikon ⇄ lalu =) → penutup gelap berisi pertanyaan.
Perubahan adegan = SFX `whoosh`; angka/benda muncul = `pop`; klimaks = `impact`; benar = `ding`; peringatan = `glitch`.

## Aturan keras
- Caption di y≈1296; jangan ada elemen lain menimpa area itu. Kepala kiri bawah (`#ph`, top 1468) — beri tahu pengguna bahwa UI Reels menutup y>1500.
- Ekspresi kepala (15 stok: berpikir bingung kagum kesal khawatir lega mengantuk mengedip netral ragu sedih senyum terkejut tertawa yakin) **harus tepat sesuai kalimat**; ganti di `T(kata)-.05`. Pengguna sangat peduli ini.
- Cincin sorot di dalam `card(...)` memakai posisi **persen** (`left:%;top:%`), bukan piksel — pernah meleset.
- Peta iso: pindahkan `o` agar tidak menabrak caption/judul; label chip tidak boleh terpotong.
- Hindari `tl.fromTo` dengan `immediateRender` untuk elemen yang muncul belakangan (menampilkan keadaan awal terlalu cepat): pakai `immediateRender:false` atau `tl.set`.
- Elemen berurutan yang saling timpa pada track sama: kecilkan opasitas yang lama (`fade`) sebelum yang baru (`check` akan mengeluh).
- Kontras teks ≥ AA (mis. teks coretan `#8F95A1`, bukan abu muda).
- Regex untuk menghapus baris `+ '<...>'` di build.py pernah menelan tanda kurung penutup: edit dengan tangan, lalu `python3 -c "import ast;ast.parse(open('build.py').read())"`.
- Tanpa `drawtext` di ffmpeg ini; SFX disintesis `aevalsrc` (`sfx.sh`), file bawaan lama berkresek jadi jangan dipakai.
- Screenshot sumber: klip pakai koordinat halaman (tambah scrollY), DPR 2, sorot via style inline (`shot.mjs` sudah menangani).
- Logo seri terbang: `tl.to(["#series","#seriesw"],{x:120,y:420,scale:3.4,...})` di awal kalimat penutup, kembali `x:0,y:0,scale:1` sesudahnya; pada penutup gelap kedua logo/tanda tangan berganti versi putih (`#seriesw`, `#sigw`).
