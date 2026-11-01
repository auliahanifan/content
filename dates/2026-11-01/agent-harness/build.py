#!/usr/bin/env python3
"""Video faceless 'Agent Harness (Bukan Sulap)' 9:16. Pakai: python3 build.py (dari folder proyek).
Waktu dari tts/words.json. SEMENTARA: words.json perkiraan (tools/est_words.py) + vo.mp3 senyap;
setelah VO asli: tts.sh -> words.py -> python3 build.py, adegan ikut bergeser."""
import os, sys, glob
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../.claude/skills/video-faceless/scripts'))
from lib import *

WD = Words('tts/words.json'); W, T, E = WD.W, WD.T, WD.E
VO = round(W[-1][2] + 0.3, 2)
DUR = round(VO + 0.6, 2)
JS = []; j = JS.append

def fin(sel, t, y=30, d=.45, ease='power3.out', sc=None):
    j(f'gsap.set("{sel}",{{opacity:0}});')
    a = f'opacity:0,y:{y}' + (f',scale:{sc}' if sc else '')
    b = f'opacity:1,y:0' + (',scale:1' if sc else '')
    j(f'tl.fromTo("{sel}",{{{a}}},{{{b},duration:{d},ease:"{ease}",immediateRender:false}},{t:.2f});')
def pop(sel, t, d=.32):
    j(f'gsap.set("{sel}",{{opacity:0}});'); j(f'tl.fromTo("{sel}",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:{d},ease:"back.out(1.7)",immediateRender:false}},{t:.2f});')
def fout(sel, t, d=.25): j(f'tl.to("{sel}",{{opacity:0,duration:{d}}},{t:.2f});')
def draw(sel, t, d=.6): j(f'tl.fromTo("{sel}",{{strokeDashoffset:1200}},{{strokeDashoffset:0,duration:{d},ease:"power2.out",immediateRender:false}},{t:.2f});')

# batas adegan (indeks kata pertama tiap beat)
B = [0, 9, 15, 31, 48, 55, 59, 121, 131, 145, 157, 168]
ST = [0] + [T(i) - .12 for i in B[1:]] + [DUR]
def span(k): return ST[k], ST[k + 1]
SFX = []

# ---------- andong (dipakai ulang; id diberi awalan) ----------
K = ISO['kobalt']; INK = '#0B0D12'
def andong(p, cart=True):
    horse = (f'<g transform="translate(60,330)"><g id="{p}-horse">'
        f'<path d="M445,190 Q505,230 482,335 Q468,292 440,242 Z" fill="{K[2]}"/>'
        + ''.join(f'<rect x="{x}" y="{y0}" width="28" height="{420-y0}" rx="10" fill="{K[1]}"/><rect x="{x-2}" y="405" width="32" height="22" rx="6" fill="{INK}"/>'
                  for x, y0 in ((175, 250), (215, 255), (335, 255), (380, 250)))
        + f'<ellipse cx="290" cy="210" rx="160" ry="80" fill="{K[1]}"/>'
        f'<polygon points="170,205 245,150 192,40 118,58" fill="{K[1]}"/>'
        f'<path d="M120,50 L175,35 Q192,40 186,64 L96,152 Q70,167 50,150 L44,136 Q47,118 62,110 Z" fill="{K[1]}"/>'
        f'<polygon points="150,42 162,2 180,42" fill="{K[2]}"/>'
        f'<path d="M172,34 Q218,80 248,152 L230,160 Q202,96 158,46 Z" fill="{K[2]}"/>'
        f'<circle cx="110" cy="92" r="9" fill="#fff"/><circle cx="108" cy="93" r="4.5" fill="{INK}"/>'
        f'<g id="{p}-blink" opacity="0"><rect x="92" y="74" width="44" height="38" rx="9" fill="#2BB3FF" stroke="#fff" stroke-width="3"/>'
        f'<line x1="134" y1="88" x2="176" y2="60" stroke="#0E93DB" stroke-width="7" stroke-linecap="round"/></g>'
        f'</g></g>')
    if not cart: return horse
    M = ISO['mint']
    return (f'<line x1="0" y1="776" x2="1080" y2="776" stroke="#CDD2DB" stroke-width="4"/>'
        f'<line id="{p}-road" x1="0" y1="806" x2="1080" y2="806" stroke="#A3AAB7" stroke-width="5" stroke-dasharray="40 34"/>'
        f'<g id="{p}-cart" opacity="0">'
        f'<line x1="600" y1="548" x2="400" y2="532" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
        f'<line x1="600" y1="590" x2="420" y2="568" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
        f'<line x1="618" y1="470" x2="618" y2="330" stroke="{M[2]}" stroke-width="10"/><line x1="984" y1="470" x2="984" y2="330" stroke="{M[2]}" stroke-width="10"/>'
        f'<rect x="590" y="300" width="422" height="38" rx="19" fill="{M[2]}"/>'
        f'<g id="{p}-kusir" opacity="0"><rect x="630" y="425" width="66" height="70" rx="22" fill="{INK}"/><circle cx="663" cy="398" r="31" fill="{INK}"/>'
        f'<g id="{p}-face" opacity="0"><circle cx="652" cy="396" r="5" fill="#fff"/><circle cx="674" cy="396" r="5" fill="#fff"/>'
        f'<path d="M651,410 Q663,420 675,410" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>'
        f'<rect x="600" y="470" width="400" height="170" rx="20" fill="{M[1]}" stroke="#fff" stroke-width="3"/>'
        f'<g id="{p}-tools" opacity="0">'
        f'<circle cx="720" cy="555" r="40" fill="none" stroke="#fff" stroke-width="7"/><ellipse cx="720" cy="555" rx="17" ry="40" fill="none" stroke="#fff" stroke-width="6"/>'
        f'<line x1="680" y1="555" x2="760" y2="555" stroke="#fff" stroke-width="6"/>'
        f'<path d="M850,515 H895 L918,538 V595 H850 Z" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>'
        f'<line x1="864" y1="556" x2="904" y2="556" stroke="#fff" stroke-width="6"/><line x1="864" y1="576" x2="904" y2="576" stroke="#fff" stroke-width="6"/></g>'
        f'<g id="{p}-chat" opacity="0"><rect x="616" y="484" width="368" height="142" rx="14" fill="#fff"/>'
        f'<rect x="636" y="502" width="190" height="34" rx="17" fill="#ECEEF2"/><rect x="772" y="546" width="190" height="34" rx="17" fill="#3A5BFF"/>'
        f'<rect x="636" y="590" width="150" height="24" rx="12" fill="#ECEEF2"/></g>'
        f'<circle cx="800" cy="690" r="84" fill="#fff" stroke="#2E333D" stroke-width="14"/>'
        + ''.join(f'<line x1="800" y1="690" x2="{800+76*math.cos(a/6*math.pi):.0f}" y2="{690+76*math.sin(a/6*math.pi):.0f}" stroke="#2E333D" stroke-width="6"/>' for a in range(0, 12, 2))
        + f'<circle cx="800" cy="690" r="14" fill="#2E333D"/></g>'
        f'<path id="{p}-rein" d="M115,470 Q380,420 640,455" fill="none" stroke="#FFB224" stroke-width="7" stroke-linecap="round" stroke-dasharray="1200" stroke-dashoffset="1200"/>'
        + andong(p, cart=False))

# ======================================================================
# 0  HOOK  robot dicap SALAH?, cap pindah ke bingkai
# ======================================================================
a, b = span(0)
s0 = clip('s0', a, b,
    head('h0a', 'Hasil AI jelek?') + head('h0b', 'Belum tentu <span style="color:var(--kobalt-500)">modelnya.</span>')
    + '<div id="r0-frame"></div><img id="r0-robot" src="assets/img/clay-robot.png"/>'
    + '<div id="r0-stamp" class="stamp">SALAH?</div>'
    + chip('r0-lbl1', 'model', 'kobalt', 'left:150px;top:1120px') + chip('r0-lbl2', 'bungkusnya', 'amber', 'left:720px;top:1120px'))
fin('#h0a', .1)
fin('#r0-robot', .15, y=60, sc=.9)
j(f'tl.fromTo("#r0-stamp",{{opacity:0,scale:2.4,rotate:-30}},{{opacity:1,scale:1,rotate:-12,duration:.3,ease:"power4.in",immediateRender:false}},{T(3):.2f});')
SFX += [('impact', T(3) + .25, .7)]
fout('#h0a', T(4) - .1); fin('#h0b', T(4))
pop('#r0-lbl1', T(6))
j(f'tl.fromTo("#r0-frame",{{opacity:0,scale:1.15}},{{opacity:1,scale:1,duration:.4,ease:"power3.out",immediateRender:false}},{T(7):.2f});')
j(f'tl.to("#r0-stamp",{{x:200,y:-130,rotate:8,duration:.5,ease:"power3.inOut"}},{T(7)+.1:.2f});')
pop('#r0-lbl2', T(8)); SFX += [('whoosh', T(7), .5)]

# ======================================================================
# 1  jangan buru-buru upgrade
# ======================================================================
a, b = span(1)
s1 = clip('s1', a, b,
    head('h1', 'Jangan buru-buru.')
    + '<div id="t1" class="ptag"><div class="mono pl">model lebih mahal</div><div class="pu"><span id="t1-up">UPGRADE ↑</span><span class="strike" id="t1-strike"></span></div></div>'
    + '<img id="t1-bag" src="assets/img/clay-money-bag.png"/>')
fin('#h1', a + .05)
j(f'tl.fromTo("#t1",{{opacity:0,y:200,rotate:-4}},{{opacity:1,y:0,rotate:-4,duration:.6,ease:"power3.out",immediateRender:false}},{a+.1:.2f});')
fin('#t1-bag', T(11), y=40, sc=.8)
j(f'tl.to("#t1",{{y:-60,duration:1.2,ease:"power1.inOut"}},{T(11):.2f});')
j(f'tl.to("#t1-strike",{{width:"100%",duration:.3,ease:"power2.inOut"}},{T(14):.2f});')
j(f'tl.to("#t1-up",{{color:"#7A808C",duration:.3}},{T(14):.2f});')
SFX += [('whoosh', a, .5), ('pop', T(11), .5), ('glitch', T(14), .6)]

# ======================================================================
# 2  satu model, dua aplikasi
# ======================================================================
a, b = span(2)
s2 = clip('s2', a, b,
    head('h2', '1 model · 2 aplikasi', sub='') + '<div id="src2" class="srcl mono">Endor Labs · Agent Security League</div>'
    + '<svg id="w2" class="iso" viewBox="0 0 1080 1920" width="1080" height="1920">'
      '<path id="w2-c1" d="M540,850 C540,940 250,900 250,1010" fill="none" stroke="#3A5BFF" stroke-width="10" stroke-linecap="round" stroke-dasharray="1200" stroke-dashoffset="1200"/>'
      '<path id="w2-c2" d="M540,850 C540,940 830,900 830,1010" fill="none" stroke="#3A5BFF" stroke-width="10" stroke-linecap="round" stroke-dasharray="1200" stroke-dashoffset="1200"/>'
      + sphere('w2-brain', 0, 0, 1.1, 'kobalt', (540, 670)) + '</svg>'
    + chip('w2-gpt', 'GPT-5.5', 'kobalt', 'left:455px;top:800px;font-size:38px')
    + '<img id="w2-l1" class="lap" src="assets/img/clay-laptop.png" style="left:110px"/><img id="w2-l2" class="lap" src="assets/img/clay-laptop.png" style="left:690px"/>'
    + chip('w2-n1', 'Codex', 'abu', 'left:180px;top:1195px') + chip('w2-n2', 'Cursor', 'abu', 'left:755px;top:1195px'))
fin('#h2', a + .05); fin('#src2', T(16))
j(f'tl.fromTo("#w2-brain",{{opacity:0,scale:.4,transformOrigin:"540px 570px"}},{{opacity:1,scale:1,duration:.45,ease:"back.out(1.6)",immediateRender:false}},{T(18):.2f});')
pop('#w2-gpt', T(21))
draw('#w2-c1', T(28)); draw('#w2-c2', T(28) + .1)
fin('#w2-l1', T(28) + .3, sc=.8); fin('#w2-l2', T(28) + .4, sc=.8)
pop('#w2-n1', T(29)); pop('#w2-n2', T(29) + .1)
SFX += [('whoosh', a, .5), ('pop', T(18), .5), ('pop', T(28) + .3, .4)]

# ======================================================================
# 3  63% vs 85%
# ======================================================================
a, b = span(3)
H = 520
s3 = clip('s3', a, b,
    head('h3', 'Model sama. Hasil beda.')
    + '<div id="b3" class="bars">'
      f'<div class="bc"><div class="bv mono" id="b3-v1">63%</div><div class="bar" id="b3-b1" style="height:{H*.626:.0f}px;background:var(--abu-300)"></div><div class="bl">Codex</div></div>'
      f'<div class="bc"><div class="bv mono k" id="b3-v2">85%</div><div class="bar" id="b3-b2" style="height:{H*.849:.0f}px;background:var(--kobalt-500)"></div><div class="bl">Cursor</div></div>'
    '</div>'
    + '<div id="b3-note" class="srcl mono" style="top:1200px">lolos tes fungsional · 200 tugas · data 25 Apr 2026</div>')
fin('#h3', a + .05)
j(f'tl.fromTo("#b3-b1",{{scaleY:0}},{{scaleY:1,duration:.7,ease:"power3.out",immediateRender:false}},{T(34):.2f});')
fin('#b3-v1', T(37), y=20)
j(f'tl.fromTo("#b3-b2",{{scaleY:0}},{{scaleY:1,duration:.8,ease:"power3.out",immediateRender:false}},{T(42):.2f});')
pop('#b3-v2', T(45))
fin('#b3-note', T(38), y=10)
j('gsap.set(["#b3-b1","#b3-b2"],{scaleY:0,transformOrigin:"50% 100%"});')
SFX += [('whoosh', a, .5), ('pop', T(37), .5), ('ding', T(45), .5)]

# ======================================================================
# 4  otaknya sama, beda bungkusnya: HARNESS
# ======================================================================
a, b = span(4)
s4 = clip('s4', a, b,
    chip('o4', 'otak sama', 'mint', 'left:390px;top:520px;font-size:44px')
    + '<div id="hn4" class="hword">harness</div>'
    + '<div id="hn4-sub" class="srcl" style="top:1060px;font-size:36px;font-family:Geist">bungkus di sekeliling model</div>')
pop('#o4', T(48))
j(f'tl.fromTo("#hn4",{{opacity:0,scale:.3}},{{opacity:1,scale:1,duration:.55,ease:"expo.out",immediateRender:false}},{T(53):.2f});')
fin('#hn4-sub', T(53) + .3, y=10)
SFX += [('whoosh', a, .5), ('impact', T(53), .8)]

# ======================================================================
# 5  Bukan sulap (logo seri terbang) -> topi kosong, obeng muncul
# ======================================================================
a, b = span(5)
HAT = ('<svg id="hat5" viewBox="0 0 400 440" width="400" height="440">'
       '<path d="M80,40 Q80,20 100,20 H300 Q320,20 320,40 L340,380 H60 Z" fill="#0B0D12"/>'
       '<rect x="66" y="260" width="268" height="54" fill="#3A5BFF"/><rect x="10" y="370" width="380" height="58" rx="29" fill="#0B0D12"/></svg>')
DRV = ('<svg id="drv5" viewBox="0 0 120 420" width="120" height="420">'
       '<rect x="30" y="0" width="60" height="150" rx="22" fill="#FFB224" stroke="#E09200" stroke-width="5"/>'
       '<rect x="52" y="150" width="16" height="230" fill="#A3AAB7"/><path d="M48,380 H72 L66,415 H54 Z" fill="#636B7A"/></svg>')
s5 = clip('s5', a, b, '<div id="m5">' + DRV + HAT + '</div>' + chip('m5-l', 'cara kerja, bukan trik', 'amber', 'left:330px;top:1160px'))
j(f'tl.fromTo("#m5",{{opacity:0,y:80}},{{opacity:1,y:0,duration:.5,ease:"power3.out",immediateRender:false}},{a+.05:.2f});')
j(f'tl.to(["#series","#seriesw"],{{x:300,y:330,scale:2.6,duration:.55,ease:"power3.inOut"}},{T(54):.2f});')
j(f'tl.to(["#series","#seriesw"],{{x:0,y:0,scale:1,duration:.5,ease:"power3.inOut"}},{T(57):.2f});')
j(f'tl.fromTo("#drv5",{{y:300}},{{y:0,duration:.5,ease:"back.out(1.8)",immediateRender:false}},{T(56):.2f});')
j(f'tl.set("#drv5",{{y:300}},0);')
pop('#m5-l', T(57))
SFX += [('whoosh', T(54), .6), ('pop', T(56), .6)]

# ======================================================================
# 6-11  dunia andong (satu adegan; bagian muncul bertahap)
# ======================================================================
a, b = span(6)
hw_heads = [('h6a', 'Kuda = model.', 63), ('h6b', 'Butuh 3 bagian.', 74), ('h6c', 'Kacamata = yang dilihat.', 92),
            ('h6d', 'Kereta = alat.', 97), ('h6e', 'Tali = izin.', 108), ('h6f', 'Kusir = Anda.', 118)]
s6 = clip('s6', a, b,
    ''.join(head(i, t) for i, t, _ in hw_heads)
    + chip('hw-mal', 'Malioboro', 'abu', 'left:60px;top:450px;font-size:28px')
    + f'<svg id="hw" class="world" viewBox="0 0 1080 900" width="1080" height="900">{andong("hw")}</svg>'
    + chip('hw-l1', 'konteks', 'langit', 'left:110px;top:600px')
    + chip('hw-l2', 'browsing · baca file', 'mint', 'left:600px;top:560px')
    + chip('hw-l3', 'jalan sendiri', 'mint', 'left:110px;top:560px')
    + chip('hw-l4', 'nunggu izin', 'amber', 'left:400px;top:560px')
    + chip('hw-l5', 'Anda', 'abu', 'left:600px;top:560px'))
for k, (i, t, w) in enumerate(hw_heads):
    fin('#' + i, T(w) - .05 if k else T(59))
    if k + 1 < len(hw_heads): fout('#' + i, T(hw_heads[k + 1][2]) - .15)
j('gsap.set("#hw-horse",{x:230});')
fin('#hw', T(59), y=60); pop('#hw-mal', T(60))
fout('#hw-mal', T(74) - .1)
# 3 bagian terpasang satu per satu
j(f'tl.fromTo("#hw-blink",{{opacity:0,scale:2,transformOrigin:"114px 93px"}},{{opacity:1,scale:1,duration:.35,ease:"back.out(2)",immediateRender:false}},{T(76):.2f});')
j(f'tl.to("#hw-horse",{{x:0,duration:.6,ease:"power3.inOut"}},{T(80)-.2:.2f});')
j(f'tl.fromTo("#hw-cart",{{opacity:0,x:200}},{{opacity:1,x:0,duration:.6,ease:"power3.out",immediateRender:false}},{T(80):.2f});')
j(f'tl.to("#hw-rein",{{strokeDashoffset:0,duration:.6,ease:"power2.out"}},{T(84):.2f});')
j(f'tl.fromTo("#hw-kusir",{{opacity:0}},{{opacity:1,duration:.01,immediateRender:false}},{T(84)-.05:.2f});')
SFX += [('whoosh', T(59), .5), ('pop', T(76), .5), ('whoosh', T(80), .5), ('pop', T(84), .5)]
# kacamata = konteks
j(f'tl.to("#hw-blink",{{scale:1.3,duration:.25,yoyo:true,repeat:1,transformOrigin:"114px 93px"}},{T(92):.2f});')
pop('#hw-l1', T(95)); fout('#hw-l1', T(97) - .15)
# kereta = alat
j(f'tl.fromTo("#hw-tools",{{opacity:0,scale:.6,transformOrigin:"800px 555px"}},{{opacity:1,scale:1,duration:.4,ease:"back.out(1.7)",immediateRender:false}},{T(102):.2f});')
pop('#hw-l2', T(104)); fout('#hw-l2', T(108) - .15)
SFX += [('pop', T(102), .5)]
# tali = izin: jalan (garis jalan bergerak) lalu ditarik, berhenti
j(f'tl.to("#hw-road",{{strokeDashoffset:-370,duration:{max(.5, T(114) - T(108)):.2f},ease:"none"}},{T(108):.2f});')
pop('#hw-l3', T(110))
j(f'tl.to("#hw-rein",{{attr:{{d:"M115,470 Q380,452 640,455"}},stroke:"#E09200",duration:.25}},{T(116):.2f});')
j(f'tl.to("#hw-horse",{{rotate:-5,transformOrigin:"290px 420px",duration:.3,yoyo:true,repeat:1}},{T(116):.2f});')
pop('#hw-l4', T(116)); fout('#hw-l3', T(118) - .15); fout('#hw-l4', T(118) - .15)
SFX += [('glitch', T(116), .5)]
# kusir menoleh
j(f'tl.to("#hw-face",{{opacity:1,duration:.2}},{T(119):.2f});')
pop('#hw-l5', T(120))
SFX += [('ding', T(120), .45)]

# ======================================================================
# 12  ChatGPT = andong
# ======================================================================
a, b = span(7)
s7 = clip('s7', a, b,
    head('h7', 'ChatGPT = andong.')
    + f'<svg id="cw" class="world" viewBox="0 0 1080 900" width="1080" height="900">{andong("cw")}</svg>'
    + chip('cw-l1', 'kuda = model', 'kobalt', 'left:110px;top:600px') + chip('cw-l2', 'andong = aplikasi', 'mint', 'left:600px;top:560px'))
fin('#h7', a + .05)
j('gsap.set("#cw-cart",{opacity:1});gsap.set("#cw-blink",{opacity:1});gsap.set("#cw-rein",{strokeDashoffset:0});gsap.set("#cw-kusir",{opacity:1});')
j(f'tl.fromTo("#cw-chat",{{opacity:0,scale:.7,transformOrigin:"800px 555px"}},{{opacity:1,scale:1,duration:.4,ease:"back.out(1.7)",immediateRender:false}},{T(121)+.2:.2f});')
pop('#cw-l1', T(127)); pop('#cw-l2', T(129))
SFX += [('whoosh', a, .5), ('pop', T(121) + .2, .5)]

# ======================================================================
# 13  contoh toko: katalog, ongkir, diskon perlu izin
# ======================================================================
a, b = span(8)
def bub(i, txt, me=False, extra=''):
    return f'<div id="{i}" class="bub{" me" if me else ""}">{txt}{extra}</div>'
s8 = clip('s8', a, b,
    head('h8', 'Contoh: toko.')
    + '<div id="ch8" class="chat">'
      '<div class="chead"><span class="av"></span><b>Toko Kaos</b><span class="mono" style="font-size:28px;color:var(--ink-500)">chatbot</span></div>'
      + bub('q1', 'Kaos hitam L ada?', True) + bub('a1', 'Ada, Kak. Stok 12.', extra='<span class="tg langit">lihat katalog</span>')
      + bub('q2', 'Ongkir ke Jogja?', True) + bub('a2', 'Rp15.000, 2 hari.', extra='<span class="tg mint">cek ongkir</span>')
      + bub('q3', 'Diskon 20% bisa?', True)
      + '<div id="ap8" class="appr"><span>Diskon 20% · <b>Setujui?</b></span><span class="btn">Setujui</span></div>'
    '</div>')
fin('#h8', a + .05); fin('#ch8', a + .1, y=60)
for i, t in (('q1', T(134)), ('a1', T(135) + .1), ('q2', T(137)), ('a2', T(138) + .1), ('q3', T(140))):
    fin('#' + i, t, y=16, d=.3)
pop('#ap8', T(143))
SFX += [('whoosh', a, .5), ('pop', T(135), .4), ('pop', T(138), .4), ('glitch', T(143), .5)]

# ======================================================================
# 14  sistem saya: 1 folder, 6 skill, 1 file aturan
# ======================================================================
a, b = span(9)
SK = ['naskah', 'ide-konten', 'challenge', 'aulia-brand', 'edit-video-viral', 'video-faceless']
s9 = clip('s9', a, b,
    head('h9', 'Sistem saya.')
    + '<div id="fd9" class="folder"><div class="ftab"></div><div class="fname mono">content/</div></div>'
    + ''.join(f'<div class="sk mono" id="sk{k}" style="left:{70 + (k % 2) * 480}px;top:{620 + (k // 2) * 140}px">{n}</div>' for k, n in enumerate(SK))
    + '<div id="md9" class="mdc mono">CLAUDE.md <span>aturan</span></div>')
fin('#h9', a + .05); fin('#fd9', T(149), sc=.9)
j(f'tl.to("#fd9",{{opacity:.25,duration:.3}},{T(152)-.1:.2f});')
for k in range(6): pop(f'#sk{k}', T(152) + k * .09, .28)
fin('#md9', T(154), y=20)
SFX += [('whoosh', a, .5), ('pop', T(152), .5), ('pop', T(155), .5)]

# ======================================================================
# 15  tiap salah, aturan ditulis -> andong makin bagus
# ======================================================================
a, b = span(10)
LINES = ['Timestamp kata Whisper tidak akurat.', 'Titik potong dari amplitudo, bukan timestamp.', 'Caption ikuti yang diucapkan.']
NEW = 'Kata meragukan didengar manusia.'
s10 = clip('s10', a, b,
    head('h10', 'Tiap salah, jadi aturan.')
    + '<div id="f10" class="file"><div class="pbar"><span class="dot"></span><span class="mono">CLAUDE.md</span></div><div class="fbody mono">'
      + ''.join(f'<div class="ln">- {t}</div>' for t in LINES)
      + f'<div class="ln new" id="f10-new"><span id="f10-txt">+ {NEW}</span></div></div></div>'
    + chip('f10-c', 'aturan +1', 'amber', 'left:740px;top:430px')
    + f'<svg id="mw" class="world" viewBox="0 0 1080 900" width="1080" height="900" style="top:820px;left:440px;transform:scale(.5);transform-origin:0 0">{andong("mw")}</svg>'
    + '<div id="spark" class="spark">✦ ✦ ✦</div>'
    + chip('f10-k', 'kuda sama', 'kobalt', 'left:60px;top:960px') + chip('f10-a', 'andong makin bagus', 'mint', 'left:60px;top:1060px'))
fin('#h10', a + .05); fin('#f10', a + .15, y=40)
j(f'tl.fromTo("#f10-new",{{opacity:0,x:-20}},{{opacity:1,x:0,duration:.3,immediateRender:false}},{T(160):.2f});')
j(f'tl.fromTo("#f10-txt",{{clipPath:"inset(0 100% 0 0)"}},{{clipPath:"inset(0 0% 0 0)",duration:.9,ease:"none",immediateRender:false}},{T(160):.2f});')
pop('#f10-c', T(161))
j('gsap.set("#mw-cart",{opacity:1});gsap.set("#mw-rein",{strokeDashoffset:0});gsap.set("#mw-kusir",{opacity:1});gsap.set("#mw-tools",{opacity:1});')
fin('#mw', T(163) - .1, y=30)
pop('#f10-k', T(163))
j(f'tl.to("#mw-blink",{{opacity:1,duration:.3}},{T(165):.2f});')
pop('#spark', T(165)); pop('#f10-a', T(165))
SFX += [('whoosh', a, .5), ('pop', T(161), .5), ('ding', T(166), .5)]

# ======================================================================
# 16  penutup gelap: jangan ganti kuda, cek andongnya (tali dikencangkan)
# ======================================================================
a, b = span(11)
s11 = clip('s11', a, b,
    '<div id="g-bg"></div><div id="g-q">Jangan langsung ganti kuda.<br/><span class="kb">Cek dulu andongnya.</span></div>'
    + f'<svg id="zw" class="world" viewBox="0 0 1080 900" width="1080" height="900" style="top:470px">{andong("zw")}</svg>')
j(f'tl.to("#g-bg",{{opacity:1,duration:.4}},{a:.2f});')
j(f'tl.to("#g-q",{{opacity:1,duration:.4}},{T(168):.2f});')
j(f'tl.fromTo("#g-q .kb",{{opacity:0}},{{opacity:1,duration:.3,immediateRender:false}},{T(177):.2f});')
j('gsap.set("#zw-cart",{opacity:1});gsap.set("#zw-blink",{opacity:1});gsap.set("#zw-kusir",{opacity:1});gsap.set("#zw-tools",{opacity:1});')
fin('#zw', T(170), y=40)
j(f'tl.to("#zw-rein",{{strokeDashoffset:0,duration:.5}},{T(176):.2f});')
j(f'tl.to("#zw-rein",{{attr:{{d:"M115,470 Q380,452 640,455"}},duration:.35,ease:"power2.out"}},{T(178):.2f});')
for s in ('series', 'sig'):
    j(f'tl.to("#{s}",{{opacity:0,duration:.3}},{a:.2f});tl.to("#{s}w",{{opacity:.95,duration:.3}},{a:.2f});')
SFX += [('whoosh', a, .5), ('ding', T(178) + .1, .5)]

# ---------- caption ----------
MERGE = {21: (26, 'GPT-5.5,'), 37: (40, '63%'), 45: (47, '85%.'), 121: (124, 'ChatGPT')}
FIX = {}
EMPH = {'modelnya', 'mahal', 'GPT55', '63%', '85%', 'harness', 'sulap', 'model', 'AI', 'Kacamata', 'Kereta', 'Tali',
        'izin', 'Anda', 'andong', 'andongnya', 'kuda', 'skill', 'aturan', 'ChatGPT'}
cap_html, cap_js, groups = captions(W, DUR, MERGE, FIX, EMPH)

# ---------- kepala Aulia (bila aset ada) ----------
EXP = [(0, 'ragu'), (T(4) - .05, 'yakin'), (T(15) - .05, 'netral'), (T(45) - .05, 'terkejut'), (T(48) - .05, 'yakin'),
       (T(54) - .05, 'senyum'), (T(59) - .05, 'netral'), (T(76) - .05, 'berpikir'), (T(118) - .05, 'tertawa'),
       (T(121) - .05, 'senyum'), (T(131) - .05, 'netral'), (T(143) - .05, 'ragu'), (T(145) - .05, 'senyum'),
       (T(157) - .05, 'yakin'), (T(168) - .05, 'yakin'), (T(177) - .05, 'mengedip')]
HAS_HEAD = all(os.path.exists(f'assets/img/kepala-{n}.png') for _, n in EXP)
phead = persistent_head(EXP, DUR, j) if HAS_HEAD else ''

CSS = '''
.stamp{position:absolute;left:380px;top:560px;padding:14px 34px;border:8px solid var(--koral-500);border-radius:18px;color:var(--koral-500);font-size:88px;font-weight:700;letter-spacing:.02em;background:rgba(255,255,255,.85);opacity:0}
#r0-robot{position:absolute;left:300px;top:520px;width:480px}
#r0-frame{position:absolute;left:180px;top:450px;width:720px;height:820px;border:8px dashed var(--amber-500);border-radius:40px;opacity:0}
#h0b{opacity:0}
.ptag{position:absolute;left:180px;top:620px;width:720px;padding:40px 50px;background:#fff;border:3px solid var(--abu-200);border-radius:30px;box-shadow:0 18px 50px rgba(11,13,18,.12)}
.ptag .pl{font-size:30px;color:var(--ink-500)}
.pu{position:relative;display:inline-block;font-size:120px;font-weight:700;letter-spacing:-.04em;color:#D2401E;margin-top:10px}
.strike{position:absolute;left:-10px;top:52%;height:14px;width:0;background:var(--koral-500);border-radius:7px}
#t1-bag{position:absolute;left:400px;top:900px;width:280px}
.srcl{position:absolute;left:0;width:1080px;text-align:center;top:380px;font-size:30px;color:var(--ink-500)}
.lap{position:absolute;top:995px;width:250px}
.bars{position:absolute;left:150px;top:500px;width:780px;height:700px;display:flex;justify-content:space-around;align-items:flex-end}
.bc{display:flex;flex-direction:column;align-items:center;width:260px}
.bar{width:220px;border-radius:24px 24px 8px 8px}
.bv{font-size:96px;font-weight:600;margin-bottom:16px;color:var(--ink-600)}
.bv.k{color:var(--kobalt-500)}
.bl{margin-top:18px;font-size:40px;font-weight:600}
.hword{position:absolute;left:0;width:1080px;top:700px;text-align:center;font-size:230px;line-height:1;font-weight:700;letter-spacing:-.06em;color:var(--kobalt-500)}
#m5{position:absolute;left:340px;top:600px;width:400px;height:548px;overflow:hidden}
#hat5{position:absolute;left:0;bottom:0}
#drv5{position:absolute;left:140px;top:40px}
.world{position:absolute;left:0;top:380px}
#s6 .headline:not(#h6a){opacity:0}
.chat{position:absolute;left:90px;top:400px;width:900px;padding:30px;background:#fff;border:1px solid var(--abu-200);border-radius:34px;box-shadow:0 18px 50px rgba(11,13,18,.12);display:flex;flex-direction:column;gap:16px}
.chead{display:flex;align-items:center;gap:16px;font-size:32px;padding-bottom:14px;border-bottom:1px solid var(--abu-200)}
.chead .av{width:50px;height:50px;border-radius:50%;background:var(--mint-500)}
.bub{align-self:flex-start;max-width:640px;padding:18px 26px;border-radius:26px;background:var(--abu-100);font-size:34px;line-height:1.25}
.bub.me{align-self:flex-end;background:var(--kobalt-500);color:#fff}
.tg{display:inline-block;margin-left:12px;font-family:"Geist Mono",monospace;font-size:28px;padding:5px 12px;border-radius:999px;vertical-align:middle}
.tg.langit{background:var(--langit-100);color:var(--langit-800)}.tg.mint{background:var(--mint-100);color:var(--mint-800)}
.appr{display:flex;justify-content:space-between;align-items:center;padding:20px 26px;border-radius:22px;background:var(--amber-50);border:3px solid var(--amber-500);font-size:32px;color:var(--amber-800)}
.appr .btn{background:var(--amber-500);color:var(--ink-900);font-weight:600;padding:12px 28px;border-radius:999px}
.folder{position:absolute;left:170px;top:520px;width:740px;height:600px;background:var(--amber-100);border:4px solid var(--amber-500);border-radius:30px}
.folder .ftab{position:absolute;left:30px;top:-46px;width:240px;height:60px;background:var(--amber-100);border:4px solid var(--amber-500);border-bottom:none;border-radius:20px 20px 0 0}
.folder .fname{position:absolute;left:40px;top:24px;font-size:36px;color:var(--amber-800)}
.sk{position:absolute;width:460px;padding:30px 30px;background:#fff;border:2px solid var(--kobalt-100);border-left:12px solid var(--kobalt-500);border-radius:20px;font-size:36px;box-shadow:0 10px 26px rgba(11,13,18,.08)}
.mdc{position:absolute;left:70px;top:1050px;width:940px;padding:30px;background:var(--ink-900);color:#fff;border-radius:22px;font-size:40px}
.mdc span{float:right;color:#8EA1FF;font-size:30px}
.file .pbar{font-size:28px}
.file{position:absolute;left:60px;top:400px;width:960px;background:#fff;border:1px solid var(--abu-200);border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(11,13,18,.12)}
.fbody{padding:26px 30px;display:flex;flex-direction:column;gap:14px;font-size:28px;color:var(--ink-600)}
.ln.new{color:var(--mint-800);background:var(--mint-50);border-radius:10px;padding:6px 10px;font-weight:600}
.spark{position:absolute;left:840px;top:850px;font-size:54px;color:var(--amber-500);letter-spacing:.3em;opacity:0}
#g-q{top:300px}
#zw-kusir rect,#zw-kusir circle:not(#zw-face circle){fill:#fff}
'''

scenes = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11]
html = page('Agent Harness: bukan sulap', DUR, scenes, JS, cap_html, cap_js, sfx_html(SFX), phead, VO,
            series='bukan-sulap', extra_css=CSS)
open('index.html', 'w').write(html)
print('index.html', len(html), 'bytes;', len(groups), 'caption groups; DUR', DUR, '; kepala', 'ya' if HAS_HEAD else 'TIDAK (aset belum ada)')
