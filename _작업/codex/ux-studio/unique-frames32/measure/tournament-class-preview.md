# 클래스 업그레이드·혜택 안내 · 원본 측정 / 조립 제안

- 상태: 제안(검수 대기). 스크린샷 관찰 계층이며 Unity 원본 계층 증명이 아닙니다.
- 원본: `/Users/max/projest_max/ui-studio/docs/reference/monopoly-go/video-analysis-20261117/MGV09/frames/game-crops/stable-frame_00015.png`
- 실측 파일 크기: 606×1080 px. 551폭 균등축소: 551×981.980; 제작 basis 551×984.
- 사각형은 원본 좌상단 XYWH 시각 추정(보통 ±2–4px). source hit는 화면에서 알 수 없으므로 입력 사각형은 제작 제안으로 분리했습니다.

## 주요 구조

|ID / 부모|역할|원본 XYWH|551폭 XYWH|문구 / 관찰|
|---|---|---|---|---|
|ClassPreview / None|group|[0, 0, 606, 1080]|[0.0, 0.0, 551.0, 981.98]||
|Header / ClassPreview|group|[17, 13, 575, 184]|[15.457, 11.82, 522.814, 167.3]||
|Profile / Header|group|[17, 13, 167, 184]|[15.457, 11.82, 151.843, 167.3]||
|InfoGlyph / Profile|text|[35, 25, 8, 19]|[31.823, 22.731, 7.274, 17.276]|i|
|ProfileCount / Profile|text|[104, 147, 33, 26]|[94.561, 133.658, 30.005, 23.64]|34|
|TitleCard / Header|group|[181, 13, 411, 184]|[164.573, 11.82, 373.698, 167.3]||
|TitleLeft / TitleCard|text|[227, 57, 140, 39]|[206.398, 51.827, 127.294, 35.46]|동화 이야기|
|TitleRight / TitleCard|text|[419, 57, 134, 39]|[380.972, 51.827, 121.838, 35.46]|익스프레스|
|CurrentClass / TitleCard|text|[309, 113, 151, 30]|[280.955, 102.744, 137.295, 27.277]|퍼스트 클래스|
|Timer / ClassPreview|group|[225, 197, 161, 49]|[204.579, 179.12, 146.388, 44.553]||
|TimerText / Timer|text|[265, 210, 111, 27]|[240.949, 190.941, 100.926, 24.55]|42일 12시간|
|UpgradeSign / ClassPreview|group|[235, 388, 145, 88]|[213.672, 352.785, 131.84, 80.013]||
|UpgradeAmount / UpgradeSign|text|[307, 404, 22, 18]|[279.137, 367.333, 20.003, 16.366]|45|
|UpgradeText1 / UpgradeSign|text|[273, 422, 68, 19]|[248.223, 383.7, 61.828, 17.276]|에 도달하여|
|UpgradeText2 / UpgradeSign|text|[257, 440, 101, 19]|[233.675, 400.066, 91.833, 17.276]|업그레이드하세요|
|BenefitsBubble / ClassPreview|group|[98, 475, 416, 468]|[89.106, 431.889, 378.244, 425.525]||
|BubbleHeadline / BenefitsBubble|text|[172, 515, 273, 29]|[156.389, 468.259, 248.223, 26.368]|호화로움이 기다리는 곳...|
|ClassRibbon / BenefitsBubble|group|[124, 554, 371, 62]|[112.746, 503.719, 337.328, 56.373]||
|NextClass / ClassRibbon|text|[209, 564, 204, 37]|[190.031, 512.812, 185.485, 33.642]|프리미어 클래스|
|PortraitBenefit / BenefitsBubble|group|[159, 630, 92, 101]|[144.569, 572.822, 83.65, 91.833]||
|BookBenefit / BenefitsBubble|group|[261, 630, 92, 101]|[237.312, 572.822, 83.65, 91.833]||
|TokenBenefit / BenefitsBubble|group|[362, 630, 92, 101]|[329.145, 572.822, 83.65, 91.833]||
|Rewards / BenefitsBubble|group|[110, 751, 393, 180]|[100.017, 682.84, 357.332, 163.663]||
|RewardsHeadline / Rewards|text|[159, 778, 299, 32]|[144.569, 707.389, 271.863, 29.096]|더 근사한 일일 토너먼트 보상!|
|RewardStrip / Rewards|group|[157, 837, 299, 83]|[142.751, 761.035, 271.863, 75.467]||
|RankText / RewardStrip|text|[166, 841, 14, 23]|[150.934, 764.672, 12.729, 20.913]|1|
|PackSix / RewardStrip|text|[231, 869, 11, 15]|[210.035, 790.13, 10.002, 13.639]|6|
|PackCaption / RewardStrip|text|[198, 885, 48, 16]|[180.03, 804.678, 43.644, 14.548]|최소 1개|
|DiceQuantity / RewardStrip|text|[272, 886, 70, 28]|[247.314, 805.587, 63.647, 25.459]|1.75K|
|CashQuantity / RewardStrip|text|[355, 886, 88, 29]|[322.781, 805.587, 80.013, 26.368]|34.2M|
|Footer / ClassPreview|group|[0, 1009, 606, 71]|[0.0, 917.424, 551.0, 64.556]||
|FooterFill / Footer|fill9|[0, 1015, 606, 65]|[0.0, 922.88, 551.0, 59.101]|Reuse common cream fill; source observed footer visual height is not a token override.|
|FooterLine / Footer|frame9|[0, 1009, 606, 6]|[0.0, 917.424, 551.0, 5.455]||
|CloseHit / Footer|hit|[281, 1029, 44, 44]|[255.497, 935.609, 40.007, 40.007]||
|CloseGlyph / Footer|text|[292, 1036, 28, 30]|[265.498, 941.974, 25.459, 27.277]|×|
|InfoHit / Profile|hit|None|None||
|TrophyHit / TitleCard|hit|None|None||

## 정확히 보이는 전경 문자

i / 34 / 동화 이야기 / 익스프레스 / 퍼스트 클래스 / 42일 12시간 / 45 / 에 도달하여 / 업그레이드하세요 / 호화로움이 기다리는 곳... / 프리미어 클래스 / 더 근사한 일일 토너먼트 보상! / 1 / 6 / 최소 1개 / 1.75K / 34.2M / ×

## 입력·전환

- 정보 i: target=None; None; 실제 클릭/API 증명 없음.
- 트로피: target=None; None; 실제 클릭/API 증명 없음.
- 닫기: target=main-board; class card/train scene 소멸 후 MGV09-S03 메인 복귀 관찰; 실제 클릭/API 증명 없음.
- MGV09-T19: [71.5, 74]s MGV09-S01 순위→열차 클래스 미리보기. 클래스 보기 candidate, trigger null.
- MGV09-S12-A: [74, 76.5]s 열차실내/혜택카드 안정 상태. 현재 파일75s.
- MGV09-T20: [76.5, 78.5]s 클래스카드와 열차장면 사라진 뒤 메인보드. Close candidate, 클릭 자체 증명 없음.

## 경계 / 미확인

- 실제 클래스 업그레이드/보상지급·34/45 의미 정책·item 용도·초상 정체는 미관찰.
- info/trophy target null; 혜택·보상 그림에 미관찰 hit를 새로 만들지 않음.
- 전체 train scene이 스크롤되는지/개별 카드 입력이 있는지 미확인.
- 노란 미니6은 시각 문구만 전사; 임의 확정 정책값으로 해석하지 않음.
- 말풍선 main body 논리(89.103,453.711,378.244,403.703), separate tail(254.587,431.889,52.736,24.55). 초기 rough 통보의 y432는 tail 포함 바운드였다.
- 상단 profile/title card는 전체화면 클래스 전용2분할 구조이며 Main/Shop 공통96header를 새로 덮어쓰지 않음.
- 모든 수치는 영상에 표시된 예시 스냅샷이며 게임 data/balance 승인값이 아님.
