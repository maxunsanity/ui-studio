# 전체 화면 overlay·실측·명시 컨펌 가이드 .8
작성자 codex(단이) · 2026-11-16 13:22 KST · 제안(검수 대기)

부모가 전달한 최신 사용자 직접 정정 4건과 redline A~J/개별 유닛 가이드 뷰의 구현 중 상태를 기존 가이드에 반영했습니다. 현재 UI 승인을 자칭하거나 승인 스냅샷 문서를 만들지 않았습니다.

## 원본·범위
루트 AGENTS.md·docs/collaboration/README.md, 현행 .7 가이드의 관련 5문서·index 및 판 참조를 읽고 백업했습니다. 사용자 원문은 guide/PROGRESS.md의 .8 절에 보존했습니다. 실측 원본 551×984·306/실패0·확대/계층/가이드뷰 진행 상태는 부모 전달 사실이며 이 하위 작업이 직접 원본 이미지·소스·화면·시험을 검증한 결과가 아닙니다.

## 변경
- guide/TOOL_SPEC.md:71 — Slot_3D를 x/y/w/h=0/0/100/100% 전체 화면 최하층으로 정정. 상단 HUD·우측 이벤트·하단 GO·재화 게이지·BottomNav는 Page_Board의 별도 2D 상위 형제. 중앙 13~97% 박스 해석을 폐기하고 왼쪽은 Img_SNSAvatar SNS 사진 데이터 슬롯으로 정정했습니다. ID/parentId/기존 연결 보존, 빈 3D 표시·입력 없음·엔진 미연결을 유지합니다.
- guide/TOOL_SPEC.md:92 — 원본 px→화면 W/H%→부모% 변환식, 그림/글자 가시 bbox·중심·아이콘 높이/간격/세로 정렬·기준선, 폰트 추정과 원본 설정 미확인을 구분했습니다.
- guide/USER_GUIDE.md:73 / AI_GUIDE.md:46 / ARCHITECTURE.md:84 — 위 구조/측정법과 컨펌 이후 기록 절차를 각 사용/AI/구조 문맥에 반영했습니다.
- guide/PROGRESS.md:5 — 최신 직접 원문·.8 규칙·진행/미확인·기존 기록 경계를 추가하고 .7 이하 본문을 그대로 보존했습니다.
- .8 컨펌 절차: 현중이 특정 버전을 명시적으로 컨펌한 뒤에만 승인 스냅샷 문서 + 기존 가이드의 당시 방법·설정·기록/경로를 남깁니다. 원문/KST 시각/설계 ID·revision/원본 hash/비율 측정값/계층/리소스 판/제작 방법/설정/시험·실화면 근거/미확인·다음을 보존합니다. 이전 승인·시안을 덮어쓰지 않으며 일반 “계속”·현재 규칙 저장은 UI 승인이 아닙니다.
- 기본 캔버스 zoom +/−/Ctrl+wheel·부모/자식 각각 선택/편집·개별 유닛 디자인 가이드 뷰 및 redline A~J 정보→세부 편집은 5문서 모두 구현 중·실검수 대기로 기록했습니다. 구현 파일명이 정해져도 완료로 쓰지 않습니다.
- 기존 7개 가이드 헤더·index·root 판 참조를 2026-11-16.8로 동기화했습니다. guide/README·EXISTING_GAME와 root README·AGENTS는 판 참조만 변경했습니다. 목록은 7종 그대로입니다. 문서 변경은 총10개입니다.

## 확인·미확인·보존
문서 검증 PASS: index 해석·7종/헤더 .8 일치·5문서 규칙/검수 대기 표기·.7 PROGRESS 본문 보존·판 전용 파일의 본문 불변을 확인했습니다. 근거 fullscreen-overlay-approval-validation.json, 전문 전후 diff는 fullscreen-overlay-approval-guide.diff입니다. bbox 실측값이나 폰트 원본 설정은 창작하지 않았습니다.

소스·설계·실측표·실제 그림/manifest·project .4 guide 사본/metadata·STATUS·공용 보고·원본 ux-902404d6 r4/ux-gjs-61ad2d1f r14는 수정하지 않았습니다. 문서만 변경하여 시험·빌드·서버·패키지·Git·예약·감시 작업은 하지 않았습니다. 이전306/0·302/302·17/17을 이번 실행이나 새 기능의 검수로 합산하지 않습니다. 다른 프로젝트·보호 파일 접근과 추가 에이전트 생성 없음. 실제 새 기능 결과·측정/실화면 검수는 대표 본체가 후속 갱신합니다.

## 백업
/Users/max/projest_max/ui-studio/docs/planning/_backup/20261116_단이/1319_fullscreen_overlay_approval_guide/

백업 목록 fullscreen-overlay-approval-backup.json과 보고·diff·검증 JSON은 모두 _작업/codex/ux-studio/에 보존합니다.
