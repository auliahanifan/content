#!/usr/bin/env python3
"""Pasang musik latar ke video hasil render, ducking otomatis di bawah suara.

Pakai: python3 bgm.py render.mp4 musik.mp3 out.mp4 [volume=0.18]
Musik di-loop dan di-fade; ducking dari mix hasil render (sidechain), bukan dari track terpisah.
"""
import subprocess, sys
vid, mus, out = sys.argv[1:4]
vol = sys.argv[4] if len(sys.argv) > 4 else "0.18"
d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vid],
                         capture_output=True, text=True).stdout)
fc = (f"[1:a]aloop=loop=-1:size=2e9,atrim=0:{d},volume={vol},afade=t=in:d=0.5,afade=t=out:st={d - 1.2:.2f}:d=1.2[m];"
      "[0:a]asplit[v1][v2];[m][v1]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[duck];"
      "[v2][duck]amix=inputs=2:duration=first:normalize=0[a]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", vid, "-i", mus, "-filter_complex", fc,
                "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", out], check=True)
print(out)
