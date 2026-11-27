# 실제 컨트롤 중복 장식·라벨 정렬 보정

- 작성: codex(단이), 2026-11-16 12:39 KST
- 상태: 제안(검수 대기). 실제 브라우저 재검수는 대표 본체가 수행합니다.
- 지시: 기존 native 컨트롤의 중복 도형과 전역 label CSS 충돌만 수정. 모델·기본값·저장본 변경 없음.

## 읽은 원본과 원인

- `docs/evidence/20261116-tool-capabilities/controls-preview.jpg`: 대표 본체가 촬영한 기존 화면을 열어 겹침·라벨 분리를 확인했습니다. 새 브라우저 검수나 새 캡처는 수행하지 않았습니다.
- `src/tools/uxStudio/controls.mjs`: native checkbox/radio/range와 label 생성·값 반영 블록.
- `src/tools/uxStudio/layout-view.mjs`: appearance surface와 `variant-*` 클래스 생성 블록. native 필드와 정적인 가짜 손잡이·레일이 동시에 생성되었습니다.
- `src/tools/uxStudio/styles.css`: 전역 label의 grid·13px 상하 여백·연한 글자색, 전역 input의 100% 폭이 native 선택 항목에도 적용되었습니다.

## 바꾼 것

- `src/tools/uxStudio/layout-view.mjs:147`: 실제 control이 있으면 toggle/slider/tabs/progress의 정적 variant 클래스만 생략합니다. 의도된 appearance SVG surface와 frame은 유지합니다. control을 제거하면 기존 클래스와 텍스트가 복원됩니다.
- `src/tools/uxStudio/styles.css:879`: `.ui-control` 안의 label만 가로 정렬·중앙 맞춤·여백 0·부모 글자색 상속으로 보정했습니다. checkbox/radio의 폭·여백·패딩만 native 크기에 맞췄습니다. 편집기 바깥 라벨과 텍스트 입력·드롭다운의 기존 대비는 유지합니다.
- `tests/ux-studio/control-visual.test.mjs`: 실제 renderer 실행으로 정적 장식 생략/제거 후 복원, SVG surface 재사용, 명시 frame과 일반 progress 보존을 확인합니다.

## 확인

- 선행 시험: 신규 회귀 2개 중 중복 장식 방지 1개 실패를 확인한 뒤 수정했습니다.
- `node --test tests/ux-studio/control-visual.test.mjs tests/ux-studio/controls.test.mjs tests/ux-studio/control-containers.test.mjs tests/ux-studio/control-inspector.test.mjs tests/ux-studio/responsive-layout.test.mjs tests/ux-studio/assets.test.mjs`: **50/50 통과, 실패 0**.
- `node --check src/tools/uxStudio/layout-view.mjs` 및 `node --check tests/ux-studio/control-visual.test.mjs`: 통과.
- 기존 설치된 PostCSS의 `parse`로 `src/tools/uxStudio/styles.css` 문법 확인: 통과. 패키지 추가 없음.
- 로그: `_작업/codex/controls/visual-fix-tests.log`.
- CSS 실제 계산·색상 대비·데스크톱/모바일 캡처는 미검수이며 대표 본체가 재확인해야 합니다. 과거 302개 시험 결과는 이번 결과로 사용하지 않았습니다.

## 백업과 보존

- 백업: `docs/planning/_backup/20261116_단이/123657_control_visual_fix/`.
- `controls.mjs`, 모델·기본값·저장 데이터, r4/r14, 이미지·스킨, 서버·빌드·자동화는 수정하거나 실행하지 않았습니다.
- 다음: 대표 본체가 실제 7종 컨트롤 화면에서 중복 도형 제거, 선택 항목 정렬·글자 가독성, control 제거 후 장식 복원을 확인합니다.
