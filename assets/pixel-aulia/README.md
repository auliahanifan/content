# Pixel Aulia — Vol. 4

Library karakter personal brand Aulia untuk video Remotion. Mengikuti arah **06 Outlined**: rambut keriting hitam, kacamata persegi, kumis/janggut tipis, blazer navy, kaos hitam, celana charcoal dan sneakers putih.

## 46 PNG transparan

| Folder | Jumlah | Isi |
| --- | --- | --- |
| `characters/` | 13 | netral, menjelaskan, menunjuk, berpikir, setuju, menyapa, stop, laptop, smartphone, presentasi, mencatat, ngopi, facepalm |
| `reactions/` | 24 | murka, fokus, kaget, percaya-diri, sedih, semangat, bingung, lelah, dapat-ide, tertawa, skeptis, menang, panik, malu, mode-jenius, deadline-samurai, raja-multitasking, ditelan-algoritma, dompet-kritis, mode-biksu, bangkit-lagi, otak-overload, pawang-ai, eksekusi-meteor |
| `effects/` | 9 | aura-emas, petir-biru, impact-ungu, portal-hijau, speedlines-merah, partikel-bintang, cincin-deadline, sayap-phoenix, badai-notifikasi |

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
| laptop / smartphone | Demo workflow, teknologi, kerja harian |
| presentasi / mencatat | Menjelaskan langkah atau merangkum insight |
| ngopi | Jeda santai, cerita di balik proses |
| facepalm | Kesalahan umum atau keputusan yang disesali |
| panik | Deadline, kebanjiran tugas, masalah mendadak |
| malu | Mengakui kesalahan, momen canggung |
| mode-jenius | Analisis tajam atau strategi yang mengejutkan |

## Koleksi baru: Anime Metafora

Sembilan transformasi memvisualkan masalah dan solusi sebagai adegan anime. Gunakan filter **Baru · Anime Metafora** di katalog. Detail konsep, penggunaan dan gerak default tersedia di `concepts-vol4.json`.

| ID | Konsep | Pemakaian |
| --- | --- | --- |
| deadline-samurai | Jam raksasa dibelah pedang jarum jam; serpihan waktu mengorbit. | Deadline dan tekanan waktu |
| raja-multitasking | Enam lengan energi tambahan mengatur alat kerja di belakang dua lengan asli. | Banyak pekerjaan ditangani sekaligus |
| ditelan-algoritma | Tubuh terseret portal smartphone dengan pusaran notifikasi. | Distraksi, doomscrolling, algoritma |
| dompet-kritis | Dompet raksasa kosong, zirah koin pecah, ngengat arwah keluar. | Biaya bocor dan pengeluaran berlebihan |
| mode-biksu | Meditasi melayang; notifikasi larut di perisai zen dan teh melayang. | Fokus dan menjaga batas kerja |
| bangkit-lagi | Sayap phoenix oranye-cyan muncul dari blazer di antara kertas kusut. | Pemulihan, mencoba lagi |
| otak-overload | Galaksi di atas kepala menyedot ikon tugas; wajah tetap terlihat. | Overthinking dan kebanjiran informasi |
| pawang-ai | Benang energi mengatur tiga helper robot holografik kecil. | Orkestrasi AI dan delegasi |
| eksekusi-meteor | Terjun diagonal dengan pedang energi berbentuk keyboard dan jejak komet. | Mulai eksekusi, momentum |
| cincin-deadline | Cincin jam amber pecah, pusat transparan tanpa angka. | Layer waktu dan deadline |
| sayap-phoenix | Sepasang sayap api oranye-cyan dengan ruang kosong untuk karakter. | Layer kebangkitan |
| badai-notifikasi | Bingkai spiral tile notifikasi merah-magenta, pusat transparan. | Layer gangguan dan overload |

Avatar tetap memakai ciri wajah dan pakaian Aulia. Lengan ekstra pada Raja Multitasking adalah proyeksi energi yang disengaja; helper kecil pada Pawang AI adalah bagian konsep. Semuanya PNG diam, bukan sprite animasi. Pada sembilan reaksi, properti dan VFX menyatu; hanya tiga file efek baru yang dapat digerakkan terpisah.

## Preview dan metadata

Buka `preview.html` langsung di browser. Bagian “Coba pose + efek” memungkinkan pemilihan pose, efek dan skala efek tanpa mengubah PNG. Filter membagi pose, reaksi, dan efek; latar gelap/terang/checkerboard membantu memeriksa transparansi. `preview-gallery.png` adalah tangkapan katalog. `manifest.json` mencatat ukuran asli, alpha bounds, bounds pada alpha ≥128, fraksi pixel transparan, alpha di sudut kanvas dan jenis layer.

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

Prop `effect` menambah layer VFX di belakang karakter. Layer efek berdenyut terpisah, sedangkan karakter memiliki animasi masuk; murka/semangat/panik mendapat shake dan percaya-diri/dapat-ide/mode-jenius mendapat hover. Semua gerakan mengikuti frame Remotion.

- `effectScale`, `effectOffsetX`, `effectOffsetY`: sesuaikan besar/posisi efek tanpa mengubah karakter.
- `animate={false}`: matikan gerakan dan tampilkan gambar statis.
- `assetRoot`: ubah lokasi relatif terhadap `public/` bila diperlukan.
- `size`: ukuran kotak gambar, bukan tinggi tubuh yang terdeteksi.
- `style`: atur container, misalnya `position: 'absolute', bottom: 40, left: 40`.

`remotion/Example.tsx` menyediakan showcase seluruh 37 pose/reaksi, masing-masing dua detik, dan contoh kombinasi pose+efek. Komposisi showcase: 1080×1920; gunakan `durationInFrames={pixelAuliaShowcaseDuration(fps)}`. Pada 30 fps durasinya 2220 frame (74 detik).

Untuk narasi biasa, gunakan pose bersih selama beberapa detik. Sisipkan reaksi epik pada punchline/insight selama sekitar 0,5–1,5 detik. Reaksi yang efeknya sudah menyatu biasanya tidak perlu ditambah layer efek lain.

## Kombinasi yang disarankan

| Pose | Efek terpisah | Cocok untuk |
| --- | --- | --- |
| laptop | petir-biru | Workflow cepat atau otomasi |
| presentasi | aura-emas | Poin utama / solusi |
| berpikir | portal-hijau | Menjelajah kemungkinan baru |
| menunjuk | speedlines-merah | Menekankan angka atau klaim |
| setuju | partikel-bintang | Rekomendasi / hasil bagus |
| stop | impact-ungu | Mematahkan mitos |

```tsx
<PixelAulia mood="laptop" effect="petir-biru" size={800} />
<PixelAulia mood="mode-jenius" size={800} />
```

Pose dengan laptop, smartphone, pointer, buku dan mug adalah gambar utuh; properti tersebut belum menjadi layer terpisah.

`speedlines-merah` adalah efek bingkai: garis sengaja mencapai tepi kanvas, sementara pusatnya transparan. Bisa dipakai sebagai overlay satu layar dengan `Img` dan `objectFit: cover`, atau sebagai efek di belakang karakter melalui prop `effect`. Nilai alpha sudutnya dicatat di manifest; pemeriksa katalog mengizinkan tepi ini khusus untuk efek bingkai.

## Gerak khusus Vol. 4

- `deadline-samurai`: masuk dengan rotasi tebasan yang mereda.
- `ditelan-algoritma`: seluruh gambar bergoyang dan berdenyut seperti tarikan portal.
- `eksekusi-meteor`: masuk diagonal dari kiri atas.
- `raja-multitasking`, `mode-biksu`, `bangkit-lagi`, `pawang-ai`: melayang.
- `cincin-deadline`: layer cincin berputar independen.

Semua gerak memakai frame/fps Remotion. `animate={false}` mematikannya. Ini transformasi seluruh PNG; tidak menggerakkan tangan, helper, sayap atau properti di dalam PNG secara independen.

## Batas teknis

Semua aset adalah PNG diam bergaya pixel. Belum berupa sprite animasi frame-by-frame, lip-sync, atau rig tubuh. Kepala, tangan dan mulut belum dipisah. Pada `reactions/`, karakter dan aura menyatu; hanya aset di `effects/` yang benar-benar terpisah.

Gambar dihasilkan secara terpisah dari referensi yang sama, sehingga skala figur, proporsi dan kepadatan pixel dapat bervariasi. Komponen memakai `objectFit: contain`, bukan normalisasi tubuh. Periksa skala saat berganti pose. Alpha lembut di sekitar cahaya adalah bagian VFX. Pusat efek dimaksudkan sebagai ruang karakter tetapi sebagian percikan dapat melewatinya.

Contoh TSX diperiksa melalui bundling dengan esbuild (React/Remotion sebagai dependency eksternal). Belum dirender sebagai video di proyek Remotion; workspace ini tidak berisi aplikasi Remotion.

## Provenance

Dibuat dengan ImageGen dari board `references/styles-3x3.png` (06 Outlined), `references/moods-3x3.png`, dan avatar netral. Hasil generasi disalin tanpa penghapusan background, resize atau pengubahan pixel secara lokal. Produksi: 2026-11-02. Board referensi bukan aset transparan; PNG di `characters/`, `reactions/`, dan `effects/` memiliki alpha transparan.
