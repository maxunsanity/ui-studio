# 전체 캔버스 기기 미리보기

작성자 codex(단이) · 2026-11-16 16:58 KST · 제안(검수 대기)

사용자 요청: “화면사이즈비례반응형도”, “UI스튜디오모바일화면사이즈결정메뉴없다작업하면서추가”, “계속진행”. 대표 본체가 위임한 전체 캔버스 보기 설정 범위입니다.

## 결과와 근거

- `src/tools/uxStudio/canvas-device-preview.mjs`: 공통 DEVICE_PROFILES는 기존 design/phone/fold/tablet/short ID와 값을 보존하며 phone430을 추가합니다. validateDevicePreview는 기기·방향·1~10000px 정수 크기를 검증합니다. canvasDevicePreview(screen,settings)는 reference/device/logical/scale을 반환하고 actual logical viewport에서 모든 %/앵커 결과의 양수 크기를 확인합니다. canvasDeviceStyles는 화면의 logical width/height와 균일 transform을 제공합니다.
- 기본 scale=deviceWidth/referenceWidth, logicalWidth=referenceWidth, logicalHeight=deviceHeight/scale입니다. 화면 높이가 달라져 % 높이와 아래쪽 앵커가 실제 재배치됩니다. px 글자·고정 앵커 크기·그 안 정사각 아이콘/배지는 같은 배율로 표시됩니다.
- `grapes-pilot.html:25`: 기기, 방향, 직접입력 너비/높이, 기기 미리보기 설명을 추가했습니다. 360×640 / 390×844 / 430×932 / 690×844 / 768×1024 / 설계 기준 / 직접 입력을 제공합니다. 정보는 “390×844 · 설계 기준 유지 · 71% 비례” 형식입니다. 내부 logical viewport는 펼침 설명에만 표시합니다.
- `grapes-pilot.mjs:71`: workspace scopedKey ux-studio.canvas-device.v1의 보기 설정입니다. 설계 logicalSize·원본 ID/parent·이름·글자·이미지/연결을 바꾸지 않으며 모델트리를 재생성하지 않습니다. 현재 편집·선택·Undo를 유지하고 UndoManager.skip으로 board 스타일을 갱신합니다. 제목은 역배율로 유지합니다. extent/focus/전체맞춤은 실제 기기 크기를 사용합니다. 수동 편집 확대율은 유지합니다.
- `grapes-pilot.mjs:232`: 과거 board style Undo가 옛 기기 크기를 되살리는 vendor 동작을 재현했으며 undo/redo 후 현재 보기 설정을 skip으로 재적용합니다. 기존 stage를 읽어도 현재 기기 보기 설정을 재적용합니다.
- `grapes-drag.mjs:3`: startPartDrag의 6번째 인자 {scale}로 device 배율을 전달합니다. iframe pointer deltas를 deviceScale로 나눠 부모 %를 계산합니다. 편집 zoom은 iframe 좌표에서 이미 분리되어 중복 보정하지 않습니다. 앵커 부품의 직접 드래그 비활성 정책은 유지합니다.
- 디자인 가이드 열기와 applyDesignGuideChange에 현재 preview.logical 크기를 넘깁니다. 실제 보이는 부모 영역으로 %/앵커를 편집하고 저장된 logicalSize는 보존합니다.

## 확인

TDD RED: 새 모듈 부재와 기존 drag의 배율 오차를 확인했습니다. 실제 vendor에서 옛 board style Undo가 preview 높이를 되돌리는 경로도 RED 재현 후 보완했습니다.

관련 9개 파일 시험 39/39 통과: canvas-device-preview, grapes-device-preview, grapes-drag, grapes-individual, grapes-guide-edits, grapes-vendor-undo, grapes-fit, grapes-canvas, responsive-layout. 전체 시험은 대표 본체 담당으로 실행하지 않았습니다. 명령과 결과: `_작업/codex/ux-studio/canvas-device-preview-tests.log`.

`node --check` canvas-device-preview.mjs / grapes-pilot.mjs / grapes-drag.mjs 모두 exit 0입니다. 실제 vendored Grapes 0.23.9 모델·UndoManager로 미저장 text/percent geometry, 동일 모델/선택, 편집 zoom75%, 기존 Undo/Redo, stage 왕복, invalid 사전 거부를 확인했습니다. 가이드의 변경 기기 높이 기준 % 변환과 저장 logicalSize 불변을 확인했습니다.

## 미확인·범위

- 실제 1440/430px 브라우저 UI·이미지·overflow·pointer 검수는 대표 본체 담당이며 이 하위 작업에서는 수행하지 않았습니다. 이 보고의 자동 시험을 실화면 검수로 표현하지 않습니다.
- %만으로 작성한 정사각형은 자유로운 부모 종횡비 변화에서 고정 정사각을 보장하지 않습니다. 샘플의 HUD 고정 앵커 부모 구성은 대표 본체의 실툴 작업이며 이 작업은 샘플 JSON을 수정하지 않았습니다.
- 상세 편집과 consumer의 기존 동작은 수정하지 않았습니다. 공통 registry의 상세 편집 연결은 대표 본체 담당입니다. 이 기능만으로 소비 실행기와 모든 기기의 반응형 완성을 주장하지 않습니다.
- main/model/render/consumer/CSS/가이드 소스/HTML route 버전 쿼리/서버/7007/외부 앱은 수정하지 않았습니다. 새 패키지·빌드·서버 실행 없음. 공유 STATUS/보고는 하위에서 수정하지 않았습니다.
- 파일 추가/import 연결이 있으므로 프로젝트 지도 갱신 필요 여부는 대표 본체가 기존 정본 담당 범위에서 판단해야 합니다.

## 백업

`docs/planning/_backup/20261116_단이/164934_canvas_device_preview/`에 수정 전 3개 소스와 기존 3개 관련 시험을 상대 경로대로 보존했습니다. 신규 파일은 원본이 없습니다.
