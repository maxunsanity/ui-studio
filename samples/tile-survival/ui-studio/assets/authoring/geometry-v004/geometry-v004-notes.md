# geometry-v004 HUD icons

- 작성: codex / 2026-11-18T14:33:24+09:00
- 상태: 제안(검수 대기)
- 실제 열람 원본: /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-survival-20261118/TSV02/frames/frame_00085.jpg (425s)
- 원본 관찰: 타이머 왼쪽 흰 초승달과 Zz, 상점 노랑 바탕 위 보라 보석묶음. 새 SVG 경로로만 작성했고 원본 프레임 픽셀을 재사용하지 않음.
- 요청된 Zz는 글꼴/텍스트 노드가 아닌 기하 경로로 포함. 숫자/배지/노랑 상점 바탕/별도 그림자 없음.
- SVG/PNG 원화 보존: PNG는 기존 렌더러의 최초 결과를 그대로 보존. WebP 생산본에만 alpha=1~2의 미세한 기하 잔여를 0으로 정리하며 원화 PNG를 덮어쓰지 않음.
- API: 기존 `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unique-frames32/geometry/pillow_svg.py`의 `render_svg(svg)`, Pillow `Image.save(...,lossless=True,exact=True,method=6)`, `shutil.copy2`. native 등록 호출 없음.
- slice/edges 없음. 두 아이콘은 aspect 비율 유지, padding=0 권고.
- geometry-v001..v003, Common JS/CSS, 설계 JSON, 보고/STATUS 수정 없음. 새 geometry-v004 authoring/staging만 쓰기.

|이름|원화 px|표시 권고 px|PNG bytes|WebP bytes|alpha>=8 bbox|정리 alpha1~2 픽셀 수|
|---|---|---|---|---|---|---|
|hud-moon-zz-v004|56×48|28×24|2319|1434|(1, 1, 55, 46)|117|
|shop-gem-cluster-v004|128×60|64×30|9491|7170|(1, 2, 127, 59)|154|

## 경로 / SHA-256

- `hud-moon-zz-v004`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v004/hud-moon-zz-v004.webp`
  - PNG 원화 SHA-256: `d4aba773bafe0931c8d2c11ebf0d03c68a711dcdcb6cd5045bb783e17ab7349d`
  - WebP 생산본/staging SHA-256: `fe888926dc888fa62cfd9e6c926b0e1e0fbb6dcff04e3b185006f346a955516d`
  - SVG SHA-256: `ac6faa6f7abf9315b1db963bdfd1d5590799767a73149733a66d76be8fe799ba`

- `shop-gem-cluster-v004`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v004/shop-gem-cluster-v004.webp`
  - PNG 원화 SHA-256: `b70fa33ec936a54797e20aed4362b19448eacbafb26a2de93329cff7a3cf4b78`
  - WebP 생산본/staging SHA-256: `e33d3756e2b24ebfb81983a93b352f9812156fed5866e77ea5f48e9e57e0660d`
  - SVG SHA-256: `3453b162e1ecb2703c7b453d970896485d8a830f80a295642a6ab7c9097dfdf9`

## 확인

- 2개 SVG에 text/image/foreignObject/filter/drop-shadow 없음.
- 원화 PNG를 입력으로 명시된 alpha1~2 정리만 적용한 기대 RGBA와 lossless WebP 디코딩이 일치.
- authoring/staging WebP 바이트 동일, 300KB 이하, alpha 범위 0~255, 내용 bbox 여백 최대4px 이하 assert 통과.
- native 실제 조립과 화면 검수는 본체 범위이며 이 원화 준비 결과와 구분.

