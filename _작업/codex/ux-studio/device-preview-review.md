# 기기 미리보기 독립 검토 및 승인된 최소 보정

codex(단이), 2026-11-16 17:09 KST. 제안(검수 대기).

## 결과

검토 중 데이터 편집에 영향을 줄 수 있는 두 연결 문제를 확인했고 대표 본체에 즉시 알렸다. 본체의 추가 승인 범위에서 실제 호출 회귀를 보존하고 현재 비율의 사전 검증을 보완했다. 기존 기기 보기 설정 자체가 저장 설계·미저장 편집·선택·Undo를 변경하는 문제는 지정 실행형 시험에서 확인하지 않았다.

## 1. 기기 scale 누락 · 현행 소스에 반영 확인

- 초기 읽기에서 grapes-pilot.mjs ux-part.dragPart가 startPartDrag의 새 scale 인자를 전달하지 않는 것을 확인했다. helper는 default1이라 기기가551→390으로 축소될 때 pointer40px가 약28.3px 실제 이동으로 줄어드는 경로였다.
- 본체의 수정 승인 후 백업 시점에는 `grapes-pilot.mjs:58`에 `{scale:boardPreview(sourceScreenFor(original)).scale}`가 이미 반영되어 있었다. 이 선행 수정은 본 하위가 한 것으로 기록하지 않는다.
- 실제 pilot 등록 코드를 실행하는 회귀를 추가했다. 단순 helper 직접호출이 아니라 view.dragPart→실제 startPartDrag→preview→완료 commit 경로다. 기기 scale0.5와2에서 logical30/20px 이동이 각각 정확히 XY15/20%가 되며 완료 시1회 commit한다.
- 메모리에서만 scale 인자를 제거해 이전 실패를 재현했다: 포인터15/10px, logical부모300×200, 원래XY5/10%에서 누락본10/15%, 현행본15/20%. 프로젝트 소스를 되돌려 재현하지 않았다.

## 2. 다른 비율에서만 음수가 되는 자식 · 사전 거절 보완

- 기준551×984, 가로 기기 미리보기의 논리높이는308.5376px다. stretch부모높이208.5376/그 직속 stretch자식18.5376px인 설계에서 부모높이를180px로 변경하면 자식은 현재 비율에서-10px가 된다.
- 기존 applyDesignGuideChange는 저장 기준 비율의 validateDocument를 통과해 next를 반환하지만, 같은 next를 현재 previewSize로 buildDesignGuide하면 거절했다. pilot은 그 사이 part.set을 이미 호출하므로 뷰어 오류 후 모델과 Undo가 바뀔 수 있었다.
- 본체 승인 후 `grapes-pilot.mjs:334`에 canvasDevicePreview(next의 현재화면,previewSettings) 한 줄을 추가했다. values 작성·part.set 이전에 현재 기기의 모든 하위 요소를 resolve하여 실패를 먼저 거절한다. 모델·저장·schema 정본을 추가하지 않는다.
- 실제 vendored GrapesJS 모델·UndoManager와 실제 pilot onChange를 실행하는 회귀를 먼저 실패로 확인했다. 수정 후 음수 자식 변경은 오류를 내고 uxGuideGeometry=false·design·Undo stack 모두 그대로다. 유효한 부모200px 변경은1건 Undo에 들어가며 Undo1에 원복한다.

## 저장·선택·Undo·좌표·fit 검토

- canvas-device-preview.mjs는 authored logicalSize를 보존하고 기기폭/reference폭의 uniform scale과 변경된 logical height를 계산한다. %와 anchor는 logical viewport에서 재계산하고 고정크기·폰트는 board transform으로 같은 비율로 보인다.
- applyDevicePreview는 현재 design의 화면들을 먼저 검증한 뒤 board style/attribute만 UndoManager.skip 안에서 바꾼다. 파일 설계 변환의 baseDesign은 board의 view style을 데이터로 저장하지 않는다. 브라우저 단계 스냅샷은 view style을 포함할 수 있지만 재열기 때 현재 preview를 다시 적용한다.
- 기기 변경에서 part 모델·선택·수정 필드와 manual zoom을 보존하는 실제 vendor 시험을 확인했다. 기존 board style이 Undo로 돌아와도 undo/redo hook이 현재 기기를 다시 적용한다.
- 가이드는 현재 preview.logical을 size로 전달하고 편집 helper도 같은 size를 사용한다. 새 사전 검증이 다른 비율의 하위 배치까지 보완한다. 논리px와 기기의 표시px는 서로 다르며 가이드의 논리px를 기기pixel로 자칭하지 않는다.
- extent는 device.w/h를 사용하므로 일반 profile의 화면 맞춤은 표시된 크기를 기준으로 계산한다. autoFit일 때만 기기/영역 변화 후 home을 적용하고 수동 zoom/pan은 유지한다. 기존10% 최소 줌 한계와 화면 canvasPosition 보존은 그대로다. 극단적인10000px 직접 입력·여러 화면의 겹침 없는 자동 재배치는 새로 제공하지 않는다.
- 선택 테두리/포인터 실제 hit, 기기 전환의 실제 글자·자원·클리핑과 다양한 창크기는 소스/VM 검토로 실화면 성공을 주장하지 않는다. 공유 브라우저 탭은 조작하지 않았다.

## 실행 검증

`node --check src/tools/uxStudio/grapes-pilot.mjs` exit0.

`node --test tests/ux-studio/canvas-device-preview.test.mjs tests/ux-studio/grapes-device-preview.test.mjs tests/ux-studio/grapes-drag.test.mjs tests/ux-studio/grapes-guide-edits.test.mjs tests/ux-studio/grapes-fit.test.mjs`

최종21/21 통과, 실패0. 기기별 reflow·profile/orientation·잘못된 prefs·실제 vendor Undo/Redo·선택/모델 불변·단계 재열기·드래그/취소·실제 호출 scale·가이드 현재비율 검증·기존 fit 관리를 포함한다. 전체시험 반복 없음.

## 범위·백업

- 백업: docs/planning/_backup/20261116_단이/1705_device_drag_scale/의 grapes-pilot.mjs, grapes-drag.test.mjs, grapes-guide-edits.test.mjs.
- 본 하위의 실제 production 수정은 pilot의 현재비율 사전 검증1줄이다. scale 전달 선행 수정은 백업 전 이미 존재했다. 시험2파일에 실제 호출/모델 회귀를 추가했다.
- main/layout/button state/consumer/model/guide-view/기기 core/HTML entry/설계/공용 STATUS·가이드·자동화는 수정하지 않았다. 본 하위 보고만 작성한다.
