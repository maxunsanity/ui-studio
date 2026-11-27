# -*- coding: utf-8 -*-
from pathlib import Path
import json,hashlib,urllib.parse,subprocess,tempfile,datetime
from html.parser import HTMLParser
from PIL import Image
O=Path(__file__).resolve().parent
D=json.loads((O/'catalog.json').read_text())
checks=[]
def check(name,ok,detail=None):checks.append({'name':name,'pass':bool(ok),'detail':detail})
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
frames=[f for f in D['families'] if f['includedInFrameDenominator']]
check('16 unique game frame ids',len(frames)==16 and [f['id']for f in frames]==['CR'+str(i).zfill(2)for i in range(1,17)])
check('common tutorial separate CR17',len(D['families'])==17 and D['families'][-1]['id']=='CR17' and not D['families'][-1]['includedInFrameDenominator'])
check('external2/toast1 excluded',len(D['externalFamilies'])==2 and len(D['ancillaryStates'])==1 and all(not f['includedInFrameDenominator']for f in D['externalFamilies']+D['ancillaryStates']))
check('19 source records merged exactly3',len([x for f in frames for x in f['sourceFamilyIds']])==19 and len([f for f in frames if len(f['sourceFamilyIds'])==2])==3)
check('game identity and alias',D['game']['slug']=='clash-royale' and D['game']['userAlias']=='클래시오브 클랜')
check('zero unproven clicks/runtime edges',len(D['observedConnections'])==31 and all(not t['confirmedActualClick'] and not t['runtimeEdgeImplemented']for t in D['observedConnections']))
check('zero family native assembly',all(not f['targetActual']['assembled']for f in D['families']))
allf=D['families']+D['externalFamilies']+D['ancillaryStates'];ids={f['id']for f in allf}
check('all20 ids unique',len(ids)==20)
refs={r['id']:r for r in D['references']}
for f in allf:
 check(f['id']+' representative ref',f['representativeRef']in refs)
 for s in f.get('states',[]):check(f['id']+' state ref '+s['name'],s['referenceId']in refs)
for t in D['observedConnections']:
 check(t['id']+' stable family links',all(k in ids for k in t['fromFamilyIds']+t['toFamilyIds']))
 for k in t.get('evidenceRefs',[]):check(t['id']+' evidence ref',k in refs)
for s in D['sourceSnapshots']:
 check('snapshot '+s['snapshotPath'],(O/s['snapshotPath']).is_file() and sha(O/s['snapshotPath'])==s['sha256'])
for r in D['references']:
 p=O/r['relativePath'];source=Path(r['sourceFramePath'])
 check(r['id']+' copy hash',p.is_file() and sha(p)==r['sha256'] and sha(source)==r['sha256'])
 check(r['id']+' image dimensions',Image.open(p).size==(r['width'],r['height'])==(1080,2340))
 idx=json.loads((O/r['sourceIndexSnapshot']).read_text());f=idx['frames'][r['sourceIndexEntry']]
 check(r['id']+' requested/actual index',abs(f['actual']-r['actualSeconds'])<1e-8 and abs(f['requested']-r['requestedSeconds'])<1e-8 and f['file']==Path(r['sourceFrameRelativePath']).name)
M=D['sampleMatching']['data']
check('6 sample matches actual revisions',M is not None and len(M['matches'])==6 and M['sources']['tile']['revision']==63 and M['sources']['mono']['revision']==354)
keys={m['key']for m in M['matches']}
for f in D['families']:
 for m in f.get('sampleMatchReferences',[]):check(f['id']+' sample match '+m['key'],m['key']in keys and m['sourceWorkspaceId'] and m['sourceProjectId'] and m['sourceRevision']in [63,354])
class P(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.cards=[];self.scripts=[];self.in_script=False
 def handle_starttag(self,t,a):
  d=dict(a)
  if 'id'in d:self.ids.append(d['id'])
  for k in ['href','src']:
   if k in d:self.links.append(d[k])
  if t=='article':self.cards.append(d)
  if t=='script':self.in_script=True
 def handle_data(self,s):
  if self.in_script:self.scripts.append(s)
 def handle_endtag(self,t):
  if t=='script':self.in_script=False
H=(O/'index.html').read_text();p=P();p.feed(H)
check('html20 cards and unique DOM ids',len(p.cards)==20 and len(p.ids)==len(set(p.ids)))
for link in p.links:
 u=urllib.parse.urlparse(link)
 if u.scheme or u.netloc:continue
 if u.path:check('html local '+u.path,(O/urllib.parse.unquote(u.path)).is_file())
 if u.fragment:check('html anchor '+u.fragment,u.fragment in p.ids)
check('no editor/runtime imports or fetch',all(x not in H for x in ['type="module"','fetch(','mountDesignConsumer','api/ux-studio','@import']))
js='\n'.join(p.scripts);(O/'catalog-filter-check.js').write_text(js)
syntax=subprocess.run(['node','--check',str(O/'catalog-filter-check.js')],capture_output=True,text=True)
check('filter JS syntax',syntax.returncode==0,syntax.stdout+syntax.stderr)
# Behavioral check only for this artifact's generic filtering, no browser/editor execution.
fixture={'cards':[{'dataset':{'kind':a['data-kind'],'search':a['data-search']},'hidden':False}for a in p.cards]}
node_script="""const vm=require('node:vm'),assert=require('node:assert/strict');const d=JSON.parse(process.argv[1]);const input={value:'',addEventListener(){}},kind={value:'all',addEventListener(){}},out={textContent:''};const sandbox={document:{getElementById:id=>({q:input,kind,found:out}[id]),querySelectorAll:()=>d.cards}};vm.createContext(sandbox);vm.runInContext(process.argv[2],sandbox);function count(){return d.cards.filter(c=>!c.hidden).length}assert.equal(count(),20);kind.value='game';sandbox.filterCatalog();assert.equal(count(),16);kind.value='external';sandbox.filterCatalog();assert.equal(count(),2);kind.value='overlay';sandbox.filterCatalog();assert.equal(count(),1);kind.value='all';input.value='CR09';sandbox.filterCatalog();assert.equal(count(),1);input.value='__nothing_matches__';sandbox.filterCatalog();assert.equal(count(),0);console.log('6 filter cases passed');"""
behavior=subprocess.run(['node','-e',node_script,json.dumps(fixture),js],capture_output=True,text=True)
check('6 filter behaviors',behavior.returncode==0,behavior.stdout+behavior.stderr)
result={'kind':'catalog-file-and-filter-validation-not-product-or-browser-tests','verifiedAtKST':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'passed':sum(c['pass']for c in checks),'total':len(checks),'failed':[c for c in checks if not c['pass']],'counts':{'gameFrames':len(frames),'commonTutorial':1,'externalExcluded':2,'ancillaryToast':1,'referenceJPG':len(refs),'observedConnections':31,'confirmedClicks':0,'runtimeEdges':0,'sampleMatches':6,'sampleNodes':sum(len(m['nodes'])for m in M['matches'])},'catalogSha256':sha(O/'catalog.json'),'htmlSha256':sha(O/'index.html'),'browserInspectionPerformed':False,'nativeAssemblyVerified':False,'checks':checks}
(O/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items()if k not in ['checks']},ensure_ascii=False))
assert not result['failed']
