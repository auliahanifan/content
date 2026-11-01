#!/usr/bin/env python3
"""Bangun index.html video "Bukan Sulap: kalkulator ChatGPT". Jalankan dari folder proyek: python3 build.py"""
import sys
sys.path.insert(0, '/Users/noice/Dev/content/.claude/skills/video-faceless/scripts')
from lib import *

w = Words(); T, E = w.T, w.E
DUR = 62.5
VO = 62.0
JS = []
J = JS.append

def inn(id_, t, y=30, d=.45, ease='power3.out'):
    J(f'tl.fromTo("#{id_}",{{opacity:0,y:{y}}},{{opacity:1,y:0,duration:{d},ease:"{ease}",immediateRender:false}},{t:.2f});')
def pop(id_, t, d=.4):
    J(f'tl.fromTo("#{id_}",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:{d},ease:"back.out(1.8)",immediateRender:false}},{t:.2f});')
def out(id_, t, d=.25):
    J(f'tl.to("#{id_}",{{opacity:0,duration:{d}}},{t:.2f});')
def ring_in(id_, t):
    J(f'tl.fromTo("#{id_}",{{opacity:0,scale:1.4}},{{opacity:1,scale:1,duration:.35,ease:"back.out(1.6)",immediateRender:false}},{t:.2f});')

B = [0, T(9) - .05, T(24) - .05, T(30) - .05, T(45) - .1, T(50) - .05, T(61) - .05, T(71) - .05, T(84) - .05, T(100) - .05, T(120) - .1, DUR]
LBL = 'openai.com/index/gpt-6-for-everyone'

# ===== A hook: kartu OpenAI + cincin pada total =====
ring_total = '<div id="a-ring" class="ring o0" style="left:60%;top:87%;width:36%;height:8%"></div>'
sA = clip('sA', B[0], B[1],
    '<div id="a-h" class="headline hd o0">Rumusnya sudah Anda <span class="kb">cek</span>?</div>'
    + card('a-card', 'shot-bill-total.png', LBL, 520, 'contoh dari OpenAI', ring_total).replace('class="proof"', 'class="proof o0"').replace('style="top:520px"', 'style="top:540px;left:140px;width:800px"'))
inn('a-h', .15); inn('a-card', .5, 50)
ring_in('a-ring', T(5)); J(f'tl.to("#a-ring",{{scale:1.06,duration:.3,yoyo:true,repeat:3}},{T(5)+.4:.2f});')
out('sA', B[1] - .2, .2)

# ===== B: sejak 7 Oktober =====
sB = clip('sB', B[1], B[2],
    '<div id="b-d" class="big o0" style="top:300px;font-size:300px">7 Okt</div>'
    + chip('b-c1', 'Kalkulator', 'kobalt', 'left:70px;top:760px')
    + chip('b-c2', 'Pembagi tagihan', 'mint', 'left:300px;top:910px')
    + chip('b-c3', 'Game', 'amber', 'left:120px;top:1060px')
    + '<div id="b-t" class="mono o0" style="position:absolute;left:60px;top:650px;font-size:34px;color:var(--ink-600)">jawaban ChatGPT bisa berupa:</div>')
pop('b-d', B[1] + .1); inn('b-t', T(12), 20)
pop('b-c1', T(16)); pop('b-c2', T(17)); pop('b-c3', T(20))
J(f'tl.to(["#b-c1","#b-c2","#b-c3"],{{x:12,duration:.3,yoyo:true,repeat:1,stagger:.1}},{T(22):.2f});')
out('sB', B[2] - .2, .2)

# ===== C: sehari kemudian, gratis =====
sC = clip('sC', B[2], B[3],
    '<div id="c-1" class="chip o0 kobalt" style="left:90px;top:520px;font-size:46px">7 Okt · berbayar<small style="color:#DCE2FF">Plus, Pro, Business, Enterprise</small></div>'
    + '<div id="c-arr" class="o0" style="position:absolute;left:0;width:1080px;top:690px;text-align:center;font-size:110px;color:var(--kobalt-500);font-weight:600">&darr;</div>'
    + '<div id="c-2" class="chip o0 mint" style="left:90px;top:860px;font-size:46px">8 Okt · gratis<small>Free dan Go</small></div>')
pop('c-1', B[2] + .1); inn('c-arr', T(24) + .2, 10, .3); pop('c-2', T(26))
out('sC', B[3] - .2, .2)

# ===== D: contoh OpenAI, geser angka =====
sD = clip('sD', B[3], B[4],
    '<div id="d-h" class="headline hd o0" style="font-size:72px">Contoh OpenAI: <span class="kb">pembagi tagihan</span></div>'
    + card('d-c1', 'shot-bill-awal.png', LBL, 520, 'contoh dari OpenAI').replace('class="proof"', 'class="proof o0"').replace('style="top:520px"', 'style="top:540px;left:140px;width:800px"')
    + card('d-c2', 'shot-bill-total.png', LBL, 520, 'contoh dari OpenAI',
           '<div id="d-ring" class="ring mintr o0" style="left:60%;top:87%;width:36%;height:8%"></div>').replace('class="proof"', 'class="proof o0"').replace('style="top:520px"', 'style="top:540px;left:140px;width:800px"')
    + '<div id="d-ok" class="chip o0 mint" style="left:300px;top:1220px;font-size:36px;padding:12px 24px">Kelihatan meyakinkan</div>')
inn('d-h', B[3] + .1); inn('d-c1', T(30), 50)
J(f'tl.to("#d-c1",{{opacity:0,duration:.25}},{T(38) - .1:.2f});')
inn('d-c2', T(38) - .05, 30, .35); ring_in('d-ring', T(40))
J(f'tl.to("#d-ring",{{scale:1.06,duration:.25,yoyo:true,repeat:3}},{T(40) + .4:.2f});')
pop('d-ok', T(43))
out('sD', B[4] - .2, .2)

# ===== E: Bukan sulap (logo seri terbang ke tengah) =====
sE = clip('sE', B[4], B[5],
    '<div id="e-t" class="headline hd o0" style="top:1000px;text-align:center;left:60px;right:60px;font-size:76px">Begini cara kerjanya</div>')
J(f'tl.to(["#series","#seriesw"],{{x:150,y:430,scale:3.2,duration:.5,ease:"back.out(1.25)"}},{T(45) - .1:.2f});')
inn('e-t', T(47), 30)
J(f'tl.to(["#series","#seriesw"],{{x:0,y:0,scale:1,duration:.55,ease:"power3.inOut"}},{E(49) + .02:.2f});')
out('sE', B[5] - .2, .2)

# ===== F: komponen siap pakai =====
o = (540, 760)
isoF = (box('f-b1', 0, 0, 1.4, 1.4, .8, 'kobalt', o) + box('f-b2', 1.6, 0, 1.4, 1.4, .8, 'mint', o)
        + box('f-b3', .8, 1.6, 1.4, 1.4, .8, 'amber', o))
sF = clip('sF', B[5], B[6],
    '<div id="f-q" class="chip quote o0" style="left:60px;right:60px;top:300px">&ldquo;library of native, streamable <span class="hlq">components</span>&rdquo;<small>openai.com, 7 Oktober 2026</small></div>'
    + f'<svg class="iso" width="1080" height="1300" viewBox="0 0 1080 1300">{isoF}</svg>'
    + chip('f-c', 'dirakit sambil jawaban ditulis', 'kobalt', 'left:150px;top:1160px;font-size:38px').replace('class="chip kobalt"', 'class="chip kobalt o0"'))
J('gsap.set(["#f-b1","#f-b2","#f-b3"],{opacity:0});')
inn('f-q', B[5] + .2, 30)
for k, i in enumerate((55, 56, 57)):
    J(f'tl.fromTo("#f-b{k+1}",{{opacity:0,y:-60}},{{opacity:1,y:0,duration:.45,ease:"bounce.out",immediateRender:false}},{T(i):.2f});')
pop('f-c', T(58))
out('sF', B[6] - .2, .2)

# ===== G: tampilan vs rumus =====
sG = clip('sG', B[6], B[7],
    '<div id="g-1" class="chip o0 mint" style="left:90px;top:480px;font-size:52px">Tampilan ✓<small>komponen siap pakai</small></div>'
    + '<div id="g-2" class="chip o0 amber" style="left:90px;top:800px;font-size:52px">Rumus dan asumsi ?<small>dipilih model, bukan komponen</small></div>'
    + '<img id="g-r" class="o0" src="assets/img/clay-robot.png" style="position:absolute;right:60px;top:760px;width:260px"/>')
pop('g-1', B[6] + .15); pop('g-2', T(64)); pop('g-r', T(68))
out('sG', B[7] - .2, .2)

# ===== H: kata "akurasi" tidak ada =====
def srch(id_, top, label):
    return (f'<div id="{id_}" class="chip o0" style="left:70px;right:70px;top:{top}px;white-space:normal">'
            f'<span class="mono" style="font-size:24px;color:var(--ink-500)">{label}</span>'
            f'<div style="font-size:48px;margin-top:10px">cari &ldquo;akurasi&rdquo; &rarr; <span style="color:var(--koral-500)">tidak ada</span></div></div>')
sH = clip('sH', B[7], B[8],
    '<img id="h-m" class="o0" src="assets/img/clay-magnifying-glass.png" style="position:absolute;right:70px;top:250px;width:230px"/>'
    + srch('h-1', 520, 'PENGUMUMAN OPENAI') + srch('h-2', 800, 'CATATAN RILIS (HELP CENTER)')
    + '<div id="h-t" class="chip o0 koral" style="left:120px;top:1100px;font-size:36px">soal akurasi hitungan: tidak disebut</div>')
pop('h-m', B[7] + .1); inn('h-1', T(72)); inn('h-2', T(74) + .4)
pop('h-t', T(80))
out('sH', B[8] - .2, .2)

# ===== I: teman jago Excel =====
sI = clip('sI', B[8], B[9],
    '<img id="i-l" class="o0" src="assets/img/clay-laptop.png" style="position:absolute;left:300px;top:340px;width:480px"/>'
    + chip('i-1', 'Spreadsheet kilat', 'mint', 'left:90px;top:900px;font-size:44px').replace('class="chip mint"', 'class="chip mint o0"')
    + chip('i-2', 'Praktis', 'kobalt', 'left:560px;top:1010px;font-size:44px').replace('class="chip kobalt"', 'class="chip kobalt o0"')
    + chip('i-3', 'Rumus tetap dicek', 'amber', 'left:200px;top:1120px;font-size:44px').replace('class="chip amber"', 'class="chip amber o0"'))
pop('i-l', B[8] + .1); pop('i-1', T(91)); pop('i-2', T(94)); pop('i-3', T(97))
out('sI', B[9] - .2, .2)

# ===== J: dua contoh uji =====
def tc(id_, top, ttl, ex):
    return (f'<div id="{id_}" class="chip o0" style="left:70px;right:70px;top:{top}px;white-space:normal">'
            f'<span class="mono" style="font-size:24px;color:var(--ink-500)">{ttl}</span>'
            f'<div style="font-size:50px;margin-top:8px">{ex}</div><small>jawabannya sudah Anda tahu</small>'
            f'<div id="{id_}-ok" class="mint chip o0" style="position:absolute;right:24px;top:24px;padding:8px 18px;font-size:32px">✓ cocok</div></div>')
sJ = clip('sJ', B[9], B[10],
    tc('j-1', 360, 'CONTOH 1 · ANGKA BIASA', 'mis. 100') + tc('j-2', 660, 'CONTOH 2 · ANGKA EKSTREM', 'mis. 0 atau 1.000.000')
    + '<div id="j-w" class="chip o0 kobalt" style="left:330px;top:1000px;font-size:46px">Baru dipakai</div>')
inn('j-1', T(102) - .3); inn('j-2', T(110) - .3)
pop('j-1-ok', T(116) + .3); pop('j-2-ok', T(117) + .1)
pop('j-w', T(118)); J(f'tl.to("#j-1-ok,#j-2-ok",{{scale:1.12,duration:.2,yoyo:true,repeat:1}},{T(116) + .9:.2f});')
out('sJ', B[10] - .15, .15)

# ===== K: penutup gelap =====
sK = clip('sK', B[10], DUR,
    '<div id="g-bg"></div><div id="g-q">Terakhir kali AI membuatkan Anda alat hitung, <span class="kb">rumusnya sudah Anda cek?</span></div>', cls='scene g')
J(f'tl.to("#series",{{opacity:0,duration:.3}},{T(120) - .05:.2f});tl.to("#seriesw",{{opacity:1,duration:.3}},{T(120) - .05:.2f});')
J(f'tl.to("#sig",{{opacity:0,duration:.3}},{T(120) - .05:.2f});tl.to("#sigw",{{opacity:.95,duration:.3}},{T(120) - .05:.2f});')
J(f'tl.fromTo("#g-bg",{{opacity:0}},{{opacity:1,duration:.4}},{T(120) - .05:.2f});')
J(f'tl.fromTo("#g-q",{{opacity:0,y:40}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(120):.2f});')

# ===== kepala =====
EXP = [(0, 'berpikir'), (T(9) - .05, 'netral'), (T(14) - .05, 'kagum'), (T(24) - .05, 'senyum'), (T(38) - .05, 'kagum'),
       (T(43) - .05, 'yakin'), (T(45) - .05, 'mengedip'), (T(50) - .05, 'netral'), (T(64) - .05, 'bingung'),
       (T(68) - .05, 'ragu'), (T(76) - .05, 'khawatir'), (T(84) - .05, 'senyum'), (T(95) - .05, 'berpikir'),
       (T(100) - .05, 'yakin'), (T(116) - .05, 'kagum'), (T(118) - .05, 'lega'), (T(120) - .05, 'berpikir')]
phead = persistent_head(EXP, DUR, J)

# ===== caption =====
EMPH = {'rumusnya', 'cek', 'dicek', 'kalkulator', 'akurasi', 'sulap', 'model', 'ekstrem', 'biasa', 'gratis', 'komponen', 'Excel'}
cap_html, cap_js, groups = captions(w.W, DUR, merge={10: (11, '7 Oktober,')}, emph=EMPH)

sfx = [('whoosh', .05, .45), ('pop', T(5), .4), ('whoosh', B[1], .4), ('pop', T(16), .4), ('pop', T(17), .4), ('pop', T(20), .4),
       ('whoosh', B[2], .35), ('pop', T(26), .4), ('whoosh', B[3], .35), ('whoosh', T(38) - .05, .3), ('ding', T(43), .5),
       ('impact', T(45), .6), ('whoosh', B[5], .35), ('pop', T(55), .4), ('pop', T(56), .4), ('pop', T(57), .4),
       ('whoosh', B[6], .35), ('pop', T(64), .4), ('whoosh', B[7], .35), ('glitch', T(80), .3), ('whoosh', B[8], .35),
       ('pop', T(91), .4), ('pop', T(94), .4), ('pop', T(97), .4), ('whoosh', B[9], .35), ('ding', T(116) + .3, .5), ('pop', T(118), .4),
       ('whoosh', T(120) - .05, .4)]

EXTRA = '''
.o0{opacity:0}
.hd{top:300px}
.kb{color:var(--kobalt-500)}
#series,#seriesw{width:170px;left:44px;top:56px}
.chip small{font-weight:400}
'''
html = page('Bukan Sulap: kalkulator ChatGPT', DUR, [sA, sB, sC, sD, sE, sF, sG, sH, sI, sJ, sK], JS, cap_html, cap_js,
            sfx_html(sfx), phead, VO, VO, series='bukan-sulap', extra_css=EXTRA)
open('index.html', 'w').write(html)
print('index.html', len(html), 'bytes;', len(groups), 'caption groups')
