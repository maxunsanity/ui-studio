# 모노폴리 GO 10화면 도구 조립 명세

작성: codex(단이) · 2026-11-16 KST · 제안(검수 대기)

목표는 첨부 10장을 같은 551×984 논리 설계 안에서 부품별로 조립하고, 메인 입구에서 각 화면의 닫기/뒤로/복귀를 시험할 수 있게 만드는 것입니다. 기존 [10장 제작·연결 계획](20261116-monopoly-ten-screens.md)을 보존한 상세 명세이며 이번 문서 단위에서 제품·설계 JSON·실제 UI를 변경하지 않았습니다. 최신 제작 시한은 사용자 지시 기준 2026-11-17(화) 08:00 KST입니다. 시한이나 문서 작성은 완성·사용자 승인·freeze를 뜻하지 않습니다.

## 1. 조립할 때 먼저 여는 자료

|자료|용도|
|---|---|
|[원본 manifest](../reference/monopoly-go/20261116-ten-screens/manifest.json)|10장 보존 사본·W/H·SHA-256. 이번 단위에서 10장 모두 실제 그림을 열고 크기/해시를 대조했습니다.|
|[화면 CSV](20261116-ten-screen-assembly-screens.csv)|각 원본 크기→551×984 배율, 원 비율 contain 크기/여백, 화면 종류·스크롤 계획|
|[레이어 CSV](20261116-ten-screen-assembly-layers.csv)|132개 주요 계층/텍스트/버튼의 원본 rect, 화면 %, 논리 px, 부모 논리 px/%와 관찰/제안 구분|
|[연결 CSV](20261116-ten-screen-assembly-connections.csv)|43개 입구·닫기·뒤로·미확인·로컬 상태 항목. 실제 ID를 확인한 뒤 연결할 역할표이며 JSON import 파일이 아닙니다.|
|[공통 로비 제작 표준](../../src/tools/uxStudio/guide/TOOL_SPEC.md#로비-제작-표준)|이미지/프레임/입력/텍스트 분리, 9slice, 가이드, 이름, 동일 메뉴 규격, 저장 검수|
|[하단 메뉴 공통 규격](20261116-bottom-menu-standard.md)|같은 역할의 네 메뉴 규격. 원본 5번의 다른 크기/영문 라벨을 그대로 옮기며 현재 규격을 깨지 않습니다.|

CSV의 `O`는 그림에서 본 주요 가시 경계/컨테이너 범위의 근사 관찰이고 `P`는 관찰 기반의 조립 box·입력 wrapper·편집 텍스트 또는 현재 공통 규격입니다. `U`는 원본/게임 동작 미확인입니다. 가시 경계는 시각 추정 약 ±2~5 원본 px이며 작은 잉크·클립·그림자는 더 불확실합니다. 환산 소수점은 계산 결과이지 측정 정밀도를 높인 값이 아닙니다. native text wrapper를 실제 잉크 bbox나 원본 font-size로 읽지 않습니다.

원본들은 계절·화폐·잔량·이벤트가 다른 캡처입니다. 모든 수치를 한 플레이 상태로 합치지 않습니다. 기존 551×984 자료와 이번 5번 **709×1269**도 다른 원본입니다. 원본 Unity 계층·폰트·보이지 않는 경계·실제 게임 API·구매 정책은 미확인입니다.

## 2. 좌표·화면·공통 부품 계약

원본 rect=(x,y,w,h), 원본 크기=(W,H)이면 화면 %=(100x/W,100y/H,100w/W,100h/H), 551×984 배치 참조=(551x/W,984y/H,551w/W,984h/H)입니다. 부모 rect=(px,py,pw,ph)의 논리 px는 (x−px,y−py,w,h), 부모 %는 각 x/w를 pw, y/h를 ph로 나눕니다. CSV의 `logical_*`는 전역 논리 좌표, `parent_local_*`/`parent_*_pct`는 지정 부모 안의 값입니다. 화면 %를 부모 % 입력에 그대로 복사하지 않습니다.

이 환산은 **레이아웃 위치의 참조**입니다. 그림·원·아이콘·폰트 자체를 가로/세로 서로 다른 배율로 찌그러뜨리지 않습니다. 원 비율 contain 배율은 min(551/W,984/H), cover는 max입니다. 3번 앨범은 x배율1.249433/y배율1.346101로 약7.737% 차이가 있으므로 상단/카드 아트 비율을 유지하고 세로 남는 영역은 목록/여백으로 재배치합니다. 캡처 전체 한 장을 늘려 UI로 쓰지 않습니다.

|번호|원본 W×H|논리 배치 배율 x / y|조립할 screen.kind|내용 영역|
|---|---|---|---|---|
|1 짓기|422×750|1.305687 / 1.312000|page|장면+고정 건물 선택줄|
|2 승리|324×568|1.700617 / 1.732394|modal|클립보드/3개 미션/주간 보상|
|3 앨범|441×731|1.249433 / 1.346101|page|고정 헤더+3열 세트 grid, scroll-y 제안|
|4 친구|512×922|1.076172 / 1.067245|modal|고정 제목/3탭+타임라인 scroll-y|
|5 메인|709×1269|0.777151 / 0.775414|page, 기존 ID 유지|전체 장면+HUD/이벤트/GO/하단 UI|
|6 우측 메뉴|296×531|1.861486 / 1.853107|sheet|우측 고정 drawer+9행+하단 닫기|
|7 방패|294×530|1.874150 / 1.856604|page|보관함+방패 진열+4종류 탭|
|8 돈 상점|818×1449|0.673594 / 0.679089|page|고정 HUD/닫기+가로 상품/세로 상품 목록|
|9 이벤트 제안|418×747|1.318182 / 1.317269|modal|구매 제안 그림/보상/가격/시간/횟수|
|10 타이쿤|610×1095|0.903279 / 0.898630|modal|진행/시간+순위 scroll-y, 내 순위 고정|

`scroll`/`drawer`는 별도 screen.kind 값이 아닙니다. 현행 종류는 page/modal/sheet이며 목록은 요소 `overflow='scroll-y'/'scroll-x'`, drawer는 sheet 안의 우측 패널로 조립합니다. modal/sheet의 dim·blocking·Escape는 presentation 정책을 사용하고 반투명 BG를 다시 중복 깔지 않습니다. 바깥 탭 닫기는 원본만으로 확인되지 않아 임의 활성화하지 않습니다.

공통 부품은 다음처럼 분해합니다.

- **버튼/행/카드:** Parent Btn/Group → BG → Img → Frame → Txt → Input/Badge. 이 순서는 실제 paint/hit 소유를 확인하는 기준이며 모든 종류에 강제로 자식을 만드는 규칙은 아닙니다. 프레임은 기존 3/9slice, 장식 crown/클립/아치 등은 별도 고정 아트입니다. source slice·logical edge·padding·최소 크기를 구분하고 custom alpha를 tone 판으로 덮지 않습니다.
- **그림/효과:** PNG 원본 보존, 정확한 정사각 region·alpha/흰 여백·실루엣·아트/입력 box 분리. 새 제작 그림에는 UI 문구/숫자/입력 영역/UI cast shadow를 굽지 않습니다. 등록 WebP는 300000bytes 이하·압축 방식/sourceSize/hash를 기록하고 그림자는 element.effects.shadow로 분리합니다.
- **텍스트 폼:** 표시 글자는 `kind='text'`의 편집 가능한 native 부품입니다. 텍스트 입력 컨트롤을 뜻하지 않습니다. `Txt_<영역>_<역할>_<용도>`로 name을 정하고 id/parentId/기존 연결은 보존합니다. 제목·가격·시간·수량·닉네임·GO·도움말을 이미지 한 장에 넣지 않습니다. 예: Txt_Shop_Product01_Price, Txt_Tycoon_Rank01_Score. 원본 font-family/size/weight/line-height는 미확인이고 대체 스타일을 제작값으로 기록합니다.
- **반복 행:** 같은 역할끼리 box/아트 슬롯/텍스트 위치를 통일합니다. 자동 배치는 고정 itemSize 계약이므로 4번의 큰 요청 행과 작은 활동 행을 같은 고정 높이 목록에 무리하게 섞지 않습니다. 큰 요청 1개+고정 활동 행 목록 또는 수동 content wrapper 두 변형으로 나눕니다.
- **4개 하단 메뉴:** 부모80×92, icon64×64@8,6, Txt80×22@0,70(font14/weight500/line18), Badge28×28@52,0. 화면 x=0/88/384/471,y888. 이전 badge y=-4는 폐기했습니다. `Txt_BottomNav_Wins_Label`, `Txt_BottomNav_Build_Label`, `Txt_BottomNav_Album_Label`, `Txt_BottomNav_Friends_Label`을 사용합니다. 동일 규격과 contain으로 원그림의 가시 비율을 함께 보존합니다.
- **알림/시간/값:** notification의 count/dot·0숨김·99+·flat runtime key를 재사용하고 문구/name과 키를 구분합니다. 예를 들어 nav.buildCount는 단일 flat key입니다. 새로운 실제 게임 키/정책은 임의 확정하지 않습니다. 공통 compound 배지의 실제 조립은 본체 진행 중이며 독립 숫자 자식 분리 완료를 먼저 주장하지 않습니다.

기존 메인/4메뉴와 맞는 요소가 있으면 CSV name을 실제 ID에 대응시키며 찾습니다. 이름을 맞춘다는 이유로 기존 ID를 재발급하거나 현재 parent를 일괄 교체하지 않습니다. 부모 변경이 필요한 새 구조는 먼저 현재 계층·연결을 대조하고 변경/Undo 범위를 별도로 남깁니다.

## 3. 화면별 조립 카드

각 카드의 rect는 원본 px입니다. 실제 입력값은 레이어 CSV에서 같은 이름의 부모 좌표 열을 찾습니다. BG/Frame·반복 텍스트·입력 등 세부 자식은 위 공통 템플릿으로 확장합니다.

### 1 · 짓기 — page-build

원본: [01_build.png](../reference/monopoly-go/20261116-ten-screens/01_build.png).

- **관찰/계층:** 전체 도시/바다/자유의 여신상 장면을 Slot_Build_Scene 아래 Img_Build_City_Backdrop으로 둡니다. HUD[12,12,403,42], 건물 선택줄[4,543,414,134], footer[0,685,422,65]는 별도 형제입니다. 선택줄 안 5카드는 같은 역할의 LandmarkCard, 4번째는 완료 체크가 보입니다.
- **native 자식:** HUD 재화, 각 카드 단계/가격, Txt_Build_City_Progress, 닫기 X. 카드에는 BG/Frame·건물 그림·단계 점·재화 아이콘·가격 또는 체크를 분리합니다. source fixture는 4,404, 가격240/312/384/528, NEW YORK CITY 3/15입니다.
- **연결/수락:** 메인 짓기→navigate, 하단 X→back. 도시 장면이 카드/HUD를 덮지 않고 5카드 가격/체크가 편집 가능하며 화면 밖 넘침 없이 저장/재열기 되어야 합니다. 건물 업그레이드·돈 차감·도시 완성 규칙은 미구현으로 남깁니다.

### 2 · 승리 — modal-wins

원본: [02_wins.png](../reference/monopoly-go/20261116-ten-screens/02_wins.png).

- **관찰/계층:** 배후 메인은 실제 메인 화면을 재사용합니다. Group_Wins_Clipboard[6,61,309,473] 아래 BG9/Frame9·제목·타이머·미션 목록[31,188,259,187]·주간 보상[23,385,276,147], 클립[85,50,149,40]과 footer 닫기는 독립 고정 장식/입력입니다.
- **native 자식:** “오늘의 퀵 승리”, 남은 시간, 미션 문구·진행, 주간 설명·일수. 3행은 아이콘/문구/체크 분리이며 완료 체크 3개가 관찰됩니다. 원본4시간16분·7일 중1일차는 고정 관찰 fixture이고 실제 카운트다운/보상 데이터가 아닙니다.
- **연결/수락:** 승리→open, X/Escape→close. 메인 입력 차단·포커스/열기 버튼 복귀·중복 열기 방지·타이머/미션 편집·기존 메인 상태 유지 확인. 미션 판정/주간 보상 지급은 별도입니다.

### 3 · 앨범 — page-album

원본: [03_album.png](../reference/monopoly-go/20261116-ten-screens/03_album.png).

- **관찰/계층:** 헤더[0,0,441,267] 아래 타이틀/대보상 배너[21,62,398,163]·시간·진행·info. List_Album_Sets[0,267,441,464]는 3열 카드이며 세 번째 줄이 원본 하단에 일부 보입니다. 스크롤은 이 관찰을 근거로 한 조립 제안입니다.
- **native 자식:** 타이틀·“승리하려면 앨범을 완성하세요”·대보상15K·남은22일10시간·진행2/216·세트 이름·0/9 또는1/9. 세트 그림/제목/진행 BG·fill·숫자를 분리합니다. 모든 텍스트를 이미지에 합치지 않습니다.
- **연결/수락:** 앨범→navigate. 원본에 뒤로 입력이 보이지 않아 Btn_Album_Back[논리8,8,44,44]는 필요한 복귀를 위한 **우리 제안**입니다. back→main. 그림 비율 유지·3열 공통 카드·스크롤 하단 접근·복귀 후 선택/스크롤 상태를 확인합니다. info/세트 상세는 첨부가 없으므로 목적지를 만들지 않습니다.

### 4 · 친구 — modal-friends

원본: [04_friends.png](../reference/monopoly-go/20261116-ten-screens/04_friends.png).

- **관찰/계층:** Group_Friends_Panel[10,112,494,747] 안 제목·3탭[23,213,471,89]·타임라인 viewport[23,308,470,548], footer[0,859,512,63]는 별도 고정 형제입니다. 타임라인이 선택되어 있고 큰 요청 행 뒤에 작은 활동 행들이 이어집니다.
- **native 자식:** 친구/타임라인/리더보드 라벨, 닉네임·경과 시간·요청/활동 문구·전송 개수/남은 시간·거절/보내기. 아바타·스티커·행 아이콘·알림은 분리합니다. NiftyEmu97·0/5 등은 4번 출처 fixture입니다.
- **연결/수락:** 친구→open, X/Escape→close. 3탭 컨트롤 선택 UI와 실제 탭 내용 연결은 구분합니다. 친구 추가/리더보드 내용·실제 스티커 요청/거절/전송 API는 미확인입니다. 큰 행/작은 행이 겹치지 않고 스크롤·고정 닫기·메인 입력 차단·복귀를 확인합니다.

### 5 · 메인 — 기존 screen/element ID 유지

원본: [05_main.png](../reference/monopoly-go/20261116-ten-screens/05_main.png), 정확한 크기709×1269.

- **관찰/계층:** 전체 Slot_3D/Img_BoardBackdrop 뒤에 HUD[15,0,687,125]·상단 이벤트[166,96,381,180]·좌우 이벤트·GO[191,884,345,296]·BottomNav를 별도 형제로 둡니다. 현행 새 공원 2D 시안은 5번 원본 장면과 별개이며 실3D 엔진이 아닙니다.
- **유지/보정:** 부모 HUD +12/SNS Frame 전역 y10과 사진96·안쪽82/흰 rim7은 현재 저장본의 직접 수정값입니다. 5번 환산으로 기존 수정값을 자동 덮어쓰지 않습니다. 본체 전달 기준 ux-gjs-0d80d7fe r4에서 4메뉴 geometry 통일은 저장되었고 폰트 일부·compound 배지 조립은 진행 중입니다. 이 문서 담당의 UI 재검수 결과가 아닙니다.
- **native 자식:** cash36,750,000, CAKE WALK·0/5·보상6·시간, 각 이벤트 시간, GO/HOLD FOR AUTO, x50, 주사위2602/90, 네 메뉴 라벨/배지. 원본 네 메뉴 영문과 기존 한국어 표시 규칙은 출처/제작값으로 나눕니다. source5의 방패는 4개이며 예전551×984의 3개와 합치지 않습니다.
- **연결/수락:** 하단1~4, 메뉴6, 방패7, 돈상점8, 제안9, 타이쿤10 입구를 실제 입력 wrapper에 연결합니다. GO·배수·자동굴림은 게임 기능 미확인입니다. 9/10의 이벤트 그림/이름은 5번과 다른 버전이므로 연결은 시연용 매핑 제안으로 명시합니다. 동일 4메뉴/도형 비율/진입·복귀/저장 재열기 확인 후 결과 revision을 고정합니다.

### 6 · 우측 메뉴 — sheet-main-menu

원본: [06_menu.png](../reference/monopoly-go/20261116-ten-screens/06_menu.png).

- **관찰/계층:** 오른쪽 drawer[111,5,184,468], 프로필 사진[177,32,60,60]/이름, 9행 목록[126,137,165,273], 하단 닫기 strip[0,490,296,37]. 왼쪽 main은 dim 아래 실제로 남깁니다. drawer는 우측 anchor, 행은 같은 높이/아이콘 슬롯/라벨·divider·badge 위치를 공유합니다.
- **native 자식/연결:** SHOP→8, MY SHOWROOM→7의 방패 탭은 제작용 제안입니다. NET WORTH/DAILY TREATS/MAP/BOARD REPORT/JOIN US!/SETTINGS/GO!CHAT의 7목적지는 이번 10장에 없으므로 unknown/빈 target로 남깁니다. 원본 이름을 바꾸며 가짜 상세 화면을 만들지 않습니다.
- **수락:** 메인 메뉴→open(sheet), X/Escape→close. SHOP/SHOWROOM의 navigate는 drawer를 닫고 page로 이동하며 back은 main으로 돌아옵니다. drawer 자동 재열기는 요구/지원으로 가정하지 않습니다. 메인 메뉴 trigger로 포커스가 돌아오는지 별도 확인하고 기본 dim을 중복 쌓지 않습니다.

### 7 · 방패 — page-shields

원본: [07_shields.png](../reference/monopoly-go/20261116-ten-screens/07_shields.png).

- **관찰/계층:** cabinet[0,6,294,447]의 고정 아치/장식·native SHIELDS/보유수, 장착 진열[32,115,229,77], 선반[23,202,247,251]. 하단 종류 탭[0,453,294,38]과 footer 닫기는 별도 형제입니다. 장착 진열 4자리 중 방패2개·두 번째 체크가 보입니다.
- **native 자식/상태:** 제목·보유2·탭 라벨/보조 설명이 있다면 별도 텍스트. 다른 선반은 흐림/비활성처럼 보이지만 해금 조건·가격·소유 여부를 추정 확정하지 않습니다. 카테고리4개 중 방패 화면만 출처가 있습니다.
- **연결/수락:** HUD 방패 또는 메뉴 SHOWROOM→navigate, X→back. 선반/아치 전체를 한 장으로 늘리지 않고 고정 그림/가변 판을 나누며 선택 체크·비활성 표현·탭/닫기 입력을 확인합니다. info/장착 API/다른3카테고리 내용은 미확인입니다.

### 8 · 돈 상점 — page-shop

원본: [08_shop.png](../reference/monopoly-go/20261116-ten-screens/08_shop.png).

- **관찰/계층:** HUD[15,0,793,136], offer viewport[45,127,725,289]와 5개 페이지 점, 세로 상품 영역[0,464,818,899], footer[0,1364,818,85]. viewport 안 3열/2줄 상품 카드는 공통 템플릿입니다. 양/보너스/가격은 각각 text, 주사위/테마 캐릭터는 image입니다.
- **native fixture:** HUD36,750,000/주사위2,627, 상단 offer475/1.55M/₩7,500/2/2 Available. 보이는6카드 가격 ₩3,000/7,500/15,000/29,000/79,000/149,000은 출처 관찰용입니다. 보너스·상품량을 더해 실제 상품 정책으로 계산/확정하지 않습니다.
- **연결/수락:** 메인 돈 또는 메뉴SHOP→navigate, X→back. 가로 offer/세로 상품의 스크롤 소유를 분리하고 고정 footer·카드 끝·가격 편집·포커스·복귀를 확인합니다. 캐러셀 스와이프/페이지 점 동기화와 구매 성공/실패·영수증·실제 과금은 별도 미구현입니다.

### 9 · 이벤트 구매 제안 — modal-event-offer

원본: [09_event-offer.png](../reference/monopoly-go/20261116-ten-screens/09_event-offer.png).

- **관찰/계층:** 패널[33,96,360,615], 바깥 타이틀[117,39,188,120], racing 그림, 별도 증가 원·보상·구매 CTA·시간·횟수·우상단 X. 증가 원[327,271,88,88]은 패널 오른쪽에 의도적으로 걸쳐 보입니다. 그 외 모든 요소까지 넘침을 허용하는 근거로 쓰지 않습니다.
- **native fixture:** 레이싱 챔피언/스타터 팩, 235% 증가!, 주사위525/돈54K, ₩4,400, 22시간56분, 2/2 가능. 문구/보상/가격은 새 racing 일러스트와 분리합니다.
- **연결/수락:** 메인 offer→open, X/Escape→close. 현재 메인SALE과의 연결은 다른 이벤트 원본을 이용한 시연 매핑입니다. 클릭 영역·우상단 닫기·원형 증가표·비율/알파·메인 차단/복귀를 확인합니다. 이벤트 설명창·실제 구매/보상 지급을 같은 완료 범위로 세지 않습니다.

### 10 · 타이쿤/순위 이벤트 — modal-tycoon

원본: [10_tycoon.png](../reference/monopoly-go/20261116-ten-screens/10_tycoon.png).

- **관찰/계층:** 원본 제목은 “발자국 익스프레스”입니다. panel[17,93,576,917], 제목/좌상단 info, hero[28,127,554,315], 진행[101,448,409,74]·타이머, 순위 viewport[33,562,542,382], 내 순위[35,864,539,81], 하단 X[274,1041,56,54]. 내 순위는 목록 밖의 고정 형제로 두고 목록 위에 겹쳐 보이는 순서를 유지합니다.
- **native fixture:** 출발575 안내, 7시간48분, 행 순위·닉네임·점수·보상 수, 내22위/현중/104/40K. 진행 fill 가시 폭으로 실제 총점/목표값을 역산하지 않습니다. 5번 TYCOON CLASS와 같은 이벤트/규칙이라고 확정하지 않습니다.
- **연결/수락:** 메인 타이쿤→open, X/Escape→close. 내 순위 고정·스크롤 뒤 행 접근·이름 말줄임·보상 슬롯·하단 X의 화면 내부 입력·메인 포커스 복귀를 확인합니다. info/실시간 랭킹·보상 확정·동점/정렬 규칙은 미확인입니다.

## 4. 연결을 만들 때의 실행 계약

실제 종류/행동은 [model.mjs](../../src/tools/uxStudio/model.mjs), [overlay-runtime.mjs](../../src/tools/uxStudio/overlay-runtime.mjs), [controls.mjs](../../src/tools/uxStudio/controls.mjs), [responsive-layout.mjs](../../src/tools/uxStudio/responsive-layout.mjs)를 기준으로 합니다.

|입구|툴 행동/대상|닫기·복귀|
|---|---|---|
|짓기/앨범|navigate→page-build/page-album|back, 이전 main과 열기 역할로 복귀|
|승리/친구|open→modal-wins/modal-friends|close 또는 Escape, 같은 main/trigger|
|상단 메뉴|open→sheet-main-menu|close 또는 Escape, 같은 main/메뉴 trigger|
|상단 방패/돈|navigate→page-shields/page-shop|back, 이전 main|
|drawer SHOP/MY SHOWROOM|navigate→page-shop/page-shields|drawer는 navigate로 제거, back→main. 메뉴 trigger 복귀 별도 검수|
|offer/타이쿤|open→modal-event-offer/modal-tycoon|close 또는 Escape, 같은 main/trigger|

각 transition은 실제 fromScreen/fromElement ID, event=click, condition=always, action=navigate/open/back/close를 사용합니다. main-existing-id는 **CSV의 역할 placeholder**이며 현재 메인 ID로 치환합니다. 레이어 CSV의 role=group은 조립 역할로, 새 model.kind='group'을 뜻하지 않습니다. 기존 그룹/패널 생성 기능을 사용합니다. `Btn_*01..NN` 행도 템플릿 설명이며 유효 ID 문자열로 그대로 가져오지 않습니다. 로컬 탭/스크롤 행의 not-a-transition은 실제 transition action이 아닙니다.

누락 목적지는 condition=unknown/빈 target로 남겨 도구 미확인 목록에 표시합니다. 실제 지원되지 않는 openModal/closeModal 같은 action 이름을 새로 쓰거나 미확인 게임 기능에 임의 moduleId를 만들지 않습니다. `module`은 현재 등록 기능 계약에 제한되어 있어 이 게임의 새 API가 자동 생기는 통로가 아닙니다. purchase 시험 흐름을 연결하더라도 실제 과금·정책 완료가 아닙니다.

**복귀의 현재 확인 한계:** 소스의 navigate는 history의 page/selection/filter/focusReturn을 저장하고 overlays를 비웁니다. overlay close는 trigger 복귀 정책을 갖습니다. 그러나 consumer.paint는 layout을 다시 그리며 이 경로에서 DOM scroll 저장/복원 처리를 확인하지 못했습니다. 따라서 목록 스크롤 복귀와 drawer 경유 페이지의 메인 trigger 포커스 복귀는 **소스상 위험 추론/실화면 미검수**로 남깁니다. runtime에 scroll 필드가 있다는 이유만으로 동작 완료라 하지 않습니다. 요구되는 복귀 정책을 실제 조립 후 검증하고 빠진 지원은 본체에 전달합니다.

## 5. 제작 순서와 수락표

기존 저장본/원본을 보존하고 현재 작업 사본에서 진행합니다. UI 값은 입력→Tab/blur→재표시→저장→재열기로 검증하고 가이드/Undo는 같은 실제 ID의 변경인지 확인합니다. 자동 fill 미반영만으로 버그를 단정하지 않습니다.

|순서|도구에서 할 작업|그 단위 수락 기준|
|---|---|---|
|A 공통/메인|현재 4메뉴 geometry 유지→텍스트 name/폰트·compound badge 마무리→9개 입구 역할 식별|같은 규격/부모 안 배지·편집 text·안정ID/부모/기존연결·한 번 Undo·저장 재열기|
|B 1/2|짓기 LandmarkCard·승리 MissionRow/WeeklyReward 조립→두 입구 연결|page back/modal close 구분·가격/미션 text 편집·BG/Frame/입력 분리·복귀|
|C 3/4|앨범3열/친구2행변형·tabs·scroll viewport 조립→입구 연결|비율/목록 끝 접근·고정 제목/닫기·탭 미확인 명시·스크롤/포커스 복귀 실제 확인|
|D 6/7/8|drawer9행→방패 보관함→상점 가로/세로 목록→상단/SHOP/SHOWROOM 연결|우측 anchor·dim1개·행 공통규격·미확인7목적지 노출·닫기/back·가격text·복귀|
|E 9/10|별도 신규 아트·native 문구/수치·제안창·순위 목록/고정 내순위→입구 연결|서로 다른 이벤트 시연 매핑 표시·CTA 게임미연결 구분·원형 오버행/하단 입력·차단/복귀|
|F 전체 왕복|10화면 main 시작→모든 입구→닫기/back/Escape→재진입→저장/재열기|실제 revision/자원hash/수치·포커스·스크롤·입력차단·중복열기·상태 재진입을 화면별 기록|

- [ ] 1440px 데스크톱과 CSS430px 모바일(폰 논리390×844)은 **551×984 설계 기준과 분리**해 시험합니다. viewport·preview 기준·캡처 파일 픽셀 크기를 각각 남깁니다.
- [ ] 이미지 오류/404·의도치 않은 넘침·텍스트 잘림·고정 footer/내순위가 목록을 가리는 범위·hit wrapper와 visible art 차이를 확인합니다. 원본의 의도된 일부 겹침은 화면 카드에서 지정한 부분만 인정합니다.
- [ ] 표시 전용과 실제 입력을 구분하고 배후 메인/뒤 overlay 입력 차단, Tab/Enter/Space/Escape, 열기 trigger 복귀를 확인합니다. 누락 목적지/게임 기능은 미확인 목록을 유지합니다.
- [ ] 실제 준비한 Normal/Highlighted/Pressed/Selected/Disabled 아트/색만 기록합니다. 기존 skin texture 일부 지원·일반 hover·공통 Selectable/TargetGraphic·아이콘 상태 전환을 같은 완료로 세지 않습니다.
- [ ] 새 전체 캔버스의 기기 선택·직접 W/H·기준 설계/preview 분리·비례 반응형은 다른 담당 구현 예정입니다. 이번 조립 명세가 그 새 UX를 구현/검수했다는 뜻은 아닙니다.

최종 제작/검수 revision과 캡처는 본체 결과로 갱신합니다. 문서·CSV 행 수·이미지 수·기존 자동 시험 수는 완성률이 아닙니다. 현재 W/P/U/S 0/4, 게임 동작/Unity 전체/원본 폰트·픽셀 동일성은 미완료입니다. 사용자 특정 버전 명시 컨펌 후에만 원문·KST·방법/설정·원본 hash·revision·실제 캡처를 고정합니다.

## 6. 이번 문서 단위의 확인·보존

이번에 실제 한 일은 첨부 보존 PNG10장 view_image 열람, Pillow 크기/파일 SHA-256과 manifest 대조, 위 관련 source 계약 읽기, 문서/CSV 작성과 구조 검증입니다. 제품 시험·UI 조립·브라우저 조작·서버 실행을 하지 않았습니다. 기존 계획/manifest/PNG는 변경하지 않았습니다.

읽은 원본은 이 문서의 reference/CSV/source 링크, 기존10장 계획, 하단 공통규격 계획, 공통 로비 제작 표준, 이 독립 루트 AGENTS.md와 docs/collaboration/README.md입니다. 원본/계획 보존 사본: `docs/planning/_backup/20261116_단이/1709_ten_screen_assembly_spec/`. 제품·샘플 설계 JSON·가이드·공용 STATUS/보고는 이번 배정에서 수정하지 않았습니다.


## 실제 조립 갱신 · 2026-11-16 18:51 KST · r43

명세132계층/43항목은 그대로 보존합니다. 실제 저장본은 ux-gjs-0d80d7fe r43(2페이지/141부품/2전환)이며 신규01짓기78부품과 기존메인63부품으로 구성합니다. 두 실제 연결은 메인 Btn_BottomNav_Build→Page_Build_City(navigate/always), Btn_Build_Back→직전 화면(back/always)입니다. 10장 최종 동등검수0/10·W/P/U/S0/4, 실제건설/차감과상단menu목적지는미연결입니다. [실제보고](../collaboration/reports/20261116_1755_build-screen.md)·[공통제작recipe](../../src/tools/uxStudio/guide/TOOL_SPEC.md)를 먼저 보고 다음02승리 조립을 이어갑니다.


### 02 원본 문구 정정 · 2026-11-16
02 실물 재판독으로 주간 문구를 “7일 중 1일 차”로 정정합니다. 이전 “3일차”는 관찰 fixture 오기였으며 게임 정책·보상 수치를 바꾼 것이 아닙니다. 별도 quicksheet 원본 대조를 다음 실제 조립 전에 읽습니다.


## 실제 승리 조립 추가 기록 · .13 · r53 기준 · 2026-11-16 20:01 KST

기존132계층/43항목 명세와 .12/r43 실제 조립 기록을 보존합니다. 본체 actual 전달 기준 ux-gjs-0d80d7fe r53은 Main63/Build78과 새 Modal_Wins_QuickWins를 조립한 판이며, Main/Build 최종 deep equality는 본체 확인 대기입니다. 후속 미세수정 revision은 본체 저장 재읽기/실제 보고를 우선합니다.

- 부모 clipboard의 종이 BG와 gold/white Frame은 각각 source128×96·native9 slices/edges27·padding0입니다. 고정 blue clip과 노란 weekly rays는 별도 그림입니다. 미션3행은440×100@(clipboard local42.52,222.01+108n), icon48²@(14,26), native label276×68@(72,16)/font22·700·line28·wrap, check60원+40×32이미지로 통일했습니다.
- 주간 BG/fill은 source128×32·native3 slices[0,16,0,16]/edges[0,18,0,18]/padding0/stretch, colors #5f614c/#23bedf입니다. 녹색·주황·노란 팩/주사위/보라 팩과 텍스트·프레임·효과는 개별 부품입니다. 제목은 native46/900/56·yellow #ffd238·stroke4.5/#168fd4, 앞 문구22·시간18·일수24입니다. 원본 폰트/게임 보상 확정값은 아닙니다.
- fullscreen은 presentation.rootMode='fullscreen' 명시 opt-in, v4 shared definition은 배후 page.logicalSize를 계승하며 기존 무필드 window 동작을 유지합니다. Main Wins open/always와 FooterClose close/always·dim/block/Escape 정책을 연결했습니다. 본체 standalone 로비→Wins/r53 저장 재읽기와 분리 표시는 확인했으며 모바일430/키보드/차단·포커스는 본체 최종 검수 중입니다.
- 재부모화한 기존 text의 BG 뒤 가림은 UI 맨 앞으로 이동으로, 기본 회색 백판은 partRole=label 명시로 보완했습니다. duplicate root는 실제 부모/rect를 다시 맞춥니다. 저장 Node 모듈의 새 stroke validator 캐시 오류는 Undo2/r47 보존→현재 허용된 자기 소유7018 재시작→r48 stroke 저장으로 확인한 사례이며, 재시작 승인/PID 소유 확인과7007 관리 금지를 유지합니다.

상세 recipe는 [공통 TOOL_SPEC .13](../../src/tools/uxStudio/guide/TOOL_SPEC.md), 출처·원본·해시는 [wins UI](../../_작업/codex/ux-studio/wins-ui-assets.json)와 [wins icons](../../_작업/codex/ux-studio/wins-icon-assets.json)를 참조합니다. 문서 담당은 [이번 fresh npm test 로그](../../_작업/codex/ux-studio/wins-screen-final-tests.log)의447/447·실패0을 직접 읽었고 시험/actual UI를 재실행하지 않았습니다. 이전/전용 시험 수는 합산하지 않습니다. 원본 폰트/픽셀/보상/장식 정확도·7007/LSB 미검수·10장 동등0/10·W/P/U/S0/4·승인 없음입니다. 판별 원문 컨펌/캡처 확인 후 고정하며 기존 프로젝트 guide.4는 자동 덮어쓰지 않습니다.


### 본체 실제 검수 기록(사용자 승인 아님) · 2026-11-16 20:21 KST
r53 실제저장재열기187부품(Main63/Build78/Wins46)·2page+1modal·4연결,기존Main/Build deep equality동일확인. actualWins클릭/Enter/Space·Close/Escape·배후차단/초점복귀·1440/430·논리390복귀·전체3판1920검수. 닫기staleinert/데모×/fixedbridge immutable캐시를최소보완하고최종451/451통과. 상세결과/실제캡처/미확인은보고20261116_1916_wins-screen.md와가이드.13최신절우선. 10장동등0/10·W/P/U/S0/4·게임보상/시간/원본폰트/7007LSB미완료. 다음03앨범새그림·메뉴연결조립.


## 앨범 실제 조립 추가 기록 · .14 · r63 기준

작성자 codex(단이) · 2026-11-16 21:09 KST · 제안(검수 대기)

문서 담당이 실제 샘플 ux-gjs-0d80d7fe r63을 읽어 Main63+Build78+Wins46+Album74=261부품, 3page+1modal·6연결을 확인했습니다. Main Album→navigate/always와 Album Back→back/always가 추가되었습니다. 기존 .13 이하 본문과 프로젝트 guide.4는 그대로 보존합니다.

원본441×731과 제작551×984는 종횡비가 다릅니다. header[0,0,551,359.41]/body551×984 고정 새 장식과 grand native9 fill/frame(source128×96,slices27/27/27/27,edges8/8/8/8,padding0), 고정room498×204, 분리 보상5그림/native15K·22일10시간·2/216을 나눕니다. source header는551×359이고192×192 body motif SVG/PNG도 보존합니다. 일반image가CSS repeat를지원한다고가정하지않습니다.

Viewport[0,359.41,551,624.59] overflow scroll-y → 투명 isGroup Content551×806 overflow visible → grid columns3/itemSize164×248/gap6/padding[25.59,24,24,23]입니다. 장식을grid직속에넣어cell을차지하게하지않습니다. 같은9카드는art154²@(5,10),caption164×64@(0,120),progress/count116×30@(24,198)을씁니다. 현재저장caption26/900/line28,count24/700/line28이며초기quicksheet22는제안이력입니다.

|full 카드|정확한 표시 이름|count|
|---|---|---|
|01|커뮤니티 갤러리|0/9|
|02|우아한 필수품|1/9|
|03|반려동물 닮은꼴|0/9|
|04|듀크의 스파 데이|0/9|
|05|우아한 이웃|1/9|
|06|직장의 야옹이|0/9|

아래07~09는 partial-art-only로native이름/count빈문자열·BGprogress생략입니다. 보이지않은부분의새그림은제안이고9개가전체앨범세트수라는뜻은아닙니다.0값fill생략.2/216·1/9극소fill은overflow clip wrapper안에128px이상blue3자식을두고왼쪽만표시합니다. source128×32/slices[0,16,0,16]/edges[0,12,0,12]/padding0/stretch를유지하고cap을비율폭에압축하지않습니다. count는별도native입니다.

Back44²@(8,8)은원본not-observed인우리복귀제안입니다. Info/보관함은표시되나동작unknown이고Vault그림자는effects.shadow x0/y2/blur3/opacity.25입니다. 새일러스트15개(세트9/보상5/보관함1)+기하UI7개=22자원의SVG/PNG정본및production/staging을보존합니다.

실제 새 투명 빈그룹은 서로 다른A→B를 superclick2개 선택→그룹→새UUID 확인→자식삭제로 만들었습니다. 단일선택 실패의 기존ID를 성공으로 해석하지 않습니다. 일반image-frame 배경panel에이미지경로를쓸때는부품역할을바탕으로먼저지정합니다. native글자는label·그림은image로분리하고현재부모/선택/입력→Tab·blur→저장재읽기를확인합니다.

60초넘는긴UIbatch의Node연결reset때DOM편집은남아있었습니다. 같은브라우저재연결/r58우선저장/짧은step재개로처리한관찰사례이며filesystem JSON조립이아닙니다. `_작업/codex/ux-studio/browser-ui-helpers.mjs`는UI클릭/AX만하는스크래치이며제품API가아닙니다. 이앨범작업은제품source수정없음입니다.

문서 담당은 fresh [album-screen-final-tests.log](../../_작업/codex/ux-studio/album-screen-final-tests.log)의451/451·실패0·cancelled0을 직접 읽었고 시험/actual UI를 재실행하지 않았습니다. 과거 실행 수를 합산하지 않습니다. 본체 전달 actual은 로비→Album→Back→Main 현금13,075/trigger 초점 복귀·재진입 scroll0, AX scroll0→181.25/client625/scrollHeight806/headerY114.765625 고정/body scroll0입니다. 재진입 초기화는 관찰값이며 원본 정책으로 확정하지 않습니다. 모바일430·1920canvas·최종 캡처·기존Main/Build/Wins deep equality는 본체 검수 대기이며 후속 본체 보고를 우선합니다.

원본 폰트/픽셀·실제 게임/보상/카운트다운·Info/Vault/세트 상세 목적지·7007/LSB·사용자 승인/freeze는 미완료/미확인입니다. 10장 최종 동등0/10·W/P/U/S0/4, 제안(검수 대기)를 유지합니다.

상세는[공통TOOL_SPEC .14](../../src/tools/uxStudio/guide/TOOL_SPEC.md),[albumUI manifest](../../_작업/codex/ux-studio/album-ui-assets.json),[album그림 manifest](../../_작업/codex/ux-studio/album-icon-assets.json)를따릅니다. 프로젝트guide.4자동덮어쓰기없음.


### 본체 최종 실제값 · 앨범 r64 · 2026-11-16 21:20 KST

위 r63/교체 중/pending은 중간 이력입니다. 최종 ux-gjs-0d80d7fe r64=Main63+Build78+Wins46+Album74=261부품·3page+1modal·6연결입니다. 실제 툴의 이미지 경로 입력+Tab으로 Set08 초록·노랑 새/Set09 노란 강아지 v002를 등록·교체·저장했습니다. 두 종을 고양이로 잘못 읽은 v001은 원본/해시를 보존하고, _작업/codex/ux-studio/album-icon-corrections.json에 교체 이유·새 원본/프롬프트/투명 PNG/WebP·SHA·관찰/추정을 기록했습니다. screenshot pixels 재사용 없이 새로 그린 그림입니다. v00115+기하UI7+교정2=24개 보관 자원 해시·미러 일치, 최종 사용 신규 자원22개입니다. 일러스트15개 사용 중2개가v002이며 기하UI7은직접작성SVG→losslessWebP입니다.

본체 actual: Main Album 클릭→새 Album→Back→Main 현금13,075/Album trigger 초점복귀, native Tab/Enter로Back·Space재진입, scroll0→181.25(client625/scrollHeight806)·headerY114.765625고정·바깥scroll0·재진입scroll0을 확인했습니다. 재진입 초기화는 우리 도구 관찰이며 원본 정책 확정이 아닙니다. 최종preview CSS1440×900·모바일CSS430×844에서 가로/세로넘침0·깨진이미지0. 캡처파일은 각각phoneclip408×729/모바일430×843입니다. 전체canvas CSS1920×1280의실제파일1919×1280,4boards X24/635/1246/1857,Y40·폭551/60간격·261부품·r64재열기를확인했습니다. 상세390×844의root와preview-screen실제389.997×843.987일치/설계기준복귀·r64hash불변,당시상세브라우저CSS2687×1792로1440상세검수라쓰지않습니다. 카드가이드W164/H248actual파일2520×1575도보존했습니다. 자동배치자식의가이드위치/크기잠금은부모grid보존규칙입니다.

Vault actual right10.019/bottom12.012 논리px·engine filter drop-shadow(0,2,3,.25)로하단고정확인. Main/Build/Wins 전체deep equality와기존4edges는r53와동일합니다. 본체 이번npm test451/451·fail0·exit0,로그 _작업/codex/ux-studio/album-screen-final-tests.log. 그뒤제품소스변경0/재실행중복합산0이며삽화교체는자원해시/실제표시로재검증했습니다.

보고 docs/collaboration/reports/20261116_2025_album-screen.md, 증거 docs/evidence/20261116-album-screen/ 및 file-verification.json을 우선합니다. current-review는r64로갱신합니다. 프로젝트guide.4/원본/이전판보존, 공통.14. 다음04친구새그림·native본문/탭/목록/행동·Main입구/Close/차단/복귀연결입니다. Info/Vault/세트상세목적지·게임수치변화/보상/시간·원본폰트/픽셀동등·7007/LSB native·사용자승인/freeze는미완료입니다. 10장최종동등0/10·W/P/U/S0/4·제안(검수대기),주간81/90·11/17 08:00KST중지선·기존ui30분만유지합니다.


## 친구 모달 실제 조립 추가 기록 · .15 · r72 기준

작성자 codex(단이) · 2026-11-16 22:09 KST · 제안(검수 대기)

문서 담당이 실제r72를읽어Main63+Build78+Wins46+Album74+Friends87=348부품·3page+2modal·8연결을확인했습니다. Main의기존Friends stable ID→open/always와기존Closeedge,fullscreen/dim/block/Escape저장정책을보존했습니다. 공통7MD의상단판표시와index를2026-11-16.15로맞췄고기존본문/프로젝트guide.4는보존했습니다.

Panel531.63×797.23@[10.76,119.53]→같은폭3탭506.88×94.98(panel local[13.99,107.79])·native label24/800/30/#282431·normal/selected3slice128×64/source0/24/0/24/edge0/16/0/16/padding0입니다. 옵션panelId는TimelineViewport/빈Add/빈Leaderboard로연결했고기본timeline입니다. Viewport505.8×584.85 scroll-y→Content505.8×636→Request485.35×209.18 + Activities485.35×420/verticalitem485.35×84/gap0/padding0/5행입니다. Footer551×67.24는bottom고정형제,Close44²의별도native×42label입니다. 이름/본문/시간/금액/CTA/한도·만료/개별그림/스티커별/Badge28(dot1,keyfriends.timelineCount)/그림자/입력을분리했습니다. r72Panelshadow0/3/6/.25·두CTA0/2/3/.25저장값을직접읽었습니다. 탭/Close가reparent뒤BG에가려진실제사례는맨앞으로옮겨보완한본체관찰입니다.

새그림2+기하15=17개manifest assetRef가r72에모두있고Cashv003/Bankv002/공통Badge는재사용했습니다. 원본관찰은요청/활동5완전행+6행Jaime/2시간전일부이며6행본문/원본초상/다른탭본문/Send·Reject게임API는미확인입니다. Source05배경은새그림1회생성준비·미등록으로05완료가아닙니다.

탭엔진은선택적options[].panelId/native3tabSkin,부모font/color,hidden/inert/ARIA·숨은본문API입력차단,정식assets등록/복사검증,escape/stale guard·기존무필드탭호환을유지합니다. 문서담당은[source diff](../../_작업/codex/ux-studio/tab-engine-source.diff)와RED/GREEN·462/462·후속escape7/7·최종[friends-screen-final-tests.log](../../_작업/codex/ux-studio/friends-screen-final-tests.log)의463/463·실패0을읽었고재실행하지않았습니다. 시험수는합산하지않습니다. **본체430/1440/1920·키보드/scroll/dim/Close/배후차단/포커스복귀최종실검수는진행중**이며이절의저장/소스확인을actual통과로적지않습니다.

역할별재현값은[TOOL_SPEC .15](../../src/tools/uxStudio/guide/TOOL_SPEC.md#친구-모달-실제-조립-추가-기록--15--r72-기준),조작은[USER_GUIDE .15](../../src/tools/uxStudio/guide/USER_GUIDE.md#친구-모달-실제-조립-추가-기록--15--r72-기준),엔진은[ARCHITECTURE .15](../../src/tools/uxStudio/guide/ARCHITECTURE.md#친구-모달-실제-조립-추가-기록--15--r72-기준),검수경계는[PROGRESS .15](../../src/tools/uxStudio/guide/PROGRESS.md#친구-모달-실제-조립-추가-기록--15--r72-기준),최종actual은[본체보고](../collaboration/reports/20261116_2125_friends-screen.md)의후속append를우선합니다.

이번하위수정은공통7MD/index와이계획끝append만입니다. 백업:`docs/planning/_backup/20261116_단이/2205_friends_guide/`. rootAGENTS/STATUS/report/currentreview/source/샘플JSON/assets/프로젝트guide.4수정없음. W/P/U/S0/4·10장최종동등0/10·원본폰트동등/실제게임/7007LSB native/사용자승인미완료·제안(검수대기),주간83/90·11/17 08:00KST·기존30분만유지합니다.


## 메인05 조립 기록 · .16 · r76 중간 기준

작성자 codex(단이) · 2026-11-16 23:06 KST · 제안(검수 대기)

문서 담당은 저장본 `ux-gjs-0d80d7fe` r76을 직접 읽었습니다. Main71+Build78+Wins46+Album74+Friends87=356부품, 3page+2modal·8연결이며 Main 조립 중의 스냅샷입니다. SHA는 `123486eb140ffe898e5cb3ef3a78fe8065e292e8bfc0777d1c4f8c025ef4d06c`입니다. 본체 후속 저장·최종 append가 이 중간값을 보정합니다. 기존 본문·이전판·프로젝트 guide .4는 보존합니다.

공통 .16은 Main05의 준비/저장/실검수 경계를 추가합니다. source05의36,750,000·2602/90·HOLD FOR AUTO·해적방패4와 cash214/icon45/text156을 직접 대조했습니다. 기존 Main/GO wordmark/하단4입구 stable ID를 유지하며 native GO 목표는 kind=text/partRole=label·image제거입니다. r76은 아직image/image이고 개별 전환이 엄격조건으로 롤백되어 본체 보완·재검수 대기입니다.

부품은 그룹·그림·native글자/외곽선·9/3프레임·효과그림자·입력으로 나눕니다. 새 텍스처는 정식등록완료→source크기확인→TRBL분할/edge/padding0→저장재읽기 순서로 입력합니다. 구source128×64에서 미리 입력해 r76banner분할이64/64/12/12로 제한된 사례를 본체가 확인했습니다. 새256×160 확인 뒤64all 재입력·저장 보정 대기이며 제품 버그로 단정하지 않습니다.

Shop은 r76 buttonState.enabled/tint/targetGraphic자식지정이 저장됐고 shadow/입력actual은 별도 대기입니다. CAKE/WALK native 일부 저장과 상단진행/보상/시간·좌우다수/x50/06~10목적지·실검수 미완료를 구분합니다.09/10은 source05와 다른eventversion의 시연 매핑 제안입니다.

최종 정규화 제작값은 원본bbox 측정과 구분합니다. 좌6은 input100×104, art88×78@(6,0), timer96×22@(2,80), dot18²@(80,0), root x10/y100·205·310·415·520·625입니다. 우원형4는 input84×108, art80²@(2,0), timer84×30@(0,76), dot18²@(66,0), root x449/y234·344·454·574입니다. 초기 우높이104 제안은 timer의끝106보다 작아108로 보정했습니다. 모든 자식은 부모 가이드 영역 안에 두고 그림은contain으로 원비율을 유지합니다. Tycoon은 별도 featured106×137이며 같은 역할끼리 부모/자식 규격을 통일합니다.

신규 준비는 그림12+기하UI11+배경1=24개입니다. 세 manifest의 production/staging SHA를 이번에24/24 직접 대조했습니다. r76의 고유 assetRef 참조는 그림2(Shop·pirate-shield)+기하UI2(banner fill9/frame9)+배경1=5/24이며, 방패4개는 같은 자원1개를 재사용합니다. 이는 저장 설계 참조 수이며 이번 담당의 실제 등록 UI·HTTP·최종 화면 검수는 아닙니다. Manifest의 제작 시점 uiApplied=false/registration=null만으로 현재 미등록이라고 판단하지 않습니다. 최종 등록·사용 개수는 본체 후속 실제값을 따릅니다.

앞 단위 본체 소스 검증470/470은 과거 실행입니다. Main05 이번 시험 재실행·390/430/1440/전체캔버스·키보드·그림자·저장 재열기 최종 실검수는 미완료이며 이 문서 담당은 실행하지 않았습니다. 상단 진행/보상/시간과 좌우 다수 입구, x50 및06~10 목적지도 조립/연결 대기입니다. 원본 폰트·픽셀 동등·실3D·실제 GO/자동굴림/배수/차감/보상/카운트다운·7007/LSB native·사용자 승인/freeze는 미완료/미확인입니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**를 유지합니다. 주간85/90·11/17 08:00 KST 중지선·기존 ui30분은 본체 전달 상태이며 새 예약·재개·서버 작업은 하지 않습니다.

제작법은 [TOOL_SPEC .16](../../src/tools/uxStudio/guide/TOOL_SPEC.md#메인05-조립-기록--16--r76-중간-기준)·[USER_GUIDE .16](../../src/tools/uxStudio/guide/USER_GUIDE.md#메인05-조립-기록--16--r76-중간-기준)·[AI_GUIDE .16](../../src/tools/uxStudio/guide/AI_GUIDE.md#메인05-조립-기록--16--r76-중간-기준)·[ARCHITECTURE .16](../../src/tools/uxStudio/guide/ARCHITECTURE.md#메인05-조립-기록--16--r76-중간-기준)·[PROGRESS .16](../../src/tools/uxStudio/guide/PROGRESS.md#메인05-조립-기록--16--r76-중간-기준)를 따릅니다. [측정표](../../_작업/codex/ux-studio/main05-assembly-quick-sheet.md)·[그림](../../_작업/codex/ux-studio/main-events-assets.json)·[기하UI](../../_작업/codex/ux-studio/main-ui-assets.json)·[배경](../../_작업/codex/ux-studio/main-candy-board-assets.json)과 r76저장 assetRef를 대조했습니다.

문서 하위 백업:`docs/planning/_backup/20261116_단이/2300_main05_guide/`. 허용된 공통7MD/index와 계획 끝 append만 수정했습니다. 본체가 최종값을 추가하며 이 하위는 제품source/UI/설계JSON/자원/프로젝트guide.4/공용STATUS/report/current-review/rootAGENTS를 변경하지 않았습니다.


## Main05 최종 실제 보정 · .16 · r92

작성자 codex(단이) · 2026-11-17 00:16 KST · 제안(검수 대기)

**공통 .16의 최신 실제 사실은 이 최종 절을 우선합니다.** 앞선 r76/준비24개/GO전환 실패·조립 대기 기록은 당시 이력으로 보존합니다. 현재 저장본은 `ux-gjs-0d80d7fe` **r92·Main175/총460부품·3page+2modal·기존8연결**이며 SHA는 `c27d09e500d63ad2a6caf93b0a6f681cc681c137095c3d209a953bb336b9743e`입니다. r92의 설명도 실제2D/목적지·게임 미완료 경계를 반영했습니다.

최종Main05는기존Main63ID·8edges와다른4화면r72deepEqual을보존하면서27새자원을실제등록/참조했습니다. source05값36,750,000·2602/90·HOLD FOR AUTO·4해적방패와nativeGO기존ID text/label·image없음을저장확인했습니다. atomic전환·Undo/Redo actual과최종477/477(fail0/cancel0/exit0)을구분해기록합니다.

새source등록→실제source크기대기→slice입력으로Banner256×160/64all/edge24/pad0을확정했습니다. 좌6 input100×104/art88×78,우4 input84×108/disc80,Tycoon106×137,x50Bottom자식74²입니다. r91의새이벤트12부모native상단왼/오anchor보완뒤390Shop70.7804×73.6045/430Shop78.0399×81.1537로같은100:104비율을확인했습니다.20효과enabled와mini12개18²dot/12px·하단4개28²는저장/역할값이며20전부nativepressed나mini99+검수완료가아닙니다.

하단4메뉴open/navigate/close/back·Enter/Space/Escape/focus복귀와현금보존을본체가실제확인했습니다.Album초기incomplete6은후속loading0/failed0으로transient해소했습니다.Preview CSS1440×900/430×843/1920×1280의overflow0/failed0과파일1800×1125/537×1055/2400×1600을구분합니다. nativeclip은선택탭DOM CSS×DPR정수좌표를사용했고정상r90clip551×985보존/잘못CSSclip689×1230은diagnostic입니다.r90canvas1920/5화면460/저장enabled와최종r92후속본체기록을구분합니다.GO0/3/5/.3·Shop0/2/3/.25는engine shadow actual입니다.

목적지06~10·원본폰트/픽셀동등·실3D·GO굴림/자동모드/배수/시간·보상/구매 등 게임 로직·7007/LSB native·사용자 승인/freeze는 미완료입니다. 원본05의 작은 hammer 아바타 중첩도 미재현입니다. 06/07 측정·자원 준비는 UI 미등록이며 화면 완성으로 세지 않습니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**, 주간86/90·**2026-11-17 08:00 KST 최종 중지선**을 유지합니다. 기존 ui30분 외 새 예약·재개·서버/빌드는 하지 않습니다. 프로젝트 guide .4와 이전판·원본을 보존합니다.

상세 최종절: [제작값](../../src/tools/uxStudio/guide/TOOL_SPEC.md#main05-최종-실제-보정--16--r92) · [사용법](../../src/tools/uxStudio/guide/USER_GUIDE.md#main05-최종-실제-보정--16--r92) · [AI규칙](../../src/tools/uxStudio/guide/AI_GUIDE.md#main05-최종-실제-보정--16--r92) · [구조](../../src/tools/uxStudio/guide/ARCHITECTURE.md#main05-최종-실제-보정--16--r92) · [진척](../../src/tools/uxStudio/guide/PROGRESS.md#main05-최종-실제-보정--16--r92). 직접읽은근거는 [r92파일검증](../evidence/20261116-main05/file-verification.json) · [브라우저기록](../evidence/20261116-main05/browser-checks.json) · [최종시험로그](../../_작업/codex/ux-studio/main05-final-tests.log)입니다.문서담당재실행없음,기존본문/프로젝트guide.4/index.16보존. 백업:`docs/planning/_backup/20261117_단이/0016_main05_guide_final/`.
