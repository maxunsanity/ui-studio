# UI 스튜디오
상태: 제안(검수 대기). 독립 UI 설계 도구입니다. 모노폴리 GO는 검증용 샘플이며 아직 미완성입니다.

- 소스 정본: 이 폴더의 src/tools/uxStudio/
- 사용 설명서·툴 기획·AI 규칙·구조·미완료: src/tools/uxStudio/guide/README.md부터 읽습니다.
- 상위 AGENTS.md → 이 폴더 AGENTS.md → 해당 샘플 ui-studio/AGENTS.md 순으로 프로젝트 지침을 확인합니다.
- 정식 실행 주소: http://127.0.0.1:7007/ui-studio/ . 저장본 미리보기는 /ui-studio/preview.html, GrapesJS 시험 편집기는 /ui-studio/canvas.html입니다. 소스·공통 안내의 공개 URL은 /ui-studio/source/ 아래입니다.
- 7007 실행 프로세스는 케이팝 Vite와 공유하며, 독립 루트의 얇은 mount가 이 폴더의 실제 소스·API를 연결합니다. 소스 정본의 독립과 서버 프로세스의 독립을 구분합니다. 케이팝은 기획서와 시뮬레이터 프로젝트입니다.
- 케이팝의 중복 도구 소스·tools·관련 시험·도구 HTML 두 개, 총 101파일은 이 독립 루트의 docs/planning/_backup/20261116_단이/1012_kpop중복정리/로 이동 보존했습니다. manifest.json에 경로·크기·SHA-256을 기록했습니다. 케이팝 src/tools/uxStudio/에는 기존 gameUiHost 연결과 Node 시험을 유지하는 model.mjs·consumer.mjs의 export 연결 두 개와 README만 남깁니다. 이 두 파일에 도구 구현은 없습니다. 기획서·시뮬레이터·공유 기록과 옛 설계 저장 데이터는 보존합니다. 도구 구현은 독립 정본에서만 수정합니다.
- 폴더 선택 전 기존 설계는 이 루트의 _작업/codex/ux-studio/projects에서 이어갑니다. 새 게임은 폴더 찾아 열기로 고르고 선택게임/ui-studio에 저장합니다. URL의 /ui-studio/는 도구 진입 주소이며 게임 폴더의 workspace ID나 개별 설계 projectId가 아닙니다. 케이팝에 남는 옛 저장 데이터는 새 저장 정본과 혼용하지 않습니다.
- samples/monopoly-go는 모노폴리 GO 샘플 프로젝트 위치입니다. 원 Figma는 열람만 합니다. 화면 전체 캡처 한 장을 재현 완료로 취급하지 않습니다.

## 실행과 시험
정식 진입은 http://127.0.0.1:7007/ui-studio/ 입니다. 7007 프로세스를 새로 띄우거나 빌드하지 마세요. 기존 /docs/planning/ux-studio.html 등 도구 HTML 주소는 새 주소로 보내는 호환 진입으로만 사용합니다.
별도 실행이 필요하고 7018이 비어 있을 때만 npm start. 이 Mac에서는 기존 케이팝의 Vite 5.4.21 설치를 재사용하며 새 패키지 설치는 하지 않았습니다. 다른 환경에서는 package.json의 고정 버전을 설치해야 합니다.
독립 폴더에서 npm test로 관련 시험을 실행합니다. 실제 화면·키보드·저장·재열기 검수는 자동시험과 별도로 기록합니다.

## 기존 게임 UI
먼저 변환 여부를 질문합니다. 허용이면 전 화면 조사·백업·대응표·변환·연결·회귀를 수행하고, 거절이면 원 게임 소스는 건드리지 않고 선택게임/ui-studio 안에 독립 UI 소스를 저장합니다. conversionStatus=requested는 변환 완료가 아닙니다.

## 정식 폴더 · 2026-11-16 정리
정식 경로는 /Users/max/projest_max/ui-studio 입니다. 이전 한글 UI스튜디오 폴더를 이 이름으로 옮겼습니다. 폴더 선택 과정에서 생성한 영문 중복 저장공간은 docs/planning/_backup/20261116_단이/0950_영문폴더정리/duplicate-workspace 에 원본 그대로 보존했습니다. 설계 파일이 없는 것을 확인한 뒤 이동했고 삭제하지 않았습니다.

## 원문 기획 보존
툴 기획·요구사항·Unity 비교·샘플 목록의 이관 시점 원문은 docs/reference/t04/에 보존했습니다. manifest.json이 출처와 해시를 기록합니다. 원문 속 옛 상대링크는 과거 경로이며, 현재 사용 설명서 정본은 src/tools/uxStudio/guide/입니다.

2026-11-16.3 주소 정리: / 또는 /index.html의 안내 목적지는 /ui-studio/입니다. 옛 /docs/planning/ 도구 주소는 호환 경로이며 새 주소를 사용합니다. 211/211 시험과 기본 주소 HTTP 확인은 직전 10:05 작업의 근거입니다. 새 주소의 실제 화면은 이번 문서 수정 중 미검수이며, Browser의 7007 접근권한 거절은 별개의 미해결 항목입니다. 주소 정리로 그 권한이 복구되었다고 말하지 않습니다.
