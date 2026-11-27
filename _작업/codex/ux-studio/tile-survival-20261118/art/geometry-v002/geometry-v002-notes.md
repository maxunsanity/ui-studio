# geometry-v002 slice 자원

- 작성: codex / 2026-11-18T13:46:34+09:00
- 상태: 제안(검수 대기)
- 읽은 원본: _작업/codex/ux-studio/tile-survival-20261118/catalog/references/TS03_01_TSV02_0110.00s.jpg (실제 열람)
- 원본 관찰: 우상단 노랑 상점판, 상단 숫자 뒤 어두운 청색 칸, 하단 6개 동일폭 nav와 반복 세로 경계. 퀘스트 안내는 어두운 반투명 띠이며 금색 진척 채움은 원본에서 확인되지 않음. 따라서 청색 진척 레일/금색 채움은 요청에 따라 분리 준비한 제안 자원. 색상은 시각 해석이며 원본 픽셀 추출/복사 없음.
- 생성 API: 기존 `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unique-frames32/geometry/pillow_svg.py` 의 `render_svg(svg)`; Pillow `Image.save(..., lossless=True, exact=True, method=6)`; `shutil.copy2`. Cairo/새 패키지/외부 API 없음.
- 보존: editable SVG + PNG 원화 + lossless WebP를 authoring/geometry-v002에, WebP만 tile-survival-geometry-v002 staging에 복사.
- 모든 그림자는 native 엔진에서 설정. 자원에는 filter/외부 drop shadow/텍스트/아이콘/이미지 삽입 없음.
- native 등록 호출은 하지 않음. UI 조립과 실제 native 화면 검수는 본체 작업.
- slices 및 edges 배열 순서: top,right,bottom,left. slices는 원본 픽셀, edges는 아래 논리 크기에서 사용할 권장 고정 가장자리 크기.

|자원|원본 px|형식|slice TRBL|edges TRBL|권장 논리 크기|WebP bytes|
|---|---|---|---|---|---|---|
|shop-gold9-v002|96×56|9-slice|[10, 10, 10, 10]|[4, 4, 4, 4]|92×46|1380|
|hud-resource-blue9-v002|96×24|9-slice|[5, 5, 5, 5]|[2, 2, 2, 2]|112×19|280|
|quest-track-blue3-v002|128×30|horizontal 3-slice|[0, 6, 0, 6]|[0, 6, 0, 6]|302×26|324|
|quest-fill-gold3-v002|128×18|horizontal 3-slice|[0, 5, 0, 5]|[0, 4, 0, 4]|210×16|352|
|nav-divider-blue3-v002|4×56|vertical 3-slice; repeat 5|[8, 0, 8, 0]|[6, 0, 6, 0]|2×52|272|

## native 경로와 SHA-256

- `shop-gold9-v002`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v002/shop-gold9-v002.webp`
  - staged WebP SHA-256: `8ac8ec5af00b3fa8af68a0596d89d1f742745950aa1bef311ac8fffd98864868`
  - editable SVG SHA-256: `9fa76fad9230e6bea3f6b8045ae6c823755396832948c3200575e8c828a2ba3f`
  - PNG 원화 SHA-256: `7b0bbcc017e3da863d9d29ed44ad4dc3e4e80f863d7bc15db5b2854d220d3c95`

- `hud-resource-blue9-v002`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v002/hud-resource-blue9-v002.webp`
  - staged WebP SHA-256: `4d90275894d87fbda61d5bee6ac43cb91c2913a69393308ec1a36da0836b7cfb`
  - editable SVG SHA-256: `60fb8709382abece59adb473936e09a838f96af0c0ce407743a0e834dd7fecb8`
  - PNG 원화 SHA-256: `cb04267cfc00e718e6f35859c24b9cba66c516de415c86ceac8af8e5d193849b`

- `quest-track-blue3-v002`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v002/quest-track-blue3-v002.webp`
  - staged WebP SHA-256: `faaa0061e25eda5b0a8c96a842c702e5de7a959b7e812c0b02feee9bd0007c42`
  - editable SVG SHA-256: `8550cfe1878b3490475a12c36ca84bbdea06ff3b43bb18167a53bf2ffd0255bc`
  - PNG 원화 SHA-256: `2d4c5288facf37f3319d6a11f645cdde0e333f214d0d870e432793c0fc0b4265`

- `quest-fill-gold3-v002`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v002/quest-fill-gold3-v002.webp`
  - staged WebP SHA-256: `7f3d75a99286d0fd8556f1960ae97807e56f84e9dcd0bb0adcb099842193b041`
  - editable SVG SHA-256: `1c96b24433257859e089fe40b6ab9083ea980621584a056a274076c9d51116fe`
  - PNG 원화 SHA-256: `e712447f973d968251ec2c1ecf23b6c4252dd180e500462e332248b69da64ca4`

- `nav-divider-blue3-v002`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v002/nav-divider-blue3-v002.webp`
  - staged WebP SHA-256: `520355a7ec1470a59fabd81aeb18f5a2f42ab028266be3f0879ec9bba68de95a`
  - editable SVG SHA-256: `452713d445ac4dd8373fb15152e1930ce5f18faf016e48e7ed50706c3e1c6090`
  - PNG 원화 SHA-256: `afe6f985de9a6d2e2d1e958709f246c21ba3eeba1b6c7abec0de2c9655de2598`

## 조립 권고와 확인

- nav: 한 개의 파란 바탕을 유지하고 `nav-divider-blue3-v002`를 다섯 번 반복하면 6개의 동일 폭 구획을 만듦. nav 전체 너비 W의 x=W/6,2W/6,3W/6,4W/6,5W/6에 경계의 중심을 둠. 예: 504px 원본에서는 84/168/252/336/420px, 390px 논리 화면에서는 65/130/195/260/325px. 마지막 칸만 넓히지 않음.
- quest: track와 gold fill을 별도 native element로 두고, 진척 데이터에 따라 fill 표시 폭을 결정. 수치/문구는 자원에 없음. 금색 채움의 원본 미확인 사항은 위에 명시.
- 5개 SVG 금지 노드/필터 없음, PNG↔lossless WebP RGBA 동일, staged↔authoring WebP SHA 동일, 각 WebP ≤300KB를 assert 확인.
- geometry-v001 파일들의 작업 전/후 SHA가 동일함을 확인. 공통 JS/CSS/설계 JSON/보고/STATUS 파일은 이번 명령에서 쓰기 대상으로 열지 않음.
- geometry-v002-contact-sheet.png는 자체 기하만 조합한 확인용 시트이며 native import 자원이 아님.

