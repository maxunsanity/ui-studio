# 전체 캔버스 inert 정적 표시 보정 후보

codex(단이) · 2026-11-18 · 제안(검수 대기). 이 `inert-paint/` 폴더만 작성했습니다. live source/저장 JSON/schema/공용 보고/다른 작업/서버는 수정하지 않았습니다.

## 후보 2개

- `overview.mjs`: panel을 detached 상태로 기존 renderer에 그립니다. 오류 시 정리할 수 있도록 board.panel 참조는 먼저 두고, 실제 inert content 연결은 정적 controller 정리 뒤에 합니다.
- `button-state.mjs`: `disposeButtonStates(root,{preserveVisual=false}={})` → `controller.dispose({preserveVisual})`만 추가합니다. 기본값은 종전과 같습니다. true일 때도 pointer/document/node listener, motion, controller와 scope를 제거하지만 현재 이미지/tint SVG/filter/disabled/state/aria 정적 표시는 보존합니다. overview만 true를 사용하며 다음 paint 때 기존 panel을 버립니다.

이유: 기존 순서는 content.inert 아래에서 렌더해 `closest('[inert]')`가 실제 정상 버튼도 disabled로 판단했습니다. 단순 detached 이동 뒤 기본 dispose만 쓰면 tint 정의와 authored disabled 표시가 지워지므로 작은 공통 opt-in API로 정적 paint를 유지합니다. 수동 DOM/filter/state 복사나 별도 renderer는 없습니다. 원래 이미지 노드를 유지하여 이미지 오류 handler도 보존합니다.

## RED → GREEN

- `red.log`: 수정 전 live 모듈로 새 9개 실행. 정상/비활성 × 이미지/tint × 본UI/세부 와이어 8개 실패, 기존 기본 dispose 1개 통과.
- `green.log`: 후보 2개를 module loader로 연결한 기존 overview 24개 + 새 9개 = **33/33 통과**.
- `button-regression.log`: 기존 버튼 상태·편집·3슬라이스·누름 깊이·표현·샘플 시험 **41/41 통과**.

새 시험은 실제 renderPresentation/버튼 controller를 사용합니다. 저장 원본 불변, 정상 a.webp/disabled d.webp의 실제 선택, 정상·비활성 tint matrix/filter 유지, authored native disabled, inert 유지, controller 제거와 pointer/키보드 후 정적 표시 불변, 기존 기본 dispose의 tint/state 제거를 확인합니다. fixture가 CSS를 실제 칠하는 browser는 아니므로 최종 화면의 자원/색/크기는 본체 실제 검수 대상입니다.

## 실행

프로젝트 루트에서:

```sh
OVERVIEW_CANDIDATE_DIR="$PWD/_작업/codex/ux-studio/ux-refresh-20261118/overview/inert-paint" node --import ./_작업/codex/ux-studio/ux-refresh-20261118/overview/inert-paint/register-loader.mjs --test tests/ux-studio/overview-layout.test.mjs tests/ux-studio/overview.test.mjs _작업/codex/ux-studio/ux-refresh-20261118/overview/inert-paint/inert-paint.test.mjs
```

로더는 현재 source imports에서 overview/button-state 두 파일만 후보로 치환하여 renderer와 dispose가 동일한 WeakMap 모듈 인스턴스를 쓰게 합니다. 후보 파일의 import는 최종 source용 `./` 그대로입니다. live 통합 후 새 시험을 tests/ux-studio/로 옮길 때 import의 `../../../../../../` 접두부를 `../../`로 바꾸면 됩니다. 로더는 최종 제품에 넣지 않습니다.

이 작업에서 본체가 보완 중인 상세 BFCache/native control 대비는 수정하지 않았습니다. 추가 기능 확장 없이 이 후보 전달로 맡은 보정을 닫습니다.
