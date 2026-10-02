# Skema spec.json

Dibaca `scripts/build.py`. Contoh lengkap: `examples/muse-spec.json`.

Top-level: `source {video, audio, grade}`, `pre` (detik hening sebelum segmen pertama untuk hook), `palette` (navy ink blue yellow red white), `font`, `sfx_dir`, `keywords` (kata yang di-pop di caption), `segments`, `hook`, `backgrounds`, `overlays`, `music {file}`.

Segmen: `{id, src:[mulai,selesai], text, pad:[awal,akhir], caption:true}`. Teks kosong atau `caption:false` = tanpa caption.

Ekspresi waktu: `s4` (mulai), `s4.end`, `s4.w3` (kata ke-3, mulai 0), `total`, angka, plus offset `s4.end-0.2`.

Overlay (`type`):
- `takeover` {from,to,label,wipe,items}: kartu layar penuh. Item: `card` {image,tilt,photo,zoom,highlights:[{box:[x,y,w,h],at}],ellipse:{cx,cy,rx,ry,at}}, `logos` {items:[{img,at}]}, `pills` {items:[{text,style:grey|blue|yellow|green|red,big,arrow,at}]}, `rows` {items:[{text,emoji|thumb,at}]}. Koordinat highlight dalam piksel gambar asli.
- `sticker` {kind:logo|emoji|ai|qmark|sym|word|bubble|html, at, until, x, y, rot, pop}
- `chip` {text,at,until,color,pos}, `stamp` {text,at,until}
- `punch` {at,amt}, `wipe` {at,color}, `shake` {at,amp,n}, `flash` {at,color,dur,peak}, `sfx` {file,at,vol,dur,ms}

`hook`: split-screen `{until, top:{icons,title,sub,align:"right"}, bottom:{title,sub,image}, kinetic:{text,at}, stamp:{text,at}, vs}`. Segmen hook ditempatkan di awal dengan `caption:false`.

`backgrounds`: `[{from,to,image,word,tint,x,y,size,rot}]` latar di belakang cutout, kata raksasa pudar bergerak pelan.

`scenes`: `[{id, from, to}]` batas scene (ekspresi waktu, harus berimpit dengan batas segmen dan berurutan tanpa celah, scene pertama dari 0, terakhir sampai `total`). Dipakai `scripts/scenes.py` dan `build.py --scene id`. Flag `build.py --debug` menampilkan id segmen dan timecode.

`brand.marks`: logo/signature permanen di atas segalanya (z di atas wipe dan grain, di bawah progress bar). Item: `{img, x, y, w, opacity, at, reveal:"write"|"pop", dur, intro:{at,cx,cy,w,fly,fly_dur}}`. `reveal:"write"` = terungkap kiri ke kanan seperti ditulis tangan. `intro` = muncul besar di (cx,cy) lebar `w`, lalu terbang ke (x,y,w) pada `fly`. Pakai SVG yang sudah di-crop (viewBox rapat) dan, untuk latar gelap, versi putih. Zona aman: baris atas y≈170, kiri/kanan margin ≥40; `top.align:"right"` memindah pil logo hook ke kanan supaya tidak menabrak watermark kiri.
