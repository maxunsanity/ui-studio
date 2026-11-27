# 신규 게임 샘플 정상 UI 제작 준비

작성자 codex(단이) 하위 읽기전용 조사 · 2026-11-20 KST · 제안(검수 대기)

## 범위와 확인 수준

- 게임명은 미확정이며 추측하지 않았다. 새 영상 분석·게임명 확정은 대표 본체 범위다.
- 실제 UI/브라우저 조작, 폴더 등록, 설계·프로젝트 메타 JSON 작성/주입, 자원 등록, 저장·미리보기 검수는 0이다. 아래는 현행 가이드와 소스에 근거한 경로다.
- 제품 소스·다른 게임 설계·공용 STATUS/보고를 수정하지 않았다. 본 파일만 배정된 작업 위치에 작성했다.
- 공통 guide/index.json 현재 판은 `2026-11-19.40`이다. 문서 본문의 .4/.8/.10 등은 과거 기록과 섞여 있으므로 최신 절과 현행 소스를 우선한다. 기존 프로젝트 사본/guideVersion은 덮어쓰지 않는다.
- repo 최상위와 src/tools/uxStudio에 graphify-out/graph.json이 없음을 확인하여 좁힌 검색으로 관련 소스만 조사했다. 새 지도 생성·전체 스캔은 하지 않았다.

## 본체가 먼저 적용할 핵심

1. 이름 확정 뒤 `samples/<확정된-slug>/` **게임 폴더만** 먼저 준비한다. `ui-studio/`나 assets/를 외부에서 먼저 만들지 않는다. 현행 선택기는 ui-studio가 이미 있으면 정상 project.json도 있는 기존 프로젝트라고 읽기 때문에 빈 ui-studio를 미리 만들면 등록에 실패한다. 메타는 도구의 정상 폴더 선택으로 생성한다. 근거: workspace-store.mjs:189~208, COMMON_UI_RULES.md:174.
2. 홈 「제작하기」는 `workOnly:true`라 정본 samples/ 직속 폴더를 거부한다. 신규 **샘플**은 별도 전체 캔버스의 「프로젝트 폴더」 또는 상세 편집 「파일 · 공유 → 프로젝트 폴더 → 폴더 찾아 열기」로 등록한다. 이 경로는 workOnly 제한이 없다. 근거: home.mjs:45~54, project-manager.mjs:104, overview.mjs:208, main.mjs:274.
3. 폴더 선택 뒤 「변환 안 함 · 독립 UI로 저장」을 선택한다. 이 도구 선택은 프로젝트 작업방식의 기록이며 게임 전체 변환이나 실제 기능 연결이 아니다. 본체의 기존 사용자 승인 범위가 독립 샘플 제작이면 별도 승인 질문을 추가할 이유는 없다. 새 UI의 선택 기록은 정상 버튼으로 남긴다.
4. 새 workspace에서 저장 설계가 없으면 전체 캔버스는 빈 상태와 「상세 편집」을 제공한다(overview.mjs:172). 상세 편집은 `emptyDesign`을 자동 준비하므로 「새 설계」를 한 번 더 누를 필요가 없다(main.mjs:2468). 기존 설계가 이미 있을 때만 목적을 확인하고 「새 설계」를 사용한다.
5. 반복 부품은 완성된 한 묶음을 정상 UI 복제/붙여넣기로 재사용하면 빠르다. 다른 workspace 간 clipboard는 자원 파일 전달을 보장하지 않으며, 타 게임 전체 설계 사본은 원치 않는 화면·연결까지 복제하므로 기본 선택으로 삼지 않는다.

## 필수 정상 입력 순서

### 1. 등록·설계·논리 크기

- 별도 전체 캔버스 → 프로젝트 폴더(`#overview-projects`) → 폴더 찾아 열기(dialog의 `[data-folder]`) → macOS 선택창에서 확정한 게임 폴더 선택 → 독립 UI 선택.
- 선택 결과 프로젝트 이름·실제 경로·workspace ID를 기록한다. 정본 samples/ 바로 아래 한 단계 게임 폴더만 샘플로 분류되며 중첩 samples/<game>/ui-studio 등은 fixture로 분류된다(workspace-kind.mjs:1).
- 신규 폴더 등록은 도구가 `ui-studio/project.json`, `designs/`, `assets/`, `exports/`, 안내 사본을 생성한다(workspace-store.mjs:195~213). root 툴 폴더 자체는 선택 금지다(:188).
- 상세 편집의 「파일 · 공유」에서 설계 이름(`[data-project-field="name"]`)을 정한다. 첫 화면을 선택하고 이름(`[data-field="screen.name"]`)·용도(`[data-field="screen.purpose"]`)를 정한다.
- 화면 선택 상태의 속성/배치 → 「응답형 배치 · 안전 영역」에서 논리 너비/높이(`[data-responsive-field="screen.logicalSize.w/h"]`)를 먼저 맞춘다. 현행 편집기는 첫 실제 응답형 변경 때 schemaVersion 4와 logicalSize를 기록한다(responsive-inspector.mjs:13~64). 원본 관찰 비율과 제작 기준을 구분한다. 미정 safeArea를 승인된 0으로 꾸미지 않는다.
- 새 화면은 「화면」 → 「＋ 게임 화면 추가」 펼침 → `#new-screen-name` → `[data-action="new-screen"]`. 새 화면은 page로 생성된다. modal은 `#convert-screen-kind`에서 modal 선택 → 「화면 종류 적용」을 사용한다(main.mjs:1639~1685). 화면 추가 후 v4이면 현재 page/entry의 logicalSize를 상속한다.

### 2. 부모·유닛·배치

- 레이어 트리에서 현재 화면/부모와 선택 ID를 확인한다. 「하위 레이어 추가」로 insertParentId를 지정했으면 그 부모에 추가된다. 그렇지 않으면 화면 최상위다(main.mjs:862~889).
- 왼쪽 「도형 도구 모음」 → 「네모 백판 도구」, 「텍스트·정보 도구 모음」 → 「본문 도구/이미지 자리 도구」, 「게임 UI 종류 도구 모음」 → 「버튼 도구/정보 백판 도구」를 고른 뒤 `#preview-canvas` 클릭 또는 드래그. 클릭은 기본 크기를 쓰며 드래그는 실제 그린 크기를 쓴다(main.mjs:2779~2827). 반복 입력 중에는 flyout을 닫고 현재 선택을 다시 찾는다.
- skin 유닛은 native로 BG/이미지/글자 자식을 조립한다(main.mjs:879). 일반 네모 백판은 단일 panel이다. 버튼 복합 유닛 ID suffix를 추정해 삭제하기 전에 실제 트리에서 확인한다.
- 「레이어 위치 · 크기」(`[data-transform-field="x/y/w/h"]`)의 단위(`[data-transform-unit]`)를 **px로 확인**한다. 이 상태는 전역 편집 설정이므로 이전 작업에서 %로 바뀌었을 수 있다. 수치 입력 → Tab/blur → 재표시 확인. Enter 또는 「수치 적용」은 4개 입력을 함께 적용한다(main.mjs:2050,2076,2830).
- 부모 변경(`[data-layer-parent]`)은 화면상 현재 위치를 보존하면서 새 부모 기준 좌표로 바꾼다(layers.mjs:54~92). 따라서 **local 좌표 명세는 부모 지정 후 입력**한다. 기존 helper의 `rect 후 parent`는 화면 절대좌표를 먼저 넣는 작업에만 맞다.
- 앵커/부모맞춤/안전영역/자동배치 자식이면 일반 XYWH 필드가 나타나지 않는 것이 현행 계약이다. 응답형 속성 또는 디자인 가이드의 지원 경로로 편집한다. 도우미가 모든 경우에 percent로 바꿔서 강행하면 원래 계약이 달라진다.
- 이름 변경은 표시 이름만 바꾸며 ID·부모·연결을 재발급하지 않는다. 반복품의 같은 family/variant는 외곽·아이콘·글자·기준선을 공유하되 타 게임 숫자를 강제하지 않는다.

### 3. 일반 이미지·프레임 등록

- **일반 이미지:** 이미지 자리를 선택 → 속성 일반 → 이미지 내용 → 「프로젝트 이미지 경로」(`[data-project-image]`)에 `/ui-studio/source/assets/.../file.webp` 입력 → Tab. 외부 URL·공백/한글 경로·SVG는 이 경로 계약 밖이다. 정규식은 영문/숫자/밑줄/하이픈 폴더와 PNG/JPG/JPEG/WebP만 허용한다(main.mjs:1964~1969).
- 다른 정상 경로는 파일 선택(`[data-image-file]`) 또는 「이미지 목록 새로 읽기」 → 「저장된 이미지 재사용」(`[data-workspace-image]`)이다. 등록은 현재 workspace assets에 sha256 참조를 보관한다. 소스에 둔 준비 파일만으로 등록됐다고 쓰지 않는다.
- 래스터는 각 300,000bytes 이하, 원본 가로/세로 1~4096px, 전체 설계 2,000,000bytes 이하. MIME/해시/경로 검사를 우회하지 않는다(asset-reference.mjs:2, asset-client.mjs:10, main.mjs:1992).
- 경로 입력이 placeholder로 비워진 것만으로 성공 판정하지 않는다. 재렌더 때 오류여도 입력은 빈 상태가 될 수 있다. 해당 부품의 실제 img/image·assetRef·원본 크기와 등록 자원/저장 재읽기를 확인한다.
- crop은 `[data-image-region="0..3"]`에 원본 X/Y/W/H 입력 후 「이미지 영역 적용」을 누른다. draft 입력만으로 확정되지 않는다. 표시 crop은 원본 파일·부품 배치·입력 영역을 바꾸지 않는다(main.mjs:3243).

### 4. 3/9슬라이스

- 단일 네모 백판 panel을 선택 → 일반 속성의 「프레임 방식 · 선택 부품」(`[data-skin-mode]`)에서 `backplate`=9, `button`=3을 고른다. 프레임 방식 변경은 `createSkin`을 새로 만들어 기존 설정을 초기화한다(main.mjs:1813~1824).
- **모드/종류 먼저 → 프레임 그림 등록 → source 분할 → 고정폭 → 내용 여백 → repeat → 상태/크기 검수** 순서다. `[data-skin-field="preset"]` 변경도 createSkin 초기화이므로 숫자 입력 후 마지막에 preset을 바꾸지 않는다(:1838).
- 「프레임 프로젝트 이미지 경로」(`[data-skin-project-image]`)는 일반 이미지 경로와 다르다. `[data-skin-state]`로 현재 상태를 고른 뒤 등록하면 그 상태 texture만 바뀐다. 현재 선택/설계가 비동기 등록 중 바뀌면 취소한다(main.mjs:1750~1792).
- slices/edges/padding는 모두 **상·우·하·좌** 배열이며 `[data-skin-field="slices.0..3"]`, `edges.0..3`, `padding.0..3`. 0~96 숫자다. source 상+하 < 원본 높이, 좌+우 < 원본 너비여야 한다. **3slice는 slices와 edges의 상·하가 항상0**이어야 한다(skins.mjs:45~60).
- 사용자 원화의 source 분할과 target 고정폭은 다를 수 있다. padding은 테두리 두께 조절값이 아니다. 고정 장식·그림·native 글자·입력·외부 그림자는 분리한다. 예전 27/22px 등을 새 게임 공통값으로 강제하지 않는다.

### 5. 저장·재열기·세 종류 보기

- 「파일에 저장」 → role=status의 **파일 저장·재읽기 확인 완료 · rN** 및 `.project-context`의 workspace/설계/저장됨을 확인한다(main.mjs:205~254). 버튼 클릭 반환만으로 성공 처리하지 않는다. 409 등 실패 때 현재 수정은 보존된다.
- 「파일 · 공유 → 현재 파일 다시 열기」 또는 동일 workspace 저장한 설계 선택으로 ID/revision/화면·부모·자원·연결을 확인한다. W/P/U 표현 전환은 같은 설계 view이며 기준판 저장과 다르다.
- **상단 미리보기:** 현재 선택 화면·미저장 편집 포함 단독 보기. 기기 선택으로 설계 폭을 유지하고 논리 높이를 바꿔 다시 그린다. 화면 이동 흐름 시험은 아니다(main.mjs:393~431).
- **저장 샘플 보기 ↗:** 저장판의 선택 화면 단독 샘플. 실제 모달 흐름을 실행하는 창이 아니다.
- **편집 도구 → 동작 시험:** 선택한 page에서 현재 편집본 연결 시험. modal만 고르면 entryScreen 시작이므로 모달 진입 성공으로 기록하지 않는다.
- **파일 · 공유 → 동작 시험 보기 ↗:** 저장판 entryScreen에서 시작. URL screen=으로 시작점이 바뀌지 않는다(UX_WORKFLOW_GUIDE.md:55~80).
- 고립 모달의 실제 게임 입구가 원본에서 미확인이라면 시험용 가짜 버튼/연결을 추가하지 않는다. 단독 상태·배치만 확인하고 연결·복귀는 미검수로 남긴다.

## tile-native-nov20.mjs 재사용 검토

**현행 소스와 선택자 일치:** `[data-panel-tab]`, `[data-tab]`, `.layer-select[data-element]`, `[data-layer-parent]`, `[data-field]`, `[data-transform-field]`, `[data-responsive-field]`, `[data-project-image]`, `[data-workspace-image]`, `[data-skin-mode]`, `[data-skin-project-image]`, `[data-skin-field]`, `[data-image-region]`, `[data-edit-command]`, `#preview-canvas`, 「유닛 도구 닫기」와 3개 도구 묶음 명칭은 현재 main.mjs에도 있다. 다만 이는 소스 존재 확인이며 현재 열린 DOM의 중복/가시성·실제 입력 성공 검수가 아니다.

|기존 부분|그대로 실행 전 주의/정상 UI 재사용법|
|---|---|
|setup이 installRunner까지 부름|runner는 tile 전용 이름 `TSV_<family>`·장부 경로 `tile-native-action-ledger.json`·기존 asset 경로를 가진다. 새 작업에서 통째 재사용하면 타일 로그/이름을 섞는다. 순수 locator/키입력 helper만 재사용하거나 새 작업 전용 정상 UI runner로 명확히 분리한다. 저장 JSON 작성은 하지 않는다.|
|t.newArtBase|타일 보정 자원 경로로 고정돼 있다. 새 게임 자원 준비 경로로 바꾸어야 한다. old 타일 자원을 기본값처럼 가져오지 않는다.|
|t.button 기본 skin|타일 survival button-green3 경로와 정규식으로 9/3를 결정한다. 새 게임 family의 실제 명세에 맞춰 명시 경로/모드를 지정한다.|
|t.unit bucket|현재 네모 백판/본문/이미지 자리/게임 UI 종류에는 맞다. 토글·목록·진행 표시 등은 새 label의 group을 확인해 맞는 묶음을 연다. 현 도우미는 매칭 밖을 게임 UI로 보내므로 일반화하지 않는다.|
|t.names/find|트리에 렌더된 행만 읽는다. 접힌 자식이나 검색 필터의 부품이 빠질 수 있다. 사전 검색·펼침·중복 이름 확인 후 재사용한다. 없는 것으로 오판해 중복 생성하지 않는다.|
|t.rect|기본은 px 가정이나 현재 transformUnit을 지정하지 않는다. 먼저 단위를 px로 확인한다. 고정 앵커면 percent로 잠시 바꾼 후 known preset을 복원하지만 custom 앵커/안전영역/자동배치는 안전한 일반 복구가 아니다. 새 percent 부품에 한정하거나 응답형 필드를 직접 사용한다.|
|t.abs/모든 add helper의 rect→parent|화면 절대 좌표 입력 패턴이다. 부모 local 명세라면 parent→rect 순서로 정상 UI를 사용한다.|
|t.setSkin 기본 s=[22,22,22,22]|9slice용 가정이다. mode=button(3)에 쓰면 상/하0 규칙 위반. 3slice는 명시 `[0,R,0,L]`와 edges 상/하0을 사용한다.|
|t.setSkin padding 미설정|createSkin의 기본 padding이 남는다. 원화/프레임 명세가0이면 4칸을 정상 입력으로 명시한다.|
|t.skin/replaceImage 완료 조건|placeholder-shown만 기다린다. 오류로 재렌더돼도 충족될 수 있으므로 실제 이미지/프레임 참조·오류표시·원본 크기·저장 후 값을 확인한다.|
|t.set|키입력→Tab과 재선택은 현 가이드에 맞다. checkbox/조건 변경 뒤 재렌더가 있으므로 locator를 다시 찾고 상태를 재확인한다. 현재 값이 같다는 빠른 skip은 실제 저장값을 확인하는 검수의 대체가 아니다.|
|t.save extras|현재 소스의 파일 저장·재읽기 확인 완료를 기다리므로 click만 하는 구형 save보다 적합하다. 저장 후 동일 ID/revision 재열기는 별도 수행한다.|

## 네이밍·규격 재사용 최소 기준

- 화면/역할 접두어: `Page`, `Modal`, `HUD`, `Group`, `BG`, `Frame`, `Img`, `Txt`, `Btn`, `Input`, `Badge`. name은 표시용이며 stable ID/parentId가 구조 정본이다. 부모 전체 이름을 자식 이름에 무조건 반복하지 않는다(AI_GUIDE.md:192~198).
- 사람용 그림 이름은 `<scope>_<component>_<role>_<state>_vNNN.ext`. 원본·실패판 보존, 새 판을 올리고 등록 SHA와 적용 stable ID를 연결한다. normal/highlighted/pressed/selected/disabled는 실제 제작한 상태만 기록한다.
- family/variant별 외곽·아이콘·글자·배지·기준선은 먼저 한 세트로 정한다. 새 게임 논리 기준·화면비와 원본 관찰을 따르고 다른 게임의 menu80×92/nav78×66/card90×131 같은 숫자를 자동 강제하지 않는다(COMMON_UI_RULES.md:46~63,177).
- 같은 workspace의 반복 묶음 native 복제는 자식/참조의 재매핑을 제공하지만 최상위는 +2%·이름 '복사'·legacy%로 바뀔 수 있다. 화면 logicalSize/safeArea/skin/presentation/entry/fixtures는 clipboard로 복제되지 않는다. 복제 뒤 부모·앵커·이름·입력 전달·대상 연결을 확인한다(USER_GUIDE.md:636~661).
- 다른 workspace로 정식 전체 사본이 필요한 경우 도구의 「현재 설계 사본 넣기」는 assetRef 파일을 함께 전송하고 새 설계ID/r1을 만든다(main.mjs:256~272). 개별 clipboard가 같은 일을 한다고 가정하지 않는다.

## 백업·보존·검수 경계

- 새 게임폴더 외 다른 samples/pikmin/포토카드 등 다른 담당 영역을 수정하지 않는다. 여러 작업자가 사용하는 registry(workspaces.json)는 정상 UI가 lock과 원자적 쓰기를 수행하게 둔다. 외부 JSON 수정 금지.
- 기존 파일 변경 전 정본 `docs/planning/_backup/YYYYMMDD_단이/...`에 보존한다. 새 샘플이므로 기존 다른 샘플을 덮어쓸 필요가 없다. 현재 작성한 이 준비 문서는 설계가 아니며 별도 백업/수정 대상도 만들지 않았다.
- 저장 revision은 변경 이력이지 불변 백업이 아니다. native 기준판 보존과 파일 백업을 구분한다. 원그림/master·새 원화·가공본·등록본도 구분한다.
- 데스크톱1440·모바일430·논리390×844, 짧은폰360×640 등 실제 수행 범위에 대해 배치/앵커/기준선/스크롤/넘침/이미지404/상태/마우스·Enter·Space/Close·Back·Escape·초점복귀/저장 재열기를 본체가 확인한다. 실제 영상에 보인 연결만 조립하고 미정 동작은 미확인으로 남긴다.
- 이번 하위 조사는 source-only다. 브라우저/저장·재열기/이미지·프레임 등록/자동 시험을 실행하지 않았다. 제품 소스 변경이 없어 기존 전체 시험을 다시 실행하지 않았으며 과거 시험 수를 이번 실적으로 적지 않는다.

## 직접 읽거나 좁혀 확인한 원본

- AGENTS.md, src/tools/uxStudio/guide/START_PROJECT_GUIDE.md, AI_GUIDE.md, USER_GUIDE.md의 신규작업/이미지/프레임/저장/복사 및 최신 관련절, UX_WORKFLOW_GUIDE.md, COMMON_UI_RULES.md 관련절, guide/index.json.
- src/tools/uxStudio/{entry,home,project-manager,workspace-store,workspace-kind,project-context,main,overview,units,skins,responsive-inspector,responsive-layout,layers,asset-client,asset-reference,design-guide-edit}.mjs의 위 인용 영역.
- /Users/max/Documents/Codex/2026-11-11/new-chat/tile-native-{nov20,helpers,runner,extras}.mjs.
