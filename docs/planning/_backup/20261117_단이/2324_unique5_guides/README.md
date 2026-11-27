# 카피바라고 · 샘플 UI 프로젝트

사용자 직접 요청에 따른 별도 샘플입니다. 모노폴리 GO와 설계·자원·workspace를 분리합니다.

게임 화면은 2D 스틸샷만 사용하고 조작 가능한 UI와 미리보기 연결만 제작합니다. 전투·이동·추첨·게임 계산은 구현하지 않습니다.

현재 순차 제작 진행·제안(검수 대기)입니다. C01~C10은 저장·단위 검수했고, C11 7일 축제 완성 편집은 스튜디오의 2MB 저장 제한에 막혀 정식 내보내기 원문으로 보존했습니다. 정식 사본 `ux-gjs-525651fd` r333은 17화면/1661부품/101연결이며 C11은52부품까지만저장됐습니다. 미저장완성native내보내기v002는17화면/1712부품/102연결·C11 103부품입니다. [차단·보존 보고](docs/collaboration/reports/20261117_seven01.md)를 먼저 읽습니다. C12는12자원, C13은21자원과조립recipe준비·native미적용입니다. 원본로비`ux-e7ee9590`r47은보존하며설계JSON외부편집/주입은하지않습니다.

- [캡처·UI 목록·관찰 연결 보고서](reference/video-analysis-20261117/index.html)
- [상세 분석보고](reference/video-analysis-20261117/분석보고.md)
- [화면 목록](reference/video-analysis-20261117/ui-inventory.json)
- [연결·상태 명세](reference/video-analysis-20261117/ui-connections.json)
- 원본 보존 영상: reference/capybara-go-20261117.mov
- [진행 기록](docs/collaboration/STATUS.md)

다음은 정식 용량 제한 해결 후 C11 완성편집 재저장·소비 미리보기 검수, C12 조립 순서입니다. C13 이후 새 자원 준비는 제한과 독립적으로 계속합니다. 현재 작업은 독립 Capybara workspace에만 적용합니다. 분석의 28개 UI 단위·58개 관찰 전환·9개 상태 그룹과 실제 제작/검수 수를 구분하며, 전체 완료 전에는 완료로 표시하지 않습니다.

## 다른 AI가 작업을 이어갈 때

[영상 분석·UI 제작 실행 가이드](../../src/tools/uxStudio/guide/VIDEO_UI_WORKFLOW.md)를 읽습니다. 실제 그림은 전부 새로 제작하고 캡처를 잘라 붙이지 않습니다. 게임 장면은 새 스틸 이미지로 두고 UI만 작업합니다. 최신 직접 지시에 따라 별도 workspace에서 로비부터 진행하며 상태/증거는 이 샘플 docs/collaboration/에 남깁니다.


[확대 비교·실수 예방 가이드](docs/ui/visual-review-and-lessons.md)를 제작 전·저장 전에 확인합니다. 기존 문서의 “영상 분석 단계/아직 미등록”은 초기 이력이며 최신 STATUS/보고와 실제 저장 설계를 우선합니다.

### 2026-11-17 14:24 KST 로비 정밀 재제작·메인 버튼

현재 native r47·160부품/1화면/전환0. 하단 상태별 규격·새 이벤트/HUD/메뉴 art·두꺼운 Start와 앞면3px 눌림 검수. [보고](docs/collaboration/reports/20261117_lobby03_precision.md), [실수 가이드](docs/ui/visual-review-and-lessons.md). 전체 연결은 미완료·제안(검수 대기).

### 2026-11-17 14:49 KST 프로젝트 폴더·조사서

프로젝트 폴더에서 두게임 조사서 버튼을 실제열고, 관리 기능은접었습니다. [보고](docs/collaboration/reports/20261117_project_folder_menu.md). 현재편집은 사용자캔버스사본 ux-gjs-525651fd r2(로비160/전환0), 원본 r47 보존. 선택메뉴 확대는 페이지선택 상태이며 다른페이지 연결은 제작대기입니다.

조립 준비: [C12 S등급 에픽 특가](docs/ui/recipes/C12_S등급_에픽특가.md) · [C13 데일리 특가](docs/ui/recipes/C13_데일리특가.md). 저장 제한과 미저장 상태는 [C11 보고](docs/collaboration/reports/20261117_seven01.md)를 우선합니다.
