from pathlib import Path
import json, hashlib, struct, re, subprocess, sys
from html.parser import HTMLParser
from datetime import datetime
from zoneinfo import ZoneInfo
P=Path(__file__).parent
c=json.loads((P/'catalog.json').read_text());m=json.loads((P/'timestamp-manifest.json').read_text())
WRITE_REPORT='--no-write' not in sys.argv
if WRITE_REPORT:(P/'verification.json').write_text(json.dumps(dict(status='running',scope='static only')))
checks=[]
def check(name,ok,detail=''):
 checks.append(dict(check=name,passed=bool(ok),detail=detail))
 if not ok:raise AssertionError(name+': '+str(detail))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
fam=c['families'];ids={f['id'] for f in fam};cin={x['id'] for x in c['referenceCinematics']}; valid=ids|cin
check('31 stable family IDs without duplicates',len(ids)==len(fam)==31 and ids=={f'TS{i:02}' for i in range(1,32)})
check('all family status planned',all(x['status']=='planned' for x in fam))
check('source IDs and durations',len(c['sources'])==4 and len({x['id'] for x in c['sources']})==4)
sources={x['id']:x for x in c['sources']}
check('target r6 partial assembly separated from 31 planned families',c['targetActual']['workspaceId']=='workspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc' and c['targetActual']['revision']==6 and c['targetActual']['screenCount']==1 and c['targetActual']['componentCount']==8 and c['targetActual']['transitionCount']==0 and c['targetActual']['assemblyStatus']=='in_progress')
for f in fam:
 check(f['id']+' valid family classification',f['kind'] in ['screen','modal','sheet','overlay'])
 check(f['id']+' nonempty regions/ref/hierarchy',bool(f['regions'] and f['references'] and f['plannedComponentHierarchy']['root']['children']))
 for r in f['regions']:
  x,y,w,h=r['boundsPx'];check(f['id']+' coordinate range '+r['name'],x>=0 and y>=0 and w>0 and h>0 and x+w<=504 and y+h<=894,r['boundsPx'])
 for o in f['sourceObservations']:
  check(f['id']+' observation source exists',o['sourceId'] in sources)
  check(f['id']+' observation times within duration',all(0<=t<=sources[o['sourceId']]['durationSeconds'] for t in o['seenSeconds']))
 for key in ['observedLinks','plannedLinks']:
  for link in f[key]:check(f['id']+' '+key+' target '+link['targetId'],link['targetId'] in valid)
 for ctl in f['controls']:
  check(f['id']+' control target',ctl['targetFamilyId'] is None or ctl['targetFamilyId'] in valid)
 for link in f['observedLinks']:check(f['id']+' observed event boundary',link.get('eventLogVerified') is False)
 for sample in f['existingSampleMatches']:
  d=sample['actualData'];check(f['id']+' sample evidence link', (P/d['evidenceFile']).exists())
  check(f['id']+' original sample sha matches snapshot',sha(Path(d['sourcePath']))==d['sourceSha256'])
for comp in c['sharedComponents']:
 check(comp['id']+' component hosts',all(x in ids for x in comp['hosts']))
 check(comp['id']+' excluded from family count',comp['familyCountContribution']==0)
for seq in c['referenceCinematics']:
 for l in seq.get('observedLinks',[]):check(seq['id']+' link target',l['targetId'] in valid)
expected_local={x['id'] for x in json.loads(Path(c['inputProvenance'][0]['path']).read_text())['families']}|{x['id'] for x in json.loads(Path(c['inputProvenance'][1]['path']).read_text())['items']}
check('all 45 source-local groups mapped',expected_local.issubset(c['sourceLocalIdMap']))
check('local mapping targets exist',all(x in valid for x in c['sourceLocalIdMap'].values()))
check('TSV01 condition correction kept',any('210/215/220' in str(x) and '미충족' in str(x) for x in next(f for f in fam if f['id']=='TS07')['states']))
refs=m['images'];check('51 unique reference IDs/files',len(refs)==51 and len({x['id'] for x in refs})==51 and len({x['file'] for x in refs})==51)
def jpgsize(p):
 b=p.read_bytes();i=2
 while i<len(b):
  if b[i]!=255:i+=1;continue
  marker=b[i+1];i+=2
  if marker in [0xd8,0xd9] or 0xd0<=marker<=0xd7:continue
  n=struct.unpack('>H',b[i:i+2])[0]
  if marker in [0xc0,0xc1,0xc2]:h,w=struct.unpack('>HH',b[i+3:i+7]);return w,h
  i+=n
 raise ValueError(p)
for r in refs:
 p=P/r['file'];check(r['id']+' file exists',p.exists());check(r['id']+' analysis reference usage',r['usage']=='analysis-reference-only');check(r['id']+' dimensions',jpgsize(p)==(504,894));check(r['id']+' copy hash',sha(p)==r['sha256']==sha(Path(r['copiedFrom'])));check(r['id']+' source pixels preserved',sha(p)==sha(Path(r['sourceFrame'])))
 ix=json.loads(Path(r['sourceIndex']).read_text());fr=next(x for x in ix['frames'] if x['file']==Path(r['sourceFrame']).name)
 check(r['id']+' requested timestamp matches frame index',abs(fr['requested']-r['requestedSeconds'])<1e-6)
 check(r['id']+' actual timestamp matches frame index',abs(fr['actual']-r['actualSeconds'])<1e-6)
for f in c['inputProvenance']:check('input unchanged '+Path(f['path']).name,sha(Path(f['path']))==f['sha256'])
class Doc(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.hrefs=[];self.imgs=[];self.scripts=[];self.inscript=False
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.append(d['id'])
  if 'href' in d:self.hrefs.append(d['href'])
  if tag=='img':self.imgs.append(d)
  if tag=='script':self.inscript=True
 def handle_endtag(self,tag):
  if tag=='script':self.inscript=False
 def handle_data(self,data):
  if self.inscript:self.scripts.append(data)
d=Doc();page=(P/'index.html').read_text();d.feed(page)
check('HTML IDs unique',len(d.ids)==len(set(d.ids)))
check('HTML family/sequence anchors complete',valid.issubset(set(d.ids)))
for h in d.hrefs:
 if h.startswith('#'):check('HTML fragment '+h,h[1:] in d.ids)
 else:check('HTML local file '+h,not h.startswith(('http:','https:','file:','javascript:')) and (P/h).is_file())
check('all images rendered in HTML',len(d.imgs)==len(refs) and {x['src'] for x in d.imgs}=={x['file'] for x in refs})
check('HTML image alternate text',all(x.get('alt') for x in d.imgs))
check('no network/write primitives',not any(x in ''.join(d.scripts) for x in ['fetch(','XMLHttpRequest','localStorage','sessionStorage','navigator.sendBeacon']))
check('search and three filters present',all(x in d.ids for x in ['query','kind','category','source','count']))
script='\n'.join(d.scripts)
# Execute just the filter using a small document stub; no browser/server use.
data=[dict(textContent=f['id']+' '+f['label'],dataset=dict(kind=f['kind'],category=f['category'],sources=' / '.join(x['sourceId'] for x in f['sourceObservations'])),hidden=False) for f in fam]
test='''const rows=DATA;const fields=Object.fromEntries(['query','kind','category','source','count'].map(x=>['#'+x,{value:'',textContent:'',addEventListener(){}}]));global.document={querySelectorAll(sel){return sel==='article[data-kind]'?rows:[]},querySelector(sel){return fields[sel]}};SCRIPT\nfilter();if(rows.filter(r=>!r.hidden).length!==31)throw Error('all');fields['#query'].value='TS31';filter();if(rows.filter(r=>!r.hidden).length!==1)throw Error('query');fields['#query'].value='';fields['#kind'].value='modal';filter();if(rows.filter(r=>!r.hidden).some(r=>r.dataset.kind!=='modal'))throw Error('kind');fields['#kind'].value='';fields['#source'].value='TSV04';filter();if(rows.filter(r=>!r.hidden).length!==2)throw Error('source');fields['#source'].value='';fields['#category'].value='영웅';filter();if(rows.filter(r=>!r.hidden).length!==5)throw Error('category');'''.replace('DATA',json.dumps(data,ensure_ascii=False)).replace('SCRIPT',script)
r=subprocess.run(['node','-e',test],capture_output=True,text=True)
check('JavaScript syntax and search/category/kind/source self-check',r.returncode==0,r.stderr)
result=dict(createdAtKST=datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds'),status='passed',scope='static checks only; browser/HTTP/mobile visual checks not performed',command='python3 catalog/verify_catalog.py',checksPassed=len(checks),checksFailed=0,familyCount=len(fam),imageCount=len(refs),observedLinkCount=sum(len(x['observedLinks']) for x in fam),plannedLinkExampleCount=sum(len(x['plannedLinks']) for x in fam),checks=checks)
if WRITE_REPORT:(P/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in result.items() if k!='checks'},ensure_ascii=False))
