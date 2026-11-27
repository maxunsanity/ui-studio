# 버튼 깊이·그림자·하단 3영역 구조 보완

지시: 현중의 정확성/구조 연구·버튼 효과/그림자 디테일 보완 및 하단 중앙/좌우 분리·배수와 GO 결합 요청. 7018 native 도구를 사용하고 제안(검수 대기)로 보존합니다.

## 확인한 원인
- 실제 마우스3초 유지에서 tint normal1/hover.949/pressed.741은 작동했습니다. 현재 12화면의 버튼 설정은 tint이며 image mode의 엔진 지원과 실제 프로젝트 적용을 구분합니다.
- 원본 눌림의 프레임별 변형은 아직 확정하지 않았습니다. 단순 색 변화만으로 원본 동등을 주장하지 않습니다.
- 감옥/GO 계열은 부모와 앞면 이미지 양쪽 shadow가 있어 같은 실루엣이 중복됩니다. 실제 깊이(고정 림)와 엔진 외부 그림자를 구분해야 합니다.
- Main HUD_Bottom은 고정551×280이며 자식은legacy%. 중앙의 배수/GO/Crown/게이지와 좌우 메뉴가 같은 부모에 흩어져 있습니다. 현재 수치가 일부 비례해도 역할별 반응형 구조가 아닙니다.

## 최소 엔진 계약
buttonState.pressFeedback는 선택적 설정입니다.
- enabled:boolean, target:해당 버튼의 비입력 자손 그룹/이미지/텍스트 stableID, distance:0~16 논리px, shadow?:기존 effects.shadow 구조.
- input wrapper 크기/위치는 고정. target은 Front묶음 한 개이며 앞면 이미지·제목·비용만 함께 내려갑니다. fixed rim/배지는 target 밖에 둡니다.
- targetGraphic은 기존 실제 이미지 선택/색변화/이미지교환 대상을 유지합니다. pressed shadow는 해당 그래픽에만 임시 적용하고 normal로 복원합니다.
- 포인터/터치/키보드 누름 동안만 이동; 밖으로 이동·취소·blur·Escape·release/disabled/design변경/dispose에서 복원. 문서 좌표·게임 값은 바꾸지 않습니다.
- 기존 absent 설정은 변경0. 복사 target 재매핑/삭제·그룹해제 참조정리 및 native inspector/Undo/저장·재열기를 포함합니다.
- pressed motion은 우리 도구의 선택적 확장입니다. Unity Selectable/원본 게임의 설정을 관찰했다고 쓰지 않습니다.

## 하단 구조
HUD_Bottom
- Group_Bottom_Left: 같은80×92 메뉴2개, icon64²/text80×22/badge28² 계약. 왼쪽 하단 고정.
- Group_Bottom_Center: 고정 비율 Crown/GO/게이지/배수. 하단 중앙 고정. 배수 버튼은 이 그룹의 GO 우측 위에 결합하고 별도 크기/입력은 유지.
- Group_Bottom_Right: 같은 메뉴2개, 오른쪽 하단 고정.
- 바탕의 좌우는9/3slice로 폭을 받고 중앙 곡선/버튼은 고정 실루엣을 유지. Main 3D/보드 영역은 유지.
- GO는 fixed depth rim + Front묶음(새 벡터 UI그림/native GO/화살표/안내)으로 분리, 그림에 글자/외부 그림자 구워넣지 않음.
- 수치는 현재551×984 공통 기준을 따르고 제안값입니다. 실제 원본 계층 확정이 아닙니다.

## 순서·수락
1. RED: 형식/자손검사·복제삭제참조·pointerleave/move·동반이동/고정rim·shadow복원·keyboard/disabled·inspector Undo.
2. 최소4모듈 수정 → 관련시험 → 전체시험. 서버는 필요가 실제로 드러날 때만 기존7018 허용 범위/PID로 처리,7007무접근.
3. Main 하단 native 3그룹·공통메뉴·배수 결합·GO앞면/림 조립. 기존 다른9화면/20edges 보존.
4. 실제 누름전/유지중/해제3상태·mouse/keyboard/취소·390430tablet·기본/전체canvas·저장재열기와 이미지실패/넘침 검수.
5. 가이드·JSON tokens·영상HTML 최신 실제판·보고/STATUS에 공통 규칙과 미확인 기록,2차 세션에 정확한 적용법 공유.
6. 이 기준을 적용하여 다음 누락UI 제작. 자동시험수와 화면기록수를 완성률로 쓰지 않음.

원본/과거판/프로젝트 guide.4/2차 자원·설계 보존, 외부JSON설계조립0, 새 패키지/3D/7007/외부메시지/자동화0. 사용자 최종 승인/WPUS/원본 동등은 미완료.


## 실제 단위 결과 2026-11-17 15:21 KST
최소3product모듈/관련33·전체516, native r299/실제수치34. 후속 원본 재측정 v002/단일윤곽/Front입력 parent 및551→768 Undo 보완. 상세 결과와 미완료는 보고1424의 최신절을 따릅니다. 원본동등/게임/전체버튼마이그레이션 완료가 아닙니다.
