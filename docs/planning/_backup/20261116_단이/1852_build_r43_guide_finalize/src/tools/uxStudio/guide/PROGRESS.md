# UI 스튜디오 진척과 남은 작업
가이드 판: 2026-11-16.11 · 상태: 제안(검수 대기)
실제 검수 반영: 2026-11-16

## 최신 마감 보정 · .11 · r24

상태: 제안(검수 대기), 사용자 승인/freeze 없음·W/P/U/S0/4. 아래 .11의 상세390 수정 중/재시험·가이드 대비 후속 예정은 당시 기록입니다. **상세 기기 수정과 가이드 색 actual 확인은 완료**, 새 UI/아트 등록/게임 연결은 미완료로 구분합니다. 공통판은2026-11-16.11, 프로젝트 guide .4와 과거 본문/r21 증거는 보존합니다.

|항목|최신 결과|근거·남은 범위|
|---|---|---|
|최종 저장판|ux-gjs-0d80d7fe r24·1페이지63부품·0연결. 세 duplicate 배지 이미지 자식 이름을 Img_Notification_BG 복사→Img_Notification_BG로 정리해 actual 저장.|이전 r21 검수 증거 보존. r24 최신 재열기/최종 캡처는 본체 예정이며 r21 캡처를 r24로 표기하지 않습니다.|
|상세 기기 수정|제품 수정은 main.mjs만. 공통 device 변환으로 authored551×984 유지, 기기별 logical viewport/deviceScale/편집zoom 분리.|[상세 보완 보고](../../../../_작업/codex/ux-studio/detail-device-scale-report.md), [관련82/82 로그](../../../../_작업/codex/ux-studio/detail-device-scale-tests.log). 이 문서 담당은 source/로그 읽기 확인만 했습니다.|
|상세390 actual|100% canvas389.993×843.993, logical551×1192.42, HUD_Bottom389.993×198.181로 우측 끝 일치·HUDTop379.378×66.525로 안쪽.|본체 실화면 측정. 원래 발견한 root551 고정/넘침은 이 경로에서 보완·확인했습니다. 모든 기기/실물 폰/게임 엔진 검수로 확대하지 않습니다.|
|확대 왕복/큰폰|확대+ zoom1.2/scale0.8493647912885662→축소− zoom1/scale0.7078039927404719 정상 복귀. 큰폰430×932 actual429.993×931.993/logical551×1194.26.|r21 보기 변경 중 stored logical551×984·설계hash 불변 확인. 뒤의 이름 정리r24 저장과 별개입니다.|
|새 전체 시험|본체 npm test416/416·실패0, [이번 전체 로그](../../../../_작업/codex/ux-studio/bottom-standard-final-tests.log).|아래411/재시험 예정은 이전 단계. 관련82·전용124·과거 수를 더하지 않고 시험 수를 완성률로 쓰지 않습니다.|
|가이드 가독성|enabled input computed rgb(37,50,71), label rgb(70,86,109) 실제 확인. [가독성 캡처](../../../../docs/evidence/20261116-bottom-standard/build-guide-r21-readable.jpg)1900×1090.|이전 전역 dark 색 상속 문제→scoped 최소 CSS→actual 색/캡처 순서입니다. 측정하지 않은 대비율/모든 테마 통과는 주장하지 않습니다.|
|보기별 지원|전체 캔버스와 main 상세는 기기 profile 변환 지원. 별도 standalone preview는 저장 entry 기준 uniform fit만 제공.|standalone preview에는 기기 선택 menu·기기 높이별 logical reflow가 없습니다. 7007/LocalServerBrowser native 앱도 미검수입니다.|
|새 짓기 아트|도시1장 생성1회,5랜드마크 sprite sheet 생성1회·원 PNG 보존, 개별 production은300000bytes 이하.|[도시 manifest](../../../../_작업/codex/ux-studio/build-city-assets.json), [랜드마크 manifest](../../../../_작업/codex/ux-studio/build-landmark-assets.json). alpha16 tight crop은 내부 source pixel을 바꾸지 않고 master의 저알파 fringe는 보존합니다. 아직 UI 미등록·배치/최종 그림 검수 남음.|
|10화면/다음|10원본/132계층/43연결·미확인 항목은 [조립 명세](../../../../docs/plans/20261116-ten-screen-assembly.md).|실제10화면 구성/연결이 아닙니다. 본체 최종 보고 뒤 다음 짓기 UI·진입/닫기/복귀 제작을 이어갈 범위입니다.|

네 메뉴의 동일 규격·native text name·compound 배지와 source/3·9slice/그림자 분리 원칙, AX native 입력→Tab/blur→현재 선택/저장값 재확인 원칙은 계속 적용합니다. 버튼 image-mode 샘플·GO 실제 상태·원본 폰트·Unity 전체·게임 동작/연결·사용자 승인은 미완료/미검수입니다.

본체 전달 운영 상태는 시한2026-11-17(화)08:00 KST·최종 주간74/90이며 기존 ui 30분 ACTIVE입니다. 이번 문서 단위는 새 예약/서버/제품 시험/브라우저 조작을 수행하지 않았고 STATUS/공용 보고·제품/설계 JSON을 수정하지 않았습니다. .11 최신 보정 전 백업: `docs/planning/_backup/20261116_단이/1747_guide_v11_r24_final_correction/`. 문서 검증은 기존 본문 보존·7종/index·링크 확인입니다.

## 최신 실제 상태와 미완료 · .11

공통판2026-11-16.11 · 제안(검수 대기). [현재 로비 제작 표준](TOOL_SPEC.md)의 .11을 먼저 읽습니다. 아래 .10 이하 본문·AI for UI 추가절·프로젝트 guide .4는 보존한 당시 이력입니다. 최신 r21 actual 결과는 대표 본체가 전달했으며 이 문서 담당은 소스/기록 읽기와 문서 검증을 했고 브라우저 조작·제품 시험을 재실행하지 않았습니다. 현재 UI 승인/freeze 없음·W/P/U/S0/4입니다.

|범위|이번 확인 결과|남은 것/출처 구분|
|---|---|---|
|실제 저장판|ux-gjs-0d80d7fe r21·1페이지63부품·0연결|actual 도구 편집/저장 결과. 새10화면·게임 연결은 미완료.|
|4메뉴 규격/이름|각80×92/icon64²@(8,6)/Txt80×22@(0,70),font14·500·line18. Btn/Img/Txt_BottomNav_Wins/Build/Album/Friends 역할별 이름 적용.|기존 ID/부모를 현재 설계에서 확인하며 이어 사용. 원본 폰트 설정값 아님.|
|4compound 배지|28²@(52,0), Wins0숨김/Build5/Albumdot presence1/Friends4. Img_Notification_BG+Txt_Notification_Count, white18·700.|실제 자식 폼 조립 완료 범위. 부모 notification1개, renderer/legacy 계약은 [compound 보고](../../../../_작업/codex/ux-studio/compound-notification-report.md). fixture와 게임 정책 구분.|
|배지 source|112²/논리28²에서 white rim3px·WebP1632bytes, 문구/그림자 없음.|[manifest](../../../../_작업/codex/ux-studio/notification-circle-assets.json)에 hash/authoring/production/import 경로.|
|상하단 그룹|HUD_Bottom551×280·기존14root·fixed bottom, HUDTop536×94@(9,12)·fixed top.|14root와 전체63부품을 구분.|
|전체 캔버스 기기 보기|profile/custom414×896·방향 commit 실제 변경, 설계 저장판r17 상태 유지.390×844 board389.997×843.987, 논리H1192.42.|보기·설계 기준·편집 확대율 구분. main 상세390 root551 고정/넘침 발견→담당 수정 중, 전체 preview 통과 아님.|
|390 비례 실제 측정|4메뉴56.610×65.112/icon45.288²/label56.610×15.566/badge19.810², 원 값×390/551.0배지hidden·깨진 이미지0.|그 전체 캔버스 actual 범위이며 실물 폰/모든 반응형 기기 검수 아님.|
|개별 디자인 가이드|4메뉴 정확한 heading/W80H92 상시 실표시 확인.|enabled W필드 color rgb(200,213,228)이 전역 dark label에서 상속되어 밝은 배경에 흐림 확인. scoped label/input 색 보완은 본체 수행, 후속 실화면/캡처 예정.|
|버튼 두 방식|[상태 엔진 보고](../../../../_작업/codex/ux-studio/button-state-report.md)124 전용 통과. actual 네 메뉴 image child tint UI 저장·normal→click 후hover/다른3normal 확인.|image-mode 샘플·GO actual 미검수. 지원5상태와 모든 버튼 샘플 검수는 별개.|
|본체 전체 시험|[이번 최종 로그](../../../../_작업/codex/ux-studio/bottom-standard-final-tests.log)411/411·실패0.|초회410/1은 새 함수 VM fixture 누락→실제 함수 fixture 보완 후 통과. 이후 상세390 보완 때 재실행 예정. 전용/과거 시험과 합산하지 않음.|
|현재 검수본 진입|current-review.json→ux-gjs-0d80d7fe, bare7018 actual browser r21 진입 성공.|명시workspace/project 보존.7007/LSB native 앱 미검수·전체 native cache/중복 서버 버그 단정 금지.|
|새 아트/10화면|짓기 도시 그림1회295148bytes 준비·미등록.10원본/132계층/43연결·미확인 항목은 [조립 명세](../../../../docs/plans/20261116-ten-screen-assembly.md).|명세 수는 실제 조립 수 아님. 현재0연결·새 페이지 조립/진입·닫기·Back/복귀·게임 기능은 남음.|
|AI for UI|[적용 계획](../../../../docs/plans/20261116-ai-for-ui-adoption.md)과 기존 TOOL_SPEC 추가절 보존, 필요한 제작/검토 방법만 선택 편입.|자동 설치0/런타임 패키지 추가0. 전체 스킬 실행·하드웨어/성능 측정 완료 아님.|

실제 입력은 현재 AX 선택→native 변경→Tab/blur→재표시→저장값 확인입니다. checkbox 재렌더 후 현재 선택/새 필드/저장값을 다시 찾습니다. 자동화 fill 미반영은 조사 근거이며 곧바로 제품 버그 판정이 아닙니다. 가이드 입력 가독성도 전역 상속/배경/disabled·실제 computed 값을 구분하고 새 CSS의 실화면 결과는 후속 확인 뒤 기록합니다.

본체 전달 운영 상태는 최종 시한2026-11-17(화)08:00 KST·주간73/90·기존 ui 30분 ACTIVE입니다. 이 문서 단위가 예약 생성/재개·서버 실행을 한 것은 아닙니다. 제품·설계 JSON·공용 STATUS/보고를 수정하지 않았습니다. 문서 백업: `docs/planning/_backup/20261116_단이/1736_lobby_actual_guide_v11/`; 가이드 대비 보완 백업은 본체의 `docs/planning/_backup/20261116_단이/1738_guide_field_contrast/`입니다. 사용자 명시 컨펌 전 방법/hash/revision/캡처의 승인 freeze는 만들지 않습니다.

## 최신 로비 상태와 검수 경계 · .10

공통 가이드 2026-11-16.10은 기존 7종 안에서 로비 제작 노하우를 정리한 제안(검수 대기)입니다. [TOOL_SPEC의 로비 제작 표준](TOOL_SPEC.md#로비-제작-표준)이 단일 현재 절차입니다. 아래 .9 이하 “현재/진행 중”·원본 r29/r30·시험 수는 각 시점 이력이며 새 작업의 현재 상태를 대신하지 않습니다. 사용자 명시 UI 컨펌·승인 freeze는 없고 W/P/U/S는 0/4입니다.

|범위|확인한 근거|현재 상태/남은 검수|
|---|---|---|
|상단 잘림 보정|[상단 잘림 보고](../../../../docs/collaboration/reports/20261116_top-clipping.md): actual UI에서 HUD 부모 y+12, SNS Frame 전역 [9,10,96,96], 저장·재열기. 기준본 ux-gjs-723cb977 r1, 551×984·1페이지51부품.|당시1440 캔버스·1920 preview·CSS430×844에서 확인. 과거 사진 y=-2 제안은 최신 배치가 아닙니다. 현재 메뉴 작업의 최종 revision으로 고정하지 않습니다.|
|원본·그림·9프레임·그림자|[단위 가이드 편집 보고](../../../../docs/collaboration/reports/20261116_unit-guide-editing.md)의 실제 직접 편집/Undo·이미지 빼기/넣기·색 유지, Frame300×80/620×110/461×54의 동일 source·edge27, Normal/Disabled 그림자 합성 확인.|원본 폰트·픽셀 동일성·Unity 전체 미확인. Pressed 그림자 실화면 미검수. 현재 2D 공원 배경은 새 콘셉트 그림이며 실제 3D 엔진이 아닙니다.|
|동일 역할 4메뉴|[공통 규격 계획](../../../../docs/plans/20261116-bottom-menu-standard.md), [작업 보고](../../../../docs/collaboration/reports/20261116_bottom-menu-standard.md): 80×92/64²/80×22/28², 배지 x52/y0. 네 텍스트 name은 표준표에 명시.|원본의 관찰값과 이번 제작 규칙을 구분했습니다. 실제 4메뉴 조립·이름 적용·저장/재열기·실화면 검수는 본체 진행 중. 이전 배지 y=-4 제안 폐기.|
|공통 알림 엔진·속성 UI|[알림 보고](../../../../_작업/codex/ux-studio/notification-report.md), [전용 로그](../../../../_작업/codex/ux-studio/notification-tests.log): 62/62. count/dot·0숨김·99+·flat runtime key·검증 구현.|실제 4배지 조립/실화면은 진행 중. 현재 단일 badge panel.span이며 진짜 자식 숫자 텍스트 폼 분리는 아직 미구현.|
|가이드 W/H 상시 표시|[W/H 보고](../../../../_작업/codex/ux-studio/guide-wh-report.md): viewer 14/14 전용 시험. 상세 치수 토글과 독립한 선택 바깥 W/H 표시 구현.|담당 단위에서는 실제 브라우저 검수를 하지 않았고 본체의 최신 실화면 검수 진행 중. 선 색/보기 설정과 디자인 색은 별개.|
|기본 진입·소스 캐시|bare entry만 current-review 메타 사용, 명시 workspace/project 보존, Grapes 고정 v 모듈 entry 제거. [진입 회귀 로그](../../../../_작업/codex/ux-studio/review-entry-green.log) 9/9와 기본7018 HTTP302 확인.|7007 Browser 권한 차단은 별도. LocalServerBrowser 앱 바이너리·native cache 전체·서버 중복 실행 버그는 미검수/미확정.|
|본체 전체 자동 시험|[이번 전체 로그](../../../../_작업/codex/ux-studio/bottom-standard-full-tests.log): 385/385, 실패0.|이 문서 담당의 재실행이 아닙니다. 62/14/9와 범위가 겹쳐 합산하지 않고 실제 메뉴 조립·동작·UI 승인으로 확대하지 않습니다.|
|전체 캔버스 모바일·10장 화면|신규 기기 선택·직접 W/H 입력·기준 설계/preview 분리·비례 반응형, [10장 제작 계획](../../../../docs/plans/20261116-monopoly-ten-screens.md).|다른 담당 구현 예정인 계획입니다. 기존 상세 편집 logicalSize/앵커 지원과 구분합니다. 10장 전체 제작/이동·Back·복귀·게임 연결은 미완료.|

native 입력 확인은 실제 입력→Tab/blur→재표시 값→저장→재열기 순서로 남깁니다. 자동 locator.fill 미반영을 곧바로 제품 버그로 단정하지 않습니다. 실제 탭의 모듈 판·선택 ID·이벤트와 저장값을 대조합니다. 시험 수·측정 박스 수·자원 수·문서 판 수는 제작 완성률이 아닙니다.

이번 문서 단위는 공통 guide/index만 갱신했습니다. 제품 소스·설계 JSON·프로젝트 guide .4·공용 STATUS/보고를 수정하지 않았고 제품 시험·브라우저 검수를 새로 실행한 것으로 기록하지 않습니다. 문서 검증 범위는 7종 index/판 일치, 이전 본문 보존, 새 링크 대상 확인입니다. 수정 전 백업: `docs/planning/_backup/20261116_단이/1642_lobby_production_standard_guide_v10/`. 사용자 특정 버전 명시 컨펌 때만 방법·원본 hash·revision·실제 캡처를 고정합니다.

## 현재 상태 · .9 직접 편집 디자인 가이드 요구 보존

직접 편집 구현과 실제 브라우저 검수는 대표 본체에서 진행 중입니다. .9는 최신 요구·원리·사용 순서의 문서 보존이며 새 기능 완료·화면 통과·현재 UI 승인을 뜻하지 않습니다. 문서 설명서(openManual)의 읽기 전용 표시와 실제 부품을 고치는 디자인 가이드를 구분합니다.

보존한 요구는 선·위치/크기 편집의 같은 screen/element ID·parentId·기존 연결 유지와 실제 설계/undo/redo/dirty/저장 반영, 이미지 넣기와 원파일·부품을 지우지 않는 참조 해제, 선택 부품 중심·치수 외곽 배치·하위 선 on/off, 계층 행 전체 선택과 독립 펼침, 레이어·중앙 캔버스·속성 세 영역의 두 경계 폭 조절입니다. 실제 사용 순서는 USER_GUIDE.md, 계약은 TOOL_SPEC.md, AI 보존/검수 규칙은 AI_GUIDE.md, 상태 연결 원리는 ARCHITECTURE.md에 둡니다.

관찰 근거는 `_작업/codex/ux-studio/20261116-board-measurements/independent-measurements.json`과 같은 폴더의 `notes.md`입니다. 원본 551×984px에 상위 25개/전체 67개 박스의 원본 px·중심·W/H 비율을 기록했습니다. 이는 관찰 자료 수이며 설계 부품 수·검수 통과 수가 아닙니다. 잉크·실색은 대체로 ±1px, 외곽·가림은 ±2px이고 숨은 경계는 미확인입니다. 실제 원본 font-family/size/weight/line-height는 미확인입니다.

전체 화면 Slot_3D/별도 2D overlay·Img_SNSAvatar·명시 컨펌 이후 승인 스냅샷/방법 기록은 아래 .8 요구를 유지합니다. 공통판은 2026-11-16.9이며 기존 안내 목록 7종, 프로젝트 guide .4/metadata와 과거 설계를 보존합니다. 이번 문서 단위에서 제품 코드·설계·자원·실측 JSON·공용 STATUS를 수정하지 않았고 자동 시험·실제 브라우저 검수·승인 스냅샷을 수행한 것으로 기록하지 않습니다.

문서 백업: `docs/planning/_backup/20261116_단이/1345_editable_design_guide_v09/`. 문서 단위 참고 기록: `_작업/codex/ux-studio/editable-design-guide-v09.md`. 아래 .8의 측정 진행 표현·시험 수·백업 경로는 당시 기록이며 이번 구현 검수 결과가 아닙니다.

## 직전 상태 · .8 전체 3D 바탕/2D overlay·비율 측정·명시 컨펌 기록
현재 UI는 제안(검수 대기)입니다. 사용자 직접 정정을 기존 가이드에 반영하며 새 문서 목록이나 도구 선행 기능을 추가하지 않습니다. 현중이 특정 버전을 명시적으로 컨펌하기 전 승인 스냅샷을 만들거나 현재 UI를 승인됨으로 기록하지 않습니다.

직접 원문: “3d 화면이 전체에 깔리고 그 위에 오버렙이잖아.. 그리고 하단의 버튼 과 바텀 메뉴 상단도 왼쪽은 sns 이미지 이고.. 다시 화면을 분석해” / “사이즈를 비율료 계산해서 측정해서 만들어” / “아이콘의 높 낮이 크기..등등 폰트 위치..부터” / “내가 컴폼하면 그 순간의 기억과 방법을 가이드에 적어야 되는거야”.

Page_Board → Slot_3D는 화면 기준 x/y/w/h=0/0/100/100% 전체 화면 최하층입니다. 내용은 빈 “3D 영역” 표시만 두고 입력 없음·엔진 미연결을 유지합니다. 상단 HUD·우측 이벤트·하단 GO 버튼·재화 게이지·BottomNav는 Page_Board 아래 별도 2D 상위 형제로 overlay합니다. 중앙 13~97% 같은 일부 박스나 HUD 아래 남는 공간만을 3D 영역으로 보는 해석은 폐기합니다. 왼쪽 이미지는 Img_SNSAvatar SNS 사진 데이터 슬롯이며 새 주사위 그림으로 대체하지 않습니다. 이름 변경으로 기존 ID·parentId·연결을 재생성하지 않습니다.

대표 본체는 새 첨부 551×984px를 기준으로 실측 중입니다. 원본 hash/crop 여부, 원본 px·화면 W/H%·부모%와 변환 기준을 구분합니다. 그림 가시 bbox·중심·아이콘 높이/간격/세로 정렬, 글자 가시 bbox·기준선·위치와 폰트 추정을 기록하며 확인하지 못한 원본 font-family/size/weight/line-height 설정은 미확인입니다. 정확한 변환식은 TOOL_SPEC.md에 둡니다. 실측하지 않은 좌표나 설정값을 이 문서에서 만들지 않습니다.

현중의 특정 화면/버전 명시 컨펌 후에만 해당 버전 승인 스냅샷 문서를 보존하고 기존 가이드의 승인 기록에 당시 방법·설정·스냅샷 경로를 덧붙입니다. 컨펌 원문·KST 시각·설계 ID/revision·원본 hash·비율 측정값·계층·리소스 판·제작 방법·설정·시험/실화면 근거·미확인·다음을 남기며 이전 승인/시안을 보존합니다. 일반 “계속”이나 현재 규칙 저장은 현재 UI 승인으로 해석하지 않습니다. 이번에 승인 스냅샷 문서를 작성하지 않았습니다.

기본 캔버스 zoom +/−/Ctrl+wheel·부모/자식 각각 선택/편집·개별 유닛 디자인 가이드 뷰는 대표 본체·별도 담당 구현 중이며 실검수 대기입니다. redline A~J의 비율·간격·위치·글자 정보와 세부 편집 진입도 이 대기 범위입니다. 본체가 검수한 뒤 실제 결과를 갱신합니다. 최근 전달된 306 통과/실패 0과 아래 302/17 기록은 이전 단위 결과이며 이번 문서 작업의 실행 시험이나 새 기능 검수로 합산하지 않습니다.

공통 가이드는 2026-11-16.8, 기존 목록은 7종 그대로입니다. 프로젝트 guide .4 사본/metadata와 원본 ux-902404d6 r4·ux-gjs-61ad2d1f r14는 이 문서 작업에서 수정하지 않았습니다. 소스·설계·실측표·실제 자원·STATUS·공용 보고도 수정하지 않았습니다. 문서 백업은 docs/planning/_backup/20261116_단이/1319_fullscreen_overlay_approval_guide/, 하위 보고는 _작업/codex/ux-studio/fullscreen-overlay-approval-guide.md입니다. .7 이하 기록은 당시 상태이며 현재 배치/승인 규칙은 이 .8 절이 우선합니다.

## 직전 상태 · .7 정식 그림 제작·계층/리소스 이름
이번 직접 정정은 그림 제작 방식과 이름/보관 규칙입니다. 새 도구 기능이나 선행 개발을 추가하지 않습니다. 계획 도구 기능 다음 작업은 모노폴리 GO 정식 UI 제작입니다. 아래 .6 기능·시험 기록과 이번 제작 지시를 구분합니다. 정식 그래픽·전체 샘플과 W/P/U/S 종합검수 통과는 이 문서 갱신만으로 확정하지 않습니다.

사용자 원문 1: “분리해서 조립하지 말고 분리해서 조립한 이미지를 새로 그려서 배경을 불투명으로 처리할껀 해서 정상적인 ui로 제작해야...돼..최대한 비슷한 컨셉으로 그리라는 거야..”

사용자 원문 2: “리소스를 어떻게 정리하는지도 네이밍 규칙 같은것도 중요해..부모 자식 간의 관계에 대한 네이밍 규칙”

이에 따라 screenshot crop은 관찰·임시 W 참고로만 사용하고 정식 U는 비슷한 콘셉트로 새로 그린 자원으로 제작합니다. 필요한 바탕은 불투명, 부품 바깥은 알파로 처리하며 글자·수량·입력은 별도 요소로 둡니다. 이전 참고 그림은 보존하고 새 그림의 원본·제작 방식·판·검수 범위를 남깁니다.

계층 제안은 TOOL_SPEC.md의 Page_Friends → HUD_Top 아래 BG_TopBar·Frame_TopBar·Currency_Cash(Img_Cash, Txt_Amount)·Shield_Group(Img_Shield01~04)·Btn_Menu(Img_Menu, Badge_Notification)·Avatar_Player입니다. 역할 접두어 Page/Modal/HUD/Group/BG/Frame/Img/Txt/Btn/Input/Badge를 쓰며 자식에 부모 전체 이름을 반복하지 않습니다. name은 영문 ASCII 표시 이름, ID는 안정 식별자, parentId는 계층 정본으로 구분합니다. 이름 변경이 ID·parentId·기존 링크를 바꾸지 않습니다.

humanname은 `<scope>_<component>_<role>_<state>_vNNN.ext`, 예시는 common_hud-top_bar-bg_normal_v001.png입니다. 상태 normal/highlighted/pressed/selected/disabled 중 실제 제작한 범위만 기록합니다. 선택 ui-studio/assets/authoring/<component>/v001/에 원본, production/<component>/에 가공본을 보존하고 assets 루트 sha256 등록 풀은 현행 계약을 유지합니다. assets/resource-manifest.json이 humanname·원본/출처·제작 방식·불투명/알파·실제 크기·판·경로·등록 hash·적용 ID·미확인을 연결합니다. 미등록 hash와 미검수 상태를 완료로 채우지 않습니다.

추가 직접 정정 “3d 구간은 일단 비워두고..”, “3d 표시 해서..”에 따라 Page_Board → Slot_3D 단일 빈 연결 영역에 “3D 영역”만 표시합니다. 3D 그림/캡처/가짜 보드는 넣지 않으며 2D UI와 분리하고 입력 없음·엔진 미연결로 둡니다. 본체가 만든 스크린 참고 crop r1은 관찰/임시 W이며 정식 U 완료가 아닙니다. bar/cash/shield 새 이미지의 생성·교체 등록은 본체 진행 작업이며 이 설명서의 작성 사실과 구분합니다.

이번 하위 작업은 기존 7종 가이드와 index 안에 규칙·예시를 반영했습니다. 공통판은 2026-11-16.7이며 프로젝트 .4 guide 사본과 project.json metadata는 보존합니다. 소스·설계·실제 자원·리소스 manifest를 이 문서 작업에서 만들거나 수정하지 않았습니다. 실제 ImageGen 사용·이미지 가공·도구 등록·부모 샘플 계층 이름 적용·저장/재열기·실화면은 대표 본체 작업 보고를 따릅니다. 이 문서 예시를 실제 생성·등록 증거로 쓰지 않습니다.

문서 백업은 docs/planning/_backup/20261116_단이/1255_resource_naming_manual/이고 하위 작업 보고는 _작업/codex/ux-studio/resource-naming-report.md입니다. 문서/index 동기화·이전 본문 보존을 점검하며 코드 변경이 없어 전체 npm test를 재실행하지 않습니다. 아래 302/302와 17/17은 직전 도구/.6 설명서 작업의 실행 기록입니다.

## 직전 상태 · .6 계획 도구 기능과 .4 프로젝트 사본
정본은 /Users/max/projest_max/ui-studio/입니다. 이번 계획 단위는 전체 캔버스·프로젝트 표시, 실제 컨트롤·상태 이미지, 파일 자원, 응답형 배치·스크롤, 오버레이, AI 연결 명세까지 구현했습니다. 아래 지원 범위와 실제 시험·화면 확인을 구분합니다. 다음 제작은 추가 선행 기능 없이 모노폴리 GO 정식 UI입니다. 그래픽·전체 샘플은 미완료이며 W/P/U/S 종합검수 0/4를 유지합니다. 전체 Unity/Figma 호환·엔진 어댑터 자동 생성·게임 소스 쓰기를 새 선행 조건으로 추가하지 않습니다.

공통 내장 안내는 2026-11-16.6입니다. 기존에 생성·읽기를 확인한 프로젝트 guide 사본과 project.json guideVersion .4는 자동 갱신하지 않습니다. 이 설명서 작업은 설계·프로젝트 metadata·샘플·도구 소스를 수정하지 않았습니다. 새 프로젝트는 index.json의 판을 읽으므로 별도 소스 버전 상수 수정은 필요 없습니다.

### 구현된 도구 계약

- /ui-studio/는 기본 전체 캔버스이고 canvas.html도 같은 화면입니다. ?editor=detail은 상세 편집입니다. 상단에 프로젝트 종류·이름·실제 경로와 설계 이름·revision·미저장 상태를 표시합니다. 선택 부품 상세 편집 링크는 workspace·project·screen·element를 이어 전달하며 미저장 이동 선택을 유지합니다.
- toggle/tabs/toggle-group/slider/scrollbar/dropdown/input 7종은 설계 기본값과 runtime 시험 값을 분리합니다. 네이티브 입력·선택·키보드, disabled/readonly, 범위/step·선택 항목·필수/이메일/숫자 검증을 지원합니다. scrollbar 컨트롤 값과 컨테이너 overflow 스크롤은 별개입니다.
- 이미지 상태는 normal/highlighted/pressed/selected/disabled입니다. 새 PNG/JPEG/WebP와 상태별 프레임은 선택 workspace assets/의 sha256 내용 해시 파일을 참조합니다. 기존 data URI는 보존하며 사본의 참조 파일도 유지합니다. 개별 300,000bytes·가로/세로 1~4096px, 전체 설계 2,000,000bytes, MIME/내용/해시/경로/참조 존재 검사를 유지합니다.
- schemaVersion 4는 화면 logicalSize·safeArea·화면 직속 useSafeArea, 2D 고정/늘림 rectTransform, horizontal/vertical/grid의 고정 itemSize·gap·padding·columns와 overflow visible/clip/scroll-x/scroll-y/scroll-both를 지원합니다. 자동 배치 자식의 앵커·inset·safe area는 혼합하지 않습니다. 기존 1/2/3은 보존하고 구형 layout.direction은 새 자동 배치로 활성화하지 않습니다. 속성 창 열기만으로 버전을 올리지 않습니다. 회전·3D·범용 엔진/Figma 호환은 제공하지 않습니다.
- 오버레이는 Escape·blocking/dim·초점 차단/복귀·해당 화면 ID별 자동 닫힘·toast queue/dedupe를 처리합니다. 문서 교체 시 이전 타이머를 해제하며 호스트 닫기 veto는 확인창을 자동 생성하지 않습니다.
- handoffMarkdown/buildHandoff는 출처·배치·입력·상태·조건·행동·목적지·payload·복귀 정책·모듈/슬롯·클릭 스토리보드를 Markdown/JSON으로 전달합니다. 빈 출처·미정은 미확인으로 남깁니다. 구조 검사는 실제 조건 평가·원본 대조·자원 존재·게임 실행 검수가 아닙니다. JSON 단독 출력은 자원 파일을 동봉하지 않으므로 선택 ui-studio의 설계·assets를 함께 전달하며 공통 내장 자원은 같은 도구 설치본이 필요합니다.

### 이번 시험과 실제 확인 범위
대표 본체가 실행한 npm test는 302/302 통과(실패 0)이며 _작업/codex/ux-studio/tool-capabilities-tests.log에 기록합니다. 아래 .5의 220과 더 이른 208·211·215는 과거 단계 기록이며 합산하지 않습니다. 설명서 하위 작업은 npm test 전체를 재실행하거나 실화면 검수를 직접 수행하지 않았습니다. index 판 갱신 후 node --test tests/ux-studio/workspace-store.test.mjs를 실행해 새 가이드 사본 생성·기존 사본/metadata 보존을 포함한 17/17 통과(실패 0)를 확인했습니다. 별도 로그는 _작업/codex/ux-studio/capability-manual-workspace-tests.log이며 302에 합산하지 않습니다.

대표 본체는 samples/folder-check의 ux-f6ea56b4 r1에서 7종 컨트롤을 실제 UI로 설정·저장하고 저장 미리보기의 네이티브 값을 관찰했습니다. r2에서는 8번째 이미지 부품 자리와 오른쪽 위 앵커를 실제 UI로 적용·저장했으며 schemaVersion 4·logicalSize 390×844를 확인했습니다. 이는 저장 시험 fixture이며 모노폴리 GO 정식 UI 제작 완료가 아닙니다. 이미지 파일 넣기·저장/재열기와 최종 viewport 결과는 본체의 이번 보고·증거를 따릅니다. 이 문서 작업에서 미리 통과로 확정하지 않습니다.

이번 실화면 증거는 docs/evidence/20261116-tool-capabilities/browser-checks.json 및 같은 폴더의 canvas-desktop.jpg·controls-preview.jpg·canvas-mobile.jpg에 대표 본체가 기록합니다. 실제 파일 픽셀과 CSS viewport 크기를 확인한 값만 사용합니다. 아래 독립 전환 캡처와 이번 결과를 혼동하지 않습니다.

모노폴리 GO 검수 설계 ux-902404d6 r4와 보존 원본 ux-gjs-61ad2d1f r14는 유지합니다. samples/folder-check의 컨트롤·앵커 시험이 원 샘플을 덮어쓰지 않습니다. 설명서 10개 변경 전 백업은 docs/planning/_backup/20261116_단이/1232_capability_manual/이며 하위 작업 범위·문서 검증은 _작업/codex/ux-studio/capability-manual-report.md에 남깁니다. STATUS·공용 보고·실화면 확인은 대표 본체가 맡습니다.

## .5 독립 전환 검수 보존 이력
아래 .5 및 이전의 ‘현재/최종/남은’ 표현·시험 수·PID·가이드판·기능 미완료 목록은 당시 기록입니다. 현재 제공 기능과 다음 제작의 범위는 위 .6 절이 우선합니다.

## 과거 상태 · .5 공통 안내와 .4 프로젝트 사본
정본은 /Users/max/projest_max/ui-studio/입니다. 소스·자체 node_modules·서버·가이드·기본 저장·협업 기록을 이 루트에서 독립 운영합니다. 정식 진입은 http://127.0.0.1:7018/ui-studio/이며 소비 미리보기는 preview.html, GrapesJS 시험 편집기는 canvas.html, 소스·공통 안내는 source/입니다.

공통 안내는 실제 검수 결과를 반영해 .5로 올렸습니다. 실제 생성·읽기를 확인한 두 프로젝트의 guide 사본과 project.json guideVersion은 .4로 보존합니다. 가이드 UI는 공통 또는 프로젝트 각각의 index.version을 표시합니다. 프로젝트 재열기로 사본을 자동 갱신하지 않습니다. .5 본문 전체를 브라우저에서 다시 읽었다는 주장은 하지 않습니다. 실제 7종 선택·읽기·Esc 복귀는 이번 .4 가이드 실화면 검수 결과입니다.

최종 자동 시험은 220/220 통과(실패 0)를 재확인했습니다. 명령은 이 루트 npm test, 로그는 _작업/codex/ux-studio/independence-final-tests.log입니다. 이전 208·211·215 시험 수를 합산하지 않습니다. 최종 관찰 서버 PID는 18579였으며 재기동마다 달라지는 값입니다. 자체 의존성·로컬 Vite 5.4.21·루트 CWD·HTTP 확인은 기존 기동 근거와 함께 유지합니다.

## 실제 폴더·설계·충돌 검수
네이티브 폴더 선택으로 samples/monopoly-go/ui-studio를 만들고 변환 안 함(independent)을 명시했습니다. workspace는 workspace-8e0f09e7-4699-4ac6-81b3-d545c7046ef6입니다. 검수 설계는 ‘모노폴리 GO UI 샘플’ ux-902404d6 r4이며 3페이지·1모달·24부품·6연결입니다. 기존 ux-gjs-61ad2d1f r14는 원본으로 보존했습니다.

실제 흐름은 현재 설계 사본 넣기 → 새 ID r1 → 저장 후 전환 r2 → 동시 창 409 충돌과 현재 수정 유지 → 최종 r4입니다. samples/folder-check/ui-studio도 실제 생성해 별도 설계 r1을 저장하고 두 폴더를 왕복하며 격리를 확인했습니다. folder-check는 저장 시험 fixture이며 게임 샘플이 아닙니다. 프로젝트 .4 가이드 사본도 실제 읽었습니다.

캔버스에서 W 단계 저장·단계 재열기·24개 ID와 부모 관계 왕복을 확인했습니다. 원본 r4는 유지했습니다. W 저장 성공은 W/P/U/S 종합검수 통과가 아닙니다.

## 실제 미리보기·입력·포커스 검수
미리보기의 3페이지 이동 → 모달 열기 → 닫기 → 뒤로 복귀와 메뉴 펼침 유지를 확인했습니다. 모달이 열리면 배경은 inert이고 초기 초점은 닫기 버튼입니다. Tab 초점 순환과 닫은 뒤 원 trigger 초점 복귀를 확인했습니다. 미연결 send는 disabled입니다.

데스크톱 CSS 1440×900에서 가로 넘침 0·실패 이미지 0을 확인했습니다. 초기 phoneCheck에서 CSS 430×844의 가로 넘침 0·실패 이미지 0을 관찰했으나 후반 재확인과 현재 모바일 증거는 602×1181입니다. 최종 430px 캡처나 1920px 캡처로 주장하지 않습니다. 캡처 파일의 픽셀과 당시 CSS 검사 크기를 구분합니다.

증거는 docs/evidence/20261116-independence/ 아래입니다.

- browser-checks.json: 샘플·가이드 7종·편집기·현재 모바일 602×1181·캔버스·단계 저장/재열기 관찰
- captures.json: 최종 캡처 파일과 실제 픽셀 메타데이터
- project-folders-desktop.jpg: 실제 1440×900 픽셀
- canvas-desktop.jpg: 실제 1440×900 픽셀
- modal-mobile.jpg: 실제 602×1181 픽셀, 최종 430px 캡처 아님
- modal-desktop-1440.jpg: 실제 953×664 픽셀, 파일명의 1440을 캡처 픽셀로 사용하지 않음

## 남은 적용 범위
대표 W/P/U/S 종합검수는 0/4입니다. 본게임 로직 작업은 병행할 수 있습니다. 툴 UI 전면 적용에는 그래픽·외부 assets 파일 계약·실제 컨트롤·safe area/anchor/layout·엔진 어댑터가 남습니다. 전체 게임 자동 탐색·변환·연결과 완성 그래픽·전체 샘플 완료를 자칭하지 않습니다. 이번 동작 검수는 지정 샘플·저장 fixture·미리보기·캔버스 범위이며 모든 게임·기기 검수로 확대하지 않습니다.

## 보고와 보존
root AGENTS.md가 우선 정본이고 협업 진입점은 docs/collaboration/README.md입니다. STATUS·이번 보고는 대표 본체가 docs/collaboration/에서 정리합니다. 가이드 작업은 보고·STATUS를 수정하지 않았습니다. 기존 상세 보고 docs/reports/20261116-project-workspaces.md는 보존합니다. .5 변경 전 문서 10개 백업은 docs/planning/_backup/20261116_단이/1124_실제검수_가이드_v05/입니다.

## .4 및 이전 보존 이력
아래의 ‘현재/이번’, 미검수·진행 중과 이전 시험·PID·가이드판 표현은 당시 기록입니다. 현재 운영·검수 범위는 위 .5 절이 우선합니다.

## 현재 운영 기준 · 2026-11-16.4
현중의 최신 지시는 UI 스튜디오의 서류와 도구를 반드시 자기 폴더에 두고 다른 프로젝트와 종속 관계를 만들지 않는 것입니다. 정본은 /Users/max/projest_max/ui-studio/이며 소스·자체 node_modules·서버·가이드·기본 저장공간·진행·보고를 이 루트에서 운영합니다.

정식 실행 주소는 http://127.0.0.1:7018/ui-studio/입니다. 저장본 소비는 /ui-studio/preview.html, GrapesJS 시험 편집기는 /ui-studio/canvas.html, 소스·공통 안내는 /ui-studio/source/입니다. 이 루트 scripts/start.mjs와 Vite 5.4.21·정확한 의존성 묶음을 사용합니다. 기존 검증 설치의 11패키지(18,560,529bytes)를 이 루트 node_modules로 복사했고 외부 설치 fallback을 제거했습니다. 새 패키지·버전 선정은 없었습니다. 원본·사본 전체 검증 해시·라이선스·lock integrity는 _작업/codex/ux-studio/standalone-dependencies.json에 기록했습니다. package-lock.json은 다른 플랫폼 선택 패키지를 포함한 의존성 58개를 보존합니다. 실제 이 Mac에 복사한 11개와 플랫폼 선택으로 설치하지 않은 47개를 구분합니다.

이번 독립 기동 단계의 실제 결과는 다음과 같습니다.

- 7018 서버 PID 7703의 CWD는 /Users/max/projest_max/ui-studio/이며 Vite resolve는 자체 node_modules입니다. 서버 열린 파일에 이관 출처 프로젝트 파일이 없는 것을 확인했습니다.
- HTTP /는 302로 /ui-studio/에 연결하고 편집기·main JS는 200입니다.
- 자동 시험은 이 단계에서 215/215 통과(실패 0)했습니다. 로그는 _작업/codex/ux-studio/standalone-final-tests.log입니다. 후속 기능 변경의 시험 결과와 별도 기록합니다.
- Browser 7018 접근성 트리를 정상으로 읽고 r14와 3페이지·1모달 연결을 확인했습니다. 실제 클릭·새 workspace·전체 시각 검수는 아직 완료하지 않았습니다.
- 앱의 UI 스튜디오 바로가기를 이 루트 디렉터리·자체 start 명령·7018 URL로 저장했고 다른 다섯 항목은 유지했습니다.

폴더 전환·프로젝트 가이드 사본 기능은 추가 구현·검수 중입니다. 독립 기동 단계의 확인을 저장·재열기·폴더 전환·가이드 사본·1440/430 화면 검수의 완료로 확대하지 않습니다. 과거 시험·기본 주소 HTTP·접근권한 기록을 이 전환의 결과로 대신하지 않습니다. 사용자 요구에 따른 독립 서버 전환은 자동 접근 거절을 다른 포트·호스트·표면으로 우회하는 권한을 뜻하지 않습니다.

root AGENTS.md가 우선 정본이며 협업 진입점은 docs/collaboration/README.md입니다. 진행은 docs/collaboration/STATUS.md에 append하고 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md에 모읍니다. 기존 상세 보고 docs/reports/20261116-project-workspaces.md는 보존합니다. 과거 외부 공유 루트는 출처·종료 기록으로만 남기며 현재 작업의 지시·진행·보고 정본으로 사용하지 않습니다.

기본 설계는 이 루트 _작업/codex/ux-studio/projects/에서 이어가고, 사용자가 선택한 게임의 설계·자원·안내는 선택게임/ui-studio/에 보관합니다. 게임별 workspace ID와 문서 projectId/revision을 함께 확인합니다. 도구 URL·독립 기본 저장공간·선택한 게임 저장공간은 서로 다른 범위입니다.

이어받은 대표 저장본은 ux-gjs-61ad2d1f r14, 3개 page·1개 modal·24개 부품·6개 연결입니다. W/P/U/S 종합검수 0/4와 UI·그래픽·전체 샘플 미완료 상태를 유지합니다. 독립 실행 구조의 완성과 샘플·게임 UI의 완성을 구분합니다. 기존 UI 자동 탐색·변환·연결은 미완료입니다.

현재 판 .4의 프로젝트 가이드 사본 기능은 추가 구현·검수 중입니다. 기존판을 자동 덮어쓰지 않으며 판 차이를 확인한 별도 작업으로 갱신합니다. 이 판의 문서 변경 전 백업은 docs/planning/_backup/20261116_단이/1015_완전독립_가이드/입니다.

## 이관 이력의 경계
아래는 .3 및 그 이전의 보존 기록입니다. 그 안의 7007 공유 실행·설치 재사용·케이팝 경로·당시의 ‘현재/이번’ 표현은 과거 작업의 문맥입니다. 지금 운영 기준은 위 .4 절과 root AGENTS.md가 우선합니다. 케이팝 기획서·시뮬레이터·공유 기록·옛 저장 데이터는 보존했습니다. 케이팝에 남긴 model.mjs·consumer.mjs export 연결 두 개는 기존 소비자에서 독립 정본으로 향하는 단방향 참조이며 UI 스튜디오 실행 조건이 아닙니다. 7007의 도구 mount·uxSavePlugin·API 연결은 제거했습니다. 옛 도구 URL은 7018 이동 안내로 연결하고 옛 API는 HTTP 410으로 거부하여 오래된 창의 쓰기를 차단합니다.

## 현재 대표 상태
이어받은 대표 저장본 기준은 ux-gjs-61ad2d1f r14입니다. 3개 page와 1개 modal, 24개 부품과 6개 연결이 기준입니다. 이 문서 작성 중 원설계를 수정하거나 새로 측정한 결과는 아닙니다. 이 설계가 실제 게임 전체나 현재 검증 샘플 전체를 대표한다고 가정하지 않습니다.

대표 단계는 W/P/U/S 단계 종합검수 0/4를 유지합니다. 현재 UI는 미완료입니다. 그래픽과 전체 샘플도 미완료입니다. r14라는 저장 버전, W/P/U 단계 이름, 폴더나 설명서가 생긴 사실을 UI 완성 판정으로 해석하지 않습니다.

## 2026-11-16 독립 정본 보정
도구 정본은 /Users/max/projest_max/ui-studio/입니다. 소스·내장 설명서·툴 기획·제작 구조·AI 규칙을 이 루트의 src/tools/uxStudio/와 guide/에서 관리합니다. 케이팝 중복 도구 101파일은 독립 루트의 docs/planning/_backup/20261116_단이/1012_kpop중복정리/로 이동 보존했습니다. 케이팝 src/tools/uxStudio/에는 기존 호스트·Node 시험용 model.mjs·consumer.mjs export 연결 두 개와 README만 남으며 도구 구현은 독립 정본에만 있습니다. 케이팝 기획서·시뮬레이터·공유 기록·옛 설계 저장 데이터는 보존합니다. 기존 설계는 독립 루트의 _작업/codex/ux-studio/projects/에서 이어갑니다.

케이팝은 기획서·시뮬레이터 프로젝트이며 실제 게임이 아닙니다. samples/monopoly-go/는 독립 도구의 검증용 샘플입니다. 도구 이관, 샘플 구조, 실제 게임 연결·완성을 구분합니다.

7007 정식 진입 /ui-studio/는 독립 tools/ux-studio/mount.mjs와 save-plugin.mjs를 통해 독립 소스·API를 제공합니다. 실행 프로세스는 케이팝 Vite와 공유합니다. /docs/planning/ 도구 HTML은 호환 진입으로만 둡니다. 별도 scripts/start.mjs는 이 Mac에서 기존 Vite 5.4.21 설치를 재사용하며 새 패키지를 설치하지 않았습니다. 이 가이드 보정은 서버 시작·재시작·빌드·감시·예약을 수행한 결과가 아닙니다.

## 지정 소스에서 확인한 기존 기능
- DOM/CSS 기반 배치 편집과 동작 시험, 화면·레이어·유닛 편집
- 구성 전체와 시각 부품, 부모 입력 전달과 표시 전용 구분
- 게임 UI 프레임·상태·3/9슬라이스, 구조/게임 표현
- 조건별 연결, 모달·바텀 등 공통 연출, 시험 데이터와 모듈 요청 정의
- 문서 검증·서버 저장·revision 충돌 거부·백업·W/P/U 기준판·재열기
- 저장본 소비 렌더러와 별도 GrapesJS 시험 편집 경로
- 래스터 개별 300,000bytes와 설계 전체 2,000,000bytes 제한

위 목록은 지정된 소스 확인과 기존 계약 설명입니다. 이번 창에서 각 기능의 실화면이나 기존 시험 수를 다시 실행했다고 뜻하지 않습니다.

## 2026-11-16 폴더·설명서 작업 범위
T04_프로젝트폴더와_내장설명서_20261116.md를 기준으로 독립 도구와 게임별 ui-studio 저장공간, 명시 폴더 선택, 변환 여부 선택, 프로젝트 격리, 전환·저장·소비 연결, 공통/프로젝트 안내를 함께 작업합니다.

기능의 완료 여부는 최신 소스와 이번 작업 보고의 실제 시험·화면 증거를 확인합니다. 이 가이드 자체는 검수 완료 보고가 아닙니다. 실제 게임 UI 전체의 자동변환은 이 구현 범위에 포함되지 않습니다.

공통 가이드 정본은 독립 도구 루트의 src/tools/uxStudio/guide/이며 index.json 판은 2026-11-16.3입니다. 이번 보정은 이 판의 정식 주소·독립 소스 정본·공유 실행 프로세스·게임별 저장공간·중복 정리 보존 경계와 미확인을 설명합니다. 새 프로젝트에는 사본을 넣고 기존 프로젝트의 안내와 문서는 재열기 때 조용히 덮어쓰지 않습니다.

## 남은 제작·연결 작업
- 대표 화면과 전체 UI 샘플을 W/P/U 수락 기준에 맞게 완성
- 최종 게임 그래픽·실제 자원과 상태별 표현
- 실제 게임 호스트의 모듈 요청 처리와 콘텐츠 슬롯 공급
- 사용자 동의 후 기존 UI 전체 조사·변환·연결·회귀
- 범용 anchor/pivot/LayoutGroup/Mask와 기기별 예외
- 인접 터치 영역 겹침과 입력 검수 보강
- 대형 문서의 보이는 레이어 렌더·도구 재사용과 성능 재측정
- Unity prefab 등 엔진 전용 출력
- 독립 이관과 새 모듈 연결에 대한 코드지도 갱신 필요 확인. 케이팝 지도가 독립 정본의 최신 연결을 포함한다고 가정하지 않기

## 이번 결과보고에서 확인해야 할 항목
서로 다른 게임 폴더 두 개에서 같은 문서 ID가 격리되는지, 한글 경로 선택, 기존 파일 보존, 재열기, 저장 충돌과 백업·기준판, 미저장 취소와 실패 복구, 소비 범위, 변환 선택 기록을 확인해야 합니다.

공통/프로젝트 가이드 실제 읽기, 읽기 실패 메시지, 닫기·Esc·포커스 복귀, 데스크톱·모바일 넘침도 실제 화면 범위를 구분해 확인해야 합니다. 로컬 서버 브라우저 앱과 일반 브라우저 중 어느 경로를 검사했는지 기록합니다.

이 문서에는 이번 실행의 통과 시험 수나 화면 캡처를 사전 확정하지 않습니다. 과거 README나 보고에 있던 시험 수·성능 수치를 이번 실행으로 중복 합산하지 않습니다. 기존 엔진과의 동등성·완성률·토큰 절감률을 측정 없이 주장하지 않습니다.

## 다음 AI에게
먼저 독립 도구 루트의 README.md·AGENTS.md와 이 guide/를 읽고, 선택한 프로젝트의 상위 AGENTS와 ui-studio/README.md·AGENTS.md·project.json·integration.md를 확인하세요. 미완료 목록은 자동 실행 배정이 아닙니다. 최신 사용자 요청과 구체적인 담당 범위가 있을 때만 해당 작업을 진행합니다.

## 2026-11-16 실제 구현·시험 갱신
정식 폴더는 /Users/max/projest_max/ui-studio 하나입니다. 이전 한글 폴더는 이 이름으로 이동했고, 폴더 선택 중 생성한 설계0개 중복 저장공간은 docs/planning/_backup/20261116_단이/0950_영문폴더정리/duplicate-workspace에 삭제 없이 보존했습니다.

앞선 영문 이관 작업에서 npm test 208/208 통과(실패0), main/preview/Grapes/mount/start 문법 검사 통과를 확인한 기록입니다. 폴더 격리·변환선택·이동복구·미저장 전환·비동기 저장 중 문서교체 회귀가 포함됩니다. 당시 실행 결과 로그는 _작업/codex/ux-studio/english-folder-tests.log입니다. 이 수를 새 주소 변경 후 재실행 결과로 쓰지 않습니다. 시험 개수는 제작 완성률이 아닙니다.

앱 업데이트 전 가이드 문서 열기·Esc 닫기·초점 복귀 및 네이티브 폴더 창은 부분 확인했습니다. 영문 이관 후 새 폴더 전환·저장 재열기·Grapes 범위·1440/430 화면과 최신 캡처는 브라우저의 저장권한/관리정책 거절 응답으로 미검수입니다. 사용자는 차단한 적이 없다고 정정했으며 실제 기술 원인은 확인되지 않았습니다. 채팅의 허용이나 파일 전체 접근만으로 브라우저 권한이 복구됐다고 말하지 않습니다.

대표 r14의 3페이지+1모달/24부품/6연결은 이관 전 원본과 바이트 동일합니다. 단계 종합검수 W/P/U/S 0/4를 유지합니다. 전체 모노폴리 GO 샘플·정식 그래픽·실제 게임 자동변환은 미완료입니다. 작업 보고는 docs/reports/20261116-project-workspaces.md를 읽습니다.


## 2026-11-16 10:05 KST · 기본 주소404 보완 당시 기록
아래 /docs/planning/ 목적지와 211/211 시험은 직전 회차 기록입니다. 현재 정식 진입 안내는 아래 2026-11-16.3 절이 우선하며 과거 시험을 새 주소의 검증으로 합산하지 않습니다.
현중: 케이팝폴더밖이라안열리는지/포트변경질문. 확인: 7007리스너PID15304실행중, HEAD /404·실제툴HTML/JS/CSS200. UI스튜디오분리자체의전면불통이나포트충돌은확인되지않음. 기본주소에진입페이지가없던문제는 tools/ux-studio/mount.mjs의 /·/index.html→302 /docs/planning/ux-studio.html 로수정(query보존/no-store). 독립실행 scripts/start.mjs에도동일mount재사용. 다른기획서/시뮬레이터URL은그대로next. 별도포트변경이나서버프로세스재시작/빌드없음.
선행회귀3중1실패확인→보완후3/3, 최종npm test211/211(로그 독립root/_작업/codex/ux-studio/root-entry-tests.log). 실제7007/ HEAD302·Location툴주소확인. 이는HTTP진단·서버연결시험이며브라우저화면검수아님. Browser7007자동접근거부는별개로유지,포트/호스트/다른표면으로우회하지않음. 백업 독립root/docs/planning/_backup/20261116_단이/1005_기본주소진입. 대표r14·W/P/U/S0/4유지. 다음사용자기본주소재열기및정상승인후실화면검수.


## 2026-11-16.3 · 정식 주소와 중복 정리 보정
현중의 최신 요청은 주소의 /docs/planning/으로 케이팝 도구처럼 혼동되는 점을 없애고 케이팝 쪽 중복 UI 도구를 정리하는 것입니다. 정식 실행은 http://127.0.0.1:7007/ui-studio/, 저장본 소비는 /ui-studio/preview.html, GrapesJS 시험 편집기는 /ui-studio/canvas.html, 소스와 공통 안내는 /ui-studio/source/ 아래로 안내합니다. 옛 도구 HTML 주소는 새 주소로 보내는 호환 진입으로만 둡니다.

소스 정본은 /Users/max/projest_max/ui-studio/이며 7007 프로세스는 케이팝 Vite와 공유합니다. 독립 소스 정본·공유 실행 프로세스·게임별 workspace 저장공간을 구분합니다. URL의 /ui-studio/를 게임 폴더 식별자로 해석하지 않습니다.

케이팝 중복 도구 소스·tools·관련 tests·도구 HTML 두 개, 총 101파일을 독립 루트 docs/planning/_backup/20261116_단이/1012_kpop중복정리/로 이동 보존했습니다. manifest.json에 경로·크기·SHA-256을 기록했습니다. 케이팝 src/tools/uxStudio/에는 기존 gameUiHost 어댑터의 동적 consumer import와 Node 시험의 model import를 유지하는 export 연결 두 개(model.mjs·consumer.mjs)와 README만 남습니다. 이 연결에 실제 도구 구현은 없습니다. 다른 담당의 기존 호스트 소스와 시험 파일은 수정하지 않았습니다. 대표 본체가 기존 호스트 시험 7/7 통과를 이번 소스 회귀로 확인했으며 이는 실제 화면 검수가 아닙니다.

기획서·시뮬레이터·공유 기록·옛 저장 데이터는 보존했습니다. 기존 설계 저장 정본과 선택게임/ui-studio의 workspace 범위는 주소 정리와 별개입니다.

211/211 시험과 기본 주소 HTTP 확인은 직전 10:05 작업의 근거입니다. 새 주소의 실제 화면·1440/430·저장 재열기·Grapes·가이드 검수는 이번 문서 수정 중 수행하지 않았습니다. Browser 7007 접근권한 거절은 별개의 미해결 항목이며 주소 변경으로 해제되었다고 쓰지 않습니다. 새 주소 변경 후 시험·HTTP·실화면 결과는 대표 본체의 이번 보고에 실제 수행 범위로 남깁니다. 대표 r14와 W/P/U/S 0/4는 유지합니다.

이 판의 문서 백업은 독립 루트 docs/planning/_backup/20261116_단이/1012_독립주소_가이드/입니다. 기존 프로젝트 guide 사본은 자동 덮어쓰지 않았으며 필요할 때 판 차이를 확인해 별도 갱신합니다.

## 최신 검증 기록 · r29 · .9 유지 · 2026-11-16 15:05 KST

본체가 실제 도구 UI에서 배치 보정 r28을 저장한 뒤 출처 설명을 추가 저장해 최신판은 r29입니다. 배치는 r28과 같고 현재 로컬 샘플은 1페이지·50부품·연결 0개·동작 미연결 6건입니다. 정식 독립 실행 주소는 http://127.0.0.1:7018/ui-studio/입니다. 이 절은 본체가 전달한 실제 UI 결과와 이번 시험 로그를 정리한 것이며 문서 담당이 동일 조작을 재실행한 기록은 아닙니다.

원 SNS 요소의 기존 ID는 Group_SNSAvatar 96×96 wrapper로 유지했습니다. 자식 Img_SNSAvatar는 안쪽 7px의 82×82 사진, Frame_SNSAvatar는 흰 7px 원형 테두리로 분리했고 임시 BG/label은 제거했습니다. Slot_3D 테두리 두께는 0입니다. 화면 전체의 빈 3D 연결 자리와 “3D 영역” 표시는 의도된 상태이며 실제 3D/게임 연결 완료가 아닙니다.

이전 본체 가이드 실검수(14:16 전달 범위)의 선 위치/수치 → 실제 리소스 반영 → Undo, 이미지 빼기/넣기, 선 색 닫기/재열기 지속을 확인 범위로 유지합니다. 상세 결과는 기존 가이드 검수 절을 따릅니다. 9슬라이스는 실제 Frame 300×80/620×110/461×54에서 고정폭 edge 27px, 같은 source, slice 27 fill과 투명 배경이 유지되는 computed 값을 확인했습니다. runtime CSS 그림자는 기본 상태와 disabled 합성을 실제 확인했고 pressed는 미검수입니다. 상태 계약·자동 시험과 실제 상태별 화면 검수를 구분합니다.

이번 본체의 전체 npm test는 374/374 통과, 실패 0입니다. 직접 읽어 확인한 로그는 `_작업/codex/ux-studio/unit-guide-lower-final-tests.log`입니다. 이전 353·362 등 과거 시험을 합산하거나 이번 실행으로 재사용하지 않습니다. 이 문서 단위에서는 제품 시험을 다시 실행하지 않았습니다.

최종 r29 캡처는 본체 진행 중입니다. 이전 r27 캡처를 r29 최종 검수 증거로 바꾸어 쓰지 않습니다. 남길 시각차는 GO 입체감/색, 원본 폰트, 우측 이벤트 미구성입니다. Unity 전체 호환·게임 기능 연결·원본 폰트 설정·원본과 픽셀 동일성은 미완료/미확인이고 W/P/U/S 종합검수는 0/4입니다. 사용자 승인·freeze는 없습니다. 공통 .9 및 과거 본문·프로젝트 사본을 보존했으며 이번 하위 문서 작업은 제품/설계/STATUS/공용 보고를 수정하지 않았습니다. 수정 전 백업은 `docs/planning/_backup/20261116_단이/1505_r29_verified_guide_v09/`입니다.

## 최신 표시 정정 · 공원 보드 배경 r30 · .9 유지 · 2026-11-16 15:16 KST

사용자는 새 공원 보드 콘셉트 첨부를 기준으로 빈 3D 자리 대신 새 그림과 “주변에 건물도세워주고”를 요청했습니다. 이 최신 직접 정정이 이번 샘플 표시에는 과거 빈 3D 지시보다 우선합니다. 과거 문구는 당시 이력으로 보존합니다. 최신 실제 UI 저장판은 r30이며 1페이지·51부품·연결 0개·동작 미연결 6건입니다.

새 배경은 ImageGen 1회로 새로 그린 불투명 2D 공원 보드 콘셉트 시안이며 스크린샷 픽셀을 잘라 자원으로 쓰지 않았습니다. 원본/authoring PNG 1024×1536을 보존하고, 등록용 production WebP는 같은 해상도·quality 92·284672bytes입니다. source/authoring/production/import mirror 경로, 프롬프트, 해시는 `_작업/codex/ux-studio/board-scene-v001-assets.json`을 따릅니다. 이는 원본 게임의 픽셀 동일 재현이나 실제 3D 엔진이 아닙니다.

본체는 실제 도구에서 이미지 유닛 추가 → 프로젝트 경로 import → Slot_3D 자식 Img_BoardBackdrop 배치로 적용했습니다. 부모 기준 x/y/w/h=0/0/100/100%, fit=cover로 비율을 유지하며 화면 비율 차이로 가로 일부가 잘립니다. 표시 전용·글자 없음이며 Slot_3D는 장면 연결 자리로 유지하고 “3D 영역” 표시글만 비웠습니다. HUD·GO·메뉴는 별도 UI 계층입니다. 정적 그림의 타일/캐릭터가 게임 기능이나 입력 타일로 연결됐다고 기록하지 않습니다.

실제 viewport와 캡처는 모두 1920×1200입니다. 본체 전달 검수는 부품 DOM 51개·넘침 0·이미지 오류 클래스 0이며 캡처는 `docs/evidence/20261116-unit-guide/board-scene-r30-1920.jpg`입니다. 이 문서 담당도 캡처 파일과 실제 1920×1200 크기를 확인했으며 DOM 검사를 다시 실행한 것은 아닙니다. 가이드 선 색의 최신 실화면 재검수는 본체 진행 중입니다. 직전 374/374 시험은 해당 실행 기록으로 유지하고 이번 문서 작업의 새 실행으로 세지 않습니다.

7018 복구 과정의 자동 승인 검토 거절 이후 사용자가 “7018서버재실행허용”을 명시했고 본체가 복구했습니다. 현재 7018 전용 독립 서버가 실행 중입니다. 이 허용 범위와 UI 최종 승인을 구분합니다. 전체 W/P/U/S는 0/4이고 사용자 UI 승인·freeze는 없습니다. 공통 .9·과거 본문·프로젝트 사본은 보존하며 제품/설계/STATUS/공용 보고는 이번 문서 단위에서 수정하지 않았습니다. 백업은 `docs/planning/_backup/20261116_단이/1516_r30_board_scene_guide_v09/`입니다.

## 2026-11-16 상단 잘림 보완 단위

제안(검수 대기). 전체캔버스실제편집으로HUD_Top Y0→12px,사진/흰프레임화면Y-2→10px. 사본 ux-gjs-723cb977 r1 저장·재열기 검수,원본r30보존.51부품의ID/부모/이미지참조/기존연결보존,HUD하위가모두12px이동함을저장문서검증으로확인.기존브라우저의다른두부품좌표에는4자리정밀도반올림차이가남으며화면차이는0.001px미만입니다. UI소스변경없어374전체시험을재실행하지않았고이번결과로중복계산하지않습니다.1440×900전체캔버스/1920×1200미리보기/CSS430×844검수,누락표시0·가로넘침0. 증거: docs/evidence/20261116-top-clipping/. 버튼기본Selectable/상태별아이콘그림교체는이번에변경하지않았습니다.7007적용중지,W/P/U/S0/4·사용자승인없음유지.
