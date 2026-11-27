# geometry-v003 hero list resources

- 작성: codex / 2026-11-18T14:16:50+09:00
- 상태: 제안(검수 대기)
- 읽은 원본: /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-survival-20261118/catalog/references/TS25_01_TSV02_0330.00s.jpg (실제 view_image 열람)
- 원본 관찰: 약111×180의 세로 카드, 보라/주황갈색/청록 바탕, 작은 둥근 모서리, 산/모래/구름 필터, 하단 왼쪽 흰 뒤로 화살표. 모두 새 SVG 기하이며 원본 픽셀/아바타/숫자/텍스트를 재사용하지 않음.
- 카드: SVG rx=8, 표시 권장 111×180, slices=9px, native edges=8px, 본문 padding=0. border/미세한 밝기 gradient만 포함.
- 아이콘: 독립 투명 알파이며 필터 탭/버튼 바탕 없음. 외부 drop shadow 없음. 필요시 native 엔진 적용.
- 사용 API: 기존 `/Users/max/projest_max/ui-studio/_작업/codex/ux-studio/unique-frames32/geometry/pillow_svg.py`의 `render_svg(svg)` 및 Pillow `Image.save(..., lossless=True, exact=True, method=6)`, `shutil.copy2`. native 등록/API 호출 없음. Cairo/새 패키지/외부 API 없음.
- 래스터 처리: 기존 렌더러의 Lanczos 축소에서 생기는 alpha=1~2의 투명 모서리 잔여만 alpha=0으로 정리. SVG/공통 렌더러 수정 없음.
- 저장: source SVG/PNG/WebP와 기록은 이 geometry-v003 폴더, staged WebP는 새 tile-survival-geometry-v003 폴더만 사용. 다른 폴더/공통 JS/CSS/설계 JSON/보고/STATUS 쓰기 없음.
- slices/edges 배열 순서: top,right,bottom,left. 아이콘은 slice/edges 없음.

|이름|원본 px|권장 표시 px|slice|edges|본문 padding|WebP bytes|alpha bbox|
|---|---|---|---|---|---|---|---|
|hero-card-purple9-v003|111×180|111×180|[9, 9, 9, 9]|[8, 8, 8, 8]|0|1364|(0, 0, 111, 180)|
|hero-card-orange9-v003|111×180|111×180|[9, 9, 9, 9]|[8, 8, 8, 8]|0|1336|(0, 0, 111, 180)|
|hero-card-teal9-v003|111×180|111×180|[9, 9, 9, 9]|[8, 8, 8, 8]|0|1450|(0, 0, 111, 180)|
|hero-filter-mountain-v003|40×32|30×24|None|None|0|1700|(0, 2, 40, 31)|
|hero-filter-sand-v003|40×32|30×24|None|None|0|1974|(1, 2, 40, 31)|
|hero-filter-cloud-v003|40×32|30×24|None|None|0|1144|(0, 2, 40, 29)|
|hero-back-arrow-white-v003|44×44|38×38|None|None|0|998|(0, 2, 44, 42)|

## Native paths / hashes

- `hero-card-purple9-v003`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-card-purple9-v003.webp`
  - staged WebP SHA-256: `372a1d6a635bb292173bb4d5de4b3e02eb957d7f10941258263a3a1aa25bcff6`
  - editable SVG SHA-256: `909de2bdfab746da190ed163d24008a08752dc8880bd9798bc999b8d2b8bfb93`
  - PNG SHA-256: `ac89825ef28356c280d4174e643e22c73949ad1773027ddb15a05449eb53ba24`

- `hero-card-orange9-v003`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-card-orange9-v003.webp`
  - staged WebP SHA-256: `8467ae367cfcd160c719d060f9f484b0d5390b4ef07062a3f79ce83aea5f95d3`
  - editable SVG SHA-256: `ce2af70b9d3ce7b6173581ee28b7667641d6b33f1c1b88d2f3de8201d7589190`
  - PNG SHA-256: `fe5215f2a65c832463c6a98bf8df2227008e82a4b7fb9eb0e5245e2df88f692b`

- `hero-card-teal9-v003`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-card-teal9-v003.webp`
  - staged WebP SHA-256: `f439d67c0d58e9052ddcb3717c861234b4097c2de945586684bdb68200a11715`
  - editable SVG SHA-256: `be36a4780d36bd1d467d0e58c030b03534571c25f2f730bd762105f57fa63cf4`
  - PNG SHA-256: `ac083d47cfe30f601555a623e80ad9f2c5523b11562f496f0dde6d2c923cd61d`

- `hero-filter-mountain-v003`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-filter-mountain-v003.webp`
  - staged WebP SHA-256: `f32068c62f7cc2f1cfa1d21a254460fe5c9eeb0f516f650b2e6cef4adc00c64f`
  - editable SVG SHA-256: `f7eb2cf3d5a6919746386f43a410085e594e63aad57f0e9477d24c0f921afc5c`
  - PNG SHA-256: `2b998edae65ab50996ee8e4c4759a2dd89d7b20ab999b2b6a67734899b150809`

- `hero-filter-sand-v003`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-filter-sand-v003.webp`
  - staged WebP SHA-256: `8199fc6b2e894c0d257f6bc0fa4babcffea5a5893a075f6fcaeaa6bf187dd1c1`
  - editable SVG SHA-256: `82bc2501146333e9aa169b4d662d299f80193a9678f6deb19a5b276e7f9d5395`
  - PNG SHA-256: `7050be589a726c435c3e745ace4c045f39859979e9e48e27e1820990442a20fc`

- `hero-filter-cloud-v003`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-filter-cloud-v003.webp`
  - staged WebP SHA-256: `5f40fa1fb94fbb154e130502a05482c96fecebdb942227f965985d83810999b0`
  - editable SVG SHA-256: `966643e76d5bcafa9812710fc74a77a015a4f822547b2e5d66bb1172d7162517`
  - PNG SHA-256: `cfc300d58d6ea5b21280b794308b9406673f2a601e54feca0d267cfde91af826`

- `hero-back-arrow-white-v003`
  - native: `/ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-back-arrow-white-v003.webp`
  - staged WebP SHA-256: `bfb17132c14dd0ee750de58681c9c5fef9ebaf4d7d80111abec3de1fbf91bc6b`
  - editable SVG SHA-256: `965cb8605120b6bb573c256be4be06d8907155ea33dd6f0f430b4e9d22f9d513`
  - PNG SHA-256: `a3ad06fa29c2bc8e240f5b0ce9558d276f55d3abcbd11b14c4d788b53abc69b8`

## 확인

- 7개 SVG에 text/image/foreignObject/filter/drop-shadow 없음.
- 7개 PNG↔lossless WebP RGBA 일치 및 authoring↔staging SHA 일치.
- 모두 300KB 이하. 카드 모서리 alpha=0 및 본문 alpha=255, 아이콘 alpha 범위 0~255.
- geometry-v003-contact-sheet.png는 기하만 조합한 자체 확인 시트이며 import 자원이 아님.
- native 조립/실제 UI/카드9slice 확장 화면 검수는 본체에서 수행.

