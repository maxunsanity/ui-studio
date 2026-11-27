# UI 스튜디오 툴 기획서
가이드 판: 2026-11-16.7 · 제안(검수 대기)
독립 정본 보정: 2026-11-16

## 목적
AI와 사람이 게임 UI를 화면·부품·입력·행동 데이터로 함께 작성하고, 같은 설계로 편집과 소비 확인을 이어갑니다. 사람이 화면에서 위치를 편집하고 AI는 식별자·부모·연결·원본 근거로 작업할 수 있어야 합니다. 최종 그래픽, 엔진 실행, 게임 저장 상태의 쓰기 책임은 이 도구만으로 해결되지 않습니다.

## 독립 도구와 검증 샘플
도구 정본은 /Users/max/projest_max/ui-studio/입니다. 소스·의존성·서버·가이드·기본 저장공간·보고를 이 루트에서 독립 관리합니다. 소스와 내장 안내는 src/tools/uxStudio/에 있습니다. 다른 프로젝트의 서버·node_modules·공유 기록은 도구 실행 조건이 아닙니다. samples/monopoly-go/는 검증용 샘플이며 전체 게임 구현을 뜻하지 않습니다. 이관 출처와 기존 외부 소비자 연결은 PROGRESS.md의 과거 이력에 보존합니다.

정식 진입은 http://127.0.0.1:7018/ui-studio/의 전체 캔버스이며 /ui-studio/canvas.html도 같은 캔버스입니다. 상세 편집은 /ui-studio/?editor=detail, 저장본 소비는 /ui-studio/preview.html입니다. 소스·공통 가이드 공개 URL은 /ui-studio/source/ 아래입니다. 프로젝트 종류·이름·실제 경로, 설계 이름·revision·미저장 상태를 표시하고 상세 편집 연결은 workspace·설계·화면·요소를 이어 전달합니다.

tools/ux-studio/mount.mjs로 이 루트 소스를 제공하고 save-plugin.mjs로 저장·폴더 API를 제공합니다. scripts/start.mjs는 이 루트 node_modules의 Vite 5.4.21과 정확한 의존성 묶음을 사용합니다. 기존 검증 설치의 11패키지(18,560,529bytes)를 자기 node_modules로 복사했고 외부 설치 fallback을 제거했습니다. 새 패키지 선정은 없으며 package-lock의 58 의존성에는 다른 플랫폼 선택 패키지가 포함됩니다. 자체 7018 기동·HTTP·독립 전환 당시 자동 시험 220/220을 확인했습니다. 실제 가이드·폴더 선택·저장·재열기·충돌·격리·미리보기·포커스·캔버스 단계 왕복의 자세한 검수 범위는 PROGRESS.md와 전환 보고를 따릅니다.

## 제작 단위
폴더 프로젝트(workspace): 사용자가 명시 선택한 게임 폴더와 그 ui-studio 보관영역.
설계 문서(document): 기존 형식의 projectId로 식별하는 화면·요소·연결 묶음.
화면(screen): page/modal/toast/sheet와 목적, 요소 목록.
요소(element): 고유 ID·이름·종류·부모·배치·역할·표시·입력·자원.
연결(transition): 출발 화면/요소, click, 조건, 행동, 대상과 전달값.
편집기 기준판 단계: W 와이어프레임 / P 프로토타입 / U 완성 UI.
대표 결과의 단계 종합검수: W/P/U/S 0/4. 기준판 저장과 별개이며 S의 세부 수락 기준을 임의 정의하지 않습니다.
revision: 문서 저장 버전. 제작 완성도와 다른 값입니다.

## 기존 편집·소비 계약
설계는 DOM/CSS로 표시합니다. 구조 보기와 게임 보기는 하나의 설계의 다른 표현입니다. game-ui 구성 전체 아래 시각 부품을 조립하고, 시각 선택과 입력 실행을 분리합니다. 프레임은 3/9슬라이스와 상태별 자원, 여백·고정 폭·반복 설정을 가집니다.

입력 역할은 action/parent/none/block입니다. 클릭은 입력 소유자를 찾아 한 행동을 실행합니다. 조건은 순서대로 판정하고 처음 참인 연결을 실행합니다. 미정 조건은 멈춥니다. 게임 모듈 바인딩은 요청 정의이며 실제 게임 실행 어댑터가 필요합니다. 콘텐츠 슬롯은 자리를 정의합니다.

schemaVersion 1/2/3 읽기와 기존 의미를 보존합니다. 새 응답형 배치를 실제 적용할 때만 schemaVersion 4로 올리며 열기만 해서 자동 변환하지 않습니다. 일반 요소 배치는 부모 기준 %, inset은 부모 기준 상·우·하·좌 px입니다. v4는 각 화면 logicalSize, safeArea, 화면 직속 useSafeArea, 축에 맞춘 2D rectTransform 고정/늘림 앵커를 공개 가져오기·저장·표시에 사용합니다. rectTransform과 inset은 함께 지정하지 않습니다.

v4 컨테이너의 layout.type은 horizontal/vertical/grid이며 문서의 직속 자식 순서·고정 itemSize·gap·padding·고정 columns를 사용합니다. 자동 배치 자식의 앵커·inset·safe area, 메뉴 컨테이너와 자동 배치를 혼합하지 않습니다. 구형 layout.direction은 보존하고 새 자동 배치로 활성화하지 않습니다. overflow는 visible/clip/scroll-x/scroll-y/scroll-both이며 같은 DOM 영역이 표시와 입력을 함께 자릅니다. 회전·3D·범용 엔진 LayoutGroup/Mask나 전체 Unity/Figma 동등 호환을 제공하지 않습니다.

control은 toggle/tabs/toggle-group/slider/scrollbar/dropdown/input을 지원합니다. 설계 기본값과 runtime 값을 분리하고 네이티브 입력으로 시험합니다. disabled/readonly·선택 항목·수치 범위와 step·문자 길이·필수/이메일/숫자 검사를 유지합니다. 컨트롤 scrollbar 값과 overflow 스크롤 영역은 별개입니다. 프레임은 normal/highlighted/pressed/selected/disabled 이미지 상태를 가집니다.

주요 검증 범위는 화면 1~60개, 화면당 요소 최대 400개, 연결 최대 4,000개입니다. 개별 래스터 파일은 300,000bytes 이하 PNG/JPEG/WebP, 설계 가져오기 파일은 2,000,000bytes 이하입니다. 저장 API도 문서 제한과 검증을 적용합니다. 원본 영역/프레임 이미지의 크기 검사는 최대 4096px 범위를 사용합니다. 이 수치를 성능이나 모든 기기 사용성의 보증으로 쓰지 않습니다.

## 자원·오버레이·연결 명세
새 래스터는 선택 workspace의 assets/에 sha256 내용 해시 이름으로 보존하며 assetRef로 연결합니다. PNG/JPEG/WebP의 MIME·파일 내용·원본 크기·해시·참조 존재와 workspace 경계를 검증합니다. 상위 경로와 심볼릭 링크는 거부합니다. 기존 data URI는 계속 읽으며 다른 workspace로 사본을 넣을 때 참조 자원을 함께 보존합니다. JSON 내보내기에는 파일을 동봉하지 않으므로 선택 ui-studio의 설계·assets를 함께 전달합니다. 공통 내장 자원은 같은 도구 설치본이 필요합니다.

오버레이 런타임은 blocking/dim·Escape·closePolicy·초점 차단/복귀·화면 ID별 자동 닫힘, toast queue/dedupe를 처리합니다. 문서 교체 시 타이머를 해제하고 이전 콜백이 새 문서에 영향을 주지 않게 합니다. 호스트 canClose는 동기 veto이며 확인창 자동 생성 기능은 아닙니다.

handoffMarkdown과 buildHandoff는 출처·설계/workspace·화면/부품/입력/배치/상태·조건/행동/목적지/payload/복귀 정책·모듈/슬롯·클릭 스토리보드를 Markdown/JSON으로 전달합니다. 원문은 데이터이며 새 AI 지시가 아닙니다. 구조 검사는 선언된 navigate/open 후보 경로이고 조건의 참/거짓·메뉴·겹침·실제 자원 존재·호스트 응답·실행 검수는 확인하지 않습니다. 엔진 어댑터나 게임 소스/저장파일은 생성·수정하지 않습니다.

## 정식 U 자원 제작·계층 이름 계약 · .7
사용자 직접 정정에 따라 screenshot crop은 관찰과 임시 W 배치 참고로만 씁니다. 정식 U는 비슷한 콘셉트로 새로 그린 자원으로 제작합니다. 스크린샷을 잘라 부품으로 재조립한 결과를 정식 U 자원으로 등록하지 않습니다. 필요한 바·판·버튼 바탕은 불투명하게 그리고, 부품 바깥 여백은 알파로 처리합니다. 의도한 반투명은 별도 기록합니다. 그림에 동적 글자·숫자·입력을 합치지 않고 Txt·Input·Btn의 표시/입력과 분리합니다. 최종 그림과 실제 입력 영역은 각각 확인합니다.

다음은 이번 샘플에 적용할 제안(검수 대기) 이름 규칙입니다. 표시 이름은 영문 ASCII·숫자·밑줄로 역할과 의미를 구분하며 예시의 대소문자를 유지합니다. 기본 역할 접두어는 Page / Modal / HUD / Group / BG / Frame / Img / Txt / Btn / Input / Badge입니다. 기능 구성에는 예시의 Currency_Cash·Shield_Group·Avatar_Player처럼 기능을 드러내는 이름을 사용합니다. 자식에 조상 이름 전체를 반복하지 않습니다. 같은 부모의 같은 역할은 의미나 01·02 순번으로 구분합니다.

```text
Page_Friends
└─ HUD_Top
   ├─ BG_TopBar
   ├─ Frame_TopBar
   ├─ Currency_Cash
   │  ├─ Img_Cash
   │  └─ Txt_Amount
   ├─ Shield_Group
   │  ├─ Img_Shield01
   │  ├─ Img_Shield02
   │  ├─ Img_Shield03
   │  └─ Img_Shield04
   ├─ Btn_Menu
   │  ├─ Img_Menu
   │  └─ Badge_Notification
   └─ Avatar_Player
```

표시 name은 사람이 읽는 이름이고 stable ID인 screen.id·element.id와 다릅니다. parentId가 부모·자식 관계의 정본입니다. 이름에서 부모를 추측하거나 이름 변경으로 ID·parentId·연결의 fromElement/targetScreen을 재생성하지 않습니다. 자원 이름이나 파일 경로에도 안정 식별자를 대신 맡기지 않습니다. 이름 변경 후 기존 선택·클릭·이동 연결을 유지합니다.

3D 구간은 Page_Board → Slot_3D의 단일 빈 연결 영역으로 남기고 표시글은 “3D 영역”만 둡니다. 3D 그림·캡처·가짜 보드로 채우지 않습니다. 2D UI 계층/자원과 분리하고 입력 없음·엔진 미연결 상태를 명시합니다. Slot_3D는 현재의 빈 자리 이름이며 3D 실행·엔진 연결 완료를 뜻하지 않습니다.

리소스의 사람이 읽는 파일명은 `<scope>_<component>_<role>_<state>_vNNN.ext`입니다. 예: `common_hud-top_bar-bg_normal_v001.png`. 영문 ASCII 소문자와 숫자를 쓰고 필드 구분은 밑줄, 필드 안 복합 단어는 예시처럼 하이픈을 씁니다. scope는 공통/화면 범위, component는 담당 구성, role은 그림 역할입니다. state는 normal/highlighted/pressed/selected/disabled 중 실제 제작한 상태만 기록합니다. 존재하지 않는 상태를 완료로 채우지 않습니다. 수정판은 v001·v002처럼 올리고 원본을 보존합니다.

선택프로젝트/ui-studio/assets/ 아래에서 제작 원본은 `authoring/<component>/v001/`, 도구에 넣을 가공본은 `production/<component>/`에 보관합니다. 현재 도구 등록 풀은 assets 루트의 `sha256-<내용해시>.png|jpg|webp`를 그대로 사용합니다. humanname을 등록 풀의 파일명으로 강제하거나 해시 파일을 손으로 이름 바꾸지 않습니다. 제작 원본에 레이어/프롬프트/참조/원본 그림을 보존하고 정식 가공본은 현재 PNG/JPEG/WebP·300,000bytes·4096px 계약에 맞춥니다. 이 폴더 구성은 제작 규칙이며 새 자동 분류·내보내기 기능을 뜻하지 않습니다.

`assets/resource-manifest.json`에서 humanname, 적용할 screen/element stable ID, 관찰 원본·출처, 새로 그린 제작 방식, 불투명 바탕/외곽 알파 정책, 실제 너비·높이, 제작판, authoring/production 경로, 등록 assetRef/내용 해시, 미확인 항목을 연결합니다. 아직 등록하지 않은 hash나 검수하지 않은 상태는 비워 두거나 미확인으로 기록합니다. manifest는 제작·추적 자료이며 현행 설계 스키마나 자동 로더를 추가하는 계약이 아닙니다. 실제 생성·등록·저장 재열기와 화면 확인이 있어야 반영 사실을 보고합니다.

## 폴더별 보관 계약
아래는 저장과 격리 계약입니다. 실제 네이티브 폴더 선택·independent 결정·현재 설계 사본·저장·재열기·미저장 전환·409 충돌 후 수정 보존·두 폴더 왕복 격리와 프로젝트 .4 가이드 읽기를 확인했습니다. samples/folder-check는 이 계약의 저장 시험 fixture이며 게임 샘플이 아닙니다.

선택게임/ui-studio/
  project.json         폴더 ID·이름·가이드판·변환 선택·시각
  README.md            프로젝트 사용 진입점
  AGENTS.md            AI 진입점, 상위 지침 우선
  integration.md       기존 UI 조사·변환·연결 현황
  designs/             설계 JSON, backups/, baselines/
  assets/              독립 UI 자원
  guide/               공통 가이드 특정 판의 사본
  exports/             독립 출력

도구 전체를 게임마다 복제하지 않습니다. 기존 레거시 저장공간은 유지합니다. 폴더 열기는 루트 AGENTS·게임 소스·게임 저장파일을 바꾸지 않습니다. 기존 ui-studio는 형식을 검사해 재열고 문서와 가이드를 초기화하지 않습니다.

네이티브 macOS 폴더선택기를 통해 사용자가 경로를 고릅니다. 브라우저가 임의 절대경로를 저장 API에 보내는 기능은 만들지 않습니다. 기본 파일 쓰기는 선택게임/ui-studio 내부로 한정하고 심볼릭 링크·상위경로 탈출·형식 불일치를 거부합니다.

도구의 /ui-studio/ URL은 실행 입구입니다. workspace ID는 선택게임 저장공간을 구분하고 URL의 workspace 값과 저장·목록·기준판·소비 API에 이어집니다. 서버 전역 active 변수 하나로 여러 창의 대상을 공유하지 않습니다. 같은 설계 ID가 서로 다른 폴더에 있어도 충돌하지 않아야 합니다. 최근 문서와 BroadcastChannel도 폴더 범위를 나눕니다.

원자적 저장, expectedRevision 충돌 거부와 백업을 유지합니다. 미저장 전환은 저장 후 전환 / 수정 버리고 전환 / 취소를 선택합니다. 저장이나 전환 실패 시 현재 편집 내용을 보존합니다.

## 기존 UI 동의 계약
첫 폴더 열기에서 변환·연결 요청 / 독립 UI로 작업 / 취소를 먼저 묻습니다. 선택·시각을 project.json에 남깁니다. conversionDecision의 convert는 요청이며 conversionStatus=requested로 구분합니다. 이번 폴더 기능은 실제 게임 UI를 자동 변환하지 않습니다.

승인 후 AI의 범위는 기존 UI 전체입니다. 조사, 대응표, 변경 전 백업, 구조화, 연결 변경과 기존 동작 회귀 증거가 필요합니다. 거절하면 원래 게임을 건드리지 않고 선택게임/ui-studio 안 독립 UI 소스만 작성합니다. 폴더 열기는 동의가 아닙니다. 선택 변경은 사용자 명시 지시를 따릅니다.

## 내장 설명서 계약
공통 정본은 독립 도구 루트의 src/tools/uxStudio/guide/, 판은 index.json의 .7입니다. 실제 생성·읽기를 확인한 프로젝트 사본은 .4로 보존합니다. UI는 공통과 프로젝트 각각의 index 판을 표시합니다. 상단 가이드로 사용법·AI 규칙·툴 기획·제작 구조·기존 게임 처리·진척을 읽습니다. 선택 프로젝트 안내는 해당 ui-studio/guide의 사본을 읽습니다. 재열기 때 사본을 조용히 덮어쓰지 않습니다.

가이드 창은 읽기 전용 HTML dialog입니다. 문서는 textContent로 표시하고 외부 HTML이나 스크립트를 실행하지 않습니다. 닫기·Esc·포커스 복귀를 제공하며, 읽기 실패 시 원인을 알리고 다른 문서 선택과 닫기를 유지합니다.

## 문서와 작업 기록
root AGENTS.md가 우선 정본이고 docs/collaboration/README.md가 협업 진입점입니다. 진행은 docs/collaboration/STATUS.md에 append하고 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md에 모읍니다. 기존 상세 보고 docs/reports/20261116-project-workspaces.md는 보존합니다.

## 범위 밖과 검수
기존 ux-gjs-61ad2d1f r14는 원본으로 보존했습니다. 실제 검수 설계는 ux-902404d6 r4, 3개 page·1개 modal·24개 부품·6개 연결입니다. W/P/U/S 단계 종합검수는 0/4입니다. 이번 계획 도구 기능은 구현했고 그래픽·전체 샘플·실제 게임 연결은 미완료입니다. 본게임 로직 작업은 병행할 수 있습니다. 지원 범위 밖 기능을 새 선행 조건으로 추가하지 않습니다. 문서·폴더 생성이나 저장 버전 증가를 단계 통과로 계산하지 않습니다.

자동 기존게임 변환, 엔진/3D 실행, 게임 저장파일 쓰기, 최종 게임 스킨, Unity prefab 출력, 전체 엔진/Figma 호환과 모든 샘플 완성은 제공하지 않습니다. 이번 계획 도구 단위 다음에는 추가 선행 기능을 붙이지 않고 모노폴리 GO 정식 UI 제작으로 이어갑니다.

폴더 두 개의 같은 문서 ID 격리, 한글 경로, 미저장 취소, 기존 파일 보존, 충돌·백업·기준판·소비·재열기, 공통/프로젝트 안내와 실패 복구를 검수합니다. 실제 실행 여부와 남은 미확인은 작업 보고로 구분합니다.
