# storyboard.json mode kanvas (default)

Kanvas 1080x1920, 30 fps. Semua `at`, `from`, `split`, `doneAt`, `strikeAt` = **indeks kata** di `tts/words.json`. Durasi = audio + `tail`.

Prinsip (riset `dates/2026-11-04/riset-hisvill.md`): satu latar sepanjang video, satu titik fokus, dan **yang berubah di layar adalah isi penjelasan, bukan dekorasi**. Penonton pemula membaca headline, melihat satu peraga yang tumbuh, lalu paham.

## Zona layar
| Zona | y | Isi |
|---|---|---|
| Header | 44-214 | logo seri (kiri), chip topik (kanan), tanda tangan. Chip berubah jadi hitung mundur saat `loop` aktif |
| Headline | 236-536 | baris pengantar kecil abu + frasa inti besar, kata kunci kobalt bergaris titik. **Pengganti caption** |
| Panggung | 560-1440 | elemen panel; di samping Pixel Aulia (`char` left/right) atau lebar penuh (`corner`/`none`) |
| UI Reels | >1500, kanan bawah | kosong |

Palet = design system faceless Aulia (mist, kartu putih, kobalt, mint, amber, koral), font Plus Jakarta Sans. Kode: `remotion/src/kanvas/`.

## Skema
```jsonc
{
  "style": "kanvas",                       // default bila ada `panels`
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
  "epic": [],                               // opsional, MAKS 1 (punchline terbesar saja)
  "sfx": [{"at": 30, "name": "coin"}]       // tambahan; SFX dasar otomatis & pelan
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
`{at, char?, pose?, layout?, gap?, zoom?, topic?, items, sfx?}`. Panel = satu peraga utuh; ganti panel hanya saat **bagian** penjelasan berganti (biasanya 6-10 panel per 60-90 detik), bukan tiap kalimat. Di dalam panel, elemen muncul satu per satu pada kata yang menyebutnya; tempatnya sudah dipesan sejak awal sehingga tidak ada yang bergeser.
- `char`: `left` (default, panggung kanan 670 px) · `right` · `corner` (karakter kecil kiri bawah, panggung lebar penuh: tutorial/rekam layar) · `none`. Mewarisi panel sebelumnya.
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
| `shot` | `src`, `source`, `rings[{at,x,y,w,h,tone}]` (persen) | bukti layar statis |
| `phone` | `src` (mp4 rekaman layar di folder video, atau png), `from` (detik mulai di rekaman), `rate`, `rings`, `steps[{at, text}]` (stepper di kiri HP) | **tutorial rekam layar** |
| `stepper` | `items[{at, text}]` | langkah bernomor tanpa HP |
| `row` | `items` (elemen anak), `op`, `gap` | dua hal berdampingan: A vs B, sebelum/sesudah |

`icon`: `{emoji}` (di-pixel-kan seperti props Pixel Aulia), `{prop}` (PNG `assets/props/`), atau `{src}` (PNG di folder video, mis. logo aplikasi). `tone`: accent (kobalt) · good (mint) · bad (koral) · warn (amber) · sun · sky · lilac · ink.

## Rekam layar (tutorial)
- Aulia merekam layar HP (portrait) atau laptop, simpan di `<folder-video>/rekam/<nama>.mp4` (mp4/mov di `rekam/` sudah di-gitignore).
- Satu `phone` per bagian; `from` = detik di rekaman saat langkah pertama bagian itu. Rekaman berjalan 1x mulai `at` elemen. Bila rekaman lebih lambat dari suara, potong dulu per langkah dengan ffmpeg (`-ss`/`-to`) atau pakai `rate`.
- `steps` di `phone` = stepper yang menyala per langkah; headline mengucapkan langkahnya ("Langkah 3 · klik ikon plus").
- `rings` menyorot tombol yang ditekan (persen dari layar HP), tepat di kata yang menyebutnya.
- Panel tutorial memakai `char: "corner"` dan pose `smartphone`/`laptop`.

## Aturan (jangan dilanggar)
- **Satu titik fokus.** Maks 3 elemen terlihat per panel (row dihitung 1). Elemen lama yang tidak dibahas lagi diberi `dimAt`.
- **Peraga, bukan label.** Elemen memperlihatkan proses atau perubahan (dicentang, dicoret, diganti, bertambah), bukan sekadar menamai isi kalimat. Tanya: "kalau suara dimatikan, apakah layar masih menjelaskan?"
- **Satu analogi dibangun bertahap** di satu panel (flow/icon yang tumbuh), dan dipanggil lagi di penutup.
- **Dekorasi**: epik maks 1, stempel maks 2, tanpa stiker/pop/fx/map/mood/aura (diabaikan di kanvas). `pnpm density` menolak bila lewat batas.
- **Kepadatan**: tidak ada jeda > 3 detik tanpa perubahan headline/panggung (`pnpm density`, otomatis batas 3 untuk kanvas).
- Pose cocok dengan kalimat (pengguna sangat peduli): `menunjuk` saat elemen baru muncul, `berpikir` di pertanyaan, `stop` saat membantah, `setuju` di kesimpulan, `smartphone`/`laptop` di tutorial. Ganti tiap 1-3 kalimat.
- Penutup: panel CTA `ui` `comments` (pertanyaan atau kata kunci komentar) dan/atau `profile` (follow), lalu aturan bawa pulang dalam satu `card`.

## Contoh
Pilot lengkap: `dates/2026-11-01/agent-harness-kanvas/storyboard.json` (audio sama dengan `agent-harness-v2`, untuk dibandingkan dengan mode game). Pola dari riset:
```jsonc
// hadiah + jangkar harga
{"at": 0, "char": "left", "pose": "menunjuk", "items": [
  {"kind": "card", "tag": "PROMPT PREMIUM", "title": "1.000 Prompt AI", "value": "Rp499.000", "swap": {"at": 9, "value": "Rp0"}},
  {"kind": "card", "at": 4, "tag": "KELAS", "title": "Masterclass Prompt", "value": "Rp1.500.000", "swap": {"at": 10, "value": "Rp0"}, "stamp": {"at": 11, "text": "GRATIS!"}}
]}
// simulasi satu tugas: agent bekerja
{"at": 60, "char": "right", "items": [
  {"kind": "ui", "ui": "chat", "app": "AI agent", "items": [{"at": 61, "text": "Tolong rapikan folder Download", "side": "out"}]},
  {"kind": "checklist", "at": 64, "items": [
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
