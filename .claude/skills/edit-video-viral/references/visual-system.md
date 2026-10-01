# Sistem visual

- Kanvas 1080x1920. Zona aman: caption y≈1245-1495, inset kanan ±120 px, atas ±150 px (UI platform menutupi).
- Caption: Montserrat 900 ±98 px kapital, kata aktif kuning, kata kunci di-pop. Maks 3 kata per potong.
- Palet: navy #0A1030, biru #1F6BFF, kuning #FFE11A, merah #FF2D2D. Ganti lewat `palette`.
- Ritme: ganti visual tiap 1.5-3 detik: punch-in kata kunci, stiker, kartu takeover, wipe. Zoom pelan bergantian tiap segmen.
- Hook 0-6 detik: split-screen KATANYA (atas, kuning) vs NYATANYA (bawah, navy), stempel, riser, impact, shake, flash.
- Latar mengikuti cerita: tiap adegan punya gambar blur, tint, dan kata raksasa pudar di belakang cutout.
- Polesan global: grain, vignette, progress bar kuning di atas.
- SFX (whoosh, impact, riser, pop, ding, glitch) dari `/media-use`, ditaruh otomatis oleh builder. Musik opsional, di-duck.
- Peringatan kontras untuk kata pudar di latar sengaja; abaikan.
- Perbaiki lewat snapshot: stempel menutup mata/caption, teks kinetik menimpa badge VS, label terlipat, emoji di zona caption.
