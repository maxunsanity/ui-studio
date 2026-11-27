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
check('no verified complete native family claim',all(not f['targetActual']['assemblyVerifiedComplete']for f in D['families']))
allf=D['families']+D['externalFamilies']+D['ancillaryStates'];ids={f['id']for f in allf}
check('all20 ids unique',len(ids)==20)

T=D['targetActual'];R=D['nativeTargetRegistration'];G=(O/'PRODUCTION_GUIDE.draft.md').read_text()
check('registered target exact workspace/project',T['nativeProjectRegistered'] and T['workspaceId']=='workspace-2a3dc8e9-dcd3-4c88-a98a-231991656500' and T['projectId']=='ux-ea29177e')
check('independent r78 actual261/10',T['workMode']=='independent' and T['lastProvidedRevision']==78 and T['assembledParts']==261 and T['runtimeTransitions']==10)
check('four representatives in progress unverified',T['representativeFramesInProgressRootReported']==4 and T['verifiedCompleteFrames']==0)
home=next(f for f in D['families']if f['id']=='CR07')
check('home actual screen main and edit link',home['targetActual']['registered'] and home['targetActual']['screenId']=='main' and home['targetActual']['screenName']=='Page_CR_Home' and 'screen=main'in home['targetActual']['editUrl'])
check('source average3.6 obsolete3.5unused',D['fixture']['averageElixir']==3.6 and D['fixture']['obsoleteAverageElixir']==3.5 and '사용 안함'in D['fixture']['obsoleteAverageElixirStatus'])
check('guide correct live average and history', '| 평균 엘릭서 | 3.6 |'in G and '3.5 제작 fixture는 **사용 안함**'in G and '3.5를 유지'not in G)
check('guide meta before assets lesson','대상 상위 폴더 선택 → 도구가 프로젝트 메타 생성 → independent 선택'in G and 'project.json'in G and '미등록 폴더'in G)
check('guide16 frame rows',len([l for l in G.split('실제 native 편집 링크')[0].splitlines()if l.startswith('| CR')])==16)
check('4partial12spec target',T['partialFrameCount']==4 and T['specOnlyFrameCount']==12 and T['nativeScreenCount']==4)
partial=[f for f in frames if f['targetActual']['assemblyStatus']=='partial'];spec=[f for f in frames if f['targetActual']['assemblyStatus']=='specOnly']
check('4partial12spec families',len(partial)==4 and len(spec)==12 and {f['id']for f in partial}=={'CR07','CR08','CR10','CR15'})
expected={'CR07':'main','CR08':'screen-afcec0a1-501b-43b4-9203-10f9a4cf94f6','CR10':'screen-d17e97c9-578e-4fb4-bdca-d4541ba56ad5','CR15':'screen-004379d1-026b-4a8f-ba4c-6e5da113e6b8'}
for f in partial:check(f['id']+' exact edit ID',f['targetActual']['screenId']==expected[f['id']] and 'screen='+expected[f['id']]in f['targetActual']['editUrl'])
knight=next(f for f in frames if f['id']=='CR10')
check('knight standalone overlay no deck resource',knight['targetActual']['nativeKind']=='modal' and knight['targetActual']['backdropDeckResourceCount']==0 and knight['targetActual']['overlayRootSize']=={'w':390,'h':844} and knight['targetActual']['overlayRootBackground']=='transparent')
check('productuse approval unverified',T['productUseApproval']=='미확인')

check('r78 document identity rootreported',T['savedDocumentBytes']==186410 and T['savedDocumentSha256']=='f78b355b1f9e3b4faca3133e7c65003246268ecb7de29c3bae2f64cc0f15222a')
check('r78 perframe count sum261',[f['targetActual']['nativeParts']for f in frames if f['id']in ['CR07','CR08','CR10','CR15']]==[67,110,28,56] and sum(f['targetActual']['nativeParts']for f in partial)==261)
check('3page1modal and10always',T['screenKinds']=={'page':3,'modal':1} and T['allTransitionConditions']=='always' and T['unspecifiedReturnPolicyCount']==0)
check('prototype10 distinct sourceclick0',T['prototypeRuntimeValidation']['independentConnectionsClickedPassed']==10 and R['sourceVideoConfirmedClickCount']==0 and T['prototypeRuntimeValidation']['separateFromOriginalSourceClickEvidence'])
check('prototype keyboard and focus rootchecked',T['prototypeRuntimeValidation']['enteredDetailWithEnter'] and T['prototypeRuntimeValidation']['closedDetailWithEscape'] and 'CardKnight'in T['prototypeRuntimeValidation']['clickedCloseRestoredFocus'] and not T['prototypeRuntimeValidation']['catalogAgentBrowserValidation'])
check('viewport finalreview pending partial preserved','최종검수중'in T['viewportFinalReview'] and len(partial)==4 and T['verifiedCompleteFrames']==0)
check('guide action target condition order','action 선택 → target 선택 → condition을 마지막에 `always`'in G and 'main.mjs:2239'in G)
check('guide r71 to r77 and parent owner','r71 prototype click 실패 → r77'in G and 'Btn 아래 BG/Img/Txt와 중간 그룹'in G and 'owner가 없는 장식만 **none**'in G)
check('guide modal correction and no deck','실제 저장JSON은 **`kind=modal`**'in G and '투명 화면전체 overlayRoot390×844 / 뒤덱자원0'in G)

check('guide JPEG and alpha exception','불투명 전체배경 JPEG 예외'in G and 'alpha가 필요한 부품에는 불투명 JPEG 예외를 적용하지 않습니다'in G and '원본 PNG 마스터'in G)
check('guide150region native numbers decorative none','sourceRegion150×150 source px'in G and '컨트롤의 비용/수량/레벨/진행·숫자'in G and '입력 owner가 없는 decorative image는 `none`'in G)
check('no completion claim in live status/guide','완료'not in G and all('완료'not in f['targetActual']['status']for f in frames) and '완료'not in T['status'])

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
result={'kind':'catalog-file-and-filter-validation-not-product-or-browser-tests','verifiedAtKST':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds'),'passed':sum(c['pass']for c in checks),'total':len(checks),'failed':[c for c in checks if not c['pass']],'counts':{'gameFrames':len(frames),'commonTutorial':1,'externalExcluded':2,'ancillaryToast':1,'referenceJPG':len(refs),'observedConnections':31,'sourceVideoConfirmedClicks':0,'sourceObservationRuntimeEdges':0,'nativeRevision':78,'nativePartsRootReported':261,'nativePrototypeTransitions':10,'nativePrototypeDistinctConnectionsRootClicked':10,'nativePartialFrameCount':4,'specOnlyFrameCount':12,'sampleMatches':6,'sampleNodes':sum(len(m['nodes'])for m in M['matches'])},'catalogSha256':sha(O/'catalog.json'),'htmlSha256':sha(O/'index.html'),'browserInspectionPerformed':False,'nativeAssemblyVerifiedByCatalogAgent':False,'checks':checks}
(O/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items()if k not in ['checks']},ensure_ascii=False))
assert not result['failed']
