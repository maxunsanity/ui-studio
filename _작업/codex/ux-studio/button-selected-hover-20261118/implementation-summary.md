# 버튼 selected/hover 보완 구현 — 제안(검수 대기)

- 작성: codex(단이) 하위, 2026-11-18 17:05 KST
- 승인: 본체가 선택 버튼 fallback 1줄 + 기존 control-visual.test.mjs 회귀8개만 수정하도록 배정.
- 제품/시험 변경은 정확히 아래 두 파일. 저장 설계·자원·가이드·공용 수신/STATUS/보고 변경0.

## 변경

- src/tools/uxStudio/button-state.mjs:87 — 명시 현재 상태 이미지가 없고 논리 state가 hover이며 선택 중인 경우에만 selected 이미지를 normal 앞에 둔다. pressed/disabled/preview/논리 상태 우선순위·aria-pressed·tint 경로는 유지한다.
- tests/ux-studio/control-visual.test.mjs:452 — 기존 fixture/stateDesign/renderedPart를 직접 재사용한 회귀8개 추가. 기존 시험 원문 전체가 그대로 prefix이며 45줄 추가/기존줄 삭제0. VM/source.slice 구현은 제품 시험에 넣지 않았다.
- 새 시험: 선택초기값+pointer/focus 2개, 실제 consumer runtime off→on→off 1개, 3/9슬라이스 2개, 명시 hover/명시 pressed/미선택 normal 보존3개.
- 제품 diff는 1줄 교체. 전체 정확한 diff는 implementation.diff, 최종 두 파일 SHA는 implementation-files.json.
- 백업은 본체가 만든 docs/planning/_backup/20261118_단이/1709_button_selected_hover/{button-state.mjs,control-visual.test.mjs}. 각 편집 전 현재 원본과 백업 바이트 일치를 확인했다.

## 실제 실행

1. RED — `node --test --test-name-pattern=selected button image tests/ux-studio/control-visual.test.mjs` (subprocess argv로 pattern 한 인자 전달). 원본 제품 소스에서8개 중5개 이미지 equality assertion 실패·3통과·exit1. implementation-red.log/implementation-red-result.json.
2. GREEN — `node --test tests/ux-studio/control-visual.test.mjs tests/ux-studio/button-state.test.mjs tests/ux-studio/button-state-sliced-skin.test.mjs tests/ux-studio/button-press-depth.test.mjs tests/ux-studio/button-state-editor.test.mjs`. 56/56·fail0·cancelled0·skipped0·exit0. implementation-related-green.log/implementation-related-green-result.json.
3. 최종 전체 — `npm test` 정확히1회. 685/685·fail0·cancelled0·skipped0·exit0, 소요2904.448291ms. implementation-full-tests.log/implementation-full-result.json. 관련56과 전체685를 더하지 않는다.

전체 시험에는 Node ExperimentalWarning `localStorage is not available because --localstorage-file was not provided.` 1개가 있으며 실패는0이다(log299). 제품 한 줄과 시험 변경 뒤 이 전체 시험을 실행했으며 이후 제품/시험 수정0이다.

## 실제 검수 경계와 다음

하위는 실제 브라우저/HMR 이벤트·화면·CSS 픽셀 paint·HTTP 그림 로딩/SettingsMusic 실제 설계·7007·서버/빌드·패키지를 조작하거나 검수하지 않았다. source 쓰기 완료 시점은 본체에 즉시 전달했고, HMR/실제 pointer·keyboard·touch/native 저장 설계 검수는 본체와2차 담당이다. 보호 파일 접근0. 새 import/export·모듈 연결 변경0이며 Graphify 지도 생성/갱신0. 전체 Unity 기능 추가0. 공용 보고는 본체가 이 결과와 실제 화면 증거를 합쳐 작성한다.
