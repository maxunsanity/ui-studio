# 정식 그림·계층/리소스 이름 가이드 .7
작성자 codex(단이) · 2026-11-16 12:59 KST · 제안(검수 대기)

부모가 전달한 최신 사용자 직접 정정 2건과 3D 추가 정정을 기존 가이드에 반영했습니다. 정식 U는 비슷한 콘셉트로 새로 그린 자원, screenshot crop은 관찰/임시 W로 구분합니다. 새 도구 기능·선행 개발·소스·샘플·실제 자원 변경은 하지 않았습니다.

## 지시와 읽은 원본
사용자 원문은 guide/PROGRESS.md:8,10,18에 보존했습니다.

- “분리해서 조립하지 말고 분리해서 조립한 이미지를 새로 그려서 배경을 불투명으로 처리할껀 해서 정상적인 ui로 제작해야...돼..최대한 비슷한 컨셉으로 그리라는 거야..”
- “리소스를 어떻게 정리하는지도 네이밍 규칙 같은것도 중요해..부모 자식 간의 관계에 대한 네이밍 규칙”
- “3d 구간은 일단 비워두고..”, “3d 표시 해서..”

직접 정정은 대표 본체의 배정 메시지로 받았습니다. 루트 AGENTS.md·docs/collaboration/README.md와 현재 .6 가이드의 관련 5문서 및 기존 판/목록을 확인했습니다. 별도 지시함·다른 프로젝트·보호 파일을 읽거나 수신하지 않았습니다. 그림 생성·가공·등록·실화면 검수는 대표 본체가 담당합니다.

## 문서 변경과 계약
기준 guide/는 /Users/max/projest_max/ui-studio/src/tools/uxStudio/guide/입니다.

- TOOL_SPEC.md:45 — 정식 U 그림 제작·이름 계약을 추가했습니다. 필요한 바탕 불투명/외곽 알파, 글자·수량·입력 별도, 역할 접두어·전체 부모/자식 예시, parentId/stable ID·표시 이름 분리, 자원 humanname/원본/가공/등록 hash/manifest 경계를 명시했습니다.
- USER_GUIDE.md:58 — 실제 제작·폴더 정리·등록·저장/재열기·화면 확인 순서와 표시 이름 예시를 추가했습니다.
- AI_GUIDE.md:37 — 정식 그림과 임시 crop 구분, 부모 이름 중복 금지, ID/기존 링크 유지, manifest의 미확인 보존과 새 기능 추가 금지를 추가했습니다.
- ARCHITECTURE.md:75 — authoring·production·등록 풀과 표시 이름/안정 식별자·관계의 경계를 설명했습니다. 자동 스캔/등록기·manifest 로더를 구현했다고 쓰지 않았습니다.
- PROGRESS.md:5 — .7 최신 직접 정정과 위 문서 변경, 본체 제작/실화면 작업의 구분을 추가했습니다. 직전 .6 본문 전체는 그대로 보존했습니다.
- 위 5문서 모두 Page_Board → Slot_3D 단일 빈 영역·표시글 “3D 영역”만·그림/캡처/가짜 보드 없음·2D UI 분리·입력 없음/엔진 미연결을 반영했습니다.
- index.json:2·가이드 7개 헤더를 2026-11-16.7로 동기화했습니다. 문서 수/sections는 기존 7종 그대로입니다. guide/README.md·EXISTING_GAME.md의 판 표기 외 내용과 기존 변환/독립 작업 규칙은 보존했습니다. root README.md·AGENTS.md는 공통판 참조만 .7로 맞췄습니다.

표시 이름은 전달된 Page_Friends/HUD_Top/BG_TopBar 등의 영문 ASCII 역할/의미 표기와 대소문자를 유지합니다. 접두어 Page/Modal/HUD/Group/BG/Frame/Img/Txt/Btn/Input/Badge, 지정 기능 구성명 Currency_Cash·Shield_Group·Avatar_Player를 구분합니다. 자식에 부모 이름 전체를 반복하지 않으며 이름을 바꿔도 ID·parentId·링크를 재생성하지 않습니다.

자원 humanname은 `<scope>_<component>_<role>_<state>_vNNN.ext`, 예시 common_hud-top_bar-bg_normal_v001.png입니다. 필드 사이 밑줄, 필드 안 복합 단어 하이픈을 사용합니다. normal/highlighted/pressed/selected/disabled 중 실제 제작한 상태만 기록합니다. 선택 ui-studio/assets/authoring/<component>/v001/ 원본, production/<component>/ 가공본, assets 루트 sha256 등록 풀을 분리합니다. assets/resource-manifest.json으로 humanname·원본/출처·제작 방식·알파·실제 크기·판·경로·적용 stable ID·등록 hash·미확인을 연결합니다. 실제 manifest 파일이나 새 로더는 이 하위 작업에서 만들지 않았습니다.

## 확인·미확인
문서 검증 명령의 실제 결과는 PASS입니다. index JSON 해석·판 .7·헤더 7개 일치·sections 불변, 5문서의 그림/이름/3D 경계, 파일명 예시의 문법, 기존 PROGRESS 본문 보존, root/개요/기존 게임 규칙의 판 외 불변을 확인했습니다. 근거 resource-naming-validation.json, 전문 전후 diff는 resource-naming.diff입니다. 변경 문서는 10개입니다.

소스 변경이 없어 이번 .7 문서 작업에서 npm test·빌드·서버 재시작을 수행하지 않았습니다. 직전 도구 302/302와 .6 가이드 17/17 기록은 보존 이력이며 이번 재실행으로 합산하지 않습니다. ImageGen·실제 자원 생성/알파/크기/해시 등록·샘플 계층 이름·클릭 링크·저장/재열기·실화면/캡처는 대표 본체의 실제 결과를 따릅니다. 본체 crop r1은 관찰/임시 W, bar/cash/shield 생성·교체는 진행 중으로만 기록했습니다.

프로젝트 .4 가이드 사본·project.json metadata·소스·설계·자원·실제 resource-manifest·STATUS·공용 보고를 이 하위 작업에서 수정하지 않았습니다. 다른 프로젝트·보호 파일·Git·서버·빌드·패키지·예약·감시·외부발송 없음. 새 코드 연결이 없어 이 문서 작업의 코드지도 갱신은 필요하지 않습니다.

## 백업·다음
백업: /Users/max/projest_max/ui-studio/docs/planning/_backup/20261116_단이/1255_resource_naming_manual/

백업 목록 resource-naming-backup.json, 검증 resource-naming-validation.json, diff resource-naming.diff는 이 보고와 같은 _작업/codex/ux-studio/에 있습니다. 다음은 본체의 실제 새 그림 등록·샘플 반영과 검수이며, 문서 예시가 정식 U·전체 샘플·W/P/U/S 통과를 뜻하지 않습니다.
