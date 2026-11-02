# Pixel Aulia Vol. 5: paket prompt aset (GPT Image)

Tujuan: membuat `/video-karakter` lebih hidup dan energik, tetap di dunia pixel game. Dokumen ini berisi spesifikasi hasil wawancara (2 Nov 2026) dan semua prompt aset yang perlu kamu generate di ChatGPT / GPT Image. Kode Remotion dikerjakan setelah aset lengkap.

## Spesifikasi (hasil wawancara)

| Area | Keputusan |
|---|---|
| Masalah sekarang | Latar statis, karakter kaku, papan monoton, gerak dan tempo kurang |
| Arah | Tetap pixel game, jauh lebih hidup ("juice" ala game modern) |
| Keramaian | Ramai/energik; sesuatu terjadi **tiap 1-2 detik** |
| Latar | Map per topik (toko/gudang, kantor, kota/pasar digital, dungeon/server) + latar bereaksi pada emosi kalimat + kamera side-scroll |
| Pindah map | Jalan terus mulus: karakter berjalan, dunia bergulir, map berikutnya masuk dari kanan |
| Gerak karakter | Animasi frame sprite asli (bukan goyang transform), masuk/keluar layar, interaksi dengan papan |
| Interaksi | Menunjuk tepat ke baris, membanting papan / menempel stempel, mengambil item (loot), menyerang monster masalah (HP bar boss turun saat solusi disebut) |
| Efek | Angka meledak + damage number RPG, emoji pixel, shake/zoom/flash/glitch lebih sering, partikel terus-menerus |
| Stiker | Emoji yang di-pixel-kan saja (tanpa aset stiker baru) |
| Papan | Variasi bentuk (kartu item, layar quest, skor arcade, peta, dialog boss, inventory), isi terus bergerak, papan lebih kecil dan sering, kadang tanpa papan |
| Audio | Tetap tanpa musik; SFX 8-bit lebih kaya dan lebih sering |
| Caption | Tetap seperti sekarang |
| Workflow | Otomatis dulu (skill memilih latar, efek, monster dari naskah), pengguna merevisi di draf |
| Batasan | Tanpa meme/aset pihak lain; efek tidak menutupi angka, papan, atau caption yang sedang dibaca; bahaya tetap lucu-epik, tidak seram |

Yang tidak butuh aset (dikerjakan di kode): latar bereaksi (tint merah/emas, glitch), partikel, damage number, kamera, variasi papan, emoji pixel, SFX.

## Cara generate

1. Buka ChatGPT, unggah **`characters/netral.png`** dan **`references/styles-3x3.png`** sebagai referensi di setiap percakapan baru.
2. Tempel **Blok gaya** di bawah, lalu prompt asetnya.
3. Minta **PNG dengan latar transparan** (kecuali yang ditandai "latar penuh").
4. Simpan dengan nama file persis seperti tabel ke folder `assets/pixel-aulia/vol5/...`. Tidak perlu dirapikan atau dipotong: posisi kaki, ukuran, dan pemotongan sheet saya normalkan di kode.
5. Bila satu frame melenceng (wajah/pakaian berubah), generate ulang frame itu saja.

### Blok gaya (tempel di awal setiap percakapan)

```
Use the uploaded character as the exact reference: Pixel Aulia, style "06 Outlined".
Keep identical identity in every image: curly black hair, square glasses, thin moustache and
short beard, navy blazer, black t-shirt, charcoal trousers, white sneakers.
Pixel art with chunky visible pixels, bold dark-navy (#1B1F3B) outline, flat cel shading with
2-3 tones per colour, no gradients, no blur, no anti-aliasing glow, no text, no watermark.
Same pixel density, outline thickness and palette as the reference. Full body, feet visible.
Transparent background PNG.
```

## A. Mulut dan kedip (12 edit)

Supaya karakter terlihat bicara (mulut sinkron dengan suara) dan berkedip. **Pakai fitur edit/seleksi di ChatGPT**: unggah pose aslinya, seleksi hanya area mulut atau mata, lalu beri prompt. Dengan begitu bagian lain tetap identik dan bisa ditumpuk di kode.

| File | Sumber | Seleksi | Prompt |
|---|---|---|---|
| `vol5/face/<pose>-mulut.png` | `characters/<pose>.png` | mulut | `Open the mouth mid-speech (a small open "ah" shape showing a dark mouth interior). Change nothing else.` |
| `vol5/face/<pose>-kedip.png` | `characters/<pose>.png` | kedua mata | `Close both eyes (a single dark pixel line behind the glasses, relaxed blink). Change nothing else.` |

`<pose>`: `netral`, `menjelaskan`, `menunjuk`, `berpikir`, `setuju`, `stop` (6 pose × 2 = 12 file).

## B. Sprite sheet gerak (6 sheet)

Satu gambar landscape **1536×1024**, berisi beberapa frame berjajar dalam satu baris dengan jarak kosong yang jelas di antaranya. Satu gambar per sheet supaya gaya antar-frame konsisten. Semua frame sama besar, kaki pada garis dasar yang sama.

Awali tiap prompt dengan: `A horizontal sprite sheet on one row, frames evenly spaced with clear empty gaps, every frame the same character size, feet on the same baseline.`

| File | Frame | Prompt |
|---|---|---|
| `vol5/sheets/jalan.png` | 4 | `4-frame walk cycle walking to the right, three-quarter side view: contact, down, passing, up. Arms swing naturally, confident business-casual stride.` |
| `vol5/sheets/lompat.png` | 4 | `4 frames: crouch to jump, airborne with knees tucked and arms up, landing in a squash crouch, standing back up with a small grin.` |
| `vol5/sheets/menunjuk.png` | 4 | `4 frames facing the viewer at a slight angle: pointing up-right with index finger, pointing straight right, pointing down-right, waving hand high (second wave frame, hand tilted the other way).` |
| `vol5/sheets/stempel.png` | 4 | `4 frames: raising a big red rubber stamp overhead, slamming the stamp down to the right, pushing a large flat panel to the right with both palms, arms crossed proud pose.` |
| `vol5/sheets/loot.png` | 4 | `4 frames: reaching right with an open hand, holding an empty open palm in front of the chest (object will be added later), lifting both hands high presenting an item above the head (classic RPG item-get pose, hands empty), knocked back off balance with a surprised face.` |
| `vol5/sheets/serang.png` | 4 | `4 frames of a playful action-hero fight toward the right: wind-up for a punch, straight punch with motion pose, flying side kick, small victory fist pump. Cartoonish and fun, not violent.` |

Tangan di frame "memegang" dan "item-get" sengaja kosong: item (koin, HP, dokumen) ditempel di kode dari emoji pixel.

## C. Monster masalah (6 sheet)

Masalah bisnis jadi "boss" lucu-epik yang dipukul saat solusi disebut. Landscape **1536×1024**, 2 frame berjajar: kiri **idle mengancam**, kanan **kena pukul** (mata X, terpental, bintang kecil). Ukuran monster kira-kira setinggi karakter. Lucu, chibi, tidak seram, tanpa darah.

Awali tiap prompt dengan: `A 2-frame sprite sheet on one row with a clear gap: left frame idle menacing pose, right frame the same monster getting hit (X eyes, knocked back, small pixel stars). Cute chibi boss monster, funny-epic, not scary, same pixel art style and outline as the reference character. The character itself is NOT in the image.`

| File | Monster | Pemakaian |
|---|---|---|
| `vol5/monsters/tagihan.png` | `Bill Monster: a walking invoice/receipt with paper teeth and a red total number for a belly, coins orbiting.` | Biaya bocor, tagihan, denda |
| `vol5/monsters/bug.png` | `Bug Beetle: a glitchy pixel beetle with error-red shell and flickering code fragments on its back.` | Bug, error, aplikasi rusak |
| `vol5/monsters/spam.png` | `Spam Slime: a bouncy pink slime made of stacked notification bubbles, little red badge counters on top.` | Notifikasi, spam, distraksi |
| `vol5/monsters/birokrasi.png` | `Paperwork Golem: a golem built from stacked folders and documents, wearing a tiny tie, holding a giant rubber stamp.` | SOP ribet, admin, birokrasi |
| `vol5/monsters/bocor.png` | `Leak Ghost: a cute round ghost leaking floating file icons and padlocks from holes in its body.` | Data bocor, privasi |
| `vol5/monsters/biaya.png` | `Cost Dragon: a small chubby dragon made of gold coins and price tags, puffing coin smoke.` | Biaya AI/langganan membengkak |

## D. Map latar (4 map × 3 lapisan = 12 gambar)

Tiap map punya 3 lapisan untuk parallax side-scroll. **Semua lapisan harus nyambung bila ditempel kiri-kanan** (seamless horizontally tileable). Tanpa karakter dan tanpa teks yang terbaca.

| Lapisan | File | Ukuran | Latar |
|---|---|---|---|
| Jauh | `vol5/maps/<map>/jauh.png` | 1024×1536 (portrait) | **latar penuh** (tidak transparan) |
| Tengah | `vol5/maps/<map>/tengah.png` | 1536×1024 | transparan, isi di setengah bawah |
| Depan (lantai) | `vol5/maps/<map>/depan.png` | 1536×1024 | transparan, hanya pita lantai/tanah di sepertiga bawah |

Akhiran prompt per lapisan:
- Jauh: `Far background layer only, full opaque scene filling the whole canvas, seamless when tiled horizontally (left and right edges match), soft low-contrast colours so foreground stays readable, no characters, no readable text.`
- Tengah: `Middle parallax layer: only mid-distance objects in the lower half, everything else fully transparent, seamless when tiled horizontally, no characters, no readable text.`
- Depan: `Foreground floor layer: only a walkable ground strip in the bottom third plus a few small props at its edge, everything above fully transparent, seamless when tiled horizontally, no characters, no readable text.`

| `<map>` | Prompt adegan (tempel sebelum akhiran lapisan) |
|---|---|
| `toko` | `Pixel art Indonesian shop-and-warehouse street: a warung/minimarket front with awning, shelves of goods, stacked cardboard boxes, a delivery motorbike, hanging snack sachets, daytime warm colours.` |
| `kantor` | `Pixel art modern small-business office: desks with laptops, a meeting room with whiteboard and sticky notes, potted plants, big windows with city view, bright daytime.` |
| `kota` | `Pixel art digital marketplace city at dusk: neon shop signs shaped like app icons, floating like/heart and cart symbols, phone-shaped buildings, billboards with abstract graphics, purple-orange sky.` |
| `dungeon` | `Pixel art playful dungeon server room: stone dungeon walls fused with glowing server racks, cable vines, torches with cyan flames, treasure chests with padlocks, fun adventure mood, not scary.` |

## Setelah aset masuk

Unggah folder `assets/pixel-aulia/vol5/` (atau kirim file-filenya) lalu bilang "aset vol5 siap". Saya akan:
1. Memotong sheet per frame, menormalkan tinggi badan dan garis kaki, mengecek transparansi, lalu memperbarui `manifest.json` dan katalog.
2. Membangun di Remotion: karakter animasi frame (mulut sinkron suara, kedip, jalan, lompat, menunjuk tepat ke baris, stempel, loot, serang), dunia side-scroll per map dengan latar bereaksi, monster + HP bar, partikel, damage number, papan bervariasi, dan SFX baru.
3. Memperbarui `/video-karakter` agar memilih semua itu otomatis dari naskah, lalu membuat pilot dari video agent-harness untuk dibandingkan.

Total: 12 edit + 6 sheet gerak + 6 monster + 12 lapisan map = **36 gambar**. Bila ingin bertahap, urutan paling berdampak: A (mulut/kedip) → B `jalan` + `menunjuk` → D satu map (`toko`) → C dua monster → sisanya.
