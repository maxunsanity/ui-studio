# 기본 캔버스 확대와 부모·자식 개별 편집

작성자: codex(단이) 하위 작업 · 2026-11-16 13:28 KST · 제안(검수 대기)

## 지시와 범위
대표 본체 배정: 기본 전체 캔버스에서 유용한 확대/축소와 부모·자식 각 레이어의 개별 선택·편집을 제공한다. 원본 설계, stable ID, parentId, 연결과 미저장 이동 보호를 유지한다. 브라우저 실검수·공용 STATUS·총괄 보고는 대표 본체 담당이다.

## 읽은 원본
- 독립 루트 AGENTS.md·README.md·docs/collaboration/README.md와 guide/의 AI_GUIDE·USER_GUIDE·TOOL_SPEC·ARCHITECTURE·EXISTING_GAME·PROGRESS.
- grapes-pilot.html/mjs·canvas.css·grapes-bridge.mjs·grapes-drag.mjs·layout-view.mjs·styles.css·controls.mjs·responsive-layout.mjs의 관련 계약, grapes 관련 시험 및 responsive-editor.test.mjs.
- 내장 GrapesJS 0.23.9 vendor의 setZoom/setCoords/updateFramesArea/onWheel·iframe 이벤트 전달 구현을 직접 확인했다. 외부 패키지·인터넷 자료를 사용하지 않았다.
- 이 독립 루트에 graphify-out/graph.json이 없어 작은 지정 소스 범위는 직접 검색했다. 케이팝 지도를 독립 도구의 최신 지도로 사용하지 않았다.

## 원인과 변경
1. 원래 확대 드롭다운은 좌표 보정 없이 setZoom만 호출했고, infiniteCanvas 기본값이 false여서 휠 확대가 비활성이었다. grapes-bridge.mjs:4의 zoomGrapesViewport는 Grapes의 뷰포트 중심 scale/translation 계약에 맞춰 지정 지점의 논리 좌표를 고정한다. grapes-pilot.mjs:127에서 드롭다운·±·Ctrl/⌘휠을 연결하고 10~400%로 한정했다. iframe 전달 이벤트는 CSS 좌표를 외부 캔버스 좌표로 변환한다. vendor의 iframe wheel 전달이 passive=true인 원인을 추가 확인했으므로 grapes-pilot.mjs:150의 iframe document capture passive:false에서 Ctrl/⌘휠만 먼저 처리한다. 일반 휠·브라우저의 다른 확대 키보드 단축키는 가로채지 않는다. 프레임 변경 시 연결을 옮기고 destroy에서 해제한다.
2. 공용 styles.css:2350의 frame pointer-events:none이 기본 캔버스에도 적용됐다. grapes-pilot.mjs:68에 편집 전용 CSS를 넣어 실제 설계 부품은 각각 선택하고 장식/네이티브 컨트롤은 hit-test 대상에서 뺐다. 기존 단계 재열기에서도 다시 적용한다. 공용 styles.css와 소비 미리보기는 수정하지 않았다.
3. 기존 ux-part 제약 배치 분기는 nearest data-element 확인 없이 부모를 선택할 수 있었다. grapes-pilot.mjs:48에서 각 mousedown의 가장 가까운 실제 부품만 선택·전파 차단하고, 수동 % 편집이 가능한 경우에만 기존 startPartDrag를 호출한다. 앵커·여백·안전 영역·자동배치 제한은 유지한다.
4. grapes-pilot.mjs:246의 선택 속성에 조상 경로와 직속 자식 버튼을 표시한다. 도형을 자식이 가려도 부모/자식을 각각 선택해 기존 이름·글자·설명·위치·크기 traits로 편집한다. 선택은 모델/부모 관계를 재작성하지 않는다.
5. grapes-pilot.mjs:266에 #unit-guide 디자인 가이드 버튼을 대표 본체의 openDesignGuide API로 연결했다. 현재 design()을 snapshot으로 전달하고 같은 화면의 부품만 선택한다. onSelect null은 무시하고, onEdit는 해당 ID를 선택한 뒤 기존 leaveForDetail의 미저장 이동 보호로 연결한다. 가이드 생성기와 viewer는 대표 본체/다른 배정 담당 소스이며 이 하위 작업에서 수정하지 않았다.

## 수정 파일
- src/tools/uxStudio/grapes-pilot.mjs
- src/tools/uxStudio/grapes-pilot.html
- src/tools/uxStudio/canvas.css
- src/tools/uxStudio/grapes-bridge.mjs
- tests/ux-studio/grapes-individual.test.mjs (신규)
- tests/ux-studio/grapes-fit.test.mjs
- tests/ux-studio/responsive-editor.test.mjs

## 확인
- 신규 확대 수학·제약 부모 선택 재현 시험은 수정 전 2건 실패, 수정 후 2건 통과했다.
- node --test tests/ux-studio/grapes-individual.test.mjs tests/ux-studio/grapes-fit.test.mjs: 5/5 통과. 중심·포인터 역변환, 범위 제한, 제약 부모가 자식 선택을 가로채지 않음, iframe/외부 wheel 좌표, 조상·자식 경로 버튼의 개별 모델 선택을 검사했다.
- 최종 관련 명령: node --test tests/ux-studio/grapes-individual.test.mjs tests/ux-studio/grapes-fit.test.mjs tests/ux-studio/grapes-save-guard.test.mjs tests/ux-studio/grapes-selection.test.mjs tests/ux-studio/responsive-editor.test.mjs → 18/18 통과, 실패 0. 별도 로그 canvas-direct-edit-targeted-tests.log. 가이드 버튼 연결도 RED(미연결)→GREEN을 확인했다. iframe 직접 이벤트 분기도 수정 전 좌표 -100≠150 실패→수정 후 통과를 확인했다.
- 관련 responsive-editor 포함 실행: 11/11 통과(추가 wheel/경로 시험을 넣기 전 실행).
- npm test: 당시 전체 308/308 통과, 실패 0. 로그는 _작업/codex/ux-studio/canvas-direct-edit-tests.log. 이후 wheel/경로/가이드 연결 3건을 추가했으므로 마지막 전체 수는 대표 본체 최종 실행을 따른다. 과거 302·220과 합산하지 않는다.
- node --check grapes-pilot.mjs 및 grapes-bridge.mjs 통과.
- 기존 전체 시험에서 VM fixture가 실제 DOM의 button/target/getEl/Canvas APIs를 생략한 2건이 실패했고, fixture 입력과 확대 호출 범위를 실제 계약에 맞춘 뒤 위 전체 시험이 통과했다. 실패를 제품 무결성 문제로 숨기거나 기존 시험 수와 합산하지 않았다.

## 미확인과 손대지 않은 것
이 하위 작업은 브라우저를 사용하지 않았다. 1440·430px 실제 클릭/휠/드래그·저장/재열기·이미지404·넘침·캡처·미리보기 회귀는 대표 본체가 별도로 확인해야 한다. native control은 layout-view.mjs가 편집 모드로 붙여 비활성화하고 DOM 변환에서 런타임 이벤트 리스너가 복사되지 않음을 소스로 확인했으며, 실제 입력 회귀는 미확인이다.

샘플 ux-902404d6 r4·원본 r14·정식 제작 ux-6fcb3bd5 r4를 수정하지 않았다. 패키지·서버·빌드·감시·예약·다른 프로젝트·보호 파일·공용 STATUS·보고는 변경하지 않았다. 저장·미저장 이동 보호·부모 ID 검증은 기존 코드를 재사용했다. 기존 상세 편집 링크는 유지한다.

## 백업
변경 전 원본: docs/planning/_backup/20261116_단이/1319_canvas_individual/ 아래 src/tools/uxStudio/ 4파일과 tests/ux-studio/ 기존 2파일. 신규 시험은 새 파일이다.

## 다음
디자인 가이드 모듈 API 연결을 마쳤다. 대표 본체의 기본 캔버스 실검수와 마지막 전체 시험이 남았다. 최종 결정은 현중이며 자동 승인/제작 단계 통과로 표시하지 않는다. 커밋 없음(이 루트는 Git 저장소가 아님).

## 추가 직접 요청 · 레이어 행 선택과 패널 폭 · 2026-11-16 13:38 KST

사용자 추가 요청(대표 본체 전달): HUD_Top/Slot_3D 레이어 메뉴가 잘 눌리지 않고 선택 자체가 어렵다. 구분창 크기도 조절할 수 없어 불편하다.

### 확인한 원인·경계
- 기본 캔버스는 canvas.css의 210/중앙/290 고정 3열이며 분리선·폭 변경 처리 자체가 없었다. 기존 main.mjs 상세 편집은 pointer capture/폭 clamp 패턴이 있어 읽고 해당 패턴만 기본 캔버스에 적용했다. main.mjs·workspace.mjs는 수정하지 않았다.
- GrapesJS 0.23.9는 [data-toggle-select] 행과 별도 [data-toggle-open] 화살표를 원래 제공한다. 과거 모든 행이 선택되지 않는 제품 버그로 단정하지 않았다. 대표 본체의 실제 1440×900 관찰에서는 HUD_Top 이름 위치의 hit target이 정확했고 가림은 없었으며, 기존 행 높이는 25.67px·폭181px이었다. vendor의 화살표는 15px이며 고정 max-width 이름과 width:100% 좌측 영역이 우측 count와 함께 배치된다. 이 조건을 근거로 클릭 영역과 exact 모델 연결을 보강했다. 하위 작업자가 직접 브라우저를 실행한 결과는 아니다.

### 변경
- canvas-layers.mjs:2: 기존 Grapes LayerManager 렌더는 유지하고 onRender에서 각 실제 행 DOM을 해당 component 모델에 WeakMap으로 연결한다. 부모·자식의 행 클릭/Enter/Space는 그 행 모델 하나를 정확히 선택한다. 화살표는 해당 부모의 펼침만 바꾸고 선택은 유지한다. visibility/현재 이름 편집 입력은 기존 처리에 남긴다. 모델·stable ID·부모 관계를 재생성하지 않는다.
- grapes-pilot.mjs:51: LayerManager onRender/선택 상태 동기화와 해제를 연결하고 sortable:false를 명시한다. 이 캔버스의 원래 부품은 draggable:false이며 부모 변경은 저장 검증이 거부한다. 이를 행 정렬 드래그로 우회하지 않는다.
- canvas.css:3: 행 최소36px·화살표24px·이름 flex 축소·우측 count 자리 유지·키보드 focus/선택 표시를 추가한다. 원래 25.67px/15px보다 넓은 hit 영역을 제공한다.
- canvas-panels.mjs:3: 좌160/우200px 최소, 각 전체 폭45% 최대, 8px 분리선 두 개와 중앙260px을 보존한다. 변경 중인 패널부터 제한해 반대 패널 폭을 우선 보존한다.
- canvas-panels.mjs:14: pointer capture로 iframe 위에서도 분리선 드래그를 유지한다. 방향키16px·Shift64px·Home/End, Esc/pointercancel 복구와 이벤트 해제를 제공한다. aria-valuenow/min/max를 실제 적용 폭으로 갱신한다. 모바일<=760px에서는 분리선을 숨기고 기존 세로 스택을 유지한다.
- grapes-pilot.html:37·39: 좌/우 폭 조절 role=separator·tabindex=0을 추가한다. grapes-pilot.mjs:16의 별도 scoped tool localStorage에 폭만 보관하며 설계 문서·revision·dirty 저장 경로에 넣지 않는다. 저장소 접근이 거부되면 현재 창 안에서 폭 조절은 계속 가능하다.

### 이번 검증
- 신규 canvas-panels 2건과 canvas-layers 1건은 구현 전 실패→구현 후 통과를 확인했다.
- node --test tests/ux-studio/canvas-layers.test.mjs tests/ux-studio/canvas-panels.test.mjs tests/ux-studio/grapes-fit.test.mjs tests/ux-studio/grapes-individual.test.mjs tests/ux-studio/grapes-selection.test.mjs tests/ux-studio/grapes-save-guard.test.mjs → 13/13 통과, 실패0.
- 로그: _작업/codex/ux-studio/canvas-layers-panels-tests.log. 이전 전체308/관련18과 합산하지 않는다. 마지막 전체 시험은 대표 본체가 실행한다.
- node --check grapes-pilot.mjs·canvas-layers.mjs·canvas-panels.mjs 통과.
- 하위 작업은 브라우저·서버 재시작·빌드·설계 저장·원본/샘플 편집·공용 STATUS를 수행하지 않았다. 실제 클릭·화살표·분리선·모바일·dirty 보존 검수는 대표 본체 담당이다.

### 추가 백업·파일·다음
- 변경 전 백업: docs/planning/_backup/20261116_단이/1334_canvas_layers_panels/ (grapes-pilot.html/mjs·canvas.css).
- 신규 소스: canvas-layers.mjs·canvas-panels.mjs. 신규 시험: canvas-layers.test.mjs·canvas-panels.test.mjs.
- 이 독립 프로젝트의 기존 코드지도는 제공되지 않았으므로 import 연결 추가를 최신 지도에 반영했다고 주장하지 않는다. 대표 본체 보고에서 지도 갱신 필요 여부를 구분한다.
- 브라우저 실검수와 마지막 전체 시험 뒤 제안(검수 대기)로 전달한다. 커밋 없음.

## 최신 직접 정정 · 가이드에서 실제 편집 · 2026-11-16 13:47 KST

사용자 최신 정정(대표 본체 전달): 디자인 가이드는 읽기 전용이 아니라 선 조절로 실제 부품을 바꾸고, 이미지를 넣고 빼는 편집 기능이어야 한다. 위 초기 단계의 읽기 전용·상세 이동 전용 설명은 당시 구현 이력이며 이 절이 현재 연결 범위에 우선한다.

### 편집 연결
- 대표 본체 design-guide-edit.mjs의 applyDesignGuideChange/importGuideImage를 직접 읽고 연결했다. 부모 px rect는 기존 %/safe area/inset/rectTransform을 유지하며 자동 배치 자식은 helper가 거부한다. 이미지 업로드는 기존 workspace 자원 계약을 사용한다. 이 하위 작업은 해당 helper나 viewer 소스를 수정하지 않았다.
- grapes-pilot.mjs:57·60: uxImage/uxFontSize/uxGuideGeometry를 undo 추적 속성으로 추가했다. false는 원본 유지 sentinel이며 null 이미지 제거와 구분한다. 처음 열거나 Undo로 원래 상태로 돌아왔을 때 원본의 생략 필드·이미지·글꼴을 덮어쓰지 않는다.
- grapes-pilot.mjs:292: 가이드 onChange는 현재 design()을 helper에 전달해 먼저 검증한 뒤 명시 elementId의 실제 모델에 한 번 set한다. rect는 기존 % 속성과 별도 제약 snapshot을 함께 갱신하고, image/text는 해당 속성만 변경한다. source 전체를 새 설계로 덮어쓰지 않아 다른 미저장 수정과 ID/부모/연결이 유지된다. onSelect와 비동기 업로드 결과의 적용 ID를 분리하며, 업로드는 자원 결과만 반환하고 실제 적용은 해당 ID의 onChange가 담당한다.
- grapes-pilot.mjs:239 및 grapes-bridge.mjs:24·41·42: design() 직렬화가 guideGeometry/inset/rectTransform·image·fontSize를 검증된 설계에 반영한다. ID/parentId 등 임의 추가 geometry 키는 거부한다. 이미지를 실제 추가할 때만 legacy 스키마를 최소2로 올리며 null은 image 필드를 제거한다. 기존 수동 % 배치 제한은 그대로 유지한다.
- grapes-pilot.mjs:240: live design의 해당 부품을 renderLayout로 다시 만든 뒤 style/classes와 장식만 Undo skip으로 갱신한다. 실제 uxId를 가진 자식 모델은 교체하지 않는다. attachControls(...mode:'edit')로 네이티브 컨트롤 비활성 계약을 유지한다. 이미지 제거는 원본 자원 파일 삭제가 아니다.
- 한 onChange는 모델 set 1회이며 vendor Undo의 같은 동기 작업 묶음(magicFusionIndex)을 사용한다. 실제 드래그 1회당 undo 1회는 viewer가 pointer release마다 onChange를 1회 내보내는 계약과 대표 본체 실화면 검수를 함께 확인해야 한다. 이 하위 작업의 모델 테스트를 실제 브라우저 Undo 검수로 표현하지 않는다.

### 이번 시험·백업·미확인
- 신규 bridge/모델 연결 시험4건은 기존 코드에서 이미지/제약/스키마/버튼 편집 누락 실패→구현 후 통과를 확인했다. 장식 갱신이 실제 자식 모델을 보존하는 회귀1건도 추가했다.
- node --test tests/ux-studio/grapes-guide-edits.test.mjs tests/ux-studio/grapes-individual.test.mjs tests/ux-studio/grapes-bridge.test.mjs tests/ux-studio/responsive-editor.test.mjs tests/ux-studio/canvas-layers.test.mjs tests/ux-studio/canvas-panels.test.mjs tests/ux-studio/grapes-save-guard.test.mjs → 33/33 통과, 실패0.
- 로그: _작업/codex/ux-studio/canvas-guide-edit-tests.log. node --check grapes-pilot.mjs·grapes-bridge.mjs 통과. 이전 13/18/308과 합산하지 않는다. 전체 최종 시험은 대표 본체 담당이다.
- 백업: docs/planning/_backup/20261116_단이/1343_canvas_guide_edit/ (당시 grapes-pilot.mjs·grapes-bridge.mjs·grapes-individual.test.mjs). 기존 1319·1334 백업도 유지했다.
- 신규 시험: tests/ux-studio/grapes-guide-edits.test.mjs. 초기 문서의 소스 줄 번호는 당시 위치이며 현재 편집 연결 근거는 이 절의 줄 번호를 따른다.
- 이 하위 작업에서 브라우저·가이드 선 드래그·실제 image upload·이미지 제거·Undo·사본 저장/재열기는 실행하지 않았다. 대표 본체가 실제 동작/캡처를 별도로 검수한다. 원본 설계·샘플·다른 프로젝트·서버·빌드·공용 STATUS는 수정하지 않았다. 결과는 제안(검수 대기)이다.
