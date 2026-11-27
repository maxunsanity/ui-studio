# 버튼·그림자·하단 구조 정확성 보완
작성자 codex(단이) · 2026-11-17 14:24 KST · 진행 · 제안(검수 대기)

## 지시 원문
현중 “정확성과 구조 연구가 정말 중요해.. …버튼 효과…그림자…똑같이…구조 연구…” 및 “가운데 유닛과 좌우가 분리…화면이 늘어나도…배수와 버튼이 붙어 있지…원본과 틀려”.
이전 영상분석→누락UI 순서는 유지하고, 다음 제작 전에 현재 공통 구조/반응부터 보완합니다.

## 읽은 원본
r289 저장설계·Main HUD_Bottom 및 Btn_Roll_GO/Multiplier 계층, button-state.mjs/visual-effects.mjs/commands.mjs/main.mjs 관련 inspector·consumer/layout 렌더, 기존 button/DOM/Undo 시험, 첨부 f93262f6…png와 원본05_main, 기존 UG Selectable 분석. 실제Jail3초유지 캡처/DOM은 증거20261117-overlay-base-visibility/pressed-before-enhancement.json으로 보존했습니다.

## 원인·계획
docs/plans/20261117-button-depth-bottom-structure.md를 따릅니다. 실제 tint 작동/앞면 동반이동 부재·같은 실루엣의 이중shadow·Main중앙/좌우 역할 계층 부재를 확인했습니다. 원본 Unity 계층/원본 눌림 프레임 변형은 아직 미확인입니다. 공통 엔진 단일담당은 본체이고 2차 세션은 설계/그림만 진행하도록 지식 공유했습니다.

## 백업·다음
docs/planning/_backup/20261117_단이/1424_button_depth_bottom. RED→최소수정→회귀→native조립→실화면/저장재열기→가이드/공유입니다. 7018only/7007제외/원본·다른 프로젝트/보호 범위 유지, 승인·완성 자칭 없음.


## 기록 시각 정정 · 2026-11-17 14:11 KST
앞선14:12/14:24는 초안에 잘못 넣은 시각이며 실제 측정 시각으로 사용하지 않습니다. clock 실조회2026-11-17 05:09:54 UTC=14:09:54 KST 확인 후 이 정정을 추가했습니다. 파일명1424/백업명은 단위 식별자로 보존합니다. 시험·저장revision·캡처 기록은 변경하지 않았습니다.


## 단위 결과 · 2026-11-17 15:21 KST · r299 · 제안(검수 대기)

현중의 후속 원문 “이상해 졌어..입체감이 사라졌어..너무 올라간듯..위 버튼이..다시 확인”, “합치는것도 원본을 다시 보고 연구해”를 우선 반영했습니다. 거절된 r296/v001을 보존하고 원본을 다시 읽어 r297/v002로 재조립, 입력 그룹 보정 r298, 너비 시험 Undo 후 r299로 저장했습니다. 이번 단위만 보고하며 전체 UI 완료/원본 동등/승인으로 보고하지 않습니다.

### 원본 재연구와 제작 구조
- 원본 05_main.png는709×1269. 기준551×984 환산, 밝은 앞면 내부239×218/앞면 끝Y1137/몸체 끝Y1174 차37원본px≈29논리px, 배수 중심약(487,938)을 관찰했습니다. RGB연결영역·수동외곽 대조, 내부±2/베벨±6원본px 오차이며 Unity 원본 계층은 미확인입니다.
- v001은 앞면214×194/몸체 깊이22와 잘못 옮긴 배수 때문에 높이·입체감·연결 윤곽이 어긋났습니다. v002 앞면200×170/몸체210×170·Y차29로 보정했습니다. 배수는 이전 위치로 돌리고 받침의 원형 돌출부를 한 실루엣으로 합쳤습니다. 원/프레임 두 개를 겹쳐 내부 이음선을 만들던 Tab2부품은 native 삭제했습니다.
- HUD_Bottom=가로늘림/하단고정. Left176×120/Center288×298/Right176×120 역할분리, 메뉴4개80×92 및 icon64²/text80×22/badge28² 유지. 중앙곡선/배수 받침은 고정, 좌우 직선바/프레임만9slice로 가변입니다. 중앙을 앞순서로 두어 짓기·앨범 일부를 가린 중간 실수는 Left/Right를 다시 앞으로 보내 해결했습니다.
- GO wrapper고정, Front(이미지/글자/화살표/안내)만5논리px 내려갑니다. FixedRim은 고정, 외부 그림자는 엔진에서 처리합니다. 부모/앞면의 중복 기본 그림자는 껐으며 고정 몸체(0,4,blur4,.28), pressed 앞면 임시(0,1,blur1,.12)만 사용합니다.
- v00110자원/새v0029자원과 SVG·PNG·production/staging WebP·SHA를 보존했습니다. v002는 현재8개 적용, 전체높이 비교용 프레임1개 미적용입니다. 새로 작성한 벡터 UI이며 참고캡처 픽셀·글자·외부 cast shadow를 그림에 구워 넣지 않았습니다. 재질 베벨은 외부 그림자와 구분합니다.

### 최소 도구 소스 변경
- src/tools/uxStudio/button-state.mjs:12·28·80 — 선택적 pressFeedback, 비입력 자손 target/0~16px·기존shadow 형식 검증, Front translate/상태그림/눌림그림자 합성 및 복원. 포인터 이탈/복귀·취소·blur·Escape·release·disabled/dispose 처리. 기존 absent 계약 유지.
- src/tools/uxStudio/commands.mjs:10·57 — 복사시 motion/graphic target 각각 새ID매핑, 삭제/그룹해제시 optional motion 참조 정리.
- src/tools/uxStudio/main.mjs:1792·3177 — native '눌림 깊이 · 앞면과 그림자' 양식·Undo·검증·저장 계약. product변경3모듈, 새패키지0.
- 신규 tests/ux-studio/button-press-depth.test.mjs, button-state-editor.test.mjs·control-visual.test.mjs 보완. 후자는 button 자체가 아닌 중간 Front 아래 label에서 pointer가 시작하는 경로도 검증합니다.
- 프로젝트 폴더 모달은2차 담당 project-manager.mjs/project-research.json/전용test의 별도작업. 본체가 실제 소스/보고를 읽고 새 전체516시험에 포함했습니다. 각 프로젝트 열기/조사서보기, 접힌 폴더정보/추가관리는 통합됐지만 임의 workspaceHTML viewer 기능은 아닙니다. 카피설계/자원/수치는 수정하지 않았습니다.

### 실제 입력 실패와 해결
r297에서 Space는 눌렸지만 실제 마우스는 normal/hover만 관찰됐습니다. .ax.click duration 호출이 성공했다고 pressed 통과로 세지 않았습니다. inputOwner는 중간 그룹none에서 탐색을 멈추므로 Front도 '게임 입력→부모에 전달'로 native 지정해 r298에 저장했습니다. 이후 실제 mouse4초에서 normal→hover→pressed→hover/release, translate0→5px→0·다른상태 assetRef·임시shadow복원까지 확인했습니다. 소스가 새 그룹 입력을 자동 변경하도록 넓히지는 않았습니다.
테스트 보완의 첫2실패는 fixture interaction에 enabled/shape/reason이 빠진 것이며 로그를 보존했습니다. 완전한 입력 형식을 넣은 뒤 관련33/33·새 전체516/516 fail0/cancel0/exit0를 확인했습니다. 실패를 제품 새버그로 바꾸어 설명하지 않습니다.

### 확인·증거
- native 진입: 7018 전용 상세링크(workspace/project명시)→Page_Board→배치편집/레이어/속성→게임입력/버튼상태/앵커/이미지경로 입력+Tab→파일저장·재읽기→동작시험. 외부 설계JSON 수정0.
- 실제 mouse4초/Space3초에서 Front/제목의 상대Y 동일 이동, wrapper/FixedRim고정, 상태 그림 교환/눌림 그림자/해제 복원 확인. 키보드 초점의 화면이동이 있어 절대Y 대신 wrapper 대비Y를 비교했습니다.
- 논리551→768 native변경에서 중앙·좌우·메뉴·배수 W/H고정, 좌X고정/중앙증가폭절반/우증가폭전체, Undo복원 확인. 저장 메타 revision/savedAt 외 전체내용 동일. r299는 이 검수 후 저장판입니다.
- 실제기기390×844/430×932의 이미지failed0/loading0. 최종430 유닛 확대를 CSS1920×1280에서 촬영했고 반환2400×1600, 실제 칠해진 CSS영역을 대조해477×271 하단을 잘랐습니다. 파일크기/DPR만으로 크롭 위치를 추정하지 않았습니다. old-v002 검은크롭/다른배율중간본은 최종증거에서 제외합니다.
- docs/evidence/20261117-button-depth-bottom/r299-native-qa.json:34실제수치·상태검사 pass. r299-430-unit-editor.jpg/r299-430-pressed-editor.jpg 원본과 r299-430-bottom.png/r299-430-pressed.png, original-vs-r299-bottom.jpg.
- _작업/codex/ux-studio/button-depth-child-input-final.log 관련33/33; button-depth-full-final.log npm test516/516. 앞단위509/514 또는2차가 따로 실행한516과 합산하지 않습니다.
- common guide .25/10목차를 실제툴 '가이드'에서 읽었습니다. 공통값·실패·입력경로·원본측정·slice·source/render/파일 구분·프로젝트창을 함께 기록했습니다. 프로젝트 guide.4와2차 VIDEO_UI_WORKFLOW는 덮어쓰지 않았습니다.
- 프로젝트폴더→모노폴리 조사서 버튼→내장 최신문서를 실제 열었습니다.98img/새실제이미지2개 natural477·complete. CSS430×842/1440×900 가로넘침0. 최초 새figure에 기존shots스타일이 적용되지 않아 모바일 넘침1을 발견했고 해당 section만 responsiveCSS로 고쳐 재검수했습니다.
- 영상문서 local/public/model검사1978/1978.9MOV 원본hash불변·HTML98·공용230파일 해시/링크·현재r299/12화면941부품20연결 확인. 역사적기준 r27710화면902부품은 그대로 보존합니다.

### 보존·백업·환경
r299 Main180/다른11화면바이트동일/20edges동일/r289기존Main175IDs유지, 신규5부품. r296/v001·원본SVG/PNG·기존화면/자원 보존.
백업:1424_button_depth_bottom(소스/시험/r289/서버ownership),1447_go_original_remeasure(r296),1513_guide25_go_structure,1516_inventory_r299 아래입니다. 각 위치는 docs/planning/_backup/20261117_단이/ 하위입니다.
pressFeedback 저장을 실제 시도했을 때 기존 Node validator캐시가 거절했고 native draft는 유지했습니다. 이미 승인된 전용7018/자기PID44569만 종료 후 scripts/start.mjs로 재실행해 현재PID9796/exec87757에 저장을 확인했습니다. 최초 sandbox listen EPERM은 같은 실행을 require_escalated로 요청해 자동승인된 뒤 재실행했으며, 그 외서버/7007은 무접근·무변경입니다. 2차는 r44 저장/대기 후 재실행완료를 전달받고 재개했습니다. 이 이후는 서버재시작0.
프로젝트 코드지도는 존재하지 않아3모듈 import/export와 관련원본만 검색했습니다. 새자동화/예약/시크릿/외부서비스/결제/빌드/보호파일/타게임소스 변경0, 기존ui PAUSED 유지. 주간 제한은 사용자명시해제, 최근계정5%·ordinaryUsageAllowed=true·리셋/구매0. 커밋0.

### 미확인·다음
원본 GO 각진 서체·광택/색/미세연결선·원본눌림프레임 동등, 다른모든버튼의 새깊이 적용, 실제게임주사위/자동굴리기/차감·물리터치기기·실게임감옥입구/횟수/보석금 흐름은 미완료입니다. source-regression은 물리터치/최종 시각승인을 대신하지 않습니다.
영상목록 신규21가족 중 감옥/보석금2진행/19미착수, 쇼룸부분1이며 이번 Main 보완을 새화면 완료로 더하지 않습니다. W/P/U/S0/4·원본최종동등승인0/10·전체UI완료아님. 다음 제작도 원본 관찰→공통규격/계층→새자원→native조립→입력/복귀/기기→가이드의 같은 순서로 진행합니다.
