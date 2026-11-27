# 타일 서바이벌 추가 15가족 조립 명세

작성자 codex 하위 tile_spec_a · 상태 제안(검수 대기)

이 문서는 조립 지침이며 저장 설계 JSON/실화면 검수/원화 완성 결과가 아닙니다. TS01/02/04/06/08~18 총15가족의 해당 catalog 원문과 JPG19장을 직접 보고 actual r63은 읽기만 했습니다.

좌표는504×894 논리px 절대좌표 육안근사 제안입니다. 부모 위치를 빼서 local로 바꾸고 필요할때만native%로 변환합니다. 버튼은 Btn>BG 기본3/9프레임+Img(선택)+Txt, 그림/문자는부모로입력전달. 전체화면터치닫기TS10/11/17은전면투명Btn이실제부모이고다른모든UI가그자손입니다. 원본JPG제품자원사용금지.

공통 역할크기: Back74×64/주요CTA336×64/두행동164×64/작은수령96×48/닫기40×40/보상72×72(큰보상92×92). 폰트제안 본문22/조밀20/작은18/CTA28/제목28;원본서체미확인.

추천 순서: TS12 → TS14 → TS16 → TS09 → TS17 → TS18 → TS13 → TS15 → TS11 → TS10 → TS04 → TS06 → TS08 → TS01 → TS02

## TS01 타이틀 / 로딩

root: Page_TSV_TS01 · native page · 직접본참조 TS01-R01

- 대표영문로고/버전정보획득. TS02상태에는계정아이콘추가와버전suffix(1582,1582).
- 로딩상태3종은catalog관측문구;임의자동진입/타이머정책추가금지.

새 그림: 정착지전체배경(글자없음) / 장식로고 / 고객센터/톱니/계정/서비스아이콘

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_TS01_Settlement | Page_TSV_TS01 | image | 0,0,504,894 |  · 글자/로고/버튼없는새타이틀정착지삽화 |
| Img_TSV_TS01_Logo | Page_TSV_TS01 | image | 80,100,350,134 |  · 장식 TILES SURVIVE! 로고새그림 |
| Btn_TSV_TS01_Support | Page_TSV_TS01 | button | 8,8,48,48 | 고객센터 |
| Btn_TSV_TS01_Settings | Page_TSV_TS01 | button | 68,8,44,44 |  · 톱니아이콘별도child |
| Img_TSV_TS01_Service | Page_TSV_TS01 | image | 224,16,58,58 |  · 대표Google Play표시,상호작용미관측 |
| Txt_TSV_TS01_Version | Page_TSV_TS01 | text | 300,12,198,28 | v 2.6.400.1546 |
| Txt_TSV_TS01_Tip | Page_TSV_TS01 | text | 16,766,472,44 | 자원지를 업그레이드하면 자원 생산 속도가 증가하여 더 많은 자원을 획득합니다. |
| Panel_TSV_TS01_Loading | Page_TSV_TS01 | frame3 | 14,820,478,20 |  · 진행fill별도;대표약1%육안근사,진행정책미확인 |
| Txt_TSV_TS01_Status | Page_TSV_TS01 | text | 70,842,364,30 | 버전 정보 획득 |

연결 후보:

- 목록선택 → 미확인/호출부 · 근거 source entry unverified · 제안 목록에서단독보기;가짜게임시작버튼/자동시간전환추가금지

상태 fixture: {"statusStates": ["버전 정보 획득", "게임 리소스 업데이트", "근거지 진입 중"]}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS02 게임 이용약관

root: Modal_TSV_TS02 · native modal · 직접본참조 TS02-R01

- TS01위중앙모달.배경별도원화+nativeUI;전체화면JPG붙이기금지.
- 원본약관전체/정책URL/각버튼결과미확인.배경상태는 게임 리소스 업데이트 3.97M/3.97M.

새 그림: 청록판/헤더기본9/3프레임 / 닫기X아이콘

스크롤: 본문viewport만세로스크롤제안;모달/헤더/버튼고정

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Panel_TSV_TS02_Terms | Modal_TSV_TS02 | group | 38,282,430,350 |  |
| BG_TSV_TS02_Terms | Panel_TSV_TS02_Terms | frame9 | 38,282,430,350 |  |
| BG_TSV_TS02_Header | Panel_TSV_TS02_Terms | frame3 | 38,282,430,50 |  |
| Txt_TSV_TS02_Title | Panel_TSV_TS02_Terms | text | 50,294,360,32 | 게임 이용약관 |
| Btn_TSV_TS02_Close | Panel_TSV_TS02_Terms | button | 422,286,40,40 | × |
| Scroll_TSV_TS02_Body | Panel_TSV_TS02_Terms | scroll | 54,340,396,208 |  · 마지막줄원본잘림;뒤문장창작금지 |
| Txt_TSV_TS02_Body | Scroll_TSV_TS02_Body | text | 70,352,364,184 | 저희 서비스 이용 전 <서비스 이용약관>, <개인정보 처리방침> 각 조항을 자세히 읽고 동의하셔야 합니다. 또한 해당 면책 조항 또는 본사의 책임 제한 조항 및 귀하의 권리 제한 조항을 자세히 살펴 보시기 바랍니다. · 서비스약관/개인정보는주황밑줄native링크별도;URL미확인 |
| Txt_TSV_TS02_BodyPartial | Scroll_TSV_TS02_Body | text | 70,512,364,26 | 약관 및 처리방침을 읽고 동의하신다면 다음 선 · 화면에여기까지보임.뒷문구미확인 |
| Btn_TSV_TS02_Start | Panel_TSV_TS02_Terms | button | 56,556,188,58 | 시작하기 · 원본회색.실제disabled여부미확인 |
| Btn_TSV_TS02_AgreeStart | Panel_TSV_TS02_Terms | button | 264,556,184,58 | 모두 동의하고 시작하기 |

연결 후보:

- X → 미확인/호출부 · 근거 visible-only · 제안 실제호출부dismiss제안. TS01위에서호출되었을때TS01복귀
- 시작하기/모두동의/정책링크 → 미확인/호출부 · 근거 destinations unverified · 제안 임의게임진입/URL/전체약관창작금지

상태 fixture: {"sourceBodyComplete": false, "backdropStatus": "게임 리소스 업데이트 3.97M/3.97M"}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS04 스토리 / 주민 대화

root: Modal_TSV_TS04 · native modal · 직접본참조 TS04-R01

- 대표데이몬. 월드말풍선은고정대화판과별도부품.
- 화자/좌우초상변경은state;다른대사를임의순서로이어붙이지않음. X는원본에없음.

새 그림: 데이몬반신 / 대화/이름프레임 / 월드말풍선

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS04 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Img_TSV_TS04_Damon | Modal_TSV_TS04 | image | 0,454,256,250 |  · 새데이몬반신투명그림 |
| Panel_TSV_TS04_Dialog | Modal_TSV_TS04 | group | 16,698,476,192 |  |
| BG_TSV_TS04_Dialog | Panel_TSV_TS04_Dialog | frame9 | 16,698,476,192 |  |
| BG_TSV_TS04_Name | Panel_TSV_TS04_Dialog | frame3 | 8,692,172,42 |  |
| Txt_TSV_TS04_Name | Panel_TSV_TS04_Dialog | text | 20,696,146,36 | 데이몬 |
| Txt_TSV_TS04_Body | Panel_TSV_TS04_Dialog | text | 36,756,424,82 | 정말 고마워. 드디어 살 곳이 생겼어! |
| Btn_TSV_TS04_Next | Panel_TSV_TS04_Dialog | button | 228,850,48,40 | ▾ |
| Btn_TSV_TS04_Skip | Panel_TSV_TS04_Dialog | button | 404,854,80,32 | 스킵 » |
| Group_TSV_TS04_WorldBubble | Modal_TSV_TS04 | group | 278,230,160,114 |  · 별도WorldAnchor말풍선 |
| Txt_TSV_TS04_WorldBubble | Group_TSV_TS04_WorldBubble | text | 294,244,128,88 | 씨앗이 싹을 틔우려고 애쓰는 것처럼 열심히 일할 게! |

연결 후보:

- 다음/스킵 → 미확인/호출부 · 근거 visible-only · 제안 다음대사순서/원문미확인. 스킵호출부dismiss는제작제안만

상태 fixture: {"speaker": "데이몬", "body": "정말 고마워. 드디어 살 곳이 생겼어!"}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS06 튜토리얼 대응 방식 2택

root: Modal_TSV_TS06 · native modal · 직접본참조 TS06-R01

- 좌측선택관측;우측은커서만.우측설명/분기결과미확인.
- 원본X/바깥닫기힌트없음.

새 그림: 두선택장면144×172각1 / 선택브래킷 / 기본3/9프레임

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS06 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Modal_TSV_TS06 | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| BG_TSV_TS06_Title | Modal_TSV_TS06 | frame3 | 176,156,154,50 |  |
| Txt_TSV_TS06_Title | Modal_TSV_TS06 | text | 178,164,150,32 | 대응 방식 선택 |
| Btn_TSV_TS06_Accept | Modal_TSV_TS06 | button | 64,256,164,230 | 문을 열어 수용하기 · 그림상단/라벨하단44px;좌측선택브래킷별도 |
| Img_TSV_TS06_Accept | Btn_TSV_TS06_Accept | image | 74,266,144,172 |  |
| Btn_TSV_TS06_Discharge | Modal_TSV_TS06 | button | 276,256,164,230 | 바로 방전하기 · 동일역할164×230 |
| Img_TSV_TS06_Discharge | Btn_TSV_TS06_Discharge | image | 286,266,144,172 |  |
| BG_TSV_TS06_Description | Modal_TSV_TS06 | frame9 | 66,518,374,86 |  |
| Txt_TSV_TS06_Description | Modal_TSV_TS06 | text | 88,534,332,58 | 생존자를 구할 수 있지만 문을 열면 감염자들이 몰려올 수 있습니다. |
| Btn_TSV_TS06_Select | Modal_TSV_TS06 | button | 170,662,164,64 | 선택 |

연결 후보:

- 카드선택 → local state · 근거 left selected observed · 제안 카드부모처리;우측미관측설명창작금지
- 선택 → 미확인/호출부 · 근거 result unverified · 제안 게임분기임의연결금지;단독보기진입미검수

상태 fixture: {}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS08 습격 예고 / 이동 안내

root: Modal_TSV_TS08 · native modal · 직접본참조 TS08-R01

- 거대적돌출그림/경고리본/native문구수치/보상모두분리.
- 타이머고정관측값. countdown/습격로직미확인.

새 그림: 적장면 / 붉은경고리본/아이콘 / 별카드2종/보석

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS08 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Modal_TSV_TS08 | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Panel_TSV_TS08_Warning | Modal_TSV_TS08 | group | 36,154,432,626 |  |
| BG_TSV_TS08_Warning | Panel_TSV_TS08_Warning | frame9 | 36,432,432,348 |  |
| Img_TSV_TS08_Boss | Panel_TSV_TS08_Warning | image | 52,126,402,276 |  · 푸른거대감염자/붉은장면;문구없는새그림 |
| Btn_TSV_TS08_Close | Panel_TSV_TS08_Warning | button | 410,160,40,40 | × |
| BG_TSV_TS08_Ribbon | Panel_TSV_TS08_Warning | frame3 | 38,386,430,66 |  |
| Txt_TSV_TS08_Title | Panel_TSV_TS08_Warning | text | 92,396,350,44 | 곧 습격이 시작됩니다. |
| Txt_TSV_TS08_Timer | Panel_TSV_TS08_Warning | text | 174,456,156,30 | 00:58:41 |
| Txt_TSV_TS08_Requirement | Panel_TSV_TS08_Warning | text | 80,496,344,30 | 발전소 5레벨 달성(2/5) |
| Group_TSV_TS08_Rewards | Panel_TSV_TS08_Warning | group | 148,534,214,68 |  · 보석×100/보라별카드×1/갈색별카드×3,각64×64 |
| Txt_TSV_TS08_Guide | Panel_TSV_TS08_Warning | text | 104,628,300,58 | 챕터 미션 가이드에 따라 발전소를 업그레이드하세요. |
| Btn_TSV_TS08_Go | Panel_TSV_TS08_Warning | button | 84,686,336,64 | 이동하기 |
| Txt_TSV_DismissHint | Modal_TSV_TS08 | text | 120,856,264,30 | 빈 곳을 탭하여 닫기 |

연결 후보:

- X/빈곳 → 미확인/호출부 · 근거 visible-only · 제안 호출부dismiss제안
- 이동하기 → 미확인/호출부 · 근거 destination unverified · 제안 목적건물/좌표근거없이TS03/05오연결금지

상태 fixture: {"timer": "00:58:41", "rewards": [{"gem": 100}, {"purpleStarCard": 1}, {"brownStarCard": 3}]}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS09 챕터 미션 노트

root: Modal_TSV_TS09 · native modal · 직접본참조 TS09-R01, TS09-R02, TS09-R03

- 권장대표=TS09-R03(TSV04),챕터3.카탈로그primary TS09-R01은챕터2로다른state.
- 챕터1/2/3미션/수치혼합금지.보석비행은일시연출.

새 그림: 챕터3배너(TS18공유) / 챕터1/2배너는상태지원시추가 / 노트루프 / 보석/목재/식량/가속/EXP아이콘

스크롤: 미션viewport세로/보상레일가로. 배너/하단보상/닫기/수령CTA고정

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS09 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Modal_TSV_TS09 | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Panel_TSV_TS09_Notebook | Modal_TSV_TS09 | group | 0,60,504,740 |  |
| BG_TSV_TS09_Notebook | Panel_TSV_TS09_Notebook | frame9 | 0,60,504,740 |  · 루프/찢긴상단장식별도 |
| Btn_TSV_TS09_Close | Modal_TSV_TS09 | button | 446,24,40,40 | × ·  공통Close40×40적용;원본외곽근사44와약간차이. |
| Group_TSV_TS09_Banner | Panel_TSV_TS09_Notebook | group | 22,96,454,178 |  |
| Img_TSV_TS09_Banner | Group_TSV_TS09_Banner | image | 22,96,454,178 |  · 챕터3새배너;TS18공유가능 |
| Txt_TSV_TS09_Chapter | Group_TSV_TS09_Banner | text | 30,196,150,32 | 챕터 3 |
| Txt_TSV_TS09_Title | Group_TSV_TS09_Banner | text | 30,232,200,28 | 용사 집결 |
| Scroll_TSV_TS09_Missions | Panel_TSV_TS09_Notebook | scroll | 22,276,454,344 |  |
| Group_TSV_TS09_Mission01 | Scroll_TSV_TS09_Missions | group | 22,276,454,114 |  |
| Txt_TSV_TS09_Mission01 | Group_TSV_TS09_Mission01 | text | 34,284,420,30 | 3-8 발전소 4레벨 달성 (4/4) |
| Group_TSV_TS09_Mission01Rewards | Group_TSV_TS09_Mission01 | group | 34,318,202,64 |  · 보석×10/목재×100/식량×60;각64×64 |
| Btn_TSV_TS09_Claim01 | Group_TSV_TS09_Mission01 | button | 368,320,96,48 | 수령 |
| Group_TSV_TS09_Mission02 | Scroll_TSV_TS09_Missions | group | 22,398,454,116 |  · 제목3-3 영웅 지구 건설 (1/1);동일보상;우측녹색체크 |
| Group_TSV_TS09_Mission03 | Scroll_TSV_TS09_Missions | group | 22,522,454,116 |  · 제목3-1 생존자 구조 (1/1);보석/목재/식량아이콘과우측녹색체크.수량하단clip로미확인;창작금지. |
| Txt_TSV_TS09_RewardTitle | Panel_TSV_TS09_Notebook | text | 126,638,260,30 | 이번 챕터 미션 보상 |
| Scroll_TSV_TS09_ChapterRewards | Panel_TSV_TS09_Notebook | scroll-x | 22,678,326,78 |  · 1K EXP×5/1분×5/보석×200/목재×720.식량이프레임잘림;TS17-R01에서×400 |
| Btn_TSV_TS09_ClaimAll | Panel_TSV_TS09_Notebook | button | 368,690,96,48 | 모두 수령 |
| Txt_TSV_DismissHint | Modal_TSV_TS09 | text | 120,856,264,30 | 빈 곳을 탭하여 닫기 |

연결 후보:

- 모두 수령 → TS17 · 근거 sequence-observed · 제안 chapterId+returnToScreenId전달,재수령/지갑계산없음
- X/바깥 → 미확인/호출부 · 근거 visible-only · 제안 실제호출부dismiss.원본진입없으면목록단독보기
- 개별수령 → local claimed state · 근거 source action partial · 제안 checked예시만;실경제변경없음

상태 fixture: {"selectedChapterId": 3, "chapters": {"1": {"title": "발전소 가동", "missions": ["1-2 민가 건설 (1/1)", "1-6 온실 건설 (1/1)", "1-1 발전소 연결 (1/1)"], "chapterRewards": {"minute1": 5, "gem": 200, "food": 300, "wood": 400}}, "2": {"title": "위기 예보", "missions": ["2-10 민가1 2레벨 달성 (2/2)", "2-12 생존자 수용 (1/1)", "2-2 목재 공방 건설 (1/1)"], "rowRewards": [{"gem": 10}, {"gem": 10, "food": 600, "wood": 1240}, {"gem": 10}], "chapterRewards": {"minute1": 5, "gem": 200, "wood": 600, "food": 400}}, "3": {"title": "용사 집결", "missions": ["3-8 발전소 4레벨 달성 (4/4)", "3-3 영웅 지구 건설 (1/1)", "3-1 생존자 구조 (1/1)"], "rowRewards": [{"gem": 10, "wood": 100, "food": 60}, {"gem": 10, "wood": 100, "food": 60}, {"gem": null, "wood": null, "food": null, "note": "원본세번째행하단clip;아이콘종류는보이나수량완전판독미확인"}], "chapterRewards": {"exp1k": 5, "minute1": 5, "gem": 200, "wood": 720, "food": 400}}}}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS10 일반 건물 업그레이드 성공

root: Modal_TSV_TS10 · native modal · 직접본참조 TS10-R01

- 대표제련공방Lv.2/50→100/보석10/모루.민가침대상태와혼합금지.
- 닫기후목적지미관측.호출부backstack복귀제안.

새 그림: 붉은리본 / 광선/색종이 / 모루가구/보석/화살표

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Btn_TSV_TS10_Continue | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Btn_TSV_TS10_Continue | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Txt_TSV_TS10_Title | Btn_TSV_TS10_Continue | text | 76,92,352,34 | 제련 공방 업그레이드 성공 |
| Img_TSV_TS10_RaysConfetti | Btn_TSV_TS10_Continue | image | 24,150,456,500 |  · 글자없는광선/색종이 |
| Img_TSV_TS10_Ribbon | Btn_TSV_TS10_Continue | image | 32,258,440,108 |  · 글자없는붉은리본 |
| Txt_TSV_TS10_Level | Btn_TSV_TS10_Continue | text | 132,268,240,64 | Lv.2 |
| Txt_TSV_TS10_Stat | Btn_TSV_TS10_Continue | text | 28,402,294,34 | 금속 생산 속도: |
| Txt_TSV_TS10_Before | Btn_TSV_TS10_Continue | text | 374,402,40,34 | 50 |
| Img_TSV_TS10_Arrow | Btn_TSV_TS10_Continue | image | 410,404,30,28 |  |
| Txt_TSV_TS10_After | Btn_TSV_TS10_Continue | text | 440,402,50,34 | 100 |
| Group_TSV_TS10_Rewards | Btn_TSV_TS10_Continue | group | 154,516,200,94 |  · 보석×10/모루가구;각92×92.가구수량표시없음 |
| Txt_TSV_TS10_Hint | Btn_TSV_TS10_Continue | text | 152,808,200,52 | 아무 곳이나 터치해 닫으세요. |
| Btn_TSV_TS10_Continue | Modal_TSV_TS10 | transparent-button | 0,0,504,894 |  · 전면투명button부모. 배경/딤/판/문구/보상은이부모의자식으로입력전달. 자기전체직사각형이닫기hit영역. |

연결 후보:

- 아무곳터치 → 미확인/호출부 · 근거 source hint visible · 제안 실제호출부dismiss;정확입력시점미관측

상태 fixture: {}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS11 발전소 레벨 증가 기록판

root: Modal_TSV_TS11 · native modal · 직접본참조 TS11-R01

- 직접본대표TS11-R01은Lv.4. catalog에섞인Lv.3/10.07K→16.37K/6→8은다른state.
- 대표HUD43,992/04:56/6/8/9.75K/보석790을현행TS03지갑과혼합하지않음.
- 우하단설정tooltip/Steam채팅은게임UI제외.

새 그림: 금빛발전소/월계수 / 붉은리본 / 방패하단장식 / EXP/보석/녹색화살표3개

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Btn_TSV_TS11_Continue | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Btn_TSV_TS11_Continue | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Txt_TSV_TS11_Title | Btn_TSV_TS11_Continue | text | 112,92,284,34 | 발전소 업그레이드 성공 |
| Panel_TSV_TS11_Record | Btn_TSV_TS11_Continue | group | 40,182,424,574 |  |
| Img_TSV_TS11_PowerPlant | Panel_TSV_TS11_Record | image | 140,184,226,142 |  · 글자없는금빛발전소/월계수 |
| BG_TSV_TS11_Record | Panel_TSV_TS11_Record | frame9 | 54,374,396,380 |  · 하단방패꼴장식별도 |
| Img_TSV_TS11_Ribbon | Panel_TSV_TS11_Record | image | 36,316,432,104 |  |
| Txt_TSV_TS11_Level | Panel_TSV_TS11_Record | text | 136,320,232,66 | Lv.4 |
| Txt_TSV_TS11_Stat01 | Panel_TSV_TS11_Record | text | 80,458,194,32 | 전투력 증가: |
| Txt_TSV_TS11_Stat01Before | Panel_TSV_TS11_Record | text | 230,458,78,32 | 16.37K |
| Txt_TSV_TS11_Stat01After | Panel_TSV_TS11_Record | text | 350,458,78,32 | 24.39K |
| Txt_TSV_TS11_Stat02 | Panel_TSV_TS11_Record | text | 80,494,214,32 | 영웅 레벨 상한: |
| Txt_TSV_TS11_Stat02Before | Panel_TSV_TS11_Record | text | 342,494,20,32 | 5 |
| Txt_TSV_TS11_Stat02After | Panel_TSV_TS11_Record | text | 398,494,34,32 | 10 |
| Txt_TSV_TS11_Stat03 | Panel_TSV_TS11_Record | text | 80,532,214,32 | 전기 공급 구역: |
| Txt_TSV_TS11_Stat03Before | Panel_TSV_TS11_Record | text | 342,532,20,32 | 8 |
| Txt_TSV_TS11_Stat03After | Panel_TSV_TS11_Record | text | 398,532,34,32 | 9 |
| Group_TSV_TS11_Rewards | Panel_TSV_TS11_Record | group | 176,600,154,74 |  · EXP×40,000/보석×10;각72×72 |
| Txt_TSV_TS11_Hint | Btn_TSV_TS11_Continue | text | 154,810,202,52 | 화면을 터치하여 계속하세요. |
| Btn_TSV_TS11_Continue | Modal_TSV_TS11 | transparent-button | 0,0,504,894 |  · 전면투명button부모. 배경/딤/판/문구/보상은이부모의자식으로입력전달. 자기전체직사각형이닫기hit영역. |

연결 후보:

- 화면터치 → TS03 · 근거 sequence-observed02→03s · 제안 기존TS03위dismiss,returnToScreenId보존;독립선택은복귀대상별도기록

상태 fixture: {"level": 4, "powerBefore": "16.37K", "powerAfter": "24.39K", "heroCapBefore": 5, "heroCapAfter": 10, "gridBefore": 8, "gridAfter": 9, "exp": 40000, "gem": 10}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS12 지휘관 정보 편집

root: Modal_TSV_TS12 · native modal · 직접본참조 TS12-R01

- 길이/문자규칙안내문은보이나실제validation코드/마침표허용예외미확인.
- 없음초기selected,다른성별선택은localfixture제안.
- 키보드열림/입력가능/가림검수필요.이는명세로실제입력검수아님.

새 그림: 기본3/9프레임 / 성별/선택체크아이콘

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS12 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Modal_TSV_TS12 | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Panel_TSV_TS12_Commander | Modal_TSV_TS12 | group | 26,58,454,722 |  |
| BG_TSV_TS12_Commander | Panel_TSV_TS12_Commander | frame9 | 26,58,454,722 |  |
| BG_TSV_TS12_Header | Panel_TSV_TS12_Commander | frame3 | 26,58,454,56 |  |
| Txt_TSV_TS12_Title | Panel_TSV_TS12_Commander | text | 42,72,350,38 | 지휘관 정보 |
| Btn_TSV_TS12_Close | Panel_TSV_TS12_Commander | button | 432,66,40,40 | × |
| Panel_TSV_TS12_Name | Panel_TSV_TS12_Commander | group | 50,132,404,192 |  |
| Txt_TSV_TS12_NameTitle | Panel_TSV_TS12_Name | text | 60,144,360,32 | 지휘관 닉네임 |
| Txt_TSV_TS12_NameRule | Panel_TSV_TS12_Name | text | 60,190,360,28 | 이름은 3~16자 이내여야 합니다. |
| Input_TSV_TS12_Nickname | Panel_TSV_TS12_Name | input | 60,222,384,40 | Survivor.43a3e · 진짜native편집입력.가짜text금지/실계정저장없음 |
| Txt_TSV_TS12_CharRule | Panel_TSV_TS12_Name | text | 60,274,360,28 | 문자와 숫자만 사용하세요. |
| Panel_TSV_TS12_Gender | Panel_TSV_TS12_Commander | group | 50,332,404,188 |  |
| Txt_TSV_TS12_GenderTitle | Panel_TSV_TS12_Gender | text | 60,342,350,32 | 지휘관 성별 |
| Btn_TSV_TS12_Male | Panel_TSV_TS12_Gender | button | 72,396,132,44 | 남 ♂ · checkbox/icon/text분리;동일132×44 |
| Btn_TSV_TS12_Female | Panel_TSV_TS12_Gender | button | 266,396,132,44 | 여 ♀ |
| Btn_TSV_TS12_Other | Panel_TSV_TS12_Gender | button | 72,454,132,44 | 기타 ? |
| Btn_TSV_TS12_None | Panel_TSV_TS12_Gender | button | 266,454,132,44 | 없음 · 관측selected |
| Btn_TSV_TS12_Free | Panel_TSV_TS12_Commander | button | 84,690,336,64 | 무료 · 회색관측;enabled조건미확인.임의성공저장금지 |
| Txt_TSV_DismissHint | Modal_TSV_TS12 | text | 120,856,264,30 | 빈 곳을 탭하여 닫기 |

연결 후보:

- 입력/성별 → local state · 근거 controls visible only · 제안 native입력과선택fixture.실계정/오류문구창작금지
- 무료 → 미확인/호출부 · 근거 gray state only · 제안 제출결과/실제저장미확인
- X/바깥 → 미확인/호출부 · 근거 visible-only · 제안 호출부dismiss제안

상태 fixture: {"nickname": "Survivor.43a3e", "selectedGender": "none"}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS13 생존자 파견

root: Modal_TSV_TS13 · native modal · 직접본참조 TS13-R01

- source sheet를native modal로분류제안.상단영지0~214유지,전체풀딤없음.
- 상단 영웅 지구 1레벨 잠금 해제/새로운 생존자가 도착했습니다!는일시토스트/공통배너.
- 온실잘린수치추정금지.목록행같은크기.

새 그림: 건물4종아이콘 / 작업/휴식/침대/파업아이콘 / 편지함/뒤로/알림점 / 기본3/9프레임

스크롤: 건물목록만세로스크롤;헤더/요약/자동파견/하단탭고정

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS13 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Panel_TSV_TS13_Sheet | Modal_TSV_TS13 | group | 0,214,504,680 |  |
| BG_TSV_TS13_Sheet | Panel_TSV_TS13_Sheet | frame9 | 0,214,504,680 |  |
| BG_TSV_TS13_Header | Panel_TSV_TS13_Sheet | frame3 | 0,214,504,58 |  |
| Txt_TSV_TS13_Title | Panel_TSV_TS13_Sheet | text | 12,232,80,30 | 생존자 |
| Btn_TSV_TS13_Help | Panel_TSV_TS13_Sheet | button | 80,222,40,40 | ? |
| Btn_TSV_TS13_Mailbox | Panel_TSV_TS13_Sheet | button | 416,204,88,68 | 근거지 편지함 · 아이콘/문구/알림점분리 |
| Panel_TSV_TS13_Summary | Panel_TSV_TS13_Sheet | group | 14,282,476,132 |  · 4/4;작업중3/휴식중1/아픔0/파업중0,동일108×64셀4개 |
| Txt_TSV_TS13_Count | Panel_TSV_TS13_Summary | text | 402,286,76,28 | 4/4 |
| Scroll_TSV_TS13_Buildings | Panel_TSV_TS13_Sheet | scroll | 14,420,476,306 |  |
| Group_TSV_TS13_Building01 | Scroll_TSV_TS13_Buildings | group | 20,420,464,82 |  · 목재 공방;아이콘64×64/라벨/작업자/−/1/2/+별도;+알림점 |
| Group_TSV_TS13_Building02 | Scroll_TSV_TS13_Buildings | group | 20,510,464,82 |  · 제련 공방;0/1;−회색;+알림점 |
| Group_TSV_TS13_Building03 | Scroll_TSV_TS13_Buildings | group | 20,600,464,82 |  · 주방;1/1;+회색 |
| Group_TSV_TS13_Building04 | Scroll_TSV_TS13_Buildings | group | 20,690,464,82 |  · 온실일부만보임;수치미확인빈값 |
| Btn_TSV_TS13_Auto | Panel_TSV_TS13_Sheet | button | 84,734,336,64 | 자동 파견 |
| Group_TSV_TS13_Footer | Panel_TSV_TS13_Sheet | group | 0,810,504,84 |  |
| Btn_TSV_TS13_Back | Group_TSV_TS13_Footer | button | 0,818,74,64 | ← |
| Btn_TSV_TS13_DispatchTab | Group_TSV_TS13_Footer | button | 88,810,202,70 | 파견 · selected |
| Btn_TSV_TS13_DetailTab | Group_TSV_TS13_Footer | button | 298,810,200,70 | 속성 상세정보 |

연결 후보:

- 근거지편지함 → TS15 · 근거 visible entry; exact source click unverified · 제안 보이는진입아이콘만이용가능;returnToTS13보존
- 뒤로 → 미확인/호출부 · 근거 visible-only · 제안 호출부dismiss
- 속성상세정보 → 미확인/호출부 · 근거 destination unseen · 제안 가짜상세페이지추가금지
- −/+ / 자동파견 → local fixture · 근거 results unseen · 제안 파견결과/계산규칙/수치창작금지

상태 fixture: {"population": "4/4", "working": 3, "resting": 1, "ill": 0, "striking": 0, "buildings": [{"name": "목재 공방", "count": "1/2"}, {"name": "제련 공방", "count": "0/1"}, {"name": "주방", "count": "1/1"}, {"name": "온실", "count": null}]}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS14 생존자 수용

root: Modal_TSV_TS14 · native modal · 직접본참조 TS14-R01, TS14-R02

- 권장상태=R02수용가능(4+2/침대6/2초상체크).R01정원부족variant.
- R01하단빨강 침대를 확장해 더 많은 생존자를 수용하세요.+우측이동화살표;R02녹색CTA.동시표시금지.
- 튜토리얼흰손은공통overlay로분리.

새 그림: 수잔/지미초상 / 클립 / 인구/침대/체크/이동아이콘

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS14 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Modal_TSV_TS14 | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Panel_TSV_TS14_Clipboard | Modal_TSV_TS14 | group | 6,64,494,768 |  |
| BG_TSV_TS14_Clipboard | Panel_TSV_TS14_Clipboard | frame9 | 6,64,494,768 |  |
| Img_TSV_TS14_Clip | Panel_TSV_TS14_Clipboard | image | 148,52,210,94 |  |
| Btn_TSV_TS14_Close | Panel_TSV_TS14_Clipboard | button | 452,76,40,40 | × |
| Txt_TSV_TS14_Title | Panel_TSV_TS14_Clipboard | text | 158,154,170,42 | 생존자 수용 |
| Btn_TSV_TS14_Help | Panel_TSV_TS14_Clipboard | button | 310,154,40,40 | ? |
| Group_TSV_TS14_Capacity | Panel_TSV_TS14_Clipboard | group | 16,200,474,100 |  · 총인구/침대자리아이콘/라벨/수치별도 |
| Txt_TSV_TS14_Population | Group_TSV_TS14_Capacity | text | 136,230,100,48 | 4+2 · 4청록/+2녹색필요시2텍스트 |
| Txt_TSV_TS14_Beds | Group_TSV_TS14_Capacity | text | 402,230,54,48 | 6 |
| Txt_TSV_TS14_Waiting | Panel_TSV_TS14_Clipboard | text | 148,310,224,34 | 수용 대기 생존자: 2 |
| Btn_TSV_TS14_Susan | Panel_TSV_TS14_Clipboard | button | 40,348,132,146 |  · 새초상+선택딤+녹색체크각child |
| Txt_TSV_TS14_Susan | Panel_TSV_TS14_Clipboard | text | 40,498,132,30 | 수잔 |
| Btn_TSV_TS14_Jimmy | Panel_TSV_TS14_Clipboard | button | 188,348,132,146 |  · 동일크기새초상+체크 |
| Txt_TSV_TS14_Jimmy | Panel_TSV_TS14_Clipboard | text | 188,498,132,30 | 지미 |
| Btn_TSV_TS14_Accept | Panel_TSV_TS14_Clipboard | button | 84,738,336,64 | 생존자 수용 |
| Txt_TSV_DismissHint | Modal_TSV_TS14 | text | 120,856,264,30 | 빈 곳을 탭하여 닫기 |

연결 후보:

- 생존자수용 → TS03 · 근거 sequence-observed125→126s · 제안 selectedSurvivorIds/returnTo전달후dismiss;실인구계산은fixture한정
- 침대확장이동 → 미확인/호출부 · 근거 visible-only · 제안 목적건물미확인연결보류
- X/바깥 → 미확인/호출부 · 근거 visible-only · 제안 호출부dismiss

상태 fixture: {"selectedVariant": "ready", "variants": {"full": {"population": "4", "beds": "4", "selected": [], "footer": "침대를 확장해 더 많은 생존자를 수용하세요."}, "ready": {"population": "4+2", "beds": "6", "selected": ["susan", "jimmy"], "footer": "생존자 수용"}}}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS15 근거지 편지함

root: Page_TSV_TS15 · native page · 직접본참조 TS15-R01

- 대표는미아변기건설요청/미아평가3행.제이슨교환사건/사건없음은다른state.
- 원문 변기을(를) 조사화면그대로보존. 관계진행1/3막대는일시연출로분리.

새 그림: 미아초상 / 선물/식사/수면/기분/감정/망치/좋아요 / 우편투입구 / 기본3/9프레임

스크롤: 헤더/모랄요약/하단탭고정,사건+평가목록세로

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| BG_TSV_TS15_Page | Page_TSV_TS15 | frame9 | 0,0,504,894 |  |
| Group_TSV_TS15_Header | Page_TSV_TS15 | group | 0,0,504,112 |  |
| BG_TSV_TS15_Header | Group_TSV_TS15_Header | frame3 | 0,0,504,78 |  |
| Txt_TSV_TS15_Title | Group_TSV_TS15_Header | text | 130,16,210,42 | 근거지 편지함 |
| Btn_TSV_TS15_Help | Group_TSV_TS15_Header | button | 316,14,40,40 | ? |
| Img_TSV_TS15_MailSlot | Group_TSV_TS15_Header | image | 82,90,342,24 |  |
| Group_TSV_TS15_Morale | Page_TSV_TS15 | group | 18,122,468,228 |  · 설명/선물/식사51.00수면50.00기분51.00;막대352×20동일크기 |
| Txt_TSV_TS15_Status | Group_TSV_TS15_Morale | text | 46,138,360,50 | 생존자들에게 약간의 불만이 있지만, 그래도 여전히 당신을 믿고 있습니다! |
| Btn_TSV_TS15_Gift | Group_TSV_TS15_Morale | button | 424,136,40,40 |  · 선물아이콘;결과미관측 |
| Scroll_TSV_TS15_Messages | Page_TSV_TS15 | scroll | 18,354,468,444 |  |
| Txt_TSV_TS15_EventTitle | Scroll_TSV_TS15_Messages | text | 28,358,300,28 | 생존자 사건 |
| Group_TSV_TS15_Event01 | Scroll_TSV_TS15_Messages | group | 26,386,452,96 |  · 미아초상64×64/이름;본문 도저히 민가-1의 변기을(를) 참을 수가 없어!;화난얼굴2개아이콘; 건설하기 »와망치버튼별도 |
| Txt_TSV_TS15_ReviewTitle | Scroll_TSV_TS15_Messages | text | 28,494,300,28 | 생존자 평가 |
| Group_TSV_TS15_Review01 | Scroll_TSV_TS15_Messages | group | 26,522,452,92 |  · 미아;웃는아이콘+이곳 사람들은 모두 친절해서 여기가 마음에 들어.;우측좋아요40×64 |
| Group_TSV_TS15_Review02 | Scroll_TSV_TS15_Messages | group | 26,624,452,92 |  · 미아;그때 여기로 오게 되어서 정말 다행이야.+웃는아이콘;좋아요 |
| Group_TSV_TS15_Review03 | Scroll_TSV_TS15_Messages | group | 26,726,452,92 |  · 같은평가본문반복원본에실재;하단clip |
| Group_TSV_TS15_Footer | Page_TSV_TS15 | group | 0,814,504,80 |  |
| Btn_TSV_TS15_Back | Group_TSV_TS15_Footer | button | 0,818,74,64 | ← |
| Btn_TSV_TS15_MailboxTab | Group_TSV_TS15_Footer | button | 84,818,170,64 | 근거지 편지함 · selected |
| Btn_TSV_TS15_AlbumTab | Group_TSV_TS15_Footer | button | 260,818,238,64 | 생존자 도감 |

연결 후보:

- 생존자도감 → TS30 · 근거 sequence-observed93→94s · 제안 실제탭으로전환,fromScreenId=TS15
- 제이슨 교환하기 » → TS16 · 근거 catalog state; exact entry unverified · 제안 제이슨사건state일때만보이는action으로연결.미아건설하기오연결금지
- 미아 건설하기 » → 미확인/호출부 · 근거 destination unspecified · 제안 대상변기/민가정확연결근거없음
- 뒤로 → 미확인/호출부 · 근거 visible-only · 제안 실제호출부TS13등보존
- 선물/도움말/좋아요 → 미확인/호출부 · 근거 visible-only · 제안 미관측보상/도움말생성금지

상태 fixture: {"food": "51.00", "sleep": "50.00", "mood": "51.00", "eventVariant": "mia-toilet-request"}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS16 주민 자원 교환

root: Modal_TSV_TS16 · native modal · 직접본참조 TS16-R01, TS16-R02

- R01/R02본문/보상/비용동일.목재1000/5분가속1/물자상자10.
- catalog앞부분의교환미관측옛문장과뒤TSV03연결이충돌. sequence-observed만연결근거.
- 실재화차감/관계계산없음,fixture로한정.

새 그림: 제이슨반신 / 주황배너/링고리 / 5분가속/물자상자/목재아이콘

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS16 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Modal_TSV_TS16 | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Panel_TSV_TS16_Trade | Modal_TSV_TS16 | group | 50,214,414,516 |  |
| BG_TSV_TS16_Trade | Panel_TSV_TS16_Trade | frame9 | 50,374,414,356 |  |
| Img_TSV_TS16_Jason | Panel_TSV_TS16_Trade | image | 60,144,392,246 |  · 새반신/주황상단배너;이름별도 |
| Txt_TSV_TS16_Name | Panel_TSV_TS16_Trade | text | 174,334,160,40 | 제이슨 |
| Btn_TSV_TS16_Close | Panel_TSV_TS16_Trade | button | 428,196,40,40 | × ·  공통Close40×40적용;원본외곽근사44와약간차이. |
| Txt_TSV_TS16_Request | Panel_TSV_TS16_Trade | text | 90,410,334,80 | 저기, 사장님! 공구를 수리할 나무가 부족한데 모아둔 토마토와 바꿀 수 있을까? |
| Group_TSV_TS16_Rewards | Panel_TSV_TS16_Trade | group | 74,500,358,118 |  |
| BG_TSV_TS16_Rewards | Group_TSV_TS16_Rewards | frame9 | 74,500,358,118 |  |
| Txt_TSV_TS16_RewardsTitle | Group_TSV_TS16_Rewards | text | 92,504,220,32 | 획득 |
| Group_TSV_TS16_Items | Group_TSV_TS16_Rewards | group | 196,546,126,62 |  · 5분가속×1/물자상자×10;각60×60,토마토단독아이콘아님 |
| Btn_TSV_TS16_Later | Panel_TSV_TS16_Trade | button | 84,648,164,64 | 다음에 |
| Btn_TSV_TS16_Exchange | Panel_TSV_TS16_Trade | button | 264,648,164,64 | 1000 / 교환 · 목재아이콘child별도 |
| Txt_TSV_DismissHint | Modal_TSV_TS16 | text | 120,856,264,30 | 빈 곳을 탭하여 닫기 |

연결 후보:

- 교환 → TS28 · 근거 sequence-observed88→90s · 제안 survivorId/tradeFixture/returnToScreenId전달;실재화계산없음
- 다음에/X/빈곳 → 미확인/호출부 · 근거 visible; later-near cursor world return · 제안 호출부dismiss;3수단개별실행검수필요

상태 fixture: {}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS17 챕터 완료 보상

root: Modal_TSV_TS17 · native modal · 직접본참조 TS17-R01

- TSV04챕터3보상:1K EXP×5/1분×5/보석×200/목재×720/식량×400직접확인.
- TS09-R01챕터2목재600과혼합금지.
- 배경은TS09미션창강한블러.실제모달배경유지+nativeblur제안;전체JPG금지.

새 그림: 무지개/별/색종이(글자없음) / EXP/가속/보석/목재/식량 / 기본9보상카드

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Btn_TSV_TS17_Continue | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Btn_TSV_TS17_Continue | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Img_TSV_TS17_Rainbow | Btn_TSV_TS17_Continue | image | 36,84,432,170 |  · 글자없는무지개/별/색종이새그림 |
| Txt_TSV_TS17_Congratulations | Btn_TSV_TS17_Continue | text | 58,124,392,90 | 축하합니다! |
| Txt_TSV_TS17_Subtitle | Btn_TSV_TS17_Continue | text | 74,226,364,32 | 챕터 미션 완료를 축하드립니다! 획득 보상: |
| Txt_TSV_TS17_Complete | Btn_TSV_TS17_Continue | text | 174,260,168,30 | 미션 완료 |
| Group_TSV_TS17_Rewards | Btn_TSV_TS17_Continue | group | 40,306,428,204 |  · 4열첫행+1둘째행;각92×92간20 |
| Group_TSV_TS17_Exp | Group_TSV_TS17_Rewards | reward | 40,306,92,92 | 1K EXP / x5 |
| Group_TSV_TS17_Speedup | Group_TSV_TS17_Rewards | reward | 152,306,92,92 | 1분 / x5 |
| Group_TSV_TS17_Gem | Group_TSV_TS17_Rewards | reward | 264,306,92,92 | x200 |
| Group_TSV_TS17_Wood | Group_TSV_TS17_Rewards | reward | 376,306,92,92 | x720 |
| Group_TSV_TS17_Food | Group_TSV_TS17_Rewards | reward | 40,418,92,92 | x400 |
| Txt_TSV_TS17_Hint | Btn_TSV_TS17_Continue | text | 130,826,272,44 | 화면을 터치하여 계속하세요. |
| Btn_TSV_TS17_Continue | Modal_TSV_TS17 | transparent-button | 0,0,504,894 |  · 전면투명button부모. 배경/딤/판/문구/보상은이부모의자식으로입력전달. 자기전체직사각형이닫기hit영역. |

연결 후보:

- 화면터치 → TS18 · 근거 TSV02reward→intro sequence; input unverified · 제안 보이는계속입력으로소개를여는제작예시.자동타이머추가금지/returnToTS03보존

상태 fixture: {"chapterId": 3, "rewards": {"exp1k": 5, "minute1": 5, "gem": 200, "wood": 720, "food": 400}}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## TS18 신규 챕터 소개 카드

root: Modal_TSV_TS18 · native modal · 직접본참조 TS18-R01

- 버튼/닫기X/터치안내없음.임시가짜닫기추가금지.
- 175→176초아트뒤숫자/제목등장.자동복귀처럼보이나시간/입력정책미확인.
- 목록단독보기권장;닫기없는연결로실행흐름에가두지않음.

새 그림: TS09챕터3배너공유 / 기본9흰카드

스크롤: fixed; no whole-screen scroll

| 이름 | 부모 | 종류 | x,y,w,h | native문구 / 역할 |
|---|---|---|---|---|
| Img_TSV_World | Modal_TSV_TS18 | image | 0,0,504,894 |  · 기존native새월드원화재사용가능;참조JPG금지 |
| Scrim_TSV | Modal_TSV_TS18 | panel | 0,0,504,894 |  · native dim/blur;그림과분리 |
| Panel_TSV_TS18_Intro | Modal_TSV_TS18 | group | 16,268,472,216 |  |
| BG_TSV_TS18_Intro | Panel_TSV_TS18_Intro | frame9 | 16,268,472,216 |  |
| Img_TSV_TS18_Banner | Panel_TSV_TS18_Intro | image | 22,276,460,172 |  · TS09챕터3새배너공유 |
| Txt_TSV_TS18_Number | Panel_TSV_TS18_Intro | text | 30,424,48,44 | 3 |
| Txt_TSV_TS18_Chapter | Panel_TSV_TS18_Intro | text | 24,456,54,24 | 챕터 |
| Txt_TSV_TS18_Title | Panel_TSV_TS18_Intro | text | 170,450,240,32 | 용사 집결 |

연결 후보:

- 목록단독보기 → 미확인/호출부 · 근거 source controls absent · 제안 전환없는시각샘플.실행도구수준복귀만,가짜게임닫기금지
- 월드복귀 → TS03 · 근거 automatic-looking sequence; exact input unverified · 제안 근거없는자동복귀연결미검수로기록

상태 fixture: {"chapter": 3, "title": "용사 집결"}

미확인: 원본계층/정확서체·slice·hitbox/실제입력. 본체의native조립/저장/실화면/반응형검수는이하위가수행하지않았습니다.

## 확인범위

- catalog배정가족및JPG19장직접확인,actual revision63읽기만.
- 제품소스/저장설계/등록표/공용보고/STATUS/가이드/타샘플수정0. 브라우저조작0. 원화생성/native조립/실입력/캡처검수0.
- TS11대표Lv.4와catalog내Lv.3기록혼합금지. TS09/17챕터별수치/TS14full·ready상태혼합금지.
- TS09세번째미션수량/TS13온실잘린수치/TS02약관끝부분/TS18자동복귀정책미확인. 없는문구/값을창작하지않습니다.
