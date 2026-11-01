#!/usr/bin/env python3
"""Bangun index.html video "Bukan Sulap: agent harness". Jalankan dari folder proyek: python3 build.py"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../.claude/skills/video-faceless/scripts'))
from lib import *

w = Words(); T, E = w.T, w.E
VO = 73.17
DUR = 74.2
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
def o0(html):  # mulai tak terlihat
    return html.replace('class="chip ', 'class="chip o0 ', 1)

# batas adegan
B = [0, T(15) - .1, T(48) - .1, T(54) - .1, T(59) - .1, T(74) - .1, T(121) - .1, T(145) - .1, T(168) - .1, DUR]

# ===== A hook: GPT-5.5 63% vs 85%, "ganti model?" dicoret =====
PX = 5.6; BASE = 1070
def bar(id_, left, pct, val, app, tone):
    h = pct * PX
    return (f'<div id="{id_}" class="o0" style="position:absolute;left:{left}px;top:{BASE - h - 120}px;width:300px;height:{h + 210}px">'
            f'<div class="bnum" style="color:var(--{tone}-600)">{val}</div>'
            f'<div id="{id_}-b" class="bar {tone}b" style="height:{h}px"></div>'
            f'<div class="blbl">GPT-5.5<small class="mono">{app}</small></div></div>')
sA = clip('sA', B[0], B[1],
    '<div id="a-h" class="headline hd o0">Hasil AI Anda <span class="kb">jelek</span>?</div>'
    + bar('a-b1', 150, 63, '63%', 'aplikasi A', 'koral') + bar('a-b2', 630, 85, '85%', 'aplikasi B', 'mint')
    + '<div id="a-x" class="chip o0" style="left:170px;top:1170px;font-size:48px;color:var(--ink-500)">'
      '<img src="assets/img/clay-money-bag.png" style="width:70px;vertical-align:middle;margin-right:14px"/>Ganti model lebih mahal?'
      '<div id="a-xl" class="strike"></div></div>')
inn('a-h', .1)
for k, t in ((1, .55), (2, 1.0)):
    J(f'tl.fromTo("#a-b{k}",{{opacity:0}},{{opacity:1,duration:.2,immediateRender:false}},{t:.2f});')
    J(f'tl.fromTo("#a-b{k}-b",{{scaleY:0}},{{scaleY:1,duration:.55,ease:"power3.out",immediateRender:false}},{t:.2f});')
J(f'tl.to(["#a-b1","#a-b2"],{{y:-10,duration:.2,yoyo:true,repeat:1,stagger:.08}},{T(6):.2f});')
pop('a-x', T(9))
J(f'tl.fromTo("#a-xl",{{scaleX:0}},{{scaleX:1,duration:.3,ease:"power2.out",immediateRender:false}},{T(13):.2f});')
out('sA', B[1] - .2, .2)

# ===== B: bukti Endor Labs, satu model dua aplikasi =====
LBL = 'endorlabs.com/research/ai-code-security-benchmark'.replace('/ai-code-security-benchmark', '/…benchmark')
rings = ('<div id="b-r2" class="ring o0" style="left:71%;top:76%;width:18%;height:17%"></div>'
         '<div id="b-r1" class="ring mintr o0" style="left:71%;top:32%;width:18%;height:17%"></div>')
sB = clip('sB', B[1], B[2],
    '<div id="b-h" class="headline hd o0" style="font-size:80px">Satu model, <span class="kb">dua aplikasi</span></div>'
    + card('b-card', 'shot-leaderboard.png', LBL, 430, 'data 25 Apr 2026', rings).replace('class="proof"', 'class="proof o0"')
    + '<div id="b-c1" class="chip o0 koral" style="left:60px;top:1135px;font-size:50px">Codex · 63%</div>'
    + '<div id="b-c2" class="chip o0 mint" style="left:560px;top:1135px;font-size:50px">Cursor · 85%</div>')
inn('b-h', B[1] + .1); inn('b-card', T(17), 50)
ring_in('b-r2', T(37)); pop('b-c1', T(37))
ring_in('b-r1', T(45)); pop('b-c2', T(45))
J(f'tl.to("#b-r1",{{scale:1.08,duration:.25,yoyo:true,repeat:3}},{T(45) + .4:.2f});')
out('sB', B[2] - .2, .2)

# ===== C: otaknya sama, bungkusnya beda: harness =====
sC = clip('sC', B[2], B[3],
    '<img id="c-r" class="o0" src="assets/img/clay-robot.png" style="position:absolute;left:350px;top:330px;width:380px"/>'
    + '<div id="c-1" class="chip o0 mint" style="left:250px;top:760px;font-size:50px">Otaknya sama: GPT-5.5</div>'
    + '<div id="c-2" class="mono o0" style="position:absolute;left:0;width:1080px;top:900px;text-align:center;font-size:40px;color:var(--ink-600)">yang beda bungkusnya:</div>'
    + '<div id="c-3" class="big o0" style="top:960px;font-size:200px">harness</div>')
pop('c-r', B[2] + .05); pop('c-1', T(49)); inn('c-2', T(50), 20); pop('c-3', T(53), .5)
out('sC', B[3] - .2, .2)

# ===== D: Bukan sulap (logo seri terbang ke tengah) =====
sD = clip('sD', B[3], B[4],
    '<div id="d-t" class="headline hd o0" style="top:1000px;text-align:center;left:60px;right:60px;font-size:76px">Begini cara kerjanya</div>')
J(f'tl.to(["#series","#seriesw"],{{x:150,y:430,scale:3.2,duration:.5,ease:"back.out(1.25)"}},{T(54) - .1:.2f});')
inn('d-t', T(56), 30)
J(f'tl.to(["#series","#seriesw"],{{x:0,y:0,scale:1,duration:.55,ease:"power3.inOut"}},{E(58) + .02:.2f});')
out('sD', B[4] - .2, .2)

# ===== E: andong di Malioboro, kuda = model AI =====
o = (770, 640)
P0 = lambda x, y: P(x, y, 0, o)
wheels = ''.join(f'<circle cx="{P0(x, 1.4)[0]:.1f}" cy="{P0(x, 1.4)[1] - 8:.1f}" r="46" fill="#2E333D" stroke="#fff" stroke-width="4"/>'
                 f'<circle cx="{P0(x, 1.4)[0]:.1f}" cy="{P0(x, 1.4)[1] - 8:.1f}" r="12" fill="#A3AAB7"/>' for x in (.5, 1.9))
tali, _ = pipe('e-tali', [(-.2, .7), (-1.6, .7)], 'abu', o, z=.6, wdt=7)
sE = clip('sE', B[4], B[5],
    '<div id="e-h" class="headline hd o0" style="font-size:80px">Andong di <span class="kb">Malioboro</span></div>'
    + f'<svg id="e-iso" class="iso o0" width="1080" height="1300" viewBox="0 0 1080 1300">{tali}{box("e-cart", 0, 0, 2.4, 1.4, 1.2, "amber", o)}{wheels}</svg>'
    + '<img id="e-r" class="o0" src="assets/img/clay-robot.png" style="position:absolute;left:90px;top:470px;width:330px"/>'
    + '<div id="e-k" class="chip o0 kobalt" style="left:70px;top:860px;font-size:46px">Kuda = model AI</div>'
    + '<div id="e-1" class="chip o0 mint" style="left:70px;top:990px;font-size:42px">Kuat ✓</div>'
    + '<div id="e-2" class="chip o0 koral" style="left:70px;top:1110px;font-size:42px">Nganter penumpang sendirian ✗</div>')
inn('e-h', B[4] + .1); inn('e-iso', T(60), 40); pop('e-r', T(63)); pop('e-k', T(65))
pop('e-1', T(67)); pop('e-2', T(69))
J(f'tl.to("#e-r",{{rotate:-4,duration:.15,yoyo:true,repeat:3}},{T(71):.2f});')
out('sE', B[5] - .2, .2)

# ===== F: tiga perlengkapan kuda -> harness =====
def lrow(id_, top, img, ttl, sub):
    return (f'<div id="{id_}" class="chip o0" style="left:50px;top:{top}px;width:450px;white-space:normal;display:flex;align-items:center;gap:14px;font-size:40px">'
            f'<img src="assets/img/clay-{img}.png" style="width:92px"/><div>{ttl}<small>{sub}</small></div></div>')
def rrow(id_, top, ttl, sub=''):
    s = f'<small style="color:#DCE2FF">{sub}</small>' if sub else ''
    return (f'<div id="{id_}" class="chip o0 kobalt" style="left:590px;top:{top + 14}px;width:440px;white-space:normal;font-size:38px">{ttl}{s}</div>'
            f'<div id="{id_}a" class="o0" style="position:absolute;left:506px;top:{top + 30}px;font-size:64px;font-weight:600;color:var(--kobalt-500)">&rarr;</div>')
Y = (420, 640, 860)
sF = clip('sF', B[5], B[6],
    '<div id="f-h1" class="headline hd o0" style="font-size:80px">Kuda butuh tiga hal</div>'
    + '<div id="f-h2" class="headline hd o0" style="font-size:80px">Itu <span class="kb">harness</span></div>'
    + lrow('f-l1', Y[0], 'magnifying-glass', 'Kacamata', 'biar fokus')
    + lrow('f-l2', Y[1], 'package', 'Kereta', 'bawa barang')
    + lrow('f-l3', Y[2], 'hourglass', 'Tali kekang', 'biar bisa direm')
    + rrow('f-r1', Y[0], 'Apa yang dilihat AI')
    + rrow('f-r2', Y[1], 'Alat yang dipakai', 'browsing, baca file')
    + rrow('f-r3', Y[2], 'Jalan sendiri atau nunggu izin')
    + '<div id="f-k" class="chip o0 amber" style="left:300px;top:1110px;font-size:52px">Kusirnya: Anda</div>')
inn('f-h1', B[5] + .1)
pop('f-l1', T(76)); pop('f-l2', T(80)); pop('f-l3', T(84))
out('f-h1', T(89) - .15, .15); inn('f-h2', T(89) - .05, 20)
for k, i in ((1, 92), (2, 97), (3, 108)):
    inn(f'f-r{k}a', T(i), 0, .25); pop(f'f-r{k}', T(i) + .1)
J(f'tl.to(["#f-r1","#f-r2","#f-r3"],{{x:10,duration:.2,yoyo:true,repeat:1,stagger:.08}},{T(98):.2f});')
pop('f-k', T(119))
out('sF', B[6] - .2, .2)

# ===== G: ChatGPT dan contoh chatbot toko =====
def srow(id_, top, img, ttl, tag, st, tone):
    return (f'<div id="{id_}" class="chip o0" style="left:50px;right:50px;top:{top}px;white-space:normal;display:flex;align-items:center;gap:18px;font-size:44px">'
            f'<img src="assets/img/clay-{img}.png" style="width:86px"/><div style="flex:1">{ttl}<small class="mono">{tag}</small></div>'
            f'<span class="chip {tone}" style="position:static;font-size:30px;padding:10px 20px">{st}</span></div>')
sG = clip('sG', B[6], B[7],
    '<div id="g-h" class="headline hd o0" style="font-size:80px">ChatGPT juga begitu</div>'
    + '<div id="g-m" class="chip o0 kobalt" style="left:50px;top:440px;font-size:40px">Model = kuda</div>'
    + '<div id="g-a" class="chip o0 amber" style="left:430px;top:440px;font-size:40px">Aplikasi = andong</div>'
    + '<div id="g-s" class="mono o0" style="position:absolute;left:56px;top:600px;font-size:30px;color:var(--ink-600)">CONTOH: CHATBOT TOKO</div>'
    + srow('g-1', 660, 'magnifying-glass', 'Lihat katalog', 'kacamata', 'yang dilihat', 'langit')
    + srow('g-2', 830, 'package', 'Cek ongkir', 'kereta', 'jalan sendiri', 'mint')
    + srow('g-3', 1000, 'money-bag', 'Kasih diskon', 'tali kekang', 'harus izin', 'amber'))
inn('g-h', B[6] + .1); pop('g-m', T(127)); pop('g-a', T(129))
inn('g-s', T(131), 15); inn('g-1', T(133)); inn('g-2', T(137)); inn('g-3', T(141))
J(f'tl.to("#g-3",{{x:12,duration:.12,yoyo:true,repeat:3}},{T(143):.2f});')
out('sG', B[7] - .2, .2)

# ===== H: andong saya: 1 folder, 6 skill, 1 file aturan =====
oh = (520, 560); ot = (oh[0], oh[1] - .5 * U)
skills = ''.join(box(f'h-s{k}', .25 + (k % 3) * 1.0, .3 + (k // 3) * 1.0, .75, .75, .6, 'kobalt', ot) for k in (3, 4, 5, 0, 1, 2))
sH = clip('sH', B[7], B[8],
    '<div id="h-h" class="headline hd o0" style="font-size:80px">Andong <span class="kb">saya</span></div>'
    + f'<svg id="h-iso" class="iso" width="1080" height="1300" viewBox="0 0 1080 1300">'
      f'{box("h-f", 0, 0, 3.2, 2.4, .5, "abu", oh)}{skills}{box("h-a", 3.6, .5, .3, 1.4, 1.5, "amber", oh)}</svg>'
    + '<div id="h-c1" class="chip o0" style="left:50px;top:880px;font-size:40px">1 folder</div>'
    + '<div id="h-c2" class="chip o0 kobalt" style="left:270px;top:880px;font-size:40px">6 skill</div>'
    + '<div id="h-c3" class="chip o0 amber" style="left:470px;top:880px;font-size:40px">1 file aturan</div>'
    + '<div id="h-t" class="chip o0" style="left:50px;top:1000px;font-size:38px">Ada salah? <span style="color:var(--amber-800)">Aturannya saya tulis</span></div>'
    + '<div id="h-b" class="chip o0 mint" style="left:50px;top:1120px;font-size:40px;display:flex;align-items:center;gap:14px">'
      '<img src="assets/img/clay-chart-increasing.png" style="width:64px"/>Kuda sama, andong makin bagus</div>')
J('gsap.set(["#h-f","#h-a","#h-s0","#h-s1","#h-s2","#h-s3","#h-s4","#h-s5"],{opacity:0});')
inn('h-h', B[7] + .1)
J(f'tl.fromTo("#h-f",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.4,ease:"power3.out",immediateRender:false}},{T(150):.2f});')
pop('h-c1', T(150))
for k in range(6):
    J(f'tl.fromTo("#h-s{k}",{{opacity:0,y:-50}},{{opacity:1,y:0,duration:.35,ease:"bounce.out",immediateRender:false}},{T(152) + k * .07:.2f});')
pop('h-c2', T(153))
J(f'tl.fromTo("#h-a",{{opacity:0,y:-40}},{{opacity:1,y:0,duration:.4,ease:"back.out(1.8)",immediateRender:false}},{T(154):.2f});')
pop('h-c3', T(155))
inn('h-t', T(157), 20)
J(f'tl.to("#h-a",{{y:-14,duration:.18,yoyo:true,repeat:1}},{T(160):.2f});')
pop('h-b', T(165))
out('sH', B[8] - .2, .2)

# ===== I: penutup gelap =====
sI = clip('sI', B[8], DUR,
    '<div id="g-bg"></div><div id="g-q">Hasil AI jelek? Jangan langsung ganti kuda. <span class="kb">Cek dulu andongnya.</span></div>', cls='scene g')
tc = B[8] + .05
J(f'tl.to("#series",{{opacity:0,duration:.3}},{tc:.2f});tl.to("#seriesw",{{opacity:1,duration:.3}},{tc:.2f});')
J(f'tl.to("#sig",{{opacity:0,duration:.3}},{tc:.2f});tl.to("#sigw",{{opacity:.95,duration:.3}},{tc:.2f});')
J(f'tl.fromTo("#g-bg",{{opacity:0}},{{opacity:1,duration:.4}},{tc:.2f});')
J(f'tl.fromTo("#g-q",{{opacity:0,y:40}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{tc + .05:.2f});')

# ===== kepala (ekspresi per kalimat) =====
x = lambda i: T(i) - .05
EXP = [(0, 'bingung'), (x(4), 'yakin'), (x(9), 'senyum'), (x(15), 'netral'), (x(37), 'berpikir'), (x(45), 'terkejut'),
       (x(48), 'yakin'), (x(54), 'mengedip'), (x(59), 'senyum'), (x(67), 'yakin'), (x(68), 'ragu'), (x(74), 'netral'),
       (x(89), 'yakin'), (x(118), 'tertawa'), (x(121), 'netral'), (x(131), 'berpikir'), (x(140), 'yakin'),
       (x(145), 'senyum'), (x(157), 'ragu'), (x(160), 'yakin'), (x(165), 'lega'), (x(168), 'berpikir'),
       (x(173), 'yakin'), (x(177), 'mengedip')]
phead = persistent_head(EXP, DUR, J)

# ===== caption =====
EMPH = {'jelek', 'model', 'modelnya', 'harness', 'Harness', 'andong', 'andongnya', 'kuda', 'Kudanya', 'Kacamata', 'Kereta',
        'Tali', 'kekang', 'izin', 'skill', 'aturan', 'aturannya', 'sama', '63', '85', 'GPT55', 'ChatGPT', 'Anda'}
cap_html, cap_js, groups = captions(w.W, DUR, emph=EMPH,
    merge={21: (26, 'GPT-5.5,'), 37: (39, '63'), 45: (47, '85.'), 121: (124, 'ChatGPT')})

sfx = [('whoosh', .05, .45), ('pop', .55, .35), ('pop', 1.0, .35), ('pop', T(9), .4), ('glitch', T(13), .3),
       ('whoosh', B[1], .4), ('pop', T(37), .4), ('ding', T(45), .5),
       ('whoosh', B[2], .35), ('pop', T(49), .35), ('impact', T(53), .55),
       ('impact', T(54) - .1, .6), ('whoosh', B[4], .35), ('pop', T(63), .4), ('ding', T(67), .4), ('glitch', T(69), .3),
       ('whoosh', B[5], .35), ('pop', T(76), .4), ('pop', T(80), .4), ('pop', T(84), .4),
       ('pop', T(92), .35), ('pop', T(97), .35), ('pop', T(108), .35), ('ding', T(119), .5),
       ('whoosh', B[6], .35), ('pop', T(127), .35), ('pop', T(129), .35), ('pop', T(133), .35), ('pop', T(137), .35),
       ('glitch', T(141), .3), ('whoosh', B[7], .35), ('pop', T(150), .35), ('pop', T(153), .35), ('pop', T(155), .35),
       ('ding', T(165), .5), ('whoosh', B[8] + .05, .4)]

EXTRA = '''
.o0{opacity:0}
.hd{top:300px}
.kb{color:var(--kobalt-500)}
#series,#seriesw{width:170px;left:44px;top:56px}
.chip small{font-weight:400;font-size:28px}
.bnum{font-size:110px;font-weight:600;letter-spacing:-.05em;text-align:center;line-height:1;height:120px}
.bar{width:300px;border-radius:22px 22px 6px 6px;transform-origin:50% 100%}
.koralb{background:linear-gradient(180deg,#FF9A82,#FF6B47)}
.mintb{background:linear-gradient(180deg,#6FD9BC,#25B892)}
.blbl{text-align:center;font-size:44px;font-weight:600;margin-top:14px;line-height:1.1}
.blbl small{display:block;font-size:26px;color:var(--ink-500);font-weight:500;margin-top:4px}
.strike{position:absolute;left:16px;right:16px;top:50%;height:7px;margin-top:-3px;background:var(--koral-500);border-radius:4px;transform-origin:0 50%;transform:scaleX(0)}
#g-q{font-size:92px}
'''
html = page('Bukan Sulap: agent harness', DUR, [sA, sB, sC, sD, sE, sF, sG, sH, sI], JS, cap_html, cap_js,
            sfx_html(sfx), phead, VO, series='bukan-sulap', extra_css=EXTRA)
open('index.html', 'w').write(html)
print('index.html', len(html), 'bytes;', len(groups), 'caption groups')
