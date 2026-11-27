# 와이어프레임 v2 후보 — 제안(검수 대기)

현재 live presentation.mjs/css를 기준으로 `와이어프레임은 너무 단순해..세부는 적당한데..`를 반영한 scratch 후보입니다. live 원본은 이 폴더의 live-presentation.mjs/css로 보존했습니다. 이 폴더 밖·설계 JSON·그림·서버·패키지·다른 담당 작업은 수정하지 않았습니다. API 변경 없습니다.

와이어 분기만 바꿉니다. 기존 큰 구역선에 실제 action owner의 간단한 버튼 박스, image 요소의 대각선 자리표시, text 요소/문구/입력 칸의 가는 행 표시를 더합니다. frame/background와 좌표용 중간 부모는 직접 그리지 않습니다. 큰 구역만 이름을 붙이고 작은 슬롯에는 이름/제품 문구를 넣지 않습니다. 실제 개행 또는 typography.wrap이 있으면 두 행으로 표현합니다. 반응형·안전영역·앵커·inset·자동 배치·부모 계층은 기존 renderLayout 계산을 그대로 사용합니다.

wire 투영에서 image/skin/control/buttonState/binding/notification/effects/제품 문구를 제거합니다. 기본 renderer가 만드는 image 자리표시 DOM도 제거하고 자원 없는 span 도형만 둡니다. 실제 image/img/skin probe·native control은 0입니다. 프로젝트명/제품명/ID 예외, 자원 생성/교체, 저장 스키마 변경은 없습니다.

승인된 detailed CSS marker 뒤 전체와 alphaFilter 함수 본문은 live 기준 byte-equivalent입니다(scope-check.log). UI/detailed의 원래 native 계층·자원·문구·폰트·좌표는 후보와 live 출력을 비교해 보존을 확인했습니다. 이 사전 live 동등 시험은 통합 뒤 자기비교가 되므로 scratch 증거로 남기고 최종 live 시험에서는 제외합니다.

## 부모 통합

presentation.mjs / presentation.css를 소스에 복사합니다. 모듈의 처음 세 import만 최종 위치 기준으로 바꿉니다.

```js
import {renderLayout} from './layout-view.mjs';
import {controlContainerIds} from './controls.mjs';
import {inputMode} from './parts.mjs';
```

기존 API/호출/assetView 옵션/overlay 투영 준비 방식은 그대로입니다. 이 후보는 HMR을 유발하지 않습니다. live 반영은 본체가 담당합니다. presentation.test.mjs는 scratch 상대 import이므로 tests/ux-studio에 둘 때 import 경로만 바꿉니다. 마지막 live 동등 사전비교 항목을 제외하면 최종 live에 들어갈 동작 시험은 12개입니다.

## 확인

- RED: v1에서 신규 action/image/text/필수 조상 기능 부재로 12개 중 3실패(red.log).
- GREEN: 후보 13개 + 기존 버튼/스킨/가이드 회귀 33개 = 46/46 통과(related-green.log). 이 중 1개는 위 scratch 전용 사전 동등 비교입니다.
- node --check 통과.
- scope-check.log: accepted detailed CSS와 alphaFilter가 byte-equivalent.
- 실제 개행 `One\nTwo`는 두 행, 리터럴 역슬래시n `One\\nTwo`는 한 행으로 구분하는 회귀 통과.
- 원문 screen 구조/필드 deep-equality, 원본 참조의 UI/detailed 반환, 실제 action/text/image 좌표 스타일, frame/background 아래 실제 content 좌표 유지 검증.
- 대표 일반 fixture는 큰 구역 2개뿐이던 그림에 action 3개·image slot 2개·text row 3개를 추가합니다(구역/action 하나는 같은 요소). 하위 중간 card와 좌표 조상은 추가 테두리 없이 유지됩니다.

```sh
node --check _작업/codex/ux-studio/ux-refresh-20261118/presentation/wire-v2/presentation.mjs
node --test tests/ux-studio/button-state.test.mjs tests/ux-studio/button-state-sliced-skin.test.mjs tests/ux-studio/button-press-depth.test.mjs tests/ux-studio/skins.test.mjs tests/ux-studio/design-guides.test.mjs tests/ux-studio/highlighted-skin.test.mjs _작업/codex/ux-studio/ux-refresh-20261118/presentation/wire-v2/presentation.test.mjs
```

실제 브라우저 paint/화면은 아직 확인하지 않았습니다. 부모가 r74 저장 안전 상태를 확인한 뒤 live 반영/한 화면 wire 시각 검수를 진행합니다. 전체 npm test는 부모 통합 검증 범위입니다. 기존 detailed/UI 179개 보존이라는 실제 저장 샘플 화면 확인은 본체 근거이며 이 하위는 일반 fixture의 native 동등성과 accepted source section byte-equivalence를 확인했습니다.
