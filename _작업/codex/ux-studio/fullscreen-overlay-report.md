# 전체 화면 투명 공통 UI 루트 · v4 공통 정의 생성 보완

작성자 codex(단이) · 2026-11-16 19:37 KST · 제안(검수 대기)

## 원인·계약

원본02_wins.png/승리 조립표와 실제 main/consumer/Grapes·presentation 검증·CSS를 먼저 확인했습니다. 기존 modal은551×984 기준90%×48%=495.9×472.32이고 전체 화면 설정이 없었습니다. 별개 실제 결함으로 bind-overlay의 새 공통 정의 생성에는 v4 필수 logicalSize가 없어 생성 후 저장이 막혔습니다. 본체는 미저장 생성을 Undo하고 원본r43 내용과 같은r44를 저장한 후 소스 변경을 허용했습니다. 하위에서 실제 설계 JSON은 열거나 수정하지 않았습니다.

새 optional enum은 `presentation.rootMode: 'window' | 'fullscreen'`입니다. 없으면 기존 기본 창입니다. fullscreen만 backing page 전체를 자식 배치 기준으로 쓰며 루트 skin/백판·border·외부shadow·padding을 표시하지 않습니다. 속성에 임의 CSS나 미검증 치수를 저장하지 않습니다. 자식 clipboard/footer9slice·이미지·native text는 별도 부품으로 조립합니다.

## 바꾼 것

- units.mjs의 presentation 검증에 optional enum만 추가했습니다. v1~4 schema/version을 올리지 않고 미설정 문서의 필드도 만들지 않습니다.
- overlay-runtime.mjs의 `overlayRootSize(screen,basis)`는 기존 기본창 비율 또는 fullscreen 전체 logical 크기를 계산합니다. `overlayBoardScreen(document,screen,entryId?)`는 전체 캔버스에서 entry page 참조를 만드는 비파괴 뷰이며 저장 logicalSize/ID/부모를 바꾸지 않습니다.
- layout-view.mjs의 `applyOverlayRoot(node,screen,options)`가 main edit/play와 consumer의 같은 투명 루트 표현을 담당합니다. fullscreen을 끄면 기존 skin과 CSS 창 크기를 복원합니다. 루트는 pointer-events:none, 직접 자식 UI는 기존 frame 장식 역할을 제외하고 auto로 받습니다. backdrop의 기존 blocking/dim이 빈 공간 정책을 담당합니다. full-root 자체가 새 배경/딤을 만들지 않습니다.
- main의 공통 연출에 **내용 루트 → 기본 창 / 화면 전체 · 투명 UI 루트**를 추가했습니다. 선택은 기존 시연 설정이며 **선택 버튼 동작을 이 연출로 지정**할 때 저장합니다. **공통 내용·배치 편집**에서 자식을 편집합니다. 저장된 모달을 선택하면 현재 rootMode를 폼에 읽고 기본 조회로 문서를 바꾸지 않습니다.
- main.rootSize·실제 drawOverlay·편집 overlay·consumer·Grapes 전체 캔버스에 같은 전체 viewport 기준을 연결했습니다. 상세/실행은 실제 backing page, 전체 캔버스는 현재 entry page입니다. device preview에서는 같은 공통 logical viewport/균일 scale을 사용합니다. 저장한 modal.logicalSize를 보기 설정으로 덮지 않습니다.
- bind-overlay의 신규 공통 정의는 **v4에만 source page의 저장 logicalSize**를 별도 객체로 상속합니다. 예551×984이며390×844 기기나551×1192 재flow는 상속하지 않습니다. 기존 v1~3는 logicalSize 부재/기존 schema·revision을 유지합니다. 기존 정의의 rootMode를 바꿀 때 blocking/dismissOnEscape/closePolicy 등 다른 정책을 보존합니다.
- 현재 CSS ux-scale은 scale(.88)→scale(1)이며 중앙정렬 translate(-50%,-50%)가 없습니다. fullscreen은 inset0/100% 크기이고 transform을 덮지 않아 fade/scale/slide 연출을 유지합니다. 기존 engine focus/Escape/close·단일dim/backdrop을 그대로 사용합니다. 자동 X를 새로 만들지 않으며 isDemo의 보조 닫기만 기존 코드입니다.

## 텍스트 외곽선 소규모 연결

부모의 추가 배정으로 main.typographyPanel에 **글자 외곽선 두께 px**(number,0~12,빈값 기본 유지)·**글자 외곽선 색**(color)만 더했습니다. 현재 main은 numeric 목록 대신 input.type=number 공통 변환 경로가 있으므로 기존 Number 변환/빈값 삭제/검증/Undo 경로를 그대로 사용했습니다. 독립 parts 담당이 typography.strokeWidth/strokeColor의 optional 검증과 webkitTextStrokeWidth/Color·paintOrder를 구현했습니다. 하위는 parts.mjs를 편집하지 않았고 글자를 이미지에 굽지 않았습니다.

## 확인

RED: optional 값 거부 부재, full-root 표현/API/UI 부재, v4 실제 공통 정의의 logicalSize 누락을 재현했습니다. 또 모드 재지정 시 기존 close 정책이 사라지는 경로를 RED 확인 후 병합 저장으로 보완했습니다.

관련20개 시험 파일 **147/147 통과**, main/units/overlay-runtime/layout-view/consumer/grapes-pilot **문법6개 exit0**입니다. 명령·출력은 `fullscreen-overlay-tests.log`입니다. 전체 npm test는 실행하지 않았습니다. parts 담당의15개 시험은 이147에 포함되며 중복 합산하지 않습니다.

새/확장 검증은 optional 값·기존 기본창, 투명/무백판/무테두리·skin 복원·자식/원본 불변, 실제 main handler의 v4 생성→open/close 연결→fixture r44 expected44 원자저장r45→재열기, v1~3 유지, 다른 정책 보존, 전체화면의 상세551×984/phone viewport, 실제 consumer DOM의 단일 overlay·배경 차단·Escape/close·내부list.scrollTop141 유지, 실제 vendored Grapes의 viewport/기기/stage 왕복·Undo 추가0, native text 두께 숫자/색·빈값 삭제·잘못된 값 rollback을 포함합니다. 기존 frame/source/연결/배지/control·guide·카탈로그 consumer dependency closure 회귀도 통과했습니다.

CSS 픽셀·애니메이션 실화면·실제 폰·최종 제목 색/두께·원본동등성은 본체의 명시 reload 후 검수입니다. 하위는 브라우저/UI·샘플 JSON·guide·공용 보고/STATUS·서버/예약/빌드·패키지 설치·사용량 조회를 수행하지 않았습니다. 새 제품 모듈은 없고 기존 모듈 export/import만 연결했습니다. 새 모드의 Sidebar/Popup은 fullscreen 자식으로 조립 가능하지만 전용 새 유형/자동 게임 어댑터를 만든 것은 아닙니다.

## 백업·안정화

`docs/planning/_backup/20261116_단이/192604_fullscreen_overlay_root/`에 제품7파일과 기존 main-design/control-visual 시험을 수정 전 보존했습니다. 추가 vendor fixture의 변경 전 내용은 이 작업의 패치를 역적용한 `grapes-device-preview.prechange-reconstructed.test.mjs` 복구 사본으로 별도 표시했습니다. 새 전용 시험은 원본이 없습니다. 커밋하지 않았고 제품 소스 쓰기는 안정화 완료했습니다. 최종 결정은 현중 검수 대상입니다.
