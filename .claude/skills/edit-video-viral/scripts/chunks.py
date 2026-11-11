#!/usr/bin/env python3
"""Pecah take mentah per jeda lalu transkrip tiap potongan (untuk memilah retake).

Pakai: python3 chunks.py take.mov [model] [-32] [0.22]
Keluar: tabel "mulai-selesai  teks" per potongan. Timestamp kata Whisper tidak dipercaya;
pakai batas jeda ini, lalu tentukan titik potong dari envelope RMS (references/retake.md).
"""
import re, subprocess, sys, tempfile, os
src = sys.argv[1]
# model default: <root repo>/model/..., supaya jalan dari folder proyek mana pun
repo = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", ".."))
model = sys.argv[2] if len(sys.argv) > 2 else os.path.join(repo, "model", "ggml-large-v3-turbo.bin")
if not os.path.isfile(model): sys.exit(f"model Whisper tidak ditemukan: {model} (lihat CLAUDE.md)")
db = sys.argv[3] if len(sys.argv) > 3 else "-32"
dur = sys.argv[4] if len(sys.argv) > 4 else "0.22"
tmp = tempfile.mkdtemp()
wav = os.path.join(tmp, "a.wav")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", "16000", wav], check=True)
log = subprocess.run(["ffmpeg", "-i", wav, "-af", f"silencedetect=n={db}dB:d={dur}", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
total = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav],
                             capture_output=True, text=True).stdout)
bounds = []
for s, e in zip(starts + [total], [0.0] + ends):
    if s - e > 0.15: bounds.append((e, s))
for a, b in bounds:
    c = os.path.join(tmp, "c.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{max(0, a - .15):.2f}", "-t", f"{b - a + .3:.2f}", "-i", wav, c], check=True)
    r = subprocess.run(["whisper-cli", "-m", model, "-l", "id", "-nt", "-f", c], capture_output=True, text=True)
    if r.returncode: sys.exit(f"whisper-cli gagal ({r.returncode}): {r.stderr.strip()[-300:]}")
    print(f"{a:7.2f}-{b:7.2f}  {r.stdout.strip()}")
