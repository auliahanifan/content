# Pixel Aulia — Epic Anime Reactions

Karakter personal brand Aulia, berdasarkan eksplorasi **06 Outlined**: rambut keriting hitam, kacamata persegi, kumis/janggut tipis, blazer navy, kaos hitam, celana charcoal, sneakers putih.

## Isi paket

- `characters/netral.png`: avatar dasar tanpa aura.
- `reactions/`: sembilan reaksi anime dengan efek, masing-masing PNG transparan.
- `references/`: dua board eksplorasi sebagai acuan art direction.
- `build-catalog.py`: pemeriksa metadata/transparansi dan pembuat ulang katalog (Python + Pillow; tidak mengubah gambar).
- `manifest.json`: ukuran asli, alpha bounds, nama mood dan path setiap aset.
- `preview.html`: katalog lokal; buka langsung di browser. Tombol mengganti latar untuk memeriksa transparansi.
- `remotion/PixelAulia.tsx`: komponen pemilih mood, animasi masuk, shake dan hover yang mengikuti frame.
- `remotion/Example.tsx`: contoh showcase 10 mood, masing-masing dua detik.

| Mood | Penggunaan |
| --- | --- |
| netral | Narasi biasa / jeda antarreaksi |
| murka | Kesal, protes, hal yang bikin emosi |
| fokus | Analisis serius / siap mengeksekusi |
| kaget | Fakta mengejutkan / plot twist |
| percaya-diri | Yakin dengan solusi / hasil terbukti |
| sedih | Kegagalan / kehilangan / hasil mengecewakan |
| semangat | Ajakan bertindak / mulai eksekusi |
| bingung | Klaim rancu / terlalu banyak pilihan |
| lelah | Burnout / usaha berlebihan / habis tenaga |
| dapat-ide | Insight / solusi / momen paham |

## Pakai di Remotion

1. Salin `characters/` dan `reactions/` ke `public/assets/pixel-aulia/` di proyek Remotion.
2. Salin `remotion/PixelAulia.tsx` ke source proyek; React dan Remotion menggunakan dependency proyekmu.
3. Gunakan di dalam `Sequence` agar animasi masuk dimulai saat reaksi muncul:

```tsx
import {Sequence} from 'remotion';
import {PixelAulia} from './PixelAulia';

<Sequence from={60} durationInFrames={75}>
  <PixelAulia mood="murka" size={800} />
</Sequence>
```

Gunakan `animate={false}` untuk gambar diam. Ubah `assetRoot` jika lokasi di public berbeda. Atur posisi dengan parent atau prop `style`. Contoh showcase: komposisi 1080×1920, 30fps, 600 frame (20 detik).

## Batas teknis

Aset adalah ilustrasi PNG bergaya pixel, bukan sprite animasi frame-by-frame atau rig tubuh. Aura dan karakter pada setiap PNG reaksi menyatu. Contoh Remotion menggerakkan keseluruhan gambar; tidak membuat mulut, tangan atau aura bergerak independen. Gunakan pose berbeda lewat Sequence. Animasi aura independen dan lip-sync memerlukan layer/frame tambahan.

Setiap gambar dibuat secara terpisah dari referensi yang sama, sehingga skala figur, pose dan kepadatan pixel bisa bervariasi. Kanvas dan alpha bounds asli tercatat di manifest; `objectFit: contain` menjaga rasio, tetapi bukan normalisasi ukuran tubuh. Periksa posisi saat mengganti mood. Jangan memakai frame random atau CSS animation berbasis waktu browser untuk render video deterministik.

## Provenance

Dibuat dengan ImageGen dari board `references/styles-3x3.png` (06 Outlined) dan `references/moods-3x3.png`. PNG hasil generasi disalin tanpa penghapusan background atau pengubahan pixel secara lokal. Tanggal produksi: 2026-11-02. Metadata pemeriksaan terdapat di manifest. Board referensi tidak transparan; aset karakter dan reaksi harus memiliki alpha transparan.

## Verifikasi komponen

Contoh TSX berhasil di-bundle dengan esbuild (React/Remotion sebagai dependency eksternal). Belum dirender sebagai video di proyek Remotion karena workspace ini tidak berisi aplikasi Remotion.
