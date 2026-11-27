# 하단 공통규격·알림 배지·가이드치수·검수본 진입
작성자 codex(단이) · 2026-11-16 16:19 KST · 진행 · 제안(검수 대기)

원문: 현중 “하단 메뉴는 속성상 똑같은 사이즈…규칙적으로리소스생성”,“빨간동그라미수치는모든메뉴…공통기능”,“규격똑같이…가이드라인가로세로수치”. 현재Chrome은열리고LocalServerBrowser는안됨추가요청유지.
원본: 현재r1/51부품,4개가이드첨부,10장화면원본보존manifest(위),기존notification없는badge/template/renderer/model/consumer/guide·mount,앱설정UIrootURL과Backend/UI/ManualRefreshPolicy읽기전용대조. 앱바이너리동일성·실패원인은미확정. 7007HTTP200/옛UI주소302쿼리보존관찰,7007Browser실화면진입은저장권한정책거절로미수행.
계획: docs/plans/20261116-bottom-menu-standard.md. 단위A/B병렬,본체진입보완과실제조립/최종통합검수담당.

## 최신 지시·계획 추가
현중의 내일 아침8시 지시에 따라 기존 automation ui를 30분·현재 채팅·2026-11-17 08:00 KST까지 ACTIVE로 갱신(도구 응답 확인). 계정 주간72%, 90%/조회실패 중지 유지. 새 UI의 진입·닫기·뒤로·복귀 연결을 같은 단위로 진행한다. AI for UI 공식 사이트/4개 SKILL 원문/공개 LICENSE를 검토했고 docs/plans/20261116-ai-for-ui-adoption.md 및 TOOL_SPEC 최신절에 적합한 절차만 편입. 자동 설치 없음.

## 2026-11-16 17:49 KST 단위 결과 — 제안(검수 대기)

현재 저장판은 `ux-gjs-0d80d7fe r24`, 논리551×984, 1페이지·63부품·0연결이다. 기존 r30/상단 보정 r1과 과거 샘플은 보존했다. 새10화면/게임 기능/대표 W·P·U·S 종합검수는 미완료(0/4)다. 이번 기능 단위 결과와 전체 샘플 완성을 구분한다.

### 실제 도구 조립·저장
- 저장 설계 사본에서 실제 상세 도구의 레이어/속성/수치 적용/분해/복제/부모 선택/그룹/앵커/파일 저장을 사용했다. 외부에서 설계JSON을 수정하지 않았다.
- 승리·짓기·앨범·친구의 부모80×92, 이미지64×64@(8,6), 글자80×22@(0,70)를 동일하게 맞췄다. 텍스트font14/weight500/line18/system/가운데. `Btn_BottomNav_<역할>`, `Img_BottomNav_<역할>_Icon`, `Txt_BottomNav_<역할>_Label`을 적용했다. id·게임 문구·이미지 참조는 유지했다.
- 공통 배지는28×28@(52,0). 부모에 notification 설정1개, 자식은 `Img_Notification_BG`와 `Txt_Notification_Count`로 분리했다. 실제로 화면 최상위 이동→분해→불필요한 임시 바탕/프레임 삭제→새 알파 원 등록→글자/부모/크기/설정→복제 순서로 조립했다. 메뉴 안에서 복제 이름이 남지 않도록 최종r24에서 이미지 자식 이름도 정리했다.
- Wins0숨김, Build숫자5, Album점(presence1), Friends숫자4는 출처 기반 UI fixture다. 실게임 수량/알림 정책으로 확정하지 않았다. 배지 숫자는 white18/700 native text이며 원 그림에는 숫자/그림자를 굽지 않았다. source112²→논리28²/rim3px, WebP1632bytes, hash/경로는 notification-circle-assets.json.
- 하단14root를 실제 툴에서 HUD_Bottom(551×280)으로 그룹하고 아래 고정, HUD_Top(536×94)@(9,12)는 위 고정했다. %자식만으로 부모 높이를 바꿀 때 정사각형이 늘어나는 문제를 고정 부모+균일 배율로 해결한다.
- 네 메뉴에 실제 속성 UI에서 기본 색 변화와 각 이미지 자식 TargetGraphic을 설정·저장했다. 동작시험의 클릭 전4normal→Build클릭 후Build hover/다른3normal과 대상 이미지 연결을 실제 DOM에서 확인했다. 상태 이미지 방식은 엔진/저장/복제/키보드·터치 관련 자동시험124개 범위이며 GO의 교체 그림과 실제 image-mode 샘플 검수는 다음이다.

### 소스·진입 보완
|파일 근거|전→후|
|---|---|
|src/tools/uxStudio/notification.mjs, model.mjs, layout-view.mjs, consumer.mjs, main.mjs:3072|정적 숫자 배지→숫자/점/0숨김/99+·runtime valueKey·compound native text와 엄격 검증. legacy 배지 유지.|
|src/tools/uxStudio/design-guide-view.mjs:23|별도 치수 토글 의존→선택 부품 W/H 상시 표시, 이동 손잡이와 분리.|
|동 파일:95 부근|전역 어두운 테마 label색 상속→가이드 전용 label#46566d/입력#253247/흰 배경. enabled/disabled 구분 유지.|
|src/tools/uxStudio/canvas-device-preview.mjs, grapes-pilot.html:25, grapes-pilot.mjs:255|전체 캔버스에 공통 프리셋/직접W/H/방향·실제 논리 영역 재flow+uniform deviceScale·보기 설정 유지.|
|grapes-pilot.mjs:328~334, grapes-drag.mjs|가이드 변경 현재기기 사전 검증·드래그 배율 연결. 실패 시 모델/Undo 무변경.|
|src/tools/uxStudio/main.mjs:4, :2541|상세 기기390을 직접 논리너비로 써 fixed551 HUD가 우측으로161px 넘침→551기준 논리 영역/기기 배율/편집 확대를 분리해390/430에 정상 배치.|
|src/tools/uxStudio/button-state.mjs, main.mjs:3077, asset-reference.mjs, commands.mjs|기본 색 변화/상태별 이미지, 대상 이미지,5상태,취소/키보드/터치/비활성·선택 유지, 자원 수집/복제ID치환. 기존 skin/notification 유지.|
|grapes-pilot.html:78|오래 고정된 ?v=모듈의 장기 캐시→plain module(no-cache).|
|tools/ux-studio/mount.mjs:3/21, current-review.json|generic UI주소가 다른 저장공간을 열 수 있음→유효 검수 포인터일 때만 기본URL을 workspace+project로302/no-store. 명시 scope는 유지. 최종포인터0d80.|

전용 보고: `_작업/codex/ux-studio/{notification-report,compound-notification-report,guide-wh-report,canvas-device-preview-report,device-preview-review,button-state-report,detail-device-scale-report}.md`.

### 이번 검수와 실제 크기
- 진입: 허용된7018 기본주소→workspace/project 자동302→r24 전체 캔버스→하단 계층 펼침→각 메뉴→디자인 가이드→개별/부모/자식·수치 확인. 별도 상세 주소에서 실제 편집·동작시험·파일 저장·재열기를 수행했다. 7007 목록→카드→실행의 native 앱 검수는 수행하지 못했고 이 경로로 대체 완료 처리하지 않았다.
- 네 메뉴의 **각각 다른 정확한 dialog heading**과 W80px/H92px를 실제 확인했다. 초기 일괄 검사에서 같은 열려 있는 dialog를 다시 읽은 결과는 버리고 닫기→다음 메뉴→새 heading을 확인해 재검수했다.
- 전체 캔버스390×844: actual board389.997×843.987,4메뉴56.610×65.112/icon45.288²/label56.610×15.566/badge19.810². 모든 원 규격×390/551로 균일하고0배지는 hidden/display none, 깨진 이미지0.
- custom414×896와 세로 방향을 실제 조작해 표시414×896/75% 비례, 저장상태 유지. input 자동화 fill/Tab만의 미반영은 제품 결함으로 단정하지 않고 현재 표시와 저장값을 확인했다.
- 상세390: actual canvas389.993×843.993, 논리551×1192.42,총scale0.7078039927404719/zoom1; HUD_Bottom389.993×198.181(우측끝canvas일치)/HUD_Top379.378×66.525(안쪽). 확대+zoom1.2/scale0.8493647912885662→축소zoom1 정상 복귀. 큰폰430×932는actual429.993×931.993/논리551×1194.26.
- 보기 시험 전후r21 설계 hash `8b127e42e8a01692152a09b00ab13f86308c2ab84f564d118a7c53ab65fe037c` 동일. 이후r22~24는 배지 이미지 자식 이름 정리의 실제 저장이다. r24 validateDocument 통과, 복사 이름0.
- 전체 툴 desktop **CSS1440×900** 가로넘침0 / mobile **CSS430×843**, 내부기기390×844 가로넘침0. 캡처 파일은 각각1800×1125 /514×1055이며 CSS와 파일 픽셀을 혼동하지 않는다. 임시 viewport override는 종료 때reset했다.
- 가이드 enabled W필드 최종computed text rgb(37,50,71),label rgb(70,86,109) 확인. 이전rgb(200,213,228) 상속과 전후 캡처 보존.
- 이번 최종 명령 `npm test > _작업/codex/ux-studio/bottom-standard-final-tests.log 2>&1`: **416 tests /416 pass /0 fail**. 앞선410/1은 responsive-editor VM fixture의 새 preview함수 누락이었고 실제 API fixture로 보완해411/0, 상세 배율 보완 후 최종416/0이다. 여러 실행 수/전용 시험수를 합산하지 않는다. 스타일 대비 수정은 computed/실제 캡처로 확인했다.

증거: `docs/evidence/20261116-bottom-standard/`의 `build-guide-r21.jpg`(대비보완전), `build-guide-r21-readable.jpg`(보완후1900×1090), `canvas-r24-css1440.jpg`(1800×1125), `canvas-r24-css430.jpg`(514×1055). 파일명보다 이 실제 크기를 기준으로 한다. 보고 표지 jpg는 최신 전체캔버스r24 사본이다.

### 가이드·추가 기획과 다음
- 공통7종/index .11에 로비 제작 원칙/전체 노하우/규격/네이밍/조립/검수/경계/후속을 기록했다. 기존 .10 이하 본문과 선택 프로젝트 guide.4 사본은 보존한다. 실제 guide버튼→공통정본→툴기획서에서 AI for UI 절·계획 경로를 확인했다.
- AI for UI의 공식 목록/핵심4 SKILL 원문/Animate·성능·불필요연출 공식설명/공개 LICENSE를 검토해 `docs/plans/20261116-ai-for-ui-adoption.md`에 적용 방법을 편입했다. learn-taste·break-ui·mobile-native·버튼/모달 피드백·성능 검토는 기존 작업의 검수 방법이다. 자동설치/런타임패키지 추가는0이며 모든 스킬 실행/실물폰/60fps 완료를 주장하지 않는다.
- 사용자10장 모두 실물/크기/hash 대조한 상세조립명세와132계층/43연결·미확인 항목CSV를 준비했다. 이는 실제 제작 수가 아니다.
- 짓기용 새 도시 배경1회(941×1672/295148bytes)와 독립 랜드마크5개1회(각300KB이하/투명/tight alpha crop/전체PNG원본보존)를 준비했다. `_작업/codex/ux-studio/{build-city-assets,build-landmark-assets}.json`. 새 그림은 실제 제품에 아직 등록하지 않았다. 생성 원본의 일부 낮은 알파 가장자리 프린지는 알려진 미확인/시각검수 항목이다.
- 다음은 짓기 실제 화면 조립→native 텍스트/9slice·입력/메인과진입·Back 연결/저장재열기, 이어서 승리/앨범/친구/우측메뉴/방패/상점/이벤트/타이쿤이다. GO상태별그림 actual, 그림자강도 시각비교, 전체화면 동작/모바일·실물폰/스크롤·포커스 복귀·게임 연동은 남아 있다.
- standalone preview는 원 저장 논리크기를 viewport폭에 uniform fit한다. 전체캔버스/상세의 기기 프리셋·높이reflow와 달리 별도 기기 선택 메뉴는 아직 없다.
- 새 source모듈/import는 ARCHITECTURE 안내와 consumer closure시험에 반영했으나 독립 프로젝트에 Graphify 정식 지도는 없어 관련 원본만 좁혀 읽었다. 케이팝 옛 지도 갱신을 독립 정본 갱신으로 주장하지 않는다.

### 백업·보호·운영
새 백업은 이 루트 `docs/planning/_backup/20261116_단이/`의 `162051_review_entry_cache`, `1642_lobby_production_standard_guide_v10`, `164934_canvas_device_preview`, `170519_button_states`, `1720_ai_for_ui_planning`, `172915_responsive_vm_fixture`, `1736_lobby_actual_guide_v11`, `1738_guide_field_contrast` 및 각 담당보고에 기록한 상세 배율 백업이다. 원본·그림·설계는 버전 보존, 커밋 없음. 케이팝/모노/보호파일/7007프로세스/다른담당/게임정책/외부메시지/결제/시크릿은 손대지 않았다.

최신 주간은74%(codex10080분), 상한90%·조회실패 중지 유지. 현중의 최신 직접 시한은2026-11-17 08:00 KST이며 기존 `ui` heartbeat를 같은채팅·30분·그시각까지 ACTIVE로 도구갱신확인했다. 중복 예약/별도 채팅 생성 없음. 계속 제작하되 제한 도달 또는 시한이면PAUSED·현재저장/미완료 보고한다. 자동리셋/크레딧/임의재개는 없다.
