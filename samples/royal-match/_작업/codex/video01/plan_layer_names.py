from pathlib import Path
from collections import Counter
import json,re
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');d=json.loads((s/'ui-studio/designs/ux-9f500ab8.json').read_text());out=[]
for sc in d['screens']:
 counts=Counter(e['name']for e in sc['elements']);names={e['id']:e['name']for e in sc['elements']};reserved={e['name']for e in sc['elements']if counts[e['name']]==1 and'복사'not in e['name']};items=[]
 for i,e in enumerate(sc['elements']):
  n=e['name']
  if '복사'not in n and counts[n]==1:continue
  base=re.sub(r'\s*복사','',n)
  parent=names.get(e.get('parentId'))
  if parent and e['kind']in['image','text']:
   stem=re.sub(r'^(Btn_|Group_|BG_)','',parent);stem=re.sub(r'\s*복사','',stem)
   base=('Img_'if e['kind']=='image'else'Txt_')+stem+('_Art'if e['kind']=='image'else'_Label')
  v=base;idx=2
  while v in reserved:v=base+'_'+str(idx);idx+=1
  names[e['id']]=v;reserved.add(v);items.append(dict(id=e['id'],before=n,after=v))
 if items:out.append(dict(screen=sc['name'],items=items))
(s/'_작업/codex/video01/layer-name-plan.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print([(x['screen'],len(x['items']))for x in out])
