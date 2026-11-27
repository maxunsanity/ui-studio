# 06 오른쪽 메뉴 측정표

제안(검수 대기) · 측정 준비만 · 2026-11-17 00:05 KST

원본 `docs/reference/monopoly-go/20261116-ten-screens/06_menu.png` / 정확한 PNG 296×531 / SHA `72246016e6a26c9c9953131f6b20bd121f938dbf0a83fac4bacf30da7b103f4e`.
설계는 task시작 r90(33fbd0d3fee5eeda2738ce3ac67668989a0bc5ce10699a17a816e1c906ddb331)·Main175/전체460·5화면/8연결을 읽었습니다. 새 목적지는 아직 없습니다.

좌표 `[x,y,w,h]` px. source→551×984·parent-relative를 계산했습니다. 시각 측정±2 source px이며 소수2자리는 계산 정밀도입니다. 그림은contain/고정곡선비율을 보존하고 모바일은루트전체uniform fit을 제안합니다.

|key|parent|source|global551|local551|관찰 글자|
|---|---|---|---|---|---|
|Dim_Main_Backdrop|root|[0, 0, 296, 490]|[0.0, 0.0, 551.0, 908.02]|[0.0, 0.0, 551.0, 908.02]||
|Sheet_Main_Menu_Panel|root|[111, 5, 184, 468]|[206.62, 9.27, 342.51, 867.25]|[206.62, 9.27, 342.51, 867.25]||
|BG_Main_Menu|Sheet_Main_Menu_Panel|[111, 5, 184, 468]|[206.62, 9.27, 342.51, 867.25]|[0.0, 0.0, 342.51, 867.25]||
|Frame_Main_Menu|Sheet_Main_Menu_Panel|[111, 5, 184, 468]|[206.62, 9.27, 342.51, 867.25]|[0.0, 0.0, 342.51, 867.25]||
|Img_Menu_DecorTop|Sheet_Main_Menu_Panel|[114, 11, 23, 22]|[212.21, 20.38, 42.81, 40.77]|[5.58, 11.12, 42.81, 40.77]||
|Img_Menu_DecorBottom|Sheet_Main_Menu_Panel|[114, 447, 23, 22]|[212.21, 828.34, 42.81, 40.77]|[5.58, 819.07, 42.81, 40.77]||
|Group_Menu_Profile|Sheet_Main_Menu_Panel|[177, 32, 60, 92]|[329.48, 59.3, 111.69, 170.49]|[122.86, 50.03, 111.69, 170.49]||
|Frame_Menu_Profile|Group_Menu_Profile|[177, 32, 60, 60]|[329.48, 59.3, 111.69, 111.19]|[0.0, 0.0, 111.69, 111.19]||
|Img_Menu_Profile|Group_Menu_Profile|[181, 36, 52, 52]|[336.93, 66.71, 96.8, 96.36]|[7.45, 7.41, 96.8, 96.36]||
|Txt_Menu_Profile_Name|Group_Menu_Profile|[188, 99, 42, 24]|[349.96, 183.46, 78.18, 44.47]|[20.48, 124.16, 78.18, 44.47]|현중|
|Line_Menu_Header|Sheet_Main_Menu_Panel|[126, 136, 165, 1]|[234.55, 252.02, 307.15, 1.85]|[27.92, 242.76, 307.15, 1.85]||
|Group_Menu_Rows|Sheet_Main_Menu_Panel|[126, 137, 165, 273]|[234.55, 253.88, 307.15, 505.9]|[27.92, 244.61, 307.15, 505.9]||
|Btn_Menu_Shop|Group_Menu_Rows|[126, 137.0, 165, 30.333333333333332]|[234.55, 253.88, 307.15, 56.21]|[0.0, 0.0, 307.15, 56.21]||
|Btn_Menu_Shop_Icon|Btn_Menu_Shop|[130, 138.0, 29, 29]|[241.99, 255.73, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_Shop_Label|Btn_Menu_Shop|[170, 144.0, 119, 18]|[316.45, 266.85, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|SHOP|
|Btn_Menu_Shop_Divider|Btn_Menu_Shop|[126, 167.3333, 165, 0.6]|[234.55, 310.09, 307.15, 1.11]|[0.0, 56.21, 307.15, 1.11]||
|Btn_Menu_NetWorth|Group_Menu_Rows|[126, 167.3333, 165, 30.333333333333332]|[234.55, 310.09, 307.15, 56.21]|[0.0, 56.21, 307.15, 56.21]||
|Btn_Menu_NetWorth_Icon|Btn_Menu_NetWorth|[130, 168.3333, 29, 29]|[241.99, 311.94, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_NetWorth_Label|Btn_Menu_NetWorth|[170, 174.3333, 119, 18]|[316.45, 323.06, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|NET WORTH|
|Btn_Menu_NetWorth_Divider|Btn_Menu_NetWorth|[126, 197.6667, 165, 0.6]|[234.55, 366.3, 307.15, 1.11]|[0.0, 56.21, 307.15, 1.11]||
|Btn_Menu_Showroom|Group_Menu_Rows|[126, 197.6667, 165, 30.333333333333332]|[234.55, 366.3, 307.15, 56.21]|[0.0, 112.42, 307.15, 56.21]||
|Btn_Menu_Showroom_Icon|Btn_Menu_Showroom|[130, 198.6667, 29, 29]|[241.99, 368.15, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_Showroom_Label|Btn_Menu_Showroom|[170, 204.6667, 119, 18]|[316.45, 379.27, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|MY SHOWROOM|
|Btn_Menu_Showroom_Divider|Btn_Menu_Showroom|[126, 228.0, 165, 0.6]|[234.55, 422.51, 307.15, 1.11]|[0.0, 56.21, 307.15, 1.11]||
|Btn_Menu_DailyTreats|Group_Menu_Rows|[126, 228.0, 165, 30.333333333333332]|[234.55, 422.51, 307.15, 56.21]|[0.0, 168.63, 307.15, 56.21]||
|Btn_Menu_DailyTreats_Icon|Btn_Menu_DailyTreats|[130, 229.0, 29, 29]|[241.99, 424.36, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_DailyTreats_Label|Btn_Menu_DailyTreats|[170, 235.0, 119, 18]|[316.45, 435.48, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|DAILY TREATS|
|Btn_Menu_DailyTreats_Divider|Btn_Menu_DailyTreats|[126, 258.3333, 165, 0.6]|[234.55, 478.72, 307.15, 1.11]|[0.0, 56.21, 307.15, 1.11]||
|Btn_Menu_Map|Group_Menu_Rows|[126, 258.3333, 165, 30.333333333333332]|[234.55, 478.72, 307.15, 56.21]|[0.0, 224.84, 307.15, 56.21]||
|Btn_Menu_Map_Icon|Btn_Menu_Map|[130, 259.3333, 29, 29]|[241.99, 480.57, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_Map_Label|Btn_Menu_Map|[170, 265.3333, 119, 18]|[316.45, 491.69, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|MAP|
|Btn_Menu_Map_Divider|Btn_Menu_Map|[126, 288.6667, 165, 0.6]|[234.55, 534.93, 307.15, 1.11]|[0.0, 56.21, 307.15, 1.11]||
|Btn_Menu_BoardReport|Group_Menu_Rows|[126, 288.6667, 165, 30.333333333333332]|[234.55, 534.93, 307.15, 56.21]|[0.0, 281.05, 307.15, 56.21]||
|Btn_Menu_BoardReport_Icon|Btn_Menu_BoardReport|[130, 289.6667, 29, 29]|[241.99, 536.78, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_BoardReport_Label|Btn_Menu_BoardReport|[170, 295.6667, 119, 18]|[316.45, 547.9, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|BOARD REPORT|
|Btn_Menu_BoardReport_Divider|Btn_Menu_BoardReport|[126, 319.0, 165, 0.6]|[234.55, 591.14, 307.15, 1.11]|[0.0, 56.21, 307.15, 1.11]||
|Btn_Menu_JoinUs|Group_Menu_Rows|[126, 319.0, 165, 30.333333333333332]|[234.55, 591.14, 307.15, 56.21]|[0.0, 337.27, 307.15, 56.21]||
|Btn_Menu_JoinUs_Icon|Btn_Menu_JoinUs|[130, 320.0, 29, 29]|[241.99, 592.99, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_JoinUs_Label|Btn_Menu_JoinUs|[170, 326.0, 119, 18]|[316.45, 604.11, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|JOIN US!|
|Btn_Menu_JoinUs_Divider|Btn_Menu_JoinUs|[126, 349.3333, 165, 0.6]|[234.55, 647.35, 307.15, 1.11]|[0.0, 56.21, 307.15, 1.11]||
|Btn_Menu_Settings|Group_Menu_Rows|[126, 349.3333, 165, 30.333333333333332]|[234.55, 647.35, 307.15, 56.21]|[0.0, 393.48, 307.15, 56.21]||
|Btn_Menu_Settings_Icon|Btn_Menu_Settings|[130, 350.3333, 29, 29]|[241.99, 649.21, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_Settings_Label|Btn_Menu_Settings|[170, 356.3333, 119, 18]|[316.45, 660.32, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|SETTINGS|
|Btn_Menu_Settings_Divider|Btn_Menu_Settings|[126, 379.6667, 165, 0.6]|[234.55, 703.56, 307.15, 1.11]|[0.0, 56.21, 307.15, 1.11]||
|Btn_Menu_GoChat|Group_Menu_Rows|[126, 379.6667, 165, 30.333333333333332]|[234.55, 703.56, 307.15, 56.21]|[0.0, 449.69, 307.15, 56.21]||
|Btn_Menu_GoChat_Icon|Btn_Menu_GoChat|[130, 380.6667, 29, 29]|[241.99, 705.42, 53.98, 53.74]|[7.45, 1.85, 53.98, 53.74]||
|Btn_Menu_GoChat_Label|Btn_Menu_GoChat|[170, 386.6667, 119, 18]|[316.45, 716.53, 221.52, 33.36]|[81.91, 12.97, 221.52, 33.36]|GO!CHAT|
|Badge_Menu_Shop|Btn_Menu_Shop|[146, 136, 14, 15]|[271.78, 252.02, 26.06, 27.8]|[37.23, -1.85, 26.06, 27.8]||
|Badge_Menu_JoinUs|Btn_Menu_JoinUs|[148, 318, 14, 14]|[275.5, 589.29, 26.06, 25.94]|[40.95, -1.85, 26.06, 25.94]||
|Badge_Menu_GoChat|Btn_Menu_GoChat|[150, 380, 15, 14]|[279.22, 704.18, 27.92, 25.94]|[44.68, 0.62, 27.92, 25.94]||
|Footer_Menu_CloseStrip|root|[0, 490, 296, 38]|[0.0, 908.02, 551.0, 70.42]|[0.0, 908.02, 551.0, 70.42]||
|Line_Menu_Footer|Footer_Menu_CloseStrip|[0, 490, 296, 3]|[0.0, 908.02, 551.0, 5.56]|[0.0, 0.0, 551.0, 5.56]||
|Txt_Menu_Close|Footer_Menu_CloseStrip|[140, 503, 14, 15]|[260.61, 932.11, 26.06, 27.8]|[260.61, 24.09, 26.06, 27.8]|×|

## 관찰과 제안

```json
{
  "profileName": "현중",
  "rowCount": 9,
  "rows": [
    {
      "key": "Btn_Menu_Shop",
      "labelObserved": "SHOP",
      "artObserved": "storefront",
      "destination": "08_shop: proposal, target not in r90",
      "hasRedDot": true
    },
    {
      "key": "Btn_Menu_NetWorth",
      "labelObserved": "NET WORTH",
      "artObserved": "blue/gold starburst",
      "destination": "unknown",
      "hasRedDot": false
    },
    {
      "key": "Btn_Menu_Showroom",
      "labelObserved": "MY SHOWROOM",
      "artObserved": "blue top hat",
      "destination": "07_shields: proposal, target not in r90",
      "hasRedDot": false
    },
    {
      "key": "Btn_Menu_DailyTreats",
      "labelObserved": "DAILY TREATS",
      "artObserved": "calendar",
      "destination": "unknown",
      "hasRedDot": false
    },
    {
      "key": "Btn_Menu_Map",
      "labelObserved": "MAP",
      "artObserved": "folded yellow map",
      "destination": "unknown",
      "hasRedDot": false
    },
    {
      "key": "Btn_Menu_BoardReport",
      "labelObserved": "BOARD REPORT",
      "artObserved": "exclamation disc",
      "destination": "unknown",
      "hasRedDot": false
    },
    {
      "key": "Btn_Menu_JoinUs",
      "labelObserved": "JOIN US!",
      "artObserved": "thumbs-up",
      "destination": "unknown",
      "hasRedDot": true
    },
    {
      "key": "Btn_Menu_Settings",
      "labelObserved": "SETTINGS",
      "artObserved": "gear",
      "destination": "unknown",
      "hasRedDot": false
    },
    {
      "key": "Btn_Menu_GoChat",
      "labelObserved": "GO!CHAT",
      "artObserved": "speech bubble",
      "destination": "unknown",
      "hasRedDot": true
    }
  ],
  "redDots": [
    "SHOP",
    "JOIN US!",
    "GO!CHAT"
  ],
  "bodyScroll": "Not demonstrated by screenshot; all nine rows visible.",
  "dim": "Dark overlay on Main behind panel; no outside-click-to-close policy observable."
}
```

기존 입력ID `element-e8785ae7-4e1d-4a27-acd8-e119263d624f` / Btn_Menu 보존. 새 targetID는실제 UI 생성 후에만기록합니다.

```json
{
  "kind": "sheet",
  "fullscreenRootOptIn": true,
  "supportBoundary": "sheet/fullscreen-root opt-in is parent-provided implementation documentation; no runtime verification done in this task.",
  "rootLogicalSize": [
    551,
    984
  ],
  "actualNewTargetId": null,
  "drawerRect551": [
    206.62,
    9.27,
    342.51,
    867.25
  ],
  "footerProductionProposal": "Use bottom-anchored551×70.4, own44×44 Close input centered; measured footer bbox leaves screenshot border pixels below it.",
  "singleDimOnly": true,
  "navigation": "Main Menu open(sheet); Close/Escape close/focus Main Menu. SHOP→08 and SHOWROOM→07 navigate closing drawer, then page Back→Main. Drawer auto-reopen not inferred.",
  "unobservedDestinations": [
    "NET WORTH",
    "DAILY TREATS",
    "MAP",
    "BOARD REPORT",
    "JOIN US!",
    "SETTINGS",
    "GO!CHAT"
  ]
}
```

## native·색·입력 제안

```json
{
  "profileName": {
    "fontSize": 30,
    "weight": 800,
    "lineHeight": 36,
    "align": "center",
    "color": "#484157"
  },
  "rowLabels": {
    "fontSize": 20,
    "weight": 800,
    "lineHeight": 24,
    "align": "left",
    "color": "#484157"
  },
  "divider": {
    "color": "#d6d3c6",
    "height": 1
  },
  "panelFill": {
    "observedSampleApprox": "#f3f1e2",
    "note": "Paper texture varies; sample is not source material exactness."
  },
  "footerFill": {
    "observedSampleApprox": "#eee9d7"
  },
  "dim": {
    "proposed": "rgba(0,0,0,.70)",
    "exactOpacity": "unknown"
  },
  "buttonState": {
    "enabled": true,
    "mode": "tint",
    "targetGraphic": "own row icon child",
    "normal": "#ffffff",
    "hover": "#f2f2f2",
    "pressed": "#bdbdbd",
    "selected": "#d8e8ff",
    "disabled": "#999999",
    "note": "Project production interaction proposal, not observed source interaction states."
  },
  "close": {
    "nativeGlyph": "×",
    "fontSize": 32,
    "weight": 700,
    "lineHeight": 44,
    "inputSize": [
      44,
      44
    ],
    "color": "#b6b3aa"
  }
}
```

## 최소 조립 순서

1. Create new fullscreen-root opt-in sheet; keep actual Main behind a single dim and preserve Menu trigger ID.
2. Right-anchored panel BG/frame/decor→portrait circle/native name→one row/icon/native label/divider/dot→duplicate nine equal rows.
3. Footer own native Close input; connect open/close/Escape and only actual existing destinations. Unknown seven stay unset.
4. Save/reopen, actual390/430/1440; keyboard/focus/dim/inert and navigation/back checks are still pending.

미확인: Static observation only; no asset creation/import, UI editing or browser test. / Observed image296×531; plan footer end527 is not full PNG height. / Original fonts, dim alpha, outside-click behavior, exact icon subjects and unknown destinations are not confirmed.

이 작업은 측정표4파일만 생성했습니다. 설계/source/assets/guide/공용보고/STATUS·예약·서버·7007·보호파일 접근 변경 없음. 실화면 검수/사용자 승인 아님.
