# 카피바라고 로비 정밀 재제작·메인 버튼
codex(단이·2차) · 2026-11-17 14:24 KST · 제안(검수 대기)

결과: 별도 capybara-go 로비 r47, 160부품/1화면/전환0. 하단 선택/비선택 variant·시작 버튼 두께/앞면·상단·이벤트16종을 새 그림으로 재제작하고 메인 버튼 눌림을 native로 적용했습니다. 전체28 UI 구현 완료가 아닙니다.

## 지시 원문
하단 밑판/메시지/상단 디테일, 확대 비교, 모든 실수 가이드 기록, 하단·시작 두께/모양·로비 이벤트 재현. “버튼 처리도 1차 작업과 논의해서 … 만들어봐”의 “베인”을 현중이 “메인 버튼”으로 정정했습니다.

## 읽은 원본·근거
C01 로비 및 C02 선택메뉴 차이, 영상 분석 inventory/connections/44캡처, 독립 스튜디오 AGENTS/guide/최초 인수인계와 현재 native 저장계약, common-layout-tokens.json, visual-review-and-lessons.md, VIDEO_UI_WORKFLOW.md. 원본 캡처는 분석용만 사용, 제품 재사용0. Kpop 보호파일/모노 원본/1차 설계 무접근·무수정. 큰 프로젝트 전체 검색/지도 재생성 대상 변경 없음.

## 변경
- ui-studio/designs/ux-e7ee9590.json: native 조작·파일저장/재읽기 r47. 좌표504×894. nav92+message32+gap20, Start216×80/Front216×72/고정rim. inactive86/active160·선택 제목만 표시. 상단 타이틀32/검은 외곽선·생존13일 native 강조 분리.
- 새 art25종(하단5/이벤트·행동16/HUD4)과 새 스틸 장면·기하 밑판. 원화/v1/v2 보존. 현재 매니페스트39종 중 38종 실제 content-addressed 참조, 미사용 primary-thick 보존. production/staging SHA 불일치0.
- docs/ui/common-layout-tokens.json .4; docs/ui/visual-review-and-lessons.md 추가 실패; 공통 VIDEO_UI_WORKFLOW.md .5/16절. 공통 index/1차 코드·기획 파일은 변경하지 않았습니다.

## 1차 논의·메인 버튼 검수
1차가 공통 opt-in pressFeedback/native inspector/validator를 담당했습니다. 담당이7018 전용 서버 재실행을 요청해 2차 저장 r44 후 업로드/저장을 보류, 담당 완료 회신 후 재개했습니다. 2차가 서버를 실행/재시작하지 않았고7007 무접근입니다. 1차의 전체514/514는 1차 보고이며 2차 재실행 수가 아닙니다.

native 설정: targetGraphic=Front image, pressFeedback.target=FrontGroup, distance3px, shadow #000/.12/x0/y1/blur1. 실제 mouse3초/Space3초 hold에서 y784.746→787.746(+3), release784.746·blur normal 복원. 입력/림 y784.746·h80 불변, 림filter none. tint pressed.741→release hover.949→blur1, shadow도 앞면에만 적용 후 원래 효과 복구. 눌림 시험은 r45, r47은 제목·생존 강조만 변경했고 버튼 계약 유지 확인했습니다.

## 실제 확인·증거
UI Studio 선택 프로젝트→기존 독립 로비→부품별 native 편집→파일 저장/재읽기→저장 미리보기 새로 읽기→실제 버튼 hold/release/blur→1440/430 검사. 최신 r47 CSS1440×900,430×843에서 문서 가로넘침0·이미지71개 실패0·텍스트 가로넘침0. r45 기기 보기390×844/430×932 실측으로 HUD/하단 nav/message/Start 공통 비례 기준선 확인 후 설계 보기 복구. 실기기 safe area 검수는 아닙니다. 상세 실측/화면은 /Users/max/projest_max/ui-studio/samples/capybara-go/docs/collaboration/evidence/20261117_lobby03_r47.

source/JSON 검사: 부품 ID중복0·없는 부모0·pressFeedback 거리3 확인·asset production/staging SHA불일치0. 빌드/공통 엔진 시험을 2차에서 실행하지 않았습니다. 확대 검수용 crop/resize는 증거 이미지에만 수행, 제품 asset으로 등록하지 않았습니다.

## 미확인·판단 필요
실touch/outside cancel/disabled 상태, 원본 폰트 자원 동등성·세부 픽셀 동등성, 다른27화면과 전체 연결은 미완료. Start 눌림은 시각 피드백이며 현재 실행 목적지0으로 전투 진입은 연결되지 않았습니다. 이벤트 그림은 모두 새 제작했으며 원본과 세부 조형 차이가 남아 검수 대기입니다. 사용자가 최종 결정합니다.

## 백업
13:02 원본 precision 백업,14:17 가이드 백업 및 이번 /Users/max/projest_max/ui-studio/docs/planning/_backup/20261117_단이/1424_capy_lobby03_result. 이전 원화/생성 결과/기존 native revisions 보존. 외부 발송·예약·자동 감시·공개 게시·커밋 없음.
