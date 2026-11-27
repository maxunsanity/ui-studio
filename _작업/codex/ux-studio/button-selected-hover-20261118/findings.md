# 공통 버튼 selected/hover 원인 조사 — 제안(검수 대기)

- 작성: codex(단이) 하위 조사, 2026-11-18 16:58 KST
- 범위: root가 전달한 SettingsMusic 선택 이미지 가림 현상. 제품 소스·저장 설계·공용 수신/STATUS/보고 수정 없음.
- 읽은 규칙: systematic-debugging, graphify, ponytail, test-driven-development 및 writing-good-tests, 루트 AGENTS 관련 버튼/공통 기능/하위 범위 조항.
- 지도: 프로젝트 루트 graphify-out/graph.json 없음, src/graphify-out/graph.json 없음. 새 지도 생성 없이 전달된 버튼 파일과 직접 호출자만 확인.

## 원인

1. button-state.mjs:40·43의 선택 조회/토글은 정상. model.mjs:230–261에서 입력 owner와 pending/disabled 등을 확인한 뒤 runtime 선택을 토글한다.
2. consumer.mjs:83–93의 실제 click은 activate 후 paint, paint의 41–43은 runtime을 renderLayout으로 전달한다.
3. button-state.mjs:76은 disabled → preview → pressed → hover 또는 focus → selected → normal 순서로 논리 상태를 고른다. hover 또는 keyboard focus가 남으면 선택값 true여도 state는 hover다.
4. 같은 파일:79의 aria-pressed는 논리 선택값을 별도로 읽어 true를 올바르게 표시한다.
5. 같은 파일:87의 이미지 fallback은 images[state] → images.normal → graphic.image뿐이다. hover 이미지가 비어 있으면 selected 기본 그림을 건너뛰어 normal-off가 보인다. state 순서가 아니라 해당 이미지 fallback의 누락이다.
6. layout-view.mjs:284–297은 공통 callback으로 일반 그림 또는 sliced frame을 바꾼다. sliced frame의 CSS 5상태 source도 선택된 그림으로 통일하므로 controller에서 잘못 고른 off가 그대로 전달된다.

## 최소 patch 후보

`candidate.patch`를 본체 검토용으로만 보존했다. 적용하지 않았다.

현재 상태 이미지 우선 → hover이며 선택 중이면 selected 이미지 → normal → 원래 graphic image 순서다. 상태 우선순위와 aria 값은 바꾸지 않으므로 명시 hover·pressed·disabled 이미지를 유지한다. keyboard focus도 같은 hover 경로이므로 함께 보완한다. selected 상태를 hover 앞에 놓는 수정은 명시 hover 이미지까지 가리므로 피한다.

pressed/disabled 이미지가 없는 선택 버튼에 selected를 fallback할지까지 이 수정으로 확대하지 않는다. 본 과제는 누락된 hover 그림일 때의 선택 기본값 유지다. dataset.buttonVisualState는 현재 실제로 선택된 fallback 이미지명이 아니라 논리 state를 그대로 표시한다(76–77). 후보 적용 후에도 hover일 수 있으므로 실제 img/src 또는 --skin-source를 검증해야 한다.

## 시험과 기존 커버리지

- 기존 tests/ux-studio/button-state-sliced-skin.test.mjs:21은 5상태 이미지를 모두 채운 fixture. :41은 hover/focus를 해제한 뒤 selected만 확인하므로 이번 누락 조합을 잡지 못한다.
- 기존 control-visual.test.mjs:112–122는 tint/선택 동작, :148–153은 pressed 이미지/원래 그래픽 복원으로 missing-hover + selected 이미지 조합이 없다.
- `selected-hover-regression.test.mjs`는 기존 control-visual의 fake DOM만 재사용하고 실제 consumer/model/button-state/layout renderer를 실행한다. 브라우저 CSS paint/네트워크 로딩 검수는 아니다.
- 추가 8개: 초기 selected→pointerenter/focus 2개, 실제 consumer click로 runtime off→on→off 1개, 3/9슬라이스 2개, 명시 hover 우선/명시 pressed 우선/미선택 normal 보존 3개.
- 예상 RED: 앞 5개만 실패, 뒤 3개 통과. 실제 실행 결과는 같은 폴더 red.log 및 red-result.json으로 기록한다. 원인만 확인하며 제품 patch를 적용하거나 GREEN을 주장하지 않는다.

## 미확인·변경하지 않은 범위

제품 소스/설계/자원/가이드/공용 STATUS·보고 수정0, 7007/실제 브라우저/서버/빌드/패키지 작업0, 보호 파일 열람·검색·해시·수정0. SettingsMusic 저장 원본이나 root의 native 재현 화면을 하위가 독립 재검수하지 않았다. 구현·통합 전체 시험·실제 pointer/focus/터치 검수는 본체가 진행할 범위다. 전체 Unity 기능 추가 없음.

## 실제 실행 결과

지정 초안 `node --test <절대경로>/selected-hover-regression.test.mjs` 최종 8개 중 통과3/실패5, exit1. 앞 5개는 모두 실제 img/src 또는 --skin-source가 off인 동일한 이미지 assertion으로 실패했고, 명시 hover/pressed·미선택 보존3개는 통과했다. red.log·red-result.json 참조. 초기 시험에서 명시 hover guard를 mount 이후 원본에 주입해 consumer clone에 반영되지 않은 fixture 오류가 1개 있었고, 실제 consumer.mjs:13의 초기 설계 복제를 확인해 mount 전 설정으로 고쳤다. 초기 원문과 로그는 before-fixture-hover-fix/red-v001 파일로 보존했다. 제품 소스 변경0/GREEN 실행0.
