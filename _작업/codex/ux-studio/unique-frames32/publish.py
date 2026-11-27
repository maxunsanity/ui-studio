from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import json,hashlib,shutil,html
from PIL import Image,ImageDraw,ImageFont
P=Path('/Users/max/projest_max/ui-studio');G=P/'src/tools/uxStudio/guide';R=P/'docs/reference/monopoly-go/video-analysis-20261117';E=P/'docs/evidence/20261117-unique-frames32';W=P/'_작업/codex/ux-studio/unique-frames32'
if (W/'publish32-summary.json').exists(): raise SystemExit('Already published .32; this is a one-shot archive writer.')
D=P/'samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json';d=json.loads(D.read_text());assert d['revision']==352
now=datetime.now(ZoneInfo('Asia/Seoul')).isoformat();ver='2026-11-17.32'; names=['Modal_Showroom_TokenDetail','Page_Tournament_ClassBenefits','Modal_Event_BeanstalkDetails'];families=['showroom-token-detail','tournament-class-preview','beanstalk-bonanza-details'];titles=['쇼룸 토큰 확대 상세','클래스 혜택 안내','콩나무 노다지 획득 안내'];imgs=['showroom','class','bean'];screens=[next(s for s in d['screens'] if s['name']==n) for n in names];counts=[len(s['elements']) for s in screens];total=sum(len(s['elements']) for s in d['screens']);sha=hashlib.sha256(D.read_bytes()).hexdigest()
assert total==1277 and counts==[28,55,50] and len(d['transitions'])==25
shutil.copy2(D,E/'confirmed-native-r352-design.json');shutil.copy2(W/'final-file-verification.json',E/'file-verification.json')
# Unmodified real screenshots, laid out for review. Pixel dimensions are recorded separately from CSS viewport.
canvas=Image.new('RGB',(1920,1168),'#162332');draw=ImageDraw.Draw(canvas);font='/System/Library/Fonts/AppleSDGothicNeo.ttc'
try:titleFont=ImageFont.truetype(font,32);smallFont=ImageFont.truetype(font,20)
except OSError:titleFont=smallFont=ImageFont.load_default()
for i,(n,t) in enumerate(zip(imgs,titles)):
 im=Image.open(E/(n+'-phone.jpg'));x=31+i*641;draw.text((x,16),t,fill='white',font=titleFont);canvas.paste(im,(x,67));draw.text((x,1115),f'r352 · {counts[i]}부품 · 실제 소비자 렌더',fill='#b9d8e9',font=smallFont)
canvas.save(E/'three-frames-1920.jpg',quality=95)
ref=R/'unique-frames32';ref.mkdir(exist_ok=True)
for n in imgs:shutil.copy2(E/(n+'-phone.jpg'),ref/(n+'-phone.jpg'))
shutil.copy2(E/'three-frames-1920.jpg',ref/'three-frames-1920.jpg')
review=G/'reference/monopoly-go-video-20261117/unique-frame-review.html';shutil.copy2(review,R/'unique-frame-review.html')
impl=[]
for f,s,n in zip(families,screens,imgs):
 impl.append({'family':f,'screenId':s['id'],'name':s['name'],'parts':len(s['elements']),'state':'native assembly / proposal awaiting review; source equivalence incomplete','currentRevision':352,'evidence':'unique-frames32/'+n+'-phone.jpg','evidenceRevision':352,'runtimeEntrance':None,'runtimeCheck':'separate in-memory fixture opener; original saved target screen unchanged','remaining':['source font/material/micro slice-seam precision','unknown source entrance and game outcomes remain unset']})
impl[0]['remaining']+=['equipping/previous/next/info game action unobserved','underlay reuses existing shield cabinet; token-list variant not assembled','new equip uses basic tint; separate 3D pressed illustration not produced']
impl[1]['remaining']+=['information/trophy destination unobserved']
impl[2]['remaining']+=['observed 5000-reward tooltip not assembled; trigger unknown']
q=json.loads((R/'unique-frame-selection.json').read_text());q.setdefault('history',[]).append({'asOf':q['asOf'],'phase':'selection-only','newProductUI':q['newProductUI'],'designChanged':q['designChanged'],'basis':q['basis']});q['asOf']=now;q['newProductUI']=3;q['designChanged']=True;q['productionStatus']={'revision':352,'screens':17,'parts':total,'connections':25,'newNativeFrames':impl,'excludedSimilarFamilies':14,'fullEquivalenceApproval':False,'sourceSHA256':sha}
for r in q['selection']:
 if r['family'] in families:r['nativeImplementation']=impl[families.index(r['family'])]
(R/'unique-frame-selection.json').write_text(json.dumps(q,ensure_ascii=False,indent=2))
a=json.loads((R/'implementation-progress.json').read_text());a.setdefault('history',[]).append({k:a[k] for k in ['asOf','currentRevision','screens','parts','connections','newGameFamiliesInProgress','newGameFamiliesNotStarted']});a.update(asOf=now,currentRevision=352,screens=17,parts=total,connections=25,newGameFamiliesInProgress=7,newGameFamiliesNotStarted=14);a['newUI']+=impl;a['activeProductionScope'].update(asOf=now,nativeFramesAssembled=3,remainingNewFrameCandidates=[],remaining='source precision/unknown actions/reward tooltip; similar14 excluded from new-frame production, not content-complete',newNativeFrames=impl);(R/'implementation-progress.json').write_text(json.dumps(a,ensure_ascii=False,indent=2))
b=json.loads((R/'missing-ui-plan.json').read_text());b['activeProductionScope']=a['activeProductionScope'];b['generatedAt']=now
for row in b['queue']:
 if row['family'] in families:row.update(status='native proposal; equivalence/game incomplete',nativeImplementation=impl[families.index(row['family'])])
(R/'missing-ui-plan.json').write_text(json.dumps(b,ensure_ascii=False,indent=2))
summary=f'''## .32 · 고유 프레임 3종 실제 조립 / r352
현중 “분류해서 작업 계속 진행해”에 따라 새 판틀3종만 native UI로 제작했습니다. 현재 ux-gjs-0d80d7fe r352, 17화면/{total}부품/25연결이며 기존r335의14화면·22연결은 전체동일로 보존했습니다. 쇼룸28/클래스55/콩나무50부품, 새3연결은 각각닫기/Back뿐입니다. 유사14종은재사용분류이며 내용/동작완료로세지않습니다.

새 원화3종과 editable SVG기하27종(기존판/교정판포함)을 보존했습니다. 원화 PNG/프롬프트·production/staging SHA, native text/image/frame/input/부모를분리합니다. 같은역할은같은가이드: 콩나무3열148×281·Title148×42·Card84×114·IconSlot58×77(contain; ?는native문자)·Amount48×38·Bean28×29. 외곽444×281백판1개/구분선2개만두고각열중복백판은제거했습니다. 공통Footer72/Hit44/Glyph28 유지, 쇼룸EquipDock102+별도extension60/Btn244×72, 콩나무는footer없는floatingClose44/28+별도40투명링입니다. 이수치는제작제안이며원본Unity설정/사용자수치승인으로쓰지않습니다.

큰 실제캡처와별도실행판은 [3종 비교](reference/monopoly-go-video-20261117/unique-frame-selection.html#production-r352), [저장본 실행 검수](reference/monopoly-go-video-20261117/unique-frame-review.html)에서봅니다. 검수판은저장된 target화면을그대로실행하고메모리사본의배후페이지에만QA진입버튼1개를넣습니다. 원본설계파일을고치거나미확인게임입구를구현한것이아닙니다. 소스/실화면/제작과검수용fixture를구분합니다.

본체이번npm test544/544·fail0, 파일검증은docs/evidence/20261117-unique-frames32/file-verification.json, 실제QA는browser-qa.json을읽습니다. CSS1440×900/430×843에서3종이미지실패·loading·가로/세로넘침0, editor기기390×844/430×932에서6case 비례/고정root를읽었습니다. runtime소비자에서새Close/Backclick·Enter/Space/Escape·모달배후inert/초점복귀를확인했습니다. 장착2초mouse에서normal→pressed→hover실제상태, 외부엔진그림자를확인했으며새별도3Dpressed원화의완료로세지않습니다. 원본폰트/세부재질/미세9slice경계선, 장착/좌우탐색/Info/트로피·미확인입구, 콩나무5000tooltip은미완료입니다. Showroom배후는기존방패진열장재사용이며토큰목록본문동등은미완료입니다.

W/P/U/S0/4·원본10장최종동등0/10·제안(검수대기),7018only/7007제외/uiPAUSED·프로젝트guide.4보존입니다. 공통연출demo의보조×와실제consumer닫기는다른경로이며현재demo내role=button닫기는별도보완필요(main953근방). 실제닫기성공은위명시한소비자fixture범위입니다. 카피2차dirty탭보존때문에공유main.mjs/HMR/서버재시작을진행하지않았습니다.

'''
for fn in ['AI_GUIDE.md','TOOL_SPEC.md','PROGRESS.md','COMMON_UI_RULES.md','FRAME_SELECTION.md']:
 f=G/fn;f.write_text(summary+f.read_text())
with (G/'FRAME_SELECTION.md').open('a') as f:f.write('''\n## .32 재현 가능한 제작 절차와 이번 교정\n1. 기존17미착수의 이름이 아니라 외곽·분할·고정부·scroll·Close를대조하여고유3/유사14로분류한다. 같은유형의다른그림을새프레임으로증가시키지않는다.\n2. 원본픽셀을폭551의단일비율로환산하고, 보이는그림/글자/프레임/입력/부모를명시한다. 화면비율이달라도x/y를각각늘리지않는다. 공통역할숫자와개별그림의가시실루엣을구분한다.\n3. 이미지는새로그리되UI문구/수치/가격을굽지않는다. body/장식/9slice/고정아이콘/텍스트/히트는별도등록한다. 외부그림자는엔진,입체물체의면명암은원화에둔다. 생성성공/등록성공/시각승인은별개다.\n4. native복제는행동·그림자도복사한다. 이번좌우/장착의기존GalleryBack은삭제했고, Close설명과SNS/Info자식이름도새영역으로수정했다. 최상위붙여넣기의2%offset/legacy%평탄화는명시앵커로다시적용한다. AX현재필드값변경→Tab→저장값재읽기를확인하며locator.fill만으로확정되었다고하지않는다.\n5. 부모그룹Header/Timer/Name/Category는top-fixed,확대전시/혜택본문/이벤트판은center-fixed,EquipDock/Footer/Close는bottom-fixed로이번시안에적용했다. 원본의실제앵커는미확인이다. 기기별가이드와아이콘비율을실제renderer에서확인한다.\n6. 딤1겹을직접부품으로쓰면presentation.dim은false,blocking은true로두고opaque하단은딤보다앞에둔다. 이번extension→dim잘못된저장순서를교정했다.\n7. source처럼전체3열이한판이면각열에둥근백판/그림자를중복하지않는다. 카드안의다른형상은같은IconSlot에서contain으로맞추고실루엣을찌그러뜨리지않는다.\n8. 타이머는실제문구길이를확인하고font/상자폭/한줄을정한다. 클래스42일12시간·콩나무12시간44분의잘림을실물에서발견해교정했다. cloudcap끝색#00bddc를본문과맞춘v002와실제이음선을재검수했다. floatingClose는투명40링과흰28glyph/44hit로구분한다.\n9. 실제입구가불명확하면저장targetnull을유지한다. 검수fixture임시입구는제작입구로세지않고fixture표시·저장본동일·정식소비자renderer·원본불변을기록한다.\n10. 이름은Txt_Class_ProfileLevel/Txt_Class_Reward_DiceAmount/Txt_Beanstalk_Tile_Community_BeanAmount처럼영역/역할/값을읽을수있게한다. 안정ID/부모/연결은이름교정때재발급하지않는다. 아직게임실행값키는제공되지않았으므로창작해확정하지않는다.\n''')
i=json.loads((G/'index.json').read_text());i['version']=ver;(G/'index.json').write_text(json.dumps(i,ensure_ascii=False,indent=2));t=json.loads((G/'COMMON_UI_TOKENS.json').read_text());t['guideVersion']=ver;t['profiles']['monopoly-go']['newFrameProductionPolicy'].update(status='native3 assembled r352; proposal/unknown entrances pending',newNativeFrames=impl);t['profiles']['monopoly-go']['uniqueFrames32']={'basis':[551,984],'revision':352,'showroom':{'parts':28,'equipDock':[551,102],'extension':[551,60],'equip':[244,72],'footerRef':'profiles.monopoly-go.footer'},'classBenefits':{'parts':55,'benefitSlot':[84,92],'footerRef':'profiles.monopoly-go.footer'},'beanstalk':{'parts':50,'tilePanel':[444,281],'tileGroup':[148,281],'title':[148,42],'card':[84,114],'iconSlot':[58,77],'amount':[48,38],'bean':[28,29],'floatingClose':{'hit':[44,44],'glyph':[28,28],'ring':[40,40],'bottom':8}},'valuesApprovedByUser':False};(G/'COMMON_UI_TOKENS.json').write_text(json.dumps(t,ensure_ascii=False,indent=2))
with (G/'README.md').open('a') as f:f.write('\n\n'+summary)
with (P/'AGENTS.md').open('a') as f:f.write('\n\n### 최신 .32 · 신규3프레임 native r352\n'+summary)
with (G/'ARCHITECTURE.md').open('a') as f:f.write('''\n\n## .32 검수판과 저장 형식의 구분\nreference/monopoly-go-video-20261117/unique-frame-review.html은테스트fixture페이지입니다. GET저장본→structuredClone→배후페이지에검수용opener1개→mountDesignConsumer라는흐름이며설계POST/파일저장/게임동작/실제입구추가를하지않습니다. 공통연출demo시연과runtime소비자입력검수를구분합니다. 검수결과는docs/evidence/20261117-unique-frames32/입니다.\n2차의save-plugin.mjs compact직렬화보완과신규6시험은소스에있고본체전체544/544도확인했습니다. 숫자2MB/이미지300KB·검증·409·잠금·백업은유지합니다. 이번실행중7018의파일은아직pretty저장(handler캐시)이고2차dirty탭때문에서버재시작/브라우저reload는보류했습니다. 소스구현을실행서버반영완료로적지않습니다.\n''')
# Append evidence section without replacing source-selection tables/history.
cards=''.join(f'<figure><figcaption>{html.escape(tt)} · r352 · {len(ss["elements"])}부품</figcaption><img alt="실제 조립 {html.escape(tt)}" src="unique-frames32/{nn}-phone.jpg"><p><a href="/ui-studio/?editor=detail&amp;project=ux-gjs-0d80d7fe&amp;workspace=workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6&amp;screen={ss["id"]}">실제 툴에서 보기</a></p></figure>' for tt,ss,nn in zip(titles,screens,imgs))
section='<section id="production-r352" style="padding:20px"><h2>실제 조립본 · 고유3종 r352</h2><p>새3판틀 native조립/저장·소비자fixture검수. 유사14종은신규제작제외이며내용완료아님. 원본폰트/재질/미확인입구·게임동작미완료,제안(검수대기).</p><p><a href="unique-frame-review.html">저장본 실행 검수 열기</a></p><div class="new-native32">'+cards+'</div></section><style>.new-native32{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.new-native32 figure{margin:0;min-width:0}.new-native32 img{width:100%;height:640px;object-fit:contain}.new-native32 figcaption{font-weight:800}@media(max-width:800px){.new-native32{grid-template-columns:1fr}.new-native32 img{height:auto}}</style>'
h=(R/'unique-frame-selection.html').read_text();h=h.replace('</body>',section+'</body>') if '</body>' in h else h+section;(R/'unique-frame-selection.html').write_text(h)
h=(R/'index.html').read_text();note=f'<aside style="padding:16px;border:2px solid #6fa7ad"><strong>.32 · 신규3프레임 실제 조립 r352</strong><p>17화면/{total}부품/25연결, 고유3종조립/유사14종제외. <a href="unique-frame-selection.html#production-r352">실제3종캡처와제작기록</a> · <a href="unique-frame-review.html">저장본실행검수</a>. 전체게임/시각동등/원본입구완료아님.</p></aside>'
h=h.replace('<body>','<body>'+note,1) if '<body>' in h else note+h;(R/'index.html').write_text(h)
(W/'publish32-summary.json').write_text(json.dumps({'asOf':now,'revision':352,'screens':17,'parts':total,'edges':25,'newParts':counts,'sha256':sha,'bytes':D.stat().st_size,'guideVersion':ver,'guideSections':len(i['sections']),'sourceTests':544,'newFrameFixtureEntrancesAreProduction':False},ensure_ascii=False,indent=2));print((W/'publish32-summary.json').read_text())
