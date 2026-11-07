# Sumber footage
"FCRM Recruitment Vlog 2021 (ENG)" oleh Natural Resources Wales / Cyfoeth Naturiol Cymru, CC BY 3.0,
https://commons.wikimedia.org/wiki/File:FCRM_Recruitment_Vlog_2021_(ENG).webm
Dipotong detik 20,4 sampai akhir (versi transcode 720p). Diedit (cutout, caption, kartu) oleh Claude Code + HyperFrames.

# Uji bersih
- Folder kosong di luar repo; hanya 4 skill inti resmi HyperFrames (lihat skills-lock.json): hyperframes, hyperframes-cli, hyperframes-registry, media-use.
- claude -p (Claude Code 2.1.319) --setting-sources project --strict-mcp-config, tanpa CLAUDE.md, tanpa skill repo.
- Model: default Claude Code (tanpa --model). Sekali jalan, tanpa campur tangan: 82 langkah, 24,6 menit, biaya API 3,40 dolar.
- Skill yang dipanggil: hyperframes (1x). Alat: Bash 60, Read 13, Write 2.
- Rekaman: rekam/footage-mentah.mp4, rekam/hasil-claude.mp4 (tidak di-commit). Log lengkap: log.jsonl.gz.
