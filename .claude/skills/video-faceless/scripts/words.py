#!/usr/bin/env python3
"""align.json ElevenLabs -> words.json [[kata, mulai, akhir], ...]. Tag [..] tidak diucapkan, dibuang.
Pakai: python3 words.py tts/final.align.json tts/words.json"""
import json, sys
a = json.load(open(sys.argv[1]))
ch, s, e = a['characters'], a['character_start_times_seconds'], a['character_end_times_seconds']
words, cur, depth = [], None, 0
for c, t0, t1 in zip(ch, s, e):
    if c == '[': depth += 1; continue
    if c == ']': depth -= 1; continue
    if depth: continue
    if c.isspace():
        if cur: words.append(cur); cur = None
        continue
    if cur is None: cur = [c, t0, t1]
    else: cur[0] += c; cur[2] = t1
if cur: words.append(cur)
words = [[w, round(a, 2), round(b, 2)] for w, a, b in words]
json.dump(words, open(sys.argv[2], 'w'), ensure_ascii=False)
print(len(words), 'kata, selesai', words[-1][2], 'dtk')
