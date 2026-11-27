# 공통 UI 규격·제작 규칙
가이드 판: 2026-11-17.22 · 원칙 사용자 승인 / 수치·시안 제안(검수 대기)

규칙은 이 문서, 수치는 [COMMON_UI_TOKENS.json](COMMON_UI_TOKENS.json) 한 곳을 정본으로 읽습니다. JSON은 native 제작의 참조 데이터이며 자동 적용 엔진을 새로 구현한 것이 아닙니다. 기존 가이드와 관찰 screenshot의 개별 좌표보다 최신 공통 profile/family/variant를 우선합니다.

## 먼저 정하고 제작하기

1. 최신 사용자 지시와 프로젝트/workspace 범위를 확인합니다.
2. 프로젝트 logical basis·safe area를 정하고 같은 family의 outerBox·iconBox·text·line·badge를 정의합니다.
3. 내용/위치 차이는 명시 variant로 나눕니다. 같은 family 크기·기준선을 화면별 screenshot 측정으로 덮어쓰지 않습니다.
4. native 부품은 토큰을 참조해 만들고 실제 저장·기기별 일관성·입력을 검수합니다. 모르는 token은 null/확인 대기로 남기며 0이나 임의 값으로 채우지 않습니다.

Screenshot/영상은 구성·모티프·관찰 문구의 근거입니다. 다른 화면에서 작게 보인다는 이유로 같은 variant의 wrapper·폰트·기준선을 바꾸지 않습니다. 새 예외가 필요하면 이유와 token/variant 변경을 먼저 기록합니다.

## 현재 프로젝트 프로필

모노폴리의 footer/header/cash/메뉴·배지·구분선·위치 variant는 JSON의 `profiles.monopoly-go`를 따릅니다. 같은 footer는 선택 title 유무와 관계없이 line/Close 중심을 공유하고, Main/Shop/Build header는 공통 외곽과 cash 화면 기준을 공유합니다. SNS 유무에 따른 bar-local 좌표와 Build level/우측 슬롯은 선언된 내용 variant입니다.

Tycoon floating Close, Racing 우상단의 의도한 별도 원형 장식, Album 좌상단 Back은 위치 variant입니다. 전부 하단 X로 강제하지 않습니다. badge는 지정된 장식 영역이 hit 밖으로 나갈 수 있지만 HUD 안에 남고 hit 크기를 늘리지 않습니다. glyph box와 native font size/line height는 별도 토큰입니다.

공통 원칙은 사용자 승인입니다. **숫자·색·개별 시안은 본체 제작 제안이며 사용자 최종 컨펌 기록은 없습니다.** 본체는 현재 같은 footer/header의 실측 일치와 모바일 footer의 투명 hit/넘침·이미지·각 Close 복귀를 확인했습니다. 문서 담당의 브라우저 재실행이나 최종 전체 동등성 승인은 아니며, 최종 캡처/검증은 [본체 보고](../../../../docs/collaboration/reports/20261117_0953_tycoon10_native.md)의 후속 기록을 따릅니다.

카피바라고는 [자체 token 파일](../../../../samples/capybara-go/docs/ui/common-layout-tokens.json)을 사용합니다. 모노폴리 숫자를 복사해 강제하지 않으며 두 프로젝트의 설계/자원/탭 소유는 독립입니다. [영상 UI 절차](VIDEO_UI_WORKFLOW.md)와 기존 모든 영상 안내는 함께 유지합니다.

## 그림·입력·배경 분리

- 불필요한 불투명 바탕이 붙은 icon/×를 쓰지 않습니다. native label 또는 실제 투명 자원을 사용하고 production 파일의 RGBA·바깥 alpha·실루엣을 직접 봅니다. alpha 채널 존재만으로 투명하다고 판정하지 않습니다.
- 의도한 panel/컨테이너 BG·fill9/frame9·원형 장식은 별도 부품입니다. container 배경과 불필요한 glyph 뒤 바탕을 구분합니다. 공통 footer hit는 투명이며 명시된 Racing disc 같은 장식 예외는 토큰에 남깁니다.
- 외부 cast shadow는 엔진 효과, 글자·수량·가격·닉네임은 native text로 분리합니다. 원본/master·생성 프롬프트·alpha/crop·production/staging/등록 SHA를 보존합니다.
- 이름 변경/참조 해제/정규화로 stable ID·부모·유효 연결·원본 파일을 불필요하게 지우지 않습니다. pointer와 keyboard·초점을 함께 검수합니다.

## 잘된 방법과 실패 해결을 공유하기

|경험|재사용할 방법·경계|
|---|---|
|화면마다 다른 기준선|token/family/variant·부모·앵커를 먼저 비교하고 공통 규격으로 고칩니다. 새 screenshot별 예외를 쌓지 않습니다.|
|compound Footer 안에서 분해가 안 보임|ButtonID/Close edge를 기록하고 잠시 screen root로 옮겨 기존 split을 실행합니다. 새 생성 BG/빈 image/frame만 정리한 뒤 Footer 재부모/공통 rect와 입력·Undo·저장을 확인합니다. 원본 asset 삭제/소스 확장이 아닙니다.|
|복제 Close와 가려진 입력|복제 edge를 먼저 확인하고 중복 연결을 만들지 않습니다. reparent는 형제 순서를 바꾸지 않으므로 native 앞순서와 실제 클릭을 봅니다.|
|일반 수치 fill이 model에 미반영|현재 AX setValue→Tab 후 재표시/저장값을 확인합니다. rectPx는 명시 수치 적용 버튼이 있는 별도 경로입니다.|
|도구 성공 반환과 실제 결과의 차이|file chooser 호출이 성공해도 native 등록은 미반영일 수 있습니다. AX 경로 입력 뒤 실제 이미지/assetRef·저장·화면을 확인합니다. 로그/메타 성공을 후속 단계 성공으로 확대하지 않습니다.|
|영상 메타 성공/프레임 실패|Swift 메타 읽기와 ImageGenerator 실패를 구분합니다. 새 설치 없이 검증한 ffmpeg 실행 파일은 [디코더 인수 문서](../../../../samples/capybara-go/docs/reference/video-decoder-handoff.md)를 따르며 BlueStacks 앱을 조작하지 않습니다. 다른 코덱/영상은 별도 검증합니다.|
|캡처 이름/요청 크기와 실제 대상 불일치|실제 popup·안정 opacity/loading·측정 CSS와 PIL 픽셀을 확인하고 다른 대상/잘린 중간본은 최종 근거에서 제외합니다.|

세부 근거는 [native helper](../../../../_작업/codex/ux-studio/browser-ui-helpers.mjs), [Racing 기록](../../../../docs/evidence/20261117-racing09/browser-checks.json), [Tycoon 기록](../../../../docs/evidence/20261117-tycoon10/browser-checks.json), 영상 안내의 추출 도구 경험을 따릅니다. 도구 반환→파일 생성→workspace 등록→설계 참조→저장/재열기→실제 화면을 별도 단계로 확인합니다.

## 수락 검수와 규칙 승격

같은 family의 논리 rect/폰트/배지·앵커를 파일로 대조하고 실제 기기에서 공통 기준선·투명 배경·pointer/키보드/초점·scroll/고정·넘침·이미지·Undo/기존 ID·연결 보존을 봅니다. CSS viewport와 파일 픽셀을 따로 적습니다. 정적검사/소스시험/HTTP/실화면/사용자 컨펌은 합산하거나 서로 대신하지 않습니다.

새 경험은 실패/성공, 원인 상태(가설/관찰/검증), 수정·방법, 근거, 한계와 컨펌을 기록합니다. 두 담당이 지식만 공유하고 본체가 중복/충돌을 정리합니다. 사용자 특정판 컨펌 뒤 해당 token/시안의 승인 상태를 올리고 정본 version을 갱신합니다. 요청을 받았거나 공통 문서에 등록했다는 사실만으로 개별 숫자·시안이 승인된 것은 아닙니다.

현재 작업은7018만이며7007 접근/반영/목록/카드/검수는 제외입니다. 기존ui PAUSED·명시 usage 상한 해제·새 시한/상한/예약 없음·리셋/구매 금지를 유지합니다. 기존 source 시험 기록은 새 코드 추가/재실행으로 쓰지 않습니다. 원본 폰트·게임 API·시각 동등/최종 사용자 승인 미완료와 W/P/U/S 및 전체 동등 검수 경계는 본체 최신 기록을 유지합니다.
