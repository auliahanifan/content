import json,glob,os
f=max(glob.glob('.hyperframes/artifacts/checks/*.json'),key=os.path.getmtime);d=json.load(open(f))
out=set()
def walk(x):
  if isinstance(x,dict):
    c=str(x.get('code') or x.get('rule'))
    if x.get('severity')=='error' or (x.get('severity')=='warning' and c in('contrast_aa_failure','text_below_floor','content_overlap','text_occluded')):
      out.add(f"{x.get('severity')} {c} | {str(x.get('message'))[:170]} | {x.get('selector')} {x.get('time')}")
    for v in x.values(): walk(v)
  elif isinstance(x,list):
    for v in x: walk(v)
walk(d); print('\n'.join(sorted(out)) or 'bersih')
