## .29 · 입체 버튼 제작 방식 현중 컨펌
현중: “확인했어..이젠 되었고 이제 입체 버튼 나오면 이런 계념으로 만들어야 돼.. 그럼 계속 남은 페이지들 있으면 제작해”. 이번 컨펌은 r300에서 확인한 입체 버튼 제작 방식(같은 기준면·카메라·소실점, 먼 쪽 단축, 기본/눌림 별도 입체 그림, 고정 밑면과 작은 눌림, native 텍스트 분리와 엔진 외부 그림자)에 대한 승인입니다. 새 입체 버튼은 이 방법을 준수합니다. 예제의2px·230×220·카메라 수치를 모든 버튼의 공통 상수로 강제하거나 원본 전체 서체/재질·모든 화면 동등까지 승인됐다고 확대하지 않습니다. 컨펌 원문·r300 설계/캡처/자원SHA는 docs/reference/monopoly-go/two-point-20261117/approval-r300.json에 고정했습니다. 기존 실패판/가이드 이력은 보존합니다.

## 최신 .28 · 사용자 눈높이/소실점 참고를 실제2점투시에 적용
현중: “위쪽이 짧아져야지…원근인데…버튼이 너무 크게 눌려…살짝만”, “이런걸 참조하라는 거야”와 눈높이선/1·2·3점투시 참고2장.
일반 이론 설명에 그치지 않고 같은 카메라에서 실제 점들을 투영했습니다. 아래의 수치는 둥글리기 전 제작용 기준 사각형의 값이며 원본 카메라/원본 눌림 측정값이나 사용자 확정 숫자가 아닙니다.
현재r300/12화면940부품20연결. FullStateGraphic은 고정하고 Content그룹만2논리px 이동합니다. 기본/눌림 원화는 같은3D원형·시점·밑면에서 계산한 별도 전체입체 그림입니다. 실제mouse3초/Space3초의 상태교환/복원,390/430비율/이미지로딩을 확인했습니다. 원본GO서체/세부재질/원본동등·실게임·최종승인은 미완료입니다.
[실제 소실점/확대 도면·두 상태와 native결과](reference/two-point-button-20261117/index.html)를 보세요. 이전 생성3원화는 계속 실패보존본입니다. 이번source새패키지/3D런타임/제품코드변경0, 계산된벡터→PNG/WebP자원과native편집만 사용했습니다.

## 최신 .27 · 입체 버튼 제작법 / 왜곡된 시안 반려
현중의 “원근법을 배워서…입체 버튼 만드는 법을 가이드에” 요청에 따라 [입체 버튼 제작법](THREE_D_BUTTON_GUIDE.md)을 별도 정본으로 추가했습니다. 기준면·투영/소실점·같은 두께 축·베벨/광원·정상/눌림 원화·공통 상태 좌표·텍스트/엔진 분리·9슬라이스/반응형·검수 순서를 따릅니다.
새 원화3개도 찌그러짐/다른 기준점으로 반려된 실패 보존본이며 미등록·미적용입니다. 캔버스/바닥만 맞춰 억지로 통과시키지 않습니다. 그림 생성 전 단색 기초 도면에서 한 시점·한 물체의 비율/대응점을 먼저 검증합니다. r299/기존516시험은 원본 시각 합격이 아닙니다. 이번 제품 source/설계 변경0·7018only/기존uiPAUSED·제안(검수 대기).

## 최신 .26 · 입체 기본 그림과 별도 눌림 그림 제작 원칙
현중 원문: “이걸로 해야지”, “전혀 틀려보이는데”, “다시 분석”, “버튼 모양이 입체라는 거야..입체로 그리고 그게 눌린것도 그려야 되는거 아니냐는 거지”.
r299는 이전 제작/기능시험 기록이며 사용자에게 시각적으로 거절된 판입니다. 원본과 같거나 컨펌된 시안으로 재사용하지 않습니다. 현재 저장 설계는 r299 그대로이며, 새 원화는 아직 도구에 등록·적용하지 않았습니다.
기본 그림은 앞면·측면·안쪽 베벨·재질 명암을 갖춘 완전한 입체 버튼입니다. 눌림은 같은 버튼의 앞면이 내려앉고 보이는 측면 두께·접촉 명암이 달라진 별도 그림으로 만듭니다. 색만 어둡게 하거나 평면 한 장을 옮기는 효과로 대체하지 않습니다. 엔진은 상태 그림 전환·외부 투영·별도 텍스트 동기화를 담당합니다. 재질 측면은 외부 그림자가 아니므로 지우면 안 됩니다.
GO/자동 안내/화살표는 별도 텍스트 또는 부품으로 유지하고 버튼 그림에 굽지 않습니다. 입력 wrapper·배수·HUD 받침·외부 그림자는 분리합니다. 같은 상태족은 동일 캔버스/배율/가로 중심/바닥 기준점/텍스트 기준선을 공유합니다. 눌린 윗면 위의 투명 공간은 공통 상태 좌표에 필요한 여백이므로 상태마다 따로 잘라 재중앙정렬하지 않습니다.
최신707×387 첨부를 전체 UI 폭과 하단선으로 정렬해 비교했습니다. r299 앞면 가시폭254px 대 원본241px, GO 흰 글자 높이65px 대 원본79px로 차이가 있습니다. 원본 WINS는 주사위 두 개가 있는 세로 카드이며 체크표시 클립보드로 바꿀 수 없습니다. 같은 선상 메뉴의 공통 입력/정렬 규격과 개별 원화의 비율을 구분합니다. Unity 실제 계층/원본 눌림 프레임은 미관찰이며, 새 눌림 그림은 제작 제안입니다.
내장 image_gen으로 normal_v001/pressed_v001/pressed_v002 투명 원화를 그렸습니다. 미등록 시안입니다. pressed_v001은 없는 트레이 외곽을 추가했고 기준점도 틀려 사용하지 않습니다. normal/pressed_v002는 원본 캔버스 높이1px·실제 바닥29px 차이가 남고 곡선/광택도 원본과 달라 후속 정합이 필요합니다. 생성 도구의 명령 성공을 완성/적용으로 쓰지 않습니다.
원화: samples/monopoly-go/ui-studio/assets/authoring/button-states/v001/ · 분석: docs/reference/monopoly-go/bottom-reanalysis-20261117/measurements.json · 보고: docs/collaboration/reports/20261117_1530_bottom_reanalysis.md.
이번 제품 source/저장 설계 변경0이며 상기516/516은 이전 단위 시험입니다. 이번에 재실행하거나 새 원화의 시각 합격으로 쓰지 않습니다. 실화면 업데이트/7007 업데이트0. W/P/U/S0/4·최종시각동등/사용자승인미완료,7018only/기존uiPAUSED·수동작업/타프로젝트보존.

## 최신 .25 · 하단 결합 구조와 실제 누름 · r299
현중의 '합치는 것도 원본을 다시 보고 연구' 정정에 따라 05_main(709×1269)과 확대 하단 원본을 다시 측정했습니다. 중앙 받침·배수 돌출부를 한 윤곽으로 만들고, 앞면/고정 몸체/엔진 외부 그림자를 나눴습니다. 아래 본문의 .24 및 r289는 과거 기록으로 보존합니다.
현재 ux-gjs-0d80d7fe r299 = 12화면941부품20연결(Main180). Main 외11화면/20연결/r289의 기존 Main175 ID는 보존했습니다. 추가5부품이며 시도 중 만든 중복 원형 받침2개는 native 삭제하고 과거판/자원은 보존했습니다.
실제 Space3초·마우스4초에서 앞면/글자5논리px 이동·고정 몸체·상태 그림 교환·해제 복원을 확인했습니다. 마우스 누락 원인은 Front 중간 그룹의 입력이 none이었던 것입니다. 이미지/글자→Front→버튼까지 매 단계 parent를 확인하세요. 스크린샷/AX 호출 성공만으로 누름 성공이라 하지 않습니다.
551→768 논리 너비 native 변경에서 중앙288×298/좌우176×120/메뉴80×92는 고정되고 중앙은 절반, 우측은 전체 증가폭만큼 이동했습니다. Undo 후 revision/savedAt 외 설계 내용은 동일합니다. 기기390/430은 별도로 비례·세로 앵커를 검수합니다.
원본의 GO 각진 서체/세부 광택·다른 버튼들에 대한 새 깊이 적용·원본 눌림 프레임 동등은 미완료입니다. 현재 눌림 거리/색은 제작 제안이며 원본 Unity 설정이 아닙니다. W/P/U/S0/4·원본 최종 동등 승인0/10을 유지합니다.
근거: docs/collaboration/reports/20261117_1424_button_depth_bottom.md, docs/evidence/20261117-button-depth-bottom/. 본체 최신 전체516/516·실패0와 관련33/33은 기능 회귀이지 시각 완성률이 아닙니다.
프로젝트 폴더는 현재/다른 프로젝트와 각 조사서 보기로 정리했습니다. 경로/작업 방식은 폴더 정보, 시험·사본·방식 전환은 추가 관리에 있습니다. 두 실제 폴더에 매칭한 정적 조사서이며 임의 workspace HTML viewer는 아닙니다. 2차 담당 결과를 읽고 통합 시험에 포함했으며 카피 설계/자원은 본체가 수정하지 않았습니다.
7018만 진행/7007 제외·프로젝트 guide.4/과거판 보존·기존 자동화 PAUSED·수동 작업·제안(검수 대기).

# UI 스튜디오 제작 구조

## 최신 .24 · 배후 UI 숨김 / 감옥·보석금 r289

독립 정본의 native 공통 연출은 '배후 화면에서 숨길 레이어'에서 기준 페이지의 화면직속 레이어를 선택합니다. '공통 설정에 적용'은 설계 변경이며 파일 저장은 별도입니다. 동작 연결이 없는 모달도 설정만 저장할 수 있어 임시 버튼/임시 edge를 만들 필요가 없습니다. 선택/연출 draft와 저장을 구분합니다.

presentation.hideBaseElements는 stable ID 배열(중복 없음/최대400)입니다. 활성 모달들의 합집합만 배후 페이지에 visibility:hidden으로 적용하며 DOM·컨트롤·스크롤은 보존합니다. 닫히면 남은 모달의 숨김만 유지하고 전부 닫히면 복원합니다. 다른 기준 페이지에 없는 ID는 효과가 없습니다. Main/특정 게임 이름을 엔진에 하드코딩하지 않습니다. Grapes 단독 모달 보드는 배후 페이지가 없으므로 이 옵션을 표현하지 않고 저장 계약을 보존합니다.

이번 실제 r289는12화면936부품20연결. 감옥18/보석금16의6화면직속 앵커를 고정하고,14개 기존 Main HUD/이벤트 루트만 선택했으며 Slot_3D는 유지했습니다. 상세 동작 시험 기기390×844/430×932의6루트 크기·높이·닫기 복원/이미지 오류를 확인합니다. 독립 runtime의 새 감옥 입구/게임 판정·횟수 감소·보석금 연결·원본 동등은 미완료입니다.

복사·붙여넣기는 선택 번들 최상위를 현재 좌표의 legacy %로 평탄화하고2% 오프셋을 줍니다(commands.mjs). 따라서 고정 앵커가 보존됐다고 가정하면 안 됩니다. 보석금 r286은 이 때문에 세로가 늘어났고, native6앵커 재입력 후r289에서 고쳤습니다. 내부 자식/부모/TargetGraphic 재매핑 보존과 최상위 반응형 계약을 별도 확인하세요. 가로폭만 맞아도 높이·모서리·하단 위치가 맞는 것은 아닙니다.

이번 기능 RED→관련29/29→새 전체509/509 통과. 기존 VM의 새 의존 주입/문서 immutable 교체 후 오래된 객체 참조, 새 fixture logicalSize 누락을 수정한 실패 기록도 보존했습니다. 자동시험은 시각 완성률이 아닙니다. 원본10화면/20연결 deep equality, 다른 프로젝트 guide.4·2차 설계/자원 무수정입니다.

현중이 추가로 버튼/그림자 정확성을 요청했습니다. 실제3초 마우스 누름에서 normal→hover→pressed 및 tint1→.949→.741을 확인했지만 앞면/글자 이동·상태별 그림자는 아직 없습니다. 감옥 버튼 부모와 이미지의 이중 그림자도 확인했습니다. 고정 입력 wrapper/림 + 앞면 그룹(이미지/글자/비용 동반 이동)의 선택적 계약을 2차 세션과 공유했으며 연구/구현/실검수 전 지원 완료라 쓰지 않습니다.

7018만 진행/7007 제외, 원본과 과거판 보존, 자동화ui PAUSED/수동 작업, W/P/U/S0/4·원본 최종 동등승인0/10·제안(검수 대기).

가이드 판: 2026-11-17.22 · 제안(검수 대기)

**현재 .22:** [공통 UI 규칙](COMMON_UI_RULES.md) · [프로젝트 토큰](COMMON_UI_TOKENS.json)을 먼저 읽습니다. 원칙은 사용자 승인, 수치·시안은 본체 제작 제안·검수 대기입니다. 같은 family의 공통 프로필을 우선하며 영상 안내·이전 본문·프로젝트 .4는 보존합니다.


**현재 모노폴리 .21:** [Racing09·Tycoon10 제작/검수](TOOL_SPEC.md#racing09-tycoon10-제작과-검수--21--r248)와 [최신 범위](PROGRESS.md#racing09-tycoon10-제작과-검수--21--r248)를 먼저 읽습니다. 본체 최종저장r248·10화면899부품/20연결, 현재작업7018만입니다. 공통.20이하·프로젝트guide.4와별도영상안내는보존합니다.

**현재 .20:** [Shop08 팝업 제작 절차](TOOL_SPEC.md#shop08-팝업-제작-절차--20--r184)와 [최신 검수 경계](PROGRESS.md#shop08-팝업-제작-절차--20--r184)를 먼저 읽습니다. r184의 실제 Main 배경·팝업 전환·연결·검수 기록을 우선하며 .19 이하와 프로젝트 guide .4는 보존합니다.

**현재 .19:** 문서끝Shop08 r170파일기준추가절을먼저읽습니다. 저장진척/파일준비와7018승인대기·실화면미검수를구분하며이전본문/프로젝트guide.4를보존합니다.

**현재 .18:** 문서 끝의 “Warehouse07 조립 기록 · .18 · r146 중간 기준”과 [제작값](TOOL_SPEC.md#warehouse07-조립-기록--18--r146-중간-기준)·[남은검수](PROGRESS.md#warehouse07-조립-기록--18--r146-중간-기준)를 먼저 읽습니다. 최종QA는본체후속append를우선하며.16/.17·프로젝트guide.4·이전본문은보존합니다.

**현재 .17:** 문서 끝의 “Menu06 제작 기록 · .17 · r107 기준”과 [제작값](TOOL_SPEC.md#menu06-제작-기록--17--r107-기준)·[검수경계](PROGRESS.md#menu06-제작-기록--17--r107-기준)를 먼저 읽습니다. 최종Menu06 actual은 본체 후속append를 우선하며 .16 Main05/이전본문·프로젝트guide.4는 보존합니다.
독립 정본 보정: 2026-11-16

**현재 .16:** 문서 끝의 “메인05 조립 기록 · .16 · r76 중간 기준”과 [제작값](TOOL_SPEC.md#메인05-조립-기록--16--r76-중간-기준)·[미완료 경계](PROGRESS.md#메인05-조립-기록--16--r76-중간-기준)를 먼저 읽습니다. 아래 .15 이하의 현재/완료 표현은 당시 이력입니다. 본체 후속 append가 중간값을 보정하며 프로젝트 guide .4는 보존합니다.

**현재 .15:** 문서 끝의 “친구 모달 실제 조립 추가 기록 · .15 · r72 기준”과 [제작값](TOOL_SPEC.md#친구-모달-실제-조립-추가-기록--15--r72-기준)·[검수 경계](PROGRESS.md#친구-모달-실제-조립-추가-기록--15--r72-기준)를 먼저 읽습니다. 아래 .14 이하의 최신/완료/다음 표현은 당시 이력이며 본체 후속 보고가 실제 검수를 보정합니다. 프로젝트 guide .4는 보존합니다.


**최신 .13:** 문서 끝의 “승리 화면 조립 추가 기록”과 [제작 recipe](TOOL_SPEC.md), [검수 경계](PROGRESS.md)의 .13을 먼저 읽습니다. 아래 .12 이하의 “최신/진행 중”은 해당 판의 이력입니다. 기존 프로젝트 guide .4는 보존합니다.

## 최신 안내 · .12 · r43

공통 정본은2026-11-16.12입니다. 실제 저장본 ux-gjs-0d80d7fe r43은 기존메인63+신규짓기78부품·2페이지·navigate/Back2개입니다. [진척 맨 위의 .12](PROGRESS.md)와 [툴 기획서 끝의 짓기 제작 recipe](TOOL_SPEC.md)를 우선합니다. 아래 .11/r24·미등록·수정 중 문구는 당시 이력이며 최신 완료/미완료를 대신하지 않습니다. W/P/U/S0/4·10장 최종동등검수0/10·사용자 승인 없음, 기존 프로젝트guide.4는 보존합니다.

## 최신 상태 바로보기 · .11 · r24

최신 저장판은 ux-gjs-0d80d7fe **r24·1페이지63부품·0연결**입니다. 세 배지 이미지 자식의 “Img_Notification_BG 복사”를 “Img_Notification_BG”로 정리해 저장했습니다. 아래 r21/수정 중/재시험 예정 문구는 당시 이력이며, 최신 사실과 지원 경계는 [PROGRESS 맨 위의 r24 마감 보정](PROGRESS.md)을 우선합니다. 공통판 .11·기존 본문·프로젝트 .4 사본은 유지합니다.

상세 rootSize/renderPreview는 공통 device 변환의 logical viewport와 deviceScale을 사용하고 dataset.zoom(편집 확대)과 dataset.scale(기기×확대)을 분리했습니다. main.mjs만 제품 수정한 [보완 기록](../../../../_작업/codex/ux-studio/detail-device-scale-report.md)을 따릅니다. standalone preview의 entry uniform fit을 상세/전체 캔버스의 profile 기반 높이 reflow와 혼동하지 않습니다.

## 최신 실제 구조와 보기 변환 · .11

[현재 표준](TOOL_SPEC.md)과 [진척](PROGRESS.md)의 .11을 우선하고 .10 이하 본문/AI for UI 추가절은 보존합니다. 본체 actual r21은1페이지63부품·0연결로, 제작 구조 검증과 실제 게임 연결을 구분합니다.

|책임|현재 구조/소스|실제 검수 경계|
|---|---|---|
|공통 메뉴|Btn_BottomNav_<역할> → Img_BottomNav_<역할>_Icon/Txt_BottomNav_<역할>_Label·Badge. 동일80×92/64²/80×22/28²와 안정ID 사용.|네 메뉴 실제 조립·별도 가이드 heading/W80H92 확인. 원본 폰트 미확인.|
|복합 알림|badge 부모 notification1개→[layout-view](../layout-view.mjs)가 직접 label 자식에 포맷값 전달, 자체 글자 비움. Img_Notification_BG/Txt_Notification_Count 별도.|Wins0숨김/Build5/Albumdot1/Friends4 actual. 자식 config 복제 없이 부모 hidden 상속, legacy panel 동작 보존.|
|버튼 효과|[button-state](../button-state.mjs)의 tint/image·self 또는 실제 이미지 후손 targetGraphic. transient hover/pressed는 view, 명시 선택은 runtime.|전용124 지원 시험. 네 메뉴 이미지 자식 tint 저장/normal→클릭 후 hover·나머지normal 실제 확인. image-mode 샘플/GO 미검수.|
|기기 비례|[canvas-device-preview](../canvas-device-preview.mjs): authored551×984 유지, scale=deviceW/551, 배치 논리H=deviceH/scale에서 %/앵커 재계산 후 전체 scale.|390×844→scale390/551·논리H1192.42, board389.997×843.987 실제 확인. custom414×896·방향 commit은 저장판r17 상태를 유지.|
|상하단 고정|HUD_Bottom551×280에 기존14root를 묶고 하단 anchor, HUDTop536×94@(9,12)는 상단 anchor.|네 메뉴/아이콘/텍스트/배지가390/551로 비례. 상세 편집390 root551 고정/넘침은 다른 경로의 발견 문제로 수정 중.|
|진입|bare7018→[current-review](../../../../tools/ux-studio/current-review.json)의0d80d7fe. 명시 workspace/project는 보존.|actual browser r21 진입 성공. 7007/LSB native 바이너리 검수 아님.|

버튼 tint/image 효과는 기존 shadow 필터와 합성하고 원본 PNG·아트 region·입력 bbox를 바꾸지 않습니다. 이미지 자식을 대상으로 정한 메뉴의 글자/배지까지 임의로 같은 색으로 칠하지 않습니다. 상태 미리보기/기기 보기/편집 zoom과 문서의 buttonState·논리 크기·저장 revision을 별개로 유지합니다.

가이드의 밝은 입력 바탕에 전역 어두운 테마 label/input 색이 상속되는 사례를 확인했습니다. 본체는 .ux-design-guide 범위 label #46566d, input/select/textarea #253247·white 배경으로 최소 CSS를 보완했고 후속 실화면/캡처는 예정입니다. 특정 필드의 가독성 원인을 source 값/disabled 처리/배경·상속 색으로 나눠 조사하고 전체 테마를 임의 교체하지 않습니다. 측정하지 않은 대비율 통과를 주장하지 않습니다.

[AI for UI](../../../../docs/plans/20261116-ai-for-ui-adoption.md)는 필요한 제작/검토 방법의 선택 편입이며 새 엔진/패키지/자동 설치가 아닙니다. 411 통합 시험은 상세390 보완 이전 이번 본체 실행, 이후 재실행 예정입니다. 10화면 명세/새 도시 그림 준비와 실제 조립/등록을 나누고 W/P/U/S0/4·승인 없음은 유지합니다.

## 로비 표준의 책임과 데이터 흐름 · .10

현재 제작 계약은 [TOOL_SPEC의 로비 제작 표준](TOOL_SPEC.md#로비-제작-표준), 현재 확인 범위는 [PROGRESS](PROGRESS.md)를 따릅니다. 아래 .9 이하 본문은 당시 구조/진척 이력입니다. 원본 관찰값·설계 값·편집기 보기 설정·실행값은 서로 다른 계층입니다.

|계층/책임|정본과 흐름|지원·검수 경계|
|---|---|---|
|원본·측정|원 PNG/hash/크기 → 관찰 px·화면 % → 부모 논리 px/%·설계 rect. alpha 실루엣·아트 box·입력 wrapper를 각각 유지합니다.|551×984 측정 25/67개는 관찰 자료이며 새 main 709×1269와 구분합니다. 원본 폰트 설정 미확인.|
|설계·선택·이름|stable screen/element id·parentId·기존 연결 → 편집 명령·검증 → Undo/dirty·저장 → 같은 설계를 재표시합니다. name은 `Txt_<영역>_<역할>_<용도>`이며 동적 binding key·화면 문구와 분리합니다.|name 변경이 ID/부모 재생성이나 연결 초기화로 이어지지 않아야 합니다. 네 메뉴 이름 적용/저장 검수는 진행 중.|
|장면과 UI 계층|Page_Board의 full-screen Slot_3D → 표시 전용 Img_BoardBackdrop, 별도 HUD/GO/BottomNav → BG/Frame/Img/Txt/Input/Badge. 형제 순서는 실제 DOM paint 순서와 일치시킵니다.|현재 배경은 새 2D 공원 시안이며 Slot_3D는 엔진 연결 자리입니다. 게임 3D 실행 완료가 아닙니다.|
|이미지·skin|PNG 원본 → 비파괴 source region/assetRef → 별도 custom BG와 Frame → 기존 [skins](../skins.mjs)의 textures와 3/9slice 렌더링. slice는 source, edge는 논리 화면, padding은 내용입니다.|상단128×64/slice27/edge27/padding0/min54. custom 이미지의 투명 배경·모서리를 tone 판이 덮지 않게 합니다. body9와 fixed crown은 다른 역할.|
|레이아웃·스타일|부모 rect/anchor/contain → 실제 art/hit rect. has-appearance와 skin root padding0으로 얇은 선의 원치 않는 최소 크기를 방지합니다.|최소 edge 합 이하의 코너 보존은 보장하지 않습니다. 다른 종횡비의 contain 여백과 cover 잘림을 오류로 섞지 않습니다.|
|그림자 효과|`element.effects.shadow` → DOM alpha drop-shadow. Normal/Disabled/Pressed filter와 합성하고 원 PNG·region·outline/hit rect는 보존합니다.|기본 꺼짐·실제 조작 때 저장. Normal/Disabled 실제 확인, Pressed 실화면 미검수. 전체 엔진 호환을 뜻하지 않습니다.|
|공통 알림|optional `element.notification` → [notification.mjs](../notification.mjs) 검증·표시 → consumer flat runtime key. count/dot·0숨김·99+를 공통 처리합니다.|62 전용 시험 범위. 현재 badge panel의 span 표시이며 독립 자식 숫자 폼은 아직 미구현. 실제 4메뉴 조립은 진행 중.|
|디자인 가이드|[design-guide-view](../design-guide-view.mjs)의 외곽 W/H·선별 고유 색 → 같은 실제 요소의 편집 명령. line preferences는 보기 설정으로 따로 보존합니다.|W/H 14 전용 시험 통과, 최신 실화면 진행 중. native 입력은 Tab/blur 후 저장값까지 확인합니다.|
|현재 검수본 진입|[mount](../../../../tools/ux-studio/mount.mjs) → [current-review 메타](../../../../tools/ux-studio/current-review.json) → bare entry의 현재 검수본. 명시 workspace/project URL은 그대로 유지합니다.|고정 v 모듈 entry 제거·9회귀/HTTP302 확인. 7007 Browser 차단·LSB 앱 바이너리/native cache/중복 서버 추정은 별개.|

알림 예시 `consumer.updateState({'nav.buildCount':5})`는 점을 포함하는 flat key 한 개입니다. 이름 “Txt_BottomNav_Build_Label”이나 표시 문구 “짓기”를 바꿔도 이 키를 자동 변경하지 않습니다. count/dot·hideZero·maxDisplay는 UI 표시 계약이며 시연 수치를 게임 정책으로 승격하지 않습니다. 일반 hover 색, skin 상태 texture, 공통 Selectable/TargetGraphic·아이콘 상태 전환도 각각의 구현과 샘플 적용을 따로 확인합니다.

상세 편집의 기존 logicalSize/앵커와 새 전체 캔버스의 모바일 기기 선택·직접 W/H·기준 설계/preview 분리·비례 반응형 UX는 구분합니다. 새 UX와 10장 전체 화면 연결은 후속 계획입니다. 385/62/14/9 시험 수를 합산하거나 W/P/U/S 완성률로 읽지 않으며 현재 W/P/U/S 0/4·UI 승인 없음입니다. 특정 버전 명시 컨펌 뒤 방법·원본 hash·revision·실제 캡처를 함께 고정합니다.

## 디자인 가이드와 실제 편집 상태 연결 원리 · .9

직접 편집 구현과 실제 브라우저 검수는 대표 본체에서 진행 중입니다. 이 절은 최신 요구와 상태 연결 원리의 보존이며 특정 API의 구현 완료·화면 통과·UI 승인을 뜻하지 않습니다. 문서 열람용 openManual은 읽기 전용이고 부품 디자인 가이드는 같은 실제 설계를 편집하는 뷰입니다.

디자인 가이드의 선택은 workspace·설계 문서·화면·요소 stable ID를 이어 사용하고 parentId를 유지합니다. 보이는 경계 선/수치와 실제 요소는 같은 ID로 대응합니다. 위치·크기·이미지 변경을 기존 검증과 문서 편집 명령에 보내 undo/redo·dirty·저장으로 연결하며, 실제 설계의 변경 결과를 가이드와 캔버스가 다시 표시해야 합니다. 별도 DOM/CSS 사본이나 읽기용 스냅샷만 수정하는 구조를 실제 편집의 정본으로 삼지 않습니다. 부모 %·논리 px와 확대·패널 폭·스크롤 같은 보기 변환은 구분합니다.

자원 파일과 요소의 표시 참조는 다릅니다. 이미지 넣기/빼기는 참조 연결/해제이며 빼기가 원파일이나 부품을 삭제하지 않습니다. 원파일과 ID·부모·다른 속성, 다른 요소의 공유 참조를 보존하고 되돌리기·저장 재열기를 확인합니다. 자원 검증과 저장 충돌 경계도 유지합니다.

선택 부품을 중심으로 실제 그림을 보고 치수를 외곽에 배치합니다. 모든 후손의 선/숫자를 기본으로 덮지 않고 하위 선 표시를 켜고 끕니다. 계층 행 선택과 펼침/접기는 독립 입력이며 가이드·속성·캔버스는 같은 ID를 선택해야 합니다. 레이어·중앙 캔버스·속성 세 영역의 두 경계 폭 조절은 도구 설정으로 보존하며 설계 좌표·revision·dirty를 바꾸지 않습니다.

관찰 자료 `_작업/codex/ux-studio/20261116-board-measurements/independent-measurements.json`과 `notes.md`는 551×984px 원본의 상위 25개/전체 67개 측정 박스입니다. 원본 px·중심·W/H 비율·가시 잉크 경계는 관찰값이며 실제 설정이 아닙니다. 잉크/실색 약 ±1px, 외곽/가림 약 ±2px와 숨은 경계 미확인을 보존합니다. 원본 폰트명·크기·굵기·줄 높이는 미확인입니다.

.8의 전체 화면 Slot_3D/별도 2D overlay·Img_SNSAvatar와 명시 승인 시점 기록 원칙, 프로젝트 guide .4 사본은 유지합니다. 현재 구현/실검수의 결과는 본체 기록을 따릅니다.

## 어떻게 만들었나요
독립 프로젝트 /Users/max/projest_max/ui-studio/에서 관리하는 ES 모듈 웹 도구입니다. 편집용 상태와 동작 시험용 상태를 분리하고 설계 JSON을 공통 형식으로 사용합니다. 소스 정본은 이 루트의 src/tools/uxStudio/이며 실행 의존성·서버·기본 저장·안내·보고도 이 루트에서 독립 관리합니다.

정식 진입은 http://127.0.0.1:7018/ui-studio/입니다. scripts/start.mjs가 이 루트 node_modules의 Vite 5.4.21과 정확한 의존성 묶음으로 자체 서버를 실행합니다. tools/ux-studio/mount.mjs와 save-plugin.mjs도 이 루트 파일입니다. mount는 /ui-studio/·preview.html·canvas.html과 /ui-studio/source/를 연결하고 save-plugin은 같은 루트의 저장·폴더 API를 제공합니다. 다른 프로젝트의 Vite 설정·실행 프로세스·설치 fallback은 운영 조건에 포함하지 않습니다. 소스·실행 프로세스·게임별 workspace는 각각 별도 경계입니다.

이미 검증한 Vite 5.4.21과 정확한 의존성 11패키지(18,560,529bytes)를 자기 node_modules로 복사했습니다. 원본·사본 검증 해시·라이선스·lock integrity는 _작업/codex/ux-studio/standalone-dependencies.json에 기록했고 package-lock.json에는 다른 플랫폼 선택 패키지를 포함한 58 의존성을 보존합니다. 새 패키지·버전 선정은 없었으며 외부 설치 fallback을 제거했습니다.

자체 서버의 CWD·Vite resolve·실행 의존성이 이 루트인 것을 확인했습니다. 독립 전환 검수 당시 서버 PID는 18579였으나 재기동마다 달라지는 관찰값이며 고정 설정이 아닙니다. /의 302 이동과 편집기·main JS HTTP 200, 독립 전환 당시 자동 시험 220/220을 확인했습니다. 실제 가이드·네이티브 폴더 선택·independent 결정·설계 사본·저장·재열기·충돌·격리·미리보기·모달 포커스·캔버스 W 단계 왕복을 검수했습니다. 정확한 범위는 PROGRESS.md와 증거 JSON을 따릅니다.

이 구조 설명은 지시 없는 서버 시작·재시작·빌드 허가가 아닙니다. samples/monopoly-go/는 검증용 샘플입니다. 게임 엔진이나 3D 자원을 편집기에 불러오는 구조가 아닙니다. 기본 /ui-studio/와 canvas.html은 GrapesJS 전체 캔버스이고 ?editor=detail은 main.mjs 상세 편집입니다. 두 편집기는 같은 설계를 읽지만 캔버스 사본 저장·브라우저 단계 저장과 상세 편집 파일 저장·서버 기준판의 의미는 구분합니다.

기존 편집 흐름:
  main.mjs → model/commands/layers/parts/skins → 편집 화면
  저장 요청 → save-plugin.mjs → 설계 JSON·백업·기준판
  저장 설계 → preview.mjs / consumer.mjs → 소비 화면

폴더 기능의 흐름:
  명시 폴더 선택 → 서버의 네이티브 선택기 → workspace 식별
  변환 여부 선택 → project.json 기록 → 해당 ui-studio 보관영역
  workspace + 문서 ID → 목록·저장·기준판·소비·재열기
  가이드 버튼 → manual.mjs → 공통 또는 프로젝트 문서 읽기

이 흐름은 저장·동의 경계를 설명합니다. 기존 게임 UI가 자동으로 변환되거나 실제 게임에 연결되는 단계는 포함하지 않습니다.

## 소스별 책임
- main.mjs: 편집 상태, 선택·명령·화면/패널, 저장·재열기와 UI 진입 동작.
- model.mjs: 설계 검증, 파일 가져오기 경계, 런타임 상태와 조건·행동 실행. 게임 저장의 writer가 아닙니다.
- layers.mjs / commands.mjs: 계층 조회, 검색, 선택 집합과 이동·복사·삭제·그룹 명령.
- editor.mjs: 편집 화면 조작 연결.
- parts.mjs: 복합 구성과 시각 역할, 입력 소유자, 분해, 래스터 가져오기·텍스트 검증.
- skins.mjs: 게임 UI 종류, 프레임 자원·상태·슬라이스 계약과 조립.
- units.mjs / bindings.mjs: 추가 유닛·표현·연출과 게임 기능/콘텐츠 슬롯 정의.
- history.mjs: undo/redo 스냅샷과 기록 예산. JS heap 전체 상한은 아닙니다.
- graph-view.mjs: 화면 관계도의 지연 로딩과 표시 수명 관리.
- workspace.mjs / layout-view.mjs / snap.mjs: 편집 패널의 도킹·분리·배치. 이 기존 workspace 모듈의 이름은 게임 폴더 저장공간 개념과 다릅니다.
- menu-state.mjs / menu-layout.mjs: 메뉴 열림, 표시와 자식 배열 계약.
- rect-transform.mjs / responsive-layout.mjs / responsive-inspector.mjs: schemaVersion 4의 logicalSize·직속 safe area·2D 고정/늘림 앵커·고정 itemSize 자동 배치·overflow의 검증, 공통 좌표/CSS 계산과 상세 속성 편집. 구형 1/2/3은 자동 전환하지 않으며 layout.direction을 새 자동 배치로 활성화하지 않습니다.
- controls.mjs / control-inspector.mjs: 컨트롤 7종의 기본값·검증·runtime 값·네이티브 입력과 상세 속성 편집. 컨트롤을 포함한 조상까지 button 중첩을 피합니다.
- asset-reference.mjs / asset-store.mjs / asset-client.mjs: workspace별 내용 해시 PNG/JPEG/WebP 참조·파일 검사·원자적 보존과 업로드. 기존 data URI를 보존하고 사본의 참조 파일을 함께 유지합니다.
- overlay-runtime.mjs: 차단 정책·Escape·초점 이동/복귀·화면 ID별 타이머·toast queue/dedupe와 호스트 닫기 veto. 문서 교체 시 이전 타이머를 해제합니다.
- handoff.mjs: 출처·화면/부품·배치·상태·입력·조건·payload·모듈·클릭 스토리보드를 Markdown/JSON으로 출력하는 순수 데이터 경로. 게임 파일 쓰기나 엔진 어댑터 생성은 하지 않습니다.
- project-context.mjs: 프로젝트 종류·이름·경로와 설계/revision/dirty 표시, workspace·project·screen·element URL 전달과 미저장 이동 선택.
- save-plugin.mjs: 서버 저장 API, 경로 검사, 원자적 저장·revision 충돌, 백업·기준판과 폴더 보관영역 연결.
- workspace-store.mjs: 네이티브 폴더 선택, workspace 등록·조회, 변환 선택 기록과 프로젝트 가이드·저장영역 검사.
- tools/ux-studio/mount.mjs: 자체 서버에서 /ui-studio/와 source/를 이 루트 정본 파일로 연결하는 서버 연결부. 게임 변환기는 아닙니다.
- scripts/start.mjs: 이 루트 node_modules로 자체 Vite 서버를 실행하는 진입점. 기본 저장 루트도 이 프로젝트 아래입니다.
- preview.mjs / consumer.mjs: 저장 설계 조회와 가벼운 소비 경로. 실제 게임 호스트 어댑터는 별도입니다.
- manual.mjs / guide/: 설명서 창과 공통 가이드 정본. 편집 상태를 읽거나 수정할 필요가 없는 읽기 경로입니다.
- grapes-pilot.mjs / grapes-bridge.mjs / grapes-drag.mjs: 기본 전체 캔버스, 원설계와의 변환·선택·드래그 연결. 앵커·안전 영역·자동 배치 부품의 수동 % 이동은 제한하고 상세 편집으로 연결합니다. 서버 사본 저장과 브라우저 단계 저장을 구분합니다.

위 목록은 책임 설명입니다. 새 폴더 연결의 최종 파일 분할과 동작 검증은 최신 소스와 이번 작업 보고를 확인하세요. 과거 코드지도가 이 구조를 모두 포함한다고 추정하지 않습니다.

## 데이터와 표시·입력의 분리
문서에는 projectId/revision/screens/transitions/fixtures가 있습니다. 화면의 elements에는 ID, 부모, 위치, 종류, 역할과 필요 시 component/interaction/image/skin/binding이 들어갑니다. 모든 요소의 ID는 문서 안에서 고유해야 하며 부모 순환은 금지됩니다.

구성 전체가 입력을 소유하고 자식은 부모로 전달하거나 표시만 할 수 있습니다. 편집 선택은 구성 전체를 고르거나 내부 부품을 고르는 동작입니다. 동작 시험은 inputOwner를 따라 실행 대상을 찾습니다. 그림이 겹친다는 사실과 입력 소유자가 같다는 사실을 혼동하지 않습니다.

프레임은 CSS border-image 기반 표현을 사용합니다. 슬라이스·화면 고정 폭·내용 여백은 서로 다른 값입니다. 이미지의 원본 영역과 화면상의 입력 영역도 별개입니다. 새로운 그림을 넣었다고 행동 정의가 새로 생기는 것은 아닙니다.

v4의 각 화면은 logicalSize와 선택 safeArea를 가집니다. useSafeArea=true는 화면 직속 부품만 허용합니다. 자동 배치는 자식 순서·고정 itemSize·gap·padding·columns를 사용하며 자식 앵커/inset/safe area와 혼합하지 않습니다. clip/scroll은 같은 DOM에서 표시와 입력을 자릅니다. 전체 Unity/Figma 레이아웃 호환이나 회전·3D 계산은 제공하지 않습니다.

## 저장 경계
검증 → expectedRevision 비교 → 백업 → 원자적 기록 → 재읽기의 경계를 유지합니다. 미저장 편집본과 마지막 저장본은 다를 수 있습니다. 기준판 불러오기는 편집본 변경이며 자동 저장이 아닙니다.

폴더는 workspace ID, 문서는 기존 projectId, 저장은 revision으로 구분합니다. API 호출과 소비 URL에서 workspace를 이어 전달해야 합니다. 서버 전역 active 상태나 전역 최근 문서로 다른 폴더의 데이터를 섞지 않습니다. localStorage의 편집 패널 설정과 설계 파일도 다른 저장입니다.

GrapesJS 단계는 브라우저 localStorage의 문서ID·원 revision·W/P/U별 시험 저장입니다. 일반 서버 기준판과 서로 대체되지 않습니다. 사본 저장은 새 서버 문서를 만드는 경로입니다.

이미지는 선택 workspace assets/의 내용 해시 파일을 assetRef로 읽습니다. MIME·파일 내용·크기·해시·참조 존재와 경로 안전 검사를 거칩니다. 개별 300,000bytes·가로/세로 4096px와 전체 설계 2,000,000bytes 제한을 유지합니다. 설계 JSON이나 연결 명세만 출력하면 참조 파일은 동봉되지 않으며 설계·assets를 포함한 선택 ui-studio를 함께 전달합니다. 공통 내장 자원은 같은 도구 설치본이 필요합니다.

## 제작 원본·표시 이름·등록 자원의 경계
정식 U 자원은 비슷한 콘셉트로 새로 그립니다. screenshot crop은 관찰·임시 W의 참고이며 제작 등록본과 구분합니다. 필요한 바탕은 불투명하고 외곽은 알파인 그림을 사용하며 글자·수치·입력은 별도 설계 요소로 유지합니다. 이 지침은 그림 제작 방식이며 새 렌더러나 스키마를 추가하지 않습니다.

화면·요소의 name은 영문 ASCII 역할/의미 표시 이름이고 screen.id·element.id는 stable ID입니다. 계층은 parentId가 정하며 이름 문자열에서 복원하지 않습니다. Page_Friends → HUD_Top → BG_TopBar·Frame_TopBar·Currency_Cash·Shield_Group·Btn_Menu·Img_SNSAvatar처럼 구성하고, 자식은 Img_Cash·Txt_Amount·Img_Menu·Badge_Notification처럼 부모 전체 이름을 반복하지 않습니다. Img_SNSAvatar는 왼쪽 SNS 사진 데이터 슬롯이며 새 주사위 그림이 아닙니다. 이름 변경은 ID·계층·기존 연결 변경이 아닙니다. 역할 접두어와 전체 예시는 TOOL_SPEC.md가 정리합니다.

선택 프로젝트 ui-studio/assets/authoring/<component>/v001/는 제작 원본, production/<component>/는 등록용 가공본, assets 루트 sha256 파일은 현행 도구 등록 풀입니다. humanname은 `<scope>_<component>_<role>_<state>_vNNN.ext`이고 resource-manifest.json이 원본/출처·제작 방식·알파·크기·판·가공 경로·등록 hash·적용 ID·미확인을 연결합니다. authoring/production 폴더를 자동으로 스캔·등록하는 기능이나 manifest 로더는 이 문서 변경에 포함되지 않습니다. 실제 등록은 현행 API·해시·workspace·이미지 제한을 따릅니다. 이름을 바꾸려고 등록 해시 파일을 손으로 이름 바꾸거나 assetRef를 인간용 파일명으로 대체하지 않습니다.

3D 연결 자리는 Page_Board → Slot_3D의 화면 기준 x/y/w/h=0/0/100/100% 전체 화면 최하층입니다. 내용은 빈 “3D 영역” 표시만 두며 그림/캡처/가짜 보드·입력·엔진 연결은 없습니다. 상단 HUD·우측 이벤트·하단 GO 버튼·재화 게이지·BottomNav는 Page_Board의 별도 2D 상위 형제로 overlay합니다. 중앙 13~97% 박스나 HUD 아래 남는 공간을 3D 전체 영역으로 삼지 않습니다. 2D overlay 계층을 Slot_3D 자식으로 묶지 않습니다.

## 측정 자료와 승인 시점 기록 · .8
새 첨부 551×984px는 대표 본체의 실측 기준입니다. 원본 hash·crop 여부, 원본 px·화면 W/H%·부모% 변환을 함께 기록하며 x/w의 분모 W와 y/h의 분모 H를 구분합니다. 정확한 변환식은 TOOL_SPEC.md를 따릅니다. 이미지 파일 rect와 그림 가시 bbox·중심·아이콘 높이/간격/세로 정렬, 글자 가시 bbox·기준선·위치를 나눠 기록합니다. 폰트 추정과 확인된 원본 설정도 나누며 font-family/size/weight/line-height 원본은 못 읽었으면 미확인입니다. 캔버스 확대율·논리 px·CSS viewport는 원본 픽셀이 아닙니다.

현중이 특정 버전을 명시적으로 컨펌한 후에만 해당 버전 승인 스냅샷 문서와 기존 가이드의 승인 기록/제작 방법·설정을 연결합니다. 원문·KST 시각·설계 ID/revision·원본 hash·비율 측정값·계층·리소스 판·제작 방법·설정·시험/실화면 근거·미확인·다음을 보존하고 이전 승인/시안은 덮어쓰지 않습니다. 일반 “계속”·규칙 저장은 UI 승인이 아니며 현재는 제안(검수 대기)입니다. 이번 문서 작업에서 승인 스냅샷을 만들지 않았습니다.

이번 기본 캔버스 zoom +/−/Ctrl+wheel, 부모·자식 각각 선택/편집과 개별 유닛 디자인 가이드 뷰는 대표 본체·별도 담당 구현 중이며 실검수 대기입니다. redline A~J의 비율·간격·위치·글자 정보 표시와 세부 편집 진입도 이 대기 범위입니다. 관련 구현 모듈 이름이 정해졌어도 소스·실화면 검증 전 완료로 표시하지 않습니다.

## 설명서 표시 경계
openManual({workspaceId})는 문서를 표시하는 HTML dialog를 엽니다. 공통 index/문서는 독립 정본에 연결되는 /ui-studio/source/guide/ URL에서 읽고, 프로젝트 문서는 workspace-guide API로 선택된 ui-studio/guide에서 읽습니다. 현재 공통 정본은 index의 .10이고 실제 생성·읽기를 확인한 프로젝트 사본은 .4입니다. 상태 문구는 해당 index.version에서 읽어 두 판을 구분합니다. 프로젝트 사본은 독자적으로 덮어쓰지 않습니다.

문서는 textContent와 줄바꿈 보존으로 표시합니다. Markdown 안 HTML, 링크 문자열이나 코드를 실행하지 않습니다. 비동기 읽기의 늦은 응답은 현재 선택 문서를 덮어쓰지 않아야 합니다. 오류가 나도 닫기·안내 선택·재시도가 남아야 합니다.

## 협업 기록과 이관 이력
root AGENTS.md가 우선 정본이고 docs/collaboration/README.md가 협업 진입점입니다. STATUS·이번 전환 보고는 이 루트 docs/collaboration/에서 운영하며 기존 상세 작업 보고는 docs/reports/에 보존합니다. 과거 다른 프로젝트의 서버·설치·공유 폴더와 연결했던 구조는 PROGRESS.md의 이력입니다. 그곳의 export 연결 두 개는 외부 소비자가 독립 도구를 읽는 단방향 참조이며 도구 실행 조건이 아닙니다.

## 아직 별도 책임인 것
보존 원본 r14와 실제 검수한 샘플 ux-902404d6 r4를 구분합니다. 샘플의 3개 page·1개 modal·24개 부품·6개 연결은 설계 저장본 기준이며 W/P/U/S 단계 종합검수 0/4와 별개입니다. 본게임 로직 작업은 병행할 수 있습니다. 이번 계획 도구 기능은 구현했고 다음 제작은 모노폴리 GO 정식 UI입니다. 그래픽·전체 샘플·실제 게임 연결은 미완료입니다. 전체 Unity/Figma 호환·엔진 어댑터 자동 생성은 현재 제공 범위 밖이며 새 선행 조건으로 추가하지 않습니다. 실제 게임 전체 자동변환은 구현되어 있지 않습니다. API·실화면 검수의 통과 여부는 이번 작업 보고의 실제 결과로 확인합니다.

실제 게임 호스트, 데이터 공급, 게임 상태 저장·동기화, 엔진 자산 처리, 전체 게임 변환, 최종 그래픽과 기기별 완성도는 별도 구현·승인·검증이 필요합니다. DOM 구조가 비슷하다는 이유로 Unity/Godot나 기존 게임과 동등하다고 수치나 완성 판정을 붙이지 않습니다.

## 3·9슬라이스 조립과 DOM 그림자 책임 추가 · .9 · 2026-11-16 14:36 KST

가변 박스는 기존 skins.mjs의 3·9슬라이스·applySkin·상태 textures와 CSS border-image 조립을 재사용합니다. 임의 SVG 판 또는 전체 가로 그림을 통째 늘린 동작을 이 계약의 대체 구현으로 완료 처리하지 않습니다. source의 분할 px, 논리 fixed edge, content padding, actual resource alpha, hit rect는 독립된 경계입니다. SVG/PNG/WebP는 source 자원이며 실제 9분할/고정폭 조립은 기존 엔진 경로가 담당합니다.

커스텀 BG와 Frame은 개별 source로 겹칩니다. custom-skin-image 배경은 투명하게 두어 투명 코너/중앙에 tone 색판을 추가하지 않고, 내장 frame.svg의 기존 tone은 보존합니다. 상단 source 128×64, slices/edges 각각 27, padding 0의 source 중앙은 74×10이고 target 양축 최소는 고정폭 합 54입니다. 54 미만은 코너 보존 보장 범위 밖이며 높이 54에서는 target 중앙 높이가 0인 최소 경계입니다. v005 하단은 가변 9body와 별도의 fixed crown을 사용하며 crown을 전체화면 늘림 이미지로 바꾸지 않습니다.

그림자의 정본은 element.effects.shadow이고 실제 아트 표시에서 DOM alpha drop-shadow로 적용합니다. PNG 픽셀에 굽지 않으며 pressed/disabled 상태 효과와 합성합니다. 새 UI의 기본은 꺼짐이고 열람만으로 문서에 설정을 만들지 않으며 실제 조작 때 기존 문서 편집·Undo·저장 흐름을 사용합니다. 원본 픽셀·배치·outline·입력 경계는 보존합니다. 커스텀 자원에 그림자를 넣지 않는 제작 원칙과 CSS 배경 투명 규칙은 별개이며, 투명 CSS가 이미 굽힌 그림자를 지우는 기능은 아닙니다.

본체 실화면 computed 전달: Frame 300×80/620×110/461×54에서 동일 source·border-image-width 27px·slice 27 fill·투명 배경 유지. 이 문서 담당의 재실행, 모든 브라우저/엔진 호환, Unity 동등성 확인으로 확대하지 않습니다. 원본 폰트 설정과 Unity 버전/실제 연결은 미확인입니다.

재발 방지 기록은 padding 6 상태에서 3px 선이 12px로 커져 보였던 사례입니다. source의 선 두께와 CSS 고정폭·내용 여백·box 기준을 함께 확인하고 root padding 0을 유지합니다. 이 사례의 실제 CSS 추가 검수는 남아 있으므로 원인을 새 시험으로 확정한 것처럼 쓰지 않습니다. 자원 근거는 `_작업/codex/ux-studio/board-ui-resources-v005.json`, 기존 검산은 `_작업/codex/ux-studio/hud-top-9slice-v004-report.md`입니다.

본체는 하단을 조립 중이며 하단 실검수는 미완료입니다. 전체 W/P/U/S 0/4와 사용자 승인/freeze 없음은 유지합니다. 기존 .9 본문과 프로젝트 사본은 보존합니다. 사람용 조작 순서는 USER_GUIDE.md 마지막 ‘편집 핵심 한 페이지 사용 순서’를 따릅니다.


## .12 짓기 실증에서 보완한 보기 경계

v4 새 화면의 logicalSize는 선택한 저장 page(모달이면 entry page)의 authored 값을 상속합니다. 기기 preview의 reflow 높이를 저장 기준으로 삼지 않습니다. main.mjs의 기존1/2/3 의미는 유지합니다.
standalone preview.mjs는 가용 W/H와 실제 header/stage/footer 여백으로 uniform fit하며 stage에만 overflow:clip을 적용합니다. public runtime page가 바뀔 때만 바깥 window scroll을0으로 돌립니다. 같은 page의 overlay/feedback와 내부 목록 scrollTop을 이 처리로 바꾸지 않습니다.
Grapes 화면 보기의 devicePreviewMode는 true입니다. 여러 화면을 담는 iframe 너비와 CSS media query를 UI 프로필로 혼동하지 않습니다. 이전 단계 저장 ProjectData의 옛 media rule 호환은 미확인으로 분리합니다. 현재 설계 JSON과 사용자 지정 canvas 위치를 자동 정리·삭제하는 절차가 아닙니다.


## 승리 화면 조립 추가 기록 · .13 · r53 기준

작성자 codex(단이) · 2026-11-16 20:01 KST · 제안(검수 대기)

본체 전달의 r53은 기존 Main63/Build78과 Modal_Wins_QuickWins를 조립한 기준입니다. 문서 담당은 이 단위에서 제품 소스·설계 JSON을 수정하거나 Main/Build 최종 deep equality를 검사하지 않았습니다.

|책임|.13 공통 계약|확인 경계|
|---|---|---|
|가변 판/프레임|종이 fill9와 gold/white rim frame9는 별도 source128×96, slices/edges 각각27, padding0입니다. mission fill9는 source128×96/slices27/edges16/padding0입니다.|source slice와 논리 edge를 구분하며 frame 중앙 alpha0·fill 중앙255, 원본 PNG/벡터와 WebP를 보존합니다.|
|진행/고정 장식|native3 source128×32, slices[0,16,0,16], edges[0,18,0,18], padding0, stretch. 클립·노란 광선·미션/보상 그림은 독립 고정 이미지입니다.|3slice375.84×36.38/64×36.38의 늘림 중앙 폭339.84/28을 자원 단계에서 검증했습니다. 실제 브라우저와 전역 판/글자를 혼합하지 않습니다.|
|native text|parts.mjs의 optional typography.strokeWidth(0~12 finite)/strokeColor(#RRGGBB) 검증→공통 typographyStyles의 webkitTextStrokeWidth/Color·paintOrder='stroke fill'→layout-view DOM text.|새 필드 없는 설계는 기본값을 생성하지 않습니다. native 제목 표시를 본체가 확인했으며 원본 font-family는 미확인입니다.|
|계층/paint|parentId 변경과 문서의 그리기 순서는 각각 확인합니다. 이전 text를 새 BG 위로 UI 맨 앞으로 이동하고 label 역할을 지정합니다.|텍스트 기본 회색 판·가려짐을 이미지 문제로 바꾸어 고치지 않습니다. duplicate root는 부모/rect를 재확인합니다.|
|overlay root|presentation.rootMode='fullscreen'이면 배후 page 기준 전체 root를 사용합니다. v4 shared definition도 page.logicalSize를 계승합니다. 필드 없는 기존 overlay는 window 크기입니다.|저장 참조 크기는 보존하고 profile reflow/zoom과 구분합니다. dim/block/Escape 정책의 실제 키보드·차단 검수는 본체 진행 중입니다.|
|브라우저/서버 모듈|Vite/HMR의 브라우저 모듈과 Node 저장 플러그인의 정적 import 캐시는 별개입니다. 새 stroke validator 저장 실패는 자기 소유7018의 허용된 재시작 뒤 r48 저장으로 확인했습니다.|현재 재시작 승인·프로세스 소유를 확인하며 7007 관리나 전체 캐시 삭제로 확대하지 않습니다.|

자원 출처는 [wins UI](../../../../_작업/codex/ux-studio/wins-ui-assets.json)·[wins icons](../../../../_작업/codex/ux-studio/wins-icon-assets.json), 자동시험은 [447/447 로그](../../../../_작업/codex/ux-studio/wins-screen-final-tests.log)입니다. 실제 모바일430/키보드/차단·포커스·최종 원본 보존 대조는 본체 후속 보고를 참조합니다. 게임 보상·폰트/픽셀·장식 정확도·Unity 전체·7007/LSB는 미검수이며 W/P/U/S0/4·10장 동등0/10·승인 없음입니다.


### 본체 후속 검수 · .13 · 2026-11-16 20:21 KST
r53/187부품·2page+1modal·4연결을실제저장재열기했습니다. Main/Build r43 deep equality동일,actual클릭·Enter/Space·Close/Escape·메뉴활성/초점복귀·배후inert·1440/430·논리390복귀·전체캔버스3판1920 확인. 최종451/451·fail0,보고 docs/collaboration/reports/20261116_1916_wins-screen.md 및 PROGRESS .13 본체최종절을읽습니다. 닫기렌더staleinert·fullscreen demo×·고정bridge?v의immutable캐시불일치도최소보완/actual재확인했습니다. bridge공개API변경때import버전URL캐시를함께점검합니다. 위전달시점pending/447은이력이며최신결과로합산하지않습니다. 프로젝트guide.4보존·모든산출제안,10장동등0/10·W/P/U/S0/4·원본폰트/게임보상/7007LSB native/사용자승인미완료. 다음03앨범새그림·메뉴연결입니다.


## 앨범 실제 조립 추가 기록 · .14 · r63 기준

작성자 codex(단이) · 2026-11-16 21:09 KST · 제안(검수 대기)

문서 담당이 실제 샘플 ux-gjs-0d80d7fe r63을 읽어 Main63+Build78+Wins46+Album74=261부품, 3page+1modal·6연결을 확인했습니다. Main Album→navigate/always와 Album Back→back/always가 추가되었습니다. 기존 .13 이하 본문과 프로젝트 guide.4는 그대로 보존합니다.

이앨범은기존engine계약으로조립하며새분할구현은없습니다. native9 source27/edges8/padding0과고정room/5그림/native를분리합니다. Viewport551×624.59@(0,359.41)scroll-y→transparent isGroup Content551×806 visible→grid3,item164×248,gap6,padding25.59/24/24/23으로책임을나눕니다. 극소진행은overflow clip부모가128px이상native3자식(source128×32,slices0/16/0/16,edge0/12/0/12,pad0)의왼쪽만표시하며count는별도native입니다.0fill은생략합니다. Vault효과는effects.shadow0/2/3/.25,입력은Mainnavigate/Backback·always이며unknown목적지는만들지않습니다.

실제 새 투명 빈그룹은 서로 다른A→B를 superclick2개 선택→그룹→새UUID 확인→자식삭제로 만들었습니다. 단일선택 실패의 기존ID를 성공으로 해석하지 않습니다. 일반image-frame 배경panel에이미지경로를쓸때는부품역할을바탕으로먼저지정합니다. native글자는label·그림은image로분리하고현재부모/선택/입력→Tab·blur→저장재읽기를확인합니다.

60초넘는긴UIbatch의Node연결reset때DOM편집은남아있었습니다. 같은브라우저재연결/r58우선저장/짧은step재개로처리한관찰사례이며filesystem JSON조립이아닙니다. `_작업/codex/ux-studio/browser-ui-helpers.mjs`는UI클릭/AX만하는스크래치이며제품API가아닙니다. 이앨범작업은제품source수정없음입니다.

[원본03](../../../../docs/reference/monopoly-go/20261116-ten-screens/03_album.png)·[측정/quicksheet](../../../../_작업/codex/ux-studio/album-assembly-quick-sheet.md)·[15개 그림 manifest](../../../../_작업/codex/ux-studio/album-icon-assets.json)·[7개 UI manifest](../../../../_작업/codex/ux-studio/album-ui-assets.json)를 읽었습니다. manifest의 registration/UIApplied는 자원 하위작업 당시 상태이며 현재 적용은 실제 저장 assetRef와 본체 보고를 대조합니다.

문서 담당은 fresh [album-screen-final-tests.log](../../../../_작업/codex/ux-studio/album-screen-final-tests.log)의451/451·실패0·cancelled0을 직접 읽었고 시험/actual UI를 재실행하지 않았습니다. 과거 실행 수를 합산하지 않습니다. 본체 전달 actual은 로비→Album→Back→Main 현금13,075/trigger 초점 복귀·재진입 scroll0, AX scroll0→181.25/client625/scrollHeight806/headerY114.765625 고정/body scroll0입니다. 재진입 초기화는 관찰값이며 원본 정책으로 확정하지 않습니다. 모바일430·1920canvas·최종 캡처·기존Main/Build/Wins deep equality는 본체 검수 대기이며 후속 본체 보고를 우선합니다.

원본 폰트/픽셀·실제 게임/보상/카운트다운·Info/Vault/세트 상세 목적지·7007/LSB·사용자 승인/freeze는 미완료/미확인입니다. 10장 최종 동등0/10·W/P/U/S0/4, 제안(검수 대기)를 유지합니다.


### .14 후속 미확인 보정 · 2026-11-16 21:10 KST

Set08/09 새 그림은 원본 종과 불일치해 본체가 새 그림으로 보정 중입니다. 해당 그림의 최종 교체 revision·실제 등록/표시·검수 결과는 본체의 후속 실제값 append를 기다립니다. 현재 UI 완료나 원본 동등을 주장하지 않습니다. 상세 본체 보고는 [20261116_2025_album-screen.md](../../../../docs/collaboration/reports/20261116_2025_album-screen.md)입니다.

UI manifest의 progressCapsTransparentCorners=false는 room을 추가한 뒤 마지막2개 배열이fill+room이된집계오류였습니다. 실제progress-bg3/fill3의4모서리알파0을직접확인하고해당2role만명시선택하도록원스크립트집계식을보정했습니다. 그림파일/등록/UI는변경하지않았습니다. 이메타데이터보정은UI검수완료판정이아닙니다.


### 본체 최종 실제값 · 앨범 r64 · 2026-11-16 21:20 KST

위 r63/교체 중/pending은 중간 이력입니다. 최종 ux-gjs-0d80d7fe r64=Main63+Build78+Wins46+Album74=261부품·3page+1modal·6연결입니다. 실제 툴의 이미지 경로 입력+Tab으로 Set08 초록·노랑 새/Set09 노란 강아지 v002를 등록·교체·저장했습니다. 두 종을 고양이로 잘못 읽은 v001은 원본/해시를 보존하고, _작업/codex/ux-studio/album-icon-corrections.json에 교체 이유·새 원본/프롬프트/투명 PNG/WebP·SHA·관찰/추정을 기록했습니다. screenshot pixels 재사용 없이 새로 그린 그림입니다. v00115+기하UI7+교정2=24개 보관 자원 해시·미러 일치, 최종 사용 신규 자원22개입니다. 일러스트15개 사용 중2개가v002이며 기하UI7은직접작성SVG→losslessWebP입니다.

본체 actual: Main Album 클릭→새 Album→Back→Main 현금13,075/Album trigger 초점복귀, native Tab/Enter로Back·Space재진입, scroll0→181.25(client625/scrollHeight806)·headerY114.765625고정·바깥scroll0·재진입scroll0을 확인했습니다. 재진입 초기화는 우리 도구 관찰이며 원본 정책 확정이 아닙니다. 최종preview CSS1440×900·모바일CSS430×844에서 가로/세로넘침0·깨진이미지0. 캡처파일은 각각phoneclip408×729/모바일430×843입니다. 전체canvas CSS1920×1280의실제파일1919×1280,4boards X24/635/1246/1857,Y40·폭551/60간격·261부품·r64재열기를확인했습니다. 상세390×844의root와preview-screen실제389.997×843.987일치/설계기준복귀·r64hash불변,당시상세브라우저CSS2687×1792로1440상세검수라쓰지않습니다. 카드가이드W164/H248actual파일2520×1575도보존했습니다. 자동배치자식의가이드위치/크기잠금은부모grid보존규칙입니다.

Vault actual right10.019/bottom12.012 논리px·engine filter drop-shadow(0,2,3,.25)로하단고정확인. Main/Build/Wins 전체deep equality와기존4edges는r53와동일합니다. 본체 이번npm test451/451·fail0·exit0,로그 _작업/codex/ux-studio/album-screen-final-tests.log. 그뒤제품소스변경0/재실행중복합산0이며삽화교체는자원해시/실제표시로재검증했습니다.

보고 docs/collaboration/reports/20261116_2025_album-screen.md, 증거 docs/evidence/20261116-album-screen/ 및 file-verification.json을 우선합니다. current-review는r64로갱신합니다. 프로젝트guide.4/원본/이전판보존, 공통.14. 다음04친구새그림·native본문/탭/목록/행동·Main입구/Close/차단/복귀연결입니다. Info/Vault/세트상세목적지·게임수치변화/보상/시간·원본폰트/픽셀동등·7007/LSB native·사용자승인/freeze는미완료입니다. 10장최종동등0/10·W/P/U/S0/4·제안(검수대기),주간81/90·11/17 08:00KST중지선·기존ui30분만유지합니다.


## 친구 모달 실제 조립 추가 기록 · .15 · r72 기준

작성자 codex(단이) · 2026-11-16 22:09 KST · 제안(검수 대기)

문서 담당이 실제 저장본 `ux-gjs-0d80d7fe` r72를 읽었습니다. Main63+Build78+Wins46+Album74+Friends87=348부품, 3page+2modal·8연결입니다. r72는 이번 문서의 확인 기준이며 본체 후속 저장/실제 검수 보고를 우선합니다. 기존 본문·원본·프로젝트 guide .4는 보존합니다.

|책임|이번 탭 엔진 계약|이전 문서/검수 경계|
|---|---|---|
|control정의|tabs에만선택적options[].panelId와tabSkin허용. panelId는같은화면에있는서로겹치지않는root이며중복/탭자신·상위대상거절|panelId없는기존탭은선택UI동작보존. 타이틀/본문목적지를자동생성하지않음|
|skin검증/paint|tabSkin은mode3,normal/selected만. 기존applySkin/assetRef/native border-image경로;부모fontSize/typography/textColor를각nativebutton에반영|default탭skin없는기존표시는보존. 별도의이미지전체탭과nativelabel을중복깔지않음|
|같은폭native탭|flex1 1 0px/minWidth0/gap0/padding0,role tab·선택tabIndex/aria-selected|3탭동일폭과실제keyboard/기기검수는구분|
|본문표시|선택panel은기존display/inert/ARIA기록을복원;비선택은displaynone/inert/aria-hidden=true. aria-controls/labelledby로연결|편집표시와실제preview/consumer입력을구분하고숨는panel의초점은선택tab으로옮김|
|숨은입력차단|nativeevent와model.changeControl/activate가hiddenByTabs및하위관계를검사|CSS숨김만으로API입력가능하다고두지않음;기존menu/overlay차단과병행|
|자원등록|기본/선택프레임은정식프로젝트경로import또는업로드assetRef. 실제원본W/H검증;tabSkin.textures는documentAssets/사본복사검증에포함|선택workspace범위와content-hash참조보존. 임의dataURL/다른게임파일쓰기로우회하지않음|
|비동기적용|설계객체/화면/선택요소/control/편집모드가여전히같을때만적용하는stale guard|경로/파일읽기뒤선택이바뀌면다른요소를덮어쓰지않음|
|inspector문자열|옵션값·라벨·본문선택의속성키/표시문자를escape|escape RED→GREEN 전용7/7,선행전체462/462와최종463/463는별개실행|

재현근거는[tab-engine-source.diff](../../../../_작업/codex/ux-studio/tab-engine-source.diff)입니다. controls.mjs의정의/표시·숨은입력,control-inspector.mjs의본문선택/프레임입력,layout-view.mjs의workspace/runtime전달,model.mjs의API차단,asset-reference.mjs/main.mjs의자원열거/등록/복사,styles.css의native탭규격을함께유지합니다. 문서담당은이diff를읽었고제품source를수정하지않았습니다.

Friends화면은Panel→Tabs/3본문root와Footer독립형제이며,Timeline본문은Viewport→Content→Request+ActivityGroup입니다. ActivityGroup의직속자식5개만84px자동행입니다. 프레임·그림·native글자·입력·별·effects.shadow와공통Badge부모notification을분리합니다. 이는Unity전체/게임엔진어댑터나새친구API의구현이아닙니다.

본체 실행 로그 [friends-screen-final-tests.log](../../../../_작업/codex/ux-studio/friends-screen-final-tests.log)의 **463/463·실패0·cancelled0**을 문서 담당이 직접 읽었습니다. 이 담당은 시험을 재실행하지 않았습니다. 선행 전체462/462와 후속 escape 전용7/7·RED/GREEN은 별도 실행 이력이며 합산하지 않습니다. **모바일430·데스크톱1440·전체캔버스1920, 키보드·스크롤·dim·Close·포커스 복귀 최종 실검수는 본체 진행 중**으로 이 추가절에서 통과를 주장하지 않습니다. 소스/저장 계약과 실제 입력 성공을 구분합니다.

원본 폰트/픽셀 동등·실제 스티커 요청/전송/거절·게임 수치/시간·7007/LSB native·사용자 승인/freeze는 미완료/미확인입니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**를 유지합니다. Source05 배경은 새 그림1회 생성 준비·미등록 단계로 05 조립 완료가 아닙니다. 주간83/90·11/17 08:00 KST 중지선·기존30분 운영은 본체 전달 상태이며 이 문서 작업은 예약/서버를 만들거나 재개하지 않았습니다.

근거: [04 원본](../../../../docs/reference/monopoly-go/20261116-ten-screens/04_friends.png) · [측정표](../../../../_작업/codex/ux-studio/friends-assembly-quick-sheet.md) · [그림2 manifest](../../../../_작업/codex/ux-studio/friends-icon-assets.json) · [기하UI15 manifest](../../../../_작업/codex/ux-studio/friends-ui-assets.json) · [탭 엔진 diff](../../../../_작업/codex/ux-studio/tab-engine-source.diff) · [본체 보고](../../../../docs/collaboration/reports/20261116_2125_friends-screen.md). Manifest의 UIApplied/registration은 자원 하위작업 당시 상태이며 실제 참조는 r72를 대조했습니다.


### 본체 최종 실제값 · 친구 r72 · 2026-11-16 22:36 KST

앞선 .15의 463/463·실화면검수중은 중간 이력입니다. 최종 저장 ux-gjs-0d80d7fe r72는 348부품·3page+2modal·8연결이며 기존 r64의 네 화면 전체와 6연결은 deep equality/포함 대조로 보존했습니다. 신규 Friends87, 새 그림2+직접 그린 기하UI15=17자원의 production·staging·등록본 SHA와 실제 설계 참조를 확인했고 17개 HTTP200/응답SHA도 확인했습니다. 기존 Cashv003/Bankv002/공통Badge 재사용과 신규 그림을 구분합니다. 프로젝트 guide.4는 보존했습니다.

본체 실제 브라우저: 메인 친구 클릭/Enter/Space→모달, 세 탭 Enter/Space→선택skin/본문 display·inert 전환, 배후Main inert, Close 클릭/Enter·Escape→닫힘/메인Friends 초점복귀를 확인했습니다. native PageDown으로 scrollTop0→51.25(client585/scrollHeight636), CSS1440×900에서 headerY226.51834106445312/footerY773.5620727539062 불변·바깥scroll0, 재진입scroll0 확인. Panel 실제 filter는 drop-shadow(rgba(0,0,0,.25) 0px 3px 6px), 실제 dim은 rgba(22,39,56,.5)입니다. CSS1440×900/430×843에서 가로·세로넘침0/깨진img0, 1920×1280 실행 캡처를 보존했습니다. 파일 픽셀은 각각1800×1125/537×1055/2400×1600입니다. 1920 증거는 전체캔버스가 아닌 독립 미리보기이며 상세편집1920 증거도 별도로 보존했습니다.

검수 중 구탭24의 미저장 재열기 경로가 응답하지 않아 한 번 질문했지만, 새 탭25/29의 저장 r72 읽기와 최종 키보드·마우스 검수는 성공했습니다. 원인을 Mac잠금/제품결함으로 확정하지 않습니다. 즉시 읽은 Enter Close와 PageDown은 240ms 연출/브라우저 스크롤 중간값일 수 있어 후속 안정 프레임을 확인합니다. 에디터 선택목록에도 data-element가 있으므로 computed 검사는 .ui-element로 범위를 좁힙니다. CSS border-image는 document.images 검사 밖이므로 HTTP/SHA를 별도로 확인했습니다.

최종 소스 검토에서 복제된 tabs의 panelId가 원본문을 가리키는 결함을 확인해 commands.mjs의 번들 ID 재매핑/범위 밖 참조 해제/삭제·그룹해제의 지워진 참조 정리를 보완했습니다. 관련6RED→GREEN 뒤 본체 최종 npm test469/469·fail0·cancelled0·exit0. 로그 _작업/codex/ux-studio/friends-screen-final-verified-tests.log, 실제 Panel 복제→Undo(저장안함)도 확인했습니다. 이 최종 시험 뒤 제품 소스 변경0입니다. workspace 누락 의심은 실제 root metadata 상속으로 해소했고 소스수정 없이 두 workspace 소비자20/20을 확인했습니다. 실제 결함으로 기록하지 않습니다.

근거는 docs/collaboration/reports/20261116_2125_friends-screen.md와 docs/evidence/20261116-friends-screen/{browser-checks,file-verification,asset-http-checks}.json 및 JPG입니다. 구체적인 안정 프레임·입력 성공은 이 최종 절을 우선합니다. 실제 Send/Reject API·원본에 없는 두 탭 본문·Jaime 본문/초상·원본 폰트/픽셀동등·7007/LSB native·게임연결/사용자승인·W/P/U/S0/4·10장 최종동등0/10은 미완료입니다. 다음05 메인 신규 배경은 준비 파일이며 아직 미등록/미조립,06메뉴/07창고/08상점/09·10이벤트 순서로 이어갑니다. 주간84/90·11/17 08:00KST 중지선·기존ui30분만 유지합니다.


### 전체 캔버스 실제 재검수 보정 · 2026-11-16 22:41 KST

22:36 단위보고 뒤 기본 진입을 다시 열자 고정 ?v=20261116-wins-fullscreen1 주소의 이전 controls 검증기가 새 tabSkin을 거부해 ‘저장 설계 읽는 중’에 머무는 오류를 실제 재현했습니다. 브라우저 오류시각13:36:24.879Z/스택과 HTTP헤더를 대조했습니다. 같은 모듈의 일반주소는 Cache-Control:no-cache,고정 ?v= 주소는 max-age=31536000,immutable이었습니다. src/tools/uxStudio/grapes-pilot.mjs:5의 bridge import에서 고정 query만 제거해 Vite의 최신소스 재검증을 사용합니다. 새 버전문자열을 반복해서 붙이거나 캐시전부삭제/서버재시작은 하지 않았습니다. 실제 재현→최소 한 줄 보완→관련27/27→전체470/470·fail0·cancelled0·exit0→같은 기본진입 재열기로 검증했습니다. 최종로그는 _작업/codex/ux-studio/friends-canvas-cache-final-tests.log이며 469는 직전 결과입니다. 추가된1개는 control-visual.test.mjs:330의 두workspace page/modal native탭 자원경계 특성시험으로,제품수정이아닌20개관련검증안의추가회귀입니다. 시험 수를 합산하지 않습니다.

actual 기본 전체캔버스 status ‘5개 화면 ·348개 부품 ·원본r72보존 ·수정은사본으로저장’, 사본저장enabled·header저장됨r72. 5판 x24/635/1246/1857/2468,y40,width550.996,height983.984의약60간격을확인했습니다. 캔버스CSS1600×900/실제파일2000×1125이며1920검수로쓰지않습니다. 증거 docs/evidence/20261116-friends-screen/canvas-cache-recovery.json 및 friends-canvas-css1600-r72.jpg. 오류로그의13:36기록은재열기전이력이고복구후새오류로세지않습니다. r72설계SHA65770adbe5263f57b9f2f8ab38593bd272a894c1a92759a41163d3e8f26d82aa 불변, 기존4화면/6연결보존. 위 ‘469뒤제품변경0’은이추가수정전시점이며최종은470이후제품소스변경0입니다. 백업2240_canvas_cache/2241_canvas_recovery_closeout. 공통.15/프로젝트.4·W/P/U/S0/4·전체동등0/10·미완료경계는그대로입니다.


## 메인05 조립 기록 · .16 · r76 중간 기준

작성자 codex(단이) · 2026-11-16 23:04 KST · 제안(검수 대기)

문서 담당은 저장본 `ux-gjs-0d80d7fe` r76을 직접 읽었습니다. Main71+Build78+Wins46+Album74+Friends87=356부품, 3page+2modal·8연결이며 Main 조립 중의 스냅샷입니다. SHA는 `123486eb140ffe898e5cb3ef3a78fe8065e292e8bfc0777d1c4f8c025ef4d06c`입니다. 본체 후속 저장·최종 append가 이 중간값을 보정합니다. 기존 본문·이전판·프로젝트 guide .4는 보존합니다.

이 단위는 기존 schemaVersion4·logicalSize551×984의 독립 설계 조립이며 제품 엔진/게임 API를 추가한 사실을 뜻하지 않습니다. Main ID·기존 element ID·navigation edge는 의미를 유지하고 name은 역할별로 바꿉니다. 배경/루트HUD/이벤트/Bottom은 형제이며 부모를 크게 바꿀 때 자식 percent geometry도 새 부모 크기에 맞춰 다시 계산합니다. Cash140→214의 icon45/text156 재배치가 그 예입니다.

|저장 책임|Main05 계약|확인 경계|
|---|---|---|
|새 그림|image.assetRef·원본sourceSize·contain; 배경551×984 cover|12개 이벤트그림/배경1 준비와 저장 참조를 분리|
|프레임|skin.mode9/3·textures.normal.assetRef와실제w/h·slices/edges/padding|먼저 새 source 등록, 다음 source 범위에 맞는 slices 입력. 분할 clamp를 곧바로 버그라고 하지 않음|
|native 글자|kind=text/partRole=label·fontSize/typography.weight/lineHeight/strokeWidth/strokeColor|CAKE/WALK는 저장. GO는 같은 ID의유효변환과image제거가 필요|
|GO 변환|기존image/image에서text/label로 한 번의유효상태 전환,불필요image제거|r76 kind/partRole 개별UI변경이strict invariant에걸려롤백되는원인을본체가확인했고최소보완중. 수정·시험·native actual완료는후속보고|
|알림|부모notification.enabled/mode/value/hideZero/valueKey가정본;이미지/텍스트자식은표시|하단28²와이벤트18²의역할분리;자식초기text를실제count로오독하지않음|
|입력/상태|buttonState.enabled/mode=tint/targetGraphic=해당childID;표시자식은parent입력|r76 Shop enabled/Img_Event_Shop지정은저장상태;pointer/keyboardactual은별도|
|외부그림자|effects.shadow enabled/color/opacity/x/y/blur,그림에굽지않음|tint효과켜기와shadow구현을같은완료라고적지않음|
|화면연결|기존Main4개native연결보존;06~10은실제target생성후navigate/open/back/close설정|이벤트이름/목적지를자동추정하지않음,09/10버전차이는시연제안|

배경/그림의종횡비, fixed 원판1:1, native9/3의 source slices와logical edges를각각보존합니다. source값36,750,000/2602/90/4방패·HOLD FOR AUTO는시각fixture이고발란스/계정/카운트다운엔진이아닙니다. 모바일은루트전체uniform fit으로비례를보며원본폰트·Unity전체호환을주장하지않습니다. 이문서담당은제품소스를수정하지않았습니다.

신규 준비는 그림12+기하UI11+배경1=24개입니다. 세 manifest의 production/staging SHA를 이번에 24/24 직접 대조했습니다. r76의 고유 assetRef 참조는 그림2(Shop·pirate-shield)+기하UI2(banner fill9/frame9)+배경1=5/24이며, 방패4개는 같은 자원1개를 재사용합니다. 이는 저장 설계 참조 수이며 이번 담당의 실제 등록 UI·HTTP·최종 화면 검수는 아닙니다. Manifest의 제작 시점 uiApplied=false/registration=null만으로 현재 미등록이라고 판단하지 않습니다. 최종 등록·사용 개수는 본체 후속 실제값을 따릅니다.

앞 단위 본체 소스 검증470/470은 과거 실행입니다. Main05 이번 시험 재실행·390/430/1440/전체캔버스·키보드·그림자·저장 재열기 최종 실검수는 미완료이며 이 문서 담당은 실행하지 않았습니다. 상단 진행/보상/시간과 좌우 다수 입구, x50 및 06~10 목적지도 조립/연결 대기입니다. 원본 폰트·픽셀 동등·실3D·실제 GO/자동굴림/배수/차감/보상/카운트다운·7007/LSB native·사용자 승인/freeze는 미완료/미확인입니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**를 유지합니다. 주간85/90·11/17 08:00 KST 중지선·기존 ui30분은 본체 전달 상태이며 새 예약·재개·서버 작업은 하지 않습니다.

근거: [05 원본](../../../../docs/reference/monopoly-go/20261116-ten-screens/05_main.png) · [측정표](../../../../_작업/codex/ux-studio/main05-assembly-quick-sheet.md) · [그림12 manifest](../../../../_작업/codex/ux-studio/main-events-assets.json) · [기하UI11 manifest](../../../../_작업/codex/ux-studio/main-ui-assets.json) · [배경 manifest](../../../../_작업/codex/ux-studio/main-candy-board-assets.json). 측정표의 초기r72/후속r74와 이 문서의 r76을 구분합니다.

최종 정규화 제작값은 원본bbox 측정과 구분합니다. 좌6은 input100×104, art88×78@(6,0), timer96×22@(2,80), dot18²@(80,0), root x10/y100·205·310·415·520·625입니다. 우원형4는 input84×108, art80²@(2,0), timer84×30@(0,76), dot18²@(66,0), root x449/y234·344·454·574입니다. 초기 우높이104 제안은 timer의끝106보다 작아108로 보정했습니다. 모든 자식은 부모 가이드 영역 안에 두고 그림은contain으로 원비율을 유지합니다. Tycoon은 별도 featured106×137이며 같은 역할끼리 부모/자식 규격을 통일합니다.


## Main05 최종 실제 보정 · .16 · r92

작성자 codex(단이) · 2026-11-17 00:16 KST · 제안(검수 대기)

**공통 .16의 최신 실제 사실은 이 최종 절을 우선합니다.** 앞선 r76/준비24개/GO전환 실패·조립 대기 기록은 당시 이력으로 보존합니다. 현재 저장본은 `ux-gjs-0d80d7fe` **r92·Main175/총460부품·3page+2modal·기존8연결**이며 SHA는 `c27d09e500d63ad2a6caf93b0a6f681cc681c137095c3d209a953bb336b9743e`입니다. r92의 설명도 실제2D/목적지·게임 미완료 경계를 반영했습니다.

유효 부품 전환은 [main.mjs](../main.mjs)의 partRole handler1871·kind handler2069가 공통 `changePartType` helper3113을 호출합니다. label↔text/image↔image의연관필드를원자적으로맞추고text전환시image를제거한뒤validateDocument합니다. r76strict invariant 롤백을해소했고기존ID/UndoRedo문서스냅샷경로를유지했습니다. 본체최종477/477과native Undo/Redo는별도검증입니다.

새이벤트12부모는r91에schemaVersion4 rectTransform의native상단왼/오anchor를부여했습니다. authored551×984의percent값만두면390×844같이높이가다른보기에서세로길이가늘어나므로anchor/position/sizeDelta의기존해석으로같은역할규격과폭기준비율을유지합니다. 실제Shop390=70.7804×73.6045/430=78.0399×81.1537은100:104입니다. x50은HUD_Bottom자식74²이고루트이벤트앵커12개와책임이다릅니다.

skin.textures의정식assetRef/w/h가반영된뒤slices를설정합니다. Banner256×160/64all/edge24all/pad0은최종저장값입니다. 9/3frame·고정원판·그림·nativefontstroke·effects.shadow·입력은독립계층입니다. buttonState.targetGraphic은자기이미지자식을참조하고20enabled는정의값이며모든상태입력검수완료가아닙니다. 알림부모notification은12개의18²mini/12px와하단4개의28²역할을구분하고자식text기본값보다우선합니다.

정식자원27개의등록·참조·production/staging/등록본SHA·HTTP응답SHA를검증했고다른4화면/8연결/63MainID를유지했습니다. consumer 게임로직·미관찰목적지·실3D·원본폰트를확장구현한것으로해석하지않습니다. nativeclip의DOM좌표/DPR 변환은선택탭과캡처API의좌표계에맞춘관찰사례이며CSS치수와산출파일치수를같은값으로간주하지않습니다.

문서 담당은 r92 저장본·[파일 검증](../../../../docs/evidence/20261116-main05/file-verification.json)·[브라우저 기록](../../../../docs/evidence/20261116-main05/browser-checks.json)·[최종 시험 로그](../../../../_작업/codex/ux-studio/main05-final-tests.log)를 직접 읽었습니다. 신규 **27개=배경1+AI그림13+직접 그린 기하UI13**은 실제 UI 등록·설계 참조·production/staging/등록 SHA·HTTP200/응답 SHA가 확인됐습니다. Main기존63 ID·기존8edges·다른4화면의 r72 대비 deep equality를 보존했습니다. 최종 본체 `npm test`는 **477/477·실패0·cancelled0·exit0**이며 앞선470은 이전 실행입니다. 이 문서 담당은 시험/브라우저를 재실행하지 않았습니다. GUI 실제 검수와 Undo/Redo·기기 수치는 본체 실행 기록/전달값입니다.

목적지06~10·원본폰트/픽셀동등·실3D·GO굴림/자동모드/배수/시간·보상/구매 등 게임 로직·7007/LSB native·사용자 승인/freeze는 미완료입니다. 원본05의 작은 hammer 아바타 중첩도 미재현입니다. 06/07 측정·자원 준비는 UI 미등록이며 화면 완성으로 세지 않습니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**, 주간86/90·**2026-11-17 08:00 KST 최종 중지선**을 유지합니다. 기존 ui30분 외 새 예약·재개·서버/빌드는 하지 않습니다. 프로젝트 guide .4와 이전판·원본을 보존합니다.

증거 파일: [1440 preview](../../../../docs/evidence/20261116-main05/main-r90-css1440.jpg) · [430 preview](../../../../docs/evidence/20261116-main05/main-r90-css430.jpg) · [1920 preview](../../../../docs/evidence/20261116-main05/main-r90-css1920.jpg) · [r90 전체캔버스](../../../../docs/evidence/20261116-main05/main-r90-canvas-css1920.jpg) · [r90 정상clip](../../../../docs/evidence/20261116-main05/main-r90-phone-clip.jpg) · [r92 폰파일](../../../../docs/evidence/20261116-main05/main-r92-phone.jpg). 파일 픽셀과 CSS viewport·기기 profile을 구분합니다.


## Menu06 제작 기록 · .17 · r107 기준

작성자 codex(단이) · 2026-11-17 00:45 KST · 제안(검수 대기)

문서 담당은 먼저 r106을 읽고, 본체의 프로필 crop/알림 alt 보정 뒤 **r107**을 다시 읽었습니다. 현재 `ux-gjs-0d80d7fe`는 Main175+Build78+Wins46+Album74+Friends87+Menu81=541부품·3page+3modal·10연결입니다. r107 SHA는 `75bda424a32d2e998fc2043547259d4b6a1b3ad0b07f4e99d1dfb1e787664cc6`입니다. 기존8연결과 Main Menu stableID를 유지하고 MainMenu open/Close 두 연결만 추가했습니다. 공통 .16과 프로젝트 guide .4·이전 본문은 보존합니다.

**Menu06 최종 r107의1440/430/390·키보드·캡처 종합 실검수는 본체 진행 중입니다. 이 절은 저장/제작법/소스 검증이며 통과 선언이 아닙니다. 최종 actual은 본체의 후속 append를 우선합니다.**

Menu06의새화면은kindmodal·presentation.rootModefullscreen입니다. engine dimfalse와blockingtrue/Escape true를유지하고루트singletexture Dim_Menu_Backdrop opacity.7을둡니다. DrawerBG/Frame은같은부모/rect에native9 texture를등록하고실제source128×96반영후slice27/edge24/pad0을입력합니다. 가변세로Drawer안고정top Rows/Profile/header/상단장식과bottom장식,루트Footerbottom의책임을분리합니다.

기본rectangle SVG가1%inset을가져fullrootdim/footer/line의불투명경계에틈이보인사례는uniform32²SVG/RGBA(WebP)solid3개를native9zero-slice/zero-edge/pad0으로정식등록해해결했습니다. 전체도형inset이나기존frame/원형규칙을변경하지않았고새제품기능도추가하지않았습니다. Close의oldskin제거는같은ID를영역으로전환→skin없음→button복귀한실제UI절차입니다.

그룹배지보완은 [layout-view.mjs](../layout-view.mjs):69/174의두조건에서partRolebadge의compound대상을`component || isGroup`으로넓혔습니다. parentNotification 전달과compound의자기글자비우기를같이적용해isGroup점에1이남지않고nativeCount자식이점/숫자/0숨김의부모값을따릅니다. 기존component배지/무관label/문서data/자원은보존합니다. [control-visual.test.mjs](../../../../tests/ux-studio/control-visual.test.mjs):361/371은layout와consumer의groupdot/count·실시간값·0숨김/잘못된값·자식재사용을회귀검증합니다.

관련2RED→41GREEN뒤소스리뷰1회와후속focus CSS한규칙보완을구분합니다. CSS보완후본체최종verified로그479/479를읽었습니다. r104이전실제Menuopen/첫Shop초점/Maininert/점글자숨김·Close/dim표시와최종r107의기기/키보드/캡처실검수진행을구분합니다. UI계층/parent/원Closeedge/사진region실제저장확인은별도증거이며소스시험만으로같이통과시키지않습니다.

직접 읽은 근거: [지정 시작 보고](../../../../docs/collaboration/reports/20261117_0013_menu06.md) · [06 원본](../../../../docs/reference/monopoly-go/20261116-ten-screens/06_menu.png) · [측정표](../../../../_작업/codex/ux-studio/menu06-assembly-quick-sheet.json) · [신규8/재사용5 manifest](../../../../_작업/codex/ux-studio/menu-ui-assets.json) · [solid3 manifest](../../../../_작업/codex/ux-studio/menu-flat-assets.json) · [RED](../../../../_작업/codex/ux-studio/group-badge-notification-red.log) · [GREEN](../../../../_작업/codex/ux-studio/group-badge-notification-green.log) · [최종 시험](../../../../_작업/codex/ux-studio/menu06-final-verified-tests.log). 최초 보고의8준비/미등록·소스수정예정없음은 당시 계획입니다. 현재 신규11개 production/staging SHA와 저장 assetRef 참조를 직접 대조했습니다. manifest의생성시점UIApplied=false/registration=null을 현재 적용 상태로 그대로 옮기지 않습니다.

그룹 배지 관련2RED(actual1/expected빈문자열)→관련41GREEN 뒤 본체 최종 `npm test` **479/479·실패0·cancelled0·exit0**입니다. 문서 담당은 로그를 읽었으며 시험/GUI를 재실행하지 않았습니다. 본체 소스 리뷰1회 완료 후 후속focus CSS한규칙의 범위를 아래에 구분했습니다. r104이전 Menuopen/첫Shop초점/Maininert/점글자숨김/Close·dim화면을 확인한 기록과 최종r107 종합실검수 진행을 구분합니다.

SHOP08/SHOWROOM07 연결은 실제 목적지 조립 뒤 진행하며 NET WORTH/DAILY TREATS/MAP/BOARD REPORT/JOIN US!/SETTINGS/GO!CHAT의7목적지는 미관찰·미설정입니다. 원본 dim 정확alpha·폰트/픽셀동등·게임 기능·7007/LSB native·사용자 승인/freeze는 미완료/미확인입니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**, 주간87/90·**2026-11-17 08:00 KST 중지선**·기존 ui30분만 유지합니다. 새 예약/재개·서버/빌드는 하지 않습니다.

후속 focus 보정: native 행은 isGroup/button·hitshape rectangle인데 예전 wireframe `.kind-button`의50% radius가 keyboardfocus를큰타원으로보이게한실제사례를확인했습니다. [styles.css](../styles.css):1257근방에 `.is-group.kind-button[data-hit-shape="rectangle"] { border-radius:0; }` 한규칙을추가해그룹+사각입력만맞췄고일반button/도형전체정책은유지했습니다. CSS보완전 `menu06-final-tests.log`479는이전이력이며이후새 [menu06-final-verified-tests.log](../../../../_작업/codex/ux-studio/menu06-final-verified-tests.log)의479/479·fail0·cancelled0·exit0을최종소스검증으로읽었습니다. 최종390/430/1440·키보드·캡처 actual은여전히본체진행중입니다.


## Menu06 최종 실제 보정 · .17 · r107

작성자 codex(단이) · 2026-11-17 00:52 KST · 제안(검수 대기)

**이 최종절은 앞선 .17 r107 준비절의 기기/키보드/캡처 ‘검수 진행 중’ 표현을 보정합니다.** r107은 Menu81/총541·6화면(3page+3modal)·10연결이고 SHA `75bda424a32d2e998fc2043547259d4b6a1b3ad0b07f4e99d1dfb1e787664cc6`가 기기변경·기준복귀 뒤에도 불변입니다. 다른 기존5화면 deep equality·원8연결·Main Menu stableID를 보존했습니다. **현재 기본 전체캔버스의 최종 재열기는 본체 마감 검수 중**이며 이 절에서 통과를 주장하지 않습니다.

native fullscreen modal에서singletexture dim과blocking/ARIA가같이동작한실제상태는Menu열림Maininert속성존재/triggeraria-disabledtrue·첫Shop초점이며닫힘때속성제거/false·원trigger복귀입니다. consumer의실제입력결과와저장presentation정의를함께확인했습니다. 그룹배지component||isGroup보완으로9자식글자가비고6개0배지가숨었으며기존5화면/8edges를보존했습니다.

fixed top내용과가변세로Drawer/루트bottomFooter는390×844·430×932profile에서root/panel/row비율과끝위치를검수했습니다. image등록→실제source대기→slices입력과fullfill32²/zeroedge의책임을유지합니다. r107사진crop60,75,1111,1111·Close.skin없음·CSS focus0px가native실제값으로닫혔습니다.

Resize observer반영전한프레임의old408폭/160px세로넘침을stable299.261×534.429/overflow0으로재확인했습니다. 이사례는resize단계의관찰이며새reflow기능이나캐시/전역정책수정으로설명하지않습니다. CSS focus 한규칙뒤verified479/479·exit0/이후source0을확인했고기본canvas최종재열기는별도본체마감검수로남깁니다.

본체 실제 입력은 Menu click/Enter/Space→첫Shop초점, Close click/Enter 및 Escape→Main/Menu초점복귀입니다. 열린동안 Main의inert속성값은빈문자열(속성존재)/Menu aria-disabled=true,닫으면inert제거(null)/aria-disabled=false였습니다. 실제9배지의native글자는모두빈칸·6개0배지는숨김입니다. 단일32²fullblacktexture opacity.7/engine.dim=false의정확경계,CloselegacySkin없음,새로열기뒤직사각focus radius0px(이전50%)를확인했습니다. 원본정확dim alpha .7확정이나숨은목적지구현을뜻하지않습니다.

문서 담당이 [브라우저 기록](../../../../docs/evidence/20261117-menu06/browser-checks.json)·[파일 검증](../../../../docs/evidence/20261117-menu06/file-verification.json)을 직접 읽었습니다. Menu사용18고유자원이등록되어있고그중신규11개(SVG8+solid3)입니다. 기본재사용5+SNS/공통Badge는신규수에더하지않습니다. 최종프로필crop[60,75,1111,1111]/9개알림alt/9행307.15×56.21·3점/6숨김·Close.skin없음도저장대조했습니다.

CSS focus 보완 후 [menu06-final-verified-tests.log](../../../../_작업/codex/ux-studio/menu06-final-verified-tests.log)의 **479/479·fail0·cancelled0**을 직접 읽었고 본체가 process13769의 **exit0 완료**를 확인했습니다. 이후 제품source변경0입니다. CSS전의동일479로그와합산하지않습니다. 이문서담당은시험/브라우저를재실행하지않았으며 actual 입력·기기값은본체증거/전달값입니다.

기본캔버스최종재열기는본체마감append를우선합니다. SHOP08/SHOWROOM07연결은실제목적지조립뒤이며나머지7메뉴목적지는미관찰·미설정입니다. 원본폰트/픽셀동등·정확dim alpha·게임기능·7007/LSB native·사용자승인/freeze는미완료입니다. **W/P/U/S0/4·10장최종동등0/10·제안(검수대기)**, 주간87/90·2026-11-17 08:00 KST 중지선·기존 ui30분만유지합니다. 공통.16/.17준비기록·프로젝트guide.4·원본을보존하며새예약/서버/빌드를만들지않습니다.

최종이미지: [nativeclip551×985](../../../../docs/evidence/20261117-menu06/menu-r107-phone.jpg) · [CSS1440](../../../../docs/evidence/20261117-menu06/menu-r107-css1440.jpg) · [CSS430 stable](../../../../docs/evidence/20261117-menu06/menu-r107-css430.jpg) · [CSS1920](../../../../docs/evidence/20261117-menu06/menu-r107-css1920.jpg). [resize중간프레임](../../../../docs/evidence/20261117-menu06/menu-r107-css430-resize-transient.jpg)과 [focus보정전](../../../../docs/evidence/20261117-menu06/menu-r107-phone-before-focus-correction.jpg)은진단본으로보존하며최종결과와구분합니다.


## Warehouse07 조립 기록 · .18 · r146 중간 기준

작성자 codex(단이) · 2026-11-17 01:54 KST · 제안(검수 대기)

문서 담당의 최초 읽기는r137 Warehouse84/전체625·11edges였고, 본체의Info3부품·Tone2판/앵커·연결보완 뒤 **r146 Warehouse89/전체630·4page+3modal·13edges**를 다시 읽었습니다. r146 SHA는 `76821e1f73800edc096aaa2a1c01f4f7937d88d43b504c626e20ba9e6e2c8227`입니다. 이 절은중간저장/제작방법이며 **Warehouse07 최종기기·연결왕복·native탭/키보드·캡처 QA통과나화면완료를주장하지않습니다. 본체후속최종append를우선합니다.** 공통.16/.17·프로젝트guide.4·이전본문은보존합니다.

루트Page_Showroom_Shields안에는peachfullfill·Shields본문·categorybar·Footer를분리합니다. Cabinet/Viewport/columns의stretchY와cases/arch/title/count/equipped의topfixed·bar/footerbottom은schemaVersion4 native앵커책임입니다. shelfviewport overflowclip이세번째하단을가리며3case는동일크기를유지합니다.

상단architecture그림은새cabinet의region0,0,551,364만사용합니다. 하단case는native9fill/frame source160×112/slice24/edge14/pad0·힌지·개별상품·메달그림/nativeM·Tone판으로나눕니다. Maincash9클론은한asset과기존region을공유하고해적방패를재사용하며SNS를새Warehouse자원으로계산하지않습니다. 소유/잠금엔진을그림의어두움에서추정하지않습니다.

nativecontrol.type=tabs의labelModeicon은시각표시옵션이고options라벨/ARIA/선택상태의의미를지우지않습니다. 기본category02의panelId만Shields본문을가리키고다른3본문은미관찰빈상태입니다. 본체이력은r124저장뒤7018cache오류를자신의PID44569관리로정리하고r125에icon모드를저장한사례이며지금의서버상태나신규재시작절차가아닙니다.

UI의action/target수정후conditionunknown초기화를인지하고always를마지막에저장해야합니다. r146의세연결은always로읽혔고nativeMainShield진입한건은본체전달입니다. MenuShowroom진입/Back/Main복귀·탭접근성·기기/캡처최종검수는별개로남깁니다. 482소스통과만으로전체UI/10화면을완료처리하지않습니다.

직접 읽은 근거: [지정0100보고](../../../../docs/collaboration/reports/20261117_0100_warehouse07.md) · [07원본](../../../../docs/reference/monopoly-go/20261116-ten-screens/07_shields.png) · [측정표](../../../../_작업/codex/ux-studio/warehouse07-assembly-quick-sheet.json) · [아트7](../../../../_작업/codex/ux-studio/warehouse-art-assets.json) · [개별상품4](../../../../_작업/codex/ux-studio/warehouse-products-assets.json) · [기하UI12](../../../../_작업/codex/ux-studio/warehouse-ui-assets.json). 새준비23개의production/staging SHA를직접대조했고r142자원읽기에서Warehouse참조신규20개(art4/products4/UI12)·총25고유assetRef를확인했습니다. cash-dice/gift-dice/cash-pack혼합bundle3개는준비됐지만이화면참조에없습니다. 생산/준비/정식등록/참조/실화면검수는구분하며manifest의제작시점미등록표시를현재상태로그대로옮기지않습니다.

[warehouse07-full-tests.log](../../../../_작업/codex/ux-studio/warehouse07-full-tests.log)의본체전체482/482·fail0·cancelled0을문서담당이읽었고본체가exit0을전달했습니다. 이담당의시험/브라우저재실행은0입니다. .17의479는앞단위이력이며이번실검수로합산하지않습니다. 본체전달MainShield클릭진입1건과설정13edges를전체진입/복귀QA통과로확대하지않습니다.

원본07은방패종류만관찰했습니다. 다른3종류본문·Info목적지·실제장착/소유/잠금/해금/가격·카운터게임연동은미확인입니다. 모자/방패/주사위/표정은우리native접근성라벨이며원본에표시된글자라고하지않습니다. 원본폰트/픽셀동등·게임로직·7007/LSB native·사용자승인/freeze는미완료입니다. **W/P/U/S0/4·10장최종동등0/10·제안(검수대기)**, 주간88/90·2026-11-17 08:00 KST 중지선·기존ui30분만유지합니다. 새예약·intake순회·서버기동은하지않습니다.


## Shop08 파일 기준 진행 보정 · .19 · r170

codex(단이) · 2026-11-17 02:45 KST · 제안(검수 대기). r153 Shop26/전체656에서 **r170 Shop115/전체745·8화면·14연결**로진행한저장파일을직접읽었습니다. **실화면미검수이며Shop완료가아닙니다.** 기존.16/.17/.18본문과프로젝트guide.4는보존합니다.

6카드부모는동일156.27×224.98,fill/frame148.19×224.98입니다. Qty/More/Bonus/Price/native문구와dice·리본·입력을분리하고Buy는wrapper+BG+Txt의3부품입니다. Offer1+상품6의7Buy는tintself/engineShadow0·3·3·.25저장값이며7개실제눌림검수라는뜻이아닙니다. Dots5·Info·장식·앵커·메인/메뉴입구·최종QA는미완료입니다.

**02:19사용자계속지시는90%후재개로반영했지만,02:37브라우저자동승인검토는과거90%조건으로7018접근을거절했습니다. 사용자수동차단이아닙니다.** 본체가90%조건해제/7018편집·검수명시승인을async1회요청했고답대기입니다. 답과실제도구허용전브라우저입력/읽기·대체표면/CDP/HTTP관찰우회·외부JSON조립은하지않습니다. 현재는허용된파일준비/로컬검증만진행합니다.

새제품source변경/이번회귀재실행은없습니다.483/483은r146창고의이전소스시험이며r170Shop실검수로쓰지않습니다.09UI8+재사용3/33좌표와10UI6+재사용5/85좌표측정은로컬자원검증·본체contact확인된준비물입니다. **09/10제품UI조립0·10장최종동등0/10·W/P/U/S0/4**를유지합니다. 실제구매/결제·게임/원본폰트·픽셀동등·7007LSBnative·승인미완료입니다. 사용량실조회/계정허용·11/17 08:00KST중지선·리셋/구매금지유지,기존ui30분은본체만관리합니다.

현재recipe는개별native글자·dice·native9fill/frame·native3리본/BuyBG·wrapper/label·엔진그림자분리입니다. 이번단위에서제품source를수정하지않았으며모델/파일검증가능과7018브라우저실행권한은다릅니다. .19를JSON직접수정에의한UI조립허가로해석하지않습니다.

근거: [Shop측정](../../../../_작업/codex/ux-studio/shop08-assembly-quick-sheet.json) · [ShopUI준비](../../../../_작업/codex/ux-studio/shop-ui-assets.json) · [09UI준비](../../../../_작업/codex/ux-studio/racing-ui-assets.json) · [09측정](../../../../_작업/codex/ux-studio/racing09-assembly-quick-sheet.json) · [10UI준비](../../../../_작업/codex/ux-studio/tycoon-ui-assets.json) · [10측정](../../../../_작업/codex/ux-studio/tycoon10-assembly-quick-sheet.json). 실제후속결과는 [본체Shop보고](../../../../docs/collaboration/reports/20261117_0200_shop08.md)의최신절을우선합니다.


## 페이지를 화면 전체 팝업으로 전환 · 2026-11-17

상세 편집 왼쪽 프로젝트의 화면/레이어 탭에 현재 화면 종류와 선택적 전환 이름을 표시합니다. 시작 페이지를 제외한 page를 fullscreen modal로 전환하며 화면·부품 stable ID, 부모·좌표·자원·캔버스 위치·logicalSize를 보존합니다. 이름은 전환 폼에 직접 입력한 경우만 바꿉니다. 팝업도 화면 목록에서 다시 선택할 수 있고 배경 페이지는 별도로 유지합니다.

[screen-conversion.mjs](../screen-conversion.mjs)는 복제한 설계에서 해당 화면으로 들어오는 navigate를 open으로, 해당 화면에서 나가는 back을 close로 바꾸고 기존 문서 검증을 통과한 결과만 반환합니다. 다른 연결의 ID·조건·payload·대상은 보존합니다. 기존 연출·닫기 정책은 보존하고 없는 정책에는 modal 기본값을 채우며 type=modal/rootMode=fullscreen을 지정합니다. [main.mjs](../main.mjs)는 이를 edited() 한 번으로 적용해 Undo/dirty/저장 흐름에 연결합니다.

페이지→팝업만 지원합니다. 역전환은 전환 직후 Undo로 복원하며 기존 modal/sheet/toast나 시작 페이지를 강제로 바꾸지 않습니다. 배경부품 삭제·사용자 지정 딤·원본 화면 이름 일괄변경은 전환 기능이 수행하지 않습니다. 실제 설계 조립·실화면 검수 결과는 본체 보고에서 별도로 확인합니다.


## Shop08 팝업 제작 절차 · .20 · r184

codex(단이) · 2026-11-17 09:19 KST · 제안(검수 대기). 본체가 전달한 저장/실행 기록을 반영합니다. 문서 담당은 소스 시험 로그와 로컬 캡처 파일만 확인했으며 브라우저·시험을 재실행하지 않았습니다.

최신 전달값은 `ux-gjs-0d80d7fe` **r184·8화면(4page+4modal)·766부품·Shop136·16연결·22 refs**입니다. 기존7화면의 요소와 원래13연결은 보존됐습니다. r183의63/65와 Shop HUD Cash/Dice2건은 보존 이력이며, 원자적 입력 모드 변경/Undo 보완 뒤 native UI로 두 표시부품의 `none` 및 상속된 `buttonState` 제거를 저장한 r184 정적 재검증은 **65/65**입니다.

이 절은 앞선 “페이지를 화면 전체 팝업으로 전환” 구현 계약에 Shop 실제 사용 절차를 추가합니다. 전환은 복제한 문서에서 검증한 뒤 현재 설계에 하나의 편집으로 적용하며 non-entry page의 ID/부품/자원/좌표를 유지합니다. incoming navigate→open/outgoing back→close를 함께 바꾸고 즉시 Undo가 원래 종류와 연결을 되돌립니다. 기존 modal/sheet/toast나 시작 페이지를 강제 전환하지 않습니다.

Shop 내부에 있던 복제 board group+image를 native 삭제하고 실제 Main을 backing page로 유지했습니다. 기본 engine dim=false와 별도 black.72를 분리하며 editor/runtime 모두 같은 overlay 정책을 반영합니다. Menu 위 Shop은 기존 modal stack에 한 층을 더하는 구조이므로 Menu를 새 페이지로 복제하거나 전역 딤1개로 합치는 구조를 추가한 것으로 설명하지 않습니다.

MenuSHOP 입력 wrapper의 연결은 일반 속성의 연결·조건에서 조절합니다. 공통 binder의 page-only 선택과 혼동하지 않습니다. action/target 편집→condition always의 순서를 지키며 기존 source의 unknown 초기화와 stable edge ID를 보존합니다.

32px texture의 default16+16 source-center0은 등록 유효성 조건입니다. caps0로 등록한 뒤 실제 source와 맞는 slices/edges/padding0을 입력합니다. primitive surface의1%inset을 없애는 전역 source 변경 대신 full opaque texture plane을 사용합니다. cloud/candle/bat/characters와 native text/cards/입력/엔진 shadow는 별도 계층이며 PNG에 딤·그림자·가격을 굽지 않습니다.

Shop HUD Cash/Dice의 상속된 buttonState와 none 입력은 같은 편집에서 정리하도록 보완됐고 native UI 저장 r184 정적65/65를 확인한 것은 본체 기록입니다. 이 문서 변경이 제품 source·실행 모델·프로젝트 guide.4를 다시 수정하지는 않습니다.

본체 최종 전체 시험은 **494/494·fail0·cancelled0·exit0**입니다. 앞서 대기였던492/493은 예상치/중간 기록이며 통과 수로 합산하지 않습니다. 새 r184 CSS430×843 팝업 캡처는 failed0/loading0/가로·세로 overflow0/Shop 복제 배경0이며, 파일은537×1055px로 직접 확인했습니다. 이전 r183의430 HMR 복귀 후 Main을 담은 잘못된 Shop 파일명 캡처는 중간 증거로 보존하고 팝업 검수로 세지 않습니다. 본체 CSS1920×1280 팝업도 failed0/loading0/overflow0이며 파일2400×1600px와 phone clip551×985px를 직접 확인했습니다. 상세390×844/430×932에서는 HUD폭 비율.9694·카드폭 비율.2836·footer 하단 간격 약0과 세로 body 가변/카드 고정, device→design551×984→100%→fit 왕복 및 r184 저장 표시를 본체가 확인했습니다. 22개 자원 HTTP200·응답/로컬 SHA 일치도 본체 기록이며 문서 담당은 해당 JSON22건을 대조했습니다. **10장 최종 동등0/10·W/P/U/S0/4**와 폰트/게임/구매/최종 사용자 승인 미완료를 유지합니다.

현중의08:35 직접 재개·90% 제한 해제·7018 편집/검수 승인 이후 수동작업 기록입니다. 91→92% 계정 조회 이력과 현재 계정 허용 확인을 새 백분율 상한으로 바꾸지 않습니다. 종료된 기존 ui 자동화는 **PAUSED**로 보존하며 새 마감·상한·예약 재개를 만들지 않습니다. 리셋·구매 금지와 보호범위는 유지합니다.

근거: [본체 수동 재개/팝업 보고](../../../../docs/collaboration/reports/20261117_0835_shop_popup_resume.md) · [최종 전체 시험 로그](../../../../_작업/codex/ux-studio/shop-popup-final-tests.log) · [r184 모바일 팝업 파일](../../../../docs/evidence/20261117-shop-popup/shop-popup-r184-mobile430.jpg) · [r184 1920 팝업 파일](../../../../docs/evidence/20261117-shop-popup/shop-popup-r184-desktop1920.jpg) · [브라우저 검수 기록](../../../../docs/evidence/20261117-shop-popup/browser-checks.json) · [22자원 HTTP/SHA 기록](../../../../docs/evidence/20261117-shop-popup/asset-http-checks.json) · [Shop 기하 자원](../../../../_작업/codex/ux-studio/shop-ui-assets.json) · [분리 구름띠 supplement](../../../../_작업/codex/ux-studio/shop-header-cloud-assets.json). 저장/소스/실제 입력·화면·파일 픽셀을 구분하며 본체가 관찰한 범위만 기록합니다.

## Racing09 Tycoon10 제작과 검수 · .21 · r248

codex(단이) · 2026-11-17 11:10 KST · 제안(검수 대기). 본체 native 저장/실행 기록과 로컬 증거를 반영합니다. 문서 담당은 원본/최종 PNG·JSON/시험 로그·파일픽셀을 확인했고 브라우저·HTTP·시험은 재실행하지 않았습니다.

최신 `ux-gjs-0d80d7fe` **r248·10화면899부품/Tycoon98·20연결**은 아치64→0→Undo64 뒤 동일내용으로 재저장한 본체 기록입니다. 현재 로컬r248의 수와 직전r247 정적360/360·23자원HTTP/SHA를 구분합니다. Racing r200은9화면801부품/Racing35·18연결·정적126/126·14자원HTTP/SHA로 별도 기록합니다.

Racing은fullscreen root딤과중앙551×984 Content를분리합니다. Panel/Title/Boost/Close는Content고정형제이며device390/430에서위아래여백이거의같았습니다. 부모변경이형제순서를바꾸지않는계약때문에가린Close는native맨앞조작으로해결했습니다. 복제연결을먼저검사해중복Closeedge를만들지않습니다.

Tycoon scene/header,rankviewport/scrollcontent,고정self행/Close를분리합니다. scrollTop0→45에서row만움직이고header/self는불변인본체AXwheel기록이있습니다. scene/보상/닉네임/숫자·shape·9/3slice·shadow/입력은독립계층입니다. source를보존하고cover+image.topArchHeight64로표시만clip하며0은끔입니다. native64→0→Undo64후동일내용r248저장범위이고입력사각형/rect/부모를바꾸거나임의mask/원본곡선동등을뜻하지않습니다.

MainTycoon BG/Frame의mousehit은정확한2기존ID/interaction.mode none→parent UI편집으로해결했습니다. 이외r2009화면/18edges는보존했습니다. keyboardEnter성공만으로pointer경로를정상으로보지않으며이후mouse/Space입구·Close/Escape초점·Tabtrap을구분검수했습니다.

현재AX setValue→Tab으로속성값을확정합니다. rectPx fill은수치적용버튼이model편집을커밋합니다. timer18/qty9개17nowrap은source폰트불명시각보완으로기존rect/문구/수치/recipe원안을유지합니다. 단일필드/Undo와저장/재열기를구분하고외부JSONsetter로조립하지않습니다.

최신본체소스시험502/502·fail0/cancelled0입니다. Shop494/Racing정적126/Tycoon정적360은시점과종류가달라합산하지않습니다. 문서담당은로그/기록만읽었고재실행하지않았습니다. 별도VIDEO_UI_WORKFLOW와색인등록은해당담당내용을보존하며최신디스크version/sections를확인해최소병합합니다.

현중의 최신 선택은 **“7018 작업만 진행”**입니다.7007 접근·반영·목록·카드실행·화면검수는이번범위에서제외하며추가질문/재시도/다른브라우저·CDP·HTTP우회없음입니다. 과거7007반영예정은이력입니다. 명시90%상한해제·수동작업/계정허용확인을따르되새상한·시한·예약을만들지않습니다. 기존ui자동화PAUSED·리셋/구매금지유지. **10장최종동등0/10·W/P/U/S0/4**, Info본문·실제구매/랭킹/보상/시간API·원본폰트·가려진4위값·원본버전/진입조건·최종사용자승인은미확인입니다.

근거: [Racing보고](../../../../docs/collaboration/reports/20261117_0920_racing09_native.md) · [Racing실제UI](../../../../docs/evidence/20261117-racing09/browser-checks.json) · [Racing126검사](../../../../docs/evidence/20261117-racing09/file-verification.json) · [Racing14자원](../../../../docs/evidence/20261117-racing09/asset-http-checks.json) · [Tycoon보고](../../../../docs/collaboration/reports/20261117_0953_tycoon10_native.md) · [Tycoon실제UI/Undo](../../../../docs/evidence/20261117-tycoon10/browser-checks.json) · [r247정적360검사](../../../../docs/evidence/20261117-tycoon10/file-verification.json) · [23자원HTTP/SHA](../../../../docs/evidence/20261117-tycoon10/asset-http-checks.json) · [Tycoon502소스시험](../../../../_작업/codex/ux-studio/tycoon-final-source-tests.log).
