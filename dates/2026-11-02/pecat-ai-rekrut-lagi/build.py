#!/usr/bin/env python3
"""Bangun index.html video "Katanya Nyatanya: pecat demi AI, lalu rekrut lagi" (TH-092). Jalankan: python3 build.py"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../.claude/skills/video-faceless/scripts'))
from lib import *

w = Words(); T, E = w.T, w.E
VO = 68.84
DUR = 70.0
JS = []
J = JS.append

def inn(id_, t, y=30, d=.45, ease='power3.out'):
    J(f'tl.fromTo("#{id_}",{{opacity:0,y:{y}}},{{opacity:1,y:0,duration:{d},ease:"{ease}",immediateRender:false}},{t:.2f});')
def pop(id_, t, d=.4):
    J(f'tl.fromTo("#{id_}",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:{d},ease:"back.out(1.8)",immediateRender:false}},{t:.2f});')
def out(id_, t, d=.25):
    J(f'tl.to("#{id_}",{{opacity:0,duration:{d}}},{t:.2f});')
def ring_in(id_, t):
    J(f'tl.fromTo("#{id_}",{{opacity:0,scale:1.25}},{{opacity:1,scale:1,duration:.35,ease:"back.out(1.6)",immediateRender:false}},{t:.2f});')
def strike(id_, t):
    J(f'tl.fromTo("#{id_}",{{scaleX:0}},{{scaleX:1,duration:.3,ease:"power2.out",immediateRender:false}},{t:.2f});')

# batas adegan (kata awal tiap beat)
B = [0, T(9) - .1, T(35) - .1, T(45) - .1, T(84) - .1, T(115) - .1, T(126) - .1, T(162) - .1, DUR]

# ===== A hook: kursi kosong "diganti AI", lalu papan LOWONGAN muncul lagi =====
o = (300, 930); U_ = U * 1.45
seat_o = (o[0], o[1] - 1.05 * U_); back_o = (o[0], o[1] - 1.35 * U_)
import lib as _L
_L.U = U_
chair = (cyl('a-base', .8, .8, .75, .12, 'abu', o) + cyl('a-post', .8, .8, .12, 1.05, 'abu', o)
         + box('a-back', 0, 0, .28, 1.6, 1.75, 'kobalt', back_o) + box('a-seat', 0, 0, 1.6, 1.6, .3, 'kobalt', seat_o))
_L.U = 92
sA = clip('sA', B[0], B[1],
    '<div id="a-h1" class="headline hd o0" style="font-size:78px">Pecat karyawan <span class="kb">demi AI</span></div>'
    + '<div id="a-h2" class="sub2 o0">lalu buka lowongan <span class="kr">yang sama</span></div>'
    + f'<svg id="a-iso" class="iso o0" width="1080" height="1300" viewBox="0 0 1080 1300">{chair}</svg>'
    + '<div id="a-st" class="stamp o0" style="left:90px;top:1010px"><img src="assets/img/clay-robot.png"/>diganti AI</div>'
    + '<div id="a-lw" class="board o0"><div class="pin"></div><div class="bt mono">LOWONGAN</div>'
      '<div class="bb">Dicari:<br/>posisi yang sama</div><div class="bs mono">segera</div></div>')
inn('a-h1', .1)
inn('a-iso', .15, 40)
J('tl.fromTo("#a-st",{opacity:0,scale:2.2,rotate:-14},{opacity:1,scale:1,rotate:-10,duration:.3,ease:"power4.in",immediateRender:false},%.2f);' % (T(2)))
J(f'tl.to("#a-iso",{{x:-8,duration:.06,yoyo:true,repeat:3}},{T(2) + .3:.2f});')
inn('a-h2', T(4) - .05, 20)
J('tl.fromTo("#a-lw",{opacity:0,scale:.4,rotate:8},{opacity:1,scale:1,rotate:4,duration:.5,ease:"back.out(1.8)",immediateRender:false},%.2f);' % T(6))
J(f'tl.to("#a-lw",{{rotate:-2,duration:.35,yoyo:true,repeat:3,ease:"sine.inOut"}},{T(6) + .5:.2f});')
out('sA', B[1] - .2, .2)

# ===== B: bukti Robert Half, 32% =====
rings = '<div id="b-r" class="ring o0" style="left:1%;top:8.5%;width:98%;height:25%"></div>'
sB = clip('sB', B[1], B[2],
    '<div id="b-h" class="headline hd o0" style="font-size:76px">Survei <span class="kb">Robert Half</span></div>'
    + '<div id="b-s" class="sub2 o0" style="top:395px;font-size:36px">manajer rekrutmen di Amerika</div>'
    + card('b-card', 'shot-rh.png', 'roberthalf.com/…/midyear-labor-market-outlook', 460, 'riset 2026', rings).replace('class="proof"', 'class="proof o0"')
    + '<div id="b-c1" class="chip o0" style="left:60px;top:1110px;font-size:40px;color:var(--ink-600)">Hapus posisi setelah pakai AI</div>'
    + '<div id="b-n" class="o0 bign" style="left:60px;top:1100px">32%</div>'
    + '<div id="b-c2" class="chip o0 koral" style="left:400px;top:1130px;font-size:44px">buka lagi posisi yang sama</div>')
inn('b-h', B[1] + .1); inn('b-s', T(12)); inn('b-card', T(13), 50)
pop('b-c1', T(18))
out('b-c1', T(23) - .1, .12)
ring_in('b-r', T(23)); pop('b-n', T(23), .45); pop('b-c2', T(27))
J(f'tl.to("#b-r",{{scale:1.04,duration:.25,yoyo:true,repeat:3}},{T(23) + .4:.2f});')
out('sB', B[2] - .2, .2)

# ===== C: kalimat khas seri, logo terbang ke tengah =====
sC = clip('sC', B[2], B[3],
    '<div id="c-1" class="chip o0" style="left:160px;top:900px;font-size:58px;color:var(--ink-500)">'
      '<img src="assets/img/clay-money-bag.png" style="width:84px;vertical-align:middle;margin-right:16px"/>Pasti hemat'
      '<div id="c-1l" class="strike"></div></div>'
    + '<div id="c-2" class="chip o0 kobalt" style="left:330px;top:1060px;font-size:64px">Nggak pasti</div>')
J(f'tl.to(["#series","#seriesw"],{{x:250,y:460,scale:3.1,duration:.5,ease:"back.out(1.25)"}},{T(35) - .1:.2f});')
pop('c-1', T(40))
strike('c-1l', T(42))
pop('c-2', T(43))
J(f'tl.to(["#series","#seriesw"],{{x:0,y:0,scale:1,duration:.55,ease:"power3.inOut"}},{E(44) + .05:.2f});')
out('sC', B[3] - .2, .2)

# ===== D: tiga alasan (bar) =====
HC = {'kobalt': 'var(--kobalt-600)', 'amber': 'var(--amber-800)', 'koral': 'var(--koral-500)'}
def hbar(id_, top, img, pct, ttl, tone):
    return (f'<div id="{id_}" class="hrow o0" style="top:{top}px"><img src="assets/img/clay-{img}.png"/>'
            f'<div class="hb"><div class="ht">{ttl}</div><div class="htrack"><div id="{id_}-f" class="hfill {tone}b" style="width:{pct * 2}%"></div></div></div>'
            f'<div class="hn" style="color:{HC[tone]}">{pct}%</div></div>')
sD = clip('sD', B[3], B[4],
    '<div id="d-h" class="headline hd o0" style="font-size:76px">Kenapa <span class="kb">rekrut lagi</span>?</div>'
    + hbar('d-1', 470, 'light-bulb', 40, 'Pengetahuan internal', 'kobalt')
    + hbar('d-2', 690, 'package', 39, 'Ngurus hubungan sama orang', 'amber')
    + hbar('d-3', 910, 'magnifying-glass', 38, 'AI butuh diawasi lebih banyak', 'koral')
    + '<div id="d-1t" class="chip o0 kobalt" style="left:640px;top:396px;font-size:30px;padding:10px 20px">alasan no. 1</div>'
    + '<div id="d-src" class="mono o0" style="position:absolute;left:60px;top:1150px;font-size:26px;color:var(--ink-500)">Robert Half, 2026 · posisi yang dibuka lagi</div>')
inn('d-h', B[3] + .1)
for k, i in ((1, 48), (2, 62), (3, 72)):
    inn(f'd-{k}', T(i) - .05, 30, .35)
    J(f'tl.fromTo("#d-{k}-f",{{scaleX:0}},{{scaleX:1,duration:.6,ease:"power3.out",immediateRender:false}},{T(i):.2f});')
pop('d-1t', T(55))
J(f'tl.to("#d-1",{{x:10,duration:.15,yoyo:true,repeat:1}},{T(55):.2f});')
inn('d-src', T(62), 10)
J(f'tl.to("#d-3",{{x:-8,duration:.08,yoyo:true,repeat:3}},{T(79):.2f});')
out('sD', B[4] - .2, .2)

# ===== E: juru masak senior, resep vs "garam secukupnya" =====
sE = clip('sE', B[4], B[5],
    '<div id="e-h" class="headline hd o0" style="font-size:76px">Kenapa bisa <span class="kb">gitu</span>?</div>'
    + '<div id="e-h2" class="headline hd o0" style="font-size:76px">Juru masak <span class="kb">senior</span> keluar</div>'
    + '<div id="e-rc" class="recipe o0"><div class="rt mono">RESEP</div><div class="rl"></div><div class="rl" style="width:80%"></div>'
      '<div class="rl"></div><div class="rl" style="width:60%"></div><div id="e-rx" class="rx o0">✗</div></div>'
    + '<div id="e-ar" class="o0" style="position:absolute;left:400px;top:560px;font-size:80px;font-weight:600;color:var(--kobalt-500)">&rarr;</div>'
    + '<img id="e-ai" class="o0" src="assets/img/clay-robot.png" style="position:absolute;left:520px;top:470px;width:220px"/>'
    + '<div id="e-ok" class="chip o0 mint" style="left:540px;top:700px;font-size:36px">disalin ✓</div>'
    + '<div id="e-bub" class="bubble o0"><div class="bl mono">di kepala dia</div>'
      '<div id="e-k1" class="chip o0 amber" style="position:relative;display:inline-block;font-size:44px">"garam secukupnya"</div><br/>'
      '<div id="e-k2" class="chip o0" style="position:relative;display:inline-block;font-size:40px;margin-top:16px">selera pelanggan langganan</div><br/>'
      '<div id="e-k3" class="chip o0" style="position:relative;display:inline-block;font-size:40px;margin-top:16px">cara nenangin yang komplain</div></div>')
inn('e-h', B[4] + .1)
out('e-h', T(87) - .15, .15); inn('e-h2', T(87) - .05, 20)
pop('e-rc', T(93)); inn('e-ar', T(95), 0, .25); pop('e-ai', T(96)); pop('e-ok', T(97))
J(f'tl.to(["#e-rc","#e-ar","#e-ai","#e-ok"],{{y:-60,duration:.4,ease:"power2.inOut"}},{T(98):.2f});')
J('tl.fromTo("#e-bub",{opacity:0,y:30},{opacity:1,y:-60,duration:.45,ease:"power3.out",immediateRender:false},%.2f);' % T(98))
pop('e-k1', T(99)); pop('e-k2', T(101)); pop('e-k3', T(104))
J(f'tl.to("#e-bub",{{scale:1.03,duration:.2,yoyo:true,repeat:1}},{T(108):.2f});')
pop('e-rx', T(112))
out('sE', B[5] - .2, .2)

# ===== F: tertulis vs tidak pernah ditulis =====
sF = clip('sF', B[5], B[6],
    '<div id="f-h" class="headline hd o0" style="font-size:76px">Di mana AI <span class="kb">kuat</span>?</div>'
    + '<div id="f-l" class="col mintc o0" style="left:60px"><div class="ci">✓</div><div class="ct">Yang tertulis</div><small>resep, SOP, data</small><div class="cv">kuat</div></div>'
    + '<div id="f-r" class="col koralc o0" style="left:560px"><div class="ci">✗</div><div class="ct">Yang nggak pernah ditulis</div><small>rasa, kebiasaan, hubungan</small><div class="cv">lemah</div></div>')
inn('f-h', B[5] + .1); pop('f-l', T(116)); pop('f-r', T(120))
J(f'tl.to("#f-r",{{x:-8,duration:.08,yoyo:true,repeat:3}},{T(124):.2f});')
out('sF', B[6] - .2, .2)

# ===== G: 68% tidak membuka lagi + dua langkah =====
sG = clip('sG', B[6], B[7],
    '<div id="g-h1" class="headline hd o0" style="font-size:76px">AI nggak pasti <span class="kb">rugi</span></div>'
    + '<div id="g-h2" class="headline hd o0" style="font-size:76px">Sebelum <span class="kb">mengganti orang</span></div>'
    + '<div id="g-bar" class="o0" style="position:absolute;left:60px;right:60px;top:470px">'
      '<div class="split"><div id="g-a" class="sa" style="width:32%">32%</div><div id="g-b" class="sb" style="width:68%">68%</div></div>'
      '<div class="sl"><span>buka lagi</span><span style="color:var(--mint-800)">nggak buka lagi</span></div></div>'
    + '<div id="g-s1" class="step o0" style="top:470px"><div class="sn">1</div><div>Tulis tugasnya <span class="kb">di luar SOP</span>'
      '<small>pelanggan rewel, kebiasaan, "secukupnya"</small></div></div>'
    + '<div id="g-s2" class="step o0" style="top:690px"><div class="sn">2</div><div style="display:flex;align-items:center;gap:16px">'
      '<div>Coba AI <span class="kb">berdampingan</span> dulu<small>bukan langsung mengganti</small></div>'
      '<img src="assets/img/clay-robot.png" style="width:110px"/></div></div>')
inn('g-h1', B[6] + .1)
J('tl.fromTo("#g-bar",{opacity:0},{opacity:1,duration:.3,immediateRender:false},%.2f);' % (T(127)))
J(f'tl.fromTo("#g-a",{{scaleX:0}},{{scaleX:1,duration:.5,ease:"power3.out",immediateRender:false}},{T(127):.2f});')
J(f'tl.fromTo("#g-b",{{scaleX:0}},{{scaleX:1,duration:.7,ease:"power3.out",immediateRender:false}},{T(132):.2f});')
J(f'tl.to("#g-b",{{y:-10,duration:.2,yoyo:true,repeat:1}},{T(136):.2f});')
out('g-h1', T(141) - .15, .15); inn('g-h2', T(141) - .05, 20)
out('g-bar', T(141) - .15, .2)
inn('g-s1', T(144)); inn('g-s2', T(156))
out('sG', B[7] - .2, .2)

# ===== H: penutup gelap =====
sH = clip('sH', B[7], DUR,
    '<div id="g-bg"></div><div id="g-q">Kalau karyawan kunci Anda besok resign... '
    '<span class="kb">"garam secukupnya"</span> di bisnis Anda tersimpan di mana?</div>', cls='scene g')
tc = B[7] + .05
J(f'tl.to("#series",{{opacity:0,duration:.3}},{tc:.2f});tl.to("#seriesw",{{opacity:1,duration:.3}},{tc:.2f});')
J(f'tl.to("#sig",{{opacity:0,duration:.3}},{tc:.2f});tl.to("#sigw",{{opacity:.95,duration:.3}},{tc:.2f});')
J(f'tl.fromTo("#g-bg",{{opacity:0}},{{opacity:1,duration:.4}},{tc:.2f});')
J(f'tl.fromTo("#g-q",{{opacity:0,y:40}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{tc + .05:.2f});')

# ===== kepala (ekspresi per kalimat) =====
x = lambda i: T(i) - .05
EXP = [(0, 'kesal'), (x(4), 'terkejut'), (x(9), 'netral'), (x(23), 'kagum'), (x(35), 'mengedip'), (x(42), 'yakin'),
       (x(45), 'berpikir'), (x(48), 'yakin'), (x(77), 'khawatir'), (x(84), 'bingung'), (x(87), 'netral'),
       (x(98), 'senyum'), (x(108), 'tertawa'), (x(112), 'yakin'), (x(120), 'ragu'), (x(126), 'senyum'),
       (x(132), 'lega'), (x(141), 'yakin'), (x(162), 'khawatir'), (x(168), 'berpikir')]
phead = persistent_head(EXP, DUR, J)

# ===== caption =====
EMPH = {'AI', 'lowongan', '32%', '40%', '39%', '38%', '68%', 'hemat', 'Katanya', 'ternyata', 'pengetahuan', 'internal',
        'hubungan', 'diawasi', 'resep', 'Resepnya', 'tertulis', 'ditulis', 'garam', 'secukupnya', 'SOP', 'berdampingan',
        'kunci', 'Robert', 'Half', 'kepala'}
cap_html, cap_js, groups = captions(w.W, DUR, emph=EMPH,
    merge={23: (26, '32%'), 48: (50, '40%'), 62: (65, '39%'), 72: (75, '38%'), 132: (135, '68%'), 153: (155, 'SOP,')})

sfx = [('whoosh', .05, .4), ('impact', T(2) + .25, .55), ('whoosh', T(4) - .05, .3), ('pop', T(6), .45),
       ('whoosh', B[1], .4), ('pop', T(18), .35), ('impact', T(23), .55), ('pop', T(27), .35),
       ('whoosh', T(35) - .1, .45), ('pop', T(40), .35), ('glitch', T(42), .3), ('ding', T(43), .45),
       ('whoosh', B[3], .35), ('pop', T(48), .4), ('pop', T(62), .35), ('pop', T(72), .35), ('glitch', T(79), .3),
       ('whoosh', B[4], .35), ('pop', T(93), .35), ('ding', T(97), .4), ('pop', T(99), .4), ('pop', T(101), .35),
       ('pop', T(104), .35), ('glitch', T(112), .3),
       ('whoosh', B[5], .35), ('ding', T(116), .4), ('glitch', T(120), .3),
       ('whoosh', B[6], .35), ('pop', T(127), .35), ('ding', T(132), .45), ('whoosh', T(141) - .1, .3),
       ('pop', T(144), .35), ('pop', T(156), .35), ('whoosh', B[7] + .05, .4)]

EXTRA = '''
.o0{opacity:0}
.hd{top:300px}
.kb{color:var(--kobalt-500)}
.kr{color:var(--koral-500)}
#series,#seriesw{width:200px;left:48px;top:70px}
.sub2{position:absolute;left:60px;right:130px;top:410px;font-size:56px;font-weight:600;letter-spacing:-.03em;color:var(--ink-600)}
.stamp{position:absolute;display:flex;align-items:center;gap:14px;padding:14px 30px 14px 18px;border:7px solid var(--koral-500);border-radius:18px;
 color:var(--koral-500);font-size:64px;font-weight:700;letter-spacing:-.02em;background:rgba(255,238,233,.92);transform:rotate(-10deg)}
.stamp img{width:86px}
.board{position:absolute;left:610px;top:640px;width:410px;padding:34px 30px 30px;background:var(--amber-100);border:3px solid var(--amber-500);border-radius:24px;
 box-shadow:0 18px 40px rgba(11,13,18,.16);text-align:center;transform-origin:50% 0}
.board .pin{position:absolute;left:50%;top:-16px;width:32px;height:32px;margin-left:-16px;border-radius:50%;background:var(--koral-500);box-shadow:0 4px 8px rgba(11,13,18,.25)}
.board .bt{font-size:56px;font-weight:700;color:var(--amber-800);letter-spacing:.04em}
.board .bb{font-size:44px;font-weight:600;line-height:1.15;margin-top:14px}
.board .bs{display:inline-block;margin-top:18px;font-size:26px;padding:6px 16px;border-radius:999px;background:var(--koral-500);color:#fff}
.bign{position:absolute;font-size:150px;font-weight:600;letter-spacing:-.06em;line-height:1;color:var(--koral-500)}
.strike{position:absolute;left:16px;right:16px;top:50%;height:8px;margin-top:-4px;background:var(--koral-500);border-radius:4px;transform-origin:0 50%;transform:scaleX(0)}
.hrow{position:absolute;left:50px;right:50px;height:190px;display:flex;align-items:center;gap:22px;background:#fff;border:1px solid var(--abu-200);border-radius:26px;padding:0 30px;box-shadow:0 8px 24px rgba(11,13,18,.08)}
.hrow img{width:100px}
.hb{flex:1}
.ht{font-size:38px;font-weight:600;margin-bottom:16px}
.htrack{height:30px;background:var(--abu-100);border-radius:15px;overflow:hidden}
.hfill{height:100%;border-radius:15px;transform-origin:0 50%}
.kobaltb{background:linear-gradient(90deg,#6680FF,#3A5BFF)}
.amberb{background:linear-gradient(90deg,#FFCB66,#FFB224)}
.koralb{background:linear-gradient(90deg,#FF9A82,#FF6B47)}
.hn{font-size:76px;font-weight:600;letter-spacing:-.04em;width:170px;text-align:right}
.recipe{position:absolute;left:90px;top:460px;width:290px;height:300px;background:#fff;border:1px solid var(--abu-200);border-radius:20px;padding:28px;box-shadow:0 10px 30px rgba(11,13,18,.1)}
.recipe .rt{font-size:30px;color:var(--ink-600);margin-bottom:22px}
.recipe .rl{height:16px;border-radius:8px;background:var(--abu-200);margin-bottom:22px}
.rx{position:absolute;right:-26px;top:-30px;width:90px;height:90px;border-radius:50%;background:var(--koral-500);color:#fff;font-size:56px;font-weight:700;text-align:center;line-height:90px}
.bubble{position:absolute;left:60px;right:60px;top:880px;padding:30px;border:4px dashed var(--amber-500);border-radius:36px;background:rgba(255,245,224,.7);text-align:center}
.bubble .bl{position:absolute;left:30px;top:-24px;padding:4px 16px;background:var(--amber-500);color:#fff;border-radius:999px;font-size:26px}
.col{position:absolute;top:470px;width:460px;height:640px;border-radius:30px;padding:40px 34px;text-align:center;border:3px solid}
.col .ci{width:120px;height:120px;margin:0 auto 26px;border-radius:50%;font-size:72px;font-weight:700;line-height:120px;color:#fff}
.col .ct{font-size:54px;font-weight:600;line-height:1.1;letter-spacing:-.03em}
.col small{display:block;font-size:30px;color:var(--ink-600);margin-top:16px}
.col .cv{position:absolute;left:0;right:0;bottom:44px;font-size:72px;font-weight:700;letter-spacing:-.04em}
.mintc{background:var(--mint-50);border-color:var(--mint-500)} .mintc .ci{background:var(--mint-500)} .mintc .cv{color:var(--mint-600)}
.koralc{background:var(--koral-50);border-color:var(--koral-500)} .koralc .ci{background:var(--koral-500)} .koralc .cv{color:var(--koral-500)}
.split{display:flex;height:170px;border-radius:28px;overflow:hidden;box-shadow:0 10px 30px rgba(11,13,18,.1)}
.sa,.sb{display:flex;align-items:center;justify-content:center;font-size:72px;font-weight:600;color:#fff;letter-spacing:-.04em;transform-origin:0 50%}
.sa{background:var(--koral-500)} .sb{background:var(--mint-500)}
.sl{display:flex;justify-content:space-between;margin-top:18px;font-size:36px;font-weight:600;color:var(--koral-800)}
.step{position:absolute;left:50px;right:50px;display:flex;align-items:center;gap:26px;padding:30px 34px;background:#fff;border:1px solid var(--abu-200);border-radius:28px;
 font-size:48px;font-weight:600;line-height:1.15;letter-spacing:-.02em;box-shadow:0 8px 24px rgba(11,13,18,.08)}
.step small{display:block;font-size:30px;font-weight:400;color:var(--ink-600);margin-top:8px}
.step .sn{flex:none;width:90px;height:90px;border-radius:50%;background:var(--kobalt-500);color:#fff;text-align:center;line-height:90px;font-size:50px}
#g-q{font-size:88px}
'''
html = page('Katanya Nyatanya: pecat demi AI, lalu rekrut lagi', DUR, [sA, sB, sC, sD, sE, sF, sG, sH], JS, cap_html, cap_js,
            sfx_html(sfx), phead, VO, series='katanya-nyatanya', extra_css=EXTRA)
open('index.html', 'w').write(html)
print('index.html', len(html), 'bytes;', len(groups), 'caption groups')
