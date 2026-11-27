# HUD 개별 자원 v003 생성 보고

작성자 codex(단이) 하위 작업 · 2026-11-16 · 제안(검수 대기)

## 범위
참조 HUD의 현금·단일 방패·흑백 SNS 원형 사진을 각각 별도 built-in image_gen 호출로 생성했다. 전체 HUD 한 장 재현은 하지 않았다. 코드·설계·가이드·STATUS·공유 manifest·기존 자원은 수정하지 않았다. 생성 원본 PNG는 복사 보존했고, 실제 자원 등록·sourceSize/region/assetRef와 화면 교체는 대표 본체 담당이다.

참조: /var/folders/dn/m763zzn15514kpgp2jhdyft40000gn/T/codex-clipboard-c9161d08-186c-4204-b279-329c332e309e.png 를 view_image로 먼저 확인했다. 적용 스킬: /Users/max/.codex/skills/.system/imagegen/SKILL.md. built-in만 사용했고 CLI·API 키·새 패키지는 사용하지 않았다.

## 생성과 판단
- 현금: 녹색 윗면·노랑/보라 아래층·옅은 회청색 띠와 원본의 단순 각도를 반영한 새 그림이다. 크게 과장된 원기둥 동전/두꺼운 현금더미·후광·드롭섀도는 없다. 면의 미세한 색 변화와 픽셀 단위 원본 동일성은 남은 비교 항목이다.
- 방패: 첫 생성본의 어두운 중앙 음영을 거부하고 같은 형태를 단색에 가깝게 보정했다. 흰 테두리·얇은 어두운 바깥 선·주황 앞면이며 금속 프레임·과장 광택·외부 그림자는 없다. 원본과 비율/테두리 두께의 최종 적합성은 사용자 검수 대기다.
- 사진: 사용자 제공 원형 흑백 인물 사진의 얼굴·헤어·자세·배경을 유지하도록 복원 편집했다. 주사위 아바타를 만들지 않았다. 첫 결과의 바깥 alpha 찌꺼기를 한 번 보정했고 더 이상의 생성은 하지 않았다. 원본이 저해상도라 얼굴 세부·동일 인물의 완전한 동일성은 미확인이다. 바깥의 극저 alpha(<16) 잡티는 일부 남아 있다. 이를 코드로 지우거나 원형 마스크로 픽셀을 바꾸지 않았다.

총 built-in 호출은 최초3회+방패/사진 보정2회=5회이다. 실패 후보는 authoring/v003/candidates에 별도 보존한다.

## 저장 파일
모든 최종 PNG는 samples/monopoly-go/ui-studio/assets/authoring/hud-top/v003/에 있고, 파일 이름은 common_hud-top_cash-icon_normal_v003.png / common_hud-top_shield-icon_normal_v003.png / common_hud-top_player-avatar_normal_v003.png 이다.

등록용 WebP는 samples/monopoly-go/ui-studio/assets/production/hud-top/의 동일 stem .webp이며, 실제 UI import용 사본은 src/tools/uxStudio/assets/import-staging/hud-top/에 있다. 모두 새 v003 이름이며 기존 v001/v002를 덮어쓰지 않았다.

원본 크기는 전부1254×1254. 원본 PNG에 리사이즈·크롭·색 변경·alpha 정리를 하지 않았다. 원본 PNG→WebP quality95 형식 인코딩만 수행했다. 대표 본체가 ‘동일 픽셀’을 크기와 alpha 동일·원 PNG 보존으로 명확히 허용하여 RGB 손실 압축을 사용했다. 무손실 실험은 345192/342614/868106bytes로 제한을 넘었다.

| 자원 | WebP bytes | 권장 region x/y/w/h |
|---|---:|---|
| cash-icon | 79024 | 148 / 308 / 959 / 680 |
| shield-icon | 71796 | 190 / 165 / 869 / 927 |
| player-avatar | 193182 | 60 / 75 / 1111 / 1111 |

사진은 alpha128 주요 실루엣 bbox를 기준으로 중심(615.5,630.5), 반지름555.5의 정사각 region을 제안했다. 사진 원형의 모서리 투명은 보존되며 긴 사각형으로 확장하지 않는다. crop 파일을 만든 것이 아니라 실제 UI용 region 제안이다. 사진 alpha16 bbox와 권장 region은 가장자리 1px 정도 다를 수 있으며 최종 border 잘림 여부는 대표 본체가 실제 UI에서 확인한다.

## 검증과 근거
- PNG 복사와 원본의 SHA-256, WebP production/import 사본 해시를 기록했다.
- PNG/WebP decode 크기가 모두1254×1254로 같고, ImageChops.difference(PNG alpha,WebP alpha).getbbox()가 None인 것을 전부 확인했다. alpha는 픽셀 단위로 동일하다. RGB가 무손실이라는 뜻은 아니다.
- 모든 WebP는300000bytes 이내이다.
- alpha1/16/128 bbox는 ‘좌/상/우/하, 우·하 exclusive’ 형식으로 기록한다. alpha1은 극저 alpha 잡티까지 포함하므로 실제 region으로 사용하지 않는다.
- 정확한 전체 파일 경로·실제 bytes·PNG/WEBP SHA-256·세 임계값 bbox·권장 region·품질값: _작업/codex/ux-studio/hud-top-v003-assets.json.
- 생성 결과는 built-in 출력과 view_image로 확인했다. 프로젝트 실제 UI의 배치·비율·이미지 등록·저장/재열기는 수행하지 않았다.

## 최초 프롬프트
### cash
Use case: precise-object-edit. Input image: reference screenshot; the only target is the small cash-bundle icon just before 13,075. Recreate ONLY that single cash-bundle game UI asset as a clean transparent PNG. Match the reference silhouette, slight isometric angle, proportions and flat cartoon linework: green top banknotes, a thin yellow edge/layer and purple lower edge/layer, and a pale white to blue-grey paper wrapper across the middle. Keep the visible reference color arrangement. Small crisp dark grey outline, simple flat color surfaces with at most the minimal tonal division visible in the reference. Center it on a square transparent image, the icon filling about 82% of image width with a tight transparent margin. No printed numbers, currency symbols or text; no HUD strip, no other objects. No exaggerated 3D, no glossy render, no thick pile of bills, no gradients, no bloom, halo, glow, drop shadow, cast shadow, or atmospheric shading. Actual alpha transparency outside the cash only.

### shield
Use case: precise-object-edit. Input image: reference screenshot; the only target is ONE of the three small orange shield icons, not the whole strip. Recreate ONLY ONE orange shield as a flat game UI icon on genuine transparent background. Match its reference rounded shield silhouette and proportions: gently curved upper shoulders, pointed lower center, flat bright orange front, a narrow white/light cream border, a thin dark charcoal outer outline. Preserve the clean compact reference shape. Flat color face and border, with only the tiny reference edge separation; no bevel, no metal, no golden frame, no specular highlights, no embossing, no texture, no decorations. Center a single shield on a square canvas with a tight transparent margin, occupying about 78% height. No cash, portraits, menu, HUD background, number, text, repeated shields or interface. No shadow, glow, halo, bloom or 3D rendering. True alpha outside the icon.

### portrait
Use case: identity-preserve. Input image is an edit target: use ONLY the small circular black-and-white SNS portrait at the far left of the supplied screenshot. Isolate and restore that same portrait as a standalone circular SNS photo asset. Preserve the same person's visible facial structure and features, dark medium-length parted hair, neutral expression, head direction and slightly three-quarter pose, clothing and the background scenery visible INSIDE the original circular portrait. Preserve monochrome photography. Do not replace the person, invent a different face, beautify, stylize, cartoonize, turn into an avatar, add dice or make a character illustration. Reconstruct only enough to remove the screenshot/HUD and create a clean circle; keep the original composition and the identity as faithfully as the low-resolution source permits. Keep a thin plain white circular photo border matching the reference. Outside the circle must be genuine transparent alpha, with no shadow, glow, bevel or extra frame. Square canvas with the circle centered and filling about 92% of the square. Output this portrait alone, no HUD strip or other assets.

## 단일 보정 프롬프트
### shield
Use case: precise-object-edit. Edit the first image (a single shield asset); the second image is the original screenshot reference. Change ONLY the shield's color surfaces and alpha cleanliness. Preserve the shield silhouette, narrow white border and thin charcoal outline. Make the entire orange interior ONE uniform solid orange (#ff8700), with alpha 255 throughout the interior. No radial dark center, no gradient, no highlight, no shadow, no metal texture. The white border must be one solid warm white with alpha 255, and outline solid charcoal with alpha 255. This is flat cartoon UI like the small shields in the reference. Background outside the one shield must be alpha 0 with only a narrow clean antialias edge; no stray pixels or diffuse alpha cloud. A clean flat shield alone, same position and framing; no text or other elements.

### portrait
Use case: identity-preserve / precise-object-edit. Edit this generated circular grayscale portrait. Change ONLY the alpha edge outside the white circle: remove every stray white speck, spattered residue and faint halo beyond the circle. Create a perfectly clean continuous circular cutout with a thin plain white circular border and true alpha 0 outside, one antialias edge only. Preserve the existing face, facial identity, hair, expression, head angle, clothing and photograph scenery INSIDE the circle without alteration. Keep all photograph pixels inside the circle opaque (alpha 255). No shadow, no glow, no new styling or new face. Preserve square composition and portrait framing; no HUD or text.

## 다음
대표 본체가 새 자원을 실제 UI에 넣고 권장 region을 적용해 참조와 비교한다. 극저 alpha 잔여와 얼굴 세부 동일성은 미확인으로 유지한다. 더 이상의 이미지 생성·코드 변경·등록 자동화는 하지 않는다.

