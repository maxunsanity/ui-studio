# UI 스튜디오 AI 작업 지침
최신 사용자 직접 지시와 상위 AGENTS.md가 우선합니다. 도구 정본은 /Users/max/projest_max/ui-studio/입니다. 도구 소스·의존성·서버·가이드·기본 저장공간·보고는 이 폴더에서 독립 운영합니다.

먼저 이 루트 README.md, src/tools/uxStudio/guide/{AI_GUIDE,USER_GUIDE,TOOL_SPEC,ARCHITECTURE,EXISTING_GAME,PROGRESS}.md와 docs/collaboration/README.md를 읽습니다. 이 루트 AGENTS.md가 협업 규칙의 우선 정본입니다. 현재 실제 구현과 전환 계획·미확인을 구분합니다. 모노폴리 GO는 검증용 샘플이며 게임 전체 완성을 뜻하지 않습니다.

정식 실행 주소는 http://127.0.0.1:7018/ui-studio/입니다. preview.html·canvas.html·source/도 이 경로 아래입니다. 실행은 이 루트 scripts/start.mjs와 자체 node_modules의 Vite 5.4.21·정확한 의존성 묶음을 사용합니다. 다른 프로젝트 서버나 설치 위치 fallback을 실행 조건으로 추가하지 않습니다. 이번 .4 기동 단계에서 자체 의존성 준비·7018 기동·루트 작업 경로·로컬 Vite·HTTP와 자동 시험 215/215를 확인했습니다. Browser 접근성 트리 읽기와 실제 클릭·새 workspace·전체 화면 검수는 분리합니다. 폴더 전환·프로젝트 가이드 사본 기능의 추가 구현·검수는 진행 중이며 전체 완료로 쓰지 않습니다.

기존 게임 변환은 반드시 먼저 질문합니다. 폴더 열기는 변환 동의가 아닙니다. 거절 시 원 게임 소스 무수정, 선택게임/ui-studio 내부 독립 저장을 유지합니다. 허용 시 전체 화면 조사·백업·대응표·회귀와 미완료를 기록합니다. 미정 게임 수치·기능·승인을 만들지 않습니다.

도구 URL과 게임별 저장공간을 구분합니다. 프로젝트 폴더 workspace ID와 설계 document.projectId/revision을 함께 확인하고 API·미리보기·저장 통지를 같은 workspace 범위로 유지합니다. 심볼릭 링크·상위 경로 탈출과 저장 충돌 검사를 우회하지 않습니다. 기존 프로젝트 가이드 사본을 자동 덮어쓰지 않습니다.

변경 전 이 루트 docs/planning/_backup/YYYYMMDD_단이/에 백업하고 자기 임시 작업은 _작업/codex/에 둡니다. 보호 대상과 다른 담당 소스를 수정하지 않습니다. 외부 발송·공개게시·결제·시크릿 접근·원본 삭제·지시 없는 서버 시작/재시작·빌드·감시·예약은 금지합니다.

현재 작업의 지시·진행·보고는 이 루트 docs/collaboration/ 안에서 운영합니다. 협업 진입점은 docs/collaboration/README.md, 진행 정본은 docs/collaboration/STATUS.md이며 append만 합니다. 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md입니다. 기존 상세 보고 docs/reports/20261116-project-workspaces.md는 보존합니다. 대표 본체가 공용 수신·STATUS·보고를 맡고 하위 AI는 배정된 범위만 수행합니다.

소스 검사·자동 시험·HTTP·실제 화면 검수를 분리하고 결과는 제안(검수 대기)로 남깁니다. 읽은 원본·변경·시험 명령과 결과·캡처·백업·미확인·다음을 기록합니다. 과거 시험 수나 7007 접근권한 상태를 7018 검수 결과로 쓰지 않습니다. 자동 접근 거절을 다른 포트·호스트·표면으로 우회하지 않습니다.

## 이관 이력의 경계
과거 케이팝 공유 루트는 출처·종료 기록으로만 다룹니다. 중복 도구 101파일은 이 루트 docs/planning/_backup/20261116_단이/1012_kpop중복정리/에 이동 보존했습니다. 케이팝 src/tools/uxStudio/의 model.mjs·consumer.mjs 두 export 연결은 기존 소비자가 독립 정본을 읽는 단방향 참조이며 UI 스튜디오 실행 조건이 아닙니다. 다른 프로젝트의 원 기획·시뮬레이터·저장 데이터를 도구 작업 범위로 확대하지 않습니다.
