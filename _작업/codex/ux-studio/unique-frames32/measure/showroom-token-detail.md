# 쇼룸 토큰 확대 상세 · 원본 측정 / 조립 제안

- 상태: 제안(검수 대기). 스크린샷 관찰 계층이며 Unity 원본 계층 증명이 아닙니다.
- 원본: `/Users/max/projest_max/ui-studio/docs/reference/monopoly-go/video-analysis-20261117/MGV02/frames/game-crops/MGV02-S04-B.png`
- 실측 파일 크기: 592×1052 px. 551폭 균등축소: 551×979.142; 제작 basis 551×984.
- 사각형은 원본 좌상단 XYWH 시각 추정(보통 ±2–4px). source hit는 화면에서 알 수 없으므로 입력 사각형은 제작 제안으로 분리했습니다.

## 주요 구조

|ID / 부모|역할|원본 XYWH|551폭 XYWH|문구 / 관찰|
|---|---|---|---|---|
|ShowroomDetail / None|group|[0, 0, 592, 1052]|[0.0, 0.0, 551.0, 979.142]||
|Dim / ShowroomDetail|dim|[0, 0, 592, 920]|[0.0, 0.0, 551.0, 856.284]|Dark neutral full-screen content dim; exact alpha is unmeasured.|
|Nameplate / ShowroomDetail|group|[111, 38, 370, 78]|[103.312, 35.368, 344.375, 72.598]||
|TokenName / Nameplate|text|[264, 52, 65, 37]|[245.716, 48.399, 60.498, 34.438]|버튼|
|StyleRow / ShowroomDetail|group|[174, 132, 239, 55]|[161.949, 122.858, 222.448, 51.191]||
|InfoGlyph / StyleRow|text|[181, 137, 8, 15]|[168.465, 127.512, 7.446, 13.961]|i|
|StyleText / StyleRow|text|[245, 141, 168, 35]|[228.032, 131.235, 156.365, 32.576]|스타일 토큰|
|TokenDisplay / ShowroomDetail|group|[126, 300, 338, 395]|[117.274, 279.223, 314.591, 367.644]||
|EquipFooter / ShowroomDetail|group|[0, 871, 592, 181]|[0.0, 810.677, 551.0, 168.465]|New named showroom-equip-footer-extension variant; standard footer remains72.|
|FooterExtension / EquipFooter|fill9|None|None|Cream continuation above standard footer; explicit variant extension60.|
|Equip / EquipFooter|group|[164, 871, 263, 79]|[152.642, 810.677, 244.785, 73.529]||
|EquipFrame / Equip|frame9|[164, 871, 263, 79]|[152.642, 810.677, 244.785, 73.529]|White outer rim around green horizontal capsule; top face plus thin dark green lower side wall; normal/pressed separate state art.|
|EquipLabel / Equip|text|[251, 883, 90, 45]|[233.617, 821.846, 83.767, 41.883]|장착|
|EquipHit / Equip|hit|[164, 871, 263, 79]|[152.642, 810.677, 244.785, 73.529]|Target null. Do not add a fake equip result.|
|Footer / EquipFooter|group|[0, 919, 592, 133]|[0.0, 855.353, 551.0, 123.789]|Observed complete cream support is133source px tall. Standard native Footer remains72; extra source height handled by named extension proposal.|
|FooterBackground / Footer|fill9|[0, 919, 592, 133]|[0.0, 855.353, 551.0, 123.789]|Reuse common footer fill9; all source cream support is one visual surface, not measured two pieces.|
|FooterLine / Footer|frame9|[0, 918, 592, 5]|[0.0, 854.422, 551.0, 4.654]|Common line6 at standard Footer top, extension has no duplicate line. Source line is ~856 logical; this deliberate common-policy adaptation moves it.|
|CloseHit / Footer|hit|[274, 991, 44, 44]|[255.024, 922.367, 40.953, 40.953]||
|CloseGlyph / Footer|text|[282, 998, 28, 32]|[262.47, 928.882, 26.061, 29.784]|×|
|PreviousHit / Footer|hit|[12, 980, 44, 44]|[11.169, 912.128, 40.953, 40.953]||
|PreviousGlyph / Footer|text|[19, 986, 30, 36]|[17.684, 917.713, 27.922, 33.507]|‹|
|NextHit / Footer|hit|[536, 980, 44, 44]|[498.878, 912.128, 40.953, 40.953]||
|NextGlyph / Footer|text|[542, 986, 30, 36]|[504.463, 917.713, 27.922, 33.507]|›|
|InfoHit / StyleRow|hit|None|None|Intentionally may overflow StyleRow; target null.|

## 정확히 보이는 전경 문자

버튼 / i / 스타일 토큰 / 장착 / × / ‹ / ›

## 입력·전환

- 정보 i: target=None; None; 실제 클릭/API 증명 없음.
- 장착: target=None; None; 실제 클릭/API 증명 없음.
- 이전: target=None; None; 실제 클릭/API 증명 없음.
- 다음: target=None; None; 실제 클릭/API 증명 없음.
- 닫기: target=main-board; X 이후 MGV02-S01 메인 복귀 관찰; 쇼룸 목록으로 복귀를 임의 가정하지 않음; 실제 클릭/API 증명 없음.
- MGV02-T05: [8.208333, 8.333333]s 토큰 진열(MGV02-S03)→확대/딤/이름판. candidate 신규 리본 강아지; trigger null.
- MGV02-T06: [8.916667, 9]s 장착/좌우/X 표시 완료.
- MGV02-T07,T08: [10.208333, 10.708333]s 상세 사라지는 전환 후 메인보드 복귀. 시각 대응만 증명.

## 경계 / 미확인

- 장착 API/결과·좌우 탐색·i 안내는 미관찰이므로 target null.
- 버튼 토큰은 character+plinth 시각 관찰이며 실제 3D mesh/Unity 계층은 미확인.
- 원본 눌림 상태와 정확한 dim alpha·source font/재질은 미관찰.
- FooterExtension60/Equip244×72/line relocation은 명시 제작 제안이며 source screenshot 수치의 승인 또는 원본 동등 주장이 아님.
- 기존 Footer72, navigation hit44, glyph28과 동일한 역할 규격 유지. 크림 support의 screenshot 높이를 공통 footer 높이로 덮어쓰지 않음.
- 마우스 포인터/기존 딤 목록의 3 등 뒤쪽 문구를 새 native foreground로 복제하지 않음.
- 입체 버튼은 r300 승인 제작법(공통 카메라/입체 정상·눌림 별도원화/native text/외부 엔진그림자)을 재사용.
