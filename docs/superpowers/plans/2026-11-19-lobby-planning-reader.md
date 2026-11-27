# Lobby Planning Reader Implementation Plan
For agentic workers: use executing-plans inline.
Goal: 로비 작업 중 선택 화면·부품에 맞는 짧은 설명과 문서 뷰어 제공.
Architecture: planning-documents.json을 단일 읽기 데이터로, planning-panel.mjs는 workspace/project/screen/ancestor에 따라 절을 선택. 문서 뷰어도 같은 데이터를 읽는다.
Tech Stack: 기존 ES modules / HTML / node:test. 새 의존성 없음.
Spec: ../specs/2026-11-19-lobby-planning-reader.md
Constraints: 디자인JSON/타게임/원기획 무수정. 로비1차만 합의. 7018, 재시작 없음.
Review Focus: 타workspace 노출 방지/미등록 화면 숨김/부모상속/유효문서URL·escaping/비동기 선택변경.
- [ ] 선언형 연결표·선택/URL/escaping 검사 실패 확인 후 공통 패널 구현.
- [ ] 원문 사본·이미지 보존, 로비7영역/상태/검토질문을 읽기 뷰어로 작성.
- [ ] 상세/전체 캔버스/프로젝트 폴더의 기존 입구에 공통 패널 연결.
- [ ] 관련 검사·전체 npm test·HTTP 자원 확인. 실제 브라우저 접근 가능 범위 별도 보고.
