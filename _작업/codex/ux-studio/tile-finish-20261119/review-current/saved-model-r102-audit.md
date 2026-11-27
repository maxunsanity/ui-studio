# Tile saved-model audit: stable r102

Author: codex delegated reviewer. Proposal awaiting review. No browser, server, product source, saved design, metadata or shared STATUS/report edits.

## Smallest actionable fix: two TS19 captions

Both old factory captions remain children of inset BG rather than their owning Btn. The absolute position acquires +12 x and +2 y. Their current owner and text remain valid.

|Action key|Caption ID|Current ABS rect|Target ABS rect|Direct Btn parent|
|---|---|---|---|---|
|deployAll|element-22b55bcd-b9b7-4109-9964-4fba9756f6e1-ui-label|100,822,192,64|88,820,192,64|element-22b55bcd-b9b7-4109-9964-4fba9756f6e1|
|startBattle|element-dace9f9f-4ab5-466f-a1f6-95fa7ba12806-ui-label|306,822,192,64|294,820,192,64|element-dace9f9f-4ab5-466f-a1f6-95fa7ba12806|

Normal UI sequence: select current caption -> reparent directly to own Btn -> set local logical x4/y0/w192/h64 -> preserve native text, ID, interaction=parent, owner rectangle/skin/edges -> Tab/blur -> read back -> save and verify saved revision. This follows the current native helper's existing caption contract. No extra UI or source patch is needed.

## TS14 and missing-label conclusions

- TS14: 29/29 planned actions exist by exact name, with exact recipe parent, explicit text and ABS504x894 rect. No missing text. Only one screen-direct root: Panel_TSV_TS14_root.
- jimmyPortrait element-fdd91bfa-7789-45f7-9152-9bec317af7b0 is already a direct child of Btn jimmy element-83431c16-3b5c-463f-86db-a8c3d37a910c, input=parent, rect188,348,132,146. The reported screen-root leak is not reproduced in r100/r102. Do not recreate/reparent a correct portrait.
- Susan/Jimmy portrait/shade/check each forward input through the correct Btn.
- TS14 close/help/accept _Caption units are legitimate nonempty native text. Empty captions=0. Icon-only Susan/Jimmy empty factory labels were already removed.
- TS19/20/21/22/26: all140 explicit recipe actions exist. Adding TS14 gives169/169. No explicit text mismatch. Restored TS22 advancedLabel/normalLabel and TS26 requiredCopy remain present.
- TS12 exact-name coverage24/34. nicknameInitialPreview and nine old gender button/checkbox/check units were replaced/removed for native input + four actual toggles; do not classify these as accidental missing labels. The pending new control fields require root's later loaded-server/UI check.
- TS22 recruitType H68->77 is a saved recipe difference; no automatic reversion prescribed. TS26 class x220->260 plus separate cloud was a source-backed follow-up from the r72 audit; do not revert it to stale recipe x220.

## Factory/background/clip false positives to avoid

- Stored opaque factory BG fill is not proof of an extra rectangle. skins.mjs:71 assigns custom-skin-image for custom texture, and styles.css around2640 hides the direct background surface. GUI visibility remains root's follow-up. Do not blanket-delete factory BG or suffix-based labels.
- TS14 clipPlate protrudes12px above clipboard exactly as planned. No overflow clip is stored on that branch. Do not clamp it.
- TS09 mission/reward viewport scrolling is intentional; parent-boundary checks must preserve intended scroll content.
- Existing NEW decoration remains2px outside a parent intentionally; not an accidental parent transform error.

## Short-height model risk: GUI unverified

At logical504x672:

|Family/actions|Computed range|Exact IDs|
|---|---|---|
|TS14 susanName/jimmyName|y498..528; paper bottom502|element-e578bb7f-53b3-4ed7-9d6b-3eafed8fb2de / element-285d2b66-7e19-4f2e-913c-0ef5a0662732|
|TS14 accept|y516..580; overlaps names12px|element-11af8afa-865b-472c-af2a-d86a1aa2e321|
|TS12 lower gender inputs|y460..500; body bottom456|element-2c2463c1-b89f-47f2-a438-9a30a2e7e693 / element-e32298ef-8154-4a67-a998-fade3299a481|
|TS12 free|y468..532; overlaps lower inputs|element-66d82aee-ad05-4fad-8117-acc174ef0530|

Cause: stretched body/paper, top-fixed content, bottom-fixed CTA meet at a short height. Logical504x894/1091 preserve TS14 vertical order. Root should verify the supported-device policy and actual GUI, then choose an existing scroll/viewport arrangement if short tablet is required. This audit does not invent an unobserved scroll policy, new positions or text sizes.

## Evidence and limits

Coordinates used the actual exported resolveResponsiveRect; no screenshot or DOM measurements were made. Read: recipe a/b, prior r86 root-cause and r72 audits, Tile production guide, responsive-layout/rect-transform/parts/layout-view/skins + relevant CSS, latest native helper; common guide native/ID/parent/overflow contract. No whole-project graph generation or indiscriminate scan.

Browser/keyboard/mobile touch/actual clipping/visual equivalence remain unverified. No other game,7007 or protected file was accessed. Only new review-current scratch files were written; no overwrites.

## Snapshot

{
  "snapshot": {
    "path": "/Users/max/projest_max/ui-studio/samples/tile-survival/ui-studio/designs/backups/ux-25ecc98a-r102-4b94086a-9aa6-4dbe-b6e3-dd87c1ecb444.json",
    "projectId": "ux-25ecc98a",
    "revision": 102,
    "savedAt": "2026-11-19T02:28:24.417Z",
    "sha256": "97a191b967d5674d71bbad54bfce4e7fa8e841304dd36294204a54664b363a84",
    "screens": 12,
    "elements": 540,
    "transitions": 6
  },
  "latestRead": {
    "revision": 108,
    "savedAt": "2026-11-19T02:32:48.104Z",
    "sha256": "44d43039a36ebdccca1bc388af3659a2b97b9328693c761d2c4b4af6240caa09",
    "allSnapshotScreensDeepEqual": true,
    "newScreens": [
      [
        "screen-4673cfcd-95d2-4370-9c42-a3aaaec902e4",
        "Modal_TSV_ResidentExchange",
        23
      ]
    ]
  }
}
