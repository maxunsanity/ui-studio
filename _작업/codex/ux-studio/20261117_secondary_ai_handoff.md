# 2차 AI 인수 참고 — 7018 전용 / 1차 모노폴리 비간섭

codex(단이) · 2026-11-17 10:41 KST · 제안(검수 대기)

이 문서는 2차 질문에 답하기 위한 로컬 인수 자료입니다. **1차 모노폴리 제작의 새 배정이나 공동 편집 권한이 아닙니다.** 별도로 전달된 카피바라고 영상/독립 workspace 요청은 아래 분리 절차를 적용하며, 이 문서 작성자는 새 폴더·workspace·설계·브라우저를 만들거나 조작하지 않았습니다.

## 1. 최신 범위와 현재 위치

현중의 최신 선택은 **“7018 작업만 진행”**입니다. 7018 대표10화면/필요 최소 툴/가이드/검수 범위이며 **7007 접근·반영·목록·카드 실행·화면 검수는 제외**합니다. 7007 추가 권한질문·재시도·다른 브라우저/CDP/HTTP 우회는 하지 않습니다. 예전 가이드/보고의 “마무리 후7007”이나 미완료 표시는 과거 이력이며 현재 할 일로 되살리지 않습니다.

90% 상한은 명시 해제됐고 수동작업 승인/계정 허용 확인을 따릅니다. 기존 `ui` 자동화는 **PAUSED**입니다. 새 백분율 상한·마감·예약·자동 재개·리셋·구매를 만들지 않습니다. 공용 수신·STATUS·보고·실제7018 UI 조작은 대표 본체가 관리합니다.

|구분|1차 모노폴리 고정 식별/상태|
|---|---|
|도구 루트|`/Users/max/projest_max/ui-studio/`|
|공식 도구|`http://127.0.0.1:7018/ui-studio/`|
|workspace|`workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6`|
|설계 projectId|`ux-gjs-0d80d7fe`|
|폴더 저장|`samples/monopoly-go/ui-studio/`|
|설계 파일|`samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json` — **외부 직접 쓰기 금지**|
|현재 진행|본체 전달 기준 **Tycoon r217 이상 native 제작 중**. 이 문서가 최신 저장/미저장 상태를 고정한 검증 스냅샷은 아님|
|직전 검수 단위|Racing r200·9화면801부품/Racing35·18edges. r184 기존8화면/16edges 보존|
|가이드|공통 `.20`; `.21`은 작업폴더 초안만 있고 제품 반영 대기. 프로젝트 `.4` 보존|

다른 탭에서 보이는 r216/r217이나 파일의 마지막 저장판만으로 본체의 현재 미저장 상태를 판단하지 않습니다. 본체 브라우저를 재열기·새로고침·선택 변경·기기/zoom 변경·다른 팝업 실행하지 않습니다. `.21` 실제 가이드 쓰기도 본체의 저장/QA와 별도 쓰기 신호 전까지 대기합니다.

## 2. 원본 → 측정 → 자원 → 레시피

먼저 [루트 AGENTS](../../../AGENTS.md)의 최신 직접 범위를 읽고 [공통 가이드 색인](../../../src/tools/uxStudio/guide/index.json)·[AI_GUIDE](../../../src/tools/uxStudio/guide/AI_GUIDE.md)·[USER_GUIDE](../../../src/tools/uxStudio/guide/USER_GUIDE.md)·[TOOL_SPEC](../../../src/tools/uxStudio/guide/TOOL_SPEC.md)·[PROGRESS](../../../src/tools/uxStudio/guide/PROGRESS.md)를 확인합니다. 최신 직접 지시/마지막 보정과 옛 이력을 구분하며 오래된 숫자를 현재값으로 반복하지 않습니다.

1. [10화면 계획](../../../docs/plans/20261116-ten-screen-assembly.md)과 [원본 PNG 폴더](../../../docs/reference/monopoly-go/20261116-ten-screens/)에서 해당 원본을 직접 봅니다. 09는 `09_event-offer.png`, 10은 `10_tycoon.png`입니다. plan10 L135~137의 출발 안내는575이며5750은 오독 이력입니다. 가려진4위 수치/미확인 얼굴·종·상품 정책을 창작하지 않습니다.
2. [Racing quick sheet](racing09-assembly-quick-sheet.md)와 [Tycoon quick sheet](tycoon10-assembly-quick-sheet.md)는 관찰 좌표·제작 logical551×984 변환·추정/미관찰을 구분한 참고입니다. 측정표가 UI 조립이나 원본 동등 검수를 대신하지 않습니다.
3. 자원 manifest에서 원본/프롬프트/authoring PNG·SVG·production WebP/staging·실제 크기·crop/alpha·slice cap/edge/padding·SHA·재사용·미확인을 읽습니다. 새 파일 준비, workspace 등록, 설계 assetRef 참조, HTTP/SHA, 실제 화면은 각각 다른 단계입니다.
4. [Racing native recipe](racing09-native-recipe.mjs)와 [Tycoon native recipe](tycoon10-native-recipe.mjs)는 선언형 operation 데이터입니다. 실행 횟수만으로 실제 조립을 셈하지 않고 operation별 실제 ID·부모·이름·값·저장을 확인합니다. ROOT는 중앙 Content 그룹이며 실제 fullscreen 화면 root의 딤과 다릅니다.

Racing 근거: [scene](racing-event-assets.json), [기하8/reuse3](racing-ui-assets.json), [road band](racing-road-band-assets.json). 현재14고유 참조는 scene/UI/기존 rim·CTA·dice·cash/road의 집합입니다. manifest에 중복 등장하는 같은 scene을 새 자원으로 이중 합산하지 않습니다. 원본3대차 대비 새 scene2대차/작은 노란 차 누락, 원본 폰트/픽셀동등은 미확인입니다.

Tycoon 근거: [scene](tycoon-event-assets.json), [기하6/reuse5](tycoon-ui-assets.json), [avatar3](tycoon-avatar-assets.json), [puppy/bluepack](tycoon-pet-pack-assets.json). 준비된 그림의 원본/투명 tight crop/alpha/PNG↔WebP RGBA/SHA를 보존합니다. source screenshot crop으로 정식 UI를 조립하지 않습니다. avatar는 허구의 해석이고 pet 원종·인물 신원/관계·실제 보상/랭킹 정책은 확정하지 않습니다. 이 준비 수를 현재 Tycoon 등록/QA 완료 수로 쓰지 않습니다.

## 3. 본체가 실제 수행하는 native UI 순서

다음은 인수 이해용입니다. **2차가 지금 1차 탭에 실행하라는 지시가 아닙니다.** 본체는 승인된 기존7018 탭에서 Playwright의 실제 버튼/콤보박스 조작과 AX 입력을 사용하며, 설계/API setter나 DOM/application state 주입으로 조립을 우회하지 않습니다.

1. 대상 workspace/project/header revision·미저장 상태를 확인하고 변경 전 지정 백업을 보존합니다. 화면/레이어의 stable ID를 확인한 뒤 native 화면/유닛 생성 또는 허용된 template 복제로 seed를 만듭니다.
2. 이름·역할/kind·게임 입력·부모·좌표/앵커를 실제 속성 UI에서 지정합니다. 보이는 text/수치, 개별 art, native9/3slice fill/frame, 그림자와 입력 wrapper를 분리합니다. rename 때문에 stable ID/유효 연결을 재발급하지 않습니다.
3. 일반 수치/글자/색 입력은 현재 AX 상태에서 필드를 다시 찾고 **`AX setValue → Tab`**으로 확정합니다. 일반 속성의 `locator.fill + Tab`만으로 화면 값이 바뀌어도 model에 반영되지 않은 사례가 있으므로 재표시/저장값을 확인합니다. stale AX node ID를 재사용하지 않습니다.
4. `rectPx`는 별도 경로입니다. 부모 W/H로 %를 계산하고 `레이어 X/Y/W/H`를 fill한 다음 **`수치 적용` 버튼을 클릭**하므로 유효합니다. 이 명시적 적용이 일반 속성 fill의 대체 근거는 아닙니다.
5. 이미지 경로는 `/ui-studio/source/assets/...`의 허용 PNG/JPEG/WebP를 넣고 source SHA가 들어간 실제 img/source 크기를 기다립니다. 작은32px texture는 기본16+16 caps로 center0이 되므로 caps0로 등록 후 실제 caps/edges/padding0을 맞춥니다. 실제 artwork region은 원본 파일을 보존한 표시 영역이며 임의 픽셀 편집이 아닙니다.
6. 부모를 바꿔도 형제 순서는 자동으로 바뀌지 않습니다. Racing Close가 Panel에 가려진 사례는 native의 맨 앞으로(Frame/Txt_Close/Btn_Close) 순서를 정리하고 실제 클릭으로 검수했습니다.
7. 복제된 Footer/Close bundle에는 연결도 복사될 수 있습니다. 복사된 기존 Close edge를 확인/역할 이름 정리하고 중복 edge를 추가하지 않습니다. Main SALE/Racing·Main TYCOON CLASS/발자국 익스프레스는 원본 버전/진입조건 미확인 **시연 연결**로 남깁니다.
8. non-entry page→fullscreen modal 전환은 native 화면 종류 UI를 사용합니다. ID/art/rect를 보존하고 incoming navigate→open/outgoing back→close를 함께 바꾸며 직후 Undo가 복원합니다. Menu SHOP처럼 일반 binder가 page만 다루는 위치는 속성→연결·조건에서 action/target 먼저, `always` 마지막입니다. action 변경은 조건을 unknown으로 초기화합니다.
9. fullscreen root의 별도 black.7/.72 딤과 가운데551×984 Content를 분리합니다. 개별 modal의 engine dim=false 정책과 Menu 중첩 스택을 구분하고 전역 한겹딤/메뉴 자동제거를 주장하지 않습니다.

실제 helper 근거: [browser-ui-helpers](browser-ui-helpers.mjs) L7 `field/AX setValue+Tab`, L10 `rectPx/수치 적용`; [main05-ui-assembly](main05-ui-assembly.mjs) `typo/art/frame/shadow`; [Tycoon runner](tycoon-native-ui-runner.mjs) `createTycoonRunner/run/frame/art`. runner는 read-only seed ID를 받아 native UI를 호출하는 도구이며 **실행하면 UI를 수정**하므로 2차가 본체 탭에서 돌리지 않습니다.

## 4. 저장·증거·가이드 인수 기준

- `파일에 저장` → header 저장됨 revision/ID → 같은 workspace의 저장본 재읽기와 실제 참조 확인을 분리합니다. 브라우저 단계 저장/localStorage와 파일 저장, 전체 캔버스 사본 저장은 서로 다릅니다. 409 충돌은 현재 수정을 보존하고 조율하며 overwrite·expectedRevision 우회·외부 JSON 수정으로 해결하지 않습니다.
- 현재 본체의 미저장 Tycoon 작업 중 제품 source/가이드 쓰기나 재열기는 HMR/reload 위험이 있으므로 별도 source 쓰기 창 조율이 필요합니다. 2차는 source/제품가이드/index를 수정하지 않습니다.
- 실제 화면 증거는 진입 대상 popup name·안정된 opacity/연출·loading/failed·measured CSS viewport·overflow·키보드/초점/배후 차단·scroll/고정 영역을 기록하고 Pillow 파일 픽셀을 따로 확인합니다. 요청 크기나 파일명으로 실제1440/1920을 추정하지 않습니다.
- Racing [browser-checks](../../../docs/evidence/20261117-racing09/browser-checks.json)·[126 정적검사](../../../docs/evidence/20261117-racing09/file-verification.json)·[14 HTTP/SHA](../../../docs/evidence/20261117-racing09/asset-http-checks.json)를 읽습니다. `phone1440` 파일551×985는 첫 CSS1592×1675의 폰 캡처이며1440 증거가 아닙니다. `desktop1920-final`은 Wins 중간본입니다. 최종 Racing은 `desktop-final`(CSS/PIL1440×900), `mobile-final`(CSS430×844/PIL430×843), `desktop1920-target-confirmed`(CSS1920×1280/PIL1919×1280)입니다.
- 최신 소스 전체494/494는 Shop 단위 이전 실행입니다. Racing의 정적126/126이나 자원14개와 합산하거나 이번 재실행으로 적지 않습니다. 준비/모델/소스/HTTP/실화면/원본 동등/게임 동작을 나누며10장 최종동등0/10·W/P/U/S0/4와 게임·폰트·정책·최종 사용자 승인 미완료를 유지합니다.
- [현재 Tycoon 본체 보고](../../../docs/collaboration/reports/20261117_0953_tycoon10_native.md)와 [Racing 보고](../../../docs/collaboration/reports/20261117_0920_racing09_native.md)는 본체가 갱신합니다. 2차는 공용 STATUS·보고·current-review를 쓰지 않습니다. [.21 초안](guide21-racing-tycoon-draft.md)은 준비 문서이고 본체의 Tycoon 저장/QA 후 신호 전까지 제품 .21/index 쓰기 대기입니다.

## 5. 2차가 충돌 없이 할 수 있는 범위

현재 모노폴리에 대해서는 로컬 원본/관련 계획·측정표·manifest·recipe/helper·저장된 증거를 읽고 질문에 답하는 범위입니다. saved design을 읽게 되더라도 그것이 미저장 native UI 상태가 아님을 표시합니다. model/검사 재실행·새 캡처·전체 스캔·자원 수정/등록·브라우저 열기/선택/viewport 변경은 새 배정으로 추정하지 않습니다.

1차 설계 JSON/동일workspace 자원·공용기록/제품소스/가이드/기본포인터를 수정하지 않습니다. 원본/생성 master 삭제·덮어쓰기·새 AI 이미지 생성·패키지 추가·서버/빌드/재시작·프로세스 kill·예약/보호 파일/secret 접근도 이 인수 문서의 권한이 아닙니다. 대표 본체의 실제 편집과 같은 탭/창/공유 automation client를 동시에 조작하지 않습니다. 실제 기술 잠금이 설치됐다고 주장하지 않습니다.

## 6. 별도 카피바라고 요청 — 안전한 프로젝트 분리 진입법

본체로부터 **현중이 Desktop의 `카피바라고.mov` 분석 → 별도 `capybara-go` 프로젝트/샘플 workspace를 지시했다는 전달**을 받았습니다. 이 문서는 영상 파일 위치/내용을 직접 열거나 분석하지 않았고, 실제 별도 폴더/workspace가 생성됐다는 뜻도 아닙니다. 해당 명시 지시를 받은 2차가 별도 범위에서 진행하되 1차 모노폴리 설계/7018 탭에 간섭하지 않습니다.

1. 먼저 전달된 원본 영상의 실제 위치/내용·담당 범위와 보관할 별도 폴더를 확인합니다. `capybara-go`는 모노폴리 하위 설계 이름만 바꾸는 방식으로 만들지 않습니다. 현재 폴더 선택기는 새 루트 폴더 생성 기능이 없어 **이미 존재하는 별도 대상 폴더**가 필요합니다. 원본 `[folder-picker.swift](../../../tools/ux-studio/folder-picker.swift)` L36은 `canCreateDirectories=false`입니다. 별도 폴더 준비는 해당 사용자 지시/담당 범위에서 하고 이 인수 작성자가 만들지 않습니다.
2. UI 조작 시간은 본체와 충돌하지 않게 조율합니다. 영상 분석/로컬 읽기는 먼저 할 수 있지만, 같은 browser automation client의 탭 선택/viewport/zoom이 본체 캡처에 영향을 줄 수 있습니다. 본체의 현재7018 탭을 탐색용으로 바꾸지 말고 배정된 별도 탭/세션에서만 진행합니다. 별도 포트/새 서버는 만들지 않습니다.
3. 승인된7018 UI의 **`프로젝트 폴더 → 폴더 찾아 열기`**에서 별도 capybara-go 폴더를 선택합니다. 도구 루트나 `samples/monopoly-go`를 선택하지 않습니다. 새 폴더의 `ui-studio/`가 없으면 도구가 새 workspace ID/project.json과 designs/assets/exports 및 guide 등을 만듭니다. 기존 ui-studio가 있으면 원문을 다시 열며 자동 초기화하지 않습니다.
4. 처음 나타나는 기존 UI 변환/연결 여부에서 실제 독립 샘플 요청에 맞는 **`변환 안 함 · 독립 UI로 저장`**을 선택합니다. 폴더 선택만으로 원 게임 변환 허가가 생기지 않습니다. pending 상태는 저장이 차단되며 convert/requested는 자동변환 완료가 아닙니다.
5. 선택 후 주소의 **새 workspace**, 상단 실제 capybara-go 경로/이름을 확인합니다. 빈 workspace의 전체 캔버스는 아직 저장 설계가 없어 상세 편집으로 첫 설계를 만들라는 안내를 표시합니다. 같은 **새 workspace를 유지한 상세 편집**으로 들어가 첫 빈 설계 또는 **`파일 · 공유 → 새 설계`**를 사용하고 새 projectId로 파일 저장합니다. `새 설계`는 현재 workspace 안의 문서를 만드는 버튼이며 새 workspace를 만드는 버튼이 아닙니다.
6. 새 설계를 만들려고 **`현재 설계 사본 넣기`**를 누르지 않습니다. 그 버튼은 현재 모노폴리 문서와 필요한 자원을 대상 폴더에 사본으로 복사하는 별도 동작입니다. 모노폴리 ui-studio 전체를 복제해 project.json workspace ID를 가져오지도 않습니다. 같은 workspace ID가 서로 다른 존재 폴더에 있으면 도구가409로 거부합니다.
7. 저장한 뒤 새 workspace와 새 projectId를 둘 다 포함한 explicit URL을 유지해 상세/전체캔버스/preview를 엽니다. 자원 API도 해당 workspace 범위를 사용합니다. `ui-studio/` URL만으로 어떤 게임인지 판단하지 않습니다.

최근/기본 포인터 근거는 중요합니다. [project-manager.mjs](../../../src/tools/uxStudio/project-manager.mjs) L10 `scopedKey`는 `ux-studio.last-project:workspace:<id>`처럼 최근 설계 키를 workspace별로 나눕니다. [main.mjs](../../../src/tools/uxStudio/main.mjs) L2332는 explicit project → 해당 workspace 최근 설계를 우선하고 **workspace 없을 때만** studio defaultDocument를 참고합니다. [grapes-pilot.mjs](../../../src/tools/uxStudio/grapes-pilot.mjs) L34~35는 explicit project → scoped recent/catalog를 사용하고 사본 저장 L308이 해당 키를 갱신합니다. 다른 workspace의 최근 키가 자동으로 같아지는 구조는 아니지만, workspace 없는 기본 진입·공용 기본값/검수 포인터를 공유하면 엉뚱한 설계를 열 수 있으므로 **전역 설정/current-review/기본 포인터는 건드리지 않고 explicit 새 workspace/project를 사용**합니다.

UI 생성/보존 근거는 [project-manager.mjs](../../../src/tools/uxStudio/project-manager.mjs) L25/66/111의 선택/전환, [workspace-store.mjs](../../../src/tools/uxStudio/workspace-store.mjs) L180~227의 workspace 생성/안전 경로/기존 guide 무덮어쓰기/독립 결정 저장, [project-context.mjs](../../../src/tools/uxStudio/project-context.mjs)의 두 ID를 유지하는 designURL, [USER_GUIDE](../../../src/tools/uxStudio/guide/USER_GUIDE.md) L92~109, [EXISTING_GAME](../../../src/tools/uxStudio/guide/EXISTING_GAME.md) L35~53입니다. 저장/복귀409 검증을 우회하지 않습니다. 이 절은 소스/가이드로 확인한 진입법이며 새 capybara workspace 실제 생성·UI 검수 결과가 아닙니다.

## 작성 확인

이 인수파일1개만 신규 작성했습니다. 기존 파일 덮어쓰기가 없어 이전 인수파일 백업 대상은 없었습니다. 공통/프로젝트 가이드16파일과 .21 초안·관련 helper/recipe6파일의 SHA는 작성 전후 불변입니다. 링크는 로컬 대상 존재만 확인했고 브라우저/HTTP/영상 분석/새workspace 생성/제품·설계·공용기록 수정은0입니다. `.21` 초안에 대한 앞선 scope 추가 요청은 최신 “이 인수파일만 작성” 범위에 따라 여기 최신 범위로 전달했으며 초안 자체는 수정하지 않았습니다.
