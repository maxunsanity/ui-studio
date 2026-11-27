# Standalone selected-screen editor — scratch proposal

작성: codex · 2026-11-18T09:03:36+09:00 · 제안(검수 대기). 공유 source/HMR/model/서버/브라우저 변경 없음. 이 editor/ 하위만 작성했습니다.

## Fresh baseline

original-main.mjs SHA256: d73fabfab8aca48c623dc9dd2cfce8a94dd50c3cad55c4b8edb287a1827c1e98. Fresh source and final shared-source check both matched this value. The already integrated compact export line is preserved in the candidate.

## Candidate changes

- main header line 377: saved sample link goes to /ui-studio/sample.html?project=...&screen=selectedScreen, using scopeURL for workspace. Label: 저장 샘플 보기 ↗. Existing runtime preview link moves to the file/share menu, labelled 동작 시험 보기 ↗. No extra button or HTML/module file created.
- renderPreview line 588: edit viewport basis is the selected screen; play still uses runtime.page.
- lines 599/603: unchanged page-only canvas reuse is maintained, and edit ignores stale demo composition markers. Nonpage screens rebuild their own root.
- lines 619–629: edit nonpage renders only a self panel inside previewScreen, without rendering previewBase or creating modal-backdrop. Window roots use overlayRootSize with explicit centered pixel geometry. Fullscreen roots use applyOverlayRoot and the entire selected logical canvas.
- lines 644/674–677: edit never composes demoOverlay; its editor receives the same self-root dimensions used for rendering. Existing play overlay drawing, dimming and input blocking remain active.
- detailDevicePreview at line 2642 uses the screen itself in edit and runtime backing page for nonpage play, so rootSize and viewport agree. No imports, model fields, transitions, IDs or runtime engine implementation changed.

## RED → GREEN

- red.log: original, 10 tests; 3 pass / 7 expected failures. Edit modal/sheet/toast incorrectly contained base-only UI; viewport basis was 551 instead of selected 700; stale demo composed a third screen; sample link absent. Exit 1.
- green.log: candidate 10/10 pass. Exit 0.
- syntax.log: node --check modified-main.mjs, exit 0.

The isolated VM reuses the Node/Event fixture from tests/ux-studio/control-visual.test.mjs and the existing main render/helper extraction style. It runs actual layout-view rendering, applyOverlayRoot, canvasDevicePreview, overlayRootSize, drawOverlay and syncOverlayFocus with an isolated document, not a global DOM. Assertions inspect actual UI element IDs/screen ownership, absence of backdrop/runtime overlay IDs in edit, window/fullscreen root styles, independent design/phone dimensions, page canvas/node reuse, selection/model/ID preservation, stale demo suppression, play base+dim+overlay and base inertness, and selected-screen/workspace URL output.

## Re-run

Run from repository root:

```sh
MAIN_SOURCE="$PWD/_작업/codex/ux-studio/equip-state-finish-20261118/standalone/editor/original-main.mjs" node --test _작업/codex/ux-studio/equip-state-finish-20261118/standalone/editor/editor-standalone.test.mjs
MAIN_SOURCE="$PWD/_작업/codex/ux-studio/equip-state-finish-20261118/standalone/editor/modified-main.mjs" node --test _작업/codex/ux-studio/equip-state-finish-20261118/standalone/editor/editor-standalone.test.mjs
```

Potential product regression-test destination after root authorization: tests/ux-studio/editor-standalone.test.mjs. No product test was written.

## Integration notes and limits

Existing tests/ux-studio/detail-overlay-dim.test.mjs explicitly requires a backdrop in EDIT mode. That acceptance criterion conflicts with the new direct user request and must be updated to selected-screen-only editing; runtime dim policy should remain covered under play. Older custom renderPreview VM scopes for nonpage fixtures will also need overlayRootSize supplied if they do not load actual helpers.

No browser/CSS pixel render, native editor dragging, screenshot, sample viewer HTML/module or core-agent files were touched or tested here. The full repository suite was not rerun because it creates temporary files outside this assigned editor/ subtree and includes the superseded edit-backdrop test. Root retains source integration, affected old-test updates, combined sample-viewer checks and real UI acceptance. Explicit effect/demo composition is now confined to play; stale edit demo state stays stored but cannot draw another screen.
