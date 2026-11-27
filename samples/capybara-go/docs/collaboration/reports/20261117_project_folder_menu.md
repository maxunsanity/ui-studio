# 프로젝트 폴더 정리·두 게임 조사서 버튼
codex(단이·2차) · 2026-11-17 14:49 KST · 제안(검수 대기)

현중 지시: “프로젝트 폴더 메뉴…너무 복잡”, 스크린샷의 modal 지정, “조사서…1차와 니가 한거 모노폴리고와 카피바라고 둘다”. 후속 원본 페이지 제작 요청은 유지하되 이 단위를 먼저 처리했습니다.

결과: 현재/다른 프로젝트 카드로 정리하고 모노폴리 GO·카피바라고 각각 열기/조사서 보기. 경로·작업 모드는 접힌 폴더 정보, 시험 프로젝트·사본 저장·작업 방식·공용 저장공간은 접힌 추가 관리로 이동. 반복 사본 버튼을 대상 선택1개+사본 버튼1개로 통합, 기존 기능·데이터 삭제0.

변경 파일 근거: src/tools/uxStudio/project-manager.mjs:25 그룹 분리, :31 local HTML 허용 경로, :41 modal, :121 목록 렌더. project-research.json은 실제 directory별 제목/정적 viewer만 명시. tests/ux-studio/project-menu.test.mjs 신설. guide/reference/capybara-go-video-20261117/에 카피 조사서28항목/44캡처 추가. 프로젝트 보존사본 ui-studio/research/capybara-video/ 동일 자료. 모노폴리 기존 guide/reference/monopoly-go-video-20261117/index.html은 경로만 참조하고 본문/자원/설계를 수정하지 않았습니다.

1차와 파일 담당을 협의했습니다. 2차 project-manager/config/전용tests/카피자료, 1차 button-state/commands/main/가이드index/공통STATUS. 중간 workspace backend viewer 제안은 최종 정적2자료 계약으로 대체, 새 route/서버 재시작/API변경0. 무관 프로젝트가 같은 이름이어도 정확한 directory가 달라 조사서가 오연결되지 않도록 검증합니다. 임의 workspace HTML 지원 기능이 아닙니다.

검증: 새2시험 RED(없는함수)→관련11/11 GREEN. 전체 npm test 첫 실행은 sandbox fixture EPERM, 필요한권한의 동일 재실행516/516·fail0/cancel0/exit0. 로그 /Users/max/projest_max/ui-studio/samples/capybara-go/_작업/codex/page-sequence/project-menu-full-tests.log. 독립 읽기전용 리뷰가 백업대비 변경·관련파일을 확인했고 중요 문제 없음·관련11/11 재확인, 브라우저 검수는 본체2차 수행입니다.

실화면: 별도검수탭에서 선택 카피사본 r2 유지→프로젝트폴더→카피 조사서 버튼→28article/44img(일부lazy)→모노폴리 버튼→정확한 제목/96img(일부lazy). 두 조사서 전체 local 문서/그림 HTTP 확인은 모노225/225·카피50/50 상태200. lazy미로딩을 깨짐으로 세지 않았습니다. CSS1440×900 modal720×628,430×843 modal373×628·가로넘침0. 관리 기본접힘/펼치면 시험용·대상사본선택/작업방식/공용공간 보존을 실제확인. native mouse로열기→Escape→‘프로젝트폴더’ BUTTON 초점복귀. 사본 실행/작업방식 변경/폴더 선택은 데이터 변경을 피하려 이번에 실행하지 않았고 기존 관련시험을 구분합니다.

증거: /Users/max/projest_max/ui-studio/samples/capybara-go/docs/collaboration/evidence/20261117_project_folder_menu
백업: /Users/max/projest_max/ui-studio/docs/planning/_backup/20261117_단이/1439_project_folder_menu

같이 반영한 사용자 정정: 현재사본 ux-gjs-525651fd r2에서 Nav를Message보다앞으로 native재정렬·저장/재읽기, 겹치는점의 DOM stack에서 art→Message 순서 확인. 토큰.5에 선택한메뉴 active160/나머지86·전체504 누적배치·페이지별변환 명시. 누르는동안만확대 해석은 잘못으로 가이드에 기록. 현재는 로비1화면160부품/전환0이며 상점클릭 왕복은 아직 미구현입니다. 원본 ux-e7ee9590 r47 보존. 장비 새캐릭터원화1종만준비·화면조립미착수.

손대지 않은 것: 1차GO/모노폴리설계·그림, main/commands/button-state/save-plugin/workspace-store, 서버PID/7007/예약/보호파일. 커밋·게시·설치 없음. 독립 도구에 기존 코드지도 없음·작은관련파일만직접확인, import/export 지도재생성은 하지 않았습니다. 다음: C02 장비부터 순차 새그림/native조립/가변메뉴와 진입·복귀 연결. 전체28 UI 완료는 아닙니다.
