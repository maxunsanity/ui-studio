# UI 스튜디오 툴 기획서
가이드 판: 2026-11-16.13 · 제안(검수 대기)
독립 정본 보정: 2026-11-16


**최신 .13:** 문서 끝의 “승리 화면 조립 추가 기록”과 [제작 recipe](TOOL_SPEC.md), [검수 경계](PROGRESS.md)의 .13을 먼저 읽습니다. 아래 .12 이하의 “최신/진행 중”은 해당 판의 이력입니다. 기존 프로젝트 guide .4는 보존합니다.

## 최신 안내 · .12 · r43

공통 정본은2026-11-16.12입니다. 실제 저장본 ux-gjs-0d80d7fe r43은 기존메인63+신규짓기78부품·2페이지·navigate/Back2개입니다. [진척 맨 위의 .12](PROGRESS.md)와 [툴 기획서 끝의 짓기 제작 recipe](TOOL_SPEC.md)를 우선합니다. 아래 .11/r24·미등록·수정 중 문구는 당시 이력이며 최신 완료/미완료를 대신하지 않습니다. W/P/U/S0/4·10장 최종동등검수0/10·사용자 승인 없음, 기존 프로젝트guide.4는 보존합니다.

## 최신 상태 바로보기 · .11 · r24

최신 저장판은 ux-gjs-0d80d7fe **r24·1페이지63부품·0연결**입니다. 세 배지 이미지 자식의 “Img_Notification_BG 복사”를 “Img_Notification_BG”로 정리해 저장했습니다. 아래 r21/수정 중/재시험 예정 문구는 당시 이력이며, 최신 사실과 지원 경계는 [PROGRESS 맨 위의 r24 마감 보정](PROGRESS.md)을 우선합니다. 공통판 .11·기존 본문·프로젝트 .4 사본은 유지합니다.

상세 기기 비례 수정/실화면·416통합·가이드 색 검수는 아래 .11의 pending 상태를 정정합니다. [상세 기기 보완 계약](../../../../_작업/codex/ux-studio/detail-device-scale-report.md)은 authored logical size·기기 비율·편집 zoom/총배율을 분리합니다. 별도 preview는 entry uniform fit만 지원합니다. 현재 로비 규격/compound 알림/9slice/이름/AI for UI 선택 방법은 아래 표준을 계속 사용하되 최신 완료/미완료는 PROGRESS를 따릅니다.

## 현재 로비 제작 표준 · .11

공통판 2026-11-16.11 · 제안(검수 대기). 이 절이 현재 로비 제작/검수 상태의 기준이며 아래 .10 이하 본문과 AI for UI 추가절은 보존합니다. .10의 “계획/미구현/조립 중” 중 아래에서 실제 확인한 항목만 최신 결과로 정정합니다. 원본 측정·알파·정사각 region·9slice·paint/입력 분리·원본 폰트 미확인·명시 컨펌 규칙은 그대로 적용합니다. 현재 사용자 UI 승인·freeze는 없고 W/P/U/S 0/4입니다.

|항목|현재 실제 조립/검수 결과|경계|
|---|---|---|
|저장판|본체 actual UI 편집/저장 ux-gjs-0d80d7fe r21, 1페이지63부품·0연결|10화면/게임 기능 연결 완료가 아닙니다. 문서 담당 재실행 결과가 아닙니다.|
|같은 역할의 4메뉴|각80×92, Img64×64@(8,6), Txt80×22@(0,70), font14/weight500/line18. x=0/88/384/471,y888의 공통 제작 규격을 유지합니다.|원본 폰트를 확인한 값이 아니며 표시 그림은 contain으로 비율 유지. 기존 ID/연결을 이름 맞추며 재발급하지 않습니다.|
|실제 compound 배지|각28×28@(52,0), Wins=count0 숨김/Build=count5/Album=dot presence1/Friends=count4. 각 부모 아래 Img_Notification_BG와 Txt_Notification_Count를 별도 조립, 숫자는 white18/weight700.|부모 notification이 정본1개. dot의 글자는 공백, 0숨김은 부모가 자식 전체를 숨깁니다. 각 자식에 notification을 복제하지 않습니다.|
|배지 자원|새 native 원형 BG source112×112, 논리28×28에서 white rim3px, WebP1632bytes. 문구/UI shadow는 미포함.|source3px 테두리라는 뜻이 아닙니다. [자원 manifest](../../../../_작업/codex/ux-studio/notification-circle-assets.json)의 hash/원본·등록 경로를 따릅니다.|
|상하단 그룹/앵커|HUD_Bottom은 기존14개 root를 묶은551×280·하단 고정, HUDTop은536×94·상단 고정(9,12).|14는 그룹에 묶은 root 수이며 전체63부품 수와 다릅니다. 최신 실제 그룹의 부모/ID를 확인한 뒤 이어 편집합니다.|
|전체 캔버스 기기 보기|공통 profile/custom414×896·방향 commit의 실제 변경과 설계 저장판r17 상태 유지 확인. 390×844에서 board389.997×843.987, 배치 논리 높이1192.42.|보기 크기를 바꿔도 설계 원본551×984를 다시 저장하는 동작이 아닙니다. 편집 확대율/실제 하드웨어 검수와 구분합니다.|
|390px 비례 결과|각 메뉴56.610×65.112, Img45.288², Txt56.610×15.566, Badge19.810²로390/551 비례. Wins0 배지 숨김, 깨진 이미지0.|전체 캔버스의 해당 actual 검수 범위입니다. main 상세 편집390에서는 root551 고정/넘침 문제가 발견되어 수정 중이며 전체 preview 완료로 확대하지 않습니다.|
|개별 가이드|4메뉴 각각 정확한 이름의 heading과 W80/H92 상시 표시를 actual 확인했습니다.|가이드 보기 크기/CSS px와 실제 설계 논리80×92를 혼동하지 않습니다.|
|버튼 두 방식|[button-state](../button-state.mjs)의 tint/image·targetGraphic 구현, 전용124 시험. actual 4메뉴는 각 실제 이미지 자식을 tint 대상으로 UI 저장·동작 시험했고 normal→클릭 후 hover/다른3개normal을 확인했습니다.|샘플 image-mode·GO 실화면은 미검수. 5상태 엔진 지원을 모든 상태/모든 버튼의 샘플 실화면 통과로 쓰지 않습니다.|
|전체 시험/진입|본체 [이번 로그](../../../../_작업/codex/ux-studio/bottom-standard-final-tests.log)411/411. [현재 검수 포인터](../../../../tools/ux-studio/current-review.json)는0d80d7fe, bare7018 actual browser r21 진입 성공.|상세390 보완 뒤 재실행 예정. 7007/LocalServerBrowser native 앱은 미검수. 시험 수는 완성률이 아닙니다.|

텍스트 name은 아래처럼 부품 종류/영역/역할을 읽을 수 있게 맞춥니다. 화면 문구·name·stable id·flat runtime key는 별개입니다.

|역할|버튼 name|그림 name|텍스트 name|
|---|---|---|---|
|승리|Btn_BottomNav_Wins|Img_BottomNav_Wins_Icon|Txt_BottomNav_Wins_Label|
|짓기|Btn_BottomNav_Build|Img_BottomNav_Build_Icon|Txt_BottomNav_Build_Label|
|앨범|Btn_BottomNav_Album|Img_BottomNav_Album_Icon|Txt_BottomNav_Album_Label|
|친구|Btn_BottomNav_Friends|Img_BottomNav_Friends_Icon|Txt_BottomNav_Friends_Label|

[compound 렌더 계약](../../../../_작업/codex/ux-studio/compound-notification-report.md)은 component가 있는 badge 부모의 자체 글자를 비우고 직속 partRole=label 자식에 포맷된 숫자를 표시합니다. 이미지와 글자를 따로 편집하며 legacy 단일 panel 배지의 동작도 보존합니다. 예전 .10의 “독립 자식 숫자 미구현”은 현재 이 샘플/renderer 범위에서는 위 실제 조립 결과로 정정합니다. Count0/5/dot1/4는 검수용 fixture이며 게임 정책이 아닙니다.

native 입력은 AX로 현재 부품을 확인→값 변경→Tab/blur→재표시/저장값 확인 순서로 검증합니다. checkbox 조작은 속성을 재렌더할 수 있으므로 이전 DOM/AX 노드를 계속 쓰지 않고 현재 선택 ID·새 필드·저장값을 다시 찾습니다. locator.fill 미반영만으로 제품 버그를 단정하지 않습니다. 버튼 효과는 부모/이미지 대상 선택, 보기 상태, 실제 저장 config를 나누고 텍스트/배지까지 임의 tint하지 않습니다.

가이드 enabled W입력의 computed color rgb(200,213,228)이 전역 dark label 색을 상속해 흰 바탕에서 흐리게 보이는 사례를 확인했습니다. 본체는 .ux-design-guide 범위의 label #46566d, input/select/textarea #253247·white 배경으로 최소 보완했고 후속 실화면/캡처는 예정입니다. 입력이 disabled인지, 값이 미적용인지, 배경/상속 색 문제인지 구분해 확인하며 전체 테마 변경으로 확대하지 않습니다. CSS 수정 사실을 실제 가독성 통과나 측정하지 않은 대비율 통과로 세지 않습니다.

[AI for UI 적용 계획](../../../../docs/plans/20261116-ai-for-ui-adoption.md)은 learn-taste·break-ui·mobile-native·버튼/모션 검토 중 필요한 방법을 **선택적으로** 기존 제작/수락표에 편입합니다. 자동 설치0·런타임 패키지 추가0이며 source/이미지 제작·9slice·계층·게임 연결을 대신하지 않습니다. 사용자 원문→종류→규칙/수치→제시한 이유→근거→상태를 남기고 미측정 성능/실물 폰/전체 스킬 실행을 주장하지 않습니다.

[10화면 조립 명세](../../../../docs/plans/20261116-ten-screen-assembly.md)의10원본/132계층/43연결·미확인 항목은 명세 수이며 실제10화면 조립이 아닙니다. 새 짓기 도시 그림295148bytes는1회 준비했으나 아직 미등록입니다. 실제 샘플 단계는 r21 로비, 게임/새 페이지 연결은 남아 있습니다. 상세390 보완/전체 재시험·원본 폰트·Unity 전체·사용자 승인은 별도입니다. 현재 시한11/17 08:00 KST·주간73/90 및 기존 ui 30분 ACTIVE는 본체 전달 운영 상태이며 이 문서가 새 예약을 시작한 것은 아닙니다.

## 로비 제작 표준

표준판 2026-11-16.10 · 제안(검수 대기). 다른 AI도 이 절을 단일 현재 절차로 읽고 같은 패턴을 사용합니다. 최신 직접 지시와 실제 확인 범위가 우선하며 아래 .9 이하의 “현재/진행 중” 표현은 당시 이력입니다. 같은 선상에서 같은 역할을 하는 메뉴는 공통 규격으로 만들고, 그 규격을 원본 관찰값과 구분합니다. 문서·시험 수·자원 수는 제작 완성률이 아니며 W/P/U/S는 0/4, 사용자 명시 UI 컨펌·승인 freeze는 없습니다.

|순서|공통 제작 원칙과 남길 값|현재 적용 경계|
|---|---|---|
|1. 원본·범위|실제 workspace/설계 ID·revision·원본 파일/hash·크기·최신 지시·백업을 확인합니다. 기존 551×984와 10장 첨부 중 5번 main 709×1269는 서로 다른 원본입니다.|계절·버전·수량이 다른 첨부를 한 시점 게임 데이터로 합치지 않습니다.|
|2. 측정·좌표|원본 px, 화면 W/H%, 부모 기준 논리 px, 부모 %를 나눕니다. 아트 가시 bbox·알파·입력 wrapper·부모 경계와 가려진 부분을 기록합니다.|관찰 25개/전체 67개 박스는 원본 측정 자료이며 제작 규격/실제 폰트 설정이 아닙니다.|
|3. 계층·이름|Page_Board의 전체 화면 Slot_3D 아래 새 2D Img_BoardBackdrop을 두고 HUD/GO/메뉴는 별도 상위 UI로 둡니다. 부모 Btn/Group 아래 BG/Frame/Img/Txt/Input/Badge를 분리합니다.|Slot_3D는 장면 연결 자리, 현재 공원 그림은 최신 직접 요청에 따른 2D 콘셉트 시안입니다. 실제 3D 엔진이 아닙니다.|
|4. 그림·자원|원형 사진은 정확한 정사각 region, 일반 그림은 원 비율을 유지합니다. 파일 canvas·region·실제 alpha 실루엣·아트 box·hit rect를 구분합니다. 흰/투명 여백과 잡티를 확인하고 UI cast shadow를 그림에 굽지 않습니다.|PNG 원본 보존, 등록용 WebP는 300000bytes 이하·sourceSize·압축 방식·hash·제작/등록 사본을 기록합니다. 물체 자체 음영과 UI 그림자 효과는 다릅니다.|
|5. 가변 프레임·paint|기존 3/9slice를 사용하며 source slice·화면 edges·content padding을 분리합니다. custom BG/Frame은 각자의 source, 알파 중앙 위에 tone 판을 덧칠하지 않습니다. 형제 순서를 실제 DOM paint 순서에 반영합니다.|상단 128×64/slice27/edge27/padding0/min54×54. 하단 body edge16·게이지18·crown은 고정 장식. 통째 화면 늘림을 9slice로 세지 않습니다.|
|6. 같은 역할 규격|하단 4메뉴는 아래 공통 표를 사용합니다. 동일 슬롯+contain으로 원그림 비율을 유지하고 이미지/텍스트/알림을 따로 편집합니다.|공통 규격은 이번 제작 규칙이며 원본의 모든 가시 그림 크기가 같다는 뜻은 아닙니다. 실제 조립·저장/재열기는 본체 진행 중입니다.|
|7. 텍스트·동적 값|name은 Txt_<영역>_<역할>_<용도>, id/parentId는 보존합니다. 화면 문구·name·동적 binding key는 별개입니다. 글자 크기는 논리 px입니다.|원본 font-family/size/weight/line-height 미확인. 배지의 진짜 자식 텍스트 폼 분리는 아직 미구현입니다.|
|8. 알림·그림자|알림은 공통 notification count/dot·0숨김·최대값+/flat key 계약을 재사용합니다. 그림자는 element.effects.shadow로 독립하고 실제 조작 때만 저장합니다.|알림 엔진/속성은 구현·전용 시험 통과, 실제 4배지 조립/실화면은 진행 중. 그림자 Normal/Disabled 실제 확인, Pressed 실화면 미검수입니다.|
|9. 가이드·실제 편집|선별 고유 색·W/H 상시 표시·선 수치/드래그는 같은 ID의 실제 요소와 Undo로 이어집니다. line preferences는 편집 설정이며 디자인 색이 아닙니다.|W/H viewer 14개 전용 시험 통과·최신 실화면 진행 중. native 입력→Tab/blur→표시값 확인→저장→재열기를 구분합니다.|
|10. 진입·검수·기록|기본 주소와 명시 workspace/project 주소를 나누고 현재 검수본 메타를 확인합니다. CSS viewport·실제 캡처 크기·자동 시험·실화면을 분리합니다. 사용자 명시 컨펌 때만 방법/hash/revision/캡처를 고정합니다.|385 전체 시험·62 알림 전용·14 viewer·9 진입 회귀는 범위가 겹쳐 합산하지 않습니다. 10장 전체 화면·게임 연결·전체 반응형/Unity 호환은 완료가 아닙니다.|

### 좌표·이미지·얇은 선의 계산 기준

같은 좌표계로 변환한 screen rect=(sx,sy,sw,sh), parent=(px,py,pw,ph)에서 부모 논리 px는 (sx−px,sy−py,sw,sh), 부모 %는 (100×(sx−px)/pw,100×(sy−py)/ph,100×sw/pw,100×sh/ph)입니다. 원본 화면 %는 x/w를 W, y/h를 H로 나눕니다. 원본 551×984·설계 논리 크기·CSS viewport·확대율을 같은 값으로 가정하지 않습니다.

현재 상단 잘림 수정은 HUD 부모를 12px 내리고 SNS Frame의 전역 y를 10px로 만든 결과입니다. 예전 y=-2 사진 배치 제안은 최신 상단 잘림 보정을 대신하지 않습니다. source/ID/parent를 보존한 실제 도구 수정·저장/재열기 범위는 [상단 잘림 보고](../../../../docs/collaboration/reports/20261116_top-clipping.md)를 따릅니다.

원형 사진은 정사각 region을 지정하고 PNG를 파괴하지 않습니다. alpha >16/>128, 흰 바탕/투명 여백, 고립 잡티, contain의 종횡비 여백을 각각 확인합니다. cover 배경은 비율을 유지하며 일부를 자를 수 있습니다. has-appearance의 padding 6이 3px 요소를 최소 12px처럼 만들던 원인은 padding 0으로 보완했습니다. skin root도 padding 0을 유지하고 얇은 선·고정 edge·내용 여백을 별도로 검수합니다. 원본 slice/edge27은 양축 54 미만에서 코너 보존을 보장하지 않습니다. 자원 자체 alpha와 원본에 구워진 UI 그림자를 CSS 투명화가 제거해 주지는 않습니다.

### 하단 메뉴 공통 규격과 텍스트 name

|역할|부모 규격/배치(논리 px)|공통 규칙|
|---|---|---|
|네 버튼|80×92, 화면 x=0/88/384/471, y=888|승리·짓기·앨범·친구 순서, 좌2/중앙GO/우2 유지|
|아이콘|64×64, 부모 안 x8/y6|fit contain, 1254² 원 WebP 보존·서로 다른 region 비율 유지|
|텍스트|80×22, 부모 안 x0/y70|fontSize14·weight500·lineHeight18·가운데 정렬: 이번 공통 제작값이며 원본 폰트 확인값 아님|
|배지|28×28, 부모 안 x52/y0|부모 안에 완전히 포함. 이전 y=-4 제안은 폐기|

|메뉴|표시 문구|이번에 사용할 텍스트 name|
|---|---|---|
|승리|승리|Txt_BottomNav_Wins_Label|
|짓기|짓기|Txt_BottomNav_Build_Label|
|앨범|앨범|Txt_BottomNav_Album_Label|
|친구|친구|Txt_BottomNav_Friends_Label|

name을 위 규칙으로 맞춰도 기존 stable id·parentId·연결은 재발급하지 않습니다. 추가 예시는 Txt_HUD_Cash_Amount, Txt_Roll_Dice_Count입니다. Txt_Notification_Count는 배지 숫자 폼을 실제 자식으로 분리할 때 사용할 이름 예시이며 현재 구현 완료 이름이 아닙니다. 지금 공통 배지는 단일 badge panel의 span으로 숫자를 표시합니다. 실제 이름 적용·4메뉴 조립의 완료 여부는 본체의 저장/재열기 근거로 확인합니다.

### 공통 알림과 상태별 지원 경계

[notification.mjs](../notification.mjs)의 createNotification/validateNotification/formatNotification을 재사용합니다. optional element.notification은 enabled, mode=count|dot, 비음수 정수 value, hideZero, maxDisplay(1~999, 기본99), optional valueKey를 갖습니다. enabled=false는 전체 숨김, hideZero=true는 count/dot 모두 0에서 숨김, 100은 기본 max99에서 99+로 표시합니다. 누락 실행 키는 설계 기본값을 사용하고 잘못된 실행 값은 기존 표시를 보존하도록 거부합니다. 미설정 legacy 배지를 자동 변환하지 않습니다.

valueKey의 점은 중첩 객체 접근자가 아닙니다. 예를 들어 `consumer.updateState({'nav.buildCount':5})`의 실제 flat key를 참조합니다. `nav.buildCount`, 표시 문구 “짓기”, 텍스트 name은 서로 다른 값입니다. 시연 숫자/점은 게임 발란스·정책 확정값이 아닙니다. 일반 hover 배경색, 기존 skin 상태 textures, 일관된 Selectable/TargetGraphic·상태 아이콘 전환과 이번 샘플의 실제 적용을 같은 완료 범위로 보고하지 않습니다. 뒤 두 항목의 보완/검수는 남아 있습니다.

### 실제 입력·현재 검수본 진입·후속 계획

native 입력은 값을 바꾼 뒤 Tab/blur로 적용하고 화면의 재표시 값과 저장/재열기 값을 확인합니다. 자동 locator.fill만으로 값이 남지 않은 관찰을 곧바로 제품 버그로 단정하지 않습니다. 입력 이벤트·선택 ID·저장된 값·실행 탭의 모듈 판을 함께 대조합니다. 가이드 W/H는 상세 치수 토글과 별개로 선택 부품 바깥에 상시 표시하도록 구현했고, 논리 크기와 보기 확대율을 섞지 않습니다.

기본 `http://127.0.0.1:7018/ui-studio/`와 특정 workspace/project 주소는 서로 다른 진입입니다. [current-review.json](../../../../tools/ux-studio/current-review.json)은 bare entry에서만 현재 검수본을 지정하고 명시 workspace 또는 project가 있는 URL은 보존합니다. Grapes HTML의 고정 `?v` 모듈 진입은 immutable 캐시로 옛 소스가 남는 원인이 되어 제거했습니다. 진입 회귀 9개와 기본 7018 HTTP302 확인 범위, 7007 Browser 권한 차단은 별개입니다. LocalServerBrowser 앱 바이너리·전체 native cache·중복 서버 실행 버그는 미검수/미확정이며 임의 전체 cache 삭제나 서버 재실행으로 단정/해결하지 않습니다.

신규 전체 캔버스의 모바일 기기 선택·직접 W/H 입력, 기준 설계와 preview 분리, 비례 반응형 흐름은 다른 담당 구현 예정인 **계획**입니다. 현재 상세 편집의 logicalSize/기존 앵커 지원과 이 새 UX 전체를 혼동하지 않습니다. [10장 제작 계획](../../../../docs/plans/20261116-monopoly-ten-screens.md)의 화면·연결·닫기/Back·스크롤/포커스 복귀도 후속 실행 범위입니다. 특정 버전 명시 컨펌 전에는 승인 스냅샷을 만들지 않으며 컨펌 후 원문·KST·원본 hash·설계 revision·방법/설정·실제 캡처를 함께 보존합니다.

근거: [유닛 편집 실검수](../../../../docs/collaboration/reports/20261116_unit-guide-editing.md), [하단 공통규격 보고](../../../../docs/collaboration/reports/20261116_bottom-menu-standard.md), [공통규격 계획](../../../../docs/plans/20261116-bottom-menu-standard.md), [알림 구현/검수](../../../../_작업/codex/ux-studio/notification-report.md), [W/H 구현/검수](../../../../_작업/codex/ux-studio/guide-wh-report.md). 최신 상태/각 시험 범위는 [PROGRESS](PROGRESS.md)의 .10 절을 확인합니다.

## 이미지 실루엣·편집 선·검수 범위 추가 계약 · .9

2026-11-16 14:10 KST 본체의 확인 결과와 작업 원리를 추가합니다. 기존 .9 직접 편집·ID/부모·참조/Undo 계약은 유지합니다. 이 절은 제품 전체나 모노폴리 GO 동등 완성·승인 기록이 아닙니다.

이미지의 원본 PNG 파일, 표시 source region, 실제 alpha 실루엣, 배치 아트 box와 입력 wrapper는 서로 다른 경계입니다. 원본은 보존하고 region은 파일 내 표시 구간을 비파괴 참조합니다. alpha >16과 >128의 bbox를 비교해 흐린 외곽/그림자와 고립된 잡티, 주요 실루엣을 구분합니다. 한 임곗값의 최대 bbox를 본체 경계로 확정하지 않습니다. 원형 사진/자원은 원을 둘러싼 정사각 region과 바깥 알파를 유지합니다.

이번 source 551×984의 메뉴 가시 아트 [492,28,33,28]은 관찰값, 입력 wrapper [480,22,58,42]는 입력·배치 제안입니다. 사진의 96×96 아트 box·y=-2 상단 clip도 이번 배치 제안입니다. 전체 96px와 화면 안의 94px 높이를 구분합니다. 아트 box 변경이 입력 wrapper나 원본 PNG 크기까지 자동으로 같은 값으로 바뀐다는 뜻은 아닙니다.

contain의 표시 배율은 min(boxW/regionW, boxH/regionH)입니다. region과 box의 종횡비가 다르면 한 축에 여백이 남으므로 투명 여백 정리만으로 해결되지 않을 수 있습니다. anchor/부모 기준의 실제 배치도 따로 확인합니다. 미리보기는 entry 화면의 논리 크기 551×984를 우선 기준으로 삼고 다른 기기 프로필·CSS viewport·캔버스 확대율과 분리합니다. 같은 논리 좌표의 아트 box와 실제 가시 실루엣을 비교해야 합니다.

가이드 선은 각 고유 색으로 식별하고 오른쪽 picker에서 조절합니다. line preferences의 색·표시 상태는 편집기 보기 설정이며 디자인의 fill/stroke 색이 아닙니다. 선 위치/치수 수치와 실제 드래그는 같은 stable ID의 실제 선택 부품/리소스 표시 영역에 반영하고 Undo와 연결합니다. 화면 이동량은 확대율로 나눠 논리 이동량을 계산합니다. 이미지 빼기는 표시 참조만 해제하며 부품·원자원 파일·공유 참조를 보존하고 Undo로 되돌립니다.

본체 실화면 확인 범위: 상세 편집 가이드 오른쪽 선 100 적용→실제 이미지 폭 100→Undo 1회로 96 복원; 메뉴 AX 실제 드래그 화면 24px/확대 4배→논리 폭 33→39→Undo 1회로 33 복원; 이미지 빼기/Undo·프로젝트 경로 넣기 성공; 선 색 #6543ba 닫기/재열기 유지입니다. 이 문서 담당의 재실행 결과가 아닙니다. GrapesJS 가이드 Undo 검수는 보완 중이며 전체 W/P/U/S는 0/4입니다.

원본 폰트 실제 설정은 미확인이고 26px·700은 이번 시각 제안(검수 대기)입니다. 이전 353/353을 최신 기능 전체 시험으로 재사용하지 않으며 새 전체 시험 결과는 본체 실행 로그를 따릅니다. 사용자 피드백 PNG는 docs/reference 정리 예정이므로 임시 절대 경로를 여기에 고정하지 않습니다. 실제 정리 후 정식 경로·근거를 연결합니다. 특정 버전 명시 컨펌 없이 승인 스냅샷·freeze를 만들지 않습니다.

## 부품 디자인 가이드 직접 편집 계약 · .9

현재 사용자 정정의 요구·원리를 보존합니다. 직접 편집 구현과 실제 브라우저 검수는 대표 본체에서 진행 중이며, 이 절은 구현 완료·화면 통과·현재 UI 승인 기록이 아닙니다. 내장 문서 설명서(openManual)의 읽기 전용 HTML dialog와 실제 부품을 편집하는 디자인 가이드는 역할이 다릅니다.

디자인 가이드는 실제 UI 요소를 고치는 같은 문서의 편집 뷰입니다. 경계 선·위치·크기를 바꾸면 같은 screen/element stable ID를 가진 실제 요소에 적용하고 ID·parentId·기존 연결을 재생성하지 않습니다. 부모 %·논리 px·원본 px와 보기 확대율을 구분하며 rectTransform·inset·safeArea·자동 배치 계약을 유지합니다. 보조선만 움직이거나 내부 사본 값만 바뀐 결과는 수락하지 않습니다. 허용된 편집은 실제 문서 변경·undo/redo·dirty·현재 저장 경로에 연결하고, 선택·확대·선 표시·패널 폭 같은 보기 조작은 문서를 변경하지 않습니다.

이미지 넣기는 현재 workspace에서 검증한 자원을 선택 부품의 표시 참조에 연결합니다. 이미지 빼기는 그 참조만 해제하고 요소·부모·배치·다른 속성·원자원 파일·다른 요소의 참조를 보존합니다. 참조 변경도 undo/redo와 저장/재열기 계약을 따릅니다. 기존 PNG/JPEG/WebP·파일 크기·내용 해시·경로/소유 workspace 검증은 유지합니다.

선택 부품을 중심으로 실제 그림을 보여 주고 치수선·숫자는 외곽에 배치합니다. 모든 후손의 경계·치수 전체를 기본 화면에 중첩하지 않습니다. 하위 선 on/off로 필요한 경계를 비교하며 읽기용 오버레이와 편집 입력이 가로막지 않아야 합니다. 계층 행 전체 클릭은 해당 ID 선택, 펼침/접기는 독립 상태 변경입니다. 선택은 속성 패널·가이드와 동기화합니다. 레이어·중앙 캔버스·속성 세 영역의 두 경계는 폭을 조절할 수 있어야 하며 최소 영역·좁은 화면에서도 선택/입력을 유지합니다. 폭은 도구 보기 설정이며 설계 좌표·revision·dirty를 바꾸지 않습니다.

수락 시 동일 ID/부모 편집 반영, 유효 값과 지원 밖 제약, undo/redo, 이미지 연결/해제와 원파일·부품 보존, 파일 저장/재열기, 선택 동기화, 선택 중심·외곽 치수·하위 선 on/off, 세 영역 폭 경계를 실제 확인합니다. 현재 이 수락 검수는 완료로 기록하지 않습니다.

관찰 근거는 `_작업/codex/ux-studio/20261116-board-measurements/independent-measurements.json`과 `notes.md`입니다. 원본 551×984px의 상위 25개/전체 67개 박스는 원본 px·중심·W/H 비율을 담은 관찰 자료 수이며 설계 부품 수나 통과 수가 아닙니다. 잉크·실색 약 ±1px, 그림 외곽·가림 약 ±2px, 숨은 경계 미확인을 유지합니다. 글자 가시 bbox/높이를 실제 원본 font-family/size/weight/line-height로 확정하지 않습니다. x/w는 W=551, y/h는 H=984를 분모로 하고 부모 % 변환은 아래 .8 식을 따릅니다.

.8의 전체 화면 3D/별도 2D overlay·SNS 사진 슬롯·명시 컨펌 이후 승인 시점/제작 방법 기록과 프로젝트 .4 사본 보존을 유지합니다. 새 가이드 목록은 추가하지 않습니다.

## 목적
AI와 사람이 게임 UI를 화면·부품·입력·행동 데이터로 함께 작성하고, 같은 설계로 편집과 소비 확인을 이어갑니다. 사람이 화면에서 위치를 편집하고 AI는 식별자·부모·연결·원본 근거로 작업할 수 있어야 합니다. 최종 그래픽, 엔진 실행, 게임 저장 상태의 쓰기 책임은 이 도구만으로 해결되지 않습니다.

## 독립 도구와 검증 샘플
도구 정본은 /Users/max/projest_max/ui-studio/입니다. 소스·의존성·서버·가이드·기본 저장공간·보고를 이 루트에서 독립 관리합니다. 소스와 내장 안내는 src/tools/uxStudio/에 있습니다. 다른 프로젝트의 서버·node_modules·공유 기록은 도구 실행 조건이 아닙니다. samples/monopoly-go/는 검증용 샘플이며 전체 게임 구현을 뜻하지 않습니다. 이관 출처와 기존 외부 소비자 연결은 PROGRESS.md의 과거 이력에 보존합니다.

정식 진입은 http://127.0.0.1:7018/ui-studio/의 전체 캔버스이며 /ui-studio/canvas.html도 같은 캔버스입니다. 상세 편집은 /ui-studio/?editor=detail, 저장본 소비는 /ui-studio/preview.html입니다. 소스·공통 가이드 공개 URL은 /ui-studio/source/ 아래입니다. 프로젝트 종류·이름·실제 경로, 설계 이름·revision·미저장 상태를 표시하고 상세 편집 연결은 workspace·설계·화면·요소를 이어 전달합니다.

tools/ux-studio/mount.mjs로 이 루트 소스를 제공하고 save-plugin.mjs로 저장·폴더 API를 제공합니다. scripts/start.mjs는 이 루트 node_modules의 Vite 5.4.21과 정확한 의존성 묶음을 사용합니다. 기존 검증 설치의 11패키지(18,560,529bytes)를 자기 node_modules로 복사했고 외부 설치 fallback을 제거했습니다. 새 패키지 선정은 없으며 package-lock의 58 의존성에는 다른 플랫폼 선택 패키지가 포함됩니다. 자체 7018 기동·HTTP·독립 전환 당시 자동 시험 220/220을 확인했습니다. 실제 가이드·폴더 선택·저장·재열기·충돌·격리·미리보기·포커스·캔버스 단계 왕복의 자세한 검수 범위는 PROGRESS.md와 전환 보고를 따릅니다.

## 제작 단위
폴더 프로젝트(workspace): 사용자가 명시 선택한 게임 폴더와 그 ui-studio 보관영역.
설계 문서(document): 기존 형식의 projectId로 식별하는 화면·요소·연결 묶음.
화면(screen): page/modal/toast/sheet와 목적, 요소 목록.
요소(element): 고유 ID·이름·종류·부모·배치·역할·표시·입력·자원.
연결(transition): 출발 화면/요소, click, 조건, 행동, 대상과 전달값.
편집기 기준판 단계: W 와이어프레임 / P 프로토타입 / U 완성 UI.
대표 결과의 단계 종합검수: W/P/U/S 0/4. 기준판 저장과 별개이며 S의 세부 수락 기준을 임의 정의하지 않습니다.
revision: 문서 저장 버전. 제작 완성도와 다른 값입니다.

## 기존 편집·소비 계약
설계는 DOM/CSS로 표시합니다. 구조 보기와 게임 보기는 하나의 설계의 다른 표현입니다. game-ui 구성 전체 아래 시각 부품을 조립하고, 시각 선택과 입력 실행을 분리합니다. 프레임은 3/9슬라이스와 상태별 자원, 여백·고정 폭·반복 설정을 가집니다.

입력 역할은 action/parent/none/block입니다. 클릭은 입력 소유자를 찾아 한 행동을 실행합니다. 조건은 순서대로 판정하고 처음 참인 연결을 실행합니다. 미정 조건은 멈춥니다. 게임 모듈 바인딩은 요청 정의이며 실제 게임 실행 어댑터가 필요합니다. 콘텐츠 슬롯은 자리를 정의합니다.

schemaVersion 1/2/3 읽기와 기존 의미를 보존합니다. 새 응답형 배치를 실제 적용할 때만 schemaVersion 4로 올리며 열기만 해서 자동 변환하지 않습니다. 일반 요소 배치는 부모 기준 %, inset은 부모 기준 상·우·하·좌 px입니다. v4는 각 화면 logicalSize, safeArea, 화면 직속 useSafeArea, 축에 맞춘 2D rectTransform 고정/늘림 앵커를 공개 가져오기·저장·표시에 사용합니다. rectTransform과 inset은 함께 지정하지 않습니다.

v4 컨테이너의 layout.type은 horizontal/vertical/grid이며 문서의 직속 자식 순서·고정 itemSize·gap·padding·고정 columns를 사용합니다. 자동 배치 자식의 앵커·inset·safe area, 메뉴 컨테이너와 자동 배치를 혼합하지 않습니다. 구형 layout.direction은 보존하고 새 자동 배치로 활성화하지 않습니다. overflow는 visible/clip/scroll-x/scroll-y/scroll-both이며 같은 DOM 영역이 표시와 입력을 함께 자릅니다. 회전·3D·범용 엔진 LayoutGroup/Mask나 전체 Unity/Figma 동등 호환을 제공하지 않습니다.

control은 toggle/tabs/toggle-group/slider/scrollbar/dropdown/input을 지원합니다. 설계 기본값과 runtime 값을 분리하고 네이티브 입력으로 시험합니다. disabled/readonly·선택 항목·수치 범위와 step·문자 길이·필수/이메일/숫자 검사를 유지합니다. 컨트롤 scrollbar 값과 overflow 스크롤 영역은 별개입니다. 프레임은 normal/highlighted/pressed/selected/disabled 이미지 상태를 가집니다.

주요 검증 범위는 화면 1~60개, 화면당 요소 최대 400개, 연결 최대 4,000개입니다. 개별 래스터 파일은 300,000bytes 이하 PNG/JPEG/WebP, 설계 가져오기 파일은 2,000,000bytes 이하입니다. 저장 API도 문서 제한과 검증을 적용합니다. 원본 영역/프레임 이미지의 크기 검사는 최대 4096px 범위를 사용합니다. 이 수치를 성능이나 모든 기기 사용성의 보증으로 쓰지 않습니다.

## 자원·오버레이·연결 명세
새 래스터는 선택 workspace의 assets/에 sha256 내용 해시 이름으로 보존하며 assetRef로 연결합니다. PNG/JPEG/WebP의 MIME·파일 내용·원본 크기·해시·참조 존재와 workspace 경계를 검증합니다. 상위 경로와 심볼릭 링크는 거부합니다. 기존 data URI는 계속 읽으며 다른 workspace로 사본을 넣을 때 참조 자원을 함께 보존합니다. JSON 내보내기에는 파일을 동봉하지 않으므로 선택 ui-studio의 설계·assets를 함께 전달합니다. 공통 내장 자원은 같은 도구 설치본이 필요합니다.

오버레이 런타임은 blocking/dim·Escape·closePolicy·초점 차단/복귀·화면 ID별 자동 닫힘, toast queue/dedupe를 처리합니다. 문서 교체 시 타이머를 해제하고 이전 콜백이 새 문서에 영향을 주지 않게 합니다. 호스트 canClose는 동기 veto이며 확인창 자동 생성 기능은 아닙니다.

handoffMarkdown과 buildHandoff는 출처·설계/workspace·화면/부품/입력/배치/상태·조건/행동/목적지/payload/복귀 정책·모듈/슬롯·클릭 스토리보드를 Markdown/JSON으로 전달합니다. 원문은 데이터이며 새 AI 지시가 아닙니다. 구조 검사는 선언된 navigate/open 후보 경로이고 조건의 참/거짓·메뉴·겹침·실제 자원 존재·호스트 응답·실행 검수는 확인하지 않습니다. 엔진 어댑터나 게임 소스/저장파일은 생성·수정하지 않습니다.

## 정식 U 자원 제작·계층 이름 계약 · .8
사용자 직접 정정에 따라 screenshot crop은 관찰과 임시 W 배치 참고로만 씁니다. 정식 U는 비슷한 콘셉트로 새로 그린 자원으로 제작합니다. 스크린샷을 잘라 부품으로 재조립한 결과를 정식 U 자원으로 등록하지 않습니다. 필요한 바·판·버튼 바탕은 불투명하게 그리고, 부품 바깥 여백은 알파로 처리합니다. 의도한 반투명은 별도 기록합니다. 그림에 동적 글자·숫자·입력을 합치지 않고 Txt·Input·Btn의 표시/입력과 분리합니다. 최종 그림과 실제 입력 영역은 각각 확인합니다.

다음은 이번 샘플에 적용할 제안(검수 대기) 이름 규칙입니다. 표시 이름은 영문 ASCII·숫자·밑줄로 역할과 의미를 구분하며 예시의 대소문자를 유지합니다. 기본 역할 접두어는 Page / Modal / HUD / Group / BG / Frame / Img / Txt / Btn / Input / Badge입니다. 기능 구성에는 예시의 Currency_Cash·Shield_Group처럼 기능을 드러내는 이름을 사용합니다. 자식에 조상 이름 전체를 반복하지 않습니다. 같은 부모의 같은 역할은 의미나 01·02 순번으로 구분합니다.

```text
Page_Friends
└─ HUD_Top
   ├─ BG_TopBar
   ├─ Frame_TopBar
   ├─ Currency_Cash
   │  ├─ Img_Cash
   │  └─ Txt_Amount
   ├─ Shield_Group
   │  ├─ Img_Shield01
   │  ├─ Img_Shield02
   │  ├─ Img_Shield03
   │  └─ Img_Shield04
   ├─ Btn_Menu
   │  ├─ Img_Menu
   │  └─ Badge_Notification
   └─ Img_SNSAvatar
```

표시 name은 사람이 읽는 이름이고 stable ID인 screen.id·element.id와 다릅니다. parentId가 부모·자식 관계의 정본입니다. 이름에서 부모를 추측하거나 이름 변경으로 ID·parentId·연결의 fromElement/targetScreen을 재생성하지 않습니다. 자원 이름이나 파일 경로에도 안정 식별자를 대신 맡기지 않습니다. 이름 변경 후 기존 선택·클릭·이동 연결을 유지합니다.

3D 구간은 Page_Board → Slot_3D를 화면 기준 x/y/w/h=0/0/100/100%의 전체 화면 최하층으로 둡니다. 내용은 빈 “3D 영역” 표시만 유지하고 3D 그림·캡처·가짜 보드를 넣지 않습니다. 입력 없음·엔진 미연결 상태입니다. 화면 중앙 13~97% 같은 일부 박스를 3D 영역 전체로 취급하는 이전 해석은 폐기합니다. 상단 HUD·우측 이벤트·하단 GO 버튼·재화 게이지·BottomNav는 Slot_3D 자식이 아닌 Page_Board의 별도 2D 상위 형제로 겹쳐 표시합니다. 2D UI의 화면 점유 때문에 3D 영역을 잘라 줄이지 않습니다. 이 계층은 제안이며 실제 엔진 연결 완료를 뜻하지 않습니다.

```text
Page_Board
├─ Slot_3D             x=0%, y=0%, w=100%, h=100% · 최하층
├─ HUD_Top             2D overlay
│  └─ Img_SNSAvatar    왼쪽 SNS 사진 데이터 슬롯
├─ Group_EventsRight   2D overlay · 우측 이벤트
├─ Btn_GO              2D overlay · 하단 GO
├─ HUD_ResourceGauge   2D overlay · 재화 게이지
└─ BottomNav           2D overlay · 하단 메뉴
```

위 컨테이너 이름은 역할 예시이며 실제 ID를 재발급하는 지시가 아닙니다. 왼쪽 이미지는 Img_SNSAvatar SNS 사진 데이터 슬롯입니다. 새 주사위 그림이나 새 캐릭터 그림을 그려 대체하지 않습니다. 실제 사진 공급·원본 설정이 없으면 미확인으로 남깁니다. 표시 이름을 고쳐도 stable ID와 기존 연결을 보존합니다.

리소스의 사람이 읽는 파일명은 `<scope>_<component>_<role>_<state>_vNNN.ext`입니다. 예: `common_hud-top_bar-bg_normal_v001.png`. 영문 ASCII 소문자와 숫자를 쓰고 필드 구분은 밑줄, 필드 안 복합 단어는 예시처럼 하이픈을 씁니다. scope는 공통/화면 범위, component는 담당 구성, role은 그림 역할입니다. state는 normal/highlighted/pressed/selected/disabled 중 실제 제작한 상태만 기록합니다. 존재하지 않는 상태를 완료로 채우지 않습니다. 수정판은 v001·v002처럼 올리고 원본을 보존합니다.

선택프로젝트/ui-studio/assets/ 아래에서 제작 원본은 `authoring/<component>/v001/`, 도구에 넣을 가공본은 `production/<component>/`에 보관합니다. 현재 도구 등록 풀은 assets 루트의 `sha256-<내용해시>.png|jpg|webp`를 그대로 사용합니다. humanname을 등록 풀의 파일명으로 강제하거나 해시 파일을 손으로 이름 바꾸지 않습니다. 제작 원본에 레이어/프롬프트/참조/원본 그림을 보존하고 정식 가공본은 현재 PNG/JPEG/WebP·300,000bytes·4096px 계약에 맞춥니다. 이 폴더 구성은 제작 규칙이며 새 자동 분류·내보내기 기능을 뜻하지 않습니다.

`assets/resource-manifest.json`에서 humanname, 적용할 screen/element stable ID, 관찰 원본·출처, 새로 그린 제작 방식, 불투명 바탕/외곽 알파 정책, 실제 너비·높이, 제작판, authoring/production 경로, 등록 assetRef/내용 해시, 미확인 항목을 연결합니다. 아직 등록하지 않은 hash나 검수하지 않은 상태는 비워 두거나 미확인으로 기록합니다. manifest는 제작·추적 자료이며 현행 설계 스키마나 자동 로더를 추가하는 계약이 아닙니다. 실제 생성·등록·저장 재열기와 화면 확인이 있어야 반영 사실을 보고합니다.

## 원본 비율 측정과 명시 컨펌 기록 · .8
대표 본체가 실측 중인 새 첨부의 기준은 551×984px입니다. 문서 예시에 실제 측정값을 창작하지 않습니다. 원본 파일·hash·전체 화면 경계와 crop 여부를 확인하고, 영역의 x/y/w/h, 그림의 가시 bbox와 중심, 아이콘 높이·간격·세로 정렬, 글자의 가시 bbox·기준선·배치를 기록합니다. 투명 여백을 포함한 이미지 파일 크기와 실제 보이는 그림의 bbox는 나눕니다. 글자 가시 높이로 추정한 폰트와 확인된 원본 font-family/size/weight/line-height 설정도 나누며 원본 설정을 못 읽었으면 미확인으로 적습니다.

화면 비율은 x·w를 원본 W=551, y·h를 H=984로 나눠 각각 100을 곱합니다. 화면 %와 부모 %를 혼용하지 않습니다. 화면 기준 요소 rect=(sx,sy,sw,sh), 같은 기준의 부모 rect=(px,py,pw,ph)라면 부모 기준 %는 x=100×(sx−px)/pw, y=100×(sy−py)/ph, w=100×sw/pw, h=100×sh/ph입니다. 부모 크기는 양수여야 합니다. 측정표에 원본 px·화면 W/H%·부모%와 변환 기준을 함께 둡니다. 원본 캡처 px·설계 논리 px·CSS viewport·캔버스 확대율을 같은 값으로 취급하지 않습니다. 기기 종횡비·안전 영역 차이는 별도 검수합니다.

현중이 특정 화면/설계 버전을 명시적으로 컨펌한 후에만 그 시점의 승인 스냅샷 문서를 보존하고 기존 가이드의 승인 기록에 해당 방법·설정·스냅샷 경로를 덧붙입니다. 스냅샷에는 컨펌 원문·KST 시각·설계 ID/revision·원본 hash·비율 측정값·계층·리소스 판·제작 방법·설정·시험/실화면 근거·미확인·다음을 담습니다. 확인하지 못한 값은 미확인으로 유지합니다. 이전 승인 스냅샷과 시안을 덮어쓰지 않습니다. 일반적인 “계속”이나 현재 규칙 저장은 현재 UI 승인이 아닙니다. 이번 상태는 제안(검수 대기)이며 승인 스냅샷을 만들지 않았습니다.

이번 기본 캔버스 zoom +/−/Ctrl+wheel, 부모·자식 각각 선택/편집과 개별 유닛 디자인 가이드 뷰는 대표 본체·별도 담당 구현 중이며 실검수 대기입니다. redline A~J의 비율·간격·위치·글자 정보 표시와 세부 편집 진입도 이 대기 범위입니다. .8 문서 반영을 기능 완료나 실제 화면 통과로 쓰지 않습니다. 별도 새 기능 문서·가이드 목록은 추가하지 않습니다.

## 폴더별 보관 계약
아래는 저장과 격리 계약입니다. 실제 네이티브 폴더 선택·independent 결정·현재 설계 사본·저장·재열기·미저장 전환·409 충돌 후 수정 보존·두 폴더 왕복 격리와 프로젝트 .4 가이드 읽기를 확인했습니다. samples/folder-check는 이 계약의 저장 시험 fixture이며 게임 샘플이 아닙니다.

선택게임/ui-studio/
  project.json         폴더 ID·이름·가이드판·변환 선택·시각
  README.md            프로젝트 사용 진입점
  AGENTS.md            AI 진입점, 상위 지침 우선
  integration.md       기존 UI 조사·변환·연결 현황
  designs/             설계 JSON, backups/, baselines/
  assets/              독립 UI 자원
  guide/               공통 가이드 특정 판의 사본
  exports/             독립 출력

도구 전체를 게임마다 복제하지 않습니다. 기존 레거시 저장공간은 유지합니다. 폴더 열기는 루트 AGENTS·게임 소스·게임 저장파일을 바꾸지 않습니다. 기존 ui-studio는 형식을 검사해 재열고 문서와 가이드를 초기화하지 않습니다.

네이티브 macOS 폴더선택기를 통해 사용자가 경로를 고릅니다. 브라우저가 임의 절대경로를 저장 API에 보내는 기능은 만들지 않습니다. 기본 파일 쓰기는 선택게임/ui-studio 내부로 한정하고 심볼릭 링크·상위경로 탈출·형식 불일치를 거부합니다.

도구의 /ui-studio/ URL은 실행 입구입니다. workspace ID는 선택게임 저장공간을 구분하고 URL의 workspace 값과 저장·목록·기준판·소비 API에 이어집니다. 서버 전역 active 변수 하나로 여러 창의 대상을 공유하지 않습니다. 같은 설계 ID가 서로 다른 폴더에 있어도 충돌하지 않아야 합니다. 최근 문서와 BroadcastChannel도 폴더 범위를 나눕니다.

원자적 저장, expectedRevision 충돌 거부와 백업을 유지합니다. 미저장 전환은 저장 후 전환 / 수정 버리고 전환 / 취소를 선택합니다. 저장이나 전환 실패 시 현재 편집 내용을 보존합니다.

## 기존 UI 동의 계약
첫 폴더 열기에서 변환·연결 요청 / 독립 UI로 작업 / 취소를 먼저 묻습니다. 선택·시각을 project.json에 남깁니다. conversionDecision의 convert는 요청이며 conversionStatus=requested로 구분합니다. 이번 폴더 기능은 실제 게임 UI를 자동 변환하지 않습니다.

승인 후 AI의 범위는 기존 UI 전체입니다. 조사, 대응표, 변경 전 백업, 구조화, 연결 변경과 기존 동작 회귀 증거가 필요합니다. 거절하면 원래 게임을 건드리지 않고 선택게임/ui-studio 안 독립 UI 소스만 작성합니다. 폴더 열기는 동의가 아닙니다. 선택 변경은 사용자 명시 지시를 따릅니다.

## 내장 설명서 계약
공통 정본은 독립 도구 루트의 src/tools/uxStudio/guide/, 판은 index.json의 .10입니다. 실제 생성·읽기를 확인한 프로젝트 사본은 .4로 보존합니다. UI는 공통과 프로젝트 각각의 index 판을 표시합니다. 상단 가이드로 사용법·AI 규칙·툴 기획·제작 구조·기존 게임 처리·진척을 읽습니다. 선택 프로젝트 안내는 해당 ui-studio/guide의 사본을 읽습니다. 재열기 때 사본을 조용히 덮어쓰지 않습니다.

문서 설명서 가이드(openManual)는 읽기 전용 HTML dialog입니다. 문서는 textContent로 표시하고 외부 HTML이나 스크립트를 실행하지 않습니다. 닫기·Esc·포커스 복귀를 제공하며, 읽기 실패 시 원인을 알리고 다른 문서 선택과 닫기를 유지합니다.

## 문서와 작업 기록
root AGENTS.md가 우선 정본이고 docs/collaboration/README.md가 협업 진입점입니다. 진행은 docs/collaboration/STATUS.md에 append하고 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md에 모읍니다. 기존 상세 보고 docs/reports/20261116-project-workspaces.md는 보존합니다.

## 범위 밖과 검수
기존 ux-gjs-61ad2d1f r14는 원본으로 보존했습니다. 실제 검수 설계는 ux-902404d6 r4, 3개 page·1개 modal·24개 부품·6개 연결입니다. W/P/U/S 단계 종합검수는 0/4입니다. 이번 계획 도구 기능은 구현했고 그래픽·전체 샘플·실제 게임 연결은 미완료입니다. 본게임 로직 작업은 병행할 수 있습니다. 지원 범위 밖 기능을 새 선행 조건으로 추가하지 않습니다. 문서·폴더 생성이나 저장 버전 증가를 단계 통과로 계산하지 않습니다.

자동 기존게임 변환, 엔진/3D 실행, 게임 저장파일 쓰기, 최종 게임 스킨, Unity prefab 출력, 전체 엔진/Figma 호환과 모든 샘플 완성은 제공하지 않습니다. 이번 계획 도구 단위 다음에는 추가 선행 기능을 붙이지 않고 모노폴리 GO 정식 UI 제작으로 이어갑니다.

폴더 두 개의 같은 문서 ID 격리, 한글 경로, 미저장 취소, 기존 파일 보존, 충돌·백업·기준판·소비·재열기, 공통/프로젝트 안내와 실패 복구를 검수합니다. 실제 실행 여부와 남은 미확인은 작업 보고로 구분합니다.

## 가변 3·9프레임과 독립 그림자 추가 계약 · .9 · 2026-11-16 14:36 KST

박스는 기존 3·9슬라이스 엔진 계약을 재사용합니다. 임의 SVG 판이나 가로 전체 이미지의 통째 확대를 9슬라이스 완료로 보지 않습니다. source slice는 원본 이미지에서 나누는 px, fixed edge는 화면의 논리 고정폭, content padding은 내부 내용 여백입니다. actual resource alpha는 실제 보이는 실루엣이고 hit rect는 입력 영역입니다. 이 다섯 값을 서로 대체하지 않습니다.

custom BG/Frame은 개별 source로 조립합니다. 상단 source 128×64의 slices/edges [27,27,27,27], padding [0,0,0,0]에서 source 중앙은 74×10으로 양수입니다. target의 양축 고정폭 합은 54이므로 너비 또는 높이 54 미만은 코너 보존 보장 범위 밖입니다. 높이 54에서는 target 중앙 높이가 0인 최소 경계입니다. custom-skin-image의 배경은 투명하게 유지해 코너/중앙의 알파를 tone 판이 덮지 않게 하고, 기본 내장 frame.svg의 기존 tone은 유지합니다.

그림자는 원 PNG에 굽지 않으며 element.effects.shadow와 DOM alpha drop-shadow의 독립 설정입니다. 기본 UI는 꺼짐이고 단순 열람은 설정을 저장하지 않습니다. 실제 조작 때만 문서 변경/Undo/저장에 연결합니다. pressed/disabled 필터와 합성하고 원본 픽셀·배치·outline·입력 경계는 바꾸지 않습니다. 배경 투명 CSS만으로 이미지 안의 기존 그림자가 제거되지는 않습니다.

본체가 실제 화면에서 확인해 전달한 범위는 Frame 300×80, 620×110, 461×54의 같은 source, border-image-width 27px, slice 27 fill, 투명 배경 computed 값 유지입니다. 이는 전체 엔진 호환·Unity 동등성의 증거가 아닙니다. 원본 폰트 설정·Unity 버전/실제 임포트는 미확인입니다. padding 6 상태에서 3px 선이 12px로 커져 보인 사례는 source 선 두께·고정폭·내용 여백·CSS box의 혼용을 점검할 재발 방지 항목이며 실제 CSS 추가 검수가 필요합니다. root padding 0을 보존합니다.

v005 하단 자원은 늘어나는 9body와 고정 crown의 별도 조합입니다. crown은 고정 장식이며 전체를 늘림 9이미지로 등록하지 않습니다. 근거는 `_작업/codex/ux-studio/board-ui-resources-v005.json`과 `_작업/codex/ux-studio/hud-top-9slice-v004-report.md`입니다. 본체의 하단 조립/실검수는 현재 미완료, 전체 W/P/U/S는 0/4이며 사용자 승인·freeze는 없습니다. 기존 .9 내용은 보존합니다. 편집 순서는 USER_GUIDE.md 마지막 한 페이지를 따릅니다.


## 2026-11-16 AI for UI 검토 방법 편입 — 제안(검수 대기)
현중의 “작업에 적용할 수 있는지 검토”, “할 수 있으면 기획에” 지시에 따라 [공식 스킬 모음](https://aiforui.dev/skills)의 learn-taste·break-ui·mobile-native·emil-design-eng와 애니메이션 성능/축소 검토를 기존 제작 절차에 편입한다. 상세 정본은 독립 루트 `docs/plans/20261116-ai-for-ui-adoption.md`이다. 설치·엔진 대체·런타임 패키지 추가는 하지 않았다.

- 수정 노하우는 **현중 원문→부품 종류→규칙/수치→사용자가 제시한 이유→증거→제안/승인 상태**로 기록한다. 이유를 추측해 확정하지 않고 기존 같은 규칙을 보강한다. 컴폼 전 시안을 승인판으로 부르지 않는다.
- 배지0/1/99/100이상·긴 다국어 이름·이미지 누락·빈 목록/1개 항목은 실제 fixture/입력 경계로 시험한다. 모양을 임의로 망가뜨려 실패를 연출하지 않는다. 개발 시험 경로와 제품 흐름을 구분한다.
- 모바일은 hover/터치 capability·누름/취소·safe-area·실제 화면 높이·스크롤/입력 키보드를 확인한다. 기기 미리보기와 실제 폰 검수는 별개다. 접근성 확대를 막지 않는다.
- 버튼·메뉴·모달은 필요한 피드백만 둔다. 상태 이미지와 기본 색 변화, disabled 차단, blur/cancel 정상 복귀를 각각 확인한다. 반복 편집에 불필요한 지연을 넣지 않고 원본에 없는 모션 수치를 확정하지 않는다.
- 모션의 redraw/transform/opacity·reduced-motion을 검토하되 미측정60fps를 주장하지 않는다. 게임 아트/비율/9slice/구조/연결의 기존 표준을 이 스킬로 대체하지 않는다.

## 짓기 화면 실제 조립 recipe · r43 · .12

제안(검수 대기). 본체 actual UI 조립/저장 결과는 ux-gjs-0d80d7fe r43·2페이지141부품·2연결(Build78+기존Main63)입니다. 문서 담당은 r43 저장 정본을 읽고 기존Main을 r24 백업과 deep equality 대조해 동일함을 확인했습니다. **본체의 실제 도구 조립과 이 문서 담당의 읽기 검증은 다릅니다.** 외부 JSON 수정·fixture 생성만 한 일을 도구 직접 조립으로 기록하지 않습니다. 아래 값은 이번 제작 recipe이며 원본 폰트/게임 정책 확정값이 아닙니다.

|부품|현재 조립 recipe(551×984 논리 px)|보존/판정 경계|
|---|---|---|
|세 root|Slot_Build_Scene/HUD_Build_Top/HUD_Build_Bottom. Top551×80@(0,0) 상단 고정, Bottom551×272@(0,712) 하단 고정.|전체 도시2D 그림은 Slot 아래, UI는 별도. 기기 높이/편집zoom과 authored551×984를 구분.|
|같은 역할5카드|모두100×171, 화면x=6.5+109.75×n(n=0..4),y714, 공통 간격9.75.|[원본/입력표](../../../../_작업/codex/ux-studio/build-assembly-quick-sheet.md)의 관찰 환산w99.23/100.54,h170.56을 공통 제작값으로 정리. 원본 관찰과 동일 규격 제안/실제 적용을 구분.|
|BG/Frame·header|각각 source128×64·source slice27·화면 edge18·padding0의 기존 native9slice. 카드 header92×28@(4,4).|source slice와 화면 edge를 같은 수로 강제하지 않음. 카드edge18은 이번 제작값이며 원본측정값이 아님.|
|점/그림|3점12²,x30/44/58,y10. 랜드마크88×100@(6,34), 개별source 비율/contain. 카드4 점은blue.|그림을 같은 aspect로 늘리지 않고 alpha crop/master/내부 픽셀 보존. 점의 게임 단계 의미는 미확인.|
|가격/완료|카드1/2/3/5 Cash28×20@(6,141)+native price58×28@(36,136), font24/700/line28,240/312/384/528. 카드4는 둘 대신 새check28×22@(36,140).|quicksheet의 앞선check32×28 제안 대신 현재 실제28×22를 사용. 가격0을 창작하지 않음.|
|상단/하단 text|상단SNS·방패 없음, 별0/현금4,404/집0/메뉴+점. 숫자26/700/line30. Footer native “NEW YORK CITY 3/15”(24/700/28)+×Back44².|원본01의 구조를 따르며 메인 SNS형 복제로 끝내지 않음. 문구/name/ID/runtime key 분리. Back은 이전 화면 동작.|
|버튼/그림자|7버튼 tint:5카드+메뉴는 실제 이미지 자식, Back은self. 5개 카드BG의 engine shadow x0/y3/blur4/opacity.25, topBG x0/y2/blur3/opacity.25, black.|실제 저장 설정이며 모든 상태 시각검수/게임기능 완료는 아님. 그림자는 runtime 독립 효과, 원 PNG에 UI cast shadow를 굽지 않음.|

실제 조립 순서는 **설계 기준 보기→부품1개 완성→복사/복제→같은 부모/논리 rect 재확인→5개 규격/이름 정리→부모 그룹/anchor→연결·저장/재열기**입니다. [도구 최소 경로](../../../../_작업/codex/ux-studio/build-tool-workflow.md)의 source 관찰을 actual 확인과 구분해 사용합니다. 복사/복제 root는 원 부모에서 이탈하고 transform/inset/safeArea가 해제될 수 있으며 붙여넣기의 위치 offset도 생깁니다. 출발/도착 모두 원설계551×984 보기에서 작업하고 root의 parent/rectTransform/논리rect를 다시 맞춥니다. 자식 %만 같다는 이유로 실제 배치가 같다고 가정하지 않습니다. 원래 nav 연결/알림 후손을 가져왔다면 새 용도와 무관한 항목을 정리하고 원 메인은 보존합니다.

native 숫자 필드는 **AX로 현재 선택 확인→숫자 입력→Tab/blur→재표시→저장값/재열기**로 검증합니다. 이번 실제 작업에서 input.fill 단독 숫자가 남지 않는 경우를 확인했지만 제품 버그로 단정하지 않습니다. checkbox/속성 재렌더 뒤에는 현재 선택 ID와 새 노드를 다시 찾습니다. 다중 그룹은 modifier click으로2개 이상 선택되었는지 확인한 뒤 실행하고 새 group UUID/자식 parent를 확인합니다. 단일 선택으로 그룹 실패 시 이전 선택 ID가 유지되었다는 관찰을 그룹 생성 성공으로 바꾸어 쓰지 않습니다.

소스 보완 뒤 디스크 파일/HTTP 응답만으로 실행 창이 최신이라고 가정하지 않습니다. 본체는 실제 실행 모듈 reload를 확인한 뒤 UI 조립을 계속했습니다. 이 문서 단위는 source/HMR/UI/설계 파일을 바꾸지 않았습니다. 연결은 main→Build navigate와 Build→Back의2개이며 본체는 실제 왕복 및r42 저장/재열기를 확인했습니다. r43 최종 화면 검수는 진행 중이고 preview 바깥 scroll 잘림은 별도 최소 수정 중입니다. r42 증거를 r43 최종 통과로 바꾸지 않습니다.

근거: [10화면 조립 명세](../../../../docs/plans/20261116-ten-screen-assembly.md), [도시](../../../../_작업/codex/ux-studio/build-city-assets.json)/[5랜드마크](../../../../_작업/codex/ux-studio/build-landmark-assets.json)/[상단 별·집](../../../../_작업/codex/ux-studio/build-hud-assets.json)/[완료check](../../../../_작업/codex/ux-studio/build-complete-check-assets.json) 자원 기록과 본체 actual 전달. 10원본/132계층/43항목은 명세 수이며 실제10화면 조립이 아닙니다. 건설 차감/단계 판정·Build 메뉴 목적지·게임 기능은 미연결/미확인, 원본 폰트/Unity 전체·승인은 미완료이며 W/P/U/S0/4입니다. 공통판.11·기존본문·프로젝트.4와 과거 증거를 보존합니다.


### .12 recipe 후속 실제 검수 · 19:07 KST
recipe작성 당시 pending이었던 r43을 본체가 실제 재열어 main→Build→Back, 카드가이드 W100/H171, 전체canvas1440/430 가로넘침0, 독립preview430×843 상·카드·닫기 동시표시/scroll0·이미지실패0을 확인했습니다. 기본 화면 겹침도 앞 표시폭+60px로 보완해 X24/635와 기기별복귀를 확인했습니다. 최종 전체431/431·실패0입니다. 옛 stage media호환과 원본폰트/게임동등성/사용자승인은 미확인·미완료이며 최신 PROGRESS와 보고를 우선합니다.


## 승리 화면 조립 추가 기록 · .13 · r53 기준

작성자 codex(단이) · 2026-11-16 20:01 KST · 제안(검수 대기)

제안(검수 대기). 본체 actual UI 조립·저장 전달 기준은 ux-gjs-0d80d7fe r53입니다. 기존 Main63/Build78과 새 Modal_Wins_QuickWins를 유지하며, Main/Build의 최종 deep equality는 본체 확인 대기입니다. 아래 값은 원본02를 참고한 이번 제작값이며 원본 font-family·픽셀·게임 보상·장식 정확도를 확정한 값이 아닙니다. 후속 미세수정 revision은 본체 actual 저장/재읽기 보고를 따릅니다.

|부품|551×984 논리 px 조립 recipe|분리/경계|
|---|---|---|
|Clipboard BG/Frame|각 source128×96, native9slice slices[27,27,27,27]/edges[27,27,27,27]/padding[0,0,0,0], stretch.|종이 cream fill과 gold/white rim 별도 source. source 중앙74×42 양수, Frame 중앙 alpha0. 클립253×69는 고정 장식.|
|같은 미션3행|모두440×100, clipboard local X42.52/Y222.01+108×n(n=0..2). 베이지 BG source128×96/slices27/edges16/padding0.|각 행의 BG/아이콘/label/체크를 분리합니다. row 간격8px이며 glyph나 실제 입력 영역과 box를 섞지 않습니다.|
|미션 내부|아이콘48×48@(14,26); native label276×68@(72,16), font22/weight700/line28, wrap; 체크60×60 원+40×32 이미지.|위 rect는 각 행 기준입니다. 독립 icon contain·label 역할·원/체크를 같은 규격으로 반복합니다.|
|제목/시간/일수|제목46/900/line56, yellow #ffd238, stroke4.5px/#168fd4. 앞 문구22px, 남은 시간18px, 일수24px.|모두 native text. strokeWidth finite0~12와 strict #RRGGBB만 허용하고 미설정 필드 기본값을 문서에 만들지 않습니다.|
|주간 진행|BG #5f614c와 fill #23bedf 별도 native3slice source128×32, slices[0,16,0,16]/edges[0,18,0,18]/padding0/stretch.|상·우·하·좌 순서. source cap16→논리 edge18, target375.84×36.38 및64×36.38의 중앙 폭339.84/28 양수. 문자·테두리·외부 shadow 없음.|
|주간 그림|노란 패널/rays470×255 고정 이미지, 녹색/주황/노란 팩·주사위·보라 팩 개별 새 그림.|프레임·설명·일수·진행·입력과 분리합니다. footer는 기존 Build body9를 재사용하며 새 전체 판 이미지를 추가하지 않습니다.|
|화면 root/연결|Modal_Wins_QuickWins는 presentation.rootMode='fullscreen' 명시 opt-in. Main Wins→open/always, FooterClose→close/always.|v4 shared definition은 배후 page.logicalSize를 계승합니다. 기존 rootMode 무필드 window를 바꾸지 않습니다. dim/block/Escape 정책과 actual 검수 결과를 나눕니다.|

공통 조립 순서는 **원본/현재 설계 확인→부모/BG/Frame→미션1행 완성→복제 후 parent/논리rect 재설정→native text·개별 이미지→앞뒤 순서/역할→연결→저장·재읽기**입니다. 오래된 text를 새 parent로 옮겨 BG 뒤에 가려지는 실제 사례가 있었으므로 UI의 맨 앞으로 이동으로 paint 순서를 맞춥니다. text의 partRole=label을 명시해 기본 회색 백판을 제거합니다. duplicate root의 원부모 이탈·offset·transform 변경을 확인하고 수치를 실제 부모 기준으로 다시 입력합니다.

외곽선은 native typographyStyles의 webkitTextStrokeWidth/Color와 paintOrder='stroke fill'로 표시합니다. 글자를 그림에 굽지 않으며 그림자 효과는 기존 effects.shadow로 독립 관리합니다. 숫자/체크박스 조작은 현재 선택 확인→입력→Tab/blur→새 필드/재표시→저장값·재읽기로 확인합니다. name 규칙은 `Txt_<영역>_<역할>_<용도>`이며 stable id/parentId/연결·runtime key와 구분합니다.

**실행/저장 모듈의 판을 따로 확인합니다.** 본체 actual에서 Node 저장 플러그인의 정적 모듈이 새 stroke validator를 캐시해 저장 오류가 발생했습니다. Undo2로 stroke 변경 전 r47 우선 저장→이미 허용된 자기 소유7018 재시작→stroke 포함 r48 실제 저장 성공을 확인했습니다. 이 기록은 모든 서버 재시작 허용이 아닙니다. 현재 승인·프로세스 소유를 확인하고 7007은 관리하지 않습니다. 브라우저 HMR·HTTP 최신 응답만으로 저장 서버 validator가 갱신됐다고 가정하지 않습니다.

출처/원본·압축·해시·조립 계약은 [wins-ui-assets.json](../../../../_작업/codex/ux-studio/wins-ui-assets.json)과 [wins-icon-assets.json](../../../../_작업/codex/ux-studio/wins-icon-assets.json)입니다. 기존 PNG/SVG 정본·그림 버전·currentAssetOverrides를 보존하고 실제 저장 자원 참조와 대조합니다. [10화면 조립 명세](../../../../docs/plans/20261116-ten-screen-assembly.md)의 관찰/제안 구분도 유지합니다.

본체는 standalone 로비→Wins 진입, r53 저장 재읽기, 제목/시간/아이콘 분리 표시를 확인했습니다. 문서 담당은 fresh [npm test 로그](../../../../_작업/codex/ux-studio/wins-screen-final-tests.log)447/447·실패0을 직접 읽었으며 시험·actual UI를 재실행하지 않았습니다. 모바일430·키보드·입력 차단·포커스 복귀와 Main/Build 최종 대조는 본체 진행 중으로 후속 보고를 참조합니다. 원본 폰트/픽셀/보상/장식 정확도·7007/LSB 미검수, 10장 최종 동등0/10·W/P/U/S0/4·승인 없음입니다. 판별 원문 컨펌과 실제 캡처 확인 뒤에만 고정합니다.
