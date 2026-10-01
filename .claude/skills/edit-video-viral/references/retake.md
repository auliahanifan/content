# Memilah retake

1. `python3 scripts/chunks.py take.mov` memecah per jeda dan mentranskrip tiap potongan. Model Whisper: `model/ggml-large-v3-turbo.bin`, `-l id`.
2. Kelompokkan potongan per kalimat naskah. Default: ambil take paling akhir yang utuh; cek ulang dengan telinga bila ragu.
3. Titik potong jangan dari timestamp kata Whisper (tidak akurat). Hitung envelope RMS dengan ffmpeg: napas ≈ -45 dB, ucapan > -30 dB. Potong di dasar napas, beri `pad` 0.04-0.10 s.
4. Jebakan: ASR menghilangkan kata pelan di awal ("Katanya") dan berhalusinasi di ujung jendela terpotong. Jangan percaya satu transkrip untuk kata 1 detik; ekstrak klip pendek dan minta user mendengar.
5. Awal palsu ("Tugas ... jeda ... tugas usaha apa") harus dibuang: mulai segmen setelah awal palsu. Kata dobel di sambungan: pecah jadi dua segmen dengan `src` yang tidak tumpang tindih.
6. Catat hasil sebagai `segments` di spec (id, src [mulai, selesai], text, pad). Waktu kata di caption dihitung proporsional dari panjang kata.
7. Klip periksa (mp3 pendek per sambungan) hanya untuk mendengar; akhiri tepat di batas segmen, kalau tidak user mendengar kata terpotong.
