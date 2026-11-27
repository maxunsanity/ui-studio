# 재산 갤러리 MGV03-S02 측정·native 부품명세

codex 측정보조 / 2026-11-17T17:03:53+09:00 / 제안(검수 대기)

## 원본과 판단 범위

- 원본ID MGV03, 화면 MGV03-S02, family net-worth-gallery. 레벨.mov,7.96초·24fps·1920×1080. 영상 파일명과 실제 화면 제목 재산 갤러리를 구분합니다.
- 원본 SHA: c948bcbb57cba234c1a1e77654e0fde9d7b35b16051801d86a455067b99e9608. 원본 메타/관찰/전환은 docs/reference/monopoly-go/video-analysis-20261117/MGV03/meta.json · screens.json · transitions.json · notes.md. 결합 inventory와 공통규칙·토큰을 읽었습니다.
- A~H crop8개를 view_image로 모두 직접 확인했습니다. 추가2.0/2.5/4.0초 전체프레임과0.0/7.5초 PNG도 직접 확인했습니다. A/D/E/F는 native PNG crop, B/C/G/H는 JPEG 검토프레임의 PNG crop이며 JPEG 흔적이 남습니다.
- ROI [650,28,592,1052]. logicalX=ROIx×551/592, logicalY=ROIy×984/1052. 전체프레임 좌표는 ROI좌표에[650,28]을 더합니다. ROI를 원본 논리551×984로 주장하지 않습니다. 수동 가시경계±3~4원본px·글자±5.
- 관찰 근사와 아래 normalized 제작 제안, 공통 토큰을 분리했습니다. 토큰이 개별 screenshot좌표보다 우선합니다.
- 부모가 전달한 최신 지시: r300 입체버튼 방식 컨펌, 남은페이지 계속. 2px는 이번 버튼 예시이며 모든 버튼 강제값이 아닙니다. 원본 pressed/전체 화면 최종동등 승인으로 확대하지 않습니다.

## 고정 영역 좌표

전체 global logical rect와 화면% rect는 다음과 같습니다. source 원본 ROI rect/상세근거는 measure.json.parts에 있습니다. 공통 최신 토큰 guideVersion=2026-11-17.29.

| 부품 | logical [x,y,w,h] | 화면% [x,y,w,h] | 판단 |
|---|---|---|---|
| GalleryRoot | [0, 0, 551, 984] | [0.0, 0.0, 100.0, 100.0] | native-proposal |
| GalleryBG | [0.0, 0.0, 551.0, 984.0] | [0.0, 0.0, 100.0, 100.0] | observed-approx |
| ScrollViewport | [0, 0, 551, 912] | [0.0, 0.0, 100.0, 92.683] | token-derived/proposal |
| TitleGroup | [192.66, 0.0, 171.26, 155.27] | [34.966, 0.0, 31.082, 15.779] | observed-approx |
| TitleMarker | [243.85, 3.74, 63.29, 54.25] | [44.256, 0.38, 11.486, 5.513] | observed-approx |
| TitleNetWorth | [238.27, 29.0, 72.6, 39.29] | [43.243, 2.947, 13.176, 3.993] | observed-approx |
| TitleGallery | [200.11, 71.09, 154.5, 53.32] | [36.318, 7.225, 28.04, 5.419] | observed-approx |
| TitleOrnament | [194.53, 115.98, 169.4, 36.48] | [35.305, 11.787, 30.744, 3.707] | observed-approx |
| InfoHit | [8, 4, 44, 44] | [1.452, 0.407, 7.985, 4.472] | token-derived/proposal |
| InfoDisc | [14.89, 8.42, 32.58, 36.48] | [2.702, 0.856, 5.913, 3.707] | observed-approx |
| InfoGlyph | [16, 12, 28, 28] | [2.904, 1.22, 5.082, 2.846] | token-derived/proposal |
| RailFrame | [433.73, 0.0, 76.32, 912.91] | [78.717, 0.0, 13.851, 92.775] | observed-approx |
| RailCore | [447.69, 0.0, 47.47, 912.91] | [81.25, 0.0, 8.615, 92.775] | observed-approx |
| CurrentArrow | [452.34, 186.14, 36.3, 34.61] | [82.094, 18.917, 6.588, 3.517] | observed-approx |
| CurrentMarker | [399.29, 218.87, 140.54, 88.86] | [72.466, 22.243, 25.506, 9.03] | observed-approx |
| CurrentBadge | [454.2, 222.62, 28.85, 27.13] | [82.432, 22.624, 5.236, 2.757] | observed-approx |
| CurrentValue | [432.8, 247.87, 71.67, 36.48] | [78.548, 25.19, 13.007, 3.707] | observed-approx |
| Footer | [0, 912, 551, 72] | [0.0, 92.683, 100.0, 7.317] | token-derived |
| FooterLine | [0, 912, 551, 6] | [0.0, 92.683, 100.0, 0.61] | token-derived |
| CloseHit | [253.5, 940, 44, 44] | [46.007, 95.528, 7.985, 4.472] | token-derived |
| CloseGlyph | [261.5, 948, 28, 28] | [47.459, 96.341, 5.082, 2.846] | token-derived |
| DoorLeft | [0.0, 0.0, 275.5, 984.0] | [0.0, 0.0, 50.0, 100.0] | observed-approx |
| DoorRight | [275.5, 0.0, 275.5, 984.0] | [50.0, 0.0, 50.0, 100.0] | observed-approx |
| DoorHandleLeft | [48.4, 298.38, 64.22, 360.11] | [8.784, 30.323, 11.655, 36.597] | observed-approx |
| DoorHandleRight | [422.56, 298.38, 64.22, 360.11] | [76.69, 30.323, 11.655, 36.597] | observed-approx |
| DoorMedallion | [164.74, 376.02, 215.93, 216.07] | [29.898, 38.213, 39.189, 21.958] | observed-approx |

- Gallery는 Main 현금/SNS strip이 미관찰인 별도 top 제목 variant입니다. top 고정·공통 navigationAction44/28을 지키며 불필요한 cash header를 붙이지 않습니다.
- 제목은 native 재산/갤러리와 투명 별/금 곡선장식으로 분리합니다. i는 native text+의도된 disc art+투명 hit. 전체 로고나 전체 UI screenshot을 한 장 붙이지 않습니다.
- footer는 공통551×72/y912, 선6, hit[253.5,940,44,44], glyph[261.5,948,28,28], 중심[275.5,962]. 원본몇px 차이로 변형하지 않습니다.
- 목록은 제목 뒤로 지나가므로 별도 빈 header 공간으로 밀지 않습니다. 그림/art·native text·frame·input·엔진 그림자는 분리합니다.

## 카드 family·동일행 규격

1.5초 D는 진입 scale중이며2.0/2.5초 이후와 크기가 다릅니다. E/F와 후반 전체프레임을 기준으로 공통 family를 제안합니다. 상태별 bbox를 화면별 규격으로 승격하지 않습니다.

| family(제안) | 외곽W×H | 값판 local | 그림 local | 캡션 local | 근거 |
|---|---|---|---|---|
| silver | [180, 276] | [27, 16, 126, 36] | [28, 70, 116, 141] | [24, 216, 132, 39] | E450/F200/F180 |
| bronze | [164, 261] | [14, 9, 133, 33] | [26, 65, 110, 140] | [20, 211, 124, 28] | E400/E325/F160 |
| prismatic | [188, 304] | [34, 36, 124, 36] | [39, 90, 108, 141] | [30, 238, 130, 31] | D575/F225/4.0s300 |
| gold | [184, 292] | [30, 26, 123, 37] | [29, 78, 123, 143] | [23, 226, 138, 30] | E350 |

- 공통 slot196×308, 좌/우 중심X≈102/302logical, 번호판 세로간격 약194logical(원본 약207px). family외곽은slot중앙. 가족마다 돔/높이를 보존하되 같은 family의 값·폰트·캡션 박스는 좌/우/스크롤과 무관하게 공유합니다.
- 값font24logical·캡션font16logical 굵게는 제작 제안이며 실제 원본서체 미확인. 긴180캡션은 공통박스2줄,140제목은 null.
- 자식 순서: 엔진 외부그림자→frame아트/9slice→값판아트→별아트/native값→별도그림/내부frame→native캡션→상태딤/자물쇠/리본. 다음 순서를 리본그림에 굽지 않습니다.
- Silver는 하늘색 리본형 상단/금 안쪽, Bronze는 갈색·주황 frame, Prismatic은 무지개/금 윤곽/상단별, Gold350은금관형/보라안쪽입니다. 모든카드를 한frame으로 바꾸지 않습니다.

| 관찰 값 | native문구 | 열 | family | 상태 |
|---|---|---|---|---|
| 600 | 주사위 생성 | left | silver | locked + cyan dim + separate lock |
| 575 | 거물 익스프레스 | right | prismatic | locked + cyan dim + separate lock |
| 550 | 보드 보상 | left | bronze | next: cyan glow/red ribbon/check decoration |
| 500 | 임대료 목표 | right | silver | visible prior milestone; activation unobserved |
| 450 | 최대 주사위 | left | silver | visible prior milestone; activation unobserved |
| 400 | 복불복 카드 | right | bronze | visible prior milestone; activation unobserved |
| 350 | 셧다운 | left | gold | visible prior milestone; activation unobserved |
| 325 | 소유지 | right | bronze | visible prior milestone; activation unobserved |
| 300 | 스티커로 보상 획득 | left | prismatic | visible prior milestone; activation unobserved |
| 275 | 주사위 생성 | right | silver | visible prior milestone; activation unobserved |
| 250 | 임대료 목표 | left | silver | visible prior milestone; activation unobserved |
| 225 | 반응 | right | prismatic | visible prior milestone; activation unobserved |
| 200 | 최대 주사위 | left | silver | visible prior milestone; activation unobserved |
| 180 | 파란색 소유지 임대료 | right | silver | visible prior milestone; activation unobserved |
| 160 | 방패 | left | bronze | visible prior milestone; activation unobserved |
| 140 | 미관찰(null) | right | silver | visible prior milestone; activation unobserved |

-600/575 lock·청록딤,550광채/체크/다음순서리본은 관찰이며 실제 해금·지급·조건/API는 미관찰입니다. observed 숫자는 balance 권위가 아니며 기존Main값에 덮어쓰지 않습니다.

## 레이어·진행관·스크롤·입력

- Root/Background → ScrollViewport/Content/{Rail,MilestoneSlots} → CurrentMarker → Header/Info → Footer/Close. 문 전환은 두 문잎을 foreground에 두고 제목은 등장 뒤 문 위에 유지합니다.
- 우측은 scrollbar가 아닌 milestone 진행관. 금레일/안쪽빈관/별token stream/현재패/native538을 분리합니다. D는538위쪽이 비고 아래에별, E/F는관에별이많이보입니다. 실제fill계산식은미확인.
- 538패는 D ROIy≈718(logical≈671.6)에서 E/F ROIy≈234(logical≈218.9)로 올라간 뒤 위에 머뭅니다. 모든상태에 고정y를 강제하지 않습니다. 제작 제안은scroll연결이동 후logicalY≈219상단clamp. 정확한 부모/threshold/easing은미확인, 엔진 미지원이면한계표시.
- 콘텐츠는위로움직이며600→140의더낮은값을드러냅니다. 제목/i/footer는유지. viewport0~912에clip, 제목뒤/하단앞에서카드를가립니다. 총길이/140아래는미관찰이므로새stage를창작하지않습니다.
- i/카드 목적지와클릭/획득은미관찰 targetnull. 카드기본은비입력그룹. Close→main-board만영상순서대응이며exact mouse-down/API는입증되지않았습니다.
- nativepreview drag/wheel/keyboardscroll은제작제안. 원본입력수단을단정하지않습니다. r300을적용할버튼은hit고정/전체입체상태그림/nativecontent분리, 이미눌린그림에같은이동을중복하지않고2px일괄강제하지않습니다.

## 관찰된 이동

| 시각초 | 근거 | 실제 관찰 | 미확인 |
|---|---|---|---|
| [0, 0.125] | MGV03-T01 | menu 재산 row/cursor → closed door | mouse-down/API; Main→Menu before clip |
| [0.625, 1.208333] | MGV03-T02/T03/T04 | closed door → title appears → door leaves open laterally → gallery | exact easing/duration/hierarchy |
| [1.5, 3.5] | MGV03-T05 | 550/500/450 →450/400/350/325 as cards move upward; title/footer stay | physical wheel/drag/inertia |
| [3.5, 5] | MGV03-T06 | 450–325 →250–160;538 marker remains near top aroundROIy234 | exact sticky policy |
| [6.333333, 7.5] | MGV03-T07/T08/T09/T10 | low milestones → doors close then open →Main | exact X activation/automatic cause/gameAPI |

- 문은두잎각275.5logical×984의별도art·손잡이·분할중앙문양. A문닫힘→B제목등장→C좌우열림,6.4초뒤닫힘→7.3초Main위에서열림을관찰했습니다. 샘플시간은확정duration/easing이아닙니다.

## 반응형·본체 검수

-390×844/430×932:551×984basis비례,header top/footer bottom·중앙Close,2열card비율유지. 그림/프레임세로늘림금지. safeArea는null로유지합니다.
- 가변logical폭은별도제안:제목중앙·Info좌·rail우·footer폭/Close중앙,cardfamily크기고정. 기기비례preview를가변폭검증으로쓰지않습니다.
- native save/reopen·기존ID/edge보존,390/430이미지실패0·가로넘침0,실제scroll550→160/140과538이동/clamp·고정제목/footer,Close pointer/Space/Enter Main복귀,i/카드null,180두줄/140null,투명hit/중간parent입력전달·중복그림자확인이필요합니다.
- 이번보조작업은파일/영상관찰·측정만했으며native제작/저장·브라우저/장치/기능시험·사용자최종동등검수는실시하지않았습니다.

## 저장범위

- /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/networth13/measure.md
- /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/networth13/measure.json
- 위두파일만작성. 소스/설계JSON/공통가이드/STATUS/보고변경없음. 보호파일·Kpop·모노원본·2차Capybara영역접근없음.
