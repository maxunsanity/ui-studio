# UI 스튜디오
상태: 제안(검수 대기). 독립 UI 설계 도구입니다. 모노폴리 GO는 검증용 샘플이며 아직 미완성입니다.

## 정본과 실행
정식 루트는 /Users/max/projest_max/ui-studio/입니다. 도구 소스·의존성·서버·가이드·기본 저장공간·보고를 이 폴더 안에서 관리합니다. 다른 프로젝트의 폴더나 실행 프로세스를 도구 실행 조건으로 사용하지 않습니다.

- 소스: src/tools/uxStudio/
- 내장 설명서·툴 기획·AI 규칙·제작 구조: src/tools/uxStudio/guide/README.md
- 지침: 상위 AGENTS.md → 이 루트 AGENTS.md → 선택한 게임의 ui-studio/AGENTS.md
- 정식 실행 주소: http://127.0.0.1:7018/ui-studio/
- 저장본 미리보기: /ui-studio/preview.html · GrapesJS 시험 편집기: /ui-studio/canvas.html
- 소스·공통 안내 공개 URL: /ui-studio/source/

이 루트에서 npm start로 자체 서버를 실행하고 npm test로 관련 시험을 실행합니다. 이미 검증한 Vite 5.4.21과 정확한 의존성 11패키지(18,560,529bytes)를 이 루트 node_modules에 복사했습니다. 원본·사본 검증 해시, 라이선스와 lock integrity는 _작업/codex/ux-studio/standalone-dependencies.json에 기록했습니다. package-lock.json의 의존성 58패키지에는 다른 플랫폼의 선택 패키지가 포함됩니다. 새 패키지·버전 선정은 없었고 scripts/start.mjs의 외부 설치 fallback을 제거했습니다.

자체 7018 기동·로컬 Vite·HTTP와 최종 자동 시험 220/220을 확인했습니다. 실제 브라우저에서 공통 가이드 7종·Esc 복귀, 네이티브 폴더 선택·독립 작업 선택, 설계 사본·저장·재열기·409 충돌과 수정 보존, 두 폴더 왕복 격리, 미리보기 이동·모달·포커스와 캔버스 W 단계 저장·24개 ID/부모 관계 재열기를 검수했습니다. 게임 전체 UI 완성이나 W/P/U/S 단계 통과를 뜻하지 않습니다. 상세 범위·화면 크기·캡처의 실제 픽셀은 PROGRESS.md와 docs/evidence/20261116-independence/browser-checks.json을 확인합니다. 지시 없는 추가 서버 시작·재시작·빌드는 하지 않습니다.

## 저장과 선택한 게임
폴더 선택 전 기존 설계는 이 루트의 _작업/codex/ux-studio/projects/에서 이어갑니다. 새 게임은 폴더 찾아 열기로 고르고 선택게임/ui-studio 안에 설계·자원·가이드를 저장합니다. 게임마다 도구 전체를 복제하지 않습니다.

주소의 /ui-studio/는 도구 입구이며 게임 폴더의 workspace ID나 개별 설계 projectId가 아닙니다. workspace ID와 document.projectId/revision을 함께 확인합니다. 기존 게임 변환은 반드시 먼저 질문합니다. 허용 시 전 화면 조사·백업·대응표·변환·연결·회귀를 수행하고, 거절 시 원 게임 소스는 건드리지 않고 선택게임/ui-studio 안에서 독립 작업합니다. conversionStatus=requested는 변환 완료가 아닙니다.

samples/monopoly-go/는 검증용 게임 UI 샘플입니다. 명시적으로 변환 안 함(independent)을 선택했고 ui-studio/designs/ux-902404d6.json의 r4가 현재 검수 설계입니다. 3페이지·1모달·24부품·6연결이며 기존 ux-gjs-61ad2d1f r14는 보존했습니다. samples/folder-check/는 저장·폴더 격리 시험 fixture이며 게임 샘플이 아닙니다. 원 Figma는 열람만 합니다. 대표 W/P/U/S 종합검수는 0/4입니다. 본게임 로직 작업은 병행할 수 있으나 툴 UI 전면 적용에는 그래픽·외부 자원 파일 계약·실제 컨트롤·safe area/anchor/layout·엔진 어댑터가 남습니다.

공통 내장 가이드 정본은 2026-11-16.5입니다. 이번 실제 생성·읽기를 확인한 두 프로젝트의 guide 사본과 project.json의 guideVersion은 2026-11-16.4로 보존합니다. 재열기 때 자동 갱신하지 않습니다.

## 협업과 보고
협업 진입점은 docs/collaboration/README.md이며 이 루트 AGENTS.md가 우선 정본입니다. 진행 기록은 docs/collaboration/STATUS.md에 append만 합니다. 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md에 모읍니다. 기존 상세 작업 보고 docs/reports/20261116-project-workspaces.md는 보존합니다. 현재 작업의 지시·진행·결과를 다른 프로젝트의 공유 폴더에서 운영하지 않습니다.

## 이관 이력과 출처
이전 한글 폴더는 이 정식 루트로 이동했습니다. 폴더 선택 중 생성한 설계 0개 중복 저장공간은 docs/planning/_backup/20261116_단이/0950_영문폴더정리/duplicate-workspace에 보존했습니다.

케이팝의 중복 도구 101파일은 이 루트 docs/planning/_backup/20261116_단이/1012_kpop중복정리/로 이동했으며 manifest.json에 경로·크기·SHA-256을 기록했습니다. 케이팝 src/tools/uxStudio/에는 기존 gameUiHost·Node 시험을 위한 model.mjs·consumer.mjs export 연결 두 개와 README만 남겼습니다. 이는 케이팝 소비자에서 독립 도구로 향하는 단방향 참조이며 도구 실행 조건이 아닙니다. 케이팝 기획서·시뮬레이터·공유 기록·옛 설계 데이터는 보존했습니다. 옛 공유 루트는 이관 출처와 종료 기록으로만 다룹니다. 7007에서 도구 mount·저장 플러그인·API 연결을 제거했습니다. 옛 도구 주소는 7018 이동 안내로 연결하고 옛 API는 HTTP 410으로 거부하여 오래된 창의 쓰기를 막습니다. 앱의 UI 스튜디오 바로가기는 이 정식 루트·자체 start·7018 URL로 저장했으며 다른 다섯 항목은 유지했습니다.

툴 기획·요구사항·Unity 비교·샘플 목록의 이관 시점 원문은 docs/reference/t04/에 보존했습니다. manifest.json이 출처와 해시를 기록합니다. 옛 상대링크·7007 공유 실행·기존 /docs/planning/ 진입은 당시 이력이며 현재 운영 안내는 아닙니다. 현재 공통 가이드 판은 2026-11-16.5이며 실제 생성한 프로젝트 사본 .4는 보존합니다. 과거 211/211 시험이나 Browser 7007 접근권한 거절은 7018의 기동·실제 화면 검수와 분리합니다. 권한 거절을 피하려는 목적으로 다른 주소를 사용하지 않습니다.
