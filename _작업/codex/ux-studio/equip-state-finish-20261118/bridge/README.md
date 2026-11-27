# Sliced self-button state image bridge — scratch proposal

작성: codex · 2026-11-18T08:40:15+09:00 · 제안(검수 대기). 공유 source/HMR/model/browser/server/공용 기록 변경 없음.

## Cause and minimal candidate

Current layout-view.mjs:281 passes every button image to renderImagePart. A frame-only owner therefore receives a new plain image on top of its existing sliced skin, rather than changing the sliced texture.

Candidate changes only that callback (modified-layout-view.mjs:281–294, unified patch hunk at original line 281). No import/export or package changes. For a skin owner with no authored image and no region crop, it passes a temporary texture clone into existing applySkin. Source dimensions come from sourceSize, then authored normal texture, then built-in SKIN_ASSETS. Every skin pseudo-state points to the controller's current image to prevent CSS hover/active from overriding it. Undefined restores the original skin. Region states and authored image parts keep raw rendering; transitioning into a region restores the original underlying frame first. Original skin/image/model objects remain unchanged.

Native kind=panel + partRole=frame + interaction.mode=action is covered for both 3/9 slices; kind=button is also covered. No validator/main changes are needed by this candidate.

## Evidence

- red.log: original snapshot, 10 tests; 3 pass, 7 fail with the expected plain-image overlay and skin-source failures. Exit 1.
- green.log: candidate, 10/10 pass. Exit 0.
- region-transition-red.log: intermediate candidate failed sliced→region original-frame restoration; fixed before final GREEN.
- candidate-suite.log: existing full tests/ux-studio suite with candidate injected via temporary Node loader, 544/544 pass. Exit 0.
- syntax.log: node --check candidate exit 0.
- Original source still byte-for-text matches original-layout-view.mjs at final check.

The regression checks real renderLayout, renderImagePart, applySkin, assetSource and button-state controller code. It reuses the Node/fire fixture from tests/ux-studio/control-visual.test.mjs inside an isolated VM; no global document is installed. It checks normal/hover/pressed/selected/disabled, keyboard focus/Enter, CSS source variables, fixed slice/edge values, undefined restore, no model mutation, raw image+separate frame, region crop, sourceSize fallbacks and workspace assetRef resolution.

## Re-run from repository root

```sh
LAYOUT_SOURCE="$PWD/_작업/codex/ux-studio/equip-state-finish-20261118/bridge/original-layout-view.mjs" node --test _작업/codex/ux-studio/equip-state-finish-20261118/bridge/skin-state-bridge.test.mjs
LAYOUT_SOURCE="$PWD/_작업/codex/ux-studio/equip-state-finish-20261118/bridge/modified-layout-view.mjs" node --test _작업/codex/ux-studio/equip-state-finish-20261118/bridge/skin-state-bridge.test.mjs
node --import "$PWD/_작업/codex/ux-studio/equip-state-finish-20261118/bridge/register-loader.mjs" --test tests/ux-studio/*.test.mjs
```

Potential product regression-test destination after root authorization: tests/ux-studio/button-state-sliced-skin.test.mjs. The prototype defaults its project root to process.cwd() and LAYOUT_SOURCE to the live module, so it can run there with node --test from the repo root. No product test file was created. modified-layout-view.mjs uses the original relative imports; use the supplied VM test/loader for scratch execution rather than directly importing that scratch copy.

## Limits and handoff

No browser, real image decoding/loading, CSS cascade/pixel cap rendering, screenshot, native inspector interaction or design-file application was tested. Fixed caps are checked through unchanged slice/edge CSS properties, not visual pixels. Symbolic data URLs exercise reference plumbing only. Existing whole-suite result uses the candidate loader and is not a source deployment. The parent's second dirty-state check, source integration decision and actual UI acceptance remain pending.
