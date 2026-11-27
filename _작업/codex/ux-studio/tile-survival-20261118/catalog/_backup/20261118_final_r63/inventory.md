# 타일 서바이벌 · 4영상 UI 관측/재사용 기획

작성자: codex(단이) · 2026-11-18T13:37:17+09:00 · planned / 제안(검수 대기)

GUI 부품 계층·텍스트 분리·9slice·상태·연결 예시를 만드는 UI스튜디오 샘플의 계획입니다. 게임 전체 구동 기획이 아닙니다.

**대상 실제 상태:** 본체가 실제 도구에 workspace-76e57701-a74e-4e37-a4f6-9e83c12cd6fc / ux-25ecc98a r6, Page_TSV_Territory 504×894를 1화면·8부품·0연결로 저장했습니다. 영지 첫 부품 조립 진행 상태이며 31개 분석 가족의 제작 완료가 아닙니다. 이 수치는 본체 전달값으로, 이 카탈로그 작업자가 저장 JSON/브라우저를 재검수한 값이 아닙니다.

[갤러리](index.html) · [카탈로그](catalog.json) · [타임스탬프](timestamp-manifest.json) · [기존 샘플 실제 계층 데이터](sample-evidence.json) · [검사](verification.json)

## 보이는 구조 가족

원본을 통합한 제작 가족 **31종**, 공통 부품 4군, reference cinematic 3군입니다. 31이라는 수를 목표로 맞춘 것이 아니라 동일 구조의 내용 변형을 합친 결과입니다.

|ID|구조|유형|영상 원본|상태|
|---|---|---|---|---|
|TS01|타이틀 / 로딩|screen|TSV01-TS01|planned|
|TS02|게임 이용약관|modal|TSV01-TS02|planned|
|TS03|영지 / 월드 공통 HUD|screen|TSV02-F01, TSV03-01, TSV01-TS03|planned|
|TS04|스토리 / 주민 대화|sheet|TSV01-TS04, TSV02-F15|planned|
|TS05|건물 내부 / 가구 선택|sheet|TSV02-F03, TSV03-07, TSV01-TS05|planned|
|TS06|튜토리얼 대응 방식 2택|modal|TSV01-TS06|planned|
|TS07|건물 업그레이드 조건|sheet|TSV02-F04, TSV03-08, TSV01-TS07|planned|
|TS08|습격 예고 / 이동 안내|modal|TSV01-TS08|planned|
|TS09|챕터 미션 노트|modal|TSV02-F12, TSV04-01, TSV01-TS09|planned|
|TS10|일반 건물 업그레이드 성공|overlay|TSV02-F05|planned|
|TS11|발전소 레벨 증가 기록판|overlay|TSV02-F06, TSV03-02|planned|
|TS12|지휘관 정보 편집|modal|TSV02-F07|planned|
|TS13|생존자 파견|sheet|TSV02-F08|planned|
|TS14|생존자 수용|modal|TSV02-F09|planned|
|TS15|근거지 편지함|screen|TSV02-F10, TSV03-13|planned|
|TS16|주민 자원 교환|modal|TSV02-F11, TSV03-11|planned|
|TS17|챕터 완료 보상|overlay|TSV02-F13, TSV04-02|planned|
|TS18|신규 챕터 소개 카드|overlay|TSV02-F14|planned|
|TS19|소대 설정 / 출전|screen|TSV02-F17|planned|
|TS20|전투 HUD|screen|TSV02-F18|planned|
|TS21|전투 승리 / 통계|screen|TSV02-F19|planned|
|TS22|영웅 모집|screen|TSV02-F20, TSV03-06|planned|
|TS23|신규 영웅 해제 소개|screen|TSV02-F22|planned|
|TS24|모집 결과 / 재모집|screen|TSV02-F23, TSV03-10|planned|
|TS25|영웅 보유 목록|screen|TSV02-F24, TSV03-04|planned|
|TS26|영웅 상세 / 성장|screen|TSV02-F25, TSV03-05|planned|
|TS27|신규 기능 해제 배너|overlay|TSV02-F26|planned|
|TS28|친밀도 상승 보상|overlay|TSV02-F27, TSV03-12|planned|
|TS29|채팅|screen|TSV03-03|planned|
|TS30|생존자 도감|screen|TSV03-14|planned|
|TS31|생존자 프로필 / 이야기|modal|TSV03-15|planned|

## 중복 통합 / 제외

- 동일 틀의 이름·건물·주민·수치·색·아이템·목록 길이 변화는 상태/데이터로 통합
- 영웅 모집 일반/고급·무료/소진은 TS22, 결과 영웅/조각은 TS24
- 영웅 목록/상세는 TS25/26으로 영상2·3 통합
- 제이슨 교환은 TS16, 친밀도 상승은 TS28으로 영상2·3 통합
- 스토리 대화는 TS04, 생존자 프로필/스토리탭은 TS31로 서로 다른 구조
- HUD·타이머·튜토리얼손·작은 말풍선·부유피드백은 공통부품/상태
- 순수 3D/열차/노트 펼침은 reference cinematic으로 분리, UI 가족 수에 제외
- OS Google Play 알림·Steam/Shift+Tab·커서·뷰어 툴팁은 게임 UI 제외

- TSV01 210/215/220초는 모두 목재공방 조건 빨강·회색 업그레이드 CTA입니다. 215초를 충족 상태로 적지 않았습니다. 충족 상태는 TSV02 101초의 녹색 CTA로 확인합니다.
- TS10 일반건물 성공과 TS11 발전소 기록판은 중앙 몸체가 다릅니다. 폭죽/보상비행 자체를 별도 가족으로 늘리지 않았습니다.
- TS17 챕터완료 보상과 TS28 친밀도 보상은 축하 헤더를 공유하지만 관계변경/편지함 CTA 유무로 몸체를 분리합니다.

## 제작할 공통 규칙

- 프레임/원화/글자/입력 wrapper/배지/엔진 그림자를 분리합니다. 버튼 글자와 수치·이름을 그림에 굽지 않습니다.
- 9slice는 새 원화의 모서리/끝단과 가운데를 분리할 제작 제안입니다. 원본 프레임 JPG를 잘라 제품 자산으로 사용하지 않습니다.
- 버튼 normal/pressed는 같은 캔버스·기준점·바닥을 사용합니다. 미관찰 pressed 원화는 제작 제안이며 관측 사실로 쓰지 않습니다.
- selected/disabled/locked/claimed/requirements-satisfied 상태는 관찰 근거를 붙입니다. 이름/수치/초상은 데이터 변형으로 전달합니다.
- 소스 관찰 연결과 planned UI샘플 연결을 구분합니다. sequence_observed는 영상 순서/커서와 결과 관찰이며 실제 이벤트 로그 검증이 아닙니다.
- Unity 계층은 원본 복원이 아니라 제작 제안입니다. 각 가족의 plannedComponentHierarchy가 독립글자·버튼스킨·데이터 전달 경계를 설명합니다.

## 기존 샘플을 먼저 대조한 근거

sample-match/inventory.json, match-candidates.md, selected-layout-evidence.md를 읽고 저장 데이터의 계층/크기/폰트/상태/연결을 sample-evidence.json에 보존했습니다. 원본 디자인 JSON은 수정하지 않았습니다.

|샘플|저장 ID/revision|이번 관찰|
|---|---|---|
|monopoly-go|ux-gjs-0d80d7fe r354|저장 JSON 관측·시각동등 미검수·복사/적용 안 함|
|capybara-go|ux-gjs-4e64eb72 r90|저장 JSON 관측·시각동등 미검수·복사/적용 안 함|

모집은 Chests의 뽑기/종류탭, 영웅은 Equipment의 카드/스탯, 챕터는 SevenDay/QuickWins/Continent의 미션행을 부분 재사용 후보로 삼았습니다. Hero/Recruit/Story 완제품이 기존 샘플에 있다는 뜻이 아닙니다. 차이는 각 가족에 명시했습니다.

## 직접 확인 / 인용 관측 / 미확인

- 직접: TSV01 contact-1..3 전체와 0/5/30/65/70/95/105/170/200/210/215/225/240초 선택 개별 프레임. TSV02 일부 성공/건설조건/인력/전투 대표, TSV03 발전소 성공 대표를 추가 육안 확인했습니다.
- TSV02 전체28 로컬분류와 TSV03/04 전체17 로컬분류의 상세 행동은 배정된 다른 분석자의 inventory 원문을 사용했습니다. 현재 작업자가 전 영상을 재생하거나 모든 개별 대표를 재검수한 것으로 쓰지 않습니다. 대상의 r6·8부품·0연결은 본체가 확인해 전달한 별도 제작 진행값입니다.
- 모든 좌표는 504×894 참조 프레임의 넓은 구역을 육안 근사한 값입니다. 브라우저 실측/정확 hitbox/원본 엔진 RectTransform이 아닙니다.

- 실제 원본 Unity hierarchy/폰트/9slice 경계/정확 hitbox
- 원본 전체 UI를 빠짐없이 본다는 보장: TSV01 5초 샘플 사이 짧은 UI 누락 가능
- 기존 샘플은 저장 JSON 계층/크기/폰트/연결 데이터 관측이며 이번 영상과 시각동등 검수 아님
- 목적지/행동 결과가 보이지 않은 컨트롤과 실제 게임 로직
- 영지 첫 8부품 이외 전체 가족의 도구 조립·상태/화면 연결·원화 신규제작·반응형·입력 실검수는 미완료
- 영상 관측 수치/문구는 fixture이며 제품 발란스 승인값 아님

## 검증 / 변경 범위

catalog 폴더만 신규 작성했습니다. 제품 소스·다른 샘플·저장 디자인 JSON·공용 STATUS·공용 보고·서버·브라우저 변경은 0입니다. 검사 스크립트는 가족 ID/연결/참조/파일/좌표/HTML 앵커/이미지 크기·해시/검색 분류 코드 존재를 검증하며 결과는 verification.json입니다. 실제 브라우저 실행/모바일 시각 검수는 하지 않았습니다.

원본이 없는 신규 후보만 작성했으므로 기존 파일 백업 대상은 없습니다. 입력 영상/추출 원본은 변경하지 않았습니다.
