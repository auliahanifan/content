"""Inspect existing PNGs and rebuild manifest + HTML. Never edits image pixels."""
from pathlib import Path
from PIL import Image
import json, html
root = Path(__file__).resolve().parent
names = ['netral','murka','fokus','kaget','percaya-diri','sedih','semangat','bingung','lelah','dapat-ide']
assets = []
for name in names:
    path = root / ('characters' if name == 'netral' else 'reactions') / (name + '.png')
    if not path.is_file():
        raise RuntimeError(f'Missing asset: {path}')
    with Image.open(path) as im:
        assert im.format == 'PNG', path
        assert im.mode == 'RGBA', (path, im.mode)
        alpha = im.getchannel('A')
        assert alpha.getextrema()[0] == 0 and alpha.getextrema()[1] > 0, path
        assert all(alpha.getpixel(p) <= 1 for p in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]), f'Opaque corner: {path}'
        assets.append(dict(id=name, file=str(path.relative_to(root)), width=im.width, height=im.height, bytes=path.stat().st_size, mode=im.mode, alphaRange=list(alpha.getextrema()), alphaBounds=list(alpha.getbbox()), animated=False, layers='flattened-character-and-effects' if name != 'netral' else 'flattened-character'))
manifest = dict(name='Pixel Aulia — Epic Anime Reactions', version=1, created='2026-11-02', generator='ImageGen', styleReference='references/styles-3x3.png (06 Outlined)', moodReference='references/moods-3x3.png', assets=assets)
(root/'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
cards=''.join(f'<article><div class="image"><img src="{html.escape(a["file"])}" alt="{html.escape(a["id"])}" loading="lazy"></div><h2>{html.escape(a["id"].replace("-"," "))}</h2><p>{a["width"]} × {a["height"]} · PNG RGBA</p><a href="{html.escape(a["file"])}" download>Unduh PNG</a></article>' for a in assets)
page='''<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pixel Aulia — Asset Library</title><style>
*{box-sizing:border-box}body{margin:0;padding:32px;background:#101625;color:#edf3ff;font-family:system-ui,sans-serif}header{max-width:1100px;margin:0 auto 28px}h1{margin-bottom:8px}p{color:#aebbd2}button{padding:10px 16px;border:1px solid #75849d;border-radius:8px;background:#1d2940;color:white;cursor:pointer;margin:4px}main{max-width:1300px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}article{padding:14px;border:1px solid #35435c;border-radius:12px;background:#182237}h2{text-transform:capitalize;margin-bottom:4px}article p{font-size:13px}a{color:#a9d6ff}.image{height:360px;background-color:var(--tile,#0b1020);border-radius:8px;display:flex;align-items:center;justify-content:center}.image img{max-width:100%;max-height:100%;object-fit:contain;image-rendering:pixelated}body[data-bg="light"]{--tile:#f6efe2}body[data-bg="check"] .image{background:repeating-conic-gradient(#b9bec8 0% 25%,#e5e7ec 0% 50%) 50%/24px 24px}footer{max-width:1100px;margin:30px auto;color:#aebbd2}button:focus-visible,a:focus-visible{outline:3px solid #ffd36a}
</style><header><h1>Pixel Aulia</h1><p>Epic Anime Reactions · 10 aset transparan · acuan 06 Outlined</p><button data-bg="dark">Latar gelap</button><button data-bg="light">Latar terang</button><button data-bg="check">Cek transparansi</button><p>PNG diam. Efek menyatu dengan karakter; ukuran figur dapat berbeda antarpose.</p></header><main>'''+cards+'''</main><footer><a href="README.md">Panduan</a> · <a href="manifest.json">Manifest</a> · <a href="references/moods-3x3.png">Board mood</a></footer><script>document.querySelectorAll('button[data-bg]').forEach(b=>b.addEventListener('click',()=>document.body.dataset.bg=b.dataset.bg))</script></html>'''
(root/'preview.html').write_text(page)
print(json.dumps({'count':len(assets),'transparent':True,'assets':[{'id':a['id'],'size':[a['width'],a['height']]} for a in assets]},indent=2))
