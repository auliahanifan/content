"""Build complete, independently extractable ZIP volumes, each below 40 MiB."""
from pathlib import Path
import hashlib,json,zipfile,html
root=Path(__file__).resolve().parent
slugs=['motion-comic-aulia','paper-cutout-aulia','bold-vector-aulia','doodle-aulia','retro-halftone-aulia']
archive=root/'style-archives';archive.mkdir(exist_ok=True)
limit=39*1024*1024
inventory=[]
# Publish only after each source inventory is complete.
master=json.loads((root/'pixel-aulia/manifest.json').read_text())
expected={a['file'] for a in master['assets']}
for slug in slugs:
 manifest=json.loads((root/slug/'manifest.json').read_text())
 assert {a['file'] for a in manifest['assets']}==expected,slug
 assert all((root/slug/p).is_file() for p in expected),slug
 files=sorted(p for p in (root/slug).rglob('*') if p.is_file())
 groups=[];group=[];size=0
 for p in files:
  n=p.stat().st_size
  assert n<limit,(p,n)
  if group and size+n>limit:groups.append(group);group=[];size=0
  group.append(p);size+=n
 if group:groups.append(group)
 volumes=[]
 for i,group in enumerate(groups,1):
  out=archive/f'{slug}-{i:02d}-of-{len(groups):02d}.zip'
  with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
   for p in group:z.write(p,p.relative_to(root))
  assert out.stat().st_size<40*1024*1024
  with zipfile.ZipFile(out) as z:assert z.testzip() is None
  volumes.append(dict(file=out.name,bytes=out.stat().st_size,sha256=hashlib.sha256(out.read_bytes()).hexdigest()))
 inventory.append(dict(style=slug,assets=46,volumes=volumes))
 # Remove outdated volumes of this style only after new ones pass validation.
 keep={v['file'] for v in volumes}
 for p in archive.glob(slug+'-*.zip'):
  if p.name not in keep:p.unlink()
(archive/'index.json').write_text(json.dumps(dict(assetsPerStyle=46,totalAssets=230,extraction='Extract all volumes of a style into the same directory; each volume is a normal ZIP.',packages=inventory),ensure_ascii=False,indent=2)+'\n')
sections=''.join('<section><h2>'+html.escape(x['style'])+'</h2><p>46 aset · '+str(len(x['volumes']))+' ZIP</p>'+''.join('<p><a download href="'+v['file']+'">'+v['file']+'</a> · '+str(round(v['bytes']/1024/1024,1))+' MiB</p>' for v in x['volumes'])+'</section>' for x in inventory)
(archive/'index.html').write_text('<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unduh Aulia Style Packs</title><style>body{max-width:1000px;margin:32px auto;padding:20px;background:#111827;color:#fff;font-family:system-ui}p{line-height:1.6}a{color:#93c5fd}section{padding:20px;margin:18px 0;background:#1f2937;border-radius:12px}h2{overflow-wrap:anywhere}</style><h1>Paket lengkap lima gaya Aulia</h1><p>Setiap gaya berisi 46 PNG transparan. Pilih gaya, unduh <strong>semua ZIP pada gaya tersebut</strong>, lalu ekstrak semuanya ke direktori yang sama. Setiap ZIP bisa diekstrak biasa; tidak perlu digabungkan secara biner. Jumlah total 230 aset.</p><p><a href="../style-explorer.html">Bandingkan gaya</a> · <a href="index.json">Inventaris & checksum SHA-256</a></p>'+sections+'</html>')
print(json.dumps({'styles':len(inventory),'assets':230,'volumes':sum(len(x['volumes']) for x in inventory)}))
