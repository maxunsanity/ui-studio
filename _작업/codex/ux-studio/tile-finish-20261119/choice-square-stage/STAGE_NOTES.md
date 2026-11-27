# Optional choice marker / native input appearance — stage only

Prepared 2026-11-19T11:02:31+09:00. Product source integration and native visual QA remain with root.

Apply `choice-square.patch` first and `input-appearance.patch` second from the product root, after root backup and a safe saved UI checkpoint. No source, design JSON, project metadata, native UI, shared STATUS or reports were changed by this subtask. `model.mjs` and existing tests in stage are unchanged validation harness copies; other module symlinks resolve to the original read-only dependencies.

## Primary patch

- Product files: `src/tools/uxStudio/controls.mjs`, `control-inspector.mjs`, `styles.css`.
- New test file: `tests/ux-studio/choice-square.test.mjs` (8 tests).
- Optional `choiceShape: native|square`, finite numeric `choiceSize: 8..96`, six-digit HEX `choiceColor` are accepted only on toggle / toggle-group. Existing documents and default control presets do not gain new fields.
- Inspector offers shape / optional numeric size / optional color. Blank size and color remove only their optional field. No main.mjs change is needed: existing native field change handling calls applyControlConfig.
- The engine sets `data-choice-shape=square` only on explicitly square native checkbox/radio fields. Radio type/name and single selection semantics remain intact. Marker size includes matching font size so its CSS check scales with it. Appearance fill/stroke/strokeWidth/radius style the marker background/border/corners; choiceColor styles the check. Switching to native clears all marker inline styles on the same reused input.
- Default square size18px is a generic fallback only. No source/game IDs or 32px/green runtime defaults were introduced. Root should configure the observed source's intended size/color through native UI.

## Secondary patch

- Adds to `controls.mjs` only, plus `tests/ux-studio/input-appearance.test.mjs` (2 tests).
- Native text input applies existing appearance fill/stroke/textColor/strokeWidth/radius and inherits the surrounding font when appearance is present. Removing appearance clears owned styles. Inputs without appearance and all other control types keep existing default field styles. Width/height, value, maxLength, identity and caret are preserved.

## Evidence

- Primary RED: 7 tests, 2 pass / 5 fail for missing validator/config/inspector/render behavior (`evidence/primary-red.log`).
- Follow-up scale / hidden foreign config RED: 8 tests, 6 pass / 2 fail (`evidence/primary-scale-red.log`).
- Primary related GREEN: 37/37 (`evidence/primary-green.log`).
- Secondary RED: 2 tests, 1 pass / 1 fail for missing input appearance (`evidence/secondary-red.log`).
- Combined related GREEN: 39/39, exit0 (`evidence/combined-green.log`, exact commands and return codes in `evidence/verified-checks.json`).
- Existing unchanged product baseline: `npm test`, 686/686, exit0 (`evidence/product-baseline.log`). This is baseline coverage, not a full integrated feature run.
- Both patch files passed `git apply --check --whitespace=error`; staged controls/inspector passed `node --check`. Product controls/inspector/styles/model were byte-identical to captured baselines at this verification point. Hashes: `evidence/stage-manifest.json`.

## Remaining

Root must run the full product test suite after integration and native UI checks for square painting/focus/disabled/choice toggling, optional inspector editing, input appearance and saved/reopened values. This task did not browse or paint the CSS; DOM unit checks do not establish pixel appearance or Unity compatibility. No image generation, packages, build/server restart/watch/automation or source-specific gameplay was added.

## Final radius refinement

Root requested existing appearance.radius to also control the square marker corners. Added no property or UI. Explicit radius5 produces borderRadius5px; omitted radius preserves the square0px default; native restoration clears borderRadius on the same reused input. The expanded render/reset test first failed (radius-red.log:8 tests,7 pass/1 fail), then the final combined run passed39/39 with exit0. Both patch dry-runs pass and product source remains byte-identical to baseline. The CSS zero-radius fallback remains; the optional inline appearance radius overrides it.
