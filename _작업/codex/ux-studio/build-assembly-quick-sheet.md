# 짓기 actual UI 입력표 · 551×984 · 제안(검수 대기)
근거: 01_build.png(422×750) 직접 보기 + ten-screen layers CSV + ux-gjs-0d80d7fe r24(main551×984/63부품/0연결) read only. 아래 새 page-build는 미조립이며 원본 폰트/게임정책 미확인.
표의 rect=[x,y,w,h]. O=시각 관찰±2~3원본px, P=공통 조립 제안. 전역논리=(원본x,w×551/422; y,h×984/750), 부모local=전역−부모원점. 원본 잉크 높이로 font-size를 확정하지 않음.
|부품/부모|원본 source rect → 부모 local 논리 px|실제 입력 규격·native text/fixture|구분/재사용|
|---|---|---|---|
|Page_Build → Slot_Build_Scene → Img_Build_City_Backdrop|[0,0,422,750]→page[0,0,551,984]|page logical551×984, 배경cover/비율유지·표시전용|P; build-city manifest importPath, 실제3D 아님|
|HUD_Build_Top/page|상단plate+빨간점 전체를 담는 wrapper→[0,0,551,80]|상단고정, SNS·방패 없음; 별0/현금4,404/집0/메뉴|P; r24 SNS형 top을 그대로 복제해 끝내지 않음|
|Group_Build_TopPlate/HUD_Top|O[12,12,403,42]→[15.67,15.74,526.19,55.10]|BG_TopBar+Frame_TopBar 각100%; 원 source128×64/slice27/edge27/padding0|O→P; r24 두 skin/자원 재사용, 모서리합54보다 h55.10 큼|
|Group_Build_Level/TopPlate|O[17,20,77,27]→[6.53,10.50,100.54,35.42]|별Img[1.3,0,35.3,35.4], Txt_Build_Level_Count [50.9,2,28,31]="0"; P font26/700/line30|별은 unitagent 준비; 어두운 capsule BG 별도, 폰트는 제작안|
|Group_Build_Cash/TopPlate|O[107,20,121,28]→[124.04,10.50,157.99,36.74]|Img_Cash[1.3,1.3,41.8,34.1], Txt_Build_Cash_Amount[58.8,2,99,32]="4,404"; P26/700/30|r24 Img_Cash region/assetRef 유지, 가격/금액은 editable text|
|Group_Build_House/TopPlate|O[294,20,61,27]→[368.20,10.50,79.65,35.42]|집Img[0,0,41.8,34.1], Txt_Build_House_Count[56.1,2,23,31]="0"; P26/700/30|집자원 unitagent 준비; 현금/집 수를 게임정책으로 확정하지 않음|
|Btn_Build_Menu/HUD_Top|bars O[381,24,19,20]; P wrapper[478,5,65,66]|Img_MenuBars local[19.5,26.5,24.8,26.2], red dot local[40.4,0.3,23.5,23.5]·부모안|P; r24 메뉴 이미지/compound dot 재사용, 이 메뉴 destination은 미확인|
|Line_Build_01..03/TopPlate|source x≈96/279/367,y20,h27→local x109.68/348.62/463.52,y10.50|폭1.3×높이35.4, 얇은 gold/cream 분리선; native panel padding0|O 근사; source 구획용, 수치와 겹치면 입력 wrapper/배치 검수|
|HUD_Build_Bottom/page|source y543..750→전역[0,712,551,272]|하단고정; Cards→Footer 형제, scene/HUD 위 paint|P; 다른 기기 높이는 bottom anchor로 재계산|
|Group_Build_Cards/HUD_Bottom|O[4,543,414,134]≈전역[5,712.4,541,176]→local[5,0.4,541,176]|5 Btn_Build_Landmark01..05 모두100×171, 전역x=[6.5,116.25,226,335.75,445.5],y714; 부모localx=[1.5,111.25,221,330.75,440.5],y1.6|P; source 환산w99.23/100.54,h170.56 대비 Δw≤0.77/Δy0.27논리px, 간격9.75 동일|
|BG_Card/Frame_Card/각Card|source 첫Card[5,544,76,130], 나머지w77 → local[0,0,100,171]|각BG/Frame 9slice 분리; r24 TopPlate source slice27 보존, Card edge18/padding0 제안; cyan topband[4,4,92,28] 별도|P; edge18은 이번 카드용 조정안·원본값 아님, 알파/코너 실제 비교 필요|
|Dot_Build_01..03/각Card|source3점 약x29..58,y551..562→P localx30/44/58,y10|세 원12×12, 간격2, center50; 1/2/3/5 gray, 4 blue(채움/테두리)|O색/P정형규격; 점의 게임 의미/단계정책 미확인|
|Img_Build_Landmark01..05/각Card|source 개별 그림높이 상이→공통local[6,34,88,100]|5개 alpha crop 개별sourceSize 유지, fit contain/하단기준; 상점/3층/시계탑/자유상/입구 순서|P; build-landmark-assets.json 각 importPath, 다른 비율을 강제늘림 금지|
|Group_Build_Price/카드01·02·03·05|source Cash+금액 약[10,649,66,23]→공통local[6,136,88,28]|CashImg[0,5,28,20], Txt_Build_LandmarkNN_Price[30,0,58,28]; P24/700/28, text=240/312/384/528|O fixture/P폰트; r24 Cash 원자원 재사용, 가격0 창작 금지|
|Img_Build_Complete/카드04|source4번 green check→공통local[34,137,32,28]|완료 check만 표시, Price group 숨김/미생성; 숫자0으로 대체하지 않음|O; 재사용 check 또는 native UI도형, 조건 판정/업그레이드 동작 미구현|
|Group_Build_Footer/HUD_Bottom|O[0,685,422,65]→전역[0,898.72,551,85.28]→local[0,186.72,551,85.28]|cream BG+white/gold topborder 기존9source 재사용, crown 없음|P; r24 BottomNav BG/Frame body만 복제 가능, 고정 crown/GO/4메뉴는 가져오지 않음|
|Txt_Build_City_Progress/Footer|O[111,695,211,23]→가시wrapper local[144.93,13.12,275.50,30.18]|P editable text box[0,10,551,32], font24/700/line28/center, "NEW YORK CITY 3/15"|O fixture/P폰트·wrapper; 원본 font-family/size/weight 미확인|
|Btn_Build_Back → Txt_Build_Back_Label/Footer|X O[199,718,24,24]→art local[259.83,43.30,31.34,31.49]|P input[253.5,37.04,44,44], native "×" 40/500/44/center; action back→현재 main|O art/P입력·폰트; navigate(main)보다 기존 history back으로 복귀, actual 연결/포커스 미검수|
입력 전: r24 원본/현재main은 유지하고 새page/새ID로 UI 생성, 내부 이름 Txt_<영역>_<역할>_<용도>. skin·캐시·메뉴 그림은 실제 기존 assetRef 복사; 새 PNG/스프라이트 master·alpha16 fringe/300000bytes 계약은 manifests 참조. 값→Tab→재표시→저장/재열기/Undo 확인. 이번 단위는 입력표만 작성(제품·JSON·UI·source·가이드·STATUS 미수정).
