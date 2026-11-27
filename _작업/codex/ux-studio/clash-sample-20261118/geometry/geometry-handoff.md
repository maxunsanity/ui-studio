# Clash geometry v001

2026-11-18T16:22:15+09:00 · codex · 제안(검수 대기)

SVG/PNG原画/lossless WebP는 authoring에 보존했습니다. WebP만 import-staging에 복사했습니다. native 등록/조립/브라우저 검수0.

직접 작성한 코드 SVG이며 원본 캡처·기존 샘플 자원 복사·폰트문자/수치/라벨·외부 그림자 굽기0. 프레임의 약한 베벨/바닥 두께는 재질이며 외부 그림자는 native 엔진에 둡니다. 카드판의 중앙은 의도된 불투명 어두운 백판입니다.

배열 순서 TRBL. slice=source px, edge=논리px, padding은 전부 [0,0,0,0]. normal 프레임만 준비했고 native 버튼 상태/연결은 별도입니다.

|name|source px|slice / edge / padding|native path|WebP bytes|
|---|---|---|---|---|
|dark-resource-cell9-v001|160×40|[8, 8, 8, 8] / [4, 4, 4, 4] / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/dark-resource-cell9-v001.webp|482|
|panel-blue9-v001|128×128|[12, 12, 12, 12] / [8, 8, 8, 8] / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/panel-blue9-v001.webp|898|
|panel-purple9-v001|128×128|[12, 12, 12, 12] / [8, 8, 8, 8] / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/panel-purple9-v001.webp|844|
|card-silver9-v001|96×128|[10, 10, 10, 10] / [5, 5, 5, 5] / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/card-silver9-v001.webp|2936|
|button-gold3-v001|160×64|[0, 20, 0, 20] / [0, 10, 0, 10] / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/button-gold3-v001.webp|2148|
|button-green3-v001|160×64|[0, 20, 0, 20] / [0, 10, 0, 10] / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/button-green3-v001.webp|2192|
|button-blue3-v001|160×64|[0, 20, 0, 20] / [0, 10, 0, 10] / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/button-blue3-v001.webp|2140|
|button-close-red9-v001|64×64|[10, 10, 10, 10] / [6, 6, 6, 6] / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/button-close-red9-v001.webp|1320|
|glyph-coin-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-coin-v001.webp|4632|
|glyph-gem-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-gem-v001.webp|2938|
|glyph-crown-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-crown-v001.webp|2976|
|glyph-trophy-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-trophy-v001.webp|2868|
|glyph-menu-v001|48×48|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-menu-v001.webp|424|
|glyph-people-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-people-v001.webp|3360|
|glyph-cards-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-cards-v001.webp|1832|
|glyph-swords-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-swords-v001.webp|3930|
|glyph-shop-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-shop-v001.webp|2324|
|glyph-laurel-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-laurel-v001.webp|2602|
|glyph-arrowup-v001|48×48|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-arrowup-v001.webp|1162|
|glyph-check-v001|48×48|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-check-v001.webp|1522|
|glyph-close-v001|48×48|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-close-v001.webp|1260|
|glyph-elixir-v001|64×64|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-elixir-v001.webp|3338|
|full-background-blue-v001|390×844|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/full-background-blue-v001.webp|20438|
|full-background-main-teal-pink-v001|390×844|None / None / [0, 0, 0, 0]|/ui-studio/source/assets/import-staging/clash-royale-geometry/full-background-main-teal-pink-v001.webp|28266|

SVG/PNG/WebP 각 SHA256·정확 경로·alpha·bbox는 geometry-manifest.json을 참고합니다. PNG↔WebP RGBA 동일·staging SHA 동일·금지 SVG 노드0·WebP300KB 이하를 검사했습니다.

공통 5nav는 outer78×66 / icon48² / native label14 제안으로 인계합니다. 선택 때 icon/선택그림만 확대하되 wrapper 크기는 유지합니다. 원본 영상의 정확한 크기/폰트/색/상태 동등 승인으로 쓰지 않습니다.

## Lock追加

`glyph-lock-v001.webp` 64×64, transparent exterior, black shackle + yellow metal body + geometric keyhole. slice/edgeなし, padding[0,0,0,0]. Native: /ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-lock-v001.webp

Existing24 SVG/PNG/WebP SHA unchanged; native registration0.

## Social additions

Source B-F04-social visually observed. Four new code-native vectors, no source pixel reuse.

panel-white9-v001 (128, 128) slice=[12, 12, 12, 12] edge=[8, 8, 8, 8] padding0; /ui-studio/source/assets/import-staging/clash-royale-geometry/panel-white9-v001.webp

glyph-camera-v001 (48, 48) slice=None edge=None padding0; /ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-camera-v001.webp

glyph-sort-v001 (48, 48) slice=None edge=None padding0; /ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-sort-v001.webp

glyph-filter-v001 (48, 48) slice=None edge=None padding0; /ui-studio/source/assets/import-staging/clash-royale-geometry/glyph-filter-v001.webp

