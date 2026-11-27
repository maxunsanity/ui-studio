from pathlib import Path
import json
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');d=json.loads((s/'ui-studio/designs/ux-9f500ab8.json').read_text());out=[]
for sc in d['screens']:
 byid={x['id']:x for x in sc['elements']};byname={x['name']:x for x in sc['elements']}
 def rect(e):
  pr=rect(byid[e['parentId']])if e.get('parentId')else[0,0,504,894]
  return[pr[0]+e['x']/100*pr[2],pr[1]+e['y']/100*pr[3],e['w']/100*pr[2],e['h']/100*pr[3]]
 items=[]
 for e in sc['elements']:
  n=e['name']
  if not n.startswith(('Txt_','Img_')):continue
  b=byname.get('Btn_'+n[4:])
  if not b or b.get('interaction',{}).get('mode')!='action'or e.get('parentId')==b['id']:continue
  er,br=rect(e),rect(b)
  if er[0]+er[2]/2<br[0]or er[0]+er[2]/2>br[0]+br[2]or er[1]+er[3]/2<br[1]or er[1]+er[3]/2>br[1]+br[3]:continue
  items.append(dict(id=e['id'],name=n,parent=b['name'],rect=[round(er[0]-br[0],3),round(er[1]-br[1],3),round(er[2],3),round(er[3],3)],size=[br[2],br[3]]))
 if items:out.append(dict(screen=sc['name'],items=items))
(s/'_작업/codex/video01/label-bindings.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print([(x['screen'],len(x['items']))for x in out]);print(sum(len(x['items'])for x in out))
