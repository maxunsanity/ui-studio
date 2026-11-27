# Scroll pin 독립 리뷰

codex(단이) / 2026-11-17 KST / 제안(검수 대기) / 제품 미연결 단계

## 결론

Viewport y0~912, Content 높이3350, marker 원래 y671·높이약90, top219의 요구에 산식이 맞습니다. 단, 핀 그룹을 Content 아래에 두고 유효한 inline top으로 배치해야 합니다. 이 MGV 배치를 막는 확정 계산 오류는 발견하지 않았습니다.

기존9개 통과는 전달받은 시험 기록이며 이번에는 재실행하지 않았습니다. 정적 검토를 제품 동작 완료로 해석할 수 없습니다.

## 읽은 범위

- plan.md 전체, scroll-pin.mjs 전체90줄, scroll-pin.test.mjs 전체177줄.
- 앞선 측정에서 직접 본 MGV03-S02 A~H와 추가2.0/2.5/4.0초 전체프레임을 요구 대조에 사용했습니다. 이번 리뷰에서 영상을 다시 디코딩하지 않았습니다.
- 제품 소스·모델·renderer·설계 JSON은 이번에 열거나 바꾸지 않았습니다. plan의 제품 연결 설명을 현재 제품 코드에서 독립 확인한 것은 아닙니다.
- 쓰기는 이 review.md 하나입니다. guide/STATUS/보고/제품/브라우저 변경0, 추가 하위 에이전트0입니다.

## MGV 계산

근거: scroll-pin.mjs:12-15,66-74. N671/H90/B3350/T219. Viewport912이므로 정상 최대 scrollTop은2438입니다.

| scrollTop | 보정 offset | 화면 y=671+offset-scrollTop |
|---:|---:|---:|
| 0 | 0 | 671 |
| 200 | 0 | 471 |
| 452 | 0 | 219 |
| 500 | 48 | 219 |
| 800 | 348 | 219 |
| 2438 | 1986 | 219 |
| 다시200 | 0 | 471 |
| 다시0 | 0 | 671 |

이는 새 시험 실행 결과가 아닌 산식 대입 검토입니다. 부모 끝 최대 offset은3350-90-671=2589라 이 MGV 범위에서는 먼저 걸리지 않습니다. Viewport가 화면 y0에서 시작할 때 설정 top219가 맞습니다. Viewport 시작점이 바뀌면 포트 로컬 좌표로 변환해야 합니다.

기존 fixture는 순수 산식에서 B1700, DOM double에서 viewport600/내용1700 등을 사용합니다(test.mjs:19,69-78). 따라서 정확히912/3350의 실제 native 배치를 검증한9개 시험은 아닙니다.

## 중요한 연결 조건

1. CurrentMarker 그룹은 ScrollViewport/Content3350 아래에 둡니다. 런타임은 세로 포트 조상이 없으면 건너뜁니다(mjs:36-41). 이전 측정의 Root/CurrentMarker는 시각 레이어 설명이었으며 이를 화면 직속 overlay 부모로 그대로 만들면 이 모듈로 핀되지 않습니다. Content에서 카드 뒤 형제로 그려 앞순서를 확보해야 합니다.
2. 금 패/숫자538/별/화살표는 같은 마커 그룹 자식으로 유지하고 그룹 하나만 핀으로 설정합니다. 카드/rail 전체를 고정하는 요구는 아닙니다.
3. renderer가 원본 style을 쓴 뒤 attach하고, 화면/overlay 제거 전에 dispose를 호출합니다. 독립 모듈만으로 제품 lifecycle에 연결된 것은 아닙니다(plan:65-76).

## 항목별 판단

| 항목 | 코드상 확인 | 남은 조건·위험 |
|---|---|---|
| 고정 px | 유한 수치 검증, 임계 전0·이후 보정·역방향 복귀. base top 문자열 보존(mjs:12-15,42,65-74). | 실제 native 부모/포트/671px/3350을 저장·재열기 뒤 확인해야 합니다. |
| percent/calc | computed top에서 지난 offset을 빼고 calc(baseTop + offset px)를 씁니다. 브라우저가 absolute top의 resolved px를 주는 정상 배치에서는 %를 유지하며 재계산할 구조입니다(mjs:52-54,65-74). | 기존 double은 top의 숫자를 추출하며 실제 %/중첩calc/CSSOM 해석을 검증하지 않습니다(test:55-63). |
| 부모 끝 | 중간 Content는 parentTop+clientTop+clientHeight, 직속 포트 자식은 scrollHeight를 경계로 사용(mjs:70). | 명시 Content3350에는 적합. border/padding, overflow 내용으로만 커지는 부모는 실제 브라우저 확인이 필요합니다. |
| 작은 부모 | 양의 보정 여지가 없으면0으로 유지(mjs:15). | 잘못된 원본 배치를 위로 당겨 고치는 기능은 아닙니다. |
| scroll 중 원위치 | currentTop-지난offset으로 자연 좌표를 구하고 offset0이면 baseTop 원문 복구(mjs:65-74). | 외부 renderer 새 top은 baseTop으로 갱신합니다. 핀 보정값을 원본 모델에 저장하지 않아야 합니다. |
| translate/transform | top만 쓰고 translate·transform·DOM 부모·z-index를 건드리지 않습니다(mjs:72). | 버튼 눌림 이동은 보존되나 앞순서를 자동 보장하지 않습니다. 회전/3D는 명시 범위 밖입니다. |
| cleanup | attach 시작 시 이전 scope dispose. 이벤트·observer 해제, 자신이 쓴 top일 때만 복구(mjs:18-25,82-88). | 실제 제거 경로가 dispose를 호출해야 합니다. 노드 삭제만으로 port/window listener가 해제되지는 않습니다. |
| resize | window resize 및 root/핀/직속부모/포트 ResizeObserver 재계산(mjs:78-81). | 중간 조상 위치만 변경되거나 재부모 후 크기가 같으면 자동 알림을 보장하지 않습니다. render 뒤 재attach가 필요합니다. |
| 가장 가까운 포트 | computed overflowY auto/scroll인 첫 조상, hidden/clip/visible 건너뜀(mjs:36-41). | 실제 CSS 축 해석과 offsetParent 경로가 포트를 통과하는지 확인해야 합니다. |
| 자식/입력 | 재부모·복제하지 않아 기존 자식/listener 계층 유지. | 실제 child hit·부모 입력 전달·키보드 focus·clipping·press는 double 시험 밖입니다. |

## 조건부 결함: 빈 inline top 또는 auto

근거: mjs:42,72-74.

자연 위치는 computed style/offsetTop으로 읽지만 쓸 기준 문자열은 node.style.top만 저장합니다. absolute 요소가 stylesheet top을 쓰고 inline top은 빈 문자열이거나 bottom 배치로 top:auto이면, 임계 뒤 calc( + 48px) 또는 calc(auto + 48px)를 만들 수 있습니다. 이는 유효한 길이 계산이 아니므로 브라우저가 대입을 거절할 수 있는데 record.offset은 계산한 값으로 갱신합니다. 다음 refresh의 자연 위치도 어긋날 수 있습니다.

명시 top671px인 MGV fixture의 확정 실패는 아닙니다. 그러나 axis-aligned absolute라는 조건만으로 이 경우가 제외되지는 않습니다. 제품 연결 시 유효한 inline px/%/calc만 허용함을 보장하거나 지원 불가 값을 명시적으로 검증해야 합니다. 기존 시험에는 이 경우가 없습니다.

## 좌표·조합 제약

근거: mjs:47-57,62-75, plan:92.

좌표는 DOM parent가 아닌 offsetParent 경로로 계산합니다. 포트가 static이고 offsetParent 경로가 포트를 건너뛰면 null이 되어 보정하지 않습니다. 실제 native absolute 포트가 containing block이라는 조건을 확인해야 합니다.

핀 조상이 먼저 움직이면 자손의 currentTop에도 그 변화가 들어갑니다. 조상·자손을 동시에 핀으로 허용하면 같은 루프의 처리 순서/경계 영향을 받습니다. plan은 미지원이라 적었지만 독립 validator는 값만 검사합니다. 제품 구조 검증에서 이 조합을 거절하거나 별도 의미와 시험을 정하기 전에는 지원으로 노출하지 않는 편이 맞습니다. MGV는 마커 그룹 하나만 핀으로 두면 됩니다.

## percent 최소 검수 사례

Content3350의 top20%는670, S500/T219이면 offset49이므로 calc(20% + 49px)=719, 화면 y219여야 합니다. Content 높이를3000으로 바꾸면 자연 top600, offset119로 재계산하여 같은 화면 y219를 유지해야 합니다. 역스크롤0에서는 원문20%로 복원되어야 합니다.

이는 실제 브라우저 검수에 쓸 예시이며 실행 결과가 아닙니다. MGV의671 값을20%로 바꾸자는 제안도 아닙니다.

## 미검수와 다음 범위

실브라우저/native UI/제품 전체시험/저장·재열기/390·430/물리 wheel·drag·키보드/버튼 누름/이미지404를 이번에 검수하지 않았습니다. 기존9개 시험도 재실행하지 않았습니다.

제품 연결 뒤 실제 0~912/3350/671 부모·기하와 S0→452→500→2438→0을 먼저 확인하고, % resize·부모 끝·가까운 포트·child pointer/press·화면/overlay 교체 후 cleanup을 확인해야 합니다. 현재 결과는 독립 구현 방식의 리뷰이며 제품 지원 완료나 원본 동등 승인이 아닙니다.

