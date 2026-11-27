# 공통 세 표현 후보 — 2026-11-18 10:01 KST

작성 codex(단이), 상태 제안(검수 대기). 라이브 소스·저장 설계 JSON·공용 보고/STATUS·서버·패키지는 수정하지 않았습니다. 소유 범위는 이 presentation/ 폴더뿐입니다.

## API / 통합

- `PRESENTATION_MODES`: wireframe / detailed-wireframe / ui, 표시 이름 와이어프레임 / 세부 와이어프레임 / 본 UI.
- `normalizePresentationMode(value)`: 알 수 없는 값은 현행 본 UI로 복귀.
- `presentationScreen(screen, mode)`: wireframe에서만 자원/컨트롤/제품 문구 없는 메모리 투영. 저장 원문은 불변. 나머지 두 모드는 원본 참조 그대로.
- `renderPresentation(screen, root, {presentationMode='ui', ...renderOptions})`: 기존 renderLayout 호출과 반환 계약 유지. UI/detailed는 renderer 옵션을 그대로 전달하므로 소비자가 `assetView:'art'`를 명시합니다.
- `applyPresentation(root, mode)`: 이미 그린 DOM에 CSS 표현/공유 알파 필터만 적용. UI/detailed의 기존 편집 renderer 뒤에 연결 가능. 자원 요청을 막아야 하는 wireframe은 반드시 renderPresentation을 사용합니다.
- `presentation.css`를 기존 styles.css 뒤에 1회 로드합니다.

최종 경로에 복사할 때 presentation.mjs의 첫 두 import 경로만 아래와 같이 바꿉니다.

```js
import {renderLayout} from './layout-view.mjs';
import {controlContainerIds} from './controls.mjs';
```

scratch 후보의 두 경로는 `../../../../../src/tools/uxStudio/...`여서 지금 이 위치에서도 직접 import할 수 있습니다. 시험 파일의 루트 import는 scratch 기준이며, src로 옮길 시험은 tests/ux-studio/ 경로 기준으로 고칩니다.

오버레이는 wireframe 렌더 전에 원본 skin을 적용하면 Image probe가 먼저 요청됩니다. 기존 root 준비에도 같은 투영을 사용해야 합니다.

```js
const drawing = presentationScreen(screen, mode);
applyOverlayRoot(root, drawing, {workspaceId, view: 'art'});
renderPresentation(screen, root, {
  presentationMode: mode, assetView: 'art', workspaceId,
  ...existingOptions
});
```

## 동작 / 경계

wireframe은 role/type/계층만으로 의미 있는 panel/list/card/group/container의 첫 분기 구역을 골라 그립니다. 하나의 좌표 wrapper만 있으면 첫 container 분기까지 내려갑니다. image/text/button과 frame/background/image/label/badge 장식은 구역 대상에서 제외합니다. 구역 이름은 편집 안내 라벨입니다. 구역과 필수 조상만 DOM에 올리며, 원래 요소 데이터는 반응형·자동 배치 계산에 그대로 남깁니다. 샘플 11개 요소에서 실제 마운트는 구역 2개+좌표 조상 1개입니다(속도 배수 주장 없음).

image/skin/control/buttonState/binding/notification/effects는 투영에서 제거합니다. 원본 text callback, content slots, 원본 children map을 넘겨도 wireframe 자원/문구가 다시 들어오지 않습니다. 원래 appearance는 자원 없는 좌표 박스의 has-appearance 규칙을 유지하고 숨깁니다. skin/image-filled/compact의 패딩·테두리 좌표 규칙은 전용 보기 class로 유지합니다. 부모 x/y/w/h·inset·anchors·safe-area·자동 배치·overflow는 기존 renderer가 유일하게 계산합니다.

detailed-wireframe은 원본 img와 SVG sprite crop을 그대로 두고 SourceAlpha 기반 단색+얇은 외곽+얕은 그림자를 적용합니다. root당 SVG filter 하나만 둡니다. 3/9slice의 원래 texture/state/source·slices·edges·repeat를 그대로 상속하는 pseudo paint layer만 필터합니다. native 텍스트/컨트롤/input root에는 그림 필터를 걸지 않습니다. 원문의 내용/폰트/크기/줄/배치는 유지하며, 흰색 제목이 흰 실루엣에서 사라지지 않도록 보기 전용 어두운 중성 ink를 씁니다. root 스킨은 isolation으로 pseudo layer를 자기 배경 위에 둡니다.

UI는 현행 renderLayout 데이터·옵션·DOM으로 복원됩니다. 프로젝트명·요소 ID·제품명 분기, 자원 교체/생성/저장, 신규 패키지, editor engine 초기화는 없습니다.

## RED → GREEN

1. 구현 전에 10개 시험을 작성해 API/동작 부재로 0/10 실패를 확인했습니다: red.log.
2. 최소 구현 후 fixture의 실제 DOM 차이(cssText 재설정, CSSStyleDeclaration 메서드, SVG 태그 대소문자)와 명시 workspace 입력을 시험 어댑터에서 바로잡았습니다. 공용 fixture는 수정하지 않았습니다.
3. leaf DOM 제거 기준을 추가해 기존 구현이 9/10·1실패함을 확인했습니다: leaf-dom-red.log.
4. 구역+조상만 마운트하도록 보정한 뒤 후보 10/10 통과했습니다.
5. 최종 후보 구문 검사 통과, 후보 10+기존 버튼/스킨/가이드 회귀 33 = 43/43 통과했습니다: related-green.log.

실행 명령:

```sh
node --check _작업/codex/ux-studio/ux-refresh-20261118/presentation/presentation.mjs
node --test tests/ux-studio/button-state.test.mjs tests/ux-studio/button-state-sliced-skin.test.mjs tests/ux-studio/button-press-depth.test.mjs tests/ux-studio/skins.test.mjs tests/ux-studio/design-guides.test.mjs tests/ux-studio/highlighted-skin.test.mjs _작업/codex/ux-studio/ux-refresh-20261118/presentation/presentation.test.mjs
```

시험 내용: fallback, 원문 불변, 자원 probe 0, img/SVG image/control 0, zone/ancestor DOM 범위, 다국어 native text·입력 값·typography, sprite crop, 9slice, 3slice pressed source/input root, 동일 좌표 스타일, mode 왕복 원래 DOM/resources, 화면 root skin 준비.

## 부모 통합 시 남은 확인

실제 브라우저 CSS 계산/paint 검수는 아직 하지 않았습니다. DOM fixture는 CSS cascade·알파 시각·실제 네트워크를 수행하지 않으므로 위 자동 시험을 실화면 검수로 부르지 않습니다. 흰색 원문 텍스트의 어두운 ink 계산·대비, 3/9slice 외곽과 native text 분리, window root pseudo layer가 배경 뒤에 가려지지 않는지, 1440/430에서 구역과 부모 geometry가 같게 유지되는지, 실제 asset network/404·넘침을 첫 한 화면 3표현 샘플로 확인해야 합니다.

전체 npm test는 이 하위의 소유 범위 밖 scratch 저장 시험도 포함하므로 여기서는 실행하지 않았습니다. 부모가 최종 소스 통합 뒤 전체 suite를 실행해야 합니다. 후보는 저장/불러오기 제품 동작 완료나 시각 동등 완료를 주장하지 않습니다. wireframe은 container 의미를 명시한 계층을 사용하므로 구역이 전혀 없고 leaf만 있는 화면은 보드 경계만 보입니다. 구조를 제품명/ID 예외로 추측하지 않습니다.

## 검토 보정 — CSS 상태 우선순위와 공통 샘플 root

기존 styles.css:2632의 live hover/focus-visible/active `!important` source는 specificity 0,3,0이라 기존 detailed parent 차단 0,2,0보다 우선했습니다. 후보에 root/descendant live 상태별 parent `border-image-source:none!important`(0,4,0)를 추가했습니다. pseudo paint layer는 root/descendant 모두 실제 highlighted/pressed source를 계속 상속합니다.

main preview dialog에도 sample viewer가 들어가므로 sample-preview.html에만 있던 `.sample-screen`/`.sample-panel`의 absolute 좌표·overflow hidden·game-skin slice paint 기본 규칙을 공통 presentation.css에 추가했습니다. 폭/높이/left/top/input root나 저장 좌표는 추가로 변경하지 않습니다. overview-navigation.css의 더 구체적인 `.overview-preview .sample-panel` overflow visible 규칙은 부모 통합 작업에서 별도로 제거해야 합니다.

`presentation-cascade-check.html`은 CSS 텍스트를 비교하지 않습니다. 기존 styles.css와 후보 CSS를 실제 브라우저에 로드한 뒤 후보 disabled/enabled를 전환하고 `getComputedStyle`/실제 focus-visible/좌표 박스로 RED→GREEN을 판정합니다. UI sample-screen 원래 source·sample root 클립·root/descendant focus parent colored source 차단·pseudo state source 유지·native 문구/typography/ink·상태 전환 geometry를 확인합니다. 실제 포인터 hover/active는 두 상태 영역에 포인터를 올리고 눌러 별도 PASS/FAIL 기록을 봅니다. 파일을 로컬 브라우저에서 열거나 기존 허용 static serving으로 여세요. 새 서버는 필요하지 않습니다.

이 하위 작업에서는 브라우저 CSS 회귀 HTML을 실행하지 않았으므로 CSS 실제 통과를 주장하지 않습니다. 수정 뒤 Node 회귀는 43/43 통과했습니다(related-green.log). 최종 후보 모듈/CSS/시험/브라우저 회귀 HTML/README는 SHA256SUMS에 고정했습니다. 부모가 복사 전에 `shasum -a 256 -c SHA256SUMS`로 확인할 수 있습니다.
