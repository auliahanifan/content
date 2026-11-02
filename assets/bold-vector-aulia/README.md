# Bold Vector Aulia

Bentuk tegas dengan outline navy dan palet kontras.

Paket awal pembanding berisi lima PNG transparan:

- `characters/netral.png`: presenter netral tanpa efek.
- `reactions/deadline-samurai.png`: membelah jam deadline.
- `reactions/raja-multitasking.png`: enam lengan energi di belakang dua lengan asli.
- `reactions/bangkit-lagi.png`: transformasi phoenix.
- `effects/sayap-phoenix.png`: sayap mandiri untuk dipadukan dengan pose netral.

Buka `preview.html` untuk memeriksa hasil di latar gelap, terang atau checkerboard. Ukuran dan alpha asli tercatat di `manifest.json`. `preview-gallery.png` adalah tangkapan katalog. `pack.json` berisi inventaris; `python build-catalog.py` membangun ulang manifest dan HTML dengan Pillow tanpa mengubah pixel gambar.

## Remotion

Salin folder `characters`, `reactions`, dan `effects` ke `public/assets/bold-vector-aulia/` proyekmu, lalu salin `remotion/Aulia.tsx` ke source. React dan Remotion mengikuti dependency proyek.

```tsx
import {Sequence} from 'remotion';
import {Aulia} from './Aulia';

<Sequence from={30} durationInFrames={90}>
  <Aulia pose="netral" wings size={900} />
</Sequence>
```

Komponen menyediakan animasi masuk, hover untuk multitasking, dan denyut sayap terpisah. Gunakan `animate={false}` untuk gambar statis. `assetRoot`, `size` dan `style` bisa disesuaikan. Mount di `Sequence` baru untuk memulai ulang gerak. Semua gerak mengikuti frame/fps Remotion.

## Studio Remotion di repo ini

`remotion/public/shared` sudah menaut ke folder `assets/`. Setelah komponen disalin ke source studio, pakai `assetRoot="shared/bold-vector-aulia"` agar PNG langsung dibaca dari paket ini tanpa menyalinnya ke public lagi. Hal ini tidak otomatis mengganti karakter default atau storyboard video yang sudah ada.

Catatan gaya: shading dan glow lembut masih terlihat pada hasil generasi. Ini ilustrasi raster bergaya vector, bukan SVG atau gambar yang sepenuhnya memakai warna datar.

## Batas teknis dan provenance

Ini PNG diam; bukan SVG, file berlayer, model 3D, atau sprite animasi. Kepala, tangan dan properti di pose belum dipisah. Termasuk pada gaya paper cutout, tampilan lapisan kertas masih menyatu dalam PNG. Hanya file `effects/sayap-phoenix.png` yang merupakan layer efek terpisah. Skala dan proporsi antarpose dapat bervariasi; komponen memakai `objectFit: contain`, bukan normalisasi tinggi tubuh.

ImageGen memakai referensi wajah `assets/kepala-netral.png`, karakter `assets/karakter-referensi.png`, serta komposisi Pixel Aulia. Gaya Bold Vector dibuat ulang dari referensi tersebut. Hasil generasi disalin tanpa perubahan pixel lokal. Produksi 2026-11-02. TSX diperiksa melalui bundling dengan dependency React/Remotion eksternal; belum dirender menjadi video.
