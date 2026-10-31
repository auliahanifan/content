"""Pustaka build video faceless Aulia (1080x1920). Pakai dari build.py proyek:

    import sys; sys.path.insert(0, '<skill>/scripts'); from lib import *
Kontrak: words.json = [[kata, mulai, akhir], ...] dari words.py (timestamp ElevenLabs, bukan Whisper).
Contoh pemakaian utuh: examples/contributor-build.py."""
import json, math, re

# ---------- palet iso (tokens design system) ----------
ISO = {  # [atas, kiri, kanan]
    'kobalt': ['#6680FF', '#3A5BFF', '#2B47DB'], 'langit': ['#7CCBFF', '#2BB3FF', '#0E93DB'],
    'ungu': ['#B79BFA', '#8B5CF6', '#7140E0'], 'mint': ['#6FD9BC', '#25B892', '#1C9576'],
    'amber': ['#FFCB66', '#FFB224', '#E09200'], 'koral': ['#FF9A82', '#FF6B47', '#E04F2C'],
    'abu': ['#FFFFFF', '#ECEEF2', '#CDD2DB'],
}
U = 92
def P(x, y, z=0, o=(540, 250)):
    return (o[0] + (x - y) * 0.866 * U, o[1] + (x + y) * 0.5 * U - z * U)
def pts(ps): return ' '.join(f'{a:.1f},{b:.1f}' for a, b in ps)
_S = 'stroke="rgba(255,255,255,.9)" stroke-width="2" stroke-linejoin="round"'

def box(i, x, y, w, d, h, c, o, op=1):
    t, l, r = ISO[c]
    top = [P(x, y, h, o), P(x + w, y, h, o), P(x + w, y + d, h, o), P(x, y + d, h, o)]
    left = [P(x, y + d, 0, o), P(x + w, y + d, 0, o), P(x + w, y + d, h, o), P(x, y + d, h, o)]
    right = [P(x + w, y, 0, o), P(x + w, y + d, 0, o), P(x + w, y + d, h, o), P(x + w, y, h, o)]
    return (f'<g id="{i}" opacity="{op}"><polygon points="{pts(left)}" fill="{l}" {_S}/>'
            f'<polygon points="{pts(right)}" fill="{r}" {_S}/><polygon points="{pts(top)}" fill="{t}" {_S}/></g>')

def cyl(i, x, y, r, h, c, o):
    t, l, _ = ISO[c]; cx, cy0 = P(x, y, 0, o); _, cy1 = P(x, y, h, o)
    rx, ry = r * U * 1.22, r * U * 0.71
    return (f'<g id="{i}"><path d="M{cx-rx:.1f},{cy1:.1f} L{cx-rx:.1f},{cy0:.1f} A{rx:.1f},{ry:.1f} 0 0 0 {cx+rx:.1f},{cy0:.1f} '
            f'L{cx+rx:.1f},{cy1:.1f} Z" fill="{l}" stroke="rgba(255,255,255,.9)" stroke-width="2"/>'
            f'<ellipse cx="{cx:.1f}" cy="{cy1:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{t}" stroke="rgba(255,255,255,.9)" stroke-width="2"/></g>')

def sphere(i, x, y, r, c, o):
    cx, cy = P(x, y, r, o); t, l, _ = ISO[c]
    return (f'<g id="{i}"><ellipse cx="{cx:.1f}" cy="{cy + r*U*0.95:.1f}" rx="{r*U*1.1:.1f}" ry="{r*U*0.4:.1f}" fill="rgba(11,13,18,.10)"/>'
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r*U:.1f}" fill="{l}" stroke="rgba(255,255,255,.9)" stroke-width="2"/>'
            f'<circle cx="{cx - r*U*.3:.1f}" cy="{cy - r*U*.3:.1f}" r="{r*U*.45:.1f}" fill="{t}" opacity=".7"/></g>')

def cone(i, x, y, r, h, c, o):
    _, l, _ = ISO[c]; cx, cy0 = P(x, y, 0, o); _, cy1 = P(x, y, h, o)
    rx, ry = r * U * 1.22, r * U * 0.71
    return (f'<g id="{i}"><path d="M{cx-rx:.1f},{cy0:.1f} L{cx:.1f},{cy1:.1f} L{cx+rx:.1f},{cy0:.1f} A{rx:.1f},{ry:.1f} 0 0 1 {cx-rx:.1f},{cy0:.1f} Z" '
            f'fill="{l}" {_S}/></g>')

def pipe(i, path, c, o, dashed=False, z=.12, wdt=9):
    ps = [P(a, b, z, o) for a, b in path]
    da = ' stroke-dasharray="4 16"' if dashed else ''
    return (f'<polyline id="{i}" points="{pts(ps)}" fill="none" stroke="{ISO[c][1]}" stroke-width="{wdt}" '
            f'stroke-linecap="round" stroke-linejoin="round"{da}/>'), ps

def ring(cx, cy, r, c='amber', i=''):
    return f'<ellipse id="{i}" cx="{cx}" cy="{cy}" rx="{r*1.3}" ry="{r*.75}" fill="none" stroke="{ISO[c][1]}" stroke-width="5"/>'

# ---------- waktu kata ----------
class Words:
    """T(i)/E(i) = awal/akhir kata ke-i (detik)."""
    def __init__(self, path='tts/words.json'):
        self.W = json.load(open(path))
        self.T = lambda i: round(self.W[i][1], 2)
        self.E = lambda i: round(self.W[i][2], 2)

# ---------- caption kata-per-kata ----------
def captions(W, DUR, merge=None, fix=None, emph=()):
    """merge {i:(j,teks)} gabung kata i..j jadi satu token (angka/harga); fix {i:teks} ganti ejaan;
    emph = set kata kunci (diberi kelas .k = kobalt). Kembalikan (html_list, js_list, groups)."""
    merge, fix, emph = merge or {}, fix or {}, set(emph)
    tok, i = [], 0
    while i < len(W):
        if i in merge:
            j, txt = merge[i]; tok.append((txt, W[i][1], W[j][2], i)); i = j + 1; continue
        tok.append((fix.get(i, W[i][0]), W[i][1], W[i][2], i)); i += 1
    key = lambda t: re.sub(r'[^\w%$,]', '', t).rstrip(',')
    groups, cur = [], []
    for t in tok:
        cur.append(t); txt = ' '.join(x[0] for x in cur)
        end_p = t[0][-1] in '.,?:' or t[0].endswith('...')
        if len(cur) >= 4 or len(txt) > 22 or (end_p and len(cur) >= 2) or t[0][-1] in '.?':
            groups.append(cur); cur = []
    if cur: groups.append(cur)
    merged = []
    for g in groups:
        if merged and len(g) == 1 and len(merged[-1]) < 4 and merged[-1][-1][0][-1] not in '.?': merged[-1] += g
        else: merged.append(g)
    groups = merged
    html, js = [], []
    for gi, g in enumerate(groups):
        ws = ''.join(f'<span class="w{" k" if key(w[0]) in emph else ""}" id="c{gi}w{wi}">{w[0]}</span> ' for wi, w in enumerate(g))
        html.append(f'<div class="cg" id="cg{gi}">{ws.strip()}</div>')
        t0 = g[0][1] - 0.03
        nxt = groups[gi + 1][0][1] - 0.03 if gi + 1 < len(groups) else DUR
        t1 = min(g[-1][2] + 0.22, nxt)
        js.append(f'tl.set("#cg{gi}",{{opacity:1,y:0}},{t0:.2f});')
        js.append(f'tl.fromTo("#cg{gi}",{{y:14,scale:.96}},{{y:0,scale:1,duration:.16,ease:"power2.out"}},{t0:.2f});')
        for wi, w in enumerate(g): js.append(f'tl.to("#c{gi}w{wi}",{{opacity:1,duration:.08}},{w[1]:.2f});')
        js.append(f'tl.set("#cg{gi}",{{opacity:0}},{t1:.2f});')
    return html, js, groups

# ---------- helper HTML ----------
def clip(id_, start, end, inner, cls='scene', track=2, extra=''):
    return (f'<div id="{id_}" class="clip {cls}" data-start="{start:.2f}" data-duration="{end-start:.2f}" '
            f'data-track-index="{track}" {extra}>{inner}</div>')

def card(id_, img, label, top, badge='sumber resmi', overlay=''):
    """Kartu bukti: bilah browser + screenshot. overlay (cincin sorot) memakai posisi PERSEN agar tetap pas."""
    return (f'<div id="{id_}" class="proof" style="top:{top}px"><div class="pbar"><span class="dot"></span>'
            f'<span class="mono">{label}</span><span class="badge langit">{badge}</span></div>'
            f'<div style="position:relative"><img src="assets/img/{img}" style="width:100%;display:block"/>{overlay}</div></div>')

def chip(id_, txt, tone='abu', style=''):
    return f'<div id="{id_}" class="chip {tone}" style="{style}">{txt}</div>'

def head(id_, txt, sub=''):
    s = f'<div class="sub mono">{sub}</div>' if sub else ''
    return f'<div id="{id_}" class="headline">{txt}</div>{s}'

# ---------- kepala Aulia permanen kiri bawah (satu per frame, ekspresi sesuai konteks) ----------
def persistent_head(EXP, DUR, J):
    """EXP = [(detik, 'ekspresi'), ...] urut; item pertama di 0. J = fungsi menambah baris JS timeline."""
    imgs = ''.join(f'<img class="phx" id="ph-{n}-{k}" src="assets/img/kepala-{n}.png"/>' for k, (t, n) in enumerate(EXP))
    html = f'<div id="phwrap" class="clip phwrap" data-start="0" data-duration="{DUR}" data-track-index="7"><div id="ph"><div id="ph-in">{imgs}</div></div></div>'
    J('gsap.set(".phx",{opacity:0});')
    for k, (t, n) in enumerate(EXP):
        if k == 0: J(f'tl.set("#ph-{n}-0",{{opacity:1}},0);')
        else:
            J(f'tl.to("#ph-{EXP[k-1][1]}-{k-1}",{{opacity:0,duration:.14}},{t:.2f});')
            J(f'tl.fromTo("#ph-{n}-{k}",{{opacity:0,scale:.9}},{{opacity:1,scale:1,duration:.2,ease:"back.out(1.8)"}},{t:.2f});')
    J('tl.fromTo("#ph",{opacity:0,scale:.5},{opacity:1,scale:1,duration:.45,ease:"back.out(1.6)"},0.3);')
    J(f'tl.to("#ph-in",{{y:-10,rotate:2,duration:1.4,ease:"sine.inOut",yoyo:true,repeat:{int(DUR/1.4)}}},0.8);')
    return html

# ---------- SFX ----------
SF = {'whoosh': 'swipe', 'impact': 'thud', 'pop': 'pop', 'glitch': 'warn', 'ding': 'ding'}
SD = {'whoosh': .26, 'impact': .5, 'pop': .22, 'glitch': .3, 'ding': .8}
def sfx_html(events):
    """events = [(nama, detik, volume), ...] nama: whoosh impact pop glitch ding."""
    return ''.join(f'<audio id="sfx{k}" src="assets/sfx/{SF[n]}.mp3" data-start="{max(0,t):.2f}" data-duration="{SD[n]}" '
                   f'data-track-index="{10+k}" data-volume="{v}"></audio>' for k, (n, t, v) in enumerate(events))

# ---------- CSS dasar (ditambah CSS adegan di build.py proyek) ----------
BASE_CSS = '''
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
.big{position:absolute;left:0;width:1080px;top:290px;text-align:center;font-size:430px;line-height:1;font-weight:600;letter-spacing:-.06em;color:var(--kobalt-500);transform-origin:50% 50%}
.iso{position:absolute;left:0;top:0}
.chip{position:absolute;display:inline-block;padding:16px 28px;border-radius:20px;font-size:34px;line-height:1.2;font-weight:600;background:#fff;border:1px solid var(--abu-200);box-shadow:0 8px 24px rgba(11,13,18,.08);color:var(--ink-900);white-space:nowrap}
.chip small{display:block;font-size:24px;font-weight:400;color:var(--ink-600);margin-top:4px;white-space:normal}
.chip.kobalt{background:var(--kobalt-500);color:#fff;border-color:var(--kobalt-500)}
.chip.amber{background:var(--amber-100);color:var(--amber-800);border-color:var(--amber-500)}
.chip.mint{background:var(--mint-100);color:var(--mint-800);border-color:var(--mint-500)}
.chip.koral{background:var(--koral-100);color:var(--koral-800);border-color:var(--koral-500)}
.chip.langit{background:var(--langit-100);color:var(--langit-800);border-color:#2BB3FF}
.chip.quote{background:#fff;border:2px solid var(--amber-500);font-size:44px;font-weight:500;line-height:1.3;white-space:normal;box-shadow:0 10px 30px rgba(11,13,18,.1)}
.hlq{background:var(--amber-100);padding:0 4px;border-radius:8px;font-weight:600}
.proof{position:absolute;left:50px;width:980px;background:#fff;border:1px solid var(--abu-200);border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(11,13,18,.14)}
.pbar{display:flex;align-items:center;gap:12px;padding:16px 22px;background:var(--abu-50);border-bottom:1px solid var(--abu-200);font-size:23px;color:var(--ink-600)}
.pbar .dot{width:14px;height:14px;border-radius:50%;background:var(--abu-300)}
.pbar .mono{flex:1;white-space:nowrap}
.badge{font-family:"Geist Mono",monospace;font-size:20px;padding:6px 14px;border-radius:999px;font-weight:500}
.badge.langit{background:var(--langit-100);color:var(--langit-800)}
.ring{position:absolute;border:6px solid var(--koral-500);border-radius:18px;opacity:0}
.ring.mintr{border-color:var(--mint-500)}
.phwrap{pointer-events:none;z-index:25}
#ph{position:absolute;left:-8px;top:1468px;width:360px;height:360px;transform-origin:0 100%}
#ph-in,.phx{position:absolute;left:0;top:0;width:360px;height:360px}
.phx{filter:drop-shadow(0 12px 16px rgba(11,13,18,.22))}
#g-bg{position:absolute;left:0;top:0;width:1080px;height:1920px;background:var(--ink-900);opacity:0}
#g-q{position:absolute;left:70px;right:130px;top:330px;font-size:100px;line-height:1.08;font-weight:600;letter-spacing:-.04em;color:#fff;opacity:0}
#g-q .kb{color:#8EA1FF}
#cap{z-index:40;pointer-events:none}
.cg{position:absolute;left:60px;right:130px;top:1296px;opacity:0;text-align:center;font-size:76px;line-height:1.1;font-weight:600;letter-spacing:-.03em;color:var(--ink-900);
 background:#fff;border:1px solid var(--abu-200);border-radius:28px;padding:20px 30px;box-shadow:0 10px 30px rgba(11,13,18,.12)}
.cg .w{opacity:.28;display:inline-block}
.cg .w.k{color:var(--kobalt-600)}
'''
_GRID = ''.join(f'<line x1="{i*135}" y1="0" x2="{min(1080,i*135+210)}" y2="420" stroke="#CDD2DB" stroke-width="1.5"/>' for i in range(8))
_GRID += ''.join(f'<line x1="0" y1="{y}" x2="1080" y2="{y}" stroke="#CDD2DB" stroke-width="1.5"/>' for y in (0, 70, 150, 240, 340))

def page(title, DUR, scenes, JS, cap_html, cap_js, sfx, phead, vo_dur, bgm_dur=None, series='sing-murah-wae', extra_css=''):
    """Rakit index.html. scenes = daftar string clip(); series = nama file svg di assets/img (tanpa .svg; versi -white wajib ada).
    bgm_dur None = tanpa musik (default); isi durasi hanya bila pengguna minta BGM (assets/bgm-duck.mp3 dari bgm.sh)."""
    bgm = (f'<audio id="bgm" src="assets/bgm-duck.mp3" data-start="0" data-duration="{bgm_dur}" data-track-index="2" data-volume="0.9"></audio>'
           if bgm_dur else '')
    return f'''<!doctype html>
<html lang="id"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<title>{title}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>{BASE_CSS}{extra_css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
<div id="bg" class="clip" data-start="0" data-duration="{DUR}" data-track-index="0"><div class="tint"></div><svg class="grid" viewBox="0 0 1080 420" preserveAspectRatio="none">{_GRID}</svg></div>
<audio id="vo" src="assets/vo.mp3" data-start="0" data-duration="{vo_dur}" data-track-index="1" data-volume="1"></audio>
{bgm}
{''.join(scenes)}{phead}
<div id="hdr" class="clip" data-start="0" data-duration="{DUR}" data-track-index="8"><img id="series" src="assets/img/{series}.svg"/><img id="seriesw" src="assets/img/{series}-white.svg"/><img id="sig" src="assets/img/logo-signature-black.svg"/><img id="sigw" src="assets/img/logo-signature-white.svg"/></div>
<div id="cap" class="clip" data-start="0" data-duration="{DUR}" data-track-index="9">{''.join(cap_html)}</div>
{sfx}
</div>
<script>
const tl = gsap.timeline({{paused:true}});
{chr(10).join(JS)}
{chr(10).join(cap_js)}
window.__timelines["main"] = tl;
</script></body></html>'''
