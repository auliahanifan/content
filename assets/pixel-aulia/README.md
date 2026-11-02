# Pixel Aulia — Vol. 2

Library karakter personal brand Aulia untuk video Remotion. Mengikuti arah **06 Outlined**: rambut keriting hitam, kacamata persegi, kumis/janggut tipis, blazer navy, kaos hitam, celana charcoal dan sneakers putih.

## 22 PNG transparan

| Folder | Jumlah | Isi |
| --- | --- | --- |
| `characters/` | 7 | netral, menjelaskan, menunjuk, berpikir, setuju, menyapa, stop |
| `reactions/` | 12 | murka, fokus, kaget, percaya-diri, sedih, semangat, bingung, lelah, dapat-ide, tertawa, skeptis, menang |
| `effects/` | 3 | aura-emas, petir-biru, impact-ungu |

**Pose presenter** tidak memiliki aura sehingga bisa dipakai saat narasi biasa. **Reaksi anime** memiliki pose dan efek yang menyatu. **Efek terpisah** dapat ditempatkan sebagai layer mandiri di belakang pose presenter.

| Pose / reaksi | Contoh pemakaian |
| --- | --- |
| netral / menjelaskan | Narasi, penjelasan konsep, pembuka |
| menyapa | Intro dan outro |
| menunjuk | Mengarahkan perhatian ke teks, grafik, atau screenshot di kanan |
| berpikir / bingung | Pertanyaan, asumsi, banyak pilihan |
| setuju / percaya-diri | Rekomendasi atau solusi |
| stop / skeptis | Membantah mitos, mengoreksi klaim |
| murka | Kesal, protes, proses yang menyulitkan |
| fokus | Analisis serius, siap mengeksekusi |
| kaget | Fakta mengejutkan, plot twist |
| sedih / lelah | Kegagalan, burnout, proses yang melelahkan |
| semangat / menang | Ajakan bertindak, hasil, keberhasilan |
| dapat-ide | Insight atau solusi |
| tertawa | Punchline dan humor |

## Preview dan metadata

Buka `preview.html` langsung di browser. Bagian “Coba pose + efek” memungkinkan pemilihan pose, efek dan skala efek tanpa mengubah PNG. Filter membagi pose, reaksi, dan efek; latar gelap/terang/checkerboard membantu memeriksa transparansi. `preview-gallery.png` adalah tangkapan katalog. `manifest.json` mencatat ukuran asli, alpha bounds, bounds pada alpha ≥128, fraksi pixel transparan dan jenis layer.

`references/` menyimpan dua board eksplorasi. `build-catalog.py` memeriksa file PNG serta transparansi dan membangun ulang katalog/manifest (Python + Pillow; tidak mengubah pixel gambar):

```sh
python build-catalog.py
```

## Pakai di Remotion

1. Salin `characters/`, `reactions/`, dan `effects/` ke `public/assets/pixel-aulia/` proyek Remotion.
2. Salin `remotion/PixelAulia.tsx` ke source proyek. React dan Remotion memakai dependency proyekmu.
3. Gunakan di dalam `Sequence` supaya animasi masuk dimulai saat pose tampil:

```tsx
import {Sequence} from 'remotion';
import {PixelAulia} from './PixelAulia';

<Sequence from={60} durationInFrames={75}>
  <PixelAulia mood="menjelaskan" effect="aura-emas" size={800} />
</Sequence>
```

Prop `effect` menambah layer VFX di belakang karakter. Layer efek berdenyut terpisah, sedangkan karakter memiliki animasi masuk; murka/semangat mendapat shake dan percaya-diri/dapat-ide mendapat hover. Semua gerakan mengikuti frame Remotion.

- `effectScale`, `effectOffsetX`, `effectOffsetY`: sesuaikan besar/posisi efek tanpa mengubah karakter.
- `animate={false}`: matikan gerakan dan tampilkan gambar statis.
- `assetRoot`: ubah lokasi relatif terhadap `public/` bila diperlukan.
- `size`: ukuran kotak gambar, bukan tinggi tubuh yang terdeteksi.
- `style`: atur container, misalnya `position: 'absolute', bottom: 40, left: 40`.

`remotion/Example.tsx` menyediakan showcase seluruh 19 pose/reaksi, masing-masing dua detik, dan contoh kombinasi pose+efek. Komposisi showcase: 1080×1920; gunakan `durationInFrames={pixelAuliaShowcaseDuration(fps)}`. Pada 30 fps durasinya 1140 frame (38 detik).

Untuk narasi biasa, gunakan pose bersih selama beberapa detik. Sisipkan reaksi epik pada punchline/insight selama sekitar 0,5–1,5 detik. Reaksi yang efeknya sudah menyatu biasanya tidak perlu ditambah layer efek lain.

## Batas teknis

Semua aset adalah PNG diam bergaya pixel. Belum berupa sprite animasi frame-by-frame, lip-sync, atau rig tubuh. Kepala, tangan dan mulut belum dipisah. Pada `reactions/`, karakter dan aura menyatu; hanya aset di `effects/` yang benar-benar terpisah.

Gambar dihasilkan secara terpisah dari referensi yang sama, sehingga skala figur, proporsi dan kepadatan pixel dapat bervariasi. Komponen memakai `objectFit: contain`, bukan normalisasi tubuh. Periksa skala saat berganti pose. Alpha lembut di sekitar cahaya adalah bagian VFX. Pusat efek dimaksudkan sebagai ruang karakter tetapi sebagian percikan dapat melewatinya.

Contoh TSX diperiksa melalui bundling dengan esbuild (React/Remotion sebagai dependency eksternal). Belum dirender sebagai video di proyek Remotion; workspace ini tidak berisi aplikasi Remotion.

## Provenance

Dibuat dengan ImageGen dari board `references/styles-3x3.png` (06 Outlined), `references/moods-3x3.png`, dan avatar netral. Hasil generasi disalin tanpa penghapusan background, resize atau pengubahan pixel secara lokal. Produksi: 2026-11-02. Board referensi bukan aset transparan; PNG di `characters/`, `reactions/`, dan `effects/` memiliki alpha transparan.
