# Tile TS13/15/16 follow-up for r157 assembly

Read-only audit of latest saved **r165** (2026-11-19T03:04:43.146Z), project ux-25ecc98a. Proposal awaiting root GUI QA. First requested baseline was r157; filename preserves that task identifier.

SHA256 f1276bdbd9515554a28175b024bddf281778817aa10c67c53a43d4bc6854b8b6. Saved source: /Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/ux-25ecc98a.json. Total 16 screens/737 elements/6 edges.

## Coverage

|Family|Actions present|Elements|Parent/global/local/text/anchor mismatches|Button-caption mismatches|Blank text|Broken parent input|
|---|---:|---:|---:|---:|---:|---:|
|TS13|63/63|89|1|0|0|0|
|TS15|53/53|64|0|0|0|0|
|TS16|24/24|29|0|0|0|0|

All140 planned actions exist with exact names, native explicit copy and ABS504x894 rectangles. Parent-relative local logical rectangles also match recipe-derived values. The sole recipe difference is the intentional TS13 scene anchor correction stretch -> stretch-x; other anchor hints match. The table records this one documented difference, not an unresolved failure. Normal factory captions are separate native text, all direct children of owning Btn; no caption cleanup is required. TS15 transparent-button labels use the existing normal helper naming rather than _Caption; these are legitimate labels.

## TS13 short-height issue resolved in r165

- key scene / Panel_TSV_TS13_scene / element-19ee855c-9421-4d70-89b6-5275434933e9.
- First observed r157 and r159: the exact recipe stretch anchor with sizeDeltaH=-680 computed scene height -8 at logical504x672. Source resolver rejected scene and10 descendants. This was a responsive recipe-hint issue, not a missing assembly action or observed DOM/product defect.
- Current saved r165: stretch-x min0,1/max1,1/pivot0.5,1, position0,0, sizeDelta0,214. Authored rect remains0,0,504,214. The parent sheet remains y214.
- Current resolver failures atH672/894/1091: TS13=0/0/0, TS15=0/0/0, TS16=0/0/0. The one anchor difference in the coverage table is this documented correction. No further model edit is identified. GUI clipping/input/scroll QA remains root's follow-up.

## Scroll and short-height calculations

|Family/viewport|H894 viewport|H672 viewport|Fixed child content H|Model extraY atH894 / H672|
|---|---|---|---:|---:|
|TS13 list element-2ab585c0-f431-4a4d-bce9-8e76d30dab5f|14,420,476,306|14,420,476,84|352|46 / 268|
|TS15 messages element-15b40451-ab91-4db5-9549-7d0c25e5bb18|18,354,468,444|18,354,468,222|464|20 / 242|

Both viewports store scroll-y, and rows/text retain fixed sizes. TS13 list-to-Auto gap8 and Auto-to-Footer gap12 remain atH672; TS15 viewport-to-footer gap16 remains. Below-viewport rows/names are legitimate scroll content. AtH1091 both viewports exceed their child content, yielding model extraY0. These are source calculations, not observed scrollTop or runtime scrollHeight.

TS16 has0 resolution failures atH672/894/1091. AtH672 centered portrait reaches screen y33, trade bottom619, hint starts634; contents stay inside screen. Jason portrait and Close intentionally protrude outside orangePortraitBack per recipe; no branch stores clipping. Do not clamp or reparent these.

## Extra leaves and preserved captions

TS13 has2 allowed alpha leaves: unlockToast_Tint element-41f477c2-4ee3-4c71-9247-02d6cdcf3773 opacity0.612, arrivalToast_Tint element-dcb4bbc8-591a-4046-b157-cb3237c9e60d opacity0.659. Both match their parent area with stretch anchors; parent role=frame and opacity1, so sibling native text is not dimmed by parent opacity.

Remaining extras are expected native factory BG/captions, or the explicit normal helper labels for transparent Btns. Nonempty captions=11(TS13),7(TS15),2(TS16); blank text=0. BG presence/opaque stored fill alone does not establish a visible extra rectangle because custom-skin-image runtime CSS suppresses that surface.

## Evidence/limits

JSON companion includes every action ID, parent ID, actual global/local rect, actual anchor, extra leaf and short-height resolver failure. Used recipe a-actions.json and actual responsive-layout/rect-transform/parts helpers; no model injection. No browser/DOM/render/keyboard/mobile touch/asset HTTP/product tests or visual equivalence QA was performed. No product bug is asserted from these data. Source, design JSON, metadata and shared STATUS/report writes0. Output files are new and earlier audits remain preserved.

Initial generated audit prose was corrected to the same r165 data before delivery; prior draft is preserved at /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/review-current/_backup/r157-followup-initial-20261119_120535.
