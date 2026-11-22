#!/usr/bin/env python3
"""Suara Aulia default: OmniVoice (klon zero-shot, lokal) + timestamp kata Whisper.

Pakai (lewat tts-omni.sh, yang memakai venv .venv-voice):
    tts-omni.sh tts/final.txt tts/final
Keluaran:
    tts/final.mp3          audio siap pakai (loudnorm -14 LUFS)
    tts/words.json         [[kata, mulai, akhir], ...] untuk storyboard / lib.py
    tts/final.paras.json   batas waktu tiap paragraf
    tts/.omni-cache/       hasil per paragraf (dipakai ulang; hapus untuk membuat ulang)

Naskah: paragraf dipisah baris kosong. Tag [..] (mis. [confident]) dibuang, tidak diucapkan.
Opsi env: SPEED (default 1.0), REF / REF_TEXT (contoh suara, default assets/voice/aulia-ref.*),
          GAP (jeda antarparagraf, default 0.28), WHISPER (default small).
Lisensi: kode OmniVoice Apache 2.0, bobot model CC-BY-NC (non-komersial)."""
import json, os, re, subprocess, sys, difflib
import numpy as np, soundfile as sf

txt, prefix = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
root = subprocess.run(['git', '-C', here, 'rev-parse', '--show-toplevel'], capture_output=True, text=True).stdout.strip() \
    or os.path.abspath(os.path.join(here, '../../../..'))
REF = os.environ.get('REF', f'{root}/assets/voice/aulia-ref.wav')
REF_TEXT = open(os.environ.get('REF_TEXT', REF.rsplit('.', 1)[0] + '.txt')).read().strip()
SPEED = float(os.environ.get('SPEED', '1.0'))
GAP = float(os.environ.get('GAP', '0.28'))
SR = 24000
outdir = os.path.dirname(os.path.abspath(prefix))
cache = os.path.join(outdir, '.omni-cache'); os.makedirs(cache, exist_ok=True)

paras = [re.sub(r'\[[^\]]*\]', '', p).strip() for p in open(txt).read().split('\n\n')]
paras = [re.sub(r'\s+', ' ', p) for p in paras if p]

# ---------- 1. OmniVoice per paragraf (cache per isi + pengaturan) ----------
import hashlib, torch
dev = 'cuda:0' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu'
model = None
def trim(a, th=0.012):
    idx = np.where(np.abs(a) > th)[0]
    if not len(idx): return a
    return a[max(0, idx[0] - int(0.01 * SR)):min(len(a), idx[-1] + int(0.025 * SR))]
pieces = []
for i, p in enumerate(paras):
    key = hashlib.sha1(f'{p}|{SPEED}|{REF}|{REF_TEXT}'.encode()).hexdigest()[:12]
    c = f'{cache}/{i:02d}-{key}.wav'
    if not os.path.exists(c):
        if model is None:
            from omnivoice import OmniVoice
            if dev == 'cpu': torch.set_num_threads(os.cpu_count() or 4)
            model = OmniVoice.from_pretrained('k2-fsa/OmniVoice', device_map=dev,
                                              dtype=torch.float16 if dev.startswith('cuda') else torch.float32)
        a = model.generate(text=p, language='id', ref_audio=REF, ref_text=REF_TEXT, speed=SPEED)[0]
        sf.write(c, trim(np.asarray(a, dtype=np.float32)), SR)
        print(f'paragraf {i+1}/{len(paras)} dibuat ({dev})', flush=True)
    pieces.append(sf.read(c)[0].astype(np.float32))

info, chunks, t = [], [], 0.0
for p, a in zip(paras, pieces):
    d = len(a) / SR
    info.append({'text': p, 'start': round(t, 3), 'end': round(t + d, 3)})
    chunks += [a, np.zeros(int(GAP * SR), dtype=np.float32)]; t += d + GAP
wav = f'{prefix}.wav'
sf.write(wav, np.concatenate(chunks), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                '-ar', '44100', '-b:a', '192k', f'{prefix}.mp3'], check=True)
os.remove(wav)
json.dump(info, open(f'{prefix}.paras.json', 'w'), ensure_ascii=False, indent=1)
print(f'audio {round(t - GAP, 1)} dtk -> {prefix}.mp3', flush=True)

# ---------- 2. Timestamp kata: Whisper per paragraf, dicocokkan ke kata naskah ----------
import librosa
from faster_whisper import WhisperModel
y, _ = librosa.load(f'{prefix}.mp3', sr=16000)
wm = WhisperModel(os.environ.get('WHISPER', 'small'), device='cpu', compute_type='int8')
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
out, total, cocok = [], 0, 0
for p in info:
    s0, s1 = p['start'], p['end']
    segs, _ = wm.transcribe(y[int(s0 * 16000):int((s1 + 0.15) * 16000)], language='id', word_timestamps=True,
                            initial_prompt=' '.join(sorted({w for w in p['text'].split() if w[:1].isupper()})))
    hw = [(w.word.strip(), w.start + s0, w.end + s0) for sg in segs for w in sg.words]
    sw = p['text'].split(); times = [None] * len(sw)
    sm = difflib.SequenceMatcher(a=[norm(w) for w in sw], b=[norm(w[0]) for w in hw], autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1): times[i1 + k] = hw[j1 + k][1:]; cocok += 1
        elif tag == 'replace':  # bagi rata rentang Whisper ke kata naskah (mis. "Satu." vs "1")
            t0, t1 = hw[j1][1], hw[j2 - 1][2]; n = i2 - i1
            for k in range(n): times[i1 + k] = (t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n)
    for i in range(len(sw)):  # sisa: interpolasi di antara tetangga
        if times[i]: continue
        a = next((times[k][1] for k in range(i - 1, -1, -1) if times[k]), s0)
        j = next((k for k in range(i + 1, len(sw)) if times[k]), None)
        b = times[j][0] if j is not None else s1
        n = (j if j is not None else len(sw)) - i
        times[i] = (a, a + (b - a) / n)
    total += len(sw)
    out += [[w, round(a, 2), round(b, 2)] for w, (a, b) in zip(sw, times)]
for i in range(1, len(out)):  # jaga urutan naik
    out[i][1] = max(out[i][1], out[i - 1][1]); out[i][2] = max(out[i][2], out[i][1] + 0.05)
json.dump(out, open(os.path.join(outdir, 'words.json'), 'w'), ensure_ascii=False)
print(f'{len(out)} kata ({cocok}/{total} cocok langsung dengan Whisper), selesai {out[-1][2]} dtk -> words.json')
