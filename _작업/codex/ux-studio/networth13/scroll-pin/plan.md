# 세로 스크롤 핀 독립 준비안

작성: codex(단이), 2026-11-17 KST. 상태: **독립 모듈 GREEN / 제품 미연결 / 제안(검수 대기)**.

## 범위와 읽은 원본

요청은 카드의 원래 콘텐츠 위치를 유지하면서 스크롤하면 세로 임계점에 붙이고, 역방향 스크롤에서는 원래 위치로 돌려놓는 선택적 범용 기능이다. 화면 상단에 처음부터 붙어 있는 편집기 헤더와 다르다. 이번 쓰기는 이 폴더의 `plan.md`, `scroll-pin.mjs`, `scroll-pin.test.mjs` 세 파일뿐이다. 제품 소스/import, 외부 저장 설계 JSON, 공통 가이드/STATUS/보고, 패키지, 서버, 브라우저는 변경·제어하지 않았다.

관련 원본을 직접 확인했다.

- `src/tools/uxStudio/responsive-layout.mjs`: 전체. `overflow`의 네이티브 X/Y 대응, 논리 크기/앵커/자동 배치 검증과 스타일 생성.
- `src/tools/uxStudio/responsive-inspector.mjs`: 전체. 복사본 편집·검증 후 명시적 v4 승격, 기본값 선택 때 속성 삭제.
- `src/tools/uxStudio/layout-view.mjs`: 렌더러와 재귀/루트 후처리. 매 paint의 `node.style.cssText`가 원래 top을 다시 칠한다. 두 소비 경로가 공유한다.
- `src/tools/uxStudio/model.mjs`: 공개 validator, 부모 검증과 v4 기능 gate. 기존 문서는 새 속성을 묵시적으로 활성화하면 안 된다.
- `src/tools/uxStudio/consumer.mjs`: 전체. page/overlay의 renderLayout 호출, overlay 제거와 최종 dispose.
- `src/tools/uxStudio/button-state.mjs`: scope와 pressFeedback 제어. 버튼 앞면 이동은 `style.translate`를 사용한다.
- `src/tools/uxStudio/editor.mjs`: 수동 조작은 원본 모델을 복제해 이동/리사이즈한다.
- `main.mjs`의 renderElements/renderPreview·화면 교체 경로, `grapes-pilot.mjs`의 renderLayout 사용 위치, `preview.mjs`의 균일 fit/resize, `styles.css`의 absolute UI·border-box 규칙.
- `tests/ux-studio/responsive-layout.test.mjs`, `responsive-editor.test.mjs`, `button-press-depth.test.mjs`; 독립 루트 AGENTS와 가이드의 응답형/스크롤 관련 절.

공용 지시함/별도 제작 프롬프트는 조회하지 않았다. 실제 원본 영상·MGV03-S02 D/E/F를 이 하위 작업에서 다시 열지 않았으며, 원래 위치 671/화면 고정점 약219는 본체가 전달한 관찰이고 아래 시험의 독립 숫자 fixture다.

## 선택한 방법

1. **원래 top에 보정량 추가(채택)**: 현재 absolute DOM과 부모/입력 영역을 유지한다. `calc(원래 top + 보정 px)`만 쓰므로 버튼의 translate/transform과 충돌하지 않는다. 짧은 계산과 scope 해제만 필요하다.
2. 네이티브 `position: sticky`: 현재 absolute 부품에는 바로 적용되지 않는다. 레이아웃/wrapper·재귀·선택/입력 계약을 바꿔야 하므로 이번 최소 범위에 맞지 않는다.
3. 요소를 화면 직속 fixed overlay로 옮기기: 부모 클리핑·입력·형제 순서·슬롯 계층을 바꾸므로 제외한다.

새 모듈은 기존 엔진 의존성/import가 없다. 제품에서 아직 읽지 않으므로 HMR을 유발하는 연결은 없다.

## 제안 저장 계약

```json
{"scrollPin":{"top":219}}
```

- **요소당 선택 속성** `scrollPin` 하나. 없으면 기존 동작을 완전히 유지한다. OFF는 `delete element.scrollPin`이며 `false`, `null`, 빈 객체, 기본 0을 자동 저장하지 않는다.
- `top`은 **가장 가까운 세로 스크롤포트의 안쪽 위에서 아래로 잰 논리 CSS px**이며 유한 숫자 `0..10000`. `0`도 유효하다. 추가 키, 문자열, 음수, NaN/Infinity는 거절한다.
- 기존 v4 응답형 기능으로 분류하고 v1/2/3에서는 속성이 있을 때 거절한다. UI에서 명시적으로 켰을 때만 현행 방식대로 logicalSize를 기록하고 v4로 승격한다. 열기/보기/기본값 OFF만으로 원본을 바꾸지 않는다. schemaVersion 5는 필요하지 않다.
- 부모/스크롤포트 ID·런타임 보정량은 저장하지 않는다. 현재 DOM 계층과 overflow로 가장 가까운 세로 영역을 찾는다. 고정점은 속성값이고 콘텐츠 원위치/부모 끝은 기기별 현재 배치로 다시 구한다.
- 공개 화면 validator에는 `validateScrollPin(e.scrollPin)`과 구조 gate를 연결한다. 설정된 요소는 부모가 있고, 조상에 명시 `scroll-y`/`scroll-both` 또는 overflow 미지정 `kind:list`의 기존 세로 스크롤이 있어야 한다. `scroll-x`/`clip`/`visible`은 세로 소유자가 아니다. 부모 이동/삭제/overflow 편집 뒤에도 화면 전체를 검증한다. 저장된 잘못된 배치를 조용히 새 화면에 고정하지 않는다.

**화면 좌표와 포트 좌표를 구분한다.** 원본 화면 Y219가 목표여도 제작한 Viewport가 화면 Y219에서 시작한다면 입력 top은 0이다. Viewport가 Y0이면 top은 219다. 본체가 실제 조립한 Viewport 위치/안쪽 border·safe area를 보고 변환해야 하며 219를 엔진 상수로 쓰지 않는다.

## 계산·동작

포트 콘텐츠 좌표의 원래 위 `N`, 요소 높이 `H`, 부모 안쪽 아래 `B`, 세로 스크롤량 `S`, 설정 top `T`로 보정량을 구한다.

```text
offset = max(0, min(max(0, S) + T - N, B - H - N))
```

N671/H90/B1700/T219 시험에서 S0→200→452까지 보정0, S500이면 보정48·화면 Y219, S800이면 보정348이다. S200으로 복귀하면 원래 top으로 돌아온다. B1000에서는 보정을239까지로 제한해 카드 아래가 부모 끝을 넘지 않는다. 부모가 원래 카드보다 작으면 0으로 유지하고 위로 밀지 않는다.

- 가로 스크롤은 그대로 따라간다. left/width/scrollLeft를 보정하지 않는다.
- 2중 스크롤은 가장 가까운 세로 포트를 따른다. 바깥 포트가 움직이면 안쪽 포트 전체가 함께 움직이고, 핀이 바깥 화면에 떠 있지 않는다. 세로 포트 사이에 가로 전용 포트가 있어도 건너뛴다.
- 계산은 resolved CSS top/offsetParent의 논리 레이아웃 좌표와 scrollTop으로 한다. `getBoundingClientRect`를 쓰지 않아 캔버스/device 균일 scale 및 버튼 누름 transform이 기초 좌표에 섞이지 않는다. fractional top도 유지한다.
- 직속 부모가 포트면 `scrollHeight`를 콘텐츠 끝으로 쓰고, 중간 콘텐츠 부모면 `clientTop+clientHeight`를 경계로 쓴다. padding/border 안쪽을 기준으로 한다.
- 노드의 transform/translate/z-index/입력 역할/DOM 부모는 건드리지 않는다. 위치 이동만으로 위에 있어야 하는 레이어 순서가 자동 결정되지는 않는다. 제작자가 기존 레이어 순서를 검수한다.
- 포트 scroll·window resize·ResizeObserver에서 다시 계산한다. 동적 콘텐츠·기기 크기 변화는 현재 레이아웃을 읽는다. CSS transform scale만 바뀔 때는 논리 좌표가 같으므로 결과는 그대로다.
- renderLayout이 원본 style을 재작성한 다음 재attach한다. 이전 scope를 해제할 때 자신이 마지막으로 쓴 top일 때만 원래 top을 복구해 새 렌더 값을 덮지 않는다. 관찰자/이벤트를 모두 해제한다.

## 다음 승인 범위의 최소 제품 연결 순서

현재 단계는 연결 **계획**이다. 본체의 추가 배정 전에는 아래 파일을 수정하지 않는다.

1. 독립 모듈을 `src/tools/uxStudio/scroll-pin.mjs`로 채택. 이 폴더 원본은 보존한다. 동작 테스트를 `tests/ux-studio/scroll-pin.test.mjs`로 옮기고 import 위치만 맞춘다.
2. `responsive-layout.mjs`의 `validateResponsiveScreen`에서 optional 값과 세로 부모 구조를 검증한다. `responsiveStyles`는 핀을 CSS sticky로 바꾸지 않는다. 모델 resolveRect는 원래 정적 geometry 그대로 유지한다.
3. `model.mjs`의 기존 v4 기능 gate에 `e.scrollPin !== undefined`를 추가한다. 공개 import/save에 같은 검증이 걸리도록 한다. 허용·거절 fixture와 저장/재열기·원문 immutable 시험이 필요하다.
4. `responsive-inspector.mjs`의 기존 속성 편집에 `scrollPin.mode`(없음/세로 고정)·`scrollPin.top`(논리 px)을 추가한다. ON은 사용자가 입력한 값으로만 만든다. 새 설정의 기본 top 제안은 현재 포트 안의 원하는 멈춤점을 명시해서 보여주고, 저장 전 입력을 검증한다. OFF/no-op는 v4로 승격하지 않는다. 기존 data-responsive-field/Undo 원자 편집을 이용한다.
5. `layout-view.mjs` 루트 `parentId === null` 후처리에서 모든 자식과 버튼 상태를 칠한 **뒤** `attachScrollPins(container, screen)` 호출. 이 공유 연결 한 곳으로 상세 편집/동작 시험과 consumer page/overlay를 함께 적용한다. Grapes renderer의 실제 renderLayout 재사용 범위와 제거 경로는 별도로 확인한다.
6. `consumer.mjs`: 지우는 overlay panel과 `dispose()`의 page/모든 panel에 `disposeScrollPins` 호출. 화면 변경/updateDesign의 같은 page root는 다음 renderLayout의 attach에서 이전 scope를 정리한다.
7. 편집기 `main.mjs`: canvas 교체/모드 전환/모달 데모 제거/pagehide 전에 기존 preview-screen/preview-overlay scope를 해제한다. 재사용 canvas의 같은 root는 재attach를 사용한다. 슬롯/노드 제거·스크린 전환 후 이벤트가 남지 않는 통합 시험을 추가한다.
8. 상세 편집의 이동/리사이즈는 저장 원본 geometry를 계속 사용한다. 눈에 보이는 핀 오프셋을 모델에 저장하지 않는다. 드래그 중 시각 보정 재적용/Moveable 선택 테두리는 실제 편집 화면에서 확인한다. 기존 editor 로직을 임의로 확장하거나 핀을 켰다는 이유로 geometry를 자동 변경하지 않는다.

제품 연결 후에는 기존 responsive/consumer/button press 시험과 새 공개 저장/에디터 필드/양쪽 renderer·cleanup 시험, 최종 전체 npm test를 본체가 실행한다. 현재 모듈은 제품 검사기가 사용하는 저장 계약에 아직 연결되지 않았다.

## 이번 시험과 미확인

실행 명령:

```sh
node --test _작업/codex/ux-studio/networth13/scroll-pin/scroll-pin.test.mjs
```

- **RED**: 모듈을 만들기 전 동일 명령, tests9/pass0/fail9/exit1. 미구현 export가 함수가 아니라는 assertion으로 실패했다. 문법 오류나 패키지 누락으로 얻은 RED가 아니다.
- **GREEN**: 모듈 작성 후 동일 명령, tests9/pass9/fail0/cancelled0/skipped0/exit0.
- 범위: optional 값 검증, 임계점 이전/이후/역복귀, 부모 끝, 작은 부모, transform/translate 무충돌, 렌더 top 재작성 후 재attach, 가장 가까운 세로 포트/중간 가로 포트/바깥 scroll, fractional 논리값/scale/resize, 직속 스크롤 자식의 콘텐츠 끝, 속성 미지정 no-op/OFF 복원, dispose 후 이벤트/관찰자 비활성.
- DOM 시험은 Node EventTarget과 논리 레이아웃 경계 double을 사용한다. 브라우저 CSS/native 스크롤 자체를 검증한 것은 아니다.
- 이번 제품 npm test/HTTP/native UI/저장·재열기/원본 D/E/F 실제 비교는 **미실행**이다. 제품 소스는 미연결이고 하위 쓰기를 지정 세 파일로 한정해, 기존 전체 시험이 만드는 다른 scratch/저장 fixture도 이 단계에서 만들지 않았다.
- 실제 두 renderer의 390×844·430×932와 원래 설계 크기, desktop1440/모바일430에서 스크롤 임계점·부모 끝·가로/2중 scroll·기기 왕복·버튼 누름·창 닫기/재열기·레이어 겹침/overflow/이미지404는 본체 연결 뒤 검수한다.
- current helper는 현 도구의 axis-aligned absolute·border-box·무회전 레이아웃 계약을 따른다. 회전/3D/임의 CSS margin의 별도 엔진 호환은 이번 범위가 아니다. 핀이 있는 조상과 자손을 동시에 지정하는 조합은 별도 시험 전 지원을 주장하지 않는다.

백업: 세 파일은 새 독립 준비물이며 기존 파일을 덮어쓰지 않았다. 별도 정본/설계 변경 백업은 발생하지 않았다. 제품 기능 지원 완료·원본 동등·정책 승인으로 해석하지 않는다.
