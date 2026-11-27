# -*- coding: utf-8 -*-
from pathlib import Path
import json,hashlib,shutil,datetime,html
R=Path('/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/clash-sample-20261118')
O=R/'catalog'; (O/'source-snapshots').mkdir(parents=True,exist_ok=True);(O/'refs').mkdir(exist_ok=True)
now=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec='seconds')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
manifest=[]
for video,j,m in [('A','video-a/analysis.json','video-a/analysis.md'),('B','video-b/inventory.json','video-b/inventory.md')]:
 for rel in [j,m]:
  p=R/rel;q=O/'source-snapshots'/('video-'+video.lower()+'-'+p.name)
  if not q.exists():shutil.copyfile(p,q)
  manifest.append({'video':video,'originalPath':str(p),'snapshotPath':str(q.relative_to(O)),'sha256':sha(q),'bytes':q.stat().st_size,'currentOriginalMatchesSnapshot':sha(p)==sha(q)})
A=json.loads((O/'source-snapshots/video-a-analysis.json').read_text());B=json.loads((O/'source-snapshots/video-b-inventory.json').read_text())
AF={f['id']:f for f in A['families']};BF={f['id']:f for f in B['families']}
indexes={};references={}
def getindex(video,folder):
 key=(video,folder)
 if key not in indexes:
  src=R/('video-'+video.lower())/folder/'index.json';cp=O/'source-snapshots'/('index-'+video+'-'+folder+'.json')
  if not cp.exists():shutil.copyfile(src,cp)
  indexes[key]=json.loads(cp.read_text())
  manifest.append({'video':video,'originalPath':str(src),'snapshotPath':str(cp.relative_to(O)),'sha256':sha(cp),'bytes':cp.stat().st_size,'currentOriginalMatchesSnapshot':sha(src)==sha(cp)})
 return indexes[key]
def ref(video,e):
 rel=e.get('frame') or e.get('path');folder=Path(rel).parent.as_posix();index=getindex(video,folder)
 f=next(f for f in index['frames'] if f.get('file')==Path(rel).name)
 req=e['requestedSeconds'];act=e['actualSeconds']
 assert abs(f['actual']-act)<1e-8 and abs(f['requested']-req)<1e-8,(video,rel,e,f)
 src=R/('video-'+video.lower())/rel;hashv=sha(src)
 key=video+'-'+str(round(act*1000000)).zfill(9)+'us-'+hashv[:8]
 if key not in references:
  dst=O/'refs'/(key+'.jpg');shutil.copyfile(src,dst)
  references[key]={'id':key,'videoId':'CLASH-'+video,'relativePath':str(dst.relative_to(O)),'sha256':hashv,'sourceFramePath':str(src),'sourceFrameRelativePath':rel,'requestedSeconds':req,'actualSeconds':act,'sourceIndexSnapshot':'source-snapshots/index-'+video+'-'+folder+'.json','sourceIndexEntry':f['index'],'timestampSource':'AVAssetImageGenerator actualTime / requested zero tolerance / source video relative seconds','width':f['width'],'height':f['height'],'usage':'원본 관찰·비교용 JPG. production 자원 사용 아님.'}
 return references[key]['id']
# B refs already use normalized key names; A refs are their evidence objects.
def ar(fid):return ref('A',AF[fid]['evidence'])
def br(fid):return ref('B',BF[fid]['representative'])
mapping=[
 ('CR01','로고·캐릭터 로딩','loading',['A-F01'],[],'전체 캐릭터 배경+상단 로고+하단 진행바. 77/99/100%는 같은 판틀의 상태.'),
 ('CR02','나이 선택','modal',['A-F02'],[],'회색 외틀 안 캐릭터상단/밝은 슬라이더영역/확인버튼의 분할. 값변경·활성/비활성은 상태.'),
 ('CR03','중요 공지','bottomNotice',['A-F03'],[],'로딩 배후딤 위 하단 제목/안내문/가로3선택 판. 나이입력·동의공급자 판과 다름.'),
 ('CR04','훈련 전투 UI','sceneHUD',['A-F04'],[],'전장 위 적표시/타워HP/하단4카드/엘릭서·다음카드 HUD. 전투1/2·유닛·카드바 숨김은 상태. 장면3D 제작 제외.'),
 ('CR05','훈련 승리 결과','resultOverlay',['A-F05'],[],'전장딤 위 적/아군 리본+VS/왕관+상자보상+확인. 왕관등장연출은 상태.'),
 ('CR06','상자 보상 발표','rewardFlow',['A-F06'],[],'파란배경 위 보상카드/보유·수량/열린상자·남은수. 상자단독/개별보상/4개요약은 같은 흐름의 상태.'),
 ('CR07','전투 홈','home',['A-F07'],['B-F01'],'HUD/상단프로필/중앙아레나모형/이벤트상자/노랑전투/하단5탭의 공통구조. 훈련진행과왕관·패스는 상단내용 variant.'),
 ('CR08','덱 페이지','tabPage',['A-F08'],['B-F05'],'같은3자원/상단덱·컬렉션/4열×2카드/평균엘릭서/타워/하단5탭. 수량·레벨·튜토리얼손은 상태로 병합.'),
 ('CR09','컬렉션 목록','scrollPage',['A-F09'],['B-F06'],'상단2탭+5분류/발견·미발견4열목록/필터·정렬/하단5탭. 선택카드팝오버·업그레이드전후·스크롤 위치는 상태.'),
 ('CR10','카드 상세','detailModal',['A-F10'],[],'돌출기사/파란큰판/카드·이름/희귀도·유형표/시연영역/업그레이드·사용/닫기. 시연3D 제작 제외.'),
 ('CR11','업그레이드 보상 확인','confirmationPopover',['A-F11'],[],'상세 위 작은 꼬리판+보상2행+녹색확인비용. 왕 튜토리얼 문구판과 구조·입력역할 다름.'),
 ('CR12','카드 업그레이드 발표','upgradeResult',['A-F12'],[],'이름/진행/중앙카드/증가스탯3행 세로배치. 상자보상과 배경만 같아 별도 판틀.'),
 ('CR13','전투 덱 바텀시트','bottomSheet',[],['B-F02'],'CR08과 덱 본문공유. 배후홈딤/상단collapse/바텀시트가 하단내비게이션을 덮는 컨테이너 variant로 별도 유지.'),
 ('CR14','게임 모드 바텀시트','bottomSheet',[],['B-F03'],'CR13과시트shell공유. 트로피/합체전술/잠긴경쟁전/클래식 분할카드 세로목록이라본문판틀은다름.'),
 ('CR15','소셜·클랜 없음','socialPage',[],['B-F04'],'상단클랜유도판+온라인/순위표 큰목록+하단퀵플레이/친구추가/카메라. 왕안내는CR17 공통overlay.'),
 ('CR16','상점·세로 섹션','shopScrollPage',[],['B-F07'],'고정HUD/하단내비 사이 넓은오퍼·3열상품·제목리본의긴세로본문. 일일/이모티콘/보석/골드와역스크롤은상태/반복부품.'),
]
mapid={old:id for id,_,_,aa,bb,_ in mapping for old in aa+bb};mapid.update({'B-O01':'CR17','B-O01-S01':'CR17','B-O01-S02':'CR17','B-O02':'CRS01','A-X01':'CRX01','A-X02':'CRX02'})
families=[]
for id,name,kind,aa,bb,reason in mapping:
 observations=[];states=[];texts=[];hier=[];unknown=[];behavior=[];candidates=[]
 for old in aa:
  f=AF[old];observations.append({'videoId':'CLASH-A','sourceFamilyId':old,'snapshot':'source-snapshots/video-a-analysis.json','pointer':'families/'+str(A['families'].index(f)),'representativeRef':ar(old),'sourceKind':f['kind'],'structureObserved':f['structure'],'entryObserved':f['entry'],'exitObserved':f['exit'],'scrollObserved':f['scroll'],'tabsObserved':f['tabs']})
  for s in f['states']:states.append({'sourceFamilyId':old,'name':s['name'],'referenceId':ref('A',s['evidence']),'sameFrameFamily':True,'nativeStateImplemented':False})
  texts+=f['displayTextObserved'];unknown+=f['unknown'] if isinstance(f['unknown'],list) else [f['unknown']]
  hier.append({'sourceFamilyId':old,'status':'관찰 픽셀에서 재조립하기 위한 제안. 실제 Unity hierarchy 미관찰.','nodes':f['componentHierarchyProposal']})
  behavior+=[f['entry']['detail'],f['exit']['detail'],f['scroll']['detail']]
 for old in bb:
  f=BF[old];observations.append({'videoId':'CLASH-B','sourceFamilyId':old,'snapshot':'source-snapshots/video-b-inventory.json','pointer':'families/'+str(B['families'].index(f)),'representativeRef':br(old),'sourceKind':f['category'],'observedTimelineIntervalsRequestedSeconds':f['observedTimelineIntervalsRequestedSeconds'],'behaviorObserved':f['observedBehavior']})
  states.append({'sourceFamilyId':old,'name':'영상B 대표 상태','referenceId':br(old),'sameFrameFamily':True,'nativeStateImplemented':False})
  texts+=f['observedTexts'];unknown+=f['unobserved'];behavior+=f['observedBehavior'];candidates+=f['inferredInputs']
  hier.append({'sourceFamilyId':old,'status':'관찰 픽셀에서 재조립하기 위한 제안. 실제 Unity hierarchy 미관찰.','nodes':f['hierarchyProposal']})
 scenes=[]
 if id=='CR04':scenes=['아레나잔디/울타리/강/다리·실시간유닛/타워·전투판정. UI HUD만 카탈로그 범위.']
 if id=='CR07':scenes=['중앙훈련장·아레나디오라마와조명장면. 3D모델/카메라/애니메이션 제작 제외.']
 if id in ['CR08','CR13']:scenes=['하단왕/프린세스타워3D모형. 2D그림·별도native진행/수치로분리할후보이며3D제작제외.']
 if id=='CR10':scenes=['상단기사모형/본문아레나시연. 실제3D·전투시뮬레이션제작제외.']
 if id=='CR09':behavior.append('B20.8~22.8초에는 상단2탭·5분류·정렬행도 스크롤과 함께 사라짐. source A의 상위탭고정정책 미확인은 B 관찰로 보완. HUD/하단nav만 고정 관찰.')
 fam={'id':id,'nameKo':name,'kind':kind,'classification':'uniqueObservedGameFrameFamily','includedInFrameDenominator':True,'sourceFamilyIds':aa+bb,'dedupReason':reason,'representativeRef':observations[-1]['representativeRef'] if bb else observations[0]['representativeRef'],'observations':observations,'states':states,'observedTexts':list(dict.fromkeys(texts)),'observedSequenceAndScroll':behavior,'inputCandidates':candidates,'confirmedActualClicks':[],'inputPolicy':'화면 전후/안내손·버튼강조는 관찰. touch-down/up·실제클릭로그 없음. native 연결 구현 근거로 확대하지 않음.','hierarchyProposals':hier,'geometryPolicy':'1080×2340 원본px 수동근사만. logicalSize/anchor/pivot/font/9slice 원본값 미확인. 제작값은미정.','scene3DExcluded':scenes,'unobserved':list(dict.fromkeys(unknown)),'targetActual':{'registered':False,'assembled':False,'workspaceId':None,'projectId':None,'screenId':None,'revision':None,'nativeParts':0,'nativeTransitions':0,'status':'등록 전 · 조립 전 · 관찰 참고자료만'}}
 families.append(fam)
# Additional source snapshots retain selected-card and scroll states without expanding denominator.
for extra in A['additionalRepresentatives']:
 family=next((f for f in families if extra['name'].startswith(next((old for old in f['sourceFamilyIds'] if old.startswith('A-')),'NO_MATCH'))),None)
 if family and not any(s['referenceId']==ref('A',extra['evidence']) for s in family['states']):family['states'].append({'sourceFamilyId':extra['name'],'name':extra['name'],'referenceId':ref('A',extra['evidence']),'sameFrameFamily':True,'nativeStateImplemented':False})
for name,e in B['representativeCopies'].items():
 old=next((old for old in BF if name.startswith(old)),None)
 if old:
  family=next(f for f in families if old in f['sourceFamilyIds']);rr=ref('B',e)
  if not any(s['referenceId']==rr for s in family['states']):family['states'].append({'sourceFamilyId':old,'name':name,'referenceId':rr,'sameFrameFamily':True,'nativeStateImplemented':False})
# Shared king/hand/callout group is separate from its underlying frame families.
bo=B['overlayFamilies'][0]
common={'id':'CR17','nameKo':'튜토리얼 왕·손가락·말풍선 공통군','kind':'commonTutorialOverlay','classification':'sharedOverlayFamily','includedInFrameDenominator':False,'sourceFamilyIds':['A-F04/Group_Tutorial','A-F07/Tutorial','A-F08/Hand','A-F10/TutorialHand','A-F11/TutorialHand','B-O01'],'dedupReason':'왕+흰말풍선과손가락유도는본문전투/홈/덱/소셜위공통overlay역할로분리. 문구·위치·손의방향·타깃변화는variant. 실제같은엔진prefab이라고주장하지않음.','representativeRef':ref('B',bo['representative']),'observations':[{'videoId':'CLASH-A','sourceFamilyId':'A-F04','representativeRef':ref('A',next(s for s in AF['A-F04']['states']if s['name']=='킹 대사')['evidence'])},{'videoId':'CLASH-B','sourceFamilyId':'B-O01','representativeRef':ref('B',bo['representative'])}],'states':[{'name':'훈련전장왕대사','referenceId':ref('A',next(s for s in AF['A-F04']['states']if s['name']=='킹 대사')['evidence'])},{'name':'홈 전투버튼 손+말풍선','referenceId':ar('A-F07')},{'name':'덱 컬렉션탭 손','referenceId':ar('A-F08')}]+[{'name':s['id'],'observedText':s['observedText'],'referenceId':ref('B',s['representative'])}for s in bo['states']],'observedTexts':[s['observedText']for s in bo['states']],'observedSequenceAndScroll':bo['observedBehavior'],'inputCandidates':bo['inferredInputs'],'confirmedActualClicks':[],'hierarchyProposals':[{'sourceFamilyId':'B-O01','status':'관찰기반재조립제안','nodes':bo['hierarchyProposal']}],'geometryPolicy':'좌표/폰트/앵커는제작값미정','scene3DExcluded':[],'unobserved':bo['unobserved'],'targetActual':{'registered':False,'assembled':False,'workspaceId':None,'projectId':None,'screenId':None,'revision':None,'nativeParts':0,'nativeTransitions':0,'status':'공통 overlay 후보 · 등록 전 · 조립 전'}}
families.append(common)
external=[]
for old,id in [('A-X01','CRX01'),('A-X02','CRX02')]:
 f=AF[old];external.append({'id':id,'nameKo':f['name'],'kind':f['kind'],'classification':'externalExcluded','includedInFrameDenominator':False,'sourceFamilyIds':[old],'representativeRef':ar(old),'dedupReason':'OS/외부동의공급자 원본참고만. 게임UI제작 분모에서 제외.','observedTexts':f['displayTextObserved'],'observations':[{'videoId':'CLASH-A','sourceFamilyId':old,'representativeRef':ar(old)}],'states':[],'hierarchyProposals':[{'sourceFamilyId':old,'status':'외부판관찰만','nodes':f['componentHierarchyProposal']}],'unobserved':f['unknown'],'targetActual':{'registered':False,'assembled':False,'status':'외부 UI · 제작대상 제외'}})
bt=B['transientOverlays'][0]
transient=[{'id':'CRS01','nameKo':'공사중 토스트','kind':'transientToast','classification':'ancillaryState','includedInFrameDenominator':False,'sourceFamilyIds':['B-O02'],'representativeRef':ref('B',bt['representative']),'observations':[{'videoId':'CLASH-B','sourceFamilyId':'B-O02','representativeRef':ref('B',bt['representative'])}],'states':[],'observedTexts':[bt['observedText']],'dedupReason':bt['note'],'hierarchyProposals':[],'unobserved':['실제발생입력/타이머/입력차단'],'targetActual':{'registered':False,'assembled':False,'status':'보조 상태 · 등록 전 · 조립 전'}}]
# Preserve both videos' observable sequences; no guessed input becomes an actual-click edge.
connections=[]
for i,t in enumerate(A['transitions'],1):
 connections.append({'id':'A-T'+str(i).zfill(2),'videoId':'CLASH-A','fromFamilyIds':[mapid.get(t['from'],t['from'])],'toFamilyIds':[mapid.get(t['to'],t['to'])],'sourceFrom':t['from'],'sourceTo':t['to'],'actualSampleBracketSeconds':[t['lastBeforeSampleSeconds'],t['firstAfterSampleSeconds']],'observed':t['observedSequence'],'inputCandidate':t['controlEvidence'],'confirmedActualClick':False,'runtimeEdgeImplemented':False,'precision':t['onsetPrecision']})
for t in B['transitions']:
 connections.append({'id':t['id'],'videoId':'CLASH-B','fromFamilyIds':list(dict.fromkeys(mapid.get(p,p)for p in t['from'].split('+'))),'toFamilyIds':list(dict.fromkeys(mapid.get(p,p)for p in t['to'].split('+'))),'sourceFrom':t['from'],'sourceTo':t['to'],'requestedSampleBracketSeconds':t['requestedTimeBracketSeconds'],'observed':t['observed'],'inputCandidate':t['inputCandidate'],'confirmedActualClick':False,'runtimeEdgeImplemented':False,'precision':'requested sample brackets, actualTime refs attached','evidenceRefs':[ref('B',t['beforeOrDuring']),ref('B',t['after'])]})
shared=[{'id':'CRC01','nameKo':'3자원 HUD','families':['CR07','CR08','CR09','CR16'],'observed':'왕관카드XP/골드/보석,별도문구·진행/플러스. 수치는 상태값, 원본상수 아님.'},{'id':'CRC02','nameKo':'하단5탭','families':['CR07','CR08','CR09','CR15','CR16'],'observed':'선택탭폭/label/작은화살표·알림배지. 모든 탭목적지 확정 아님.'},{'id':'CRC03','nameKo':'유닛 카드','families':['CR06','CR08','CR09','CR10','CR12','CR13','CR16'],'observed':'프레임/원화/엘릭서/레벨/수량·게이지/NEW를별도역할로분리. 회색·활성·등급은variant.'},{'id':'CRC04','nameKo':'덱 본문','families':['CR08','CR13'],'observed':'4열×2행·평균엘릭서·타워/진행. 정식page와bottomSheet shell차이는유지.'},{'id':'CRC05','nameKo':'collapse 바텀시트','families':['CR13','CR14'],'observed':'배후딤/위돌출아래화살표/파란제목. 입력경계·닫기정책은미확인.'},{'id':'CRC06','nameKo':'보상/상품 카드·리본','families':['CR05','CR06','CR11','CR16'],'observed':'같은배경/문구변경만으로전체판틀병합하지않고보상행·확인·상자/상품분할구조로구분.'}]
# The matching agent owns real saved sample values. Read only when its completed result exists.
matchfiles=[];matchdata=None
for name in ['sample-match.json','matches.json','analysis.json','matching.json']:
 p=R/'sample-match'/name
 if p.exists():
  q=O/'source-snapshots'/('sample-match-'+name)
  if not q.exists():shutil.copyfile(p,q)
  matchfiles.append({'path':str(p),'snapshot':str(q.relative_to(O)),'sha256':sha(q)})
  if matchdata is None:matchdata=json.loads(q.read_text())
match_keys_by_family={'CR07':['home_toolbar'],'CR08':['collection_four_columns','album_card_family'],'CR09':['collection_four_columns','album_card_family','home_toolbar'],'CR10':['card_detail_surrogate'],'CR13':['collection_four_columns','album_card_family'],'CR15':['social_tabs_rows','home_toolbar'],'CR16':['shop_products','home_toolbar']}
if matchdata:
 matchbykey={m['key']:m for m in matchdata['matches']}
 for f in families:
  f['sampleMatchReferences']=[]
  for key in match_keys_by_family.get(f['id'],[]):
   m=matchbykey[key]
   f['sampleMatchReferences'].append({'key':key,'fit':m['fit'],'sourceSample':m['source'],'sourceWorkspaceId':m['workspaceId'],'sourceProjectId':m['projectId'],'sourceRevision':m['revision'],'sourceScreenId':m['screen']['id'],'sourceScreenName':m['screen']['name'],'sourceLogicalSize':m['screen']['logicalSize'],'comparison':m['comparison'],'gapsAndSizes':m['gapsAndSizes'],'limits':m['limits'],'dataLink':'source-snapshots/sample-match-sample-match.json','htmlSection':'sample-'+key,'meaning':'기존샘플저장값참고. Clash원본설정/Clash조립완료아님.'})
  if not f['sampleMatchReferences']:f['sampleMatchingStatus']='조사한기존두샘플에서직접적합한전체판틀미선정. 없는계층/동작/수치를만들지않음.'
if matchdata:
 samplematch={'status':'연결용결과스냅샷읽음','files':matchfiles,'data':matchdata,'note':'원본관찰수치와기존샘플실제저장값을구분. 원본같음/새UI조립완료로읽지않음.'}
else:samplematch={'status':'별도담당작성중 · 아직결과미수신','files':[],'data':None,'note':'실제 sample workspace/project/revision/부품값을만들지않음. 결과수신후읽기연결예정.'}

data={'schemaVersion':'clash-royale-observational-catalog-v1','artifactType':'reference-ui-family-catalog','status':'제안(검수 대기)','createdAtKST':now,'game':{'name':'Clash Royale','slug':'clash-royale','nameKo':'클래시 로얄','userAlias':'클래시오브 클랜','identification':'A로고 CLASH ROYALE/클래시 로얄+B상점 클래시 로얄 초보자 팩실문구','sourceProvenance':[A['source'],B['source']]},'scope':{'sourceVideos':2,'allGameUI':False,'productionArtCreated':0,'nativeAssembly':0,'designJsonEdited':0,'productSourceEdited':0,'browserInspection':0,'serverStarted':0,'packageInstalled':0,'publicStatusOrReportEdited':0,'unassignedVideoDataAccessed':False,'kingShotDataAccessed':False},'denominators':{'sourceGameFamilyCandidatesA':12,'sourceFullFrameObservationsB':7,'crossVideoDuplicatesMerged':3,'uniqueObservedGameFrameFamilies':16,'commonTutorialOverlayFamilies':1,'ancillaryToastStates':1,'externalFamiliesExcluded':2,'nativeAssembledGameFrameFamilies':0,'nativeAssembledCommonOverlayFamilies':0,'originalVisualEquivalenceApproved':0,'equivalenceDenominator':16,'policy':'A12+B7をそのまま合算せず、ホーム・デッキページ・コレクションの重複3組を統合。16は提供動画から選別したUI判틀候補で全ゲーム/3Dシーン数ではない。共通overlay1·toast1·外部2は主判틀16の分母と別管理。'},'sourceSnapshots':manifest,'families':families,'externalFamilies':external,'ancillaryStates':transient,'sharedComponents':shared,'observedConnections':connections,'references':list(references.values()),'sampleMatching':samplematch,'targetActual':{'sampleFolderProposed':'/Users/max/projest_max/ui-studio/samples/clash-royale','folderCreatedByThisCatalog':False,'nativeProjectRegistered':False,'workspaceId':None,'projectId':None,'revision':None,'assembledScreens':0,'assembledParts':0,'runtimeTransitions':0,'status':'본체가native프로젝트ID제공예정. 이카탈로그는등록전·조립전스냅샷.'},'policies':{'originalReferences':'raw JPG는원본관찰전용이며production그림으로전용하지않음.이미지·native문구·input wrapper·프레임을분리조립예정.','scene3D':'실제아레나/유닛/중앙디오라마/카드시연/타워모형3D제작제외. UI HUD/마스크·입력과장면참조만기록.','clicks':'확인된actual클릭0. 모든연결은전후변화관찰과입력후보추정.미관찰목적지·게임API·결제·보상·드래그연결은만들지않음.','sourceHierarchy':'원본Unity실제계층미관찰.계층은재조립제안.원본pixel영역과샘플논리저장값을구분.','dimensions':'현재원본관찰1080×2340.논리화면크기/폰트/앵커/9slice/그림자는제작값미정.','status':'분석/자료정리·폴더등록·UI조립·동작검수·시각동등·사용자승인은각각별도.','automation':'감시/예약/자동조회/서버재개없음.'},'integrationReview':{'imagesViewed':['video-a/representative-families.jpg','video-a/representatives/A-F07_101993ms.jpg','video-a/representatives/A-F08_084999ms.jpg','video-a/representatives/A-F09_088986ms.jpg','video-b 19 full frames + 3 contact sheets as inventory.json'],'mergeChecks':['A홈과B홈의HUD/중앙디오라마/이벤트/전투/하단탭공통및상단훈련vs왕관패스variant','A덱과B덱페이지의4×2카드/평균엘릭서/타워동일구조','A컬렉션과B컬렉션의탭/분류/4열목록및숫자·정렬·잠금문구차이','A세로보상발표와업그레이드스탯발표의본문구조차이','B덱시트와덱페이지의본문공유/shell차이'],'notClaimed':['전체원본분모전수','확인되지않은실제입력','native상태구현','제품/JSON제작','3D장면재현','최종동등승인']}}
# Korean policy wording, source counts remain literal.
data['denominators']['policy']='A12+B7을 그대로 합산하지 않고 홈·덱페이지·컬렉션의 중복3쌍을 통합했습니다. 16은 제공영상에서 선별한 UI판틀 후보로 전체게임/3D장면 수가 아닙니다. 공통overlay1·toast1·외부2는 주판틀16 분모와 별도 관리합니다.'
reg=json.loads((O/'native-target-status.json').read_text()) if (O/'native-target-status.json').exists() else None
if reg:
 data['nativeTargetRegistration']=reg
 data['scope']['nativeAssemblyByCatalogAgent']=data['scope'].pop('nativeAssembly',0)
 data['scope']['registrationBrowserVerifiedByCatalogAgent']=False
 data['denominators']['nativeVerifiedCompleteGameFrameFamilies']=data['denominators'].pop('nativeAssembledGameFrameFamilies',0)
 data['denominators']['nativeVerifiedCompleteCommonOverlayFamilies']=data['denominators'].pop('nativeAssembledCommonOverlayFamilies',0)
 data['denominators']['nativeAssemblyStatus']='4 partial / 12 spec-only · Social 제작중 · 실제 부품/연결수·최종revision 미수신 · 미검수'
 data['denominators']['nativePartialGameFrameFamilies']=4
 data['denominators']['specOnlyGameFrameFamilies']=12
 data['denominators']['representativeFramesInProgressRootReported']=reg['representativeBuildCountRootReported']
 data['targetActual']={'sampleFolder':reg['sampleFolder'],'nativeProjectRegistered':True,'workMode':reg['workMode'],'workspaceId':reg['workspaceId'],'projectId':reg['projectId'],'lastProvidedRevision':reg['lastProvidedRevision'],'currentRevision':reg['currentRevision'],'assembledScreens':None,'nativeScreenCount':4,'partialFrameFamilies':reg['partialFrameFamilies'],'partialFrameCount':4,'specOnlyFrameCount':12,'productUseApproval':'미확인','assembledParts':None,'runtimeTransitions':None,'verifiedCompleteFrames':0,'representativeFramesInProgressRootReported':4,'status':reg['status'],'knownScreens':reg['knownScreens'],'editUrl':reg['editUrl'],'evidenceSource':'native-target-status.json · 본체 보고값, 카탈로그 담당 직접 브라우저 검증 없음'}
 screenmap={x['familyId']:x for x in reg['knownScreens']}
 for f in families:
  f['targetActual']['workspaceId']=reg['workspaceId'];f['targetActual']['projectId']=reg['projectId']
  f['targetActual']['projectRegistered']=True;f['targetActual']['revision']=None
  f['targetActual']['nativeParts']=None;f['targetActual']['nativeTransitions']=None
  if f['id']in screenmap:
   k=screenmap[f['id']]
   f['targetActual'].update({'registered':True,'assembled':False,'assemblyStatus':'partial','screenId':k['screenId'],'screenName':k['screenName'],'lastProvidedRevision':43,'status':'partial · 실제 조립중 · 미검수 · 제품사용승인 미확인','editUrl':k['editUrl']})
   if 'nativeKind'in k:f['targetActual'].update({'nativeKind':k['nativeKind'],'backdropDeckResourceCount':k['backdropDeckResourceCount'],'samplePresentation':k['samplePresentation']})
  else:
   f['targetActual'].update({'registered':False,'assembled':False,'assemblyStatus':'specOnly','status':'spec-only · 판틀 명세/원본 관찰만 · native screen ID 없음'})
 data['fixture']=reg['fixture']

dump(O/'catalog.json',data)
# Generic static report template: native inputs, filterable cards, no editor/runtime dependency.
E=lambda v:html.escape(str(v),quote=True)
refs={r['id']:r for r in data['references']}
def reflabel(id):
 r=refs[id];return f"{r['videoId']} · 요청 {r['requestedSeconds']}s → 실제 {r['actualSeconds']:.6f}s"
def hlist(items):return '<ul>'+''.join('<li>'+E(v)+'</li>'for v in items)+'</ul>' if items else '<p class="muted">미관찰 / 해당 없음</p>'
def render_family(f):
 r=refs[f['representativeRef']];kind='game'if f.get('includedInFrameDenominator')else('overlay'if f['id']=='CR17'else('external'if f['id'].startswith('CRX')else'state'))
 search=' '.join([f['id'],f['nameKo'],f['kind'],f.get('dedupReason',''),' '.join(f.get('sourceFamilyIds',[])),' '.join(f.get('observedTexts',[]))])
 st=''.join('<li><a href="'+E(refs[s['referenceId']]['relativePath'])+'">'+E(s['name'])+'</a> <small>'+E(reflabel(s['referenceId']))+'</small></li>'for s in f.get('states',[]))
 h='<article class="family" id="'+f['id']+'" data-kind="'+kind+'" data-search="'+E(search.lower())+'"><div class="card-head"><span class="pill">'+f['id']+'</span><span>'+E(f['kind'])+'</span></div><h2>'+E(f['nameKo'])+'</h2><p>'+E(f.get('dedupReason',''))+'</p><a class="reference" href="'+E(r['relativePath'])+'"><img loading="lazy" src="'+E(r['relativePath'])+'" alt="참고 원본 · '+E(f['nameKo'])+'"></a><p class="source">'+E(reflabel(f['representativeRef']))+'<br>원본 1080×2340 · 비교 전용<br>SHA256 '+E(r['sha256'])+'</p><p class="actual">'+E(f['targetActual']['status'])+'</p>'
 if f.get('targetActual',{}).get('editUrl'):h+='<p><a href="'+E(f['targetActual']['editUrl'])+'">이 판틀 native 편집 열기 · partial</a></p>'
 h+='<details><summary>관찰 문구·상태·전환</summary>'+hlist(f.get('observedTexts',[]))+'<h3>같은 판틀의 상태</h3><ul>'+st+'</ul><h3>실제 관찰</h3>'+hlist(f.get('observedSequenceAndScroll',[]))+'<h3>입력 후보 · 추정</h3>'+hlist(f.get('inputCandidates',[]))+'</details>'
 h+='<details><summary>기존 샘플 실제 데이터 · 적용 차이</summary>'+''.join('<p><a href="#'+E(m['htmlSection'])+'">'+E(m['key'])+' · '+E(m['fit'])+'</a><br>'+E(m['sourceProjectId'])+' r'+str(m['sourceRevision'])+' / '+E(m['sourceScreenName'])+'<br>'+E(m['comparison'])+'</p>'+hlist(m['limits']) for m in f.get('sampleMatchReferences',[]))+(('<p>'+E(f['sampleMatchingStatus'])+'</p>') if f.get('sampleMatchingStatus') else '')+'</details>'
 h+='<details><summary>계층 제안 · 미확인 · 장면 제외</summary><p>픽셀 관찰을 재조립하는 제안이며 원본 Unity 실제 계층·논리 크기·폰트는 미확인입니다.</p><pre>'+E(json.dumps(f.get('hierarchyProposals',[]),ensure_ascii=False,indent=2))+'</pre><h3>3D 장면 제작 제외</h3>'+hlist(f.get('scene3DExcluded',[]))+'<h3>미확인</h3>'+hlist(f.get('unobserved',[]))+'</details></article>'
 return h
allfamilies=families+transient+external
cards=''.join(render_family(f)for f in allfamilies)
def render_saved_matches(matchdata):
 if not matchdata:return '<p>별도 담당 결과 미수신</p>'
 out='<p>기존 저장샘플 2개: tile-survival ux-25ecc98a r63(504×894), monopoly-go ux-gjs-0d80d7fe r354(551×984). 아래 값은 <strong>실제 저장 설계에서 계산한 논리값</strong>이며 브라우저 실측·Clash 원본 Unity 값이 아닙니다. 대상 native 프로젝트는 4 partial / 12 spec-only·미검수입니다. r43 이후 Social 조립중이며 실제 부품수/최종revision·제품사용승인은 미확인입니다.</p>'
 out+='<p><a href="source-snapshots/sample-match-sample-match.json">전체 계층·논리rect·부모좌표·폰트·상태·input·연결·자원 JSON</a></p>'
 for m in matchdata['matches']:
  link='http://127.0.0.1:7018/ui-studio/?editor=detail&amp;workspace='+E(m['workspaceId'])+'&amp;project='+E(m['projectId'])+'&amp;screen='+E(m['screen']['id'])
  rows=''
  for n in m['nodes']:
   rect=n['logicalRect'];coord=' / '.join(str(rect[k]) for k in ['x','y','w','h'])
   vals={'font':n.get('font'),'input':n.get('input'),'state':n.get('state'),'layout':n.get('layout'),'overflow':n.get('overflow'),'image':n.get('image'),'skin':n.get('skin'),'shadow':n.get('shadow'),'transitionIds':n.get('transitionIds')}
   rows+='<tr><td>'+E(n['name'])+'<br><small>'+E(n['id'])+'</small></td><td>'+E(n.get('parentId'))+'</td><td>'+E(coord)+'</td><td><pre>'+E(json.dumps({k:v for k,v in vals.items() if v is not None},ensure_ascii=False,indent=2))+'</pre></td></tr>'
  out+='<details class="saved-match" id="sample-'+E(m['key'])+'"><summary>'+E(m['key'])+' · '+E(m['fit'])+' · '+E(m['screen']['name'])+'</summary><p>'+E(m['comparison'])+'</p><p><a href="'+link+'">기존 샘플 실제 툴에서 보기</a> · '+E(m['workspaceId'])+' / '+E(m['projectId'])+' r'+str(m['revision'])+'</p>'+hlist([g['description']+': '+str(g['logicalPx'])+' logical px'for g in m['gapsAndSizes']])+'<div class="table"><table><thead><tr><th>부품명 / ID</th><th>부모 ID</th><th>x / y / W / H<br>샘플 논리px</th><th>폰트·입력·상태·자원</th></tr></thead><tbody>'+rows+'</tbody></table></div><h3>적용 차이 · 미확인</h3>'+hlist(m['limits'])+'</details>'
 out+='<h3>조사한 샘플에서 직접 적합한 예제 없음</h3>'+hlist([x['target']+': '+x['result']+' / '+x['delta']for x in matchdata['unmatched']])
 return out
matchhtml=render_saved_matches(matchdata)
connectionrows=''.join('<tr><td>'+E(t['id'])+'</td><td>'+E(t['videoId'])+'</td><td>'+E(' → '.join([','.join(t['fromFamilyIds']),','.join(t['toFamilyIds'])]))+'</td><td>'+E(t['observed'])+'</td><td>'+E(t['inputCandidate'])+'</td></tr>'for t in connections)
htmltxt='''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Clash Royale · 원본 UI 판틀 카탈로그</title><style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f3f4f0;color:#233344;font:16px/1.6 -apple-system,BlinkMacSystemFont,sans-serif}main{max-width:1440px;margin:auto;padding:28px 22px}h1{font-size:clamp(26px,4vw,38px);line-height:1.3}h2{font-size:23px;line-height:1.35}h3{font-size:17px}.note{padding:16px;background:#fff3ce;border-left:4px solid #b48525}.counts{display:flex;gap:10px;flex-wrap:wrap}.counts span{padding:8px 12px;background:white;border:1px solid #ccd6db;border-radius:8px}.tools{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;gap:12px;align-items:center;background:#f3f4f0f5;padding:12px 0;border-bottom:1px solid #ccd6db}.tools label{display:flex;align-items:center;gap:8px}.tools input,.tools select{font:inherit;padding:9px;border:1px solid #8a9aa4;border-radius:6px;max-width:100%}.tools input{width:min(420px,100%)}.tools output{margin-left:auto}a{color:#176580;overflow-wrap:anywhere}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:24px 0}article{min-width:0;background:white;border:1px solid #d7dce0;border-radius:12px;padding:16px;content-visibility:auto;contain-intrinsic-size:auto 900px}article[hidden]{display:none}.card-head{display:flex;align-items:center;gap:10px;font-size:13px;color:#546b79}.pill{background:#dcecf2;color:#224c64;border-radius:4px;padding:4px 8px;font-weight:700}article img{display:block;max-width:100%;width:auto;height:450px;object-fit:contain;margin:auto;background:#e4e9ed}.source{font-size:12px;color:#596c7b;overflow-wrap:anywhere}.actual{padding:9px;background:#f9eac7;color:#6c4c0e;font-weight:600}.muted,small{color:#596c7b}details{border-top:1px solid #d7dce0;padding:10px 0}summary{cursor:pointer;font-weight:600}pre{font-size:12px;line-height:1.5;background:#f3f6f8;padding:10px;white-space:pre-wrap;overflow-wrap:anywhere}li{margin:5px 0}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;border-bottom:1px solid #d6dce0;padding:10px;vertical-align:top;overflow-wrap:anywhere}.table{max-width:100%;overflow:auto}footer{margin-top:30px;color:#536778;font-size:14px}@media(max-width:1000px){.cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.cards{grid-template-columns:minmax(0,1fr)}article img{height:auto;max-height:660px}.tools{position:static}.tools label{width:100%}.tools input{width:100%}.tools output{margin-left:0}main{padding:20px 14px}table{min-width:650px}}
</style></head><body><main><p>UI STUDIO / CLASH ROYALE / REFERENCE CATALOG</p><h1>클래시 로얄 · 원본 UI 판틀 찾기</h1><p class="note">사용자 표현 ‘클래시오브 클랜’의 제공 영상은 실제 로고와 상품명 기준 <strong>Clash Royale / 클래시 로얄</strong>입니다. 이 페이지는 원본 영상 관찰자료입니다. <strong>프로젝트 등록됨 · 4 partial / 12 spec-only · 미검수</strong>이며 스크린샷은 production UI가 아닙니다. r43 이후 Social 조립중이며 실제 부품수/최종revision·제품사용승인은 미확인입니다. 전체 게임 UI 조사·3D 장면 제작·미관찰 게임동작은 포함하지 않습니다.</p><div class="counts"><span>고유 판틀 후보 <b>16</b></span><span>공통 튜토리얼군 <b>1</b></span><span>보조 토스트 <b>1</b></span><span>외부 UI 제외 <b>2</b></span><span>partial <b>4 / 16</b></span><span>spec-only <b>12 / 16</b></span><span>실검수 <b>미확인</b></span></div><p>A12와 B7을 단순 합산하지 않고 홈·덱페이지·컬렉션3쌍을 통합했습니다. 보상/카드의 반복상태·상점 스크롤·튜토리얼 문구는 별도 전체판틀로 늘리지 않습니다.</p><p><a href="native-target-status.json">본체 전달 native 등록/진행 상태</a> · <a href="PRODUCTION_GUIDE.draft.md">제작 가이드 초안</a> · <a href="catalog.json">구조화 데이터</a> · <a href="catalog.md">관찰·분모 설명</a> · <a href="source-snapshots/video-a-analysis.md">영상 A 정본 스냅샷</a> · <a href="source-snapshots/video-b-inventory.md">영상 B 정본 스냅샷</a> · <a href="verification.json">파일 검증</a></p><section class="tools" aria-label="판틀 검색"><label>찾기 <input id="q" type="search" placeholder="예: 덱, 보상, 4열, CR09, 소셜"></label><label>구분 <select id="kind"><option value="all">전체</option><option value="game">고유 판틀16</option><option value="overlay">공통 튜토리얼</option><option value="state">보조 토스트</option><option value="external">제작 제외 · 외부2</option></select></label><output id="found" aria-live="polite">전체20항목</output></section><section class="cards">'''+cards+'''</section><h2>기존 샘플의 실제 저장 데이터</h2><p id="match-status">'''+E(samplematch['status'])+'''</p><p>기존 샘플 실제 계층·크기·폰트·상태·연결·자원은 별도 조사 담당 결과를 읽어 연결합니다. 원본 영상 픽셀을 기존 샘플 저장값으로 바꾸어 적지 않습니다.</p>'''+matchhtml+'''<h2>관찰된 전환 · 실제 클릭은 미확인</h2><p>31건은 두 영상의 화면 전후·상태·스크롤 관찰입니다. 실제 runtime 연결31개 또는 확인된 클릭31개가 아닙니다. 아래 입력은 모두 후보/추정입니다.</p><div class="table"><table><thead><tr><th>ID</th><th>영상</th><th>판틀</th><th>실제 관찰</th><th>입력 후보 · 추정</th></tr></thead><tbody>'''+connectionrows+'''</tbody></table></div><footer>codex(단이) · '''+E(now)+''' · 제안(검수 대기)<br>원본과 제품·설계·서버·공용 보고 무수정. 저장값·툴 실제 조립·실화면 검수·게임동작·최종시각승인은 별개입니다.</footer></main><script>
'use strict';
const input=document.getElementById('q'),kind=document.getElementById('kind'),out=document.getElementById('found'),cards=[...document.querySelectorAll('.family')];
function filterCatalog(){const q=input.value.trim().toLocaleLowerCase('ko'),k=kind.value;let count=0;for(const card of cards){const show=(k==='all'||card.dataset.kind===k)&&(!q||card.dataset.search.includes(q));card.hidden=!show;if(show)count++;}out.textContent=count+' / '+cards.length+'항목';}
input.addEventListener('input',filterCatalog);kind.addEventListener('change',filterCatalog);filterCatalog();
</script></body></html>'''
(O/'index.html').write_text(htmltxt)
md=['# Clash Royale 원본 UI 통합 카탈로그','',f'codex(단이) · {now} · 제안(검수 대기)','', '영상 A/B 정본의 저장 스냅샷과 실제 대표 JPG를 대조했습니다. 사용자 alias ‘클래시오브 클랜’은 출처에 보존하고 실게임명은 Clash Royale/클래시 로얄로 표기합니다.','', '## 분모와 상태','', '- 고유 게임 UI 판틀 후보16 = A12+B7−중복3(홈/덱페이지/컬렉션).','- CR17 공통 튜토리얼 overlay1군·CRS01 토스트1·외부CRX01/CRX02는주판틀16과별도.','- 프로젝트 등록됨·independent·4 partial / 12 spec-only·미검수. native 화면4개ID수신, 실제부품/연결수·최종revision·제품사용승인은미확인.','- CR07 Home(main)·CR08 Deck·CR10 KnightDetail(overlay/뒤덱자원0)·CR15 Social의4편집링크연결. workspace-2a3dc8e9-dcd3-4c88-a98a-231991656500 / ux-ea29177e, 마지막전달r43·이후Social조립중. native-target-status.json에정확screenID/출처/URL보존.','- Fixture는XP17/골드118/보석100/기사Lv1 2/2/평균엘릭서3.6. 이전3.5제작fixture는사용안함. B홈은배치참고이며다른자원/카드상태를섞지않음.','- 31건의전환/상태/스크롤은원본관찰이며runtime edge/확인된실제클릭아님.','- 원본1080×2340픽셀근사계층과샘플실제논리저장값을구분. 폰트/앵커/슬라이스/정책미정.','- 아레나·유닛/타워·홈디오라마·카드시연3D제작제외. UI HUD와장면참조만분리.','', '## 고유 판틀 대응표','', '| stable ID | 판틀 | 합친 원본 | 유지/병합 근거 |','|---|---|---|---|']
for f in families:md.append('| '+f['id']+' | '+f['nameKo']+' | '+', '.join(f['sourceFamilyIds'])+' | '+f['dedupReason']+' |')
md+=['', '## 보존한 실제 시각·해시','', '각family의representativeRef는catalog.json.references로연결하며requestedSeconds/actualSeconds/sourceIndexSnapshot/sourceIndexEntry/sourceFramePath/sha256을보존합니다. refs/는원본JPG의바이트동일복사입니다. 각index.json도source-snapshots/에고정했습니다.','', 'A/B 원본분석이후갱신되면현재스냅샷hash와다름을검출하며기존판을조용히덮어쓰지않습니다. raw영상은복사·수정하지않습니다.','', '## 기존 샘플 데이터 매칭','', samplematch['status'],samplematch['note'],'매칭키: home_toolbar→CR07/09/15/16, collection_four_columns/album_card_family→CR08/09/13, social_tabs_rows→CR15, shop_products→CR16, card_detail_surrogate→CR10. 모두부분참고/근접예제이며원본동등·조립완료를뜻하지않음.','', '## 명확히 남긴 미확인','', '- 실제터치좌표/탭과스와이프·닫기입력·자동타이머차이.','- 전투2의끝/결과,미관찰카드상세·다른탭/분류/상품/Info목적지.','- 결제·차감·보상·카드드래그·저장·게임API연결.','- 실제Unity계층/논리좌표/폰트/재질/9slice/3D렌더링설정.','- UI스튜디오native등록/조립/반응형·키보드/상태실검수/원본최종동등.','', '## 산출물','', '- index.html:정적검색/구분/대표/상태/계층/미확인열람. 새패키지/서버/에디터런타임없음.','- catalog.json:stablefamily·출처·상태·전환·샘플매칭·조립경계.','- source-snapshots/:분석JSON/MD와참조index들의고정스냅샷.','- refs/:원본비교용JPG바이트동일복사. production자원아님.','- verify_catalog.py/verification.json:실행한파일/참조/시간/해시검증. 제품시험/브라우저검수아님.','']
(O/'catalog.md').write_text('\n'.join(md))
dump(O/'snapshot-manifest.json',{'capturedAtKST':now,'sources':manifest})
print(json.dumps({'families':16,'commonOverlay':1,'externalExcluded':2,'ancillaryToast':1,'references':len(references),'connectionsObserved':len(connections),'sampleMatchStatus':samplematch['status'],'out':str(O)},ensure_ascii=False))
