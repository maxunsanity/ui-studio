# Existing4 normal UI fix recipe v2

Proposal awaiting root execution and GUI review. Current source readback r266 (2026-11-19T04:03:01.951Z), SHA3937e2df169ba5f37755f464e7b30f5cee2d3e01e1a9d12b0aff8a42d53e3192; original r64 audit and original recipe are preserved. This is an independent action recipe, never a saved-model patch/import.

## Exact scope

Preserve the original49 required creation actions byte-for-structure and add only12 TS25 glyph leaves: total61 creation actions. Existing metadata edits24 and original optional actions2 are counted separately. No UI/source/design/shared STATUS/report was changed by this recipe task.

|Family|Required creation|Existing metadata edits|Optional|
|---|---:|---:|---:|
|TS03|15|2|1|
|TS25|37|18|0|
|TS05|8|3|0|
|TS07|1|1|1|

Deletion is restricted to these two exact leaf images:

- TS03 element-ef783622-78d2-4242-af0e-25db38834f18 (Img_TSV_TerritoryScene), expected sha256-ac8252341468ca1144c8db05c6b37839a5a75b52315463c0669b1ee71a85a438.webp, child count0; retain asset and every other element.
- TS05 element-1314bf62-e3ec-48cc-b37e-f4bf6ba599c1 (Img_TSV_Building_Greenhouse), expected sha256-b72852dcd6e61f3dc2a5a897f953b2199f5e99df4b7de70c5df221e6a6bbec39.webp, child count0; retain asset and every other element.

Keep main HUD/Nav/GemShop/Building input and their descendants. In Building keep group-72ca6f64-54b6-4624-9169-f1d3a613f4ef and existing BG/Txt IDs element-969b2f9b-2a75-4666-ba11-6c8c12fa207d / element-9af74eeb-9785-4833-950a-ea1b86204310. Empty3D goes behind preserved2D UI. Upgrade's current default modal screen.skin is preserved; it differs from historical r64 while its43 existing elements remain unchanged.

## Prepared glyphs now replace old missing flags

Registered asset sha256-6f3d559bc3cfa1400301ffd57a5dc6e0d2c15116b1db5d8ba72542b45260e09d.png, 256x128, 20050B. Exact source/staging SHA matches manifest; TS26 already references the same atlas. Reuse its native workspace ref rather than importing again.

|New action|Existing owner|ABS504x894 rect|Atlas cell|
|---|---|---|---|
|roleGlyph01|group-3a3f4494-0292-4bde-8fc6-bed0dee78c98|22,119,16,16|128,0,64,64 (role-rifle)|
|roleGlyph02|group-6b1224b0-e311-4258-830b-cce77ed90ec5|141,119,16,16|192,0,64,64 (role-pistol)|
|roleGlyph03|group-a767b9e3-a826-49c7-b6cc-8ec6004e3ff8|260,119,16,16|0,64,64,64 (role-shield)|
|roleGlyph04|group-d0d58b5b-070f-4b17-83bd-5e0b87d43085|379,119,16,16|128,0,64,64 (role-rifle)|
|roleGlyph05|group-c9d72508-b73c-41af-81c5-f1aaf702fd78|22,309,16,16|0,64,64,64 (role-shield)|
|roleGlyph06|group-dd7ddd7a-20fd-45ba-b840-199529f425b5|141,309,16,16|192,0,64,64 (role-pistol)|
|roleGlyph07|group-d50577c2-0a10-4410-baa4-7d2b187572e2|260,309,16,16|192,0,64,64 (role-pistol)|
|roleGlyph08|group-7d21ad75-7ee0-4079-b75e-26a2cffe66a9|379,309,16,16|0,64,64,64 (role-shield)|
|roleGlyph09|group-97c417a3-a719-4a8a-83f7-2051db1dea85|22,499,16,16|192,0,64,64 (role-pistol)|
|roleGlyph10|group-e8df7c88-12c9-4a89-8368-d80c3e9ec891|141,499,16,16|192,0,64,64 (role-pistol)|
|roleGlyph11|group-6b46efcc-41b8-4c04-9c67-a43cbe1392e6|260,499,16,16|0,64,64,64 (role-shield)|
|hero02GrowthUp|group-6b1224b0-e311-4258-830b-cce77ed90ec5|227,248,15,23|64,64,64,64 (growth-up-green)|

Source silhouette map directly checked in TS25-R01 and art-v003: rifle,pistol,shield,rifle,shield,pistol,pistol,shield,pistol,pistol,shield. Placement uses source card layout plus manifest size as a native production proposal; root must compare actual alpha/glyph spacing. Green up is display-only under Card02; do not invent a separate upgrade action/API. Existing levels/shards/counts stay unchanged. These new glyphs are prepared/registered, not yet applied to TS25 by this reviewer.

## Required source gaps and optional boundary

- Event gorilla, two right quick icons and full425s quest copy still lack matched art/copy. Do not substitute ogre/gem/medal or TS26 book/list icons just because available.
- Chat preview is observed in another TS03 catalog state (region0,783,504,48). The425s quest recipe occupies776..822. Do not combine both or invent transcript/line count in this state; its separate state remains deferred.
- Optional questFragment is only the previously observed incomplete fragment and still needs root fixture choice. Optional TS07 3D label requires standalone inspection first; neither optional action is automatically executed.
- Earned-rank fill remains unconfirmed; six base diamonds are geometry only. Furniture per-card dot counts/disabled fixture remain source-zoom pending.
- Existing hero filter/card IDs and geometry remain. All initial selected/other three unselected is the observed fixture. Real single-choice selection/skin must be set and verified using loaded native controls; independent button toggles do not establish exclusive filtering. No guessed card-filter results or new hidden duplicate controls.
- Body clipboard/engineer is new role-appropriate art, not original character identity equivalence. Preserve the existing note about clip protrusion and source unknown destination.

## Smallest normal UI execution

1. Preflight: Open current same workspace/project in design504x894. Confirm current IDs, names and both exact image delete guards. Existing later screens are untouched.

2. TS03: Delete only guarded Territory image, add stage+3D label then send stage behind all preserved roots. Run old15 actions and current existing owner edit. Event/quick art remains partial; optional quest fragment is still opt-in.

3. TS25: Keep11 existing card owners and4 filter owners. Apply old25 leaf actions/status offsets. Reuse registered glyph ref for new12 leaves; all display leaves forward input to their preserved card. Configure observed selection fixture only with a supported normal native control path.

4. TS05: Delete only guarded greenhouse image. Preserve Scene/levelBG/Txt, add old8 stage/clipboard leaves, fix ResourceHUD to335x29/top. Do not guess furniture dot counts/disabled state.

5. TS07: Add old originalDuration text and preserve Confirm transition/Escape/dim/current screen skin. Original standalone3D label is optional only after checking current standalone sample; no new X.

6. Readback/QA: After each family verify names/IDs/parent/global+local rects/native text/caption guards and save. Then check logicalH672/894/1091, current scroll/fixedHUD, input chain, source state and actual visual differences. This plan is not a completion claim.

The JSON contains all original49 exact operations/IDs plus12 additions, guarded removals, state requirements and current preflight. Readback before each native edit because root is assembling later families concurrently. Existing scenes/cards/filters are never duplicated wholesale. Factory caption cleanup must preserve explicit action-owned text and should use current helper guards.

Verification performed here: original49 deep equality, supported image/plain/text/button/panel ops, unique action keys, topological/existing parent resolution, positive rects, asset SHA/registered file and two exact leaf-removal guards. No GUI/DOM/keyboard/touch/render/input/source-equivalence test was performed. All outputs remain proposals awaiting root QA.
