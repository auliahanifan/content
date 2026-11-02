"""Inspect existing images and rebuild the local catalog. Never edits image pixels."""
from pathlib import Path
from PIL import Image
import json,html
root=Path(__file__).resolve().parent
config=json.loads((root/'pack.json').read_text())
assets=[]
for entry in config['assets']:
 p=root/entry['file']
 with Image.open(p) as im:
  assert im.format=='PNG' and im.mode=='RGBA',(p,im.mode)
  a=im.getchannel('A');lo,hi=a.getextrema()
  assert lo==0 and hi>0,p
  fraction=a.histogram()[0]/(im.width*im.height)
  assert fraction>.05,p
  corners=[a.getpixel(q) for q in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]]
  assets.append(dict(**entry,width=im.width,height=im.height,bytes=p.stat().st_size,alphaRange=[lo,hi],cornerAlpha=corners,transparentFraction=round(fraction,4),alphaBounds=a.getbbox(),animated=False,layers='standalone-effect' if entry['file'].startswith('effects/') else 'flattened-character-and-props'))
m=dict(style=config['style'],description=config['description'],created='2026-11-02',generator='ImageGen',sourceReferences=['assets/karakter-referensi.png','assets/kepala-netral.png','assets/pixel-aulia/reactions/'],assets=assets)
(root/'manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
cards=''.join('<article><div class="tile"><img src="'+html.escape(a['file'])+'" alt="'+html.escape(a['id'])+'"></div><h2>'+html.escape(a['id'].replace('-',' '))+'</h2><p>'+str(a['width'])+' × '+str(a['height'])+' · PNG transparan</p><a href="'+html.escape(a['file'])+'" download>Unduh PNG</a></article>' for a in assets)
page='<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>__TITLE__ · Aulia</title><style>*{box-sizing:border-box}body{margin:0;padding:28px;background:#111827;color:#f9fafb;font-family:system-ui}header,main,footer{max-width:1300px;margin:0 auto 26px}p{color:#b9c5d9;line-height:1.6}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}article{background:#1f2937;border:1px solid #4b5563;border-radius:12px;padding:14px}.tile{height:370px;display:flex;align-items:center;justify-content:center;background:var(--bg,#0c1220);border-radius:8px}.tile img{max-width:100%;max-height:100%;object-fit:contain}h2{text-transform:capitalize}a{color:#93c5fd}button{padding:10px 16px;margin:4px;border:1px solid #6b7280;border-radius:6px;background:#25334b;color:white;cursor:pointer}body[data-bg="light"]{--bg:#f7f0df}body[data-bg="check"] .tile{background:repeating-conic-gradient(#bac0cb 0% 25%,#e4e7ed 0% 50%) 50%/24px 24px}@media(max-width:480px){body{padding:16px}.tile{height:310px}}</style><header><h1>__TITLE__ · Aulia</h1><p>__DESC__</p><p>4 pose/transformasi + 1 efek terpisah. PNG diam; pose belum berupa rig tubuh.</p><button data-bg="dark">Gelap</button><button data-bg="light">Terang</button><button data-bg="check">Transparansi</button></header><main>__CARDS__</main><footer><a href="README.md">Panduan</a> · <a href="manifest.json">Manifest</a> · <a href="../style-explorer.html">Bandingkan semua gaya</a></footer><script>document.querySelectorAll(\'button\').forEach(b=>b.onclick=()=>document.body.dataset.bg=b.dataset.bg)</script></html>'
page=page.replace('__TITLE__',html.escape(config['style'])).replace('__DESC__',html.escape(config['description'])).replace('__CARDS__',cards)
(root/'preview.html').write_text(page)
print(json.dumps(dict(pack=root.name,count=len(assets),transparent=True)))
