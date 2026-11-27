# ACECRAFT 샘플 카탈로그·가이드 초안

2026-11-20T17:41:19+09:00 · codex(단이) · **초안 / 실제 제작 결과 본체확인대기**

이 문서는 영상 A/B와 세 조립 recipe를 연결한 분석 초안입니다. 실제 생성·저장·재열기·입력 통과를 확정하지 않습니다. 본체가 실제 결과와 대조한 뒤 공식 가이드에 반영해야 합니다.

## 예정 범위

- 예정20보드: 로비1 + 모집3 + 모달9 + 목록/상점/Scott reveal7.
- A17가족에 Chapter/누적구매 레이아웃 분리2와 Scott reveal1을 더합니다. Medal은 Tempus notes 변형, CIN은 분석 notes만 남깁니다.
- B 부족알림은 확인 shell ACE12, Power Cube는 정보 shell ACE13을 재사용하는 계획입니다. 해당 B 표현을 실제로 조립했다고 쓰지 않습니다.
- 세 recipe는19가족·519개 조립 지침이며 실제 UI 요소 수가 아닙니다. 별도 Lobby도 실제 상태는 본체확인대기입니다.

## 대표 보드

| familyId | 제안 보드명 | 원본 근거·요청 시각 | 역할 | 실제 제작 |
|---|---|---|---|---|
| Lobby | `Page_ACE_Lobby` | [A 7초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00007.jpg) | 로비·이벤트 진입 | 본체확인대기 |
| HonkDepot | `Page_ACE_HonkDepot` | [A 0초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00000.jpg) | Wingman 모집 | 본체확인대기 |
| RadiantPact | `Page_ACE_RadiantPact` | [A 21초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00021.jpg) | Radiant 이벤트 모집 | 본체확인대기 |
| OverdriveRecruit | `Page_ACE_OverdriveRecruit` | [B 1초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00001.jpg) | Overdrive 이벤트 모집 | 본체확인대기 |
| ACE02 | `Page_ACE_PilotList` | [A 5초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00005.jpg) | 조종사 컬렉션 | 본체확인대기 |
| ACE10L | `Page_ACE_SpecialPack_Limited` | [A 41초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00041.jpg) | 기간 상품 2열 상점 | 본체확인대기 |
| ACE10C | `Page_ACE_SpecialPack_Chapter` | [A 38초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00038.jpg) | 챕터 상품 가로 배너 | 본체확인대기 |
| ACE14T | `Page_ACE_ItemShop_Tempus` | [A 86초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00086.jpg) | Tempus 대표 아이템 상점 | 본체확인대기 |
| ACE15P | `Page_ACE_Cumulative_Period` | [A 92초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00092.jpg) | Period Rewards 진열 | 본체확인대기 |
| ACE15M | `Page_ACE_Cumulative_Milestones` | [A 96초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00096.jpg) | 누적 구매 마일스톤 목록 | 본체확인대기 |
| ACE_B03 | `Page_ACE_CharacterReveal_Scott` | [B 13초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00013.jpg) | Scott 조종사 획득 reveal | 본체확인대기 |
| ACE04 | `Modal_ACE_Menu` | [A 9초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00009.jpg) | 우측 메뉴 drawer | 본체확인대기 |
| ACE05 | `Modal_ACE_Mail` | [A 10초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00010.jpg) | 우편 목록 팝업 | 본체확인대기 |
| ACE06 | `Modal_ACE_Friends` | [A 14초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00014.jpg) | 친구·에너지 교환 팝업 | 본체확인대기 |
| ACE08 | `Modal_ACE_Missions` | [A 23초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00023.jpg) | 이벤트 미션 팝업 | 본체확인대기 |
| ACE11 | `Modal_ACE_PackDetail` | [A 62초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00062.jpg) | 상품 묶음 상세 팝업 | 본체확인대기 |
| ACE12 | `Modal_ACE_PurchaseConfirm` | [A 63초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00063.jpg) | 구매·확인 대화상자 | 본체확인대기 |
| ACE13 | `Modal_ACE_ItemInfo` | [A 75초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00075.jpg) | 아이템 정보 팝업 | 본체확인대기 |
| ACE16 | `Modal_ACE_Rewards` | [A 99초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00099.jpg) | 공통 보상 overlay | 본체확인대기 |
| ACE17 | `Modal_ACE_HowToObtain` | [A 95초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00095.jpg) | 획득 경로 팝업 | 본체확인대기 |

## B 영상 중복 분류

| 원본 | 대응 | 분류 |
|---|---|---|
| B01 Overdrive Special Recruit | OverdriveRecruit | A09와 동일 모집, 수치/보상 단계는 변형 |
| B02 Recruitment cinematic | CIN notes | 전화/회전 다이얼/전기 chamber/Skip은 별도 CIN 분석 notes. 예정20보드에 포함하지 않음 |
| B03 Pilot reveal A Scott | ACE_B03 | 별도 Scott reveal 보드. 실제 원본은 크림 곰 조종사+둥근 프로펠러기 |
| B04 Rewards Obtained | ACE16 | Rewards 공통 shell, 1/7/10칸과 재추첨 버튼은 변형 |
| B05 Insufficient ticket notification | ACE12 | Notification / Not enough Overdrive Tickets. Go get more? / Cancel / Confirm. 확인 shell 재사용 예정, 별도 표현 조립은 계획에 없음 |
| B06 Special Pack shop | ACE10L | 기간 상점 중복. 값/한도/스크롤은 변형 |
| B07 Overdrive Special Pack detail | ACE11 | 상세 popup 중복. 끝 프레임 ×8/×18/×20·76.90 |
| B08 Power Cube item tooltip | ACE13 | Power Cube / Owned7 / Honk’s Depot Signature Wingman 설명은 info shell 내용 변형 |

## Lobby — 로비·이벤트 진입

- 제안 보드명: `Page_ACE_Lobby` · 실제 확인: **본체확인대기**
- 원본: [frame_00007.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00007.jpg) · 요청 7초 / 실제 6.991667초.
- 관찰 부품 계층: Player HUD and currencies at top; large hero center; 5 left/6 right floating event icons; three event shortcuts above dominant yellow Start; 5-icon global navigation at bottom.
- 사용자 입력 표식: Start, Menu, Special Recruit, Radiant Pact, Store, Recruit. 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Store, First Purchase, Privileges, Special Recruit, Radiant Pact, Menu, Flight Log, Patrol, Events, Mystic Visit, Recruit, Start, Realm Trial, Golden Apple Rush
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: Start 이후 전투; 일부 전역 메뉴 목적지; 새 토끼의 크림 비행복/신발은 원본과 다른 제안
- 중복 관계: A7–8/17–19/25–26의 포즈·배지·카운터는 같은 로비 상태군
- 제작 한계: 본체 별도 조립 중; 실제 board 이름/부품 구성/그림 차이는 본체확인대기.
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## HonkDepot — Wingman 모집

- 제안 보드명: `Page_ACE_HonkDepot` · 실제 확인: **본체확인대기**
- 원본: [frame_00000.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00000.jpg) · 요청 0초 / 실제 0.000000초.
- 관찰 부품 계층: Full cartoon machinery scene; hanging header, 2 right event shortcuts, central wingman/capsule illustration, switch, bottom recruitment buttons, sub-tabs above global navigation.
- 사용자 입력 표식: Packs(Packs), Missions(Missions), Switch(Switch), History(◴ History), Preview(▣ Preview), FreeRecruit(FREE / ×10), RecruitOnce(Recruit ×1 / ▣ ×1), RecruitTen(Recruit ×10 / ◇ ×3000), PilotRecruit(Pilot Recruit), CloudHub(Cloud Hub), HonkDepotTab(Honk's Depot), ClippedSkyTab(Sky / Re…), GlobalNav1(Recruit), GlobalNav2, GlobalNav3, GlobalNav4, GlobalNav5. 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: HONK’S DEPOT, Packs, Missions, Switch, History, Preview, Recruit ×1, Recruit ×10, Pilot Recruit, Cloud Hub
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 잘린 4번째 모집 탭 전체 이름; Switch/History/Preview 목적지; 실제 확률
- 중복 관계: A0–4는 같은 모집 가족; 외부 회색 도구 말풍선 제외
- 제작 한계: 420×924 원본 가시 구역의 근사 ABS 좌표이다. 수치는 제작용 제안이며 원본 Unity 설정을 확정하지 않는다.; Honk 원화는 새 거위 기술자+작은 기체 일러스트다. 원본 고유 캐릭터 외모 및 원형 모집 기계는 동일 복제하지 않는다. SwitchBase는 기하 정보판 대체이며 원본 원형/금속 기계 동등을 주장하지 않는다.; 원본 우측 중간 회색 영어 도구 말풍선은 영상의 외부 overlay로 판단하여 제외했다. 원본 promotion 말풍선의 세부 일러스트/입구는 이번 30동작 조립에서 미포함이다.; 공통 전역 메뉴 5개의 관찰된 이름은 첫 Recruit만 확정했다. 나머지 메뉴에는 관찰되지 않은 이름/목적지를 붙이지 않고 무문자 generic glyph proxy로 둔다. 정본 공통 메뉴가 조립되면 정상 UI 복제로 교체를 권장한다.; 우측 Packs/Missions의 원본 원형 아이콘 대신 라벨 버튼만 우선 조립한다. Shared family의 30동작 제한 때문에 세부 그림은 후속 교체 대상이다.; 원본 4번째 모집 탭 이름은 화면 오른쪽에서 잘려 Sky Re…로만 보이므로 그대로 표시한다. 카운터의 ◇/▣ 기호는 native 표시용 근사이고 실제 토큰 아이콘은 미완성이다.; History/Preview/Switch/Packs/Missions/Recruit/탭의 실제 이동/추첨/보상 연결은 본 명세에 없다. 관찰되지 않은 성공/재화 차감 결과를 만들지 않는다.; 외부 그림자는 원화/프레임에 굽지 않는다. 현재 recipe는 shadow를 켜지 않으며 필요하면 해당 부품의 effects.shadow를 별도 정상 UI 요청으로 적용한다.
- 조립 지침: [recipes-recruits.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-recruits.json) · 30 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## RadiantPact — Radiant 이벤트 모집

- 제안 보드명: `Page_ACE_RadiantPact` · 실제 확인: **본체확인대기**
- 원본: [frame_00021.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00021.jpg) · 요청 21초 / 실제 20.991667초.
- 관찰 부품 계층: Ice-blue full-height hero and vehicle artwork; snow/ice title; 4 event shortcuts; orb-shaped reward pool; 2 bottom recruit buttons; local back button.
- 사용자 입력 표식: Packs(Packs), RadiantPass(Radiant / Pass), Missions(Missions), ExchangeShop(Exchange / Shop), History(◴ History), Preview(▣ Preview), Back(↶), RecruitOnce(Recruit ×1 / ×1), RecruitTen(Recruit ×10 / ×10). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: RADIANT PACT, Packs, Radiant Pass, Missions, Exchange Shop, SS Silvanna, History, Preview, Standard Pool, Recruit ×1, Recruit ×10
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: Pass/Exchange Shop 내용; 실제 모집 확률; 별 모집권 고유 glyph
- 중복 관계: A20–22의 포즈 변화는 같은 모집 가족
- 제작 한계: 좌표는 원본 420×924의 근사 ABS 제작값이다. 상단 0/0/23, Remaining 18d 23h, 40/10 모집 문구와 비용1/10은 해당 프레임에서 관찰한 시점 스냅샷이다. 라이브 수치가 아니다.; 새 Silvanna+빙결 보드 원화와 짙은 navy 무대 배경을 사용한다. 원본의 얼음 궁전/배경 캐릭터·곡면 오각 슬롯 리본과 동일 원화가 아니다.; Standard Pool은 원본의 굽은 5칸 띠 구조를 9slice 판틀+5개 표시 슬롯으로 근사한다. 획득 확률이나 원본 정확한 자원 명칭을 창작하지 않는다. bluegem glyph는 5개 pool 자원의 임시 역할 그림이다.; Packs/Radiant Pass/Missions/Exchange Shop은 관찰된 입구 라벨만 조립한다. 아이콘 그림과 상세 목적지/구매 동작은 미완성이다.; SS · Silvanna · UP 및 발화 한 문장은 해당 프레임의 native 표시글이다. 원본 서체 설정은 미확인이다.; 녹색 별 모집권의 새 전용 glyph가 없어 cost 그림은 powercube proxy를 쓰며 실제 토큰 외형 동등을 주장하지 않는다. 가격/시점 숫자는 관찰값만 기록했다.; 버튼 하위 cost 그림은 입력을 부모로 전달한다. 다른 그림/글자는 표시 전용이다. 실제 추첨/잔액/보상/화면 연결은 명세 밖이다.; 외부 그림자는 baked로 넣지 않는다. 제목/버튼 글자 외곽선은 기본0이며 별도 엔진 그림자가 필요하면 정상 UI에서 명시한다.; 신규 Silvanna 원화의 표시 영역은 [0,164,768,819]이다. source768×1152에서 큰 투명 위아래 여백만 제외해 실제 몸/보드가 작아지지 않게 한다. 원본 파일과 배치/입력 범위는 보존한다.
- 조립 지침: [recipes-recruits.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-recruits.json) · 30 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## OverdriveRecruit — Overdrive 이벤트 모집

- 제안 보드명: `Page_ACE_OverdriveRecruit` · 실제 확인: **본체확인대기**
- 원본: [frame_00001.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00001.jpg) · 요청 1초 / 실제 0.991667초.
- 연결 근거: [A 28초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00028.jpg), [B 22초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00022.jpg), [B 25초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00025.jpg)
- 관찰 부품 계층: Orange/teal canyon setting with oversized pilot and drill vehicle; event marquee; upper left reward ladder shortcut; right packs/growth shortcuts; lower history/preview; bottom recruit buttons and local back.
- 사용자 입력 표식: Help(?), Packs(Packs), PathGrowth(Path of / Growth), History(◴ History), Preview(▣ Preview), Back(↶), FreeRecruit(FREE / ×10), RecruitOnce(Recruit ×1 / ×1), RecruitTen(Recruit ×10 / ×10). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Overdrive, Special Recruit, Rewards, Packs, Growth Gift, SP Explorer Joey, UP, History, Preview, Recruit ×1, Recruit ×10
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: Path of Growth 상세; History/Preview 실제 목적지; 초기 영상 역행 구간의 게임 규칙
- 중복 관계: A27–36/108–113와 B01을 병합; 반복 추첨·잔액·보장 문구는 상태 변형
- 제작 한계: 원본 420×924 기준 가시 구역 근사 ABS 제작값이다. ticket18/gem1349, Remaining25d23h, Total Rewards ×2/10/10, pity4/54, free countdown23:58:34는 해당 시점의 관찰 문자열이며 임의 밸런스나 실시간 값이 아니다.; 신규 기계 협곡 배경과 Joey drill 신작을 별도 이미지로 쓴다. 배경 내 실제 비행/플레이 기능은 없다.; 상단 Overdrive+Special Recruit는 두 native 글자와 서로 다른 프레임이다. 큰 제목 프레임의 고정 장식/나사/펜촉 등 고유 원화는 공용3slice로 근사한다.; Total Rewards의 장식은 신규9slice 판틀과 powercube glyph로 근사한다. Packs/Path of Growth는 관찰된 이름과 역할 glyph를 쓰며 실제 내용/도달 조건은 만들지 않는다.; 원본 제목 끝 ?와 History/Preview/Back은 관찰된 control이다. 클릭 목적지·자동 팝업·보상 획득·추첨 결과는 미연결 상태로 둔다.; Recruit ×1/×10의 하위 파란 ticket 그림은 부모 입력 전달이다. Original small plane ticket motif와 generic atlas blue ticket는 서로 다른 새 그림이며 원본 동등을 자칭하지 않는다.; 표시 문구는 native text/버튼 caption으로 남긴다. illustration에 제목·영어 bubble·버튼·확률을 굽지 않는다.; 외부 shadow 필요 시 effects.shadow로 별도 정상 UI 요청을 수행한다. 이 recipe는 효과·상태·연결을 자동 적용하거나 실제 GUI 통과를 주장하지 않는다.; Joey 신작은 원본 영상보다 세로 실루엣이 길어 box420×565를 사용한다. 실제 미리보기에서 drill tip·pity 문구 겹침을 별도 확인한다. ? 도움말의 27px 버튼만 source/edge8의 작은 프레임 variant다.
- 조립 지침: [recipes-recruits.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-recruits.json) · 26 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE02 — 조종사 컬렉션

- 제안 보드명: `Page_ACE_PilotList` · 실제 확인: **본체확인대기**
- 원본: [frame_00005.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00005.jpg) · 요청 5초 / 실제 4.975000초.
- 관찰 부품 계층: Bronze mechanical header; filter and count; amplification progress bar; 3-column portrait card grid with level, rarity and circular equipment icons; 2 collection tabs; global navigation.
- 사용자 입력 표식: Filter, Advance, Pilot1(Lv.60), Pilot2(Lv.35), Pilot3(Lv.60), Pilot4(Lv.40), Pilot5(Lv.60), Pilot6(Lv.60), Pilot7, Pilot8, Pilot9. 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: PILOT LIST, All, Pilots 28/29, Advance, Pilot, Pappo
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: Pappo 내용; 개별 카드 상세; 가려진 세번째 줄 레벨
- 중복 관계: A5–6의 스크롤·카드/레벨 차이는 같은 3열 컬렉션 구조
- 제작 한계: Nine freshly generated portrait cells are reference-inspired approximations, not confirmed character identities.; Source steampunk wall is approximated by a flat brown root because a matching clean backdrop is unavailable.; Original rarity badges, ability sub-icons and global icon navigation are omitted; first six level labels are retained. Third-row labels are behind the source bottom tabs and omitted.; Pilot/Pappo selector is drawn as the observed native caption strip; Pappo content is unobserved and must not be fabricated.
- 조립 지침: [recipes-lists-shops.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-lists-shops.json) · 35 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE10L — 기간 상품 2열 상점

- 제안 보드명: `Page_ACE_SpecialPack_Limited` · 실제 확인: **본체확인대기**
- 원본: [frame_00041.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00041.jpg) · 요청 41초 / 실제 40.975000초.
- 연결 근거: [B 31초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00031.jpg), [B 33초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00033.jpg)
- 관찰 부품 계층: Brick wall and theater lights; multi-currency top bar; centered title; 2 mode tabs. Chapter banners span almost the width. Limited offers use 2 columns with duration, value starburst, reward icon, quantity/limit, price button. Fixed 4-item shop navigation and back button.
- 사용자 입력 표식: Mode1, Mode2, Back, NavSpecialPack, NavTopPick, NavCumulative, NavItemShop, Offer1(Daily Limit 1/1 / ×20 · 2H×5 · 2H×5), Offer1Price(FREE), Offer2(Daily Limit 1/1 / ×80), Offer2Price(3.80), Offer3(25d · Total Limit 2/2 / ×10), Offer3Price(×10), Offer4(25d · Total Limit 2/2 / ×10), Offer4Price(×3000). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Special Pack, Limited-Time, Chapter Pack, Normal, Elite, Daily Limit, Total Limit, FREE, Special Pack, Top Pick Packs, Cumulative Purchase, Item Shop
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 하단 미노출 상품; 실제 통화 이름/기호; 실제 구매·보상 처리
- 중복 관계: A40–85와 B06 병합; 긴 스크롤·토스트·동일 상품 카드 반복은 새 보드로 세지 않음
- 제작 한계: Only the first two complete rows (four offers) are included; original lower partial rows and long-scroll products repeat the same card structure and are excluded from this representative board.; Prepared glyphs replace the source bundle paintings. The red bottle and exact gear art are not available; no unrelated character portrait substitutes are used.; Product-card and price buttons are separate native targets. Their eventual destination is the sample confirmation flow, never a live payment.; Shop footer retains five native hit targets, but original navigation pictograms are omitted and its four destination captions are compacted into one native text line to stay within the action budget.; Header currency values are native text; exact source currency pictograms are omitted here, and no new currency balances are inferred.
- 조립 지침: [recipes-lists-shops.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-lists-shops.json) · 35 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE10C — 챕터 상품 가로 배너

- 제안 보드명: `Page_ACE_SpecialPack_Chapter` · 실제 확인: **본체확인대기**
- 원본: [frame_00038.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00038.jpg) · 요청 38초 / 실제 37.991667초.
- 관찰 부품 계층: Brick wall and theater lights; multi-currency top bar; centered title; 2 mode tabs. Chapter banners span almost the width. Limited offers use 2 columns with duration, value starburst, reward icon, quantity/limit, price button. Fixed 4-item shop navigation and back button.
- 사용자 입력 표식: Mode1, Mode2, Back, NavSpecialPack, NavTopPick, NavCumulative, NavItemShop, Difficulty0, Difficulty1, Chapter1Price(11.90), Chapter2Price(10.90). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Special Pack, Limited-Time, Chapter Pack, Normal, Elite, Daily Limit, Total Limit, FREE, Special Pack, Top Pick Packs, Cumulative Purchase, Item Shop
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: Elite 내용; 3번째 상품 화면 밖 가격; 성/케이크 고유 원화
- 중복 관계: A10 가족의 Chapter 레이아웃. Limited와 내용 계층이 달라 대표 보드는 분리
- 제작 한계: Chapter-specific castle, cake and dark-fortress paintings are unavailable; each left art slot uses the prepared crate glyph as an explicit generic pack proxy.; First two full chapter rows and the partially visible third row are represented. Third-row price is offscreen and is not invented.; Chapter rewards are native quantity strings in the observed order: gem / gold ticket / gold coin / question-card. Exact original tiny reward icon drawings are omitted.; Shop footer retains five native hit targets, but original navigation pictograms are omitted and its four destination captions are compacted into one native text line to stay within the action budget.; Header currency values are native text; exact source currency pictograms are omitted here, and no new currency balances are inferred.
- 조립 지침: [recipes-lists-shops.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-lists-shops.json) · 34 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE14T — Tempus 대표 아이템 상점

- 제안 보드명: `Page_ACE_ItemShop_Tempus` · 실제 확인: **본체확인대기**
- 원본: [frame_00086.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00086.jpg) · 요청 86초 / 실제 85.985000초.
- 연결 근거: [A 90초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00090.jpg)
- 관찰 부품 계층: Same brick-wall shop frame and bottom shop navigation; two sub-tabs and reset timer; 3-column square item grid with rarity backgrounds, price and purchase limit beneath.
- 사용자 입력 표식: Mode1, Mode2, Back, NavSpecialPack, NavTopPick, NavCumulative, NavItemShop, Item1, Item2, Item3, Item4, Item5, Item6. 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Item Shop, Medal Shop, Tempus Shop, FREE
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: Medal 변형 실제 제작; 아래쪽 상품 상세; 실제 구매 처리
- 중복 관계: A86–87 Tempus를 대표 보드로 삼고 A88–91 Medal은 동일 구조 notes 변형으로 보존
- 제작 한계: Tempus is the representative item-shop board. Medal at source 90s shares the three-column structure and is documented as a variant rather than a second same-geometry board.; Only the first six source slots are included. Four character-face offers and two further gear offers in lower source rows are omitted, not moved into invented products.; The red-bottle and purple charm drawings are unavailable; redticket and gear glyphs are explicit generic proxies. Exact identity is not claimed.; For source Medal variant: timer partially obscured by the recorded reward animation; observed first-row price/status and limits are 04:59 countdown with 2/3, gem×30 with 1/1, gem×120 with 5/5. Its exact native source text should be re-read if that separate board is later built.; Shop footer retains five native hit targets, but original navigation pictograms are omitted and its four destination captions are compacted into one native text line to stay within the action budget.; Header currency values are native text; exact source currency pictograms are omitted here, and no new currency balances are inferred.
- 조립 지침: [recipes-lists-shops.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-lists-shops.json) · 34 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE15P — Period Rewards 진열

- 제안 보드명: `Page_ACE_Cumulative_Period` · 실제 확인: **본체확인대기**
- 원본: [frame_00092.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00092.jpg) · 요청 92초 / 실제 91.985000초.
- 연결 근거: [A 104초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00104.jpg)
- 관찰 부품 계층: Teal patterned event panel within brick shop frame. Period tab has hero display case and milestone medallions; cumulative tab has dense progress cards. Two rounded sub-tabs just above global shop navigation.
- 사용자 입력 표식: Back, NavSpecialPack, NavTopPick, NavCumulative, NavItemShop, LocalTab0, LocalTab1, Claim(Claim). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Cumulative Purchase, Total Collected, Limited-Time Offer: Epic Wingman Selection, Earn Flight Medals, Claim, Go, Period Rewards
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 실제 결제 집계/선택 조건; 첫 금색 티켓 수량; 획득 전후 연결
- 중복 관계: A92–93/104–107은 같은 Period 보상 단계; Milestones와는 별도 대표 보드
- 제작 한계: Source ornate open display suitcase, purple flask and white flower paintings are not available. The prepared crate is an explicit generic display-case proxy; this is not claimed as a matching item drawing.; Three amount medallions use prepared gold-coin and resource glyphs. Their circular ornament detail differs from the source.; Reward footer quantities are observed gem×100 and 24H red bottle×2. The first gold ticket has no reliably readable quantity in this frame; no quantity is invented.; Shop footer retains five native hit targets, but original navigation pictograms are omitted and its four destination captions are compacted into one native text line to stay within the action budget.; Header currency values are native text; exact source currency pictograms are omitted here, and no new currency balances are inferred.; Claim footer icon strip uses generic prepared goldcoin / bluegem / lightning symbols; the last lightning is a declared proxy for the unavailable red-bottle illustration. Quantities are native source text, not baked into the icons.
- 조립 지침: [recipes-lists-shops.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-lists-shops.json) · 35 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE15M — 누적 구매 마일스톤 목록

- 제안 보드명: `Page_ACE_Cumulative_Milestones` · 실제 확인: **본체확인대기**
- 원본: [frame_00096.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00096.jpg) · 요청 96초 / 실제 95.976667초.
- 관찰 부품 계층: Teal patterned event panel within brick shop frame. Period tab has hero display case and milestone medallions; cumulative tab has dense progress cards. Two rounded sub-tabs just above global shop navigation.
- 사용자 입력 표식: Back, NavSpecialPack, NavTopPick, NavCumulative, NavItemShop, LocalTab0, LocalTab1, Tier1Action(Claim), Tier2Action(Claim), Tier3Action(Go). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Cumulative Purchase, Total Collected, Limited-Time Offer: Epic Wingman Selection, Earn Flight Medals, Claim, Go, Period Rewards
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 실제 보상 지급; 하단 모든 보상 수량; Go 목적지
- 중복 관계: A96–103의 스크롤·완료/진행 상태는 같은 행 구조 반복
- 제작 한계: Three representative native milestone rows are included: ×5 complete, ×10 complete, ×20 partial. Lower ×50 and ×100 rows repeat the same structure and are omitted.; Source four-item reward strips are represented by the prepared generic resource glyph strip; exact item art and all individual reward quantities are intentionally not fabricated.; Requirement and progress are kept in one native two-line text object per row to fit the action budget. Original progress value is centered over the bar; here it is centered with the row title.; Shop footer retains five native hit targets, but original navigation pictograms are omitted and its four destination captions are compacted into one native text line to stay within the action budget.; Header currency values are native text; exact source currency pictograms are omitted here, and no new currency balances are inferred.
- 조립 지침: [recipes-lists-shops.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-lists-shops.json) · 35 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE_B03 — Scott 조종사 획득 reveal

- 제안 보드명: `Page_ACE_CharacterReveal_Scott` · 실제 확인: **본체확인대기**
- 원본: [frame_00013.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00013.jpg) · 요청 13초 / 실제 12.966667초.
- 연결 근거: [B 0.5초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/selected/frame_00000.jpg), [B 13.3초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/selected/frame_00003.jpg)
- 관찰 부품 계층: Dim recruitment page → Smoke halo → A Scott rank/name upper left → Pilot + propeller plane on stone platform → Tap Anywhere lower center
- 사용자 입력 표식: History, Preview, DrawOne, DrawTen, Dismiss. 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: A Scott, Tap Anywhere
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 다른 희귀도 reveal; 정확한 dismiss hit area; 연기/돌 받침 재현
- 중복 관계: B0–0.5/12.97–13.3은 같은 reveal. 펭귄 추정은 원본 확인으로 폐기
- 제작 한계: Scott is the cream bear pilot with propeller plane. Earlier penguin-like speculation was corrected using the actual full-body source frame.; Prepared acecraft_character_reveal_bear_plane_v001.webp is a new reference-inspired illustration, not a cropped original or an exact identity reproduction.; The source smoke halo and stone reveal pedestal have no matching clean assets and are omitted. The dimmed recruit page is reconstructed from the prepared Joey/canyon assets.; This board requires the bear-plane asset to exist and decode. If it fails, mark the board incomplete; do not silently substitute another portrait.
- 조립 지침: [recipes-lists-shops.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-lists-shops.json) · 22 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE04 — 우측 메뉴 drawer

- 제안 보드명: `Modal_ACE_Menu` · 실제 확인: **본체확인대기**
- 원본: [frame_00009.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00009.jpg) · 요청 9초 / 실제 9.000000초.
- 관찰 부품 계층: Right-aligned wooden vertical drawer over dimmed lobby, approximately x233–419/y122–520.
- 사용자 입력 표식: Close, Row1(Friends), Row2(Mail), Row3(Backpack), Row4(Settings), Row5(Account), Row6(Notice), Row7(Support). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Friends, Mail, Backpack, Settings, Account, Notice, Support
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: Backpack/Settings/Account/Notice/Support 상세; backdrop 입력 동작
- 중복 관계: A9/13/16 동일 drawer; Sent successfully는 임시 toast
- 제작 한계: Original drawer has no visible X. Close is a transparent/native backdrop target, not an added visible control.; Menu glyphs are original prepared generic proxies; exact original icon illustrations are not available.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 24 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE05 — 우편 목록 팝업

- 제안 보드명: `Modal_ACE_Mail` · 실제 확인: **본체확인대기**
- 원본: [frame_00010.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00010.jpg) · 요청 10초 / 실제 9.975000초.
- 관찰 부품 계층: Layered papers on clipboard; large all-caps title; scrollable message rows; blue Delete Read and yellow Claim All; upper-right red close badge. Approx x25–406/y188–774.
- 사용자 입력 표식: Close(×), DeleteRead(Delete Read), ClaimAll(Claim All). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: MAIL, Overdrive Ticket Conversion, Fest Sign-in Rewards, Fest Shop Item Removal, Nemeses’ Return Seasonal Ranking Rewards, Delete Read, Claim All
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 개별 우편 상세; 삭제/일괄 청구 실제 처리
- 중복 관계: A10–11 동일 목록; A12는 공통 보상 overlay
- 제작 한계: List is a scroll-y viewport; the sixth row is partially clipped as observed. No individual message detail is invented.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 31 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE06 — 친구·에너지 교환 팝업

- 제안 보드명: `Modal_ACE_Friends` · 실제 확인: **본체확인대기**
- 원본: [frame_00014.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00014.jpg) · 요청 14초 / 실제 13.991667초.
- 관찰 부품 계층: Tilted clipboard/paper; count, delete icon, sort control; friend rows with avatar, level, stage/status and two energy buttons; footer buttons. Approx x4–416/y144–853.
- 사용자 입력 표식: Close(×), Sort(By Level), Remove(⌫), EnergySend1(ϟ), EnergyClaim1(ϟ), EnergySend2(ϟ), EnergyClaim2(ϟ), EnergySend3(ϟ), EnergyClaim3(ϟ), EnergySend4(ϟ), EnergyClaim4(ϟ), NewFriends(New Friends), SendClaim(Send and / Claim All). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: FRIENDS, Friends 4/50, By Level, New Friends, Send and Claim All, Today’s Claims 0/5
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 친구 검색/추가 화면; 실제 전송·청구 정책; 정렬/삭제 결과
- 중복 관계: 같은 친구 행 4개와 전송 상태를 한 가족으로 묶음; 이름은 SamplePilot 제안
- 제작 한계: SamplePilot01–04 are fictional proposed replacements for account/friend names. No personal IDs are copied.; Prepared friend glyph substitutes for portraits; native ϟ labels substitute for energy icons. All same-role energy buttons are 36×36.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 32 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE08 — 이벤트 미션 팝업

- 제안 보드명: `Modal_ACE_Missions` · 실제 확인: **본체확인대기**
- 원본: [frame_00023.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00023.jpg) · 요청 23초 / 실제 22.991667초.
- 관찰 부품 계층: Blue-framed parchment sheet; stacked mission rows with reward icon, 2-line description, progress bar and right action; sticky Claim All footer; red close badge. Approx x21–409/y188–781.
- 사용자 입력 표식: Close(×), Action1(Claim), Action2(Go), Action3(Go), Action4(Go), Action5(Go), ClaimAll(Claim All). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Missions, Own Permanent Privilege during the event., Own Monthly Pass during the event., Claim Ad rewards 10 time(s) in total., Go, Claim, Claim All
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: Go 목적지; 가려진 하단 미션; 완료/청구 정책
- 중복 관계: 같은 미션 행 반복; 완료/미완료/청구는 상태 차이, A24는 공통 보상
- 제작 한계: Sixth row is deliberately clipped by List, matching the observed viewport; no unseen action or progress amount is added.; Prepared cube is a generic reward icon proxy, not the original event-token illustration.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 35 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE11 — 상품 묶음 상세 팝업

- 제안 보드명: `Modal_ACE_PackDetail` · 실제 확인: **본체확인대기**
- 원본: [frame_00062.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00062.jpg) · 요청 62초 / 실제 61.976667초.
- 연결 근거: [B 33.465초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/selected/frame_00011.jpg), [A 73초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00073.jpg), [A 83초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00083.jpg)
- 관찰 부품 계층: Cream paper modal with blue upper trim, title, centered horizontal reward icons, one yellow price button, close badge; underlying shop is dimmed. Approx x14–405/y326–612.
- 사용자 입력 표식: Close(×), Buy(38.00). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Overdrive Special Pack
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 통화 기호 이름; 각 묶음 실제 구매 처리
- 중복 관계: A62/73/76/83–84와 B07 같은 상세 shell, 묶음/가격만 변형
- 제작 한계: The displayed currency symbol is not confidently identified; amount 38.00 is preserved without inventing a currency.; The red 24H consumable and gold token use prepared generic glyph proxies.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 17 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE12 — 구매·확인 대화상자

- 제안 보드명: `Modal_ACE_PurchaseConfirm` · 실제 확인: **본체확인대기**
- 원본: [frame_00063.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00063.jpg) · 요청 63초 / 실제 62.976667초.
- 연결 근거: [B 26초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00026.jpg), [A 77초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00077.jpg)
- 관찰 부품 계층: Large cream/blue curved frame; explanatory sentence; cash price and alternative green-ticket currency price; blue and yellow side-by-side buttons; close badge. Approx x14–405/y300–665.
- 사용자 입력 표식: Close(×), UseCash(Use Cash), UseMCash(Use M-Cash). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Purchase Confirmation, Use Cash, Use M-Cash
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 실제 결제/재화 차감; 부족알림 Confirm 도착지; B Cancel/Confirm 표현 실제 조립
- 중복 관계: A63/77 같은 확인 shell; B05 부족알림은 같은 shell의 내용/버튼 변형 notes, 별도 표현 조립 계획 없음
- 제작 한계: No real purchase behavior is authorized by this visual recipe. Currency symbol is unverified and therefore not invented.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 15 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE13 — 아이템 정보 팝업

- 제안 보드명: `Modal_ACE_ItemInfo` · 실제 확인: **본체확인대기**
- 원본: [frame_00075.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00075.jpg) · 요청 75초 / 실제 74.985000초.
- 연결 근거: [B 29.625초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/detail/frame_00021.jpg)
- 관찰 부품 계층: Plain large parchment card with Owned tag at upper right; centered large icon, bold item name, thin divider and centered multiline explanation. Approx x10–410/y333–635.
- 사용자 입력 표식: Close. 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Owned: 20, Overdrive Ticket, An event item used to participate in Special Recruit. It will be converted to Skyward Recruit Tickets at a 1:1 ratio and sent to you via mail after the event ends.
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 실제 dismiss 입력; Power Cube 변형 실제 조립; 오른쪽 chest shortcut 목적지
- 중복 관계: A75 Overdrive Ticket과 B08 Power Cube는 같은 info shell 내용 변형
- 제작 한계: Close is a native backdrop target; no visible X is shown in this reference.; Description transcription is from the enlarged original frame.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 14 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE16 — 공통 보상 overlay

- 제안 보드명: `Modal_ACE_Rewards` · 실제 확인: **본체확인대기**
- 원본: [frame_00099.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00099.jpg) · 요청 99초 / 실제 98.985000초.
- 연결 근거: [A 34초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00034.jpg), [B 2초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00002.jpg), [B 21초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00021.jpg), [B 24초](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00024.jpg)
- 관찰 부품 계층: Shared dark purple translucent theater/stage overlay with hanging stars, soft spotlight/ellipse and centered one-or-more reward icons; underlying screen remains visible; no new independent navigation.
- 사용자 입력 표식: Close. 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: Rewards Obtained, Tap Anywhere
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 가려진 수량·정확한 item 이름; 7/10칸 변형 실제 제작; 애니메이션·재추첨 연결
- 중복 관계: A의 여러 보상과 B04 병합; 1/4/7/10칸은 데이터 변형이며 recipe는 A99의 4칸
- 제작 한계: Four items match the observed 99s representative. The last quantity is obscured and intentionally omitted.; Generic prepared symbols replace exact original item art. The large spotlight is approximated by a quiet plain stage panel; no unprepared hanging-plane illustration is inserted.; Close is the native whole-backdrop dismissal target, with no extra visible footer label.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 16 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## ACE17 — 획득 경로 팝업

- 제안 보드명: `Modal_ACE_HowToObtain` · 실제 확인: **본체확인대기**
- 원본: [frame_00095.jpg](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/frames/frame_00095.jpg) · 요청 95초 / 실제 94.968333초.
- 관찰 부품 계층: Tall blue paper panel, cream acquisition-source rows, source icon, value ribbon, quantity and blue Go; red close badge. Approx x20–406/y211–790.
- 사용자 입력 표식: Close(×), Go1(Go), Go2(Go). 직접 입력 로그·연결 결과는 미확인.
- 관찰 문구: How to Obtain, Privileges, Special Pack, Collectible Amount, Minimum Collectible Amount, Go
- 해석/추정: 영상의 앞뒤 화면 순서와 반복 역할에 따라 가족을 묶은 해석이며 정확한 제스처·실행 링크·게임 처리 결과를 확정하지 않는다.
- 미확인: 두번째 최소 획득 수량; 두 Go의 실제 route
- 중복 관계: A95의 떠다니는 아이템은 직전 보상 애니메이션이므로 popup 부품에 복제하지 않음
- 제작 한계: Special Pack minimum collectible quantity is obscured by reward animation, so no number is invented.; Flying reward particles in 95s belong to the prior claim animation and are not duplicated into this modal.
- 조립 지침: [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json) · 19 actions(실제 생성 수 아님).
- 실제 부품 부모 계층은 JSON의 `componentHierarchyRecipeOutline`에 기록했습니다. 이는 조립 지침의 계층이며 저장된 UI 검증 결과가 아닙니다.

## 공통 제작 규칙·노하우

1. 이 카탈로그는 분석/조립 가이드 초안이며 저장 design/project/model 데이터가 아니다. 편집기나 iframe에 주입하지 않는다.
2. 20은 대표 보드 예정 수이며 실제 생성/저장/재열기/통과 수가 아니다. 실제 결과는 모든 항목 본체확인대기다.
3. 촬영 파일명 시각, 전달/수신 시각, 요청 프레임 시각과 실제 디코딩 시각을 구분한다. 전달 시간이 달라도 원본 파일/프레임 근거는 보존한다. 전달·수신 시각 자체는 미확인이다.
4. A113.08초는 1초114장, B33.505초는 1초34장+selected12장+focused detail30장을 참조했다. 1초 간격으로 놓친 매우 짧은 전환은 있을 수 있고 오디오는 분석하지 않았다.
5. B 초반의 시점 역행과 녹화된 play/pause·선택 테두리를 게임 규칙으로 쓰지 않는다. 초기18→28 같은 값으로 지급을 추론하지 않는다. 플레이어 UI, A0 우측 외부 도구 말풍선은 제품 UI에서 제외한다.
6. 420×924 논리 px를 공통 규격으로 삼는다. recipe의 자식 rect도 stage ABS이므로 normal UI가 local 좌표를 받으면 부모 원점을 빼서 변환한다. 같은 역할의 반복 행/카드/버튼 규격은 맞춘다.
7. 모달9종은 단색 dim Root+자기 popup만 조립한다. 다른 게임·예전 배후 UI·영상 JPG를 넣지 않는다. Character Reveal은 별도 page로서 신규 자산으로 배후를 재구성하는 계획이다.
8. 그림/배경은 신규 원화, 이름/가격/수량/타이머/버튼 글자는 native text/button caption으로 분리한다. 원화에 UI 글자를 굽거나 screenshot을 crop해 production으로 쓰지 않는다.
9. 공통 paper/brownheader/dialog은9slice, itemtile도9slice, 노랑/파랑 CTA는3slice다. 수치 순서 top/right/bottom/left; 일반9는20, itemtile14, CTA는[0,18,0,18]. 작은 도움말 예외는 recipe 기준. source edges·slices·padding은 manifest와 맞추고 padding0을 명시한다.
10. glyph atlas는256×192,4×3,cell64×64의 새 직접제작 그림이다. manifest [x,y,w,h] region을 그대로 쓰고 contain한다. cell 경계/투명 여백을 보존하며 글자/수량을 이미지에 추가하지 않는다. 초상 atlas도 명시 region만 사용한다.
11. 긴 신규 body/plane 그림은 검증한 crop/region을 써서 투명여백 때문에 작아지지 않게 한다. 원본·프롬프트·alpha·crop·bytes manifest를 보존하고300000B 이하 production을 사용한다. originals/실패판은 현행판으로 자동 선택하지 않는다.
12. 신규 원화와 generic glyph는 원본과 동일 캐릭터/아이템이라고 주장하지 않는다. 로비 토끼의 크림 비행복/흰신발 차이, Scott 곰의 포즈/기체 차이는 notes에 둔다. 폐기된 복장v001 토끼·미사용 펭귄 초안은 쓰지 않는다.
13. 입력은 button root action, 버튼 아래 glyph parent 전달, 표시용 배경/그림/글자 none을 원칙으로 본체가 normal UI에서 확인한다. 글자/그림이 클릭을 가로채거나 hit area를 벗어나지 않는지 실제 검수한다.
14. History/Preview/Pappo/Elite/Go/ShopNav의 입구가 보인다는 이유만으로 목적지/성공 처리/자동popup을 창작하지 않는다. 관찰 순서와 actual route 검증을 나누고 unknown links는 본체확인대기로 둔다.
15. 프레임의 금액·잔액·시간은 시점 스냅샷이다. 라이브 값/승인 balance/정책이 아니다. 통화 이름·가려진 수량을 추정하지 않는다. 친구/계정은 SamplePilot 등 가상 제안으로 대체한다.
16. 반복 상품/보상/미션은 관찰 최대 수 범위에서만 복제한다. scroll-y clipping, 고정 footer, native 글자 넘침/가격 겹침, slice 모서리, alpha/crop, close·input·저장/재열기 결과는 본체가 실제 검수 후 공식 가이드에 반영한다.
17. text strokeWidth0을 명시해 helper 기본 흰 외곽선이 승계되지 않게 한다. 필요한 shadow는 정상 UI 효과로 적용하고 원화/프레임에 굽지 않는다. 이 사항의 실제 반영도 본체확인대기다.

## 본체가 실제 결과로 채울 항목

- 실제 board name/id와 생성·저장·재열기 결과
- 세 recipe와 별도 Lobby의 실제 반영 범위
- 변형·native 문구·신규 원화의 차이/미반영 항목
- 실제 입력·닫기·scroll·unknown route 검수
- 검수 화면 크기·캡처·증거 경로
- 승인/보류와 남은 작업

## 읽은 원본

- [family-inventory.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-a/family-inventory.json)
- [inventory.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/inventory.json)
- [recipes-modals.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-modals.json)
- [recipes-recruits.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-recruits.json)
- [recipes-lists-shops.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/recipes-lists-shops.json)
- [resource-manifest.json](/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/acecraft-20261120/art-ui/resource-manifest.json)

참조 JPG·포스터는 분석용이며 production 그림이 아닙니다. 이 초안은 승인·최종 완료 문서가 아닙니다.
