# B scroll children: responsive follow-up

Proposal awaiting review. Read-only saved-model/source calculation; no UI/design/source/shared-report changes.

Snapshot ux-25ecc98a r306, 30 screens. **Additional normal UI fixes: 0.** TS29 feed14 direct children and TS30 roster6 direct cards already use fixed top-left anchors. Parent viewports intentionally stretch vertically and must remain so.

The actual source resolveResponsiveRect plus canvasDevicePreview functions were called for design504x894, phone390x844, phone430x932 and tablet768x1024. Every audited child preserves its baseline absolute logical rect; all20 match recipe rects within0.001logicalpx. This is source math, not actual browser/capture proof.

|Family|Parent|Direct children|Existing contract|Action|
|---|---|---:|---|---|
|TS29|View_TSV_TS29_ChatFeed|14|viewport stretch-y; children fixed top-left|preserve|
|TS30|View_TSV_TS30_SurvivorRoster|6|viewport stretch-y; children fixed top-left|preserve|

## Exact current rows/cards

The JSON contains every actual screen/parent/child ID, absolute504x894 rect, parent-local rect, rectTransform and all profile calculations. This compact table lists the reference geometry:

|Family|Name / ID|Absolute X,Y,W,H|Parent-local X,Y,W,H|
|---|---|---|---|
|TS29|BG_TSV_TS29_SystemMessage / element-8a4e56ae-18b1-43f4-ad87-87f0e648b754|106, 116, 341, 60|102, 3, 341, 60|
|TS29|BG_TSV_TS29_RewardBanner / element-9409e532-6c63-4a92-8bc8-0d6b6af4b630|27, 218, 441, 100|23, 105, 441, 100|
|TS29|Img_TSV_TS29_ChatAvatar01 / element-1ea59133-6b8f-4bc6-b9e3-6b9154e959ad|18, 339, 70, 70|14, 226, 70, 70|
|TS29|Txt_TSV_TS29_ChatSender01 / element-9e6665d2-a063-4803-bead-d244c776af1c|108, 328, 309, 26|104, 215, 309, 26|
|TS29|BG_TSV_TS29_ChatBubble01 / element-0ced7e3e-5c1f-431c-9763-04775da84c18|108, 355, 159, 43|104, 242, 159, 43|
|TS29|Img_TSV_TS29_ChatAvatar02 / element-6c5915fc-2719-4af7-b967-cdaf3bd82bdd|18, 428, 70, 80|14, 315, 70, 80|
|TS29|Txt_TSV_TS29_ChatSender02 / element-a94c9268-b756-4c99-8c09-ed11af9673f6|108, 419, 309, 26|104, 306, 309, 26|
|TS29|BG_TSV_TS29_ChatBubble02 / element-28ef1bcb-5f15-4970-80d1-89123ef2257f|108, 446, 302, 69|104, 333, 302, 69|
|TS29|Img_TSV_TS29_ChatAvatar03 / element-66abcd16-64d9-4519-9a0a-0d415eede2f9|18, 552, 70, 70|14, 439, 70, 70|
|TS29|Txt_TSV_TS29_ChatSender03 / element-0a417ad7-0b03-4a7e-bb4d-bbe4e2f31aad|108, 542, 322, 26|104, 429, 322, 26|
|TS29|BG_TSV_TS29_ChatBubble03 / element-459bb60c-ac7b-425a-bef8-c021a62bd8ee|108, 568, 65, 51|104, 455, 65, 51|
|TS29|Img_TSV_TS29_ChatAvatar04 / element-b583dc60-2050-45b5-adcf-b57e7a5b78be|18, 651, 70, 80|14, 538, 70, 80|
|TS29|Txt_TSV_TS29_ChatSender04 / element-689f654d-2e00-4b97-ab4e-21c55a012335|108, 643, 309, 26|104, 530, 309, 26|
|TS29|BG_TSV_TS29_ChatBubble04 / element-8ffe6c93-a6a4-4530-9410-e93b00938cd8|108, 669, 310, 112|104, 556, 310, 112|
|TS30|Btn_TSV_TS30_Survivor_mia / element-56794442-06ad-4d2f-99b0-d5f7ee7df582|43, 411, 130, 172|16, 6, 130, 172|
|TS30|Btn_TSV_TS30_Survivor_jason / element-f1a772ae-8fb4-46b8-af6f-4a380d9ce563|187, 411, 130, 172|160, 6, 130, 172|
|TS30|Btn_TSV_TS30_Survivor_damon / element-dbba5953-5c7e-4cba-aff6-f19fbce22529|331, 411, 130, 172|304, 6, 130, 172|
|TS30|Btn_TSV_TS30_Survivor_om / element-caead5de-48c0-4a4e-9d9d-a49176c1b891|43, 595, 130, 172|16, 190, 130, 172|
|TS30|Btn_TSV_TS30_Survivor_susan / element-18f44bcb-020f-446b-bcde-b967d22fee28|187, 595, 130, 172|160, 190, 130, 172|
|TS30|Btn_TSV_TS30_Survivor_jimmy / element-bdacc6fa-dde9-42c1-91d0-5ae9bc0154b6|331, 595, 130, 172|304, 190, 130, 172|

## Why no blanket fix

Percentage placement is risky only when its parent dimensions change. Source responsive-layout.mjs resolves fallback x/y/w/h against current parent width/height. These20 direct children now have min=max=pivot[0,1] and fixed sizeDelta, so parent height can change without scaling rows/cards. Percentage text/images inside a fixed bubble/card wrapper do not inherit a changing-height parent and need no blanket conversion.

Keep root/3D stretch, headers width-stretch, centered illustration groups, footer bottom anchors and scroll viewport stretch-y. Do not alter the verified TS29 tabs/input or its shared compose group. TS29 observed state panel remains feed; private stays unlinked. The new input remains137x47 child at global209829 and old placeholder stays hidden.

## Only if a later revision regresses

1. Read current selected actual ID and revision; if its fixed anchor already matches, do nothing.
2. Switch to design504x894 before conversion and compare the exact reference/local rect below. The preset preserves current rect, so converting in an already stretched device view can freeze the wrong size.
3. Restore reference geometry in normal fields if needed, then select top-left only for an affected direct message/card row. Selector: select[data-responsive-field="anchor.preset"]. Exact transform is min/max/pivot[0,1], position[localX,-localY], sizeDelta[W,H].
4. Commit inputs through pressSequentially+Tab; re-find fields after rerender. Save/reopen and test actual390/430 device view and scroll. Do not change the viewport to fixed height.

No product tests/browser/DOM/scroll/capture verification was run by this subagent. Existing rootr301/r281 actual tests remain root evidence, not rerun counts.
