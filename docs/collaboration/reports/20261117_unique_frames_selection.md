# 남은 UI의 고유 프레임 선별
작성자 codex(단이) · 2026-11-17 20:09 KST · 제안(검수 대기)

## 지시 원문
현중: “비슷한건 만들지 말고 완전 다른 프레임을 가진것만 추려봐”

## 시작 범위
현재 r335/14화면1144부품22연결과 원본 영상 목록을 비교합니다. 이전17미착수 기능분류를17개새프레임으로세지않습니다. 같은판틀의그림/문구/값/색/상태교체·반복행·Close위치variant는재사용합니다. 이번에는선별/계획/가이드만기록하며새제품UI/그림/소스/저장설계를변경하지않습니다. 2개읽기전용에이전트가행사/보상8종,프로모션7종을분담하고본체가쇼룸상세/보고서2종을비교합니다.

## 2026-11-17 20:18 KST 선별 결과
- 미착수17내용분류를기존14화면과대조해고유프레임후보3·유사/연출14제외. 선별은제안(검수대기)입니다.
- 남김: 쇼룸토큰확대상세(MGV02-S04-B),클래스업그레이드/혜택(MGV09-S12),콩나무노다지획득안내(MGV09-S11). 원형받침/캐릭터의3D장면을새UI틀로세지않았으며첫후보도순수명판/입력구조를분리해독립검토했습니다.
- 요정행운/티타임저축/겨울선택은Shop카드,숲할인/GOCHAT/현금부스트/잭소개는Racing포스터,부티크/퍼스트클래스는Tycoon,보드보고서는Friends타임라인으로재사용분류. 보드완료는별도판틀없음,환영/보드러시/현금보상은보상연출패턴으로통합기록. 재사용/통합이기능·연출이미구현완료라는뜻은아닙니다.

### 원본/독립검토
본체가쇼룸상세/보드보고서/기존Friends·Shields·Racing·Tycoon·감옥/보석금및남김후보/겨울/부티크crop를직접view_image로보았습니다. frame_offers가7종+기존4원본을,frame_rewards_events가8종의안정/상태13crop+기존4원본을실제확인했고추가쇼룸상세와Shields2원본으로3번째후보도독립검토했습니다. 하위쓰기/제품변경0. 기준/17개판정/정확원본경로는unique-frame-selection.json(selection17행)에보존했습니다. 원본Unity계층·실제scroll/트리거는추정하지않았습니다.

### 바꾼 문서
- docs/reference/monopoly-go/video-analysis-20261117/unique-frame-selection.json/html:3대표/14제외·원본3이미지비교문서.
- 같은폴더implementation-progress.json/missing-ui-plan.json:과거queue/원본분류수를보존하고activeProductionScope에3프레임만새제작대상으로기록. 기존17미착수를17개신규틀해야할일로읽지않도록표시.
- 내장guide FRAME_SELECTION.md/index13번째문서·버전.31,COMMON_UI_TOKENS의프로젝트policy,AI_GUIDE/TOOL_SPEC/PROGRESS/COMMON_UI_RULES/README/루트AGENTS에최신범위보정. 기존projectguide.4/과거판보존.
- 영상목록index상단에범위변경과새비교문서링크,내장public에동일사본반영. 제품JS/CSS/native설계/이미지자원변경0.

### 실제 확인
- 7018의unique-frame-selection.html 실제열기:선별3카드/3원본img·실패0/14제외행. DesktopCSS[1600, 900]·원본캡처[1977, 1125], mobileCSS430×843에서가로넘침0.
- 독립상세편집새검수탭→가이드→‘가이드문서’→FRAME_SELECTION.md:공통.31/13문서·14제외본문/넘침0확인. 검수탭닫기,비교문서는deliverable로보존. 데스크톱Mac네이티브시험이아닌IAB실제브라우저확인입니다.
- python3 _작업/codex/ux-studio/unique-frame-selection31/verify_selection.py: 61검사통과. 선택수/원본경로17개/공개사본4개/guide13타겟/HTML링크/설계SHA/실측증거확인. 제품소스변경없어npm전체재실행하지않음;538은이전r335구현시험기록.
- 현재r335/14화면1144부품22연결/설계SHA b651bea0f3b52bfd71a090372d75789b2d894ff95ba52f7efee3475dba9c1e1a 보존. 새UI·그림0/이번실제게임연결0/7007서버·접근·build0/예약0/uiPAUSED/다른프로젝트수정0/commit0.
- 증거 docs/evidence/20261117-unique-frame-selection/{reference-selection-desktop.jpg,browser-qa.json,file-verification.json}. 보고동명JPG도보존.
- 백업 /Users/max/projest_max/ui-studio/docs/planning/_backup/20261117_단이/201243_unique_frame_selection31. 이번source폴더/import관계변경0으로코드Graphify갱신대상아님.

### 다음과미확인
다음신규프레임대상은위3종만입니다. 같은틀의다른그림/문구/가격/색/상태/반복카드를새화면으로계속만들지않습니다. 기존미완료와원본자료는삭제하지않으며분모/완성으로바꾸지않습니다. 3종은아직선별결과로새설계·그림·동작검수는제작전입니다. W/P/U/S0/4·원본최종동등0/10은그대로이며이번선별을3종완료로세지않습니다.
