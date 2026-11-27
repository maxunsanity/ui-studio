# 재사용 알림 수치·점 배지

codex(단이) 하위 작업 · 2026-11-16 16:27 KST 확인 · 제안(검수 대기)

## 지시와 범위
현중의 공통 알림 배지 실제 기능 요청을 대표 본체가 배정했다. partRole=badge 부품에서 설정하고 모든 메뉴가 같은 포맷/검증/소비 렌더를 재사용한다. 기존 NEW 라이브러리 프리셋·글자·appearance·이미지·ID·부모·폰트·배치를 자동 변환하지 않는다. parent80×92 안 badge[52,0,28,28] 조립과 source관찰값 승리0숨김/짓기5/앨범점/친구4 적용은 대표 본체가 실툴로 수행하며 이 작업은 설계 JSON을 고치지 않았다. 이 수치는 게임 정책 확정값이 아니다.

읽은 원본: model.mjs, layout-view.mjs, consumer.mjs의 기존 flat primitive values·updateState·메뉴/overlay 렌더, main.mjs의 partsPanel/edited/속성 change 처리, styles.css, 기존 control/menu/skin/shadow/catalog 시험.

## 계약과 API
새 notification.mjs는 외부 의존성 없는 세 함수를 제공한다.

```js
createNotification(); // 새 객체: enabled:false, mode:'count', value:0, hideZero:true, maxDisplay:99
validateNotification(notification);
formatNotification(notification, values); // 미설정 null, 설정되면 {text,hidden}
```

선택 element.notification은 optional이고 enabled boolean, mode count|dot, value 비음수 safe integer, hideZero boolean, maxDisplay1~999 정수, optional valueKey는1~128자의 ASCII 영숫자/밑줄/점/하이픈 flat key다. 점은 중첩 접근자가 아니라 실제 키 문자열의 일부다. 예: values['nav.buildCount']. 알 수 없는 필드·범위 밖·문자 수치·NaN/Infinity는 검증에서 거부한다. 원본은 정규화하거나 버전을 올리지 않는다.

count는5/99/99+처럼 표시한다. value>maxDisplay이면 maxDisplay+'+'다. dot은 숫자 글자를 비우며 같은 count-driven hideZero 규칙을 사용한다. enabled=false는 전체 배지를 숨긴다. hideZero=false이면 count0 또는 dot도 표시한다. 본체가 동의한 album dot 시연은 value1/hideZero=true이며 게임 확정 수치가 아니다.

## 변경 근거
- model.mjs:56: optional notification 검증만 추가했다. 기존 문서는 같은 객체·값을 유지한다.
- layout-view.mjs:158: badge 역할에서만 공통 포맷을 적용한다. 미설정은 기존 text(e), 설정은 계산한 text/hidden을 사용한다. 설정 삭제 시 기존 NEW 같은 text와 visible 상태를 복원한다. values는 메뉴/부모 재귀에도 전달한다. 기존 hidden menu의 생성/제거 방식은 유지한다.
- styles.css: badge[hidden]만 display:none!important로 처리해 원래 .ui-element display:flex가 hidden을 덮어쓰지 못하게 했다. 배지 모양·색·폰트는 변경하지 않는다.
- consumer.mjs:7·12·108·121: 기존 updateState flat primitive에서 valueKey own-property만 사용하고 설계 기본값을 덮어쓰지 않는다. 누락 키는 기본값으로 돌아간다. 활성 badge에 연결된 음수/소수/문자/boolean 등의 실행 값은 기존 values를 교체하기 전에 거부해 표시를 보존한다. overlay와 중첩 badge도 같은 값을 받는다. updateDesign도 새 바인딩과 현재 values를 적용 전에 확인한다.
- main.mjs:1708·3040: badge에만 ‘알림 배지’ 폼을 표시한다. 폼 열기만으로 config를 생성하지 않으며 명시 체크 ON 전 다른 입력은 비활성이다. enabled/mode/value/hideZero/maxDisplay/valueKey 변경은 기존 edited→검증→Undo/dirty/render 경로를 사용한다. 빈 실행 값 키는 필드를 제거한다. 잘못된 값은 원문/Undo를 보존한다. 역할이 badge가 아닌 부품에는 설정 UI와 동작을 적용하지 않는다.
- catalog.test.mjs:93: 경량 consumer 의존성에 실제 새 notification.mjs를 반영했다. 외부 패키지·편집기·3D 엔진을 추가하지 않았다.

실제 UI labels: 알림 배지 / 알림 배지 켜기 / 표시 방식(숫자·점) / 기본 알림 수 / 0이면 숨김 / 최대 표시 수 / 실행 값 키. selector는 [data-notification-field="enabled|mode|value|hideZero|maxDisplay|valueKey"]다.

## 이번 검증
- core/모델·실제 renderLayout/consumer 동작4건과 실제 main UI/handler2건은 구현 전 실패→구현 후 통과를 확인했다.
- 실시간 consumer:100→99+,0→숨김,4→visible/text4, invalid→기존4 유지,{}→설계기본5 복원. 중첩 부모·기본값 무수정·원본/legacy NEW 복원을 검사했다.
- main: checkbox 명시 ON 전 config 없음, ON과 값 변경별 기존 Undo 스냅샷·dirty, invalid rollback, key 지우기, ID/parent/font/text 등 notification 외 필드 보존을 검사했다.
- catalog의 실제 graph가 새 module1개 때문에 실패하는 것을 확인한 뒤 예상 목록을 보정했다.
- 최종 scoped 명령: node --test tests/ux-studio/notification.test.mjs tests/ux-studio/notification-editor.test.mjs tests/ux-studio/control-visual.test.mjs tests/ux-studio/catalog.test.mjs tests/ux-studio/menu.test.mjs tests/ux-studio/controls.test.mjs tests/ux-studio/selected-skin-editor.test.mjs tests/ux-studio/selected-shadow-editor.test.mjs tests/ux-studio/visual-effects.test.mjs → 62/62 통과, 실패0. 로그 _작업/codex/ux-studio/notification-tests.log.
- notification/main/consumer/layout/model node --check 통과. 전체 npm test는 대표 본체 통합 담당이므로 실행하지 않았다. 앞선10/12/56과62를 합산하지 않는다.

## 백업·미확인
변경 전 백업: docs/planning/_backup/20261116_단이/1621_notification_badges/ 아래 model/layout/consumer/main/styles와 기존 control-visual/catalog 시험. notification.mjs와 notification/notification-editor 시험은 신규 파일이다.

이 하위 작업은 브라우저·실툴 배지 추가·제품 설계 저장/수정·이미지·guide-view/HTML/mount·7007·외부 앱·서버 시작/재시작·공용 STATUS·가이드를 변경하지 않았다. 기존 샘플은 본체가723 r1을 보존하고 작업 사본0d80d7fe r1로 옮겼다고 전달했으며 이 작업에서 해당 JSON을 직접 읽거나 쓰지 않았다.

실제 4메뉴 조립/원형 appearance·폰트·숨김·최대값 표시 넘침·메뉴 열림/닫힘·Undo·파일 저장/재열기는 본체의 실화면 검수다. 새 모듈 import의 코드지도 반영 필요는 본체 보고에서 구분한다. 사용자 결정과 제작 승인으로 자칭하지 않는다.
