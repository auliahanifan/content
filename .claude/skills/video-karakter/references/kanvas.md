# storyboard.json mode kanvas (default, v4)

**v4 Tactile Explainer (5 Nov 2026, standar):** dunia Paper Cutout v3 ditambah lima prinsip dari riset motion kelas dunia (Cleo Abram, Johnny Harris, Kurzgesagt, Vox "Two Parties" pemenang Motion Awards 2025; ringkasan di halaman eksplorasi https://claude.ai/artifact/3fqqu9SzZgVSsXQuuyg63V): (1) **ide terpenting jadi adegan metafora** (1-2 per video, `illus`), (2) **gerak punya berat**: pegas dengan sedikit kelewatan lalu mengendap, tidak ada gerak linear, (3) **bukti asli ala scrapbook** (`evidence`): tangkapan layar halaman resmi ditempel, frasa kunci distabilo saat diucapkan, catatan tulisan tangan, (4) **analogi jadi adegan bergambar**, bukan kartu teks (mis. paket = pintu), (5) **menahan diri**: hanya yang membantu paham yang bergerak. Strategi hibrida: identitas tetap (dunia kertas, Fraunces, Paper Cutout Aulia, aksen seri, 3 SFX) + adegan metafora khusus per video. Contoh: `dates/2026-11-05/claude-video-gratis/storyboard.json` (v3 pembanding: `storyboard-v3.json`).

**v3 Paper Cutout (5 Nov 2026):** satu dunia kertas: latar kraft berserat, kartu krem dengan dua lembar kertas (aksen seri + teal) bertumpuk di belakangnya, bayangan lembut, tanpa garis tebal dan bayangan keras; judul Fraunces (pengantar abu, inti tebal navy, kata kunci warna aksen dengan garis kertas tipis); label berupa tag kertas berlubang; karakter Paper Cutout Aulia (`assets/paper-cutout-aulia/`, 13 pose, 24 reaksi) dengan gerak idle halus. Hook: kata jatuh satu per satu di atas selembar kertas, kata kunci dari huruf potongan kertas. **Satu hal dalam satu waktu**: satu elemen per panel. Tetap dari v2: headline kinetik, ilustrasi beranimasi (`illus`), simulasi chat (`chatsim`), kamera pelan + `punch`, transisi geser. SFX minimal. Aksen per seri: Bukan Sulap koral, Sing Murah Wae mustard, Katanya Nyatanya teal, Garapan Weekend ungu; seri lain (mis. Nitip, Mas) memakai koral bawaan (`SERIES_ACCENT` di `remotion/src/kanvas/theme.ts`). Contoh: `dates/2026-11-05/claude-video-gratis/storyboard.json` (v2 pembanding: `storyboard-v2.json`).

Kanvas 1080x1920, 30 fps. Semua `at`, `from`, `split`, `doneAt`, `strikeAt` = **indeks kata** di `tts/words.json`. Durasi = audio + `tail`.

Prinsip (riset `dates/2026-11-04/riset-hisvill.md`): satu latar sepanjang video, satu titik fokus, dan **yang berubah di layar adalah isi penjelasan, bukan dekorasi**. Penonton pemula membaca headline, melihat satu peraga yang tumbuh, lalu paham.

## Zona layar
| Zona | y | Isi |
|---|---|---|
| Header | 44-214 | logo seri (kiri), chip topik (kanan), tanda tangan. Chip berubah jadi hitung mundur saat `loop` aktif |
| Headline | 236-566 | baris pengantar abu + frasa inti Fraunces besar, kata kunci warna aksen seri. **Pengganti caption** |
| Panggung | 590-1450 | **satu** elemen panel; di samping karakter (`char` left/right, panggung 600 lebar) atau lebar penuh (`corner`/`none`) |
| UI Reels | >1500, kanan bawah | kosong |

Palet kertas: kraft, krem, navy kertas, koral, teal, mustard, hijau daun; judul Fraunces, teks Plus Jakarta Sans. Kode: `remotion/src/kanvas/` (token di `theme.ts`).

## Skema
```jsonc
{
  "style": "kanvas",                       // default bila ada `panels`
  "character": "paper",                    // paper (default, Paper Cutout) | bold | pixel
  "hook": {"until": 9, "items": [ /* elemen benda kunci */ ]},  // teks raksasa kata 0..until, lalu mengecil
  "punch": [27, 58],                       // kamera menendang sedikit pada kata ini (3-6 per video)
  "series": "bukan-sulap",
  "topic": "Bukan Sulap · dasar agent",     // chip header: seri · topik (maks ±32 karakter)
  "keywords": ["agent", 120],               // kata aksen di headline (teks atau indeks)
  "captionMerge": [{"from": 21, "to": 26, "text": "GPT-5.5,"}],  // ejaan tampil di headline
  "captionFix": {"15": "Endor"},
  "seriesLine": {"from": 54, "to": 55},     // panggung meredup, logo seri besar di tengah
  "loop": {"text": "Prompt di akhir", "from": 12, "until": 160},  // janji: chip hitung mundur → "Ini dia 👇"
  "lines": [ /* headline */ ],
  "panels": [ /* panggung */ ],
  "poses": [{"at": 88, "pose": "setuju"}],  // ganti pose di tengah panel
  "epic": []                                // opsional, MAKS 1 (punchline terbesar saja)
  // SFX otomatis (pop, tick, soft-hit); `sfx` tambahan hanya ada di mode game. `"autoSfx": false` mematikannya
}
```

### `lines` (headline)
`{from, to?, split?, key?, setup?, punch?}`. Teks diambil dari ucapan kata `from` sampai `to` (default sebelum baris berikutnya), jadi selalu sama dengan suara. Kata `from`..`split-1` = baris pengantar (muncul di `from`, otomatis diberi "..."), `split`..`to` = frasa inti (muncul saat kata `split` diucapkan). `split` = `from` untuk baris yang seluruhnya inti.
- Satu baris = satu frasa, **maks 10-12 kata** (density menolak >14). Pengantar ≤7 kata, inti 2-6 kata.
- Pilih `split` di kata yang membawa makna ("Kalian masih... | **beli prompt?**", "Tapi mesin sekuat apa pun... | **tidak bisa dikendarai**").
- `key` = indeks kata aksen khusus baris itu. Satu kata aksen per baris sudah cukup.
- `setup`/`punch` mengganti teks tampil hanya bila perlu (`*kata*` = aksen di `punch`). Default jangan diisi.
- Semua kata harus masuk satu baris (density memeriksa).

### `panels` (panggung)
`{at, char?, pose?, layout?, gap?, zoom?, topic?, items, sfx?}`. Panel = **satu elemen** (`items` berisi tepat satu; `row` berisi dua hanya untuk perbandingan A vs B). Hal baru = panel baru yang menggeser yang lama, kira-kira satu panel per 1-2 kalimat. Yang tumbuh di dalam panel hanya isi elemennya (butir checklist, pesan chat, langkah, tahap ilustrasi), muncul pada kata yang menyebutnya.
- `char`: `left` (default, panggung kanan 600 px) · `right` · `corner` (karakter kecil kiri bawah, panggung lebar penuh: tutorial/rekam layar) · `none`. Mewarisi panel sebelumnya.
- `layout`: `column` (default) atau `row`. `zoom` < 1 bila isi terpotong.
- `topic`: ganti chip header mulai panel ini (mis. pindah dari "dasar" ke "tutorial").

### Elemen (`items[]`)
Semua punya `at` (muncul; default awal panel), `out` (memudar), `dimAt` (redup 30% agar fokus pindah), `w` (lebar px).

| kind | isi | untuk |
|---|---|---|
| `card` | `tag` (chip kecil), `title`, `text`, `value` (angka/harga besar), `tone`, `icon`, `strikeAt` (coret nilai), `swap: {at, value, tone}` (nilai dicoret lalu chip baru, mis. Rp499.000 → Rp0), `stamp: {at, text, tone}` | benda, harga, klaim, hasil |
| `icon` | `icon`, `size` (default 300), `label`, `labelAt`, `tone` | analogi utama: satu benda besar + label "= mesin" |
| `chip` | `text`, `tone` | label kecil, kesimpulan sementara |
| `big` | `text`, `sub`, `subAt`, `tone` | satu angka/kata raksasa |
| `flow` | `items[{at, emoji/prop/src, label, tone}]`, `op` ("→" default, "+", "="), `size` | rantai yang tumbuh: mesin → mobil → supir, langkah proses |
| `checklist` | `title`, `items[{at, text, doneAt, tone, strikeAt}]` | agent bekerja langkah demi langkah (dicentang di `doneAt`), daftar kebutuhan, boleh/tidak |
| `ui` | `ui` (form, checkout, notif, chat, receipt, terminal, email, comments, profile) + field papan `ui` mode game (`app`, `meta`, `items`, `button`, `buttonAt`, `total`, `stamp`, `zoom`) | layar yang dikenali penonton; simulasi chatbot vs agent; CTA komentar/follow |
| `evidence` | `src` (PNG dari `bukti.mjs`), `source` (mis. "support.claude.com · judul artikel"), `mark: {at, rects[{x,y,w,h}]}` (persen, keluaran `bukti.mjs`), `note: {at, text, x, y}` (tulisan tangan, persen dari kartu), `w` (default 640; 760 dengan `char: "none"`) | **bukti asli** untuk klaim: kliping miring berselotip, stabilo di frasa saat diucapkan, catatan tangan, light leak saat masuk |
| `shot` | `src`, `source`, `rings[{at,x,y,w,h,tone}]` (persen) | bukti layar statis (lama; utamakan `evidence`) |
| `phone` | `src` (mp4 rekaman layar di folder video, atau png), `from` (detik mulai di rekaman), `rate`, `rings`, `steps[{at, text}]` (stepper di kiri HP) | **tutorial rekam layar** |
| `stepper` | `items[{at, text}]` | langkah bernomor tanpa HP |
| `row` | `items` (elemen anak), `op`, `gap` | dua hal berdampingan: A vs B, sebelum/sesudah |
| `illus` | `name`, `steps` (indeks kata tiap tahap), `labels`, `w` | ilustrasi vektor beranimasi, lihat tabel di bawah |
| `chatsim` | `app` (nama generik, tanpa logo), `items[{at, side: user/ai, text, artifact}]` | simulasi chat AI: pesan user diketik huruf demi huruf, AI "mengetik" lalu menjawab, `artifact` = kartu pratinjau beranimasi |

### Ilustrasi `illus`
| name | tahap (`steps`) | `labels` | untuk |
|---|---|---|---|
| `doors` | 0: pintu yang dapat fitur terbuka bercahaya · 1: gembok bergetar | 0: kalimat bawah | siapa yang dapat fitur (paket), versi adegan |
| `recipe-kitchen` | 0: resep ditulis baris demi baris · 1: resep masuk laptop, laptop "memasak" · 2: `video.mp4` keluar | tiga baris resep | AI menulis kode/instruksi, mesin Anda yang mengerjakan |
| `tiers` | 0: Team/Enterprise dicentang · 1: Free/Pro/Max dicoret | 0: kalimat bawah | siapa yang dapat fitur (paket), versi kartu |
| `flipbook` | 0: halaman mulai membalik · 1: penghitung sampai 1.800 | - | video = gambar per frame |
| `recipe-code` | 0: kartu resep berubah jadi kode yang diketik | - | AI menulis instruksi/kode |
| `render` | 0: frame digambar satu per satu · 1: progress 100% · 2: file keluar | 0: label proses, 1: nama file | render, ekspor, proses mesin |
| `skill-folder` | 0: folder terbuka, file keluar | nama tiga file | skill, paket file, folder proyek |
| `screenrec` | 0: mulai merekam (REC) | - | rekam layar HP |
| `mold` | tiap tahap: cetakan menekan lalu satu video baru masuk tumpukan (satu tahap per label) | nama tiap hasil (default Video 1-3) | satu template dipakai berulang: isi beda, gaya sama |
| `snap` | 0: playhead digeser · 1: kamera menjepret, foto keluar · 2: playhead geser sedikit lagi | 0: label waktu (default "detik 3"), 1: label sesudah geser (default "detik 3,03") | video di-pause lalu dipotret per frame |
Tambah ilustrasi baru di `remotion/src/kanvas/Illus.tsx` (+ `ILLUS_W` lebar aslinya) dan tabel ini.

### Ikon vektor
`icon: {name, color}` menggambar ikon vektor (garis navy tipis). Nama: laptop, phone, folder, file, code, film, book, recipe, check, cross, sparkle, chat, lock, money, clock, play, record, terminal, gear, user, team, building, gift, warning, download, zap, node, chef. Utamakan ikon vektor daripada emoji. Ikon baru ditambahkan di `remotion/src/kanvas/Icons.tsx`.

`icon`: `{emoji}` (di-pixel-kan seperti props Pixel Aulia), `{prop}` (PNG `assets/props/`), atau `{src}` (PNG di folder video, mis. logo aplikasi). `tone`: accent (warna aksen seri) · good (hijau) · bad (merah bata) · warn (mustard) · sun · sky (teal) · lilac · ink.

## Rekam layar (tutorial)
- Aulia merekam layar HP (portrait) atau laptop, simpan di `<folder-video>/rekam/<nama>.mp4` (mp4/mov di `rekam/` sudah di-gitignore).
- Satu `phone` per bagian; `from` = detik di rekaman saat langkah pertama bagian itu. Rekaman berjalan 1x mulai `at` elemen. Bila rekaman lebih lambat dari suara, potong dulu per langkah dengan ffmpeg (`-ss`/`-to`) atau pakai `rate`.
- `steps` di `phone` = stepper yang menyala per langkah; headline mengucapkan langkahnya ("Langkah 3 · klik ikon plus").
- `rings` menyorot tombol yang ditekan (persen dari layar HP), tepat di kata yang menyebutnya.
- Panel tutorial memakai `char: "corner"` dan pose `smartphone`/`laptop`.

## Aturan (jangan dilanggar)
- **Satu hal dalam satu waktu.** Tepat satu elemen per panel (dan satu di `hook.items`); hal baru = panel baru yang menggeser yang lama. Pengecualian: `row` berisi 2 elemen untuk perbandingan A vs B. Yang boleh tumbuh hanya isi elemen itu sendiri (butir checklist, pesan chat, langkah, tahap ilustrasi). `pnpm density` menolak panel berisi lebih dari satu elemen.
- **Adegan metafora (wajib 1-2 per video).** Ide terpenting naskah (biasanya analogi atau aturan bawa pulang) diperagakan sebagai adegan `illus`, bukan `card`. Bila belum ada ilustrasi yang cocok, buat yang baru di `Illus.tsx` (gerak pegas, satu benda yang berubah tahap demi tahap mengikuti kata).
- **Bukti asli untuk klaim faktual.** Klaim yang diluruskan (seri Bukan Sulap) memakai `evidence` dari halaman resmi, frasa kuncinya distabilo tepat saat diucapkan.
- **Peraga, bukan label.** Elemen memperlihatkan proses atau perubahan (dicentang, dicoret, diganti, bertambah), bukan sekadar menamai isi kalimat. Tanya: "kalau suara dimatikan, apakah layar masih menjelaskan?"
- **Satu analogi dibangun bertahap** di satu panel (flow/icon yang tumbuh), dan dipanggil lagi di penutup.
- **Hook**: kalimat pertama (sampai kata `hook.until`) jatuh kata per kata di atas lembar kertas besar, kata kunci (`keywords`) dari huruf potongan kertas; satu benda kunci di `hook.items` tanpa `at` supaya tampil sejak frame 0. Panel pertama mulai sesudah hook, dan karakter masuk dari bawah.
- **Karakter**: Paper Cutout setinggi 800 px, kiri/kanan; `corner` untuk tutorial; `none` bila ilustrasi butuh lebar penuh (mis. `tiers`). Pose = 13 pose presenter; reaksi (24) hanya lewat `epic`, maks 1.
- **Suara**: SFX otomatis hanya tiga: `pop` lembut saat kartu/elemen baru, `tick` tiap butir checklist/chat/langkah/coretan, `soft-hit` satu kali di awal hook. Tanpa whoosh, balik kertas, hantaman, atau ketikan; tanpa musik.
- **Dekorasi**: epik maks 1, stempel maks 2, tanpa stiker/pop/fx/map/mood/aura (diabaikan di kanvas). `pnpm density` menolak bila lewat batas.
- **Kepadatan**: tidak ada jeda > 3 detik tanpa perubahan headline/panggung (`pnpm density`, otomatis batas 3 untuk kanvas).
- Pose cocok dengan kalimat (pengguna sangat peduli): `menunjuk` saat elemen baru muncul, `berpikir` di pertanyaan, `stop` saat membantah, `setuju` di kesimpulan, `smartphone`/`laptop` di tutorial. Ganti tiap 1-3 kalimat.
- Penutup: panel CTA `ui` `comments` (pertanyaan atau kata kunci komentar) dan/atau `profile` (follow), lalu aturan bawa pulang dalam satu `card`.

## Contoh
Contoh standar sekarang: `dates/2026-11-05/claude-video-gratis-padat/storyboard.json` (lolos `pnpm density`). Pilot lama `dates/2026-11-01/agent-harness-kanvas/storyboard.json` (audio sama dengan `agent-harness-v2`, pembanding mode game) dibuat sebelum aturan satu elemen per panel dan tidak lolos `pnpm density`. Pola dari riset:
```jsonc
// hadiah + jangkar harga: dua kartu berdampingan dalam satu `row` (perbandingan, maks 2)
{"at": 0, "char": "none", "pose": "menunjuk", "items": [
  {"kind": "row", "items": [
    {"kind": "card", "tag": "PROMPT PREMIUM", "title": "1.000 Prompt AI", "value": "Rp499.000", "swap": {"at": 9, "value": "Rp0"}},
    {"kind": "card", "at": 4, "tag": "KELAS", "title": "Masterclass Prompt", "value": "Rp1.500.000", "swap": {"at": 10, "value": "Rp0"}, "stamp": {"at": 11, "text": "GRATIS!"}}
  ]}
]}
// simulasi satu tugas: permintaan di satu panel, lalu agent bekerja di panel berikutnya
{"at": 60, "char": "right", "items": [
  {"kind": "ui", "ui": "chat", "app": "AI agent", "items": [{"at": 61, "text": "Tolong rapikan folder Download", "side": "out"}]}
]}
{"at": 64, "items": [
  {"kind": "checklist", "items": [
    {"at": 64, "text": "Buka folder · 327 file", "doneAt": 66},
    {"at": 68, "text": "Susun rencana", "doneAt": 70},
    {"at": 72, "text": "Tanya izin dulu", "doneAt": 75, "tone": "warn"}
  ]}
]}
// tutorial
{"at": 30, "char": "corner", "pose": "smartphone", "topic": "tutorial · Gemini", "items": [
  {"kind": "phone", "src": "rekam/gemini.mp4", "from": 0, "steps": [{"at": 31, "text": "Buka Gemini"}, {"at": 40, "text": "Klik +"}], "rings": [{"at": 41, "x": 4, "y": 86, "w": 16, "h": 7}]}
]}
```
