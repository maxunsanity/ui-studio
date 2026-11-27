from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib
R=Path('/Users/max/projest_max/ui-studio');B=R/'docs/reference/monopoly-go/video-analysis-20261117';P=R/'src/tools/uxStudio/guide/reference/monopoly-go-video-20261117';checks=[]
def ck(name,ok):
 checks.append({'name':name,'passed':bool(ok)});assert ok,name
j=json.loads((B/'ui-inventory.json').read_text());ids={s['id'] for s in j['screens']};states=[z for s in j['screens'] for z in s['states']]
ck('nine source videos',len(j['sources'])==9);ck('44 video records',len(j['screens'])==44);ck('84 state records',len(states)==84);ck('31 family candidates',len(j['families'])==31)
for s in j['sources']:ck('source untouched '+s['id'],hashlib.sha256(Path(s['path']).read_bytes()).hexdigest()==s['sha256'])
for s in j['screens']:
 v=next(x for x in j['sources'] if x['id']==s['videoId'])
 for z in s['states']:
  ck(z['id']+' source time',0<=z['timeSeconds']<=v['durationSeconds'])
  for k in ['thumbnail','fullFrame']:ck(z['id']+' '+k,(B/z[k]).is_file())
cs=json.loads((B/'ui-connections.json').read_text())['connections']
for c in cs:
 for k in ['fromScreenId','toScreenId']:
  if c.get(k):ck(c['id']+' '+k,c[k] in ids)
 ck(c['id']+' unknown runtime target',c['runtimeTarget'] is None)
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.urls=[];self.images=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if t=='img':self.images.append(a['src']);self.urls.append(a['src'])
  if t=='a' and a.get('href'):self.urls.append(a['href'])
for b in [B,P]:
 p=Parser();p.feed((b/'index.html').read_text());ck(str(b)+' unique HTML IDs',len(p.ids)==len(set(p.ids)))
 for u in p.urls:
  q=urlsplit(u)
  if q.scheme or u.startswith('/'):continue
  if u.startswith('#'):ck('HTML anchor '+u,u[1:] in p.ids)
  else:ck('HTML target '+u,(b/unquote(q.path)).is_file())
 ck('HTML 95 images',len(p.images)==95)
man=json.loads((P/'public-manifest.json').read_text())
for n,m in man['files'].items():ck('public hash '+n,hashlib.sha256((P/n).read_bytes()).hexdigest()==m['publicSHA256'])
idx=json.loads((R/'src/tools/uxStudio/guide/index.json').read_text());ck('guide .23',idx['version']=='2026-11-17.23');ck('guide ten entries',len(idx['sections'])==10)
for x in idx['sections']:ck('guide target '+x['id'],(R/'src/tools/uxStudio/guide'/x['file']).is_file())
d=json.loads((R/'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json').read_text());old=json.loads((R/'docs/planning/_backup/20261117_단이/1305_jail11/ux-gjs-0d80d7fe.json').read_text());ck('saved r284',d['revision']==284)
for s in old['screens']:ck('existing screen '+s['name'],s==next(x for x in d['screens'] if x['id']==s['id']))
ck('existing twenty edges',old['transitions']==d['transitions']);ck('11 screens',len(d['screens'])==11);ck('920 parts',sum(len(s['elements']) for s in d['screens'])==920)
qa=json.loads((R/'docs/evidence/20261117-jail11/device-qa-r284.json').read_text())
for v in [qa['phone390'],qa['phone430']]:
 k=v['root']['width']/551
 for name,w,h in [('card',332,296),('roll',230,220),('remaining',360,36)]:
  x=v['nodes'][name];ck('uniform '+v['profile']+' '+name,abs(x['w']-w*k)<.08 and abs(x['h']-h*k)<.08)
ck('device image errors zero',not qa['phone390']['failed'] and not qa['phone430']['failed'])
out={'result':'pass','checksPassed':len(checks),'failed':0,'checks':checks,'scope':'local/reference/public-bundle/model-preservation/device-measurement; not whole-game or final visual approval'}
(R/'docs/evidence/20261117-video-inventory/final-verification.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(len(checks),'checks PASS; source9 unchanged; HTML95 targets; guide10; r28411screens920parts20edges preserved')
