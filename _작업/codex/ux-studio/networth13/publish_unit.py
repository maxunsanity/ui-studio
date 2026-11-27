from pathlib import Path
import json,shutil,datetime
R=Path('/Users/max/projest_max/ui-studio');G=R/'src/tools/uxStudio/guide';D=R/'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';d=json.loads(D.read_text());qa=json.loads((R/'docs/evidence/20261117-networth-stage-map/native-qa.json').read_text());v='2026-11-17.30';r=d['revision'];parts=sum(len(s['elements']) for s in d['screens']);gallery=next(s for s in d['screens'] if s['name']=='Page_NetWorth_Gallery');mp=next(s for s in d['screens'] if s['name']=='Page_StageMap_16_17_18');now=datetime.datetime.now().astimezone().isoformat()
assert r==335 and len(d['screens'])==14 and parts==1144 and len(d['transitions'])==22
summary=f'''## .30 · 재산 갤러리·스테이지 지도 native 제작

현재 ux-gjs-0d80d7fe r{r}:14화면/{parts}부품/22연결입니다. 기존 r300의12화면과20연결은 보존했습니다. Gallery189부품/16카드·4frame family, Main→메뉴→NET WORTH→Gallery/×·Enter·Space 복귀를 실제 검수했습니다. 세로 스크롤에서 점수패 bodyY671→219 고정과 역복귀, 1440×900·430×843 CSS의 이미지 실패0/가로넘침0을 확인했습니다. 현재 점수패 source150×88 v002/표시141×83이며 native538은 별도입니다.

Stage Map15부품은16도쿄/17리틀M의방/18모나코, 3개부모그룹·장면그림·3슬라이스리본·native이름·별도금lock 구조입니다. 새 컬러3종과 청록 잠김2종을 만들었으며 정적3D참고이고 live3D가 아닙니다. 부모334×320 고정앵커/리본334×76/글자290×40·26px를 설계551·기기390/430에서 재검수했습니다. 같은 비율을 `%`높이로 늘리던387.76/388.36px 문제를 native앵커로320.00px로 바로잡았습니다. 원본에 보이지 않은 footer/Back/수동scroll/카드클릭은 추가하지 않았고 진입·이동·해제 조건은 미정으로 남겼습니다.

전체 npm test538/538·실패0, 독립리뷰22/22입니다(합산하지 않음). W/P/U/S0/4·10장 최종동등0/10이며 테스트/부품 수는 완성률이 아닙니다. 21개 신규family 중4개 제작중/17개 미착수·기존Showroom하위종류도 미완료입니다. Gallery도어전환·Map말이동/해제/19아틀란티스·원본서체/재질/게임동작/최종시각동등은 미완료입니다. 7018only·7007수정0·ui PAUSED·프로젝트guide.4 보존.

실제 증거는 docs/evidence/20261117-networth-stage-map/, 보고는 docs/collaboration/reports/20261117_networth13.md를 읽습니다. [이번 제작 규칙](GALLERY_MAP_RECIPE.md)은 같은 내장 가이드에 보존했습니다. r300 입체 버튼 제작법 컨펌(.29)은 유지하며 모든 수치·전체시각 승인으로 확대하지 않습니다.

'''
for name in ['AI_GUIDE.md','USER_GUIDE.md','TOOL_SPEC.md','ARCHITECTURE.md','PROGRESS.md','COMMON_UI_RULES.md','README.md']:
 p=G/name;p.write_text(summary+p.read_text())
recipe='''# 재산 갤러리·지도 제작 recipe · .30
상태: 구현·실제 검수 범위와 제안/미확인을 구분합니다. 최신 공통 규칙·숫자는 COMMON_UI_RULES.md/COMMON_UI_TOKENS.json을 우선합니다.

## 원본과 공통 family
진입 확대/축소 중인 프레임은 크기 정본으로 쓰지 않습니다. 안정 프레임을 비교한 뒤 같은 family의 외곽/아이콘/글자/기준선을 정합니다. MGV03-S02의 D1.5초는 진입 배율이고 E/F를 함께 봅니다. SourceROI는 이미지 비교좌표이며 Unity 원본 논리크기/카메라/계층의 증거가 아닙니다.

Gallery의4family 공통 규격(제작 제안):

|family|외곽W×H|이미지 local[x,y,w,h]|caption local[x,y,w,h]|
|---|---|---|---|
|silver-cyan|180×276|28,70,116,141|24,216,132,39|
|bronze-orange|164×261|26,65,110,140|20,211,124,28|
|prismatic-purple-gold|188×304|39,90,108,141|30,238,130,31|
|gold-highlight|184×292|29,78,123,143|23,226,138,30|

카드마다BG/9sliceFrame/Crest/NumberPlate/Art/Txt_Value/Txt_Caption/ValueStar를 분리합니다. 프레임128²의slice24·화면edge18은현재family값입니다. 숫자24px/900/line30·caption16px/800/line20, 숫자와caption은 native입니다. 표시만하는 카드를 가짜 버튼으로 만들지 않습니다. 140의 잘린이름·원화는 비워두며 임의 보상/가격을 넣지 않습니다. 600/575잠금은현재관찰상태이며 게임해제조건이 아닙니다. 프레임외부그림자는엔진효과입니다.

## 스크롤 부모와 고정점수패
Viewport551×912→Content551×3350의 명시고정크기를 사용합니다. 점수패Group의naturalY639/H121, scrollPin.top187이며 imagebody는group+32여서원래671/고정219가됩니다. 숫자/별/화살표도같은그룹의자식입니다. top은가장가까운세로scrollport 내부논리px이고, 조상/자손중복pin은지원하지않습니다. 역스크롤원위치와부모끝경계도시험합니다.

Native설정:부품선택→속성→배치→응답형배치·안전영역→‘세로 스크롤 고정’켜짐→‘스크롤 영역 위에서 고정 px’. optional scrollPin은v4만허용되며끔은속성삭제입니다. Sharedrenderer가편집/실행/consumer에서같이적용하고scroll/resize갱신·dispose를합니다.

Native브라우저막대가19px를차지해점수패가잘렸습니다. 커스텀진행레일을쓰는경우같은패널의‘브라우저 스크롤바’→‘숨김 · 스크롤 유지’를선택합니다. optional scrollbar:'hidden'은scrollbar-width:none만적용하며overflowY:auto를유지합니다. 기본값은기본표시, 다른설계는자동변경되지않습니다. viewport를부모밖으로넓히거나그림을찌그러뜨려잘림을감추지않습니다. 실제clientWidth532→551과nativewheel고정/역복귀를확인했습니다.

## 지도 장면·리본·상태
원본MGV04-S01/MGV05-S04에는footer/X/Back·수동scroll·카드클릭증거가없습니다. 습관적으로공통footer를붙이지않고미관찰이동은targetnull로남깁니다. 닫을수없는static구조는툴의화면선택→동작시험으로검수하며게임진입구현으로쓰지않습니다.

Group_StageMap_{번호}_{역할}의자식은 Slot_3DReference_Stage{번호}, Frame_StageMap_{번호}_Ribbon→Txt_StageMap_{번호}_Name, 필요한 Img_StageMap_{번호}_ClosedLock입니다. scene은새로그린2D/3D참고이며실제3D모델·카메라가아닙니다. 고정슬롯334×320,리본334×76,글자290×40/26px/800/line32·white+outline1,lock82×110입니다. stage16은원화종횡비때문에리본localY213,17은236,18은234인명시내용variant이며리본크기를각각바꾸지않습니다.

부모에%높이만쓰면긴폰에서320이약388로늘어납니다. 그룹은고정논리크기앵커,자식은그안의local비율,scene이미지는contain으로종횡비를유지합니다. 배경만cover로화면을채우고UI를한장으로늘리지않습니다. 설계551/기기390×844·430×932에서같은리본/글자/그룹크기를실측합니다. 전체페이지가화면높이에reflow되는것과아이콘/입체원화의비율유지는별개입니다.

컬러와청록잠김scene은같은원화canvas/crop/배율/바닥을공유합니다. 상태별tightcrop/재중앙정렬금지. 이번imagegen편집은실루엣겹침LittleM99.6922%/Monaco99.4491%로완전일치가아니며Monaco바닥약0.4출력px차이가남습니다. 리본/텍스트/금lock까지청록으로일괄tint하지않습니다. 19아틀란티스는관찰문구지만신규컬러원화/구성은미완료입니다. 말이동/광선/열림lock/fade/자동발생게임조건은별도후속작업입니다.

## 파일·이름·입력·검수
공통리소스 common_stage-map-{role}_diorama_{normal|locked}_v001,장식 common_map_{role}_v001. authoring은원본/프롬프트/PNG/SVG/manifest,production은등록최적화자원,staging은동일SHA의툴등록경로입니다. WebP300KB미만·실제alpha·sameaspect를검사합니다. 공통3D참고주사위단면은.29의기준면/소실점/먼쪽단축/작은눌림원칙을따르고카메라숫자를전역상수로복사하지않습니다.

설계는nativeUI로만편집합니다. 다른화면복사후화면→레이어를열고현재선택ID를다시확인합니다. 붙여넣기는기본+2%offset이있으니공통좌표로다시맞춥니다. 복제부품은부모역할에맞춰BG/Frame/Img/Txt명을모두검사합니다. 기존ID/parent/연결을이름때문에재발급하지않습니다. 화면이동대상과행동을정한후실행조건을마지막에확인합니다(대상없는navigate/open은미정조건으로보완됨). locator입력성공만으로저장성공을판정하지않고Tab→재표시→저장→재열기→실행까지확인합니다.

CSSviewport와캡처실제px를함께기록합니다. IAB의DPR/페이지배율로clip이잘못잘리면원본전체캡처를보존하고실제영역을확인해별도crop합니다. 이번잘못된clip파일은비교이력이며최종증거는map-game-from-full.png입니다. 캡처/원화생성/시험개수를전체동등완료율로쓰지않습니다.
'''
(G/'GALLERY_MAP_RECIPE.md').write_text(recipe)
p=G/'index.json';j=json.loads(p.read_text());j['version']=v;p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
p=G/'COMMON_UI_TOKENS.json';j=json.loads(p.read_text());j['guideVersion']=v;profile=j['profiles']['monopoly-go'];profile['netWorthGallery']={'status':'native proposal; final visual equivalence pending','basis':[551,984],'viewport':[551,912],'content':[551,3350],'cards':{'silver-cyan':[180,276],'bronze-orange':[164,261],'prismatic-purple-gold':[188,304],'gold-highlight':[184,292]},'marker':{'group':[399,639,141,121],'scrollPinTop':187,'bodyLocalY':32,'bodyNaturalY':671,'bodyPinnedY':219,'bodyImage':[141,83],'nativeNumberBox':[17,64,107,32]},'footerRef':'profiles.monopoly-go.footer','unknown140':'caption/art null','observedMilestones':[600,575,550,500,450,400,350,325,300,275,250,225,200,180,160,140]};profile['stageMap']={'status':'static native locked17 composition; source movement/unlock/game conditions pending','basis':[551,984],'groupSize':[334,320],'anchor':'top-left fixed logical size','sceneFit':'contain','backgroundFit':'cover','ribbon':{'size':[334,76],'slice':[0,48,0,48],'edges':[0,32,0,32]},'name':{'size':[290,40],'fontSize':26,'weight':800,'lineHeight':32,'stroke':1},'lock':[82,110],'footer':None,'manualScroll':None,'runtimeEntryTarget':None,'stagesObserved':[16,17,18,19],'stagesAssembled':[16,17,18],'sceneKind':'new 2D illustration, static3D reference; no 3D runtime','artVariants':'same source canvas/crop/scale; normal and locked separate'};j['implementationHistory'].append({'asOf':now,'revision':r,'summary':'Gallery189/Map15 native; marker pin and optional hidden scrollbar; fixed parent guides preserve ratios'});j['latestImplementationSnapshot']={'asOf':now,'projectId':d['projectId'],'revision':r,'screens':14,'parts':parts,'connections':22,'guideVersion':v,'acceptance':'W/P/U/S0/4; final equivalence0/10'};p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
for name in ['AGENTS.md','README.md']:
 p=R/name;p.write_text(p.read_text()+'\n\n'+summary)
p=R/'tools/ux-studio/current-review.json';j=json.loads(p.read_text());j['label']=f'Monopoly GO r{r} - Net Worth Gallery and static Stage Map; remaining animations/visual review pending';j['status']='native implementation proposal; r300 3D button method user-confirmed, full-game visual approval pending';p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
B=R/'docs/reference/monopoly-go/video-analysis-20261117';P=R/'src/tools/uxStudio/guide/reference/monopoly-go-video-20261117';ip=json.loads((B/'implementation-progress.json').read_text());ip.update(asOf=now,currentRevision=r,screens=14,parts=parts,connections=22,newGameFamiliesInProgress=4,newGameFamiliesNotStarted=17)
for u in ip['newUI']:u['currentRevision']=r
ip['newUI']+=[{'family':'net-worth-gallery','screenId':gallery['id'],'name':gallery['name'],'parts':len(gallery['elements']),'state':'native16cards/4families; scroll pin/header/footer/menu/back/device/save-reopen verified; source final equivalence incomplete','evidence':'implementation/gallery-r326-full.png','evidenceRevision':326,'currentRevision':r,'remaining':['door entrance/exit animation','partial140 caption/art','locked art/final frame materials and original font','Info/card game behavior and source exact API']},{'family':'stage-map','screenId':mp['id'],'name':mp['name'],'parts':len(mp['elements']),'state':'native16/17/18 static locked composition; separate parent/scene/ribbon/name/lock; device guide sizes verified','evidence':'implementation/map-r335-game.png','evidenceRevision':335,'currentRevision':r,'remaining':['pawn/unlock/rays/fade movement','stage19 Atlantis art/state','observed entry/exit visual sequence and game conditions','live3D/source exact font/final artwork equivalence'],'entryPolicy':'no invented footer/back/manual scroll/card action; editor selection/play for review'}]
(B/'implementation-progress.json').write_text(json.dumps(ip,ensure_ascii=False,indent=2)+'\n');(P/'implementation-progress.json').write_text(json.dumps(ip,ensure_ascii=False,indent=2)+'\n')
impl=B/'implementation';impl.mkdir(exist_ok=True)
for src,dst in [('docs/evidence/20261117-networth-stage-map/gallery-1440.png','gallery-r326-full.png'),('docs/evidence/20261117-networth-stage-map/map-game-from-full.png','map-r335-game.png'),('docs/evidence/20261117-networth-stage-map/native-qa.json','native-r335-qa.json')]:shutil.copy2(R/src,impl/dst)
section=f'''<section id="native-gallery-map-r335"><h2>최신 실제 제작 · r{r} · 가이드 .30</h2><p>14화면·{parts}부품·22연결. Gallery16카드4family/고정점수패·메뉴/복귀 검수. StageMap16·17·18의 새 장면그림/리본/native글자/lock을 분리했습니다. 신규21family중4제작중/17미착수이며 최종동등 완료 수가 아닙니다.</p><p><a href="implementation-progress.json">현재 제작 현황 JSON</a> · <a href="implementation/native-r335-qa.json">이번 실제 기기·스크롤 검수</a></p><figure><img src="implementation/gallery-r326-full.png" alt="실제 Gallery r326; CSS1440×900, capture1800×1125"><figcaption>실제 갤러리·메뉴/닫기·고정점수패. 도어전환·원본서체/재질·부분140은 미완료.</figcaption></figure><figure><img src="implementation/map-r335-game.png" alt="실제 Map r335 native screenshot crop330×590"><figcaption>원본 전체2250×1406의 확인된 게임영역 crop330×590. 정적3D참고이며 말이동/해제/19/게임연결 미완료. 원본에 없는 footer·Back·수동scroll·입력은 추가하지 않았습니다.</figcaption></figure></section>'''
p=B/'index.html';html=p.read_text();assert 'native-gallery-map-r335' not in html;html=html.replace('</main>',section+'</main>') if '</main>' in html else html.replace('</body>',section+'</body>');p.write_text(html)
shutil.copy2(D,R/'docs/evidence/20261117-networth-stage-map/confirmed-native-r335-design.json')
print(json.dumps({'revision':r,'screens':14,'parts':parts,'connections':22,'guide':v,'gallery':len(gallery['elements']),'map':len(mp['elements'])}))
