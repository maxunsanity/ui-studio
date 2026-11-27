# B complete follow-up requested at r316

Read-only current snapshot **r320**, 2026-11-19T04:41:29.296Z, SHA256b69d9fd69e86655559927508efe5f586725fb8132c200c9e2c9a683ec3ef667a, project ux-25ecc98a. Proposal awaiting root final GUI QA. Scope onlyTS23/24/27/28/29/30/31 in the same saved design.

## Coverage after declared native replacements

|Family|Original actions|Adjusted present|Actual parts|Unexpected differences|Duplicate planned names|Blank text|Broken parent input|
|---|---:|---:|---:|---:|---:|---:|---:|
|TS23|12|12/12|13|0|0|0|0|
|TS24|30|30/30|37|0|0|0|0|
|TS27|6|7/7|7|0|0|0|0|
|TS28|27|27/27|29|0|0|0|0|
|TS29|41|41/41|50|0|0|0|0|
|TS30|65|65/65|79|0|0|0|0|
|TS31|26|24/24|29|0|0|0|0|

Original207 action instructions are accounted for by the declared replacements. Adjusted contract has206 actions: TS27 dim adds1, TS29 compose/native input/native tabs replace the two old Btns without source-content duplication, TS31 custom24 replaces original26. Missing/parent/global+local rect/text/explicit-anchor findings are in JSON; ordinary BG/captions are kept separate from expected actions.

## Intentional structures verified from saved fields

- TS27 root element-d434d433-6a36-4161-a467-3e1ba440b0d4: frame/action, no skin; separate dim element-ab512840-14a5-4b45-b482-fe9558f6177f, black opacity0.62, root child, stretch.
- TS29 Tabs element-52e2398e-c7b8-4f92-9faf-a1d290247be1: initial state, first option binds element-f57f1f98-8af0-4cf6-9ebb-8b59f5f37d09, private unbound. Compose element-89244121-9842-4b17-b129-8578007e7ef7 preserves230x47; new Input element-b38ea675-f884-4632-a144-6e06e06b2dec is137x47 at209,829, input/maxLength1000. Fixed prefix ends x207; real input starts209 (2px gap). Old placeholder opacity0; no duplicate painted placeholder is prescribed. Old State/Private Btns absent.
- TS30 six card owners keep130x172 and top-left anchors. All six dots are partRole=badge with enabled/dot/value1/hideZero/maxDisplay99 equal to Mia. No unseen third-row residents were added.
- TS31 custom recipe: root plain/none; outside-dismiss is an action sibling of outer; outer modeblock/stretch-y; content stretch/scroll-y. Story tabs element-e8b5af1f-d8f8-4b4e-9790-0094ccd49c74 use font18, four labels, initial story-i; only I binds the existing story panel, II-IV stay unbound. The four obsolete Btns are absent. Root's runtime II/I and chat typing checks are reported separately, not repeated here.

## Current numerical geometry

All scoped elements resolve to positive boxes atH672/894/1091. Raw outside-screen boxes inside chat/roster/profile scroll or clip descendants are expected content, not page overflow or missing parts.

Unclipped outside-screen boxes in the current snapshot:

- TS28 H672 Txt_TSV_TS28_Congrats [element-dd35a3e3-5afa-4af0-a930-1e1962f770ee] {"x":55,"y":-8,"w":401,"h":101}

TS28 Congrats is the remaining short-height paint-review candidate if listed above: its centered reference box reaches y=-8 atH672. Actual glyph/image clipping was not observed by this reviewer; no arbitrary source-coordinate fix is imposed.

TS31 responsive history: r316 percent header leaves scaled with content and StoryTabDot detached from fixed tabs. Root's r317 native top-left correction was observed. Current JSON includes three heights for portrait/dot/tabs; verify those values rather than reapplying the old recommendation. The desired relationship is dot y682/H12 with tabs y685, portrait119x151 across all three heights. Its story/reward/tabs beyond the short viewport belong to scroll-y content.

## Native control source gap and navigation correction

- TS24 skipBox element-5e7b8bdb-4b00-41d5-83e7-b031dc86c383: B recipe visual box/text is present, but actual toggle control remains unconfigured. Actual skip/re-recruit outcome remains unobserved; do not invent a result. This is a source implementation gap, not a missing generated action.
- TS30 footer Mailbox/Catalog are cross-page navigation buttons, NOT same-screen native tabs. Existing Btn IDs element-2156e28c-9ed9-441e-bb34-bf4191ec3b20 / element-612ac0f0-056e-4373-85f5-e61b6a0a5edf are the correct control category for TS15 Mailbox / TS30 Catalog navigation. Root will wire proven routes. Native tabs/panels are not required and their absence is not a defect. The earlier audit classification was wrong and is removed here.

Private chat, storyII-IV, skip outcome, source skill art, claim-all/re-recruit results and unknown icons remain unobserved; this audit does not invent them. TS28 Congrats atH672 remains a low-confidence paint-boundary candidate; this amendment does not alter its evidence.

## Assets and source semantics

Scoped unique asset refs16: 0 missing/hash failures. Image reference/atlas region and panel/button normal texture expectations against original B/custom profile:0 differences. Only referenced files in this workspace were inspected; no other games.

controls.mjs binds tabs to panelId with display/inert restoration and leaves unbound options without fabricated panels. Input stores initial blank value and maxLength/placeholder; root runtime typing is not expected to rewrite the saved initial fixture. The1000 display rule is not treated as a new policy approval. Native badge mode/value fields are stored correctly, while actual rendering/state changes remain root QA.

No GUI/browser/DOM/keyboard/touch/paint/HTTP/product test was run. Root's source696 was not rerun or claimed. Only this new review-current MD/JSON pair is written; source/design/metadata/STATUS/shared report remain untouched.

## Amendment

Root explicitly clarified TS30 footer semantics as cross-page navigation to TS15/TS30. Only the reviewer's incorrect control-gap classification was changed; snapshot r320 and saved-model evidence remain unchanged. Previous MD/JSON preserved at /Users/max/projest_max/ui-studio/_작업/codex/ux-studio/tile-finish-20261119/review-current/_backup/b-complete-r316-before-navigation-correction-20261119_134407_472418. No UI/design/source/STATUS/shared report changes.
