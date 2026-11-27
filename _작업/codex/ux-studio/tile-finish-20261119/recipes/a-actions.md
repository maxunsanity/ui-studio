# 타일서바이벌 A 14가족 native UI 실행 레시피

작성자 codex 하위 tile_spec_a · 제안(검수 대기)

a-actions.json은본체가정상nativeUI로실행할조립레시피이며저장설계JSON이아닙니다. 이작업은제품모델/카탈로그/소스/공용보고수정,브라우저조작을하지않았습니다.

모든rect는ABS504×894논리px, parent는앞에서생성된key입니다. panel은기존9skin경로, button문자는nativechild/defaultpress tint이며별도image/text자식은button부모로입력전달합니다. 모달은독립단색배경;원본3D영역은plain+3D입니다.

TS12 inputControlsRequired의nicknameInput을실제편집입력으로설정하고preview중복문자를제거해야합니다. TS12/14/06 stateControlsRequired는관측선택상태설정목록입니다. TS10/11/17의전면입력은본체가native transparent frame root+별도BG dim으로설정합니다. 기존op는이힌트작업에서바꾸지않았으며거대한녹색버튼을완성형으로쓰지않습니다. TS18원본에는닫기/계속버튼이없으므로가짜컨트롤을추가하지않습니다.

| 가족 | actions | 본체 후속 |
|---|---:|---|
| TS12 | 34 | 실제native 입력, 선택상태 |
| TS14 | 29 | 선택상태 |
| TS16 | 24 | 입력/복귀/시각검수 |
| TS13 | 63 | 입력/복귀/시각검수 |
| TS15 | 53 | 입력/복귀/시각검수 |
| TS04 | 12 | 입력/복귀/시각검수 |
| TS06 | 14 | 선택상태 |
| TS01 | 15 | 기본프레임/문자대체 1건 검수 |
| TS02 | 13 | 입력/복귀/시각검수 |
| TS08 | 23 | 기본프레임/문자대체 2건 검수 |
| TS10 | 15 | 전면입력/복귀, 기본프레임/문자대체 1건 검수 |
| TS11 | 26 | 전면입력/복귀, 기본프레임/문자대체 1건 검수 |
| TS17 | 25 | 전면입력/복귀 |
| TS18 | 8 | 입력/복귀/시각검수 |

첫7가족: a-actions-first7.json(TS12/14/16/13/15/04/06). 나머지: a-actions-last7.json(TS01/02/08/10/11/17/18). 전체: a-actions.json.

추가원화4종확정반영: TS01 title-illustration-ui-v005.png; TS10 celebration-a-atlas-ui-v002.png 모루; TS11 powerplant-emblem-ui-v003.png(초기atlas발전소cell사용금지); TS17 celebration-b-atlas-ui-v002.png 무지개/색종이. 모두직접본생산본의nativeimage로만넣고원본문자는별도입니다.

남은시각차이는metadata에서분리했습니다: TS01장식로고외곽은native영문, TS08경고리본/갈색별카드는기본판+native기호, TS10붉은리본/광선은기본판, TS11방패/리본은기본판제안입니다. 관측값을새로추가하지않았습니다.

검증: 14가족354actions,허용op/고유key/부모선행/부모순환0/양수rect/기존ref/실제image·skin경로/atlasregion범위통과. 실제native조립/저장/reopen/입력/스크롤/화면동등검수는본체후속입니다.

## 반응형 native 앵커 힌트

기준은504×894이며원본rect·부모·문구·자원·op는바꾸지않고각action.anchorPreset enum만추가했습니다. 본체가정상UI의응답형속성에서적용합니다.

- 전체root/배경/3D자리는 stretch. 상단제목·고정요소는 top-left/top-right,상단가로판은 stretch-x입니다.
- TS12 commander/body,TS14 clipboard/paper,TS13 sheet,TS15 page는가변wrapper입니다. 큰paper안의본문·아이콘·버튼은위/아래고정으로분리하고개별그림을늘리지않습니다.
- TS13 list와TS15 messages는 stretch-y,목록의각행·초상·글자는 top-left입니다. footer/CTA/닫기안내는 bottom-left(필요한오른쪽컨트롤은bottom-right)입니다.
- TS02 terms/TS08 warning군/TS16 trade군/TS18 intro는고정높이 center. TS10/11의기록/리본/보상도고정규격 center이며마지막힌트만bottom입니다.
- 버튼은fullscreen root제외모두고정W/H앵커입니다. 고정wrapper안의자식은 percent를유지해도부모가늘어나지않습니다. TS12닉네임은아직본체native입력설정이필요하며초기문자만으로입력완료라하지않습니다.
- guide근거: AI_GUIDE.md:186(축고정/늘림·자동배치혼합금지),AI_GUIDE.md:427(가변body/상단고정/하단고정),USER_GUIDE.md:560(세로viewport/개별고정case/footer). 실제enum은 responsive-inspector.mjs:4~8,77입니다.

힌트검증:354actions 전부지원enum,일반버튼가변preset0,원본필드deep-equality보존. 저장모델/소스/공용보고변경0,실제기기화면검수는본체후속입니다.

## 읽기 쉬운 화면 이름

가족ID·nativeKind·actions는보존하고레시피의family.name만역할명으로바꿨습니다. 본체가nativeUI에서기존화면ID를보존해이름만맞춥니다.

| ID | name |
|---|---|
| TS12 | Modal_TSV_CommanderEdit |
| TS14 | Modal_TSV_SurvivorAccept |
| TS16 | Modal_TSV_ResidentExchange |
| TS13 | Modal_TSV_SurvivorDispatch |
| TS15 | Page_TSV_Mailbox |
| TS04 | Modal_TSV_StoryDialogue |
| TS06 | Modal_TSV_TutorialChoice |
| TS01 | Page_TSV_TitleLoading |
| TS02 | Modal_TSV_Terms |
| TS08 | Modal_TSV_RaidAlert |
| TS10 | Modal_TSV_BuildingUpgradeSuccess |
| TS11 | Modal_TSV_PowerplantRecord |
| TS17 | Modal_TSV_ChapterRewards |
| TS18 | Modal_TSV_NewChapter |
