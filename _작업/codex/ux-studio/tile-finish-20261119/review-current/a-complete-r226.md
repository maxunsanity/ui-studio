# A complete follow-up requested at r226

Latest read-only saved snapshot **r233**, 2026-11-19T03:39:50.292Z, SHA256 7c6ff5286f37b2247c2b46fab3d83ee863445aa79b499d54d519bc71dcbad698. Project ux-25ecc98a, 26 screens/913 elements/6 edges. Filename preserves the requested baseline r226; the table refers to the actual newer revision above. Proposal awaiting root final GUI QA.

## Action/readback coverage

|Family|Actions present|Elements|Recipe differences|Duplicate planned names|Blank native text|Broken parent input|
|---|---:|---:|---:|---:|---:|---:|
|TS04|12/12|15|0|0|0|0|
|TS06|14/14|19|2|0|0|0|
|TS01|15/15|18|0|0|0|0|
|TS02|13/13|20|0|0|0|0|
|TS08|23/23|27|0|0|0|0|
|TS10|15/15|15|0|0|0|0|
|TS11|26/26|26|0|0|0|0|
|TS17|25/25|25|0|0|0|0|
|TS18|8/8|8|0|0|0|0|

Scope totals151 planned actions. Global ABS504x894 and parent-local logical rectangles, explicit text, parent stable IDs and stored anchor min/max/pivot were compared. Button text was checked in its direct native text child. The JSON records each action and actual ID rather than deriving IDs from root suffixes.

## Short geometry and paired boxes

All new9 families have0 resolver failures and0 screen-outside boxes atH672/894/1091 in this snapshot. Previous TS13/15/16 each retain0 resolver failures at all three heights; TS13 scene remains stretch-x/H214. A positive rectangle does not guarantee no internal overlap.

H672 box comparisons (w x h intersection; zero dimensions mean no area overlap):

|Family/keys|First Y range|Second Y range|Box intersection|
|---|---|---|---:|
|TS06 titlePill / open|45..95|145..375|52x0|
|TS06 titlePill / electric|45..95|145..375|54x0|
|TS06 descriptionPanel / select|407..493|551..615|164x0|
|TS08 go / dismissHint|575..639|634..664|264x5|
|TS11 title / plantEmblem|92..126|73..215|226x34|

TS06 was first observed at r227 with top-fixed titlePill crossing centered cards atH672 and bottom-fixed select crossing centered descriptionPanel by53px. A minimal native candidate is to use center for titlePill/select at design504x894, preserving authored coordinates and all content spacing. If the current paired-box rows above are zero, root has already resolved it; inspect actual transforms in JSON before any further edit.

TS08 go/hint and TS11 title/emblem comparisons are lower-confidence paint-review candidates: button/text/image bounds can intersect even when glyphs or transparent art do not. No automatic numeric movement or product-bug inference is prescribed. Root GUI QA decides whether visible overlap exists.

## Captions, clone cleanup, observed-state boundary

- No extra TS06 rich clone survives: electric direct children are BG_TSV_TS06_electric [element-02194899-045b-4f09-a4e0-e8e6ed8a70fd]; Img_TSV_TS06_electricArt [element-0e4970c5-b104-4cb6-863b-e3b220bd9f3e]; Txt_TSV_TS06_electricText [element-feab2951-3563-45b3-a38b-76b8a771641a]. Its art and text are distinct from open's planned IDs. No blank factory caption or duplicate action name remains.
- Extras are normal BG/native caption text or allowed _Tint alpha leaves. Do not remove labels based on suffix. Existing custom-skin-image CSS can suppress stored opaque BG fills; field appearance alone is not a rendered rectangle defect.
- TS10/11/17 use transparent fullscreen frame input roots, separate backdrop and parent-forwarding descendants as specified. No unnecessary factory BG/Caption or giant green root exists. Their actual runtime route/caller behavior remains root QA.
- TS18 deliberately has no close/continue button or fabricated timing. TS04 retains one observed Damon line; no missing unknown next dialogue is inferred. TS02 partial source body/policy destinations remain unknown; no completion text is fabricated. TS01 loading states and TS08 timer are observed fixture text, not proven live timer/game outcomes. TS06 right-hand description/result remains unknown.
- States are not multiplied into extra family coverage. Full recipe observedStates/notes are preserved per family in JSON, and this audit does not assert source equivalence or interactive state correctness.

## Verification limits

Used actual resolveResponsiveRect and inputOwner helpers at logical504x672/894/1091; these are numerical source/model checks. No DOM/browser/render/input/scroll/asset HTTP/product test or visual-equivalence claim. No UI/source/design/metadata/shared STATUS/report mutations. Only this new MD/JSON pair is written; previous audits remain unchanged.
