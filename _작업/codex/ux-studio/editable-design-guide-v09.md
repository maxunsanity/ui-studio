# 직접 편집 디자인 가이드 .9 문서 보정

작성자 codex(단이) · 2026-11-16 KST · 제안(검수 대기)

본체가 전달한 최신 사용자 요구의 문서 보존 작업입니다. 아래 내용은 전달 요건의 요약이며 사용자 원문 직접 인용이 아닙니다. 직접 편집 구현과 실제 브라우저 검수는 본체에서 진행 중이고 이번 문서 작업으로 완료·통과·승인을 주장하지 않습니다.

보존한 요구는 실제 부품의 선·위치/크기 편집과 같은 screen/element ID·parentId·연결 유지, 실제 설계·undo/redo·dirty·저장 반영, 이미지 연결/해제와 원파일·부품 보존, 선택 중심·외곽 치수·하위 선 on/off, 계층 행 전체 선택과 독립 펼침, 레이어·중앙 캔버스·속성 세 영역의 두 경계 폭 조절입니다. 문서 설명서(openManual)의 읽기 전용 표시와 부품 디자인 가이드의 직접 편집을 구분했습니다.

551×984px 관찰 자료의 상위 25개/전체 67개 측정 박스, 원본 px·중심·W/H 비율과 ±1~2px 한계를 연결했습니다. 실제 원본 font-family/size/weight/line-height는 미확인입니다. .8의 전체 화면 3D/별도 2D overlay·SNS 사진 슬롯·특정 버전 명시 컨펌 이후 승인 순간/제작 방법 기록과 프로젝트 .4 사본 보존은 유지했습니다.

수정한 정본 문서는 다음 9개입니다.

- `README.md`: 현재판 .9와 요구/검수 상태 안내
- `src/tools/uxStudio/guide/README.md`: .9 개요, 7종 기존 안내 유지
- `src/tools/uxStudio/guide/USER_GUIDE.md`: 실제 부품 직접 편집의 사용 순서
- `src/tools/uxStudio/guide/AI_GUIDE.md`: 보존·편집·검수 규칙
- `src/tools/uxStudio/guide/TOOL_SPEC.md`: 직접 편집/이미지/선·계층·패널 계약과 수락 기준
- `src/tools/uxStudio/guide/ARCHITECTURE.md`: 같은 ID의 실제 편집 상태 연결 원리
- `src/tools/uxStudio/guide/PROGRESS.md`: .9 현재 상태, .8은 직전 상태로 보존
- `src/tools/uxStudio/guide/EXISTING_GAME.md`: 현재판 표기만 .9로 정합
- `src/tools/uxStudio/guide/index.json`: version .9, sections 7종 동일

백업: `docs/planning/_backup/20261116_단이/1345_editable_design_guide_v09/`. 파일 목록/시각은 같은 자기 작업 폴더의 `editable-design-guide-v09-manifest.json`에 기록했습니다.

읽은 원본은 루트 AGENTS.md·README.md, 기존 guide 7종/index.json의 관련 절, docs/collaboration/README.md와 독립 측정 JSON/notes.md입니다. 관찰 근거는 `_작업/codex/ux-studio/20261116-board-measurements/independent-measurements.json`과 `notes.md`입니다.

문서 검증은 통과했습니다. 9개 수정 전 백업·현재판 .9·7종 목록 불변, 선언한 판/현재참조/설명서 문구 보정 외 .8 본문 보존, 5개 요구 상세 절의 내용 정합성을 확인했습니다. 제품 자동 시험과 실제 브라우저 검수는 이번 문서 단위에서 수행하지 않았습니다.

이번 하위 작업은 제품 코드·설계 JSON·원자원·측정 JSON·프로젝트 .4 사본/metadata·공용 STATUS/보고를 수정하지 않았고 승인 스냅샷을 만들지 않았습니다. 루트 AGENTS.md의 과거 공통판 .7 표현은 배정 범위 밖이므로 수정하지 않고 본체에 알렸습니다.
