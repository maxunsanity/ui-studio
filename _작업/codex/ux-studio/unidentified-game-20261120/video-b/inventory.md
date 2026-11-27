# ACECRAFT 영상 B 분석

상태: 영상 관찰 기반 제안. 캡처·확대 crop은 참조 전용이며 제품 리소스로 사용하지 않습니다.

- 원본: `/Users/max/Desktop/화면 기록 2026-11-19 오후 1.43.19.mov`
- 33.505초 / 420×924 세로 / AVFoundation 명목 30.835fps.
- 전 구간 1초 표본 34장 + 보조12장 + 27–30.625초 0.125초 표본30장. 마지막 실제33.433333초.
- 공식 App Store 이벤트와 SP Explorer Joey/Special Recruit/Overdrive Tickets가 일치하여 ACECRAFT로 확인.
- https://apps.apple.com/es/app/acecraft/id6499112583?eventid=6827963235

## 고유 UI 판틀 8개

### B01 · Overdrive Special Recruit
- 대표: `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00003.jpg` / 요청3.000000초 / 실제2.841667초
- 계층: Top resource strip → Title ribbon + timer → Left hanging total-reward plaque / right round Packs and Path of Growth shortcuts → Full bleed Joey and enormous forward drill → Right History / Preview → Two pity strips → Bottom back + FREE + blue single draw + yellow ten draw
- 문구: Overdrive | Special Recruit | Remaining Time: 25d 23h | Total Rewards | Packs | Path of Growth | SP Explorer Joey | UP | Every mishap is the start of an adventure. | History | Preview | Excellent or better Pilot Comes in 4 Draw(s) | Explorer Joey Comes in 64 Draw(s) | Recruit ×1 | Recruit ×10 | FREE
- 미확인: History, Preview, Path of Growth, help contents not shown

### B02 · Recruitment cinematic
- 대표: `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00010.jpg` / 요청10.000000초 / 실제9.983333초
- 계층: Full screen bronze numbered rotary-dial machine → Electric vertical chamber → Telephone operator woman at desk → Small Skip lower right
- 문구: Skip
- 미확인: Input/skip timing not logged

### B03 · Pilot reveal A Scott
- 대표: `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/selected/frame_00000.jpg` / 요청0.500000초 / 실제0.491667초
- 계층: Dim recruitment page → Smoke halo → A Scott rank/name upper left → Pilot + propeller plane on stone platform → Tap Anywhere lower center
- 문구: A Scott | Tap Anywhere
- 미확인: Other rarity reveal geometry unknown

### B04 · Rewards Obtained
- 대표: `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00021.jpg` / 요청21.000000초 / 실제20.966667초
- 계층: Dim recruitment background → Cream clouds, hanging gold stars and toy planes → Centered title + decorative line → Smoke-backed reward icon grid or single centered icon → Optional pity strips and recruit buttons / Tap Anywhere
- 문구: Rewards Obtained | Tap Anywhere | Recruit ×1 | Recruit ×10 | Excellent or better Pilot Comes in 3 Draw(s) | Explorer Joey Comes in 43 Draw(s)
- 미확인: Gear names and whether draw results merge into seven slots unknown

### B05 · Insufficient ticket notification
- 대표: `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00026.jpg` / 요청26.000000초 / 실제25.991667초
- 계층: Dim recruitment screen → Cream parchment with curved blue header trim/gold rim → Close X upper right → Title + message → Blue Cancel and yellow Confirm
- 문구: Notification | Not enough Overdrive Tickets. Go get more? | Cancel | Confirm
- 미확인: Confirm destination not demonstrated; clip dismisses then later enters shop

### B06 · Special Pack shop
- 대표: `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/frames/frame_00031.jpg` / 요청31.000000초 / 실제30.983333초
- 계층: Fixed resource strip + purple title banner → Brick wall, 3 lamps and hanging stars → Two top tabs: Limited-Time selected / Chapter Pack → Two-column vertically scrolling gold product cards → Fixed bottom back + four destinations
- 문구: Special Pack | Limited-Time | Chapter Pack | Special Pack | Top Pick Packs | Cumulative Purchase | Item Shop
- 미확인: Chapter Pack and other bottom destination content not shown / Final-row prices offscreen / Additional lower products unknown

### B07 · Overdrive Special Pack detail
- 대표: `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/selected/frame_00011.jpg` / 요청33.465000초 / 실제33.433333초
- 계층: Dim shop → Cream/blue/gold dialog with Close X → Title → Three square reward slots: red 24H bottle ×8 / Overdrive ticket ×18 / round gold star icon ×20 → Single yellow price button
- 문구: Overdrive Special Pack | 24H | ×8 | ×18 | ×20 | 76.90
- 미확인: Gold star icon currency name unknown / No purchase or purchase-confirmation result shown / Currency glyph looks ₪-like but locale/name not shown

### B08 · Power Cube item tooltip
- 대표: `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unidentified-game-20261120/video-b/detail/frame_00021.jpg` / 요청29.625000초 / 실제29.608333초
- 계층: Dim recruitment screen → Wide cream rectangle centered → Owned chip top right → Centered gold square cube icon → Bold name + dotted separator + body → Small brown chest shortcut on right edge
- 문구: Owned: 7 | Power Cube | Event item used to participate in Honk’s Depot to recruit Signature Wingman.
- 미확인: Chest shortcut target and exact dismiss input not shown

## 상점 수량·문구

- 상단 탭2개: Limited-Time(선택), Chapter Pack. 하단 목적지4개: Special Pack(선택), Top Pick Packs, Cumulative Purchase, Item Shop. 뒤로는 별도 버튼.
- 2열, 4행8개 상품 관찰. 4행은 가격이 화면 밖. 내용은 스크롤되고 제목·탭·하단 내비게이션은 고정.
- 자원값6514/1349/76/7, 다음 줄 Power Cube7. 이름 없는 자원은 아이콘으로만 분리했습니다.

|위치|기한|뱃지|구매제한|보상|가격|
|---|---|---|---|---|---|
|row1-left|미표시|400% Value|Daily Limit 1/1|bundle image; small 80 below, preceding glyph and item name unclear|3.80 (₪-like cash glyph)|
|row1-right|25d||Total Limit 2/2|Overdrive ticket ×10|10 (blue diamond)|
|row2-left|25d||Total Limit 1/2|Overdrive ticket ×10|3000 (blue diamond)|
|row2-right|25d|300% Value|Total Limit 1/1|Overdrive ticket ×18 + red 24H bottle ×8|76.90 (₪-like cash glyph)|
|row3-left|25d|200% Value|Total Limit 2/2|Overdrive ticket ×30 + gold 24H coin ×12|199.90 (₪-like cash glyph)|
|row3-right|25d|130% Value|Total Limit 10/10|Overdrive ticket ×50 + red 24H bottle ×12|375.00 (₪-like cash glyph)|
|row4-left, partial|11d|260% Value|Total Limit 1/1|gold ticket ×5 + red 24H bottle ×4|화면 밖 (offscreen)|
|row4-right, partial|11d|260% Value|Total Limit 1/1|Power Cube ×5 + gold 24H coin ×4|화면 밖 (offscreen)|

- 상세76.90 패키지에는 빨간24H병×8/티켓×18/금색별 원형아이콘×20. 별 아이콘 이름은 표시되지 않습니다.
- 통화는 ₪와 비슷해 보이나 로케일 이름이 없어 명칭을 확정하지 않았습니다.

## 실제 관찰 순서

- 0–0.5s A Scott reveal already open
- 0.99s recruit;1.98s summary;2.84s recruit with earlier values (embedded recording playback discontinuity)
- 7.98–12s cinematic;12.97s Scott;14s summary;14.98s recruit
- 15.98–20s repeated cinematic;20.97s multi summary;21.98s recruit
- 22.98s dial;23.99s single reward;24.98s recruit
- 25.99s insufficient-ticket dialog;26.99s recruit
- 28.24–28.37s milestone summary cube ×2;28.5s cube-flight;28.73s and29.34–29.61s Power Cube tooltip;29.75s recruit
- 30.48s shop loading;30.98s shop;31.98–32.99s content scroll;33.43s package detail

## 제작 우선순위와 반복 제외

- B01 recruiter → B04 reward variants → B05 shortage dialog → B06 shop → B07 package detail → B08 item tooltip → B03 reveal → B02 staged cinematic
- Joey pose/eye animation
- Repeated operator/dial cinematic
- Reward slot-count changes as separate family
- Cube flight sparkle as separate screen
- Embedded video play/pause controls and selection border

## 추정·미확인

- 추정: Recruit ×10 consumes ten tickets in stable later sequence18→8; Recruit ×1 consumes one8→7.
- 추정: Confirm on shortage dialog may go to purchase route but the video does not demonstrate it.
- 추정: Repeated cinematic/gear icon grids are variants, not separate screens.
- 미확인/주의: Early game clock jumps backward and embedded play/pause is recorded: do not derive rewards or game logic from early18→28.
- 미확인/주의: One-second sampling plus focused detail is not exhaustive for all unseen transitions.
- 미확인/주의: All frame/crop images are reference only; production must use newly generated art.
- 미확인/주의: No actual game runtime input testing, build, audio analysis, or source modification performed.

상태별 수치·정확한 대표 시점·레이아웃 근삿값은 inventory.json에 포함했습니다.
