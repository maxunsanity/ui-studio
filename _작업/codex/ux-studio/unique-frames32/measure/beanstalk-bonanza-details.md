# 콩나무 노다지 진행·획득 안내 · 원본 측정 / 조립 제안

- 상태: 제안(검수 대기). 스크린샷 관찰 계층이며 Unity 원본 계층 증명이 아닙니다.
- 원본: `/Users/max/projest_max/ui-studio/docs/reference/monopoly-go/video-analysis-20261117/MGV09/frames/game-crops/stable-extra-frame_00000.png`
- 실측 파일 크기: 606×1080 px. 551폭 균등축소: 551×981.980; 제작 basis 551×984.
- 사각형은 원본 좌상단 XYWH 시각 추정(보통 ±2–4px). source hit는 화면에서 알 수 없으므로 입력 사각형은 제작 제안으로 분리했습니다.

## 주요 구조

|ID / 부모|역할|원본 XYWH|551폭 XYWH|문구 / 관찰|
|---|---|---|---|---|
|BeanstalkDetails / None|group|[0, 0, 606, 1080]|[0.0, 0.0, 551.0, 981.98]||
|Dim / BeanstalkDetails|dim|[0, 0, 606, 1080]|[0.0, 0.0, 551.0, 981.98]|Neutral dark overlay across main board; exact alpha unmeasured.|
|EventPanel / BeanstalkDetails|group|[29, 51, 555, 915]|[26.368, 46.371, 504.629, 831.955]||
|Hero / EventPanel|group|[19, 50, 573, 307]|[17.276, 45.462, 520.995, 279.137]||
|TitleBeanstalk / Hero|text|[238, 204, 153, 61]|[216.399, 185.485, 139.114, 55.464]|콩나무|
|TitleBonanza / Hero|text|[190, 269, 230, 75]|[172.756, 244.586, 209.125, 68.193]|노다지|
|Timer / EventPanel|group|[217, 340, 182, 55]|[197.305, 309.142, 165.482, 50.008]||
|TimerText / Timer|text|[254, 356, 134, 29]|[230.947, 323.69, 121.838, 26.368]|12시간 44분|
|Progress / EventPanel|group|[71, 417, 475, 83]|[64.556, 379.153, 431.889, 75.467]||
|ProgressText / Progress|text|[267, 443, 89, 28]|[242.767, 402.794, 80.922, 25.459]|111/170|
|DiceValue / Progress|text|[482, 463, 39, 25]|[438.254, 420.979, 35.46, 22.731]|150|
|TileInstruction / EventPanel|text|[140, 530, 335, 35]|[127.294, 481.898, 304.596, 31.823]|다음 타일에 도달하세요|
|TileGrid / EventPanel|group|[62, 575, 488, 309]|[56.373, 522.814, 443.71, 280.955]||
|Chance / TileGrid|group|[62, 575, 163, 309]|[56.373, 522.814, 148.206, 280.955]||
|ChanceHeader / Chance|text|[107, 601, 81, 31]|[97.289, 546.454, 73.649, 28.186]|복불복|
|ChanceAmount / Chance|text|[106, 839, 43, 34]|[96.38, 762.853, 39.097, 30.914]|+1|
|Community / TileGrid|group|[225, 575, 162, 309]|[204.579, 522.814, 147.297, 280.955]||
|CommunityHeader / Community|text|[236, 601, 144, 31]|[214.581, 546.454, 130.931, 28.186]|사회사업기금|
|CommunityAmount / Community|text|[268, 839, 43, 34]|[243.677, 762.853, 39.097, 30.914]|+1|
|Railroad / TileGrid|group|[387, 575, 163, 309]|[351.876, 522.814, 148.206, 280.955]||
|RailroadHeader / Railroad|text|[442, 601, 60, 31]|[401.884, 546.454, 54.554, 28.186]|철도|
|RailroadAmount / Railroad|text|[431, 839, 43, 34]|[391.883, 762.853, 39.097, 30.914]|+2|
|Multiplier / EventPanel|group|[29, 883, 563, 83]|[26.368, 802.86, 511.903, 75.467]||
|MultiplierText / Multiplier|text|[180, 897, 261, 46]|[163.663, 815.589, 237.312, 41.825]|배수를 올린 채로 주사위를 굴려 / 더 많은 보상을 수집하세요!|
|MultiplierValue / Multiplier|text|[522, 901, 48, 31]|[474.624, 819.226, 43.644, 28.186]|x5|
|RewardTooltip / BeanstalkDetails|group|[17, 51, 299, 357]|[15.457, 46.371, 271.863, 324.599]|Same screen secondary visual state. Keep hidden by default; no fabricated open/dismiss input.|
|RewardLogoBig / RewardTooltip|text|[116, 87, 99, 65]|[105.472, 79.104, 90.015, 59.101]|큰|
|RewardLogoLabel / RewardTooltip|text|[104, 145, 123, 57]|[94.561, 131.84, 111.837, 51.827]|보상|
|RewardQuantity / RewardTooltip|text|[117, 278, 103, 35]|[106.381, 252.769, 93.652, 31.823]|5,000|
|RewardCaption / RewardTooltip|text|[40, 346, 255, 25]|[36.37, 314.597, 231.856, 22.731]|승리하려면 목표점을 완료하세요!|
|CloseHit / BeanstalkDetails|hit|[281, 1027, 49, 49]|[255.497, 933.79, 44.553, 44.553]|Reuse tycoon-floating-close bottom8; no cream standard footer observed.|
|CloseGlyph / BeanstalkDetails|text|[293, 1037, 27, 31]|[266.408, 942.883, 24.55, 28.186]|×|

## 정확히 보이는 전경 문자

콩나무 / 노다지 / 12시간 44분 / 111/170 / 150 / 다음 타일에 도달하세요 / 복불복 / +1 / 사회사업기금 / +1 / 철도 / +2 / 배수를 올린 채로 주사위를 굴려 ⏎ 더 많은 보상을 수집하세요! / x5 / 큰 / 보상 / 5,000 / 승리하려면 목표점을 완료하세요! / ×

## 입력·전환

- 닫기: target=main-board; MGV09-S11 상세→MGV09-S03 메인보드; 실제 클릭/API 증명 없음.
- 보상/진행 영역: target=None; 57.5s tooltip와 함께 진입하여59.5–60s tooltip 없는 상태. 실제 열기/닫기 입력 미증명, 자동연결 금지; 실제 클릭/API 증명 없음.
- MGV09-T16: [57, 57.5]s 메인보드→상세+큰보상 말풍선. event/progress area candidate, trigger null.
- MGV09-S11-B: [57.5, 59]s 큰보상5,000 tooltip state; file58.5s.
- MGV09-S11-A: [59.5, 60]s tooltip 사라진 진행·3열안내 state; current file60s.
- MGV09-T17: [60, 60.5]s 상세 닫힘→메인. Close candidate, 실제 클릭 증명 없음.

## 경계 / 미확인

- 메인에서 상세 여는 정확한 버튼/클릭·말풍선 입력/자동소멸 조건은 미확인; opening/tooltip links null.
- 진행 fill은 캡처의 표현이며 정확한 애니메이션/111·170·150 및 보상정책/API는 미확인.
- x5는 이 캡처의 문자 그대로 x5로 전사. 공통 배수 변경 버튼을 이 안내 pill에 임의 연결하지 않음.
- Close 주위의 희미한 source ring은 pointer/강조 또는 UI 장식 여부가 불확실하므로 영구 원형 바탕을 추가하지 않음.
- 타일카드 회전 각도·원본 폰트·정확한 그라데이션/재질은 미확인.
- 진행/타일3열/배수 설명을 각각 별도 그룹으로 유지. 전체를 포스터 한 장으로 굽지 않음.
- Main underlay의 부분가림/어두워진 현금1,990,778·50/50·승리/짓기/앨범/친구 등은 새 foreground로 복제하지 않음. 원본 underlay 재사용 범위.
- 기본 상세 화면+Tooltip 표시 state는 같은 frame family이며 신규4번째 frame으로 세지 않음.
- reward-tooltip-visible이 포함된 텍스트도 JSON에 전사했으며 기본 상태에는 보이지 않음.
