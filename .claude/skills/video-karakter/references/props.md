# Props ilustrasi

Props = gambar benda/konsep bergaya sama dengan karakter Aulia (kartun, outline tinta gelap tebal, cel shading lembut). File: `assets/props/<nama>.png` (root repo), PNG transparan persegi ±1024 px, benda di tengah dengan margin ±8%. Nama huruf kecil berstrip: `kacamata-kuda`, `tali-kekang`.

Selama file belum ada, papan menampilkan stiker bulat berisi `emoji` dari storyboard (placeholder). Saat render, konsol mencetak `props belum ada (pakai placeholder): ...`. Begitu PNG ditaruh di `assets/props/`, render berikutnya langsung memakainya, tanpa mengubah storyboard.

Pakai ulang props yang sudah ada sebelum meminta yang baru (`ls assets/props`).

## Template prompt (satu per props)
Sertakan `assets/karakter-referensi.png` sebagai gambar referensi gaya.

```
Single object illustration of <BENDA, deskripsi singkat & konteks Indonesia bila relevan>,
same art style as the reference character sheet: clean cartoon, bold dark navy outlines (#1B1F3B),
soft cel shading, slightly chunky proportions, warm friendly colors.
Centered, 3/4 view, no text, no background (transparent PNG), no shadow on the ground,
square 1024x1024 with ~8% padding.
```

## Format `props-prompt.md` per video
```
# Props <slug>
| nama file | dipakai di | prompt (isi <BENDA>) |
|---|---|---|
| kuda.png | adegan 6, 8 | a brown Javanese andong horse, standing, friendly |
```
