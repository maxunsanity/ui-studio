# 상세 편집 기기 비례 표시 보완

작성자 codex(단이) · 2026-11-16 17:43 KST · 제안(검수 대기)

## 원인과 변경

대표 본체의 실제 검수에서 상세 편집 기기390×844의 preview-canvas는 실제390×844였지만 fixed HUD_Top536×94/HUD_Bottom551×280을 같은 논리 크기로 렌더해 오른쪽이 넘쳤습니다. 전체 캔버스는 이미 폭 기준 device scale을 사용했습니다. 원본 main.mjs의 rootSize/renderPreview가 기기 크기를 직접 논리 좌표로 쓰는 것을 확인했습니다.

제품 소스는 `src/tools/uxStudio/main.mjs` 한 개만 수정했습니다. 공통 DEVICE_PROFILES/canvasDevicePreview를 가져와 기존 기기 ID를 유지하고430 프로필을 재사용합니다. detailDevicePreview는 편집·동작 시험의 실제 배경 page를 기준으로 합니다. rootSize는 logical viewport를 반환하고 overlay 비율은 기존 계약을 유지합니다.

551×984 설계의 phone390×844는 logical551×1192.4205, deviceScale390/551로 렌더합니다. px 크기 글자·고정 HUD·그 안의 정사각 부품은 균일 비례를 유지하고 %·아래쪽 앵커는 달라진 logical height에서 다시 배치됩니다. 원본 logicalSize는551×984 그대로입니다.

편집 확대와 device 배율을 분리했습니다. dataset.zoom은 편집 확대, dataset.deviceScale은 기기 배율, 기존 dataset.scale은 두 값의 곱으로 기존 pointer/editor·viewMemory·zoomAnchor 계약을 보존합니다. canvas/attachEditor/guide/quick 수치는 같은 logical viewport를 사용합니다. fit/프레임 표시 크기는 실제 기기 크기를 사용합니다. 확대 버튼·키보드·휠은 dataset.zoom을 사용하여 device 배율을 두 번 곱하지 않습니다. 선택 맞춤은 device 배율을 반영하고 휠의 포인터 기준은 총배율로 유지합니다. 프레임 이름의 '설계 기준'은 저장된 원본 치수입니다. 보기 변경은 dirty/Undo/선택/저장 문서를 수정하지 않습니다.

기존 editor.mjs는 이미 dataset.scale로 pointer delta를 나눠 논리 좌표로 변환하므로 수정하지 않았습니다. CSS·공통 모듈·consumer·preview.mjs·샘플 JSON도 수정하지 않았습니다.

## 시험

RED: main-design-size 시험에서 phone rootSize.width가390(기대551), 실제 renderPreview canvas.style.width가390px(기대551px)로 실패하는 것을 확인했습니다. GREEN 이후 새6개 시험은 실제 main 함수와 공통 API, 실제 attachEditor를 사용합니다.

확인한 새 시험: fixed HUD 폭과 아래끝/정사각 비례, 편집100%/200%/fit와 실제 표시390×844/780×1688, 총배율로 pointer 논리10% 이동 및 release1회 commit, 휠 포인터 고정과 배율 중복 방지, 확대 버튼/키보드/선택 맞춤, 가이드의 같은 logical height와1회 Undo·원본 크기/선택 보존.

관련14개 파일 **82/82 통과**, main.mjs node --check exit0입니다. 기존 anchor/responsive/guide/논리크기/속성편집/save/workspace 및 catalog consumer dependency closure를 포함합니다. 정확한 명령과 로그는 `_작업/codex/ux-studio/detail-device-scale-tests.log`입니다. 전체 npm test는 대표 본체가 마지막에 실행하며 이 하위 작업에서는 실행하지 않았습니다.

실화면은 대표 본체 수행 범위입니다. 본체가 전달한 결과: phone390/100% actual389.993×843.993, style551×1192.42, dataset.scale0.7078039927404719/zoom1, HUD_Bottom389.993×198.181로 화면 오른끝과 일치, HUD_Top379.378×66.525,4개 메뉴56.62×65.112 동일. 확대+후zoom1.2/scale0.8493647912885662, 축소후zoom1/scale0.7078039927404719 복귀.430×932는 actual429.993×931.993/logical551×1194.26, 저장r21 유지입니다. 이 숫자는 하위에서 직접 브라우저를 재검수한 기록이 아닙니다.

## 미확인과 범위

standalone preview.mjs는 저장된 entry.logicalSize(또는 legacy designBasis)를 기준으로 브라우저 폭에 uniform fit합니다. 별도 기기 profile 선택 메뉴와 기기 높이에 따른 logical viewport reflow는 현재 없습니다. 상세 편집/전체 캔버스의 기기 선택과 같은 지원을 주장하지 않습니다. 일반 소비자 API에 임의의 논리 크기를 강제로 적용하지 않았으며 실행 게임의 크기는 기존 host 계약입니다.

직접 브라우저/실제 폰/그림·이미지 픽셀 검수·서버 재시작·빌드·패키지 설치·외부 앱·7007·사용량 조회·예약 변경은 수행하지 않았습니다. 공용 STATUS/보고/가이드/원본 설계는 수정하지 않았고 커밋하지 않았습니다.

## 백업

`docs/planning/_backup/20261116_단이/173438_detail_device_scale/`에 수정 전 main.mjs/canvas-device-preview.mjs/main-design-size.test.mjs를 보존했습니다. 실제 수정한 시험은 main-design-size.test.mjs 하나입니다. 모든 결과는 현중 검수 대상입니다.
