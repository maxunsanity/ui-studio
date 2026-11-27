# 경량 전체 캔버스 후보

작성: codex(단이) 하위 `light_overview` · 2026-11-18 · 제안(검수 대기)

범위: 이 `overview/` 폴더만 작성했습니다. live source, 저장 JSON, schema/샘플, 공용 STATUS/보고, 서버/빌드/패키지를 변경하지 않았습니다. 기존 Grapes 소스/브리지는 읽기만 했습니다.

## 통합 파일

- `overview.html`: 기존 runtime entry HTML에 적용할 후보. 기존 `styles.css` → `presentation.css` → `overview.css` 순서로 각각 한 번 링크합니다. Grapes vendor/script/init 없음.
- `overview.mjs`, `overview-layout.mjs`, `overview.css`: 최종 `src/tools/uxStudio/`에 같은 이름으로 복사할 후보. 모든 runtime import는 최종 source의 `./` 경로입니다.
- 테스트 2개는 scratch harness입니다. source로 옮길 때 `overview-layout.test.mjs` import를 `../../src/tools/uxStudio/overview-layout.mjs`로, `overview.test.mjs`의 `sourceRoot`와 overview/presentation 경로를 최종 source로 바꿉니다.

## API

`readOverviewData({workspaceId,projectId}, fetcher, {preferredProjectId})`는 `{catalog,design,workspace,context}`를 돌려줍니다. catalog/metadata/project는 모두 같은 workspace의 read-only API입니다. 명시 project가 없으면 마지막 읽은 설계 또는 첫 catalog를 선택합니다. 명시 ID가 사라지면 다른 설계를 대신 열지 않습니다.

`mountOverview(page,view)`는 `{refresh,dispose,snapshot}`를 돌려줍니다. `snapshot()`은 project/workspace, selected, layout, presentationMode, zoom, total/mounted/visible boards, positions, revision입니다. 실제 browser QA는 `#overview.dataset`의 `totalBoards`, `mountedBoards`, `visibleBoards`, `renderedElements`, `layout`, `presentation`도 읽을 수 있습니다.

순수 모듈 API: `parseOverviewURL`, `overviewURL`, `preferenceKey`, `cleanViewPreferences`, `screenSize`, `gridLayout`, `flowLayout`, `explicitEdges`, `restorePositions`, `boardExtent`, `visibleBoardIds`, `createOverviewRefresh`.

공통 presentation API를 사용합니다: `PRESENTATION_MODES` 객체 배열, `normalizePresentationMode`, `presentationScreen`, `renderPresentation`. wireframe에서는 root skin 적용 전에 resource-free projection을 만들므로 CSS로 숨기기 전에 이미지가 요청되는 일을 막습니다.

## 동작

- 왼쪽은 actual 저장 화면 이름의 native 전체 행 버튼입니다. 같은 이름/유사 ID도 각 화면 ID closure로 정확히 선택합니다.
- 가운데는 각 화면 전체 보드만 선택합니다. native 선택 버튼이 content와 형제로 놓이며, content는 `inert`, `aria-hidden`, 모든 하위 pointer 차단입니다. renderer는 보이는 보드를 3개씩 프레임에 나눠 렌더하고 멀어진 보드를 해제합니다. 렌더 직후 button-state/scroll-pin controllers를 해제합니다. editor engine/model/iframe은 생성하지 않습니다.
- 오른쪽은 화면 설명/종류/크기/실제 출입 연결만 표시합니다. 원래 target이 없는 back/close 등에 가짜 목적지를 만들지 않습니다.
- grid는 5열, 처음에는 폭에 맞춰 위에서 시작하고 아래 행을 스크롤합니다. `맞춤`은 전체를 맞춥니다. 각 화면의 논리 크기를 지킵니다.
- flow는 entryScreen부터 실제 explicit target을 따라 배치합니다. 사이클은 한 번 방문하며, 미연결 화면을 별도로 표시합니다. 보드 드래그/방향키 이동 및 Escape 취소는 local view 설정만 바꿉니다. 기본 grid는 native touch pan, flow handle만 pointer drag를 사용합니다.
- flow의 기존 좌표는 저장 게임의 canvasPosition과 분리됩니다. workspace+project+layout별 보기 키를 쓰며 공용 legacy와 실제 workspace ID `common`도 충돌하지 않습니다.
- 프로젝트/설계 전환 URL은 대상 workspace/project만 담아 대상의 자체 보기 설정을 복원합니다. 같은 화면의 상세/미리보기 이동은 선택과 표현 view를 유지합니다.
- modal/sheet/toast 창은 `overlayRootSize`의 내부 root를 중심에 배치합니다. fullscreen은 자신의 authored logicalSize를 지킵니다.
- empty/404/잘못된 query/다른 workspace 응답/설계 삭제/선택 화면 삭제를 처리합니다. refresh는 한 번에 하나, 요청 중 들어온 save는 후속 한 번으로 합칩니다. Broadcast는 같은 workspace/project의 새 revision만 받습니다.
- refresh/layout 변경/페이지 종료 때 미완료 drag를 먼저 취소합니다. persisted pagehide는 view만 보관하고 DOM/이벤트를 유지하며, pageshow에서 크기와 저장본을 다시 확인합니다.
- stage는 scaled bounds 밖의 unscaled children overflow를 clip하여 viewport의 scroll 범위가 확대율을 따르게 합니다.

## 시험

실행:

```sh
node --test _작업/codex/ux-studio/ux-refresh-20261118/overview/overview-layout.test.mjs _작업/codex/ux-studio/ux-refresh-20261118/overview/overview.test.mjs
```

최종 후보 24/24 통과. 최초 순수 기능 부재 9/9 RED, API/컨트롤러 부재 6/6 RED를 확인한 뒤 GREEN. 추가 workspace `common` 충돌, source→target 보기 누수, touch 제스처, BFCache, 삭제 중 drag 4개, 살아 있는 화면 refresh의 미완료 좌표 누수를 각각 RED 확인 후 수정했습니다.

시험 범위: grid5/다른 논리 크기/원본 불변, entry 순서와 실제 target/cycle/미연결, 깨진 로컬 값과 중복 좌표, 안전 query와 한국어 ID, 동일 context 링크, scope/key 격리, viewport 좌표와 distant unmount, 동시 refresh/error retry, 빈 catalog/404/다른 ID 응답, 목록·보드 정확한 선택, 전체 보드 inert, flow keyboard/Escape/roundtrip, 초기 폭 맞춤, 화면 삭제 fallback, 새 설계 보기 누수, touch/페이지 수명.

기존 전체 source suite도 sandbox로 실행했습니다: 583개 중 531 통과, 52 실패. 52개 모두 `EPERM: mkdtemp`이며 테스트가 이 하위의 허용 범위 밖 sibling fixture scratch에 쓰려던 환경 실패입니다. 실패 계열은 assets 9, baseline 6, catalog 1, image arch 1, menu 1, published/review entry 3, new-screen/fullscreen save 2, parts 1, typography 1, responsive import/save 1, save-size 6, atomic store 2, units 1, workspace-store 17입니다. 본체가 허용된 fixture 범위에서 통합 suite를 다시 실행해야 합니다. 이 실행을 제품 회귀 통과로 세지 않습니다.

## 남은 실제 검수

이 하위는 browser/server를 열거나 조작하지 않았습니다. 실제 1440/430 CSS/이미지 404/넘침, native touch, BFCache browser 복귀, scaled stage scrollWidth, 원래 샘플 동일성/렌더 수는 본체의 통합 화면 QA 대상입니다. 측정하지 않은 속도 개선 배수는 주장하지 않습니다. source/저장 JSON 변경, 저장·미저장 상세 editor 계약 검수도 본체가 담당합니다.
