# 카피바라고 · 샘플 UI 프로젝트

사용자 직접 요청에 따른 별도 샘플입니다. 모노폴리 GO와 설계·자원·workspace를 분리합니다.

게임 화면은 2D 스틸샷만 사용하고 조작 가능한 UI와 미리보기 연결만 제작합니다. 전투·이동·추첨·게임 계산은 구현하지 않습니다.

현재 로비 제작 진행·제안(검수 대기)입니다. 독립 workspace 등록 후 ux-e7ee9590 r16에서 로비1화면·65부품·연결0을 저장했습니다. 공통 HUD/하단메뉴·메시지바·시작 버튼을 조립했으며 전체 화면 연결·시각 동등 검수는 미완료입니다. `ui-studio/project.json`이나 설계 JSON을 외부에서 만들어 등록한 것처럼 처리하지 않습니다.

- [캡처·UI 목록·관찰 연결 보고서](reference/video-analysis-20261117/index.html)
- [상세 분석보고](reference/video-analysis-20261117/분석보고.md)
- [화면 목록](reference/video-analysis-20261117/ui-inventory.json)
- [연결·상태 명세](reference/video-analysis-20261117/ui-connections.json)
- 원본 보존 영상: reference/capybara-go-20261117.mov
- [진행 기록](docs/collaboration/STATUS.md)

다음 작업은 이 폴더를 도구의 정식 폴더 선택 경로로 열어 독립 UI workspace를 만들고 C01 로비에서 시작하는 UI들을 조립하는 것입니다. 기존 1차 모노폴리 GO workspace/설계/검수 포인터/작업 탭은 변경하지 않습니다. 로비에서 도달·복귀 가능한 28개 UI 단위의 58개 관찰 전환과 9개 상태 그룹을 명세로 두며 실제 입력·저장 재열기·1440/430px 검수 전에는 구현 완료로 표시하지 않습니다.

## 다른 AI가 작업을 이어갈 때

[영상 분석·UI 제작 실행 가이드](../../src/tools/uxStudio/guide/VIDEO_UI_WORKFLOW.md)를 읽습니다. 실제 그림은 전부 새로 제작하고 캡처를 잘라 붙이지 않습니다. 게임 장면은 새 스틸 이미지로 두고 UI만 작업합니다. 최신 직접 지시에 따라 별도 workspace에서 로비부터 진행하며 상태/증거는 이 샘플 docs/collaboration/에 남깁니다.


[확대 비교·실수 예방 가이드](docs/ui/visual-review-and-lessons.md)를 제작 전·저장 전에 확인합니다. 기존 문서의 “영상 분석 단계/아직 미등록”은 초기 이력이며 최신 STATUS/보고와 실제 저장 설계를 우선합니다.

### 2026-11-17 14:24 KST 로비 정밀 재제작·메인 버튼

현재 native r47·160부품/1화면/전환0. 하단 상태별 규격·새 이벤트/HUD/메뉴 art·두꺼운 Start와 앞면3px 눌림 검수. [보고](docs/collaboration/reports/20261117_lobby03_precision.md), [실수 가이드](docs/ui/visual-review-and-lessons.md). 전체 연결은 미완료·제안(검수 대기).

### 2026-11-17 14:49 KST 프로젝트 폴더·조사서

프로젝트 폴더에서 두게임 조사서 버튼을 실제열고, 관리 기능은접었습니다. [보고](docs/collaboration/reports/20261117_project_folder_menu.md). 현재편집은 사용자캔버스사본 ux-gjs-525651fd r2(로비160/전환0), 원본 r47 보존. 선택메뉴 확대는 페이지선택 상태이며 다른페이지 연결은 제작대기입니다.
