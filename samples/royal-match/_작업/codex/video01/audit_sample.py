from pathlib import Path
import json,hashlib,datetime
s=Path('/Users/max/projest_max/ui-studio/samples/royal-match');p=s/'ui-studio/designs/ux-9f500ab8.json';d=json.loads(p.read_text());assets=s/'ui-studio/assets';refs=[]
def walk(v,where):
 if isinstance(v,dict):
  if v.get('assetRef'):refs.append((v['assetRef'],where))
  for k,x in v.items():walk(x,where+'/'+k)
 elif isinstance(v,list):
  for i,x in enumerate(v):walk(x,where+'/'+str(i))
walk(d,'design');unique=sorted(set(x[0] for x in refs));missing=[x for x in unique if not(assets/x).is_file()];oversize=[(x,(assets/x).stat().st_size)for x in unique if(assets/x).is_file()and(assets/x).stat().st_size>300000];badsha=[x for x in unique if(assets/x).is_file()and hashlib.sha256((assets/x).read_bytes()).hexdigest()!=x.removeprefix('sha256-').split('.')[0]]
screenids={x['id']for x in d['screens']};elementids={x['id']for sc in d['screens']for x in sc['elements']};badedge=[x['id']for x in d['transitions']if x['fromScreen']not in screenids or x['fromElement']not in elementids or(x.get('action')in['open','navigate']and x.get('targetScreen')not in screenids)];badparents=[]
for sc in d['screens']:
 ids={x['id']for x in sc['elements']}
 badparents += [x['id']for x in sc['elements']if x.get('parentId')and x['parentId']not in ids]
manifest=json.loads((s/'_작업/codex/video01/assets.json').read_text())['assets'];rolebysha={a['sha256']:a['role']for a in manifest};usedroles=sorted({rolebysha[x.removeprefix('sha256-').split('.')[0]]for x in unique if x.removeprefix('sha256-').split('.')[0]in rolebysha});unknown=[x for x in unique if x.removeprefix('sha256-').split('.')[0]not in rolebysha];screens={x['id']:x['name']for x in d['screens']};elements={x['id']:x['name']for sc in d['screens']for x in sc['elements']}
out=dict(checkedAt=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),method='Read-only saved native JSON and asset integrity audit. This is not browser/runtime/visual verification.',revision=d['revision'],screens=len(d['screens']),parts=sum(len(x['elements'])for x in d['screens']),transitions=len(d['transitions']),designBytes=p.stat().st_size,designWithinLimit=p.stat().st_size<=2000000,assetLimitBytes=300000,uniqueImportedAssets=len(unique),maxImportedAssetBytes=max((assets/x).stat().st_size for x in unique if(assets/x).is_file()),missingAssets=missing,oversizeAssets=oversize,hashMismatches=badsha,invalidEdges=badedge,invalidParents=badparents,productionManifestRoles=len(manifest),usedRoles=usedroles,unmappedNativeAssets=unknown,screenCounts=[dict(name=x['name'],parts=len(x['elements']))for x in d['screens']],actualConnections=[dict(id=x['id'],source=screens.get(x['fromScreen']),input=elements.get(x['fromElement']),action=x['action'],target=screens.get(x.get('targetScreen')),label=x.get('label'))for x in d['transitions']]);(s/'docs/ui/saved-data-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in out.items()if k not in ['usedRoles','actualConnections','screenCounts']},ensure_ascii=False,indent=2));assert not(missing or oversize or badsha or badedge or badparents);assert out['designWithinLimit']
