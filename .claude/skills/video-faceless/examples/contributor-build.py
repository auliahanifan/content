#!/usr/bin/env python3
"""Bangun index.html video Contributor (9:16, 1080x1920) dari tts/words.json.

Pakai: python3 build.py   (jalankan dari folder proyek)
Timestamp kata dari ElevenLabs (alignment karakter), bukan Whisper.
"""
import json, math, re

W = json.load(open('tts/words.json'))
DUR = 66.4
T = lambda i: round(W[i][1], 2)           # awal kata ke-i
E = lambda i: round(W[i][2], 2)           # akhir kata ke-i

# ---------- palet (tokens/colors.css design system) ----------
ISO = {  # [atas, kiri, kanan]
    'kobalt': ['#6680FF', '#3A5BFF', '#2B47DB'],
    'langit': ['#7CCBFF', '#2BB3FF', '#0E93DB'],
    'ungu':   ['#B79BFA', '#8B5CF6', '#7140E0'],
    'mint':   ['#6FD9BC', '#25B892', '#1C9576'],
    'amber':  ['#FFCB66', '#FFB224', '#E09200'],
    'koral':  ['#FF9A82', '#FF6B47', '#E04F2C'],
    'abu':    ['#FFFFFF', '#ECEEF2', '#CDD2DB'],
}
U = 92
def P(x, y, z=0, o=(540, 250)):
    return (o[0] + (x - y) * 0.866 * U, o[1] + (x + y) * 0.5 * U - z * U)
def pts(ps): return ' '.join(f'{a:.1f},{b:.1f}' for a, b in ps)

def box(i, x, y, w, d, h, c, o, op=1):
    t, l, r = ISO[c]
    top = [P(x, y, h, o), P(x + w, y, h, o), P(x + w, y + d, h, o), P(x, y + d, h, o)]
    left = [P(x, y + d, 0, o), P(x + w, y + d, 0, o), P(x + w, y + d, h, o), P(x, y + d, h, o)]
    right = [P(x + w, y, 0, o), P(x + w, y + d, 0, o), P(x + w, y + d, h, o), P(x + w, y, h, o)]
    s = 'stroke="rgba(255,255,255,.9)" stroke-width="2" stroke-linejoin="round"'
    return (f'<g id="{i}" opacity="{op}"><polygon points="{pts(left)}" fill="{l}" {s}/>'
            f'<polygon points="{pts(right)}" fill="{r}" {s}/><polygon points="{pts(top)}" fill="{t}" {s}/></g>')

def cyl(i, x, y, r, h, c, o):
    t, l, rr = ISO[c]
    cx, cy0 = P(x, y, 0, o); _, cy1 = P(x, y, h, o)
    rx, ry = r * U * 1.22, r * U * 0.71
    return (f'<g id="{i}"><path d="M{cx-rx:.1f},{cy1:.1f} L{cx-rx:.1f},{cy0:.1f} A{rx:.1f},{ry:.1f} 0 0 0 {cx+rx:.1f},{cy0:.1f} '
            f'L{cx+rx:.1f},{cy1:.1f} Z" fill="{l}" stroke="rgba(255,255,255,.9)" stroke-width="2"/>'
            f'<ellipse cx="{cx:.1f}" cy="{cy1:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{t}" stroke="rgba(255,255,255,.9)" stroke-width="2"/></g>')

def sphere(i, x, y, r, c, o):
    cx, cy = P(x, y, r, o)
    t, l, rr = ISO[c]
    return (f'<g id="{i}"><ellipse cx="{cx:.1f}" cy="{cy + r*U*0.95:.1f}" rx="{r*U*1.1:.1f}" ry="{r*U*0.4:.1f}" fill="rgba(11,13,18,.10)"/>'
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r*U:.1f}" fill="{l}" stroke="rgba(255,255,255,.9)" stroke-width="2"/>'
            f'<circle cx="{cx - r*U*.3:.1f}" cy="{cy - r*U*.3:.1f}" r="{r*U*.45:.1f}" fill="{t}" opacity=".7"/></g>')

def cone(i, x, y, r, h, c, o):
    t, l, rr = ISO[c]
    cx, cy0 = P(x, y, 0, o); _, cy1 = P(x, y, h, o)
    rx, ry = r * U * 1.22, r * U * 0.71
    return (f'<g id="{i}"><path d="M{cx-rx:.1f},{cy0:.1f} L{cx:.1f},{cy1:.1f} L{cx+rx:.1f},{cy0:.1f} A{rx:.1f},{ry:.1f} 0 0 1 {cx-rx:.1f},{cy0:.1f} Z" '
            f'fill="{l}" stroke="rgba(255,255,255,.9)" stroke-width="2" stroke-linejoin="round"/></g>')

def pipe(i, path, c, o, dashed=False, z=.12, wdt=9):
    ps = [P(a, b, z, o) for a, b in path]
    col = ISO[c][1]
    da = ' stroke-dasharray="4 16"' if dashed else ''
    return (f'<polyline id="{i}" points="{pts(ps)}" fill="none" stroke="{col}" stroke-width="{wdt}" '
            f'stroke-linecap="round" stroke-linejoin="round"{da}/>'), ps

def ring(cx, cy, r, c='amber', i=''):
    return f'<ellipse id="{i}" cx="{cx}" cy="{cy}" rx="{r*1.3}" ry="{r*.75}" fill="none" stroke="{ISO[c][1]}" stroke-width="5"/>'

# ---------- data caption ----------
MERGE = {8: (11, '92%.'), 27: (31, '$1,25,'), 33: (36, '$0,10')}
FIX = {151: 'Sing', 152: 'Murah', 153: 'Wae.'}
tok = []
i = 0
while i < len(W):
    if i in MERGE:
        j, txt = MERGE[i]
        tok.append((txt, W[i][1], W[j][2], i)); i = j + 1; continue
    tok.append((FIX.get(i, W[i][0]), W[i][1], W[i][2], i)); i += 1
EMPH = {'92%', '$1,25', '$0,10', 'Contributor', 'default', 'Standard', 'rahasia', 'Murah', 'Wae', 'tanggung', 'jawabnya', 'Anda'}
def emph(t): return re.sub(r'[^\w%$,]', '', t).rstrip(',') in EMPH

groups, cur = [], []
for t in tok:
    cur.append(t)
    txt = ' '.join(x[0] for x in cur)
    end_p = t[0][-1] in '.,?:' or t[0].endswith('...')
    if len(cur) >= 4 or len(txt) > 22 or (end_p and len(cur) >= 2) or (t[0][-1] in '.?' ):
        groups.append(cur); cur = []
if cur: groups.append(cur)
# gabung kelompok 1 kata di ujung
merged = []
for g in groups:
    if merged and len(g) == 1 and len(merged[-1]) < 4 and merged[-1][-1][0][-1] not in '.?':
        merged[-1] += g
    else: merged.append(g)
groups = merged

cap_html, cap_js = [], []
for gi, g in enumerate(groups):
    ws = ''.join(f'<span class="w{" k" if emph(w[0]) else ""}" id="c{gi}w{wi}">{w[0]}</span> ' for wi, w in enumerate(g))
    cap_html.append(f'<div class="cg" id="cg{gi}">{ws.strip()}</div>')
    t0 = g[0][1] - 0.03
    nxt = groups[gi + 1][0][1] - 0.03 if gi + 1 < len(groups) else DUR
    t1 = min(g[-1][2] + 0.22, nxt)
    cap_js.append(f'tl.set("#cg{gi}",{{opacity:1,y:0}},{t0:.2f});')
    cap_js.append(f'tl.fromTo("#cg{gi}",{{y:14,scale:.96}},{{y:0,scale:1,duration:.16,ease:"power2.out"}},{t0:.2f});')
    for wi, w in enumerate(g):
        cap_js.append(f'tl.to("#c{gi}w{wi}",{{opacity:1,duration:.08}},{w[1]:.2f});')
    cap_js.append(f'tl.set("#cg{gi}",{{opacity:0}},{t1:.2f});')

# ---------- helper HTML ----------
def clip(id_, start, end, inner, cls='scene', track=2, extra=''):
    return (f'<div id="{id_}" class="clip {cls}" data-start="{start:.2f}" data-duration="{end-start:.2f}" '
            f'data-track-index="{track}" {extra}>{inner}</div>')

def card(id_, img, w_css, label, top, overlay=''):
    return (f'<div id="{id_}" class="proof" style="top:{top}px"><div class="pbar"><span class="dot"></span>'
            f'<span class="mono">{label}</span><span class="badge langit">sumber resmi Meta</span></div>'
            f'<div style="position:relative"><img src="assets/img/{img}" style="width:100%;display:block"/>{overlay}</div></div>')

def chip(id_, txt, tone='abu', style=''):
    return f'<div id="{id_}" class="chip {tone}" style="{style}">{txt}</div>'

def head(id_, txt, sub=''):
    s = f'<div class="sub mono">{sub}</div>' if sub else ''
    return f'<div id="{id_}" class="headline">{txt}</div>{s}'

JS = []
def j(s): JS.append(s)

# ======================================================================
# SCENE A  0 - 6.3  hook
# ======================================================================
oA = (560, 760)
pipeA, psA = pipe('pa-pipe', [(1.5, 2.3), (3.0, 2.3), (3.0, 1.1), (3.7, 1.1)], 'mint', oA)
mapA = (f'<svg id="mapA" class="iso" viewBox="0 0 1080 1920" width="1080" height="1920">'
        f'{cyl("a-cyl", 0.5, 2.3, .85, 1.1, "mint", oA)}{pipeA}'
        f'{box("a-meta", 3.7, 0.1, 2, 2, 2.3, "kobalt", oA)}'
        f'{sphere("a-me", 1.2, 4.3, .55, "amber", oA)}'
        + ''.join(f'<circle class="a-dot" id="a-dot{n}" r="9" fill="#25B892" stroke="#fff" stroke-width="2.5"/>' for n in range(4))
        + '</svg>')
mAcx = lambda x, y, z=0: P(x, y, z, oA)
sceneA = clip('sA', 0, 6.35,
    '<div class="kick mono" id="a-kick">Muse Spark · input per juta token</div>'
    '<div id="a-big" class="big">92%</div>'
    '<div id="a-price" class="pricecard">'
        '<div class="pl mono">Mode Standard</div><div class="pold" id="a-old">$1,25<span class="strike" id="a-strike"></span></div>'
        '<div class="pl mono" style="margin-top:26px;color:var(--mint-600)">Mode Contributor</div><div class="pnew" id="a-new">$0,10</div>'
    '</div>'
    + mapA +
    chip('a-lbl-me', 'Meta', 'kobalt', f'left:{mAcx(4.7,1.1,2.4)[0]-60:.0f}px;top:{mAcx(4.7,1.1,2.4)[1]-70:.0f}px')
    + chip('a-lbl-you', 'data Anda', 'amber', f'left:{mAcx(1.2,4.3,1.8)[0]-90:.0f}px;top:{mAcx(1.2,4.3,1.8)[1]-60:.0f}px'))
j('tl.fromTo("#a-kick",{opacity:0,y:-14},{opacity:1,y:0,duration:.4,ease:"power2.out"},0.1);')
j('tl.fromTo("#a-price",{opacity:0,y:40,scale:.96},{opacity:1,y:0,scale:1,duration:.5,ease:"power3.out"},0.15);')
j(f'tl.to("#a-strike",{{width:"100%",duration:.3,ease:"power2.inOut"}},{T(6):.2f});')
j(f'tl.to("#a-old",{{color:"#8F95A1",duration:.3}},{T(6):.2f});')
j(f'tl.fromTo("#a-new",{{opacity:0,y:20,scale:.8}},{{opacity:1,y:0,scale:1,duration:.4,ease:"back.out(1.6)"}},{T(7)+.1:.2f});')
j(f'tl.fromTo("#a-big",{{opacity:0,scale:1.5,y:30}},{{opacity:1,scale:1,y:0,duration:.45,ease:"expo.out"}},{T(8):.2f});')
j(f'tl.to("#a-price",{{opacity:0,y:60,duration:.35,ease:"power2.in"}},{T(12)-.1:.2f});')
j(f'tl.to("#a-kick",{{opacity:0,duration:.25}},{T(8)-.05:.2f});')
j(f'tl.to("#a-big",{{scale:.52,y:-150,duration:.5,ease:"power3.inOut"}},{T(12)-.1:.2f});')
j(f'tl.fromTo("#mapA",{{opacity:0,y:50}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(12):.2f});')
for n in ('a-lbl-me', 'a-lbl-you'):
    j(f'tl.fromTo("#{n}",{{opacity:0,scale:.7}},{{opacity:1,scale:1,duration:.3,ease:"back.out(1.7)"}},{T(13)+.2:.2f});')
# dots mengalir cyl -> meta
def flow(prefix, ps, t0, dur, n, cyc, extra_off=0, y_off=0):
    for k in range(n):
        for c in range(cyc):
            st = t0 + (k / n) * (dur / cyc) + c * (dur / cyc)
            for s in range(len(ps) - 1):
                seg = (dur / cyc) / (len(ps) - 1)
                x0, y0 = ps[s]; x1, y1 = ps[s + 1]
                if s == 0:
                    j(f'tl.set("#{prefix}{k}",{{x:{x0:.1f},y:{y0+y_off:.1f},opacity:1}},{st:.2f});')
                j(f'tl.to("#{prefix}{k}",{{x:{x1:.1f},y:{y1+y_off:.1f},duration:{seg:.2f},ease:"none"}},{st + s*seg:.2f});')
            j(f'tl.set("#{prefix}{k}",{{opacity:0}},{st + (dur/cyc):.2f});')
j('gsap.set(".a-dot",{opacity:0,x:0,y:0,xPercent:0});')
flow('a-dot', psA, T(12) + .3, 2.0, 4, 2, y_off=0)

# ======================================================================
# SCENE B1  6.3 - 16.0  mode Contributor + harga (bukti)
# ======================================================================
sceneB1 = clip('sB1', 6.25, 16.05,
    head('b1-h', 'Mode Contributor.')
    + chip('b1-c1', 'Contributor<br><small>lebih murah, data dipakai melatih</small>', 'amber', 'left:60px;top:650px;width:450px')
    + chip('b1-c2', 'Standard<br><small>lebih mahal, data tidak dipakai</small>', 'mint', 'left:570px;top:650px;width:450px')
    + card('b1-card', 'proof-harga-c.png', 980, 'dev.meta.ai/models/muse-spark', 530,
         '<div class="ring" id="b1-r1" style="left:55.0%;top:74.2%;width:7.9%;height:7.9%"></div>'
         '<div class="ring mintr" id="b1-r2" style="left:55.0%;top:46.3%;width:7.9%;height:7.9%"></div>')
    + chip('b1-d', '−92% untuk input', 'mint', 'left:60px;top:1140px;width:960px;text-align:center;font-size:44px'))
j(f'tl.fromTo("#b1-h",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(16):.2f});')
j(f'tl.fromTo("#b1-c1",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.4,ease:"power3.out"}},{T(17)+.1:.2f});')
j(f'tl.fromTo("#b1-c2",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.4,ease:"power3.out"}},{T(18)+.1:.2f});')
j(f'tl.to(["#b1-c1","#b1-c2"],{{opacity:0,y:-20,duration:.3,ease:"power2.in"}},{T(19)-.05:.2f});')
j(f'tl.fromTo("#b1-card",{{opacity:0,y:140,scale:.94}},{{opacity:1,y:0,scale:1,duration:.55,ease:"power3.out"}},{T(19)+.05:.2f});')
j(f'tl.fromTo("#b1-r1",{{opacity:0,scale:1.4}},{{opacity:1,scale:1,duration:.3,ease:"back.out(1.7)"}},{T(27):.2f});')
j(f'tl.to("#b1-r1",{{opacity:0,duration:.25}},{T(32):.2f});')
j(f'tl.fromTo("#b1-r2",{{opacity:0,scale:1.4}},{{opacity:1,scale:1,duration:.3,ease:"back.out(1.7)"}},{T(33):.2f});')
j(f'tl.fromTo("#b1-d",{{opacity:0,y:30,scale:.9}},{{opacity:1,y:0,scale:1,duration:.4,ease:"back.out(1.6)"}},{T(36):.2f});')
j(f'tl.to("#b1-card",{{scale:1.035,duration:5,ease:"none"}},{T(19)+.6:.2f});')

# ======================================================================
# SCENE B2  16.0 - 21.8  Meta boleh memakai prompt, kode, file
# ======================================================================
oB = (590, 690)
pB1, psB1 = pipe('pb1', [(1.4, 0.9), (3.4, 0.9), (3.4, 2.0), (4.6, 2.0)], 'langit', oB)
pB2, psB2 = pipe('pb2', [(1.4, 2.4), (4.6, 2.4)], 'langit', oB)
pB3, psB3 = pipe('pb3', [(1.4, 3.9), (3.4, 3.9), (3.4, 2.8), (4.6, 2.8)], 'langit', oB)
mapB = (f'<svg id="mapB" class="iso" viewBox="0 0 1080 1920" width="1080" height="1920">'
        f'{pB1}{pB2}{pB3}'
        f'{box("b2-in1", 0, 0.2, 1.4, 1.4, .35, "langit", oB)}{box("b2-in2", 0, 1.7, 1.4, 1.4, .35, "langit", oB)}{box("b2-in3", 0, 3.2, 1.4, 1.4, .35, "langit", oB)}'
        f'{box("b2-meta", 4.6, 1.2, 2.2, 2.2, 2.4, "kobalt", oB)}'
        + ''.join(f'<circle class="b-dot" id="b-dot{n}" r="9" fill="#FFB224" stroke="#fff" stroke-width="2.5"/>' for n in range(3))
        + '</svg>')
def lblpos(x, y, z=0, dx=0, dy=0): px, py = P(x, y, z, oB); return f'left:{px+dx:.0f}px;top:{py+dy:.0f}px'
sceneB2 = clip('sB2', 16.0, 21.85,
    head('b2-h', 'Imbalannya: data Anda.') + mapB
    + chip('b2-l1', 'prompt', 'langit', lblpos(0.7, 0.9, .35, -120, -100))
    + chip('b2-l2', 'kode', 'langit', lblpos(0.7, 2.4, .35, -120, -100))
    + chip('b2-l3', 'file', 'langit', lblpos(0.7, 3.9, .35, -120, -100))
    + chip('b2-lm', 'melatih model berikutnya', 'kobalt', lblpos(4.6, 1.2, 2.4, -400, -40)))
j(f'tl.fromTo("#b2-h",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(40):.2f});')
j(f'tl.fromTo("#mapB",{{opacity:0,y:60}},{{opacity:1,y:0,duration:.55,ease:"power3.out"}},{T(41):.2f});')
for n, k in ((1, 44), (2, 45), (3, 47)):
    j(f'tl.fromTo("#b2-l{n}",{{opacity:0,scale:.7}},{{opacity:1,scale:1,duration:.3,ease:"back.out(1.7)"}},{T(k):.2f});')
j(f'tl.fromTo("#b2-lm",{{opacity:0,scale:.7}},{{opacity:1,scale:1,duration:.35,ease:"back.out(1.7)"}},{T(50):.2f});')
j('gsap.set(".b-dot",{opacity:0,x:0,y:0});')
for n, ps, k in ((0, psB1, 44), (1, psB2, 45), (2, psB3, 47)):
    t0 = T(k) + .1
    for c in range(3):
        st = t0 + c * 1.05
        for s in range(len(ps) - 1):
            seg = 1.0 / (len(ps) - 1)
            x0, y0 = ps[s]; x1, y1 = ps[s + 1]
            if s == 0: j(f'tl.set("#b-dot{n}",{{x:{x0:.1f},y:{y0:.1f},opacity:1}},{st:.2f});')
            j(f'tl.to("#b-dot{n}",{{x:{x1:.1f},y:{y1:.1f},duration:{seg:.2f},ease:"none"}},{st+s*seg:.2f});')
        j(f'tl.set("#b-dot{n}",{{opacity:0}},{st+1.0:.2f});')

# ======================================================================
# SCENE C  21.8 - 32.3  langganan pun default
# ======================================================================
sceneC = clip('sC', 21.8, 32.3,
    head('c-h', 'Langganan, aman?')
    + chip('c-q', 'sudah langganan,<br>data saya aman?', 'abu', 'left:330px;top:1520px;')
    + card('c-card', 'proof-default-c.png', 980, 'dev.meta.ai/docs/models', 540)
    + chip('c-quote', '“Contributor mode, <span class="hlq">which is on by default</span>: it gives you <span class="hlq">more usage</span>…”', 'quote', 'left:60px;top:890px;width:960px')
    + chip('c-quota', '↑ kuota lebih banyak<br><small>gantinya: data dipakai melatih</small>', 'amber', 'left:60px;top:1110px;width:960px;text-align:center;font-size:30px'))
j(f'tl.fromTo("#c-h",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(53)-.1:.2f});')
j(f'tl.fromTo("#c-q",{{opacity:0,scale:.7,x:-20}},{{opacity:1,scale:1,x:0,duration:.35,ease:"back.out(1.7)"}},{T(56):.2f});')
j(f'tl.to("#c-q",{{opacity:0,duration:.25}},{T(64)-.2:.2f});')
j(f'tl.fromTo("#c-card",{{opacity:0,y:120,scale:.95}},{{opacity:1,y:0,scale:1,duration:.55,ease:"power3.out"}},{T(64):.2f});')
j(f'tl.fromTo("#c-quote",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.4,ease:"power3.out"}},{T(70):.2f});')
j(f'tl.fromTo("#c-quota",{{opacity:0,y:30,scale:.94}},{{opacity:1,y:0,scale:1,duration:.4,ease:"back.out(1.5)"}},{T(73):.2f});')

# ======================================================================
# SCENE D1  32.3 - 34.6  hanya ke depan
# ======================================================================
sceneD1 = clip('sD1', 32.3, 34.62,
    head('d1-h', 'Mematikan: hanya ke depan.')
    + chip('d1-note', 'sejak saat itu: mode Standard berlaku', 'mint', 'left:60px;top:960px;width:960px;text-align:center')
    + chip('d1-old-note', 'data yang sudah terkirim: tidak ikut berubah', 'amber', 'left:60px;top:1080px;width:960px;text-align:center;font-size:28px')
    + '<div id="d1-track"><div class="seg old" id="d1-old"><span class="mono">sudah terkirim</span></div>'
      '<div class="seg new" id="d1-new"><span class="mono">sesudah dimatikan</span></div>'
      '<div id="d1-mark"><div class="mk"></div><div class="mono ml">dimatikan</div></div></div>')
j(f'tl.fromTo("#d1-h",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(77):.2f});')
j(f'tl.fromTo("#d1-track",{{opacity:0,y:40}},{{opacity:1,y:0,duration:.45,ease:"power3.out"}},{T(77)+.15:.2f});')
j(f'tl.fromTo("#d1-new",{{scaleX:0}},{{scaleX:1,duration:.8,ease:"power2.inOut"}},{T(80):.2f});')
j(f'tl.fromTo("#d1-note",{{opacity:0,y:30,scale:.92}},{{opacity:1,y:0,scale:1,duration:.4,ease:"back.out(1.6)"}},{T(81):.2f});')
j(f'tl.fromTo("#d1-old-note",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.4,ease:"power3.out"}},{T(81)+.25:.2f});')
j(f'tl.fromTo("#d1-mark",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:.35,ease:"back.out(1.7)"}},{T(79):.2f});')

# ======================================================================
# SCENE D2  34.6 - 39.2  surat di kotak pos (bukti 3.3)
# ======================================================================
sceneD2 = clip('sD2', 34.58, 39.22,
    head('d2-h', 'Data lama tetap dipakai.')
    + card('d2-card', 'proof-ketat-c.png', 980, 'dev.meta.ai/legal/terms-of-service · 3.3', 520)
    + chip('d2-quote', '“…<span class="hlq">prospectively only</span>… Meta’s rights… <span class="hlq">will survive the change</span>”', 'quote', 'left:60px;top:850px;width:960px')
    + '<div class="envs"><div class="env" id="d2-env"><div class="flap"></div></div>'
      '<div class="mbox" id="d2-box"><div class="slot"></div><div class="mlabel mono">kotak pos Meta</div></div></div>')
j(f'tl.fromTo("#d2-h",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(82):.2f});')
j(f'tl.fromTo("#d2-card",{{opacity:0,y:120,scale:.95}},{{opacity:1,y:0,scale:1,duration:.55,ease:"power3.out"}},{T(82)+.15:.2f});')
j(f'tl.fromTo("#d2-quote",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.4,ease:"power3.out"}},{T(86):.2f});')
j(f'tl.fromTo("#d2-box",{{opacity:0,y:40}},{{opacity:1,y:0,duration:.4,ease:"power3.out"}},{T(89):.2f});')
j(f'tl.fromTo("#d2-env",{{opacity:0,x:-220,y:-30,rotate:-12}},{{opacity:1,x:0,y:60,rotate:0,duration:.7,ease:"power2.in"}},{T(90):.2f});')
j(f'tl.to("#d2-env",{{opacity:0,duration:.2}},{T(93)+.3:.2f});')

# ======================================================================
# SCENE D3  39.2 - 46.1  kode rahasia dilarang (bukti 6.2)
# ======================================================================
sceneD3 = clip('sD3', 39.2, 46.12,
    head('d3-h', 'Kode rahasia: dilarang di sini.')
    + card('d3-card', 'proof-rahasia-c.png', 980, 'dev.meta.ai/legal/terms-of-service · 6.2', 460)
    + chip('d3-quote', '“…keep information such as <span class="hlq">software code confidential</span>, you <span class="hlq">must not submit</span> that information to the Contributor Services.”', 'quote', 'left:60px;top:828px;width:960px;font-size:40px')
    + chip('d3-you', 'tanggung jawab di Anda', 'koral', 'left:60px;top:1150px;width:960px;text-align:center'))
j(f'tl.fromTo("#d3-h",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(96):.2f});')
j(f'tl.fromTo("#d3-card",{{opacity:0,y:120,scale:.95}},{{opacity:1,y:0,scale:1,duration:.55,ease:"power3.out"}},{T(96)+.1:.2f});')
j(f'tl.fromTo("#d3-quote",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.4,ease:"power3.out"}},{T(100):.2f});')
j(f'tl.fromTo("#d3-you",{{opacity:0,y:30,scale:.9}},{{opacity:1,y:0,scale:1,duration:.4,ease:"back.out(1.6)"}},{T(112):.2f});')

# ======================================================================
# SCENE E  46.1 - 53.8  buka pengaturan, Standard
# ======================================================================
sceneE = clip('sE', 46.1, 53.82,
    head('e-h', 'Buka pengaturannya dulu.')
    + '<div id="e-ui"><div class="uit mono">Pengaturan · mode data</div>'
      '<div class="seg2"><div id="e-thumb"></div><div class="so" id="e-o1">Contributor</div><div class="so" id="e-o2">Standard</div></div>'
      '<div id="e-st1" class="stline">data dipakai melatih model</div>'
      '<div id="e-st2" class="stline ok">data Anda tidak dipakai melatih</div></div>')
j(f'tl.fromTo("#e-h",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(116):.2f});')
j(f'tl.fromTo("#e-ui",{{opacity:0,y:80,scale:.95}},{{opacity:1,y:0,scale:1,duration:.55,ease:"power3.out"}},{T(124):.2f});')
j(f'tl.to("#e-thumb",{{x:392,duration:.45,ease:"power3.inOut"}},{T(128):.2f});')
j(f'tl.to("#e-o1",{{color:"#636B7A",duration:.2}},{T(128):.2f});tl.to("#e-o2",{{color:"#fff",duration:.2}},{T(128):.2f});')
j(f'tl.to("#e-st1",{{opacity:0,y:-10,duration:.2}},{T(129):.2f});')
j(f'tl.fromTo("#e-st2",{{opacity:0,y:10}},{{opacity:1,y:0,duration:.35,ease:"power2.out"}},{T(129)+.1:.2f});')

# ======================================================================
# SCENE F  53.8 - 62.2  tukar tambah -> sama-sama beres (=) -> logo seri terbang ke tengah
# ======================================================================
sceneF = clip('sF', 53.8, 62.2,
    head('f-h', 'Tukar tambah.')
    + '<div id="f-swap"><div class="sw"><img src="assets/img/clay-money-bag.png"/><div class="mono sl">harga murah</div></div>'
      '<div class="arr" id="f-arr"><span id="f-a1">⇄</span><span id="f-a2">=</span></div>'
      '<div class="sw"><svg width="250" height="250" viewBox="0 0 190 190"><ellipse cx="95" cy="150" rx="70" ry="28" fill="#1C9576"/>'
      '<rect x="25" y="60" width="140" height="90" fill="#25B892"/><ellipse cx="95" cy="60" rx="70" ry="28" fill="#6FD9BC" stroke="#fff" stroke-width="3"/>'
      '<path d="M25,60 L25,150 A70,28 0 0 0 165,150 L165,60" fill="none" stroke="#fff" stroke-width="3"/></svg><div class="mono sl">data Anda</div></div></div>'
    + chip('f-ok', '✓ boleh dipakai = sah', 'mint', 'left:60px;top:1180px;width:960px;text-align:center')
    + chip('f-ok2', '✓ sama-sama beres', 'mint', 'left:60px;top:1180px;width:960px;text-align:center;font-size:44px'))
j(f'tl.fromTo("#f-h",{{opacity:0,y:30}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(134):.2f});')
j(f'tl.fromTo("#f-swap",{{opacity:0,y:50}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(135):.2f});')
j(f'tl.to("#f-a1",{{scale:1.25,duration:.25,yoyo:true,repeat:1}},{T(137):.2f});')
j(f'tl.fromTo("#f-ok",{{opacity:0,y:30,scale:.9}},{{opacity:1,y:0,scale:1,duration:.4,ease:"back.out(1.6)"}},{T(144):.2f});')
j(f'tl.to("#f-ok",{{opacity:0,y:-20,duration:.25}},{T(148)-.05:.2f});')
j(f'tl.to("#f-a1",{{opacity:0,duration:.2}},{T(149):.2f});')
j(f'tl.fromTo("#f-a2",{{opacity:0,scale:.5}},{{opacity:1,scale:1,duration:.35,ease:"back.out(2)"}},{T(149):.2f});')
j(f'tl.fromTo("#f-ok2",{{opacity:0,y:30,scale:.9}},{{opacity:1,y:0,scale:1,duration:.4,ease:"back.out(1.6)"}},{T(150):.2f});')
j(f'tl.to(["#f-h","#f-swap"],{{opacity:.12,duration:.3}},{T(151)-.15:.2f});')
# logo seri kiri atas terbang ke tengah saat "sing murah wae", lalu kembali
j(f'tl.to(["#series","#seriesw"],{{x:120,y:420,scale:3.4,duration:.5,ease:"back.out(1.25)"}},{T(151)-.1:.2f});')
j(f'tl.to(["#series","#seriesw"],{{x:0,y:0,scale:1,duration:.55,ease:"power3.inOut"}},{E(153)+.02:.2f});')

# ======================================================================
# SCENE G  62.15 - 66.4  pertanyaan penutup (inverse ink)
# ======================================================================
sceneG = clip('sG', 62.1, DUR,
    '<div id="g-bg"></div>'
    '<div id="g-q">Siapa yang pernah mengecek <span class="kb">mode data</span> tool AI tim Anda?</div>', cls='scene g')
j(f'tl.to("#series",{{opacity:0,duration:.3}},{T(154)-.05:.2f});tl.to("#seriesw",{{opacity:1,duration:.3}},{T(154)-.05:.2f});')
j(f'tl.to("#sig",{{opacity:0,duration:.3}},{T(154)-.05:.2f});tl.to("#sigw",{{opacity:.95,duration:.3}},{T(154)-.05:.2f});')
j(f'tl.fromTo("#g-bg",{{opacity:0}},{{opacity:1,duration:.4}},{T(154)-.05:.2f});')
j(f'tl.fromTo("#g-q",{{opacity:0,y:40}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{T(154):.2f});')

# ---------- kepala Aulia permanen (satu per frame) ----------
EXP = [(0,'kagum'),(T(12)-.05,'ragu'),(6.25,'netral'),(T(19)-.05,'yakin'),(T(40)-.05,'khawatir'),(T(53)-.05,'bingung'),
       (T(64)-.05,'terkejut'),(T(73)-.05,'ragu'),(T(77)-.05,'berpikir'),(T(82)-.05,'sedih'),(T(96)-.05,'khawatir'),
       (T(116)-.05,'yakin'),(T(127)-.05,'lega'),(T(134)-.05,'berpikir'),(T(141)-.05,'yakin'),(T(148)-.05,'senyum'),(T(154)-.05,'berpikir')]
ph_imgs = ''.join(f'<img class="phx" id="ph-{n}-{k}" src="assets/img/kepala-{n}.png"/>' for k,(t,n) in enumerate(EXP))
phead = f'<div class="clip phwrap" data-start="0" data-duration="{DUR}" data-track-index="7"><div id="ph"><div id="ph-in">{ph_imgs}</div></div></div>'
j('gsap.set(".phx",{opacity:0});')
for k,(t,n) in enumerate(EXP):
    if k==0: j(f'tl.set("#ph-{n}-0",{{opacity:1}},0);')
    else:
        j(f'tl.to("#ph-{EXP[k-1][1]}-{k-1}",{{opacity:0,duration:.14}},{t:.2f});')
        j(f'tl.fromTo("#ph-{n}-{k}",{{opacity:0,scale:.9}},{{opacity:1,scale:1,duration:.2,ease:"back.out(1.8)"}},{t:.2f});')
j('tl.fromTo("#ph",{opacity:0,scale:.5},{opacity:1,scale:1,duration:.45,ease:"back.out(1.6)"},0.3);')
j('tl.to("#ph-in",{y:-10,rotate:2,duration:1.4,ease:"sine.inOut",yoyo:true,repeat:46},0.8);')

# ---------- SFX ----------
sfx = [('whoosh', 0.05, .5), ('impact', T(8), .7), ('pop', T(7) + .1, .5), ('whoosh', T(12) - .1, .45),
       ('whoosh', T(16), .35), ('pop', T(27), .45), ('pop', T(33), .45), ('whoosh', T(40), .35),
       ('pop', T(44), .4), ('pop', T(45), .4), ('pop', T(47), .4), ('whoosh', T(53), .35), ('pop', T(56), .4),
       ('whoosh', T(64) - .1, .35), ('pop', T(73), .4), ('whoosh', T(77), .35), ('glitch', T(80), .3),
       ('whoosh', T(82), .35), ('pop', T(90) + .5, .4), ('whoosh', T(96), .35), ('glitch', T(112), .35),
       ('whoosh', T(116), .35), ('ding', T(128), .55), ('whoosh', T(134), .35), ('pop', T(144), .45),
       ('ding', T(151) + .45, .6), ('whoosh', T(154) - .05, .4)]
SD = {'whoosh': .26, 'impact': .5, 'pop': .22, 'glitch': .3, 'ding': .8}
SF = {'whoosh': 'swipe', 'impact': 'thud', 'pop': 'pop', 'glitch': 'warn', 'ding': 'ding'}
sfx_html = ''.join(
    f'<audio id="sfx{k}" src="assets/sfx/{SF[n]}.mp3" data-start="{max(0,t):.2f}" data-duration="{SD[n]}" data-track-index="{10+k}" data-volume="{v}"></audio>'
    for k, (n, t, v) in enumerate(sfx))

# ---------- CSS ----------
CSS = '''
@font-face{font-family:"Geist";src:url("assets/fonts/Geist-latin.woff2") format("woff2");font-weight:100 900}
@font-face{font-family:"Geist Mono";src:url("assets/fonts/GeistMono-latin.woff2") format("woff2");font-weight:100 900}
:root{--abu-0:#fff;--abu-50:#F4F5F7;--abu-100:#ECEEF2;--abu-200:#E1E4EA;--abu-300:#CDD2DB;--abu-400:#A3AAB7;
--ink-400:#8A91A0;--ink-500:#636B7A;--ink-600:#4A5160;--ink-700:#2E333D;--ink-900:#0B0D12;
--kobalt-50:#EEF1FF;--kobalt-100:#DCE2FF;--kobalt-500:#3A5BFF;--kobalt-600:#2B47DB;
--mint-50:#E6F7F1;--mint-100:#C8EEDF;--mint-500:#25B892;--mint-600:#1C9576;--mint-800:#106049;
--amber-50:#FFF5E0;--amber-100:#FFE7B3;--amber-500:#FFB224;--amber-800:#8A5A00;
--koral-50:#FFEEE9;--koral-100:#FFD9CE;--koral-500:#FF6B47;--koral-800:#8F2A12;
--langit-50:#E6F6FF;--langit-100:#C7EBFF;--langit-600:#0E93DB;--langit-800:#0B5480}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#F4F5F7}
#root{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:"Geist",sans-serif;color:var(--ink-900);background:#F4F5F7}
.clip,.scene{position:absolute;left:0;top:0;width:1080px;height:1920px}
.mono{font-family:"Geist Mono",monospace;font-weight:500}
#bg{background:linear-gradient(180deg,#F4F5F7 0%,#fff 62%,#F4F5F7 100%)}
#bg .tint{position:absolute;left:-200px;top:-260px;width:1500px;height:900px;background:radial-gradient(closest-side,rgba(58,91,255,.10),rgba(58,91,255,0))}
#bg .grid{position:absolute;left:0;top:1180px;width:1080px;height:420px;opacity:.55}
#hdr{z-index:30;pointer-events:none}
#series,#seriesw{position:absolute;left:54px;top:84px;width:215px;transform-origin:0 50%}
#seriesw{opacity:0}
#sig,#sigw{position:absolute;right:50px;top:76px;width:210px;opacity:.9}
#sigw{opacity:0}
.headline{position:absolute;left:60px;right:130px;top:236px;font-size:92px;line-height:1.02;font-weight:600;letter-spacing:-.04em;color:var(--ink-900)}
.sub{position:absolute;left:60px;top:230px;font-size:28px;color:var(--ink-500)}
.kick{position:absolute;left:60px;top:250px;font-size:30px;color:var(--ink-500)}
.big{position:absolute;left:0;width:1080px;top:290px;text-align:center;font-size:430px;line-height:1;font-weight:600;letter-spacing:-.06em;color:var(--kobalt-500);transform-origin:50% 50%}
.pricecard{position:absolute;left:90px;top:690px;width:900px;padding:40px 56px 48px;background:#fff;border:1px solid var(--abu-200);border-radius:28px;box-shadow:0 12px 40px rgba(11,13,18,.08)}
.pl{font-size:28px;color:var(--ink-500)}
.pold{position:relative;display:inline-block;font-size:150px;line-height:1.05;font-weight:600;letter-spacing:-.05em;color:var(--ink-900);font-family:"Geist Mono",monospace;font-weight:500}
.strike{position:absolute;left:0;top:52%;height:12px;width:0;background:var(--koral-500);border-radius:6px}
.pnew{font-size:180px;line-height:1.05;letter-spacing:-.05em;color:var(--mint-600);font-family:"Geist Mono",monospace;font-weight:500}
.iso{position:absolute;left:0;top:0}
.chip{position:absolute;display:inline-block;padding:16px 28px;border-radius:20px;font-size:34px;line-height:1.2;font-weight:600;background:#fff;border:1px solid var(--abu-200);box-shadow:0 8px 24px rgba(11,13,18,.08);color:var(--ink-900);white-space:nowrap}
.chip small{display:block;font-size:24px;font-weight:400;color:var(--ink-600);margin-top:4px;white-space:normal}
.chip.kobalt{background:var(--kobalt-500);color:#fff;border-color:var(--kobalt-500)}
.chip.amber{background:var(--amber-100);color:var(--amber-800);border-color:var(--amber-500)}
.chip.mint{background:var(--mint-100);color:var(--mint-800);border-color:var(--mint-500)}
.chip.koral{background:var(--koral-100);color:var(--koral-800);border-color:var(--koral-500)}
.chip.quote{background:#fff;border:2px solid var(--amber-500);font-size:44px;font-weight:500;line-height:1.3;white-space:normal;box-shadow:0 10px 30px rgba(11,13,18,.1)}
.hlq{background:var(--amber-100);padding:0 4px;border-radius:8px;font-weight:600}
.chip.langit{background:var(--langit-100);color:var(--langit-800);border-color:#2BB3FF}
.proof{position:absolute;left:50px;width:980px;background:#fff;border:1px solid var(--abu-200);border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(11,13,18,.14)}
.pbar{display:flex;align-items:center;gap:12px;padding:16px 22px;background:var(--abu-50);border-bottom:1px solid var(--abu-200);font-size:23px;color:var(--ink-600)}
.pbar .dot{width:14px;height:14px;border-radius:50%;background:var(--abu-300)}
.pbar .mono{flex:1;white-space:nowrap}
.badge{font-family:"Geist Mono",monospace;font-size:20px;padding:6px 14px;border-radius:999px;font-weight:500}
.badge.langit{background:var(--langit-100);color:var(--langit-800)}
.ring{position:absolute;border:6px solid var(--koral-500);border-radius:18px;opacity:0}
.ring.mintr{border-color:var(--mint-500)}
.hlbar{position:absolute;left:60px;top:1010px;width:0;height:0;opacity:0}
.head{position:absolute;filter:drop-shadow(0 14px 18px rgba(11,13,18,.18))}
.phwrap{pointer-events:none;z-index:25}
#ph{position:absolute;left:-8px;top:1468px;width:360px;height:360px;transform-origin:0 100%}
#ph-in{position:absolute;left:0;top:0;width:360px;height:360px}
.phx{position:absolute;left:0;top:0;width:360px;height:360px;filter:drop-shadow(0 12px 16px rgba(11,13,18,.22))}
#d1-track{position:absolute;left:60px;top:700px;width:960px;height:140px}
.seg{position:absolute;top:0;height:140px;display:flex;align-items:center;justify-content:center;font-size:28px;color:#fff}
.seg.old{left:0;width:480px;background:var(--amber-500);border-radius:24px 0 0 24px;color:var(--amber-800)}
.seg.new{left:480px;width:480px;background:var(--mint-500);border-radius:0 24px 24px 0;transform-origin:0 50%;color:#fff}
#d1-mark{position:absolute;left:480px;top:-60px;width:0;height:260px}
#d1-mark .mk{position:absolute;left:-3px;top:50px;width:6px;height:210px;background:var(--ink-900);border-radius:3px}
#d1-mark .ml{position:absolute;left:-90px;top:-8px;width:180px;text-align:center;font-size:28px;background:var(--ink-900);color:#fff;border-radius:999px;padding:8px 0}
.envs{position:absolute;left:0;top:985px;width:1080px;height:300px}
.env{position:absolute;left:170px;top:60px;width:230px;height:150px;background:#fff;border:3px solid var(--ink-900);border-radius:14px;box-shadow:0 8px 20px rgba(11,13,18,.12)}
.env .flap{position:absolute;left:0;top:0;width:100%;height:80px;background:var(--amber-100);clip-path:polygon(0 0,100% 0,50% 100%);border-bottom:none}
.mbox{position:absolute;left:660px;top:30px;width:330px;height:200px;background:var(--kobalt-500);border-radius:34px 34px 14px 14px;box-shadow:0 12px 30px rgba(43,71,219,.35)}
.mbox .slot{position:absolute;left:50px;top:60px;width:240px;height:22px;background:var(--ink-900);border-radius:11px}
.mbox .mlabel{position:absolute;left:0;bottom:22px;width:100%;text-align:center;color:#fff;font-size:26px}
#e-ui{position:absolute;left:90px;top:520px;width:900px;padding:44px;background:#fff;border:1px solid var(--abu-200);border-radius:28px;box-shadow:0 12px 40px rgba(11,13,18,.1)}
.uit{font-size:26px;color:var(--ink-500);margin-bottom:28px}
.seg2{position:relative;display:flex;height:112px;background:var(--abu-100);border-radius:999px;padding:8px}
#e-thumb{position:absolute;left:8px;top:8px;width:420px;height:96px;background:var(--amber-500);border-radius:999px;box-shadow:0 2px 6px rgba(11,13,18,.12)}
.so{position:relative;flex:1;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:600;color:var(--ink-900)}
#e-o2{color:var(--ink-500)}
.stline{margin-top:34px;font-size:36px;color:var(--amber-800);font-weight:600;height:50px}
.stline.ok{position:absolute;left:44px;bottom:44px;color:var(--mint-600);opacity:0}
.stline.ok::before{content:"✓ ";}
#f-swap{position:absolute;left:0;top:600px;width:1080px;display:flex;align-items:center;justify-content:center;gap:50px}
.sw{display:flex;flex-direction:column;align-items:center;gap:14px}
.sw img{width:250px;height:250px;object-fit:contain}
.sl{font-size:28px;color:var(--ink-600)}
.arr{position:relative;width:150px;height:130px;font-size:130px;color:var(--kobalt-500);font-weight:600;line-height:1}
#f-arr span{position:absolute;left:0;top:0;width:100%;text-align:center;display:block}
#f-a2{opacity:0;color:var(--mint-600)}
#f-eq{position:absolute;left:0;top:740px;width:1080px;text-align:center;font-size:62px;color:var(--ink-900)}
#f-eq b{font-weight:600;color:var(--mint-600);font-size:120px;display:block;line-height:1}
#g-bg{position:absolute;left:0;top:0;width:1080px;height:1920px;background:var(--ink-900);opacity:0}
#g-q{position:absolute;left:70px;right:130px;top:330px;font-size:100px;line-height:1.08;font-weight:600;letter-spacing:-.04em;color:#fff;opacity:0}
#g-q .kb{color:#8EA1FF}
#cap{z-index:40;pointer-events:none}
.cg{position:absolute;left:60px;right:130px;top:1296px;opacity:0;text-align:center;font-size:76px;line-height:1.1;font-weight:600;letter-spacing:-.03em;color:var(--ink-900);
 background:#fff;border:1px solid var(--abu-200);border-radius:28px;padding:20px 30px;box-shadow:0 10px 30px rgba(11,13,18,.12)}
.cg .w{opacity:.28;display:inline-block}
.cg .w.k{color:var(--kobalt-600)}
'''

grid = ''.join(f'<line x1="{i*135}" y1="0" x2="{min(1080,i*135+210)}" y2="420" stroke="#CDD2DB" stroke-width="1.5"/>' for i in range(0, 8))
grid += ''.join(f'<line x1="0" y1="{y}" x2="1080" y2="{y}" stroke="#CDD2DB" stroke-width="1.5"/>' for y in (0, 70, 150, 240, 340))

HTML = f'''<!doctype html>
<html lang="id"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>Contributor, harga 92% dibayar data</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>{CSS}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
<div id="bg" class="clip" data-start="0" data-duration="{DUR}" data-track-index="0"><div class="tint"></div><svg class="grid" viewBox="0 0 1080 420" preserveAspectRatio="none">{grid}</svg></div>
<audio id="vo" src="assets/vo.mp3" data-start="0" data-duration="65.83" data-track-index="1" data-volume="1"></audio>
<audio id="bgm" src="assets/bgm-duck.mp3" data-start="0" data-duration="65.82" data-track-index="2" data-volume="0.9"></audio>
{sceneA}{sceneB1}{sceneB2}{sceneC}{sceneD1}{sceneD2}{sceneD3}{sceneE}{sceneF}{sceneG}{phead}
<div id="hdr" class="clip" data-start="0" data-duration="{DUR}" data-track-index="8"><img id="series" src="assets/img/sing-murah-wae.svg"/><img id="seriesw" src="assets/img/sing-murah-wae-white.svg"/><img id="sig" src="assets/img/logo-signature-black.svg"/><img id="sigw" src="assets/img/logo-signature-white.svg"/></div>
<div id="cap" class="clip" data-start="0" data-duration="{DUR}" data-track-index="9">{''.join(cap_html)}</div>
{sfx_html}
</div>
<script>
const tl = gsap.timeline({{paused:true}});
{chr(10).join(JS)}
{chr(10).join(cap_js)}
window.__timelines["main"] = tl;
</script></body></html>'''

open('index.html', 'w').write(HTML)
print('index.html', len(HTML), 'bytes;', len(groups), 'caption groups')
