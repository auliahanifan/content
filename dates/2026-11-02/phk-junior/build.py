#!/usr/bin/env python3
"""Bangun index.html video "Katanya Nyatanya: PHK AI turun, junior makin jarang direkrut" (TH-088).
Jalankan dari folder proyek: python3 build.py"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../.claude/skills/video-faceless/scripts'))
from lib import *

w = Words(); T, E = w.T, w.E
VO = 64.91
DUR = 66.0
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
def strike(id_, t):
    J(f'tl.fromTo("#{id_}",{{scaleX:0}},{{scaleX:1,duration:.3,ease:"power2.out",immediateRender:false}},{t:.2f});')
def o0card(*a, **k):
    return card(*a, **k).replace('class="proof"', 'class="proof o0"', 1)

def person(id_, o, h, r, c, op=1):
    """Figur iso: badan silinder + kepala bola. o = titik pijak."""
    body = cyl(id_ + '-b', 0, 0, r, h, c, o)
    cx, top = P(0, 0, h, o)
    hr = r * U * .95
    hy = top - r * U * .55 - hr
    t, l, _ = ISO[c]
    hd = (f'<circle cx="{cx:.1f}" cy="{hy:.1f}" r="{hr:.1f}" fill="{l}" stroke="rgba(255,255,255,.9)" stroke-width="2"/>'
          f'<circle cx="{cx - hr*.3:.1f}" cy="{hy - hr*.3:.1f}" r="{hr*.42:.1f}" fill="{t}" opacity=".7"/>')
    return f'<g id="{id_}" opacity="{op}">{body}{hd}</g>'

# batas adegan
B = [0, T(13) - .1, T(21) - .1, T(51) - .1, T(59) - .1, T(65) - .1, T(88) - .1, T(93) - .1,
     T(108) - .1, T(121) - .1, T(137) - .1, T(146) - .1, T(162) - .1, DUR]

# ===== A hook: junior hari ini = senior nanti; junior dicoret, kursi senior kosong =====
oj, os_ = (300, 1000), (790, 1000)
os_up = (os_[0], os_[1] - .6 * U)
arrow = ('<line x1="430" y1="690" x2="640" y2="690" stroke="var(--ink-600)" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 18"/>'
         '<polygon points="640,670 676,690 640,710" fill="var(--ink-600)"/>')
sA = clip('sA', B[0], B[1],
    '<div id="a-h" class="headline hd o0" style="font-size:84px">Junior hari ini =<br/><span class="kb">senior nanti</span></div>'
    + '<svg class="iso" width="1080" height="1300" viewBox="0 0 1080 1300">'
      f'<g id="a-j" opacity="0">{person("a-jp", oj, 1.0, .42, "kobalt")}</g>'
      f'<g id="a-chair" opacity="0">{box("a-ch", -.55, -.55, 1.1, 1.1, .6, "abu", os_)}</g>'
      f'<g id="a-s" opacity="0">{person("a-sp", os_up, 1.5, .55, "mint")}</g>'
      f'<g id="a-ar" opacity="0">{arrow}</g></svg>'
    + '<div id="a-x1" class="xline" style="left:180px;top:780px;width:240px;transform:rotate(45deg) scaleX(0)"></div>'
    + '<div id="a-x2" class="xline" style="left:180px;top:780px;width:240px;transform:rotate(-45deg) scaleX(0)"></div>'
    + chip('a-5', '5 tahun', 'amber', 'left:455px;top:590px;font-size:36px').replace('class="chip', 'class="chip o0', 1)
    + chip('a-jl', 'Junior', 'kobalt', 'left:225px;top:1060px;font-size:40px').replace('class="chip', 'class="chip o0', 1)
    + chip('a-sl', 'Senior', 'mint', 'left:715px;top:1060px;font-size:40px').replace('class="chip', 'class="chip o0', 1)
    + chip('a-kos', 'Kursi kosong', 'koral', 'left:660px;top:1160px;font-size:40px').replace('class="chip', 'class="chip o0', 1)
    + chip('a-dd', 'Terjadi diam-diam', 'amber', 'left:60px;top:1160px;font-size:40px').replace('class="chip', 'class="chip o0', 1))
inn('a-h', .05)
pop('a-j', .1); pop('a-jl', .15); pop('a-chair', .3); pop('a-s', .35); pop('a-sl', .4)
J(f'tl.fromTo("#a-x1",{{scaleX:0,rotate:45}},{{scaleX:1,rotate:45,duration:.25,ease:"power2.out",immediateRender:false}},{T(2):.2f});')
J(f'tl.fromTo("#a-x2",{{scaleX:0,rotate:-45}},{{scaleX:1,rotate:-45,duration:.25,ease:"power2.out",immediateRender:false}},{T(2) + .15:.2f});')
J(f'tl.to("#a-j",{{opacity:.35,duration:.3}},{T(2) + .2:.2f});')
inn('a-ar', T(3), 0, .3); pop('a-5', T(3))
J(f'tl.to("#a-s",{{opacity:.08,y:-20,duration:.5,ease:"power2.in"}},{T(6):.2f});')
pop('a-kos', T(8))
pop('a-dd', T(12))
out('sA', B[1] - .2, .2)

# ===== B: Katanya (logo seri terbang ke tengah) =====
sB = clip('sB', B[1], B[2],
    '<div id="b-q" class="claim o0">PHK karena AI <span style="color:var(--koral-500)">makin parah</span></div>')
J(f'tl.to(["#series","#seriesw"],{{x:150,y:330,scale:2.2,duration:.5,ease:"back.out(1.25)"}},{T(13) - .1:.2f});')
inn('b-q', T(14), 30)
J(f'tl.to(["#series","#seriesw"],{{x:0,y:0,scale:1,duration:.5,ease:"power3.inOut"}},{E(20) + .05:.2f});')
out('sB', B[2] - .2, .2)

# ===== C: Padahal: PHK yang menyebut AI turun hampir 90% (Mei 38.579 -> Sep 3.961) =====
BASE, HM = 1090, 520
hs = HM * 3961 / 38579
sC = clip('sC', B[2], B[3],
    '<div id="c-h" class="headline hd o0" style="font-size:72px">PHK yang <span class="kb">menyebut AI</span></div>'
    + '<div id="c-sub" class="mono o0" style="position:absolute;left:62px;top:392px;font-size:30px;color:var(--ink-500)">Amerika Serikat · 2026</div>'
    + f'<div id="c-b1" class="bar koralb o0" style="left:130px;top:{BASE - HM}px;height:{HM}px"></div>'
    + f'<div id="c-b2" class="bar mintb o0" style="left:560px;top:{BASE - HM}px;height:{HM}px"></div>'
    + f'<div id="c-n1" class="bnum o0" style="left:130px;top:{BASE - HM - 110}px">38.579</div>'
    + f'<div id="c-n2" class="bnum o0" style="left:560px;top:{BASE - hs - 110}px">3.961</div>'
    + f'<div id="c-l1" class="blbl o0" style="left:130px;top:{BASE + 14}px">Mei</div>'
    + f'<div id="c-l2" class="blbl o0" style="left:560px;top:{BASE + 14}px">September</div>'
    + '<div id="c-90" class="pct o0" style="left:540px;top:620px">&minus;90%</div>'
    + '<div id="c-src" class="mono o0" style="position:absolute;left:0;width:1080px;text-align:center;top:1180px;font-size:28px;color:var(--ink-500)">sumber: Challenger, Gray &amp; Christmas</div>')
inn('c-h', T(21)); inn('c-sub', T(23), 15)
J(f'tl.fromTo("#c-b1",{{opacity:0,scaleY:0}},{{opacity:1,scaleY:1,duration:.55,ease:"power3.out",immediateRender:false}},{T(24):.2f});')
inn('c-l1', T(26), 15)
J(f'tl.fromTo("#c-b2",{{opacity:0,scaleY:1}},{{opacity:.55,scaleY:1,duration:.2,immediateRender:false}},{T(33) - .1:.2f});')
J(f'tl.to("#c-b2",{{opacity:1,scaleY:{hs / HM:.3f},duration:.8,ease:"power3.in"}},{T(33) + .1:.2f});')
inn('c-l2', T(33), 15)
pop('c-90', T(35), .5)
J(f'tl.to("#c-90",{{x:-40,duration:.4,ease:"power2.out"}},{T(39) - .2:.2f});')
pop('c-n1', T(39)); pop('c-n2', T(45))
inn('c-src', T(49), 10)
out('sC', B[3] - .2, .2)

# ===== D: bukti: tahun ini AI masih alasan nomor satu =====
ringD = '<div id="d-r" class="ring o0" style="left:34%;top:52%;width:48%;height:36%"></div>'
sD = clip('sD', B[3], B[4],
    '<div id="d-h" class="headline hd o0" style="font-size:72px">Tapi tahun ini, AI <span class="kb">masih #1</span></div>'
    + o0card('d-c1', 'shot-challenger-mei.png', 'challengergray.com · laporan Mei', 430, 'rilis 4 Jun 2026')
    + o0card('d-c2', 'shot-challenger-sep.png', 'challengergray.com · laporan September', 820, 'rilis 1 Okt 2026', ringD)
    + chip('d-k', 'Alasan PHK nomor satu, Jan&ndash;Sep 2026', 'kobalt', 'left:60px;top:1110px;font-size:38px').replace('class="chip', 'class="chip o0', 1))
inn('d-h', B[3] + .1); inn('d-c1', B[3] + .2, 40); inn('d-c2', T(54) - .1, 40)
ring_in('d-r', T(56)); pop('d-k', T(57))
out('sD', B[4] - .2, .2)

# ===== E: riset Stanford nemu hal lain =====
sE = clip('sE', B[4], B[5],
    '<div id="e-h" class="headline hd o0" style="font-size:80px">Riset <span class="kb">Stanford</span>: hal lain</div>'
    + o0card('e-c', 'shot-stanford-judul.png', 'digitaleconomy.stanford.edu · Canaries', 470, 'Agustus 2026')
    + '<img id="e-m" class="o0" src="assets/img/clay-magnifying-glass.png" style="position:absolute;left:760px;top:860px;width:240px"/>')
inn('e-h', B[4] + .1); inn('e-c', T(61), 40); pop('e-m', T(62))
J(f'tl.to("#e-m",{{rotate:-10,x:-14,duration:.35,yoyo:true,repeat:1}},{T(63):.2f});')
out('sE', B[5] - .2, .2)

# ===== F: usia 22-25 di pekerjaan paling terpapar AI: -19% =====
ringF = '<div id="f-r" class="ring o0" style="left:1%;top:55%;width:98%;height:26%"></div>'
sF = clip('sF', B[5], B[6],
    '<div id="f-h" class="headline hd o0" style="font-size:80px">Usia <span class="kb">22&ndash;25</span></div>'
    + '<div id="f-s" class="mono o0" style="position:absolute;left:62px;top:392px;font-size:30px;color:var(--ink-500)">di pekerjaan paling terpapar AI</div>'
    + o0card('f-c', 'shot-stanford.png', 'Brynjolfsson, Chandar, Chen · Stanford', 470, 'abstrak', ringF)
    + '<div id="f-19" class="pct o0" style="left:60px;top:930px;color:var(--koral-500)">&minus;19%</div>'
    + chip('f-k', 'jumlah pekerjanya<small>di bawah yang seharusnya</small>', 'koral', 'left:520px;top:985px;font-size:40px').replace('class="chip', 'class="chip o0', 1))
inn('f-h', B[5] + .1); inn('f-s', T(74), 15); inn('f-c', T(75), 40)
ring_in('f-r', T(79)); pop('f-19', T(81), .5); pop('f-k', T(84))
out('sF', B[6] - .2, .2)

# ===== G: seniornya? nggak turun kayak gitu =====
og1, og2 = (320, 1010), (770, 1010)
sG = clip('sG', B[6], B[7],
    '<div id="g-h" class="headline hd o0" style="font-size:80px">Seniornya?</div>'
    + '<svg class="iso" width="1080" height="1300" viewBox="0 0 1080 1300">'
      f'<g id="g-j" opacity="0">{person("g-jp", og1, 1.0, .42, "kobalt")}</g>'
      f'<g id="g-s" opacity="0">{person("g-sp", og2, 1.5, .55, "mint")}</g></svg>'
    + chip('g-jl', 'Junior &minus;19%', 'koral', 'left:180px;top:1070px;font-size:40px').replace('class="chip', 'class="chip o0', 1)
    + chip('g-sl', 'Senior: tidak turun', 'mint', 'left:600px;top:1070px;font-size:40px').replace('class="chip', 'class="chip o0', 1))
inn('g-h', B[6] + .1); pop('g-j', B[6] + .15); pop('g-jl', B[6] + .2)
J(f'tl.to("#g-j",{{scale:.82,transformOrigin:"50% 100%",opacity:.55,duration:.4}},{B[6] + .3:.2f});')
pop('g-s', T(89)); pop('g-sl', T(90))
out('sG', B[7] - .2, .2)

# ===== H: kenapa? AI = lulusan baru yang hafal buku, belum ketemu pelanggan rewel =====
ob = (330, 900)
books = ''.join(box(f'h-bk{k}', -.6, -.8, 1.2, 1.6, .22, c, (ob[0], ob[1] - k * .24 * U)) for k, c in enumerate(['kobalt', 'amber', 'mint', 'langit']))
sH = clip('sH', B[7], B[8],
    '<div id="h-h" class="headline hd o0" style="font-size:80px">Kenapa?</div>'
    + '<div id="h-h2" class="headline hd o0" style="font-size:72px">AI = <span class="kb">lulusan baru</span></div>'
    + f'<svg id="h-iso" class="iso o0" width="1080" height="1300" viewBox="0 0 1080 1300">{books}</svg>'
    + '<img id="h-r" class="o0" src="assets/img/clay-robot.png" style="position:absolute;left:560px;top:470px;width:380px"/>'
    + chip('h-1', 'Hafal buku &check;', 'mint', 'left:70px;top:1000px;font-size:46px').replace('class="chip', 'class="chip o0', 1)
    + chip('h-2', 'Ketemu pelanggan rewel &cross;', 'koral', 'left:70px;top:1130px;font-size:46px').replace('class="chip', 'class="chip o0', 1))
inn('h-h', B[7] + .05)
out('h-h', T(94) - .15, .15); inn('h-h2', T(94) - .05, 20)
pop('h-r', T(96)); inn('h-iso', T(100), 40); pop('h-1', T(100))
pop('h-2', T(105))
J(f'tl.to("#h-r",{{rotate:-5,duration:.12,yoyo:true,repeat:3}},{T(106):.2f});')
out('sH', B[8] - .2, .2)

# ===== I: yang bisa digantikan = kerjaan hafal buku = modal utama anak baru =====
sI = clip('sI', B[8], B[9],
    '<div id="i-h" class="headline hd o0" style="font-size:72px">Yang bisa <span class="kb">digantikan AI</span></div>'
    + '<div id="i-a" class="chip o0" style="left:60px;top:560px;font-size:44px;display:flex;align-items:center;gap:16px">'
      '<img src="assets/img/clay-package.png" style="width:90px"/>Kerjaan hafal buku</div>'
    + '<div id="i-sw" class="o0" style="position:absolute;left:640px;top:570px;font-size:90px;font-weight:600;color:var(--kobalt-500)">&rarr;</div>'
    + '<img id="i-r" class="o0" src="assets/img/clay-robot.png" style="position:absolute;left:780px;top:500px;width:230px"/>'
    + '<div id="i-eq" class="o0" style="position:absolute;left:0;width:1080px;top:800px;text-align:center;font-size:110px;font-weight:600;color:var(--ink-400)">=</div>'
    + chip('i-m', 'Modal utama anak baru', 'amber', 'left:200px;top:960px;font-size:56px').replace('class="chip', 'class="chip o0', 1))
inn('i-h', B[8] + .1); pop('i-a', T(113)); inn('i-sw', T(111), 0, .3); pop('i-r', T(111))
J(f'tl.to("#i-sw",{{x:16,duration:.2,yoyo:true,repeat:3}},{T(113) + .3:.2f});')
pop('i-eq', T(116)); pop('i-m', T(117), .5)
out('sI', B[9] - .2, .2)

# ===== J: lewat rekrutmen, bukan PHK; tak tercatat di data PHK =====
oj2 = (300, 860)
door_in = box('j-d1', -.6, -.15, 1.2, .3, 2.2, 'mint', oj2)
door_out = box('j-d2', -.6, -.15, 1.2, .3, 2.2, 'abu', (780, 860))
sJ = clip('sJ', B[9], B[10],
    '<div id="j-h" class="headline hd o0" style="font-size:72px">Turunnya <span class="kb">lewat mana?</span></div>'
    + f'<svg id="j-iso" class="iso o0" width="1080" height="1300" viewBox="0 0 1080 1300">{door_in}{door_out}</svg>'
    + chip('j-1', 'Pintu masuk:<small>rekrutmen</small>', 'mint', 'left:110px;top:920px;font-size:42px').replace('class="chip', 'class="chip o0', 1)
    + '<div id="j-dn" class="o0" style="position:absolute;left:400px;top:560px;font-size:120px;font-weight:600;color:var(--koral-500)">&darr;</div>'
    + '<div id="j-2" class="chip o0" style="left:620px;top:920px;font-size:42px">Pintu keluar:<small style="position:relative;display:block;width:max-content;font-size:34px;font-weight:600;color:var(--ink-900)">PHK<span id="j-2x" class="strike" style="left:-6px;right:-6px"></span></small></div>'
    + '<div id="j-3" class="chip o0 amber" style="left:150px;top:1110px;font-size:42px;display:flex;align-items:center;gap:14px">'
      '<img src="assets/img/clay-magnifying-glass.png" style="width:70px"/>Data PHK: tidak tercatat</div>')
inn('j-h', B[9] + .1); inn('j-iso', B[9] + .2, 40)
pop('j-1', T(123)); inn('j-dn', T(124), -40, .4)
J(f'tl.to("#j-dn",{{y:30,duration:.3,yoyo:true,repeat:3}},{T(125):.2f});')
pop('j-2', T(126)); strike('j-2x', T(127))
pop('j-3', T(131))
out('sJ', B[10] - .2, .2)

# ===== K: penelitinya: baru pola, belum bukti sebab-akibat =====
ringK = '<div id="k-r" class="ring o0" style="left:1%;top:27%;width:89%;height:24%"></div>'
sK = clip('sK', B[10], B[11],
    '<div id="k-h" class="headline hd o0" style="font-size:72px">Kata <span class="kb">penelitinya</span> sendiri</div>'
    + o0card('k-c', 'shot-stanford-kausal.png', 'Canaries in the Coal Mine? · abstrak', 450, 'Agustus 2026', ringK)
    + chip('k-1', 'Baru pola', 'amber', 'left:60px;top:930px;font-size:50px').replace('class="chip', 'class="chip o0', 1)
    + '<div id="k-2" class="chip o0 koral" style="left:420px;top:930px;font-size:50px">Bukti sebab-akibat<div id="k-2x" class="strike"></div></div>')
inn('k-h', B[10] + .1); inn('k-c', T(138), 40)
pop('k-1', T(141)); ring_in('k-r', T(142)); pop('k-2', T(143)); strike('k-2x', T(144))
out('sK', B[11] - .2, .2)

# ===== L: rencanakan dari mana tim belajar =====
sL = clip('sL', B[11], B[12],
    '<div id="l-h" class="headline hd o0" style="font-size:72px">Tugas junior <span class="kb">ke AI</span>?</div>'
    + '<svg class="iso" width="1080" height="1300" viewBox="0 0 1080 1300">'
      f'<g id="l-j" opacity="0">{person("l-jp", (230, 830), 1.0, .42, "kobalt")}</g></svg>'
    + '<img id="l-p" class="o0" src="assets/img/clay-package.png" style="position:absolute;left:300px;top:520px;width:150px"/>'
    + '<img id="l-r" class="o0" src="assets/img/clay-robot.png" style="position:absolute;left:740px;top:470px;width:260px"/>'
    + '<div id="l-1" class="chip o0" style="left:60px;top:930px;width:960px;white-space:normal;display:flex;align-items:center;gap:18px;font-size:46px">'
      '<img src="assets/img/clay-light-bulb.png" style="width:96px"/><div>Rencanakan: tim belajar <span style="color:var(--kobalt-600)">dari mana?</span></div></div>'
    + chip('l-2', 'ngadepin pelanggan rewel', 'koral', 'left:60px;top:1110px;font-size:44px').replace('class="chip', 'class="chip o0', 1))
inn('l-h', B[11] + .1); pop('l-j', T(148)); pop('l-p', T(148) + .1)
J(f'tl.to("#l-p",{{x:340,y:-20,rotate:12,duration:.6,ease:"power2.inOut"}},{T(151):.2f});')
pop('l-r', T(152))
pop('l-1', T(154)); pop('l-2', T(159))
out('sL', B[12] - .2, .2)

# ===== M: penutup gelap =====
sM = clip('sM', B[12], DUR,
    '<div id="g-bg"></div><div id="g-q">Junior yang nggak Anda rekrut hari ini, '
    '<span class="kb">itu senior yang nggak Anda punya lima tahun lagi.</span></div>', cls='scene g')
tc = B[12] + .05
J(f'tl.to("#series",{{opacity:0,duration:.3}},{tc:.2f});tl.to("#seriesw",{{opacity:1,duration:.3}},{tc:.2f});')
J(f'tl.to("#sig",{{opacity:0,duration:.3}},{tc:.2f});tl.to("#sigw",{{opacity:.95,duration:.3}},{tc:.2f});')
J(f'tl.fromTo("#g-bg",{{opacity:0}},{{opacity:1,duration:.4}},{tc:.2f});')
J(f'tl.fromTo("#g-q",{{opacity:0,y:40}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{tc + .05:.2f});')

# ===== kepala (ekspresi per kalimat) =====
x = lambda i: T(i) - .05
EXP = [(0, 'khawatir'), (x(9), 'yakin'), (x(13), 'ragu'), (x(21), 'yakin'), (x(33), 'terkejut'), (x(38), 'netral'),
       (x(51), 'berpikir'), (x(59), 'kagum'), (x(65), 'netral'), (x(79), 'khawatir'), (x(88), 'ragu'), (x(89), 'yakin'),
       (x(93), 'berpikir'), (x(94), 'senyum'), (x(105), 'tertawa'), (x(116), 'yakin'), (x(121), 'netral'),
       (x(130), 'khawatir'), (x(137), 'netral'), (x(143), 'ragu'), (x(146), 'yakin'), (x(154), 'berpikir'),
       (x(162), 'khawatir'), (x(169), 'yakin')]
phead = persistent_head(EXP, DUR, J)

# ===== caption =====
EMPH = {'junior', 'Junior', 'senior', 'Seniornya', 'PHK', 'AI', '90%', '38ribu', '4ribu', 'Challenger', 'Stanford',
        '2225', '19%', 'rekrutmen', 'pola', 'hafal', 'rewel', 'Anda'}
cap_html, cap_js, groups = captions(w.W, DUR, emph=EMPH,
    merge={14: (16, 'PHK'), 27: (29, 'PHK'), 35: (37, '90%.'), 39: (42, '38 ribu,'), 45: (46, '4 ribu'),
           67: (73, '22&ndash;25,'), 81: (83, '19%'), 127: (129, 'PHK.'), 134: (136, 'PHK.')})

sfx = [('whoosh', .05, .45), ('pop', .15, .3), ('pop', .4, .3), ('glitch', T(2), .35), ('pop', T(3), .35),
       ('impact', T(6), .5), ('pop', T(12), .35),
       ('impact', T(13) - .1, .6), ('pop', T(14), .35),
       ('whoosh', B[2], .4), ('pop', T(24), .35), ('glitch', T(33) + .1, .3), ('impact', T(35), .55),
       ('pop', T(39), .35), ('pop', T(45), .35),
       ('whoosh', B[3], .4), ('pop', T(56), .4),
       ('whoosh', B[4], .35), ('pop', T(62), .35),
       ('whoosh', B[5], .35), ('impact', T(81), .55), ('pop', T(84), .35),
       ('whoosh', B[6], .35), ('ding', T(90), .45),
       ('whoosh', B[7], .35), ('pop', T(96), .35), ('ding', T(100), .45), ('glitch', T(105), .3),
       ('whoosh', B[8], .35), ('pop', T(113), .35), ('impact', T(117), .5),
       ('whoosh', B[9], .35), ('pop', T(123), .35), ('glitch', T(127), .3), ('pop', T(131), .35),
       ('whoosh', B[10], .35), ('pop', T(141), .35), ('glitch', T(144), .3),
       ('whoosh', B[11], .35), ('whoosh', T(151), .3), ('ding', T(154), .45), ('pop', T(159), .35),
       ('whoosh', B[12] + .05, .4)]

EXTRA = '''
.o0{opacity:0}
.hd{top:300px}
.kb{color:var(--kobalt-500)}
#series,#seriesw{width:270px;left:22px;top:-26px}
.chip small{font-weight:400;font-size:28px}
.bar{position:absolute;width:300px;border-radius:22px 22px 6px 6px;transform-origin:50% 100%}
.koralb{background:linear-gradient(180deg,#FF9A82,#FF6B47)}
.mintb{background:linear-gradient(180deg,#6FD9BC,#25B892)}
.bnum{position:absolute;width:300px;font-size:84px;font-weight:600;letter-spacing:-.05em;text-align:center;line-height:1;height:100px}
.blbl{position:absolute;width:300px;text-align:center;font-size:44px;font-weight:600;line-height:1.1}
.pct{position:absolute;font-size:200px;line-height:1;font-weight:600;letter-spacing:-.06em;color:var(--koral-500)}
.claim{position:absolute;left:80px;right:80px;top:960px;text-align:center;font-size:66px;line-height:1.15;font-weight:600;letter-spacing:-.03em;
 border:6px dashed var(--ink-900);border-radius:40px;padding:30px 36px;background:#fff}
.strike{position:absolute;left:16px;right:16px;top:50%;height:7px;margin-top:-3px;background:var(--koral-500);border-radius:4px;transform-origin:0 50%;transform:scaleX(0)}
.xline{position:absolute;height:12px;margin-top:-6px;background:var(--koral-500);border-radius:6px;transform-origin:50% 50%}
#g-q{font-size:88px}
'''
html = page('Katanya Nyatanya: junior hari ini, senior nanti', DUR,
            [sA, sB, sC, sD, sE, sF, sG, sH, sI, sJ, sK, sL, sM], JS, cap_html, cap_js,
            sfx_html(sfx), phead, VO, series='katanya-nyatanya', extra_css=EXTRA)
open('index.html', 'w').write(html)
print('index.html', len(html), 'bytes;', len(groups), 'caption groups')
