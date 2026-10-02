#!/usr/bin/env python3
"""Render per scene lalu gabung. Jalankan dari folder proyek HyperFrames.

Pakai: python3 scenes.py spec.json [--only id,id] [--debug] [--out ../out] [--merge-only]
Hasil: <out>/scenes/NN-<id>[-debug].mp4 dan <out>/scenes-merge/final[-debug].mp4
Hanya scene di --only yang dirender ulang; sisanya memakai file lama saat merge.
"""
import json, subprocess, sys, time
from pathlib import Path
a = sys.argv[1:]
spec_path = a[0]
def opt(name, default=None):
    return a[a.index(name) + 1] if name in a else default
only = opt("--only"); only = only.split(",") if only else None
debug = "--debug" in a
out = Path(opt("--out", "../out")).resolve()
suf = "-debug" if debug else ""
build = Path(__file__).parent / "build.py"
ids = [s["id"] for s in json.loads(Path(spec_path).read_text())["scenes"]]
(out / "scenes").mkdir(parents=True, exist_ok=True); (out / "scenes-merge").mkdir(parents=True, exist_ok=True)
t_start = time.time()
files = [out / "scenes" / f"{n + 1:02d}-{i}{suf}.mp4" for n, i in enumerate(ids)]
if "--merge-only" not in a:
    for i, f in zip(ids, files):
        if only and i not in only: continue
        tmp = Path(f"scene-{i}.html")
        subprocess.run([sys.executable, str(build), spec_path, "--scene", i, "--out", str(tmp)] + (["--debug"] if debug else []), check=True)
        try:
            subprocess.run(["npx", "hyperframes", "render", "-c", str(tmp), "-o", str(f), "--quiet", "--frames-cache-dir=off"], check=True)
        finally:
            tmp.unlink(missing_ok=True)
        if not f.exists() or f.stat().st_mtime < t_start:  # render bisa keluar kode 0 tanpa menulis file (disk penuh)
            raise SystemExit(f"render gagal (file tidak diperbarui): {f}")
missing = [str(f) for f in files if not f.exists()]
if missing: raise SystemExit("scene belum dirender: " + ", ".join(missing))
lst = out / "scenes-merge" / f"list{suf}.txt"
lst.write_text("".join(f"file '{f}'\n" for f in files))
final = out / "scenes-merge" / f"final{suf}.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", str(final)], check=True)
print(final)
