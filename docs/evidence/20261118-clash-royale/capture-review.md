# Clash r78 캡처·GUI기록 검토

2026-11-18T18:09:33+09:00 · codex 하위 · 제안(검수 대기)

읽은 원본: [browser-checks.json](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/browser-checks.json) 6894B와 이시점 r78 JPG13장. 실제 픽셀은 Pillow 메타데이터로 읽었으며, 이미지 내용 시각판독·브라우저조작은 하지 않았습니다.

|구분|CSS viewport|논리 설계|실제 JPG pixels|장수|
|---|---|---|---|---|
|최종UI desktop4화면|1440×900|390×844|1800×1125|4|
|최종UI mobile4화면|430×843|390×844|537×1055|4|
|눌림2장|파일별CSS미기록|390×844 기준작업|537×1055|2|
|wireframe/세부wireframe|파일별CSS미기록|390×844 기준작업|2000×1125|2|
|overview-r78.jpg|파일별CSS미기록|각 화면390×844|2000×1125|1|

렌더된 screenBox는 desktop 약301.280×651.988 CSSpx, mobile 약255.071×551.990 CSSpx입니다. recordedDPR≈0.8로 JPG픽셀을 대신 계산하지 않습니다. 별도 standalone Deck CSS1600×900 검사1건은 위 캡처의 파일별CSS와 자동매칭하지 않습니다.

GUI기록: desktop4+mobile4=8뷰포트 모두 broken0/pending0/overflowX·Yfalse/outside0. checks는 17항목으로 true13/과거false2/pass필드없는2(standalone·close focus)입니다. true13에는 반복라우팅을 포함한12항목과 Enter/Escape1항목이 있습니다. 서로 다른 단위를 합쳐 총통과수로 쓰지 않습니다.

라우팅 이름기준10종: Home bottom→Deck/Social, Home top→Social, Home shortcut→Deck, Deck→Home/Social, Social→Deck/Home, Knight→Detail, Close→Deck·기사focus. JSON에 transitionID가 없어 자동edge-ID일치 검증으로 표현하지 않습니다.

실패후수정: 기사상세진입false와r71 first click false/cause는 backplate none의 입력가로챔 문제로 기록됐습니다. r77 parent-input교정후 성공true, Close후 dialogs0·Card_CR_Knight초점, Enter열기/Escape닫기true입니다. 과거false2개를 미해결r78실패2개나 독립결함2개로 합산하지 않습니다.

눌림근거: normal1 → 검증된pressed0.741176 → 해제hover0.949020. 첫buttonFirstRead는normal1이므로 눌림성공근거가 아닙니다. 네단계 외부drop-shadow는 동일(검정opacity0.2,0/2/2px)합니다. tint상태변경은 확인되지만 별도눌림원화·앞면/글자이동·상태별그림자변화는 이기록으로 확정하지 않습니다.

|JPG|실제pixels|bytes|
|---|---|---|
|[button-held-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/button-held-r78.jpg)|537×1055|47018|
|[button-held-verified-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/button-held-verified-r78.jpg)|537×1055|47146|
|[deck-desktop-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/deck-desktop-r78.jpg)|1800×1125|85633|
|[deck-detailed-wireframe-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/deck-detailed-wireframe-r78.jpg)|2000×1125|76660|
|[deck-mobile-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/deck-mobile-r78.jpg)|537×1055|57071|
|[deck-wireframe-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/deck-wireframe-r78.jpg)|2000×1125|62508|
|[detail-desktop-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/detail-desktop-r78.jpg)|1800×1125|60564|
|[detail-mobile-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/detail-mobile-r78.jpg)|537×1055|39414|
|[home-desktop-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/home-desktop-r78.jpg)|1800×1125|80416|
|[home-mobile-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/home-mobile-r78.jpg)|537×1055|53232|
|[overview-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/overview-r78.jpg)|2000×1125|151430|
|[social-desktop-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/social-desktop-r78.jpg)|1800×1125|67042|
|[social-mobile-r78.jpg](/Users/max/Documents/Codex/2026-11-18/outputs/clash-royale/social-mobile-r78.jpg)|537×1055|43323|

기존 final-structure-review.md를 보존했습니다. 산출은 scratch의 capture-review.json/.md 두파일이며 live설계/소스·공용보고·원본JPG·브라우저 변경0입니다.
