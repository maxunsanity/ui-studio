# UI 스튜디오 제작 구조
가이드 판: 2026-11-16.4 · 제안(검수 대기)
독립 정본 보정: 2026-11-16

## 어떻게 만들었나요
독립 프로젝트 /Users/max/projest_max/ui-studio/에서 관리하는 ES 모듈 웹 도구입니다. 편집용 상태와 동작 시험용 상태를 분리하고 설계 JSON을 공통 형식으로 사용합니다. 소스 정본은 이 루트의 src/tools/uxStudio/이며 실행 의존성·서버·기본 저장·안내·보고도 이 루트에서 독립 관리합니다.

정식 진입은 http://127.0.0.1:7018/ui-studio/입니다. scripts/start.mjs가 이 루트 node_modules의 Vite 5.4.21과 정확한 의존성 묶음으로 자체 서버를 실행합니다. tools/ux-studio/mount.mjs와 save-plugin.mjs도 이 루트 파일입니다. mount는 /ui-studio/·preview.html·canvas.html과 /ui-studio/source/를 연결하고 save-plugin은 같은 루트의 저장·폴더 API를 제공합니다. 다른 프로젝트의 Vite 설정·실행 프로세스·설치 fallback은 운영 조건에 포함하지 않습니다. 소스·실행 프로세스·게임별 workspace는 각각 별도 경계입니다.

이미 검증한 Vite 5.4.21과 정확한 의존성 11패키지(18,560,529bytes)를 자기 node_modules로 복사했습니다. 원본·사본 검증 해시·라이선스·lock integrity는 _작업/codex/ux-studio/standalone-dependencies.json에 기록했고 package-lock.json에는 다른 플랫폼 선택 패키지를 포함한 58 의존성을 보존합니다. 새 패키지·버전 선정은 없었으며 외부 설치 fallback을 제거했습니다.

이번 기동 검증에서 7018 PID 7703의 CWD가 이 루트이고 Vite resolve가 이 루트 node_modules이며 열린 파일에 외부 이관 프로젝트 파일이 없는 것을 확인했습니다. /의 302 이동과 편집기·main JS HTTP 200, 자동 시험 215/215를 확인했습니다. Browser 접근성 트리 읽기로 r14와 3페이지·1모달 연결을 확인했으며 실제 클릭·새 workspace·전체 화면 검수는 진행 중입니다. 폴더 전환·프로젝트 가이드 사본 기능은 추가 구현·검수 중입니다.

이 구조 설명은 지시 없는 서버 시작·재시작·빌드 허가가 아닙니다. samples/monopoly-go/는 검증용 샘플입니다. 게임 엔진이나 3D 자원을 편집기에 불러오는 구조가 아닙니다. 별도 시험 경로의 GrapesJS와 기존 DOM/CSS 편집기를 구분합니다.

기존 편집 흐름:
  main.mjs → model/commands/layers/parts/skins → 편집 화면
  저장 요청 → save-plugin.mjs → 설계 JSON·백업·기준판
  저장 설계 → preview.mjs / consumer.mjs → 소비 화면

폴더 기능의 흐름:
  명시 폴더 선택 → 서버의 네이티브 선택기 → workspace 식별
  변환 여부 선택 → project.json 기록 → 해당 ui-studio 보관영역
  workspace + 문서 ID → 목록·저장·기준판·소비·재열기
  가이드 버튼 → manual.mjs → 공통 또는 프로젝트 문서 읽기

이 흐름은 저장·동의 경계를 설명합니다. 기존 게임 UI가 자동으로 변환되거나 실제 게임에 연결되는 단계는 포함하지 않습니다.

## 소스별 책임
- main.mjs: 편집 상태, 선택·명령·화면/패널, 저장·재열기와 UI 진입 동작.
- model.mjs: 설계 검증, 파일 가져오기 경계, 런타임 상태와 조건·행동 실행. 게임 저장의 writer가 아닙니다.
- layers.mjs / commands.mjs: 계층 조회, 검색, 선택 집합과 이동·복사·삭제·그룹 명령.
- editor.mjs: 편집 화면 조작 연결.
- parts.mjs: 복합 구성과 시각 역할, 입력 소유자, 분해, 래스터 가져오기·텍스트 검증.
- skins.mjs: 게임 UI 종류, 프레임 자원·상태·슬라이스 계약과 조립.
- units.mjs / bindings.mjs: 추가 유닛·표현·연출과 게임 기능/콘텐츠 슬롯 정의.
- history.mjs: undo/redo 스냅샷과 기록 예산. JS heap 전체 상한은 아닙니다.
- graph-view.mjs: 화면 관계도의 지연 로딩과 표시 수명 관리.
- workspace.mjs / layout-view.mjs / snap.mjs: 편집 패널의 도킹·분리·배치. 이 기존 workspace 모듈의 이름은 게임 폴더 저장공간 개념과 다릅니다.
- menu-state.mjs / menu-layout.mjs: 메뉴 열림, 표시와 자식 배열 계약.
- rect-transform.mjs: 앵커 초안의 계산·검증 보조. 공개 설계 형식의 앵커 편집·저장 허용을 뜻하지 않습니다.
- save-plugin.mjs: 서버 저장 API, 경로 검사, 원자적 저장·revision 충돌, 백업·기준판과 폴더 보관영역 연결.
- workspace-store.mjs: 네이티브 폴더 선택, workspace 등록·조회, 변환 선택 기록과 프로젝트 가이드·저장영역 검사.
- tools/ux-studio/mount.mjs: 자체 서버에서 /ui-studio/와 source/를 이 루트 정본 파일로 연결하는 서버 연결부. 게임 변환기는 아닙니다.
- scripts/start.mjs: 이 루트 node_modules로 자체 Vite 서버를 실행하는 진입점. 기본 저장 루트도 이 프로젝트 아래입니다.
- preview.mjs / consumer.mjs: 저장 설계 조회와 가벼운 소비 경로. 실제 게임 호스트 어댑터는 별도입니다.
- manual.mjs / guide/: 설명서 창과 공통 가이드 정본. 편집 상태를 읽거나 수정할 필요가 없는 읽기 경로입니다.
- grapes-pilot.mjs / grapes-bridge.mjs / grapes-drag.mjs: 별도 GrapesJS 시험 편집기, 원설계와의 변환·드래그 연결. 서버 설계 저장과 브라우저 단계 저장을 구분합니다.

위 목록은 책임 설명입니다. 새 폴더 연결의 최종 파일 분할과 동작 검증은 최신 소스와 이번 작업 보고를 확인하세요. 과거 코드지도가 이 구조를 모두 포함한다고 추정하지 않습니다.

## 데이터와 표시·입력의 분리
문서에는 projectId/revision/screens/transitions/fixtures가 있습니다. 화면의 elements에는 ID, 부모, 위치, 종류, 역할과 필요 시 component/interaction/image/skin/binding이 들어갑니다. 모든 요소의 ID는 문서 안에서 고유해야 하며 부모 순환은 금지됩니다.

구성 전체가 입력을 소유하고 자식은 부모로 전달하거나 표시만 할 수 있습니다. 편집 선택은 구성 전체를 고르거나 내부 부품을 고르는 동작입니다. 동작 시험은 inputOwner를 따라 실행 대상을 찾습니다. 그림이 겹친다는 사실과 입력 소유자가 같다는 사실을 혼동하지 않습니다.

프레임은 CSS border-image 기반 표현을 사용합니다. 슬라이스·화면 고정 폭·내용 여백은 서로 다른 값입니다. 이미지의 원본 영역과 화면상의 입력 영역도 별개입니다. 새로운 그림을 넣었다고 행동 정의가 새로 생기는 것은 아닙니다.

## 저장 경계
검증 → expectedRevision 비교 → 백업 → 원자적 기록 → 재읽기의 경계를 유지합니다. 미저장 편집본과 마지막 저장본은 다를 수 있습니다. 기준판 불러오기는 편집본 변경이며 자동 저장이 아닙니다.

폴더는 workspace ID, 문서는 기존 projectId, 저장은 revision으로 구분합니다. API 호출과 소비 URL에서 workspace를 이어 전달해야 합니다. 서버 전역 active 상태나 전역 최근 문서로 다른 폴더의 데이터를 섞지 않습니다. localStorage의 편집 패널 설정과 설계 파일도 다른 저장입니다.

GrapesJS 단계는 브라우저 localStorage의 문서ID·원 revision·W/P/U별 시험 저장입니다. 일반 서버 기준판과 서로 대체되지 않습니다. 사본 저장은 새 서버 문서를 만드는 경로입니다.

## 설명서 표시 경계
openManual({workspaceId})는 문서를 표시하는 HTML dialog를 엽니다. 공통 index/문서는 독립 정본에 연결되는 /ui-studio/source/guide/ URL에서 읽고, 프로젝트 문서는 workspace-guide API로 선택된 ui-studio/guide에서 읽습니다. 프로젝트 사본은 독자적으로 덮어쓰지 않습니다.

문서는 textContent와 줄바꿈 보존으로 표시합니다. Markdown 안 HTML, 링크 문자열이나 코드를 실행하지 않습니다. 비동기 읽기의 늦은 응답은 현재 선택 문서를 덮어쓰지 않아야 합니다. 오류가 나도 닫기·안내 선택·재시도가 남아야 합니다.

## 협업 기록과 이관 이력
root AGENTS.md가 우선 정본이고 docs/collaboration/README.md가 협업 진입점입니다. STATUS·이번 전환 보고는 이 루트 docs/collaboration/에서 운영하며 기존 상세 작업 보고는 docs/reports/에 보존합니다. 과거 다른 프로젝트의 서버·설치·공유 폴더와 연결했던 구조는 PROGRESS.md의 이력입니다. 그곳의 export 연결 두 개는 외부 소비자가 독립 도구를 읽는 단방향 참조이며 도구 실행 조건이 아닙니다.

## 아직 별도 책임인 것
대표 r14의 3개 page·1개 modal·24개 부품·6개 연결은 설계 저장본 기준이며 W/P/U/S 단계 종합검수 0/4와 별개입니다. 현재 UI·그래픽·전체 샘플은 미완료입니다. 실제 게임 전체 자동변환은 구현되어 있지 않습니다. API·실화면 검수의 통과 여부는 이번 작업 보고의 실제 결과로 확인합니다.

실제 게임 호스트, 데이터 공급, 게임 상태 저장·동기화, 엔진 자산 처리, 전체 게임 변환, 최종 그래픽과 기기별 완성도는 별도 구현·승인·검증이 필요합니다. DOM 구조가 비슷하다는 이유로 Unity/Godot나 기존 게임과 동등하다고 수치나 완성 판정을 붙이지 않습니다.
