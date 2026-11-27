# 영상 A — 클래시 로얄 관찰 샘플

**제안(검수 대기)**. 실제 CLASH ROYALE/클래시 로얄 로고를 확인했습니다. 사용자 표현 클래시오브 클랜과 다른 게임입니다.

원본: `/Users/max/Desktop/Screen_Recording_20261118_154132_Clash Royale.mp4` (읽기전용). AVFoundation 길이216.3932초·1080×2340·nominalFrameRate60.5471763611. 파일명시각은영상타임라인출처로사용하지않습니다.

5초coarse44 + 전환fine71 + 주변정밀78 + 확인판6 = 추출199개. 콘택트시트193개항목과확인판대표1개=194항목을직접확인했으며중복시간을포함합니다. exactactualTime은각index.json에보존했습니다.

게임 고유판틀후보12 / 외부판틀2. 게임전체전수조사/조립완료가아닙니다. 모든JPG는원본참조이며production용이아닙니다.

| ID | 판틀 | 실제 대표초 | 대표 JPG |
| --- | --- | ---: | --- |
| A-F01 | 캐릭터 로고 로딩 | 14.994989 | [representatives/A-F01_014994ms.jpg](representatives/A-F01_014994ms.jpg) |
| A-X01 | Android 알림 허용창 | 0.000000 | [representatives/A-X01_000000ms.jpg](representatives/A-X01_000000ms.jpg) |
| A-F02 | 나이 선택 모달 | 4.983456 | [representatives/A-F02_004983ms.jpg](representatives/A-F02_004983ms.jpg) |
| A-F03 | 중요 공지 하단판 | 9.991333 | [representatives/A-F03_009991ms.jpg](representatives/A-F03_009991ms.jpg) |
| A-X02 | Usercentrics 개인정보 동의판 | 12.983789 | [representatives/A-X02_012983ms.jpg](representatives/A-X02_012983ms.jpg) |
| A-F04 | 훈련 전투 아레나 | 105.997300 | [representatives/A-F04_105997ms.jpg](representatives/A-F04_105997ms.jpg) |
| A-F05 | 훈련 승리 결과 오버레이 | 71.983978 | [representatives/A-F05_071983ms.jpg](representatives/A-F05_071983ms.jpg) |
| A-F06 | 상자 보상 발표 | 78.991800 | [representatives/A-F06_078991ms.jpg](representatives/A-F06_078991ms.jpg) |
| A-F07 | 훈련 전투 홈 | 101.993267 | [representatives/A-F07_101993ms.jpg](representatives/A-F07_101993ms.jpg) |
| A-F08 | 덱 편집 본문 | 84.999056 | [representatives/A-F08_084999ms.jpg](representatives/A-F08_084999ms.jpg) |
| A-F09 | 컬렉션 목록 본문 | 88.986522 | [representatives/A-F09_088986ms.jpg](representatives/A-F09_088986ms.jpg) |
| A-F10 | 기사 카드 상세 모달 | 91.990178 | [representatives/A-F10_091990ms.jpg](representatives/A-F10_091990ms.jpg) |
| A-F11 | 업그레이드 보상 확인 말풍선 | 92.690322 | [representatives/A-F11_092690ms.jpg](representatives/A-F11_092690ms.jpg) |
| A-F12 | 카드 업그레이드 발표 | 97.997133 | [representatives/A-F12_097997ms.jpg](representatives/A-F12_097997ms.jpg) |

## 분류 원칙

전투1/2·유닛·체력·안내·카드바표시/숨김은전투같은판틀의상태입니다. 보상4종과요약은같은보상흐름입니다. 덱과컬렉션은공통셸을공유하지만본문분할구조가달라두대표를유지했습니다. 카드선택·업그레이드전후는컬렉션의상태입니다.

## 판틀별 구조와 관찰

### A-F01 캐릭터 로고 로딩

전체 캐릭터 원화/상단 로고/최하단 진행바. 동일 원화의 77·99·100%는 상태 차이.

관찰문구: CLASH ROYALE / 클래시 로얄 / 99% / 100%

진입: 영상이 로딩+OS 알림창에서 시작한다.
복귀·이탈: 15.995초 전투; 72.994초 재로딩 뒤 75.996초 보상 화면.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (screen): 원본 전체 1080×2340; 원본px대략[0, 0, 1080, 2340]
- `ROOT → Img_Splash` (image): 캐릭터 전면 원화
- `ROOT → Img_Logo` (image+text): 게임 로고; 원본px대략[257, 149, 668, 367]
- `ROOT → Progress_Loading` (progress): 하단 진행바와 별도 백분율; 원본px대략[0, 2224, 1080, 116]

미확인: 로딩완료 조건/진행바 easing/실제 자원은 미확인

### A-X01 Android 알림 허용창

게임 로딩 위 하단 흰색 둥근 시스템 권한판. 게임 production 제작 대상과 분리.

관찰문구: 클래시 로얄에서 알림을 보내도록 허용하시겠습니까? / 허용 / 허용 안함

진입: 영상 첫 프레임에 이미 열림.
복귀·이탈: 0.995초에는 사라지고 연령 선택창이 보임. 어느 선택을 눌렀는지는 미확인.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (overlay): 로딩 배후
- `ROOT → Sheet_OSPermission` (system-sheet): 벨/질문/세로 두 선택; 원본px대략[29, 1680, 1022, 638]
- `Sheet_OSPermission → Img_Bell` (image): 알림 벨
- `Sheet_OSPermission → Txt_Prompt` (text): 알림 허용 질문
- `Sheet_OSPermission → Btn_Allow` (button): 허용
- `Sheet_OSPermission → Btn_Deny` (button): 허용 안함

미확인: 실제 운영체제 버전/선택 결과/재진입 동작 미확인

### A-F02 나이 선택 모달

로딩 위 넓은 회색 외틀/상단 제목/파랑 캐릭터 영역/밝은 슬라이더 영역/확인 버튼/빈 하단 패널.

관찰문구: 나이가 어떻게 되세요? / 슬라이더를 움직여 나이를 설정하세요. / 35 / 50 / 59 / 53 / 게임 플레이에는 영향을 주지 않습니다. / 확인

진입: 0.995초 OS 권한판 대신 연령판 등장.
복귀·이탈: 9.488초 연령판이 사라진 로딩, 9.741초 중요공지 등장. 확인 버튼 입력은 추정.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (overlay): 로딩 배후
- `ROOT → Panel_Age` (panel): 중앙 회색 외틀; 원본px대략[51, 519, 977, 1389]
- `Panel_Age → Txt_Title` (text): 나이가 어떻게 되세요?
- `Panel_Age → Img_King` (image): 상단 파랑 킹 초상
- `Panel_Age → Group_Slider` (input-group): 설명/숫자 말풍선/초록 트랙/파랑 손잡이/좌우 삼각
- `Group_Slider → Txt_Age` (text): 슬라이더 표시값
- `Group_Slider → Slider_Age` (slider): 연령 입력
- `Panel_Age → Btn_ConfirmAge` (button): 확인; 원본px대략[406, 1552, 269, 120]

미확인: 나이 입력범위/Unity slider 값/저장 값/정책 효과 미확인

### A-F03 중요 공지 하단판

어둡게 처리한 로딩 위 하단 둥근 작은 패널; 제목/약관안내/가로 세 선택.

관찰문구: 중요 공지 / ‘확인’을 탭해 이용 약관에 동의하고, 개인정보 처리방침에서 저희가 회원 개인정보를 어떻게 처리하는지 확인하세요. / 확인 / 개인정보 처리방침 / 이용 약관

진입: 9.741초부터 중요공지 관찰.
복귀·이탈: 11.996초 로딩 단독 뒤 12.242초 별도 개인정보 동의판.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (overlay): 로딩 배후+딤
- `ROOT → Panel_Notice` (panel): 하단 안내판; 원본px대략[29, 1761, 1022, 558]
- `Panel_Notice → Txt_NoticeTitle` (text): 중요 공지
- `Panel_Notice → Txt_NoticeBody` (text): 이용약관·개인정보 안내
- `Panel_Notice → Group_Actions` (row): 확인/개인정보 처리방침/이용 약관
- `Group_Actions → Btn_Confirm` (button): 확인
- `Group_Actions → Btn_Privacy` (button): 개인정보 처리방침
- `Group_Actions → Btn_Terms` (button): 이용 약관

미확인: 세 선택의 실제 클릭과 링크 목적지 미관찰

### A-X02 Usercentrics 개인정보 동의판

로딩 위 파란 세로 긴 동의판. 로고/제목/긴 설명/링크행/두 가로 버튼/공급자 표기; 상단 OS 상태바 동반.

관찰문구: 개인 정보 / 개인정보 보호정책 / 서비스 약관 / 자세한 정보 / 모두 수락 / 전체 거부 / Powered by Usercentrics Consent Management

진입: 12.242~13.243초 샘플에서 관찰.
복귀·이탈: 13.994초 로딩 단독. 수락/거부 중 선택 미확인.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (overlay): 로딩 배후+딤
- `ROOT → OS_Status` (system): 시간/기록/배터리 상태바; 샘플 콘텐츠에서 제외
- `ROOT → Panel_Consent` (panel): 파란 개인정보 동의판; 원본px대략[35, 887, 1010, 1377]
- `Panel_Consent → Img_Logo` (image): 작은 CLASH ROYALE 로고
- `Panel_Consent → Txt_Title` (text): 개인 정보
- `Panel_Consent → Txt_ConsentBody` (text): cookies·tracking·광고·분석 파트너 안내
- `Panel_Consent → Group_Links` (row): 보호정책/약관/자세한 정보
- `Panel_Consent → Btn_Accept` (button): 모두 수락
- `Panel_Consent → Btn_Reject` (button): 전체 거부
- `Panel_Consent → Txt_Vendor` (text): Usercentrics 공급자 표기

미확인: 실제 선택/외부 페이지/스크롤/OS 환경 미확인

### A-F04 훈련 전투 아레나

전면 세로 아레나: 적 3타워/강·두 다리/아군 3타워/좌상 상대 식별. 하단 카드바는 보이는 상태와 숨김 상태가 모두 관찰됨. 안내 킹/말풍선/손가락/배치금지 오버레이는 이 판틀의 상태.

관찰문구: 로얄 훈련관 / 얼 교관 / 피코바 교관 / 클래시 로얄에 오신 것을 환영합니다! / 먼저 훈련 매치부터 해보죠! / 적군이 쳐들어오고 있습니다! / 카드를 전장에 배치해 타워를 방어하세요! / 선택한 카드가 없습니다. / 다음: / 레벨 1 / 레벨 3

진입: 15.995초 첫 훈련 전장; 102.994초 두 번째 훈련 전장.
복귀·이탈: 첫 전투 69.498초 결과판으로 진행. 두 번째 전투는216.198초까지 진행중이며 종료결과 미관찰.
스크롤: 아레나는 전면장면. 화면 수직 스크롤은 미관찰.

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (screen): 아레나 전면; 원본px대략[0, 0, 1080, 2340]
- `ROOT → Scene_Arena` (scene-reference): 타워/잔디/울타리/강/다리; 원본 Unity 계층 미확인
- `ROOT → HUD_Opponent` (hud): 좌상 방패·교관 이름·로얄 훈련관
- `ROOT → HUD_Towers` (hud): 양측 타워 HP/왕관 레벨
- `ROOT → Group_Tutorial` (overlay): 킹/대사/손가락/선택안내
- `Group_Tutorial → Img_KingGuide` (image): 하단 킹 인물
- `Group_Tutorial → Txt_Bubble` (text): 흰 말풍선 대사
- `Group_Tutorial → Img_HandGuide` (image): 드래그·클릭 유도 손
- `ROOT → Group_Deploy` (overlay): 금지영역/카드 이름/유닛 미리보기
- `ROOT → HUD_Hand` (hud): 하단 파란 카드·엘릭서 판(표시 상태에만); 원본px대략[0, 1970, 1080, 370]
- `HUD_Hand → NextCard` (card): 다음 카드/라벨
- `HUD_Hand → HandCards` (row): 4카드 슬롯/엘릭서 비용/회색 비활성
- `HUD_Hand → ElixirBar` (progress): 수치와 분홍 게이지

미확인: 입력 좌표/드래그 궤적/카드바 표시정책/게임엔진 계층/전투2 종료 미확인

### A-F05 훈련 승리 결과 오버레이

전장 딤 위 적 붉은 리본/VS/아군 파란 리본+왕관3/하단 보상상자/확인. 왕관이 순차 등장한 중간상태와 완성상태는 같은판틀.

관찰문구: 얼 교관 / 로얄 훈련관 / VS / 나 / 클랜 없음 / 승리! / 보상 / 확인

진입: 68.998초 전장 뒤69.498초 리본 등장.
복귀·이탈: 72.485초 승리 문구·확인 남아있음;72.994초 로딩. 확인 입력은 추정.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (overlay): 전장 배후+딤
- `ROOT → OpponentResult` (ribbon): 적 이름/문장/빈 왕관쿠션; 원본px대략[60, 605, 950, 319]
- `ROOT → Txt_VS` (text): VS
- `ROOT → PlayerResult` (ribbon): 아군 이름/클랜없음/왕관3; 원본px대략[61, 1094, 949, 374]
- `ROOT → Reward_Chest` (card): 보상/상자; 원본px대략[398, 1497, 286, 351]
- `ROOT → Btn_ConfirmResult` (button): 확인; 원본px대략[430, 1950, 220, 107]

미확인: 보상상자 별도 탭효과/패배판/다른 왕관수 결과 미관찰

### A-F06 상자 보상 발표

파란 다이아 배경 위 좌상 보상카드/오른쪽 제목·종류·보유수/중하단 열린상자·남은수. 상자단독·카드별발표·4개요약은 같은 흐름의 상태.

관찰문구: 골드 / 자원 카드 / +18 / 내 골드: / 118 / 기사 / 일반 카드 / x1 / 2/2 / 미니 P.E.K.K.A / 희귀 카드 / 머스킷병 / 잠금 해제! / 획득:

진입: 75.996초 파란 보상장면; 앞은 전투결과·로딩.
복귀·이탈: 81.795초 4개요약 뒤81.995초 홈전환. 상자/다음보상 터치입구는 추정.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (screen): 파란 다이아 무늬
- `ROOT → Group_RewardReveal` (panel): 카드/제목/보유량; 원본px대략[180, 426, 762, 460]
- `Group_RewardReveal → Img_RewardCard` (image): 좌측 카드
- `Group_RewardReveal → Txt_RewardTitle` (text): 이름/등급
- `Group_RewardReveal → Txt_Quantity` (text): +18 또는x1
- `Group_RewardReveal → Progress_Ownership` (progress): 보유수/업그레이드가능
- `ROOT → Chest` (image): 열린상자/발광; 원본px대략[362, 1134, 379, 347]
- `Chest → Badge_Remaining` (badge): 4→3→2→1→0
- `ROOT → RewardSummary` (row): 요약상태에서 하단4카드

미확인: 실제 탭 좌표/총 배출확률/미관찰보상/실제 자원분리 미확인

### A-F07 훈련 전투 홈

상단3자원/프로필행/훈련진행도/중앙 디오라마/이벤트보상판/노랑 전투버튼/최하단5메뉴. 최초파랑배경과후속경기장조명배경은 같은 배치.

관찰문구: 나 / 클랜 없음 / 훈련 진행도 / 멀티플레이 해제까지 / 1/3 / 이벤트 / 전투 / 전투에서 승리하여 더 많은 보상을 획득하세요! / 113 / 100

진입: 81.995초부터 상자발표 후 홈;100.241초 컬렉션 다음 홈.
복귀·이탈: 82.996~83.997초 덱;102.994초 전투. 메뉴/전투 버튼 안내와 전후 흐름만 관찰.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (screen): 홈 전면
- `ROOT → HUD_Currency` (row): 경험(왕관카드)/골드/보석; 원본px대략[0, 108, 1080, 80]
- `ROOT → ProfileRow` (row): 이름/클랜없음/친구/소식/메뉴; 원본px대략[12, 239, 1035, 117]
- `ROOT → TrainingProgress` (progress): 훈련진행도/멀티플레이해제/1/3; 원본px대략[187, 385, 725, 146]
- `ROOT → Img_ArenaDiorama` (scene-reference): 중앙 훈련장 모형; 원본px대략[271, 904, 542, 589]
- `ROOT → EventRewards` (panel): 이벤트 제목/체크와 상자들; 원본px대략[367, 1588, 353, 216]
- `ROOT → Btn_Battle` (button): 노란 전투; 원본px대략[365, 1817, 361, 211]
- `ROOT → Tutorial` (overlay): 손가락/전투안내
- `ROOT → BottomNav` (tabbar): 5개메뉴; 선택 전투; 원본px대략[0, 2157, 1080, 183]

미확인: 친구/소식/메뉴/이벤트상자/다른 바텀메뉴 목적지 미관찰

### A-F08 덱 편집 본문

공통3자원/덱·컬렉션탭/전투덱배너/2×4 전투카드/평균엘릭서/타워유닛3D+별도타워카드/하단5메뉴. 컬렉션과셸공유하지만 본문분할구조다름.

관찰문구: 덱 / 컬렉션 / 전투 덱 / 레벨 1 / 레벨 3 / NEW / 3.6 / 1/2 / 2/2 / 8/9

진입: 82.996~83.997초 홈다음 덱 등장; 하단 카드입구로 추정.
복귀·이탈: 86.400초 덱;86.600초 컬렉션목록 하단으로 전환. 실제 탭입력은 미확인.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (screen): 카드관리 공통셸
- `ROOT → HUD_Currency` (row): 경험/골드/보석
- `ROOT → Tabs_Mode` (tabbar): 덱·컬렉션; 원본px대략[105, 236, 868, 119]
- `ROOT → DeckBanner` (ribbon): 전투 덱
- `ROOT → DeckGrid` (grid): 2행×4카드; 원본px대략[18, 583, 1040, 761]
- `DeckGrid → DeckCard` (repeat-card): 비용/초상/레벨/NEW/수량게이지는별도역할
- `ROOT → AverageElixir` (stat): 보라 엘릭서3.6
- `ROOT → TowerUnits` (panel): 킹/타워캐릭터/레벨/진행/연필/타워유닛카드
- `ROOT → BottomNav` (tabbar): 공통5메뉴

미확인: 덱 교체/카드드래그/연필/타워상세/선택외탭 동작 미관찰

### A-F09 컬렉션 목록 본문

공통3자원/덱·컬렉션탭/5아이콘 하위탭/찾음·필터·정렬/발견함2×4카드/미발견 회색4열 목록/하단5메뉴. 세로스크롤로 하위 아레나·타워유닛 목록이 나타남.

관찰문구: 덱 / 컬렉션 / 카드 컬렉션 / 찾음: 8/123 / 레벨 기준 / 발견함 / 미발견 / 잠금 해제: / 아레나 1 / 타워 유닛 / 찾음: 1/4 / 업그레이드 / 정보 / 사용

진입: 86.600초 덱 다음 컬렉션 아래쪽;88.987초 목록상단;90.496초 기사선택확장.
복귀·이탈: 91.489초 기사상세로 진행;업그레이드완료후98.989초 동일목록복귀;100.241초 홈.
스크롤: 86.600~88.987초 하단목록에서상단으로보이는영역이변한다. 상단3자원/하단메뉴는같은위치. 스크롤오프셋과gesture는미확인.

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (screen): 카드관리공통셸
- `ROOT → HUD_Currency` (row): 경험/골드/보석(스크롤중에도 화면상단유지)
- `ROOT → Tabs_Mode` (tabbar): 덱·컬렉션
- `ROOT → Tabs_Category` (tabbar): 5개아이콘; 카드/다른4종
- `ROOT → Scroll_Collection` (scroll): 세로 카드본문
- `Scroll_Collection → Toolbar` (row): 찾음·필터슬라이더아이콘·정렬삼각·레벨기준
- `Scroll_Collection → DiscoveredGrid` (grid): 발견함 4열 카드
- `Scroll_Collection → UndiscoveredGrid` (grid): 미발견 회색 4열 아레나해제카드
- `Scroll_Collection → TowerUnitSection` (grid): 하단 타워유닛4카드
- `Scroll_Collection → SelectedCardPopover` (popover): 선택 카드 확장과 업그레이드/정보+사용
- `ROOT → BottomNav` (tabbar): 5메뉴;컬렉션선택

미확인: 스크롤 입력방식/총픽셀거리/상위탭 고정정책/5하위탭 목적지/정렬·필터효과 미확인

### A-F10 기사 카드 상세 모달

컬렉션 딤 위 상단 돌출 기사모형/파란 큰판. 카드초상·레벨·희귀도/유형 표/큰 시연화면·점표시/아래 업그레이드·사용/우상닫기.

관찰문구: 기사 / 레벨 1 / 2/2 / 희귀도 / 일반 / 유형 / 유닛 / 업그레이드 / 5 / 사용

진입: 90.997초 선택메뉴 다음91.489초 상세. 선택카드의업그레이드또는초상탭중정확입력은미확인.
복귀·이탈: 92.490초 업그레이드보상 확인판이 중첩;X닫기/사용 동작은미관찰.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (overlay): 컬렉션 배후+딤
- `ROOT → Img_KnightFigure` (image): 판 위 돌출 기사모형; 원본px대략[301, 163, 556, 593]
- `ROOT → Panel_Detail` (panel): 파란 상세판; 원본px대략[46, 758, 994, 1258]
- `Panel_Detail → Btn_Close` (button): 우상 빨강X; 원본px대략[935, 779, 72, 75]
- `Panel_Detail → Card_Preview` (card): 좌측비용3/기사/레벨/2/2
- `Panel_Detail → Txt_NameLevel` (text): 기사/레벨1
- `Panel_Detail → Stat_Rarity` (stat): 희귀도/일반
- `Panel_Detail → Stat_Type` (stat): 유형/유닛
- `Panel_Detail → Scene_Demo` (scene-reference): 아레나 시연장면
- `Panel_Detail → Pager_Demo` (indicator): 시연아래 점들
- `Panel_Detail → Btn_Upgrade` (button): 업그레이드5골드
- `Panel_Detail → Btn_Use` (button): 사용
- `ROOT → TutorialHand` (image): 업그레이드유도손

미확인: 시연화면 실제플레이입력/점선택/닫기복귀/다른카드상세/패널스크롤 미확인

### A-F11 업그레이드 보상 확인 말풍선

카드 상세 위 추가딤/작은 밝은테두리 말풍선. 보상두행/녹색 확인5골드/아래꼬리. 손가락이 제목일부를가림.

관찰문구: 업그레이드 보상 / 1 / 4 / 확인 / 5

진입: 92.490초부터상세위확인판.
복귀·이탈: 92.9초무렵다이아배경업그레이드발표. 확인입력은안내/전후흐름으로추정.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (overlay): 상세 배후+추가딤
- `ROOT → Panel_UpgradeConfirm` (popover): 말풍선테두리/아래꼬리; 원본px대략[297, 1373, 489, 453]
- `Panel_UpgradeConfirm → Txt_Title` (text): 업그레이드 보상(일부가림)
- `Panel_UpgradeConfirm → Reward_CrownCards` (row): 왕관카드아이콘1
- `Panel_UpgradeConfirm → Reward_Star` (row): 금색별아이콘4
- `Panel_UpgradeConfirm → Btn_Confirm` (button): 확인5골드
- `ROOT → TutorialHand` (image): 확인유도손

미확인: 취소/외부클릭/보상아이콘공식명칭/확인전체문구 일부가림

### A-F12 카드 업그레이드 발표

파란다이아배경 위 중앙 이름/진행바/카드/증가스탯3행. 상자보상과배경공유하나중앙수직스탯구조가다름.

관찰문구: 기사 / 0/4 / 레벨 2 / 피해량 / 86 / +7 / 초당 피해량 / 71 / +6 / HP / 759 / +69

진입: 확인판후92.991초부터발표장면.
복귀·이탈: 98.989초컬렉션복귀;닫기버튼은보이지않고실제복귀입력은미확인.
스크롤: 이번 영상에서 스크롤 미관찰

부품계층 제안 (원본 게임/Unity 실제 계층 미관찰):
- `- → ROOT` (screen): 파란 다이아 배경
- `ROOT → Txt_CardName` (text): 기사; 원본px대략[443, 351, 190, 105]
- `ROOT → Progress_Card` (progress): 화살표/0/4; 원본px대략[328, 463, 452, 111]
- `ROOT → Img_Card` (card): 발광카드/레벨2; 원본px대략[366, 671, 341, 420]
- `ROOT → Stat_UpgradeRows` (column): 피해량86+7/초당피해량71+6/HP759+69; 원본px대략[392, 1134, 405, 414]
- `Stat_UpgradeRows → Stat_Icon` (image): 각행아이콘
- `Stat_UpgradeRows → Stat_Name` (text): 항목명
- `Stat_UpgradeRows → Stat_Base` (text): 현재표시수치
- `Stat_UpgradeRows → Stat_Delta` (text): 녹색증가량

미확인: 표시수치의밸런스정본/재생시간정책/다른카드/터치복귀조건 미확인

## 실제 화면전환 관찰과 입력 추정 분리

전환은실제화면전후관찰입니다. 안내손/버튼강조만으로실제클릭입력을확정하지않습니다. 아래숫자는마지막이전샘플~첫이후샘플의범위이며정확한클릭시각이아닙니다.

| from → to | 샘플구간(초) | 관찰 | 조작근거 |
| --- | --- | --- | --- |
| A-X01 → A-F02 | 0.000~0.995 | OS허용판→나이선택 | 선택 버튼 미확인 |
| A-F02 → A-F03 | 9.488~9.741 | 연령판 닫힘 뒤 중요공지 | 확인 버튼 추정 |
| A-F03 → A-X02 | 11.996~12.242 | 중요공지 닫힘·개인정보동의판 | 확인/정책링크 중 실제입력 미확인 |
| A-X02 → A-F04 | 13.243~15.995 | 동의판닫힘→로딩→첫전장 | 수락/거부 선택 미확인 |
| A-F04 → A-F05 | 68.998~69.498 | 첫전투타워파괴 뒤 승리결과 | 전투종료 연출 관찰 |
| A-F05 → A-F06 | 72.485~75.996 | 확인→로딩→상자 | 확인 클릭 추정 |
| A-F06 → A-F07 | 81.795~81.995 | 4개요약→홈 | 탭/자동전환 구분 미확인 |
| A-F07 → A-F08 | 82.996~83.997 | 홈→덱 | 하단카드메뉴 안내손과 전후화면; 입력 추정 |
| A-F08 → A-F09 | 86.400~86.600 | 덱→컬렉션하단 | 컬렉션탭 전환 추정 |
| A-F09 → A-F10 | 90.997~91.489 | 기사선택확장→상세 | 초상/업그레이드 중 정확입력 미확인 |
| A-F10 → A-F11 | 92.240~92.490 | 상세→업그레이드보상확인 | 녹색업그레이드 버튼 추정 |
| A-F11 → A-F12 | 92.700~92.991 | 확인→업그레이드발표 | 확인5골드 버튼 추정 |
| A-F12 → A-F09 | 98.739~98.989 | 업그레이드발표→컬렉션복귀 | 복귀입력 미확인 |
| A-F09 → A-F07 | 99.991~100.241 | 컬렉션→전투홈 | 하단전투탭 안내손; 입력추정 |
| A-F07 → A-F04 | 101.993~102.994 | 전투홈→두번째훈련전투 | 노란전투버튼 안내손; 입력추정 |

## 보존·미완료

- 원본영상수정0·삭제0. 제품소스/설계/공용STATUS·report수정0. 브라우저/서버/새패키지/외부발송0.
- 새로만든것은지정폴더안의추출참고JPG·콘택트시트·메타정보·이분석JSON/MD입니다.
- 부품사각형은1080×2340캡처수동대략값입니다. 논리좌표/폰트/Unity계층으로쓰지않습니다.
- 게임엔진연결·UI스튜디오조립·반응형·키보드검수·원본폰트/자원은미실시입니다.
- 전투2는216.198초에도진행중이며그뒤결과는없습니다.
- JSON이상세정본이며각evidence의실제시간/프레임경로·부모계층·탭·스크롤·추정/미확인을보존합니다.
