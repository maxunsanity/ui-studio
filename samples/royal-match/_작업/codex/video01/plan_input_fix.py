from pathlib import Path
import json
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');d=json.loads((s/'ui-studio/designs/ux-9f500ab8.json').read_text());out=[]
for sc in d['screens']:
 byid={x['id']:x for x in sc['elements']}
 def rect(e):
  pr=rect(byid[e['parentId']])if e.get('parentId')else[0,0,504,894]
  return[pr[0]+e['x']/100*pr[2],pr[1]+e['y']/100*pr[3],e['w']/100*pr[2],e['h']/100*pr[3]]
 def ancestor_action(e):
  if not e.get('parentId'):return False
  p=byid[e['parentId']]
  return p.get('interaction',{}).get('mode')=='action'or ancestor_action(p)
 actions=[e for e in sc['elements']if e.get('interaction',{}).get('mode')=='action']
 def overlap(a,b):return a[0]<b[0]+b[2]and b[0]<a[0]+a[2]and a[1]<b[1]+b[3]and b[1]<a[1]+a[3]
 items=[]
 for e in sc['elements']:
  if e.get('kind')not in ['text','image']or e.get('interaction',{}).get('mode')!='parent'or ancestor_action(e):continue
  r=rect(e)
  if any(overlap(r,rect(a))for a in actions):items.append(dict(id=e['id'],name=e['name']))
 if items:out.append(dict(screen=sc['name'],items=items))
(s/'_작업/codex/video01/input-fix.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print([(x['screen'],len(x['items']))for x in out]);print('total',sum(len(x['items'])for x in out))
