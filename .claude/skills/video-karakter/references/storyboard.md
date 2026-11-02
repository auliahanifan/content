# storyboard.json

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
  "autoSfx": true,                      // default
  "sfx": [{"at": 30, "name": "warn"}],  // tambahan: pop swipe thud ding warn
  "scenes": [ /* lihat di bawah */ ]
}
```

## Adegan
```jsonc
{
  "at": 15,                              // mulai (adegan pertama selalu frame 0)
  "pose": "menjelaskan",                 // pose saat adegan mulai
  "poses": [{"at": 37, "pose": "menunjuk"}],  // ganti pose di tengah adegan
  "board": { "type": "...", "kicker": "tab kecil di atas papan", ... },
  "footer": {"at": 118, "text": "Kusirnya? *Anda*.", "prop": "kusir", "emoji": "🤠"},  // banner kuning di dasar papan
  "dark": true,                          // penutup gelap
  "sfx": null                            // matikan swipe pembuka adegan ini (default "swipe")
}
```

**Pose** (`assets/karakter-*.png`): `menjelaskan` (tangan terbuka ke kanan) · `menunjuk` (menunjuk ke kanan) · `berpikir` (tangan di dagu) · `bingung` (angkat bahu) · `terkejut` (kedua tangan terbuka, mulut "O") · `yakin` (jempol). Ganti pose kira-kira tiap 1-3 kalimat; jangan tiap kata.

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

`tone`: `accent` (jeruk) · `good` (hijau) · `bad` (merah) · `warn` (kuning tua) · `sky` · `lilac` · `sun` · `ink`.

## Tata letak (jangan dilanggar)
- Papan: x 50-1030, y 230-1030. Isi papan maks: judul 1-2 baris + 3 item. Bila meluap (judul menabrak tab kicker), pecah jadi dua adegan.
- Karakter: kiri bawah, kepala ±y1050. Caption: kotak x 540-1000, y 1130-1430. UI Reels menutup y>1500 dan sisi kanan x>960 di bawah: jangan taruh info penting di sana.
- `footer` mengambil ruang bawah papan; pakai di papan yang isinya pendek.
- Kata pertama adegan baru: adegan mulai 3 frame sebelum kata itu; elemen muncul 2 frame sebelum katanya.
- Bila menambah jenis papan, tulis di `remotion/src/boards/Boards.tsx`, tipe di `remotion/src/types.ts`, lalu dokumentasikan di tabel ini.
