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

## 모노폴리 전용 후보 프로필 — 숫자는 JSON 한 곳에서 관리

현재 logical basis는551×984입니다. 실제 CSS 폭이551이어야 한다는 뜻은 아닙니다. r248 entry의 safeArea 필드는 없으므로 임의 승인된0을 채우지 않고 프로젝트 프로필 결정 대기로 둡니다. 모노폴리 숫자를 카피바라고 기본값으로 강제하지 않습니다.

바뀌는 수치의 단일 참조는 [JSON의 profiles.monopoly-go](common-ui-rules-draft.json)입니다. 아래 경로로 family/variant를 선택하며 본문마다 좌표 사본을 새 정본으로 만들지 않습니다. **Footer72는 검토 후보이고60은 확정되지 않았던 이전 후보입니다. Top96도 다른 담당의 감사 대기 후보이며 적용 높이는 아직 null입니다.**

|참조 경로|후보의 의미|
|---|---|
|families.systemFooter.outerBox|공통 footer 외곽·bottom0. 제목 유무와 관계없이 같은 높이/바닥 기준|
|families.systemFooter.line|가로선6/top0 후보. 길이/색은 미정으로 한 번 정한 뒤 공유|
|families.systemFooter.text.optionalTitle|기존 native city title을 수용하는 선택 항목, font20/localY8 후보|
|families.systemFooter.actionSlot|공통 hit을 footer bottom0에 가운데 배치, hit 배경 없음|
|families.navigationAction|hit44/glyph28, 가운데·안쪽padding8. native × 또는 실제 투명 icon|
|families.systemFooter.derivedExample|기준 프로필에서 계산한 설명값. 별도 override token이 아님|
|families.topShell.outerBox|Main top 위치/폭의 기존 제안과 높이 후보를 구분. 높이 확정 전 임의 적용 금지|
|families.topShell.barLocal|top outer를 원점으로 한 bar/자식 local 좌표. 독립 screen-space outline 금지|
|variants.top-build-body|본문/색·내용이 달라도 확정된 Main top outline 크기/기준은 공유|

Footer 후보에서 title이 있는 Build 계열과 title 없는 계열은 같은 line/X 중심을 공유합니다. JSON은 원 token에서 footerY912/선Y912, 선택 titleY920, hitY940, glyphY948, 중심Y962를 계산해 설명하며 이 숫자들을 따로 편집하지 않습니다. 후보 변경 시 파생값을 다시 계산합니다. title 문구나 새로운 게임 수치는 만들지 않습니다.

Tycoon bottom floating Close / Racing top-right Close / Album top Back은 위치 variant가 다릅니다. 같은 모노폴리 navigation family의 hit/glyph 크기는 유지하고 outer inset은 프로필에서 한 번 정합니다. 이번 초안의 미정 inset은null입니다. × 뒤 불필요 배경은 없으며 Back glyph의 정확한 모양/행동은 그 variant에서 확인합니다.

카피바라고는 자체 logical basis·safe area·family 토큰을 정하고 공통 원칙/검증 순서만 공유합니다. 모노폴리 후보 수치나 기존 스크린샷 좌표를 자동 상속하지 않습니다.

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
|compound Footer 안 Button 분해 문맥|임시 screen root→기존 split→새 생성 BG/emptyimage/frame만 정리→Footer 재부모/공통rect. ButtonID/Close edge 유지|root 상태 split 성공은 본체 실제 확인. 전체 복귀/입력·저장QA는 수행 범위별 기록|

Wins의 분해 방법은 기존 UI에서 성공한 문맥을 공유하는 것입니다. 소스를 추가하지 않으며, 원본 자원 파일이나 다른 부품을 지우지 않습니다. 임시 이동 전에 ButtonID/Close edge·부모·geometry를 기록하고, 새 분해 산출물만 식별해 정리한 뒤 Footer에 되돌려 공통 rect와 입력/Undo/저장을 확인합니다. 이번 초안 작성자는 이 조작을 재실행하지 않았습니다.

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

두 파일의 최초 생성 뒤 새 Footer/Top 후보·Wins 경험 갱신 전 원문은 지정 백업 폴더에 보존했습니다. JSON 파싱·tokenRef/variant family 참조·hit/glyph/padding 및 Footer 파생식·Top 미확정·카피바라고 수치 미창작을 검사했습니다. 제품/프로젝트 가이드·VIDEO·색인의 작성 전후 SHA와 로컬 링크를 확인합니다. UI/소스/설계/브라우저/공용 기록 수정은0입니다.
