# 영상 B 원본 조사 — 클래시 로얄

작성: codex(단이) · 2026-11-18T16:10:40+09:00 · 제안(검수 대기)

사용자 요청명은 ‘클래시오브 클랜’이나, 제공 영상의 실제 UI와 ‘클래시 로얄 초보자 팩’ 문구는 **클래시 로얄**입니다. 이 문서는 제공된 32.7119초 영상의 관찰 목록입니다. 전체 게임 UI 전수조사나 툴 제작 완료를 뜻하지 않습니다.

- 원본: `/Users/max/Desktop/Screen_Recording_20261118_154455_Clash Royale.mp4`
- 원본: 1080×2340px · 약59.825325fps · 32.7119초 · 58896861bytes
- SHA256: `7a0644c065134d7cd5e298fdb227648c71a3be035a4d4facc3855444d17cb4af`
- 추출: coarse 5초 간격 7개 → 1초 간격 33개 → 전환 주변 지정시각 62개(중복 시각 포함 추출 entry 102개).
- 타임스탬프: 영상 시작 상대초이며 각 index.json에 요청/실제 디코더 시각을 모두 보존했습니다. 경계는 샘플링 구간입니다.
- 화면 전후 변화는 관찰, 버튼/탭/스와이프/닫기 입력은 터치 로그가 없어 추정입니다.
- 좌표는 원본 1080×2340 픽셀 근사치이며 논리 크기·실제 엔진 저장값이 아닙니다.
- 모든 JPG는 원본 비교용입니다. production 그림/자원 또는 편집 가능한 UI 제작을 대신하지 않습니다.

## 판틀 선별

| ID | 전체 판틀 / 컨테이너 | 대표 요청초 → 실제초 | 구분 |
|---|---|---|---|
| B-F01 | 전투 홈 / 아레나 로비 | 0 → 0.000000 | fullFrame |
| B-F02 | 전투 덱 바텀시트 | 3.1 → 3.088211 | fullFrameContainerVariant |
| B-F03 | 게임 모드 선택 바텀시트 | 7 → 6.992644 | fullFrame |
| B-F04 | 소셜 / 클랜 없음 | 12 → 11.998133 | fullFrame |
| B-F05 | 카드 화면 / 덱 탭 | 17 → 16.986656 | fullFrameContainerVariant |
| B-F06 | 컬렉션 / 카드 목록 | 20 → 19.991200 | fullFrame |
| B-F07 | 상점 / 긴 세로 섹션 | 23.8 → 23.794289 | fullFrame |

총 7개 전체 판틀 관찰과 왕 튜토리얼 오버레이 1계열·공사중 토스트 1개입니다. 다른 영상과의 중복 통합은 본체가 수행합니다. 덱시트와 정식 덱 페이지는 같은 4×2카드+타워 본문을 공유하지만 배후딤·닫기손잡이 대 탭·하단 내비게이션의 전체 컨테이너는 다릅니다. 게임모드와 덱시트는 바텀시트 shell을 공유하지만 본문 판틀은 다릅니다.

튜토리얼 문구 2개,발견/미발견 카드의 반복행,상점의 섹션 스크롤·동일 상품틀,로딩/반짝임,가로이동 중간 화면은 새로운 전체 판틀로 세지 않습니다.

## 전체판틀별 원본·계층·동작

### B-F01 · 전투 홈 / 아레나 로비

![전투 홈 / 아레나 로비](coarse/frame_00000.jpg)

- 원본 프레임: `coarse/frame_00000.jpg`, 요청 0초 / 실제 0.000000초.
- 계층(관찰 기반 재조립 제안):
  - Group_ResourceHUD [fixedOverlay] / source px≈[0, 102, 1080, 86]
    - Group_ProgressXP [display] / source px≈[0, 102, 407, 86]
      - Img_XPCards [image]
      - Img_ProgressBar [image]
      - Txt_XP [text] / 18
    - Btn_GoldPlus [buttonCandidate] / source px≈[427, 110, 340, 74]
      - Img_Gold [image]
      - Txt_Gold [text] / 113
      - Glyph_Plus [text]
    - Btn_GemPlus [buttonCandidate] / source px≈[785, 110, 274, 74]
      - Img_Gem [image]
      - Txt_Gem [text] / 100
      - Glyph_Plus [text]
  - Group_Profile [display] / source px≈[0, 185, 620, 390]
    - Img_ThreeCrowns [image]
    - Txt_PlayerName [text] / 나나나와
    - Txt_Clan [text] / 클랜 없음
    - Group_Trophies [display] / 0
  - Group_UtilityButtons [buttonRow] / source px≈[638, 235, 405, 122]
    - Btn_People [buttonCandidate]
    - Btn_News [buttonCandidate]
    - Btn_Menu [buttonCandidate]
  - Btn_RoyalPass [buttonCandidate] / source px≈[650, 375, 410, 196]
    - Txt_RoyalPass [text] / 로얄 패스
    - Img_Lock [image]
  - Btn_MiniPass [buttonCandidate] / source px≈[890, 636, 177, 220] / 3일 1시간
  - Group_ArenaDiorama [display] / source px≈[260, 975, 560, 530]
    - Img_Arena [image]
    - Group_TrophyProgress [display]
  - Btn_EventsChests [buttonCandidate] / source px≈[315, 1585, 460, 210] / 이벤트 / 1
  - Group_BattleActions [buttonRow] / source px≈[122, 1812, 868, 242]
    - Btn_DeckQuickview [buttonCandidate]
    - Btn_Battle [buttonCandidate] / 전투
    - Btn_ModeTrophy [buttonCandidate]
  - Group_BottomNavigation [navigation] / source px≈[0, 2155, 1080, 185]
    - Btn_Shop [tabCandidate]
    - Btn_CardsCollection [tabCandidate]
      - Badge_Notifications [display] / 6
    - Btn_Battle [tabCandidate]
    - Btn_Social [tabCandidate]
    - Btn_SwordWreath [tabCandidate]

- 실제 관찰: 영상 시작에 이미 홈이 표시됨 / 덱시트와 게임모드시트가 열린 뒤 다시 이 화면으로 복귀함 / 소셜 후 홈을 거쳐 카드 페이지로 가로 이동함
- 입력 추정: 하단 전투 버튼 왼쪽 카드 버튼이 덱시트 입구로 보임 / 전투 버튼 오른쪽 트로피 영역이 게임모드 입구로 보임 / 소셜 진입은 하단 사람 방패 탭이 유력하나 터치 좌표/탭과 스와이프 차이는 미관찰
- 미확인: 전투 실행/매칭/전투 화면 / 상단 유틸리티·패스·이벤트 목적지 / 현금/보석 추가 버튼 동작
- 보이는 문구: 18 · 113 · 100 · 나나나와 · 클랜 없음 · 0 · 로얄 패스 · 3일 1시간 · 이벤트 · 전투

### B-F02 · 전투 덱 바텀시트

![전투 덱 바텀시트](detail/frame_00003.jpg)

- 원본 프레임: `detail/frame_00003.jpg`, 요청 3.1초 / 실제 3.088211초.
- 계층(관찰 기반 재조립 제안):
  - Img_BackdropDim [overlay] / source px≈[0, 0, 1080, 2340]
  - Panel_DeckBottomSheet [bottomSheet] / source px≈[0, 340, 1080, 2000]
    - Btn_CollapseChevron [buttonCandidate] / source px≈[430, 365, 218, 87]
    - Header_Deck [display] / source px≈[0, 475, 1080, 150] / 전투 덱
    - Group_BattleDeckBody [sharedContent] / source px≈[0, 700, 1080, 1470]
      - Grid_DeckCards [grid]
        - Card_Unit [repeatableComponent]
          - Img_Frame [image]
          - Img_Artwork [image]
          - Badge_Elixir [display]
          - Txt_Level [text]
          - Group_UpgradeProgress [display]
            - Img_Arrow [image]
            - Img_Fill [image]
            - Txt_OwnedRequired [text]
          - Badge_New [display]
      - Group_AverageElixir [display]
        - Img_Elixir [image]
        - Txt_Average [text] / 3.6
      - Img_Divider [image]
      - Group_Towers [display]
        - Img_KingPrincessTowers [image]
        - Group_KingProgress [display] / 1 / 8/9
        - Btn_TowerAppearance [buttonCandidate]
        - Card_TowerTroop [card] / 레벨 1 / 1/2

- 실제 관찰: 2.3~2.7초에 아래에서 올라옴 / 배후 홈은 어두워진 채 유지되고 하단 탭은 시트에 덮임 / 5.3초에는 시트가 사라지고 배후딤이 잠시 남음,5.5초 홈 표시
- 입력 추정: 닫기는 상단 아래방향 chevron이 유력, 실제 touchup 좌표·배경터치 여부는 미관찰
- 미확인: 카드 상세/교체/업그레이드 / 타워 꾸미기 버튼 목적지 / 시트 내부 수동 스크롤
- 보이는 문구: 전투 덱 · 레벨 2 · 레벨 1 · 레벨 3 · 0/4 · 6/2 · 1/2 · 2/2 · NEW · 3.6 · 8/9

### B-F03 · 게임 모드 선택 바텀시트

![게임 모드 선택 바텀시트](detail/frame_00010.jpg)

- 원본 프레임: `detail/frame_00010.jpg`, 요청 7초 / 실제 6.992644초.
- 계층(관찰 기반 재조립 제안):
  - Img_BackdropDim [overlay] / source px≈[0, 0, 1080, 2340]
  - Panel_ModeBottomSheet [bottomSheet] / source px≈[0, 320, 1080, 2020]
    - Btn_CollapseChevron [buttonCandidate] / source px≈[430, 348, 218, 88]
    - Header_Mode [display] / source px≈[0, 460, 1080, 152] / 게임 모드
    - List_ModeCards [list] / source px≈[22, 681, 1034, 1640]
      - Btn_TrophyRoad [splitCard] / 트로피 진척도 / 0
      - Btn_MergeTactics [splitCard] / 합체 전술 / 0 / 남은 시간: 12일 2시간
      - Txt_CompetitiveHeading [text] / 경쟁 모드
      - Btn_CompetitiveLocked [splitCard] / 경쟁전 / 13000 트로피에서 잠금 해제
      - Txt_ClassicHeading [text] / 클래식 모드
      - Btn_Classic1v1 [splitCard] / 클래식 1v1

- 실제 관찰: 6.5초 진입 이동 중,6.7~7.5초 목록 관찰 / 7.7초 아래로 내려가고8초 딤만 남은 뒤8.2초 홈 복귀
- 입력 추정: 홈 오른쪽 트로피 버튼이 입구,상단 chevron이 닫기 후보
- 미확인: 모드 선택 결과 / 잠김 버튼의 실제 입력반응 / 세로 스크롤/아래 추가 모드
- 보이는 문구: 게임 모드 · 트로피 진척도 · 합체 전술 · 남은 시간: 12일 2시간 · 경쟁 모드 · 경쟁전 · 13000 트로피에서 잠금 해제 · 클래식 모드 · 클래식 1v1

### B-F04 · 소셜 / 클랜 없음

![소셜 / 클랜 없음](seconds/frame_00012.jpg)

- 원본 프레임: `seconds/frame_00012.jpg`, 요청 12초 / 실제 11.998133초.
- 계층(관찰 기반 재조립 제안):
  - Img_BlurredArenaBackdrop [image] / source px≈[0, 0, 1080, 2155]
  - Panel_ClanPrompt [panel] / source px≈[58, 285, 978, 334]
    - Img_ClanSymbol [image]
    - Txt_ClanPrompt [text] / 클랜을 생성하거나 가입하세요!
    - Txt_ClanHint [text] / 클랜을 검색하거나 생성하세요!
    - Btn_ViewClan [buttonCandidate] / 보기
  - Panel_Social [panel] / source px≈[58, 666, 978, 1435]
    - Header_Social [display] / 소셜
    - Btn_Sort [buttonCandidate]
    - Btn_Filter [buttonCandidate]
    - Viewport_SocialList [list] / source px≈[70, 785, 955, 1140]
      - Txt_Online [text] / 온라인
      - Txt_Ranking [text] / 순위표
      - Row_Self [row] / source px≈[100, 983, 888, 150]
        - Img_Avatar [image]
        - Img_OnlineDot [image]
        - Txt_PlayerName [text] / 나나나와
        - Txt_Trophies [text] / 0
    - Group_SocialActions [buttonRow] / source px≈[80, 1960, 930, 112]
      - Btn_QuickPlay [buttonCandidate] / 퀵플레이
      - Btn_AddFriend [buttonCandidate] / 친구 추가!
      - Btn_Camera [buttonCandidate]
  - Group_BottomNavigation [navigation] / source px≈[0, 2155, 1080, 185]
    - Btn_Shop [tabCandidate]
    - Btn_CardsCollection [tabCandidate]
      - Badge_Notifications [display] / 6
    - Btn_Battle [tabCandidate]
    - Btn_Social [tabCandidate]
    - Btn_SwordWreath [tabCandidate]

- 실제 관찰: 9.5초 소셜 바탕으로 변경,곧 튜토리얼 캐릭터/딤 표시 / 11.7~12초 튜토리얼 제거 후 본문 표시 / 14.2초 안내문이 목록 위에 나타나고15초 가로전환 때도 잠시 유지됨
- 입력 추정: 하단 소셜탭 또는 가로스와이프로 진입 / 오른쪽 검/월계관 탭 입력 뒤 공사중 안내가 나왔을 가능성 있으나 실제 입력 위치 미관찰
- 미확인: 보기/퀵플레이/친구추가/카메라/정렬/필터 결과 / 친구목록 실제 스크롤 / 클랜 가입/생성/초대
- 보이는 문구: 클랜을 생성하거나 가입하세요! · 클랜을 검색하거나 생성하세요! · 보기 · 소셜 · 온라인 · 순위표 · 나나나와 · 0 · 퀵플레이 · 친구 추가!

### B-F05 · 카드 화면 / 덱 탭

![카드 화면 / 덱 탭](seconds/frame_00017.jpg)

- 원본 프레임: `seconds/frame_00017.jpg`, 요청 17초 / 실제 16.986656초.
- 계층(관찰 기반 재조립 제안):
  - Group_ResourceHUD [fixedOverlay] / source px≈[0, 102, 1080, 86]
    - Group_ProgressXP [display] / source px≈[0, 102, 407, 86]
      - Img_XPCards [image]
      - Img_ProgressBar [image]
      - Txt_XP [text] / 18
    - Btn_GoldPlus [buttonCandidate] / source px≈[427, 110, 340, 74]
      - Img_Gold [image]
      - Txt_Gold [text] / 113
      - Glyph_Plus [text]
    - Btn_GemPlus [buttonCandidate] / source px≈[785, 110, 274, 74]
      - Img_Gem [image]
      - Txt_Gem [text] / 100
      - Glyph_Plus [text]
  - Tabs_DeckCollection [tabs] / source px≈[100, 235, 880, 118]
    - Tab_Deck [tab] / 덱
    - Tab_Collection [tab] / 컬렉션 / 6
  - Header_Deck [display] / source px≈[0, 350, 1080, 175] / 전투 덱
  - Group_BattleDeckBody [sharedContent] / source px≈[0, 700, 1080, 1470]
    - Grid_DeckCards [grid]
      - Card_Unit [repeatableComponent]
        - Img_Frame [image]
        - Img_Artwork [image]
        - Badge_Elixir [display]
        - Txt_Level [text]
        - Group_UpgradeProgress [display]
          - Img_Arrow [image]
          - Img_Fill [image]
          - Txt_OwnedRequired [text]
        - Badge_New [display]
    - Group_AverageElixir [display]
      - Img_Elixir [image]
      - Txt_Average [text] / 3.6
    - Img_Divider [image]
    - Group_Towers [display]
      - Img_KingPrincessTowers [image]
      - Group_KingProgress [display] / 1 / 8/9
      - Btn_TowerAppearance [buttonCandidate]
      - Card_TowerTroop [card] / 레벨 1 / 1/2
  - Group_BottomNavigation [navigation] / source px≈[0, 2155, 1080, 185]
    - Btn_Shop [tabCandidate]
    - Btn_CardsCollection [tabCandidate]
      - Badge_Notifications [display] / 6
    - Btn_Battle [tabCandidate]
    - Btn_Social [tabCandidate]
    - Btn_SwordWreath [tabCandidate]

- 실제 관찰: 16초 홈과 카드 페이지의 가로 이동 중,16.2초 덱 페이지 표시 / 19.6초까지 덱 탭 유지 / 19.8초 컬렉션 탭으로 변경
- 입력 추정: 하단 카드/컬렉션탭 또는 좌우 스와이프 진입 / 상단 컬렉션 라벨이 다음 목록 입구
- 미확인: 카드 선택 결과 / 편집 버튼 결과 / 상단 덱탭으로 역복귀 / 덱 본문 실제 스크롤
- 보이는 문구: 덱 · 컬렉션 · 6 · 전투 덱 · 3.6 · 레벨 2 · 레벨 1 · 레벨 3 · 0/4 · 6/2 · 1/2 · 2/2 · NEW · 8/9

### B-F06 · 컬렉션 / 카드 목록

![컬렉션 / 카드 목록](coarse/frame_00004.jpg)

- 원본 프레임: `coarse/frame_00004.jpg`, 요청 20초 / 실제 19.991200초.
- 계층(관찰 기반 재조립 제안):
  - Group_ResourceHUD [fixedOverlay] / source px≈[0, 102, 1080, 86]
    - Group_ProgressXP [display] / source px≈[0, 102, 407, 86]
      - Img_XPCards [image]
      - Img_ProgressBar [image]
      - Txt_XP [text] / 18
    - Btn_GoldPlus [buttonCandidate] / source px≈[427, 110, 340, 74]
      - Img_Gold [image]
      - Txt_Gold [text] / 113
      - Glyph_Plus [text]
    - Btn_GemPlus [buttonCandidate] / source px≈[785, 110, 274, 74]
      - Img_Gem [image]
      - Txt_Gem [text] / 100
      - Glyph_Plus [text]
  - Viewport_CollectionScroll [verticalScroll] / source px≈[0, 0, 1080, 2155]
    - Tabs_DeckCollection [tabs] / source px≈[100, 235, 880, 118] / 덱 / 컬렉션
    - Group_CollectionCategories [iconTabRow] / source px≈[0, 350, 1080, 200]
      - Tab_Cards [tabCandidate] / 2
      - Tab_Tokens [tabCandidate]
      - Tab_Emotes [tabCandidate] / 4
      - Tab_Towers [tabCandidate]
      - Tab_Badge [tabCandidate]
    - Group_CollectionControls [row] / source px≈[26, 632, 1028, 132]
      - Txt_CollectionTitle [text] / 카드 컬렉션
      - Txt_Found [text] / 찾음: 8/123
      - Btn_Filter [buttonCandidate]
      - Btn_Ascending [buttonCandidate]
      - Btn_SortCriterion [buttonCandidate] / 레벨 기준
    - Txt_Discovered [text] / 발견함
    - Grid_Discovered [grid]
      - Card_Unit [repeatableComponent]
        - Img_Frame [image]
        - Img_Artwork [image]
        - Badge_Elixir [display]
        - Txt_Level [text]
        - Group_UpgradeProgress [display]
          - Img_Arrow [image]
          - Img_Fill [image]
          - Txt_OwnedRequired [text]
        - Badge_New [display]
    - Txt_Undiscovered [text] / 미발견
    - Grid_Undiscovered [grid]
      - Card_LockedUnit [repeatableComponent]
        - Img_GrayscaleArtwork [image]
        - Txt_ArenaUnlock [text]
  - Group_BottomNavigation [navigation] / source px≈[0, 2155, 1080, 185]
    - Btn_Shop [tabCandidate]
    - Btn_CardsCollection [tabCandidate]
      - Badge_Notifications [display] / 6
    - Btn_Battle [tabCandidate]
    - Btn_Social [tabCandidate]
    - Btn_SwordWreath [tabCandidate]

- 실제 관찰: 20초 8개 발견 카드와 미발견 시작 표시 / 20.8~22.8초 상단 덱/컬렉션·아이콘분류·정렬행도 위로 사라지고 4열 미발견 목록이 계속 이동,HUD와 하단 nav 위치는 유지 / 후반 행은 아레나/잠금 문구가 다르지만 같은 4열 그리드 반복
- 입력 추정: 목록의 상향 이동은 위로 스와이프한 세로 스크롤로 추정,손가락 경로/scrollTop 값은 없음
- 미확인: 필터/정렬/다른 카테고리 본문 / 미발견 카드 상세 / 전체 카드 목록 수동 전수 확인 / 원본 scroll metric/Unity mask/anchor
- 보이는 문구: 덱 · 컬렉션 · 카드 컬렉션 · 찾음: 8/123 · 레벨 기준 · 발견함 · 미발견

### B-F07 · 상점 / 긴 세로 섹션

![상점 / 긴 세로 섹션](detail/frame_00059.jpg)

- 원본 프레임: `detail/frame_00059.jpg`, 요청 23.8초 / 실제 23.794289초.
- 계층(관찰 기반 재조립 제안):
  - Group_ResourceHUD [fixedOverlay] / source px≈[0, 102, 1080, 86]
    - Group_ProgressXP [display] / source px≈[0, 102, 407, 86]
      - Img_XPCards [image]
      - Img_ProgressBar [image]
      - Txt_XP [text] / 18
    - Btn_GoldPlus [buttonCandidate] / source px≈[427, 110, 340, 74]
      - Img_Gold [image]
      - Txt_Gold [text] / 113
      - Glyph_Plus [text]
    - Btn_GemPlus [buttonCandidate] / source px≈[785, 110, 274, 74]
      - Img_Gem [image]
      - Txt_Gem [text] / 100
      - Glyph_Plus [text]
  - Viewport_Shop [verticalScroll] / source px≈[0, 0, 1080, 2155]
    - Section_SpecialOffers [section]
      - Header_SpecialOffers [ribbon] / 특별 상품
      - Offer_StarterPack [wideOffer] / 클래시 로얄 초보자 팩 / 2일 23시간 / 10000 / 500 / x20 / ₩1,500
      - Offer_UpgradeSpecial [wideOffer] / 업그레이드 스페셜 / 19일 2시간 / 250000 / 20/20 이용 가능 / ₩7,500
      - Offer_MiniPass [wideOffer] / 미니 패스 / 3일 1시간 / ₩4,400
      - Offer_EmoteMarket [wideOffer]
    - Section_Market [section]
      - Header_Market [woodSign] / 마켓
      - Group_DailyOffers [threeColumnGrid] / 일일 상품 / 8시간 15분
      - Product_FreeChest [productCard] / 골드 상자 / 아레나1 / 무료!
      - Product_Knight [productCard] / 기사 / 일반 / x2 / 0/4 / 20
      - Product_Musketeer [productCard] / 머스킷병 / 희귀 / x1 / 1/2 / 50
    - Section_Cosmetics [section]
      - Header_Cosmetics [scrollSign] / 꾸미기 아이템
      - Group_EmoteProducts [threeColumnGrid] / 이모티콘 / 특별한 이모티콘으로 자신을 표현하세요! / 각250보석
    - Section_Resources [section]
      - Header_Resources [ribbon] / 자원
      - Grid_Gems [threeColumnGrid] / 보석
      - Grid_Gold [threeColumnGrid] / 골드
      - Panel_CreatorBoost [panel] / 크리에이터 부스트 / 크리에이터 코드를 입력해 슈퍼셀 크리에이터를 후원하세요!
  - Group_BottomNavigation [navigation] / source px≈[0, 2155, 1080, 185]
    - Btn_Shop [tabCandidate]
    - Btn_CardsCollection [tabCandidate]
      - Badge_Notifications [display] / 6
    - Btn_Battle [tabCandidate]
    - Btn_Social [tabCandidate]
    - Btn_SwordWreath [tabCandidate]

- 실제 관찰: 23초 상점 진입 직후 StarterPack 카드가 흰 flash/로딩 연출로 보이고23.4초 정상 그림 / 23.8~24초 특별상품 정상 표시 / 25초 일일상품,26~27초 자원과 하단 크리에이터 구간,28초 위쪽 이모티콘,29초 일일상품,30초 미니패스,31~32.6초 초보자 팩으로 역스크롤 / 스크롤 중 HUD/하단 nav는 고정이며 본문·섹션 배경이 함께 이동
- 입력 추정: 하단 상점탭 또는 좌우 스와이프로 전환 / 본문 이동 방향으로 세로 스크롤 추정
- 미확인: 상품/무료상자/정보 버튼 클릭 / 결제/보상/차감 / 미니패스 상세/이모티콘마켓 전체/크리에이터 입력·확인 / 정확한 scrollTop/총본문높이/scrollbar 계약
- 보이는 문구: 특별 상품 · 클래시 로얄 초보자 팩 · 업그레이드 스페셜 · 미니 패스 · 이모티콘 마켓 · 마켓 · 일일 상품 · 새 카드 등장까지 남은 시간: 8시간 15분 · 골드 상자 · 아레나1 · 무료! · 기사 · 일반 · 머스킷병 · 희귀 · 꾸미기 아이템 · 이모티콘 · 특별한 이모티콘으로 자신을 표현하세요! · 자원 · 보석 · 골드 · 크리에이터 부스트

## 튜토리얼·토스트

왕 튜토리얼은 소셜 배후딤·하단 왕 캐릭터·오른쪽 흰 말풍선·native 텍스트로 분리하는 제안입니다. 문구 변경은 같은 오버레이의 상태입니다.

- 10초: “이제 친구와 클랜을 소셜 탭에서 확인할 수 있습니다!”
- 11.2초: “퀵플레이는 새롭게 승리를 거둘 수 있는 방법입니다! 친구들과 한번 플레이해 보세요!”
- 11.7초 퇴장 중,12초 소셜 본문만 표시. 화면탭/자동 타이머/입력차단은 미확인.

공사중 토스트(14.2초): “이 아레나는 현재 공사 중입니다! 이벤트 모드는 전투 화면으로 이동하였습니다.” 소셜→홈→덱 전환 동안 잠시 이어 보입니다. 발생 입력은 미확인입니다.

## 전환 관찰 목록

| ID | 요청초 구간 | 실제 관찰 | 입력 후보(추정) |
|---|---|---|---|
| B-T01 | [2, 2.7] | B-F01 → B-F02: 홈에서 덱 시트가 아래에서 올라옴 | Btn_DeckQuickview |
| B-T02 | [5, 5.5] | B-F02 → B-F01: 덱시트가 내려가고 홈 복귀 | Btn_CollapseChevron |
| B-T03 | [6.3, 6.7] | B-F01 → B-F03: 게임모드 시트 진입 | Btn_ModeTrophy |
| B-T04 | [7.5, 8.2] | B-F03 → B-F01: 게임모드 시트 퇴장,홈 복귀 | Btn_CollapseChevron |
| B-T05 | [9.2, 9.7] | B-F01 → B-F04: 소셜 바탕으로 변경 후 왕 오버레이 진입 | Btn_Social 또는 가로스와이프 |
| B-T06 | [10, 11.2] | B-O01-S01 → B-O01-S02: 같은 말풍선의 문구 변경 | 화면탭 또는 자동 타이머 |
| B-T07 | [11.5, 12] | B-O01 → B-F04: 왕과 딤 퇴장,소셜만 표시 | 화면탭 또는 자동 타이머 |
| B-T08 | [14, 14.2] | B-F04 → B-F04+B-O02: 공사중 안내문 표시 | 오른쪽 검/월계관탭 가능성 |
| B-T09 | [14.8, 15.2] | B-F04 → B-F01: 소셜이 오른쪽으로 밀리고 홈 복귀 | Btn_Battle 또는 가로스와이프 |
| B-T10 | [15.5, 16.2] | B-F01 → B-F05: 홈이 오른쪽으로 밀리고 덱 페이지 진입 | Btn_CardsCollection 또는 가로스와이프 |
| B-T11 | [19.6, 19.8] | B-F05 → B-F06: 상단 선택이 덱에서 컬렉션으로 변경 | Tab_Collection |
| B-T12 | [20.4, 22.8] | B-F06 → B-F06: 카드 목록이 위로 이동,미발견 후반 행 표시 | 위로 스와이프 추정 |
| B-T13 | [22.8, 23.4] | B-F06 → B-F07: 상점으로 변경,오퍼 흰flash 뒤 실제그림 | Btn_Shop 또는 가로스와이프 |
| B-T14 | [24, 27] | B-F07 → B-F07: 특별상품→일일상품→자원/크리에이터 구간으로 스크롤 | 위로 스와이프 추정 |
| B-T15 | [27, 29] | B-F07 → B-F07: 자원→이모티콘→일일상품으로 역스크롤 | 아래로 스와이프 추정 |
| B-T16 | [29, 32.6] | B-F07 → B-F07: 일일상품→미니패스→초보자 팩 상단으로 역스크롤 | 아래로 스와이프 추정 |

게임 실행 연결을 만들지 않았습니다. 위 16건은 영상 전환/문구/스크롤 관찰이며 실제 runtime edge 16개가 아닙니다.

## 스크롤·탭·목록과 값의 경계

- 하단5탭: 상점,카드/컬렉션,전투,소셜,검·월계관(라벨/목적지 미관찰). 선택 시 탭 폭·라벨·작은 화살표 표시 변화.
- 카드 상단2탭: 덱/컬렉션. 컬렉션에5종 icon bar,필터·상하방향·‘레벨 기준’이 보이지만 각각 입력 결과는 미관찰. 컬렉션 스크롤 때 상단2탭·분류·정렬행도 함께 위로 사라지고 HUD/하단nav만 고정.
- 덱 본문4열×2행+평균엘릭서3.6+타워; 컬렉션은발견8/123과미발견4열 반복.
- 소셜: 클랜 안내+온라인/순위표·자기행1개; 실제 스크롤은 미관찰.
- 상점: 고정 HUD/하단내비게이션 사이 긴 세로 본문이 이동. 특별상품→일일상품→꾸미기→자원→하단 크리에이터 구간이 보이고 역스크롤로 특별상품 복귀.
- 상점 보석 80/500/1200/2500/6500/14000 및 ₩1,500/7,500/15,000/30,000/75,000/149,000,골드1000/10000/100000의보석가격60/500/4500,이모티콘3개각250보석은영상표시값입니다.현재상점이나발란스정본으로쓰지않습니다.
- 미니패스·초보자팩·업그레이드·일일상품 수량/가격은 inventory.json.visibleShopValues에 원본 표시 그대로 보존했습니다. 미관찰 값은 만들지 않았습니다.

## 검증·보존·미확인

- 실제 view_image: coarse7개+정밀4개+seconds8개=단독19프레임. 1초33개와정밀62개는연락판에서도직접확인.
- 메타정보/각추출index.json/대표JPG15개/연락판3개/구조화inventory.json을video-b배정폴더에보존.
- 원본영상수정0,제품소스수정0,설계JSON조작0,native툴제작0,브라우저검수0,서버시작0,패키지설치0,공용STATUS·보고수정0.
- 기존extract_video인수없음호출1회exit133은진단이력입니다.정식인수추출102entry는모두성공했습니다.메타Swiftdeprecated경고는출력했으나exit0입니다.
- 전체게임UI,실제Unity계층/앵커/폰트/9slice,게임규칙·결제·보상,정확한클릭·스크롤수치,모든미관찰목적지,툴제작·실화면동등은미확인.
- 원본/다른담당/타영상/공용지시함/보호파일은작업범위에넣지않았습니다.

읽은 원본과 도구 경로는 inventory.json.readSources에 보존했습니다.
