# HUD 네이티브9슬라이스 바탕·테두리 자원

작성자 codex(단이) 하위 작업 · 2026-11-16 14:16 KST 확인 · 제안(검수 대기)

## 지시·원본
사용자 “박스9 리소스 가변 원칙을 기존 엔진 확인 후 다시” 정정을 대표 본체가 전달했다. 본체가 지정한 원본 가시 y16~70·461×54 HUD·크림색 #f0ebdb·흰색4px 테두리를 제작 근거로 받았다. 이 하위 작업에서 원본 화면을 다시 실측한 값은 아니다.

src/tools/uxStudio/skins.mjs의 SKINS.backplate/topMenu·applySkin·validateSkin과 내장 guide의3/9슬라이스 고정폭 계약을 읽었다. 이미 있는 border-image용 자원만 만들고 엔진·UI 소스·설계·기존 자원을 수정하지 않았다. imagegen을 사용하지 않았으며 프롬프트 기반 생성물이 아니다.

처음 임시 제안 slice28/edge27은 코너 배율이27/28이 된다고 본체에 알렸다. 본체의 최신 정정 “slice27/edge27로 정확1:1, 모서리 불변 우선”을 적용했다. 이전28 제안은 폐기한다.

## 제작 방식
128×64 투명 캔버스에 외곽 반경27px인 rounded rectangle을 결정적 벡터 기하로 작성했다. 바탕은 #f0ebdb 단색 채움만, 프레임은 흰색4px 선만 있고 가운데는 투명하다. 별도 그림자·후광·그라데이션·배경은 없다.

- SVG: fill은 rect width128 height64 rx27. Frame은 x2/y2 width124/height60 rx25·stroke4·fill none으로 바깥 반경27과 선의 캔버스 안쪽 배치를 맞췄다.
- PNG: Pillow11.3의8배 해상도 기하 raster→LANCZOS128×64. 프레임은 외곽 흰 rounded rectangle과4px 안쪽의 투명 rounded rectangle으로 만들었다. SVG를 다른 렌더러로 읽어 PNG로 변환한 것은 아니며 같은 기하를 별도로 래스터화한 것이다.
- WebP: PNG→lossless/exact 형식 인코딩. PNG/WebP 크기와 RGBA 전체 픽셀 값이 같다. 알파만 같고 RGB가 손실인 v003과 구분한다.

제작 스크립트: _작업/codex/ux-studio/make-hud-top-9slice-v004.py. 생성 경로가 이미 있으면 중단하며 기존 자원을 덮어쓰지 않는다.

## 파일과 추천 설정

|자원|authoring stem|SVG|PNG|WebP|
|---|---|---:|---:|---:|
|크림색 바탕|common_hud-top_bar-fill-9slice_normal_v001|146B|1776B|662B|
|흰색 테두리|common_hud-top_bar-frame-9slice_normal_v001|189B|1282B|658B|

원본 SVG/PNG: samples/monopoly-go/ui-studio/assets/authoring/hud-top/v004/

등록용 WebP: samples/monopoly-go/ui-studio/assets/production/hud-top/

실제 UI용 import 사본: src/tools/uxStudio/assets/import-staging/hud-top/

두 자원의 실제 sourceSize는 [128,64]이며 가시 alpha bbox는 모두 [0,0,128,64]다. 모서리는 투명하며 별도 source region이나 긴 HUD 원본의 통째 늘림을 사용하지 않는다.

```json
{"mode":"9","slices":[27,27,27,27],"edges":[27,27,27,27],"padding":[0,0,0,0],"repeat":"stretch"}
```

source 중앙은128−27−27=74px,64−27−27=10px로 모두 양수다. source 코너27px와 target 고정폭27px가1:1이며 target 최소 너비·높이는54px다. 461×54는 높이의 최소 경계로 target 중앙 세로 크기가0이지만 source 중앙10px는 양수다. source/target 중앙을 혼동하지 않는다. 실제 skin 텍스처의 assetRef 등록·normal 상태 지정은 본체가 수행한다.

전체 경로·각 형식 SHA-256·크기·추천값은 _작업/codex/ux-studio/hud-top-9slice-v004-assets.json에 있다. 기존 v001/v002/v003 자원은 보존했다.

## 검증
- PNG/WebP decode 크기128×64·RGBA 바이트 전체 일치, production/import 사본 바이트 일치·SHA-256을 각각 확인했다.
- 두 파일 모두300000B 이하이며 원본의 네 모서리 점 alpha0, 바탕 중앙 alpha255, 프레임 중앙 alpha0을 확인했다.
- 결정적9슬라이스 래스터 검산에서 두 자원 각각461×54/461×80/461×110/54×54의 네 코너27×27 패치를 source와 비교해 모두 바이트 일치를 확인했다. 이는 브라우저 렌더 시험이 아니다.
- 기존 createSkin('backplate')에 지정 slices/edges/padding/repeat와 실제 WebP data URI·w128/h64를 넣어 validateSkin을 호출했고 두 자원 모두 통과했다. 검증 객체만 메모리에서 만들었으며 source/설계는 쓰지 않았다.
- 461×54 바탕/프레임 검산 이미지를 view_image로 확인했다. 검산 파일은 _작업/codex/ux-studio/9slice-v004-fill-461x54.png 및 frame-461x54.png와80/110px 별도 파일이다.

## 미확인·다음
브라우저의 실제 border-image 조립·적용·상태 이미지·반응형 높이별 표시·사본 저장/재열기는 대표 본체 담당이다. 논리 래스터 검산을 실제 UI 검수로 표현하지 않는다. 원본 픽셀과 색/곡률의 최종 일치 여부도 본체의 실제 화면 비교 후 판단한다. 코드·가이드·STATUS·공유 manifest·기존 설계·서버·빌드·예약은 수정하지 않았다. 결과는 제안(검수 대기)이다.
