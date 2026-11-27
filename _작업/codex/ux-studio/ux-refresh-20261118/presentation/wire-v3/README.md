# 기본 와이어 v3 후보 — 제안(검수 대기)

API 변경 없음. 현재 live presentation.mjs/css를 기준으로 와이어의 겹침만 줄였습니다. live0수정, HMR0, 저장 JSON/자원/원화/다른 담당 작업0수정입니다. 원본 module/CSS는 이 폴더 live-presentation.mjs/css에 보존했습니다.

기존 부모 계층·action owner·partRole와 기존 resolveResponsiveRect만 사용합니다. 새 배치 계산이나 저장 필드가 없습니다. wire 전용 helper는 부모/액션과 거의 같은 full-area 그림, 같은 부모의 action을 넓게 덮는 배경형 그림, badge 계층, 작고 얇은 선을 제외합니다. 같은 action에는 대표 그림 최대1개만 남깁니다. 겹친 원판/림보다 안쪽 슬롯을 우선하며 원래 ID·박스·위치는 바꾸지 않습니다. action이 없는 겹친 슬롯도 한 개로 줄이고 떨어진 아이콘은 각각 유지합니다. 실제 텍스트 행·개행은 그대로이며 작은 badge 장식 행만 제외합니다.

logicalSize는 기존 sampleSize처럼 w??width??390 / h??height??844만 정규화합니다. 별칭/legacy 때문에 resolver에 undefined 크기가 들어가는 실패를 시험으로 확인하고 두 줄 정규화로 보정했습니다.

presentation.css 전체, alphaFilter 본문, applyPresentation 본문은 현재 live baseline과 byte-equivalent입니다(scope-check.log). 상세/UI native 출력은 live 사전 비교 시험으로 보존을 확인했습니다. 전체 CSS는 변경되지 않았으므로 부모가 다시 복사할 필요 없습니다. 본체가 수정한 wire paper와 상세 native input의 밝은 바탕도 그대로입니다.

## r354 읽기 계측

읽은 원본: /Users/max/projest_max/ui-studio/samples/monopoly-go/ui-studio/designs/ux-gjs-0d80d7fe.json (revision354, Main179개 요소). 원본 문서 객체와 파일 bytes 모두 전후 불변(r354-check.log).

| 항목 | live v2 | 후보 v3 |
|---|---:|---:|
| 큰 구역 | 4 | 4 |
| action 외곽 | 20 | 20 |
| image 자리 | 57 | 21 |
| text 행 | 48 | 32 |
| 마운트된 요소 | 149 | 84 |
| action당 image 최대 | 4 | 1 |
| img/SVG image/native control/resource probe | 0 | 0 |

이는 DOM fixture 계측이며 실제 네트워크·CSS 화면 검수를 주장하지 않습니다.

## 검증 / 부모 통합

- RED: v2의 겹침/중복/배경 표시를 generic fixture에서 재현(red.log).
- size alias RED: 별칭에서 resolver 오류 재현(size-alias-red.log).
- GREEN: 후보17 + 기존 버튼/스킨/가이드33 = 50/50(related-green.log).
- node --check 통과.
- fixture는 full-background, action 동일 박스, circle/art/rim, 작은 badge, 얇은 선, nested action, 실제 text 줄과 shared data 불변, 떨어진 standalone icon, native UI/detailed 동등을 검사합니다.
- 사전 live 동등 1항목은 통합 후 자기비교가 되므로 scratch에 보존하고 최종 live 시험에서 제외합니다. 통합할 동작 시험은 16개입니다.

모듈 처음 4개 import를 최종 src 위치에 맞춰 ./layout-view.mjs, ./controls.mjs, ./parts.mjs, ./responsive-layout.mjs로 바꾸면 됩니다. scratch 시험은 상대 경로를 tests/ux-studio 기준으로 조정합니다. 전체 npm test와 실제 wire 화면 확인은 부모 통합 후 수행합니다. 같은 박스의 원화 레이어 의미를 추측하지 않고 계층·기하로 대표를 고르는 기본 보기이므로, 상세 원화 구성은 승인된 세부 와이어/본 UI에 보존합니다.
