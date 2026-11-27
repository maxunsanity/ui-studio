// Declarative data only: no imports, browser calls, IDs or design-document writes.
// Execute operations[index] through native UI and checkpoint its actual result before advancing.
export const metadata = {
  "format": "native-ui-operation-data-v1",
  "logicalSize": [
    551,
    984
  ],
  "externalRootKey": "ROOT",
  "checkpointAfterEveryOperation": true,
  "rootNativeUiRequirements": {
    "kind": "modal",
    "rootMode": "fullscreen",
    "engineDim": false,
    "blocking": true,
    "dismissOnEscape": true,
    "singleCustomDimOpacity": 0.7
  },
  "rootOwnerHandles": [
    "actual modal creation/name and ROOT binding",
    "incoming MainSALE demo-version mapping",
    "actual Close native edge/refocus",
    "native screen presentation settings",
    "save/reopen and desktop/mobile/native input QA"
  ],
  "executionRules": [
    "Data only: never assign this module to a design document or call a design/API setter. Each operation is implemented by existing native UI clicks/current AX fields only.",
    "Resolve keys to IDs and visible parent names from actual native UI results. No IDs or UUIDs are provided here.",
    "rect is local logicalpx and parentSize is authored parent W/H; pass those to the existing rectPx UI helper. All operation keys are unique checkpoints.",
    "Prepare an empty target/template using native UI, inspect duplicated children, and preserve originals. Parent each created element explicitly.",
    "For frames: UI import path→wait for actual source size/sha image→set slices/edges/padding with current AX values→Tab→re-read.",
    "For images: after import waits, apply the declared imageRegion via native X/Y/W/H fields+Tab→이미지 영역 적용→re-read. This prevents an inherited template crop.",
    "Text style keys match main05Helpers.typo: size/weight/line/align/vertical/color/stroke/strokeColor.",
    "anchorUi is a native inspector requirement, never a serialized rectTransform injection. Keep Panel/Title/Boost/Close sibling fixed geometry under the same ROOT; Dim stretches full ROOT."
  ],
  "readSources": [
    "racing09-assembly-quick-sheet.json",
    "racing-event-assets.json",
    "racing-ui-assets.json",
    "main05-ui-assembly.mjs",
    "browser-ui-helpers.mjs",
    "r173 Page_Shop_Offers original structure",
    "authoring/racing-event/v001/common_event-racing_scene_normal_v001.source.png actual view"
  ],
  "sourceBoundary": {
    "originalSize": [
      418,
      747
    ],
    "widthScale": 1.3181818181818181,
    "widthScaledHeight": 984.6818181818181,
    "nativeHeightDelta": -0.6818181818181301,
    "sourceTitle": [
      "레이싱",
      "챔피언"
    ],
    "sourceSceneInterpretation": "Prepared dark/purple two-car scene is new art; source small yellow third car is not reproduced. No original font/pixel identity claimed.",
    "unimplementedExactDecoration": "Source lower diagonal green road field is not a supplied separate native texture; charcoal panel and supplied scene are used without inventing a new art asset."
  },
  "limits": [
    "Prices/rewards/time/availability are source fixtures, not a real payment, reward or countdown API.",
    "No browser or UI operation is executed by importing this data. No helper imports, hidden-state/API calls, generated IDs or external design JSON writes.",
    "No original font/Unity/pixel equality claimed; actual responsive/dim/keyboard/close/focus checks belong to the root execution."
  ],
  "operationIndexBase": 0,
  "nativeTemplateRequirement": "Use actual empty native group/button/image/text templates; clear inherited auto-layout/skin/crop through UI as needed and inspect copied descendants. ROOT name/ID belongs to the owner."
};

export const assets = {
  "panel-charcoal-fill9": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_panel-charcoal-fill9_normal_v001.webp","sha":"4405062518def9d34c2ffb38a9a5c436e28c439c49b3d1a4f18c05f27c82db62","sourceSize":[128,96],"imageRegion":[0,0,128,96],"frameMode":"9","slices":[27,27,27,27],"edges":[40,40,40,40],"padding":[0,0,0,0]},
  "increase-red-disc-fixed": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_increase-red-disc-fixed_normal_v001.webp","sha":"846259916fdc6d5b3f97c10dd8920191e15e106eee359b31664695b79aa6965c","sourceSize":[128,128],"imageRegion":[0,0,128,128]},
  "close-orange-disc-fixed": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_close-orange-disc-fixed_normal_v001.webp","sha":"3f0ea6df10c9ec93b072e7a4f3b125dc71e26da1699892f67370edd92bf522a2","sourceSize":[96,96],"imageRegion":[0,0,96,96]},
  "starter-green-ribbon3": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_starter-green-ribbon3_normal_v001.webp","sha":"fade61a1436c27afeb61ca3cc98be8bcb1106aa11e022a286ebdae7e5f05eb63","sourceSize":[160,48],"imageRegion":[0,0,160,48],"frameMode":"3","slices":[0,24,0,24],"edges":[0,16,0,16],"padding":[0,0,0,0]},
  "checkered-flag-left-fixed": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_checkered-flag-left-fixed_normal_v001.webp","sha":"49baf9ec460c21368a0acc3147afa44739d13631c389852b7106e51055bbe07d","sourceSize":[96,80],"imageRegion":[0,0,96,80]},
  "checkered-flag-right-fixed": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_checkered-flag-right-fixed_normal_v001.webp","sha":"07fff058c0d87f273ab82cd0414facdc99617fceb2d94c225f348f65d65ec397","sourceSize":[96,80],"imageRegion":[0,0,96,80]},
  "confetti-cluster-fixed": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_confetti-cluster-fixed_normal_v001.webp","sha":"f9005cbdcef5f020a2bfea2331c9721f848287b065d775732295d1014f857749","sourceSize":[96,128],"imageRegion":[0,0,96,128]},
  "stopwatch-fixed": {"path":"/ui-studio/source/assets/import-staging/racing-ui/common_racing_stopwatch-fixed_normal_v001.webp","sha":"20155982bef39f01e01c6319a5004ec40169abb2d7d0ab843d4ec81952c43051","sourceSize":[64,64],"imageRegion":[0,0,64,64]},
  "drawer-white-frame9": {"path":"/ui-studio/source/assets/import-staging/menu-ui/common_menu_drawer-white-frame9_normal_v001.webp","sha":"6f02da9ecc27c6db3efb379e0006a44017d65156991ff102b260a8a9c070500a","sourceSize":[128,96],"imageRegion":[0,0,128,96],"frameMode":"9","slices":[27,27,27,27],"edges":[40,40,40,40],"padding":[0,0,0,0]},
  "button-send3": {"path":"/ui-studio/source/assets/import-staging/friends-ui/common_friends_button-send3_normal_v001.webp","sha":"ea2db7909fff4b4fad71e16dc1126186df552404e0b116bac30caa1d3cb7fa66","sourceSize":[128,48],"imageRegion":[0,0,128,48],"frameMode":"3","slices":[0,24,0,24],"edges":[0,39,0,39],"padding":[0,0,0,0]},
  "racing-adventure-scene": {"path":"/ui-studio/source/assets/import-staging/racing-event/common_event-racing_scene_normal_v001.webp","sha":"e0ca769640ba9fbaeebae6a2cb16e12c865446a121dcd38a47162bdafacc2241","sourceSize":[700,467],"imageRegion":[0,0,700,467]},
  "root-black-fill9": {"path":"/ui-studio/source/assets/import-staging/menu-ui/common_menu_dim-fill9_normal_v001.webp","sha":"a285bdbe2a9f84ff2bd19022cfe45d1f11eda49d8003665ef796db6f2963b9c6","sourceSize":[32,32],"frameMode":"9","slices":[0,0,0,0],"edges":[0,0,0,0],"padding":[0,0,0,0]},
  "reward-dice": {"path":"/ui-studio/source/assets/import-staging/album-icons/common_album-reward-dice-stack_icon_normal_v001.webp","sha":"27aa6548786a412c9259097f7b81afad128d90ae48d271da7e6e5719b78de80c","sourceSize":[266,264],"imageRegion":[0,0,266,264],"reuseFromNativeName":"Img_Shop_Offer_Dice"},
  "reward-cash": {"path":"/ui-studio/source/assets/import-staging/hud-top/common_hud-top_cash-icon_normal_v003.webp","sha":"5f2163a6a738a77769f5371b89d0951b33810e3a28ebf4c38c578e57280fb5c2","sourceSize":[1254,1254],"imageRegion":[148,308,959,680],"reuseFromNativeName":"Img_Shop_Offer_Cash"}
};

export const operations = [
  // [00] solid dim ← ROOT
  {"op":"solid","key":"dim","parentKey":"ROOT","name":"Dim_Racing_Backdrop","rect":[0,0,551,984],"parentSize":[551,984],"assetRole":"root-black-fill9","frameMode":"9","slices":[0,0,0,0],"edges":[0,0,0,0],"padding":[0,0,0,0],"style":{"fill":"#000000","opacity":0.7,"strokeWidth":0},"interaction":"none","anchorUi":"stretch-full-root","partRole":"background"},
  // [01] group panel ← ROOT
  {"op":"group","key":"panel","parentKey":"ROOT","name":"Group_Racing_OfferPanel","rect":[43.5,126.55,474.55,810.68],"parentSize":[551,984],"kind":"panel","interaction":"none","anchorUi":"top-left-fixed-size"},
  // [02] panel panel-bg ← panel
  {"op":"panel","key":"panel-bg","parentKey":"panel","name":"BG_Racing_Offer","rect":[0,0,474.55,810.68],"parentSize":[474.55,810.68],"partRole":"background","assetRole":"panel-charcoal-fill9","frameMode":"9","slices":[27,27,27,27],"edges":[40,40,40,40],"padding":[0,0,0,0],"interaction":"none"},
  // [03] image scene ← panel
  {"op":"image","key":"scene","parentKey":"panel","name":"Img_Racing_Scene","rect":[3.95,90.95,467.95,295.27],"parentSize":[474.55,810.68],"assetRole":"racing-adventure-scene","fit":"contain","imageRegion":[0,0,700,467],"interaction":"none","note":"Use full prepared two-car scene with contain; source band and new art ratios differ. Do not bake text/rewards into art."},
  // [04] panel panel-frame ← panel
  {"op":"panel","key":"panel-frame","parentKey":"panel","name":"Frame_Racing_Offer","rect":[0,0,474.55,810.68],"parentSize":[474.55,810.68],"partRole":"frame","assetRole":"drawer-white-frame9","frameMode":"9","slices":[27,27,27,27],"edges":[40,40,40,40],"padding":[0,0,0,0],"interaction":"none"},
  // [05] image confetti-top ← panel
  {"op":"image","key":"confetti-top","parentKey":"panel","name":"Img_Racing_ConfettiTop","rect":[28,14,32,42.67],"parentSize":[474.55,810.68],"assetRole":"confetti-cluster-fixed","fit":"contain","imageRegion":[0,0,96,128],"interaction":"none","note":"Prepared geometric decoration placed inside Panel bounds; production approximation."},
  // [06] image confetti-bottom ← panel
  {"op":"image","key":"confetti-bottom","parentKey":"panel","name":"Img_Racing_ConfettiBottom","rect":[5,726,48,64],"parentSize":[474.55,810.68],"assetRole":"confetti-cluster-fixed","fit":"contain","imageRegion":[0,0,96,128],"interaction":"none","note":"Keep inside own Panel bounds; no blanket overflow allowance."},
  // [07] group rewards ← panel
  {"op":"group","key":"rewards","parentKey":"panel","name":"Group_Racing_Rewards","rect":[76.45,387.54,332.18,151.59],"parentSize":[474.55,810.68],"kind":"panel","interaction":"none"},
  // [08] image reward-dice ← rewards
  {"op":"image","key":"reward-dice","parentKey":"rewards","name":"Img_Racing_RewardDice","rect":[15.82,6.59,109.41,94.91],"parentSize":[332.18,151.59],"assetRole":"reward-dice","fit":"contain","imageRegion":[0,0,266,264],"interaction":"none"},
  // [09] text reward-dice-text ← rewards
  {"op":"text","key":"reward-dice-text","parentKey":"rewards","name":"Txt_Racing_RewardDice","rect":[25.05,93.59,92.27,47.45],"parentSize":[332.18,151.59],"nativeText":"525","partRole":"label","interaction":"none","style":{"size":40,"weight":900,"line":44,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":2,"strokeColor":"#34343a"}},
  // [10] image reward-cash ← rewards
  {"op":"image","key":"reward-cash","parentKey":"rewards","name":"Img_Racing_RewardCash","rect":[197.73,35.59,106.77,61.95],"parentSize":[332.18,151.59],"assetRole":"reward-cash","fit":"contain","imageRegion":[148,308,959,680],"interaction":"none"},
  // [11] text reward-cash-text ← rewards
  {"op":"text","key":"reward-cash-text","parentKey":"rewards","name":"Txt_Racing_RewardCash","rect":[209.59,96.23,84.36,43.5],"parentSize":[332.18,151.59],"nativeText":"54K","partRole":"label","interaction":"none","style":{"size":40,"weight":900,"line":44,"align":"가운데","vertical":"가운데","color":"#ffe329","stroke":2,"strokeColor":"#34343a"}},
  // [12] group buy ← panel
  {"op":"group","key":"buy","parentKey":"panel","name":"Btn_Racing_Buy","rect":[97.55,626.14,276.82,77.77],"parentSize":[474.55,810.68],"kind":"button","interaction":"action","hitShape":"rectangle","buttonState":{"enabled":true,"mode":"tint","targetGraphic":"self"},"shadow":{"x":0,"y":3,"blur":3,"opacity":0.25},"note":"Only visual input/price; actual purchase/API remains unset. This wrapper plus background and native price are the three Buy parts."},
  // [13] panel buy-bg ← buy
  {"op":"panel","key":"buy-bg","parentKey":"buy","name":"BG_Racing_Buy","rect":[0,0,276.82,77.77],"parentSize":[276.82,77.77],"partRole":"background","assetRole":"button-send3","frameMode":"3","slices":[0,24,0,24],"edges":[0,39,0,39],"padding":[0,0,0,0],"interaction":"parent"},
  // [14] text price ← buy
  {"op":"text","key":"price","parentKey":"buy","name":"Txt_Racing_Price","rect":[0,0,276.82,77.77],"parentSize":[276.82,77.77],"nativeText":"₩4,400","partRole":"label","interaction":"parent","style":{"size":40,"weight":900,"line":44,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#000000"}},
  // [15] group time ← panel
  {"op":"group","key":"time","parentKey":"panel","name":"Group_Racing_Time","rect":[148.95,718.4,176.64,34.27],"parentSize":[474.55,810.68],"kind":"panel","interaction":"none"},
  // [16] image clock ← time
  {"op":"image","key":"clock","parentKey":"time","name":"Img_Racing_Clock","rect":[0,3,28,28],"parentSize":[176.64,34.27],"assetRole":"stopwatch-fixed","fit":"contain","imageRegion":[0,0,64,64],"interaction":"none"},
  // [17] text time-text ← time
  {"op":"text","key":"time-text","parentKey":"time","name":"Txt_Racing_Time","rect":[34.27,1.32,142.36,32.95],"parentSize":[176.64,34.27],"nativeText":"22시간 56분","partRole":"label","interaction":"none","style":{"size":24,"weight":700,"line":28,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#000000"}},
  // [18] text availability ← panel
  {"op":"text","key":"availability","parentKey":"panel","name":"Txt_Racing_Availability","rect":[171.94,760.44,132,28],"parentSize":[474.55,810.68],"nativeText":"2/2 가능","partRole":"label","interaction":"none","style":{"size":16,"weight":600,"line":20,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#000000"}},
  // [19] group title ← ROOT
  {"op":"group","key":"title","parentKey":"ROOT","name":"Group_Racing_Title","rect":[154.23,51.41,247.82,158.18],"parentSize":[551,984],"kind":"panel","interaction":"none","anchorUi":"top-left-fixed-size"},
  // [20] image flag-left ← title
  {"op":"image","key":"flag-left","parentKey":"title","name":"Img_Racing_FlagLeft","rect":[2.64,51.41,51.41,48.77],"parentSize":[247.82,158.18],"assetRole":"checkered-flag-left-fixed","fit":"contain","imageRegion":[0,0,96,80],"interaction":"none"},
  // [21] image flag-right ← title
  {"op":"image","key":"flag-right","parentKey":"title","name":"Img_Racing_FlagRight","rect":[199.05,54.05,48.77,44.82],"parentSize":[247.82,158.18],"assetRole":"checkered-flag-right-fixed","fit":"contain","imageRegion":[0,0,96,80],"interaction":"none"},
  // [22] panel ribbon ← title
  {"op":"panel","key":"ribbon","parentKey":"title","name":"BG_Racing_StarterRibbon","rect":[23.73,112.05,201.68,43.5],"parentSize":[247.82,158.18],"partRole":"background","assetRole":"starter-green-ribbon3","frameMode":"3","slices":[0,24,0,24],"edges":[0,16,0,16],"padding":[0,0,0,0],"interaction":"none"},
  // [23] text title-1 ← title
  {"op":"text","key":"title-1","parentKey":"title","name":"Txt_Racing_TitleLine1","rect":[35.59,5.27,179.27,58],"parentSize":[247.82,158.18],"nativeText":"레이싱","partRole":"label","interaction":"none","style":{"size":52,"weight":900,"line":56,"align":"가운데","vertical":"가운데","color":"#ffd43b","stroke":3,"strokeColor":"#33376e"}},
  // [24] text title-2 ← title
  {"op":"text","key":"title-2","parentKey":"title","name":"Txt_Racing_TitleLine2","rect":[48.77,56.68,147.64,55.36],"parentSize":[247.82,158.18],"nativeText":"챔피언","partRole":"label","interaction":"none","style":{"size":46,"weight":900,"line":52,"align":"가운데","vertical":"가운데","color":"#8ed8ff","stroke":3,"strokeColor":"#33376e"}},
  // [25] text starter ← title
  {"op":"text","key":"starter","parentKey":"title","name":"Txt_Racing_StarterPack","rect":[23.73,112.05,201.68,43.5],"parentSize":[247.82,158.18],"nativeText":"스타터 팩","partRole":"label","interaction":"none","style":{"size":22,"weight":800,"line":26,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#000000"}},
  // [26] group boost ← ROOT
  {"op":"group","key":"boost","parentKey":"ROOT","name":"Group_Racing_Boost","rect":[431.05,357.23,116,116],"parentSize":[551,984],"kind":"panel","interaction":"none","anchorUi":"top-left-fixed-size","note":"Source88-square badge deliberately overhangs Panel right edge by22sourcepx, yet ends before ROOT551."},
  // [27] image boost-disc ← boost
  {"op":"image","key":"boost-disc","parentKey":"boost","name":"Img_Racing_BoostDisc","rect":[0,0,116,116],"parentSize":[116,116],"assetRole":"increase-red-disc-fixed","fit":"contain","imageRegion":[0,0,128,128],"interaction":"none"},
  // [28] text boost-percent ← boost
  {"op":"text","key":"boost-percent","parentKey":"boost","name":"Txt_Racing_BoostPercent","rect":[4,20,108,40],"parentSize":[116,116],"nativeText":"235%","partRole":"label","interaction":"none","style":{"size":29,"weight":800,"line":32,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#000000"}},
  // [29] text boost-label ← boost
  {"op":"text","key":"boost-label","parentKey":"boost","name":"Txt_Racing_BoostLabel","rect":[4,54,108,42],"parentSize":[116,116],"nativeText":"증가!","partRole":"label","interaction":"none","style":{"size":29,"weight":800,"line":32,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#000000"}},
  // [30] group close ← ROOT
  {"op":"group","key":"close","parentKey":"ROOT","name":"Btn_Racing_Close","rect":[487.48,117.07,44,44],"parentSize":[551,984],"kind":"button","interaction":"action","hitShape":"rectangle","anchorUi":"top-left-fixed-size","semanticIntent":"close-owner-connects-native-edge","note":"No ID/Close transition is created in this data. Owner binds the actual native wrapper ID after creation."},
  // [31] image close-disc ← close
  {"op":"image","key":"close-disc","parentKey":"close","name":"Img_Racing_CloseDisc","rect":[2,2,40,40],"parentSize":[44,44],"assetRole":"close-orange-disc-fixed","fit":"contain","imageRegion":[0,0,96,96],"interaction":"parent"},
  // [32] text close-glyph ← close
  {"op":"text","key":"close-glyph","parentKey":"close","name":"Txt_Racing_Close","rect":[0,0,44,44],"parentSize":[44,44],"nativeText":"×","partRole":"label","interaction":"parent","style":{"size":28,"weight":800,"line":34,"align":"가운데","vertical":"가운데","color":"#ffffff","stroke":0,"strokeColor":"#000000"}}
];

export default operations;
