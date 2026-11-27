# 재산 갤러리·지도 제작 recipe · .30
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

스크롤고정의이번실제검수는상세편집/동작시험·독립미리보기입니다. 전체Grapes캔버스는14화면목록·새부모선택·상세딥링크를확인했고, 그안의live scrollPin은미검수입니다. 원본설계사본저장은호출하지않았습니다.
