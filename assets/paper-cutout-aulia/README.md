# Paper Cutout Aulia — Full Library

Lapisan kertas dengan tekstur serat dan bayangan di antara bentuk.

Inventaris setara Pixel Aulia: **46 PNG transparan**, dengan ID dan nama file yang sama.

| Folder | Jumlah | Kegunaan |
| --- | --- | --- |
| `characters/` | 13 | Pose presenter dan aktivitas tanpa aura |
| `reactions/` | 24 | Emosi anime dan transformasi metaforis, karakter+VFX menyatu |
| `effects/` | 9 | VFX mandiri untuk digabungkan dengan pose |

Inventaris lengkap: `pack.json`. Metadata ukuran/transparansi: `manifest.json`. Katalog: `preview.html` dengan filter kategori dan pencarian. `python build-catalog.py` membangun ulang katalog dan memeriksa semua 46 gambar (Python+Pillow; tidak mengubah pixel). Acuan inventaris: `../pixel-aulia/manifest.json`.

## Remotion

Salin folder `characters`, `reactions`, `effects` ke `public/assets/paper-cutout-aulia/`, dan `remotion/Aulia.tsx` ke source proyek. Di studio repo ini, `remotion/public/shared` sudah menaut ke `assets/`; cukup salin komponennya dan gunakan `assetRoot="shared/paper-cutout-aulia"`.

```tsx
import {Sequence} from 'remotion';
import {Aulia} from './Aulia';

<Sequence from={30} durationInFrames={90}>
  <Aulia pose="menjelaskan" effect="sayap-phoenix" assetRoot="shared/paper-cutout-aulia" size={900} />
</Sequence>
```

Semua 37 pose/reaksi tersedia lewat prop `pose`, semua 9 efek lewat `effect`. Prop lama `wings` tetap bisa dipakai sebagai alias sayap-phoenix. Efek eksplisit pada prop `effect` diprioritaskan. Atur `effectScale`, `size`, `assetRoot`, `style`; `animate={false}` mematikan gerakan. Mount di `Sequence` untuk memulai ulang animasi masuk. Gerak mengikuti frame/fps, termasuk hover, shake, tebasan deadline, masuk diagonal meteor, dan putaran cincin deadline.

## Batas teknis

PNG diam, bukan SVG, rig tubuh, model 3D atau sprite frame-by-frame. Kepala, tangan dan properti dalam pose belum dipisah; reaksi memiliki VFX yang menyatu. Paper cutout adalah tampilan kertas, bukan file berlayer; bold vector adalah gaya ilustrasi raster dan bisa memiliki shading/glow lembut. Hanya file `effects/` yang mandiri. Skala tubuh/kepadatan detail bisa bervariasi antarpose; komponen memakai `objectFit: contain`, bukan normalisasi tinggi tubuh. Beberapa efek bingkai sengaja mencapai tepi kanvas; pusatnya transparan.

## Provenance dan distribusi

ImageGen membuat tiap gambar dari anchor netral gaya ini dan pose Pixel Aulia yang bersesuaian. Ciri wajah mengikuti `assets/karakter-referensi.png` dan `assets/kepala-netral.png`. Gambar generasi disalin tanpa perubahan pixel lokal. Metadata mencatat alpha, dimensi dan layer. TSX diperiksa melalui bundling dengan React/Remotion eksternal; belum dirender menjadi video.

