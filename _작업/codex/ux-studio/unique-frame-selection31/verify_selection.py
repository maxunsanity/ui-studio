from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib
R=Path('/Users/max/projest_max/ui-studio');B=R/'docs/reference/monopoly-go/video-analysis-20261117';P=R/'src/tools/uxStudio/guide/reference/monopoly-go-video-20261117';E=R/'docs/evidence/20261117-unique-frame-selection';checks=[]
def ck(name,ok):checks.append({'name':name,'passed':bool(ok)});assert ok,name
j=json.loads((B/'unique-frame-selection.json').read_text());ck('17 source categories',len(j['selection'])==17);ck('3 unique candidates',sum(x['decision']=='keep' for x in j['selection'])==3);ck('14 exclusions',sum(x['decision']!='keep' for x in j['selection'])==14);ck('unique family IDs',len({x['family'] for x in j['selection']})==17)
for x in j['selection']:ck('source '+x['family'],(B/x['reference']).is_file())
for name in ['unique-frame-selection.json','unique-frame-selection.html','implementation-progress.json','missing-ui-plan.json']:ck('public bytes '+name,(B/name).read_bytes()==(P/name).read_bytes())
idx=json.loads((R/'src/tools/uxStudio/guide/index.json').read_text());ck('guide31/13entries',idx['version']=='2026-11-17.31' and len(idx['sections'])==13)
for x in idx['sections']:ck('guide target '+x['id'],(R/'src/tools/uxStudio/guide'/x['file']).is_file())
ck('tokens version',json.loads((R/'src/tools/uxStudio/guide/COMMON_UI_TOKENS.json').read_text())['guideVersion']==idx['version'])
ck('saved design unchanged',hashlib.sha256((R/'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json').read_bytes()).hexdigest()==j['basis']['savedDesignSHA256'])
class Links(HTMLParser):
 def __init__(self):super().__init__();self.targets=[];self.images=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='img':self.targets.append(d['src']);self.images.append(d['src'])
  if t=='a':self.targets.append(d['href'])
for b in [B,P]:
 a=Links();a.feed((b/'unique-frame-selection.html').read_text());ck(str(b)+'3images',len(a.images)==3)
 for v in a.targets:
  u=urlsplit(v)
  if u.scheme or v.startswith(('#','/')):continue
  ck(str(b)+' link '+v,(b/unquote(u.path)).is_file())
qa=json.loads((E/'browser-qa.json').read_text());ck('actual desktop/mobile image+overflow',qa['cards']==3 and qa['excludedRows']==14 and qa['imagesFailed']==0 and not qa['overflowDesktop'] and not qa['overflowMobile']);ck('actual common manual31opened',qa['manualBodyRead'] and qa['manualDocuments']==13 and not qa['manualOverflow'])
(E/'file-verification.json').write_text(json.dumps({'status':'pass','checksPassed':len(checks),'failed':0,'checks':checks,'scope':'selection/data/link/hash and actual browser evidence; new product UI0'},ensure_ascii=False,indent=2)+'\n');print(len(checks),'selection checks passed; savedr335 unchanged; native guide31/13; no new UI')
