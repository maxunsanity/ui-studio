# 새3화면 저장모델 QA · r72

codex 하위 에이전트 · 2026-11-19 · 제안(검수 대기)

대상은 TS09/TS22/TS26만입니다. root의TS19와 기존4화면 보완은 검사·수정하지 않았습니다. 브라우저/실제입력/렌더검수가 아닌 원본 reference와 저장모델 비교입니다.

## snapshot

- 고정 r72: /Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/backups/ux-25ecc98a-r72-d8b774a6-50ed-4f5c-9d42-a3f66851dc9a.json
- r72 savedAt 2026-11-19T00:59:45.351Z, SHA256 1a764e1865076c433ebb8c6ebba9634db861acebff95173a11a725b2f0defa88. 전체7화면389부품6연결, 대상3화면63+44+63=170부품.
- 첫 읽기 시점 current는r73/8화면419부품6연결이었습니다. 대상3화면은 r72와current에서 전체JSON deep-equal임을 확인했습니다. 이후root저장판까지 같다고 추정하지 않습니다.
- source: TS09-R03(TSV04 0초),TS22-R01/02(TSV02 272/307초),TS26-R01/02(TSV02 302/305초) 직접view_image. 현재 representative는 TS09-R03/TS22-R01/TS26-R02입니다.
- b-actions.json, 기존 image-map, art-manifest와 현재 등록glyphatlas도 대조. 좌표는 resolveRect의504×894 논리px 계산이며 실제DOM측정이 아닙니다.

## P1 · native 버튼 label/BG 좌표 계약 재확인

nonempty label11개가 직접 부모BG 경계를 벗어납니다. UI wrapper를 배치한 뒤 공장생성label/BG에 기존절대좌표가 남은 형태입니다. 의도된scroll clipping과 구분합니다. 같은입구의 글자/그림은 wrapper 안에서 원래ABS위치를 유지하도록 native에서 부모·좌표를 확정하고 재표시/저장 readback이 필요합니다.

예: Mission01 Claim owner는(368,320,96,48)인데 label은(384,322,88,48)이라 owner오른쪽8px/아래2px, 직접부모BG(380,322,72,43) 밖으로도 나옵니다. Close owner는(444,22,44,44), BG는(456,24,20,39), label은(456,24,44,44)여서 X 중심이 owner중심과 다릅니다.

|화면·글자|정확 label ID|직접부모BG ID|504×894 계산 rect|
|---|---|---|---|
|Modal_TSV_ChapterMissions / 수령|`element-267d554c-5782-436c-8dd2-9033643594ca-ui-label`|`element-267d554c-5782-436c-8dd2-9033643594ca-ui-background`|384, 322, 88, 48|
|Modal_TSV_ChapterMissions / 모두 수령|`element-53140cb3-660b-418c-8a23-83a88bb4e867-ui-label`|`element-53140cb3-660b-418c-8a23-83a88bb4e867-ui-background`|384, 692, 88, 48|
|Modal_TSV_ChapterMissions / ×|`element-950f17f2-1b5a-457e-91ff-9246d726fedf-ui-label`|`element-950f17f2-1b5a-457e-91ff-9246d726fedf-ui-background`|456, 24, 44, 44|
|Page_TSV_Recruit / +|`element-dfaf94d5-6a2d-4f13-9c7b-93ab5fa6ab33-ui-label`|`element-dfaf94d5-6a2d-4f13-9c7b-93ab5fa6ab33-ui-background`|352, 52, 20, 30|
|Page_TSV_Recruit / +|`element-5e50fe2f-75eb-4b07-88b1-a18215e9cd63-ui-label`|`element-5e50fe2f-75eb-4b07-88b1-a18215e9cd63-ui-background`|480, 52, 20, 30|
|Page_TSV_Recruit / 보상품 보기|`element-a9371366-4627-4a39-9c8b-bfde7238d31f-ui-label`|`element-a9371366-4627-4a39-9c8b-bfde7238d31f-ui-background`|428, 93, 74, 58|
|Page_TSV_Recruit / 모집 기록|`element-5cd85dca-1beb-4d65-8768-d3b8cb6fa1aa-ui-label`|`element-5cd85dca-1beb-4d65-8768-d3b8cb6fa1aa-ui-background`|428, 159, 74, 58|
|Page_TSV_Recruit / 무료 모집|`element-9d452f28-0489-4964-9000-8b187584cc66-ui-label`|`element-9d452f28-0489-4964-9000-8b187584cc66-ui-background`|136, 735, 258, 64|
|Page_TSV_HeroDetail / !|`element-7354389b-1f9d-4b26-8fb9-40e8fcac57e5-ui-label`|`element-7354389b-1f9d-4b26-8fb9-40e8fcac57e5-ui-background`|317, 535, 21, 31|
|Page_TSV_HeroDetail / 속성|`element-26d2f13b-bf5b-4cfe-b313-6cdeac2a1b7f-ui-label`|`element-26d2f13b-bf5b-4cfe-b313-6cdeac2a1b7f-ui-background`|100, 824, 192, 64|
|Page_TSV_HeroDetail / 스킬|`element-27018df7-f8a6-4176-a50b-070a174f7347-ui-label`|`element-27018df7-f8a6-4176-a50b-070a174f7347-ui-background`|304, 824, 192, 64|

권고: label을 해당 Btn owner의 직접자식으로 정리하고 ABS위치를 정상범위로 고친 뒤, owner에이미skin이있는 경우 불필요한factory BG를 별도검토합니다. BG를삭제하기 전 label을먼저이동해야합니다. BG의 opacity를0으로만만들면 자손글자까지사라질수있습니다. 모든 BG를기계적으로삭제하라는뜻이아닙니다. 현재factory BG에는 빈image와opaque fill(#dcefe8/#dbe2e9)이남아있어 원래owner skin 위의추가사각형이될가능성도 native에서확인해야합니다.

## P1 · 누락문구와 조건입력 부모

1. `element-4554d488-716a-4b57-9dbe-995a1bc7242b` (Txt_TSV_TS26_levelLabel): text=빈값. 원본305초와 recipe는 **레벨**. 현재rect(195,652,126,29)는맞으므로 native문구만복구하고 readback. level5/전투력5,744/EXP52,500/500을바꾸지않습니다.
2. `element-02239523-07cb-4444-8295-99aa6634f146-ui-label` (Txt_TSV_TS26_BuildingRequired): parent가 `element-7508df8f-a04d-470b-a4da-782d27b47c26` Page루트이며 interaction=parent. 조건이동Btn `element-02239523-07cb-4444-8295-99aa6634f146`의자식이아닙니다. 원본이별도조건문구와이동버튼인점을살리려면 이문구는표시전용none; 조건문구도같이입력시킬계획이면 실제Btn owner로재부모화하되 owner범위를문구까지확장해야합니다. 미확인 ‘글자클릭도이동’ 정책을만들지않습니다. 지금의root-parent 입력은 의도한Btn owner로전달되는구조가아닙니다.

## P1 · 화면높이변경에서 고정UI가 전부세로늘어남

대상170개요소의rectTransform은0개입니다. 단일page 부모아래의legacy % 배치라 fixed폰트는유지되는데 footer/button/별칸/자원바 높이만늘거나줄어듭니다. 실제겹침·클리핑은GUI미검수입니다.

|정확 ID / 역할|H894 rect|H1091 rect|H672 rect|
|---|---|---|---|
|`element-771c05cb-ee8c-4c14-b97a-67c38cc7fc2b` Panel_TSV_ChapterMissions|0, 60, 504, 740|0, 73.22, 504, 903.06|0, 45.1, 504, 556.24|
|`element-fd8f171e-dc80-4e5c-b37f-8fe9f132df9f` HUD_TSV_TS22_Bottom|0, 818, 504, 76|0, 998.25, 504, 92.75|0, 614.87, 504, 57.13|
|`element-67450975-4279-4516-8588-d88725e29698` BG_TSV_TS22_Currency|245, 46, 251, 36|245, 56.14, 251, 43.93|245, 34.58, 251, 27.06|
|`element-f8b389cf-2b41-4901-952c-26ed7f4626c5` HUD_TSV_TS26_Bottom|0, 818, 504, 76|0, 998.25, 504, 92.75|0, 614.87, 504, 57.13|
|`element-b8a27abc-7d09-46c8-a9d8-0e6af9a40039` Txt_TSV_TS26_StarSlot01|139, 585, 40, 44|139, 713.91, 40, 53.7|139, 439.73, 40, 33.07|

우선 footer2개는 기존 Heroes footer와같이하단고정76px를검토합니다. TS22 Currency는상단고정36px, 버튼입력·glyph·label도같은고정부모아래묶어야합니다. TS26 별칸 font40/lineHeight48인데 H672에서칸높이33.07이되어 위험합니다. 모달740높이를그대로고정하면짧은tablet에서들어가지않으므로 TS09는사용기기정책에맞춰panel/viewport를나눠검수해야하며 전체를한꺼번에‘고정740’로바꾸라고권하지않습니다. empty3D Slot은stretch를유지합니다.

## P2 · source와다른 그림/프레임의 정확ID

- `element-950f17f2-1b5a-457e-91ff-9246d726fedf` (Btn_TSV_Missions_Close): 현재skin.mode3,normal=`sha256-114adf9fa11a14e1b42f5e6323374f3cd86936654434c4426c1776a601f8aff1.webp`(초록가로CTA160×64). 원본은파란X입구입니다. Claim/ClaimAll의초록3slice는맞지만Close44²는그자원을공유하면안됩니다. native파란배경+X로분리, label계약도위에서보완합니다. 정확원본깃발외곽은미확인으로남깁니다.
- `element-bd22816d-4d2b-4ba0-828b-1cd26f785245` (Img_TSV_TS26_HeroClass): 새glyphatlas의총[128,0,64,64]은의미상적절하지만원본은cloud와총2개입니다. 지금총이cloud자리x220에하나만있습니다. 총을원본오른쪽자리부근x260,y43로이동하고 cloud는기존hero-filter-cloud-v003자원으로독립추가할후보입니다. 새cloud부품의부모는 `element-7508df8f-a04d-470b-a4da-782d27b47c26`이며원본에없는역할명/값은만들지않습니다.
- `element-bcb472df-e776-404c-bfe0-af113e2699c8` (Img_TSV_TS26_HeroRank): atlasregion[450,0,150,150]은파란원형교차검메달입니다. 원본305초의주황육각문양배지와다릅니다. 정확rank문양자원없음으로기록하고교차검을원본과같다고주장하지않습니다.
- `element-8e9b0a36-4329-497c-b4b4-e8bfd6163ce0` (Img_TSV_TS26_HeroPromote): 현재톱니원형medal-arrow-up. 원본은사각파란버튼안흰위화살표입니다. 이미새glyphatlas `sha256-6f3d559bc3cfa1400301ffd57a5dc6e0d2c15116b1db5d8ba72542b45260e09d.png`의[128,64,64,64]흰up가있으므로현재Btn `element-84a6df8c-b55c-4723-93b8-d7ae0bfbfd4e` 안에그glyph를참조하는방안이더맞습니다. 새로운게임결과/성급값을만들지는않습니다.
- TS26 Prev/Next owner `element-de712e45-caf1-4ff6-979b-97891d449916` / `element-d3c47ed8-2f39-4913-8a1d-7882adc8d60c`: 현재9slicebackplate,원본은장면위화살표입니다. 완전투명입력wrapper와별도glyph로갈지native외관대조가필요합니다. Next의녹색오른쪽화살표도원본흰/하늘색외관과다름을남깁니다.

## 상태/label/같은역할 검사에서 잘못고치지않을것

- text63개(TS09=20,TS22=17,TS26=26) 모두partRole=label. fill#ffffff가있다는이유만으로흰박스결함을확정하면안됩니다. 현재layout-view.mjs157은kind=text/partRole=label의unit-surface를만들지않습니다. 현재글자배경처리계약은정상입니다.
- TS09 미션01/02/03의Gem/Wood/Food카드9개는모두64×64, 카드별폰트/수량슬롯은같습니다. Claim/ClaimAll96×48, TS22두탭141×72, Plus28×30, TS26상단정보46²/PrevNext44×52/하단속성스킬200×64 등동일역할wrapper크기는맞습니다. ChapterEXP64×70과다른chapter보상64×64차이는원본의EXP장식돌출과분리해확인할수있지만이번critical로단정하지않았습니다.
- 대표상태의확정disabled부품은없습니다. TS09수령가능1행은enabled,나머지2행은체크이미지라입력버튼이아닌현재구성이맞습니다. TS22무료5→활성무료버튼, TS26조건제한→녹색Upgrade CTA없음이맞습니다. 조건바의이동화살표를실제upgrade불가라는이유로임의disabled하지않습니다.
- TS22 일반/고급 `element-dcb5857e-f78c-497a-9d65-28516f1511eb` / `element-df7dd4dc-f02b-425a-96f6-2baefeb49cb0`, TS26속성/스킬 `element-26d2f13b-bf5b-4cfe-b313-6cdeac2a1b7f` / `element-27018df7-f8a6-4176-a50b-070a174f7347`은모두selectable=false/selected=false입니다. 본체가이미 controls/연결미완료로구분했으므로새결함으로과장하지않습니다. 최종에는관찰된일반/속성선택skin과native선택계약을확인하고미관찰본문/필터결과는만들지않습니다.
- TS09상자3행이Viewport아래14px로나오는것은scroll-y/원본의잘린3행구조와맞습니다. 모든out-of-parent를clamp하면틀립니다.
- TS22새trio2D홍보삽화·sage튜토리얼초상·고급pink-scout/일반sage는현재R01역할에맞습니다. TS09새chapter-heroes배너·Gem/Wood/Food·EXP/Speedup도자원역할은맞습니다. 원본동등승인을의미하지않습니다.
- 새glyphatlas의책/목록검색/총은실제새원화로역할을맞췄습니다. 정확폰트/재질/픽셀동등은미완료입니다.
- TS26 Slot_TSV_TS26_3D `element-f23178d5-5f96-4ec1-934b-c5d1fd0d1c3c`는빈plain+독립3D영역글자이며모델그림은없습니다. 올바른최신경계입니다.

## 빈factorylabel · 임의문구를추가하지않을것

실제누락은위levelLabel하나입니다. 아래7개의icon-only빈label은factory잔여이며뒤로/책/정보/화살표같은정상아이콘이있으므로무작위문구를넣지않습니다. 정리시현재입력owner/그림을유지하며빈label만native에서제거할수있습니다.

- `element-336cea2f-3745-42d6-b3bf-f0bddd0fa33b-ui-label` Txt_TSV_TS22_Back
- `element-895c5375-146e-4c3a-b6e4-b451030fb3d1-ui-label` Txt_TSV_TS26_HeroProfile
- `element-4c729408-4e4c-4c5d-9eb9-68ee714a9820-ui-label` Txt_TSV_TS26_HeroInfo
- `element-de712e45-caf1-4ff6-979b-97891d449916-ui-label` Txt_TSV_TS26_PreviousHero
- `element-d3c47ed8-2f39-4913-8a1d-7882adc8d60c-ui-label` Txt_TSV_TS26_NextHero
- `element-84a6df8c-b55c-4723-93b8-d7ae0bfbfd4e-ui-label` Txt_TSV_TS26_HeroPromote
- `element-bea51493-f578-48ea-b033-afbd20ede604-ui-label` Txt_TSV_TS26_Back

## 검증과경계

읽기전용validateDocument 통과,원본5장/등록glyph·atlas·promote3장view_image,직접부모bounds계산,3높이resolveRect,실제등록resource/region및recipe역할대조를수행했습니다. current신규TS19는읽어검사하지않았습니다. 이번문서외변경0,GUI/HTTP/npm test/서버/빌드/패키지/공용수신·STATUS·보고작업0입니다. 소스전체시험이나실화면완료·전부품동등을주장하지않습니다.
