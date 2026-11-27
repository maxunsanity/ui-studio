# 복합 알림 배지의 이미지·글자 분리 렌더

- 작성: codex(단이), 2026-11-16 16:45 KST
- 상태: 제안(검수 대기)
- 지시: 부모 Badge_Notification(component=image-frame,partRole=badge)의 notification 정본1개를 유지하고 Img_Notification_BG와 Txt_Notification_Count 직속 자식으로 실툴 조립할 수 있게 renderer만 보완. 실툴 조립·저장·화면 검수는 대표 본체 범위.

## 읽은 원본

notification.mjs와 기존 notification-report.md, layout-view.mjs, parts.mjs 역할/복합 유닛 검증, consumer.mjs의 updateState/updateDesign·values 전달, control-visual/notification/notification-editor 시험을 읽었다.

## 변경

- layout-view.mjs:58: 현재 렌더 진입의 직접 부모가 component있는 badge일 때만 부모 notification을 현재 values로 포맷한다.
- layout-view.mjs:163: component있는 badge 부모의 자체 element-text는 비운다. 부모 own config는 기존대로 부모 hidden만 제어한다.
- 직속 partRole=label 자식은 포맷된 부모 text를 표시한다. dot은 빈 글자이며 child.hidden이나 중복 notification config를 만들지 않는다. 부모 숨김은 DOM 부모를 통해 상속한다.
- 설정이 없거나 제거되면 자식은 기존 text(e) 경로로 복원한다. legacy 단일 badge panel은 원래 자체 수치를 표시한다. 일반 label·손자 label·component없는 badge의 자식 label에는 영향을 주지 않는다.
- 정본 모델 field·config 복사·ID·name·parentId 변경 없음.

## 검증

새 실렌더/consumer 회귀2개를 먼저 추가해 기존 부모 자체 수치 표시 때문에2개 실패를 관찰했다.

최종 명령:

`node --check src/tools/uxStudio/layout-view.mjs` → exit0.

`node --test tests/ux-studio/control-visual.test.mjs tests/ux-studio/notification.test.mjs tests/ux-studio/notification-editor.test.mjs` → 14/14 통과, 실패0.

실제 renderLayout과 mountDesignConsumer를 실행해 부모 글자 공백/직속 label5, dot 공백, root0숨김/4복원, updateState100→99+·0→부모숨김·4→동일 자식 visible·{}→기본5, invalid→직전 값 유지, config 삭제 후 OLD_COUNT 복원과 부모 visible 복원, 원본 설계 불변·label/background DOM identity 보존, legacy와 일반/손자 label 무영향을 확인했다. 전체시험은 본체 통합 담당이므로 실행하지 않았다. 브라우저 CSS 페인팅·실툴 구조 조립·저장/재열기·부모 hidden 실제 화면은 이 하위에서 검수하지 않았다.

## 백업·범위

백업: docs/planning/_backup/20261116_단이/1642_compound_notification/layout-view.mjs 및 control-visual.test.mjs.

변경은 layout-view.mjs, control-visual.test.mjs, 본 하위 보고뿐이다. guide-view·main·consumer·model·notification 원본·문서·설계JSON·공용 STATUS/보고·HTML entry·패키지·서버·빌드·보호 파일은 수정하지 않았다.
