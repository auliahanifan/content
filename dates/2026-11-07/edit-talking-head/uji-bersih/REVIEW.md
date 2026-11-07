# REVIEW — NRW Reel (1080×1920, 30 fps, 44.6 s)

## Keputusan kreatif
- Trim: sumber 2.95 s → 47.55 s. Kalimat pertama sumber sudah terpotong ("…thousand properties in Wales at risk of flooding"), jadi dibuang; video dibuka di "Natural Resources Wales is recruiting" dan ditutup tepat setelah "good luck with it" (kartu logo sumber dibuang).
- Pembuka: B-roll banjir asli (0–3 s) + judul "NATURAL RESOURCES WALES / IS HIRING" (5 kata) sudah tampil di frame 0 (thumbnail). Frame banjir terakhir dibekukan 2.1–3.4 s untuk menutupi crossfade sumber; cutout masuk di 3.0 s.
- Latar: cutout AI (`remove-background`, tanpa green screen) di atas gradasi hijau hutan polos + glow lembut di belakang kepala.
- Caption: Archivo Black kapital, 82 px, stroke gelap, 2–4 kata per grup, kata aktif hijau-lime #D7F25C. Diletakkan di dada (y 1405–1605), di bawah dagu (~1340).
- Kartu (4): checklist "We're looking for" (bertahap per kata), "~30 years", "0 words of Welsh → training → fluent" (bertahap), CTA "See open roles · naturalresources.wales" (URL dari kartu penutup sumber). Punch-in 6% di "30 years" dan "fluent".
- Suara: voice dinormalisasi −29 → −16.6 LUFS (true peak −1.2 dBTP). SFX bawaan pelan: 2 whoosh pendek, 5 pop, 2 soft click. Tanpa musik.

## Yang diukur
- `hyperframes check`: 0 error, 0 warning (lint, runtime, layout/teks kepotong, kontras 23/23, craft).
- Sinkron caption: whisper medium.en meleset hingga ~1.2 s di tengah → diganti Parakeet; setiap awal kata dicek terhadap jeda hening (silencedetect −30 dB), 5 kata yang masuk jeda digeser.
- Area aman: teks terbawah di y≈1605 (batas 1670); caption max-width 820 px (x 130–950), menjauhi rail kanan.
- Audio render: −16.6 LUFS, tanpa clipping. Diukur, tidak didengar.

## Kelemahan / kalau ada waktu lagi
- Jeda "um" ~2 s di 24.9–26.3 s (dan "um" kecil di 27.9 & 33.3) masih ada — bisa di-jump-cut.
- Kata "opportunities FOR advertising" — kedua model mendengar "for"; kemungkinan aslinya "we're advertising".
- Kualitas B-roll pembuka lembek (720p diperbesar 2.67×).
- Tepi cutout di rambut kadang sedikit berpendar; logo di jaket tertutup sebagian oleh caption.
- Tidak ada musik latar (HeyGen belum login).
