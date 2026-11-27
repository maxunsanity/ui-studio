# UI 스튜디오 내장 안내

## 최신 .24 · 배후 UI 숨김 / 감옥·보석금 r289

독립 정본의 native 공통 연출은 '배후 화면에서 숨길 레이어'에서 기준 페이지의 화면직속 레이어를 선택합니다. '공통 설정에 적용'은 설계 변경이며 파일 저장은 별도입니다. 동작 연결이 없는 모달도 설정만 저장할 수 있어 임시 버튼/임시 edge를 만들 필요가 없습니다. 선택/연출 draft와 저장을 구분합니다.

presentation.hideBaseElements는 stable ID 배열(중복 없음/최대400)입니다. 활성 모달들의 합집합만 배후 페이지에 visibility:hidden으로 적용하며 DOM·컨트롤·스크롤은 보존합니다. 닫히면 남은 모달의 숨김만 유지하고 전부 닫히면 복원합니다. 다른 기준 페이지에 없는 ID는 효과가 없습니다. Main/특정 게임 이름을 엔진에 하드코딩하지 않습니다. Grapes 단독 모달 보드는 배후 페이지가 없으므로 이 옵션을 표현하지 않고 저장 계약을 보존합니다.

이번 실제 r289는12화면936부품20연결. 감옥18/보석금16의6화면직속 앵커를 고정하고,14개 기존 Main HUD/이벤트 루트만 선택했으며 Slot_3D는 유지했습니다. 상세 동작 시험 기기390×844/430×932의6루트 크기·높이·닫기 복원/이미지 오류를 확인합니다. 독립 runtime의 새 감옥 입구/게임 판정·횟수 감소·보석금 연결·원본 동등은 미완료입니다.

복사·붙여넣기는 선택 번들 최상위를 현재 좌표의 legacy %로 평탄화하고2% 오프셋을 줍니다(commands.mjs). 따라서 고정 앵커가 보존됐다고 가정하면 안 됩니다. 보석금 r286은 이 때문에 세로가 늘어났고, native6앵커 재입력 후r289에서 고쳤습니다. 내부 자식/부모/TargetGraphic 재매핑 보존과 최상위 반응형 계약을 별도 확인하세요. 가로폭만 맞아도 높이·모서리·하단 위치가 맞는 것은 아닙니다.

이번 기능 RED→관련29/29→새 전체509/509 통과. 기존 VM의 새 의존 주입/문서 immutable 교체 후 오래된 객체 참조, 새 fixture logicalSize 누락을 수정한 실패 기록도 보존했습니다. 자동시험은 시각 완성률이 아닙니다. 원본10화면/20연결 deep equality, 다른 프로젝트 guide.4·2차 설계/자원 무수정입니다.

현중이 추가로 버튼/그림자 정확성을 요청했습니다. 실제3초 마우스 누름에서 normal→hover→pressed 및 tint1→.949→.741을 확인했지만 앞면/글자 이동·상태별 그림자는 아직 없습니다. 감옥 버튼 부모와 이미지의 이중 그림자도 확인했습니다. 고정 입력 wrapper/림 + 앞면 그룹(이미지/글자/비용 동반 이동)의 선택적 계약을 2차 세션과 공유했으며 연구/구현/실검수 전 지원 완료라 쓰지 않습니다.

7018만 진행/7007 제외, 원본과 과거판 보존, 자동화ui PAUSED/수동 작업, W/P/U/S0/4·원본 최종 동등승인0/10·제안(검수 대기).

가이드 판: 2026-11-17.23

**현재 .23:** [모노폴리 GO 영상 UI 목록](MONOPOLY_VIDEO_INVENTORY.md)과 [실제 HTML 문서](/ui-studio/source/guide/reference/monopoly-go-video-20261117/index.html)를 추가했습니다. 기존 r277/10화면902부품20연결은 보존하며, 신규 영상 UI는 관찰/제작 대기입니다. 공통 UI 규칙 .22 및 2차 영상 절차는 유지합니다.

**현재 .22:** [공통 UI 규칙](COMMON_UI_RULES.md) · [프로젝트 토큰](COMMON_UI_TOKENS.json)을 먼저 읽습니다. 원칙은 사용자 승인, 수치·시안은 본체 제작 제안·검수 대기입니다. 같은 family의 공통 프로필을 우선하며 영상 안내·이전 본문·프로젝트 .4는 보존합니다.


## 최신 제작·검수 진입 · .21 · r248

현재 모노폴리 GO 검수 설계는 `ux-gjs-0d80d7fe` r248, 10화면·899부품·20연결입니다. [진척·미완료 최신절](PROGRESS.md)과 [사용 설명서의 Racing/Tycoon 기록](USER_GUIDE.md), [AI 편집·저장 규칙](AI_GUIDE.md)을 먼저 읽습니다. 아래 .19/r170의 승인대기·09/10 조립0 문구는 과거 기록이며 현재 상태를 대신하지 않습니다. Shop 복제 바탕 제거·단일 자체 딤, Racing/Tycoon native 부품 조립/메인 시연입구/닫기, 타이머·수량 한줄 규격, 이미지 상단 아치64px와 실제 Undo·전체캔버스 표시까지 확인했습니다. r248 정적360/360, HTTP23/23은 자원 변경 전 r247 확인, 제품 소스 최종502/502를 구분합니다.

최신 현중 선택은 **7018 작업만 진행**입니다. 이번 7007 반영·목록·실화면 검수는 제외합니다. 기존 ui자동화 PAUSED, 수동 승인·90제한 명시 해제·새 마감 없음·보호범위 유지입니다. 조립10화면을 최종 동등성/게임 구현 완료로 세지 않으며 W/P/U/S0/4·원본10장 최종동등0/10·제안(검수 대기)를 유지합니다. 원본 폰트·미관찰 목적지·실제 게임/결제/순위 API와 Menu→Showroom→Back의 메뉴/포커스 복원은 미완료입니다.

실제 보고: [Tycoon10·종합](../../../../docs/collaboration/reports/20261117_0953_tycoon10_native.md) · [현재폰551×984](../../../../docs/evidence/20261117-tycoon10/tycoon-r247-phone-css-crop.png). 영상에서 별도 샘플을 만드는 절차는 아래 2차의 영상 가이드 진입과 신규 VIDEO_UI_WORKFLOW.md를 보존해 함께 제공합니다.


**영상에서 샘플 UI를 만드는 경우:** [영상 분석·UI 제작 절차](VIDEO_UI_WORKFLOW.md)를 먼저 읽습니다. 다른 AI가 원본 보존 → 전체 구간 분석 → 캡처/화면·연결 목록 → 모든 그림 새 제작 → 별도 workspace에서 로비부터 native 조립 → 실제 미리보기 검수를 재현하는 실행 가이드입니다. 게임 장면은 새 스틸 이미지이며 캡처를 잘라 붙이지 않습니다. 이번 사용자 명시 요청으로 공통 문서 1종을 추가했고 기존 7종과 프로젝트 가이드 사본은 보존합니다.

**현재 .19:** 문서끝Shop08 r170파일기준추가절을먼저읽습니다. 저장진척/파일준비와7018승인대기·실화면미검수를구분하며이전본문/프로젝트guide.4를보존합니다.

**현재 .18:** 문서 끝의 “Warehouse07 조립 기록 · .18 · r146 중간 기준”과 [제작값](TOOL_SPEC.md#warehouse07-조립-기록--18--r146-중간-기준)·[남은검수](PROGRESS.md#warehouse07-조립-기록--18--r146-중간-기준)를 먼저 읽습니다. 최종QA는본체후속append를우선하며.16/.17·프로젝트guide.4·이전본문은보존합니다.

**현재 .17:** 문서 끝의 “Menu06 제작 기록 · .17 · r107 기준”과 [제작값](TOOL_SPEC.md#menu06-제작-기록--17--r107-기준)·[검수경계](PROGRESS.md#menu06-제작-기록--17--r107-기준)를 먼저 읽습니다. 최종Menu06 actual은 본체 후속append를 우선하며 .16 Main05/이전본문·프로젝트guide.4는 보존합니다.
작성자: codex(단이) · 상태: 제안(검수 대기)
독립 정본 보정: 2026-11-16

**현재 .16:** 문서 끝의 “메인05 조립 기록 · .16 · r76 중간 기준”과 [제작값](TOOL_SPEC.md#메인05-조립-기록--16--r76-중간-기준)·[미완료 경계](PROGRESS.md#메인05-조립-기록--16--r76-중간-기준)를 먼저 읽습니다. 아래 .15 이하의 현재/완료 표현은 당시 이력입니다. 본체 후속 append가 중간값을 보정하며 프로젝트 guide .4는 보존합니다.

**현재 .15:** 문서 끝의 “친구 모달 실제 조립 추가 기록 · .15 · r72 기준”과 [제작값](TOOL_SPEC.md#친구-모달-실제-조립-추가-기록--15--r72-기준)·[검수 경계](PROGRESS.md#친구-모달-실제-조립-추가-기록--15--r72-기준)를 먼저 읽습니다. 아래 .14 이하의 최신/완료/다음 표현은 당시 이력이며 본체 후속 보고가 실제 검수를 보정합니다. 프로젝트 guide .4는 보존합니다.


**최신 .13:** 문서 끝의 “승리 화면 조립 추가 기록”과 [제작 recipe](TOOL_SPEC.md), [검수 경계](PROGRESS.md)의 .13을 먼저 읽습니다. 아래 .12 이하의 “최신/진행 중”은 해당 판의 이력입니다. 기존 프로젝트 guide .4는 보존합니다.

## 최신 안내 · .12 · r43

공통 정본은2026-11-16.12입니다. 실제 저장본 ux-gjs-0d80d7fe r43은 기존메인63+신규짓기78부품·2페이지·navigate/Back2개입니다. [진척 맨 위의 .12](PROGRESS.md)와 [툴 기획서 끝의 짓기 제작 recipe](TOOL_SPEC.md)를 우선합니다. 아래 .11/r24·미등록·수정 중 문구는 당시 이력이며 최신 완료/미완료를 대신하지 않습니다. W/P/U/S0/4·10장 최종동등검수0/10·사용자 승인 없음, 기존 프로젝트guide.4는 보존합니다.

## 최신 상태 바로보기 · .11 · r24

최신 저장판은 ux-gjs-0d80d7fe **r24·1페이지63부품·0연결**입니다. 세 배지 이미지 자식의 “Img_Notification_BG 복사”를 “Img_Notification_BG”로 정리해 저장했습니다. 아래 r21/수정 중/재시험 예정 문구는 당시 이력이며, 최신 사실과 지원 경계는 [PROGRESS 맨 위의 r24 마감 보정](PROGRESS.md)을 우선합니다. 공통판 .11·기존 본문·프로젝트 .4 사본은 유지합니다.

main 상세 기기 비례 수정은 완료했고 본체 새 전체 시험416/416 통과입니다. 전체 캔버스/상세 편집의 기기 선택과 별도 preview의 원본 비율 fit은 구분합니다. 가이드 필드 색 실제 확인도 마쳤습니다. r24 재열기 캡처·새 짓기 아트 등록/페이지 조립·연결은 남아 있으며 W/P/U/S0/4·승인 없음입니다.

## 현재 안내 · .11 실제 조립 반영

현재 공통판은2026-11-16.11, 안내는 기존7종입니다. [TOOL_SPEC 맨 위의 현재 로비 제작 표준](TOOL_SPEC.md)과 [PROGRESS](PROGRESS.md)를 먼저 읽습니다. .10 이하 본문·기존 AI for UI 추가절·프로젝트 guide .4는 보존합니다.

본체 actual 저장판은 ux-gjs-0d80d7fe r21·1페이지63부품·0연결입니다. 같은80×92 네 메뉴, 실제 Img/Txt 이름, 이미지와 숫자가 별도인28² compound 배지, 상하단 고정 그룹, 전체 캔버스 기기/custom/방향 보기와390 비례 검수를 반영했습니다. 네 메뉴 개별 가이드에서 정확한 heading과 W80/H92도 실제 확인했습니다. 4메뉴 tint 효과는 실제 이미지 자식 대상으로 저장/확인했지만 image-mode 샘플·GO는 미검수입니다.

**main 상세 편집390의 root551 고정/넘침은 발견 후 수정 중입니다.** 전체 캔버스 검수와 모든 preview 완료를 구분합니다. 411/411은 본체의 이번 통합 시험이며 상세 보완 후 재시험 예정입니다. 10원본/132계층/43연결은 명세 수, 새 짓기 도시 그림은 준비/미등록입니다. W/P/U/S0/4·UI 승인/freeze 없음입니다.

실제 편집 순서는 [USER_GUIDE](USER_GUIDE.md), 다음 AI 규칙은 [AI_GUIDE](AI_GUIDE.md), 상태/렌더 책임은 [ARCHITECTURE](ARCHITECTURE.md)를 따릅니다. [AI for UI 적용 계획](../../../../docs/plans/20261116-ai-for-ui-adoption.md)의 필요한 제작/검토 방법만 선택적으로 편입하며 자동 설치·패키지 추가는 없습니다.

## 지금 읽을 로비 제작 안내 · .10

현재 공통 가이드는 2026-11-16.10이며 기존 7종을 유지합니다. 로비를 만들며 확인한 공통 제작 절차·규격·이름·검수 경계는 [TOOL_SPEC의 로비 제작 표준](TOOL_SPEC.md#로비-제작-표준) 한 곳을 정본으로 읽습니다. 아래 .9 이하 본문은 당시 기록을 보존한 것이며 최신 상태는 [PROGRESS](PROGRESS.md)를 먼저 확인합니다. 프로젝트 guide .4 사본과 과거 설계는 별도 이력입니다.

|읽는 목적|안내|
|---|---|
|실제 도구에서 조립·수정하기|[사용 설명서의 로비 편집 순서](USER_GUIDE.md)|
|다른 AI가 같은 패턴으로 이어 만들기|[AI 공통 작업 규칙](AI_GUIDE.md)|
|원본 측정·좌표·자원·9slice·동일 메뉴 규격·텍스트 name|[로비 제작 표준](TOOL_SPEC.md#로비-제작-표준)|
|데이터와 렌더링의 책임 구분|[제작 구조](ARCHITECTURE.md)|
|구현·시험·실화면·계획 구분|[진척과 남은 작업](PROGRESS.md)|

같은 선상에서 같은 역할을 하는 4메뉴는 같은 80×92 슬롯, 같은 아이콘·텍스트·배지 규격을 사용합니다. 텍스트 name은 `Txt_<영역>_<역할>_<용도>`로 맞추되 기존 id/부모/연결은 보존하고 실행값 키와 화면 문구를 구분합니다. 실제 이름 적용·4메뉴 조립·최신 가이드 W/H의 실화면 검수는 진행 중이며, 새 전체 캔버스의 기기 선택·직접 W/H 입력·기준 설계와 preview 분리·비례 반응형은 후속 계획입니다. 시험 통과 수를 제작 완성률로 바꾸지 않습니다. W/P/U/S는 0/4이며 현재 UI 승인·freeze는 없습니다.

## 현재 요구 보정 · .9 직접 편집 디자인 가이드

부품 디자인 가이드는 실제 부품의 선·위치·크기와 이미지를 직접 편집하는 같은 설계의 뷰입니다. 같은 screen/element ID·parentId·기존 연결을 보존하고 실제 설계의 undo/redo·미저장·저장에 반영해야 합니다. 이미지 빼기는 표시 참조만 해제하며 부품이나 원자원 파일을 삭제하지 않습니다. 선택 부품을 중심에 놓고 치수는 외곽에 배치하며 모든 후손의 선·숫자를 기본으로 덮지 않고 하위 선을 켜고 끕니다. 계층 행 전체 선택과 펼침/접기를 분리하고, 레이어·중앙 캔버스·속성 세 영역의 두 경계 폭을 조절합니다.

직접 편집 구현과 실제 브라우저 검수는 진행 중입니다. 문서 설명서는 읽기 전용이고 부품 디자인 가이드는 실제 설계를 고치는 화면이라는 구분을 유지합니다. 원본 551×984px의 상위 25개/전체 67개 박스는 관찰 측정 자료이며 실제 원본 폰트 설정은 미확인입니다. .8의 전체 3D 바탕/별도 2D overlay·SNS 사진 슬롯·명시 컨펌 이후 승인 기록과 프로젝트 .4 사본 보존을 유지합니다. 사용 순서는 USER_GUIDE.md, 원리·수락 조건은 TOOL_SPEC.md와 ARCHITECTURE.md, 현재 검수 범위는 PROGRESS.md를 따릅니다. 가이드 목록 7종은 유지합니다.

## 무엇을 만드는 도구인가요
게임 UI의 화면, 부품, 배치, 입력, 이동과 연결 행동을 데이터로 만들고 시험하는 가벼운 웹 도구입니다. 완성 게임 그래픽 편집기나 게임 엔진의 대체품은 아닙니다. 디자인을 조립하고 저장한 다음 소비 렌더러에서 같은 설계를 읽는 구조입니다.

도구와 이 안내의 정본은 /Users/max/projest_max/ui-studio/입니다. 소스·의존성·서버·설명서·기본 저장공간·보고를 이 루트에서 독립 관리합니다. 소스는 src/tools/uxStudio/, 사용 설명서·툴 기획·제작 구조·AI 규칙은 그 안의 guide/입니다. 다른 프로젝트를 도구 실행 조건으로 사용하지 않습니다.

모노폴리 GO는 이 도구를 검증하기 위한 samples/monopoly-go/ 샘플입니다. 샘플 한 화면과 도구 전체, 실제 게임 연결의 완성을 서로 구분합니다.

게임마다 도구 전체를 복사하는 대신 선택한 게임 폴더 안의 ui-studio에 설계와 자원, 안내를 보관합니다. 폴더 선택은 게임 변경이나 기존 UI 변환에 대한 동의가 아닙니다.

## 도구를 여는 위치
정식 실행 주소는 http://127.0.0.1:7018/ui-studio/의 전체 캔버스입니다. /ui-studio/canvas.html도 같은 캔버스이고, 상세 편집은 /ui-studio/?editor=detail, 저장본 미리보기는 /ui-studio/preview.html입니다. 소스와 공통 안내는 /ui-studio/source/에서 제공합니다. 상단에서 프로젝트 종류·이름·경로, 설계 이름·revision·미저장 상태를 확인합니다. 선택 부품 상세 편집은 workspace·설계·화면·요소를 이어 엽니다.

서버와 의존성도 이 도구 루트에서 운영합니다. tools/ux-studio/mount.mjs와 저장 플러그인이 이 루트의 실제 소스·API를 연결합니다. 다른 프로젝트의 서버나 설치 경로로 돌아가는 fallback은 운영 조건에 포함하지 않습니다.

실행은 루트 README.md를 확인합니다. npm start는 scripts/start.mjs와 이 루트 node_modules를 사용합니다. Vite 5.4.21을 포함한 정확한 의존성 11패키지 복사와 외부 설치 fallback 제거를 마쳤고 7018 자체 기동·HTTP·독립 전환 당시 자동 시험 220/220을 확인했습니다. 실제 가이드 7종 읽기·Esc 복귀, 폴더 선택·저장·재열기·충돌·격리, 미리보기·모달 포커스와 캔버스 W 단계 왕복을 검수했습니다. 구체적인 범위와 남은 항목은 PROGRESS.md와 이번 전환 보고를 따릅니다.

## 처음 할 일
1. 상단 가이드에서 사용 설명서와 기존 게임 변환·독립 작업을 읽습니다.
2. 게임 폴더를 선택합니다. 처음 연결할 때 기존 UI 변환 여부를 먼저 선택합니다.
3. 변환을 원하면 AI가 기존 UI 전체 조사·백업·변환·연결·검증을 수행해야 합니다. 선택만으로 변환이 끝나지 않습니다.
4. 변환을 거절하면 원래 게임을 건드리지 않고 해당 게임의 ui-studio 안에서 독립 UI 소스만 만듭니다.
5. 전체 캔버스에서 화면·레이어를 보고 부품을 선택합니다. 상세 편집에서 입력·자원·응답형 배치·조건을 설정하고 동작 시험 후 저장합니다. 파일 재열기와 소비 화면도 확인합니다.

도구 URL의 /ui-studio/와 선택게임/ui-studio 저장 폴더는 서로 다른 구분입니다. 게임 폴더의 workspace ID와 설계 문서의 projectId/revision을 함께 확인합니다. 폴더 선택 전 기존 저장공간은 독립 루트의 _작업/codex/ux-studio/projects/에서 이어갑니다. 이관 출처에 남은 옛 저장 데이터와 혼용하지 않습니다. 폴더 기능의 선택·저장·전환 세부 동작은 사용 설명서를 따르세요.

## 안내 문서
- USER_GUIDE.md: 편집, 실행, 부품, 입력, 자원, 단계, 저장, 재열기
- AI_GUIDE.md: AI 진입점, 상위 지침, 수정 범위와 검증
- TOOL_SPEC.md: 목적, 데이터 계약, 폴더 구조와 기능 경계
- ARCHITECTURE.md: 도구를 만든 방식과 소스별 책임
- EXISTING_GAME.md: 변환 전 동의, 전체 변환 절차, 거절 시 독립 작업
- PROGRESS.md: 현재 관찰, 구현 계약, 남은 작업과 미확인

## 공통 정본과 프로젝트 사본
공통 정본은 독립 루트 /Users/max/projest_max/ui-studio/의 src/tools/uxStudio/guide/입니다. index.json의 version이 이 묶음의 판입니다. 상단 가이드의 공통 안내는 이 정본을 읽습니다. 프로젝트 안내는 선택한 게임의 ui-studio/guide/ 사본을 읽습니다. 현재 공통판은 .10이며 실제 생성·읽기를 확인한 프로젝트 사본은 .4입니다. 내용이 다르면 판과 프로젝트 상황을 확인하세요. 공통 UI의 판 표기는 index.json을 읽으며 프로젝트 안내는 자기 사본 index의 판을 표시합니다.

처음 만드는 프로젝트에만 공통 안내의 사본을 넣습니다. 기존 프로젝트를 다시 열 때 안내나 설계를 조용히 덮어쓰지 않습니다. 공통 안내가 바뀌어도 프로젝트 사본이 자동으로 최신이 되었다고 간주하지 않습니다. 갱신 작업은 차이를 확인하고 기존판을 보존한 뒤 별도로 수행해야 합니다.

## 협업과 기록
협업 진입점은 이 루트 docs/collaboration/README.md이며 root AGENTS.md가 우선 정본입니다. 진행은 docs/collaboration/STATUS.md에 append하고 이번 전환 보고는 docs/collaboration/reports/20261116_independence.md에 모읍니다. 기존 상세 보고는 docs/reports/20261116-project-workspaces.md에 보존합니다. 이관 출처·옛 공유 실행·기존 소비자 연결은 PROGRESS.md의 과거 이력에서만 읽습니다.

## 이번 계획 기능과 한계
컨트롤 7종은 실제 값을 가지고 네이티브 입력을 받습니다. 기본·가리킴/초점·눌림·선택·비활성 이미지 상태와 schemaVersion 4의 안전 영역·2D 앵커·고정 항목 자동 배치·영역 자르기/스크롤을 지원합니다. 새 PNG/JPEG/WebP는 선택 workspace의 assets/에 보존하고 내용 해시 참조를 저장합니다. Markdown/JSON 연결 명세는 원문 출처·조건·전달값·클릭 스토리보드를 전달합니다. JSON만으로 자원 파일이 동봉되지는 않습니다.

전체 Unity/Figma 호환·엔진 어댑터 자동 생성·게임 소스/저장파일 쓰기는 제공하지 않습니다. 지원 속성과 제한은 USER_GUIDE.md와 TOOL_SPEC.md, 실제 검수 범위는 PROGRESS.md를 따릅니다. 대표 본체의 이번 npm test는 302/302이며 _작업/codex/ux-studio/tool-capabilities-tests.log에 기록합니다.

## 상태를 읽는 기준
이 안내의 기존 편집·저장 기능 설명은 지정 소스 확인에 근거합니다. 폴더 기능은 2026-11-16 T04 폴더·내장 설명서 계약을 함께 설명합니다. 실제 실행·화면 검수 여부는 해당 작업 보고와 PROGRESS.md를 확인하세요. 문서에 기능을 적는 것만으로 게임 연결이나 변환이 완료되지는 않습니다.

기존 ux-gjs-61ad2d1f r14는 원본으로 보존했습니다. 실제 검수한 모노폴리 GO UI 샘플은 ux-902404d6 r4, 3개 page·1개 modal·24개 부품·6개 연결입니다. samples/folder-check는 별도 저장·격리 시험 fixture이며 게임 샘플이 아닙니다. 저장 버전·부품 수·W 단계 저장 성공은 W/P/U/S 종합검수 통과가 아니며 0/4를 유지합니다. 본게임 로직 작업은 병행할 수 있습니다. 이번 계획 도구 기능은 구현했고 다음 제작은 모노폴리 GO 정식 UI입니다. 그래픽·전체 샘플·실제 게임 연결은 미완료입니다. 전체 Unity/Figma 호환·엔진 어댑터 자동 생성은 현재 제공 범위 밖이며 새 선행 조건으로 추가하지 않습니다. 실제 게임 전체 UI의 자동 탐색·변환·연결도 미완료입니다.


## 승리 화면 조립 추가 기록 · .13 · r53 기준

작성자 codex(단이) · 2026-11-16 20:01 KST · 제안(검수 대기)

공통 정본은 2026-11-16.13이며 기존 안내 7종을 유지합니다. 본체 전달 기준 저장본은 ux-gjs-0d80d7fe r53으로, 기존 Main 63부품·Build 78부품과 새 Modal_Wins_QuickWins를 함께 둡니다. r53은 이 추가절의 기준 기록이며 후속 미세수정 revision은 본체의 저장 재읽기·실제 검수 보고를 따릅니다. Main/Build의 최종 deep equality 검사는 본체 확인 대기입니다.

승리는 종이 BG와 gold/white Frame의 native9slice, 고정 파란 클립·노란 광선, 별도 미션/보상 아이콘, native 제목·시간·미션 문구를 나눠 조립했습니다. 실제 제작값과 재현 순서는 [TOOL_SPEC의 .13](TOOL_SPEC.md), 조작 순서는 [USER_GUIDE](USER_GUIDE.md), 저장 캐시·계층 주의점은 [AI_GUIDE](AI_GUIDE.md)에서 읽습니다. 글자·그림·효과·프레임을 분리하는 공통 원칙을 유지합니다.

문서 담당은 [이번 전체 시험 로그](../../../../_작업/codex/ux-studio/wins-screen-final-tests.log)의 447/447·실패 0을 직접 읽었습니다. 본체가 전달한 실제 범위는 standalone 로비→승리 진입, r53 저장·재읽기와 제목/시간/아이콘 분리 표시입니다. 모바일430·키보드·배후 입력 차단 검수는 본체 진행 중이며 후속 보고를 참조합니다. 원본 폰트·픽셀·게임 보상·장식 정확도·7007/LSB는 미검수이고 10장 최종 동등검수 0/10·W/P/U/S 0/4·사용자 승인 없음입니다.


### 본체 후속 검수 · .13 · 2026-11-16 20:21 KST
r53/187부품·2page+1modal·4연결을실제저장재열기했습니다. Main/Build r43 deep equality동일,actual클릭·Enter/Space·Close/Escape·메뉴활성/초점복귀·배후inert·1440/430·논리390복귀·전체캔버스3판1920 확인. 최종451/451·fail0,보고 docs/collaboration/reports/20261116_1916_wins-screen.md 및 PROGRESS .13 본체최종절을읽습니다. 닫기렌더staleinert·fullscreen demo×·고정bridge?v의immutable캐시불일치도최소보완/actual재확인했습니다. bridge공개API변경때import버전URL캐시를함께점검합니다. 위전달시점pending/447은이력이며최신결과로합산하지않습니다. 프로젝트guide.4보존·모든산출제안,10장동등0/10·W/P/U/S0/4·원본폰트/게임보상/7007LSB native/사용자승인미완료. 다음03앨범새그림·메뉴연결입니다.


## 앨범 실제 조립 추가 기록 · .14 · r63 기준

작성자 codex(단이) · 2026-11-16 21:09 KST · 제안(검수 대기)

문서 담당이 실제 샘플 ux-gjs-0d80d7fe r63을 읽어 Main63+Build78+Wins46+Album74=261부품, 3page+1modal·6연결을 확인했습니다. Main Album→navigate/always와 Album Back→back/always가 추가되었습니다. 기존 .13 이하 본문과 프로젝트 guide.4는 그대로 보존합니다.

공통판은2026-11-16.14입니다. 앨범상단고정장식/보상과아래3열세로스크롤을분리했습니다. 새그림15+기하UI7·native글자·진행·그림자·입력은각각관리합니다. 재현값은[TOOL_SPEC .14](TOOL_SPEC.md),조작은[USER_GUIDE .14](USER_GUIDE.md),최신검수범위는[PROGRESS .14](PROGRESS.md)를따릅니다.

문서 담당은 fresh [album-screen-final-tests.log](../../../../_작업/codex/ux-studio/album-screen-final-tests.log)의451/451·실패0·cancelled0을 직접 읽었고 시험/actual UI를 재실행하지 않았습니다. 과거 실행 수를 합산하지 않습니다. 본체 전달 actual은 로비→Album→Back→Main 현금13,075/trigger 초점 복귀·재진입 scroll0, AX scroll0→181.25/client625/scrollHeight806/headerY114.765625 고정/body scroll0입니다. 재진입 초기화는 관찰값이며 원본 정책으로 확정하지 않습니다. 모바일430·1920canvas·최종 캡처·기존Main/Build/Wins deep equality는 본체 검수 대기이며 후속 본체 보고를 우선합니다.

원본 폰트/픽셀·실제 게임/보상/카운트다운·Info/Vault/세트 상세 목적지·7007/LSB·사용자 승인/freeze는 미완료/미확인입니다. 10장 최종 동등0/10·W/P/U/S0/4, 제안(검수 대기)를 유지합니다.


### .14 후속 미확인 보정 · 2026-11-16 21:10 KST

Set08/09 새 그림은 원본 종과 불일치해 본체가 새 그림으로 보정 중입니다. 해당 그림의 최종 교체 revision·실제 등록/표시·검수 결과는 본체의 후속 실제값 append를 기다립니다. 현재 UI 완료나 원본 동등을 주장하지 않습니다. 상세 본체 보고는 [20261116_2025_album-screen.md](../../../../docs/collaboration/reports/20261116_2025_album-screen.md)입니다.

UI manifest의 progressCapsTransparentCorners=false는 room을 추가한 뒤 마지막2개 배열이fill+room이된집계오류였습니다. 실제progress-bg3/fill3의4모서리알파0을직접확인하고해당2role만명시선택하도록원스크립트집계식을보정했습니다. 그림파일/등록/UI는변경하지않았습니다. 이메타데이터보정은UI검수완료판정이아닙니다.


### 본체 최종 실제값 · 앨범 r64 · 2026-11-16 21:20 KST

위 r63/교체 중/pending은 중간 이력입니다. 최종 ux-gjs-0d80d7fe r64=Main63+Build78+Wins46+Album74=261부품·3page+1modal·6연결입니다. 실제 툴의 이미지 경로 입력+Tab으로 Set08 초록·노랑 새/Set09 노란 강아지 v002를 등록·교체·저장했습니다. 두 종을 고양이로 잘못 읽은 v001은 원본/해시를 보존하고, _작업/codex/ux-studio/album-icon-corrections.json에 교체 이유·새 원본/프롬프트/투명 PNG/WebP·SHA·관찰/추정을 기록했습니다. screenshot pixels 재사용 없이 새로 그린 그림입니다. v00115+기하UI7+교정2=24개 보관 자원 해시·미러 일치, 최종 사용 신규 자원22개입니다. 일러스트15개 사용 중2개가v002이며 기하UI7은직접작성SVG→losslessWebP입니다.

본체 actual: Main Album 클릭→새 Album→Back→Main 현금13,075/Album trigger 초점복귀, native Tab/Enter로Back·Space재진입, scroll0→181.25(client625/scrollHeight806)·headerY114.765625고정·바깥scroll0·재진입scroll0을 확인했습니다. 재진입 초기화는 우리 도구 관찰이며 원본 정책 확정이 아닙니다. 최종preview CSS1440×900·모바일CSS430×844에서 가로/세로넘침0·깨진이미지0. 캡처파일은 각각phoneclip408×729/모바일430×843입니다. 전체canvas CSS1920×1280의실제파일1919×1280,4boards X24/635/1246/1857,Y40·폭551/60간격·261부품·r64재열기를확인했습니다. 상세390×844의root와preview-screen실제389.997×843.987일치/설계기준복귀·r64hash불변,당시상세브라우저CSS2687×1792로1440상세검수라쓰지않습니다. 카드가이드W164/H248actual파일2520×1575도보존했습니다. 자동배치자식의가이드위치/크기잠금은부모grid보존규칙입니다.

Vault actual right10.019/bottom12.012 논리px·engine filter drop-shadow(0,2,3,.25)로하단고정확인. Main/Build/Wins 전체deep equality와기존4edges는r53와동일합니다. 본체 이번npm test451/451·fail0·exit0,로그 _작업/codex/ux-studio/album-screen-final-tests.log. 그뒤제품소스변경0/재실행중복합산0이며삽화교체는자원해시/실제표시로재검증했습니다.

보고 docs/collaboration/reports/20261116_2025_album-screen.md, 증거 docs/evidence/20261116-album-screen/ 및 file-verification.json을 우선합니다. current-review는r64로갱신합니다. 프로젝트guide.4/원본/이전판보존, 공통.14. 다음04친구새그림·native본문/탭/목록/행동·Main입구/Close/차단/복귀연결입니다. Info/Vault/세트상세목적지·게임수치변화/보상/시간·원본폰트/픽셀동등·7007/LSB native·사용자승인/freeze는미완료입니다. 10장최종동등0/10·W/P/U/S0/4·제안(검수대기),주간81/90·11/17 08:00KST중지선·기존ui30분만유지합니다.


## 친구 모달 실제 조립 추가 기록 · .15 · r72 기준

작성자 codex(단이) · 2026-11-16 22:09 KST · 제안(검수 대기)

문서 담당이 실제 저장본 `ux-gjs-0d80d7fe` r72를 읽었습니다. Main63+Build78+Wins46+Album74+Friends87=348부품, 3page+2modal·8연결입니다. r72는 이번 문서의 확인 기준이며 본체 후속 저장/실제 검수 보고를 우선합니다. 기존 본문·원본·프로젝트 guide .4는 보존합니다.

친구는 고정 제목/같은 폭3탭·선택된 타임라인 스크롤·하단 고정Close를 가진 모달입니다. Main의 기존 Friends stable ID에서 open/always로 들어가고 기존Close edge로 닫습니다. 원본에서 보이는 내용은 큰 요청1행과 완전관찰 활동4행, 일부만 보이는 Jaime행입니다. 친구추가/리더보드의 본문은 빈칸이며 게임 API를 만들지 않았습니다.

각 역할의 재현법은 [TOOL_SPEC .15](TOOL_SPEC.md#친구-모달-실제-조립-추가-기록--15--r72-기준)의 논리px recipe, [USER_GUIDE .15](USER_GUIDE.md#친구-모달-실제-조립-추가-기록--15--r72-기준)의 실제 입력 순서, [AI_GUIDE .15](AI_GUIDE.md#친구-모달-실제-조립-추가-기록--15--r72-기준)의 보존/실수 복구, [ARCHITECTURE .15](ARCHITECTURE.md#친구-모달-실제-조립-추가-기록--15--r72-기준)의 탭 본문·자원 계약, [PROGRESS .15](PROGRESS.md#친구-모달-실제-조립-추가-기록--15--r72-기준)의 검수 경계를 따릅니다. 신규 자원은 그림2+기하15=17개이고 r72에서17개 assetRef가 모두 참조됩니다. native 글자·입력·프레임·그림·별·알림·효과를 나눕니다.

본체 실행 로그 [friends-screen-final-tests.log](../../../../_작업/codex/ux-studio/friends-screen-final-tests.log)의 **463/463·실패0·cancelled0**을 문서 담당이 직접 읽었습니다. 이 담당은 시험을 재실행하지 않았습니다. 선행 전체462/462와 후속 escape 전용7/7·RED/GREEN은 별도 실행 이력이며 합산하지 않습니다. **모바일430·데스크톱1440·전체캔버스1920, 키보드·스크롤·dim·Close·포커스 복귀 최종 실검수는 본체 진행 중**으로 이 추가절에서 통과를 주장하지 않습니다. 소스/저장 계약과 실제 입력 성공을 구분합니다.

원본 폰트/픽셀 동등·실제 스티커 요청/전송/거절·게임 수치/시간·7007/LSB native·사용자 승인/freeze는 미완료/미확인입니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**를 유지합니다. Source05 배경은 새 그림1회 생성 준비·미등록 단계로 05 조립 완료가 아닙니다. 주간83/90·11/17 08:00 KST 중지선·기존30분 운영은 본체 전달 상태이며 이 문서 작업은 예약/서버를 만들거나 재개하지 않았습니다.

근거: [04 원본](../../../../docs/reference/monopoly-go/20261116-ten-screens/04_friends.png) · [측정표](../../../../_작업/codex/ux-studio/friends-assembly-quick-sheet.md) · [그림2 manifest](../../../../_작업/codex/ux-studio/friends-icon-assets.json) · [기하UI15 manifest](../../../../_작업/codex/ux-studio/friends-ui-assets.json) · [탭 엔진 diff](../../../../_작업/codex/ux-studio/tab-engine-source.diff) · [본체 보고](../../../../docs/collaboration/reports/20261116_2125_friends-screen.md). Manifest의 UIApplied/registration은 자원 하위작업 당시 상태이며 실제 참조는 r72를 대조했습니다.


### 본체 최종 실제값 · 친구 r72 · 2026-11-16 22:36 KST

앞선 .15의 463/463·실화면검수중은 중간 이력입니다. 최종 저장 ux-gjs-0d80d7fe r72는 348부품·3page+2modal·8연결이며 기존 r64의 네 화면 전체와 6연결은 deep equality/포함 대조로 보존했습니다. 신규 Friends87, 새 그림2+직접 그린 기하UI15=17자원의 production·staging·등록본 SHA와 실제 설계 참조를 확인했고 17개 HTTP200/응답SHA도 확인했습니다. 기존 Cashv003/Bankv002/공통Badge 재사용과 신규 그림을 구분합니다. 프로젝트 guide.4는 보존했습니다.

본체 실제 브라우저: 메인 친구 클릭/Enter/Space→모달, 세 탭 Enter/Space→선택skin/본문 display·inert 전환, 배후Main inert, Close 클릭/Enter·Escape→닫힘/메인Friends 초점복귀를 확인했습니다. native PageDown으로 scrollTop0→51.25(client585/scrollHeight636), CSS1440×900에서 headerY226.51834106445312/footerY773.5620727539062 불변·바깥scroll0, 재진입scroll0 확인. Panel 실제 filter는 drop-shadow(rgba(0,0,0,.25) 0px 3px 6px), 실제 dim은 rgba(22,39,56,.5)입니다. CSS1440×900/430×843에서 가로·세로넘침0/깨진img0, 1920×1280 실행 캡처를 보존했습니다. 파일 픽셀은 각각1800×1125/537×1055/2400×1600입니다. 1920 증거는 전체캔버스가 아닌 독립 미리보기이며 상세편집1920 증거도 별도로 보존했습니다.

검수 중 구탭24의 미저장 재열기 경로가 응답하지 않아 한 번 질문했지만, 새 탭25/29의 저장 r72 읽기와 최종 키보드·마우스 검수는 성공했습니다. 원인을 Mac잠금/제품결함으로 확정하지 않습니다. 즉시 읽은 Enter Close와 PageDown은 240ms 연출/브라우저 스크롤 중간값일 수 있어 후속 안정 프레임을 확인합니다. 에디터 선택목록에도 data-element가 있으므로 computed 검사는 .ui-element로 범위를 좁힙니다. CSS border-image는 document.images 검사 밖이므로 HTTP/SHA를 별도로 확인했습니다.

최종 소스 검토에서 복제된 tabs의 panelId가 원본문을 가리키는 결함을 확인해 commands.mjs의 번들 ID 재매핑/범위 밖 참조 해제/삭제·그룹해제의 지워진 참조 정리를 보완했습니다. 관련6RED→GREEN 뒤 본체 최종 npm test469/469·fail0·cancelled0·exit0. 로그 _작업/codex/ux-studio/friends-screen-final-verified-tests.log, 실제 Panel 복제→Undo(저장안함)도 확인했습니다. 이 최종 시험 뒤 제품 소스 변경0입니다. workspace 누락 의심은 실제 root metadata 상속으로 해소했고 소스수정 없이 두 workspace 소비자20/20을 확인했습니다. 실제 결함으로 기록하지 않습니다.

근거는 docs/collaboration/reports/20261116_2125_friends-screen.md와 docs/evidence/20261116-friends-screen/{browser-checks,file-verification,asset-http-checks}.json 및 JPG입니다. 구체적인 안정 프레임·입력 성공은 이 최종 절을 우선합니다. 실제 Send/Reject API·원본에 없는 두 탭 본문·Jaime 본문/초상·원본 폰트/픽셀동등·7007/LSB native·게임연결/사용자승인·W/P/U/S0/4·10장 최종동등0/10은 미완료입니다. 다음05 메인 신규 배경은 준비 파일이며 아직 미등록/미조립,06메뉴/07창고/08상점/09·10이벤트 순서로 이어갑니다. 주간84/90·11/17 08:00KST 중지선·기존ui30분만 유지합니다.


### 전체 캔버스 실제 재검수 보정 · 2026-11-16 22:41 KST

22:36 단위보고 뒤 기본 진입을 다시 열자 고정 ?v=20261116-wins-fullscreen1 주소의 이전 controls 검증기가 새 tabSkin을 거부해 ‘저장 설계 읽는 중’에 머무는 오류를 실제 재현했습니다. 브라우저 오류시각13:36:24.879Z/스택과 HTTP헤더를 대조했습니다. 같은 모듈의 일반주소는 Cache-Control:no-cache,고정 ?v= 주소는 max-age=31536000,immutable이었습니다. src/tools/uxStudio/grapes-pilot.mjs:5의 bridge import에서 고정 query만 제거해 Vite의 최신소스 재검증을 사용합니다. 새 버전문자열을 반복해서 붙이거나 캐시전부삭제/서버재시작은 하지 않았습니다. 실제 재현→최소 한 줄 보완→관련27/27→전체470/470·fail0·cancelled0·exit0→같은 기본진입 재열기로 검증했습니다. 최종로그는 _작업/codex/ux-studio/friends-canvas-cache-final-tests.log이며 469는 직전 결과입니다. 추가된1개는 control-visual.test.mjs:330의 두workspace page/modal native탭 자원경계 특성시험으로,제품수정이아닌20개관련검증안의추가회귀입니다. 시험 수를 합산하지 않습니다.

actual 기본 전체캔버스 status ‘5개 화면 ·348개 부품 ·원본r72보존 ·수정은사본으로저장’, 사본저장enabled·header저장됨r72. 5판 x24/635/1246/1857/2468,y40,width550.996,height983.984의약60간격을확인했습니다. 캔버스CSS1600×900/실제파일2000×1125이며1920검수로쓰지않습니다. 증거 docs/evidence/20261116-friends-screen/canvas-cache-recovery.json 및 friends-canvas-css1600-r72.jpg. 오류로그의13:36기록은재열기전이력이고복구후새오류로세지않습니다. r72설계SHA65770adbe5263f57b9f2f8ab38593bd272a894c1a92759a41163d3e8f26d82aa 불변, 기존4화면/6연결보존. 위 ‘469뒤제품변경0’은이추가수정전시점이며최종은470이후제품소스변경0입니다. 백업2240_canvas_cache/2241_canvas_recovery_closeout. 공통.15/프로젝트.4·W/P/U/S0/4·전체동등0/10·미완료경계는그대로입니다.


## 메인05 조립 기록 · .16 · r76 중간 기준

작성자 codex(단이) · 2026-11-16 23:04 KST · 제안(검수 대기)

문서 담당은 저장본 `ux-gjs-0d80d7fe` r76을 직접 읽었습니다. Main71+Build78+Wins46+Album74+Friends87=356부품, 3page+2modal·8연결이며 Main 조립 중의 스냅샷입니다. SHA는 `123486eb140ffe898e5cb3ef3a78fe8065e292e8bfc0777d1c4f8c025ef4d06c`입니다. 본체 후속 저장·최종 append가 이 중간값을 보정합니다. 기존 본문·이전판·프로젝트 guide .4는 보존합니다.

Main05는 기존 Main 화면과 stable ID를 유지하며 새 캔디 보드 2D 배경, HUD, 상단 이벤트, 좌우 입구, GO/배수, 하단 메뉴를 독립 부품으로 조립하는 단위입니다. 그림 생성·파일 준비를 화면 완성으로 세지 않습니다. r76은 현금36,750,000·주사위2602/90·HOLD FOR AUTO·해적방패4개와 새 배경, Shop 입구, CAKE/WALK 일부가 저장된 중간 단계입니다.

[사용 순서](USER_GUIDE.md#메인05-조립-기록--16--r76-중간-기준), [좌표·슬라이스 제작값](TOOL_SPEC.md#메인05-조립-기록--16--r76-중간-기준), [AI 보존 규칙](AI_GUIDE.md#메인05-조립-기록--16--r76-중간-기준), [저장·효과 계약](ARCHITECTURE.md#메인05-조립-기록--16--r76-중간-기준), [완료 경계](PROGRESS.md#메인05-조립-기록--16--r76-중간-기준)를 함께 봅니다. 특히 **새 이미지 등록 완료 → 실제 원본 크기 확인 → 분할/고정폭 입력 → 저장값 확인** 순서가 중요합니다. 구 이미지 크기에서 먼저 입력하면 분할이 제한될 수 있습니다.

기존 GO wordmark ID는 보존하지만 r76의 name/text 변경만으로 native 전환 완료라고 하지 않습니다. 아직 kind=image/partRole=image·빈 image 객체이며 kind=text/partRole=label·image 제거의 유효 전환과 실제 재검수를 본체가 진행합니다.

신규 준비는 그림12+기하UI11+배경1=24개입니다. 세 manifest의 production/staging SHA를 이번에 24/24 직접 대조했습니다. r76의 고유 assetRef 참조는 그림2(Shop·pirate-shield)+기하UI2(banner fill9/frame9)+배경1=5/24이며, 방패4개는 같은 자원1개를 재사용합니다. 이는 저장 설계 참조 수이며 이번 담당의 실제 등록 UI·HTTP·최종 화면 검수는 아닙니다. Manifest의 제작 시점 uiApplied=false/registration=null만으로 현재 미등록이라고 판단하지 않습니다. 최종 등록·사용 개수는 본체 후속 실제값을 따릅니다.

앞 단위 본체 소스 검증470/470은 과거 실행입니다. Main05 이번 시험 재실행·390/430/1440/전체캔버스·키보드·그림자·저장 재열기 최종 실검수는 미완료이며 이 문서 담당은 실행하지 않았습니다. 상단 진행/보상/시간과 좌우 다수 입구, x50 및 06~10 목적지도 조립/연결 대기입니다. 원본 폰트·픽셀 동등·실3D·실제 GO/자동굴림/배수/차감/보상/카운트다운·7007/LSB native·사용자 승인/freeze는 미완료/미확인입니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**를 유지합니다. 주간85/90·11/17 08:00 KST 중지선·기존 ui30분은 본체 전달 상태이며 새 예약·재개·서버 작업은 하지 않습니다.

근거: [05 원본](../../../../docs/reference/monopoly-go/20261116-ten-screens/05_main.png) · [측정표](../../../../_작업/codex/ux-studio/main05-assembly-quick-sheet.md) · [그림12 manifest](../../../../_작업/codex/ux-studio/main-events-assets.json) · [기하UI11 manifest](../../../../_작업/codex/ux-studio/main-ui-assets.json) · [배경 manifest](../../../../_작업/codex/ux-studio/main-candy-board-assets.json). 측정표의 초기r72/후속r74와 이 문서의 r76을 구분합니다.

최종 정규화 제작값은 원본bbox 측정과 구분합니다. 좌6은 input100×104, art88×78@(6,0), timer96×22@(2,80), dot18²@(80,0), root x10/y100·205·310·415·520·625입니다. 우원형4는 input84×108, art80²@(2,0), timer84×30@(0,76), dot18²@(66,0), root x449/y234·344·454·574입니다. 초기 우높이104 제안은 timer의끝106보다 작아108로 보정했습니다. 모든 자식은 부모 가이드 영역 안에 두고 그림은contain으로 원비율을 유지합니다. Tycoon은 별도 featured106×137이며 같은 역할끼리 부모/자식 규격을 통일합니다.


## Main05 최종 실제 보정 · .16 · r92

작성자 codex(단이) · 2026-11-17 00:16 KST · 제안(검수 대기)

**공통 .16의 최신 실제 사실은 이 최종 절을 우선합니다.** 앞선 r76/준비24개/GO전환 실패·조립 대기 기록은 당시 이력으로 보존합니다. 현재 저장본은 `ux-gjs-0d80d7fe` **r92·Main175/총460부품·3page+2modal·기존8연결**이며 SHA는 `c27d09e500d63ad2a6caf93b0a6f681cc681c137095c3d209a953bb336b9743e`입니다. r92의 설명도 실제2D/목적지·게임 미완료 경계를 반영했습니다.

Main05의 새2D배경·HUD·CAKE WALK·좌우11이벤트·x50·GO·하단4메뉴가 실제 편집기에서 독립 부품으로 저장됐습니다. native GO는 기존 ID의 text/label이고 image 필드가 없습니다. 새 이벤트12부모의 native 상단 앵커로 같은 역할 규격과 기기 비례를 유지하며 x50은 HUD_Bottom 자식74²입니다.

[사용법](USER_GUIDE.md#main05-최종-실제-보정--16--r92), [제작값](TOOL_SPEC.md#main05-최종-실제-보정--16--r92), [AI 주의점](AI_GUIDE.md#main05-최종-실제-보정--16--r92), [타입·레이아웃 구조](ARCHITECTURE.md#main05-최종-실제-보정--16--r92), [완료 경계](PROGRESS.md#main05-최종-실제-보정--16--r92)를 먼저 읽습니다. 앞선 r76의 GO실패/배너분할64·64·12·12/5참조는 이력이며 최종값으로 반복하지 않습니다. 27등록과 실제10화면/게임완료는 다릅니다.

문서 담당은 r92 저장본·[파일 검증](../../../../docs/evidence/20261116-main05/file-verification.json)·[브라우저 기록](../../../../docs/evidence/20261116-main05/browser-checks.json)·[최종 시험 로그](../../../../_작업/codex/ux-studio/main05-final-tests.log)를 직접 읽었습니다. 신규 **27개=배경1+AI그림13+직접 그린 기하UI13**은 실제 UI 등록·설계 참조·production/staging/등록 SHA·HTTP200/응답 SHA가 확인됐습니다. Main기존63 ID·기존8edges·다른4화면의 r72 대비 deep equality를 보존했습니다. 최종 본체 `npm test`는 **477/477·실패0·cancelled0·exit0**이며 앞선470은 이전 실행입니다. 이 문서 담당은 시험/브라우저를 재실행하지 않았습니다. GUI 실제 검수와 Undo/Redo·기기 수치는 본체 실행 기록/전달값입니다.

목적지06~10·원본폰트/픽셀동등·실3D·GO굴림/자동모드/배수/시간·보상/구매 등 게임 로직·7007/LSB native·사용자 승인/freeze는 미완료입니다. 원본05의 작은 hammer 아바타 중첩도 미재현입니다. 06/07 측정·자원 준비는 UI 미등록이며 화면 완성으로 세지 않습니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**, 주간86/90·**2026-11-17 08:00 KST 최종 중지선**을 유지합니다. 기존 ui30분 외 새 예약·재개·서버/빌드는 하지 않습니다. 프로젝트 guide .4와 이전판·원본을 보존합니다.

증거 파일: [1440 preview](../../../../docs/evidence/20261116-main05/main-r90-css1440.jpg) · [430 preview](../../../../docs/evidence/20261116-main05/main-r90-css430.jpg) · [1920 preview](../../../../docs/evidence/20261116-main05/main-r90-css1920.jpg) · [r90 전체캔버스](../../../../docs/evidence/20261116-main05/main-r90-canvas-css1920.jpg) · [r90 정상clip](../../../../docs/evidence/20261116-main05/main-r90-phone-clip.jpg) · [r92 폰파일](../../../../docs/evidence/20261116-main05/main-r92-phone.jpg). 파일 픽셀과 CSS viewport·기기 profile을 구분합니다.


## Menu06 제작 기록 · .17 · r107 기준

작성자 codex(단이) · 2026-11-17 00:45 KST · 제안(검수 대기)

문서 담당은 먼저 r106을 읽고, 본체의 프로필 crop/알림 alt 보정 뒤 **r107**을 다시 읽었습니다. 현재 `ux-gjs-0d80d7fe`는 Main175+Build78+Wins46+Album74+Friends87+Menu81=541부품·3page+3modal·10연결입니다. r107 SHA는 `75bda424a32d2e998fc2043547259d4b6a1b3ad0b07f4e99d1dfb1e787664cc6`입니다. 기존8연결과 Main Menu stableID를 유지하고 MainMenu open/Close 두 연결만 추가했습니다. 공통 .16과 프로젝트 guide .4·이전 본문은 보존합니다.

**Menu06 최종 r107의1440/430/390·키보드·캡처 종합 실검수는 본체 진행 중입니다. 이 절은 저장/제작법/소스 검증이며 통과 선언이 아닙니다. 최종 actual은 본체의 후속 append를 우선합니다.**

Menu06은 실제 저장 형식 `kind=modal`·presentation.rootMode=fullscreen의 루트 안에 우측 drawer를 둡니다. 측정표의 sheet제안과 저장 형식을 구분합니다. 원본296×531의9행/프로필/우측판/단일dim·하단Close를 native문구·개별아이콘·프레임·배지·입력으로 조립했습니다.

[사용법](USER_GUIDE.md#menu06-제작-기록--17--r107-기준), [제작값](TOOL_SPEC.md#menu06-제작-기록--17--r107-기준), [AI복제/입력규칙](AI_GUIDE.md#menu06-제작-기록--17--r107-기준), [그룹배지/전체채움구조](ARCHITECTURE.md#menu06-제작-기록--17--r107-기준), [미완료경계](PROGRESS.md#menu06-제작-기록--17--r107-기준)를 함께 읽습니다. 신규SVG8+solidSVG3=11,기존5종+SNS/공통배지재사용이며 준비/등록/저장참조/최종화면검수를 구분합니다. 본문font/아이콘/선/배지·그림자/입력을 이미지 한 장에 합치지 않습니다.

직접 읽은 근거: [지정 시작 보고](../../../../docs/collaboration/reports/20261117_0013_menu06.md) · [06 원본](../../../../docs/reference/monopoly-go/20261116-ten-screens/06_menu.png) · [측정표](../../../../_작업/codex/ux-studio/menu06-assembly-quick-sheet.json) · [신규8/재사용5 manifest](../../../../_작업/codex/ux-studio/menu-ui-assets.json) · [solid3 manifest](../../../../_작업/codex/ux-studio/menu-flat-assets.json) · [RED](../../../../_작업/codex/ux-studio/group-badge-notification-red.log) · [GREEN](../../../../_작업/codex/ux-studio/group-badge-notification-green.log) · [최종 시험](../../../../_작업/codex/ux-studio/menu06-final-verified-tests.log). 최초 보고의8준비/미등록·소스수정예정없음은 당시 계획입니다. 현재 신규11개 production/staging SHA와 저장 assetRef 참조를 직접 대조했습니다. manifest의생성시점UIApplied=false/registration=null을 현재 적용 상태로 그대로 옮기지 않습니다.

그룹 배지 관련2RED(actual1/expected빈문자열)→관련41GREEN 뒤 본체 최종 `npm test` **479/479·실패0·cancelled0·exit0**입니다. 문서 담당은 로그를 읽었으며 시험/GUI를 재실행하지 않았습니다. 본체 소스 리뷰1회 완료 후 후속focus CSS한규칙의 범위를 아래에 구분했습니다. r104이전 Menuopen/첫Shop초점/Maininert/점글자숨김/Close·dim화면을 확인한 기록과 최종r107 종합실검수 진행을 구분합니다.

SHOP08/SHOWROOM07 연결은 실제 목적지 조립 뒤 진행하며 NET WORTH/DAILY TREATS/MAP/BOARD REPORT/JOIN US!/SETTINGS/GO!CHAT의7목적지는 미관찰·미설정입니다. 원본 dim 정확alpha·폰트/픽셀동등·게임 기능·7007/LSB native·사용자 승인/freeze는 미완료/미확인입니다. **W/P/U/S0/4·10장 최종 동등0/10·제안(검수 대기)**, 주간87/90·**2026-11-17 08:00 KST 중지선**·기존 ui30분만 유지합니다. 새 예약/재개·서버/빌드는 하지 않습니다.

후속 focus 보정: native 행은 isGroup/button·hitshape rectangle인데 예전 wireframe `.kind-button`의50% radius가 keyboardfocus를큰타원으로보이게한실제사례를확인했습니다. [styles.css](../styles.css):1257근방에 `.is-group.kind-button[data-hit-shape="rectangle"] { border-radius:0; }` 한규칙을추가해그룹+사각입력만맞췄고일반button/도형전체정책은유지했습니다. CSS보완전 `menu06-final-tests.log`479는이전이력이며이후새 [menu06-final-verified-tests.log](../../../../_작업/codex/ux-studio/menu06-final-verified-tests.log)의479/479·fail0·cancelled0·exit0을최종소스검증으로읽었습니다. 최종390/430/1440·키보드·캡처 actual은여전히본체진행중입니다.


## Menu06 최종 실제 보정 · .17 · r107

작성자 codex(단이) · 2026-11-17 00:52 KST · 제안(검수 대기)

**이 최종절은 앞선 .17 r107 준비절의 기기/키보드/캡처 ‘검수 진행 중’ 표현을 보정합니다.** r107은 Menu81/총541·6화면(3page+3modal)·10연결이고 SHA `75bda424a32d2e998fc2043547259d4b6a1b3ad0b07f4e99d1dfb1e787664cc6`가 기기변경·기준복귀 뒤에도 불변입니다. 다른 기존5화면 deep equality·원8연결·Main Menu stableID를 보존했습니다. **현재 기본 전체캔버스의 최종 재열기는 본체 마감 검수 중**이며 이 절에서 통과를 주장하지 않습니다.

Menu06의 r107 preview/상세기기·native키보드 진입/닫기·배후차단·초점복귀를 본체가 확인했습니다. 동일9행·별도아이콘/native문구/알림·사진crop·native9frame·단일dim·footerClose는 독립 부품이며 사용18자원/신규11개입니다. 목적지07/08과나머지7개기능은미완료입니다.

최종 [사용/기기확인](USER_GUIDE.md#menu06-최종-실제-보정--17--r107)·[정확한크기](TOOL_SPEC.md#menu06-최종-실제-보정--17--r107)·[검수경계](PROGRESS.md#menu06-최종-실제-보정--17--r107)를 먼저 읽습니다. CSS430의resize직후160px세로넘침은다음stable DOM에서0으로해소됐고최종버그로기록하지않습니다.

본체 실제 입력은 Menu click/Enter/Space→첫Shop초점, Close click/Enter 및 Escape→Main/Menu초점복귀입니다. 열린동안 Main의inert속성값은빈문자열(속성존재)/Menu aria-disabled=true,닫으면inert제거(null)/aria-disabled=false였습니다. 실제9배지의native글자는모두빈칸·6개0배지는숨김입니다. 단일32²fullblacktexture opacity.7/engine.dim=false의정확경계,CloselegacySkin없음,새로열기뒤직사각focus radius0px(이전50%)를확인했습니다. 원본정확dim alpha .7확정이나숨은목적지구현을뜻하지않습니다.

문서 담당이 [브라우저 기록](../../../../docs/evidence/20261117-menu06/browser-checks.json)·[파일 검증](../../../../docs/evidence/20261117-menu06/file-verification.json)을 직접 읽었습니다. Menu사용18고유자원이등록되어있고그중신규11개(SVG8+solid3)입니다. 기본재사용5+SNS/공통Badge는신규수에더하지않습니다. 최종프로필crop[60,75,1111,1111]/9개알림alt/9행307.15×56.21·3점/6숨김·Close.skin없음도저장대조했습니다.

CSS focus 보완 후 [menu06-final-verified-tests.log](../../../../_작업/codex/ux-studio/menu06-final-verified-tests.log)의 **479/479·fail0·cancelled0**을 직접 읽었고 본체가 process13769의 **exit0 완료**를 확인했습니다. 이후 제품source변경0입니다. CSS전의동일479로그와합산하지않습니다. 이문서담당은시험/브라우저를재실행하지않았으며 actual 입력·기기값은본체증거/전달값입니다.

기본캔버스최종재열기는본체마감append를우선합니다. SHOP08/SHOWROOM07연결은실제목적지조립뒤이며나머지7메뉴목적지는미관찰·미설정입니다. 원본폰트/픽셀동등·정확dim alpha·게임기능·7007/LSB native·사용자승인/freeze는미완료입니다. **W/P/U/S0/4·10장최종동등0/10·제안(검수대기)**, 주간87/90·2026-11-17 08:00 KST 중지선·기존 ui30분만유지합니다. 공통.16/.17준비기록·프로젝트guide.4·원본을보존하며새예약/서버/빌드를만들지않습니다.

최종이미지: [nativeclip551×985](../../../../docs/evidence/20261117-menu06/menu-r107-phone.jpg) · [CSS1440](../../../../docs/evidence/20261117-menu06/menu-r107-css1440.jpg) · [CSS430 stable](../../../../docs/evidence/20261117-menu06/menu-r107-css430.jpg) · [CSS1920](../../../../docs/evidence/20261117-menu06/menu-r107-css1920.jpg). [resize중간프레임](../../../../docs/evidence/20261117-menu06/menu-r107-css430-resize-transient.jpg)과 [focus보정전](../../../../docs/evidence/20261117-menu06/menu-r107-phone-before-focus-correction.jpg)은진단본으로보존하며최종결과와구분합니다.


## Warehouse07 조립 기록 · .18 · r146 중간 기준

작성자 codex(단이) · 2026-11-17 01:54 KST · 제안(검수 대기)

문서 담당의 최초 읽기는r137 Warehouse84/전체625·11edges였고, 본체의Info3부품·Tone2판/앵커·연결보완 뒤 **r146 Warehouse89/전체630·4page+3modal·13edges**를 다시 읽었습니다. r146 SHA는 `76821e1f73800edc096aaa2a1c01f4f7937d88d43b504c626e20ba9e6e2c8227`입니다. 이 절은중간저장/제작방법이며 **Warehouse07 최종기기·연결왕복·native탭/키보드·캡처 QA통과나화면완료를주장하지않습니다. 본체후속최종append를우선합니다.** 공통.16/.17·프로젝트guide.4·이전본문은보존합니다.

Warehouse07은새아치그림의상단영역만쓰고nativeSHIELDS/2·동일4슬롯·별도상품/메달M·native9진열함3개·아이콘전용4탭·하단Back을독립부품으로조립하는단위입니다. 새cabinet한장을늘려전체화면/진열함으로쓰지않습니다. Maincash/해적방패·기존footer/Badge를재사용하며SNS재사용은Menu06의사실로Warehouse참조수에더하지않습니다.

[사용법](USER_GUIDE.md#warehouse07-조립-기록--18--r146-중간-기준), [제작값](TOOL_SPEC.md#warehouse07-조립-기록--18--r146-중간-기준), [AI보존규칙](AI_GUIDE.md#warehouse07-조립-기록--18--r146-중간-기준), [구조/접근성](ARCHITECTURE.md#warehouse07-조립-기록--18--r146-중간-기준), [남은검수](PROGRESS.md#warehouse07-조립-기록--18--r146-중간-기준)를따릅니다. 현재저장/482소스결과는기기와연결최종QA가아닙니다.

직접 읽은 근거: [지정0100보고](../../../../docs/collaboration/reports/20261117_0100_warehouse07.md) · [07원본](../../../../docs/reference/monopoly-go/20261116-ten-screens/07_shields.png) · [측정표](../../../../_작업/codex/ux-studio/warehouse07-assembly-quick-sheet.json) · [아트7](../../../../_작업/codex/ux-studio/warehouse-art-assets.json) · [개별상품4](../../../../_작업/codex/ux-studio/warehouse-products-assets.json) · [기하UI12](../../../../_작업/codex/ux-studio/warehouse-ui-assets.json). 새준비23개의production/staging SHA를직접대조했고r142자원읽기에서Warehouse참조신규20개(art4/products4/UI12)·총25고유assetRef를확인했습니다. cash-dice/gift-dice/cash-pack혼합bundle3개는준비됐지만이화면참조에없습니다. 생산/준비/정식등록/참조/실화면검수는구분하며manifest의제작시점미등록표시를현재상태로그대로옮기지않습니다.

[warehouse07-full-tests.log](../../../../_작업/codex/ux-studio/warehouse07-full-tests.log)의본체전체482/482·fail0·cancelled0을문서담당이읽었고본체가exit0을전달했습니다. 이담당의시험/브라우저재실행은0입니다. .17의479는앞단위이력이며이번실검수로합산하지않습니다. 본체전달MainShield클릭진입1건과설정13edges를전체진입/복귀QA통과로확대하지않습니다.

원본07은방패종류만관찰했습니다. 다른3종류본문·Info목적지·실제장착/소유/잠금/해금/가격·카운터게임연동은미확인입니다. 모자/방패/주사위/표정은우리native접근성라벨이며원본에표시된글자라고하지않습니다. 원본폰트/픽셀동등·게임로직·7007/LSB native·사용자승인/freeze는미완료입니다. **W/P/U/S0/4·10장최종동등0/10·제안(검수대기)**, 주간88/90·2026-11-17 08:00 KST 중지선·기존ui30분만유지합니다. 새예약·intake순회·서버기동은하지않습니다.


## Shop08 파일 기준 진행 보정 · .19 · r170

codex(단이) · 2026-11-17 02:45 KST · 제안(검수 대기). r153 Shop26/전체656에서 **r170 Shop115/전체745·8화면·14연결**로진행한저장파일을직접읽었습니다. **실화면미검수이며Shop완료가아닙니다.** 기존.16/.17/.18본문과프로젝트guide.4는보존합니다.

6카드부모는동일156.27×224.98,fill/frame148.19×224.98입니다. Qty/More/Bonus/Price/native문구와dice·리본·입력을분리하고Buy는wrapper+BG+Txt의3부품입니다. Offer1+상품6의7Buy는tintself/engineShadow0·3·3·.25저장값이며7개실제눌림검수라는뜻이아닙니다. Dots5·Info·장식·앵커·메인/메뉴입구·최종QA는미완료입니다.

**02:19사용자계속지시는90%후재개로반영했지만,02:37브라우저자동승인검토는과거90%조건으로7018접근을거절했습니다. 사용자수동차단이아닙니다.** 본체가90%조건해제/7018편집·검수명시승인을async1회요청했고답대기입니다. 답과실제도구허용전브라우저입력/읽기·대체표면/CDP/HTTP관찰우회·외부JSON조립은하지않습니다. 현재는허용된파일준비/로컬검증만진행합니다.

새제품source변경/이번회귀재실행은없습니다.483/483은r146창고의이전소스시험이며r170Shop실검수로쓰지않습니다.09UI8+재사용3/33좌표와10UI6+재사용5/85좌표측정은로컬자원검증·본체contact확인된준비물입니다. **09/10제품UI조립0·10장최종동등0/10·W/P/U/S0/4**를유지합니다. 실제구매/결제·게임/원본폰트·픽셀동등·7007LSBnative·승인미완료입니다. 사용량실조회/계정허용·11/17 08:00KST중지선·리셋/구매금지유지,기존ui30분은본체만관리합니다.

최신저장값은 [제작recipe](TOOL_SPEC.md#shop08-파일-기준-진행-보정--19--r170)와 [남은작업/차단경계](PROGRESS.md#shop08-파일-기준-진행-보정--19--r170)를먼저읽습니다. 자원준비·저장부품수·UI검수완료를구분합니다.

근거: [Shop측정](../../../../_작업/codex/ux-studio/shop08-assembly-quick-sheet.json) · [ShopUI준비](../../../../_작업/codex/ux-studio/shop-ui-assets.json) · [09UI준비](../../../../_작업/codex/ux-studio/racing-ui-assets.json) · [09측정](../../../../_작업/codex/ux-studio/racing09-assembly-quick-sheet.json) · [10UI준비](../../../../_작업/codex/ux-studio/tycoon-ui-assets.json) · [10측정](../../../../_작업/codex/ux-studio/tycoon10-assembly-quick-sheet.json). 실제후속결과는 [본체Shop보고](../../../../docs/collaboration/reports/20261117_0200_shop08.md)의최신절을우선합니다.
