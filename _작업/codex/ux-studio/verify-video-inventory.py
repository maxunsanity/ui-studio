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
 ck('HTML 98 historical plus2 new images',len(p.images)==100)
man=json.loads((P/'public-manifest.json').read_text())
for n,m in man['files'].items():ck('public hash '+n,hashlib.sha256((P/n).read_bytes()).hexdigest()==m['publicSHA256'])
idx=json.loads((R/'src/tools/uxStudio/guide/index.json').read_text());ck('guide .30',idx['version']=='2026-11-17.30');ck('guide twelve entries',len(idx['sections'])==12)
for x in idx['sections']:ck('guide target '+x['id'],(R/'src/tools/uxStudio/guide'/x['file']).is_file())
d=json.loads((R/'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json').read_text());old=json.loads((R/'docs/planning/_backup/20261117_단이/1305_jail11/ux-gjs-0d80d7fe.json').read_text());progress=json.loads((B/'implementation-progress.json').read_text());ck('saved current revision',d['revision']==progress['currentRevision'])
for s in old['screens']:
 if s['id']!=old['entryScreen']:ck('existing screen '+s['name'],s==next(x for x in d['screens'] if x['id']==s['id']))
 else:ck('Main original IDs preserved after requested rework',{e['id'] for e in s['elements']}<={e['id'] for e in next(x for x in d['screens'] if x['id']==s['id'])['elements']})
ck('existing twenty edges preserved',old['transitions']==d['transitions'][:len(old['transitions'])]);ck('current screens',len(d['screens'])==progress['screens']);ck('current parts',sum(len(s['elements']) for s in d['screens'])==progress['parts'])
qa=json.loads((R/'docs/evidence/20261117-overlay-base-visibility/device-and-preservation-qa.json').read_text())
for check in qa['checks']:ck('uniform '+check['device']+' '+check['id'],check['passed'])
ck('actual four device previews',len(qa['measurements'])>=4);ck('24 numeric width height pairs',qa['uniformPairs']==24)
for name in ['jail390','jail430','bail390','bail430']:
 x=qa['measurements'][name];ck(name+' no image errors',x['failed']==0 and x['loading']==0);ck(name+'14 hidden and board visible',x['hiddenRoots']==14 and x['worldVisible']=='visible')
go=json.loads((R/'docs/evidence/20261117-button-depth-bottom/r299-native-qa.json').read_text())
for x in go['checks']:ck('GO actual '+x['name'],x['passed'])
ck('historical r299 native 34 checks',go['checksPassed']==34)
latest=json.loads((R/'docs/evidence/20261117-two-point-small-press/native-r300-qa.json').read_text())
for x in latest['checks']:ck('r300 actual '+x['name'],x['passed'])
ck('r300 actual twenty checks',latest['checksPassed']==20)
out={'result':'pass','checksPassed':len(checks),'failed':0,'checks':checks,'scope':'local/reference/public-bundle/model-preservation/device-measurement; not whole-game or final visual approval'}
(R/'docs/evidence/20261117-networth-stage-map/reference-verification.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(len(checks),'checks PASS; source9 unchanged; HTML100 targets; guide12; r33514screens1144parts22edges; historical native checks distinguished')
