# Networth13 geometry v001 — 제안(검수 대기)

작성: codex / 2026-11-17 KST. 자원 제작만 담당했으며 Native UI 조립·정본 보고는 부모 본체 담당입니다.

## 직접 본 원본과 형상 근거

`docs/reference/monopoly-go/video-analysis-20261117/MGV03/frames/game-crops/`의 `MGV03-S02-D.png`, `MGV03-S02-E.png`, `MGV03-S02-F.png`를 `view_image`로 실제 열었습니다. 이미지 파일을 스크립트로 읽거나 픽셀을 추출·복사·샘플링하지 않았습니다. 아래 형상·색은 관찰에 따른 재설계이며 픽셀 일치 복제가 아닙니다.

| 가족 | 실제 화면에서 관찰한 형상 차이 | 분리 제작한 요소 |
| --- | --- | --- |
| silver cyan | D의 500/450 및 F의 200/180 카드: 둥근 몸체, 얼음처럼 밝은 사선 표면, 위쪽 좌우로 솟고 가운데 내려가는 두 봉 scallop, 파란 번호판, 안쪽 금색 직사각 trim | 둥근 9슬라이스 body + 두 봉 crest + 파란 plate |
| bronze orange | E의 400/325 및 F의 160 카드: 동색 외곽, 평평하고 둥근 모서리의 상단 plate, 몸체 어깨/하단 모서리 사선 miter, 두꺼운 주황 측면, 안쪽 크림색 trim | 사선 모서리 9슬라이스 body + 평평한 crest + 어두운 동색 plate |
| prismatic purple gold | D의 575, E의 300 일부, F의 225 카드: 금색/올리브 외곽, 중앙 한 봉 crest, 보라·하늘·분홍 표면, 밝은 안쪽 trim, 청록 plate | 단일 봉 crest + 보라/금 9슬라이스 body + 청록 plate |
| gold highlight | E의 350 카드: 밝은 금색 몸체, 위쪽 두 개의 뾰족한 봉, 보라색 안쪽 trim, 주황색 plate | 두 뾰족 봉 crest + 금 9슬라이스 body + 주황 plate |

자물쇠는 D의 550/575 부근, 세로 gold/glass rail 및 538 무문자 badge는 D/E/F 우측, 금색 scroll·별 crest는 D/E/F 제목 장식을 근거로 새로 그렸습니다. 글자·수치·캐릭터·보상 그림·외부 cast shadow는 제작 자원에 포함하지 않았습니다. 표면의 bevel 명암과 반사는 포함했습니다.

## 파일과 사용 계약

- authoring: `samples/monopoly-go/ui-studio/assets/authoring/networth13/geometry-v001/`
- production: `samples/monopoly-go/ui-studio/assets/production/networth13-geometry/`
- import staging: `src/tools/uxStudio/assets/import-staging/networth13-geometry/`
- SVG는 편집용 정본, PNG/lossless WebP는 동일 RGBA 래스터 자원입니다. production/staging은 PNG와 WebP만 포함합니다.
- `manifest.json`은 각 파일의 경로·SHA256·바이트·sourceSize·slice·edges·권장 논리크기 및 시안/미확인 구분을 포함합니다. slice 순서는 top,right,bottom,left입니다.
- 4종 `card-frame-*`: source 128×128 / slice 24,24,24,24 / 권장 body 180×250. 중심 투명. 외곽 형태와 cutout 변화가 corner 24 범위에 들어가는지 알파 단면으로 검사했습니다.
- `card-crest-*`: source 160×58, 동일 가족 frame 위에 별도 조립. `number-plate-*`: 136×38 / slice 12,12,12,12 / 권장 128×36. 글자나 순위 수치는 없습니다.
- `gold-padlock`: source 48×58 / 권장 32×38, 외부와 shackle 개구부 투명.
- `progress-rail-gold-glass`: source 44×128 / 좌우 10 고정 / 세로 반복 또는 늘임. 시작·끝 cap 없음. `progress-fill-star-glitter`: source 44×128 / 좌우 10 고정 / 세로 반복. 부모가 진행 높이로 clip합니다. 두 자원 모두 위·아래 첫/끝 RGBA 행이 동일합니다.
- `progress-badge-538-blank`: source/권장 150×48. 538은 파일 식별용이며 그림 안에 숫자는 없습니다. crest·하단 장식 포함 크기입니다.
- `title-gold-scroll`: 184×42 / 권장 170×39. `title-star-crest`: 72×64 / 권장 58×52. 제목 글자는 부모의 별도 텍스트입니다.
- `background-blue-star-tile`: 128×128, x/y 반복. 배경의 별은 낮은 명도의 표면 texture입니다. 별도 배경 gradient는 제품 조립에서 추가할 수 있습니다.

## 재현·실제 검사

기존 Pillow만 사용했습니다. 새 dependency 설치, 브라우저 탭 제어, 제품 소스 수정은 없습니다.

```sh
python3 _작업/codex/ux-studio/networth13/geometry/build_geometry.py
```

19개 자원 / 102개 boolean assertion / 실패 0. PNG↔lossless WebP decoded RGBA byte 동일, SVG text/image/foreignObject 없음, SVG filter/blur 없음, 투명 corner, frame 중심 투명, corner slice 안전 알파 단면, rail/fill 세로 seam, alpha 8 이상 시각 경계의 과다 여백을 확인했습니다. 검증 산출은 `validation.json`, 실물로 연 contact sheet는 `geometry-contact-sheet.png`입니다. proof sheet의 설명 글자는 임포트 자원에 들어 있지 않습니다.

## 미확인·시안

모두 제안(검수 대기)입니다. Native UX Studio 실배치·렌더 엔진 shadow·폰 화면 검수는 이 하위 작업에서 하지 않았습니다. SVG와 PNG는 동일 경로 scene을 사용하지만 브라우저 SVG renderer와 Pillow의 픽셀 동일성은 검증하지 않았습니다. 색은 눈으로 해석한 값이며 원본 픽셀을 채취하지 않았습니다. 9슬라이스 180×250 및 rail 반복 미리보기는 contact sheet에서 확인했고 실배치 수치는 부모의 measurement 결과를 따릅니다.
