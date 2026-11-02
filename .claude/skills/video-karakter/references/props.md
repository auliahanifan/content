# Props ilustrasi

Default: setiap item cukup diberi `emoji`. Emoji dirender 20 px di canvas lalu diperbesar tanpa smoothing, jadi tampil sebagai ikon pixel di slot inventory. Pilih emoji yang bentuknya jelas pada resolusi rendah (benda tunggal, bukan wajah kecil atau bendera).

Opsional: PNG `assets/props/<prop>.png` (root repo) menggantikan emoji untuk nama `prop` itu. Gaya harus sama dengan Pixel Aulia (pixel art "06 Outlined"), transparan, persegi, benda di tengah. Begitu file ada, render berikutnya memakainya tanpa mengubah storyboard; konsol mencetak props yang belum ada.

Pakai ulang props yang sudah ada sebelum meminta yang baru (`ls assets/props`).

## Template prompt (satu per props)
Sertakan `assets/pixel-aulia/references/styles-3x3.png` (gaya 06 Outlined) sebagai referensi.

```
Single pixel-art game item sprite of <BENDA, deskripsi singkat & konteks Indonesia bila relevan>,
same style as reference "06 Outlined": crisp pixels, 1-pixel dark navy outline (#1B1F3B),
limited palette, simple 2-tone shading, no anti-aliasing.
Centered, no text, transparent background, square 1024x1024 with ~8% padding.
```

## Format `props-prompt.md` per video
```
# Props <slug>
| nama file | dipakai di | prompt (isi <BENDA>) |
|---|---|---|
| kuda.png | adegan 6, 8 | a brown Javanese andong horse, standing, friendly |
```
