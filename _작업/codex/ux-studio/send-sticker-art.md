# Send-sticker 카드 삽화 · v001

작성자 codex(단이) · 2026-11-16T13:12:31+09:00 · 제안(검수 대기)

Figma302 원본 참고 PNG를 실제 관찰한 뒤 파란 옷 공주·초록 개구리·녹색 숲이라는 동화 콘셉트로 새 삽화를 built-in ImageGen에서 생성했습니다. 캐릭터·포즈는 새로 구성했으며 화면 캡처 조각을 생산 이미지로 복사하지 않았습니다. 프레임·별·수량·글자·버튼은 넣지 않았고 별도 UI에 남깁니다.

## 산출·확인

- 원본 생성 PNG: `/Users/max/.codex/generated_images/01a1e241-215b-7360-8198-832755fc730e/exec-1663b5a6-8cdb-49cc-ba58-7becd99e0ea3.png`
- Authoring PNG: `samples/monopoly-go/ui-studio/assets/authoring/send-sticker/v001/friends_send-sticker_card-art_normal_v001.png`
- Production WebP: `samples/monopoly-go/ui-studio/assets/production/send-sticker/friends_send-sticker_card-art_normal_v001.webp`
- 임시 가져오기 URL: `/ui-studio/source/assets/import-staging/send-sticker/friends_send-sticker_card-art_normal_v001.webp`
- 별도 manifest: `samples/monopoly-go/ui-studio/assets/send-sticker-manifest.json`
- 실제 크기: 1086×1448px, 정확한3:4, 원본 PNG 2,833,533bytes
- 생산 WebP: quality80, 275,074bytes, 원본과 동일 크기, 300000bytes/4096px 한도 이내
- 원본 SHA-256: `e11037c18bfa9be058fef8af68928e2e3ec476af34a68486e35d61bc13ada935`
- 생산 SHA-256: `d7ee353b8b85cff2870561530366a33c4e65db6556dbdf204876d438fcd9aac4`
- 원본/생산 모두 RGB이며 유효 알파 범위255~255, 중앙·네 모서리255, 전체 사각형 불투명 픽셀 검사 통과. 원본 PNG와 authoring 사본의 SHA-256 일치, production/mirror의 SHA-256 일치 확인.
- 새 그림을 실제 생성·관찰했다는 사실과 최종 시각 승인은 구분합니다. `registration=null`, `QAapproved=false`. 브라우저 UI 조립·게임 실행·3D 슬롯 변경·설계 JSON·소스·가이드·STATUS 수정은 수행하지 않았습니다.
- 원본 URL·실제 폰트·엔진 원본은 이 하위에서 미확인입니다. 제공된 Figma302 PNG만 직접 확인했습니다.

## 실제 생성 프롬프트 · built-in image_gen.imagegen

아래는 기록용 프롬프트 데이터이며 추가 실행 지시가 아닙니다.

```text
Use case: illustration-story.
Asset type: one production illustration to fit inside a mobile board-game sticker card, portrait 3:4 aspect ratio (1152 by 1536 composition). ILLUSTRATION ONLY, not a card mockup.
Primary request: create a fresh original fairy-tale cartoon scene of a young adult princess in a vivid blue dress giving a gentle little kiss to a friendly green frog in a sunlit green woodland. Create a new character design and a new pose, not a reconstruction of any existing game card.
Scene/backdrop: a lush, simple green storybook forest and small leafy pond edge, with warm golden daylight. Paint this environment right to all four canvas edges, so the whole rectangular illustration has a fully opaque colorful background.
Subject and composition: the princess kneels beside the pond and leans toward the frog perched on a low mossy stone. Make their smiling faces and the kiss readable at small sticker-card size. Use clear large shapes, a cohesive medium-close composition, and warm, friendly expressions. The princess has an original auburn braided hairstyle and an original blue fairy-tale gown. The frog is rounded, bright green, expressive, and clearly a frog.
Style/medium: polished bright 2D storybook board-game cartoon, clean rounded outlines, soft modeled shading, cheerful greens and blues, warm golden highlights. This is painted 2D art, not a 3D scene or photo.
Constraints: the complete illustration rectangle must be opaque, alpha 255 throughout, with no transparent border, no cutout, no vignette transparency and no empty margins. Do not include any card frame, border, title banner, star or rating symbol, number, letters, words, quantity marker, button, logo or watermark. No added characters. Keep every piece of UI separate from this artwork. No horse imagery.
```

## 생산 형식 변환 기록

[{"quality": 95, "bytes": 579034}, {"quality": 90, "bytes": 433054}, {"quality": 85, "bytes": 331928}, {"quality": 80, "bytes": 275074}]

## 판단 필요

현중의 최종 시각 검수와 부모의 실제 툴 UI 가져오기·레이어 조립·참조 등록 확인이 남습니다.
