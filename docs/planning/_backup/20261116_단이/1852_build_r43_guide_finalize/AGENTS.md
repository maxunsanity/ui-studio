# UI 스튜디오 AI 작업 지침
최신 사용자 직접 지시와 상위 AGENTS.md가 우선합니다. 도구 정본은 /Users/max/projest_max/ui-studio/입니다. 도구 소스·의존성·서버·가이드·기본 저장공간·보고는 이 폴더에서 독립 운영합니다.

먼저 이 루트 README.md, src/tools/uxStudio/guide/{AI_GUIDE,USER_GUIDE,TOOL_SPEC,ARCHITECTURE,EXISTING_GAME,PROGRESS}.md와 docs/collaboration/README.md를 읽습니다. 이 루트 AGENTS.md가 협업 규칙의 우선 정본입니다. 현재 실제 구현과 전환 계획·미확인을 구분합니다. 모노폴리 GO는 검증용 샘플이며 게임 전체 완성을 뜻하지 않습니다.

정식 실행 주소는 http://127.0.0.1:7018/ui-studio/입니다. preview.html·canvas.html·source/도 이 경로 아래입니다. 실행은 이 루트 scripts/start.mjs와 자체 node_modules의 Vite 5.4.21·정확한 의존성 묶음을 사용합니다. 다른 프로젝트 서버나 설치 위치 fallback을 실행 조건으로 추가하지 않습니다. 자체 의존성·7018 기동·루트 작업 경로·로컬 Vite·HTTP와 독립 전환 당시 자동 시험 220/220을 확인했습니다. 실제 가이드·폴더 선택·독립 선택·설계 사본·저장·재열기·409 충돌·왕복 격리·미리보기·모달 포커스·캔버스 W 단계 왕복을 검수했습니다. 정확한 실제 범위는 PROGRESS.md와 docs/evidence/20261116-independence/browser-checks.json을 따릅니다. CSS 검사 크기와 캡처 파일의 실제 픽셀 크기를 구분합니다. 독립 전환 당시 602×1181 모바일 증거를 최종 430px 캡처로 적지 않으며 이번 증거는 최신 PROGRESS.md와 본체 보고를 따릅니다.

기존 게임 변환은 반드시 먼저 질문합니다. 폴더 열기는 변환 동의가 아닙니다. 거절 시 원 게임 소스 무수정, 선택게임/ui-studio 내부 독립 저장을 유지합니다. 허용 시 전체 화면 조사·백업·대응표·회귀와 미완료를 기록합니다. 미정 게임 수치·기능·승인을 만들지 않습니다.

도구 URL과 게임별 저장공간을 구분합니다. 프로젝트 폴더 workspace ID와 설계 document.projectId/revision을 함께 확인하고 API·미리보기·저장 통지를 같은 workspace 범위로 유지합니다. 심볼릭 링크·상위 경로 탈출과 저장 충돌 검사를 우회하지 않습니다. 공통 내장 가이드는 .8이고 실제 생성·읽기를 확인한 프로젝트 사본은 .4입니다. 기존 프로젝트의 guide·project.json guideVersion을 자동 덮어쓰지 않습니다. samples/folder-check는 게임 샘플이 아닌 저장·격리 시험 fixture입니다.

변경 전 이 루트 docs/planning/_backup/YYYYMMDD_단이/에 백업하고 자기 임시 작업은 _작업/codex/에 둡니다. 보호 대상과 다른 담당 소스를 수정하지 않습니다. 외부 발송·공개게시·결제·시크릿 접근·원본 삭제·지시 없는 서버 시작/재시작·빌드·감시·예약은 금지합니다.

현재 작업의 지시·진행·보고는 이 루트 docs/collaboration/ 안에서 운영합니다. 협업 진입점은 docs/collaboration/README.md, 진행 정본은 docs/collaboration/STATUS.md이며 append만 합니다. 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md입니다. 기존 상세 보고 docs/reports/20261116-project-workspaces.md는 보존합니다. 대표 본체가 공용 수신·STATUS·보고를 맡고 하위 AI는 배정된 범위만 수행합니다.

기본 /ui-studio/와 canvas.html은 전체 캔버스이고 ?editor=detail은 상세 편집입니다. 프로젝트 종류·이름·경로, 설계 이름·revision·미저장 표시와 workspace·project·screen·element 전달을 유지합니다. 컨트롤 7종·상태별 이미지, workspace 자원 파일, schemaVersion 4 응답형 배치·스크롤, 출처/조건/payload/스토리보드 연결 명세를 구현했습니다. v4는 logicalSize·safeArea·화면 직속 useSafeArea·2D rectTransform·고정 itemSize 가로/세로/그리드·DOM clip/scroll을 지원합니다. 1/2/3의 기존 의미와 구형 layout.direction은 보존하며 명시적인 새 배치 편집 때만 v4로 올립니다. 전체 Unity/Figma 호환·엔진 어댑터 자동 생성·게임 소스 쓰기는 제공하지 않습니다. JSON 단독 출력에는 자원 파일이 동봉되지 않으므로 선택 ui-studio의 설계·assets를 함께 전달합니다.

소스 검사·자동 시험·HTTP·실제 화면 검수를 분리하고 결과는 제안(검수 대기)로 남깁니다. 이번 계획 기능의 대표 본체 npm test는 302/302이며 _작업/codex/ux-studio/tool-capabilities-tests.log에 기록합니다. 위 220/220은 독립 전환 때의 과거 시험입니다. W/P/U/S 종합검수는 0/4입니다. 도구 단위 다음 제작은 모노폴리 GO 정식 UI이며 그래픽·전체 샘플·실제 게임 연결은 미완료입니다. 지원 밖 기능을 새 선행 조건으로 추가하지 않습니다. 읽은 원본·변경·시험 명령과 결과·캡처·백업·미확인·다음을 기록합니다. 과거 시험 수나 7007 접근권한 상태를 7018 검수 결과로 쓰지 않습니다. 자동 접근 거절을 다른 포트·호스트·표면으로 우회하지 않습니다.

## 이관 이력의 경계
과거 케이팝 공유 루트는 출처·종료 기록으로만 다룹니다. 중복 도구 101파일은 이 루트 docs/planning/_backup/20261116_단이/1012_kpop중복정리/에 이동 보존했습니다. 케이팝 src/tools/uxStudio/의 model.mjs·consumer.mjs 두 export 연결은 기존 소비자가 독립 정본을 읽는 단방향 참조이며 UI 스튜디오 실행 조건이 아닙니다. 다른 프로젝트의 원 기획·시뮬레이터·저장 데이터를 도구 작업 범위로 확대하지 않습니다.

## 최신 로비 제작/검수 보정 · 2026-11-16 · 공통 가이드 .11

위 .8/과거 시험 수는 당시 기록입니다. 현재 공통 정본은 src/tools/uxStudio/guide/index.json의2026-11-16.11이며 기존7종과 프로젝트 guide .4 사본은 보존합니다. TOOL_SPEC의 .11 현재 로비 제작 표준과 PROGRESS .11을 먼저 읽고 이전 본문을 최신 구현 상태로 되풀이하지 않습니다.

본체 actual은 ux-gjs-0d80d7fe r21·1페이지63부품·0연결입니다. 동일 역할 네 메뉴80×92/icon64²@(8,6)/Txt80×22@(0,70),font14·500·line18,compoundBadge28²@(52,0)·Img_Notification_BG/Txt_Notification_Count 별도 조립이 현재 범위입니다. name은 Btn/Img/Txt의 영역/역할을 읽을 수 있게 맞추고 stable ID/현재 parent/연결을 이름 변경 때문에 재발급하지 않습니다. 숫자/문구/name/flat runtime key·원본 관찰/제작값을 구분합니다. 알림 정본은 부모1개로 유지합니다.

전체 캔버스의 profile/custom W/H·방향·390×844 비례/4개 가이드 W80H92 actual 검수와 main 상세390의 root551 고정/넘침 발견 후 수정 중을 구분합니다. 모든 preview 통과를 주장하지 않습니다. 버튼 tint/image 엔진124 지원 시험과 실제 네 메뉴 이미지 자식 tint 확인도 구분하며 image-mode 샘플·GO actual은 미검수입니다. 본체 이번 통합411/411은 상세 보완 이전 결과이고 이후 재실행 예정입니다. 시험 수는 완성률이 아닙니다.

native 입력은 AX 현재 선택→값 변경→Tab/blur→재표시/저장값까지 확인합니다. checkbox 재렌더 후 현재 선택/새 필드/저장값을 다시 찾고 locator.fill 미반영을 바로 제품 버그로 단정하지 않습니다. 밝은 가이드 입력의 전역 dark 색 상속처럼 computed 색/배경/disabled를 분리해 원인을 확인하고 scoped 보완과 후속 실화면 검수를 나눕니다.

docs/plans/20261116-ai-for-ui-adoption.md의 적합한 제작/검토 방법만 선택 편입합니다. 자동 설치0·패키지 추가0이며 외부 스킬의 절차가 최신 직접 지시를 대신하지 않습니다. docs/plans/20261116-ten-screen-assembly.md의10원본/132계층/43연결 항목은 명세 수, 새도시 그림295148bytes 준비는 미등록이며 실제10화면 조립/게임 연결이 아닙니다. current-review의bare7018 actual r21 진입과7007/LSB native 앱 미검수도 구분합니다.

본체 전달 기준 시한2026-11-17(화)08:00 KST·주간73/90·기존 ui 30분 ACTIVE이며 하위는 새 예약/서버/공용 수신을 중복 시작하지 않습니다. W/P/U/S0/4·원본 폰트/Unity 전체·게임 기능/사용자 승인 미완료를 유지합니다. 사용자 특정 버전 명시 컨펌 후에만 방법·원본 hash·revision·실제 캡처를 승인 기록으로 고정합니다. 공용 STATUS/최종 보고는 본체만 담당합니다.

## .11 최신 마감 사실 보정 · r24 · 2026-11-16

앞선 .11의 상세390 버그 수정 중/재시험 예정·가이드 대비 후속 예정은 과거 단계입니다. 현재 최신 사실은 공통 guide/PROGRESS.md 맨 위 r24 마감 보정을 우선합니다. main.mjs 기기 비례 보완은 관련82/82·본체 새 전체416/416 실패0 후 실제390×844/430×932·확대/축소 왕복을 확인했습니다. authored551×984/r21 보기 변경 중 설계hash는 불변입니다. standalone preview는 entry uniform fit만 제공하고 기기 메뉴/높이 reflow는 없으며 전체/main 기기 보기와 구분합니다.

가이드 enabled input rgb(37,50,71)/label rgb(70,86,109) actual 확인과1900×1090 가독성 캡처를 보존했습니다. 세 배지 이미지 자식 이름을 Img_Notification_BG로 정리해 같은 문서 최종r24·63부품·0연결로 저장했고 r21 증거는 보존합니다. r24 재열기/최종 캡처는 본체 예정입니다. 도시1회/5랜드마크 sheet1회 생성·PNG 보존/production300000bytes 이하·alpha tight crop과 source fringe 한계를 기록했지만 UI 미등록입니다.10원본/132계층/43항목은 명세이며 실제10화면 조립이 아닙니다.

공통판 .11·프로젝트 .4·과거 본문을 보존합니다. 최종 주간74/90·시한11/17 08:00 KST·기존 ui 30분 ACTIVE는 본체 전달 상태이며 중복 예약/서버를 시작하지 않습니다. 7007/LSB native·원본 폰트·Unity 전체·게임 기능·사용자 승인 미완료와 W/P/U/S0/4를 유지합니다. 공용 STATUS/최종 보고는 본체가 담당합니다.
