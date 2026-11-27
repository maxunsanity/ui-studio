# 공통 UI 규칙·TOKENS 단일 정본 계획 — .22 초안

codex(단이) · 2026-11-17T11:26:50.775170+09:00 · **제안(검수 대기) / 제품 미반영**

이 초안과 [구조화 초안](common-ui-rules-draft.json)만 작성합니다. 공통 가이드/색인·모노폴리/카피바라고 설계·소스·브라우저·공용 STATUS/보고는 변경하지 않습니다. 본체가 전한 현중 직접 피드백을 규칙 후보로 만들며, 모노폴리 예제 숫자를 사용자 최종 컨펌/정규화 완료로 해석하지 않습니다.

## 목적과 선택한 구조

현중은 화면마다 다른 하단선, X 뒤에 붙은 바탕, 같은 가족인데 달라진 상하단 위치/크기를 지적했습니다. 화면별 screenshot 측정으로 계속 예외를 쌓지 않고 **공통 규칙 → 프로젝트 프로필 → 같은 family 토큰 → 명시 variant → 화면 제작 → 실제 QA** 순서로 바꿉니다. 실패·원인·검증법과 잘된 방법을 두 담당이 공유하고, 확인된 경험을 다음 제작에서 지키는 규칙으로 만듭니다.

향후 정본은 **COMMON_UI_RULES.md + TOKENS.json 한 쌍**을 제안합니다. 전자는 프로젝트에 공통인 원칙/절차, 후자는 프로젝트별 수치·family·variant·출처/컨펌을 담습니다. 여러 가이드에 수치 사본을 복제하거나 screenshot별 숫자를 새 정본으로 삼지 않습니다. 이 이름/배치는 계획이며 실제 제품 파일/등록을 만들지 않았습니다. 기존 guide .21·VIDEO_UI_WORKFLOW·색인8항목·프로젝트 .4는 보존합니다.

## 적용 우선순위

1. 최신 사용자 직접 지시와 해당 작업 범위를 확인합니다.
2. COMMON_UI_RULES의 공통 계약을 따릅니다.
3. 해당 프로젝트의 logical basis·safe area를 정합니다.
4. 같은 family의 outerBox / iconBox / text / line / badge 토큰을 정합니다.
5. 위치/내용이 다른 경우 명시한 component variant를 선택합니다.
6. 화면 instance는 토큰을 참조해 제작합니다. 같은 family 치수/기준선을 화면에서 임의 override하지 않습니다.
7. 실제 native UI·저장·기기별 QA와 특정판 사용자 컨펌을 거칩니다.

Screenshot/영상은 **구성·모티프·관찰 문구**의 근거입니다. 같은 family의 공통 size/기준선을 덮어쓰는 근거는 아닙니다. 관찰값과 제작 토큰이 다르면 양쪽을 기록하고 현재 공통 규칙을 적용합니다. 새로운 차이가 필요하면 조용한 화면별 예외 대신 variant/token 변경안으로 제시합니다.

## 공통 데이터 계약

|층|필수 내용|미정 처리|
|---|---|---|
|프로젝트|id, logicalBasis, safeArea, token version/출처|모르는 값은 null·확인 대기. 0으로 확정하지 않음|
|family|outerBox, iconBox, text, line, badge|해당 역할이 없으면 명시 null. 필요한 값은 family에서 먼저 정함|
|variant|family 참조, 위치, 허용 차이/금지 override|같은 family 치수를 바꾸려면 새 명시 variant/token 판이 필요|
|화면 instance|profile/family/variant 참조, 실제 ID/부모, 필요한 content|좌표를 screenshot마다 독립 정본으로 복제하지 않음|
|경험|실패/성공, 원인 상태, 수정/방법, 검증/증거, 한계, 사용자 컨펌|가설/관찰/검증/컨펌 상태를 분리|

JSON의 tokenRef는 이번 데이터 초안 안의 경로입니다. 현재 엔진에 자동 토큰 적용/검사/동기화 기능을 구현했다는 뜻이 아닙니다. 향후 native 조립의 수동 참조 또는 별도 승인된 최소 지원 방식은 본체가 확정합니다.

## 모노폴리 전용 예제 프로필

기준 logical basis는 현재 모델과 본체 예제의 **551×984**입니다. 실제 CSS 폭이551이어야 한다는 뜻이 아닙니다. 기기에서는 해당 프로필의 비례/앵커/안전영역 계약으로 바꿔 표시합니다. r248 entry의 safeArea 필드는 없으므로 이 초안은 safe area를 임의 승인된0으로 채우지 않고 프로필 결정 대기로 둡니다.

|family/항목|본체가 지정한 초안 예제|적용 규칙|
|---|---|---|
|공통 footer outer|W551 × H60, bottom0|같은 family의 높이·바닥 기준 공유|
|footer line|6 logical px|이 초안은 line6을 굵기6으로 기록. 길이/색/내부 위치는 미정이며 화면별로 새로 재지 않음|
|공통 navigation hit|44×44|투명 입력 영역, 시각 그림 크기와 구분|
|glyph/icon box|28×28, 가운데|hit 안쪽 padding8; 44−2×8=28|
|native glyph text|font28 제안, 가로/세로 가운데|lineHeight/실제 폰트 ink 경계는 별도 확인 대기|
|default Main top outer|[9,12,536,94]|바/자식은 이 outer를 기준으로 한 local 좌표|
|Build top variant|Main과 같은 outline 크기/기준|본문/색·내용 차이를 variant로 두며 outline을 화면별 측정으로 바꾸지 않음|

모노폴리 navigationAction family 안에서 **Tycoon bottom floating Close / Racing top-right Close / Album top Back**은 별도 위치 variant입니다. 공통 hit44/glyph28/padding8은 유지하고 variant별 실제 outer inset은 한 번 정해 프로필에서 공유합니다. 이번 초안에서 아직 지정되지 않은 inset은 null입니다. ×는 native label 또는 투명 자원이며 **Close 버튼 hit 배경은 없음**입니다. Back의 정확한 glyph 모양/행동은 해당 variant의 원본/공통 규칙에 따라 따로 정합니다.

카피바라고에551×984·footer60·44/28이나 Main top rect를 강제하지 않습니다. 그 프로젝트는 영상/자체 logical basis·safe area·family profile을 만들고 **같은 규칙과 검증 순서만** 공유합니다. 기존 모노폴리 token은 자동 기본값이 아닙니다.

## X·아이콘·바탕·그림자 분리 규칙

- 불필요한 불투명 바탕이 붙은 icon/×를 쓰지 않습니다. native glyph가 적절하면 label로 두고, 그림이면 실제 투명 PNG/WebP를 씁니다.
- alpha 채널이 있다는 사실만으로 통과시키지 않습니다. **실제 production 파일**을 decode/view해 RGBA·바깥 투명 영역·실루엣·고립 잡티·외부 그림자를 확인합니다. 필요하면 alpha>16/>128 bbox를 비교하되 원본을 덮어쓰지 않습니다.
- 바탕이 보이면 raster에 구워졌는지, native appearance/skin/기본 tint인지 먼저 구분합니다. 배경 제거를 주장하기 전에 파일과 실제 DOM/화면을 각각 검사합니다.
- 의도한 panel/container BG는 별도 fill9/frame9 또는 적합한3slice입니다. 이것을 glyph 파일이나 hit 영역에 붙이지 않습니다. 명시된 container 배경과 “X 뒤 불필요 바탕 없음”을 혼동하지 않습니다.
- 외부 cast shadow는 엔진 효과로 분리합니다. 수량·가격·제목·닉네임·×는 native text 또는 독립 glyph이며 그림에 글자/버튼 hit 배경을 굽지 않습니다.
- 그림을 교체/참조 해제해도 stable ID·부모·유효 연결·원본 자원을 보존하고 Undo/재열기를 확인합니다. 모든 decoration을 parent 입력으로 일괄 바꾸지 않고 실제 pointer 경로/키보드·초점을 함께 봅니다.

## 실제 QA 기준

제작 전 같은 family 토큰표를 비교하고, 제작 후 논리 outer/icon/text/line/badge와 anchor/baseline을 비교합니다. 각 화면 screenshot의 픽셀 좌표가 아니라 동일 프로필/배율을 적용한 결과를 봅니다. 기기별 safe area가 다르면 같은 규칙의 변환인지 확인합니다.

|검사|필수 근거|
|---|---|
|기준/일관성|project/profile/token version·variant·실제 ID/부모·논리값·같은 family 비교|
|투명 자원|실제 PNG/WebP 크기·RGBA/alpha·source/master·production/staging/등록 SHA|
|입력|pointer click·Enter/Space/Escape·Tabtrap·Close/back 초점·배후 차단|
|배치|실제 popup명·안정 opacity/loading/failed·CSS viewport·overflow·상하단 기준선·hit/glyph 중심|
|목록/고정|scroll 변화와 header/self/footer 고정 여부|
|저장/복구|native 값 확정·파일 저장/revision·재열기·Undo/기존 ID/연결 보존|
|캡처|요청 크기/파일명과 실제 CSS/PIL 픽셀 구분; 중간 잘린/다른 대상본 제외|
|컨펌|현중이 확인한 특정 token/규칙 판·방법·증거·시각. 단순 계속 지시는 시각 컨펌이 아님|

이 파일 작업에서는 실제 UI 정규화·alpha 재검사·브라우저 QA를 하지 않았습니다. 아래 경험 기록의 기존 검증과 이번 사용자 지적의 미검증 부분을 구분합니다.

## 경험을 규칙으로 바꾸는 기록

|경험|원인 상태와 공유할 방법|이번 상태|
|---|---|---|
|하단선/상하단 치수 불일치|화면별 독립 측정이 토큰보다 앞선 가능성. 같은 family 토큰/변형 비교로 원인 확인 후 정규화|사용자 지적/원인·정규화 QA 대기|
|X 뒤 바탕|baked raster/native appearance 중 원인을 먼저 분리. 투명 glyph와 별도 intentional container 검증|사용자 지적/원인·실제 alpha/화면 재검수 대기|
|복제 Close edge와 가린 Close|연결도 복사되며 reparent는 형제 순서를 바꾸지 않음. 기존 edge 정리·native 앞순서·실제 클릭 확인|Racing 관찰/검증 방법, 컨펌된 새 token 아님|
|일반 숫자 fill 미확정|현재 AX setValue+Tab, rectPx는 명시 수치 적용. 선택/재표시/저장/Undo 확인|기존 helper/실제 방법 근거|
|1440 파일명/1920 다른 popup|실제 popup·viewport/zoom·안정 frame·PIL 확인. 중간본 보존/최종 제외|Racing 관찰 근거|
|키보드 성공/마우스 차단|Main Tycoon 정확2장식 mode만 parent 전달. pointer/초점·45pxscroll 고정·64→0→Undo64 별도 확인|Tycoon 관찰/검증 방법|

관련 경험은 모두 동일 ledger 형식으로 공유합니다. 원인이 가설이면 가설로, 성공한 방법에도 적용 조건/한계를 적습니다. 기존 상세 이력은 [가이드 .21](../../../src/tools/uxStudio/guide/PROGRESS.md)과 해당 증거를 연결하며 복사해 서로 다른 정본을 만들지 않습니다. 새 경험/재발/개선은 기존 규칙 ID를 참조해 제안하고, 본체가 중복·충돌을 정리합니다.

승격 순서는 **관찰/원인 상태 기록 → 재현/검증 근거 → 공통 규칙·프로젝트 영향 대조 → 실제 native QA/보존 → 독립 담당 간 공유 → 특정판 사용자 컨펌 → 본체의 COMMON_UI_RULES+TOKENS 단일 정본 병합**입니다. 규칙화 요청과 개별 숫자/시안의 최종 컨펌을 구분합니다.

## 1차·2차 공유와 병합

본체가 최신 사용자 승인으로 이 내용을2차에 전달합니다. 각 담당은 규칙·실패/성공 원인·검증법·증거만 공유하고 모노폴리/카피바라고 workspace·설계·탭·소스·자원 소유를 유지합니다. 이 초안은2차의 새 제작 배정이나 공용 파일 쓰기 권한이 아닙니다.

본체가 확정한 뒤 공용 정본/가이드/index에 직접 병합합니다. 최신 디스크를 읽고 version/sections 충돌을 검사하며 **VIDEO_UI_WORKFLOW와기존8항목을 보존**합니다. 이전 판/원본/가이드 .4를 보존하고 승인된 작업 창에서만 제품 쓰기를 합니다. 지금은 제품 COMMON_UI_RULES/TOKENS나 .22 index를 만들지 않습니다.

현재 범위는7018만이며7007 접근/반영/목록/카드/검수·추가질문/재시도/우회는 제외입니다. 기존ui PAUSED·90상한 명시 해제·새상한/시한/예약 없음·리셋/구매금지를 유지합니다. 실제 게임/폰트/최종동등/승인을 이 초안으로 완료 처리하지 않습니다.

## 읽은 근거와 초안 확인

- [루트 AGENTS](../../../AGENTS.md), [가이드 .21 색인](../../../src/tools/uxStudio/guide/index.json), [AI 규칙](../../../src/tools/uxStudio/guide/AI_GUIDE.md), [TOOL_SPEC](../../../src/tools/uxStudio/guide/TOOL_SPEC.md), [PROGRESS](../../../src/tools/uxStudio/guide/PROGRESS.md), [2차 VIDEO 안내](../../../src/tools/uxStudio/guide/VIDEO_UI_WORKFLOW.md).
- [Racing 실제 UI/캡처](../../../docs/evidence/20261117-racing09/browser-checks.json), [Racing 저장 보존](../../../docs/evidence/20261117-racing09/file-verification.json), [Tycoon pointer/scroll/Undo](../../../docs/evidence/20261117-tycoon10/browser-checks.json), [Tycoon 저장 보존](../../../docs/evidence/20261117-tycoon10/file-verification.json), [native UI helper](browser-ui-helpers.mjs).
- 본체 전달의 새 현중 피드백과 Monopoly-specific 초안 예제. 피드백 대상 화면/원인/새 alpha/정규화 실제 QA는 이번 파일 작성에서 추가 확인하지 않았습니다.

두 파일은 신규 초안이어서 덮어쓸 기존 대상은 없었습니다. JSON 파싱·tokenRef/variant family 참조·44−2×8=28 일관성·카피바라고 수치 미창작을 검사했습니다. 제품/프로젝트 가이드·VIDEO·색인의 작성 전후 SHA와 로컬 링크를 확인합니다. UI/소스/설계/브라우저/공용 기록 수정은0입니다.
