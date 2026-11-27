# 배후 UI 레이어 일시 숨김 구현 계획

> 실행: executing-plans의 순차 구현·TDD·실화면 검수. 하위 담당은 크레딧 오류로 중단되어 본체가 이어갑니다.

**Goal:** 감옥/보석금 화면이 열릴 때 기존 보드 그림은 유지하고 선택한 HUD·이벤트 UI만 숨겼다가 닫으면 복원합니다.
**Architecture:** 모달 presentation.hideBaseElements에 안정 ID 배열을 저장합니다. 기존 renderLayout의 DOM을 유지하며 visibility만 적용하고, 소비자/상세 편집/동작 시험/연출 시연이 같은 규칙을 읽습니다. 기본값은 빈 목록입니다.
**Tech Stack:** 기존 ES modules/DOM/Node test. 새 패키지 없음.
**Spec:** 현중의 원본과 동일한 UI·부모자식·표시/입력 분리·실제로 드러난 최소 기능 보완 요청, 지정 감옥 영상 MGV01의 HUD가 사라지는 관찰과 보석금 후속 화면입니다. 구현 방식과 숫자는 단이 제안입니다.

## 선택과 범위

배경 캡처를 추가로 덮는 방식은 기존 사용자 요구에 맞지 않습니다. 엔진에 Main 이름/ID를 하드코딩하지 않고 모달마다 숨길 화면직속 레이어를 UI에서 선택합니다. 원본 3D와 실제 감옥 판정/재화 차감은 구현하지 않습니다. 빈 목록인 기존 모든 프로젝트는 같은 표시를 유지합니다.

## 파일 책임

- units.mjs: 선택 목록 형식·ID/중복·최대400 검사.
- overlay-runtime.mjs: 활성 오버레이의 숨김 목록을 합쳐 반환.
- layout-view.mjs: 숨긴 DOM을 제거하지 않고 visibility를 적용·복원, 하위 재귀 전달.
- consumer.mjs/main.mjs: 실행/편집/시연에 같은 목록 적용. 공통 연출에서 현재 기준 페이지의 화면직속 레이어 체크.
- Grapes는 단독 modal 보드이므로 배후 UI가 없고 presentation roundtrip을 보존합니다.
- 기존 control-visual/overlay-runtime 및 신규 overlay-base-visibility 테스트.

## 실행

- [ ] RED: 잘못된 목록 수락·기본/중첩 합집합 누락·DOM/scroll 보존·소비자 open/close 복원 실패를 재현.
- [ ] GREEN: 최소 옵션/렌더/공통 UI 저장 연결. 기존5개 모듈만 수정.
- [ ] 관련 시험 → 전체 npm test. 이전502를 새 결과로 반복하지 않음.
- [ ] native 공통 연출에서 Jail/Bail 각각14개 Main UI만 선택하고 Slot_3D는 유지, 저장/재열기.
- [ ] 실제 no-dim/14숨김/scene유지/close복원/390430/메인 기존입구 회귀/캡처.
- [ ] guide.24·기획/보고/STATUS·영상 HTML 진행 기록 갱신.

## 검토 집중

기존 빈 목록·다중 overlay 합집합·닫힌 뒤 DOM/scroll/선택 보존·편집기 draft와 실제 저장 구분·다른 기준 페이지에 없는 ID 무시·원본/다른 프로젝트 불변을 봅니다. UI root에 Graphify 지도는 없으므로 좁힌 import와 최신 원본으로 영향 범위를 확인했습니다. 기존 모듈 간 import/export 기호 변경은 보고에 남깁니다.

## 운영 경계

7018만,7007제외·원본/기존설계 보존·native 설계 편집·JSON외부조립0·새 예약/서버/빌드/패키지 없음·보호파일/2차 카피바라고 소스 무수정. 코드/설계 버전은 제안(검수 대기)이며 최종 사용자 승인 없음.
