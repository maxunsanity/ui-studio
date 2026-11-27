# 모바일 캔버스 높이 보정

- 작성자: codex(단이)
- 작성 시각: 2026-11-16 12:44 KST
- 상태: 제안(부모 실제 화면 재검수 대기)
- 범위: 기존 전체 캔버스의 모바일 빈 화면 결함 수정. 새 기능 없음.

## 확인한 근거

부모가 제공한 실제 CSS viewport 430×844의 기존 캡처 `docs/evidence/20261116-tool-capabilities/canvas-mobile.jpg`를 열어 확인했습니다. 헤더·프로젝트·저장은 보였으나 캔버스 영역에 네 화면이 보이지 않고 fit=10이었습니다. 제가 브라우저나 viewport를 조작하지는 않았습니다.

부모 탭15의 430×844 DOM 실측:

- `#gjs`: x0, y242.59, w420, h350, inline height=100%, computed height=350px.
- `.gjs-editor`, `.gjs-cv-canvas`: w420, h0.
- `.gjs-cv-canvas__frames`: h0, transform=scale(0.1) translate(-1650px,240px).
- 실제 frame wrapper/iframe: 논리1788×908, 표시178.8×90.8.

Grapes init이 `#gjs`에 inline `height:100%`를 지정합니다. 모바일에서는 body/작업영역 높이가 auto이므로 이 퍼센트 높이가 자식의 유효한 기준 높이가 되지 못합니다. 외곽의 min-height 350px만 남고 내부 Grapes 높이는0이 되어 fit 계산이 최솟값10에 머물렀습니다. 데스크톱과 다른 분기는 모바일 높이 계약이며, 화면 순서(order:-1)나 원본 설계 좌표는 원인이 아닙니다.

## 변경

`src/tools/uxStudio/canvas.css:5`의 모바일 규칙만 변경했습니다.

```css
.canvas-workspace #gjs {
  height: 60dvh !important;
}
```

기존 선언에 `!important`를 추가하여 Grapes의 inline 100%보다 모바일의 명시 높이가 우선하도록 했습니다. 외곽과 내부 Grapes 높이가 같은 유효한 px 높이를 갖게 합니다. 이유를 CSS 주석으로 남겼습니다. fit 수식·좌표·pan·화면 순서·저장·설계 JSON은 바꾸지 않았습니다. `grapes-pilot.mjs`는 검사만 했고 수정하지 않았습니다.

## 실행한 검사

```sh
node --test tests/ux-studio/grapes-fit.test.mjs tests/ux-studio/grapes-canvas.test.mjs tests/ux-studio/grapes-save-guard.test.mjs tests/ux-studio/project-context.test.mjs
node --check src/tools/uxStudio/grapes-pilot.mjs
```

이번 실행:11/11 통과, 구문 검사 exit0. 이 자동 시험을 실제 모바일 화면 검수로 표현하지 않습니다.

## 백업

`docs/planning/_backup/20261116_단이/124236_canvas_mobile_fix/src/tools/uxStudio/`

변경 전 canvas.css와 grapes-pilot.mjs를 보존했습니다.

## 부모 재검수 항목

430×844 탭을 유지해 다시 로드하고 #gjs/.gjs-editor/.gjs-cv-canvas가 약506.4px의 일치하는 높이를 갖는지, fit가20 전후로 회복되어 네 화면이 보이는지 확인합니다. 헤더·프로젝트·저장·전체 맞춤과 1440×900 기존 표시도 확인합니다. 아직 이번 수정 후 실화면·신규 캡처·전체 시험·서버 재시작은 수행하지 않았습니다.
