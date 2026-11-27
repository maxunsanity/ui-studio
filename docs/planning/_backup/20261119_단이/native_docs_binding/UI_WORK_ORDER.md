# UI 작업 순서 · 케이팝몬스터즈

## 작업 범위
사용자 최신 직접 지시: 기획은 1차 와이어프레임과 2차 세부 와이어프레임까지만.
합의된 기준은 로비1차뿐. 2차와 다른 페이지를 합의된 것으로 확대하지 않는다.
1차는 영역·정보 우선순위·주요 동선, 2차는 부품 구성·부모자식·크기/간격·정렬·글자 자리·입력 범위·상태·연결을 구체화한다.
2차에 완성 아이콘·캐릭터·재질·광택·입체 버튼 원화·장식 스타일을 추가하지 않는다. 3차 본UI 제작과 게임 기능 연결은 이번 범위가 아니다.

## AI가 읽는 순서
1. 이 파일과 프로젝트 AGENTS.md, 최신 사용자 직접 지시.
2. project.json과 designs/ux-31671dd8.json을 읽어 실제 workspace/project/revision/현재 대상 확인. 저장본은 읽기만 하고 수정은 실제 편집기에서 한다.
3. 작업 명세 데이터: /Users/max/projest_max/ui-studio/src/tools/uxStudio/planning-documents.json
   projects에서 workspaceId=workspace-cfa517bd-d9e1-40c4-aa1f-576e182500ba, projectId=ux-31671dd8를 선택.
   sections는 영역별 규칙, parts는 부품별 fields(표시/동작/표시 규칙 등), sourceFields는 원문 전체 근거.
   screens.main.elements는 실제 부품ID에서 문서 절로 연결하는 표. 자식에 개별 연결이 없으면 가장 가까운 연결 부모를 확인.
4. 원본 기획서: /Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/reference/kpop-lobby/source.html
   전체 자료와 그림은 source-images/에 있음. 이미지의 과거 컨펌 표기를 최신 승인으로 해석하지 않는다.
5. 변경 이력은 같은 폴더 history.html. 분리 전 자료는 archive-original.html. 공용 작업 결과는 /Users/max/projest_max/ui-studio/docs/collaboration/reports/20261119_lobby_planning_reader.md

## 작업 실행
- 먼저 대상 부품의 구성·표시·동작·상태·문구 규칙·데이터 근거와 미정 항목을 확인한다.
- 샘플은 구조와 규격 비교에 사용한다. 원화/장식까지 가져와 2차로 만들지 않는다.
- 원문에 없는 치수는 확정값처럼 창작하지 않는다. 규격안을 미정과 구분하여 검토받는다.
- 합의된 1차의 같은 화면·stable ID·부모·연결을 이어 2차를 작성한다. 아직 선행 다른 화면 삭제가 미실행인 점을 확인한다.
- 실제 편집/저장/재열기 및 범위 내 화면 검수 후 보고한다. 요약 정보만으로 모르는 부분을 추측하지 않는다.
- 본문에는 작업에 필요한 설명을 남기고 합의 이력·작업 보고·관리 안내 문구를 반복 노출하지 않는다.

## 사람의 열람
7018 로비 작업 화면의 상단 ‘원본 기획서’ 버튼으로 전체 자료를 연다. 오른쪽에는 선택 부품의 작업 규칙과 ‘작업 명세’ 버튼이 있다.
