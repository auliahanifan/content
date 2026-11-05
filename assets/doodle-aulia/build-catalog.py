"""Validate this pack's complete inventory and rebuild its searchable gallery."""
from pathlib import Path
from collections import Counter
from PIL import Image
import json,html
root=Path(__file__).resolve().parent
config=json.loads((root/'pack.json').read_text())
assert len(config['assets'])==46
assert len({e['file'] for e in config['assets']})==46
assert len({e['id'] for e in config['assets']})==46
assert dict(Counter(e['category'] for e in config['assets']))==config['counts']
assets=[]
for entry in config['assets']:
 p=root/entry['file']
 with Image.open(p) as im:
  assert im.format=='PNG' and im.mode=='RGBA',(p,im.mode)
  alpha=im.getchannel('A');low,high=alpha.getextrema()
  fraction=alpha.histogram()[0]/(im.width*im.height)
  assert low==0 and high>0 and fraction>.05,(p,low,high,fraction)
  corners=[alpha.getpixel(q) for q in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]]
  assets.append(dict(**entry,width=im.width,height=im.height,bytes=p.stat().st_size,alphaRange=[low,high],cornerAlpha=corners,transparentFraction=round(fraction,4),alphaBounds=alpha.getbbox(),animated=False,layers='standalone-effect' if entry['category']=='effects' else 'flattened-character-and-props',sourcePose='pixel-aulia/'+entry['file']))
manifest=dict(style=config['style'],description=config['description'],version=2,created='2026-11-02',updated='2026-11-05',counts=config['counts'],generator='ImageGen',inventoryReference=config['inventoryReference'],sourceReferences=['assets/karakter-referensi.png','assets/kepala-netral.png',root.name+'/characters/netral.png'],assets=assets)
(root/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
cards=''.join('<article data-category="'+a['category']+'" data-name="'+html.escape(a['id'].replace('-',' '))+'"><div class="tile"><img loading="lazy" src="'+html.escape(a['file'])+'" alt="'+html.escape(a['id'])+'"></div><h2>'+html.escape(a['id'].replace('-',' '))+'</h2><p>'+str(a['width'])+' × '+str(a['height'])+' · PNG transparan</p><a href="'+html.escape(a['file'])+'" download>Unduh PNG</a></article>' for a in assets)
page='''<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>__TITLE__ · Aulia</title><style>*{box-sizing:border-box}body{margin:0;padding:28px;background:#111827;color:#f9fafb;font-family:system-ui}header,main,footer{max-width:1300px;margin:0 auto 26px}p{color:#b9c5d9;line-height:1.6}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}article{background:#1f2937;border:1px solid #4b5563;border-radius:12px;padding:14px}article[hidden]{display:none}.tile{height:350px;display:flex;align-items:center;justify-content:center;background:var(--bg,#0c1220);border-radius:8px}.tile img{max-width:100%;max-height:100%;object-fit:contain}h2{text-transform:capitalize}a{color:#93c5fd}button,input{padding:10px 16px;margin:4px;border:1px solid #6b7280;border-radius:6px;background:#25334b;color:white}button{cursor:pointer}button[aria-pressed="true"]{background:#365b8a}body[data-bg="light"]{--bg:#f7f0df}body[data-bg="check"] .tile{background:repeating-conic-gradient(#bac0cb 0% 25%,#e4e7ed 0% 50%) 50%/24px 24px}@media(max-width:480px){body{padding:16px}.tile{height:310px}input{max-width:100%}}</style><header><h1>__TITLE__ · Aulia</h1><p>__DESC__</p><p>46 PNG transparan: 13 pose presenter · 24 reaksi anime · 9 efek mandiri. Inventaris setara Pixel Aulia.</p><div role="group" aria-label="Latar"><button data-bg="dark">Gelap</button><button data-bg="light">Terang</button><button data-bg="check">Transparansi</button></div><div role="group" aria-label="Kategori"><button data-filter="all" aria-pressed="true">Semua</button><button data-filter="characters" aria-pressed="false">Pose presenter</button><button data-filter="reactions" aria-pressed="false">Reaksi</button><button data-filter="effects" aria-pressed="false">Efek</button></div><label>Cari aset <input id="search" type="search" placeholder="misalnya: samurai, ngopi"></label><p id="count" aria-live="polite">Menampilkan 46 aset.</p><p>PNG diam; tubuh dan properti belum berupa layer terpisah. Efek di folder effects dapat digabungkan sebagai layer mandiri.</p></header><main>__CARDS__</main><footer><a href="README.md">Panduan</a> · <a href="manifest.json">Manifest</a> · <a href="../style-explorer.html">Bandingkan semua gaya</a> · <a href="../style-archives/index.html">Unduh paket lengkap</a></footer><script>let category='all';function filter(){const q=document.querySelector('#search').value.toLowerCase().replaceAll('-',' ');document.querySelectorAll('article').forEach(a=>a.hidden=(category!=='all'&&a.dataset.category!==category)||!a.dataset.name.includes(q));document.querySelector('#count').textContent='Menampilkan '+document.querySelectorAll('article:not([hidden])').length+' aset.'}document.querySelectorAll('button[data-bg]').forEach(b=>b.onclick=()=>document.body.dataset.bg=b.dataset.bg);document.querySelectorAll('button[data-filter]').forEach(b=>b.onclick=()=>{category=b.dataset.filter;document.querySelectorAll('button[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter()});document.querySelector('#search').addEventListener('input',filter)</script></html>'''
page=page.replace('__TITLE__',html.escape(config['style'])).replace('__DESC__',html.escape(config['description'])).replace('__CARDS__',cards)
(root/'preview.html').write_text(page)
print(json.dumps(dict(pack=root.name,count=len(assets),counts=config['counts'],transparent=True)))
