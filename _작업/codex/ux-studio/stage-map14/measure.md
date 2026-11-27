# 스테이지 지도 측정·분리 명세

codex(단이) / 2026-11-17T17:46:50+09:00 / 제안(검수 대기)

## 결론

한 family의 지도 화면에 현재17/현재18 데이터 구성과 잠김→해제 상태를 분리하는 것이 최소안입니다. 지도 안에는 실제 제목·공통HUD·footer·X·Back이 관찰되지 않았습니다. 공통footer를 습관적으로 붙이거나 stage카드에 클릭 목적지를 만들지 않습니다.
섬·방·트랙·트로피·말은 3D 장면 참고/명시3D표시로, 분홍 리본·native이름·금 자물쇠·점선길·구름은 별도 부품으로 분리합니다. 전체 screenshot을 제품 자원으로 대체하지 않습니다.

## 직접 읽고 본 원본

- 결합 ui-inventory.json에서 stage-map / MGV04-S01 / MGV05-S04만 선택했습니다. 해당 두 영상의 meta.json, 선택 screen기록, 관련 transition기록, notes.md와 공통토큰 .29를 읽었습니다.
- 안정 crop4개와 원본 전체2개, 이동 JPEG6개를 실제 view_image로 보았습니다. 안정4개는 직접원본PNG의 무배율crop입니다. 이동 JPEG는 압축 검토프레임이며 PNG원본으로 주장하지 않습니다.
- 생산 자원 후보3개도 실제 view_image로 확인했습니다. 이번에 새 그림 생성/추출/등록/설계/실브라우저/시험은 하지 않았습니다.

| 화면/상태 | 시각 | 직접 본 crop |
|---|---:|---|
| MGV04-S01-A | 0 | docs/reference/monopoly-go/video-analysis-20261117/MGV04/frames/game-crops/stable-frame_00000.png |
| MGV04-S01-B | 3 | docs/reference/monopoly-go/video-analysis-20261117/MGV04/frames/game-crops/stable-frame_00001.png |
| MGV05-S04-A | 18.5 | docs/reference/monopoly-go/video-analysis-20261117/MGV05/frames/game-crops/map-locked-18.500.png |
| MGV05-S04-B | 21 | docs/reference/monopoly-go/video-analysis-20261117/MGV05/frames/game-crops/stable-frame_00003.png |

| 영상 | 원본/길이 | SHA256 |
|---|---|---|
| MGV04 | 스테이지 이동.mov / 34.625초 /1920×1080·24fps | d74b905c786e1041107ab483d7279f5fa44cbf939af4891624b4e58b637179db |
| MGV05 | 스테이지 클리어 .mov / 37.666666666666664초 /1920×1080·24fps | 272a31011defdec398fb7ea1288de40ba3d7d82162840387868456f7b291b191 |

## 좌표와 여백

- MGV04 ROI[655,0,610,1080], MGV05-A[738,0,443,1080], B[739,0,442,1080]. 원본 full-frame 좌표는 각 ROI 원점에 아래 좌표를 더합니다.
- JSON parts에는 원본ROI rect, 화면%, 직접환산551×984 rect와 가로기준균일배율 크기를 함께 적었습니다. 수동경계±4원본px·글자±5입니다.
- MGV04 종횡비는 제작551×984와 가깝지만 MGV05는 훨씬 좁고 깁니다. MGV05에 x=551/443,y=984/1080을 각각 강제로 적용하면 섬/리본이 가로로 늘어납니다. 직접환산rect는 위치·영역비교용이며 제품그림 크기 계약이 아닙니다. 아트는 균일배율/contain, 그룹은 기기종횡비에 맞게 재배치합니다.

| 참고 | 좌/우 여백 | stage그룹 y범위 | 세로 비장면 간격 |
|---|---|---|
| MGV04 | {'leftPx': 121, 'rightPx': 119, 'leftPct': 19.84, 'rightPct': 19.51} | [[0, 275], [324, 675], [758, 1049]] | [49, 83, 31]px / [4.54, 7.69, 2.87]% |
| MGV05 | {'leftPx': 83, 'rightPx': 82, 'leftPct': 18.74, 'rightPct': 18.51} | [[77, 337], [390, 638], [653, 917]] | [77, 53, 15, 163]px / [7.13, 4.91, 1.39, 15.09]% |

- 위 여백은 불투명 섬/리본 묶음의 경계 사이이며, 구름은 그 공간에도 지나갑니다. MGV04의 미래18은 화면 위로 일부 잘리고, MGV05는 위 약7%·아래 약15% 하늘 여유가 보입니다. 이를 새safeArea값으로 저장하지 않습니다.

## 화면별 부품 실측

아래는 원본ROI [x,y,w,h]. 전체%/551×984 비교값/균일배율은 JSON에 있습니다. group이3D인 영역은 장면 그림참고/3D표시로 남깁니다.

| 화면 | 부품 | 상태 | 원본ROI rect | 근거/분리 |
|---|---|---|---|
| MGV04-S01 | Background | A/B | [0, 0, 610, 1080] | native gradient/fill; no map screenshot |
| MGV04-S01 | CloudTopLeft | A/B | [0, 29, 138, 109] | background decoration |
| MGV04-S01 | CloudMiddleLeft | A/B | [37, 315, 297, 149] | behind scene17 |
| MGV04-S01 | CloudMiddleRight | A/B | [419, 259, 191, 158] | right edge clipped |
| MGV04-S01 | CloudLowerRight | A/B | [421, 716, 160, 112] | between17/16 |
| MGV04-S01 | Stage18Scene3D | A/B | [145, 0, 319, 274] | top clipped; cyan locked; Monaco full trophy top unobserved here |
| MGV04-S01 | Stage18Ribbon | A/B | [121, 181, 370, 84] | separate blank art; native label |
| MGV04-S01 | Stage18Label | A/B | [212, 220, 191, 32] | 18 - 모나코 |
| MGV04-S01 | Stage18Lock | A/B | [261, 9, 91, 126] | separate gold closed lock in A/B |
| MGV04-S01 | Stage17Scene3D | A/B | [149, 324, 315, 351] | cyan locked A; full-color room B; separate picture/3D slot |
| MGV04-S01 | Stage17Ribbon | A/B | [121, 582, 370, 88] | same family as other stages |
| MGV04-S01 | Stage17Label | A/B | [201, 622, 213, 34] | 17 - 리틀 M의 방 |
| MGV04-S01 | Stage17Lock | A | [261, 433, 91, 121] | A visible; B absent |
| MGV04-S01 | Stage16Scene3D | A/B | [121, 758, 355, 291] | Tokyo torii/cherry island; full color A/B |
| MGV04-S01 | Stage16Ribbon | A/B | [121, 957, 370, 84] | same ribbon family |
| MGV04-S01 | Stage16Label | A/B | [244, 999, 130, 31] | 16 - 도쿄 |
| MGV04-S01 | Route16to17 | B | [188, 670, 236, 91] | white curved dashed path; B visible, A absent |
| MGV04-S01 | PawnMovingGroupPose1 | transition | [175, 685, 172, 127] | 1.0s full JPEG: pawn/tile above stage16 |
| MGV04-S01 | PawnMovingGroupPose2 | transition | [305, 535, 170, 128] | 1.5s full JPEG: pawn/tile in front of stage17 ribbon |
| MGV04-S01 | UnlockLockPose | transition | [259, 348, 121, 203] | 2.0s full JPEG: lock shackle opens/rotates over colored room, rays visible |
| MGV05-S04 | Background | A/B | [0, 0, 443, 1080] | same peach→pink→blue motif; tall narrow source |
| MGV05-S04 | CloudTopLeft | A/B | [0, 10, 113, 106] | background decoration |
| MGV05-S04 | CloudUpperRight | A/B | [247, 85, 169, 104] | behind stage19 |
| MGV05-S04 | CloudMiddle | A/B | [188, 314, 142, 78] | between19/18 |
| MGV05-S04 | CloudBottomLeft | A/B | [20, 853, 164, 76] | behind17 |
| MGV05-S04 | Stage19Scene3D | A/B | [102, 77, 239, 260] | locked cyan fantasy/Atlantis floating island only; unlocked art unobserved |
| MGV05-S04 | Stage19Ribbon | A/B | [83, 266, 278, 64] | blank ribbon art separate from label |
| MGV05-S04 | Stage19Label | A/B | [147, 297, 154, 28] | 19 - 아틀란티스; new direct transcription, inventory previously left untranscribed |
| MGV05-S04 | Stage19Lock | A/B | [189, 145, 67, 89] | closed lock A/B |
| MGV05-S04 | Stage18Scene3D | A/B | [100, 390, 240, 248] | Monaco trophy/track island: cyan A, full color B |
| MGV05-S04 | Stage18Ribbon | A/B | [83, 567, 278, 66] | same ribbon family |
| MGV05-S04 | Stage18Label | A/B | [168, 599, 118, 28] | 18 - 모나코 |
| MGV05-S04 | Stage18Lock | A | [189, 456, 68, 89] | A visible; B absent |
| MGV05-S04 | Stage17Scene3D | A/B | [104, 653, 235, 264] | same Little M room scene as MGV04 B, uniformly smaller in source |
| MGV05-S04 | Stage17Ribbon | A/B | [83, 847, 278, 65] | same ribbon family |
| MGV05-S04 | Stage17Label | A/B | [111, 876, 223, 29] | 17 - 리틀 M의 방 |
| MGV05-S04 | Route17to18 | B | [139, 638, 162, 64] | white dashed path appears B/during transition |
| MGV05-S04 | PawnMovingGroupPose1 | transition | [107, 701, 124, 92] | 19.0s JPEG: pawn/tile in front of room17 |
| MGV05-S04 | PawnMovingGroupPose2 | transition | [200, 579, 126, 92] | 19.5s JPEG: pawn/tile below18 ribbon |

## 상태와 직접 관찰 문구

- MGV04 A:16도쿄는색상,17리틀M의방/18모나코는청록단색 장면+금자물쇠. B:17장면이색상으로밝아지고17자물쇠가없으며16→17점선길이보입니다.18은계속잠김.
- 직접 본 이동:1.0초 말/타일이16위,1.5초에는17리본앞으로이동.2.0초에는 열린 자물쇠와 광선,3.0초안정에는 자물쇠가없습니다. 정확한경로/easing/시간계약은미확인입니다.
- MGV05 A:17방은색상,18모나코/19는청록장면+금자물쇠. B:18의트로피·트랙장면이색상으로보이고18자물쇠가없습니다.19는계속잠김.
- 직접 본 이동:19.0초말/타일이17방앞,19.5초에는18리본아래,20.0초에는점선길이보입니다. 이는포인터클릭을입증하지않습니다.
- MGV04의0초 전체색은3초보다어둡습니다. 전체페이드/조명의영향도있으므로 A/B 전체색차를전부 잠금색으로굽지않습니다.

| 값 | native문구 | 근거/상태 |
|---|---|---|
| 16 | 도쿄 | MGV04-S01 A/B; directly observed |
| 17 | 리틀 M의 방 | MGV04-S01 A/B;MGV05-S04 A/B; directly observed |
| 18 | 모나코 | all4states; directly observed |
| 19 | 아틀란티스 | MGV05-S04 A/B +19.0/19.5/20.0JPEG; new direct transcription proposal; inventory still says untranscribed; inventory not modified |

-19의아틀란티스는 이번 실제crop에서 새로 읽은 전사 제안입니다. 기존inventory는19문구를미전사로뒀으며 이번에정본을고치지않았습니다. 숫자16~19는관찰표시일뿐 새게임플레이수치/조건을뜻하지않습니다.

## footer·입력·scroll·연결

- 공통토큰의 footer551×72/Close44/glyph28은 존재하지만 이 지도4상태에는적용부품이보이지않습니다. 실제footer/X/Back/상단제목/스크롤바를새로넣지않습니다.
- 세로지도라는구성과3단계를보았으나 수동drag/wheel/scroll범위는미관찰입니다. 초기native는3개단계가보이는clip구조로잡고 interactive scroll은관찰/명시요청없이확정하지않습니다.
- 카드영역의입력활성/대상은모두미관찰 targetnull. 입장/퇴장은 아래 원본전환기록의시각적연결이며클릭조건이나API가아닙니다. 이전완료/다음보드endpoint는이번측정에서새로열어검수하지않았습니다.

| 원본전환ID | 시간 | 원본에서 기록한 연결 | trigger/클릭 |
|---|---|---|---|
| MGV04-T01 | [0, 0] | None → MGV04-S01; Video starts on the stage map; previous page/entry control is absent. | null / 미입증 |
| MGV04-T02 | [0.5, 2.5] | MGV04-S01 → MGV04-S01; Pawn moves16→17; stage17 lock becomes unlocked. | null / 미입증 |
| MGV04-T03 | [3.5, 5.5] | MGV04-S01 → MGV04-S02; Stage map fades; a new board scene appears. | null / 미입증 |
| MGV05-T04 | [15.5, 18] | MGV05-S03 → MGV05-S04; Completion fades and the stage map appears. | null / 미입증 |
| MGV05-T05 | [18.5, 21] | MGV05-S04 → MGV05-S04; Pawn advances17→18 and stage18 unlocks. | null / 미입증 |
| MGV05-T06 | [21.5, 23.5] | MGV05-S04 → MGV05-S01; Map fades to the Monaco board scene. | null / 미입증 |

## 최소 native 계층 제안

- Page_StageMap: BG그라데이션, CloudLayer, RouteLayer, StageStack, TransitionLayer, FadeOverlay.
- StageStack의 Future/Current/Previous 각각 SceneSlot3D_or_TransparentArt + RibbonArt + NativeStageName + 필요한LockArt. 현재17구성은16/17/18, 현재18구성은17/18/19 데이터만다릅니다.
- 섬장면은 전용투명아트/3D표시로 분리하고 UI전체스크린샷을쓰지않습니다. 실제3D모델·카메라·Unity계층은미관찰이며 정적그림을live3D구현이라고쓰지않습니다.
- 리본은텍스트없는별도장식, label은native. 잠김장면청록처리는장면에만적용하고 리본/글자/금lock까지일괄tint하지않습니다. 자물쇠기본/열림·광선·말이동은별도상태레이어입니다.
- 최소구성은그룹포함약29~33부품제안이며 구름수/전환부품에따라달라집니다. 새보상/가격/진행조건/조작버튼은없습니다.
- 제작기준제안:551×984, X중앙275.5, 같은리본334×76/label폭290·font26·line32, lock82×110, 장면slot약334×320. 장면원화는각자비율을유지하고 같은바닥기준으로contain. 현재단계묶음중심은화면높이약46~48%, 리본간약350logical 제안이며 승인수치가아닙니다.

## 기존 자원 재사용 후보

| 자원 | 실제확인 | 후보와한계 |
|---|---|---|
| samples/monopoly-go/ui-studio/assets/production/networth13-geometry/gold-padlock.webp | [48, 58]; view=True | same gold lock motif, transparent existing asset; shape/details differ and48×58 is too small for approx82×110logical map lock; family/reference reuse only until larger master/state art verified |
| samples/monopoly-go/ui-studio/assets/production/shop-ui/common_shop_bonus-red-ribbon3_normal_v001.webp | [160, 64]; view=True | blank red ribbon9/3-slice motif; existing strong red/angular rectangle differs from wide curved coral map ribbon/tails; not source-equivalent replacement |
| samples/monopoly-go/ui-studio/assets/production/networth13-geometry/next-red-ribbon3.webp | [140, 40]; view=True | blank red ribbon/extendable middle; slanted next ribbon, not same map curvature/tail family |
| samples/monopoly-go/ui-studio/assets/production/menu-ui/common_menu_footer-fill9_normal_v001.webp | [32, 32]; view=False | existing common footer resource is available; NOT APPLICABLE: footer/Close not observed on either map; do not add it by family habit |

- 골드lock은48×58이라 지도크기로확대하면흐려질수있습니다. 기존family/원화제작법재사용후보이며그대로동등판이라고하지않습니다. 세자원모두투명alpha가있고실제이미지를보았습니다.
- 기존리본은강한빨강/각짐/기울기가지도원본의넓고휘어진산호색리본과다릅니다. 현재후보를그대로부품에연결해시각동등이라고쓰지않습니다. 타프로젝트아트는조회하지않았습니다.

## 미확인·본체 검수

- entry전MGV04,exactclick/tap/자동발생조건,해금/보상/가격/게임API,19컬러원화,16~19밖범위,수동scroll,Back/Close,실제3D/원본서체/최종동등은미확인입니다.
- 본체는native저장·재열기,551/390×844/430×932에서장면비율·같은리본/글자/lock·의도된상단clip/하단여유·이미지404/넘침,상태/전환원화분리,입력targetnull을확인해야합니다.
- 이번작업은읽기/영상관찰/측정뿐이며 제품구현·설계등록·브라우저·장치·시험·사용자최종시각컨펌은실시하지않았습니다.

## 저장범위

/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/stage-map14/measure.md
/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/stage-map14/measure.json
이두파일만작성. 제품/설계/guide/공용보고/STATUS/원본자료변경0,타프로젝트조회0,하위추가0.
