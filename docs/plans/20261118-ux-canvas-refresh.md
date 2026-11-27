# UI 스튜디오 UX 개편 Implementation Plan

> For agentic workers: subagent-driven-development로 독립 후보를 작성하고 본체가 통합·실검수합니다. 같은 소스 동시 쓰기는 금지합니다.

**Goal:** 가벼운 전체 화면 관리, 일관된 단계 이동, 3가지 제작 표현을 공통 기능으로 제공합니다.
**Architecture:** overview는 기존 renderer와 저장 API를 재사용하는 경량 DOM/SVG shell. presentation은 공통 보기 모듈. 상세/가이드는 기존 편집 계약을 유지하며 동선과 표현을 연결합니다.
**Tech Stack:** 현재 JS ES modules/DOM/CSS/SVG·기존 Vite/API, 새 패키지0.
**Spec:** docs/plans/20261118-ux-canvas-refresh-design.md
**Global Constraints:** 샘플 JSON 외부수정0·scratch 후보→백업→공유source 통합→7018 검수·2차 HMR 조율·7007/서버 재시작0.
**Review Focus:** 잘못된 workspace/중복 query, 선택 화면 삭제/refresh, 창/전면 root 좌표, 유사ID/한글이름 클릭, 미저장 상세 보존, 전환 후 이미지/스타일 잔여.

## Task 1 · 3표현 공통 renderer
- [x] presentation 모듈/stylesheet 계약과 fixture 시험을 scratch에 작성·RED 확인
- [x] 기존 renderLayout/기하/알파/텍스트를 재사용해 구역선·단색 세부·본UI 구현, 원본 불변
- [x] 후보 시험·독립 검토, actual 한 화면 비교

## Task 2 · 경량 전체 캔버스
- [x] overview 모듈/HTML/CSS와 pure grid5·graph 배치/이동/선택 시험·RED
- [x] 좌 실제 화면목록/중앙보드전체선택/우 설명, 보이는 보드만 렌더
- [x] workspace/project 보기 설정·공통 진입·목록/보드선택·기본경로 유지
- [x] 후보검토·통합·실제 정렬5/연결자유이동·기본화면/폰 점검

## Task 3 · 상세·가이드·샘플 동선
- [x] 기존 header/도구 분포·레이어클릭 원인을 읽고 후보안·관련 RED
- [x] 단계/현재이름 통일·접는 보조메뉴·Undo/Redo 전면제거·3표현/anyscreenpreview 연결
- [x] 가이드 편집·저장/재열기·workspace/미저장차단 유지 검수

## Task 4 · 통합과 전달
- [x] 본체 안전 HMR 통합·기존 전체회귀·관련실화면/이미지·넘침 검수
- [x] 3표현 실제 샘플 캡처·가이드/보고/STATUS append·2차 사용법 전달
- [x] 구현과 미검수·시각 컨펌대기를 구분해 보고

## 실행 판단
Git 저장소가 아닌 현재 독립 배포 폴더이므로 git worktree/commit을 만들지 않습니다. 사용자 지정 경로와 기존 서버를 유지하며 scratch 후보·원본 백업·해시 비교로 변경을 격리합니다. 계획/규칙에 없는 게임값/새 기능은 추가하지 않습니다.

실행 완료: 공통 기능647회귀 및 실제 UI 근거는 본체 보고를 따릅니다. 기본 v1/v2 사용자 피드백 뒤 v3 대표 슬롯 필터로 보정했으며, 최종 시각 승인은 현중 검수 대기입니다.
