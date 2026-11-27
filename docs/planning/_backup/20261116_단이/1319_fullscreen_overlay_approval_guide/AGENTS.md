# UI 스튜디오 AI 작업 지침
최신 사용자 직접 지시와 상위 AGENTS.md가 우선합니다. 도구 정본은 /Users/max/projest_max/ui-studio/입니다. 도구 소스·의존성·서버·가이드·기본 저장공간·보고는 이 폴더에서 독립 운영합니다.

먼저 이 루트 README.md, src/tools/uxStudio/guide/{AI_GUIDE,USER_GUIDE,TOOL_SPEC,ARCHITECTURE,EXISTING_GAME,PROGRESS}.md와 docs/collaboration/README.md를 읽습니다. 이 루트 AGENTS.md가 협업 규칙의 우선 정본입니다. 현재 실제 구현과 전환 계획·미확인을 구분합니다. 모노폴리 GO는 검증용 샘플이며 게임 전체 완성을 뜻하지 않습니다.

정식 실행 주소는 http://127.0.0.1:7018/ui-studio/입니다. preview.html·canvas.html·source/도 이 경로 아래입니다. 실행은 이 루트 scripts/start.mjs와 자체 node_modules의 Vite 5.4.21·정확한 의존성 묶음을 사용합니다. 다른 프로젝트 서버나 설치 위치 fallback을 실행 조건으로 추가하지 않습니다. 자체 의존성·7018 기동·루트 작업 경로·로컬 Vite·HTTP와 독립 전환 당시 자동 시험 220/220을 확인했습니다. 실제 가이드·폴더 선택·독립 선택·설계 사본·저장·재열기·409 충돌·왕복 격리·미리보기·모달 포커스·캔버스 W 단계 왕복을 검수했습니다. 정확한 실제 범위는 PROGRESS.md와 docs/evidence/20261116-independence/browser-checks.json을 따릅니다. CSS 검사 크기와 캡처 파일의 실제 픽셀 크기를 구분합니다. 독립 전환 당시 602×1181 모바일 증거를 최종 430px 캡처로 적지 않으며 이번 증거는 최신 PROGRESS.md와 본체 보고를 따릅니다.

기존 게임 변환은 반드시 먼저 질문합니다. 폴더 열기는 변환 동의가 아닙니다. 거절 시 원 게임 소스 무수정, 선택게임/ui-studio 내부 독립 저장을 유지합니다. 허용 시 전체 화면 조사·백업·대응표·회귀와 미완료를 기록합니다. 미정 게임 수치·기능·승인을 만들지 않습니다.

도구 URL과 게임별 저장공간을 구분합니다. 프로젝트 폴더 workspace ID와 설계 document.projectId/revision을 함께 확인하고 API·미리보기·저장 통지를 같은 workspace 범위로 유지합니다. 심볼릭 링크·상위 경로 탈출과 저장 충돌 검사를 우회하지 않습니다. 공통 내장 가이드는 .7이고 실제 생성·읽기를 확인한 프로젝트 사본은 .4입니다. 기존 프로젝트의 guide·project.json guideVersion을 자동 덮어쓰지 않습니다. samples/folder-check는 게임 샘플이 아닌 저장·격리 시험 fixture입니다.

변경 전 이 루트 docs/planning/_backup/YYYYMMDD_단이/에 백업하고 자기 임시 작업은 _작업/codex/에 둡니다. 보호 대상과 다른 담당 소스를 수정하지 않습니다. 외부 발송·공개게시·결제·시크릿 접근·원본 삭제·지시 없는 서버 시작/재시작·빌드·감시·예약은 금지합니다.

현재 작업의 지시·진행·보고는 이 루트 docs/collaboration/ 안에서 운영합니다. 협업 진입점은 docs/collaboration/README.md, 진행 정본은 docs/collaboration/STATUS.md이며 append만 합니다. 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md입니다. 기존 상세 보고 docs/reports/20261116-project-workspaces.md는 보존합니다. 대표 본체가 공용 수신·STATUS·보고를 맡고 하위 AI는 배정된 범위만 수행합니다.

기본 /ui-studio/와 canvas.html은 전체 캔버스이고 ?editor=detail은 상세 편집입니다. 프로젝트 종류·이름·경로, 설계 이름·revision·미저장 표시와 workspace·project·screen·element 전달을 유지합니다. 컨트롤 7종·상태별 이미지, workspace 자원 파일, schemaVersion 4 응답형 배치·스크롤, 출처/조건/payload/스토리보드 연결 명세를 구현했습니다. v4는 logicalSize·safeArea·화면 직속 useSafeArea·2D rectTransform·고정 itemSize 가로/세로/그리드·DOM clip/scroll을 지원합니다. 1/2/3의 기존 의미와 구형 layout.direction은 보존하며 명시적인 새 배치 편집 때만 v4로 올립니다. 전체 Unity/Figma 호환·엔진 어댑터 자동 생성·게임 소스 쓰기는 제공하지 않습니다. JSON 단독 출력에는 자원 파일이 동봉되지 않으므로 선택 ui-studio의 설계·assets를 함께 전달합니다.

소스 검사·자동 시험·HTTP·실제 화면 검수를 분리하고 결과는 제안(검수 대기)로 남깁니다. 이번 계획 기능의 대표 본체 npm test는 302/302이며 _작업/codex/ux-studio/tool-capabilities-tests.log에 기록합니다. 위 220/220은 독립 전환 때의 과거 시험입니다. W/P/U/S 종합검수는 0/4입니다. 도구 단위 다음 제작은 모노폴리 GO 정식 UI이며 그래픽·전체 샘플·실제 게임 연결은 미완료입니다. 지원 밖 기능을 새 선행 조건으로 추가하지 않습니다. 읽은 원본·변경·시험 명령과 결과·캡처·백업·미확인·다음을 기록합니다. 과거 시험 수나 7007 접근권한 상태를 7018 검수 결과로 쓰지 않습니다. 자동 접근 거절을 다른 포트·호스트·표면으로 우회하지 않습니다.

## 이관 이력의 경계
과거 케이팝 공유 루트는 출처·종료 기록으로만 다룹니다. 중복 도구 101파일은 이 루트 docs/planning/_backup/20261116_단이/1012_kpop중복정리/에 이동 보존했습니다. 케이팝 src/tools/uxStudio/의 model.mjs·consumer.mjs 두 export 연결은 기존 소비자가 독립 정본을 읽는 단방향 참조이며 UI 스튜디오 실행 조건이 아닙니다. 다른 프로젝트의 원 기획·시뮬레이터·저장 데이터를 도구 작업 범위로 확대하지 않습니다.
