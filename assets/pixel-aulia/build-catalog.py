"""Inspect PNGs, rebuild manifest + filterable HTML. Never edits image pixels."""
from pathlib import Path
from PIL import Image
import html
import json

root = Path(__file__).resolve().parent
catalog = {
    'characters': ['netral', 'menjelaskan', 'menunjuk', 'berpikir', 'setuju', 'menyapa', 'stop', 'laptop', 'smartphone', 'presentasi', 'mencatat', 'ngopi', 'facepalm'],
    'reactions': ['murka', 'fokus', 'kaget', 'percaya-diri', 'sedih', 'semangat', 'bingung', 'lelah', 'dapat-ide', 'tertawa', 'skeptis', 'menang', 'panik', 'malu', 'mode-jenius'],
    'effects': ['aura-emas', 'petir-biru', 'impact-ungu', 'portal-hijau', 'speedlines-merah', 'partikel-bintang'],
}
labels = {'characters': 'Pose presenter', 'reactions': 'Reaksi anime', 'effects': 'Efek terpisah'}
assets = []
for group, names in catalog.items():
    for name in names:
        path = root / group / (name + '.png')
        if not path.is_file():
            raise RuntimeError(f'Missing asset: {path}')
        with Image.open(path) as im:
            assert im.format == 'PNG', path
            assert im.mode == 'RGBA', (path, im.mode)
            alpha = im.getchannel('A')
            assert alpha.getextrema()[0] == 0 and alpha.getextrema()[1] > 0, path
            transparent = alpha.histogram()[0] / (im.width * im.height)
            assert transparent > 0.05, f'Insufficient transparent surround: {path}'
            corners = [alpha.getpixel(p) for p in [(0, 0), (im.width-1, 0), (0, im.height-1), (im.width-1, im.height-1)]]
            frame_overlay = group == 'effects' and name == 'speedlines-merah'
            # Radial frame rays intentionally reach the edges; transparent center is required.
            if frame_overlay:
                assert alpha.getpixel((im.width // 2, im.height // 2)) <= 1, f'Opaque frame center: {path}'
            else:
                assert max(corners) <= 1, f'Opaque corner: {path}: {corners}'
            layer = {'characters': 'flattened-character', 'reactions': 'flattened-character-and-effects', 'effects': 'standalone-effect'}[group]
            assets.append(dict(id=name, category=group, file=str(path.relative_to(root)), width=im.width, height=im.height, bytes=path.stat().st_size, mode=im.mode, alphaRange=list(alpha.getextrema()), cornerAlpha=corners, edgeTreatment='frame-rays-to-canvas-edge' if frame_overlay else 'transparent-corners', alphaBounds=list(alpha.getbbox()), visibleAlphaBounds=list(alpha.point(lambda x: 255 if x >= 128 else 0).getbbox()), transparentFraction=round(transparent, 4), animated=False, layers=layer))
manifest = dict(name='Pixel Aulia — Presenter & Epic Anime Library', version=3, created='2026-11-02', updated='2026-11-02', generator='ImageGen', styleReference='references/styles-3x3.png (06 Outlined)', moodReference='references/moods-3x3.png', counts={g: len(n) for g, n in catalog.items()}, assets=assets)
(root/'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
cards = ''.join(f'<article data-category="{a["category"]}"><div class="image"><img src="{html.escape(a["file"])}" alt="{html.escape(a["id"])}" loading="lazy"></div><h2>{html.escape(a["id"].replace("-", " "))}</h2><p>{labels[a["category"]]} · {a["width"]} × {a["height"]}</p><a href="{html.escape(a["file"])}" download>Unduh PNG</a></article>' for a in assets)
pose_options = ''.join(f'<option value="characters/{name}.png">{name.title()}</option>' for name in catalog['characters'])
effect_options = ''.join(f'<option value="effects/{name}.png">{name.replace("-", " ").title()}</option>' for name in catalog['effects'])
playground = '<section class="playground"><div><h2>Coba pose + efek</h2><p>Preview dua layer terpisah. Pengaturan ini tidak mengubah file PNG.</p><label>Pose <select id="pose">'+pose_options+'</select></label><label>Efek <select id="effect"><option value="">Tanpa efek</option>'+effect_options+'</select></label><label>Skala efek <input id="effect-scale" type="range" min="70" max="160" value="115"><output id="scale-value">115%</output></label></div><div class="image stage"><img id="effect-preview" alt="" hidden><img id="pose-preview" src="characters/netral.png" alt="Preview kombinasi pose dan efek"></div></section>'
page = '''<!doctype html>
<html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pixel Aulia — Asset Library</title><style>
*{box-sizing:border-box}body{margin:0;padding:32px;background:#101625;color:#edf3ff;font-family:system-ui,sans-serif}header{max-width:1300px;margin:0 auto 28px}h1{margin-bottom:8px}p{color:#aebbd2;line-height:1.6}button{padding:10px 16px;border:1px solid #75849d;border-radius:8px;background:#1d2940;color:white;cursor:pointer;margin:4px}button[aria-pressed="true"]{background:#365b8a;border-color:#a9d6ff}main{max-width:1300px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}article{padding:14px;border:1px solid #35435c;border-radius:12px;background:#182237}article[hidden]{display:none}h2{text-transform:capitalize;margin-bottom:4px}article p{font-size:13px}a{color:#a9d6ff}.image{height:360px;background-color:var(--tile,#0b1020);border-radius:8px;display:flex;align-items:center;justify-content:center}.image img{max-width:100%;max-height:100%;object-fit:contain;image-rendering:pixelated}body[data-bg="light"]{--tile:#f6efe2}body[data-bg="check"] .image{background:repeating-conic-gradient(#b9bec8 0% 25%,#e5e7ec 0% 50%) 50%/24px 24px}footer{max-width:1300px;margin:30px auto;color:#aebbd2}button:focus-visible,a:focus-visible{outline:3px solid #ffd36a}@media(max-width:480px){body{padding:16px}.image{height:320px}}
</style><header><h1>Pixel Aulia · Vol. __VERSION__</h1><p>__TOTAL__ aset PNG transparan · __POSES__ pose presenter · __REACTIONS__ reaksi anime · __EFFECTS__ efek terpisah</p>
<div role="group" aria-label="Latar preview"><button data-bg="dark" aria-pressed="true">Latar gelap</button><button data-bg="light" aria-pressed="false">Latar terang</button><button data-bg="check" aria-pressed="false">Cek transparansi</button></div>
<div role="group" aria-label="Kategori aset"><button data-filter="all" aria-pressed="true">Semua</button><button data-filter="characters" aria-pressed="false">Pose presenter</button><button data-filter="reactions" aria-pressed="false">Reaksi anime</button><button data-filter="effects" aria-pressed="false">Efek terpisah</button></div>
<p>Gabungkan pose presenter dengan efek terpisah di Remotion. Pada reaksi anime, efek sudah menyatu dengan karakter. Semua PNG masih berupa gambar diam.</p><p id="count" aria-live="polite">Menampilkan __TOTAL__ aset.</p></header>'''+playground+'''<main>'''+cards+'''</main><footer><a href="README.md">Panduan</a> · <a href="manifest.json">Manifest</a> · <a href="references/moods-3x3.png">Board mood</a></footer>
<style>.playground{max-width:1300px;margin:0 auto 24px;padding:24px;border:1px solid #35435c;border-radius:12px;display:flex;gap:30px;align-items:center;flex-wrap:wrap}.playground>div{flex:1;min-width:240px}.playground label{display:block;margin:18px 0}select{background:#1d2940;color:white;border:1px solid #75849d;border-radius:6px;padding:8px;margin-left:10px}input{vertical-align:middle;margin:0 12px}.stage{position:relative;overflow:hidden}.stage img{position:absolute;inset:0;width:100%;height:100%;max-height:100%;object-fit:contain}.stage #pose-preview{position:relative}.stage img[hidden]{display:none}</style>
<script>
document.querySelectorAll('button[data-bg]').forEach(b=>b.addEventListener('click',()=>{document.body.dataset.bg=b.dataset.bg;document.querySelectorAll('button[data-bg]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
document.querySelectorAll('button[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('article').forEach(a=>a.hidden=b.dataset.filter!=='all'&&a.dataset.category!==b.dataset.filter);document.querySelectorAll('button[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#count').textContent='Menampilkan '+document.querySelectorAll('article:not([hidden])').length+' aset.'}));
document.querySelector('#pose').addEventListener('change',e=>document.querySelector('#pose-preview').src=e.target.value);
document.querySelector('#effect').addEventListener('change',e=>{const img=document.querySelector('#effect-preview');img.hidden=!e.target.value;if(e.target.value)img.src=e.target.value});
const updateScale=()=>{const value=document.querySelector('#effect-scale').value;document.querySelector('#effect-preview').style.transform='scale('+Number(value)/100+')';document.querySelector('#scale-value').textContent=value+'%'};
document.querySelector('#effect-scale').addEventListener('input',updateScale);updateScale();
</script></html>'''
for token, value in {'__VERSION__': manifest['version'], '__TOTAL__': len(assets), '__POSES__': len(catalog['characters']), '__REACTIONS__': len(catalog['reactions']), '__EFFECTS__': len(catalog['effects'])}.items():
    page = page.replace(token, str(value))
(root/'preview.html').write_text(page)
print(json.dumps({'count': len(assets), 'transparent': True, 'categories': manifest['counts']}, indent=2))
