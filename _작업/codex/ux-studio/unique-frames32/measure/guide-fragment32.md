## 고유 프레임 3종 제작 규칙 · .32 추가 제안

상태는 제안(검수 대기)입니다. 선별한 신규 frame family는 쇼룸 토큰 상세·클래스 혜택·콩나무 진행 안내 3종입니다. 유사·연출 14분류는 신규 제작 대상으로 늘리지 않습니다. 원본 스크린샷의 관찰 구성을 native 편집 계층으로 재구성한 제안이며 Unity 원본 계층·게임 동작·원본 시각 동등이나 최종 승인을 증명하지 않습니다.

|프레임|분리할 부모·자식 구조|
|---|---|
|쇼룸 토큰 상세|기존 진열장 underlay → 별도 Dim → 금색 명판/frame9 + native 이름 → paw/info/style row → 독립 GodRays → 전체 캐릭터 + 받침 + 받침 앞 paw → EquipFooter. 캐릭터는 버튼(Buttons)의 주황색 전신·흰/보라 리본·분홍 하트를 보존하며 머리 아이콘으로 대체하지 않습니다.|
|클래스 혜택|열차 scene → 상단 profile / title card 2분할 → timer → upgrade sign → 위쪽 tail + speech body → native heading / ribbon title → 같은 역할의 혜택 3칸(초상 카드·책·파란 토큰) → 하단 보상 tray → common Footer. 말풍선 body와 tail을 따로 두고 혜택 3칸을 단일 그림으로 굽지 않습니다.|
|콩나무 안내|Main underlay + Dim → irregular cyan body / cloud cap → top hero art → native title / timer → progress rail/fill/text + bean/dice endpoints → instruction → 같은 역할·폭의 tile 3열 / divider2 → multiplier explanation/pill → floating Close. 큰보상 말풍선은 같은 화면의 별도 표시 state이며 네 번째 새 frame이 아닙니다.|

제작 basis는 551×984입니다. 원본 파일 크기는 쇼룸592×1052, 클래스·콩나무606×1080이며, 551폭 균등 환산 높이는 각각979.142·981.980입니다. 화면마다 X/Y를 따로 늘이거나 원본 캡처의 footer 높이로 공통 규격을 바꾸지 않습니다. 정확한 source dimensions와 시각 추정 좌표(보통 ±2–4 source px)를 구분합니다.

공통 Footer는551×72, topY912, line6을 유지합니다. Close hit는(253.5,940,44,44), glyph는(261.5,948,28,28)이며 입력 바탕은 투명입니다. 쇼룸은 `showroom-equip-footer-extension`이라는 명시 variant로 cream extension(0,852,551,60)과 돌출 Equip(153.5,810,244,72)을 따로 두는 제안입니다. common Footer 자체를 키우지 않습니다. 콩나무에는 cream Footer가 관찰되지 않았으므로 기존 floating-close variant를 사용합니다: bottom8, hit(253.5,932,44,44), glyph(261.5,940,28,28). 캡처의 희미한 원을 근거 없이 상시 Close 원형 배경으로 추가하지 않습니다.

글자·숫자·이름·타이머·배수는 native text, 아이콘과 장식은 별도 image, 가변 직선은 frame9/fill9/3slice, 외부 cast shadow와 ray 연출은 별도 엔진 효과/투명 자원으로 둡니다. 새 일러스트는 원본을 참고해 새로 만든 정적 그림이며 source screenshot pixels를 제품 자원으로 사용하지 않습니다. 같은 역할의 혜택 3칸/획득 3열은 같은 규격을 공유합니다. 원본 font·재질·카메라 값은 미확인으로 남깁니다.

원본에서 확인되지 않은 장착·이전·다음·info·trophy·tooltip 입력/게임 API는 target null을 유지합니다. source Close 후 Main 복귀라는 화면 순서와 실제 클릭/게임 정책 증명을 구분합니다. 확인되지 않은 경로를 만들기 위한 임시 버튼·임시 edge는 추가하지 않습니다. 새 입체 버튼은 정상/눌림 별도 전체 입체 원화·공통 시점/기준점·작은 눌림·native 글자·엔진 외부 그림자라는 r300 승인 제작법을 따릅니다. normal 한 장 또는 tint만으로 이 계약의 완료를 주장하지 않습니다.

이번 분석은 geometry19/새 그림3종의 정적 검토입니다. native 등록·저장/재열기·실제 pointer/keyboard/focus·390/430 기기 비례·이미지/넘침·기존14화면/연결/Undo 보존은 본체의 실제 검수 범위만 별도 기록합니다. 정적 자원 검증133개와 실제 화면 검수를 합산하지 않습니다.
