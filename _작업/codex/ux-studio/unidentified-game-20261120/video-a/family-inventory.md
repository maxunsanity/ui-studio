# 영상 A — ACECRAFT UI 가족 분석

- 원본: `/Users/max/Desktop/화면 기록 2026-11-19 오후 1.41.20.mov`
- 메타데이터: 420×924 세로, 113.08초, 약 30.548fps. 1초 간격 114프레임.
- 게임명은 본체가 공식 App Store 이벤트의 Explorer Joey·Overdrive Tickets·Honk’s Depot 일치로 확인했습니다. 이 영상에는 게임 제목 로고 자체가 없습니다.
- 확인 출처: https://apps.apple.com/es/app/acecraft/id6499112583?eventid=6827963235
- 5개 연락판의 114장을 모두 보았고, 대표 프레임은 원본 해상도로 확대 확인했습니다.
- 원본 영상은 읽기 전용. 이 폴더의 화면·JPG·포스터는 분석 참조용이며 production 그림/크롭 소재가 아닙니다.
- animation·스크롤·토스트·보상 수량·상품 묶음 반복을 독립 가족으로 중복하지 않았습니다. 실제 탭의 레이아웃 변형은 아래에 따로 남깁니다.

## UI 가족 17개

| ID | 가족 | 관찰 시각 | 대표 참조 |
|---|---|---|---|
| A01 | Honk's Depot recruitment | 0–4s | [A01_000s_honk-depot.jpg](references/A01_000s_honk-depot.jpg) |
| A02 | Pilot List | 5–6s | [A02_005s_pilot-list.jpg](references/A02_005s_pilot-list.jpg) |
| A03 | Adventure lobby | 7–8s, 17–19s, 25–26s | [A03_007s_adventure-lobby.jpg](references/A03_007s_adventure-lobby.jpg) |
| A04 | Lobby menu drawer | 9s, 13s, 16s | [A04_009s_lobby-menu.jpg](references/A04_009s_lobby-menu.jpg) |
| A05 | Mail list | 10–11s | [A05_010s_mail.jpg](references/A05_010s_mail.jpg) |
| A06 | Friends list | 14–15s | [A06_014s_friends.jpg](references/A06_014s_friends.jpg) |
| A07 | Radiant Pact recruitment | 20–22s | [A07_021s_radiant-pact.jpg](references/A07_021s_radiant-pact.jpg) |
| A08 | Radiant Pact missions | 23–24s | [A08_023s_missions.jpg](references/A08_023s_missions.jpg) |
| A09 | Overdrive Special Recruit | 27–33s, 35–36s, 108–113s | [A09_028s_special-recruit.jpg](references/A09_028s_special-recruit.jpg) |
| A10 | Special Pack shop | 37–61s, 64s, 66–72s, 74s, 78s, 80–82s, 85s | [A10_038s_chapter-pack-banners.jpg](references/A10_038s_chapter-pack-banners.jpg), [A10_041s_limited-offer-grid.jpg](references/A10_041s_limited-offer-grid.jpg) |
| A11 | Special Pack detail | 62s, 73s, 76s, 83–84s | [A11_062s_pack-detail.jpg](references/A11_062s_pack-detail.jpg) |
| A12 | Purchase Confirmation | 63s, 77s | [A12_063s_purchase-confirmation.jpg](references/A12_063s_purchase-confirmation.jpg) |
| A13 | Overdrive Ticket information | 75s | [A13_075s_item-information.jpg](references/A13_075s_item-information.jpg) |
| A14 | Item Shop | 86–91s | [A14_086s_tempus-shop.jpg](references/A14_086s_tempus-shop.jpg), [A14_090s_medal-shop.jpg](references/A14_090s_medal-shop.jpg) |
| A15 | Cumulative Purchase event | 92–93s, 96s, 98s, 100–105s, 107s | [A15_092s_period-rewards.jpg](references/A15_092s_period-rewards.jpg), [A15_096s_cumulative-milestones.jpg](references/A15_096s_cumulative-milestones.jpg) |
| A16 | Rewards Obtained overlay | 12s, 24s, 34s, 53s, 65s, 79s, 94s, 97s, 99s, 106s | [A16_034s_rewards-overlay.jpg](references/A16_034s_rewards-overlay.jpg) |
| A17 | How to Obtain sources | 95s | [A17_095s_how-to-obtain.jpg](references/A17_095s_how-to-obtain.jpg) |

### A01 Honk's Depot recruitment

- 화면 크기: 420×924, 종류: full-screen
- 레이아웃: Full cartoon machinery scene; hanging header, 2 right event shortcuts, central wingman/capsule illustration, switch, bottom recruitment buttons, sub-tabs above global navigation.
- 변형: idle; free-recruit reward animation
- 실제 문구: HONK’S DEPOT, Packs, Missions, Switch, History, Preview, Recruit ×1, Recruit ×10, Pilot Recruit, Cloud Hub
- 관찰 진입·복귀: Video begins already inside this screen; next observed screen is Pilot List.

### A02 Pilot List

- 화면 크기: 420×924, 종류: full-screen
- 레이아웃: Bronze mechanical header; filter and count; amplification progress bar; 3-column portrait card grid with level, rarity and circular equipment icons; 2 collection tabs; global navigation.
- 변형: top of 3-column collection; scrolled collection
- 실제 문구: PILOT LIST, All, Pilots 28/29, Advance, Pilot, Pappo
- 관찰 진입·복귀: Honk’s Depot → Pilot List → Adventure lobby.

### A03 Adventure lobby

- 화면 크기: 420×924, 종류: full-screen
- 레이아웃: Player HUD and currencies at top; large hero center; 5 left/6 right floating event icons; three event shortcuts above dominant yellow Start; 5-icon global navigation at bottom.
- 변형: animated hero pose; live event badges and red dots
- 실제 문구: Store, First Purchase, Privileges, Special Recruit, Radiant Pact, Menu, Flight Log, Patrol, Events, Mystic Visit, Recruit, Start, Realm Trial, Golden Apple Rush
- 관찰 진입·복귀: Pilot List → lobby; menu/mail/friends return here; Radiant Pact and Special Recruit event screens branch from here.

### A04 Lobby menu drawer

- 화면 크기: 420×924, 종류: drawer
- 레이아웃: Right-aligned wooden vertical drawer over dimmed lobby, approximately x233–419/y122–520.
- 변형: normal; Sent successfully toast while menu remains open
- 실제 문구: Friends, Mail, Backpack, Settings, Account, Notice, Support
- 관찰 진입·복귀: Lobby → menu → Mail; Mail closes to menu → Friends; Friends closes to menu → lobby.

### A05 Mail list

- 화면 크기: 420×924, 종류: modal
- 레이아웃: Layered papers on clipboard; large all-caps title; scrollable message rows; blue Delete Read and yellow Claim All; upper-right red close badge. Approx x25–406/y188–774.
- 변형: unclaimed messages list
- 실제 문구: MAIL, Overdrive Ticket Conversion, Fest Sign-in Rewards, Fest Shop Item Removal, Nemeses’ Return Seasonal Ranking Rewards, Delete Read, Claim All
- 관찰 진입·복귀: Menu → Mail → reward overlay → menu. No individual message details are shown.

### A06 Friends list

- 화면 크기: 420×924, 종류: modal
- 레이아웃: Tilted clipboard/paper; count, delete icon, sort control; friend rows with avatar, level, stage/status and two energy buttons; footer buttons. Approx x4–416/y144–853.
- 변형: send/claim icons change state
- 실제 문구: FRIENDS, Friends 4/50, By Level, New Friends, Send and Claim All, Today’s Claims 0/5
- 관찰 진입·복귀: Menu → Friends → menu. Personal account/friend names are reference content and should be replaced in a sample.

### A07 Radiant Pact recruitment

- 화면 크기: 420×924, 종류: full-screen
- 레이아웃: Ice-blue full-height hero and vehicle artwork; snow/ice title; 4 event shortcuts; orb-shaped reward pool; 2 bottom recruit buttons; local back button.
- 변형: idle and hero animation
- 실제 문구: RADIANT PACT, Packs, Radiant Pass, Missions, Exchange Shop, SS Silvanna, History, Preview, Standard Pool, Recruit ×1, Recruit ×10
- 관찰 진입·복귀: Lobby → Radiant Pact → Missions → reward overlay → lobby.

### A08 Radiant Pact missions

- 화면 크기: 420×924, 종류: modal
- 레이아웃: Blue-framed parchment sheet; stacked mission rows with reward icon, 2-line description, progress bar and right action; sticky Claim All footer; red close badge. Approx x21–409/y188–781.
- 변형: claimable; claim success reward animation
- 실제 문구: Missions, Own Permanent Privilege during the event., Own Monthly Pass during the event., Claim Ad rewards 10 time(s) in total., Go, Claim, Claim All
- 관찰 진입·복귀: Radiant Pact → Missions; claim reward appears over this modal; next visible full screen is lobby.

### A09 Overdrive Special Recruit

- 화면 크기: 420×924, 종류: full-screen
- 레이아웃: Orange/teal canyon setting with oversized pilot and drill vehicle; event marquee; upper left reward ladder shortcut; right packs/growth shortcuts; lower history/preview; bottom recruit buttons and local back.
- 변형: entry scene before hero appears; hero idle; recruit/claim particle animation; ticket count changes after repeat draw
- 실제 문구: Overdrive, Special Recruit, Rewards, Packs, Growth Gift, SP Explorer Joey, UP, History, Preview, Recruit ×1, Recruit ×10
- 관찰 진입·복귀: Lobby → Special Recruit → reward overlay → Special Recruit → shop. Final sequence returns here from Cumulative Purchase and repeatedly draws.

### A10 Special Pack shop

- 화면 크기: 420×924, 종류: full-screen
- 레이아웃: Brick wall and theater lights; multi-currency top bar; centered title; 2 mode tabs. Chapter banners span almost the width. Limited offers use 2 columns with duration, value starburst, reward icon, quantity/limit, price button. Fixed 4-item shop navigation and back button.
- 변형: loading/empty content state at 37s; Chapter Pack: large horizontal illustrated chapter banners with Normal/Elite selector (38–39s); Limited-Time: 2-column offer-card grid, long vertical scroll (40–85s); free gift claim animation and disabled card; Insufficient items toast (47–48s); temporary collection progress banner (66–67s,80–81s)
- 실제 문구: Special Pack, Limited-Time, Chapter Pack, Normal, Elite, Daily Limit, Total Limit, FREE, Special Pack, Top Pick Packs, Cumulative Purchase, Item Shop
- 관찰 진입·복귀: Special Recruit → Special Pack; scroll to offers; offer → detail → purchase confirmation → reward. Item Shop and Cumulative Purchase use bottom shop tabs.

### A11 Special Pack detail

- 화면 크기: 420×924, 종류: modal
- 레이아웃: Cream paper modal with blue upper trim, title, centered horizontal reward icons, one yellow price button, close badge; underlying shop is dimmed. Approx x14–405/y326–612.
- 변형: different offer item bundles and prices share one shell
- 실제 문구: Overdrive Special Pack
- 관찰 진입·복귀: Special Pack offer card → pack detail; choosing price → Purchase Confirmation; closing returns to shop.

### A12 Purchase Confirmation

- 화면 크기: 420×924, 종류: modal
- 레이아웃: Large cream/blue curved frame; explanatory sentence; cash price and alternative green-ticket currency price; blue and yellow side-by-side buttons; close badge. Approx x14–405/y300–665.
- 변형: different price and item description
- 실제 문구: Purchase Confirmation, Use Cash, Use M-Cash
- 관찰 진입·복귀: Pack detail price → confirmation → source-video purchase/reward → shop. The analysis itself performs no purchase.

### A13 Overdrive Ticket information

- 화면 크기: 420×924, 종류: modal
- 레이아웃: Plain large parchment card with Owned tag at upper right; centered large icon, bold item name, thin divider and centered multiline explanation. Approx x10–410/y333–635.
- 변형: one observed item
- 실제 문구: Owned: 20, Overdrive Ticket, An event item used to participate in Special Recruit. It will be converted to Skyward Recruit Tickets at a 1:1 ratio and sent to you via mail after the event ends.
- 관찰 진입·복귀: Special Pack reward icon → item information → pack detail (observed next).

### A14 Item Shop

- 화면 크기: 420×924, 종류: full-screen
- 레이아웃: Same brick-wall shop frame and bottom shop navigation; two sub-tabs and reset timer; 3-column square item grid with rarity backgrounds, price and purchase limit beneath.
- 변형: Tempus Shop (86–87s); Medal Shop (88–91s); brief content transition/empty grid at 89s; free currency claim animation
- 실제 문구: Item Shop, Medal Shop, Tempus Shop, FREE
- 관찰 진입·복귀: Special Pack → Item Shop Tempus → Medal tab; free reward is claimed; next visible screen is Cumulative Purchase.

### A15 Cumulative Purchase event

- 화면 크기: 420×924, 종류: full-screen
- 레이아웃: Teal patterned event panel within brick shop frame. Period tab has hero display case and milestone medallions; cumulative tab has dense progress cards. Two rounded sub-tabs just above global shop navigation.
- 변형: Period Rewards: illustrated display stage and circular amount targets; claim footer (92–93s); Cumulative Purchase: stacked medal milestones, progress bars and reward-icon rows; Claim/Go/completed states (96–103s); Period Rewards after claim: next-tier requirement and Go instead of Claim (104–107s)
- 실제 문구: Cumulative Purchase, Total Collected, Limited-Time Offer: Epic Wingman Selection, Earn Flight Medals, Claim, Go, Period Rewards
- 관찰 진입·복귀: Item Shop → Cumulative Purchase; claim → Rewards → How to Obtain; milestone tab → reward claims → Period Rewards → claim → Special Recruit.

### A16 Rewards Obtained overlay

- 화면 크기: 420×924, 종류: overlay
- 레이아웃: Shared dark purple translucent theater/stage overlay with hanging stars, soft spotlight/ellipse and centered one-or-more reward icons; underlying screen remains visible; no new independent navigation.
- 변형: single item; multiple items; progress tier banner above reward; flying reward icons after dismissal
- 실제 문구: Rewards Obtained, Tap Anywhere
- 관찰 진입·복귀: Shared overlay following claims/recruit/purchases; it dismisses back to whichever family produced the reward.

### A17 How to Obtain sources

- 화면 크기: 420×924, 종류: modal
- 레이아웃: Tall blue paper panel, cream acquisition-source rows, source icon, value ribbon, quantity and blue Go; red close badge. Approx x20–406/y211–790.
- 변형: two acquisition rows
- 실제 문구: How to Obtain, Privileges, Special Pack, Collectible Amount, Minimum Collectible Amount, Go
- 관찰 진입·복귀: Cumulative Purchase question/source shortcut → How to Obtain → Cumulative Purchase. Floating claimed rewards are still animating during this frame.

## 공통 요소와 중복 제외

- Top currency strips with green add buttons
- Five-item global navigation (Recruit/Pilot/Adventure/aircraft-like icon/reward chest icon); shop instead uses four tabs plus Back
- Yellow primary and pale blue secondary bevel buttons
- Cream parchment modal bodies, dark ink outlines, right red close badge
- Red notification dots
- Reward items with rarity frames
- Shop currency/item flying particles after claims
- Toast: Sent successfully / Insufficient items
- Long vertical lists and horizontal mode tabs

## 미확인·범위

- 1-second sampling can miss sub-second transitions; entry/return descriptions follow visible screen sequences and do not prove the exact input gesture.
- No gameplay/combat stage, Settings, Backpack, Account, Notice, Support details, individual mail, New Friends flow, recruitment History/Preview, alternate collection Pappo content, packs/growth detail, event battle, store Top Pick tab, or global extra tabs are shown. These are visible labels only, not observed screen families.
- A small grey tooltip at the right edge of the first frame reads partial external-looking media text (5K Purple Star-Field …). It is not assigned as an ACECRAFT family.
- Account and friend identity text are deliberately not transcribed into this inventory.
- Full original images are preserved; poster tiles resize whole frames and add external captions without cropping.

## 파일

- `metadata.json`: 원본 AVFoundation 메타데이터.
- `frames/index.json`: 추출기의 실제 요청/채택 시각·치수·파일.
- `annotated-time-index.json`: 114개 프레임 각각의 가족·상태.
- `family-inventory.json`: 상세 가족·모든 연속 타임라인 구간.
- `contact-sheets/`: 전체 1초 프레임 연락판 5장.
- `references/`: 20개 대표 JPG. 전체 프레임 그대로 보존.
- `reference-a-poster.png`: 카탈로그용 전체 프레임 대표 포스터. 분석 참조 전용.
