# Tool completion before Monopoly GO implementation plan

> Execution: independent parallel agents, coordinated and reviewed by the parent. User approved continuing the existing plan without another approval gate.

**Goal:** Complete the already planned UI tool capabilities, then immediately build the formal Monopoly GO UI sample. Do not expand the tool scope in anticipation of hypothetical needs.
**Architecture:** Keep the independent DOM/CSS editor and existing GrapesJS 0.23.9 reuse, one document/workspace save contract, and lightweight preview. The full canvas becomes the main workspace after integration; detailed editing keeps the same project/screen/element selection and save context.
**Tech Stack:** Existing JavaScript ESM/DOM/CSS, Node tests, Vite5.4.21, vendored GrapesJS. No new package/engine.
**Spec:** Latest direct user instructions in current chat and src/tools/uxStudio/guide/TOOL_SPEC.md; existing T04 requirements remain source history.

## Latest user steering
- First continue the existing plan. Before final acceptance add consistent basic-tool design, full-canvas/main-workspace cleanup, and always visible selected project name/folder.
- Use multiple agents concurrently to reduce waiting; no duplicate work or other chats.
- Final correction: finish only tool capabilities already in the plan, immediately proceed to formal Monopoly GO UI, and improve issues found during that production. Do not keep extending the feature gate.

## Global constraints
- Canonical root /Users/max/projest_max/ui-studio only. No Kpop runtime/dependency/report authority; do not modify another project.
- Preserve existing sample ux-902404d6 r4 and original ux-gjs-61ad2d1f r14; no silent conversion or deletion.
- Existing-game conversion requires explicit user choice; independent choice preserves game files.
- Account-wide weekly10080min usage >=90% or lookup failure stops production. Current61%. No reset/purchase/automation resume.
- Protected play.html never read/search/hash/modify. Mono readonly. No external messages/publication/payment/secrets/server restarts/builds/new packages.
- Parent alone updates collaboration STATUS/report. Existing files backed up under docs/planning/_backup/20261116_단이/ before changes.
- Tests and source inspection are distinct from actual browser acceptance. W/P/U/S0/4 remains until representative acceptance.

## Scope and transition gate
The tool gate covers the existing planned capabilities: reusable image storage, actual input values/events and states, parent/layout/scroll/clip/size rules, prototype navigation/overlay/state handling, canvas/property editing, stage snapshots/storyboard/handoff and existing project safety. This is not full Figma or full Unity engine parity. Advanced engine exporters/3D/unrelated device platforms are not new prerequisites.
Formal UI begins as soon as these planned capabilities have concrete acceptance results or an explicit recorded unsupported boundary that does not prevent the current sample. Do not treat empty folders/test counts as finished game UI.

## Parallel batch1 (independent file ownership)
### A: Workspace assets
Own asset-store/reference modules, save-plugin/workspace-store, parts/skins image validation, image import handlers and image rendering only. Coordinates any main.mjs/layout-view edit with parent; other workers will not touch these image blocks.
- [ ] Safe content-addressed PNG/JPEG/WebP storage/list/read under selected workspace assets; legacy data URI support stays.
- [ ] Reference contract and workspace-scoped render URLs; no arbitrary absolute paths, cross-project reads/writes or symlink escape.
- [ ] Import image via tool into asset storage; save/reopen reference and show missing-file errors. Copying designs across folders preserves required assets or explicitly refuses without corrupting sources.
- [ ] Meaningful tests for persistence, missing/wrong media, traversal/symlink and workspace isolation; preserve revision conflicts.

### B: Full canvas and project identity
Own grapes-pilot.html/mjs, new canvas CSS/context helper and related canvas tests. Do not edit main.mjs/layout-view/model/parts/save backend.
- [ ] Match existing basic editor colors/spacing/type/buttons/panels.
- [ ] Consolidate visible toolbar: selection/hand, zoom/fit, undo/redo, save/preview, project/guide; move diagnostic/local-stage/directional/numeric-board tools to details.
- [ ] Always show project name, selected folder path, design name/revision/dirty; common storage/tool root/sample are different labels.
- [ ] Full canvas displays common geometry/text/behavior properties; detailed edit links carry workspace/project/screen/element, preserve dirty choices.
- [ ] Prepare main-workspace navigation; parent switches canonical entry only after safe integration.
- [ ] Scope/dirty/link/roundtrip tests; parent actual browser check.

### C: Real controls and runtime state
Own new controls module, units.mjs, model.mjs, consumer.mjs and control tests; leave parts/skins/layout-view/main/grapes files to A/B/parent.
- [ ] Typed validated config for toggle, toggle/tab groups, slider/scrollbar, dropdown, text input with initial/value/min/max/options/validation as appropriate.
- [ ] Native keyboard/pointer behavior and value-change events distinct from shape presets and design editor controls.
- [ ] Value state scopes to screen/element, group exclusivity, disabled/readonly validation; values reach host notifications and prototype state without becoming game source writes.
- [ ] Renderer attachment contract reusable by basic editor, consumer and canvas; parent integrates shared layout after asset worker.
- [ ] Tests validate values, group transitions, malformed config, disabled behavior and event payload.

## Subsequent planned batches (no new scope)
- [ ] Integrate shared renderer/control property form and image paths; anchor/pivot/scaling/safe-area/layout/clip/scroll planned public contracts and corresponding controls.
- [ ] Prototype conditions/payload/return-state, nested modal/sheet/nonmodal toast/help, Esc/focus/queue/motion interruption and configured states.
- [ ] Connect full-canvas properties with detailed editor; canonical main entry and project identity across editor/canvas/preview.
- [ ] Complete W/P/U snapshots + clickable storyboard + AI source mapping/export; scenario replay/audit and documentation of supported boundaries.
- [ ] One final integration test batch and actual1440/430 checks with measured screenshot sizes; record concrete missing items, not extra hypothetical features.
- [ ] Immediately transition to formal Monopoly GO HUD + connected3pages/modal, then observed UI type samples. Read Figma original, create separated assets/components, compare original and actual preview, preserve W/P/U/S evidence.

## Review focus
- Folder switch while save/import pending cannot alter another document or report success incorrectly.
- Design copy cannot reference source-folder assets silently.
- Keyboard input inside fields must not trigger editor selection/delete/pan shortcuts.
- Dirty full-canvas edits must survive detail navigation cancellation; no different workspace/source revision local-stage restoration.
- Small display and large documents must preserve access to save/project/guide while avoiding duplicate control DOM.

## Verification
Each owner runs its relevant Node tests and syntax checks, reports exact commands/counts and changed files. Parent reviews ownership diffs, runs npm test once after integration, then checks actual browser project identity, image save/reopen, control values, navigation/modal and canvas/detail roundtrip. No commits unless repository setup and user scope support it; this standalone root currently has no Git repository.
