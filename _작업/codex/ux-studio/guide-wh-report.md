# 디자인 가이드 선택 부품 W/H 상시 표시

- 작성: codex(단이), 2026-11-16 16:21 KST
- 상태: 제안(검수 대기)
- 지시: 사용자 첨부 4개 하단 메뉴 부품에서 치수가 보이지 않는 불편에 대해 선택 부품의 가로·세로 논리 px를 가이드선 바깥에 항상 간결하게 표시. 메뉴 설계·수치 통일·배지는 대표 본체 범위.

## 읽은 원본·원인

현재 design-guide-view.mjs와 해당 전용 시험을 먼저 읽었다. 기존 SVG 수치가 기본 OFF인 measurements 토글 안에서만 생성되어 선택만 하면 W/H가 표시되지 않았다. 현재 설계 ID·revision·51개 부품은 본체 전달 문맥이며 이 하위에서 그 저장본을 수정하거나 실측했다고 주장하지 않는다.

## 최소 변경

- src/tools/uxStudio/design-guide-view.mjs:22의 renderGuideSize는 실제 SVG 한 줄 `W80px · H92px`를 그린다. 선택 사각형 위의 -58~-38 CSS px 구간이라 위 이동 손잡이(-28~-10px)와 겹치지 않는다. 글자는 zoom으로 나눠 항상 12 CSS px로 읽힌다. 표시만 소수 2자리까지 반올림하며 원래 기하를 변경하지 않는다.
- 418행: 치수 토글 밖에서 현재 선택 부품에 대해 항상 호출한다. child 선택 후 해당 부품의 W/H로 갱신한다.
- 444행: 드래그 중 고스트의 현재 W/H와 위치도 표시하며, 끝·취소는 기존 편집 계약을 따른다.
- 405행: 선택 너비/높이와 중복되는 size형 A/B 라벨은 SVG 상세 치수에서만 제외한다. 상세 명세의 모든 값·색상선·우측 선색/선 위치 편집·여백/간격 토글은 유지한다.
- 472행: 상단 읽기 공간을 확보하도록 기본 위 여백64px/아래36px를 반영한다. 가로 확대·맞춤 기준은 기존값을 유지한다.

## 검증

- 새 실행형 회귀 2개를 먼저 추가해 실패 2개(상시 라벨 없음/renderer 미구현)를 관찰했다.
- 최종 node --check src/tools/uxStudio/design-guide-view.mjs: exit0.
- 최종 node --test tests/ux-studio/design-guide-view.test.mjs: 14/14 통과, 실패0.
- 실제 production redrawOverlay 코드를 VM에서 실행하여 measurements OFF의 상시 SVG 표시, 부모320×160→자식160×80 선택값, zoom2와0.5에서 동일한 논리px·글자12 CSS px, 선택 경계 바깥 배치, 단일 라벨 교체를 확인한다. 별도 helper 실행으로 정밀값 불변과 표시 반올림·중복 제거를 확인한다.
- 기존12개 시험도 통과해 이미지/글자/색상 preference/선 위치 rect 적용/선택·Escape/비동기 취소 계약을 유지했다.
- 실제 브라우저·최신 저장본·1440/430 화면 캡처는 이 하위에서 하지 않았다. 실제 툴 검수와 전체시험은 대표 본체 범위다.

## 보존·범위

- 변경 전 두 파일 백업: docs/planning/_backup/20261116_단이/1620_guide_wh/.
- 변경: design-guide-view.mjs, design-guide-view.test.mjs, 본 하위 보고만.
- 설계·HTML entry·main/model·공용 STATUS/보고·가이드 문서·패키지·서버·빌드·다른 프로젝트·보호 파일은 다루지 않았다.
