# 승리 화면 조립 입력표 · 551×984 · 준비/제안(검수 대기)
읽음: 실제 보존 02_wins.png(324×568) view_image + assembly-screens/layers/connections CSV의02 관련 행만. 이 표는 Wins actual조립/저장/게임연결 완료가 아님.
좌표=[x,y,w,h]. O=가시 관찰 근사±2~5원본px, P=조립규격/텍스트wrapper/대체폰트. 전역논리 x,w×551/324=1.70061728; y,h×984/568=1.73239437. 부모local=전역−부모원점. 그림/원은이중배율로늘리지않고contain. font-family/실제원본font-size는미확인.
주의: 아래는 전체stage551×984 기준. 실제 modal root/presentation의크기가같은지먼저확인(과거상세root는90%×48%계약). 다른root에screen%/전역px를그대로넣지않음. main자체HUD를뒤에유지하고원본HUD/SNS/240,818을modal에중복복사하지않음.
|부품/부모|O source rect → 전역/부모 local 논리 px|P 규격·native text|기존재사용/새로필요|
|---|---|---|---|
|Modal_Wins/root|전체[0,0,324,568]→[0,0,551,984] stage참조|kind modal, engine dim/blocking/Escape각1개; 바깥탭닫기원본미확인|원메인뒤유지,dim BG중복제작금지|
|Group_Wins_Clipboard/root|O[6,61,309,473]→전역[10.20,105.68,525.49,819.42]|BG+Frame각100%, 기존3/9엔진/source128×64·slice27·edge27·padding0을출발점으로원본alpha검수|엔진/명세는Main·Build재사용; parchment BG·gold/white rim전용9source는필요시신규native자원,기존white판만으로원본동일주장X|
|Img_Wins_Clipboard_Clip/root|O[85,50,149,40]→전역[144.55,86.62,253.39,69.30]|고정clip장식,부모판위겹침,fitcontain|새blue clipboard clip(native vector가능); 전체클립보드사진늘림금지|
|Txt_Wins_Header_Eyebrow/Clipboard|O오늘의상단부≈source[121,99,54,17]→local[195.57,65.83,91.83,29.45]|P native “오늘의”,font22/700/line26·center|그림문구로굽지않음,연한gold색은시각제안|
|Txt_Wins_Header_Title/Clipboard|기존CSV통합title[112,98,98,64]→local[180.27,64.10,166.66,110.87]|P “퀵 승리”,local[160,91,207,80],46/800/line56·center·blue;금색외곽효과는별도지원확인|독립text;원본워드마크폰트/outline동등성미확인|
|Txt_Wins_Reset_Time/Clipboard|O[100,170,124,18]→local[159.86,188.83,210.88,31.18]|“남은 시간 : 4시간 16분”,P18/700/line24·center|관찰fixture,실제카운트다운/서버시간API미구현|
|Group_Wins_Missions/Clipboard|O[31,188,259,187]→전역[52.72,325.69,440.46,323.96]→local[42.52,220.01,440.46,323.96]|P전역[53,326,440,324],3개공통행440×100,local y2/110/218(간격8)|source행h53/55/62→논리91.82/95.28/107.41.100은같은역할정형화제안·원본동일값아님|
|Card_Wins_Mission01..03/Missions|O source y189/249/312,w259→공통local[0,2+108n,440,100]|round beige BG;Icon48²@(14,26),Txt@(72,16,276,68),CheckCircle60²@(356,20)|테두리두꺼운Build카드와구분;행BG native판/9source재사용검토,필요시단순새톤자원|
|Txt_Wins_Mission01_Description/Row01|Osource문구직접판독|“출발(을)를 1회 지나세요”,P22/700/line28·left/middle|첫GO마커는green diamond그림+native “GO”분리제안;원문조사표현그대로보존|
|Txt_Wins_Mission02_Description/Row02|Osource문구직접판독|“은행 강탈을 1회 완료하세요”,P22/700/line28·left/middle|새은행강탈상징/인물head그림필요;게임강탈판정미구현|
|Txt_Wins_Mission03_Description/Row03|Osource2줄문구|“랜드마크를 2개\n업그레이드하세요”,P22/700/line28·left/middle,명시줄바꿈|새phone+upgrade표식 또는검증된기존단품조합,실제업그레이드연동없음|
|Group_Wins_Complete/각Row|Owhitecircle+greencheck≈[240,197,35,35]→약60²|P whitecircle60²@(356,20),Build완료check의동일asset을안쪽[10,14,40,32]에contain|3행모두완료check관찰,보상수령/과제보상판정으로추정하지않음|
|Group_Wins_WeeklyReward/Clipboard|O[23,385,276,147]→전역[39.11,666.97,469.37,254.66]→local[28.91,561.30,469.37,254.66]|gold reward판+분리progress/reward/text,격자/광선장식은고정art|기존9계약재사용,테마gold ray/작은잎장식은별도native vector/그림준비|
|Txt_Wins_Weekly_Help/Weekly|O상단2줄instruction|P local[24,6,421,60],20/700/line26·center;앞check아이콘분리,문구“(을)를 획득하여 바를 채우고 주간\n보상을 획득하세요!”|원본check아이콘은독립그림,문구/inline정렬actual확인필요|
|BG/Fill_Wins_WeeklyProgress/Weekly|O근사source[45,462,221,21]→local[37.41,133.40,375.84,36.38]|P bar[38,133,376,36],BGdarkgray/fillblue별도;왼완료원64²≈[14,121]|진행fill은가시폭만참조(왼쪽짧은구간),수치%/필요점수/1일=1단계규칙을역산하지않음|
|Img_Wins_Weekly_Rewards/Weekly|O초록/갈색/노랑팩·작은die·큰보라팩;큰팩≈[222,435,67,78]→local[338.42,86.62,113.94,135.13]|팩/주사위각독립contain·완료check도분리,progress위겹침|기존단품이정확하면재사용;그외새transparent pack/보상그림필요·UI/text/shadow굽지않음|
|Txt_Wins_Weekly_DayCount/Weekly|O하단실물판독|“- 7일 중 1일 차 -”,P local[72,214,325,32],24/700/line28·center|기존10화면MD의3일차와달리실제02는1일차로판독;원계획/guide이번수정X|
|Group_Wins_Footer/root|O[0,534,324,34]→전역[0,925.10,551,58.90]|하단고정cream BG/white·gold상단선,clipboard/mission과별도|Build footer body9만재사용가능,crown/도시문구/Back동작그대로복사X|
|Btn_Wins_Close→Txt_Wins_Close_Label/Footer|O X[149,543,22,20]→local[253.39,15.59,37.41,34.65]|P input44²@(253.5,8),native“×”40/500/44,action close;메인Wins→open,conditionalways|기존Build44²닫기아트/입력재사용후동작은back이아닌close로교체;Escape정책·trigger복귀검수|
제작순서: modal root기준확인→Clipboard BG/Frame→고정clip/native제목·timer→행1개완성/3개복제→reward BG/bar/그림/native문구→닫기/메인입구. 복제root부모/transform/offset 재확인,AX숫자+Tab→재표시→저장/재열기/Undo. 과제아이콘/팩그림준비·원본폰트·게임판정은미확인. 이번단위는이파일만작성,actual UI/제품/설계/guide/STATUS/공용보고/서버/예약무수정.
