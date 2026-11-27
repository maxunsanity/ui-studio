# 개별 유닛 디자인 가이드 뷰 · 하위 작업 보고

- 작성: codex(단이), 2026-11-16 13:30 KST
- 상태: 제안(검수 대기), 본체 통합·실화면 확인 대기
- 범위: 대표 본체가 배정한 `design-guide-view.mjs` 및 전용 시험만 작성. 공용 STATUS·guide·설계 데이터·다른 담당 소스 수정 없음.

## 구현

`src/tools/uxStudio/design-guide-view.mjs` 신규:

- `openDesignGuide({document, screenId, elementId, workspaceId, size, onSelect, onEdit})`는 현재 문서의 구조화 복사본만 읽고 native dialog를 반환한다(20행). 저장·문서 변경·게임 이벤트 실행 경로 없음.
- 화면/부모 breadcrumb, 직접 자식 선택, 선택 부품+직접 자식의 부모 기준 px·부모 %·화면 %·상우하좌 여백·현재 설계 글자 설정 명세(90행).
- 실제 기존 `renderLayout`을 art/edit 모드로 재사용하고 workspaceId를 전달한다. ancestor shell의 기하를 유지하며 나머지 가지는 표시하지 않는다(156행).
- iframe은 독립 `styles.css`를 사용해 전체 캔버스의 외부 CSS와 격리한다. SVG 빨간 점선은 부모·자식 경계와 A/B/…/Z/AA 치수를 표시한다. 실제 논리 px 계산값은 그대로 쓰고 표시만 소수 2자리까지 반올림한다(125·178행).
- 기본 맞춤은 선택한 유닛 subtree와 redline 치수 범위다. 부모 전체를 강제 포함하지 않는다. 부모 전체는 breadcrumb 선택으로 확인한다. +/−, 유닛 맞춤, 큰 유닛 스크롤 및 확대율과 무관한 12 CSS px 치수 라벨(170·202행).
- child/표/실제 UI 선택은 해당 stable ID로 재계산하고 `onSelect(id)`를 전달한다. 세부 편집 버튼은 창을 닫아 opener 초점을 복원한 뒤 `onEdit(id)`를 호출한다. 화면 루트는 세부 편집 비활성화(74·82행).
- 이름·본문·SVG 텍스트는 textContent만 사용한다. 원본 스크린샷 폰트 미확인, 글자 가시 경계와 배치 사각형의 차이를 명시한다(70행). Escape/닫기 시 observer와 dialog 정리, 초점 복귀(223행).

## 읽은 원본

- 독립 루트 AGENTS.md, README.md, docs/collaboration/README.md.
- .8 공통 guide/의 AI_GUIDE·USER_GUIDE·TOOL_SPEC·ARCHITECTURE·EXISTING_GAME·PROGRESS 및 index.json.
- manual.mjs, layout-view.mjs, 관련 styles.css, controls.mjs, skins.mjs, menu-state.mjs.
- 대표 본체의 신규 design-guides.mjs 실제 기하 계약.
- 기존 controls.test.mjs의 최소 DOM 경계 시험 패턴.

## 확인

- 선행 시험: 신규 모듈 부재로 2개 실패를 관찰.
- A/B 라벨 수락 기준 추가 후 semantic key 노출로 1개 실패를 관찰하고 A/B 생성으로 보완.
- 최종 `node --check src/tools/uxStudio/design-guide-view.mjs`: exit 0.
- 최종 `node --test tests/ux-studio/design-guide-view.test.mjs`: 2/2 통과, 실패 0.
- 시험은 child 선택→정확한 stable ID 콜백→상세 편집 콜백, 문서 불변, 실제 px/비율/A/B 명세, 위험 문자열의 텍스트 표시, 루트 편집 비활성, Escape와 opener 초점 복귀를 확인한다. iframe 실렌더링은 DOM 모형으로 검사하지 않는다.
- 전체 `npm test` 1회 실행은 fixture `mkdtemp`가 단일 파일 쓰기 권한 밖인 `_작업/codex/ux-studio/*-tests-*`에 쓰려 하여 EPERM 실패했다. 실패 파일군은 assets.test.mjs·baseline.test.mjs·workspace-store.test.mjs 등 파일 저장 fixture이며 전체 통과로 기록하지 않는다. 이후 본체 지시에 따라 전체시험은 반복하지 않았고 최종 본체 실행 결과를 따른다.
- 브라우저·1440/430 화면·이미지404·넘침·스크롤/모달 실제 초점·iframe 렌더 캡처는 이 하위 창에서 수행하지 않음. 대표 본체가 실제 화면 검수한다.

## 보존·남은 확인

- 신규 모듈·시험으로 수정 전 기존 파일 없음. 덮어쓰거나 삭제한 원본 없음.
- 별도 CSS 파일·패키지·서버·빌드·감시·다른 프로젝트·보호 파일·공용 STATUS는 다루지 않음.
- 신규 import/export 연결의 독립 도구 지도 반영 필요 여부는 대표 본체가 확인한다. 이 하위 작업에서 지도를 최신이라고 주장하지 않음.
- 공개 인터페이스와 실제 UI 통합은 대표 본체 범위. 캔버스 CSS와의 격리·유닛 크기별 라벨 겹침은 실제 화면 확인이 필요하다.

## 13:39 KST · 실제 화면 피드백 보정

- 대표 본체가 1440×900에서 실제 iframe 이미지·A~G 표시 성공과 0px 여백 라벨 중첩을 전달했다. 이 하위 창의 직접 브라우저 관찰로 바꾸어 적지 않는다.
- SVG는 정확히 0px인 `kind=padding`만 생략한다. 값표의 0과 원래 문자 인덱스는 보존하며 기준 문구를 뷰어 note에 추가했다. 0인 크기·간격은 이 필터로 숨기지 않는다.
- 모바일 기존 최소 grid 230+140px와 표27%가 남은 flex 높이를 넘으면 영역이 겹칠 가능성이 있었다. 모바일 dialog 전체 스크롤을 허용하고 stage280px·sidebar140px·표180px를 유지한다. 단계별 상세 내용과 표 내부 스크롤은 그대로 접근한다. 실제430×844 확인은 본체 범위다.
- 변경 전 module·전용 시험 백업: `docs/planning/_backup/20261116_단이/1337_unit-guide-view-polish/`.
- 새 여백 필터 시험 1개 실패를 먼저 관찰 후 수정. 최종 `node --check src/tools/uxStudio/design-guide-view.mjs` exit0, 전용 `node --test tests/ux-studio/design-guide-view.test.mjs` 3/3 통과. 전체시험 반복 없음.
- 변경 범위: design-guide-view.mjs·design-guide-view.test.mjs·본 하위 보고만. 다른 소스·공용 기록 수정 없음.

## 13:47 KST · 사용자 직접 정정: 가이드 실제 편집·가독성

읽기 전용이라는 이전 구현 설명은 이 절로 보정한다. 사용자 요청은 가이드를 조절하면 실제 리소스를 조절하고 이미지를 넣고 빼는 실제 편집이다.

- 새 API: `onChange({type,screenId,elementId,...})`는 부모가 검증·undo를 적용한 새 design을 동기로 반환한다. 뷰어는 반환 문서를 복제해 기하와 실제 UI를 다시 그린다. `onChange`가 없으면 읽기 전용이다. 저장·원본 문서 변경·undo의 최종 책임은 부모 통합이다.
- 부모 기준 논리 px x/y/w/h 필드와 적용 버튼. 0보다 큰 크기·유한값을 검증하고, 실제 `isAutoLayoutChild` 계약으로 자동배치 자식의 좌표/크기를 잠근다.
- iframe SVG의 청록색 4변과 가운데 이동 핸들. pointer delta를 당시 zoom으로 나누고 드래그 중에는 SVG ghost/입력 수치만 표시한다. pointerup 1회에만 rect 변경을 전달하고 Escape는 드래그부터 취소한다. 가이드 반영 후 현재 확대율을 유지한다.
- 글자·폰트 크기 적용. 이미지 파일, 프로젝트 경로 적용과 이미지 빼기. `onImportImage({file|path})`의 비동기 결과를 선택 ID·요청 세대로 검증해 다른 부품이나 닫힌 창에 늦게 적용하지 않는다. 오류는 dialog 내부에 표시한다.
- 기본 그림은 선택 부품+직접 자식 경계만 보이고 부모 경계는 숨긴다. 전체 후손 경계 토글과 치수 표시 토글 제공. 치수는 처음 OFF로 그림·청록 편집 핸들을 우선한다. 켜면 대표 8개의 값 라벨을 그림 위/아래 레일에 두고 전체 수치는 별도 명세에 유지한다. 0px padding 생략과 기존 A/B 인덱스 유지.
- renderer의 component-role/selection 배지는 iframe CSS에서 숨긴다. 실제 게임 입력은 기존 편집 모드와 캡처 핸들러로 실행하지 않는다.
- 오른쪽은 선택 이름과 편집 폼을 우선한다. 긴 ID·상세 수치·글자 표는 기본 접힌 `상세 수치·폰트 명세`, 긴 원본 한계 문구는 `측정 기준·원본 확인 범위`로 접는다.
- 모바일은 stage280px·편집 sidebar320px를 유지하고 전체 dialog를 스크롤한다. 접힌 표에 고정180px를 소비하지 않고 펼친 명세만 최대180px 내부 스크롤한다.
- 백업: `docs/planning/_backup/20261116_단이/1340_unit-guide-edit/`의 수정 전 viewer/test.
- 선행 신규 4개 시험 실패를 관찰 후 구현. 최종 문법 검사 exit0, 전용 시험9/9 통과: 부모 px rect 콜백·반환본 갱신·불변 원본, 자동배치 잠금·글자 콜백·오류 표시, 비동기 이미지 선택 취소·제거, 줌 반영 드래그 수학·변 교차 최소 크기, readonly·기본 접기/토글, 파일 이미지 적용·경로 실패 복구 포함.
- 실제 포인터 캡처/iframe drag·이미지·undo·430px 화면 검수는 대표 본체에서 진행한다. 이 하위 시험은 실제 브라우저의 pointer lifecycle 성공을 자칭하지 않는다. 전체 npm test 재실행 없음.
- 다른 소스·guide·설계·공용 STATUS/보고는 수정하지 않았다. 하위 변경은 viewer/test/본 하위 보고뿐이다.

## 13:56 KST · 얇은 다색 선·오른쪽 선 편집·정밀값 보존

- 최신 사용자 정정에 따라 청록/녹색 가이드·고스트 면을 제거했다. 선택 4변은 L파랑/R보라/T주황/B빨강이며 각각1.5px의 보이는 선과 투명12px pointer hitline으로 나눴다. `[data-guide-handle]`은 투명 hitline에 유지한다.
- 가운데 숫자를 덮던 이동 손잡이는 선택 박스 위 바깥의 작은 이동 탭으로 옮겼다. `.dg-host`는 투명, 편집 배경은 중립 체크이며 제품 백판/그림자를 추가하지 않는다. 제품 그림 안의 돈 아이콘 색은 변경하지 않는다.
- 부모 경계는 기본 OFF이고 켰을 때 주황이다. 자식은 같은 문서 stable ID 집합을 기준으로 결정한 서로 다른 선색을 사용한다. 선택·자식 이름과 작은 선 swatch 범례를 오른쪽 위에 둔다.
- 오른쪽 `가이드 선 선택`·`가이드 선 색상`·`가이드 선 위치 px`와 `선 위치 적용` 제공. 한쪽 선 위치를 바꾸면 반대 선을 유지하면서 기존 rect API로 실제 위치/너비/높이를 바꾼다. 반대 선을 넘는 위치는 적용하지 않는다.
- 선 색은 workspace+screen+element ID별 browser localStorage의 편집 표시 preference로 보관하며 제품 이미지/설계·undo 변경 콜백을 호출하지 않는다. 저장 접근 불가/깨진 값은 기본색으로 처리한다.
- XYWH·글자 크기·선 위치는 소수2자리까지 표시한다. 표시 문자열을 건드리지 않은 값은 원래 정밀값으로 적용하며 내부 드래그 기하도 반올림하지 않는다.
- root에 전달한 렌더 확인: `.image-content`는 overflow:hidden/img100%로 이미지 요소 자체를 자른다(styles.css:2364). 반면 글자는 typography 미지정 또는 overflow visible이면 bbox 밖으로 그려질 수 있다(parts.mjs:64-71). `.unit-surface`는 overflow visible이다(styles.css:806). 실제 메뉴 자산·요소 rect·투명여백은 root가 대조하며 이 하위는 layout-view를 수정하지 않았다.
- 백업: `docs/planning/_backup/20261116_단이/1355_unit-guide-lines/`의 viewer/test.
- 신규3개 시험의 실패를 먼저 관찰 후 보완했다. 최종 `node --check` exit0, 전용시험12/12 통과·실패0·경고0. 정밀값 보존, 선 위치 rect 전달, 색상 preference 범위/재열기·문서 무변경, sibling 색 고유성과 순서 독립성을 포함한다.
- 실제 선 색·hitline·이동 탭·메뉴 bbox 화면 검수는 대표 본체가 진행한다. 공용 보고/STATUS 및 다른 소스 수정 없음.
