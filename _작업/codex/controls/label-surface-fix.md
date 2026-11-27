# HUD label 텍스트의 불필요한 배경 제거

- 작성: codex(단이), 2026-11-16 KST
- 상태: 제안(검수 대기). 실제 브라우저 확인은 대표 본체가 수행합니다.
- 지시: 정식 HUD 제작 중 발견한 `Txt_Amount`의 label/text 부품 배경만 최소 renderer 보정. 저장 설계와 일반 텍스트의 appearance 계약은 변경하지 않습니다.

## 원인과 변경

- 원본: `src/tools/uxStudio/layout-view.mjs` surface cache·생성 조건, appearance 글자 스타일·선택 hatch 블록과 기존 renderer 회귀 fixture.
- 원인: appearance가 있는 text 부품에도 일반 SVG surface가 생성되어, label 역할의 글자 아래 흰색/회색 사각형을 칠했습니다.
- `src/tools/uxStudio/layout-view.mjs:135`: `partRole === 'label' && kind === 'text'`일 때만 일반 unitSurface 생성을 생략합니다. 글자색·크기·텍스트·입력 전달·선택 hatch 생성 경로는 유지합니다. 일반 text와 background/frame 부품의 surface는 보존합니다.
- `src/tools/uxStudio/layout-view.mjs:132`: surface cache key에 kind를 포함하여 새 생성 조건의 모든 요소를 반영합니다. 기존 partRole 키와 함께 역할·종류 전환 때 이전 배경을 제거하거나 복원합니다.
- `tests/ux-studio/control-visual.test.mjs:65`: label 투명 배경, 글자 스타일·입력·선택 hatch, 일반 텍스트·배경·별도 frame 보존 회귀를 추가했습니다.
- `tests/ux-studio/control-visual.test.mjs:83`: 같은 DOM 노드의 일반 text → label → 일반 text 전환에서 배경 제거·복원을 확인합니다.

## 검증

- 수정 전 신규 회귀 2건 실패를 확인했습니다.
- `node --test tests/ux-studio/control-visual.test.mjs tests/ux-studio/parts.test.mjs tests/ux-studio/controls.test.mjs tests/ux-studio/responsive-layout.test.mjs`: **44/44 통과, 실패 0**.
- `node --check src/tools/uxStudio/layout-view.mjs`, `node --check tests/ux-studio/control-visual.test.mjs`: 통과.
- 로그: `_작업/codex/controls/label-surface-tests.log`.
- 이번 창에서 브라우저 진입·화면 캡처·빌드·서버 재시작은 수행하지 않았습니다. 실제 HUD의 새 그림과 label 겹침은 대표 본체 검수 대기입니다.

## 보존과 다음

- 백업: `docs/planning/_backup/20261116_단이/130411_label_surface_fix/`.
- CSS·모델·기본값·저장 JSON·이미지 자원·다른 담당 작업은 변경하지 않았습니다.
- 다음: 대표 본체가 새 `Img_TopBar` 그림 위의 `Txt_Amount` 배경 제거와 글자·선택 상태를 실제 브라우저에서 확인합니다.
