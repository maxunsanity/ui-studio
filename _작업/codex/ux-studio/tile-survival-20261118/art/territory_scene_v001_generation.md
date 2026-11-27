# territory_scene_v001 생성 기록

- 작성자: codex 하위 원화 작업
- 기록 시각: 2026-11-18T13:03:10+09:00
- 상태: 제안(검수 대기)
- 방법: 내장 image_gen 도구, referenced_image_paths 참고 프레임 1개, transparent_background=false.
- 참고 프레임: /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-survival-20261118/TSV01/frames/frame_00017.jpg
- 참고 용도: 구도·카메라·색감·양식. 원본 스크린샷 잘라쓰기 없이 새 배경 원화 생성.
- 도구 기본 원본: /Users/max/.codex/generated_images/01a1eccf-b3e7-7530-a27e-2411261f78bc/exec-683fb440-57d0-4fc6-b511-7a41287ede4c.png
- 프로젝트 원본: /Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/assets/authoring/scene/territory_scene_v001.png
- PNG 사양: 941×1670, RGB, 2123550 bytes
- 표시용 WebP: /Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/assets/authoring/scene/territory_scene_v001.webp
- WebP 사양: 504×894, quality=88, method=6, 75010 bytes
- WebP 처리: 기존 Pillow로 리사이즈·포맷 변환만 수행. 그림 내용 편집 없음.
- PNG SHA-256: 6c39d34bc553b76a9fd9699993c1c522c62f668d4318fc23e85d1586f22b23c3
- WebP SHA-256: ac8252341468ca1144c8db05c6b37839a5a75b52315463c0669b1ee71a85a438
- 이번 확인: 생성 결과를 시각 확인. UI/텍스트/인물/튜토리얼 표시 없음. 중앙 공사장, 좌하단 발전기, 우하단 철망·전기기둥 구도 확인.
- 미확인: 실제 UI 조립, 브라우저 화면 검수는 본체 작업 범위이며 이 기록의 생성 성공이 UI 완료를 뜻하지 않음.

## 최종 프롬프트

```text
Use case: stylized-concept
Asset type: portrait mobile game territory background art, no interface.
Input image: reference only for environment composition, camera, color and low-poly style. Create a fresh newly drawn environment; never crop, paste or retain screenshot UI.
Primary request: Repaint the entire reference environment as a clean warm casual survival village backdrop. Portrait aspect 504:894, approximately 9:16. Elevated three-quarter isometric camera, close to the reference viewing angle and scale. Broad bright green grass territory with subtle worn light-green paths; dense darker conifer trees along the upper edge and right upper corner. Near image center, a small house construction site: low white-and-pale-blue fence and foundation edges, warm tan floor, a compact orange/tan incomplete house frame and a curved pipe. At the left lower edge a large orange cylindrical power machine partly cut by the side, with chunky gray metal pipes and a couple of blue cables. A diagonal dark gray wire fence and gate crosses the bottom-right area with a tall squat electrical fence post and warm stone rocks beside it; conifers near right lower edge. A few small wooden crates near the upper forest edge. Keep object placements and ample green open areas close to the reference composition. Continue the green landscape naturally across the full top and bottom edges, suitable beneath separately composed game UI.
Style/medium: polished 2D game illustration convincingly resembling a soft low-poly 3D casual mobile game still, rounded chunky simple forms, broad flat-shaded surfaces, soft ambient occlusion and appealing matte materials. Warm daylight, gentle shadows towards lower-left, cheerful fresh lime and grass greens, deep teal conifers, warm orange machinery and pale blue fence accents. Moderate detail, readable small-screen silhouettes. Single cohesive scene, no sky, no horizon.
Constraints: Environment art only. Remove all HUD, overlays, UI, resource bars, player portrait, humans, zombies, characters, icons, labels, badges, numerals, writing, alerts, notifications, game logos, arrows, hands, pointer, tutorial circles, glowing rings, large fog gradients and watermarks. No extra terrain, hills, cliffs, mountains, water, buildings or villages beyond the reference elements. No photorealism. No text anywhere.
```
