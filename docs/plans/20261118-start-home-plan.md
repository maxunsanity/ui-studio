# 시작 홈과 작업·샘플 분리 Implementation Plan

> For agentic workers: subagent-driven-development와 TDD를 사용하며 후보를 격리하고 root가 통합합니다.

**Goal:** 첫 접속에서 내작업·참고샘플·가이드를 구분하여 실제 제작으로 연결합니다.
**Architecture:** 기존7018 mount는 그대로, current-review 런타임 설정을 끄고 entry.mjs가 bare홈/명시캔버스를 분기합니다. 프로젝트 폴더/사본/guide 모달을 재사용합니다.
**Tech Stack:** 기존 ESM JavaScript·CSS·Vite·Node test. 신규 패키지 없음.
**Spec:** docs/plans/20261118-start-home-design.md

## Global Constraints
- 샘플 JSON 직접수정/주입, 원게임 변경, 서버 재시작/빌드,7007 재검수 금지.
- root 공용보고, 2차 Royal Match/LSB 설정 보존, HMR 저장안전 조율.
- 정본 samples 직속 게임 폴더=샘플, 사용자 작업폴더=내작업; fixture/중첩 숨김·원본 보존.

## Review Focus
- 새 샘플 등록, 내작업 빈목록/설계0/읽기실패/불가폴더를 명확히 표시한다.
- 명시 workspace/project/detail 링크가 홈으로 바뀌거나 다른 설계를 열지 않는다.
- 사본 대상이 샘플/시험/원본이면 쓰지 않고 실패시 원본을 보존한다.
- 폴더선택 취소/변환선택/미저장 이탈 보호 계약을 유지한다.
- 긴 프로젝트명/경로와430폭에서 줄바꿈·키보드·가이드닫기 복귀를 보장한다.

### Task 1: 데이터·분류·사본 계약 (root)
Files: workspace-kind.mjs/home-data.mjs, project-context.mjs/project-manager.mjs, tests/ux-studio/home-data.test.mjs
- [x] 분류/빈목록/개별오류/새등록/안전사본 RED 시험을 먼저 실행한다.
- [x] 순수 분류·목록읽기·상세/캔버스URL·기존자원사본 API를 구현한다.
- [x] 관리자의 workOnly/copyOnly 선택을 연결하고 GREEN 확인한다.

### Task 2: 홈 UI·진입 연결 (home_ui 후보+root)
Files: home.mjs/home.css/entry.mjs/grapes-pilot.html/current-review.json
- [x] root source계약시험을 RED 실행한다.
- [x] 내작업/샘플 별도 영역과 제작/샘플/guide, 새등록 읽기를 구현한다.
- [x] root가 명시경로 유지·home 브랜드링크를 통합한다.

### Task 3: 가이드·검수·인계 (home_guide 후보+root+독립리뷰)
Files: guide/START_PROJECT_GUIDE.md/index.json 및 연결6문서, 보고/STATUS
- [x] common .35 새작업 순서와 AI 작업 규칙을 가이드 메뉴에 연결한다.
- [x] 관련회귀→전체 npm test,1440/430 실제홈/샘플/가이드/돌아가기·원본해시 확인한다.
- [x] 독립리뷰와 보완 후 캡처/보고/2차 인계로 마감한다. Git repo가 아니므로 commit 대신 원본백업·SHA를 기록한다.

실제폴더선택·파일사본저장은미실시, API/VM회귀로검증. 마감보고참조.
