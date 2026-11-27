# 건물 내부·업그레이드 조건 — native 제작 명세 v001

작성 codex(단이), 2026-11-18 13:22 KST. **제안(검수 대기), 조립 전 계획자료. 실제 저장 설계가 아닙니다.**

본체가 실제 툴 조립을 맡습니다. 하위 세션의 CUA `createBrowserTab("iab")`는 `Browser is not available: iab`, `getState`는 browsers=[]였습니다. 다른 native Chrome/부모 탭으로 우회하지 않았습니다. 설계 projectId/screenId/부품 생성·저장·재열기·미리보기·1440/430 실화면 검수는 이번 하위 작업에서 미실행입니다.

대상 workspace: `workspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc`; 원본 본체 설계 `ux-25ecc98a`. 기존 설계/공통소스/다른작업/샘플 저장JSON 변경0. 본체가 원래 계획의 별도 document를 만들지, 본체 원설계에 바로 두 화면을 조립할지는 본체 최신 배정에 따릅니다. 본 문서는 두 경우 모두 동일 native 편집용 수치표이며 가져오기/주입 payload가 아닙니다.

## 읽고 실제 본 자료

- 공통 `guide/START_PROJECT_GUIDE.md`, `USER_GUIDE.md` .35/복사/단독샘플 절, `UX_WORKFLOW_GUIDE.md`, `AI_GUIDE.md` 관련절, `COMMON_UI_RULES.md`, `skins.mjs`의 기존 preset 수치.
- 대상 샘플의 `ui-studio/AGENTS.md`, README, project.json, integration.md: independent/guideVersion2026-11-18.35 확인.
- `video-b/inventory.json`의 TSV03-07·08과 두 reference JPG를 실제 view_image로 확인. 504×894이며 구역 좌표는 추출팀의 **영상 픽셀 육안 근사**입니다. Unity 계층/히트영역/정확한 폰트가 아닙니다.
- `sample-match/selected-layout-evidence.md`, `screens/monopoly-go--Page_Build_City.json`, `screens/capybara-go--Page_Capybara_Equipment.json`의 실제 저장값을 직접 읽었습니다. 아래 sample box는 저장된 부모%를 재귀 환산한 값이며 이번 브라우저측정값이 아닙니다.

## 유사 샘플의 실제 값과 대상 차이

|근거|실제 저장값|대상에 적용할 것/차이|
|---|---|---|
|Capy Equipment r90 / `ux-gjs-4e64eb72` / `screen-8f1fd496-43e7-4619-b5b6-405238083d5b`|504×894, 정적캐릭터136,152,232,184; slot01=6,586,92,96; slot02=106,586,92,96; 가로gap8·세로gap18|입체장면+아래동일카드의분리원칙만재사용. 대상은4열110×170/gap10이며5열92×96을강제하지않음.|
|Monopoly Build r354 / `ux-gjs-0d80d7fe` / `screen-5b226528-5446-48d2-b4b1-f7aaceff7f7b`|551×984; bottom group0,712,551,272; card01=6.5,714,100,171; Img=12.5,748,88,100; native price=42.5,850,58,28/font24|장면·아래카드프레임·native글자·독립그림자구조재사용. 대상504×894/하단280이며가격없는잠금카드;5개랜드마크·금액복사X.|
|Monopoly card01 실제 skin|backplate9/custom128×64; slices27/edges18/padding0; shadow black.25 y3 blur4|이는그샘플자원계약. 대상에해당그림을복사하지않고툴내장frame128×96을쓸경우기본slices12/edges6부터시작.|
|Monopoly card input state|normal#fff/hover#f2f2f2/pressed#bdbdbd/disabled#999; targetGraphic=카드그림자식|동일상태방식이용가능. 대상은프레임을tint대상으로제안,가구원화/글자입력은parent. 원본게임눌림정책은미관찰.|

## 두 화면의 관측 구역

TSV03-07 @00:35: 상단HUD0,0,504,31; 내부확대0,31,504,583; 헤더0,614,504,54; 생산요약10,672,484,35; 가구레일10,714,494,180. 4개 전부가 보이고 5번째가 오른쪽에 일부 보이지만 이번 요청은 동일4카드만 조립합니다. 가구성장 수치/잠금해제/다른건물 상태는 창작하지 않습니다.

TSV03-08 @00:38: 배후온실0,0,504,436; sheet header0,436,504,55; rewards12,500,480,173; conditions12,676,480,116; time/CTA104,793,305,101. **단독 모달에는 배후 장면·HUD를 복사하지 않습니다.** 시트그룹만 y436..894에 두고, 실행시 원페이지뒤에 겹치는 동작은 본체가 별도로 검수합니다. 별도 X/닫기버튼·취소행동을 만들지 않습니다.

## 부품표 사용법

`building-parts-plan-v001.csv`가 native 입력용 전체표입니다. 계획 row 수: 07=53,08=47,합계=100. **실제생성수/완성률이아닙니다.**

- x/y/w/h는 **부모 내부 논리 px**, global_x/y는 화면 기준 px입니다. parent_x/y/w/h_pct는 상세 편집의 legacy%필드에 넣을 계산값입니다. 화면둘은 logical504×894입니다.
- 기획표를 설계 JSON으로 바꾸거나 주입하지 않습니다. native UI에서 각 row의 부품을 추가·이름입력·부모지정·수치입력합니다.
- exact source-observed는 **문구/숫자의영상관측**만 뜻합니다. 이표의좌표·폰트·색·프레임치수는 source를따라정규화한제작제안이며픽셀동등/제품밸런스승인아닙니다.
- 4장의Furniture는outer110×170,art78×87,레벨표시/가로선/lock22×25가공통입니다. 4열reward는outer116×124,art56²,label18px와delta18px공통입니다. 복제후부모/ID/이미지대상/이름과+2%offset복원필수입니다.
- 표에 `pending`인그림은아직준비/등록/검수되지않았습니다. 온실scene외이미지를있는것처럼보고하지않습니다.

## native 조립 순서

1. 본체가작업중인설계의미저장상태를보존합니다. 필요시별도clean탭에서파일·공유→새설계를누르고 `TSV 제작분 · 건물 내부/조건`으로이름을정합니다. 기존 `ux-25ecc98a`를다른설계로덮어쓰지않습니다.
2. 첫화면은 `Page_TSV_BuildingInterior`, logical504×894로설정합니다. 새문서schema/첫화면논리크기를먼저정하고일반%좌표부품을추가합니다. profile390×844와문서기준크기는서로구분합니다.
3. Group_Building_Scene→원화이미지, HUD→Group_Building_Bottom/헤더/요약→레일/첫카드순서로native조립합니다. sourceart는상부장면에만사용하고frame/text/input은분리합니다.
4. genericpanel추가는 `[data-tool-group="백판·도형"]`→`[data-tool-unit="panel-rectangle"]`선택→현재 `#preview-canvas` DOMrect를읽어실제drag합니다. 선택general name, role=image인부품의프로젝트경로, layout x/y/w/h를각각편집합니다. 이selector/tip은부모가실제관찰해전달한것이며이번하위세션에서실행검증한값아닙니다.
5. 필드확정은해당input에Meta+A→pressSequentially(value)→Tab, 뒤getAXState(emit:false)와현재화면헤더/DOM값으로재확인합니다. fill+Tab만반영됐다고가정하지않습니다. 재렌더후닫힌details는매번다시엽니다. checkbox가aria-pressed button으로노출되면button/data-tab기준으로고릅니다.
6. scene원화는아래 `_ui_v001.webp`만프로젝트경로에입력합니다. 브라우저UI등록후생성assetRef와저장·재열기표시를확인합니다. staging파일이있다는것만등록성공아닙니다.
7. 첫Furniture부모/Frame/2개레벨글자/이미지/분리선/lock까지완성한뒤native복제3회합니다. card02는workbench,03은planter재사용,04는rack입니다. input만카드부모가소유하고자식은parent전달. 가구성장실로직은연결하지않습니다.
8. 두번째화면 `Modal_TSV_BuildingUpgrade`를만들고logical504×894/모달종류를설정합니다. sheetgroup,header,rewards첫열→복제3열,conditions첫행→복제둘째행,time/CTA순서입니다. 배후scene/HUD/토스트를이화면에복사하지않습니다. 미관찰X/close/escape를추가하지않습니다.
9. `Btn_Building_Upgrade`→open→두번째모달target을지정한뒤always를마지막설정합니다. 도움말은미연결입니다. CTA는영상의영지건설중이목적지이므로본체의실제 `TSV03-01`대상준비전에는미연결로둡니다. 임의로07로돌리거나새게임타이머를만들지않습니다.
10. 파일에저장→동일workspace/project/screen으로재열기→저장샘플보기. 1440×900/430×844CSS,기기390×844/430×932에서각프레임/카드/글자/이미지오류/넘침/앵커/상태를실제확인합니다. modal단독은sheet만,동작시험은07에서open된배후와별도기록합니다. 이단계는본체수행분만보고합니다.

## 앵커·프레임 제안

- screen504×894를먼저기준. Group_Building_Bottom은좌우늘림·하단고정/높이280,scene은화면너비와하단위까지. SheetGroup은좌우늘림·하단고정/높이458. legacy%만으로화면전체를늘리면844높이기기에서본래카드/CTA높이가변하므로native응답형의고정높이검수가필요합니다.
- 내장frame은`frame.svg`128×96; backplate slices12/edges6,padding6/8/6/8가소스기본값입니다. 직접배치자식이있을때내용padding0을명시합니다. button3는96×48/slices0,16,0,16/edges0,12,0,12입니다. **9slice와contentpadding,별도shadow,입력wrapper를혼동하지않습니다.**
- 배경/원화inputnone,button안이미지/frame/text는parent,buttonwrapperaction. tint는정상/hover/pressed/disabled를분리하며시연반응만확인하고가구업그레이드결과로설명하지않습니다.

## 미확인·범위 경계

Unity원계층/Canvas·Prefab·원본서체·정확한색/히트영역·가구잠금정책·도움말·CTA조건미충족상태·시트닫기/취소·주민카드동작·실제3D/게임API는미확인입니다. 원본영상이보여준행동은07Upgrade→08,08CTA→영지건설중입니다. 가구성장은후반민가상태에서관측됐으므로이온실샘플에미정성장수치를만들지않습니다.

새원화는원본의3D정적장면을참고한별도시안입니다. 원본과구도/온실형태/재질차이가있으며픽셀동등/사용자시각승인아닙니다. 본체root의실제조립·화면검수전에는이자료만으로완료를쓰지않습니다.
