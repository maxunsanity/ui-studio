# UI 스튜디오 제작 구조
가이드 판: 2026-11-16.13 · 제안(검수 대기)
독립 정본 보정: 2026-11-16


**최신 .13:** 문서 끝의 “승리 화면 조립 추가 기록”과 [제작 recipe](TOOL_SPEC.md), [검수 경계](PROGRESS.md)의 .13을 먼저 읽습니다. 아래 .12 이하의 “최신/진행 중”은 해당 판의 이력입니다. 기존 프로젝트 guide .4는 보존합니다.

## 최신 안내 · .12 · r43

공통 정본은2026-11-16.12입니다. 실제 저장본 ux-gjs-0d80d7fe r43은 기존메인63+신규짓기78부품·2페이지·navigate/Back2개입니다. [진척 맨 위의 .12](PROGRESS.md)와 [툴 기획서 끝의 짓기 제작 recipe](TOOL_SPEC.md)를 우선합니다. 아래 .11/r24·미등록·수정 중 문구는 당시 이력이며 최신 완료/미완료를 대신하지 않습니다. W/P/U/S0/4·10장 최종동등검수0/10·사용자 승인 없음, 기존 프로젝트guide.4는 보존합니다.

## 최신 상태 바로보기 · .11 · r24

최신 저장판은 ux-gjs-0d80d7fe **r24·1페이지63부품·0연결**입니다. 세 배지 이미지 자식의 “Img_Notification_BG 복사”를 “Img_Notification_BG”로 정리해 저장했습니다. 아래 r21/수정 중/재시험 예정 문구는 당시 이력이며, 최신 사실과 지원 경계는 [PROGRESS 맨 위의 r24 마감 보정](PROGRESS.md)을 우선합니다. 공통판 .11·기존 본문·프로젝트 .4 사본은 유지합니다.

상세 rootSize/renderPreview는 공통 device 변환의 logical viewport와 deviceScale을 사용하고 dataset.zoom(편집 확대)과 dataset.scale(기기×확대)을 분리했습니다. main.mjs만 제품 수정한 [보완 기록](../../../../_작업/codex/ux-studio/detail-device-scale-report.md)을 따릅니다. standalone preview의 entry uniform fit을 상세/전체 캔버스의 profile 기반 높이 reflow와 혼동하지 않습니다.

## 최신 실제 구조와 보기 변환 · .11

[현재 표준](TOOL_SPEC.md)과 [진척](PROGRESS.md)의 .11을 우선하고 .10 이하 본문/AI for UI 추가절은 보존합니다. 본체 actual r21은1페이지63부품·0연결로, 제작 구조 검증과 실제 게임 연결을 구분합니다.

|책임|현재 구조/소스|실제 검수 경계|
|---|---|---|
|공통 메뉴|Btn_BottomNav_<역할> → Img_BottomNav_<역할>_Icon/Txt_BottomNav_<역할>_Label·Badge. 동일80×92/64²/80×22/28²와 안정ID 사용.|네 메뉴 실제 조립·별도 가이드 heading/W80H92 확인. 원본 폰트 미확인.|
|복합 알림|badge 부모 notification1개→[layout-view](../layout-view.mjs)가 직접 label 자식에 포맷값 전달, 자체 글자 비움. Img_Notification_BG/Txt_Notification_Count 별도.|Wins0숨김/Build5/Albumdot1/Friends4 actual. 자식 config 복제 없이 부모 hidden 상속, legacy panel 동작 보존.|
|버튼 효과|[button-state](../button-state.mjs)의 tint/image·self 또는 실제 이미지 후손 targetGraphic. transient hover/pressed는 view, 명시 선택은 runtime.|전용124 지원 시험. 네 메뉴 이미지 자식 tint 저장/normal→클릭 후 hover·나머지normal 실제 확인. image-mode 샘플/GO 미검수.|
|기기 비례|[canvas-device-preview](../canvas-device-preview.mjs): authored551×984 유지, scale=deviceW/551, 배치 논리H=deviceH/scale에서 %/앵커 재계산 후 전체 scale.|390×844→scale390/551·논리H1192.42, board389.997×843.987 실제 확인. custom414×896·방향 commit은 저장판r17 상태를 유지.|
|상하단 고정|HUD_Bottom551×280에 기존14root를 묶고 하단 anchor, HUDTop536×94@(9,12)는 상단 anchor.|네 메뉴/아이콘/텍스트/배지가390/551로 비례. 상세 편집390 root551 고정/넘침은 다른 경로의 발견 문제로 수정 중.|
|진입|bare7018→[current-review](../../../../tools/ux-studio/current-review.json)의0d80d7fe. 명시 workspace/project는 보존.|actual browser r21 진입 성공. 7007/LSB native 바이너리 검수 아님.|

버튼 tint/image 효과는 기존 shadow 필터와 합성하고 원본 PNG·아트 region·입력 bbox를 바꾸지 않습니다. 이미지 자식을 대상으로 정한 메뉴의 글자/배지까지 임의로 같은 색으로 칠하지 않습니다. 상태 미리보기/기기 보기/편집 zoom과 문서의 buttonState·논리 크기·저장 revision을 별개로 유지합니다.

가이드의 밝은 입력 바탕에 전역 어두운 테마 label/input 색이 상속되는 사례를 확인했습니다. 본체는 .ux-design-guide 범위 label #46566d, input/select/textarea #253247·white 배경으로 최소 CSS를 보완했고 후속 실화면/캡처는 예정입니다. 특정 필드의 가독성 원인을 source 값/disabled 처리/배경·상속 색으로 나눠 조사하고 전체 테마를 임의 교체하지 않습니다. 측정하지 않은 대비율 통과를 주장하지 않습니다.

[AI for UI](../../../../docs/plans/20261116-ai-for-ui-adoption.md)는 필요한 제작/검토 방법의 선택 편입이며 새 엔진/패키지/자동 설치가 아닙니다. 411 통합 시험은 상세390 보완 이전 이번 본체 실행, 이후 재실행 예정입니다. 10화면 명세/새 도시 그림 준비와 실제 조립/등록을 나누고 W/P/U/S0/4·승인 없음은 유지합니다.

## 로비 표준의 책임과 데이터 흐름 · .10

현재 제작 계약은 [TOOL_SPEC의 로비 제작 표준](TOOL_SPEC.md#로비-제작-표준), 현재 확인 범위는 [PROGRESS](PROGRESS.md)를 따릅니다. 아래 .9 이하 본문은 당시 구조/진척 이력입니다. 원본 관찰값·설계 값·편집기 보기 설정·실행값은 서로 다른 계층입니다.

|계층/책임|정본과 흐름|지원·검수 경계|
|---|---|---|
|원본·측정|원 PNG/hash/크기 → 관찰 px·화면 % → 부모 논리 px/%·설계 rect. alpha 실루엣·아트 box·입력 wrapper를 각각 유지합니다.|551×984 측정 25/67개는 관찰 자료이며 새 main 709×1269와 구분합니다. 원본 폰트 설정 미확인.|
|설계·선택·이름|stable screen/element id·parentId·기존 연결 → 편집 명령·검증 → Undo/dirty·저장 → 같은 설계를 재표시합니다. name은 `Txt_<영역>_<역할>_<용도>`이며 동적 binding key·화면 문구와 분리합니다.|name 변경이 ID/부모 재생성이나 연결 초기화로 이어지지 않아야 합니다. 네 메뉴 이름 적용/저장 검수는 진행 중.|
|장면과 UI 계층|Page_Board의 full-screen Slot_3D → 표시 전용 Img_BoardBackdrop, 별도 HUD/GO/BottomNav → BG/Frame/Img/Txt/Input/Badge. 형제 순서는 실제 DOM paint 순서와 일치시킵니다.|현재 배경은 새 2D 공원 시안이며 Slot_3D는 엔진 연결 자리입니다. 게임 3D 실행 완료가 아닙니다.|
|이미지·skin|PNG 원본 → 비파괴 source region/assetRef → 별도 custom BG와 Frame → 기존 [skins](../skins.mjs)의 textures와 3/9slice 렌더링. slice는 source, edge는 논리 화면, padding은 내용입니다.|상단128×64/slice27/edge27/padding0/min54. custom 이미지의 투명 배경·모서리를 tone 판이 덮지 않게 합니다. body9와 fixed crown은 다른 역할.|
|레이아웃·스타일|부모 rect/anchor/contain → 실제 art/hit rect. has-appearance와 skin root padding0으로 얇은 선의 원치 않는 최소 크기를 방지합니다.|최소 edge 합 이하의 코너 보존은 보장하지 않습니다. 다른 종횡비의 contain 여백과 cover 잘림을 오류로 섞지 않습니다.|
|그림자 효과|`element.effects.shadow` → DOM alpha drop-shadow. Normal/Disabled/Pressed filter와 합성하고 원 PNG·region·outline/hit rect는 보존합니다.|기본 꺼짐·실제 조작 때 저장. Normal/Disabled 실제 확인, Pressed 실화면 미검수. 전체 엔진 호환을 뜻하지 않습니다.|
|공통 알림|optional `element.notification` → [notification.mjs](../notification.mjs) 검증·표시 → consumer flat runtime key. count/dot·0숨김·99+를 공통 처리합니다.|62 전용 시험 범위. 현재 badge panel의 span 표시이며 독립 자식 숫자 폼은 아직 미구현. 실제 4메뉴 조립은 진행 중.|
|디자인 가이드|[design-guide-view](../design-guide-view.mjs)의 외곽 W/H·선별 고유 색 → 같은 실제 요소의 편집 명령. line preferences는 보기 설정으로 따로 보존합니다.|W/H 14 전용 시험 통과, 최신 실화면 진행 중. native 입력은 Tab/blur 후 저장값까지 확인합니다.|
|현재 검수본 진입|[mount](../../../../tools/ux-studio/mount.mjs) → [current-review 메타](../../../../tools/ux-studio/current-review.json) → bare entry의 현재 검수본. 명시 workspace/project URL은 그대로 유지합니다.|고정 v 모듈 entry 제거·9회귀/HTTP302 확인. 7007 Browser 차단·LSB 앱 바이너리/native cache/중복 서버 추정은 별개.|

알림 예시 `consumer.updateState({'nav.buildCount':5})`는 점을 포함하는 flat key 한 개입니다. 이름 “Txt_BottomNav_Build_Label”이나 표시 문구 “짓기”를 바꿔도 이 키를 자동 변경하지 않습니다. count/dot·hideZero·maxDisplay는 UI 표시 계약이며 시연 수치를 게임 정책으로 승격하지 않습니다. 일반 hover 색, skin 상태 texture, 공통 Selectable/TargetGraphic·아이콘 상태 전환도 각각의 구현과 샘플 적용을 따로 확인합니다.

상세 편집의 기존 logicalSize/앵커와 새 전체 캔버스의 모바일 기기 선택·직접 W/H·기준 설계/preview 분리·비례 반응형 UX는 구분합니다. 새 UX와 10장 전체 화면 연결은 후속 계획입니다. 385/62/14/9 시험 수를 합산하거나 W/P/U/S 완성률로 읽지 않으며 현재 W/P/U/S 0/4·UI 승인 없음입니다. 특정 버전 명시 컨펌 뒤 방법·원본 hash·revision·실제 캡처를 함께 고정합니다.

## 디자인 가이드와 실제 편집 상태 연결 원리 · .9

직접 편집 구현과 실제 브라우저 검수는 대표 본체에서 진행 중입니다. 이 절은 최신 요구와 상태 연결 원리의 보존이며 특정 API의 구현 완료·화면 통과·UI 승인을 뜻하지 않습니다. 문서 열람용 openManual은 읽기 전용이고 부품 디자인 가이드는 같은 실제 설계를 편집하는 뷰입니다.

디자인 가이드의 선택은 workspace·설계 문서·화면·요소 stable ID를 이어 사용하고 parentId를 유지합니다. 보이는 경계 선/수치와 실제 요소는 같은 ID로 대응합니다. 위치·크기·이미지 변경을 기존 검증과 문서 편집 명령에 보내 undo/redo·dirty·저장으로 연결하며, 실제 설계의 변경 결과를 가이드와 캔버스가 다시 표시해야 합니다. 별도 DOM/CSS 사본이나 읽기용 스냅샷만 수정하는 구조를 실제 편집의 정본으로 삼지 않습니다. 부모 %·논리 px와 확대·패널 폭·스크롤 같은 보기 변환은 구분합니다.

자원 파일과 요소의 표시 참조는 다릅니다. 이미지 넣기/빼기는 참조 연결/해제이며 빼기가 원파일이나 부품을 삭제하지 않습니다. 원파일과 ID·부모·다른 속성, 다른 요소의 공유 참조를 보존하고 되돌리기·저장 재열기를 확인합니다. 자원 검증과 저장 충돌 경계도 유지합니다.

선택 부품을 중심으로 실제 그림을 보고 치수를 외곽에 배치합니다. 모든 후손의 선/숫자를 기본으로 덮지 않고 하위 선 표시를 켜고 끕니다. 계층 행 선택과 펼침/접기는 독립 입력이며 가이드·속성·캔버스는 같은 ID를 선택해야 합니다. 레이어·중앙 캔버스·속성 세 영역의 두 경계 폭 조절은 도구 설정으로 보존하며 설계 좌표·revision·dirty를 바꾸지 않습니다.

관찰 자료 `_작업/codex/ux-studio/20261116-board-measurements/independent-measurements.json`과 `notes.md`는 551×984px 원본의 상위 25개/전체 67개 측정 박스입니다. 원본 px·중심·W/H 비율·가시 잉크 경계는 관찰값이며 실제 설정이 아닙니다. 잉크/실색 약 ±1px, 외곽/가림 약 ±2px와 숨은 경계 미확인을 보존합니다. 원본 폰트명·크기·굵기·줄 높이는 미확인입니다.

.8의 전체 화면 Slot_3D/별도 2D overlay·Img_SNSAvatar와 명시 승인 시점 기록 원칙, 프로젝트 guide .4 사본은 유지합니다. 현재 구현/실검수의 결과는 본체 기록을 따릅니다.

## 어떻게 만들었나요
독립 프로젝트 /Users/max/projest_max/ui-studio/에서 관리하는 ES 모듈 웹 도구입니다. 편집용 상태와 동작 시험용 상태를 분리하고 설계 JSON을 공통 형식으로 사용합니다. 소스 정본은 이 루트의 src/tools/uxStudio/이며 실행 의존성·서버·기본 저장·안내·보고도 이 루트에서 독립 관리합니다.

정식 진입은 http://127.0.0.1:7018/ui-studio/입니다. scripts/start.mjs가 이 루트 node_modules의 Vite 5.4.21과 정확한 의존성 묶음으로 자체 서버를 실행합니다. tools/ux-studio/mount.mjs와 save-plugin.mjs도 이 루트 파일입니다. mount는 /ui-studio/·preview.html·canvas.html과 /ui-studio/source/를 연결하고 save-plugin은 같은 루트의 저장·폴더 API를 제공합니다. 다른 프로젝트의 Vite 설정·실행 프로세스·설치 fallback은 운영 조건에 포함하지 않습니다. 소스·실행 프로세스·게임별 workspace는 각각 별도 경계입니다.

이미 검증한 Vite 5.4.21과 정확한 의존성 11패키지(18,560,529bytes)를 자기 node_modules로 복사했습니다. 원본·사본 검증 해시·라이선스·lock integrity는 _작업/codex/ux-studio/standalone-dependencies.json에 기록했고 package-lock.json에는 다른 플랫폼 선택 패키지를 포함한 58 의존성을 보존합니다. 새 패키지·버전 선정은 없었으며 외부 설치 fallback을 제거했습니다.

자체 서버의 CWD·Vite resolve·실행 의존성이 이 루트인 것을 확인했습니다. 독립 전환 검수 당시 서버 PID는 18579였으나 재기동마다 달라지는 관찰값이며 고정 설정이 아닙니다. /의 302 이동과 편집기·main JS HTTP 200, 독립 전환 당시 자동 시험 220/220을 확인했습니다. 실제 가이드·네이티브 폴더 선택·independent 결정·설계 사본·저장·재열기·충돌·격리·미리보기·모달 포커스·캔버스 W 단계 왕복을 검수했습니다. 정확한 범위는 PROGRESS.md와 증거 JSON을 따릅니다.

이 구조 설명은 지시 없는 서버 시작·재시작·빌드 허가가 아닙니다. samples/monopoly-go/는 검증용 샘플입니다. 게임 엔진이나 3D 자원을 편집기에 불러오는 구조가 아닙니다. 기본 /ui-studio/와 canvas.html은 GrapesJS 전체 캔버스이고 ?editor=detail은 main.mjs 상세 편집입니다. 두 편집기는 같은 설계를 읽지만 캔버스 사본 저장·브라우저 단계 저장과 상세 편집 파일 저장·서버 기준판의 의미는 구분합니다.

기존 편집 흐름:
  main.mjs → model/commands/layers/parts/skins → 편집 화면
  저장 요청 → save-plugin.mjs → 설계 JSON·백업·기준판
  저장 설계 → preview.mjs / consumer.mjs → 소비 화면

폴더 기능의 흐름:
  명시 폴더 선택 → 서버의 네이티브 선택기 → workspace 식별
  변환 여부 선택 → project.json 기록 → 해당 ui-studio 보관영역
  workspace + 문서 ID → 목록·저장·기준판·소비·재열기
  가이드 버튼 → manual.mjs → 공통 또는 프로젝트 문서 읽기

이 흐름은 저장·동의 경계를 설명합니다. 기존 게임 UI가 자동으로 변환되거나 실제 게임에 연결되는 단계는 포함하지 않습니다.

## 소스별 책임
- main.mjs: 편집 상태, 선택·명령·화면/패널, 저장·재열기와 UI 진입 동작.
- model.mjs: 설계 검증, 파일 가져오기 경계, 런타임 상태와 조건·행동 실행. 게임 저장의 writer가 아닙니다.
- layers.mjs / commands.mjs: 계층 조회, 검색, 선택 집합과 이동·복사·삭제·그룹 명령.
- editor.mjs: 편집 화면 조작 연결.
- parts.mjs: 복합 구성과 시각 역할, 입력 소유자, 분해, 래스터 가져오기·텍스트 검증.
- skins.mjs: 게임 UI 종류, 프레임 자원·상태·슬라이스 계약과 조립.
- units.mjs / bindings.mjs: 추가 유닛·표현·연출과 게임 기능/콘텐츠 슬롯 정의.
- history.mjs: undo/redo 스냅샷과 기록 예산. JS heap 전체 상한은 아닙니다.
- graph-view.mjs: 화면 관계도의 지연 로딩과 표시 수명 관리.
- workspace.mjs / layout-view.mjs / snap.mjs: 편집 패널의 도킹·분리·배치. 이 기존 workspace 모듈의 이름은 게임 폴더 저장공간 개념과 다릅니다.
- menu-state.mjs / menu-layout.mjs: 메뉴 열림, 표시와 자식 배열 계약.
- rect-transform.mjs / responsive-layout.mjs / responsive-inspector.mjs: schemaVersion 4의 logicalSize·직속 safe area·2D 고정/늘림 앵커·고정 itemSize 자동 배치·overflow의 검증, 공통 좌표/CSS 계산과 상세 속성 편집. 구형 1/2/3은 자동 전환하지 않으며 layout.direction을 새 자동 배치로 활성화하지 않습니다.
- controls.mjs / control-inspector.mjs: 컨트롤 7종의 기본값·검증·runtime 값·네이티브 입력과 상세 속성 편집. 컨트롤을 포함한 조상까지 button 중첩을 피합니다.
- asset-reference.mjs / asset-store.mjs / asset-client.mjs: workspace별 내용 해시 PNG/JPEG/WebP 참조·파일 검사·원자적 보존과 업로드. 기존 data URI를 보존하고 사본의 참조 파일을 함께 유지합니다.
- overlay-runtime.mjs: 차단 정책·Escape·초점 이동/복귀·화면 ID별 타이머·toast queue/dedupe와 호스트 닫기 veto. 문서 교체 시 이전 타이머를 해제합니다.
- handoff.mjs: 출처·화면/부품·배치·상태·입력·조건·payload·모듈·클릭 스토리보드를 Markdown/JSON으로 출력하는 순수 데이터 경로. 게임 파일 쓰기나 엔진 어댑터 생성은 하지 않습니다.
- project-context.mjs: 프로젝트 종류·이름·경로와 설계/revision/dirty 표시, workspace·project·screen·element URL 전달과 미저장 이동 선택.
- save-plugin.mjs: 서버 저장 API, 경로 검사, 원자적 저장·revision 충돌, 백업·기준판과 폴더 보관영역 연결.
- workspace-store.mjs: 네이티브 폴더 선택, workspace 등록·조회, 변환 선택 기록과 프로젝트 가이드·저장영역 검사.
- tools/ux-studio/mount.mjs: 자체 서버에서 /ui-studio/와 source/를 이 루트 정본 파일로 연결하는 서버 연결부. 게임 변환기는 아닙니다.
- scripts/start.mjs: 이 루트 node_modules로 자체 Vite 서버를 실행하는 진입점. 기본 저장 루트도 이 프로젝트 아래입니다.
- preview.mjs / consumer.mjs: 저장 설계 조회와 가벼운 소비 경로. 실제 게임 호스트 어댑터는 별도입니다.
- manual.mjs / guide/: 설명서 창과 공통 가이드 정본. 편집 상태를 읽거나 수정할 필요가 없는 읽기 경로입니다.
- grapes-pilot.mjs / grapes-bridge.mjs / grapes-drag.mjs: 기본 전체 캔버스, 원설계와의 변환·선택·드래그 연결. 앵커·안전 영역·자동 배치 부품의 수동 % 이동은 제한하고 상세 편집으로 연결합니다. 서버 사본 저장과 브라우저 단계 저장을 구분합니다.

위 목록은 책임 설명입니다. 새 폴더 연결의 최종 파일 분할과 동작 검증은 최신 소스와 이번 작업 보고를 확인하세요. 과거 코드지도가 이 구조를 모두 포함한다고 추정하지 않습니다.

## 데이터와 표시·입력의 분리
문서에는 projectId/revision/screens/transitions/fixtures가 있습니다. 화면의 elements에는 ID, 부모, 위치, 종류, 역할과 필요 시 component/interaction/image/skin/binding이 들어갑니다. 모든 요소의 ID는 문서 안에서 고유해야 하며 부모 순환은 금지됩니다.

구성 전체가 입력을 소유하고 자식은 부모로 전달하거나 표시만 할 수 있습니다. 편집 선택은 구성 전체를 고르거나 내부 부품을 고르는 동작입니다. 동작 시험은 inputOwner를 따라 실행 대상을 찾습니다. 그림이 겹친다는 사실과 입력 소유자가 같다는 사실을 혼동하지 않습니다.

프레임은 CSS border-image 기반 표현을 사용합니다. 슬라이스·화면 고정 폭·내용 여백은 서로 다른 값입니다. 이미지의 원본 영역과 화면상의 입력 영역도 별개입니다. 새로운 그림을 넣었다고 행동 정의가 새로 생기는 것은 아닙니다.

v4의 각 화면은 logicalSize와 선택 safeArea를 가집니다. useSafeArea=true는 화면 직속 부품만 허용합니다. 자동 배치는 자식 순서·고정 itemSize·gap·padding·columns를 사용하며 자식 앵커/inset/safe area와 혼합하지 않습니다. clip/scroll은 같은 DOM에서 표시와 입력을 자릅니다. 전체 Unity/Figma 레이아웃 호환이나 회전·3D 계산은 제공하지 않습니다.

## 저장 경계
검증 → expectedRevision 비교 → 백업 → 원자적 기록 → 재읽기의 경계를 유지합니다. 미저장 편집본과 마지막 저장본은 다를 수 있습니다. 기준판 불러오기는 편집본 변경이며 자동 저장이 아닙니다.

폴더는 workspace ID, 문서는 기존 projectId, 저장은 revision으로 구분합니다. API 호출과 소비 URL에서 workspace를 이어 전달해야 합니다. 서버 전역 active 상태나 전역 최근 문서로 다른 폴더의 데이터를 섞지 않습니다. localStorage의 편집 패널 설정과 설계 파일도 다른 저장입니다.

GrapesJS 단계는 브라우저 localStorage의 문서ID·원 revision·W/P/U별 시험 저장입니다. 일반 서버 기준판과 서로 대체되지 않습니다. 사본 저장은 새 서버 문서를 만드는 경로입니다.

이미지는 선택 workspace assets/의 내용 해시 파일을 assetRef로 읽습니다. MIME·파일 내용·크기·해시·참조 존재와 경로 안전 검사를 거칩니다. 개별 300,000bytes·가로/세로 4096px와 전체 설계 2,000,000bytes 제한을 유지합니다. 설계 JSON이나 연결 명세만 출력하면 참조 파일은 동봉되지 않으며 설계·assets를 포함한 선택 ui-studio를 함께 전달합니다. 공통 내장 자원은 같은 도구 설치본이 필요합니다.

## 제작 원본·표시 이름·등록 자원의 경계
정식 U 자원은 비슷한 콘셉트로 새로 그립니다. screenshot crop은 관찰·임시 W의 참고이며 제작 등록본과 구분합니다. 필요한 바탕은 불투명하고 외곽은 알파인 그림을 사용하며 글자·수치·입력은 별도 설계 요소로 유지합니다. 이 지침은 그림 제작 방식이며 새 렌더러나 스키마를 추가하지 않습니다.

화면·요소의 name은 영문 ASCII 역할/의미 표시 이름이고 screen.id·element.id는 stable ID입니다. 계층은 parentId가 정하며 이름 문자열에서 복원하지 않습니다. Page_Friends → HUD_Top → BG_TopBar·Frame_TopBar·Currency_Cash·Shield_Group·Btn_Menu·Img_SNSAvatar처럼 구성하고, 자식은 Img_Cash·Txt_Amount·Img_Menu·Badge_Notification처럼 부모 전체 이름을 반복하지 않습니다. Img_SNSAvatar는 왼쪽 SNS 사진 데이터 슬롯이며 새 주사위 그림이 아닙니다. 이름 변경은 ID·계층·기존 연결 변경이 아닙니다. 역할 접두어와 전체 예시는 TOOL_SPEC.md가 정리합니다.

선택 프로젝트 ui-studio/assets/authoring/<component>/v001/는 제작 원본, production/<component>/는 등록용 가공본, assets 루트 sha256 파일은 현행 도구 등록 풀입니다. humanname은 `<scope>_<component>_<role>_<state>_vNNN.ext`이고 resource-manifest.json이 원본/출처·제작 방식·알파·크기·판·가공 경로·등록 hash·적용 ID·미확인을 연결합니다. authoring/production 폴더를 자동으로 스캔·등록하는 기능이나 manifest 로더는 이 문서 변경에 포함되지 않습니다. 실제 등록은 현행 API·해시·workspace·이미지 제한을 따릅니다. 이름을 바꾸려고 등록 해시 파일을 손으로 이름 바꾸거나 assetRef를 인간용 파일명으로 대체하지 않습니다.

3D 연결 자리는 Page_Board → Slot_3D의 화면 기준 x/y/w/h=0/0/100/100% 전체 화면 최하층입니다. 내용은 빈 “3D 영역” 표시만 두며 그림/캡처/가짜 보드·입력·엔진 연결은 없습니다. 상단 HUD·우측 이벤트·하단 GO 버튼·재화 게이지·BottomNav는 Page_Board의 별도 2D 상위 형제로 overlay합니다. 중앙 13~97% 박스나 HUD 아래 남는 공간을 3D 전체 영역으로 삼지 않습니다. 2D overlay 계층을 Slot_3D 자식으로 묶지 않습니다.

## 측정 자료와 승인 시점 기록 · .8
새 첨부 551×984px는 대표 본체의 실측 기준입니다. 원본 hash·crop 여부, 원본 px·화면 W/H%·부모% 변환을 함께 기록하며 x/w의 분모 W와 y/h의 분모 H를 구분합니다. 정확한 변환식은 TOOL_SPEC.md를 따릅니다. 이미지 파일 rect와 그림 가시 bbox·중심·아이콘 높이/간격/세로 정렬, 글자 가시 bbox·기준선·위치를 나눠 기록합니다. 폰트 추정과 확인된 원본 설정도 나누며 font-family/size/weight/line-height 원본은 못 읽었으면 미확인입니다. 캔버스 확대율·논리 px·CSS viewport는 원본 픽셀이 아닙니다.

현중이 특정 버전을 명시적으로 컨펌한 후에만 해당 버전 승인 스냅샷 문서와 기존 가이드의 승인 기록/제작 방법·설정을 연결합니다. 원문·KST 시각·설계 ID/revision·원본 hash·비율 측정값·계층·리소스 판·제작 방법·설정·시험/실화면 근거·미확인·다음을 보존하고 이전 승인/시안은 덮어쓰지 않습니다. 일반 “계속”·규칙 저장은 UI 승인이 아니며 현재는 제안(검수 대기)입니다. 이번 문서 작업에서 승인 스냅샷을 만들지 않았습니다.

이번 기본 캔버스 zoom +/−/Ctrl+wheel, 부모·자식 각각 선택/편집과 개별 유닛 디자인 가이드 뷰는 대표 본체·별도 담당 구현 중이며 실검수 대기입니다. redline A~J의 비율·간격·위치·글자 정보 표시와 세부 편집 진입도 이 대기 범위입니다. 관련 구현 모듈 이름이 정해졌어도 소스·실화면 검증 전 완료로 표시하지 않습니다.

## 설명서 표시 경계
openManual({workspaceId})는 문서를 표시하는 HTML dialog를 엽니다. 공통 index/문서는 독립 정본에 연결되는 /ui-studio/source/guide/ URL에서 읽고, 프로젝트 문서는 workspace-guide API로 선택된 ui-studio/guide에서 읽습니다. 현재 공통 정본은 index의 .10이고 실제 생성·읽기를 확인한 프로젝트 사본은 .4입니다. 상태 문구는 해당 index.version에서 읽어 두 판을 구분합니다. 프로젝트 사본은 독자적으로 덮어쓰지 않습니다.

문서는 textContent와 줄바꿈 보존으로 표시합니다. Markdown 안 HTML, 링크 문자열이나 코드를 실행하지 않습니다. 비동기 읽기의 늦은 응답은 현재 선택 문서를 덮어쓰지 않아야 합니다. 오류가 나도 닫기·안내 선택·재시도가 남아야 합니다.

## 협업 기록과 이관 이력
root AGENTS.md가 우선 정본이고 docs/collaboration/README.md가 협업 진입점입니다. STATUS·이번 전환 보고는 이 루트 docs/collaboration/에서 운영하며 기존 상세 작업 보고는 docs/reports/에 보존합니다. 과거 다른 프로젝트의 서버·설치·공유 폴더와 연결했던 구조는 PROGRESS.md의 이력입니다. 그곳의 export 연결 두 개는 외부 소비자가 독립 도구를 읽는 단방향 참조이며 도구 실행 조건이 아닙니다.

## 아직 별도 책임인 것
보존 원본 r14와 실제 검수한 샘플 ux-902404d6 r4를 구분합니다. 샘플의 3개 page·1개 modal·24개 부품·6개 연결은 설계 저장본 기준이며 W/P/U/S 단계 종합검수 0/4와 별개입니다. 본게임 로직 작업은 병행할 수 있습니다. 이번 계획 도구 기능은 구현했고 다음 제작은 모노폴리 GO 정식 UI입니다. 그래픽·전체 샘플·실제 게임 연결은 미완료입니다. 전체 Unity/Figma 호환·엔진 어댑터 자동 생성은 현재 제공 범위 밖이며 새 선행 조건으로 추가하지 않습니다. 실제 게임 전체 자동변환은 구현되어 있지 않습니다. API·실화면 검수의 통과 여부는 이번 작업 보고의 실제 결과로 확인합니다.

실제 게임 호스트, 데이터 공급, 게임 상태 저장·동기화, 엔진 자산 처리, 전체 게임 변환, 최종 그래픽과 기기별 완성도는 별도 구현·승인·검증이 필요합니다. DOM 구조가 비슷하다는 이유로 Unity/Godot나 기존 게임과 동등하다고 수치나 완성 판정을 붙이지 않습니다.

## 3·9슬라이스 조립과 DOM 그림자 책임 추가 · .9 · 2026-11-16 14:36 KST

가변 박스는 기존 skins.mjs의 3·9슬라이스·applySkin·상태 textures와 CSS border-image 조립을 재사용합니다. 임의 SVG 판 또는 전체 가로 그림을 통째 늘린 동작을 이 계약의 대체 구현으로 완료 처리하지 않습니다. source의 분할 px, 논리 fixed edge, content padding, actual resource alpha, hit rect는 독립된 경계입니다. SVG/PNG/WebP는 source 자원이며 실제 9분할/고정폭 조립은 기존 엔진 경로가 담당합니다.

커스텀 BG와 Frame은 개별 source로 겹칩니다. custom-skin-image 배경은 투명하게 두어 투명 코너/중앙에 tone 색판을 추가하지 않고, 내장 frame.svg의 기존 tone은 보존합니다. 상단 source 128×64, slices/edges 각각 27, padding 0의 source 중앙은 74×10이고 target 양축 최소는 고정폭 합 54입니다. 54 미만은 코너 보존 보장 범위 밖이며 높이 54에서는 target 중앙 높이가 0인 최소 경계입니다. v005 하단은 가변 9body와 별도의 fixed crown을 사용하며 crown을 전체화면 늘림 이미지로 바꾸지 않습니다.

그림자의 정본은 element.effects.shadow이고 실제 아트 표시에서 DOM alpha drop-shadow로 적용합니다. PNG 픽셀에 굽지 않으며 pressed/disabled 상태 효과와 합성합니다. 새 UI의 기본은 꺼짐이고 열람만으로 문서에 설정을 만들지 않으며 실제 조작 때 기존 문서 편집·Undo·저장 흐름을 사용합니다. 원본 픽셀·배치·outline·입력 경계는 보존합니다. 커스텀 자원에 그림자를 넣지 않는 제작 원칙과 CSS 배경 투명 규칙은 별개이며, 투명 CSS가 이미 굽힌 그림자를 지우는 기능은 아닙니다.

본체 실화면 computed 전달: Frame 300×80/620×110/461×54에서 동일 source·border-image-width 27px·slice 27 fill·투명 배경 유지. 이 문서 담당의 재실행, 모든 브라우저/엔진 호환, Unity 동등성 확인으로 확대하지 않습니다. 원본 폰트 설정과 Unity 버전/실제 연결은 미확인입니다.

재발 방지 기록은 padding 6 상태에서 3px 선이 12px로 커져 보였던 사례입니다. source의 선 두께와 CSS 고정폭·내용 여백·box 기준을 함께 확인하고 root padding 0을 유지합니다. 이 사례의 실제 CSS 추가 검수는 남아 있으므로 원인을 새 시험으로 확정한 것처럼 쓰지 않습니다. 자원 근거는 `_작업/codex/ux-studio/board-ui-resources-v005.json`, 기존 검산은 `_작업/codex/ux-studio/hud-top-9slice-v004-report.md`입니다.

본체는 하단을 조립 중이며 하단 실검수는 미완료입니다. 전체 W/P/U/S 0/4와 사용자 승인/freeze 없음은 유지합니다. 기존 .9 본문과 프로젝트 사본은 보존합니다. 사람용 조작 순서는 USER_GUIDE.md 마지막 ‘편집 핵심 한 페이지 사용 순서’를 따릅니다.


## .12 짓기 실증에서 보완한 보기 경계

v4 새 화면의 logicalSize는 선택한 저장 page(모달이면 entry page)의 authored 값을 상속합니다. 기기 preview의 reflow 높이를 저장 기준으로 삼지 않습니다. main.mjs의 기존1/2/3 의미는 유지합니다.
standalone preview.mjs는 가용 W/H와 실제 header/stage/footer 여백으로 uniform fit하며 stage에만 overflow:clip을 적용합니다. public runtime page가 바뀔 때만 바깥 window scroll을0으로 돌립니다. 같은 page의 overlay/feedback와 내부 목록 scrollTop을 이 처리로 바꾸지 않습니다.
Grapes 화면 보기의 devicePreviewMode는 true입니다. 여러 화면을 담는 iframe 너비와 CSS media query를 UI 프로필로 혼동하지 않습니다. 이전 단계 저장 ProjectData의 옛 media rule 호환은 미확인으로 분리합니다. 현재 설계 JSON과 사용자 지정 canvas 위치를 자동 정리·삭제하는 절차가 아닙니다.


## 승리 화면 조립 추가 기록 · .13 · r53 기준

작성자 codex(단이) · 2026-11-16 20:01 KST · 제안(검수 대기)

본체 전달의 r53은 기존 Main63/Build78과 Modal_Wins_QuickWins를 조립한 기준입니다. 문서 담당은 이 단위에서 제품 소스·설계 JSON을 수정하거나 Main/Build 최종 deep equality를 검사하지 않았습니다.

|책임|.13 공통 계약|확인 경계|
|---|---|---|
|가변 판/프레임|종이 fill9와 gold/white rim frame9는 별도 source128×96, slices/edges 각각27, padding0입니다. mission fill9는 source128×96/slices27/edges16/padding0입니다.|source slice와 논리 edge를 구분하며 frame 중앙 alpha0·fill 중앙255, 원본 PNG/벡터와 WebP를 보존합니다.|
|진행/고정 장식|native3 source128×32, slices[0,16,0,16], edges[0,18,0,18], padding0, stretch. 클립·노란 광선·미션/보상 그림은 독립 고정 이미지입니다.|3slice375.84×36.38/64×36.38의 늘림 중앙 폭339.84/28을 자원 단계에서 검증했습니다. 실제 브라우저와 전역 판/글자를 혼합하지 않습니다.|
|native text|parts.mjs의 optional typography.strokeWidth(0~12 finite)/strokeColor(#RRGGBB) 검증→공통 typographyStyles의 webkitTextStrokeWidth/Color·paintOrder='stroke fill'→layout-view DOM text.|새 필드 없는 설계는 기본값을 생성하지 않습니다. native 제목 표시를 본체가 확인했으며 원본 font-family는 미확인입니다.|
|계층/paint|parentId 변경과 문서의 그리기 순서는 각각 확인합니다. 이전 text를 새 BG 위로 UI 맨 앞으로 이동하고 label 역할을 지정합니다.|텍스트 기본 회색 판·가려짐을 이미지 문제로 바꾸어 고치지 않습니다. duplicate root는 부모/rect를 재확인합니다.|
|overlay root|presentation.rootMode='fullscreen'이면 배후 page 기준 전체 root를 사용합니다. v4 shared definition도 page.logicalSize를 계승합니다. 필드 없는 기존 overlay는 window 크기입니다.|저장 참조 크기는 보존하고 profile reflow/zoom과 구분합니다. dim/block/Escape 정책의 실제 키보드·차단 검수는 본체 진행 중입니다.|
|브라우저/서버 모듈|Vite/HMR의 브라우저 모듈과 Node 저장 플러그인의 정적 import 캐시는 별개입니다. 새 stroke validator 저장 실패는 자기 소유7018의 허용된 재시작 뒤 r48 저장으로 확인했습니다.|현재 재시작 승인·프로세스 소유를 확인하며 7007 관리나 전체 캐시 삭제로 확대하지 않습니다.|

자원 출처는 [wins UI](../../../../_작업/codex/ux-studio/wins-ui-assets.json)·[wins icons](../../../../_작업/codex/ux-studio/wins-icon-assets.json), 자동시험은 [447/447 로그](../../../../_작업/codex/ux-studio/wins-screen-final-tests.log)입니다. 실제 모바일430/키보드/차단·포커스·최종 원본 보존 대조는 본체 후속 보고를 참조합니다. 게임 보상·폰트/픽셀·장식 정확도·Unity 전체·7007/LSB는 미검수이며 W/P/U/S0/4·10장 동등0/10·승인 없음입니다.


### 본체 후속 검수 · .13 · 2026-11-16 20:21 KST
r53/187부품·2page+1modal·4연결을실제저장재열기했습니다. Main/Build r43 deep equality동일,actual클릭·Enter/Space·Close/Escape·메뉴활성/초점복귀·배후inert·1440/430·논리390복귀·전체캔버스3판1920 확인. 최종451/451·fail0,보고 docs/collaboration/reports/20261116_1916_wins-screen.md 및 PROGRESS .13 본체최종절을읽습니다. 닫기렌더staleinert·fullscreen demo×·고정bridge?v의immutable캐시불일치도최소보완/actual재확인했습니다. bridge공개API변경때import버전URL캐시를함께점검합니다. 위전달시점pending/447은이력이며최신결과로합산하지않습니다. 프로젝트guide.4보존·모든산출제안,10장동등0/10·W/P/U/S0/4·원본폰트/게임보상/7007LSB native/사용자승인미완료. 다음03앨범새그림·메뉴연결입니다.


## 앨범 실제 조립 추가 기록 · .14 · r63 기준

작성자 codex(단이) · 2026-11-16 21:09 KST · 제안(검수 대기)

문서 담당이 실제 샘플 ux-gjs-0d80d7fe r63을 읽어 Main63+Build78+Wins46+Album74=261부품, 3page+1modal·6연결을 확인했습니다. Main Album→navigate/always와 Album Back→back/always가 추가되었습니다. 기존 .13 이하 본문과 프로젝트 guide.4는 그대로 보존합니다.

이앨범은기존engine계약으로조립하며새분할구현은없습니다. native9 source27/edges8/padding0과고정room/5그림/native를분리합니다. Viewport551×624.59@(0,359.41)scroll-y→transparent isGroup Content551×806 visible→grid3,item164×248,gap6,padding25.59/24/24/23으로책임을나눕니다. 극소진행은overflow clip부모가128px이상native3자식(source128×32,slices0/16/0/16,edge0/12/0/12,pad0)의왼쪽만표시하며count는별도native입니다.0fill은생략합니다. Vault효과는effects.shadow0/2/3/.25,입력은Mainnavigate/Backback·always이며unknown목적지는만들지않습니다.

실제 새 투명 빈그룹은 서로 다른A→B를 superclick2개 선택→그룹→새UUID 확인→자식삭제로 만들었습니다. 단일선택 실패의 기존ID를 성공으로 해석하지 않습니다. 일반image-frame 배경panel에이미지경로를쓸때는부품역할을바탕으로먼저지정합니다. native글자는label·그림은image로분리하고현재부모/선택/입력→Tab·blur→저장재읽기를확인합니다.

60초넘는긴UIbatch의Node연결reset때DOM편집은남아있었습니다. 같은브라우저재연결/r58우선저장/짧은step재개로처리한관찰사례이며filesystem JSON조립이아닙니다. `_작업/codex/ux-studio/browser-ui-helpers.mjs`는UI클릭/AX만하는스크래치이며제품API가아닙니다. 이앨범작업은제품source수정없음입니다.

[원본03](../../../../docs/reference/monopoly-go/20261116-ten-screens/03_album.png)·[측정/quicksheet](../../../../_작업/codex/ux-studio/album-assembly-quick-sheet.md)·[15개 그림 manifest](../../../../_작업/codex/ux-studio/album-icon-assets.json)·[7개 UI manifest](../../../../_작업/codex/ux-studio/album-ui-assets.json)를 읽었습니다. manifest의 registration/UIApplied는 자원 하위작업 당시 상태이며 현재 적용은 실제 저장 assetRef와 본체 보고를 대조합니다.

문서 담당은 fresh [album-screen-final-tests.log](../../../../_작업/codex/ux-studio/album-screen-final-tests.log)의451/451·실패0·cancelled0을 직접 읽었고 시험/actual UI를 재실행하지 않았습니다. 과거 실행 수를 합산하지 않습니다. 본체 전달 actual은 로비→Album→Back→Main 현금13,075/trigger 초점 복귀·재진입 scroll0, AX scroll0→181.25/client625/scrollHeight806/headerY114.765625 고정/body scroll0입니다. 재진입 초기화는 관찰값이며 원본 정책으로 확정하지 않습니다. 모바일430·1920canvas·최종 캡처·기존Main/Build/Wins deep equality는 본체 검수 대기이며 후속 본체 보고를 우선합니다.

원본 폰트/픽셀·실제 게임/보상/카운트다운·Info/Vault/세트 상세 목적지·7007/LSB·사용자 승인/freeze는 미완료/미확인입니다. 10장 최종 동등0/10·W/P/U/S0/4, 제안(검수 대기)를 유지합니다.


### .14 후속 미확인 보정 · 2026-11-16 21:10 KST

Set08/09 새 그림은 원본 종과 불일치해 본체가 새 그림으로 보정 중입니다. 해당 그림의 최종 교체 revision·실제 등록/표시·검수 결과는 본체의 후속 실제값 append를 기다립니다. 현재 UI 완료나 원본 동등을 주장하지 않습니다. 상세 본체 보고는 [20261116_2025_album-screen.md](../../../../docs/collaboration/reports/20261116_2025_album-screen.md)입니다.

UI manifest의 progressCapsTransparentCorners=false는 room을 추가한 뒤 마지막2개 배열이fill+room이된집계오류였습니다. 실제progress-bg3/fill3의4모서리알파0을직접확인하고해당2role만명시선택하도록원스크립트집계식을보정했습니다. 그림파일/등록/UI는변경하지않았습니다. 이메타데이터보정은UI검수완료판정이아닙니다.


### 본체 최종 실제값 · 앨범 r64 · 2026-11-16 21:20 KST

위 r63/교체 중/pending은 중간 이력입니다. 최종 ux-gjs-0d80d7fe r64=Main63+Build78+Wins46+Album74=261부품·3page+1modal·6연결입니다. 실제 툴의 이미지 경로 입력+Tab으로 Set08 초록·노랑 새/Set09 노란 강아지 v002를 등록·교체·저장했습니다. 두 종을 고양이로 잘못 읽은 v001은 원본/해시를 보존하고, _작업/codex/ux-studio/album-icon-corrections.json에 교체 이유·새 원본/프롬프트/투명 PNG/WebP·SHA·관찰/추정을 기록했습니다. screenshot pixels 재사용 없이 새로 그린 그림입니다. v00115+기하UI7+교정2=24개 보관 자원 해시·미러 일치, 최종 사용 신규 자원22개입니다. 일러스트15개 사용 중2개가v002이며 기하UI7은직접작성SVG→losslessWebP입니다.

본체 actual: Main Album 클릭→새 Album→Back→Main 현금13,075/Album trigger 초점복귀, native Tab/Enter로Back·Space재진입, scroll0→181.25(client625/scrollHeight806)·headerY114.765625고정·바깥scroll0·재진입scroll0을 확인했습니다. 재진입 초기화는 우리 도구 관찰이며 원본 정책 확정이 아닙니다. 최종preview CSS1440×900·모바일CSS430×844에서 가로/세로넘침0·깨진이미지0. 캡처파일은 각각phoneclip408×729/모바일430×843입니다. 전체canvas CSS1920×1280의실제파일1919×1280,4boards X24/635/1246/1857,Y40·폭551/60간격·261부품·r64재열기를확인했습니다. 상세390×844의root와preview-screen실제389.997×843.987일치/설계기준복귀·r64hash불변,당시상세브라우저CSS2687×1792로1440상세검수라쓰지않습니다. 카드가이드W164/H248actual파일2520×1575도보존했습니다. 자동배치자식의가이드위치/크기잠금은부모grid보존규칙입니다.

Vault actual right10.019/bottom12.012 논리px·engine filter drop-shadow(0,2,3,.25)로하단고정확인. Main/Build/Wins 전체deep equality와기존4edges는r53와동일합니다. 본체 이번npm test451/451·fail0·exit0,로그 _작업/codex/ux-studio/album-screen-final-tests.log. 그뒤제품소스변경0/재실행중복합산0이며삽화교체는자원해시/실제표시로재검증했습니다.

보고 docs/collaboration/reports/20261116_2025_album-screen.md, 증거 docs/evidence/20261116-album-screen/ 및 file-verification.json을 우선합니다. current-review는r64로갱신합니다. 프로젝트guide.4/원본/이전판보존, 공통.14. 다음04친구새그림·native본문/탭/목록/행동·Main입구/Close/차단/복귀연결입니다. Info/Vault/세트상세목적지·게임수치변화/보상/시간·원본폰트/픽셀동등·7007/LSB native·사용자승인/freeze는미완료입니다. 10장최종동등0/10·W/P/U/S0/4·제안(검수대기),주간81/90·11/17 08:00KST중지선·기존ui30분만유지합니다.
