# UI Studio 계획 기능 설명서 .6 갱신
작성자 codex(단이) · 2026-11-16 12:42 KST · 제안(검수 대기)

부모 배정: 도구의 계획 기능 단위를 설명서에 반영하고 추가 선행 조건 없이 모노폴리 GO 정식 UI 제작으로 이어지도록 범위를 정리. 공용 STATUS·보고·실화면은 대표 본체 담당.

## 바꾼 문서
- README.md:19 — 전체 캔버스/상세 편집 진입·프로젝트 표시·이번 기능과 다음 제작. 기존 220 시험과 본체 최신 302 시험 구분.
- AGENTS.md:16 — 새 기능·v4/자원/전달 범위와 금지 경계. 기존 협업·동의·프로젝트 보존 규칙 유지.
- src/tools/uxStudio/guide/README.md:16,47 — 캔버스→선택 상세 편집 순서와 기능 범위.
- guide/USER_GUIDE.md:22,49,58,63,72 — 컨트롤 네이티브 조작, 상태별 이미지, 파일 자원, 안전 영역/앵커/고정 항목 배치/스크롤, 오버레이와 연결 명세 사용법.
- guide/AI_GUIDE.md:31,37 — 구형 설계 보존·v4 제한·자원·원문 출처/조건/payload/스토리보드·데이터/실행 구분.
- guide/TOOL_SPEC.md:30,38 — 모델/자원/오버레이/연결 명세 계약과 지원 밖 기능.
- guide/ARCHITECTURE.md:41 — 새 모듈 책임과 기본 캔버스/상세 편집·공통 좌표/입력/자원 연결.
- guide/PROGRESS.md:5 — 최신 .6 절 추가. 과거 .5 절 이하 본문은 그대로 보존하고 이력임을 표시. 부모의 302 시험과 r1 컨트롤/r2 앵커 실제 확인, 이미지·최종 viewport 확인의 본체 보고 연결.
- guide/EXISTING_GAME.md:2,58 — 헤더 판과 현재 공통판 .6만 변경. 동의·변환·독립 작업 규칙 본문 보존.
- guide/index.json:2 — 2026-11-16.5 → 2026-11-16.6. 7개 문서 헤더 판 동기화.

위 guide/ 상대경로의 실제 루트는 src/tools/uxStudio/guide/입니다. 변경 문서는 10개입니다. 기존 프로젝트 guide .4 사본·project.json metadata·샘플 설계·자원은 수정하지 않았습니다. workspace-store.mjs:195가 index.version을 사용하므로 별도 소스 버전 상수 변경은 필요 없습니다.

## 읽고 대조한 원본
루트 AGENTS.md·README.md, docs/collaboration/README.md, guide/ 7개 문서와 index, tools/ux-studio/mount.mjs:4,9 및 도구 HTML, main.mjs의 진입/자원/내보내기 연결, grapes-pilot.mjs의 프로젝트/선택/저장 연결을 읽었습니다. 다음 계약을 최신 소스와 대조했습니다.

- controls.mjs:3,36,113 및 control-inspector.mjs — 7종·값/검증·네이티브 입력.
- skins.mjs:16,49 — normal/highlighted/pressed/selected/disabled와 상태별 texture 참조.
- model.mjs:24,80 / responsive-layout.mjs:12 / responsive-inspector.mjs:56 — 버전 1~4, logicalSize/safeArea, 직속 useSafeArea, 2D 앵커, 고정 itemSize 자동 배치와 overflow.
- asset-reference.mjs:2 / asset-store.mjs:62 — 300000bytes·4096px·내용 해시·경로/내용 검사.
- overlay-runtime.mjs:58,93 — 화면 ID별 타이머·초점·Escape·queue/dedupe.
- handoff.mjs:20,67 — 출처/조건/payload/스토리보드와 구조 검사 한계.
- project-context.mjs:5,14 / workspace-store.mjs:195 — 프로젝트 표시/URL 범위와 가이드 판 생성.
- tests/ux-studio/workspace-store.test.mjs — 가이드 복사/재열기 보존 검증.

프로젝트 루트 graphify-out/graph.json은 없음을 확인했고 지정 소스만 직접 조회했습니다. 새 지도 생성·전체 스캔은 하지 않았습니다. 코드 추가/삭제/import 연결 변경은 이 하위 작업에 없습니다.

## 확인
- 실제 실행: node --test tests/ux-studio/workspace-store.test.mjs — 17/17 통과, 실패 0. 새 index .6 복사와 기존 파일 보존을 포함한 기존 회귀. 로그 capability-manual-workspace-tests.log.
- 문서 점검: index JSON 해석·7개 문서 존재/헤더 .6 일치·깨진 문자/NULL 없음·구형 현재 미완료/앵커 불허 안내 제거·과거 PROGRESS 본문 보존·EXISTING_GAME 규칙 불변 확인. 근거 capability-manual-validation.json.
- 변경 전후 전문 diff: capability-manual.diff. Git 명령·커밋 없음.
- 대표 본체의 npm test 302/302 로그 tool-capabilities-tests.log 마지막 요약을 직접 읽었습니다. 하위 작업이 전체 npm test를 재실행한 결과로 쓰지 않았고 17에 합산하지 않았습니다.
- 브라우저·화면·캡처 검수는 이 하위 작업에서 수행하지 않았습니다. docs/evidence/20261116-tool-capabilities/browser-checks.json 등 본체 증거를 기준으로 최신 결과를 판단합니다.

## 지원 경계·미확인·다음
실제 컨트롤과 schema4의 직속 안전 영역/축에 맞춘 2D 앵커/고정 크기 항목 배치/같은 DOM의 clip/scroll을 지원합니다. 구형 layout.direction은 새 배치로 활성화하지 않습니다. scrollbar 값과 overflow 스크롤은 별개입니다. 파일 자원은 선택 workspace 범위로 보존하고 JSON 단독 출력에 동봉되지 않습니다. 연결 명세는 작성 데이터/구조 검사이며 원본 대조·조건 실행·자원 존재·게임 검수 완료가 아닙니다.

전체 Unity/Figma 호환·게임 소스/저장파일 쓰기·엔진 어댑터 자동 생성·기존게임 자동 전체 변환을 완료로 주장하지 않습니다. 해당 기능을 새 선행 조건으로 추가하지 않습니다. 다음은 모노폴리 GO 정식 UI 제작이며 그래픽·전체 샘플·W/P/U/S 0/4 상태를 유지합니다.

보존 샘플 ux-902404d6 r4와 원본 ux-gjs-61ad2d1f r14, 프로젝트 .4 사본/metadata는 손대지 않았습니다. 서버·빌드·패키지·감시·예약·7007·다른 프로젝트·보호 파일 접근/수정 없음. 부모의 이번 실제 이미지·viewport 결과는 본체가 최종 보고합니다.

## 백업
/Users/max/projest_max/ui-studio/docs/planning/_backup/20261116_단이/1232_capability_manual/

백업 manifest는 capability-manual-backup.json입니다. 이 보고와 검증·시험 로그·diff는 모두 _작업/codex/ux-studio/ 안에 있습니다.
