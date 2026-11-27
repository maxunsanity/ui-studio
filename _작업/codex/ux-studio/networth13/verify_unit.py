from pathlib import Path
import json,hashlib,math
from PIL import Image
R=Path('/Users/max/projest_max/ui-studio');E=R/'docs/evidence/20261117-networth-stage-map';checks=[]
def ck(n,v):
 checks.append({'name':n,'passed':bool(v)});assert v,n
load=lambda p:json.loads((R/p).read_text())
d=load('samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json');old=load('docs/reference/monopoly-go/two-point-20261117/confirmed-r300-design.json');g=next(s for s in d['screens'] if s['name']=='Page_NetWorth_Gallery');mp=d['screens'][-1]
ck('saved r33514screens1144parts22edges',d['revision']==335 and len(d['screens'])==14 and sum(len(s['elements']) for s in d['screens'])==1144 and len(d['transitions'])==22)
for s in old['screens']:ck('r300 unchanged '+s['name'],s==next(n for n in d['screens'] if n['id']==s['id']))
ck('r30020edges preserved',old['transitions']==d['transitions'][:20]);ck('Gallery189/Map15',len(g['elements'])==189 and len(mp['elements'])==15)
ck('unknown Map navigation remains unset',not any(t.get('fromScreen')==mp['id'] or t.get('targetScreen')==mp['id'] for t in d['transitions']))
ck('Gallery2edges conditionsalways',all(t['condition']=='always' for t in d['transitions'][20:]))
ck('Map no footer/back/button/list invented',not any('Footer' in e['name'] or e['kind'] in ['button','list'] or e.get('overflow','').startswith('scroll') for e in mp['elements']))
for s in [g,mp]:
 ck(s['name']+' IDs unique',len({e['id'] for e in s['elements']})==len(s['elements']))
 ck(s['name']+' names unique',len({e['name'] for e in s['elements']})==len(s['elements']))
 for e in s['elements']:
  if e.get('parentId'):ck('valid parent '+e['name'],any(p['id']==e['parentId'] for p in s['elements']))
  if e.get('image',{}).get('assetRef'):
   f=R/'samples/monopoly-go/ui-studio/assets'/e['image']['assetRef'];ck('registered image SHA '+e['name'],f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest()==f.name.removeprefix('sha256-').split('.')[0]);ck('registered image budget '+e['name'],f.stat().st_size<=300000)
  if e.get('skin',{}).get('assetRef'):
   f=R/'samples/monopoly-go/ui-studio/assets'/e['skin']['assetRef'];ck('registered skin SHA '+e['name'],f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest()==f.name.removeprefix('sha256-').split('.')[0])
refs={}
for manifest in ['networth13/v001/manifest.json','networth13/geometry-v001/manifest.json','stage-map14/v001/manifest.json','stage-map14/locked-v001/manifest.json','stage-map14/geometry-v001/manifest.json']:
 j=load('samples/monopoly-go/ui-studio/assets/authoring/'+manifest)
 def walk(x):
  if isinstance(x,dict):
   if x.get('path') and x.get('sha256'):
    f=Path(x['path']);f=f if f.is_absolute() else R/f;refs[str(f)]=x['sha256']
   for v in x.values():walk(v)
  elif isinstance(x,list):
   for v in x:walk(v)
 walk(j)
for f,sha in refs.items():ck('manifest file SHA '+str(Path(f).relative_to(R)),Path(f).is_file() and hashlib.sha256(Path(f).read_bytes()).hexdigest()==sha)
qa=load('docs/evidence/20261117-networth-stage-map/native-qa.json')
for q in qa['nwChecks']:
 ck(q['name']+' full551 width',q['clientWidth']==551);ck(q['name']+' no image/load/overflow',q['failed']==q['loading']==0 and not q['overflow'])
 want=max(219,671-q['scrollTop']);ck(q['name']+' pin body geometry',abs(q['markerBodyY']-want)<.05)
for q in qa['mapChecks']:
 ck(q['name']+' images/overflow',q['failed']==q['loading']==0 and not q['overflow'])
 for n in [18,17,16]:
  for role,w,h in [('group',334,320),('scene',334,320),('ribbon',334,76),('label',290,40)]:
   r=q['logicalRects'][role+str(n)];ck(q['name']+' '+role+str(n)+' uniform',abs(r['w']-w)<.05 and abs(r['h']-h)<.05)
for n,v in qa['galleryRouteChecks'].items():ck('actual route '+n,v)
for name,size in [('gallery-r335-current.png',(1800,1125)),('gallery-game-r335.png',(408,729)),('gallery-430.png',(537,1055)),('map-editor-native.png',(2250,1406)),('map-game-from-full.png',(330,590))]:ck('actual captured size '+name,Image.open(E/name).size==size)
idx=load('src/tools/uxStudio/guide/index.json');ck('common guide30/12docs',idx['version']=='2026-11-17.30' and len(idx['sections'])==12);ck('guide native opened recipe',qa.get('manual',{}).get('recipeOpened') is True)
out={'status':'pass','checksPassed':len(checks),'failures':0,'revision':d['revision'],'manifestFilesChecked':len(refs),'checks':checks,'scope':'file/model/native-evidence integrity; not source game equivalence or stage acceptance'}
(E/'unit-verification.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(len(checks),'unit integrity checks passed;',len(refs),'manifest file hashes verified')
