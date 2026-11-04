# storyboard.json mode game (opsional)

Dipakai hanya bila `"style": "game"` atau storyboard berisi `scenes` tanpa `panels`. Default video sekarang mode kanvas: lihat `kanvas.md`. Mode game cocok untuk konten hiburan/cerita; untuk penjelasan dan tutorial, dekorasinya (map, epik, stiker, boss) terbukti berebut perhatian dengan isi (riset `dates/2026-11-04/riset-hisvill.md`).

Kanvas 1080x1920, 30 fps. Semua `at`, `subAt`, `strikeAt`, `from`, `to` = **indeks kata** di `tts/words.json` (elemen muncul tepat saat kata itu diucapkan). Durasi = durasi audio + `tail`.

```jsonc
{
  "series": "bukan-sulap",              // assets/bukan-sulap.svg + bukan-sulap-white.svg
  "audio": "tts/final.mp3",             // default
  "words": "tts/words.json",            // default
  "tail": 1.2,                          // detik setelah suara selesai
  "keywords": ["harness", "andong", 120],  // teks kata (tanpa tanda baca, semua kemunculan) atau indeks: jeruk di caption
  "captionMerge": [{"from": 21, "to": 26, "text": "GPT-5.5,"}],  // kata ucapan -> ejaan tampil
  "captionFix": {"15": "Endor"},        // ganti ejaan satu kata
  "seriesLine": {"from": 54, "to": 55}, // logo seri terbang ke tengah, papan meredup
  "epic": [{"at": 3, "reaction": "murka", "dur": 1.4, "text": "JELEK?!", "color": "bad"}],  // 2-4 per video
  "aura": [{"at": 67, "effect": "aura-emas", "dur": 1.5}],  // mini-epik 3-5 per video
  "punch": [53, 89],                    // kamera punch-in pada kata ini
  "meter": {"label": "RISIKO", "prefix": "Rp", "short": true,           // indikator taruhan di tengah atas
            "steps": [{"at": 12, "value": 50000000}, {"at": 40, "value": 1250000000}], "to": 150},
  "loop": {"text": "Prompt-nya di akhir", "until": 150},                 // progress bar hitung mundur ke payoff
  "stickers": [{"at": 14, "emoji": "💸"}],          // emoji pixel meletup di tepi papan (x/y px opsional)
  "pops": [{"at": 40, "text": "63%", "tone": "bad"}], // damage number di atas kepala karakter
  "fx": [{"at": 88, "kind": "shake"}],              // shake | flash | glitch | zoom | burst
  "loot": [{"at": 82, "emoji": "📦", "text": "+KERETA"}],  // item terbang dari papan ke karakter
  "moods": [{"at": 9, "mood": "bahaya", "dur": 2}], // latar bereaksi sesaat
  "autoJuice": true,                                // default: debu kaki, burst di punch, pop dari meter
  "autoSfx": true,                      // default
  "sfx": [{"at": 30, "name": "coin"}],  // tambahan: blip coin power hit select sweep boom
  "scenes": [ /* lihat di bawah */ ]
}
```

## Adegan
```jsonc
{
  "at": 15,                              // mulai (adegan pertama selalu frame 0)
  "layout": "left",                      // left | right (karakter dibalik) | center; default bergantian left/right
  "transition": "pixel",                 // pixel | iris | none; default bergantian
  "pose": "menjelaskan",                 // pose saat adegan mulai
  "poses": [{"at": 37, "pose": "menunjuk"}],  // ganti pose di tengah adegan
  "board": { "type": "...", "kicker": "tab kecil di atas papan", ... },
  "footer": {"at": 118, "text": "Kusirnya? *Anda*."},  // kotak dialog RPG mengetik di dasar papan
  "dark": true,                          // malam arcade (penutup)
  "sfx": null,                           // matikan sweep pembuka adegan ini (default "sweep")
  "map": "toko",                         // padang | toko | kantor | kota | dungeon; mewarisi adegan sebelumnya
  "mood": "bahaya",                      // bahaya | untung | glitch | fokus, selama adegan
  "skin": "quest",                       // window | quest | arcade | item | none
  "size": "sm",                          // papan lebih kecil, dunia lebih terlihat
  "enter": "beam"                        // dash | beam: karakter masuk ulang
}
```

## Dunia, mood, dan juice (gaya energik)
Target: **sesuatu terjadi di layar tiap 1-2 detik**. Cek dengan `pnpm density <folder-video> [batas=2]` dari `remotion/`: skrip mendaftar jeda tanpa kejadian lebih dari batas beserta kalimatnya; isi jeda itu dengan stiker, pop, fx, pose, atau baris papan. Exit code 2 bila masih ada jeda.

**Map** (`map`, procedural di `remotion/src/world/Maps.tsx`, tanpa aset): `padang` (dunia RPG bawaan, netral/penutup) · `toko` (ruko/warung + jalan: UMKM, stok, pelanggan, ongkir, katalog) · `kantor` (meja, laptop, papan sticky notes: tim, admin, SOP, kerja harian) · `kota` (pasar digital senja, neon ikon app: marketplace, sosmed, iklan, tren, produk AI) · `dungeon` (server room ceria, obor cyan, peti: bahaya, data, hukum, cara kerja di balik layar, boss). Map bergulir pelan terus; **ganti map = kamera dash** ke kanan (map lama keluar kiri, garis kecepatan, karakter ikut meluncur masuk, SFX `dash`). Ganti map saat topik berpindah, kira-kira tiap 2-4 adegan; jangan tiap adegan. Logo seri otomatis versi putih di `kota`/`dungeon`.

**Mood** (latar bereaksi, di belakang papan): `bahaya` (merah berdenyut + percikan; risiko, kesalahan, larangan) · `untung` (cahaya emas + koin jatuh; hemat, hasil, angka bagus) · `glitch` (pita warna + RGB split latar; error, kebocoran, AI ngawur) · `fokus` (vignette gelap; pertanyaan kunci, "kusirnya Anda"). Per adegan (`mood`) atau sesaat (`moods[]`, default 1,5 detik).

**Skin papan** (`skin`): `window` (default jendela RPG) · `quest` (perkamen + segel; langkah, misi, contoh, checklist) · `arcade` (layar CRT terang bergaris scan, title magenta; data, angka, bukti layar, perbandingan) · `item` (kartu legendaris emas + kilau berjalan + ★★★★★; insight kunci, kesimpulan, "harness") · `none` (tanpa jendela; teks outline putih langsung di dunia, untuk papan `title` pendek). Variasikan; jangan dua adegan berturut-turut dengan skin sama kecuali window.

**Juice:**
- `stickers`: emoji yang di-pixel-kan, meletup ±1,4 detik di titik aman tepi papan (bergiliran 6 titik) atau `x`/`y`. Sumber utama kepadatan: satu stiker per kata konkret yang tidak ada di papan (benda, emosi, tindakan). Tanpa meme atau aset pihak lain.
- `pops`: damage number ala RPG naik dari atas kepala karakter (`-Rp1,2 M`, `63%`, `+6 SKILL`). `tone` `bad` = SFX damage, `good`/`sun` = coin. Meter otomatis memunculkan pop selisihnya.
- `fx`: `shake` (benturan, larangan), `flash` (reveal), `glitch` (seluruh layar 8 frame; error), `zoom` (penekanan kecil), `burst` (bintang pixel di atas kepala atau `x`/`y`).
- `loot`: item terbang melengkung dari papan ke karakter lalu `+TEKS` di atas kepala (mendapat alat, file, hasil). SFX pickup.
- Efek tidak boleh menutupi angka/isi papan atau caption yang sedang dibaca: pop dan burst default di atas kepala karakter; stiker di tepi papan. Bila memakai `x`/`y`, cek still.

**Karakter masuk** (`enter`): `dash` (meluncur dari luar layar + debu; otomatis saat map berganti) · `beam` (sinar teleport, muncul bertahap; momen "begini cara kerjanya"). Karakter tetap tidak bergoyang; animasi frame (mulut, kedip, jalan) menyusul saat aset Vol. 5 ada (`assets/pixel-aulia/prompts-vol5.md`).

**Pose presenter** (`assets/pixel-aulia/characters`): `netral` · `menjelaskan` (tangan terbuka) · `menunjuk` (ke arah papan/caption) · `berpikir` (tangan di dagu) · `setuju` (jempol) · `menyapa` (lambai, intro/outro) · `stop` (telapak ke depan: "jangan", membantah mitos) · `laptop` / `smartphone` (demo workflow, teknologi) · `presentasi` / `mencatat` (langkah, merangkum) · `ngopi` (jeda santai) · `facepalm` (kesalahan umum). Pada layout `right` karakter dibalik sehingga menunjuk ke kiri. Ganti pose tiap 1-3 kalimat; jangan tiap kata.

**Reaksi** (`assets/pixel-aulia/reactions`, aura menyatu) untuk `epic`: `murka` · `fokus` · `kaget` · `percaya-diri` · `sedih` · `semangat` · `bingung` · `lelah` · `dapat-ide` · `tertawa` · `skeptis` · `menang` · `panik` · `malu` · `mode-jenius`. **Anime Metafora** (konsep di `assets/pixel-aulia/concepts-vol4.json`): `deadline-samurai` (deadline) · `raja-multitasking` (banyak tugas) · `ditelan-algoritma` (distraksi) · `dompet-kritis` (biaya bocor) · `mode-biksu` (fokus, batas kerja) · `bangkit-lagi` (mencoba lagi) · `otak-overload` (overthinking) · `pawang-ai` (orkestrasi AI, delegasi) · `eksekusi-meteor` (mulai eksekusi). Arti lengkap: `assets/pixel-aulia/README.md`.

**Efek terpisah** untuk `aura` (mini-epik, presenter tetap di tempat, efek di belakang badan 1-2 detik + SFX `power`): `aura-emas` (kuat, percaya diri) · `petir-biru` · `impact-ungu` · `portal-hijau` (perubahan, upgrade) · `speedlines-merah` (larangan, tekanan) · `partikel-bintang` (hasil, angka bagus) · `cincin-deadline` (waktu) · `sayap-phoenix` (bangkit) · `badai-notifikasi` (gangguan). `scale` mengatur ukuran (default 1).

**Interupsi epik**: 2-4 per video, hanya di punchline. Layar flash putih, latar malam + garis kecepatan, reaksi besar di tengah, teks pixel raksasa (`text`, maks ±7 karakter, mis. `JELEK?!`, `85%!`), shake, SFX `boom`. Papan & presenter tersembunyi selama itu; caption pindah ke bawah. `dur` default 1,3 detik. Epik boleh melewati pergantian adegan: transisi adegan itu dilewati dan epik menjadi transisinya (keluar = membesar + memutih 3 frame lalu potong).

**HUD** (tengah atas, di antara logo seri dan tanda tangan, x 432-776, y 78-228):
- `meter`: indikator yang menempel dan naik pada tiap `steps[].at` (hitung naik + kedip kuning + SFX `coin`). Pakai untuk taruhan yang menumpuk sepanjang video, terutama Tumpukan jebakan ("RISIKO Rp0 → Rp6 M", "BIAYA", "WAKTU"). `short: true` menyingkat 1.250.000.000 → `1,3 M` (rb, jt, M, T). `from`/`to` = rentang tampil (indeks kata); sembunyikan sebelum penutup agar tidak bersaing dengan CTA. Label maks ±7 karakter. Angka harus sama dengan naskah dan lembar fakta.
- `loop`: progress bar janji ("Prompt-nya di akhir · 12 dtk") yang terisi dan menghitung mundur sampai kata `until` (payoff), lalu berubah hijau "Ini dia 👇" (`done` untuk mengganti) dan hilang 1,6 detik kemudian, SFX `power`. Teks maks ±20 karakter. Pakai hanya bila naskah benar-benar membayar janji itu (baris `Janji:` dari `/naskah`).
- HUD meredup saat `seriesLine` dan interupsi epik.

**Stempel** (`stamp: {at, text, tone}`, di papan `ui` dan `word`): cap miring besar yang jatuh di atas papan + SFX `hit`, mis. `PER`, `DENDA`, `BOCOR`. Maks ±6 karakter, 1-2 per video.

`*teks*` di semua teks papan = sorotan stabilo yang tersapu masuk. `\n` = baris baru.

## Jenis papan
| type | isi | dipakai untuk |
|---|---|---|
| `title` | `text`, `sub`/`subAt`, `items` (baris props opsional) | hook, kalimat kunci, penutup |
| `props` | `title`, `items[{at, prop, emoji, label, tone, strikeAt}]` 1-3 item | analogi, benda konkret |
| `list` | `title`, `items[{at, prop, emoji, text, sub, subAt, tone, strikeAt}]` maks 3 | langkah, komponen, boleh/tidak |
| `stat` | `title`, `note`, `items[{at, label, value, suffix, tone}]` 2-3 batang | perbandingan angka |
| `counts` | `title`, `items[{at, prop, emoji, value, label, tone}]` maks 3 | angka yang dihitung naik |
| `compare` | `title`, `left`, `right` ({at, label, prop, emoji, text, tone, strikeAt}), `op` ("vs", "+", "=", "→") | sebelum/sesudah, A vs B |
| `quote` | `text`, `source`, `at` | kutipan |
| `shot` | `title`, `src` (relatif folder video), `source`, `rings[{at, x, y, w, h, tone}]` (persen) | bukti layar |
| `ui` | `kind`, `title`, `app`, `meta`, `note`, `items[UiLine]`, `total`, `button`, `buttonAt`, `stamp`, `zoom` | mock layar realistis yang dikenali penonton (lihat di bawah) |
| `word` | `text` (1 kata), `sub`/`subAt`, `at`, `tone`, `stamp` | punchline satu kata di jendela gelap dengan glow (kata kunci pembalik, mis. `per.`) |
| `boss` | `name`, `emoji` (monster dari emoji pixel), `hp` (default 100), `hits[{at, dmg, text}]`, `defeatAt`, `defeatText` (default `KALAH!`) | masalah jadi monster; HP turun saat solusi disebut (SFX damage), meledak jadi bintang di `defeatAt` (SFX levelup). Cocok di map `dungeon` + `dark` untuk penutup. 1 per video |

### Papan `ui` (mock layar)
Kartu UI modern (tidak di-pixel-kan, bingkai tinta tebal) di dalam jendela RPG. Pakai untuk tiap butir yang menyebut benda milik penonton: layar asli lebih cepat dipahami daripada ikon. Baris (`UiLine`): `{at, label, text, sub, value, tone, side, emoji, strikeAt, flag, flagAt}`. `flag` = chip jebakan merah miring di kanan baris (mis. `tanpa izin`, `tersembunyi`), muncul pada `flagAt` + SFX `hit`.

| kind | app | meta | items | lainnya |
|---|---|---|---|---|
| `form` | domain/aplikasi | judul form ("Buat akun") | field: `label` + `text` (isi) | `button`, `buttonAt` (tombol ditekan) |
| `checkout` | toko | nama paket | baris `label` … `value` | `total: {value, sub}` harga besar, `button` |
| `notif` | tanggal | jam ("09.41") | notifikasi: `label` (aplikasi), `text`, `sub`, `emoji`, `tone` (warna ikon) | layar kunci HP |
| `chat` | nama kontak | status ("online") | gelembung: `text`, `side` (`in`/`out`), `sub` (jam) | gaya WhatsApp |
| `receipt` | judul struk | keterangan | `label` … `value` (+ `sub`) | `total: {label, value, tone}`; cocok dengan `stamp` |
| `terminal` | judul jendela | - | baris diketik: `text`, `label` (prompt, default `$`), `tone` | demo prompt/perbaikan |
| `email` | pengirim | subjek | paragraf `text` (`tone: bad` untuk yang kurang) | `button` |
| `comments` | - | judul ("Komentar") | komentar: `label` (user), `text` | `button` = kata kunci yang diketik di kolom komentar mulai `buttonAt` (CTA kata kunci) |
| `profile` | nama tampil | handle | statistik: `value` + `label` | `note` bio, `button` ("Ikuti") diklik kursor pixel pada `buttonAt` → "Mengikuti ✓" (CTA follow) |

Maks 3-4 baris per mock. `zoom` default 1.1; turunkan ke 0.9-1 bila mock terpotong (form 3 field, layout `center`). Handle IG di `profile` tanyakan ke pengguna bila belum tahu.

`tone`: `accent` (jeruk) · `good` (hijau) · `bad` (merah) · `warn` (kuning tua) · `sky` · `lilac` · `sun` · `ink`.

## Tata letak (jangan dilanggar)
- Geometri ada di `remotion/src/layout.ts`. left/right: papan x 50-1030 y 230-1030, caption di sisi seberang karakter (y 1120-1440). center: papan y 230-870 (lebih pendek), caption di bawahnya, karakter di tengah. UI Reels menutup y>1500 dan sisi kanan bawah.
- Isi papan maks: judul 1-2 baris + 3 item. `center` cocok untuk papan `title` pendek; papan berisi daftar/perbandingan pakai left/right. Bila judul menabrak title bar, pecah adegan.
- `footer` (dialog) menjorok di bawah papan dan mengambil ruang bawah isi; pakai di papan berisi ≤3 baris pendek.
- Kata pertama adegan baru: adegan mulai 3 frame sebelum kata itu; elemen muncul 2 frame sebelum katanya.
- **Ganti visual tiap 2-3 detik**: minimal satu perubahan per kalimat (baris mock baru, flag, stempel, pose, atau adegan baru). Kalimat yang hanya didengar tanpa ada yang berubah di layar = tempat penonton scroll.
- Bila menambah jenis papan, tulis di `remotion/src/boards/Boards.tsx`, tipe di `remotion/src/types.ts`, lalu dokumentasikan di tabel ini.
