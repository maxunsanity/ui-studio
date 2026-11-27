# Tile Survival 기존 4화면 감사 · r64 읽기 전용

작성: codex 하위 에이전트 · 2026-11-19 09:20 KST · 제안(검수 대기)

본체의 native UI 편집과 독립적으로 **저장 r64만** 검사했다. 본체가 현재 조립 중인 TS09 미저장 내용은 읽지 않았고, 빈 다섯 번째 화면을 기존 4화면 결함으로 세지 않았다. 브라우저·실제 입력·모바일 렌더 검수는 수행하지 않았다.

## 근거 snapshot

- Workspace `workspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc`, project `ux-25ecc98a`, schemaVersion4.
- 저장 파일: `/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json`.
- r64 / savedAt `2026-11-18T23:49:37.730Z`, SHA256 `f0af4046cfdb4fc25f983184f2c0e6b071ca5c5801bb53d3250c2b0517f21c37`.
- 기존4화면: main 50 / BuildingInterior48 / BuildingUpgrade43 / Heroes78 =219부품·5연결. 다섯 번째 ChapterMissions는 빈 저장 scaffold.
- 논리504×894. 아래 좌표는 최신 `model.mjs`의 `resolveRect` 계산값(논리px)이며 실제 브라우저 실측이 아니다.
- JSON이 한 줄 저장이므로 근거 위치는 `screens[n]`, 요소 stable ID와 필드명으로 표기했다.

## 우선순위와 native 편집 권고

### P1 · 최신 ‘3D 구역은 비우고 3D 표기’와 기존 장면이 충돌

|화면/요소|현재 저장값|권고|
|---|---|---|
|main / `Img_TSV_TerritoryScene` / `element-ef783622-78d2-4242-af0e-25db38834f18`|ROOT, image, xywh0/0/100/100%, 해석0/0/504/894, fit=cover, assetRef=`sha256-ac8252341468ca1144c8db05c6b37839a5a75b52315463c0669b1ee71a85a438.webp`|native UI에서 장면 참조를 해제하고 빈3D 슬롯과 독립 `3D` 글자로 전환. 이미지 파일·과거판은 보존. HUD/메뉴/배지는 별도 유지.|
|Building / `Scene_TSV_Building` / `group-72ca6f64-54b6-4624-9169-f1d3a613f4ef`|ROOT, stretch rectTransform min[0,0]/max[1,1], position[0,140], sizeDelta[0,-280] →0/0/504/614|이 영역만 빈3D 슬롯+독립3D 글자. 하단280높이 UI와 자원HUD는 유지.|
|위 Scene 자식 `Img_TSV_Building_Greenhouse` / `element-1314bf62-e3ec-48cc-b37e-f4bf6ba599c1`|image100×100%, fit=cover, assetRef=`sha256-b72852dcd6e61f3dc2a5a897f953b2199f5e99df4b7de70c5df221e6a6bbec39.webp`|native에서 장면 참조를 해제. 슬롯 위2D 레벨배지/선택영역의 필요 여부는 본체가 최신 지시와 대조.|

위 두 등록 이미지를 직접 view_image로 확인했다. 모두 새 정적 영지/온실 장면이고 UI reference JPG 통째 재사용은 아니다. **기존 제작 방식의 위반이 아니라 최신 빈3D 지시와의 불일치**로 기록한다. 일반2D 초상/메뉴/카드 일러스트를 같은 이유로 지우지 않는다.

### P1 · main의 관찰된2D 골격 일부 미조립

main의 ROOT는 Scene, TopHUD, 건물입력, Nav, GemShop 다섯 개뿐이다. Top64·Nav64·GemShop96×52는 유지하면서 다음을 독립 부모/그림/글자로 보완할 수 있다. 각 입구가 보이는 사실과 목적지가 완성된 사실은 구분한다.

- TS03-R03(영상2 425초) 직접 관찰: 좌측 이벤트 초상입구, 우측 세로 퀵버튼/빨간배지, 좌하단 추가 입구, 하단 퀘스트 안내가 존재한다. 현재50부품에는 해당 역할 요소가 없다. 카탈로그 TS03의 EventEntry/QuestStrip/QuickEntryRail은 계획 계층이며 조립 완료가 아니다.
- 채팅 미리보기는 카탈로그 TS03의 다른 관찰 상태/regions에 기록되어 있으나, 이번 직접 육안 확인한425초 프레임만으로 상세 문구/두 줄 여부를 확정하지 않는다. 별도 관련 원본 확인 후 제작한다.
- 새 TS09의 진입이 필요하면 원본에서 관찰된 퀘스트 입구를 native 부품으로 만든 뒤 **완성된 실제 화면**에만 연결한다. 임시 투명 전체화면버튼이나 스크린샷오버레이로 대신하지 않는다.
- `Btn_TSV_Territory_Building` / `element-039d35eb-e1f4-490a-805c-cde674440c99`는210×170@(150,360), 중심고정앵커. Level_BG/Txt의 과거6px 부모돌출은 이미 해소되어 현재 결함으로 재기록하지 않는다.

### P2 · Building의 우측 주민 UI 카드·가구 선택 상태 누락

영상3 요청35초/실제34.9916667초 원본은 저장 제목/수치의 직접 대응 상태다. 온실Lv.3, 목재9.75K, 금속327, 생산1.11K/시간은 현재 저장과 맞는다.

- 원본35초에는 우측 주민 clipboard 초상카드와 빨간알림점이 보인다. 저장48부품에는 이에 대응하는 부모/그림/배지가 없다. 3D빈칸과 별개인2D UI로 검토한다. 정확한 이름/동작은 미관찰인 상태로 보존한다.
- Furniture01 `group-82aeed56-cd32-40b0-8a26-0cc9b35cc954`, 02 `element-222c977e-f54b-4a57-8dbf-ba1e800a9365`, 03 `element-9674ac23-dca8-4431-a791-3f8b7228d187`, 04 `element-ab2c0db8-ea73-4243-b715-72ee9743a554`: 모두 kind=panel, interaction/buttonState/전이 없음. x=10/130/250/370,y714,110×170, 간격10은 규격에 맞음.
- 현재 LevelOn=●●●●/LevelOff=●●가 네 카드 모두 동일하다. 원본35초는 카드마다 점 상태가 다르고 네번째 카드는 어두운 잠김 표시다. 원본에 보이는 상태를 개별 독립 글자/이미지로 대조해야 하며, 동일값 복제 상태를 전 카드 동등 완료로 보지 않는다. 정확 점수는 원본 확대 확인 후 적용한다.
- 가구 선택/상한토스트/가격·성장 결과는 현재 미구현. source sequence에 없는 비용이나 결과값을 만들지 않는다.

### P2 · Upgrade의 별도 원본시간 라벨 누락과 상태 경계

- `Modal_TSV_BuildingUpgrade` / screen `screen-69d5b36b-cc28-4ecd-a95a-96be618354e2`은 sheet부모 `group-5ac03180-2697-46f8-b864-04584cda425c`가0/436/504/458, 하단고정. 보상4열과 조건2행의 현재 내용은 영상3 요청38초/실제37.9916667초와 대응한다.
- 원본38초에는 조건영역 아래/CTA 위에 **`원본 시간: 00:00:03`** 독립 문구가 있다. 저장에는 해당 text요소가 없다. 현재 `Txt_TSV_Upgrade_ConfirmTime` / `element-39e6201b-63cc-4df6-a821-8261bca630f8`는 버튼 안 `◷ 00:00:03`일 뿐이다. 조건부모 bottom792와 CTA y833 사이에 독립 native text로 보완할 수 있다. 원본 관찰 문구이며 게임 타이머 구현으로 해석하지 않는다.
- Confirm / `element-759fb74d-e722-4af0-bc61-17d1d3a49dc8`:305×55@(104,833), enabled=true, tint, targetGraphic=self, action navigate→main, condition=always. 이는 조건충족 fixture 하나다. 조건미충족 회색상태/바로가기화살표는 카탈로그 TS07 관찰 상태지만 현재 미조립.
- TSV01 210/215/220초는 **모두 미충족**, 215초를 충족상태로 사용하면 안 된다. TSV02 101초는 충족상태. 본체가 상태를 추가할 때 이 출처를 유지한다.
- presentation dim=true/blocking=true/dismissOnEscape=true/closePolicy=allow/rootMode=fullscreen. audit()의 ‘닫기/복귀없음’은 close/back edge만 세는 검사의 제한이다. Confirm→main과 Escape정책이 있으므로 오류표시를 없애려고 원본에 없는×를 추가하지 않는다.

### P2 · Heroes의 입력·선택상태와 카드보조UI 누락

- Filter01 `group-f38b54ec-923b-46aa-a57c-d575fa199556`,02 `group-57f9e302-7b93-47c5-a9bd-989ae7932609`,03 `group-6723f7bc-edb0-4ad9-8cf9-79cbbd844934`,04 `group-0b552ab6-0a83-4a0d-82ad-3db663ab9660`: 모두 panel/isGroup, interaction/buttonState/control 없음,111×56@(18/137/256/375,52). 현재 전체밝은스킨은 정적 차이이며 실제 selected상태가 아니다. 필터 결과를 추측하지 말고 관찰된 선택skin/키보드입력의 fixture 범위부터 검토한다.
- Hero01..11 부모는 모두 panel, interaction/buttonState/카드출발전이 없음. 기존4열111×180와 gap8/10은 맞다. source TS25-R01의 카드역할무기배지·속성배지, 보유2카드의 별, 카드02 빨간알림/녹색 성장화살표는 독립 native 요소가 없다.
- Hero01 `group-3a3f4494-0292-4bde-8fc6-bed0dee78c98`와 Hero02 `group-6b1224b0-e311-4258-830b-cce77ed90ec5`는 BG+Portrait+Status 각3자식뿐이다. Hero03..11도 BG+Portrait+CountBG+Status뿐. 실제 Hero01 portrait 및 BG자원을 view_image로 확인했으며 위 UI가 이미지에 구워져 있지도 않다.
- Recruit / `element-a9cb88c6-679f-4c19-8e22-46a516f92347`: enabled action, tint,336×64@(84,824)이지만 출발전이0. TS22가 아직 미제작인 한 정확한 미연결로 남긴다. 새 목적지 실제제작 후 연결한다. Back `element-5eed0a24-a228-4dce-81ac-eff668fea902`의 back연결은 현재 존재한다.

### P2 · Building ResourceHUD의 높이만 비례로 늘어남

`HUD_TSV_Building_Resource` / `group-a62d2c31-0ee6-4fb1-aeb0-f78c55fd36e5`는 ROOT이며 x8.7301587/y0/w66.468254/h3.2438479%, rectTransform없음이다. resolveRect 계산 결과 폭335·x44는 일정하나 화면H894→높이29, H672→21.7986577, H1091→35.3903803이다. 내부 고정 fontSize/lineHeight와 세로비율이 달라진다. 상단고정29px 제작 의도라면 native에서 topanchor+고정높이로 보완한 뒤 tablet/phone 렌더를 확인한다. 현재 브라우저 잘림을 재현했다고 주장하지 않는다.

## 정상/의도 항목 · 불필요한 수정을 피할 것

- validateDocument 통과: 지원schema·ID중복·부모누락·순환·전이대상 검사 정상. 기존4화면 중복ID0.
- 504×894 parent경계 계산상 의도된 `Txt_TSV_Upgrade_New`의2px 위돌출만 있다. id `element-bc6c4f1a-63ac-46c2-b3e4-2b6e5166088c`, y542, 부모Reward01 y544. guide가 의도적 장식으로 명시하므로 일괄clamp하지 않는다.
- TopHUD64·Nav64·BuildingBottom280·UpgradeSheet458·HeroesHeader108/Footer76은 고정앵커이며 H672/894/1091에서 높이를 유지한다.
- HeroList `group-e0be6b71-3ec5-42ba-b372-9aaff32baee3`: overflow=scroll-y, scrollbar=hidden, min[0,0]/max[1,1], position[0,-16], sizeDelta[-36,-200]. 해석 x18/y116/w468/h=H-200. Hero01..11 고정카드 총내용높이560. H672에서 viewport472가 되어 스크롤 필요하나 설정은 이미 있다. ‘스크롤 미설정’으로 보고하면 틀림.
- 이름은 범위/역할이 대체로 명확하다. 이름정리만으로 stable ID/parent/연결 재발급은 불필요. 구형 generic info/alt ‘이미지 자리’는 설명 보정 후보이며 구조결함으로 과장하지 않는다.

## 직접 읽고 본 원본

1. ui-studio 루트 AGENTS.md 전체, sample/ui-studio/AGENTS.md, sample README·ui-studio README·integration·project.json.
2. sample/docs/PRODUCTION_GUIDE.md의 현재범위·계층/상태/입력/native/참조금지 절, docs/reference/catalog.json의 TS03/05/07/25, inventory.md, 공통 guide/PROGRESS.md .36.
3. 저장 ux-25ecc98a r64 JSON 전체(읽기전용), model.mjs·responsive-layout.mjs 관련 resolver/검증계약. Graphify 기존 graphify-out/graph.json은 루트에 없어 지정자료를 좁혀 직접조회.
4. 직접 view_image: docs/reference/references/TS03_03_TSV02_0425.00s.jpg, TS05_01_TSV02_0017.00s.jpg, TS07_04_TSV02_0101.00s.jpg, TS25_01_TSV02_0330.00s.jpg.
5. 직접 view_image: `_작업/codex/ux-studio/tile-survival-20261118/video-b/TSV03/fine/frame_00035.jpg`·`frame_00038.jpg`, 같은 index.json으로 실제시각 대조.
6. 직접 view_image: 위 main/greenhouse장면 두 asset, Hero01 portrait asset `sha256-5d000f8169206bc20365cef7277c7b2feb4c799542fa4a87d22ccf7eda85d1fb.webp`, Hero01 BG `sha256-372a1d6a635bb292173bb4d5de4b3e02eb957d7f10941258263a3a1aa25bcff6.webp`.

## 수행한 검사와 하지 않은 것

- 읽기전용 Node: 현재 model.mjs import → validateDocument(d) → audit(d), resolveRect at504×894/504×672/504×1091. 진단 출력만 생성하고 입력 JSON을 쓰지 않았다.
- savedSHA 확인1회. 현재 root의 미저장 편집 이후 최신성이나 완료를 보증하지 않는다.
- source/model/저장JSON/프로젝트메타데이터 변경0. 새독립감사문서1개만 작성. 기존 원본 변경이 없어 백업 대상 없음.
- native UI·키보드/마우스·실기기·브라우저렌더·HTTP·서버·7007·npm test·빌드·패키지설치·예약·공용수신/STATUS/보고폴더 작업0. 다른 담당 자료·보호play.html 미접근.
- 이번은4화면의 구조/누락 감사이며 전체31가족 제작완료·픽셀동등·원본Unity·게임동작·사용자승인 근거가 아니다.
