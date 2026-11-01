#!/usr/bin/env python3
"""SEMENTARA: perkiraan timing kata dari naskah bertag (tanpa VO). Ganti dengan words.py dari alignment ElevenLabs.
Pakai: python3 tools/est_words.py tts/final.txt tts/words.json"""
import json, re, sys
txt = open(sys.argv[1]).read()
out, t = [], 0.3
for para in txt.strip().split('\n\n'):
    for w in re.sub(r'\[[^\]]*\]', ' ', para).split():
        syl = max(1, len(re.findall(r'[aiueoAIUEO]', w)))
        d = 0.075 + 0.145 * syl
        out.append([w, round(t, 2), round(t + d, 2)]); t += d + 0.04
        if w[-1] in ',:': t += 0.22
        elif w[-1] in '.?': t += 0.42
    t += 0.25
k = 63.0 / out[-1][2]  # skala ke target durasi naskah (60-65 dtk)
out = [[w, round(a * k, 2), round(b * k, 2)] for w, a, b in out]
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False)
print(len(out), 'kata, selesai', out[-1][2], 'dtk')
