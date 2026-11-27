# 타일 서바이벌 r63 · 기존 그림 자원 매핑

- 작성: codex(단이) · 2026-11-19 · 제안(검수 대기). 제품/자원/저장설계 변경 0, 이 매핑 파일만 작성했습니다.
- 현재 작업중 문서는 r64이므로 본체가 보존한 20261119_0832 r63 백업을 기준으로 읽었습니다. 이후 native 추가분은 이 r63 매핑에 포함하지 않습니다.
- 실크기는 Pillow로 해당 등록파일을 열어 얻은 원본 픽셀입니다. fit/region/sourceSize/skin 경계는 native 문서 선언값입니다. DOM 실측/원본게임 수치와 구분합니다.
- region이 없으면 전체 원본을 참조하며, contain의 투명여백과 source region을 혼동하지 않습니다. 각 사용처의 원본 선언도 JSON에 보존했습니다.
- r63 주민(미아/제이슨/데이몬/옴/수잔/지미) 독립 초상은 없습니다. commander는 주민 초상으로 확정하지 않습니다.
- 분홍 양갈래 Hero10=twintails는 럭키 계열, 초록모자 석궁 Hero05=pink-scout는 매디 계열에 재사용 가능한 새 콘셉트 그림입니다. 실제 그림을 열어 확인했으며 원본 동등 승인을 뜻하지 않습니다.
- Hero01=sage, Hero02=ghost는 실제 그림을 열어 확인. Hero03=punk는 검정머리 정비 여성으로 분홍 양갈래 럭키를 대신하지 않습니다.
- 6개 nav 슬롯에는 흰 자물쇠가 여러 번 공유됩니다. nav slot1/3/4는 잠금, slot2 영웅, slot5 소품, slot6 외출+잠금 overlay이며 별도 6종의 활성 그림이 있다는 뜻이 아닙니다.
- territory/greenhouse scene은 기존 r63의 2D 정적 콘셉트 자원입니다. 최신 지시의 빈 Slot_3D를 이 그림으로 채우지 않습니다.
- 미참조 authoring 후보는 정식 등록 여부를 별도로 기록했습니다. 전신 그림 후보는 정적 2D이며 3D 슬롯 채우기용이 아닙니다.
- 새 그림 생성/편집/등록/브라우저 조작/공용 기록 수정은 수행하지 않았습니다.

## Summary

{
  "uniqueReferencedAssetCount": 48,
  "referenceUseCount": 93,
  "imageUseCount": 51,
  "skinUseCount": 42,
  "referencedMissingCount": 0,
  "filenameSHAMismatchCount": 0,
  "declaredSourceSizeMismatchCount": 0,
  "allImageRegionsAbsent": true,
  "unreferencedAuthoringCandidateCount": 8,
  "issueCount": 0
}

## Referenced image resources (not skins)

| Human name | Native element name | assetRef | actual px | fit / region | source URL mirror |
|---|---|---|---|---|---|
| heroes/twintails-portrait-v001.webp | Img_TSV_Hero10 | sha256-02eaa1f4304be8171d46b7777e8c525dc4099342702b16e4531576795b2796ad.webp | [512, 560] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/twintails-portrait-v001.webp |
| heroes/lumberjack-portrait-v001.webp | Img_TSV_Hero06 | sha256-0d93b18d94460b7e49420846d8815066dbb1789b9ded47640fa19f423e6ba7e6.webp | [512, 570] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/lumberjack-portrait-v001.webp |
| profile/commander_portrait_v001.webp | Img_TSV_HUD_Commander | sha256-10dca7801fd94ed1ae7e3693d6f214d13add26fd8259f6fb9625805ab8966fd5.webp | [256, 256] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-profile/commander_portrait_v001.webp |
| heroes/showman-portrait-v001.webp | Img_TSV_Hero04 | sha256-120d253dae5b9d61e5f80dc9ade91c89d16457a72bc2071c70614bcd26b9e4c4.webp | [512, 600] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/showman-portrait-v001.webp |
| building-icons-v001/lock-navy-silver.webp | Img_TSV_Furniture01_Lock, Img_TSV_Furniture02_Lock, Img_TSV_Furniture03_Lock, Img_TSV_Furniture04_Lock | sha256-195c586e2bcedc54b212fedca674c6c055c5185632061eb4e40e30d47af07d08.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/lock-navy-silver.webp |
| geometry-v001/power-fist.webp | Img_TSV_HUD_Power | sha256-1b58af09c668409876699d72160aac06c378461d9dcffcf4cd14781183756711.webp | [36, 36] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry/power-fist.webp |
| geometry-v001/population-hat.webp | Img_TSV_HUD_Population | sha256-209701a2921543f4e4900e5c49b3492995d108babb1cbf5120e7867fe8f0dce4.webp | [40, 32] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry/population-hat.webp |
| building-icons-v001/powerplant-requirement.webp | Img_TSV_Upgrade_Condition01 | sha256-295ecc6f7c7ccfca7b9f13fa036a9997a51c1a550151f6e02db3748eac2b61dd.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/powerplant-requirement.webp |
| heroes/martial-portrait-v001.webp | Img_TSV_Hero07 | sha256-326f57b9dedfb3356672a3ec54ddbcc79d850d7525429e9fca39b0f4a6bbd615.webp | [512, 560] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/martial-portrait-v001.webp |
| geometry-v001/wood-log.webp | Img_TSV_HUD_Wood, Img_TSV_Building_Wood, Img_TSV_Upgrade_Condition02 | sha256-46dbd170bfe8e6e45b0704bdd4f760a7230ef6bb9d1002dcdcbb0215c8a78201.webp | [40, 32] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry/wood-log.webp |
| building-icons-v001/medal-survivor-up.webp | Img_TSV_Upgrade_Reward03 | sha256-4d30ace4433ecf5a33802d00477cfc2830e1e6c4897686cf6228f5e55a24680d.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/medal-survivor-up.webp |
| building-icons-v001/tomato.webp | Img_TSV_Building_Tomato, Img_TSV_Upgrade_Reward04 | sha256-5c29f9b896b622122e161c0db772449e83b2899f2d07eb1108967143c70dcbb0.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/tomato.webp |
| heroes/sage-portrait-v001.webp | Img_TSV_Hero01 | sha256-5d000f8169206bc20365cef7277c7b2feb4c799542fa4a87d22ccf7eda85d1fb.webp | [512, 683] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/sage-portrait-v001.webp |
| geometry-v003/hero-filter-cloud-v003.webp | Img_TSV_Heroes_Filter04 | sha256-5f40fa1fb94fbb154e130502a05482c96fecebdb942227f965985d83810999b0.webp | [40, 32] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-filter-cloud-v003.webp |
| heroes/ruster-portrait-v001.webp | Img_TSV_Hero11 | sha256-6950a2a70091dff7881de67c2455aae45b02b6bbfbf8113453860a3cd4414a58.webp | [512, 600] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/ruster-portrait-v001.webp |
| heroes/redhair-portrait-v001.webp | Img_TSV_Hero09 | sha256-73a64b0dac258a2ccfcc7c94115c497d6d25c1fbd8f5afa3d816bcd3623bcda0.webp | [512, 614] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/redhair-portrait-v001.webp |
| nav-icons-v001/nav-explore-map.webp | Img_TSV_Nav_Explore | sha256-75a6abd0446ae77b8599894a388997122c73356f404d7b3df69f8ddf394acbf8.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-nav-v001/nav-explore-map.webp |
| heroes/punk-portrait-v001.webp | Img_TSV_Hero03 | sha256-77c750f3d2af1147d188d6410b6bcde2972b1363186851b0236a300e557e7f2a.webp | [512, 683] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/punk-portrait-v001.webp |
| geometry-v001/diamond-purple.webp | Img_TSV_GemShop_Currency | sha256-796431a7cd9958dd1c1d89eb01c1ac872fe0e44f471763fdea738feee0c95b0e.webp | [36, 32] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry/diamond-purple.webp |
| geometry-v003/hero-filter-sand-v003.webp | Img_TSV_Heroes_Filter03 | sha256-8199fc6b2e894c0d257f6bc0fa4babcffea5a5893a075f6fcaeaa6bf187dd1c1.webp | [40, 32] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-filter-sand-v003.webp |
| geometry-v001/lock-white.webp | Img_TSV_Nav_Lock01, Img_TSV_Nav_Lock03, Img_TSV_Nav_Lock04, Img_TSV_Nav_Lock06 | sha256-96b45318d8f205accdf5b22bf96a072808f8a7644b913a74adb4f2a35634c19d.webp | [32, 36] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry/lock-white.webp |
| furniture-v001/furniture-workbench-ui-v001.webp | Img_TSV_Furniture02 | sha256-9fb1e8b2744caf47f3390866c3a346ed5eb824945f65b252a51ae048336403ad.webp | [256, 288] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-furniture-v001/furniture-workbench-ui-v001.webp |
| furniture-v001/furniture-planter-ui-v001.webp | Img_TSV_Furniture01, Img_TSV_Furniture03 | sha256-a295bbfbe5282c053e9183b681dd3e0119f27f5fbbedf203fe133713b4e97dd4.webp | [256, 288] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-furniture-v001/furniture-planter-ui-v001.webp |
| scene/territory_scene_v001.webp | Img_TSV_TerritoryScene | sha256-ac8252341468ca1144c8db05c6b37839a5a75b52315463c0669b1ee71a85a438.webp | [504, 894] | cover / full source | /ui-studio/source/assets/import-staging/tile-survival/territory_scene_v001.webp |
| building/greenhouse_interior_scene_ui_v001.webp | Img_TSV_Building_Greenhouse | sha256-b72852dcd6e61f3dc2a5a897f953b2199f5e99df4b7de70c5df221e6a6bbec39.webp | [840, 1008] | cover / full source | /ui-studio/source/assets/import-staging/tile-survival-building/greenhouse_interior_scene_ui_v001.webp |
| nav-icons-v001/nav-hero-white.webp | Img_TSV_Nav_Heroes | sha256-b74e83ebe50a5afb1103738e4d3470e509cb8793251bfc33eff2216fd049f1e2.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-nav-v001/nav-hero-white.webp |
| geometry-v003/hero-back-arrow-white-v003.webp | Img_TSV_Heroes_Back | sha256-bfb17132c14dd0ee750de58681c9c5fef9ebaf4d7d80111abec3de1fbf91bc6b.webp | [44, 44] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-back-arrow-white-v003.webp |
| heroes/pink-scout-portrait-v001.webp | Img_TSV_Hero05 | sha256-cc6611bede165e4f86b19276f733fd2ed518a7a31f6d67d5058e42dac3bd4af8.webp | [512, 622] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/pink-scout-portrait-v001.webp |
| furniture-v001/furniture-gear-rack-ui-v002.webp | Img_TSV_Furniture04 | sha256-cd10266ca5670719cae610895e501c147ab7e7e9f5b75846ae22c8fde5c8d787.webp | [256, 288] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-furniture-v001/furniture-gear-rack-ui-v002.webp |
| building-icons-v001/arrow-right-green.webp | Img_TSV_Upgrade_Arrow | sha256-d02e94dd952a375008db99fcab008f33e7fe582492c82ab3a3717f0e2e1f8861.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/arrow-right-green.webp |
| building-icons-v001/medal-sofa.webp | Img_TSV_Upgrade_Reward01 | sha256-d14dc9871b8b75b6cb6e6ed6b477481b058f4dac60cf1da41c8378097b25ae52.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/medal-sofa.webp |
| building-icons-v001/medal-power-fist.webp | Img_TSV_Upgrade_Reward02 | sha256-d7be67930d9b5d0710a6660ac8318f0657654e9d6a7aba3fc0a748784fef441a.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/medal-power-fist.webp |
| nav-icons-v001/nav-supplies.webp | Img_TSV_Nav_Supplies | sha256-d9375d23e15500eb62753b5f64a645ce3e283db547686e0c6246f9d1a260ebaf.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-nav-v001/nav-supplies.webp |
| geometry-v004/shop-gem-cluster-v004.webp | Img_TSV_GemShop_Cluster | sha256-e33d3756e2b24ebfb81983a93b352f9812156fed5866e77ea5f48e9e57e0660d.webp | [128, 60] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry-v004/shop-gem-cluster-v004.webp |
| building-icons-v001/check-green.webp | Img_TSV_Upgrade_Check01, Img_TSV_Upgrade_Check02 | sha256-e5b792fd54ff92994f9bf072dca0260cb0e0fea80c61dd9263faee766ed95bd9.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/check-green.webp |
| heroes/chef-portrait-v001.webp | Img_TSV_Hero08 | sha256-ea2bb7c0564b858dceee9a4527ee638a332d3ec7747290f8eaf278f71efb3cb6.webp | [512, 560] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/chef-portrait-v001.webp |
| geometry-v003/hero-filter-mountain-v003.webp | Img_TSV_Heroes_Filter02 | sha256-f32068c62f7cc2f1cfa1d21a254460fe5c9eeb0f516f650b2e6cef4adc00c64f.webp | [40, 32] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry-v003/hero-filter-mountain-v003.webp |
| heroes/ghost-portrait-v001.webp | Img_TSV_Hero02 | sha256-f967ef31303f3f991d1ad5371d5513500643f497e1e722864a1c0027c11597e3.webp | [512, 640] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-heroes/ghost-portrait-v001.webp |
| building-icons-v001/metal-ingot.webp | Img_TSV_Building_Metal | sha256-fbf7dd9795069cae93f3b57e61a9628f74c9d84f0a981c1307763323d5c2fbad.webp | [128, 128] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/metal-ingot.webp |
| geometry-v004/hud-moon-zz-v004.webp | Img_TSV_HUD_Timer | sha256-fe888926dc888fa62cfd9e6c926b0e1e0fbb6dcff04e3b185006f346a955516d.webp | [56, 48] | contain / full source | /ui-studio/source/assets/import-staging/tile-survival-geometry-v004/hud-moon-zz-v004.webp |

## Referenced frame / skin resources

| Human name | assetRef | actual px | mode / slice / edge | native uses |
|---|---|---|---|---|
| geometry-v001/button-green3.webp | sha256-114adf9fa11a14e1b42f5e6323374f3cd86936654434c4426c1776a601f8aff1.webp | [160, 64] | {"mode":"3","slices":[0,20,0,20],"edges":[0,12,0,12],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"} | BG_TSV_Building_Upgrade, BG_TSV_Upgrade_Confirm, BG_TSV_Heroes_Recruit |
| geometry-v003/hero-card-purple9-v003.webp | sha256-372a1d6a635bb292173bb4d5de4b3e02eb957d7f10941258263a3a1aa25bcff6.webp | [111, 180] | {"mode":"9","slices":[9,9,9,9],"edges":[8,8,8,8],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"} | BG_TSV_Hero01, BG_TSV_Hero06, BG_TSV_Hero07, BG_TSV_Hero08, BG_TSV_Hero09, BG_TSV_Hero10 |
| geometry-v001/hud-blue9.webp | sha256-4184b0ac8f27b7d10bf8adcf9efab78f7c935d01374c055ca95cc4442a5cc137.webp | [64, 64] | {"mode":"9","slices":[8,8,8,8],"edges":[3,3,3,3],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"} | BG_TSV_HUD_TopBar, BG_TSV_Nav, BG_TSV_Territory_BuildingLevel, BG_TSV_Building_Header, BG_TSV_Building_ResourceHUD, BG_TSV_Building_Level, BG_TSV_Upgrade_Header, BG_TSV_Heroes_Header, BG_TSV_Heroes_Back, BG_TSV_Heroes_Filter02, BG_TSV_Heroes_Filter03, BG_TSV_Heroes_Filter04, BG_TSV_Heroes_Footer |
| geometry-v001/paper-blue9.webp | sha256-41c8b9bf974d8661aec22457375a5c5942c0136c4accfe520fdb3f37b0e0cce0.webp | [96, 96] | {"mode":"9","slices":[12,12,12,12],"edges":[3,3,3,3],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"}<br>{"mode":"9","slices":[12,12,12,12],"edges":[6,6,6,6],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"} | BG_TSV_HUD_Avatar, BG_TSV_Building_Bottom, BG_TSV_Furniture01, BG_TSV_Furniture02, BG_TSV_Furniture03, BG_TSV_Furniture04, BG_TSV_Upgrade_Sheet, BG_TSV_Upgrade_Rewards, BG_TSV_Upgrade_Conditions, BG_TSV_Heroes_Filter01 |
| geometry-v002/hud-resource-blue9-v002.webp | sha256-4d90275894d87fbda61d5bee6ac43cb91c2913a69393308ec1a36da0836b7cfb.webp | [96, 24] | {"mode":"9","slices":[5,5,5,5],"edges":[2,2,2,2],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"} | BG_TSV_HUD_PowerCell, BG_TSV_HUD_TimerCell, BG_TSV_HUD_PopulationCell, BG_TSV_HUD_WoodCell |
| geometry-v003/hero-card-orange9-v003.webp | sha256-8467ae367cfcd160c719d060f9f484b0d5390b4ef07062a3f79ce83aea5f95d3.webp | [111, 180] | {"mode":"9","slices":[9,9,9,9],"edges":[8,8,8,8],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"} | BG_TSV_Hero03, BG_TSV_Hero04, BG_TSV_Hero05 |
| geometry-v002/shop-gold9-v002.webp | sha256-8ac8ec5af00b3fa8af68a0596d89d1f742745950aa1bef311ac8fffd98864868.webp | [96, 56] | {"mode":"9","slices":[10,10,10,10],"edges":[4,4,4,4],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"} | BG_TSV_GemShop |
| geometry-v003/hero-card-teal9-v003.webp | sha256-f439d67c0d58e9052ddcb3717c861234b4097c2de945586684bdb68200a11715.webp | [111, 180] | {"mode":"9","slices":[9,9,9,9],"edges":[8,8,8,8],"padding":[0,0,0,0],"repeat":"stretch","defaultState":"normal"} | BG_TSV_Hero02, BG_TSV_Hero11 |

## Available authoring candidates not referenced in r63

| Human name | SHA256 | registered? | actual px | source URL mirror |
|---|---|---|---|---|
| building-icons-v001/medal-arrow-up.webp | 446a830ab3df93954e698cc292ec35c852edabdb2132a02b13c3520de9dd2563 | None | [128, 128] | /ui-studio/source/assets/import-staging/tile-survival-building-icons-v001/medal-arrow-up.webp |
| geometry-v002/nav-divider-blue3-v002.webp | 520355a7ec1470a59fabd81aeb18f5a2f42ab028266be3f0879ec9bba68de95a | None | [4, 56] | /ui-studio/source/assets/import-staging/tile-survival-geometry-v002/nav-divider-blue3-v002.webp |
| nav-icons-v001/quest-scroll.webp | 71fd37a2300dab39ddf7a83a7a9375afe5e0f900e3a268f90461a37b56b7aae3 | None | [128, 128] | /ui-studio/source/assets/import-staging/tile-survival-nav-v001/quest-scroll.webp |
| geometry-v002/quest-fill-gold3-v002.webp | 7f3d75a99286d0fd8556f1960ae97807e56f84e9dcd0bb0adcb099842193b041 | None | [128, 18] | /ui-studio/source/assets/import-staging/tile-survival-geometry-v002/quest-fill-gold3-v002.webp |
| heroes/sage-fullbody-v001.webp | a0019a7cbb973da55ac54ae995e05e6ee4cafdeadbfcd9df9b17e3a02cd3180b | None | [512, 768] | /ui-studio/source/assets/import-staging/tile-survival-heroes/sage-fullbody-v001.webp |
| heroes/pink-scout-fullbody-v001.webp | aa35a01bd33d0c96cd5e7afe121bbb4a64a0497a69d2ea0aeccca5675c906a4b | None | [512, 768] | /ui-studio/source/assets/import-staging/tile-survival-heroes/pink-scout-fullbody-v001.webp |
| building/greenhouse_interior_scene_v001.webp | edd3b8c66cd1830c279f3a61162046e089c274257ac8c665fd4f0fa1aa96e471 | None | [1145, 1374] | /ui-studio/source/assets/import-staging/tile-survival-building/greenhouse_interior_scene_v001.webp |
| geometry-v002/quest-track-blue3-v002.webp | faaa0061e25eda5b0a8c96a842c702e5de7a959b7e812c0b02feee9bd0007c42 | None | [128, 30] | /ui-studio/source/assets/import-staging/tile-survival-geometry-v002/quest-track-blue3-v002.webp |

## Issues

[]

Snapshot: /Users/max/projest_max/ui-studio/docs/planning/_backup/20261119_단이/0832_tile_finish_r63/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json
SHA256: 3411e858552f46daac63ceb2a23de6da680cd3e294234435f619c0ea8fea3df4
