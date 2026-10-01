#!/usr/bin/env python3
"""spec.json -> index.html komposisi HyperFrames (9:16, gaya bold kreator).

Pakai:  python3 build.py spec.json [--music] [--out index.html]
Jalankan dari folder proyek HyperFrames (path aset di spec relatif ke folder itu).
Skema spec: references/spec.md. Contoh: examples/muse-spec.json.
Menulis juga timeline.json (waktu tiap segmen) di sebelah file output.
"""
import json, re, sys
from pathlib import Path

args = sys.argv[1:]
MUSIC = "--music" in args
args = [a for a in args if a != "--music"]
OUT = "index-music.html" if MUSIC else "index.html"
if "--out" in args:
    i = args.index("--out"); OUT = args[i + 1]; del args[i:i + 2]
spec = json.loads(Path(args[0]).read_text())

PAL = {"navy": "#0A1030", "ink": "#070B1E", "blue": "#1F6BFF", "yellow": "#FFE11A", "red": "#FF2D2D", "white": "#FFFFFF"}
PAL.update(spec.get("palette", {}))
FONT = spec.get("font", "Montserrat")
SRC = spec["source"]
PRE = spec.get("pre", 0)
SFXDIR = spec.get("sfx_dir", "assets/sfx")
KEYWORDS = {k.lower() for k in spec.get("keywords", [])}
W, H = 1080, 1920

# ---------------------------------------------------------------- timeline
T, clips = {}, []
t = PRE
for sg in spec["segments"]:
    a, b = sg["src"]; ps, pe = sg.get("pad", [.05, .08])
    ms = max(0, a - ps); d = (b + pe) - ms
    T[sg["id"]] = (round(t, 3), round(d, 3))
    clips.append((sg["id"], ms, d, round(t, 3), sg.get("text", ""), sg.get("caption", True) and bool(sg.get("text"))))
    t += d
TOTAL = round(t, 3)

WT = {}
for sid, ms, d, tt, text, capon in clips:
    words = text.split(); ws, we = tt + .04, tt + d - .06
    lens = [len(re.sub(r"\W", "", w)) + 1.5 for w in words]; tot = sum(lens) or 1; acc = 0; ts = []
    for l in lens:
        ts.append((ws + (we - ws) * acc / tot, ws + (we - ws) * (acc + l) / tot)); acc += l
    WT[sid] = ts

def tx(e):
    """'s4' mulai, 's4.end', 's4.w3' (kata ke-3), 'total', angka, + offset: 's4.end-0.2'."""
    if isinstance(e, (int, float)): return float(e)
    m = re.match(r"^([A-Za-z_]\w*)(?:\.(start|end|w(\d+)))?\s*([+-]\s*\d*\.?\d+)?$", e.strip())
    if not m: raise SystemExit(f"ekspresi waktu salah: {e!r}")
    sid, part, wi, off = m.groups()
    if sid == "total": base = TOTAL
    elif part == "end": base = T[sid][0] + T[sid][1]
    elif wi is not None: base = WT[sid][int(wi)][0]
    else: base = T[sid][0]
    return round(base + (float(off.replace(" ", "")) if off else 0), 3)

# ---------------------------------------------------------------- collectors
vid, aud, over, cap, bgs, J = [], [], [], [], [], []
sfx = []
def SFX(f, t0, vol, dur, ms=0): sfx.append((f, max(0, t0), vol, dur, ms))
def clipdiv(id_, t0, t1, inner, cls, track):
    over.append(f'<div id="{id_}" class="clip {cls}" data-start="{t0:.3f}" data-duration="{max(.1, t1 - t0):.3f}" data-track-index="{track}">{inner}</div>')

grade = SRC.get("grade")
gattr = f" data-color-grading='{json.dumps(grade)}'" if grade else ""
for i, (sid, ms, d, tt, text, capon) in enumerate(clips):
    vid.append(f'<div class="vz" id="vz-{sid}"><div class="vp" id="vp-{sid}"><video id="v-{sid}" class="clip vid" src="{SRC["video"]}" '
               f'data-start="{tt:.3f}" data-duration="{d:.3f}" data-media-start="{ms:.3f}" data-track-index="0"{gattr} muted playsinline></video></div></div>')
    aud.append(f'<audio id="a-{sid}" src="{SRC["audio"]}" data-start="{tt:.3f}" data-duration="{d:.3f}" data-media-start="{ms:.3f}" data-track-index="10" data-volume="1"></audio>')
    z0, z1 = (1.02, 1.10) if i % 2 == 0 else (1.15, 1.24)
    J.append(f'tl.fromTo("#vz-{sid}", {{scale:{z0}}}, {{scale:{z1}, duration:{d:.3f}, ease:"none"}}, {tt:.3f});')
    J.append(f'tl.fromTo("#vp-{sid}", {{scale:1.07}}, {{scale:1, duration:.22, ease:"power2.out"}}, {tt:.3f});')

# ---------------------------------------------------------------- captions
for sid, ms, d, tt, text, capon in clips:
    if not capon: continue
    words = text.split(); we = tt + d - .06; times = WT[sid]
    chunks, cur = [], []
    for idx, w in enumerate(words):
        cur.append(idx)
        if w[-1] in ".,:?" or len(cur) == 3: chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    if len(chunks) > 1 and len(chunks[-1]) == 1 and len(chunks[-2]) <= 2 and words[chunks[-2][-1]][-1] not in ".:?":
        chunks[-2] += chunks.pop()
    for ci, ch in enumerate(chunks):
        c0 = times[ch[0]][0]; c1 = times[chunks[ci + 1][0]][0] if ci + 1 < len(chunks) else we + .06
        cid = f"cap-{sid}-{ci}"
        spans = "".join(f'<span class="w" id="{cid}-w{k}">{words[k]}</span> ' for k in ch)
        cap.append(f'<div id="{cid}" class="clip cap" data-start="{c0:.3f}" data-duration="{c1 - c0:.3f}" data-track-index="20"><div class="cap-in" id="{cid}-in">{spans}</div></div>')
        J.append(f'tl.fromTo("#{cid}-in", {{scale:.8, y:18}}, {{scale:1, y:0, duration:.12, ease:"back.out(2.4)"}}, {c0:.3f});')
        for k in ch:
            key = re.sub(r"[^\w]", "", words[k]).lower() in KEYWORDS
            J.append(f'tl.to("#{cid}-w{k}", {{color:"{PAL["yellow"]}", duration:.001}}, {times[k][0]:.3f});')
            if key:
                J.append(f'tl.to("#{cid}-w{k}", {{scale:1.14, duration:.1, ease:"back.out(3)"}}, {times[k][0]:.3f});')
                J.append(f'tl.to("#{cid}-w{k}", {{scale:1, duration:.15}}, {times[k][0] + .22:.3f});')
            J.append(f'tl.to("#{cid}-w{k}", {{color:"#FFFFFF", duration:.001}}, {times[k][1]:.3f});')

# ---------------------------------------------------------------- efek dasar
_n = [0]
def uid(p): _n[0] += 1; return f"{p}{_n[0]}"

def punch(sid_expr, amt=1.10):
    t0 = tx(sid_expr); sid = re.match(r"^\w+", sid_expr).group(0)
    t0 = max(t0, T[sid][0] + .3)
    J.append(f'tl.to("#vp-{sid}", {{scale:{amt}, duration:.08, ease:"power2.out"}}, {t0:.3f});')
    J.append(f'tl.to("#vp-{sid}", {{scale:1, duration:.3, ease:"power2.inOut"}}, {t0 + .08:.3f});')

def wipe(t0, color=None, whoosh=True):
    id_ = uid("wp"); color = color or PAL["yellow"]
    clipdiv(id_, t0, t0 + .5, f'<div class="wipe-in" id="{id_}-in" style="background:{color}"></div>', "wipew", 30)
    J.append(f'tl.fromTo("#{id_}-in", {{xPercent:-130}}, {{xPercent:130, duration:.42, ease:"power3.inOut"}}, {t0:.3f});')
    if whoosh: SFX("whoosh", t0 - .02, .75, .6)

def shake(t0, amp=14, n=5):
    J.append(f'tl.to("#world", {{x:{amp}, y:{-amp * .6:.0f}, duration:.04, yoyo:true, repeat:{n}, ease:"none"}}, {t0:.3f});')
    J.append(f'tl.set("#world", {{x:0, y:0}}, {t0 + .04 * (n + 1) + .02:.3f});')

def flash(t0, color="#fff", dur=.18, peak=.9):
    id_ = uid("fl")
    clipdiv(id_, t0, t0 + dur + .05, f'<div class="flash-in" id="{id_}-in" style="background:{color}"></div>', "flashw", 31)
    J.append(f'tl.fromTo("#{id_}-in", {{opacity:{peak}}}, {{opacity:0, duration:{dur}, ease:"power2.out"}}, {t0:.3f});')

def sticker(t0, t1, html, x, y, rot=0, pop=True):
    id_ = uid("st")
    clipdiv(id_, t0, t1, f'<div class="st-in" id="{id_}-in" style="left:{x}px;top:{y}px">{html}</div>', "stw", 7)
    J.append(f'tl.fromTo("#{id_}-in", {{scale:0, rotation:{rot - 28}}}, {{scale:1, rotation:{rot}, duration:.3, ease:"back.out(2.4)"}}, {t0:.3f});')
    J.append(f'tl.to("#{id_}-in", {{y:-10, duration:.45, yoyo:true, repeat:3, ease:"sine.inOut"}}, {t0 + .3:.3f});')
    J.append(f'tl.to("#{id_}-in", {{scale:0, duration:.14, ease:"power2.in"}}, {t1 - .14:.3f});')
    if pop: SFX("pop", t0, .8, .6)

def chip(t0, t1, text, color=None, pos="low"):
    id_ = uid("ch"); st = f' style="background:{color}"' if color else ""
    clipdiv(id_, t0, t1, f'<div class="chip-in" id="{id_}-in"{st}>{text}</div>', f"chip {pos}", 8)
    J.append(f'tl.fromTo("#{id_}-in", {{opacity:0, y:-26, scale:.85}}, {{opacity:1, y:0, scale:1, duration:.28, ease:"back.out(2)"}}, {t0:.3f});')
    J.append(f'tl.to("#{id_}-in", {{opacity:0, duration:.14}}, {t1 - .14:.3f});')
    SFX("pop", t0, .8, .6)

def stamp(t0, t1, text):
    id_ = uid("sp")
    over.append(f'<div id="{id_}" class="clip stampw" data-start="{t0:.3f}" data-duration="{t1 - t0:.3f}" data-track-index="6"><div class="stamp-in" id="{id_}-in">{text}</div></div>')
    J.append(f'tl.fromTo("#{id_}-in", {{scale:3, opacity:0, rotation:-22}}, {{scale:1, opacity:1, rotation:-8, duration:.16, ease:"power4.in"}}, {t0:.3f});')
    shake(t0 + .14, 20, 7); flash(t0 + .14, PAL["red"], .3, .55); SFX("impact", t0 + .14, .7, 1.4)

STICKERS = {  # kind -> html
    "logo": lambda o: f'<div class="logo-bub"><img src="{o["img"]}"></div>',
    "emoji": lambda o: f'<div class="emo{" big" if o.get("big") else ""}">{o["emoji"]}</div>',
    "ai": lambda o: f'<div class="ai-bub">{o["text"]}</div>',
    "qmark": lambda o: f'<div class="qmark">{o.get("text", "?")}</div>',
    "sym": lambda o: f'<div class="ne">{o["text"]}</div>',
    "word": lambda o: f'<div class="word-bub">{("<img src=" + chr(34) + o["img"] + chr(34) + ">") if o.get("img") else ""}{o.get("text", "")}</div>',
    "bubble": lambda o: f'<div class="bubble"><div class="bt">{o["text"]}</div></div>',
    "html": lambda o: o["html"],
}

# ---------------------------------------------------------------- hook (split screen)
HOOKEND = 0
hk = spec.get("hook")
if hk:
    HOOKEND = tx(hk["until"] + ".end")
    def icons(lst):
        o = ""
        for it in lst:
            if it.get("img"): o += f'<img src="{it["img"]}" class="hk-ic">'
            if it.get("text"): o += f'<span class="hk-tx{" b" if it.get("blue") else ""}">{it["text"]}</span>'
        return o
    top, bot = hk["top"], hk["bottom"]
    html = f'''
<div class="hp top" id="hkTop"><div class="hk-logos" id="hkLogos">{icons(top.get("icons", []))}</div>
  <div class="hk-big" id="hkKat">{top["title"]}</div><div class="hk-sub" id="hkKatSub">{top["sub"]}</div></div>
<div class="hp bot" id="hkBot"><div class="hk-big red" id="hkNya">{bot["title"]}</div><div class="hk-sub w" id="hkNyaSub">{bot["sub"]}</div>
  <div class="hk-shot" id="hkShot"><img src="{bot["image"]}"></div></div>
<div class="vs" id="hkVs">{hk.get("vs", "VS")}</div>
<div class="hk-kin" id="hkKin">{hk["kinetic"]["text"]}</div><div class="hk-stamp" id="hkStamp">{hk["stamp"]["text"]}</div>'''
    clipdiv("hk", 0, HOOKEND, html, "hook", 3)
    H1, H2 = tx(hk["kinetic"]["at"]), tx(hk["stamp"]["at"])
    J += [
     'tl.fromTo("#hkTop", {y:-960}, {y:0, duration:.4, ease:"power4.out"}, 0);',
     'tl.fromTo("#hkBot", {y:960}, {y:0, duration:.4, ease:"power4.out"}, .22);',
     'tl.fromTo("#hkLogos", {scale:0, rotation:-12}, {scale:1, rotation:-3, duration:.35, ease:"back.out(2.2)"}, .35);',
     'tl.fromTo("#hkKat", {scale:2.4, opacity:0}, {scale:1, opacity:1, duration:.22, ease:"power4.in"}, .55);',
     'tl.fromTo("#hkKatSub", {y:40, opacity:0}, {y:0, opacity:1, duration:.3, ease:"power3.out"}, .8);',
     'tl.fromTo("#hkVs", {scale:0, rotation:-360}, {scale:1, rotation:0, duration:.45, ease:"back.out(2)"}, .85);',
     'tl.fromTo("#hkNya", {scale:2.4, opacity:0}, {scale:1, opacity:1, duration:.22, ease:"power4.in"}, 1.05);',
     'tl.fromTo("#hkNyaSub", {y:40, opacity:0}, {y:0, opacity:1, duration:.3, ease:"power3.out"}, 1.3);',
     'tl.fromTo("#hkShot", {scale:1.4, opacity:0, rotation:6}, {scale:1, opacity:1, rotation:-2, duration:.4, ease:"back.out(1.6)"}, 1.35);',
     f'tl.fromTo("#hkKin", {{scale:.5, opacity:0}}, {{scale:1, opacity:1, duration:.14, ease:"back.out(3)"}}, {H1 + .02:.3f});',
     f'tl.to("#hkKin", {{opacity:0, duration:.1}}, {H2 - .08:.3f});',
     f'tl.fromTo("#hkStamp", {{scale:3.2, opacity:0, rotation:-22}}, {{scale:1, opacity:1, rotation:-7, duration:.16, ease:"power4.in"}}, {H2:.3f});',
    ]
    shake(H2 + .14, 20, 7); flash(H2 + .14, "#fff", .22, .85)
    SFX("riser", .5, .35, H2 - .5 + .15, 10 - (H2 - .5 + .15)); SFX("impact", H2 + .14, .6, 1.4)
    wipe(HOOKEND - .22, PAL["yellow"], False); SFX("glitch", HOOKEND - .2, .35, .6)
    for tt_ in (.55, 1.05): SFX("pop", tt_, .8, .6)
    SFX("whoosh", 0, .7, .6); SFX("whoosh", .2, .6, .6)

# ---------------------------------------------------------------- takeover
S2W = 980
def takeover(o):
    id_ = o.get("id") or uid("tk"); t0, t1 = tx(o["from"]), tx(o["to"])
    inner = f'<div class="tk-label">{o["label"]}</div>' if o.get("label") else ""
    post = []
    for k, it in enumerate(o["items"]):
        kind = it["kind"]; iid = f"{id_}-{k}"
        if kind == "card":
            from PIL import Image
            iw, ih = Image.open(it["image"]).size; sc = S2W / iw
            extra = ""
            for hi, hl in enumerate(it.get("highlights", [])):
                x, y, w, h = hl["box"]
                extra += f'<div class="hl" id="{iid}-h{hi}" style="left:{x * sc:.0f}px;top:{y * sc:.0f}px;width:{w * sc:.0f}px;height:{h * sc:.0f}px"></div>'
                post.append(f'tl.fromTo("#{iid}-h{hi}", {{scaleX:0}}, {{scaleX:1, duration:.3, ease:"power2.out"}}, {tx(hl["at"]):.3f});')
            el = it.get("ellipse")
            if el:
                extra += (f'<svg class="ell" viewBox="0 0 {iw} {ih}"><ellipse cx="{el["cx"]}" cy="{el["cy"]}" rx="{el["rx"]}" ry="{el["ry"]}" fill="none" '
                          f'stroke="{PAL["red"]}" stroke-width="{el.get("w", 10)}" stroke-dasharray="3000" stroke-dashoffset="3000" id="{iid}-e"/></svg>')
                post.append(f'tl.to("#{iid}-e", {{strokeDashoffset:0, duration:.5, ease:"power2.out"}}, {tx(el["at"]):.3f});')
            tilt = it.get("tilt", 0)
            inner += f'<div class="card{" photo" if it.get("photo") else ""}" id="{iid}" style="transform:rotate({tilt}deg)"><img src="{it["image"]}">{extra}</div>'
            post.append(f'tl.fromTo("#{iid}", {{scale:.9, rotation:{tilt - 6}}}, {{scale:1, rotation:{tilt}, duration:.45, ease:"back.out(1.6)"}}, {t0 + .1:.3f});')
            if it.get("zoom", True):
                post.append(f'tl.to("#{iid}", {{scale:1.05, duration:{max(.2, t1 - t0 - .6):.3f}, ease:"none"}}, {t0 + .55:.3f});')
        elif kind == "logos":
            inner += '<div class="logos">' + "".join(f'<div class="lg" id="{iid}-{j}"><img src="{lg["img"]}"></div>' for j, lg in enumerate(it["items"])) + '</div>'
            for j, lg in enumerate(it["items"]):
                a = tx(lg["at"]); sgn = -30 if j % 2 == 0 else 30
                post.append(f'tl.fromTo("#{iid}-{j}", {{scale:0, rotation:{sgn}}}, {{scale:1, rotation:0, duration:.35, ease:"back.out(2.5)"}}, {a:.3f});')
                SFX("pop", a, .8, .6)
        elif kind == "pills":
            inner += '<div class="pills">'
            for j, p in enumerate(it["items"]):
                if p.get("arrow"): inner += f'<div class="arrow" id="{iid}-a{j}" style="opacity:0">&rarr;</div>'; post.append(f'tl.to("#{iid}-a{j}", {{opacity:1, duration:.1}}, {tx(p["at"]) + .1:.3f});')
                inner += f'<div class="pill {p.get("style", "blue")}{" big" if p.get("big") else ""}" id="{iid}-{j}">{p["text"]}</div>'
                post.append(f'tl.fromTo("#{iid}-{j}", {{scale:0}}, {{scale:1, duration:.3, ease:"back.out(2.5)"}}, {tx(p["at"]):.3f});')
                SFX("pop" if j == 0 else "ding", tx(p["at"]), .8 if j == 0 else .5, .6 if j == 0 else 1.0)
            inner += '</div>'
        elif kind == "rows":
            inner += '<div class="rows">'
            for j, r in enumerate(it["items"]):
                th = f'<img class="thumb" src="{r["thumb"]}">' if r.get("thumb") else f'<div class="thumb emo-t">{r.get("emoji", "")}</div>'
                inner += f'<div class="row" id="{iid}-{j}"><div class="num">{j + 1}</div><div class="rt">{r["text"]}</div>{th}</div>'
                a = tx(r["at"]) - .02
                post.append(f'tl.fromTo("#{iid}-{j}", {{opacity:0, x:-220, rotation:-3}}, {{opacity:1, x:0, rotation:0, duration:.4, ease:"back.out(1.4)"}}, {a:.3f});')
                SFX("whoosh", a - .02, .5, .6); SFX("ding", a + .27, .45, 1.0)
    clipdiv(id_, t0, t1, f'<div class="stage" id="{id_}-st">{inner}</div><div class="dots"></div>', "take", 2)
    J.append(f'tl.fromTo("#{id_}-st", {{y:70, opacity:0}}, {{y:0, opacity:1, duration:.3, ease:"power3.out"}}, {t0 + .08:.3f});')
    J.extend(post)
    if o.get("wipe", True): wipe(t0 - .1)

# ---------------------------------------------------------------- overlays (urutan di spec)
for o in spec.get("overlays", []):
    ty = o["type"]
    if ty == "takeover": takeover(o)
    elif ty == "sticker": sticker(tx(o["at"]), tx(o["until"]), STICKERS[o.get("kind", "html")](o), o["x"], o["y"], o.get("rot", 0), o.get("pop", True))
    elif ty == "chip": chip(tx(o["at"]), tx(o["until"]), o["text"], o.get("color"), o.get("pos", "low"))
    elif ty == "stamp": stamp(tx(o["at"]), tx(o["until"]), o["text"])
    elif ty == "punch": punch(o["at"], o.get("amt", 1.10))
    elif ty == "wipe": wipe(tx(o["at"]), o.get("color"), o.get("whoosh", True))
    elif ty == "shake": shake(tx(o["at"]), o.get("amp", 14), o.get("n", 5))
    elif ty == "flash": flash(tx(o["at"]), o.get("color", "#fff"), o.get("dur", .18), o.get("peak", .9))
    elif ty == "sfx": SFX(o["file"], tx(o["at"]), o.get("vol", .8), o.get("dur", 1.0), o.get("ms", 0))
    else: raise SystemExit(f"tipe overlay tidak dikenal: {ty}")

# ---------------------------------------------------------------- latar di belakang cutout
bgs.append(f'<div id="bgBase" class="clip bgb" data-start="0" data-duration="{TOTAL:.3f}" data-track-index="1"><div class="bg-glow" id="bgGlow"></div><div class="dots2"></div>'
           + "".join(f'<div class="ptc" id="ptc{i}" style="left:{(i * 83) % 1000}px;top:{(i * 197) % 1800 + 60}px;width:{10 + (i % 4) * 8}px;height:{10 + (i % 4) * 8}px"></div>' for i in range(14)) + '</div>')
for i in range(14):
    J.append(f'tl.fromTo("#ptc{i}", {{y:0, opacity:0}}, {{y:{-140 - (i % 5) * 60}, opacity:.5, duration:{3 + (i % 4)}, ease:"sine.inOut", yoyo:true, repeat:{int(TOTAL / (3 + (i % 4))) // 2 + 1}}}, {(i * .37) % 3:.3f});')
J.append(f'tl.fromTo("#bgGlow", {{scale:.9}}, {{scale:1.12, duration:{TOTAL:.3f}, ease:"none"}}, 0);')
for k, b in enumerate(spec.get("backgrounds", [])):
    id_ = f"bgS{k}"; t0, t1 = tx(b["from"]), tx(b["to"])
    img = f'<img class="bg-img" src="{b["image"]}">' if b.get("image") else ""
    bgs.append(f'<div id="{id_}" class="clip bgs" data-start="{t0:.3f}" data-duration="{t1 - t0:.3f}" data-track-index="2"><div class="bg-in" id="{id_}-in">{img}'
               f'<div class="bg-tint" style="background:{b.get("tint", "rgba(10,16,48,.5)")}"></div>'
               f'<div class="bg-word" id="{id_}-w" style="left:{b.get("x", -40)}px;top:{b.get("y", 500)}px;font-size:{b.get("size", 320)}px;transform:rotate({b.get("rot", -6)}deg)">{b["word"]}</div></div></div>')
    J.append(f'tl.fromTo("#{id_}-in", {{opacity:0}}, {{opacity:1, duration:.25}}, {t0:.3f});')
    J.append(f'tl.fromTo("#{id_}-w", {{x:90}}, {{x:-90, duration:{t1 - t0:.3f}, ease:"none"}}, {t0:.3f});')
    J.append(f'tl.to("#{id_}-in", {{opacity:0, duration:.15}}, {t1 - .15:.3f});')

# ---------------------------------------------------------------- fx global
over.append(f'<div id="bar" class="clip barw" data-start="0" data-duration="{TOTAL:.3f}" data-track-index="40"><div class="bar-in" id="bar-in"></div></div>')
J.append(f'tl.fromTo("#bar-in", {{scaleX:0}}, {{scaleX:1, duration:{TOTAL:.3f}, ease:"none"}}, 0);')
over.append(f'<div id="grain" class="clip grainw" data-start="0" data-duration="{TOTAL:.3f}" data-track-index="41"><div class="grain-in" id="grain-in"></div></div>')
J.append(f'tl.fromTo("#grain-in", {{x:0, y:0}}, {{x:-300, y:-240, duration:.5, ease:"steps(5)", repeat:{int(TOTAL / .5) + 1}}}, 0);')
over.append(f'<div id="vig" class="clip vigw" data-start="0" data-duration="{TOTAL:.3f}" data-track-index="42"></div>')

# ---------------------------------------------------------------- css
CSS = (Path(__file__).parent / "style.css").read_text()
for k, v in PAL.items(): CSS = CSS.replace(f"@{k}@", v)
CSS = CSS.replace("@font@", FONT)

music = ""
if MUSIC:
    m = spec.get("music", {})
    music = (f'<audio id="bgm" src="{m.get("file", "assets/bgm.mp3")}" data-start="0" data-duration="{TOTAL:.3f}" '
             f'data-media-start="0" data-track-index="11" data-volume="1"></audio>')
sfx_html = [f'<audio id="sfx{k}" src="{SFXDIR}/{f}.mp3" data-start="{t0:.3f}" data-duration="{dur:.3f}" data-media-start="{ms:.3f}" '
            f'data-track-index="{12 + k % 6}" data-volume="{vol}"></audio>' for k, (f, t0, vol, dur, ms) in enumerate(sfx)]

html = f"""<!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width={W}, height={H}" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>{CSS}</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL:.3f}" data-width="{W}" data-height="{H}">
<div id="world">
{chr(10).join(bgs)}
{chr(10).join(vid)}
{chr(10).join(over)}
{chr(10).join(cap)}
</div>
{chr(10).join(aud)}
{music}
{chr(10).join(sfx_html)}
</div>
<script>
const tl = gsap.timeline({{ paused: true }});
{chr(10).join(J)}
window.__timelines["main"] = tl;
tl.seek(0);
</script>
</body>
</html>
"""
Path(OUT).write_text(html)
Path(OUT).with_name("timeline.json").write_text(json.dumps({"T": T, "TOTAL": TOTAL, "PRE": PRE,
    "segs": [[c[0], c[1], c[2], c[3]] for c in clips]}))
print(f"total {TOTAL}s | {len(clips)} segmen | {len(sfx)} sfx | {len(over)} overlay -> {OUT}")
