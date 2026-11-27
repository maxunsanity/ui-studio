// Declarative data only: no imports, functions, IDs or design/API writes.
// Owner executes operations[index] through native UI, checkpointing actual results.
export const metadata = {
  "format": "native-ui-operation-data-v1",
  "status": "제안(검수 대기); data preparation only",
  "logicalSize": [
    551,
    984
  ],
  "externalRootKey": "ROOT",
  "checkpointAfterEveryOperation": true,
  "rootBinding": "ROOT binds owner centered551x984 content group, not actual fullscreen screen root. Dim is separate at actual screen root.",
  "rootNativeUiRequirements": {
    "kind": "modal",
    "rootMode": "fullscreen",
    "engineDim": false,
    "blocking": true,
    "dismissOnEscape": true,
    "singleCustomDimOpacity": 0.7,
    "dimParent": "actual screen root outside content ROOT"
  },
  "rootOwnerHandles": [
    "actual modal/ROOT creation and native IDs",
    "single full-screen black.7 dim outside content ROOT",
    "Main Tycoon mapping, entry and Close/refocus",
    "native scroll/clip/anchors and save/reopen/Undo/Redo",
    "actual desktop/mobile/text-fit/keyboard QA"
  ],
  "executionRules": [
    "Pure data: execute one native UI/AX checkpoint at a time. Never assign module to design document or call design/API/hidden-state setters.",
    "Resolve IDs/parent names from actual native UI results; recipe contains no generated IDs/UUIDs. Explicitly parent every native element.",
    "rect is parent-local logicalpx and parentSize authored W/H. ROOT is uniformly scaled/centered551x984; anchorUi requires native inspector edits, not serialized rectTransform injection.",
    "Use actual empty native templates; read copied descendants and clear inherited layout/skin/crop via UI while preserving originals.",
    "Frame source import→wait actual source dimensions/image→slices/edges/padding→Tab→re-read. Order top/right/bottom/left. Never set slices against old source.",
    "Image assetRole resolves path/sha/sourceSize/imageRegion. Set native crop X/Y/W/H+Tab→이미지 영역 적용→re-read. Clone asset replacement also resets crop for new role.",
    "Style size/weight/line/align/vertical/color/stroke/strokeColor matches main05Helpers.typo. All text/counters are native.",
    "solid declares existing native rectangle/circle/capsule geometry and fill inspector operations, no raster generation or new product feature.",
    "cloneFromKey is native group duplicate only. Read actual copied children, match originalName + recipe sourceRole; descendantOverrides allows only new name/nativeText/assetRole. No IDs/rect/style changes. Stop on missing/duplicate matches; root resolves/Undo.",
    "All13 copied descendants are uniquely renamed. Row1/2/3 geometry is identical; all replacement art uses contain/full correct crop.",
    "Only rank-content intentionally exceeds viewport height; fixed own row is a later-painted panel sibling. No invented ranks5–21."
  ],
  "readSources": [
    "tycoon10-assembly-quick-sheet.md/json",
    "tycoon-ui-assets.json",
    "tycoon-event-assets.json",
    "tycoon-avatar-assets.json",
    "tycoon-pet-pack-assets.json",
    "hud-top-v003-assets.json",
    "racing09-native-recipe.mjs",
    "main05-ui-assembly.mjs",
    "browser-ui-helpers.mjs",
    "10_tycoon.png actual view",
    "station/3avatar/pet/blue-pack production actual views",
    "saved r200 assets readonly lookup: r184 Purple/SNS roles preserved"
  ],
  "sourceBoundary": {
    "originalSize": [
      610,
      1095
    ],
    "widthScale": 0.9032786885245901,
    "widthScaledHeight": 989.0901639344262,
    "nativeHeightDelta": -5.090163934426187,
    "scalePolicy": "Keep width-uniform scale, no Y-stretch. Close moved to bottom8logicalpx.",
    "sourceTitle": [
      "발자국",
      "익스프레스"
    ],
    "correctedDeparture": "575 confirmed4x NEAREST source zoom; prior5750 discarded.",
    "nicknameArabic": {
      "nativeVisible": "ابراهيم",
      "uncertainty": "Initial hamza/exact Unicode unconfirmed; possible إبراهيم. Preserve visible Arabic, no transliteration."
    },
    "versionMismatch": "Main05 TYCOON CLASS/source10FootprintExpress are source versions; demo mapping only, no common scoring policy."
  },
  "geometry": {
    "rowSize": [
      486.87,
      75.88
    ],
    "selfRowSize": [
      486.87,
      75.88
    ],
    "sourceSelfObservedSize": [
      539,
      81
    ],
    "sourceSelfNormalizedSize": [
      539,
      84
    ],
    "sourceGap": 4,
    "viewportSize": [
      489.58,
      345.05
    ],
    "contentSize": [
      489.58,
      390.22
    ],
    "sourceBottomSpacer": 84,
    "scrollRangeProposal": 45.17
  },
  "limits": [
    "New station/avatars/pet/pack are production interpretations, not exact original identity. Generic puppy expressly proposed; rank2 family relationships are fictional.",
    "Native9 arch approximates curve; no arbitrary arched scene mask. New scene contain; original roof M/moustache/exact train/animal/scene details not reproduced.",
    "Rank colored circle/wedge decoration omitted in this70-checkpoint core; numeric positions native. Original font/pixel identity unverified.",
    "Rank4 avatar/full nickname/score/dice/cash/pack quantity unknown. Empty native values are not zero. Partial blue pack art does not infer tier/count.",
    "Self only cash40K observed; pack/dice absent, not zero. Values/time/progress geometry are observed fixtures, not ranking/reward/countdown/game APIs.",
    "Info body/destination unobserved and unset. No unseen API/Unity/payment policies invented.",
    "Data preparation is UI assembly0 and no actual QA claim. Root owns actual scroll/dim/responsive/text-fit/focus/keyboard/save checks."
  ],
  "operationCount": 70,
  "assetRoleCount": 23,
  "operationIndexBase": 0
};

export const assets = {
  "panel-brown-arched-fill9": {"path":"/ui-studio/source/assets/import-staging/tycoon-ui/common_tycoon_panel-brown-arched-fill9_normal_v001.webp","sha":"db8f3125a30ff9ed9db35414615d560837f7215a5e2c75ca8461135bb15f7a7c","sourceSize":[192,224],"imageRegion":[0,0,192,224],"frameMode":"9","slices":[96,36,24,36],"edges":[96,96,12,96],"padding":[0,0,0,0]},
  "panel-brown-arched-frame9": {"path":"/ui-studio/source/assets/import-staging/tycoon-ui/common_tycoon_panel-brown-arched-frame9_normal_v001.webp","sha":"d5b7bcaa82cb9bc9948f278a0d4c2f4d76ad7babaffc2ffe2e8501372d921ae4","sourceSize":[192,224],"imageRegion":[0,0,192,224],"frameMode":"9","slices":[96,36,24,36],"edges":[96,96,12,96],"padding":[0,0,0,0]},
  "rank-row-light-fill9": {"path":"/ui-studio/source/assets/import-staging/tycoon-ui/common_tycoon_rank-row-light-fill9_normal_v001.webp","sha":"c51ffa094a97473ba2e28dbef2dfe1ea45f4ce434609b2d898451adfbeee297f","sourceSize":[128,96],"imageRegion":[0,0,128,96],"frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0]},
  "self-row-purple-fill9": {"path":"/ui-studio/source/assets/import-staging/tycoon-ui/common_tycoon_self-row-purple-fill9_normal_v001.webp","sha":"0e4060ab1a0f87046be244aaa7c999afbb553d3ed8bc632c0f08b514df61a95f","sourceSize":[128,96],"imageRegion":[0,0,128,96],"frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0]},
  "score-lightblue-pill3": {"path":"/ui-studio/source/assets/import-staging/tycoon-ui/common_tycoon_score-lightblue-pill3_normal_v001.webp","sha":"2f67dcff5ef1c106e62c435d7cfbce9e07ab429ec057d5b15af5152495ecc31d","sourceSize":[128,40],"imageRegion":[0,0,128,40],"frameMode":"3","slices":[0,20,0,20],"edges":[0,14,0,14],"padding":[0,0,0,0]},
  "info-blue-disc-fixed": {"path":"/ui-studio/source/assets/import-staging/tycoon-ui/common_tycoon_info-blue-disc-fixed_normal_v001.webp","sha":"f0d955d9d96c6e527de6fff57ffa330a6afaf414bfef8de8d45e09252db3320c","sourceSize":[64,64],"imageRegion":[0,0,64,64]},
  "drawer-white-frame9": {"path":"/ui-studio/source/assets/import-staging/menu-ui/common_menu_drawer-white-frame9_normal_v001.webp","sha":"6f02da9ecc27c6db3efb379e0006a44017d65156991ff102b260a8a9c070500a","sourceSize":[128,96],"imageRegion":[0,0,128,96],"frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0]},
  "weekly-progress-dark-olive-background-3slice": {"path":"/ui-studio/source/assets/import-staging/wins-ui/common_wins_weekly-progress-bg3_normal_v001.webp","sha":"0311a3e14be0a77e2378f703b8bab604a1e8036d03e2c402c02278334d50883f","sourceSize":[128,32],"imageRegion":[0,0,128,32],"frameMode":"3","slices":[0,16,0,16],"edges":[0,14,0,14],"padding":[0,0,0,0]},
  "weekly-progress-cyan-blue-fill-3slice": {"path":"/ui-studio/source/assets/import-staging/wins-ui/common_wins_weekly-progress-fill3_normal_v001.webp","sha":"fb8756d02de875984265aef4dd103a01cc05264e65593fc6ea99fe71366d7d59","sourceSize":[128,32],"imageRegion":[0,0,128,32],"frameMode":"3","slices":[0,16,0,16],"edges":[0,0,0,0],"padding":[0,0,0,0]},
  "stopwatch-fixed": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_stopwatch-fixed_normal_v001.webp","sha":"20155982bef39f01e01c6319a5004ec40169abb2d7d0ab843d4ec81952c43051","sourceSize":[64,64],"imageRegion":[0,0,64,64]},
  "tycoon-station-scene": {"path":"/ui-studio/source/assets/import-staging/tycoon-event/common_event-tycoon-station_scene_normal_v001.webp","sha":"ded4cf62daf9e396fb2af1b704ce4cb2fd94dc4894f497d281bc3330d4b68fa7","sourceSize":[700,467],"imageRegion":[0,0,700,467]},
  "tycoon-avatar-musician": {"path":"/ui-studio/source/assets/import-staging/tycoon-icons/common_tycoon-avatar-musician_icon_normal_v001.webp","sha":"0f64562a55eb2608e981874371cda11dc04010f6781a52eb07cd6d64f14ccc8c","sourceSize":[160,160],"imageRegion":[0,0,160,160]},
  "tycoon-avatar-generic-family": {"path":"/ui-studio/source/assets/import-staging/tycoon-icons/common_tycoon-avatar-generic-family_icon_normal_v001.webp","sha":"cce46f2afe222d8dcd9ca51a045abce77a9673a6fb0fb8ebb73aaf27353804ad","sourceSize":[160,160],"imageRegion":[0,0,160,160]},
  "tycoon-avatar-sailor": {"path":"/ui-studio/source/assets/import-staging/tycoon-icons/common_tycoon-avatar-sailor_icon_normal_v001.webp","sha":"45974b5abeaaca7d108041619e50b55f7c45186a3fb116e1765d10dcff23326f","sourceSize":[160,160],"imageRegion":[0,0,160,160]},
  "shared-tycoon-pet-progress-and-score": {"path":"/ui-studio/source/assets/import-staging/tycoon-icons/common_tycoon-pet-score_icon_normal_v001.webp","sha":"c2cf68d85f2cf6c3bd128ba639f2168daa1d99b0012da1ca59fbf14c1537efe7","sourceSize":[120,120],"imageRegion":[0,0,120,120]},
  "tycoon-blue-reward-pack": {"path":"/ui-studio/source/assets/import-staging/tycoon-icons/common_tycoon-pack-blue_icon_normal_v001.webp","sha":"04b82b6fcc7d7ab2854211d25f388f36b788216e43be8fb5fc37bd7bd1fae8c6","sourceSize":[82,120],"imageRegion":[0,0,82,120]},
  "purple-pack": {"path":"/ui-studio/source/assets/import-staging/wins-icons/common_wins-pack-purple_icon_normal_v001.webp","sha":"e34c0b5999bdad93895272d889dd2af9e75e5050b2e7a3a3d6d94cf97fa99824","sourceSize":[376,417],"imageRegion":[0,0,376,417],"reuseFromNativeName":"Img_Wins_Weekly_Pack_purple"},
  "green-pack": {"path":"/ui-studio/source/assets/import-staging/wins-icons/common_wins-pack-green_icon_normal_v001.webp","sha":"dd956d1c68c5245f8d34603ed2e044f827cc63e7fa5701ccc87b2c3d99b7eafc","sourceSize":[316,388],"imageRegion":[0,0,316,388]},
  "build-star": {"path":"/ui-studio/source/assets/import-staging/build-hud/common_build-level-star_icon_normal_v001.webp","sha":"3c0961fc3082224d471599cc0113243f9c8f7a3c0eb3f90244d9abb161be4a4c","sourceSize":[477,471],"imageRegion":[0,0,477,471],"reuseFromNativeName":"Img_Build_Level_Star"},
  "gold-disc": {"path":"/ui-studio/source/assets/import-staging/warehouse-products/common_warehouse-gold-medallion_icon_normal_v001.webp","sha":"00231d8709fdf0d4591fd55f1384a8d1866d8ff6ee7428b1cd8a6f9d72827ef5","sourceSize":[500,512],"imageRegion":[0,0,500,512]},
  "dice": {"path":"/ui-studio/source/assets/import-staging/album-icons/common_album-reward-dice-stack_icon_normal_v001.webp","sha":"27aa6548786a412c9259097f7b81afad128d90ae48d271da7e6e5719b78de80c","sourceSize":[266,264],"imageRegion":[0,0,266,264]},
  "cash": {"path":"/ui-studio/source/assets/import-staging/hud-top/common_hud-top_cash-icon_normal_v003.webp","sha":"5f2163a6a738a77769f5371b89d0951b33810e3a28ebf4c38c578e57280fb5c2","sourceSize":[1254,1254],"imageRegion":[148,308,959,680]},
  "sns": {"path":"/ui-studio/source/assets/import-staging/hud-top/common_hud-top_player-avatar_normal_v003.webp","sha":"5c24391da35e6ea0fa50e68d9db00c1da08086a2fc52ae9eb73d01b1e5225124","sourceSize":[1254,1254],"imageRegion":[60,75,1111,1111],"reuseFromNativeName":"Img_Shop_SNSAvatar"}
};

export const operations = [
  // [00] group panel ← ROOT
  {"op":"group","key":"panel","parentKey":"ROOT","name":"Group_Tycoon_Panel","rect":[15.36,84.0,520.29,828.31],"parentSize":[551,984],"kind":"panel","interaction":"none","anchorUi":"top-left-fixed-size"},
  // [01] panel panel-fill ← panel
  {"op":"panel","key":"panel-fill","parentKey":"panel","name":"BG_Tycoon_Arch","rect":[0,0,520.29,828.31],"parentSize":[520.29,828.31],"assetRole":"panel-brown-arched-fill9","frameMode":"9","slices":[96,36,24,36],"edges":[96,96,12,96],"padding":[0,0,0,0],"partRole":"background","interaction":"none"},
  // [02] image scene ← panel
  {"op":"image","key":"scene","parentKey":"panel","name":"Img_Tycoon_StationScene","rect":[9.94,30.71,500.42,284.53],"parentSize":[520.29,828.31],"assetRole":"tycoon-station-scene","fit":"contain","imageRegion":[0,0,700,467],"interaction":"none","note":"Full new scene with contain. Native9 arch is approximate; no arbitrary arch scene mask."},
  // [03] solid progress-ground ← panel
  {"op":"solid","key":"progress-ground","parentKey":"panel","name":"BG_Tycoon_ProgressGround","rect":[9.94,315.24,500.42,95.75],"parentSize":[520.29,828.31],"geometry":"rectangle","partRole":"background","interaction":"none","style":{"fill":"#a9dd59","opacity":1,"strokeWidth":0,"strokeColor":"#ffffff"}},
  // [04] panel panel-frame ← panel
  {"op":"panel","key":"panel-frame","parentKey":"panel","name":"Frame_Tycoon_Arch","rect":[0,0,520.29,828.31],"parentSize":[520.29,828.31],"assetRole":"panel-brown-arched-frame9","frameMode":"9","slices":[96,36,24,36],"edges":[96,96,12,96],"padding":[0,0,0,0],"partRole":"frame","interaction":"none"},
  // [05] text title-1 ← ROOT
  {"op":"text","key":"title-1","parentKey":"ROOT","name":"Txt_Tycoon_Title01","rect":[167.11,37.03,214.98,70],"parentSize":[551,984],"nativeText":"발자국","partRole":"label","interaction":"none","style":{"size":64,"weight":900,"line":70,"align":"가운데","vertical":"가운데","color":"#ffcf54","stroke":4,"strokeColor":"#005a55"},"anchorUi":"top-left-fixed-size","note":"Native linebox70 is1.35px taller than width-scaled source bbox."},
  // [06] text title-2 ← ROOT
  {"op":"text","key":"title-2","parentKey":"ROOT","name":"Txt_Tycoon_Title02","rect":[182.46,100.26,189.69,44.26],"parentSize":[551,984],"nativeText":"익스프레스","partRole":"label","interaction":"none","style":{"size":36,"weight":900,"line":42,"align":"가운데","vertical":"가운데","color":"#ffe06b","stroke":3,"strokeColor":"#005a55"},"anchorUi":"top-left-fixed-size"},
  // [07] group departure ← panel
  {"op":"group","key":"departure","parentKey":"panel","name":"Group_Tycoon_Departure","rect":[29.81,102.97,242.98,39.74],"parentSize":[520.29,828.31],"kind":"panel","interaction":"none"},
  // [08] solid departure-bg ← departure
  {"op":"solid","key":"departure-bg","parentKey":"departure","name":"BG_Tycoon_Departure","rect":[0,0,242.98,39.74],"parentSize":[242.98,39.74],"geometry":"capsule","partRole":"background","interaction":"none","style":{"fill":"#ffffff","opacity":1,"strokeWidth":0,"strokeColor":"#ffffff"}},
  // [09] text departure-prefix ← departure
  {"op":"text","key":"departure-prefix","parentKey":"departure","name":"Txt_Tycoon_DeparturePrefix","rect":[9.94,8.13,47.87,22.58],"parentSize":[242.98,39.74],"nativeText":"열차가","partRole":"label","interaction":"none","style":{"size":16,"weight":700,"line":20,"align":"왼쪽","vertical":"가운데","color":"#414139","stroke":0,"strokeColor":"#ffffff"}},
  // [10] image departure-rating ← departure
  {"op":"image","key":"departure-rating","parentKey":"departure","name":"Img_Tycoon_DepartureRating","rect":[59.62,5.42,23.49,26.2],"parentSize":[242.98,39.74],"assetRole":"build-star","fit":"contain","imageRegion":[0,0,477,471],"interaction":"none"},
  // [11] text departure-suffix ← departure
  {"op":"text","key":"departure-suffix","parentKey":"departure","name":"Txt_Tycoon_Departure575","rect":[86.71,8.13,148.14,22.58],"parentSize":[242.98,39.74],"nativeText":"575에서 출발합니다.","partRole":"label","interaction":"none","style":{"size":16,"weight":700,"line":20,"align":"왼쪽","vertical":"가운데","color":"#414139","stroke":0,"strokeColor":"#ffffff"},"note":"Source zoom confirms575; previous5750 discarded."},
  // [12] group progress ← panel
  {"op":"group","key":"progress","parentKey":"panel","name":"Group_Tycoon_Progress","rect":[121.04,339.63,276.4,29.81],"parentSize":[520.29,828.31],"kind":"panel","interaction":"none"},
  // [13] panel progress-bg ← progress
  {"op":"panel","key":"progress-bg","parentKey":"progress","name":"BG_Tycoon_Progress","rect":[0,0,276.4,29.81],"parentSize":[276.4,29.81],"assetRole":"weekly-progress-dark-olive-background-3slice","frameMode":"3","slices":[0,16,0,16],"edges":[0,14,0,14],"padding":[0,0,0,0],"partRole":"background","interaction":"none"},
  // [14] panel progress-fill ← progress
  {"op":"panel","key":"progress-fill","parentKey":"progress","name":"Fill_Tycoon_Progress","rect":[12.65,1.81,175.24,25.29],"parentSize":[276.4,29.81],"assetRole":"weekly-progress-cyan-blue-fill-3slice","frameMode":"3","slices":[0,16,0,16],"edges":[0,0,0,0],"padding":[0,0,0,0],"partRole":"background","interaction":"none","note":"Visible fill width only, no percentage/goal inferred."},
  // [15] group pet-disc ← panel
  {"op":"group","key":"pet-disc","parentKey":"panel","name":"Group_Tycoon_ProgressPet","rect":[82.2,321.57,65.04,65.04],"parentSize":[520.29,828.31],"kind":"panel","interaction":"none"},
  // [16] solid pet-disc-bg ← pet-disc
  {"op":"solid","key":"pet-disc-bg","parentKey":"pet-disc","name":"BG_Tycoon_ProgressPet","rect":[0,0,65.04,65.04],"parentSize":[65.04,65.04],"geometry":"circle","partRole":"background","interaction":"none","style":{"fill":"#00624e","opacity":1,"strokeWidth":4,"strokeColor":"#ffffff"}},
  // [17] image pet-disc-art ← pet-disc
  {"op":"image","key":"pet-disc-art","parentKey":"pet-disc","name":"Img_Tycoon_ProgressPet","rect":[10.84,8.13,44.26,45.16],"parentSize":[65.04,65.04],"assetRole":"shared-tycoon-pet-progress-and-score","fit":"contain","imageRegion":[0,0,120,120],"interaction":"none"},
  // [18] image reward-disc ← panel
  {"op":"image","key":"reward-disc","parentKey":"panel","name":"Img_Tycoon_ProgressRewardDisc","rect":[373.96,317.05,75.88,75.88],"parentSize":[520.29,828.31],"assetRole":"gold-disc","fit":"contain","imageRegion":[0,0,500,512],"interaction":"none","note":"Source84x80 normalizedsquare84. No native M/count added."},
  // [19] image reward-green-pack ← panel
  {"op":"image","key":"reward-green-pack","parentKey":"panel","name":"Img_Tycoon_ProgressGreenPack","rect":[390.22,325.18,39.74,56.0],"parentSize":[520.29,828.31],"assetRole":"green-pack","fit":"contain","imageRegion":[0,0,316,388],"interaction":"none"},
  // [20] group timer ← panel
  {"op":"group","key":"timer","parentKey":"panel","name":"Group_Tycoon_Timer","rect":[191.5,376.67,136.4,32.52],"parentSize":[520.29,828.31],"kind":"panel","interaction":"none"},
  // [21] panel timer-bg ← timer
  {"op":"panel","key":"timer-bg","parentKey":"timer","name":"BG_Tycoon_Timer","rect":[0,0,136.4,32.52],"parentSize":[136.4,32.52],"assetRole":"weekly-progress-dark-olive-background-3slice","frameMode":"3","slices":[0,16,0,16],"edges":[0,14,0,14],"padding":[0,0,0,0],"partRole":"background","interaction":"none"},
  // [22] image timer-clock ← timer
  {"op":"image","key":"timer-clock","parentKey":"timer","name":"Img_Tycoon_TimerClock","rect":[13.55,6.32,15.36,18.07],"parentSize":[136.4,32.52],"assetRole":"stopwatch-fixed","fit":"contain","imageRegion":[0,0,64,64],"interaction":"none"},
  // [23] text timer-text ← timer
  {"op":"text","key":"timer-text","parentKey":"timer","name":"Txt_Tycoon_Timer","rect":[32.52,4.52,92.13,24],"parentSize":[136.4,32.52],"nativeText":"7시간 48분","partRole":"label","interaction":"none","style":{"size":20,"weight":700,"line":24,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#ffffff"}},
  // [24] group rank-viewport ← panel
  {"op":"group","key":"rank-viewport","parentKey":"panel","name":"Viewport_Tycoon_Ranks","rect":[14.45,423.64,489.58,345.05],"parentSize":[520.29,828.31],"kind":"panel","interaction":"none","overflow":"scroll-y","anchorUi":"top-left-fixed-size"},
  // [25] group rank-content ← rank-viewport
  {"op":"group","key":"rank-content","parentKey":"rank-viewport","name":"Content_Tycoon_Ranks","rect":[0,0,489.58,390.22],"parentSize":[489.58,345.05],"kind":"panel","interaction":"none","overflow":"visible","note":"Four observed rows +84sourcepx blank bottom spacer. Deliberate scroll height only; no rank5–21 records."},
  // [26] group rank-1 ← rank-content
  {"op":"group","key":"rank-1","parentKey":"rank-content","name":"Group_Tycoon_Rank01","rect":[1.81,0.0,486.87,75.88],"parentSize":[489.58,390.22],"kind":"panel","interaction":"none","sourceRole":"rank-row"},
  // [27] panel r1-fill ← rank-1
  {"op":"panel","key":"r1-fill","parentKey":"rank-1","name":"BG_Tycoon_Rank01","rect":[0,0,486.87,75.88],"parentSize":[486.87,75.88],"assetRole":"rank-row-light-fill9","frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0],"partRole":"background","interaction":"none","sourceRole":"row-fill"},
  // [28] panel r1-frame ← rank-1
  {"op":"panel","key":"r1-frame","parentKey":"rank-1","name":"Frame_Tycoon_Rank01","rect":[0,0,486.87,75.88],"parentSize":[486.87,75.88],"assetRole":"drawer-white-frame9","frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0],"partRole":"frame","interaction":"none","sourceRole":"row-frame"},
  // [29] text r1-rank ← rank-1
  {"op":"text","key":"r1-rank","parentKey":"rank-1","name":"Txt_Tycoon_Rank01_Position","rect":[4.52,4.52,28.0,29.81],"parentSize":[486.87,75.88],"nativeText":"1","partRole":"label","interaction":"none","style":{"size":20,"weight":800,"line":24,"align":"가운데","vertical":"가운데","color":"#36362e","stroke":0,"strokeColor":"#ffffff"},"sourceRole":"rank-position"},
  // [30] image r1-avatar ← rank-1
  {"op":"image","key":"r1-avatar","parentKey":"rank-1","name":"Img_Tycoon_Rank01_Avatar","rect":[36.13,9.94,57.81,57.81],"parentSize":[486.87,75.88],"assetRole":"tycoon-avatar-musician","fit":"contain","imageRegion":[0,0,160,160],"interaction":"none","sourceRole":"avatar"},
  // [31] text r1-name ← rank-1
  {"op":"text","key":"r1-name","parentKey":"rank-1","name":"Txt_Tycoon_Rank01_Name","rect":[106.59,5.42,221.3,25.29],"parentSize":[486.87,75.88],"nativeText":"NotableCamel38","partRole":"label","interaction":"none","style":{"size":20,"weight":800,"line":24,"align":"왼쪽","vertical":"가운데","color":"#36362e","stroke":0,"strokeColor":"#ffffff"},"sourceRole":"nickname"},
  // [32] panel r1-score-bg ← rank-1
  {"op":"panel","key":"r1-score-bg","parentKey":"rank-1","name":"BG_Tycoon_Rank01_Score","rect":[105.68,33.42,153.56,30.71],"parentSize":[486.87,75.88],"assetRole":"score-lightblue-pill3","frameMode":"3","slices":[0,20,0,20],"edges":[0,14,0,14],"padding":[0,0,0,0],"partRole":"background","interaction":"none","sourceRole":"score-backing"},
  // [33] image r1-score-pet ← rank-1
  {"op":"image","key":"r1-score-pet","parentKey":"rank-1","name":"Img_Tycoon_Rank01_ScorePet","rect":[110.2,36.13,27.1,25.29],"parentSize":[486.87,75.88],"assetRole":"shared-tycoon-pet-progress-and-score","fit":"contain","imageRegion":[0,0,120,120],"interaction":"none","sourceRole":"score-pet"},
  // [34] text r1-score ← rank-1
  {"op":"text","key":"r1-score","parentKey":"rank-1","name":"Txt_Tycoon_Rank01_Score","rect":[142.72,34.32,109.3,28.9],"parentSize":[486.87,75.88],"nativeText":"920","partRole":"label","interaction":"none","style":{"size":25,"weight":800,"line":28.9,"align":"가운데","vertical":"가운데","color":"#36362e","stroke":1,"strokeColor":"#ffffff"},"sourceRole":"score"},
  // [35] image r1-pack ← rank-1
  {"op":"image","key":"r1-pack","parentKey":"rank-1","name":"Img_Tycoon_Rank01_Pack","rect":[344.15,17.16,34.32,41.55],"parentSize":[486.87,75.88],"assetRole":"purple-pack","fit":"contain","imageRegion":[0,0,376,417],"interaction":"none","sourceRole":"pack"},
  // [36] image r1-dice ← rank-1
  {"op":"image","key":"r1-dice","parentKey":"rank-1","name":"Img_Tycoon_Rank01_Dice","rect":[395.64,18.07,28.0,31.61],"parentSize":[486.87,75.88],"assetRole":"dice","fit":"contain","imageRegion":[0,0,266,264],"interaction":"none","sourceRole":"dice"},
  // [37] text r1-dice-qty ← rank-1
  {"op":"text","key":"r1-dice-qty","parentKey":"rank-1","name":"Txt_Tycoon_Rank01_DiceQty","rect":[386.6,44.26,49.68,22],"parentSize":[486.87,75.88],"nativeText":"1,500","partRole":"label","interaction":"none","style":{"size":19,"weight":800,"line":22,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":1,"strokeColor":"#414139"},"sourceRole":"dice-quantity"},
  // [38] image r1-cash ← rank-1
  {"op":"image","key":"r1-cash","parentKey":"rank-1","name":"Img_Tycoon_Rank01_Cash","rect":[440.8,19.87,36.13,27.1],"parentSize":[486.87,75.88],"assetRole":"cash","fit":"contain","imageRegion":[148,308,959,680],"interaction":"none","sourceRole":"cash"},
  // [39] text r1-cash-qty ← rank-1
  {"op":"text","key":"r1-cash-qty","parentKey":"rank-1","name":"Txt_Tycoon_Rank01_CashQty","rect":[436.28,44.26,49.68,22],"parentSize":[486.87,75.88],"nativeText":"1.6M","partRole":"label","interaction":"none","style":{"size":19,"weight":800,"line":22,"align":"가운데","vertical":"가운데","color":"#ffdc20","stroke":1,"strokeColor":"#414139"},"sourceRole":"cash-quantity"},
  // [40] group rank-2 ← rank-content
  {"op":"group","key":"rank-2","parentKey":"rank-content","name":"Group_Tycoon_Rank02","rect":[1.81,79.49,486.87,75.88],"parentSize":[489.58,390.22],"kind":"panel","interaction":"none","sourceRole":"rank-row","cloneFromKey":"rank-1","descendantOverrides":[{"originalName":"BG_Tycoon_Rank01","sourceRole":"row-fill","name":"BG_Tycoon_Rank02"},{"originalName":"Frame_Tycoon_Rank01","sourceRole":"row-frame","name":"Frame_Tycoon_Rank02"},{"originalName":"Txt_Tycoon_Rank01_Position","sourceRole":"rank-position","name":"Txt_Tycoon_Rank02_Position","nativeText":"2"},{"originalName":"Img_Tycoon_Rank01_Avatar","sourceRole":"avatar","name":"Img_Tycoon_Rank02_Avatar","assetRole":"tycoon-avatar-generic-family"},{"originalName":"Txt_Tycoon_Rank01_Name","sourceRole":"nickname","name":"Txt_Tycoon_Rank02_Name","nativeText":"ابراهيم"},{"originalName":"BG_Tycoon_Rank01_Score","sourceRole":"score-backing","name":"BG_Tycoon_Rank02_Score"},{"originalName":"Img_Tycoon_Rank01_ScorePet","sourceRole":"score-pet","name":"Img_Tycoon_Rank02_ScorePet"},{"originalName":"Txt_Tycoon_Rank01_Score","sourceRole":"score","name":"Txt_Tycoon_Rank02_Score","nativeText":"502"},{"originalName":"Img_Tycoon_Rank01_Pack","sourceRole":"pack","name":"Img_Tycoon_Rank02_Pack","assetRole":"tycoon-blue-reward-pack"},{"originalName":"Img_Tycoon_Rank01_Dice","sourceRole":"dice","name":"Img_Tycoon_Rank02_Dice"},{"originalName":"Txt_Tycoon_Rank01_DiceQty","sourceRole":"dice-quantity","name":"Txt_Tycoon_Rank02_DiceQty","nativeText":"800"},{"originalName":"Img_Tycoon_Rank01_Cash","sourceRole":"cash","name":"Img_Tycoon_Rank02_Cash"},{"originalName":"Txt_Tycoon_Rank01_CashQty","sourceRole":"cash-quantity","name":"Txt_Tycoon_Rank02_CashQty","nativeText":"800K"}],"note":"Native clone. Read actual copied children by originalName+sourceRole. Only name/text/asset changes; no descendant rect/style/ID overrides."},
  // [41] group rank-3 ← rank-content
  {"op":"group","key":"rank-3","parentKey":"rank-content","name":"Group_Tycoon_Rank03","rect":[1.81,158.98,486.87,75.88],"parentSize":[489.58,390.22],"kind":"panel","interaction":"none","sourceRole":"rank-row","cloneFromKey":"rank-1","descendantOverrides":[{"originalName":"BG_Tycoon_Rank01","sourceRole":"row-fill","name":"BG_Tycoon_Rank03"},{"originalName":"Frame_Tycoon_Rank01","sourceRole":"row-frame","name":"Frame_Tycoon_Rank03"},{"originalName":"Txt_Tycoon_Rank01_Position","sourceRole":"rank-position","name":"Txt_Tycoon_Rank03_Position","nativeText":"3"},{"originalName":"Img_Tycoon_Rank01_Avatar","sourceRole":"avatar","name":"Img_Tycoon_Rank03_Avatar","assetRole":"tycoon-avatar-sailor"},{"originalName":"Txt_Tycoon_Rank01_Name","sourceRole":"nickname","name":"Txt_Tycoon_Rank03_Name","nativeText":"ElegantDove05"},{"originalName":"BG_Tycoon_Rank01_Score","sourceRole":"score-backing","name":"BG_Tycoon_Rank03_Score"},{"originalName":"Img_Tycoon_Rank01_ScorePet","sourceRole":"score-pet","name":"Img_Tycoon_Rank03_ScorePet"},{"originalName":"Txt_Tycoon_Rank01_Score","sourceRole":"score","name":"Txt_Tycoon_Rank03_Score","nativeText":"290"},{"originalName":"Img_Tycoon_Rank01_Pack","sourceRole":"pack","name":"Img_Tycoon_Rank03_Pack","assetRole":"tycoon-blue-reward-pack"},{"originalName":"Img_Tycoon_Rank01_Dice","sourceRole":"dice","name":"Img_Tycoon_Rank03_Dice"},{"originalName":"Txt_Tycoon_Rank01_DiceQty","sourceRole":"dice-quantity","name":"Txt_Tycoon_Rank03_DiceQty","nativeText":"600"},{"originalName":"Img_Tycoon_Rank01_Cash","sourceRole":"cash","name":"Img_Tycoon_Rank03_Cash"},{"originalName":"Txt_Tycoon_Rank01_CashQty","sourceRole":"cash-quantity","name":"Txt_Tycoon_Rank03_CashQty","nativeText":"600K"}],"note":"Native clone. Read actual copied children by originalName+sourceRole. Only name/text/asset changes; no descendant rect/style/ID overrides."},
  // [42] group rank-4 ← rank-content
  {"op":"group","key":"rank-4","parentKey":"rank-content","name":"Group_Tycoon_Rank04","rect":[1.81,238.47,486.87,75.88],"parentSize":[489.58,390.22],"kind":"panel","interaction":"none","sourceRole":"rank-row","note":"Upper segment observed only. Shared full-height row is normalization; no fourth avatar or hidden values."},
  // [43] panel r4-fill ← rank-4
  {"op":"panel","key":"r4-fill","parentKey":"rank-4","name":"BG_Tycoon_Rank04","rect":[0,0,486.87,75.88],"parentSize":[486.87,75.88],"assetRole":"rank-row-light-fill9","frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0],"partRole":"background","interaction":"none"},
  // [44] panel r4-frame ← rank-4
  {"op":"panel","key":"r4-frame","parentKey":"rank-4","name":"Frame_Tycoon_Rank04","rect":[0,0,486.87,75.88],"parentSize":[486.87,75.88],"assetRole":"drawer-white-frame9","frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0],"partRole":"frame","interaction":"none"},
  // [45] text r4-rank ← rank-4
  {"op":"text","key":"r4-rank","parentKey":"rank-4","name":"Txt_Tycoon_Rank04_Position","rect":[4.52,4.52,28.0,29.81],"parentSize":[486.87,75.88],"nativeText":"4","partRole":"label","interaction":"none","style":{"size":20,"weight":800,"line":24,"align":"가운데","vertical":"가운데","color":"#36362e","stroke":0,"strokeColor":"#ffffff"}},
  // [46] text r4-name ← rank-4
  {"op":"text","key":"r4-name","parentKey":"rank-4","name":"Txt_Tycoon_Rank04_Name","rect":[106.59,5.42,221.3,25.29],"parentSize":[486.87,75.88],"nativeText":"PeerlessPelican...","partRole":"label","interaction":"none","style":{"size":20,"weight":800,"line":24,"align":"왼쪽","vertical":"가운데","color":"#36362e","stroke":0,"strokeColor":"#ffffff"},"note":"Literal observed truncation; full nickname unknown."},
  // [47] panel r4-score-bg ← rank-4
  {"op":"panel","key":"r4-score-bg","parentKey":"rank-4","name":"BG_Tycoon_Rank04_Score","rect":[105.68,33.42,153.56,30.71],"parentSize":[486.87,75.88],"assetRole":"score-lightblue-pill3","frameMode":"3","slices":[0,20,0,20],"edges":[0,14,0,14],"padding":[0,0,0,0],"partRole":"background","interaction":"none","note":"Repeated backing normalization; this region hidden in source."},
  // [48] text r4-score ← rank-4
  {"op":"text","key":"r4-score","parentKey":"rank-4","name":"Txt_Tycoon_Rank04_Score","rect":[142.72,34.32,109.3,28.9],"parentSize":[486.87,75.88],"nativeText":"","partRole":"label","interaction":"none","style":{"size":25,"weight":800,"line":28.9,"align":"가운데","vertical":"가운데","color":"#36362e","stroke":1,"strokeColor":"#ffffff"},"observation":"unconfirmed; blank, not zero"},
  // [49] image r4-pack ← rank-4
  {"op":"image","key":"r4-pack","parentKey":"rank-4","name":"Img_Tycoon_Rank04_Pack","rect":[344.15,17.16,34.32,41.55],"parentSize":[486.87,75.88],"assetRole":"tycoon-blue-reward-pack","fit":"contain","imageRegion":[0,0,82,120],"interaction":"none","note":"Only upper blue pack visible; no tier/count inferred."},
  // [50] image r4-dice ← rank-4
  {"op":"image","key":"r4-dice","parentKey":"rank-4","name":"Img_Tycoon_Rank04_Dice","rect":[395.64,18.07,28.0,31.61],"parentSize":[486.87,75.88],"assetRole":"dice","fit":"contain","imageRegion":[0,0,266,264],"interaction":"none"},
  // [51] text r4-dice-qty ← rank-4
  {"op":"text","key":"r4-dice-qty","parentKey":"rank-4","name":"Txt_Tycoon_Rank04_DiceQty","rect":[386.6,44.26,49.68,22],"parentSize":[486.87,75.88],"nativeText":"","partRole":"label","interaction":"none","style":{"size":19,"weight":800,"line":22,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":1,"strokeColor":"#414139"},"observation":"unconfirmed; blank, not zero"},
  // [52] image r4-cash ← rank-4
  {"op":"image","key":"r4-cash","parentKey":"rank-4","name":"Img_Tycoon_Rank04_Cash","rect":[440.8,19.87,36.13,27.1],"parentSize":[486.87,75.88],"assetRole":"cash","fit":"contain","imageRegion":[148,308,959,680],"interaction":"none"},
  // [53] text r4-cash-qty ← rank-4
  {"op":"text","key":"r4-cash-qty","parentKey":"rank-4","name":"Txt_Tycoon_Rank04_CashQty","rect":[436.28,44.26,49.68,22],"parentSize":[486.87,75.88],"nativeText":"","partRole":"label","interaction":"none","style":{"size":19,"weight":800,"line":22,"align":"가운데","vertical":"가운데","color":"#ffdc20","stroke":1,"strokeColor":"#414139"},"observation":"unconfirmed; blank, not zero"},
  // [54] group self-row ← panel
  {"op":"group","key":"self-row","parentKey":"panel","name":"Group_Tycoon_SelfRank","rect":[16.26,696.43,486.87,75.88],"parentSize":[520.29,828.31],"kind":"panel","interaction":"none","sourceRole":"fixed-self-row","anchorUi":"top-left-fixed-size","note":"Outside viewport/content, later-painted fixed sibling. Observed source539x81 normalized common539x84 columns."},
  // [55] panel self-fill ← self-row
  {"op":"panel","key":"self-fill","parentKey":"self-row","name":"BG_Tycoon_SelfRank","rect":[0,0,486.87,75.88],"parentSize":[486.87,75.88],"assetRole":"self-row-purple-fill9","frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0],"partRole":"background","interaction":"none"},
  // [56] panel self-frame ← self-row
  {"op":"panel","key":"self-frame","parentKey":"self-row","name":"Frame_Tycoon_SelfRank","rect":[0,0,486.87,75.88],"parentSize":[486.87,75.88],"assetRole":"drawer-white-frame9","frameMode":"9","slices":[27,27,27,27],"edges":[18,18,18,18],"padding":[0,0,0,0],"partRole":"frame","interaction":"none"},
  // [57] text self-rank ← self-row
  {"op":"text","key":"self-rank","parentKey":"self-row","name":"Txt_Tycoon_SelfRank_Position","rect":[4.52,4.52,28.0,29.81],"parentSize":[486.87,75.88],"nativeText":"22","partRole":"label","interaction":"none","style":{"size":20,"weight":800,"line":24,"align":"가운데","vertical":"가운데","color":"#36362e","stroke":0,"strokeColor":"#ffffff"}},
  // [58] image self-avatar ← self-row
  {"op":"image","key":"self-avatar","parentKey":"self-row","name":"Img_Tycoon_SelfRank_SNSAvatar","rect":[36.13,9.94,57.81,57.81],"parentSize":[486.87,75.88],"assetRole":"sns","fit":"contain","imageRegion":[60,75,1111,1111],"interaction":"none","note":"Reuse actual Shop Img_Shop_SNSAvatar; crop60/75/1111/1111."},
  // [59] text self-name ← self-row
  {"op":"text","key":"self-name","parentKey":"self-row","name":"Txt_Tycoon_SelfRank_Name","rect":[106.59,5.42,221.3,25.29],"parentSize":[486.87,75.88],"nativeText":"현중","partRole":"label","interaction":"none","style":{"size":20,"weight":800,"line":24,"align":"왼쪽","vertical":"가운데","color":"#36362e","stroke":0,"strokeColor":"#ffffff"}},
  // [60] solid self-score-bg ← self-row
  {"op":"solid","key":"self-score-bg","parentKey":"self-row","name":"BG_Tycoon_SelfRank_Score","rect":[105.68,33.42,153.56,30.71],"parentSize":[486.87,75.88],"geometry":"capsule","partRole":"background","interaction":"none","style":{"fill":"#9da7d8","opacity":1,"strokeWidth":0,"strokeColor":"#ffffff"}},
  // [61] image self-score-pet ← self-row
  {"op":"image","key":"self-score-pet","parentKey":"self-row","name":"Img_Tycoon_SelfRank_ScorePet","rect":[110.2,36.13,27.1,25.29],"parentSize":[486.87,75.88],"assetRole":"shared-tycoon-pet-progress-and-score","fit":"contain","imageRegion":[0,0,120,120],"interaction":"none"},
  // [62] text self-score ← self-row
  {"op":"text","key":"self-score","parentKey":"self-row","name":"Txt_Tycoon_SelfRank_Score","rect":[142.72,34.32,109.3,28.9],"parentSize":[486.87,75.88],"nativeText":"104","partRole":"label","interaction":"none","style":{"size":25,"weight":800,"line":28.9,"align":"가운데","vertical":"가운데","color":"#36362e","stroke":1,"strokeColor":"#ffffff"}},
  // [63] image self-cash ← self-row
  {"op":"image","key":"self-cash","parentKey":"self-row","name":"Img_Tycoon_SelfRank_Cash","rect":[440.8,19.87,36.13,27.1],"parentSize":[486.87,75.88],"assetRole":"cash","fit":"contain","imageRegion":[148,308,959,680],"interaction":"none"},
  // [64] text self-cash-qty ← self-row
  {"op":"text","key":"self-cash-qty","parentKey":"self-row","name":"Txt_Tycoon_SelfRank_CashQty","rect":[436.28,44.26,49.68,22],"parentSize":[486.87,75.88],"nativeText":"40K","partRole":"label","interaction":"none","style":{"size":19,"weight":800,"line":22,"align":"가운데","vertical":"가운데","color":"#ffdc20","stroke":1,"strokeColor":"#414139"}},
  // [65] group close ← ROOT
  {"op":"group","key":"close","parentKey":"ROOT","name":"Btn_Tycoon_Close","rect":[253.5,932,44,44],"parentSize":[551,984],"kind":"button","interaction":"action","hitShape":"rectangle","ariaLabel":"닫기","buttonState":{"enabled":true,"mode":"tint","targetGraphic":"self"},"anchorUi":"bottom-center-fixed-size","note":"Owner binds native Close/refocus. Bottom8logicalpx compensates source height excess."},
  // [66] text close-glyph ← close
  {"op":"text","key":"close-glyph","parentKey":"close","name":"Txt_Tycoon_CloseGlyph","rect":[0,0,44,44],"parentSize":[44,44],"nativeText":"×","partRole":"label","interaction":"parent","style":{"size":36,"weight":700,"line":44,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#ffffff"}},
  // [67] group info ← ROOT
  {"op":"group","key":"info","parentKey":"ROOT","name":"Btn_Tycoon_Info","rect":[9.16,28.13,44,44],"parentSize":[551,984],"kind":"button","interaction":"none","hitShape":"rectangle","ariaLabel":"정보","anchorUi":"top-left-fixed-size","note":"Visual bounds only, unobserved body/action unset."},
  // [68] image info-bg ← info
  {"op":"image","key":"info-bg","parentKey":"info","name":"Img_Tycoon_InfoDisc","rect":[5,5,34,34],"parentSize":[44,44],"assetRole":"info-blue-disc-fixed","fit":"contain","imageRegion":[0,0,64,64],"interaction":"none"},
  // [69] text info-glyph ← info
  {"op":"text","key":"info-glyph","parentKey":"info","name":"Txt_Tycoon_InfoGlyph","rect":[5,5,34,34],"parentSize":[44,44],"nativeText":"i","partRole":"label","interaction":"none","style":{"size":26,"weight":800,"line":30,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#ffffff"}}
];

export default operations;
